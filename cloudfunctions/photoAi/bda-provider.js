const crypto = require("node:crypto");
const { request } = require("./providers");

const ENDPOINT = "bda.tencentcloudapi.com";
const SERVICE = "bda";
const ACTION = "SegmentPortraitPic";
const VERSION = "2020-03-24";
const MAX_BASE64_BYTES = 5 * 1024 * 1024;
const RESULT_TTL_MS = 30 * 60 * 1000;
const RESULT_SAFETY_MS = 60 * 1000;

const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");
const hmac = (key, value, encoding) => crypto.createHmac("sha256", key).update(value).digest(encoding);
const definite = (message, code) => Object.assign(new Error(message), { definiteFailure: true, code: code || null });

function inspectJpeg(data) {
  if (!data || data.length < 16 || data[0] !== 0xff || data[1] !== 0xd8) throw definite("invalid-input-jpeg");
  let at = 2;
  while (at + 4 <= data.length) {
    if (data[at++] !== 0xff) throw definite("invalid-input-jpeg");
    let marker = data[at++];
    while (marker === 0xff && at < data.length) marker = data[at++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (at + 2 > data.length) throw definite("invalid-input-jpeg");
    const length = data.readUInt16BE(at);
    if (length < 2 || at + length > data.length) throw definite("invalid-input-jpeg");
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      if (length < 8) throw definite("invalid-input-jpeg");
      return { width: data.readUInt16BE(at + 5), height: data.readUInt16BE(at + 3) };
    }
    at += length;
  }
  throw definite("invalid-input-jpeg");
}

function validateResultUrl(value) {
  if (typeof value !== "string" || value.length < 20 || value.length > 8192) throw definite("bda-result-url-missing");
  let url;
  try { url = new URL(value); } catch (_) { throw definite("bda-result-url-invalid"); }
  if (url.protocol !== "https:" || url.username || url.password) throw definite("bda-result-url-invalid");
  const host = url.hostname.toLowerCase();
  if (!(host === "myqcloud.com" || host.endsWith(".myqcloud.com"))) throw definite("bda-result-host-unexpected");
  return url.toString();
}

function decodePng(body, expected, PNGImpl) {
  if (!body || body.length < 33 || body.readUInt32BE(0) !== 0x89504e47) throw definite("invalid-result-file");
  const width = body.readUInt32BE(16), height = body.readUInt32BE(20);
  if (!width || !height || width >= 2000 || height >= 2000 || width * height > 1000000) throw definite("invalid-result-dimensions");
  if (expected && (width !== expected.width || height !== expected.height)) throw definite("result-dimensions-mismatch");
  let decoded;
  const codec = PNGImpl || require("pngjs").PNG;
  try { decoded = codec.sync.read(body); } catch (_) { throw definite("invalid-result-png"); }
  let visible = false, transparent = false;
  for (let i = 3; i < decoded.data.length; i += 4) {
    if (decoded.data[i] > 0) visible = true;
    if (decoded.data[i] < 255) transparent = true;
    if (visible && transparent) break;
  }
  if (!visible) throw definite("empty-transparent-result");
  if (!transparent) throw definite("result-has-no-transparency");
  return { sha256: sha256(body), width, height };
}

function authorization(secretId, secretKey, region, timestamp, payload) {
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const contentType = "application/json; charset=utf-8";
  const canonicalHeaders = "content-type:" + contentType + "\n" + "host:" + ENDPOINT + "\n";
  const signedHeaders = "content-type;host";
  const canonicalRequest = ["POST", "/", "", canonicalHeaders, signedHeaders, sha256(payload)].join("\n");
  const scope = date + "/" + SERVICE + "/tc3_request";
  const stringToSign = ["TC3-HMAC-SHA256", timestamp, scope, sha256(canonicalRequest)].join("\n");
  const dateKey = hmac("TC3" + secretKey, date);
  const serviceKey = hmac(dateKey, SERVICE);
  const signingKey = hmac(serviceKey, "tc3_request");
  const signature = hmac(signingKey, stringToSign, "hex");
  return "TC3-HMAC-SHA256 Credential=" + secretId + "/" + scope + ", SignedHeaders=" + signedHeaders + ", Signature=" + signature;
}

