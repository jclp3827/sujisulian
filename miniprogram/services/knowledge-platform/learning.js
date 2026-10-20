const ROUTE_TYPES = Object.freeze(["quick", "systematic", "confusion", "exam"]);
const { projectTextRuns } = require("./reading-text");
const QUICK_STEP_TASKS = Object.freeze([
  "建立整体认识", "认识两条主线", "理解思想体系", "联系现实任务",
  "学会分析矛盾", "理解实践与认识", "看例子串联", "回看整体",
]);
const ROUTE_META = Object.freeze({
  quick: { label: "快速了解", mark: "览", outcome: "看见全貌，初识关键知识", kicker: "先看全貌，再识重点", description: "看见主要板块，轻量认识关键知识，用一个短例子看两条主线怎样相连", startAction: "开始快速导读", adjustAction: "查看知识全景" },
  systematic: { label: "系统学习", mark: "序", outcome: "连续理解一个正式范围", kicker: "连续学习", description: "每张知识卡先看位置与前置，再完整阅读并主动回忆", startAction: "开始第一个知识", adjustAction: "调整学习范围" },
  confusion: { label: "易混突破", mark: "辨", outcome: "先判断，再核对边界", kicker: "成对辨析", description: "围绕系统推荐的一组易混知识，完成判断、边界、依据和再辨", startAction: "开始这组辨析", adjustAction: "换一组" },
  exam: { label: "考前速记", mark: "忆", outcome: "立即进入冻结回忆卡组", kicker: "主动回忆", description: "按固定顺序逐张提示、揭晓和自评，没记住时及时回看", startAction: "开始第一张", adjustAction: "调整范围" },
});
const SEARCH_INTENTS = Object.freeze([
  { id: "all", label: "全部" },
  { id: "definition", label: "是什么" },
  { id: "relation", label: "为什么/关系" },
  { id: "contrast", label: "区别/易混" },
  { id: "boundary", label: "条件/例外" },
  { id: "location", label: "体系位置" },
  { id: "recall", label: "怎么回忆" },
]);

