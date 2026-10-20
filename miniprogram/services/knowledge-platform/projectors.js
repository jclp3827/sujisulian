const { projectTextRuns, readingSelectorRange } = require("./reading-text");
const { normalizeKnowledgeContext, availableActivities, resolveRecentModuleContext } = require("./context");
const { getRolloutStage } = require("./rollout");
const { ROUTE_META, normalizeRouteSession, planLearningRoute, planRecommendedRoute, routeResumeLabel } = require("./learning");
const { platformSurfaceCopy, projectContextTools, projectSurfaceLanguage } = require("./surface-language");

function projectFoundationViewModel(knowledgePackage, rawContext) {
  const context = normalizeKnowledgeContext(knowledgePackage, rawContext);
  const unit = context.focus
    ? knowledgePackage.knowledgeUnits.find((item) => item.id === context.focus.pointId)
    : null;
  const navigationById = new Map(knowledgePackage.navigationNodes.map((node) => [node.id, node]));
  const sourceById = new Map(knowledgePackage.sourceReferences.map((item) => [item.id, item]));

  return {
    module: {
      id: knowledgePackage.moduleProfile.id,
      title: knowledgePackage.moduleProfile.title,
      rolloutStage: getRolloutStage(knowledgePackage.moduleProfile.id),
      buildTarget: knowledgePackage.buildTarget,
      packageVersion: knowledgePackage.packageVersion,
    },
    counts: {
      navigationNodes: knowledgePackage.navigationNodes.length,
      knowledgeUnits: knowledgePackage.knowledgeUnits.length,
      relations: knowledgePackage.relations.length,
      recallItems: knowledgePackage.recallItems.length,
    },
    context: {
      hasFocus: Boolean(unit),
      activity: context.activity,
      relationMode: context.relationMode,
      availableActivities: availableActivities(knowledgePackage, unit?.id || null),
      origin: context.origin,
      trailLength: context.explorationTrail.length,
    },
    focus: unit ? {
      pointId: unit.id,
      title: unit.title,
      navigationNodeId: unit.navigationNodeId,
      path: unit.navigationPathIds.map((id) => {
        const node = navigationById.get(id);
        return { id, title: node?.title || "" };
      }),
      contentVersion: unit.contentVersion,
      summary: unit.summary,
      status: unit.status,
      reviewState: unit.reviewState,
      riskFlags: [...unit.riskFlags],
      relationCount: unit.relationIds.length,
      recallItemCount: unit.recallItemIds.length,
      sources: unit.sourceRefIds.map((id) => sourceById.get(id)).filter(Boolean).map((source) => ({
        id: source.id,
        sourceType: source.sourceType,
        locator: source.locator,
        reviewerState: source.reviewerState,
      })),
    } : null,
  };
}

const TERRAIN_BUDGETS = Object.freeze({ 0: 8, 1: 12, 2: 16, 3: 6 });
const RELATION_LABELS = Object.freeze({
  prerequisite: "前置",
  subsequent: "后续",
  contrast: "易混",
  related: "相关",
});
const ACTIVITY_META = Object.freeze({
  system: { label: "体系", tone: "system" },
  relations: { label: "关系", tone: "relations" },
  reading: { label: "阅读", tone: "reading" },
  recall: { label: "回忆", tone: "recall" },
});
const RELATION_TYPE_ORDER = Object.freeze({ prerequisite: 0, contrast: 1, related: 2 });
const READING_KINDS = new Set(["heading", "paragraph", "list", "table", "quote", "callout", "media"]);
const READING_SEMANTICS = new Set([
  "plain", "definition", "conclusion", "reason", "hierarchy", "sequence", "condition",
  "exception", "contrast", "evidence", "timeline", "entity",
]);
const KEY_POINT_SEMANTICS = new Set(["definition", "conclusion", "condition", "exception", "contrast"]);
const SEMANTIC_META = Object.freeze({
  definition: { label: "定义", tone: "reading" },
  conclusion: { label: "结论", tone: "reading" },
  reason: { label: "理由", tone: "reading" },
  hierarchy: { label: "层级", tone: "system" },
  sequence: { label: "步骤", tone: "system" },
  condition: { label: "条件", tone: "boundary" },
  exception: { label: "例外", tone: "boundary" },
  contrast: { label: "易混与边界", tone: "boundary" },
  evidence: { label: "证据", tone: "evidence" },
  timeline: { label: "时间", tone: "plain" },
  entity: { label: "实体", tone: "plain" },
});
const DISPLAY_DEFAULTS = Object.freeze({
  fontScale: "default",
  lineSpacing: "normal",
  density: "comfortable",
  emphasis: "keyPoints",
  motion: "full",
  systemProjection: "terrain",
});

function clampLevel(value) {
  const number = Number(value);
  return Number.isInteger(number) ? Math.max(0, Math.min(3, number)) : 0;
}

