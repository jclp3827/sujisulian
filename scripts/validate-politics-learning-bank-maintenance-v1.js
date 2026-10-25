#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_PATH = path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-learning-bank-maintenance-v1.json');
const BUILDER_PATH = path.join(ROOT, 'scripts/build-politics-learning-bank-maintenance-v1.js');
const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, 'utf8'));
const rebuilt = spawnSync(process.execPath, [BUILDER_PATH], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

assert.equal(rebuilt.status, 0, rebuilt.stderr || 'B11 maintenance builder failed');
assert.deepEqual(artifact, JSON.parse(rebuilt.stdout), 'checked-in B11 artifact differs from deterministic builder output');
assert.equal(artifact.status, 'maintenance-reviewed-return-to-maintenance');
assert.equal(artifact.cycle.id, 'B11');
assert.equal(artifact.recallCards.length, 12);
assert.equal(artifact.disposition.reviewedHeldWithinSignals, 67);
assert.equal(artifact.disposition.acceptedAsDistinctErrorCorrection, 12);
assert.equal(artifact.disposition.remainingWithoutDistinctNewTask, 55);
assert.equal(artifact.validation.runtimeRecallCardsAfterPromotion, 102);
assert.equal(artifact.validation.runtimeConfusionItemsAfterPromotion, 14);
assert.equal(artifact.validation.directlyProjectedObjectivesAfterPromotion, 83);
assert.deepEqual(artifact.validation.duplicateCardIds, []);
assert.deepEqual(artifact.validation.duplicatePrompts, []);
assert.deepEqual(artifact.validation.answersOver70Characters, []);
assert.equal(artifact.validation.passed, true);
assert.equal(artifact.exitDecision.mode, 'maintenance');

for (const card of artifact.recallCards) {
  assert.equal(card.cardType, 'error-correction');
  assert.equal(card.reviewState, 'b11-maintenance-reviewed');
  assert.ok(card.sourceSignalId);
  assert.ok(card.sourceBlockIds.length > 0);
  assert.ok(card.answerCharacterCount <= 70);
}

process.stdout.write(`${JSON.stringify({
  status: 'passed',
  addedRecallCards: artifact.recallCards.length,
  runtimeRecallCards: artifact.validation.runtimeRecallCardsAfterPromotion,
  remainingHeldSignals: artifact.disposition.remainingWithoutDistinctNewTask,
  mode: artifact.exitDecision.mode,
})}\n`);
