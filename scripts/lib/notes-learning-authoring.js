// These purposes describe the requested cognitive action; numbers and formulas alone do not classify a task.
const INTENTS = ['select-method', 'find-error', 'identify-signal', 'compare-knowledge', 'bounded-trial'];
const TASK_TYPES = ['recall', 'contrast', 'bounded-trial', 'complete-application'];
function validateMethodQuestion(question) {
  if (!INTENTS.includes(question.methodIntent) || !question.signal || !question.boundary)
    throw new Error(`${question.id}: 方法题缺辨析目的、识别依据或适用边界`);
  if (!['contrast', 'bounded-trial'].includes(question.assessment?.taskType)
    || !question.assessment.comparisonGroupId || question.assessment.requiresCalculation !== false)
    throw new Error(`${question.id}: 方法题须登记对照关系或小任务，不以具体计算求值为终点`);
  if (question.assessment.taskType === 'bounded-trial' && !question.assessment.decisionPoint)
    throw new Error(`${question.id}: 小任务缺当前决策点`);
}
function buildMethodQuestion(base, teaching) {
  const question = { ...JSON.parse(JSON.stringify(base)), ...teaching, exerciseKinds: ['method'] };
  validateMethodQuestion(question); return question;
}
module.exports = { INTENTS, TASK_TYPES, validateMethodQuestion, buildMethodQuestion };
