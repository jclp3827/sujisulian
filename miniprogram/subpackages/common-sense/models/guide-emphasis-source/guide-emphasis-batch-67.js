module.exports = {
  'stable-prices::ppi-purchase': { contentHash: 'bc1b2671', terms: ['出厂价格指数', '第一次出售', '购进价格指数'], reason: '突出PPI出厂环节与投入品购进价格的区别。' },
  'stable-prices::wpi-wholesale': { contentHash: '13da14ae', terms: ['商品批发价格', '观察环节不同'], reason: '突出WPI观察的批发环节及与居民消费价格指数不同。' },
  'stable-prices::nominal-real-income': { contentHash: '1ffca85e', terms: ['收入固定且没有随物价充分调整'], reason: '完整保留涨价侵蚀固定收入购买力的条件。' },
  'stable-prices::unexpected-inflation-debt': { contentHash: '61f2f6b7', terms: ['固定名义金额', '未充分指数化', '高于订约预期'], reason: '优先保留通胀改变债权债务实际价值的联合条件，不无条件宣称谁受益。' }
};
