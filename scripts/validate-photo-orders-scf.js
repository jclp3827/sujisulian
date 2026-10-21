#!/usr/bin/env node
// Full local HTTP/order/BDA protocol flow with real codecs and crypto. No network.
const assert = require("node:assert/strict"), crypto = require("node:crypto"), fs = require("node:fs");
const path = require("node:path"), os = require("node:os"), vm = require("node:vm");
const { createRequire } = require("node:module");
const { assemble } = require("./build-photo-orders");
const root = path.resolve(__dirname, ".."), sdk = createRequire(path.resolve(process.env.PHOTO_SDK_ROOT || "cloudfunctions/photoAi", "package.json"));
const PNG = sdk("pngjs").PNG, jpeg = sdk("jpeg-js");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "photo-orders-verify-")), bundle = path.join(temp, "bundle");
assemble(bundle);
const { createHandler } = require(path.join(bundle, "index"));
const { createBdaProvider } = require(path.join(bundle, "shared/bda-provider"));
const { encrypt, decodeNotification } = require(path.join(bundle, "notify"));
const hash = data => crypto.createHash("sha256").update(data).digest("hex");
const terms = require("../cloudfunctions/photoAi/orders").TERMS;
let clock = 1800000000000;
const now = () => clock;
const env = {
  PHOTO_APP_ID: "test-app", PHOTO_APP_SECRET: "test-app-secret", PHOTO_VIRTUAL_OFFER_ID: "test-offer", PHOTO_VIRTUAL_APP_KEY: "test-app-key",
  PHOTO_VIRTUAL_PRODUCT_ID: "photo_ai_bg_once", PHOTO_MAINTENANCE_SECRET: "m".repeat(32),
  TENCENTCLOUD_SECRETID: "role-id", TENCENTCLOUD_SECRETKEY: "role-key", TENCENTCLOUD_SESSIONTOKEN: "role-token",
  PHOTO_ORDER_STORE: "mysql", PHOTO_SQL_HOST: "mysql.test", PHOTO_SQL_DATABASE: "photo_orders", PHOTO_SQL_USER: "test_order_user", PHOTO_SQL_PASSWORD: "test-password",
  PHOTO_DATABASE_ACCEPTED: "true", PHOTO_PAYMENT_CHANNEL: "personal-virtual",
  PHOTO_BUDGET_AUTHORIZED: "true", PHOTO_MAX_AI_CALLS_PER_DAY: "2", PHOTO_PROCESSING_ENABLED: "true", PHOTO_NEW_ORDERS_ENABLED: "true",
  PHOTO_CHANNEL_ELIGIBILITY_VERIFIED: "true", PHOTO_PRODUCT_100_FEN_VERIFIED: "true", PHOTO_PRIVACY_ACCEPTED: "true",
  PHOTO_CALLBACK_ACCEPTED: "true", PHOTO_REAL_FLOW_ACCEPTED: "true", PHOTO_FREE_RELEASE_ACCEPTED: "true",
  PHOTO_IOS_IAP_ACCEPTED: "true", PHOTO_MAINTENANCE_ENABLED: "true", PHOTO_PUSH_TOKEN: "t".repeat(32), PHOTO_PUSH_AES_KEY: Buffer.alloc(32, 7).toString("base64").slice(0, 43)
};
const image = jpeg.encode({ width: 300, height: 420, data: Buffer.alloc(300 * 420 * 4, 255) }, 90).data;
const png = new PNG({ width: 300, height: 420 }); png.data.fill(255); png.data[3] = 0;
const output = PNG.sync.write(png);
const input = { inputHash: hash(image), inputBytes: image.length, inputWidth: 300, inputHeight: 420,
  requestKey: "local-request-123456789", consent: terms };
