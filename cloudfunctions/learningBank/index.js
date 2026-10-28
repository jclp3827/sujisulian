const crypto = require('crypto');
const path = require('path');
const manifest = require('./data/manifest.json');

const MAX_ITEMS = 5;
const MAX_SESSION_ITEMS = 15;
const MAX_CATALOG_ITEMS = 100;
const MAX_RESPONSE_BYTES = 64 * 1024;
const randomSeed = () => crypto.randomBytes(12).toString('hex');
const hash = (value) => crypto.createHash('sha256').update(String(value)).digest();
const fail = (code, message) => ({ ok: false, code, message });

function orderIds(ids, seed) {
  return ids.slice().sort((a, b) => Buffer.compare(hash(`${seed}:${a}`), hash(`${seed}:${b}`)));
}

function eligible(bankName, bank, mode, scope) {
  const allowed = new Set(bank.modes[mode] || []);
  return bank.index.filter((item) => allowed.has(item.id) && (
    bankName === 'common-question' || bankName === 'common-guide'
      ? !scope.scope || scope.scope === 'all' || item.scope === scope.scope
      : scope.pointId && (scope.scopeMode === 'exact-source-point' || !scope.scopeMode)
        ? item.sources.some((ref) => ref.pointId === scope.pointId
          && (!scope.sourceSubjectId && !scope.subjectId || ref.subjectId === (scope.sourceSubjectId || scope.subjectId))
          && (!scope.sourceTabId || ref.tabId === scope.sourceTabId))
        : (!scope.subjectId || scope.subjectId === 'all' || item.subjectId === scope.subjectId)
          && (!scope.categoryId || scope.categoryId === 'all' || item.categoryId === scope.categoryId)
          && (!scope.pointId || item.sources.some((ref) => ref.pointId === scope.pointId
            && (!scope.sourceSubjectId && !scope.subjectId || ref.subjectId === (scope.sourceSubjectId || scope.subjectId))
            && (!scope.sourceTabId || ref.tabId === scope.sourceTabId)))
  ));
}

function loadItems(bankName, bank, ids) {
  const byId = new Map(bank.index.map((item) => [item.id, item]));
  const files = new Map();
  return ids.map((id) => {
    const record = byId.get(id);
    if (!record) throw new Error('Unknown item');
    if (!files.has(record.file)) files.set(record.file,
      require(path.join(__dirname, 'data', bankName, `${record.file}.json`)));
    const item = files.get(record.file).find((entry) => entry.id === id);
    if (!item) throw new Error('Bank index mismatch');
    return item;
  });
}

function page(bankName, bank, ids, offset) {
  const items = [];
  let size = 0;
  for (const item of loadItems(bankName, bank, ids.slice(offset, offset + MAX_ITEMS))) {
    const bytes = Buffer.byteLength(JSON.stringify(item));
    if (items.length && size + bytes > MAX_RESPONSE_BYTES) break;
    items.push(item);
    size += bytes;
  }
  return { items, nextOffset: offset + items.length, payloadBytes: size };
}

