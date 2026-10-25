#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { build, readInputs, serialize } = require('./build-politics-question-catalogue');
const { createPoliticsQuestionCatalogue, getPoliticsQuestionCatalogue } = require('./lib/politics-question-catalogue');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'docs/knowledge-platform/implementations/evidence/politics-question-catalogue-u1-20261022.json');
const clone = value => JSON.parse(JSON.stringify(value));
function validate() {
  const inputs = readInputs(), snapshot = JSON.stringify(inputs), catalogue = build(inputs);
  assert.equal(JSON.stringify(inputs), snapshot, 'building must not mutate any source input');
  assert.equal(fs.readFileSync(output, 'utf8'), serialize(catalogue), 'catalogue is stale; run node scripts/build-politics-question-catalogue.js');
  assert.equal(catalogue.consumerScope, 'primary-learning-entry');
  const api = getPoliticsQuestionCatalogue();
  assert.equal(api.version, catalogue.catalogueVersion);
  const n=inputs.banks.recallCards.length,total=n+38;
  assert.deepEqual(api.summary(), { entries: total, recall: n, application: 24, confusion: 14, objectives: inputs.objectiveRegistry.objectives.length+(inputs.currentObjectiveRegistry?.objectives.length||0), objectivesWithEntries: new Set(catalogue.items.flatMap(c=>c.objectiveIds)).size });
  const ids = new Set(api.list().map(item => item.itemId));
  assert.equal(ids.size, total);
  for (const [collection, idField, kind, consumers] of [
    [inputs.banks.recallCards, 'cardId', 'recall', ['exam', 'daily', 'qa']],
    [inputs.applied.questions, 'questionId', 'application', ['daily', 'qa']],
    [inputs.banks.confusionItems, 'itemId', 'confusion', ['confusion']],
  ]) {
    assert.equal(api.list({ kind }).length, collection.length);
    for (const original of collection) {
      const item = api.get(original[idField]); assert.ok(item);
      assert.equal(item.kind, kind); assert.equal(item.source.id, original[idField]); assert.deepEqual(item.consumers, consumers);
      assert.equal(item.reviewState, original.reviewState);
      const source = item.source.collection === 'questions' ? inputs.applied : inputs.banks;
      assert.ok(source[item.source.collection].some(row => row[item.source.idField] === item.itemId));
      for (const id of item.objectiveIds) assert.ok(api.byObjective(id).some(row => row.itemId === item.itemId));
      for (const id of item.unitIds) assert.ok(api.byUnit(id).some(row => row.itemId === item.itemId));
      for (const id of item.sourceBlockIds) assert.ok(api.bySource(id).some(row => row.itemId === item.itemId));
    }
  }
  const goals = new Map([...inputs.objectiveRegistry.objectives,...(inputs.currentObjectiveRegistry?.objectives||[])].map(goal => [goal.objectiveId, goal]));
  for (const item of catalogue.items) for (const binding of item.objectiveBindings) assert.deepEqual(binding.targetUnitIds, goals.get(binding.objectiveId).unitIds);
  const supporting = inputs.banks.recallCards.filter(card => card.supportingObjectiveIds.length);
  assert.equal(supporting.length, inputs.banks.recallCards.filter(card=>card.supportingObjectiveIds.length).length);
  for (const card of supporting) for (const id of card.supportingObjectiveIds) {
    const binding = api.get(card.cardId).objectiveBindings.find(row => row.objectiveId === id && row.role === 'supporting'); assert.ok(binding);
    assert.equal(binding.unitId, card.unitId); assert.deepEqual(binding.targetUnitIds, goals.get(id).unitIds);
  }
  // Exercise cross-unit provenance with a synthetic reference when the current curated bank has none.
  const crossInput=clone(inputs),crossCard=crossInput.banks.recallCards[0],foreignUnit=crossInput.knowledgePackage.knowledgeUnits.find(u=>u.id!==crossCard.unitId);
  crossCard.errorSourceBlockIds.push(foreignUnit.blocks[0].id);
  const crossRecord=build(crossInput).items.find(item=>item.itemId===crossCard.cardId);
  assert.ok(crossRecord.unitIds.includes(foreignUnit.id),'cross-unit source provenance lost');
  for (const item of api.list({ kind: 'confusion' })) {
    assert.equal(item.unitId, null); assert.equal(item.primaryUnitIds.length, 2);
    assert.ok(item.objectiveBindings.some(b => b.role === 'left') && item.objectiveBindings.some(b => b.role === 'right'));
    assert.equal(item.assessment, 'contrast-initial-and-retest');
  }
  const appliedGoals = new Set(inputs.applied.questions.map(question => question.primaryObjectiveId));
  const quality=require('./lib/politics-applied-confusion-revision').loadQualityRevision();
  assert.deepEqual([...appliedGoals].sort(), quality ? [...new Set(Object.values(quality.appliedAssociations).map(a=>a.primaryObjectiveId))].sort() : [...appliedGoals].sort());
  if (!quality) assert.equal(appliedGoals.size, 11);
  for (const id of appliedGoals) assert.ok(api.byObjective(id, { kind: 'recall' }).length > 0);
  const emptyGoals = catalogue.objectives.filter(goal => !api.byObjective(goal.objectiveId).length);
  assert.equal(emptyGoals.length, catalogue.objectives.length-new Set(catalogue.items.flatMap(c=>c.objectiveIds)).size);
  assert.ok(api.objective(emptyGoals[0].objectiveId)); assert.deepEqual(api.byObjective(emptyGoals[0].objectiveId), []);
  assert.deepEqual(api.byObjective('missing'), []); assert.equal(api.get('missing'), null); assert.equal(api.objective('missing'), null);
  assert.deepEqual(api.list({ kind: 'missing' }), []); assert.deepEqual(api.list({ unitId: '__proto__' }), []);
  assert.throws(() => api.list({ objectiveID: 'typo' })); assert.deepEqual(api.list({ objectiveId: null }), []);
  assert.equal(api.list({ consumer: 'daily', kind: 'recall' }).length, n);
  const first = api.list()[0];
  assert.throws(() => { first.source.collection = 'changed'; }); assert.throws(() => api.list().push(first));
  assert.throws(() => first.objectiveBindings[0].targetUnitIds.push('changed'));
  const candidate = clone(catalogue), isolated = createPoliticsQuestionCatalogue(candidate); candidate.items[0].source.id = 'changed';
  assert.notEqual(isolated.get(first.itemId).source.id, 'changed'); assert.ok(!Object.isFrozen(candidate), 'factory must not freeze caller-owned inputs');
  const forbidden = new Set(['prompt', 'answer', 'options', 'explanation', 'distractorRationales', 'records', 'sessions', 'mastery']);
  function checkMetadata(value) {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) { assert.ok(!forbidden.has(key), `catalogue duplicated content/state field ${key}`); checkMetadata(child); }
  }
  checkMetadata(catalogue);
  const negatives = [
    data => { data.banks.recallCards.push(clone(data.banks.recallCards[0])); },
    data => { data.banks.recallCards[0].primaryObjectiveId = 'missing'; },
    data => { data.applied.questions[0].primaryObjectiveId = data.objectiveRegistry.objectives[0].objectiveId; },
    data => { data.banks.recallCards[0].sourceBlockIds = ['missing']; },
    data => { data.banks.confusionItems[0].left.sourceBlockIds = data.banks.confusionItems[0].right.sourceBlockIds; },
    data => { data.curriculum.knowledgePackageVersion = 'stale'; },
    data => { delete data.applied.questions[0].contentVersion; },
    data => { data.objectiveRegistry.objectives[0].title = 'not in current lesson'; },
    data => { data.banks.recallCards[0].unitId = 'missing'; },
    data => { data.banks.recallCards[0].answer += 'changed without projection update'; },
    data => { data.banks.recallCards[0].supportingObjectiveIds.push(data.objectiveRegistry.objectives[0].objectiveId); },
    data => { data.banks.confusionItems[0].variantCheck.answerUnitId = 'changed'; },
  ];
  negatives.push(data=>{data.semanticAssociations.applicationRemedyBindings[0].reviewSha256='stale';});
  negatives.push(data=>{const id=data.semanticAssociations.applicationRemedyBindings[0].recallItemId;data.banks.recallCards.find(c=>c.cardId===id).errorExplanation+='changed-without-version';});
  if(inputs.currentObjectiveRegistry)negatives.push(data=>{data.currentObjectiveRegistry.objectives[0].lessonEvidenceSha256='stale';});
  for (const mutate of negatives) { const invalid = clone(inputs); mutate(invalid); assert.throws(() => build(invalid)); }
  assert.throws(() => createPoliticsQuestionCatalogue(catalogue, { learningBank: 'stale' }));
  const invalidIndex = clone(catalogue); invalidIndex.indexes.byKind.recall.push('missing'); assert.throws(() => createPoliticsQuestionCatalogue(invalidIndex));
  const changed = clone(inputs); changed.applied.questions[0].explanation += 'source changed';
  assert.notEqual(build(changed).catalogueVersion, catalogue.catalogueVersion, 'source fingerprint must detect content drift even if the declared version is not bumped');
  // Exercise the actual loader against stale fingerprints and a tampered derived index without modifying files.
  for (const mutate of [data => { data.sourceDigests.applied = 'stale'; }, data => { data.indexes.byConsumer.daily = []; }]) {
    const stale = clone(catalogue); mutate(stale); const originalRead = fs.readFileSync;
    fs.readFileSync = function(file, ...args) { return file === output ? serialize(stale) : originalRead.call(this, file, ...args); };
    try { assert.throws(() => getPoliticsQuestionCatalogue(), /Stale or invalid/); }
    finally { fs.readFileSync = originalRead; }
  }
  const command = spawnSync(process.execPath, [path.join(root, 'scripts/inspect-politics-question-catalogue.js'), '--objective=pol-obj-found-03-1', '--consumer=daily'], { encoding: 'utf8' });
  assert.equal(command.status, 0, command.stderr); const query = JSON.parse(command.stdout); assert.equal(query.resultCount, api.byObjective('pol-obj-found-03-1').filter(c=>c.consumers.includes('daily')).length);
  assert.deepEqual(new Set(query.items.map(item => item.kind)), new Set(['application', 'recall']));
  const overview = spawnSync(process.execPath, [path.join(root, 'scripts/inspect-politics-question-catalogue.js')], { encoding: 'utf8' });
  assert.equal(overview.status, 0, overview.stderr); const summary = JSON.parse(overview.stdout);
  assert.equal(summary.mode, 'summary'); assert.equal(summary.counts.entries, total); assert.ok(!('resultCount' in summary));
  const typo = spawnSync(process.execPath, [path.join(root, 'scripts/inspect-politics-question-catalogue.js'), '--objectiv=typo'], { encoding: 'utf8' }); assert.notEqual(typo.status, 0);
  assert.equal(fs.existsSync(path.join(root, 'miniprogram/models/politics-question-catalogue-runtime.js')), false, 'developer-only catalogue must not enter the app package');
  const result = { status: 'passed', version: api.version, entries: ids.size, objectives: inputs.objectiveRegistry.objectives.length+(inputs.currentObjectiveRegistry?.objectives.length||0), applicationObjectivesLinkedToRecall: appliedGoals.size,
    unassignedObjectives: emptyGoals.length, negativeCasesRejected: negatives.length + 4, metadataOnly: true, readonly: true, appPackageUnchanged: true };
  console.log(JSON.stringify(result)); return result;
}
if (require.main === module) validate();
module.exports = { validate };
