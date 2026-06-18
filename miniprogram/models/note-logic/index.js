const moduleInfo = require('./meta.js')
const categories = require('./categories.js')
const points = [
  ...require('./points/analogy.js'),
  ...require('./points/argument.js'),
  ...require('./points/definition.js'),
  ...require('./points/formal.js'),
  ...require('./points/graphic.js'),
  ...require('./points/quick-kill.js'),
]

module.exports = {
  module: moduleInfo,
  categories,
  points,
}
