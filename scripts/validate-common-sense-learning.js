#!/usr/bin/env node
const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { createRequire } = require("module");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const source = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const { compile, buildInventory } = require("./build-common-sense-learning");
const { availableContent, answerFeedback, displayOptionOrder } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { createEngine, beijingDay } = require("../miniprogram/subpackages/common-sense/services/learning-engine");
const { entryQuestions, entryMnemonics, entryComparisons } = require("../miniprogram/subpackages/common-sense/services/learning-entry");
const { buildEntryMatrix } = require("./lib/common-sense-entry-matrix");
const { buildDirectory } = require("../miniprogram/subpackages/common-sense/services/topic-directory");
const { searchNotePoints } = require("../miniprogram/subpackages/common-sense/models/note-catalog");
const { STORAGE_KEY } = require("../miniprogram/services/common-sense-progress");
const clone = (value) => JSON.parse(JSON.stringify(value));
const content = availableContent(body, pack, true);
const reports = [];
function test(name, fn) { fn(); reports.push(name); }
function storage() {
  const data = {};
  return { data, getStorageSync: (key) => data[key] && clone(data[key]), setStorageSync: (key, value) => { data[key] = clone(value); } };
}
function page(file, wx) {
  const filename = path.resolve(__dirname, "../miniprogram", file);
  let config;
  vm.runInNewContext(fs.readFileSync(filename, "utf8"), { require: createRequire(filename), Page: (c) => { config = c; },
    wx, console, setTimeout, clearTimeout }, { filename });
  return { ...config, data: clone(config.data), setData(values) { Object.assign(this.data, values); } };
}
const event = (dataset) => ({ currentTarget: { dataset } });

