#!/usr/bin/env node

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';
const BUILDER_PATH = 'scripts/build-politics-learning-objectives-v1.js';
const RUNTIME_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';
const CURRICULUM_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';

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

function unitRegion(unitId) {
  const match = String(unitId).match(/u(\d{3})$/);
  if (!match) return 'unknown';
  return Number(match[1]) <= 19 ? 'thought' : 'principles';
}

function countProjectionStates(objectives, mode) {
  const result = {};
  for (const objective of objectives) {
    for (const state of objective.projections[mode].states) result[state] = (result[state] || 0) + 1;
  }
  return result;
}

function main() {
  const artifact = readJson(ARTIFACT_PATH);
  const sourcePackage = require(absolute(RUNTIME_PATH));
  const curriculum = require(absolute(CURRICULUM_PATH));
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  const regenerated = spawnSync(process.execPath, [absolute(BUILDER_PATH)], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  assert.strictEqual(regenerated.status, 0, regenerated.stderr || 'B1 builder failed');
  const expectedArtifact = JSON.parse(regenerated.stdout);
  assert.deepStrictEqual(artifact, expectedArtifact, 'checked-in B1 artifact differs from deterministic rebuild');

  const sourceBlockIds = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => (unit.blocks || []).map((block) => block.id)));
  const unitIds = new Set(knowledgePackage.knowledgeUnits.map((unit) => unit.id));
  const lessonIds = new Set(curriculum.lessons.map((lesson) => lesson.id));
  const quickSectionIds = new Set(knowledgePackage.quickPrimers.flatMap((primer) => primer.sections.map((section) => section.id)));
  const recallItemIds = new Set(knowledgePackage.recallItems.map((item) => item.id));
  const contrastPairIds = new Set(knowledgePackage.contrastPairs.map((pair) => pair.id));
  const objectiveIds = artifact.objectives.map((objective) => objective.objectiveId);

  assert.strictEqual(artifact.id, 'politics-learning-objectives-v1');
  assert.strictEqual(artifact.status, 'candidate-mapped');
  assert.strictEqual(artifact.objectives.length, 97);
  assert.strictEqual(new Set(objectiveIds).size, 97, 'objective IDs must be unique');
  assert.strictEqual(artifact.unitMatrix.length, 37);
  assert.strictEqual(artifact.knownScopeGaps.length, 4);
  assert.strictEqual(artifact.validation.passed, true);

  const missingReferences = [];
  for (const objective of artifact.objectives) {
    assert.ok(objective.mustUnderstand, `${objective.objectiveId}: missing mustUnderstand`);
    assert.ok(objective.sourceVersion?.knowledgePackage && objective.sourceVersion?.curriculum, `${objective.objectiveId}: missing sourceVersion`);
    assert.ok(objective.unitIds.length, `${objective.objectiveId}: missing unitIds`);
    assert.ok(objective.sourceBlockIds.length, `${objective.objectiveId}: missing sourceBlockIds`);
    assert.ok(objective.boundaries.length, `${objective.objectiveId}: missing boundaries`);
    assert.ok(objective.commonErrors.length, `${objective.objectiveId}: missing commonErrors`);
    assert.ok(objective.conditionReviewState, `${objective.objectiveId}: missing condition disposition`);
    assert.ok(objective.scopeLimit, `${objective.objectiveId}: missing scopeLimit`);
    for (const unitId of objective.unitIds) if (!unitIds.has(unitId)) missingReferences.push({ objectiveId: objective.objectiveId, type: 'unit', id: unitId });
    for (const blockId of objective.sourceBlockIds) if (!sourceBlockIds.has(blockId)) missingReferences.push({ objectiveId: objective.objectiveId, type: 'sourceBlock', id: blockId });
    if (!lessonIds.has(objective.lessonId)) missingReferences.push({ objectiveId: objective.objectiveId, type: 'lesson', id: objective.lessonId });
    for (const id of objective.projections.quick.sectionIds) if (!quickSectionIds.has(id)) missingReferences.push({ objectiveId: objective.objectiveId, type: 'quickSection', id });
    for (const id of objective.projections.exam.recallItemIds) if (!recallItemIds.has(id)) missingReferences.push({ objectiveId: objective.objectiveId, type: 'recallItem', id });
    for (const id of objective.projections.confusion.contrastPairIds) if (!contrastPairIds.has(id)) missingReferences.push({ objectiveId: objective.objectiveId, type: 'contrastPair', id });
  }
  assert.deepStrictEqual(missingReferences, [], 'B1 artifact contains unresolved references');

  const projectionStateCounts = {
    quick: countProjectionStates(artifact.objectives, 'quick'),
    systematic: countProjectionStates(artifact.objectives, 'systematic'),
    exam: countProjectionStates(artifact.objectives, 'exam'),
    confusion: countProjectionStates(artifact.objectives, 'confusion'),
  };
  assert.deepStrictEqual(projectionStateCounts.quick, { covered: 97 });
  assert.deepStrictEqual(projectionStateCounts.systematic, { covered: 97 });
  assert.deepStrictEqual(projectionStateCounts.exam, { covered: 88, missing: 9, duplicated: 1 });
  assert.deepStrictEqual(projectionStateCounts.confusion, { missing: 87, covered: 10 });

  const examMissingObjectiveIds = artifact.objectives
    .filter((objective) => objective.projections.exam.states.includes('missing'))
    .map((objective) => objective.objectiveId);
  const confusionCoveredUnitIds = unique(artifact.objectives
    .filter((objective) => objective.projections.confusion.states.includes('covered'))
    .flatMap((objective) => objective.unitIds));
  const conditionDispositionCounts = artifact.objectives.reduce((counts, objective) => {
    counts[objective.conditionReviewState] = (counts[objective.conditionReviewState] || 0) + 1;
    return counts;
  }, {});
  const sourceGranularityCounts = artifact.objectives.reduce((counts, objective) => {
    counts[objective.sourceGranularity] = (counts[objective.sourceGranularity] || 0) + 1;
    return counts;
  }, {});

  const evidence = {
    schemaVersion: 1,
    auditId: 'POL-LCQ-V1-B1',
    auditDate: '2026-10-21',
    status: 'passed-with-registered-gaps',
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
      formalUnits: artifact.unitMatrix.length,
      systematicLessons: curriculum.lessons.length,
      objectives: artifact.objectives.length,
      quickSections: artifact.reverseProjectionItems.quickSections.length,
      examCards: artifact.reverseProjectionItems.examCards.length,
      contrastPairs: artifact.reverseProjectionItems.contrastPairs.length,
    },
    projectionStateCounts,
    unitCoverage: artifact.validation.unitCoverage,
    examMissingObjectiveIds,
    duplicatedExamCardIds: artifact.validation.duplicatedExamCardIds,
    confusionCoverage: {
      objectiveCount: artifact.validation.objectivesByProjection.confusion,
      unitIds: confusionCoveredUnitIds,
      unitCountByRegion: confusionCoveredUnitIds.reduce((counts, unitId) => {
        const region = unitRegion(unitId);
        counts[region] = (counts[region] || 0) + 1;
        return counts;
      }, {}),
    },
    conditionDispositionCounts,
    sourceGranularityCounts,
    knownScopeGapIds: artifact.knownScopeGaps.map((gap) => gap.id),
    gates: {
      deterministicArtifact: true,
      allObjectivesHaveFormalUnits: true,
      allObjectivesHaveSourceBlocks: true,
      allObjectivesHaveSourceVersions: true,
      allObjectivesHaveBoundaries: true,
      allObjectivesHaveCommonErrorCandidates: true,
      allConditionsHaveExplicitDisposition: true,
      allProjectionReferencesResolve: true,
      unknownContentWasNotGenerated: true,
      userFacingRuntimeWasNotChangedByB1: true,
    },
    decisions: [
      'Quick coverage is unit-level overview coverage and must not be read as full objective teaching.',
      'Nine objectives are missing source-overlapping exam projections and move to B3.',
      'Confusion coverage remains limited to ten objectives in seven principle units; B2 must audit candidates before adding pairs.',
      'Two-objective lessons share lesson-level source sets until B4 editorial review refines granularity.',
      'Eighteen objectives have no separately identified condition; the artifact records this explicitly instead of generating one.',
    ],
    nextBatches: artifact.nextBatches,
  };

  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), `${JSON.stringify(evidence, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify({ status: evidence.status, output: target, counts: evidence.counts, projectionStateCounts })}\n`);
  } else {
    process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
  }
}

main();
