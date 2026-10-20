const rollout = require("./rollout");
const politicsAdapter = require("./politics-adapter");
const context = require("./context");
const projectors = require("./projectors");
const learning = require("./learning");
const displayPreferences = require("./display-preferences");
const surfaceLanguage = require("./surface-language");

module.exports = {
  ...rollout,
  ...politicsAdapter,
  ...context,
  ...projectors,
  ...learning,
  ...displayPreferences,
  ...surfaceLanguage,
};
