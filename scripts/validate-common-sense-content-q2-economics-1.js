#!/usr/bin/env node
"use strict";
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-economics-1");
const { compile } = require("./build-common-sense-learning");
const { auditPack } = require("./lib/common-sense-content-quality-gate");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

assert.deepEqual(compile(authored, body), pack);
assert.equal(pack.version, "2026-10-23.97");
assert.deepEqual(
  { questions: pack.questions.length, targets: pack.targets.length, groups: pack.groups.length, mnemonics: pack.mnemonics.length },
  { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
);

const ids = new Set(q2.QUESTION_IDS);
const targetIds = new Set(Object.keys(q2.targetRows));
const questions = pack.questions.filter((item) => ids.has(item.id));
assert.equal(questions.length, 8);
assert.ok(questions.every((item) => item.revision === 2 && item.status === "review"));
assert.deepEqual(Object.fromEntries(questions.map((item) => [item.id, item.answer])), {
  "fx-direct": 1,
  "fx-indirect": 2,
  "fx-context": 0,
  "fx-direct-scenario": 1,
  "fx-indirect-scenario": 2,
  "demand-conditions": 1,
  "supply-conditions": 2,
  "demand-wish": 0,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 8);
for (const item of questions) {
  const spec = pack.questionSpecifications.find((value) => value.questionId === item.id);
  const relation = pack.targetRelations.questionTargets.find((value) => value.questionId === item.id);
  assert.ok(spec && relation);
  assert.equal(spec.checkPurpose, "q2-economics-role-condition");
  assert.equal(spec.checkPurpose, relation.checkPurpose);
  assert.equal(spec.cognitiveLevel, q2.cognitiveLevels[item.id]);
  assert.deepEqual(
    Object.keys(spec.distractorReasons).map(Number).sort(),
    item.options.map((_, index) => index).filter((index) => index !== item.answer),
  );
  assert.ok(Object.values(spec.distractorReasons).every((value) => value.length >= 12));
  const lengths = item.options.map((value) => Array.from(value).length);
  assert.ok(!lengths.filter((_, index) => index !== item.answer).every((length) => lengths[item.answer] > length));
  assert.ok(!item.prompt.includes("正文") && !item.explanation.includes("正文") && !item.boundary.includes("正文"));
}

for (const id of targetIds) {
  const target = pack.targets.find((item) => item.id === id);
  const variation = pack.variationDecisions.find((item) => item.targetId === id);
  assert.equal(target.revision, 2);
  assert.deepEqual(variation.directQuestionIds, q2.variationRows[id].directQuestionIds);
  assert.deepEqual(variation.variationQuestionIds, q2.variationRows[id].variationQuestionIds);
  assert.ok(variation.processDifference.length >= 20);
}
assert.equal(q2.questionDispositions.length, 8);
assert.ok(q2.questionDispositions.every((item) => item.decision === "rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map((item) => item.decision), ["structural-mnemonic-candidate", "structural-mnemonic-candidate"]);

const fxGroup = pack.groups.find((item) => item.id === "fx-quotation");
const demandGroup = pack.groups.find((item) => item.id === "demand-supply-roles");
const fxMnemonic = pack.mnemonics.find((item) => item.id === "fx-memory");
const demandMnemonic = pack.mnemonics.find((item) => item.id === "demand-supply-roles-memory");
assert.equal(fxGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(demandGroup.mnemonicDecision, "structural-mnemonic");
assert.deepEqual([fxMnemonic.revision, fxMnemonic.title, fxMnemonic.learningForm, fxMnemonic.formLabel], [3, "本外基准判断诀", "structural-mnemonic", "结构口诀"]);
assert.equal(fxMnemonic.method, "先确定本外币身份，再按固定基准分流");
assert.ok(fxMnemonic.text.includes("先认本外") && fxMnemonic.text.includes("固定本币是间接"));
assert.ok(fxMnemonic.phrases.every((item) => item.coverageType === "structural-decision-with-boundary"));
assert.deepEqual([demandMnemonic.revision, demandMnemonic.title, demandMnemonic.learningForm, demandMnemonic.formLabel], [3, "买卖双条件判断诀", "structural-mnemonic", "结构口诀"]);
assert.equal(demandMnemonic.method, "先锁时期价格，再分买卖角色，最后核对意愿和能力");
assert.ok(demandMnemonic.text.includes("消费者愿买且能买") && demandMnemonic.text.includes("生产者愿卖且能卖"));
assert.ok(demandMnemonic.phrases.every((item) => item.coverageType === "structural-role-and-condition"));

const targeted = {
  ...pack,
  questions,
  targets: pack.targets.filter((item) => targetIds.has(item.id)),
  targetRelations: { ...pack.targetRelations, questionTargets: pack.targetRelations.questionTargets.filter((item) => ids.has(item.questionId)) },
  questionSpecifications: pack.questionSpecifications.filter((item) => ids.has(item.questionId)),
};
const quality = auditPack(targeted);
const targetedViolations = Object.fromEntries(quality.rules.filter((item) => item.violationCount > 0).map((item) => [item.id, item.sampleViolations]));
assert.deepEqual(targetedViolations, {});

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(q2.QUESTION_IDS.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === fxMnemonic.id && item.formLabel === "结构口诀"));
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === demandMnemonic.id && item.formLabel === "结构口诀"));

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: fxGroup.id, title: fxGroup.title, questions: 5, mnemonicDecision: fxGroup.mnemonicDecision },
    { id: demandGroup.id, title: demandGroup.title, questions: 3, mnemonicDecision: demandGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 8,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      fxQuotation: { revision: fxMnemonic.revision, classification: fxMnemonic.learningForm, memoryTrialEvidence: false },
      demandSupplyRoles: { revision: demandMnemonic.revision, classification: demandMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: { qaQuestions: entryQuestions(development, "qa").length, formalQuestions: formal.questions.length },
  nextTask: "Q2-economics-2-selection",
}, null, 2));
