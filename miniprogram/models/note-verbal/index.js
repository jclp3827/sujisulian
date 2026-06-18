const moduleInfo = require('./meta.js')
const categories = require('./categories.js')
const points = [
  ...require('./points/cloze.js'),
  ...require('./points/detail.js'),
  ...require('./points/main-idea.js'),
  ...require('./points/passage-reading.js'),
  ...require('./points/sentence.js'),
  ...require('./points/vocabulary.js'),
]

module.exports = {
  module: moduleInfo,
  categories,
  points,
}
