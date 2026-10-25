#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-science-6");
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
  "mirage-alias-core": 2,
  "mirage-cause-core": 1,
  "mirage-image-core": 0,
  "mirage-locations-core": 2,
  "mirage-full": 1,
  "rainbow-cause-core": 0,
  "rainbow-order-core": 2,
  "secondary-rainbow-core": 1,
  "rainbow-sun-position-core": 0,
  "rainbow-secondary-full": 2,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 10);

for (const question of questions) {
  const specification = pack.questionSpecifications.find((item) => item.questionId === question.id);
  const relation = pack.targetRelations.questionTargets.find((item) => item.questionId === question.id);
  assert.ok(specification && relation);
  assert.equal(specification.checkPurpose, "q2-optics-life-phenomena");
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
  ["retain-as-study-outline", "structural-mnemonic-candidate"]);

const mirageGroup = pack.groups.find((item) => item.id === "optics-mirage");
const rainbowGroup = pack.groups.find((item) => item.id === "optics-rainbow-secondary");
const mirageMnemonic = pack.mnemonics.find((item) => item.id === "mirage-memory");
const rainbowMnemonic = pack.mnemonics.find((item) => item.id === "rainbow-secondary-memory");
assert.equal(mirageGroup.mnemonicDecision, "study-outline");
assert.equal(rainbowGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(mirageMnemonic.revision, 2);
assert.equal(mirageMnemonic.title, "蜃景四项核对");
assert.equal(mirageMnemonic.method, "名称—成因—像—环境四栏对照");
assert.equal(mirageMnemonic.learningForm, "study-outline");
assert.equal(mirageMnemonic.formLabel, "速记提纲");
assert.ok(mirageMnemonic.phrases.every((item) => item.coverageType === "study-outline-reference"));
assert.equal(rainbowMnemonic.revision, 2);
assert.equal(rainbowMnemonic.title, "虹霓内外方位诀");
assert.equal(rainbowMnemonic.method, "雨滴画面＋内外明暗对照＋相反方位");
assert.equal(rainbowMnemonic.learningForm, "structural-mnemonic");
assert.equal(rainbowMnemonic.formLabel, "结构口诀");
assert.ok(rainbowMnemonic.text.includes("太阳在背，虹在对面"));
assert.ok(rainbowMnemonic.phrases.every((item) => item.coverageType === "structural-scene-with-boundary"));

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
assert.deepEqual(targetedViolations, {}, "Q2 科技第六批十题不得命中题目质量规则");

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(q2.QUESTION_IDS.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "mirage-memory" && item.formLabel === "速记提纲"));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "rainbow-secondary-memory" && item.formLabel === "结构口诀"));

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: mirageGroup.id, title: mirageGroup.title, questions: 5, mnemonicDecision: mirageGroup.mnemonicDecision },
    { id: rainbowGroup.id, title: rainbowGroup.title, questions: 5, mnemonicDecision: rainbowGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 10,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      mirage: { revision: mirageMnemonic.revision, classification: mirageMnemonic.learningForm, memoryTrialEvidence: false },
      rainbowSecondary: { revision: rainbowMnemonic.revision, classification: rainbowMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: { qaQuestions: entryQuestions(development, "qa").length, formalQuestions: formal.questions.length },
  nextTask: "Q2-science-primary-colors-and-object-colors",
}, null, 2));
