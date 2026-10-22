#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-law-2");
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
assert.equal(questions.length, 6);
assert.ok(questions.every((item) => item.revision === 2 && item.status === "review" &&
  item.verification.checkedAt === "2026-10-22" && item.verification.sourceIds.length === 1));
assert.deepEqual(questions.map((item) => item.answer), [2, 0, 1, 0, 1, 2]);
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 6);

for (const question of questions) {
  const specification = pack.questionSpecifications.find((item) => item.questionId === question.id);
  const relation = pack.targetRelations.questionTargets.find((item) => item.questionId === question.id);
  assert.ok(specification && relation);
  assert.equal(specification.checkPurpose, relation.checkPurpose);
  assert.equal(specification.cognitiveLevel, q2.cognitiveLevels[question.id]);
  assert.deepEqual(Object.keys(specification.distractorReasons).map(Number).sort(),
    question.options.map((_, index) => index).filter((index) => index !== question.answer));
  assert.ok(Object.values(specification.distractorReasons).every((reason) => reason.length >= 12));
  const target = pack.targets.find((item) => item.id === specification.primaryTargetIds[0]);
  const variation = pack.variationDecisions.find((item) => item.targetId === target.id);
  assert.equal(target.revision, 2);
  assert.equal(target.verification.checkedAt, "2026-10-22");
  assert.deepEqual(variation.directQuestionIds, [question.id]);
  assert.equal(variation.variationQuestionIds.length, 2);
  assert.ok(variation.processDifference.length >= 20);
}

assert.equal(q2.questionDispositions.length, 6);
assert.ok(q2.questionDispositions.every((item) => item.decision === "rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map((item) => item.decision),
  ["not-suitable", "structural-mnemonic-candidate"]);

const civilGroup = pack.groups.find((item) => item.id === "civil-principles-compare");
const constitutionGroup = pack.groups.find((item) => item.id === "constitution-chapters");
const constitutionMnemonic = pack.mnemonics.find((item) => item.id === "constitution-chapters-memory");
const civilComparison = pack.comparisons.find((item) => item.id === "civil-principles-comparison");
assert.equal(civilGroup.mnemonicDecision, "not-suitable");
assert.equal(constitutionGroup.title, "宪法四章顺序");
assert.equal(constitutionGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(constitutionMnemonic.revision, 3);
assert.equal(constitutionMnemonic.title, "宪法四章顺序");
assert.equal(constitutionMnemonic.text, "一总二权义，三机构，四旗歌徽都。");
assert.equal(constitutionMnemonic.learningForm, "structural-mnemonic");
assert.equal(constitutionMnemonic.formLabel, "结构口诀");
assert.equal(constitutionMnemonic.verification.checkedAt, "2026-10-22");
assert.ok(constitutionMnemonic.phrases.every((item) => item.coverageType === "structural-sequence-recall"));
assert.equal(civilComparison.revision, 2);
assert.equal(civilComparison.verification.checkedAt, "2026-10-22");
assert.deepEqual(civilComparison.verification.sourceIds, ["civil-code-cac-general-provisions"]);

const quality = auditPack(pack);
const targetedViolations = {};
for (const rule of quality.rules) {
  const rows = rule.sampleViolations.filter((item) => ids.has(item.entityId));
  if (rows.length) targetedViolations[rule.id] = rows;
}
assert.deepEqual(targetedViolations, {}, "Q2 法律第二批六题不得命中题目质量规则");

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(q2.QUESTION_IDS.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));
assert.ok(entryMnemonics(development, "law").some((item) =>
  item.id === "constitution-chapters-memory" && item.formLabel === "结构口诀"));

const result = {
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: civilGroup.id, title: civilGroup.title, questions: 3, mnemonicDecision: civilGroup.mnemonicDecision },
    { id: constitutionGroup.id, title: constitutionGroup.title, questions: 3, mnemonicDecision: constitutionGroup.mnemonicDecision },
  ],
  sourceReview: {
    checkedAt: "2026-10-22",
    sourceIds: ["civil-code-cac-general-provisions", "constitution-locpg-2018"],
    locators: ["民法典第4—6条、第8条", "宪法目录：序言、第一至四章及第四章章名"],
  },
  qualityReview: {
    rewrittenQuestions: 6,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    civilComparisonRevision: civilComparison.revision,
    constitutionMnemonic: {
      revision: constitutionMnemonic.revision,
      classification: constitutionMnemonic.learningForm,
      text: constitutionMnemonic.text,
      memoryTrialEvidence: false,
    },
  },
  entryIsolation: {
    qaQuestions: entryQuestions(development, "qa").length,
    formalQuestions: formal.questions.length,
  },
  nextTask: "Q2-science-first-two-small-themes-completed",
};

console.log(JSON.stringify(result, null, 2));
