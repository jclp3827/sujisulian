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
const { entryComparisons, entryQuestions } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

const clone = (value) => JSON.parse(JSON.stringify(value));
function c3Snapshot(value) {
  const old = clone(value), added = new Set(require("../docs/knowledge-platform/content/common-sense-questions-c1b").qaQuestionIds);
  old.version = "2026-10-21.3"; old.examTopics = [];
  old.entryPlans.revision = 5;
  old.entryPlans.modes.daily.questionIds = old.entryPlans.modes.daily.questionIds.filter((id) => !["sound-loudness-condition", "history-hanshu-genre"].includes(id));
  delete old.entryPlans.modes.daily.featuredQuestionIds;
  old.entryPlans.modes.exam.selectedQuestionIds = old.entryPlans.modes.exam.selectedQuestionIds.filter((id) => !added.has(id));
  old.entryPlans.modes.exam.reviewQuestionIds = old.entryPlans.modes.exam.reviewQuestionIds.filter((id) => !added.has(id));
  delete old.entryPlans.modes.exam.selectedExamTopicIds;
  old.entryPlans.modes.exam.coverage = "精选回看来自已开放主题；个人待回顾只选本人答错、揭晓或标记再看的内容。";
  old.sessionMigrations = old.sessionMigrations.filter((migration) => migration.toPackVersion !== "2026-10-21.4");
  return old;
}
const source = c3Snapshot(currentSource);
const pack = compile(source, body);
const results = [];
function test(name, fn) { fn(); results.push(name); }
function storage() {
  const data = {};
  return { data, getStorageSync: (key) => data[key] && clone(data[key]), setStorageSync: (key, value) => { data[key] = clone(value); } };
}
function c2Pack() {
  const old = clone(pack);
  old.version = "2026-10-21.2";
  old.comparisons = clone(b3aComparisons).concat(b3cComparisons(old.questions));
  old.targetRelations.comparisonRowTargets = clone(c1a.relations.comparisonRowTargets);
  old.entryPlans.revision = 4;
  old.entryPlans.modes.confusion.questionIds = [
    "capacity-under-eight", "capacity-eight-plus", "capacity-labor", "civil-equality", "civil-voluntary", "civil-fairness",
    "sound-pitch", "sound-loudness", "sound-timbre", "history-shiji", "history-tongjian", "history-hanshu",
  ];
  delete old.comparisonSpecifications;
  old.sessionMigrations = clone(c1b.sessionMigrations.concat(c2.sessionMigrations));
  return compile(old, body);
}

test("C3 compiles two revision-two comparison packages with stable dimensions, rows and roles", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.equal(pack.comparisonSpecifications.length, 2);
  for (const id of ["sound-features-comparison", "history-genres-comparison"]) {
    const comparison = pack.comparisons.find((item) => item.id === id);
    assert.equal(comparison.revision, 2); assert.equal(comparison.questionIds.length, 3);
    assert.ok(comparison.confusionReason && comparison.evidenceBasis.editorial);
    assert.equal(comparison.evidenceBasis.observedErrorData, null);
    assert.equal(comparison.rows.length, 3); assert.equal(comparison.questionRoles.length, 3);
    assert.equal(comparison.questionRoles[0].role, "initial-judgement");
    assert.ok(comparison.questionRoles.slice(1).every((role) => role.role === "recheck"));
  }
});

test("comparison construction fails closed on missing reason, dimension, row id, role, target or package specification", () => {
  const mutations = [
    (bad) => { delete bad.comparisons[2].confusionReason; },
    (bad) => { bad.comparisons[2].dimensions.pop(); },
    (bad) => { delete bad.comparisons[2].rows[0].id; },
    (bad) => { bad.comparisons[2].questionRoles[1].role = "initial-judgement"; },
    (bad) => { bad.comparisons[3].questionRoles[0].targetIds.pop(); },
    (bad) => { bad.comparisonSpecifications.pop(); },
  ];
  mutations.forEach((mutate) => { const bad = clone(source); mutate(bad); assert.throws(() => compile(bad, body)); });
});

test("each pilot uses one broad initial judgement and two different rechecks while covering all declared targets", () => {
  const expected = {
    "sound-features-comparison": ["sound-pitch-timbre-scenario", "sound-loudness-condition", "sound-timbre"],
    "history-genres-comparison": ["history-three-books-contrast", "history-hanshu-genre", "history-tongjian"],
  };
  for (const spec of pack.comparisonSpecifications) {
    const comparison = pack.comparisons.find((item) => item.id === spec.comparisonId);
    assert.deepEqual(comparison.questionIds, expected[comparison.id]);
    assert.deepEqual(spec.requiredQuestionIds, comparison.questionIds);
    assert.deepEqual(new Set(comparison.rows.flatMap((row) => row.targetIds)), new Set(spec.requiredTargetIds));
    assert.ok(spec.requiredTargetIds.every((targetId) => comparison.questionRoles.some((role) => role.targetIds.includes(targetId))));
  }
});

