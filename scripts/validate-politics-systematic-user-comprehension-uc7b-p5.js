#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p5';
const lessonIds = ['COGNITION-01', 'COGNITION-03', 'HISTORY-01', 'MONEY-01', 'DIALECTICS-06'];
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261024.json');
const source = read(evidence.sourcePath);
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const { latest } = validateUserComprehensionLineage(root, batch);
const lessons = Object.fromEntries(lessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
const runtimeLessons = Object.fromEntries(lessonIds.map(id => [id, runtime.lessons.find(item => item.id === id)]));

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified');
assert.equal(evidence.previousCurriculumVersion, 'units-c966b493bce4');
assert.equal(evidence.curriculumVersion, 'units-f1f2a94bd288');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, lessonIds);
assert.deepEqual(evidence.contractRules, [13, 14, 17, 23, 27, 29, 32, 34, 35]);
assert.deepEqual(evidence.diagnosis.retainedBoundaryLessonIds, ['COGNITION-01', 'HISTORY-01']);
assert.deepEqual(evidence.diagnosis.removedBoundaryLessonIds, ['COGNITION-03', 'MONEY-01', 'DIALECTICS-06']);
assert.deepEqual(evidence.diagnosis.unchangedPassLessonIds, ['LEADERSHIP-02']);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);
for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

assert.equal(lessons['COGNITION-01'].question, '实践与认识是什么关系？');
assert.deepEqual(lessons['COGNITION-01'].sections.map(part => part.label), [
  '实践与认识的含义', '实践对认识的决定作用', '认识对实践的反作用',
]);
assert.equal(lessons['COGNITION-01'].boundary.label, '认识来源不等于个人都要亲历');
assert.equal(lessons['COGNITION-01'].boundary.text, '实践是认识的来源，不等于每个人的一切认识都必须来自亲身实践。');
assert.deepEqual(lessons['COGNITION-01'].boundary.sourceBlockIds, ['block:politics-toc-v2-u027:b023']);
assert.deepEqual(lessons['COGNITION-01'].sections[0].sourceBlockIds, [
  'block:politics-toc-v2-u027:b003', 'block:politics-toc-v2-u027:b005',
  'block:politics-toc-v2-u027:b008', 'block:politics-toc-v2-u027:b009',
]);

assert.equal(lessons['COGNITION-03'].question, '真理的客观性、绝对性和相对性是什么关系？');
assert.equal(lessons['COGNITION-03'].boundary, undefined);
assert.deepEqual(lessons['COGNITION-03'].sections[1].sourceBlockIds, [
  'block:politics-toc-v2-u029:b005', 'block:politics-toc-v2-u029:b007',
  'block:politics-toc-v2-u029:b008', 'block:politics-toc-v2-u029:b009',
]);
assert.deepEqual(lessons['COGNITION-03'].corePromises.find(item => item.quote === '绝对性').sourceBlockIds,
  ['block:politics-toc-v2-u029:b005']);

assert.equal(lessons['HISTORY-01'].question, '社会存在的决定作用与社会意识的相对独立性是什么关系？');
assert.deepEqual(lessons['HISTORY-01'].sections.map(part => part.label), ['社会存在与社会意识的含义', '社会意识的相对独立性']);
assert.equal(lessons['HISTORY-01'].boundary.label, '社会意识的反作用通过实践实现');
assert.deepEqual(lessons['HISTORY-01'].recap.sourceBlockIds, [
  'block:politics-toc-v2-u030:b010', 'block:politics-toc-v2-u030:b011',
  'block:politics-toc-v2-u030:b012', 'block:politics-toc-v2-u030:b013',
]);

assert.equal(lessons['MONEY-01'].question, '货币的本质、价值尺度和流通手段分别是什么？');
assert.equal(lessons['MONEY-01'].boundary, undefined);
assert.deepEqual(lessons['MONEY-01'].sections.map(part => part.label), ['货币的本质是一般等价物', '价值尺度与流通手段']);
assert.match(lessons['MONEY-01'].reflection.answer, /一般等价物/);
assert.match(lessons['MONEY-01'].reflection.answer, /观念货币/);
assert.match(lessons['MONEY-01'].reflection.answer, /现实货币/);

assert.equal(lessons['DIALECTICS-06'].question, '辩证否定和否定之否定分别是什么？');
assert.equal(lessons['DIALECTICS-06'].boundary, undefined);
assert.deepEqual(lessons['DIALECTICS-06'].sections.map(part => part.label), [
  '辩证否定：自我否定与扬弃', '否定之否定：前进性与曲折性的统一',
]);
assert.deepEqual(lessons['DIALECTICS-06'].reflection.sourceBlockIds, [
  'block:politics-toc-v2-u026:b002', 'block:politics-toc-v2-u026:b004',
  'block:politics-toc-v2-u026:b007', 'block:politics-toc-v2-u026:b010',
]);
assert.equal(projection.displayTitleForLessonId('DIALECTICS-06'), '辩证否定与否定之否定');

for (const id of lessonIds) {
  const lesson = lessons[id];
  const runtimeLesson = runtimeLessons[id];
  assert.ok(lesson && runtimeLesson, id + ' missing');
  assert.equal(lesson.reflection.prompt, lesson.question, id + ' reflection drift');
  assert.equal(lesson.recap.label, '本节结论', id + ' recap label drift');
  assert.equal(runtimeLesson.parts.at(-1).kind, 'recap', id + ' recap position drift');
  assert.equal(runtimeLesson.parts.at(-1).label, '本节结论', id + ' runtime recap label drift');
  assert.equal(runtimeLesson.parts.at(-1).emphasized, true, id + ' recap emphasis drift');
  assert.equal(runtimeLesson.parts.filter(part => part.kind === 'recap').length, 1, id + ' recap count drift');
}
assert.equal(runtimeLessons['COGNITION-01'].parts.find(part => part.kind === 'boundary').emphasized, false);
assert.equal(runtimeLessons['HISTORY-01'].parts.find(part => part.kind === 'boundary').emphasized, false);
for (const id of ['COGNITION-03', 'MONEY-01', 'DIALECTICS-06']) {
  assert.equal(runtimeLessons[id].parts.some(part => part.kind === 'boundary'), false, id + ' redundant boundary');
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
  assert.equal(screen.dom.recapEmphasisRendered, true);
  assert.equal(screen.dom.boundaryUsesConclusionEmphasis, false);
}
assert.equal(probe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  changedLessonIds: lessonIds,
  retainedBoundaryLessonIds: ['COGNITION-01', 'HISTORY-01'],
  removedBoundaryLessonIds: ['COGNITION-03', 'MONEY-01', 'DIALECTICS-06'],
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  realUserAcceptance: 'pending',
}));