function createBdaProvider(env, dependencies = {}) {
  const send = dependencies.request || request;
  const now = dependencies.now || Date.now;
  const secretId = env.PHOTO_BDA_SECRET_ID;
  const secretKey = env.PHOTO_BDA_SECRET_KEY;
  const region = env.PHOTO_BDA_REGION;
  const token = env.PHOTO_BDA_SESSION_TOKEN || "";
  const PNGImpl = dependencies.PNG || require("pngjs").PNG;
  const jpegImpl = dependencies.jpeg || require("jpeg-js");
  if (![secretId, secretKey, region].every(value => typeof value === "string" && value.length > 0)) throw new Error("bda-credentials-not-configured");

  async function prepareInput(order, input) {
    if (!input || typeof input.imageBase64 !== "string" || input.imageBase64.length > MAX_BASE64_BYTES || input.imageBase64.length % 4 !== 0) throw definite("bda-input-size-invalid");
    let data;
    try { data = Buffer.from(input.imageBase64, "base64"); } catch (_) { throw definite("bda-input-base64-invalid"); }
    if (!data.length || data.toString("base64") !== input.imageBase64 || data.length !== order.inputBytes || sha256(data) !== order.inputHash) throw definite("bda-input-identity-mismatch");
    const dimensions = inspectJpeg(data);
    if (dimensions.width >= 2000 || dimensions.height >= 2000 || dimensions.width * dimensions.height > 1000000) throw definite("bda-input-dimensions-invalid");
    if (order.inputWidth !== dimensions.width || order.inputHeight !== dimensions.height) throw definite("bda-input-dimensions-mismatch");
    try { jpegImpl.decode(data, { useTArray: true, maxResolutionInMP: 1, maxMemoryUsageInMB: 32 }); }
    catch (_) { throw definite("bda-input-decode-failed"); }
    return { imageBase64: input.imageBase64, dimensions };
  }

  async function process(order, prepared) {
    if (!prepared || !prepared.imageBase64) throw definite("bda-input-missing");
    const payload = JSON.stringify({ Image: prepared.imageBase64, RspImgType: "url", Scene: "GEN" });
    const timestamp = Math.floor(now() / 1000);
    const headers = {
      Authorization: authorization(secretId, secretKey, region, timestamp, payload),
      "Content-Type": "application/json; charset=utf-8",
      Host: ENDPOINT,
      "X-TC-Action": ACTION,
      "X-TC-Version": VERSION,
      "X-TC-Region": region,
      "X-TC-Timestamp": String(timestamp)
    };
    if (token) headers["X-TC-Token"] = token;
    const response = await send("https://" + ENDPOINT + "/", { method: "POST", headers }, payload);
    if (response.status < 200 || response.status >= 300) throw new Error("bda-outcome-unknown");
    let envelope;
    try { envelope = JSON.parse(response.body.toString("utf8")); } catch (_) { throw new Error("bda-response-invalid"); }
    const value = envelope && envelope.Response;
    if (!value || typeof value.RequestId !== "string" || !value.RequestId) throw new Error("bda-response-invalid");
    if (value.Error) {
      const code = String(value.Error.Code || "BdaError");
      if (/InvalidParameter|ImageNotForeground|SegmentFailed|ResourceUnavailable\.NotExist/.test(code)) throw definite("bda-request-rejected", code);
      throw Object.assign(new Error("bda-outcome-unknown"), { code });
    }
    if (value.HasForeground === false) throw definite("bda-no-foreground", "FailedOperation.ImageNotForeground");
    const resultUrl = validateResultUrl(value.ResultImageUrl);
    const reference = { downloadUrl: resultUrl, requestId: value.RequestId,
      downloadExpiresAt: now() + RESULT_TTL_MS - RESULT_SAFETY_MS,
      width: prepared.dimensions.width, height: prepared.dimensions.height };
    // Persist the non-AI download reference BEFORE fetching it. A download
    // timeout or a cold restart must never submit the image to BDA again.
    if (dependencies.saveResultReference) await dependencies.saveResultReference(order, reference);
    const downloaded = await send(resultUrl, { method: "GET", headers: { Accept: "image/png" } });
    if (downloaded.status !== 200) throw new Error("bda-result-download-unknown");
    const result = decodePng(downloaded.body, prepared.dimensions, PNGImpl);
    return Object.assign(result, reference, { provider: "bda-segment-portrait" });
  }

  return {
    transport: "inline",
    prepareInput,
    process,
    async findSavedResult(order) {
      const ref = order.resultReference;
      if (!ref || now() >= ref.downloadExpiresAt) return null;
      const response = await send(validateResultUrl(ref.downloadUrl), { method: "GET", headers: { Accept: "image/png" } });
      if (response.status !== 200) throw new Error("bda-result-download-unknown");
      return Object.assign(decodePng(response.body, ref, PNGImpl), ref, { provider: "bda-segment-portrait" });
    },
    async resultPermission(order) {
      if (!order.result || !order.result.downloadUrl || now() >= order.result.downloadExpiresAt) throw definite("bda-result-url-expired");
      return { url: order.result.downloadUrl, expiresIn: Math.max(0, Math.floor((order.result.downloadExpiresAt - now()) / 1000)) };
    },
    async cleanup(order, resultExpired) {
      return { inputDeleted: true, resultDeleted: !!resultExpired, resultReferenceDeleted: !!resultExpired };
    }
  };
}

module.exports = { createBdaProvider, authorization, inspectJpeg, decodePng, validateResultUrl, MAX_BASE64_BYTES };
