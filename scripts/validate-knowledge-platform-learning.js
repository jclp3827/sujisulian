const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const platform = require("../miniprogram/services/knowledge-platform/index");
const { knowledgePackage } = require("../miniprogram/services/knowledge-platform/politics-runtime");

assert.ok(platform.hasReachedStage("politics", "learning"));
assert.equal(platform.getRolloutStage("common-sense"), "legacy");
assert.equal(platform.getRolloutStage("notes"), "legacy");
assert.equal(platform.planLearningRoute(knowledgePackage, { type: "quick" }), null, "route must require explicit scope");

const plans = {};
for (const type of platform.ROUTE_TYPES) {
  const scopes = platform.projectRouteScopeOptions(knowledgePackage, type);
  assert.ok(scopes.length && scopes.some((scope) => scope.enabled), `${type} needs an enabled explicit scope`);
  const scope = scopes.find((item) => item.enabled);
  plans[type] = platform.planLearningRoute(knowledgePackage, { type, scopeId: scope.id, random: type === "exam", seed: "fixed-seed" });
  assert.ok(plans[type]?.steps.length, `${type} plan is empty`);
  assert.equal(plans[type].scopeId, scope.id);
}

const quickScope = knowledgePackage.navigationNodes.find((node) => node.id === plans.quick.scopeId);
for (const type of ["systematic", "exam"]) {
  const scopes = platform.projectRouteScopeOptions(knowledgePackage, type);
  const sectionIds = knowledgePackage.navigationNodes.find((node) => node.id === "politics-toc-v2-n008").childIds;
  assert.equal(scopes.filter((scope) => sectionIds.includes(scope.id)).length, 15, `${type}: sections depend on recent history`);
  const roots = platform.projectRouteScopePicker(knowledgePackage, type);
  assert.deepEqual(roots.map((row) => row.id), ["politics-toc-v2-n002", "politics-toc-v2-n024"]);
  assert.ok(roots[0].hasChildren && !roots[1].hasChildren, `${type}: Marx article must not gain fake chapters`);
  const expanded = platform.projectRouteScopePicker(knowledgePackage, type, { selectedScopeId: "politics-toc-v2-n008", expandedScopeIds: [roots[0].id, "politics-toc-v2-n008"] });
  assert.deepEqual(expanded.map((row) => row.id), [roots[0].id, "politics-toc-v2-n003", "politics-toc-v2-n008", roots[1].id], `${type}: picker must stop at article/chapter level`);
  assert.ok(!expanded.find((row) => row.id === "politics-toc-v2-n008").hasChildren && !expanded.find((row) => row.id === "politics-toc-v2-n008").expanded, `${type}: chapter still exposes an expansion action`);
  assert.equal(expanded.filter((row) => row.selected).length, 1);
  assert.equal(expanded.find((row) => row.selected).id, "politics-toc-v2-n008");
  const selectedPlan = platform.planLearningRoute(knowledgePackage, { type, scopeId: sectionIds[2] });
  assert.equal(new Set(selectedPlan.steps.map((step) => step.pointId)).size, 1, `${type}: section selection escaped its scope`);
}
assert.deepEqual(plans.quick.steps.map((step) => step.stage), ["overview", "branch", "branch", "closure"], "quick route must include framing and closure");
assert.deepEqual(plans.quick.steps.filter((step) => step.stage === "branch").map((step) => step.navigationNodeId), quickScope.childIds, "quick route must use both formal immediate branches");

const systematicIndex = new Map(plans.systematic.steps.map((step, index) => [step.stepId, index]));
const systematicPointIds = new Set(plans.systematic.steps.map((step) => step.pointId).filter(Boolean));
for (const relation of knowledgePackage.relations.filter((item) => item.type === "prerequisite")) {
  if (!systematicPointIds.has(relation.sourcePointId) || !systematicPointIds.has(relation.targetPointId)) continue;
  const prerequisiteReading = systematicIndex.get(`systematic:${relation.targetPointId}:reading`);
  const dependentReading = systematicIndex.get(`systematic:${relation.sourcePointId}:reading`);
  assert.ok(prerequisiteReading < dependentReading, `prerequisite order broken: ${relation.id}`);
}

