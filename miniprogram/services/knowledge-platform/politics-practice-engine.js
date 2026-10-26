const { shuffledOrder, validOrder } = require('../../utils/option-order');

const STORAGE_KEY = 'politics-practice-v1';
const DAY = 86400000;
const VALID_SCOPES = ['all', 'thought', 'principles'];
const VALID_COUNTS = [5, 10, 15];
const VALID_TYPES = ['mixed', 'recall', 'application'];
const RECALL_OUTCOMES = ['remembered', 'fuzzy', 'missed'];

function beijingDay(time) { return new Date(time + 8 * 3600000).toISOString().slice(0, 10); }
function startOfBeijingDay(time) { return Date.parse(`${beijingDay(time)}T00:00:00+08:00`); }
function emptyState() { return { schema: 1, records: {}, sessions: {}, preferences: {}, groupHistory: {}, exposures: {}, archives: {} }; }
function validObject(value) { return value && typeof value === 'object' && !Array.isArray(value); }

function normalizeBank(rawBank) {
  if (Array.isArray(rawBank.items)) return rawBank;
  const groups = (rawBank.groups || []).map((group, order) => ({
    ...group, id: group.id || group.groupId, kind: 'application',
    itemIds: [...(group.itemIds || group.questionIds || [])], order: group.order || order + 1,
  }));
  const groupById = Object.fromEntries(groups.map(group => [group.id, group]));
  const items = (rawBank.questions || []).map(question => ({
    ...question, id: question.id || question.questionId, kind: 'application', assessment: 'choice',
    subtype: question.subtype || question.questionType, scope: question.scope || groupById[question.groupId]?.scope || 'all',
  }));
  return { ...rawBank, items, applicationItems: items, recallItems: [], groups,
    applicationGroups: groups, recallGroups: [] };
}

