const pack = require('../models/learning-pack-runtime');
const catalog = require('../models/note-catalog');
const { availableContent, isDevelopment, sourceValid } = require('./learning-content');
const { createEngine } = require('./practice-session');
const publicLearningContent = require('../../../services/public-learning-content');
function createPractice(api) {
  const development = isDevelopment(api);
  const content = availableContent(catalog, pack, development,
    { publicReviewed: publicLearningContent.reviewedContentVisible });
  return { content, development, engine: createEngine(content, api) };
}
function sourceLabel(ref) {
  const point = catalog.getNotePoint(ref.subjectId, ref.pointId);
  const tab = point?.tabs.find((t) => t.id === ref.tabId);
  return point && tab ? `${point.title} · ${tab.title}` : '笔记来源已变更';
}
function recordExampleExposure(api, subjectId, pointId, blockFingerprint) {
  const runtime = createPractice(api);
  const groups = pack.questions.filter((q) => q.origin && q.refs.some((r) => r.subjectId === subjectId && r.pointId === pointId && sourceValid(catalog,r))
    && q.originalExampleFingerprint === blockFingerprint).map((q) => q.exposureGroupId);
  if (groups.length) runtime.engine.recordExposures(groups);
}
module.exports = { createPractice, sourceLabel, recordExampleExposure };
