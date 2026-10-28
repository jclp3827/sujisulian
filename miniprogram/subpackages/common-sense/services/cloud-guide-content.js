const FUNCTION = 'learningBank';
const BANK = 'common-guide';
const MODE = 'guide';
const { createCardBatchAdapter } = require('../../../services/knowledge-platform/card-batch-adapter');

async function request(api, data) {
  if (!api.cloud?.callFunction) throw new Error('当前微信暂不支持云端导读，请稍后重试');
  const response = await api.cloud.callFunction({ name: FUNCTION, data: { bank: BANK, mode: MODE, ...data } });
  const result = response?.result;
  if (!result?.ok) {
    const error = new Error(result?.message || '知识导读暂时无法加载，请重试');
    error.code = result?.code || 'CLOUD';
    throw error;
  }
  return result;
}

async function loadPublicGuide(api) {
  let prefetchIds = [];
  let prefetchGroupId = '';
  try {
    const saved = api.getStorageSync('common-sense-guide-v1');
    const session = saved?.sessions?.[saved?.summary?.key];
    if (session?.ids && Number.isInteger(session.index))
      prefetchIds = session.ids.slice(session.index, session.index + 5);
    prefetchGroupId = saved?.preferences?.groupId || '';
  } catch (_) { /* The guide engine reports storage errors after bootstrap. */ }
  const result = await request(api, { action: 'bootstrap', prefetchIds, prefetchGroupId });
  const source = result.content;
  if (!source || source.version !== result.version || !Array.isArray(source.groups) ||
    !Array.isArray(source.cardSignatures))
    throw new Error('知识导读目录无效，请重试');
  const ids = source.groups.flatMap((group) => group.cardIds);
  if (ids.length !== source.cardSignatures.length || new Set(ids).size !== ids.length)
    throw new Error('知识导读目录与卡片版本不一致，请重试');
  const cards = ids.map((id, index) => ({ id, signature: source.cardSignatures[index] }));
  if (cards.some((card) => !card.signature)) throw new Error('知识导读卡片版本无效，请重试');
  const groupById = Object.fromEntries(source.groups.map((item) => [item.id, item]));
  const cardById = Object.fromEntries(cards.map((item) => [item.id, item]));
  const prefetched = result.prefetched || [];
  if (!Array.isArray(prefetched) || prefetched.length > 5 ||
    new Set(prefetched.map((item) => item?.id)).size !== prefetched.length ||
    prefetched.some((item) => !validGuideCard(item, { cardById, groupById }, 'all')))
    throw new Error('知识导读预取卡片身份无效，请重试');
  prefetched.forEach((item) => { cardById[item.id] = item; });
  return { ...source, cards, groupById, cardById, prefetched };
}

function validGuideCard(item, catalog, scope) {
  if (!item || typeof item.content !== 'string' || !item.content ||
    typeof item.signature !== 'string' || !item.signature ||
    typeof item.groupId !== 'string' || typeof item.scope !== 'string') return false;
  if (scope !== 'all' && item.scope !== scope) return false;
  if (!catalog) return true;
  const group = catalog.groupById[item.groupId];
  return !!group && group.scope === item.scope && group.cardIds.includes(item.id) &&
    catalog.cardById[item.id]?.signature === item.signature;
}

function createGuideCardAdapter(api, catalog) {
  return createCardBatchAdapter((ids, context) => request(api, {
    action: 'hydrate', version: context.version, scope: { scope: context.scope }, ids,
  }), { validateItem: (item, context) => validGuideCard(item, catalog, context.scope || 'all') });
}

async function loadGuideCards(api, version, ids) {
  return createGuideCardAdapter(api).fetch(ids, { version, mode: MODE, scope: 'all' });
}

module.exports = { loadPublicGuide, loadGuideCards, createGuideCardAdapter, validGuideCard };
