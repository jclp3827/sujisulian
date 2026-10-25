const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const evidencePath = path.join(root,
  'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p0-20261023.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
const inventory = JSON.parse(fs.readFileSync(path.join(root, evidence.inventoryPath), 'utf8'));
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const units = require('../miniprogram/services/knowledge-platform/systematic-units');
const aiReview = JSON.parse(fs.readFileSync(path.join(root, evidence.aiReviewPath), 'utf8'));
const runtimeProbe = JSON.parse(fs.readFileSync(path.join(root, evidence.runtimeProbePath), 'utf8'));
const acceptance = JSON.parse(fs.readFileSync(path.join(root, evidence.acceptancePath), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const { latest } = validateUserComprehensionLineage(root, evidence.batchId);
const lesson = id => source.lessons.find(item => item.id === id);
const runtimeLesson = id => runtime.lessons.find(item => item.id === id);
const screen = id => runtimeProbe.screens.find(item => item.lessonId === id);

assert.equal(latest.batchId, evidence.batchId);
assert.equal(runtime.curriculumVersion, evidence.curriculumVersion);
assert.equal(evidence.status, 'candidate-integrated-and-runtime-verified');
assert.equal(evidence.previousCurriculumVersion, 'units-f9a9b46b6499');
assert.equal(evidence.priorAcceptedCandidateVersion, 'units-6a0aec3b2232');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.deepEqual(evidence.changedLessonIds, ['SYS-02', 'LEADERSHIP-01']);
assert.ok(evidence.contractRules.includes(28));
assert.equal(evidence.releaseAuthorized, false);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.aiReview, 'passed');
assert.equal(evidence.runtimePageCheck, 'passed');
assert.equal(digest(evidence.sourcePath), evidence.sourceSha256);
assert.equal(digest(evidence.inventoryPath), evidence.inventorySha256);
assert.equal(digest(evidence.runtimePath), evidence.runtimeSha256);
assert.equal(digest(evidence.displayProjectionPath), evidence.displayProjectionSha256);
assert.equal(digest(evidence.aiReviewPath), evidence.aiReviewSha256);
assert.equal(digest(evidence.runtimeProbePath), evidence.runtimeProbeSha256);
assert.equal(digest(evidence.acceptancePath), evidence.acceptanceSha256);
assert.equal(source.lessons.length, 72);
assert.deepEqual(runtime.lessons.map(item => item.id), source.lessons.map(item => item.id));
assert.ok(runtime.progressCompatibleVersions.includes(evidence.previousCurriculumVersion));
assert.ok(runtime.progressCompatibleVersions.includes(evidence.priorAcceptedCandidateVersion));

const sys = lesson('SYS-02');
assert.equal(sys.title, '十四个坚持·一至七');
assert.equal(sys.question, '“十四个坚持”的前七项是什么？');
assert.deepEqual(sys.objectives, ['理解“十四个坚持”前七项的内容']);
assert.equal(sys.reflection.prompt, sys.question);
assert.deepEqual(sys.sections.map(item => item.label), [
  '党的领导与人民立场（第1—2项）',
  '全面深化改革与新发展理念（第3—4项）',
  '人民当家作主、全面依法治国与社会主义核心价值体系（第5—7项）',
]);
assert.ok(sys.sections.every(item => !item.label.startsWith('第')));
assert.match(sys.sections[0].text, /前两项是坚持党对一切工作的领导和坚持以人民为中心/);
assert.match(sys.sections[1].text, /第3—4项分别是坚持全面深化改革和坚持新发展理念/);
assert.match(sys.sections[2].text, /第5—7项依次是坚持人民当家作主、坚持全面依法治国和坚持社会主义核心价值体系/);
assert.deepEqual(sys.sections[0].sourceBlockIds, ['block:politics-toc-v2-u003:b016']);
assert.equal(sys.boundary.label, '前七项与后七项');
assert.match(sys.recap.text, /依次涉及党的领导、人民立场、全面深化改革、新发展理念/);
assert.match(sys.reflection.answer, /坚持党对一切工作的领导/);
assert.equal(units.displayTitleForLessonId(sys.id), sys.title);

const leadership = lesson('LEADERSHIP-01');
assert.equal(leadership.title, '党的领导与国家机关职能');
assert.equal(leadership.question, '党的领导与国家机关具体职能是什么关系？');
assert.equal(leadership.reflection.prompt, leadership.question);
assert.deepEqual(leadership.sections.map(item => item.label), [
  '党的领导地位',
  '党的领导制度',
  '国家机关承担具体职能',
]);
assert.match(leadership.sections[2].text, /具体国家机关各自承担相应职能/);
assert.equal(leadership.boundary.label, '党的领导不代替国家机关具体履职');
assert.match(leadership.boundary.text, /党的领导不能代替国家机关履行具体职能/);
assert.equal(units.displayTitleForLessonId(leadership.id), leadership.title);

const forbidden = /前七项的正式名称|第四项是坚持全面深化改革，第五项是坚持新发展理念|领导不等于代替一切|党的领导制度不在此展开完整清单/;
for (const item of [sys, leadership]) {
  const text = [item.title, item.question, ...item.objectives,
    ...item.sections.flatMap(part => [part.label, part.text]),
    item.boundary.label, item.boundary.text, item.recap.label, item.recap.text,
    item.reflection.prompt, item.reflection.answer].join('\n');
  assert.doesNotMatch(text, forbidden);
  assert.deepEqual(runtimeLesson(item.id).parts.map(part => part.label), [
    ...item.sections.map(part => part.label), item.boundary.label, item.recap.label,
  ]);
}

assert.equal(aiReview.curriculumVersion, runtime.curriculumVersion);
assert.equal(aiReview.sourceSha256, evidence.sourceSha256);
assert.deepEqual(aiReview.lessonIds, evidence.changedLessonIds);
assert.ok(Object.values(aiReview.roles).every(role => role.status === 'pass'));
assert.ok(Object.values(aiReview.roles).every(role => role.riskCount === 0 && role.holdCount === 0));
assert.equal(runtimeProbe.status, 'passed');
assert.equal(runtimeProbe.curriculumVersion, runtime.curriculumVersion);
assert.deepEqual(runtimeProbe.lessonIds, evidence.changedLessonIds);
assert.equal(runtimeProbe.compileSuccess, true);
assert.equal(runtimeProbe.automatorVerified, true);
assert.equal(runtimeProbe.runtimePageCheck, 'passed');
assert.equal(runtimeProbe.progressProtection.previousCurriculumVersion, evidence.priorAcceptedCandidateVersion);
assert.equal(runtimeProbe.progressProtection.migratedCurriculumVersion, runtime.curriculumVersion);
assert.equal(runtimeProbe.progressProtection.activeGroupBeforeAndAfter, 'framework');
assert.equal(runtimeProbe.progressProtection.currentStepBeforeAndAfter, 'systematic-unit:SYS-03');
assert.deepEqual(runtimeProbe.progressProtection.completedStepIdsBeforeAndAfter,
  ['systematic-unit:SYS-01', 'systematic-unit:SYS-02']);
assert.deepEqual(runtimeProbe.progressProtection.skippedStepIdsBeforeAndAfter, []);
assert.equal(runtimeProbe.progressProtection.temporaryNavigationRestored, true);
assert.equal(runtimeProbe.progressProtection.completionStateChangedByProbe, false);
for (const item of [sys, leadership]) {
  const projected = runtimeLesson(item.id);
  const actual = screen(item.id);
  assert.equal(actual.screen, 'lesson');
  assert.equal(actual.title, units.displayTitleForLessonId(item.id));
  assert.equal(actual.question, item.question);
  assert.equal(actual.outcomeSummary, item.objectives.join('；'));
  assert.deepEqual(actual.partLabels, projected.parts.map(part => part.label));
  assert.deepEqual(actual.partTexts, projected.parts.map(part => part.text));
  assert.equal(actual.reflection.prompt, item.reflection.prompt);
  assert.equal(actual.reflection.answer, item.reflection.answer);
}

assert.equal(acceptance.curriculumVersion, evidence.previousCurriculumVersion);
assert.equal(acceptance.acceptedScope, 'core-question-and-calibration-direction');
assert.equal(acceptance.expansionAuthorized, true);
const inventoryIds = new Set(inventory.units.flatMap(item => [
  ...(item.defaultReferencingLessonIds || []),
  ...(item.primaryLessonIds || []),
]));
assert.ok(inventoryIds.has('SYS-02'));
assert.ok(inventoryIds.has('LEADERSHIP-01'));

console.log(JSON.stringify({
  status: 'passed',
  batch: evidence.batchId,
  curriculumVersion: runtime.curriculumVersion,
  changedLessonIds: evidence.changedLessonIds,
  aiReview: evidence.aiReview,
  runtimePageCheck: evidence.runtimePageCheck,
  realUserAcceptance: evidence.realUserAcceptance,
  displayTitlesVerified: true,
  progressRestored: true,
}));
