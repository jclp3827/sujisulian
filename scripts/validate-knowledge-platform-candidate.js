const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const platform = require("../miniprogram/services/knowledge-platform/index");
const { knowledgePackage } = require("../miniprogram/services/knowledge-platform/politics-runtime");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const occurrences = (text, marker) => text.split(marker).length - 1;

assert.equal(platform.getRolloutStage("politics"), "candidate");
assert.equal(platform.getRolloutStage("common-sense"), "legacy");
assert.equal(platform.getRolloutStage("notes"), "legacy");
assert.deepEqual(knowledgePackage.diagnostics.counts, {
  navigationNodes: 42,
  knowledgeUnits: 37,
  semanticBlocks: 643,
  relations: 39,
  recallItems: 136,
  sourceReferences: 37,
  publishableUnits: 37,
});
assert.equal(knowledgePackage.moduleProfile.surfaceCopy.contentNotice, "当前仅覆盖两篇理论内容");

const theme = read("miniprogram/styles/theme.wxss");
for (const token of ["knowledge-system", "knowledge-reading", "knowledge-boundary", "knowledge-recall", "knowledge-evidence"]) {
  assert.ok(theme.includes(`--${token}-text`) && theme.includes(`--${token}-soft`), `missing ${token} semantic tokens`);
}

const mapJs = read("miniprogram/subpackages/politics/map/index.js");
const mapWxml = read("miniprogram/subpackages/politics/map/index.wxml");
const mapWxss = read("miniprogram/subpackages/politics/map/index.wxss");
const spaceWxml = read("miniprogram/components/knowledge-space-surface/index.wxml");
const spaceWxss = read("miniprogram/components/knowledge-space-surface/index.wxss");
const legacyMapSurface = mapJs.includes("motionDuration(getDisplayPreferences(), 160)")
  && mapJs.includes("}, false)")
  && mapWxml.includes("aria-disabled")
  && mapWxml.includes("精确访问同一范围");
const unifiedMapSurface = mapJs.includes("projectKnowledgeSpaceViewModel")
  && mapJs.includes("saveViewport")
  && mapJs.includes("getDisplayPreferences")
  && mapWxml.includes("knowledge-space-surface")
  && spaceWxml.includes("space.overviewContext")
  && spaceWxml.includes("space.directoryRows")
  && spaceWxml.includes('role="button"');
assert.ok(legacyMapSurface || unifiedMapSurface, "知识空间缺少viewport恢复、等价目录或可访问动作");
for (const marker of ["knowledge-space-root", "knowledge-space-regions", "knowledge-branch", "knowledge-directory"]) assert.ok(spaceWxml.includes(marker), `missing spatial grammar: ${marker}`);
assert.ok(spaceWxss.includes("minmax(0, 1fr)") && !spaceWxml.includes("scroll-x"));

const detailWxml = read("miniprogram/subpackages/politics/detail/index.wxml");
const detailWxss = read("miniprogram/subpackages/politics/detail/index.wxss");
const detailJs = read("miniprogram/subpackages/politics/detail/index.js");
const cardWxml = read("miniprogram/components/knowledge-card-surface/index.wxml");
const cardWxss = read("miniprogram/components/knowledge-card-surface/index.wxss");
const legacyDetailSurface = ["aria-expanded", "aria-pressed", "aria-label=\"问题说明\"", "reading-motion-", "reading-density-"].every((marker) => detailWxml.includes(marker))
  && detailWxss.includes("max-height: 80vh")
  && occurrences(detailWxml, 'role="tablist"') === 1
  && occurrences(detailWxml, "workbench-preview-primary") === 1;
const unifiedDetailSurface = detailJs.includes("projectKnowledgeCardSurfaceViewModel")
  && detailWxml.includes("knowledge-card-surface")
  && cardWxml.includes("card.semanticBlocks")
  && cardWxml.includes("card.relationFooter")
  && cardWxml.includes("recallView")
  && detailWxml.includes('aria-label="正文工具栏"')
  && detailWxss.includes(".politics-reading-toolbar")
  && cardWxss.includes("knowledge-card-recall")
  && !detailJs.includes("redirectTo");