const formalContrastIds = new Set(knowledgePackage.relations.filter((item) => item.type === "contrast").map((item) => item.id));
assert.ok(plans.confusion.steps.every((step) => formalContrastIds.has(step.relationId)), "confusion invented a non-contrast relation");
const contrastOptions = platform.projectContrastRouteOptions(knowledgePackage);
assert.equal(contrastOptions.length, formalContrastIds.size, "confusion entry must show confirmed contrast pairs");
const singleContrastPlan = platform.planLearningRoute(knowledgePackage, { type: "confusion", scopeId: contrastOptions[0].scopeId, relationId: contrastOptions[0].relationId });
assert.deepEqual(singleContrastPlan.steps.map((step) => step.stage), ["judgment", "boundary", "evidence", "retest"], "one contrast choice must create the formal four-stage comparison");
assert.ok(singleContrastPlan.steps.every((step) => step.relationId === contrastOptions[0].relationId));

const routeExperiences = Object.fromEntries(Object.entries(plans).map(([type, plan]) => [type, platform.projectRouteViewModel(knowledgePackage, plan, platform.createRouteSession(plan)).experience]));
assert.equal(routeExperiences.quick.quickBranches.filter((step) => step.stage === "branch").length, 2, "quick route must expose the two main branches together");
assert.ok(routeExperiences.quick.quickBranches.every((branch) => branch.childTitles.length <= 3), "quick route must not become a long directory");
assert.deepEqual(routeExperiences.systematic.systematic.cycle.map((item) => item.label), ["完整理解", "主动回忆"]);
assert.ok(routeExperiences.systematic.systematic.orientation.pathText && routeExperiences.systematic.systematic.orientation.whyNow, "reading must show location and learning reason");
assert.ok(routeExperiences.systematic.systematic.pointTotal > 1, "systematic route must expose knowledge progress");
assert.ok(routeExperiences.confusion.confusion.sourceTitle && routeExperiences.confusion.confusion.targetTitle && routeExperiences.confusion.confusion.reason, "confusion route must expose both sides and the judgment reason");
assert.equal(routeExperiences.exam.exam.cardCount, plans.exam.steps.length, "exam route must expose a card deck");

const examAgain = platform.planLearningRoute(knowledgePackage, { type: "exam", scopeId: plans.exam.scopeId, random: true, seed: "fixed-seed" });
assert.deepEqual(examAgain.frozenOrder, plans.exam.frozenOrder, "same seed must restore the same order");
assert.ok(plans.exam.steps.every((step) => step.recallItemId && step.pointId), "exam step must retain canonical IDs");

let session = platform.createRouteSession(plans.exam, 1);
const hiddenRecall = platform.projectRouteViewModel(knowledgePackage, plans.exam, session);
assert.equal(hiddenRecall.current.recall.answer, null, "answer leaked before reveal");
session = platform.applyRouteSessionEvent(plans.exam, session, { type: "REVEAL_RECALL", at: 2 });
const shownRecall = platform.projectRouteViewModel(knowledgePackage, plans.exam, session);
assert.ok(shownRecall.current.recall.answer, "answer unavailable after explicit reveal");
session = platform.applyRouteSessionEvent(plans.exam, session, { type: "VIEW_REMEDY", at: 2 });
assert.equal(session.reviewedStepIds.length, 0, "revealed but unassessed card must not count as reviewed");
session = platform.applyRouteSessionEvent(plans.exam, session, { type: "RECALL_RESULT", result: "fuzzy", at: 3 });
assert.equal(session.recallResults.fuzzy, 1);
assert.equal(session.revealedCount, 1);
const priorStepId = plans.exam.steps[0].stepId;
session = platform.applyRouteSessionEvent(plans.exam, session, { type: "NEXT_RECALL_CARD", at: 4 });
session = platform.applyRouteSessionEvent(plans.exam, session, { type: "VIEW_REMEDY", stepId: priorStepId, at: 5 });
assert.deepEqual(session.reviewedStepIds, [priorStepId], "post-answer remedy must credit the answered step");
assert.equal(platform.normalizeRouteSession(plans.exam, { ...session, packageVersion: "old" }).status, "expired");
const report = platform.projectRouteViewModel(knowledgePackage, plans.exam, session).report;
assert.ok(!Object.keys(report).some((key) => /master|score|percent/i.test(key)), "session inferred mastery or score");

