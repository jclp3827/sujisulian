#!/usr/bin/env node
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const now = Date.parse('2026-11-02T08:00:00+08:00');
global.wx = { base64ToArrayBuffer(value) {
  const bytes = Buffer.from(value, 'base64');
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
} };
const platform = require(path.join(root, 'miniprogram/services/knowledge-platform/index'));
const { knowledgePackage: full } = require(path.join(root, 'miniprogram/services/knowledge-platform/politics-runtime'));
const bank = require(path.join(root, 'miniprogram/services/knowledge-platform/politics-practice-bank'));
const { knowledgePackage: home, practiceBank: homeBank } = require(path.join(root, 'miniprogram/models/politics-home-snapshot-poc'));
const { knowledgePackage: subpackageFull } = require(path.join(root, 'miniprogram/subpackages/politics/services/politics-runtime'));
const subpackageBank = require(path.join(root, 'miniprogram/subpackages/politics/services/politics-practice-bank'));
const practice = require(path.join(root, 'miniprogram/services/knowledge-platform/politics-practice'));
const same = (actual, expected, label) => assert.deepEqual(JSON.parse(JSON.stringify(actual)), JSON.parse(JSON.stringify(expected)), label);
const clone = value => JSON.parse(JSON.stringify(value));
const cases = [];
assert.equal(home.packageVersion, full.packageVersion);
assert.equal(homeBank.bankVersion, bank.bankVersion);
same(subpackageFull, full, 'direct subpackage knowledge package');
same(subpackageBank.items, bank.items, 'direct subpackage practice items');
same(subpackageBank.groups, bank.groups, 'direct subpackage practice groups');

function compareHome(name, options) {
  const oldValue = platform.projectHomeDecision(full, options);
  const newValue = platform.projectHomeDecision(home, options);
  same(newValue, oldValue, name);
  cases.push({ name, state: oldValue.stateId });
}
compareHome('new-user', {});
for (const type of ['quick', 'systematic', 'confusion', 'exam']) {
  const plan = platform.planRecommendedRoute(full, type);
  assert.ok(plan, type + ' recommended plan exists');
  const active = platform.createRouteSession(plan, now);
  compareHome(type + '-active', { routeRecords: [{ planOptions: plan.options, session: active, updatedAt: now }] });
  compareHome(type + '-completed', { routeRecords: [{ planOptions: plan.options, session: { ...active, status: 'completed', currentIndex: plan.steps.length - 1, completedStepIds: plan.steps.map(step => step.stepId) }, updatedAt: now }] });
  compareHome(type + '-old-version', { routeRecords: [{ planOptions: plan.options, session: { ...active, planId: 'old-plan', packageVersion: 'old-version' }, updatedAt: now }] });
  const old = plan.compatiblePreviousPlanIds?.[0];
  if (old) compareHome(type + '-compatible-previous', { routeRecords: [{ planOptions: plan.options, session: { ...active, planId: old.id, packageVersion: old.packageVersion }, updatedAt: now }] });
}
const unit = full.knowledgeUnits[0];
const recent = { moduleId: 'politics', pointId: unit.id, contentVersion: unit.contentVersion, blockId: unit.blocks[0].id, lastActivity: 'reading', updatedAt: now };
compareHome('recent-valid', { recent });
compareHome('recent-version-mismatch', { recent: { ...recent, contentVersion: 'old-version' } });
compareHome('storage-failure', { storageStatus: { ok: false } });
const plan = platform.planRecommendedRoute(full, 'exam');
compareHome('repeat-entry-first', { routeRecords: [{ planOptions: plan.options, session: platform.createRouteSession(plan, now), updatedAt: now }], recent });
compareHome('repeat-entry-second', { routeRecords: [{ planOptions: plan.options, session: platform.createRouteSession(plan, now), updatedAt: now }], recent });
const curriculum = require(path.join(root, 'miniprogram/models/politics-systematic-units-compact'));
const unitOptions = { type: 'systematic', experienceKind: 'systematic-units-v2', groupId: curriculum.groups[0].id, curriculumVersion: curriculum.curriculumVersion };
const unitPlan = platform.planLearningRoute(full, unitOptions);
if (unitPlan) {
  const session = platform.createRouteSession(unitPlan, now);
  compareHome('systematic-unit-active', { routeRecords: [{ planOptions: unitOptions, session, updatedAt: now }] });
  compareHome('systematic-unit-old', { routeRecords: [{ planOptions: unitOptions, session: { ...session, packageVersion: 'old-version' }, updatedAt: now }] });
}
function storage(value, error = false) { return { data: value, writes: 0, getStorageSync() { if (error) throw new Error('offline-storage-fail'); return this.data === undefined ? undefined : clone(this.data); }, setStorageSync(key, value) { this.writes++; this.data = clone(value); } }; }
function compareDaily(name, value, error = false) {
  const oldStore = storage(value, error), newStore = storage(value, error);
  const oldValue = practice.readPoliticsPracticeHome(bank, oldStore, () => now);
  const newValue = practice.readPoliticsPracticeHome(homeBank, newStore, () => now);
  same(newValue, oldValue, name);
  assert.equal(newStore.writes, oldStore.writes, name + ' writes');
  cases.push({ name, state: oldValue.state });
}
compareDaily('daily-new', undefined);
const saved = storage();
practice.createPoliticsPracticeEngine(bank, saved, () => now, () => 0).start('daily');
assert.ok(saved.data?.sessions?.['daily:all'], 'daily session persisted');
compareDaily('daily-active', saved.data);
const completed = clone(saved.data);completed.sessions['daily:all'].index = completed.sessions['daily:all'].ids.length;
compareDaily('daily-completed', completed);
const invalid = clone(saved.data);const daily = invalid.sessions['daily:all'];daily.questionVersions[daily.ids[0]] = 'old-version';
compareDaily('daily-old-version', invalid);
const due = clone(saved.data);const item = bank.items[0];due.records[item.id] = { at: now - 86400000, due: now - 1, contentVersion: item.contentVersion, kind: item.kind, outcome: item.kind === 'recall' ? 'remembered' : 'correct' };
compareDaily('daily-due', due);
compareDaily('daily-storage-error', saved.data, true);
compareDaily('daily-return', saved.data);

