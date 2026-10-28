#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { main } = require('../cloudfunctions/learningBank');
const manifest = require('../cloudfunctions/learningBank/data/manifest.json').banks;
const bootstrap = require('../cloudfunctions/learningBank/data/common-question/bootstrap.json');
const { createCommonCardAdapter } = require('../miniprogram/subpackages/common-sense/services/cloud-learning-content');

const clone = (value) => JSON.parse(JSON.stringify(value));
const tick = () => new Promise((resolve) => setImmediate(resolve));
const deferred = () => { let resolve; const promise = new Promise((yes) => { resolve = yes; }); return { promise, resolve }; };
async function until(predicate) {
  for (let i = 0; i < 500; i += 1) { if (predicate()) return; await tick(); }
  throw new Error('Common-sense page did not settle');
}
function page(storage = {}, cloud = async ({ data }) => ({ result: clone(await main(data)) })) {
  const filename = path.resolve(__dirname, '../miniprogram/subpackages/common-sense/learning/index.js');
  let definition;
  const wx = { cloud: { callFunction: cloud }, getAccountInfoSync: () => ({ miniProgram: { envVersion: 'release' } }),
    getStorageSync: (key) => storage[key] && clone(storage[key]), setStorageSync: (key, value) => { storage[key] = clone(value); },
    setNavigationBarTitle() {}, navigateTo() {}, nextTick() {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), { require: createRequire(filename),
    Page: (value) => { definition = value; }, wx, console, Buffer, setTimeout, clearTimeout }, { filename });
  return { ...definition, data: clone(definition.data), setData(value) { Object.assign(this.data, value); } };
}
function bound(p) {
  const stats = p.questionBuffer.stats();
  assert(stats.cards <= 10 && stats.bytes <= 48 * 1024);
  const fullQuestions = p.content.questions.filter((item) => !item.stub);
  const fullMnemonics = p.content.mnemonics.filter((item) => !item.stub);
  assert(fullQuestions.length + fullMnemonics.length <= stats.cards);
  assert(fullQuestions.every((item) => p.session.ids.includes(item.id)));
  assert(fullMnemonics.every((item) => p.session.ids.includes(item.id) || item.id === p.session.mnemonicId));
  return stats;
}
function tap(data = {}) { return { currentTarget: { dataset: data } }; }
async function ready(p) { await until(() => p.data.loadState === 'ready' && (p.data.card || p.data.mnemonic || p.data.isComparison)); }

async function identity() {
  assert.equal(bootstrap.questions.length, 603);
  assert.equal(bootstrap.mnemonics.length, 128);
  assert.deepEqual(bootstrap.questions.map((item) => item.id), manifest['common-question'].index.map((item) => item.id));
  assert.deepEqual(bootstrap.mnemonics.map((item) => item.id), manifest['common-mnemonic'].index.map((item) => item.id));
  assert(bootstrap.questions.every((item) => item.stub && item.runtimeSignature && item.options.every((option) => option === '')));
  assert(bootstrap.mnemonics.every((item) => item.stub && item.runtimeSignature && item.phrases.every((phrase) => !phrase.phrase)));
  const sizes = (bank) => manifest[bank].index.map((item) => item.bytes).sort((a, b) => a - b);
  const q = sizes('common-question'), m = sizes('common-mnemonic');
  return { questions: q.length, mnemonics: m.length, questionMedian: q[Math.floor(q.length / 2)],
    questionMax: q.at(-1), mnemonicMedian: m[Math.floor(m.length / 2)], mnemonicMax: m.at(-1) };
}

async function answerAndResume() {
  const storage = {}, calls = [];
  const cloud = async ({ data }) => { calls.push(data); return { result: clone(await main(data)) }; };
  let p = page(storage, cloud); p.onLoad({ mode: 'qa', count: '15' }); await ready(p);
  assert.equal(p.data.card.id, p.session.ids[0]);
  const first = p.data.card.id, group = p.data.card.group;
  p.handleChoice(tap({ index: p.data.card.options[0].index }));
  assert(p.data.revealed && p.data.answerSummary);
  const answer = clone(p.session.answers[first]);
  p.onUnload();
  p = page(storage, cloud); p.onLoad({ mode: 'qa' }); await ready(p);
  assert.equal(p.data.card.id, first); assert.equal(p.data.card.group, group);
  assert.deepEqual(p.session.answers[first], answer); assert(p.data.revealed && p.data.answerSummary);
  const current = p.session.ids[0];
  p.questionBuffer.configure({ roundId: `${p.session.key}:${p.questionBufferRound}`, version: p.content.version,
    mode: 'qa', scope: p.session.scope, ids: p.session.ids, index: 0 });
  const before = calls.filter((call) => call.action === 'hydrate').length;
  await Promise.all([p.questionBuffer.get(current), p.questionBuffer.get(current)]);
  assert.equal(calls.filter((call) => call.action === 'hydrate').length, before);
  p.handleNext(tap()); await ready(p);
  assert.equal(storage['common-sense-learning-v1'].records[first].signature, bootstrap.questions.find((item) => item.id === first).runtimeSignature);
  assert.equal(storage['common-sense-learning-v1'].sessions[p.session.key].answers[first].type, 'choice');
  bound(p); p.onUnload();
  return { answerRestored: true, resultStored: true, duplicateGetMerged: true };
}

