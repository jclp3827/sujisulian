// Display-only: reviewed acceleration and buoyancy relationships.
module.exports = {
  'physics::overweight-condition': { contentHash: '4fe692e8', terms: ['向上加速度', '大于重力'], reason: '保留超重的加速度条件及测力结果。' },
  'physics::weightlessness-condition': { contentHash: '7b63112d', terms: ['向下加速度', '支持力小于重力'], reason: '同时呈现失重的条件和支持力变化。' },
  'physics::elevator-apparent-weight': { contentHash: '18d22c45', terms: ['向上加速或向下减速', '加速度为零'], reason: '突出超重的两种运动组合及匀速判断的共同依据。' },
  'physics::archimedes-buoyancy': { contentHash: '45bad36c', terms: ['F浮＝ρ液V排g'], reason: '突出浮力与液体密度、排液体积的定量关系。' },
  'physics::buoyancy-motion-states': { contentHash: '78c53979', terms: ['只考虑浮力和重力', '平衡状态'], reason: '保留合力判断适用范围及漂浮悬浮的平衡条件。' },
  'physics::submarine-buoyancy': { contentHash: '279446c7', terms: ['排水体积不变', '改变自身重力'], reason: '连接浮力不变的条件和潜水艇升降的实际调节量。' }
};
