const ENDPOINT = 'https://1317757209-fgwojo6bub.ap-guangzhou.tencentscf.com';

function call(method, options) {
  return new Promise((resolve, reject) => wx[method]({ ...options, success: resolve, fail: reject }));
}
function time(value) {
  if (!Number.isSafeInteger(value) || value < 1) return '';
  const date = new Date(value), pad = number => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function display(order) {
  if (!order || order.product !== 'AI 换背景 · 3 次' || order.amountFen !== 100 ||
      !['pending', 'paid', 'closed', 'refunded'].includes(order.payment)) throw Error('INVALID_ORDER');
  const status = order.payment === 'refunded' ? '已退款' : order.payment === 'closed' ? '已关闭' :
    order.payment === 'paid' ? order.deliveredAt ? '已发货' : '支付成功' : '待支付';
  return { product: order.product, amount: '¥1.00', status, createdAt: time(order.createdAt),
    paidAt: time(order.paidAt), deliveredAt: time(order.deliveredAt) };
}

Page({
  data: { loading: true, error: '', orders: [] },
  async onShow() {
    this.setData({ loading: true, error: '' });
    try {
      const login = await call('login', {});
      if (!login.code) throw Error('NO_LOGIN');
      const response = await call('request', { url: ENDPOINT, method: 'POST', timeout: 20000,
        header: { 'Content-Type': 'application/json' }, data: { action: 'preview-orders', loginCode: login.code } });
      if (response.statusCode !== 200 || !response.data || response.data.flow !== 'preview-orders' ||
          !Array.isArray(response.data.orders)) throw Error('ORDER_UNAVAILABLE');
      this.setData({ loading: false, orders: response.data.orders.map(display) });
    } catch (_) {
      this.setData({ loading: false, orders: [], error: '订单记录暂时无法加载，请稍后重新进入。' });
    }
  }
});
