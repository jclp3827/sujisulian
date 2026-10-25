#!/usr/bin/env node
"use strict";
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-economics-2");
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
assert.equal(questions.length, 6);
assert.ok(questions.every((item) => item.revision === 2 && item.status === "review"));
assert.deepEqual(Object.fromEntries(questions.map((item) => [item.id, item.answer])), {
  "macro-growth": 0,
  "macro-jobs-prices": 1,
  "macro-balance": 0,
  "policy-fiscal": 0,
  "policy-monetary": 1,
  "policy-bond-purchase": 0,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 6);
for (const item of questions) {
  const spec = pack.questionSpecifications.find((value) => value.questionId === item.id);
  const relation = pack.targetRelations.questionTargets.find((value) => value.questionId === item.id);
  assert.ok(spec && relation);
  assert.equal(spec.checkPurpose, "q2-economics-macro-policy");
  assert.equal(spec.checkPurpose, relation.checkPurpose);
  assert.equal(spec.cognitiveLevel, q2.cognitiveLevels[item.id]);
  assert.deepEqual(Object.keys(spec.distractorReasons).map(Number).sort(), item.options.map((_, index) => index).filter((index) => index !== item.answer));
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
assert.equal(q2.questionDispositions.length, 6);
assert.ok(q2.questionDispositions.every((item) => item.decision === "rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map((item) => item.decision), ["structural-mnemonic-candidate", "structural-mnemonic-candidate"]);

const macroGroup = pack.groups.find((item) => item.id === "macro-four-goals");
const policyGroup = pack.groups.find((item) => item.id === "fiscal-monetary");
const macroMnemonic = pack.mnemonics.find((item) => item.id === "macro-four-goals-memory");
const policyMnemonic = pack.mnemonics.find((item) => item.id === "fiscal-monetary-memory");
assert.equal(macroGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(policyGroup.mnemonicDecision, "structural-mnemonic");
assert.deepEqual([macroMnemonic.revision, macroMnemonic.title, macroMnemonic.learningForm, macroMnemonic.formLabel], [3, "两增一稳保国际", "structural-mnemonic", "结构口诀"]);
assert.equal(macroMnemonic.method, "先用两增一稳一平衡恢复四项目标，再核对增长主次和国际收支边界");
assert.ok(macroMnemonic.text.includes("增长最主要") && macroMnemonic.text.includes("国际收支保平衡"));
assert.ok(macroMnemonic.phrases.every((item) => item.coverageType === "structural-grouping-with-boundary"));
assert.deepEqual([policyMnemonic.revision, policyMnemonic.title, policyMnemonic.learningForm, policyMnemonic.formLabel], [3, "财归政府、币归央行", "structural-mnemonic", "结构口诀"]);
assert.equal(policyMnemonic.method, "先分政府与央行，再认预算税收或货币工具，最后用买放卖收判断基础方向");
assert.ok(policyMnemonic.text.includes("财归政府，币归央行") && policyMnemonic.text.includes("买债放、卖债收"));
assert.ok(policyMnemonic.phrases.every((item) => item.coverageType === "structural-role-tool-direction"));

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
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === macroMnemonic.id && item.formLabel === "结构口诀"));
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === policyMnemonic.id && item.formLabel === "结构口诀"));

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: macroGroup.id, title: macroGroup.title, questions: 3, mnemonicDecision: macroGroup.mnemonicDecision },
    { id: policyGroup.id, title: policyGroup.title, questions: 3, mnemonicDecision: policyGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 6,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      macroGoals: { revision: macroMnemonic.revision, classification: macroMnemonic.learningForm, memoryTrialEvidence: false },
      fiscalMonetary: { revision: policyMnemonic.revision, classification: policyMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: { qaQuestions: entryQuestions(development, "qa").length, formalQuestions: formal.questions.length },
  nextTask: "Q2-economics-3-selection",
}, null, 2));
