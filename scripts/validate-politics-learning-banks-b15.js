#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const EVIDENCE_PATH = 'docs/knowledge-platform/implementations/evidence/politics-learning-content-b15-maintenance-closeout-20261021.json';
const AUDITOR_PATH = 'scripts/audit-politics-learning-banks-b15.js';
const absolute = (relativePath) => path.join(ROOT, relativePath);
const evidence = JSON.parse(fs.readFileSync(absolute(EVIDENCE_PATH), 'utf8'));
const regenerated = spawnSync(process.execPath, [absolute(AUDITOR_PATH)], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

assert.equal(regenerated.status, 0, regenerated.stderr || regenerated.stdout || 'B15 audit failed');
assert.deepEqual(evidence, JSON.parse(regenerated.stdout), 'checked-in B15 evidence differs from fresh audit');
assert.equal(evidence.status, 'maintenance-expansion-closed-automated-passed-user-effect-pending');
assert.equal(evidence.expansion.recallCardsBefore, 102);
assert.equal(evidence.expansion.addedRecallCards, 34);
assert.equal(evidence.expansion.runtimeRecallCards, 136);
assert.equal(evidence.expansion.runtimeConfusionItems, 14);
assert.equal(evidence.expansion.directlyProjectedObjectives, 83);
assert.equal(evidence.expansion.reviewedSignals, 55);
assert.equal(evidence.expansion.acceptedSignals, 34);
assert.equal(evidence.expansion.rejectedSignals, 21);
assert.equal(evidence.expansion.remainingUnreviewedSignals, 0);
assert.deepEqual(evidence.expansion.cycles.map((cycle) => [cycle.id, cycle.recallCards]), [['B12', 12], ['B13', 12], ['B14', 10], ['B15', 0]]);
assert.equal(evidence.expansion.selectedSignalIds.length, 34);
assert.equal(evidence.runtime.examSessionSize, 4);
assert.equal(evidence.runtime.confusionItemsPerSession, 1);
assert.equal(evidence.runtime.relationCount, 39);
assert.equal(evidence.runtime.contrastRelationCount, 14);
assert.equal(evidence.runtime.systematicProgressCompatibleFromB11, true);
assert.equal(evidence.runtime.diagnosticsClear, true);
assert.equal(evidence.exitDecision.mode, 'closed-until-trigger');
assert.match(evidence.exitDecision.triggeredBy, /accepted 0 cards/);
assert.equal(evidence.verification.validatorCount, 17);
assert.equal(evidence.verification.failedValidators.length, 0);
assert.equal(evidence.verification.simulator.totalRuntimeCardsVerifiedStatically, 136);
assert.deepEqual(evidence.verification.simulator.consoleErrors, []);
assert.equal(evidence.verification.packaging.status, 'exceeded');
assert.equal(evidence.verification.packaging.mainPackageMiB, 2.939);
assert.equal(evidence.verification.packaging.limitMiB, 1.5);
assert.equal(evidence.release.eligible, false);

process.stdout.write(`${JSON.stringify({
  status: 'passed',
  bankVersion: evidence.authority.bankVersion,
  recallCards: evidence.expansion.runtimeRecallCards,
  confusionItems: evidence.expansion.runtimeConfusionItems,
  reviewedSignals: evidence.expansion.reviewedSignals,
  mode: evidence.exitDecision.mode,
  releaseEligible: evidence.release.eligible,
})}\n`);