function orderedNodes(knowledgePackage) {
  return [...knowledgePackage.navigationNodes].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

function buildTerrainAggregates(scopeNodeId, children, budget) {
  if (children.length <= budget) return [];
  const groupCount = Math.ceil(children.length / budget);
  const groupSize = Math.ceil(children.length / groupCount);
  const aggregates = [];
  for (let index = 0; index < children.length; index += groupSize) {
    const slice = children.slice(index, index + groupSize);
    const first = slice[0];
    const last = slice[slice.length - 1];
    aggregates.push({
      id: `agg:${scopeNodeId}:${first.order}:${last.order}`,
      scopeNodeId,
      childIds: slice.map((node) => node.id),
      title: `第${index + 1}–${index + slice.length}项`,
      summary: `${first.title} — ${last.title}`,
      count: slice.reduce((total, node) => total + (node.pointCount || 0), 0),
      positionKey: `${scopeNodeId}:${first.order}:${last.order}`,
    });
  }
  return aggregates;
}

function normalizeProjectionState(knowledgePackage, rawContext, rawState = {}) {
  const context = normalizeKnowledgeContext(knowledgePackage, rawContext);
  const nodesById = new Map(knowledgePackage.navigationNodes.map((node) => [node.id, node]));
  const rootId = knowledgePackage.indexes.rootNavigationIds[0] || null;
  let semanticLevel = clampLevel(rawState.semanticLevel);
  let scopeNodeId = nodesById.has(rawState.scopeNodeId) ? rawState.scopeNodeId : rootId;
  if (semanticLevel === 0) scopeNodeId = rootId;
  if (semanticLevel === 3 && !context.focus) {
    semanticLevel = 0;
    scopeNodeId = rootId;
  }
  const projection = rawState.projection === "directory" ? "directory" : "terrain";
  return {
    moduleId: knowledgePackage.moduleProfile.id,
    projection,
    semanticLevel,
    scopeNodeId,
    focusNodeId: context.focus?.navigationNodeId || null,
    highlightNodeId: rawState.highlightNodeId || null,
    focusedPointId: context.focus?.pointId || null,
    expandedPathIds: Array.isArray(rawState.expandedPathIds) ? [...rawState.expandedPathIds] : [],
    lens: "directory",
    selectedAggregateId: rawState.selectedAggregateId || null,
    scrollAnchorId: rawState.scrollAnchorId || null,
    viewportToken: rawState.viewportToken || `L${semanticLevel}`,
  };
}

function stateLabelForUnit(unit) {
  if (!unit) return [];
  return [{ text: unit.reviewState === "approved" ? "已核对" : "校订中", tone: unit.reviewState === "approved" ? "approved" : "review" }];
}

function navigationViewNode(node, role, level, unit, selected) {
  const hasChildren = node.childIds.length > 0;
  const action = node.pointId ? "focus-point" : "enter-scope";
  return {
    id: node.id,
    sourceId: node.id,
    navigationNodeId: node.id,
    pointId: node.pointId,
    role,
    title: node.title,
    shortTitle: node.title,
    summary: unit?.summary || null,
    count: node.pointCount,
    positionKey: `${node.parentId || "root"}:${node.order}:${node.id}`,
    stateLabels: stateLabelForUnit(unit),
    hasChildren,
    canFocus: Boolean(node.pointId),
    selected,
    action,
    nextSemanticLevel: node.pointId ? 3 : Math.min(2, level + 1),
    nextScopeNodeId: node.id,
    selectedAggregateId: null,
  };
}

function breadcrumbForPath(knowledgePackage, pathIds, state, aggregate) {
  const nodesById = new Map(knowledgePackage.navigationNodes.map((node) => [node.id, node]));
  const crumbs = pathIds.map((id, index) => {
    const node = nodesById.get(id);
    return {
      id,
      title: index === 0 ? knowledgePackage.moduleProfile.title : node?.title || "",
      semanticLevel: Math.min(index, 2),
      scopeNodeId: id,
      selectedAggregateId: null,
      current: id === state.scopeNodeId && !aggregate,
    };
  });
  if (aggregate) {
    crumbs.push({
      id: aggregate.id,
      title: aggregate.title,
      semanticLevel: 2,
      scopeNodeId: aggregate.scopeNodeId,
      selectedAggregateId: aggregate.id,
      current: true,
    });
  }
  return crumbs;
}

function aggregateViewNode(aggregate) {
  return {
    ...aggregate,
    sourceId: aggregate.scopeNodeId,
    navigationNodeId: null,
    pointId: null,
    role: "aggregate",
    shortTitle: aggregate.title,
    stateLabels: [],
    hasChildren: true,
    canFocus: false,
    selected: false,
    action: "open-aggregate",
    nextSemanticLevel: 2,
    nextScopeNodeId: aggregate.scopeNodeId,
    selectedAggregateId: aggregate.id,
  };
}

function relationTerrain(knowledgePackage, context, nodesById, unitsById) {
  const focus = context.focus && unitsById.get(context.focus.pointId);
  if (!focus) return { nodes: [], links: [], breadcrumb: [], scope: null, backState: null };
  const focusNavigation = nodesById.get(focus.navigationNodeId);
  const relationsById = new Map(knowledgePackage.relations.map((relation) => [relation.id, relation]));
  const rawRelationItems = (knowledgePackage.indexes.relationIdsByPointId[focus.id] || [])
    .map((id) => relationsById.get(id))
    .filter(Boolean)
    .map((relation) => {
      const targetPointId = relation.sourcePointId === focus.id ? relation.targetPointId : relation.sourcePointId;
      const displayType = relation.type === "prerequisite" && relation.targetPointId === focus.id
        ? "subsequent"
        : relation.type;
      return { relation, target: unitsById.get(targetPointId), displayType };
    })
    .filter((item) => item.target)
    .sort((a, b) => a.target.order - b.target.order || a.relation.id.localeCompare(b.relation.id));
  const relationItemsByTarget = new Map();
  for (const item of rawRelationItems) {
    const group = relationItemsByTarget.get(item.target.id) || { target: item.target, relations: [] };
    group.relations.push(item);
    relationItemsByTarget.set(item.target.id, group);
  }
  const relationItems = [...relationItemsByTarget.values()].slice(0, TERRAIN_BUDGETS[3]);
  const focusNode = {
    id: focus.id,
    sourceId: focus.navigationNodeId,
    navigationNodeId: focus.navigationNodeId,
    pointId: focus.id,
    role: "focus",
    title: focus.title,
    shortTitle: focus.title,
    summary: focus.summary,
    count: 1,
    positionKey: `focus:${focus.navigationNodeId}`,
    stateLabels: stateLabelForUnit(focus),
    hasChildren: false,
    canFocus: true,
    selected: true,
    action: "read-focus",
    relationLabel: "当前知识",
    relationReason: "",
  };
  const contextNodes = relationItems.map(({ relations, target }, index) => ({
    id: target.id,
    sourceId: target.navigationNodeId,
    navigationNodeId: target.navigationNodeId,
    pointId: target.id,
    role: "context",
    title: target.title,
    shortTitle: target.title,
    summary: target.summary,
    count: 1,
    positionKey: `relation:${focus.id}:${index}:${target.id}`,
    stateLabels: stateLabelForUnit(target),
    hasChildren: false,
    canFocus: true,
    selected: false,
    action: "switch-focus",
    relationId: relations[0].relation.id,
    relationIds: relations.map((item) => item.relation.id),
    relationType: relations[0].displayType,
    relationLabel: [...new Set(relations.map((item) => RELATION_LABELS[item.displayType] || item.displayType))].join(" · "),
    relationReason: relations.map((item) => item.relation.reason).join("；"),
  }));
  const parent = focusNavigation && nodesById.get(focusNavigation.parentId);
  const siblings = parent ? parent.childIds.map((id) => nodesById.get(id)).filter(Boolean) : [];
  const aggregates = parent ? buildTerrainAggregates(parent.id, siblings, TERRAIN_BUDGETS[1]) : [];
  const selectedAggregate = aggregates.find((item) => item.childIds.includes(focusNavigation?.id));
  const backState = parent ? {
    semanticLevel: 2,
    scopeNodeId: parent.id,
    selectedAggregateId: selectedAggregate?.id || null,
  } : { semanticLevel: 0, scopeNodeId: knowledgePackage.indexes.rootNavigationIds[0], selectedAggregateId: null };
  const pathWithoutFocus = focus.navigationPathIds.slice(0, -1);
  const breadcrumb = breadcrumbForPath(knowledgePackage, pathWithoutFocus, { scopeNodeId: parent?.id || null }, selectedAggregate);
  breadcrumb.push({
    id: focus.navigationNodeId,
    title: focus.title,
    semanticLevel: 3,
    scopeNodeId: focus.navigationNodeId,
    selectedAggregateId: selectedAggregate?.id || null,
    current: true,
  });
  const links = [];
  for (const node of contextNodes) {
    for (const relationId of node.relationIds) {
      const relation = relationsById.get(relationId);
      const displayType = relation.type === "prerequisite" && relation.targetPointId === focus.id
        ? "subsequent"
        : relation.type;
      links.push({
        kind: displayType,
        sourceId: focus.id,
        targetId: node.id,
        label: RELATION_LABELS[displayType] || displayType,
        direction: relation.direction,
      });
    }
  }
  return {
    nodes: [focusNode, ...contextNodes],
    links,
    breadcrumb,
    scope: { id: focus.id, title: focus.title, parentId: focusNavigation?.parentId || null, pointCount: 1 },
    backState,
  };
}

function projectTerrainViewModel(knowledgePackage, rawContext, rawState = {}, viewportClass = "regular") {
  const context = normalizeKnowledgeContext(knowledgePackage, rawContext);
  const state = normalizeProjectionState(knowledgePackage, context, rawState);
  const navigationNodes = orderedNodes(knowledgePackage);
  const nodesById = new Map(navigationNodes.map((node) => [node.id, node]));
  const unitsById = new Map(knowledgePackage.knowledgeUnits.map((unit) => [unit.id, unit]));
  const scopeNode = nodesById.get(state.scopeNodeId);
  let nodes = [];
  let links = [];
  let breadcrumb = [];
  let scope = scopeNode ? { id: scopeNode.id, title: scopeNode.title, parentId: scopeNode.parentId, pointCount: scopeNode.pointCount } : null;
  let overflow = { hasOverflow: false, total: 0, shown: 0, strategy: "none" };
  let backState = null;

  if (state.semanticLevel === 3) {
    const terrain = relationTerrain(knowledgePackage, context, nodesById, unitsById);
    nodes = terrain.nodes;
    links = terrain.links;
    breadcrumb = terrain.breadcrumb;
    scope = terrain.scope;
    backState = terrain.backState;
  } else {
    const budget = TERRAIN_BUDGETS[state.semanticLevel];
    const children = (scopeNode?.childIds || []).map((id) => nodesById.get(id)).filter(Boolean);
    const aggregates = buildTerrainAggregates(state.scopeNodeId, children, budget);
    let visibleChildren = children;
    let activeAggregate = null;
    if (state.semanticLevel === 2 && state.selectedAggregateId) {
      const l1Aggregates = buildTerrainAggregates(state.scopeNodeId, children, TERRAIN_BUDGETS[1]);
      activeAggregate = l1Aggregates.find((item) => item.id === state.selectedAggregateId) || null;
      if (activeAggregate) visibleChildren = activeAggregate.childIds.map((id) => nodesById.get(id)).filter(Boolean);
    }
    if (aggregates.length && !activeAggregate) {
      nodes = aggregates.map(aggregateViewNode);
      overflow = { hasOverflow: true, total: children.length, shown: nodes.length, strategy: "aggregate" };
    } else {
      const role = state.semanticLevel === 0 ? "region" : state.semanticLevel === 1 ? "branch" : "point";
      nodes = visibleChildren.slice(0, budget).map((node) => navigationViewNode(
        node,
        node.pointId ? "point" : role,
        state.semanticLevel,
        node.pointId ? unitsById.get(node.pointId) : null,
        (state.highlightNodeId || state.focusNodeId) === node.id,
      ));
      overflow = { hasOverflow: visibleChildren.length > budget, total: visibleChildren.length, shown: nodes.length, strategy: visibleChildren.length > budget ? "directory" : "none" };
    }
    links = nodes.slice(1).map((node) => ({
      kind: "hierarchy",
      sourceId: nodes[0].id,
      targetId: node.id,
      label: "正式顺序",
      direction: "forward",
    }));
    breadcrumb = breadcrumbForPath(knowledgePackage, scopeNode?.pathIds || [], state, activeAggregate);
    if (state.semanticLevel === 1) {
      backState = { semanticLevel: 0, scopeNodeId: knowledgePackage.indexes.rootNavigationIds[0], selectedAggregateId: null };
    } else if (state.semanticLevel === 2) {
      backState = activeAggregate
        ? { semanticLevel: 1, scopeNodeId: state.scopeNodeId, selectedAggregateId: null }
        : { semanticLevel: 1, scopeNodeId: scopeNode?.parentId || knowledgePackage.indexes.rootNavigationIds[0], selectedAggregateId: null };
    }
  }

  const listEquivalent = nodes.map((node, index) => ({
    ...node,
    orderLabel: index < 9 ? `0${index + 1}` : String(index + 1),
  }));
  return {
    moduleId: knowledgePackage.moduleProfile.id,
    moduleTitle: knowledgePackage.moduleProfile.title,
    projection: state.projection,
    semanticLevel: state.semanticLevel,
    levelLabel: `L${state.semanticLevel}`,
    levelTitle: knowledgePackage.moduleProfile.surfaceCopy?.terrainLevels?.[state.semanticLevel]
      || ["知识全景", "篇章", "主题", "当前知识"][state.semanticLevel],
    levelMark: knowledgePackage.moduleProfile.surfaceCopy?.terrainMarks?.[state.semanticLevel]
      || ["全", "篇", "题", "知"][state.semanticLevel],
    scope,
    breadcrumb,
    nodes,
    links,
    overflow,
    availableLenses: ["directory"],
    listEquivalent,
    backState,
    state,
    hasFocus: Boolean(context.focus),
    focusPointId: context.focus?.pointId || null,
    recommendedProjection: viewportClass === "narrow" ? "directory" : state.projection,
    rolloutStage: getRolloutStage(knowledgePackage.moduleProfile.id),
  };
}

function workbenchRelationItems(knowledgePackage, focus) {
  const relationsById = new Map(knowledgePackage.relations.map((relation) => [relation.id, relation]));
  const unitsById = new Map(knowledgePackage.knowledgeUnits.map((unit) => [unit.id, unit]));
  const navigationById = new Map(knowledgePackage.navigationNodes.map((node) => [node.id, node]));
  const items = [];
  for (const relationId of knowledgePackage.indexes.relationIdsByPointId[focus.id] || []) {
    const relation = relationsById.get(relationId);
    if (!relation) continue;
    const targetPointId = relation.sourcePointId === focus.id ? relation.targetPointId : relation.sourcePointId;
    const target = unitsById.get(targetPointId);
    if (!target) continue;
    const displayType = relation.type === "prerequisite" && relation.targetPointId === focus.id
      ? "subsequent"
      : relation.type;
    const path = target.navigationPathIds.map((id) => navigationById.get(id)?.title).filter(Boolean);
    const evidenceBlockIds = relation.sourcePointId === focus.id
      ? relation.sourceBlockIds
      : relation.targetBlockIds;
    items.push({
      id: relation.id,
      relationId: relation.id,
      relationType: relation.type,
      displayType,
      relationLabel: RELATION_LABELS[displayType] || displayType,
      direction: relation.direction,
      reason: relation.reason,
      readingRole: relation.readingRole || "background",
      placement: relation.placement || "footer",
      placementBlockId: relation.placementBlockId || null,
      targetPointId: target.id,
      targetNavigationNodeId: target.navigationNodeId,
      targetParentNavigationNodeId: target.navigationPathIds[target.navigationPathIds.length - 2] || target.navigationNodeId,
      targetTitle: target.title,
      targetSummary: target.summary,
      targetPath: path,
      targetPathText: path.join(" › "),
      targetOrder: target.order,
      sourceBlockIds: [...relation.sourceBlockIds],
      targetBlockIds: [...relation.targetBlockIds],
      evidenceBlockIds: [...evidenceBlockIds],
      hasBlockEvidence: evidenceBlockIds.length > 0,
    });
  }
  return items.sort((a, b) => {
    const typeOrder = RELATION_TYPE_ORDER[a.relationType] - RELATION_TYPE_ORDER[b.relationType];
    if (typeOrder) return typeOrder;
    const directionOrder = (a.displayType === "subsequent" ? 1 : 0) - (b.displayType === "subsequent" ? 1 : 0);
    return directionOrder || a.targetOrder - b.targetOrder || a.relationId.localeCompare(b.relationId);
  });
}

function normalizeDisplayPreferences(raw = {}) {
  const preferences = { ...DISPLAY_DEFAULTS };
  if (["default", "large", "extraLarge"].includes(raw.fontScale)) preferences.fontScale = raw.fontScale;
  if (["normal", "relaxed"].includes(raw.lineSpacing)) preferences.lineSpacing = raw.lineSpacing;
  if (["comfortable", "compact"].includes(raw.density)) preferences.density = raw.density;
  if (["normal", "keyPoints"].includes(raw.emphasis)) preferences.emphasis = raw.emphasis;
  if (["full", "reduced"].includes(raw.motion)) preferences.motion = raw.motion;
  if (["terrain", "directory"].includes(raw.systemProjection)) preferences.systemProjection = raw.systemProjection;
  return preferences;
}

// Explicit editorial row starts partition existing text; no content is copied or inferred.
function projectReadingRows(text, textRuns, flow) {
  if (!flow || flow.kind !== "list" || !Array.isArray(flow.starts) || !flow.starts.length) return [];
  const starts = [];
  for (const selector of flow.starts) {
    const range = selector?.part === "text" && readingSelectorRange(text, selector);
    if (!range || (starts.length && range.start <= starts[starts.length - 1])) return [];
    starts.push(range.start);
  }
  const cuts = starts[0] === 0 ? starts : [0, ...starts];
  const rows = cuts.map((start, index) => {
    const end = cuts[index + 1] ?? text.length;
    const runs = [];
    let cursor = 0;
    for (const run of textRuns) {
      const runEnd = cursor + run.text.length;
      const from = Math.max(start, cursor), to = Math.min(end, runEnd);
      if (from < to) runs.push({ ...run, text: run.text.slice(from - cursor, to - cursor) });
      cursor = runEnd;
    }
    return { id: `row-${index}`, isItem: starts.includes(start), runs };
  });
  return rows.flatMap((row) => row.runs).map((run) => run.text).join("") === text ? rows : [];
}

function projectReadingBlock(block) {
  const kind = READING_KINDS.has(block.kind) ? block.kind : "fallback";
  const semantic = READING_SEMANTICS.has(block.semantic) ? block.semantic : "plain";
  const meta = SEMANTIC_META[semantic] || null;
  const payload = block.payload || {};
  const reading = block.reading && typeof block.reading === "object" ? JSON.parse(JSON.stringify(block.reading)) : null;
  const readingText = typeof payload.text === "string" ? payload.text : block.fallbackText;
  const textRuns = projectTextRuns(payload, block.fallbackText, reading, "text");
  const readingHeadingRun = textRuns.find((run) => run.role === "heading") || null;
  const readingHeading = readingHeadingRun ? { level: readingHeadingRun.level, text: readingHeadingRun.text } : null;
  const hasBoundary = textRuns.some((run) => run.role === "boundary")
    || (payload.items || []).some((value, index) => projectTextRuns(payload, block.fallbackText, reading, `items/${index}`).some((run) => run.role === "boundary"))
    || (payload.rows || []).some((row, rowIndex) => row.some((value, cellIndex) => projectTextRuns(payload, block.fallbackText, reading, `rows/${rowIndex}/${cellIndex}`).some((run) => run.role === "boundary")));
  const hasKey = textRuns.some((run) => run.role === "key")
    || (reading?.emphasis || []).some((item) => item.role === "key");
  const displayRole = readingHeading ? "reading-heading"
    : kind === "paragraph" && readingText.length <= 80 && /^(?:[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）)/.test(readingText.trim())
      ? "article-subhead" : "regular";
  const columns = Array.isArray(payload.columns) ? [...payload.columns] : [];
  const rows = Array.isArray(payload.rows) ? payload.rows.map((row) => [...row]) : [];
  const items = Array.isArray(payload.items) ? payload.items.map((value, index) => ({
    text: value,
    runs: projectTextRuns(payload, block.fallbackText, reading, `items/${index}`),
  })) : [];
  return {
    id: block.id,
    domId: `knowledge-block-${block.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
    sourceBlockId: block.sourceBlockId,
    kind,
    originalKind: block.kind,
    semantic,
    originalSemantic: block.semantic,
    semanticLabel: meta?.label || "",
    semanticTone: hasBoundary ? "boundary" : hasKey ? "reading" : "plain",
    keyPoint: hasKey || hasBoundary,
    displayRole,
    reading,
    readingHeading,
    title: block.title || null,
    text: readingText,
    textRuns,
    readingRows: projectReadingRows(readingText, textRuns, reading?.flow),
    ordered: Boolean(payload.ordered),
    items,
    columns,
    rows,
    tableRows: rows.map((row, rowIndex) => row.map((value, index) => ({
      label: columns[index] || `第${index + 1}列`,
      value,
      runs: projectTextRuns(payload, block.fallbackText, reading, `rows/${rowIndex}/${index}`),
    }))),
    fallbackText: block.fallbackText,
    sourceRefIds: [...block.sourceRefIds],
    sourceLocator: block.sourceLocator ? { ...block.sourceLocator } : null,
    reviewState: block.reviewState,
  };
}

function orientationItems(relationItems) {
  const selected = [];
  const usedTypes = new Set();
  for (const item of relationItems) {
    if (usedTypes.has(item.relationType)) continue;
    selected.push(item);
    usedTypes.add(item.relationType);
    if (selected.length === 3) break;
  }
  return selected;
}

function relationNeighbors(relationItems) {
  const groups = new Map();
  for (const item of relationItems) {
    const group = groups.get(item.targetPointId) || {
      id: item.targetPointId,
      pointId: item.targetPointId,
      navigationNodeId: item.targetNavigationNodeId,
      title: item.targetTitle,
      summary: item.targetSummary,
      pathText: item.targetPathText,
      relationIds: [],
      relationLabels: [],
      reasons: [],
      primaryRelationId: item.relationId,
    };
    group.relationIds.push(item.relationId);
    if (!group.relationLabels.includes(item.relationLabel)) group.relationLabels.push(item.relationLabel);
    if (!group.reasons.includes(item.reason)) group.reasons.push(item.reason);
    groups.set(item.targetPointId, group);
  }
  return [...groups.values()].slice(0, TERRAIN_BUDGETS[3]).map((group) => ({
    ...group,
    relationLabelsText: group.relationLabels.join(" · "),
  }));
}

function projectFocusWorkbenchViewModel(knowledgePackage, rawContext, options = {}) {
  const context = normalizeKnowledgeContext(knowledgePackage, rawContext);
  const focus = context.focus
    ? knowledgePackage.knowledgeUnits.find((unit) => unit.id === context.focus.pointId)
    : null;
  if (!focus) {
    return {
      moduleId: knowledgePackage.moduleProfile.id,
      hasFocus: false,
      redirect: { activity: "system", reason: "focus-required" },
    };
  }
  const navigationById = new Map(knowledgePackage.navigationNodes.map((node) => [node.id, node]));
  const path = focus.navigationPathIds.map((id) => ({ id, title: navigationById.get(id)?.title || "" }));
  const relationItems = workbenchRelationItems(knowledgePackage, focus);
  const available = availableActivities(knowledgePackage, focus.id);
  const currentActivity = available.includes(context.activity) ? context.activity : "reading";
  const focusNavigation = navigationById.get(focus.navigationNodeId);
  const parentNavigation = focusNavigation ? navigationById.get(focusNavigation.parentId) : null;
  const siblingNodes = parentNavigation
    ? parentNavigation.childIds.map((id) => navigationById.get(id)).filter((node) => node?.pointId)
    : [focusNavigation].filter(Boolean);
  const focusIndex = Math.max(0, siblingNodes.findIndex((node) => node.id === focus.navigationNodeId));
  const localStart = Math.max(0, Math.min(focusIndex - 2, siblingNodes.length - 6));
  const recallsById = new Map(knowledgePackage.recallItems.map((item) => [item.id, item]));
  const recallItems = focus.recallItemIds.map((id) => recallsById.get(id)).filter(Boolean);
  const displayPreferences = normalizeDisplayPreferences(options.displayPreferences);
  const readingBlocks = focus.blocks.map(projectReadingBlock);
  const readingAnchorId = context.anchor?.blockId || context.snapshots.reading?.blockId || null;
  const anchorIndex = readingAnchorId ? readingBlocks.findIndex((block) => block.id === readingAnchorId) : -1;
  const sourcesById = new Map(knowledgePackage.sourceReferences.map((source) => [source.id, source]));
  const previousTrail = context.explorationTrail[context.explorationTrail.length - 1] || null;
  const previousUnit = previousTrail
    ? knowledgePackage.knowledgeUnits.find((unit) => unit.id === previousTrail.fromPointId)
    : null;
  return {
    moduleId: knowledgePackage.moduleProfile.id,
    hasFocus: true,
    focus: {
      pointId: focus.id,
      navigationNodeId: focus.navigationNodeId,
      title: focus.title,
      summary: focus.summary,
      path,
      pathText: path.map((item) => item.title).join(" › "),
      contentVersion: focus.contentVersion,
      reviewState: focus.reviewState,
      statusLabel: focus.publishable ? "已核对" : "内容校订中",
      riskFlags: [...focus.riskFlags],
    },
    currentActivity,
    relationMode: currentActivity === "relations" ? context.relationMode || "orientation" : null,
    goalStrip: context.goalContext ? { ...context.goalContext } : null,
    controller: available.map((activity) => ({
      id: activity,
      ...ACTIVITY_META[activity],
      active: activity === currentActivity,
    })),
    systemStage: {
      parent: parentNavigation ? { id: parentNavigation.id, title: parentNavigation.title } : null,
      nodes: siblingNodes.slice(localStart, localStart + 6).map((node) => ({
        id: node.id,
        pointId: node.pointId,
        title: node.title,
        current: node.id === focus.navigationNodeId,
        order: node.order,
      })),
      totalSiblings: siblingNodes.length,
      returnSnapshot: context.snapshots.system,
    },
    orientationStage: {
      items: orientationItems(relationItems),
      hasRelations: relationItems.length > 0,
      total: relationItems.length,
      hasMore: relationItems.length > 3,
    },
    relationStage: {
      neighbors: relationNeighbors(relationItems),
      allItems: relationItems,
      total: relationItems.length,
      hasMore: relationItems.length > TERRAIN_BUDGETS[3],
      graphLimit: TERRAIN_BUDGETS[3],
    },
    readingStage: {
      blocks: readingBlocks,
      blockIds: readingBlocks.map((block) => block.id),
      blockCount: readingBlocks.length,
      outline: readingBlocks.filter((block) => block.kind === "heading").map((block) => ({
        id: block.id,
        domId: block.domId,
        title: block.title || block.text || block.fallbackText,
      })),
      anchor: readingAnchorId ? {
        blockId: readingAnchorId,
        index: anchorIndex,
        valid: anchorIndex >= 0,
        source: context.returnTarget?.source || context.origin?.type || "direct",
      } : null,
      anchorNotice: context.anchorNotice,
      displayPreferences,
      initialBatchSize: 24,
      batchSize: 16,
      sources: focus.sourceRefIds.map((id) => sourcesById.get(id)).filter(Boolean).map((source) => ({
        id: source.id,
        sourceType: source.sourceType,
        locator: { ...source.locator },
        sourceVersion: source.sourceVersion,
        reviewedAt: source.reviewedAt,
        reviewerState: source.reviewerState,
        riskFlags: [...source.riskFlags],
      })),
    },
    recallStage: {
      items: recallItems.map((item) => ({
        id: item.id,
        prompt: item.prompt,
        answer: item.answer,
        pitfall: item.pitfall,
        sourceBlockIds: [...item.sourceBlockIds],
        hasBlockEvidence: item.sourceBlockIds.length > 0,
      })),
    },
    returnModel: {
      canBackTrail: Boolean(previousTrail && previousUnit),
      trailLength: context.explorationTrail.length,
      previousPointId: previousUnit?.id || null,
      previousTitle: previousUnit?.title || null,
      origin: context.origin,
      returnTarget: context.returnTarget,
      canReturnFromSource: Boolean(context.returnTarget),
    },
  };
}

function projectNavigationOverview(knowledgePackage, nodeId) {
  const node = knowledgePackage.navigationNodes.find((item) => item.id === nodeId);
  if (!node) return null;
  const children = node.childIds
    .map((id) => knowledgePackage.navigationNodes.find((item) => item.id === id))
    .filter(Boolean);
  return {
    id: node.id,
    domId: `knowledge-node-${node.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
    title: node.title,
    nodeType: node.nodeType || node.type,
    pointId: node.pointId,
    pointCount: node.pointCount,
    childCount: node.childIds.length,
    previewBranches: children.slice(0, 4).map((item) => ({ id: item.id, title: item.title })),
    moreBranchCount: Math.max(0, children.length - 4),
    pathText: node.pathTitles.join(" › "),
    description: node.childIds.length
      ? `包含 ${node.childIds.length} 个直接分支、${node.pointCount} 个知识`
      : `包含 ${node.pointCount} 个知识`,
  };
}

function projectKnowledgeCardViewModel(knowledgePackage, pointId, options = {}) {
  const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === pointId);
  const projection = knowledgePackage.knowledgeUnitCardProjections.find((item) => item.pointId === pointId);
  if (!unit || !projection) return null;
  const navigationById = new Map(knowledgePackage.navigationNodes.map((item) => [item.id, item]));
  const atomsById = new Map(knowledgePackage.knowledgeAtomRefs.map((item) => [item.id, item]));
  const blocksById = new Map(unit.blocks.map((item) => [item.id, item]));
  const sourcesById = new Map(knowledgePackage.sourceReferences.map((item) => [item.id, item]));
  const recallProjection = knowledgePackage.recallProjections.find((item) => item.pointId === pointId) || null;
  const path = projection.navigationPathIds.map((id) => ({ id, title: navigationById.get(id)?.title || "" }));
  const atoms = projection.orderedAtomRefIds.map((id) => {
    const atom = atomsById.get(id);
    if (!atom) return null;
    const sourceBlocks = atom.sourceBlockIds.map((blockId) => blocksById.get(blockId)).filter(Boolean);
    return {
      id: atom.id,
      role: atom.role,
      roleLabel: platformSurfaceCopy.atomRoles[atom.role] || "关键内容",
      order: atom.order,
      title: atom.title,
      sourceBlockIds: [...atom.sourceBlockIds],
      sourceRefIds: [...atom.sourceRefIds],
      reviewState: atom.reviewState,
      text: sourceBlocks.map((block) => block.fallbackText).join("\n"),
      blocks: sourceBlocks.map(projectReadingBlock),
    };
  }).filter(Boolean);
  const relationContext = workbenchRelationItems(knowledgePackage, unit);
  const contrastPairs = knowledgePackage.contrastPairs
    .filter((item) => item.leftPointId === pointId || item.rightPointId === pointId)
    .map((item) => ({
      id: item.id,
      leftPointId: item.leftPointId,
      leftAtomRefIds: [...item.leftAtomRefIds],
      rightPointId: item.rightPointId,
      rightAtomRefIds: [...item.rightAtomRefIds],
      reason: item.reason,
      dimensions: [...item.dimensions],
      boundaries: [...item.boundaries],
      sourceBlockIds: [...item.sourceBlockIds],
      sourceRefIds: [...item.sourceRefIds],
      recallItemIds: [...item.recallItemIds],
      reviewState: item.reviewState,
    }));
  return {
    mode: ["preview", "full", "recall"].includes(options.mode) ? options.mode : "preview",
    identity: {
      pointId: unit.id,
      title: projection.title,
      path,
      pathText: path.map((item) => item.title).join(" › "),
      summary: projection.summary,
      contentVersion: projection.contentVersion,
      reviewState: unit.reviewState,
      statusLabel: unit.publishable ? "已核对" : "内容校订中",
    },
    atoms,
    previewAtoms: atoms.slice(0, 3),
    content: unit.blocks.map(projectReadingBlock),
    relationContext,
    relationPreview: orientationItems(relationContext),
    recall: recallProjection ? {
      recallItemId: recallProjection.recallItemId,
      pointId: recallProjection.pointId,
      prompt: recallProjection.prompt,
      answerAtomRefIds: [...recallProjection.answerAtomRefIds],
      answerSourceBlockIds: [...recallProjection.answerSourceBlockIds],
      pitfallAtomRefIds: [...recallProjection.pitfallAtomRefIds],
      pitfallSourceBlockIds: [...recallProjection.pitfallSourceBlockIds],
      sourceRefIds: [...recallProjection.sourceRefIds],
      returnTarget: { ...recallProjection.returnTarget },
    } : null,
    contrastPairs,
    completeness: {
      ...projection.completeness,
      missingReasons: [...projection.completeness.missingReasons],
    },
    sourceRefIds: [...projection.sourceRefIds],
    sources: projection.sourceRefIds.map((id) => sourcesById.get(id)).filter(Boolean).map((source) => ({
      id: source.id,
      sourceName: "政治理论 PDF",
      sourcePages: [...(source.locator?.sourcePages || [])],
      sourcePagesText: (source.locator?.sourcePages || []).join("、"),
      reviewedAt: source.reviewedAt,
    })),
  };
}

function projectedReadingPart(block, part) {
  if (!block) return null;
  if (part === "text") return block.text;
  const item = String(part || "").match(/^items\/(\d+)$/);
  if (item) return block.items?.[Number(item[1])]?.text ?? null;
  const cell = String(part || "").match(/^rows\/(\d+)\/(\d+)$/);
  if (cell) return block.rows?.[Number(cell[1])]?.[Number(cell[2])] ?? null;
  return null;
}

function projectComparisonRows(owner, contentById) {
  const comparison = owner.reading?.comparison;
  if (!comparison?.groupId || !Array.isArray(comparison.rows)) return [];
  const rows = [];
  for (const row of comparison.rows) {
    if (!row?.dimension || !Array.isArray(row.cells) || row.cells.length !== 2) return [];
    const cells = [];
    for (const cell of row.cells) {
      const target = contentById.get(cell.blockId);
      const value = projectedReadingPart(target, cell.part);
      if (!target || !cell.roleLabel || !readingSelectorRange(value, cell)) return [];
      cells.push({ roleLabel: cell.roleLabel, value: cell.quote, blockId: cell.blockId });
    }
    rows.push({ dimension: row.dimension, cells });
  }
  return rows;
}

function relationPurposeLabel(relation) {
  if (relation.readingRole === "crossPointComparison") return "对照理解";
  if (relation.displayType === "prerequisite") return "先了解";
  if (relation.displayType === "subsequent") return "继续了解";
  if (relation.displayType === "contrast") return "查看区别";
  return "延伸阅读";
}

function projectKnowledgeCardSurfaceViewModel(knowledgePackage, pointId, options = {}) {
  const card = projectKnowledgeCardViewModel(knowledgePackage, pointId, { mode: "full" });
  if (!card) return null;
  const activity = ["reading", "relations", "recall"].includes(options.activity)
    ? options.activity
    : "reading";
  const systematicMode = options.systematicMode === true;
  const inlineContrastsByBlockId = new Map();
  const inlineRelationsByBlockId = new Map();
  const inlineRelationIds = new Set();
  const relationItems = card.relationContext.map((relation) => {
    const pair = relation.relationType === "contrast" && card.contrastPairs.find((item) => (
      (item.leftPointId === pointId && item.rightPointId === relation.targetPointId)
      || (item.rightPointId === pointId && item.leftPointId === relation.targetPointId)
    ));
    const localBoundary = relation.readingRole === "localBoundary" && relation.placement === "section-end";
    const declaredAnchor = relation.placementBlockId && card.content.some((block) => block.id === relation.placementBlockId)
      ? relation.placementBlockId
      : null;
    const evidenceAnchor = relation.evidenceBlockIds.find((id) => card.content.some((block) => block.id === id));
    const anchorBlockId = localBoundary ? declaredAnchor || evidenceAnchor : null;
    if (!pair) {
      if (anchorBlockId) {
        const items = inlineRelationsByBlockId.get(anchorBlockId) || [];
        items.push({
          relationId: relation.relationId,
          relationLabel: relationPurposeLabel(relation),
          targetTitle: relation.targetTitle,
          reason: relation.reason,
        });
        inlineRelationsByBlockId.set(anchorBlockId, items);
        inlineRelationIds.add(relation.relationId);
      }
      return { ...relation, purposeLabel: relationPurposeLabel(relation) };
    }
    const formalContrast = {
      dimensionText: pair.dimensions.join("、"),
      boundaryText: pair.boundaries.join("\n"),
    };
    if (anchorBlockId) {
      const items = inlineContrastsByBlockId.get(anchorBlockId) || [];
      items.push({
        relationId: relation.relationId,
        targetTitle: relation.targetTitle,
        reason: relation.reason,
        ...formalContrast,
      });
      inlineContrastsByBlockId.set(anchorBlockId, items);
      inlineRelationIds.add(relation.relationId);
    }
    return { ...relation, formalContrast, purposeLabel: relationPurposeLabel(relation) };
  });
  const contentById = new Map(card.content.map((block) => [block.id, block]));
  const firstContentBlockId = card.content[0]?.id || "";
  const isSelfHeading = (block) => {
    if (block.kind !== "heading") return false;
    const label = block.readingHeading?.text || block.title || block.text || "";
    if (label === card.identity.title) return true;
    return block.id === firstContentBlockId && label.length >= 4 && card.identity.title.endsWith(label);
  };
  const outlineBlocks = card.content.filter((block) => block.readingHeading || block.kind === "heading");
  const visibleOutlineBlocks = outlineBlocks.filter((block) => !isSelfHeading(block));
  const outlineCounters = [0, 0, 0];
  const sectionOutline = visibleOutlineBlocks.map((block) => {
    const level = block.readingHeading?.level || 1;
    outlineCounters[level - 1] += 1;
    for (let index = level; index < 3; index += 1) outlineCounters[index] = 0;
    const label = block.readingHeading?.text || block.title || block.text;
    return {
      id: block.id,
      label,
      displayLabel: label.replace(/^\s*(?:[0-9]+[.．、]|[一二三四五六七八九十]+、|[（(](?:[0-9]+|[一二三四五六七八九十]+)[）)]|[①②③④⑤⑥⑦⑧⑨⑩])\s*/, ""),
      level,
      number: outlineCounters.slice(0, level).join("."),
      kind: "article",
    };
  });
  const semanticBlocks = card.content.map((block) => ({
    ...block,
    isSelfHeading: isSelfHeading(block),
    inlineContrasts: inlineContrastsByBlockId.get(block.id) || [],
    inlineRelations: inlineRelationsByBlockId.get(block.id) || [],
    comparisonRows: projectComparisonRows(block, contentById),
  }));
  const footerItems = relationItems.filter((relation) => !inlineRelationIds.has(relation.relationId));
  return {
    activity,
    presentation: {
      mode: systematicMode ? "systematic-learning" : "standard",
      summaryLabel: "",
      showSummaryDuringRecall: !systematicMode,
      selfHeadingLabel: systematicMode ? "正文" : "",
      relationStyle: systematicMode ? "reader" : "standard",
    },
    identity: card.identity,
    semanticBlocks,
    sectionOutline,
    outlinePreview: sectionOutline.filter((item) => item.level === 1),
    relationFooter: footerItems.length ? {
      label: "相关知识",
      items: footerItems,
    } : null,
    recallFace: card.recall,
    contrastPairs: card.contrastPairs,
    completeness: card.completeness,
    sourceRefIds: card.sourceRefIds,
    sources: card.sources,
    goalGuide: options.goalGuide || null,
  };
}

function projectReturnModel(knowledgePackage, rawContext = {}) {
  const context = rawContext || {};
  if (context.returnTarget) {
    return { target: "source-context", label: "返回刚才的位置", snapshot: context.returnTarget };
  }
  const previous = context.explorationTrail?.[context.explorationTrail.length - 1];
  if (previous) {
    return { target: "trail", label: "返回上一个知识", snapshot: previous };
  }
  if (context.goalContext) {
    return { target: "goal", label: `返回${context.goalContext.label || "学习路线"}`, snapshot: context.goalContext };
  }
  const search = context.snapshots?.search;
  if (context.origin?.type === "search" || search?.query || search?.resultId) {
    return { target: "search", label: "返回搜索结果", snapshot: { search: search || null } };
  }
  return {
    target: "system",
    label: "返回知识全景",
    snapshot: { system: context.snapshots?.system || null },
  };
}

function projectSurfaceDecision(knowledgePackage, rawContext, input = {}) {
  const context = rawContext || {};
  const contextTools = [
    { id: "display", label: "显示设置" },
    { id: "source-feedback", label: "来源与反馈" },
  ];
  if (input.kind === "context-tools") {
    return { stateId: "context-tools", recommendedAction: null, secondaryActions: [], contextTools, returnModel: projectReturnModel(knowledgePackage, context) };
  }
  if (input.kind === "relation-preview") {
    const relation = knowledgePackage.relations.find((item) => item.id === input.relationId);
    const targetPointId = relation && context.focus?.pointId === relation.sourcePointId
      ? relation.targetPointId
      : relation && context.focus?.pointId === relation.targetPointId
        ? relation.sourcePointId
        : null;
    const target = knowledgePackage.knowledgeUnits.find((item) => item.id === targetPointId);
    return {
      stateId: "relation-preview",
      recommendedAction: relation ? {
        id: "follow-relation",
        label: "沿这条关系查看",
        commitsFocus: true,
        targetActivity: "relations",
        event: { type: "FOLLOW_RELATION", relationId: relation.id },
      } : null,
      secondaryActions: relation && target ? [
        {
          id: "read-related",
          label: "阅读目标完整内容",
          commitsFocus: true,
          targetActivity: "reading",
          event: { type: "FOLLOW_RELATION", relationId: relation.id },
        },
        {
          id: "locate-related",
          label: "在知识全景中定位",
          commitsFocus: false,
          targetActivity: "system",
          objectId: target.id,
          event: {
            type: "UPDATE_SYSTEM_SNAPSHOT",
            snapshot: {
              focusNodeId: target.navigationNodeId,
              scopeNodeId: target.navigationPathIds[target.navigationPathIds.length - 2] || target.navigationNodeId,
            },
          },
        },
      ] : [],
      contextTools,
      returnModel: projectReturnModel(knowledgePackage, context),
    };
  }
  if (input.kind === "search-result") {
    const result = input.result;
    const targetActivity = result?.primaryAction?.mode || "reading";
    const searchSnapshot = input.searchSnapshot || null;
    const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === result?.pointId);
    const node = knowledgePackage.navigationNodes.find((item) => item.id === unit?.navigationNodeId);
    const actionFor = (action) => action.mode === "system"
      ? {
          id: "locate-system",
          label: action.label,
          objectId: result.pointId,
          commitsFocus: false,
          targetActivity: "system",
          event: {
            type: "UPDATE_SYSTEM_SNAPSHOT",
            snapshot: {
              projection: "terrain",
              focusNodeId: unit?.navigationNodeId || null,
              scopeNodeId: node?.parentId || node?.id || null,
              scrollAnchorId: unit?.navigationNodeId || null,
              viewportToken: "L2",
            },
          },
        }
      : {
          id: `open-${action.mode}`,
          label: action.label,
          objectId: result.pointId,
          commitsFocus: true,
          targetActivity: action.mode,
          event: {
            type: "SELECT_POINT",
            pointId: result.pointId,
            origin: { type: "search", refId: searchSnapshot?.query || result.pointId },
          },
        };
    return {
      stateId: "search-direct",
      recommendedAction: result ? actionFor(result.primaryAction || { mode: targetActivity, label: "打开这个知识" }) : null,
      secondaryActions: (result?.otherActions || []).map(actionFor),
      contextTools,
      returnModel: { target: "search", label: "返回搜索结果", snapshot: { search: searchSnapshot } },
    };
  }
  if (input.kind === "knowledge-selection") {
    const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === input.pointId);
    return {
      stateId: "knowledge-direct",
      recommendedAction: unit ? {
        id: "open-knowledge",
        label: "打开这个知识",
        commitsFocus: true,
        targetActivity: "reading",
        event: {
          type: "SELECT_POINT",
          pointId: unit.id,
          origin: { type: input.origin || "system", refId: input.refId || unit.navigationNodeId },
        },
      } : null,
      secondaryActions: [],
      contextTools,
      returnModel: projectReturnModel(knowledgePackage, context),
    };
  }
  return { stateId: "idle", recommendedAction: null, secondaryActions: [], contextTools, returnModel: projectReturnModel(knowledgePackage, context) };
}

