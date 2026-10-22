#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const EVIDENCE_PATH = 'docs/knowledge-platform/implementations/evidence/politics-learning-content-b7-runtime-integration-20261021.json';

const absolute = (relativePath) => path.join(ROOT, relativePath);

const evidence = JSON.parse(fs.readFileSync(absolute(EVIDENCE_PATH), 'utf8'));
// B7 is a historical checkpoint. Current runtime expansion is audited by B10;
// re-running the B7 auditor against a later runtime would rewrite history.
assert.equal(evidence.status, 'runtime-integrated-automated-passed-user-effect-pending');
assert.equal(evidence.runtimeIntegration.recallCards, 67);
assert.equal(evidence.runtimeIntegration.confusionItems, 10);
assert.equal(evidence.runtimeIntegration.examSessionSize, 4);
assert.equal(evidence.runtimeIntegration.confusionItemsPerSession, 1);
assert.equal(evidence.runtimeIntegration.initialAndReverseVariantRequired, true);
assert.equal(evidence.expansionAssessment.recall.directlyProjectedObjectives, 60);
assert.equal(evidence.expansionAssessment.recall.unprojectedObjectives, 37);
assert.equal(evidence.expansionAssessment.recall.nextHighConfidenceObjectiveCount, 11);
assert.equal(evidence.expansionAssessment.confusion.heldRelatedSignals, 9);
assert.equal(evidence.expansionAssessment.confusion.heldWithinUnitSignals, 67);
assert.equal(evidence.verification.failedValidators.length, 0);
assert.equal(evidence.release.eligible, false);

process.stdout.write(`${JSON.stringify({
  status: 'passed',
  runtimePackageVersion: evidence.authority.runtimePackageVersion,
  recallCards: evidence.runtimeIntegration.recallCards,
  confusionItems: evidence.runtimeIntegration.confusionItems,
  expansionRecommended: evidence.expansionAssessment.recommended,
  releaseEligible: evidence.release.eligible,
})}\n`);
