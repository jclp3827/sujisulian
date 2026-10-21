const cloud = require("wx-server-sdk");
const tcb = require("@cloudbase/node-sdk");
const { createOrders } = require("./orders");
const { createProvider, request } = require("./providers");
const { createBdaProvider } = require("./bda-provider");
const { createVirtualPayment } = require("./virtual-payment");
const { configuration } = require("./configuration");
const { handlePush } = require("./push");
const { maintenanceMode } = require("./maintenance-authority");
const { createBudgetedRequest } = require("./request-budget");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const { repository } = require("./repository");
exports.main = async (event = {}) => {
  const context = cloud.getWXContext();
  const trustedOwner = context.APPID === process.env.PHOTO_APP_ID ? context.OPENID : null;
  const config = configuration(process.env, trustedOwner);
  if (event.action === "features") return { newOrdersEnabled: config.newOrdersEnabled, priceFen: 100, channel: "virtual", iosEnabled: config.iosEnabled, testOnly: config.testOnly,
    aiProvider: config.aiProvider, inputTransport: config.aiProvider === "bda" ? "inline" : "private-upload" };
  const maintenance = maintenanceMode(event, context, process.env);
  if (maintenance === "disabled") return { swept: false, reason: "maintenance-disabled" };
  // Missing configuration must not initialize a provider or touch cloud storage.
  const aiConfigured = config.aiProvider === "bda"
    ? process.env.PHOTO_BDA_REGION && process.env.PHOTO_BDA_SECRET_ID && process.env.PHOTO_BDA_SECRET_KEY
    : config.aiProvider === "cos-legacy" && process.env.PHOTO_COS_SECRET_KEY;
  if (!config.appId || !aiConfigured) throw new Error("付费服务尚未配置；免费处理不受影响");
  const db = tcb.init({ env: process.env.TCB_ENV || process.env.SCF_NAMESPACE }).database(), store = repository(db);
  const send = createBudgetedRequest(request);
  const aiProvider = config.aiProvider === "bda" ? createBdaProvider(process.env, { request: send }) : createProvider(process.env, { request: send });
  const provider = Object.assign(aiProvider, createVirtualPayment(process.env, { request: send }));
  const orders = createOrders({ store, provider, config });
  // No public HTTP or client-supplied XML is accepted as an authenticated push.
  if (event.httpMethod) throw new Error("http-not-enabled");
  if (maintenance) {
    return Object.assign({ swept: true }, await orders.maintenance());
  }
  if (event.MsgType || event.Event) return handlePush(event, context, { store, orders, provider, productId: process.env.PHOTO_VIRTUAL_PRODUCT_ID });
  if (!context.OPENID || context.APPID !== config.appId) throw new Error("invalid-caller");
  if (event.action === "create") return orders.create(context.OPENID, event);
  if (!/^[P][a-f0-9]{30}$/.test(event.orderId || "")) throw new Error("invalid-order");
  const methods = ["payment", "confirm", "upload", "start", "status", "refund", "delivered", "report"];
  if (!methods.includes(event.action)) throw new Error("invalid-action");
  if (event.action === "payment") return orders.payment(context.OPENID, event.orderId, event.loginCode);
  if (event.action === "start") return orders.start(context.OPENID, event.orderId, { imageBase64: event.imageBase64 });
  return orders[event.action](context.OPENID, event.orderId);
};
exports.configuration = configuration;
exports.repository = repository;