function stableHash(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle(items, seed) {
  const result = [...items];
  let state = stableHash(seed || "knowledge-route");
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function packageMaps(knowledgePackage) {
  return {
    navigation: new Map(knowledgePackage.navigationNodes.map((item) => [item.id, item])),
    units: new Map(knowledgePackage.knowledgeUnits.map((item) => [item.id, item])),
    relations: new Map(knowledgePackage.relations.map((item) => [item.id, item])),
    recalls: new Map(knowledgePackage.recallItems.map((item) => [item.id, item])),
  };
}

function unitsInScope(knowledgePackage, scopeId) {
  const maps = packageMaps(knowledgePackage);
  if (!maps.navigation.has(scopeId)) return [];
  return knowledgePackage.knowledgeUnits
    .filter((unit) => unit.navigationPathIds.includes(scopeId))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

function nextSystematicScope(knowledgePackage, scopeId) {
  const nodes = new Map(knowledgePackage.navigationNodes.map((node) => [node.id, node]));
  const available = new Map(projectRouteScopeOptions(knowledgePackage, "systematic")
    .filter((item) => item.enabled)
    .map((item) => [item.id, item]));
  let current = nodes.get(scopeId);
  while (current?.parentId) {
    const parent = nodes.get(current.parentId);
    if (!parent) break;
    const siblings = parent.childIds || [];
    const position = siblings.indexOf(current.id);
    for (const siblingId of position >= 0 ? siblings.slice(position + 1) : []) {
      const next = available.get(siblingId);
      if (next) return { id: next.id, title: next.title, knowledgeCount: next.pointCount, reason: "按正式目录顺序继续" };
    }
    current = parent;
  }
  return null;
}

function contrastRelationsInScope(knowledgePackage, unitIds) {
  const ids = new Set(unitIds);
  return knowledgePackage.relations
    .filter((relation) => relation.type === "contrast" && ids.has(relation.sourcePointId) && ids.has(relation.targetPointId))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function projectRouteScopeOptions(knowledgePackage, routeType, recentPointId = null) {
  if (!ROUTE_TYPES.includes(routeType)) return [];
  const recentUnit = knowledgePackage.knowledgeUnits.find((unit) => unit.id === recentPointId);
  const systematicTypes = knowledgePackage.moduleProfile.routeDefaults?.systematic?.allowedScopeTypes || ["article", "chapter", "section"];
  const allowedTypes = routeType === "quick"
    ? ["article"]
    : ["systematic", "exam"].includes(routeType)
      ? systematicTypes
      : null;
  const candidateIds = new Set(
    knowledgePackage.navigationNodes
      .filter((node) => node.pointCount > 0 && (!allowedTypes || allowedTypes.includes(node.type)) && (["systematic", "exam"].includes(routeType) || !node.pointId || node.id === recentUnit?.navigationNodeId))
      .map((node) => node.id),
  );
  if (recentUnit) {
    const recentNode = knowledgePackage.navigationNodes.find((node) => node.id === recentUnit.navigationNodeId);
    if (!allowedTypes || allowedTypes.includes(recentNode?.type)) candidateIds.add(recentUnit.navigationNodeId);
  }
  return knowledgePackage.navigationNodes
    .filter((node) => candidateIds.has(node.id))
    .map((node) => {
      const units = unitsInScope(knowledgePackage, node.id);
      const recallCount = units.reduce((total, unit) => total + unit.recallItemIds.length, 0);
      const contrastCount = contrastRelationsInScope(knowledgePackage, units.map((unit) => unit.id)).length;
      const systematicStepCount = units.reduce((total, unit) => total + 2 + (unit.recallItemIds.length ? 1 : 0), 0);
      const enabled = routeType === "confusion" ? contrastCount > 0 : routeType === "exam" ? recallCount > 0 : units.length > 0;
      return {
        id: node.id,
        parentId: node.parentId,
        nodeType: node.type,
        pathIds: [...node.pathIds],
        title: node.title,
        pathText: node.pathTitles.join(" › "),
        order: node.order,
        depth: node.pathIds.length - 1,
        pointCount: units.length,
        recallCount,
        contrastCount,
        systematicStepCount,
        firstKnowledgeTitle: units[0]?.title || "",
        lastKnowledgeTitle: units[units.length - 1]?.title || "",
        enabled,
        recent: node.id === recentUnit?.navigationNodeId,
      };
    })
    .sort((a, b) => a.depth - b.depth || (a.recent === b.recent ? 0 : a.recent ? -1 : 1) || a.order - b.order || a.id.localeCompare(b.id));
}

function projectRouteScopePicker(knowledgePackage, routeType, options = {}) {
  const scopes = projectRouteScopeOptions(knowledgePackage, routeType)
    .filter((item) => item.enabled && (knowledgePackage.moduleProfile.id !== "politics" || ["article", "chapter"].includes(item.nodeType)));
  const ids = new Set(scopes.map((item) => item.id));
  const expanded = new Set(options.expandedScopeIds || []);
  const rows = [];
  const append = (scope, depth) => {
    const children = scopes.filter((item) => item.parentId === scope.id).sort((a, b) => a.order - b.order);
    const isExpanded = children.length > 0 && expanded.has(scope.id);
    rows.push({ ...scope, indent: `${depth * 24}rpx`, selected: scope.id === options.selectedScopeId, hasChildren: children.length > 0, expanded: isExpanded });
    if (isExpanded) children.forEach((child) => append(child, depth + 1));
  };
  scopes.filter((scope) => !ids.has(scope.parentId)).sort((a, b) => a.order - b.order).forEach((scope) => append(scope, 0));
  return rows;
}

function projectContrastRouteOptions(knowledgePackage) {
  const maps = packageMaps(knowledgePackage);
  const scopeId = knowledgePackage.indexes.rootNavigationIds[0];
  return knowledgePackage.relations
    .filter((relation) => relation.type === "contrast" && contrastPairForRelation(knowledgePackage, relation))
    .map((relation) => {
      const source = maps.units.get(relation.sourcePointId);
      const target = maps.units.get(relation.targetPointId);
      return {
        id: relation.id,
        relationId: relation.id,
        scopeId,
        sourceTitle: source?.title || "",
        targetTitle: target?.title || "",
        sourceSummary: source?.summary || "",
        targetSummary: target?.summary || "",
        pathText: source?.navigationPathIds.map((id) => maps.navigation.get(id)?.title).filter(Boolean).join(" › ") || "",
        reason: relation.reason,
      };
    });
}

function topologicalUnits(knowledgePackage, units) {
  const ids = new Set(units.map((unit) => unit.id));
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  const indegree = new Map(units.map((unit) => [unit.id, 0]));
  const outgoing = new Map(units.map((unit) => [unit.id, []]));
  const outsidePrerequisites = [];
  for (const relation of knowledgePackage.relations.filter((item) => item.type === "prerequisite")) {
    if (!ids.has(relation.sourcePointId)) continue;
    if (!ids.has(relation.targetPointId)) {
      outsidePrerequisites.push({ pointId: relation.sourcePointId, prerequisitePointId: relation.targetPointId, relationId: relation.id });
      continue;
    }
    outgoing.get(relation.targetPointId).push(relation.sourcePointId);
    indegree.set(relation.sourcePointId, indegree.get(relation.sourcePointId) + 1);
  }
  const ready = units.filter((unit) => indegree.get(unit.id) === 0);
  const result = [];
  const sortReady = () => ready.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  sortReady();
  while (ready.length) {
    const unit = ready.shift();
    result.push(unit);
    for (const targetId of outgoing.get(unit.id)) {
      indegree.set(targetId, indegree.get(targetId) - 1);
      if (indegree.get(targetId) === 0) {
        ready.push(byId.get(targetId));
        sortReady();
      }
    }
  }
  if (result.length !== units.length) throw new Error("prerequisite cycle in selected scope");
  return { units: result, outsidePrerequisites };
}

function routeIdFor(knowledgePackage, options, frozenIds) {
  const anchorIds = Array.isArray(options.anchorNodeIds) ? options.anchorNodeIds : [];
  return `route:${knowledgePackage.moduleProfile.id}:${options.type}:${options.scopeId}:${stableHash(`${knowledgePackage.packageVersion}|${options.seed || "ordered"}|${anchorIds.join("|")}|${frozenIds.join("|")}`)}`;
}

function contrastPairForRelation(knowledgePackage, relation) {
  if (!relation) return null;
  const units = new Map(knowledgePackage.knowledgeUnits.map((item) => [item.id, item]));
  const atoms = new Map(knowledgePackage.knowledgeAtomRefs.map((item) => [item.id, item]));
  const recalls = new Set(knowledgePackage.recallItems.map((item) => item.id));
  const references = new Set(knowledgePackage.sourceReferences.map((item) => item.id));
  return knowledgePackage.contrastPairs.find((pair) => {
    if (!((pair.leftPointId === relation.sourcePointId && pair.rightPointId === relation.targetPointId)
      || (pair.leftPointId === relation.targetPointId && pair.rightPointId === relation.sourcePointId))) return false;
    if (!pair.dimensions?.length || !pair.boundaries?.length || pair.recallItemIds?.length < 2) return false;
    const left = units.get(pair.leftPointId);
    const right = units.get(pair.rightPointId);
    if (!left || !right || !pair.leftAtomRefIds?.length || !pair.rightAtomRefIds?.length) return false;
    const blockIds = new Set([...left.blocks, ...right.blocks].map((item) => item.id));
    const sideValid = (ids, pointId) => ids.every((id) => {
      const atom = atoms.get(id);
      return atom?.pointId === pointId && atom.sourceBlockIds?.length && atom.sourceBlockIds.every((blockId) => blockIds.has(blockId) && pair.sourceBlockIds?.includes(blockId));
    });
    return sideValid(pair.leftAtomRefIds, pair.leftPointId)
      && sideValid(pair.rightAtomRefIds, pair.rightPointId)
      && pair.sourceRefIds?.length >= 2
      && pair.sourceRefIds.every((id) => references.has(id))
      && pair.recallItemIds.every((id) => recalls.has(id));
  }) || null;
}

function routeCompletionProjection(type) {
  return {
    quick: { title: "全景导览已收束", primaryAction: { id: "return-overview", label: "回到全景继续探索" } },
    systematic: { title: "本范围学习告一段落", primaryAction: { id: "return-scope", label: "回到本范围知识全景" } },
    confusion: { title: "本组判断边界已核对", primaryAction: { id: "next-contrast", label: "继续下一组推荐" } },
    exam: { title: "本轮速记已结束", primaryAction: { id: "return-deck-scope", label: "返回本次范围" } },
  }[type];
}

function resolveQuickPrimer(knowledgePackage, primerId) {
  const primer = (knowledgePackage.quickPrimers || []).find((item) => item.id === primerId);
  const eligibleStatuses = knowledgePackage.buildTarget === "release"
    ? ["approved", "published"]
    : ["review", "approved", "published"];
  if (!primer || !eligibleStatuses.includes(primer.status) || primer.sourcePackageVersion !== knowledgePackage.packageVersion) return null;
  if (!knowledgePackage.contentCoverage || knowledgePackage.contentCoverage.packageVersion !== knowledgePackage.packageVersion) return null;
  const nodes = new Set(knowledgePackage.navigationNodes.map((item) => item.id));
  const units = new Set(knowledgePackage.knowledgeUnits.map((item) => item.id));
  const blocks = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => block.id)));
  const atoms = new Set((knowledgePackage.knowledgeAtomRefs || []).map((item) => item.id));
  const expectedCount = primer.schemaVersion === 4 ? 6 : 8;
  if (primer.sections?.length !== expectedCount) return null;
  for (const section of primer.sections) {
    if (!section.narrativeSegments?.length || !(section.structureFocusNodeIds || []).every((id) => nodes.has(id))) return null;
    if (primer.schemaVersion === 4 && section.narrativeSegments.filter((segment) => segment.role === "takeaway").length !== 1) return null;
    if (!(section.detailTargets || []).every((id) => units.has(id))) return null;
    for (const segment of section.narrativeSegments) {
      if (!(segment.sourceBlockIds || []).every((id) => blocks.has(id))) return null;
      if (!(segment.sourceAtomRefIds || []).every((id) => atoms.has(id))) return null;
    }
  }
  return primer;
}

function projectQuickPrimerViewModel(knowledgePackage, plan, rawSession) {
  if (!plan?.primerId) return null;
  const primer = resolveQuickPrimer(knowledgePackage, plan.primerId);
  if (!primer) return null;
  const session = normalizeRouteSession(plan, rawSession);
  const nodes = new Map(knowledgePackage.navigationNodes.map((item) => [item.id, item]));
  const units = new Map(knowledgePackage.knowledgeUnits.map((item) => [item.id, item]));
  const reflection = session.quickReflection || { text: "", status: "pending", referenceVisible: false };
  const currentReading = primer.sections[session.currentIndex]?.reading;
  const overview = primer.schemaVersion === 4;
  const runs = (segment) => projectTextRuns({ text: segment.text }, segment.text, { emphasis: segment.emphasis || [] }, "text");
  return {
    id: primer.id,
    overview,
    targetMinutes: { ...primer.targetMinutes },
    scopeBoundary: primer.scopeBoundary,
    scopeSummary: primer.scopeSummary || (knowledgePackage.moduleProfile.id === "politics" ? "两篇理论导读，非完整考试范围。" : primer.scopeBoundary),
    scopeDetails: knowledgePackage.moduleProfile.id === "politics" ? "科学社会主义未单列，不含时政与党史。" : "",
    currentSectionId: plan.steps[session.currentIndex]?.sectionId || primer.sections[0].id,
    currentTask: overview ? primer.sections[session.currentIndex]?.shortTitle : currentReading?.phase || QUICK_STEP_TASKS[session.currentIndex],
    nextLabel: primer.sections[session.currentIndex]?.nextLabel || currentReading?.nextLabel || "下一步",
    position: session.currentIndex + 1,
    total: primer.sections.length,
    hasPrevious: session.currentIndex > 0,
    hasNext: session.currentIndex < plan.steps.length - 1,
    progressSteps: plan.steps.map((step, index) => ({
      id: step.sectionId,
      state: index === session.currentIndex ? "current" : session.completedStepIds.includes(step.stepId) ? "completed" : "upcoming",
    })),
    structure: {
      nodes: primer.structure.macroNodeIds.map((id) => ({ id, title: nodes.get(id)?.title || "" })),
      propositions: primer.structure.propositions.map((item) => ({ id: item.id, fromNodeId: item.fromNodeId, toNodeId: item.toNodeId, label: item.label })),
    },
    sections: primer.sections.map((section) => ({
      id: section.id,
      order: section.order,
      kind: section.kind,
      title: section.reading?.title || (section.kind === "reflection" ? "回看整体" : section.title),
      guidingQuestion: section.guidingQuestion,
      reading: overview ? {
        takeawayRuns: runs(section.narrativeSegments.find((segment) => segment.role === "takeaway")),
        beats: section.narrativeSegments.filter((segment) => segment.role === "beat").map((segment, index) => ({ id: `${section.id}:beat:${index + 1}`, label: segment.label, runs: runs(segment) })),
        notes: section.narrativeSegments.filter((segment) => segment.role === "note").map((segment, index) => ({ id: `${section.id}:note:${index + 1}`, label: segment.label, runs: runs(segment) })),
      } : section.reading ? {
        takeaway: section.reading.takeaway.quote,
        beats: section.reading.beats.map((beat, index) => ({ id: `${section.id}:beat:${index + 1}`, label: beat.label, text: beat.quote })),
        note: section.reading.note?.quote || "",
      } : null,
      narrativeSegments: (overview || section.kind === "reflection" ? [] : section.narrativeSegments).map((segment, index) => ({ id: `${section.id}:segment:${index + 1}`, type: segment.type, text: segment.text })),
      structureFocus: section.structureFocusNodeIds.map((id) => ({ id, title: nodes.get(id)?.title || "" })),
      detail: (section.detailTargets || []).slice(0, 1).map((pointId) => ({ pointId, title: units.get(pointId)?.title || "查看完整知识" }))[0] || null,
      state: session.visitedSectionIds.includes(section.id) ? "visited" : "unvisited",
    })),
    reflection: {
      question: primer.reflection.question,
      placeholder: primer.reflection.placeholder,
      minLength: primer.reflection.minLength,
      maxLength: primer.reflection.maxLength,
      text: reflection.text,
      status: reflection.status,
      referenceVisible: session.quickReferenceOpened,
      referenceExpression: session.quickReferenceOpened ? primer.reflection.referenceExpression : null,
      referenceSegments: session.quickReferenceOpened ? primer.sections.filter((section) => section.kind === "reflection").flatMap((section) => section.narrativeSegments.filter((segment) => segment.type !== "label").map((segment, index) => ({ id: `${section.id}:reference:${index + 1}`, type: segment.type, text: segment.text }))) : [],
      canSubmit: String(reflection.text || "").trim().length >= primer.reflection.minLength,
    },
    completion: { ...primer.completionCopy },
    coverage: knowledgePackage.contentCoverage ? JSON.parse(JSON.stringify(knowledgePackage.contentCoverage)) : null,
  };
}

function planLearningRoute(knowledgePackage, options) {
  const type = options?.type;
  const scopeId = options?.scopeId;
  if (!ROUTE_TYPES.includes(type) || !scopeId) return null;
  const maps = packageMaps(knowledgePackage);
  const scope = maps.navigation.get(scopeId);
  const units = unitsInScope(knowledgePackage, scopeId);
  if (!scope || !units.length) return null;
  const steps = [];
  const basis = [{ kind: "scope", id: scope.id, reason: options.recommendationReason || "本次学习范围" }];
  let outsidePrerequisites = [];
  let seed = null;
  let capabilityLevel = "standard";
  let primerId = null;
  let sourcePackageVersion = null;
  const stageGroups = [];
  let startProjection = null;

  if (type === "quick") {
    const primer = options.quickPrimerId ? resolveQuickPrimer(knowledgePackage, options.quickPrimerId) : null;
    if (options.quickPrimerId && !primer) return null;
    if (primer) {
      primerId = primer.id;
      sourcePackageVersion = primer.sourcePackageVersion;
      for (const section of primer.sections) {
        steps.push({
          stepId: `quick-primer:${primer.id}:${section.id}`,
          sectionId: section.id,
          title: section.shortTitle || section.title,
          stage: section.kind,
          subject: "quick-primer",
          activity: "reading",
          pointId: null,
          navigationNodeId: section.structureFocusNodeIds[0] || primer.scopeNodeId,
          detailTargets: [...(section.detailTargets || [])],
          required: true,
          eventType: "VIEW_QUICK_SECTION",
          reason: section.guidingQuestion,
        });
      }
      stageGroups.push({ id: "quick-primer", stages: steps.map((step) => step.stepId) });
      basis.push({ kind: "ordering", id: primer.id, reason: "先看全貌、轻读主要板块，再用一个例子看见联系" });
      startProjection = { primerId: primer.id, sectionCount: primer.sections.length, targetMinutes: { ...primer.targetMinutes } };
    } else {
    const childNodes = scope.childIds.map((id) => maps.navigation.get(id)).filter((node) => node && !node.pointId);
    const requestedAnchorNodeIds = [...new Set(Array.isArray(options.anchorNodeIds) ? options.anchorNodeIds : [])];
    const resolvedAnchors = requestedAnchorNodeIds.map((nodeId) => {
      const node = maps.navigation.get(nodeId);
      const unit = node?.pointId ? maps.units.get(node.pointId) : null;
      return node && unit ? { nodeId, pointId: unit.id, title: unit.title, summary: unit.summary } : null;
    });
    const anchorsValid = requestedAnchorNodeIds.length > 0 && resolvedAnchors.every(Boolean);
    const anchors = anchorsValid ? resolvedAnchors : [];
    const anchorsFor = (branchId) => anchors.filter((anchor) => maps.navigation.get(anchor.nodeId)?.pathIds.includes(branchId));
    capabilityLevel = anchorsValid ? "standard" : "structure-only";
    steps.push({ stepId: `quick:${scope.id}:overview`, stage: "overview", subject: "knowledge-space", activity: "system", pointId: null, navigationNodeId: scope.id, anchors: [], anchorNodeIds: [], required: true, eventType: "COMPLETE_TOUR_STOP", reason: "先看两条主干在完整全景中的位置" });
    for (const node of childNodes) {
      const branchAnchors = anchorsFor(node.id);
      steps.push({ stepId: `quick:${node.id}:branch`, stage: "branch", subject: "knowledge-space", activity: "system", pointId: null, navigationNodeId: node.id, anchors: branchAnchors, anchorNodeIds: branchAnchors.map((anchor) => anchor.nodeId), required: true, eventType: "COMPLETE_TOUR_STOP", reason: `看清${node.title}的结构和代表锚点` });
    }
    steps.push({ stepId: `quick:${scope.id}:closure`, stage: "closure", subject: "knowledge-space", activity: "system", pointId: null, navigationNodeId: scope.id, anchors: [], anchorNodeIds: [], required: true, eventType: "COMPLETE_TOUR_STOP", reason: "回到完整全景，把两条主干重新合在一起" });
    stageGroups.push({ id: "tour", stages: steps.map((step) => step.stepId) });
    basis.push({ kind: "ordering", id: "formal-navigation", reason: anchorsValid ? "按正式主分支和profile策展锚点导览" : "策展锚点不可用，本次只浏览两篇正式结构" });
    startProjection = {
      branchCount: childNodes.length,
      anchorCount: anchors.length,
      branchTitles: childNodes.map((node) => node.title),
      quickStops: steps.map((step) => ({
        id: step.stepId,
        stage: step.stage,
        navigationNodeId: step.navigationNodeId,
        title: step.stage === "overview" ? "整体定位" : step.stage === "closure" ? "重新合拢" : maps.navigation.get(step.navigationNodeId)?.title || "知识分支",
        anchorNodeIds: [...step.anchorNodeIds],
        anchors: step.anchors.map((anchor) => ({ ...anchor })),
      })),
    };
    }
  } else if (type === "systematic") {
    const ordered = topologicalUnits(knowledgePackage, units);
    outsidePrerequisites = ordered.outsidePrerequisites;
    const orderItems = ordered.units.map((unit, index) => {
      const chapter = [...unit.navigationPathIds]
        .map((id) => maps.navigation.get(id))
        .reverse()
        .find((node) => node?.type === "chapter");
      return { id: unit.id, order: index + 1, title: unit.title, chapterId: chapter?.id || "", chapterTitle: chapter?.title || "" };
    });
    const orderGroups = [];
    for (const item of orderItems) {
      const previous = orderGroups[orderGroups.length - 1];
      if (previous && previous.chapterId === item.chapterId) previous.items.push(item);
      else orderGroups.push({ id: `${item.chapterId || "scope"}:${orderGroups.length}`, chapterTitle: item.chapterTitle, items: [item] });
    }
    for (const [index, unit] of ordered.units.entries()) {
      const group = [];
      const reading = {
        stepId: `systematic:${unit.id}:reading`,
        stage: "reading",
        subject: "knowledge-card",
        activity: "reading",
        pointId: unit.id,
        relationContextIds: [...unit.relationIds].slice(0, 3),
        outsidePrerequisiteIds: outsidePrerequisites.filter((item) => item.pointId === unit.id).map((item) => item.prerequisitePointId),
        required: true,
        eventType: "COMPLETE_READING_STEP",
        reason: index === 0 ? "从本范围的基础知识开始完整理解" : "按前置关系和正式顺序继续完整理解",
      };
      steps.push(reading);
      group.push(reading.stepId);
      if (unit.recallItemIds.length) {
        const recall = { stepId: `systematic:${unit.id}:recall`, stage: "recall", subject: "knowledge-card", activity: "recall", pointId: unit.id, recallItemId: unit.recallItemIds[0], required: true, eventType: "RECALL_RESULT", reason: "合上同一张卡，检验这次能否想起" };
        steps.push(recall);
        group.push(recall.stepId);
      }
      stageGroups.push({ id: `unit:${unit.id}`, pointId: unit.id, stages: group });
    }
    basis.push({ kind: "ordering", id: "prerequisite-then-navigation", reason: "按学习先后安排，同层保持知识顺序" });
    startProjection = {
      knowledgeCount: ordered.units.length,
      recallCount: ordered.units.filter((unit) => unit.recallItemIds.length).length,
      firstKnowledgeTitle: ordered.units[0]?.title || "",
      lastKnowledgeTitle: ordered.units[ordered.units.length - 1]?.title || "",
      knowledgeTitles: ordered.units.map((unit) => unit.title),
      orderItems,
      orderPreview: orderItems.length > 4 ? [...orderItems.slice(0, 3), orderItems[orderItems.length - 1]] : orderItems,
      orderGroups,
      outsidePrerequisites: outsidePrerequisites.map((item) => ({
        pointId: item.pointId,
        pointTitle: maps.units.get(item.pointId)?.title || "当前知识",
        prerequisitePointId: item.prerequisitePointId,
        prerequisiteTitle: maps.units.get(item.prerequisitePointId)?.title || "范围外知识",
        relationId: item.relationId,
        reason: maps.relations.get(item.relationId)?.reason || "正式前置关系",
      })),
    };
  } else if (type === "confusion") {
    const contrasts = contrastRelationsInScope(knowledgePackage, units.map((unit) => unit.id))
      .filter((relation) => (!options.relationId || relation.id === options.relationId) && contrastPairForRelation(knowledgePackage, relation));
    if (!contrasts.length) return null;
    const relation = contrasts[0];
    const pair = contrastPairForRelation(knowledgePackage, relation);
    capabilityLevel = pair?.dimensions.length && pair?.boundaries.length && pair?.recallItemIds.length >= 2
      ? "contrastRecallReady"
      : "contrastBasic";
    const shared = { subject: "contrast-pair", activity: "relations", pointId: relation.sourcePointId, relationId: relation.id, targetPointId: relation.targetPointId, contrastPairId: pair?.id || null, capabilityLevel, required: true };
    steps.push(
      { ...shared, stepId: `confusion:${relation.id}:judgment`, stage: "judgment", eventType: "REVEAL_CONTRAST_KEY", reason: "先独立判断二者的对象或适用边界" },
      { ...shared, stepId: `confusion:${relation.id}:boundary`, stage: "boundary", eventType: "CONFIRM_CONTRAST_BOUNDARY", reason: "核对正式确认的判断维度和边界" },
      { ...shared, stepId: `confusion:${relation.id}:evidence`, stage: "evidence", eventType: "VIEW_CONTRAST_EVIDENCE", reason: "分别回看两侧有来源的判断依据" },
    );
    if (capabilityLevel === "contrastRecallReady") steps.push({ ...shared, stepId: `confusion:${relation.id}:retest`, stage: "retest", eventType: "CONTRAST_RESPONSE", reason: "围绕同一正式对照维度再辨一次，记录本次自我判断" });
    stageGroups.push({ id: `contrast:${relation.id}`, relationId: relation.id, stages: steps.map((step) => step.stepId) });
    basis.push({ kind: "relation", id: "contrast-only", reason: "只使用正式确认的易混关系" });
    const source = maps.units.get(relation.sourcePointId);
    const target = maps.units.get(relation.targetPointId);
    startProjection = {
      sourceTitle: source?.title || "",
      targetTitle: target?.title || "",
      contrastPair: { id: pair.id },
      sourcePathText: source?.navigationPathIds.map((id) => maps.navigation.get(id)?.title).filter(Boolean).join(" › ") || "",
      targetPathText: target?.navigationPathIds.map((id) => maps.navigation.get(id)?.title).filter(Boolean).join(" › ") || "",
      stageLabels: capabilityLevel === "contrastRecallReady"
        ? ["先判断", "核对边界", "回看依据", "再辨一次"]
        : ["先判断", "核对边界", "回看依据"],
    };
  } else {
    const recallIds = units.flatMap((unit) => unit.recallItemIds);
    if (!recallIds.length) return null;
    seed = options.random ? String(options.seed || `${scopeId}:exam`) : null;
    const frozen = seed ? seededShuffle(recallIds, seed) : recallIds;
    for (const recallItemId of frozen) {
      const recall = maps.recalls.get(recallItemId);
      steps.push({ stepId: `exam:${recallItemId}`, stage: "prompt", subject: "recall-card", activity: "recall", pointId: recall.pointId, recallItemId, required: true, eventType: "RECALL_RESULT", reason: "先在心中作答，再揭晓正式答案" });
    }
    stageGroups.push({ id: "deck", stages: steps.map((step) => step.stepId) });
    basis.push({ kind: "ordering", id: seed ? "seeded-random" : "formal-navigation", reason: seed ? "已按你的选择固定本次随机顺序" : "按知识顺序安排" });
    startProjection = {
      cardCount: frozen.length,
      orderLabel: seed ? "本次固定随机顺序" : "正式知识顺序",
    };
  }

  const frozenOrder = steps.map((step) => step.stepId);
  const recommendationQueue = Array.isArray(options.recommendationQueue) ? [...options.recommendationQueue] : [];
  let completionProjection = routeCompletionProjection(type);
  if (type === "quick" && capabilityLevel === "structure-only") {
    completionProjection = { title: "两篇结构浏览已收束", primaryAction: { id: "return-overview", label: "回到全景继续探索" } };
  }
  if (type === "confusion") {
    const available = projectContrastRouteOptions(knowledgePackage);
    const availableIds = new Set(available.map((item) => item.relationId));
    const order = [...new Set([...recommendationQueue, ...(knowledgePackage.moduleProfile.routeDefaults.confusion.priorityRelationIds || []), ...availableIds])]
      .filter((id) => availableIds.has(id));
    const currentId = steps[0].relationId;
    const index = order.indexOf(currentId);
    const nextId = [...order.slice(index + 1), ...order.slice(0, index)].find((id) => id !== currentId);
    completionProjection = {
      title: "本组判断边界已核对",
      primaryAction: nextId
        ? { id: "next-contrast", label: "开启新一组", relationId: nextId, scopeId: available.find((item) => item.relationId === nextId).scopeId }
        : { id: "return-home", label: "返回主页" },
    };
  }
  return {
    id: routeIdFor(knowledgePackage, { type, scopeId, seed, anchorNodeIds: options.anchorNodeIds }, frozenOrder),
    definitionId: `route-definition:${type}`,
    moduleId: knowledgePackage.moduleProfile.id,
    type,
    label: knowledgePackage.moduleProfile.labels[type] || ROUTE_META[type].label,
    scopeId,
    scopeTitle: scope.title,
    scopePathText: scope.pathTitles.join(" › "),
    packageVersion: knowledgePackage.packageVersion,
    seed,
    basis,
    recommendationReason: options.recommendationReason || basis[0].reason,
    capabilityLevel,
    recommendationQueue,
    originPointId: options.originPointId || null,
    startProjection,
    stageGroups,
    steps,
    outsidePrerequisites,
    completionRule: primerId ? "explicit-quick-primer-finish" : "all-required-visited-or-skipped",
    frozenOrder,
    primerId,
    sourcePackageVersion,
    completionProjection: primerId ? { title: resolveQuickPrimer(knowledgePackage, primerId).completionCopy.title, primaryAction: { id: "return-home", label: resolveQuickPrimer(knowledgePackage, primerId).completionCopy.primaryActionLabel } } : completionProjection,
    options: {
      type,
      scopeId,
      relationId: options.relationId || null,
      random: Boolean(options.random),
      seed,
      anchorNodeIds: Array.isArray(options.anchorNodeIds) ? [...options.anchorNodeIds] : [],
      recommendationQueue,
      recommendationReason: options.recommendationReason || null,
      originPointId: options.originPointId || null,
      quickPrimerId: options.quickPrimerId || null,
    },
  };
}

function planRecommendedRoute(knowledgePackage, type, context = {}) {
  const defaults = knowledgePackage.moduleProfile.routeDefaults?.[type];
  if (!defaults || !ROUTE_TYPES.includes(type)) return null;
  const scopeId = type === "confusion"
    ? knowledgePackage.indexes.rootNavigationIds[0]
    : defaults.scopeId;
  let relationId = null;
  if (type === "confusion") {
    const formalContrasts = knowledgePackage.relations.filter((relation) => relation.type === "contrast" && contrastPairForRelation(knowledgePackage, relation));
    const direct = context.currentPointId
      ? formalContrasts.filter((relation) => relation.sourcePointId === context.currentPointId || relation.targetPointId === context.currentPointId)
      : [];
    relationId = (direct.length ? direct : defaults.priorityRelationIds.map((id) => formalContrasts.find((relation) => relation.id === id)).filter(Boolean))[0]?.id || null;
  }
  let recommendationReason = type === "confusion" && context.currentPointId && relationId
    ? "这组易混知识与当前知识直接相关"
    : type === "confusion"
      ? "按正式易混对照的既定顺序推荐，不推测你的薄弱点"
      : defaults.reason;
  const recommendationQueue = type === "confusion"
    ? defaults.priorityRelationIds.filter((id) => knowledgePackage.relations.some((relation) => relation.type === "contrast" && relation.id === id))
    : [];
  const selectedRelation = relationId ? knowledgePackage.relations.find((relation) => relation.id === relationId) : null;
  const originPointId = type === "confusion"
    ? context.currentPointId || selectedRelation?.sourcePointId || null
    : null;
  const plan = planLearningRoute(knowledgePackage, {
    type,
    scopeId,
    relationId,
    recommendationReason,
    anchorNodeIds: defaults.anchorNodeIds || [],
    recommendationQueue,
    originPointId,
    quickPrimerId: type === "quick" && context.quickVersion !== "v1" ? defaults.primerId : null,
  });
  if (!plan) return null;
  if (type === "quick" && plan.capabilityLevel === "structure-only") {
    recommendationReason = "策展锚点暂不可用，本次只浏览两篇正式结构";
  }
  plan.basis = [
    { kind: "profile-default", id: type, reason: recommendationReason },
    ...plan.basis.filter((item) => item.kind !== "scope"),
  ];
  plan.recommendationReason = recommendationReason;
  if (type === "confusion") {
    plan.recommendationQueue = recommendationQueue;
  }
  return plan;
}

function createRouteSession(plan, now = 0) {
  const firstSectionId = plan.primerId ? plan.steps[0]?.sectionId : null;
  return {
    planId: plan.id,
    packageVersion: plan.packageVersion,
    currentIndex: 0,
    currentStepId: plan.steps[0]?.stepId || null,
    completedStepIds: [],
    skippedStepIds: [],
    recallResults: { remembered: 0, fuzzy: 0, missed: 0 },
    revealedCount: 0,
    responseByStepId: {},
    contrastEvidenceByStepId: {},
    revealedStepIds: [],
    reviewedStepIds: [],
    viewedAnchorNodeIds: [],
    visitedSectionIds: firstSectionId ? [firstSectionId] : [],
    openedQuickDetails: [],
    quickReflection: { text: "", status: "pending", referenceVisible: false },
    quickReferenceOpened: false,
    completionSnapshot: null,
    expiredReason: null,
    status: plan.steps.length ? "active" : "completed",
    startedAt: now,
    updatedAt: now,
  };
}

function normalizeRouteSession(plan, rawSession) {
  if (!rawSession || rawSession.planId !== plan.id) {
    return createRouteSession(plan);
  }
  if (rawSession.packageVersion !== plan.packageVersion) return { ...rawSession, status: "expired", expiredReason: "content-updated" };
  const session = JSON.parse(JSON.stringify(rawSession));
  session.completedStepIds ||= [];
  session.skippedStepIds ||= [];
  session.recallResults ||= { remembered: 0, fuzzy: 0, missed: 0 };
  session.responseByStepId ||= {};
  session.contrastEvidenceByStepId ||= {};
  session.revealedStepIds ||= [];
  session.reviewedStepIds ||= [];
  session.viewedAnchorNodeIds ||= [];
  session.visitedSectionIds ||= plan.primerId && plan.steps[0]?.sectionId ? [plan.steps[0].sectionId] : [];
  session.openedQuickDetails ||= [];
  session.quickReflection ||= { text: "", status: "pending", referenceVisible: false };
  // Older input sessions keep their original text/status and already exposed reference.
  session.quickReferenceOpened = Boolean(session.quickReferenceOpened || session.quickReflection.referenceVisible || ["submitted", "skipped"].includes(session.quickReflection.status));
  session.expiredReason ||= null;
  if (!plan.steps[session.currentIndex] && session.status === "active") {
    session.status = "expired";
    session.expiredReason = "saved-position-unavailable";
  }
  session.currentStepId = plan.steps[session.currentIndex]?.stepId || null;
  return session;
}

function userFacingRouteReason(reason) {
  return typeof reason === "string"
    ? reason.replace(/已确认ContrastPair策展顺序/g, "正式易混对照的既定顺序").replace(/ContrastPair/g, "正式易混对照").replace(/不预测用户弱点/g, "不推测你的薄弱点")
    : reason;
}

function routeResumeLabel(plan, session) {
  if (plan.type === "quick" && plan.primerId) return "继续导读";
  if (plan.type === "exam") return `继续第${Math.min(session.currentIndex + 1, plan.steps.length)}/${plan.steps.length}张`;
  return `继续${plan.label}`;
}

function projectRouteStart(plan, rawSession) {
  const session = rawSession ? normalizeRouteSession(plan, rawSession) : null;
  const resumable = session?.status === "active";
  return {
    routeType: plan.type,
    title: plan.label,
    scopeTitle: plan.type === "confusion" ? "本组正式易混对照" : plan.scopeTitle,
    scopePathText: plan.scopePathText,
    recommendationReason: userFacingRouteReason(plan.recommendationReason),
    method: ROUTE_META[plan.type].description,
    details: plan.startProjection,
    result: {
      quick: plan.capabilityLevel === "structure-only"
        ? "看过两篇正式结构和最后收束"
        : "看过整体、两条主干、策展锚点和最后收束",
      systematic: "留下阅读、回忆、回看和跳过的本次记录",
      confusion: "完成一次有来源的边界核对与再辨",
      exam: "得到本轮逐卡自评和即时回看清单",
    }[plan.type],
    requiresSelection: false,
    primaryAction: {
      id: resumable ? "resume-route" : "start-route",
      label: resumable ? routeResumeLabel(plan, session) : ROUTE_META[plan.type].startAction,
    },
    secondaryActions: [
      { id: "adjust", label: ROUTE_META[plan.type].adjustAction },
      { id: "exit", label: plan.type === "quick" ? "退出并自由浏览全景" : "退出本次任务" },
    ],
  };
}

function projectRecallViewModel(knowledgePackage, pointOrRecallId, answerVisible = false) {
  const maps = packageMaps(knowledgePackage);
  if (answerVisible && typeof answerVisible === "object") {
    const options = answerVisible;
    const projection = knowledgePackage.recallProjections.find((item) => (
      item.pointId === pointOrRecallId
      && (!options.recallItemId || item.recallItemId === options.recallItemId)
    ));
    const recall = projection ? maps.recalls.get(projection.recallItemId) : null;
    if (!projection || !recall) return null;
    const revealed = Boolean(options.revealed);
    const unit = maps.units.get(projection.pointId);
    return {
      id: projection.recallItemId,
      recallItemId: projection.recallItemId,
      pointId: projection.pointId,
      pointTitle: unit?.title || "",
      state: revealed ? "revealed" : "prompt",
      prompt: projection.prompt,
      answer: revealed ? recall.answer : null,
      pitfall: revealed ? recall.pitfall : null,
      answerVisible: revealed,
      response: revealed ? options.response || null : null,
      remedyStep: revealed ? options.remedyStep || null : null,
      answerAtomRefIds: [...projection.answerAtomRefIds],
      answerSourceBlockIds: [...projection.answerSourceBlockIds],
      pitfallAtomRefIds: [...projection.pitfallAtomRefIds],
      pitfallSourceBlockIds: [...projection.pitfallSourceBlockIds],
      sourceRefIds: [...projection.sourceRefIds],
      sourceBlockIds: [...recall.sourceBlockIds],
      primaryAction: !revealed
        ? { id: "reveal", label: "揭晓答案" }
        : options.response
          ? { id: "complete-recall", label: "完成本次回忆" }
          : null,
      responseOptions: revealed ? [
        { id: "remembered", label: "记住了" },
        { id: "fuzzy", label: "有点模糊" },
        { id: "missed", label: "没想起" },
        { id: "skipped", label: "跳过" },
      ] : [],
      returnTarget: {
        ...projection.returnTarget,
        recallItemId: projection.recallItemId,
      },
    };
  }
  const recall = maps.recalls.get(pointOrRecallId);
  if (!recall) return null;
  const unit = maps.units.get(recall.pointId);
  return {
    id: recall.id,
    pointId: recall.pointId,
    pointTitle: unit?.title || "",
    prompt: recall.prompt,
    answer: answerVisible ? recall.answer : null,
    pitfall: answerVisible ? recall.pitfall : null,
    answerVisible,
    sourceBlockIds: [...recall.sourceBlockIds],
  };
}

function projectGoalGuide(plan, rawSession) {
  if (!plan) return null;
  const session = normalizeRouteSession(plan, rawSession);
  const step = plan.steps[session.currentIndex] || null;
  const nextStep = plan.steps[session.currentIndex + 1] || null;
  const typeMeta = ROUTE_META[plan.type] || { label: plan.label || "学习路线" };
  const currentResponse = step ? session.responseByStepId[step.stepId] || null : null;
  const systematicPointPosition = plan.type === "systematic"
    ? plan.stageGroups.findIndex((group) => group.stages.includes(step?.stepId)) + 1
    : 0;
  const remedyUnreviewed = Object.entries(session.responseByStepId)
    .filter(([stepId, result]) => ["fuzzy", "missed"].includes(result) && !session.reviewedStepIds.includes(stepId))
    .length;
  const completion = session.status === "completed" ? {
    ...plan.completionProjection,
    primaryAction: plan.type === "exam" && remedyUnreviewed
      ? { id: "review-remedy", label: `回看待补救的 ${remedyUnreviewed} 张` }
      : plan.completionProjection.primaryAction,
  } : null;
  const examRevealed = step && session.revealedStepIds.includes(step.stepId);
  const examInstruction = plan.type !== "exam" || !step ? null
    : currentResponse === "missed"
      ? "建议先回看这张完整知识，也可以先继续并留待本轮结束"
      : currentResponse === "fuzzy"
        ? "对照易错边界后可继续；需要时回看这张完整知识"
        : examRevealed
          ? "对照正式答案和易错边界，按实际情况选择一项自评"
          : "先在心中回答这张卡的问题";
  const examNextReason = plan.type !== "exam" || !step ? null
    : ["fuzzy", "missed"].includes(currentResponse)
      ? nextStep ? "进入下一张回忆卡" : "查看本轮自评与待回看清单"
      : examRevealed
        ? nextStep ? "记得会进入下一张；模糊可继续或回看，没想起建议先回看" : "自评后查看本轮结果与待回看清单"
        : "揭晓正式答案，再判断这次能否想起";
  return {
    routeId: plan.id,
    routeType: plan.type,
    label: typeMeta.label,
    purpose: userFacingRouteReason(plan.basis.find((item) => item.kind === "profile-default")?.reason
      || plan.basis[0]?.reason
      || typeMeta.description
      || "完成本次学习目标"),
    instruction: examInstruction || step?.reason || completion?.title || "本次任务已结束",
    completionEvent: plan.primerId ? null : plan.type === "quick" && step ? "确认已看清当前站" : step?.eventType || null,
    currentStepId: step?.stepId || null,
    currentIndex: session.currentIndex,
    stepCount: plan.steps.length,
    progressText: session.status === "completed"
      ? completion.title
      : plan.type === "quick"
        ? plan.primerId ? `快速了解 · ${session.currentIndex + 1}/${plan.steps.length}` : `导览第 ${session.currentIndex + 1} 站，共 ${plan.steps.length} 站`
        : plan.type === "systematic"
          ? `系统学习 · 第 ${systematicPointPosition}/${plan.stageGroups.length} 个知识 · ${step?.stage === "reading" ? "完整理解" : "主动回忆"}`
          : plan.type === "confusion"
            ? `本组阶段：${{ judgment: "先判断", boundary: "核对边界", evidence: "回看依据", retest: "再辨一次" }[step?.stage] || "完成"}`
            : `第 ${session.currentIndex + 1} 张，共 ${plan.steps.length} 张`,
    next: examNextReason ? {
      stepId: nextStep?.stepId || null,
      activity: nextStep?.activity || "recall",
      reason: examNextReason,
    } : nextStep && !plan.primerId ? {
      stepId: nextStep.stepId,
      activity: nextStep.activity,
      reason: nextStep.reason,
    } : null,
    status: session.status,
    currentResponse,
    completion,
  };
}

function advanceRoute(plan, session) {
  const currentIndex = session.currentIndex + 1;
  return {
    ...session,
    currentIndex,
    currentStepId: plan.steps[currentIndex]?.stepId || null,
    status: currentIndex >= plan.steps.length ? "completed" : "active",
    completionSnapshot: currentIndex >= plan.steps.length ? {
      completedStepIds: [...session.completedStepIds],
      skippedStepIds: [...session.skippedStepIds],
      responseByStepId: { ...session.responseByStepId },
      reviewedStepIds: [...session.reviewedStepIds],
    } : session.completionSnapshot,
  };
}

function applyRouteSessionEvent(plan, rawSession, event) {
  let session = normalizeRouteSession(plan, rawSession);
  const step = plan.steps[session.currentIndex];
  if (event.type === "VIEW_REMEDY") {
    const reviewedStepId = plan.steps.some((item) => item.stepId === event.stepId) ? event.stepId : step?.stepId;
    if (!reviewedStepId || !["fuzzy", "missed"].includes(session.responseByStepId[reviewedStepId])) return session;
    return {
      ...session,
      reviewedStepIds: session.reviewedStepIds.includes(reviewedStepId) ? session.reviewedStepIds : [...session.reviewedStepIds, reviewedStepId],
      updatedAt: event.at ?? session.updatedAt,
    };
  }
  if (session.status !== "active") return session;
  if (!step) return { ...session, status: "expired", expiredReason: "saved-position-unavailable" };
  if (plan.primerId) {
    if (event.type === "NEXT_QUICK_SECTION" || event.type === "PREVIOUS_QUICK_SECTION") {
      const forward = event.type === "NEXT_QUICK_SECTION";
      const currentIndex = session.currentIndex + (forward ? 1 : -1);
      const next = plan.steps[currentIndex];
      if (!next) return session;
      return {
        ...session,
        currentIndex,
        currentStepId: next.stepId,
        completedStepIds: forward ? [...new Set([...session.completedStepIds, step.stepId])] : session.completedStepIds,
        visitedSectionIds: [...new Set([...session.visitedSectionIds, next.sectionId])],
        updatedAt: event.at ?? session.updatedAt,
      };
    }
    if (event.type === "VIEW_QUICK_SECTION") {
      const currentIndex = plan.steps.findIndex((item) => item.sectionId === event.sectionId);
      if (currentIndex < 0) return session;
      const sectionId = plan.steps[currentIndex].sectionId;
      return {
        ...session,
        currentIndex,
        currentStepId: plan.steps[currentIndex].stepId,
        visitedSectionIds: session.visitedSectionIds.includes(sectionId) ? session.visitedSectionIds : [...session.visitedSectionIds, sectionId],
        updatedAt: event.at ?? session.updatedAt,
      };
    }
    if (event.type === "OPEN_QUICK_DETAIL") {
      const primerSection = plan.steps.find((item) => item.sectionId === event.sectionId);
      if (!primerSection?.detailTargets?.includes(event.pointId)) return session;
      const key = `${event.sectionId}:${event.pointId}`;
      return {
        ...session,
        openedQuickDetails: session.openedQuickDetails.includes(key) ? session.openedQuickDetails : [...session.openedQuickDetails, key],
        updatedAt: event.at ?? session.updatedAt,
      };
    }
    if (event.type === "OPEN_QUICK_REFERENCE") {
      const finalSectionId = plan.steps[plan.steps.length - 1]?.sectionId;
      if (step.sectionId !== finalSectionId) return session;
      return { ...session, quickReferenceOpened: true, updatedAt: event.at ?? session.updatedAt };
    }
    // Legacy event support is retained for stored input sessions; the UI no longer asks for input.
    if (event.type === "UPDATE_QUICK_REFLECTION") {
      return { ...session, quickReflection: { ...session.quickReflection, text: String(event.text || "").slice(0, 80) }, updatedAt: event.at ?? session.updatedAt };
    }
    if (event.type === "SUBMIT_QUICK_REFLECTION") {
      const text = String(event.text ?? session.quickReflection.text ?? "").trim().slice(0, 80);
      if (text.length < 6) return session;
      return { ...session, quickReflection: { text, status: "submitted", referenceVisible: true }, updatedAt: event.at ?? session.updatedAt };
    }
    if (event.type === "SKIP_QUICK_REFLECTION") {
      return { ...session, quickReflection: { text: "", status: "skipped", referenceVisible: true }, updatedAt: event.at ?? session.updatedAt };
    }
    if (event.type === "COMPLETE_QUICK_PRIMER") {
      const finalSectionId = plan.steps[plan.steps.length - 1]?.sectionId;
      if (step.sectionId !== finalSectionId) return session;
      return {
        ...session,
        status: "completed",
        completedStepIds: [...new Set([...session.completedStepIds, step.stepId])],
        completionSnapshot: { visitedSectionIds: [...session.visitedSectionIds], openedQuickDetails: [...session.openedQuickDetails], reflectionStatus: session.quickReflection.status, referenceOpened: session.quickReferenceOpened },
        updatedAt: event.at ?? session.updatedAt,
      };
    }
    return session;
  }
  if (plan.type === "confusion" && step.stage === "evidence" && event.type === "VIEW_CONTRAST_SIDE") {
    if (!["left", "right"].includes(event.side)) return session;
    const viewed = session.contrastEvidenceByStepId[step.stepId] || { left: false, right: false };
    return {
      ...session,
      contrastEvidenceByStepId: { ...session.contrastEvidenceByStepId, [step.stepId]: { ...viewed, [event.side]: true } },
      updatedAt: event.at ?? session.updatedAt,
    };
  }
  if (plan.type === "confusion" && step.stage === "evidence" && event.type === "VIEW_CONTRAST_EVIDENCE") {
    const viewed = session.contrastEvidenceByStepId[step.stepId];
    if (!viewed?.left || !viewed?.right) return session;
  }
  if (event.type === "VIEW_TOUR_ANCHOR" && plan.type === "quick" && step.anchors?.some((anchor) => anchor.nodeId === event.anchorNodeId)) {
    return {
      ...session,
      viewedAnchorNodeIds: session.viewedAnchorNodeIds.includes(event.anchorNodeId)
        ? session.viewedAnchorNodeIds
        : [...session.viewedAnchorNodeIds, event.anchorNodeId],
      updatedAt: event.at ?? session.updatedAt,
    };
  }
  if (event.type === "REVEAL_RECALL" && step.recallItemId) {
    return {
      ...session,
      revealedStepIds: session.revealedStepIds.includes(step.stepId) ? session.revealedStepIds : [...session.revealedStepIds, step.stepId],
      revealedCount: session.revealedStepIds.includes(step.stepId) ? session.revealedCount : session.revealedCount + 1,
      updatedAt: event.at ?? session.updatedAt,
    };
  }
  if (event.type === "SKIP_STEP" || event.type === "SKIP_TOUR_STOP") {
    session = { ...session, skippedStepIds: [...session.skippedStepIds, step.stepId], updatedAt: event.at ?? session.updatedAt };
    return advanceRoute(plan, session);
  }
  if (event.type === "RECALL_RESULT" && step.recallItemId) {
    const result = event.result;
    if (!["remembered", "fuzzy", "missed", "skipped"].includes(result)) return session;
    if (!session.revealedStepIds.includes(step.stepId)) return session;
    if (result === "skipped") {
      session = { ...session, skippedStepIds: session.skippedStepIds.includes(step.stepId) ? session.skippedStepIds : [...session.skippedStepIds, step.stepId], updatedAt: event.at ?? session.updatedAt };
      return advanceRoute(plan, session);
    }
    const previous = session.responseByStepId[step.stepId];
    const recallResults = { ...session.recallResults };
    if (previous && recallResults[previous] > 0) recallResults[previous] -= 1;
    recallResults[result] += 1;
    session = {
      ...session,
      responseByStepId: { ...session.responseByStepId, [step.stepId]: result },
      recallResults,
      updatedAt: event.at ?? session.updatedAt,
    };
    if (["exam", "systematic"].includes(plan.type) && result !== "remembered") return session;
    session.completedStepIds = session.completedStepIds.includes(step.stepId) ? session.completedStepIds : [...session.completedStepIds, step.stepId];
    return advanceRoute(plan, session);
  }
  if (event.type === "NEXT_RECALL_CARD" && step.recallItemId && session.responseByStepId[step.stepId]) {
    session.completedStepIds = session.completedStepIds.includes(step.stepId) ? session.completedStepIds : [...session.completedStepIds, step.stepId];
    session.updatedAt = event.at ?? session.updatedAt;
    return advanceRoute(plan, session);
  }
  const allowedEvent = {
    quick: { overview: "COMPLETE_TOUR_STOP", branch: "COMPLETE_TOUR_STOP", closure: "COMPLETE_TOUR_STOP" },
    systematic: { reading: "COMPLETE_READING_STEP" },
    confusion: { judgment: "REVEAL_CONTRAST_KEY", boundary: "CONFIRM_CONTRAST_BOUNDARY", evidence: "VIEW_CONTRAST_EVIDENCE", retest: "CONTRAST_RESPONSE" },
  }[plan.type]?.[step.stage];
  if (allowedEvent && event.type === allowedEvent) {
    if (plan.type === "confusion" && step.stage === "judgment" && !["answered", "unsure", "skipped"].includes(event.result)) return session;
    if (plan.type === "confusion" && step.stage === "retest" && !["clear", "fuzzy", "missed"].includes(event.result)) return session;
    const responseByStepId = event.result
      ? { ...session.responseByStepId, [step.stepId]: event.result }
      : session.responseByStepId;
    session = { ...session, completedStepIds: [...session.completedStepIds, step.stepId], updatedAt: event.at ?? session.updatedAt };
    session.responseByStepId = responseByStepId;
    return advanceRoute(plan, session);
  }
  return session;
}

function projectRouteViewModel(knowledgePackage, plan, rawSession, options = {}) {
  const session = normalizeRouteSession(plan, rawSession);
  const maps = packageMaps(knowledgePackage);
  const step = plan.steps[session.currentIndex] || null;
  const unit = step?.pointId ? maps.units.get(step.pointId) : null;
  const navigation = step?.navigationNodeId ? maps.navigation.get(step.navigationNodeId) : unit ? maps.navigation.get(unit.navigationNodeId) : null;
  const relation = step?.relationId ? maps.relations.get(step.relationId) : null;
  const target = relation ? maps.units.get(relation.targetPointId) : null;
  const answerVisible = step ? session.revealedStepIds.includes(step.stepId) : false;
  const recall = step?.recallItemId ? projectRecallViewModel(knowledgePackage, step.recallItemId, answerVisible) : null;
  const contrastPair = contrastPairForRelation(knowledgePackage, relation);
  const contrastAtoms = new Map(knowledgePackage.knowledgeAtomRefs.map((item) => [item.id, item]));
  const contrastSides = contrastPair ? ["left", "right"].map((side) => {
    const sideUnit = maps.units.get(contrastPair[`${side}PointId`]);
    const blockIds = new Set(contrastPair[`${side}AtomRefIds`].flatMap((id) => contrastAtoms.get(id)?.sourceBlockIds || []));
    return {
      side,
      pointId: sideUnit.id,
      title: sideUnit.title,
      blocks: sideUnit.blocks.filter((block) => blockIds.has(block.id) && contrastPair.sourceBlockIds.includes(block.id))
        .map((block) => ({ id: block.id, text: block.fallbackText, sourceRefIds: [...block.sourceRefIds] })),
    };
  }) : [];
  const pointOrder = [...new Set(plan.steps.map((item) => item.pointId).filter(Boolean))];
  const currentPointPosition = step?.pointId ? pointOrder.indexOf(step.pointId) + 1 : 0;
  const systematicCycle = plan.type === "systematic" && step?.pointId
    ? plan.steps
      .map((item, index) => ({ ...item, index }))
      .filter((item) => item.pointId === step.pointId)
      .map((item) => ({
        id: item.stepId,
        label: item.stage === "reading" ? "完整理解" : "主动回忆",
        state: item.index < session.currentIndex ? "done" : item.index === session.currentIndex ? "current" : "upcoming",
      }))
    : [];
  const quickBranches = plan.type === "quick" && !plan.primerId
    ? plan.steps.map((item, index) => {
      const node = maps.navigation.get(item.navigationNodeId);
      return {
        id: item.stepId,
        title: item.stage === "overview" ? "整体定位" : item.stage === "closure" ? "回到完整全景" : node?.title || "知识分支",
        stage: item.stage,
        pointCount: node?.pointCount || 0,
        childTitles: (node?.childIds.map((id) => maps.navigation.get(id)?.title).filter(Boolean) || []).slice(0, 3),
        moreChildCount: Math.max(0, (node?.childIds.length || 0) - 3),
        anchorNodeIds: [...(item.anchorNodeIds || [])],
        anchors: (item.anchors || []).map((anchor) => ({ ...anchor })),
        state: index < session.currentIndex ? "done" : index === session.currentIndex ? "current" : "upcoming",
      };
    })
    : [];
  const systematicTitles = plan.type === "systematic"
    ? pointOrder.map((id) => maps.units.get(id)?.title).filter(Boolean)
    : [];
  const systematicRelations = plan.type === "systematic" && step?.pointId
    ? (step.relationContextIds || [])
      .map((id) => maps.relations.get(id))
      .filter(Boolean)
    : [];
  const systematicPrerequisites = systematicRelations
    .filter((item) => item.type === "prerequisite" && item.sourcePointId === step?.pointId)
    .map((item) => ({
      relationId: item.id,
      pointId: item.targetPointId,
      title: maps.units.get(item.targetPointId)?.title || "前置知识",
      reason: item.reason,
    }));
  const systematicOutsidePrerequisites = plan.type === "systematic" && step?.pointId
    ? plan.outsidePrerequisites
      .filter((item) => item.pointId === step.pointId)
      .map((item) => ({
        pointId: item.prerequisitePointId,
        title: maps.units.get(item.prerequisitePointId)?.title || "范围外知识",
        reason: maps.relations.get(item.relationId)?.reason || "正式前置关系",
      }))
    : [];
  const quickPrimer = plan.primerId ? projectQuickPrimerViewModel(knowledgePackage, plan, session) : null;
  const currentPrimerSection = quickPrimer?.sections.find((item) => item.id === step?.sectionId) || null;
  const progressIndex = plan.type === "systematic" ? currentPointPosition - 1 : session.currentIndex;
  const progressItems = plan.type === "systematic" ? pointOrder : plan.steps.map((item) => item.stepId);
  const phasePosition = plan.type === "systematic"
    ? systematicCycle.findIndex((item) => item.state === "current") + 1
    : plan.type === "exam" ? session.responseByStepId[step?.stepId] ? 3 : answerVisible ? 2 : 1 : null;
  const progressTask = quickPrimer?.currentTask || (plan.type === "systematic"
    ? `${phasePosition}/${systematicCycle.length} · ${step?.stage === "reading" ? "完整理解" : "主动回忆"}`
    : plan.type === "confusion"
      ? { judgment: "先判断", boundary: "核对区别", evidence: "查看原文", retest: "再辨一次" }[step?.stage]
      : `${phasePosition}/3 · ${phasePosition === 1 ? "先想答案" : phasePosition === 2 ? "揭晓并自评" : "继续或回看"}`);
  const progress = step && session.status === "active" ? {
    positionLabel: plan.type === "systematic" ? "当前知识" : plan.type === "exam" ? "当前卡片" : "当前步骤",
    position: progressIndex + 1,
    total: progressItems.length,
    taskLabel: plan.type === "quick" ? "导读阶段" : ["systematic", "exam"].includes(plan.type) ? "学习阶段" : "本步任务",
    task: progressTask,
    phasePosition,
    phaseTotal: plan.type === "systematic" ? systematicCycle.length : plan.type === "exam" ? 3 : null,
    canPause: !quickPrimer || quickPrimer.hasNext,
    segments: quickPrimer?.progressSteps || progressItems.map((id, index) => ({
      id,
      state: index === progressIndex ? "current" : index < progressIndex ? "completed" : "upcoming",
    })),
  } : null;
  const remedyQueue = Object.entries(session.responseByStepId)
    .filter(([, result]) => ["fuzzy", "missed"].includes(result))
    .map(([stepId, result]) => {
      const remedyStep = plan.steps.find((item) => item.stepId === stepId);
      return {
        stepId,
        result,
        pointId: remedyStep?.pointId || null,
        title: maps.units.get(remedyStep?.pointId)?.title || "回忆卡",
        reviewed: session.reviewedStepIds.includes(stepId),
      };
    });
  return {
    plan: {
      id: plan.id,
      type: plan.type,
      label: plan.label,
      scopeId: plan.scopeId,
      scopeTitle: plan.scopeTitle,
      scopePathText: plan.scopePathText,
      stepCount: plan.steps.length,
      capabilityLevel: plan.capabilityLevel,
      outsidePrerequisiteCount: plan.outsidePrerequisites.length,
      basisText: plan.basis.map((item) => userFacingRouteReason(item.reason)).join("；"),
      random: Boolean(plan.seed),
      knowledgeCount: pointOrder.length,
      firstKnowledgeTitles: systematicTitles.slice(0, 3),
      lastKnowledgeTitle: systematicTitles[systematicTitles.length - 1] || "",
    },
    progress,
    experience: {
      quickBranches,
      quickPrimer,
      systematic: plan.type === "systematic" ? {
        pointPosition: currentPointPosition,
        pointTotal: pointOrder.length,
        cycle: systematicCycle,
        orientation: {
          pathText: unit ? unit.navigationPathIds.map((id) => maps.navigation.get(id)?.title).filter(Boolean).join(" › ") : "",
          whyNow: systematicPrerequisites.length
            ? `先完成「${systematicPrerequisites[0].title}」，再学习当前知识`
            : currentPointPosition === 1
              ? "这是本范围按正式顺序安排的第一个知识"
              : "按本范围的正式顺序继续到当前知识",
          prerequisites: systematicPrerequisites,
          outsidePrerequisites: systematicOutsidePrerequisites,
          relationCount: systematicRelations.length,
        },
      } : null,
      confusion: relation ? {
        sourceTitle: unit?.title || "",
        sourceSummary: unit?.summary || "",
        targetTitle: target?.title || "",
        targetSummary: target?.summary || "",
        reason: relation.reason,
        capabilityLevel: plan.capabilityLevel,
        dimensions: contrastPair ? [...contrastPair.dimensions] : [],
        boundaries: contrastPair?.boundaries.length ? [...contrastPair.boundaries] : [relation.reason],
        comparisonPrompt: contrastPair?.dimensions.length
          ? `围绕「${contrastPair.dimensions[0]}」，这两个知识分别回答什么？`
          : null,
        responses: {
          judgment: plan.steps.find((item) => item.stage === "judgment")?.stepId ? session.responseByStepId[plan.steps.find((item) => item.stage === "judgment").stepId] || null : null,
          retest: plan.steps.find((item) => item.stage === "retest")?.stepId ? session.responseByStepId[plan.steps.find((item) => item.stage === "retest").stepId] || null : null,
        },
        evidenceViewed: session.contrastEvidenceByStepId[plan.steps.find((item) => item.stage === "evidence")?.stepId] || { left: false, right: false },
        contrastPair: contrastPair ? {
          id: contrastPair.id,
          sides: contrastSides,
          leftPointId: contrastPair.leftPointId,
          rightPointId: contrastPair.rightPointId,
          sourceBlockIds: [...contrastPair.sourceBlockIds],
          sourceRefIds: [...contrastPair.sourceRefIds],
          dimensions: [...contrastPair.dimensions],
          boundaries: [...contrastPair.boundaries],
          leftAtomRefIds: [...contrastPair.leftAtomRefIds],
          rightAtomRefIds: [...contrastPair.rightAtomRefIds],
          recallItems: contrastPair.recallItemIds.map((id) => maps.recalls.get(id)).filter(Boolean).map((item) => ({ id: item.id, prompt: item.prompt, answer: item.answer })),
        } : null,
      } : null,
      exam: plan.type === "exam" ? { cardCount: plan.steps.length } : null,
    },
    session,
    guide: projectGoalGuide(plan, session),
    progressText: projectGoalGuide(plan, session).progressText,
    current: step ? {
      ...step,
      title: currentPrimerSection?.title || unit?.title || navigation?.title || target?.title || "路线步骤",
      summary: unit?.summary || navigation?.summary || null,
      pathText: unit ? unit.navigationPathIds.map((id) => maps.navigation.get(id)?.title).filter(Boolean).join(" › ") : navigation?.pathTitles.join(" › ") || "",
      relation: relation ? { id: relation.id, reason: relation.reason, sourceTitle: unit?.title || "", sourceSummary: unit?.summary || "", targetTitle: target?.title || "", targetSummary: target?.summary || "", type: relation.type } : null,
      recall: recall ? { id: recall.id, prompt: recall.prompt, answer: recall.answer, pitfall: recall.pitfall, sourceBlockIds: [...recall.sourceBlockIds] } : null,
      response: step ? session.responseByStepId[step.stepId] || null : null,
      revealed: answerVisible,
    } : null,
    report: {
      completed: session.completedStepIds.length,
      completedTourStops: plan.steps.filter((item) => session.completedStepIds.includes(item.stepId) && item.stage && ["overview", "branch", "closure"].includes(item.stage)).length,
      completedBranches: plan.steps.filter((item) => session.completedStepIds.includes(item.stepId) && item.stage === "branch").length,
      completedOverview: plan.steps.some((item) => session.completedStepIds.includes(item.stepId) && item.stage === "overview"),
      completedClosure: plan.steps.some((item) => session.completedStepIds.includes(item.stepId) && item.stage === "closure"),
      completedReading: plan.steps.filter((item) => session.completedStepIds.includes(item.stepId) && item.stage === "reading").length,
      completedRecall: plan.steps.filter((item) => session.completedStepIds.includes(item.stepId) && item.stage === "recall").length,
      nextScope: plan.type === "systematic" && session.status === "completed" ? nextSystematicScope(knowledgePackage, plan.scopeId) : null,
      completedContrastStages: plan.steps.filter((item) => session.completedStepIds.includes(item.stepId) && ["judgment", "boundary", "evidence", "retest"].includes(item.stage)).length,
      contrastJudgmentCompleted: plan.steps.some((item) => session.completedStepIds.includes(item.stepId) && item.stage === "judgment"),
      contrastJudgmentResponse: Object.entries(session.responseByStepId).find(([id]) => plan.steps.some((item) => item.stepId === id && item.stage === "judgment"))?.[1] || null,
      contrastBoundaryCompleted: plan.steps.some((item) => session.completedStepIds.includes(item.stepId) && item.stage === "boundary"),
      contrastEvidenceReviewed: plan.steps.some((item) => session.completedStepIds.includes(item.stepId) && item.stage === "evidence"),
      contrastRetestResponse: Object.entries(session.responseByStepId).find(([id]) => plan.steps.some((item) => item.stepId === id && item.stage === "retest"))?.[1] || null,
      contrastEvidenceSides: session.contrastEvidenceByStepId[plan.steps.find((item) => item.stage === "evidence")?.stepId] || { left: false, right: false },
      skipped: session.skippedStepIds.length,
      viewedAnchors: session.viewedAnchorNodeIds.length,
      viewedAnchorNodeIds: [...session.viewedAnchorNodeIds],
      availableAnchors: plan.startProjection?.anchorCount || 0,
      revealed: session.revealedCount,
      reviewed: session.reviewedStepIds.length,
      recallResults: { ...session.recallResults },
      remedyQueue,
      pendingRemedyQueue: remedyQueue.filter((item) => !item.reviewed),
      responseByStepId: { ...session.responseByStepId },
      missedUnreviewedStepIds: Object.entries(session.responseByStepId).filter(([id, result]) => result === "missed" && !session.reviewedStepIds.includes(id)).map(([id]) => id),
      missedUnreviewedItems: Object.entries(session.responseByStepId)
        .filter(([id, result]) => result === "missed" && !session.reviewedStepIds.includes(id))
        .map(([id]) => {
          const missedStep = plan.steps.find((item) => item.stepId === id);
          return { stepId: id, pointId: missedStep?.pointId || null, title: maps.units.get(missedStep?.pointId)?.title || "回忆卡" };
        }),
      hasSkipped: session.skippedStepIds.length > 0,
      quickSectionsReached: session.visitedSectionIds.length,
      quickDetailOpenCount: session.openedQuickDetails.length,
      quickReflectionStatus: session.quickReflection.status,
      quickReferenceOpened: session.quickReferenceOpened,
    },
  };
}

function normalizeSearchText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function safeSnippet(text, query) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  const index = normalizeSearchText(clean).indexOf(query);
  if (index < 0) return clean.slice(0, 100);
  const start = Math.max(0, index - 28);
  const end = Math.min(clean.length, index + query.length + 62);
  return `${start ? "…" : ""}${clean.slice(start, end)}${end < clean.length ? "…" : ""}`;
}

