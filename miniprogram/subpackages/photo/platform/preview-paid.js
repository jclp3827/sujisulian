const { call } = require('./files');
const { bytes } = require('../core/bytes');
const { sha256 } = require('../core/sha256');
const { inspectJpeg } = require('../core/jpeg');
const { inspectResult } = require('./scf-segmentation');
const { createScfPurchase, isAcceptanceEnvironment } = require('./scf-purchase');
const { assertPaymentCapability } = require('./paid-ledger-legacy');
const PREVIEW_ENABLED = true;
const TERMS = 'photo-preview-export-20261020-v1';
const STORAGE = 'photo-preview-export-v1', DIAGNOSTIC = 'photo-payment-evidence-v2';
const fail = (message, code) => Object.assign(new Error(message), { code });

function createPreviewPaid(wxApi, service = createScfPurchase(wxApi), enabled = PREVIEW_ENABLED || isAcceptanceEnvironment(wxApi),
  pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))) {
  let busy = false;
  function load() {
    const saved = wxApi.getStorageSync(STORAGE);
    return saved && saved.version === 1 ? saved : { version: 1, ownerBinding: null, trialRevision: null, trialUsed: 0, grants: [], attempts: {}, pending: null };
  }
  function save(state) { wxApi.setStorageSync(STORAGE, state); }
  function evidence(phase, extra = {}) {
    try {
      const list = wxApi.getStorageSync(DIAGNOSTIC) || [];
      const safe = { phase, at: Date.now() };
      for (const key of ['errCode', 'providerCode', 'wechatOrderStatus', 'httpStatus']) if (Number.isSafeInteger(extra[key])) safe[key] = extra[key];
      for (const key of ['payment', 'callback', 'code', 'phase', 'operation']) if (typeof extra[key] === 'string' && /^[A-Za-z_-]{1,60}$/.test(extra[key])) safe[key === 'phase' ? 'requestPhase' : key] = extra[key];
      if (extra.orderId) safe.orderBinding = sha256(new Uint8Array(Array.from(extra.orderId, c => c.charCodeAt(0))));
      wxApi.setStorageSync(DIAGNOSTIC, list.slice(-29).concat(safe));
    } catch (_) {}
  }
  async function exclusive(action) {
    if (busy) throw fail('正在处理，请稍候', 'BUSY');
    busy = true; try { return await action(); } finally { busy = false; }
  }
  function summary() {
    const state = load(), grant = state.grants.find(g => !g.revoked && g.used < 3);
    return { remaining: grant ? 3 - grant.used : Math.max(0, 3 - state.trialUsed),
      paid: state.grants.some(g => !g.revoked), paymentPending: !!state.pending || state.grants.some(g => !g.revoked && g.deliveryPending) };
  }
  async function features() {
    if (!enabled || !service.configured) throw fail('AI 换背景暂未开放，原背景仍可免费导出', 'SERVICE_CLOSED');
    const result = await service.request('preview-features');
    if (result.flow !== 'preview-export' || result.priceFen !== 100 || !/^sha256:[a-f0-9]{64}$/.test(result.ownerBinding || '')) throw fail('AI 服务暂不可用', 'SERVICE_CLOSED');
    let state = load();
    if (state.ownerBinding && state.ownerBinding !== result.ownerBinding) state = { version: 1, ownerBinding: null, trialRevision: null, trialUsed: 0, grants: [], attempts: {}, pending: null };
    if (typeof result.trialRevision !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(result.trialRevision)) throw fail('AI 服务暂不可用', 'SERVICE_CLOSED');
    if (state.trialRevision !== result.trialRevision) {
      // Controlled test reset: preserve any pending/paid order while rotating
      // only the local trial ledger and the corresponding server trial slots.
      state.trialRevision = result.trialRevision;
      state.trialUsed = 0;
      state.trialTicket = null;
      state.attempts = {};
    }
    if (result.globalConsumptionGuarantee === true) {
      if (!Number.isSafeInteger(result.trialUsed) || result.trialUsed < 0 || result.trialUsed > 3) throw fail('AI 服务暂不可用', 'SERVICE_CLOSED');
      state.trialUsed = result.trialUsed;
      const order = result.activeOrder;
      if (order) {
        if (!/^P[a-f0-9]{30}$/.test(order.orderId || '') || typeof order.ticket !== 'string' ||
          !Number.isSafeInteger(order.used) || order.used < 0 || order.used > 3) throw fail('AI 服务暂不可用', 'SERVICE_CLOSED');
        const ticket = { orderId: order.orderId, ticket: order.ticket, currentResultId: order.currentResultId || null };
        if (order.payment === 'paid' && order.refund === 'none') {
          let grant = state.grants.find(g => g.orderId === order.orderId);
          if (!grant) { grant = { ...ticket, used: order.used, revoked: false }; state.grants.push(grant); }
          grant.used = order.used; grant.revoked = false;
          grant.deliveryPending = order.wechatOrderStatus !== 4;
          state.pending = null;
        } else if (order.payment === 'refunded') {
          for (const grant of state.grants) if (grant.orderId === order.orderId) grant.revoked = true;
          state.pending = null;
        } else if (order.payment === 'pending') state.pending = ticket;
        else if (order.payment === 'closed') state.pending = null;
      } else state.pending = null;
      for (const grant of state.grants) if (!order || grant.orderId !== order.orderId) grant.used = 3;
    }
    state.ownerBinding = result.ownerBinding; save(state);
    return result;
  }
  async function available() { try { return (await features()).processingEnabled === true; } catch (_) { return false; } }
  function prepare(record) {
    const data = bytes(wxApi.getFileSystemManager().readFileSync(record.path)), info = inspectJpeg(data, { includeTail: false });
    if (data.length !== record.bytes || sha256(data) !== record.sha256 || info.width !== record.width || info.height !== record.height ||
      info.hasExif || info.trailingBytes || info.width > 1000 || info.height > 1000 || data.length > 1572864) throw fail('照片已改变，请重新选择', 'INPUT_CHANGED');
    return wxApi.arrayBufferToBase64(new Uint8Array(data).buffer);
  }
  async function preview(record, onPhase = () => {}) {
    return exclusive(async () => {
      const feature = await features();
      if (!feature.processingEnabled) throw fail('AI 暂时不可用，可以继续免费处理', 'SERVICE_CLOSED');
      const state = load(), old = state.attempts[record.sha256];
      if (old) {
        if (old.result) return old.result;
        throw fail('这次处理结果尚未确认，不会自动重跑；可以换一张照片或继续免费处理', 'PREVIEW_OUTCOME_UNKNOWN');
      }
      const imageBase64 = prepare(record);
      const grant = state.grants.find(g => !g.revoked && g.used < 3);
      let slot, ticket, trialTicket;
      if (grant) { slot = grant.used; ticket = grant.ticket; }
      else {
        if (state.trialUsed >= 3) throw fail('处理次数已用完，支付 ¥1 可再处理 3 次并导出结果', 'NO_USES');
        if (!state.trialTicket) { state.trialTicket = (await service.request('preview-init', { consent: TERMS })).trialTicket; save(state); }
        slot = state.trialUsed; trialTicket = state.trialTicket;
      }
      // Reserve locally BEFORE dispatch. A lost/unknown response never refunds a
      // slot automatically and never causes another BDA call on the same work.
      if (grant) grant.used++; else state.trialUsed++;
      state.attempts[record.sha256] = { state: 'submitted', slot, grantOrderId: grant ? grant.orderId : null };
      save(state); onPhase('正在生成 AI 预览');
      evidence('preview-dispatch');
      let result;
      try {
        result = await service.request('preview-segment', { consent: TERMS, ticket, trialTicket, slot, imageBase64,
          inputHash: record.sha256, inputBytes: record.bytes, inputWidth: record.width, inputHeight: record.height });
        if (!result.receipt || result.inputHash !== record.sha256 || !result.resultId || !result.result ||
          result.result.width !== record.width || result.result.height !== record.height) throw fail('未取得完整处理结果', 'PREVIEW_OUTCOME_UNKNOWN');
      } catch (error) {
        // Restore only a definitive pre-dispatch rejection. Never restore on
        // timeout, malformed response, or an earlier unknown provider attempt.
        if (error.bdaDispatched === false && ['SERVICE_CLOSED', 'SERVICE_BUSY', 'PAYMENT_NOT_CONFIRMED', 'INVALID_WORK_IMAGE', 'INPUT_CHANGED', 'NO_USES'].includes(error.code)) {
          if (grant) grant.used--; else state.trialUsed--;
          delete state.attempts[record.sha256]; save(state);
        }
        evidence('preview-unknown', error); throw error;
      }
      state.attempts[record.sha256].result = result; state.attempts[record.sha256].state = 'ready'; save(state);
      evidence('preview-ready'); return result;
    });
  }
  function grantFor(result) {
    if (!result) return null;
    return load().grants.find(g => !g.revoked && (g.orderId === result.grantOrderId || g.currentResultId === result.resultId));
  }
  async function applyPaid(ticket, response) {
    if (response.payment !== 'paid' || response.refund !== 'none' || ![2, 3, 4].includes(response.wechatOrderStatus)) return response;
    const state = load();
    if (!state.grants.some(g => g.orderId === ticket.orderId)) state.grants.push({ ...ticket, used: 0, revoked: false });
    state.grants.find(g => g.orderId === ticket.orderId).deliveryPending = true;
    state.trialUsed = 3; state.pending = null; save(state); // Persist entitlement once before acknowledging goods.
    evidence('entitlement-persisted', { orderId: ticket.orderId, wechatOrderStatus: response.wechatOrderStatus });
    try {
      const delivered = await service.request('preview-delivered', { ticket: ticket.ticket, entitlementReceived: true });
      if (delivered.acknowledged !== true || delivered.orderId !== ticket.orderId || delivered.wechatOrderStatus !== 4 ||
        delivered.payment !== 'paid' || delivered.refund !== 'none') throw fail('发货状态尚未确认', 'DELIVERY_NOT_CONFIRMED');
      const current = load(); current.grants.find(g => g.orderId === ticket.orderId).deliveryPending = false; save(current);
      evidence('delivery-confirmed', delivered); response = delivered;
    }
    catch (error) { response.deliveryPending = true; evidence('delivery-pending', error); }
    return response;
  }
  async function query(ticket) {
    try {
      const state = await service.request('preview-status', { ticket: ticket.ticket });
      if (state.orderId !== ticket.orderId) throw fail('付款状态暂未确认', 'ORDER_MISMATCH');
      evidence('payment-query', state);
      if (state.refund !== 'none' || state.payment === 'refunded') {
        const local = load(); for (const grant of local.grants) if (grant.orderId === ticket.orderId) grant.revoked = true; save(local);
      }
      return state;
    } catch (error) { evidence('payment-query-unknown', error); return { payment: 'unknown', refund: 'unknown' }; }
  }
  async function status() {
    return exclusive(async () => {
      const state = load(), ticket = state.pending || state.grants.find(g => !g.revoked && g.deliveryPending) || state.grants[state.grants.length - 1];
      if (!ticket) return { payment: 'none' };
      return applyPaid(ticket, await query(ticket));
    });
  }
  async function buy(result, onPhase = () => {}) {
    return exclusive(async () => {
      const feature = await features();
      let state = load(), ticket = state.pending;
      if (ticket) {
        const checked = await query(ticket);
        if (checked.payment === 'paid') return applyPaid(ticket, checked);
        if (checked.payment === 'unknown') return checked;
        if (checked.payment === 'closed' || checked.payment === 'refunded') { state.pending = null; save(state); ticket = null; }
        else if (checked.payment === 'unpaid' && ticket.currentResultId !== (result && result.resultId || null)) {
          throw fail('上次付款尚未结束，请返回上次照片预览继续付款，或等待付款关闭后重试', 'PENDING_RESULT_MISMATCH');
        }
      }
      if (!ticket && result && grantFor(result)) return { payment: 'paid', refund: 'none', alreadyOwned: true };
      if (!feature.newOrdersEnabled) {
        evidence('payment-blocked', { code: 'SERVICE_CLOSED' });
        throw fail('新付款暂未开放，可以保留预览或继续免费处理', 'SERVICE_CLOSED');
      }
      assertPaymentCapability(wxApi, feature);
      const action = ticket ? 'preview-payment' : 'preview-purchase';
      const data = ticket ? { ticket: ticket.ticket } : { receipt: result && result.receipt, consent: TERMS };
      onPhase('正在打开付款'); evidence('payment-prepare');
      let native;
      try {
        native = await service.payment(action, data, response => {
          const p = response.parameters || {}; let sign;
          try { sign = JSON.parse(p.signData); } catch (_) { throw fail('付款参数未完成，请稍后再试', 'INVALID_PAYMENT_PARAMETERS'); }
          if (!response.ticket || !/^P[a-f0-9]{30}$/.test(response.orderId) || p.mode !== 'short_series_goods' ||
            sign.outTradeNo !== response.orderId || sign.goodsPrice !== 100 || sign.env !== 0 || sign.buyQuantity !== 1 ||
            sign.currencyType !== 'CNY' || sign.productId !== 'photo_ai_bg_once_3' || !p.paySig || !p.signature) throw fail('付款参数未完成，请稍后再试', 'INVALID_PAYMENT_PARAMETERS');
          ticket = { orderId: response.orderId, ticket: response.ticket, currentResultId: response.currentResultId || null };
          state = load(); state.pending = ticket; save(state);
          evidence('payment-invoke', ticket);
        });
        evidence('payment-callback', native);
      } catch (error) { evidence('payment-prepare-failed', error); if (!ticket) throw fail('付款未能打开，请稍后再试', error.code || 'PAYMENT_NOT_STARTED'); }
      // Native success/failure/cancel are observations, never payment authority.
      let checked = await query(ticket);
      if (checked.payment === 'paid') return applyPaid(ticket, checked);
      // Apple/WeChat callbacks may arrive before query_order reaches state 2.
      // Poll only this persisted order; never create or invoke another payment.
      if (native && !native.cancelled && ['success', 'unknown'].includes(native.callback)) {
        onPhase('正在确认付款状态');
        for (const delay of [600, 1200, 2400, 4800]) {
          if (checked.payment === 'closed' || checked.payment === 'refunded') break;
          await pause(delay); checked = await query(ticket);
          if (checked.payment === 'paid') return applyPaid(ticket, checked);
        }
      }
      if (native && native.callback === 'unknown') return { payment: 'unknown', refund: 'unknown' };
      if (native && native.callback === 'success' && checked.payment === 'unpaid') return { ...checked, payment: 'unknown' };
      if (checked.payment === 'unpaid' && native && native.cancelled) {
        const local = load(); local.pending = null; save(local);
        return { ...checked, cancelled: true };
      }
      return checked;
    });
  }
  async function authorizeExport(result) {
    const grant = grantFor(result);
    if (!grant) return false;
    let response;
    try { response = await service.request('preview-export', { ticket: grant.ticket, receipt: result.receipt }); }
    catch (error) {
      if (error.code === 'PAYMENT_NOT_CONFIRMED') {
        const state = await query(grant);
        if (state.payment === 'refunded') return false;
      }
      throw error;
    }
    const authorized = response.authorized === true && response.payment === 'paid' && response.refund === 'none' &&
      [2, 4].includes(response.wechatOrderStatus) && response.orderId === grant.orderId && response.resultId === result.resultId;
    evidence('export-check', response); return authorized;
  }
  async function download(result, files, onPhase = () => {}) {
    if (!result.download || Date.now() >= result.download.expiresAt) throw fail('本次预览已过期，请保留当前照片；不会自动重新处理', 'RESULT_EXPIRED');
    onPhase('正在载入 AI 预览');
    let saved;
    try {
      if ((result.download.via && result.download.via !== 'scf') || typeof wxApi.base64ToArrayBuffer !== 'function') throw fail('当前微信无法读取处理结果，请更新微信后重试', 'RESULT_TRANSPORT_UNAVAILABLE');
      const response = await service.request('preview-result', { receipt: result.receipt });
      if (response.resultId !== result.resultId || response.inputHash !== result.inputHash || !response.result ||
        typeof response.imageBase64 !== 'string') throw fail('未取得完整处理结果', 'DOWNLOAD_FAILED');
      const data = bytes(wxApi.base64ToArrayBuffer(response.imageBase64));
      if (data.length !== response.result.bytes || sha256(data) !== response.result.sha256) throw fail('人物结果校验失败', 'INVALID_RESULT');
      const info = inspectResult(data, result.result);
      saved = await files.writeVerified(data, 'png');
      const decoded = await call(wxApi, 'getImageInfo', { src: saved.path });
      if (decoded.width !== info.width || decoded.height !== info.height || decoded.type !== 'png') throw fail('人物结果无法读取', 'INVALID_RESULT');
      return saved;
    } catch (error) {
      if (saved) await files.remove(saved.path);
      throw error;
    }
  }
  function releaseExpired(result) {
    if (!result || !result.download || Date.now() < result.download.expiresAt || typeof result.inputHash !== 'string') return false;
    const state = load(), attempt = state.attempts[result.inputHash];
    if (!attempt || !attempt.result || attempt.result.resultId !== result.resultId) return false;
    // Keep the consumed slot consumed. Only release this input's local reuse
    // lock so a later, explicit tap may spend another remaining opportunity.
    delete state.attempts[result.inputHash]; save(state); return true;
  }
  return { available, preview, buy, status, authorizeExport, download, summary, hasEntitlement: result => !!grantFor(result),
    releaseExpired, evidence: () => wxApi.getStorageSync(DIAGNOSTIC) || [] };
}
module.exports = { createPreviewPaid, PREVIEW_ENABLED, TERMS };
