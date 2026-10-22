#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const source = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const c5 = require("../docs/knowledge-platform/content/common-sense-content-c5-1");
const { compile } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");
const { createEngine } = require("../miniprogram/subpackages/common-sense/services/learning-engine");
const { STORAGE_KEY } = require("../miniprogram/services/common-sense-progress");

const clone = (value) => JSON.parse(JSON.stringify(value));
const results = [];
function test(name, fn) { fn(); results.push(name); }
function storage() {
  const data = {};
  return { data, getStorageSync: (key) => data[key] && clone(data[key]), setStorageSync: (key, value) => { data[key] = clone(value); } };
}

const content = availableContent(body, pack, true);
const topicIds = ["poet-titles", "fx-quotation"];
const newQuestionIds = c5.addedQuestions.map((item) => item.id);
const newTargetIds = c5.targets.map((item) => item.id);

test("C5-1 compiles exactly two bounded themes into the target contract", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.ok(pack.questions.length >= 53);
  assert.ok(pack.targets.length >= 15);
  assert.equal(c5.addedQuestions.length, 4);
  assert.equal(c5.targets.length, 6);
  assert.deepEqual([...new Set(c5.targets.map((item) => item.groupId))], topicIds);
  topicIds.forEach((id) => assert.equal(pack.groups.find((item) => item.id === id).questionIds.length, 5));
});

test("each C5-1 target has direct and variation checks with complete distractor reasons", () => {
  for (const targetId of newTargetIds) {
    const decision = pack.variationDecisions.find((item) => item.targetId === targetId);
    assert.ok(decision && decision.directQuestionIds.length && decision.variationQuestionIds.length);
  }
  for (const question of pack.questions.filter((item) => topicIds.includes(item.group))) {
    const spec = pack.questionSpecifications.find((item) => item.questionId === question.id);
    assert.ok(spec);
    assert.deepEqual(Object.keys(spec.distractorReasons).map(Number).sort(),
      question.options.map((_, index) => index).filter((index) => index !== question.answer));
  }
});

test("both legacy mnemonics are upgraded to five-question packages with phrase-level review anchors", () => {
  for (const mnemonicId of ["poet-memory", "fx-memory"]) {
    const mnemonic = pack.mnemonics.find((item) => item.id === mnemonicId);
    assert.equal(mnemonic.revision, 2);
    assert.equal(mnemonic.questionIds.length, 5);
    assert.ok(mnemonic.purpose && mnemonic.conditions.length);
    mnemonic.phrases.forEach((phrase) => {
      assert.ok(phrase.id && phrase.targetIds.length && phrase.checks.length);
      assert.deepEqual(phrase.questionIds, phrase.checks.map((check) => check.questionId));
    });
  }
});

test("C5-1 enrolls new questions only in Q&A and mnemonic, leaving other entry pools unchanged", () => {
  assert.ok(pack.entryPlans.revision >= 7);
  assert.ok(entryQuestions(content, "qa").length >= 53);
  assert.ok(entryQuestions(content, "mnemonic").length >= 45);
  assert.equal(entryQuestions(content, "daily").length, 47);
  assert.equal(entryQuestions(content, "confusion").length, 12);
  assert.equal(entryQuestions(content, "exam", "all", "selected").length, 49);
  newQuestionIds.forEach((id) => {
    assert.ok(pack.entryPlans.modes.qa.questionIds.includes(id));
    assert.ok(pack.entryPlans.modes.mnemonic.questionIds.includes(id));
    assert.ok(!pack.entryPlans.modes.daily.questionIds.includes(id));
    assert.ok(!pack.entryPlans.modes.exam.selectedQuestionIds.includes(id));
  });
});

test("C5-1 retains its one-time migration declaration for unchanged Q&A and changed mnemonics", () => {
  const migration = c5.sessionMigrations[0];
  assert.equal(migration.fromVersion, "d115fffa");
  assert.equal(migration.toPackVersion, "2026-10-21.5");
  assert.deepEqual(migration.changedQuestionIds, []);
  assert.deepEqual(migration.changedMnemonicIds.sort(), ["fx-memory", "poet-memory"]);
});

test("review-only C5-1 resources stay closed in formal admission", () => {
  const formal = availableContent(body, pack, false);
  newQuestionIds.forEach((id) => assert.ok(!formal.questions.some((item) => item.id === id)));
  newTargetIds.forEach((id) => assert.ok(!formal.targets.some((item) => item.id === id)));
});

console.log(JSON.stringify({ passed: true, checks: results.length, contentVersion: content.version, reports: results }, null, 2));
