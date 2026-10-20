#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repo = path.resolve(__dirname, "..");
const platform = require(path.join(repo, "miniprogram/services/knowledge-platform"));
const { knowledgePackage } = require(path.join(repo, "miniprogram/services/knowledge-platform/politics-runtime"));

const requestedGate = process.argv.find((argument) => argument.startsWith("--gate="))?.slice(7) || "all";
const expectRed = process.argv.includes("--expect-red");
const validGates = new Set(["all", "home", "j1", "j2", "j2v2", "j3", "j4", "j5"]);
assert.ok(validGates.has(requestedGate), `unknown gate: ${requestedGate}`);

const EXPECTED_RED = new Set([
  "HOME-hierarchy",
  "J1-space",
  "J1-renderer",
  "J1-navigation",
  "J2-anchors",
  "J2-consumption",
  "J3-cycle",
  "J3-consumption",
  "J4-contrast",
  "J4-consumption",
  "J5-remedy",
  "J5-storage",
]);

const REQUIRED_EVIDENCE = ["state", "view-model", "wxml", "negative", "restore", "isolation"];
const EXPECTED_ACCEPTANCE = {
  j1: Array.from({ length: 10 }, (_, index) => `R3-J1-AC-${String(index + 1).padStart(2, "0")}`),
  j2: Array.from({ length: 5 }, (_, index) => `R3-J2-AC-${String(index + 1).padStart(2, "0")}`),
  j2v2: [
    "J2V2-source",
    "J2V2-coverage",
    "J2V2-render",
    "J2V2-structure-context",
    "J2V2-continuous-flow",
    "J2V2-native-touch",
    "J2V2-detail-return",
    "J2V2-honest-degrade",
    "J2V2-completion",
    "J2V2-mobile-a11y-isolation",
  ],
  j3: Array.from({ length: 6 }, (_, index) => `R3-J3-AC-${String(index + 1).padStart(2, "0")}`),
  j4: Array.from({ length: 6 }, (_, index) => `R3-J4-AC-${String(index + 1).padStart(2, "0")}`),
  j5: Array.from({ length: 7 }, (_, index) => `R3-J5-AC-${String(index + 1).padStart(2, "0")}`),
};

const checks = [];
function gate(journey, id, description, evidence, acceptance, verify) {
  checks.push({ journey, id, description, evidence, acceptance, verify });
}

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function plan(type, context = {}) {
  const result = platform.planRecommendedRoute(knowledgePackage, type, context);
  assert.ok(result, `${type}: recommended route missing`);
  return result;
}

function hasBinding(relativePath, binding) {
  const source = read(relativePath);
  return source.includes(`{{${binding}}}`) || source.includes(`{{${binding}.`) || source.includes(`${binding}}}`);
}

function componentKey(relativeJsonPath, name) {
  const components = readJson(relativeJsonPath).usingComponents || {};
  return Object.entries(components).find(([, componentPath]) => componentPath.includes(name))?.[0] || null;
}

function assertComponentUsed(pageBase, name) {
  const key = componentKey(`${pageBase}.json`, name);
  assert.ok(key, `${pageBase}: ${name} is not registered`);
  const relativeWxml = `${pageBase}.wxml`;
  const source = read(relativeWxml);
  const included = [...source.matchAll(/<include\s+src=["']([^"']+)["']/g)]
    .map((match) => read(path.posix.join(path.posix.dirname(relativeWxml), match[1])));
  assert.ok([source, ...included].some((template) => template.includes(`<${key}`)), `${pageBase}: ${key} is registered but not consumed`);
}

function loadPage(relativePath, options = {}) {
  let definition = null;
  const storage = options.storage || new Map();
  const calls = { navigateTo: [], navigateBack: [], redirectTo: [], switchTab: [], toast: [] };
  global.Page = (value) => { definition = value; };
  global.wx = {
    getStorageSync(key) {
      if (options.storageError) throw new Error("storage-read-failed");
      return storage.get(key);
    },
    setStorageSync(key, value) {
      if (options.storageError) throw new Error("storage-write-failed");
      storage.set(key, value);
    },
    removeStorageSync(key) {
      if (options.storageError) throw new Error("storage-remove-failed");
      storage.delete(key);
    },
    navigateTo(payload) { calls.navigateTo.push(payload); },
    navigateBack(payload) { calls.navigateBack.push(payload); },
    redirectTo(payload) { calls.redirectTo.push(payload); },
    switchTab(payload) { calls.switchTab.push(payload); },
    showToast(payload) { calls.toast.push(payload); },
    showModal({ success }) { if (success) success({ confirm: true }); },
    setNavigationBarTitle() {},
    pageScrollTo(payload) { if (options.scrollFailure) payload.fail?.({ errMsg: "scroll failed" }); else payload.success?.(); },
    createSelectorQuery() {
      let selection = null;
      return {
        in() { return this; },
        select() { selection = "block"; return this; },
        boundingClientRect() { return this; },
        selectViewport() { selection = "viewport"; return this; },
        scrollOffset() { return this; },
        exec(callback) {
          if (!options.anchorQuery) return callback([]);
          callback(selection === "block" ? [options.anchorRect === null ? null : { top: 180 }] : [{ scrollTop: 0 }]);
        },
      };
    },
  };
  const fullPath = path.join(repo, relativePath);
  const guidedPath = path.join(repo, "miniprogram/subpackages/politics/route/guided-route.js");
  if (require.cache[guidedPath]) delete require.cache[guidedPath];
  delete require.cache[require.resolve(fullPath)];
  require(fullPath);
  assert.ok(definition, `${relativePath}: Page was not registered`);
  const page = {
    ...definition,
    data: clone(definition.data),
    setData(patch, callback) {
      this.data = { ...this.data, ...patch };
      if (callback) callback();
    },
    getTabBar() { return null; },
    selectComponent() { return options.anchorQuery ? {} : null; },
  };
  return { page, calls, storage };
}

function assertIsolation() {
  assert.equal(platform.getRolloutStage("common-sense"), "legacy");
  assert.equal(platform.getRolloutStage("notes"), "legacy");
  const common = read("miniprogram/pages/common-sense/index.js");
  const notes = read("miniprogram/pages/note/index/index.js");
  assert.ok(!/knowledge-(?:space|card|contrast)-surface/.test(`${common}\n${notes}`));
}

function withoutCapabilities(pointId) {
  const copy = clone(knowledgePackage);
  const unit = copy.knowledgeUnits.find((item) => item.id === pointId);
  unit.relationIds = [];
  unit.recallItemIds = [];
  copy.indexes.relationIdsByPointId[pointId] = [];
  copy.indexes.recallItemIdsByPointId[pointId] = [];
  copy.relations = copy.relations.filter((item) => item.sourcePointId !== pointId && item.targetPointId !== pointId);
  copy.recallItems = copy.recallItems.filter((item) => item.pointId !== pointId);
  copy.recallProjections = copy.recallProjections.filter((item) => item.pointId !== pointId);
  copy.contrastPairs = copy.contrastPairs.filter((item) => item.leftPointId !== pointId && item.rightPointId !== pointId);
  return copy;
}

const J2V2_PRIMER_ID = "politics-quick-primer-v2";
const J2V2_SECTION_IDS = Array.from({ length: 8 }, (_, index) => `J2V2-SEC-${String(index + 1).padStart(2, "0")}`);
const J2V2_GAP_IDS = Array.from({ length: 5 }, (_, index) => `POL-COVERAGE-${String(index + 1).padStart(3, "0")}`);

function buildQuickPrimerFixture(pkg) {
  const atomsByPoint = pkg.knowledgeAtomRefs.reduce((result, item) => {
    (result[item.pointId] ||= []).push(item);
    return result;
  }, {});
  const sourceSegment = (pointId) => {
    const atom = atomsByPoint[pointId]?.[0];
    assert.ok(atom, `fixture atom missing for ${pointId}`);
    return {
      type: "source",
      sourceBlockIds: [...atom.sourceBlockIds],
      sourceAtomRefIds: [atom.id],
      reviewState: "review",
    };
  };
  const sectionSources = [
    ["politics-toc-v2-u020"],
    ["politics-toc-v2-u020", "politics-toc-v2-u002"],
    ["politics-toc-v2-u001", "politics-toc-v2-u003"],
    ["politics-toc-v2-u004", "politics-toc-v2-u006", "politics-toc-v2-u007"],
    ["politics-toc-v2-u024"],
    ["politics-toc-v2-u027", "politics-toc-v2-u033"],
    ["politics-toc-v2-u007", "politics-toc-v2-u024"],
    ["politics-toc-v2-u002", "politics-toc-v2-u020"],
  ];
  const structureFocus = [
    ["politics-toc-v2-n001"],
    ["politics-toc-v2-n001", "politics-toc-v2-n002", "politics-toc-v2-n024"],
    ["politics-toc-v2-n002", "politics-toc-v2-n004", "politics-toc-v2-n006"],
    ["politics-toc-v2-n002", "politics-toc-v2-n007", "politics-toc-v2-n009", "politics-toc-v2-n010", "politics-toc-v2-n011"],
    ["politics-toc-v2-n024", "politics-toc-v2-n029"],
    ["politics-toc-v2-n024", "politics-toc-v2-n032", "politics-toc-v2-n038"],
    ["politics-toc-v2-n001", "politics-toc-v2-n002", "politics-toc-v2-n024", "politics-toc-v2-n007", "politics-toc-v2-n029"],
    ["politics-toc-v2-n001", "politics-toc-v2-n002", "politics-toc-v2-n024"],
  ];
  const propositionSource = sourceSegment("politics-toc-v2-u002");
  return {
    primer: {
      id: J2V2_PRIMER_ID,
      moduleId: "politics",
      version: "review-1",
      status: "review",
      scopeNodeId: "politics-toc-v2-n001",
      targetMinutes: { min: 8, max: 12 },
      scopeBoundary: "本版只覆盖当前两篇review内容；科学社会主义尚无独立详细单元，不包含时政、党史或完整考试范围。",
      sections: J2V2_SECTION_IDS.map((id, index) => ({
        id,
        order: index + 1,
        kind: index === 0 ? "opening" : index === 6 ? "examples" : index === 7 ? "reflection" : "explanation",
        title: `fixture-${id}`,
        guidingQuestion: `fixture-question-${index + 1}`,
        narrativeSegments: sectionSources[index].map(sourceSegment),
        structureFocusNodeIds: structureFocus[index],
        detailTargets: sectionSources[index].slice(0, 1),
      })),
      structure: {
        macroNodeIds: ["politics-toc-v2-n001", "politics-toc-v2-n002", "politics-toc-v2-n024"],
        propositions: [
          { id: "root-to-xi", fromNodeId: "politics-toc-v2-n001", toNodeId: "politics-toc-v2-n002", label: "当代回答与实践展开", sourceBlockIds: propositionSource.sourceBlockIds, sourceAtomRefIds: propositionSource.sourceAtomRefIds },
          { id: "root-to-marx", fromNodeId: "politics-toc-v2-n001", toNodeId: "politics-toc-v2-n024", label: "基本立场、观点和方法", sourceBlockIds: propositionSource.sourceBlockIds, sourceAtomRefIds: propositionSource.sourceAtomRefIds },
        ],
      },
      reflection: { question: "两条主线为什么不是两份互不相关的目录？", minLength: 6, maxLength: 80 },
      completionCopy: { title: "本次快速导读已结束", primaryActionLabel: "回到知识全景" },
      sourcePackageVersion: pkg.packageVersion,
    },
    coverage: {
      moduleId: "politics",
      packageVersion: pkg.packageVersion,
      includedScopeIds: ["politics-toc-v2-n001", "politics-toc-v2-n002", "politics-toc-v2-n024"],
      excludedTopics: ["时政", "党史", "完整考试范围"],
      partialTopics: J2V2_GAP_IDS.map((id) => ({ id, label: id, currentEvidence: "review-package", missingDetail: "follow-up", nextAction: "POL-CONTENT-COVERAGE-FOLLOWUP", status: "deferred" })),
      auditBasis: ["politics-profile", pkg.packageVersion],
      reviewState: "partial",
    },
  };
}

