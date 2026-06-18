const moduleInfo = require('./meta.js')
const categories = require('./categories.js')
const points = [
  ...require('./points/applied.js'),
  ...require('./points/combinatorics.js'),
  ...require('./points/concentration.js'),
  ...require('./points/cycle-date.js'),
  ...require('./points/equation.js'),
  ...require('./points/extremum.js'),
  ...require('./points/geometry.js'),
  ...require('./points/inclusion.js'),
  ...require('./points/number-basic.js'),
  ...require('./points/number-sequence.js'),
  ...require('./points/profit.js'),
  ...require('./points/travel.js'),
  ...require('./points/work.js'),
]

module.exports = {
  module: moduleInfo,
  categories,
  points,
}
