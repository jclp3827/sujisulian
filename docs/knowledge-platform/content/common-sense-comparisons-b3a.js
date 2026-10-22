// B3a: scoped comparison candidates; existing questions remain the target authority.
const { questions } = require("./common-sense-learning-s4");
const byId = Object.fromEntries(questions.map((q) => [q.id, q]));
function comparison(id, groupId, title, coverage, excludes, items, caution) {
  const rows = items.map(([questionId, label, condition, distinction]) => ({
    label, condition, distinction, questionIds: [questionId], refs: byId[questionId].refs,
  }));
  const questionIds = items.map((i) => i[0]);
  const refs = [...new Map(rows.flatMap((r) => r.refs).map((r) => [r.pointId + ":" + r.tabId, r])).values()];
  return { id, revision: 1, status: "review", scope: "law", groupId, title, coverage, excludes, caution,
    questionIds, initialQuestionId: questionIds[0], recheckQuestionIds: questionIds.slice(1), rows, refs,
    verification: byId[questionIds[0]].verification };
}
module.exports = [
  comparison("minor-capacity-comparison", "minor-capacity", "未成年人的三种判断条件", "只比较本组三题中的年龄、辨认能力和主要生活来源条件。", [
    "不覆盖所有自然人的民事行为能力认定情形。", "不据此直接判断某个合同或其他具体行为的效力。",
  ], [
    ["capacity-under-eight", "无民事行为能力", "不满 8 周岁。", "先看年龄；民事行为能力与民事权利能力应分开。"],
    ["capacity-eight-plus", "限制民事行为能力", "已满 8 周岁但未满 18 周岁，能辨认自己的行为，且不适用劳动收入例外。", "通常属于限制民事行为能力；不等于所有行为都无效。"],
    ["capacity-labor", "视为完全民事行为能力", "已满 16 周岁但未满 18 周岁，能辨认自己的行为，以自己的劳动收入为主要生活来源。", "年龄和主要生活来源条件须同时核对，不能只看有无收入。"],
  ], "不能只背 8、16、18 三个数字；辨认能力、生活来源和行为效力须分别核对。"),
  comparison("civil-principles-comparison", "civil-principles-compare", "平等、自愿、公平分别看什么", "只对照三项原则的直接表述及本组声明的边界。", [
    "不覆盖民法全部基本原则。", "不把复杂案例仅凭单个关键词归为某一原则。",
  ], [
    ["civil-equality", "平等原则", "关注民事主体的法律地位。", "辨认法律地位是否平等，避免把平等与公平混成同一个词。"],
    ["civil-voluntary", "自愿原则", "关注按自己的意思设立、变更、终止民事法律关系。", "辨认意思自治；自愿仍受法律和公序良俗约束。"],
    ["civil-fairness", "公平原则", "关注各方权利与义务是否合理确定。", "辨认权利义务的合理安排，不能只凭字面出现公平二字就套用。"],
  ], "现实案例可能同时涉及多项原则；本组只练直接表述与适用边界的区别。"),
];
