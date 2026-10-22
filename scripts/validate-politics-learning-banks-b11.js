#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const EVIDENCE_PATH = 'docs/knowledge-platform/implementations/evidence/politics-learning-content-b11-maintenance-expansion-20261021.json';
const absolute = (relativePath) => path.join(ROOT, relativePath);
const evidence = JSON.parse(fs.readFileSync(absolute(EVIDENCE_PATH), 'utf8'));
// B11 is a historical maintenance checkpoint. B12-B15 continue from this
// evidence without rewriting the bank version, counts or simulator snapshot.
assert.equal(evidence.status, 'maintenance-batch-integrated-automated-passed-user-effect-pending');
assert.equal(evidence.maintenanceBatch.recallCardsBefore, 90);
assert.equal(evidence.maintenanceBatch.addedErrorCorrectionCards, 12);
assert.equal(evidence.maintenanceBatch.runtimeRecallCards, 102);
assert.equal(evidence.maintenanceBatch.runtimeConfusionItems, 14);
assert.equal(evidence.maintenanceBatch.directlyProjectedObjectives, 83);
assert.equal(evidence.maintenanceBatch.reviewedHeldWithinSignals, 67);
assert.equal(evidence.maintenanceBatch.acceptedAsDistinctErrorCorrection, 12);
assert.equal(evidence.maintenanceBatch.remainingWithoutDistinctNewTask, 55);
assert.equal(evidence.maintenanceBatch.selectedSignalIds.length, 12);
assert.equal(evidence.runtime.examSessionSize, 4);
assert.equal(evidence.runtime.confusionItemsPerSession, 1);
assert.equal(evidence.runtime.relationCount, 39);
assert.equal(evidence.runtime.contrastRelationCount, 14);
assert.equal(evidence.runtime.systematicProgressCompatibleFromB10, true);
assert.equal(evidence.runtime.diagnosticsClear, true);
assert.equal(evidence.exitDecision.mode, 'maintenance');
assert.equal(evidence.verification.failedValidators.length, 0);
assert.equal(evidence.verification.simulator.totalRuntimeCardsVerifiedStatically, 102);
assert.deepEqual(evidence.verification.simulator.consoleErrors, []);
assert.equal(evidence.release.eligible, false);

process.stdout.write(`${JSON.stringify({
  status: 'passed',
  bankVersion: evidence.authority.bankVersion,
  recallCards: evidence.maintenanceBatch.runtimeRecallCards,
  confusionItems: evidence.maintenanceBatch.runtimeConfusionItems,
  remainingHeldSignals: evidence.maintenanceBatch.remainingWithoutDistinctNewTask,
  mode: evidence.exitDecision.mode,
  releaseEligible: evidence.release.eligible,
})}\n`);
