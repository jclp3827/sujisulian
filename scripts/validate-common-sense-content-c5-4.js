#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const source = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const c54 = require("../docs/knowledge-platform/content/common-sense-content-c5-4");
const ledger = require("../docs/knowledge-platform/implementations/common-sense-content-c5-ledger.json");
const { compile, buildInventory } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");
const { createEngine } = require("../miniprogram/subpackages/common-sense/services/learning-engine");
const { STORAGE_KEY } = require("../miniprogram/services/common-sense-progress");

const clone = (value) => JSON.parse(JSON.stringify(value));
const reports = [];
function test(name, fn) { fn(); reports.push(name); }
function storage() {
  const data = {};
  return { data, getStorageSync: (key) => data[key] && clone(data[key]), setStorageSync: (key, value) => { data[key] = clone(value); } };
}

const content = availableContent(body, pack, true);
const questionIds = c54.addedQuestions.map((item) => item.id);
const targetIds = c54.targets.map((item) => item.id);
const mnemonicIds = c54.mnemonics.map((item) => item.id);

test("C5-4 remains present after later C5 batches", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.ok(pack.questions.length >= 78);
  assert.ok(pack.groups.length >= 20);
  assert.ok(pack.targets.length >= 35);
  assert.ok(pack.mnemonics.length >= 18);
  assert.deepEqual(c54.groups.map((item) => item.id), ["monopoly-price-discrimination"]);
  assert.equal(pack.groups.find((item) => item.id === "monopoly-price-discrimination").questionIds.length, 5);
  assert.ok(buildInventory(pack, body).totals.mappedDetailUnits >= 24);
});

test("C5-4 closes price discrimination and records market failure overview as the next buildable candidate", () => {
  const statuses = new Set(["待盘点", "可建设", "已建设", "合并复用", "不适合出题", "待补依据", "延期"]);
  assert.equal(c54.sourceDispositions.length, 2);
  c54.sourceDispositions.forEach((row) => {
    assert.ok(row.candidateId && row.pointId && row.tabIds.length && statuses.has(row.status) && row.scope);
    const point = body.points.find((item) => item.id === row.pointId);
    assert.ok(point && row.tabIds.every((id) => point.tabs.some((tab) => tab.id === id)));
    assert.ok(ledger.entries.some((entry) => entry.candidateId === row.candidateId &&
      (entry.batch === row.batch || row.candidateId === "market-failure-four-factors")));
  });
  assert.ok(ledger.directory.detailUnitsWithPartialQuestionCoverage >= 24);
  assert.equal(ledger.exitAssessment.decision, "continue-c5-n");
});

test("all four price-discrimination targets have direct and variation checks with complete distractor reasons", () => {
  targetIds.forEach((targetId) => {
    const decision = pack.variationDecisions.find((item) => item.targetId === targetId);
    assert.ok(decision && decision.directQuestionIds.length && decision.variationQuestionIds.length);
  });
  questionIds.forEach((questionId) => {
    const question = pack.questions.find((item) => item.id === questionId);
    const spec = pack.questionSpecifications.find((item) => item.questionId === questionId);
    assert.ok(question && spec);
    assert.deepEqual(Object.keys(spec.distractorReasons).map(Number).sort(),
      question.options.map((_, index) => index).filter((index) => index !== question.answer));
  });
});

test("the C5-4 mnemonic keeps definition conditions and all three levels in one five-question package", () => {
  const mnemonic = pack.mnemonics.find((item) => item.id === mnemonicIds[0]);
  assert.equal(mnemonic.questionIds.length, 5);
  assert.equal(mnemonic.phrases.length, 4);
  assert.ok(mnemonic.conditions.length && mnemonic.excludes.length);
  mnemonic.phrases.forEach((phrase) => {
    assert.ok(phrase.id && phrase.targetIds.length && phrase.checks.length);
    assert.deepEqual(phrase.questionIds, phrase.checks.map((check) => check.questionId));
  });
});

test("C5-4 enrolls only Q&A and mnemonic while daily, confusion and exam pools remain unchanged", () => {
  assert.ok(pack.entryPlans.revision >= 10);
  assert.ok(entryQuestions(content, "qa").length >= 78);
  assert.ok(entryQuestions(content, "mnemonic").length >= 70);
  assert.ok(entryMnemonics(content).length >= 18);
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

test("C5-4 keeps its migration declaration and exact group", () => {
  const migration = pack.sessionMigrations.find((item) => item.fromVersion === "3e34d010");
  assert.ok(migration && migration.changedQuestionIds.every((id) => questionIds.includes(id)));
  const engine = createEngine(content, storage(), () => Date.parse("2026-10-21T14:01:00Z"));
  assert.equal(engine.start("qa", "economics", "selected", "", "monopoly-price-discrimination", 5).session.ids.length, 5);
});

test("review-only C5-4 resources stay closed in formal admission", () => {
  const formal = availableContent(body, pack, false);
  questionIds.forEach((id) => assert.ok(!formal.questions.some((item) => item.id === id)));
  targetIds.forEach((id) => assert.ok(!formal.targets.some((item) => item.id === id)));
  mnemonicIds.forEach((id) => assert.ok(!formal.mnemonics.some((item) => item.id === id)));
});

console.log(JSON.stringify({ passed: true, checks: reports.length, contentVersion: content.version, reports }, null, 2));