assert.ok(legacyDetailSurface || unifiedDetailSurface, "知识卡的显示、反馈、预览和无障碍合同不完整");
assert.ok(!detailWxml.includes("reading-focus-shortcut"), "focus reading must not have a duplicate shortcut");

const searchWxml = read("miniprogram/subpackages/politics/search/index.wxml");
const searchWxss = read("miniprogram/subpackages/politics/search/index.wxss");
assert.ok(searchWxml.includes("搜索关键词") && searchWxml.includes('role="tab"') && searchWxml.includes("politics-search-match"));
assert.ok(!searchWxml.includes("politics-search-actions"), "result cards must have one direct decision");
assert.equal(occurrences(searchWxml, "politics-search-preview-primary"), 0, "search must not restore the superseded preview drawer");
assert.ok(!searchWxml.includes("previewOtherExpanded") && !searchWxss.includes(".politics-search-preview"),
  "direct search results must not retain the retired preview drawer");

const routeWxml = read("miniprogram/subpackages/politics/route/guided-route.wxml");
const routeWxss = read("miniprogram/subpackages/politics/route/guided-route.wxss");
assert.ok(routeWxml.includes('role="dialog"') && routeWxml.includes('aria-modal="true"')
  && routeWxml.includes("调整学习范围") && routeWxml.includes("换一组知识"));
assert.ok(routeWxml.includes("handleScopePreview") && routeWxml.includes("handleScopeConfirm")
  && routeWxml.includes("handleAdjustClose"), "scope changes must be previewed and explicitly confirmed or cancelled");
assert.ok(routeWxss.includes("min-height: 88rpx"));
assert.ok(routeWxml.includes("route.current.stage") && !routeWxml.includes("stepOpened"), "route must derive its action from the current plan stage");
assert.deepEqual(
  platform.ROUTE_TYPES.map((type) => platform.ROUTE_META[type].startAction),
  ["开始快速导读", "开始第一个知识", "开始这组辨析", "开始第一张"],
  "route goals must declare distinct entry objects",
);
for (const marker of ["quick-primer", "quick-section", "adjustmentContrasts", "adjustmentScopes", "guided-recall-card", "guided-system", "guided-contrast", "guided-exam"]) {
  assert.ok(routeWxml.includes(marker), `route experience must differ end to end: ${marker}`);
}
assert.ok(routeWxml.includes("route.progress") && routeWxml.includes("route-step-progress")
  && routeWxss.includes("route-progress-current") && routeWxss.includes("guided-recall-card"));
const contrastWxml = read("miniprogram/components/contrast-surface/index.wxml");
assert.ok(routeWxml.includes("<contrast-surface")
  && routeWxml.includes('evidence-sides="{{route.experience.confusion.contrastPair.sides}}"')
  && contrastWxml.includes('wx:for="{{evidenceSides}}"')
  && contrastWxml.includes("{{sourceBlock.text}}")
  && contrastWxml.includes('data-side="{{item.side}}"')
  && read("miniprogram/components/contrast-surface/index.wxss").includes(".contrast-evidence-side"),
  "contrast layout must be owned by the shared contrast component");

const homeWxml = read("miniprogram/pages/politics/index.wxml");
const legacyHomePrimary = homeWxml.includes('wx:if="{{recentFocus}}" class="politics-home-primary"') && homeWxml.includes("wx:else class=\"politics-home-primary\"");
const unifiedHomePrimary = homeWxml.includes('wx:if="{{decision}}"')
  && occurrences(homeWxml, 'class="politics-home-primary"') === 1
  && homeWxml.includes("decision.recommendedAction")
  && homeWxml.includes("decision.stateId === 'recent-focus'");
const resumeHomePrimary = occurrences(homeWxml, 'class="politics-resume"') === 1
  && homeWxml.includes('wx:if="{{resumePrompt}}"')
  && homeWxml.includes('bindtap="handlePrimaryTap"')
  && homeWxml.includes("resumePrompt.recommendedAction.label");
const dailyHomePrimary = occurrences(homeWxml, 'class="politics-resume"') === 1
  && homeWxml.includes('wx:if="{{dailyCard}}"')
  && homeWxml.includes('bindtap="handleDailyTap"')
  && homeWxml.includes("dailyCard.action");
