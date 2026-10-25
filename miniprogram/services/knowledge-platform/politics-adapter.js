const PLATFORM_SCHEMA_VERSION = 1;
const ADAPTER_ID = "politics-toc-v2-review";
const ADAPTER_VERSION = 7;

const RELATION_TYPES = Object.freeze({
  prerequisites: "prerequisite",
  contrasts: "contrast",
  related: "related",
});

const SEMANTIC_TYPES = Object.freeze({
  section: "plain",
  explanation: "plain",
  hierarchy: "hierarchy",
  sequence: "sequence",
  boundary: "contrast",
  definition: "definition",
  conclusion: "conclusion",
  reason: "reason",
  condition: "condition",
  exception: "exception",
  contrast: "contrast",
  evidence: "evidence",
});

const ATOM_ROLES = new Set([
  "definition",
  "conclusion",
  "reason",
  "hierarchy",
  "sequence",
  "condition",
  "exception",
  "contrast",
  "evidence",
]);

function contentVersion(point) {
  return `${point.version}:${point.sourceHash}`;
}

function sourceReferenceId(pointId) {
  return `source:${pointId}`;
}

function blockId(pointId, sourceBlockId) {
  return `block:${pointId}:${sourceBlockId}`;
}

function relationId(sourcePointId, sourceType, targetPointId) {
  return `relation:${sourcePointId}:${RELATION_TYPES[sourceType] || sourceType}:${targetPointId}`;
}

function recallItemId(pointId) {
  return `recall:${pointId}:qa`;
}

function atomRefId(pointId, sourceBlockId) {
  return `atom:${pointId}:${sourceBlockId}`;
}

function canonicalBlockIds(pointId, sourceBlockIds) {
  return (sourceBlockIds || []).map((id) => blockId(pointId, id));
}

function canonicalReading(pointId, reading) {
  if (!reading || typeof reading !== "object") return null;
  const result = JSON.parse(JSON.stringify(reading));
  if (result.comparison?.rows) {
    result.comparison.rows = result.comparison.rows.map((row) => ({
      ...row,
      cells: (row.cells || []).map((cell) => ({ ...cell, blockId: blockId(pointId, cell.blockId) })),
    }));
  }
  return result;
}

function indexBy(items, keyForItem, valueForItem) {
  const result = {};
  for (const item of items) result[keyForItem(item)] = valueForItem(item);
  return result;
}

function blockFallbackText(block) {
  if (typeof block.text === "string") return block.text;
  if (Array.isArray(block.items)) return block.items.join("\n");
  if (Array.isArray(block.rows)) {
    const cells = [];
    for (const row of block.rows) cells.push(...row);
    return cells.join(" ");
  }
  return JSON.stringify(block);
}

function blockPayload(block) {
  if (block.type === "list") {
    return { ordered: Boolean(block.ordered), items: [...(block.items || [])] };
  }
  if (block.type === "table") {
    return {
      columns: [...(block.columns || [])],
      rows: (block.rows || []).map((row) => [...row]),
    };
  }
  return { text: blockFallbackText(block) };
}

function validateSourcePackage(sourcePackage) {
  const errors = [];
  if (!sourcePackage || typeof sourcePackage !== "object") errors.push("source package missing");
  if (sourcePackage?.schemaVersion !== 3) errors.push("politics source schema must be v3");
  if (sourcePackage?.module?.id !== "politics") errors.push("moduleId must be politics");
  if (!new Set(["review", "runtime"]).has(sourcePackage?.buildScope)) errors.push("invalid buildScope");
  if (!Array.isArray(sourcePackage?.directory?.nodes)) errors.push("directory nodes missing");
  if (!Array.isArray(sourcePackage?.points)) errors.push("knowledge points missing");
  if (!Array.isArray(sourcePackage?.searchIndex)) errors.push("search index missing");
  return errors;
}

