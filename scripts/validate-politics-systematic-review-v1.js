#!/usr/bin/env node

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_PATH = 'docs/knowledge-pilot/sources/politics/politics-systematic-review-v1.json';
const BUILDER_PATH = 'scripts/build-politics-systematic-review-v1.js';
const SAMPLES_PATH = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const RUNTIME_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';

function absolute(relativePath) { return path.join(ROOT, relativePath); }
function readJson(relativePath) { return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8')); }
function sha256(relativePath) { return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex'); }

function main() {
  const artifact = readJson(ARTIFACT_PATH);
  const samples = readJson(SAMPLES_PATH);
  delete require.cache[require.resolve(absolute(RUNTIME_PATH))];
  const runtime = require(absolute(RUNTIME_PATH));
  // B4 is the reviewed curriculum checkpoint. Later package-version bindings
  // preserve its 72 lessons but must not rewrite the historical artifact.

  const expectedRevised = ['TEN-02','MOD-01','DEV-04','DEV-06','BASICS-03','DIALECTICS-01','DIALECTICS-06'];
  const expectedScopeLimited = ['SYS-01','SYS-05','BASICS-01','CAPITAL-01','CAPITAL-02'];
  const reviews = new Map(artifact.lessonReviews.map((review) => [review.lessonId, review]));
  const lessons = new Map(samples.lessons.map((lesson) => [lesson.id, lesson]));

  assert.strictEqual(artifact.id, 'politics-systematic-review-v1');
  assert.strictEqual(artifact.status, 'candidate-reviewed-bounded');
  assert.strictEqual(samples.contentApproval, 'b4-reviewed-candidate');
  assert.strictEqual(samples.lessons.length, 72);
  assert.strictEqual(runtime.lessons.length, 72);
  assert.strictEqual(runtime.candidateOnly, true);
  assert.strictEqual(runtime.reviewState, 'draft');
  assert.match(runtime.curriculumVersion, /^units-[a-f0-9]{12}$/);
  assert.ok(runtime.progressCompatibleVersions.includes('units-290c32b9b468'));
  assert.ok(runtime.progressCompatibleVersions.includes('units-2ed23ba45dd1'));
  assert.ok(runtime.progressCompatibleVersions.includes('units-ca021565e839'));
  assert.ok(runtime.compatibleKnowledgePackageVersions.includes('kp1-a6-runtime-77a15fc82abc'));
  assert.ok(runtime.compatibleKnowledgePackageVersions.includes('kp1-a6-runtime-77a15fc82abc-lb-b64d94e4fdc6'));
  assert.strictEqual(artifact.lessonReviews.length, 72);
  assert.strictEqual(artifact.groupReviews.length, 21);
  assert.deepStrictEqual(artifact.validation.decisionCounts, { accepted: 60, revise: 7, 'scope-limited': 5 });
  assert.deepStrictEqual(artifact.validation.revisionReasonCounts, {
    'cross-mode-task-differentiation': 3,
    'formal-terminology-correction': 2,
    'goal-alignment': 2,
  });
  assert.deepStrictEqual(artifact.validation.revisedLessonIds, expectedRevised);
  assert.deepStrictEqual(artifact.validation.scopeLimitedLessonIds, expectedScopeLimited);
  for (const lessonId of expectedRevised) {
    assert.strictEqual(reviews.get(lessonId).decision, 'revise');
    assert.strictEqual(reviews.get(lessonId).resolutionState, 'applied');
  }
  for (const lessonId of expectedScopeLimited) {
    assert.strictEqual(reviews.get(lessonId).decision, 'scope-limited');
    assert.strictEqual(reviews.get(lessonId).resolutionState, 'bounded-by-source');
  }
  for (const review of artifact.lessonReviews) {
    assert.strictEqual(review.reviewState, 'b4-reviewed');
    assert.ok(review.checks.objectiveQuestionExplanationAligned, `${review.lessonId}: objective alignment failed`);
    assert.ok(review.checks.sourceSufficientForDeclaredScope, `${review.lessonId}: source scope failed`);
    assert.ok(review.checks.allSourcesAreFormal, `${review.lessonId}: unknown source`);
    assert.ok(review.checks.boundaryPresent, `${review.lessonId}: missing boundary`);
    assert.ok(review.checks.transitionContinuous, `${review.lessonId}: missing transition`);
  }

  assert.ok(lessons.get('DEV-04').recap.text.startsWith('社会主义基本经济制度包括'));
  assert.ok(!lessons.get('DEV-04').recap.text.includes('现代化经济体系包括'));
  assert.ok(lessons.get('BASICS-03').reflection.answer.includes('唯一特性'));
  assert.ok(lessons.get('BASICS-03').reflection.answer.includes('根本属性和存在方式'));
  assert.ok(lessons.get('DIALECTICS-01').reflection.answer.includes('三类判断都要保留具体条件'));
  assert.ok(lessons.get('DIALECTICS-06').reflection.answer.includes('前进性与曲折性的统一'));
  assert.ok(lessons.get('TEN-02').question.includes('第4至6条怎样'));
  assert.ok(lessons.get('MOD-01').reflection.prompt.includes('不能合并成同一个目标'));
  assert.ok(lessons.get('DEV-06').reflection.prompt.includes('分层理解'));

  for (const key of [
    'blockedBySourceLessonIds', 'mergeLessonIds', 'splitLessonIds', 'duplicateLessonIds',
    'duplicateQuestions', 'exactReflectionRecallDuplicates', 'exactReflectionConfusionDuplicates',
    'invalidPlannedRevisitIds', 'objectiveAlignmentFailures', 'objectiveSourceFailures', 'unknownSourceFailures',
  ]) assert.deepStrictEqual(artifact.validation[key], [], `${key} must be empty`);
  assert.deepStrictEqual(artifact.validation.defaultCharacterRange, { min: 272, max: 574 });
  assert.strictEqual(artifact.validation.passed, true);
  assert.strictEqual(artifact.knownScopeGaps.length, 4);
  assert.strictEqual(artifact.nextBatch, 'B5');

  const evidence = {
    schemaVersion: 1,
    auditId: 'POL-LCQ-V1-B4',
    auditDate: '2026-10-21',
    status: 'passed-candidate-only',
    scope: artifact.scope,
    authority: artifact.authority,
    artifact: {
      path: ARTIFACT_PATH,
      sha256: sha256(ARTIFACT_PATH),
      builderPath: BUILDER_PATH,
      builderSha256: sha256(BUILDER_PATH),
      deterministicRebuildMatched: true,
    },
    counts: {
      routes: artifact.validation.routeCount,
      groups: artifact.validation.groupCount,
      lessons: artifact.validation.lessonCount,
      objectives: artifact.validation.objectiveCount,
      accepted: artifact.validation.decisionCounts.accepted,
      revised: artifact.validation.decisionCounts.revise,
      scopeLimited: artifact.validation.decisionCounts['scope-limited'],
      blockedBySource: artifact.validation.blockedBySourceLessonIds.length,
      merged: artifact.validation.mergeLessonIds.length,
      split: artifact.validation.splitLessonIds.length,
    },
    revisionReasonCounts: artifact.validation.revisionReasonCounts,
    revisedLessonIds: expectedRevised,
    scopeLimitedLessonIds: expectedScopeLimited,
    runtime: {
      curriculumVersion: runtime.curriculumVersion,
      candidateOnly: runtime.candidateOnly,
      reviewState: runtime.reviewState,
      preservesProgressFrom: 'units-2ed23ba45dd1',
    },
    gates: {
      deterministicArtifact: true,
      allSeventyTwoLessonsReviewed: true,
      allTwentyOneGroupsRemainContinuous: true,
      everyLessonHasAlignedObjectivesAndFormalSources: true,
      sevenRequiredRevisionsApplied: true,
      fiveSourceLimitedLessonsRemainExplicitlyBounded: true,
      noLessonRequiredMergeSplitOrSourceBlock: true,
      noExactRecallOrConfusionPromptDuplicate: true,
      correctedFormalTerminologyIsPresent: true,
      previousCurriculumProgressRemainsCompatible: true,
      runtimeRemainsDraftCandidateOnly: true,
    },
    decisions: [
      'Keep the 72-lesson sequence because all declared goals remain source-supported and continuous after bounded revision.',
      'Apply seven local corrections for task differentiation, formal terminology, and goal alignment instead of expanding the curriculum.',
      'Keep five lessons explicitly limited by three known source gaps; do not generate missing theory or mechanisms.',
      'Preserve planned overview-to-explanation revisits only where the learning task changes by stage.',
      'Keep runtime draft and candidate-only even though B4 editorial review is complete.',
    ],
    knownScopeGapIds: artifact.knownScopeGaps.map((gap) => gap.id),
    nextBatch: artifact.nextBatch,
  };

  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), `${JSON.stringify(evidence, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify({ status: evidence.status, output: target, counts: evidence.counts })}\n`);
  } else process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
}

main();
