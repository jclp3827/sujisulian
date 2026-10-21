#!/usr/bin/env node
// Actual payment adapter + isolated SCF simulation. All HTTPS/BDA are injected.
// The shipped hard gate stays false. No real query/payment/delivery is asserted.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), os = require('node:os'), crypto = require('node:crypto'), vm = require('node:vm');
const { createRequire } = require('node:module');
const { assemble } = require('./build-photo-scf');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'photo-order-state-')), bundle = path.join(temp, 'bundle'); assemble(bundle);
const shipped = require(path.join(bundle, 'purchase')), simulated = { exports: {} }, file = path.join(bundle, 'purchase.js');
vm.runInNewContext(fs.readFileSync(file, 'utf8').replace('const CONSUMPTION_SAFE = false;', 'const CONSUMPTION_SAFE = true;'),
  { module: simulated, require: createRequire(file), Buffer, URL, URLSearchParams, Date });
const { inspectJpeg } = require('../miniprogram/subpackages/photo/core/jpeg');
const sample = Buffer.from(require('../miniprogram/subpackages/photo/fixtures/transfer-sample').base64, 'base64');
const image = sample.subarray(0, inspectJpeg(sample).jpegLength), info = inspectJpeg(image);
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const env = { PHOTO_APP_ID: 'test-app', PHOTO_APP_SECRET: 'test-secret', PHOTO_VIRTUAL_OFFER_ID: 'test-offer', PHOTO_VIRTUAL_APP_KEY: 'test-key', PHOTO_VIRTUAL_PRODUCT_ID: 'photo_ai_bg_once',
  PHOTO_PROCESSING_ENABLED: 'true', PHOTO_NEW_ORDERS_ENABLED: 'true', PHOTO_BUDGET_AUTHORIZED: 'true', PHOTO_CHANNEL_ELIGIBILITY_VERIFIED: 'true', PHOTO_PRODUCT_100_FEN_VERIFIED: 'true', PHOTO_PRIVACY_ACCEPTED: 'true', PHOTO_CALLBACK_ACCEPTED: 'true', PHOTO_REAL_FLOW_ACCEPTED: 'true', PHOTO_FREE_RELEASE_ACCEPTED: 'true' };