const exactUnit = knowledgePackage.knowledgeUnits[0];
const exact = platform.projectSearchResults(knowledgePackage, exactUnit.title);
assert.equal(exact[0].pointId, exactUnit.id);
assert.equal(exact[0].matchLabel, "标题精确命中");
assert.deepEqual(exact, platform.projectSearchResults(knowledgePackage, exactUnit.title), "search order is unstable");
assert.equal(exact[0].primaryAction.mode, "reading", "definition search must recommend reading");
const relation = knowledgePackage.relations[0];
const relationQuery = relation.reason.replace(/\s+/g, "").slice(0, 6);
const relationResult = platform.projectSearchResults(knowledgePackage, relationQuery, "relation");
assert.ok(relationResult.length && relationResult[0].primaryAction.mode === "relations", "relation search must recommend related knowledge");
const locationResult = platform.projectSearchResults(knowledgePackage, "第二篇", "location");
assert.ok(locationResult.length && locationResult[0].primaryAction.mode === "system", "location search must recommend knowledge terrain");
const learningSource = fs.readFileSync(path.join(__dirname, "../miniprogram/services/knowledge-platform/learning.js"), "utf8");
const searchSource = learningSource.slice(learningSource.indexOf("function projectSearchResults"), learningSource.indexOf("module.exports"));
assert.ok(!searchSource.includes("recall.answer"), "search must not index recall answers");

let context = platform.createKnowledgeContext("politics");
context = platform.applyContextEvent(knowledgePackage, context, { type: "START_ROUTE", routeId: plans.systematic.id, routeType: "systematic", scopeId: plans.systematic.scopeId, stepId: plans.systematic.steps[0].stepId, label: plans.systematic.label, at: 4 });
assert.equal(context.goalContext.routeId, plans.systematic.id);
context = platform.applyContextEvent(knowledgePackage, context, { type: "END_ROUTE", at: 5 });
assert.equal(context.goalContext, null);

const root = path.join(__dirname, "..");
const app = JSON.parse(fs.readFileSync(path.join(root, "miniprogram/app.json"), "utf8"));
const politicsPackage = app.subPackages.find((item) => item.root === "subpackages/politics");
assert.ok(politicsPackage.pages.includes("route/index"));
const homeWxml = fs.readFileSync(path.join(root, "miniprogram/pages/politics/index.wxml"), "utf8");
const legacyGoalEntry = ["按目标开始", "item.mark", "item.outcome", "goals"].every((marker) => homeWxml.includes(marker));
const recommendedGoalEntry = ["换一个目标", "item.mark", "item.outcome", "otherGoals"].every((marker) => homeWxml.includes(marker))
  && !homeWxml.includes("item.stepCount")
  && typeof platform.planRecommendedRoute === "function"
  && platform.ROUTE_TYPES.every((type) => platform.planRecommendedRoute(knowledgePackage, type)?.steps.length);
const visualGoalEntry = ["dailyCard", "routeCards", "item.displayLine1", "item.displayLine2", "handleGoalTap"].every((marker) => homeWxml.includes(marker))
  && !homeWxml.includes("item.stepCount")
  && platform.projectHomeDecision(knowledgePackage, {}).goals?.length === 4;
assert.ok(legacyGoalEntry || recommendedGoalEntry || visualGoalEntry, "首页四目标缺少可直接开始的系统推荐");
const routeWxml = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/route/guided-route.wxml"), "utf8");
assert.deepEqual(
  platform.ROUTE_TYPES.map((type) => platform.ROUTE_META[type].startAction),
  ["开始快速导读", "开始第一个知识", "开始这组辨析", "开始第一张"],
  "route entry language must differ by goal",
);
for (const marker of ["start.details.contrastPair", "type === 'quick'", "type === 'confusion'", "start.details.sourceTitle", "start.details.targetTitle"]) assert.ok(routeWxml.includes(marker), `route entry missing: ${marker}`);
assert.ok(routeWxml.includes("handleQuickComplete") && routeWxml.includes("handleContrastNext"), "route experiences still share one generic completion action");
for (const marker of ["quick-primer", "quick-section", "guided-system", "guided-contrast", "guided-exam", "route-step-progress", "contrast-surface", "guided-recall-card"]) assert.ok(routeWxml.includes(marker), `route experience missing: ${marker}`);
const searchWxml = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/search/index.wxml"), "utf8");
assert.ok(searchWxml.includes("handleResultTap") && searchWxml.includes("politics-search-match") && !searchWxml.includes("当前知识未改变") && !searchWxml.includes("直接打开 ›"));
for (const legacyPage of ["miniprogram/pages/common-sense/index.js", "miniprogram/pages/note/index/index.js"]) {
  assert.ok(!fs.readFileSync(path.join(root, legacyPage), "utf8").includes("knowledge-platform"));
}

console.log(`knowledge platform learning validation passed: ${Object.keys(plans).length} routes, ${plans.exam.steps.length} recall steps, canonical search decisions`);
