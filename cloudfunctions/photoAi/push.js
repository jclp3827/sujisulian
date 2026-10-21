// CloudBase message push only. Notifications are query hints, never payment
// evidence. Even a forged body cannot mark paid, trigger AI, or issue a refund.
async function handlePush(event, context, { store, orders, provider, productId }) {
  if (context.OPENID || context.FROM_OPENID || String(context.SOURCE || "").split(",").some(s => ["wx_client", "wx_devtools", "wx_http", "wx_localdebug"].includes(s))) {
    throw new Error("client-notification-not-allowed");
  }
  const isGoods = event.Event === "xpay_goods_deliver_notify", isRefund = event.Event === "xpay_refund_notify";
  if (event.MsgType !== "event" || (!isGoods && !isRefund)) throw new Error("unsupported-push");
  const id = isGoods ? event.OutTradeNo : event.MchOrderId;
  if (!/^P[a-f0-9]{30}$/.test(id || "")) throw new Error("invalid-push-order");
  const o = await store.get(id);
  if (!o || o.owner !== event.OpenId) throw new Error("push-owner-mismatch");
  if (isGoods) {
    const goods = event.GoodsInfo;
    if (Number(event.Env) !== 0 || !goods || goods.ProductId !== productId || Number(goods.Quantity) !== 1 || Number(goods.ActualPrice) !== 100) throw new Error("push-product-mismatch");
  } else {
    const receipt = await provider.reconcileRefundNotification(o, event);
    await store.change(id, current => {
      if (current.transactionId !== o.transactionId || (current.refundId && current.refundId !== receipt.refundId)) throw new Error("refund-association-changed");
      return Object.assign(current, receipt, { refund: "refunded" });
    });
  }
  const status = await orders.status(o.owner, o.id); // Always authenticated query.
  if (isGoods) {
    const current = await store.get(id);
    if (event.WeChatPayInfo && event.WeChatPayInfo.MchOrderNo !== current.transactionId) throw new Error("push-transaction-mismatch");
    if (status.payment !== "paid" || status.task !== "ready" || status.refund !== "none") return { ErrCode: -1, ErrMsg: "delivery-pending" };
  } else if (status.refund !== "refunded") return { ErrCode: -1, ErrMsg: "refund-reconciliation-pending" };
  return { ErrCode: 0, ErrMsg: "success" };
}
module.exports = { handlePush };
