const sourcePackage = require("../../models/politics-p3-v2-runtime");
const { createPoliticsAdapter } = require("./politics-adapter");

const knowledgePackage = createPoliticsAdapter(sourcePackage).buildPackage();

module.exports = {
  sourcePackage,
  knowledgePackage,
};
