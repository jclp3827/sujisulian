#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_PATH = path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-learning-bank-expansion-v1.json');
const BUILDER_PATH = path.join(ROOT, 'scripts/build-politics-learning-bank-expansion-v1.js');

const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, 'utf8'));
const rebuilt = spawnSync(process.execPath, [BUILDER_PATH], {
  cwd: ROOT,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});

assert.equal(rebuilt.status, 0, rebuilt.stderr || 'expansion builder failed');
assert.deepEqual(artifact, JSON.parse(rebuilt.stdout), 'checked-in expansion differs from deterministic builder output');
assert.equal(artifact.status, 'expansion-reviewed-maintenance-ready');
assert.equal(artifact.validation.passed, true);
assert.equal(artifact.recallCards.length, 23);
assert.equal(artifact.confusionItems.length, 4);
assert.equal(artifact.validation.runtimeRecallCardsAfterPromotion, 90);
assert.equal(artifact.validation.runtimeConfusionItemsAfterPromotion, 14);
assert.equal(artifact.validation.directlyProjectedObjectivesAfterPromotion, 83);
assert.equal(artifact.validation.remainingObjectiveIds.length, 14);
assert.deepEqual(artifact.validation.remainingObjectiveIds, artifact.editorialDisposition.systematicOnlyObjectiveIds);
assert.equal(artifact.validation.remainingObjectivesAreSystematicOnly, true);
assert.deepEqual(artifact.validation.duplicateCardIds, []);
assert.deepEqual(artifact.validation.duplicatePrompts, []);
assert.deepEqual(artifact.validation.answersOver70Characters, []);
assert.equal(artifact.validation.acceptedRelatedSignals.length, 4);
assert.equal(artifact.validation.rejectedRelatedSignals.length, 5);
assert.equal(artifact.validation.withinUnitSignalsRoutedAwayFromConfusion, 67);
assert.equal(artifact.exitDecision.mode, 'maintenance');
assert.equal(artifact.exitDecision.triggeredBy, 'all-current-eligible-signals-have-explicit-disposition');
assert.ok(artifact.exitDecision.reopenOnlyFor.length >= 4);

for (const card of artifact.recallCards) {
  assert.ok(card.sourceBlockIds.length > 0, `${card.cardId}: missing source`);
  assert.ok(card.remedy.sourceBlockIds.length > 0, `${card.cardId}: missing remedy`);
  assert.ok(card.answerCharacterCount <= 70, `${card.cardId}: answer too long`);
  assert.match(card.reviewState, /^b[89]-expansion-reviewed$/);
}

for (const item of artifact.confusionItems) {
  assert.equal(item.status, 'accepted-expansion');
  assert.ok(item.left.sourceBlockIds.length > 0 && item.right.sourceBlockIds.length > 0);
  assert.equal(item.initialCheck.options.length, 2);
  assert.equal(item.variantCheck.options.length, 2);
  assert.notEqual(item.initialCheck.answerUnitId, item.variantCheck.answerUnitId);
}

process.stdout.write(`${JSON.stringify({
  status: 'passed',
  addedRecallCards: artifact.recallCards.length,
  addedConfusionItems: artifact.confusionItems.length,
  projectedObjectives: artifact.validation.directlyProjectedObjectivesAfterPromotion,
  maintenanceMode: artifact.exitDecision.mode,
})}\n`);
