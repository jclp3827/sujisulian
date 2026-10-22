const catalog = require('../models/note-catalog');
const { resolveDisplayTab } = require('./note-presentation');
const SUBJECT_IDS = ['data-analysis', 'quantity', 'logic', 'verbal', 'graphic'];
function buildDirectory() {
  return SUBJECT_IDS.map((id) => ({ ...catalog.getNoteModule(id),
    pointCount: catalog.getNotePoints(id).length,
    categories: catalog.getNoteCategories(id).map((category) => ({ ...category,
      points: catalog.getNotePointsByCategory(id, category.id).map((point) => ({ id: point.id, title: point.title, summary: point.summary,
        preview: point.preview, tabId: point.tabs[0]?.id, type: point.type })) })) }));
}
function detailUrl(ref, returnToken) {
  const point = catalog.getNotePoint(ref.subjectId, ref.pointId);
  if (!point || !resolveDisplayTab(ref.subjectId, point, ref.tabId)) return null;
  const query = [`moduleId=${encodeURIComponent(ref.subjectId)}`, `pointId=${encodeURIComponent(ref.pointId)}`];
  if (ref.tabId) query.push(`tabId=${encodeURIComponent(ref.tabId)}`);
  if (returnToken) query.push(`practiceReturn=${encodeURIComponent(returnToken)}`);
  return `/subpackages/note/detail/index?${query.join('&')}`;
}
module.exports = { SUBJECT_IDS, buildDirectory, detailUrl };
