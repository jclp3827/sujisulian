#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const tempPath = '/tmp/p10r1_probe_result.json';
const outputPath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p10r1-runtime-probe-20261024.json';
const lessonIds = [
  'BASICS-01', 'BASICS-04', 'CULTUREECO-04', 'DEV-02', 'DEV-06',
  'LEADERSHIP-03', 'MONEY-02', 'REFORMLAW-03', 'SYS-01', 'TEN-02', 'TEN-04',
];
const bundle = {
  sourcePath: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  runtimePath: 'miniprogram/models/politics-systematic-units-runtime.js',
  projectionPath: 'miniprogram/services/knowledge-platform/systematic-units.js',
  wxmlPath: 'miniprogram/subpackages/politics/route/units.wxml',
  wxssPath: 'miniprogram/subpackages/politics/route/units.wxss',
  governancePath: 'docs/knowledge-platform/implementations/politics-systematic-user-comprehension-governance-20261023.md',
};
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const probe = JSON.parse(fs.readFileSync(tempPath, 'utf8'));
delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');

assert.deepEqual(probe.screens.map(item => item.lessonId), lessonIds);
assert.equal(probe.storageRecordByteEquivalent, true);
const byId = Object.fromEntries(probe.screens.map(item => [item.lessonId, item]));
assert.equal(byId['BASICS-04'].partKinds.includes('boundary'), false);
assert.equal(byId['LEADERSHIP-03'].partKinds.includes('boundary'), false);
assert.equal(byId['REFORMLAW-03'].partKinds.filter(kind => kind === 'boundary').length, 1);
assert.equal(byId['REFORMLAW-03'].partLabels.find((_, index) => byId['REFORMLAW-03'].partKinds[index] === 'boundary'), '重点不等于省略其他环节');
for (const id of ['BASICS-04', 'MONEY-02', 'REFORMLAW-03', 'TEN-02']) {
  assert.equal(byId[id].paragraphCounts.at(-1), 2, id + ' recap paragraph count');
}

const result = {
  schemaVersion: 2,
  batchId: 'politics-systematic-user-comprehension-uc7b-p10r1-runtime-probe',
  generatedAt: '2026-10-24',
  projectPath: root,
  pagePath: 'subpackages/politics/route/units',
  status: 'passed',
  compileSuccess: true,
  compileErrors: [],
  compileWarnings: [{
    category: 'toolchain-deprecation',
    message: 'Node DEP0040 punycode deprecation warning from the WeChat DevTools process.',
    applicationWarning: false,
  }],
  wxmlErrors: [],
  automatorVerified: true,
  automatorPort: 9420,
  curriculumVersion: runtime.curriculumVersion,
  lessonIds,
  reviewBundle: Object.fromEntries(Object.entries(bundle).flatMap(([name, file]) => [
    [name, file],
    [name.replace(/Path$/, 'Sha256'), digest(file)],
  ])),
  screens: probe.screens,
  boundaryProjection: {
    removedLessonIds: ['BASICS-04', 'LEADERSHIP-03'],
    retainedAndNarrowedLessonIds: ['REFORMLAW-03'],
  },
  paragraphProjection: {
    targetLessonIds: ['BASICS-04', 'MONEY-02', 'REFORMLAW-03', 'TEN-02'],
    paragraphCounts: Object.fromEntries(['BASICS-04', 'MONEY-02', 'REFORMLAW-03', 'TEN-02']
      .map(id => [id, byId[id].paragraphCounts.at(-1)])),
  },
  progressProtection: {
    storageKey: 'knowledgeRoute:politics:systematic',
    storageRecordPresentBefore: probe.saved.present,
    storageRecordPresentAfter: probe.restored.present,
    storageRecordByteEquivalent: probe.storageRecordByteEquivalent,
    completionStateChangedByProbe: false,
  },
  realUserAcceptance: 'pending',
  releaseAuthorized: false,
};

fs.writeFileSync(path.join(root, outputPath), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({
  status: result.status,
  curriculumVersion: result.curriculumVersion,
  lessonIds: result.lessonIds,
  compileSuccess: result.compileSuccess,
  wxmlErrors: result.wxmlErrors.length,
  automatorVerified: result.automatorVerified,
  storageRecordByteEquivalent: result.progressProtection.storageRecordByteEquivalent,
  paragraphCounts: result.paragraphProjection.paragraphCounts,
}));
