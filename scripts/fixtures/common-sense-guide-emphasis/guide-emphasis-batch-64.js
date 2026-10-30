module.exports = {
  'economic-growth::avoid-double-counting': { contentHash: '28e5bf05', terms: ['包含在最终产品价值中', '重复计算'], reason: '连接中间产品价值已包含与再次计入会重复的因果。' },
  'economic-growth::period-flow': { contentHash: 'f3d3bd84', terms: ['流量而不是存量', '一定时期内'], reason: '突出GDP为流量及流量所对应的期间维度。' },
  'economic-growth::production-boundary': { contentHash: '235b5c33', terms: ['无酬家务服务通常不纳入', '核算生产边界'], reason: '保留常见家务排除及应按核算边界判断，不能笼统排除非市场生产。' },
  'economic-growth::resident-units': { contentHash: 'dc2d8d4c', terms: ['经济利益中心', '不能简单把本国国民与常住单位'], reason: '突出常住单位依据及不能按国籍直接等同的边界。' },
  'economic-growth::gni-gnp-income': { contentHash: 'b8cd3834', terms: ['GDP关注生产，GNI关注收入'], reason: '完整对照两个核算视角，收入调整公式保留原文。' }
};
