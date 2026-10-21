const crypto = require("node:crypto");
const https = require("node:https");
const hash = data => crypto.createHash("sha256").update(data).digest("hex");
const definite = message => Object.assign(new Error(message), { definiteFailure: true });

function request(url, options = {}, body) {
  return new Promise((resolve, reject) => {
    const timeout = options.timeout || 20000;
    let timer;
    const finish = (fn, value) => { clearTimeout(timer); fn(value); };
    const req = https.request(url, Object.assign({ timeout }, options), res => {
      const parts = []; let size = 0;
      res.on("data", part => { size += part.length; if (size > 8 * 1024 * 1024) req.destroy(new Error("response-too-large")); else parts.push(part); });
      res.on("error", error => finish(reject, error));
      res.on("end", () => finish(resolve, { status: res.statusCode, headers: res.headers, body: Buffer.concat(parts) }));
    });
    // Absolute wall time, including DNS/TLS and slow responses. Socket idle
    // timeouts alone do not bound an upstream that keeps sending small chunks.
    timer = setTimeout(() => req.destroy(new Error("upstream-outcome-unknown")), timeout);
    req.on("timeout", () => req.destroy(new Error("upstream-outcome-unknown")));
    req.on("error", error => finish(reject, error));
    if (body) req.write(body);
    req.end(); // No automatic retry for chargeable operations.
  });
}

