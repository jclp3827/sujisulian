#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { main } = require('../cloudfunctions/learningBank');
const manifest = require('../cloudfunctions/learningBank/data/manifest.json').banks['note-practice'];
const { createEngine, STORAGE_KEY } = require('../miniprogram/subpackages/note/services/practice-session');
const { createPracticeAdapter } = require('../miniprogram/subpackages/note/services/cloud-practice-runtime');
const exposureMap = require('../miniprogram/subpackages/note/models/cloud-practice-exposures');
const { sourceKey } = require('../miniprogram/subpackages/note/services/learning-content');
const { fingerprint } = require('../miniprogram/subpackages/note/services/learning-content');
const semantic = require('../miniprogram/subpackages/note/services/learning-semantic');

const clone = (value) => JSON.parse(JSON.stringify(value));
const tick = () => new Promise((resolve) => setImmediate(resolve));
const deferred = () => { let resolve; const promise = new Promise((yes) => { resolve = yes; }); return { promise, resolve }; };
async function until(predicate) {
  for (let i = 0; i < 500; i += 1) { if (predicate()) return; await tick(); }
  throw new Error('Practice page did not settle');
}
function page(storage, cloud) {
  const filename = path.resolve(__dirname, '../miniprogram/subpackages/note/practice/index.js');
  let definition;
  const calls = [];
  const wx = { cloud: { callFunction: cloud }, getAccountInfoSync: () => ({ miniProgram: { envVersion: 'release' } }),
    getStorageSync: (key) => storage[key] && clone(storage[key]), setStorageSync: (key, value) => { storage[key] = clone(value); },
    setNavigationBarTitle() {}, navigateTo(value) { calls.push(value); }, switchTab(value) { calls.push(value); },
    nextTick(fn) { fn(); }, pageScrollTo() {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), { require: createRequire(filename),
    Page: (value) => { definition = value; }, wx, console, Buffer, setTimeout, clearTimeout }, { filename });
  return { ...definition, data: clone(definition.data), calls, setData(value) { Object.assign(this.data, value); } };
}
function standardCloud(log = [], change = (value) => value) {
  return async ({ data }) => { log.push(data); return { result: change(clone(await main(data)), data) }; };
}
function seededStorage() {
  return { [STORAGE_KEY]: { schemaVersion: 1, sessions: {}, active: {},
    preferences: { application: { scope: { subjectId: 'all', categoryId: 'all', pointId: '' }, count: 15 } },
    exposures: {}, returnTokens: {}, attempts: {} } };
}
function bound(p) {
  const stats = p.practiceBuffer.stats();
  assert(stats.cards <= 8 && stats.bytes <= 80 * 1024);
  assert.equal(p.runtime.content.resources.length, 0);
  assert(p.runtime.engine.getSession(p.data.sessionId).items.slice(0, -1)
    .every((item) => !item.prompt || item.resourceId === p.data.card?.resourceId));
  return stats;
}
async function ready(p) { await until(() => p.data.state === 'question' && !!p.data.card); }
function answer(p) {
  const key = p.data.card.options[0].key;
  p.handleChoice({ currentTarget: { dataset: { key } } });
  p.handleSubmit();
  assert(p.data.answer.outcome);
}
async function data() {
  const sizes = manifest.index.map((item) => item.bytes).sort((a, b) => a - b);
  let materialGroups = 0, images = 0;
  for (const record of manifest.index) {
    const item = require(path.resolve(__dirname, '../cloudfunctions/learningBank/data/note-practice', `${record.file}.json`))
      .find((value) => value.id === record.id);
    if (item.materialId) materialGroups++;
    if (item.images?.length) images++;
  }
  assert.equal(manifest.count, 142); assert.equal(materialGroups, 0); assert.equal(images, 0);
  assert.equal(exposureMap.version, manifest.version);
  const expectedExposures = {}, expectedIdentity = {};
  for (const record of manifest.index) {
    const item = require(path.resolve(__dirname, '../cloudfunctions/learningBank/data/note-practice', `${record.file}.json`))
      .find((value) => value.id === record.id);
    expectedIdentity[item.id] = [fingerprint(item), semantic.runtimeSignature(item),
      item.semanticAdmission?.signature || '', item.legacyCompatibility?.resourceSignature || '',
      item.legacyCompatibility?.currentSemanticSignature || ''];
    for (const key of item.answerSourceKeys || []) {
      const groups = expectedExposures[key] ||= [];
      if (!groups.includes(item.exposureGroupId)) groups.push(item.exposureGroupId);
    }
  }
  assert.deepEqual(exposureMap.groups, expectedExposures);
  assert.deepEqual(exposureMap.identity, expectedIdentity);
  return { count: manifest.count, medianBytes: sizes[Math.floor(sizes.length / 2)], p99Bytes: sizes[Math.ceil(sizes.length * .99) - 1],
    maxBytes: sizes.at(-1), materialGroups, imageQuestions: images };
}
async function modesAndScope() {
  const rows = [];
  for (const kind of ['basic', 'method', 'application']) {
    const storage = seededStorage(), p = page(storage, standardCloud());
    p.onLoad({ kind, subjectId: 'data-analysis' }); await ready(p);
    assert.equal(p.data.card.subjectId, 'data-analysis');
    assert.equal(p.data.card.exerciseKinds.includes(kind), true);
    assert.equal(p.data.card.resourceId, p.activeSession.items[0].resourceId);
    assert(p.data.card.sources.length > 0); bound(p);
    rows.push({ kind, total: p.data.total, scope: p.data.card.subjectId }); p.onUnload();
  }
  return rows;
}
async function firstCardBeforeTail() {
  const storage = seededStorage(), calls = [], held = deferred(); let tailStarted = false;
  const cloud = async ({ data }) => {
    calls.push(data);
    if (data.action === 'hydrate') { tailStarted = true; await held.promise; }
    return { result: clone(await main(data)) };
  };
  const p = page(storage, cloud); p.onLoad({ kind: 'application' });
  await ready(p);
  assert.equal(p.data.total, 15); assert.equal(p.data.index, 1);
  assert.equal(calls.filter((value) => value.action === 'start').length, 1);
  assert.equal(calls.filter((value) => value.action === 'batch').length, 0);
  for (let i = 0; i < 3; i += 1) { answer(p); p.handleNext(); await ready(p); }
  await until(() => tailStarted);
  assert.equal(p.data.index, 4);
  const id = p.data.card.resourceId; answer(p);
  assert(p.data.card && p.data.card.resourceId === id && p.data.answer.outcome);
  const sessionId = p.data.sessionId, snapshot = storage[STORAGE_KEY].sessions[sessionId];
  assert.equal(snapshot.snapshotVersion, 2); assert.equal(snapshot.items.length, 15);
  assert(snapshot.items.every((item) => !item.prompt && !item.options && !item.material));
  held.resolve(); await tick(); bound(p); p.onUnload();
  return { firstVisibleWhileTailHeld: true, answeredWhileTailHeld: true, firstBatch: 5, total: 15,
    fullRoundBatchCalls: 0, slimSnapshot: true };
}
async function longSequence() {
  const storage = seededStorage(), calls = [], p = page(storage, standardCloud(calls));
  p.onLoad({ kind: 'application' }); await ready(p);
  let peakCards = 0, peakBytes = 0, firstId = p.data.card.resourceId, firstOutcome;
  for (let i = 0; i < 15; i += 1) {
    await ready(p); assert.equal(p.data.card.resourceId, p.activeSession.items[i].resourceId);
    assert(p.data.card.refs.length && p.data.card.sources.length);
    assert(typeof p.data.card.explanation === 'string' && p.data.card.explanation);
    const stats = bound(p); peakCards = Math.max(peakCards, stats.cards); peakBytes = Math.max(peakBytes, stats.bytes);
    if (i % 3 === 0) p.handleReveal(); else answer(p);
    if (i === 0) firstOutcome = p.data.answer.outcome;
    p.handleNext(); await until(() => p.activeSession?.index === i + 1 || p.data.state === 'finished');
  }
  assert.equal(p.data.state, 'finished');
  assert.equal(storage[STORAGE_KEY].sessions[p.data.sessionId].answers[
    storage[STORAGE_KEY].sessions[p.data.sessionId].items[0].instanceId].outcome, firstOutcome);
  assert(storage[STORAGE_KEY].sessions[p.data.sessionId].items.every((item) => !item.prompt));
  const stats = bound(p);
  const first = storage[STORAGE_KEY].sessions[p.data.sessionId].items[0];
  p.practiceBuffer.configure({ roundId: `${p.data.sessionId}:back`, version: p.runtime.content.version,
    mode: 'application', scope: p.activeSession.scope,
    ids: p.activeSession.items.map((item) => item.resourceId), index: 0 });
  const body = await p.practiceBuffer.get(firstId);
  assert.equal(body.id, firstId); assert.equal(first.instanceId,
    storage[STORAGE_KEY].sessions[p.data.sessionId].items[0].instanceId);
  assert(calls.some((call) => call.action === 'hydrate' && call.ids.includes(firstId)));
  p.onUnload();
  return { practiced: 15, peakCards, peakBytes, finalCards: stats.cards, evictedBodyReloaded: true,
    answerPersisted: true };
}
async function longTerm() {
  const storage = seededStorage(), p = page(storage, standardCloud());
  p.onLoad({ kind: 'application' }); await ready(p);
  let operations = 0, peakCards = 0, peakBytes = 0;
  for (let round = 0; round < 8; round += 1) {
    const count = p.data.total;
    for (let index = 0; index < count; index += 1) {
      await ready(p); const stats = bound(p);
      peakCards = Math.max(peakCards, stats.cards); peakBytes = Math.max(peakBytes, stats.bytes);
      p.handleSkip(); operations++;
      await until(() => p.data.state === 'finished' || p.data.state === 'question' && p.data.index === index + 2);
    }
    assert.equal(p.data.state, 'finished');
    if (round < 7) { p.handleFresh(); await ready(p); }
  }
  assert(operations >= 100);
  assert(Object.values(storage[STORAGE_KEY].sessions).every((session) => session.snapshotVersion === 2 &&
    session.items.every((item) => !item.prompt && !item.material && !item.options)));
  p.onUnload(); return { operations, rounds: 8, peakCards, peakBytes, persistedBodies: 0 };
}
async function resumeAndIdentity() {
  const storage = seededStorage(), calls = [], cloud = standardCloud(calls);
  let p = page(storage, cloud); p.onLoad({ kind: 'application' }); await ready(p);
  answer(p); const id = p.data.card.resourceId, outcome = p.data.answer.outcome, sessionId = p.data.sessionId;
  p.onUnload();
  p = page(storage, cloud); p.onLoad({ kind: 'application', sessionId }); await ready(p);
  assert.equal(p.data.card.resourceId, id); assert.equal(p.data.answer.outcome, outcome);
  assert(calls.some((call) => call.action === 'resume'));
  p.onUnload();
  storage[STORAGE_KEY].sessions[sessionId].contentVersion = 'old-version';
  const old = clone(storage[STORAGE_KEY].sessions[sessionId]);
  p = page(storage, cloud); p.onLoad({ kind: 'application', sessionId });
  await until(() => p.data.state === 'expired');
  assert.deepEqual(storage[STORAGE_KEY].sessions[sessionId], old);
  p.onUnload();
  return { v2Resume: true, answerRestored: true, mismatchedVersionExpiredWithoutOverwrite: true };
}
async function legacy() {
  const storage = seededStorage(), scope = { subjectId: 'all', categoryId: 'all', pointId: '' };
  const first = await main({ bank: 'note-practice', action: 'start', mode: 'application', scope, count: 15 });
  const resources = first.items.slice(); let offset = first.nextOffset;
  while (offset < first.session.ids.length) {
    const next = await main({ bank: 'note-practice', action: 'batch', mode: 'application', scope,
      version: first.version, session: first.session, offset });
    resources.push(...next.items); offset = next.nextOffset;
  }
  const oldContent = { schemaVersion: 1, version: first.version, resources, materials: [],
    entryPlans: { application: { resourceIds: resources.map((item) => item.id) } } };
  const api = { getStorageSync: (key) => storage[key] && clone(storage[key]),
    setStorageSync: (key, value) => { storage[key] = clone(value); } };
  const engine = createEngine(oldContent, api);
  const oldSession = engine.start({ kind: 'application', count: 15 }).session;
  for (let i = 0; i < 6; i += 1) { engine.skip(oldSession.id); engine.advance(oldSession.id); }
  const frozen = clone(storage[STORAGE_KEY].sessions[oldSession.id]);
  assert.equal(frozen.snapshotVersion, undefined); assert.equal(frozen.index, 6);
  const p = page(storage, standardCloud()); p.onLoad({ kind: 'application', sessionId: oldSession.id }); await ready(p);
  assert.equal(p.data.index, 7); assert.equal(p.data.card.resourceId, frozen.items[6].resourceId);
  assert.equal(storage[STORAGE_KEY].sessions[oldSession.id].items[6].prompt, frozen.items[6].prompt);
  assert.deepEqual(storage[STORAGE_KEY].sessions[oldSession.id].answers, frozen.answers);
  p.onUnload();
  storage[STORAGE_KEY].sessions[oldSession.id].items[0].resourceSignature = 'incompatible';
  storage[STORAGE_KEY].sessions[oldSession.id].items[0].semanticRuntimeSignature = 'incompatible';
  const bad = clone(storage[STORAGE_KEY].sessions[oldSession.id]);
  const q = page(storage, standardCloud()); q.onLoad({ kind: 'application', sessionId: oldSession.id });
  try { await until(() => q.data.state === 'expired'); }
  catch (error) { throw new Error(`legacy mismatch ${q.data.state}: ${q.data.notice}: ${error.message}`); }
  assert.deepEqual(storage[STORAGE_KEY].sessions[oldSession.id], bad); q.onUnload();
  return { resumedAtSeventh: true, oldAnswersPreserved: true, oldSnapshotUnchangedOnRead: true,
    signatureMismatchExpired: true };
}
async function partialAndFailure() {
  const storage = seededStorage(); let partial = true, fail = true;
  const setup = page(storage, standardCloud()); setup.onLoad({ kind: 'application' }); await ready(setup);
  for (let i = 0; i < 6; i += 1) { setup.handleReveal(); setup.handleNext(); await ready(setup); }
  const sessionId = setup.data.sessionId, index = setup.activeSession.index; setup.onUnload();
  const cloud = standardCloud([], (result, data) => {
    if (data.action === 'hydrate' && data.ids.length > 1 && partial) {
      result.items = result.items.slice(0, 1); result.nextOffset = 1;
    }
    return result;
  });
  const p = page(storage, async (request) => {
    if (request.data.action === 'hydrate' && fail) { fail = false; throw new Error('offline'); }
    return cloud(request);
  });
  p.onLoad({ kind: 'application', sessionId });
  await until(() => p.data.state === 'error');
  p.handleRetry(); await ready(p);
  assert.equal(p.data.index, index + 1); assert.equal(p.data.card.resourceId,
    storage[STORAGE_KEY].sessions[p.data.sessionId].items[index].resourceId);
  const adapter = createPracticeAdapter({ cloud: { callFunction: cloud } }, p.runtime.content);
  const ids = p.activeSession.items.slice(index + 1, index + 4).map((item) => item.resourceId);
  assert.equal((await adapter.fetch(ids, { version: p.runtime.content.version, mode: 'application',
    scope: p.activeSession.scope })).length, ids.length);
  partial = false; bound(p); p.onUnload();
  return { failedCurrentRetried: true, partialResponseContinued: true };
}
async function raceAndBudget() {
  const storage = seededStorage(), setup = page(storage, standardCloud());
  setup.onLoad({ kind: 'application' }); await ready(setup);
  for (let i = 0; i < 6; i += 1) { setup.handleReveal(); setup.handleNext(); await ready(setup); }
  const oldId = setup.data.sessionId; setup.onUnload();
  const gate = deferred(); let held = false, hydrateCalls = 0;
  const cloud = async ({ data }) => {
    if (data.action === 'hydrate' && !held) { held = true; hydrateCalls++; await gate.promise; }
    return { result: clone(await main(data)) };
  };
  const p = page(storage, cloud); p.onLoad({ kind: 'application', sessionId: oldId });
  await until(() => held && p.data.state === 'loading');
  const pending = p.runtime.engine.getSession(oldId);
  p.render(pending); await tick(); assert.equal(hydrateCalls, 1);
  p.handleFresh(); await ready(p);
  const newId = p.data.sessionId; assert.notEqual(newId, oldId);
  gate.resolve(); await tick(); await tick();
  assert.equal(p.data.sessionId, newId); assert.equal(p.data.card.resourceId, p.activeSession.items[0].resourceId);
  bound(p); p.onUnload();
  const exitGate = deferred(); let exitHeld = false;
  const leaving = page(storage, async ({ data }) => {
    if (data.action === 'hydrate' && !exitHeld) { exitHeld = true; await exitGate.promise; }
    return { result: clone(await main(data)) };
  });
  leaving.onLoad({ kind: 'application', sessionId: oldId });
  await until(() => exitHeld && leaving.data.state === 'loading');
  leaving.onUnload(); exitGate.resolve(); await tick(); await tick();
  assert(!leaving.data.card && leaving.practiceBuffer.stats().cards === 0);
  const content = { version: 'v', cloudQueue: { kind: 'application', ids: ['x'] } };
  const full = { id: 'x', exerciseKinds: ['application'], refs: [{ pointId: 'a' }],
    prompt: 'x'.repeat(70 * 1024), explanation: 'e', options: [], subjectId: 'all', categoryId: 'all' };
  const api = { cloud: { callFunction: async () => ({ result: { ok: true, version: 'v', items: [full], nextOffset: 1 } }) } };
  await assert.rejects(createPracticeAdapter(api, content).fetch(['x'], { version: 'v', mode: 'application',
    scope: { subjectId: 'all' } }), { code: 'ITEM_TOO_LARGE' });
  const versionApi = { cloud: { callFunction: async () => ({ result: { ok: false,
    code: 'VERSION_CHANGED', message: 'version changed' } }) } };
  await assert.rejects(createPracticeAdapter(versionApi, content).fetch(['x'], { version: 'v', mode: 'application',
    scope: { subjectId: 'all' } }), { code: 'VERSION_CHANGED' });
  return { sameIdMerged: true, oldRoundIgnored: true, unloadedIgnored: true,
    oversizedRejected: true, versionRejected: true };
}
async function sourceSemantics() {
  const storage = seededStorage(), p = page(storage, standardCloud());
  p.onLoad({ kind: 'application' }); await ready(p);
  const refIndex = p.data.card.refs.findIndex((item) => exposureMap.groups[sourceKey(item)]?.length);
  assert(refIndex >= 0);
  const ref = p.data.card.refs[refIndex];
  p.handleSource({ currentTarget: { dataset: { index: refIndex } } });
  assert(p.calls.length && p.calls[0].url.includes('practiceReturn='));
  const token = Object.keys(storage[STORAGE_KEY].returnTokens)[0];
  assert(p.runtime.engine.noteViewed(token, ref));
  p.handleChoice({ currentTarget: { dataset: { key: p.data.card.answer } } }); p.handleSubmit();
  assert.equal(p.data.answer.outcome, 'assisted');
  assert(storage[STORAGE_KEY].exposures[p.data.card.exposureGroupId]);
  p.onUnload();
  return { sourceReturnToken: true, assistedAfterConsultation: true, exposurePreserved: true };
}

(async () => {
  console.log(JSON.stringify({ passed: true, data: await data(), first: await firstCardBeforeTail(),
    modes: await modesAndScope(), sequence: await longSequence(), longTerm: await longTerm(),
    resume: await resumeAndIdentity(), legacy: await legacy(),
    recovery: await partialAndFailure(), races: await raceAndBudget(), source: await sourceSemantics() }));
})().catch((error) => { console.error(error); process.exitCode = 1; });
