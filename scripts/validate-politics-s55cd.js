#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repo = path.resolve(__dirname, "..");
const platform = require(path.join(repo, "miniprogram/services/knowledge-platform"));
const { knowledgePackage } = require(path.join(repo, "miniprogram/services/knowledge-platform/politics-runtime"));

const requestedGate = process.argv.find((argument) => argument.startsWith("--gate="))?.slice(7) || "all";
const reportOnly = process.argv.includes("--report");
assert.ok(new Set(["c", "d", "all"]).has(requestedGate), `unknown gate: ${requestedGate}`);

const checks = [];
function requirement(gate, id, description, verify, covers = []) {
  checks.push({ gate, id, description, verify, covers });
}

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), "utf8");
}

function recommended(type, context = {}) {
  const plan = platform.planRecommendedRoute(knowledgePackage, type, context);
  assert.ok(plan, `${type}: recommended plan missing`);
  return plan;
}

function sessionAt(plan, index, overrides = {}) {
  return {
    ...platform.createRouteSession(plan, 1),
    currentIndex: index,
    currentStepId: plan.steps[index]?.stepId || null,
    ...overrides,
  };
}

const learnerSurfaceFiles = [
  "miniprogram/pages/politics/index.wxml",
  "miniprogram/subpackages/politics/map/index.wxml",
  "miniprogram/subpackages/politics/search/index.wxml",
  "miniprogram/subpackages/politics/route/guided-route.wxml",
  "miniprogram/components/knowledge-space-surface/index.wxml",
  "miniprogram/components/knowledge-card-surface/index.wxml",
  "miniprogram/pages/politics/index.json",
  "miniprogram/subpackages/politics/map/index.json",
  "miniprogram/subpackages/politics/search/index.json",
  "miniprogram/subpackages/politics/route/index.json",
];

requirement("c", "S55C-AC-001", "首页主视觉后呈现搜索、状态恢复和四条学习路线", () => {
  const wxml = read("miniprogram/pages/politics/index.wxml");
  assert.ok(wxml.includes("搜索考点、概念或问题"));
  assert.equal((wxml.match(/handleDailyTap/g) || []).length, 1);
  assert.ok(wxml.includes("dailyCard") && wxml.includes('wx:for="{{routeCards}}"'));
  assert.ok(wxml.indexOf("politics-hero") < wxml.indexOf("politics-search") && wxml.indexOf("politics-search") < wxml.indexOf("politics-routes-head"));
  assert.ok(!/上下文工具|ActivityDock|L[0-3]/.test(wxml));
}, ["S55C-AC-001"]);

requirement("c", "S55C-AC-002", "同一知识空间按认知深度增加知识而非工程术语", () => {
  const mapWxml = read("miniprogram/subpackages/politics/map/index.wxml");
  const spaceWxml = read("miniprogram/components/knowledge-space-surface/index.wxml");
  const cardWxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
  assert.ok(mapWxml.includes("knowledge-space-surface"));
  for (const marker of ["space.overviewContext", "space.branch", "space.directoryRows"]) assert.ok(spaceWxml.includes(marker));
  assert.ok(cardWxml.includes("card.semanticBlocks") && cardWxml.includes("recallView"));
  assert.ok(!mapWxml.includes("surfaceState === 'preview'"), "removed card preview must not return as a visible state");
  const surface = learnerSurfaceFiles.map(read).join("\n");
  assert.ok(!/\b(?:L0|L1|L2|L3|schema|blockId|canonical|review|approved|release|package|build|hash|ActivityStage|KnowledgeUnit|NavigationNode)\b/i.test(surface));
  assert.ok(!/上下文工具|构建包|风险页|适配器/.test(surface));
}, ["S55C-AC-002"]);

