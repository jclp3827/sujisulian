#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const knowledgePackage = require(path.join(repo, "miniprogram/models/politics-p3-v2-preview"));
const { knowledgePackage: runtimePackage } = require(path.join(repo, "miniprogram/services/knowledge-platform/politics-runtime"));
const mockStorage = new Map();
let clipboardText = "";
const navigationCalls = [];

function loadPage(relativePath) {
  let definition;
  global.Page = (page) => { definition = page; };
  global.wx = {
    navigateTo(payload) { navigationCalls.push(payload); },
    navigateBack() {},
    redirectTo() {},
    pageScrollTo() {},
    setNavigationBarTitle() {},
    showToast() {},
    getStorageSync(key) { return mockStorage.get(key); },
    setStorageSync(key, value) { mockStorage.set(key, value); },
    setClipboardData({ data, success }) {
      clipboardText = data;
      if (success) success();
    },
  };
  const fullPath = path.join(repo, relativePath);
  delete require.cache[require.resolve(fullPath)];
  require(fullPath);
  assert.ok(definition, `${relativePath}: 未注册 Page`);

  const context = {
    ...definition,
    data: JSON.parse(JSON.stringify(definition.data)),
    setData(patch, callback) {
      this.data = { ...this.data, ...patch };
      if (callback) callback();
    },
  };
  return context;
}

function validatePackage() {
  assert.strictEqual(knowledgePackage.schemaVersion, 3, "P3 V2 必须使用 schema v3");
  assert.strictEqual(knowledgePackage.buildScope, "review", "P3 展现必须使用隔离校对数据");
  assert.strictEqual(knowledgePackage.points.length, 37, "P3 展现必须覆盖 37 篇目录优先加工内容");
  assert.strictEqual(knowledgePackage.directory.nodes.length, 42, "P3 展现必须保留 42 个正式目录节点");
  assert.strictEqual(
    knowledgePackage.navigationOrder.length,
    knowledgePackage.points.length,
    "导航顺序必须覆盖全部知识点",
  );
  assert.strictEqual(
    knowledgePackage.searchIndex.length,
    knowledgePackage.points.length,
    "搜索索引必须覆盖全部知识点",
  );

  const pointIds = new Set(knowledgePackage.points.map((point) => point.id));
  const blockIds = new Set();
  for (const point of knowledgePackage.points) {
    assert.ok(knowledgePackage.navigationOrder.includes(point.id), `${point.id}: 缺少导航顺序`);
    const searchItem = knowledgePackage.searchIndex.find((item) => item.id === point.id);
    assert.ok(searchItem?.indexText.includes(point.title), `${point.id}: 搜索索引缺少标题`);
    assert.ok(Number.isInteger(point.mapDepth), `${point.id}: 缺少地图深度`);
    for (const block of [...point.contentBlocks, ...point.confusionBlocks]) {
      assert.ok(block.id, `${point.id}: 内容块缺少锚点`);
      const scopedId = `${point.id}|${block.id}`;
      assert.ok(!blockIds.has(scopedId), `${point.id}: 内容块锚点重复 ${block.id}`);
      blockIds.add(scopedId);
      assert.ok(block.semantic, `${point.id}: 内容块 ${block.id} 缺少展示语义`);
    }
    for (const outlineItem of point.outline) {
      assert.ok(
        point.contentBlocks.some((block) => block.id === outlineItem.id),
        `${point.id}: 提纲锚点 ${outlineItem.id} 不存在`,
      );
    }
    for (const relation of point.relationItems) {
      assert.ok(pointIds.has(relation.targetId), `${point.id}: 关系目标 ${relation.targetId} 不存在`);
      assert.ok(relation.why, `${point.id}: 关系 ${relation.targetId} 缺少说明`);
      assert.ok(["authored", "derived"].includes(relation.whySource), `${point.id}: 关系说明来源不合法`);
      const target = knowledgePackage.points.find((item) => item.id === relation.targetId);
      assert.ok(
        target.reverseRelations.some((item) => item.targetId === point.id),
        `${point.id}: 关系 ${relation.targetId} 缺少反向索引`,
      );
    }
  }
}

