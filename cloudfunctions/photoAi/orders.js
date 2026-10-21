const crypto = require("node:crypto");
const PRICE_FEN = 100;
const TERMS = "photo-ai-20261019-v2";
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const ensure = (value, message) => { if (!value) throw new Error(message); };

// All transitions are persisted via store.change (database transaction). No
// request body, client payment callback, or process-local lock proves payment.
function createOrders({ store, provider, config, now = Date.now }) {
  async function owned(id, owner) {
    const order = await store.get(id);
    ensure(order && order.owner === owner, "订单不存在或无权访问");
    return order;
  }
  function refundable(o) {
    return o.task === "failed" || o.task === "not-started" ||
      (o.task === "ready" && (o.resultDeleted || now() >= o.expiresAt) && !o.deliveredAt);
  }
  function view(o) {
    return { orderId: o.id, inputHash: o.inputHash, priceFen: PRICE_FEN, payment: o.payment, task: o.task,
      refund: o.refund, refundRoute: o.paymentPlatform === "ios" ? "app-store" : "developer", result: o.result ? { sha256: o.result.sha256, width: o.result.width, height: o.result.height } : null,
      expiresAt: o.expiresAt || null, supportRequired: o.supportRequired || false,
      inputTransport: o.inputTransport || "private-upload",
      canRefund: ["none", "retryable"].includes(o.refund) && o.payment === "paid" && refundable(o) };
  }
  async function create(owner, input) {
    ensure(config.newOrdersEnabled, "AI 换背景暂未开放，可以继续免费处理");
    ensure(input.consent === TERMS && typeof input.inputHash === "string" && /^[a-f0-9]{64}$/.test(input.inputHash), "请确认照片上传说明");
    ensure(Number.isSafeInteger(input.inputBytes) && input.inputBytes > 0 && input.inputBytes <= 8 * 1024 * 1024, "工作图大小不受支持");
    if (provider.transport === "inline") {
      ensure(Number.isSafeInteger(input.inputWidth) && Number.isSafeInteger(input.inputHeight) && input.inputWidth > 0 && input.inputHeight > 0 &&
        input.inputWidth < 2000 && input.inputHeight < 2000 && input.inputWidth * input.inputHeight <= 1000000, "工作图尺寸不受支持");
    }
    ensure(typeof input.requestKey === "string" && /^[a-zA-Z0-9-]{16,80}$/.test(input.requestKey), "请求标识无效");
    ensure(!("price" in input || "priceFen" in input || "owner" in input), "价格与订单归属由服务端确定");
    const id = "P" + sha(owner + ":" + input.requestKey).slice(0, 30);
    const order = await store.change(id, previous => {
      if (previous) { ensure(previous.owner === owner && previous.inputHash === input.inputHash && previous.inputBytes === input.inputBytes &&
        previous.inputWidth === (input.inputWidth || null) && previous.inputHeight === (input.inputHeight || null), "不能更换订单输入"); return previous; }
      return { id, owner, inputHash: input.inputHash, inputBytes: input.inputBytes, priceFen: PRICE_FEN, terms: TERMS,
        payment: "unpaid", task: "not-started", refund: "none", result: null,
        inputTransport: provider.transport || "private-upload", inputWidth: input.inputWidth || null, inputHeight: input.inputHeight || null,
        inputKey: provider.transport === "inline" ? null : "photo-ai/" + sha(owner).slice(0, 24) + "/" + id + "/input.jpg",
        resultKey: provider.transport === "inline" ? null : "photo-ai/" + sha(owner).slice(0, 24) + "/" + id + "/result.png",
        createdAt: now(), updatedAt: now(), expiresAt: null, inputDeleted: false, resultDeleted: false };
    });
    return view(order);
  }
  async function payment(owner, id, loginCode) {
    const order = await owned(id, owner);
    ensure(config.newOrdersEnabled && order.payment === "unpaid", "当前订单无需再次付款，请查询订单状态");
    // Same out_trade_no on all retries. Never create a second payment order.
    return provider.preparePayment(order, loginCode);
  }
  async function confirm(owner, id) {
    let o = await owned(id, owner);
    if (o.payment !== "paid" || provider.refreshPaidOrders) {
      const receipt = await provider.queryPayment(o);
      if (receipt.closed) o = await store.change(id, current => {
        ensure(!current.transactionId, "已支付订单不能标记关闭");
        return Object.assign(current, { payment: "closed", updatedAt: now() });
      });
      if (receipt.paid || receipt.refundState) {
        ensure(receipt.amount === PRICE_FEN && receipt.currency === "CNY" && receipt.appId === config.appId &&
          receipt.merchantId === config.merchantId && receipt.owner === o.owner && receipt.orderId === id && receipt.transactionId,
          "支付核对失败，请联系客服处理");
        o = await store.change(id, current => {
          ensure(!current.transactionId || current.transactionId === receipt.transactionId, "支付交易号发生变化");
          const next = Object.assign(current, { payment: "paid", transactionId: receipt.transactionId, paymentPlatform: receipt.platform || current.paymentPlatform,
            paidAt: current.paidAt || now(), updatedAt: now() });
          // Query-backed external refunds revoke download/start even if the
          // developer did not initiate them (notably Apple refunds).
          if (receipt.refundState && current.refund !== "refunded") Object.assign(next, {
            refund: receipt.refundState === "SUCCESS" ? "refunded" : receipt.refundState === "FAILED" ? "manual" : "requested",
            externalRefund: !current.refundId, supportRequired: receipt.refundState === "FAILED" || current.supportRequired || false
          });
          return next;
        });
      }
    }
    return view(o);
  }
  async function upload(owner, id) {
    await confirm(owner, id);
    const o = await owned(id, owner);
    ensure(o.payment === "paid" && o.task === "not-started" && o.refund === "none", "请先确认本次支付状态");
    ensure(o.inputTransport !== "inline" && provider.uploadPermission, "当前处理不使用云端图片存储");
    return provider.uploadPermission(o);
  }
  async function start(owner, id, input) {
    const ticket = crypto.randomUUID();
    await confirm(owner, id);
    const existing = await owned(id, owner);
    let preparedInput;
    if (existing.task === "not-started" && existing.inputTransport === "inline") {
      ensure(provider.prepareInput, "处理服务输入配置无效");
      preparedInput = await provider.prepareInput(existing, input);
    }
    let o = await store.change(id, current => {
      ensure(current.owner === owner && current.payment === "paid", "支付尚未确认");
      ensure(current.refund === "none", "订单正在退款或处理售后");
      if (current.task !== "not-started") return current;
      ensure(config.processingEnabled, "处理服务暂不可用，已付款订单可恢复或申请退款");
      return Object.assign(current, { task: "processing", attempt: ticket, startedAt: now(), updatedAt: now() });
    });
    if (o.attempt !== ticket) return view(o); // Duplicate callbacks never invoke AI.
    try {
      await store.reserveCall(o.id, config.dailyCallLimit);
      // Provider validates the fixed private upload hash and decoded input before
      // issuing one AI request. Intent is durable even if the process is killed.
      const result = await provider.process(o, preparedInput);
      ensure(result && /^[a-f0-9]{64}$/.test(result.sha256) && result.width > 0 && result.height > 0, "未取得有效结果");
      o = await store.change(id, current => {
        ensure(current.attempt === ticket && current.payment === "paid" && current.refund === "none", "订单状态已变更");
        return Object.assign(current, { task: "ready", result, expiresAt: result.downloadExpiresAt || now() + config.retentionMs, updatedAt: now() });
      });
      if (provider.deleteInput) try { await provider.deleteInput(o); await store.change(id, current => Object.assign(current, { inputDeleted: true })); } catch (_) {}
    } catch (error) {
      o = await store.change(id, current => current.task === "ready" || current.refund !== "none" ? current : Object.assign(current, {
        task: error.definiteFailure ? "failed" : "unknown", failureCode: error.definiteFailure ? "invalid-or-failed" : "upstream-outcome-unknown", updatedAt: now()
      }));
      // Unknown execution is never automatically submitted to AI again.
    }
    if (o.task === "ready" && o.refund === "none") await acknowledgeDelivery(o);
    return view(o);
  }
  async function acknowledgeDelivery(o) {
    if (!provider.markDelivered || o.platformDeliveryAcknowledged || o.resultDeleted || !o.expiresAt || now() >= o.expiresAt) return;
    try {
      await provider.markDelivered(o);
      await store.change(o.id, current => Object.assign(current, { platformDeliveryAcknowledged: true, platformDeliveryAt: now() }));
    } catch (_) { /* A later status/maintenance retries acknowledgement, never AI. */ }
  }
  async function status(owner, id) {
    let o = await owned(id, owner);
    await confirm(owner, id);
    o = await owned(id, owner);
    if (["processing", "unknown"].includes(o.task)) {
      const recovered = provider.findSavedResult ? await provider.findSavedResult(o) : null;
      if (recovered) o = await store.change(id, current => current.refund !== "none" || current.task === "ready" ? current : Object.assign(current, { task: "ready", result: recovered, expiresAt: recovered.downloadExpiresAt || current.expiresAt || now() + config.retentionMs }));
      else if (now() - o.startedAt >= config.unknownWaitMs) {
        o = await store.change(id, current => ["processing", "unknown"].includes(current.task) ? Object.assign(current, { task: "failed", supportRequired: true }) : current);
      }
    }
    if (o.refund === "requested" && o.refundId) {
      const result = await provider.queryRefund(o);
      o = await store.change(id, current => Object.assign(current, { refund: result.state === "SUCCESS" ? "refunded" : result.state === "PROCESSING" ? "requested" : result.state === "NOT_FOUND" && (current.refundAttempts || 0) < 2 ? "retryable" : "manual", supportRequired: !["SUCCESS", "PROCESSING"].includes(result.state) }));
    }
    if (o.task === "ready" && o.refund === "none") await acknowledgeDelivery(o);
    const response = view(o);
    if (o.task === "ready" && o.refund === "none" && now() < o.expiresAt && !o.resultDeleted) response.download = await provider.resultPermission(o);
    else if (o.task === "ready" && (o.resultDeleted || now() >= o.expiresAt)) response.resultExpired = true;
    return response;
  }
  async function refund(owner, id) {
    await status(owner, id);
    let o = await owned(id, owner);
    ensure(o.payment === "paid", "本次付款尚未确认");
    ensure(refundable(o), "订单尚在核实或已有可用结果，请先查询状态");
    if (o.paymentPlatform === "ios" && o.refund === "none") {
      await store.change(id, current => Object.assign(current, { supportRequired: true, refundGuidanceAt: now() }));
      return Object.assign(view(o), { refundGuidance: "请向 App Store 申请退款，由 Apple 决定；本小程序尚未提交退款。可在 Apple 的 reportaproblem.apple.com 查询和申请。" });
    }
    if (["refunded", "requested", "manual"].includes(o.refund)) return view(o);
    const ticket = crypto.randomUUID();
    o = await store.change(id, current => {
      if (!["none", "retryable"].includes(current.refund)) return current;
      ensure(refundable(current), "订单已开始处理，请先查询状态");
      return Object.assign(current, { refund: "requested", refundId: "R" + current.id.slice(1), refundAttempt: ticket, refundAttempts: (current.refundAttempts || 0) + 1, updatedAt: now() });
    });
    if (o.refundAttempt !== ticket) return view(o);
    try { await provider.refund(o); } catch (_) {
      // A network timeout is not proof that refund failed. Query by the same ID.
      await store.change(id, current => Object.assign(current, { supportRequired: true }));
    }
    return view(await owned(id, owner));
  }
  async function delivered(owner, id) {
    await owned(id, owner);
    return view(await store.change(id, current => { ensure(current.task === "ready" && current.refund === "none", "结果尚未就绪或正在售后处理"); return Object.assign(current, { deliveredAt: now() }); }));
  }
  async function report(owner, id) {
    await owned(id, owner);
    return view(await store.change(id, current => Object.assign(current, { supportRequired: true, supportCode: "user-reported-result-or-delivery-problem", supportRequestedAt: now() })));
  }
  async function maintenance() {
    const deadline = now() + 30000, batch = await store.pending();
    let processed = 0;
    for (const o of batch) {
      if (now() >= deadline) break; // Leave the remainder for the next invocation.
      try {
        await status(o.owner, o.id);
        const current = await store.get(o.id);
        if (current.task === "failed" && current.payment === "paid" && current.paymentPlatform !== "ios" && ["none", "retryable"].includes(current.refund)) await refund(current.owner, current.id);
      } catch (_) { /* Query failure must not suppress private-file cleanup. */ }
      try {
        const current = await store.get(o.id);
        const shouldDelete = current.expiresAt ? now() >= current.expiresAt : now() - current.createdAt >= config.retentionMs;
        if (shouldDelete || current.task === "ready" || current.task === "failed" || current.refund !== "none") {
          const cleanup = await provider.cleanup(current, shouldDelete || current.refund !== "none");
          await store.change(current.id, value => {
            const next = Object.assign(value, cleanup, { cleanedAt: now() });
            if (cleanup.resultReferenceDeleted) {
              if (next.result) next.result = Object.assign({}, next.result, { downloadUrl: null });
              next.resultReference = null;
            }
            return next;
          });
        }
      } catch (_) { /* Persisted state remains eligible for the next bounded sweep. */ }
      // Advance even when one order cannot be queried/cleaned; retry it after
      // wrapping rather than starving every later order indefinitely.
      if (store.advanceMaintenance) await store.advanceMaintenance(o.id);
      processed++;
    }
    return { processed, batchSize: batch.length, timeBoundaryReached: processed < batch.length };
  }
  async function recent(owner) {
    const order = await store.recent(owner);
    return order ? status(owner, order.id) : { orderId: null };
  }
  return { create, payment, confirm, upload, start, status, refund, delivered, report, maintenance, recent };
}
module.exports = { createOrders, PRICE_FEN, TERMS };
