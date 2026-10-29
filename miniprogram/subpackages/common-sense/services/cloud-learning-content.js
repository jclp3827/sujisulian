const NAME = 'learningBank';
const { createCardBatchAdapter } = require('../../../services/knowledge-platform/card-batch-adapter');
const { fingerprint } = require('./learning-content');

async function request(api, bank, data) {
  if (!api.cloud?.callFunction) throw new Error('当前微信暂不支持云端题库，请稍后重试');
  const response = await api.cloud.callFunction({ name: NAME, data: { bank, ...data } });
  const result = response?.result;
  if (!result?.ok) {
    const error = new Error(result?.message || '题库暂时无法加载，请重试');
    error.code = result?.code || 'CLOUD';
    throw error;
  }
  return result;
}

async function loadCommonContent(api, mode) {
  let knownVersions = [];
  try {
    const state = api.getStorageSync('common-sense-learning-v1');
    knownVersions = [...new Set(Object.values(state?.sessions || {})
      .map((session) => session?.version).filter((value) => typeof value === 'string'))].slice(0, 50);
  } catch (_) { /* The learning engine will report a local storage error. */ }
  const result = await request(api, 'common-question', { action: 'bootstrap', mode, knownVersions });
  const content = result.content;
  if (!content || content.version !== result.version || !Array.isArray(content.questions) ||
    !Array.isArray(content.mnemonics) || !Array.isArray(content.groups))
    throw new Error('题库目录无效，请重试');
  return content;
}

async function hydrateQuestionWindow(api, mode, version, scope, ids) {
  const result = await request(api, 'common-question', {
    action: 'hydrate', mode, version, scope: { scope }, ids,
  });
  if (result.items.length !== ids.length || ids.some((id, index) => result.items[index]?.id !== id))
    throw new Error('题目批次不完整，请重试');
  return result.items;
}

async function hydrateMnemonicWindow(api, version, scope, ids) {
  const result = await request(api, 'common-mnemonic', {
    action: 'hydrate', mode: 'mnemonic', version, scope: { scope }, ids,
  });
  if (result.items.length !== ids.length || ids.some((id, index) => result.items[index]?.id !== id))
    throw new Error('口诀批次不完整，请重试');
  return result.items;
}

function createCommonCardAdapter(api, content, reading) {
  const stubs = Object.fromEntries((reading ? content.mnemonics : content.questions).map((item) => [item.id, item]));
  return createCardBatchAdapter((ids, context) => request(api, reading ? 'common-mnemonic' : 'common-question', {
    action: 'hydrate', mode: reading ? 'mnemonic' : context.mode, version: context.version,
    scope: { scope: context.scope }, ids,
  }), { validateItem(item, context) {
    const stub = stubs[item?.id];
    if (!stub || !stub.runtimeSignature || item.scope !== stub.scope ||
      (context.scope !== 'all' && item.scope !== context.scope)) return false;
    if (reading) return fingerprint(item) === stub.runtimeSignature && item.revision === stub.revision &&
      Array.isArray(item.questionIds) && item.questionIds.length === stub.questionIds.length &&
      item.questionIds.every((id, index) => id === stub.questionIds[index]) &&
      Array.isArray(item.phrases) && item.phrases.length === stub.phrases.length &&
      item.phrases.every((phrase, index) => phrase.id === stub.phrases[index].id &&
        typeof phrase.phrase === 'string' && Array.isArray(phrase.checks));
    const { specification, ...questionBody } = item;
    return fingerprint(questionBody) === stub.runtimeSignature && item.group === stub.group && item.answer === stub.answer &&
      typeof item.prompt === 'string' && !!item.prompt && typeof item.explanation === 'string' &&
      Array.isArray(item.options) && item.options.length === stub.options.length &&
      item.options.every((option) => typeof option === 'string' && !!option);
  } });
}

module.exports = { loadCommonContent, hydrateQuestionWindow, hydrateMnemonicWindow, createCommonCardAdapter };
