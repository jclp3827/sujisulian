const { call } = require('./files');
const { ENDPOINT } = require('./scf-segmentation');
// The public client may ask for features. The SCF remains the authority for
// public eligibility, durable quota, purchase and delivery.
const SCF_PURCHASE_CONFIGURED = true;
function isAcceptanceEnvironment(wxApi) {
  try { return ['develop', 'trial'].includes(wxApi.getAccountInfoSync().miniProgram.envVersion); }
  catch (_) { return false; }
}
let queue = Promise.resolve();
function serial(action) {
  const next = queue.then(action, action); queue = next.catch(() => {}); return next;
}
function createScfPurchase(wxApi) {
  const configured = SCF_PURCHASE_CONFIGURED || isAcceptanceEnvironment(wxApi);
  async function request(action, data) {
    if (!configured) throw new Error('AI 换背景暂未开放，可以继续免费处理');
    const login = await call(wxApi, 'login', {});
    if (!login.code) throw new Error('登录未完成，请稍后查询付款记录');
    const response = await call(wxApi, 'request', { url: ENDPOINT, method: 'POST', timeout: 60000,
      header: { 'Content-Type': 'application/json' }, data: Object.assign({}, data, { action, loginCode: login.code }) });
    if (response.statusCode !== 200 || !response.data || response.data.error) {
      const details = response.data || {};
      const error = new Error('暂时无法确认请求结果，请稍后查看状态');
      error.code = /^[A-Z_]{3,60}$/.test(details.code || '') ? details.code : 'REQUEST_UNKNOWN';
      error.phase = /^[a-z-]{3,40}$/.test(details.phase || '') ? details.phase : 'request';
      if (typeof details.bdaDispatched === 'boolean') error.bdaDispatched = details.bdaDispatched;
      if (Number.isSafeInteger(details.providerCode)) error.providerCode = details.providerCode;
      if (Number.isSafeInteger(details.httpStatus)) error.httpStatus = details.httpStatus;
      if (['access-token', 'query-order', 'deliver-goods', 'refund-order'].includes(details.operation)) error.operation = details.operation;
      throw error;
    }
    return response.data;
  }
  return { configured,
    request: (action, data) => serial(() => request(action, data)),
    // Hold the photo service login queue from signing through the native callback.
    // A concurrent availability probe must not refresh the signing session.
    payment: (action, data, prepared) => serial(async () => {
      const response = await request(action, data);
      if (response.payment === 'paid') return { state: response };
      await prepared(response); // Validate and persist the ticket BEFORE opening IAP.
      try {
        // Native IAP can disappear without a callback. Release the UI after a
        // bounded wait; the caller still queries the same order, never repays.
        return await new Promise(resolve => {
          let settled = false;
          const finish = value => { if (!settled) { settled = true; clearTimeout(timer); resolve(value); } };
          const timer = setTimeout(() => finish({ callback: 'unknown', code: 'NATIVE_CALLBACK_TIMEOUT' }), 90000);
          call(wxApi, 'requestVirtualPayment', response.parameters).then(
            () => finish({ callback: 'success' }),
            error => finish({ callback: 'fail', errCode: Number.isSafeInteger(error.errCode) ? error.errCode : undefined,
              cancelled: error.errCode === -2 || /cancel/i.test(error.errMsg || '') }));
        });
      }
      catch (error) { return { callback: 'fail', errCode: Number.isSafeInteger(error.errCode) ? error.errCode : undefined,
        cancelled: error.errCode === -2 || /cancel/i.test(error.errMsg || '') }; }
    }) };
}
module.exports = { createScfPurchase, SCF_PURCHASE_CONFIGURED, isAcceptanceEnvironment };
