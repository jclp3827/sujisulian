#!/usr/bin/env node
// Offline WeChat protocol + client failure-path checks; no live payment or AI.
const assert = require('node:assert/strict'), fs = require('node:fs'), os = require('node:os'), path = require('node:path'), crypto = require('node:crypto'), vm = require('node:vm');
const { createRequire } = require('node:module');
const { assemble } = require('./build-photo-scf');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'photo-minimal-test-')), bundle = path.join(temp, 'bundle');
assemble(bundle);
const shipped = require(path.join(bundle, 'purchase'));
const { TERMS } = shipped;
// Isolated protocol simulation ONLY. The deployable server has a hard stop;
// this VM bypass is not a configuration option or a claim of safe consumption.
const simulation = { exports: {} }, purchaseFile = path.join(bundle, 'purchase.js');
vm.runInNewContext(fs.readFileSync(purchaseFile, 'utf8').replace('const CONSUMPTION_SAFE = false;', 'const CONSUMPTION_SAFE = true;'),
  { module: simulation, require: createRequire(purchaseFile), Buffer, URL, URLSearchParams, Date });
const { createPurchaseHandler } = simulation.exports;
const { encrypt } = require(path.join(bundle, 'shared/notify'));
const { inspectJpeg } = require('../miniprogram/subpackages/photo/core/jpeg');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const sample = Buffer.from(require('../miniprogram/subpackages/photo/fixtures/transfer-sample').base64, 'base64');
const image = sample.subarray(0, inspectJpeg(sample).jpegLength), size = inspectJpeg(image);
const env = { PHOTO_APP_ID: 'test-app', PHOTO_APP_SECRET: 'test-app-secret', PHOTO_VIRTUAL_OFFER_ID: 'test-offer', PHOTO_VIRTUAL_PRODUCT_ID: 'photo_ai_bg_once', PHOTO_VIRTUAL_APP_KEY: 'test-key',
  PHOTO_PROCESSING_ENABLED: 'true', PHOTO_NEW_ORDERS_ENABLED: 'true', PHOTO_BUDGET_AUTHORIZED: 'true', PHOTO_REAL_FLOW_ACCEPTED: 'true', PHOTO_FREE_RELEASE_ACCEPTED: 'true', PHOTO_CALLBACK_ACCEPTED: 'true', PHOTO_CHANNEL_ELIGIBILITY_VERIFIED: 'true', PHOTO_PRODUCT_100_FEN_VERIFIED: 'true', PHOTO_PRIVACY_ACCEPTED: 'true', PHOTO_IOS_IAP_ACCEPTED: 'true',
  PHOTO_PUSH_TOKEN: 't'.repeat(32), PHOTO_PUSH_AES_KEY: Buffer.alloc(32, 7).toString('base64').slice(0, 43) };
let clock = 1800000000000, codes = 0, ai = 0, acknowledges = 0, roleMissing = false, unknown = false;
const receipts = new Map(), actions = [], usedCodes = new Set();
const json = value => ({ status: 200, body: Buffer.from(JSON.stringify(value)) });
async function send(url, options, raw) {
  assert.ok(options.timeout > 0 && options.timeout <= 20000);
  const u = new URL(url);
  if (u.pathname === '/sns/jscode2session') {
    const code = u.searchParams.get('js_code'); assert.ok(!usedCodes.has(code)); usedCodes.add(code);
    return json({ openid: code.startsWith('bob-') ? 'bob' : 'alice', session_key: 'local-session' });
  }
  if (u.pathname === '/cgi-bin/stable_token') return json({ access_token: 'local-token', expires_in: 7200 });
  const input = JSON.parse(raw); assert.equal(input.env, 0);
  if (u.pathname !== '/xpay/notify_provide_goods') assert.equal(u.searchParams.get('pay_sig'), crypto.createHmac('sha256', env.PHOTO_VIRTUAL_APP_KEY).update(u.pathname + '&' + raw).digest('hex'));
  if (u.pathname === '/xpay/query_order') return json({ order: { order_id: input.order_id, env_type: 1, status: 1, ...receipts.get(input.order_id) } });
  assert.equal(u.pathname, '/xpay/notify_provide_goods'); acknowledges++; receipts.get(input.order_id).status = 4; return json({ errcode: 0 });
}
function factory(overrides = {}, create = createPurchaseHandler) { return create({ env, now: () => clock, send, checkRole() { if (roleMissing) throw new Error('missing'); },
  dimensions: b => { const s = inspectJpeg(b); return [s.width, s.height]; }, validateImage(value) { const b = Buffer.from(value || '', 'base64'); assert.equal(b.toString('base64'), value); inspectJpeg(b); return value; },
  async segment(value) { ai++; assert.equal(value, image.toString('base64')); if (unknown) throw new Error('upstream-unknown'); return { HasForeground: true, RequestId: 'local-' + ai, ResultImageUrl: 'https://synthetic.cos.ap-guangzhou.myqcloud.com/result.png' }; }, ...overrides }); }
