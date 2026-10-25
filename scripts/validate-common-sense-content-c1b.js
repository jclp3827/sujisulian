#!/usr/bin/env node
const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { createRequire } = require("module");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const currentSource = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const expansion = require("../docs/knowledge-platform/content/common-sense-learning-s4");
const c1a = require("../docs/knowledge-platform/content/common-sense-targets-c1a");
const c1b = require("../docs/knowledge-platform/content/common-sense-questions-c1b");
const b3aComparisons = require("../docs/knowledge-platform/content/common-sense-comparisons-b3a");
const b3cComparisons = require("../docs/knowledge-platform/content/common-sense-comparisons-b3c-1");
const { compile } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { createEngine } = require("../miniprogram/subpackages/common-sense/services/learning-engine");
const { entryQuestions, entryMnemonics, entryComparisons } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

const clone = (value) => JSON.parse(JSON.stringify(value));
const results = [];
const addedIds = c1b.addedQuestions.map((item) => item.id);
function test(name, fn) { fn(); results.push(name); }
function storage() {
  const data = {};
  return { data, getStorageSync: (key) => data[key] && clone(data[key]), setStorageSync: (key, value) => { data[key] = clone(value); } };
}
function page(file, wx) {
  const filename = path.resolve(__dirname, "../miniprogram", file);
  let config;
  vm.runInNewContext(fs.readFileSync(filename, "utf8"), { require: createRequire(filename), Page: (value) => { config = value; },
    wx, console, setTimeout, clearTimeout }, { filename });
  return { ...config, data: clone(config.data), setData(values) { Object.assign(this.data, values); } };
}
function legacyPack() {
  const old = c1bPack(), oldTongjian = clone(expansion.questions.find((item) => item.id === "history-tongjian"));
  oldTongjian.refs = clone(pack.questions.find((item) => item.id === "history-tongjian").refs);
  old.version = "2026-10-20.2";
  old.questions = old.questions.filter((item) => !addedIds.includes(item.id)).map((item) => item.id === oldTongjian.id ? oldTongjian : item);
  old.groups.forEach((group) => { group.questionIds = group.questionIds.filter((id) => !addedIds.includes(id)); });
  old.targetRelations.questionTargets = clone(c1a.relations.questionTargets);
  old.entryPlans.revision = 2;
  old.entryPlans.modes.qa.questionIds = old.entryPlans.modes.qa.questionIds.filter((id) => !addedIds.includes(id));
  delete old.questionSpecifications;
  delete old.variationDecisions;
  delete old.sessionMigrations;
  return old;
}
function c1bPack(value = pack) {
  const old = clone(value), added = new Set(c1b.qaQuestionIds);
  old.version = "2026-10-21.1";
  old.examTopics = [];
  old.comparisons = clone(b3aComparisons).concat(b3cComparisons(old.questions));
  old.targetRelations.comparisonRowTargets = clone(c1a.relations.comparisonRowTargets);
  for (const mnemonic of old.mnemonics.filter((item) => ["sound-memory", "history-genres-memory"].includes(item.id))) {
    mnemonic.revision = 1;
    delete mnemonic.purpose; delete mnemonic.conditions; delete mnemonic.refs;
    mnemonic.questionIds = mnemonic.questionIds.filter((id) => !["sound-loudness-condition", "history-hanshu-genre"].includes(id));
    mnemonic.phrases.forEach((phrase) => {
      phrase.questionIds = phrase.questionIds.filter((id) => !["sound-loudness-condition", "history-hanshu-genre"].includes(id));
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
  old.entryPlans.modes.confusion.questionIds = [
    "capacity-under-eight", "capacity-eight-plus", "capacity-labor", "civil-equality", "civil-voluntary", "civil-fairness",
    "sound-pitch", "sound-loudness", "sound-timbre", "history-shiji", "history-tongjian", "history-hanshu",
  ];
  old.entryPlans.modes.mnemonic.questionIds = old.entryPlans.modes.mnemonic.questionIds.filter((id) =>
    !["sound-loudness-condition", "history-hanshu-genre"].includes(id));
  old.entryPlans.modes.daily.questionIds = old.entryPlans.modes.daily.questionIds.filter((id) => !["sound-loudness-condition", "history-hanshu-genre"].includes(id));
  delete old.entryPlans.modes.daily.featuredQuestionIds;
  old.entryPlans.modes.exam.selectedQuestionIds = old.entryPlans.modes.exam.selectedQuestionIds.filter((id) => !added.has(id));
  old.entryPlans.modes.exam.reviewQuestionIds = old.entryPlans.modes.exam.reviewQuestionIds.filter((id) => !added.has(id));
  delete old.entryPlans.modes.exam.selectedExamTopicIds;
  old.entryPlans.modes.exam.coverage = "精选回看来自已开放主题；个人待回顾只选本人答错、揭晓或标记再看的内容。";
  delete old.mnemonicSpecifications;
  delete old.comparisonSpecifications;
  old.sessionMigrations = clone(c1b.sessionMigrations);
  return old;
}

const source = c1bPack(currentSource);
const pack = compile(source, body);

test("C1b compiles ten pilot questions into two five-question Q&A groups", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.equal(pack.questions.length, 49);
  assert.equal(pack.questionSpecifications.length, 10);
  for (const id of ["sound-features", "history-genres"]) assert.equal(pack.groups.find((group) => group.id === id).questionIds.length, 5);
});

test("question specifications fail closed on missing distractors, target drift, variation gaps and bad migration", () => {
  const mutations = [
    (bad) => { delete bad.questionSpecifications[0].distractorReasons[0]; },
    (bad) => { bad.questionSpecifications[0].primaryTargetIds = ["cs-target-history-shiji-genre"]; },
    (bad) => { bad.variationDecisions[0].variationQuestionIds = bad.variationDecisions[0].directQuestionIds.slice(); },
    (bad) => { bad.questionSpecifications.pop(); },
    (bad) => { bad.sessionMigrations[0].changedQuestionIds = ["missing-question"]; },
  ];
  mutations.forEach((mutate) => { const bad = clone(source); mutate(bad); assert.throws(() => compile(bad, body)); });
});

test("all nine targets have a direct check and a distinct applicable variation", () => {
  assert.equal(pack.variationDecisions.length, 9);
  const relationByQuestion = new Map(pack.targetRelations.questionTargets.map((row) => [row.questionId, row]));
  for (const decision of pack.variationDecisions) {
    assert.ok(decision.directQuestionIds.length);
    assert.ok(decision.variationQuestionIds.length);
    assert.ok(decision.directQuestionIds.every((id) => !decision.variationQuestionIds.includes(id)));
    for (const id of decision.directQuestionIds.concat(decision.variationQuestionIds)) {
      const relation = relationByQuestion.get(id);
      assert.ok([...(relation.primaryTargetIds || []), ...(relation.supportingTargetIds || [])].includes(decision.targetId));
    }
  }
});

test("C1b enrolls new questions only in Q&A before later entry-specific batches", () => {
  const content = availableContent(body, pack, true);
  assert.equal(entryQuestions(content, "qa").length, 49);
  assert.equal(entryQuestions(content, "daily").length, 45);
  assert.equal(entryQuestions(content, "mnemonic").length, 39);
  assert.equal(entryQuestions(content, "confusion").length, 12);
  assert.equal(entryQuestions(content, "exam", "all", "selected").length, 45);
  for (const id of addedIds) {
    assert.equal(entryQuestions(content, "qa").some((item) => item.id === id), true);
    for (const mode of ["daily", "exam", "mnemonic", "confusion"]) assert.equal(entryQuestions(content, mode).some((item) => item.id === id), false);
  }
  assert.deepEqual(addedIds.filter((id) => entryQuestions(content, "mnemonic").some((item) => item.id === id)), []);
});

test("the existing learning page consumes both complete five-question pilot groups", () => {
  for (const [scope, groupId, expectedNewIds] of [
    ["science-technology", "sound-features", ["sound-pitch-timbre-scenario", "sound-loudness-condition"]],
    ["humanities-history", "history-genres", ["history-hanshu-genre", "history-three-books-contrast"]],
  ]) {
    const wx = { ...storage(), getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }), setNavigationBarTitle() {} };
    const instance = page("subpackages/common-sense/learning/index.js", wx);
    instance.onLoad({ mode: "qa", scope, groupId });
    assert.equal(instance.data.active, true);
    assert.equal(instance.data.total, 5);
    assert.ok(expectedNewIds.every((id) => instance.session.ids.includes(id)));
    assert.equal(instance.data.card.options.length, 3);
  }
});