function buildPathIds(nodes) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const cache = new Map();

  function visit(nodeId, visiting = new Set()) {
    if (cache.has(nodeId)) return cache.get(nodeId);
    if (visiting.has(nodeId)) throw new Error(`navigation cycle at ${nodeId}`);
    const node = nodesById.get(nodeId);
    if (!node) throw new Error(`navigation node missing: ${nodeId}`);
    const path = node.parentId
      ? [...visit(node.parentId, new Set(visiting).add(nodeId)), nodeId]
      : [nodeId];
    cache.set(nodeId, path);
    return path;
  }

  for (const node of nodes) visit(node.id);
  return cache;
}

function buildCanonicalPackage(sourcePackage) {
  const sourceErrors = validateSourcePackage(sourcePackage);
  if (sourceErrors.length) throw new Error(sourceErrors.join("; "));

  const sourceNodes = sourcePackage.directory.nodes;
  const sourcePoints = sourcePackage.points;
  const sourcePointsById = new Map(sourcePoints.map((point) => [point.id, point]));
  const navigationPaths = buildPathIds(sourceNodes);
  const sourceReferences = sourcePoints.map((point) => ({
    id: sourceReferenceId(point.id),
    moduleId: "politics",
    sourceId: point.sourceFile,
    sourceType: "politics-markdown-from-pdf",
    locator: {
      sourceFile: point.sourceFile,
      sourceUnits: [...point.sourceUnits],
      sourcePages: [...point.sourcePages],
    },
    sourceVersion: point.version,
    sourceHash: point.sourceHash,
    reviewedAt: point.reviewedAt || null,
    reviewerState: point.reviewState,
    riskFlags: [...point.riskFlags],
  }));

  sourceReferences.push(...JSON.parse(JSON.stringify(sourcePackage.supplementalSources || [])));

  const navigationNodes = sourceNodes.map((node) => ({
    id: node.id,
    moduleId: "politics",
    type: node.type,
    title: node.title,
    parentId: node.parentId || null,
    order: node.order,
    pathIds: [...navigationPaths.get(node.id)],
    pathTitles: [...node.pathTitles],
    childIds: [...node.childrenIds],
    pointId: node.pointId || null,
    pointCount: node.pointCount,
    summary: null,
    status: node.pointId
      ? sourcePointsById.get(node.pointId)?.status || "review"
      : sourcePackage.buildScope === "review" ? "review" : "approved",
  }));

  const knowledgeUnits = sourcePoints.map((point) => {
    const refId = sourceReferenceId(point.id);
    const blocks = [...point.contentBlocks, ...point.confusionBlocks].map((block) => ({
      id: blockId(point.id, block.id),
      sourceBlockId: block.id,
      unitId: point.id,
      kind: block.type,
      semantic: SEMANTIC_TYPES[block.semantic] || "plain",
      title: block.type === "heading" ? block.text : null,
      payload: blockPayload(block),
      fallbackText: blockFallbackText(block),
      reading: canonicalReading(point.id, block.reading),
      sourceRefIds: block.sourceRefIds || [refId],
      sourceLocator: { sourceBlockId: block.id, ...(block.sourceLocator || {}) },
      sourceCorrection: block.sourceCorrection || null,
      reviewState: block.reviewState || point.reviewState,
      publishable: block.publishable !== false && Boolean(point.publishable),
    }));
    return {
      id: point.id,
      moduleId: "politics",
      title: point.title,
      aliases: [...point.aliases],
      navigationNodeId: point.tocNodeId,
      navigationPathIds: [...point.hierarchyIds],
      order: point.tocOrder,
      contentVersion: contentVersion(point),
      status: point.status,
      summary: point.summary || null,
      summaryBlockId: point.summaryBlockId ? blockId(point.id, point.summaryBlockId) : null,
      readingSchema: point.readingSchema || null,
      blocks,
      relationIds: [],
      recallItemIds: [recallItemId(point.id)],
      sourceRefIds: [...new Set([refId, ...blocks.flatMap(block => block.sourceRefIds)])],
      riskFlags: [...point.riskFlags],
      reviewState: point.reviewState,
      publishable: Boolean(point.publishable) && !point.hasCandidateSupplement,
    };
  });

  const relations = [];
  for (const point of sourcePoints) {
    for (const relation of point.relationItems) {
      relations.push({
        id: relationId(point.id, relation.type, relation.targetId),
        moduleId: "politics",
        sourcePointId: point.id,
        targetPointId: relation.targetId,
        type: RELATION_TYPES[relation.type],
        direction: relation.type === "prerequisites" ? "directed" : "symmetric",
        reason: relation.why,
        sourceBlockIds: canonicalBlockIds(point.id, relation.sourceBlockIds),
        targetBlockIds: canonicalBlockIds(relation.targetId, relation.targetBlockIds),
        sourceRefIds: [sourceReferenceId(point.id), sourceReferenceId(relation.targetId)],
        dimensions: [...(relation.dimensions || [])],
        boundaries: [...(relation.boundaries || [])],
        recallItemIds: [...(relation.recallItemIds || [])],
        readingRole: relation.readingRole || null,
        placement: relation.placement || null,
        placementBlockId: relation.placementBlockId ? blockId(point.id, relation.placementBlockId) : null,
        inverseOf: null,
        reviewState: point.relationState,
        contentVersion: contentVersion(point),
      });
    }
  }

  const relationIdsByPointId = indexBy(knowledgeUnits, (unit) => unit.id, () => []);
  for (const relation of relations) {
    relationIdsByPointId[relation.sourcePointId].push(relation.id);
    relationIdsByPointId[relation.targetPointId].push(relation.id);
  }
  for (const unit of knowledgeUnits) unit.relationIds = [...relationIdsByPointId[unit.id]];

  const recallItems = sourcePoints.map((point) => ({
    id: recallItemId(point.id),
    moduleId: "politics",
    pointId: point.id,
    kind: "qa",
    prompt: point.card.prompt,
    answer: point.card.answer,
    pitfall: point.card.pitfall || null,
    sourceBlockIds: canonicalBlockIds(point.id, [
      ...(point.card.answerBlockIds || []),
      ...(point.card.pitfallBlockIds || []),
    ]),
    answerSourceBlockIds: canonicalBlockIds(point.id, point.card.answerBlockIds),
    pitfallSourceBlockIds: canonicalBlockIds(point.id, point.card.pitfallBlockIds),
    sourceRefIds: [sourceReferenceId(point.id)],
    reviewState: point.reviewState,
    contentVersion: contentVersion(point),
  }));

  const unitByIdForCards = new Map(knowledgeUnits.map((unit) => [unit.id, unit]));
  const knowledgeAtomRefs = sourcePoints.flatMap((point) => {
    if (point.cardSchema !== 1) return [];
    const unit = unitByIdForCards.get(point.id);
    return unit.blocks.flatMap((block, order) => ATOM_ROLES.has(block.semantic) ? [{
      id: atomRefId(point.id, block.sourceBlockId),
      moduleId: "politics",
      pointId: point.id,
      role: block.semantic,
      sourceBlockIds: [block.id],
      order,
      title: block.title,
      sourceRefIds: [...block.sourceRefIds],
      reviewState: point.reviewState,
      contentVersion: contentVersion(point),
    }] : []);
  });
  const atomIdsByBlockId = indexBy(
    knowledgeAtomRefs,
    (atom) => atom.sourceBlockIds[0],
    (atom) => atom.id,
  );
  const recallProjections = recallItems.map((item) => ({
    recallItemId: item.id,
    pointId: item.pointId,
    prompt: item.prompt,
    answerAtomRefIds: item.answerSourceBlockIds.map((id) => atomIdsByBlockId[id]).filter(Boolean),
    answerSourceBlockIds: [...item.answerSourceBlockIds],
    pitfallAtomRefIds: item.pitfallSourceBlockIds.map((id) => atomIdsByBlockId[id]).filter(Boolean),
    pitfallSourceBlockIds: [...item.pitfallSourceBlockIds],
    sourceRefIds: [...item.sourceRefIds],
    returnTarget: {
      pointId: item.pointId,
      blockId: item.answerSourceBlockIds[0] || null,
    },
    contentVersion: item.contentVersion,
  }));
  const contrastPairs = relations.flatMap((relation) => {
    if (
      relation.type !== "contrast" ||
      !relation.sourceBlockIds.length ||
      !relation.targetBlockIds.length ||
      !relation.dimensions.length ||
      !relation.boundaries.length
    ) return [];
    return [{
      id: `contrast-pair:${relation.sourcePointId}:${relation.targetPointId}`,
      leftPointId: relation.sourcePointId,
      leftAtomRefIds: relation.sourceBlockIds.map((id) => atomIdsByBlockId[id]).filter(Boolean),
      rightPointId: relation.targetPointId,
      rightAtomRefIds: relation.targetBlockIds.map((id) => atomIdsByBlockId[id]).filter(Boolean),
      reason: relation.reason,
      dimensions: [...relation.dimensions],
      boundaries: [...relation.boundaries],
      sourceBlockIds: [...relation.sourceBlockIds, ...relation.targetBlockIds],
      sourceRefIds: [...relation.sourceRefIds],
      recallItemIds: [...relation.recallItemIds],
      reviewState: relation.reviewState,
      contentVersion: relation.contentVersion,
    }];
  });
  const atomsByPointId = indexBy(knowledgeUnits, (unit) => unit.id, () => []);
  for (const atom of knowledgeAtomRefs) atomsByPointId[atom.pointId].push(atom);
  const recallsByPointId = indexBy(knowledgeUnits, (unit) => unit.id, () => []);
  for (const item of recallItems) recallsByPointId[item.pointId].push(item);
  const contrastsByPointId = indexBy(knowledgeUnits, (unit) => unit.id, () => []);
  for (const pair of contrastPairs) {
    contrastsByPointId[pair.leftPointId].push(pair);
    contrastsByPointId[pair.rightPointId].push(pair);
  }
  const knowledgeUnitCardProjections = knowledgeUnits.map((unit) => {
    const sourcePoint = sourcePointsById.get(unit.id);
    const blockIds = new Set(unit.blocks.map((block) => block.id));
    const atoms = atomsByPointId[unit.id];
    const pointRecalls = recallsByPointId[unit.id];
    const sourceComplete = Boolean(
      unit.blocks.length &&
      unit.sourceRefIds.length &&
      (!unit.summaryBlockId || blockIds.has(unit.summaryBlockId)),
    );
    const atomStructured = sourcePoint.cardSchema === 1 && atoms.length > 0 && atoms.every((atom) =>
      atom.sourceBlockIds.length && atom.sourceBlockIds.every((id) => blockIds.has(id)));
    const recallLinked = pointRecalls.length > 0 && pointRecalls.every((item) =>
      item.answerSourceBlockIds.length &&
      (!item.pitfall || item.pitfallSourceBlockIds.length) &&
      item.sourceBlockIds.every((id) => blockIds.has(id)));
    const hasFormalContrast = unit.relationIds.some((id) => relations.find((relation) => relation.id === id)?.type === "contrast");
    const contrastLinked = contrastsByPointId[unit.id].length > 0;
    const missingReasons = [];
    if (!sourceComplete) missingReasons.push("SOURCE_OR_BODY_INCOMPLETE");
    if (!atomStructured) missingReasons.push(atoms.length ? "ATOM_REFERENCE_INVALID" : "NO_EXPLICIT_ATOM");
    if (!recallLinked) missingReasons.push("RECALL_BLOCK_ANCHOR_PENDING");
    if (!contrastLinked) missingReasons.push(hasFormalContrast ? "CONTRAST_EVIDENCE_PENDING" : "NO_FORMAL_CONTRAST");
    return {
      pointId: unit.id,
      title: unit.title,
      navigationPathIds: [...unit.navigationPathIds],
      summary: unit.summary,
      summaryBlockId: unit.summaryBlockId,
      orderedAtomRefIds: atoms.map((atom) => atom.id),
      relationIds: [...unit.relationIds],
      recallItemIds: [...unit.recallItemIds],
      sourceRefIds: [...unit.sourceRefIds],
      completeness: { sourceComplete, atomStructured, recallLinked, contrastLinked, missingReasons },
      contentVersion: unit.contentVersion,
    };
  });

  const profile = {
    id: "politics",
    title: sourcePackage.module.title,
    description: sourcePackage.module.description,
    profileVersion: 1,
    navigation: {
      rootLabel: "政治理论",
      nodeTypes: [...new Set(navigationNodes.map((node) => node.type))],
      defaultProjection: "terrain",
    },
    capabilities: {
      activities: [
        { id: "system", requirement: "required", minItems: 1, fallback: null, dataStatus: "available" },
        { id: "relations", requirement: "required", minItems: 1, fallback: "reading", dataStatus: relations.length ? "available" : "missing" },
        { id: "reading", requirement: "required", minItems: 1, fallback: null, dataStatus: knowledgeUnits.length ? "available" : "missing" },
        { id: "recall", requirement: "required", minItems: 1, fallback: "reading", dataStatus: recallItems.length ? "available" : "missing" },
      ],
      goals: ["quick", "systematic", "confusion", "exam"],
      lenses: ["directory", "prerequisite", "contrast", "related"],
      semanticKinds: [
        "plain",
        "definition",
        "conclusion",
        "reason",
        "hierarchy",
        "sequence",
        "condition",
        "exception",
        "contrast",
        "evidence",
      ],
      recallKinds: ["qa"],
      relationTypes: ["prerequisite", "contrast", "related"],
    },
    labels: {
      quick: "快速了解",
      systematic: "系统学习",
      confusion: "易混突破",
      exam: "考前速记",
    },
    routeDefaults: JSON.parse(JSON.stringify(sourcePackage.module.routeDefaults || {})),
    surfaceCopy: {
      contentNotice: sourcePackage.buildScope === "review"
        ? "内容校订中，部分内容可能调整"
        : "当前仅覆盖两篇理论内容",
      terrainLevels: ["知识全景", "篇章", "主题", "当前知识"],
      terrainMarks: ["全", "篇", "题", "知"],
      focusLabel: "当前知识",
    },
    fallbacks: {
      relations: "reading",
      recall: "reading",
      terrain: "directory",
    },
    sourcePolicy: {
      sourceType: "markdown-from-pdf",
      generatedRuntimeIsReadOnly: true,
      obsidianRuntimeRequired: false,
    },
    publicationPolicy: {
      reviewEntryOnly: sourcePackage.buildScope === "review",
      releaseRequiresApprovedContent: true,
    },
  };

  const idMigrations = (sourcePackage.idMigrations || []).map((migration) => ({
    pointId: migration.pointId,
    fromBlockIds: canonicalBlockIds(migration.pointId, migration.fromBlockIds),
    toBlockIds: canonicalBlockIds(migration.pointId, migration.toBlockIds),
    primaryTargetId: migration.primaryTargetId
      ? blockId(migration.pointId, migration.primaryTargetId)
      : null,
    disposition: migration.disposition,
    reason: migration.reason,
  }));
  const diagnostics = {
    errors: [],
    warnings: [
      {
        code: "RELATION_BLOCK_ANCHORS_PENDING",
        count: relations.filter((relation) => !relation.sourceBlockIds.length && !relation.targetBlockIds.length).length,
        message: "当前关系可追溯到知识和来源，但尚无人工确认的精确内容块锚点。",
      },
      {
        code: "RECALL_BLOCK_ANCHORS_PENDING",
        count: recallItems.filter((item) => !item.sourceBlockIds.length).length,
        message: "当前问答卡可追溯到知识和来源，但尚无人工确认的精确内容块锚点。",
      },
    ],
    counts: {
      navigationNodes: navigationNodes.length,
      knowledgeUnits: knowledgeUnits.length,
      semanticBlocks: knowledgeUnits.reduce((total, unit) => total + unit.blocks.length, 0),
      relations: relations.length,
      recallItems: recallItems.length,
      sourceReferences: sourceReferences.length,
      publishableUnits: knowledgeUnits.filter((unit) => unit.publishable).length,
    },
    cardCounts: {
      knowledgeAtomRefs: knowledgeAtomRefs.length,
      knowledgeUnitCardProjections: knowledgeUnitCardProjections.length,
      recallProjections: recallProjections.length,
      contrastPairs: contrastPairs.length,
    },
  };

  const knowledgeById = new Map(knowledgeUnits.map((unit) => [unit.id, unit]));
  const navigationById = new Map(navigationNodes.map((node) => [node.id, node]));
  const relationById = new Map(relations.map((relation) => [relation.id, relation]));
  const recallById = new Map(recallItems.map((item) => [item.id, item]));
  const sourceById = new Map(sourceReferences.map((item) => [item.id, item]));
  const blockById = new Map(knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => [block.id, block])));
  const atomById = new Map(knowledgeAtomRefs.map((atom) => [atom.id, atom]));

  for (const node of navigationNodes) {
    if (node.parentId && !navigationById.has(node.parentId)) diagnostics.errors.push(`navigation parent missing: ${node.id}`);
    if (node.pointId && !knowledgeById.has(node.pointId)) diagnostics.errors.push(`navigation point missing: ${node.id}`);
  }
  for (const unit of knowledgeUnits) {
    if (!navigationById.has(unit.navigationNodeId)) diagnostics.errors.push(`unit navigation missing: ${unit.id}`);
    for (const id of unit.relationIds) if (!relationById.has(id)) diagnostics.errors.push(`unit relation missing: ${unit.id}/${id}`);
    for (const id of unit.recallItemIds) if (!recallById.has(id)) diagnostics.errors.push(`unit recall missing: ${unit.id}/${id}`);
    for (const id of unit.sourceRefIds) if (!sourceById.has(id)) diagnostics.errors.push(`unit source missing: ${unit.id}/${id}`);
    if (unit.summaryBlockId && blockById.get(unit.summaryBlockId)?.unitId !== unit.id) {
      diagnostics.errors.push(`unit summary block invalid: ${unit.id}/${unit.summaryBlockId}`);
    }
  }
  for (const relation of relations) {
    if (!knowledgeById.has(relation.sourcePointId) || !knowledgeById.has(relation.targetPointId)) {
      diagnostics.errors.push(`relation endpoint missing: ${relation.id}`);
    }
    for (const id of [...relation.sourceBlockIds, ...relation.targetBlockIds]) {
      if (!blockById.has(id)) diagnostics.errors.push(`relation block missing: ${relation.id}/${id}`);
    }
  }
  for (const item of recallItems) {
    for (const id of item.sourceBlockIds) {
      if (blockById.get(id)?.unitId !== item.pointId) diagnostics.errors.push(`recall block invalid: ${item.id}/${id}`);
    }
  }
  for (const atom of knowledgeAtomRefs) {
    if (!ATOM_ROLES.has(atom.role)) diagnostics.errors.push(`atom role invalid: ${atom.id}`);
    for (const id of atom.sourceBlockIds) {
      if (blockById.get(id)?.unitId !== atom.pointId) diagnostics.errors.push(`atom block invalid: ${atom.id}/${id}`);
    }
  }
  for (const card of knowledgeUnitCardProjections) {
    for (const id of card.orderedAtomRefIds) if (!atomById.has(id)) diagnostics.errors.push(`card atom missing: ${card.pointId}/${id}`);
  }
  const migratedSourceIds = new Set();
  for (const migration of idMigrations) {
    for (const id of migration.fromBlockIds) {
      if (migratedSourceIds.has(id)) diagnostics.errors.push(`migration source duplicated: ${id}`);
      migratedSourceIds.add(id);
    }
    for (const id of migration.toBlockIds) if (!blockById.has(id)) diagnostics.errors.push(`migration target missing: ${id}`);
    if (["split", "merge"].includes(migration.disposition) && !migration.toBlockIds.includes(migration.primaryTargetId)) {
      diagnostics.errors.push(`migration primary target invalid: ${migration.pointId}`);
    }
  }

  const packageVersion = `kp${PLATFORM_SCHEMA_VERSION}-a${ADAPTER_VERSION}-${sourcePackage.packageVersion}`;
  const quickPrimers = (sourcePackage.quickPrimers || []).map((primer) => ({
    ...JSON.parse(JSON.stringify(primer)),
    sourcePackageVersion: packageVersion,
  }));
  const contentCoverage = sourcePackage.contentCoverage
    ? { ...JSON.parse(JSON.stringify(sourcePackage.contentCoverage)), packageVersion }
    : null;

  return {
    schemaVersion: PLATFORM_SCHEMA_VERSION,
    sourceSchemaVersion: sourcePackage.schemaVersion,
    packageVersion,
    adapter: {
      id: ADAPTER_ID,
      version: ADAPTER_VERSION,
      sourcePackageVersion: sourcePackage.packageVersion,
    },
    moduleProfile: profile,
    navigationNodes,
    knowledgeUnits,
    relations,
    recallItems,
    sourceReferences,
    knowledgeAtomRefs,
    knowledgeUnitCardProjections,
    recallProjections,
    contrastPairs,
    quickPrimers,
    contentCoverage,
    learningRoutes: [],
    indexes: {
      rootNavigationIds: [...sourcePackage.directory.rootIds],
      navigationPathByPointId: indexBy(knowledgeUnits, (unit) => unit.id, (unit) => [...unit.navigationPathIds]),
      relationIdsByPointId,
      recallItemIdsByPointId: indexBy(knowledgeUnits, (unit) => unit.id, (unit) => [...unit.recallItemIds]),
      search: sourcePackage.searchIndex.map((item) => ({
        pointId: item.id,
        title: item.title,
        pathTitles: [...(sourcePointsById.get(item.id)?.hierarchyTitles || [])],
        summary: item.summary,
        indexText: item.indexText,
      })),
    },
    idMigrations,
    buildTarget: sourcePackage.buildScope === "review" ? "review" : "release",
    diagnostics,
  };
}

