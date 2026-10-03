const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const platform = require("../miniprogram/services/knowledge-platform/index");
const { knowledgePackage } = require("../miniprogram/services/knowledge-platform/politics-runtime");

const root = path.join(__dirname, "..");

function contextFor(pointId, activity = "reading", blockId = null) {
  return platform.applyContextEvent(knowledgePackage, platform.createKnowledgeContext("politics"), {
    type: "OPEN_DEEP_LINK",
    moduleId: "politics",
    pointId,
    activity,
    blockId,
    refId: "reading-test",
    at: 1,
  });
}

const allBlockIds = knowledgePackage.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => block.id));
for (const unit of knowledgePackage.knowledgeUnits) {
  const vm = platform.projectFocusWorkbenchViewModel(knowledgePackage, contextFor(unit.id));
  assert.deepEqual(vm.readingStage.blockIds, unit.blocks.map((block) => block.id), `${unit.id}: block order changed`);
  assert.equal(vm.readingStage.blockCount, unit.blocks.length);
  assert.ok(vm.readingStage.blocks.every((block) => block.fallbackText.length > 0));
}
assert.equal(new Set(allBlockIds).size, 643);

const kinds = ["heading", "paragraph", "list", "table", "quote", "callout", "media", "future-kind"];
const semantics = ["definition", "conclusion", "hierarchy", "sequence", "condition", "exception", "contrast", "evidence"];
for (let index = 0; index < kinds.length; index += 1) {
  const projected = platform.projectReadingBlock({
    id: `fixture:${index}`,
    sourceBlockId: `source:${index}`,
    kind: kinds[index],
    semantic: semantics[index] || "future-semantic",
    title: kinds[index] === "heading" ? "Fixture heading" : null,
    payload: kinds[index] === "list"
      ? { ordered: true, items: ["A", "B"] }
      : kinds[index] === "table"
        ? { columns: ["字段", "值"], rows: [["A", "B"]] }
        : { text: "完整降级文本" },
    fallbackText: "完整降级文本",
    sourceRefIds: [],
    reviewState: "review",
  });
  assert.equal(projected.kind, kinds[index] === "future-kind" ? "fallback" : kinds[index]);
  assert.equal(projected.semantic, semantics[index] || "plain");
  if (kinds[index] === "table") assert.deepEqual(projected.tableRows[0][1], { label: "值", value: "B" });
}

assert.deepEqual(
  platform.normalizeDisplayPreferences({ fontScale: "huge", emphasis: "magic" }),
  platform.normalizeDisplayPreferences({}),
);
const longest = [...knowledgePackage.knowledgeUnits].sort((a, b) => b.blocks.length - a.blocks.length)[0];
const normalVm = platform.projectFocusWorkbenchViewModel(knowledgePackage, contextFor(longest.id), { displayPreferences: { emphasis: "normal" } });
const keyVm = platform.projectFocusWorkbenchViewModel(knowledgePackage, contextFor(longest.id), { displayPreferences: { emphasis: "keyPoints" } });
assert.equal(longest.blocks.length, 57);
assert.equal(normalVm.readingStage.initialBatchSize, 24);
assert.equal(normalVm.readingStage.batchSize, 16);
assert.deepEqual(normalVm.readingStage.blocks, keyVm.readingStage.blocks, "keyPoints must not remove or rewrite blocks");

const validBlock = longest.blocks[longest.blocks.length - 1].id;
let anchored = contextFor(longest.id, "reading", validBlock);
let anchoredVm = platform.projectFocusWorkbenchViewModel(knowledgePackage, anchored);
assert.equal(anchoredVm.readingStage.anchor.blockId, validBlock);
assert.equal(anchoredVm.readingStage.anchor.index, 56);
const otherUnitBlock = knowledgePackage.knowledgeUnits.find((unit) => unit.id !== longest.id).blocks[0].id;
anchored = contextFor(longest.id, "reading", otherUnitBlock);
anchoredVm = platform.projectFocusWorkbenchViewModel(knowledgePackage, anchored);
assert.equal(anchoredVm.readingStage.anchor, null);
assert.equal(anchoredVm.readingStage.anchorNotice, "block-missing");

