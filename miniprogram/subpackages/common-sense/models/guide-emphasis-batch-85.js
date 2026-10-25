module.exports = {
  'exchange-rate-effects::import-cost': { contentHash: 'ccd56ce9', terms: ['外币价格不变且未对冲', '本币支付成本通常上升'], reason: '保留进口成本判断的合同和对冲条件以及通常上升的方向。' },
  'exchange-rate-effects::export-price': { contentHash: 'a05b6adb', terms: ['本币价格不变', '外币售价下降', '固定外币价格'], reason: '区分本币报价和固定外币合同两种不同影响链。' },
  'exchange-rate-effects::appreciation-case': { contentHash: '596c1e81', terms: ['未对冲', '降低本币支付成本', '外币售价通常上升'], reason: '突出升值下两个局部价格方向，并保留进口未对冲条件。' },
  'exchange-rate-effects::quantity-response': { contentHash: '5f8750d1', terms: ['需求弹性、合同、替代选择和时滞'], reason: '完整突出数量反应所依赖的条件，不能由价格方向直接推定。' },
  'exchange-rate-effects::capital-flows': { contentHash: 'b08494eb', terms: ['未来汇率预期', '不能据此单独断言'], reason: '区分未来预期与已经发生的汇率变化，保留不能单独推断资本流向的边界。' }
};
