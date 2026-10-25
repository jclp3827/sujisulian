const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const baselinePath = path.resolve(process.argv[3] || path.join(root, 'docs/knowledge-platform/implementations/evidence/notes-learning-nq-start-resources-20261021.json'));
const readModule = relative => require(path.join(root, relative));
const baselineText = fs.readFileSync(baselinePath, 'utf8');
const baseline = JSON.parse(baselineText);
const { fingerprint } = readModule('miniprogram/subpackages/note/services/learning-content');
const { createEngine, STORAGE_KEY } = readModule('miniprogram/subpackages/note/services/practice-session');
const catalog = readModule('miniprogram/subpackages/note/models/note-catalog');
const { pack, content, availableContent } = require('./lib/notes-learning-test-fixture').legacyFixture(root);
const clone = value => JSON.parse(JSON.stringify(value));
const metadata = ['assessment', 'knowledgeAtoms', 'comparison', 'assessmentFingerprint', 'originTask'];
const changedFields = ['prompt', 'explanation', 'revision', 'refs', 'familyId', 'exposureGroupId', 'sourceKind', 'answer', 'options'];
const reports = [];

function inMemoryStore() {
  const data = {};
  return {
    data,
    getStorageSync: key => data[key],
    setStorageSync: (key, value) => { data[key] = clone(value); },
  };
}
function freshEngine(selected, storage) {
  let serial = 0;
  return createEngine(selected, storage, () => 1, () => `probe-${++serial}`);
}

const oldApplications = baseline.resources.filter(resource => resource.origin && resource.exerciseKinds.includes('application'));
assert.equal(oldApplications.length, 7, 'Expected the frozen seven original applications in the V1 baseline');
let contentChangesRejected = 0;
for (const oldResource of oldApplications) {
  const selected = clone(content);
  selected.entryPlans.application.resourceIds = [oldResource.id];
  const storage = inMemoryStore();
  const session = freshEngine(selected, storage).start({ kind: 'application', fresh: true }).session;
  assert(session, `${oldResource.id}: original application is no longer enrolled`);
  const currentResource = selected.resources.find(resource => resource.id === oldResource.id);
  const stripped = clone(currentResource);
  metadata.forEach(key => { delete stripped[key]; });
  assert.deepEqual(stripped, oldResource, `${oldResource.id}: content changed beyond added policy metadata`);

  const saved = storage.data[STORAGE_KEY].sessions[session.id];
  const item = saved.items[0];
  metadata.forEach(key => { delete item[key]; });
  item.resourceSignature = fingerprint(oldResource);
  const resumed = freshEngine(content, storage).getSession(session.id);
  assert.equal(resumed?.id, session.id, `${oldResource.id}: original V1 snapshot could not resume`);
  const resumedEngine = freshEngine(content, storage);
  resumedEngine.selection(session.id, item.answer);
  assert.equal(resumedEngine.submit(session.id).answers[item.instanceId].outcome, 'correct');

  for (const key of changedFields) {
    const changed = clone(content);
    const resource = changed.resources.find(resource => resource.id === oldResource.id);
    if (key === 'revision') resource[key] += 1;
    else if (key === 'refs') resource.refs[0].tabId += '-changed';
    else if (key === 'options') resource.options[0].text += ' changed';
    else resource[key] += ' changed';
    assert.equal(freshEngine(changed, storage).getSession(session.id), null,
      `${oldResource.id}: changed ${key} incorrectly survived compatibility migration`);
    contentChangesRejected += 1;
  }
  const removed = clone(content);
  removed.entryPlans.application.resourceIds = removed.entryPlans.application.resourceIds.filter(id => id !== oldResource.id);
  assert.equal(freshEngine(removed, storage).getSession(session.id), null,
    `${oldResource.id}: removed entry incorrectly resumed`);
  contentChangesRejected += 1;
  reports.push({ resourceId: oldResource.id, baselineContentPreserved: true, legacySessionResumed: true, contentChangesRejected: 10 });
}
assert.equal(contentChangesRejected, 70);

let methodComparisons = 0;
for (const resource of content.resources.filter(resource => resource.exerciseKinds.includes('method'))) {
  const selected = clone(content);
  selected.entryPlans.method.resourceIds = [resource.id];
  const storage = inMemoryStore();
  const engine = freshEngine(selected, storage);
  const session = engine.start({ kind: 'method', fresh: true }).session;
  assert(session && session.items.length === 1, `${resource.id}: single method fixture did not start`);
  const item = session.items[0];
  assert(item.comparison, `${resource.id}: comparison data missing`);
  const read = engine.openComparison(session.id);
  const answer = read.answers[item.instanceId];
  assert.equal(answer.comparisonRead, true);
  assert.equal(answer.consultedBeforeSubmit, true);
  assert.equal(answer.outcome, undefined);
  assert.equal(answer.answerExposed, undefined);
  assert.equal(engine.result(session.id).correct, 0);
  assert.equal(engine.result(session.id).assisted, 0);
  assert.deepEqual(storage.data[STORAGE_KEY].exposures, {}, `${resource.id}: comparison read wrote answer exposure`);

  const reloaded = freshEngine(selected, storage);
  assert.equal(reloaded.getSession(session.id).answers[item.instanceId].comparisonRead, true);
  reloaded.selection(session.id, item.answer);
  const submitted = reloaded.submit(session.id);
  assert.equal(submitted.answers[item.instanceId].outcome, 'assisted');
  assert.equal(reloaded.result(session.id).correct, 0);
  assert.equal(reloaded.result(session.id).assisted, 1);
  assert.deepEqual(storage.data[STORAGE_KEY].exposures, {}, `${resource.id}: assisted answer wrote unrelated exposure`);
  methodComparisons += 1;
}
assert(methodComparisons > 0);

console.log(JSON.stringify({
  passed: true,
  scope: 'historical legacy-engine fixture; not proof of V4 current candidate eligibility',
  version: pack.version,
  baselineVersion: baseline.version,
  baselineSha256: crypto.createHash('sha256').update(baselineText).digest('hex'),
  originalApplications: oldApplications.length,
  compatibilityMetadataFields: metadata,
  contentChangesRejected,
  methodComparisons,
  comparisonReadResults: { independentCorrect: 0, assistedAfterCorrectSubmission: methodComparisons, answerExposureWrites: 0 },
  originalApplicationReports: reports,
}, null, 2));
