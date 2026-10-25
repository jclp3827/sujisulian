#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p7';
const lessonIds = ['VALUE-03', 'DEV-03', 'DEV-07', 'LIVELIHOOD-02', 'SUPPORT-02'];
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261024.json');
const predecessor = read('docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p6r1-20261024.json');
const acceptance = read(predecessor.userAcceptancePath);
const userAcceptance = read(evidence.userAcceptancePath);
const source = read(evidence.sourcePath);
delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
delete require.cache[require.resolve('../miniprogram/services/knowledge-platform/systematic-units')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');
const ai = read(evidence.aiReviewPath);
const probe = read(evidence.runtimeProbePath);
const retrospective = read(evidence.retrospectiveAuditPath);
const { latest } = validateUserComprehensionLineage(root, batch);
const lessons = Object.fromEntries(lessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
const runtimeLessons = Object.fromEntries(lessonIds.map(id => [id, runtime.lessons.find(item => item.id === id)]));

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified-retrospective-open');
assert.equal(evidence.previousCurriculumVersion, 'units-f31cdabad8b8');
assert.equal(evidence.curriculumVersion, 'units-f7bce4b31d42');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, lessonIds);
assert.deepEqual(evidence.uiProjectionAffectedLessonIds, lessonIds);
assert.equal(evidence.realUserAcceptance, 'passed');
assert.equal(userAcceptance.status, 'passed');
assert.equal(userAcceptance.curriculumVersion, evidence.curriculumVersion);
assert.deepEqual(userAcceptance.lessonIds, lessonIds);
assert.equal(digest(evidence.userAcceptancePath), evidence.userAcceptanceSha256);
assert.equal(evidence.releaseAuthorized, false);
assert.equal(predecessor.realUserAcceptance, 'passed');
assert.equal(acceptance.status, 'passed');
assert.equal(digest(predecessor.userAcceptancePath), predecessor.userAcceptanceSha256);
for (const name of ['source', 'inventory', 'runtime', 'projection', 'aiReview', 'runtimeProbe', 'retrospectiveAudit']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}

for (const id of lessonIds) {
  assert.ok(lessons[id] && runtimeLessons[id], id + ' missing');
  assert.equal(lessons[id].boundary, undefined, id + ' boundary remains');
  assert.equal(lessons[id].reflection.prompt, lessons[id].question, id + ' question drift');
  assert.equal(lessons[id].recap.label, '本节结论', id + ' recap label drift');
  assert.equal(runtimeLessons[id].parts.at(-1).kind, 'recap', id + ' recap position drift');
  assert.equal(runtimeLessons[id].parts.at(-1).emphasized, true, id + ' recap emphasis drift');
}

const value = lessons['VALUE-03'];
assert.equal(value.sections.length, 3);
assert.match(value.sections[0].text, /不是生产商品的个别劳动时间，而是社会必要劳动时间/);
assert.match(value.sections[2].text, /社会必要劳动时间成正比/);
assert.match(value.sections[2].text, /社会劳动生产率成反比/);
assert.doesNotMatch(JSON.stringify(value), /价值规律与价格波动/);
assert.deepEqual(value.recap.sourceBlockIds, [
  'block:politics-toc-v2-u035:b004', 'block:politics-toc-v2-u035:b007', 'block:politics-toc-v2-u035:b012',
]);

const pattern = lessons['DEV-03'];
assert.equal((pattern.sections[0].text.match(/不是各地都搞自我小循环/g) || []).length, 1);
assert.match(pattern.reflection.answer, /基础支撑和内在要求/);
assert.match(pattern.reflection.answer, /关键在于经济循环畅通无阻/);
assert.match(pattern.reflection.answer, /最本质特征/);

const region = lessons['DEV-07'];
assert.deepEqual(region.sections.map(item => item.label), [
  '区域协调发展战略', '区域重大战略', '主体功能区战略', '新型城镇化',
]);
assert.match(region.sections[1].text, /五项|京津冀/);
assert.match(region.sections[1].text, /雄安新区/);
assert.match(region.sections[1].text, /成渝地区双城经济圈/);

const livelihood = lessons['LIVELIHOOD-02'];
assert.deepEqual(livelihood.sections.map(item => item.label), ['社会保障体系', '健康中国建设']);
assert.ok(livelihood.sections[1].emphasis.some(item => item.quote.includes('社会文明进步的基础')));
assert.deepEqual(livelihood.corePromises.map(item => item.sourceBlockIds.length), [1, 1, 1, 1, 1, 1]);

const support = lessons['SUPPORT-02'];
assert.deepEqual(support.sections.map(item => item.label), ['基础研究与应用研究的作用', '人才评价标准']);
assert.doesNotMatch(JSON.stringify(support), /企业是科技创新的主体|人才培养为创新提供主体条件/);
assert.match(support.sections[1].text, /破除唯论文、唯职称、唯学历、唯奖项/);
assert.deepEqual(support.corePromises.map(item => item.sourceBlockIds.length), [1, 1, 1]);

assert.equal(ai.curriculumVersion, runtime.curriculumVersion);
assert.equal(ai.sourceSha256, evidence.sourceSha256);
assert.equal(ai.projectionSha256, evidence.projectionSha256);
assert.deepEqual(ai.lessonIds, lessonIds);
for (const roleId of ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert']) {
  assert.equal(ai.roles[roleId].status, 'pass');
  assert.equal(ai.roles[roleId].riskCount, 0);
  assert.equal(ai.roles[roleId].holdCount, 0);
  assert.deepEqual(Object.keys(ai.roles[roleId].lessonAssertions), lessonIds);
  assert.ok(ai.roles[roleId].priorRisks.length > 0, roleId + ' prior risks missing');
}

assert.equal(probe.status, 'passed');
assert.equal(probe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(probe.lessonIds, lessonIds);
assert.equal(probe.compileSuccess, true);
assert.equal(probe.automatorVerified, true);
assert.equal(probe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);
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

assert.equal(retrospective.status, 'risk-open');
assert.equal(retrospective.curriculumVersion, runtime.curriculumVersion);
assert.equal(retrospective.scope.historicallyChangedLessonCount, 41);
assert.equal(retrospective.scope.currentBoundaryLessonCount, 37);
assert.equal(retrospective.scope.totalGroupCount, 21);
assert.equal(retrospective.scope.totalLessonCount, 72);
assert.equal(retrospective.scope.sectionEmphasisGapCount, 18);
assert.deepEqual(retrospective.metaReview.retainedHoldLessonIds, ['CAPITAL-02']);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  contentChangedLessonIds: lessonIds,
  aiReview: 'passed',
  runtimePageCheck: 'passed',
  retrospectiveAudit: 'risk-open',
  realUserAcceptance: 'passed',
}));
