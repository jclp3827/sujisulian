#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { main } = require('../cloudfunctions/learningBank');
const manifest = require('../cloudfunctions/learningBank/data/manifest.json');
const bootstrap = require('../cloudfunctions/learningBank/data/common-guide/bootstrap.json');
const { byteLength } = require('../miniprogram/services/knowledge-platform/card-batch-adapter');
const { createCardBuffer } = require('../miniprogram/services/knowledge-platform/card-buffer');
const { loadPublicGuide, createGuideCardAdapter } = require('../miniprogram/subpackages/common-sense/services/cloud-guide-content');

const clone = (value) => JSON.parse(JSON.stringify(value));
const tick = () => new Promise((resolve) => setImmediate(resolve));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
async function until(predicate) {
  for (let i = 0; i < 250; i += 1) { if (predicate()) return; await tick(); }
  throw new Error('Guide page did not reach expected state');
}
function page(storage, cloud) {
  const filename = path.resolve(__dirname, '../miniprogram/subpackages/common-sense/learning/index.js');
  let definition;
  const wx = { cloud: { callFunction: cloud }, getAccountInfoSync: () => ({ miniProgram: { envVersion: 'release' } }),
    getStorageSync: (key) => storage[key] && clone(storage[key]), setStorageSync: (key, value) => { storage[key] = clone(value); },
    setNavigationBarTitle() {}, navigateTo() {}, nextTick() {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), { require: createRequire(filename), Page: (value) => { definition = value; },
    wx, console, Buffer, setTimeout, clearTimeout }, { filename });
  return { ...definition, data: clone(definition.data), setData(values) { Object.assign(this.data, values); } };
}
function verifyBound(p) {
  const stats = p.guideBuffer.stats();
  assert(stats.cards <= 10 && stats.bytes <= 24 * 1024);
  const full = Object.values(p.guideContent.cardById).filter((card) => typeof card.content === 'string');
  assert(full.length <= stats.cards);
  assert(full.every((card) => p.guideBuffer && p.guideSession.ids.includes(card.id)));
  assert(p.guideContent.cards.every((card) => !card.content));
  return { cards: stats.cards, bytes: stats.bytes, fullReferences: full.length };
}
async function scopeData() {
  const ids = bootstrap.groups.flatMap((group) => group.cardIds);
  assert.equal(ids.length, 1681);
  assert.deepEqual(ids, manifest.banks['common-guide'].index.map((item) => item.id));
  assert.equal(bootstrap.cardSignatures.length, 1681);
  assert.equal(bootstrap.stats.holds, 1);
  assert(!ids.includes('sports::football-kickoff-choice'));
  const sizes = manifest.banks['common-guide'].index.map((item) => item.bytes).sort((a, b) => a - b);
  assert.equal(sizes.at(-1), 1868);
  assert(sizes.slice(-10).reduce((sum, size) => sum + size, 0) < 24 * 1024);
  return { cards: ids.length, groups: bootstrap.groups.length, holds: bootstrap.stats.holds,
    medianBytes: sizes[Math.floor(sizes.length / 2)], p99Bytes: sizes[Math.ceil(sizes.length * .99) - 1], maxBytes: sizes.at(-1) };
}
async function initialAndResume() {
  const storage = {}, calls = [];
  const cloud = async ({ data }) => { calls.push(data); return { result: clone(await main(data)) }; };
  let p = page(storage, cloud); p.onLoad({ mode: 'guide' });
  await until(() => p.data.loadState === 'ready' && p.data.guideCard);
  assert.equal(calls.filter((call) => call.action === 'hydrate').length, 0);
  assert.equal(p.data.guideCard.id, p.guideSession.ids[0]);
  verifyBound(p);
  const firstId = p.data.guideCard.id, roundKey = p.guideSession.key;
  p.handleGuideAssess({ currentTarget: { dataset: { result: 'fuzzy' } } });
  await until(() => p.data.loadState === 'ready' && p.guideSession.index === 1);
  assert.equal(storage['common-sense-guide-v1'].records[firstId].status, 'fuzzy');
  p.onUnload();
  calls.length = 0;
  p = page(storage, cloud); p.onLoad({ mode: 'guide' });
  await until(() => p.data.loadState === 'ready' && p.data.guideCard);
  assert.equal(p.guideSession.key, roundKey); assert.equal(p.guideSession.index, 1);
  assert.equal(calls.filter((call) => call.action === 'hydrate').length, 0);
  assert.equal(storage['common-sense-guide-v1'].records[firstId].status, 'fuzzy');
  verifyBound(p); p.onUnload();
  return { bootstrapHitWithoutHydrate: true, resumedIndex: 1, retainedAssessment: true };
}
async function longSequence() {
  const storage = {}, calls = [];
  const cloud = async ({ data }) => { calls.push(data); return { result: clone(await main(data)) }; };
  const group = bootstrap.groups.find((item) => item.cardIds.length >= 15);
  const p = page(storage, cloud); p.onLoad({ mode: 'guide', groupId: group.id, scope: group.scope, count: '15' });
  await until(() => p.data.loadState === 'ready' && p.data.guideCard);
  assert(calls.some((call) => call.action === 'hydrate'));
  let peakCards = 0, peakBytes = 0;
  for (let i = 0; i < 15; i += 1) {
    assert.equal(p.data.guideCard.id, p.guideSession.ids[i]);
    const stats = verifyBound(p); peakCards = Math.max(peakCards, stats.cards); peakBytes = Math.max(peakBytes, stats.bytes);
    p.handleGuideAssess({ currentTarget: { dataset: { result: i % 2 ? 'remembered' : 'missed' } } });
    await until(() => p.guideSession.index === i + 1 && p.data.loadState === 'ready');
  }
  assert(p.data.completed); assert.equal(p.guideEngine.result(p.guideSession).assessed, 15);
  const previousGroup = p.guideSession.groupId;
  for (let round = 0; round < 4 && p.guideSession.groupId === previousGroup; round += 1) {
    p.handleNextGroup(); await until(() => p.data.loadState === 'ready' && !!p.data.guideCard);
    if (p.guideSession.groupId !== previousGroup) break;
    const remaining = p.guideSession.ids.length;
    for (let i = 0; i < remaining; i += 1) {
      p.handleGuideAssess({ currentTarget: { dataset: { result: 'remembered' } } });
      await until(() => p.guideSession.index === i + 1 && p.data.loadState === 'ready');
    }
  }
  assert.notEqual(p.guideSession.groupId, previousGroup);
  verifyBound(p);
  const otherScope = bootstrap.scopes.find((item) => item.id !== p.guideSession.scope).id;
  p.handleMenu(); p.handleScope({ currentTarget: { dataset: { id: otherScope } } }); p.handleSaveSettings();
  await until(() => p.data.loadState === 'ready' && p.data.guideCard && p.guideSession.scope === otherScope);
  assert.equal(p.data.guideGroup.scope, otherScope);
  verifyBound(p);
  p.onUnload();
  return { assessed: 15, crossedGroup: true, changedScope: otherScope, peakCards, peakBytes };
}
async function failuresAndRaces() {
  const storage = {}, group = bootstrap.groups.find((item) => item.cardIds.length >= 15);
  let failOnce = true, partial = false, hydrateCalls = 0;
  const cloud = async ({ data }) => {
    if (data.action === 'hydrate') {
      hydrateCalls++;
      if (failOnce) { failOnce = false; throw new Error('network unavailable'); }
      const result = clone(await main(data));
      if (partial && data.ids.length > 1) {
        result.items = result.items.slice(0, 1); result.nextOffset = 1;
      }
      return { result };
    }
    return { result: clone(await main(data)) };
  };
  const p = page(storage, cloud); p.onLoad({ mode: 'guide', groupId: group.id, scope: group.scope, count: '15' });
  await until(() => p.data.loadState === 'error');
  assert.equal(p.guideSession.index, 0);
  partial = true; p.handleNextGroup();
  await until(() => p.data.loadState === 'ready' && p.data.guideCard);
  assert.equal(p.data.guideCard.id, p.guideSession.ids[0]);
  // Refetch a missing future window through the adapter; partial pages must complete in ID order.
  const adapter = require('../miniprogram/subpackages/common-sense/services/cloud-guide-content')
    .createGuideCardAdapter({ cloud: { callFunction: cloud } }, p.guideContent);
  const ids = p.guideSession.ids.slice(5, 9);
  const cards = await adapter.fetch(ids, { version: p.guideContent.version, mode: 'guide', scope: p.guideSession.scope });
  assert.deepEqual(cards.map((card) => card.id), ids);
  verifyBound(p);
  p.onUnload();
  return { retryRecovered: true, partialCompleted: true, hydrateCalls };
}
async function oldRecordAndIdentity() {
  const saved = clone(require('./fixtures/learning-bank/common-sense-guide-v1-before-b2.json'));
  const storage = { 'common-sense-guide-v1': clone(saved) };
  const calls = [], cloud = async ({ data }) => { calls.push(data); return { result: clone(await main(data)) }; };
  const p = page(storage, cloud); p.onLoad({ mode: 'guide' });
  await until(() => p.data.loadState === 'ready' && !!p.data.guideCard);
  assert.equal(p.guideSession.index, 1);
  assert.equal(calls.filter((call) => call.action === 'hydrate').length, 0);
  const id = saved.sessions[saved.summary.key].ids[0];
  assert.equal(storage['common-sense-guide-v1'].records[id].status, 'fuzzy');
  verifyBound(p); p.onUnload();

  const catalog = await loadPublicGuide({ getStorageSync: () => null, cloud: { callFunction: cloud } });
  const requested = catalog.groups[0].cardIds[0];
  const context = { version: catalog.version, scope: 'all', mode: 'guide' };
  const tampered = createGuideCardAdapter({ cloud: { callFunction: async ({ data }) => {
    const result = clone(await main(data)); result.items[0].signature = 'wrong-signature';
    return { result };
  } } }, catalog);
  await assert.rejects(tampered.fetch([requested], context), (error) => error.code === 'INCOMPLETE_BATCH');
  const changed = createGuideCardAdapter({ cloud: { callFunction: async () => ({ result: {
    ok: false, code: 'VERSION_CHANGED', message: 'version changed',
  } }) } }, catalog);
  await assert.rejects(changed.fetch([requested], context), (error) => error.code === 'VERSION_CHANGED');
  return { oldIndex: 1, oldAssessmentPreserved: true, wrongSignatureRejected: true, versionConflictRejected: true };
}
async function lateResponse() {
  const group = bootstrap.groups.find((item, index) => index > 0 && item.cardIds.length >= 15);
  const held = deferred(); let pending = false;
  const cloud = async ({ data }) => {
    if (data.action === 'hydrate' && data.ids[0] === group.cardIds[0] && !pending) {
      pending = true; return held.promise;
    }
    return { result: clone(await main(data)) };
  };
  const p = page({}, cloud); p.onLoad({ mode: 'guide', groupId: group.id, scope: group.scope, count: '15' });
  await until(() => pending && p.data.loadState === 'loading');
  const targetScope = bootstrap.scopes.find((item) => item.id !== group.scope).id;
  p.handleMenu(); p.handleScope({ currentTarget: { dataset: { id: targetScope } } }); p.handleSaveSettings();
  await until(() => p.data.loadState === 'ready' && p.data.guideCard && p.guideSession.scope === targetScope);
  const currentId = p.data.guideCard.id;
  held.resolve({ result: clone(await main({ action: 'hydrate', bank: 'common-guide', mode: 'guide',
    version: p.guideContent.version, scope: { scope: group.scope }, ids: [group.cardIds[0]] })) });
  await tick(); await tick();
  assert.equal(p.data.guideCard.id, currentId); assert.equal(p.guideSession.scope, targetScope);
  verifyBound(p); p.onUnload();

  const bootstrapLate = deferred();
  const unloaded = page({}, async () => bootstrapLate.promise);
  unloaded.onLoad({ mode: 'guide' }); unloaded.onUnload();
  bootstrapLate.resolve({ result: clone(await main({ action: 'bootstrap', bank: 'common-guide', mode: 'guide' })) });
  await tick(); await tick(); assert.equal(unloaded.guideEngine, undefined);
  return { oldRoundIgnored: true, unloadedPageIgnoredBootstrap: true };
}
async function capacityEdges() {
  let fetches = 0;
  const b = createCardBuffer({ fetch: async () => { fetches++; throw new Error('unexpected fetch'); },
    onItems() {}, limits: { maxCards: 10, maxBytes: 24 * 1024 } });
  b.configure({ roundId: 'guide-large', version: 'v1', mode: 'guide', scope: 'all', ids: ['large'], index: 0 });
  const near = { id: 'large', content: 'x'.repeat(23 * 1024) };
  b.seed([near]); assert.equal((await b.get('large')).content.length, near.content.length);
  assert(b.stats().bytes < 24 * 1024);
  assert.throws(() => b.seed([{ id: 'large', content: 'x'.repeat(25 * 1024) }]),
    (error) => error.code === 'ITEM_TOO_LARGE');
  assert.equal(fetches, 0); b.close();
  const reloaded = [];
  const back = createCardBuffer({ fetch: async (ids) => {
    reloaded.push(ids.slice()); return ids.map((id) => ({ id, content: id.repeat(200) }));
  }, onItems() {}, limits: { maxCards: 1, maxBytes: 1024, ahead: 0, behind: 0 } });
  const queue = { roundId: 'guide-back', version: 'v1', mode: 'guide', scope: 'all', ids: ['a', 'b'], index: 0 };
  back.configure(queue); await back.get('a');
  back.configure({ ...queue, index: 1 }); await back.get('b');
  back.configure(queue); assert.equal((await back.get('a')).id, 'a');
  assert.deepEqual(reloaded, [['a'], ['b'], ['a']]); back.close();
  return { nearBudgetAccepted: true, oversizeRejectedWithoutRetry: true, evictedCardReloadedOnBack: true };
}
async function hundredCards() {
  const storage = {}, cloud = async ({ data }) => ({ result: clone(await main(data)) });
  const p = page(storage, cloud); p.onLoad({ mode: 'guide', count: '15' });
  await until(() => p.data.loadState === 'ready' && !!p.data.guideCard);
  let peakCards = 0, peakBytes = 0, groups = new Set();
  for (let n = 0; n < 100; n += 1) {
    if (p.data.completed) {
      p.handleNextGroup(); await until(() => p.data.loadState === 'ready' && !!p.data.guideCard);
    }
    groups.add(p.guideSession.groupId);
    assert.equal(p.data.guideCard.id, p.guideSession.ids[p.guideSession.index]);
    const stats = verifyBound(p); peakCards = Math.max(peakCards, stats.cards); peakBytes = Math.max(peakBytes, stats.bytes);
    const prior = p.guideSession.index;
    p.handleGuideAssess({ currentTarget: { dataset: { result: 'remembered' } } });
    await until(() => p.guideSession.index === prior + 1 && p.data.loadState === 'ready');
  }
  assert(groups.size > 5);
  const saved = storage['common-sense-guide-v1'];
  assert(Object.keys(saved.seen).length >= 100);
  p.onUnload();
  return { assessed: 100, groups: groups.size, peakCards, peakBytes };
}
async function mainTest() {
  const result = { data: await scopeData(), initial: await initialAndResume(),
    longSequence: await longSequence(), failures: await failuresAndRaces(),
    oldRecord: await oldRecordAndIdentity(), races: await lateResponse(),
    capacity: await capacityEdges(), stress: await hundredCards() };
  console.log(JSON.stringify({ passed: true, ...result }));
}
mainTest().catch((error) => { console.error(error); process.exitCode = 1; });
