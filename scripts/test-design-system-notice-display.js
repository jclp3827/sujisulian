#!/usr/bin/env node
// Isolated display-state checks. No real wx, Storage, engine, or network is loaded.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = process.env.DS_NOTE_SOURCE || path.join(__dirname, '../miniprogram/subpackages/note/practice/index.js');
let definition;
const delayedImageResolvers = [];
const runtimeResolvers = [];
vm.runInNewContext(fs.readFileSync(source, 'utf8'), {
  Page(value) { definition = value; },
  require(id) {
    if (id.endsWith('/note-assets')) return { resolveNoteImage: (_wx, src) => src === 'delayed'
      ? new Promise((resolve) => delayedImageResolvers.push(resolve)) : Promise.resolve('') };
    if (id.endsWith('/cloud-practice-runtime')) return { createCloudPractice: (_wx, options) => options.fresh
      ? new Promise((resolve) => runtimeResolvers.push(resolve)) : Promise.resolve({ content: {} }) };
    return {};
  },
  wx: {},
}, { filename: source });

function page() {
  return {
    ...definition,
    data: { ...definition.data, state: 'question', sessionId: 'isolated-session' },
    setData(values) { Object.assign(this.data, values); },
  };
}

async function main() {
  const operation = page();
  assert.equal(operation.run(() => { throw new Error('操作暂时失败'); }), false);
  assert.equal(operation.data.state, 'question');
  assert.equal(operation.data.noticeIsError, true);
  assert.equal(operation.data.notice, '操作暂时失败');

  const expired = page();
  assert.equal(expired.run(() => {
    const error = new Error('内容已更新');
    error.code = 'EXPIRED';
    throw error;
  }), false);
  assert.equal(expired.data.state, 'expired');
  assert.equal(expired.data.noticeIsError, false);

  const image = page();
  image.data.notice = '普通说明';
  image.runtime = { engine: { setImageReady() {} } };
  image.prepareImages({ instanceId: 'isolated-item', images: [{ id: 'illustration', src: 'fixture' }] });
  await new Promise(setImmediate);
  assert.equal(image.data.imagesFailed, true);
  assert.equal(image.data.imageNotice, '图片未加载完整，可重试或先查阅笔记');
  assert.equal(image.data.notice, '普通说明');

  const expiredReturn = page();
  expiredReturn.loaded = true;
  expiredReturn.data.imageNotice = '旧题图片失败';
  expiredReturn.runtime = { engine: { getSession() { return null; } } };
  expiredReturn.onShow();
  assert.equal(expiredReturn.data.state, 'expired');
  assert.equal(expiredReturn.data.imageNotice, '');

  const reloading = page();
  reloading.data.imageNotice = '旧题图片失败';
  await reloading.begin();
  assert.equal(reloading.data.imageNotice, '');

  const lateImage = page();
  lateImage.runtime = { engine: { setImageReady() {} } };
  lateImage.options = {};
  lateImage.prepareImages({ instanceId: 'old-item', images: [{ id: 'old', src: 'delayed' }] });
  const newTask = lateImage.begin(true);
  delayedImageResolvers.shift()('');
  await new Promise(setImmediate);
  assert.equal(lateImage.data.state, 'loading');
  assert.equal(lateImage.imageInstanceId, '');
  assert.equal(lateImage.data.imageNotice, '');
  assert.equal(lateImage.data.imagesFailed, false);
  runtimeResolvers.shift()({ content: {} });
  await newTask;
  assert.equal(lateImage.data.imageNotice, '');
  assert.equal(lateImage.data.imagesFailed, false);

  const staleStub = page();
  const session = { id: 'new-session', kind: 'application', scope: {}, index: 0,
    items: [{ resourceId: 'new-item', stub: true }] };
  staleStub.runtime = { content: { version: 'isolated' }, engine: {
    setImageReady() {}, getSession() { return session; },
  } };
  staleStub.practiceBuffer = { configure() {}, get() { return new Promise(() => {}); } };
  staleStub.prepareImages({ instanceId: 'old-item', images: [{ id: 'old', src: 'delayed' }] });
  staleStub.render(session);
  delayedImageResolvers.shift()('');
  await new Promise(setImmediate);
  assert.equal(staleStub.data.state, 'loading');
  assert.equal(staleStub.data.imageNotice, '');
  assert.equal(staleStub.data.imagesFailed, false);

  const commonSource = path.join(__dirname, '../miniprogram/subpackages/common-sense/learning/index.js');
  let commonDefinition;
  vm.runInNewContext(fs.readFileSync(commonSource, 'utf8'), {
    Page(value) { commonDefinition = value; },
    require() { return {}; },
    wx: {},
  }, { filename: commonSource });
  const common = {
    ...commonDefinition,
    data: { ...commonDefinition.data, loadState: 'error', notice: '旧加载错误' },
    setData(values) { Object.assign(this.data, values); },
    session: { kind: 'reading', ids: ['stub'], index: 0, key: 'isolated', flow: {}, scope: 'all' },
    content: { version: 'isolated', mnemonics: [{ id: 'stub', stub: true }], questions: [] },
    questionBuffer: { configure() {}, get() { return new Promise(() => {}); } },
  };
  common.renderSession();
  assert.equal(common.data.loadState, 'loading');
  assert.equal(common.data.notice, '');

  process.stdout.write(JSON.stringify({ passed: 8, scope: 'isolated display state; no real business events or Storage' }) + '\n');
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
