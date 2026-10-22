#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-science-1");
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
const questions = pack.questions.filter((item) => ids.has(item.id));
assert.equal(questions.length, 8);
assert.ok(questions.every((item) => item.revision === 2 && item.status === "review"));
assert.deepEqual(Object.fromEntries(questions.map((item) => [item.id, item.answer])), {
  "sound-pitch": 0,
  "sound-loudness": 1,
  "sound-timbre": 2,
  "sound-pitch-timbre-scenario": 0,
  "sound-loudness-condition": 0,
  "light-shadow": 0,
  "light-reflection": 1,
  "light-refraction": 2,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 8);

for (const question of questions) {
  const specification = pack.questionSpecifications.find((item) => item.questionId === question.id);
  const relation = pack.targetRelations.questionTargets.find((item) => item.questionId === question.id);
  assert.ok(specification && relation);
  assert.equal(specification.checkPurpose, relation.checkPurpose);
  assert.equal(specification.cognitiveLevel, q2.cognitiveLevels[question.id]);
  assert.deepEqual(Object.keys(specification.distractorReasons).map(Number).sort(),
    question.options.map((_, index) => index).filter((index) => index !== question.answer));
  assert.ok(Object.values(specification.distractorReasons).every((reason) => reason.length >= 12));
  const lengths = question.options.map((option) => Array.from(option).length);
  assert.ok(!lengths.filter((_, index) => index !== question.answer).every((length) => lengths[question.answer] > length));
}

for (const targetId of Object.keys(q2.targetRows)) {
  const target = pack.targets.find((item) => item.id === targetId);
  const variation = pack.variationDecisions.find((item) => item.targetId === targetId);
  assert.equal(target.revision, 2);
  assert.deepEqual(variation.directQuestionIds, q2.variationRows[targetId].directQuestionIds);
  assert.deepEqual(variation.variationQuestionIds, q2.variationRows[targetId].variationQuestionIds);
  assert.ok(variation.processDifference.length >= 20);
}

assert.equal(q2.questionDispositions.length, 8);
assert.ok(q2.questionDispositions.every((item) => item.decision === "rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map((item) => item.decision),
  ["structural-mnemonic-candidate", "retain-as-study-outline"]);

const soundGroup = pack.groups.find((item) => item.id === "sound-features");
const lightGroup = pack.groups.find((item) => item.id === "light-phenomena");
const soundMnemonic = pack.mnemonics.find((item) => item.id === "sound-memory");
const lightMnemonic = pack.mnemonics.find((item) => item.id === "light-phenomena-memory");
assert.equal(soundGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(lightGroup.mnemonicDecision, "study-outline");
assert.equal(soundMnemonic.revision, 3);
assert.equal(soundMnemonic.text, "调高低，看频率；响强弱，看振幅；辨来源，看音色。");
assert.equal(soundMnemonic.method, "平行对应");
assert.equal(soundMnemonic.learningForm, "structural-mnemonic");
assert.equal(soundMnemonic.formLabel, "结构口诀");
assert.ok(soundMnemonic.phrases.every((item) => item.coverageType.startsWith("structural-correspondence")));
assert.equal(lightMnemonic.revision, 3);
assert.equal(lightMnemonic.title, "三类光现象对照");
assert.equal(lightMnemonic.text, "影子看直线，倒影看反射，折筷看折射。");
assert.equal(lightMnemonic.learningForm, "study-outline");
assert.equal(lightMnemonic.formLabel, "速记提纲");
assert.ok(lightMnemonic.phrases.every((item) => item.coverageType === "study-outline-reference"));

const soundComparison = pack.comparisons.find((item) => item.id === "sound-features-comparison");
assert.equal(soundComparison.revision, 2);
assert.deepEqual(soundComparison.questionIds,
  ["sound-pitch-timbre-scenario", "sound-loudness-condition", "sound-timbre"]);

const quality = auditPack(pack);
const targetedViolations = {};
for (const rule of quality.rules) {
  const rows = rule.sampleViolations.filter((item) => ids.has(item.entityId));
  if (rows.length) targetedViolations[rule.id] = rows;
}
assert.deepEqual(targetedViolations, {}, "Q2 科技第一批八题不得命中题目质量规则");

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(q2.QUESTION_IDS.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "sound-memory" && item.formLabel === "结构口诀"));
assert.ok(entryMnemonics(development, "science-technology").some((item) =>
  item.id === "light-phenomena-memory" && item.formLabel === "速记提纲"));

const result = {
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: soundGroup.id, title: soundGroup.title, questions: 5, mnemonicDecision: soundGroup.mnemonicDecision },
    { id: lightGroup.id, title: lightGroup.title, questions: 3, mnemonicDecision: lightGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 8,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      sound: { revision: soundMnemonic.revision, classification: soundMnemonic.learningForm, memoryTrialEvidence: false },
      light: { revision: lightMnemonic.revision, classification: lightMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: {
    qaQuestions: entryQuestions(development, "qa").length,
    formalQuestions: formal.questions.length,
  },
  nextTask: "Q2-science-heat-and-substance-completed",
};

console.log(JSON.stringify(result, null, 2));
