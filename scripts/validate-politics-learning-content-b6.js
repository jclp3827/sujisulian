#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EVIDENCE_PATH = 'docs/knowledge-platform/implementations/evidence/politics-learning-content-b6-handoff-20261021.json';

function absolute(relativePath) { return path.join(ROOT, relativePath); }

function main() {
  const evidence = JSON.parse(fs.readFileSync(absolute(EVIDENCE_PATH), 'utf8'));
  // B6 records the pre-integration handoff. Later runtime states are audited in
  // later batches and must not make this historical checkpoint nondeterministic.
  assert.strictEqual(evidence.status, 'candidate-handoff-ready-user-effect-pending');
  assert.strictEqual(evidence.validatorRuns.length, 12);
  assert.strictEqual(evidence.validatorRuns.every((run) => run.passed && run.exitCode === 0), true);
  assert.strictEqual(evidence.layers.sourceCorrect.status, 'passed-current-scope');
  assert.strictEqual(evidence.layers.teachingCorrect.status, 'passed-candidate-only');
  assert.strictEqual(evidence.layers.interactionUsable.status, 'automated-passed-current-runtime');
  assert.strictEqual(evidence.layers.userEffective.status, 'pending-external-user-validation');
  assert.strictEqual(evidence.layers.interactionUsable.currentRuntime.candidateRecallCardsIntegrated, false);
  assert.strictEqual(evidence.layers.interactionUsable.currentRuntime.candidateConfusionItemsIntegrated, false);
  assert.strictEqual(evidence.handoff.completed, true);
  assert.strictEqual(evidence.handoff.runtimeIntegrationDecisionRequiredLater, true);
  assert.strictEqual(evidence.handoff.userEffectEvidenceRequiredLater, true);
  assert.strictEqual(evidence.release.eligible, false);
  assert.strictEqual(evidence.passedAutomatedAndEditorialScope, true);
  process.stdout.write(`${JSON.stringify({ status: 'passed', auditedValidators: evidence.validatorRuns.length, handoff: evidence.status, releaseEligible: evidence.release.eligible })}\n`);
}

main();
