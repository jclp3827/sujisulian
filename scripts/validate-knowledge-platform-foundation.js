#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repositoryRoot = path.resolve(__dirname, "..");
const politicsSource = require(path.join(repositoryRoot, "miniprogram/models/politics-p3-v2-runtime"));
const platform = require(path.join(repositoryRoot, "miniprogram/services/knowledge-platform"));

const sourceBefore = JSON.stringify(politicsSource);
const adapter = platform.createPoliticsAdapter(politicsSource);
const first = adapter.buildPackage();
const second = adapter.buildPackage();

assert.strictEqual(JSON.stringify(first), JSON.stringify(second), "adapter output must be deterministic");
assert.strictEqual(JSON.stringify(politicsSource), sourceBefore, "adapter must not mutate source package");
const sourceCopy = adapter.readSources();
sourceCopy.module.title = "mutated copy";
assert.notStrictEqual(politicsSource.module.title, sourceCopy.module.title, "readSources must not expose mutable source");
assert.strictEqual(first.schemaVersion, 1);
assert.strictEqual(first.sourceSchemaVersion, 3);
assert.strictEqual(first.buildTarget, "release");
assert.strictEqual(first.moduleProfile.id, "politics");
assert.strictEqual(first.navigationNodes.length, 42);
assert.strictEqual(first.knowledgeUnits.length, 37);
assert.strictEqual(first.relations.length, 39);
assert.strictEqual(first.recallItems.length, 37);
assert.strictEqual(first.sourceReferences.length, 57);
assert.strictEqual(first.knowledgeUnits.reduce((total, unit) => total + unit.blocks.length, 0), 677);
assert.strictEqual(first.knowledgeUnits.filter((unit) => unit.publishable).length, 25);
assert.deepStrictEqual(first.diagnostics.errors, []);
assert.strictEqual(first.diagnostics.warnings.find((item) => item.code === "RELATION_BLOCK_ANCHORS_PENDING").count, 0);
assert.strictEqual(first.diagnostics.warnings.find((item) => item.code === "RECALL_BLOCK_ANCHORS_PENDING").count, 0);
assert.deepStrictEqual(first.diagnostics.cardCounts, {
  knowledgeAtomRefs: 313,
  knowledgeUnitCardProjections: 37,
  recallProjections: 37,
  contrastPairs: 5,
});
assert.strictEqual(first.idMigrations.length, 643);
assert.strictEqual(first.knowledgeUnitCardProjections.filter((card) => card.completeness.sourceComplete).length, 37);
assert.strictEqual(first.knowledgeUnitCardProjections.filter((card) => card.completeness.atomStructured).length, 37);
assert.strictEqual(first.knowledgeUnitCardProjections.filter((card) => card.completeness.recallLinked).length, 37);

const cardFixtureSource = JSON.parse(sourceBefore);
const contrastSourcePoint = cardFixtureSource.points.find((point) =>
  point.relationItems.some((relation) => relation.type === "contrasts"));
const contrastSourceRelation = contrastSourcePoint.relationItems.find((relation) => relation.type === "contrasts");
const contrastTargetPoint = cardFixtureSource.points.find((point) => point.id === contrastSourceRelation.targetId);
const legacyFixturePoint = cardFixtureSource.points.find((point) =>
  ![contrastSourcePoint.id, contrastTargetPoint.id].includes(point.id));
