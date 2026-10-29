#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { packJpg } = require("../miniprogram/subpackages/photo/core/zip-store");
const { createProcessor } = require("../miniprogram/subpackages/photo/core/process");
const { defaultProfileId } = require("../miniprogram/subpackages/photo/profiles");

const pixels = new Uint8Array(295 * 413 * 4);
for (let i = 0; i < pixels.length; i += 4) {
  pixels[i] = 120; pixels[i + 1] = 150; pixels[i + 2] = 180; pixels[i + 3] = 255;
}
const processor = createProcessor(defaultProfileId);
const jpg = Buffer.from(processor.createCandidate(pixels, true).data);
const zip = Buffer.from(packJpg(jpg, "报名照片.jpg"));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "photo-zip-experiment-"));
try {
  const zipPath = path.join(dir, "photo.zip");
  fs.writeFileSync(zipPath, zip);
  const extracted = execFileSync("python3", ["-c", "import sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); assert z.namelist()==['报名照片.jpg']; assert z.testzip() is None; sys.stdout.buffer.write(z.read('报名照片.jpg'))", zipPath]);
  assert.deepEqual(extracted, jpg);
  processor.verifyCandidate(extracted);
  console.log(JSON.stringify({ passed: true, zipBytes: zip.length, jpgBytes: jpg.length, extractedBytesIdentical: true, strictJpgValid: true, realPhoneTested: false }));
} finally { fs.rmSync(dir, { recursive: true, force: true }); }
