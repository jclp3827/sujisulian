#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');
const { buildLessonReviewPaths } = require('./lib/politics-systematic-review-paths');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p9';
const lessonIds = ['DEV-02', 'DEV-05', 'DEV-06', 'MOD-02', 'SYS-01'];
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read('docs/knowledge-platform/implementations/evidence/' + batch + '-20261024.json');
const userAcceptance = read('docs/knowledge-platform/implementations/evidence/' + batch + '-user-acceptance-20261024.json');
const predecessor = read('docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p8-20261024.json');
const acceptance = read(predecessor.userAcceptancePath);
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
const expectedReviewPaths = buildLessonReviewPaths(source, projection.displayTitleForLessonId);

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified-retrospective-open');
assert.equal(evidence.previousCurriculumVersion, 'units-9cbea1ee7d98');
assert.equal(evidence.curriculumVersion, 'units-76d5848b487c');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, lessonIds);
assert.equal(evidence.realUserAcceptance, 'passed');
assert.equal(evidence.userAcceptancePath, 'docs/knowledge-platform/implementations/evidence/' + batch + '-user-acceptance-20261024.json');
assert.equal(digest(evidence.userAcceptancePath), evidence.userAcceptanceSha256);
assert.equal(userAcceptance.status, 'passed');
assert.equal(userAcceptance.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(userAcceptance.lessonIds, lessonIds);
assert.equal(userAcceptance.futureAcceptancePathRequired, true);
assert.equal(userAcceptance.acceptancePathFormat, '<篇章>-<主题>-<小节>');
assert.equal(userAcceptance.batchContinuationAuthorized, false);
assert.equal(evidence.reviewPathFormat, '<篇章>-<主题>-<小节>');
assert.deepEqual(evidence.reviewPaths, Object.fromEntries(lessonIds.map(id => [id, expectedReviewPaths[id]])));
assert.deepEqual(userAcceptance.reviewPaths, Object.fromEntries(lessonIds.map(id => [id, expectedReviewPaths[id].displayPath])));
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

assert.deepEqual(lessons['DEV-02'].sections.map(item => item.label), ['创新理念', '协调理念', '绿色理念', '开放理念', '共享理念']);
for (const phrase of ['创新解决发展动力问题', '协调解决发展不平衡问题', '绿色解决人与自然和谐共生问题', '开放解决发展内外联动问题', '共享解决社会公平正义问题']) {
  assert.match(lessons['DEV-02'].reflection.answer, new RegExp(phrase));
}

assert.deepEqual(lessons['DEV-05'].sections.map(item => item.label), ['社会主义市场经济体制中的政府与市场', '市场在资源配置中的决定性作用', '更好发挥政府作用']);
assert.match(lessons['DEV-05'].recap.text, /市场在资源配置中起决定性作用/);
assert.match(lessons['DEV-05'].recap.text, /有效市场和有为政府更好结合/);

assert.deepEqual(lessons['DEV-06'].sections.map(item => item.label), ['乡村振兴的总目标与总方针', '乡村振兴的总要求与制度保障', '乡村振兴的首要任务']);
assert.equal(lessons['DEV-06'].corePromises.length, 5);

assert.equal(lessons['MOD-02'].question, '中国式现代化的五个中国特色分别是什么？');
assert.deepEqual(lessons['MOD-02'].sections.map(item => item.label), ['人口规模巨大与共同富裕', '物质精神协调与人与自然和谐共生', '走和平发展道路']);
assert.equal(lessons['MOD-02'].corePromises.length, 5);

const system = lessons['SYS-01'];
assert.deepEqual(system.sections.map(item => item.label), ['十个明确的定位', '十四个坚持的定位', '十三个方面成就的定位', '六个必须坚持的定位']);
assert.doesNotMatch(system.sections[2].text, /本节只说明|不展开/);
assert.match(system.reflection.answer, /对新时代伟大实践作出科学总结、展示理论与实践成果/);
assert.ok(system.sections[2].emphasis.some(item => item.quote.includes('作出科学总结，展示理论与实践成果')));

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
assert.equal(retrospective.scope.historicallyChangedLessonCount, 45);
assert.equal(retrospective.scope.currentBoundaryLessonCount, 27);
assert.equal(retrospective.scope.totalGroupCount, 21);
assert.equal(retrospective.scope.totalLessonCount, 72);
assert.equal(retrospective.scope.sectionEmphasisGapCount, 16);
assert.deepEqual(retrospective.metaReview.retainedHoldLessonIds, ['CAPITAL-02']);

console.log(JSON.stringify({
  status: 'passed', batch, curriculumVersion: runtime.curriculumVersion,
  contentChangedLessonIds: lessonIds, aiReview: 'passed', runtimePageCheck: 'passed',
  retrospectiveAudit: 'risk-open', realUserAcceptance: 'passed',
}));
