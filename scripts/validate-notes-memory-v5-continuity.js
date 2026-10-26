const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createRequire } = require('module');
const root = path.resolve(__dirname, '..');
const { KEY } = require('../miniprogram/subpackages/note/services/memory-session');
const livePack = require('../miniprogram/subpackages/note/models/memory-pack');
const samplePack = { ...livePack, enrollment: { ...livePack.enrollment, cards: [], registrations: [], reviews: [], enablements: [] } };
const clone = value => JSON.parse(JSON.stringify(value));
const event = dataset => ({ currentTarget: { dataset } });
const settle = () => new Promise(resolve => setImmediate(resolve));
function storage() {
  const data = { 'notesPractice:v1:state': { keep: 'application-history' } };
  return { data, getStorageSync(key) { if (this.failRead) throw Error('read'); return clone(data[key] || null); },
    setStorageSync(key, value) { if (this.failWrite) throw Error('quota'); data[key] = clone(value); } };
}
function page(options = {}, store = storage(), extra = {}) {
  const filename = path.join(root, 'miniprogram/subpackages/note/memory/index.js');
  let config; const calls = []; let imageCalls = 0;
  const wx = { getAccountInfoSync: () => ({ miniProgram: { envVersion: 'develop' } }),
    getStorageSync: store.getStorageSync.bind(store), setStorageSync: store.setStorageSync.bind(store),
    setNavigationBarTitle() {}, navigateTo: value => calls.push(value), switchTab: value => calls.push(value),
    previewImage: value => calls.push(value), cloud: { callFunction() { imageCalls++; return Promise.resolve({ result: { code: 0, url: 'https://test.invalid/image-' + imageCalls } }); } } };
  const nativeRequire=createRequire(filename),required=id=>id==='../models/memory-pack'?samplePack:nativeRequire(id);
  vm.compileFunction(fs.readFileSync(filename, 'utf8'), ['require', 'Page', 'wx'], { filename })(required, value => config = value, wx);
  const p = { ...config, data: clone(config.data), calls, setData(value) { Object.assign(this.data, value); }, imageCalls: () => imageCalls };
  if (!extra.images) p.resolveImages = () => {};
  p.onLoad(options); return p;
}
const tests = [], reports = []; const test = (name, fn) => tests.push({ name, fn });
test('filtered round resumes scope, reveal and reading position without a new scroll event', () => {
  const s = storage(), p = page({ kind: 'basic', subjectId: 'quantity' }, s);
  p.handleReveal(); p.handleScroll({ detail: { scrollTop: 420 } }); p.onHide();
  const next = page({ kind: 'basic' }, s);
  assert.equal(next.scope.subjectId, 'quantity'); assert.equal(next.data.sessionId, p.data.sessionId);
  assert.equal(next.data.answerVisible, true); assert.equal(next.data.scrollTop, 420);
  next.onHide(); assert.equal(next.engine.get(next.data.sessionId).positions[next.data.card.id], 420);
});
test('previous/skip buttons save each card position and never copies the previous card scroll', () => {
  const p = page({ kind: 'basic' }), first = p.data.card.id;
  p.handleReveal(); p.handleScroll({ detail: { scrollTop: 360 } }); p.handleNext();
  const second = p.data.card.id; p.onHide();
  const state = p.engine.get(p.data.sessionId);
  assert.equal(state.positions[first], 360); assert.equal(state.positions[second], 0);
  p.handlePrev(); assert.equal(p.data.card.id, first); assert.equal(p.data.scrollTop, 360);
  assert.deepEqual(p.engine.ratings(), {});
});
test('catalog scrolling cannot overwrite the knowledge card reading position', () => {
  const p = page({ kind: 'basic' }); p.handleReveal(); p.handleScroll({ detail: { scrollTop: 280 } });
  p.handleList(); assert.equal(p.data.scrollTop, 0); p.handleScroll({ detail: { scrollTop: 900 } });
  p.handleList(); assert.equal(p.data.scrollTop, 280); p.onHide();
  assert.equal(p.engine.get(p.data.sessionId).positions[p.data.card.id], 280);
});
test('empty weak scope persists independently and explicit deep links override restored scope', () => {
  const s = storage(), p = page({ kind: 'exam', subjectId: 'graphic' }, s);
  assert.equal(p.data.state, 'empty'); const next = page({ kind: 'exam' }, s);
  assert.equal(next.scope.subjectId, 'graphic'); assert.equal(next.data.total, 0); assert.equal(next.data.progress, 0);
  const basic = page({ kind: 'basic', subjectId: 'quantity' }, s);
  const explicit = page({ kind: 'basic', subjectId: 'data-analysis' }, s);
  assert.equal(explicit.scope.subjectId, 'data-analysis'); assert.notEqual(explicit.data.sessionId, basic.data.sessionId);
  assert.equal(page({ kind: 'exam' }, s).scope.subjectId, 'graphic');
});
test('failed scope save keeps the visible round and can be retried without deleting storage', () => {
  const s = storage(), p = page({ kind: 'basic' }, s), id = p.data.sessionId, before = clone(s.data);
  const index = p.data.subjects.findIndex(subject => subject.id === 'quantity'); s.failWrite = true;
  p.handleSubject({ detail: { value: index } });
  assert.equal(p.data.sessionId, id); assert.equal(p.scope.subjectId, 'all'); assert.deepEqual(s.data, before);
  assert(p.data.notice.includes('未保存')); s.failWrite = false;
  p.handleSubject({ detail: { value: index } }); assert.equal(p.scope.subjectId, 'quantity');
});
test('method and exam settings apply only on save, refresh cards and retain prior records', () => {
  const s = storage(), method = page({ kind: 'method' }, s), oldId = method.data.sessionId;
  method.handleSettings(); const subjectIndex = method.data.subjects.findIndex(subject => subject.id === 'logic');
  method.handleDraftSubject({ detail: { value: subjectIndex } });
  assert.equal(method.data.sessionId, oldId); assert.equal(method.scope.subjectId, 'all');
  method.handleCloseSettings(); assert.equal(method.data.sessionId, oldId);
  method.handleSettings(); method.handleDraftSubject(event({ index: subjectIndex }));
  method.handleDraftTopic(event({ index: 1 })); assert.equal(method.data.draftTopicIndex, 1);
  method.handleDraftTopic(event({ index: 0 }));
  method.handleSaveSettings(); assert.equal(method.data.settingsOpen, false);
  assert.equal(method.scope.subjectId, 'logic'); assert.notEqual(method.data.sessionId, oldId);
  assert.equal(method.data.index, 1); assert(method.data.notice.includes('刷新'));
  assert(method.engine.get(oldId)); assert.deepEqual(s.data['notesPractice:v1:state'], { keep: 'application-history' });
  const exam = page({ kind: 'exam' }, s); exam.handleSettings();
  exam.handleDraftSubject({ detail: { value: subjectIndex } }); exam.handleSaveSettings();
  assert.equal(exam.scope.subjectId, 'logic'); assert.equal(exam.data.state, 'empty');
  assert.equal(page({ kind: 'method' }, s).scope.subjectId, 'logic');
});
test('failed method setting keeps the old round and draft open for retry', () => {
  const s = storage(), p = page({ kind: 'method' }, s), id = p.data.sessionId, before = clone(s.data);
  p.handleSettings(); const subjectIndex = p.data.subjects.findIndex(subject => subject.id === 'logic');
  p.handleDraftSubject({ detail: { value: subjectIndex } }); s.failWrite = true; p.handleSaveSettings();
  assert.equal(p.data.settingsOpen, true); assert.equal(p.data.sessionId, id); assert.equal(p.scope.subjectId, 'all');
  assert.deepEqual(s.data, before); s.failWrite = false; p.handleSaveSettings();
  assert.equal(p.data.settingsOpen, false); assert.equal(p.scope.subjectId, 'logic');
});
test('original-text round trip preserves current card, reveal and scroll', () => {
  const s = storage(), p = page({ kind: 'method', subjectId: 'logic' }, s);
  p.handleReveal(); p.handleScroll({ detail: { scrollTop: 510 } }); p.handleSource(event({ index: 0 })); p.onHide();
  const url = p.calls.at(-1).url, params = Object.fromEntries(new URLSearchParams(url.split('?')[1]));
  assert.equal(params.pointId, p.data.card.pointId); assert.equal(params.tabId, 'knowledge');
  assert(!params.memoryKind && !params.memoryReturn);
  p.onShow(); assert.equal(p.data.scrollTop, 510);
  const back = page({ kind: p.kind }, s);
  assert.equal(back.data.card.id, p.data.card.id); assert.equal(back.data.answerVisible, true); assert.equal(back.data.scrollTop, 510);
  back.onHide(); assert.equal(back.engine.get(back.data.sessionId).positions[back.data.card.id], 510);
});
test('image failure persists on return; retry refreshes its URL and ignores stale or failed-generation loads', async () => {
  const p = page({ kind: 'method', subjectId: 'graphic' }, storage(), { images: true }); await settle();
  p.handleReveal(); const old = p.data.imageGeneration, url = p.requiredImages[0];
  p.onMindMapImageError(event({ imageToken: old, blockIndex: 0, nodeIndex: 0 })); p.onShow();
  assert(p.data.notice.includes('配图')); p.handleKnowledgeImageLoad(event({ imageToken: old, src: url }));
  assert.equal(p.data.imagesReady, false); p.handleImageRetry(); await settle(); assert.equal(p.imageCalls(), 2);
  p.handleKnowledgeImageLoad(event({ imageToken: old, src: url })); assert.equal(p.data.imagesReady, false);
  p.handleKnowledgeImageLoad(event({ imageToken: p.data.imageGeneration, src: p.requiredImages[0] }));
  assert.equal(p.data.imagesReady, true); assert.equal(p.data.notice, '');
});
test('every listed sample opens by its own ID and reaches its exact original knowledge tab', () => {
  const seen = new Set();
  for (const kind of ['basic', 'method']) {
    const p = page({ kind }); p.handleList(); assert.equal(p.data.listing.length, 4);
    for (const card of p.data.listing) {
      p.handlePick(event({ id: card.id })); const options = Object.fromEntries(new URLSearchParams(p.calls.at(-1).url.split('?')[1]));
      const direct = page(options); assert.equal(direct.data.card.id, card.id); seen.add(card.id);
      direct.handleSource(event({ index: 0 })); const source = Object.fromEntries(new URLSearchParams(direct.calls.at(-1).url.split('?')[1]));
      assert.equal(source.moduleId, card.refs[0].subjectId); assert.equal(source.pointId, card.refs[0].pointId);
      assert.equal(source.tabId, card.refs[0].tabId); assert.deepEqual(direct.engine.ratings(), {});
    }
  }
  assert.equal(seen.size, 8);
});
test('horizontal and vertical reading have no gesture navigation; buttons alone move or assess cards', () => {
  const p = page({ kind: 'basic' }), id = p.data.card.id;
  const template = fs.readFileSync(path.join(root, 'miniprogram/subpackages/note/memory/index.wxml'), 'utf8');
  assert(!/bind(?:touchstart|touchend|touchmove)|swiper/.test(template));
  assert.equal(p.handleTouchStart, undefined); assert.equal(p.handleTouchEnd, undefined);
  p.handleScroll({ detail: { scrollTop: 220 } }); assert.equal(p.data.card.id, id); assert.deepEqual(p.engine.ratings(), {});
  p.handleSkip(); assert.notEqual(p.data.card.id, id); p.handlePrev(); assert.equal(p.data.card.id, id);
  assert(template.includes('bindtap="handlePrev"')); assert.equal(p.engine.get(p.data.sessionId).positions[id], 220);
});
test('read failure has a retry that recovers without clearing application or memory records', () => {
  const s = storage(); s.failRead = true; const p = page({ kind: 'basic' }, s);
  assert.equal(p.data.state, 'error'); assert(p.data.notice.includes('读取'));
  s.failRead = false; p.handleRetry(); assert.equal(p.data.state, 'card');
  assert.deepEqual(s.data['notesPractice:v1:state'], { keep: 'application-history' }); assert(s.data[KEY]);
});
(async () => {
  for (const { name, fn } of tests) { await fn(); reports.push(name); }
  console.log(JSON.stringify({ passed: true, checks: reports.length, scope: 'actual page and engine with isolated storage; no device/content approval', reports }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
