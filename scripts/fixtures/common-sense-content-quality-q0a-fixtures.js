"use strict";

const clone = (value) => JSON.parse(JSON.stringify(value));

function question(id, overrides = {}) {
  const row = {
    id,
    revision: 1,
    status: "review",
    scope: "science-technology",
    group: "fixture-group",
    objective: "检验一个明确知识目标",
    prompt: `题目 ${id} 的正确判断是？`,
    options: ["错误甲", "正确乙", "错误丙"],
    answer: 1,
    explanation: "正确项满足题设条件，其他项混淆了相邻概念。",
    boundary: "只检验本题声明的基础条件。",
    refs: [{ pointId: "fixture-point", tabId: "fixture-tab", sourceUnitIds: ["fixture-unit"], auditStatus: "ready-for-user-acceptance" }],
    kind: "自编学习题",
    assessmentType: "learning-card",
    examBasis: { originType: "self-authored", displayLabel: "自编学习题" },
  };
  return Object.assign(row, overrides);
}

function pack(questionRows = [question("fixture-question")]) {
  const questions = clone(questionRows);
  const targets = questions.map((item) => ({
    id: `target-${item.id}`,
    scope: item.scope,
    groupId: item.group,
  }));
  const questionTargets = questions.map((item) => ({
    questionId: item.id,
    primaryTargetIds: [`target-${item.id}`],
    supportingTargetIds: [],
    checkPurpose: "direct-recall",
  }));
  const questionSpecifications = questions.map((item) => ({
    questionId: item.id,
    primaryTargetIds: [`target-${item.id}`],
    supportingTargetIds: [],
    checkPurpose: "direct-recall",
    cognitiveLevel: "recall",
    distractorReasons: Object.fromEntries(item.options.map((_, index) => index)
      .filter((index) => index !== item.answer).map((index) => [String(index), `选项 ${index} 混淆了相邻概念。`])),
  }));
  return { version: "fixture-v1", questions, targets, targetRelations: { questionTargets }, questionSpecifications };
}

function mutate(base, callback) {
  const value = clone(base);
  callback(value);
  return value;
}

const valid = pack([
  question("fixture-question"),
  question("fixture-official-exam", {
    prompt: "某公考真题的正确判断是？",
    options: ["错误甲", "正确乙", "错误丙", "错误丁"],
    assessmentType: "exam-check",
    kind: "公考真题",
    examBasis: { originType: "official-exam", displayLabel: "公考真题", evidence: {
      examType: "国考", year: 2025, region: "中央", paper: "行政职业能力测验", questionNumber: "1",
      sourceUrl: "https://example.gov.cn/exam/1", checkedAt: "2026-10-22",
    } },
  }),
]);
const twoQuestionValid = pack([question("fixture-question-a"), question("fixture-question-b")]);
const positionQuestions = Array.from({ length: 20 }, (_, index) => question(`position-${index}`, {
  prompt: `位置分布样例 ${index} 应选择哪一项？`,
  options: ["正确项", "错误乙", "错误丙"],
  answer: 0,
}));
const duplicateQuestions = Array.from({ length: 5 }, (_, index) => question(`duplicate-${index}`, {
  prompt: "下列哪一项完整正确？",
}));

function fixture(ruleId, name, value, expectedCoViolationRuleIds = []) {
  return { ruleId, name, pack: value, expectedCoViolationRuleIds };
}

const shapeFixtures = [];
for (const [collection, mutateCollection, expectedCoViolationRuleIds] of [
  ["questions", (value, replacement, remove) => remove ? delete value.questions : value.questions = replacement, []],
  ["targets", (value, replacement, remove) => remove ? delete value.targets : value.targets = replacement, ["QG-REL-001"]],
  ["targetRelations.questionTargets", (value, replacement, remove) => remove ? delete value.targetRelations.questionTargets : value.targetRelations.questionTargets = replacement, ["QG-REL-001", "QG-SPEC-001", "QG-PURPOSE-001"]],
  ["questionSpecifications", (value, replacement, remove) => remove ? delete value.questionSpecifications : value.questionSpecifications = replacement, ["QG-SPEC-001", "QG-PURPOSE-001"]],
]) {
  for (const [state, replacement, remove] of [["缺失", undefined, true], ["非数组", {}, false], ["空数组", [], false]]) {
    shapeFixtures.push(fixture("QG-PACK-001", `${collection} ${state}`, mutate(valid, (value) => {
      mutateCollection(value, replacement, remove);
    }), expectedCoViolationRuleIds));
  }
}

