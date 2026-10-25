#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-science-2");
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
assert.equal(questions.length, 6);
assert.ok(questions.every((item) => item.revision === 2 && item.status === "review"));
assert.deepEqual(Object.fromEntries(questions.map((item) => [item.id, item.answer])), {
  "heat-conduction": 0,
  "heat-convection": 1,
  "heat-radiation": 2,
  "substance-pure": 0,
  "substance-simple": 1,
  "substance-compound": 2,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 6);

for (const question of questions) {
  const specification = pack.questionSpecifications.find((item) => item.questionId === question.id);
  const relation = pack.targetRelations.questionTargets.find((item) => item.questionId === question.id);
  assert.ok(specification && relation);
  assert.equal(specification.checkPurpose, "q2-application");
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

assert.equal(q2.questionDispositions.length, 6);
assert.ok(q2.questionDispositions.every((item) => item.decision === "rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map((item) => item.decision),
  ["structural-mnemonic-candidate", "structural-mnemonic-candidate"]);

const heatGroup = pack.groups.find((item) => item.id === "heat-mechanisms");
const substanceGroup = pack.groups.find((item) => item.id === "substance-classification");
const heatMnemonic = pack.mnemonics.find((item) => item.id === "heat-mechanisms-memory");
const substanceMnemonic = pack.mnemonics.find((item) => item.id === "substance-classification-memory");
assert.equal(heatGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(substanceGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(heatMnemonic.revision, 3);
assert.equal(heatMnemonic.title, "热量搬家三条路");
assert.equal(heatMnemonic.text, "热量搬家看路线：挨着递是传导，流体搬是对流，电磁送是辐射。");
assert.equal(heatMnemonic.method, "情境联想＋平行对应");
assert.equal(heatMnemonic.formLabel, "结构口诀");
assert.ok(heatMnemonic.phrases.every((item) => item.coverageType === "structural-correspondence-with-boundary"));
assert.equal(substanceMnemonic.revision, 3);
assert.equal(substanceMnemonic.title, "物质分类两步诀");
assert.equal(substanceMnemonic.text, "先数物质：一种纯，多种混；纯里数元素：一种单，多种化。");
assert.equal(substanceMnemonic.method, "两步决策＋对偶压缩");
assert.equal(substanceMnemonic.formLabel, "结构口诀");
assert.ok(substanceMnemonic.phrases.every((item) => item.coverageType.startsWith("structural-decision-step")));

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
assert.deepEqual(targetedViolations, {}, "Q2 科技第二批六题不得命中题目质量规则");

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(q2.QUESTION_IDS.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "heat-mechanisms-memory" && item.formLabel === "结构口诀"));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "substance-classification-memory" && item.formLabel === "结构口诀"));

const result = {
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: heatGroup.id, title: heatGroup.title, questions: 3, mnemonicDecision: heatGroup.mnemonicDecision },
    { id: substanceGroup.id, title: substanceGroup.title, questions: 3, mnemonicDecision: substanceGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 6,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      heat: { revision: heatMnemonic.revision, classification: heatMnemonic.learningForm, memoryTrialEvidence: false },
      substance: { revision: substanceMnemonic.revision, classification: substanceMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: {
    qaQuestions: entryQuestions(development, "qa").length,
    formalQuestions: formal.questions.length,
  },
  nextTask: "Q2-science-next-two-small-themes",
};

console.log(JSON.stringify(result, null, 2));
