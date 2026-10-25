const PLATFORM_SCHEMA_VERSION = 1;
const ADAPTER_ID = "politics-toc-v2-review";
const ADAPTER_VERSION = 1;

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
});

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

function blockFallbackText(block) {
  if (typeof block.text === "string") return block.text;
  if (Array.isArray(block.items)) return block.items.join("\n");
  if (Array.isArray(block.rows)) return block.rows.flat().join(" ");
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
    status: node.pointId ? sourcePointsById.get(node.pointId)?.status || "review" : "review",
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
      sourceRefIds: [refId],
      sourceLocator: { sourceBlockId: block.id },
      reviewState: point.reviewState,
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
      summaryBlockId: null,
      blocks,
      relationIds: [],
      recallItemIds: [recallItemId(point.id)],
      sourceRefIds: [refId],
      riskFlags: [...point.riskFlags],
      reviewState: point.reviewState,
      publishable: Boolean(point.publishable),
    };
  });

  const relations = sourcePoints.flatMap((point) => point.relationItems.map((relation) => ({
    id: relationId(point.id, relation.type, relation.targetId),
    moduleId: "politics",
    sourcePointId: point.id,
    targetPointId: relation.targetId,
    type: RELATION_TYPES[relation.type],
    direction: relation.type === "prerequisites" ? "directed" : "symmetric",
    reason: relation.why,
    sourceBlockIds: [],
    targetBlockIds: [],
    sourceRefIds: [sourceReferenceId(point.id), sourceReferenceId(relation.targetId)],
    inverseOf: null,
    reviewState: point.relationState,
    contentVersion: contentVersion(point),
  })));

  const relationIdsByPointId = Object.fromEntries(knowledgeUnits.map((unit) => [unit.id, []]));
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
    sourceBlockIds: [],
    sourceRefIds: [sourceReferenceId(point.id)],
    reviewState: point.reviewState,
    contentVersion: contentVersion(point),
  }));

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
      semanticKinds: ["plain", "hierarchy", "sequence", "contrast"],
      recallKinds: ["qa"],
      relationTypes: ["prerequisite", "contrast", "related"],
    },
    labels: {
      quick: "快速了解",
      systematic: "系统学习",
      confusion: "易混突破",
      exam: "考前速记",
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
  };

  const knowledgeById = new Map(knowledgeUnits.map((unit) => [unit.id, unit]));
  const navigationById = new Map(navigationNodes.map((node) => [node.id, node]));
  const relationById = new Map(relations.map((relation) => [relation.id, relation]));
  const recallById = new Map(recallItems.map((item) => [item.id, item]));
  const sourceById = new Map(sourceReferences.map((item) => [item.id, item]));

  for (const node of navigationNodes) {
    if (node.parentId && !navigationById.has(node.parentId)) diagnostics.errors.push(`navigation parent missing: ${node.id}`);
    if (node.pointId && !knowledgeById.has(node.pointId)) diagnostics.errors.push(`navigation point missing: ${node.id}`);
  }
  for (const unit of knowledgeUnits) {
    if (!navigationById.has(unit.navigationNodeId)) diagnostics.errors.push(`unit navigation missing: ${unit.id}`);
    for (const id of unit.relationIds) if (!relationById.has(id)) diagnostics.errors.push(`unit relation missing: ${unit.id}/${id}`);
    for (const id of unit.recallItemIds) if (!recallById.has(id)) diagnostics.errors.push(`unit recall missing: ${unit.id}/${id}`);
    for (const id of unit.sourceRefIds) if (!sourceById.has(id)) diagnostics.errors.push(`unit source missing: ${unit.id}/${id}`);
  }
  for (const relation of relations) {
    if (!knowledgeById.has(relation.sourcePointId) || !knowledgeById.has(relation.targetPointId)) {
      diagnostics.errors.push(`relation endpoint missing: ${relation.id}`);
    }
  }

  return {
    schemaVersion: PLATFORM_SCHEMA_VERSION,
    sourceSchemaVersion: sourcePackage.schemaVersion,
    packageVersion: `kp${PLATFORM_SCHEMA_VERSION}-a${ADAPTER_VERSION}-${sourcePackage.packageVersion}`,
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
    learningRoutes: [],
    indexes: {
      rootNavigationIds: [...sourcePackage.directory.rootIds],
      navigationPathByPointId: Object.fromEntries(knowledgeUnits.map((unit) => [unit.id, [...unit.navigationPathIds]])),
      relationIdsByPointId,
      recallItemIdsByPointId: Object.fromEntries(knowledgeUnits.map((unit) => [unit.id, [...unit.recallItemIds]])),
      search: sourcePackage.searchIndex.map((item) => ({
        pointId: item.id,
        title: item.title,
        pathTitles: [...(sourcePointsById.get(item.id)?.hierarchyTitles || [])],
        summary: item.summary,
        indexText: item.indexText,
      })),
    },
    idMigrations: [],
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