assert.ok(legacyHomePrimary || unifiedHomePrimary || resumeHomePrimary || dailyHomePrimary, "首页没有唯一状态主动作");
assert.ok(!homeWxml.includes('bindtap="handleRegionTap"'), "home regions must not compete with the primary action");

const visiblePoliticsWxml = [
  "miniprogram/pages/politics/index.wxml",
  "miniprogram/subpackages/politics/map/index.wxml",
  "miniprogram/subpackages/politics/search/index.wxml",
  "miniprogram/subpackages/politics/route/guided-route.wxml",
  "miniprogram/subpackages/politics/practice/index.wxml",
  "miniprogram/components/knowledge-space-surface/index.wxml",
  "miniprogram/components/knowledge-card-surface/index.wxml",
].concat(detailJs.includes("redirectTo") ? [] : ["miniprogram/subpackages/politics/detail/index.wxml"]).map(read).join("\n");
const learnerText = `${visiblePoliticsWxml.replace(/<[^>]+>/g, " ")} ${[...visiblePoliticsWxml.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]).join(" ")}`;
const internalTerms = /L[0-4]|语义层|建立知识焦点|一跳|一层关系|范围聚合|正式目录范围|全量联调|隔离展现联调|不代表正式发布|风险页|正式\s*Markdown|重新构建|内容块|正式文件|来源单元|内容版本|审核日期|精确正文块|\b(?:schema|blockId|canonical|review|release)\b/i;
assert.ok(!internalTerms.test(learnerText), `internal term leaked into default UI: ${learnerText.match(internalTerms)?.[0]}`);

let storedPreferences = null;
global.wx = {
  getStorageSync() { return storedPreferences; },
  setStorageSync(key, value) { storedPreferences = value; },
};
assert.equal(platform.motionDuration({ motion: "full" }, 160), 160);
assert.equal(platform.motionDuration({ motion: "reduced" }, 160), 0);
platform.saveDisplayPreferences({ motion: "reduced" });
assert.equal(platform.getDisplayPreferences().motion, "reduced");
assert.equal(platform.getDisplayPreferences().fontScale, "default");

const rootNodeId = knowledgePackage.indexes.rootNavigationIds[0];
const focusUnit = knowledgePackage.knowledgeUnits[0];
const focusContext = platform.applyContextEvent(knowledgePackage, platform.createKnowledgeContext("politics"), { type: "SELECT_POINT", pointId: focusUnit.id, at: 1 });
const benchmarks = [
  ["terrain", () => platform.projectTerrainViewModel(knowledgePackage, platform.createKnowledgeContext("politics"), { semanticLevel: 0, scopeNodeId: rootNodeId })],
  ["workbench", () => platform.projectFocusWorkbenchViewModel(knowledgePackage, focusContext)],
  ["search", () => platform.projectSearchResults(knowledgePackage, "马克思主义")],
];
const timings = {};
for (const [name, project] of benchmarks) {
  for (let index = 0; index < 10; index += 1) project();
  const samples = [];
  for (let index = 0; index < 50; index += 1) {
    const start = performance.now();
    project();
    samples.push(performance.now() - start);
  }
  timings[name] = { maxMs: Math.max(...samples), averageMs: samples.reduce((sum, value) => sum + value, 0) / samples.length };
  assert.ok(timings[name].maxMs <= 50, `${name} projection exceeded 50ms: ${timings[name].maxMs}`);
}

const runtimeFiles = fs.readdirSync(path.join(root, "miniprogram/services/knowledge-platform"))
  .filter((file) => file.endsWith(".js"))
  .map((file) => read(`miniprogram/services/knowledge-platform/${file}`))
  .join("\n");
assert.ok(!/require\([^)]*(obsidian|\.base|\.canvas|plugin)/i.test(runtimeFiles), "runtime gained an external knowledge-tool dependency");
assert.ok(runtimeFiles.includes("obsidianRuntimeRequired: false"), "runtime independence flag changed");
for (const legacyPage of ["miniprogram/pages/common-sense/index.js", "miniprogram/pages/note/index/index.js"]) {
  assert.ok(!read(legacyPage).includes("knowledge-platform"), `${legacyPage} must remain legacy`);
}

console.log(JSON.stringify({ status: "passed", timings }, null, 2));
