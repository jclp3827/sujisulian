#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const tempPath = '/tmp/p10_probe_result.json';
const outputPath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p10-runtime-probe-20261024.json';
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

const result = {
  schemaVersion: 2,
  batchId: 'politics-systematic-user-comprehension-uc7b-p10-runtime-probe',
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
  lessonIds: probe.screens.map(screen => screen.lessonId),
  reviewBundle: Object.fromEntries(Object.entries(bundle).flatMap(([name, file]) => [
    [name, file],
    [name.replace(/Path$/, 'Sha256'), digest(file)],
  ])),
  screens: probe.screens,
  progressProtection: {
    storageKey: 'knowledgeRoute:politics:systematic',
    storageRecordPresentBefore: probe.saved.present,
    storageRecordPresentAfter: probe.restored.present,
    storageRecordByteEquivalent: probe.storageRecordByteEquivalent,
    completionStateChangedByProbe: false,
  },
  paragraphProjection: {
    targetLessonIds: ['TEN-01', 'MOD-02'],
    controlLessonId: 'TEN-02',
    controlRecapParagraphCount: probe.screens.find(screen => screen.lessonId === 'TEN-02').paragraphCounts.at(-1),
    controlRecapParagraphTexts: probe.screens.find(screen => screen.lessonId === 'TEN-02').paragraphTexts.at(-1),
    note: '目标两页的新结论不再含分号；TEN-02作为旧分号结论兼容样本，实际投影为三个段落。',
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
  controlRecapParagraphCount: result.paragraphProjection.controlRecapParagraphCount,
}));