const relation = knowledgePackage.relations.find((item) => item.sourcePointId === longest.id)
  || knowledgePackage.relations.find((item) => item.targetPointId === longest.id);
assert.ok(relation, "anchored relation fixture missing");
let sourceContext = contextFor(longest.id, "relations");
sourceContext = platform.applyContextEvent(knowledgePackage, sourceContext, {
  type: "OPEN_SOURCE_BLOCK",
  blockId: validBlock,
  source: "relation",
  returnTarget: { activity: "relations", relationMode: "exploration", relationId: relation.id, source: "relation" },
  at: 2,
});
assert.equal(sourceContext.activity, "reading");
assert.equal(sourceContext.anchor.blockId, validBlock);
assert.equal(sourceContext.returnTarget.relationId, relation.id);
sourceContext = platform.applyContextEvent(knowledgePackage, sourceContext, { type: "RETURN_FROM_SOURCE", at: 3 });
assert.equal(sourceContext.activity, "relations");
assert.equal(sourceContext.relationMode, "exploration");
assert.equal(sourceContext.returnTarget, null);
let recentContext = contextFor(longest.id, "reading", validBlock);
recentContext = platform.applyContextEvent(knowledgePackage, recentContext, {
  type: "SWITCH_ACTIVITY",
  activity: "recall",
  snapshot: { blockId: validBlock },
  at: 4,
});
const recent = platform.toRecentModuleContext(knowledgePackage, recentContext);
assert.equal(recent.blockId, validBlock);
const restored = platform.fromRecentModuleContext(knowledgePackage, recent);
assert.equal(restored.anchor.blockId, validBlock);

const detailCompatibilitySource = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/detail/index.js"), "utf8");
if (!detailCompatibilitySource.includes("redirectTo") && detailCompatibilitySource.includes("projectFocusWorkbenchViewModel")) {
let pageDefinition = null;
const mockStorage = new Map();
let scrollCalls = 0;
global.Page = (definition) => { pageDefinition = definition; };
global.wx = {
  getStorageSync(key) { return mockStorage.get(key); },
  setStorageSync(key, value) { mockStorage.set(key, value); },
  setNavigationBarTitle() {},
  pageScrollTo() { scrollCalls += 1; },
  showToast() {},
  redirectTo() {},
  navigateTo() {},
};
const detailModule = path.join(root, "miniprogram/subpackages/politics/detail/index.js");
delete require.cache[require.resolve(detailModule)];
require(detailModule);
const page = {
  ...pageDefinition,
  data: JSON.parse(JSON.stringify(pageDefinition.data)),
  setData(patch, callback) {
    this.data = { ...this.data, ...patch };
    if (callback) callback();
  },
};
page.onLoad({ id: longest.id, mode: "reading", origin: "reading-test" });
assert.equal(page.data.readingBlocks.length, 24);
page.handleReadingMore();
assert.equal(page.data.readingBlocks.length, 40);
page.onReachBottom();
assert.equal(page.data.readingBlocks.length, 56);
page.onReachBottom();
assert.equal(page.data.readingBlocks.length, 57);
assert.equal(page.data.readingHasMore, false);
const focusAnchor = page.data.activeBlockId;
page.handleFocusReading();
page.handleFocusReading();
assert.equal(page.data.activeBlockId, focusAnchor, "focus reading reset semantic anchor");
const preferenceScrollBaseline = scrollCalls;
page.handleFontScale();
assert.equal(mockStorage.get("knowledge-display-preferences-v1").fontScale, "large");
page.handleLineSpacing();
page.handleEmphasis();
page.handleFontScale();
assert.equal(scrollCalls, preferenceScrollBaseline, "display preferences must not trigger active scrolling");
} else {
  const card = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, longest.id, { activity: "reading" });
  assert.equal(card.semanticBlocks.length, 57);
  assert.deepEqual(card.semanticBlocks.map((block) => block.id), longest.blocks.map((block) => block.id));
  assert.ok(card.semanticBlocks.every((block) => block.fallbackText.length > 0));
  const highlighted = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, longest.id, { activity: "reading", displayPreferences: { emphasis: "keyPoints" } });
  assert.deepEqual(highlighted.semanticBlocks, card.semanticBlocks, "显示偏好不得删除或改写正式内容");
}