const disk = new Map(), receipts = new Map(), counts = { ai: 0, downloads: 0, auth: 0, budget: 0, acknowledged: 0 };
let queue = Promise.resolve(), failDownload = false, unknownAi = false, reads = 0;
const store = {
  async get(id) { reads++; return structuredClone(disk.get(id) || null); },
  change(id, fn) { const task = queue.then(() => { const value = fn(structuredClone(disk.get(id) || null)); disk.set(id, structuredClone(value)); return structuredClone(value); }); queue = task.catch(() => {}); return task; },
  async reserveCall(id, limit) { if (counts.budget >= limit) throw Object.assign(new Error("daily-budget"), { definiteFailure: true }); counts.budget++; },
  async recent(owner) { return [...disk.values()].filter(o => o.owner === owner && o.payment === "paid" && o.refund === "none").sort((a, b) => b.createdAt - a.createdAt)[0] || null; },
  async pending() { return [...disk.values()].filter(o => !o.resultDeleted); }, async advanceMaintenance() {}
};
const loginCodes = new Set(); let code = 0;
function login(owner) { const c = owner + "-" + ++code; loginCodes.add(c); return c; }
async function send(url, options, body) {
  const u = new URL(url);
  assert.ok(options.timeout > 0 && options.timeout <= 20000);
  if (u.pathname === "/sns/jscode2session") {
    counts.auth++; const c = u.searchParams.get("js_code");
    if (!loginCodes.delete(c)) return { status: 200, body: Buffer.from('{"errcode":40029}') };
    return { status: 200, body: Buffer.from(JSON.stringify({ openid: c.startsWith("bob-") ? "bob" : "alice", session_key: "test-session" })) };
  }
  if (u.pathname === "/cgi-bin/stable_token") return { status: 200, body: Buffer.from('{"access_token":"local-token","expires_in":7200}') };
  if (u.pathname === "/xpay/query_order") {
    const o = JSON.parse(body); assert.equal(o.env, 0);
    const receipt = receipts.get(o.order_id);
    return { status: 200, body: Buffer.from(JSON.stringify({ order: { order_id: o.order_id, env_type: 1, status: 1, ...receipt } })) };
  }
  if (u.pathname === "/xpay/notify_provide_goods") { counts.acknowledged++; return { status: 200, body: Buffer.from('{"errcode":0}') }; }
  if (u.hostname === "bda.tencentcloudapi.com") {
    counts.ai++; assert.equal(options.headers["X-TC-Token"], "role-token");
    assert.deepEqual(JSON.parse(body), { Image: image.toString("base64"), RspImgType: "url", Scene: "GEN" });
    if (unknownAi) throw new Error("network-outcome-unknown");
    return { status: 200, body: Buffer.from(JSON.stringify({ Response: { HasForeground: true, RequestId: "local-request-id",
      ResultImageUrl: "https://synthetic.cos.ap-guangzhou.myqcloud.com/result.png" } })) };
  }
  assert.equal(u.hostname, "synthetic.cos.ap-guangzhou.myqcloud.com"); counts.downloads++;
  if (failDownload) throw new Error("download-timeout");
  return { status: 200, body: output };
}
const deps = { env, now, request: send, store, createBdaProvider: (e, d) => createBdaProvider(e, { ...d, PNG, jpeg }) };
// A new handler for EVERY call simulates cold instance replacement.
async function api(action, data = {}, owner = "alice", override = {}) {
  const response = await createHandler({ ...deps, ...override })({ httpMethod: "POST", path: "/", body: JSON.stringify({ ...data, action, loginCode: login(owner) }) });
  return { status: response.statusCode, value: JSON.parse(response.body) };
}
function pay(id) { receipts.set(id, { status: 2, wx_order_id: "wx-" + id, order_type: 0, order_fee: 100, paid_fee: 100, left_fee: 100 }); }
async function main() {
  const closed = await api("features", {}, "alice", { env: { ...env, PHOTO_DATABASE_ACCEPTED: "false" } });
  assert.equal(closed.value.newOrdersEnabled, false); assert.equal(reads, 0);
  assert.equal((await api("features", {}, "alice", { env: { ...env, TENCENTCLOUD_SESSIONTOKEN: "" } })).value.newOrdersEnabled, false);
  assert.equal((await api("create", { ...input, owner: "alice" })).status, 503);
  assert.equal((await api("create", { ...input, priceFen: 1 })).status, 503);
  const created = await api("create", input), id = created.value.orderId; assert.match(id, /^P[a-f0-9]{30}$/);
  assert.equal((await api("create", input)).value.orderId, id);
  assert.equal((await api("status", { orderId: id }, "bob")).status, 503);
  assert.equal((await api("start", { orderId: id, imageBase64: image.toString("base64"), payment: "paid" })).status, 503);
  assert.equal(counts.ai, 0); assert.equal(counts.budget, 0);
  const signed = await api("payment", { orderId: id });
  assert.equal(signed.status, 200); assert.equal(signed.value.parameters.mode, "short_series_goods");
  const data = JSON.parse(signed.value.parameters.signData);
  assert.equal(data.outTradeNo, id); assert.equal(data.goodsPrice, 100);
  assert.equal(signed.value.parameters.signature, crypto.createHmac("sha256", "test-session").update(signed.value.parameters.signData).digest("hex"));
  pay(id); failDownload = true;
  await Promise.all(Array.from({ length: 6 }, () => api("start", { orderId: id, imageBase64: image.toString("base64") })));
  assert.equal(counts.ai, 1); assert.equal(counts.budget, 1);
  const staged = disk.get(id); assert.equal(staged.task, "unknown"); assert.ok(staged.resultReference.downloadUrl);
  assert.ok(!JSON.stringify(staged).includes(image.toString("base64")));
  failDownload = false;
  const recovered = await api("status", { orderId: id });
  assert.equal(recovered.value.task, "ready"); assert.equal(recovered.value.result.sha256, hash(output));
  assert.equal(recovered.value.expiresAt, staged.resultReference.downloadExpiresAt); assert.equal(counts.ai, 1);
  assert.equal((await api("recent")).value.orderId, id); assert.equal((await api("recent", {}, "bob")).value.orderId, null);
  assert.ok((await api("status", { orderId: id }, "alice", { env: { ...env, PHOTO_NEW_ORDERS_ENABLED: "false", PHOTO_PROCESSING_ENABLED: "false" } })).value.download);
  receipts.get(id).left_fee = 0; receipts.get(id).status = 8;
  const revoked = await api("status", { orderId: id }); assert.equal(revoked.value.refund, "refunded"); assert.equal(revoked.value.download, undefined);
  // Unknown upstream outcome persists across cold handlers and cannot replay.
  clock += 1000;
  const second = (await api("create", { ...input, requestKey: "unknown-request-123456789" })).value.orderId; pay(second); unknownAi = true;
  await api("start", { orderId: second, imageBase64: image.toString("base64") });
  await api("start", { orderId: second, imageBase64: image.toString("base64") }); assert.equal(counts.ai, 2);
  clock += 900001; assert.equal((await api("status", { orderId: second })).value.canRefund, true);
  // A third paid task hits the durable quota before any BDA call.
  const third = (await api("create", { ...input, requestKey: "budget-request-123456789" })).value.orderId; pay(third);
  assert.equal((await api("start", { orderId: third, imageBase64: image.toString("base64") })).value.task, "failed"); assert.equal(counts.ai, 2);
  const before = reads;
  assert.equal((await api("maintenance", { Type: "Timer", TriggerName: "photoAiMaintenance" })).status, 503); assert.equal(reads, before);
  const replayCode = login("alice"), event = { httpMethod: "POST", path: "/", body: JSON.stringify({ action: "features", loginCode: replayCode }) };
  assert.equal((await createHandler(deps)(event)).statusCode, 200); assert.equal((await createHandler(deps)(event)).statusCode, 503);
  // Independent safe-mode fixture: timestamp/signature, AppID and body changes.
  const plain = JSON.stringify({ MsgType: "event", Event: "xpay_goods_deliver_notify", OpenId: "alice", OutTradeNo: id });
  const encrypted = encrypt(env, plain, now), query = { timestamp: encrypted.timestamp, nonce: encrypted.nonce, msg_signature: encrypted.msgsignature };
  assert.equal(decodeNotification(env, query, { Encrypt: encrypted.encrypt }, now).OutTradeNo, id);
  assert.throws(() => decodeNotification(env, { ...query, msg_signature: "0".repeat(40) }, { Encrypt: encrypted.encrypt }, now));
  assert.throws(() => decodeNotification({ ...env, PHOTO_APP_ID: "wrong-app" }, query, { Encrypt: encrypted.encrypt }, now));
  assert.throws(() => decodeNotification(env, query, { Encrypt: encrypted.encrypt }, () => clock + 301000));
  const forged = await createHandler(deps)({ httpMethod: "POST", path: "/notify", queryString: query, body: JSON.stringify({ Event: "xpay_goods_deliver_notify", OpenId: "alice" }) });
  assert.equal(forged.statusCode, 503);

  // Client route gets fresh login per request; timeout is never auto replayed.
  const clientFile = path.join(root, "miniprogram/subpackages/photo/platform/order-service.js"), mod = { exports: {} };
  vm.runInNewContext(fs.readFileSync(clientFile, "utf8").replace('const ORDERS_ENDPOINT = "";', 'const ORDERS_ENDPOINT = "https://test.ap-guangzhou.tencentscf.com";'),
    { module: mod, require: createRequire(clientFile) });
  let clientLogins = 0, clientRequests = 0;
  const client = mod.exports.createOrderService({ login(o) { o.success({ code: "one-use-" + ++clientLogins }); }, request(o) {
    clientRequests++; assert.equal(o.data.loginCode, "one-use-" + clientLogins); assert.equal(o.header["x-photo-token"], undefined);
    if (clientRequests === 2) o.fail({ errMsg: "request:fail timeout" }); else o.success({ statusCode: 200, data: { orderId: id } });
  } });
  assert.equal((await client.request("status", { orderId: id, loginCode: "forged" })).orderId, id);
  await assert.rejects(client.request("start", { orderId: id })); assert.equal(clientRequests, 2); assert.equal(clientLogins, 2);
  // Execute the dormant purchase controller against the new transport. Shipped
  // switches stay closed; this VM instrumentation is not a runtime setting.
  const paidFile = path.join(root, "miniprogram/subpackages/photo/platform/paid-ledger-legacy.js"), paidMod = { exports: {} };
  const storage = {}, actions = []; let paid = false, task = "not-started", paymentCancelled = false, payments = 0;
  const view = () => ({ orderId: id, inputHash: input.inputHash, payment: paid ? "paid" : "unpaid", refund: "none", task });
  const service = { configured: true, async request(action, value) {
    actions.push(action);
    if (action === "recent") return { orderId: null };
    if (action === "features") return { newOrdersEnabled: true, priceFen: 100, aiProvider: "bda", inputTransport: "inline", channel: "virtual", iosEnabled: true };
    if (action === "payment") return { channel: "virtual", parameters: { mode: "short_series_goods" } };
    if (action === "start") { assert.equal(paid, true); assert.equal(value.imageBase64, image.toString("base64")); task = "ready"; }
    return view();
  } };
  vm.runInNewContext(fs.readFileSync(paidFile, "utf8").replace("const PAID_ENABLED = false;", "const PAID_ENABLED = true;"),
    { module: paidMod, Date, Math, Uint8Array, require: name => name === "./order-service" ? { createOrderService: () => service } : createRequire(paidFile)(name) });
  let currentImage = image;
  const paidClient = paidMod.exports.createPaid({
    getStorageSync: k => storage[k], setStorageSync: (k, v) => { storage[k] = v; }, removeStorageSync: k => { delete storage[k]; },
    getFileSystemManager: () => ({ readFileSync: () => currentImage }), arrayBufferToBase64: b => Buffer.from(b).toString("base64"),
    getAppBaseInfo: () => ({ version: "8.0.68" }), getDeviceInfo: () => ({ platform: "ios" }),
    requestVirtualPayment(o) { payments++; if (paymentCancelled) o.fail({ errMsg: "requestVirtualPayment:fail cancel" }); else { paid = true; o.success({}); } }
  });
  const record = { path: "work.jpg", sha256: input.inputHash, bytes: image.length, width: 300, height: 420 };
  paymentCancelled = true;
  assert.equal((await paidClient.buy(record, terms, () => {})).cancelled, true);
  assert.ok(!actions.includes("start")); assert.equal(storage["photo-ai-pending-v1"].transport, "scf");
  currentImage = Buffer.concat([image, Buffer.from([0])]);
  await assert.rejects(paidClient.buy({ ...record, sha256: hash(currentImage), bytes: currentImage.length }, terms, () => {}), /上一笔支付/);
  currentImage = image;
  assert.equal(payments, 1);
  paymentCancelled = false; actions.length = 0;
  assert.equal((await paidClient.buy(record, terms, () => {})).task, "ready");
  assert.equal(actions.filter(a => a === "create").length, 1); assert.equal(actions.filter(a => a === "start").length, 1);
  assert.equal(payments, 2);
  // Already paid, new purchases closed: reuse rather than asking for payment.
  service.request = async action => { actions.push(action); if (["features", "create", "payment", "start"].includes(action)) throw new Error("must-reuse-paid-task"); return view(); };
  assert.equal((await paidClient.buy(record, terms, () => {})).task, "ready"); assert.equal(payments, 2);
  console.log(JSON.stringify({ passed: true, scope: "assembled-SCF-local-HTTP-and-real-codec-protocol", realPayment: false, realBda: false, deployed: false,
    checked: ["fresh-WeChat-identity", "one-code-one-exchange-and-signature", "owner-and-fixed-price", "unpaid-no-call", "concurrent-start-once", "persist-reference-before-download", "cold-handler-download-recovery", "cross-device-owner-recovery", "unknown-no-replay", "daily-budget", "external-refund-revokes-result", "closed-new-orders-preserve-recovery", "forged-timer-and-push-rejected", "safe-mode-crypto", "client-no-static-token-or-replay", "client-payment-cancel-no-AI-and-paid-reuse"] }));
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => fs.rmSync(temp, { recursive: true, force: true }));
