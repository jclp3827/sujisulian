// Developer-only read-only catalogue. Original banks own content; session services own results.
const fs = require('node:fs');
const path = require('node:path');
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
function createPoliticsQuestionCatalogue(artifact, expectedVersions = {}) {
  if (artifact?.schemaVersion !== 1 || artifact.authority !== 'derived-read-only-index' ||
    !Array.isArray(artifact.items) || !Array.isArray(artifact.objectives) || !artifact.indexes) throw new Error('Invalid question catalogue');
  for (const [key, value] of Object.entries(expectedVersions)) {
    if (artifact.sourceVersions?.[key] !== value) throw new Error(`Stale question catalogue: ${key}`);
  }
  const data = freeze(JSON.parse(JSON.stringify(artifact)));
  const byId = new Map(data.items.map(item => [item.itemId, item]));
  if (byId.size !== data.items.length) throw new Error('Duplicate question catalogue item');
  for (const index of Object.values(data.indexes)) {
    if (!index || typeof index !== 'object') throw new Error('Invalid catalogue index');
    for (const ids of Object.values(index)) {
      if (!Array.isArray(ids) || new Set(ids).size !== ids.length || ids.some(id => !byId.has(id))) throw new Error('Invalid catalogue index entry');
    }
  }
  const allowed = ['kind', 'objectiveId', 'unitId', 'sourceBlockId', 'consumer'];
  const indexNames = { kind: 'byKind', objectiveId: 'byObjectiveId', unitId: 'byUnitId', sourceBlockId: 'bySourceBlockId', consumer: 'byConsumer' };
  function list(filters = {}) {
    if (!filters || typeof filters !== 'object' || Array.isArray(filters) || Object.keys(filters).some(key => !allowed.includes(key))) throw new Error('Invalid catalogue filters');
    const entries = Object.entries(filters);
    if (entries.some(([, value]) => typeof value !== 'string' || !value)) return Object.freeze([]);
    const idsFor = ([key, value]) => {
      const index = data.indexes[indexNames[key]];
      return Object.prototype.hasOwnProperty.call(index, value) ? index[value] : [];
    };
    let ids = entries.length ? idsFor(entries[0]) : [...byId.keys()];
    for (const entry of entries.slice(1)) { const matching = new Set(idsFor(entry)); ids = ids.filter(id => matching.has(id)); }
    return Object.freeze(ids.map(id => byId.get(id)));
  }
  return Object.freeze({
    get: itemId => byId.get(itemId) || null,
    list,
    byObjective: (objectiveId, filters = {}) => list({ ...filters, objectiveId }),
    byUnit: (unitId, filters = {}) => list({ ...filters, unitId }),
    bySource: (sourceBlockId, filters = {}) => list({ ...filters, sourceBlockId }),
    objective: objectiveId => data.objectives.find(goal => goal.objectiveId === objectiveId) || null,
    summary: () => data.counts,
    versions: () => data.sourceVersions,
    version: data.catalogueVersion,
  });
}
function getPoliticsQuestionCatalogue() {
  const root = path.resolve(__dirname, '../..');
  const artifact = JSON.parse(fs.readFileSync(path.join(root,
    'docs/knowledge-platform/implementations/evidence/politics-question-catalogue-u1-20261022.json'), 'utf8'));
  const { build } = require('../build-politics-question-catalogue');
  // Compare full source fingerprints, not only declared versions.
  if (JSON.stringify(artifact) !== JSON.stringify(build())) throw new Error('Stale or invalid question catalogue; rebuild it');
  const { knowledgePackage, runtimeLearningBanks } = require('../../miniprogram/services/knowledge-platform/politics-runtime');
  return createPoliticsQuestionCatalogue(artifact, {
    knowledgePackage: knowledgePackage.packageVersion,
    learningBank: runtimeLearningBanks.bankVersion,
    appliedBank: require('../../miniprogram/models/politics-applied-questions-runtime').bankVersion,
    curriculum: require('../../miniprogram/models/politics-systematic-units-runtime').curriculumVersion,
  });
}
module.exports = { createPoliticsQuestionCatalogue, getPoliticsQuestionCatalogue };