requirement("c", "S55C-AC-003", "正式知识、学习引导、信任来源和诊断声音由纯投影分层", () => {
  assert.equal(typeof platform.projectSurfaceLanguage, "function", "missing projectSurfaceLanguage");
  const unit = knowledgePackage.knowledgeUnits[0];
  const card = platform.projectKnowledgeCardViewModel(knowledgePackage, unit.id, { mode: "full" });
  const language = platform.projectSurfaceLanguage(knowledgePackage, { surfaceState: "full", card });
  assert.equal(language.canonical.title, unit.title);
  assert.equal(language.canonical.summary, unit.summary);
  assert.ok(language.guide.location && language.guide.primaryAction);
  assert.ok(language.trust.statusLabel && language.trust.entryLabel);
  assert.equal(language.diagnostic, null);
}, ["S55C-AC-003"]);

requirement("c", "S55C-AC-004", "工具只在对象、能力、数据和意图同时成立时出现", () => {
  assert.equal(typeof platform.projectContextTools, "function", "missing projectContextTools");
  const withEverything = knowledgePackage.knowledgeUnits.find((unit) => unit.relationIds.length && unit.recallItemIds.length);
  const card = platform.projectKnowledgeCardViewModel(knowledgePackage, withEverything.id, { mode: "full" });
  assert.deepEqual(platform.projectContextTools(knowledgePackage, { surfaceState: "overview" }), []);
  assert.deepEqual(platform.projectContextTools(knowledgePackage, { surfaceState: "recall", card }), []);
  const recallTools = platform.projectContextTools(knowledgePackage, { surfaceState: "recall", card, recallResponse: "missed" });
  assert.deepEqual(recallTools.map((item) => item.id), ["recall-source"]);
  assert.equal(recallTools[0].role, "primary");
  const tools = platform.projectContextTools(knowledgePackage, { surfaceState: "full", card });
  assert.deepEqual(tools.map((item) => item.id), ["display", "source-feedback", "recall", "relations"]);
  assert.equal(tools.filter((item) => item.role === "primary").length, 1);
  assert.equal(tools.filter((item) => item.role === "secondary").length <= 2, true);
  assert.equal(tools.filter((item) => item.role === "trust").length, 1);
  assert.ok(!platform.projectContextTools(knowledgePackage, { surfaceState: "full", card: { ...card, recall: null, relationContext: [] } }).some((item) => ["recall", "relations"].includes(item.id)));
  const shared = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, withEverything.id, { activity: "reading" });
  assert.ok(shared.relationFooter && shared.recallFace);
  const reduced = JSON.parse(JSON.stringify(knowledgePackage));
  const reducedUnit = reduced.knowledgeUnits.find((item) => item.id === withEverything.id);
  reducedUnit.relationIds = [];
  reducedUnit.recallItemIds = [];
  reduced.indexes.relationIdsByPointId[withEverything.id] = [];
  reduced.indexes.recallItemIdsByPointId[withEverything.id] = [];
  reduced.relations = reduced.relations.filter((item) => item.sourcePointId !== withEverything.id && item.targetPointId !== withEverything.id);
  reduced.recallProjections = reduced.recallProjections.filter((item) => item.pointId !== withEverything.id);
  const unavailable = platform.projectKnowledgeCardSurfaceViewModel(reduced, withEverything.id, { activity: "reading" });
  assert.equal(unavailable.relationFooter, null);
  assert.equal(unavailable.recallFace, null);
}, ["S55C-AC-004"]);

requirement("c", "S55C-AC-005", "来源默认克制且展开内容不泄漏内部字段", () => {
  const unit = knowledgePackage.knowledgeUnits[0];
  const card = platform.projectKnowledgeCardViewModel(knowledgePackage, unit.id, { mode: "full" });
  const language = platform.projectSurfaceLanguage(knowledgePackage, { surfaceState: "full", card });
  assert.equal(language.trust.notice, "已核对");
  assert.ok(card.sources.length);
  assert.ok(card.sources.every((source) => !Object.keys(source).some((key) => /path|hash|schema|block|package|risk|reviewerState/i.test(key))));
  const wxml = read("miniprogram/subpackages/politics/detail/index.wxml");
  assert.ok(wxml.includes('sourceVisible && cardSurface') && wxml.includes('aria-label="来源与内容状态"'));
  assert.ok(wxml.includes('cardSurface.sources') && wxml.includes('item.sourceName') && wxml.includes('item.sourcePagesText'));
  assert.ok(!/sourceHash|sourceFile|reviewState|riskPages/.test(wxml));
}, ["S55C-AC-005"]);

