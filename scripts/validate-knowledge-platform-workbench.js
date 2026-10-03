const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const platform = require("../miniprogram/services/knowledge-platform/index");
const { knowledgePackage } = require("../miniprogram/services/knowledge-platform/politics-runtime");

function contextFor(knowledgePackageFixture, pointId) {
  return platform.applyContextEvent(
    knowledgePackageFixture,
    platform.createKnowledgeContext("politics"),
    { type: "SELECT_POINT", pointId, at: 1 },
  );
}

function packageWithRelationCount(pointId, count) {
  const fixture = JSON.parse(JSON.stringify(knowledgePackage));
  const targets = fixture.knowledgeUnits.filter((unit) => unit.id !== pointId).slice(0, count);
  const types = ["prerequisite", "contrast", "related"];
  const synthetic = targets.map((target, index) => ({
    id: `fixture:${pointId}:${index}`,
    moduleId: "politics",
    sourcePointId: pointId,
    targetPointId: target.id,
    type: types[index % types.length],
    direction: index % types.length ? "symmetric" : "directed",
    reason: `fixture relation ${index + 1}`,
    sourceBlockIds: [],
    targetBlockIds: [],
  }));
  fixture.relations = [...fixture.relations, ...synthetic];
  fixture.indexes.relationIdsByPointId[pointId] = synthetic.map((item) => item.id);
  fixture.knowledgeUnits.find((unit) => unit.id === pointId).relationIds = synthetic.map((item) => item.id);
  return fixture;
}

assert.ok(platform.hasReachedStage("politics", "workbench"));
assert.equal(platform.getRolloutStage("common-sense"), "legacy");
assert.equal(platform.getRolloutStage("notes"), "legacy");

const richest = [...knowledgePackage.knowledgeUnits]
  .sort((a, b) => b.relationIds.length - a.relationIds.length)[0];

for (const count of [0, 1, 3, 7]) {
  const fixture = packageWithRelationCount(richest.id, count);
  const context = contextFor(fixture, richest.id);
  const vm = platform.projectFocusWorkbenchViewModel(fixture, context);
  assert.equal(vm.hasFocus, true);
  assert.ok(vm.orientationStage.items.length <= 3, "orientation exceeds 3 items");
  assert.equal(new Set(vm.orientationStage.items.map((item) => item.relationType)).size, vm.orientationStage.items.length);
  assert.ok(vm.relationStage.neighbors.length <= 6, "one-hop graph exceeds 6 neighbors");
  assert.equal(vm.relationStage.allItems.length, count, "full relation list lost items");
  assert.equal(vm.orientationStage.hasRelations, count > 0);
  if (!count) assert.ok(!vm.controller.some((item) => item.id === "relations"));
}

const emptyVm = platform.projectFocusWorkbenchViewModel(
  knowledgePackage,
  platform.createKnowledgeContext("politics"),
);
assert.equal(emptyVm.hasFocus, false);
assert.equal(emptyVm.redirect.activity, "system");

