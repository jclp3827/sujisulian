#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const currentSource = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const c1a = require("../docs/knowledge-platform/content/common-sense-targets-c1a");
const c1b = require("../docs/knowledge-platform/content/common-sense-questions-c1b");
const c2 = require("../docs/knowledge-platform/content/common-sense-mnemonics-c2");
const b3aComparisons = require("../docs/knowledge-platform/content/common-sense-comparisons-b3a");
const b3cComparisons = require("../docs/knowledge-platform/content/common-sense-comparisons-b3c-1");
const { compile } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { createEngine } = require("../miniprogram/subpackages/common-sense/services/learning-engine");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

const clone = (value) => JSON.parse(JSON.stringify(value));
function c2Snapshot(value) {
  const old = clone(value), added = new Set(c1b.qaQuestionIds);
  old.version = "2026-10-21.2"; old.examTopics = [];
  old.comparisons = clone(b3aComparisons).concat(b3cComparisons(old.questions));
  old.targetRelations.comparisonRowTargets = clone(c1a.relations.comparisonRowTargets);
  old.entryPlans.revision = 4;
  old.entryPlans.modes.confusion.questionIds = [
    "capacity-under-eight", "capacity-eight-plus", "capacity-labor", "civil-equality", "civil-voluntary", "civil-fairness",
    "sound-pitch", "sound-loudness", "sound-timbre", "history-shiji", "history-tongjian", "history-hanshu",
  ];
  old.entryPlans.modes.daily.questionIds = old.entryPlans.modes.daily.questionIds.filter((id) => !["sound-loudness-condition", "history-hanshu-genre"].includes(id));
  delete old.entryPlans.modes.daily.featuredQuestionIds;
  old.entryPlans.modes.exam.selectedQuestionIds = old.entryPlans.modes.exam.selectedQuestionIds.filter((id) => !added.has(id));
  old.entryPlans.modes.exam.reviewQuestionIds = old.entryPlans.modes.exam.reviewQuestionIds.filter((id) => !added.has(id));
  delete old.entryPlans.modes.exam.selectedExamTopicIds;
  old.entryPlans.modes.exam.coverage = "精选回看来自已开放主题；个人待回顾只选本人答错、揭晓或标记再看的内容。";
  delete old.comparisonSpecifications;
  old.sessionMigrations = clone(c1b.sessionMigrations.concat(c2.sessionMigrations));
  return old;
}
const source = c2Snapshot(currentSource);
const pack = compile(source, body);
const results = [];
function test(name, fn) { fn(); results.push(name); }
function storage() {
  const data = {};
  return { data, getStorageSync: (key) => data[key] && clone(data[key]), setStorageSync: (key, value) => { data[key] = clone(value); } };
}
function c1bPack() {
  const old = clone(pack);
  old.version = "2026-10-21.1";
  for (const mnemonic of old.mnemonics.filter((item) => ["sound-memory", "history-genres-memory"].includes(item.id))) {
    mnemonic.revision = 1;
    delete mnemonic.purpose; delete mnemonic.conditions; delete mnemonic.refs;
    mnemonic.questionIds = mnemonic.questionIds.filter((id) => !c2.addedSelfTestQuestionIds.includes(id));
    mnemonic.phrases.forEach((phrase) => {
      phrase.questionIds = phrase.questionIds.filter((id) => !c2.addedSelfTestQuestionIds.includes(id));
      delete phrase.id; delete phrase.targetIds; delete phrase.coverageType; delete phrase.conditionRefs; delete phrase.checks;
    });
    mnemonic.method = "对照记忆";
    if (mnemonic.id === "sound-memory") {
      mnemonic.coverage = "声音三种特性的基本对应关系。";
      mnemonic.excludes = ["传播速度、超声与次声", "距离等因素对实际听感的影响"];
      mnemonic.phrases[0].meaning = "音调描述高低，对应发声体振动频率。";
      mnemonic.phrases[1].meaning = "其他条件相同时，振幅对应响度大小。";
      mnemonic.phrases[2].meaning = "音色帮助区分不同的人声和声响。";
    } else {
      mnemonic.excludes = ["其他史书的作者和地位", "全书篇目、具体历史事件"];
      mnemonic.phrases[0].meaning = "《史记》：纪传体、通史。";
      mnemonic.phrases[1].meaning = "《资治通鉴》：编年体、通史。";
      mnemonic.phrases[2].meaning = "《汉书》：纪传体、断代史。";
    }
  }
  old.targetRelations.mnemonicPhraseTargets = clone(c1a.relations.mnemonicPhraseTargets);
  old.entryPlans.revision = 3;
  old.entryPlans.modes.mnemonic.questionIds = old.entryPlans.modes.mnemonic.questionIds.filter((id) => !c2.addedSelfTestQuestionIds.includes(id));
  delete old.mnemonicSpecifications;
  old.sessionMigrations = clone(c1b.sessionMigrations);
  return compile(old, body);
}
function c2Pack() {
  return compile(clone(pack), body);
}