function assertQuickPrimerContent(pkg, primer, coverage) {
  assert.equal(primer?.id, J2V2_PRIMER_ID, "review primer id is missing or changed");
  assert.equal(primer.moduleId, "politics");
  assert.equal(primer.status, "review");
  assert.equal(primer.sourcePackageVersion, pkg.packageVersion, "primer is not bound to the current source package");
  assert.deepEqual(primer.targetMinutes, { min: 8, max: 12 });
  assert.deepEqual(primer.sections?.map((item) => item.id), J2V2_SECTION_IDS, "primer must contain the frozen eight sections in order");
  assert.deepEqual(primer.sections.map((item) => item.order), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(primer.structure?.macroNodeIds, ["politics-toc-v2-n001", "politics-toc-v2-n002", "politics-toc-v2-n024"]);
  assert.equal(primer.structure.propositions?.length, 2, "macro structure needs two readable propositions");
  assert.ok(primer.structure.propositions.every((item) => item.label && item.sourceBlockIds?.length), "macro proposition is not readable and sourced");
  assert.ok(primer.scopeBoundary.includes("当前两篇"));
  for (const boundary of ["科学社会主义", "时政", "完整考试范围"]) assert.ok(primer.scopeBoundary.includes(boundary), `scope boundary omits ${boundary}`);

  const blocks = new Map(pkg.knowledgeUnits.flatMap((unit) => unit.blocks).map((item) => [item.id, item]));
  const atoms = new Map(pkg.knowledgeAtomRefs.map((item) => [item.id, item]));
  const nodes = new Set(pkg.navigationNodes.map((item) => item.id));
  const units = new Set(pkg.knowledgeUnits.map((item) => item.id));
  for (const section of primer.sections) {
    assert.ok(section.guidingQuestion && section.narrativeSegments?.length, `${section.id}: content is empty`);
    assert.ok(section.structureFocusNodeIds.every((id) => nodes.has(id)), `${section.id}: structure focus is unresolved`);
    assert.ok(section.detailTargets.every((id) => units.has(id)), `${section.id}: detail target is unresolved`);
    for (const segment of section.narrativeSegments) {
      assert.ok(["source", "bridge", "scenario", "label"].includes(segment.type), `${section.id}: unsupported segment type`);
      if (segment.type === "source" || segment.type === "bridge") assert.ok(segment.sourceBlockIds?.length || segment.sourceAtomRefIds?.length, `${section.id}: factual segment is unsourced`);
      for (const id of segment.sourceBlockIds || []) assert.ok(blocks.has(id), `${section.id}: missing source block ${id}`);
      for (const id of segment.sourceAtomRefIds || []) {
        const atom = atoms.get(id);
        assert.ok(atom, `${section.id}: missing source atom ${id}`);
        assert.ok(atom.sourceBlockIds.every((blockId) => blocks.has(blockId)), `${section.id}: atom source block is missing`);
      }
    }
  }
  assert.ok(primer.sections[6].narrativeSegments.filter((item) => item.type === "source").length >= 2, "SEC-07 must contain two sourced examples");
  assert.equal(primer.reflection?.minLength, 6);
  assert.equal(primer.reflection?.maxLength, 80);
  assert.equal(primer.completionCopy?.title, "本次快速导读已结束");
  assert.ok(!/掌握|已理解|正确率/.test(JSON.stringify(primer.completionCopy)), "completion copy claims a learning result");

  assert.equal(coverage?.moduleId, "politics", "content coverage statement is missing");
  assert.equal(coverage.packageVersion, pkg.packageVersion);
  assert.ok(["partial", "scope-unverified"].includes(coverage.reviewState), "incomplete content is marked complete");
  assert.deepEqual(coverage.partialTopics?.map((item) => item.id).sort(), [...J2V2_GAP_IDS].sort(), "coverage gap ledger is incomplete");
  assert.ok(coverage.excludedTopics?.length >= 3, "coverage exclusions are incomplete");
}

gate("home", "HOME-hierarchy", "首页保留状态动作并同时展示四路线和知识图谱", ["view-model", "wxml", "negative"], [], () => {
  const decision = platform.projectHomeDecision(knowledgePackage, { recent: null, routeRecords: [] });
  assert.ok(Array.isArray(decision.otherGoals), "HomeDecision must expose otherGoals");
  assert.equal(decision.otherGoals.some((item) => item.id === "quick"), false, "current goal must not repeat");
  assert.deepEqual(decision.goals.map((item) => item.id), ["quick", "systematic", "confusion", "exam"]);
  assert.equal(decision.goals.find((item) => item.id === "quick").progressPercent, 0);
  const quickPlan = platform.planRecommendedRoute(knowledgePackage, "quick");
  const quickSession = platform.createRouteSession(quickPlan, 1);
  quickSession.completedStepIds = [quickPlan.steps[0].stepId, quickPlan.steps[0].stepId];
  const progressed = platform.projectHomeDecision(knowledgePackage, {
    routeRecords: [{ planOptions: quickPlan.options, session: quickSession }],
  });
  assert.equal(progressed.goals.find((item) => item.id === "quick").progressPercent, Math.round(100 / quickPlan.steps.length));
  assert.ok(decision.storageStatus, "HomeDecision must expose storageStatus");
  const wxml = read("miniprogram/pages/politics/index.wxml");
  assert.ok(wxml.includes("quickGoal") && wxml.includes("routeCards"), "home does not show all four goals");
  assert.ok(wxml.includes("知识图谱") && wxml.includes("浏览全部知识"), "knowledge graph is not the all-knowledge entry");
  assert.ok(!/\{\{regions\}\}|item\.stepCount|politics-home-regions/.test(wxml), "home still consumes regions or internal stepCount");
  const loaded = loadPage("miniprogram/pages/politics/index.js", { storageError: true });
  loaded.page.onShow();
  assert.equal(loaded.page.data.decision.storageStatus?.ok, false, "storage failure is presented as first use");
  const healthy = loadPage("miniprogram/pages/politics/index.js");
  healthy.page.onShow();
  assert.deepEqual(healthy.page.data.homeGoals.map((goal) => goal.id), ["quick", "systematic", "confusion", "exam"]);
  healthy.page.handleGoalTap({ currentTarget: { dataset: { type: "quick" } } });
  healthy.page.handleSearchTap();
  healthy.page.handleTerrainTap();
  healthy.page.handlePlaceholderTap({ currentTarget: { dataset: { feature: "favorites" } } });
  healthy.page.handlePlaceholderTap({ currentTarget: { dataset: { feature: "daily" } } });
  assert.deepEqual(healthy.calls.navigateTo.map((call) => call.url), [
    "/subpackages/politics/route/index?type=quick&recommended=1",
    "/subpackages/politics/search/index",
    "/subpackages/politics/map/index?state=overview",
    "/subpackages/politics/coming-soon/index?feature=favorites",
    "/subpackages/politics/coming-soon/index?feature=daily",
  ]);
  assert.ok(readJson("miniprogram/app.json").subPackages.find((item) => item.root === "subpackages/politics").pages.includes("coming-soon/index"));
});

gate("j1", "J1-space", "知识空间只含overview/branch/directory并递归消费42个正式节点", ["state", "view-model", "negative"], EXPECTED_ACCEPTANCE.j1.slice(0, 5), () => {
  const context = platform.createKnowledgeContext("politics");
  const overview = platform.projectKnowledgeSpaceViewModel(knowledgePackage, context, { surfaceState: "overview" });
  assert.deepEqual(overview.overviewContext.regions.map((item) => item.id), ["politics-toc-v2-n002", "politics-toc-v2-n024"]);
  for (const forbidden of ["card", "listEquivalent", "directoryGroups"]) assert.equal(Object.hasOwn(overview, forbidden), false, `space still exposes ${forbidden}`);
  assert.ok(overview.directoryTree, "recursive directoryTree missing");
  const walk = (node) => node ? [node, ...(node.children || []).flatMap(walk)] : [];
  const directoryNodes = walk(overview.directoryTree);
  assert.equal(directoryNodes.length, 42, "directoryTree must consume all 42 formal nodes exactly once");
  assert.equal(new Set(directoryNodes.map((item) => item.id)).size, 42, "directoryTree contains duplicate nodes");
  assert.ok(!directoryNodes.some((item) => item.title === "本篇知识"), "directoryTree contains a fabricated level");
  const branch = platform.projectKnowledgeSpaceViewModel(knowledgePackage, context, { surfaceState: "branch", expandedBranchId: "politics-toc-v2-n024" });
  assert.equal(branch.branch.groups.length, 1);
  assert.equal(branch.branch.groups[0].items.length, 18, "second article leaves must stay directly under the article");
  const invalid = platform.projectKnowledgeSpaceViewModel(knowledgePackage, context, { surfaceState: "full", pointId: "politics-toc-v2-u001" });
  assert.notEqual(invalid.surfaceState, "full", "KnowledgeSpace still accepts the full page state");
});

gate("j1", "J1-renderer", "空间、详情和路线真实消费唯一共享表面且正文没有Atom副本", ["view-model", "wxml", "negative", "isolation"], EXPECTED_ACCEPTANCE.j1.slice(5, 7).concat(EXPECTED_ACCEPTANCE.j1[9]), () => {
  assert.equal(typeof platform.projectKnowledgeCardSurfaceViewModel, "function", "shared KnowledgeCardSurface ViewModel is missing");
  const card = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, "politics-toc-v2-u001", { activity: "reading" });
  const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === "politics-toc-v2-u001");
  assert.deepEqual(card.semanticBlocks.map((item) => item.id), unit.blocks.map((item) => item.id), "shared card changed the canonical block order");
  for (const entry of knowledgePackage.knowledgeUnits) {
    const projected = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, entry.id, { activity: "reading" });
    assert.deepEqual(projected.semanticBlocks.map((item) => item.id), entry.blocks.map((item) => item.id), `${entry.id}: complete body order changed`);
  }
  const reason = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, "politics-toc-v2-u035", { activity: "reading" })
    .semanticBlocks.find((item) => item.originalSemantic === "reason");
  assert.equal(reason.semantic, "reason", "explicit reason was downgraded to plain");
  assert.equal(reason.semanticLabel, "理由");
  const longCard = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, "politics-toc-v2-u007", { activity: "reading" });
  assert.ok(longCard.sectionOutline.length > 2 && longCard.sectionOutline.every((item) => longCard.semanticBlocks.some((block) => block.id === item.id)), "long body outline is not anchored to canonical blocks");
  assert.equal(Object.hasOwn(card, "previewAtoms"), false);
  assert.equal(Object.hasOwn(card, "atoms"), false);
  assertComponentUsed("miniprogram/subpackages/politics/map/index", "knowledge-space-surface");
  assertComponentUsed("miniprogram/subpackages/politics/detail/index", "knowledge-card-surface");
  assertComponentUsed("miniprogram/subpackages/politics/route/index", "knowledge-card-surface");
  const reduced = platform.projectKnowledgeCardSurfaceViewModel(withoutCapabilities(unit.id), unit.id, { activity: "reading" });
  assert.equal(reduced.semanticBlocks.length, unit.blocks.length, "missing optional capabilities removed formal content");
  assert.equal(reduced.relationFooter, null);
  assert.equal(reduced.recallFace, null);
  const formalPair = knowledgePackage.contrastPairs[0];
  for (const [pointId, targetPointId] of [
    [formalPair.leftPointId, formalPair.rightPointId],
    [formalPair.rightPointId, formalPair.leftPointId],
  ]) {
    const pairedCard = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, pointId, { activity: "reading" });
    const relation = pairedCard.relationFooter.items.find((item) => item.targetPointId === targetPointId && item.formalContrast);
    assert.ok(relation, "formal contrast must be visible from both knowledge cards");
    assert.equal(relation.formalContrast.boundaryText, formalPair.boundaries.join("\n"));
    assert.ok(pairedCard.semanticBlocks.every((block) => !block.inlineContrasts.some((item) => item.relationId === relation.relationId)), "optional cross-point comparison interrupted the formal body");
  }
  const noPairCard = platform.projectKnowledgeCardSurfaceViewModel({ ...knowledgePackage, contrastPairs: [] }, formalPair.leftPointId, { activity: "reading" });
  assert.ok(noPairCard.relationFooter.items.every((item) => !item.formalContrast), "ordinary relation was presented as a formal contrast");
  assert.ok(noPairCard.semanticBlocks.every((block) => block.inlineContrasts.length === 0), "missing formal pair still rendered an inline contrast");
  const ordinaryCard = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, "politics-toc-v2-u004", { activity: "reading" });
  const ordinaryInline = ordinaryCard.semanticBlocks.flatMap((block) => block.inlineRelations);
  assert.equal(ordinaryInline.length, 0, "background relations interrupted the formal body");
  assert.ok(ordinaryCard.relationFooter.items.length >= 4 && ordinaryCard.relationFooter.items.every((item) => item.reason && item.targetTitle), "background relation reasons are unavailable in optional exploration");
  const cardWxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
  assert.ok(cardWxml.includes("block.inlineContrasts") && cardWxml.includes("contrast.reason") && cardWxml.includes("item.formalContrast.boundaryText"), "shared card does not render the anchored reason and formal contrast boundaries");
  assert.ok(cardWxml.includes("block.inlineRelations.length") && cardWxml.includes("relation.reason") && !cardWxml.includes('expandedRelationAnchor === block.id'), "local boundary reasons must remain visible in the body");
  assertIsolation();
});