test("additive questions preserve old queues while the rewritten Tongjian question invalidates only affected sessions and records", () => {
  const oldContent = availableContent(body, legacyPack(), true), current = availableContent(body, c1bPack(), true);
  oldContent.version = "c2e0d622";
  current.version = "8dec2e48";
  current.sessionMigrations.forEach((migration) => { migration.toVersion = current.version; });
  assert.notEqual(current.version, oldContent.version);
  const store = storage(), oldEngine = createEngine(oldContent, store, () => Date.parse("2026-10-21T08:00:00Z"));
  const unrelated = oldEngine.start("qa", "humanities-history", "selected", "", "poet-titles").session;
  const sound = oldEngine.start("qa", "science-technology", "selected", "", "sound-features").session;
  oldEngine.answer(sound, oldContent.questions.find((item) => item.id === sound.ids[0]).answer); oldEngine.advance(sound);
  const history = oldEngine.start("qa", "humanities-history", "selected", "", "history-genres").session;
  oldEngine.answer(history, oldContent.questions.find((item) => item.id === history.ids[0]).answer); oldEngine.advance(history);
  oldEngine.answer(history, oldContent.questions.find((item) => item.id === history.ids[1]).answer); oldEngine.advance(history);
  const reading = oldEngine.startReading("all").session;
  const next = createEngine(current, store, () => Date.parse("2026-10-21T08:01:00Z"));
  assert.equal(next.start("qa", "humanities-history", "selected", "", "poet-titles").resumed, true);
  const resumedSound = next.start("qa", "science-technology", "selected", "", "sound-features");
  assert.equal(resumedSound.resumed, true); assert.deepEqual(resumedSound.session.ids, sound.ids); assert.equal(resumedSound.session.version, current.version);
  const rebuiltHistory = next.start("qa", "humanities-history", "selected", "", "history-genres");
  assert.equal(rebuiltHistory.invalidated, true); assert.equal(rebuiltHistory.session.ids.length, 5);
  assert.equal(next.startReading("all").resumed, true); assert.deepEqual(next.startReading("all").session.ids, reading.ids);
  assert.ok(next.record("sound-pitch")); assert.equal(next.record("history-tongjian"), undefined);
  assert.equal(unrelated.ids.length, 3);
});

test("C1b snapshot keeps mnemonic and confusion resources on their original three-question flows", () => {
  const content = availableContent(body, c1bPack(), true), old = availableContent(body, legacyPack(), true);
  for (const id of ["sound-memory", "history-genres-memory"]) {
    assert.deepEqual(entryMnemonics(content).find((item) => item.id === id).questionIds, entryMnemonics(old).find((item) => item.id === id).questionIds);
  }
  for (const groupId of ["sound-features", "history-genres"]) {
    assert.equal(entryComparisons(content).find((item) => item.groupId === groupId).questionIds.length, 3);
  }
});

test("review candidates remain closed in formal admission", () => {
  const formal = availableContent(body, pack, false);
  assert.equal(formal.questions.length, 0);
  assert.equal(formal.questionSpecifications.length, 0);
});

console.log(JSON.stringify({ passed: true, checks: results.length, reports: results }, null, 2));
