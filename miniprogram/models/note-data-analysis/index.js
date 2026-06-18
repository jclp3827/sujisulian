const moduleInfo = require('./meta.js')
const categories = require('./categories.js')
const points = [
  ...require('./points/average.js'),
  ...require('./points/basic.js'),
  ...require('./points/compare.js'),
  ...require('./points/growth.js'),
  ...require('./points/mixture.js'),
  ...require('./points/ratio.js'),
  ...require('./points/special.js'),
  ...require('./points/speed-calc.js'),
]

module.exports = {
  module: moduleInfo,
  categories,
  points,
}