test("C2 compiles two revision-two mnemonic learning packages with four checks each", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.equal(pack.mnemonicSpecifications.length, 2);
  assert.equal(pack.targetRelations.mnemonicPhraseTargets.length, 6);
  for (const id of ["sound-memory", "history-genres-memory"]) {
    const mnemonic = pack.mnemonics.find((item) => item.id === id);
    assert.equal(mnemonic.revision, 2); assert.equal(mnemonic.questionIds.length, 4);
    assert.ok(mnemonic.purpose && mnemonic.conditions.length && mnemonic.phrases.every((phrase) => phrase.id && phrase.checks.length));
  }
});

test("mnemonic package construction fails closed on missing purpose, condition, stable id, target check or review anchor", () => {
  const mutations = [
    (bad) => { delete bad.mnemonics.find((item) => item.id === "sound-memory").purpose; },
    (bad) => { bad.mnemonics.find((item) => item.id === "sound-memory").conditions = []; },
    (bad) => { const m = bad.mnemonics.find((item) => item.id === "sound-memory"); m.phrases[1].id = m.phrases[0].id; },
    (bad) => { bad.mnemonics.find((item) => item.id === "history-genres-memory").phrases[2].checks = []; },
    (bad) => { bad.mnemonics.find((item) => item.id === "sound-memory").phrases[1].checks[1].reviewAnchorId = "missing-condition"; },
    (bad) => { bad.mnemonicSpecifications[0].selfTestQuestionIds.pop(); },
  ];
  mutations.forEach((mutate) => { const bad = clone(source); mutate(bad); assert.throws(() => compile(bad, body)); });
});

test("all nine declared targets have a phrase and an explicit self-test mapping without the broad contrast question", () => {
  const relationByQuestion = new Map(pack.targetRelations.questionTargets.map((row) => [row.questionId, row]));
  const covered = new Set();
  for (const id of ["sound-memory", "history-genres-memory"]) {
    const mnemonic = pack.mnemonics.find((item) => item.id === id);
    assert.equal(mnemonic.questionIds.includes("history-three-books-contrast"), false);
    for (const phrase of mnemonic.phrases) for (const targetId of phrase.targetIds) {
      covered.add(targetId);
      assert.ok(phrase.checks.some((check) => {
        const relation = relationByQuestion.get(check.questionId);
        return [...relation.primaryTargetIds, ...(relation.supportingTargetIds || [])].includes(targetId);
      }));
    }
  }
  assert.deepEqual([...covered].sort(), pack.targets.map((target) => target.id).sort());
});

test("C2 enrolls only two specific C1b questions in mnemonic self-tests", () => {
  const content = availableContent(body, pack, true);
  assert.equal(entryQuestions(content, "qa").length, 49);
  assert.equal(entryQuestions(content, "mnemonic").length, 41);
  assert.equal(entryQuestions(content, "daily").length, 45);
  assert.equal(entryQuestions(content, "confusion").length, 12);
  assert.equal(entryQuestions(content, "exam", "all", "selected").length, 45);
  assert.deepEqual(c2.addedSelfTestQuestionIds.filter((id) => entryQuestions(content, "mnemonic").some((q) => q.id === id)), c2.addedSelfTestQuestionIds);
  for (const id of ["sound-pitch-timbre-scenario", "history-three-books-contrast"]) {
    assert.equal(entryQuestions(content, "mnemonic").some((q) => q.id === id), false);
  }
});

