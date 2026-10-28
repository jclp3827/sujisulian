const catalog = require('../models/note-catalog');
const { createEngine, STORAGE_KEY } = require('./practice-session');
const { isDevelopment } = require('./learning-content');
const { createCardBatchAdapter } = require('../../../services/knowledge-platform/card-batch-adapter');
const exposureMap = require('../models/cloud-practice-exposures');

const BANK = 'note-practice';
const FUNCTION = 'learningBank';
const clone = (value) => JSON.parse(JSON.stringify(value));

async function call(api, data) {
  if (!api.cloud?.callFunction) throw new Error('当前微信暂不支持云端题库，请稍后重试');
  const response = await api.cloud.callFunction({ name: FUNCTION, data: { bank: BANK, ...data } });
  const result = response?.result;
  if (!result?.ok) {
    const error = new Error(result?.message || '题库暂时无法加载，请重试');
    error.code = result?.code || 'CLOUD';
    throw error;
  }
  return result;
}

function savedState(api) {
  try { return api.getStorageSync(STORAGE_KEY) || null; } catch (_) { return null; }
}

async function createCloudPractice(api, { kind, scope: requestedScope, sessionId, fresh = false } = {}) {
  const state = savedState(api);
  const preference = state?.preferences?.[kind] || {};
  const activeId = sessionId || (!fresh && state?.active?.[kind]);
  const active = !fresh && activeId && state?.sessions?.[activeId];
  const scope = clone(requestedScope || active?.scope || preference.scope || { subjectId: 'all', categoryId: 'all', pointId: '' });
  const count = [5, 10, 15].includes(preference.count) ? preference.count : 5;
  let first;
  if (active && active.kind === kind && JSON.stringify(active.scope) === JSON.stringify(scope)) {
    const ids = [...new Set(active.items.map((item) => item.resourceId))];
    first = await call(api, { action: 'resume', mode: kind, scope, ids });
    if (JSON.stringify(first.session?.ids) !== JSON.stringify(ids)) throw new Error('练习队列与云端不一致，请重试');
  } else {
    first = await call(api, { action: 'start', mode: kind, scope, count, attempts: state?.attempts || {} });
  }
  const ids = first.session?.ids || [];
  if (exposureMap.version !== first.version) throw new Error('题库来源关系已更新，请更新小程序后重试');
  if (!first.version || !Array.isArray(ids) || new Set(ids).size !== ids.length ||
    !Array.isArray(first.items) || first.items.length > 5 ||
    first.items.some((item, index) => item.id !== ids[index])) throw new Error('题库首批内容无效，请重试');
  const content = { schemaVersion: 1, version: first.version, resources: [], materials: [],
    cloudQueue: { kind, ids }, entryPlans: { [kind]: { resourceIds: ids } }, development: isDevelopment(api) };
  if (first.items.some((item) => !validPracticeItem(item, { mode: kind, scope }, content)))
    throw new Error('题库首批内容身份无效，请重试');
  return { content, prefetched: first.items, development: content.development, engine: createEngine(content, api) };
}

function validPracticeItem(item, context, content) {
  const scope = context.scope || {};
  return !!item && content.cloudQueue.ids.includes(item.id) && Array.isArray(item.exerciseKinds) &&
    item.exerciseKinds.includes(context.mode) && Array.isArray(item.refs) && item.refs.length > 0 &&
    typeof item.prompt === 'string' && !!item.prompt && Array.isArray(item.options) &&
    typeof item.explanation === 'string' &&
    (!scope.subjectId || scope.subjectId === 'all' || item.subjectId === scope.subjectId) &&
    (!scope.categoryId || scope.categoryId === 'all' || item.categoryId === scope.categoryId);
}
function createPracticeAdapter(api, content) {
  return createCardBatchAdapter((ids, context) => call(api, { action: 'hydrate', mode: context.mode,
    version: context.version, scope: context.scope, ids }), { validateItem: (item, context) =>
    validPracticeItem(item, context, content) });
}

function sourceLabel(ref) {
  const point = catalog.getNotePoint(ref.subjectId, ref.pointId);
  const tab = point?.tabs.find((item) => item.id === ref.tabId);
  return point && tab ? `${point.title} · ${tab.title}` : '笔记来源已变更';
}

module.exports = { createCloudPractice, createPracticeAdapter, sourceLabel };