requirement("c", "S55C-AC-006", "缺失能力和失效状态给出人类原因与单一恢复动作", () => {
  assert.equal(typeof platform.projectSurfaceRecovery, "function", "missing projectSurfaceRecovery");
  for (const reason of ["relations-missing", "recall-missing", "anchor-missing", "route-expired", "focus-invalid", "data-unavailable"]) {
    const recovery = platform.projectSurfaceRecovery(reason);
    assert.ok(recovery.message && recovery.action?.label, reason);
    assert.ok(!/schema|route invalid|anchor missing|package|build|hash/i.test(`${recovery.message} ${recovery.action.label}`));
  }
}, ["S55C-AC-006"]);

requirement("c", "S55C-AC-007", "可见动作与无障碍名称使用完整用户语言和明确返回目的地", () => {
  const wxml = [read("miniprogram/subpackages/politics/map/index.wxml"), read("miniprogram/subpackages/politics/search/index.wxml"), read("miniprogram/subpackages/politics/route/guided-route.wxml"), read("miniprogram/components/knowledge-space-surface/index.wxml"), read("miniprogram/components/knowledge-card-surface/index.wxml")].join("\n");
  assert.ok(wxml.includes("aria-label"));
  assert.ok(wxml.includes('bindtap="handlePointTap"') && wxml.includes("打开正文"));
  assert.ok(wxml.includes("揭晓答案"));
  assert.ok(wxml.includes('aria-label="核对答案原文"') && wxml.includes('bindtap="handleBackToReading"'));
  const branchId = "politics-toc-v2-n024";
  const context = platform.createKnowledgeContext("politics");
  const branch = platform.projectKnowledgeSpaceViewModel(knowledgePackage, context, { surfaceState: "branch", expandedBranchId: branchId });
  assert.equal(branch.contextBar.backLabel, "返回完整全景");
  assert.ok(!/aria-label="[^"]*(?:L[0-3]|review|blockId|ActivityStage)/i.test(wxml));
}, ["S55C-AC-007"]);

requirement("c", "S55C-AC-008", "共享动词由平台拥有且政治名词不改变常识、笔记和主导航", () => {
  assert.ok(platform.platformSurfaceCopy?.actions?.view === "查看", "shared surface copy missing");
  for (const key of ["openFocus", "openReading", "sourceTools"]) assert.equal(knowledgePackage.moduleProfile.surfaceCopy[key], undefined, `politics duplicates ${key}`);
  assert.equal(platform.getRolloutStage("common-sense"), "legacy");
  assert.equal(platform.getRolloutStage("notes"), "legacy");
  assert.ok(!read("miniprogram/pages/common-sense/index.js").includes("politics"));
  assert.ok(!read("miniprogram/pages/note/index/index.js").includes("politics"));
}, ["S55C-AC-008"]);

