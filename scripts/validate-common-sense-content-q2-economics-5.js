#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-economics-5");
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
assert.equal(questions.length, 10);
assert.ok(questions.every((item) => item.revision === 2 && item.status === "review"));
assert.deepEqual(Object.fromEntries(questions.map((item) => [item.id, item.answer])), {
  "market-failure-externality-definition": 0,
  "market-failure-externality-types": 1,
  "market-failure-negative-externality": 1,
  "market-failure-positive-externality": 0,
  "market-failure-externality-full": 1,
  "public-goods-features": 1,
  "public-private-goods-contrast": 0,
  "pure-quasi-public-goods": 0,
  "public-goods-free-rider-remedy": 0,
  "public-goods-full": 0,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 10);
for (const item of questions) {
  const spec = pack.questionSpecifications.find((value) => value.questionId === item.id);
  const relation = pack.targetRelations.questionTargets.find((value) => value.questionId === item.id);
  assert.ok(spec && relation);
  assert.equal(spec.checkPurpose, "q2-economics-market-failure-mechanisms");
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
assert.equal(q2.questionDispositions.length, 10);
assert.ok(q2.questionDispositions.every((item) => item.decision === "rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map((item) => item.decision), ["structural-mnemonic-candidate", "structural-mnemonic-candidate"]);

const externalityGroup = pack.groups.find((item) => item.id === "market-failure-externality-mechanism");
const publicGoodsGroup = pack.groups.find((item) => item.id === "market-failure-public-goods-mechanism");
const externalityMnemonic = pack.mnemonics.find((item) => item.id === "market-failure-externality-memory");
const publicGoodsMnemonic = pack.mnemonics.find((item) => item.id === "public-goods-mechanism-memory");
assert.equal(externalityGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(publicGoodsGroup.mnemonicDecision, "structural-mnemonic");
assert.deepEqual([externalityMnemonic.revision, externalityMnemonic.title, externalityMnemonic.learningForm, externalityMnemonic.formLabel], [2, "先看第三方，正补负税", "structural-mnemonic", "结构口诀"]);
assert.equal(externalityMnemonic.method, "先核对无关第三方，再判断其得利或受损，最后配对补贴或征税方向");
assert.ok(externalityMnemonic.text.includes("得利为正，受损为负") && externalityMnemonic.text.includes("正补贴，负征税"));
assert.ok(externalityMnemonic.phrases.every((item) => item.coverageType === "structural-third-party-sign-remedy"));
assert.deepEqual([publicGoodsMnemonic.revision, publicGoodsMnemonic.title, publicGoodsMnemonic.learningForm, publicGoodsMnemonic.formLabel], [2, "两非—搭车—政府供", "structural-mnemonic", "结构口诀"]);
assert.equal(publicGoodsMnemonic.method, "先对照两项属性，再区分纯与准，最后沿搭便车、市场供给不足还原主要供给方向");
assert.ok(publicGoodsMnemonic.text.includes("公共两非，私人竞争排他") && publicGoodsMnemonic.text.includes("市场供不够，主要政府供"));
assert.ok(publicGoodsMnemonic.phrases.every((item) => item.coverageType === "structural-features-types-supply"));

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
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === externalityMnemonic.id && item.formLabel === "结构口诀"));
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === publicGoodsMnemonic.id && item.formLabel === "结构口诀"));

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: externalityGroup.id, title: externalityGroup.title, questions: 5, mnemonicDecision: externalityGroup.mnemonicDecision },
    { id: publicGoodsGroup.id, title: publicGoodsGroup.title, questions: 5, mnemonicDecision: publicGoodsGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 10,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      externality: { revision: externalityMnemonic.revision, classification: externalityMnemonic.learningForm, memoryTrialEvidence: false },
      publicGoods: { revision: publicGoodsMnemonic.revision, classification: publicGoodsMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: { qaQuestions: entryQuestions(development, "qa").length, formalQuestions: formal.questions.length },
  nextTask: "Q2-economics-6-selection",
}, null, 2));
