// Developer-only dependency and remedy metadata. No content or learning state is stored here.
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
}
const digest = value => crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
const unique = values => [...new Set(values)];
// Source fields are declared contracts; labels and title similarity are never used as links.
function blockReferences(value, result = []) {
  if (!value || typeof value !== 'object') return result;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'sourceBlockIds' && Array.isArray(child)) result.push(...child);
    else if (['sourceBlockId', 'blockId'].includes(key) && typeof child === 'string') result.push(child);
    else if (child && typeof child === 'object') blockReferences(child, result);
  }
  return unique(result);
}
function snapshot(inputs) {
  const { banks, applied, knowledgePackage: pkg, curriculum, objectiveRegistry } = inputs;
  const blockOwners = new Map(pkg.knowledgeUnits.flatMap(unit => unit.blocks.map(block => [block.id, unit.id])));
  const blockValues = new Map(pkg.knowledgeUnits.flatMap(unit => unit.blocks.map(block => [block.id, block])));
  const goals = new Map(objectiveRegistry.objectives.map(goal => [goal.objectiveId, goal]));
  const firstRecall = new Map();
  for (const projection of pkg.recallProjections) if (!firstRecall.has(projection.pointId)) firstRecall.set(projection.pointId, projection.recallItemId);
  const recallVersions = new Map(pkg.recallItems.map(item => [item.id, item.contentVersion]));
  const contrastVersions = new Map(pkg.contrastPairs.map(item => [item.confusionItemId, item.contentVersion]));
  const items = [];
  function item(id, kind, original, objectiveIds, primaryUnitIds, consumers, version) {
    const sourceBlockIds = unique([...blockReferences(original), ...(original.errorSourceBlockIds || [])]);
    const projectionDependencies = kind === 'recall'
      ? ['focus-workbench-recall', ...pkg.contrastPairs.filter(pair => pair.recallItemIds.includes(id)).map(pair => `contrast-payload:${pair.id}`)] : [];
    items.push({ id, kind, digest: digest(original), version, objectiveIds: unique(objectiveIds),
      unitIds: unique([...primaryUnitIds, ...sourceBlockIds.map(key => blockOwners.get(key)).filter(Boolean)]), sourceBlockIds,
      sourceRefIds: unique(sourceBlockIds.flatMap(key => blockValues.get(key)?.sourceRefIds || [])), consumers, projectionDependencies });
  }
  for (const card of banks.recallCards) {
    const first = firstRecall.get(card.unitId) === card.cardId;
    const consumers = ['exam', 'search-recall-prompt'];
    if (first) consumers.push('body-recall', 'legacy-systematic-recall');
    item(card.cardId, 'recall', card, [card.primaryObjectiveId, ...(card.supportingObjectiveIds || [])], [card.unitId], consumers, recallVersions.get(card.cardId));
  }
  for (const question of applied.questions) item(question.questionId, 'application', question, [question.primaryObjectiveId], [question.unitId], ['daily', 'qa'], question.contentVersion);
  for (const pair of banks.confusionItems) item(pair.itemId, 'confusion', pair, [...pair.left.objectiveIds, ...pair.right.objectiveIds], [pair.left.unitId, pair.right.unitId], ['confusion'], contrastVersions.get(pair.itemId));
  const surfaces = [];
  for (const unit of pkg.knowledgeUnits) surfaces.push({ id: `body:${unit.id}`, kind: 'body', digest: digest(unit),
    sourceBlockIds: unit.blocks.map(block => block.id), sourceRefIds: unit.sourceRefIds, objectiveIds: [], recallItemIds: firstRecall.has(unit.id) ? [firstRecall.get(unit.id)] : [] });
  for (const lesson of curriculum.lessons) surfaces.push({ id: `systematic:${lesson.id}`, kind: 'systematic', digest: digest(lesson),
    sourceBlockIds: blockReferences(lesson), sourceRefIds: [],
    objectiveIds: objectiveRegistry.objectives.filter(goal => goal.lessonId === lesson.id).map(goal => goal.objectiveId), recallItemIds: [] });
  for (const primer of pkg.quickPrimers) for (const section of primer.sections || []) surfaces.push({ id: `quick:${primer.id}:${section.id}`, kind: 'quick', digest: digest(section),
    sourceBlockIds: blockReferences(section), sourceRefIds: [], objectiveIds: [], recallItemIds: [] });
  const remedies = applied.questions.map(question => {
    const goal = goals.get(question.primaryObjectiveId);
    return { questionId: question.questionId, questionVersion: question.contentVersion, objectiveId: question.primaryObjectiveId,
      lessonId: goal?.lessonId || null,
      primaryRecallItemIds: banks.recallCards.filter(card => card.primaryObjectiveId === question.primaryObjectiveId).map(card => card.cardId),
      supportingRecallItemIds: banks.recallCards.filter(card => card.primaryObjectiveId !== question.primaryObjectiveId && card.supportingObjectiveIds?.includes(question.primaryObjectiveId)).map(card => card.cardId),
      readingTargets: question.sourceBlockIds.map(blockId => ({ blockId, unitId: blockOwners.get(blockId) || null })) };
  });
  const omitted = { banks: ['recallCards', 'confusionItems'], applied: ['questions'], knowledgePackage: ['knowledgeUnits', 'sourceReferences', 'quickPrimers'], curriculum: ['lessons'], objectiveRegistry: ['objectives'] };
  const metadataDigests = Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, digest(Object.fromEntries(Object.entries(value).filter(([field]) => !omitted[key].includes(field))))]));
  metadataDigests.quickMetadata = digest(pkg.quickPrimers.map(({ sections, ...metadata }) => metadata));
  const body = { schemaVersion: 1, authority: 'derived-dependency-and-remedy-index', metadataDigests,
    sourceDigests: Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, digest(value)])),
    blocks: pkg.knowledgeUnits.flatMap(unit => unit.blocks.map(block => ({ id: block.id, unitId: unit.id, digest: digest({ unitId: unit.id, block }) }))),
    references: pkg.sourceReferences.map(ref => ({ id: ref.id, digest: digest(ref) })),
    objectives: objectiveRegistry.objectives.map(goal => ({ id: goal.objectiveId, lessonId: goal.lessonId, unitIds: goal.unitIds, digest: digest(goal) })),
    items, surfaces, remedies };
  // Duplicate IDs must never be collapsed by change analysis.
  for (const name of ['blocks', 'references', 'objectives', 'items', 'surfaces']) assert.equal(new Set(body[name].map(row => row.id)).size, body[name].length, `duplicate ${name} ID`);
  return { ...body, snapshotVersion: `management-${digest(body).slice(0, 12)}` };
}
function validateSnapshot(value) {
  assert.equal(value?.schemaVersion, 1); assert.equal(value.authority, 'derived-dependency-and-remedy-index');
  const { snapshotVersion, ...body } = value;
  assert.equal(snapshotVersion, `management-${digest(body).slice(0, 12)}`, 'snapshot fingerprint is invalid');
  for (const name of ['blocks', 'references', 'objectives', 'items', 'surfaces']) {
    assert.ok(Array.isArray(value[name]));
    assert.equal(new Set(value[name].map(row => row.id)).size, value[name].length, `duplicate ${name} ID`);
  }
}
function changes(before, after) {
  const old = new Map(before.map(row => [row.id, row])), next = new Map(after.map(row => [row.id, row]));
  return [...new Set([...old.keys(), ...next.keys()])].flatMap(id => {
    if (digest(old.get(id) || null) === digest(next.get(id) || null)) return [];
    return [{ id, change: !old.has(id) ? 'added' : !next.has(id) ? 'removed' : 'changed' }];
  });
}
function impact(before, after) {
  validateSnapshot(before); validateSnapshot(after);
  const changed = Object.fromEntries(['blocks', 'references', 'objectives', 'items', 'surfaces'].map(name => [name, changes(before[name], after[name])]));
  const ids = name => new Set(changed[name].map(row => row.id));
  const blocks = ids('blocks'), refs = ids('references'), goals = ids('objectives'), directItems = ids('items'), directSurfaces = ids('surfaces');
  const changedInputs = unique([...Object.keys(before.sourceDigests), ...Object.keys(after.sourceDigests)]).filter(key => before.sourceDigests[key] !== after.sourceDigests[key]);
  const itemIds = unique([...before.items, ...after.items].filter(row => directItems.has(row.id) || row.sourceBlockIds.some(id => blocks.has(id)) || row.sourceRefIds.some(id => refs.has(id)) || row.objectiveIds.some(id => goals.has(id))).map(row => row.id));
  const affected = new Set(itemIds);
  const affectedItems = itemIds.map(id => {
    const rows = [before.items.find(row => row.id === id), after.items.find(row => row.id === id)].filter(Boolean);
    return { itemId: id, kind: rows[0].kind, consumers: unique(rows.flatMap(row => row.consumers)), projectionDependencies: unique(rows.flatMap(row => row.projectionDependencies)),
      reasons: unique(rows.flatMap(row => [directItems.has(id) ? 'item-or-link-change' : null,
        ...row.sourceBlockIds.filter(key => blocks.has(key)).map(key => `source:${key}`),
        ...row.sourceRefIds.filter(key => refs.has(key)).map(key => `reference:${key}`),
        ...row.objectiveIds.filter(key => goals.has(key)).map(key => `objective:${key}`)].filter(Boolean))) };
  });
  const surfaceIds = unique([...before.surfaces, ...after.surfaces].filter(row => directSurfaces.has(row.id) || row.sourceBlockIds.some(id => blocks.has(id)) || row.sourceRefIds.some(id => refs.has(id)) || row.objectiveIds.some(id => goals.has(id)) || row.recallItemIds.some(id => affected.has(id))).map(row => row.id));
  const affectedSurfaceIds = new Set(surfaceIds);
  const affectedRemedies = unique([...before.remedies, ...after.remedies].filter(row => affected.has(row.questionId) || affectedSurfaceIds.has(`systematic:${row.lessonId}`) || goals.has(row.objectiveId) || row.primaryRecallItemIds.some(id => affected.has(id)) || row.supportingRecallItemIds.some(id => affected.has(id)) || row.readingTargets.some(target => blocks.has(target.blockId))).map(row => row.questionId));
  const hasEntityChanges = Object.values(changed).some(rows => rows.length);
  return { status: changedInputs.length || hasEntityChanges ? 'review-required' : 'unchanged', before: before.snapshotVersion, after: after.snapshotVersion,
    changedInputs, unmappedInputChanges: unique([...Object.keys(before.metadataDigests), ...Object.keys(after.metadataDigests)]).filter(key => before.metadataDigests[key] !== after.metadataDigests[key]), changed, affectedItems, affectedSurfaces: surfaceIds, affectedRemedies,
    stateMigrationPerformed: false, instruction: 'Review affected content and actual consumers before regenerating the baseline; no learning progress is converted.' };
}
function runtimeTargets(management, inputs) {
  const questions = new Map(inputs.applied.questions.map(question => [question.questionId, question]));
  const goals = new Map(inputs.objectiveRegistry.objectives.map(goal => [goal.objectiveId, goal]));
  return Object.fromEntries(management.remedies.map(remedy => {
    const question = questions.get(remedy.questionId), goal = goals.get(remedy.objectiveId), target = remedy.readingTargets[0];
    assert.ok(question && goal && goal.lessonId === question.lessonId, 'remedy must match an exact current goal and lesson');
    assert.ok(remedy.primaryRecallItemIds.length, 'no primary-objective recall relation; do not guess');
    assert.ok(target?.unitId && question.sourceBlockIds.includes(target.blockId), 'missing real source target');
    assert.ok(inputs.knowledgePackage.knowledgeUnits.some(unit => unit.id === target.unitId && unit.blocks.some(block => block.id === target.blockId)), 'wrong source owner');
    return [question.questionId, { contentVersion: question.contentVersion, objectiveId: remedy.objectiveId, unitId: target.unitId, blockId: target.blockId }];
  }));
}
module.exports = { digest, blockReferences, snapshot, validateSnapshot, impact, runtimeTargets };
