#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const platform = require("../miniprogram/services/knowledge-platform");
const { sourcePackage, knowledgePackage } = require("../miniprogram/services/knowledge-platform/politics-runtime");

const repo = path.resolve(__dirname, "..");
const originalSamples = new Set([
  "politics-toc-v2-u003",
  "politics-toc-v2-u007",
  "politics-toc-v2-u024",
  "politics-toc-v2-u025",
]);

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
assert.equal(factsHash, "75d556917fc49619ac89e69f29ae53b318a3ea09ae672586cea5da239c9f22d2");
assert.equal(sourcePackage.points.length, 37);
assert.equal(knowledgePackage.knowledgeUnits.length, 37);

let annotationBlocks = 0;
let headingBlocks = 0;
let emphasisSelections = 0;
let flowBlocks = 0;
let flowItems = 0;
for (const source of sourcePackage.points) {
  const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === source.id);
  const card = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, source.id, { activity: "reading" });
  assert.ok(unit && card, `${source.id}: runtime projection missing`);
  assert.equal(source.readingSchema, 1, `${source.id}: source reading schema missing`);
  assert.equal(unit.readingSchema, 1, `${source.id}: runtime reading schema missing`);
  const sourceText = fs.readFileSync(path.join(repo, "docs/knowledge-pilot/knowledge/politics-v2", source.sourceFile), "utf8");
  assert.match(sourceText, /^reading_review_state: reviewed$/m, `${source.id}: reading review state missing`);
  const sourceBlocks = [...source.contentBlocks, ...source.confusionBlocks];
  assert.deepEqual(unit.blocks.map((block) => block.sourceBlockId), sourceBlocks.map((block) => block.id), `${source.id}: block order changed`);
  assert.ok(sourceBlocks.some((block) => block.reading), `${source.id}: no reviewed reading annotations`);
  for (const block of sourceBlocks) {
    if (!block.reading) continue;
    annotationBlocks += 1;
    if (block.reading.heading) headingBlocks += 1;
    emphasisSelections += block.reading.emphasis?.length || 0;
    if (block.reading.flow) flowBlocks += 1;
  }
  for (const block of card.semanticBlocks) {
    assert.equal(block.textRuns.map((run) => run.text).join(""), block.text, `${block.id}: text reconstruction failed`);
    if (block.readingRows.length) {
      assert.equal(block.readingRows.flatMap((row) => row.runs).map((run) => run.text).join(""), block.text, `${block.id}: flow reconstruction failed`);
      flowItems += block.readingRows.filter((row) => row.isItem).length;
    }
  }
  assert.ok(card.sectionOutline.every((item) => !/^知识延伸$/.test(item.label)), `${source.id}: generic knowledge-extension label entered outline`);
  assert.ok(card.sectionOutline.every((item) => !/^\s*(?:[0-9]+[.．、]|[一二三四五六七八九十]+、|[（(](?:[0-9]+|[一二三四五六七八九十]+)[）)]|[①②③④⑤⑥⑦⑧⑨⑩])/.test(item.displayLabel)), `${source.id}: display outline kept source numbering`);
}

assert.equal(sourcePackage.points.filter((point) => !originalSamples.has(point.id)).length, 33);
const u002 = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, "politics-toc-v2-u002", { activity: "reading" });
assert.equal(u002.sectionOutline.some((item) => item.label === "的重大成果"), false, "truncated repeated title entered outline");
assert.equal(u002.semanticBlocks[0].isSelfHeading, true, "truncated repeated title was not classified as self heading");

const wxml = fs.readFileSync(path.join(repo, "miniprogram/components/knowledge-card-surface/index.wxml"), "utf8");
assert.ok(wxml.includes("block.isSelfHeading"), "shared renderer does not consume self-heading classification");

assert.deepEqual({ annotationBlocks, headingBlocks, emphasisSelections, flowBlocks, flowItems }, {
  annotationBlocks: 563,
  headingBlocks: 158,
  emphasisSelections: 779,
  flowBlocks: 77,
  flowItems: 204,
}, "reviewed reading coverage changed unexpectedly");

console.log(JSON.stringify({
  status: "passed",
  packageVersion: knowledgePackage.packageVersion,
  formalFactsSha256: factsHash,
  coverage: { units: 37, expandedUnits: 33, annotationBlocks, headingBlocks, emphasisSelections, flowBlocks, flowItems },
  checks: ["all-units-reviewed", "formal-facts-frozen", "source-order", "lossless-text", "lossless-flow", "outline-labels", "truncated-self-heading"],
}, null, 2));
