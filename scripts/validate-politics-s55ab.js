#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repo = path.resolve(__dirname, "..");
const platform = require(path.join(repo, "miniprogram/services/knowledge-platform"));
const { knowledgePackage } = require(path.join(repo, "miniprogram/services/knowledge-platform/politics-runtime"));

const requestedGate = process.argv.find((argument) => argument.startsWith("--gate="))?.slice(7) || "all";
const reportOnly = process.argv.includes("--report");
const validGates = new Set(["source", "a", "b", "all"]);
assert.ok(validGates.has(requestedGate), `unknown gate: ${requestedGate}`);

const checks = [];
function requirement(gate, id, description, verify, covers = []) {
  checks.push({ gate, id, description, verify, covers });
}

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), "utf8");
}

function routeDefaultsFixture() {
  return {
    quick: {
      scopeId: "politics-toc-v2-n001",
      anchorNodeIds: [
        "politics-toc-v2-n006",
        "politics-toc-v2-n007",
        "politics-toc-v2-n025",
        "politics-toc-v2-n029",
        "politics-toc-v2-n032",
        "politics-toc-v2-n038",
      ],
    },
    systematic: {
      scopeId: "politics-toc-v2-n003",
      allowedScopeTypes: ["article", "chapter", "section"],
    },
    confusion: {
      priorityRelationIds: [
        "relation:politics-toc-v2-u025:contrast:politics-toc-v2-u024",
        "relation:politics-toc-v2-u026:contrast:politics-toc-v2-u024",
        "relation:politics-toc-v2-u026:contrast:politics-toc-v2-u025",
        "relation:politics-toc-v2-u030:contrast:politics-toc-v2-u022",
        "relation:politics-toc-v2-u034:contrast:politics-toc-v2-u033",
      ],
    },
    exam: {
      scopeId: "politics-toc-v2-n003",
      order: "navigation",
    },
  };
}

function recentFor(unit, overrides = {}) {
  return {
    moduleId: "politics",
    pointId: unit.id,
    contentVersion: unit.contentVersion,
    lastActivity: "reading",
    goalType: null,
    routeId: null,
    scopeId: null,
    blockId: null,
    updatedAt: 10,
    ...overrides,
  };
}

function recommendedPlan(type) {
  assert.equal(typeof platform.planRecommendedRoute, "function", "missing planRecommendedRoute");
  return platform.planRecommendedRoute(knowledgePackage, type);
}

requirement("source", "AB-SRC-001", "真实政治review包和卡片加工基线完整", () => {
  assert.equal(knowledgePackage.buildTarget, "review");
  assert.equal(knowledgePackage.knowledgeUnits.length, 37);
  assert.equal(knowledgePackage.knowledgeUnits.reduce((total, unit) => total + unit.blocks.length, 0), 643);
  assert.equal(knowledgePackage.knowledgeAtomRefs.length, 313);
  assert.equal(knowledgePackage.knowledgeUnitCardProjections.length, 37);
  assert.equal(knowledgePackage.recallProjections.length, 37);
  assert.equal(knowledgePackage.relations.length, 39);
  assert.equal(knowledgePackage.contrastPairs.length, 5);
  assert.equal(knowledgePackage.knowledgeUnits.filter((unit) => unit.status === "review").length, 37);
  assert.equal(knowledgePackage.knowledgeUnits.filter((unit) => unit.publishable).length, 0);
});

requirement("source", "AB-SRC-002", "routeDefaults进入机器可读moduleProfile且保持冻结值", () => {
  const actual = knowledgePackage.moduleProfile.routeDefaults;
  const expected = routeDefaultsFixture();
  assert.ok(actual, "moduleProfile.routeDefaults missing");
  for (const type of Object.keys(expected)) {
    assert.ok(actual[type]?.reason, `${type}.reason missing`);
    for (const [key, value] of Object.entries(expected[type])) assert.deepEqual(actual[type][key], value, `${type}.${key}`);
  }
});

requirement("source", "AB-SRC-003", "routeDefaults引用全部可达且易混顺序消费正式ContrastPair", () => {
  const defaults = knowledgePackage.moduleProfile.routeDefaults;
  assert.ok(defaults, "route defaults unavailable");
  const nodeIds = new Set(knowledgePackage.navigationNodes.map((node) => node.id));
  const pairRelationIds = new Set(knowledgePackage.contrastPairs.map((pair) => pair.id.replace(/^contrast-pair:/, "relation:").replace(/:(?=[^:]+$)/, ":contrast:")));
  assert.ok(nodeIds.has(defaults.quick.scopeId));
  assert.ok(nodeIds.has(defaults.systematic.scopeId));
  assert.ok(nodeIds.has(defaults.exam.scopeId));
  assert.ok(defaults.quick.anchorNodeIds.length === 6 && defaults.quick.anchorNodeIds.every((id) => nodeIds.has(id)), "quick route anchors must resolve to the six curated navigation nodes");
  assert.ok(defaults.confusion.priorityRelationIds.every((id) => pairRelationIds.has(id)), "profile contrast order contains a non-ContrastPair relation");
});

