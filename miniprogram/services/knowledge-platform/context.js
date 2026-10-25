const CONTEXT_SCHEMA_VERSION = 1;
const ACTIVITIES = Object.freeze(["system", "relations", "reading", "recall"]);
const MAX_TRAIL_LENGTH = 20;

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
    },
    returnTarget: null,
    updatedAt: options.updatedAt ?? 0,
  };
}

function packageMaps(knowledgePackage) {
  return {
    units: new Map(knowledgePackage.knowledgeUnits.map((unit) => [unit.id, unit])),
    relations: new Map(knowledgePackage.relations.map((relation) => [relation.id, relation])),
    blocks: new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => block.id))),
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
    return empty;
  }

  const unit = maps.units.get(next.focus.pointId);
  const contentChanged = next.focus.contentVersion !== unit.contentVersion;
  next.focus = focusForUnit(unit);
  const allowed = availableActivities(knowledgePackage, unit.id);
  if (!allowed.includes(next.activity)) next.activity = allowed.includes("reading") ? "reading" : "system";
  if (next.activity !== "relations") next.relationMode = null;
  else if (!new Set(["orientation", "exploration"]).has(next.relationMode)) next.relationMode = "orientation";

  if (next.anchor?.blockId && !maps.blocks.has(next.anchor.blockId)) next.anchor = null;
  if (next.anchor?.relationId && !maps.relations.has(next.anchor.relationId)) next.anchor = null;
  if (next.anchor?.recallItemId && !maps.recalls.has(next.anchor.recallItemId)) next.anchor = null;
  if (contentChanged) {
    next.anchor = null;
    next.explorationTrail = [];
    next.snapshots = { ...createKnowledgeContext(moduleId).snapshots, system: next.snapshots.system };
  }
  return next;
}

function selectPoint(knowledgePackage, context, pointId, event) {
  const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === pointId);
  if (!unit) return context;
  const hasRelations = relationIdsForPoint(knowledgePackage, pointId).length > 0;
  return {
    ...context,
    focus: focusForUnit(unit),
    activity: hasRelations ? "relations" : "reading",
    relationMode: hasRelations ? "orientation" : null,
    origin: event.origin || context.origin,
    anchor: null,
    returnTarget: event.returnTarget || context.returnTarget,
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
        updatedAt: event.at ?? context.updatedAt,
      };
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
      }
      return focused;
    }
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
    blockId: context.anchor?.blockId || null,
    updatedAt: context.updatedAt,
  };
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
};
