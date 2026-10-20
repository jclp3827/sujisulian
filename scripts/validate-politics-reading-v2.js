#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const platform = require("../miniprogram/services/knowledge-platform");
const { sourcePackage, knowledgePackage } = require("../miniprogram/services/knowledge-platform/politics-runtime");
const read = (file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8");

function formalFacts(source) {
  return source.points.map((point) => ({
    id: point.id, title: point.title, sourceUnits: point.sourceUnits, sourcePages: point.sourcePages,
    sourceHash: point.sourceHash, summary: point.summary, summaryBlockId: point.summaryBlockId,
    card: point.card, relations: point.relations,
    blocks: [...point.contentBlocks, ...point.confusionBlocks].map(({ reading, ...block }) => block),
    relationItems: point.relationItems.map(({ readingRole, placement, placementBlockId, ...relation }) => relation),
  }));
}
const factsHash = crypto.createHash("sha256").update(JSON.stringify(formalFacts(sourcePackage))).digest("hex");
assert.equal(factsHash, "75d556917fc49619ac89e69f29ae53b318a3ea09ae672586cea5da239c9f22d2", "formal wording, identity, source, recall or relation changed from the pre-v2 baseline");

function card(id) { return platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, `politics-toc-v2-${id}`); }
for (const unit of knowledgePackage.knowledgeUnits) {
  const vm = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, unit.id);
  assert.deepEqual(vm.outlinePreview.map((item) => item.id), vm.sectionOutline.filter((item) => item.level === 1).map((item) => item.id));
  for (const block of vm.semanticBlocks) {
    if (block.readingRows.length) assert.equal(block.readingRows.flatMap((row) => row.runs).map((run) => run.text).join(""), block.text);
  }
}
assert.equal(card("u003").outlinePreview.length, 4);
assert.equal(card("u007").outlinePreview.length, 3);
assert.equal(card("u024").outlinePreview.length, 4);
assert.ok(card("u024").sectionOutline.some((item) => item.id.endsWith(":b012") && item.level === 2));
for (const [id, blockId, count] of [["u003", "b016", 14], ["u003", "b018", 6], ["u003", "b019", 6], ["u007", "b049", 4], ["u025", "b009", 3]]) {
  assert.equal(card(id).semanticBlocks.find((block) => block.sourceBlockId === blockId).readingRows.filter((row) => row.isItem).length, count);
}
const badFlow = platform.projectReadingBlock({ id: "bad-flow", kind: "paragraph", payload: { text: "完整原文" }, fallbackText: "完整原文", sourceRefIds: [], reading: { flow: { kind: "list", starts: [{ part: "text", quote: "不存在", occurrence: 1 }] } } });
assert.deepEqual(badFlow.readingRows, []);
assert.equal(badFlow.textRuns.map((run) => run.text).join(""), "完整原文");

const wxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
const detail = read("miniprogram/subpackages/politics/detail/index.wxml");
const route = read("miniprogram/subpackages/politics/route/guided-route.wxml");
assert.ok(!wxml.includes("displayPreferences.emphasis"), "legacy stored emphasis must not disable political scan cues");
assert.ok(!detail.includes("handleEmphasisToggle"));
assert.ok(wxml.includes("block.readingRows") && wxml.includes("row.runs"));
assert.match(route, /<knowledge-card-surface[^>]+bind:blockjump="handleReadingBlockJump"/);

let definition;
global.Page = (value) => { definition = value; };
require("../miniprogram/subpackages/politics/route/guided-route");
const currentCard = card("u007");
const target = currentCard.semanticBlocks.find((block) => block.sourceBlockId === "b043");
let scrolled = null, missingRect = false;
global.wx = {
  createSelectorQuery() {
    let viewport = false, selector = "";
    return { in() { return this; }, select(value) { selector = value; return this; }, boundingClientRect() { return this; }, selectViewport() { viewport = true; return this; }, scrollOffset() { return this; }, exec(cb) { cb(viewport ? [{ scrollTop: 100 }] : [selector === ".route-step-progress" ? { height: 96 } : missingRect ? null : { top: 600 }]); } };
  },
  pageScrollTo(options) { scrolled = options.scrollTop; options.success(); },
};
const page = { ...definition, data: { type: "systematic", currentCard, displayPreferences: { motion: "reduced" } }, session: { currentStepId: "unchanged", status: "active" }, selectComponent() { return {}; }, setData(patch) { Object.assign(this.data, patch); } };
page.handleReadingBlockJump({ detail: { blockId: target.id } });
assert.equal(scrolled, 588, "sticky progress must not cover the target heading");
assert.equal(page.data.activeReadingBlockId, target.id);
assert.deepEqual(page.session, { currentStepId: "unchanged", status: "active" });
scrolled = null;
page.handleReadingBlockJump({ detail: { blockId: "missing" } });
assert.equal(scrolled, null);
missingRect = true;
page.handleReadingBlockJump({ detail: { blockId: target.id } });
assert.match(page.data.readingAnchorNotice, /无法定位/);
page.onUnload();

console.log(JSON.stringify({ status: "passed", packageVersion: knowledgePackage.packageVersion, formalFactsSha256: factsHash, checks: ["frozen-pre-v2-facts", "all-root-themes", "lossless-list-flow", "fixed-emphasis", "systematic-jump-and-failure", "route-progress-unchanged"] }, null, 2));