legacyFixturePoint.cardSchema = null;
for (const point of cardFixtureSource.points) {
  for (const relation of point.relationItems) {
    relation.sourceBlockIds = [];
    relation.targetBlockIds = [];
    relation.dimensions = [];
    relation.boundaries = [];
    relation.recallItemIds = [];
  }
}
for (const point of [contrastSourcePoint, contrastTargetPoint]) {
  point.cardSchema = 1;
  point.contentBlocks = [
    { id: "b001", type: "callout", semantic: "definition", title: "定义", text: "定义正文" },
    { id: "b002", type: "callout", semantic: "reason", title: "依据", text: "原因正文" },
  ];
  point.confusionBlocks = [
    { id: "b003", type: "callout", semantic: "contrast", title: "边界", text: "边界正文" },
  ];
  point.summaryBlockId = "b001";
  point.card.answerBlockIds = ["b001", "b002"];
  point.card.pitfallBlockIds = ["b003"];
}
contrastSourceRelation.sourceBlockIds = ["b003"];
contrastSourceRelation.targetBlockIds = ["b003"];
contrastSourceRelation.dimensions = ["判断对象"];
contrastSourceRelation.boundaries = ["不得互换"];
contrastSourceRelation.recallItemIds = [`recall:${contrastSourcePoint.id}:qa`];
cardFixtureSource.idMigrations = [{
  pointId: contrastSourcePoint.id,
  fromBlockIds: ["content-old"],
  toBlockIds: ["b001", "b002"],
  primaryTargetId: "b001",
  disposition: "split",
  reason: "旧块拆分为定义与依据",
}];
const cardFixture = platform.createPoliticsAdapter(cardFixtureSource).buildPackage();
const cardFixtureAgain = platform.createPoliticsAdapter(cardFixtureSource).buildPackage();
assert.deepStrictEqual(cardFixture, cardFixtureAgain, "card fixture must be deterministic");
assert.deepStrictEqual(cardFixture.diagnostics.errors, []);
assert.ok(cardFixture.knowledgeAtomRefs.some((atom) => atom.role === "reason"));
assert.ok(cardFixture.recallProjections.find((item) => item.pointId === contrastSourcePoint.id).answerAtomRefIds.length);
assert.strictEqual(cardFixture.contrastPairs.length, 1);
assert.strictEqual(cardFixture.idMigrations[0].primaryTargetId, `block:${contrastSourcePoint.id}:b001`);
assert.deepStrictEqual(
  cardFixture.knowledgeUnitCardProjections.find((card) => card.pointId === contrastSourcePoint.id).orderedAtomRefIds,
  [
    `atom:${contrastSourcePoint.id}:b001`,
    `atom:${contrastSourcePoint.id}:b002`,
    `atom:${contrastSourcePoint.id}:b003`,
  ],
);
assert.deepStrictEqual(
  cardFixture.knowledgeUnitCardProjections.find((card) => card.pointId === contrastSourcePoint.id).completeness,
  {
    sourceComplete: true,
    atomStructured: true,
    recallLinked: true,
    contrastLinked: true,
    missingReasons: [],
  },
);
const invalidCardFixtureSource = JSON.parse(JSON.stringify(cardFixtureSource));
const invalidCardPoint = invalidCardFixtureSource.points.find((point) => point.id === contrastSourcePoint.id);
invalidCardPoint.summaryBlockId = "b999";
invalidCardPoint.card.answerBlockIds = ["b999"];
invalidCardPoint.relationItems.find((relation) => relation.type === "contrasts").sourceBlockIds = ["b999"];
invalidCardFixtureSource.idMigrations[0].toBlockIds = ["b999"];
invalidCardFixtureSource.idMigrations[0].primaryTargetId = "b999";
const invalidCardFixture = platform.createPoliticsAdapter(invalidCardFixtureSource).buildPackage();
assert.ok(invalidCardFixture.diagnostics.errors.some((error) => error.includes("summary block invalid")));
assert.ok(invalidCardFixture.diagnostics.errors.some((error) => error.includes("recall block invalid")));
assert.ok(invalidCardFixture.diagnostics.errors.some((error) => error.includes("relation block missing")));
assert.ok(invalidCardFixture.diagnostics.errors.some((error) => error.includes("migration target missing")));
const legacyCard = cardFixture.knowledgeUnitCardProjections.find((card) => card.pointId === legacyFixturePoint.id);
assert.strictEqual(legacyCard.completeness.sourceComplete, true);
assert.strictEqual(legacyCard.completeness.atomStructured, false);

