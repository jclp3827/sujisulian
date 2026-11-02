const sourcePackage = require("../models/politics-p3-v2-compact");
const runtimeLearningBanks = require("../models/politics-learning-banks-compact");
const { createPoliticsAdapter } = require("../../../services/knowledge-platform/politics-adapter");
const { applyPoliticsLearningBanks } = require("../../../services/knowledge-platform/politics-learning-banks");

const knowledgePackage = applyPoliticsLearningBanks(
  createPoliticsAdapter(sourcePackage).buildPackage(),
  runtimeLearningBanks,
);

module.exports = {
  sourcePackage,
  runtimeLearningBanks,
  knowledgePackage,
};