function createPoliticsAdapter(sourcePackage) {
  return Object.freeze({
    adapterId: ADAPTER_ID,
    adapterVersion: ADAPTER_VERSION,
    moduleId: "politics",
    sourceSchemaVersion: sourcePackage?.schemaVersion,
    readSources() {
      return JSON.parse(JSON.stringify(sourcePackage));
    },
    buildPackage() {
      return buildCanonicalPackage(sourcePackage);
    },
    mapNavigation() {
      return buildCanonicalPackage(sourcePackage).navigationNodes;
    },
    mapKnowledgeUnits() {
      return buildCanonicalPackage(sourcePackage).knowledgeUnits;
    },
    mapRelations() {
      return buildCanonicalPackage(sourcePackage).relations;
    },
    mapRecallItems() {
      return buildCanonicalPackage(sourcePackage).recallItems;
    },
    mapKnowledgeCards() {
      const result = buildCanonicalPackage(sourcePackage);
      return {
        knowledgeAtomRefs: result.knowledgeAtomRefs,
        knowledgeUnitCardProjections: result.knowledgeUnitCardProjections,
        recallProjections: result.recallProjections,
        contrastPairs: result.contrastPairs,
      };
    },
    collectSourceReferences() {
      return buildCanonicalPackage(sourcePackage).sourceReferences;
    },
    reportDiagnostics() {
      return buildCanonicalPackage(sourcePackage).diagnostics;
    },
  });
}

module.exports = {
  PLATFORM_SCHEMA_VERSION,
  ADAPTER_ID,
  ADAPTER_VERSION,
  createPoliticsAdapter,
  buildCanonicalPackage,
};
