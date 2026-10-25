#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const crypto = require("crypto");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const q0b = require("../docs/knowledge-platform/content/common-sense-content-q0-b");
const questionQ0aBaseline = require("../docs/knowledge-platform/implementations/common-sense-content-quality-q0a-red-baseline.json");
const mnemonicAuthoring = require("../docs/knowledge-platform/content/common-sense-mnemonic-quality-q0a");
const { auditPack, baselineSignature } = require("./lib/common-sense-content-quality-gate");
const { validateMnemonicQuality } = require("./lib/validate-common-sense-mnemonic-quality");
const { displayOptionOrder } = require("../miniprogram/subpackages/common-sense/services/learning-content");

const sha256 = (value) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const report = auditPack(pack);
const rules = Object.fromEntries(report.rules.map((rule) => [rule.id, rule]));
const relationIds = new Set(pack.targetRelations.questionTargets.map((row) => row.questionId));
const specificationIds = new Set(pack.questionSpecifications.map((row) => row.questionId));

assert.equal(pack.version, "2026-10-23.96");
assert.equal(pack.questions.length, 606);
assert.equal(pack.targets.length, 497);
assert.equal(relationIds.size, 606);
assert.equal(specificationIds.size, 606);
assert.ok(pack.questions.every((question) => relationIds.has(question.id) && specificationIds.has(question.id)));
assert.ok(pack.questions.every((question) => question.assessmentType === "learning-card" &&
  question.kind === "自编学习题" && question.examBasis?.originType === "self-authored" && question.examBasis.displayLabel === "自编学习题"));
assert.ok(pack.questionSpecifications.every((specification) =>
  ["recall", "mapping", "distinction", "condition", "application", "synthesis"].includes(specification.cognitiveLevel)));

for (const ruleId of ["QG-PACK-001", "QG-REL-001", "QG-SPEC-001", "QG-SOURCE-001", "QG-PURPOSE-001", "QG-TYPE-001", "QG-EVIDENCE-001"]) {
  assert.equal(rules[ruleId].violationCount, 0, `${ruleId} 必须在 Q0-B 归零`);
}
assert.equal(report.status, "red");
assert.deepEqual(report.rules.filter((rule) => ["blocker", "error"].includes(rule.severity) && rule.violationCount)
  .map((rule) => rule.id), ["QG-POSITION-001", "QG-PROMPT-001", "QG-EDITORIAL-001"]);
assert.notDeepEqual(baselineSignature(report), questionQ0aBaseline, "Q0-B 不得继续冒充 Q0-A 冻结红基线");

const stableSeeds = ["12345678", "abcdef12", "feedbeef"];
const displayPositionEvidence = stableSeeds.map((seed) => {
  const populations = { all: pack.questions };
  pack.questions.forEach((question) => { (populations[question.scope] ||= []).push(question); });
  const results = {};
  for (const [population, questions] of Object.entries(populations)) {
    const counts = {};
    for (const question of questions) {
      const order = displayOptionOrder(question, seed);
      assert.deepEqual(displayOptionOrder(question, seed), order);
      assert.deepEqual(order.slice().sort((a, b) => a - b), question.options.map((_, index) => index));
      const displayAnswer = order.indexOf(question.answer);
      assert.equal(question.options[order[displayAnswer]], question.options[question.answer]);
      counts[displayAnswer] = (counts[displayAnswer] || 0) + 1;
      const specification = pack.questionSpecifications.find((item) => item.questionId === question.id);
      order.filter((sourceIndex) => sourceIndex !== question.answer).forEach((sourceIndex) =>
        assert.ok(specification.distractorReasons[sourceIndex], `${question.id}:${sourceIndex} 缺错误项理由`));
    }
    const dominantRatio = Math.max(...Object.values(counts)) / questions.length;
    if (questions.length >= 20) assert.ok(dominantRatio < 0.5, `${population} 的展示答案位置仍可利用`);
    results[population] = { sampleSize: questions.length, counts, dominantRatio: Number(dominantRatio.toFixed(4)) };
  }
  return { seed, populations: results };
});
assert.ok(pack.questions.some((question) => JSON.stringify(displayOptionOrder(question, stableSeeds[0])) !==
  JSON.stringify(displayOptionOrder(question, stableSeeds[1]))));