test("runtime follows authored initial-comparison-recheck order instead of theme storage order", () => {
  const content = availableContent(body, pack, true);
  for (const [scope, groupId] of [["science-technology", "sound-features"], ["humanities-history", "history-genres"]]) {
    const comparison = entryComparisons(content, scope).find((item) => item.groupId === groupId);
    const engine = createEngine(content, storage()), session = engine.start("confusion", scope, "selected", "", groupId).session;
    assert.deepEqual(session.ids, comparison.questionIds); assert.equal(session.flow.phase, "judge");
    engine.answer(session, content.questions.find((question) => question.id === session.ids[0]).answer); engine.advance(session);
    assert.equal(session.flow.phase, "compare"); assert.equal(session.index, 1);
    engine.continueComparison(session); assert.equal(session.flow.phase, "recheck");
    assert.deepEqual(session.ids.slice(1), comparison.recheckQuestionIds);
  }
});

test("a missing required question, target or source closes only the affected whole comparison", () => {
  for (const mutate of [
    (bad) => { bad.questions.find((item) => item.id === "sound-loudness-condition").status = "blocked"; },
    (bad) => { bad.targets.find((item) => item.id === "cs-target-sound-pitch-frequency").status = "blocked"; },
    (bad) => { bad.comparisons.find((item) => item.id === "sound-features-comparison").refs[0].fingerprint = "stale"; },
  ]) {
    const changed = clone(pack); mutate(changed);
    const comparisons = entryComparisons(availableContent(body, changed, true));
    assert.equal(comparisons.some((item) => item.id === "sound-features-comparison"), false);
    assert.equal(comparisons.some((item) => item.id === "history-genres-comparison"), true);
    assert.equal(comparisons.some((item) => item.id === "minor-capacity-comparison"), true);
  }
});

test("C3 invalidates only the two changed pilot comparison flows", () => {
  const oldContent = availableContent(body, c2Pack(), true), current = availableContent(body, pack, true);
  assert.equal(oldContent.version, "4a61e724"); assert.equal(current.version, "4850e389");
  const store = storage(), oldEngine = createEngine(oldContent, store, () => Date.parse("2026-10-21T08:00:00Z"));
  const qa = oldEngine.start("qa", "humanities-history", "selected", "", "poet-titles").session;
  oldEngine.answer(qa, oldContent.questions.find((item) => item.id === qa.ids[0]).answer); oldEngine.advance(qa);
  const reading = oldEngine.startReading("science-technology", "c3-reading", "sound-memory", 1).session;
  const legal = oldEngine.start("confusion", "law", "selected", "", "minor-capacity").session;
  const sound = oldEngine.start("confusion", "science-technology", "selected", "", "sound-features").session;
  const next = createEngine(current, store, () => Date.parse("2026-10-21T08:01:00Z"));
  assert.equal(next.start("qa", "humanities-history", "selected", "", "poet-titles").resumed, true);
  assert.equal(next.startReading("science-technology", reading.key, "sound-memory", 1).resumed, true);
  assert.equal(next.start("confusion", "law", "selected", "", "minor-capacity").resumed, true);
  const rebuilt = next.start("confusion", "science-technology", "selected", "", "sound-features");
  assert.equal(rebuilt.invalidated, true); assert.deepEqual(rebuilt.session.ids, current.comparisons.find((item) => item.id === "sound-features-comparison").questionIds);
  assert.notDeepEqual(rebuilt.session.ids, sound.ids); assert.equal(legal.flow.phase, "judge");
});

test("C3 changes only confusion enrollment and keeps the existing entry budgets", () => {
  const content = availableContent(body, pack, true);
  assert.equal(entryQuestions(content, "qa").length, 49);
  assert.equal(entryQuestions(content, "daily").length, 45);
  assert.equal(entryQuestions(content, "mnemonic").length, 41);
  assert.equal(entryQuestions(content, "confusion").length, 12);
  assert.equal(entryQuestions(content, "exam", "all", "selected").length, 45);
  assert.equal(pack.entryPlans.revision, 5);
});

test("review comparison packages remain closed in formal admission", () => {
  const formal = availableContent(body, pack, false);
  assert.equal(formal.comparisons.length, 0); assert.equal(formal.comparisonSpecifications.length, 0);
});

console.log(JSON.stringify({ passed: true, checks: results.length, reports: results }, null, 2));
