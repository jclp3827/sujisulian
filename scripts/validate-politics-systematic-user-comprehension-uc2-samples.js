const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { build, DEFAULT_OUTPUT, DEFAULT_USER_VIEW_OUTPUT, TARGET_IDS } = require('./build-politics-systematic-user-comprehension-uc2-samples');
const { validate: validateContent } = require('./validate-politics-systematic-content');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');

function main() {
  const runtimeEvidencePath = path.join(root, 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc2-runtime-20261023.json');
  if (fs.existsSync(runtimeEvidencePath)) return validateIntegratedCandidate(runtimeEvidencePath);
  const first = build({ output: false });
  const second = build({ output: false });
  assert.deepEqual(first.output, second.output, 'UC2 proposal is not deterministic');
  const written = JSON.parse(fs.readFileSync(path.join(root, DEFAULT_OUTPUT), 'utf8'));
  assert.deepEqual(written, first.output, 'written UC2 proposal is stale');
  const writtenUserView = JSON.parse(fs.readFileSync(path.join(root, DEFAULT_USER_VIEW_OUTPUT), 'utf8'));
  assert.deepEqual(writtenUserView, first.userView, 'written UC2 user view is stale');
  assert.ok(!JSON.stringify(writtenUserView).includes('sourceBlockIds'));
  assert.ok(!JSON.stringify(writtenUserView).includes('before'));
  assert.deepEqual(first.output.samples.map(item => item.lessonId), TARGET_IDS);
  assert.equal(first.output.canonicalSourceChanged, false);
  assert.equal(first.output.runtimeChanged, false);
  assert.equal(first.output.progressImpact.migrationRequired, false);
  assert.equal(new Set(first.output.samples.map(item => item.after.id)).size, TARGET_IDS.length);
  assert.ok(first.output.samples.every(item => item.changedFields.includes('question') && item.changedFields.includes('reflection')));
  assert.ok(first.output.samples.every(item => item.reviewState['real-user-sample'] === 'pending'));

  const byId = new Map(first.output.samples.map(item => [item.lessonId, item]));
  assert.equal(byId.get('DIALECTICS-01').after.sections.length, 3);
  assert.ok(!JSON.stringify(byId.get('DIALECTICS-01').after).includes('u024:b002'));
  assert.ok(!JSON.stringify(byId.get('DEV-06').after.recap).includes('u007:b052'));
  assert.ok(!JSON.stringify(byId.get('DEV-06').after.recap).includes('u007:b056'));
  assert.ok(!byId.get('MOD-01').after.reflection.prompt.includes('提纲'));
  assert.ok(!byId.get('SYS-01').after.sections.some(section => section.label.includes('材料怎样用')));
  assert.ok(byId.get('TEN-02').after.sections[0].label.includes('十个明确'));
  assert.ok(byId.get('TEN-03').after.scopeLimit.includes('整理线索'));

  const content = validateContent(first.proposed, first.validationInventory);
  assert.equal(content.sampleLessons, 72);
  assert.equal(content.directReflectionAnswers, 72);
  console.log(JSON.stringify({
    status: 'passed',
    batch: first.output.batchId,
    sampleLessons: TARGET_IDS.length,
    canonicalSourceChanged: false,
    runtimeChanged: false,
    hypotheticalContentValidation: content.status,
    pending: ['real-user-sample', 'canonical-implementation-in-UC6'],
  }));
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function validateIntegratedCandidate(runtimeEvidencePath) {
  const evidence = JSON.parse(fs.readFileSync(runtimeEvidencePath, 'utf8'));
  const proposalPath = path.join(root, evidence.reviewedProposalPath);
  const proposal = JSON.parse(fs.readFileSync(proposalPath, 'utf8'));
  const userView = JSON.parse(fs.readFileSync(path.join(root, DEFAULT_USER_VIEW_OUTPUT), 'utf8'));
  assert.equal(sha256(proposalPath), evidence.reviewedProposalSha256, 'integrated proposal hash drift');
  assert.deepEqual(proposal.samples.map(item => item.lessonId), TARGET_IDS);
  assert.equal(proposal.canonicalSourceChanged, false, 'historical proposal boundary drift');
  assert.ok(!JSON.stringify(userView).includes('sourceBlockIds'));
  assert.ok(!JSON.stringify(userView).includes('before'));
  assert.equal(evidence.status, 'candidate-integrated-for-user-test');
  assert.equal(evidence.stableLessonIds, true);
  assert.equal(evidence.orderChanged, false);
  assert.equal(evidence.splitOrMerge, false);
  assert.equal(evidence.realUserAcceptance, 'pending');
  validateUserComprehensionLineage(root, evidence.batchId);
  console.log(JSON.stringify({ status: 'passed', batch: proposal.batchId, sampleLessons: TARGET_IDS.length,
    candidateIntegrated: true, curriculumVersion: evidence.curriculumVersion, realUserSample: 'pending' }));
}

main();