requirement("source", "AB-SRC-004", "卡片、回忆、关系与ContrastPair引用在同一review包内闭合", () => {
  const unitIds = new Set(knowledgePackage.knowledgeUnits.map((unit) => unit.id));
  const blockIds = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => block.id)));
  const atomIds = new Set(knowledgePackage.knowledgeAtomRefs.map((atom) => atom.id));
  const recallIds = new Set(knowledgePackage.recallProjections.map((recall) => recall.recallItemId));
  for (const card of knowledgePackage.knowledgeUnitCardProjections) {
    assert.ok(unitIds.has(card.pointId), `${card.pointId}: card point missing`);
    assert.ok(card.orderedAtomRefIds.every((id) => atomIds.has(id)), `${card.pointId}: card atom missing`);
  }
  for (const recall of knowledgePackage.recallProjections) {
    assert.ok(unitIds.has(recall.pointId), `${recall.recallItemId}: recall point missing`);
    assert.ok(recall.answerAtomRefIds.every((id) => atomIds.has(id)), `${recall.recallItemId}: recall atom missing`);
    assert.ok(recall.answerSourceBlockIds.every((id) => blockIds.has(id)), `${recall.recallItemId}: recall block missing`);
  }
  for (const relation of knowledgePackage.relations) {
    assert.ok(relation.sourceBlockIds.length && relation.sourceBlockIds.every((id) => blockIds.has(id)), `${relation.id}: source anchor missing`);
    assert.ok(relation.targetBlockIds.length && relation.targetBlockIds.every((id) => blockIds.has(id)), `${relation.id}: target anchor missing`);
  }
  for (const pair of knowledgePackage.contrastPairs) {
    assert.ok(pair.leftAtomRefIds.every((id) => atomIds.has(id)), `${pair.id}: left atom missing`);
    assert.ok(pair.rightAtomRefIds.every((id) => atomIds.has(id)), `${pair.id}: right atom missing`);
    assert.ok(pair.sourceBlockIds.every((id) => blockIds.has(id)), `${pair.id}: source block missing`);
    assert.ok(pair.recallItemIds.every((id) => recallIds.has(id)), `${pair.id}: recall reference missing`);
  }
});

requirement("a", "AB-SRC-005", "A的最近焦点前提能区分有效、失效和无历史", () => {
  assert.equal(typeof platform.resolveRecentModuleContext, "function", "missing resolveRecentModuleContext");
  const unit = knowledgePackage.knowledgeUnits[0];
  assert.equal(platform.resolveRecentModuleContext(knowledgePackage, null).status, "empty");
  assert.equal(platform.resolveRecentModuleContext(knowledgePackage, recentFor(unit)).status, "valid");
  const stale = platform.resolveRecentModuleContext(knowledgePackage, recentFor(unit, { contentVersion: "stale" }));
  assert.equal(stale.status, "invalid");
  assert.equal(stale.reason, "content-version-changed");
});

requirement("a", "AB-SRC-006", "A沿用KnowledgeContext搜索快照且不建立第二套焦点", () => {
  const context = platform.createKnowledgeContext("politics");
  assert.deepEqual(context.snapshots.search, {
    query: "",
    intent: "all",
    resultId: null,
    resultIndex: null,
    scrollAnchorId: null,
    matchEvidence: null,
  });
  const updated = platform.applyContextEvent(knowledgePackage, context, {
    type: "UPDATE_SEARCH_SNAPSHOT",
    snapshot: { query: "矛盾", intent: "contrast", resultId: knowledgePackage.knowledgeUnits[0].id, resultIndex: 2, scrollAnchorId: "result:2", matchEvidence: "contrast" },
    at: 1,
  });
  assert.equal(updated.focus, null);
  assert.equal(updated.snapshots.search.query, "矛盾");
  assert.equal(updated.snapshots.search.resultIndex, 2);
});

