// Synthetic inputs and local platform doubles only. Never invokes cloud or payment.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const photo = '../miniprogram/subpackages/photo/';
const { profiles, regions } = require(photo + 'profiles');
const { createProcessor } = require(photo + 'core/process');
const { inspectJpeg } = require(photo + 'core/jpeg');
const { sha256, sha256Async } = require(photo + 'core/sha256');
const { createFiles, call } = require(photo + 'platform/files');
const { createController } = require(photo + 'process/controller');
const notice = require(photo + 'profiles/usage-notice');
const digest = b => crypto.createHash('sha256').update(b).digest('hex');
const baseline = 'dabc02abab9d6264f99cd518ec517f1e438203f6';

function baselineLoader() {
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const source = execFileSync('git', ['show', baseline + ':' + file], { cwd: root, encoding: 'utf8' });
    const module = { exports: {} }; cache.set(file, module);
    const localRequire = name => {
      if (!name.startsWith('.')) return require(name);
      let target = path.posix.normalize(path.posix.join(path.posix.dirname(file), name));
      if (!target.endsWith('.js')) target += '.js';
      return load(target);
    };
    vm.runInNewContext('(function(require,module,exports){' + source + '\n})', { setTimeout, clearTimeout, console, Uint8Array, ArrayBuffer, DataView, Date, Buffer }, { filename: file })(localRequire, module, module.exports);
    return module.exports;
  }
  return load;
}

function environment(source, fileFactory, controllerFactory) {
  const disk = new Map([['source', Buffer.from(source)]]);
  const counters = { reads: 0, writes: 0, metadata: 0, cloud: 0 };
  let corrupt = false;
  const fsApi = {
    mkdir(o) { o.success({}); }, readdir(o) { o.success({ files: [] }); },
    stat(o) { const b = disk.get(o.path); if (!b) return o.fail({}); o.success({ stats: { size: b.length, isFile: () => true } }); },
    readFile(o) { counters.reads++; const b = Buffer.from(disk.get(o.filePath)); if (corrupt && o.filePath !== 'source') b[0] ^= 1; o.success({ data: b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) }); },
    writeFile(o) { counters.writes++; disk.set(o.filePath, Buffer.from(new Uint8Array(o.data))); o.success({}); },
    unlink(o) { disk.delete(o.filePath); o.success({}); }
  };
  const wx = {
    env: { USER_DATA_PATH: '/local' }, getFileSystemManager: () => fsApi,
    getAccountInfoSync: () => ({ miniProgram: { envVersion: 'develop' } }),
    getWindowInfo: () => ({ windowWidth: 375, windowHeight: 812 }),
    getImageInfo(o) { counters.metadata++; o.success({ width: 900, height: 1200, type: 'jpeg', orientation: 'up' }); },
    nextTick: cb => cb(), showLoading() {}, hideLoading() {},
    request() { counters.cloud++; throw Error('Cloud forbidden'); },
  };
  const raster = { async init() {}, configure() {}, clear() {}, draw() {}, dispose() {},
    async load(p, expected, info) {
      if (!info) info = await new Promise(resolve => wx.getImageInfo({ src: p, success: resolve }));
      assert.deepEqual([info.width, info.height], [expected.width, expected.height]);
    }
  };
  const adapters = { call, createFiles: fileFactory, createRaster: () => raster,
    createPreviewPaid: () => ({ available: async () => false, summary: () => ({ remaining: 0, paid: false, paymentPending: false }), hasEntitlement: () => false, evidence: () => [] }) };
  const controller = controllerFactory(wx, adapters, Date);
  const page = Object.assign({}, controller, { data: { ...controller.data }, setData(v, cb) { Object.assign(this.data, v); if (cb) cb(); } });
  return { wx, page, disk, counters, setCorrupt: () => { corrupt = true; } };
}

