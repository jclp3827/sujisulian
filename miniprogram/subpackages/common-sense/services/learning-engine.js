const { fingerprint } = require("./learning-content");
const { STORAGE_KEY } = require("../../../services/common-sense-progress");
const { confusionGroups, entryPlan, entryMnemonics, entryComparisons, entryExamTopics, entryGroups, entryQuestions } = require("./learning-entry");
const { QUESTION_COUNT_PRESETS } = require("../../../models/train-config");
const normalizeCount = (value) => Object.values(QUESTION_COUNT_PRESETS).includes(Number(value)) ? Number(value) : 5;
const DAY = 86400000;

function beijingDay(time) {
  return new Date(time + 8 * 3600000).toISOString().slice(0, 10);
}

function createEngine(content, storage, clock = () => Date.now()) {
  let persistenceError = "";
  let state = { schema: 1, records: {}, sessions: {}, summary: null };
  try {
    const saved = storage.getStorageSync(STORAGE_KEY);
    if (saved && saved.schema === 1 && saved.records && saved.sessions &&
      typeof saved.records === "object" && !Array.isArray(saved.records) &&
      typeof saved.sessions === "object" && !Array.isArray(saved.sessions)) state = saved;
  } catch (_) { persistenceError = "学习记录读取失败；本次从新的一组开始。"; }
  for (const field of ["preferences", "readingRecords"]) {
    if (!state[field] || typeof state[field] !== "object" || Array.isArray(state[field])) state[field] = {};
  }
  const byId = Object.fromEntries(content.questions.map((q) => [q.id, q]));
  const byMnemonic = Object.fromEntries(content.mnemonics.map((m) => [m.id, m]));
  const compatibleVersion = (session) => session && (session.version === content.version ||
    (content.sessionMigrations || []).some((migration) => {
      if (migration.fromVersion !== session.version || migration.toVersion !== content.version) return false;
      const changedQuestions = migration.changedQuestionIds || [], changedMnemonics = migration.changedMnemonicIds || [];
      const changedComparisons = migration.changedComparisonIds || [], changedExamTopics = migration.changedExamTopicIds || [];
      if (session.kind === "reading" && session.ids.some((id) => changedMnemonics.includes(id))) return false;
      if (session.mode === "mnemonic" && session.mnemonicId && changedMnemonics.includes(session.mnemonicId)) return false;
      if (session.mode === "confusion") {
        const current = entryComparisons(content, session.scope).find((item) => item.groupId === (session.groupId || session.themeId));
        if (current && changedComparisons.includes(current.id)) return false;
      }
      if (session.mode === "exam" && session.variant === "selected" &&
        (session.topicIds || []).some((id) => changedExamTopics.includes(id))) return false;
      return session.ids.every((id) => !changedQuestions.includes(id));
    }));
  const adoptVersion = (session) => { if (session && session.version !== content.version) session.version = content.version; };
  const comparison = (s) => entryComparisons(content, s.scope).find((c) => c.groupId === (s.groupId || s.themeId));
  // B1/B2 stored only a question position. Keep answers; insert the unvisited comparison before remaining questions.
  Object.values(state.sessions).forEach((s) => {
    if (!s || s.mode !== "confusion" || s.flow || s.version !== content.version || !Array.isArray(s.ids)) return;
    const c = comparison(s);
    if (c && JSON.stringify(s.ids) === JSON.stringify(c.questionIds)) s.flow = {
      signature: fingerprint(c), phase: s.index === 0 ? "judge" : s.index < s.ids.length ? "compare" : "done" };
  });
  Object.keys(state.readingRecords).forEach((id) => {
    if (!byMnemonic[id] || !state.readingRecords[id] || state.readingRecords[id].signature !== fingerprint(byMnemonic[id])) delete state.readingRecords[id];
  });
  const signature = (id) => byId[id] && fingerprint(byId[id]);
  Object.keys(state.records).forEach((id) => {
    const r = state.records[id];
    if (!r || r.signature !== signature(id) || !Number.isFinite(r.at) || !Number.isFinite(r.due)) delete state.records[id];
  });
  const save = () => {
    try { storage.setStorageSync(STORAGE_KEY, state); persistenceError = ""; }
    catch (_) { persistenceError = "本次学习记录暂未保存。退出后可能无法恢复，请稍后重试。"; }
  };
  const record = (id) => state.records[id];
  const pool = (scope) => content.questions.filter((q) => scope === "all" || q.scope === scope);
  const oldest = (a, b) => ((record(a.id) || {}).at || 0) - ((record(b.id) || {}).at || 0);
  const keyFor = (mode, scope, variant, mnemonicId, groupId) => [mode, scope, variant, mnemonicId || ""].join(":") + (groupId ? `:group:${groupId}` : "");
  const validSession = (session) => {
    if (!session || !compatibleVersion(session) || !Array.isArray(session.ids) ||
      !session.ids.length || new Set(session.ids).size !== session.ids.length || !Number.isInteger(session.index) ||
      session.index < 0 || session.index > session.ids.length || !session.reasons ||
      typeof session.reasons !== "object" || !session.answers ||
      typeof session.answers !== "object") return false;
    if (session.kind === "reading") {
      const currentMnemonic = byMnemonic[session.ids[session.index]];
      const reviewAnchors = session.reviewAnchors || [];
      return session.mode === "mnemonic" && session.ids.length <= 5 &&
        session.ids.every((id) => entryMnemonics(content, session.scope).some((m) => m.id === id)) &&
        Object.entries(session.answers).every(([id, a]) => session.ids.includes(id) && a && ["read", "again"].includes(a.type)) &&
        (!session.reviewMnemonicId || currentMnemonic && session.reviewMnemonicId === currentMnemonic.id &&
          reviewAnchors.every((anchor) => currentMnemonic.phrases.some((phrase) => phrase.id === anchor.phraseId &&
            (anchor.reviewTarget !== "condition" || phrase.conditionRefs?.some((condition) => condition.id === anchor.reviewAnchorId)))));
    }
    if (typeof session.optionSeed !== "string" || !/^[0-9a-f]{1,8}$/.test(session.optionSeed)) return false;
    const limit = ["qa", "exam"].includes(session.mode) && !session.groupId && !session.mnemonicId ? normalizeCount(session.count) : 5;
    if (session.ids.length > limit || !session.ids.every((id) => byId[id])) return false;
    const enrolled = session.mnemonicId ? (session.mode === "mnemonic" && entryMnemonics(content, session.scope).find((m) => m.id === session.mnemonicId)?.questionIds || []) :
      entryQuestions(content, session.mode, session.scope, session.variant).map((q) => q.id);
    if (!session.ids.every((id) => enrolled.includes(id))) return false;
    if (session.topicIds) {
      const topics = entryExamTopics(content, session.scope), topicIds = new Set(topics.map((topic) => topic.id));
      const topicQuestionIds = new Set(topics.filter((topic) => session.topicIds.includes(topic.id)).flatMap((topic) => topic.questionIds));
      if (session.mode !== "exam" || session.variant !== "selected" || !Array.isArray(session.topicIds) ||
        !session.topicIds.length || session.topicIds.some((id) => !topicIds.has(id)) || session.ids.some((id) => !topicQuestionIds.has(id))) return false;
    }
    if (session.groupId && !entryGroups(content, session.mode, session.scope, session.variant).some((g) => g.id === session.groupId)) return false;
    if (session.mode === "confusion") {
      const group = confusionGroups(content, session.scope).find((g) => g.id === (session.groupId || session.themeId));
      const c = comparison(session), flow = session.flow;
      if (!group || !c || JSON.stringify(session.ids) !== JSON.stringify(c.questionIds) || !flow || flow.signature !== fingerprint(c)) return false;
      if (!(flow.phase === "judge" && session.index === 0 ||
        ["compare", "recheck"].includes(flow.phase) && session.index > 0 && session.index < session.ids.length ||
        flow.phase === "done" && session.index === session.ids.length)) return false;
    }
    return Object.entries(session.answers).every(([id, a]) => session.ids.includes(id) && a &&
      ["choice", "reveal", "skip"].includes(a.type) &&
      (a.type !== "choice" || (Number.isInteger(a.choice) && a.choice >= 0 && a.choice < byId[id].options.length)));
  };

  function select(mode, scope, variant, mnemonicId, groupId, previous, count) {
    const plan = entryPlan(content, mode);
    const eligible = entryQuestions(content, mode, scope, variant);
    const reasons = {};
    let selected = [];
    let themeId = "";
    if (mode === "daily") count = plan ? plan.maxItems : 0;
    if (mnemonicId && mode !== "mnemonic") return { ids: [], reasons, themeId };
    const add = (items, reason, max = count) => items.forEach((q) => {
      if (selected.length < max && !selected.some((p) => p.id === q.id)) {
        selected.push(q); reasons[q.id] = reason;
      }
    });
    if (groupId) {
      const group = entryGroups(content, mode, scope, variant).find((g) => g.id === groupId);
      if (group && !mnemonicId && (mode === "qa" || (mode === "exam" && variant === "selected") ||
        (mode === "confusion" && confusionGroups(content, scope).some((g) => g.id === group.id)))) {
        const ids = mode === "confusion" ? comparison({ scope, groupId: group.id })?.questionIds || [] : group.questionIds;
        add(ids.map((id) => byId[id]), group.title);
      }
    } else if (mnemonicId && mode !== "confusion") {
      const m = entryMnemonics(content, scope).find((m) => m.id === mnemonicId);
      if (m) add(m.questionIds.map((id) => byId[id]), "口诀自测");
    } else if (mode === "confusion") {
      const groups = confusionGroups(content, scope);
      const lastIndex = previous ? groups.findIndex((g) => g.id === previous.themeId) : -1;
      const group = groups.length ? groups[(lastIndex + 1) % groups.length] : null;
      if (group) { themeId = group.id; add((comparison({ scope, themeId: group.id })?.questionIds || []).map((id) => byId[id]), group.title); }
    } else if (mode === "daily") {
      add(eligible.filter((q) => record(q.id) && record(q.id).due <= clock()).sort(oldest), "到期回顾", plan ? plan.maxReview : 0);
      const candidates = entryGroups(content, "daily", scope).filter((g) =>
        g.questionIds.some((id) => !record(id)));
      let group = candidates[0];
      if (scope === "all") {
        const order = content.scopeOrder || [...new Set(content.groups.map((g) => g.scope))];
        const last = previous && content.groups.find((g) => g.id === previous.themeId);
        const start = last ? (order.indexOf(last.scope) + 1) % order.length : 0;
        for (let i = 0; i < order.length; i += 1) {
          const next = candidates.find((g) => g.scope === order[(start + i) % order.length]);
          if (next) { group = next; break; }
        }
      }
      if (group && selected.length < count) {
        themeId = group.id;
        add(group.questionIds.filter((id) => !record(id)).map((id) => byId[id]), group.title);
      }
      // Keep the review budget and due dates meaningful; do not fill with early reviews.
    } else if (mode === "exam") {
      if (variant === "review") {
        eligible.filter((q) => record(q.id) && record(q.id).again).sort(oldest).forEach((q) => {
          const outcome = record(q.id).outcome;
          add([q], `个人待回顾 · ${outcome === "wrong" ? "上次答错" : outcome === "revealed" ? "上次揭晓" : "标记再看"}`);
        });
      } else {
        const topics = entryExamTopics(content, scope);
        const previousTopicId = previous && previous.topicIds && previous.topicIds[previous.topicIds.length - 1];
        const start = previousTopicId ? (topics.findIndex((topic) => topic.id === previousTopicId) + 1) % Math.max(topics.length, 1) : 0;
        const ordered = topics.length ? topics.slice(start).concat(topics.slice(0, start)) : [];
        const topicIds = [];
        for (const topic of ordered) {
          const before = selected.length;
          topic.questionSteps.forEach((step) => add([byId[step.questionId]], step.reason));
          if (selected.length > before) topicIds.push(topic.id);
          if (selected.length >= count) break;
        }
        return { ids: selected.map((q) => q.id), reasons, themeId: "", topicIds };
      }
    } else add(eligible.slice().sort(oldest), "当前范围问答");
    return { ids: selected.map((q) => q.id), reasons, themeId: themeId || (previous && previous.themeId) || "" };
  }
  const summaryFor = (s) => ({
      key: s.key, kind: s.kind || "questions", count: s.count || 5,
      phase: s.flow && s.flow.phase || "",
      mode: s.mode, scope: s.scope, variant: s.variant, mnemonicId: s.mnemonicId, topicIds: s.topicIds || [],
      groupId: s.groupId || "", parentKey: s.parentKey || "",
      index: s.index + 1, total: s.ids.length, day: s.day,
    });
  function updateSummary(s) {
    if (s.index < s.ids.length) state.summary = summaryFor(s);
    else {
      const other = Object.values(state.sessions).filter((v) => validSession(v) && v.index < v.ids.length)
        .sort((a, b) => b.updatedAt - a.updatedAt)[0];
      state.summary = other ? summaryFor(other) : null;
    }
  }
  function start(mode, scope = "all", variant = "selected", mnemonicId = "", groupId = "", count = 5, parentKey = "", refresh = false) {
    if (!["daily", "qa", "exam", "mnemonic", "confusion"].includes(mode)) throw new Error("学习方式无效");
    count = ["qa", "exam"].includes(mode) && !mnemonicId && !groupId ? normalizeCount(count) : 5;
    const key = keyFor(mode, scope, variant, mnemonicId, groupId) + (count === 5 ? "" : `:count:${count}`);
    const previous = state.sessions[key];
    const valid = validSession(previous);
    if (!refresh && valid && (previous.index < previous.ids.length || (mode === "daily" && previous.day === beijingDay(clock())))) {
      adoptVersion(previous);
      if (parentKey) previous.parentKey = parentKey;
      previous.updatedAt = clock(); updateSummary(previous); save();
      return { session: previous, resumed: true, invalidated: false };
    }
    const selection = select(mode, scope, variant, mnemonicId, groupId, previous, count);
    const startedAt = clock();
    const session = { key, mode, scope, variant, mnemonicId, groupId, count, parentKey, version: content.version,
      day: beijingDay(startedAt), ...selection, optionSeed: fingerprint({ key, startedAt, version: content.version, ids: selection.ids }),
      index: 0, answers: {}, updatedAt: startedAt };
    if (mode === "confusion" && session.ids.length) session.flow = { signature: fingerprint(comparison(session)), phase: "judge" };
    if (session.ids.length) {
      state.sessions[key] = session;
      const keys = Object.keys(state.sessions).sort((a, b) => state.sessions[b].updatedAt - state.sessions[a].updatedAt);
      keys.slice(40).forEach((k) => delete state.sessions[k]);
      updateSummary(session); save();
    } else if (previous) {
      delete state.sessions[key]; updateSummary(session); save();
    }
    return { session, resumed: false, invalidated: !!previous && !valid };
  }
  function answer(s, choice) {
    if (s.kind === "reading" || s.flow && s.flow.phase === "compare") return;
    const id = s.ids[s.index];
    if (!id || s.answers[id]) return;
    if (choice !== null && (!Number.isInteger(choice) || choice < 0 || choice >= byId[id].options.length)) return;
    s.answers[id] = choice === null ? { type: "reveal" } : { type: "choice", choice };
    s.updatedAt = clock(); updateSummary(s); save();
  }
  function advance(s, again = false) {
    if (s.kind === "reading") return advanceReading(s, again);
    if (s.flow && s.flow.phase === "compare") return;
    const id = s.ids[s.index];
    if (!id) return;
    const a = s.answers[id] || { type: "skip" };
    s.answers[id] = a;
    if (a.type !== "skip") {
      const correct = a.type === "choice" && a.choice === byId[id].answer;
      state.records[id] = { signature: signature(id), at: clock(),
        due: Date.parse(`${beijingDay(clock())}T00:00:00+08:00`) + (correct && !again ? 3 : 1) * DAY,
        again: again || !correct, outcome: a.type === "reveal" ? "revealed" : correct ? "correct" : "wrong" };
    }
    s.index += 1;
    if (s.mode === "confusion") s.flow.phase = s.index >= s.ids.length ? "done" : s.index === 1 ? "compare" : "recheck";
    s.updatedAt = clock(); updateSummary(s); save();
  }
  function continueComparison(s) {
    if (!validSession(s) || s.mode !== "confusion" || s.flow.phase !== "compare") return;
    s.flow.phase = "recheck"; s.updatedAt = clock(); updateSummary(s); save();
  }
  function result(s) {
    if (s.kind === "reading") return { read: Object.keys(s.answers).length,
      again: Object.values(s.answers).filter((a) => a.type === "again").length };
    const values = s.ids.map((id) => ({ id, answer: s.answers[id] }));
    return {
      correct: values.filter(({ id, answer: a }) => a && a.type === "choice" && a.choice === byId[id].answer).length,
      wrong: values.filter(({ id, answer: a }) => a && a.type === "choice" && a.choice !== byId[id].answer).length,
      revealed: values.filter(({ answer: a }) => a && a.type === "reveal").length,
      skipped: values.filter(({ answer: a }) => a && a.type === "skip").length,
    };
  }
  function preferences(mode) {
    const p = state.preferences[mode] || {};
    return { scope: p.scope === "all" || (content.scopeOrder || []).includes(p.scope) ? p.scope : "all",
      count: normalizeCount(p.count), variant: p.variant === "review" ? "review" : "selected",
      groupId: typeof p.groupId === "string" ? p.groupId : "", readingCount: [1, 3, 5].includes(p.readingCount) ? p.readingCount : 5 };
  }
  function savePreferences(mode, value) {
    state.preferences[mode] = { ...value }; state.preferences[mode] = preferences(mode); save();
  }
  function resume(mode, key = "") {
    const current = state.summary && state.sessions[state.summary.key];
    const candidates = Object.values(state.sessions).filter((s) => s.mode === mode && validSession(s) &&
      (s.index < s.ids.length || (mode === "daily" && s.day === beijingDay(clock()))));
    const s = key ? candidates.find((v) => v.key === key) : candidates.includes(current) ? current : candidates.sort((a, b) => b.updatedAt - a.updatedAt)[0];
    if (!s) return null;
    adoptVersion(s);
    s.updatedAt = clock(); updateSummary(s); save(); return { session: s, resumed: true, invalidated: false };
  }
  function startReading(scope = "all", parentKey = "", focusId = "", readingCount = 5, refresh = false) {
    readingCount = [1, 3, 5].includes(readingCount) ? readingCount : 5;
    const key = parentKey || `mnemonic:${scope}:reading` + (focusId ? `:from:${focusId}` : "");
    const previous = state.sessions[key];
    if (!refresh && validSession(previous) && previous.kind === "reading" && previous.index < previous.ids.length) {
      adoptVersion(previous);
      previous.updatedAt = clock(); updateSummary(previous); save();
      return { session: previous, resumed: true, invalidated: false };
    }
    const ids = entryMnemonics(content, scope)
      .sort((a, b) => (a.id === focusId ? -1 : b.id === focusId ? 1 : 0) ||
        ((state.readingRecords[a.id] || {}).at || 0) - ((state.readingRecords[b.id] || {}).at || 0))
      .slice(0, Math.min(readingCount, (entryPlan(content, "mnemonic") || {}).maxItems || 0)).map((m) => m.id);
    const s = { key, kind: "reading", mode: "mnemonic", scope, variant: "selected", mnemonicId: "", groupId: "",
      version: content.version, readingCount, ids, index: 0, answers: {}, reasons: {}, expanded: true,
      day: beijingDay(clock()), updatedAt: clock() };
    if (ids.length) { state.sessions[key] = s; trimSessions(); updateSummary(s); save(); }
    else if (previous) { delete state.sessions[key]; updateSummary(s); save(); }
    return { session: s, resumed: false, invalidated: !!previous && !validSession(previous) };
  }
  function trimSessions() {
    Object.keys(state.sessions).sort((a, b) => state.sessions[b].updatedAt - state.sessions[a].updatedAt)
      .slice(40).forEach((key) => delete state.sessions[key]);
  }
  function expandReading(s, expanded) {
    if (s.kind !== "reading") return;
    s.expanded = !!expanded; s.updatedAt = clock(); updateSummary(s); save();
  }
  function mnemonicReview(s) {
    const mnemonic = s && s.mode === "mnemonic" && s.kind !== "reading" && byMnemonic[s.mnemonicId];
    if (!mnemonic) return null;
    const failedQuestionIds = new Set(s.ids.filter((id) => {
      const answer = s.answers[id];
      return answer && (answer.type === "reveal" || answer.type === "choice" && answer.choice !== byId[id].answer);
    }));
    const anchors = [];
    for (const phrase of mnemonic.phrases) {
      for (const check of phrase.checks || []) {
        if (failedQuestionIds.has(check.questionId) && !anchors.some((item) => item.reviewAnchorId === check.reviewAnchorId)) {
          anchors.push({ questionId: check.questionId, phraseId: phrase.id, reviewTarget: check.reviewTarget,
            reviewAnchorId: check.reviewAnchorId });
        }
      }
    }
    return { mnemonicId: mnemonic.id, anchors };
  }
  function applyMnemonicReview(s, review) {
    const mnemonic = s && s.kind === "reading" && byMnemonic[s.ids[s.index]];
    if (!mnemonic || !review || review.mnemonicId !== mnemonic.id) return;
    if (!review.anchors.length) { delete s.reviewMnemonicId; delete s.reviewAnchors; return; }
    s.reviewMnemonicId = review.mnemonicId;
    s.reviewAnchors = review.anchors.filter((anchor) => mnemonic.phrases.some((phrase) => phrase.id === anchor.phraseId));
    s.expanded = true; s.updatedAt = clock(); updateSummary(s); save();
  }
  function advanceReading(s, again) {
    const id = s.ids[s.index]; if (!id || !byMnemonic[id]) return;
    s.answers[id] = { type: again ? "again" : "read" };
    state.readingRecords[id] = { signature: fingerprint(byMnemonic[id]), again: !!again, at: clock() };
    s.index += 1; s.expanded = true; delete s.reviewMnemonicId; delete s.reviewAnchors;
    s.updatedAt = clock(); updateSummary(s); save();
  }
  return { start, startReading, expandReading, mnemonicReview, applyMnemonicReview, resume, preferences, savePreferences, answer, advance, result, pool, record, state, comparison, continueComparison,
    persistenceError: () => persistenceError, retrySave: save, today: () => beijingDay(clock()) };
}
module.exports = { createEngine, beijingDay };
