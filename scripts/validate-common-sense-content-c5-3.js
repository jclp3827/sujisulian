#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const source = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const c53 = require("../docs/knowledge-platform/content/common-sense-content-c5-3");
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
const groupIds = c53.groups.map((item) => item.id);
const questionIds = c53.addedQuestions.map((item) => item.id);
const targetIds = c53.targets.map((item) => item.id);
const mnemonicIds = c53.mnemonics.map((item) => item.id);

test("C5-3 remains compiled as two bounded five-question themes after later expansion", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.ok(pack.questions.length >= 73);
  assert.ok(pack.groups.length >= 19);
  assert.ok(pack.targets.length >= 31);
  assert.ok(pack.mnemonics.length >= 17);
  assert.deepEqual(groupIds, ["si-named-derived-units", "market-structure-four-types"]);
  groupIds.forEach((id) => assert.equal(pack.groups.find((item) => item.id === id).questionIds.length, 5));
  assert.ok(buildInventory(pack, body).totals.mappedDetailUnits >= 24);
});

test("C5-3 closes named derived units, records market structures and keeps one explicit next candidate", () => {
  const statuses = new Set(["待盘点", "可建设", "已建设", "合并复用", "不适合出题", "待补依据", "延期"]);
  assert.equal(c53.sourceDispositions.length, 3);
  c53.sourceDispositions.forEach((row) => {
    assert.ok(row.candidateId && row.pointId && row.tabIds.length && statuses.has(row.status) && row.scope);
    const point = body.points.find((item) => item.id === row.pointId);
    assert.ok(point && row.tabIds.every((id) => point.tabs.some((tab) => tab.id === id)));
    (row.relatedPointIds || []).forEach((id) => assert.ok(body.points.some((item) => item.id === id)));
    assert.ok(ledger.entries.some((entry) => entry.candidateId === row.candidateId && entry.status === row.status && entry.batch === row.batch));
  });
  assert.equal(ledger.directory.totalDetailUnits, 170);
  assert.ok(ledger.directory.detailUnitsWithPartialQuestionCoverage >= 24);
  assert.equal(ledger.exitAssessment.decision, "continue-c5-n");
});

test("every C5-3 target has direct and variation checks with complete distractor reasons", () => {
  for (const targetId of targetIds) {
    const decision = pack.variationDecisions.find((item) => item.targetId === targetId);
    assert.ok(decision && decision.directQuestionIds.length && decision.variationQuestionIds.length);
  }
  for (const questionId of questionIds) {
    const question = pack.questions.find((item) => item.id === questionId);
    const spec = pack.questionSpecifications.find((item) => item.questionId === questionId);
    assert.ok(question && spec);
    assert.deepEqual(Object.keys(spec.distractorReasons).map(Number).sort(),
      question.options.map((_, index) => index).filter((index) => index !== question.answer));
  }
});

test("both C5-3 mnemonics are bounded five-question packages with phrase review anchors", () => {
  for (const mnemonicId of mnemonicIds) {
    const mnemonic = pack.mnemonics.find((item) => item.id === mnemonicId);
    assert.equal(mnemonic.questionIds.length, 5);
    assert.ok(mnemonic.purpose && mnemonic.conditions.length && mnemonic.excludes.length);
    mnemonic.phrases.forEach((phrase) => {
      assert.ok(phrase.id && phrase.targetIds.length && phrase.checks.length);
      assert.deepEqual(phrase.questionIds, phrase.checks.map((check) => check.questionId));
    });
  }
});

test("C5-3 enrolls only Q&A and mnemonic while daily, confusion and exam pools remain unchanged", () => {
  assert.ok(pack.entryPlans.revision >= 9);
  assert.ok(entryQuestions(content, "qa").length >= 73);
  assert.ok(entryQuestions(content, "mnemonic").length >= 65);
  assert.ok(entryMnemonics(content).length >= 17);
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

test("C5-3 retains its one-time migration declaration and both five-question groups", () => {
  const migration = c53.sessionMigrations[0];
  assert.equal(migration.fromVersion, "e63570f2");
  assert.equal(migration.toPackVersion, "2026-10-21.7");
  assert.deepEqual(migration.changedQuestionIds, questionIds);
  assert.deepEqual(migration.changedMnemonicIds, mnemonicIds);
  const engine = createEngine(content, storage(), () => Date.parse("2026-10-21T13:01:00Z"));
  assert.equal(engine.start("qa", "science-technology", "selected", "", "si-named-derived-units", 5).session.ids.length, 5);
  assert.equal(engine.start("qa", "economics", "selected", "", "market-structure-four-types", 5).session.ids.length, 5);
});

test("review-only C5-3 resources stay closed in formal admission", () => {
  const formal = availableContent(body, pack, false);
  questionIds.forEach((id) => assert.ok(!formal.questions.some((item) => item.id === id)));
  targetIds.forEach((id) => assert.ok(!formal.targets.some((item) => item.id === id)));
  mnemonicIds.forEach((id) => assert.ok(!formal.mnemonics.some((item) => item.id === id)));
});

console.log(JSON.stringify({ passed: true, checks: reports.length, contentVersion: content.version, reports }, null, 2));
