const CONTEXT_SCHEMA_VERSION = 1;
const ACTIVITIES = Object.freeze(["system", "relations", "reading", "recall"]);
const MAX_TRAIL_LENGTH = 20;

function createSearchSnapshot() {
  return {
    query: "",
    intent: "all",
    resultId: null,
    resultIndex: null,
    scrollAnchorId: null,
    matchEvidence: null,
  };
}

function storageKey(moduleId) {
  return `knowledgeContext:${moduleId}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createKnowledgeContext(moduleId, options = {}) {
  return {
    schemaVersion: CONTEXT_SCHEMA_VERSION,
    moduleId,
    focus: null,
    activity: "system",
    relationMode: null,
    goalContext: null,
    lens: "directory",
    origin: options.origin || { type: "module", refId: moduleId },
    anchor: null,
    anchorNotice: null,
    explorationTrail: [],
    snapshots: {
      system: {
        projection: "terrain",
        expandedNodeIds: [],
        focusNodeId: null,
        scrollAnchorId: null,
        viewportToken: "L0",
      },
      relations: null,
      reading: null,
      recall: null,
      search: createSearchSnapshot(),
    },
    returnTarget: null,
    updatedAt: options.updatedAt ?? 0,
  };
}

function packageMaps(knowledgePackage) {
  const blockIds = [];
  for (const unit of knowledgePackage.knowledgeUnits) {
    for (const block of unit.blocks) blockIds.push(block.id);
  }
  return {
    units: new Map(knowledgePackage.knowledgeUnits.map((unit) => [unit.id, unit])),
    relations: new Map(knowledgePackage.relations.map((relation) => [relation.id, relation])),
    blocks: new Set(blockIds),
    recalls: new Set(knowledgePackage.recallItems.map((item) => item.id)),
  };
}

function relationIdsForPoint(knowledgePackage, pointId) {
  return knowledgePackage.indexes.relationIdsByPointId[pointId] || [];
}

function availableActivities(knowledgePackage, pointId) {
  if (!pointId) return ["system"];
  const result = ["system"];
  if (relationIdsForPoint(knowledgePackage, pointId).length) result.push("relations");
  result.push("reading");
  if ((knowledgePackage.indexes.recallItemIdsByPointId[pointId] || []).length) result.push("recall");
  return result;
}

function focusForUnit(unit) {
  return {
    pointId: unit.id,
    navigationNodeId: unit.navigationNodeId,
    contentVersion: unit.contentVersion,
  };
}

function normalizeKnowledgeContext(knowledgePackage, rawContext) {
  const moduleId = knowledgePackage.moduleProfile.id;
  if (!rawContext || rawContext.moduleId !== moduleId || rawContext.schemaVersion !== CONTEXT_SCHEMA_VERSION) {
    return createKnowledgeContext(moduleId, {
      origin: { type: "invalid-context", refId: rawContext?.moduleId || null },
      updatedAt: rawContext?.updatedAt ?? 0,
    });
  }

  const maps = packageMaps(knowledgePackage);
  const next = { ...createKnowledgeContext(moduleId), ...clone(rawContext) };
  next.explorationTrail = Array.isArray(next.explorationTrail) ? next.explorationTrail.slice(-MAX_TRAIL_LENGTH) : [];
  next.snapshots = { ...createKnowledgeContext(moduleId).snapshots, ...(next.snapshots || {}) };
  if (!next.focus?.pointId || !maps.units.has(next.focus.pointId)) {
    const empty = createKnowledgeContext(moduleId, {
      origin: next.origin,
      updatedAt: next.updatedAt,
    });
    empty.snapshots.system = next.snapshots.system;
    empty.snapshots.search = { ...createSearchSnapshot(), ...(next.snapshots.search || {}) };
    return empty;
  }

  const unit = maps.units.get(next.focus.pointId);
  const contentChanged = next.focus.contentVersion !== unit.contentVersion;
  next.focus = focusForUnit(unit);
  const allowed = availableActivities(knowledgePackage, unit.id);
  if (!allowed.includes(next.activity)) next.activity = allowed.includes("reading") ? "reading" : "system";
  if (next.activity !== "relations") next.relationMode = null;
  else if (!new Set(["orientation", "exploration"]).has(next.relationMode)) next.relationMode = "orientation";

  if (next.anchor?.blockId && !unit.blocks.some((block) => block.id === next.anchor.blockId)) {
    next.anchor = null;
    next.anchorNotice = "block-missing";
  }
  if (next.snapshots.reading?.blockId && !unit.blocks.some((block) => block.id === next.snapshots.reading.blockId)) {
    next.snapshots.reading = { ...next.snapshots.reading, blockId: null };
    next.anchorNotice = "block-missing";
  }
  if (next.anchor?.relationId && !maps.relations.has(next.anchor.relationId)) next.anchor = null;
  if (next.anchor?.recallItemId && !maps.recalls.has(next.anchor.recallItemId)) next.anchor = null;
  if (contentChanged) {
    next.anchor = null;
    next.anchorNotice = null;
    next.explorationTrail = [];
    next.snapshots = { ...createKnowledgeContext(moduleId).snapshots, system: next.snapshots.system };
  }
  return next;
}

function selectPoint(knowledgePackage, context, pointId, event) {
  const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === pointId);
  if (!unit) return context;
  return {
    ...context,
    focus: focusForUnit(unit),
    activity: "reading",
    relationMode: null,
    origin: event.origin || context.origin,
    anchor: null,
    anchorNotice: null,
    explorationTrail: event.preserveTrail ? context.explorationTrail : [],
    returnTarget: Object.hasOwn(event, "returnTarget") ? event.returnTarget : null,
    updatedAt: event.at ?? context.updatedAt,
  };
}

function applyContextEvent(knowledgePackage, rawContext, event) {
  const context = normalizeKnowledgeContext(knowledgePackage, rawContext);
  const maps = packageMaps(knowledgePackage);
  switch (event.type) {
    case "OPEN_MODULE":
      return createKnowledgeContext(knowledgePackage.moduleProfile.id, {
        origin: event.origin || { type: "module", refId: knowledgePackage.moduleProfile.id },
        updatedAt: event.at ?? context.updatedAt,
      });
    case "SELECT_POINT":
      return selectPoint(knowledgePackage, context, event.pointId, event);
    case "SWITCH_ACTIVITY": {
      if (!context.focus || !ACTIVITIES.includes(event.activity)) return context;
      const allowed = availableActivities(knowledgePackage, context.focus.pointId);
      if (!allowed.includes(event.activity)) return context;
      const snapshots = clone(context.snapshots);
      if (event.snapshot) snapshots[context.activity] = clone(event.snapshot);
      return {
        ...context,
        activity: event.activity,
        relationMode: event.activity === "relations" ? event.relationMode || "exploration" : null,
        anchor: event.anchor || null,
        anchorNotice: null,
        snapshots,
        updatedAt: event.at ?? context.updatedAt,
      };
    }
    case "FOLLOW_RELATION": {
      if (!context.focus || !maps.relations.has(event.relationId)) return context;
      const relation = maps.relations.get(event.relationId);
      let targetPointId = null;
      if (relation.sourcePointId === context.focus.pointId) targetPointId = relation.targetPointId;
      else if (relation.targetPointId === context.focus.pointId) targetPointId = relation.sourcePointId;
      if (!targetPointId || !maps.units.has(targetPointId)) return context;
      const target = maps.units.get(targetPointId);
      const trailEntry = {
        fromPointId: context.focus.pointId,
        toPointId: targetPointId,
        viaRelationId: relation.id,
        relationType: relation.type,
        originActivity: context.activity,
        sourceSnapshot: clone(context.snapshots.relations),
        enteredAt: event.at ?? context.updatedAt,
      };
      return {
        ...context,
        focus: focusForUnit(target),
        activity: "relations",
        relationMode: "exploration",
        anchor: { relationId: relation.id },
        anchorNotice: null,
        explorationTrail: [...context.explorationTrail, trailEntry].slice(-MAX_TRAIL_LENGTH),
        updatedAt: event.at ?? context.updatedAt,
      };
    }
    case "BACK_TRAIL": {
      if (!context.explorationTrail.length) return context;
      const trail = context.explorationTrail.slice(0, -1);
      const previous = context.explorationTrail[context.explorationTrail.length - 1];
      const unit = maps.units.get(previous.fromPointId);
      if (!unit) return normalizeKnowledgeContext(knowledgePackage, { ...context, explorationTrail: trail });
      return {
        ...context,
        focus: focusForUnit(unit),
        activity: previous.originActivity,
        relationMode: previous.originActivity === "relations" ? "exploration" : null,
        anchor: { relationId: previous.viaRelationId },
        anchorNotice: null,
        explorationTrail: trail,
        snapshots: { ...context.snapshots, relations: previous.sourceSnapshot },
        updatedAt: event.at ?? context.updatedAt,
      };
    }
    case "BACK_TO_SYSTEM":
      return {
        ...context,
        activity: "system",
        relationMode: null,
        anchor: null,
        anchorNotice: null,
        updatedAt: event.at ?? context.updatedAt,
      };
    case "UPDATE_SYSTEM_SNAPSHOT":
      return {
        ...context,
        snapshots: {
          ...context.snapshots,
          system: { ...context.snapshots.system, ...(event.snapshot || {}) },
        },
        updatedAt: event.at ?? context.updatedAt,
      };
    case "UPDATE_RELATION_SNAPSHOT":
      return {
        ...context,
        snapshots: {
          ...context.snapshots,
          relations: { ...(context.snapshots.relations || {}), ...(event.snapshot || {}) },
        },
        updatedAt: event.at ?? context.updatedAt,
      };
    case "UPDATE_READING_SNAPSHOT":
      {
      const readingUnit = context.focus ? maps.units.get(context.focus.pointId) : null;
      const validBlockId = event.blockId && readingUnit?.blocks.some((block) => block.id === event.blockId)
        ? event.blockId
        : null;
      return {
        ...context,
        anchor: validBlockId ? { blockId: validBlockId } : context.anchor,
        snapshots: {
          ...context.snapshots,
          reading: { ...(context.snapshots.reading || {}), blockId: validBlockId },
        },
        updatedAt: event.at ?? context.updatedAt,
      };
      }
    case "UPDATE_RECALL_SNAPSHOT": {
      if (!context.focus) return context;
      const snapshot = event.snapshot || {};
      const recallItemId = snapshot.recallItemId && maps.recalls.has(snapshot.recallItemId) ? snapshot.recallItemId : null;
      return {
        ...context,
        snapshots: {
          ...context.snapshots,
          recall: {
            recallItemId,
            revealed: Boolean(snapshot.revealed),
            response: snapshot.response || null,
            remedyStep: snapshot.remedyStep || null,
          },
        },
        updatedAt: event.at ?? context.updatedAt,
      };
    }
    case "UPDATE_SEARCH_SNAPSHOT": {
      const snapshot = event.snapshot || {};
      const resultId = snapshot.resultId && maps.units.has(snapshot.resultId) ? snapshot.resultId : null;
      return {
        ...context,
        snapshots: {
          ...context.snapshots,
          search: {
            query: String(snapshot.query || ""),
            intent: String(snapshot.intent || "all"),
            resultId,
            resultIndex: Number.isInteger(snapshot.resultIndex) ? snapshot.resultIndex : null,
            scrollAnchorId: snapshot.scrollAnchorId || null,
            matchEvidence: snapshot.matchEvidence || null,
          },
        },
        updatedAt: event.at ?? context.updatedAt,
      };
    }
    case "OPEN_SOURCE_BLOCK": {
      if (!context.focus) return context;
      const unit = maps.units.get(context.focus.pointId);
      const valid = unit?.blocks.some((block) => block.id === event.blockId);
      return {
        ...context,
        activity: "reading",
        relationMode: null,
        anchor: valid ? { blockId: event.blockId } : null,
        anchorNotice: valid ? null : "block-missing",
        returnTarget: event.returnTarget || {
          activity: context.activity,
          relationMode: context.relationMode,
          anchor: context.anchor,
          source: event.source || context.activity,
        },
        updatedAt: event.at ?? context.updatedAt,
      };
    }
    case "OPEN_REMEDY": {
      if (!context.focus || !ACTIVITIES.includes(event.activity)) return context;
      const allowed = availableActivities(knowledgePackage, context.focus.pointId);
      if (!allowed.includes(event.activity)) return context;
      return {
        ...context,
        activity: event.activity,
        relationMode: event.activity === "relations" ? event.relationMode || "exploration" : null,
        returnTarget: event.returnTarget || {
          pointId: context.focus.pointId,
          activity: context.activity,
          relationMode: context.relationMode,
          anchor: context.anchor,
          source: event.source || context.activity,
        },
        updatedAt: event.at ?? context.updatedAt,
      };
    }
    case "RETURN_FROM_SOURCE": {
      if (!context.focus || !context.returnTarget) return context;
      const target = context.returnTarget;
      const targetUnit = target.pointId ? maps.units.get(target.pointId) : maps.units.get(context.focus.pointId);
      if (!targetUnit) return context;
      const allowed = availableActivities(knowledgePackage, targetUnit.id);
      const activity = allowed.includes(target.activity) ? target.activity : "reading";
      return {
        ...context,
        focus: focusForUnit(targetUnit),
        activity,
        relationMode: activity === "relations" ? target.relationMode || "exploration" : null,
        anchor: target.anchor || null,
        anchorNotice: null,
        explorationTrail: Number.isInteger(target.trailLength)
          ? context.explorationTrail.slice(0, target.trailLength)
          : context.explorationTrail,
        returnTarget: null,
        updatedAt: event.at ?? context.updatedAt,
      };
    }
    case "OPEN_DEEP_LINK": {
      const empty = createKnowledgeContext(knowledgePackage.moduleProfile.id, {
        origin: { type: "deep-link", refId: event.refId || null },
        updatedAt: event.at ?? context.updatedAt,
      });
      if (event.moduleId !== knowledgePackage.moduleProfile.id || !event.pointId) return empty;
      const focused = selectPoint(knowledgePackage, empty, event.pointId, event);
      if (!focused.focus) return empty;
      if (event.activity && availableActivities(knowledgePackage, event.pointId).includes(event.activity)) {
        focused.activity = event.activity;
        focused.relationMode = event.activity === "relations" ? "orientation" : null;
      }
      const unit = maps.units.get(event.pointId);
      if (event.blockId && unit.blocks.some((block) => block.id === event.blockId)) {
        focused.anchor = { blockId: event.blockId };
      } else if (event.blockId) {
        focused.anchorNotice = "block-missing";
      }
      return focused;
    }
    case "START_ROUTE": {
      if (!event.routeId || !event.routeType || !event.scopeId) return context;
      const focused = event.pointId ? selectPoint(knowledgePackage, context, event.pointId, event) : context;
      return {
        ...focused,
        goalContext: {
          routeId: event.routeId,
          type: event.routeType,
          scopeId: event.scopeId,
          stepId: event.stepId || null,
          label: event.label || "学习路线",
          positionText: event.positionText || "",
        },
        updatedAt: event.at ?? context.updatedAt,
      };
    }
    case "UPDATE_ROUTE_STEP":
      if (!context.goalContext || context.goalContext.routeId !== event.routeId) return context;
      return {
        ...context,
        goalContext: {
          ...context.goalContext,
          stepId: event.stepId || context.goalContext.stepId,
          positionText: event.positionText || context.goalContext.positionText,
        },
        updatedAt: event.at ?? context.updatedAt,
      };
    case "END_ROUTE":
      return { ...context, goalContext: null, updatedAt: event.at ?? context.updatedAt };
    case "CONTENT_UPDATED":
      return normalizeKnowledgeContext(knowledgePackage, context);
    case "CLEAR_CONTEXT":
      return createKnowledgeContext(knowledgePackage.moduleProfile.id, {
        origin: { type: "cleared", refId: knowledgePackage.moduleProfile.id },
        updatedAt: event.at ?? context.updatedAt,
      });
    default:
      return context;
  }
}

function toRecentModuleContext(knowledgePackage, rawContext) {
  const context = normalizeKnowledgeContext(knowledgePackage, rawContext);
  if (!context.focus) return null;
  return {
    moduleId: context.moduleId,
    pointId: context.focus.pointId,
    contentVersion: context.focus.contentVersion,
    lastActivity: context.activity,
    goalType: context.goalContext?.type || null,
    routeId: context.goalContext?.routeId || null,
    scopeId: context.goalContext?.scopeId || null,
    blockId: context.anchor?.blockId || context.snapshots.reading?.blockId || null,
    updatedAt: context.updatedAt,
    contextSnapshot: clone(context),
  };
}

function resolveRecentModuleContext(knowledgePackage, recent, options = {}) {
  const empty = createKnowledgeContext(knowledgePackage.moduleProfile.id, {
    origin: options.origin || { type: "recent", refId: recent?.pointId || null },
    updatedAt: recent?.updatedAt ?? options.updatedAt ?? 0,
  });
  if (!recent) return { status: "empty", reason: "no-history", context: empty };
  if (recent.moduleId !== knowledgePackage.moduleProfile.id) return { status: "invalid", reason: "module-mismatch", context: empty };
  if (!recent.pointId) return { status: "invalid", reason: "point-missing", context: empty };
  const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === recent.pointId);
  if (!unit) return { status: "invalid", reason: "point-missing", context: empty };
  if (unit.contentVersion !== recent.contentVersion) return { status: "invalid", reason: "content-version-changed", context: empty };
  if (recent.contextSnapshot) {
    const restored = normalizeKnowledgeContext(knowledgePackage, recent.contextSnapshot);
    if (restored.focus?.pointId === unit.id) {
      if (!restored.anchor && recent.blockId && unit.blocks.some((block) => block.id === recent.blockId)) {
        restored.anchor = { blockId: recent.blockId };
      }
      return { status: "valid", reason: null, context: restored };
    }
  }
  const focused = selectPoint(knowledgePackage, empty, unit.id, {
    origin: empty.origin,
    at: recent.updatedAt,
  });
  const activity = availableActivities(knowledgePackage, unit.id).includes(recent.lastActivity)
    ? recent.lastActivity
    : focused.activity;
  return { status: "valid", reason: null, context: {
    ...focused,
    activity,
    relationMode: activity === "relations" ? "orientation" : null,
    anchor: recent.blockId && unit.blocks.some((block) => block.id === recent.blockId)
      ? { blockId: recent.blockId }
      : null,
    anchorNotice: recent.blockId && !unit.blocks.some((block) => block.id === recent.blockId)
      ? "block-missing"
      : null,
  } };
}

function fromRecentModuleContext(knowledgePackage, recent, options = {}) {
  return resolveRecentModuleContext(knowledgePackage, recent, options).context;
}

module.exports = {
  CONTEXT_SCHEMA_VERSION,
  ACTIVITIES,
  MAX_TRAIL_LENGTH,
  storageKey,
  createKnowledgeContext,
  normalizeKnowledgeContext,
  availableActivities,
  applyContextEvent,
  toRecentModuleContext,
  resolveRecentModuleContext,
  fromRecentModuleContext,
};