function activeRouteRecord(knowledgePackage, records = []) {
  const active = [];
  for (const record of records) {
    if (!record?.planOptions || !record.session) continue;
    const plan = planLearningRoute(knowledgePackage, record.planOptions);
    if (!plan || record.session.planId !== plan.id || record.session.packageVersion !== plan.packageVersion) continue;
    const session = normalizeRouteSession(plan, record.session);
    if (session.status === "active") active.push({ plan, session, updatedAt: session.updatedAt || 0 });
  }
  return active.sort((a, b) => b.updatedAt - a.updatedAt || a.plan.type.localeCompare(b.plan.type))[0] || null;
}

function invalidActiveRouteRecord(knowledgePackage, records = []) {
  for (const record of records || []) {
    if (!record?.planOptions || record.session?.status !== "active") continue;
    const plan = planLearningRoute(knowledgePackage, record.planOptions);
    if (!plan || record.session.planId !== plan.id || record.session.packageVersion !== plan.packageVersion) {
      return { type: record.planOptions.type || "quick", reason: !plan ? "route-data-unavailable" : "route-version-changed" };
    }
  }
  return null;
}

function projectHomeDecision(knowledgePackage, options = {}) {
  const activeRoute = activeRouteRecord(knowledgePackage, options.routeRecords);
  const goals = Object.entries(ROUTE_META).map(([type, meta]) => {
    const plan = planRecommendedRoute(knowledgePackage, type);
    const saved = activeRouteRecord(knowledgePackage, (options.routeRecords || []).filter((record) => record?.planOptions?.type === type));
    const progressRecord = (options.routeRecords || []).find((record) => record?.planOptions?.type === type);
    const progressPlan = progressRecord?.planOptions ? planLearningRoute(knowledgePackage, progressRecord.planOptions) : null;
    const progressSession = progressPlan
      && progressRecord.session?.planId === progressPlan.id
      && progressRecord.session?.packageVersion === progressPlan.packageVersion
      ? normalizeRouteSession(progressPlan, progressRecord.session)
      : null;
    const validStepIds = new Set((progressPlan?.steps || []).map((step) => step.stepId));
    const completedCount = progressSession?.status === "expired"
      ? 0
      : progressSession?.status === "completed"
        ? validStepIds.size
        : new Set((progressSession?.completedStepIds || []).filter((id) => validStepIds.has(id))).size;
    const progressPercent = validStepIds.size ? Math.round(completedCount / validStepIds.size * 100) : 0;
    const position = saved ? Math.min(saved.session.currentIndex + 1, saved.plan.steps.length) : 0;
    return {
      id: type,
      ...meta,
      recommendedScopeId: plan?.scopeId || null,
      progressPercent,
      progressLabel: saved ? (type === "exam" ? routeResumeLabel(saved.plan, saved.session) : `进度已保留 · 第 ${position} / ${saved.plan.steps.length} 步`) : null,
      href: `/subpackages/politics/route/index?type=${type}&${saved ? "resume=1" : "recommended=1"}`,
    };
  });
  const storageStatus = options.storageStatus || { ok: true };
  const finish = (decision, currentGoalId = null) => ({
    ...decision,
    storageStatus,
    goals,
    otherGoals: goals.filter((item) => item.id !== currentGoalId),
  });
  if (activeRoute) {
    const currentStep = activeRoute.plan.steps[activeRoute.session.currentIndex] || null;
    const currentUnit = knowledgePackage.knowledgeUnits.find((item) => item.id === currentStep?.pointId);
    const currentNode = knowledgePackage.navigationNodes.find((item) => item.id === currentStep?.navigationNodeId);
    const currentTitle = currentStep?.title || currentUnit?.title || currentNode?.title || "当前步骤";
    const recent = resolveRecentModuleContext(knowledgePackage, options.recent);
    return finish({
      stateId: "active-route",
      statusLabel: "正在进行",
      title: activeRoute.plan.type === "quick" ? "继续快速了解" : activeRoute.plan.label,
      description: activeRoute.plan.type === "quick"
        ? `上次读到：${currentTitle} · ${activeRoute.session.currentIndex + 1}/${activeRoute.plan.steps.length}`
        : activeRoute.plan.type === "exam"
        ? `第 ${activeRoute.session.currentIndex + 1}/${activeRoute.plan.steps.length} 张 · ${currentTitle}`
        : `第 ${activeRoute.session.currentIndex + 1} / ${activeRoute.plan.steps.length} 步 · ${currentTitle}`,
      recommendedAction: {
        id: "resume-route",
        label: routeResumeLabel(activeRoute.plan, activeRoute.session),
        url: `/subpackages/politics/route/index?type=${activeRoute.plan.type}&resume=1`,
      },
      secondaryActions: recent.status === "valid"
        ? [{ id: "resume-recent", label: "查看上次知识", url: "/subpackages/politics/map/index?origin=recent&restore=1" }]
        : [],
    }, activeRoute.plan.type);
  }
  const invalidRoute = invalidActiveRouteRecord(knowledgePackage, options.routeRecords);
  if (invalidRoute) {
    return finish({
      stateId: "invalid-recovery",
      statusLabel: "任务需要更新",
      title: "上次引导已失效",
      description: "知识内容已经变化，需要按当前内容重新生成本次引导",
      recommendedAction: {
        id: "rebuild-route",
        label: "重新生成本次引导",
        url: `/subpackages/politics/route/index?type=${invalidRoute.type}&recommended=1`,
      },
      secondaryActions: [],
      recoveryReason: invalidRoute.reason,
    }, invalidRoute.type);
  }
  const recent = resolveRecentModuleContext(knowledgePackage, options.recent);
  if (recent.status === "valid") {
    const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === recent.context.focus?.pointId);
    return finish({
      stateId: "recent-focus",
      statusLabel: "上次看到",
      title: unit?.title || "最近知识",
      description: "从上次知识和位置继续",
      recommendedAction: {
        id: "continue-focus",
        label: "继续了解",
        url: "/subpackages/politics/map/index?origin=recent&restore=1",
      },
      secondaryActions: [],
    });
  }
  const quick = planRecommendedRoute(knowledgePackage, "quick");
  if (recent.status === "invalid") {
    return finish({
      stateId: "invalid-recovery",
      statusLabel: "内容已更新",
      title: "上次位置已变化",
      description: "从新的知识全景重新开始，旧位置不会被猜测恢复",
      recommendedAction: {
        id: "restart-quick",
        label: "从快速了解开始",
        url: "/subpackages/politics/route/index?type=quick&recommended=1",
      },
      secondaryActions: [],
      recoveryReason: recent.reason,
    }, "quick");
  }
  return finish({
    stateId: "first-use",
    statusLabel: "推荐起点",
    title: "先用两条主干看清全貌",
    description: storageStatus.ok === false
      ? "暂时无法读取上次进度；可以从推荐起点重新开始"
      : quick?.basis[0]?.reason || "从知识全景开始",
    recommendedAction: {
      id: "start-quick",
      label: "快速了解",
      url: "/subpackages/politics/route/index?type=quick&recommended=1",
    },
    secondaryActions: [],
  }, "quick");
}

