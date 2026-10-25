#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const platform = require("../miniprogram/services/knowledge-platform");
const { sourcePackage, knowledgePackage } = require("../miniprogram/services/knowledge-platform/politics-runtime");

const repo = path.resolve(__dirname, "..");
const samples = {
  "politics-toc-v2-u025": ["b003", "b005", "b008"],
  "politics-toc-v2-u024": ["b003", "b005", "b006", "b009", "b012", "b014", "b015", "b017", "b019", "b021", "b022", "b024"],
  "politics-toc-v2-u003": ["b004", "b015", "b017", "b018"],
  "politics-toc-v2-u007": ["b001", "b004", "b008", "b014", "b021", "b023", "b024", "b030", "b034", "b039", "b043", "b044", "b052"],
};

function rawBlockText(block) {
  if (typeof block.text === "string") return block.text;
  if (Array.isArray(block.items)) return block.items.join("\n");
  if (Array.isArray(block.rows)) return block.rows.flat().join(" ");
  return JSON.stringify(block);
}

function assertProjectedTextReconstructs(block) {
  if (["heading", "paragraph", "quote", "callout", "fallback", "media"].includes(block.kind)) {
    assert.equal(block.textRuns.map((run) => run.text).join(""), block.text, `${block.id}: textRuns changed source text`);
  }
  for (const item of block.items || []) {
    assert.equal(item.runs.map((run) => run.text).join(""), item.text, `${block.id}: item runs changed source text`);
  }
  for (const row of block.tableRows || []) {
    for (const cell of row) assert.equal(cell.runs.map((run) => run.text).join(""), cell.value, `${block.id}: cell runs changed source text`);
  }
}

for (const [pointId, expectedOutlineSourceIds] of Object.entries(samples)) {
  const source = sourcePackage.points.find((point) => point.id === pointId);
  const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === pointId);
  const card = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, pointId, { activity: "reading" });
  assert.ok(source && unit && card, `${pointId}: sample missing`);
  assert.equal(source.readingSchema, 1, `${pointId}: source reading schema missing`);
  assert.equal(unit.readingSchema, 1, `${pointId}: runtime reading schema missing`);
  assert.deepEqual(unit.blocks.map((block) => block.sourceBlockId), [...source.contentBlocks, ...source.confusionBlocks].map((block) => block.id), `${pointId}: block order changed`);
  assert.deepEqual(unit.blocks.map((block) => block.fallbackText), [...source.contentBlocks, ...source.confusionBlocks].map(rawBlockText), `${pointId}: formal wording changed`);
  assert.deepEqual(card.sectionOutline.map((item) => item.id), expectedOutlineSourceIds.map((id) => `block:${pointId}:${id}`), `${pointId}: reviewed outline changed`);
  assert.ok(card.sectionOutline.every((item) => item.level >= 1 && item.level <= 3), `${pointId}: outline level missing`);
  assert.ok(card.semanticBlocks.some((block) => block.textRuns.some((run) => run.role === "key" || run.role === "boundary")), `${pointId}: no reviewed emphasis projected`);
  card.semanticBlocks.forEach(assertProjectedTextReconstructs);
}

const u025 = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, "politics-toc-v2-u025", { activity: "reading" });
const corrected = u025.semanticBlocks.find((block) => block.sourceBlockId === "b007");
assert.equal(corrected.originalSemantic, "conclusion", "u025 b007 semantic correction missing");
assert.ok(corrected.textRuns.some((run) => run.role === "key"), "u025 b007 reviewed emphasis missing");

const u024 = platform.projectKnowledgeCardSurfaceViewModel(knowledgePackage, "politics-toc-v2-u024", { activity: "reading" });
const comparison = u024.semanticBlocks.find((block) => block.sourceBlockId === "b025");
assert.equal(comparison.comparisonRows.length, 2, "u024 main-conflict comparison missing");
assert.deepEqual(comparison.comparisonRows.map((row) => row.cells.length), [2, 2]);

const crossRelationId = "relation:politics-toc-v2-u025:contrast:politics-toc-v2-u024";
for (const card of [u024, u025]) {
  assert.ok(card.relationFooter.items.some((item) => item.relationId === crossRelationId && item.purposeLabel === "对照理解"), "cross-point comparison is not in the optional footer");
  assert.ok(card.semanticBlocks.every((block) => !block.inlineContrasts.some((item) => item.relationId === crossRelationId)), "cross-point comparison interrupted the body");
}

