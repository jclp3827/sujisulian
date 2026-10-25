#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const evidencePath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p10r1-20261024.json';
const auditPath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-region-responsibility-audit-p10-20261024.json';
const retrospectivePath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-retrospective-audit-20261024.json';
const runtimeProbePath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p10r1-runtime-probe-20261024.json';
const absolute = file => path.join(root, file);
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(absolute(file))).digest('hex');

const evidence = read(evidencePath);
const audit = read(auditPath);
const retrospective = read(retrospectivePath);
const runtimeProbe = read(runtimeProbePath);
assert.equal(audit.status, 'passed-with-retained-hold');
assert.equal(audit.scope.openRiskCount, 0);
assert.equal(runtimeProbe.status, 'passed');
assert.equal(evidence.curriculumVersion, audit.curriculumVersion);
assert.equal(evidence.curriculumVersion, retrospective.curriculumVersion);
assert.equal(evidence.curriculumVersion, runtimeProbe.curriculumVersion);

Object.assign(evidence, {
  status: 'candidate-integrated-runtime-verified-region-audit-passed',
  governanceSha256: digest(evidence.governancePath),
  historicalRegionAudit: 'passed-with-retained-hold',
  historicalRegionAuditPath: auditPath,
  historicalRegionAuditSha256: digest(auditPath),
  retrospectiveAuditPath: retrospectivePath,
  retrospectiveAuditSha256: digest(retrospectivePath),
  runtimePageCheck: 'passed',
  runtimeProbePath,
  runtimeProbeSha256: digest(runtimeProbePath),
  aiReview: 'not-run-for-p10r1-region-responsibility-revision',
});

fs.writeFileSync(absolute(evidencePath), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({
  status: evidence.status,
  curriculumVersion: evidence.curriculumVersion,
  historicalRegionAudit: evidence.historicalRegionAudit,
  openRiskCount: audit.scope.openRiskCount,
  runtimePageCheck: evidence.runtimePageCheck,
  realUserAcceptance: evidence.realUserAcceptance,
}));