requirement("source", "AB-SRC-007", "导航说明和知识小卡均由正式结构稳定派生", () => {
  const root = knowledgePackage.navigationNodes.find((node) => node.id === knowledgePackage.indexes.rootNavigationIds[0]);
  assert.ok(root?.title && root.childIds.length === 2 && root.pointCount === 37);
  assert.ok(knowledgePackage.navigationNodes.every((node) => node.title && node.pathIds.length && Number.isInteger(node.order)));
  const atomIds = new Set(knowledgePackage.knowledgeAtomRefs.map((atom) => atom.id));
  for (const card of knowledgePackage.knowledgeUnitCardProjections) {
    assert.ok(card.orderedAtomRefIds.length >= 3, `${card.pointId}: knowledge atom source unavailable`);
    assert.ok(card.orderedAtomRefIds.every((id) => atomIds.has(id)), `${card.pointId}: invalid atom reference`);
  }
});

requirement("a", "S55A-AC-001", "首页四种状态只产生一个状态主动作", () => {
  assert.equal(typeof platform.projectHomeDecision, "function", "missing projectHomeDecision");
  const unit = knowledgePackage.knowledgeUnits[0];
  const empty = platform.projectHomeDecision(knowledgePackage, {});
  const recent = platform.projectHomeDecision(knowledgePackage, { recent: recentFor(unit) });
  const stale = platform.projectHomeDecision(knowledgePackage, { recent: recentFor(unit, { contentVersion: "stale" }) });
  const plan = recommendedPlan("systematic");
  const session = platform.createRouteSession(plan, 20);
  const route = platform.projectHomeDecision(knowledgePackage, { recent: recentFor(unit), routeRecords: [{ planOptions: { type: "systematic", scopeId: plan.scopeId }, session }] });
  const expiredRoute = platform.projectHomeDecision(knowledgePackage, {
    recent: recentFor(unit),
    routeRecords: [{ planOptions: { type: "systematic", scopeId: plan.scopeId }, session: { ...session, packageVersion: "stale" } }],
  });
  assert.deepEqual([empty.stateId, recent.stateId, stale.stateId, route.stateId], ["first-use", "recent-focus", "invalid-recovery", "active-route"]);
  assert.equal(expiredRoute.stateId, "invalid-recovery");
  assert.equal(expiredRoute.recommendedAction.id, "rebuild-route");
  for (const decision of [empty, recent, stale, route]) assert.ok(decision.recommendedAction && !Array.isArray(decision.recommendedAction));
}, ["S55A-AC-001"]);

requirement("a", "S55A-AC-002", "体系聚合节点只改视窗，具体知识提交统一焦点并直接进入详情", () => {
  const mapJs = read("miniprogram/subpackages/politics/map/index.js");
  const mapWxml = read("miniprogram/subpackages/politics/map/index.wxml");
  assert.ok(mapJs.includes("this.openPoint(pointId, origin"));
  assert.ok(mapJs.includes("/subpackages/politics/detail/index"));
  assert.ok(mapJs.includes('type: "SELECT_POINT"'));
  assert.ok(mapWxml.includes("knowledge-space-surface"));
  assert.ok(!mapWxml.includes("knowledge-card-preview"), "knowledge entry must not stop at a preview card");
}, ["S55A-AC-002"]);

requirement("a", "S55A-AC-003", "详情只渲染一份同源正文并提供底部学习入口", () => {
  const detailJs = read("miniprogram/subpackages/politics/detail/index.js");
  const detailWxml = read("miniprogram/subpackages/politics/detail/index.wxml");
  const cardWxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
  assert.ok(detailWxml.includes("knowledge-card-surface"));
  assert.ok(detailJs.includes("projectKnowledgeCardSurfaceViewModel"));
  const modernity = knowledgePackage.knowledgeUnits.find((item) => item.title.includes("中国式现代化"));
  const modernityCard = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, modernity.id, { activity: "reading" });
  assert.deepEqual(modernityCard.semanticBlocks.map((item) => item.id), modernity.blocks.map((item) => item.id));
  assert.equal(Object.hasOwn(modernityCard, "atoms"), false);
  assert.ok(cardWxml.includes("card.semanticBlocks") && cardWxml.includes("card.relationFooter") && cardWxml.includes("card.recallFace"));
}, ["S55A-AC-003"]);

