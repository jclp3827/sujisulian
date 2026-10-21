#!/usr/bin/env node
// Injected provider/store checks only; never proves a live transaction or AI result.
const assert = require("node:assert/strict");
const { createOrders, TERMS } = require("../cloudfunctions/photoAi/orders");
const { createPaid, PAID_ENABLED } = require("../miniprogram/subpackages/photo/platform/paid");
const { createProvider } = require("../cloudfunctions/photoAi/providers");
const crypto = require("node:crypto");

function harness() {
  const disk = new Map(); let queue = Promise.resolve(), clock = 1000000;
  const counts = { ai: 0, payment: 0, refund: 0, upload: 0, budget: 0, deleted: 0 };
  const config = { appId: "test-app", merchantId: "test-merchant", newOrdersEnabled: true, processingEnabled: true, retentionMs: 86400000, unknownWaitMs: 900000, dailyCallLimit: 10 };
  const result = { sha256: "a".repeat(64), width: 600, height: 840 };
  const provider = {
    transport: "inline",
    paid: false, saved: null, unknown: false, wrongAmount: false, refundState: "PROCESSING", remoteRefund: null, platform: "android", queryFails: false,
    async preparePayment() { counts.payment++; return {}; },
    async queryPayment(o) { if (this.queryFails) throw new Error("query-network-unavailable"); return { paid: this.paid, amount: this.wrongAmount ? 1 : 100, currency: "CNY", appId: config.appId, merchantId: config.merchantId, owner: o.owner, orderId: o.id, transactionId: "receipt", platform: this.platform, refundState: this.remoteRefund }; },
    async prepareInput() { return { verified: true }; },
    async uploadPermission() { counts.upload++; return {}; },
    async process() { counts.ai++; if (this.unknown) throw new Error("timeout"); this.saved = result; return result; },
    async findSavedResult() { return this.saved; }, async resultPermission() { return { url: "private-result-no-ai-query" }; },
    async deleteInput() { counts.deleted++; },
    async cleanup(o, expired) { counts.deleted++; return { inputDeleted: true, resultDeleted: expired }; },
    async refund() { counts.refund++; }, async queryRefund() { return { state: this.refundState }; }
  };
  const store = { async get(id) { return structuredClone(disk.get(id) || null); },
    change(id, fn) { const task = queue.then(() => { const value = fn(structuredClone(disk.get(id) || null)); disk.set(id, structuredClone(value)); return structuredClone(value); }); queue = task.catch(() => {}); return task; },
    async pending() { return [...disk.values()].filter(o => !o.resultDeleted); }, async reserveCall() { counts.budget++; }
  };
  return { config, counts, disk, provider, store, orders: createOrders({ store, provider, config, now: () => clock }), advance(n) { clock += n; } };
}
const input = { inputHash: "1".repeat(64), inputBytes: 12345, inputWidth: 600, inputHeight: 840, requestKey: "request-1234567890", consent: TERMS };
async function main() {
  assert.equal(PAID_ENABLED, false);
  await assert.rejects(createPaid({}).buy({}, TERMS, () => {}), /暂未开放/);
  const h = harness(), o = await h.orders.create("alice", input);
  assert.equal(o.priceFen, 100);
  assert.equal((await h.orders.create("alice", input)).orderId, o.orderId);
  await assert.rejects(h.orders.create("alice", { ...input, priceFen: 1 }), /服务端/);
  await assert.rejects(h.orders.status("bob", o.orderId), /无权/);
  await assert.rejects(h.orders.start("alice", o.orderId), /支付/);
  await assert.rejects(h.orders.upload("alice", o.orderId), /支付/);
  assert.equal(h.counts.ai, 0); assert.equal(h.counts.upload, 0);
  h.provider.paid = true; h.provider.wrongAmount = true;
  await assert.rejects(h.orders.confirm("alice", o.orderId), /核对/);
  h.provider.wrongAmount = false;
  await h.orders.confirm("alice", o.orderId);
  await assert.rejects(h.orders.upload("alice", o.orderId), /不使用云端图片存储/);
  await Promise.all(Array.from({ length: 8 }, () => h.orders.start("alice", o.orderId)));
  assert.equal(h.counts.ai, 1); assert.equal(h.counts.budget, 1);
  for (let i = 0; i < 3; i++) assert.ok((await h.orders.status("alice", o.orderId)).download);
  assert.equal(h.counts.ai, 1);
  h.config.newOrdersEnabled = false;
  await assert.rejects(h.orders.create("alice", { ...input, requestKey: "other-request-123456" }), /暂未开放/);
  assert.ok((await h.orders.status("alice", o.orderId)).download);
  await h.orders.delivered("alice", o.orderId); await h.orders.report("alice", o.orderId);
  assert.equal((await h.orders.status("alice", o.orderId)).supportRequired, true);
  h.advance(86400001); await h.orders.maintenance();
  assert.equal((await h.orders.status("alice", o.orderId)).resultExpired, true);

  const u = harness(), unknown = await u.orders.create("alice", input);
  u.provider.paid = true; u.provider.unknown = true;
  await u.orders.confirm("alice", unknown.orderId);
  assert.equal((await u.orders.start("alice", unknown.orderId)).task, "unknown");
  await u.orders.start("alice", unknown.orderId); assert.equal(u.counts.ai, 1);
  await assert.rejects(u.orders.refund("alice", unknown.orderId), /核实/);
  u.advance(900001); assert.equal((await u.orders.status("alice", unknown.orderId)).task, "failed");
  await Promise.all([u.orders.refund("alice", unknown.orderId), u.orders.refund("alice", unknown.orderId)]);
  assert.equal(u.counts.refund, 1);
  assert.equal((await u.orders.status("alice", unknown.orderId)).refund, "requested");
  u.provider.refundState = "SUCCESS";
  assert.equal((await u.orders.status("alice", unknown.orderId)).refund, "refunded");
  assert.equal(u.counts.ai, 1);

  const r = harness(), lost = await r.orders.create("alice", input);
  r.provider.paid = true; r.provider.unknown = true;
  await r.orders.confirm("alice", lost.orderId); await r.orders.start("alice", lost.orderId);
  r.provider.saved = { sha256: "b".repeat(64), width: 600, height: 840 };
  assert.ok((await r.orders.status("alice", lost.orderId)).download); assert.equal(r.counts.ai, 1);

  // Apple failures must produce guidance, never a developer refund request.
  const ios = harness(), io = await ios.orders.create("alice", input);
  ios.provider.paid = true; ios.provider.platform = "ios"; ios.provider.unknown = true;
  ios.provider.refreshPaidOrders = true;
  await ios.orders.start("alice", io.orderId); ios.advance(900001);
  const guidance = await ios.orders.refund("alice", io.orderId);
  assert.equal(guidance.refundRoute, "app-store"); assert.equal(guidance.refund, "none");
  assert.match(guidance.refundGuidance, /尚未提交退款/); assert.equal(ios.counts.refund, 0);
  await ios.orders.maintenance(); assert.equal(ios.counts.refund, 0);

  // External refunds revoke a formerly valid result/start via fresh server
  // query; no callback body or cached paid flag can reopen the entitlement.
  const external = harness(), eo = await external.orders.create("alice", input);
  external.provider.paid = true; external.provider.refreshPaidOrders = true;
  await external.orders.start("alice", eo.orderId);
  assert.ok((await external.orders.status("alice", eo.orderId)).download);
  external.provider.remoteRefund = "PROCESSING";
  const revoked = await external.orders.status("alice", eo.orderId);
  assert.equal(revoked.refund, "requested"); assert.equal(revoked.download, undefined);
  await assert.rejects(external.orders.start("alice", eo.orderId), /退款/);
  assert.equal(external.counts.ai, 1);
  external.provider.remoteRefund = "SUCCESS";
  assert.equal((await external.orders.status("alice", eo.orderId)).refund, "refunded");
  external.provider.remoteRefund = null;
  assert.equal((await external.orders.status("alice", eo.orderId)).download, undefined);

  // Payment network failure cannot prevent expiry/privacy cleanup.
  const cleanup = harness(), co = await cleanup.orders.create("alice", input);
  cleanup.provider.paid = true; cleanup.provider.refreshPaidOrders = true;
  await cleanup.orders.start("alice", co.orderId); cleanup.advance(86400001);
  cleanup.provider.queryFails = true; await cleanup.orders.maintenance();
  assert.equal(cleanup.disk.get(co.orderId).resultDeleted, true);

  // One stalled order advances the durable cursor; the elapsed-time boundary
  // yields before starting another order, without invoking AI from maintenance.
  const bounded = harness(), first = await bounded.orders.create("alice", input);
  await bounded.orders.create("alice", { ...input, requestKey: "next-request-123456789" });
  const progressed = []; bounded.store.advanceMaintenance = async id => { progressed.push(id); };
  bounded.provider.queryFails = true; bounded.advance(86400001);
  const originalCleanup = bounded.provider.cleanup;
  bounded.provider.cleanup = async function(o, expired) { bounded.advance(65000); return originalCleanup.call(this, o, expired); };
  const sweep = await bounded.orders.maintenance();
  assert.deepEqual(progressed, [first.orderId]); assert.equal(bounded.counts.ai, 0); assert.equal(bounded.counts.deleted, 1);
  assert.equal(sweep.processed, 1); assert.equal(sweep.timeBoundaryReached, true);

  // Real crypto primitives with locally generated test keys, not a payment stub
  // that accepts any signature. No credentials or network calls are used.
  const keys = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  const env = { PHOTO_COS_BUCKET: "test-123", PHOTO_COS_REGION: "ap-shanghai", PHOTO_PAY_PLATFORM_SERIAL: "test-serial", PHOTO_PAY_PLATFORM_PUBLIC_KEY: keys.publicKey, PHOTO_PAY_API_V3_KEY: "x".repeat(32) };
  const provider = createProvider(env, { COS: {}, PNG: {}, jpeg: {} });
  const nonce = "123456789012", cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(env.PHOTO_PAY_API_V3_KEY), Buffer.from(nonce));
  cipher.setAAD(Buffer.from("test"));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify({ out_trade_no: "local-order" })), cipher.final(), cipher.getAuthTag()]);
  const raw = JSON.stringify({ resource: { algorithm: "AEAD_AES_256_GCM", nonce, associated_data: "test", ciphertext: encrypted.toString("base64") } });
  const stamp = String(Math.floor(Date.now() / 1000)), headers = { "wechatpay-timestamp": stamp, "wechatpay-nonce": "test-nonce", "wechatpay-serial": "test-serial" };
  headers["wechatpay-signature"] = crypto.sign("RSA-SHA256", Buffer.from(stamp + "\ntest-nonce\n" + raw + "\n"), keys.privateKey).toString("base64");
  assert.equal(provider.verifyNotification(headers, raw).out_trade_no, "local-order");
  assert.throws(() => provider.verifyNotification(headers, raw + " "), /signature/);
  assert.throws(() => provider.verifyNotification({ ...headers, "wechatpay-timestamp": "1" }, raw), /unverified/);
  console.log(JSON.stringify({ passed: true, scope: "local-injected-order-provider-and-crypto-regression", realPayment: false, realAi: false, deployed: false,
    verified: ["fixed-100-fen", "owner-and-receipt-validation", "unpaid-no-upload-or-ai", "concurrent-start-once", "saved-result-reuse", "unknown-no-replay", "bounded-refund-state", "close-new-preserve-recovery", "expiry-cleanup", "verified-notification-crypto", "ios-refund-guidance-only", "external-refund-revokes-entitlement", "cleanup-independent-of-payment-network"] }));
}
main().catch(e => { console.error(e); process.exitCode = 1; });
