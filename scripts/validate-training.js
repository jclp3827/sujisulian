const assert = require("assert");
const { homeSections, getTrainingItem } = require("../miniprogram/models/train-catalog");
const { generateQuestionSet } = require("../miniprogram/services/train-generator/index");
const { validateAnswer } = require("../miniprogram/utils/answer-validator");

function validateGeneratedQuestion(owner, question, index) {
  assert.ok(question, `${owner}/question-${index + 1}: question is missing`);
  assert.strictEqual(question.index, index + 1, `${owner}/question-${index + 1}: index mismatch`);
  assert.ok(question.id, `${owner}/question-${index + 1}: id is missing`);
  assert.ok(question.prompt, `${owner}/question-${index + 1}: prompt is missing`);
  assert.notStrictEqual(question.answer, undefined, `${owner}/question-${index + 1}: answer is missing`);

  if (question.answerMode === "compare") {
    assert.ok(question.compare, `${owner}/question-${index + 1}: compare payload is missing`);
    assert.ok(question.compare.left, `${owner}/question-${index + 1}: compare.left is missing`);
    assert.ok(question.compare.right, `${owner}/question-${index + 1}: compare.right is missing`);
    assert.ok(["gt", "lt"].includes(question.answer), `${owner}/question-${index + 1}: compare answer must be gt or lt`);
  }
}

function validateGenerators() {
  homeSections.forEach((section) => {
    if (section.available === false || section.flow === "cognition") return;
    (section.groups || []).forEach((group) => {
      (group.items || []).forEach((item) => {
        if (item.available === false) return;
        const owner = `${section.id}/${item.id}`;
        assert.ok(getTrainingItem(section.id, item.id), `${owner}: item cannot be resolved`);
        const questions = generateQuestionSet(section.id, item.id, 5);
        assert.strictEqual(questions.length, 5, `${owner}: generator did not return requested count`);
        questions.forEach((question, index) => validateGeneratedQuestion(owner, question, index));
      });
    });
  });
}

function validateAnswerRules() {
  assert.strictEqual(validateAnswer({ answer: "42" }, "42"), true, "exact answer should pass");
  assert.strictEqual(validateAnswer({ answer: "42" }, "41"), false, "wrong exact answer should fail");
  assert.strictEqual(validateAnswer({ answer: "gt", answerMode: "compare" }, "gt"), true, "compare answer should pass");
  assert.strictEqual(validateAnswer({ answer: "gt", answerMode: "compare" }, "lt"), false, "wrong compare answer should fail");
  assert.strictEqual(validateAnswer({ answer: "100" }, "102", { tolerancePercent: 3 }), true, "answer within tolerance should pass");
  assert.strictEqual(validateAnswer({ answer: "100" }, "104", { tolerancePercent: 3 }), false, "answer outside tolerance should fail");
}

validateGenerators();
validateAnswerRules();

console.log(JSON.stringify({ problems: [], checked: "training-generators-and-answer-rules" }, null, 2));
