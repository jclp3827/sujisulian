#!/usr/bin/env node
"use strict";
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-economics-17");
const { compile } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

assert.deepEqual(compile(authored, body), pack);
assert.equal(pack.version, "2026-10-23.97");
assert.deepEqual({ questions: pack.questions.length, targets: pack.targets.length, groups: pack.groups.length, mnemonics: pack.mnemonics.length }, { questions: 606, targets: 497, groups: 133, mnemonics: 129 });

const ids = new Set(q2.QUESTION_IDS);
const questions = pack.questions.filter((x) => ids.has(x.id));
assert.equal(questions.length, 9);
assert.equal(new Set(questions.map((x) => x.prompt.replace(/\s+/gu, ""))).size, 9);
for (const question of questions) {
  assert.equal(question.revision, 2);
  assert.equal(question.status, "review");
  const spec = pack.questionSpecifications.find((x) => x.questionId === question.id);
  const relation = pack.targetRelations.questionTargets.find((x) => x.questionId === question.id);
  assert.ok(spec && relation);
  assert.equal(spec.checkPurpose, relation.checkPurpose);
  assert.ok(["application", "synthesis"].includes(spec.cognitiveLevel));
  for (let i = 0; i < question.options.length; i++) if (i !== question.answer) assert.equal(typeof spec.distractorReasons[i], "string");
}

const targetIds = new Set(Object.keys(q2.targetRows));
for (const id of targetIds) {
  const target = pack.targets.find((x) => x.id === id);
  const variation = pack.variationDecisions.find((x) => x.targetId === id);
  assert.ok(target && variation);
  assert.equal(target.revision, 2);
  assert.equal(target.status, "review");
  assert.equal(variation.directQuestionIds.length, 1);
  assert.equal(variation.variationQuestionIds.length, 1);
  assert.ok(variation.processDifference);
}

const laws = pack.mnemonics.find((x) => x.id === "market-economy-laws-memory");
const features = pack.mnemonics.find((x) => x.id === "market-features-foundation-memory");
assert.equal(laws.revision, 2);
assert.equal(laws.formLabel, "结构口诀");
assert.equal(laws.title, "市场配资源，价值看社时；主体争利益，供求问付得起");
assert.ok(laws.text.includes("需求付不付得起"));
assert.equal(features.revision, 2);
assert.equal(features.formLabel, "结构口诀");
assert.equal(features.title, "权要明，人要平，市场竞争凭本领");
assert.ok(features.text.includes("靠技术质量服务争取客户"));
for (const mnemonic of [laws, features]) {
  const spec = pack.mnemonicSpecifications.find((x) => x.mnemonicId === mnemonic.id);
  assert.equal(spec.revision, mnemonic.revision);
  assert.ok(spec.purpose && spec.method);
  assert.ok(mnemonic.phrases.every((x) => x.coverageType.startsWith("structural-")));
}

const dev = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.equal(formal.questions.filter((x) => ids.has(x.id)).length, 0);
assert.equal(formal.mnemonics.filter((x) => [laws.id, features.id].includes(x.id)).length, 0);
assert.equal(entryQuestions(dev, "qa").filter((x) => ids.has(x.id)).length, 9);
assert.equal(entryMnemonics(dev, "economics").filter((x) => [laws.id, features.id].includes(x.id)).length, 2);

const forbiddenEditorial = /正文|本批|本节|按教材|原图|源文/u;
const absolute = /永远|完全|全部|所有|只能|必然|一律|任何|绝不|均不/u;
const findings = [];
for (const question of questions) {
  for (const [field, value] of [["prompt", question.prompt], ["explanation", question.explanation], ["boundary", question.boundary], ...question.options.map((value, index) => [`option-${index}`, value])]) {
    if (forbiddenEditorial.test(value)) findings.push({ id: question.id, rule: "editorial", field });
  }
  for (let i = 0; i < question.options.length; i++) if (i !== question.answer && absolute.test(question.options[i])) findings.push({ id: question.id, rule: "absolute", index: i });
  const lengths = question.options.map((x) => [...x].length);
  const correct = lengths[question.answer];
  if (lengths.every((n, i) => i === question.answer || correct > n)) findings.push({ id: question.id, rule: "unique-longest", lengths });
}
assert.deepEqual(findings, []);

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  counts: { questions: questions.length, targets: targetIds.size, mnemonics: 2, totalQuestions: pack.questions.length, totalTargets: pack.targets.length, totalGroups: pack.groups.length, totalMnemonics: pack.mnemonics.length },
  quality: { targetedFindings: findings.length, focus: ["市场配置", "三规律关系", "产权主体活动", "押韵动作口诀"] },
  formalAvailability: { questions: 0, mnemonics: 0 },
  nextTask: "Q2-economics-18-selection",
  uploaded: false,
  released: false,
}, null, 2));