gate("j1", "J1-navigation", "打开知识默认正文、使用原生页面栈并恢复来源viewport", ["state", "wxml", "restore", "isolation"], EXPECTED_ACCEPTANCE.j1.slice(7, 9), () => {
  const initialMap = loadPage("miniprogram/subpackages/politics/map/index.js");
  initialMap.page.onLoad({ state: "overview" });
  const firstRegion = initialMap.page.data.space.overviewContext.regions[0];
  const secondRegion = initialMap.page.data.space.overviewContext.regions[1];
  assert.equal(initialMap.page.data.space.projection, "terrain", "knowledge panorama did not use the article list layout");
  assert.equal(initialMap.page.data.space.branch?.id, firstRegion.id, "initial entry did not select the first article");
  assert.equal(initialMap.page.data.space.branch.pointCount, 19, "initial article list is incomplete");
  assert.equal(initialMap.page.data.space.branch.directoryRows.filter((row) => row.pointId).length, 19, "scoped directory did not include all first-article points");
  assert.equal(initialMap.page.data.space.branch.directoryRows[0].nodeType, "chapter", "scoped directory lost its formal chapter hierarchy");
  assert.ok(firstRegion.active && !secondRegion.active, "first article is not the active card");
  const chapters = initialMap.page.data.space.branch.directoryRows.filter((row) => row.collapsible);
  assert.deepEqual(chapters.map((row) => row.collapsed), [false, true], "initial map must expand only the first chapter");
  assert.equal(initialMap.page.data.space.branch.directoryRows.filter((row) => row.pointId && !row.hidden).length, 4, "initial map exposes knowledge outside its first chapter");
  initialMap.page.handleChapterToggle({ detail: { nodeId: chapters[1].id } });
  assert.equal(initialMap.page.data.space.branch.collapsed, false);
  assert.equal(initialMap.page.data.space.upcomingSection.title, "第二部分 时事政治");
  assert.equal(initialMap.page.data.space.upcomingSection.status, "暂未开放");
  assert.ok(!knowledgePackage.navigationNodes.some((node) => node.title.includes("时事政治")), "unavailable section was fabricated as formal content");
  const chapter = initialMap.page.data.space.branch.directoryRows.find((row) => row.nodeType === "chapter");
  initialMap.page.handleChapterToggle({ detail: { nodeId: chapter.id } });
  assert.equal(initialMap.page.data.space.branch.directoryRows.filter((row) => row.hidden && row.pointId).length, 4, "chapter folding affected the wrong knowledge rows");
  assert.equal(initialMap.page.data.space.branch.directoryRows.filter((row) => !row.hidden && row.pointId).length, 15);
  initialMap.page.handleRangeToggle();
  assert.equal(initialMap.page.data.space.branch.collapsed, true);
  initialMap.page.handleRangeToggle();
  assert.equal(initialMap.page.data.space.branch.directoryRows.find((row) => row.id === chapter.id).collapsed, true, "scope folding lost chapter state");
  initialMap.page.handleBranchNodeTap({ detail: { nodeId: "politics-toc-v2-n009" } });
  const foldedSnapshot = initialMap.page.knowledgeContext.snapshots.system;
  const restoredMap = loadPage("miniprogram/subpackages/politics/map/index.js", { storage: initialMap.storage });
  restoredMap.page.onLoad({ restore: "1" });
  assert.deepEqual(restoredMap.page.knowledgeContext.snapshots.system.collapsedChapterIds, foldedSnapshot.collapsedChapterIds);
  assert.equal(restoredMap.page.data.space.branch.directoryRows.find((row) => row.id === chapter.id).collapsed, true, "explicit map restore lost chapter folding");
  restoredMap.page.handleChapterToggle({ detail: { nodeId: chapter.id } });
  const fullyExpandedMap = loadPage("miniprogram/subpackages/politics/map/index.js", { storage: restoredMap.storage });
  fullyExpandedMap.page.onLoad({ restore: "1" });
  assert.ok(fullyExpandedMap.page.data.space.branch.directoryRows.filter((row) => row.collapsible).every((row) => !row.collapsed), "saved empty collapse list was replaced by defaults");
  initialMap.page.handleRegionTap({ detail: { nodeId: secondRegion.id } });
  assert.equal(initialMap.page.data.space.branch?.id, secondRegion.id, "switching articles did not update the list");
  assert.equal(initialMap.page.data.space.branch.directoryRows.filter((row) => row.pointId).length, 18, "scoped directory did not switch to the second article");
  assert.ok(initialMap.page.data.space.branch.directoryRows.every((row) => !row.collapsible && !row.hidden), "Marx article gained an invented chapter or hidden points");
  initialMap.page.handleRangeToggle();
  assert.equal(initialMap.page.data.space.branch.collapsed, true, "Marx article does not support whole-scope folding");
  const spaceWxml = read("miniprogram/components/knowledge-space-surface/index.wxml");
  assert.ok(!spaceWxml.includes("knowledge-space-head") && !spaceWxml.includes("knowledge-branch-back"), "obsolete header or panorama return is still rendered");
  assert.ok(spaceWxml.includes("space.branch.directoryRows"), "branch content did not reuse the complete directory row layout");
  const unit = knowledgePackage.knowledgeUnits.find((item) => (knowledgePackage.indexes.relationIdsByPointId[item.id] || []).length);
  let context = platform.applyContextEvent(knowledgePackage, platform.createKnowledgeContext("politics"), { type: "SELECT_POINT", pointId: unit.id, at: 1 });
  assert.equal(context.activity, "reading", "SELECT_POINT still diverts to relations");
  context = platform.applyContextEvent(knowledgePackage, context, { type: "UPDATE_SYSTEM_SNAPSHOT", snapshot: { expandedNodeIds: ["politics-toc-v2-n024"], scrollAnchorId: "node:u020", viewportToken: "L1" }, at: 2 });
  const restored = platform.fromRecentModuleContext(knowledgePackage, platform.toRecentModuleContext(knowledgePackage, context));
  assert.deepEqual(restored.snapshots.system, context.snapshots.system, "viewport did not survive context restore");
  const loaded = loadPage("miniprogram/subpackages/politics/map/index.js");
  loaded.page.onLoad({ state: "branch", scope: "politics-toc-v2-n024" });
  const leaf = knowledgePackage.navigationNodes.find((item) => item.parentId === "politics-toc-v2-n024" && item.pointId);
  loaded.page.handleBranchNodeTap({ currentTarget: { dataset: { nodeId: leaf.id } } });
  assert.equal(loaded.calls.navigateTo.length, 1, "opening a knowledge leaf must use native navigateTo");
  assert.ok(loaded.calls.navigateTo[0].url.includes("/subpackages/politics/detail/index"));
  assert.equal(loaded.page.data.space.surfaceState, "branch", "source page replaced its branch with full content");
  const invalidDetail = loadPage("miniprogram/subpackages/politics/detail/index.js");
  invalidDetail.page.onLoad({ id: "missing-point" });
  assert.ok(invalidDetail.page.data.loadError, "invalid knowledge link has no explanation");
  assert.equal(invalidDetail.calls.navigateBack.length, 0, "invalid shared link must retain a recovery page");
  invalidDetail.page.handleReturnHome();
  assert.equal(invalidDetail.calls.switchTab[0]?.url, "/pages/politics/index");
  const lostAnchor = loadPage("miniprogram/subpackages/politics/detail/index.js");
  lostAnchor.page.onLoad({ id: unit.id, block: "missing-block", origin: "search" });
  assert.match(lostAnchor.page.data.anchorNotice, /定位已失效/);
  const relationWithMultipleAnchors = knowledgePackage.relations.find((item) => item.targetBlockIds.length > 1);
  const relatedDetail = loadPage("miniprogram/subpackages/politics/detail/index.js", { anchorQuery: true });
  relatedDetail.page.onLoad({ id: relationWithMultipleAnchors.targetPointId, origin: "relation", refId: relationWithMultipleAnchors.id });
  assert.equal(relatedDetail.page.data.evidenceAnchors.length, relationWithMultipleAnchors.targetBlockIds.length, "relation omitted another target evidence block");
  assert.equal(relatedDetail.page.data.activeBlockId, relationWithMultipleAnchors.targetBlockIds[0], "relation did not land on target evidence");
  relatedDetail.page.handleEvidenceAnchorTap({ currentTarget: { dataset: { blockId: relationWithMultipleAnchors.targetBlockIds[1] } } });
  assert.equal(relatedDetail.page.data.activeBlockId, relationWithMultipleAnchors.targetBlockIds[1], "relation could not view the second evidence block");
  relatedDetail.page.onUnload();
  const recallDetail = loadPage("miniprogram/subpackages/politics/detail/index.js", { anchorQuery: true });
  recallDetail.page.onLoad({ id: unit.id });
  recallDetail.page.handleStartRecall();
  recallDetail.page.handleReveal();
  recallDetail.page.handleBackToReading();
  assert.equal(recallDetail.page.data.activeBlockId, recallDetail.page.data.cardSurface.recallFace.answerSourceBlockIds[0], "recall did not land on answer evidence");
  assert.equal(recallDetail.page.data.recallReturnVisible, true);
  recallDetail.page.handleReturnToRecall();
  assert.equal(recallDetail.page.data.recallView.answerVisible, true, "return from evidence lost the revealed recall state");
  assert.ok(read("miniprogram/components/knowledge-card-surface/index.wxml").includes("recallView.answerVisible"), "shared recall face is not bound to projected answer visibility");
  recallDetail.page.handleBlockTap({ detail: { blockId: unit.blocks[0].id } });
  recallDetail.page.handleSourceFeedback();
  assert.equal(recallDetail.page.data.sourceVisible, true, "source action did not open source details");
  assert.ok(recallDetail.page.data.cardSurface.sources[0].sourcePages.length, "PDF page reference missing");
  recallDetail.page.handleCorrectionOpen();
  recallDetail.page.handleCorrectionSave();
  const feedback = recallDetail.storage.get("politics-correction-queue-v1")[0];
  assert.equal(feedback.blockId, unit.blocks[0].id);
  assert.equal(feedback.contentVersion, unit.contentVersion);
  assert.ok(feedback.sourceRefIds.length && feedback.sourcePages.length, "feedback omitted source coordinates");
  recallDetail.page.onUnload();
  const failedDetail = loadPage("miniprogram/subpackages/politics/detail/index.js", { storageError: true });
  failedDetail.page.onLoad({ id: unit.id });
  failedDetail.page.setData({ correctionVisible: true, correctionDescription: "这处来源需要核对" });
  failedDetail.page.handleCorrectionSave();
  assert.equal(failedDetail.page.data.correctionVisible, true, "failed feedback write must keep the editor open");
  assert.equal(failedDetail.calls.toast.at(-1)?.title, "保存失败，请重试");
  const failedSearch = loadPage("miniprogram/subpackages/politics/search/index.js", { storageError: true });
  failedSearch.page.onLoad({});
  failedSearch.page.runSearch(unit.title);
  failedSearch.page.openResult(failedSearch.page.data.results[0], 0);
  assert.equal(failedSearch.calls.navigateTo.length, 1, "search should still open a result when recent position storage fails");
  assert.match(failedSearch.page.data.storageNotice, /未能保存/);
  const mapWxml = read("miniprogram/subpackages/politics/map/index.wxml");
  assert.ok(!/scroll-x(?:\s|=)/.test(mapWxml), "320px structure still depends on horizontal scrolling");
  assertIsolation();
});

gate("j2", "J2-anchors", "快速了解按四站和六个profile锚点推进，缺锚点诚实降级", ["state", "view-model", "negative"], EXPECTED_ACCEPTANCE.j2.slice(0, 3), () => {
  const expectedAnchors = ["politics-toc-v2-n006", "politics-toc-v2-n007", "politics-toc-v2-n025", "politics-toc-v2-n029", "politics-toc-v2-n032", "politics-toc-v2-n038"];
  const quick = plan("quick");
  assert.deepEqual(quick.options.anchorNodeIds, expectedAnchors, "runtime profile does not carry the six frozen anchors");
  assert.deepEqual(quick.steps.map((item) => item.stage), ["overview", "branch", "branch", "closure"]);
  assert.equal(quick.startProjection.quickStops.length, 4, "quick start does not expose four distinguishable stops");
  assert.deepEqual(quick.startProjection.quickStops.map((item) => item.anchors.length), [0, 2, 4, 0], "six anchors are not assigned to their two formal branches");
  assert.equal(quick.startProjection.quickStops.flatMap((item) => item.anchors || []).length, 6);
  let session = platform.createRouteSession(quick, 1);
  for (let index = 0; index < 4; index += 1) session = platform.applyRouteSessionEvent(quick, session, { type: "COMPLETE_TOUR_STOP", at: index + 2 });
  assert.equal(session.status, "completed");
  const broken = clone(knowledgePackage);
  broken.moduleProfile.routeDefaults.quick.anchorNodeIds = [...expectedAnchors, "missing-node"];
  const degraded = platform.planRecommendedRoute(broken, "quick");
  assert.equal(degraded.capabilityLevel, "structure-only", "missing anchor is not exposed as structure-only");
  assert.equal(degraded.startProjection.quickStops.flatMap((item) => item.anchors).length, 0, "structure-only fallback still exposes a partial guessed anchor set");
});

gate("j2", "J2-consumption", "快速了解消费共享空间、完整GoalGuide并在锚点往返后留在原站", ["wxml", "restore", "isolation"], EXPECTED_ACCEPTANCE.j2.slice(3), () => {
  assertComponentUsed("miniprogram/subpackages/politics/route/index", "knowledge-space-surface");
  const wxml = read("miniprogram/subpackages/politics/route/guided-route.wxml");
  for (const binding of ["route.guide.purpose", "route.guide.instruction", "route.guide.completionEvent", "route.guide.progressText", "route.guide.next", "route.current.anchors"]) {
    assert.ok(hasBinding("miniprogram/subpackages/politics/route/guided-route.wxml", binding), `quick WXML does not consume ${binding}`);
  }
  assert.ok(!/掌握|学会/.test(wxml.match(/wx:if="\{\{type === 'quick'\}\}"[\s\S]*?wx:elif/)?.[0] || ""));
  const quick = plan("quick");
  const session = platform.applyRouteSessionEvent(quick, platform.createRouteSession(quick, 1), { type: "COMPLETE_TOUR_STOP", at: 2 });
  const restored = platform.normalizeRouteSession(quick, clone(session));
  assert.equal(restored.currentStepId, session.currentStepId);
  assert.equal(restored.currentIndex, session.currentIndex);
  const firstAnchor = quick.steps[1].anchors[0];
  const afterAnchor = platform.applyRouteSessionEvent(quick, restored, { type: "VIEW_TOUR_ANCHOR", anchorNodeId: firstAnchor.nodeId, at: 3 });
  assert.equal(afterAnchor.currentStepId, restored.currentStepId, "opening an anchor advanced the tour stop");
  assert.deepEqual(afterAnchor.viewedAnchorNodeIds, [firstAnchor.nodeId]);
  const loaded = loadPage("miniprogram/subpackages/politics/route/index.js");
  loaded.page.onLoad({ type: "quick" });
  loaded.page.handlePrimaryStart();
  loaded.page.handleTourNext();
  const pageAnchor = loaded.page.data.route.current.anchors[0];
  const pageStepId = loaded.page.data.route.session.currentStepId;
  loaded.page.handleTourAnchor({ currentTarget: { dataset: { nodeId: pageAnchor.nodeId } } });
  assert.equal(loaded.calls.navigateTo.length, 1, "quick anchor must open the shared native detail page");
  assert.ok(loaded.calls.navigateTo[0].url.includes(`/subpackages/politics/detail/index?id=${encodeURIComponent(pageAnchor.pointId)}`));
  assert.equal(loaded.page.data.route.session.currentStepId, pageStepId, "native anchor visit changed the current tour stop");
  assert.equal(loaded.page.data.route.report.viewedAnchors, 1, "visited anchor fact was not recorded in RouteSession");
  assertIsolation();
});

gate("j2v2", "J2-primer-content", "J2 v2消费八段可回源review primer与诚实内容覆盖声明", ["state", "view-model", "negative"], [
  "J2V2-source",
  "J2V2-coverage",
  "J2V2-structure-context",
  "J2V2-honest-degrade",
], () => {
  const fixture = buildQuickPrimerFixture(knowledgePackage);
  assertQuickPrimerContent(knowledgePackage, fixture.primer, fixture.coverage);
  const brokenFixture = clone(fixture);
  brokenFixture.primer.sections[0].narrativeSegments[0].sourceBlockIds = ["missing-block"];
  brokenFixture.primer.sections[0].narrativeSegments[0].sourceAtomRefIds = [];
  assert.throws(() => assertQuickPrimerContent(knowledgePackage, brokenFixture.primer, brokenFixture.coverage), /missing source block/, "fixture gate accepts a dangling source");

  assert.ok(Array.isArray(knowledgePackage.quickPrimers), "review package does not expose quickPrimers");
  const primer = knowledgePackage.quickPrimers.find((item) => item.id === J2V2_PRIMER_ID);
  assert.ok(primer, "confirmed J2 v2 primer is missing from the review package");
  assertQuickPrimerContent(knowledgePackage, primer, knowledgePackage.contentCoverage);
  const brokenPackage = clone(knowledgePackage);
  const firstBlockId = primer.sections.flatMap((section) => section.narrativeSegments).flatMap((segment) => segment.sourceBlockIds || [])[0];
  for (const unit of brokenPackage.knowledgeUnits) unit.blocks = unit.blocks.filter((block) => block.id !== firstBlockId);
  assert.throws(() => assertQuickPrimerContent(brokenPackage, brokenPackage.quickPrimers.find((item) => item.id === J2V2_PRIMER_ID), brokenPackage.contentCoverage), /missing source block|atom source block is missing/, "production primer stays available after a required source disappears");
});