requirement("a", "S55A-AC-004", "关系抽屉先解释关系且只有选择目标才FOLLOW_RELATION", () => {
  const relation = knowledgePackage.relations[0];
  const context = platform.applyContextEvent(knowledgePackage, platform.createKnowledgeContext("politics"), { type: "SELECT_POINT", pointId: relation.sourcePointId, at: 1 });
  const before = JSON.stringify(context);
  const preview = platform.projectSurfaceDecision(knowledgePackage, context, { kind: "relation-preview", relationId: relation.id });
  assert.equal(JSON.stringify(context), before);
  assert.equal(preview.recommendedAction.event.type, "FOLLOW_RELATION");
  assert.equal(preview.recommendedAction.event.type, "FOLLOW_RELATION");
  const snapshotted = platform.applyContextEvent(knowledgePackage, context, {
    type: "UPDATE_RELATION_SNAPSHOT",
    snapshot: { selectedRelationId: relation.id, lens: "card", viewportToken: "L3" },
    at: 2,
  });
  const followed = platform.applyContextEvent(knowledgePackage, snapshotted, { type: "FOLLOW_RELATION", relationId: relation.id, at: 3 });
  const returned = platform.applyContextEvent(knowledgePackage, followed, { type: "BACK_TRAIL", at: 4 });
  assert.equal(returned.focus.pointId, relation.sourcePointId);
  assert.equal(returned.snapshots.relations.selectedRelationId, relation.id);
  assert.equal(returned.snapshots.relations.viewportToken, "L3");
  const cardWxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
  const detailJs = read("miniprogram/subpackages/politics/detail/index.js");
  assert.ok(cardWxml.includes("item.reason") && cardWxml.includes("handleRelationTap"));
  assert.ok(detailJs.includes('type: "FOLLOW_RELATION"') && detailJs.includes("wx.navigateTo"));
}, ["S55A-AC-004"]);

requirement("a", "S55A-AC-005-007", "搜索结果直接进入、按正式命中决定落点并保留返回快照", () => {
  const result = platform.projectSearchResults(knowledgePackage, knowledgePackage.knowledgeUnits[0].title)[0];
  const context = platform.createKnowledgeContext("politics");
  const before = JSON.stringify(context);
  const decision = platform.projectSurfaceDecision(knowledgePackage, context, { kind: "search-result", result, searchSnapshot: { query: result.title, intent: "definition", resultId: result.pointId, resultIndex: 0, scrollAnchorId: "result:0", matchEvidence: result.matchLabel } });
  assert.equal(JSON.stringify(context), before);
  assert.equal(decision.recommendedAction.event.type, "SELECT_POINT");
  assert.equal(decision.recommendedAction.targetActivity, "reading");
  assert.equal(decision.returnModel.snapshot.search.resultId, result.pointId);
  const location = platform.projectSurfaceDecision(knowledgePackage, context, {
    kind: "search-result",
    result: { ...result, primaryAction: { mode: "system", label: "在知识全景中查看" }, otherActions: [] },
    searchSnapshot: { query: "第一章", intent: "location", resultId: result.pointId, resultIndex: 1, scrollAnchorId: "result:1", matchEvidence: "体系路径命中" },
  });
  assert.equal(location.recommendedAction.commitsFocus, false);
  assert.equal(location.recommendedAction.event.type, "UPDATE_SYSTEM_SNAPSHOT");
  const recallResult = platform.projectSearchResults(knowledgePackage, knowledgePackage.recallProjections[0].prompt, "recall")[0];
  assert.equal(recallResult.primaryAction.mode, "recall");
  const committed = platform.applyContextEvent(knowledgePackage, context, { type: "UPDATE_SEARCH_SNAPSHOT", snapshot: decision.returnModel.snapshot.search, at: 1 });
  const focused = platform.applyContextEvent(knowledgePackage, committed, { ...decision.recommendedAction.event, at: 2 });
  assert.equal(platform.projectReturnModel(knowledgePackage, focused).target, "search");
  const restored = platform.fromRecentModuleContext(knowledgePackage, platform.toRecentModuleContext(knowledgePackage, focused));
  assert.equal(restored.snapshots.search.resultId, result.pointId);
  assert.equal(platform.projectReturnModel(knowledgePackage, restored).target, "search");
  const formalContrastUnits = new Set(knowledgePackage.contrastPairs.flatMap((pair) => [pair.leftPointId, pair.rightPointId]));
  const semanticOnly = knowledgePackage.knowledgeUnits.find((item) => item.blocks.some((block) => block.semantic === "contrast") && !formalContrastUnits.has(item.id));
  const contrastBlock = semanticOnly?.blocks.find((block) => block.semantic === "contrast");
  const contrastQuery = String(contrastBlock?.fallbackText || "").match(/[\u4e00-\u9fff]{2,8}/)?.[0];
  const contrastResult = contrastQuery ? platform.projectSearchResults(knowledgePackage, contrastQuery, "contrast").find((item) => item.pointId === semanticOnly.id) : null;
  assert.ok(contrastResult, "semantic-only contrast fixture missing");
  assert.equal(contrastResult.primaryAction.mode, "reading", "contrast without formal ContrastPair must degrade to reading");
  const searchJs = read("miniprogram/subpackages/politics/search/index.js");
  const searchWxml = read("miniprogram/subpackages/politics/search/index.wxml");
  const detailJs = read("miniprogram/subpackages/politics/detail/index.js");
  assert.ok(searchJs.includes("this.openResult(result, resultIndex)"));
  assert.ok(!searchWxml.includes("politics-search-preview"), "search preview drawer must be removed");
  const detailWxml = read("miniprogram/subpackages/politics/detail/index.wxml");
  assert.ok(detailJs.includes("pendingBlockId") && detailWxml.includes('id="knowledge-card"'), "matched block has no exact detail target");
  assert.ok(detailJs.includes('selectComponent("#knowledge-card")') && detailJs.includes("wx.createSelectorQuery().in(component).select(") && detailJs.includes("scrollTop: Math.max("), "matched block is not located within the shared card before page scroll");
}, ["S55A-AC-005", "S55A-AC-006", "S55A-AC-007"]);

