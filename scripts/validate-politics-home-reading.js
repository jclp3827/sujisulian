const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const platform = require(path.join(root, 'miniprogram/services/knowledge-platform'));
const { knowledgePackage } = require(path.join(root, 'miniprogram/services/knowledge-platform/politics-runtime'));
const { routeProgressKey } = require(path.join(root, 'miniprogram/services/knowledge-platform/route-progress'));
const file = path.join(root, 'miniprogram/pages/politics/index.js');
function load(storage = {}, fails = false) {
  let page;
  const visits = [];
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
    require: createRequire(file),
    wx: { getStorageSync(key) { if (fails) throw new Error('storage unavailable'); return storage[key]; }, navigateTo({ url }) { visits.push(url); } },
    Page(value) { page = value; },
  });
  page.setData = (value) => Object.assign(page.data, value);
  page.onShow();
  return { page, visits };
}
const first = load();
assert.equal(first.page.data.decision.stateId, 'first-use');
assert.ok(first.page.data.resumePrompt);
assert.deepEqual(Array.from(first.page.data.routeCards, (item) => item.id), ['systematic', 'confusion', 'exam']);
first.page.handlePrimaryTap();
assert.equal(first.visits[0], first.page.data.quickGoal.href);

for (const type of ['quick', 'systematic', 'confusion', 'exam']) {
  const plan = platform.planRecommendedRoute(knowledgePackage, type);
  const session = platform.createRouteSession(plan, 10);
  const { page, visits } = load({ [routeProgressKey(type)]: { planOptions: plan.options, session } });
  assert.equal(page.data.decision.stateId, 'active-route');
  assert.equal(page.data.activeGoal.id, type);
  assert.ok(!page.data.routeCards.some((item) => item.id === type), `${type} repeats the primary action`);
  assert.equal(new Set([page.data.activeGoal.id, ...page.data.routeCards.map((item) => item.id)]).size, 4);
  page.handlePrimaryTap();
  assert.equal(visits[0], `/subpackages/politics/route/index?type=${type}&resume=1`);
  page.data.routeCards.forEach((item) => page.handleGoalTap({ currentTarget: { dataset: { type: item.id } } }));
  assert.equal(visits.length, 4);
}

const unit = knowledgePackage.knowledgeUnits[1];
const recent = { moduleId: 'politics', pointId: unit.id, contentVersion: unit.contentVersion, lastActivity: 'reading', updatedAt: 10 };
const reading = load({ [platform.storageKey('politics')]: recent });
assert.equal(reading.page.data.decision.stateId, 'recent-focus');
assert.equal(reading.page.data.resumePrompt.title, unit.title);
assert.equal(reading.page.data.routeCards.length, 4);
reading.page.handlePrimaryTap();
assert.equal(reading.visits[0], '/subpackages/politics/map/index?origin=recent&restore=1');
const stale = load({ [platform.storageKey('politics')]: { ...recent, contentVersion: 'stale' } });
assert.equal(stale.page.data.decision.stateId, 'invalid-recovery');
assert.equal(stale.page.data.activeGoal, null);
stale.page.handlePrimaryTap();
assert.ok(stale.visits[0].includes('recommended=1'));
const failed = load({}, true);
assert.equal(failed.page.data.decision.storageStatus.ok, false);
assert.equal(failed.page.data.activeGoal, null);
const template = fs.readFileSync(path.join(root, 'miniprogram/pages/politics/index.wxml'), 'utf8');
assert.equal((template.match(/bindtap="handlePrimaryTap"/g) || []).length, 1);
assert.ok(template.includes('decision.storageStatus.ok === false'), 'Storage failure is hidden');
assert.ok(!template.includes('home-hero.jpg'), 'Decorative banner returned');
assert.ok(template.indexOf('politics-upcoming') > template.indexOf('politics-route-list'));
console.log('Home reading validation passed: first use, four active routes, recent reading, invalid history, storage failure; one primary and complete route reachability');
