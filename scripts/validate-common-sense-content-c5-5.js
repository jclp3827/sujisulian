#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const source = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const c55 = require("../docs/knowledge-platform/content/common-sense-content-c5-5");
const ledger = require("../docs/knowledge-platform/implementations/common-sense-content-c5-ledger.json");
const { compile, buildInventory } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");
const { createEngine } = require("../miniprogram/subpackages/common-sense/services/learning-engine");
const { STORAGE_KEY } = require("../miniprogram/services/common-sense-progress");

const clone = (value) => JSON.parse(JSON.stringify(value));
const reports = [];
function test(name, fn) { fn(); reports.push(name); }
function storage() { const data = {}; return { data, getStorageSync: (key) => data[key] && clone(data[key]), setStorageSync: (key, value) => { data[key] = clone(value); } }; }

const content = availableContent(body, pack, true);
const questionIds = c55.addedQuestions.map((item) => item.id);
const targetIds = c55.targets.map((item) => item.id);
const mnemonicIds = c55.mnemonics.map((item) => item.id);

test("C5-5 remains present after later C5 batches", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.ok(pack.questions.length >= 83);
  assert.ok(pack.groups.length >= 21);
  assert.ok(pack.targets.length >= 39);
  assert.ok(pack.mnemonics.length >= 19);
  assert.ok(buildInventory(pack, body).totals.mappedDetailUnits >= 25);
  assert.ok(buildInventory(pack, body).totals.mappedTabs >= 39);
});

test("C5-5 closes the overview and registers four mechanism candidates", () => {
  const statuses = new Set(["待盘点", "可建设", "已建设", "合并复用", "不适合出题", "待补依据", "延期"]);
  c55.sourceDispositions.forEach((row) => {
    assert.ok(row.candidateId && row.pointId && row.tabIds.length && statuses.has(row.status) && row.scope);
    const point = body.points.find((item) => item.id === row.pointId);
    assert.ok(point && row.tabIds.every((id) => point.tabs.some((tab) => tab.id === id)));
    assert.ok(ledger.entries.some((entry) => entry.candidateId === row.candidateId));
  });
  assert.equal(c55.sourceDispositions.filter((row) => row.status === "可建设").length, 4);
  assert.ok(ledger.directory.detailUnitsWithPartialQuestionCoverage >= 25);
});

test("all four overview targets have direct and full-list rechecks", () => {
  targetIds.forEach((targetId) => {
    const decision = pack.variationDecisions.find((item) => item.targetId === targetId);
    assert.ok(decision && decision.directQuestionIds.length === 1 && decision.variationQuestionIds.includes("market-failure-four-factors-full"));
  });
  questionIds.forEach((questionId) => {
    const q = pack.questions.find((item) => item.id === questionId);
    const spec = pack.questionSpecifications.find((item) => item.questionId === questionId);
    assert.deepEqual(Object.keys(spec.distractorReasons).map(Number).sort(), q.options.map((_, i) => i).filter((i) => i !== q.answer));
  });
});

test("the overview mnemonic maps all four names without claiming mechanism coverage", () => {
  const mnemonic = pack.mnemonics.find((item) => item.id === mnemonicIds[0]);
  assert.equal(mnemonic.phrases.length, 4);
  assert.equal(mnemonic.questionIds.length, 5);
  assert.ok(mnemonic.excludes.some((item) => item.includes("具体机制")));
  mnemonic.phrases.forEach((phrase) => assert.deepEqual(phrase.questionIds, phrase.checks.map((check) => check.questionId)));
});

test("C5-5 enrolls only Q&A and mnemonic", () => {
  assert.ok(pack.entryPlans.revision >= 11);
  assert.ok(entryQuestions(content, "qa").length >= 83);
  assert.ok(entryQuestions(content, "mnemonic").length >= 75);
  assert.ok(entryMnemonics(content).length >= 19);
  assert.equal(entryQuestions(content, "daily").length, 47);
  assert.equal(entryQuestions(content, "confusion").length, 12);
  assert.equal(entryQuestions(content, "exam", "all", "selected").length, 49);
  questionIds.forEach((id) => {
    assert.ok(pack.entryPlans.modes.qa.questionIds.includes(id));
    assert.ok(pack.entryPlans.modes.mnemonic.questionIds.includes(id));
    assert.ok(!pack.entryPlans.modes.daily.questionIds.includes(id));
    assert.ok(!pack.entryPlans.modes.confusion.questionIds.includes(id));
    assert.ok(!pack.entryPlans.modes.exam.selectedQuestionIds.includes(id));
  });
});

test("C5-5 keeps its migration declaration and exact group", () => {
  const migration = pack.sessionMigrations.find((item) => item.fromVersion === "492636da");
  assert.ok(migration && migration.changedQuestionIds.every((id) => questionIds.includes(id)));
  const store = storage();
  const engine = createEngine(content, store, () => Date.parse("2026-10-21T15:01:00Z"));
  assert.equal(engine.start("qa", "economics", "selected", "", "market-failure-four-factors", 5).session.ids.length, 5);
});

test("review-only C5-5 resources stay closed in formal admission", () => {
  const formal = availableContent(body, pack, false);
  questionIds.forEach((id) => assert.ok(!formal.questions.some((item) => item.id === id)));
  targetIds.forEach((id) => assert.ok(!formal.targets.some((item) => item.id === id)));
  mnemonicIds.forEach((id) => assert.ok(!formal.mnemonics.some((item) => item.id === id)));
});

console.log(JSON.stringify({ passed: true, checks: reports.length, contentVersion: content.version, reports }, null, 2));
