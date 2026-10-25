#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p4';
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261023.json');
const source = read(evidence.sourcePath);
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const { latest } = validateUserComprehensionLineage(root, batch);
const ids = ['DEV-01', 'TEN-03', 'HISTORY-04', 'BASICS-01', 'UNITYFOREIGN-01'];
const lesson = id => source.lessons.find(item => item.id === id);
const runtimeLesson = id => runtime.lessons.find(item => item.id === id);

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.previousCurriculumVersion, 'units-20d954d32b62');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, ids);
assert.deepEqual(evidence.uiProjectionAffectedLessonIds, ids);
assert.deepEqual(evidence.contractRules, [17, 21, 23, 27, 29, 31, 32, 33, 34]);
assert.equal(evidence.diagnosis.staleFrontendOrCache, false);
assert.deepEqual(evidence.diagnosis.removedBoundaryLessonIds,
  ['HISTORY-04', 'BASICS-01', 'UNITYFOREIGN-01']);
assert.deepEqual(evidence.diagnosis.retainedBoundaryLessonIds, ['DEV-01', 'TEN-03']);
assert.deepEqual(evidence.diagnosis.conclusionCoverageFixedLessonIds,
  ['DEV-01', 'HISTORY-04', 'BASICS-01', 'UNITYFOREIGN-01']);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);

for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

const development = lesson('DEV-01');
assert.equal(development.question, '新发展阶段和高质量发展分别说明什么？');
assert.equal(development.sections[0].label, '高质量发展是发展主题');
assert.equal(development.boundary.label, '新发展阶段仍属于社会主义初级阶段');
assert.deepEqual(development.boundary.sourceBlockIds, [
  'block:politics-toc-v2-u007:b007',
  'block:politics-toc-v2-u001:b012',
]);
assert.deepEqual(development.recap.sourceBlockIds, [
  'block:politics-toc-v2-u007:b002',
  'block:politics-toc-v2-u007:b003',
  'block:politics-toc-v2-u007:b057',
]);
assert.match(development.recap.text, /历史方位/);
assert.match(development.recap.text, /发展主题和质量要求/);

const ten = lesson('TEN-03');
assert.doesNotMatch(ten.scopeLimit, /复习线索|正式分类/);
assert.match(ten.sections[3].text, /推动高质量发展、统筹发展和安全/);
assert.equal(ten.boundary.label, '国内大循环不是地方自我循环');
assert.deepEqual(ten.boundary.sourceBlockIds, ['block:politics-toc-v2-u007:b017']);

const history = lesson('HISTORY-04');
assert.equal(history.boundary, undefined);
assert.equal(history.question, '人民群众的决定作用与杰出人物的作用是什么关系？');
assert.match(history.recap.text, /人民群众是历史创造的决定力量/);
assert.match(history.recap.text, /受社会历史条件和人民群众实践制约/);
assert.deepEqual(history.recap.sourceBlockIds, [
  'block:politics-toc-v2-u032:b003',
  'block:politics-toc-v2-u032:b006',
]);

const basics = lesson('BASICS-01');
assert.equal(basics.boundary, undefined);
assert.equal(basics.question, '马克思主义的三个组成部分、直接理论来源和两大发现分别是什么？');
assert.equal(basics.sections[1].label, '两大发现与科学社会主义');
assert.doesNotMatch(JSON.stringify(basics.sections), /1848年|理论联系实际|学习方法各有作用/);
assert.doesNotMatch(JSON.stringify(basics.corePromises), /1848年|理论联系实际/);
for (const phrase of ['马克思主义哲学', '德国古典哲学', '唯物史观和剩余价值学说']) {
  assert.match(basics.recap.text, new RegExp(phrase));
}

const unity = lesson('UNITYFOREIGN-01');
assert.equal(unity.boundary, undefined);
assert.equal(unity.question, '一国两制的前提、最高原则和管治权关系分别是什么？');
assert.equal(unity.sections[0].label, '“一国”是“两制”的前提和基础');
assert.equal(unity.sections[1].label, '最高原则与管治权关系');
assert.doesNotMatch(unity.sections[1].text, /提出|首先实践|台湾|香港、澳门|中央对特别行政区拥有/);
assert.match(unity.sections[1].text, /国家主权、安全、发展利益/);
assert.match(unity.sections[1].text, /全面管治权是特别行政区高度自治的前提和基础/);

for (const id of ['HISTORY-04', 'BASICS-01', 'UNITYFOREIGN-01']) {
  assert.equal(runtimeLesson(id).parts.some(part => part.kind === 'boundary'), false, id);
}
for (const id of ['DEV-01', 'TEN-03']) {
  assert.ok(runtimeLesson(id).parts.some(part => part.kind === 'boundary'), id);
  assert.notEqual(runtimeLesson(id).parts.find(part => part.kind === 'boundary').emphasized, true, id);
}
for (const id of ids) {
  assert.equal(runtimeLesson(id).parts.find(part => part.kind === 'recap').emphasized, true, id);
  const authored = lesson(id);
  const visible = [authored.question, authored.scopeLimit, ...authored.sections.map(part => part.label + part.text), authored.recap.text, authored.reflection.prompt, authored.reflection.answer].join('\n');
  assert.doesNotMatch(visible, /先确定|接下来|留到下一节|复习线索/);
}

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
  if (['DEV-01', 'TEN-03'].includes(id)) {
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

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  changedLessonIds: ids,
  removedBoundaries: 3,
  retainedBoundaries: 2,
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  realUserAcceptance: 'pending',
}));