const units = new Map(first.knowledgeUnits.map((unit) => [unit.id, unit]));
const nodes = new Map(first.navigationNodes.map((node) => [node.id, node]));
const relations = new Map(first.relations.map((relation) => [relation.id, relation]));
const recalls = new Map(first.recallItems.map((item) => [item.id, item]));
const sources = new Map(first.sourceReferences.map((item) => [item.id, item]));
const allBlockIds = first.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => block.id));
assert.strictEqual(new Set(allBlockIds).size, allBlockIds.length, "canonical block ids must be globally unique");

for (const node of first.navigationNodes) {
  assert.strictEqual(node.pathIds[node.pathIds.length - 1], node.id, `${node.id}: path must end at node`);
  if (node.parentId) assert.ok(nodes.has(node.parentId), `${node.id}: parent missing`);
  if (node.pointId) assert.ok(units.has(node.pointId), `${node.id}: point missing`);
}
for (const unit of first.knowledgeUnits) {
  assert.ok(nodes.has(unit.navigationNodeId), `${unit.id}: navigation missing`);
  assert.deepStrictEqual(unit.navigationPathIds, nodes.get(unit.navigationNodeId).pathIds, `${unit.id}: navigation path drift`);
  unit.relationIds.forEach((id) => assert.ok(relations.has(id), `${unit.id}: relation missing ${id}`));
  unit.recallItemIds.forEach((id) => assert.ok(recalls.has(id), `${unit.id}: recall missing ${id}`));
  unit.sourceRefIds.forEach((id) => assert.ok(sources.has(id), `${unit.id}: source missing ${id}`));
}
for (const relation of first.relations) {
  assert.ok(units.has(relation.sourcePointId), `${relation.id}: source point missing`);
  assert.ok(units.has(relation.targetPointId), `${relation.id}: target point missing`);
  assert.ok(relation.reason, `${relation.id}: reason missing`);
}

assert.ok(platform.hasReachedStage("politics", "foundation"));
assert.strictEqual(platform.getRolloutStage("common-sense"), "legacy");
assert.strictEqual(platform.getRolloutStage("notes"), "legacy");
assert.ok(platform.hasReachedStage("politics", "foundation"));
assert.ok(!platform.hasReachedStage("common-sense", "foundation"));
assert.notStrictEqual(platform.storageKey("politics"), platform.storageKey("common-sense"));
assert.notStrictEqual(platform.storageKey("politics"), platform.storageKey("notes"));

const empty = platform.createKnowledgeContext("politics", { updatedAt: 1 });
assert.strictEqual(empty.focus, null);
assert.strictEqual(empty.activity, "system");
const firstUnit = first.knowledgeUnits[0];
const focused = platform.applyContextEvent(first, empty, {
  type: "SELECT_POINT",
  pointId: firstUnit.id,
  origin: { type: "terrain", refId: firstUnit.navigationNodeId },
  at: 2,
});
assert.strictEqual(focused.focus.pointId, firstUnit.id);
assert.strictEqual(focused.focus.contentVersion, firstUnit.contentVersion);
assert.strictEqual(focused.activity, "reading");
assert.deepStrictEqual(focused.origin, { type: "terrain", refId: firstUnit.navigationNodeId });

const reading = platform.applyContextEvent(first, focused, {
  type: "SWITCH_ACTIVITY",
  activity: "reading",
  at: 3,
});
assert.strictEqual(reading.focus.pointId, firstUnit.id);
assert.strictEqual(reading.activity, "reading");

const relationId = first.indexes.relationIdsByPointId[firstUnit.id][0];
const relation = relations.get(relationId);
const expectedTarget = relation.sourcePointId === firstUnit.id ? relation.targetPointId : relation.sourcePointId;
const followed = platform.applyContextEvent(first, reading, {
  type: "FOLLOW_RELATION",
  relationId,
  at: 4,
});
assert.strictEqual(followed.focus.pointId, expectedTarget);
assert.strictEqual(followed.explorationTrail.length, 1);
const returned = platform.applyContextEvent(first, followed, { type: "BACK_TRAIL", at: 5 });
assert.strictEqual(returned.focus.pointId, firstUnit.id);
assert.strictEqual(returned.explorationTrail.length, 0);

