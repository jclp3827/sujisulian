#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { createProcessor } = require("../miniprogram/subpackages/photo/core/process");
const { inspectJpeg } = require("../miniprogram/subpackages/photo/core/jpeg");
const { packJpg } = require("../miniprogram/subpackages/photo/core/zip-store");
const { profiles, regions } = require("../miniprogram/subpackages/photo/profiles");
const { createController } = require("../miniprogram/subpackages/photo/process/controller");

async function main() {
  const sichuan = profiles.find(profile => profile.id === regions[1].profileId);
  const national = profiles.find(profile => profile.label === "国家公务员考试");
  assert.deepEqual(regions.map(region => region.label), ["国考", "四川"]);
  assert.equal(regions[1].profileId, sichuan.id);
  assert.equal(sichuan.quality, 40);
  assert.deepEqual([sichuan.width, sichuan.height, sichuan.sourceMinBytes], [295, 413, 10241]);
  assert.equal(sichuan.tailHex, "ff02000873636b737a78");
  const rgba = new Uint8Array(295 * 413 * 4);
  for (let i = 0; i < rgba.length; i += 4) rgba.set([255, 255, 255, 255], i);
  const sc = createProcessor(sichuan.id), gwy = createProcessor(national.id);
  const jpg = Buffer.from(sc.createCandidate(rgba, true).data);
  const nationalJpg = Buffer.from(gwy.createCandidate(rgba, true).data);
  assert.deepEqual(jpg.subarray(0, -10), nationalJpg.subarray(0, -10));
  assert.equal(inspectJpeg(jpg).tail, sichuan.tailHex);
  assert.throws(() => gwy.verifyCandidate(jpg), /未通过/);
  assert.throws(() => sc.verifyCandidate(nationalJpg), /未通过/);

  const base = jpg.subarray(0, -10);
  function paddedSource(size) {
    const extra = size - base.length;
    assert.ok(extra >= 4 && extra <= 65537);
    const marker = Buffer.alloc(extra);
    marker[0] = 0xff; marker[1] = 0xfe;
    marker.writeUInt16BE(extra - 2, 2);
    return Buffer.concat([base.subarray(0, 2), marker, base.subarray(2)]);
  }
  assert.throws(() => sc.inspectSource(paddedSource(10240)), /10 KB/);
  assert.equal(sc.inspectSource(paddedSource(10241)).width, 295);

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "photo-sichuan-test-"));
  try {
    const zipPath = path.join(temp, "photo.zip");
    fs.writeFileSync(zipPath, Buffer.from(packJpg(jpg, "报名照片.jpg")));
    const extracted = execFileSync("python3", ["-c", "import sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); assert z.namelist()==['报名照片.jpg']; assert z.testzip() is None; sys.stdout.buffer.write(z.read('报名照片.jpg'))", zipPath]);
    assert.deepEqual(extracted, jpg);
    sc.verifyCandidate(extracted);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }

  const wx = { getWindowInfo: () => ({ windowWidth: 375, windowHeight: 667 }),
    getAccountInfoSync: () => ({ miniProgram: { envVersion: "develop" } }),
    canIUse: () => true, chooseImage() {}, chooseMessageFile() {}, shareFileMessage() {} };
  let picked = false;
  const adapters = {
    createFiles: () => ({ async init() {}, async remove() {}, async dispose() {}, async choosePhoto() { picked = true; } }),
    createRaster: () => ({ async init() {}, clear() {}, dispose() {} }),
    createPreviewPaid: () => ({ available: async () => false, summary: () => ({ remaining: 3, paid: false, paymentPending: false }) }),
  };
  const controller = createController(wx, adapters, Date);
  const page = Object.assign({}, controller, { data: Object.assign({}, controller.data),
    setData(values, callback) { Object.assign(this.data, values); if (callback) callback(); } });
  await page.onLoad(); await page.onReady();
  assert.equal(page.data.regionSelected, false);
  page.chooseAlbum(); assert.equal(picked, false);
  await page.selectRegion({ detail: { value: "2" } });
  assert.equal(page.data.profileId, sichuan.id);
  assert.equal(page.data.regionSelected, true);
  assert.equal(page.data.allowBlueBackground, false);
  page._ai = { record: { path: "mock-ai.jpg" } };
  page.changeBackground({ currentTarget: { dataset: { background: "blue" } } });
  assert.equal(page.data.background, "original");
  await page.selectRegion({ detail: { value: "1" } });
  assert.equal(page.data.profileId, national.id);
  assert.equal(page.data.allowBlueBackground, true);
  page.onUnload();
  console.log("PASS 四川与国考编码标记隔离、原图大小边界、ZIP 原字节、地区选择和白底限制");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
