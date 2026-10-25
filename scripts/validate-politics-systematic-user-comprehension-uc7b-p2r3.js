#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p2r3';
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261023.json');
const source = read(evidence.sourcePath);
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const acceptance = read(evidence.userAcceptancePath);
const { latest } = validateUserComprehensionLineage(root, batch);

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-runtime-and-user-accepted');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.previousCurriculumVersion, 'units-63b49b4c1d38');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, ['VALUE-02', 'DEV-03']);
assert.deepEqual(evidence.uiProjectionAffectedLessonIds, ['VALUE-02', 'DEV-03']);
assert.deepEqual(evidence.contractRules, [21, 23, 27, 29, 31, 32, 33, 34]);
assert.equal(evidence.diagnosis.staleFrontendOrCache, false);
assert.equal(evidence.diagnosis.staleAuthoredContent, true);
assert.equal(evidence.realUserAcceptance, 'passed');
assert.equal(evidence.releaseAuthorized, false);

for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe', 'userAcceptance']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

const value = source.lessons.find(lesson => lesson.id === 'VALUE-02');
const valueRuntime = runtime.lessons.find(lesson => lesson.id === 'VALUE-02');
assert.equal(value.boundary, undefined);
assert.equal(valueRuntime.parts.some(part => part.kind === 'boundary'), false);
assert.doesNotMatch(value.sections[0].text, /不是先做完一种劳动|另外做第二种劳动/);
assert.deepEqual(value.sections[0].sourceBlockIds, [
  'block:politics-toc-v2-u033:b003',
  'block:politics-toc-v2-u034:b002',
]);
assert.match(value.sections[2].text, /“抽象”表示观察角度，不是另一次独立劳动/);
assert.match(value.recap.text, /同一劳动过程的两个方面/);
assert.equal(value.recap.label, '本节结论');
assert.equal(valueRuntime.parts.find(part => part.kind === 'recap').emphasized, true);

const control = source.lessons.find(lesson => lesson.id === 'DEV-03');
const controlRuntime = runtime.lessons.find(lesson => lesson.id === 'DEV-03');
assert.ok(control.boundary);
assert.equal(control.question, '新发展格局的基本内容和构建要求是什么？');
assert.equal(control.reflection.prompt, control.question);
assert.equal(control.sections[0].label, '国内大循环与国内国际双循环');
assert.equal(control.sections[1].label, '全国统一大市场与经济循环');
assert.equal(control.sections[2].label, '发展主动权与自立自强');
assert.equal(control.boundary.label, '国内大循环不是地方自我循环');
assert.equal(control.sections[0].text, '新发展格局以国内大循环为主体、国内国际双循环相互促进。');
assert.equal(control.sections[1].text, '全国统一大市场是构建新发展格局的基础支撑和内在要求，关键在于经济循环畅通无阻。');
assert.deepEqual(control.sections[1].sourceBlockIds, [
  'block:politics-toc-v2-u007:b018',
  'block:politics-toc-v2-u007:b019',
]);
assert.deepEqual(control.boundary.sourceBlockIds, ['block:politics-toc-v2-u007:b017']);
assert.equal(control.recap.sourceBlockIds.includes('block:politics-toc-v2-u007:b017'), false);
assert.equal(control.reflection.sourceBlockIds.includes('block:politics-toc-v2-u007:b017'), false);
assert.doesNotMatch(control.reflection.answer, /地方自我循环|自我封闭循环/);
assert.match(control.recap.text, /国内大循环为主体、国内国际双循环相互促进/);
assert.match(control.recap.text, /全国统一大市场.*畅通经济循环.*高水平自立自强/);
assert.doesNotMatch(control.recap.text, /现在可以区分|接下来|转向/);
assert.ok(controlRuntime.parts.find(part => part.kind === 'boundary'));
assert.notEqual(controlRuntime.parts.find(part => part.kind === 'boundary').emphasized, true);
assert.equal(controlRuntime.parts.find(part => part.kind === 'recap').emphasized, true);

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
const valueScreen = probe.screens.find(screen => screen.lessonId === 'VALUE-02');
const controlScreen = probe.screens.find(screen => screen.lessonId === 'DEV-03');
assert.equal(valueScreen.recapLabel, '本节结论');
assert.equal(valueScreen.dom.redundantBoundaryAbsent, true);
assert.equal(valueScreen.dom.recapEmphasisRendered, true);
assert.equal(controlScreen.dom.secondaryBoundaryRendered, true);
assert.equal(controlScreen.dom.boundaryUsesConclusionEmphasis, false);
assert.equal(controlScreen.dom.recapEmphasisRendered, true);
for (const field of ['existingProgressBeforeProbe', 'temporaryNavigationStorageFree', 'storageRecordByteEquivalent']) {
  assert.equal(probe.progressProtection[field], true);
}
assert.equal(probe.progressProtection.testedCurriculumVersion, runtime.curriculumVersion);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);

assert.equal(acceptance.status, 'passed');
assert.equal(acceptance.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(acceptance.lessonIds, evidence.probeLessonIds);
assert.equal(acceptance.constraintsRegisteredInRule, 34);
assert.equal(acceptance.releaseAuthorized, false);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  changedLessonIds: evidence.contentChangedLessonIds,
  removedBoundary: 'VALUE-02',
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  realUserAcceptance: 'passed',
}));
