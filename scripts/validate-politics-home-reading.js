const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");

const root = path.resolve(__dirname, "..");
const platform = require(path.join(root, "miniprogram/services/knowledge-platform"));
const { knowledgePackage } = require(path.join(root, "miniprogram/services/knowledge-platform/politics-runtime"));
const { routeProgressKey } = require(path.join(root, "miniprogram/services/knowledge-platform/route-progress"));
const file = path.join(root, "miniprogram/pages/politics/index.js");

function load(storage = {}, fails = false) {
  let page;
  const visits = [];
  vm.runInNewContext(fs.readFileSync(file, "utf8"), {
    require: createRequire(file),
    wx: {
      getStorageSync(key) { if (fails) throw new Error("storage unavailable"); return storage[key]; },
      navigateTo({ url }) { visits.push(url); },
    },
    Page(value) { page = value; },
  });
  page.setData = (value) => Object.assign(page.data, value);
  page.onShow();
  return { page, visits };
}

const first = load();
assert.equal(first.page.data.decision.stateId, "first-use");
assert.equal(first.page.data.dailyCard.state, "ready");
assert.deepEqual(Array.from(first.page.data.routeCards, (item) => item.id), ["quick", "systematic", "qa", "confusion", "exam"]);
assert.equal(first.page.data.routeCards.find((item) => item.id === "qa").label, "理论速记");
first.page.handleDailyTap();
assert.equal(first.visits[0], "/subpackages/politics/practice/index?mode=daily");
const qa = load();
qa.page.handleGoalTap({ currentTarget: { dataset: { type: "qa" } } });
assert.equal(qa.visits[0], "/subpackages/politics/practice/index?mode=qa");

for (const type of ["quick", "systematic", "confusion", "exam"]) {
  const plan = platform.planRecommendedRoute(knowledgePackage, type);
  const session = platform.createRouteSession(plan, 10);
  const { page, visits } = load({ [routeProgressKey(type)]: { planOptions: plan.options, session } });
  assert.equal(page.data.decision.stateId, "active-route");
  assert.equal(page.data.routeCards.length, 5, "all five learning entries must remain visible");
  assert.notEqual(page.data.routeCards.find((item) => item.id === type).progressText, "尚未开始");
  page.handleGoalTap({ currentTarget: { dataset: { type } } });
  assert.equal(visits[0], `/subpackages/politics/route/index?type=${type}&resume=1`);
}

const failed = load({}, true);
assert.equal(failed.page.data.decision.storageStatus.ok, false);
assert.equal(failed.page.data.dailyCard.state, "storage-error");
const template = fs.readFileSync(path.join(root, "miniprogram/pages/politics/index.wxml"), "utf8");
assert.equal((template.match(/bindtap="handleDailyTap"/g) || []).length, 1);
assert.ok(template.includes("dailyCard") && template.includes("每日理论") && template.includes("dailyCard.description"));
assert.ok(template.includes("decision.storageStatus.ok === false"), "route storage failure is hidden");
assert.ok(!template.includes("politics-progress"), "home must not show a route progress bar");
assert.ok(!template.includes('data-feature="daily"'), "daily practice must not remain in coming-soon");
assert.ok(template.indexOf("politics-resume") < template.indexOf("politics-route-list"));
assert.ok(!first.page.data.routeCards.some((item) => item.progressText.includes("%")), "route entries should use short text, not percentage progress");
assert.equal(first.page.data.dailyCard.meta, "最多 5 项");

console.log("Home reading validation passed: daily main card, theory quick entry, five learning entries, compact text progress, and storage recovery");
