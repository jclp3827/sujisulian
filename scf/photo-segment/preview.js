const crypto = require('node:crypto');
const { exchangeLogin } = require('./shared/wechat-identity');
const { createVirtualPayment } = require('./shared/virtual-payment');
const { request } = require('./shared/providers');
const { createBudgetedRequest } = require('./shared/request-budget');
const TERMS = 'photo-preview-export-20261020-v1';
const ensure = (ok, code) => { if (!ok) throw new Error(code); };
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const reply = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });
const publicErrorCode = error => {
  if (/^[A-Z][A-Z_]{2,60}$/.test(error.message || '')) return error.message;
  const known = {
    'virtual-payment-network-unknown': 'PAYMENT_NETWORK_UNKNOWN',
    'virtual-payment-channel-unknown': 'PAYMENT_CHANNEL_UNKNOWN',
    'invalid-access-token': 'PAYMENT_TOKEN_INVALID',
    'virtual-order-identity-mismatch': 'PAYMENT_ORDER_IDENTITY_MISMATCH',
    'paid-order-regressed-needs-reconciliation': 'PAYMENT_STATE_REGRESSED',
    'unsupported-payment-state': 'PAYMENT_STATE_UNKNOWN',
    'virtual-order-amount-or-type-mismatch': 'PAYMENT_ORDER_BINDING_MISMATCH',
    'virtual-transaction-changed': 'PAYMENT_TRANSACTION_CHANGED',
    'upstream-outcome-unknown': 'UPSTREAM_TIMEOUT'
  };
  if (error instanceof SyntaxError) return 'PAYMENT_RESPONSE_INVALID';
  return known[error.message] || 'REQUEST_UNKNOWN';
};

