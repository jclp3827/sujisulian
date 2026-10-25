#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q1 = require("../docs/knowledge-platform/content/common-sense-content-q1");
const mnemonicQuality = require("../docs/knowledge-platform/content/common-sense-mnemonic-quality-q1");
const { compile } = require("./build-common-sense-learning");
const { auditPack } = require("./lib/common-sense-content-quality-gate");
const { validateMnemonicQuality } = require("./lib/validate-common-sense-mnemonic-quality");
const { availableContent, displayOptionOrder } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");

const packetPath = path.join(__dirname, "../docs/knowledge-platform/implementations/common-sense-content-q1-independent-review.json");
const packet = JSON.parse(fs.readFileSync(packetPath, "utf8"));
const questionIds = q1.addedQuestions.map((item) => item.id);
const questionIdSet = new Set(questionIds);
const mnemonicIds = new Set(["q1-modern-treaty-contrast-memory", "market-failure-four-factors-memory"]);

assert.deepEqual(compile(authored, body), pack);
assert.equal(pack.version, "2026-10-23.97");
assert.deepEqual({ questions: pack.questions.length, targets: pack.targets.length, groups: pack.groups.length, mnemonics: pack.mnemonics.length },
  { questions: 606, targets: 497, groups: 133, mnemonics: 129 });
assert.equal(pack.targetRelations.questionTargets.length, 606);
assert.equal(pack.questionSpecifications.length, 606);

assert.equal(q1.status, "review-accepted");
assert.equal(q1.groups.length, 2);
assert.ok(q1.groups.every((group) => group.questionIds.length === 3));
assert.deepEqual(q1.addedQuestions.map((item) => item.answer), [1, 2, 0, 2, 0, 1]);
assert.deepEqual(Object.values(q1.addedQuestions.reduce((counts, item) => ({ ...counts, [item.answer]: (counts[item.answer] || 0) + 1 }), {})).sort(), [2, 2, 2]);
assert.ok(q1.addedQuestions.every((item) => item.status === "review" && item.assessmentType === "learning-card" &&
  item.kind === "自编学习题" && item.examBasis.originType === "self-authored"));
assert.equal(new Set(q1.addedQuestions.map((item) => item.prompt.replace(/\s+/gu, ""))).size, 6);

const quality = auditPack(pack);
const targetedViolations = {};
for (const rule of quality.rules) {
  const rows = rule.sampleViolations.filter((item) => questionIdSet.has(item.entityId));
  if (rows.length) targetedViolations[rule.id] = rows;
}
assert.deepEqual(targetedViolations, {}, "Q1 六题不得命中题目质量规则");
for (const question of q1.addedQuestions) {
  const lengths = question.options.map((option) => Array.from(option).length);
  assert.ok(!lengths.filter((_, index) => index !== question.answer).every((length) => lengths[question.answer] > length),
    `${question.id}: 正确项不得为唯一最长项`);
  const specification = q1.questionSpecifications.find((item) => item.questionId === question.id);
  assert.deepEqual(Object.keys(specification.distractorReasons).map(Number).sort(),
    question.options.map((_, index) => index).filter((index) => index !== question.answer));
}

assert.equal(q1.variationDecisions.length, q1.targets.length);
for (const decision of q1.variationDecisions) {
  assert.ok(decision.directQuestionIds.length && decision.variationQuestionIds.length && decision.processDifference);
  assert.ok(!decision.directQuestionIds.some((id) => decision.variationQuestionIds.includes(id)));
  assert.ok(decision.directQuestionIds.concat(decision.variationQuestionIds).every((id) => questionIdSet.has(id)));
}

const development = availableContent(body, pack, true);
const formal = availableContent(body, pack, false);
assert.ok(questionIds.every((id) => development.questions.some((item) => item.id === id)));
assert.ok(questionIds.every((id) => !formal.questions.some((item) => item.id === id)));
assert.ok(questionIds.every((id) => entryQuestions(development, "qa").some((item) => item.id === id)));
assert.ok(questionIds.every((id) => !entryQuestions(development, "daily").some((item) => item.id === id)));
assert.ok(questionIds.every((id) => !entryQuestions(development, "exam", "all", "selected").some((item) => item.id === id)));
assert.deepEqual(entryQuestions(development, "mnemonic").filter((item) => questionIdSet.has(item.id)).map((item) => item.id).sort(),
  ["q1-treaty-boundary", "q1-treaty-material", "q1-treaty-quick-recall"]);