function validateFocusPage() {
  const page = loadPage("miniprogram/subpackages/politics/detail/index.js");
  const first = knowledgePackage.points[0];
  page.onLoad({ id: first.id, mode: "reading", origin: "test" });
  assert.strictEqual(page.data.cardSurface.identity.pointId, first.id, "详情页未加载指定知识");
  assert.strictEqual(page.data.cardSurface.activity, "reading", "详情页未默认进入正文");
  const runtimeUnit = runtimePackage.knowledgeUnits.find((item) => item.id === first.id);
  assert.deepStrictEqual(page.data.cardSurface.semanticBlocks.map((item) => item.id), runtimeUnit.blocks.map((item) => item.id), "共享知识卡未保留完整正文顺序");
  page.handleSourceFeedback();
  assert.ok(page.data.sourceVisible, "来源信息面板未打开");
  page.handleCorrectionOpen();
  assert.strictEqual(page.data.sourceVisible, false, "进入反馈后来源面板未关闭");
  assert.ok(page.data.correctionVisible, "纠错记录面板未打开");
  page.handleCorrectionTypeTap({ currentTarget: { dataset: { type: "关系不准确" } } });
  page.handleCorrectionInput({ detail: { value: "自动回归测试记录" } });
  page.handleCorrectionSave();
  const records = mockStorage.get("politics-correction-queue-v1");
  assert.strictEqual(records.length, 1, "纠错记录未保存到本地队列");
  assert.strictEqual(records[0].pointId, first.id, "纠错记录未绑定知识点");
  assert.strictEqual(records[0].status, "local-pending", "纠错记录状态不正确");
}

function validateMapPage() {
  const page = loadPage("miniprogram/subpackages/politics/map/index.js");
  if (!Object.prototype.hasOwnProperty.call(page.data, "mapLevel")) {
    page.onLoad({ state: "overview" });
    assert.strictEqual(page.data.space.surfaceState, "branch", "知识空间未默认展开第一篇");
    assert.strictEqual(page.data.space.overviewContext.regions.length, 2, "稳定底图区域数错误");
    assert.strictEqual(page.data.space.directoryRows.length, 42, "递归目录未覆盖42个正式节点");
    assert.strictEqual(page.data.space.branch.id, page.data.space.overviewContext.regions[0].id, "默认选择不是第一篇");
    page.handleRegionTap({ currentTarget: { dataset: { nodeId: page.data.space.overviewContext.regions[1].id } } });
    assert.strictEqual(page.data.space.surfaceState, "branch", "分支未在同一页面原地展开");
    assert.strictEqual(page.data.space.branch.id, page.data.space.overviewContext.regions[1].id, "切换篇目未生效");
    assert.ok(page.data.space.overviewContext.regions.some((item) => item.compressed), "分支态全局区域栏未保留顶层兄弟区域");
    const pointNode = page.data.space.branch.groups.flatMap((group) => group.items).find((item) => item.pointId);
    assert.ok(pointNode, "展开分支未提供可直接访问的知识");
    const branchId = page.data.space.branch.id;
    const beforeNavigation = navigationCalls.length;
    page.handleBranchNodeTap({ currentTarget: { dataset: { nodeId: pointNode.id } } });
    assert.strictEqual(navigationCalls.length, beforeNavigation + 1, "具体知识未使用原生页面栈打开详情");
    assert.ok(navigationCalls.at(-1).url.includes("/subpackages/politics/detail/index"), "具体知识目标不是独立详情页");
    assert.strictEqual(page.data.space.surfaceState, "branch", "进入详情时替换了来源分支");
    assert.strictEqual(page.data.space.branch.id, branchId, "进入详情后来源分支位置丢失");
    return;
  }
  const focus = knowledgePackage.points.find((point) => point.mapDepth > 0) || knowledgePackage.points[0];
  page.onLoad({ focus: focus.id });
  assert.strictEqual(page.data.mapLevel, "branch", "地图深链未进入分支层");
  assert.strictEqual(page.data.selectedPointId, focus.id, "地图深链未定位当前节点");
  assert.ok(page.data.activeCategory.layers.length, "地图分支缺少前置层级");
  page.handleMapOverviewTap();
  assert.strictEqual(page.data.mapLevel, "overview", "地图未能返回总览层");
  page.handleMapRecallToggle();
  assert.strictEqual(page.data.mapLevel, "branch", "地图回忆未进入可作答分支");
  assert.ok(page.data.recallMasked, "地图回忆未遮蔽节点");
  page.selectPoint(page.data.activeCategory.layers[0].points[0].id, false);
  assert.strictEqual(page.data.nodeAnswerVisible, false, "遮蔽地图提前显示节点答案");
  page.handleNodeAnswerReveal();
  assert.strictEqual(page.data.nodeAnswerVisible, true, "地图节点答案未揭晓");
}

