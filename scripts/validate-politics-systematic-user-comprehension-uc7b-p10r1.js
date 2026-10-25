#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');
const { buildLessonReviewPaths } = require('./lib/politics-systematic-review-paths');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p10r1';
const lessonIds = [
  'BASICS-01', 'BASICS-04', 'CULTUREECO-04', 'DEV-02', 'DEV-06',
  'LEADERSHIP-03', 'MONEY-02', 'REFORMLAW-03', 'SYS-01', 'TEN-02', 'TEN-04',
];
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read(`docs/knowledge-platform/implementations/evidence/${batch}-20261024.json`);
const source = read(evidence.sourcePath);
const audit = read(evidence.historicalRegionAuditPath);
const retrospective = read(evidence.retrospectiveAuditPath);
const probe = read(evidence.runtimeProbePath);
delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
delete require.cache[require.resolve('../miniprogram/services/knowledge-platform/systematic-units')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');
const { latest } = validateUserComprehensionLineage(root, batch);
const expectedPaths = buildLessonReviewPaths(source, projection.displayTitleForLessonId);
const lessons = Object.fromEntries(source.lessons.map(item => [item.id, item]));

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-runtime-verified-region-audit-passed');
assert.equal(evidence.revisionOf, 'politics-systematic-user-comprehension-uc7b-p10');
assert.equal(evidence.previousCurriculumVersion, 'units-6778361628b2');
assert.equal(evidence.curriculumVersion, 'units-5bf5826f6d68');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, lessonIds);
assert.equal(evidence.uiProjectionAffectedLessonIds.length, 72);
assert.deepEqual(evidence.contractRules, [32, 34, 38, 42, 43, 44, 45, 46, 47]);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);
for (const name of ['source', 'inventory', 'runtime', 'projection', 'wxml', 'wxss', 'governance', 'historicalRegionAudit', 'retrospectiveAudit', 'runtimeProbe']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}
assert.deepEqual(evidence.reviewPaths, Object.fromEntries(lessonIds.map(id => [id, expectedPaths[id]])));

assert.equal(lessons['BASICS-04'].boundary, undefined);
assert.equal(lessons['LEADERSHIP-03'].boundary, undefined);
assert.equal(lessons['REFORMLAW-03'].boundary.label, '重点不等于省略其他环节');
assert.equal(lessons['REFORMLAW-03'].boundary.text, '法治政府建设是重点任务和主体工程，不等于法治社会或其他建设环节可以省略。');
assert.match(lessons['BASICS-01'].recap.text, /理论结构、思想来源与重要发现/);
assert.match(lessons['CULTUREECO-04'].recap.text, /时间目标、国土空间开发保护的边界/);
assert.match(lessons['DEV-02'].recap.text, /五类问题/);
assert.match(lessons['DEV-06'].recap.text, /依靠什么制度保障/);
assert.match(lessons['MONEY-02'].recap.text, /三者发挥作用的条件和场景不同/);
assert.match(lessons['SYS-01'].recap.text, /四个层面/);
assert.match(lessons['TEN-02'].recap.text, /两个布局回答事业怎样展开/);
assert.match(lessons['TEN-04'].recap.text, /三个领域/);

assert.equal(audit.status, 'passed-with-retained-hold');
assert.equal(audit.scope.reviewedLessonCount, 45);
assert.equal(audit.scope.previouslyAcceptedLessonCount, 44);
assert.equal(audit.scope.fixedInP10Count, 2);
assert.equal(audit.scope.fixedInP10R1Count, 11);
assert.equal(audit.scope.fixedTotalCount, 13);
assert.equal(audit.scope.passedCount, 31);
assert.equal(audit.scope.openRiskCount, 0);
assert.deepEqual(audit.openRiskLessonIds, []);
assert.deepEqual(audit.retainedHoldLessonIds, ['CAPITAL-02']);
assert.equal(retrospective.scope.currentBoundaryLessonCount, 26);

assert.equal(probe.status, 'passed');
assert.equal(probe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(probe.lessonIds, lessonIds);
assert.equal(probe.compileSuccess, true);
assert.equal(probe.wxmlErrors.length, 0);
assert.equal(probe.automatorVerified, true);
assert.equal(probe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);
assert.deepEqual(probe.boundaryProjection.removedLessonIds, ['BASICS-04', 'LEADERSHIP-03']);
assert.deepEqual(probe.boundaryProjection.retainedAndNarrowedLessonIds, ['REFORMLAW-03']);
assert.deepEqual(probe.paragraphProjection.paragraphCounts, {
  'BASICS-04': 2, 'MONEY-02': 2, 'REFORMLAW-03': 2, 'TEN-02': 2,
});

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  contentChangedLessonCount: lessonIds.length,
  reviewedHistoricalLessons: audit.scope.reviewedLessonCount,
  openRiskCount: audit.scope.openRiskCount,
  retainedHoldLessonIds: audit.retainedHoldLessonIds,
  runtimePageCheck: evidence.runtimePageCheck,
  realUserAcceptance: evidence.realUserAcceptance,
}));