test("wrong and revealed answers return to exact phrases while a boundary question points to its condition", () => {
  const content = availableContent(body, pack, true), store = storage(), engine = createEngine(content, store);
  const reading = engine.startReading("science-technology", "c2-reading", "sound-memory", 1).session;
  const selfTest = engine.start("mnemonic", "science-technology", "selected", "sound-memory", "", 5, reading.key).session;
  const answer = (id, choice) => {
    assert.equal(selfTest.ids[selfTest.index], id); engine.answer(selfTest, choice); engine.advance(selfTest);
  };
  answer("sound-pitch", 0);
  answer("sound-loudness", content.questions.find((q) => q.id === "sound-loudness").answer);
  answer("sound-loudness-condition", null);
  engine.advance(selfTest); // Skip timbre: an unanswered item must not become a review diagnosis.
  const review = engine.mnemonicReview(selfTest);
  assert.deepEqual(review.anchors.map((item) => item.phraseId), ["sound-memory-pitch", "sound-memory-loudness"]);
  assert.deepEqual(review.anchors.map((item) => item.reviewTarget), ["phrase", "condition"]);
  const returned = engine.startReading("science-technology", reading.key).session;
  engine.applyMnemonicReview(returned, review);
  assert.equal(returned.index, 0); assert.equal(returned.expanded, true);
  assert.deepEqual(returned.reviewAnchors.map((item) => item.reviewAnchorId), ["sound-memory-pitch", "sound-memory-loudness-condition"]);
  engine.advance(returned, false);
  assert.equal(returned.reviewMnemonicId, undefined); assert.equal(returned.reviewAnchors, undefined);
});

test("missing a declared self-test question closes the whole mnemonic package", () => {
  const content = availableContent(body, pack, true), narrowed = clone(content);
  narrowed.entryPlans.modes.mnemonic.questionIds = narrowed.entryPlans.modes.mnemonic.questionIds.filter((id) => id !== "sound-loudness-condition");
  assert.equal(entryMnemonics(narrowed).some((item) => item.id === "sound-memory"), false);
  assert.equal(entryMnemonics(narrowed).some((item) => item.id === "history-genres-memory"), true);
});

test("C2 preserves unrelated Q&A but rebuilds reading and self-test sessions for changed mnemonics", () => {
  const oldContent = availableContent(body, c1bPack(), true), current = availableContent(body, c2Pack(), true);
  oldContent.version = "8dec2e48";
  assert.equal(current.version, "4a61e724");
  const store = storage(), oldEngine = createEngine(oldContent, store, () => Date.parse("2026-10-21T08:00:00Z"));
  const qa = oldEngine.start("qa", "humanities-history", "selected", "", "poet-titles").session;
  oldEngine.answer(qa, oldContent.questions.find((q) => q.id === qa.ids[0]).answer); oldEngine.advance(qa);
  const savedRecord = clone(oldEngine.record(qa.ids[0]));
  const reading = oldEngine.startReading("science-technology", "c2-old-reading", "sound-memory", 1).session;
  const selfTest = oldEngine.start("mnemonic", "humanities-history", "selected", "history-genres-memory", "", 5, "c2-history-parent").session;
  const next = createEngine(current, store, () => Date.parse("2026-10-21T08:01:00Z"));
  assert.equal(next.start("qa", "humanities-history", "selected", "", "poet-titles").resumed, true);
  assert.deepEqual(next.record(qa.ids[0]), savedRecord);
  const nextReading = next.startReading("science-technology", reading.key, "sound-memory", 1);
  assert.equal(nextReading.invalidated, true); assert.equal(nextReading.session.ids[0], "sound-memory");
  const nextSelfTest = next.start("mnemonic", "humanities-history", "selected", "history-genres-memory", "", 5, "c2-history-parent");
  assert.equal(nextSelfTest.invalidated, true); assert.equal(nextSelfTest.session.ids.length, 4);
  assert.equal(selfTest.ids.length, 3);
});

test("review candidates remain closed in formal admission", () => {
  const formal = availableContent(body, pack, false);
  assert.equal(formal.mnemonics.length, 0); assert.equal(formal.mnemonicSpecifications.length, 0);
});

console.log(JSON.stringify({ passed: true, checks: results.length, reports: results }, null, 2));
