#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const { displayOptionOrder } = require("../miniprogram/subpackages/common-sense/services/learning-content");

const expectPending = process.argv.includes("--expect-pending");
const packetPath = path.join(__dirname, "../docs/knowledge-platform/implementations/common-sense-content-q1-independent-review.json");
const packet = JSON.parse(fs.readFileSync(packetPath, "utf8"));
const byId = Object.fromEntries(pack.questions.map((item) => [item.id, item]));
const validLabels = new Set(["A", "B", "C", "N/A"]);
const sheets = packet.reviewerSheets || [];
const pendingReasons = [];

if (sheets.length !== packet.acceptance.requiredReviewers) pendingReasons.push("审稿人数不足");
for (const sheet of sheets) {
  if (sheet.reviewerParticipation !== "未参与 Q1 题目编写") pendingReasons.push(`${sheet.reviewerId}: 参与关系未确认`);
  if (sheet.formOnlyInstructionAccepted !== true) pendingReasons.push(`${sheet.reviewerId}: 未确认只按形式判断`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(sheet.completedAt || "")) pendingReasons.push(`${sheet.reviewerId}: 未填写完成日期`);
  for (const item of sheet.items || []) {
    if (!validLabels.has(item.guessedOptionLabelFromFormOnly)) pendingReasons.push(`${sheet.reviewerId}:${item.questionId}: 未填写有效形式猜测`);
    if (!String(item.formCueReason || "").trim()) pendingReasons.push(`${sheet.reviewerId}:${item.questionId}: 未填写形式线索理由`);
    if (!Number.isInteger(item.confidence) || item.confidence < 1 || item.confidence > 5) pendingReasons.push(`${sheet.reviewerId}:${item.questionId}: 信心分无效`);
  }
}

if (pendingReasons.length) {
  const result = { passed: false, status: "pending-independent-review", reasons: pendingReasons };
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = expectPending ? 0 : 2;
} else {
  const reviewerResults = sheets.map((sheet) => {
    let correctFormGuesses = 0;
    const byQuestion = {};
    for (const item of sheet.items) {
      const question = byId[item.questionId];
      if (!question) throw new Error(`${item.questionId}: 题目不存在`);
      const order = displayOptionOrder(question, sheet.optionSeed);
      const correctLabel = String.fromCharCode(65 + order.indexOf(question.answer));
      const hit = item.guessedOptionLabelFromFormOnly === correctLabel;
      if (hit) correctFormGuesses += 1;
      byQuestion[item.questionId] = { hit, guessed: item.guessedOptionLabelFromFormOnly };
    }
    const rate = correctFormGuesses / sheet.items.length;
    return { reviewerId: sheet.reviewerId, sampleSize: sheet.items.length, correctFormGuesses, formGuessAccuracy: rate, byQuestion };
  });
  const commonIds = Object.keys(reviewerResults[0].byQuestion).filter((id) => reviewerResults.every((result) => result.byQuestion[id]));
  const jointCorrect = commonIds.filter((id) => reviewerResults.every((result) => result.byQuestion[id].hit)).length;
  const jointRate = jointCorrect / commonIds.length;
  const individualPassed = reviewerResults.every((result) => result.formGuessAccuracy <= packet.acceptance.maximumIndividualFormGuessAccuracy);
  const jointPassed = jointRate <= packet.acceptance.maximumJointSameCorrectChoiceRate;
  const result = {
    passed: individualPassed && jointPassed,
    status: individualPassed && jointPassed ? "form-review-passed" : "revision-required",
    reviewerResults: reviewerResults.map(({ byQuestion: _hidden, ...summary }) => summary),
    joint: { sampleSize: commonIds.length, bothGuessedCorrect: jointCorrect, rate: jointRate },
    thresholds: packet.acceptance,
    note: "本结果只判断形式提示，不代替领域内容审核。",
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}
