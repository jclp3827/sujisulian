#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-law-1");
const { compile } = require("./build-common-sense-learning");
const { auditPack } = require("./lib/common-sense-content-quality-gate");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

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
assert.deepEqual(questions.map((item) => item.answer), [0, 1, 2, 1, 2, 0]);
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 6);

for (const question of questions) {
  const specification = pack.questionSpecifications.find((item) => item.questionId === question.id);
  const relation = pack.targetRelations.questionTargets.find((item) => item.questionId === question.id);
  assert.ok(specification && relation);
  assert.equal(specification.checkPurpose, relation.checkPurpose);
  assert.deepEqual(Object.keys(specification.distractorReasons).map(Number).sort(),
    question.options.map((_, index) => index).filter((index) => index !== question.answer));
  assert.ok(Object.values(specification.distractorReasons).every((reason) => reason.length >= 12));
  const target = pack.targets.find((item) => item.id === specification.primaryTargetIds[0]);
  const variation = pack.variationDecisions.find((item) => item.targetId === target.id);
  assert.equal(target.revision, 2);
  assert.deepEqual(variation.directQuestionIds, [question.id]);
  assert.equal(variation.variationQuestionIds.length, 2);
  assert.ok(variation.processDifference.length >= 20);
}

assert.equal(q2.questionDispositions.length, 6);
assert.ok(q2.questionDispositions.every((item) => item.decision === "rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map((item) => item.decision), ["not-suitable", "retain-as-study-outline"]);
const capacityGroup = pack.groups.find((item) => item.id === "minor-capacity");
const inheritanceGroup = pack.groups.find((item) => item.id === "inheritance-order");
const inheritanceMnemonic = pack.mnemonics.find((item) => item.id === "inheritance-order-memory");
assert.equal(capacityGroup.mnemonicDecision, "not-suitable");
assert.equal(inheritanceGroup.mnemonicDecision, "study-outline");
assert.equal(inheritanceMnemonic.revision, 3);
assert.equal(inheritanceMnemonic.learningForm, "study-outline");
assert.equal(inheritanceMnemonic.formLabel, "速记提纲");

const quality = auditPack(pack);
const targeted = quality.rules.flatMap((rule) => rule.sampleViolations
  .filter((item) => ids.has(item.entityId))
  .map((item) => ({ ruleId: rule.id, severity: rule.severity, ...item })));
assert.ok(targeted.every((item) => item.ruleId === "QG-ABSOLUTE-001" && item.severity === "warning"));
assert.deepEqual(targeted.map((item) => item.entityId).sort(), ["capacity-eight-plus", "capacity-under-eight"]);
assert.ok(targeted.every((item) => item.evidence.every((evidence) => evidence.tokens.length === 1 && evidence.tokens[0] === "完全")));

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(q2.QUESTION_IDS.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(q2.QUESTION_IDS.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));

const result = {
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: "minor-capacity", title: capacityGroup.title, questions: 3, mnemonicDecision: capacityGroup.mnemonicDecision },
    { id: "inheritance-order", title: inheritanceGroup.title, questions: 3, mnemonicDecision: inheritanceGroup.mnemonicDecision },
  ],
  sourceReview: {
    checkedAt: "2026-10-22",
    sourceIds: Object.keys(q2.verificationSources),
    locators: ["第13条、第17—20条", "第1127条、第1129条"],
  },
  qualityReview: {
    rewrittenQuestions: 6,
    questionErrors: targeted.filter((item) => item.severity === "error").length,
    manualWarnings: targeted.map((item) => ({ ruleId: item.ruleId, questionId: item.entityId, disposition: "法定术语“完全民事行为能力人”命中词面规则；不是靠极端措辞构造的弱干扰项，保留并记录人工复核。" })),
  },
  entryIsolation: {
    qaQuestions: entryQuestions(development, "qa").length,
    formalQuestions: formal.questions.length,
  },
  nextTask: "Q2-law-civil-principles-and-constitution-chapters-completed",
};

console.log(JSON.stringify(result, null, 2));