function projectSearchResults(knowledgePackage, rawQuery, intent = "all") {
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];
  const validIntent = SEARCH_INTENTS.some((item) => item.id === intent) ? intent : "all";
  const maps = packageMaps(knowledgePackage);
  const results = [];
  for (const unit of knowledgePackage.knowledgeUnits) {
    const pathText = unit.navigationPathIds.map((id) => maps.navigation.get(id)?.title).filter(Boolean).join(" › ");
    const candidates = [];
    const title = normalizeSearchText(unit.title);
    if (title === query) candidates.push({ score: 100, kind: "标题精确命中", text: unit.title, intent: "definition" });
    else if (title.startsWith(query)) candidates.push({ score: 90, kind: "标题开头命中", text: unit.title, intent: "definition" });
    else if (title.includes(query) || unit.aliases.some((alias) => normalizeSearchText(alias).includes(query))) candidates.push({ score: 85, kind: "标题或别名命中", text: unit.title, intent: "definition" });
    if (normalizeSearchText(pathText).includes(query)) candidates.push({ score: 80, kind: "体系路径命中", text: pathText, intent: "location" });
    for (const block of unit.blocks) {
      if (!normalizeSearchText(block.fallbackText).includes(query)) continue;
      const semanticIntent = block.semantic === "contrast" ? "contrast" : ["condition", "exception"].includes(block.semantic) ? "boundary" : ["definition", "conclusion"].includes(block.semantic) ? "definition" : "all";
      const semanticLabel = block.semantic === "contrast"
        ? "对比内容命中"
        : ["condition", "exception"].includes(block.semantic)
          ? "条件边界命中"
          : ["definition", "conclusion"].includes(block.semantic)
            ? "重点内容命中"
            : "正文命中";
      candidates.push({ score: block.semantic === "plain" ? 60 : 70, kind: semanticLabel, text: safeSnippet(block.fallbackText, query), blockId: block.id, semantic: block.semantic, intent: semanticIntent });
    }
    for (const relationId of unit.relationIds) {
      const relation = maps.relations.get(relationId);
      if (!normalizeSearchText(relation.reason).includes(query)) continue;
      candidates.push({ score: 50, kind: relation.type === "contrast" ? "易混关系命中" : "关系理由命中", text: safeSnippet(relation.reason, query), relationId, intent: relation.type === "contrast" ? "contrast" : "relation" });
    }
    for (const recallItemId of unit.recallItemIds) {
      const recall = maps.recalls.get(recallItemId);
      if (normalizeSearchText(recall.prompt).includes(query)) candidates.push({ score: 40, kind: "回忆提示命中", text: safeSnippet(recall.prompt, query), recallItemId, intent: "recall" });
    }
    const filtered = candidates.filter((candidate) => validIntent === "all" || candidate.intent === validIntent || (validIntent === "definition" && candidate.score >= 85));
    if (!filtered.length) continue;
    filtered.sort((a, b) => b.score - a.score || String(a.blockId || a.relationId || "").localeCompare(String(b.blockId || b.relationId || "")));
    const match = filtered[0];
    const availableActions = [
      "system",
      ...(unit.relationIds.length ? ["relations"] : []),
      "reading",
      ...(unit.recallItemIds.length ? ["recall"] : []),
    ];
    const actionIntent = validIntent === "all" ? match.intent : validIntent;
    const matchedRelation = match.relationId ? maps.relations.get(match.relationId) : null;
    const hasFormalContrast = matchedRelation?.type === "contrast" && knowledgePackage.contrastPairs.some((pair) => (
      (pair.leftPointId === matchedRelation.sourcePointId && pair.rightPointId === matchedRelation.targetPointId)
      || (pair.leftPointId === matchedRelation.targetPointId && pair.rightPointId === matchedRelation.sourcePointId)
    ));
    const preferredMode = actionIntent === "location"
      ? "system"
      : actionIntent === "relation" && matchedRelation
        ? "relations"
        : actionIntent === "contrast" && hasFormalContrast
          ? "relations"
        : actionIntent === "recall" && unit.recallItemIds.length
          ? "recall"
        : "reading";
    const actionLabels = {
      system: "在知识全景中查看",
      relations: actionIntent === "contrast" ? "查看这组对照" : "查看这条关系",
      reading: match.blockId ? "阅读命中位置" : "阅读完整内容",
      recall: "回忆这个知识",
    };
    const actions = availableActions.map((mode) => ({ mode, label: actionLabels[mode] }));
    results.push({
      pointId: unit.id,
      title: unit.title,
      pathText,
      summary: unit.summary,
      matchLabel: match.kind,
      matchText: match.text,
      blockId: match.blockId || null,
      relationId: match.relationId || null,
      semantic: match.semantic || "plain",
      relationCount: unit.relationIds.length,
      availableActions,
      primaryAction: actions.find((item) => item.mode === preferredMode),
      otherActions: actions.filter((item) => item.mode !== preferredMode),
      reviewState: unit.reviewState,
      riskFlags: [...unit.riskFlags],
      order: unit.order,
      score: match.score,
    });
  }
  return results.sort((a, b) => b.score - a.score || a.order - b.order || a.pointId.localeCompare(b.pointId));
}

module.exports = {
  ROUTE_TYPES,
  ROUTE_META,
  SEARCH_INTENTS,
  seededShuffle,
  unitsInScope,
  projectRouteScopeOptions,
  projectRouteScopePicker,
  projectContrastRouteOptions,
  planLearningRoute,
  planRecommendedRoute,
  projectRouteStart,
  routeResumeLabel,
  createRouteSession,
  normalizeRouteSession,
  applyRouteSessionEvent,
  projectRecallViewModel,
  projectGoalGuide,
  projectRouteViewModel,
  projectQuickPrimerViewModel,
  projectSearchResults,
};
