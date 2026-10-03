#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const platform = require(path.join(repo, "miniprogram/services/knowledge-platform"));
const { knowledgePackage } = require(path.join(repo, "miniprogram/services/knowledge-platform/politics-runtime"));

const emptyContext = platform.createKnowledgeContext("politics");
const rootId = knowledgePackage.indexes.rootNavigationIds[0];

assert.ok(platform.hasReachedStage("politics", "terrain"));
assert.strictEqual(platform.getRolloutStage("common-sense"), "legacy");
assert.strictEqual(platform.getRolloutStage("notes"), "legacy");

function project(context, state) {
  const first = platform.projectTerrainViewModel(knowledgePackage, context, state);
  const second = platform.projectTerrainViewModel(knowledgePackage, context, state);
  assert.deepStrictEqual(first, second, `投影不确定: ${JSON.stringify(state)}`);
  assert.ok(first.nodes.length <= platform.TERRAIN_BUDGETS[first.semanticLevel] + (first.semanticLevel === 3 ? 1 : 0));
  return first;
}

const l0 = project(emptyContext, { semanticLevel: 0, scopeNodeId: rootId });
assert.strictEqual(l0.nodes.length, 2, "政治 L0 必须为两大区域");
assert.strictEqual(l0.hasFocus, false, "空上下文不得制造默认焦点");

const article2 = l0.nodes.find((node) => node.id === "politics-toc-v2-n024");
const article2L1 = project(emptyContext, {
  semanticLevel: article2.nextSemanticLevel,
  scopeNodeId: article2.nextScopeNodeId,
});
assert.strictEqual(article2L1.nodes.length, 2, "18个浅层知识点应形成两个稳定聚合");
assert.ok(article2L1.nodes.every((node) => node.role === "aggregate"));
assert.deepStrictEqual(article2L1.nodes.map((node) => node.count), [9, 9]);
assert.strictEqual(emptyContext.focus, null, "打开聚合不得建立焦点");

const reachedNavigationIds = new Set([rootId]);
const visitedStates = new Set();
function walk(state) {
  const key = `${state.semanticLevel}|${state.scopeNodeId}|${state.selectedAggregateId || ""}`;
  if (visitedStates.has(key)) return;
  visitedStates.add(key);
  reachedNavigationIds.add(state.scopeNodeId);
  const vm = project(emptyContext, state);
  const directoryVm = project(emptyContext, { ...state, projection: "directory" });
  assert.deepStrictEqual(vm.nodes.map((node) => node.id), directoryVm.nodes.map((node) => node.id), "地形/目录节点不等价");
  assert.deepStrictEqual(vm.nodes.map((node) => node.positionKey), directoryVm.nodes.map((node) => node.positionKey), "地形/目录顺序不等价");
  for (const node of vm.nodes) {
    if (node.navigationNodeId) reachedNavigationIds.add(node.navigationNodeId);
    if (node.action === "enter-scope" || node.action === "open-aggregate") {
      walk({
        semanticLevel: node.nextSemanticLevel,
        scopeNodeId: node.nextScopeNodeId,
        selectedAggregateId: node.selectedAggregateId,
      });
    }
  }
}
walk({ semanticLevel: 0, scopeNodeId: rootId });
assert.strictEqual(reachedNavigationIds.size, 42, "L0–L2 未覆盖42个正式导航节点");

const pointNodes = [...visitedStates].flatMap((key) => {
  const [semanticLevel, scopeNodeId, selectedAggregateId] = key.split("|");
  return project(emptyContext, {
    semanticLevel: Number(semanticLevel),
    scopeNodeId,
    selectedAggregateId: selectedAggregateId || null,
  }).nodes.filter((node) => node.pointId);
});
assert.strictEqual(new Set(pointNodes.map((node) => node.pointId)).size, 37, "L2 未覆盖37个知识焦点");

