#!/usr/bin/env node
// Full product state tests using the real SCF/client code and an injected WeChat/BDA transport.
// No live network, orders, payments or provider calls.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const crypto = require('node:crypto'), vm = require('node:vm'), { createRequire } = require('node:module');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
// A validation run must not overwrite the archived evidence of an older candidate.
const reportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'photo-preview-report-'));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'photo-preview-state-'));
const { assemble } = require('./build-photo-scf'); assemble(path.join(scratch, 'scf'));
const { createPurchaseHandler } = require(path.join(scratch, 'scf/purchase'));
const { createUsageStore } = require(path.join(scratch, 'scf/usage-store'));
const { encrypt } = require(path.join(scratch, 'scf/shared/notify'));
const { createPreviewPaid, TERMS } = require('../miniprogram/subpackages/photo/platform/preview-paid');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
execFileSync('python3', ['-c', 'from PIL import Image; from pathlib import Path; import sys; p=Path(sys.argv[1]); [(Image.new("RGB",(600,800),(60+i*15,100,150)).save(p/f"work-{i}.jpg",quality=95)) for i in range(12)]; Image.new("RGBA",(600,800),(120,80,70,200)).save(p/"result.png")', scratch]);
const records = Array.from({ length: 12 }, (_, i) => {
  const file = path.join(scratch, `work-${i}.jpg`), bytes = fs.readFileSync(file);
  return { path: file, width: 600, height: 800, bytes: bytes.length, sha256: hash(bytes) };
});
const checks = [];
function harness(publicMode = false) {
  const env = { PHOTO_APP_ID: 'app', PHOTO_APP_SECRET: 'private-app-secret', PHOTO_VIRTUAL_APP_KEY: 'private-key',
    PHOTO_VIRTUAL_OFFER_ID: 'offer', PHOTO_VIRTUAL_PRODUCT_ID: 'photo_ai_bg_once_3', PHOTO_TEST_PAYMENT_AUTHORIZED: 'true',
    PHOTO_TEST_PAYER_OPENIDS: 'sha256:' + hash('alice'), PHOTO_CALLBACK_CONFIGURED: 'true', PHOTO_PREVIEW_AUTHORIZED: 'true',
    PHOTO_TEST_TRIAL_REVISION: 'round-1',
    PHOTO_BUDGET_AUTHORIZED: 'true', PHOTO_PROCESSING_ENABLED: 'true', PHOTO_NEW_ORDERS_ENABLED: 'true',
    PHOTO_PRIVACY_ACCEPTED: 'true', PHOTO_CHANNEL_ELIGIBILITY_VERIFIED: 'true', PHOTO_PRODUCT_100_FEN_VERIFIED: 'true', PHOTO_IOS_IAP_CONFIGURED: 'true' };
  if (publicMode) Object.assign(env, { PHOTO_TEST_PAYMENT_AUTHORIZED: 'false', PHOTO_PUBLIC_ENABLED: 'true',
    PHOTO_DATABASE_ACCEPTED: 'true', PHOTO_FREE_RELEASE_ACCEPTED: 'true', PHOTO_REAL_FLOW_ACCEPTED: 'true',
    PHOTO_CALLBACK_ACCEPTED: 'true', PHOTO_MAX_AI_CALLS_PER_DAY: '100', PHOTO_IOS_IAP_ACCEPTED: 'true',
    PHOTO_CLOUDBASE_ENV: 'cloud1-d8gw5r2il0c0f198a', PHOTO_PUSH_TOKEN: 't'.repeat(32),
    PHOTO_PUSH_AES_KEY: Buffer.alloc(32, 7).toString('base64').slice(0, 43) });
  let owner = 'alice', lastSession = '', logins = 0, bda = 0, native = 0, deliveries = 0;
  let mode = 'success', queryError = false, queryLag = 0, loseSegment = false, bdaFailure = false, holdBda = null, nativeHeld = null;
  const orders = new Map(), store = new Map(), requests = [], phases = [];
  const documents = new Map(); let transactionQueue = Promise.resolve();
  const db = { collection(name) { return { doc(id) { return { async get() {
    const key = name + '/' + id;
    return { data: documents.has(key) ? structuredClone(documents.get(key)) : null };
  } }; } }; }, runTransaction(action) {
    const result = transactionQueue.then(async () => {
      const draft = new Map(documents);
      const transaction = { collection(name) { return { doc(id) { const key = name + '/' + id; return {
        async get() { return { data: draft.has(key) ? structuredClone(draft.get(key)) : null }; },
        async set(value) { draft.set(key, structuredClone(value)); return { updated: 1 }; }
      }; } }; } };
      const value = await action(transaction);
      for (const [key, item] of draft) documents.set(key, item);
      return value;
    });
    transactionQueue = result.catch(() => {}); return result;
  } };
  const answer = body => ({ status: 200, body: Buffer.from(JSON.stringify(body)) });
  async function send(url, options, raw) {
    const u = new URL(url), body = raw ? JSON.parse(raw) : {};
    if (u.pathname === '/sns/jscode2session') { lastSession = 'session-' + u.searchParams.get('js_code'); return answer({ openid: owner, session_key: lastSession }); }
    if (u.pathname === '/cgi-bin/stable_token') return answer({ access_token: 'private-access-token', expires_in: 7200 });
    if (u.pathname === '/xpay/query_order') {
      if (queryError) return answer({ errcode: -123 });
      const order = orders.get(body.order_id);
      assert.equal(body.openid, owner); assert.equal(body.env, 0);
      if (!order) return answer({ errcode: -999 });
      const visible = queryLag > 0 && order.status === 2 ? { ...order, status: 1, paid_fee: 0 } : order;
      if (queryLag > 0 && order.status === 2) queryLag--;
      phases.push(visible.status); return answer({ errcode: 0, order: visible });
    }
    if (u.pathname === '/xpay/notify_provide_goods') {
      const expected = crypto.createHmac('sha256', env.PHOTO_VIRTUAL_APP_KEY).update(u.pathname + '&' + raw).digest('hex');
      if (u.searchParams.get('pay_sig') !== expected) return answer({ errcode: 268490002, errmsg: 'missing or invalid pay_sig' });
      assert.equal(options.headers['Content-Length'], Buffer.byteLength(raw));
      deliveries++; orders.get(body.order_id).status = 4; return answer({ errcode: 0 });
    }
    if (u.hostname === 'result.myqcloud.com') return { status: 200, headers: { 'content-type': 'image/png' }, body: fs.readFileSync(path.join(scratch, 'result.png')) };
    throw Error('Unexpected HTTP destination');
  }
  const options = { env, send, checkRole() {}, usageStore: publicMode ? createUsageStore(db) : null,
    validateImage: image => image,
    dimensions: () => [600, 800],
    segment: async () => {
      bda++; if (holdBda) await holdBda;
      if (bdaFailure) throw Error('provider-timeout');
      return { HasForeground: true, RequestId: 'mock-bda-' + bda, ResultImageUrl: 'https://result.myqcloud.com/synthetic.png' };
    } };
  let server = createPurchaseHandler(options);
  async function dispatch(action, data = {}) {
    requests.push(action);
    const output = await server({ httpMethod: 'POST' }, { ...data, action, loginCode: 'code-' + (++logins) }, {});
    return { statusCode: output.statusCode, data: JSON.parse(output.body) };
  }
  async function notify(orderId, changes = {}) {
    const order = orders.get(orderId), payload = { MsgType: 'event', Event: 'xpay_goods_deliver_notify', Env: 0,
      OpenId: owner, OutTradeNo: orderId, GoodsInfo: { ProductId: env.PHOTO_VIRTUAL_PRODUCT_ID, Quantity: 1 },
      WeChatPayInfo: { MchOrderNo: order.wx_order_id }, ...changes };
    const encrypted = encrypt(env, JSON.stringify(payload));
    return server({ httpMethod: 'POST', path: '/notify', queryString: { timestamp: encrypted.timestamp,
      nonce: encrypted.nonce, msg_signature: encrypted.msgsignature } }, { Encrypt: encrypted.encrypt }, {});
  }
  const wx = {
    getAccountInfoSync: () => ({ miniProgram: { envVersion: 'develop' } }),
    getAppBaseInfo: () => ({ version: '8.0.75', SDKVersion: '3.17.4' }), getDeviceInfo: () => ({ platform: 'ios' }), canIUse: () => true,
    getStorageSync: key => store.has(key) ? JSON.parse(JSON.stringify(store.get(key))) : undefined,
    setStorageSync: (key, value) => store.set(key, JSON.parse(JSON.stringify(value))), removeStorageSync: key => store.delete(key),
    getFileSystemManager: () => ({ readFileSync: fs.readFileSync, unlink: o => o.success({}) }),
    arrayBufferToBase64: b => Buffer.from(b).toString('base64'), base64ToArrayBuffer: b => Uint8Array.from(Buffer.from(b, 'base64')).buffer,
    login: o => o.success({ code: 'code-' + (++logins) }),
    request(o) {
      requests.push(o.data.action);
      server({ httpMethod: 'POST' }, o.data, {}).then(output => {
        if (loseSegment && o.data.action === 'preview-segment') { loseSegment = false; o.fail({ errMsg: 'request:fail timeout' }); }
        else o.success({ statusCode: output.statusCode, data: JSON.parse(output.body) });
      }, o.fail);
    },
    requestVirtualPayment(o) {
      native++; const sign = JSON.parse(o.signData);
      assert.equal(sign.env, 0); assert.equal(sign.goodsPrice, 100); assert.equal(sign.productId, 'photo_ai_bg_once_3');
      assert.equal(o.paySig, crypto.createHmac('sha256', env.PHOTO_VIRTUAL_APP_KEY).update('requestVirtualPayment&' + o.signData).digest('hex'));
      assert.equal(o.signature, crypto.createHmac('sha256', lastSession).update(o.signData).digest('hex'));
      orders.set(sign.outTradeNo, { order_id: sign.outTradeNo, env_type: 1, wx_order_id: 'wx-' + sign.outTradeNo,
        order_fee: 100, paid_fee: mode === 'cancel' || mode === 'failure' ? 0 : 100, left_fee: 100, order_type: 7,
        status: mode === 'cancel' || mode === 'failure' ? 1 : 2 });
      if (mode === 'hold') nativeHeld = o;
      else if (mode === 'cancel') o.fail({ errCode: -2, errMsg: 'requestVirtualPayment:fail cancel' });
      else if (mode === 'failure') o.fail({ errCode: -15006, errMsg: 'requestVirtualPayment:fail' });
      else if (mode === 'lost-callback') o.fail({ errCode: -1, errMsg: 'requestVirtualPayment:fail timeout' });
      else o.success({});
    },
    downloadFile: () => { throw Error('preview result must use SCF transport'); },
    getImageInfo: o => o.success({ width: 600, height: 800, type: 'png' })
  };
  // Toggle only the build gate in an isolated VM, leaving transport/signing paths real.
  const module = { exports: {} }, filename = path.join(root, 'miniprogram/subpackages/photo/platform/scf-purchase.js');
  let nativeTimer;
  vm.runInNewContext(fs.readFileSync(filename, 'utf8').replace('const SCF_PURCHASE_CONFIGURED = false;', 'const SCF_PURCHASE_CONFIGURED = true;'), { module, require: createRequire(filename), Promise, Error, Number,
    setTimeout: fn => { nativeTimer = fn; return 1; }, clearTimeout: () => { nativeTimer = null; } });
  const service = module.exports.createScfPurchase(wx), client = createPreviewPaid(wx, service, true, async () => {});
  const files = { read: async file => fs.readFileSync(file), writeVerified: async (data, ext) => ({ path: 'saved.' + ext, bytes: data.length, sha256: hash(data) }) };
  return { env, wx, store, orders, requests, phases, client, service, files, dispatch, notify,
    counters: () => ({ bda, native, deliveries, logins }), setMode: value => { mode = value; },
    queryError: value => { queryError = value; }, queryLag: value => { queryLag = value; }, loseSegment: () => { loseSegment = true; },
    bdaFailure: () => { bdaFailure = true; }, cold: () => { server = createPurchaseHandler(options); },
    owner: value => { owner = value; }, holdBda: value => { holdBda = value; }, nativeHeld: () => nativeHeld, expireNative: () => nativeTimer() };
}
async function check(name, action) { await action(); checks.push(name); }

