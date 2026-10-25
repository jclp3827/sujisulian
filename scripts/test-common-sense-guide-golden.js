#!/usr/bin/env node
const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { createRequire } = require("module");

const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const sample = require("../miniprogram/subpackages/common-sense/models/guide-golden-sample");
const {
  createGoldenGuideContent,
  explicitCardIdFor,
} = require("../miniprogram/subpackages/common-sense/services/guide-content");

const clone = (value) => JSON.parse(JSON.stringify(value));

function createStorage() {
  const data = {};
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
assert.equal(content.profile, "golden-sample");
assert.equal(content.sampleId, "common-sense-guide-golden-v1");
assert.equal(content.stats.groups, 6);
assert.equal(content.stats.cards, 15);
assert.equal(content.stats.holds, 3);
assert.deepEqual(content.stats.scopes, {
  "humanities-history": 4,
  "science-technology": 8,
  economics: 1,
  law: 2,
});
assert.deepEqual(content.stats.productionModes, {
  reuse: 3,
  "light-edit": 6,
  synthesized: 6,
});
assert.equal(new Set(content.cards.map((card) => card.id)).size, 15);
assert.equal(content.cards.every((card) => card.id === `${card.pointId}::${card.id.split("::")[1]}`), true);
assert.equal(content.cards.every((card) => card.sourceUrl.includes(`pointId=${encodeURIComponent(card.pointId)}`) &&
  card.sourceUrl.includes(`tabId=${encodeURIComponent(card.tabId)}`)), true);
assert.equal(content.cards.every((card) => card.review && card.review.noviceReadability === (new Set(["exchange-rate-effects::exchange-rate-trade-direction","administrative-litigation::administrative-litigation-burden-of-proof"]).has(card.id) ? "sampling-waived-source-correction" : "accepted-by-user") &&
  card.review.independentFactReview === "pending-independent-review"), true);
assert.equal(content.cards.every((card) => card.content.length >= 35 && card.content.length <= 180), true);
assert.equal(content.cards.every((card) => !/^(?:\d+[.、]|[（(][一二三四五六七八九十]+[）)])/.test(card.title)), true);
assert.equal(content.cards.every((card) => !/(?:先记|抓住|挂回|配对|按.+记忆|收束)/u.test(`${card.title}${card.content}`)), true);
assert.equal(content.cards.every((card) => !sample.holds.some((hold) => card.id.endsWith(`::${hold.id}`))), true);
assert.equal(content.cards.filter((card) => card.pointId === "physics" &&
  card.sourceUnitIds.includes("cs-16-22-p8-newton-laws-list")).length, 3,
"同一正文来源必须允许按明确学习目标拆成多张稳定卡");
assert.equal(explicitCardIdFor("physics", "newton-second-law"), "physics::newton-second-law");
assert.throws(() => explicitCardIdFor("physics", "第二定律"), /稳定的小写英文短横线标识/);

const storage = createStorage();
const urls = [];
const wx = {
  ...storage,
  getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }),
  setNavigationBarTitle() {},
  navigateTo({ url }) { urls.push(url); },
};
const page = loadPage("subpackages/common-sense/learning/index.js", wx);
page.onLoad({ mode: "guide", sample: "golden-v1", groupId: "physics", count: "5" });
assert.equal(page.data.goldenSample, true);
assert.equal(page.data.title, "知识导读样例");
assert.equal(page.data.guideGroup.id, "physics");
assert.equal(page.data.guideCard.id, "physics::force-three-elements");
assert.equal(page.data.guideCard.productionLabel, "直接复用");
assert.equal(page.data.total, 5);
assert.ok(storage.data["common-sense-guide-v1:golden-v1"], "黄金样例必须使用独立进度空间");
assert.equal(storage.data["common-sense-guide-v1"], undefined, "黄金样例不得污染正式知识导读进度");
page.handleSource({ currentTarget: { dataset: { point: page.data.guideCard.pointId, tab: page.data.guideCard.tabId } } });
assert.match(urls.pop(), /pointId=physics&tabId=newton-laws/u);

const releaseStorage = createStorage();
const releasePage = loadPage("subpackages/common-sense/learning/index.js", {
  ...releaseStorage,
  getAccountInfoSync: () => ({ miniProgram: { envVersion: "release" } }),
  setNavigationBarTitle() {},
  navigateTo() {},
});
releasePage.onLoad({ mode: "guide", sample: "golden-v1", groupId: "physics", count: "5" });
assert.equal(releasePage.data.goldenSample, false, "黄金样例不得在正式环境通过 query 开启");
assert.equal(releasePage.guideContent.profile, undefined);

console.log(JSON.stringify({
  ok: true,
  sampleId: content.sampleId,
  groups: content.stats.groups,
  cards: content.stats.cards,
  holds: content.stats.holds,
  scopes: content.stats.scopes,
  productionModes: content.stats.productionModes,
  previewPath: "/subpackages/common-sense/learning/index?mode=guide&sample=golden-v1&groupId=physics&count=5",
}, null, 2));