let handler = factory();
async function api(action, data = {}, owner = 'alice', h = handler) {
  actions.push(action);
  const input = { ...data, action, loginCode: owner + '-' + ++codes };
  const r = await h({ httpMethod: 'POST', path: '/' }, input, {});
  return { status: r.statusCode, data: JSON.parse(r.body) };
}
const input = { inputHash: hash(image), inputBytes: image.length, inputWidth: size.width, inputHeight: size.height, consent: TERMS };
async function purchase() { const r = await api('purchase', input); assert.equal(r.status, 200); return r.data; }
function pay(id) { receipts.set(id, { status: 2, wx_order_id: 'wx-' + id, order_type: 0, order_fee: 100, paid_fee: 100, left_fee: 100 }); }
async function main() {
  assert.equal(shipped.CONSUMPTION_SAFE, false);
  const protectedHandler = factory({ env: { ...env, PHOTO_CONSUMPTION_SAFE: 'true' } }, shipped.createPurchaseHandler);
  const protectedFeatures = await api('features', {}, 'alice', protectedHandler);
  assert.equal(protectedFeatures.data.newOrdersEnabled, false); assert.equal(protectedFeatures.data.processingEnabled, false);
  assert.equal(protectedFeatures.data.consumptionSafe, false);
  for (const action of ['purchase', 'payment', 'segment']) {
    const blocked = await api(action, input, 'alice', protectedHandler);
    assert.equal(blocked.data.error, 'PHOTO_PAID_CONSUMPTION_BLOCKED');
  }
  assert.equal(ai, 0);
  assert.equal((await api('features')).data.flow, 'single-scf');
  roleMissing = true; assert.equal((await api('features')).data.newOrdersEnabled, false); roleMissing = false;
  const spoof = await api('purchase', { ...input, owner: 'bob', priceFen: 1, orderId: 'P' + 'f'.repeat(30) });
  assert.equal(spoof.status, 200);
  const spoofTicket = JSON.parse(Buffer.from(spoof.data.ticket.split('.')[0], 'base64url').toString());
  assert.equal(spoofTicket.owner, 'alice'); assert.equal(spoofTicket.priceFen, 100); assert.notEqual(spoofTicket.id, 'P' + 'f'.repeat(30));
  assert.equal(JSON.parse(spoof.data.parameters.signData).goodsPrice, 100);
  const p = await purchase(), sign = JSON.parse(p.parameters.signData);
  assert.equal(sign.outTradeNo, p.orderId); assert.equal(sign.goodsPrice, 100); assert.equal(sign.buyQuantity, 1); assert.equal(sign.env, 0);
  const ticketBody = JSON.parse(Buffer.from(p.ticket.split('.')[0], 'base64url').toString());
  assert.equal(ticketBody.owner, 'alice'); assert.equal(ticketBody.inputBytes, image.length); assert.equal(ticketBody.priceFen, 100);
  assert.equal(ticketBody.inputHash, input.inputHash); assert.equal(ticketBody.productId, env.PHOTO_VIRTUAL_PRODUCT_ID);
  assert.equal(JSON.parse(sign.attach).inputHash, input.inputHash);
  assert.equal(p.parameters.signature, crypto.createHmac('sha256', 'local-session').update(p.parameters.signData).digest('hex'));
  const start = { ticket: p.ticket, imageBase64: image.toString('base64') };
  assert.equal((await api('segment', start)).status, 503); assert.equal(ai, 0);
  pay(p.orderId);
  assert.equal((await api('segment', { ...start, ticket: p.ticket + 'x' })).status, 503);
  assert.equal((await api('segment', start, 'bob')).status, 503); assert.equal(ai, 0);
  receipts.get(p.orderId).paid_fee = 1; assert.equal((await api('segment', start)).status, 503); receipts.get(p.orderId).paid_fee = 100;
  const changedImage = Buffer.concat([image, Buffer.from([0])]).toString('base64');
  assert.equal((await api('segment', { ...start, imageBase64: changedImage })).status, 503);
  assert.equal((await api('segment', start, 'alice', factory({ env: { ...env, PHOTO_VIRTUAL_PRODUCT_ID: 'other' } }))).status, 503);
  assert.equal(ai, 0);
  const parallel = await Promise.all([api('segment', start), api('segment', start)]);
  assert.equal(ai, 1); const result = parallel.find(r => r.status === 200).data; assert.equal(result.task, 'ready'); assert.ok(result.receipt);
  assert.equal((await api('segment', start)).status, 200); assert.equal(ai, 1); // Same warm instance returns reference, not AI.
  assert.equal(acknowledges, 0); // BDA returning a URL is not client delivery.
  handler = factory();
  const restored = await api('status', { ticket: p.ticket, receipt: result.receipt }); assert.equal(restored.data.task, 'ready'); assert.equal(ai, 1);
  assert.equal((await api('delivered', { ticket: p.ticket })).status, 503);
  assert.equal((await api('delivered', { ticket: p.ticket, receipt: result.receipt })).status, 200); assert.equal(acknowledges, 1);
  assert.equal((await api('segment', start)).status, 503); assert.equal(ai, 1);
  const closed = factory({ env: { ...env, PHOTO_NEW_ORDERS_ENABLED: 'false' } });
  assert.equal((await api('purchase', input, 'alice', closed)).status, 503);
  assert.equal((await api('status', { ticket: p.ticket, receipt: result.receipt }, 'alice', closed)).data.task, 'ready');
  const event = { MsgType: 'event', Event: 'xpay_goods_deliver_notify', OpenId: 'alice', OutTradeNo: p.orderId, Env: 0, GoodsInfo: { ProductId: env.PHOTO_VIRTUAL_PRODUCT_ID, Quantity: 1 }, WeChatPayInfo: { MchOrderNo: 'wx-' + p.orderId } };
  const encrypted = encrypt(env, JSON.stringify(event), () => clock);
  const notify = { httpMethod: 'POST', path: '/notify', queryString: { timestamp: encrypted.timestamp, nonce: encrypted.nonce, msg_signature: encrypted.msgsignature } };
  assert.equal((await handler(notify, { Encrypt: encrypted.encrypt }, {})).statusCode, 200); assert.equal(ai, 1);
  assert.equal((await handler(notify, event, {})).statusCode, 503); assert.equal(ai, 1);
  receipts.get(p.orderId).left_fee = 0; receipts.get(p.orderId).status = 8;
  const refund = await api('status', { ticket: p.ticket, receipt: result.receipt }); assert.equal(refund.data.refund, 'refunded'); assert.equal(refund.data.download, undefined);
  const timeout = await purchase(); pay(timeout.orderId); unknown = true;
  assert.equal((await api('segment', { ticket: timeout.ticket, imageBase64: image.toString('base64') })).status, 503);
  const afterUnknown = ai; assert.equal((await api('segment', { ticket: timeout.ticket, imageBase64: image.toString('base64') })).status, 503); assert.equal(ai, afterUnknown); unknown = false;
  // Documented limitation: a cold instance has no persistent consumption claim.
  // This test uses synthetic AI, never a real request, and does not claim exactly-once.
  assert.equal((await api('segment', { ticket: timeout.ticket, imageBase64: image.toString('base64') }, 'alice', factory())).status, 200); assert.equal(ai, afterUnknown + 1);
  clock += 31 * 60000;
  assert.equal((await api('segment', { ticket: timeout.ticket, imageBase64: image.toString('base64') }, 'alice', factory())).status, 503);

  const file = path.resolve(__dirname, '../miniprogram/subpackages/photo/platform/paid.js'), mod = { exports: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8').replace('const PAID_ENABLED = false;', 'const PAID_ENABLED = true;'), { module: mod, require: createRequire(file), Date, Uint8Array });
  const storage = {}, disk = new Map([['work.jpg', image]]); let paid = false, cancel = true, failSegment = false, clientAi = 0, purchases = 0, payments = 0, downloads = 0, downloadFails = true;
  const orderId = 'P' + 'a'.repeat(30);
  const view = () => ({ flow: 'single-scf', orderId, inputHash: hash(image), payment: paid ? 'paid' : 'unpaid', refund: 'none', task: storage['photo-ai-pending-v1'] && storage['photo-ai-pending-v1'].receipt ? 'ready' : 'not-started', platform: 'android', canRefund: paid });
  const service = { configured: true, async request(action, value) {
    if (action === 'features') return { newOrdersEnabled: true, consumptionSafe: true, priceFen: 100, flow: 'single-scf', channel: 'virtual', iosEnabled: true };
    if (action === 'purchase') { purchases++; assert.equal(value.imageBase64, undefined); return { orderId, ticket: 'server-signed-ticket', parameters: { mode: 'short_series_goods' } }; }
    if (action === 'payment') return { parameters: { mode: 'short_series_goods' } };
    if (action === 'segment') { clientAi++; assert.equal(storage['photo-ai-pending-v1'].submitted, true); if (failSegment) throw new Error('timeout'); return { ...view(), task: 'ready', receipt: 'server-result-receipt', result: { width: size.width, height: size.height }, download: { url: 'https://synthetic.cos.ap-guangzhou.myqcloud.com/result.png', expiresAt: Date.now() + 60000 } }; }
    if (action === 'status') return view();
    if (action === 'delivered') return { acknowledged: true };
    throw new Error('Unexpected action: ' + action);
  } };
  const wx = { getStorageSync: key => storage[key] && structuredClone(storage[key]), setStorageSync: (key, value) => { storage[key] = structuredClone(value); }, removeStorageSync: key => { delete storage[key]; },
    getFileSystemManager: () => ({ readFileSync: key => disk.get(key), unlink(o) { disk.delete(o.filePath); o.success({}); } }),
    arrayBufferToBase64: value => Buffer.from(value).toString('base64'), getAppBaseInfo: () => ({ version: '8.0.68' }), getDeviceInfo: () => ({ platform: 'android' }),
    requestVirtualPayment(o) { payments++; if (cancel) o.fail({ errMsg: 'requestVirtualPayment:fail cancel' }); else { paid = true; o.success({}); } },
    downloadFile(o) { downloads++; if (downloadFails) return o.fail({ errMsg: 'downloadFile:fail' }); disk.set('temp.png', png); o.success({ statusCode: 200, tempFilePath: 'temp.png' }); },
    getImageInfo(o) { o.success({ width: size.width, height: size.height }); }, saveFile(o) { disk.set('saved.png', disk.get(o.tempFilePath)); o.success({ savedFilePath: 'saved.png' }); } };
  const client = mod.exports.createPaid(wx, service), record = { path: 'work.jpg', sha256: hash(image), bytes: image.length, width: size.width, height: size.height };
  assert.equal((await client.buy(record, TERMS)).cancelled, true); assert.equal(clientAi, 0); assert.equal(purchases, 1);
  cancel = false; const ready = await client.buy(record, TERMS); assert.equal(clientAi, 1); assert.equal(purchases, 1); assert.equal(payments, 2);
  assert.equal(storage['photo-ai-pending-v1'].receipt, 'server-result-receipt'); assert.equal(storage['photo-ai-pending-v1'].parameters, undefined);
  assert.equal((await client.buy(record, TERMS)).task, 'ready'); assert.equal(clientAi, 1); assert.equal(payments, 2);
  const png = Buffer.alloc(33); Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex').copy(png); png.writeUInt32BE(size.width, 16); png.writeUInt32BE(size.height, 20);
  await assert.rejects(client.download(ready)); assert.equal(clientAi, 1);
  downloadFails = false; assert.equal((await client.download(ready)).persistent, true);
  assert.equal((await client.download({ ...ready, download: undefined })).local, true); assert.equal(downloads, 2); assert.equal(clientAi, 1);
  storage['photo-ai-local-result-v1'].savedAt -= 25 * 3600000; await client.prune(); assert.equal(disk.has('saved.png'), false);
  delete storage['photo-ai-pending-v1']; paid = false; failSegment = true;
  await assert.rejects(client.buy(record, TERMS)); const dispatched = clientAi;
  await assert.rejects(mod.exports.createPaid(wx, service).buy(record, TERMS)); assert.equal(clientAi, dispatched); assert.equal((await client.status()).task, 'unknown');
  assert.match((await client.refund()).refundGuidance, /尚未自动提交退款/);
  assert.equal(require('../miniprogram/subpackages/photo/platform/paid').PAID_ENABLED, false);
  assert.equal(require('../miniprogram/subpackages/photo/platform/scf-purchase').SCF_PURCHASE_CONFIGURED, false);
  const transportFile = path.resolve(__dirname, '../miniprogram/subpackages/photo/platform/scf-purchase.js'), transportMod = { exports: {} };
  vm.runInNewContext(fs.readFileSync(transportFile, 'utf8').replace('const SCF_PURCHASE_CONFIGURED = false;', 'const SCF_PURCHASE_CONFIGURED = true;'), { module: transportMod, require: createRequire(transportFile) });
  let loginCount = 0, requestCount = 0;
  const transport = transportMod.exports.createScfPurchase({ login(o) { o.success({ code: 'fresh-' + ++loginCount }); }, request(o) {
    requestCount++; assert.equal(o.data.loginCode, 'fresh-' + loginCount); assert.equal(o.header['x-photo-token'], undefined);
    if (requestCount === 2) o.fail({ errMsg: 'request:fail timeout' }); else o.success({ statusCode: 200, data: { ok: true } });
  } });
  await transport.request('status', { loginCode: 'forged' }); await assert.rejects(transport.request('segment', {}));
  assert.equal(loginCount, 2); assert.equal(requestCount, 2);
  console.log(JSON.stringify({ passed: true, shippedServerHardBlocked: true, protocolSimulationBypass: true, realPayment: false, realAi: false, deployed: false, npmDependencies: 0, strictCrossInstanceExactlyOnce: false,
    verified: ['one-existing-SCF', 'fixed-100-fen-and-server-session-signature', 'WeChat-query-authority', 'unpaid-tampered-other-owner-wrong-amount-no-AI', 'warm-concurrent-guard', 'cold-result-query-with-receipt-no-AI', 'receipt-required-for-delivery', 'delivered-refunded-no-AI', 'closed-new-purchases-preserve-query', 'safe-notify-never-runs-AI', 'unknown-no-client-replay-across-restart', 'cancel-reopens-same-unpaid-trade', 'one-client-dispatch', 'download-only-retry-and-local-cleanup', 'manual-refund-guidance-not-fake-submission', 'paid-and-endpoint-closed'], simulationLimitationVerified: 'The isolated protocol bypass remains replayable across cold instances; shipped paid calls are hard-blocked.' }));
}
main().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => fs.rmSync(temp, { recursive: true, force: true }));
