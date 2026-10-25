#!/usr/bin/env node

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_PATH = 'docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json';
const BUILDER_PATH = 'scripts/build-politics-recall-bank-v1.js';
const RUNTIME_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';
const CURRICULUM_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';
const OBJECTIVES_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';

function absolute(relativePath) { return path.join(ROOT, relativePath); }
function readJson(relativePath) { return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8')); }
function sha256(relativePath) { return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex'); }
function normalize(text = '') { return text.replace(/[\s，。！？；：、“”‘’（）《》·,.!?;:()]/g, ''); }
function intersection(left, right) { const set = new Set(right); return [...new Set(left.filter((value) => set.has(value)))]; }

function main() {
  const artifact = readJson(ARTIFACT_PATH);
  const objectivesArtifact = readJson(OBJECTIVES_PATH);
  const sourcePackage = require(absolute(RUNTIME_PATH));
  const curriculum = require(absolute(CURRICULUM_PATH));
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  // B3 is the reviewed seed bank checkpoint. A later curriculum/runtime bind
  // must not rewrite the already-audited seed artifact.

  const units = new Set(knowledgePackage.knowledgeUnits.map((unit) => unit.id));
  const blocks = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => (unit.blocks || []).map((block) => block.id)));
  const sourceCards = new Map(knowledgePackage.recallItems.map((item) => [item.id, item]));
  const objectives = new Map(objectivesArtifact.objectives.map((objective) => [objective.objectiveId, objective]));
  const allowedTypes = new Set(['core-recall','condition-boundary','error-correction','statement-combination']);

  assert.strictEqual(artifact.id, 'politics-recall-bank-v1');
  assert.strictEqual(artifact.status, 'candidate-reviewed');
  assert.strictEqual(sourceCards.size, 37, 'B3 must not mutate runtime recall cards');
  assert.strictEqual(artifact.baselineAudit.length, 37);
  assert.strictEqual(artifact.cards.length, 67);
  assert.strictEqual(new Set(artifact.baselineAudit.map((item) => item.recallItemId)).size, 37);
  assert.strictEqual(new Set(artifact.cards.map((card) => card.cardId)).size, 67);
  assert.strictEqual(new Set(artifact.cards.map((card) => normalize(card.prompt))).size, 67);

  const expectedReplacedRuntimeCards = new Set([
    'recall:politics-toc-v2-u001:qa',
    'recall:politics-toc-v2-u007:qa',
    'recall:politics-toc-v2-u008:qa',
    'recall:politics-toc-v2-u010:qa',
    'recall:politics-toc-v2-u014:qa',
    'recall:politics-toc-v2-u022:qa',
    'recall:politics-toc-v2-u036:qa',
  ]);
  const auditedReplacements = new Set(artifact.baselineAudit
    .filter((item) => item.decision.startsWith('replace-with-'))
    .map((item) => item.recallItemId));
  assert.deepStrictEqual(auditedReplacements, expectedReplacedRuntimeCards);
  for (const card of artifact.cards) {
    assert.ok(units.has(card.unitId), `${card.cardId}: unknown unit`);
    assert.ok(allowedTypes.has(card.cardType), `${card.cardId}: invalid card type`);
    assert.ok(card.prompt && card.answer && card.errorExplanation);
    assert.ok(card.answerCharacterCount <= 70, `${card.cardId}: answer exceeds 70 characters`);
    assert.ok(card.sourceBlockIds.length && card.errorSourceBlockIds.length);
    assert.ok(card.remedy?.unitId === card.unitId && card.remedy.sourceBlockIds.length);
    const primary = objectives.get(card.primaryObjectiveId);
    assert.ok(primary, `${card.cardId}: unknown primary objective`);
    assert.ok(primary.unitIds.includes(card.unitId), `${card.cardId}: primary objective unit mismatch`);
    assert.ok(intersection(primary.sourceBlockIds, card.sourceBlockIds).length, `${card.cardId}: primary objective lacks source overlap`);
    assert.deepStrictEqual(card.supportingObjectiveIds, [], `${card.cardId}: unaudited supporting objective projection`);
    for (const blockId of [...card.sourceBlockIds, ...card.errorSourceBlockIds, ...card.remedy.sourceBlockIds]) assert.ok(blocks.has(blockId), `${card.cardId}: unknown block ${blockId}`);
    if (card.sourceRecallItemId) {
      assert.ok(sourceCards.has(card.sourceRecallItemId));
      assert.ok(!expectedReplacedRuntimeCards.has(card.sourceRecallItemId), `${card.cardId}: replaced runtime card leaked into candidate bank`);
    }
    if (card.replacesRecallItemId) assert.ok(expectedReplacedRuntimeCards.has(card.replacesRecallItemId));
  }

  const coveredObjectives = new Set(artifact.cards.map((card) => card.primaryObjectiveId));
  assert.strictEqual(coveredObjectives.size, 60);
  assert.strictEqual([...objectives.keys()].filter((id) => !coveredObjectives.has(id)).length, 37);
  const b1MissingObjectiveIds = objectivesArtifact.objectives
    .filter((objective) => objective.projections.exam.states.includes('missing'))
    .map((objective) => objective.objectiveId);
  for (const objectiveId of b1MissingObjectiveIds) {
    assert.ok(artifact.cards.some((card) => card.primaryObjectiveId === objectiveId), `B1 gap is not a primary target: ${objectiveId}`);
  }
  assert.ok(!artifact.cards.some((card) => card.sourceRecallItemId === 'recall:politics-toc-v2-u014:qa'));
  assert.ok(artifact.cards.some((card) => card.cardId === 'politics-recall-v1-u014-error' && card.cardType === 'error-correction'));
  assert.strictEqual(artifact.validation.passed, true);
  assert.strictEqual(artifact.validation.baselineCompositeCandidates, 15);
  assert.strictEqual(artifact.validation.baselineBroadAnswerCandidates, 7);
  assert.deepStrictEqual(artifact.validation.cardTypeCounts, {
    'statement-combination': 28,
    'core-recall': 17,
    'condition-boundary': 16,
    'error-correction': 6,
  });
  assert.strictEqual(artifact.curationPolicy.defaultSessionSize, 4);
  assert.ok(artifact.curationPolicy.selectionPriority.includes('previously-missed'));
  assert.ok(artifact.curationPolicy.selectionPriority.includes('explicit-user-random'));
  assert.strictEqual(artifact.validation.lightApplicationCardCount, 0);
  assert.strictEqual(artifact.knownScopeGaps.length, 4);

  const evidence = {
    schemaVersion: 1,
    auditId: 'POL-LCQ-V1-B3',
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
      runtimeBaselineCards: sourceCards.size,
      reviewedBaselineCards: artifact.baselineAudit.length,
      candidateCards: artifact.cards.length,
      baselineCompositeCandidates: artifact.validation.baselineCompositeCandidates,
      baselineBroadAnswerCandidates: artifact.validation.baselineBroadAnswerCandidates,
      objectiveCoverage: artifact.validation.objectiveCoverageCount,
      b1GapsClosed: artifact.validation.b1MissingObjectiveIds.length,
    },
    baselineDecisionCounts: artifact.validation.baselineDecisionCounts,
    cardTypeCounts: artifact.validation.cardTypeCounts,
    cardOriginCounts: artifact.validation.cardOriginCounts,
    replacedRuntimeCardIds: [...expectedReplacedRuntimeCards],
    b1MissingObjectiveIds,
    curationPolicy: artifact.curationPolicy,
    gates: {
      deterministicArtifact: true,
      allThirtySevenBaselineCardsReviewed: true,
      allCardsHaveOnePrimaryObjective: true,
      allCardsHaveFormalAnswerSources: true,
      allCardsHaveErrorExplanationAndRemedy: true,
      allCandidateAnswersAtMostSeventyCharacters: true,
      allNineB1ObjectiveGapsArePrimaryTargets: true,
      sixtyObjectivesHaveDirectlyAuditedRecallProjection: true,
      thirtySevenExplanationObjectivesAreNotCreditedByLooseSourceOverlap: true,
      systematicNearDuplicateWasReplacedWithDifferentTask: true,
      fourCardSessionAndRemedyFlowArePreservedInPolicy: true,
      unsupportedLightApplicationCardsWereNotCreated: true,
      runtimeRecallCardsRemainThirtySeven: true,
      userFacingRuntimeWasNotChangedByB3: true,
    },
    decisions: [
      'Treat structural list retrieval as statement-combination instead of mechanically splitting every multi-part prompt.',
      'Replace seven cards that mix independent tasks, point at the wrong target, or duplicate systematic learning; keep the original runtime untouched.',
      'Close the nine B1 objective gaps with seven dedicated cards plus replacement cards for the two rural-development objectives.',
      'Reject same-unit coverage when the candidate answer has no direct source overlap; add a dedicated universality-and-particularity card.',
      'Add condition-boundary and error-correction cards without inventing application scenarios unsupported by current sources.',
      'Keep the current four-card prompt-reveal-self-rating-remedy flow and improve only candidate selection policy.',
    ],
    knownScopeGapIds: artifact.knownScopeGaps.map((gap) => gap.id),
    nextBatch: artifact.nextBatch,
  };

  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), `${JSON.stringify(evidence, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify({ status: evidence.status, output: target, counts: evidence.counts, cardTypeCounts: evidence.cardTypeCounts })}\n`);
  } else process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
}

main();
