#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2 = require("../docs/knowledge-platform/content/common-sense-content-q2-economics-22");
const { compile } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics, entryGroups } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

assert.deepEqual(compile(authored, body), pack);
assert.equal(pack.version, authored.version); // Later reviewed revisions retain this batch's IDs and retirement rules.
assert.deepEqual(
  { questions: pack.questions.length, targets: pack.targets.length, groups: pack.groups.length, mnemonics: pack.mnemonics.length },
  { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
);

const byQuestion = Object.fromEntries(pack.questions.map((item) => [item.id, item]));
for (const id of q2.EXCHANGE_IDS.concat(q2.SOCIALIST_IDS)) {
  const question = byQuestion[id];
  assert.equal(question.revision, 2);
  assert.equal(question.status, "review");
  const spec = pack.questionSpecifications.find((item) => item.questionId === id);
  const relation = pack.targetRelations.questionTargets.find((item) => item.questionId === id);
  assert.ok(spec && relation);
  assert.equal(spec.checkPurpose, relation.checkPurpose);
  assert.ok(["application", "synthesis"].includes(spec.cognitiveLevel));
  for (let index = 0; index < question.options.length; index += 1) {
    if (index !== question.answer) assert.equal(typeof spec.distractorReasons[index], "string");
  }
}

for (const id of q2.RETIRED_MACRO_IDS) {
  assert.equal(byQuestion[id].status, "blocked");
  assert.equal(byQuestion[id].canonicalGroupId, "macro-four-goals");
}
for (const id of q2.PROMOTED_Q1_IDS) {
  assert.equal(byQuestion[id].revision, 2);
  assert.equal(byQuestion[id].qualityStage, "q2-candidate");
  assert.equal(pack.questionSpecifications.find((item) => item.questionId === id).checkPurpose, "q2-economics-market-failure-fast-recall");
}

const exchangeMnemonic = pack.mnemonics.find((item) => item.id === "exchange-rate-effects-memory");
assert.equal(exchangeMnemonic.revision, 3); // International source review corrected phrase meanings without changing this historical identity.
assert.ok(exchangeMnemonic.text.includes("资本别单推"));
assert.ok(exchangeMnemonic.phrases.every((item) => item.coverageType === "structural-exchange-conditional-chain"));
const socialistMnemonic = pack.mnemonics.find((item) => item.id === "socialist-market-framework-memory");
assert.equal(socialistMnemonic.revision, 3);
assert.ok(socialistMnemonic.text.includes("市场决定，政府更好"));
assert.ok(socialistMnemonic.phrases.every((item) => item.coverageType === "structural-current-market-government-governance"));
const retiredMnemonic = pack.mnemonics.find((item) => item.id === "macro-control-goals-memory");
assert.equal(retiredMnemonic.status, "blocked");
assert.equal(retiredMnemonic.canonicalMnemonicId, "macro-four-goals-memory");

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
const economicsQuestions = entryQuestions(development, "qa", "economics");
assert.equal(economicsQuestions.filter((item) => item.group === "macro-control-goals-core").length, 0);
assert.equal(economicsQuestions.filter((item) => item.group === "q1-market-failure").length, 3);
assert.deepEqual(entryGroups(development, "qa", "economics").filter((item) => ["macro-four-goals", "macro-control-goals-core"].includes(item.id)).map((item) => item.id), ["macro-four-goals"]);
assert.equal(entryMnemonics(development, "economics").filter((item) => item.id === "macro-control-goals-memory").length, 0);
assert.equal(formal.questions.filter((item) => q2.QUESTION_IDS.includes(item.id)).length, 0);

const forbiddenEditorial = /正文|本批|本节|按教材|原图|源文/u;
const absolute = /永远|完全|全部|所有|只能|必然|一律|任何|绝不|均不/u;
const findings = [];
for (const id of q2.EXCHANGE_IDS.concat(q2.SOCIALIST_IDS)) {
  const question = byQuestion[id];
  for (const [field, value] of [["prompt", question.prompt], ["explanation", question.explanation], ["boundary", question.boundary], ...question.options.map((value, index) => [`option-${index}`, value])]) {
    if (forbiddenEditorial.test(value)) findings.push({ id, rule: "editorial", field });
  }
  for (let index = 0; index < question.options.length; index += 1) {
    if (index !== question.answer && absolute.test(question.options[index])) findings.push({ id, rule: "absolute-distractor", index });
  }
}
assert.deepEqual(findings, []);

console.log(JSON.stringify({
  passed: true,
  batch: q2.batch,
  packVersion: pack.version,
  decisions: q2.decisions,
  counts: {
    rewrittenQuestions: q2.EXCHANGE_IDS.length + q2.SOCIALIST_IDS.length,
    promotedQuestions: q2.PROMOTED_Q1_IDS.length,
    retiredDuplicateQuestions: q2.RETIRED_MACRO_IDS.length,
    totalQuestions: pack.questions.length,
    developmentQuestions: development.questions.length,
  },
  entry: { retiredMacroVisible: 0, promotedQ1Visible: 3, canonicalMacroGroup: "macro-four-goals" },
  formalAvailability: { questions: 0, mnemonics: 0 },
  stopGate: "resolved-content-and-product-decisions",
  uploaded: false,
  released: false,
}, null, 2));
