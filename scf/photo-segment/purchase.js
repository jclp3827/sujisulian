// Minimal paid path inside the existing SCF. WeChat owns payment/delivery state.
// No database, scheduler, automatic refunds, or cross-device result recovery.
const crypto = require('node:crypto');
const { exchangeLogin } = require('./shared/wechat-identity');
const { createVirtualPayment } = require('./shared/virtual-payment');
const { request } = require('./shared/providers');
const { createBudgetedRequest } = require('./shared/request-budget');
const { decodeNotification, handshake, encrypt } = require('./shared/notify');
const TERMS = 'photo-ai-simple-20261019-v1';
// No reliable platform claim exists for this cash-purchase path. This gate is
// deliberately not an environment switch: aftercare and warm locks cannot
// authorize paid consumption. Query/delivery of existing results still work.
const CONSUMPTION_SAFE = false;
const START_MS = 30 * 60000, TICKET_MS = 7 * 86400000;
const ensure = (value, code) => { if (!value) throw new Error(code); };
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const reply = (statusCode, value) => ({ statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(value) });
function seal(env, value) {
  const body = Buffer.from(JSON.stringify(value)).toString('base64url');
  return body + '.' + crypto.createHmac('sha256', env.PHOTO_VIRTUAL_APP_KEY).update('photo-simple-v1&' + body).digest('hex');
}
function unseal(env, token, type, now) {
  ensure(typeof token === 'string' && token.length < 16384, 'invalid-ticket');
  const [body, mac, extra] = token.split('.');
  ensure(!extra && /^[a-f0-9]{64}$/.test(mac || ''), 'invalid-ticket');
  const expected = crypto.createHmac('sha256', env.PHOTO_VIRTUAL_APP_KEY).update('photo-simple-v1&' + body).digest();
  ensure(crypto.timingSafeEqual(expected, Buffer.from(mac, 'hex')), 'invalid-ticket');
  const value = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  ensure(value.type === type && value.appId === env.PHOTO_APP_ID && Number.isSafeInteger(value.createdAt) && value.createdAt <= now && now < value.expiresAt, 'expired-ticket');
  return value;
}
function configured(env) {
  return ['PHOTO_APP_ID', 'PHOTO_APP_SECRET', 'PHOTO_VIRTUAL_OFFER_ID', 'PHOTO_VIRTUAL_PRODUCT_ID', 'PHOTO_VIRTUAL_APP_KEY'].every(k => typeof env[k] === 'string' && env[k].length > 0);
}
function flags(env, owner) {
  const testOnly = env.PHOTO_TEST_PAYMENT_AUTHORIZED === 'true' && env.PHOTO_CALLBACK_CONFIGURED === 'true' && String(env.PHOTO_TEST_PAYER_OPENIDS || '').split(',').map(s => s.trim()).includes(owner);
  const accepted = ['PHOTO_REAL_FLOW_ACCEPTED', 'PHOTO_FREE_RELEASE_ACCEPTED', 'PHOTO_CALLBACK_ACCEPTED'].every(k => env[k] === 'true');
  const processingEnabled = CONSUMPTION_SAFE && configured(env) && env.PHOTO_PROCESSING_ENABLED === 'true' && env.PHOTO_BUDGET_AUTHORIZED === 'true';
  return { processingEnabled, newOrdersEnabled: processingEnabled && env.PHOTO_NEW_ORDERS_ENABLED === 'true' && (accepted || testOnly) &&
    ['PHOTO_CHANNEL_ELIGIBILITY_VERIFIED', 'PHOTO_PRODUCT_100_FEN_VERIFIED', 'PHOTO_PRIVACY_ACCEPTED'].every(k => env[k] === 'true'),
    iosEnabled: env.PHOTO_IOS_IAP_ACCEPTED === 'true' || (testOnly && env.PHOTO_IOS_IAP_CONFIGURED === 'true'), testOnly: testOnly && !accepted };
}
function createLegacyPurchaseHandler({ env = process.env, now = Date.now, send = request, segment, validateImage, dimensions, checkRole }) {
  // Best-effort protection only within a warm instance; not a durable ledger.
  // Cold/parallel instances cannot promise exactly-once BDA consumption.
  const attempts = new Map();
  return async (event, input, context) => {
    try {
      ensure(configured(env), 'service-closed');
      if (!CONSUMPTION_SAFE && ['purchase', 'payment', 'segment'].includes(input.action)) return reply(503, {
        error: 'PHOTO_PAID_CONSUMPTION_BLOCKED', message: 'AI 换背景暂未开放，可继续保留原背景免费处理'
      });
      const http = createBudgetedRequest(send, now);
      const query = event.queryString || event.queryStringParameters || {};
      const isNotify = event.path === '/notify' || event.rawPath === '/notify';
      if (isNotify && event.httpMethod === 'GET') return { statusCode: 200, body: handshake(env, query, now) };
      if (isNotify) {
        const notice = decodeNotification(env, query, input, now);
        // A push never invokes BDA and is never acknowledged as delivered just
        // because payment succeeded. The image is only present on the phone.
        ensure(notice.MsgType === 'event' && notice.Event === 'xpay_goods_deliver_notify' && Number(notice.Env) === 0 && /^P[a-f0-9]{30}$/.test(notice.OutTradeNo || ''), 'unsupported-notice');
        ensure(notice.GoodsInfo && notice.GoodsInfo.ProductId === env.PHOTO_VIRTUAL_PRODUCT_ID && Number(notice.GoodsInfo.Quantity) === 1, 'invalid-goods');
        const payment = createVirtualPayment(env, { request: http, now });
        const state = await payment.queryPayment({ id: notice.OutTradeNo, owner: notice.OpenId });
        ensure(state.transactionId === (notice.WeChatPayInfo || {}).MchOrderNo, 'invalid-notice-order');
        return reply(200, encrypt(env, state.paid && state.deliveryState === 'delivered' ? '{"ErrCode":0,"ErrMsg":"success"}' : '{"ErrCode":-1,"ErrMsg":"await-client-delivery"}', now));
      }
      ensure(event.httpMethod === 'POST', 'invalid-request');
      const session = await exchangeLogin(env, http, input.loginCode);
      const payment = createVirtualPayment(env, { request: http, now, session });
      const features = flags(env, session.openid);
      try { checkRole(context); } catch (_) { features.newOrdersEnabled = false; features.processingEnabled = false; }
      if (input.action === 'features') return reply(200, { ...features, priceFen: 100, channel: 'virtual', aiProvider: 'bda', inputTransport: 'inline', flow: 'single-scf', consumptionSafe: CONSUMPTION_SAFE });
      if (input.action === 'purchase') {
        ensure(features.newOrdersEnabled && input.consent === TERMS, 'service-closed');
        const width = input.inputWidth, height = input.inputHeight;
        ensure(/^[a-f0-9]{64}$/.test(input.inputHash || '') && [width, height, input.inputBytes].every(Number.isSafeInteger) &&
          width > 0 && width <= 1000 && height > 0 && height <= 1000 && input.inputBytes > 0 && input.inputBytes <= 1572864, 'invalid-work-image');
        const order = { type: 'purchase', appId: env.PHOTO_APP_ID, id: 'P' + crypto.randomBytes(15).toString('hex'), owner: session.openid,
          inputHash: input.inputHash, inputBytes: input.inputBytes, inputWidth: width, inputHeight: height, priceFen: 100, productId: env.PHOTO_VIRTUAL_PRODUCT_ID, offerId: env.PHOTO_VIRTUAL_OFFER_ID, terms: TERMS, createdAt: now(), startBefore: now() + START_MS, expiresAt: now() + TICKET_MS };
        const pay = await payment.preparePayment(order);
        return reply(200, { orderId: order.id, inputHash: order.inputHash, ticket: seal(env, order), ...pay });
      }
      const order = unseal(env, input.ticket, 'purchase', now());
      ensure(order.owner === session.openid && /^P[a-f0-9]{30}$/.test(order.id), 'owner-mismatch');
      ensure(order.priceFen === 100 && order.productId === env.PHOTO_VIRTUAL_PRODUCT_ID && order.offerId === env.PHOTO_VIRTUAL_OFFER_ID && order.terms === TERMS, 'purchase-binding-mismatch');
      const state = await payment.queryPayment(order); // Always verify remotely; never trust the payment callback.
      let result;
      if (input.receipt) {
        result = unseal(env, input.receipt, 'result', now());
        ensure(result.orderId === order.id && result.owner === order.owner && result.inputHash === order.inputHash, 'result-owner-mismatch');
      }
      const view = () => ({ flow: 'single-scf', orderId: order.id, inputHash: order.inputHash, payment: state.paid ? 'paid' : state.closed ? 'closed' : 'unpaid',
        refund: state.refundState ? state.refundState === 'SUCCESS' ? 'refunded' : 'pending' : 'none', platform: state.platform,
        task: result && state.paid ? 'ready' : state.deliveryState === 'delivered' ? 'delivered' : 'not-started', canRefund: !!state.paid,
        deliveryState: state.deliveryState, wechatOrderStatus: state.orderStatus, result: result && state.paid ? { width: order.inputWidth, height: order.inputHeight } : undefined,
        download: result && state.paid && now() < result.downloadExpiresAt ? { url: result.url, expiresAt: result.downloadExpiresAt } : undefined,
        resultExpired: !!result && now() >= result.downloadExpiresAt });
      if (input.action === 'status') return reply(200, view());
      if (input.action === 'payment') {
        ensure(features.newOrdersEnabled && !state.paid && !state.closed && !state.refundState && now() < order.startBefore, 'payment-not-available');
        return reply(200, await payment.preparePayment(order));
      }
      if (input.action === 'delivered') {
        ensure(state.paid && result, 'result-not-received');
        let confirmed = state;
        if (state.orderStatus !== 4) {
          const deliveryOrder = { ...order, transactionId: state.transactionId };
          await payment.markDelivered(deliveryOrder);
          // An accepted delivery request is not proof of platform status 4.
          // Query once; lag/error stays unconfirmed, never retries BDA.
          confirmed = await payment.queryPayment(deliveryOrder);
        }
        ensure(confirmed.paid && !confirmed.refundState && confirmed.orderStatus === 4, 'delivery-not-confirmed');
        return reply(200, { acknowledged: true, wechatOrderStatus: 4 });
      }
      ensure(input.action === 'segment' && features.processingEnabled && state.orderStatus === 2 && state.paid && !state.refundState && state.deliveryState === 'pending', 'no-segmentation-permission');
      ensure(now() < order.startBefore, 'processing-window-expired');
      const image = validateImage(input.imageBase64);
      const bytes = Buffer.from(image, 'base64'), [width, height] = dimensions(bytes);
      ensure(hash(bytes) === order.inputHash && bytes.length === order.inputBytes && width === order.inputWidth && height === order.inputHeight, 'input-changed');
      for (const [id, attempt] of attempts) if (attempt.expiresAt <= now()) attempts.delete(id);
      const previous = attempts.get(order.id);
      if (previous) {
        ensure(previous.result, 'outcome-unknown-use-support');
        return reply(200, previous.result);
      }
      ensure(attempts.size < 256, 'service-busy');
      checkRole(context);
      const attempt = { expiresAt: order.startBefore }; attempts.set(order.id, attempt);
      // No automatic replay, including provider errors/timeouts.
      const data = await segment(image, context);
      ensure(data && !data.Error && data.HasForeground !== false && typeof data.RequestId === 'string' && data.RequestId, 'segmentation-not-completed');
      const url = new URL(data.ResultImageUrl);
      ensure(url.protocol === 'https:' && !url.username && !url.password && url.hostname.endsWith('.myqcloud.com'), 'invalid-result-url');
      result = { type: 'result', appId: env.PHOTO_APP_ID, orderId: order.id, owner: order.owner, inputHash: order.inputHash,
        url: url.toString(), requestId: data.RequestId, downloadExpiresAt: now() + 29 * 60000, createdAt: now(), expiresAt: order.expiresAt };
      attempt.result = { ...view(), receipt: seal(env, result), requestId: data.RequestId };
      return reply(200, attempt.result);
    } catch (_) {
      // No upstream URLs, provider details, session keys or credentials in errors.
      return reply(503, { error: 'PHOTO_REQUEST_NOT_COMPLETED', message: '本次请求未完成，请勿重复付款或重新分割；可查询付款记录并按渠道申请售后，免费处理不受影响' });
    }
  };
}
function createPurchaseHandler(options) {
  const legacy = createLegacyPurchaseHandler(options);
  const preview = require('./preview').createPreviewHandler({ ...options, seal, unseal, configured });
  const env = options.env || process.env, now = options.now || Date.now, send = options.send || request;
  async function previewNotification(event, input, context) {
    if (env.PHOTO_PREVIEW_AUTHORIZED !== 'true' || !env.PHOTO_CLOUDBASE_ENV || !options.usageStoreFactory && !options.usageStore) return null;
    const query = event.queryString || event.queryStringParameters || {};
    const notice = decodeNotification(env, query, input, now);
    if (env.PHOTO_PUBLIC_DURABLE_STAGING !== 'true' && env.PHOTO_TEST_PAYMENT_AUTHORIZED === 'true' &&
      String(env.PHOTO_TEST_PAYER_OPENIDS || '').split(',').map(s => s.trim()).some(s => s === notice.OpenId || s === 'sha256:' + hash(notice.OpenId || ''))) return null;
    ensure(notice.MsgType === 'event' && notice.Event === 'xpay_goods_deliver_notify' && Number(notice.Env) === 0 &&
      typeof notice.OpenId === 'string' && notice.OpenId.length > 0 && /^P[a-f0-9]{30}$/.test(notice.OutTradeNo || '') &&
      notice.GoodsInfo && notice.GoodsInfo.ProductId === env.PHOTO_VIRTUAL_PRODUCT_ID && Number(notice.GoodsInfo.Quantity) === 1,
    'unsupported-notice');
    const binding = 'sha256:' + hash(notice.OpenId);
    let store, account;
    try {
      store = options.usageStore || options.usageStoreFactory(context);
      account = await store.account(binding, 'base');
    } catch (_) { return null; } // Historical orders keep the existing callback path.
    if (!account.order || account.order.id !== notice.OutTradeNo) return null;
    const failure = () => reply(200, encrypt(env, '{"ErrCode":-1,"ErrMsg":"await-server-delivery"}', now));
    try {
      const payment = createVirtualPayment(env, { request: createBudgetedRequest(send, now), now });
      const order = { id: notice.OutTradeNo, owner: notice.OpenId };
      const state = await payment.queryPayment(order);
      ensure(state.transactionId === (notice.WeChatPayInfo || {}).MchOrderNo, 'invalid-notice-order');
      if (state.refundState) { await store.markPayment(binding, 'base', order.id, 'refunded'); return failure(); }
      ensure(state.paid && [2, 3, 4].includes(state.orderStatus), 'payment-not-confirmed');
      await store.markPayment(binding, 'base', order.id, 'paid');
      if (state.orderStatus !== 4) await payment.markDelivered({ ...order, transactionId: state.transactionId });
      const confirmed = state.orderStatus === 4 ? state : await payment.queryPayment({ ...order, transactionId: state.transactionId });
      if (!confirmed.paid || confirmed.refundState || confirmed.orderStatus !== 4) return failure();
      return reply(200, encrypt(env, '{"ErrCode":0,"ErrMsg":"success"}', now));
    } catch (_) { return failure(); }
  }
  // Existing callbacks and v1 tickets keep their established query/delivery path.
  // The new product is an extension of this SCF, with a distinct signed terms version.
  return async (event, input, context) => {
    if ((event.path === '/notify' || event.rawPath === '/notify') && event.httpMethod === 'POST') {
      try {
        const handled = await previewNotification(event, input, context);
        if (handled) return handled;
      } catch (_) { /* The legacy handler performs the final verified check. */ }
    }
    if (typeof input.action === 'string' && input.action.startsWith('preview-')) return preview(event, input, context);
    // Old QR packages must not initiate the superseded pay-before-BDA offer.
    // Historical order lookup and delivery callbacks remain readable.
    if ((options.env || process.env).PHOTO_PREVIEW_AUTHORIZED === 'true' && ['features', 'purchase', 'payment', 'segment'].includes(input.action)) {
      return reply(503, { error: 'PHOTO_CLIENT_UPDATE_REQUIRED', code: 'SERVICE_CLOSED' });
    }
    return legacy(event, input, context);
  };
}
module.exports = { createPurchaseHandler, TERMS, CONSUMPTION_SAFE };