requirement("a", "S55A-AC-008", "四类目标先生成系统推荐并投影持续GoalGuide", () => {
  assert.equal(typeof platform.projectGoalGuide, "function", "missing projectGoalGuide");
  for (const type of ["quick", "systematic", "confusion", "exam"]) {
    const plan = recommendedPlan(type);
    assert.ok(plan?.steps.length, `${type} recommended plan missing`);
    assert.ok(plan.basis.some((item) => item.kind === "profile-default"), `${type} missing profile basis`);
    const guide = platform.projectGoalGuide(plan, platform.createRouteSession(plan, 1));
    assert.equal(guide.routeType, type);
    assert.ok(guide.purpose && guide.instruction);
    assert.equal(type === "quick" ? guide.completionEvent === null : Boolean(guide.completionEvent), true, `${type}: completion event contract changed`);
    assert.ok(guide.currentStepId);
  }
}, ["S55A-AC-008"]);

requirement("a", "S55A-AC-009-010", "回忆保持提示、揭晓、回答、补救和原题返回状态", () => {
  assert.equal(typeof platform.projectRecallViewModel, "function", "missing projectRecallViewModel");
  const projection = knowledgePackage.recallProjections[0];
  const hidden = platform.projectRecallViewModel(knowledgePackage, projection.pointId, { recallItemId: projection.recallItemId });
  assert.equal(hidden.state, "prompt");
  assert.equal(hidden.answer, null);
  assert.equal(hidden.primaryAction.id, "reveal");
  const revealed = platform.projectRecallViewModel(knowledgePackage, projection.pointId, { recallItemId: projection.recallItemId, revealed: true, response: "fuzzy", remedyStep: "source" });
  assert.equal(revealed.state, "revealed");
  assert.equal(revealed.recallItemId, projection.recallItemId);
  assert.ok(revealed.answer);
  assert.equal(revealed.remedyStep, "source");
  assert.equal(revealed.returnTarget.recallItemId, projection.recallItemId);
  assert.equal(revealed.primaryAction.id, "complete-recall");
  assert.deepEqual(revealed.responseOptions.map((item) => item.id), ["remembered", "fuzzy", "missed", "skipped"]);
  const awaitingResponse = platform.projectRecallViewModel(knowledgePackage, projection.pointId, { recallItemId: projection.recallItemId, revealed: true });
  assert.equal(awaitingResponse.primaryAction, null);
  let remedyContext = platform.applyContextEvent(knowledgePackage, platform.createKnowledgeContext("politics"), { type: "SELECT_POINT", pointId: projection.pointId, at: 1 });
  remedyContext = platform.applyContextEvent(knowledgePackage, remedyContext, { type: "SWITCH_ACTIVITY", activity: "recall", at: 2 });
  remedyContext = platform.applyContextEvent(knowledgePackage, remedyContext, {
    type: "OPEN_SOURCE_BLOCK",
    blockId: projection.returnTarget.blockId,
    returnTarget: { activity: "recall", recallItemId: projection.recallItemId, revealed: true, response: "fuzzy", remedyStep: "source" },
    at: 3,
  });
  const persistedRemedy = platform.fromRecentModuleContext(knowledgePackage, platform.toRecentModuleContext(knowledgePackage, remedyContext));
  assert.equal(persistedRemedy.returnTarget.recallItemId, projection.recallItemId);
  const returnedRemedy = platform.applyContextEvent(knowledgePackage, persistedRemedy, { type: "RETURN_FROM_SOURCE", at: 4 });
  assert.equal(returnedRemedy.activity, "recall");
  const otherPoint = knowledgePackage.knowledgeUnits.find((item) => item.id !== projection.pointId);
  let crossPoint = platform.applyContextEvent(knowledgePackage, remedyContext, {
    type: "OPEN_REMEDY",
    activity: "relations",
    returnTarget: { pointId: projection.pointId, activity: "recall", recallItemId: projection.recallItemId, revealed: true, response: "fuzzy", remedyStep: "contrast", trailLength: 0, source: "recall" },
    at: 5,
  });
  crossPoint = { ...crossPoint, focus: { ...crossPoint.focus, pointId: otherPoint.id, navigationNodeId: otherPoint.navigationNodeId, contentVersion: otherPoint.contentVersion } };
  const restoredPoint = platform.applyContextEvent(knowledgePackage, crossPoint, { type: "RETURN_FROM_SOURCE", at: 6 });
  assert.equal(restoredPoint.focus.pointId, projection.pointId);
  const detailSource = read("miniprogram/subpackages/politics/detail/index.js");
  const cardTemplate = read("miniprogram/components/knowledge-card-surface/index.wxml");
  assert.ok(detailSource.includes("handleStartRecall") && detailSource.includes("handleReveal") && detailSource.includes("handleBackToReading"));
  assert.ok(cardTemplate.includes("recallView") && cardTemplate.includes("回到完整正文核对"));
}, ["S55A-AC-009", "S55A-AC-010"]);