const dispositionIds = q0b.mnemonicDispositions.map((item) => item.mnemonicId);
assert.equal(q0b.PRIORITY_FORM_RISK_IDS.length, 23);
assert.equal(q0b.LEGACY_STRUCTURE_IDS.length, 9);
assert.equal(dispositionIds.length, 32);
assert.equal(new Set(dispositionIds).size, 32);
assert.ok(q0b.mnemonicDispositions.every((item) => item.decision === "downgrade-to-study-outline" && item.status === "review" && item.reason));
const mnemonicById = Object.fromEntries(pack.mnemonics.map((item) => [item.id, item]));
const supersededDispositionIds = [
  "constitution-chapters-memory",
  "heat-mechanisms-memory",
  "substance-classification-memory",
  "demand-supply-roles-memory",
  "macro-four-goals-memory",
  "fiscal-monetary-memory",
];
const activeDowngradeIds = dispositionIds.filter((id) => !supersededDispositionIds.includes(id));
assert.equal(activeDowngradeIds.length, 26);
assert.ok(activeDowngradeIds.every((id) =>
  mnemonicById[id]?.learningForm === "study-outline" && mnemonicById[id]?.formLabel === "速记提纲"));
for (const id of supersededDispositionIds) {
  assert.equal(mnemonicById[id].learningForm, "structural-mnemonic");
  assert.equal(mnemonicById[id].formLabel, "结构口诀");
  assert.equal(mnemonicById[id].revision, 3);
}
for (const id of q0b.LEGACY_STRUCTURE_IDS) {
  const mnemonic = mnemonicById[id];
  assert.ok(mnemonic.purpose && mnemonic.conditions?.length && mnemonic.phrases.every((phrase) =>
    phrase.id && phrase.targetIds?.length && phrase.checks?.length));
  assert.ok(pack.mnemonicSpecifications.some((specification) => specification.mnemonicId === id && specification.revision === mnemonic.revision));
}

const mnemonicReport = validateMnemonicQuality(pack, mnemonicAuthoring, { currentDate: "2026-10-22" });
assert.equal(mnemonicReport.passed, false);
assert.deepEqual(mnemonicReport.errorsByCode, { "missing-quality-specification": 129 });
assert.notEqual(mnemonicReport.hashes.mnemonicTargetContentSha256, mnemonicAuthoring.redBaseline.mnemonicTargetContentSha256);

const structuralTriage = Object.fromEntries(["QG-LENGTH-001", "QG-PROMPT-001", "QG-ABSOLUTE-001", "QG-EDITORIAL-001"]
  .map((ruleId) => [ruleId, { count: rules[ruleId].violationCount, entityCount: rules[ruleId].violationEntityCount,
    entitySetSha256: rules[ruleId].violationEntitySetSha256, disposition: "defer-content-rewrite-to-Q1-Q2" }]));

const result = {
  passed: true,
  batch: "Q0-B",
  packVersion: pack.version,
  contentAdmissionStatus: "blocked",
  questionInventory: { questions: pack.questions.length, targets: pack.targets.length,
    relations: relationIds.size, specifications: specificationIds.size },
  questionQuality: {
    status: report.status,
    contentSha256: report.contentSha256,
    ruleViolationCounts: Object.fromEntries(report.rules.map((rule) => [rule.id, rule.violationCount])),
    q0aBaselineChangedAsExpected: true,
  },
  stableDisplayShuffle: {
    contract: "question revision + persisted session seed; answers remain canonical source indexes",
    evidence: displayPositionEvidence,
  },
  mnemonicDisposition: {
    priorityFormRisks: q0b.PRIORITY_FORM_RISK_IDS.length,
    legacyStructureGaps: q0b.LEGACY_STRUCTURE_IDS.length,
    total: dispositionIds.length,
    decisionCounts: { "downgrade-to-study-outline": activeDowngradeIds.length, "superseded-by-q2-structural-mnemonic": supersededDispositionIds.length },
    supersededDispositionIds,
    idsSha256: sha256(dispositionIds.slice().sort()),
    qualityGateStillBlocked: true,
    remainingMissingQualitySpecifications: mnemonicReport.errorsByCode["missing-quality-specification"],
  },
  structuralTriage,
  stopGate: {
    reached: true,
    reason: "Q0-B 结构闭环完成；题干、选项长度和编辑语言仍需 Q1/Q2 逐题回修，口诀正式规格与用户试用证据仍未完成。",
    nextBatch: "Q1-two-topic-quality-pilot",
  },
};

console.log(JSON.stringify(result, null, 2));
