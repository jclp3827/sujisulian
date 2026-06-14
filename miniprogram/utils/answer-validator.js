function validateAnswer(question, userAnswer, item = {}) {
  const normalized = String(userAnswer).trim();
  if (!question || !normalized) {
    return false;
  }

  if (question.answerMode === "compare") {
    return normalized === String(question.answer);
  }

  if (item.tolerancePercent) {
    const expected = Number(question.answer);
    const actual = Number(normalized);
    if (Number.isNaN(expected) || Number.isNaN(actual)) {
      return false;
    }

    const tolerance = Math.abs(expected) * (item.tolerancePercent / 100);
    return Math.abs(actual - expected) <= tolerance;
  }

  return normalized === String(question.answer);
}

module.exports = {
  validateAnswer,
};
