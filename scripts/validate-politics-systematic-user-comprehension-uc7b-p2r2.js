#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p2r2';
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261023.json');
const source = read(evidence.sourcePath);
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const { latest } = validateUserComprehensionLineage(root, batch);

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.previousCurriculumVersion, 'units-2a88d66e39b7');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.equal(evidence.contentChangedLessonIds.length, 21);
assert.deepEqual(evidence.uiProjectionAffectedLessonIds, evidence.contentChangedLessonIds);
assert.deepEqual(evidence.contractRules, [29, 31, 32, 33]);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);

for (const name of ['source', 'inventory', 'runtime', 'projection', 'builder', 'refiner', 'contentValidator', 'unitsValidator', 'wxml', 'wxss', 'aiReview', 'runtimeProbe']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

assert.deepEqual(evidence.sourceRecapLabelCounts, { '本节结论': 72 });
assert.deepEqual(evidence.runtimeRecapLabelCounts, { '本节结论': 72 });
assert.ok(source.lessons.every(lesson => lesson.recap.label === '本节结论'));
assert.ok(runtime.lessons.every(lesson => {
  const recap = lesson.parts.find(part => part.kind === 'recap');
  const boundary = lesson.parts.find(part => part.kind === 'boundary');
  return recap?.label === '本节结论' && recap.emphasized === true && boundary?.emphasized !== true;
}));
assert.doesNotMatch(JSON.stringify(source.lessons.map(lesson => lesson.recap.label)), /本主题小结/);
assert.doesNotMatch(JSON.stringify(runtime.lessons.map(lesson => lesson.parts.find(part => part.kind === 'recap')?.label)), /本主题小结/);

const projectionText = fs.readFileSync(path.join(root, evidence.projectionPath), 'utf8');
const refinerText = fs.readFileSync(path.join(root, evidence.refinerPath), 'utf8');
assert.match(projectionText, /part\.kind === 'recap' \? '本节结论' : part\.label/);
assert.doesNotMatch(projectionText, /part\.kind === 'recap' \? \(lesson\.nextLessonId/);
assert.match(refinerText, /lesson\.recap\.label = '本节结论'/);
assert.doesNotMatch(refinerText, /lesson\.recap\.label = lesson\.nextLessonId/);

assert.equal(ai.curriculumVersion, runtime.curriculumVersion);
assert.equal(ai.sourceSha256, evidence.sourceSha256);
assert.equal(ai.projectionSha256, evidence.projectionSha256);
assert.deepEqual(ai.lessonIds, evidence.probeLessonIds);
for (const roleId of ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert']) {
  const role = ai.roles[roleId];
  assert.equal(role.status, 'pass');
  assert.equal(role.riskCount, 0);
  assert.equal(role.holdCount, 0);
  assert.deepEqual(Object.keys(role.lessonAssertions).sort(), evidence.probeLessonIds.slice().sort());
}

assert.equal(probe.status, 'passed');
assert.equal(probe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(probe.lessonIds, evidence.probeLessonIds);
assert.equal(probe.compileSuccess, true);
assert.equal(probe.automatorVerified, true);
for (const screen of probe.screens) {
  assert.equal(screen.recapLabel, '本节结论');
  assert.equal(screen.dom.recapEmphasisRendered, true);
  assert.equal(screen.dom.themeSummaryAbsent, true);
  assert.equal(screen.dom.boundaryUsesConclusionEmphasis, false);
}
assert.equal(probe.screens.find(screen => screen.lessonId === 'LEADERSHIP-01').dom.redundantBoundaryAbsent, true);
assert.equal(probe.screens.find(screen => screen.lessonId === 'VALUE-02').dom.secondaryBoundaryRendered, true);
for (const field of ['existingProgressBeforeProbe', 'temporaryNavigationStorageFree', 'storageRecordByteEquivalent']) {
  assert.equal(probe.progressProtection[field], true);
}
assert.equal(probe.progressProtection.testedCurriculumVersion, runtime.curriculumVersion);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  unifiedRecapLabel: '本节结论',
  renamedLessonCount: evidence.contentChangedLessonIds.length,
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  realUserAcceptance: 'pending',
}));
