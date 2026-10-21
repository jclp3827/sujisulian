#!/usr/bin/env node
// Protocol and real HMAC checks with an injected HTTPS transport. No live calls.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { createVirtualPayment, hmac } = require("../cloudfunctions/photoAi/virtual-payment");
const { configuration } = require("../cloudfunctions/photoAi/configuration");
const { assertPaymentCapability } = require("../miniprogram/subpackages/photo/platform/paid-ledger-legacy");
const { handlePush } = require("../cloudfunctions/photoAi/push");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");

async function main() {
  // Published WeChat test vector, including its exact spaces/key order.
  const vector = '{"openid": "xxx", "user_ip": "127.0.0.1", "env": 0}';
  assert.equal(hmac("12345", "/xpay/query_user_balance&" + vector), "c37809f27c6d7fd1837ad2500a04512b66b34fd793a39a385fade56dca89a4b5");
  assert.equal(hmac("9hAb/NEYUlkaMBEsmFgzig==", vector), "089d9e8dc5d308977360c4b79ec600a93d736802802a807d634192328032f6c7");
  const env = { PHOTO_APP_ID: "test-app", PHOTO_APP_SECRET: "test-app-secret", PHOTO_VIRTUAL_APP_KEY: "test-pay-key",
    PHOTO_VIRTUAL_OFFER_ID: "test-offer", PHOTO_VIRTUAL_PRODUCT_ID: "test-product" };
  const order = { id: "P" + "1".repeat(30), owner: "alice", inputHash: "a".repeat(64), terms: "test-terms", refundId: "R" + "1".repeat(30) };
  const remote = { order_id: order.id, env_type: 1, wx_order_id: "platform-id", order_fee: 100, paid_fee: 100, left_fee: 100, order_type: 0, status: 2 };
  let sessionOwner = "alice", tokenCalls = 0, refundCalls = 0, deliveryCalls = 0;
  let refundStatus = 5, corruptOrder = false, queryError = false;
  const calls = [];
  const provider = createVirtualPayment(env, { async request(url, options, raw) {
    const u = new URL(url), body = raw ? JSON.parse(raw) : null; calls.push({ u, body, raw });
    const answer = data => ({ status: 200, body: Buffer.from(JSON.stringify(data)) });
    assert.equal(u.hostname, "api.weixin.qq.com");
    if (u.pathname === "/sns/jscode2session") {
      assert.equal(u.searchParams.get("js_code"), "one-use-code");
      assert.equal(u.searchParams.get("secret"), env.PHOTO_APP_SECRET);
      return answer({ openid: sessionOwner, session_key: "test-session-key" });
    }
    assert.equal(options.method, "POST");
    assert.equal(options.headers['Content-Length'], Buffer.byteLength(raw, 'utf8'));
    assert.equal(options.headers['Transfer-Encoding'], undefined);
    if (u.pathname === "/cgi-bin/stable_token") { tokenCalls++; assert.equal(body.force_refresh, false); return answer({ access_token: "server-only-token", expires_in: 7200 }); }
    assert.equal(u.searchParams.get("access_token"), "server-only-token");
    assert.equal(u.searchParams.get("pay_sig"), crypto.createHmac("sha256", env.PHOTO_VIRTUAL_APP_KEY).update(u.pathname + "&" + raw).digest("hex"));
    assert.equal(body.env, 0);
    if (u.pathname === "/xpay/query_order") {
      assert.equal(body.openid, order.owner); assert.ok(!("out_trade_no" in body));
      if (queryError) return answer({ errcode: -1 });
      if (body.order_id === order.refundId) return answer({ errcode: 0, order: { order_id: order.refundId, wx_order_id: "refund-platform-id", env_type: 1, order_type: 1, refund_fee: 100, status: refundStatus } });
      assert.equal(body.order_id, order.id);
      return answer({ errcode: 0, order: { ...remote, order_id: corruptOrder ? "other-order" : remote.order_id } });
    }
    if (u.pathname === "/xpay/refund_order") {
      refundCalls++; assert.equal(body.refund_order_id, order.refundId); assert.equal(body.left_fee, 100); assert.equal(body.refund_fee, 100);
      assert.equal(body.biz_meta, order.id); assert.equal(body.refund_reason, "1"); assert.equal(body.req_from, "3");
      return answer({ errcode: 0 });
    }
    assert.equal(u.pathname, "/xpay/notify_provide_goods"); deliveryCalls++; return { status: 200, body: Buffer.alloc(0) };
  } });
  const pay = await provider.preparePayment(order, "one-use-code"), p = pay.parameters;
  assert.equal(pay.channel, "virtual"); assert.equal(p.mode, "short_series_goods");
  assert.equal(p.paySig, hmac(env.PHOTO_VIRTUAL_APP_KEY, "requestVirtualPayment&" + p.signData));
  assert.equal(p.signature, hmac("test-session-key", p.signData));
  const signed = JSON.parse(p.signData);
  assert.equal(signed.goodsPrice, 100); assert.equal(signed.env, 0); assert.equal(signed.buyQuantity, 1); assert.equal(signed.outTradeNo, order.id);
  assert.equal(JSON.parse(signed.attach).inputHash, order.inputHash);
  for (const secret of [env.PHOTO_APP_SECRET, env.PHOTO_VIRTUAL_APP_KEY, "test-session-key", "server-only-token"]) assert.ok(!JSON.stringify(pay).includes(secret));
  assert.equal((await provider.preparePayment(order, "one-use-code")).parameters.signData, p.signData);
  sessionOwner = "bob"; await assert.rejects(provider.preparePayment(order, "one-use-code"), /owner/);
  assert.equal((await provider.queryPayment(order)).paid, true);
  corruptOrder = true; await assert.rejects(provider.queryPayment(order), /identity/); corruptOrder = false;
  for (const [key, bad] of [["env_type", 2], ["order_fee", 1], ["paid_fee", 99], ["order_type", 1], ["wx_order_id", ""], ["status", 9]]) {
    const saved = remote[key]; remote[key] = bad; await assert.rejects(provider.queryPayment(order)); remote[key] = saved;
  }
  await assert.rejects(provider.queryPayment({ ...order, transactionId: "another-transaction" }), /changed/);
  remote.status = 1; remote.paid_fee = 0; assert.equal((await provider.queryPayment(order)).paid, false);
  remote.status = 6; assert.equal((await provider.queryPayment(order)).closed, true);
  remote.status = 2; remote.paid_fee = 100;
  await provider.markDelivered({ ...order, transactionId: remote.wx_order_id }); assert.equal(deliveryCalls, 1);
  await provider.refund({ ...order, transactionId: remote.wx_order_id }); assert.equal(refundCalls, 1);
  assert.equal((await provider.queryRefund(order)).state, "PROCESSING");
  refundStatus = 8; assert.equal((await provider.queryRefund(order)).state, "SUCCESS");
  refundStatus = 7; assert.equal((await provider.queryRefund(order)).state, "FAILED");
  queryError = true; await assert.rejects(provider.queryRefund(order), /unknown/); queryError = false;
  remote.order_type = 7; await assert.rejects(provider.refund(order), /App Store/); assert.equal(refundCalls, 1);
  remote.left_fee = 0; remote.status = 5;
  assert.equal((await provider.queryPayment(order)).refundState, "PROCESSING");
  const refundEvent = { OpenId: "alice", MchRefundId: order.refundId, WxRefundId: "refund-platform-id", WxOrderId: "platform-id", RefundFee: 100, RetCode: 0 };
  // Apple notification association is checked against parent + refund records.
  // This harness's refund record is ordinary, so Apple mismatches must fail.
  refundStatus = 8;
  await assert.rejects(provider.reconcileRefundNotification({ ...order, transactionId: "platform-id" }, refundEvent), /mismatch/);
  remote.order_type = 0;
  assert.equal((await provider.reconcileRefundNotification({ ...order, transactionId: "platform-id" }, refundEvent)).refundTransactionId, "refund-platform-id");
  refundStatus = 5;
  await assert.rejects(provider.reconcileRefundNotification({ ...order, transactionId: "platform-id" }, refundEvent), /pending/);
  await assert.rejects(provider.reconcileRefundNotification({ ...order, transactionId: "platform-id" }, { ...refundEvent, WxOrderId: "other-parent" }), /parent/);
  remote.status = 8; assert.equal((await provider.queryPayment(order)).refundState, "SUCCESS");
  assert.equal(tokenCalls, 1);

  let framedRequests = 0;
  const utf8Provider = createVirtualPayment({ ...env, PHOTO_APP_SECRET: '测试字节长度' }, { async request(url, options, raw) {
    assert.equal(options.headers['Content-Length'], Buffer.byteLength(raw, 'utf8'));
    assert.equal(options.headers['Transfer-Encoding'], undefined); framedRequests++;
    if (new URL(url).pathname === '/cgi-bin/stable_token') {
      assert(Buffer.byteLength(raw, 'utf8') > raw.length);
      return {status:200,body:Buffer.from(JSON.stringify({access_token:'test-framing-token',expires_in:7200}))};
    }
    assert.equal(new URL(url).searchParams.get('pay_sig'), hmac(env.PHOTO_VIRTUAL_APP_KEY, '/xpay/query_order&' + raw));
    return {status:200,body:Buffer.from(JSON.stringify({errcode:0,order:{...remote,status:1}}))};
  } });
  assert.equal((await utf8Provider.queryPayment(order)).paid, false);
  assert.equal(framedRequests, 2);

  for (const blockedOperation of ['access-token', 'query-order']) {
    const attempted = [];
    const unavailable = createVirtualPayment(env, { async request(url) {
      const pathname = new URL(url).pathname; attempted.push(pathname);
      if (pathname === '/cgi-bin/stable_token' && blockedOperation === 'query-order') {
        return { status: 200, body: Buffer.from(JSON.stringify({access_token:'must-stay-private',expires_in:7200})) };
      }
      return { status: 404, body: Buffer.from('private-provider-response-must-not-leak') };
    } });
    await assert.rejects(unavailable.queryPayment(order), error => {
      assert.equal(error.message, 'virtual-payment-network-unknown');
      assert.equal(error.httpStatus, 404); assert.equal(error.operation, blockedOperation);
      assert(!JSON.stringify(error).includes('private')); return true;
    });
    assert.equal(attempted.length, blockedOperation === 'query-order' ? 2 : 1);
  }

  const wx = version => ({ requestVirtualPayment() {}, canIUse: () => true, getAppBaseInfo: () => ({ version }), getDeviceInfo: () => ({ platform: "ios" }) });
  const feature = { channel: "virtual", iosEnabled: true };
  assertPaymentCapability(wx("8.0.68"), feature); assertPaymentCapability(wx("8.1.0"), feature);
  assert.throws(() => assertPaymentCapability(wx("8.0.67"), feature), /8.0.68/);
  assert.throws(() => assertPaymentCapability(wx(""), feature));
  assert.throws(() => assertPaymentCapability(wx("8.0.68"), { ...feature, iosEnabled: false }), /暂未开放/);
  assert.equal(configuration({}).newOrdersEnabled, false); assert.equal(configuration({}).processingEnabled, false);
  const openEnv = { ...env, PHOTO_AI_PROVIDER: "bda", PHOTO_BDA_REGION: "ap-guangzhou", PHOTO_BDA_SECRET_ID: "test", PHOTO_BDA_SECRET_KEY: "test", PHOTO_MAINTENANCE_SECRET: "x".repeat(32),
    PHOTO_PAYMENT_CHANNEL: "personal-virtual", PHOTO_MAX_AI_CALLS_PER_DAY: "1", PHOTO_PROCESSING_ENABLED: "true", PHOTO_NEW_ORDERS_ENABLED: "true" };
  const gates = ["PHOTO_CHANNEL_ELIGIBILITY_VERIFIED", "PHOTO_PRODUCT_100_FEN_VERIFIED", "PHOTO_CALLBACK_ACCEPTED", "PHOTO_REAL_FLOW_ACCEPTED", "PHOTO_FREE_RELEASE_ACCEPTED", "PHOTO_PRIVACY_ACCEPTED", "PHOTO_BUDGET_AUTHORIZED"];
  for (const gate of gates) openEnv[gate] = "true";
  assert.equal(configuration(openEnv).newOrdersEnabled, true);
  for (const gate of gates) assert.equal(configuration({ ...openEnv, [gate]: "false" }).newOrdersEnabled, false);
  assert.equal(configuration({ ...openEnv, PHOTO_PAYMENT_CHANNEL: "wechatpay-jsapi" }).newOrdersEnabled, false);
  assert.equal(configuration({ ...openEnv, PHOTO_BUDGET_AUTHORIZED: "false" }).processingEnabled, false);
  const testEnv = { ...openEnv, PHOTO_REAL_FLOW_ACCEPTED: "false", PHOTO_FREE_RELEASE_ACCEPTED: "false", PHOTO_CALLBACK_ACCEPTED: "false",
    PHOTO_TEST_PAYMENT_AUTHORIZED: "true", PHOTO_CALLBACK_CONFIGURED: "true", PHOTO_TEST_PAYER_OPENIDS: "alice", PHOTO_IOS_IAP_CONFIGURED: "true" };
  assert.equal(configuration(testEnv, "alice").newOrdersEnabled, true); assert.equal(configuration(testEnv, "alice").testOnly, true);
  assert.equal(configuration(testEnv, "alice").iosEnabled, true);
  assert.equal(configuration(testEnv, "bob").newOrdersEnabled, false);
  assert.equal(configuration(testEnv).newOrdersEnabled, false);
  assert.equal(configuration({ ...testEnv, PHOTO_TEST_PAYMENT_AUTHORIZED: "false" }, "alice").newOrdersEnabled, false);
  const waitingIap = configuration({ ...testEnv, PHOTO_IOS_IAP_CONFIGURED: "false", PHOTO_IOS_IAP_ACCEPTED: "false" }, "alice");
  assert.equal(waitingIap.newOrdersEnabled, true); assert.equal(waitingIap.iosEnabled, false);
  assertPaymentCapability({ requestVirtualPayment() {}, getAppBaseInfo: () => ({ version: "8.0.68" }), getDeviceInfo: () => ({ platform: "android" }) }, { channel: "virtual", iosEnabled: waitingIap.iosEnabled });

  let queryCalls = 0, ready = false;
  const event = { MsgType: "event", Event: "xpay_goods_deliver_notify", OpenId: "alice", OutTradeNo: order.id, Env: 0,
    GoodsInfo: { ProductId: env.PHOTO_VIRTUAL_PRODUCT_ID, Quantity: 1, ActualPrice: 100 }, WeChatPayInfo: { MchOrderNo: "platform-id" } };
  const deps = { productId: env.PHOTO_VIRTUAL_PRODUCT_ID, store: { async get() { return { ...order, transactionId: "platform-id" }; } },
    orders: { async status() { queryCalls++; return { payment: "paid", task: ready ? "ready" : "not-started", refund: "none" }; } } };
  await assert.rejects(handlePush(event, { SOURCE: "wx_client", OPENID: "alice" }, deps), /not-allowed/);
  assert.equal(queryCalls, 0);
  assert.equal((await handlePush(event, {}, deps)).ErrCode, -1); // Paid is not delivered.
  ready = true;
  assert.equal((await handlePush(event, {}, deps)).ErrCode, 0);
  assert.equal((await handlePush(event, {}, deps)).ErrCode, 0);
  await assert.rejects(handlePush({ ...event, OpenId: "bob" }, {}, deps), /owner/);
  await assert.rejects(handlePush({ ...event, Env: 1 }, {}, deps), /product/);

  // Exercise the dormant purchase controller in an isolated VM. The shipped
  // switch remains false; no caller can supply this test-only instrumentation.
  const file = path.resolve(__dirname, "../miniprogram/subpackages/photo/platform/paid-ledger-legacy.js"), testModule = { exports: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8").replace("const PAID_ENABLED = false;", "const PAID_ENABLED = true;"),
    { module: testModule, require: createRequire(file), Date, Math, Uint8Array });
  const inputBytes = Buffer.from("sanitized-work-fixture"), inputHash = crypto.createHash("sha256").update(inputBytes).digest("hex"), actions = [];
  const pending = { orderId: order.id, requestKey: "test-key-123456789", inputHash };
  let task = "not-started";
  const client = testModule.exports.createPaid({
    getStorageSync(key) { return key === "photo-ai-pending-v1" ? pending : null; }, setStorageSync() {}, removeStorageSync() {},
    arrayBufferToBase64(value) { return Buffer.from(value).toString("base64"); },
    getFileSystemManager() { return { readFileSync() { return inputBytes; } }; },
    cloud: { callFunction(args) {
      actions.push(args.data.action);
      if (["features", "create", "payment", "upload"].includes(args.data.action)) throw new Error("paid-recovery-must-not-require-new-purchases-or-storage");
      if (args.data.action === "start") { assert.equal(args.data.imageBase64, inputBytes.toString("base64")); task = "ready"; }
      args.success({ result: { orderId: order.id, payment: "paid", refund: "none", task, inputTransport: "inline" } });
    } }
  });
  assert.equal((await client.buy({ path: "local-work", sha256: inputHash, bytes: inputBytes.length, width: 600, height: 840 }, testModule.exports.TERMS, () => {})).task, "ready");
  assert.deepEqual(actions, ["status", "confirm", "start", "status"]);
  // A downloaded transparent result is saved in WeChat's local file area and
  // reused after the temporary BDA URL is gone. No server image store is used.
  const resultBytes = Buffer.from("verified-local-transparent-result");
  const resultHash = crypto.createHash("sha256").update(resultBytes).digest("hex");
  const storage = {}, files = new Map([["/temporary-result.png", resultBytes]]); let downloadCalls = 0;
  const localClient = testModule.exports.createPaid({
    getStorageSync(key) { return storage[key] || null; }, setStorageSync(key, value) { storage[key] = value; }, removeStorageSync(key) { delete storage[key]; },
    getFileSystemManager() { return {
      readFileSync(filePath) { return files.get(filePath); },
      statSync(filePath) { const value = files.get(filePath); return value && { size: value.length, isFile: () => true }; },
      unlink(args) { files.delete(args.filePath); args.success({}); }
    }; },
    downloadFile(args) { downloadCalls++; args.success({ statusCode: 200, tempFilePath: "/temporary-result.png" }); },
    saveFile(args) { files.set("/saved-result.png", files.get(args.tempFilePath)); args.success({ savedFilePath: "/saved-result.png" }); }
  });
  const readyOrder = { orderId: order.id, payment: "paid", refund: "none", task: "ready", result: { sha256: resultHash, width: 600, height: 840 }, download: { url: "https://temporary.invalid/result" } };
  assert.equal(JSON.stringify(await localClient.download(readyOrder)), JSON.stringify({ path: "/saved-result.png", persistent: true, local: true }));
  assert.equal(JSON.stringify(await localClient.download({ ...readyOrder, download: undefined, resultExpired: true })), JSON.stringify({ path: "/saved-result.png", persistent: true, local: true }));
  assert.equal(downloadCalls, 1);

  console.log(JSON.stringify({ passed: true, realPayment: false, realAi: false, deployed: false, scope: "local-personal-virtual-protocol-and-HMAC",
    verified: ["official-HMAC-vectors", "exact-wire-signature", "server-only-session-owner-binding", "fixed-price-and-production", "unpaid-and-closed", "receipt-mismatch-rejection", "refund-5-not-8", "ios-no-developer-refund", "token-cache", "ios-capability", "closed-configuration", "push-hints-query-only-no-AI", "inline-BDA-resume-with-new-purchases-closed", "local-result-reuse-after-url-expiry"] }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
