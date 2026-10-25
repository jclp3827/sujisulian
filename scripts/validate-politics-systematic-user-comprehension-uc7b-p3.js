#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p3';
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261023.json');
const source = read(evidence.sourcePath);
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const acceptance = read(evidence.userAcceptancePath);
const { latest } = validateUserComprehensionLineage(root, batch);
const ids = ['DIALECTICS-01', 'DEV-06', 'MOD-01', 'COGNITION-02', 'FOUND-02'];
const lesson = id => source.lessons.find(item => item.id === id);
const runtimeLesson = id => runtime.lessons.find(item => item.id === id);

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-runtime-and-user-accepted');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.previousCurriculumVersion, 'units-0e8d642a243e');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, ids);
assert.deepEqual(evidence.uiProjectionAffectedLessonIds, ids);
assert.deepEqual(evidence.contractRules, [17, 21, 23, 27, 29, 31, 32, 33, 34]);
assert.equal(evidence.diagnosis.staleFrontendOrCache, false);
assert.deepEqual(evidence.diagnosis.removedBoundaryLessonIds,
  ['DIALECTICS-01', 'MOD-01', 'COGNITION-02', 'FOUND-02']);
assert.deepEqual(evidence.diagnosis.retainedBoundaryLessonIds, ['DEV-06']);
assert.equal(evidence.realUserAcceptance, 'passed');
assert.equal(evidence.releaseAuthorized, false);

for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe', 'userAcceptance']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

const dialectics = lesson('DIALECTICS-01');
assert.equal(dialectics.boundary, undefined);
assert.equal(dialectics.objectives[0], '理解联系的特征、整体与部分的关系、新旧事物的判断标准');
assert.match(dialectics.recap.text, /客观性、普遍性、多样性和条件性/);
assert.match(dialectics.reflection.answer, /关键部分的功能及其变化甚至决定整体功能/);

const rural = lesson('DEV-06');
assert.equal(rural.boundary.label, '本节五项内容与“五项振兴”不同');
assert.match(rural.boundary.text, /产业振兴、人才振兴、文化振兴、生态振兴、组织振兴/);
assert.deepEqual(rural.boundary.sourceBlockIds, [
  'block:politics-toc-v2-u007:b048',
  'block:politics-toc-v2-u007:b049',
  'block:politics-toc-v2-u007:b050',
]);
for (const phrase of ['农业农村现代化', '农业农村优先发展', '产业兴旺', '城乡融合发展', '粮食供给']) {
  assert.match(rural.recap.text, new RegExp(phrase));
}

const modernization = lesson('MOD-01');
assert.equal(modernization.boundary, undefined);
assert.doesNotMatch(modernization.sections[1].text, /后续|下一节|完整内涵由/);
assert.doesNotMatch(modernization.scopeLimit, /后续|下一节/);
assert.match(modernization.recap.text, /2035年/);
assert.match(modernization.recap.text, /本世纪中叶/);

const cognition = lesson('COGNITION-02');
assert.equal(cognition.boundary, undefined);
assert.equal(cognition.question, '认识的两次飞跃分别是什么？');
assert.match(cognition.sections[1].text, /理性认识依赖感性认识/);

const foundation = lesson('FOUND-02');
assert.equal(foundation.boundary, undefined);
assert.equal(foundation.sections.length, 3);
assert.match(foundation.sections[2].text, /社会主要矛盾、历史阶段还是国际地位/);
assert.match(foundation.sections[2].text, /不能由社会主要矛盾变化直接推出基本国情改变/);
assert.equal(foundation.question, '为什么进入新时代不等于越过社会主义初级阶段？');
assert.equal(foundation.reflection.prompt, foundation.question);
assert.doesNotMatch(foundation.reflection.answer, /新时代改变的是/);
assert.match(foundation.reflection.answer, /新时代判断的基本依据是社会主要矛盾发生变化/);
assert.deepEqual(foundation.reflection.sourceBlockIds, [
  'block:politics-toc-v2-u001:b011',
  'block:politics-toc-v2-u001:b012',
]);

for (const id of ['DIALECTICS-01', 'MOD-01', 'COGNITION-02', 'FOUND-02']) {
  assert.equal(runtimeLesson(id).parts.some(part => part.kind === 'boundary'), false, id);
}
assert.ok(runtimeLesson('DEV-06').parts.some(part => part.kind === 'boundary'));
for (const id of ids) {
  assert.equal(runtimeLesson(id).parts.find(part => part.kind === 'recap').emphasized, true, id);
}
assert.notEqual(runtimeLesson('DEV-06').parts.find(part => part.kind === 'boundary').emphasized, true);

assert.equal(ai.curriculumVersion, runtime.curriculumVersion);
assert.equal(ai.sourceSha256, evidence.sourceSha256);
assert.equal(ai.projectionSha256, evidence.projectionSha256);
assert.deepEqual(ai.lessonIds, ids);
for (const roleId of ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert']) {
  const role = ai.roles[roleId];
  assert.equal(role.status, 'pass');
  assert.equal(role.riskCount, 0);
  assert.equal(role.holdCount, 0);
  assert.deepEqual(Object.keys(role.lessonAssertions), ids);
}

assert.equal(probe.status, 'passed');
assert.equal(probe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(probe.lessonIds, ids);
assert.equal(probe.compileSuccess, true);
assert.equal(probe.automatorVerified, true);
for (const id of ids) {
  const screen = probe.screens.find(item => item.lessonId === id);
  assert.ok(screen, id);
  assert.equal(screen.recapLabel, '本节结论');
  assert.equal(screen.dom.recapEmphasisRendered, true);
  if (id === 'DEV-06') {
    assert.equal(screen.dom.secondaryBoundaryRendered, true);
    assert.equal(screen.dom.boundaryUsesConclusionEmphasis, false);
  } else {
    assert.equal(screen.dom.redundantBoundaryAbsent, true);
  }
}
for (const field of ['existingProgressBeforeProbe', 'temporaryNavigationStorageFree', 'storageRecordByteEquivalent']) {
  assert.equal(probe.progressProtection[field], true);
}
assert.equal(probe.progressProtection.testedCurriculumVersion, runtime.curriculumVersion);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);

assert.equal(acceptance.status, 'passed');
assert.equal(acceptance.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(acceptance.lessonIds, ids);
assert.equal(acceptance.constraintsRegisteredInRule, 34);
assert.equal(acceptance.releaseAuthorized, false);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  changedLessonIds: ids,
  removedBoundaries: 4,
  retainedBoundaries: 1,
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  realUserAcceptance: 'passed',
}));
