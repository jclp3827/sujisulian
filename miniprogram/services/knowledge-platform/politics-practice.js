const { shuffledOrder, validOrder } = require("../../utils/option-order");
const STORAGE_KEY = "politics-practice-v1";
const DAY = 86400000;
const VALID_SCOPES = ["all", "thought", "principles"];
const VALID_COUNTS = [5, 10, 15];

function beijingDay(time) {
  return new Date(time + 8 * 3600000).toISOString().slice(0, 10);
}

function startOfBeijingDay(time) {
  return Date.parse(`${beijingDay(time)}T00:00:00+08:00`);
}

function emptyState() {
  return { schema: 1, records: {}, sessions: {}, preferences: {}, groupHistory: {} };
}

function validObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function createPoliticsPracticeEngine(bank, storage, clock = () => Date.now(), random = Math.random) {
  const questionById = Object.fromEntries(bank.questions.map((question) => [question.questionId, question]));
  const groupById = Object.fromEntries(bank.groups.map((group) => [group.groupId, group]));
  const fields = ["records", "sessions", "preferences", "groupHistory"];
  const copy = (value) => JSON.parse(JSON.stringify(value));
  const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const state = emptyState();
  let baseline = emptyState();
  let persistenceError = "";
  let readFailed = false;
  const invalidSessionKeys = new Set();

  function readState() {
    const saved = storage.getStorageSync(STORAGE_KEY);
    const next = emptyState();
    if (saved && saved.schema !== 1) throw new Error("Unsupported practice state");
    if (saved) fields.forEach((field) => {
      if (validObject(saved[field])) next[field] = copy(saved[field]);
    });
    Object.keys(next.records).forEach((id) => {
      const record = next.records[id];
      if (!questionById[id] || !validObject(record) || record.contentVersion !== questionById[id].contentVersion ||
        !Number.isFinite(record.at) || !Number.isFinite(record.due)) delete next.records[id];
    });
    Object.keys(next.groupHistory).forEach((id) => {
      const record = next.groupHistory[id];
      if (!groupById[id] || !validObject(record) || !Number.isFinite(record.at) ||
        record.contentVersion !== groupById[id].contentVersion) delete next.groupHistory[id];
    });
    return next;
  }

  function replaceState(next) {
    fields.forEach((field) => { state[field] = next[field]; });
    invalidSessionKeys.clear();
    Object.entries(state.sessions).forEach(([key, session]) => {
      if (!validSession(session)) invalidSessionKeys.add(key);
    });
  }

  function pendingChanges() { return fields.some((field) => !same(state[field], baseline[field])); }

  function refresh(discardUnreadState = false) {
    if (pendingChanges() && !(discardUnreadState && readFailed)) return false;
    try {
      replaceState(readState());
      baseline = copy(state);
      readFailed = false;
      persistenceError = "";
      return true;
    } catch (_) {
      readFailed = true;
      persistenceError = "练习记录读取失败，请点击重试；已有记录不会被覆盖。";
      return false;
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
            // Keep live updates from other pages, preserving local session identity when unchanged.
            if (own(state[field], key) && same(local, live)) merged[key] = local;
            continue;
          }
          if (field === "sessions" && !same(live, before) && !same(live, local)) {
            persistenceError = "本组已在其他页面更新，请返回后重新进入；已保存记录未被覆盖。";
            return false;
          }
          if (own(state[field], key)) merged[key] = local;
          else delete merged[key];
        }
        latest[field] = merged;
      }
      storage.setStorageSync(STORAGE_KEY, latest);
      replaceState(latest);
      baseline = copy(state);
      persistenceError = "";
      return true;
    } catch (_) {
      persistenceError = "本次练习记录暂未保存，退出后可能无法恢复。";
      return false;
    }
  }

  function normalizeScope(scope) {
    return VALID_SCOPES.includes(scope) ? scope : "all";
  }

  function normalizeCount(count) {
    return VALID_COUNTS.includes(Number(count)) ? Number(count) : 5;
  }

  function sessionKey(mode, scope, count) {
    return mode === "daily" ? "daily:all" : `qa:${scope}:${count}`;
  }

  function groupEligible(group, scope) {
    return scope === "all" || group.scope === scope;
  }

  function validSession(session) {
    if (!session || !Array.isArray(session.ids) || !session.ids.length ||
      new Set(session.ids).size !== session.ids.length || !Number.isInteger(session.index) ||
      session.index < 0 || session.index > session.ids.length || !validObject(session.answers) ||
      !validObject(session.questionVersions)) return false;
    if (!session.ids.every((id) => questionById[id] && session.questionVersions[id] === questionById[id].contentVersion)) return false;
    const answersValid = Object.entries(session.answers).every(([id, answer]) => session.ids.includes(id) && answer &&
      ["choice", "reveal", "skip"].includes(answer.type) &&
      (answer.type !== "choice" || Number.isInteger(answer.choice) && answer.choice >= 0 && answer.choice < questionById[id].options.length));
    if (!answersValid) return false;
    if (session.optionOrders && (!validObject(session.optionOrders) || !session.ids.every(id =>
      validOrder(session.optionOrders[id], questionById[id].options.map((_, index) => index))))) return false;
    if (session.mode === "daily") return session.scope === "all" && session.ids.length <= bank.sessionPolicy.daily.maxQuestions;
    if (session.mode !== "qa" || !VALID_SCOPES.includes(session.scope) || !VALID_COUNTS.includes(session.count) ||
      session.ids.length > session.count || session.ids.some((id) => !groupEligible(groupById[questionById[id].groupId], session.scope))) return false;
    return true;
  }

  function newQuestionIds(group, selectedIds = []) {
    const excluded = new Set([...selectedIds, ...Object.keys(state.records)]);
    // A selected/revealed answer is already seen even before the user presses Next.
    Object.values(state.sessions).filter(validSession).forEach((session) => {
      Object.entries(session.answers).forEach(([id, answer]) => {
        if (answer.type !== "skip") excluded.add(id);
      });
    });
    return group.questionIds.filter((id) => !excluded.has(id));
  }

  function alternatingNewGroup(previousGroupId, selectedIds = []) {
    const unseen = bank.groups.filter((group) => !state.groupHistory[group.groupId] &&
      newQuestionIds(group, selectedIds).length >= bank.sessionPolicy.daily.newGroupQuestionCount[0]);
    if (!unseen.length) return null;
    const previous = groupById[previousGroupId];
    if (previous) {
      const otherScope = previous.scope === "thought" ? "principles" : "thought";
      const alternating = unseen.find((group) => group.scope === otherScope);
      if (alternating) return alternating;
    }
    return unseen[0];
  }

  function dailySelection(previous) {
    const policy = bank.sessionPolicy.daily;
    const selected = [];
    const reasons = {};
    const records = state.records;
    bank.questions
      .filter((question) => records[question.questionId] && records[question.questionId].due <= clock())
      .sort((left, right) => records[left.questionId].at - records[right.questionId].at)
      .slice(0, policy.maxDueReviews)
      .forEach((question) => {
        selected.push(question.questionId);
        reasons[question.questionId] = "到期回顾";
      });
    const group = alternatingNewGroup(previous && previous.groupId, selected);
    if (group) {
      newQuestionIds(group, selected).forEach((id) => {
        if (selected.length < policy.maxQuestions && !selected.includes(id)) {
          selected.push(id);
          reasons[id] = group.title;
        }
      });
    }
    return { ids: selected, reasons, groupId: group ? group.groupId : "" };
  }

  function qaSelection(scope, count) {
    const eligible = bank.questions.filter((question) => groupEligible(groupById[question.groupId], scope));
    const ordered = eligible.slice().sort((left, right) => {
      const leftRecord = state.records[left.questionId];
      const rightRecord = state.records[right.questionId];
      if (!leftRecord && rightRecord) return -1;
      if (leftRecord && !rightRecord) return 1;
      return (leftRecord?.at || 0) - (rightRecord?.at || 0) || left.order - right.order;
    });
    const ids = ordered.slice(0, count).map((question) => question.questionId);
    return { ids, reasons: Object.fromEntries(ids.map((id) => [id, "当前范围问答"])), groupId: "" };
  }

  function ensureOptionOrders(session) {
    if (session.optionOrders) return;
    // Legacy choices are source indices. Keep already seen questions in their original order.
    session.optionOrders = Object.fromEntries(session.ids.map((id, position) => {
      const ids = questionById[id].options.map((_, index) => index);
      return [id, position <= session.index || session.answers[id] ? ids : shuffledOrder(ids, random)];
    }));
  }

  function start(mode, options = {}) {
    if (!["daily", "qa"].includes(mode)) throw new Error("练习方式无效");
    if (!pendingChanges()) refresh();
    const scope = mode === "daily" ? "all" : normalizeScope(options.scope);
    const count = mode === "daily" ? bank.sessionPolicy.daily.maxQuestions : normalizeCount(options.count);
    const key = sessionKey(mode, scope, count);
    const previous = state.sessions[key];
    const valid = validSession(previous);
    if (valid && (previous.index < previous.ids.length || mode === "daily" && previous.day === beijingDay(clock()))) {
      ensureOptionOrders(previous);
      previous.bankVersion = bank.bankVersion;
      previous.updatedAt = clock();
      save();
      return { session: previous, resumed: true, invalidated: false };
    }
    const selection = mode === "daily" ? dailySelection(valid ? previous : null) : qaSelection(scope, count);
    const session = {
      key, mode, scope, count, bankVersion: bank.bankVersion, day: beijingDay(clock()),
      ...selection, index: 0, answers: {}, updatedAt: clock(),
      questionVersions: Object.fromEntries(selection.ids.map((id) => [id, questionById[id].contentVersion])),
      optionOrders: Object.fromEntries(selection.ids.map(id => [id, shuffledOrder(questionById[id].options.map((_, index) => index), random)])),
    };
    if (selection.ids.length) {
      state.sessions[key] = session;
      invalidSessionKeys.delete(key);
      if (selection.groupId) state.groupHistory[selection.groupId] = {
        at: clock(), contentVersion: groupById[selection.groupId].contentVersion,
      };
      Object.keys(state.sessions).sort((left, right) => state.sessions[right].updatedAt - state.sessions[left].updatedAt)
        .slice(20).forEach((oldKey) => delete state.sessions[oldKey]);
      save();
    } else if (previous) {
      delete state.sessions[key];
      save();
    }
    return { session, resumed: false, invalidated: !!previous && !valid };
  }

  function resume(mode, options = {}) {
    const scope = mode === "daily" ? "all" : normalizeScope(options.scope);
    const count = mode === "daily" ? bank.sessionPolicy.daily.maxQuestions : normalizeCount(options.count);
    const session = state.sessions[sessionKey(mode, scope, count)];
    if (!validSession(session)) return null;
    if (session.index >= session.ids.length && !(mode === "daily" && session.day === beijingDay(clock()))) return null;
    ensureOptionOrders(session);
    session.bankVersion = bank.bankVersion;
    save();
    return { session, resumed: true, invalidated: false };
  }

  function answer(session, choice) {
    if (!validSession(session)) return false;
    const id = session.ids[session.index];
    if (!id || session.answers[id]) return false;
    if (choice !== null && (!Number.isInteger(choice) || choice < 0 || choice >= questionById[id].options.length)) return false;
    session.answers[id] = choice === null ? { type: "reveal" } : { type: "choice", choice };
    session.updatedAt = clock();
    save();
    return true;
  }

  function advance(session, again = false) {
    if (!validSession(session)) return false;
    const id = session.ids[session.index];
    if (!id) return false;
    const response = session.answers[id] || { type: "skip" };
    session.answers[id] = response;
    if (response.type !== "skip") {
      const correct = response.type === "choice" && response.choice === questionById[id].answerIndex;
      state.records[id] = {
        contentVersion: questionById[id].contentVersion,
        at: clock(),
        due: startOfBeijingDay(clock()) + (correct && !again ? 3 : 1) * DAY,
        again: !!again || !correct,
        outcome: response.type === "reveal" ? "revealed" : correct ? "correct" : "wrong",
      };
    }
    session.index += 1;
    session.updatedAt = clock();
    save();
    return true;
  }

  function result(session) {
    const answers = session.ids.map((id) => ({ id, answer: session.answers[id] }));
    return {
      correct: answers.filter(({ id, answer: value }) => value?.type === "choice" && value.choice === questionById[id].answerIndex).length,
      wrong: answers.filter(({ id, answer: value }) => value?.type === "choice" && value.choice !== questionById[id].answerIndex).length,
      revealed: answers.filter(({ answer: value }) => value?.type === "reveal").length,
      skipped: answers.filter(({ answer: value }) => value?.type === "skip").length,
    };
  }

  function preferences(mode) {
    const value = state.preferences[mode] || {};
    return { scope: normalizeScope(value.scope), count: normalizeCount(value.count) };
  }

  function savePreferences(mode, value) {
    state.preferences[mode] = { scope: normalizeScope(value.scope), count: normalizeCount(value.count) };
    save();
    return state.preferences[mode];
  }

  return {
    start, resume, answer, advance, result, preferences, savePreferences, refresh,
    currentSession: (key) => validSession(state.sessions[key]) ? state.sessions[key] : null,
    hasNewGroup: () => Boolean(alternatingNewGroup(null)),
    question: (id) => questionById[id] || null,
    options: (session, id) => {
      if (!validSession(session) || !session.ids.includes(id)) return [];
      ensureOptionOrders(session);
      return session.optionOrders[id].map(index => ({ index, label: questionById[id].options[index] }));
    },
    group: (id) => groupById[id] || null,
    state,
    today: () => beijingDay(clock()),
    persistenceError: () => persistenceError,
    invalidSessionKeys: () => [...invalidSessionKeys],
    retrySave: () => readFailed ? refresh(true) : save(),
  };
}

