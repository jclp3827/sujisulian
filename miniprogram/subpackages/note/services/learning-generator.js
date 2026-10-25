const { generateQuestionSet } = require('../../../services/train-generator/index');
const { getTrainingItem } = require('../../../models/train-catalog');
const { validateAnswer } = require('../../../utils/answer-validator');
const VERSION = 'legacy-data-analysis-v1';
const SUPPORTED = ['growth-pre', 'growth-inc'];
function recipeSupported(recipe) {
  return recipe.sectionId === 'data-analysis' && SUPPORTED.includes(recipe.generatorId)
    && recipe.generatorVersion === VERSION && !getTrainingItem(recipe.sectionId, recipe.generatorId)?.standalonePage;
}
function generate(recipe, count) {
  if (!recipeSupported(recipe)) throw new Error('不支持的生成配方');
  const training = getTrainingItem(recipe.sectionId, recipe.generatorId);
  return generateQuestionSet(recipe.sectionId, recipe.generatorId, count).map((q) => ({
    prompt: q.prompt, contextLines: q.contextLines || [], promptFormula: q.promptFormula || null,
    answerMode: q.answerMode || 'numeric', answer: String(q.answer),
    tolerancePercent: training.tolerancePercent || 0, explanation: q.explanation || q.analysis || `参考结果：${q.answer}。请结合对应笔记核对计算方法。`,
    legacyQuestionId: q.id,
  }));
}
function checkAnswer(item, value) {
  if (value === null || value === undefined || String(value).trim() === '') return false;
  if (item.answerMode === 'single-choice') return String(item.answer) === String(value);
  return validateAnswer(item, value, { tolerancePercent: item.tolerancePercent || 0 });
}
module.exports = { VERSION, SUPPORTED, recipeSupported, generate, checkAnswer };
