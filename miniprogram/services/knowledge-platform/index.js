const rollout = require("./rollout");
const politicsAdapter = require("./politics-adapter");
const context = require("./context");
const projectors = require("./projectors");

module.exports = {
  ...rollout,
  ...politicsAdapter,
  ...context,
  ...projectors,
};
