#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-science-5");
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
  "light-straight-condition-core": 1,
  "light-straight-examples-core": 1,
  "light-reflection-definition-core": 2,
  "specular-diffuse-core": 0,
  "propagation-reflection-full": 0,
  "light-refraction-definition-core": 0,
  "lens-mirror-functions-core": 2,
  "total-reflection-core": 1,
  "light-scattering-core": 0,
  "refraction-scattering-full": 1,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 10);

for (const question of questions) {
  const specification = pack.questionSpecifications.find((item) => item.questionId === question.id);
  const relation = pack.targetRelations.questionTargets.find((item) => item.questionId === question.id);
  assert.ok(specification && relation);
  assert.equal(specification.checkPurpose, "q2-optics-mechanism-application");
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
  ["structural-mnemonic-candidate", "retain-as-study-outline"]);

const reflectionGroup = pack.groups.find((item) => item.id === "optics-propagation-reflection");
const refractionGroup = pack.groups.find((item) => item.id === "optics-refraction-scattering");
const reflectionMnemonic = pack.mnemonics.find((item) => item.id === "propagation-reflection-memory");
const refractionMnemonic = pack.mnemonics.find((item) => item.id === "refraction-scattering-memory");
assert.equal(reflectionGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(refractionGroup.mnemonicDecision, "study-outline");
assert.equal(reflectionMnemonic.revision, 2);
assert.equal(reflectionMnemonic.title, "直行返回画面诀");
assert.equal(reflectionMnemonic.method, "连续画面＋表面对照");
assert.equal(reflectionMnemonic.learningForm, "structural-mnemonic");
assert.equal(reflectionMnemonic.formLabel, "结构口诀");
assert.ok(reflectionMnemonic.text.includes("光滑排队返，粗糙散开来"));
assert.ok(reflectionMnemonic.phrases.every((item) => item.coverageType === "structural-scene-with-boundary"));
assert.equal(refractionMnemonic.revision, 3);
assert.equal(refractionMnemonic.title, "折射相关四栏对照");
assert.equal(refractionMnemonic.method, "条件—器件—应用四栏对照");
assert.equal(refractionMnemonic.learningForm, "study-outline");
assert.equal(refractionMnemonic.formLabel, "速记提纲");
assert.ok(refractionMnemonic.phrases.every((item) => item.coverageType === "study-outline-reference"));

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
assert.deepEqual(targetedViolations, {}, "Q2 科技第五批十题不得命中题目质量规则");

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(q2.QUESTION_IDS.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "propagation-reflection-memory" && item.formLabel === "结构口诀"));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "refraction-scattering-memory" && item.formLabel === "速记提纲"));

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: reflectionGroup.id, title: reflectionGroup.title, questions: 5, mnemonicDecision: reflectionGroup.mnemonicDecision },
    { id: refractionGroup.id, title: refractionGroup.title, questions: 5, mnemonicDecision: refractionGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 10,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      propagationReflection: { revision: reflectionMnemonic.revision, classification: reflectionMnemonic.learningForm, memoryTrialEvidence: false },
      refractionScattering: { revision: refractionMnemonic.revision, classification: refractionMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: { qaQuestions: entryQuestions(development, "qa").length, formalQuestions: formal.questions.length },
  nextTask: "Q2-science-optics-life-phenomena-and-colors",
}, null, 2));
