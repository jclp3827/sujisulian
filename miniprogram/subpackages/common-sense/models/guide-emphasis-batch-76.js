module.exports = {
  'monetary-policy::rediscount': { contentHash: 'd3765f9e', terms: ['再向中央银行办理贴现', '央行融资的价格'], reason: '连接再贴现对象和再贴现率的资金价格含义。' },
  'monetary-policy::open-market': { contentHash: 'b440e1d4', terms: ['中央银行', '债券买卖、回购', '政府发行债券筹资'], reason: '区分央行市场操作与政府发债融资，否定关系保留原句。' },
  'monetary-policy::spot-buy-sell': { contentHash: 'd5a8acd4', terms: ['投放基础货币', '回笼基础货币', '其他操作抵消'], reason: '并列区分现券买卖方向及整体效果可被其他操作抵消。' },
  'monetary-policy::repo-maturity': { contentHash: 'bcd1f5c', terms: ['操作与到期两个时点', '到期则收回', '到期则投放'], reason: '突出操作和到期需分别判断，以及两类回购到期时的反向机制。' },
  'monetary-policy::different-rates': { contentHash: '2a1b2a4d', terms: ['形成机制不同', '不能假定政策利率一变'], reason: '突出利率形成机制不同和不能由单一政策利率变动推断所有利率变化的边界。' },
  'monetary-policy::dated-rate-framework': { contentHash: '194b004b', terms: ['2026年10月', '仍为7天', '研究择机'], reason: '保留信息时点、当时期限与改革意向，不能读成已完成切换。' }
};