gate("j2v2", "J2-primer-consumption", "J2 v2逐步导读支持前后步、暂停恢复、详情往返与明确结束", ["wxml", "restore", "isolation"], [
  "J2V2-render",
  "J2V2-continuous-flow",
  "J2V2-native-touch",
  "J2V2-detail-return",
  "J2V2-completion",
  "J2V2-mobile-a11y-isolation",
], () => {
  assert.equal(typeof platform.projectQuickPrimerViewModel, "function", "QuickPrimerProjection projector is missing");
  const quick = plan("quick");
  assert.equal(quick.primerId, J2V2_PRIMER_ID, "quick plan does not bind the confirmed primer");
  assert.equal(quick.sourcePackageVersion, knowledgePackage.packageVersion);
  assert.deepEqual(quick.steps.map((item) => item.sectionId), J2V2_SECTION_IDS, "quick plan is not the frozen eight-section flow");
  assert.ok(quick.steps.every((item) => item.subject === "quick-primer" && item.eventType === "VIEW_QUICK_SECTION"), "quick plan still uses tour stops");
  assert.ok(!quick.steps.some((item) => item.eventType === "COMPLETE_TOUR_STOP"), "J2 v2 still requires tour-stop completion");

  let session = platform.createRouteSession(quick, 1);
  const initial = platform.projectRouteViewModel(knowledgePackage, quick, session).experience.quickPrimer;
  assert.equal(initial.sections.length, 8);
  assert.equal(initial.currentSectionId, "J2V2-SEC-01");
  const premature = platform.applyRouteSessionEvent(quick, session, { type: "COMPLETE_QUICK_PRIMER", at: 2 });
  assert.equal(premature.status, "active", "quick primer completes before SEC-08 and reflection");
  session = platform.applyRouteSessionEvent(quick, session, { type: "VIEW_QUICK_SECTION", sectionId: "J2V2-SEC-08", at: 3 });
  const beforeDetail = clone(session);
  session = platform.applyRouteSessionEvent(quick, session, { type: "OPEN_QUICK_DETAIL", sectionId: "J2V2-SEC-08", pointId: "politics-toc-v2-u002", at: 4 });
  assert.equal(session.currentStepId, beforeDetail.currentStepId, "opening an optional detail advanced the primer");
  session = platform.applyRouteSessionEvent(quick, session, { type: "SUBMIT_QUICK_REFLECTION", text: "两条主线在现实实践中相连", at: 5 });
  const reflected = platform.projectRouteViewModel(knowledgePackage, quick, session).experience.quickPrimer;
  assert.equal(reflected.reflection.status, "submitted");
  session = platform.applyRouteSessionEvent(quick, session, { type: "COMPLETE_QUICK_PRIMER", at: 6 });
  assert.equal(session.status, "completed");
  const restored = platform.normalizeRouteSession(quick, clone(session));
  assert.deepEqual(platform.projectRouteViewModel(knowledgePackage, quick, restored).experience.quickPrimer.reflection, reflected.reflection);
  assert.equal(platform.normalizeRouteSession(quick, { ...session, packageVersion: "stale" }).status, "expired");

  let clickOnly = platform.createRouteSession(quick, 1);
  clickOnly = platform.applyRouteSessionEvent(quick, clickOnly, { type: "OPEN_QUICK_REFERENCE", at: 2 });
  assert.equal(clickOnly.quickReferenceOpened, false, "reference opened before reaching the final section");
  clickOnly = platform.applyRouteSessionEvent(quick, clickOnly, { type: "VIEW_QUICK_SECTION", sectionId: "J2V2-SEC-08", at: 3 });
  assert.equal(platform.applyRouteSessionEvent(quick, clickOnly, { type: "COMPLETE_QUICK_PRIMER", at: 4 }).status, "active", "guide finished before reference was opened");
  clickOnly = platform.applyRouteSessionEvent(quick, clickOnly, { type: "OPEN_QUICK_REFERENCE", at: 5 });
  const referenceView = platform.projectQuickPrimerViewModel(knowledgePackage, quick, clickOnly);
  assert.equal(referenceView.sections.at(-1).narrativeSegments.length, 0, "reference was duplicated in normal narrative");
  assert.ok(referenceView.reflection.referenceSegments.length > 0);
  assert.equal(referenceView.reflection.referenceSegments.map((item) => item.text).join(""), referenceView.reflection.referenceExpression, "reference lost its canonical explanation");
  clickOnly = platform.applyRouteSessionEvent(quick, clickOnly, { type: "COMPLETE_QUICK_PRIMER", at: 6 });
  assert.equal(clickOnly.status, "completed", "no-input route could not finish");
  assert.equal(clickOnly.quickReflection.status, "pending", "reading was reported as submitting an answer");
  assert.equal(clickOnly.visitedSectionIds.length, 2, "completion fabricated visits to skipped sections");
  assert.deepEqual(clickOnly.completedStepIds, [quick.steps.at(-1).stepId], "legacy visits were fabricated as explicit step completions");
  for (const status of ["pending", "submitted", "skipped"]) {
    const old = platform.createRouteSession(quick, 1);
    delete old.quickReferenceOpened;
    old.quickReflection = { text: status === "skipped" ? "" : "历史输入不覆盖", status, referenceVisible: status !== "pending" };
    const migrated = platform.normalizeRouteSession(quick, old);
    assert.deepEqual(migrated.quickReflection, old.quickReflection, "legacy reflection was overwritten");
    assert.equal(migrated.quickReferenceOpened, status !== "pending");
  }

  const wxml = read("miniprogram/subpackages/politics/route/guided-route.wxml");
  const wxss = read("miniprogram/subpackages/politics/route/guided-route.wxss");
  for (const binding of ["route.experience.quickPrimer.sections", "item.narrativeSegments", "item.structureFocus", "route.experience.quickPrimer.scopeSummary", "route.experience.quickPrimer.reflection"]) {
    assert.ok(wxml.includes(binding), `quick primer WXML does not consume ${binding}`);
  }
  for (const nativeBinding of ["bindtap=\"handleQuickDetail\"", "bindtap=\"handleQuickReference\"", "bindtap=\"handleQuickComplete\""]) {
    assert.ok(wxml.includes(nativeBinding), `quick primer native control is missing ${nativeBinding}`);
  }
  assert.ok(!/<textarea|handleQuickReflectionInput|handleQuickReflectionSubmit|handleQuickReflectionSkip/.test(wxml), "quick guide still requires keyboard input or split submit/skip branches");
  assert.ok(!/handleTourNext|当前一站|下一站|跳过当前站|knowledge-space-surface/.test(wxml), "guided quick surface still contains v1 tour gates");
  assert.ok(!/scroll-x(?:\s|=)|white-space\s*:\s*nowrap/.test(`${wxml}\n${wxss}`), "320px quick flow still depends on horizontal movement");

  const loaded = loadPage("miniprogram/subpackages/politics/route/index.js");
  loaded.page.onLoad({ type: "quick" });
  assert.equal(loaded.page.data.screen, "active", "quick still opens a recommendation/ready gate before SEC-01");
  assert.equal(loaded.page.data.route.experience.quickPrimer.sections.length, 8, "page does not render all primer sections");
  assert.equal(loaded.page.data.route.experience.quickPrimer.position, 1);
  loaded.page.handleQuickPrevious();
  loaded.page.handleQuickReference();
  assert.equal(loaded.page.session.currentIndex, 0, "first step moved backwards or jumped to reference");
  assert.equal(loaded.page.session.quickReferenceOpened, false);
  loaded.page.handleQuickNext();
  assert.equal(loaded.page.session.currentIndex, 1);
  assert.deepEqual(loaded.page.session.completedStepIds, [quick.steps[0].stepId]);
  loaded.page.handleQuickPrevious();
  assert.equal(loaded.page.session.currentIndex, 0);
  loaded.page.handleQuickNext();
  assert.equal(loaded.page.session.completedStepIds.length, 1, "revisiting a step duplicated completion");
  const detailSection = loaded.page.data.route.experience.quickPrimer.sections[1];
  const stepBeforeDetail = loaded.page.data.route.session.currentStepId;
  loaded.page.handleQuickDetail({ currentTarget: { dataset: { sectionId: detailSection.id, pointId: detailSection.detail.pointId } } });
  assert.equal(loaded.calls.navigateTo.length, 1, "optional quick detail does not use the native detail page");
  assert.ok(loaded.calls.navigateTo[0].url.includes(`/subpackages/politics/detail/index?id=${encodeURIComponent(detailSection.detail.pointId)}`));
  assert.equal(loaded.page.session.currentStepId, stepBeforeDetail, "optional detail advanced the guide");
  loaded.page.handleQuickPause();
  assert.equal(loaded.calls.navigateBack.length, 1);
  assert.equal(loaded.storage.get("knowledgeRoute:politics:quick").session.currentStepId, stepBeforeDetail, "pause lost position");
  while (loaded.page.session.currentIndex < 7) loaded.page.handleQuickNext();
  loaded.page.handleQuickNext();
  assert.equal(loaded.page.session.currentIndex, 7, "last step advanced past the route");
  assert.equal(loaded.page.session.status, "active", "reaching the final step completed the guide");
  loaded.page.handleQuickComplete();
  assert.equal(loaded.page.session.status, "active", "guide completed before opening reference");
  loaded.page.handleQuickReference();
  assert.equal(loaded.page.data.route.experience.quickPrimer.reflection.referenceVisible, true);
  assert.equal(loaded.page.session.quickReflection.status, "pending", "opening reference fabricated an answer");
  assert.equal(loaded.page.session.quickReflection.text, "");
  loaded.page.handleQuickPrevious();
  loaded.page.handleQuickComplete();
  assert.equal(loaded.page.session.status, "active", "guide completed away from the final step");
  loaded.page.handleQuickNext();
  loaded.page.handleQuickComplete();
  assert.equal(loaded.page.data.screen, "completed", "explicit quick completion handler did not finish the route");
  assert.equal(loaded.page.session.completedStepIds.length, 8);
  assert.equal(loaded.page.session.visitedSectionIds.length, 8);
  assert.equal(loaded.page.data.route.guide.completion.primaryAction.id, "start-systematic");
  loaded.page.handleCompletionPrimary();
  assert.equal(loaded.calls.redirectTo.at(-1).url, "/subpackages/politics/route/index?type=systematic");
  const systematicPlan = plan("systematic");
  const savedSystematic = { planOptions: systematicPlan.options, session: platform.createRouteSession(systematicPlan, 1) };
  loaded.storage.set("knowledgeRoute:politics:systematic", clone(savedSystematic));
  loaded.page.renderSession();
  assert.equal(loaded.page.data.systematicNextLabel, "继续系统学习");
  loaded.page.handleCompletionPrimary();
  assert.equal(loaded.calls.redirectTo.at(-1).url, "/subpackages/politics/route/index?type=systematic&resume=1");
  assert.deepEqual(loaded.storage.get("knowledgeRoute:politics:systematic"), savedSystematic, "handoff rewrote existing systematic progress");
  loaded.storage.set("knowledgeRoute:politics:systematic", { ...savedSystematic, session: { ...savedSystematic.session, status: "completed", currentIndex: systematicPlan.steps.length } });
  loaded.page.renderSession();
  assert.equal(loaded.page.data.systematicNextLabel, "进入系统学习");
  loaded.page.handleCompletionPrimary();
  assert.equal(loaded.calls.redirectTo.at(-1).url, "/subpackages/politics/route/index?type=systematic");
  const legacy = platform.createRouteSession(quick, 1);
  legacy.currentIndex = 3;
  legacy.currentStepId = quick.steps[3].stepId;
  legacy.visitedSectionIds = quick.steps.slice(0, 4).map((s) => s.sectionId);
  const legacyStorage = new Map([["knowledgeRoute:politics:quick", { planOptions: quick.options, session: legacy }]]);
  const resumed = loadPage("miniprogram/subpackages/politics/route/index.js", { storage: legacyStorage });
  resumed.page.onLoad({ type: "quick" });
  assert.equal(resumed.page.session.currentIndex, 3, "legacy scroll position did not resume at the same step");
  assert.deepEqual(resumed.page.session.completedStepIds, [], "legacy visits were fabricated as step completions");
  assert.deepEqual(resumed.page.session.visitedSectionIds, legacy.visitedSectionIds);
  for (const binding of ['bindtap="handleQuickNext"', 'bindtap="handleQuickPrevious"', 'bindtap="handleRoutePause"', 'item.id === route.experience.quickPrimer.currentSectionId', 'route.progress.task']) assert.ok(wxml.includes(binding), binding);
  assert.ok(!read("miniprogram/subpackages/politics/route/guided-route.js").includes("createIntersectionObserver"), "scroll still advances steps");
  const failed = loadPage("miniprogram/subpackages/politics/route/index.js", { storageError: true });
  failed.page.onLoad({ type: "quick" });
  failed.page.handleQuickPause();
  assert.equal(failed.calls.navigateBack.length, 0, "failed save still exited the guide");
  assert.equal(failed.page.systematicContinuation().error, true, "unreadable systematic progress was treated as absent");
  assertIsolation();
});

gate("j3", "J3-cycle", "系统学习由四个同源大卡的reading→recall两阶段组成", ["state", "view-model", "negative"], EXPECTED_ACCEPTANCE.j3.slice(0, 4), () => {
  const systematic = plan("systematic");
  assert.equal(systematic.scopeId, "politics-toc-v2-n003");
  assert.equal(systematic.startProjection.knowledgeCount, 4);
  assert.equal(systematic.startProjection.recallCount, 4);
  assert.ok(Object.hasOwn(systematic.startProjection, "outsidePrerequisites"), "ready projection omits outside prerequisites");
  assert.deepEqual(systematic.steps.map((item) => item.stage), ["reading", "recall", "reading", "recall", "reading", "recall", "reading", "recall"]);
  assert.equal(systematic.steps[0].pointId, "politics-toc-v2-u001");
  let session = platform.createRouteSession(systematic, 1);
  session = platform.applyRouteSessionEvent(systematic, session, { type: "COMPLETE_READING_STEP", at: 2 });
  assert.equal(systematic.steps[session.currentIndex].stage, "recall");
  const before = clone(session);
  const unrelated = platform.applyRouteSessionEvent(systematic, session, { type: "OPEN_RELATION", at: 3 });
  assert.deepEqual(unrelated, before, "opening a relation changed RouteSession");
});