async function pageExport(ai, allow, confirmPayment) {
  let definition, exports = 0, authCalls = 0, buys = 0;
  const file = path.join(root, 'miniprogram/subpackages/photo/process/index.js');
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { Page: p => { definition = p; }, wx: {}, require: createRequire(file), setTimeout, clearTimeout, Uint8Array, Date });
  const candidate = { revision: 1, record: { sha256: 'a'.repeat(64) }, generated: { profileId: 'test', info: { width: 295, height: 413 } }, aiResult: ai ? { receipt: 'opaque', resultId: 'V' } : null };
  const page = { ...definition, data: { ...definition.data, allowed: true, canShare: true, contentConfirmed: true }, _alive: true, _revision: 1, _candidate: candidate,
    _processor: { profile: { id: 'test', exportPrefix: 'photo' } }, setData(value) { Object.assign(this.data, value); },
    _preview: { authorizeExport: async () => { authCalls++; return allow || (confirmPayment && authCalls > 1); }, summary: () => ({ remaining: 3 }), hasEntitlement: () => allow },
    purchaseAi: async () => { buys++; return confirmPayment; }, _files: { share: async (record, filename, valid) => { assert(valid()); exports++; } } };
  await page.exportCandidate(); return { exports, authCalls, buys };
}
(async () => {
  await check('three real mocked previews; fourth blocked; reuse and downloads do not consume', async () => {
    const h = harness(); let result;
    for (const record of records.slice(0, 3)) result = await h.client.preview(record);
    assert.equal(h.counters().bda, 3); assert.equal(h.client.summary().remaining, 0);
    await assert.rejects(h.client.preview(records[3]), /次数已用完/);
    assert.equal((await h.client.preview(records[2])).resultId, result.resultId);
    await h.client.download(result, h.files); await h.client.download(result, h.files);
    assert.equal(h.counters().bda, 3); assert.equal(h.counters().native, 0);
    assert.equal(await h.client.authorizeExport(result), false);
  });
  await check('expired cached preview keeps its spent slot but allows an explicit remaining-use retry', async () => {
    const h = harness(), result = await h.client.preview(records[0]);
    assert.equal(h.client.summary().remaining, 2); assert.equal(h.counters().bda, 1);
    result.download.expiresAt = Date.now() - 1;
    await assert.rejects(h.client.download(result, h.files), error => error.code === 'RESULT_EXPIRED');
    assert.equal(h.client.releaseExpired(result), true);
    assert.equal(h.client.summary().remaining, 2); assert.equal(h.counters().bda, 1);
    const retried = await h.client.preview(records[0]);
    assert.notEqual(retried.resultId, result.resultId);
    assert.equal(h.client.summary().remaining, 1); assert.equal(h.counters().bda, 2);
  });
  await check('controlled test revision resets trial slots while preserving a pending order', async () => {
    const h = harness();
    for (const record of records.slice(0, 3)) await h.client.preview(record);
    h.queryError(true); assert.equal((await h.client.buy(null)).payment, 'unknown');
    const before = h.wx.getStorageSync('photo-preview-export-v1');
    assert(before.pending); assert.equal(before.trialUsed, 3);
    h.env.PHOTO_TEST_TRIAL_REVISION = 'round-2';
    assert.equal(await h.client.available(), true);
    const reset = h.wx.getStorageSync('photo-preview-export-v1');
    assert.equal(reset.trialUsed, 0); assert.equal(reset.trialRevision, 'round-2');
    assert.deepEqual(reset.pending, before.pending);
    h.queryError(false); await h.client.preview(records[3]);
    assert.equal(h.client.summary().remaining, 2); assert.equal(h.counters().bda, 4);
  });
  await check('durable feature state survives cleared phone storage and restores paid uses', async () => {
    const h = harness(), original = h.service.request;
    const grant = { orderId: 'P' + 'a'.repeat(30), ticket: 'server-signed-ticket', currentResultId: null,
      used: 1, payment: 'paid', refund: 'none' };
    h.service.request = async (action, data) => {
      if (action !== 'preview-features') return original(action, data);
      return { ...await original(action, data), globalConsumptionGuarantee: true, trialUsed: 3, activeOrder: grant };
    };
    assert.equal(await h.client.available(), true);
    assert.equal(h.client.summary().remaining, 2);
    h.store.delete('photo-preview-export-v1');
    assert.equal(await h.client.available(), true);
    assert.equal(h.client.summary().remaining, 2);
    const saved = h.wx.getStorageSync('photo-preview-export-v1');
    assert.equal(saved.trialUsed, 3); assert.equal(saved.grants[0].orderId, grant.orderId);
    assert.equal(saved.grants[0].used, 1);
  });
  await check('public end-to-end quota and paid rights survive cache clearing and cold server', async () => {
    const h = harness(true);
    h.env.PHOTO_MAX_AI_CALLS_PER_DAY = 'unlimited';
    assert.equal((await h.dispatch('preview-features')).data.remainingToday, null);
    for (const record of records.slice(0, 3)) await h.client.preview(record);
    h.cold(); h.store.delete('photo-preview-export-v1');
    assert.equal(await h.client.available(), true);
    assert.equal(h.client.summary().remaining, 0);
    await assert.rejects(h.client.preview(records[3]), error => error.code === 'NO_USES');
    assert.equal(h.counters().bda, 3);
    assert.equal((await h.client.buy(null)).payment, 'paid');
    h.store.delete('photo-preview-export-v1'); h.cold();
    assert.equal(await h.client.available(), true);
    assert.equal(h.client.summary().remaining, 3);
    for (const record of records.slice(3, 6)) await h.client.preview(record);
    h.store.delete('photo-preview-export-v1'); h.cold();
    assert.equal(await h.client.available(), true);
    assert.equal(h.client.summary().remaining, 0);
    await assert.rejects(h.client.preview(records[6]), error => error.code === 'NO_USES');
    assert.equal(h.counters().bda, 6); assert.equal(h.counters().native, 1);
    const purchase = h.wx.getStorageSync('photo-preview-export-v1').grants[0];
    const platformOrder = h.orders.get(purchase.orderId);
    platformOrder.status = 8; platformOrder.left_fee = 0;
    h.store.delete('photo-preview-export-v1'); h.cold();
    assert.equal(await h.client.available(), true);
    assert.equal(h.client.summary().paid, false);
    assert.equal(h.client.summary().remaining, 0);
  });
  await check('public cancelled payment survives cleared cache without creating another order', async () => {
    const h = harness(true); h.setMode('cancel');
    const cancelled = await h.client.buy(null);
    assert.equal(cancelled.cancelled, true);
    assert.equal(h.orders.size, 1);
    h.store.delete('photo-preview-export-v1'); h.cold(); h.setMode('success');
    assert.equal((await h.client.buy(null)).payment, 'paid');
    assert.equal(h.orders.size, 1);
    assert.equal(h.counters().native, 2);
    assert.equal(h.client.summary().remaining, 3);
  });
  await check('public payment push grants and delivers after phone exits, including duplicate push', async () => {
    const h = harness(true), prepared = await h.dispatch('preview-purchase', { consent: TERMS });
    assert.equal(prepared.statusCode, 200);
    const id = prepared.data.orderId;
    h.orders.set(id, { order_id: id, env_type: 1, wx_order_id: 'wx-' + id, order_fee: 100,
      paid_fee: 100, left_fee: 100, order_type: 7, status: 2 });
    const first = await h.notify(id);
    assert.equal(first.statusCode, 200); assert.equal(h.orders.get(id).status, 4);
    const second = await h.notify(id);
    assert.equal(second.statusCode, 200); assert.equal(h.counters().deliveries, 1);
    h.cold(); h.store.delete('photo-preview-export-v1');
    const features = await h.dispatch('preview-features');
    assert.equal(features.data.activeOrder.payment, 'paid');
    assert.equal(features.data.activeOrder.used, 0);
    assert.equal(features.data.activeOrder.wechatOrderStatus, 4);
    assert.equal(h.counters().native, 0);
  });
  await check('public push with mismatched transaction never delivers', async () => {
    const h = harness(true), prepared = await h.dispatch('preview-purchase', { consent: TERMS });
    const id = prepared.data.orderId;
    h.orders.set(id, { order_id: id, env_type: 1, wx_order_id: 'wx-' + id, order_fee: 100,
      paid_fee: 100, left_fee: 100, order_type: 7, status: 2 });
    assert.equal((await h.notify(id, { WeChatPayInfo: { MchOrderNo: 'wrong' } })).statusCode, 200);
    assert.equal(h.orders.get(id).status, 2);
    assert.equal(h.counters().deliveries, 0);
  });
  await check('public daily budget closes new purchases before collecting money', async () => {
    const h = harness(true); h.env.PHOTO_MAX_AI_CALLS_PER_DAY = '3';
    for (const record of records.slice(0, 3)) await h.client.preview(record);
    const features = await h.dispatch('preview-features');
    assert.equal(features.data.remainingToday, 0);
    assert.equal(features.data.processingEnabled, false);
    assert.equal(features.data.newOrdersEnabled, false);
    assert.equal((await h.dispatch('preview-purchase', { consent: TERMS })).data.code, 'DAILY_BUDGET_EXHAUSTED');
    await assert.rejects(h.client.buy(null), error => error.code === 'DAILY_BUDGET_EXHAUSTED');
    assert.equal(h.counters().native, 0);
  });
  await check('durable pilot is restricted to the listed account while public service stays closed', async () => {
    const h = harness(true);
    Object.assign(h.env, { PHOTO_PUBLIC_ENABLED: 'false', PHOTO_PUBLIC_DURABLE_STAGING: 'true',
      PHOTO_TEST_PAYMENT_AUTHORIZED: 'true', PHOTO_TEST_PAYER_OPENIDS: 'sha256:' + hash('alice') });
    const listed = await h.dispatch('preview-features');
    assert.equal(listed.data.processingEnabled, true);
    assert.equal(listed.data.globalConsumptionGuarantee, true);
    assert.equal(listed.data.testOnly, true);
    await h.client.preview(records[0]); h.cold(); h.store.delete('photo-preview-export-v1');
    assert.equal(await h.client.available(), true);
    assert.equal(h.client.summary().remaining, 2);
    h.owner('unlisted');
    const stranger = await h.dispatch('preview-features');
    assert.equal(stranger.data.processingEnabled, false);
    assert.equal(stranger.data.newOrdersEnabled, false);
  });
  await check('explicit public online validation opens durable flow without falsifying acceptance flags', async () => {
    const h = harness(true);
    Object.assign(h.env, { PHOTO_FREE_RELEASE_ACCEPTED: 'false', PHOTO_REAL_FLOW_ACCEPTED: 'false',
      PHOTO_CALLBACK_ACCEPTED: 'false', PHOTO_IOS_IAP_ACCEPTED: 'false', PHOTO_IOS_IAP_CONFIGURED: 'true' });
    h.owner('new-public-user');
    const closed = await h.dispatch('preview-features');
    assert.equal(closed.data.processingEnabled, false);
    assert.equal(closed.data.newOrdersEnabled, false);
    h.env.PHOTO_PUBLIC_ONLINE_VALIDATION = 'true';
    const open = await h.dispatch('preview-features');
    assert.equal(open.data.processingEnabled, true);
    assert.equal(open.data.newOrdersEnabled, true);
    assert.equal(open.data.globalConsumptionGuarantee, true);
    assert.equal(open.data.iosEnabled, true);
    assert.equal(open.data.testOnly, false);
  });
  await check('public switch preserves the listed payer existing paid uses without offering another legacy purchase', async () => {
    const h = harness();
    assert.equal((await h.client.buy(null)).payment, 'paid');
    await h.client.preview(records[0]);
    Object.assign(h.env, { PHOTO_PUBLIC_ENABLED: 'true', PHOTO_DATABASE_ACCEPTED: 'true',
      PHOTO_FREE_RELEASE_ACCEPTED: 'true', PHOTO_REAL_FLOW_ACCEPTED: 'true', PHOTO_CALLBACK_ACCEPTED: 'true',
      PHOTO_MAX_AI_CALLS_PER_DAY: 'unlimited' });
    const features = await h.dispatch('preview-features');
    assert.equal(features.data.processingEnabled, true);
    assert.equal(features.data.newOrdersEnabled, false);
    assert.equal(features.data.testOnly, true);
    await h.client.preview(records[1]);
    assert.equal(h.client.summary().remaining, 1);
    assert.equal(h.counters().native, 1);
  });
  await check('all build types use server authorization; non-allowlisted release stays closed', async () => {
    const { createScfPurchase, SCF_PURCHASE_CONFIGURED } = require('../miniprogram/subpackages/photo/platform/scf-purchase');
    assert.equal(SCF_PURCHASE_CONFIGURED, true);
    for (const environment of ['develop', 'trial']) {
      const h = harness();
      h.wx.getAccountInfoSync = () => ({ miniProgram: { envVersion: environment } });
      h.env.PHOTO_NEW_ORDERS_ENABLED = 'false';
      const service = createScfPurchase(h.wx), client = createPreviewPaid(h.wx, service);
      assert.equal(service.configured, true); assert.equal(await client.available(), true);
      assert.equal(client.summary().remaining, 3);
      await assert.rejects(client.buy(null), error => error.code === 'SERVICE_CLOSED');
      assert.equal(h.counters().native, 0); assert.equal(h.counters().bda, 0);
      h.owner('not-authorized'); assert.equal(await client.available(), false);
      assert.equal(h.counters().native, 0); assert.equal(h.counters().bda, 0);
    }
    for (const environment of ['release', '', undefined]) {
      const h = harness(); h.wx.getAccountInfoSync = () => ({ miniProgram: { envVersion: environment } });
      h.owner('not-authorized');
      const service = createScfPurchase(h.wx), client = createPreviewPaid(h.wx, service);
      assert.equal(service.configured, true); assert.equal(await client.available(), false);
      assert.equal(h.requests.length, 1);
    }
    const unavailable = { getAccountInfoSync() { throw new Error('unsupported'); } };
    assert.equal(createScfPurchase(unavailable).configured, true);
  });
  await check('both export and exhausted-trial purchase recover the existing order while new orders are closed', async () => {
    for (const exportCurrentResult of [false, true]) {
      const h = harness(), result = exportCurrentResult ? await h.client.preview(records[0]) : null;
      h.queryError(true); await h.client.buy(result);
      const pending = h.wx.getStorageSync('photo-preview-export-v1').pending;
      h.env.PHOTO_NEW_ORDERS_ENABLED = 'false';
      assert.equal((await h.client.buy(result)).payment, 'unknown');
      assert.deepEqual(h.wx.getStorageSync('photo-preview-export-v1').pending, pending);
      assert.equal(h.counters().native, 1);
      h.queryError(false);
      assert.equal((await h.client.buy(result)).payment, 'paid');
      assert.equal(h.client.summary().remaining, 3);
      assert.equal(h.counters().native, 1); assert.equal(h.counters().deliveries, 1);
    }
  });
  await check('100 fen unlock + three extra; delivery 4 does not erase remaining rights; next purchase required', async () => {
    const h = harness(); const result = await h.client.preview(records[0]);
    assert.equal((await h.client.buy(result)).payment, 'paid');
    assert(h.phases.includes(2) && h.phases.includes(4)); assert.equal(h.counters().deliveries, 1);
    assert.equal(h.client.summary().remaining, 3); assert.equal(await h.client.authorizeExport(result), true);
    await h.client.status(); assert.equal(h.client.summary().remaining, 3);
    for (const record of records.slice(1, 4)) assert.equal(await h.client.authorizeExport(await h.client.preview(record)), true);
    assert.equal(h.client.summary().remaining, 0); await assert.rejects(h.client.preview(records[4]), /次数已用完/);
    assert.equal((await h.client.buy(null)).payment, 'paid'); assert.equal(h.client.summary().remaining, 3);
    await h.client.preview(records[4]); assert.equal(h.counters().bda, 5); assert.equal(h.counters().native, 2);
  });
  await check('state 3 restores purchased entitlement before delivery, blocks BDA/export, then verifies state 4 without charging again', async () => {
    const h = harness(), result = await h.client.preview(records[0]);
    h.queryError(true); await h.client.buy(result); h.queryError(false);
    const pending = h.wx.getStorageSync('photo-preview-export-v1').pending;
    h.orders.get(pending.orderId).status = 3; h.env.PHOTO_NEW_ORDERS_ENABLED = 'false';
    const state = await h.dispatch('preview-status', { ticket: pending.ticket });
    assert.equal(state.data.payment, 'paid'); assert.equal(state.data.wechatOrderStatus, 3);
    assert.equal((await h.dispatch('preview-export', { ticket: pending.ticket, receipt: result.receipt })).statusCode, 503);
    assert.equal((await h.dispatch('preview-segment', { ticket: pending.ticket, slot: 0, consent: TERMS })).statusCode, 503);
    assert.equal((await h.dispatch('preview-delivered', { ticket: pending.ticket, entitlementReceived: false })).statusCode, 503);
    const request = h.service.request;
    h.service.request = async (action, data) => {
      if (action === 'preview-delivered') {
        const saved = h.wx.getStorageSync('photo-preview-export-v1');
        assert.equal(saved.pending, null); assert.equal(saved.grants[0].orderId, pending.orderId);
        assert.equal(saved.grants[0].used, 0); assert.equal(saved.grants[0].deliveryPending, true);
      }
      return request(action, data);
    };
    const restored = await h.client.status();
    assert.equal(restored.wechatOrderStatus, 4); assert.equal(restored.payment, 'paid');
    assert.equal(h.client.summary().remaining, 3); assert.equal(h.client.summary().paymentPending, false);
    assert.equal(h.counters().native, 1); assert.equal(h.counters().bda, 1); assert.equal(h.counters().deliveries, 1);
    assert(h.client.evidence().some(e => e.phase === 'entitlement-persisted' && e.wechatOrderStatus === 3));
    assert(h.client.evidence().some(e => e.phase === 'delivery-confirmed' && e.wechatOrderStatus === 4));
    h.service.request = request;
    await h.client.preview(records[1]); await h.client.status();
    assert.equal(h.client.summary().remaining, 2); assert.equal(h.counters().deliveries, 1);
  });
  await check('delivery failure or unconfirmed response keeps a recoverable entitlement and never reports a false state 4', async () => {
    for (const failure of ['lost-response', 'malformed-ack']) {
      const h = harness(), result = await h.client.preview(records[0]);
      h.queryError(true); await h.client.buy(result); h.queryError(false);
      const pending = h.wx.getStorageSync('photo-preview-export-v1').pending;
      h.orders.get(pending.orderId).status = 3;
      const request = h.service.request;
      h.service.request = async (action, data) => {
        if (action !== 'preview-delivered') return request(action, data);
        if (failure === 'lost-response') { await request(action, data); throw Error('response-lost'); }
        return { acknowledged: true, orderId: pending.orderId, payment: 'paid', refund: 'none', wechatOrderStatus: 3 };
      };
      assert.equal((await h.client.status()).deliveryPending, true);
      assert.equal(h.client.summary().paymentPending, true); assert.equal(h.client.summary().remaining, 3);
      assert(!h.client.evidence().some(e => e.phase === 'delivery-confirmed'));
      h.service.request = request;
      const recreated = createPreviewPaid(h.wx, h.service, true, async () => {});
      assert.equal((await recreated.status()).wechatOrderStatus, 4);
      assert.equal(recreated.summary().paymentPending, false); assert.equal(recreated.summary().remaining, 3);
      assert.equal(h.counters().native, 1); assert.equal(h.counters().bda, 1);
      assert.equal(h.wx.getStorageSync('photo-preview-export-v1').grants.length, 1);
    }
  });
  await check('failure to persist the purchased entitlement cannot acknowledge delivery', async () => {
    const h = harness(); h.queryError(true); await h.client.buy(null); h.queryError(false);
    const pending = h.wx.getStorageSync('photo-preview-export-v1').pending;
    h.orders.get(pending.orderId).status = 3;
    const save = h.wx.setStorageSync;
    h.wx.setStorageSync = (key, value) => { if (key === 'photo-preview-export-v1') throw Error('storage-full'); return save(key, value); };
    await assert.rejects(h.client.status(), /storage-full/);
    assert.equal(h.counters().deliveries, 0); assert.equal(h.counters().bda, 0);
    assert.deepEqual(h.wx.getStorageSync('photo-preview-export-v1').pending, pending);
    h.wx.setStorageSync = save;
    assert.equal((await h.client.status()).wechatOrderStatus, 4);
    assert.equal(h.counters().native, 1); assert.equal(h.client.summary().remaining, 3);
  });
  await check('cancel and failure never grant; exact native error codes retained without credentials', async () => {
    for (const mode of ['cancel', 'failure']) {
      const h = harness(), result = await h.client.preview(records[0]); h.setMode(mode);
      const state = await h.client.buy(result); assert.equal(state.payment, 'unpaid'); assert.equal(!!state.cancelled, mode === 'cancel');
      assert.equal(h.client.summary().paid, false); assert.equal(await h.client.authorizeExport(result), false);
      assert(h.client.evidence().some(x => x.errCode === (mode === 'cancel' ? -2 : -15006)));
      assert(!JSON.stringify(h.client.evidence()).includes('private-')); assert(!JSON.stringify(h.client.evidence()).includes('session-'));
    }
  });
  await check('unknown query blocks repeat charge; later paid query grants exactly once', async () => {
    const h = harness(), result = await h.client.preview(records[0]); h.queryError(true);
    assert.equal((await h.client.buy(result)).payment, 'unknown'); assert.equal(h.client.summary().paid, false);
    assert(h.client.evidence().some(e => e.code === 'PAYMENT_CHANNEL_UNKNOWN' && e.providerCode === -123));
    assert.equal((await h.client.buy(result)).payment, 'unknown'); assert.equal(h.counters().native, 1);
    h.queryError(false); assert.equal((await h.client.status()).payment, 'paid');
    await h.client.status(); assert.equal(h.client.summary().remaining, 3);
  });
  await check('safe payment diagnostics distinguish an order identity mismatch', async () => {
    const h = harness(), result = await h.client.preview(records[0]); await h.client.buy(result);
    const local = h.wx.getStorageSync('photo-preview-export-v1'), order = h.orders.get(local.grants[0].orderId);
    order.env_type = 2; assert.equal((await h.client.status()).payment, 'unknown');
    assert(h.client.evidence().some(e => e.code === 'PAYMENT_ORDER_IDENTITY_MISMATCH'));
  });
  await check('lost native callback uses authoritative paid query', async () => {
    const h = harness(), result = await h.client.preview(records[0]); h.setMode('lost-callback');
    assert.equal((await h.client.buy(result)).payment, 'paid'); assert.equal(h.counters().native, 1);
  });
  await check('native success polls the same order through eventual state 2 without a second charge', async () => {
    const h = harness(), result = await h.client.preview(records[0]); h.queryLag(2);
    assert.equal((await h.client.buy(result)).payment, 'paid');
    assert.equal(h.client.summary().remaining, 3); assert.equal(h.counters().native, 1);
    assert(h.phases.includes(1) && h.phases.includes(2));
  });
  await check('signing session cannot be refreshed by concurrent photo feature requests', async () => {
    const h = harness(), result = await h.client.preview(records[0]); h.setMode('hold');
    const buying = h.client.buy(result);
    for (let n = 0; n < 200 && !h.nativeHeld(); n++) await new Promise(resolve => setImmediate(resolve));
    assert(h.nativeHeld()); const before = h.counters().logins;
    const feature = h.service.request('preview-features'); await new Promise(resolve => setImmediate(resolve));
    assert.equal(h.counters().logins, before); h.nativeHeld().success({});
    await feature; assert.equal((await buying).payment, 'paid');
  });
  await check('lost BDA response and provider timeout consume one attempt and never auto-retry', async () => {
    for (const mode of ['lost', 'timeout']) {
      const h = harness(); if (mode === 'lost') h.loseSegment(); else h.bdaFailure();
      await assert.rejects(h.client.preview(records[0])); await assert.rejects(h.client.preview(records[0]), /不会自动重跑/);
      assert.equal(h.counters().bda, 1); assert.equal(h.client.summary().remaining, 2);
    }
  });
  await check('absent native callback times out then queries same order without another charge', async () => {
    const h = harness(), result = await h.client.preview(records[0]); h.setMode('hold');
    const buying = h.client.buy(result);
    for (let n = 0; n < 200 && !h.nativeHeld(); n++) await new Promise(resolve => setImmediate(resolve));
    assert(h.nativeHeld()); h.expireNative();
    assert.equal((await buying).payment, 'paid'); assert.equal(h.counters().native, 1);
    assert(h.client.evidence().some(e => e.code === 'NATIVE_CALLBACK_TIMEOUT'));
  });
  await check('same warm-instance concurrent request is blocked while BDA is in flight', async () => {
    const h = harness(), grant = (await h.dispatch('preview-init', { consent: TERMS })).data.trialTicket, record = records[0];
    const data = { trialTicket: grant, consent: TERMS, slot: 0, imageBase64: fs.readFileSync(record.path).toString('base64'), inputHash: record.sha256, inputBytes: record.bytes, inputWidth: 600, inputHeight: 800 };
    let release; h.holdBda(new Promise(resolve => { release = resolve; }));
    const first = h.dispatch('preview-segment', data);
    for (let n = 0; n < 200 && !h.counters().bda; n++) await new Promise(resolve => setImmediate(resolve));
    assert.equal((await h.dispatch('preview-segment', data)).statusCode, 503);
    assert.equal(h.counters().bda, 1); release(); assert.equal((await first).statusCode, 200);
  });
  await check('storage failure before native payment or BDA does not dispatch', async () => {
    const h = harness(); h.wx.setStorageSync = () => { throw Error('storage-full'); };
    await assert.rejects(h.client.preview(records[0])); await assert.rejects(h.client.buy(null));
    assert.equal(h.counters().bda, 0); assert.equal(h.counters().native, 0);
  });
  await check('server denies wrong owner/ticket/amount/refund/delivering/unknown; export requires covered result', async () => {
    const h = harness(), a = await h.client.preview(records[0]), b = await h.client.preview(records[1]); await h.client.buy(a);
    const local = h.wx.getStorageSync('photo-preview-export-v1'), grant = local.grants[0], order = h.orders.get(grant.orderId);
    assert.equal((await h.dispatch('preview-export', { ticket: grant.ticket, receipt: b.receipt })).statusCode, 503);
    for (const status of [0, 1, 3, 5, 6, 7, 8, 9, '2']) {
      order.status = status;
      assert.equal((await h.dispatch('preview-export', { ticket: grant.ticket, receipt: a.receipt })).statusCode, 503);
      const before = h.counters().bda;
      assert.equal((await h.dispatch('preview-segment', { ticket: grant.ticket, slot: 0, consent: TERMS })).statusCode, 503);
      assert.equal(h.counters().bda, before);
    }
    order.status = 4; order.paid_fee = 99;
    assert.equal((await h.dispatch('preview-export', { ticket: grant.ticket, receipt: a.receipt })).statusCode, 503);
    order.paid_fee = 100; h.owner('mallory');
    assert.equal((await h.dispatch('preview-export', { ticket: grant.ticket, receipt: a.receipt })).statusCode, 503);
    h.owner('alice');
    assert.equal((await h.dispatch('preview-export', { ticket: grant.ticket + 'x', receipt: a.receipt })).statusCode, 503);
  });
  await check('same-instance dedup; paid slot 3 rejected; cold replay risk explicitly reproduced', async () => {
    const h = harness(), result = await h.client.preview(records[0]); await h.client.buy(result);
    const grant = h.wx.getStorageSync('photo-preview-export-v1').grants[0], record = records[1];
    const data = { ticket: grant.ticket, consent: TERMS, slot: 0, imageBase64: fs.readFileSync(record.path).toString('base64'), inputHash: record.sha256, inputBytes: record.bytes, inputWidth: 600, inputHeight: 800 };
    assert.equal((await h.dispatch('preview-segment', data)).statusCode, 200);
    const before = h.counters().bda; assert.equal((await h.dispatch('preview-segment', data)).statusCode, 200); assert.equal(h.counters().bda, before);
    assert.equal((await h.dispatch('preview-segment', { ...data, slot: 3 })).statusCode, 503);
    h.cold(); assert.equal((await h.dispatch('preview-segment', data)).statusCode, 200); assert.equal(h.counters().bda, before + 1);
  });
  await check('free export remains independent; unpaid AI cannot share; paid current AI can share', async () => {
    assert.deepEqual(await pageExport(false, false, false), { exports: 1, authCalls: 0, buys: 0 });
    assert.deepEqual(await pageExport(true, false, false), { exports: 0, authCalls: 1, buys: 1 });
    assert.deepEqual(await pageExport(true, true, false), { exports: 1, authCalls: 1, buys: 0 });
    assert.deepEqual(await pageExport(true, false, true), { exports: 1, authCalls: 2, buys: 1 });
  });
  await check('page attempts an existing result recovery before offering another purchase', async () => {
    const source = fs.readFileSync(path.join(root, 'miniprogram/subpackages/photo/process/controller.js'), 'utf8');
    assert(!source.includes('summary().remaining === 0 && !await this.purchaseAi(null)'));
    assert(source.indexOf('const work = await this.prepareAiWork()') < source.indexOf('error.code !== "NO_USES"'));
  });
  await check('product payment confirmation covers export and exhausted-use paths; cancelling never buys', async () => {
    for (const hasResult of [false, true]) for (const confirm of [false, true]) {
      let definition, modal, buys = 0;
      const file = path.join(root, 'miniprogram/subpackages/photo/process/index.js');
      const wx = { showModal(options) { modal = options; assert(options.confirmText.length <= 4); options.success({ confirm }); } };
      vm.runInNewContext(fs.readFileSync(file, 'utf8'), { Page: p => { definition = p; }, wx, require: createRequire(file), setTimeout, clearTimeout, Uint8Array, Date });
      const result = hasResult ? { resultId: 'existing' } : null;
      const page = { ...definition, data: { ...definition.data }, _alive: true, setData(v) { Object.assign(this.data, v); },
        _preview: { buy: async r => { assert.equal(r, result); buys++; return { payment: 'paid' }; }, summary: () => ({ remaining: 3, paid: true }), hasEntitlement: () => true } };
      assert.equal(await page.purchaseAi(result), confirm);
      assert.equal(buys, confirm ? 1 : 0);
      assert.equal(modal.content.includes('当前 AI 结果'), hasResult);
    }
  });
  await check('ordinary errors hide platform details; nonpublic diagnostics cannot open production', async () => {
    const { errorText, photoErrorText, isCancel } = require('../miniprogram/subpackages/photo/platform/errors');
    const raw = { message: 'TypeError: https://example.invalid/private?receipt=secret', code: 'REQUEST_UNKNOWN' };
    assert.equal(errorText(raw), raw.message);
    assert(!/https|receipt|TypeError/.test(photoErrorText(raw)));
    assert(!/268490002/.test(photoErrorText({ errCode: 268490002 })));
    assert(isCancel({ errMsg: 'shareFileMessage:fail cancel' }));
    assert.match(photoErrorText({ code: 'PAYMENT_NETWORK_UNKNOWN' }), /不要重复付款/);
    for (const env of ['develop', 'trial', 'release']) for (const diagnostics of [undefined, '1']) {
      let definition;
      const file = path.join(root, 'miniprogram/subpackages/photo/process/index.js');
      const wx = { getAccountInfoSync: () => ({ miniProgram: { envVersion: env } }), setEnableDebug: o => assert.equal(o.enableDebug, false) };
      const requireReal = createRequire(file);
      vm.runInNewContext(fs.readFileSync(file, 'utf8'), { Page: p => { definition = p; }, wx, setTimeout, clearTimeout, Uint8Array, Date,
        require: name => name === '../platform/preview-paid' ? { createPreviewPaid: () => ({ summary: () => ({ remaining: 1 }), available: async () => false }), TERMS }
          : name === '../platform/files' ? { createFiles: () => ({ init: async () => {} }), call: requireReal(name).call }
          : name === '../platform/raster' ? { createRaster: () => ({}) } : requireReal(name) });
      const page = { ...definition, data: { ...definition.data }, setData(v) { Object.assign(this.data, v); } };
      await page.onLoad({ diagnostics });
      assert.equal(page.data.diagnosticsEnabled, env !== 'release' && diagnostics === '1');
      assert.equal(page.data.allowed, true);
    }
  });
  await check('public gate and missing new cloud authorization remain closed', async () => {
    const h = harness();
    for (const action of ['features', 'purchase', 'payment', 'segment']) assert.equal((await h.dispatch(action)).statusCode, 503);
    delete h.env.PHOTO_PREVIEW_AUTHORIZED;
    const f = await h.dispatch('preview-features'); assert.equal(f.data.processingEnabled, false); assert.equal(f.data.newOrdersEnabled, false);
    assert.equal((await h.dispatch('preview-init', { consent: TERMS })).statusCode, 503);
    assert.equal((await h.dispatch('preview-purchase', { consent: TERMS })).statusCode, 503);
    const source = fs.readFileSync(path.join(root, 'miniprogram/subpackages/photo/platform/preview-paid.js'), 'utf8'); assert(source.includes('const PREVIEW_ENABLED = true;'));
  });
  const report = { passed: true, checks, scope: 'real implementation with injected external transports', realPayment: false,
    realBdaCalls: 0, simulatedPaymentDoesNotReplaceAcceptance: true, serverPaidGateOnExport: true,
    simulatedPublicCrossInstanceQuota: true, legacyTestPayerColdReplayRisk: true,
    clientImageExtractionStillPossible: true, publicPurchasesEnabledInLiveCloud: false };
  fs.writeFileSync(path.join(reportDir, 'state-validation.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
