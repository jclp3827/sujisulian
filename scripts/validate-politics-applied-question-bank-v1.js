#!/usr/bin/env node

const assert = require("assert");
const { execFileSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
execFileSync(process.execPath, [path.join(__dirname, "build-politics-applied-question-bank-v1.js"), "--check"], { stdio: "inherit" });

const bank = require(path.join(ROOT, "miniprogram/models/politics-applied-questions-runtime.js"));
const objectives = require(path.join(ROOT, "docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json"));
const systematic = require(path.join(ROOT, "miniprogram/models/politics-systematic-units-runtime.js"));
const learningBanks = require(path.join(ROOT, "miniprogram/models/politics-learning-banks-runtime.js"));
const { knowledgePackage } = require(path.join(ROOT, "miniprogram/services/knowledge-platform/politics-runtime.js"));

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function normalize(value = "") {
  return String(value).replace(/[\s，。！？；：、“”‘’（）《》·,.!?;:()]/g, "");
}

assert.equal(bank.schemaVersion, 1);
assert.equal(bank.status, "candidate-runtime-approved");
assert.match(bank.bankVersion, /^applied-questions-[0-9a-f]{12}$/);
assert.equal(bank.groups.length, 8, "first delivery must contain eight complete groups");
assert.equal(bank.questions.length, 24, "first delivery must contain 24 reviewed questions");
assert.deepEqual(countBy(bank.groups, "scope"), { thought: 4, principles: 4 });
const quality = require("./lib/politics-applied-confusion-revision").loadQualityRevision();
assert.deepEqual(countBy(bank.questions, "questionType"), quality ? countBy(Object.values(quality.appliedPatches), "questionType") : {
  "relation-classification": 8,
  "condition-change": 8,
  "scenario-judgment": 8,
});
assert.deepEqual(countBy(bank.questions, "answerIndex"), { 0: 8, 1: 8, 2: 8 }, "correct options must be position-balanced");

for (const type of Object.keys(countBy(bank.questions, "questionType"))) {
  assert.ok(new Set(bank.questions.filter(q => q.questionType === type).map(q => q.answerIndex)).size > 1, `${type} exposes its answer by type`);
}
const objectiveIds = new Set(objectives.objectives.map((item) => item.objectiveId));
const unitById = new Map((knowledgePackage.knowledgeUnits || []).map((item) => [item.id, item]));
const blockIds = new Set((knowledgePackage.knowledgeUnits || []).flatMap((unit) => (unit.blocks || []).map((block) => block.id)));
const lessonIds = new Set((systematic.lessons || []).map((item) => item.id));
const recallPrompts = new Set((learningBanks.recallCards || []).map((item) => normalize(item.prompt)));
const questionIds = new Set();
const groupIds = new Set();

for (const group of bank.groups) {
  assert(!groupIds.has(group.groupId), `duplicate group id: ${group.groupId}`);
  groupIds.add(group.groupId);
  assert(unitById.has(group.unitId), `missing unit: ${group.groupId} ${group.unitId}`);
  assert(lessonIds.has(group.lessonId), `missing systematic lesson: ${group.groupId} ${group.lessonId}`);
  assert.equal(group.questionIds.length, 3, `group must contain exactly three questions: ${group.groupId}`);
  assert.deepEqual(group.questionIds.map((id) => bank.questions.find((question) => question.questionId === id)?.questionType), quality ? group.questionIds.map(id=>quality.appliedPatches[id].questionType) : [
    "relation-classification",
    "condition-change",
    "scenario-judgment",
  ], `group question order invalid: ${group.groupId}`);
  group.objectiveIds.forEach((id) => assert(objectiveIds.has(id), `missing group objective: ${group.groupId} ${id}`));
}

for (const question of bank.questions) {
  assert(!questionIds.has(question.questionId), `duplicate question id: ${question.questionId}`);
  questionIds.add(question.questionId);
  const group = bank.groups.find((item) => item.groupId === question.groupId);
  assert(group, `missing group: ${question.questionId}`);
  assert(group.questionIds.includes(question.questionId), `question absent from group: ${question.questionId}`);
  assert.equal(question.unitId, group.unitId, `question unit mismatch: ${question.questionId}`);
  assert(objectiveIds.has(question.primaryObjectiveId), `missing objective: ${question.questionId}`);
  assert(Array.isArray(question.options) && question.options.length === 3, `question must have three options: ${question.questionId}`);
  assert.equal(new Set(question.options).size, question.options.length, `duplicate options: ${question.questionId}`);
  assert(Number.isInteger(question.answerIndex) && question.answerIndex >= 0 && question.answerIndex < question.options.length, `bad answer index: ${question.questionId}`);
  assert(question.explanation && typeof question.boundary === "string", `missing explanation or boundary: ${question.questionId}`);
  assert(Array.isArray(question.sourceBlockIds) && question.sourceBlockIds.length, `missing sources: ${question.questionId}`);
  question.sourceBlockIds.forEach((id) => assert(blockIds.has(id), `missing source block: ${question.questionId} ${id}`));
  question.options.forEach((_, index) => {
    if (index !== question.answerIndex) assert(question.distractorRationales[index], `missing distractor rationale: ${question.questionId} option ${index}`);
  });
  assert(!recallPrompts.has(normalize(question.prompt)), `duplicates recall prompt: ${question.questionId}`);
  assert.equal(question.status, "candidate-runtime-approved");
  assert.equal(question.sourceReviewState, quality ? "two-independent-ai-roles-reviewed" : "dp2-reviewed");
  assert.equal(question.reviewState, quality ? "two-independent-ai-roles-reviewed-effectiveness-unverified" : "exam-alignment-editorial-reviewed-effectiveness-unverified");
  assert.match(question.contentVersion, /^[0-9a-f]{12}$/);
}

console.log("politics applied question bank validation passed: 8 groups / 24 questions / 3 applied types");
