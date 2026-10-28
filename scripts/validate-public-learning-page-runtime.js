#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { main: learningBankMain } = require('../cloudfunctions/learningBank');

const root = path.resolve(__dirname, '../miniprogram');
const storage = {};
const transferBudget = 120 * 1024;

function page(relativePath) {
  const filename = path.join(root, relativePath);
  let definition;
  const transfers = [];
  const navigation = [];
  const wx = {
    getAccountInfoSync: () => ({ miniProgram: { envVersion: 'release' } }),
    getStorageSync: (key) => storage[key],
    setStorageSync: (key, value) => { storage[key] = value; },
    cloud: { callFunction: async ({ name, data }) => {
      assert.equal(name, 'learningBank');
      return { result: await learningBankMain(data) };
    } },
    setNavigationBarTitle() {},
    navigateTo: (options) => navigation.push(options.url),
    switchTab: (options) => navigation.push(options.url),
    pageScrollTo() {},
    nextTick() {},
    createSelectorQuery: () => ({ in() { return this; }, select() { return this; },
      boundingClientRect() { return this; }, exec() {} }),
  };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    require: createRequire(filename), Page: (value) => { definition = value; },
    wx, console, Buffer, setTimeout, clearTimeout,
  }, { filename });
  return {
    ...definition,
    data: JSON.parse(JSON.stringify(definition.data)),
    transfers,
    navigation,
    setData(values) {
      transfers.push(Buffer.byteLength(JSON.stringify(values)));
      Object.assign(this.data, values);
    },
  };
}

function tap(dataset) { return { type: 'tap', currentTarget: { dataset } }; }
function assertTransfer(pageName, instance) {
  const largest = Math.max(0, ...instance.transfers);
  assert(largest < transferBudget, `${pageName} sent ${largest} bytes in one setData`);
  return largest;
}

async function until(predicate) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setImmediate(resolve));
  }
  throw new Error('Async page did not settle');
}

async function validate() {
const results = [];
for (const kind of ['basic', 'method', 'exam']) {
  const instance = page('subpackages/note/memory/index.js');
  instance.onLoad({ kind });
  await until(() => instance.data.state !== 'loading');
  assert(['card', 'complete'].includes(instance.data.state), `${kind}: ${instance.data.notice}`);
  assert(instance.data.card);
  results.push({ page: `note-${kind}`, cards: instance.cards.length, maxTransferBytes: assertTransfer(kind, instance) });
}

const application = page('subpackages/note/practice/index.js');
application.onLoad({ kind: 'application' });
await until(() => application.data.state !== 'loading');
assert.equal(application.data.state, 'question');
assert(application.data.card);
results.push({ page: 'note-application', questions: application.runtime.content.cloudQueue.ids.length,
  maxTransferBytes: assertTransfer('note-application', application) });

for (const mode of ['daily', 'qa', 'guide', 'confusion', 'exam']) {
  const instance = page('subpackages/common-sense/learning/index.js');
  instance.onLoad({ mode });
  await until(() => instance.data.loadState !== 'loading');
  assert(instance.data.active, `${mode}: ${instance.data.notice}`);
  assert(mode === 'guide' ? instance.data.guideCard : instance.data.card, `${mode}: no visible card`);
  results.push({ page: `common-${mode}`, total: instance.data.total,
    maxTransferBytes: assertTransfer(`common-${mode}`, instance) });
}

const noteHome = page('pages/note/index/index.js');
noteHome.onLoad();
noteHome.handlePracticeTap(tap({ kind: 'basic' }));
noteHome.onShow();
noteHome.handlePracticeTap(tap({ kind: 'application' }));
assert.equal(noteHome.navigation.length, 2);
assert(noteHome.navigation[1].includes('/practice/index?kind=application'));

const commonHome = page('pages/common-sense/index.js');
commonHome.onLoad();
commonHome.handleFeature(tap({ mode: 'qa' }));
commonHome.onShow();
commonHome.handleFeature(tap({ mode: 'guide' }));
assert.equal(commonHome.navigation.length, 2);
assert(commonHome.navigation[1].includes('mode=guide'));

console.log(JSON.stringify({ passed: true, releasePages: results, returnNavigation: true }));
}
validate().catch((error) => { console.error(error); process.exitCode = 1; });
