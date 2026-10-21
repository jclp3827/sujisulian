const crypto = require("node:crypto");
const { exchangeLogin } = require("./wechat-identity");
const ensure = (ok, message) => { if (!ok) throw new Error(message); };
const hmac = (key, value) => crypto.createHmac("sha256", key).update(value).digest("hex");

// Only personal-entity, production, one-item direct purchase. All secrets stay
// in this module's server environment; neither session keys nor tokens persist.
function createVirtualPayment(env, { request, now = Date.now, session: trustedSession }) {
  const appId = env.PHOTO_APP_ID, offerId = env.PHOTO_VIRTUAL_OFFER_ID;
  const productId = env.PHOTO_VIRTUAL_PRODUCT_ID, appKey = env.PHOTO_VIRTUAL_APP_KEY;
  let cachedToken, tokenExpiresAt = 0, tokenRequest;
  async function json(url, method, data, allowEmpty = false) {
    const body = data === undefined ? undefined : typeof data === "string" ? data : JSON.stringify(data);
    const operations = { '/cgi-bin/stable_token': 'access-token', '/xpay/query_order': 'query-order',
      '/xpay/notify_provide_goods': 'deliver-goods', '/xpay/refund_order': 'refund-order' };
    const operation = operations[new URL(url).pathname];
    // WeChat rejects chunked JSON requests with HTTP 412. Frame the exact body
    // by UTF-8 byte length; do not change the bytes used by the HMAC signature.
    const headers = { "Content-Type": "application/json" };
    if (body !== undefined) headers['Content-Length'] = Buffer.byteLength(body, 'utf8');
    let r;
    try { r = await request(url, { method, headers }, body); }
    catch (_) { throw Object.assign(new Error('virtual-payment-network-unknown'), { operation }); }
    if (r.status !== 200 || r.body.length > 1024 * 1024) {
      throw Object.assign(new Error('virtual-payment-network-unknown'), {
        operation, httpStatus: Number.isSafeInteger(r.status) ? r.status : undefined
      });
    }
    if (allowEmpty && r.body.length === 0) return {};
    let result;
    try { result = JSON.parse(r.body.toString("utf8")); }
    catch (_) { throw Object.assign(new SyntaxError('invalid-payment-response'), { operation, httpStatus: r.status }); }
    // Do not propagate provider payloads/URLs: they may contain credentials.
    if (result.errcode) {
      const error = new Error("virtual-payment-channel-unknown");
      error.operation = operation;
      if (Number.isSafeInteger(result.errcode)) error.providerCode = result.errcode;
      throw error;
    }
    return result;
  }
  async function token() {
    if (cachedToken && now() < tokenExpiresAt) return cachedToken;
    if (!tokenRequest) tokenRequest = (async () => {
      const r = await json("https://api.weixin.qq.com/cgi-bin/stable_token", "POST", {
        grant_type: "client_credential", appid: appId, secret: env.PHOTO_APP_SECRET, force_refresh: false
      });
      ensure(typeof r.access_token === "string" && Number.isSafeInteger(r.expires_in) && r.expires_in > 0, "invalid-access-token");
      cachedToken = r.access_token; tokenExpiresAt = now() + Math.max(0, r.expires_in - 120) * 1000;
      return cachedToken;
    })().finally(() => { tokenRequest = null; });
    return tokenRequest;
  }
  async function api(path, value, signed = true) {
    const body = JSON.stringify(value), accessToken = await token();
    const query = new URLSearchParams({ access_token: accessToken });
    if (signed) query.set("pay_sig", hmac(appKey, path + "&" + body));
    return json("https://api.weixin.qq.com" + path + "?" + query, "POST", body, path === "/xpay/notify_provide_goods");
  }
  async function query(o, orderId = o.id) {
    const r = await api("/xpay/query_order", { openid: o.owner, env: 0, order_id: orderId });
    const order = r.order;
    ensure(order && order.order_id === orderId && order.env_type === 1,
      "virtual-order-identity-mismatch");
    return order;
  }
  async function queryPayment(o) {
    const r = await query(o);
    if ([0, 1, 6].includes(r.status)) {
      ensure(!o.transactionId, "paid-order-regressed-needs-reconciliation");
      return { paid: false, closed: r.status === 6, orderStatus: r.status };
    }
    ensure([2, 3, 4, 5, 7, 8].includes(r.status), "unsupported-payment-state");
    // The response does not repeat AppID/OfferID/OpenID: their authority is the
    // server-owned token, AppKey and owner-scoped request, not invented fields.
    ensure([0, 7].includes(r.order_type) && r.order_fee === 100 && r.paid_fee === 100 && typeof r.wx_order_id === "string" && r.wx_order_id.length > 0 && Number.isSafeInteger(r.left_fee) && r.left_fee >= 0 && r.left_fee <= 100,
      "virtual-order-amount-or-type-mismatch");
    if (o.transactionId) ensure(o.transactionId === r.wx_order_id, "virtual-transaction-changed");
    const revoked = r.left_fee < 100 || [5, 7, 8].includes(r.status);
    return { orderStatus: r.status, paid: [2, 3, 4].includes(r.status) && !revoked, amount: r.order_fee, currency: "CNY", appId, merchantId: offerId,
      owner: o.owner, orderId: r.order_id, transactionId: r.wx_order_id, platform: r.order_type === 7 ? "ios" : "android",
      deliveryState: r.status === 4 ? "delivered" : r.status === 3 ? "delivering" : "pending",
      refundState: revoked ? r.status === 8 ? "SUCCESS" : r.status === 7 ? "FAILED" : "PROCESSING" : null };
  }
  return {
    refreshPaidOrders: true,
    async preparePayment(o, loginCode) {
      const session = trustedSession || await exchangeLogin(env, request, loginCode);
      ensure(session.openid === o.owner && typeof session.session_key === "string" && session.session_key.length > 0, "payment-session-owner-mismatch");
      const signData = JSON.stringify({ offerId, buyQuantity: 1, env: 0, currencyType: "CNY", productId, goodsPrice: 100, outTradeNo: o.id,
        attach: JSON.stringify({ orderId: o.id, inputHash: o.inputHash, terms: o.terms }) });
      return { channel: "virtual", parameters: { signData, mode: "short_series_goods", paySig: hmac(appKey, "requestVirtualPayment&" + signData), signature: hmac(session.session_key, signData) } };
    },
    queryPayment,
    async markDelivered(o) {
      // The live xpay endpoint also requires pay_sig for delivery confirmation.
      // Sign the same body bytes that carry the fixed Content-Length header.
      return api("/xpay/notify_provide_goods", { order_id: o.id, env: 0 });
    },
    async refund(o) {
      const r = await query(o);
      ensure(r.order_type === 0, "iOS 订单请向 App Store 申请退款");
      ensure(r.order_fee === 100 && r.paid_fee === 100 && r.left_fee === 100 && [2, 3, 4].includes(r.status) && r.wx_order_id === o.transactionId, "refund-order-needs-reconciliation");
      return api("/xpay/refund_order", { openid: o.owner, order_id: o.id, refund_order_id: o.refundId,
        left_fee: r.left_fee, refund_fee: 100, biz_meta: o.id, refund_reason: "1", req_from: "3", env: 0 });
    },
    async queryRefund(o) {
      const r = await query(o, o.refundId);
      ensure([1, 8].includes(r.order_type) && r.refund_fee === 100 && typeof r.wx_order_id === "string" && r.wx_order_id.length > 0 && (!o.refundTransactionId || o.refundTransactionId === r.wx_order_id), "refund-receipt-mismatch");
      // 5 = merchant debited, 8 = user received. Unknown is never NOT_FOUND.
      return { state: r.status === 8 ? "SUCCESS" : r.status === 7 ? "FAILED" : "PROCESSING" };
    },
    async reconcileRefundNotification(o, event) {
      // Native push supplies the parent/refund association; BOTH cash records
      // are still queried before a successful refund can revoke the purchase.
      ensure(event.WxOrderId === o.transactionId && event.OpenId === o.owner && Number(event.RefundFee) === 100 && Number(event.RetCode) === 0,
        "refund-notification-parent-mismatch");
      ensure(typeof event.MchRefundId === "string" && /^[A-Za-z0-9_-]{8,32}$/.test(event.MchRefundId), "invalid-refund-order");
      const parent = await queryPayment(o);
      ensure(parent.refundState, "refund-parent-not-revoked");
      const r = await query(o, event.MchRefundId);
      ensure(r.wx_order_id === event.WxRefundId && r.refund_fee === 100 && r.order_type === (parent.platform === "ios" ? 8 : 1), "refund-notification-receipt-mismatch");
      ensure(r.status === 8, "refund-user-receipt-pending");
      return { refundId: event.MchRefundId, refundTransactionId: r.wx_order_id };
    }
  };
}
module.exports = { createVirtualPayment, hmac };
