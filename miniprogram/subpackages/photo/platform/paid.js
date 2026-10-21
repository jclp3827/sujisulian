const { call } = require('./files');
const { isCancel } = require('./errors');
const { bytes } = require('../core/bytes');
const { sha256 } = require('../core/sha256');
const { inspectResult } = require('./scf-segmentation');
const { createScfPurchase } = require('./scf-purchase');
const { assertPaymentCapability } = require('./paid-ledger-legacy');
const PAID_ENABLED = false;
const TERMS = 'photo-ai-simple-20261019-v1';
const STORAGE = 'photo-ai-pending-v1', RESULT_STORAGE = 'photo-ai-local-result-v1';
const LOCAL_RESULT_MS = 24 * 3600000;
function createPaid(wxApi, service = createScfPurchase(wxApi)) {
  const legacy = () => require('./paid-ledger-legacy').createPaid(wxApi);
  const pending = () => { try { return wxApi.getStorageSync(STORAGE) || null; } catch (_) { return null; } };
  const remember = ticket => wxApi.setStorageSync(STORAGE, Object.assign({}, ticket));
  const saved = () => { try { return wxApi.getStorageSync(RESULT_STORAGE) || null; } catch (_) { return null; } };
  async function removeSavedResult() {
    const result = saved(); try { wxApi.removeStorageSync(RESULT_STORAGE); } catch (_) {}
    if (result && result.path) try { await call(wxApi.getFileSystemManager(), 'unlink', { filePath: result.path }); } catch (_) {}
  }
  async function api(action, extra) {
    const ticket = pending();
    if (!ticket || ticket.flow !== 'single-scf') throw new Error('本机没有本次付款记录');
    return service.request(action, Object.assign({ ticket: ticket.ticket, receipt: ticket.receipt }, extra));
  }
  function prepare(record) {
    if (!record || !record.path || !Number.isSafeInteger(record.width) || !Number.isSafeInteger(record.height) || record.width < 1 || record.height < 1 || record.width > 1000 || record.height > 1000 || !Number.isSafeInteger(record.bytes) || record.bytes < 1 || record.bytes > 1572864) throw new Error('照片暂不适合 AI 处理，可以继续免费处理');
    const data = bytes(wxApi.getFileSystemManager().readFileSync(record.path));
    if (data.length !== record.bytes || sha256(data) !== record.sha256 || typeof wxApi.arrayBufferToBase64 !== 'function') throw new Error('本次照片已改变，请重新选择');
    return wxApi.arrayBufferToBase64(new Uint8Array(data).buffer);
  }
  async function status() {
    const ticket = pending();
    if (ticket && ticket.flow !== 'single-scf') return legacy().status();
    let order = await api('status');
    if (order.refund !== 'none') await removeSavedResult();
    // Retrying platform delivery acknowledgement is safe; this never calls AI.
    if (ticket.received && order.payment === 'paid' && order.deliveryState !== 'delivered') {
      try { await api('delivered'); order = await api('status'); } catch (_) { order.deliveryPending = true; }
    }
    if (ticket.submitted && order.task === 'not-started') order.task = 'unknown';
    return order;
  }
  async function buy(record, consent, onPhase = () => {}) {
    if (!PAID_ENABLED || !service.configured) throw new Error('AI 换背景暂未开放，可以继续免费处理');
    if (consent !== TERMS) throw new Error('请先确认上传与收费说明');
    const imageBase64 = prepare(record);
    let ticket = pending();
    if (ticket && ticket.flow !== 'single-scf') throw new Error('请先查询上一笔付款并完成售后，勿重复付款');
    if (ticket) {
      const order = await status();
      if (ticket.inputHash === record.sha256 && order.payment === 'paid' && order.refund === 'none' && order.task === 'ready') return order;
      if (order.payment === 'closed' || order.refund === 'refunded' || (ticket.received && order.deliveryState === 'delivered')) ticket = null;
      else if (ticket.submitted || order.payment === 'paid' || ticket.inputHash !== record.sha256) throw new Error('请先查询本次付款；已提交的分割不再重跑，未取得结果请按渠道申请售后');
    }
    const features = await service.request('features');
    if (!features.newOrdersEnabled || features.consumptionSafe !== true || features.priceFen !== 100 || features.flow !== 'single-scf') throw new Error('AI 换背景暂不可用，可以继续免费处理');
    assertPaymentCapability(wxApi, features);
    if (!ticket) {
      const payment = await service.request('purchase', { inputHash: record.sha256, inputWidth: record.width, inputHeight: record.height, inputBytes: record.bytes, consent });
      if (!payment.ticket || !payment.orderId || !payment.parameters) throw new Error('付款准备未完成，请勿付款');
      ticket = { flow: 'single-scf', orderId: payment.orderId, ticket: payment.ticket, inputHash: record.sha256, createdAt: Date.now(), submitted: false };
      remember(ticket); // Save BEFORE opening payment. No saved record, no payment.
      ticket.parameters = payment.parameters; // Session signature stays only in memory.
    } else {
      // Re-open the SAME unpaid trade after cancellation, never make a second
      // trade while the previous payment is unresolved. Server checks again.
      const payment = await api('payment');
      if (!payment.parameters) throw new Error('付款状态未确认，请先查询');
      ticket.parameters = payment.parameters;
    }
    onPhase('正在确认支付');
    try { await call(wxApi, 'requestVirtualPayment', ticket.parameters); }
    catch (error) {
      const checked = await status();
      if (checked.payment !== 'paid') {
        if (isCancel(error) && checked.refund === 'none') return Object.assign(checked, { cancelled: true });
        throw new Error('付款状态未确认，请查询本次付款，勿重复付款');
      }
    }
    const confirmed = await status();
    if (confirmed.payment !== 'paid' || confirmed.refund !== 'none') return confirmed;
    ticket = pending(); ticket.submitted = true; remember(ticket); // Mark before dispatch, including timeouts/restarts.
    onPhase('正在分割人像');
    const order = await api('segment', { imageBase64 }); // Exactly one client dispatch, no retry.
    if (!order.receipt) throw new Error('未取得本次结果凭据，请按渠道申请售后');
    ticket.receipt = order.receipt; remember(ticket); // Download retries use this reference, never AI.
    return order;
  }
  async function download(order) {
    if (order.flow !== 'single-scf') return legacy().download(order);
    if (order.payment !== 'paid' || order.refund !== 'none' || !order.result) throw new Error('本次结果不可用，请查询付款或申请售后');
    const local = saved();
    if (local && local.orderId === order.orderId && local.width === order.result.width && local.height === order.result.height && Number.isSafeInteger(local.savedAt) && Date.now() >= local.savedAt && Date.now() - local.savedAt < LOCAL_RESULT_MS) {
      try { if (sha256(bytes(wxApi.getFileSystemManager().readFileSync(local.path))) === local.sha256) return { path: local.path, persistent: true, local: true }; } catch (_) {}
    }
    await removeSavedResult();
    if (!order.download || Date.now() >= order.download.expiresAt) throw new Error('下载地址已到期，本机没有结果，请按付款渠道申请售后');
    let temp;
    try {
      const result = await call(wxApi, 'downloadFile', { url: order.download.url, timeout: 30000 }); temp = result.tempFilePath;
      if (result.statusCode !== 200 || !temp) throw new Error('结果下载未完成，可再次下载；不会重新分割');
      const data = bytes(wxApi.getFileSystemManager().readFileSync(temp)), info = inspectResult(data, order.result);
      // Native decoding rejects a truncated/malformed file before saving/using.
      const decoded = await call(wxApi, 'getImageInfo', { src: temp });
      if (decoded.width !== info.width || decoded.height !== info.height) throw new Error('人物结果尺寸不匹配');
      if (typeof wxApi.saveFile !== 'function') { const path = temp; temp = null; return { path, persistent: false, local: false }; }
      const file = await call(wxApi, 'saveFile', { tempFilePath: temp });
      if (!file.savedFilePath) throw new Error('结果未能保存在本机，请重试下载');
      const value = { orderId: order.orderId, path: file.savedFilePath, sha256: info.sha256, width: info.width, height: info.height, savedAt: Date.now() };
      try { wxApi.setStorageSync(RESULT_STORAGE, value); }
      catch (error) { try { await call(wxApi.getFileSystemManager(), 'unlink', { filePath: value.path }); } catch (_) {} throw error; }
      return { path: value.path, persistent: true, local: false };
    } finally { if (temp) try { await call(wxApi.getFileSystemManager(), 'unlink', { filePath: temp }); } catch (_) {} }
  }
  async function delivered(id) {
    const ticket = pending();
    if (ticket && ticket.flow !== 'single-scf') return legacy().delivered(id);
    if (!ticket || ticket.orderId !== id || !ticket.receipt) throw new Error('本次结果尚未取得');
    ticket.received = true; remember(ticket); return api('delivered');
  }
  async function guidance() {
    let order;
    try { order = await status(); }
    catch (_) { let platform; try { platform = wxApi.getDeviceInfo().platform; } catch (_) {} order = { platform }; }
    return { ...order, refundGuidance: order.platform === 'ios' ? 'iOS 订单请在 App Store 购买记录申请退款，由 Apple 审核。请保留本次订单号。' : '请保留本次订单号，通过小程序客服申请售后；开发者在微信虚拟支付后台核实并退款。本次尚未自动提交退款。' };
  }
  async function prune() {
    const result = saved();
    if (result && (!Number.isSafeInteger(result.savedAt) || result.savedAt > Date.now() || Date.now() - result.savedAt >= LOCAL_RESULT_MS)) await removeSavedResult();
  }
  async function available() {
    if (!PAID_ENABLED || !service.configured) return false;
    try { const value = await service.request('features'); assertPaymentCapability(wxApi, value); return value.newOrdersEnabled && value.consumptionSafe === true && value.priceFen === 100 && value.flow === 'single-scf'; } catch (_) { return false; }
  }
  return { buy, status, download, delivered, pending, prune, available, removeSavedResult, configured: service.configured, refund: guidance,
    report: async () => { const ticket = pending(); if (!ticket) throw new Error('本机没有付款记录'); await call(wxApi, 'setClipboardData', { data: ticket.orderId }); return guidance(); } };
}
module.exports = { createPaid, PAID_ENABLED, TERMS, assertPaymentCapability };