requirement("a", "S55A-AC-011", "显示、来源与反馈是无状态竞争的上下文工具", () => {
  const context = platform.createKnowledgeContext("politics");
  const before = JSON.stringify(context);
  const decision = platform.projectSurfaceDecision(knowledgePackage, context, { kind: "context-tools" });
  assert.equal(JSON.stringify(context), before);
  assert.equal(decision.recommendedAction, null);
  assert.deepEqual(decision.contextTools.map((item) => item.id), ["display", "source-feedback"]);
}, ["S55A-AC-011"]);

requirement("a", "S55A-AC-012-013", "页面栈返回保持微信标准行为且连续表面无第二套持久焦点", () => {
  assert.equal(typeof platform.projectReturnModel, "function", "missing projectReturnModel");
  const context = platform.createKnowledgeContext("politics");
  context.origin = { type: "search", refId: "search:矛盾" };
  context.snapshots.search = { query: "矛盾", intent: "all", resultId: knowledgePackage.knowledgeUnits[0].id, resultIndex: 0, scrollAnchorId: "result:0", matchEvidence: "正文命中" };
  assert.equal(platform.projectReturnModel(knowledgePackage, context).target, "search");
  const mapSource = read("miniprogram/subpackages/politics/map/index.js");
  const mapWxml = read("miniprogram/subpackages/politics/map/index.wxml");
  assert.ok(!mapWxml.includes("handleContextBack") && !mapWxml.includes("handleBackTrail"));
  assert.ok(mapWxml.includes("handleSurfaceBack"), "branch expansion needs an explicit semantic return");
  assert.ok(!mapSource.includes("wx.navigateBack"), "KnowledgeSurface must leave page-stack return to the WeChat navigation bar");
  for (const relative of [
    "miniprogram/pages/politics/index.js",
    "miniprogram/subpackages/politics/map/index.js",
    "miniprogram/subpackages/politics/detail/index.js",
    "miniprogram/subpackages/politics/search/index.js",
  ]) {
    const source = read(relative);
    assert.ok(!/setStorageSync\([^\n]*(currentPoint|currentActivity|currentRoute|fromPage)/.test(source), `${relative}: second persistent state`);
  }
}, ["S55A-AC-012", "S55A-AC-013"]);

requirement("a", "S55A-PAGE", "政治首页和搜索页消费统一决策投影", () => {
  const homeJs = read("miniprogram/pages/politics/index.js");
  const searchJs = read("miniprogram/subpackages/politics/search/index.js");
  const mapJs = read("miniprogram/subpackages/politics/map/index.js");
  assert.ok(homeJs.includes("projectHomeDecision"));
  assert.ok(searchJs.includes("projectSurfaceDecision"));
  assert.ok(searchJs.includes("resultId") && searchJs.includes("resultIndex"), "search result snapshot must restore the selected result");
  assert.ok(mapJs.includes("projectKnowledgeSpaceViewModel"));
  const homeWxml = read("miniprogram/pages/politics/index.wxml");
  const searchWxml = read("miniprogram/subpackages/politics/search/index.wxml");
  assert.ok(homeWxml.includes("搜索知识，或问") && homeWxml.includes("上次学习：") && homeWxml.includes("handleRecentDismiss"));
  assert.ok(!searchWxml.includes("politics-search-path") && !searchWxml.includes("politics-search-card-summary") && !searchWxml.includes("直接打开 ›"));
});

requirement("a", "S55A-AC-015", "窄屏与可访问名称保留主动作和系统返回", () => {
  const files = [
    read("miniprogram/pages/politics/index.wxml"),
    read("miniprogram/subpackages/politics/map/index.wxml"),
    read("miniprogram/subpackages/politics/detail/index.wxml"),
  ].join("\n");
  assert.ok(files.includes("aria-label"));
  const styles = [
    read("miniprogram/pages/politics/index.wxss"),
    read("miniprogram/subpackages/politics/map/index.wxss"),
    read("miniprogram/subpackages/politics/detail/index.wxss"),
  ].join("\n");
  assert.ok(/overflow-x:\s*hidden/.test(styles));
  assert.ok(/min-height:\s*(88rpx|44px)/.test(styles), "interactive target budget missing");
}, ["S55A-AC-015"]);

requirement("a", "S55A-AC-016", "自由地形、快速了解和系统学习产生不同序列", () => {
  const quick = recommendedPlan("quick");
  const systematic = recommendedPlan("systematic");
  assert.equal(quick.type, "quick");
  assert.equal(systematic.type, "systematic");
  assert.ok(quick.steps.length && systematic.steps.length);
  assert.notEqual(quick.scopeId, systematic.scopeId);
  assert.notDeepEqual(quick.steps, systematic.steps);
  assert.notDeepEqual(quick.frozenOrder, systematic.frozenOrder);
}, ["S55A-AC-016"]);

requirement("b", "S55B-AC-001-004", "KnowledgeSpace只承载全览、分支和递归目录，KnowledgeCard使用独立详情", () => {
  assert.equal(typeof platform.projectKnowledgeSpaceViewModel, "function", "missing projectKnowledgeSpaceViewModel");
  const branchId = "politics-toc-v2-n003";
  const states = [
    { surfaceState: "overview" },
    { surfaceState: "branch", expandedBranchId: branchId, viewportToken: "L1", scrollAnchorId: "knowledge-node-politics-toc-v2-n004" },
    { surfaceState: "full", expandedBranchId: branchId },
    { surfaceState: "recall", expandedBranchId: branchId },
  ].map((state) => platform.projectKnowledgeSpaceViewModel(knowledgePackage, platform.createKnowledgeContext("politics"), state));
  assert.deepEqual(states.map((item) => item.surfaceState), ["overview", "branch", "overview", "overview"]);
  assert.ok(states[1].overviewContext && states[1].directoryRows.length === 42);
  assert.equal(states[1].overviewContext.regions.filter((item) => item.active).length, 1, "global region rail must retain one active region");
  assert.ok(states[1].overviewContext.regions.some((item) => item.compressed), "top-level sibling region must remain present in the region rail");
  assert.ok(states[1].branch.groups.flatMap((group) => group.items).length, "branch must expose exact knowledge entries");
  assert.equal(states[1].branch.path.length, 0, "branch path must not repeat module root, current branch or active top-level region");
  assert.equal(states[1].viewport.scrollAnchorId, "knowledge-node-politics-toc-v2-n004");
  assert.equal(states[1].viewport.expandedBranchId, branchId);
  const walk = (node) => node ? [node, ...(node.children || []).flatMap(walk)] : [];
  assert.equal(walk(states[0].directoryTree).length, 42);
}, ["S55B-AC-001", "S55B-AC-002", "S55B-AC-003", "S55B-AC-004"]);

requirement("b", "S55B-AC-005", "KnowledgeCard只消费同源卡片投影并保留完整正文顺序", () => {
  const unit = knowledgePackage.knowledgeUnits[0];
  const vm = platform.projectKnowledgeCardViewModel(knowledgePackage, unit.id, { mode: "full" });
  const projection = knowledgePackage.knowledgeUnitCardProjections.find((item) => item.pointId === unit.id);
  assert.deepEqual(vm.atoms.map((item) => item.id), projection.orderedAtomRefIds);
  assert.deepEqual(vm.content.map((item) => item.id), unit.blocks.map((item) => item.id));
  assert.equal(vm.content.length, unit.blocks.length);
}, ["S55B-AC-005"]);

requirement("b", "S55B-AC-006-007", "回忆与易混只消费RecallProjection和正式ContrastPair", () => {
  const recall = knowledgePackage.recallProjections[0];
  const recallVm = platform.projectKnowledgeCardViewModel(knowledgePackage, recall.pointId, { mode: "recall" });
  assert.equal(recallVm.recall.recallItemId, recall.recallItemId);
  assert.deepEqual(recallVm.recall.answerAtomRefIds, recall.answerAtomRefIds);
  for (const pair of recallVm.contrastPairs) assert.ok(knowledgePackage.contrastPairs.some((item) => item.id === pair.id));
}, ["S55B-AC-006", "S55B-AC-007"]);

requirement("b", "S55B-AC-008", "运行时不依赖Obsidian、插件、base或canvas", () => {
  const runtimeSources = [
    read("miniprogram/services/knowledge-platform/politics-runtime.js"),
    read("miniprogram/services/knowledge-platform/politics-adapter.js"),
    read("miniprogram/services/knowledge-platform/projectors.js"),
  ].join("\n");
  assert.ok(!/\.obsidian|\.base|\.canvas|require\([^)]*obsidian/i.test(runtimeSources));
}, ["S55B-AC-008"]);

requirement("b", "S55B-P01-P07", "知识空间页面消费唯一空间和卡片ViewModel且不读取旧事实源", () => {
  const mapJs = read("miniprogram/subpackages/politics/map/index.js");
  const mapWxml = read("miniprogram/subpackages/politics/map/index.wxml");
  const spaceWxml = read("miniprogram/components/knowledge-space-surface/index.wxml");
  const cardWxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
  const detailJs = read("miniprogram/subpackages/politics/detail/index.js");
  assert.ok(mapJs.includes("projectKnowledgeSpaceViewModel"));
  assert.ok(mapWxml.includes("knowledge-space-surface"));
  for (const marker of ["space.overviewContext", "space.directoryRows", "space.branch.groups", "handleBack"]) assert.ok(spaceWxml.includes(marker), `shared space missing ${marker}`);
  assert.ok(detailJs.includes("projectKnowledgeCardSurfaceViewModel") && cardWxml.includes("card.semanticBlocks"));
  assert.ok(!mapWxml.includes("surfaceState === 'preview'"));
  assert.ok(!mapWxml.includes("knowledge-card-preview"));
  assert.ok(mapJs.includes("/subpackages/politics/detail/index"));
  assert.ok(!detailJs.includes("sourcePackage.points"));
  assert.ok(!detailJs.includes("function sourcePoint"));
  assert.ok(!mapJs.includes("knowledgeUnitCardProjections.find"), "page must not resolve card facts itself");
}, ["S55B-P01", "S55B-P02", "S55B-P03", "S55B-P04", "S55B-P05", "S55B-P06", "S55B-P07"]);

requirement("b", "S55AB-ISOLATION", "A/B保持政治candidate、常识笔记和发布边界", () => {
  assert.equal(platform.getRolloutStage("politics"), "candidate");
  assert.equal(platform.getRolloutStage("common-sense"), "legacy");
  assert.equal(platform.getRolloutStage("notes"), "legacy");
  assert.equal(knowledgePackage.buildTarget, "review");
  assert.equal(knowledgePackage.knowledgeUnits.filter((item) => item.publishable).length, 0);
  for (const relative of ["miniprogram/pages/common-sense/index.js", "miniprogram/pages/note/index/index.js"]) {
    assert.ok(!read(relative).includes("knowledge-platform"), `${relative}: legacy module isolation broken`);
  }
}, ["S55A-AC-014"]);

requirement("source", "AB-GATE-COVERAGE", "门禁覆盖S5.5A、S5.5B及B形态全部已确认验收ID", () => {
  const expected = [
    ...Array.from({ length: 16 }, (_, index) => `S55A-AC-${String(index + 1).padStart(3, "0")}`),
    ...Array.from({ length: 8 }, (_, index) => `S55B-AC-${String(index + 1).padStart(3, "0")}`),
    ...Array.from({ length: 7 }, (_, index) => `S55B-P${String(index + 1).padStart(2, "0")}`),
  ];
  const actual = [...new Set(checks.flatMap((item) => item.covers))].sort();
  assert.deepEqual(actual, expected.sort());
});

const selected = checks.filter((item) => requestedGate === "all" || item.gate === requestedGate);
const results = selected.map((item) => {
  try {
    item.verify();
    return { requirementId: item.id, gate: item.gate, status: "passed", description: item.description };
  } catch (error) {
    return { requirementId: item.id, gate: item.gate, status: "failed", description: item.description, failureReason: error.message };
  }
});

const summary = {
  gate: requestedGate,
  scope: {
    included: ["source", "a", "b"],
    excluded: ["c", "d"],
    auditBasis: ["source-material-readiness", "S55A-AC-001..016", "S55B-AC-001..008", "S55B-P01..P07"],
  },
  status: results.every((item) => item.status === "passed") ? "passed" : "failed",
  passed: results.filter((item) => item.status === "passed").length,
  failed: results.filter((item) => item.status === "failed").length,
  results,
};

console.log(JSON.stringify(summary, null, 2));
if (!reportOnly && summary.status === "failed") process.exitCode = 1;
