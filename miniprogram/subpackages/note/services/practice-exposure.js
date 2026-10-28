const groupsBySource = require('../models/example-exposure-map');
const { createEngine } = require('./practice-session');

function recordExampleExposure(api, subjectId, pointId, blockFingerprint) {
  const groups = groupsBySource[JSON.stringify([subjectId, pointId, blockFingerprint])] || [];
  if (!groups.length) return;
  createEngine({ resources: [], materials: [], entryPlans: {} }, api).recordExposures(groups);
}

module.exports = { recordExampleExposure };
