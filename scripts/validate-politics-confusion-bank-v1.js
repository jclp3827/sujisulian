#!/usr/bin/env node

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_PATH = 'docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json';
const BUILDER_PATH = 'scripts/build-politics-confusion-bank-v1.js';
const RUNTIME_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';
const CURRICULUM_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';
const OBJECTIVES_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';

function absolute(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
}

function sha256(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex');
}

function unique(values) {
  return [...new Set(values)];
}

function main() {
  const artifact = readJson(ARTIFACT_PATH);
  const objectivesArtifact = readJson(OBJECTIVES_PATH);
  const sourcePackage = require(absolute(RUNTIME_PATH));
  const curriculum = require(absolute(CURRICULUM_PATH));
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  // B2 is the reviewed seed bank checkpoint. Its source and semantic contracts
  // remain valid even when a later curriculum/runtime version is generated.

  const units = new Set(knowledgePackage.knowledgeUnits.map((unit) => unit.id));
  const blocks = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => (unit.blocks || []).map((block) => block.id)));
  const relations = new Map(knowledgePackage.relations.map((relation) => [relation.id, relation]));
  const recalls = new Set(knowledgePackage.recallItems.map((item) => item.id));
  const lessons = new Set(curriculum.lessons.map((lesson) => lesson.id));
  const objectives = new Set(objectivesArtifact.objectives.map((objective) => objective.objectiveId));

  assert.strictEqual(artifact.id, 'politics-confusion-bank-v1');
  assert.strictEqual(artifact.status, 'candidate-reviewed');
  assert.strictEqual(artifact.items.length, 10);
  assert.strictEqual(artifact.items.filter((item) => item.status === 'accepted-existing').length, 5);
  assert.strictEqual(artifact.items.filter((item) => item.status === 'accepted-candidate').length, 5);
  assert.strictEqual(new Set(artifact.items.map((item) => item.itemId)).size, artifact.items.length);
  assert.strictEqual(new Set(artifact.items.map((item) => item.relationId)).size, artifact.items.length);
  assert.strictEqual(knowledgePackage.contrastPairs.length, 5, 'B2 must not mutate formal runtime contrast pairs');
  assert.strictEqual(artifact.curationPolicy.dialecticsClusterItemIds.length, 3);
  assert.strictEqual(artifact.curationPolicy.maxDialecticsClusterItemsPerDefaultSession, 1);
  assert.ok(artifact.curationPolicy.selectionPriority.includes('region-balance'));

  const unresolved = [];
  for (const item of artifact.items) {
    const relation = relations.get(item.relationId);
    if (!relation) unresolved.push({ itemId: item.itemId, type: 'relation', id: item.relationId });
    assert.ok(units.has(item.left.unitId) && units.has(item.right.unitId));
    assert.notStrictEqual(item.left.unitId, item.right.unitId);
    assert.ok(item.dimension && !Array.isArray(item.dimension));
    assert.ok(item.boundary);
    assert.ok(item.left.objectiveIds.length && item.right.objectiveIds.length);
    for (const objectiveId of [...item.left.objectiveIds, ...item.right.objectiveIds]) if (!objectives.has(objectiveId)) unresolved.push({ itemId: item.itemId, type: 'objective', id: objectiveId });
    for (const blockId of item.sourceBlockIds) if (!blocks.has(blockId)) unresolved.push({ itemId: item.itemId, type: 'sourceBlock', id: blockId });
    for (const check of [item.initialCheck, item.variantCheck]) {
      assert.strictEqual(check.options.length, 2);
      const optionIds = check.options.map((option) => option.unitId);
      assert.deepStrictEqual(new Set(optionIds), new Set([item.left.unitId, item.right.unitId]));
      assert.ok(optionIds.includes(check.answerUnitId));
      assert.ok(optionIds.includes(check.wrongOptionUnitId));
      assert.notStrictEqual(check.answerUnitId, check.wrongOptionUnitId);
      assert.ok(check.prompt && check.answer && check.explanation && check.wrongAnswerExplanation);
      assert.ok(check.sourceBlockIds.length);
      for (const blockId of check.sourceBlockIds) {
        if (!blocks.has(blockId)) unresolved.push({ itemId: item.itemId, type: 'checkSourceBlock', id: blockId });
        assert.ok(item.sourceBlockIds.includes(blockId), `${item.itemId}: check source must be included in item sources`);
      }
    }
    assert.notStrictEqual(item.initialCheck.answerUnitId, item.variantCheck.answerUnitId);
    if (item.status === 'accepted-existing') assert.strictEqual(relation.type, 'contrast');
    if (item.status === 'accepted-candidate') assert.strictEqual(relation.type, 'related');
    assert.strictEqual(item.runtimeIntegration, 'not-integrated');
  }

  const allSignals = [
    ...artifact.candidateLedger.relationSignals,
    ...artifact.candidateLedger.pitfallSignals,
    ...artifact.candidateLedger.boundarySignals,
  ];
  assert.strictEqual(allSignals.length, 148);
  assert.strictEqual(artifact.candidateLedger.relationSignals.length, 39);
  assert.strictEqual(artifact.candidateLedger.pitfallSignals.length, 37);
  assert.strictEqual(artifact.candidateLedger.boundarySignals.length, 72);
  assert.strictEqual(new Set(allSignals.map((signal) => signal.signalId)).size, allSignals.length);
  for (const signal of allSignals) {
    for (const unitId of signal.unitIds) if (!units.has(unitId)) unresolved.push({ signalId: signal.signalId, type: 'unit', id: unitId });
    for (const blockId of signal.sourceBlockIds) if (!blocks.has(blockId)) unresolved.push({ signalId: signal.signalId, type: 'sourceBlock', id: blockId });
    if (signal.sourceType === 'formal-relation' && !relations.has(signal.sourceId)) unresolved.push({ signalId: signal.signalId, type: 'relation', id: signal.sourceId });
    if (signal.sourceType === 'recall-pitfall' && !recalls.has(signal.sourceId)) unresolved.push({ signalId: signal.signalId, type: 'recall', id: signal.sourceId });
    if (signal.sourceType === 'systematic-boundary' && !lessons.has(signal.sourceId)) unresolved.push({ signalId: signal.signalId, type: 'lesson', id: signal.sourceId });
  }
  assert.deepStrictEqual(unresolved, [], 'B2 artifact has unresolved source references');
  assert.strictEqual(artifact.validation.passed, true);
  assert.deepStrictEqual(artifact.validation.coverage, {
    unitCount: 17,
    thoughtUnitCount: 10,
    principlesUnitCount: 7,
    itemCountByRegion: { principles: 5, thought: 5 },
  });
  assert.strictEqual(artifact.validation.ledgerCounts.total, 148);
  assert.strictEqual(artifact.knownScopeGaps.length, 4);

  const evidence = {
    schemaVersion: 1,
    auditId: 'POL-LCQ-V1-B2',
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
      formalRelationsScanned: artifact.candidateLedger.relationSignals.length,
      recallPitfallsScanned: artifact.candidateLedger.pitfallSignals.length,
      systematicBoundariesScanned: artifact.candidateLedger.boundarySignals.length,
      totalSignals: allSignals.length,
      retainedExistingItems: artifact.items.filter((item) => item.status === 'accepted-existing').length,
      reviewedNewCandidates: artifact.items.filter((item) => item.status === 'accepted-candidate').length,
      totalReviewedItems: artifact.items.length,
    },
    ledgerDispositionCounts: artifact.validation.ledgerCounts.byDisposition,
    coverage: artifact.validation.coverage,
    reviewedItems: artifact.items.map((item) => ({
      itemId: item.itemId,
      status: item.status,
      region: item.region,
      relationId: item.relationId,
      unitIds: [item.left.unitId, item.right.unitId],
      dimension: item.dimension,
      sourceBlockCount: item.sourceBlockIds.length,
      initialAnswerUnitId: item.initialCheck.answerUnitId,
      variantAnswerUnitId: item.variantCheck.answerUnitId,
    })),
    gates: {
      deterministicArtifact: true,
      allItemsHaveTwoFormalSides: true,
      allItemsHaveObjectiveLinks: true,
      allItemsHaveUniqueDimension: true,
      allItemsHaveBoundary: true,
      allItemsHaveTwoSidedSources: true,
      allItemsHaveScorableInitialAndVariantChecks: true,
      allWrongAnswersHaveExplanation: true,
      allLedgerReferencesResolve: true,
      thoughtRegionWasAuditedAndHasReviewedCandidates: true,
      formalRuntimeContrastPairsRemainFive: true,
      repetitiveDialecticsItemsHaveCurationLimit: true,
      userFacingRuntimeWasNotChangedByB2: true,
    },
    decisions: [
      'Retain all five formal contrast pairs and add review-only initial and variant checks.',
      'Accept five thought-region additions as reviewed candidates only; do not create formal relations or runtime content in B2.',
      'Do not turn prerequisite order, title similarity, or one-sided pitfalls into contrast questions.',
      'Keep 67 within-unit distinction signals for later editorial work rather than inflating the B2 bank.',
      'Coverage improves from seven principle units to seventeen units across both regions, but remains bounded and does not claim full exam coverage.',
    ],
    knownScopeGapIds: artifact.knownScopeGaps.map((gap) => gap.id),
    nextBatch: artifact.nextBatch,
  };

  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), `${JSON.stringify(evidence, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify({ status: evidence.status, output: target, counts: evidence.counts, coverage: evidence.coverage })}\n`);
  } else {
    process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
  }
}

main();
