const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
function load(relative, storage) {
  const file = path.join(root, relative);
  let instance;
  global.wx = storage;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { require: createRequire(file), wx: storage, Page(value) { instance = value; }, Component(value) { instance = value; } });
  instance.setData = value => Object.assign(instance.data, value);
  return instance;
}
const recent = require('../miniprogram/utils/recent-records');
let writes = 0;
const values = { xingce_recent_records: [{ id: 'valid', createdAt: Date.now(), sectionId: 'calculation', questionCount: 3 }] };
const storage = { getStorageSync: key => values[key] || '', setStorageSync() { writes += 1; throw new Error('disk full'); } };
global.wx = storage;
assert.equal(recent.getRecentRecords().length, 1);
assert.equal(writes, 0, 'Reading history wrote to storage');
assert.throws(() => recent.addRecentRecord({ type: 'test' }), /disk full/, 'A failed write appeared successful');
for (const [name, getStorageSync] of [
  ['read failure', () => { throw new Error('storage unavailable'); }],
  ['old malformed records', () => ({ legacy: true })],
]) {
  const page = load('miniprogram/pages/home/index.js', { getStorageSync });
  assert.doesNotThrow(() => page.onShow(), name);
  assert.equal(page.data.recentRecordsAvailable, false);
  assert.equal(page.data.wrongBookCountText, '—');
  assert.ok(page.data.sections.length && page.data.storageNotice);
  global.wx = storage;
  page.refreshSections();
  assert.equal(page.data.recentRecordsAvailable, true, 'Retry did not recover');
  assert.equal(page.data.storageNotice, '');
}
const page = load('miniprogram/pages/home/index.js', storage);
page.onShow();
assert.equal(page.data.recentRecordsAvailable, true);
assert.equal(page.data.storageNotice, '');
const app = JSON.parse(fs.readFileSync(path.join(root, 'miniprogram/app.json')));
const visits = [];
let failure;
const tab = load('miniprogram/custom-tab-bar/index.js', { switchTab(options) { visits.push(options.url); failure = options; }, showToast() {} });
tab.methods.switchTab.call(tab, { currentTarget: { dataset: { path: '/pages/photo/index' } } });
assert.equal(visits.length, 0);
tab.methods.switchTab.call(tab, { currentTarget: { dataset: { path: '/pages/home/index' } } });
assert.equal(visits.length, 1);
failure.fail(); failure.complete();
assert.equal(tab.data.selected, 0, 'Failed navigation changed selection');
assert.equal(tab.switching, false);
assert.deepEqual(Array.from(tab.data.list, item => item.pagePath.slice(1)), app.tabBar.list.map(item => item.pagePath));
assert.equal(app.tabBar.list.length, 4);
assert.ok(!JSON.stringify(app).includes('photo'));
const template = fs.readFileSync(path.join(root, 'miniprogram/custom-tab-bar/index.wxml'), 'utf8');
assert.ok(template.includes('aria-selected') && template.includes('hover-class'));
assert.ok(!template.includes('politics-theme'));
for (const page of ['map', 'search', 'detail', 'route', 'coming-soon']) {
  const config = JSON.parse(fs.readFileSync(path.join(root, `miniprogram/subpackages/politics/${page}/index.json`)));
  assert.equal(config.navigationBarBackgroundColor, '#fffaf7');
  assert.equal(config.navigationBarTextStyle, 'black');
}
const summary = require('../miniprogram/models/common-sense-summary');
assert.equal(summary.totalPointCount, 170);
assert.equal(summary.parts.find(part => part.id === 'law').pointCount, 56);
const aliases = require('../miniprogram/subpackages/note/models/search-aliases');
const catalog = require('../miniprogram/subpackages/note/models/note-catalog');
let searches = 0;
for (const [moduleId, entries] of Object.entries(aliases)) {
  const model = catalog.getNoteContent(moduleId);
  for (const [id, words] of Object.entries(entries)) {
    const point = model.points.find(item => item.id === id);
    assert.ok(point, 'Alias refers to missing knowledge');
    for (const keyword of [point.title, ...words]) {
      const result = catalog.searchNotePoints({ moduleId, keyword }).find(item => item.id === id);
      assert.ok(result, `${moduleId}/${id}: ${keyword}`);
      if (words.includes(keyword)) assert.ok(result.matchText && result.preview.includes(keyword), 'Alias match has no explanation');
      searches += 1;
    }
  }
}
assert.deepEqual(catalog.searchNotePoints({ moduleId: 'quantity', keyword: '不存在的测试词xyz' }), []);
for (const [moduleId, id, keyword] of [
  ['quantity', 'competition-problem', '循环赛'],
  ['quantity', 'adjacent-bundle', '捆绑法'],
  ['quantity', 'non-adjacent-insertion', '插空法'],
  ['quantity', 'repeated-arrangement', '可重复排列'],
  ['quantity', 'number-formulas', '等差数列'],
  ['quantity', 'sequence-feature', '分数数列'],
  ['logic', 'general-attribution-and-root-cause', '根本原因'],
  ['logic', 'quick-quantifier-syllogism', '量词换位'],
]) assert.ok(catalog.searchNotePoints({ moduleId, keyword }).some(item => item.id === id), 'An existing query regressed');
console.log(JSON.stringify({ status: 'passed', tabs: 4, summaryPoints: 170, protectedHistoryReads: true, aliasAndTitleSearches: searches }));
