const { call } = require("./files");
// Set only after an authorized deployment and domain verification. No internal
// SCF token or Tencent/WeChat secret belongs in this client configuration.
const ORDERS_ENDPOINT = "";
function createOrderService(wxApi) {
  return {
    configured: !!ORDERS_ENDPOINT,
    async request(action, data) {
      if (!/^https:\/\/[a-z0-9.-]+\.tencentscf\.com$/.test(ORDERS_ENDPOINT)) throw new Error("AI 换背景暂未开放，可以继续免费处理");
      const login = await call(wxApi, "login", {});
      if (!login.code) throw new Error("登录未完成，请稍后查询本次订单");
      // Every request uses a fresh, one-use WeChat code. Free processing never
      // calls this adapter. Do not automatically replay mutations on timeout.
      const r = await call(wxApi, "request", { url: ORDERS_ENDPOINT, method: "POST", timeout: 60000,
        header: { "Content-Type": "application/json" }, data: Object.assign({}, data, { action, loginCode: login.code }) });
      if (r.statusCode !== 200 || !r.data || r.data.error) throw new Error("服务暂不可用，请稍后查询本次订单；请勿重复付款");
      return r.data;
    }
  };
}
module.exports = { createOrderService, ORDERS_ENDPOINT };