(async () => {
  // Node accepts directory/index.js imports; the WeChat module loader does not.
  function checkImports(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) checkImports(file);
      else if (entry.name.endsWith('.js')) {
        const text = fs.readFileSync(file, 'utf8');
        for (const match of text.matchAll(/require\(['"](\.[^'"]+)['"]\)/g)) {
          const target = path.resolve(path.dirname(file), match[1]);
          assert.ok([target + '.js', target + '.json', target].some(p => fs.existsSync(p) && fs.statSync(p).isFile()),
            'WeChat requires a file path: ' + path.relative(root, file) + ' -> ' + match[1]);
        }
      }
    }
  }
  checkImports(path.join(root, 'miniprogram/subpackages/photo'));
  for (const n of [0, 1, 55, 56, 63, 64, 65, 65535, 65536, 65537, 1048576]) {
    const b = crypto.randomBytes(n); assert.equal(sha256(b), digest(b)); assert.equal(await sha256Async(b), digest(b));
  }
  let checks = 0;
  await assert.rejects(sha256Async(new Uint8Array(200000), () => { if (++checks === 2) throw Error('cancelled'); }), /cancelled/);
  assert.equal(checks, 2);
  const filesOnly = environment(Buffer.from('original'), createFiles, createController);
  const fileSession = createFiles(filesOnly.wx, 'process-v1'); await fileSession.init();
  const backing = Uint8Array.from([99, 10, 20, 30, 88]);
  const slice = await fileSession.writeVerified(backing.subarray(1, 4), 'jpg');
  assert.deepEqual(Array.from(await fileSession.read(slice.path)), [10, 20, 30]);
  assert.equal(slice.sha256, digest(Buffer.from([10, 20, 30])));
  await fileSession.remove(slice.path);
  setTimeout(() => fileSession.dispose(), 0);
  await assert.rejects(fileSession.writeVerified(new Uint8Array(200000), 'jpg', undefined, { cooperative: true }), /页面已关闭/);
  assert.equal(filesOnly.disk.size, 1, 'unload during hash cleans owned snapshot but preserves input');

  assert.deepEqual(regions.map(r => r.label), ['国考', '四川', '军队文职']);
  const internalNeimenggu = profiles.find(p => p.id === require(photo + 'profiles/neimenggu').id);
  assert.ok(internalNeimenggu, 'hidden Inner Mongolia profile must remain available internally');
  const template = fs.readFileSync(path.join(root, 'miniprogram/subpackages/photo/process/index.wxml'), 'utf8');
  assert.match(template, /class="disclaimer-link"[^>]*bindtap="showDisclaimer"/);
  assert.match(template, /wx:if="\{\{disclaimerOpen\}\}"/);
  assert.match(template, /bindtap="closeDisclaimer"/);
  const configuredExams = [...regions, { label: '内蒙古（内部候选）', profileId: internalNeimenggu.id }];
  const candidates = [];
  for (const region of configuredExams) {
    const p = createProcessor(region.profileId), { width, height } = p.profile;
    const data = new Uint8Array(width * height * 4).fill(255);
    const output = p.createCandidate(data, true), info = inspectJpeg(output.data);
    assert.equal(info.tail, p.profile.tailHex); assert.equal(info.scans, 1);
    candidates.push({ label: region.label, width, height, quality: p.profile.quality,
      units: p.profile.densityUnits === undefined ? 1 : p.profile.densityUnits, density: p.profile.dpi,
      jpg: Buffer.from(output.data).toString('base64') });
  }
  execFileSync('python3', ['-c', `
import json,sys,base64,io
from PIL import Image,JpegImagePlugin
for c in json.load(sys.stdin):
 im=Image.open(io.BytesIO(base64.b64decode(c['jpg'])));im.load()
 assert im.size==(c['width'],c['height'])
 assert JpegImagePlugin.get_sampling(im)==2
 assert im.info['jfif_unit']==c['units'] and im.info['jfif_density']==(c['density'],c['density'])
 out=io.BytesIO();Image.new('RGB',(8,8)).save(out,format='JPEG',quality=c['quality'])
 assert im.quantization==Image.open(io.BytesIO(out.getvalue())).quantization
`], { input: JSON.stringify(candidates) });

  const source = execFileSync('python3', ['-c', `
from PIL import Image
import io,sys,random
im=Image.frombytes('RGB',(900,1200),random.Random(771).randbytes(900*1200*3))
b=io.BytesIO();im.save(b,format='JPEG',quality=100);sys.stdout.buffer.write(b.getvalue())
`], { maxBuffer: 8 * 1024 * 1024 });
  const load = baselineLoader();
  const oldFiles = load('miniprogram/subpackages/photo/platform/files.js').createFiles;
  const oldController = load('miniprogram/subpackages/photo/process/controller.js').createController;
  const measurements = [];
  for (const [version, factory, controller] of [['main', oldFiles, oldController], ['candidate', createFiles, createController]]) {
    const env = environment(source, factory, controller); await env.page.onLoad({ profile: regions[0].profileId }); await env.page.onReady();
    let ticks = 0; const interval = setInterval(() => ticks++, 1), started = performance.now();
    await env.page.loadSourcePath('source');
    clearInterval(interval);
    const measurement = { version, milliseconds: Math.round(performance.now() - started), ...env.counters,
      timerTicks: ticks, sourceBytes: source.length };
    assert.equal(env.page.data.hasSource, true); assert.equal(env.page.data.stage, 'adjust');
    assert.equal(env.page._source.record.sha256, digest(source)); assert.equal(env.counters.cloud, 0);
    const record = env.page._source.record;
    if (version === 'candidate') {
      assert.equal(env.counters.writes, 1); assert.equal(env.counters.reads, 2); assert.equal(env.counters.metadata, 1);
      assert.ok(ticks > 0, 'large source hash must yield to timers');
      const before = { ...env.counters }; env.page.showDisclaimer(); assert.equal(env.page.data.disclaimerOpen, true);
      env.page.closeDisclaimer(); assert.equal(env.page.data.disclaimerOpen, false);
      assert.equal(env.page._source.record, record); assert.deepEqual(env.counters, before);
      assert.deepEqual(env.page.data.usageNotice, notice);
      await env.page.clearSource(); assert.equal(env.disk.size, 1);
      env.setCorrupt(); await assert.rejects(env.page.loadSourcePath('source'), /字节不一致/); assert.equal(env.disk.size, 1);
    }
    measurements.push(measurement);
    env.page.onUnload(); assert.ok(env.disk.has('source'));
  }
  for (const label of ['内蒙古（内部候选）', '军队文职']) {
    const region = configuredExams.find(r => r.label === label), env = environment(source, createFiles, createController);
    await env.page.onLoad({ profile: region.profileId });
    const militaryAi = label === '军队文职';
    assert.equal(env.page.data.aiAllowed, militaryAi);
    if (militaryAi) {
      await env.page.onReady(); await env.page.loadSourcePath('source');
      const record = env.page._source.record;
      env.page.data.aiAvailable = false;
      env.page.selectAiBackgroundMode(); assert.equal(env.page.data.aiModeSelected, false);
      env.page.data.aiAvailable = true;
      env.page.selectAiBackgroundMode(); assert.equal(env.page.data.aiModeSelected, true);
      assert.equal(env.counters.cloud, 0, 'selecting AI mode must not invoke the service');
      let confirmations = 0;
      env.wx.showModal = options => { confirmations++; options.success({ confirm: false }); };
      await env.page.chooseAiBackground();
      assert.equal(confirmations, 1); assert.equal(env.counters.cloud, 0);
      assert.equal(env.page._ai, null); assert.equal(env.page._source.record, record);
      env.page.chooseOriginalBackground(); assert.equal(env.page.data.aiModeSelected, false);
      assert.equal(env.page.data.background, 'original');
    } else {
      env.page.chooseAiBackground(); assert.equal(env.counters.cloud, 0);
    }
    env.page.onUnload();
  }
  console.log(JSON.stringify({ passed: true, regions: regions.length, hiddenNeimenggu: true, disclaimerLinkBound: true, independentJpegs: candidates.length, hashVectors: 11,
    retainedSnapshot: true, corruptCopyRejected: true, disclaimerPreservesSource: true,
    militaryAiEntryEnabled: true, militaryAiConsentCancellation: true, hiddenNeimengguAiClosed: true,
    localBenchmark: measurements, deviceTested: false, cloudCalls: 0 }));
})().catch(error => { console.error(error); process.exitCode = 1; });
