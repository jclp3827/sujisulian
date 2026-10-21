#!/usr/bin/env node
// Offline transport/page tests. Synthetic responses, no real BDA/payment/photo upload.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const photo = path.resolve(__dirname, '../miniprogram/subpackages/photo');
const { createScfSegmentation, ENDPOINT } = require(path.join(photo, 'platform/scf-segmentation'));
const { inspectJpeg } = require(path.join(photo, 'core/jpeg'));
const { PAID_ENABLED } = require(path.join(photo, 'platform/paid'));
const sample = Buffer.from(require(path.join(photo, 'fixtures/transfer-sample')).base64, 'base64');
// The bundled delivery fixture carries an exam trailer; cloud input is a plain JPG.
const fixture = sample.subarray(0, inspectJpeg(sample).jpegLength);
const size = inspectJpeg(fixture);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const token = 'synthetic-only-test-token-at-least-32-characters';
const output = Buffer.alloc(33);
Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex').copy(output);
output.writeUInt32BE(size.width, 16); output.writeUInt32BE(size.height, 20);
output[24] = 8; output[25] = 6;
let checks = 0;
async function check(name, test) { await test(); checks++; console.log('PASS', name); }

function harness() {
  const disk = new Map([['/input.jpg', fixture]]), owned = new Set();
  let sequence = 0;
  const h = { disk, requests: [], downloads: [], removed: [], env: 'develop', mode: 'ok', downloadFails: false, modal: [], foregrounds: [], backgrounds: [] };
  const record = { path: '/input.jpg', bytes: fixture.length, sha256: hash(fixture), width: size.width, height: size.height };
  const manager = {
    statSync(p) { if (!disk.has(p)) throw new Error('missing'); return { size: disk.get(p).length, isFile: () => true }; },
    readFileSync(p) { if (!disk.has(p)) throw new Error('missing'); return Uint8Array.from(disk.get(p)).buffer; },
    unlink(o) { disk.delete(o.filePath); h.removed.push(o.filePath); o.success({}); }
  };
  h.wx = {
    getAccountInfoSync: () => ({ miniProgram: { envVersion: h.env } }),
    canIUse: () => true,
    getFileSystemManager: () => manager,
    arrayBufferToBase64: value => Buffer.from(value).toString('base64'),
    showModal(o) { o.success(h.modal.shift() || { confirm: false }); },
    getImageInfo(o) { o.success({ type: 'jpeg', width: size.width, height: size.height }); },
    setStorageSync() { throw new Error('test transport must not persist token or URLs'); },
    cloud: { callFunction() { throw new Error('test transport must not call old cloud function'); } },
    requestVirtualPayment() { throw new Error('test transport must not invoke payment'); },
    request(o) {
      h.requests.push(o);
      let completed = false;
      const done = () => {
        if (completed) return;
        completed = true;
        if (h.mode === 'timeout') o.fail({ errMsg: 'request:fail timeout' });
        else if (h.mode === 'unauthorized') o.success({ statusCode: 401, data: { ok: false, error: 'UNAUTHORIZED' } });
        else if (h.mode === 'denied') o.success({ statusCode: 502, data: { ok: false, error: 'AuthFailure.UnauthorizedOperation', requestId: 'denied-request-id' } });
        else o.success({ statusCode: 200, data: { ok: true, hasForeground: true,
          resultImageUrl: 'https://synthetic.cos.ap-guangzhou.myqcloud.com/result.png?signature=test-only', requestId: 'synthetic-request-id', expiresInSeconds: 1800 } });
        if (o.complete) o.complete();
      };
      if (h.mode !== 'deferred') queueMicrotask(done);
      h.completeRequest = done;
      return { abort() { if (!completed) { completed = true; h.aborted = true; o.fail({ errMsg: 'request:fail abort' }); if (o.complete) o.complete(); } } };
    },
    downloadFile(o) {
      h.downloads.push(o);
      queueMicrotask(() => {
        if (h.downloadFails) o.fail({ errMsg: 'downloadFile:fail url not in domain list' });
        else { const p = '/download-' + ++sequence; disk.set(p, output); o.success({ statusCode: 200, tempFilePath: p }); }
        if (o.complete) o.complete();
      });
      return { abort() {} };
    }
  };
  h.files = {
    async init() {},
    async read(p, max = Infinity) { const data = disk.get(p); if (!data || data.length > max) throw new Error('invalid file'); return data; },
    async writeVerified(data, extension) { const p = '/owned-' + ++sequence + '.' + extension; data = Buffer.from(data); disk.set(p, data); owned.add(p); return { path: p, bytes: data.length, sha256: hash(data) }; },
    async remove(p) { if (owned.delete(p)) { disk.delete(p); h.removed.push(p); } },
    async dispose() { for (const p of [...owned]) await this.remove(p); }
  };
  h.record = record;
  h.transport = createScfSegmentation(h.wx);
  return h;
}