const clock = 1800000000000, cash = new Map(), log = [];
let ai = 0, loseBda = false, queryFails = false, loseDelivery = false, postDelivery = 4, wrongTransaction = false;
const json = o => ({ status: 200, body: Buffer.from(JSON.stringify(o)) });
async function send(url, options, raw) {
  const u = new URL(url); log.push(u.pathname);
  if (u.pathname === '/sns/jscode2session') return json({ openid: 'alice', session_key: 'test-session' });
  if (u.pathname === '/cgi-bin/stable_token') return json({ access_token: 'test-token', expires_in: 7200 });
  const input = JSON.parse(raw); assert.equal(input.env, 0);
  if (u.pathname === '/xpay/query_order') {
    assert.equal(input.openid, 'alice');
    assert.equal(u.searchParams.get('pay_sig'), crypto.createHmac('sha256', env.PHOTO_VIRTUAL_APP_KEY).update(u.pathname + '&' + raw).digest('hex'));
    if (queryFails) throw new Error('query-unknown');
    return json({ order: { order_id: input.order_id, env_type: 1, ...cash.get(input.order_id) } });
  }
  assert.equal(u.pathname, '/xpay/notify_provide_goods');
  const r = cash.get(input.order_id); r.status = postDelivery;
  if ([5, 8].includes(postDelivery)) r.left_fee = 0;
  if (wrongTransaction) r.wx_order_id = 'unexpected-other-transaction';
  if (loseDelivery) throw new Error('delivery-committed-response-lost');
  return json({ errcode: 0 });
}
function instance(module = simulated.exports) {
  return module.createPurchaseHandler({ env, now: () => clock, send, checkRole() {}, validateImage: value => value,
    dimensions: () => [info.width, info.height], async segment() {
      ai++; if (loseBda) throw new Error('upstream-accepted-but-response-lost');
      return { HasForeground: true, RequestId: 'synthetic-' + ai, ResultImageUrl: 'https://synthetic.cos.ap-guangzhou.myqcloud.com/result.png' };
    } });
}
async function api(h, action, data = {}) {
  const r = await h({ httpMethod: 'POST', path: '/' }, { ...data, action, loginCode: 'test-code' }, {});
  return { status: r.statusCode, value: JSON.parse(r.body) };
}
async function order(status = 2, extra = {}) {
  const p = await api(instance(), 'purchase', { inputHash: hash(image), inputBytes: image.length, inputWidth: info.width, inputHeight: info.height, consent: shipped.TERMS });
  assert.equal(p.status, 200);
  cash.set(p.value.orderId, { status, order_type: 0, order_fee: 100, paid_fee: 100, left_fee: 100, wx_order_id: 'wx-' + p.value.orderId, ...extra });
  return { id: p.value.orderId, ticket: p.value.ticket, imageBase64: image.toString('base64') };
}
async function ready() { const o = await order(), h = instance(), r = await api(h, 'segment', o); assert.equal(r.status, 200); return { o, h, receipt: r.value.receipt }; }
async function main() {
  const matrix = [];
  for (const status of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, null, '2', 99]) {
    const o = await order(status), before = ai, r = await api(instance(), 'segment', o);
    assert.equal(ai - before, status === 2 ? 1 : 0); assert.equal(r.status, status === 2 ? 200 : 503);
    matrix.push({ orderStatus: status, syntheticBdaCalls: ai - before });
  }
  const missing = await order(); delete cash.get(missing.id).status; let before = ai;
  assert.equal((await api(instance(), 'segment', missing)).status, 503); assert.equal(ai, before);
  const partialRefund = await order(2, { left_fee: 50 }); before = ai;
  assert.equal((await api(instance(), 'segment', partialRefund)).status, 503); assert.equal(ai, before);
  const queryUnknown = await order(); queryFails = true; before = ai;
  const queriesBefore = log.filter(p => p === '/xpay/query_order').length;
  assert.equal((await api(instance(), 'segment', queryUnknown)).status, 503); assert.equal(ai, before); queryFails = false;
  assert.equal(log.filter(p => p === '/xpay/query_order').length - queriesBefore, 1);
  // Normal success: result alone never marks delivered. The client receipt is
  // required; successful mark is followed by a fresh platform query returning 4.
  let { o, h, receipt } = await ready();
  const marksBefore = log.filter(p => p === '/xpay/notify_provide_goods').length;
  assert.equal((await api(h, 'delivered', o)).status, 503);
  assert.equal(log.filter(p => p === '/xpay/notify_provide_goods').length, marksBefore);
  const from = log.length, delivered = await api(h, 'delivered', { ...o, receipt });
  assert.equal(delivered.status, 200); assert.equal(delivered.value.wechatOrderStatus, 4);
  const sequence = log.slice(from).filter(p => p.startsWith('/xpay/'));
  assert.deepEqual(sequence, ['/xpay/query_order', '/xpay/notify_provide_goods', '/xpay/query_order']);
  before = ai; assert.equal((await api(h, 'segment', o)).status, 503); assert.equal((await api(instance(), 'segment', o)).status, 503); assert.equal(ai, before);
  // Duplicate clicks before delivery stay within one warm instance.
  o = await order(); h = instance(); before = ai;
  const clicks = await Promise.all([api(h, 'segment', o), api(h, 'segment', o)]); assert.equal(ai - before, 1);
  const got = clicks.find(r => r.status === 200); assert.ok(got);
  await api(h, 'segment', o); assert.equal(ai - before, 1);
  // A lost SCF-to-phone success response can be fetched again from the same
  // instance. This is an explicit replay test, not an automatic client retry.
  before = ai; const cached = await api(h, 'segment', o); assert.equal(cached.value.receipt, got.value.receipt); assert.equal(ai, before);
  const cachedReplayExtraCalls = ai - before;
  // An unknown upstream BDA result blocks every repeat in that warm instance.
  o = await order(); h = instance(); before = ai; loseBda = true;
  assert.equal((await api(h, 'segment', o)).status, 503); loseBda = false;
  assert.equal((await api(h, 'segment', o)).status, 503); assert.equal(ai - before, 1);
  const unknownWarmCalls = ai - before;
  // Cold replay after an unknown upstream remains an explicitly documented risk.
  await api(instance(), 'segment', o); assert.equal(ai - before, 2);
  // Two independent instances can both see platform state 2 before delivery.
  o = await order(); before = ai;
  const concurrent = await Promise.all([api(instance(), 'segment', o), api(instance(), 'segment', o)]);
  assert.ok(concurrent.every(r => r.status === 200)); assert.equal(ai - before, 2);
  // Mark request success with query still 2/3, refund, or receipt mismatch must
  // never be reported as delivery confirmed.
  for (const status of [2, 3, 8]) {
    ({ o, h, receipt } = await ready()); postDelivery = status; before = ai;
    assert.equal((await api(h, 'delivered', { ...o, receipt })).status, 503); assert.equal(ai, before); postDelivery = 4;
  }
  ({ o, h, receipt } = await ready()); wrongTransaction = true;
  assert.equal((await api(h, 'delivered', { ...o, receipt })).status, 503); wrongTransaction = false;
  // Delivery committed but response lost: a later query sees 4, replay is denied
  // and another delivery confirmation does not send notify again.
  ({ o, h, receipt } = await ready()); loseDelivery = true;
  assert.equal((await api(h, 'delivered', { ...o, receipt })).status, 503); loseDelivery = false;
  const later = await api(instance(), 'status', { ...o, receipt }); assert.equal(later.value.wechatOrderStatus, 4);
  before = ai; assert.equal((await api(instance(), 'segment', o)).status, 503); assert.equal(ai, before);
  const markCount = log.filter(p => p === '/xpay/notify_provide_goods').length;
  assert.equal((await api(instance(), 'delivered', { ...o, receipt })).status, 200);
  assert.equal(log.filter(p => p === '/xpay/notify_provide_goods').length, markCount);
  const blocked = await api(instance(shipped), 'segment', await order()); assert.equal(blocked.value.error, 'PHOTO_PAID_CONSUMPTION_BLOCKED');
  console.log(JSON.stringify({ passed: true, stateMatrix: matrix, missingStateRejected: true, partialRefundRejected: true, queryUnknownRejectedWithoutRetry: true,
    deliverySequence: sequence, deliveryQueryRequired: true, deliveredReplaySameAndColdInstanceRejected: true, duplicateClickWarmBdaCalls: 1,
    lostSuccessReplyWarmReplayExtraBdaCalls: cachedReplayExtraCalls, unknownBdaSameWarmTotalCalls: unknownWarmCalls, unknownColdReplaySyntheticBdaCalls: 2, independentInstanceConcurrentSyntheticBdaCalls: 2,
    deliveryLagRefundAndChangedTransactionUnconfirmed: true, lostDeliveryReplyThenQuery4RejectsReplay: true,
    realWechatQuery: false, realPayment: false, realBdaCalls: 0, isolatedSimulationBypass: true, shippedPaidHardBlocked: true, deployed: false,
    residualRisk: 'A query observing status 2 is not a shared atomic consumption claim; parallel instances or state changes after query can still race before platform delivery.' }));
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => fs.rmSync(temp, { recursive: true, force: true }));
