#!/usr/bin/env node
const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { createRequire } = require("module");
const { STORAGE_KEY } = require("../miniprogram/subpackages/common-sense/services/guide-session");

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

const event = (dataset) => ({ currentTarget: { dataset } });
const storage = createStorage();
const urls = [];
const wx = {
  ...storage,
  getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }),
  setNavigationBarTitle() {},
  navigateTo({ url }) { urls.push(url); },
};

const home = loadPage("pages/common-sense/index.js", wx);
assert.deepEqual(home.data.features.map((item) => item.id), ["qa", "guide", "confusion", "exam"]);
assert.ok(home.data.features.some((item) => item.id === "guide" && item.title === "知识导读"));
assert.equal(home.data.features.some((item) => item.id === "mnemonic" || /口诀/u.test(item.title)), false);
home.handleFeature(event({ mode: "guide" }));
assert.equal(urls.pop(), "/subpackages/common-sense/learning/index?mode=guide");

const guide = loadPage("subpackages/common-sense/learning/index.js", wx);
guide.onLoad({ mode: "guide", scope: "humanities-history", groupId: "ancient-prose", count: "5" });
assert.deepEqual({ mode: guide.data.mode, title: guide.data.title, guideMode: guide.data.guideMode }, {
  mode: "guide", title: "知识导读", guideMode: true,
});
assert.equal(guide.data.guideGroup.id, "ancient-prose");
assert.equal(guide.data.guideCard.title, "《山海经》");
assert.equal(guide.data.total, 5); assert.equal(guide.data.index, 1); assert.equal(guide.data.unit, "张");
assert.equal(guide.data.reading, false); assert.equal(guide.data.mnemonic, null); assert.equal(guide.data.card, null);
guide.handleSource(event({ point: guide.data.guideCard.pointId, tab: guide.data.guideCard.tabId }));
assert.match(urls.pop(), /pointId=ancient-prose&tabId=shanhaijing/u);

const firstId = guide.data.guideCard.id;
guide.handleGuideAssess(event({ result: "remembered" }));
assert.equal(guide.data.index, 2);
assert.equal(storage.data[STORAGE_KEY].records[firstId].status, "remembered");

const resumed = loadPage("subpackages/common-sense/learning/index.js", wx);
resumed.onLoad({ mode: "guide" });
assert.equal(resumed.guideSession.key, guide.guideSession.key);
assert.equal(resumed.guideSession.index, 1); assert.equal(resumed.data.guideMode, true);

const oldKey = resumed.guideSession.key;
resumed.handleMenu(); resumed.handleScope(event({ id: "law" })); resumed.handleCount(event({ count: 10 })); resumed.handleSaveSettings();
assert.equal(resumed.data.scope, "law"); assert.equal(resumed.data.count, 10); assert.equal(resumed.data.settingsOpen, false);
assert.equal(resumed.data.notice, "导读卡已按新设置刷新。");
assert.notEqual(resumed.guideSession.key, oldKey);
assert.ok(resumed.guideSession.ids.length > 0 && resumed.guideSession.ids.length <= 10);

const legacyStorage = createStorage();
const legacy = loadPage("subpackages/common-sense/learning/index.js", {
  ...legacyStorage,
  getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }),
  setNavigationBarTitle() {},
});
legacy.onLoad({ mode: "mnemonic", scope: "economics", mnemonicId: "market-structure-four-types-memory" });
assert.equal(legacy.data.mode, "guide"); assert.equal(legacy.data.title, "知识导读");
assert.equal(legacy.data.guideMode, true); assert.equal(legacy.data.reading, false);
assert.equal(legacy.data.mnemonic, null); assert.equal(legacy.data.card, null); assert.ok(legacy.data.guideCard);

console.log(JSON.stringify({
  passed: true,
  publicFeatures: home.data.features.map((item) => item.id),
  firstGroup: guide.data.guideGroup.id,
  firstCard: firstId,
  settings: { scope: resumed.data.scope, count: resumed.data.count },
  legacyRoute: legacy.data.mode,
}, null, 2));