function createPreviewHandler({ env = process.env, now = Date.now, send = request, segment, validateImage, dimensions, checkRole, seal, unseal, configured, usageStore, usageStoreFactory }) {
  // The test payer retains the warm-instance guard. Public users use the durable ledger.
  const attempts = new Map();
  function signed(type, value) {
    return { type, appId: env.PHOTO_APP_ID, terms: TERMS, createdAt: now(), expiresAt: Number.MAX_SAFE_INTEGER, ...value };
  }
  function read(token, type, owner) {
    const value = unseal(env, token, type, now());
    ensure(value.owner === owner && value.terms === TERMS, 'OWNER_OR_TERMS_MISMATCH');
    return value;
  }
  function orderFrom(token, owner) {
    const order = read(token, 'preview-purchase', owner);
    ensure(/^P[a-f0-9]{30}$/.test(order.id) && order.priceFen === 100 && order.extraUses === 3 &&
      order.productId === env.PHOTO_VIRTUAL_PRODUCT_ID && order.offerId === env.PHOTO_VIRTUAL_OFFER_ID, 'PURCHASE_BINDING_MISMATCH');
    return order;
  }
  const paid = state => state.paid === true && !state.refundState && [2, 4].includes(state.orderStatus);
  // Status 3 confirms payment but does not authorize BDA/export. The client
  // must persist the purchased entitlement before acknowledging delivery.
  const paymentConfirmed = state => state.paid === true && !state.refundState && [2, 3, 4].includes(state.orderStatus);
  function view(order, state) {
    return { flow: 'preview-export', orderId: order.id, currentResultId: order.currentResultId,
      payment: state.refundState ? 'refunded' : paymentConfirmed(state) ? 'paid' : state.closed ? 'closed' : [0, 1].includes(state.orderStatus) ? 'unpaid' : 'unknown',
      refund: state.refundState ? state.refundState === 'SUCCESS' ? 'refunded' : 'pending' : 'none',
      wechatOrderStatus: state.orderStatus, platform: state.platform, deliveryState: state.deliveryState,
      extraUses: 3, transactionBinding: state.transactionId ? hash(state.transactionId) : undefined };
  }
  return async (event, input, context) => {
    let phase = 'login', bdaDispatched = false;
    try {
      ensure(configured(env) && event.httpMethod === 'POST', 'SERVICE_CLOSED');
      const http = createBudgetedRequest(send, now);
      const session = await exchangeLogin(env, http, input.loginCode);
      const owner = session.openid, ownerBinding = 'sha256:' + hash(owner);
      const payment = createVirtualPayment(env, { request: http, now, session });
      const listed = String(env.PHOTO_TEST_PAYER_OPENIDS || '').split(',').map(x => x.trim()).some(x => x === owner || x === ownerBinding);
      const pilot = listed && env.PHOTO_PUBLIC_DURABLE_STAGING === 'true';
      // Keep the existing test payer on the old ledger until their purchased uses
      // are spent. Public launch must not silently replace those rights.
      const test = env.PHOTO_TEST_PAYMENT_AUTHORIZED === 'true' && listed && !pilot;
      const trialRevision = test && /^[A-Za-z0-9_-]{1,40}$/.test(env.PHOTO_TEST_TRIAL_REVISION || '') ? env.PHOTO_TEST_TRIAL_REVISION : 'base';
      const dailyLimit = env.PHOTO_MAX_AI_CALLS_PER_DAY === 'unlimited' ? null : Number(env.PHOTO_MAX_AI_CALLS_PER_DAY);
      const evidenceAccepted = ['PHOTO_FREE_RELEASE_ACCEPTED', 'PHOTO_REAL_FLOW_ACCEPTED',
        'PHOTO_CALLBACK_ACCEPTED'].every(key => env[key] === 'true');
      // The owner may explicitly open a public validation window before the
      // outstanding phone/callback evidence is complete. Do not relabel those
      // acceptance flags as passed merely to make the service available.
      const publicGates = env.PHOTO_PUBLIC_ENABLED === 'true' && env.PHOTO_DATABASE_ACCEPTED === 'true' &&
        (evidenceAccepted || env.PHOTO_PUBLIC_ONLINE_VALIDATION === 'true');
      const durableGates = publicGates || pilot && env.PHOTO_DATABASE_ACCEPTED === 'true';
      const store = !test && durableGates ?
        usageStore || (usageStoreFactory && usageStoreFactory(context)) : null;
      const durable = !!(store && (dailyLimit === null || Number.isSafeInteger(dailyLimit) && dailyLimit > 0) && durableGates);
      const publicEnabled = durable && publicGates;
      let role = true; try { checkRole(context); } catch (_) { role = false; }
      const enabled = (durable || test) && role && env.PHOTO_PREVIEW_AUTHORIZED === 'true' &&
        env.PHOTO_BUDGET_AUTHORIZED === 'true' && env.PHOTO_PROCESSING_ENABLED === 'true' && env.PHOTO_PRIVACY_ACCEPTED === 'true';
      const purchaseEnabled = enabled && env.PHOTO_NEW_ORDERS_ENABLED === 'true' &&
        ['PHOTO_CALLBACK_CONFIGURED', 'PHOTO_CHANNEL_ELIGIBILITY_VERIFIED', 'PHOTO_PRODUCT_100_FEN_VERIFIED'].every(k => env[k] === 'true') &&
        !(test && env.PHOTO_PUBLIC_ENABLED === 'true');
      let account = null, activeOrder = null, remainingToday = null;
      if (durable && enabled && input.action === 'preview-features') {
        phase = 'read-entitlement';
        account = await store.account(ownerBinding, trialRevision);
        remainingToday = await store.remainingToday(dailyLimit);
        if (account.order) {
          const old = orderFrom(account.order.ticket, owner);
          const status = await payment.queryPayment(old);
          const paymentState = status.refundState ? 'refunded' : paymentConfirmed(status) ? 'paid' : status.closed ? 'closed' : 'pending';
          if (paymentState !== 'pending') {
            account.order = await store.markPayment(ownerBinding, trialRevision, old.id, paymentState);
            if (paymentState === 'paid') account.trialUsed = 3;
          }
          activeOrder = { orderId: old.id, ticket: account.order.ticket, currentResultId: old.currentResultId,
            used: account.order.used, payment: paymentState, refund: status.refundState ? 'refunded' : 'none',
            wechatOrderStatus: status.orderStatus };
        }
      }
      if (input.action === 'preview-features') return reply(200, { flow: 'preview-export', channel: 'virtual', priceFen: 100,
        processingEnabled: enabled && (!durable || remainingToday === null || remainingToday > 0),
        newOrdersEnabled: purchaseEnabled && (!durable || remainingToday === null || remainingToday >= 3),
        iosEnabled: publicEnabled && evidenceAccepted ? env.PHOTO_IOS_IAP_ACCEPTED === 'true' :
          env.PHOTO_IOS_IAP_CONFIGURED === 'true',
        freeUses: 3, extraUses: 3, ownerBinding, trialRevision, testOnly: !publicEnabled && (test || pilot),
        globalConsumptionGuarantee: !!durable && !!enabled, trialUsed: account && account.trialUsed,
        remainingToday, activeOrder });
      if (input.action === 'preview-result') {
        phase = 'load-preview';
        ensure(enabled, 'SERVICE_CLOSED');
        const record = read(input.receipt, 'preview-result', owner);
        ensure(now() < record.downloadExpiresAt, 'RESULT_EXPIRED');
        const url = new URL(record.url);
        ensure(url.protocol === 'https:' && !url.username && !url.password && url.hostname.endsWith('.myqcloud.com'), 'INVALID_RESULT_URL');
        const response = await http(url, { method: 'GET', headers: { Accept: 'image/png' }, timeout: 20000 });
        const data = response && response.body;
        ensure(response && response.status === 200 && Buffer.isBuffer(data) && data.length > 0 && data.length <= 4 * 1024 * 1024,
          'RESULT_DOWNLOAD_FAILED');
        ensure(data.length >= 24 && data.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')), 'INVALID_RESULT_IMAGE');
        const [width, height] = dimensions(data);
        ensure(width === record.width && height === record.height, 'INVALID_RESULT_IMAGE');
        return reply(200, { flow: 'preview-export', resultId: record.id, inputHash: record.inputHash,
          imageBase64: data.toString('base64'), result: { width, height, bytes: data.length, sha256: hash(data) } });
      }
      if (input.action === 'preview-init') {
        ensure(enabled && input.consent === TERMS, 'SERVICE_CLOSED');
        // Stable owner-scoped ID prevents re-issuing a grant from resetting the warm guard.
        const trial = signed('preview-trial', { owner, id: 'trial-' + hash(owner + ':' + trialRevision), uses: 3, trialRevision });
        return reply(200, { trialTicket: seal(env, trial) });
      }
      if (input.action === 'preview-purchase') {
        phase = 'prepare-payment';
        ensure(purchaseEnabled && input.consent === TERMS, 'SERVICE_CLOSED');
        if (durable && dailyLimit !== null) ensure(await store.remainingToday(dailyLimit) >= 3, 'DAILY_BUDGET_EXHAUSTED');
        if (durable) {
          account = await store.account(ownerBinding, trialRevision);
          if (account.order) {
            const old = orderFrom(account.order.ticket, owner);
            const status = await payment.queryPayment(old);
            if (paymentConfirmed(status) && !status.refundState) {
              await store.markPayment(ownerBinding, trialRevision, old.id, 'paid');
              ensure(account.order.used === 3, 'ORDER_IN_PROGRESS');
            } else if (status.refundState) await store.markPayment(ownerBinding, trialRevision, old.id, 'refunded');
            else if (status.closed) await store.markPayment(ownerBinding, trialRevision, old.id, 'closed');
            else throw new Error('ORDER_IN_PROGRESS');
          }
        }
        const current = input.receipt ? read(input.receipt, 'preview-result', owner) : null;
        const order = signed('preview-purchase', { owner, id: 'P' + crypto.randomBytes(15).toString('hex'),
          currentResultId: current ? current.id : null, inputHash: current ? current.inputHash : null,
          priceFen: 100, extraUses: 3, productId: env.PHOTO_VIRTUAL_PRODUCT_ID, offerId: env.PHOTO_VIRTUAL_OFFER_ID,
          startBefore: now() + 30 * 60000 });
        const ticket = seal(env, order);
        const parameters = await payment.preparePayment(order);
        if (durable) await store.rememberOrder(ownerBinding, trialRevision, { ...order, ticket });
        return reply(200, { flow: 'preview-export', orderId: order.id, currentResultId: order.currentResultId,
          ticket, ...parameters });
      }
      if (input.action === 'preview-segment') {
        phase = 'prepare-preview';
        ensure(enabled && input.consent === TERMS, 'SERVICE_CLOSED');
        ensure(Number.isSafeInteger(input.slot) && input.slot >= 0 && input.slot < 3, 'NO_USES');
        let grantId, grantOrderId = null;
        if (input.ticket) {
          const order = orderFrom(input.ticket, owner); phase = 'query-before-preview';
          ensure(paid(await payment.queryPayment(order)), 'PAYMENT_NOT_CONFIRMED');
          if (durable) await store.markPayment(ownerBinding, trialRevision, order.id, 'paid');
          grantId = order.id; grantOrderId = order.id;
        } else {
          const trial = read(input.trialTicket, 'preview-trial', owner);
          ensure(trial.uses === 3 && trial.trialRevision === trialRevision, 'NO_USES'); grantId = trial.id;
        }
        const image = validateImage(input.imageBase64), data = Buffer.from(image, 'base64');
        const [width, height] = dimensions(data), inputHash = hash(data);
        ensure(width > 0 && width <= 1000 && height > 0 && height <= 1000 && data.length <= 1572864, 'INVALID_WORK_IMAGE');
        ensure(input.inputHash === inputHash && input.inputBytes === data.length && input.inputWidth === width && input.inputHeight === height, 'INPUT_CHANGED');
        let attempt = null;
        if (durable) {
          phase = 'reserve-preview'; checkRole(context);
          await store.reserve(ownerBinding, trialRevision, { kind: input.ticket ? 'paid' : 'trial',
            orderId: grantOrderId, slot: input.slot, inputHash, dailyLimit });
        } else {
          for (const [key, value] of attempts) if (value.until <= now()) attempts.delete(key);
          const key = grantId + ':' + input.slot, prior = attempts.get(key);
          if (prior) {
            ensure(prior.inputHash === inputHash, 'SLOT_ALREADY_USED');
            ensure(prior.result, 'PREVIEW_OUTCOME_UNKNOWN');
            return reply(200, prior.result);
          }
          ensure(attempts.size < 256, 'SERVICE_BUSY'); checkRole(context);
          attempt = { inputHash, until: now() + 24 * 3600000 }; attempts.set(key, attempt);
        }
        phase = 'bda'; bdaDispatched = true;
        const result = await segment(image, context); // One dispatch, no retry after any unknown outcome.
        ensure(result && !result.Error && result.HasForeground !== false && typeof result.RequestId === 'string' && result.RequestId, 'PREVIEW_NOT_COMPLETED');
        const url = new URL(result.ResultImageUrl);
        ensure(url.protocol === 'https:' && !url.username && !url.password && url.hostname.endsWith('.myqcloud.com'), 'INVALID_RESULT_URL');
        const record = signed('preview-result', { owner, id: 'V' + crypto.randomBytes(15).toString('hex'),
          inputHash, inputBytes: data.length, width, height, grantOrderId, slot: input.slot,
          url: url.toString(), downloadExpiresAt: now() + 29 * 60000, requestId: result.RequestId });
        const previewResult = { flow: 'preview-export', resultId: record.id, inputHash, grantOrderId,
          receipt: seal(env, record), requestId: record.requestId, result: { width, height },
          download: { via: 'scf', expiresAt: record.downloadExpiresAt } };
        if (attempt) attempt.result = previewResult;
        return reply(200, previewResult);
      }
      const order = orderFrom(input.ticket, owner); phase = 'query-payment';
      const state = await payment.queryPayment(order);
      if (durable && ['preview-status', 'preview-payment', 'preview-delivered'].includes(input.action)) {
        const paymentState = state.refundState ? 'refunded' : paymentConfirmed(state) ? 'paid' : state.closed ? 'closed' : 'pending';
        if (paymentState !== 'pending') await store.markPayment(ownerBinding, trialRevision, order.id, paymentState);
      }
      if (input.action === 'preview-status') return reply(200, view(order, state));
      if (input.action === 'preview-payment') {
        if (paymentConfirmed(state)) return reply(200, view(order, state));
        ensure(purchaseEnabled && [0, 1].includes(state.orderStatus) && !state.refundState && now() < order.startBefore, 'PAYMENT_NOT_AVAILABLE');
        if (durable && dailyLimit !== null) ensure(await store.remainingToday(dailyLimit) >= 3, 'DAILY_BUDGET_EXHAUSTED');
        phase = 'prepare-payment';
        return reply(200, { orderId: order.id, currentResultId: order.currentResultId, ticket: input.ticket, ...await payment.preparePayment(order) });
      }
      if (input.action === 'preview-export') {
        phase = 'authorize-export'; ensure(paid(state), 'PAYMENT_NOT_CONFIRMED');
        const result = read(input.receipt, 'preview-result', owner);
        ensure(result.id === order.currentResultId || result.grantOrderId === order.id, 'RESULT_NOT_COVERED');
        return reply(200, { ...view(order, state), authorized: true, resultId: result.id });
      }
      if (input.action === 'preview-delivered') {
        // Goods are the persisted export entitlement plus three opportunities,
        // not another BDA task. State 4 may therefore legitimately use remaining slots.
        phase = 'delivery'; ensure(paymentConfirmed(state) && input.entitlementReceived === true, 'ENTITLEMENT_NOT_RECEIVED');
        let confirmed = state;
        if (state.orderStatus !== 4) {
          const delivery = { ...order, transactionId: state.transactionId };
          await payment.markDelivered(delivery); confirmed = await payment.queryPayment(delivery);
        }
        ensure(paid(confirmed) && confirmed.orderStatus === 4, 'DELIVERY_NOT_CONFIRMED');
        return reply(200, { acknowledged: true, ...view(order, confirmed) });
      }
      throw new Error('INVALID_ACTION');
    } catch (error) {
      const code = publicErrorCode(error);
      return reply(503, { error: 'PHOTO_PREVIEW_REQUEST_FAILED', code, phase, bdaDispatched,
        httpStatus: Number.isSafeInteger(error.httpStatus) ? error.httpStatus : undefined,
        operation: ['access-token', 'query-order', 'deliver-goods', 'refund-order'].includes(error.operation) ? error.operation : undefined,
        providerCode: Number.isSafeInteger(error.providerCode) ? error.providerCode : undefined,
        payment: 'unknown' });
    }
  };
}
module.exports = { createPreviewHandler, TERMS, PUBLIC_ENABLED: false };
