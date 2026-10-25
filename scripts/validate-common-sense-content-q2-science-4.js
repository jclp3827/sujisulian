#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-science-4");
const { compile } = require("./build-common-sense-learning");
const { auditPack } = require("./lib/common-sense-content-quality-gate");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

assert.deepEqual(compile(authored, body), pack);
assert.equal(pack.version, "2026-10-23.96");
assert.deepEqual(
  { questions: pack.questions.length, targets: pack.targets.length, groups: pack.groups.length, mnemonics: pack.mnemonics.length },
  { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
);

const ids = new Set(q2.QUESTION_IDS);
const targetIds = new Set(Object.keys(q2.targetRows));
const questions = pack.questions.filter((item) => ids.has(item.id));
assert.equal(questions.length, 10);
assert.ok(questions.every((item) => item.revision === 2 && item.status === "review"));
assert.deepEqual(Object.fromEntries(questions.map((item) => [item.id, item.answer])), {
  "light-electromagnetic-core": 1,
  "light-year-core": 0,
  "visible-light-core": 2,
  "visible-order-core": 1,
  "light-basics-full": 2,
  "infrared-wavelength-core": 0,
  "infrared-applications-core": 2,
  "ultraviolet-wavelength-core": 1,
  "ultraviolet-applications-core": 0,
  "infrared-ultraviolet-full": 2,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 10);

for (const question of questions) {
  const specification = pack.questionSpecifications.find((item) => item.questionId === question.id);
  const relation = pack.targetRelations.questionTargets.find((item) => item.questionId === question.id);
  assert.ok(specification && relation);
  assert.equal(specification.checkPurpose, "q2-optics-application");
  assert.equal(specification.checkPurpose, relation.checkPurpose);
  assert.equal(specification.cognitiveLevel, q2.cognitiveLevels[question.id]);
  assert.deepEqual(Object.keys(specification.distractorReasons).map(Number).sort(),
    question.options.map((_, index) => index).filter((index) => index !== question.answer));
  assert.ok(Object.values(specification.distractorReasons).every((reason) => reason.length >= 12));
  const lengths = question.options.map((option) => Array.from(option).length);
  assert.ok(!lengths.filter((_, index) => index !== question.answer).every((length) => lengths[question.answer] > length));
}

for (const targetId of targetIds) {
  const target = pack.targets.find((item) => item.id === targetId);
  const variation = pack.variationDecisions.find((item) => item.targetId === targetId);
  assert.equal(target.revision, 2);
  assert.deepEqual(variation.directQuestionIds, q2.variationRows[targetId].directQuestionIds);
  assert.deepEqual(variation.variationQuestionIds, q2.variationRows[targetId].variationQuestionIds);
  assert.ok(variation.processDifference.length >= 20);
}

assert.equal(q2.questionDispositions.length, 10);
assert.ok(q2.questionDispositions.every((item) => item.decision === "rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map((item) => item.decision),
  ["structural-mnemonic-candidate", "structural-mnemonic-candidate"]);

const basicGroup = pack.groups.find((item) => item.id === "optics-light-basics");
const invisibleGroup = pack.groups.find((item) => item.id === "optics-infrared-ultraviolet");
const basicMnemonic = pack.mnemonics.find((item) => item.id === "light-basics-memory");
const invisibleMnemonic = pack.mnemonics.find((item) => item.id === "infrared-ultraviolet-memory");
assert.equal(basicGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(invisibleGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(basicMnemonic.revision, 2);
assert.equal(basicMnemonic.title, "光学基础四步诀");
assert.equal(basicMnemonic.text, "光是电磁波，光年量长途；人眼见七色，红到紫：波越短、频越高。");
assert.equal(basicMnemonic.method, "长途意象＋方向对照");
assert.equal(basicMnemonic.learningForm, "structural-mnemonic");
assert.equal(basicMnemonic.formLabel, "结构口诀");
assert.ok(basicMnemonic.phrases.every((item) => item.coverageType === "structural-correspondence-with-boundary"));
assert.equal(invisibleMnemonic.revision, 2);
assert.equal(invisibleMnemonic.title, "红紫两端对照诀");
assert.equal(invisibleMnemonic.text, "红外在红外：长波不见，探测、遥控、热成像和加热；紫外在紫外：短波不见，杀菌、验钞、维D，臭氧拦。");
assert.equal(invisibleMnemonic.method, "光谱位置＋双边对照");
assert.equal(invisibleMnemonic.learningForm, "structural-mnemonic");
assert.equal(invisibleMnemonic.formLabel, "结构口诀");
assert.ok(invisibleMnemonic.phrases.every((item) => item.coverageType === "structural-correspondence-with-boundary"));

const targetedPack = {
  ...pack,
  questions,
  targets: pack.targets.filter((item) => targetIds.has(item.id)),
  targetRelations: {
    ...pack.targetRelations,
    questionTargets: pack.targetRelations.questionTargets.filter((item) => ids.has(item.questionId)),
  },
  questionSpecifications: pack.questionSpecifications.filter((item) => ids.has(item.questionId)),
};
const quality = auditPack(targetedPack);
const targetedViolations = Object.fromEntries(quality.rules
  .filter((rule) => rule.violationCount > 0)
  .map((rule) => [rule.id, rule.sampleViolations]));
assert.deepEqual(targetedViolations, {}, "Q2 科技第四批十题不得命中题目质量规则");

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(q2.QUESTION_IDS.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "light-basics-memory" && item.formLabel === "结构口诀"));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "infrared-ultraviolet-memory" && item.formLabel === "结构口诀"));

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: basicGroup.id, title: basicGroup.title, questions: 5, mnemonicDecision: basicGroup.mnemonicDecision },
    { id: invisibleGroup.id, title: invisibleGroup.title, questions: 5, mnemonicDecision: invisibleGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 10,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      lightBasics: { revision: basicMnemonic.revision, classification: basicMnemonic.learningForm, memoryTrialEvidence: false },
      infraredUltraviolet: { revision: invisibleMnemonic.revision, classification: invisibleMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: { qaQuestions: entryQuestions(development, "qa").length, formalQuestions: formal.questions.length },
  nextTask: "Q2-science-optics-propagation-reflection-and-refraction-scattering",
}, null, 2));
