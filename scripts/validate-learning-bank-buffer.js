#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { main } = require('../cloudfunctions/learningBank');
const manifest = require('../cloudfunctions/learningBank/data/manifest.json');
const { createCardBatchAdapter, byteLength } = require('../miniprogram/services/knowledge-platform/card-batch-adapter');
const { createCardBuffer } = require('../miniprogram/services/knowledge-platform/card-buffer');
const { createMemoryCardAdapter } = require('../miniprogram/subpackages/note/services/cloud-memory-content');

const tick = () => new Promise((resolve) => setImmediate(resolve));
const clone = (value) => JSON.parse(JSON.stringify(value));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
async function until(predicate) {
  for (let i = 0; i < 200; i += 1) { if (predicate()) return; await tick(); }
  throw new Error('Expected asynchronous state was not reached');
}
async function rejectsCode(promise, code) { await assert.rejects(promise, (error) => error.code === code); }

async function contract() {
  const bank = manifest.banks['note-memory'];
  const ids = bank.modes.basic.slice(0, 5);
  const scope = { subjectId: 'all', categoryId: 'all' };
  const hydrate = (extra) => main({ bank: 'note-memory', mode: 'basic', action: 'hydrate', version: bank.version, scope, ...extra });
  const ordered = await hydrate({ ids: [ids[2], ids[0], ids[1]] });
  assert.equal(ordered.ok, true);
  assert.deepEqual(ordered.items.map((item) => item.id), [ids[2], ids[0], ids[1]]);
  assert.equal(ordered.nextOffset, 3);
  assert(ordered.payloadBytes <= 64 * 1024);
  assert.equal((await hydrate({ ids: [ids[0], 'missing'] })).code, 'BAD_ITEMS');
  assert.equal((await hydrate({ ids: [ids[0]], version: 'old' })).code, 'VERSION_CHANGED');
  assert.equal((await hydrate({ ids: bank.modes.basic.slice(0, 6) })).code, 'BAD_ITEMS');
  const catalog = await main({ bank: 'note-memory', mode: 'basic', action: 'catalog', offset: 0 });
  assert.equal(catalog.ok, true);
  assert(catalog.items.every((item) => !item.blocks));

  const calls = [];
  const adapter = createCardBatchAdapter(async (requested) => {
    calls.push(requested.slice());
    const count = requested.length > 1 ? requested.length - 1 : 1;
    return { version: 'v1', items: requested.slice(0, count).map((id) => ({ id, body: id })), nextOffset: count };
  });
  assert.deepEqual((await adapter.fetch(['a', 'b', 'c'], { version: 'v1' })).map((item) => item.id), ['a', 'b', 'c']);
  assert.deepEqual(calls, [['a', 'b', 'c'], ['c']]);
  await rejectsCode(createCardBatchAdapter(async () => ({ version: 'v1', items: [], nextOffset: 0 }))
    .fetch(['a'], { version: 'v1' }), 'INCOMPLETE_BATCH');
  await rejectsCode(createCardBatchAdapter(async () => ({ version: 'wrong', items: [{ id: 'a' }], nextOffset: 1 }))
    .fetch(['a'], { version: 'v1' }), 'VERSION_CHANGED');
  await rejectsCode(createCardBatchAdapter(async () => ({ version: 'v1', items: [{ id: 'wrong' }], nextOffset: 1 }))
    .fetch(['a'], { version: 'v1' }), 'INCOMPLETE_BATCH');
  await rejectsCode(createCardBatchAdapter(async () => ({ version: 'v1', items: [{ id: 'a', body: 'x'.repeat(100) }], nextOffset: 1 }), { maxBytes: 64 })
    .fetch(['a'], { version: 'v1' }), 'ITEM_TOO_LARGE');
  await rejectsCode(createCardBatchAdapter(async () => ({ version: 'v1', items: [{ id: 'a', body: 'x'.repeat(40) }, { id: 'b', body: 'x'.repeat(40) }], nextOffset: 2 }), { maxBytes: 64 })
    .fetch(['a', 'b'], { version: 'v1' }), 'RESPONSE_TOO_LARGE');
  const listed = catalog.items[0];
  const invalidIdentity = createMemoryCardAdapter({ cloud: { callFunction: async () => ({ result: {
    ok: true, version: bank.version, items: [{ id: listed.id, kind: listed.kind,
      subjectId: listed.subjectId, categoryId: listed.categoryId, semanticVersion: 'changed', blocks: [] }], nextOffset: 1,
  } }) } }, [{ id: listed.id, kind: listed.kind, subjectId: listed.subjectId,
    categoryId: listed.categoryId, semanticVersion: listed.version }]);
  await rejectsCode(invalidIdentity.fetch([listed.id], { version: bank.version, mode: 'basic', scope }), 'INCOMPLETE_BATCH');
  assert(byteLength({ text: '中文😀' }) > JSON.stringify({ text: '中文😀' }).length);
  return { currentLimit: 5, responseBudget: 65536, partialCalls: calls.length };
}

