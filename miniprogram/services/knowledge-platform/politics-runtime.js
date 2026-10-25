const sourcePackage = require("../../models/politics-p3-v2-runtime");
const runtimeLearningBanks = require("../../models/politics-learning-banks-runtime");
const { createPoliticsAdapter } = require("./politics-adapter");
const { applyPoliticsLearningBanks } = require("./politics-learning-banks");

const knowledgePackage = applyPoliticsLearningBanks(
  createPoliticsAdapter(sourcePackage).buildPackage(),
  runtimeLearningBanks,
);

module.exports = {
  sourcePackage,
  runtimeLearningBanks,
  knowledgePackage,
};