const selected = pointNodes[0];
const focusedContext = platform.applyContextEvent(knowledgePackage, emptyContext, {
  type: "SELECT_POINT",
  pointId: selected.pointId,
  at: 10,
});
const l3 = project(focusedContext, { semanticLevel: 3, scopeNodeId: selected.navigationNodeId });
assert.strictEqual(l3.nodes[0].role, "focus");
assert.strictEqual(l3.nodes[0].pointId, selected.pointId);
assert.ok(l3.nodes.slice(1).length <= 6, "L3关系邻居超过6个");
assert.strictEqual(new Set(l3.nodes.map((node) => node.id)).size, l3.nodes.length, "L3关系邻居重复");
assert.ok(l3.backState, "L3缺少可逆返回状态");
for (const unit of knowledgePackage.knowledgeUnits) {
  const context = platform.applyContextEvent(knowledgePackage, emptyContext, {
    type: "SELECT_POINT",
    pointId: unit.id,
    at: 10,
  });
  const neighborhood = project(context, { semanticLevel: 3, scopeNodeId: unit.navigationNodeId });
  assert.ok(neighborhood.nodes.length <= 7, `${unit.id}: L3邻域超预算`);
  assert.strictEqual(new Set(neighborhood.nodes.map((node) => node.id)).size, neighborhood.nodes.length, `${unit.id}: L3邻居重复`);
}

const snapshotContext = platform.applyContextEvent(knowledgePackage, focusedContext, {
  type: "UPDATE_SYSTEM_SNAPSHOT",
  snapshot: l3.state,
  at: 11,
});
assert.strictEqual(snapshotContext.snapshots.system.semanticLevel, 3);
const recent = platform.toRecentModuleContext(knowledgePackage, snapshotContext);
assert.strictEqual(platform.fromRecentModuleContext(knowledgePackage, recent).focus.pointId, selected.pointId);
assert.strictEqual(platform.fromRecentModuleContext(knowledgePackage, { ...recent, contentVersion: "stale" }).focus, null);

const homeTemplate = fs.readFileSync(path.join(repo, "miniprogram/pages/politics/index.wxml"), "utf8");
const homeSource = fs.readFileSync(path.join(repo, "miniprogram/pages/politics/index.js"), "utf8");
const mapTemplate = fs.readFileSync(path.join(repo, "miniprogram/subpackages/politics/map/index.wxml"), "utf8");
const mapConfig = fs.readFileSync(path.join(repo, "miniprogram/subpackages/politics/map/index.json"), "utf8");
const mapStyle = fs.readFileSync(path.join(repo, "miniprogram/subpackages/politics/map/index.wxss"), "utf8");
const spaceTemplate = fs.readFileSync(path.join(repo, "miniprogram/components/knowledge-space-surface/index.wxml"), "utf8");
const legacyHomeTerrain = homeTemplate.includes("学习起点") && homeTemplate.includes("按目录查找");
const unifiedHomeTerrain = homeTemplate.includes("知识底图")
  && homeTemplate.includes("按目录查找")
  && typeof platform.projectKnowledgeSpaceViewModel === "function";
const r5HomeTerrain = homeTemplate.includes("浏览全部知识")
  && homeSource.includes("/subpackages/politics/map/index")
  && typeof platform.projectKnowledgeSpaceViewModel === "function";
assert.ok(legacyHomeTerrain || unifiedHomeTerrain || r5HomeTerrain, "首页缺少可验证的知识空间入口");
assert.ok(!homeTemplate.includes("速记卡"), "S2首页不应存在无焦点速记入口");
const legacyTerrainPage = mapTemplate.includes("精确访问同一范围") && mapTemplate.includes("terrain.levelTitle") && mapTemplate.includes("terrain.levelMark");
const unifiedTerrainPage = mapTemplate.includes("space.overviewContext")
  && mapTemplate.includes("space.listEquivalent")
  && mapTemplate.includes("knowledge-overview")
  && mapTemplate.includes("knowledge-branch");
const r5TerrainPage = mapTemplate.includes("<knowledge-space-surface")
  && mapConfig.includes('"knowledge-space-surface"')
  && spaceTemplate.includes("space.overviewContext.regions")
  && spaceTemplate.includes("space.branch.groups")
  && spaceTemplate.includes("space.directoryRows")
  && spaceTemplate.includes("点具体知识直接进入正文");
assert.ok(legacyTerrainPage || unifiedTerrainPage || r5TerrainPage, "地形页面缺少稳定底图、分支展开或等价目录");
assert.ok(!mapTemplate.includes("地图回忆"), "S2不得提前实现S4地图回忆");
assert.ok(mapStyle.includes("overflow-x: hidden") && mapStyle.includes("max-width: 340px"));

for (const file of [
  "miniprogram/pages/common-sense/index.js",
  "miniprogram/pages/notes/index.js",
].filter((relative) => fs.existsSync(path.join(repo, relative)))) {
  assert.ok(!fs.readFileSync(path.join(repo, file), "utf8").includes("knowledge-platform"), `${file}: legacy模块被S2接管`);
}

console.log("knowledge platform terrain validation passed: 42 nodes, 37 focus points, L0-L3 reversible");
