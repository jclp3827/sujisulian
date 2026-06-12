const { generateBasicCalculationSet } = require("./basic-calculation");
const { generateDataAnalysisSet } = require("./data-analysis");

function generateQuestionSet(sectionId, trainingId, questionCount) {
  if (sectionId === "calculation") {
    return generateBasicCalculationSet(trainingId, questionCount);
  }

  if (sectionId === "data-analysis") {
    return generateDataAnalysisSet(trainingId, questionCount);
  }

  return [];
}

module.exports = {
  generateQuestionSet,
};
