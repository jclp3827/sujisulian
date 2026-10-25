#!/usr/bin/env node

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_PATH = 'docs/knowledge-pilot/sources/politics/politics-cross-mode-convergence-v1.json';
const BUILDER_PATH = 'scripts/build-politics-cross-mode-convergence-v1.js';
const QUICK_PATH = 'docs/knowledge-pilot/sources/politics/quick-primer-v4.json';
const RECALL_PATH = 'docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json';
const CONFUSION_PATH = 'docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json';
const SYSTEMATIC_REVIEW_PATH = 'docs/knowledge-pilot/sources/politics/politics-systematic-review-v1.json';

function absolute(relativePath) { return path.join(ROOT, relativePath); }
function readJson(relativePath) { return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8')); }
function sha256(relativePath) { return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex'); }

function main() {
  const active = require(absolute('miniprogram/services/knowledge-platform/politics-runtime')).knowledgePackage;
  if (active.quickPrimers.some(primer => primer.id === 'politics-quick-primer-v5')) {
    const { validateWholeOverviewCrossMode } = require('./lib/politics-quick-v5-cross-mode');
    process.stdout.write(JSON.stringify(validateWholeOverviewCrossMode(ROOT), null, 2) + '\n');
    return;
  }
  const artifact = readJson(ARTIFACT_PATH);
  const quickFile = readJson(QUICK_PATH);
  const recallArtifact = readJson(RECALL_PATH);
  const confusionArtifact = readJson(CONFUSION_PATH);
  const systematicReview = readJson(SYSTEMATIC_REVIEW_PATH);
  const regenerated = spawnSync(process.execPath, [absolute(BUILDER_PATH)], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  assert.strictEqual(regenerated.status, 0, regenerated.stderr || 'B5 builder failed');
  assert.deepStrictEqual(artifact, JSON.parse(regenerated.stdout), 'checked-in B5 artifact differs from deterministic rebuild');

  assert.strictEqual(artifact.id, 'politics-cross-mode-convergence-v1');
  assert.strictEqual(artifact.status, 'candidate-converged');
  assert.strictEqual(artifact.quickOverview.result, 'retain-six-sections-without-expansion');
  assert.strictEqual(artifact.quickOverview.sectionReviews.length, 6);
  assert.strictEqual(artifact.validation.quickCharacterCount, 1061);
  assert.deepStrictEqual(artifact.validation.quickCharacterRange, { min: 131, max: 202 });
  assert.strictEqual(artifact.validation.quickCoverageUnitCount, 37);
  assert.strictEqual(artifact.validation.quickOrientationObjectiveCount, 97);
  assert.strictEqual(artifact.objectiveConvergence.length, 97);
  assert.strictEqual(artifact.validation.reviewedRecallObjectiveCount, 60);
  assert.strictEqual(artifact.validation.selectivelyOmittedRecallObjectiveCount, 37);
  assert.strictEqual(artifact.validation.reviewedConfusionObjectiveCount, 17);
  assert.strictEqual(artifact.validation.reviewedConfusionItemCount, 10);
  assert.strictEqual(artifact.validation.recallSupportingProjectionCount, 0);
  assert.deepStrictEqual(artifact.validation.confusionItemWithBroadObjectiveProjection, []);
  assert.strictEqual(recallArtifact.validation.objectiveCoverageCount, 60);
  assert.strictEqual(recallArtifact.validation.objectiveCoverageMissingIds.length, 37);
  for (const card of recallArtifact.cards) assert.deepStrictEqual(card.supportingObjectiveIds, [], `${card.cardId}: loose supporting projection`);
  for (const item of confusionArtifact.items) {
    assert.strictEqual(item.left.objectiveIds.length, 1, `${item.itemId}: left objective projection is broad`);
    assert.strictEqual(item.right.objectiveIds.length, 1, `${item.itemId}: right objective projection is broad`);
  }

  assert.deepStrictEqual(artifact.validation.objectiveWithoutQuickOrientation, []);
  assert.deepStrictEqual(artifact.validation.objectiveWithoutReviewedSystematicLesson, []);
  assert.strictEqual(artifact.validation.objectiveWithoutReviewedRecallProjection.length, 37);
  assert.deepStrictEqual(artifact.validation.quickSectionWithUnknownCoverageUnit, []);
  assert.deepStrictEqual(artifact.validation.quickSectionWithUnknownSourceBlock, []);
  assert.deepStrictEqual(artifact.validation.quickQuestionOrRequiredAnswerSectionIds, []);
  assert.strictEqual(artifact.validation.learningUsesExplicitQuickFinish, true);
  assert.strictEqual(artifact.validation.routeOffersQuickSkip, true);
  assert.strictEqual(artifact.validation.routeOffersSystematicContinuation, true);
  assert.deepStrictEqual(artifact.validation.termContractFailures, []);
  assert.strictEqual(artifact.validation.exactOrContainedQuickRecallPairCount, 3);
  assert.deepStrictEqual(artifact.validation.unreviewedQuickRecallPairs, []);
  assert.strictEqual(artifact.validation.retainedStageDifferentiatedPairCount, 3);
  assert.deepStrictEqual(artifact.validation.forbiddenClaimHits, []);
  assert.deepStrictEqual(artifact.validation.meaninglessDuplicateProjectionIds, []);
  assert.strictEqual(artifact.repetitionAudit.retainedRepetitions.every((item) => item.decision === 'retain-stage-differentiated'), true);
  assert.strictEqual(artifact.bridgeAudit.completionOffersSystematicLearning, true);
  assert.strictEqual(artifact.bridgeAudit.systematicContentCopiedIntoQuick, false);
  assert.strictEqual(artifact.changes.contentChangesRequired, 0);
  assert.strictEqual(artifact.changes.runtimeChangesRequired, 0);
  assert.strictEqual(artifact.changes.metadataRepairsApplied.length, 2);
  assert.strictEqual(quickFile.primer.sections.length, 6);
  assert.strictEqual(systematicReview.validation.passed, true);
  assert.strictEqual(recallArtifact.validation.passed, true);
  assert.strictEqual(confusionArtifact.validation.passed, true);
  assert.strictEqual(artifact.validation.passed, true);
  assert.strictEqual(artifact.nextBatch, 'B6');

  const evidence = {
    schemaVersion: 1,
    auditId: 'POL-LCQ-V1-B5',
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
      quickSections: artifact.validation.quickSectionCount,
      quickCharacters: artifact.validation.quickCharacterCount,
      quickCoverageUnits: artifact.validation.quickCoverageUnitCount,
      quickOrientationObjectives: artifact.validation.quickOrientationObjectiveCount,
      reviewedSystematicObjectives: artifact.validation.objectiveCount,
      directlyAuditedRecallObjectives: artifact.validation.reviewedRecallObjectiveCount,
      systematicallyOnlyRecallOmissions: artifact.validation.selectivelyOmittedRecallObjectiveCount,
      reviewedConfusionObjectives: artifact.validation.reviewedConfusionObjectiveCount,
      reviewedConfusionItems: artifact.validation.reviewedConfusionItemCount,
      retainedStageDifferentiatedRepetitions: artifact.validation.retainedStageDifferentiatedPairCount,
    },
    gates: {
      deterministicArtifact: true,
      quickOverviewRemainsSixSectionsAndWithinBudget: true,
      quickOverviewCoversAllThirtySevenUnitsAtOrientationLevel: true,
      quickOverviewHasNoRequiredQuestion: true,
      quickOverviewOffersSkipExitAndSystematicContinuation: true,
      allNinetySevenObjectivesHaveQuickOrientationAndReviewedSystematicLesson: true,
      recallCoverageIsDirectAndSelectivelyBounded: true,
      confusionObjectiveLinksMatchTheDirectComparisonTask: true,
      threeRepeatedFormalStatementsHaveDifferentStageTasksAndSharedSources: true,
      criticalTermContractsHaveNoConflict: true,
      knownScopeGapsRemainVisible: true,
      noRuntimeOrQuestionContentWasChangedByB5: true,
    },
    projectionRepairs: artifact.changes.metadataRepairsApplied,
    decisions: [
      'Retain the current six-section quick overview: it states scope and depth, covers both current lines, and ends with a direct optional route into systematic learning.',
      'Interpret quick coverage as orientation by knowledge area, never as proof that all 97 objectives were explained or tested.',
      'Retain three repeated formal statements because quick recognition and active recall are different tasks backed by the same sources.',
      'Credit recall coverage only to the card primary objective; 60 objectives have direct recall candidates and 37 remain deliberately uncredited instead of inheriting loose same-unit overlap.',
      'Credit exactly one directly tested objective per side of each confusion item; the ten items cover seventeen distinct objectives selectively.',
    ],
    knownScopeGapIds: artifact.boundaryAudit.knownScopeGaps.map((gap) => gap.id),
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
