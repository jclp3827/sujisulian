#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-science-3");
const { compile } = require("./build-common-sense-learning");
const { auditPack } = require("./lib/common-sense-content-quality-gate");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

assert.deepEqual(compile(authored, body), pack);
assert.equal(pack.version, "2026-10-22.72");
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
  "si-base-count": 1,
  "si-length-mass-time": 0,
  "si-current-temperature": 1,
  "si-amount-luminous": 0,
  "si-base-full-contrast": 0,
  "si-derived-frequency-force": 0,
  "si-derived-pressure-energy": 1,
  "si-derived-power-charge": 2,
  "si-derived-voltage-resistance": 1,
  "si-derived-full-contrast": 2,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 10);

for (const question of questions) {
  const specification = pack.questionSpecifications.find((item) => item.questionId === question.id);
  const relation = pack.targetRelations.questionTargets.find((item) => item.questionId === question.id);
  assert.ok(specification && relation);
  assert.equal(specification.checkPurpose, "q2-unit-application");
  assert.equal(specification.checkPurpose, relation.checkPurpose);
  assert.equal(specification.cognitiveLevel, q2.cognitiveLevels[question.id]);
  assert.deepEqual(Object.keys(specification.distractorReasons).map(Number).sort(),
    question.options.map((_, index) => index).filter((index) => index !== question.answer));
  assert.ok(Object.values(specification.distractorReasons).every((reason) => reason.length >= 10));
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
  ["retain-as-study-outline", "retain-as-study-outline"]);

const baseGroup = pack.groups.find((item) => item.id === "si-base-units");
const derivedGroup = pack.groups.find((item) => item.id === "si-named-derived-units");
const baseMnemonic = pack.mnemonics.find((item) => item.id === "si-base-units-memory");
const derivedMnemonic = pack.mnemonics.find((item) => item.id === "si-named-derived-memory");
assert.equal(baseGroup.mnemonicDecision, "study-outline");
assert.equal(derivedGroup.mnemonicDecision, "study-outline");
assert.equal(baseMnemonic.revision, 3);
assert.equal(baseMnemonic.title, "七个基本单位顺序表");
assert.equal(baseMnemonic.text, "长质时：米、千克、秒；流温量光：安培、开尔文、摩尔、坎德拉。");
assert.equal(baseMnemonic.method, "物理量分组对照");
assert.equal(baseMnemonic.learningForm, "study-outline");
assert.equal(baseMnemonic.formLabel, "速记提纲");
assert.ok(baseMnemonic.phrases.every((item) => item.coverageType === "study-outline-reference"));
assert.equal(derivedMnemonic.revision, 2);
assert.equal(derivedMnemonic.title, "八个具名导出单位对照");
assert.equal(derivedMnemonic.text, "频率—赫兹，力—牛顿；压强—帕斯卡，能量—焦耳；功率—瓦特，电量—库仑；电压—伏特，电阻—欧姆。");
assert.equal(derivedMnemonic.method, "四组对照");
assert.equal(derivedMnemonic.learningForm, "study-outline");
assert.equal(derivedMnemonic.formLabel, "速记提纲");
assert.ok(derivedMnemonic.phrases.every((item) => item.coverageType === "study-outline-reference"));

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
assert.deepEqual(targetedViolations, {}, "Q2 科技第三批十题不得命中题目质量规则");

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(q2.QUESTION_IDS.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "si-base-units-memory" && item.formLabel === "速记提纲"));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "si-named-derived-memory" && item.formLabel === "速记提纲"));

const result = {
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: baseGroup.id, title: baseGroup.title, questions: 5, mnemonicDecision: baseGroup.mnemonicDecision },
    { id: derivedGroup.id, title: derivedGroup.title, questions: 5, mnemonicDecision: derivedGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 10,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      baseUnits: { revision: baseMnemonic.revision, classification: baseMnemonic.learningForm, memoryTrialEvidence: false },
      namedDerivedUnits: { revision: derivedMnemonic.revision, classification: derivedMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: {
    qaQuestions: entryQuestions(development, "qa").length,
    formalQuestions: formal.questions.length,
  },
  nextTask: "Q2-science-optics-basics-and-infrared-ultraviolet",
};

console.log(JSON.stringify(result, null, 2));