async function buffer() {
  const calls = [], requests = [];
  const body = (id) => ({ id, blocks: [{ text: id.repeat(300) }] });
  const accepted = new Map();
  const b = createCardBuffer({ fetch: (ids) => { const d = deferred(); calls.push(ids); requests.push(d); return d.promise; },
    onItems: (items) => items.forEach((item) => accepted.set(item.id, item)),
    onEvict: (ids) => ids.forEach((id) => accepted.delete(id)),
    limits: { maxCards: 3, maxBytes: 2100, ahead: 2, refillAt: 1 } });
  const queue = { roundId: 'round-1', version: 'v1', mode: 'basic', scope: { subjectId: 'all' }, ids: ['a', 'b', 'c', 'd', 'e'], index: 0 };
  b.configure(queue);
  const one = b.get('a'), duplicate = b.get('a');
  await until(() => calls.length === 1); assert.deepEqual(calls, [['a']]);
  requests.shift().resolve([body('a')]);
  assert.equal((await one).id, 'a'); assert.equal((await duplicate).id, 'a');
  const warm = b.prefetch(); await until(() => calls.length === 2);
  assert.deepEqual(calls[1], ['b', 'c']);
  requests.shift().resolve([body('b'), body('c')]); await warm;
  assert(b.stats().cards <= 3 && b.stats().bytes <= 2100);
  let resolved = 2;
  for (let index = 1; index < queue.ids.length; index += 1) {
    b.configure({ ...queue, index });
    const current = b.get(queue.ids[index]);
    await tick();
    while (requests.length) requests.shift().resolve(calls[resolved++].map(body));
    assert.equal((await current).id, queue.ids[index]);
    assert(b.stats().cards <= 3 && b.stats().bytes <= 2100);
  }
  assert(accepted.size <= 3);
  b.close(); assert.equal(b.stats().cards, 0);

  const late = [], delayed = createCardBuffer({ fetch: (ids) => { const d = deferred(); late.push({ ids, ...d }); return d.promise; },
    onItems() {}, limits: { maxCards: 2, maxBytes: 2048 } });
  delayed.configure({ ...queue, ids: ['a'], index: 0 });
  const old = delayed.get('a'); await until(() => late.length === 1);
  delayed.configure({ ...queue, roundId: 'round-2', scope: { subjectId: 'other' }, ids: ['b'], index: 0 });
  const newest = delayed.get('b'); await until(() => late.length === 2);
  late[1].resolve([body('b')]); assert.equal((await newest).id, 'b');
  late[0].resolve([body('a')]); await rejectsCode(old, 'STALE_REQUEST');
  assert.equal(delayed.stats().cards, 1);
  delayed.close();
  const raced = [], rapid = createCardBuffer({ fetch: (requested) => {
    const d = deferred(); raced.push({ ids: requested, ...d }); return d.promise;
  }, onItems() {}, limits: { maxCards: 3, maxBytes: 3000, ahead: 0 } });
  rapid.configure({ ...queue, ids: ['a', 'b', 'c'], index: 0 });
  const first = rapid.get('a'); await until(() => raced.length === 1);
  rapid.configure({ ...queue, ids: ['a', 'b', 'c'], index: 1 });
  const second = rapid.get('b'); await until(() => raced.length === 2);
  raced[1].resolve([body('b')]); assert.equal((await second).id, 'b');
  raced[0].resolve([body('a')]); assert.equal((await first).id, 'a');
  rapid.configure({ ...queue, ids: ['a', 'b', 'c'], index: 0 });
  assert.equal((await rapid.get('a')).id, 'a');
  assert.equal(raced.length, 2);
  rapid.close();
  return { maxCards: 3, maxBytes: 2100, sameIdRequests: 1, staleRejected: true,
    outOfOrderAndBackNavigation: true };
}

