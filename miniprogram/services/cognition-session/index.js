const schulte = require("./modules/schulte");
const rollingSchulte = require("./modules/rolling-schulte");
const flashMemory = require("./modules/flash-memory");
const flashCalc = require("./modules/flash-calc");

const runtimes = {
  schulte,
  "rolling-schulte": rollingSchulte,
  "flash-memory": flashMemory,
  "flash-calc": flashCalc,
};

function getCognitionSessionRuntime(type) {
  return runtimes[type] || null;
}

module.exports = {
  getCognitionSessionRuntime,
};
