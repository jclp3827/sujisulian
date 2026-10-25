#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const EVIDENCE_PATH = 'docs/knowledge-platform/implementations/evidence/politics-learning-content-b10-bank-expansion-closeout-20261021.json';
const absolute = (relativePath) => path.join(ROOT, relativePath);

const evidence = JSON.parse(fs.readFileSync(absolute(EVIDENCE_PATH), 'utf8'));
// B10 is the maintenance-entry checkpoint. B11 records the explicitly
// requested next maintenance batch without rewriting this historical state.
assert.equal(evidence.status, 'expanded-maintenance-mode-automated-passed-user-effect-pending');
assert.equal(evidence.expansion.seedRecallCards, 67);
assert.equal(evidence.expansion.addedRecallCards, 23);
assert.equal(evidence.expansion.runtimeRecallCards, 90);
assert.equal(evidence.expansion.seedConfusionItems, 10);
assert.equal(evidence.expansion.addedConfusionItems, 4);
assert.equal(evidence.expansion.runtimeConfusionItems, 14);
assert.equal(evidence.expansion.directlyProjectedObjectives, 83);
assert.equal(evidence.expansion.remainingObjectiveIds.length, 14);
assert.equal(evidence.expansion.remainingObjectiveDisposition, 'systematic-only');
assert.equal(evidence.expansion.rejectedRelatedRelationIds.length, 5);
assert.equal(evidence.expansion.withinUnitSignalsRoutedAwayFromConfusion, 67);
assert.equal(evidence.runtime.relationCount, 39);
assert.equal(evidence.runtime.contrastRelationCount, 14);
assert.equal(evidence.runtime.examSessionSize, 4);
assert.equal(evidence.runtime.confusionItemsPerSession, 1);
assert.equal(evidence.runtime.systematicProgressCompatibleFromB7, true);
assert.equal(evidence.runtime.diagnosticsClear, true);
assert.equal(evidence.exitDecision.mode, 'maintenance');
assert.equal(evidence.exitDecision.triggeredBy, 'all-current-eligible-signals-have-explicit-disposition');
assert.equal(evidence.verification.failedValidators.length, 0);
assert.deepEqual(evidence.verification.simulator.consoleErrors, []);
assert.equal(evidence.release.eligible, false);

process.stdout.write(`${JSON.stringify({
  status: 'passed',
  bankVersion: evidence.authority.bankVersion,
  recallCards: evidence.expansion.runtimeRecallCards,
  confusionItems: evidence.expansion.runtimeConfusionItems,
  projectedObjectives: evidence.expansion.directlyProjectedObjectives,
  expansionMode: evidence.exitDecision.mode,
  releaseEligible: evidence.release.eligible,
})}\n`);