async function main(event = {}) {
  const { action, bank: bankName, mode, scope = {} } = event;
  const bank = manifest.banks[bankName];
  if (!bank || !bank.modes[mode]) return fail('BAD_ROUTE', '学习内容入口不存在');
  if (!scope || typeof scope !== 'object' || Array.isArray(scope)) return fail('BAD_SCOPE', '学习范围无效');
  if (action === 'bootstrap' && bankName === 'common-guide' && mode === 'guide') {
    const content = require('./data/common-guide/bootstrap.json');
    const group = content.groups.find((item) => item.id === event.prefetchGroupId) || content.groups[0];
    const requested = event.prefetchIds;
    const ids = Array.isArray(requested) && requested.length && requested.length <= MAX_ITEMS &&
      new Set(requested).size === requested.length && requested.every((id) =>
        typeof id === 'string' && bank.index.some((item) => item.id === id))
      ? requested : (group?.cardIds || []).slice(0, MAX_ITEMS);
    return { ok: true, bank: bankName, mode, version: bank.version,
      content, prefetched: page(bankName, bank, ids, 0).items };
  }
  if (action === 'bootstrap' && bankName === 'common-question') {
    const versions = Array.isArray(event.knownVersions) ? event.knownVersions
      .filter((value) => typeof value === 'string' && value.length <= 128).slice(0, 50) : [];
    const known = new Set(versions);
    const migrations = require('./data/common-question/migrations.json')
      .filter((item) => known.has(item.fromVersion));
    return { ok: true, bank: bankName, mode, version: bank.version,
      content: { ...require('./data/common-question/bootstrap.json'), sessionMigrations: migrations } };
  }
  const selected = eligible(bankName, bank, mode, scope);
  if (action === 'catalog') {
    const offset = Number(event.offset || 0);
    if (!Number.isInteger(offset) || offset < 0 || offset > selected.length) return fail('BAD_OFFSET', '目录位置无效');
    const items = selected.slice(offset, offset + MAX_CATALOG_ITEMS).map(({ file, bytes, ...item }) => item);
    return { ok: true, bank: bankName, mode, version: bank.version, total: selected.length,
      items, nextOffset: offset + items.length };
  }
  if (action === 'start') {
    const count = Number(event.count || 5);
    if (![5, 10, 15].includes(count)) return fail('BAD_COUNT', '每组可选 5、10 或 15 条');
    const seed = randomSeed();
    const selectedIds = selected.map((item) => item.id);
    const random = bankName === 'note-practice' || bankName === 'common-question' && mode === 'qa';
    let ordered = random ? orderIds(selectedIds, seed) : selectedIds;
    if (bankName === 'note-practice') {
      const raw = event.attempts;
      const attempts = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
      const byId = new Map(selected.map((item) => [item.id, item]));
      ordered.sort((left, right) => {
        const a = attempts[left] || {}, b = attempts[right] || {};
        const groupsA = Number.isSafeInteger(a.presentedGroups) && a.presentedGroups >= 0 ? a.presentedGroups : 0;
        const groupsB = Number.isSafeInteger(b.presentedGroups) && b.presentedGroups >= 0 ? b.presentedGroups : 0;
        const timeA = Number.isFinite(a.lastAt) && a.lastAt >= 0 ? a.lastAt : 0;
        const timeB = Number.isFinite(b.lastAt) && b.lastAt >= 0 ? b.lastAt : 0;
        return groupsA - groupsB || timeA - timeB;
      });
      const families = new Set();
      ordered = ordered.filter((id) => {
        const family = byId.get(id).familyId;
        if (families.has(family)) return false;
        families.add(family); return true;
      });
    }
    const ids = ordered.slice(0, count);
    return { ok: true, bank: bankName, mode, version: bank.version, total: selected.length,
      session: { ids, seed }, ...page(bankName, bank, ids, 0) };
  }
  if (action === 'batch') {
    const { session, offset } = event;
    if (!session || !Array.isArray(session.ids) || session.ids.length > MAX_SESSION_ITEMS ||
      !Number.isInteger(offset) || offset < 0 || offset > session.ids.length ||
      new Set(session.ids).size !== session.ids.length ||
      session.ids.some((id) => typeof id !== 'string' || !selected.some((item) => item.id === id)))
      return fail('BAD_SESSION', '学习批次已失效');
    if (event.version !== bank.version) return fail('VERSION_CHANGED', '学习内容已更新，请重新开始');
    return { ok: true, bank: bankName, mode, version: bank.version, ...page(bankName, bank, session.ids, offset) };
  }
  if (action === 'resume' && bankName === 'note-practice') {
    const ids = event.ids;
    if (!Array.isArray(ids) || !ids.length || ids.length > MAX_SESSION_ITEMS ||
      new Set(ids).size !== ids.length || ids.some((id) => typeof id !== 'string' ||
        !selected.some((item) => item.id === id)))
      return fail('BAD_ITEMS', '待恢复内容不在当前范围');
    return { ok: true, bank: bankName, mode, version: bank.version,
      session: { ids }, ...page(bankName, bank, ids, 0) };
  }
  if (action === 'hydrate') {
    const ids = event.ids;
    if (event.version !== bank.version) return fail('VERSION_CHANGED', '学习内容已更新，请重新开始');
    if (!Array.isArray(ids) || !ids.length || ids.length > MAX_ITEMS ||
      new Set(ids).size !== ids.length || ids.some((id) => typeof id !== 'string' || !selected.some((item) => item.id === id)))
      return fail('BAD_ITEMS', '待恢复内容不在当前范围');
    return { ok: true, bank: bankName, mode, version: bank.version, ...page(bankName, bank, ids, 0) };
  }
  return fail('BAD_ACTION', '请求类型不存在');
}

exports.main = main;
