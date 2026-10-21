const { call } = require("./files");
const { isCancel } = require("./errors");
const { sha256 } = require("../core/sha256");
const { bytes } = require("../core/bytes");
const { createOrderService } = require("./order-service");

// Opening this switch alone cannot enable purchases: the server independently
// checks channel eligibility, completed real acceptance, privacy and budget.
const PAID_ENABLED = false;
const TERMS = "photo-ai-20261019-v2";
const STORAGE = "photo-ai-pending-v1";
const RESULT_STORAGE = "photo-ai-local-result-v1";
const LOCAL_RESULT_MS = 24 * 60 * 60 * 1000;
const MAX_BDA_BASE64_BYTES = 5 * 1024 * 1024;

function assertPaymentCapability(wxApi, features) {
  if (features.channel !== "virtual" || typeof wxApi.requestVirtualPayment !== "function" || (wxApi.canIUse && !wxApi.canIUse("requestVirtualPayment"))) throw new Error("当前微信暂不支持此支付方式，可以继续免费处理");
  const info = typeof wxApi.getAppBaseInfo === "function" ? wxApi.getAppBaseInfo() : wxApi.getSystemInfoSync();
  const device = typeof wxApi.getDeviceInfo === "function" ? wxApi.getDeviceInfo() : info;
  if (device.platform === "ios") {
    const parts = String(info.version || "").split(".").map(Number), minimum = [8, 0, 68];
    let supported = parts.length >= 3 && parts.every(Number.isSafeInteger);
    for (let i = 0; supported && i < 3; i++) { if (parts[i] !== minimum[i]) { supported = parts[i] > minimum[i]; break; } }
    if (!supported) throw new Error("AI 支付需要微信 8.0.68 或更新版本，可以继续免费处理");
    if (!features.iosEnabled) throw new Error("iPhone 付费功能暂未开放，可以继续免费处理");
  }
}

