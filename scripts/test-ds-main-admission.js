'use strict';
const assert = require('assert/strict');
const fs = require('fs'), path = require('path');
const { decide } = require('./validate-ds-main-admission');
const proposal = JSON.parse(fs.readFileSync(path.resolve(__dirname,
  '../docs/design-system/evidence/closeout-20261101/admission/main-development-admission-proposal.json')));
const grant = { ...proposal, status: 'approved', authorizationSource: 'PURE DECISION TEST FIXTURE ONLY; not a real user grant' };
const facts = { authorizationBound: true, frozenSourceIsAncestor: true, productMatches: true, cloudMatches: true,
  configMatches: true, approvedDSStateUnchanged: true, memoryExcluded: true, gateHashesMatch: true,
  protectedPass: true, originalBackupRecoverable: true, mainPositionMatches: true,
  dsPass: true, selftestsPass: true, businessPass: true, documentationPass: true, knownHistoricalProtectionFailure: true,
  budget: { exitCode: 1, bytes: 2343825, limitBytes: 1572864 } };
const cases = [];
function check(name, candidateGrant, candidateFacts, expected, purpose) {
  const result = decide(candidateGrant, candidateFacts, purpose);
  assert.equal(result.developmentAllowed, expected, name);
  assert.equal(result.releaseAllowed, false, name);
  cases.push({ name, passed: true });
}
check('bounded, explicitly approved decision fixture', grant, facts, true);
check('pending proposal cannot activate', proposal, facts, false);
check('missing approval source', { ...grant, authorizationSource: null }, facts, false);
check('wrong scope', { ...grant, purpose: 'all-future-merges' }, facts, false);
check('release cannot use development debt', grant, facts, false, 'release');
for (const key of Object.keys(facts).filter(key => key !== 'budget')) {
  check('reject missing/failed ' + key, grant, { ...facts, [key]: false }, false);
}
check('budget exceeds exact frozen candidate', grant, { ...facts, budget: { ...facts.budget, bytes: 2343826 } }, false);
check('changed budget threshold', grant, { ...facts, budget: { ...facts.budget, limitBytes: 3000000 } }, false);
check('unexpected budget status cannot be laundered', grant, { ...facts, budget: { ...facts.budget, exitCode: 0 } }, false);
check('unknown debt shape fails closed', grant, { ...facts, budget: {} }, false);
console.log(JSON.stringify({ passed: cases.length, cases,
  scope: 'Pure decision fixtures only; no real approval record/ref is created and production/main are untouched.' }, null, 2));
