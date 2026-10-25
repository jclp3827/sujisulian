const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const evidencePath = path.join(root, 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7a-20261023.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const aiReview = JSON.parse(fs.readFileSync(path.join(root, evidence.aiReviewPath), 'utf8'));
const runtimeProbe = JSON.parse(fs.readFileSync(path.join(root, evidence.runtimeProbePath), 'utf8'));
const acceptance = JSON.parse(fs.readFileSync(path.join(root,
  'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7a-user-acceptance-20261023.json'), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const { latest } = validateUserComprehensionLineage(root, evidence.batchId);
const lesson = source.lessons.find(item => item.id === 'COGNITION-02');
const runtimeLesson = runtime.lessons.find(item => item.id === 'COGNITION-02');

assert.equal(runtime.curriculumVersion, latest.curriculumVersion);
assert.ok(runtime.progressCompatibleVersions.includes(evidence.curriculumVersion));
assert.equal(evidence.previousCurriculumVersion, 'units-08f86cd989a7');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.equal(digest(evidence.aiReviewPath), evidence.aiReviewSha256);
assert.equal(digest(evidence.runtimeProbePath), evidence.runtimeProbeSha256);
assert.equal(evidence.trigger.result, 'failed');
assert.equal(evidence.realUserAcceptance, 'retest-pending');
assert.equal(evidence.aiReview, 'passed');
assert.equal(evidence.runtimePageCheck, 'passed');
assert.equal(evidence.sharedDependency.status, 'shared-contract-sync-not-executed');
assert.equal(evidence.sharedDependency.mismatchedObjectiveCount, 13);
assert.equal(evidence.sharedDependency.currentBatchObjectiveId, 'pol-obj-cognition-02-1');
assert.equal(evidence.releaseAuthorized, false);
assert.deepEqual(evidence.changedLessonIds, ['COGNITION-02']);
assert.equal(source.lessons.length, 72);
assert.deepEqual(runtime.lessons.map(item => item.id), source.lessons.map(item => item.id));

assert.equal(lesson.title, '认识的两次飞跃');
assert.equal(lesson.question, '认识的两次飞跃分别是什么？');
assert.equal(lesson.reflection.prompt, lesson.question);
assert.deepEqual(lesson.sections.map(item => item.label), [
  '感性认识是认识的初级阶段',
  '理性认识是认识的高级阶段',
  '从感性认识到理性认识是第一次飞跃',
  '从理性认识到实践是第二次飞跃',
]);
assert.equal(lesson.boundary.label, '感性认识和理性认识不能割裂');
assert.match(lesson.recap.text, /感性认识是初级阶段/);
assert.match(lesson.recap.text, /理性认识是高级阶段/);
assert.match(lesson.recap.text, /第一次飞跃/);
assert.match(lesson.recap.text, /第二次飞跃/);
assert.match(lesson.sections[2].text, /由观察资料形成概念、判断和推理，体现第一次飞跃/);
assert.match(lesson.sections[3].text, /用于实际行动并接受检验，体现第二次飞跃/);
assert.match(lesson.sections[3].text, /只增加理论论据/);
assert.deepEqual(runtimeLesson.parts.map(item => item.label), [
  ...lesson.sections.map(item => item.label),
  lesson.boundary.label,
  lesson.recap.label,
]);

const forbiddenDefaultLabels = /不只是多记材料|认识两次飞跃的判断|高级阶段不取消感性基础/;
assert.deepEqual([
  ...lesson.sections.map(item => item.label),
  lesson.boundary.label,
].filter(value => forbiddenDefaultLabels.test(value)), []);
assert.equal(aiReview.curriculumVersion, evidence.curriculumVersion);
assert.deepEqual(Object.values(aiReview.roles).map(item => item.status), ['pass', 'pass', 'pass']);
assert.ok(Object.values(aiReview.roles).every(item => item.riskCount === 0 && item.holdCount === 0));
assert.equal(aiReview.adjudication.realUserAcceptance, 'retest-pending');
assert.equal(runtimeProbe.status, 'passed');
assert.equal(runtimeProbe.curriculumVersion, evidence.curriculumVersion);
assert.equal(runtimeProbe.lessonId, lesson.id);
assert.deepEqual(runtimeProbe.partLabels, runtimeLesson.parts.map(item => item.label));
assert.equal(runtimeProbe.reflection.prompt, lesson.reflection.prompt);
assert.equal(runtimeProbe.progressProtection.temporaryProbeProgressRestored, true);
assert.equal(acceptance.lessonId, lesson.id);
assert.equal(acceptance.curriculumVersion, evidence.curriculumVersion);
assert.equal(acceptance.status, 'accepted-for-batch-expansion');
assert.equal(acceptance.acceptedScope, 'core-question-and-calibration-direction');
assert.equal(acceptance.fullLessonComprehensionRetest, 'not-separately-recorded');
assert.equal(acceptance.expansionAuthorized, true);

console.log(JSON.stringify({
  status: 'passed',
  batch: evidence.batchId,
  curriculumVersion: evidence.curriculumVersion,
  currentCurriculumVersion: runtime.curriculumVersion,
  changedLessonIds: evidence.changedLessonIds,
  objectRelationConclusionSequence: true,
  applicationCuesRetained: true,
  runtimePageCheck: evidence.runtimePageCheck,
  aiReview: evidence.aiReview,
  realUserAcceptance: evidence.realUserAcceptance,
}));