const legacyBlock = platform.projectReadingBlock({
  id: "fixture:legacy-block",
  sourceBlockId: "b001",
  kind: "paragraph",
  semantic: "plain",
  payload: { text: "旧包完整原文" },
  fallbackText: "旧包完整原文",
  sourceRefIds: [],
  reviewState: "review",
});
assert.equal(legacyBlock.textRuns.map((run) => run.text).join(""), "旧包完整原文", "old-package fallback lost text");
assert.equal(legacyBlock.readingHeading, null, "old-package fallback guessed a reviewed heading");

const invalidOptional = platform.projectReadingBlock({
  id: "fixture:invalid-reading",
  sourceBlockId: "b001",
  kind: "paragraph",
  semantic: "plain",
  payload: { text: "完整原文" },
  fallbackText: "完整原文",
  reading: { heading: { level: 1, part: "text", quote: "不存在", occurrence: 1 } },
  sourceRefIds: [],
  reviewState: "review",
});
assert.equal(invalidOptional.textRuns.map((run) => run.text).join(""), "完整原文", "invalid optional annotation did not fail open to full text");
assert.equal(invalidOptional.readingHeading, null);

const cardWxml = fs.readFileSync(path.join(repo, "miniprogram/components/knowledge-card-surface/index.wxml"), "utf8");
const cardWxss = fs.readFileSync(path.join(repo, "miniprogram/components/knowledge-card-surface/index.wxss"), "utf8");
const detailWxml = fs.readFileSync(path.join(repo, "miniprogram/subpackages/politics/detail/index.wxml"), "utf8");
const detailWxss = fs.readFileSync(path.join(repo, "miniprogram/subpackages/politics/detail/index.wxss"), "utf8");
const detailJs = fs.readFileSync(path.join(repo, "miniprogram/subpackages/politics/detail/index.js"), "utf8");
const detailJson = JSON.parse(fs.readFileSync(path.join(repo, "miniprogram/subpackages/politics/detail/index.json"), "utf8"));
assert.ok(cardWxml.includes("block.textRuns") && cardWxml.includes("run.role === 'heading'") && cardWxml.includes("block.comparisonRows.length"), "WXML does not consume reading annotations");
assert.ok(!cardWxml.includes("block.semanticLabel"), "generic semantic pills remain in the body");
assert.ok(!cardWxml.includes("!compact && card.activity !== 'recall' && card.sectionOutline"), "compact route still hides the shared outline");
assert.ok(cardWxss.includes(".knowledge-inline-key") && cardWxss.includes(".knowledge-inline-boundary"), "key and boundary styles missing");
assert.match(cardWxss, /\.knowledge-inline-key\s*\{[^}]*box-shadow:\s*var\(--ui-emphasis-key-shadow\)/, "standalone key emphasis does not match the learning modes");
assert.match(cardWxss, /\.knowledge-inline-boundary\s*\{[^}]*text-underline-offset:\s*var\(--ui-emphasis-boundary-offset\)/, "standalone boundary emphasis does not match the learning modes");
assert.ok(detailWxml.includes('skin="politics"'), "standalone article does not pass the politics emphasis skin through component isolation");
assert.ok(cardWxml.includes("card.identity.pathText && !toolbarManaged"), "standalone reader still repeats the full hierarchy path under the title");
assert.ok(!detailWxml.includes("handleEmphasisToggle"), "fixed reading emphasis must not have an off switch");
assert.equal(detailJson.navigationStyle, "custom", "political article still exposes the native home fallback");
assert.ok(detailWxml.includes('bindtap="handleNavigationBack"') && detailWxml.includes("politics-detail-navigation-arrow"), "article custom back control is missing");
assert.ok(detailWxml.includes('aria-label="{{navigationReturnLabel}}"'), "article back control does not expose its real destination");
assert.match(detailJs, /handleNavigationBack\(\)[\s\S]*pages\.length > 1[\s\S]*wx\.navigateBack[\s\S]*wx\.switchTab\(\{ url: "\/pages\/politics\/index" \}\)/, "article back control does not fall back to the politics home");
assert.ok(detailWxss.includes(".politics-detail-navigation") && detailWxss.includes("var(--ui-touch-target)"), "article navigation is missing fixed layout or touch target");
assert.match(detailWxss, /\.politics-reading-context\s*\{[^}]*top:\s*var\(--politics-detail-nav-height\)/, "sticky article context can be hidden behind the custom navigation");
assert.equal(platform.normalizeDisplayPreferences({}).emphasis, "keyPoints", "reviewed emphasis must default on");

console.log(JSON.stringify({
  status: "passed",
  packageVersion: knowledgePackage.packageVersion,
  samples: Object.keys(samples),
  checks: ["source-order", "text-reconstruction", "reviewed-outline", "inline-emphasis", "standalone-path-suppression", "article-navigation-fallback", "comparison", "relation-placement", "synthetic-old-package-fallback", "wxml-consumption"],
}, null, 2));
