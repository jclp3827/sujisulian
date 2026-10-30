#!/usr/bin/env node
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { build } = require('./build-common-sense-runtime-compatibility');

const root = path.resolve(__dirname, '..');
const mini = path.join(root, 'miniprogram');
const fixture = (name) => require(path.join(__dirname, 'fixtures/common-sense-runtime-compatibility', name));
const runtime = (name) => require(path.join(mini, 'subpackages/common-sense/models', name));

build({ check: true });
assert.deepEqual(runtime('guide-learning-compatibility'), fixture('guide-learning-compatibility'));
assert.deepEqual(runtime('learning-identity-compatibility'), fixture('learning-identity-compatibility'));

const config = JSON.parse(fs.readFileSync(path.join(root, 'project.config.json'), 'utf8'));
assert(config.packOptions.ignore.some((item) => item.type === 'folder' &&
  item.value === 'subpackages/common-sense/vendor/pako'));

const sharedPako = path.join(mini, 'vendor/pako');
const duplicatePako = path.join(mini, 'subpackages/common-sense/vendor/pako');
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}
for (const duplicate of walk(duplicatePako)) {
  const relative = path.relative(duplicatePako, duplicate);
  assert.deepEqual(fs.readFileSync(duplicate), fs.readFileSync(path.join(sharedPako, relative)),
    `Shared pako copy differs: ${relative}`);
}

const ignored = config.packOptions.ignore;
let includedBytes = 0;
for (const filename of walk(path.join(mini, 'subpackages/common-sense'))) {
  const relative = path.relative(mini, filename);
  const excluded = ignored.some((item) => item.type === 'file' ? relative === item.value :
    item.type === 'folder' && (relative === item.value || relative.startsWith(`${item.value}${path.sep}`)));
  if (!excluded) includedBytes += fs.statSync(filename).size;
}
assert(includedBytes < 2300000, `Common-sense package source budget exceeded: ${includedBytes}`);

console.log(JSON.stringify({ passed: true, includedBytes, compatibilityExact: true,
  sharedPakoExact: true, platformUploadRequired: true }));
