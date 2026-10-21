#!/usr/bin/env node
// Offline picker callbacks and page lifecycle; no private photos or network calls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const photo = path.resolve(__dirname, '../miniprogram/subpackages/photo');
let checks = 0;
async function check(name, fn) { await fn(); checks++; console.log('PASS', name); }
function harness(platform = 'devtools') {
  const timers = new Map(), calls = [];
  let id = 0;
  const wx = { env: { USER_DATA_PATH: '/synthetic' }, getFileSystemManager: () => ({}),
    getDeviceInfo: () => ({ platform }), canIUse: () => true };
  for (const method of ['chooseImage', 'chooseMedia', 'chooseMessageFile']) {
    wx[method] = options => calls.push({ method, options });
  }
  const file = path.join(photo, 'platform/files.js'), module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { module, wx, Uint8Array, Set,
    require: name => require(path.resolve(path.dirname(file), name)),
    setTimeout(fn) { const key = ++id; timers.set(key, fn); return key; },
    clearTimeout(key) { timers.delete(key); } });
  return { wx, calls, timers, files: module.exports.createFiles(wx, 'process-v1') };
}
function pageHarness(files) {
  let definition;
  const file = path.join(photo, 'process/index.js');
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { wx: {}, Page: p => definition = p,
    require: name => require(path.resolve(path.dirname(file), name)) });
  const p = Object.assign({}, definition, { _alive: true, _locked: false, _files: files,
    data: Object.assign({}, definition.data, { allowed: true, ready: true, canvasReady: true, canAlbum: true, hasSource: true }),
    setData(value) { Object.assign(this.data, value); } });
  p.loaded = [];
  p.loadSourcePath = async selected => p.loaded.push(selected);
  return p;
}
async function main() {
  await check('DevTools selects images while devices retain media support', async () => {
    for (const [platform, method] of [['devtools', 'chooseImage'], ['ios', 'chooseMedia'], ['android', 'chooseMedia']]) {
      const h = harness(platform), pending = h.files.choosePath(true);
      assert.equal(h.calls[0].method, method);
      assert.deepEqual(Array.from(h.calls[0].options.sizeType), ['original', 'compressed']);
      h.calls[0].options.success({ tempFilePaths: ['/chosen.jpg'], tempFiles: [{ tempFilePath: '/chosen.jpg' }] });
      assert.equal(await pending, '/chosen.jpg'); assert.equal(h.timers.size, 0);
    }
    const h = harness(); delete h.wx.chooseImage;
    const pending = h.files.choosePath(true);
    assert.equal(h.calls[0].method, 'chooseMedia');
    h.calls[0].options.fail({ errMsg: 'chooseMedia:fail cancel' });
    await assert.rejects(pending, e => /cancel/.test(e.errMsg));
  });
  await check('Cancel releases the page without replacing the previous photo; late callbacks are ignored', async () => {
    const h = harness(), p = pageHarness(h.files), first = p.chooseAlbum();
    assert.equal(p.data.busy, true); assert.equal(p.data.pickerOpen, true);
    assert.match(p.data.phaseLabel, /打开相册/);
    p.cancelPhotoSelection(); await first;
    assert.equal(p.data.busy, false); assert.equal(p._locked, false); assert.equal(p.data.pickerOpen, false);
    assert.equal(p.data.hasSource, true); assert.equal(p.data.notice, '');
    const second = p.chooseAlbum();
    h.calls[0].options.success({ tempFilePaths: ['/late.jpg'] });
    await Promise.resolve(); assert.equal(p.loaded.length, 0); assert.equal(p.data.busy, true);
    h.calls[1].options.success({ tempFilePaths: ['/current.jpg'] }); await second;
    assert.deepEqual(p.loaded, ['/current.jpg']); assert.equal(p.data.busy, false);
  });
  await check('A missing native callback recovers with a visible error and allows retry', async () => {
    const h = harness(), p = pageHarness(h.files), first = p.chooseAlbum();
    [...h.timers.values()][0](); await first;
    assert.match(p.data.notice, /选图窗口未响应/); assert.equal(p.data.busy, false); assert.equal(p.data.pickerOpen, false);
    const second = p.chooseAlbum(); h.calls[1].options.fail({ errMsg: 'chooseImage:fail cancel' }); await second;
    assert.equal(p.data.busy, false); assert.equal(h.timers.size, 0);
  });
  await check('Chat files share cancellation, concurrent requests are blocked, and disposal settles pending selection', async () => {
    const h = harness(), first = h.files.choosePath(false);
    assert.equal(h.calls[0].method, 'chooseMessageFile');
    await assert.rejects(h.files.choosePath(true), /完成或取消/);
    const rejected = assert.rejects(first, /cancel/); await h.files.dispose(); await rejected;
    h.calls[0].options.success({ tempFiles: [{ path: '/late.jpg' }] });
    assert.equal(h.timers.size, 0);
    await assert.rejects(h.files.choosePath(true), /页面已关闭/);
  });
  console.log('Photo picker validation passed:', checks, 'groups');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