function createPaid(wxApi) {
  const service = createOrderService(wxApi);
  async function api(action, data) {
    const ticket = pending();
    // Old CloudBase tickets keep their recovery route. New purchases use only
    // the paid SCF endpoint; the internal token endpoint is never a fallback.
    if (["features", "create"].includes(action) || (ticket && ticket.transport === "scf") || (!ticket && service.configured)) return service.request(action, data);
    if (!["status", "confirm", "start", "refund", "report", "delivered"].includes(action) || !ticket || !ticket.orderId) throw new Error("AI 换背景暂未开放，可以继续免费处理");
    if (!wxApi.cloud || !wxApi.cloud.callFunction) throw new Error("当前微信暂不支持此服务");
    const r = await call(wxApi.cloud, "callFunction", { name: "photoAi", data: Object.assign({ action }, data) });
    if (!r.result) throw new Error("服务暂不可用，请稍后查询本次订单");
    return r.result;
  }
  function pending() { try { return wxApi.getStorageSync(STORAGE) || null; } catch (_) { return null; } }
  function remember(value) { wxApi.setStorageSync(STORAGE, value); }
  function savedResult() { try { return wxApi.getStorageSync(RESULT_STORAGE) || null; } catch (_) { return null; } }
  function forgetSavedResult() { try { wxApi.removeStorageSync(RESULT_STORAGE); } catch (_) {} }
  async function removeSavedResult(value) {
    const saved = value || savedResult();
    forgetSavedResult();
    if (!saved || !saved.path) return;
    try { await call(wxApi.getFileSystemManager(), "unlink", { filePath: saved.path }); } catch (_) {}
  }
  function verifiedLocal(order) {
    const saved = savedResult();
    if (!saved || saved.orderId !== order.orderId || !order.result || saved.sha256 !== order.result.sha256 || saved.width !== order.result.width ||
      saved.height !== order.result.height || !Number.isSafeInteger(saved.savedAt) || saved.savedAt > Date.now() || Date.now() - saved.savedAt >= LOCAL_RESULT_MS) return null;
    try {
      const fs = wxApi.getFileSystemManager(), stat = fs.statSync(saved.path);
      if (!stat || !stat.isFile() || stat.size < 1 || stat.size > 8 * 1024 * 1024) return null;
      const data = bytes(fs.readFileSync(saved.path));
      if (sha256(data) !== saved.sha256) return null;
      return saved;
    } catch (_) { return null; }
  }
  function prepareInline(record) {
    if (!record || !Number.isSafeInteger(record.width) || !Number.isSafeInteger(record.height) || record.width < 1 || record.height < 1 ||
      record.width >= 2000 || record.height >= 2000 || record.width * record.height > 1000000) throw new Error("当前照片尺寸不适合 AI 处理，可以继续免费处理");
    const fs = wxApi.getFileSystemManager(), data = bytes(fs.readFileSync(record.path));
    if (data.length !== record.bytes || sha256(data) !== record.sha256) throw new Error("本次照片已改变，请重新准备后再支付");
    if (typeof wxApi.arrayBufferToBase64 !== "function") throw new Error("当前微信暂不支持安全上传，可以继续免费处理");
    const imageBase64 = wxApi.arrayBufferToBase64(new Uint8Array(data).buffer);
    if (!imageBase64 || imageBase64.length > MAX_BDA_BASE64_BYTES) throw new Error("照片数据超过 AI 接口限制，可以继续免费处理");
    return imageBase64;
  }
  async function buy(record, consentVersion, onPhase) {
    if (!PAID_ENABLED) throw new Error("AI 换背景暂未开放，可以继续免费处理");
    if (consentVersion !== TERMS) throw new Error("请先确认上传与收费说明");
    const imageBase64 = prepareInline(record); // Validate before any payment request.
    let ticket = pending(), previous = null;
    if ((!ticket || !ticket.orderId) && service.configured) {
      const recent = await service.request("recent");
      if (recent.orderId) {
        ticket = { orderId: recent.orderId, inputHash: recent.inputHash, transport: "scf" }; remember(ticket); previous = recent;
      }
    }
    if (ticket && ticket.orderId) {
      // Only a server-confirmed closed, unpaid attempt permits a new trade ID.
      previous = previous || await api("status", { orderId: ticket.orderId });
      if (previous.payment === "closed" || previous.refund === "refunded") { ticket = null; previous = null; }
    }
    if (ticket && ticket.inputHash !== record.sha256) {
      if (!previous || previous.payment !== "paid") throw new Error("上一笔支付尚未确认或关闭，请先查询本次订单，勿重复付款");
      if (previous && previous.payment === "paid" && previous.refund !== "refunded" && (previous.task !== "ready" || previous.refund !== "none")) throw new Error("还有待恢复或售后的订单，请先查看本次订单");
      ticket = null; previous = null;
    }
    const resumingPaid = previous && previous.payment === "paid";
    if (!resumingPaid) {
      const feature = await api("features");
      if (!feature.newOrdersEnabled || feature.priceFen !== 100 || feature.aiProvider !== "bda" || feature.inputTransport !== "inline") throw new Error("AI 换背景暂不可用，可以继续免费处理");
      assertPaymentCapability(wxApi, feature);
    }
    if (!ticket) {
      ticket = { inputHash: record.sha256, transport: "scf", requestKey: Date.now().toString(36) + "-" + Math.random().toString(36).slice(2) + "-" + Math.random().toString(36).slice(2) };
      remember(ticket); // Preserve idempotency even if the create response is lost.
    }
    const order = resumingPaid ? previous : await api("create", { inputHash: record.sha256, inputBytes: record.bytes, inputWidth: record.width, inputHeight: record.height,
      requestKey: ticket.requestKey, consent: TERMS });
    ticket.orderId = order.orderId; remember(ticket);
    onPhase("正在确认支付");
    if (order.payment !== "paid") {
      const payment = await api("payment", { orderId: order.orderId });
      if (payment.channel !== "virtual" || !payment.parameters) throw new Error("支付配置尚未就绪，请勿付款");
      try { await call(wxApi, "requestVirtualPayment", payment.parameters); }
      catch (error) {
        const checked = await api("confirm", { orderId: order.orderId });
        if (checked.payment !== "paid") {
          if (isCancel(error)) return { orderId: order.orderId, payment: "unpaid", cancelled: true };
          throw new Error("支付状态尚未确认，请勿重复付款，请查询本次订单");
        }
      }
    }
    const confirmed = await api("confirm", { orderId: order.orderId });
    if (confirmed.payment !== "paid") throw new Error("支付状态尚未确认，请勿重复付款");
    if (confirmed.refund !== "none") return api("status", { orderId: order.orderId });
    if (confirmed.task === "not-started") {
      onPhase("正在更换背景");
      await api("start", { orderId: order.orderId, imageBase64 });
    }
    return api("status", { orderId: order.orderId });
  }
  async function status() {
    let ticket = pending(), order;
    if (!ticket || !ticket.orderId) {
      if (!service.configured) throw new Error("暂无可恢复的订单");
      order = await service.request("recent");
      if (!order.orderId) throw new Error("暂无可恢复的订单");
      ticket = { orderId: order.orderId, inputHash: order.inputHash, transport: "scf" }; remember(ticket);
    } else order = await api("status", { orderId: ticket.orderId });
    if (order.refund !== "none") await removeSavedResult();
    return order;
  }
  async function download(order) {
    if (!order.result || order.payment !== "paid" || order.refund !== "none") throw new Error("结果尚未就绪，请稍后恢复本次处理");
    const local = verifiedLocal(order);
    if (local) return { path: local.path, persistent: true, local: true };
    const stale = savedResult();
    if (stale) await removeSavedResult(stale);
    if (!order.download) throw new Error("临时下载地址已失效且本机结果不存在，请申请恢复或退款");
    const r = await call(wxApi, "downloadFile", { url: order.download.url, timeout: 30000 });
    if (r.statusCode !== 200) throw new Error("结果下载未完成，请稍后重试；不会重新调用 AI");
    const data = bytes(wxApi.getFileSystemManager().readFileSync(r.tempFilePath));
    if (sha256(data) !== order.result.sha256) throw new Error("结果文件不完整，请重新下载");
    if (typeof wxApi.saveFile !== "function") return { path: r.tempFilePath, persistent: false, local: false };
    const saved = await call(wxApi, "saveFile", { tempFilePath: r.tempFilePath });
    if (!saved.savedFilePath) throw new Error("AI 结果未能保存在本机，请稍后重新下载");
    const value = { orderId: order.orderId, path: saved.savedFilePath, sha256: order.result.sha256, width: order.result.width, height: order.result.height, savedAt: Date.now() };
    wxApi.setStorageSync(RESULT_STORAGE, value);
    return { path: value.path, persistent: true, local: true };
  }
  async function prune() {
    const saved = savedResult();
    if (saved && (!Number.isSafeInteger(saved.savedAt) || saved.savedAt > Date.now() || Date.now() - saved.savedAt >= LOCAL_RESULT_MS)) await removeSavedResult(saved);
  }
  async function available() {
    if (!PAID_ENABLED || !service.configured) return false;
    try {
      const feature = await api("features");
      assertPaymentCapability(wxApi, feature);
      return feature.newOrdersEnabled && feature.priceFen === 100 && feature.aiProvider === "bda" && feature.inputTransport === "inline";
    } catch (_) { return false; }
  }
  return { buy, status, download, pending, removeSavedResult, prune, available, configured: service.configured,
    delivered: id => api("delivered", { orderId: id }),
    refund: async id => { const result = await api("refund", { orderId: id }); if (result.refund !== "none") await removeSavedResult(); return result; },
    report: id => api("report", { orderId: id }) };
}
module.exports = { createPaid, PAID_ENABLED, TERMS, assertPaymentCapability };