function validateSearchPage() {
  const page = loadPage("miniprogram/subpackages/politics/search/index.js");
  page.onLoad({});
  page.runSearch("矛盾");
  assert.ok(page.data.results.length, "政治知识搜索没有返回正文命中");
  assert.ok(page.data.results.every((item) => item.matchLabel), "搜索结果缺少命中说明");
  const result = page.data.results[0];
  const beforeNavigation = navigationCalls.length;
  page.handleResultTap({ currentTarget: { dataset: { pointId: result.pointId } } });
  assert.strictEqual(navigationCalls.length, beforeNavigation + 1, "搜索结果未直接打开知识");
  assert.ok(navigationCalls.at(-1).url.includes("/subpackages/politics/detail/index"), "搜索结果未进入独立正文");
  assert.ok(navigationCalls.at(-1).url.includes("origin=search"), "搜索返回上下文丢失");
  assert.strictEqual(page.data.selectedResultId, result.pointId, "打开知识后丢失搜索选中项");
}

function validateTemplates() {
  const detailTemplate = fs.readFileSync(
    path.join(repo, "miniprogram/subpackages/politics/detail/index.wxml"),
    "utf8",
  );
  const detailSource = fs.readFileSync(path.join(repo, "miniprogram/subpackages/politics/detail/index.js"), "utf8");
  const cardTemplate = fs.readFileSync(path.join(repo, "miniprogram/components/knowledge-card-surface/index.wxml"), "utf8");
  const spaceTemplate = fs.readFileSync(path.join(repo, "miniprogram/components/knowledge-space-surface/index.wxml"), "utf8");
  const mapTemplate = fs.readFileSync(
    path.join(repo, "miniprogram/subpackages/politics/map/index.wxml"),
    "utf8",
  );
  const legacyTemplates = detailTemplate.includes("知识活动切换")
    && detailTemplate.includes("wx:else class=\"politics-paragraph\"")
    && detailTemplate.includes("证据层")
    && detailTemplate.includes("本地待处理记录")
    && detailTemplate.includes("待专项核对页")
    && mapTemplate.includes("地图回忆");
  const unifiedTemplates = !detailSource.includes("redirectTo")
    && detailTemplate.includes("knowledge-card-surface")
    && mapTemplate.includes("knowledge-space-surface")
    && cardTemplate.includes("card.semanticBlocks")
    && cardTemplate.includes("recallView")
    && detailTemplate.includes("来源与内容状态")
    && detailTemplate.includes("sourceVisible && cardSurface")
    && detailTemplate.includes("handleCorrectionOpen")
    && spaceTemplate.includes("space.directoryRows");
  assert.ok(legacyTemplates || unifiedTemplates, "展现层缺少完整阅读、回忆、反馈或可读降级");
  const appConfig = JSON.parse(fs.readFileSync(path.join(repo, "miniprogram/app.json"), "utf8"));
  const politicsPackage = appConfig.subPackages.find((item) => item.root === "subpackages/politics");
  assert.ok(politicsPackage.pages.includes("search/index"), "政治分包缺少搜索页注册");
}

validatePackage();
validateFocusPage();
validateMapPage();
validateSearchPage();
validateTemplates();
console.log(`politics presentation validation passed: ${knowledgePackage.points.length} points, schema v${knowledgePackage.schemaVersion}`);
