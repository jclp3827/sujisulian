#!/usr/bin/env node
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'docs/knowledge-platform/implementations/evidence/politics-question-catalogue-u1-20261022.json');
const unique = values => [...new Set(values)];
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
}
const digest = value => crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
function readInputs() {
  return {
    banks: require('../miniprogram/models/politics-learning-banks-runtime'),
    applied: require('../miniprogram/models/politics-applied-questions-runtime'),
    knowledgePackage: require('../miniprogram/services/knowledge-platform/politics-runtime').knowledgePackage,
    curriculum: require('../miniprogram/models/politics-systematic-units-runtime'),
    semanticAssociations: require('../docs/knowledge-pilot/sources/politics/politics-recall-semantic-associations-v2.json'),
    semanticAssociations: require('../docs/knowledge-pilot/sources/politics/politics-recall-semantic-associations-v2.json'),
    objectiveRegistry: require('../docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json'),
  };
}
function build(inputs = readInputs()) {
  const { banks, applied, knowledgePackage: pkg, curriculum, objectiveRegistry, semanticAssociations } = inputs;
  assert.equal(banks.status, 'approved-runtime');
  assert.equal(digest(objectiveRegistry),semanticAssociations.legacyObjectiveRegistrySha256,'legacy registry fingerprint changed');
  assert.equal(digest(curriculum.lessons),semanticAssociations.curriculumLessonsSha256,'current lesson semantic review is stale');
  assert.equal(applied.status, 'candidate-runtime-approved');
  assert.equal(pkg.learningBanks.version, banks.bankVersion, 'knowledge package uses a different learning bank');
  assert.equal(curriculum.knowledgePackageVersion, pkg.packageVersion, 'curriculum knowledge package is stale');
  const units = new Map(pkg.knowledgeUnits.map(unit => [unit.id, unit]));
  const blocks = new Map(pkg.knowledgeUnits.flatMap(unit => unit.blocks.map(block => [block.id, { ...block, ownerUnitId: unit.id }])));
  const refs = new Set(pkg.sourceReferences.map(ref => ref.id));
  const lessons = new Map(curriculum.lessons.map(lesson => [lesson.id, lesson]));
  const goals = new Map();
  const objectives = objectiveRegistry.objectives.map(objective => {
    assert.ok(!goals.has(objective.objectiveId), 'duplicate objective ID');
    const lesson = lessons.get(objective.lessonId);
    assert.ok(lesson, 'legacy objective lesson is unavailable');
    assert.equal(semanticAssociations.bankVersion,banks.bankVersion,'semantic associations are stale');
    assert.equal(semanticAssociations.curriculumVersion,curriculum.curriculumVersion,'semantic curriculum association is stale');
    assert.equal(semanticAssociations.items.length,banks.recallCards.length);
    assert.ok(banks.recallCards.every(card=>semanticAssociations.items.some(row=>row.cardId===card.cardId && row.lessonIds.every(id=>lessons.has(id)))),'semantic association is incomplete');
    assert.ok(objective.unitIds.length && objective.unitIds.every(id => units.has(id)), 'objective has invalid unit');
    const entry = { objectiveId: objective.objectiveId, title: objective.title, lessonId: objective.lessonId,
      groupId: objective.groupId, unitIds: [...objective.unitIds] };
    goals.set(entry.objectiveId, entry);
    return entry;
  });
  assert.equal(objectives.length, objectiveRegistry.objectives.length, 'legacy objective references are incomplete');
  const recalls = new Map(pkg.recallItems.map(item => [item.id, item]));
  const pairs = new Map(pkg.contrastPairs.map(item => [item.confusionItemId, item]));
  const appliedGroups = new Map(applied.groups.map(group => [group.groupId, group]));
  const seen = new Set();
  const items = [];
  function add({ itemId, kind, subtype, primaryUnitIds, objectiveBindings, sourceGroups, version, reviewState, approvalState, source, consumers, assessment, relationId = null }) {
    assert.ok(typeof itemId === 'string' && !seen.has(itemId), `duplicate catalogue item: ${itemId}`);
    seen.add(itemId);
    assert.ok(primaryUnitIds.length && primaryUnitIds.every(id => units.has(id)), `${itemId}: unknown unit`);
    assert.ok(objectiveBindings.length, `${itemId}: no exact objective binding`);
    for (const binding of objectiveBindings) {
      assert.ok(goals.has(binding.objectiveId), `${itemId}: unknown objective ${binding.objectiveId}`);
      const goal = goals.get(binding.objectiveId);
      if (binding.role !== 'supporting') assert.ok(goal.unitIds.includes(binding.unitId), `${itemId}: objective/unit mismatch`);
      // Supporting IDs are explicit approved bank bindings and may cross lesson units.
      binding.targetUnitIds = [...goal.unitIds];
    }
    assert.ok(version && reviewState, `${itemId}: missing version or review state`);
    const sourceRoles = new Map();
    for (const [role, ids] of Object.entries(sourceGroups)) {
      assert.ok(Array.isArray(ids), `${itemId}: missing ${role} sources`);
      for (const id of ids) {
        assert.ok(blocks.has(id), `${itemId}: unknown source block ${id}`);
        if (!sourceRoles.has(id)) sourceRoles.set(id, []);
        if (!sourceRoles.get(id).includes(role)) sourceRoles.get(id).push(role);
      }
    }
    assert.ok(sourceRoles.size, `${itemId}: no source blocks`);
    const sourceBlockIds = [...sourceRoles.keys()];
    const sourceRefIds = unique(sourceBlockIds.flatMap(id => blocks.get(id).sourceRefIds));
    assert.ok(sourceRefIds.length && sourceRefIds.every(id => refs.has(id)), `${itemId}: missing source reference`);
    const unitIds = unique([...primaryUnitIds, ...sourceBlockIds.map(id => blocks.get(id).ownerUnitId)]);
    items.push({ itemId, kind, subtype, unitId: primaryUnitIds.length === 1 ? primaryUnitIds[0] : null,
      primaryUnitIds: unique(primaryUnitIds), unitIds, objectiveIds: unique(objectiveBindings.map(binding => binding.objectiveId)),
      objectiveBindings, sourceBlockIds, sourceBindings: sourceBlockIds.map(blockId => ({ blockId, roles: sourceRoles.get(blockId) })),
      sourceRefIds, version, reviewState, approvalState, source, consumers, assessment, relationId });
  }
  for (const card of banks.recallCards) {
    const runtime = recalls.get(card.cardId);
    assert.ok(runtime && runtime.pointId === card.unitId, `${card.cardId}: missing runtime recall projection`);
    assert.equal(runtime.prompt, card.prompt, `${card.cardId}: recall projection prompt drift`);
    assert.equal(runtime.answer, card.answer, `${card.cardId}: recall projection answer drift`);
    assert.equal(runtime.primaryObjectiveId, card.primaryObjectiveId, `${card.cardId}: primary objective drift`);
    assert.deepEqual(runtime.supportingObjectiveIds, card.supportingObjectiveIds || [], `${card.cardId}: supporting objective drift`);
    add({ itemId: card.cardId, kind: 'recall', subtype: card.cardType, primaryUnitIds: [card.unitId],
      objectiveBindings: [{ objectiveId: card.primaryObjectiveId, role: 'primary', unitId: card.unitId },
        ...(card.supportingObjectiveIds || []).map(objectiveId => ({ objectiveId, role: 'supporting', unitId: card.unitId }))],
      sourceGroups: { answer: card.sourceBlockIds, pitfall: card.errorSourceBlockIds, remedy: card.remedy.sourceBlockIds },
      version: runtime.contentVersion, reviewState: card.reviewState, approvalState: card.status,
      source: { artifactId: banks.id, bankVersion: banks.bankVersion, collection: 'recallCards', idField: 'cardId', id: card.cardId },
      consumers: ['exam', 'daily', 'qa'], assessment: 'recall-self-report' });
  }
  for (const question of applied.questions) {
    const group = appliedGroups.get(question.groupId);
    assert.ok(group && group.questionIds.includes(question.questionId) && group.unitId === question.unitId, `${question.questionId}: invalid group`);
    assert.ok(lessons.has(question.lessonId) && goals.get(question.primaryObjectiveId)?.lessonId === question.lessonId, `${question.questionId}: invalid lesson`);
    add({ itemId: question.questionId, kind: 'application', subtype: question.questionType, primaryUnitIds: [question.unitId],
      objectiveBindings: [{ objectiveId: question.primaryObjectiveId, role: 'primary', unitId: question.unitId }],
      sourceGroups: { evidence: question.sourceBlockIds }, version: question.contentVersion, reviewState: question.reviewState, approvalState: question.status,
      source: { artifactId: applied.id, bankVersion: applied.bankVersion, collection: 'questions', idField: 'questionId', id: question.questionId },
      consumers: ['daily', 'qa'], assessment: 'choice-correctness' });
  }
  for (const item of banks.confusionItems) {
    const runtime = pairs.get(item.itemId);
    assert.ok(runtime && runtime.leftPointId === item.left.unitId && runtime.rightPointId === item.right.unitId, `${item.itemId}: invalid contrast projection`);
    assert.deepEqual(runtime.initialCheck, item.initialCheck, `${item.itemId}: initial check drift`);
    assert.deepEqual(runtime.variantCheck, item.variantCheck, `${item.itemId}: retest drift`);
    const sourceGroups = { left: item.left.sourceBlockIds, right: item.right.sourceBlockIds,
      comparison: item.sourceBlockIds, initial: item.initialCheck.sourceBlockIds, retest: item.variantCheck.sourceBlockIds };
    for (const side of ['left', 'right']) assert.ok(item[side].sourceBlockIds.every(id => blocks.get(id)?.ownerUnitId === item[side].unitId), `${item.itemId}: misplaced ${side} source`);
    add({ itemId: item.itemId, kind: 'confusion', subtype: 'concept-contrast', primaryUnitIds: [item.left.unitId, item.right.unitId],
      objectiveBindings: ['left', 'right'].flatMap(side => item[side].objectiveIds.map(objectiveId => ({ objectiveId, role: side, unitId: item[side].unitId }))),
      sourceGroups, version: runtime.contentVersion, reviewState: item.reviewState, approvalState: item.status,
      source: { artifactId: banks.id, bankVersion: banks.bankVersion, collection: 'confusionItems', idField: 'itemId', id: item.itemId },
      consumers: ['confusion'], assessment: 'contrast-initial-and-retest', relationId: item.relationId });
  }
  const indexes = { byKind: {}, byObjectiveId: Object.fromEntries(objectives.map(goal => [goal.objectiveId, []])), byUnitId: {}, bySourceBlockId: {}, byConsumer: {} };
  for (const item of items) {
    for (const [name, keys] of [['byKind', [item.kind]], ['byObjectiveId', item.objectiveIds], ['byUnitId', item.unitIds], ['bySourceBlockId', item.sourceBlockIds], ['byConsumer', item.consumers]]) {
      for (const key of keys) { if (!indexes[name][key]) indexes[name][key] = []; indexes[name][key].push(item.itemId); }
    }
  }
  const body = { schemaVersion: 1, id: 'politics-question-catalogue-v1', authority: 'derived-read-only-index', consumerScope: 'primary-learning-entry',
    sourceVersions: { knowledgePackage: pkg.packageVersion, learningBank: banks.bankVersion, appliedBank: applied.bankVersion,
      curriculum: curriculum.curriculumVersion, objectiveRegistry: objectiveRegistry.id },
    sourceDigests: Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, digest(value)])),
    counts: { entries: items.length, recall: banks.recallCards.length, application: applied.questions.length, confusion: banks.confusionItems.length,
      objectives: objectives.length, objectivesWithEntries: Object.values(indexes.byObjectiveId).filter(ids => ids.length).length },
    objectiveBindingMeaning: 'Legacy IDs retained for traceability; use semanticAssociations for current lesson relations, not a coverage percentage.',
    semanticAssociations, objectives, items, indexes };
  return { ...body, catalogueVersion: `catalogue-${digest(body).slice(0, 12)}` };
}
function serialize(value) { return JSON.stringify(value, null, 2) + '\n'; }
function main() {
  const catalogue = build(), output = serialize(catalogue);
  if (process.argv.includes('--check')) assert.ok(fs.existsSync(OUTPUT) && fs.readFileSync(OUTPUT, 'utf8') === output, 'question catalogue is stale; rebuild it');
  else fs.writeFileSync(OUTPUT, output);
  console.log(JSON.stringify({ status: 'passed', checkOnly: process.argv.includes('--check'), version: catalogue.catalogueVersion, ...catalogue.counts }));
}
if (require.main === module) main();
module.exports = { build, readInputs, serialize };
