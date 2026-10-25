#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p6';
const lessonIds = ['DEV-04', 'VALUE-01', 'FOUND-03', 'TEN-04', 'SECURITY-03'];
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
assert.equal(evidence.previousCurriculumVersion, 'units-bfe51b5602b3');
assert.equal(evidence.curriculumVersion, 'units-afd3d8a540e1');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, lessonIds);
assert.deepEqual(evidence.contractRules, [13, 14, 17, 21, 23, 27, 29, 32, 34, 35, 37]);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);
for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

assert.equal(lessons['DEV-04'].question, '社会主义基本经济制度包括哪三方面？');
assert.equal(lessons['DEV-04'].boundary, undefined);
assert.deepEqual(lessons['DEV-04'].sections[1].sourceBlockIds, [
  'block:politics-toc-v2-u007:b023', 'block:politics-toc-v2-u007:b025', 'block:politics-toc-v2-u007:b031',
]);
assert.deepEqual(lessons['DEV-04'].sections[2].sourceBlockIds, ['block:politics-toc-v2-u007:b028']);
assert.deepEqual(lessons['DEV-04'].recap.sourceBlockIds, ['block:politics-toc-v2-u007:b022']);

assert.equal(lessons['VALUE-01'].sections[0].label, '商品的定义');
assert.equal(lessons['VALUE-01'].boundary.label, '同一商品所有者不能兼得使用价值和价值');
assert.deepEqual(lessons['VALUE-01'].boundary.sourceBlockIds, ['block:politics-toc-v2-u033:b013']);
assert.doesNotMatch(lessons['VALUE-01'].recap.text, /先用|接下来/);
assert.match(lessons['VALUE-01'].recap.text, /同一商品的两个因素/);

assert.equal(lessons['FOUND-03'].boundary, undefined);
assert.deepEqual(lessons['FOUND-03'].sections[3].sourceBlockIds, [
  'block:politics-toc-v2-u002:b002', 'block:politics-toc-v2-u002:b003', 'block:politics-toc-v2-u002:b004',
]);
assert.deepEqual(lessons['FOUND-03'].reflection.sourceBlockIds, ['block:politics-toc-v2-u002:b002']);
assert.match(lessons['FOUND-03'].recap.text, /中国具体实际/);
assert.match(lessons['FOUND-03'].recap.text, /中华优秀传统文化/);

assert.equal(projection.displayTitleForLessonId('TEN-04'), '十个明确·八至十');
assert.equal(lessons['TEN-04'].sections.length, 3);
assert.equal(lessons['TEN-04'].boundary, undefined);
assert.doesNotMatch(JSON.stringify(lessons['TEN-04']), /理解这一条|要同时保留|不是上一条|这一条要保留/);
assert.match(lessons['TEN-04'].recap.text, /听党指挥、能打胜仗、作风优良/);
assert.match(lessons['TEN-04'].recap.text, /构建人类命运共同体/);
assert.match(lessons['TEN-04'].reflection.answer, /政治、思想、组织、作风、纪律建设/);

assert.equal(lessons['SECURITY-03'].question, '强军目标、党对人民军队的绝对领导与现代化阶段分别是什么？');
assert.equal(lessons['SECURITY-03'].boundary, undefined);
assert.deepEqual(lessons['SECURITY-03'].sections[1].sourceBlockIds, [
  'block:politics-toc-v2-u017:b004', 'block:politics-toc-v2-u017:b005', 'block:politics-toc-v2-u017:b006',
]);
assert.deepEqual(lessons['SECURITY-03'].corePromises, [
  { quote: '听党指挥、能打胜仗、作风优良', sourceBlockIds: ['block:politics-toc-v2-u017:b002'] },
  { quote: '军委主席负责制', sourceBlockIds: ['block:politics-toc-v2-u017:b011'] },
  { quote: '2027年', sourceBlockIds: ['block:politics-toc-v2-u017:b004'] },
  { quote: '2035年', sourceBlockIds: ['block:politics-toc-v2-u017:b005'] },
  { quote: '本世纪中叶', sourceBlockIds: ['block:politics-toc-v2-u017:b006'] },
]);

for (const id of lessonIds) {
  const lesson = lessons[id];
  const runtimeLesson = runtimeLessons[id];
  assert.ok(lesson && runtimeLesson, id + ' missing');
  assert.equal(lesson.reflection.prompt, lesson.question, id + ' reflection drift');
  assert.equal(lesson.recap.label, '本节结论', id + ' recap label drift');
  assert.equal(runtimeLesson.parts.at(-1).kind, 'recap', id + ' recap position drift');
  assert.equal(runtimeLesson.parts.at(-1).emphasized, true, id + ' recap emphasis drift');
}
for (const id of ['DEV-04', 'FOUND-03', 'TEN-04', 'SECURITY-03']) {
  assert.equal(runtimeLessons[id].parts.some(part => part.kind === 'boundary'), false, id + ' boundary remains');
}
assert.equal(runtimeLessons['VALUE-01'].parts.find(part => part.kind === 'boundary').emphasized, false);

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
  status: 'passed', batch, curriculumVersion: runtime.curriculumVersion,
  changedLessonIds: lessonIds, aiReview: 'passed', runtimePageCheck: 'passed', realUserAcceptance: 'pending',
}));