async function longSequence() {
  const storage = {}, p = page(storage); p.onLoad({ mode: 'qa', count: '15' }); await ready(p);
  let peakCards = 0, peakBytes = 0, operations = 0;
  const groups = new Set(), scopes = new Set();
  for (let round = 0; round < 8; round += 1) {
    for (let i = 0; i < p.session.ids.length; i += 1) {
      await ready(p);
      const id = p.session.ids[i]; assert.equal(p.data.card.id, id);
      groups.add(p.data.card.group); scopes.add(p.data.card.scope);
      const stats = bound(p); peakCards = Math.max(peakCards, stats.cards); peakBytes = Math.max(peakBytes, stats.bytes);
      if (i % 3 === 0) p.handleReveal(); else p.handleChoice(tap({ index: p.data.card.options[0].index }));
      assert(p.data.revealed);
      p.handleNext(tap({ again: i % 4 === 0 ? 'yes' : '' })); operations++;
      await until(() => p.session.index === i + 1 && p.data.loadState === 'ready');
    }
    assert(p.data.completed); bound(p);
    if (round < 7) { p.handleNextGroup(); await ready(p); }
  }
  assert(operations >= 100); assert(groups.size > 1 && scopes.size > 1);
  const old = p.session.ids[0];
  p.questionBufferRound++; p.questionBuffer.configure({ roundId: `${p.session.key}:back:${p.questionBufferRound}`,
    version: p.content.version, mode: 'qa', scope: p.session.scope, ids: p.session.ids, index: 0 });
  assert(p.content.questions.find((item) => item.id === old).stub);
  await p.questionBuffer.get(old);
  assert(!p.content.questions.find((item) => item.id === old).stub);
  bound(p); p.onUnload();
  return { operations, groups: groups.size, scopes: scopes.size, peakCards, peakBytes, evictedReloaded: true };
}

async function modesAndMnemonic() {
  const results = {};
  for (const mode of ['daily', 'qa', 'exam', 'confusion', 'mnemonic']) {
    const p = page();
    if (mode === 'mnemonic') p.initializeQuestion({ mode }, false, mode);
    else p.onLoad({ mode });
    try { await ready(p); } catch (error) { throw new Error(`${mode}: ${p.data.loadState} ${p.data.notice}: ${error.message}`); }
    assert(p.session.ids.length > 0); bound(p);
    results[mode] = { first: p.session.ids[0], count: p.session.ids.length, reading: !!p.data.reading };
    if (mode === 'confusion') {
      p.handleNext(tap()); await until(() => p.data.isComparison);
      assert(p.data.comparison && p.data.phase === 'compare');
      p.handleComparisonNext(); await ready(p); assert(p.data.phase === 'recheck');
    }
    if (mode === 'mnemonic') {
      const memoryId = p.data.mnemonic.id;
      assert(p.data.mnemonic.phrases.every((phrase) => phrase.phrase));
      p.handleMnemonicTest(tap({ id: memoryId })); await ready(p);
      assert(p.data.selfTest && p.data.card);
      p.handleReveal(); assert(p.data.revealed);
      await p.handleReturnReading(); await ready(p);
      assert.equal(p.data.mnemonic.id, memoryId);
      assert(p.session.reviewMnemonicId === memoryId && p.session.reviewAnchors.length > 0);
      bound(p);
    }
    p.onUnload();
  }
  return results;
}

