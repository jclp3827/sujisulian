#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');
const { buildLessonReviewPaths } = require('./lib/politics-systematic-review-paths');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p10';
const lessonIds = ['TEN-01', 'MOD-02'];
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const evidence = read(`docs/knowledge-platform/implementations/evidence/${batch}-20261024.json`);
const predecessor = read('docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p9-20261024.json');
const acceptance = read(predecessor.userAcceptancePath);
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

assert.equal(latest.batchId, batch);
assert.equal(evidence.status, 'candidate-integrated-runtime-verified-audit-open');
assert.equal(evidence.previousCurriculumVersion, 'units-76d5848b487c');
assert.equal(evidence.curriculumVersion, 'units-6778361628b2');
assert.equal(evidence.curriculumVersion, runtime.curriculumVersion);
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.contentChangedLessonIds, lessonIds);
assert.equal(evidence.uiProjectionAffectedLessonIds.length, 72);
assert.deepEqual(evidence.contractRules, [32, 34, 38, 42, 43, 44, 45, 46, 47]);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);
assert.equal(predecessor.realUserAcceptance, 'passed');
assert.equal(acceptance.status, 'passed');
assert.equal(digest(predecessor.userAcceptancePath), predecessor.userAcceptanceSha256);
for (const name of ['source', 'inventory', 'runtime', 'projection', 'wxml', 'wxss', 'governance', 'historicalRegionAudit', 'retrospectiveAudit', 'runtimeProbe']) {
  assert.equal(digest(evidence[name + 'Path']), evidence[name + 'Sha256'], name + ' hash drift');
}
assert.deepEqual(evidence.reviewPaths, Object.fromEntries(lessonIds.map(id => [id, expectedPaths[id]])));

const ten = source.lessons.find(item => item.id === 'TEN-01');
const modern = source.lessons.find(item => item.id === 'MOD-02');
const runtimeTen = runtime.lessons.find(item => item.id === 'TEN-01');
const runtimeModern = runtime.lessons.find(item => item.id === 'MOD-02');
assert.equal(ten.boundary.label, '主要矛盾变化不改变基本国情');
assert.equal([ten.sections[2].text, ten.boundary.text, ten.recap.text].filter(text => /基本国情/.test(text)).length, 1);
assert.match(ten.recap.text, /依次明确党的领导地位/);
assert.doesNotMatch(ten.recap.text, /第1条明确|第2条明确|第3条明确/);
assert.equal(modern.boundary, undefined);
assert.match(modern.recap.text, /五个方面/);
assert.doesNotMatch(modern.recap.text, /中国式现代化是人口规模巨大的现代化/);
assert.deepEqual(runtimeTen.parts.map(part => part.kind), ['explanation', 'explanation', 'explanation', 'boundary', 'recap']);
assert.equal(runtimeTen.parts.at(-1).emphasized, true);
assert.equal(runtimeModern.parts.some(part => part.kind === 'boundary'), false);
assert.equal(runtimeModern.parts.at(-1).emphasized, true);

const projected = projection.projectLessonPart({
  id: 'fixture-recap', kind: 'recap', label: '本节结论',
  text: '第一项；第二项；第三项', sourceBlockIds: [], emphasized: true,
});
assert.equal(projected.paragraphs.length, 3);
assert.deepEqual(projected.paragraphs.map(item => item.runs.map(run => run.text).join('')), ['第一项', '第二项', '第三项']);

assert.equal(audit.status, 'risk-open');
assert.equal(audit.scope.reviewedLessonCount, 45);
assert.equal(audit.scope.previouslyAcceptedLessonCount, 44);
assert.equal(audit.scope.fixedInP10Count, 2);
assert.equal(audit.scope.passedCount, 31);
assert.equal(audit.scope.openRiskCount, 11);
assert.equal(audit.scope.retainedHoldCount, 1);
assert.deepEqual([...audit.fixedLessonIds].sort(), [...lessonIds].sort());
assert.deepEqual(audit.retainedHoldLessonIds, ['CAPITAL-02']);

assert.equal(retrospective.curriculumVersion, runtime.curriculumVersion);
assert.equal(retrospective.scope.currentBoundaryLessonCount, 28);
assert.deepEqual(retrospective.rulesActivated, [38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);

assert.equal(probe.status, 'passed');
assert.equal(probe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(probe.lessonIds, ['TEN-01', 'MOD-02', 'TEN-02']);
assert.equal(probe.compileSuccess, true);
assert.equal(probe.wxmlErrors.length, 0);
assert.equal(probe.automatorVerified, true);
assert.equal(probe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(probe.progressProtection.completionStateChangedByProbe, false);
assert.equal(probe.paragraphProjection.controlRecapParagraphCount, 3);
assert.deepEqual(probe.paragraphProjection.controlRecapParagraphTexts, [
  '第4条明确，“五位一体”总体布局包括经济建设、政治建设、文化建设、社会建设、生态文明建设，“四个全面”战略布局包括全面建设社会主义现代化国家、全面深化改革、全面依法治国、全面从严治党',
  '第5条明确全面深化改革总目标是完善和发展中国特色社会主义制度、推进国家治理体系和治理能力现代化',
  '第6条明确全面依法治国总目标是建设中国特色社会主义法治体系、建设社会主义法治国家。',
]);

const tenScreen = probe.screens.find(item => item.lessonId === 'TEN-01');
const modernScreen = probe.screens.find(item => item.lessonId === 'MOD-02');
assert.ok(tenScreen.partKinds.includes('boundary'));
assert.equal(tenScreen.partTexts.filter(text => /基本国情/.test(text)).length, 1);
assert.equal(modernScreen.partKinds.includes('boundary'), false);
assert.equal(tenScreen.partTexts.at(-1), ten.recap.text);
assert.equal(modernScreen.partTexts.at(-1), modern.recap.text);

console.log(JSON.stringify({
  status: 'passed',
  batch,
  curriculumVersion: runtime.curriculumVersion,
  contentChangedLessonIds: lessonIds,
  historicalRegionAudit: 'risk-open',
  reviewedHistoricalLessons: audit.scope.reviewedLessonCount,
  openRiskCount: audit.scope.openRiskCount,
  runtimePageCheck: 'passed',
  aiReview: evidence.aiReview,
  realUserAcceptance: evidence.realUserAcceptance,
}));