function createPoliticsPracticeEngine(rawBank, storage, clock = () => Date.now(), random = Math.random) {
  const bank = normalizeBank(rawBank);
  const itemById = Object.fromEntries(bank.items.map(item => [item.id, item]));
  const groupById = Object.fromEntries(bank.groups.map(group => [group.id, group]));
  const applicationGroups = bank.applicationGroups || bank.groups.filter(group => group.kind !== 'recall');
  const recallGroups = bank.recallGroups || bank.groups.filter(group => group.kind === 'recall');
  const legacyApplicationOnly = !bank.recallItems.length;
  const fields = ['records', 'sessions', 'preferences', 'groupHistory', 'exposures', 'archives'];
  const copy = value => JSON.parse(JSON.stringify(value));
  const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const state = emptyState();
  let baseline = emptyState();
  let persistenceError = '';
  let readFailed = false;
  const invalidSessionKeys = new Set();

  function validRecord(item, record) {
    if (!item || !validObject(record) || record.contentVersion !== item.contentVersion ||
      !Number.isFinite(record.at) || !Number.isFinite(record.due)) return false;
    if (record.kind && record.kind !== item.kind) return false;
    return item.kind === 'recall' ? RECALL_OUTCOMES.includes(record.outcome)
      : ['correct', 'wrong', 'revealed'].includes(record.outcome);
  }

  function archive(target, kind, id, value) {
    if (!validObject(value)) return;
    const key = kind + ':' + id + ':' + (value.contentVersion || value.bankVersion || '') + ':' + (value.at || value.updatedAt || 0);
    target.archives[key] = {kind,id,value:copy(value),reason:'content-version-changed'};
  }
  function readState() {
    const saved = storage.getStorageSync(STORAGE_KEY);
    const next = emptyState();
    if (saved && saved.schema !== 1) throw new Error('Unsupported practice state');
    if (saved) fields.forEach(field => { if (validObject(saved[field])) next[field] = copy(saved[field]); });
    Object.keys(next.records).forEach(id => { if (!validRecord(itemById[id], next.records[id])) { archive(next,'record',id,next.records[id]); delete next.records[id]; } });
    Object.keys(next.exposures).forEach(id => {
      const exposure = next.exposures[id];
      if (!itemById[id] || !validObject(exposure) || exposure.contentVersion !== itemById[id].contentVersion ||
        !Number.isFinite(exposure.at)) { archive(next,'exposure',id,exposure); delete next.exposures[id]; }
    });
    Object.keys(next.groupHistory).forEach(id => {
      const record = next.groupHistory[id];
      if (!groupById[id] || !validObject(record) || !Number.isFinite(record.at) ||
        record.contentVersion !== groupById[id].contentVersion) delete next.groupHistory[id];
    });
    return next;
  }

  function replaceState(next) {
    fields.forEach(field => { state[field] = next[field]; });
    invalidSessionKeys.clear();
    Object.entries(state.sessions).forEach(([key, session]) => { if (!validSession(session)) invalidSessionKeys.add(key); });
  }
  function pendingChanges() { return fields.some(field => !same(state[field], baseline[field])); }
  function refresh(discardUnreadState = false) {
    if (pendingChanges() && !(discardUnreadState && readFailed)) return false;
    try {
      replaceState(readState()); baseline = copy(state); readFailed = false; persistenceError = ''; return true;
    } catch (_) {
      readFailed = true; persistenceError = '练习记录读取失败，请点击重试；已有记录不会被覆盖。'; return false;
    }
  }
  refresh();

  function save() {
    if (readFailed) return false;
    try {
      const latest = readState();
      for (const field of fields) {
        const merged = { ...latest[field] };
        const keys = new Set([...Object.keys(baseline[field]), ...Object.keys(state[field])]);
        for (const key of keys) {
          const before = baseline[field][key], local = state[field][key], live = latest[field][key];
          if (same(local, before)) {
            if (own(state[field], key) && same(local, live)) merged[key] = local;
            continue;
          }
          if (field === 'sessions' && !same(live, before) && !same(live, local)) {
            persistenceError = '本组已在其他页面更新，请返回后重新进入；已保存记录未被覆盖。'; return false;
          }
          if (own(state[field], key)) merged[key] = local;
          else delete merged[key];
        }
        latest[field] = merged;
      }
      storage.setStorageSync(STORAGE_KEY, latest); replaceState(latest); baseline = copy(state); persistenceError = ''; return true;
    } catch (_) {
      persistenceError = '本次练习记录暂未保存，退出后可能无法恢复。'; return false;
    }
  }

  function normalizeScope(scope) { return VALID_SCOPES.includes(scope) ? scope : 'all'; }
  function normalizeCount(count) { return VALID_COUNTS.includes(Number(count)) ? Number(count) : 5; }
  function normalizeType(type) { return VALID_TYPES.includes(type) ? type : 'mixed'; }
  function sessionKey(mode, scope, count, type = 'mixed') {
    if (mode === 'daily') return 'daily:all';
    return type === 'mixed' ? `qa:${scope}:${count}` : `qa:${scope}:${count}:${type}`;
  }
  function itemEligible(item, scope, type = 'mixed') {
    return (scope === 'all' || item.scope === scope) && (type === 'mixed' || item.kind === type);
  }
  function validApplicationAnswer(item, answer) {
    return answer && ['choice', 'reveal', 'skip'].includes(answer.type) &&
      (answer.type !== 'choice' || Number.isInteger(answer.choice) && answer.choice >= 0 && answer.choice < item.options.length);
  }
  function validRecallAnswer(answer) {
    if (!answer) return false;
    if (answer.type === 'skip') return !answer.kind || answer.kind === 'recall';
    return answer.type === 'recall' && answer.kind === 'recall' && answer.revealed === true &&
      (answer.outcome === null || RECALL_OUTCOMES.includes(answer.outcome));
  }
  function validSession(session) {
    if (!session || !Array.isArray(session.ids) || !session.ids.length || new Set(session.ids).size !== session.ids.length ||
      !Number.isInteger(session.index) || session.index < 0 || session.index > session.ids.length ||
      !validObject(session.answers) || !validObject(session.questionVersions)) return false;
    if (!session.ids.every(id => itemById[id] && session.questionVersions[id] === itemById[id].contentVersion)) return false;
    if (!Object.entries(session.answers).every(([id, answer]) => session.ids.includes(id) &&
      (itemById[id].kind === 'recall' ? validRecallAnswer(answer) : validApplicationAnswer(itemById[id], answer)))) return false;
    if (session.optionOrders && (!validObject(session.optionOrders) || Object.keys(session.optionOrders).some(id =>
      !session.ids.includes(id) || itemById[id]?.kind !== 'application' ||
      !validOrder(session.optionOrders[id], itemById[id].options.map((_, index) => index))))) return false;
    if (session.mode === 'daily') return session.scope === 'all' && session.ids.length <= bank.sessionPolicy.daily.maxQuestions;
    const type = normalizeType(session.typeFilter);
    return session.mode === 'qa' && VALID_SCOPES.includes(session.scope) && VALID_COUNTS.includes(session.count) &&
      session.ids.length <= session.count && session.ids.every(id => itemEligible(itemById[id], session.scope, type));
  }
  function ensureOptionOrders(session) {
    if (!validObject(session.optionOrders)) session.optionOrders = {};
    session.ids.forEach((id, position) => {
      const item = itemById[id];
      if (item.kind !== 'application' || session.optionOrders[id]) return;
      const indices = item.options.map((_, index) => index);
      session.optionOrders[id] = position <= session.index || session.answers[id] ? indices : shuffledOrder(indices, random);
    });
  }

  function seenItemIds() {
    const seen = new Set([...Object.keys(state.records), ...Object.keys(state.exposures)]);
    Object.values(state.sessions).filter(validSession).forEach(session => {
      if (!legacyApplicationOnly) session.ids.forEach(id => seen.add(id));
      else Object.entries(session.answers).forEach(([id, answer]) => { if (answer.type !== 'skip') seen.add(id); });
    });
    return seen;
  }
  const groupScope = groupId => groupById[groupId]?.scope || '';
  function alternatingGroup(candidates, previousGroupId) {
    if (!candidates.length) return null;
    const previousScope = groupScope(previousGroupId);
    if (previousScope) {
      const other = previousScope === 'thought' ? 'principles' : 'thought';
      const alternate = candidates.find(group => group.scope === other);
      if (alternate) return alternate;
    }
    return candidates[0];
  }
  function nextApplicationGroup(previousGroupId, seen) {
    const candidates = applicationGroups.filter(group => {
      if (state.groupHistory[group.id] || group.itemIds.length !== 3) return false;
      const unseenCount = group.itemIds.filter(id => !seen.has(id)).length;
      return legacyApplicationOnly ? unseenCount >= bank.sessionPolicy.daily.newGroupQuestionCount[0] : unseenCount === 3;
    });
    return alternatingGroup(candidates, previousGroupId);
  }
  function orderedNewRecall(items, limit) {
    const standard = items.filter(item => item.subtype !== 'error-correction');
    const corrections = items.filter(item => item.subtype === 'error-correction');
    const selected = standard.slice(0, limit);
    if (selected.length < limit && corrections.length) selected.push(corrections.shift());
    while (selected.length < limit && corrections.length) selected.push(corrections.shift());
    return selected;
  }
  function relatedRecalls(group, limit, seen, selected) {
    if (limit <= 0) return [];
    const objectives = new Set(group.objectiveIds || []);
    return orderedNewRecall(bank.recallItems.filter(item => objectives.has(item.primaryObjectiveId) &&
      !seen.has(item.id) && !selected.includes(item.id)), limit);
  }
  const recallBatchSize = count => count === 4 ? 2 : Math.min(3, count);
  function nextRecallGroup(previousGroupId, seen) {
    const remaining = recallGroups.map(group => ({ group, count: group.itemIds.filter(id => !seen.has(id)).length }));
    const regular = remaining.filter(entry => entry.count >= 2).map(entry => entry.group);
    // QA can leave one unseen card in a topic. Finish those tails only after all
    // normal 2-3 card topic batches, without padding them with early repeats.
    const tails = remaining.filter(entry => entry.count === 1).map(entry => entry.group);
    return alternatingGroup(regular.length ? regular : tails, previousGroupId);
  }
  function dueItems(policy) {
    const due = bank.items.filter(item => state.records[item.id] && state.records[item.id].due <= clock())
      .sort((left, right) => state.records[left.id].at - state.records[right.id].at || left.order - right.order);
    const selected = [];
    due.forEach(item => {
      if (selected.length >= policy.maxDueReviews) return;
      const correctionCount = selected.filter(value => value.subtype === 'error-correction').length;
      const alternative = due.some(candidate => !selected.includes(candidate) && candidate.subtype !== 'error-correction');
      if (item.subtype === 'error-correction' && correctionCount >= 1 && alternative) return;
      selected.push(item);
    });
    return selected;
  }
  function dailySelection(previous) {
    const policy = bank.sessionPolicy.daily;
    const selected = dueItems(policy).map(item => item.id);
    const reasons = Object.fromEntries(selected.map(id => [id, '到期回顾']));
    const seen = seenItemIds();
    const applicationGroup = nextApplicationGroup(previous?.groupId, seen);
    if (applicationGroup) {
      applicationGroup.itemIds.filter(id => !legacyApplicationOnly || !seen.has(id))
        .forEach(id => { selected.push(id); reasons[id] = applicationGroup.title; });
      const capacity = Math.min(policy.relatedRecallMax || 2, policy.maxQuestions - selected.length);
      relatedRecalls(applicationGroup, capacity, seen, selected).forEach(item => {
        selected.push(item.id); reasons[item.id] = '关联回忆';
      });
      return { ids: selected, reasons, groupId: applicationGroup.id };
    }
    const recallGroup = nextRecallGroup(previous?.groupId, seen);
    if (recallGroup) {
      const available = recallGroup.itemIds.map(id => itemById[id]).filter(item => !seen.has(item.id));
      const capacity = Math.min(policy.maxQuestions - selected.length, recallBatchSize(available.length));
      orderedNewRecall(available, capacity).forEach(item => { selected.push(item.id); reasons[item.id] = recallGroup.title; });
      return { ids: selected, reasons, groupId: recallGroup.id };
    }
    return { ids: selected, reasons, groupId: '' };
  }

  const lastPracticeAt = item => state.records[item.id]?.at || state.exposures[item.id]?.at || 0;
  function weave(recallItems, applicationItems) {
    const recalls = [...recallItems], applications = [...applicationItems], result = [];
    let recallCount = 0;
    while (recalls.length || applications.length) {
      const expectedRecall = Math.round((result.length + 1) * 0.6);
      if (recalls.length && (recallCount < expectedRecall || !applications.length)) {
        result.push(recalls.shift()); recallCount += 1;
      } else if (applications.length) result.push(applications.shift());
    }
    return result;
  }
  function qaSelection(scope, count, type) {
    const eligible = bank.items.filter(item => itemEligible(item, scope, type));
    const seen = seenItemIds();
    const unseen = eligible.filter(item => !seen.has(item.id));
    let selected = [];
    if (type === 'mixed') {
      const recallTarget = Math.round(count * (bank.sessionPolicy.qa.mixedRecallRatio || 0.6));
      const applicationTarget = count - recallTarget;
      const unseenRecalls = unseen.filter(item => item.kind === 'recall');
      const unseenApplications = unseen.filter(item => item.kind === 'application');
      const recalls = unseenRecalls.slice(0, recallTarget);
      const applications = unseenApplications.slice(0, applicationTarget);
      const remaining = count - recalls.length - applications.length;
      if (remaining > 0) weave(unseenRecalls.slice(recalls.length), unseenApplications.slice(applications.length))
        .slice(0, remaining).forEach(item => (item.kind === 'recall' ? recalls : applications).push(item));
      selected = weave(recalls, applications);
    } else selected = unseen.slice(0, count);
    if (selected.length < count) {
      const selectedIds = new Set(selected.map(item => item.id));
      const repeats = eligible.filter(item => !selectedIds.has(item.id))
        .sort((left, right) => lastPracticeAt(left) - lastPracticeAt(right) || left.order - right.order);
      selected.push(...repeats.slice(0, count - selected.length));
    }
    const ids = selected.map(item => item.id);
    return { ids, reasons: Object.fromEntries(ids.map(id => [id, itemById[id].kind === 'recall' ? '主动回忆' : '理解应用'])), groupId: '' };
  }

  function start(mode, options = {}) {
    if (!['daily', 'qa'].includes(mode)) throw new Error('练习方式无效');
    if (!pendingChanges()) refresh();
    const scope = mode === 'daily' ? 'all' : normalizeScope(options.scope);
    const count = mode === 'daily' ? bank.sessionPolicy.daily.maxQuestions : normalizeCount(options.count);
    const typeFilter = mode === 'daily' ? 'mixed' : normalizeType(options.typeFilter);
    const key = sessionKey(mode, scope, count, typeFilter);
    const previous = state.sessions[key];
    const valid = validSession(previous);
    if (valid && (previous.index < previous.ids.length || mode === 'daily' && previous.day === beijingDay(clock()))) {
      ensureOptionOrders(previous); previous.bankVersion = bank.bankVersion; previous.updatedAt = clock(); save();
      return { session: previous, resumed: true, invalidated: false };
    }
    if (previous && !valid) archive(state,'session',key,previous);
    const selection = mode === 'daily' ? dailySelection(valid ? previous : null) : qaSelection(scope, count, typeFilter);
    const session = {
      key, mode, scope, count, typeFilter, bankVersion: bank.bankVersion, day: beijingDay(clock()), ...selection,
      index: 0, answers: {}, updatedAt: clock(),
      questionVersions: Object.fromEntries(selection.ids.map(id => [id, itemById[id].contentVersion])),
      optionOrders: Object.fromEntries(selection.ids.filter(id => itemById[id].kind === 'application')
        .map(id => [id, shuffledOrder(itemById[id].options.map((_, index) => index), random)])),
    };
    if (selection.ids.length) {
      state.sessions[key] = session; invalidSessionKeys.delete(key);
      if (selection.groupId) state.groupHistory[selection.groupId] = { at: clock(), contentVersion: groupById[selection.groupId].contentVersion };
      Object.keys(state.sessions).sort((left, right) => state.sessions[right].updatedAt - state.sessions[left].updatedAt)
        .slice(20).forEach(oldKey => delete state.sessions[oldKey]);
      save();
    } else if (previous) { delete state.sessions[key]; save(); }
    return { session, resumed: false, invalidated: !!previous && !valid };
  }
  function resume(mode, options = {}) {
    const scope = mode === 'daily' ? 'all' : normalizeScope(options.scope);
    const count = mode === 'daily' ? bank.sessionPolicy.daily.maxQuestions : normalizeCount(options.count);
    const type = mode === 'daily' ? 'mixed' : normalizeType(options.typeFilter);
    const session = state.sessions[sessionKey(mode, scope, count, type)];
    if (!validSession(session) || session.index >= session.ids.length && !(mode === 'daily' && session.day === beijingDay(clock()))) return null;
    ensureOptionOrders(session); session.bankVersion = bank.bankVersion; save();
    return { session, resumed: true, invalidated: false };
  }
  function answer(session, choice) {
    if (!validSession(session)) return false;
    const id = session.ids[session.index], item = itemById[id];
    if (!item || item.kind !== 'application' || session.answers[id]) return false;
    if (choice !== null && (!Number.isInteger(choice) || choice < 0 || choice >= item.options.length)) return false;
    session.answers[id] = choice === null ? { type: 'reveal' } : { type: 'choice', choice };
    session.updatedAt = clock(); save(); return true;
  }
  function reveal(session) {
    if (!validSession(session)) return false;
    const id = session.ids[session.index], item = itemById[id];
    if (!item || session.answers[id]) return false;
    session.answers[id] = item.kind === 'recall' ? { type: 'recall', kind: 'recall', revealed: true, outcome: null } : { type: 'reveal' };
    session.updatedAt = clock(); save(); return true;
  }
  function assessRecall(session, outcome) {
    if (!validSession(session) || !RECALL_OUTCOMES.includes(outcome)) return false;
    const id = session.ids[session.index], response = session.answers[id];
    if (itemById[id]?.kind !== 'recall' || response?.type !== 'recall' || !response.revealed || response.outcome) return false;
    response.outcome = outcome; session.updatedAt = clock(); save(); return true;
  }
  function skipRevealedRecall(session) {
    if (!validSession(session)) return false;
    const id = session.ids[session.index], response = session.answers[id];
    if (itemById[id]?.kind !== 'recall' || response?.type !== 'recall' || !response.revealed || response.outcome) return false;
    session.answers[id] = { type: 'skip', kind: 'recall' };
    return advance(session, false);
  }
  function advance(session, again = false) {
    if (!validSession(session)) return false;
    const id = session.ids[session.index], item = itemById[id];
    if (!item) return false;
    let response = session.answers[id];
    if (item.kind === 'recall' && response?.type === 'recall' && !response.outcome) return false;
    if (!response) response = item.kind === 'recall' ? { type: 'skip', kind: 'recall' } : { type: 'skip' };
    session.answers[id] = response;
    state.exposures[id] = { contentVersion: item.contentVersion, at: clock() };
    if (response.type !== 'skip') {
      if (item.kind === 'recall') state.records[id] = {
        kind: 'recall', contentVersion: item.contentVersion, at: clock(),
        due: startOfBeijingDay(clock()) + (response.outcome === 'remembered' ? 3 : 1) * DAY,
        again: response.outcome !== 'remembered', outcome: response.outcome,
      };
      else {
        const correct = response.type === 'choice' && response.choice === item.answerIndex;
        state.records[id] = { contentVersion: item.contentVersion, at: clock(),
          due: startOfBeijingDay(clock()) + (correct && !again ? 3 : 1) * DAY,
          again: !!again || !correct, outcome: response.type === 'reveal' ? 'revealed' : correct ? 'correct' : 'wrong' };
      }
    }
    session.index += 1; session.updatedAt = clock(); save(); return true;
  }
  function result(session) {
    const responses = session.ids.map(id => ({ item: itemById[id], answer: session.answers[id] }));
    const application = {
      correct: responses.filter(({ item, answer: value }) => item.kind === 'application' && value?.type === 'choice' && value.choice === item.answerIndex).length,
      wrong: responses.filter(({ item, answer: value }) => item.kind === 'application' && value?.type === 'choice' && value.choice !== item.answerIndex).length,
      revealed: responses.filter(({ item, answer: value }) => item.kind === 'application' && value?.type === 'reveal').length,
      skipped: responses.filter(({ item, answer: value }) => item.kind === 'application' && value?.type === 'skip').length,
    };
    const recall = {
      remembered: responses.filter(({ item, answer: value }) => item.kind === 'recall' && value?.outcome === 'remembered').length,
      fuzzy: responses.filter(({ item, answer: value }) => item.kind === 'recall' && value?.outcome === 'fuzzy').length,
      missed: responses.filter(({ item, answer: value }) => item.kind === 'recall' && value?.outcome === 'missed').length,
      skipped: responses.filter(({ item, answer: value }) => item.kind === 'recall' && value?.type === 'skip').length,
    };
    return { application, recall, hasApplication: responses.some(({ item }) => item.kind === 'application'),
      hasRecall: responses.some(({ item }) => item.kind === 'recall'), ...application };
  }
  function preferences(mode) {
    const value = state.preferences[mode] || {};
    return { scope: normalizeScope(value.scope), count: normalizeCount(value.count), typeFilter: normalizeType(value.typeFilter) };
  }
  function savePreferences(mode, value) {
    state.preferences[mode] = { scope: normalizeScope(value.scope), count: normalizeCount(value.count),
      ...(legacyApplicationOnly ? {} : { typeFilter: normalizeType(value.typeFilter) }) };
    save(); return state.preferences[mode];
  }
  function restart(mode, options = {}) {
    const scope = mode === 'daily' ? 'all' : normalizeScope(options.scope);
    const count = mode === 'daily' ? bank.sessionPolicy.daily.maxQuestions : normalizeCount(options.count);
    const type = mode === 'daily' ? 'mixed' : normalizeType(options.typeFilter);
    delete state.sessions[sessionKey(mode, scope, count, type)]; save();
    return start(mode, { scope, count, typeFilter: type });
  }
  function hasNewContent() {
    const seen = seenItemIds();
    return Boolean(nextApplicationGroup('', seen) || nextRecallGroup('', seen));
  }

  return {
    start, resume, restart, answer, reveal, assessRecall, skipRevealedRecall, advance, result, preferences, savePreferences, refresh,
    currentSession: key => validSession(state.sessions[key]) ? state.sessions[key] : null,
    hasNewContent, hasNewGroup: hasNewContent, item: id => itemById[id] || null, question: id => itemById[id] || null,
    options: (session, id) => {
      if (!validSession(session) || !session.ids.includes(id) || itemById[id].kind !== 'application') return [];
      ensureOptionOrders(session);
      return session.optionOrders[id].map(index => ({ index, label: itemById[id].options[index] }));
    },
    group: id => groupById[id] || null, state, today: () => beijingDay(clock()),
    persistenceError: () => persistenceError, invalidSessionKeys: () => [...invalidSessionKeys],
    retrySave: () => readFailed ? refresh(true) : save(),
  };
}