const relationById = new Map(knowledgePackage.relations.map((item) => [item.id, item]));
const unitsById = new Map(knowledgePackage.knowledgeUnits.map((item) => [item.id, item]));
let chain = null;
for (const unitA of knowledgePackage.knowledgeUnits) {
  for (const relationABId of unitA.relationIds) {
    const relationAB = relationById.get(relationABId);
    const unitBId = relationAB.sourcePointId === unitA.id ? relationAB.targetPointId : relationAB.sourcePointId;
    const unitB = unitsById.get(unitBId);
    const relationBCId = unitB?.relationIds.find((id) => {
      const relation = relationById.get(id);
      const otherId = relation.sourcePointId === unitB.id ? relation.targetPointId : relation.sourcePointId;
      return otherId !== unitA.id;
    });
    if (relationBCId) {
      chain = { unitA, relationABId, unitB, relationBCId };
      break;
    }
  }
  if (chain) break;
}
assert.ok(chain, "A→B→C relation chain is required");
let trailContext = contextFor(knowledgePackage, chain.unitA.id);
const beforePreview = JSON.stringify(trailContext);
platform.projectFocusWorkbenchViewModel(knowledgePackage, trailContext);
assert.equal(JSON.stringify(trailContext), beforePreview, "relation preview projection must not mutate focus");
trailContext = platform.applyContextEvent(knowledgePackage, trailContext, { type: "FOLLOW_RELATION", relationId: chain.relationABId, at: 2 });
assert.equal(trailContext.focus.pointId, chain.unitB.id);
assert.equal(trailContext.explorationTrail.length, 1);
const unitCId = (() => {
  const relation = relationById.get(chain.relationBCId);
  return relation.sourcePointId === chain.unitB.id ? relation.targetPointId : relation.sourcePointId;
})();
trailContext = platform.applyContextEvent(knowledgePackage, trailContext, { type: "FOLLOW_RELATION", relationId: chain.relationBCId, at: 3 });
assert.equal(trailContext.focus.pointId, unitCId);
assert.equal(trailContext.explorationTrail.length, 2);
trailContext = platform.applyContextEvent(knowledgePackage, trailContext, { type: "BACK_TRAIL", at: 4 });
assert.equal(trailContext.focus.pointId, chain.unitB.id);
trailContext = platform.applyContextEvent(knowledgePackage, trailContext, { type: "BACK_TRAIL", at: 5 });
assert.equal(trailContext.focus.pointId, chain.unitA.id);

const root = path.join(__dirname, "..");
const detailJs = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/detail/index.js"), "utf8");
const detailWxml = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/detail/index.wxml"), "utf8");
const detailConfig = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/detail/index.json"), "utf8");
const cardJs = fs.readFileSync(path.join(root, "miniprogram/components/knowledge-card-surface/index.js"), "utf8");
const cardWxml = fs.readFileSync(path.join(root, "miniprogram/components/knowledge-card-surface/index.wxml"), "utf8");
const mapJs = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/map/index.js"), "utf8");
const mapWxml = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/map/index.wxml"), "utf8");
const legacyWorkbench = detailJs.includes("projectFocusWorkbenchViewModel")
  && detailJs.includes("FOLLOW_RELATION")
  && detailJs.includes("BACK_TRAIL")
  && detailWxml.includes("workbench-context")
  && detailWxml.includes("workbench-dock")
  && detailWxml.includes("点开先看关系理由，当前知识不会改变")
  && mapJs.includes("mode=relations&origin=terrain");
const unifiedWorkbench = detailJs.includes("redirectTo")
  && mapJs.includes("projectSurfaceDecision")
  && mapJs.includes("handleRelationEnter")
  && mapJs.includes("{ ...action.event, at: Date.now() }")
  && mapJs.includes('type: "SWITCH_ACTIVITY", activity: "reading"')
  && mapJs.includes('surfaceState: "full"')
  && mapWxml.includes("relationPanelVisible")
  && mapWxml.includes("先看清为什么相关，再决定是否进入")
  && !mapWxml.includes("workbench-dock")
  && !detailWxml.includes("workbench-dock");
const r5Workbench = detailJs.includes("projectKnowledgeCardSurfaceViewModel")
  && detailJs.includes('type: "FOLLOW_RELATION"')
  && detailJs.includes("wx.navigateTo")
  && detailWxml.includes("<knowledge-card-surface")
  && detailConfig.includes('"knowledge-card-surface"')
  && cardWxml.includes("card.relationFooter.items")
  && cardWxml.includes("item.reason")
  && cardWxml.includes('bindtap="handleRelationTap"')
  && cardJs.includes('this.triggerEvent("relationtap"');
assert.ok(legacyWorkbench || unifiedWorkbench || r5Workbench, "关系理由、显式换焦点和原生返回未由可见知识表面承载");
for (const legacyPage of [
  "miniprogram/pages/common-sense/index.js",
  "miniprogram/pages/note/index/index.js",
]) {
  assert.ok(!fs.readFileSync(path.join(root, legacyPage), "utf8").includes("knowledge-platform"));
}

console.log(`knowledge platform workbench validation passed: ${knowledgePackage.knowledgeUnits.length} points, ${knowledgePackage.relations.length} relations, A→B→C reversible`);