gate("j3", "J3-consumption", "系统学习消费共享KnowledgeCard并显式处理恢复和存储失败", ["wxml", "restore", "isolation"], EXPECTED_ACCEPTANCE.j3.slice(4), () => {
  assertComponentUsed("miniprogram/subpackages/politics/route/index", "knowledge-card-surface");
  const wxml = read("miniprogram/subpackages/politics/route/guided-route.wxml");
  assert.ok(!/currentCard\.content|guided-reading-heading|guided-reading-text/.test(wxml), "guided route still owns a private formal-content renderer");
  assert.ok(hasBinding("miniprogram/subpackages/politics/route/guided-route.wxml", "storageStatus"), "storage status is not consumed");
  for (const type of ["quick", "systematic", "confusion", "exam"]) {
    const routePlan = plan(type);
    let routeSession = platform.createRouteSession(routePlan, 1);
    const first = platform.projectRouteViewModel(knowledgePackage, routePlan, routeSession).progress;
    assert.equal(first.position, 1);
    assert.ok(first.task && first.total > 0);
    assert.equal(first.segments.length, first.total);
    if (type === "systematic") {
      assert.equal(first.total, routePlan.stageGroups.length, "knowledge count was confused with phase count");
      assert.equal(first.phasePosition, 1);
      routeSession = platform.applyRouteSessionEvent(routePlan, routeSession, { type: "COMPLETE_READING_STEP", at: 2 });
      const recall = platform.projectRouteViewModel(knowledgePackage, routePlan, routeSession).progress;
      assert.equal(recall.position, 1);
      assert.equal(recall.phasePosition, 2);
      assert.match(recall.task, /主动回忆/);
    }
    if (type === "exam") {
      routeSession = platform.applyRouteSessionEvent(routePlan, routeSession, { type: "REVEAL_RECALL", at: 2 });
      assert.equal(platform.projectRouteViewModel(knowledgePackage, routePlan, routeSession).progress.phasePosition, 2);
      routeSession = platform.applyRouteSessionEvent(routePlan, routeSession, { type: "RECALL_RESULT", result: "fuzzy", at: 3 });
      assert.equal(platform.projectRouteViewModel(knowledgePackage, routePlan, routeSession).progress.phasePosition, 3);
    }
    if (type === "quick") {
      while (routeSession.currentIndex < 7) routeSession = platform.applyRouteSessionEvent(routePlan, routeSession, { type: "NEXT_QUICK_SECTION", at: 2 });
      assert.equal(platform.projectRouteViewModel(knowledgePackage, routePlan, routeSession).progress.canPause, false, "last quick step still offers pause");
    }
  }
  const systematic = plan("systematic");
  const saved = { ...platform.createRouteSession(systematic, 1), currentIndex: 1, currentStepId: systematic.steps[1].stepId };
  const restored = platform.normalizeRouteSession(systematic, clone(saved));
  assert.equal(restored.currentStepId, saved.currentStepId);
  const expired = platform.normalizeRouteSession(systematic, { ...saved, packageVersion: "stale" });
  assert.equal(expired.status, "expired");
  assert.ok(wxml.includes("start.details.orderGroups") && wxml.includes("start.details.outsidePrerequisites") && wxml.includes("wx:if=\"{{systematicOrderExpanded}}\""), "ready page omits expandable full order or outside prerequisites");
  assert.ok(wxml.includes("本次范围") && wxml.includes("学习顺序") && wxml.includes('bindtap="handleSystematicOrderToggle"'), "systematic launch page does not form a range-to-order learning path");
  assert.ok(wxml.includes('bindtap="handleScopePreview"') && wxml.includes('bindtap="handleScopeConfirm"'), "systematic range adjustment applies before replacing the launch plan");
  assert.match(wxml, /<view class="guided-primary guided-primary-action" bindtap="handlePrimaryStart" role="button"/, "J3 ready primary action must use the same tappable view pattern as its working secondary actions");
  assert.ok(wxml.includes("{{startFeedback}}") && wxml.includes("{{startError}}"), "J3 entry tap or startup failure has no visible feedback");
  assert.ok(!wxml.includes("activeConflict") && !wxml.includes("pendingStartConfirmation"), "J3 still asks to pause another learning goal");
  assert.ok(wxml.includes("route.experience.systematic.orientation.outsidePrerequisites.length") && wxml.includes("route.progress.task") && read("miniprogram/components/knowledge-card-surface/index.wxml").includes("card.presentation.relationStyle === 'reader'"), "systematic page should show only actionable outside prerequisites, a non-clickable two-stage indicator, and its dedicated card projection");
  assert.ok(wxml.includes("完成阅读并回忆") && wxml.includes("跳过当前阶段") && wxml.includes("guided-system-toolbar"), "systematic actions are not presented in a fixed, stage-aware toolbar");
  const cardWxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
  assert.ok(cardWxml.includes('wx:if="{{recallView.answerVisible}}" class="knowledge-card-recall-answer"') && !cardWxml.includes('wx:else class="knowledge-card-recall-answer"'), "systematic recall renders an empty answer before reveal");
  const routeWxss = read("miniprogram/subpackages/politics/route/guided-route.wxss");
  assert.ok(routeWxss.includes(".guided-system-toolbar-actions > .guided-primary-action") && routeWxss.includes("var(--ui-color-accent"), "systematic launch page does not share the fixed action palette");
  assert.ok(routeWxss.includes(".guided-system-toolbar-primary") && routeWxss.includes(".guided-route-systematic .guided-complete-mark"), "systematic completion does not share the fixed action palette");
  assert.ok(wxml.includes('bind:relationtap="handleSystemRelation"') && wxml.includes('bindtap="handleStorageRetry"'), "relation or storage action is not wired");
  assert.ok(wxml.includes('wx:if="{{relationError}}"'), "relation navigation failure has no visible retry hint");
  const routePage = "miniprogram/subpackages/politics/route/index.js";
  const loaded = loadPage(routePage);
  loaded.page.onLoad({ type: "systematic" });
  assert.equal(loaded.page.data.screen, "recommendation");
  assert.equal(loaded.page.data.start.details.knowledgeTitles.length, systematic.startProjection.knowledgeCount);
  assert.equal(loaded.page.data.start.details.orderPreview.length, systematic.startProjection.knowledgeCount);
  loaded.page.handlePrimaryStart();
  assert.equal(loaded.page.data.route.current.stage, "reading");
  assert.equal(loaded.page.data.currentCard.identity.pointId, systematic.steps[0].pointId);
  assert.equal(loaded.page.data.currentCard.presentation.mode, "systematic-learning");
  assert.equal(loaded.page.data.currentCard.presentation.summaryLabel, "");
  assert.equal(loaded.page.data.currentCard.presentation.relationStyle, "reader");
  const stepBeforeRelation = loaded.page.session.currentStepId;
  loaded.page.handleSystemRelation({ detail: { relationId: systematic.steps[0].relationContextIds[0] } });
  assert.equal(loaded.page.session.currentStepId, stepBeforeRelation, "relation opened a new learning step");
  assert.equal(loaded.calls.navigateTo.length, 1, "formal relation did not open the shared detail page");
  loaded.page.onShow();
  assert.equal(loaded.page.session.currentStepId, stepBeforeRelation, "return from relation lost the learning step");
  loaded.page.handleSystemRelation({ detail: { relationId: systematic.steps[0].relationContextIds[0] } });
  loaded.calls.navigateTo[1].fail();
  assert.equal(loaded.page.pendingSystemReturn, false, "failed relation navigation left a false pending return");
  assert.ok(loaded.page.data.relationError.includes("重试"), "failed relation navigation is silent");
  assert.equal(loaded.page.session.currentStepId, stepBeforeRelation, "failed relation navigation changed the learning step");
  loaded.page.handleSystemNext();
  assert.equal(loaded.page.data.currentCard.activity, "recall");
  assert.equal(loaded.page.data.currentCard.presentation.showSummaryDuringRecall, false, "systematic recall should project the prompt and answer without repeating the reading summary");
  assert.equal(loaded.page.data.route.current.stage, "recall");
  const resumed = loadPage(routePage, { storage: loaded.storage });
  resumed.page.onLoad({ type: "systematic", resume: "1" });
  assert.equal(resumed.page.session.currentStepId, systematic.steps[1].stepId, "cold restore lost recall position");
  const alternateScope = platform.projectRouteScopeOptions(knowledgePackage, "systematic").find((item) => item.enabled && item.id !== systematic.scopeId);
  const adjustedPlan = platform.planLearningRoute(knowledgePackage, { type: "systematic", scopeId: alternateScope.id });
  const adjustedStorage = new Map([["knowledgeRoute:politics:systematic", { planOptions: adjustedPlan.options, session: platform.createRouteSession(adjustedPlan, 1) }]]);
  const adjusted = loadPage(routePage, { storage: adjustedStorage });
  adjusted.page.onLoad({ type: "systematic", resume: "1" });
  assert.equal(adjusted.page.plan.id, adjustedPlan.id, "adjusted scope was replaced by the default recommendation");
  const failing = { storageError: true };
  const readFailure = loadPage(routePage, failing);
  readFailure.page.onLoad({ type: "systematic" });
  assert.equal(readFailure.page.data.storageStatus.ok, false);
  readFailure.page.handlePrimaryStart();
  assert.equal(readFailure.page.data.screen, "recommendation", "unreadable previous progress was overwritten");
  failing.storageError = false;
  readFailure.page.handleStorageRetry();
  assert.equal(readFailure.page.data.storageStatus.ok, true, "read retry did not recover");
  const writeFailure = { storageError: false };
  const unsaved = loadPage(routePage, writeFailure);
  unsaved.page.onLoad({ type: "systematic" });
  writeFailure.storageError = true;
  unsaved.page.handlePrimaryStart();
  assert.equal(unsaved.page.data.screen, "unsaved");
  writeFailure.storageError = false;
  unsaved.page.handleStorageRetry();
  assert.equal(unsaved.page.data.screen, "active", "write retry did not restore the current step");
  const brokenStart = loadPage(routePage);
  brokenStart.page.onLoad({ type: "systematic" });
  brokenStart.page.renderSession = () => { throw new Error("simulated-render-failure"); };
  const oldConsoleError = console.error;
  try {
    console.error = () => {};
    brokenStart.page.handlePrimaryStart();
  } finally {
    console.error = oldConsoleError;
  }
  assert.ok(brokenStart.page.data.startError, "startup exception did not surface to the user");
  const quick = plan("quick");
  const quickRecord = { planOptions: quick.options, session: platform.createRouteSession(quick, 1) };
  const independentStorage = new Map([["knowledgeRoute:politics:active", quickRecord]]);
  const independent = loadPage(routePage, { storage: independentStorage });
  independent.page.onLoad({ type: "systematic" });
  independent.page.handlePrimaryStart();
  assert.equal(independent.page.data.screen, "active", "quick progress blocked systematic learning");
  assert.equal(independentStorage.get("knowledgeRoute:politics:active").session.planId, quickRecord.session.planId, "legacy quick progress was overwritten");
  assert.equal(independentStorage.get("knowledgeRoute:politics:systematic").planOptions.type, "systematic", "systematic progress was not saved separately");
  const quickReturn = loadPage(routePage, { storage: independentStorage });
  quickReturn.page.onLoad({ type: "quick" });
  assert.equal(quickReturn.page.session.planId, quickRecord.session.planId, "returning to quick did not recover its own progress");
  const systematicReturn = loadPage(routePage, { storage: independentStorage });
  systematicReturn.page.onLoad({ type: "systematic", resume: "1" });
  assert.equal(systematicReturn.page.data.screen, "active", "returning to systematic did not resume its own progress");
  const homeDecision = platform.projectHomeDecision(knowledgePackage, { routeRecords: [quickRecord, independentStorage.get("knowledgeRoute:politics:systematic")] });
  assert.ok(homeDecision.otherGoals.some((item) => item.id === "quick" && item.href.includes("resume=1")), "home does not expose independent quick progress");
  let finished = platform.createRouteSession(systematic, 1);
  for (const result of ["fuzzy", "missed", "remembered", "remembered"]) {
    finished = platform.applyRouteSessionEvent(systematic, finished, { type: "COMPLETE_READING_STEP", at: 2 });
    finished = platform.applyRouteSessionEvent(systematic, finished, { type: "REVEAL_RECALL", at: 3 });
    finished = platform.applyRouteSessionEvent(systematic, finished, { type: "RECALL_RESULT", result, at: 4 });
    if (result !== "remembered") finished = platform.applyRouteSessionEvent(systematic, finished, { type: "NEXT_RECALL_CARD", at: 5 });
  }
  assert.equal(finished.status, "completed", "four-card systematic journey did not complete");
  const completedReport = platform.projectRouteViewModel(knowledgePackage, systematic, finished).report;
  assert.equal(completedReport.recallResults.fuzzy, 1);
  assert.equal(completedReport.recallResults.missed, 1);
  assert.equal(completedReport.nextScope?.id, "politics-toc-v2-n008", "next range was not derived from the formal sibling order");
  assert.ok(wxml.includes("route.report.recallResults.fuzzy") && wxml.includes("route.report.recallResults.missed") && wxml.includes("route.report.nextScope"), "J3 completion omits recall facts or next scope");
  assert.ok(wxml.includes("route.guide.next ? '先继续下一个知识' : '查看本次结果'"), "last systematic recall still promises another knowledge card");
  let lastSystematic = platform.createRouteSession(systematic, 1);
  for (let index = 0; index < systematic.stageGroups.length; index += 1) {
    lastSystematic = platform.applyRouteSessionEvent(systematic, lastSystematic, { type: "COMPLETE_READING_STEP", at: index + 2 });
    lastSystematic = platform.applyRouteSessionEvent(systematic, lastSystematic, { type: "REVEAL_RECALL", at: index + 3 });
    lastSystematic = platform.applyRouteSessionEvent(systematic, lastSystematic, { type: "RECALL_RESULT", result: index === systematic.stageGroups.length - 1 ? "fuzzy" : "remembered", at: index + 4 });
  }
  assert.equal(lastSystematic.status, "active");
  assert.equal(platform.projectGoalGuide(systematic, lastSystematic).next, null, "last systematic recall invents a next knowledge step");
  assert.equal(platform.applyRouteSessionEvent(systematic, lastSystematic, { type: "NEXT_RECALL_CARD", at: 20 }).status, "completed");
  const completedStorage = new Map([["knowledgeRoute:politics:systematic", { planOptions: systematic.options, session: finished }]]);
  const completedPage = loadPage(routePage, { storage: completedStorage });
  completedPage.page.onLoad({ type: "systematic", resume: "1" });
  assert.equal(completedPage.page.data.screen, "completed");
  completedPage.page.handleSystemNextScope();
  assert.ok(completedPage.calls.redirectTo[0]?.url.includes("scope=politics-toc-v2-n008"), "next range action did not open the formal next chapter");
  const scopePicker = loadPage(routePage);
  scopePicker.page.onLoad({ type: "systematic" });
  const originalScopeId = scopePicker.page.plan.scopeId;
  const pickerScope = platform.projectRouteScopeOptions(knowledgePackage, "systematic").find((item) => item.enabled && item.id !== originalScopeId);
  scopePicker.page.handleAdjust();
  assert.equal(scopePicker.page.data.adjusting, true, "range adjustment did not open");
  const allScopes = platform.projectRouteScopeOptions(knowledgePackage, "systematic");
  const sectionScopes = allScopes.filter((item) => item.parentId === "politics-toc-v2-n008");
  assert.equal(sectionScopes.length, 15, "scope selection still depends on the last visited section");
  assert.ok(sectionScopes.every((item) => item.nodeType === "section" && item.pointCount === 1));
  assert.equal(platform.projectRouteScopePicker(knowledgePackage, "systematic").length, 2, "collapsed scope tree must contain two article roots");
  assert.ok(!allScopes.some((item) => item.parentId === "politics-toc-v2-n024"), "scope picker invented chapters for Marx article");
  scopePicker.page.handleScopeExpand({ currentTarget: { dataset: { scopeId: "politics-toc-v2-n008" } } });
  assert.equal(scopePicker.page.data.adjustmentScopeRows.filter((item) => item.parentId === "politics-toc-v2-n008").length, 0, "chapter selection exposed individual sections");
  assert.ok(!scopePicker.page.data.adjustmentScopeRows.find((item) => item.id === "politics-toc-v2-n008").hasChildren, "chapter selection still has an expand action");
  assert.equal(scopePicker.page.data.adjustmentScopeId, originalScopeId, "attempting to expand a terminal chapter changed the selection");
  scopePicker.page.handleScopePreview({ currentTarget: { dataset: { scopeId: "politics-toc-v2-n008" } } });
  scopePicker.page.handleAdjustClose();
  assert.equal(scopePicker.page.plan.scopeId, originalScopeId, "cancelling a draft scope changed the plan");
  scopePicker.page.handleAdjust();
  assert.equal(scopePicker.page.data.adjustmentScopeId, originalScopeId);
  scopePicker.page.handleScopePreview({ currentTarget: { dataset: { scopeId: pickerScope.id } } });
  assert.equal(scopePicker.page.plan.scopeId, originalScopeId, "previewing a range changed the learning plan before confirmation");
  assert.equal(scopePicker.page.data.adjustmentScopeId, pickerScope.id, "selected range was not retained for confirmation");
  scopePicker.page.handleScopeConfirm();
  assert.equal(scopePicker.page.plan.scopeId, pickerScope.id, "confirmed range did not replace the launch plan");
  assert.equal(scopePicker.page.data.adjusting, false, "confirmed range left the selection panel open");
  assertIsolation();
});