function projectKnowledgeSpaceViewModel(knowledgePackage, rawContext, rawState = {}) {
  const context = normalizeKnowledgeContext(knowledgePackage, rawContext);
  const rootId = knowledgePackage.indexes.rootNavigationIds[0];
  const root = knowledgePackage.navigationNodes.find((item) => item.id === rootId);
  const nodesById = new Map(knowledgePackage.navigationNodes.map((item) => [item.id, item]));
  const allowedStates = new Set(["overview", "branch"]);
  let surfaceState = allowedStates.has(rawState.surfaceState) ? rawState.surfaceState : "overview";
  const projection = rawState.projection === "directory" ? "directory" : "terrain";
  const expandedBranch = nodesById.get(rawState.expandedBranchId) || null;
  if (surfaceState === "branch" && !expandedBranch) surfaceState = "overview";
  const activeRegionId = expandedBranch
    ? (root?.childIds || []).find((id) => expandedBranch.id === id || expandedBranch.pathIds.includes(id)) || null
    : null;
  const regions = (root?.childIds || []).map((id) => ({
    ...projectNavigationOverview(knowledgePackage, id),
    active: id === activeRegionId,
    compressed: Boolean(activeRegionId && id !== activeRegionId),
  }));
  const hasBranchContext = surfaceState === "branch" && expandedBranch;
  const directoryNode = (nodeId, depth = 0) => {
    const node = nodesById.get(nodeId);
    if (!node) return null;
    return {
      ...projectNavigationOverview(knowledgePackage, node.id),
      depth,
      indent: `${depth * 16}px`,
      children: node.childIds.map((id) => directoryNode(id, depth + 1)).filter(Boolean),
    };
  };
  const directoryTree = directoryNode(rootId);
  const flattenDirectory = (node) => node
    ? [{
        id: node.id,
        domId: node.domId,
        title: node.title,
        nodeType: node.nodeType,
        pointId: node.pointId,
        pointCount: node.pointCount,
        depth: node.depth,
        indent: node.indent,
      }, ...node.children.flatMap(flattenDirectory)]
    : [];
  const directoryRows = flattenDirectory(directoryTree);
  const descendantLeaves = (node) => node.childIds.length
    ? node.childIds.flatMap((id) => {
        const child = nodesById.get(id);
        return child ? descendantLeaves(child) : [];
      })
    : [projectNavigationOverview(knowledgePackage, node.id)].filter(Boolean);
  const branchGroups = !hasBranchContext ? [] : expandedBranch.childIds.some((id) => nodesById.get(id)?.childIds.length)
    ? expandedBranch.childIds.map((id) => {
        const child = nodesById.get(id);
        return child ? {
          ...projectNavigationOverview(knowledgePackage, child.id),
          items: descendantLeaves(child),
        } : null;
      }).filter(Boolean)
    : [{
        ...projectNavigationOverview(knowledgePackage, expandedBranch.id),
        items: descendantLeaves(expandedBranch),
      }];
  const collapsedChapterIds = new Set(Array.isArray(rawState.collapsedChapterIds) ? rawState.collapsedChapterIds : []);
  const branchDirectoryRows = !hasBranchContext ? [] : flattenDirectory(directoryNode(expandedBranch.id)).slice(1).map((row) => {
    const node = nodesById.get(row.id);
    const collapsible = node.type === "chapter" && node.childIds.length > 0;
    return {
      ...row,
      indent: `${Math.max(0, row.depth - 1) * 16}px`,
      collapsible,
      collapsed: collapsible && collapsedChapterIds.has(node.id),
      hidden: node.pathIds.slice(0, -1).some((id) => nodesById.get(id)?.type === "chapter" && collapsedChapterIds.has(id)),
    };
  });
  return {
    moduleId: knowledgePackage.moduleProfile.id,
    moduleTitle: knowledgePackage.moduleProfile.title,
    upcomingSection: knowledgePackage.moduleProfile.id === "politics"
      ? { title: "第二部分 时事政治", status: "暂未开放", description: "内容筹备中" }
      : null,
    surfaceState,
    overviewContext: {
      ...projectNavigationOverview(knowledgePackage, rootId),
      regions,
      activeRegionId,
      expandedBranchId: hasBranchContext ? expandedBranch.id : null,
      displayMode: surfaceState === "overview" ? "complete" : "compact",
    },
    branch: hasBranchContext ? {
      ...projectNavigationOverview(knowledgePackage, expandedBranch.id),
      groups: branchGroups,
      directoryRows: branchDirectoryRows,
      collapsed: Array.isArray(rawState.collapsedScopeIds) && rawState.collapsedScopeIds.includes(expandedBranch.id),
      peers: regions.filter((item) => item.id !== activeRegionId),
      peerOverflowCount: 0,
      path: expandedBranch.pathIds
        .map((id) => nodesById.get(id))
        .filter((node) => node && node.id !== rootId && node.id !== expandedBranch.id && node.id !== activeRegionId)
        .map((node) => ({ id: node.id, title: node.title })),
    } : null,
    projection,
    directoryTree,
    directoryRows,
    surfaceLanguage: projectSurfaceLanguage(knowledgePackage, { surfaceState }),
    contextTools: [],
    contextBar: {
      label: surfaceState === "overview" ? "知识全景" : surfaceState === "branch" ? "正在展开" : "当前知识",
      title: surfaceState === "branch" ? expandedBranch.title : knowledgePackage.moduleProfile.title,
      backLabel: surfaceState === "branch" ? "返回完整全景" : null,
      returnModel: projectReturnModel(knowledgePackage, context),
    },
    connectionNarrative: {
      mode: context.goalContext ? "route" : "hierarchy",
      label: context.goalContext ? context.goalContext.label : "正式体系位置",
      detail: context.goalContext?.positionText || "当前只用正式层级表达空间归属",
      hierarchyVisible: true,
      routeOverlay: context.goalContext ? { ...context.goalContext } : null,
      relationItems: [],
    },
    mobileBudget: {
      maxRegionsPerViewport: 6,
      maxBranchNodesPerViewport: 6,
      maxVisiblePeers: 3,
    },
    viewport: {
      token: rawState.viewportToken || context.snapshots.system?.viewportToken || "L0",
      scrollAnchorId: rawState.scrollAnchorId || context.snapshots.system?.scrollAnchorId || null,
      expandedBranchId: expandedBranch?.id || null,
      selectedPointId: null,
      displayPreferences: normalizeDisplayPreferences(rawState.displayPreferences),
    },
    rolloutStage: getRolloutStage(knowledgePackage.moduleProfile.id),
  };
}

module.exports = {
  projectFoundationViewModel,
  TERRAIN_BUDGETS,
  buildTerrainAggregates,
  normalizeProjectionState,
  projectTerrainViewModel,
  projectFocusWorkbenchViewModel,
  projectNavigationOverview,
  projectKnowledgeCardViewModel,
  projectKnowledgeCardSurfaceViewModel,
  projectReturnModel,
  projectSurfaceDecision,
  projectHomeDecision,
  projectKnowledgeSpaceViewModel,
  normalizeDisplayPreferences,
  projectReadingBlock,
};
