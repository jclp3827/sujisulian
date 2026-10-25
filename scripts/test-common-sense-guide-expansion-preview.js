#!/usr/bin/env node
const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { createRequire } = require("module");

const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const sample = require("../miniprogram/subpackages/common-sense/models/guide-expansion-candidate");
const { createGoldenGuideContent } = require("../miniprogram/subpackages/common-sense/services/guide-content");

const clone = (value) => JSON.parse(JSON.stringify(value));

function createStorage(seed = {}) {
  const data = clone(seed);
  return {
    data,
    getStorageSync(key) { return data[key] && clone(data[key]); },
    setStorageSync(key, value) { data[key] = clone(value); },
  };
}

function loadPage(file, wx) {
  const filename = path.resolve(__dirname, "../miniprogram", file);
  let definition;
  vm.runInNewContext(fs.readFileSync(filename, "utf8"), {
    require: createRequire(filename),
    Page(value) { definition = value; },
    wx,
    console,
    setTimeout,
    clearTimeout,
  }, { filename });
  return {
    ...definition,
    data: clone(definition.data),
    setData(values) { Object.assign(this.data, values); },
  };
}

const content = createGoldenGuideContent(body, sample);
assert.equal(content.sampleId, "common-sense-guide-expansion-v1");
assert.equal(content.stats.groups, 170);
assert.equal(content.stats.cards, 1682);
assert.equal(content.stats.holds, 0);
assert.equal(sample.exclusions.length, 301);
assert.deepEqual(content.stats.scopes, {
  "humanities-history": 565,
  "science-technology": 416,
  economics: 255,
  law: 446,
});
assert.equal(content.cards.every((card) => card.sourceUrl.includes(`pointId=${encodeURIComponent(card.pointId)}`) &&
  card.sourceUrl.includes(`tabId=${encodeURIComponent(card.tabId)}`)), true);
assert.equal(content.cards.every((card) => !sample.holds.some((hold) => card.id.endsWith(`::${hold.id}`))), true);

const formalSeed = { version: "formal-seed" };
const goldenSeed = { version: "golden-seed" };
const storage = createStorage({
  "common-sense-guide-v1": formalSeed,
  "common-sense-guide-v1:golden-v1": goldenSeed,
});
const urls = [];
const wx = {
  ...storage,
  getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }),
  setNavigationBarTitle() {},
  navigateTo({ url }) { urls.push(url); },
};
const page = loadPage("subpackages/common-sense/learning/index.js", wx);
page.onLoad({ mode: "guide", sample: "expansion-v1", groupId: "prehistoric-civilization", count: "5" });
assert.equal(page.data.guidePreview, true);
assert.equal(page.data.candidatePreview, true);
assert.equal(page.data.goldenSample, false);
assert.equal(page.data.title, "知识导读测试");
assert.equal(page.data.guidePreviewLabel, "扩库候选");
assert.equal(page.data.guidePreviewSummary, "1682 张候选卡 · 0 项 HOLD · 与正式进度隔离");
assert.deepEqual(Array.from(page.data.scopes, (item) => item.id), ["all", "humanities-history", "science-technology", "economics", "law"]);
assert.equal(page.data.guideGroup.id, "prehistoric-civilization");
assert.equal(page.data.total, 5);
assert.equal(page.data.guideCard.id, "prehistoric-civilization::paleolithic-tools-and-fire");
assert.equal(page.data.guideCard.productionLabel, "综合总结");
assert.ok(storage.data["common-sense-guide-v1:expansion-v1"], "扩库候选必须使用独立进度空间");
assert.deepEqual(storage.data["common-sense-guide-v1"], formalSeed, "扩库候选不得污染正式知识导读进度");
assert.deepEqual(storage.data["common-sense-guide-v1:golden-v1"], goldenSeed, "扩库候选不得污染黄金样例进度");

const firstCard = page.data.guideCard;
page.handleGuideAssess({ currentTarget: { dataset: { result: "fuzzy" } } });
assert.equal(page.data.index, 2);
assert.equal(page.guideSession.assessments[firstCard.id].status, "fuzzy");
assert.deepEqual(storage.data["common-sense-guide-v1"], formalSeed);
assert.deepEqual(storage.data["common-sense-guide-v1:golden-v1"], goldenSeed);
page.handleSource({ currentTarget: { dataset: { point: firstCard.pointId, tab: firstCard.tabId } } });
assert.match(urls.pop(), /pointId=prehistoric-civilization&tabId=/u);
page.handleMenu();
page.handleCount({ currentTarget: { dataset: { count: 10 } } });
page.handleSaveSettings();
assert.equal(page.data.settingsOpen, false);
assert.equal(page.data.count, 10);
assert.equal(page.guideSession.count, 10);
assert.equal(page.data.notice, "导读卡已按新设置刷新。");
assert.deepEqual(storage.data["common-sense-guide-v1"], formalSeed);
assert.deepEqual(storage.data["common-sense-guide-v1:golden-v1"], goldenSeed);

const releaseStorage = createStorage();
const releasePage = loadPage("subpackages/common-sense/learning/index.js", {
  ...releaseStorage,
  getAccountInfoSync: () => ({ miniProgram: { envVersion: "release" } }),
  setNavigationBarTitle() {},
  navigateTo() {},
});
releasePage.onLoad({ mode: "guide", sample: "expansion-v1", groupId: "prehistoric-civilization", count: "5" });
assert.equal(releasePage.data.guidePreview, false, "扩库候选不得在正式环境通过 query 开启");
assert.equal(releasePage.data.candidatePreview, false);
assert.equal(releasePage.guideContent.profile, undefined);

const wxml = fs.readFileSync(path.resolve(__dirname, "../miniprogram/subpackages/common-sense/learning/index.wxml"), "utf8");
assert.match(wxml, /wx:if="\{\{guidePreview\}\}" class="preview-note"/u);
assert.match(wxml, /\{\{guidePreviewLabel\}\} · \{\{guidePreviewSummary\}\}/u);
assert.match(wxml, /wx:if="\{\{guidePreview\}\}" class="muted guide-sample-meta"/u);

console.log(JSON.stringify({
  ok: true,
  groups: content.stats.groups,
  cards: content.stats.cards,
  holds: content.stats.holds,
  productionModes: content.stats.productionModes,
  storageKey: "common-sense-guide-v1:expansion-v1",
  previewPath: "/subpackages/common-sense/learning/index?mode=guide&sample=expansion-v1&groupId=prehistoric-civilization&count=5",
}, null, 2));


const golden=require('../miniprogram/subpackages/common-sense/models/guide-golden-sample');for(const g of golden.groups)for(const card of g.cards){const authored=sample.groups.find(x=>x.pointId===g.pointId).cards.find(x=>x.id===card.id);assert.deepEqual(authored,card);}console.log(JSON.stringify({allGoldenCardsPromotedInPlace:15}));