gate("j4", "J4-contrast", "易混突破绑定正式pair、初答、双侧依据和复答，缺失时不可用", ["state", "view-model", "negative"], EXPECTED_ACCEPTANCE.j4.slice(0, 2).concat(EXPECTED_ACCEPTANCE.j4.slice(3)), () => {
  const confusion = plan("confusion");
  const pairId = "contrast-pair:politics-toc-v2-u025:politics-toc-v2-u024";
  assert.equal(confusion.steps[0].contrastPairId, pairId);
  assert.deepEqual(confusion.steps.map((item) => item.stage), ["judgment", "boundary", "evidence", "retest"]);
  let session = platform.createRouteSession(confusion, 1);
  session = platform.applyRouteSessionEvent(confusion, session, { type: "REVEAL_CONTRAST_KEY", result: "unsure", at: 2 });
  assert.equal(session.responseByStepId[confusion.steps[0].stepId], "unsure", "initial judgment was not recorded");
  session = platform.applyRouteSessionEvent(confusion, session, { type: "CONFIRM_CONTRAST_BOUNDARY", at: 3 });
  const oneSided = platform.applyRouteSessionEvent(confusion, session, { type: "VIEW_CONTRAST_EVIDENCE", leftOpened: true, rightOpened: false, at: 4 });
  assert.equal(oneSided.currentStepId, session.currentStepId, "one-sided evidence incorrectly advanced the session");
  const contrastView = platform.projectRouteViewModel(knowledgePackage, confusion, session).experience.confusion;
  const vm = contrastView.contrastPair;
  assert.equal(vm.sourceBlockIds.length, 2);
  assert.equal(vm.sourceRefIds.length, 2);
  assert.ok(contrastView.comparisonPrompt.includes(vm.dimensions[0]) && contrastView.sourceTitle && contrastView.targetTitle, "self-check lost the formal pair dimension or one of its knowledge titles");
  assert.notEqual(contrastView.comparisonPrompt, vm.recallItems[0].prompt, "pair retest reused an unrelated one-sided recall question");
  for (const pair of knowledgePackage.contrastPairs) {
    const relation = knowledgePackage.relations.find((item) => item.type === "contrast" && [pair.leftPointId, pair.rightPointId].includes(item.sourcePointId) && [pair.leftPointId, pair.rightPointId].includes(item.targetPointId));
    const routePlan = platform.planLearningRoute(knowledgePackage, { type: "confusion", scopeId: knowledgePackage.indexes.rootNavigationIds[0], relationId: relation.id });
    const sides = platform.projectRouteViewModel(knowledgePackage, routePlan, platform.createRouteSession(routePlan, 1)).experience.confusion.contrastPair.sides;
    assert.equal(sides.length, 2);
    for (const side of sides) {
      const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === pair[`${side.side}PointId`]);
      const atoms = knowledgePackage.knowledgeAtomRefs.filter((item) => pair[`${side.side}AtomRefIds`].includes(item.id));
      const ids = new Set(atoms.flatMap((item) => item.sourceBlockIds));
      assert.equal(side.title, unit.title);
      assert.ok(side.blocks.length > 0, "side-by-side evidence lacks its own source");
      assert.deepEqual(side.blocks.map((block) => block.id), unit.blocks.filter((block) => ids.has(block.id) && pair.sourceBlockIds.includes(block.id)).map((block) => block.id));
      for (const block of side.blocks) assert.equal(block.text, unit.blocks.find((item) => item.id === block.id).fallbackText, "evidence preview rewrote formal text");
    }
  }

  const broken = clone(knowledgePackage);
  broken.contrastPairs = [];
  const unavailable = platform.planRecommendedRoute(broken, "confusion");
  assert.equal(unavailable, null, "missing formal pair was downgraded into a fake complete contrast");
});

gate("j4", "J4-consumption", "320px纵向ContrastSurface消费两侧锚点并区分初答与复答恢复", ["wxml", "restore", "isolation"], [EXPECTED_ACCEPTANCE.j4[2], EXPECTED_ACCEPTANCE.j4[4]], () => {
  assertComponentUsed("miniprogram/subpackages/politics/route/index", "contrast-surface");
  const wxml = read("miniprogram/subpackages/politics/route/guided-route.wxml");
  for (const binding of ["contrastPair.sourceBlockIds", "contrastPair.sourceRefIds", "responses.judgment", "responses.retest", "confusion.comparisonPrompt"]) {
    assert.ok(wxml.includes(binding), `ContrastSurface consumer is missing ${binding}`);
  }
  assert.ok(!/sourceSummary|targetSummary/.test(wxml), "summary is still used as evidence fallback");
  const contrastWxml = read("miniprogram/components/contrast-surface/index.wxml");
  assert.ok(wxml.includes("contrastPair.sides") && contrastWxml.includes("evidenceSides"), "side-by-side formal evidence is not consumed");
  assert.ok(contrastWxml.indexOf("{{sourceBlock.text}}") < contrastWxml.indexOf("<block wx:else>"), "evidence preview leaks into the initial judgment");
  assert.ok(contrastWxml.includes("关键区别"));

  const confusion = plan("confusion");
  const saved = { ...platform.createRouteSession(confusion, 1), responseByStepId: { [confusion.steps[0].stepId]: "answered", [confusion.steps[3].stepId]: "fuzzy" } };
  assert.deepEqual(platform.normalizeRouteSession(confusion, clone(saved)).responseByStepId, saved.responseByStepId);
  const oldReason = "按已确认ContrastPair策展顺序推荐，不预测用户弱点";
  const legacyPlan = { ...confusion, recommendationReason: oldReason, basis: [{ kind: "profile-default", reason: oldReason }] };
  assert.equal(platform.projectRouteStart(legacyPlan, saved).recommendationReason, "按正式易混对照的既定顺序推荐，不推测你的薄弱点");
  const legacyView = platform.projectRouteViewModel(knowledgePackage, legacyPlan, saved);
  assert.equal(legacyView.guide.purpose, "按正式易混对照的既定顺序推荐，不推测你的薄弱点");
  assert.ok(!legacyView.plan.basisText.includes("ContrastPair"), "old route plan leaked internal terms");
  const live = loadPage("miniprogram/subpackages/politics/route/index.js");
  live.page.onLoad({ type: "confusion" });
  live.page.handlePrimaryStart();
  assert.equal(live.page.data.route.current.stage, "judgment");
  live.page.handleContrastJudgment({ detail: { result: "unsure" } });
  assert.equal(live.page.data.route.current.stage, "boundary");
  live.page.handleContrastNext();
  assert.equal(live.page.data.route.current.stage, "evidence");
  assert.equal(live.page.data.contrastNextLabel, "先查看两侧原文");

  live.page.handleContrastEvidence({ detail: { side: "left" } });
  assert.ok(live.calls.navigateTo[0]?.url.includes("&block="), "left evidence did not open an exact source block");
  live.page.onShow();
  assert.deepEqual(live.page.data.route.experience.confusion.evidenceViewed, { left: false, right: false }, "return without a rendered block counted as viewing the left source");
  assert.ok(live.page.data.contrastError.includes("重新打开"), "failed source display has no retry guidance");
  live.page.handleContrastEvidence({ detail: { side: "left" } });
  const leftRequest = live.page.pendingContrastEvidenceSide;
  live.calls.navigateTo[1].events.contrastEvidenceReady({ routeId: live.page.plan.id, ...leftRequest, blockId: "wrong-block" });
  assert.equal(leftRequest.acknowledged, false, "wrong source block receipt was accepted");
  live.calls.navigateTo[1].events.contrastEvidenceReady({ routeId: live.page.plan.id, ...leftRequest });
  live.calls.navigateTo[1].fail();
  assert.equal(live.page.pendingContrastEvidenceSide, leftRequest, "late navigation failure discarded an acknowledged source block");
  live.page.onShow();
  assert.deepEqual(live.page.data.route.experience.confusion.evidenceViewed, { left: true, right: false });
  assert.equal(live.page.data.contrastNextLabel, "还需查看另一侧原文");

  live.page.handleContrastNext();
  assert.equal(live.page.data.route.current.stage, "evidence", "one returned side advanced the route");
  live.page.handleContrastEvidence({ detail: { side: "right" } });
  assert.ok(live.calls.navigateTo[2]?.url.includes("&block="), "right evidence did not open an exact source block");
  const rightRequest = live.page.pendingContrastEvidenceSide;
  live.calls.navigateTo[2].events.contrastEvidenceReady({ routeId: live.page.plan.id, ...rightRequest });
  live.page.onShow();
  assert.deepEqual(live.page.data.route.experience.confusion.evidenceViewed, { left: true, right: true });
  assert.equal(live.page.data.contrastNextLabel, "再辨析一次");

  live.page.handleContrastNext();
  assert.equal(live.page.data.route.current.stage, "retest");
  live.page.handleContrastResponse({ detail: { result: "fuzzy" } });
  assert.equal(live.page.data.screen, "completed");
  assert.equal(live.page.data.route.report.contrastRetestResponse, "fuzzy");
  const completedRelationId = live.page.plan.steps[0].relationId;
  const nextAction = live.page.data.route.guide.completion.primaryAction;
  assert.equal(nextAction.id, "next-contrast");
  assert.equal(nextAction.label, "开启新一组");
  live.page.handleCompletionPrimary();
  assert.equal(live.page.data.screen, "active");
  assert.equal(live.page.data.route.current.stage, "judgment");
  assert.equal(live.page.plan.steps[0].relationId, nextAction.relationId);
  assert.notEqual(live.page.plan.steps[0].relationId, completedRelationId);
  assert.deepEqual(live.page.session.responseByStepId, {});
  live.page.handleCompletionHome();
  assert.equal(live.calls.switchTab.at(-1).url, "/pages/politics/index");
  const queue = knowledgePackage.moduleProfile.routeDefaults.confusion.priorityRelationIds;
  for (const relationId of queue) {
    const nextPlan = platform.planLearningRoute(knowledgePackage, { type: "confusion", scopeId: confusion.scopeId, relationId, recommendationQueue: queue });
    assert.equal(nextPlan.completionProjection.primaryAction.id, "next-contrast");
    assert.notEqual(nextPlan.completionProjection.primaryAction.relationId, relationId, "new group repeats the group just completed");
    assert.ok(queue.includes(nextPlan.completionProjection.primaryAction.relationId));
    assert.ok(nextPlan.startProjection.contrastPair.id);
  }
  const last = platform.planLearningRoute(knowledgePackage, { type: "confusion", scopeId: confusion.scopeId, relationId: queue.at(-1), recommendationQueue: queue });
  assert.equal(last.completionProjection.primaryAction.relationId, queue[0], "last group should wrap to another available group");
  const single = clone(knowledgePackage);
  single.contrastPairs = [single.contrastPairs[0]];
  const singleRelation = single.relations.find((item) => item.type === "contrast" && item.sourcePointId === single.contrastPairs[0].leftPointId && item.targetPointId === single.contrastPairs[0].rightPointId);
  const onlyPlan = platform.planLearningRoute(single, { type: "confusion", scopeId: confusion.scopeId, relationId: singleRelation.id, recommendationQueue: queue });
  assert.deepEqual(onlyPlan.completionProjection.primaryAction, { id: "return-home", label: "返回主页" });
  const contrastTemplate = read("miniprogram/components/contrast-surface/index.wxml");
  assert.ok(wxml.includes('id="start-contrast"') && wxml.includes('stage="preview"') && wxml.includes('bind:change="handleAdjust"'), "start page does not reuse the contrast component");
  assert.ok(contrastTemplate.includes("stage === 'preview'") && contrastTemplate.includes('class="contrast-pair"'));
  assert.ok(wxml.includes("开启新一组") || read("miniprogram/services/knowledge-platform/learning.js").includes("开启新一组"));
  assert.ok(wxml.includes("返回主页") && wxml.includes('bindtap="handleCompletionHome"'));
  const rightUrl = live.calls.navigateTo[2].url;
  const detailOptions = Object.fromEntries(new URLSearchParams(rightUrl.split("?")[1]));
  const emitted = [];
  const detail = loadPage("miniprogram/subpackages/politics/detail/index.js", { anchorQuery: true });
  detail.page.getOpenerEventChannel = () => ({ emit: (name, payload) => emitted.push({ name, payload }) });
  detail.page.onLoad(detailOptions);
  assert.equal(emitted[0]?.name, "contrastEvidenceReady", "rendered formal block did not acknowledge the route");
  assert.equal(emitted[0]?.payload.blockId, detailOptions.block, "source receipt referenced the wrong block");
  const failedScroll = loadPage("miniprogram/subpackages/politics/detail/index.js", { anchorQuery: true, scrollFailure: true });
  const failedEvents = [];
  failedScroll.page.getOpenerEventChannel = () => ({ emit: (name) => failedEvents.push(name) });
  failedScroll.page.onLoad(detailOptions);
  assert.equal(failedEvents.length, 0, "failed anchor scroll still acknowledged source display");
  const missingBlock = loadPage("miniprogram/subpackages/politics/detail/index.js", { anchorQuery: true, anchorRect: null });
  const missingEvents = [];
  missingBlock.page.getOpenerEventChannel = () => ({ emit: (name) => missingEvents.push(name) });
  missingBlock.page.onLoad(detailOptions);
  assert.equal(missingEvents.length, 0, "unrendered source block still acknowledged display");
  const recovery = loadPage("miniprogram/subpackages/politics/route/index.js");
  recovery.page.data.recovery = platform.projectSurfaceRecovery("data-unavailable");
  recovery.page.handleRecoveryAction();
  assert.equal(recovery.calls.navigateBack.length, 1, "return action attempted to rebuild unavailable content");
  recovery.calls.navigateBack[0].fail();
  assert.equal(recovery.calls.switchTab[0].url, "/pages/politics/index", "return without a previous page has no home fallback");
  recovery.page.data.recovery = platform.projectSurfaceRecovery("route-expired");
  let rebuilt = 0;
  recovery.page.handleRebuild = () => { rebuilt += 1; };
  recovery.page.handleRecoveryAction();
  assert.equal(rebuilt, 1, "updated content no longer rebuilds the route");
  const placeholder = loadPage("miniprogram/subpackages/politics/coming-soon/index.js");
  placeholder.page.onLoad({ feature: "favorites" });
  placeholder.page.handleBack();
  placeholder.calls.navigateBack[0].fail();
  assert.equal(placeholder.calls.switchTab[0].url, "/pages/politics/index", "placeholder without a previous page has no home fallback");
  assertIsolation();
});