const detailJs = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/detail/index.js"), "utf8");
const detailWxml = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/detail/index.wxml"), "utf8");
const detailConfig = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/detail/index.json"), "utf8");
const cardWxml = fs.readFileSync(path.join(root, "miniprogram/components/knowledge-card-surface/index.wxml"), "utf8");
const mapJs = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/map/index.js"), "utf8");
const mapWxml = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/map/index.wxml"), "utf8");
const searchJs = fs.readFileSync(path.join(root, "miniprogram/subpackages/politics/search/index.js"), "utf8");
const legacyReadingPage = detailJs.includes("readingBlocks") && detailJs.includes("OPEN_SOURCE_BLOCK") && detailJs.includes("RETURN_FROM_SOURCE");
const unifiedReadingPage = detailJs.includes("redirectTo")
  && mapJs.includes("projectKnowledgeSpaceViewModel")
  && mapJs.includes("UPDATE_READING_SNAPSHOT")
  && mapWxml.includes("space.card.content")
  && mapWxml.includes("contentBlock.kind === 'table'")
  && mapWxml.includes("完整内容");
const r5ReadingPage = detailJs.includes("projectKnowledgeCardSurfaceViewModel")
  && detailJs.includes('type: "UPDATE_READING_SNAPSHOT"')
  && detailJs.includes("pendingBlockId")
  && detailWxml.includes("<knowledge-card-surface")
  && detailConfig.includes('"knowledge-card-surface"')
  && cardWxml.includes("card.semanticBlocks")
  && cardWxml.includes("block.kind === 'table'")
  && cardWxml.includes("block.text || block.fallbackText");
assert.ok(legacyReadingPage || unifiedReadingPage || r5ReadingPage, "完整阅读、块锚点和来源返回未由页面承载");
if (legacyReadingPage) {
  for (const marker of ["block.kind === 'table'", "reading-fallback", "重点 ·", "专注阅读", "readingHasMore"]) {
    assert.ok(detailWxml.includes(marker), `detail template missing ${marker}`);
  }
}
let blockResult = null;
for (const unit of knowledgePackage.knowledgeUnits) {
  for (const block of unit.blocks) {
    const clean = block.fallbackText.replace(/\s+/g, " ").trim();
    if (clean.length < 18) continue;
    const blockQuery = clean.slice(Math.floor(clean.length / 3), Math.floor(clean.length / 3) + 14);
    blockResult = platform.projectSearchResults(knowledgePackage, blockQuery)
      .find((item) => item.pointId === unit.id && item.blockId === block.id);
    if (blockResult) break;
  }
  if (blockResult) break;
}
assert.ok(blockResult?.blockId, "canonical search must retain semantic source block anchor");
assert.ok(searchJs.includes("blockId") && (searchJs.includes("&block=") || searchJs.includes("query.push(`block=")));
for (const legacyPage of ["miniprogram/pages/common-sense/index.js", "miniprogram/pages/note/index/index.js"]) {
  assert.ok(!fs.readFileSync(path.join(root, legacyPage), "utf8").includes("knowledge-platform"));
}

console.log("knowledge platform semantic reading validation passed: 643 blocks, all kinds degrade, 57-block batching and anchors reversible");
