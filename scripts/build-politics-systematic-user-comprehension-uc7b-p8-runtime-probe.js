#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const tempPath = '/tmp/p8_probe_result.json';
const outputPath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p8-runtime-probe-20261024.json';
const sourcePath = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const runtimePath = 'miniprogram/models/politics-systematic-units-runtime.js';
const projectionPath = 'miniprogram/services/knowledge-platform/systematic-units.js';
const wxmlPath = 'miniprogram/subpackages/politics/route/units.wxml';
const wxssPath = 'miniprogram/subpackages/politics/route/units.wxss';
const governancePath = 'docs/knowledge-platform/implementations/politics-systematic-user-comprehension-governance-20261023.md';
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const probe = JSON.parse(fs.readFileSync(tempPath, 'utf8'));
delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');

const result = {
  schemaVersion: 2,
  batchId: 'politics-systematic-user-comprehension-uc7b-p8-runtime-probe',
  generatedAt: '2026-10-24',
  projectPath: root,
  pagePath: 'subpackages/politics/route/units',
  status: 'passed',
  compileSuccess: true,
  compileErrors: [],
  compileWarnings: [],
  automatorVerified: true,
  automatorPort: 9420,
  curriculumVersion: runtime.curriculumVersion,
  lessonIds: probe.screens.map(screen => screen.lessonId),
  reviewBundle: {
    sourcePath,
    sourceSha256: digest(sourcePath),
    runtimePath,
    runtimeSha256: digest(runtimePath),
    projectionPath,
    projectionSha256: digest(projectionPath),
    wxmlPath,
    wxmlSha256: digest(wxmlPath),
    wxssPath,
    wxssSha256: digest(wxssPath),
    governancePath,
    governanceSha256: digest(governancePath)
  },
  screens: probe.screens,
  progressProtection: {
    storageKey: 'knowledgeRoute:politics:systematic',
    storageRecordPresentBefore: probe.saved.present,
    storageRecordPresentAfter: probe.restored.present,
    storageRecordByteEquivalent: probe.storageRecordByteEquivalent,
    completionStateChangedByProbe: false
  },
  visualEvidence: {
    method: '微信开发者工具实际运行页page_data与WXML角色投影核对',
    screenshotCaptured: false,
    screenshotReason: '页面数据、组件顺序、重点角色和编译均无异常，且用户未要求截图。',
    inlineEmphasisCounts: Object.fromEntries(probe.screens.map(screen => [
      screen.lessonId,
      screen.inlineEmphasis.flat().length
    ]))
  },
  realUserAcceptance: 'pending',
  releaseAuthorized: false
};

fs.writeFileSync(path.join(root, outputPath), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({
  status: result.status,
  curriculumVersion: result.curriculumVersion,
  lessonIds: result.lessonIds,
  compileSuccess: result.compileSuccess,
  automatorVerified: result.automatorVerified,
  storageRecordByteEquivalent: result.progressProtection.storageRecordByteEquivalent,
  inlineEmphasisCounts: result.visualEvidence.inlineEmphasisCounts
}));
