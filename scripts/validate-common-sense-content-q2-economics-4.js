#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-economics-4");
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
assert.equal(questions.length, 9);
assert.ok(questions.every((item) => item.revision === 2 && item.status === "review"));
assert.deepEqual(Object.fromEntries(questions.map((item) => [item.id, item.answer])), {
  "market-failure-factor-monopoly": 0,
  "market-failure-factor-externality": 1,
  "market-failure-factor-public-goods": 0,
  "market-failure-factor-information": 1,
  "market-failure-four-factors-full": 0,
  "market-failure-monopoly-definition": 0,
  "market-failure-monopoly-chain": 1,
  "market-failure-monopoly-remedy": 2,
  "market-failure-monopoly-full": 1,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 9);
for (const item of questions) {
  const spec = pack.questionSpecifications.find((value) => value.questionId === item.id);
  const relation = pack.targetRelations.questionTargets.find((value) => value.questionId === item.id);
  assert.ok(spec && relation);
  assert.equal(spec.checkPurpose, "q2-economics-market-failure");
  assert.equal(spec.checkPurpose, relation.checkPurpose);
  assert.equal(spec.cognitiveLevel, q2.cognitiveLevels[item.id]);
  assert.deepEqual(Object.keys(spec.distractorReasons).map(Number).sort(), item.options.map((_, index) => index).filter((index) => index !== item.answer));
  assert.ok(Object.values(spec.distractorReasons).every((value) => value.length >= 12));
  const lengths = item.options.map((value) => Array.from(value).length);
  assert.ok(!lengths.filter((_, index) => index !== item.answer).every((length) => lengths[item.answer] > length));
  assert.ok(![item.prompt, ...item.options, item.explanation, item.boundary].some((value) => /正文|本批|本节|按教材|原图|源文/u.test(value)));
}

for (const id of targetIds) {
  const target = pack.targets.find((item) => item.id === id);
  const variation = pack.variationDecisions.find((item) => item.targetId === id);
  assert.equal(target.revision, 2);
  assert.deepEqual(variation.directQuestionIds, q2.variationRows[id].directQuestionIds);
  assert.deepEqual(variation.variationQuestionIds, q2.variationRows[id].variationQuestionIds);
  assert.ok(variation.processDifference.length >= 20);
}
assert.equal(q2.questionDispositions.length, 9);
assert.ok(q2.questionDispositions.every((item) => item.decision === "rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map((item) => item.decision), ["study-outline-existing", "structural-mnemonic-candidate"]);

const overviewGroup = pack.groups.find((item) => item.id === "market-failure-four-factors");
const monopolyGroup = pack.groups.find((item) => item.id === "market-failure-monopoly-mechanism");
const overviewMnemonic = pack.mnemonics.find((item) => item.id === "market-failure-four-factors-memory");
const monopolyMnemonic = pack.mnemonics.find((item) => item.id === "market-failure-monopoly-memory");
assert.equal(overviewGroup.mnemonicDecision, "study-outline");
assert.equal(monopolyGroup.mnemonicDecision, "structural-mnemonic");
assert.deepEqual([overviewMnemonic.revision, overviewMnemonic.title, overviewMnemonic.learningForm, overviewMnemonic.formLabel], [3, "市场失灵四因素清单", "study-outline", "速记提纲"]);
assert.equal(overviewMnemonic.method, "两组完整术语对照：垄断与外部性，公共物品与信息不对称");
assert.ok(overviewMnemonic.text.includes("垄断、外部性") && overviewMnemonic.text.includes("公共物品、信息不对称"));
assert.ok(overviewMnemonic.phrases.every((item) => item.coverageType === "complete-term-list"));
assert.deepEqual(overviewMnemonic.phrases.map((item) => item.phrase), ["垄断", "外部性", "公共物品", "信息不对称"]);
assert.deepEqual([monopolyMnemonic.revision, monopolyMnemonic.title, monopolyMnemonic.learningForm, monopolyMnemonic.formLabel], [2, "控供—调量—影响价", "structural-mnemonic", "结构口诀"]);
assert.equal(monopolyMnemonic.method, "先还原控制供给到影响价格的作用链，再接限制价格和反垄断立法两项治理示例");
assert.ok(monopolyMnemonic.text.includes("控供、调量、影响价") && monopolyMnemonic.text.includes("限价、立法来约束"));
assert.ok(monopolyMnemonic.phrases.every((item) => item.coverageType === "structural-control-chain-and-remedy"));

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
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === overviewMnemonic.id && item.formLabel === "速记提纲"));
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === monopolyMnemonic.id && item.formLabel === "结构口诀"));

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: overviewGroup.id, title: overviewGroup.title, questions: 5, mnemonicDecision: overviewGroup.mnemonicDecision },
    { id: monopolyGroup.id, title: monopolyGroup.title, questions: 4, mnemonicDecision: monopolyGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 9,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      overview: { revision: overviewMnemonic.revision, classification: overviewMnemonic.learningForm, memoryTrialEvidence: false },
      monopoly: { revision: monopolyMnemonic.revision, classification: monopolyMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: { qaQuestions: entryQuestions(development, "qa").length, formalQuestions: formal.questions.length },
  nextTask: "Q2-economics-5-selection",
}, null, 2));