test("candidate references compile deterministically", () => assert.deepEqual(compile(source, body), pack));
test("bad references, options, mnemonic coverage and cross-scope groups rejected", () => {
  for (const mutate of [
    (s) => { s.questions[0].refs[0].tabId = "missing"; },
    (s) => { s.questions[0].answer = 99; },
    (s) => { s.questions[0].options[1] = s.questions[0].options[0]; },
    (s) => { s.questions[0].id = s.questions[1].id; },
    (s) => { s.mnemonics[0].phrases[0].questionIds = []; },
    (s) => { s.mnemonics[0].questionIds.push("not-covered"); },
    (s) => { s.groups[0].questionIds.push("sound-pitch"); },
  ]) { const bad = clone(source); mutate(bad); assert.throws(() => compile(bad, body)); }
});
test("review content denied in trial/release; source approval independently required", () => {
  assert.equal(availableContent(body, pack, false).questions.length, 0);
  const approved = clone(pack);
  [...approved.questions, ...approved.mnemonics, ...approved.targets].forEach((q) => { q.status = "approved"; });
  assert.equal(availableContent(body, approved, false).questions.length, 0);
  const audited = clone(body);
  audited.points.forEach((p) => { p.sourceAuditStatus = "approved"; });
  assert.equal(availableContent(audited, approved, false).questions.length, pack.questions.length);
});
test("source tab change removes derived questions and mnemonic", () => {
  const changed = clone(body);
  changed.points.find((p) => p.id === "acoustics").tabs.find((t) => t.id === "sound-characteristics").blocks[0].items[0] += "修订";
  const available = availableContent(changed, pack, true);
  assert.equal(available.questions.length, pack.questions.length - pack.questions.filter((q) => q.refs.some((ref) => ref.pointId === "acoustics" && ref.tabId === "sound-characteristics")).length);
  assert.equal(available.mnemonics.length, pack.mnemonics.length - 1);
});
test("all 170 body sections reachable exactly once in flattened directory", () => {
  const directory = buildDirectory(body);
  const ids = directory.flatMap((p) => p.chapters.flatMap((c) => c.sections.flatMap((s) => s.points.map((p) => p.id))));
  assert.equal(ids.length, 170); assert.equal(new Set(ids).size, 170);
  assert.deepEqual(new Set(ids), new Set(body.points.map((p) => p.id)));
});
test("search 白居易 deep-links to matching tab", () => {
  const results = searchNotePoints({ moduleId: "common-sense", keyword: "白居易" });
  assert.equal(results.find((p) => p.id === "pre-qin-poetry").matchTabId, "bai-juyi");
});
test("Beijing day changes at 16:00 UTC", () => {
  assert.equal(beijingDay(Date.parse("2026-10-20T15:59:59Z")), "2026-10-20");
  assert.equal(beijingDay(Date.parse("2026-10-20T16:00:00Z")), "2026-10-21");
});
test("Q0-B option order is stable per session seed and removes exploitable display position", () => {
  const seeds = ["12345678", "abcdef12", "feedbeef"];
  for (const seed of seeds) {
    const populations = { all: content.questions };
    content.questions.forEach((question) => { (populations[question.scope] ||= []).push(question); });
    for (const rows of Object.values(populations).filter((items) => items.length >= 20)) {
      const counts = {};
      rows.forEach((question) => {
        const order = displayOptionOrder(question, seed);
        assert.deepEqual(displayOptionOrder(question, seed), order);
        assert.deepEqual(order.slice().sort((a, b) => a - b), question.options.map((_, index) => index));
        const position = order.indexOf(question.answer);
        counts[position] = (counts[position] || 0) + 1;
      });
      assert.ok(Math.max(...Object.values(counts)) / rows.length < 0.5);
    }
  }
  assert.ok(content.questions.some((question) =>
    JSON.stringify(displayOptionOrder(question, "12345678")) !== JSON.stringify(displayOptionOrder(question, "abcdef12"))));
});
test("daily freezes order; choice and reveal persist across reload and midnight", () => {
  const store = storage();
  let now = Date.parse("2026-10-20T10:00:00Z");
  let e = createEngine(content, store, () => now);
  const s = e.start("daily").session;
  assert.equal(s.ids.length, 3);
  e.answer(s, 1);
  const ids = s.ids.slice();
  const optionSeed = s.optionSeed;
  now += 86400000;
  e = createEngine(content, store, () => now);
  const resumed = e.start("daily");
  assert.equal(resumed.resumed, true);
  assert.deepEqual(resumed.session.ids, ids);
  assert.equal(resumed.session.optionSeed, optionSeed);
  assert.equal(resumed.session.day, "2026-10-20");
  assert.equal(resumed.session.answers[ids[0]].choice, 1);
  e.advance(resumed.session);
  e.answer(resumed.session, null); e.advance(resumed.session);
  e.advance(resumed.session);
  assert.deepEqual(e.result(resumed.session), { correct: 1, wrong: 0, revealed: 1, skipped: 1 });
  assert.equal(e.record(ids[1]).again, true);
  assert.equal(e.record(ids[2]), undefined);
  const today = e.start("daily").session;
  assert.equal(today.day, "2026-10-21");
  while (today.index < today.ids.length) e.advance(today);
  assert.equal(e.start("daily").session.index, today.ids.length);
});
test("wrong answers due next day; daily adds at most five unique cards", () => {
  let now = Date.parse("2026-10-20T10:00:00Z");
  const store = storage(), e = createEngine(content, store, () => now);
  const s = e.start("qa", "humanities-history").session;
  e.answer(s, 0); e.advance(s);
  const wrong = s.ids[0];
  assert.equal(e.record(wrong).outcome, "wrong");
  now += 86400001;
  const daily = e.start("daily").session;
  assert.equal(daily.ids[0], wrong);
  assert.equal(daily.reasons[wrong], "到期回顾");
  assert.ok(daily.ids.length <= 5);
  assert.equal(new Set(daily.ids).size, daily.ids.length);
});
test("four areas available; empty scope/review never borrows other material", () => {
  const e = createEngine(content, storage());
  assert.equal(e.start("daily", "law").session.ids.length, 3);
  assert.equal(e.start("daily", "unavailable").session.ids.length, 0);
  assert.equal(e.start("exam", "all", "review").session.ids.length, 0);
  assert.equal(e.start("qa", "economics").session.ids.length, 5);
});
test("daily review budget is two and correct answers are not repeated before due", () => {
  let now = Date.parse("2026-10-20T10:00:00Z");
  const e = createEngine(content, storage(), () => now);
  while(e.pool("humanities-history").some((q) => !e.record(q.id))) {
    const s = e.start("qa", "humanities-history").session;
    while (s.index < s.ids.length) {
      e.answer(s, content.questions.find((q) => q.id === s.ids[s.index]).answer);
      e.advance(s);
    }
  }
  assert.equal(e.start("daily", "humanities-history").session.ids.length, 0);
  now += 3 * 86400000;
  const due = e.start("daily", "humanities-history").session;
  assert.equal(due.ids.length, 2);
  assert.ok(due.ids.every((id) => due.reasons[id] === "到期回顾"));
});
test("changed package invalidates active session and changed item record only", () => {
  const store = storage(), e = createEngine(content, store);
  const s = e.start("qa").session;
  e.answer(s, 1); e.advance(s);
  const changed = clone(content);
  changed.version = "next"; changed.questions[0].revision += 1;
  const updated = createEngine(changed, store);
  assert.equal(updated.record(s.ids[0]), undefined);
  assert.equal(updated.start("qa").invalidated, true);
});
test("invalid local session safely rebuilt; storage errors exposed", () => {
  const store = storage(), e = createEngine(content, store);
  const s = e.start("daily").session;
  store.data[STORAGE_KEY].sessions[s.key].ids.push("missing");
  assert.equal(createEngine(content, store).start("daily").invalidated, true);
  const broken = createEngine(content, { getStorageSync() { throw Error("read"); }, setStorageSync() { throw Error("full"); } });
  assert.match(broken.persistenceError(), /读取失败/);
  broken.start("daily");
  assert.match(broken.persistenceError(), /暂未保存/);
});
test("learning page -> source -> return keeps selected answer; mnemonic and exam paths work", () => {
  const store = storage(), urls = [];
  const wx = { ...store, getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }),
    setNavigationBarTitle() {}, navigateTo({ url }) { urls.push(url); } };
  const p = page("subpackages/common-sense/learning/index.js", wx);
  p.onLoad({ mode: "qa" }); assert.equal(p.data.active, true); p.handleChoice(event({ index: 1 }));
  assert.equal(p.data.revealed, true); assert.equal(p.data.feedback, "本次答对了");
  p.handleSource(event({ point: "pre-qin-poetry", tab: "li-bai" }));
  assert.match(urls[0], /tabId=li-bai/);
  assert.equal(p.data.revealed, true);
  const resumed = page("subpackages/common-sense/learning/index.js", wx);
  resumed.onLoad({ mode: "qa", resume: "1" });
  assert.equal(resumed.data.revealed, true); assert.equal(resumed.data.index, 1);
  const m = page("subpackages/common-sense/learning/index.js", wx);
  m.onLoad({ mode: "mnemonic", scope: "science-technology" });
  assert.equal(m.data.expandedId, "sound-memory");
  m.handleMnemonicTest(event({ id: "sound-memory" }));
  assert.equal(m.data.total, 4); assert.equal(m.data.card.id, "sound-pitch");
  m.handleReveal(); m.handleNext(event({ again: "yes" }));
  const exam = page("subpackages/common-sense/learning/index.js", wx);
  exam.onLoad({ mode: "exam", variant: "review" });
  assert.equal(exam.data.card.id, "sound-pitch");
});
test("selected distractor reason, correct answer and reveal feedback use the exact answer state", () => {
  const question = content.questions.find((item) => item.id === "poet-immortal");
  const specification = content.questionSpecifications.find((item) => item.questionId === question.id);
  assert.deepEqual(answerFeedback(question, specification, { type: "choice", choice: 0 }), {
    feedback: "这次选错了，先定位这项错在哪里", answerSummary: "正确答案：李白", correctAnswerText: "李白",
    selectedOptionText: "杜甫", distractorReason: "诗圣对应杜甫。",
  });
  assert.deepEqual(answerFeedback(question, specification, { type: "choice", choice: 1 }), {
    feedback: "本次答对了", answerSummary: "正确答案：李白", correctAnswerText: "李白",
    selectedOptionText: "", distractorReason: "",
  });
  assert.deepEqual(answerFeedback(question, specification, { type: "reveal" }), {
    feedback: "已揭晓，先理解判断依据", answerSummary: "正确答案：李白", correctAnswerText: "李白",
    selectedOptionText: "", distractorReason: "",
  });
  assert.match(answerFeedback(question, null, { type: "choice", choice: 2 }).distractorReason, /判断依据与范围边界/);

  const store = storage();
  const wx = { ...store, getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }), setNavigationBarTitle() {} };
  const current = page("subpackages/common-sense/learning/index.js", wx);
  current.onLoad({ mode: "qa", scope: "humanities-history", groupId: "poet-titles" });
  assert.equal(current.data.card.id, "poet-immortal");
  const displayOrder = current.data.card.options.map((option) => option.index);
  assert.deepEqual(displayOrder, displayOptionOrder(question, current.session.optionSeed));
  assert.equal(current.data.card.options[current.data.card.displayAnswer].text, "李白");
  assert.equal(current.data.card.options.find((option) => option.index === 0).text, "杜甫");
  current.handleChoice(event({ index: 0 }));
  assert.equal(current.data.selectedOptionText, "杜甫");
  assert.equal(current.data.distractorReason, "诗圣对应杜甫。");
  const resumed = page("subpackages/common-sense/learning/index.js", wx);
  resumed.onLoad({ mode: "qa", resume: "1", sessionKey: encodeURIComponent(current.session.key) });
  assert.equal(resumed.data.card.id, "poet-immortal");
  assert.deepEqual(resumed.data.card.options.map((option) => option.index), displayOrder);
  assert.equal(resumed.data.selectedOptionText, "杜甫");
  assert.equal(resumed.data.distractorReason, "诗圣对应杜甫。");
});
test("trial and unavailable account info fail closed at page boundary", () => {
  for (const env of ["trial", "release", "error"]) {
    const wx = { ...storage(), setNavigationBarTitle() {},
      getAccountInfoSync() { if (env === "error") throw Error("missing"); return { miniProgram: { envVersion: env } }; } };
    const p = page("subpackages/common-sense/learning/index.js", wx);
    p.onLoad({ mode: "daily" });
    assert.equal(p.data.questionCount, 0); assert.equal(p.data.development, false);
  }
});
test("topic page switches chapter in-place and picker navigates exact tab", () => {
  const urls = [], wx = { ...storage(), navigateTo({ url }) { urls.push(url); } };
  const p = page("subpackages/common-sense/topics/index.js", wx);
  p.onLoad({ partId: "humanities-history" });
  p.handleChapter(event({ id: "humanities-history-1" }));
  assert.equal(p.data.chapterId, "humanities-history-1");
  const poetry = body.points.find((p) => p.id === "pre-qin-poetry");
  p.handleTab({ ...event({ id: poetry.id }), detail: { value: poetry.tabs.findIndex((t) => t.id === "bai-juyi") } });
  assert.match(urls[0], /tabId=bai-juyi/);
});
test("inventory lists all sections/tabs with partial coverage and scoped non-mnemonic decisions", () => {
  const i = buildInventory(pack, body);
  assert.equal(i.entries.length, 170); assert.equal(i.totals.tabs, 581);
  assert.equal(new Set(i.entries.map((e) => e.pointId)).size, 170);
  assert.ok(i.entries.every((e) => e.targetInventoryComplete === false));
  assert.equal(i.totals.questionTargets, pack.questions.length); assert.equal(i.totals.mnemonics, pack.mnemonics.length);
  assert.ok(i.totals.mappedDetailUnits >= 25); assert.equal(i.totals.noMnemonicGroups, 3);
  assert.equal(i.totals.blockedTabs, 3);
  assert.ok(i.entries.flatMap((e) => e.tabs).filter((t) => t.status === "blocked-source-review").every((t) => t.questionIds.length === 0));
});
test("law cards require retrieved official basis, locators and matching verification date", () => {
  const lawIndex = source.questions.findIndex((q) => q.scope === "law");
  for (const mutate of [
    (s) => { delete s.questions[lawIndex].verification; },
    (s) => { s.questions[lawIndex].verification.locators = []; },
    (s) => { s.questions[lawIndex].verification.checkedAt = "2025-01-01"; },
    (s) => { s.verificationSources["civil-code-official"].url = "https://example.com/law"; },
  ]) { const bad = clone(source); mutate(bad); assert.throws(() => compile(bad, body), /核验/); }
  assert.ok(pack.questions.filter((q) => q.scope === "law").every((q) => /核验 2026-10-(20|22)$/u.test(q.verificationLabel)));
  assert.ok(pack.questions.filter((q) => ["capacity-under-eight", "capacity-eight-plus", "capacity-labor", "inherit-first", "inherit-second", "inherit-inlaw"].includes(q.id))
    .every((q) => q.verificationLabel.includes("2026-10-22")));
});
test("held source tabs and contradictory mnemonic decisions cannot be compiled", () => {
  const bad = clone(source), hold = source.authoringConstraints[0];
  const q = bad.questions.find((q) => q.scope === "economics");
  q.refs = [{ pointId: hold.pointId, tabId: hold.tabId, sourceUnitIds: ["unused"] }];
  assert.throws(() => compile(bad, body), /待核来源/);
  const conflict = clone(source);
  conflict.groups[0].mnemonicDecision = "not-suitable"; conflict.groups[0].mnemonicReason = "test";
  assert.throws(() => compile(conflict, body), /不适用口诀/);
});
test("chosen topic is bounded, survives reload and is isolated from other topic/daily sessions", () => {
  const store = storage();
  let e = createEngine(content, store);
  const s = e.start("qa", "law", "selected", "", "minor-capacity").session;
  assert.deepEqual(s.ids, ["capacity-under-eight", "capacity-eight-plus", "capacity-labor"]);
  e.answer(s, 0); e.advance(s);
  e = createEngine(content, store);
  const resumed = e.start("qa", "law", "selected", "", "minor-capacity");
  assert.equal(resumed.resumed, true); assert.equal(resumed.session.index, 1);
  assert.equal(store.data[STORAGE_KEY].summary.groupId, "minor-capacity");
  assert.equal(e.start("qa", "law", "selected", "", "inheritance-order").session.index, 0);
  assert.deepEqual(e.start("daily", "law").session.ids, ["capacity-eight-plus", "capacity-labor"]);
  assert.equal(e.start("qa", "economics", "selected", "", "minor-capacity").session.ids.length, 0);
  assert.equal(e.start("daily", "law", "selected", "", "minor-capacity").session.ids.length, 0);
  assert.equal(e.start("exam", "law", "review", "", "minor-capacity").session.ids.length, 0);
});
test("page topic selection and ordinary entry retain group identity without a continuation card", () => {
  const store = storage(), urls = [];
  const wx = { ...store, getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }),
    setNavigationBarTitle() {}, navigateTo({url}) { urls.push(url); } };
  const p = page("subpackages/common-sense/learning/index.js", wx);
  p.onLoad({ mode: "qa", scope: "law", groupId: "minor-capacity" });
  assert.equal(p.data.groups.length, 4);
  p.handleChoice(event({ index: 0 }));
  assert.equal(p.data.total, 3); assert.ok(p.data.card.verificationLabel);
  const home = page("pages/common-sense/index.js", wx);
  home.onShow(); home.handleFeature(event({mode: "qa"}));
  assert.match(urls[0], /mode=qa$/); assert.equal(home.data.continueSummary, undefined);
  const resumed = page("subpackages/common-sense/learning/index.js", wx);
  resumed.onLoad({ mode: "qa" });
  assert.equal(resumed.data.revealed, true);
  const invalid = page("subpackages/common-sense/learning/index.js", wx);
  invalid.onLoad({ mode: "qa", groupId: "removed", resume: "1" });
  assert.equal(invalid.data.active, false); assert.match(invalid.data.notice, /主题已更新/);
  const malformed = page("subpackages/common-sense/learning/index.js", wx);
  malformed.onLoad({ mode: "toString" }); assert.equal(malformed.data.mode, "daily");
});
test("daily all-area topics rotate, freeze within day and skip exhausted areas", () => {
  let now = Date.parse("2026-10-20T10:00:00Z");
  const store = storage(), e = createEngine(content, store, () => now);
  const seen = [];
  for (let day = 0; day < 5; day += 1) {
    const s = e.start("daily").session;
    seen.push(content.groups.find((g) => g.id === s.themeId).scope);
    const ids = s.ids.slice();
    while (s.index < s.ids.length) e.advance(s);
    assert.deepEqual(e.start("daily").session.ids, ids);
    now += 86400000;
  }
  assert.deepEqual(seen, ["humanities-history", "science-technology", "economics", "law", "humanities-history"]);
  const scoped = e.start("daily", "economics").session;
  assert.equal(content.groups.find((g) => g.id === scoped.themeId).scope, "economics");
  const exhausted = clone(content);
  exhausted.groups = exhausted.groups.filter((g) => g.scope !== "science-technology");
  const fresh = createEngine(exhausted, storage(), () => now);
  const first = fresh.start("daily").session;
  while(first.index < first.ids.length) fresh.advance(first);
  now += 86400000;
  const next = fresh.start("daily").session;
  assert.equal(exhausted.groups.find((g) => g.id === next.themeId).scope, "economics");
});
test("B1 homepage separates browsing and routes three modes directly into learning", () => {
  const urls = [], wx = { ...storage(), getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }),
    setNavigationBarTitle() {}, navigateTo({url}) { urls.push(url); } };
  const home = page("pages/common-sense/index.js", wx);
  assert.equal(home.data.features.some((f) => f.id === "topics"), false);
  assert.equal(home.data.features.filter((f) => f.id === "confusion").length, 1);
  home.handleTopicsTap(); assert.equal(urls.pop(), "/subpackages/common-sense/topics/index");
  for (const mode of ["qa", "daily", "exam", "confusion"]) {
    home.handleFeature(event({mode})); assert.match(urls.pop(), new RegExp("mode=" + mode));
    const p = page("subpackages/common-sense/learning/index.js", wx);
    p.onLoad({mode}); assert.equal(p.data.active, true); assert.ok(p.data.card);
    p.handleChoice(event({index: 0}));
    const resumed = page("subpackages/common-sense/learning/index.js", wx);
    resumed.onLoad({mode}); assert.equal(resumed.data.revealed, true);
    assert.equal(resumed.data.card.id, p.data.card.id);
  }
});
test("B1 confusion has an independent curated queue, rotates groups and excludes empty areas", () => {
  const store = storage(), e = createEngine(content, store);
  const qa = e.start("qa").session;
  const first = e.start("confusion").session;
  assert.equal(first.themeId, "minor-capacity"); assert.equal(first.ids.length, 3);
  e.answer(first, 0); e.advance(first);
  assert.equal(e.start("confusion").session.index, 1);
  assert.equal(qa.index, 0); assert.equal(store.data[STORAGE_KEY].summary.mode, "confusion");
  while (first.index < first.ids.length) {
    if (first.flow.phase === "compare") e.continueComparison(first); else e.advance(first);
  }
  assert.equal(e.start("confusion").session.themeId, "civil-principles-compare");
  assert.equal(e.start("confusion", "economics").session.ids.length, 0);
  assert.equal(e.start("confusion", "all", "selected", "", "poet-titles").session.ids.length, 0);
  assert.ok(e.start("confusion", "all", "selected", "poet-memory").session.ids.every(id => !id.startsWith("poet-")));
  const removed = clone(content); removed.groups = removed.groups.filter(g => g.id !== "civil-principles-compare");
  const rebuilt = createEngine(removed, store).start("confusion");
  assert.equal(rebuilt.invalidated, true); assert.equal(rebuilt.session.themeId, "minor-capacity");
});
test("B1 automatic entries keep release candidates closed and confusion invalid links explicit", () => {
  for (const mode of ["qa", "daily", "exam", "confusion", "mnemonic"]) {
    const wx = { ...storage(), setNavigationBarTitle() {},
      getAccountInfoSync: () => ({miniProgram: {envVersion: "release"}}) };
    const p = page("subpackages/common-sense/learning/index.js", wx); p.onLoad({mode});
    assert.equal(p.data.active, false); assert.equal(p.data.card, null); assert.ok(p.data.notice);
  }
  const wx = { ...storage(), setNavigationBarTitle() {},
    getAccountInfoSync: () => ({miniProgram: {envVersion: "develop"}}) };
  const p = page("subpackages/common-sense/learning/index.js", wx);
  p.onLoad({mode: "confusion", groupId: "poet-titles"});
  assert.equal(p.data.active, false); assert.match(p.data.notice, /主题已更新/);
});
test("B2 training count presets bound queues without changing theme or daily limits", () => {
  const store = storage(), e = createEngine(content, store);
  const old = e.start("qa").session; e.answer(old, 1);
  const ten = e.start("qa", "all", "selected", "", "", 10).session;
  assert.equal(ten.ids.length, 10); assert.notEqual(ten.key, old.key);
  assert.equal(e.start("qa").session.answers[old.ids[0]].choice, 1);
  assert.equal(e.start("qa", "law", "selected", "", "", 15).session.ids.length, 12);
  assert.equal(e.start("exam", "all", "selected", "", "", 15).session.ids.length, 10);
  assert.equal(e.start("qa", "law", "selected", "", "minor-capacity", 15).session.ids.length, 3);
  assert.ok(e.start("daily", "all", "selected", "", "", 15).session.ids.length <= 5);
  assert.equal(e.start("qa", "all", "selected", "", "", 99).session.ids.length, 5);
});
test("B2 reading state resumes independently and never writes question mastery", () => {
  const store = storage(); let e = createEngine(content, store);
  const s = e.startReading("science-technology").session;
  assert.equal(s.ids[0], "sound-memory"); assert.equal(s.ids.length, 5);
  e.expandReading(s, false); e.answer(s, 0); assert.equal(Object.keys(s.answers).length, 0);
  e = createEngine(content, store);
  const resumed = e.resume("mnemonic").session;
  assert.equal(resumed.expanded, false); e.advance(resumed, true);
  assert.equal(e.state.readingRecords["sound-memory"].again, true);
  assert.equal(Object.keys(e.state.records).length, 0);
  assert.equal(store.data[STORAGE_KEY].summary.kind, "reading");
  const changed = clone(content); changed.version = "next"; changed.mnemonics[0].revision += 1;
  assert.equal(createEngine(changed, store).startReading("science-technology").invalidated, true);
});
function learningWx(store = storage()) {
  return { ...store, getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }), setNavigationBarTitle() {} };
}
test("learning settings immediately rebuild the queue with the selected scope and count", () => {
  const store = storage(), wx = learningWx(store), p = page("subpackages/common-sense/learning/index.js", wx);
  p.onLoad({mode: "qa"}); p.handleChoice(event({index: 0}));
  const key = p.session.key, answeredId = p.data.card.id;
  p.handleMenu(); p.handleScope(event({id: "law"})); p.handleCount(event({count: 15})); p.handleSaveSettings();
  assert.notEqual(p.session.key, key); assert.equal(p.data.scope, "law"); assert.equal(p.data.revealed, false);
  assert.equal(p.data.total, 12); assert.equal(p.data.count, 15); assert.equal(p.data.progressPercent, 0);
  assert.equal(p.engine.state.sessions[key].answers[answeredId].type, "choice");
  const reload = page("subpackages/common-sense/learning/index.js", wx); reload.onLoad({mode: "qa"});
  assert.equal(reload.session.key, p.session.key); assert.equal(reload.data.scope, "law"); assert.equal(reload.data.total, 12);
});
test("B2 mnemonic self-test resumes from home and returns to the same reading position", () => {
  const store = storage(), wx = learningWx(store), p = page("subpackages/common-sense/learning/index.js", wx);
  p.onLoad({mode: "mnemonic", scope: "science-technology"});
  assert.equal(p.data.reading, true); assert.equal(p.data.mnemonic.id, "sound-memory"); assert.equal(p.data.unit, "条");
  p.handleExpand(); assert.equal(p.data.expandedId, "");
  p.handleMnemonicTest(event({id: "sound-memory"}));
  assert.equal(p.data.unit, "道"); p.handleChoice(event({index: p.data.card.answer}));
  const reload = page("subpackages/common-sense/learning/index.js", wx); reload.onLoad({mode: "mnemonic"});
  assert.equal(reload.data.selfTest, true); assert.equal(reload.data.revealed, true);
  const linked = page("subpackages/common-sense/learning/index.js", wx);
  linked.onLoad({mode: "mnemonic", scope: "science-technology", mnemonicId: "sound-memory", resume: "1", sessionKey: encodeURIComponent(reload.session.key)});
  assert.equal(linked.data.revealed, true); assert.equal(linked.session.parentKey, reload.session.parentKey);
  reload.handleReturnReading(); assert.equal(reload.data.mnemonic.id, "sound-memory"); assert.equal(reload.data.expandedId, "");
  reload.handleMnemonicTest(event({id: "sound-memory"})); assert.equal(reload.data.revealed, true);
  while (!reload.data.completed) reload.handleNext(event({}));
  reload.handleReturnReading(); assert.equal(reload.data.index, 1); assert.equal(reload.data.mnemonic.id, "sound-memory");
  reload.handleNext(event({again: "yes"})); assert.equal(reload.data.index, 2);
  assert.equal(Object.keys(reload.engine.state.records).length, 1);
  const home = page("pages/common-sense/index.js", { ...wx, navigateTo() {} }); home.onShow();
  assert.equal(home.data.continueSummary, undefined);
  const restored = page("subpackages/common-sense/learning/index.js", wx); restored.onLoad({mode: "mnemonic"});
  assert.equal(restored.data.reading, true); assert.equal(restored.data.index, 2); assert.equal(restored.data.notice, "");
});
test("B2 changing daily settings cannot generate another group on the same day", () => {
  let now = Date.parse("2026-10-20T10:00:00Z");
  const store = storage(), wx = learningWx(store), p = page("subpackages/common-sense/learning/index.js", wx);
  createEngine(content, store, () => now).start("daily");
  p.onLoad({mode: "daily"}); p.engine = createEngine(content, store, () => now); p.begin();
  p.handleMenu(); p.handleScope(event({id: "law"})); p.handleSaveSettings();
  assert.equal(p.data.scope, "law"); assert.equal(p.data.active, true); assert.equal(p.data.completed, false);
  while (!p.data.completed) p.handleNext(event({}));
  const oldKey = p.session.key; p.handleNextGroup(); assert.equal(p.session.key, oldKey);
  now += 86400000; p.renderSession(); p.handleNextGroup();
  assert.equal(p.data.scope, "law"); assert.equal(p.session.day, "2026-10-21");
});
test("B2 persisted settings recover from save failure and empty queues stay explicit", () => {
  let fail = true; const store = storage();
  const wx = learningWx({ ...store, setStorageSync(k, v) { if (fail) throw Error("full"); store.setStorageSync(k, v); } });
  const p = page("subpackages/common-sense/learning/index.js", wx); p.onLoad({mode: "confusion", scope: "economics"});
  assert.equal(p.data.active, false); p.handleMenu(); p.handleScope(event({id: "law"})); p.handleSaveSettings();
  assert.ok(p.data.error); assert.equal(p.data.settingsOpen, true); fail = false; p.handleSaveSettings();
  assert.equal(p.data.error, ""); assert.equal(p.data.total, 3); assert.equal(p.data.scope, "law");
});
test("B3a comparison authoring rejects missing boundaries, coverage, sources and verification", () => {
  assert.equal(pack.comparisons.length, 4);
  for (const mutate of [
    s => { s.comparisons[0].rows[0].refs = []; },
    s => { s.comparisons[0].rows[2].questionIds = ["civil-equality"]; },
    s => { s.comparisons[0].rows.pop(); },
    s => { s.comparisons[0].excludes = []; },
    s => { s.comparisons[0].recheckQuestionIds.reverse(); },
    s => { delete s.comparisons[0].verification; },
  ]) { const bad = clone(source); mutate(bad); assert.throws(() => compile(bad, body)); }
});
test("B3a comparison cannot be answered or bypassed and persists without extra question records", () => {
  const store = storage(); let e = createEngine(content, store);
  const s = e.start("confusion").session; assert.equal(s.flow.phase, "judge");
  e.answer(s, 0); e.advance(s); assert.equal(s.flow.phase, "compare");
  assert.equal(Object.keys(e.state.records).length, 1);
  e.answer(s, 0); e.advance(s); assert.equal(s.index, 1); assert.equal(s.answers[s.ids[1]], undefined);
  e = createEngine(content, store); const resumed = e.resume("confusion").session;
  assert.equal(resumed.flow.phase, "compare"); e.continueComparison(resumed);
  assert.equal(resumed.index, 1); assert.equal(resumed.flow.phase, "recheck");
  assert.equal(Object.keys(e.state.records).length, 1);
  e.answer(resumed, 1); e.advance(resumed); e.answer(resumed, 2); e.advance(resumed);
  assert.equal(resumed.flow.phase, "done"); assert.equal(resumed.index, 3);
  assert.equal(e.result(resumed).correct, 3); assert.equal(Object.keys(e.state.records).length, 3);
});
test("B3a legacy answers migrate while unchanged other learning sessions keep their version", () => {
  const oldPack = clone(pack); delete oldPack.comparisons;
  assert.equal(availableContent(body, oldPack, true).version, content.version);
  const store = storage(), e = createEngine(content, store);
  const qa = e.start("qa").session; e.answer(qa, 1);
  const s = e.start("confusion").session; e.answer(s, 0); e.advance(s);
  const saved = store.data[STORAGE_KEY].sessions[s.key]; delete saved.flow;
  saved.answers[saved.ids[1]] = {type: "choice", choice: 1};
  const next = createEngine(content, store), migrated = next.start("confusion");
  assert.equal(migrated.resumed, true); assert.equal(migrated.session.flow.phase, "compare");
  assert.equal(migrated.session.index, 1); next.continueComparison(migrated.session);
  assert.equal(migrated.session.answers[saved.ids[1]].choice, 1);
  assert.equal(next.start("qa").session.answers[qa.ids[0]].choice, 1);
});
test("B3a comparison changes invalidate only that flow and missing source closes the whole group", () => {
  const store = storage(), e = createEngine(content, store);
  const qa = e.start("qa").session; e.answer(qa, 1); e.start("confusion");
  const revised = clone(content); revised.comparisons[0].revision += 1;
  const next = createEngine(revised, store);
  assert.equal(next.start("confusion").invalidated, true); assert.equal(next.start("qa").resumed, true);
  const stalePack = clone(pack); stalePack.comparisons[0].refs[0].fingerprint = "stale";
  const filtered = availableContent(body, stalePack, true);
  assert.equal(filtered.questions.length, pack.questions.length); assert.equal(filtered.comparisons.length, 3);
  const filteredEngine = createEngine(filtered, storage());
  assert.equal(filteredEngine.start("confusion", "all", "selected", "", "minor-capacity").session.ids.length, 0);
  assert.equal(filteredEngine.start("confusion").session.themeId, "civil-principles-compare");
  assert.equal(availableContent(body, pack, false).comparisons.length, 0);
});
test("B3a page restores the comparison step from homepage without exposing the next question", () => {
  const store = storage(), urls = [], wx = { ...learningWx(store), navigateTo({url}) { urls.push(url); } };
  const p = page("subpackages/common-sense/learning/index.js", wx); p.onLoad({mode: "confusion"});
  p.handleChoice(event({index: 0})); p.handleNext(event({}));
  assert.equal(p.data.isComparison, true); assert.equal(p.data.card, null); assert.equal(p.data.comparison.rows.length, 3);
  p.handleSource(event({point: p.data.comparison.refs[0].pointId, tab: p.data.comparison.refs[0].tabId}));
  assert.match(urls.pop(), /tabId=behavior-capacity/); assert.equal(p.data.isComparison, true);
  const home = page("pages/common-sense/index.js", wx); home.onShow();
  assert.equal(home.data.continueSummary, undefined); home.handleFeature(event({mode: "confusion"}));
  const options = Object.fromEntries(new URL("https://test.local" + urls.pop()).searchParams);
  const resumed = page("subpackages/common-sense/learning/index.js", wx); resumed.onLoad(options);
  assert.equal(resumed.data.isComparison, true); assert.equal(resumed.data.card, null);
  resumed.handleComparisonNext(); assert.equal(resumed.data.phaseLabel, "再辨一次");
  assert.equal(resumed.data.card.id, "capacity-eight-plus"); assert.equal(resumed.data.revealed, false);
  resumed.handleMenu(); resumed.handleScope(event({id: "economics"})); resumed.handleSaveSettings();
  assert.equal(resumed.data.isComparison, false); assert.equal(resumed.data.active, false); assert.equal(resumed.data.scope, "economics");
});
test("B3a comparison save failure remains visible and retry preserves the exact stage", () => {
  const store = storage(); let fail = false;
  const e = createEngine(content, {...store, setStorageSync(k,v) { if (fail) throw Error("full"); store.setStorageSync(k,v); }});
  const s = e.start("confusion").session; e.answer(s, 0); e.advance(s); fail = true; e.continueComparison(s);
  assert.match(e.persistenceError(), /暂未保存/); fail = false; e.retrySave();
  const resumed = createEngine(content, store).resume("confusion").session;
  assert.equal(resumed.flow.phase, "recheck"); assert.equal(resumed.index, 1);
});
test("B3b entry plan compiler rejects missing modes, unknown IDs, duplicate IDs and invalid budgets", () => {
  for (const change of [
    s => { delete s.entryPlans; }, s => { delete s.entryPlans.modes.qa; },
    s => { s.entryPlans.modes.qa.groupIds.push("missing"); },
    s => { s.entryPlans.modes.qa.questionIds.push("missing"); },
    s => { s.entryPlans.modes.mnemonic.mnemonicIds.push("poet-memory"); },
    s => { s.entryPlans.modes.confusion.comparisonIds = ["minor-capacity"]; },
    s => { s.entryPlans.modes.confusion.questionIds.pop(); },
    s => { s.entryPlans.modes.exam.reviewGroupIds = ["missing"]; },
    s => { s.entryPlans.modes.daily.maxItems = 6; }, s => { s.entryPlans.modes.daily.maxReview = 3; },
    s => { s.entryPlans.modes.mnemonic.maxItems = 0; }, s => { s.entryPlans.modes.qa.coverage = ""; },
    s => { s.entryPlans.modes.qa.strategy = "random"; },
  ]) { const bad = clone(source); change(bad); assert.throws(() => compile(bad, body), /入口编排/); }
});
test("B3b runtime enrollment changes actual selection and withdraws only the affected entry", () => {
  const store = storage(), e = createEngine(content, store);
  const old = e.start("qa").session; e.answer(old, 1);
  const daily = e.start("daily").session;
  const edited = clone(content); edited.entryPlans.modes.qa.groupIds = ["sound-features"];
  const next = createEngine(edited, store), qa = next.start("qa");
  assert.equal(qa.invalidated, true); assert.equal(qa.session.ids.length, 5); assert.equal(qa.session.ids[0], "sound-pitch");
  assert.equal(next.start("daily").resumed, true); assert.deepEqual(next.start("daily").session.ids, daily.ids);
  assert.equal(next.start("qa", "all", "selected", "", "poet-titles").session.ids.length, 0);
  assert.equal(next.start("exam").session.ids[0], "sound-pitch-timbre-scenario");
  const reordered = clone(content); reordered.entryPlans.modes.daily.groupIds.reverse();
  assert.equal(createEngine(reordered, store).start("daily").resumed, true);
});
test("B3b newly authored resources remain unassigned until explicitly enrolled", () => {
  const added = clone(source), q = clone(added.questions[0]); q.id = "unassigned-question"; q.group = "unassigned-theme";
  added.questions.push(q); added.groups.push({id: q.group, title: "测试未编排主题", scope: q.scope, questionIds: [q.id]});
  const built = compile(added, body), available = availableContent(body, built, true), e = createEngine(available, storage());
  assert.equal(available.questions.length, pack.questions.length + 1); assert.equal(entryQuestions(available, "qa").length, pack.questions.length);
  assert.equal(e.start("qa", "all", "selected", "", q.group).session.ids.length, 0);
  assert.deepEqual(buildEntryMatrix(built, body).unassigned.questions, [q.id]);
  const sameTheme = clone(source), extra = clone(sameTheme.questions.find((item) => item.group === "schools-pairing"));
  extra.id = "new-target-in-existing-theme";
  sameTheme.questions.push(extra); sameTheme.groups.find((g) => g.id === extra.group).questionIds.push(extra.id);
  assert.throws(() => compile(sameTheme, body), /试点题目缺少目标关系/);
});
test("B3b reading, comparison and personal review obey their own explicit lists", () => {
  const edited = clone(content);
  edited.entryPlans.modes.mnemonic.mnemonicIds = ["poet-memory"];
  edited.entryPlans.modes.confusion.comparisonIds = ["civil-principles-comparison"];
  edited.entryPlans.modes.exam.selectedGroupIds = ["sound-features"];
  edited.entryPlans.modes.exam.reviewGroupIds = ["poet-titles"];
  const e = createEngine(edited, storage());
  const wrong = e.start("qa").session; e.answer(wrong, 0); e.advance(wrong);
  assert.equal(e.startReading().session.ids.length, 1);
  assert.equal(e.start("mnemonic", "all", "selected", "sound-memory").session.ids.length, 0);
  assert.equal(e.start("confusion").session.themeId, "civil-principles-compare");
  assert.equal(e.start("exam").session.ids[0], "sound-pitch-timbre-scenario");
  assert.equal(e.start("exam", "all", "review").session.ids[0], "poet-immortal");
});
test("B3b configured budgets are consumed and missing plans fail closed", () => {
  const edited = clone(content); edited.entryPlans.modes.daily.maxItems = 1; edited.entryPlans.modes.daily.maxReview = 1;
  edited.entryPlans.modes.mnemonic.maxItems = 2;
  const e = createEngine(edited, storage()); assert.equal(e.start("daily").session.ids.length, 1); assert.equal(e.startReading().session.ids.length, 2);
  edited.entryPlans = null; const closed = createEngine(edited, storage());
  assert.equal(closed.start("qa").session.ids.length, 0); assert.equal(closed.start("confusion").session.ids.length, 0);
  assert.equal(closed.startReading().session.ids.length, 0);
});
test("B3b matrix separates declared pools, formal eligibility, methods and body coverage", () => {
  const m = buildEntryMatrix(pack, body); assert.equal(m.entries.length, 6);
  assert.equal(m.entries.find(e => e.mode === "mnemonic").questionIds.length, pack.entryPlans.modes.mnemonic.questionIds.length);
  assert.equal(m.entries.find(e => e.mode === "confusion").comparisonIds.length, 4);
  assert.ok(m.entries.every(e => e.counts.publishable.questions === 0));
  assert.ok(m.entries.find(e => e.variant === "review").personalFilter.includes("本人"));
  assert.equal(m.targets.length, pack.questions.length); assert.equal(m.mnemonics.length, pack.mnemonics.length); assert.ok(m.mnemonics.every(v => v.method && v.phrases.length));
  assert.equal(m.browse.points, 170); assert.equal(m.browse.tabs, 581); assert.equal(m.gaps.atomicTargetInventoryComplete, false);
  assert.ok(m.targets.every(q => q.entries.length && q.refs.length));
});
test("B3b incomplete target enrollment closes whole mnemonics and comparisons", () => {
  const narrowed = clone(content);
  narrowed.entryPlans.modes.mnemonic.questionIds = narrowed.entryPlans.modes.mnemonic.questionIds.filter(id => id !== "poet-immortal");
  narrowed.entryPlans.modes.confusion.questionIds = narrowed.entryPlans.modes.confusion.questionIds.filter(id => id !== "capacity-eight-plus");
  assert.equal(entryMnemonics(narrowed).some(m => m.id === "poet-memory"), false);
  assert.equal(entryComparisons(narrowed).length, 3);
  assert.equal(entryComparisons(narrowed)[0].id, "civil-principles-comparison");
  assert.equal(entryQuestions(narrowed, "qa").some(q => q.id === "poet-immortal"), true);
});
test("C4 keeps mnemonic self-tests independent while adding only the declared daily reuse questions", () => {
  assert.equal(entryQuestions(content, "confusion").length, 12);
  assert.equal(entryQuestions(content, "qa").length, pack.entryPlans.modes.qa.questionIds.length);
  assert.equal(entryQuestions(content, "daily").length, 47);
  assert.equal(entryMnemonics(content).length, pack.entryPlans.modes.mnemonic.mnemonicIds.length);
  for (const [id, group, initial] of [["sound-memory", "sound-features", "sound-pitch-timbre-scenario"],
    ["history-genres-memory", "history-genres", "history-three-books-contrast"]]) {
    const m = entryMnemonics(content).find(m => m.id === id), c = entryComparisons(content).find(c => c.groupId === group);
    assert.equal(c.questionIds.length, 3);
    assert.equal(m.questionIds.length, 4); assert.equal(c.initialQuestionId, initial);
    assert.equal(c.questionIds.some(questionId => m.questionIds.includes(questionId)), true);
    const e = createEngine(content, storage());
    assert.deepEqual(e.start("mnemonic", "all", "selected", id).session.ids, m.questionIds);
    assert.equal(c.status, "review"); assert.equal(c.verificationLabel, undefined);
    assert.equal(c.supplementalSources[0].retrieved, true);
  }
});
test("C3 both pilot scopes support judgement, restored comparison and distinct recheck targets", () => {
  for (const [scope, group] of [["science-technology", "sound-features"], ["humanities-history", "history-genres"]]) {
    const store = storage(); let e = createEngine(content, store);
    const c = entryComparisons(content).find(c => c.groupId === group);
    const s = e.start("confusion", scope, "selected", "", group).session;
    assert.equal(s.flow.phase, "judge"); assert.deepEqual(s.ids, c.questionIds);
    e.answer(s, content.questions.find(q => q.id === s.ids[0]).answer); e.advance(s);
    e = createEngine(content, store); const resumed = e.resume("confusion", s.key).session;
    assert.equal(resumed.flow.phase, "compare");
    const count = Object.keys(e.state.records).length; e.advance(resumed); assert.equal(resumed.index, 1);
    e.continueComparison(resumed); assert.equal(Object.keys(e.state.records).length, count);
    assert.equal(resumed.flow.phase, "recheck"); assert.deepEqual(resumed.ids.slice(1), c.recheckQuestionIds);
    while (resumed.index < resumed.ids.length) { e.answer(resumed, content.questions.find(q => q.id === resumed.ids[resumed.index]).answer); e.advance(resumed); }
    assert.equal(resumed.flow.phase, "done"); assert.equal(e.result(resumed).correct, 3);
  }
});
test("B3c-1 new enrollment preserves pre-batch question, daily, reading and legal comparison progress", () => {
  const oldPack = clone(pack); oldPack.comparisons = oldPack.comparisons.slice(0, 2);
  oldPack.entryPlans.revision = 1; oldPack.entryPlans.modes.confusion.comparisonIds = oldPack.comparisons.map(c => c.id);
  oldPack.entryPlans.modes.confusion.questionIds = oldPack.comparisons.flatMap(c => c.questionIds);
  const old = availableContent(body, oldPack, true); assert.equal(old.version, content.version);
  const store = storage(), e = createEngine(old, store);
  const qa = e.start("qa").session; e.answer(qa, 1);
  const daily = e.start("daily").session; e.answer(daily, 0);
  const reading = e.startReading().session;
  const legal = e.start("confusion").session; e.answer(legal, 0); e.advance(legal);
  const next = createEngine(content, store);
  for (const mode of ["qa", "daily", "confusion"]) assert.equal(next.start(mode).resumed, true);
  assert.deepEqual(next.start("qa").session.answers, qa.answers);
  assert.deepEqual(next.start("daily").session.ids, daily.ids);
  assert.equal(next.start("confusion").session.flow.phase, "compare");
  assert.equal(next.startReading().resumed, true); assert.deepEqual(next.startReading().session.ids, reading.ids);
});
test("B3c-1 source drift closes the affected comparison and supplemental evidence cannot replace body refs", () => {
  const changed = clone(body);
  changed.points.find(p => p.id === "acoustics").tabs.find(t => t.id === "sound-characteristics").blocks[0].items[0] += "修订";
  const filtered = availableContent(changed, pack, true);
  assert.equal(entryComparisons(filtered).length, 3);
  assert.equal(entryComparisons(filtered).some(c => c.groupId === "sound-features"), false);
  assert.equal(entryComparisons(filtered).some(c => c.groupId === "history-genres"), true);
  for (const mutate of [
    c => { c.rows[0].refs = []; }, c => { c.rows[0].questionIds = ["history-shiji"]; },
    c => { c.excludes = []; }, c => { c.supplementalSources[0].retrieved = false; },
    c => { c.supplementalSources[0].locator = ""; }, c => { c.supplementalSources[0].url = "javascript:invalid"; },
  ]) { const bad = clone(source); mutate(bad.comparisons[2]); assert.throws(() => compile(bad, body)); }
  assert.equal(availableContent(body, pack, false).comparisons.length, 0);
});
test("reading settings immediately rebuild the mnemonic queue", () => {
  const store = storage(), wx = learningWx(store), p = page("subpackages/common-sense/learning/index.js", wx);
  p.onLoad({mode: "mnemonic"}); assert.equal(p.session.ids.length, 5);
  p.handleMenu(); assert.equal(p.data.draft.readingCount, 5);
  p.handleReadingCount(event({count: 1})); p.handleSaveSettings();
  assert.equal(p.session.ids.length, 1); assert.equal(p.session.readingCount, 1);
  p.handleExpand(); p.handleMenu(); p.handleReadingCount(event({count: 3})); p.handleSaveSettings();
  assert.equal(p.session.ids.length, 3); assert.equal(p.session.readingCount, 3); assert.equal(p.data.index, 1);
  const restored = page("subpackages/common-sense/learning/index.js", wx); restored.onLoad({mode: "mnemonic"});
  assert.equal(restored.session.ids.length, 3); assert.equal(restored.data.expandedId, restored.data.mnemonic.id); assert.equal(restored.data.notice, "");
  const old = createEngine(content, storage()).startReading().session; delete old.readingCount;
  store.data[STORAGE_KEY].sessions[old.key] = old;
  assert.equal(createEngine(content, store).startReading("all", "", "", 1).resumed, true);
});
test("simplified settings clear the hidden theme and immediately rebuild an explicit group", () => {
  const store = storage(), wx = learningWx(store), p = page("subpackages/common-sense/learning/index.js", wx);
  p.onLoad({mode: "qa", scope: "law", groupId: "minor-capacity"});
  p.handleMenu(); assert.equal(p.data.draft.groupId, ""); p.handleCount(event({count: 10})); p.handleSaveSettings();
  assert.equal(p.session.groupId, ""); assert.equal(p.data.total, 10); assert.equal(p.data.scope, "law");
});
test("UI-02 exam variants retain their own progress when switched outside settings", () => {
  const p = page("subpackages/common-sense/learning/index.js", learningWx()); p.onLoad({mode: "exam"});
  p.handleChoice(event({index: 1})); p.handleNext(event({})); p.handleChoice(event({index: 2}));
  const key = p.session.key, current = p.data.card.id;
  p.handleExamVariant(event({id: "review"})); assert.equal(p.data.variant, "review");
  assert.equal(p.data.card.id, "sound-pitch-timbre-scenario");
  p.handleExamVariant(event({id: "selected"})); assert.equal(p.session.key, key);
  assert.equal(p.data.card.id, current); assert.equal(p.data.revealed, true);
});
console.log(JSON.stringify({ passed: true, checks: reports.length, reports }, null, 2));
