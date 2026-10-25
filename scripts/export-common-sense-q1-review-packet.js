#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const q1 = require("../docs/knowledge-platform/content/common-sense-content-q1");
const { displayOptionOrder } = require("../miniprogram/subpackages/common-sense/services/learning-content");

const seeds = { reviewerA: "71a9c2e4", reviewerB: "c54e80b3" };
const questionById = Object.fromEntries(pack.questions.map((item) => [item.id, item]));
const sheets = Object.entries(seeds).map(([reviewerId, optionSeed]) => ({
  reviewerId,
  reviewerParticipation: "未参与 Q1 题目编写",
  optionSeed,
  completedAt: null,
  formOnlyInstructionAccepted: null,
  items: q1.addedQuestions.map((source) => {
    const question = questionById[source.id];
    const order = displayOptionOrder(question, optionSeed);
    return {
      questionId: question.id,
      topic: question.group === "q1-modern-treaty-contrast" ? "近代史条约辨析" : "市场失灵",
      prompt: question.prompt,
      displayedOptions: order.map((index, position) => ({ label: String.fromCharCode(65 + position), text: question.options[index] })),
      guessedOptionLabelFromFormOnly: null,
      formCueReason: "",
      confidence: null,
    };
  }),
}));

const packet = {
  schemaVersion: 1,
  batch: "Q1",
  status: "pending-independent-review",
  generatedAt: "2026-10-22",
  instructions: [
    "只判断题目形式是否泄露答案，不使用历史、经济学或公考知识解题。",
    "若仅凭选项长短、绝对化措辞、语气完整度或固定位置能猜测，请填写一个选项；完全无法从形式猜测时填写 N/A。",
    "说明使用了哪一种形式线索，并填写 1 至 5 的信心分；审稿者不得查看题目答案、解析和编写规格。",
  ],
  acceptance: {
    requiredReviewers: 2,
    maximumIndividualFormGuessAccuracy: 0.5,
    maximumJointSameCorrectChoiceRate: 0.5,
    evaluatorStatus: "not-run",
    note: "只有两份表均完成后，才由答案隔离的评估脚本计算；空表不能视为通过。",
  },
  reviewerSheets: sheets,
};

const destination = path.join(__dirname, "../docs/knowledge-platform/implementations/common-sense-content-q1-independent-review.json");
fs.writeFileSync(destination, `${JSON.stringify(packet, null, 2)}\n`);
console.log(`Q1 独立形式审查包已生成：${path.relative(path.resolve(__dirname, ".."), destination)}`);
