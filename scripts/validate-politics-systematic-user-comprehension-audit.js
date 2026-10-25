#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { build, DEFAULT_OUTPUT, AI_REVIEW_PATH, SOURCE_PATH } = require('./build-politics-systematic-user-comprehension-audit');

const ROOT = path.resolve(__dirname, '..');
const absolute = relativePath => path.join(ROOT, relativePath);
const read = relativePath => fs.readFileSync(absolute(relativePath));
const readJson = relativePath => JSON.parse(read(relativePath));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function main() {
  const source = readJson(SOURCE_PATH);
  const aiReview = readJson(AI_REVIEW_PATH);
  const inventory = readJson(DEFAULT_OUTPUT);
  const rebuilt = build();
  assert.deepEqual(inventory, rebuilt, 'UC1 inventory is not a deterministic rebuild of current inputs');

  assert.equal(inventory.auditId, 'POL-SYS-UC1');
  assert.equal(inventory.status, 'uc1-inventory-complete-uc2-not-started');
  assert.equal(inventory.authority.sourceSha256, sha256(read(SOURCE_PATH)), 'author source hash drift');
  assert.equal(inventory.authority.aiReviewSha256, sha256(read(AI_REVIEW_PATH)), 'AI review hash drift');
  assert.equal(inventory.counts.routes, 2);
  assert.equal(inventory.counts.groups, 21);
  assert.equal(inventory.counts.lessons, 72);
  assert.equal(inventory.counts.sections, 186);
  assert.equal(inventory.lessons.length, 72);
  assert.equal(new Set(inventory.lessons.map(lesson => lesson.lessonId)).size, 72, 'duplicate lesson inventory');
  assert.equal(inventory.objects.length, inventory.counts.objects);
  assert.equal(new Set(inventory.objects.map(object => object.objectId)).size, inventory.objects.length, 'duplicate object ID');
  assert.equal(inventory.seedMappings.length, 15, 'all 15 screenshot seeds must be mapped');
  assert.ok(inventory.seedMappings.every(seed => seed.mappingState === 'mapped-to-inventory'));
  assert.equal(inventory.mechanismIssues.length, 1);
  assert.equal(inventory.mechanismIssues[0].state, 'hold');
  assert.equal(inventory.mechanismIssues[0].evidence.currentCurriculumVersion, 'units-50de00939577');
  assert.notEqual(inventory.mechanismIssues[0].evidence.oldB4EvidenceCurriculumVersion,
    inventory.mechanismIssues[0].evidence.currentCurriculumVersion, 'B4 drift hold unexpectedly disappeared');

  const objects = new Map(inventory.objects.map(object => [object.objectId, object]));
  const issues = new Map(inventory.issues.map(issue => [issue.issueId, issue]));
  const validObjectStates = new Set(['identified-risk', 'machine-candidate', 'screened-no-current-signal']);
  const validLessonStates = new Set(['identified-risk', 'machine-candidate', 'screened-no-current-signal']);
  const validIssueStates = new Set(['identified', 'machine-candidate']);
  const validSlices = new Set(['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']);
  for (const object of inventory.objects) {
    assert.ok(validObjectStates.has(object.auditState), `invalid object state ${object.objectId}`);
    assert.ok(object.visibleText.length, `empty visible text ${object.objectId}`);
    for (const issueId of object.issueIds) {
      assert.ok(issues.has(issueId), `missing issue ${issueId}`);
      assert.equal(issues.get(issueId).objectId, object.objectId, `issue points to wrong object ${issueId}`);
    }
    assert.deepEqual(Object.keys(object.reviewStates).sort(),
      ['ai-assessment', 'ai-exam-learner', 'ai-subject-expert', 'ai-user'].sort());
  }
  for (const lesson of inventory.lessons) {
    assert.ok(validLessonStates.has(lesson.auditState), `invalid lesson state ${lesson.lessonId}`);
    assert.ok(lesson.objectIds.every(objectId => objects.has(objectId)), `missing lesson object ${lesson.lessonId}`);
  }
  for (const issue of inventory.issues) {
    assert.ok(objects.has(issue.objectId), `unknown issue object ${issue.issueId}`);
    assert.ok(validIssueStates.has(issue.state), `invalid issue state ${issue.issueId}`);
    assert.ok(validSlices.has(issue.slice), `invalid issue slice ${issue.issueId}`);
    assert.ok(['L1', 'L2', 'L3'].includes(issue.severity), `invalid issue severity ${issue.issueId}`);
    assert.ok(issue.userFailure.length && issue.proposedAction.length, `incomplete issue ${issue.issueId}`);
  }
  assert.equal(inventory.counts.identifiedIssues,
    inventory.issues.filter(issue => issue.state === 'identified').length);
  assert.equal(inventory.counts.machineCandidates,
    inventory.issues.filter(issue => issue.state === 'machine-candidate').length);
  assert.equal(inventory.counts.lessonsWithRisk,
    inventory.lessons.filter(lesson => lesson.auditState === 'identified-risk').length);
  assert.ok(inventory.counts.identifiedIssues > 0);
  assert.ok(inventory.counts.machineCandidates > 0);

  const expectedKinds = new Set(['display-title', 'outcome-summary', 'section-label', 'section-text',
    'boundary-label', 'boundary-text', 'recap-label', 'recap-text', 'self-test-prompt', 'self-test-answer', 'source-entry']);
  assert.deepEqual(new Set(inventory.objects.map(object => object.kind)), expectedKinds);
  const expectedObjectCount = source.lessons.reduce((sum, lesson) => {
    const parts = [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap];
    const unitCount = new Set(parts.flatMap(part => part.sourceBlockIds).map(id => id.split(':')[1])).size;
    return sum + 6 + lesson.sections.length * 2 + (lesson.boundary ? 2 : 0) + 1 + (unitCount > 1 ? 1 : 0);
  }, 0);
  assert.equal(inventory.counts.objects, expectedObjectCount, 'actual rendered object inventory count drift');
  assert.equal(inventory.objects.filter(object => object.kind === 'outcome-summary').length, 72,
    'merged objective summaries must be audited as rendered');
  const expectedNonSourceObjects = source.lessons.reduce((sum, lesson) =>
    sum + 6 + lesson.sections.length * 2 + (lesson.boundary ? 2 : 0), 0);
  assert.equal(inventory.objects.filter(object => object.kind === 'source-entry').length,
    expectedObjectCount - expectedNonSourceObjects,
    'source entry inventory drift');

  assert.equal(aiReview.roles.length, 4);
  assert.deepEqual(aiReview.roles.map(role => role.roleId).sort(),
    ['ai-assessment', 'ai-exam-learner', 'ai-subject-expert', 'ai-user'].sort());
  for (const role of aiReview.roles) {
    assert.equal(role.lessonAssessments.length, 72, `${role.roleId} lesson coverage`);
    assert.equal(new Set(role.lessonAssessments.map(item => item.lessonId)).size, 72, `${role.roleId} duplicate lesson`);
    assert.ok(role.findings.length > 0, `${role.roleId} has no itemized findings`);
    assert.ok(role.findings.every(finding => objects.has(finding.objectId)), `${role.roleId} references unknown object`);
  }
  const subject = aiReview.roles.find(role => role.roleId === 'ai-subject-expert');
  assert.deepEqual(subject.lessonAssessments.filter(item => item.state === 'hold').map(item => item.lessonId).sort(),
    ['COGNITION-01', 'CULTUREECO-02', 'DEMOCRACY-03', 'PARTY-02']);
  assert.equal(aiReview.mechanismFindings[0].evidence.validationExitCode, 1);

  for (const objectId of [
    'TEN-02/self-test-prompt', 'TEN-03/section-01-label', 'TEN-04/self-test-prompt', 'SYS-01/section-03-label',
    'MOD-01/self-test-prompt', 'DEV-05/self-test-answer', 'DEV-06/self-test-answer',
  ]) assert.ok(objects.get(objectId).issueIds.length, `known risk not inventoried: ${objectId}`);

  assert.ok(inventory.stopGate.allLessonsInventoried);
  assert.ok(inventory.stopGate.allObjectsHaveState);
  assert.ok(inventory.stopGate.noPassedOrAcceptedState);
  assert.ok(inventory.stopGate.aiFourRolesComplete);
  assert.equal(inventory.stopGate.teachingContentChanged, false);
  assert.equal(inventory.stopGate.runtimeChanged, false);
  assert.doesNotMatch(JSON.stringify({ lessons: inventory.lessons, objects: inventory.objects, issues: inventory.issues }),
    /\"(?:passed|accepted)\"/, 'UC1 must not claim acceptance');

  console.log(`politics systematic UC1 audit validated: ${inventory.counts.lessons} lessons, ${inventory.counts.objects} rendered objects, ${inventory.counts.identifiedIssues} identified issues, ${inventory.counts.machineCandidates} machine candidates, 4 AI roles`);
}

main();