// The main Tab can be constructed while the politics subpackage is unavailable.
const loaded=[];const originalLoad=Module._load;Module._load=function(request,parent,isMain){const resolved=Module._resolveFilename(request,parent,isMain);if(resolved.includes('/subpackages/politics/'))throw new Error('main Tab depended on politics subpackage: '+resolved);loaded.push(resolved);return originalLoad.apply(this,arguments)};
let page;const previousPage=global.Page;const previousWx=global.wx;
try {
  global.Page=definition=>{page=definition};
  global.wx={...previousWx,getStorageSync(){return undefined},setStorageSync(){throw new Error('unexpected write')},navigateTo(){},showToast(){},cloud:{callFunction(){throw new Error('unexpected cloud call')}}};
  require(path.join(root,'miniprogram/pages/politics/index.js'));
  assert.ok(page?.onShow,'main Tab registered');
  const instance={...page,data:clone(page.data),setData(values){Object.assign(this.data,values)},getTabBar(){return null}};
  page.onShow.call(instance);
  assert.ok(instance.data.decision && instance.data.dailyCard && instance.data.routeCards?.length,'main Tab projected offline');
  cases.push({name:'main-tab-without-politics-subpackage',state:instance.data.decision.stateId});
} finally {Module._load=originalLoad;global.Page=previousPage;global.wx=previousWx}
console.log(JSON.stringify({passed:true,cases,unitPlanAvailable:Boolean(unitPlan),knowledgeVersion:full.packageVersion,practiceVersion:bank.bankVersion,subpackageExact:true,mainTabSubpackageImports:loaded.filter(file=>file.includes('/subpackages/politics/')).length}));