function readPoliticsPracticeHome(rawBank, storage, clock = () => Date.now()) {
  const bank = normalizeBank(rawBank);
  const engine = createPoliticsPracticeEngine(bank, storage, clock);
  if (engine.persistenceError()) return { state: 'storage-error', eyebrow: '每日练习', title: '今天练一小组',
    description: '练习记录暂时无法读取，仍可从新的一组开始。', meta: '最多 5 项', action: '开始练习' };
  const key = 'daily:all', session = engine.state.sessions[key];
  if (engine.invalidSessionKeys().includes(key)) return { state: 'updated', eyebrow: '内容已更新', title: '从新的练习内容开始',
    description: '原练习包含已调整内容，本次会按当前题库重新编排。', meta: '最多 5 项', action: '重新开始' };
  if (session && !engine.invalidSessionKeys().includes(key)) {
    if (session.index < session.ids.length) return { state: 'active', eyebrow: session.day === engine.today() ? '继续今日练习' : '继续上次练习',
      title: '接着完成这一组', description: session.day === engine.today() ? '内容已按今天首次进入时固定，回来会接着上次位置。' : '先完成上次未结束的一组，再安排今天的新内容。',
      meta: `${session.index + 1}/${session.ids.length} 项`, action: '继续练习' };
    if (session.day === engine.today()) {
      const summary = engine.result(session), parts = [];
      if (summary.hasApplication) parts.push(`理解应用答对 ${summary.application.correct} 道`);
      if (summary.hasRecall) parts.push(`主动回忆记住 ${summary.recall.remembered} 张`);
      return { state: 'completed', eyebrow: '今日已完成', title: '今天这一组已练完',
        description: `${parts.join('；')}。需要继续时，可进入一问一答。`, meta: `${session.ids.length} 项`, action: '查看结果' };
    }
  }
  if (!bank.groups.length || !bank.items.length) return { state: 'empty', eyebrow: '每日练习', title: '暂时没有可练内容',
    description: '内容核验完成后会在这里出现。', meta: '', action: '' };
  const hasDue = Object.values(engine.state.records).some(record => record.due <= clock());
  if (!hasDue && !engine.hasNewContent()) return { state: 'empty', eyebrow: '每日练习', title: '今天暂时没有待安排内容',
    description: '当前没有新内容或到期回顾；可以按范围继续练习。', meta: '', action: '按主题练习' };
  return { state: 'ready', eyebrow: '每日练习', title: '今天练一小组',
    description: '到期回顾优先，再完成一个应用题组或同主题回忆。', meta: '最多 5 项', action: '开始练习' };
}

module.exports = { STORAGE_KEY, VALID_SCOPES, VALID_COUNTS, VALID_TYPES, beijingDay,
  createPoliticsPracticeEngine, readPoliticsPracticeHome };