function createProvider(env, dependencies = {}) {
  const send = dependencies.request || request;
  const COS = dependencies.COS || require("cos-nodejs-sdk-v5");
  const png = dependencies.PNG || require("pngjs").PNG;
  const jpeg = dependencies.jpeg || require("jpeg-js");
  const appId = env.PHOTO_APP_ID, merchantId = env.PHOTO_MERCHANT_ID;
  const host = env.PHOTO_COS_BUCKET + ".cos." + env.PHOTO_COS_REGION + ".myqcloud.com";
  if (!/^[a-z0-9-]+-\d+\.cos\.[a-z0-9-]+\.myqcloud\.com$/.test(host)) throw new Error("invalid-private-bucket");
  const secretId = env.PHOTO_COS_SECRET_ID, secretKey = env.PHOTO_COS_SECRET_KEY;
  function cosUrl(key, query = {}) {
    return "https://" + host + "/" + key.split("/").map(encodeURIComponent).join("/") + (Object.keys(query).length ? "?" + new URLSearchParams(query) : "");
  }
  function cosAuth(key, method, query = {}, headers = {}) {
    return COS.getAuthorization({ SecretId: secretId, SecretKey: secretKey, Method: method,
      Pathname: "/" + key, Query: query, Headers: Object.assign({ host }, headers), Expires: 300 });
  }
  async function cos(key, method, query = {}, body, headers = {}) {
    return send(cosUrl(key, query), { method, headers: Object.assign({}, headers, { Authorization: cosAuth(key, method, query, headers) }) }, body);
  }
  function verifySignature(headers, raw) {
    const stamp = headers["wechatpay-timestamp"], nonce = headers["wechatpay-nonce"];
    if (headers["wechatpay-serial"] !== env.PHOTO_PAY_PLATFORM_SERIAL || !stamp || !nonce || Math.abs(Date.now() / 1000 - Number(stamp)) > 300) throw new Error("unverified-payment-response");
    const valid = crypto.verify("RSA-SHA256", Buffer.from(stamp + "\n" + nonce + "\n" + raw + "\n"), env.PHOTO_PAY_PLATFORM_PUBLIC_KEY,
      Buffer.from(headers["wechatpay-signature"] || "", "base64"));
    if (!valid) throw new Error("unverified-payment-signature");
  }
  async function pay(method, path, value) {
    const body = value ? JSON.stringify(value) : "", stamp = String(Math.floor(Date.now() / 1000)), nonce = crypto.randomBytes(16).toString("hex");
    const sign = crypto.sign("RSA-SHA256", Buffer.from(method + "\n" + path + "\n" + stamp + "\n" + nonce + "\n" + body + "\n"), env.PHOTO_PAY_PRIVATE_KEY).toString("base64");
    const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${merchantId}",nonce_str="${nonce}",timestamp="${stamp}",serial_no="${env.PHOTO_PAY_SERIAL}",signature="${sign}"`;
    const r = await send("https://api.mch.weixin.qq.com" + path, { method, headers: { Authorization: authorization, Accept: "application/json", "Content-Type": "application/json", "User-Agent": "GuokaoPhoto/1.0" } }, body);
    verifySignature(r.headers, r.body.toString("utf8"));
    if (r.status < 200 || r.status >= 300) {
      const error = r.body.length ? JSON.parse(r.body.toString("utf8")) : {};
      if (method === "GET" && path.startsWith("/v3/pay/transactions/out-trade-no/") && error.code === "ORDER_NOT_EXIST") return { trade_state: "NOTPAY" };
      if (method === "GET" && path.startsWith("/v3/refund/domestic/refunds/") && error.code === "RESOURCE_NOT_EXISTS") return { status: "NOT_FOUND" };
      throw new Error("payment-channel-request-failed");
    }
    return r.body.length ? JSON.parse(r.body.toString("utf8")) : {};
  }
  function decodeResult(body, expected) {
    if (!body || body.length < 33 || body.readUInt32BE(0) !== 0x89504e47) throw definite("invalid-result-file");
    const w = body.readUInt32BE(16), h = body.readUInt32BE(20);
    if (w < 1 || h < 1 || w * h > 1000000 || w > 1000 || h > 1000 || (expected && (w !== expected.width || h !== expected.height))) throw definite("result-dimensions-mismatch");
    const decoded = png.sync.read(body);
    let visible = false;
    for (let i = 3; i < decoded.data.length; i += 4) if (decoded.data[i] > 0) { visible = true; break; }
    if (!visible) throw definite("empty-transparent-result");
    return { sha256: hash(body), width: w, height: h };
  }
  return {
    async preparePayment(o) {
      const r = await pay("POST", "/v3/pay/transactions/jsapi", { appid: appId, mchid: merchantId, description: "AI 换背景一次", out_trade_no: o.id,
        time_expire: new Date(o.createdAt + 30 * 60000).toISOString(), notify_url: env.PHOTO_PAY_NOTIFY_URL,
        amount: { total: 100, currency: "CNY" }, payer: { openid: o.owner } });
      const timeStamp = String(Math.floor(Date.now() / 1000)), nonceStr = crypto.randomBytes(16).toString("hex"), pkg = "prepay_id=" + r.prepay_id;
      return { timeStamp, nonceStr, package: pkg, signType: "RSA", paySign: crypto.sign("RSA-SHA256", Buffer.from(appId + "\n" + timeStamp + "\n" + nonceStr + "\n" + pkg + "\n"), env.PHOTO_PAY_PRIVATE_KEY).toString("base64") };
    },
    async queryPayment(o) {
      const r = await pay("GET", "/v3/pay/transactions/out-trade-no/" + o.id + "?mchid=" + encodeURIComponent(merchantId));
      return { paid: r.trade_state === "SUCCESS", amount: r.amount && r.amount.total, currency: r.amount && r.amount.currency, appId: r.appid, merchantId: r.mchid,
        owner: r.payer && r.payer.openid, orderId: r.out_trade_no, transactionId: r.transaction_id };
    },
    async uploadPermission(o) {
      const headers = { "content-type": "image/jpeg", "content-length": String(o.inputBytes) };
      return { url: cosUrl(o.inputKey) + "?" + cosAuth(o.inputKey, "PUT", {}, headers), expiresIn: 300, maximumBytes: o.inputBytes, headers: { "content-type": "image/jpeg" } };
    },
    async process(o) {
      const input = await cos(o.inputKey, "GET");
      if (input.status !== 200 || hash(input.body) !== o.inputHash) throw definite("input-hash-mismatch");
      // Bound decoded allocation before invoking a codec, including malformed headers.
      let at = 2, dimensions;
      if (input.body[0] !== 255 || input.body[1] !== 216) throw definite("invalid-input");
      while (at + 4 < input.body.length) {
        if (input.body[at++] !== 255) throw definite("invalid-input");
        const marker = input.body[at++], length = input.body.readUInt16BE(at);
        if (length < 2 || at + length > input.body.length || marker === 0xe1) throw definite("invalid-input-metadata");
        if ([0xc0, 0xc2].includes(marker)) { dimensions = { width: input.body.readUInt16BE(at + 5), height: input.body.readUInt16BE(at + 3) }; break; }
        at += length;
      }
      if (!dimensions || dimensions.width < 1 || dimensions.height < 1 || dimensions.width > 1000 || dimensions.height > 1000 || dimensions.width * dimensions.height > 1000000) throw definite("invalid-input-dimensions");
      try { jpeg.decode(input.body, { useTArray: true, maxResolutionInMP: 1, maxMemoryUsageInMB: 32 }); }
      catch (_) { throw definite("invalid-input-jpeg"); }
      const response = await cos(o.inputKey, "GET", { "ci-process": "AIPortraitMatting", "center-layout": "0", "padding-layout": "0x0" });
      if (response.status !== 200) throw new Error("ai-outcome-unknown");
      const result = decodeResult(response.body, dimensions);
      const saved = await cos(o.resultKey, "PUT", {}, response.body, { "Content-Type": "image/png", "x-cos-meta-input-sha256": o.inputHash });
      if (saved.status < 200 || saved.status >= 300) throw new Error("result-persistence-unknown");
      return Object.assign(result, { requestId: response.headers["x-cos-request-id"] || null });
    },
    async findSavedResult(o) {
      const r = await cos(o.resultKey, "GET");
      if (r.status === 404) return null;
      if (r.status !== 200 || r.headers["x-cos-meta-input-sha256"] !== o.inputHash) throw new Error("unverified-saved-result");
      return decodeResult(r.body);
    },
    async resultPermission(o) { return { url: cosUrl(o.resultKey) + "?" + cosAuth(o.resultKey, "GET"), expiresIn: 300 }; },
    async deleteInput(o) { const r = await cos(o.inputKey, "DELETE"); if (![200, 204, 404].includes(r.status)) throw new Error("cleanup-pending"); },
    async cleanup(o, resultExpired) {
      const a = await cos(o.inputKey, "DELETE");
      let deleted = !!o.resultDeleted;
      if (resultExpired) { const b = await cos(o.resultKey, "DELETE"); deleted = [200, 204, 404].includes(b.status); }
      return { inputDeleted: [200, 204, 404].includes(a.status), resultDeleted: deleted };
    },
    async refund(o) { return pay("POST", "/v3/refund/domestic/refunds", { out_trade_no: o.id, out_refund_no: o.refundId, reason: "未取得可交付处理结果", amount: { refund: 100, total: 100, currency: "CNY" } }); },
    async queryRefund(o) { const r = await pay("GET", "/v3/refund/domestic/refunds/" + o.refundId); return { state: r.status }; },
    verifyNotification(headers, raw) {
      verifySignature(headers, raw);
      const r = JSON.parse(raw).resource;
      if (!r || r.algorithm !== "AEAD_AES_256_GCM") throw new Error("invalid-notification");
      const content = Buffer.from(r.ciphertext, "base64"), decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(env.PHOTO_PAY_API_V3_KEY), Buffer.from(r.nonce));
      decipher.setAuthTag(content.subarray(-16)); decipher.setAAD(Buffer.from(r.associated_data || ""));
      return JSON.parse(Buffer.concat([decipher.update(content.subarray(0, -16)), decipher.final()]).toString("utf8"));
    }
  };
}
module.exports = { createProvider, request };
