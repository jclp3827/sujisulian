#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_PATH = path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-learning-bank-maintenance-v2.json');
const BUILDER_PATH = path.join(ROOT, 'scripts/build-politics-learning-bank-maintenance-v2.js');
const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, 'utf8'));
const rebuilt = spawnSync(process.execPath, [BUILDER_PATH], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

assert.equal(rebuilt.status, 0, rebuilt.stderr || 'B12-B15 maintenance builder failed');
assert.deepEqual(artifact, JSON.parse(rebuilt.stdout), 'checked-in B12-B15 artifact differs from deterministic builder output');
assert.equal(artifact.status, 'maintenance-reviewed-stop-condition-reached');
assert.deepEqual(artifact.cycles.map((cycle) => [cycle.id, cycle.recallCards]), [['B12', 12], ['B13', 12], ['B14', 10], ['B15', 0]]);
assert.equal(artifact.recallCards.length, 34);
assert.equal(artifact.disposition.startingSignals, 55);
assert.equal(artifact.disposition.acceptedAsDistinctErrorCorrection, 34);
assert.equal(artifact.disposition.rejectedAfterReview, 21);
assert.equal(artifact.disposition.remainingUnreviewedSignals, 0);
assert.equal(artifact.disposition.ledger.length, 55);
assert.equal(artifact.validation.runtimeRecallCardsAfterPromotion, 136);
assert.equal(artifact.validation.runtimeConfusionItemsAfterPromotion, 14);
assert.equal(artifact.validation.directlyProjectedObjectivesAfterPromotion, 83);
assert.equal(artifact.validation.b15AcceptedCards, 0);
assert.deepEqual(artifact.validation.duplicateCardIds, []);
assert.deepEqual(artifact.validation.duplicateSignalSelections, []);
assert.deepEqual(artifact.validation.duplicatePrompts, []);
assert.deepEqual(artifact.validation.answersOver70Characters, []);
assert.deepEqual(artifact.validation.missingDispositionIds, []);
assert.deepEqual(artifact.validation.unknownDispositionIds, []);
assert.equal(artifact.validation.passed, true);
assert.equal(artifact.exitDecision.mode, 'closed-until-trigger');

for (const card of artifact.recallCards) {
  assert.equal(card.cardType, 'error-correction');
  assert.ok(['B12', 'B13', 'B14'].includes(card.maintenanceCycle));
  assert.equal(card.reviewState, `${card.maintenanceCycle.toLowerCase()}-maintenance-reviewed`);
  assert.ok(card.sourceSignalId);
  assert.ok(card.sourceBlockIds.length > 0);
  assert.ok(card.answerCharacterCount <= 70);
}

process.stdout.write(`${JSON.stringify({
  status: 'passed',
  addedRecallCards: artifact.recallCards.length,
  runtimeRecallCards: artifact.validation.runtimeRecallCardsAfterPromotion,
  rejectedSignals: artifact.disposition.rejectedAfterReview,
  remainingUnreviewedSignals: artifact.disposition.remainingUnreviewedSignals,
  mode: artifact.exitDecision.mode,
})}\n`);