function pageHarness(h, diagnostics) {
  let definition;
  const file = path.join(photo, 'process/index.js');
  const pixels = new Uint8Array(295 * 413 * 4); pixels.fill(255);
  h.raster = {
    async init() {}, async load() {}, draw() {}, clear() {}, dispose() {}, pixels: () => pixels,
    async normalize() { const p = '/normalize.jpg'; h.disk.set(p, fixture); return p; },
    async setForeground(p, expected) { assert.ok(h.disk.has(p)); h.foregrounds.push({ p, expected }); },
    setBackground(value) { h.backgrounds.push(value); }
  };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
    wx: h.wx, Page: p => definition = p, console, Date,
    require(name) {
      if (name === '../platform/files') return { createFiles: () => h.files, call: require(path.join(photo, 'platform/files')).call };
      if (name === '../platform/raster') return { createRaster: () => h.raster };
      return require(path.resolve(path.dirname(file), name));
    }
  });
  const page = Object.assign({}, definition, { data: JSON.parse(JSON.stringify(definition.data)),
    setData(data) { Object.assign(this.data, data); } });
  h.page = page;
  h.options = { diagnostics: diagnostics ? '1' : undefined };
  return page;
}

async function main() {
  await check('Node SCF entry carries current role credentials and returns the BDA URL/RequestId', async () => {
    const https = require('node:https');
    const { EventEmitter } = require('node:events');
    const originalRequest = https.request;
    const envKeys = ['PHOTO_API_TOKEN', 'TENCENTCLOUD_SECRETID', 'TENCENTCLOUD_SECRETKEY', 'TENCENTCLOUD_SESSIONTOKEN'];
    const previous = Object.fromEntries(envKeys.map(key => [key, process.env[key]]));
    process.env.PHOTO_API_TOKEN = token;
    process.env.TENCENTCLOUD_SECRETID = 'expired-id';
    process.env.TENCENTCLOUD_SECRETKEY = 'expired-key';
    process.env.TENCENTCLOUD_SESSIONTOKEN = 'expired-token';
    let calls = 0;
    https.request = (options, callback) => {
      calls++;
      assert.equal(options.hostname, 'bda.tencentcloudapi.com');
      assert.equal(options.headers['X-TC-Action'], 'SegmentPortraitPic');
      assert.equal(options.headers['X-TC-Token'], 'current-role-token');
      assert.match(options.headers.Authorization, /^TC3-HMAC-SHA256 Credential=current-role-id\//);
      const req = new EventEmitter();
      req.end = body => {
        assert.deepEqual(JSON.parse(body), { Image: fixture.toString('base64'), RspImgType: 'url', Scene: 'GEN' });
        queueMicrotask(() => {
          const res = new EventEmitter(); res.statusCode = 200; callback(res);
          res.emit('data', Buffer.from(JSON.stringify({ Response: { RequestId: 'offline-server-id', HasForeground: true,
            ResultImageUrl: 'https://synthetic.cos.ap-guangzhou.myqcloud.com/result.png' } })));
          res.emit('end');
        });
      };
      return req;
    };
    try {
      const { main_handler } = require('../scf/photo-segment');
      const event = { httpMethod: 'POST', headers: { 'X-Photo-Token': token }, body: JSON.stringify({ imageBase64: fixture.toString('base64') }) };
      assert.equal((await main_handler({ ...event, headers: {} }, {})).statusCode, 401);
      assert.equal(calls, 0);
      const result = await main_handler(event, { TENCENTCLOUD_SECRETID: 'current-role-id', TENCENTCLOUD_SECRETKEY: 'current-role-key', TENCENTCLOUD_SESSIONTOKEN: 'current-role-token' });
      assert.equal(result.statusCode, 200); assert.equal(calls, 1);
      assert.equal(JSON.parse(result.body).requestId, 'offline-server-id');
      assert.equal(JSON.parse(result.body).resultImageUrl, 'https://synthetic.cos.ap-guangzhou.myqcloud.com/result.png');
    } finally {
      https.request = originalRequest;
      for (const key of envKeys) { if (previous[key] === undefined) delete process.env[key]; else process.env[key] = previous[key]; }
    }
  });
  await check('release fails closed; missing token and changed input never send a request', async () => {
    const h = harness(); h.env = 'release';
    await assert.rejects(h.transport.segment(h.record, token, h.files), error => error.code === 'TEST_ONLY');
    h.env = 'develop';
    await assert.rejects(h.transport.segment(h.record, '', h.files), error => error.code === 'TOKEN_REQUIRED');
    await assert.rejects(h.transport.segment({ ...h.record, sha256: 'a'.repeat(64) }, token, h.files), error => error.code === 'INPUT_CHANGED');
    assert.equal(h.requests.length, 0); assert.equal(h.downloads.length, 0);
  });
  await check('SCF inline contract, full file read-back and download-only retries', async () => {
    const h = harness(); h.downloadFails = true;
    await assert.rejects(h.transport.segment(h.record, token, h.files), error => error.code === 'DOWNLOAD_FAILED' && error.requestId === 'synthetic-request-id');
    assert.equal(h.requests.length, 1);
    h.downloadFails = false;
    const result = await h.transport.segment(h.record, token, h.files);
    assert.equal(h.requests.length, 1); assert.equal(h.downloads.length, 2);
    const sent = h.requests[0];
    assert.equal(sent.url, ENDPOINT); assert.equal(sent.method, 'POST'); assert.equal(sent.header['x-photo-token'], token);
    assert.deepEqual(sent.data, { imageBase64: fixture.toString('base64') });
    assert.equal(result.record.sha256, hash(output)); assert.equal(result.width, size.width); assert.equal(result.height, size.height);
    assert.ok(!h.disk.has('/download-1'));
    const clock = Date.now;
    try { Date.now = () => clock() + 30 * 60 * 1000;
      await assert.rejects(h.transport.segment(h.record, token, h.files), error => error.code === 'RESULT_EXPIRED');
    } finally { Date.now = clock; }
    assert.equal(h.requests.length, 1);
  });
  await check('concurrent/unknown requests cannot resubmit; errors preserve RequestId', async () => {
    const h = harness(); h.mode = 'deferred';
    const pending = h.transport.segment(h.record, token, h.files);
    await assert.rejects(h.transport.segment(h.record, token, h.files), error => error.code === 'OUTCOME_UNKNOWN');
    h.mode = 'timeout'; h.completeRequest();
    await assert.rejects(pending, error => error.code === 'OUTCOME_UNKNOWN');
    await assert.rejects(h.transport.segment(h.record, token, h.files), error => error.code === 'OUTCOME_UNKNOWN');
    assert.equal(h.requests.length, 1);
    const denied = harness(); denied.mode = 'denied';
    await assert.rejects(denied.transport.segment(denied.record, token, denied.files), error => error.code === 'AuthFailure.UnauthorizedOperation' && error.requestId === 'denied-request-id');
    assert.equal(denied.downloads.length, 0);
  });
  await check('wrong token may be corrected; malformed PNG never becomes a working file', async () => {
    const h = harness(); h.mode = 'unauthorized';
    await assert.rejects(h.transport.segment(h.record, token, h.files), error => error.code === 'UNAUTHORIZED');
    h.mode = 'ok';
    const saved = Buffer.from(output); output[16] ^= 1;
    try { await assert.rejects(h.transport.segment(h.record, token, h.files), error => error.code === 'RESULT_DIMENSIONS_MISMATCH'); }
    finally { saved.copy(output); }
    assert.equal(h.requests.length, 2);
    assert.equal([...h.disk.keys()].filter(p => p.startsWith('/owned-')).length, 0);
    const result = await h.transport.segment(h.record, token, h.files);
    assert.ok(result.record.path); assert.equal(h.requests.length, 2);
  });
  await check('obsolete token-driven page actions stay removed from the product UI', async () => {
    const h = harness(), p = pageHarness(h, true);
    await p.onLoad(h.options); await p.onReady(); await p.loadSource(fixture);
    assert.equal(typeof p.configureScfTest, 'undefined');
    assert.equal(typeof p.testScfSegmentation, 'undefined');
    assert.equal(h.requests.length, 0);
    p.onUnload();
    assert.equal(PAID_ENABLED, false);
  });
  console.log(JSON.stringify({ passed: true, checks, realBda: false, realPayment: false, cloudChanged: false, previewUploaded: false }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