gate("j5", "J5-remedy", "速记冻结四卡、严格揭晓自评并把fuzzy/missed纳入补救", ["state", "view-model", "negative", "restore"], EXPECTED_ACCEPTANCE.j5.slice(0, 5), () => {
  const exam = plan("exam");
  assert.equal(exam.scopeId, "politics-toc-v2-n003");
  assert.equal(exam.steps.length, 4);
  assert.equal(exam.steps[0].recallItemId, "recall:politics-toc-v2-u001:qa");
  let session = platform.createRouteSession(exam, 1);
  const stepId = session.currentStepId;
  const promptGuide = platform.projectGoalGuide(exam, session);
  assert.ok(promptGuide.instruction.includes("心中回答") && promptGuide.next.reason.includes("揭晓"), "exam prompt guide repeats the next card instead of the reveal action");
  const premature = platform.applyRouteSessionEvent(exam, session, { type: "RECALL_RESULT", result: "remembered", at: 2 });
  assert.equal(premature.currentStepId, stepId, "unrevealed card accepted an assessment");
  assert.equal(platform.applyRouteSessionEvent(exam, session, { type: "VIEW_REMEDY", stepId, at: 2 }).reviewedStepIds.length, 0, "unassessed card accepted a review event");
  session = platform.applyRouteSessionEvent(exam, session, { type: "REVEAL_RECALL", at: 3 });
  const revealedGuide = platform.projectGoalGuide(exam, session);
  assert.ok(revealedGuide.instruction.includes("自评") && revealedGuide.next.reason.includes("回看"), "revealed exam card does not guide the assessment");
  session = platform.applyRouteSessionEvent(exam, session, { type: "RECALL_RESULT", result: "fuzzy", at: 4 });
  const assessedGuide = platform.projectGoalGuide(exam, session);
  assert.ok(assessedGuide.instruction.includes("可继续") && assessedGuide.instruction.includes("回看") && assessedGuide.next.reason.includes("下一张"), "fuzzy exam card does not distinguish continuation from optional remedy");
  const fuzzyNext = platform.applyRouteSessionEvent(exam, session, { type: "NEXT_RECALL_CARD", at: 5 });
  assert.equal(fuzzyNext.currentIndex, 1, "fuzzy card did not continue to the next card");
  assert.deepEqual(platform.projectRouteViewModel(knowledgePackage, exam, fuzzyNext).report.pendingRemedyQueue.map((item) => item.result), ["fuzzy"], "continuing from fuzzy discarded its optional remedy");
  let missedSession = platform.createRouteSession(exam, 1);
  missedSession = platform.applyRouteSessionEvent(exam, missedSession, { type: "REVEAL_RECALL", at: 2 });
  missedSession = platform.applyRouteSessionEvent(exam, missedSession, { type: "RECALL_RESULT", result: "missed", at: 3 });
  assert.ok(platform.projectGoalGuide(exam, missedSession).instruction.startsWith("建议先回看"), "missed card does not recommend review before continuation");
  const report = platform.projectRouteViewModel(knowledgePackage, exam, session).report;
  assert.ok(Array.isArray(report.remedyQueue), "report.remedyQueue is missing");
  let lastExam = platform.createRouteSession(exam, 1);
  for (let index = 0; index < exam.steps.length; index += 1) {
    lastExam = platform.applyRouteSessionEvent(exam, lastExam, { type: "REVEAL_RECALL", at: index + 2 });
    lastExam = platform.applyRouteSessionEvent(exam, lastExam, { type: "RECALL_RESULT", result: index === exam.steps.length - 1 ? "fuzzy" : "remembered", at: index + 3 });
  }
  assert.equal(lastExam.status, "active");
  assert.equal(platform.projectGoalGuide(exam, lastExam).next.stepId, null, "last exam card invents another card");
  assert.equal(platform.applyRouteSessionEvent(exam, lastExam, { type: "NEXT_RECALL_CARD", at: 20 }).status, "completed");
  assert.deepEqual(report.remedyQueue.map((item) => item.result), ["fuzzy"], "fuzzy is missing from remedyQueue");
  const skipped = platform.applyRouteSessionEvent(exam, platform.applyRouteSessionEvent(exam, platform.createRouteSession(exam, 1), { type: "REVEAL_RECALL", at: 2 }), { type: "RECALL_RESULT", result: "skipped", at: 3 });
  assert.equal(skipped.skippedStepIds.length, 1, "skipped was coerced into missed");
  assert.equal(skipped.recallResults.missed, 0);
  assert.equal(platform.applyRouteSessionEvent(exam, skipped, { type: "VIEW_REMEDY", stepId: exam.steps[0].stepId, at: 4 }).reviewedStepIds.length, 0, "skipped card was counted as reviewed");
  assert.equal(platform.normalizeRouteSession(exam, clone(session)).currentStepId, session.currentStepId);
  assert.equal(platform.normalizeRouteSession(exam, { ...session, packageVersion: "stale" }).status, "expired");
});