const invalidDeepLink = platform.applyContextEvent(first, empty, {
  type: "OPEN_DEEP_LINK",
  moduleId: "politics",
  pointId: "missing-point",
  at: 6,
});
assert.strictEqual(invalidDeepLink.focus, null, "invalid deep link must not select first point");
assert.strictEqual(invalidDeepLink.activity, "system");
const crossModule = platform.normalizeKnowledgeContext(first, { ...focused, moduleId: "common-sense" });
assert.strictEqual(crossModule.focus, null, "cross-module context must be rejected");

const noOptionalActivities = JSON.parse(JSON.stringify(first));
noOptionalActivities.indexes.relationIdsByPointId[firstUnit.id] = [];
noOptionalActivities.indexes.recallItemIdsByPointId[firstUnit.id] = [];
const readingFallback = platform.applyContextEvent(noOptionalActivities, empty, {
  type: "SELECT_POINT",
  pointId: firstUnit.id,
  at: 7,
});
assert.strictEqual(readingFallback.activity, "reading");
assert.deepStrictEqual(platform.availableActivities(noOptionalActivities, firstUnit.id), ["system", "reading"]);

let boundedTrail = focused;
for (let index = 0; index < 25; index += 1) {
  const availableRelationId = first.indexes.relationIdsByPointId[boundedTrail.focus.pointId][0];
  boundedTrail = platform.applyContextEvent(first, boundedTrail, {
    type: "FOLLOW_RELATION",
    relationId: availableRelationId,
    at: 10 + index,
  });
}
assert.strictEqual(boundedTrail.explorationTrail.length, platform.MAX_TRAIL_LENGTH);

const changedVersion = platform.normalizeKnowledgeContext(first, {
  ...reading,
  focus: { ...reading.focus, contentVersion: "old-version" },
  anchor: { blockId: firstUnit.blocks[0].id },
  explorationTrail: [{ fromPointId: firstUnit.id }],
});
assert.strictEqual(changedVersion.focus.contentVersion, firstUnit.contentVersion);
assert.strictEqual(changedVersion.anchor, null);
assert.deepStrictEqual(changedVersion.explorationTrail, []);
const recent = platform.toRecentModuleContext(first, reading);
assert.deepStrictEqual(Object.keys(recent).sort(), [
  "blockId",
  "contentVersion",
  "contextSnapshot",
  "goalType",
  "lastActivity",
  "moduleId",
  "pointId",
  "routeId",
  "scopeId",
  "updatedAt",
]);
assert.ok(!JSON.stringify(recent).includes(firstUnit.summary), "persisted context must not include knowledge content");

const viewModelOne = platform.projectFoundationViewModel(first, reading);
const viewModelTwo = platform.projectFoundationViewModel(first, reading);
assert.deepStrictEqual(viewModelOne, viewModelTwo, "foundation ViewModel must be deterministic");
assert.strictEqual(viewModelOne.module.rolloutStage, platform.getRolloutStage("politics"));
assert.strictEqual(viewModelOne.focus.pointId, firstUnit.id);
assert.deepStrictEqual(viewModelOne.focus.path.map((item) => item.id), firstUnit.navigationPathIds);

const legacyRoots = [
  "miniprogram/pages/common-sense",
  "miniprogram/pages/note",
  "miniprogram/subpackages/common-sense",
  "miniprogram/subpackages/note",
];
for (const relativeRoot of legacyRoots) {
  const root = path.join(repositoryRoot, relativeRoot);
  const files = [];
  const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name.endsWith(".js")) files.push(fullPath);
  });
  walk(root);
  for (const file of files) {
    assert.ok(!fs.readFileSync(file, "utf8").includes("services/knowledge-platform"), `${file}: legacy page must not import V2 foundation`);
  }
}

console.log(JSON.stringify({
  status: "passed",
  moduleId: first.moduleProfile.id,
  rolloutStage: platform.getRolloutStage("politics"),
  buildTarget: first.buildTarget,
  counts: first.diagnostics.counts,
  diagnostics: first.diagnostics.warnings.map(({ code, count }) => ({ code, count })),
}, null, 2));
