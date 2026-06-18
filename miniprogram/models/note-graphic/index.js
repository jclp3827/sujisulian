const moduleInfo = require('./meta.js')
const categories = require('./categories.js')
const points = [
  ...require('./points/hint.js'),
  ...require('./points/overview.js'),
  ...require('./points/position.js'),
  ...require('./points/qualitative.js'),
  ...require('./points/quantitative.js'),
  ...require('./points/special-type.js'),
  ...require('./points/stereoscopic.js'),
]

module.exports = {
  module: moduleInfo,
  categories,
  points,
}
