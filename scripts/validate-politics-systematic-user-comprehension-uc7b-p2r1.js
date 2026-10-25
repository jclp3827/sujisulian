#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p2r1';
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
assert.equal(evidence.previousCurriculumVersion, 'units-cd3b016b4f56');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, ['LEADERSHIP-01', 'SYS-05', 'VALUE-02']);
assert.equal(evidence.uiProjectionAffectedLessonIds.length, 72);
assert.deepEqual(evidence.contractRules, [17, 23, 27, 29, 31, 32]);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);

for (const name of ['source', 'inventory', 'runtime', 'projection', 'builder', 'wxml', 'wxss', 'aiReview', 'runtimeProbe']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

const leadership = source.lessons.find(lesson => lesson.id === 'LEADERSHIP-01');
const leadershipRuntime = runtime.lessons.find(lesson => lesson.id === 'LEADERSHIP-01');
assert.equal(leadership.boundary, undefined);
assert.equal(leadershipRuntime.parts.some(part => part.kind === 'boundary'), false);
assert.match(leadership.recap.text, /具体国家机关各自承担相应职能/);
assert.match(leadership.recap.text, /不能相互替代/);

const sys05 = source.lessons.find(lesson => lesson.id === 'SYS-05');
assert.match(sys05.recap.text, /重要实践要求.*正视和解决实际问题/);
assert.match(sys05.recap.text, /基本思想和工作方法.*普遍联系/);
assert.match(sys05.recap.text, /境界格局.*人类进步和解放/);

const value02 = source.lessons.find(lesson => lesson.id === 'VALUE-02');
assert.equal(value02.question, '具体劳动与抽象劳动有什么区别和联系？');
assert.equal(value02.reflection.prompt, value02.question);
assert.equal(value02.boundary.label, '不能理解为两次劳动');
assert.deepEqual(value02.boundary.sourceBlockIds, ['block:politics-toc-v2-u034:b005']);
assert.match(value02.recap.text, /同一劳动过程的两个方面/);
assert.match(value02.recap.text, /具体劳动.*使用价值.*抽象劳动.*价值/);
assert.deepEqual(value02.recap.sourceBlockIds, [
  'block:politics-toc-v2-u034:b003',
  'block:politics-toc-v2-u034:b004',
  'block:politics-toc-v2-u034:b005',
  'block:politics-toc-v2-u034:b006',
]);

for (const lesson of source.lessons) {
  const compiled = runtime.lessons.find(item => item.id === lesson.id);
  const recap = compiled.parts.find(part => part.kind === 'recap');
  const boundary = compiled.parts.find(part => part.kind === 'boundary');
  assert.ok(recap, lesson.id + ' missing recap');
  assert.equal(recap.emphasized, true, lesson.id + ' recap must own conclusion emphasis');
  if (lesson.boundary) {
    assert.ok(boundary, lesson.id + ' missing boundary');
    assert.notEqual(boundary.emphasized, true, lesson.id + ' boundary must not own conclusion emphasis');
  } else assert.equal(boundary, undefined, lesson.id + ' generated an absent boundary');
}

const styles = fs.readFileSync(path.join(root, evidence.wxssPath), 'utf8');
assert.match(styles, /\.unit-part-boundary\s*\{[^}]*background:\s*var\(--ui-color-soft\)/);
assert.doesNotMatch(styles, /\.unit-part-boundary\s*\{[^}]*border-left/);
assert.match(styles, /\.unit-part-recap\.unit-part-emphasized\s*\{[^}]*border-left/);

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
for (const id of evidence.probeLessonIds) {
  const screen = probe.screens.find(item => item.lessonId === id);
  assert.ok(screen, id + ' missing runtime screen');
  assert.equal(screen.dom.recapEmphasisRendered, true);
  assert.equal(screen.dom.boundaryUsesConclusionEmphasis, false);
}
assert.equal(probe.screens.find(item => item.lessonId === 'LEADERSHIP-01').dom.redundantBoundaryAbsent, true);
assert.equal(probe.screens.find(item => item.lessonId === 'SYS-05').dom.redundantBoundaryAbsent, true);
assert.equal(probe.screens.find(item => item.lessonId === 'VALUE-02').dom.secondaryBoundaryRendered, true);
for (const field of ['existingProgressBeforeProbe', 'temporaryNavigationStorageFree', 'storageRecordByteEquivalent']) {
  assert.equal(probe.progressProtection[field], true);
}
assert.equal(probe.progressProtection.testedCurriculumVersion, runtime.curriculumVersion);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  contentChangedLessonIds: evidence.contentChangedLessonIds,
  uiProjectionAffectedCount: evidence.uiProjectionAffectedLessonIds.length,
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  realUserAcceptance: 'pending',
}));
