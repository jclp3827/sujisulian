#!/usr/bin/env node
"use strict";
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-economics-3");
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
  "market-structure-category-set": 0,
  "market-perfect-competition-core": 1,
  "market-monopolistic-competition-core": 0,
  "market-oligopoly-core": 2,
  "market-monopoly-core": 0,
  "price-discrimination-definition": 0,
  "price-discrimination-first-degree": 0,
  "price-discrimination-second-degree": 1,
  "price-discrimination-third-degree": 2,
  "price-discrimination-three-levels": 1,
});
assert.equal(new Set(questions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 10);
for (const item of questions) {
  const spec = pack.questionSpecifications.find((value) => value.questionId === item.id);
  const relation = pack.targetRelations.questionTargets.find((value) => value.questionId === item.id);
  assert.ok(spec && relation);
  assert.equal(spec.checkPurpose, "q2-economics-market-structure");
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

const marketGroup = pack.groups.find((item) => item.id === "market-structure-four-types");
const priceGroup = pack.groups.find((item) => item.id === "monopoly-price-discrimination");
const marketMnemonic = pack.mnemonics.find((item) => item.id === "market-structure-four-types-memory");
const priceMnemonic = pack.mnemonics.find((item) => item.id === "price-discrimination-levels-memory");
assert.equal(marketGroup.mnemonicDecision, "structural-mnemonic");
assert.equal(priceGroup.mnemonicDecision, "structural-mnemonic");
assert.deepEqual([marketMnemonic.revision, marketMnemonic.title, marketMnemonic.learningForm, marketMnemonic.formLabel], [2, "多同、多异、少互、独无", "structural-mnemonic", "结构口诀"]);
assert.equal(marketMnemonic.method, "先看厂商数量，再看产品差别和进入条件；少数厂商追加相互依存，独家追加近似替代品边界");
assert.ok(marketMnemonic.text.includes("多同自由全") && marketMnemonic.text.includes("少数互相看") && marketMnemonic.text.includes("独家无近替"));
assert.ok(marketMnemonic.phrases.every((item) => item.coverageType === "structural-number-product-entry"));
assert.deepEqual([priceMnemonic.revision, priceMnemonic.title, priceMnemonic.learningForm, priceMnemonic.formLabel], [2, "一逐二量三人群", "structural-mnemonic", "结构口诀"]);
assert.equal(priceMnemonic.method, "先核同等级同质量和不同接受者的定义前提，再按逐单位、数量段、市场人群三级映射");
assert.ok(priceMnemonic.text.includes("同质不同价") && priceMnemonic.text.includes("一逐、二量、三人群"));
assert.ok(priceMnemonic.phrases.every((item) => item.coverageType === "structural-definition-level-mapping"));

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
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === marketMnemonic.id && item.formLabel === "结构口诀"));
assert.ok(entryMnemonics(development, "economics").some((item) => item.id === priceMnemonic.id && item.formLabel === "结构口诀"));

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  status: q2.status,
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  themes: [
    { id: marketGroup.id, title: marketGroup.title, questions: 5, mnemonicDecision: marketGroup.mnemonicDecision },
    { id: priceGroup.id, title: priceGroup.title, questions: 5, mnemonicDecision: priceGroup.mnemonicDecision },
  ],
  qualityReview: {
    rewrittenQuestions: 10,
    questionErrors: 0,
    questionWarnings: 0,
    targetedViolations,
    mnemonicDispositions: {
      marketStructure: { revision: marketMnemonic.revision, classification: marketMnemonic.learningForm, memoryTrialEvidence: false },
      priceDiscrimination: { revision: priceMnemonic.revision, classification: priceMnemonic.learningForm, memoryTrialEvidence: false },
    },
  },
  entryIsolation: { qaQuestions: entryQuestions(development, "qa").length, formalQuestions: formal.questions.length },
  nextTask: "Q2-economics-4-selection",
}, null, 2));
