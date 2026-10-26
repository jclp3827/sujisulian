#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const entries = [
  ["subpackages/common-sense/models/learning-pack", "subpackages/common-sense/models/learning-pack-runtime"],
  ["subpackages/common-sense/models/guide-expansion-candidate", "subpackages/common-sense/models/guide-expansion-candidate-runtime"],
  ["subpackages/common-sense/models/note-common-sense", "subpackages/common-sense/models/note-common-sense-runtime"],
  ["subpackages/note/models/learning-pack", "subpackages/note/models/learning-pack-runtime"],
  ["subpackages/note/models/memory-pack", "subpackages/note/models/memory-pack-runtime"],
  ["models/politics-p3-v2-runtime", "models/politics-p3-v2-compact"],
  ["models/politics-learning-banks-runtime", "models/politics-learning-banks-compact"],
  ["models/politics-systematic-units-runtime", "models/politics-systematic-units-compact"],
];

for (const script of ["build-common-sense-preview-payloads.js", "build-notes-preview-payloads.js", "build-politics-preview-payloads.js"]) {
  execFileSync(process.execPath, [path.join(__dirname, script), "--check"], { cwd: root, stdio: "pipe" });
}

const ignored = new Set(JSON.parse(fs.readFileSync(path.join(root, "project.config.json"))).packOptions.ignore
  .filter(item => item.type === "file").map(item => item.value));
global.wx = { base64ToArrayBuffer(value) {
  const bytes = Buffer.from(value, "base64");
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
} };
for (const [source, packed] of entries) {
  assert(ignored.has(`${source}.js`), `${source} must be excluded from the preview package`);
  assert.deepEqual(require(path.join(root, "miniprogram", packed)), require(path.join(root, "miniprogram", source)));
}
console.log(JSON.stringify({ passed: true, datasets: entries.length, codec: "WeChat base64ToArrayBuffer", originalsExcluded: true }));
