const { getTrainingItem } = require('../../../models/train-catalog');
const { buildTrainingConfig } = require('../../../models/train-config');
const STANDALONE = { 'assumption-tree': '/pages/training/assumption/index', 'estimation-split': '/pages/training/estimation/index', 'ratio-sense': '/pages/training/ratio-sense/index' };
function trainingUrl(training, count) {
  const item = getTrainingItem(training.sectionId, training.itemId);
  if (!item || item.available === false) return null;
  const config = buildTrainingConfig(item);
  if (count) config.questionCount = count;
  if (item.standalonePage) return STANDALONE[item.id] ? `${STANDALONE[item.id]}?count=${config.questionCount}` : null;
  return `/pages/training/session/index?sectionId=${encodeURIComponent(training.sectionId)}&itemId=${encodeURIComponent(training.itemId)}&config=${encodeURIComponent(JSON.stringify(config))}`;
}
module.exports = { trainingUrl };