gate("j5", "J5-storage", "速记消费共享回忆面并把存储失败显示为可重试未保存状态", ["wxml", "negative", "restore", "isolation"], EXPECTED_ACCEPTANCE.j5.slice(5), () => {
  assertComponentUsed("miniprogram/subpackages/politics/route/index", "knowledge-card-surface");
  const wxml = read("miniprogram/subpackages/politics/route/guided-route.wxml");
  assert.ok(
    wxml.includes('class="route-step-progress surface-card"')
      && wxml.includes("route.progress.positionLabel")
      && wxml.includes("route.progress.task")
      && wxml.includes("{{learningInstruction}}"),
    "exam progress guide lacks the shared position, phase and action hint"
  );
  assert.ok(hasBinding("miniprogram/subpackages/politics/route/guided-route.wxml", "storageStatus"));
  assert.ok(/retryStorage|handleStorageRetry/.test(wxml), "storage retry action is not consumed");
  const cardWxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
  assert.ok(wxml.includes('allow-skip="{{true}}"') && cardWxml.includes('data-result="skipped"'), "fourth assessment option is missing from exam recall");
  assert.ok(wxml.includes('bind:reveal="handleReveal"') && cardWxml.includes('bindtap="handleReveal"'), "exam reveal button must reach the route event handler");
  assert.equal((wxml.match(/show-reading-return="{{false}}"/g) || []).length, 2, "guided recall exposes the full answer before assessment");
  assert.ok(cardWxml.includes('wx:if="{{showReadingReturn && recallView.answerVisible}}"'), "shared card ignores the guided recall return restriction");
  assert.ok(wxml.includes("wx:elif=\"{{route.current.response === 'missed'}}\" class=\"guided-system-toolbar-primary\" bindtap=\"handleViewKnowledge\""), "missed card does not prioritize direct knowledge reading in the action dock");
  assert.ok(!wxml.includes('guided-remedy" role="dialog"'), "exam review still opens an in-page modal");
  const detailJs = read("miniprogram/subpackages/politics/detail/index.js");
  assert.ok(detailJs.includes('returnLabel: `返回${routeLabel}`') && detailJs.includes('wx.navigateBack'), "knowledge return lacks the specific route name or native return");
  assert.ok(wxml.includes("route.guide.next.stepId ? '进入下一张' : '查看本轮结果'"), "last fuzzy exam card still promises another card");
  assert.ok(wxml.includes("route.guide.next.stepId ? '先继续' : '查看本轮结果'"), "last missed exam card hides the completion action");
  assert.ok(wxml.includes("wx:elif=\"{{route.current.response === 'fuzzy'}}\" class=\"guided-system-toolbar-primary guided-exam-next\" bindtap=\"handleNextRecall\""), "fuzzy card does not prioritize continuation in the action dock");
  assert.ok(!wxml.includes('<block wx:elif="{{route.current.response}}"><button class="guided-primary" bindtap="handleNextRecall"'), "exam still renders an unreachable remembered/skipped action branch");
  assert.ok(wxml.includes('bindtap="handleRoutePause"'), "active exam card has no shared pause action");
  assert.ok(wxml.includes('bindtap="handleExamCompletionExit"') && wxml.includes('bindtap="handleExamRestart"'), "exam completion lacks explicit exit or replay");
  assert.ok(wxml.includes("type === 'exam' && route.report.pendingRemedyQueue.length") && wxml.includes("type === 'exam' && !route.report.pendingRemedyQueue.length"), "exam completion choices ignore the pending remedy state");
  assert.ok(wxml.includes('!route.current.revealed && !route.current.response'), "exam shows a duplicate skip action after reveal");
  assert.ok(wxml.includes('display-preferences="{{displayPreferences}}"'), "route card ignores the user's display preferences");
  const cardWxss = read("miniprogram/components/knowledge-card-surface/index.wxss");
  assert.match(cardWxss, /\.reading-font-extraLarge\s*\{[^}]*--reader-body-size:\s*var\(--ui-font-reading-extra-large\)[^}]*--reader-caption-size:\s*var\(--ui-font-section-title\)/, "maximum font setting does not define readable body and choice sizes");
  assert.match(cardWxss, /\.knowledge-card-recall-prompt\s*\{[^}]*font-size:\s*var\(--reader-body-size\)/, "exam prompt does not consume the reading size");
  assert.match(cardWxss, /\.knowledge-card-assess-item\s*\{[^}]*font-size:\s*var\(--reader-caption-size\)/, "exam choices do not consume the reading size");
  assert.ok(cardWxss.includes('.knowledge-card-recall-answer-label') && cardWxss.includes('.knowledge-card-recall-pitfall-label') && cardWxss.includes('font-size: var(--reader-body-size)'), "exam answer and boundary lack legible visual hierarchy");
  assert.match(read("miniprogram/subpackages/politics/route/guided-route.wxss"), /\.guided-system-toolbar-actions button\s*\{[^}]*align-items:\s*center[^}]*justify-content:\s*center/, "dock actions must center their text on both axes");
  assert.ok(cardWxss.includes('grid-template-columns: repeat(2,minmax(0,1fr))') && cardWxss.includes('min-height: var(--ui-button-height)'), "four exam choices are not laid out as reachable mobile targets");
  const readFailure = loadPage("miniprogram/subpackages/politics/route/index.js", { storageError: true });
  readFailure.page.onLoad({ type: "exam" });
  readFailure.page.handlePrimaryStart();
  assert.equal(readFailure.page.data.storageStatus?.ok, false);
  assert.equal(readFailure.page.data.screen, "recommendation", "unreadable old deck was overwritten");
  const failing = { storageError: false };
  const loaded = loadPage("miniprogram/subpackages/politics/route/index.js", failing);
  loaded.page.onLoad({ type: "exam" });
  failing.storageError = true;
  loaded.page.handlePrimaryStart();
  assert.equal(loaded.page.data.storageStatus?.ok, false, "write failure is silently swallowed");
  assert.equal(loaded.page.data.screen, "unsaved");
  loaded.page.handleExamPause();
  assert.equal(loaded.calls.navigateBack.length, 0, "pause left the page after a failed save");
  assert.ok(loaded.page.data.storageStatus.message.includes("暂停前未能保存"), "pause did not explain its failed save");
  const randomReady = loadPage("miniprogram/subpackages/politics/route/index.js");
  randomReady.page.onLoad({ type: "exam" });
  const originalPlan = randomReady.page.plan;
  randomReady.page.handleAdjust();
  randomReady.page.handleRandomChange({ detail: { value: true } });
  randomReady.page.handleScopePreview({ currentTarget: { dataset: { scopeId: originalPlan.scopeId } } });
  assert.equal(randomReady.page.plan, originalPlan, "exam range preview applied before confirmation");
  randomReady.page.handleScopeConfirm();
  assert.ok(randomReady.page.plan.seed, "confirmed explicit random choice was not applied");
  const confirmedPlan = randomReady.page.plan;
  randomReady.page.handleAdjust();
  assert.equal(randomReady.page.data.random, true, "reopening range adjustment lost the selected random mode");
  randomReady.page.handleRandomChange({ detail: { value: false } });
  randomReady.page.handleAdjustClose();
  assert.equal(randomReady.page.plan, confirmedPlan, "canceling range adjustment replaced the confirmed deck");
  const examPlan = plan("exam");
  let secondCard = platform.createRouteSession(examPlan, 1);
  secondCard = platform.applyRouteSessionEvent(examPlan, secondCard, { type: "REVEAL_RECALL", at: 2 });
  secondCard = platform.applyRouteSessionEvent(examPlan, secondCard, { type: "RECALL_RESULT", result: "remembered", at: 3 });
  assert.equal(secondCard.currentIndex, 1);
  const secondRecord = { planOptions: examPlan.options, session: secondCard };
  const homeResume = platform.projectHomeDecision(knowledgePackage, { routeRecords: [secondRecord] });
  assert.equal(homeResume.recommendedAction.label, "继续第2/4张", "home hides the frozen deck position");
  const ready = loadPage("miniprogram/subpackages/politics/route/index.js", { storage: new Map([["knowledgeRoute:politics:exam", secondRecord], ["knowledge-display-preferences-v1", { fontScale: "extraLarge" }]]) });
  ready.page.onLoad({ type: "exam" });
  assert.equal(ready.page.data.displayPreferences.fontScale, "extraLarge", "exam route did not read the maximum font setting");
  ready.storage.set("knowledge-display-preferences-v1", { fontScale: "large" });
  ready.page.onShow();
  assert.equal(ready.page.data.displayPreferences.fontScale, "large", "returning from detail did not refresh the route font setting");
  assert.equal(ready.page.data.start.primaryAction.label, "继续第2/4张", "ready page hides the frozen deck position");
  ready.page.handlePrimaryStart();
  assert.equal(ready.page.data.route.current.stepId, examPlan.steps[1].stepId, "ready resume rebuilt the deck");
  const live = loadPage("miniprogram/subpackages/politics/route/index.js");
  live.page.onLoad({ type: "exam" });
  live.page.handlePrimaryStart();
  assert.equal(live.page.data.route.current.revealed, false);
  assert.equal(live.page.data.learningInstruction, "先想答案，再揭晓。");
  assert.equal(live.page.data.routeRecallView.answerVisible, false, "exam prompt displayed its answer before reveal");
  live.page.handleViewKnowledge();
  live.page.handleSharedBackToReading();
  assert.equal(live.calls.navigateTo.length, 0, "unassessed exam card opened the full answer");
  assert.equal(live.page.session.reviewedStepIds.length, 0, "unassessed exam card was counted as reviewed");
  live.page.handleReveal();
  assert.equal(live.page.data.route.current.revealed, true, "exam reveal action did not update the route");
  assert.equal(live.page.data.learningInstruction, "对照答案，选择自评。");
  assert.equal(live.page.data.routeRecallView.answerVisible, true, "exam reveal action did not display the answer");
  assert.ok(live.page.data.routeRecallView.answer, "exam reveal action did not project the answer text");
  live.page.handleSharedRecallResult({ detail: { result: "fuzzy" } });
  assert.equal(live.page.data.route.current.response, "fuzzy");
  live.page.handleExamPause();
  assert.equal(live.calls.navigateBack.length, 1, "pause did not return after saving");
  assert.equal(live.storage.get("knowledgeRoute:politics:exam").session.responseByStepId[live.page.session.currentStepId], "fuzzy", "pause lost the assessed face");
  const resume = loadPage("miniprogram/subpackages/politics/route/index.js", { storage: live.storage });
  resume.page.onLoad({ type: "exam", resume: "1" });
  assert.equal(resume.page.data.route.current.response, "fuzzy", "cold resume lost the assessed face");
  resume.page.handleNextRecall();
  resume.page.handleReveal();
  resume.page.handleSharedRecallResult({ detail: { result: "missed" } });
  resume.page.handleNextRecall();
  resume.page.handleReveal();
  resume.page.handleSharedRecallResult({ detail: { result: "skipped" } });
  resume.page.handleReveal();
  resume.page.handleSharedRecallResult({ detail: { result: "remembered" } });
  assert.equal(resume.page.data.screen, "completed");
  assert.deepEqual(resume.page.data.route.report.remedyQueue.map((item) => item.result), ["fuzzy", "missed"]);
  assert.equal(resume.page.data.route.report.skipped, 1);
  const completedRecord = clone(resume.storage.get("knowledgeRoute:politics:exam"));
  resume.page.handleExamCompletionExit();
  assert.ok(resume.calls.redirectTo[0]?.url.includes("state=branch&scope="), "pending remedy cannot be ended explicitly");
  assert.deepEqual(resume.storage.get("knowledgeRoute:politics:exam"), completedRecord, "completion exit changed the finished report");
  resume.page.handleExamRestart();
  assert.equal(resume.page.data.screen, "completed", "pending remedy allowed replay before user chose to end or review");
  resume.page.handleCompletionPrimary();
  assert.equal(resume.page.data.completionReviewVisible, true);
  const remedyStepId = resume.page.data.route.report.pendingRemedyQueue[0].stepId;
  resume.page.handleCompletionReviewTap({ currentTarget: { dataset: { stepId: remedyStepId } } });
  assert.ok(resume.calls.navigateTo[0]?.url.includes("/subpackages/politics/detail/index"));
  assert.equal(resume.page.data.route.report.pendingRemedyQueue.length, 2, "review was counted before returning from the knowledge card");
  resume.page.onShow();
  assert.equal(resume.page.data.route.report.pendingRemedyQueue.length, 2, "return without displayed knowledge cleared a pending remedy");
  assert.ok(resume.page.data.completionReviewError.includes("重试"), "missing full-card receipt has no retry guidance");
  resume.page.handleCompletionReviewTap({ currentTarget: { dataset: { stepId: remedyStepId } } });
  const firstRequest = resume.page.pendingExamRemedy;
  resume.calls.navigateTo[1].events.examRemedyReady({ routeId: resume.page.plan.id, ...firstRequest, pointId: "wrong-point" });
  assert.equal(firstRequest.acknowledged, false, "wrong knowledge card receipt was accepted");
  resume.calls.navigateTo[1].events.examRemedyReady({ routeId: resume.page.plan.id, ...firstRequest });
  resume.calls.navigateTo[1].fail();
  assert.equal(resume.page.pendingExamRemedy, firstRequest, "late navigation failure discarded an acknowledged completion review");
  resume.page.onShow();
  assert.equal(resume.page.data.route.report.pendingRemedyQueue.length, 1, "displayed knowledge stayed in the pending remedy queue");
  const stillPending = resume.page.data.route.report.pendingRemedyQueue[0].stepId;
  resume.page.handleCompletionReviewTap({ currentTarget: { dataset: { stepId: stillPending } } });
  resume.calls.navigateTo[2].fail();
  assert.equal(resume.page.data.route.report.pendingRemedyQueue.length, 1, "failed navigation cleared a pending remedy");
  assert.ok(resume.page.data.completionReviewError.includes("重试"), "failed remedy navigation has no retry message");
  resume.page.handleCompletionReviewTap({ currentTarget: { dataset: { stepId: stillPending } } });
  const secondRequest = resume.page.pendingExamRemedy;
  resume.calls.navigateTo[3].events.examRemedyReady({ routeId: resume.page.plan.id, ...secondRequest });
  resume.page.onShow();
  assert.equal(resume.page.data.route.report.pendingRemedyQueue.length, 0, "successful remedy return did not clear the queue");
  assert.equal(resume.page.data.route.guide.completion.primaryAction.id, "return-deck-scope", "empty remedy queue still blocks return to scope");
  resume.page.handleExamRestart();
  assert.equal(resume.page.data.screen, "active", "replay did not create a new round");
  assert.equal(resume.page.session.currentIndex, 0);
  assert.deepEqual(resume.page.session.responseByStepId, {}, "replay carried over old self-ratings");
  assert.equal(resume.page.data.completionReviewVisible, false, "replay carried over the old remedy list");
  assert.equal(resume.storage.get("knowledgeRoute:politics:exam").session.status, "active", "replay was not stored as a new route session");
  const reviewStorage = { storageError: false };
  const review = loadPage("miniprogram/subpackages/politics/route/index.js", reviewStorage);
  review.page.onLoad({ type: "exam" });
  review.page.handlePrimaryStart();
  review.page.handleReveal();
  review.page.handleSharedRecallResult({ detail: { result: "fuzzy" } });
  review.page.handleViewKnowledge();
  assert.equal(review.calls.navigateTo.length, 1, "fuzzy review did not open the full knowledge page");
  assert.equal(review.page.session.reviewedStepIds.length, 0, "opening the review counted it before return");
  const activeRequest = review.page.pendingActiveExamRemedy;
  review.calls.navigateTo[0].events.examRemedyReady({ routeId: review.page.plan.id, ...activeRequest });
  review.calls.navigateTo[0].fail();
  assert.equal(review.page.pendingActiveExamRemedy, activeRequest, "late navigation failure discarded an acknowledged active review");
  reviewStorage.storageError = true;
  review.page.onShow();
  assert.equal(review.page.data.screen, "unsaved", "failed review save did not show an unsaved state");
  assert.equal(review.page.session.reviewedStepIds.length, 1, "return from full knowledge did not record actual review in memory");
  assert.equal(review.storage.get("knowledgeRoute:politics:exam").session.reviewedStepIds.length, 0, "failed review save was presented as persisted");
  reviewStorage.storageError = false;
  review.page.handleStorageRetry();
  assert.equal(review.page.data.screen, "active", "retry did not restore the assessed card");
  assert.equal(review.storage.get("knowledgeRoute:politics:exam").session.reviewedStepIds.length, 1, "retry lost the actual review");
  const detailOptions = Object.fromEntries(new URLSearchParams(resume.calls.navigateTo[3].url.split("?")[1]));
  const detail = loadPage("miniprogram/subpackages/politics/detail/index.js");
  const detailEvents = [];
  detail.page.getOpenerEventChannel = () => ({ emit: (name, payload) => detailEvents.push({ name, payload }) });
  detail.page.onLoad(detailOptions);
  assert.equal(detailEvents[0]?.name, "examRemedyReady", "rendered full knowledge did not acknowledge exam remedy");
  assert.equal(detailEvents[0]?.payload.stepId, stillPending, "exam remedy receipt referenced another card");
  const emptyDetail = loadPage("miniprogram/subpackages/politics/detail/index.js");
  const emptyEvents = [];
  emptyDetail.page.getOpenerEventChannel = () => ({ emit: (name) => emptyEvents.push(name) });
  emptyDetail.page.onLoad({ ...detailOptions, origin: "deep-link" });
  assert.equal(emptyEvents.length, 0, "ordinary reading emitted an exam remedy receipt");
  assertIsolation();
});

function verifyCoverage() {
  for (const journey of Object.keys(EXPECTED_ACCEPTANCE)) {
    const selected = checks.filter((item) => item.journey === journey);
    const evidence = new Set(selected.flatMap((item) => item.evidence));
    const acceptance = new Set(selected.flatMap((item) => item.acceptance));
    assert.deepEqual([...evidence].sort(), [...REQUIRED_EVIDENCE].sort(), `${journey}: incomplete evidence classes`);
    assert.deepEqual([...acceptance].sort(), [...EXPECTED_ACCEPTANCE[journey]].sort(), `${journey}: incomplete R3 acceptance coverage`);
  }
}

verifyCoverage();
// The eight-section primer replaces the former four-stop J2 journey.
// Keep --gate=j2 as an explicit historical contract audit; current full runs consume j2v2.
const selected = checks.filter((item) => requestedGate === "all" ? item.journey !== "j2" : item.journey === requestedGate);
const results = selected.map((item) => {
  try {
    item.verify();
    return { id: item.id, journey: item.journey, status: "passed", evidence: item.evidence, acceptance: item.acceptance, description: item.description };
  } catch (error) {
    return {
      id: item.id,
      journey: item.journey,
      status: "failed",
      failureClass: error?.name === "AssertionError" ? "product-gap" : "infrastructure-error",
      failureReason: error?.message || String(error),
      evidence: item.evidence,
      acceptance: item.acceptance,
      description: item.description,
    };
  }
});

const failedIds = results.filter((item) => item.status === "failed").map((item) => item.id).sort();
const expectedFailedIds = [...EXPECTED_RED].filter((id) => selected.some((item) => item.id === id)).sort();
const infrastructureErrors = results.filter((item) => item.failureClass === "infrastructure-error");
const redBaselineMatched = infrastructureErrors.length === 0
  && failedIds.length === expectedFailedIds.length
  && failedIds.every((id, index) => id === expectedFailedIds[index]);
const summary = {
  gate: requestedGate,
  lifecycle: requestedGate === "j2" ? "superseded-historical-diagnostic" : "current",
  replacementGate: requestedGate === "j2" ? "j2v2" : undefined,
  supersededGates: requestedGate === "all" ? [{ gate: "j2", replacement: "j2v2" }] : undefined,
  mode: expectRed ? "expect-red" : "require-green",
  status: expectRed ? (redBaselineMatched ? "red-baseline-verified" : "red-baseline-mismatch") : (failedIds.length ? "failed" : "passed"),
  passed: results.length - failedIds.length,
  failed: failedIds.length,
  infrastructureErrors: infrastructureErrors.length,
  expectedFailedIds: expectRed ? expectedFailedIds : undefined,
  results,
};

console.log(JSON.stringify(summary, null, 2));
if (expectRed ? !redBaselineMatched : failedIds.length > 0) process.exitCode = 1;
