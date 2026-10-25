const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { build, DEFAULT_OUTPUT } = require('./build-politics-systematic-user-comprehension-uc2-ai-review');

const root = path.resolve(__dirname, '..');

function main() {
  const runtimeEvidencePath = path.join(root, 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc2-runtime-20261023.json');
  if (fs.existsSync(runtimeEvidencePath)) return validateIntegratedReview(runtimeEvidencePath);
  const first = build({ output: false });
  const second = build({ output: false });
  assert.deepEqual(first, second, 'UC2 AI review is not deterministic');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, DEFAULT_OUTPUT), 'utf8')), first, 'written UC2 AI review is stale');
  assert.equal(first.roles.length, 4);
  for (const role of first.roles) {
    assert.equal(role.lessonAssessments.length, 6);
    assert.ok(role.lessonAssessments.every(item => item.state === 'pass' && item.remainingBlockers.length === 0));
  }
  assert.equal(first.roles.find(role => role.roleId === 'ai-subject-expert').objectSourceReferenceCount, 106);
  assert.equal(first.finalGate.aiRolesPassed, true);
  assert.equal(first.finalGate.risk, 0);
  assert.equal(first.finalGate.hold, 0);
  assert.equal(first.finalGate.realUserSample, 'pending');
  assert.equal(first.finalGate.canonicalSourceChanged, false);
  assert.equal(first.finalGate.runtimeChanged, false);
  console.log(JSON.stringify({ status: 'passed', batch: first.batchId, roles: 4, lessonsPerRole: 6, sourceReferencesChecked: 106, realUserSample: 'pending' }));
}

function validateIntegratedReview(runtimeEvidencePath) {
  const review = JSON.parse(fs.readFileSync(path.join(root, DEFAULT_OUTPUT), 'utf8'));
  const evidence = JSON.parse(fs.readFileSync(runtimeEvidencePath, 'utf8'));
  const proposalPath = path.join(root, evidence.reviewedProposalPath);
  const proposalHash = crypto.createHash('sha256').update(fs.readFileSync(proposalPath)).digest('hex');
  assert.equal(proposalHash, evidence.reviewedProposalSha256, 'reviewed proposal hash drift');
  assert.equal(review.inputs.proposalSha256, proposalHash, 'AI review no longer identifies integrated proposal');
  assert.equal(review.roles.length, 4);
  for (const role of review.roles) {
    assert.equal(role.lessonAssessments.length, 6);
    assert.ok(role.lessonAssessments.every(item => item.state === 'pass' && item.remainingBlockers.length === 0));
  }
  assert.equal(review.finalGate.aiRolesPassed, true);
  assert.equal(review.finalGate.risk, 0);
  assert.equal(review.finalGate.hold, 0);
  assert.equal(evidence.realUserAcceptance, 'pending');
  console.log(JSON.stringify({ status: 'passed', batch: review.batchId, roles: 4, lessonsPerRole: 6,
    candidateIntegrated: true, curriculumVersion: evidence.curriculumVersion, realUserSample: 'pending' }));
}

main();