requirement("c", "S55C-AC-009", "来源、反馈和显示偏好不改变焦点、Trail、RouteSession或viewport", () => {
  const context = platform.createKnowledgeContext("politics");
  const before = JSON.stringify(context);
  const tools = platform.projectContextTools(knowledgePackage, { surfaceState: "full", card: platform.projectKnowledgeCardViewModel(knowledgePackage, knowledgePackage.knowledgeUnits[0].id, { mode: "full" }) });
  assert.ok(tools.length);
  assert.equal(JSON.stringify(context), before);
  assert.ok(tools.filter((tool) => ["display", "source-feedback"].includes(tool.id)).every((tool) => tool.mutatesKnowledgeState === false));
  assert.ok(!/setStorageSync\([^\n]*(focus|trail|route|viewport)/i.test(read("miniprogram/subpackages/politics/map/index.js")));
}, ["S55C-AC-009"]);

requirement("d", "S55D-AC-001", "四目标进入即有profile推荐与一个开始或继续主动作", () => {
  assert.equal(typeof platform.projectRouteStart, "function", "missing projectRouteStart");
  for (const type of platform.ROUTE_TYPES) {
    const plan = recommended(type);
    const start = platform.projectRouteStart(plan, null);
    assert.ok(plan.recommendationReason && start.primaryAction);
    assert.ok(start.details && Object.keys(start.details).length, `${type}: start details missing`);
    assert.equal(start.secondaryActions.length <= 2, true);
    assert.ok(!start.requiresSelection);
  }
  const wxml = read("miniprogram/subpackages/politics/route/guided-route.wxml");
  assert.ok(!/请先选择|选择系统学习范围|选择一组易混知识|选择回忆范围/.test(wxml));
  assert.ok(wxml.includes("route.experience.quickPrimer.sections") && wxml.includes("本次范围") && wxml.includes("学习顺序") && wxml.includes("start.details.contrastPair") && wxml.includes("张回忆卡"));
  assert.ok(platform.projectRouteScopeOptions(knowledgePackage, "quick").every((item) => knowledgePackage.navigationNodes.find((node) => node.id === item.id)?.type === "article"));
}, ["S55D-AC-001"]);

requirement("d", "S55D-AC-002", "快速了解使用六单元轻量全貌导读，不以目录站点通行", () => {
  const plan = recommended("quick");
  assert.deepEqual(plan.steps.map((step) => step.sectionId), Array.from({ length: 6 }, (_, index) => `J2V4-SEC-${String(index + 1).padStart(2, "0")}`));
  assert.equal(plan.steps.length, 6);
  assert.equal(plan.steps.filter((step) => step.pointId).length, 0);
  assert.ok(plan.steps.every((step) => step.subject === "quick-primer" && step.eventType === "VIEW_QUICK_SECTION"));
  assert.equal(plan.completionRule, "explicit-quick-primer-finish");
}, ["S55D-AC-002"]);

requirement("d", "S55D-AC-003", "系统学习在阅读页展示定位提示，并由阅读和回忆两阶段连续推进", () => {
  const plan = recommended("systematic");
  assert.ok(!plan.steps.some((step) => step.activity === "relations"));
  assert.deepEqual(plan.steps.slice(0, 2).map((step) => step.stage), ["reading", "recall"]);
  assert.ok(Array.isArray(plan.steps[0].relationContextIds));
  assert.ok(Array.isArray(plan.startProjection.knowledgeTitles) && plan.startProjection.knowledgeTitles.length === plan.startProjection.knowledgeCount);
  const routeJs = read("miniprogram/subpackages/politics/route/guided-route.js");
  const routeWxml = read("miniprogram/subpackages/politics/route/guided-route.wxml");
  const sharedCardWxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
  assert.ok(sharedCardWxml.includes("card.identity.pathText") && routeWxml.includes('card="{{currentCard}}"'));
  assert.ok(routeWxml.includes("route.experience.systematic.orientation.outsidePrerequisites.length") && routeWxml.includes("start.details.outsidePrerequisites"));
  assert.ok(routeWxml.includes('bind:relationtap="handleSystemRelation"') && routeJs.includes("handleSystemRelation(event)"));
  assert.ok(!routeJs.includes('cardFor(current?.pointId, "preview")'));
  assert.ok(!routeWxml.includes("previewAtoms") && !routeWxml.includes("完整学习这个知识"));
  assert.ok(routeWxml.includes("knowledge-card-surface"), "systematic reading must use the full shared card surface");
}, ["S55D-AC-003"]);

requirement("d", "S55D-AC-004", "系统学习由明确阅读与回忆事件直接推进而非通用完成按钮", () => {
  const plan = recommended("systematic");
  let session = platform.createRouteSession(plan, 1);
  assert.equal(plan.steps[session.currentIndex].stage, "reading");
  session = platform.applyRouteSessionEvent(plan, session, { type: "COMPLETE_READING_STEP", at: 3 });
  assert.equal(plan.steps[session.currentIndex].stage, "recall");
  assert.ok(!read("miniprogram/subpackages/politics/route/guided-route.js").includes("COMPLETE_STEP"));
}, ["S55D-AC-004"]);

requirement("d", "S55D-AC-005", "易混推荐按当前焦点再按profile正式顺序且理由可解释", () => {
  const defaultPlan = recommended("confusion");
  const priority = knowledgePackage.moduleProfile.routeDefaults.confusion.priorityRelationIds;
  assert.deepEqual(defaultPlan.recommendationQueue, priority);
  assert.equal(defaultPlan.steps[0].relationId, priority[0]);
  const relation = knowledgePackage.relations.find((item) => item.type === "contrast" && item.id !== priority[0]);
  const focused = recommended("confusion", { currentPointId: relation.sourcePointId });
  assert.equal(focused.steps[0].relationId, relation.id);
  assert.ok(/当前知识|正式顺序|推荐/.test(focused.recommendationReason));
  assert.ok(!/薄弱|容易错|预测|发现你/.test(focused.recommendationReason));
}, ["S55D-AC-005"]);

requirement("d", "S55D-AC-006", "易混消费正式ContrastPair并按能力生成判断、边界、证据、再辨四段", () => {
  const plan = recommended("confusion");
  assert.equal(plan.capabilityLevel, "contrastRecallReady");
  assert.deepEqual(plan.steps.map((step) => step.stage), ["judgment", "boundary", "evidence", "retest"]);
  assert.ok(plan.steps.every((step) => step.contrastPairId));
  assert.ok(knowledgePackage.contrastPairs.some((pair) => pair.id === plan.steps[0].contrastPairId));
}, ["S55D-AC-006"]);

requirement("d", "S55D-AC-007", "速记揭晓、自评、补救和下一张均保存在RouteSession", () => {
  const plan = recommended("exam");
  let session = platform.createRouteSession(plan, 1);
  const stepId = session.currentStepId;
  session = platform.applyRouteSessionEvent(plan, session, { type: "REVEAL_RECALL", at: 2 });
  assert.ok(session.revealedStepIds.includes(stepId));
  session = platform.applyRouteSessionEvent(plan, session, { type: "RECALL_RESULT", result: "missed", at: 3 });
  assert.equal(session.currentStepId, stepId, "missed must stay for remedy");
  assert.equal(session.responseByStepId[stepId], "missed");
  session = platform.applyRouteSessionEvent(plan, session, { type: "VIEW_REMEDY", stepId, at: 4 });
  assert.ok(session.reviewedStepIds.includes(stepId));
  session = platform.applyRouteSessionEvent(plan, session, { type: "NEXT_RECALL_CARD", at: 5 });
  assert.notEqual(session.currentStepId, stepId);
}, ["S55D-AC-007"]);

requirement("d", "S55D-AC-008", "四类完成投影分别报告目标事实和不同主动作", () => {
  const titles = [];
  const actions = [];
  for (const type of platform.ROUTE_TYPES) {
    const plan = recommended(type);
    const done = sessionAt(plan, plan.steps.length, { status: "completed", currentStepId: null });
    const completion = platform.projectGoalGuide(plan, done).completion;
    assert.ok(completion?.title && completion?.primaryAction?.label);
    titles.push(completion.title);
    actions.push(completion.primaryAction.label);
  }
  assert.equal(new Set(titles).size, 4);
  assert.equal(new Set(actions).size, 4);
  const wxml = read("miniprogram/subpackages/politics/route/guided-route.wxml");
  assert.ok(!wxml.includes("本次路线已完成"));
  for (const projection of ["quickSectionsReached", "completedReading", "contrastEvidenceSides", "recallResults"]) assert.ok(wxml.includes(projection), projection);
}, ["S55D-AC-008"]);

requirement("d", "S55D-AC-009", "四目标恢复自身位置且版本变化诚实过期并提供重建", () => {
  for (const type of platform.ROUTE_TYPES) {
    const plan = recommended(type);
    const saved = sessionAt(plan, Math.min(1, plan.steps.length - 1), { revealedStepIds: [plan.steps[Math.min(1, plan.steps.length - 1)].stepId] });
    const restored = platform.normalizeRouteSession(plan, saved);
    assert.equal(restored.currentStepId, saved.currentStepId);
    assert.deepEqual(restored.revealedStepIds, saved.revealedStepIds);
    const expired = platform.normalizeRouteSession(plan, { ...saved, packageVersion: "stale" });
    assert.equal(expired.status, "expired");
    assert.ok(expired.expiredReason);
    const rebuilt = platform.planLearningRoute(knowledgePackage, plan.options);
    assert.equal(rebuilt.id, plan.id);
    assert.equal(rebuilt.recommendationReason, plan.recommendationReason);
  }
}, ["S55D-AC-009"]);

requirement("d", "S55D-AC-010", "四种目标进度独立保存，切换不暂停或覆盖另一目标", () => {
  const progress = read("miniprogram/services/knowledge-platform/route-progress.js");
  const home = read("miniprogram/pages/politics/index.js");
  const route = read("miniprogram/subpackages/politics/route/guided-route.js");
  assert.ok(progress.includes("knowledgeRoute:politics:${type}"));
  assert.ok(progress.includes("LEGACY_ROUTE_KEY"), "old shared progress is not readable");
  assert.ok(home.includes("ROUTE_TYPES.map") && home.includes("routeRecords"), "home does not collect each goal's progress");
  assert.ok(route.includes("routeProgressKey(this.plan.type)"), "route events still write a shared key");
  assert.ok(!route.includes("activeConflict") && !route.includes("handleConfirmStart"), "switching goals still requires pausing another goal");
}, ["S55D-AC-010"]);

requirement("d", "S55D-AC-011", "路线页面只由Plan、Session、KnowledgeContext和共享卡片投影恢复", () => {
  const js = read("miniprogram/subpackages/politics/route/guided-route.js");
  assert.ok(js.includes("projectRouteViewModel"));
  assert.ok(js.includes("contrastPair") && read("miniprogram/subpackages/politics/route/index.json").includes("contrast-surface"));
  assert.ok(js.includes("projectKnowledgeCardSurfaceViewModel"));
  assert.ok(js.includes("fromRecentModuleContext"));
  assert.ok(!/phase:\s*["'](?:scope|active|completed)/.test(js));
  assert.ok(!/setStorageSync\([^\n]*(phase|answerVisible|stepOpened)/.test(js));
}, ["S55D-AC-011"]);

requirement("d", "S55D-AC-012", "D保持政治candidate、37篇已批准及其他模块隔离", () => {
  assert.equal(platform.getRolloutStage("politics"), "candidate");
  assert.equal(knowledgePackage.knowledgeUnits.length, 37);
  assert.equal(knowledgePackage.knowledgeUnits.filter((item) => item.status === "approved").length, 37);
  assert.equal(knowledgePackage.knowledgeUnits.filter((item) => item.publishable).length, 37);
  assert.equal(platform.getRolloutStage("common-sense"), "legacy");
  assert.equal(platform.getRolloutStage("notes"), "legacy");
}, ["S55D-AC-012"]);

requirement("c", "S55CD-GATE-COVERAGE", "门禁完整覆盖C九项与D十二项验收场景", () => {
  const expected = [
    ...Array.from({ length: 9 }, (_, index) => `S55C-AC-${String(index + 1).padStart(3, "0")}`),
    ...Array.from({ length: 12 }, (_, index) => `S55D-AC-${String(index + 1).padStart(3, "0")}`),
  ].sort();
  const actual = [...new Set(checks.flatMap((item) => item.covers))].sort();
  assert.deepEqual(actual, expected);
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
  status: results.every((item) => item.status === "passed") ? "passed" : "failed",
  passed: results.filter((item) => item.status === "passed").length,
  failed: results.filter((item) => item.status === "failed").length,
  results,
};

console.log(JSON.stringify(summary, null, 2));
if (!reportOnly && summary.status === "failed") process.exitCode = 1;
