#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p4r1';
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261024.json');
const source = read(evidence.sourcePath);
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const feedback = read(evidence.predecessorUserFeedbackPath);
const acceptance = read(evidence.userAcceptancePath);
const { latest } = validateUserComprehensionLineage(root, batch);
const lesson = source.lessons.find(item => item.id === 'DEV-01');
const runtimeLesson = runtime.lessons.find(item => item.id === 'DEV-01');

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-runtime-and-user-accepted');
assert.equal(evidence.previousCurriculumVersion, 'units-fb43b178cdf9');
assert.equal(evidence.curriculumVersion, 'units-c966b493bce4');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, ['DEV-01']);
assert.deepEqual(evidence.contractRules, [13, 14, 17, 23, 27, 29, 32, 34, 35]);
assert.equal(evidence.diagnosis.boundaryDecision,
  '删除独立辨析，将社会主义初级阶段限定并入新发展阶段定义正文。');
assert.equal(evidence.realUserAcceptance, 'passed');
assert.equal(evidence.releaseAuthorized, false);
for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}
assert.equal(digest(evidence.userAcceptancePath), evidence.userAcceptanceSha256);
assert.equal(digest(evidence.predecessorUserFeedbackPath), evidence.predecessorUserFeedbackSha256);
assert.equal(feedback.status, 'partial');
assert.deepEqual(feedback.passedLessonIds, ['TEN-03', 'HISTORY-04', 'BASICS-01', 'UNITYFOREIGN-01']);

assert.equal(lesson.question, '新发展阶段和高质量发展分别是什么？');
assert.equal(lesson.reflection.prompt, lesson.question);
assert.deepEqual(lesson.sections.map(part => part.label), [
  '新发展阶段的含义',
  '高质量发展的含义',
  '新发展阶段与高质量发展的区别',
]);
assert.equal(lesson.boundary, undefined);
assert.match(lesson.sections[0].text, /新发展阶段仍属于社会主义初级阶段/);
assert.match(lesson.sections[0].text, /基本国情没有变/);
assert.match(lesson.sections[1].text, /从“有没有”转向“好不好”/);
assert.match(lesson.sections[2].text, /历史方位/);
assert.match(lesson.sections[2].text, /发展主题和质量要求/);
assert.doesNotMatch(JSON.stringify(lesson), /质量：从有没有转向好不好|分别说明什么/);
assert.deepEqual(lesson.sections[1].sourceBlockIds, [
  'block:politics-toc-v2-u007:b002',
  'block:politics-toc-v2-u007:b003',
]);
assert.deepEqual(lesson.recap.sourceBlockIds, [
  'block:politics-toc-v2-u007:b002',
  'block:politics-toc-v2-u007:b003',
  'block:politics-toc-v2-u007:b005',
  'block:politics-toc-v2-u007:b007',
]);
assert.deepEqual(lesson.reflection.sourceBlockIds, [
  'block:politics-toc-v2-u007:b003',
  'block:politics-toc-v2-u007:b005',
  'block:politics-toc-v2-u007:b007',
]);

assert.deepEqual(runtimeLesson.parts.map(part => part.label), [
  '新发展阶段的含义',
  '高质量发展的含义',
  '新发展阶段与高质量发展的区别',
  '本节结论',
]);
assert.equal(runtimeLesson.parts.some(part => part.kind === 'boundary'), false);
assert.equal(runtimeLesson.parts.find(part => part.kind === 'recap').emphasized, true);

assert.equal(ai.curriculumVersion, runtime.curriculumVersion);
assert.equal(ai.sourceSha256, evidence.sourceSha256);
assert.deepEqual(ai.lessonIds, ['DEV-01']);
for (const roleId of ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert']) {
  assert.equal(ai.roles[roleId].status, 'pass');
  assert.equal(ai.roles[roleId].riskCount, 0);
  assert.equal(ai.roles[roleId].holdCount, 0);
}

assert.equal(probe.status, 'passed');
assert.equal(probe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(probe.lessonIds, ['DEV-01']);
assert.equal(probe.compileSuccess, true);
assert.equal(probe.automatorVerified, true);
const screen = probe.screens[0];
assert.equal(screen.lessonId, 'DEV-01');
assert.equal(screen.question, lesson.question);
assert.deepEqual(screen.partLabels, runtimeLesson.parts.map(part => part.label));
assert.equal(screen.dom.redundantBoundaryAbsent, true);
assert.equal(screen.dom.recapEmphasisRendered, true);
assert.equal(probe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);
assert.equal(acceptance.status, 'passed');
assert.equal(acceptance.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(acceptance.lessonIds, ['DEV-01']);
assert.equal(acceptance.constraintsRegisteredInRule, 35);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  changedLessonIds: ['DEV-01'],
  boundaryRemoved: true,
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  realUserAcceptance: 'passed',
}));
