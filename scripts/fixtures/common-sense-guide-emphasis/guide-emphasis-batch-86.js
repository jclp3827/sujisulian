module.exports = {
  'exchange-rate-effects::trade-response-lag': { contentHash: 'b65bd0a9', terms: ['不同时间调整', '不能忽略既有合同和需求反应'], reason: '保留传导时滞以及合同需求约束，不能直接推定差额立即改善。' },
  'exchange-rate-effects::offsetting-costs': { contentHash: 'f0150c94', terms: ['进口投入', '合同、成本和需求条件'], reason: '突出进口投入成本可能抵消售价优势，保留分析条件。' },
  'exchange-rate-effects::conditional-chain': { contentHash: '88c0284a', terms: ['本币、外币和报价方向', '货币计价、是否对冲'], reason: '突出影响分析必须先确定的报价与合同条件。' },
  'exchange-rate-effects::exchange-rate-trade-direction': { contentHash: '4879ed02', terms: ['进口以外币计价', '其他条件不变', '出口以本币计价'], reason: '保留进出口两条价格链各自的计价条件及其他条件不变假设。' }
};
