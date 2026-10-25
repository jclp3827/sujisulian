const { QUESTION_COUNT_PRESETS } = require("../../../models/train-config");

const STORAGE_KEY = "common-sense-guide-v1";
const MEMORY_STATES = Object.freeze(["remembered", "fuzzy", "missed", "skipped"]);
const COUNTS = Object.freeze(Object.values(QUESTION_COUNT_PRESETS));

function normalizeCount(value) {
  return COUNTS.includes(Number(value)) ? Number(value) : QUESTION_COUNT_PRESETS.mini;
}

function createGuideSession(content, storage, clock = () => Date.now()) {
  if (!content || !Array.isArray(content.groups) || !Array.isArray(content.cards)) throw new Error("知识导读内容无效");
  let persistenceError = "";
  let state = { schema: 1, preferences: {}, records: {}, seen: {}, cursors: {}, sessions: {}, summary: null };
  try {
    const saved = storage.getStorageSync(STORAGE_KEY);
    if (saved && saved.schema === 1 && saved.preferences && saved.records && saved.sessions &&
      typeof saved.preferences === "object" && !Array.isArray(saved.preferences) &&
      typeof saved.records === "object" && !Array.isArray(saved.records) &&
      typeof saved.sessions === "object" && !Array.isArray(saved.sessions)) state = saved;
  } catch (_) {
    persistenceError = "知识导读记录读取失败；本次从新的知识组开始。";
  }
  if (!state.preferences || typeof state.preferences !== "object" || Array.isArray(state.preferences)) state.preferences = {};
  if (!state.records || typeof state.records !== "object" || Array.isArray(state.records)) state.records = {};
  if (!state.seen || typeof state.seen !== "object" || Array.isArray(state.seen)) state.seen = {};
  if (!state.cursors || typeof state.cursors !== "object" || Array.isArray(state.cursors)) state.cursors = {};
  if (!state.sessions || typeof state.sessions !== "object" || Array.isArray(state.sessions)) state.sessions = {};

  const groupById = content.groupById || Object.fromEntries(content.groups.map((group) => [group.id, group]));
  const cardById = content.cardById || Object.fromEntries(content.cards.map((card) => [card.id, card]));
  const scopeValid = (scope) => scope === "all" || (content.scopeOrder || []).includes(scope);
  const groupInScope = (group, scope) => !!group && (scope === "all" || group.scope === scope);
  const invalidatedKeys = new Set();

  const validSession = (session) => {
    if (!session || session.kind !== "knowledge-guide" || !scopeValid(session.scope) ||
      normalizeCount(session.count) !== session.count || typeof session.groupId !== "string" ||
      session.currentGroupId !== session.groupId || !Array.isArray(session.ids) || !session.ids.length ||
      session.ids.length > session.count || new Set(session.ids).size !== session.ids.length ||
      !Number.isInteger(session.index) || session.index < 0 || session.index > session.ids.length ||
      !session.assessments || typeof session.assessments !== "object" || Array.isArray(session.assessments) ||
      !session.cardSignatures || typeof session.cardSignatures !== "object" || Array.isArray(session.cardSignatures)) return false;
    const group = groupById[session.groupId];
    if (!groupInScope(group, session.scope) || session.groupSignature !== group.signature) return false;
    if (!session.ids.every((id) => group.cardIds.includes(id) && cardById[id] && session.cardSignatures[id] === cardById[id].signature)) return false;
    return Object.entries(session.assessments).every(([id, value]) => session.ids.includes(id) && value &&
      MEMORY_STATES.includes(value.status) && Number.isFinite(value.at));
  };

  Object.keys(state.records).forEach((id) => {
    const record = state.records[id];
    if (!cardById[id] || !record || record.signature !== cardById[id].signature ||
      !["remembered", "fuzzy", "missed"].includes(record.status) || !Number.isFinite(record.at)) delete state.records[id];
  });
  Object.keys(state.seen).forEach((id) => {
    const progress = state.seen[id];
    if (!cardById[id] || !progress || progress.signature !== cardById[id].signature ||
      !MEMORY_STATES.includes(progress.status) || !Number.isFinite(progress.at)) delete state.seen[id];
  });
  Object.entries(state.records).forEach(([id, record]) => {
    if (!state.seen[id]) state.seen[id] = { signature: record.signature, status: record.status, at: record.at };
  });
  Object.keys(state.cursors).forEach((scope) => {
    const cursor = state.cursors[scope];
    if (!scopeValid(scope) || !cursor || !groupInScope(groupById[cursor.groupId], scope)) delete state.cursors[scope];
  });
  Object.keys(state.sessions).forEach((key) => {
    if (!validSession(state.sessions[key])) {
      invalidatedKeys.add(key);
      delete state.sessions[key];
    }
  });
  if (state.summary && (!state.summary.key || !state.sessions[state.summary.key])) state.summary = null;

  function save() {
    try {
      storage.setStorageSync(STORAGE_KEY, state);
      persistenceError = "";
      return true;
    } catch (_) {
      persistenceError = "本次知识导读进度暂未保存。退出后可能无法恢复，请稍后重试。";
      return false;
    }
  }

  function preferences() {
    const saved = state.preferences;
    const scope = scopeValid(saved.scope) ? saved.scope : "all";
    const group = groupById[saved.groupId];
    return {
      scope,
      count: normalizeCount(saved.count),
      groupId: groupInScope(group, scope) ? group.id : "",
    };
  }

  function savePreferences(value = {}) {
    const scope = scopeValid(value.scope) ? value.scope : "all";
    const group = groupById[value.groupId];
    state.preferences = {
      scope,
      count: normalizeCount(value.count),
      groupId: groupInScope(group, scope) ? group.id : "",
    };
    save();
    return preferences();
  }

  const record = (cardId) => state.records[cardId] || null;
  const progress = (cardId) => state.seen[cardId] || null;
  const groupHasUnseen = (group) => group.cardIds.some((id) => !progress(id));
  const groupAge = (group) => Math.min(...group.cardIds.map((id) => (progress(id) || {}).at || 0));
  const cardAge = (card) => (progress(card.id) || {}).at || 0;

  function chooseGroup(scope, anchorGroupId) {
    const groups = content.groups.filter((group) => groupInScope(group, scope) && group.cardIds.length);
    if (!groups.length) return null;
    const anchorIndex = groups.findIndex((group) => group.id === anchorGroupId);
    if (anchorIndex >= 0 && groupHasUnseen(groups[anchorIndex])) return groups[anchorIndex];
    const ordered = anchorIndex >= 0 ? groups.slice(anchorIndex + 1).concat(groups.slice(0, anchorIndex + 1)) : groups;
    const nextUnseen = ordered.find(groupHasUnseen);
    if (nextUnseen) return nextUnseen;
    return groups.slice().sort((a, b) => groupAge(a) - groupAge(b) ||
      groups.indexOf(a) - groups.indexOf(b))[0];
  }

  function sessionKey(scope, count, groupId) {
    return `knowledge-guide:${scope}:count:${count}:group:${groupId || "auto"}`;
  }

  function updateSummary(session) {
    if (session && session.index < session.ids.length) {
      state.summary = {
        key: session.key,
        scope: session.scope,
        count: session.count,
        groupId: session.groupId,
        index: session.index + 1,
        total: session.ids.length,
      };
      return;
    }
    const next = Object.values(state.sessions).filter((candidate) => validSession(candidate) && candidate.index < candidate.ids.length)
      .sort((a, b) => b.updatedAt - a.updatedAt)[0];
    state.summary = next ? {
      key: next.key,
      scope: next.scope,
      count: next.count,
      groupId: next.groupId,
      index: next.index + 1,
      total: next.ids.length,
    } : null;
  }

  function trimSessions() {
    Object.keys(state.sessions).sort((a, b) => state.sessions[b].updatedAt - state.sessions[a].updatedAt)
      .slice(40).forEach((key) => delete state.sessions[key]);
  }

  function start(options = {}) {
    const saved = preferences();
    const scope = scopeValid(options.scope) ? options.scope : saved.scope;
    const count = options.count === undefined ? saved.count : normalizeCount(options.count);
    const requestedGroupId = options.groupId === undefined ? saved.groupId : options.groupId;
    const key = sessionKey(scope, count, requestedGroupId || "");
    const previous = state.sessions[key];
    if (!options.refresh && validSession(previous) && previous.index < previous.ids.length) {
      previous.updatedAt = clock();
      updateSummary(previous);
      save();
      return { session: previous, resumed: true, invalidated: false };
    }
    const cursor = state.cursors[scope];
    const anchorGroupId = requestedGroupId || options.currentGroupId || cursor && cursor.groupId || previous && previous.groupId || "";
    const requestedGroup = requestedGroupId && groupById[requestedGroupId];
    const group = requestedGroupId && !groupInScope(requestedGroup, scope) ? null : chooseGroup(scope, anchorGroupId);
    const now = clock();
    const groupCards = group ? group.cardIds.map((id) => cardById[id]).filter(Boolean) : [];
    const unseenCards = groupCards.filter((card) => !progress(card.id));
    const selectionPool = unseenCards.length ? unseenCards : groupCards.slice().sort((a, b) =>
      cardAge(a) - cardAge(b) || group.cardIds.indexOf(a.id) - group.cardIds.indexOf(b.id));
    // Finish the still-unmarked tail of a knowledge group without padding it with already marked cards.
    const selectedCards = selectionPool.slice(0, count);
    const session = {
      key,
      kind: "knowledge-guide",
      scope,
      count,
      groupId: group ? group.id : "",
      currentGroupId: group ? group.id : "",
      ids: selectedCards.map((card) => card.id),
      index: 0,
      assessments: {},
      cardSignatures: Object.fromEntries(selectedCards.map((card) => [card.id, card.signature])),
      groupSignature: group ? group.signature : "",
      startedAt: now,
      updatedAt: now,
    };
    const invalidated = invalidatedKeys.has(key) || !!previous && !validSession(previous);
    invalidatedKeys.delete(key);
    if (session.ids.length) {
      state.sessions[key] = session;
      state.cursors[scope] = { groupId: session.groupId, at: now };
      trimSessions();
      updateSummary(session);
      save();
    } else if (previous) {
      delete state.sessions[key];
      updateSummary(null);
      save();
    }
    return { session, resumed: false, invalidated };
  }

  function resume(key = "") {
    const candidates = Object.values(state.sessions).filter((session) => validSession(session) && session.index < session.ids.length);
    const preferred = key ? candidates.find((session) => session.key === key) :
      state.summary && candidates.find((session) => session.key === state.summary.key);
    const session = preferred || (!key && candidates.sort((a, b) => b.updatedAt - a.updatedAt)[0]);
    if (!session) return null;
    session.updatedAt = clock();
    updateSummary(session);
    save();
    return { session, resumed: true, invalidated: false };
  }

  function assess(session, status) {
    if (!validSession(session) || !MEMORY_STATES.includes(status)) return null;
    const cardId = session.ids[session.index];
    const card = cardById[cardId];
    if (!card) return null;
    const at = clock();
    session.assessments[cardId] = { status, at };
    state.seen[cardId] = { signature: card.signature, status, at };
    if (status !== "skipped") state.records[cardId] = { signature: card.signature, status, at };
    session.index += 1;
    session.updatedAt = at;
    updateSummary(session);
    save();
    return { cardId, status, index: session.index, done: session.index >= session.ids.length };
  }

  function result(session) {
    const counts = { remembered: 0, fuzzy: 0, missed: 0, skipped: 0 };
    if (!session || !Array.isArray(session.ids) || !session.assessments) return { ...counts, assessed: 0, total: 0, pending: 0 };
    session.ids.forEach((id) => {
      const status = session.assessments[id] && session.assessments[id].status;
      if (MEMORY_STATES.includes(status)) counts[status] += 1;
    });
    const assessed = Object.values(counts).reduce((sum, value) => sum + value, 0);
    return { ...counts, assessed, total: session.ids.length, pending: Math.max(0, session.ids.length - assessed) };
  }

  return {
    preferences,
    savePreferences,
    start,
    resume,
    assess,
    result,
    record,
    progress,
    state,
    persistenceError: () => persistenceError,
    retrySave: save,
  };
}

module.exports = {
  COUNTS,
  MEMORY_STATES,
  STORAGE_KEY,
  createGuideSession,
  normalizeCount,
};