async function partialFailureAndRace() {
  const storage = {}, gate = deferred(); let fail = true, partial = true, held = false, hydrate = 0;
  const cloud = async ({ data }) => {
    if (data.action === 'hydrate') {
      hydrate++;
      if (fail) { fail = false; throw new Error('offline'); }
      if (!held && data.ids.length === 1) { held = true; await gate.promise; }
      const result = clone(await main(data));
      if (partial && data.ids.length > 1) { result.items = result.items.slice(0, 1); result.nextOffset = 1; }
      return { result };
    }
    return { result: clone(await main(data)) };
  };
  const p = page(storage, cloud); p.onLoad({ mode: 'qa', count: '15' });
  await until(() => p.data.loadState === 'error');
  assert.equal(p.session.index, 0); assert(!p.data.card);
  p.handleNextGroup(); await until(() => held); gate.resolve(); await ready(p);
  partial = true;
  for (let i = 0; i < 7; i += 1) { assert.equal(p.data.card.id, p.session.ids[i]); p.handleNext(tap()); await ready(p); bound(p); }
  assert(hydrate > 1);
  const pending = deferred(), delayedCloud = async ({ data }) => {
    if (data.action === 'hydrate') { await pending.promise; return { result: clone(await main(data)) }; }
    return { result: clone(await main(data)) };
  };
  const late = page({}, delayedCloud); late.onLoad({ mode: 'qa' }); await until(() => !!late.session && late.data.loadState === 'loading');
  late.onUnload(); pending.resolve(); await tick(); await tick();
  assert(!late.data.card && late.questionBuffer.stats().cards === 0);
  const roundGate = deferred(); let firstHydrate = true;
  const raceCloud = async ({ data }) => {
    if (data.action === 'hydrate' && firstHydrate) { firstHydrate = false; await roundGate.promise; }
    return { result: clone(await main(data)) };
  };
  const switched = page({}, raceCloud); switched.onLoad({ mode: 'qa' });
  await until(() => !!switched.session && !firstHydrate);
  switched.setData({ scope: bootstrap.scopeOrder[1] }); switched.begin('', '', '', true);
  await ready(switched); const newId = switched.data.card.id;
  roundGate.resolve(); await tick(); await tick();
  assert.equal(switched.data.card.id, newId);
  assert.equal(switched.data.card.scope, bootstrap.scopeOrder[1]);
  bound(switched); switched.onUnload();
  p.onUnload();
  return { retryRecovered: true, partialCompleted: true, hydrateCalls: hydrate,
    unloadIgnored: true, oldRoundIgnored: true };
}

async function validation() {
  const content = clone(bootstrap), api = { cloud: { callFunction: async ({ data }) => ({ result: clone(await main(data)) }) } };
  const adapter = createCommonCardAdapter(api, content, false);
  const item = (await adapter.fetch([content.questions[0].id], { version: content.version, mode: 'qa', scope: 'all' }))[0];
  const badApi = { cloud: { callFunction: async () => ({ result: { ok: true, version: content.version,
    items: [{ ...item, prompt: 'swapped' }], nextOffset: 1 } }) } };
  await assert.rejects(createCommonCardAdapter(badApi, content, false).fetch([item.id],
    { version: content.version, mode: 'qa', scope: 'all' }), { code: 'INCOMPLETE_BATCH' });
  const oldApi = { cloud: { callFunction: async () => ({ result: { ok: false, code: 'VERSION_CHANGED', message: 'version' } }) } };
  await assert.rejects(createCommonCardAdapter(oldApi, content, false).fetch([item.id],
    { version: content.version, mode: 'qa', scope: 'all' }), { code: 'VERSION_CHANGED' });
  const old = { schema: 1, records: {}, sessions: {}, summary: null };
  const storage = { 'common-sense-learning-v1': old };
  const p = page(storage); p.onLoad({ mode: 'qa' }); await ready(p);
  const first = p.session.ids[0]; p.handleReveal(); p.onUnload();
  const resumed = page(storage); resumed.onLoad({ mode: 'qa' }); await ready(resumed);
  assert.equal(resumed.session.ids[0], first); resumed.onUnload();
  const key = storage['common-sense-learning-v1'].summary.key;
  storage['common-sense-learning-v1'].sessions[key].version = 'incompatible-old-version';
  const incompatible = page(storage); incompatible.onLoad({ mode: 'qa' }); await ready(incompatible);
  assert.equal(incompatible.session.version, content.version);
  assert.equal(Object.keys(incompatible.session.answers).length, 0);
  assert(incompatible.data.notice.includes('旧组已失效'));
  incompatible.onUnload();
  return { changedBodyRejected: true, versionRejected: true, oldSchemaAccepted: true,
    incompatibleAnswerNotRebound: true };
}

(async () => {
  const result = { data: await identity(), initial: await answerAndResume(), longSequence: await longSequence(),
    modes: await modesAndMnemonic(), failures: await partialFailureAndRace(), validation: await validation() };
  console.log(JSON.stringify({ passed: true, ...result }));
})().catch((error) => { console.error(error); process.exitCode = 1; });