const failureFixtures = [
  ...shapeFixtures,
  fixture("QG-REL-001", "单题缺少目标关系", mutate(twoQuestionValid, (value) => { value.targetRelations.questionTargets.shift(); }), ["QG-SPEC-001", "QG-PURPOSE-001"]),
  fixture("QG-SPEC-001", "单题缺少题目规格", mutate(twoQuestionValid, (value) => { value.questionSpecifications.shift(); }), ["QG-PURPOSE-001"]),
  fixture("QG-SOURCE-001", "来源状态未就绪", mutate(valid, (value) => { value.questions[0].refs[0].auditStatus = "pending"; })),
  fixture("QG-PURPOSE-001", "缺少认知标签", mutate(valid, (value) => { delete value.questionSpecifications[0].cognitiveLevel; })),
  fixture("QG-TYPE-001", "缺少学习卡或考试检验类型", mutate(valid, (value) => { delete value.questions[0].assessmentType; })),
  fixture("QG-EVIDENCE-001", "真题称谓缺少证据", mutate(valid, (value) => {
    const item = value.questions[0];
    item.assessmentType = "exam-check";
    item.options.push("错误丁");
    item.kind = "公考真题";
    item.examBasis = { originType: "official-exam", displayLabel: "公考真题", evidence: { examType: "国考", year: 2026 } };
    value.questionSpecifications[0].distractorReasons[3] = "该项与题干要求不符。";
  })),
  fixture("QG-EVIDENCE-001", "核验日期不是真实日历日期", mutate(valid, (value) => {
    value.questions[0].assessmentType = "exam-check";
    value.questions[0].options.push("错误丁");
    value.questions[0].kind = "公考真题";
    value.questions[0].examBasis = { originType: "official-exam", displayLabel: "公考真题", evidence: {
      examType: "国考", year: 2026, region: "中央", paper: "行政职业能力测验", questionNumber: "1",
      sourceUrl: "https://example.gov.cn/exam/1", checkedAt: "2026-02-30",
    } };
    value.questionSpecifications[0].distractorReasons[3] = "该项与题干要求不符。";
  })),
  fixture("QG-EVIDENCE-001", "考试年份晚于核验年份", mutate(valid, (value) => {
    value.questions[0].assessmentType = "exam-check";
    value.questions[0].options.push("错误丁");
    value.questions[0].kind = "公考真题";
    value.questions[0].examBasis = { originType: "official-exam", displayLabel: "公考真题", evidence: {
      examType: "国考", year: 2027, region: "中央", paper: "行政职业能力测验", questionNumber: "1",
      sourceUrl: "https://example.gov.cn/exam/1", checkedAt: "2026-10-22",
    } };
    value.questionSpecifications[0].distractorReasons[3] = "该项与题干要求不符。";
  })),
  fixture("QG-EVIDENCE-001", "考试年份早于合理下界", mutate(valid, (value) => {
    value.questions[0].assessmentType = "exam-check";
    value.questions[0].options.push("错误丁");
    value.questions[0].kind = "公考真题";
    value.questions[0].examBasis = { originType: "official-exam", displayLabel: "公考真题", evidence: {
      examType: "国考", year: 1993, region: "中央", paper: "行政职业能力测验", questionNumber: "1",
      sourceUrl: "https://example.gov.cn/exam/1", checkedAt: "2026-10-22",
    } };
    value.questionSpecifications[0].distractorReasons[3] = "该项与题干要求不符。";
  })),
  fixture("QG-POSITION-001", "固定答案位置达到一半", pack(positionQuestions)),
  fixture("QG-LENGTH-001", "正确项唯一最长", pack([question("length", { options: ["错误", "这是明显长于其他选项的正确陈述", "错项"], answer: 1 })])),
  fixture("QG-PROMPT-001", "通用题干重复五次", pack(duplicateQuestions)),
  fixture("QG-ABSOLUTE-001", "错误项使用绝对化措辞", pack([question("absolute", { options: ["任何情况下都完全相同", "正确乙", "错误丙"], answer: 1 })])),
  fixture("QG-EDITORIAL-001", "用户文案出现内部编辑词", pack([question("editorial", { explanation: "按正文可知第二项正确。" })])),
];

module.exports = { failureFixtures, pack, question, valid };