function page(storage, cloud) {
  const filename = path.resolve(__dirname, '../miniprogram/subpackages/note/memory/index.js');
  let definition;
  const wx = { cloud: { callFunction: cloud }, getStorageSync: (key) => storage[key] && clone(storage[key]),
    setStorageSync: (key, value) => { storage[key] = clone(value); }, setNavigationBarTitle() {},
    switchTab() {}, navigateTo() {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), { require: createRequire(filename),
    Page: (value) => { definition = value; }, wx, console, Buffer, setTimeout, clearTimeout }, { filename });
  return { ...definition, data: clone(definition.data), setData(values) { Object.assign(this.data, values); } };
}
async function pageFlow() {
  const storage = {}, actions = [];
  const cloud = async ({ data }) => { actions.push(data); return { result: clone(await main(data)) }; };
  let p = page(storage, cloud); p.onLoad({ kind: 'basic' });
  assert.equal(p.data.state, 'loading');
  await until(() => p.data.state === 'card');
  const firstId = p.data.card.id, roundId = p.data.sessionId;
  assert.equal(actions[0].action, 'catalog');
  let peakCards = 0, peakBytes = 0;
  for (let i = 0; i < 13; i += 1) {
    p.handleSkip(); await until(() => p.data.state === 'card' && p.data.index === i + 2);
    const stats = p.cardBuffer.stats();
    peakCards = Math.max(peakCards, stats.cards); peakBytes = Math.max(peakBytes, stats.bytes);
    assert(stats.cards <= 8 && stats.bytes <= 48 * 1024);
  }
  const progress = p.data.index;
  for (let step = 1; step <= 10; step += 1) {
    p.handlePrev(); await until(() => p.data.state === 'card' && p.data.index === progress - step);
  }
  for (let step = 9; step >= 0; step -= 1) {
    p.handleNext(); await until(() => p.data.state === 'card' && p.data.index === progress - step);
  }
  p.onUnload();
  p = page(storage, cloud); p.onLoad({ kind: 'basic' });
  await until(() => p.data.state === 'card');
  assert.equal(p.data.sessionId, roundId); assert.equal(p.data.index, progress);
  assert.equal(storage['notesMemory:v5:state'].sessions[roundId].responses[firstId].result, 'skipped');
  assert(Object.values(storage['notesMemory:v5:state'].sessions[roundId].items).every((item) => !item.blocks));
  const ratedId = p.data.card.id;
  p.handleReveal(); await until(() => p.data.answerVisible);
  assert.equal(p.data.imagesReady, true);
  p.handleAssess({ currentTarget: { dataset: { result: 'fuzzy' } } });
  await until(() => p.data.index === progress + 1);
  assert.equal(storage['notesMemory:v5:state'].ratings[ratedId].result, 'fuzzy');
  p.onUnload();
  const exam = page({}, cloud); exam.onLoad({ kind: 'exam', variant: 'review' });
  await until(() => exam.data.state === 'empty'); exam.onUnload();
  return { skipped: 13, resumedIndex: progress, retainedRecord: true, genuineEmpty: true,
    selfAssessment: !!storage['notesMemory:v5:state'].ratings[ratedId], peakCards, peakBytes };
}

async function oldRecord() {
  const saved = clone(require('./fixtures/learning-bank/notes-memory-v5-before-b1.json'));
  const storage = { 'notesMemory:v5:state': clone(saved) };
  const cloud = async ({ data }) => ({ result: clone(await main(data)) });
  const oldRoundId = saved.active.basic;
  const p = page(storage, cloud); p.onLoad({ kind: 'basic' });
  await until(() => p.data.state === 'card');
  assert.equal(p.data.sessionId, oldRoundId); assert.equal(p.data.index, 2);
  assert.deepEqual(storage['notesMemory:v5:state'].sessions[oldRoundId].responses, saved.sessions[oldRoundId].responses);
  p.onUnload();
  const incompatible = clone(saved);
  incompatible.sessions[oldRoundId].items[1].version = 'old-content-signature';
  const oldAnswers = clone(incompatible.sessions[oldRoundId].responses);
  const incompatibleStorage = { 'notesMemory:v5:state': incompatible };
  const changed = page(incompatibleStorage, cloud); changed.onLoad({ kind: 'basic' });
  await until(() => changed.data.state === 'expired');
  assert.deepEqual(incompatibleStorage['notesMemory:v5:state'].sessions[oldRoundId].responses, oldAnswers);
  changed.onUnload();
  return { schema: saved.schemaVersion, resumedIndex: 2, responsePreserved: true,
    incompatibleRoundExpiredWithoutDeletingAnswers: true };
}

async function pageFailures() {
  const storage = {}, calls = [];
  let failOnce = true;
  const cloud = async ({ data }) => {
    calls.push(data);
    if (data.action === 'hydrate' && failOnce) { failOnce = false; throw new Error('network unavailable'); }
    return { result: clone(await main(data)) };
  };
  const p = page(storage, cloud); p.onLoad({ kind: 'basic' });
  await until(() => p.data.state === 'error');
  assert.equal(p.data.card, null);
  p.handleRetry(); await until(() => p.data.state === 'card');
  assert.equal(p.data.index, 1);
  assert(calls.filter((call) => call.action === 'hydrate').length >= 2);
  p.onUnload();

  const late = deferred();
  const unloaded = page({}, async () => late.promise);
  unloaded.onLoad({ kind: 'basic' }); unloaded.onUnload();
  late.resolve({ result: clone(await main({ bank: 'note-memory', mode: 'basic', action: 'catalog', offset: 0 })) });
  await tick(); await tick();
  assert.equal(unloaded.engine, undefined);
  return { retryRecovered: true, unloadIgnoredLateCatalog: true };
}

(async () => {
  const result = { contract: await contract(), buffer: await buffer(), page: await pageFlow(),
    oldRecord: await oldRecord(), failures: await pageFailures() };
  console.log(JSON.stringify({ passed: true, ...result }));
})().catch((error) => { console.error(error); process.exitCode = 1; });
