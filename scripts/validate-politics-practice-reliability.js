#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const bank = require(path.join(root, 'miniprogram/models/politics-applied-questions-runtime'));
const { STORAGE_KEY, createPoliticsPracticeEngine: create, readPoliticsPracticeHome } = require(path.join(root, 'miniprogram/services/knowledge-platform/politics-practice'));
const copy = value => JSON.parse(JSON.stringify(value));
const now = Date.parse('2026-10-22T09:00:00+08:00');
function memory(initial = {}) {
  const data = copy(initial), failure = { read: false, write: false };
  return { data, failure, writes: [],
    getStorageSync(key) { if (failure.read) throw Error('read failed'); return data[key] === undefined ? null : copy(data[key]); },
    setStorageSync(key, value) { if (failure.write) throw Error('write failed'); this.writes.push(key); data[key] = copy(value); },
  };
}
function engine(storage, time = now) { return create(bank, storage, () => time, () => 0); }
function answerAll(e, session) {
  while (session.index < session.ids.length) { e.answer(session, e.question(session.ids[session.index]).answerIndex); e.advance(session); }
}
function page(storage, navigation = []) {
  const file = path.join(root, 'miniprogram/subpackages/politics/practice/index.js'); let definition;
  const wx = { getStorageSync: key => storage.getStorageSync(key), setStorageSync: (key, value) => storage.setStorageSync(key, value),
    setNavigationBarTitle() {}, navigateTo: entry => navigation.push(entry.url) };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { require: createRequire(file), wx, Page: value => { definition = value; }, getCurrentPages: () => [1, 2], console });
  return { ...definition, data: copy(definition.data), setData(patch) { Object.assign(this.data, patch); } };
}
function validate() {
  const passed = [];
  function test(name, run) { run(); passed.push(name); }
  test('actual-page-return-preserves-QA-and-daily-order', () => {
    const s = memory(), nav = [], daily = page(s, nav); daily.onLoad({ mode: 'daily' }); daily.onShow();
    const order = copy(daily.session.optionOrders), ids = [...daily.session.ids]; daily.handleSettingsTap();
    assert.equal(nav[0], '/subpackages/politics/practice/index?mode=qa');
    const qa = page(s); qa.onLoad({ mode: 'qa' }); qa.onShow();
    const id = qa.data.current.id || qa.data.current.questionId;
    if (qa.data.current.kind === 'recall') {
      qa.handleReveal();
      qa.handleRecallResult({ detail: { result: 'remembered' } });
    } else qa.handleOptionTap({ currentTarget: { dataset: { index: qa.data.current.answerIndex } } });
    qa.handleNext();
    daily.onShow(); daily.handleSkip();
    assert.equal(s.data[STORAGE_KEY].sessions['qa:all:5'].index, 1); assert.ok(s.data[STORAGE_KEY].records[id]);
    assert.deepEqual([...daily.session.ids], ids); assert.deepEqual(copy(daily.session.optionOrders), order);
    assert.equal(s.data[STORAGE_KEY].sessions['daily:all'].index, 1);
  });
  test('revealed-recall-skip-advances-without-mastery-record', () => {
    const s = memory(), qa = page(s);
    qa.onLoad({ mode: 'qa' });
    qa.handleTypeTap({ currentTarget: { dataset: { value: 'recall' } } });
    qa.handleApplySettings();
    assert.equal(qa.data.current.kind, 'recall');
    const id = qa.session.ids[0];
    qa.handleReveal();
    assert.equal(qa.data.interactionState, 'revealed');
    qa.handleRecallResult({ detail: { result: 'skipped' } });
    assert.equal(qa.session.index, 1);
    assert.equal(qa.session.answers[id].type, 'skip');
    assert.equal(s.data[STORAGE_KEY].records[id], undefined);
    assert.equal(qa.engine.result(qa.session).recall.skipped, 1);
  });
  test('service-merge-preserves-other-page-without-onShow', () => {
    const s = memory(), a = engine(s), daily = a.start('daily').session;
    const b = engine(s), qa = b.start('qa').session; answerAll(b, qa);
    const qaRecord = copy(s.data[STORAGE_KEY].sessions['qa:all:5']); a.advance(daily);
    assert.deepEqual(s.data[STORAGE_KEY].sessions['qa:all:5'], qaRecord);
    assert.equal(Object.keys(s.data[STORAGE_KEY].records).length, 5);
  });
  test('same-session-conflict-never-overwrites-live-progress', () => {
    const s = memory(), a = engine(s), stale = a.start('qa').session;
    const b = engine(s), current = b.start('qa').session; b.answer(current, b.question(current.ids[0]).answerIndex); b.advance(current);
    const live = copy(s.data[STORAGE_KEY]); a.answer(stale, (a.question(stale.ids[0]).answerIndex + 1) % 3);
    assert.deepEqual(s.data[STORAGE_KEY], live); assert.match(a.persistenceError(), /其他页面更新/);
    assert.equal(a.retrySave(), false); assert.deepEqual(s.data[STORAGE_KEY], live);
    assert.equal(engine(s).start('qa').session.index, 1);
  });
  test('failed-write-retry-merges-new-records-and-keeps-order', () => {
    const s = memory(), a = engine(s), daily = a.start('daily').session, order = copy(daily.optionOrders);
    s.failure.write = true; a.answer(daily, 0); assert.ok(a.persistenceError());
    s.failure.write = false; const b = engine(s), qa = b.start('qa').session; answerAll(b, qa);
    assert.equal(a.retrySave(), true); assert.equal(Object.keys(s.data[STORAGE_KEY].records).length, 5);
    assert.deepEqual(daily.optionOrders, order); assert.equal(s.data[STORAGE_KEY].sessions['daily:all'].answers[daily.ids[0]].choice, 0);
    a.advance(daily); assert.equal(s.data[STORAGE_KEY].sessions['daily:all'].index, 1);
  });
  test('failed-read-cannot-clear-saved-records-and-can-recover', () => {
    const s = memory(), first = engine(s), qa = first.start('qa').session; answerAll(first, qa);
    const preserved = copy(s.data), writes = s.writes.length; s.failure.read = true;
    const e = engine(s); e.start('daily'); assert.ok(e.persistenceError());
    assert.equal(s.writes.length, writes); assert.deepEqual(s.data, preserved);
    s.failure.read = false; assert.equal(e.retrySave(), true); assert.equal(Object.keys(e.state.records).length, 5);
    assert.deepEqual(s.data, preserved);
  });
  test('fresh-daily-excludes-QA-correct-not-due-items', () => {
    const s = memory(), e = engine(s), qa = e.start('qa', { count: 15 }).session; answerAll(e, qa);
    const daily = e.start('daily').session; assert.ok(daily.ids.length >= 2);
    assert.ok(daily.ids.every(id => !s.data[STORAGE_KEY].records[id]));
  });
  test('new-engine-selection-sees-other-page-answers', () => {
    const s = memory(), dormant = engine(s), qaEngine = engine(s), qa = qaEngine.start('qa', { count: 15 }).session;
    answerAll(qaEngine, qa); const daily = dormant.start('daily').session;
    assert.ok(daily.ids.every(id => !s.data[STORAGE_KEY].records[id]));
  });
  test('revealed-current-question-is-not-new-before-Next', () => {
    const s = memory(), e = engine(s), qa = e.start('qa').session, id = qa.ids[0]; e.answer(qa, null);
    assert.equal(e.state.records[id], undefined);
    const daily = e.start('daily').session; assert.equal(daily.ids.length, 2); assert.ok(!daily.ids.includes(id));
  });
  test('all-answered-not-due-means-real-empty-state', () => {
    const s = memory(), e = engine(s); answerAll(e, e.start('qa', { count: 15 }).session); answerAll(e, e.start('qa', { count: 15 }).session);
    assert.equal(Object.keys(e.state.records).length, bank.questions.length);
    assert.equal(readPoliticsPracticeHome(bank, s, () => now).state, 'empty'); assert.equal(e.start('daily').session.ids.length, 0);
    const later = engine(s, now + 3 * 86400000), daily = later.start('daily').session;
    assert.equal(daily.ids.length, 2); assert.ok(daily.ids.every(id => daily.reasons[id] === '到期回顾'));
  });
  test('frozen-daily-does-not-reselect-after-QA-answer', () => {
    const s = memory(), e = engine(s), daily = e.start('daily').session, frozen = copy(daily);
    const other = engine(s), qa = other.start('qa').session; other.answer(qa, other.question(qa.ids[0]).answerIndex); other.advance(qa);
    const resumed = engine(s).start('daily').session;
    assert.deepEqual(resumed.ids, frozen.ids); assert.deepEqual(resumed.optionOrders, frozen.optionOrders);
  });
  test('bad-history-entries-preserve-valid-records-and-sessions', () => {
    const s = memory(), e = engine(s), qa = e.start('qa').session; e.answer(qa, 0); e.advance(qa);
    const valid = copy(s.data[STORAGE_KEY]), good = bank.groups[0], bad = bank.groups[1];
    s.data[STORAGE_KEY].groupHistory = { [good.groupId]: { at: now, contentVersion: good.contentVersion }, [bad.groupId]: null, unknown: 1 };
    s.data[STORAGE_KEY].records[bank.questions[5].questionId] = null;
    const recovered = engine(s); assert.deepEqual(recovered.state.records, valid.records);
    assert.deepEqual(recovered.state.sessions, valid.sessions); assert.deepEqual(Object.keys(recovered.state.groupHistory), [good.groupId]);
    assert.doesNotThrow(() => readPoliticsPracticeHome(bank, s, () => now));
    recovered.savePreferences('qa', { scope: 'thought', count: 10 }); assert.deepEqual(s.data[STORAGE_KEY].records, valid.records);
    assert.equal(s.data[STORAGE_KEY].groupHistory[bad.groupId], undefined);
  });
  test('settings-and-unrelated-storage-survive-cross-page-save', () => {
    const s = memory({ unrelated: { value: 1 } }), a = engine(s), daily = a.start('daily').session;
    const b = engine(s); b.savePreferences('qa', { scope: 'principles', count: 10 }); a.advance(daily);
    assert.deepEqual(s.data[STORAGE_KEY].preferences.qa, { scope: 'principles', count: 10 }); assert.deepEqual(s.data.unrelated, { value: 1 });
  });
  console.log(JSON.stringify({ status: 'passed', cases: passed.length, checks: passed, realUserRecordsUsed: false }));
  return passed;
}
if (require.main === module) validate();
module.exports = { validate };