assert.ok(entryMnemonics(development).some((item) => item.id === "q1-modern-treaty-contrast-memory" && item.formLabel === "结构口诀"));

const mnemonicReport = validateMnemonicQuality(pack, mnemonicQuality, { currentDate: "2026-10-22" });
assert.equal(mnemonicReport.passed, false);
assert.equal(mnemonicReport.counts.mnemonics, 129);
assert.equal(mnemonicReport.counts.qualitySpecifications, 2);
assert.equal(mnemonicReport.counts.validQualitySpecifications, 2);
assert.deepEqual(mnemonicReport.errorsByCode, { "missing-quality-specification": 127 });
assert.ok(!mnemonicReport.issues.some((item) => [...mnemonicIds].some((id) => item.owner.startsWith(id))));

assert.equal(packet.status, "form-review-passed");
assert.equal(packet.acceptance.evaluatorStatus, "passed");
assert.equal(packet.formReviewResult.passed, true);
assert.deepEqual(packet.formReviewResult.reviewerResults.map((item) => item.formGuessAccuracy), [0.5, 1 / 6]);
assert.equal(packet.formReviewResult.joint.rate, 1 / 6);
assert.equal(packet.reviewerSheets.length, 2);
const forbiddenKey = /answer|correct|distractor/i;
const visit = (value) => {
  if (Array.isArray(value)) return value.forEach(visit);
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => { assert.ok(!forbiddenKey.test(key), `盲审包泄露答案字段: ${key}`); visit(child); });
};
visit(packet.reviewerSheets);
for (const sheet of packet.reviewerSheets) {
  assert.equal(sheet.items.length, 6);
  assert.equal(sheet.reviewerType, "independent-ai-agent");
  assert.match(sheet.completedAt, /^\d{4}-\d{2}-\d{2}$/u);
  assert.equal(sheet.formOnlyInstructionAccepted, true);
  assert.ok(sheet.items.every((item) => ["A", "B", "C", "N/A"].includes(item.guessedOptionLabelFromFormOnly) &&
    item.formCueReason.trim() && Number.isInteger(item.confidence) && item.confidence >= 1 && item.confidence <= 5 &&
    item.displayedOptions.length === 3));
  for (const item of sheet.items) {
    // Q1 盲审包是 revision 1 的历史证据；市场失灵题在 Q2 原 ID 晋级后
    // revision 会参与选项稳定洗牌，因此这里必须继续对照当时的 Q1 快照。
    const source = q1.addedQuestions.find((question) => question.id === item.questionId);
    assert.deepEqual(item.displayedOptions.map((option) => option.text), displayOptionOrder(source, sheet.optionSeed).map((index) => source.options[index]));
  }
}

const result = {
  passed: true,
  batch: "Q1",
  packVersion: pack.version,
  status: "review-accepted",
  releaseBlocked: true,
  totals: { questions: 606, targets: 497, groups: 133, mnemonics: 129 },
  pilot: {
    themes: q1.groups.map((item) => item.title),
    questions: 6,
    cognitiveLevels: Object.fromEntries(q1.questionSpecifications.map((item) => [item.questionId, item.cognitiveLevel])),
    canonicalAnswerPositions: { 0: 2, 1: 2, 2: 2 },
    targetedQualityViolations: targetedViolations,
    variationDecisions: q1.variationDecisions.length,
  },
  mnemonicQuality: {
    validPilotSpecifications: 2,
    treatyClassification: "structural-mnemonic",
    marketClassification: "study-outline",
    remainingGlobalMissingSpecifications: 127,
    memoryTrials: 0,
  },
  entryIsolation: {
    qaQuestions: entryQuestions(development, "qa").length,
    mnemonicQuestions: entryQuestions(development, "mnemonic").length,
    dailyQuestions: entryQuestions(development, "daily").length,
    selectedExamQuestions: entryQuestions(development, "exam", "all", "selected").length,
    formalQuestions: formal.questions.length,
  },
  stopGate: {
    reached: false,
    reason: "Q1 技术包、两份独立 AI 形式盲审、AI 领域预审和产品负责人抽样验收均已完成。",
    reopenWhen: "已满足；Q1 新增资源继续保持 review，正式准入与发布仍另行审核。",
    nextTaskAfterPass: "Q2-law-first-two-small-themes",
  },
};

console.log(JSON.stringify(result, null, 2));