function readPoliticsPracticeHome(bank, storage, clock = () => Date.now()) {
  const engine = createPoliticsPracticeEngine(bank, storage, clock);
  if (engine.persistenceError()) return {
    state: "storage-error", eyebrow: "每日练习", title: "今天练一小组",
    description: "练习记录暂时无法读取，仍可从新的一组开始。", meta: "最多 5 道", action: "开始练习",
  };
  const key = "daily:all";
  const session = engine.state.sessions[key];
  if (engine.invalidSessionKeys().includes(key)) return {
    state: "updated", eyebrow: "内容已更新", title: "从新的练习内容开始",
    description: "原练习包含已调整内容，本次会按当前题库重新编排。", meta: "最多 5 道", action: "重新开始",
  };
  if (session && !engine.invalidSessionKeys().includes(key)) {
    if (session.index < session.ids.length) return {
      state: "active", eyebrow: session.day === engine.today() ? "继续今日练习" : "继续上次练习", title: "接着完成这一组",
      description: session.day === engine.today() ? "题目已按今天首次进入时固定，回来会接着上次位置。" : "先完成上次未结束的一组，再安排今天的新内容。",
      meta: `${session.index + 1}/${session.ids.length} 道`, action: "继续练习",
    };
    if (session.day === engine.today()) {
      const result = engine.result(session);
      return {
      state: "completed", eyebrow: "今日已完成", title: "今天这一组已练完",
        description: `答对 ${result.correct} 道；需要继续时，可进入一问一答再练几题。`,
        meta: `${session.ids.length} 道`, action: "查看结果",
      };
    }
  }
  if (!bank.groups.length || !bank.questions.length) return {
    state: "empty", eyebrow: "每日练习", title: "暂时没有可练内容",
    description: "内容核验完成后会在这里出现。", meta: "", action: "",
  };
  const hasDue = Object.values(engine.state.records).some((record) => record.due <= clock());
  const hasNewGroup = engine.hasNewGroup();
  if (!hasDue && !hasNewGroup) return {
    state: "empty", eyebrow: "每日练习", title: "今天暂时没有待安排内容",
    description: "当前没有可编排的新组，且没有到期回顾；可以按范围继续练习。", meta: "", action: "按主题练习",
  };
  return {
    state: "ready", eyebrow: "每日练习", title: "今天练一小组",
    description: "先处理少量到期回顾，再认识一组新的关系、条件和情境。", meta: "最多 5 道", action: "开始练习",
  };
}

module.exports = {
  STORAGE_KEY,
  VALID_SCOPES,
  VALID_COUNTS,
  beijingDay,
  createPoliticsPracticeEngine,
  readPoliticsPracticeHome,
};
