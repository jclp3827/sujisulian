function unique(values) { return [...new Set(values)]; }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function applyPoliticsLearningBanks(basePackage, runtimeBanks) {
  if (!runtimeBanks || runtimeBanks.status !== 'approved-runtime') throw new Error('Politics learning runtime bank is unavailable');
  if (!Array.isArray(runtimeBanks.recallCards) || !Array.isArray(runtimeBanks.confusionItems)) throw new Error('Politics learning runtime bank is malformed');
  const pkg = clone(basePackage);
  const units = new Map(pkg.knowledgeUnits.map((unit) => [unit.id, unit]));
  const blocks = new Map(pkg.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => [block.id, block])));
  const atoms = new Map(pkg.knowledgeAtomRefs.map((atom) => [atom.id, atom]));
  const atomIdByBlockId = new Map(pkg.knowledgeAtomRefs.flatMap((atom) => atom.sourceBlockIds.map((id) => [id, atom.id])));
  const sourceRefForUnit = (unitId) => units.get(unitId)?.sourceRefIds?.[0] || null;
  const sourceRefsForBlocks = (blockIds) => unique(blockIds.flatMap((id) => blocks.get(id)?.sourceRefIds || []));
  const validateExistingBlock = (blockId, owner) => {
    if (!blocks.has(blockId)) throw new Error(`${owner}: invalid source block ${blockId}`);
  };
  const validateBlock = (blockId, unitId, owner) => {
    if (blocks.get(blockId)?.unitId !== unitId) throw new Error(`${owner}: invalid source block ${blockId}`);
  };

  const cardIds = new Set();
  const recallItems = runtimeBanks.recallCards.map((card) => {
    if (cardIds.has(card.cardId) || !units.has(card.unitId)) throw new Error(`Invalid runtime recall card: ${card.cardId}`);
    cardIds.add(card.cardId);
    [...card.sourceBlockIds, ...card.errorSourceBlockIds, ...card.remedy.sourceBlockIds]
      .forEach((id) => validateExistingBlock(id, card.cardId));
    return {
      id: card.cardId,
      moduleId: 'politics',
      pointId: card.unitId,
      kind: 'qa',
      cardType: card.cardType,
      difficulty: card.difficulty,
      importance: card.importance,
      primaryObjectiveId: card.primaryObjectiveId,
      supportingObjectiveIds: [...(card.supportingObjectiveIds || [])],
      prompt: card.prompt,
      answer: card.answer,
      pitfall: card.errorExplanation,
      sourceLabels: card.sourceLabels || {},
      sourceBlockIds: unique([...card.sourceBlockIds, ...card.errorSourceBlockIds]),
      answerSourceBlockIds: [...card.sourceBlockIds],
      pitfallSourceBlockIds: [...card.errorSourceBlockIds],
      sourceRefIds: sourceRefsForBlocks(unique([...card.sourceBlockIds, ...card.errorSourceBlockIds])),
      remedy: clone(card.remedy),
      legacyRecallItemId: card.sourceRecallItemId || card.replacesRecallItemId || null,
      reviewState: card.reviewState,
      contentVersion: card.recallVersion || `${runtimeBanks.bankVersion}:${card.cardId}`,
    };
  });
  const recallByUnit = new Map(pkg.knowledgeUnits.map((unit) => [unit.id, []]));
  for (const recall of recallItems) recallByUnit.get(recall.pointId).push(recall.id);
  for (const unit of pkg.knowledgeUnits) unit.recallItemIds = recallByUnit.get(unit.id);
  const recallProjections = recallItems.map((item) => ({
    recallItemId: item.id,
    pointId: item.pointId,
    prompt: item.prompt,
    answerAtomRefIds: item.answerSourceBlockIds.map((id) => atomIdByBlockId.get(id)).filter(Boolean),
    answerSourceBlockIds: [...item.answerSourceBlockIds],
    pitfallAtomRefIds: item.pitfallSourceBlockIds.map((id) => atomIdByBlockId.get(id)).filter(Boolean),
    pitfallSourceBlockIds: [...item.pitfallSourceBlockIds],
    sourceRefIds: [...item.sourceRefIds],
    returnTarget: { pointId: item.pointId, blockId: item.remedy.sourceBlockIds[0] || item.answerSourceBlockIds[0] || null },
    contentVersion: item.contentVersion,
  }));

  const promotedSourceRelationIds = new Set(runtimeBanks.confusionItems.map((item) => item.sourceRelationId));
  const retainedRelations = pkg.relations.filter((relation) => !promotedSourceRelationIds.has(relation.id));
  const firstRecallId = (unitId) => recallByUnit.get(unitId)?.[0] || null;
  const promotedRelations = [];
  const contrastPairs = [];
  const relationIds = new Set(retainedRelations.map((relation) => relation.id));
  for (const item of runtimeBanks.confusionItems) {
    const left = units.get(item.left.unitId);
    const right = units.get(item.right.unitId);
    if (!left || !right || relationIds.has(item.relationId)) throw new Error(`Invalid runtime confusion item: ${item.itemId}`);
    item.left.sourceBlockIds.forEach((id) => validateBlock(id, left.id, item.itemId));
    item.right.sourceBlockIds.forEach((id) => validateBlock(id, right.id, item.itemId));
    for (const check of [item.initialCheck, item.variantCheck]) {
      if (!check.options.some((option) => option.unitId === check.answerUnitId)) throw new Error(`${item.itemId}: invalid answer option`);
    }
    const recalls = unique([firstRecallId(left.id), firstRecallId(right.id)].filter(Boolean));
    const sourceRefIds = unique([sourceRefForUnit(left.id), sourceRefForUnit(right.id)].filter(Boolean));
    const relation = {
      id: item.relationId,
      moduleId: 'politics',
      sourcePointId: left.id,
      targetPointId: right.id,
      type: 'contrast',
      direction: 'symmetric',
      reason: item.boundary,
      sourceBlockIds: [...item.left.sourceBlockIds],
      targetBlockIds: [...item.right.sourceBlockIds],
      sourceRefIds,
      dimensions: [item.dimension],
      boundaries: [item.boundary],
      recallItemIds: recalls,
      readingRole: 'crossPointComparison',
      placement: null,
      placementBlockId: null,
      inverseOf: null,
      reviewState: item.reviewState,
      contentVersion: item.contentVersion || `${runtimeBanks.bankVersion}:${item.itemId}`,
      confusionItemId: item.itemId,
    };
    const pair = {
      id: `contrast-pair:${left.id}:${right.id}`,
      confusionItemId: item.itemId,
      leftLabel: item.left.title,
      rightLabel: item.right.title,
      leftPointId: left.id,
      leftSourceBlockIds: [...item.left.sourceBlockIds],
      leftAtomRefIds: item.left.sourceBlockIds.map((id) => atomIdByBlockId.get(id)).filter((id) => atoms.has(id)),
      rightPointId: right.id,
      rightSourceBlockIds: [...item.right.sourceBlockIds],
      rightAtomRefIds: item.right.sourceBlockIds.map((id) => atomIdByBlockId.get(id)).filter((id) => atoms.has(id)),
      reason: item.boundary,
      dimensions: [item.dimension],
      boundaries: [item.boundary],
      sourceBlockIds: [...item.sourceBlockIds],
      sourceRefIds,
      recallItemIds: recalls,
      initialCheck: clone(item.initialCheck),
      variantCheck: clone(item.variantCheck),
      reviewState: item.reviewState,
      contentVersion: relation.contentVersion,
    };
    if (!pair.leftSourceBlockIds.length || !pair.rightSourceBlockIds.length) throw new Error(`${item.itemId}: direct source unavailable`);
    promotedRelations.push(relation);
    contrastPairs.push(pair);
    relationIds.add(relation.id);
  }

  pkg.relations = [...retainedRelations, ...promotedRelations];
  pkg.recallItems = recallItems;
  pkg.recallProjections = recallProjections;
  pkg.contrastPairs = contrastPairs;
  const relationIdsByPointId = Object.fromEntries(pkg.knowledgeUnits.map((unit) => [unit.id, []]));
  for (const relation of pkg.relations) {
    relationIdsByPointId[relation.sourcePointId].push(relation.id);
    relationIdsByPointId[relation.targetPointId].push(relation.id);
  }
  for (const unit of pkg.knowledgeUnits) {
    unit.relationIds = relationIdsByPointId[unit.id];
    const projection = pkg.knowledgeUnitCardProjections.find((item) => item.pointId === unit.id);
    projection.relationIds = [...unit.relationIds];
    projection.recallItemIds = [...unit.recallItemIds];
    projection.completeness.recallLinked = unit.recallItemIds.length > 0;
    projection.completeness.contrastLinked = contrastPairs.some((pair) => pair.leftPointId === unit.id || pair.rightPointId === unit.id);
    projection.completeness.missingReasons = projection.completeness.missingReasons
      .filter((reason) => reason !== 'RECALL_BLOCK_ANCHOR_PENDING' && reason !== 'CONTRAST_EVIDENCE_PENDING' && reason !== 'NO_FORMAL_CONTRAST');
    if (!projection.completeness.contrastLinked) projection.completeness.missingReasons.push('NO_FORMAL_CONTRAST');
  }
  pkg.indexes.relationIdsByPointId = relationIdsByPointId;
  pkg.indexes.recallItemIdsByPointId = Object.fromEntries(pkg.knowledgeUnits.map((unit) => [unit.id, [...unit.recallItemIds]]));
  pkg.moduleProfile.routeDefaults.confusion.priorityRelationIds = runtimeBanks.confusionItems.map((item) => item.relationId);
  pkg.moduleProfile.routeDefaults.confusion.reason = '按已审核的正式辨析题顺序推荐，每次完成初判、核对与材料变式';
  pkg.moduleProfile.routeDefaults.exam = {
    ...pkg.moduleProfile.routeDefaults.exam,
    sessionSize: runtimeBanks.sessionPolicy.exam.sessionSize,
    reason: '从正式速记题库按范围每轮选取4张；完成后可进入下一组，随机仅由用户显式开启',
  };
  pkg.moduleProfile.capabilities.recallKinds = ['qa', ...unique(recallItems.map((item) => item.cardType))];
  pkg.packageVersion = `${pkg.packageVersion}-lb-${runtimeBanks.bankVersion.replace('learning-banks-', '')}`;
  pkg.quickPrimers = pkg.quickPrimers.map((primer) => ({ ...primer, sourcePackageVersion: pkg.packageVersion }));
  if (pkg.contentCoverage) pkg.contentCoverage.packageVersion = pkg.packageVersion;
  pkg.recallRevisionCompatibility = runtimeBanks.recallRevisionCompatibility || null;
  pkg.retiredRecallCards = runtimeBanks.retiredRecallCards || [];
  pkg.learningBanks = {
    id: runtimeBanks.id,
    version: runtimeBanks.bankVersion,
    status: runtimeBanks.status,
    recallCardCount: recallItems.length,
    confusionItemCount: contrastPairs.length,
    sessionPolicy: clone(runtimeBanks.sessionPolicy),
    sourceArtifacts: clone(runtimeBanks.sourceArtifacts),
  };
  pkg.diagnostics.counts.relations = pkg.relations.length;
  pkg.diagnostics.counts.recallItems = recallItems.length;
  pkg.diagnostics.cardCounts.recallProjections = recallProjections.length;
  pkg.diagnostics.cardCounts.contrastPairs = contrastPairs.length;
  pkg.diagnostics.warnings = pkg.diagnostics.warnings.map((warning) => warning.code === 'RECALL_BLOCK_ANCHORS_PENDING' ? { ...warning, count: 0 } : warning);
  return pkg;
}

module.exports = { applyPoliticsLearningBanks };

