// Packaged with the existing photoAi modules by scripts/build-photo-orders.js.
// No wx context, static client token, instance-local ledger, or photo bucket.
const { createOrders } = require("./shared/orders");
const { createPersistence, persistenceConfigured } = require("./persistence");
const { createBdaProvider } = require("./shared/bda-provider");
const { createVirtualPayment } = require("./shared/virtual-payment");
const { exchangeLogin } = require("./shared/wechat-identity");
const { configuration } = require("./shared/configuration");
const { createBudgetedRequest } = require("./shared/request-budget");
const { request } = require("./shared/providers");
const { handlePush } = require("./shared/push");
const { maintenanceMode } = require("./shared/maintenance-authority");
const { decodeNotification, handshake, encrypt } = require("./notify");

function reply(statusCode, value) {
  return { statusCode, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, body: JSON.stringify(value) };
}
function parse(event) {
  if (event.httpMethod !== "POST" || typeof event.body !== "string" || event.body.length > 6 * 1024 * 1024) throw new Error("invalid-request");
  const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  const value = JSON.parse(body);
  if (!value || Array.isArray(value) || typeof value !== "object") throw new Error("invalid-request");
  return value;
}
function roleEnv(env) {
  // Event SCF injects rotating role credentials. Never fall back to permanent
  // BDA keys on this public paid endpoint.
  return Object.assign({}, env, { PHOTO_AI_PROVIDER: "bda", PHOTO_BDA_REGION: env.BDA_REGION || "ap-guangzhou",
    PHOTO_BDA_SECRET_ID: env.TENCENTCLOUD_SECRETID || "", PHOTO_BDA_SECRET_KEY: env.TENCENTCLOUD_SECRETKEY || "",
    PHOTO_BDA_SESSION_TOKEN: env.TENCENTCLOUD_SESSIONTOKEN || "" });
}
function createHandler(dependencies = {}) {
  const env = roleEnv(dependencies.env || process.env), now = dependencies.now || Date.now;
  function configured(owner) {
    const c = configuration(env, owner);
    const persistent = persistenceConfigured(env) && !!env.PHOTO_BDA_SESSION_TOKEN;
    c.newOrdersEnabled = c.newOrdersEnabled && persistent;
    c.processingEnabled = c.processingEnabled && persistent;
    return c;
  }
  return async function handler(event = {}) {
    const deadline = now() + 45000;
    const send = createBudgetedRequest(dependencies.request || request, now);
    let maintenance = null;
    try {
      // A timer is accepted only via SCF's IAM-protected invocation, never from
      // the HTTP body. The public endpoint has a separate secret for sweeps.
      if (!event.httpMethod) {
        if (event.Type !== "Timer" || event.TriggerName !== "photoAiMaintenance") throw new Error("invalid-request");
        maintenance = maintenanceMode(event, { SOURCE: "wx_trigger" }, env);
        if (maintenance === "disabled") return { swept: false };
      }
      const query = event.queryString || event.queryStringParameters || {};
      const notify = event.path === "/notify" || event.rawPath === "/notify";
      if (notify && event.httpMethod === "GET") return { statusCode: 200, headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" }, body: handshake(env, query, now) };
      const body = event.httpMethod ? parse(event) : {};
      let notification = null;
      if (notify) notification = decodeNotification(env, query, body, now);
      if (!notification && body.action === "maintenance") maintenance = maintenanceMode(body, {}, env);
      let session = null;
      if (!notification && !maintenance) session = await exchangeLogin(env, send, body.loginCode);
      const config = configured(session && session.openid);
      if (body.action === "features" && !notification && !maintenance) return reply(200, {
        newOrdersEnabled: config.newOrdersEnabled, priceFen: 100, channel: "virtual", iosEnabled: config.iosEnabled,
        testOnly: config.testOnly, aiProvider: "bda", inputTransport: "inline" });
      if (!env.PHOTO_BDA_SESSION_TOKEN) throw new Error("scf-role-not-configured");
      const ledger = createPersistence(env, { store: dependencies.store, connect: dependencies.connect, now, deadline });
      const ai = (dependencies.createBdaProvider || createBdaProvider)(env, { request: send, now,
        saveResultReference: (o, ref) => ledger.change(o.id, current => {
          if (!current || current.attempt !== o.attempt || current.refund !== "none" || current.payment !== "paid" || !["processing", "unknown"].includes(current.task)) throw new Error("order-state-changed");
          return Object.assign(current, { resultReference: ref, updatedAt: now() });
        }) });
      const provider = Object.assign(ai, createVirtualPayment(env, { request: send, now, session }));
      const orders = createOrders({ store: ledger, provider, config, now });
      if (maintenance) return reply(200, Object.assign({ swept: true }, await orders.maintenance()));
      if (notification) {
        const result = await handlePush(notification, { SOURCE: "scf_verified_push" }, { store: ledger, orders, provider, productId: env.PHOTO_VIRTUAL_PRODUCT_ID });
        return reply(200, encrypt(env, JSON.stringify(result), now));
      }
      const owner = session.openid;
      if (body.action === "create") return reply(200, await orders.create(owner, body));
      if (body.action === "recent") return reply(200, await orders.recent(owner));
      if (!/^P[a-f0-9]{30}$/.test(body.orderId || "")) throw new Error("invalid-order");
      let value;
      if (body.action === "payment") value = await orders.payment(owner, body.orderId);
      else if (body.action === "start") value = await orders.start(owner, body.orderId, { imageBase64: body.imageBase64 });
      else if (["confirm", "status", "refund", "delivered", "report"].includes(body.action)) value = await orders[body.action](owner, body.orderId);
      else throw new Error("invalid-action");
      return reply(200, value);
    } catch (_) {
      // Never expose upstream URLs, login/session material, DB or SDK errors.
      return reply(503, { error: "PHOTO_SERVICE_UNAVAILABLE", message: "服务暂不可用，请稍后查询本次订单；请勿重复付款，免费处理不受影响" });
    }
  };
}
exports.main_handler = event => createHandler()(event);
exports.createHandler = createHandler;
