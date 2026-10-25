#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p5r1';
const lessonIds = ['COGNITION-01', 'HISTORY-01', 'MONEY-01'];
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261024.json');
const source = read(evidence.sourcePath);
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const feedback = read(evidence.predecessorUserFeedbackPath);
const acceptance = read(evidence.userAcceptancePath);
const { latest } = validateUserComprehensionLineage(root, batch);
const lessons = Object.fromEntries(lessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
const runtimeLessons = Object.fromEntries(lessonIds.map(id => [id, runtime.lessons.find(item => item.id === id)]));

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-runtime-and-user-accepted');
assert.equal(evidence.previousCurriculumVersion, 'units-f1f2a94bd288');
assert.equal(evidence.curriculumVersion, 'units-bfe51b5602b3');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, lessonIds);
assert.deepEqual(evidence.contractRules, [14, 17, 23, 27, 29, 32, 34, 36, 37]);
assert.equal(evidence.realUserAcceptance, 'passed');
assert.equal(evidence.releaseAuthorized, false);
assert.equal(feedback.status, 'partial');
assert.deepEqual(feedback.passedLessonIds, ['COGNITION-03', 'DIALECTICS-06']);
assert.deepEqual(feedback.revisionRequiredLessonIds, lessonIds);
for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}
assert.equal(digest(evidence.userAcceptancePath), evidence.userAcceptanceSha256);
assert.equal(digest(evidence.predecessorUserFeedbackPath), evidence.predecessorUserFeedbackSha256);

assert.equal(lessons['COGNITION-01'].question, '实践与认识是什么关系？');
assert.equal(lessons['COGNITION-01'].boundary, undefined);
assert.deepEqual(lessons['COGNITION-01'].sections.map(part => part.label), [
  '实践与认识的含义', '实践对认识的决定作用', '认识对实践的反作用',
]);

assert.equal(lessons['HISTORY-01'].question, '社会存在的决定作用与社会意识的相对独立性是什么关系？');
assert.equal(lessons['HISTORY-01'].boundary, undefined);
assert.equal(lessons['HISTORY-01'].sections[1].label, '社会意识的相对独立性');
assert.match(lessons['HISTORY-01'].sections[1].text, /先进正确意识通过社会实践促进发展/);
assert.deepEqual(lessons['HISTORY-01'].sections[1].sourceBlockIds, [
  'block:politics-toc-v2-u030:b011',
  'block:politics-toc-v2-u030:b012',
  'block:politics-toc-v2-u030:b013',
]);

assert.equal(lessons['MONEY-01'].question, '货币的本质、价值尺度和流通手段分别是什么？');
assert.equal(lessons['MONEY-01'].sections[1].label, '货币的价值尺度与流通手段');
assert.equal(projection.displayTitleForLessonId('MONEY-01'), '货币的本质与基本职能');

for (const id of lessonIds) {
  const lesson = lessons[id];
  const runtimeLesson = runtimeLessons[id];
  assert.ok(lesson && runtimeLesson, id + ' missing');
  assert.equal(lesson.reflection.prompt, lesson.question, id + ' reflection drift');
  assert.equal(lesson.recap.label, '本节结论', id + ' recap label drift');
  assert.equal(runtimeLesson.parts.some(part => part.kind === 'boundary'), false, id + ' boundary remains');
  assert.equal(runtimeLesson.parts.at(-1).kind, 'recap', id + ' recap position drift');
  assert.equal(runtimeLesson.parts.at(-1).label, '本节结论', id + ' recap label drift');
  assert.equal(runtimeLesson.parts.at(-1).emphasized, true, id + ' recap emphasis drift');
}

assert.equal(ai.curriculumVersion, runtime.curriculumVersion);
assert.equal(ai.sourceSha256, evidence.sourceSha256);
assert.equal(ai.projectionSha256, evidence.projectionSha256);
assert.deepEqual(ai.lessonIds, lessonIds);
for (const roleId of ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert']) {
  assert.equal(ai.roles[roleId].status, 'pass');
  assert.equal(ai.roles[roleId].riskCount, 0);
  assert.equal(ai.roles[roleId].holdCount, 0);
  assert.deepEqual(Object.keys(ai.roles[roleId].lessonAssertions), lessonIds);
}

assert.equal(probe.status, 'passed');
assert.equal(probe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(probe.lessonIds, lessonIds);
assert.equal(probe.compileSuccess, true);
assert.equal(probe.automatorVerified, true);
for (const id of lessonIds) {
  const screen = probe.screens.find(item => item.lessonId === id);
  assert.ok(screen, id + ' runtime screen missing');
  assert.equal(screen.title, projection.displayTitleForLessonId(id));
  assert.equal(screen.question, lessons[id].question);
  assert.deepEqual(screen.partLabels, runtimeLessons[id].parts.map(part => part.label));
  assert.equal(screen.dom.redundantBoundaryAbsent, true);
  assert.equal(screen.dom.secondaryBoundaryRendered, false);
  assert.equal(screen.dom.recapEmphasisRendered, true);
}
assert.equal(probe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);
assert.equal(acceptance.status, 'passed');
assert.equal(acceptance.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(acceptance.lessonIds, lessonIds);
assert.deepEqual(acceptance.constraintsRegisteredInRules, [36, 37]);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  changedLessonIds: lessonIds,
  boundariesRemoved: ['COGNITION-01', 'HISTORY-01'],
  sharedSubjectHeadingCompleted: '货币的价值尺度与流通手段',
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  realUserAcceptance: 'passed',
}));
