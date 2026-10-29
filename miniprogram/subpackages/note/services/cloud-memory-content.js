const NAME = 'learningBank';
const BANK = 'note-memory';
const { createCardBatchAdapter } = require('../../../services/knowledge-platform/card-batch-adapter');

async function request(api, data) {
  if (!api.cloud?.callFunction) throw new Error('当前微信暂不支持云端卡片，请稍后重试');
  const response = await api.cloud.callFunction({ name: NAME, data: { bank: BANK, ...data } });
  const result = response?.result;
  if (!result?.ok) {
    const error = new Error(result?.message || '卡片暂时无法加载，请重试');
    error.code = result?.code || 'CLOUD';
    throw error;
  }
  return result;
}

async function loadCatalog(api, mode) {
  let offset = 0;
  let version = '';
  const cards = [];
  do {
    const result = await request(api, { action: 'catalog', mode, offset });
    if (version && result.version !== version) throw new Error('卡片目录已更新，请重试');
    version = result.version;
    cards.push(...result.items.map((item) => ({
      id: item.id, title: item.title, kind: item.kind, subjectId: item.subjectId,
      categoryId: item.categoryId, refs: item.sources, semanticVersion: item.version,
    })));
    if (result.nextOffset <= offset && result.nextOffset < result.total) throw new Error('卡片目录不完整，请重试');
    offset = result.nextOffset;
    if (offset >= result.total) break;
  } while (true);
  return { cards, version };
}

function createMemoryCardAdapter(api, catalog = []) {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  return createCardBatchAdapter((ids, context) => request(api, {
    action: 'hydrate', mode: context.mode, version: context.version, scope: context.scope, ids,
  }), { validateItem: (item, context) => {
    const expected = byId.get(item.id);
    const modeMatches = item.kind === context.mode || context.mode === 'exam' &&
      ['basic', 'method'].includes(item.kind);
    return Array.isArray(item.blocks) && modeMatches && (byId.size === 0 || expected &&
      expected.semanticVersion === item.semanticVersion && expected.kind === item.kind &&
      expected.subjectId === item.subjectId && expected.categoryId === item.categoryId);
  } });
}

async function loadCardWindow(api, mode, version, scope, ids, catalog) {
  return createMemoryCardAdapter(api, catalog).fetch(ids, { mode, version, scope });
}

module.exports = { loadCatalog, loadCardWindow, createMemoryCardAdapter };
