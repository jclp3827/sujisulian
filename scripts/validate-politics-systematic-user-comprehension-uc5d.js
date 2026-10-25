const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { validateUserComprehensionLineage } = require('./lib/politics-systematic-user-comprehension-lineage');

const root = path.resolve(__dirname, '..');
const evidencePath = path.join(root, 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc5d-20261023.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(root, evidence.sourcePath), 'utf8'));
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const aiReview = JSON.parse(fs.readFileSync(path.join(root, evidence.aiReviewPath), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const { latest } = validateUserComprehensionLineage(root, evidence.batchId);
const byId = id => source.lessons.find(item => item.id === id);

assert.equal(runtime.curriculumVersion, latest.curriculumVersion);
assert.equal(evidence.previousCurriculumVersion, 'units-2910242fbf35');
assert.equal(evidence.progressCompatible, true);
assert.equal(evidence.stableLessonIds, true);
assert.equal(evidence.orderChanged, false);
assert.equal(digest(evidence.inventoryPath), evidence.inventorySha256);
assert.equal(digest(evidence.aiReviewPath), evidence.aiReviewSha256);
assert.equal(evidence.realUserAcceptance, 'pending');
assert.equal(evidence.releaseAuthorized, false);
assert.deepEqual(evidence.retainedHoldLessonIds, ['CAPITAL-02']);
assert.equal(source.lessons.length, 72);
assert.deepEqual(runtime.lessons.map(item => item.id), source.lessons.map(item => item.id));

for (const id of ['TEN-01', 'VALUE-01', 'DEV-02', 'MOD-03', 'SYS-04', 'SYS-05', 'LIVELIHOOD-02',
  'REFORMLAW-03', 'CULTUREECO-04', 'COGNITION-02', 'MONEY-02']) {
  assert.equal(byId(id).reflection.prompt, byId(id).question, `${id} self-test does not match its core question`);
}
assert.equal(byId('TEN-03').title, '十个明确·七');
assert.match(byId('CAPITAL-02').scopeLimit, /劳动力价值/);
assert.deepEqual(byId('PARTY-03').reflection.sourceBlockIds, ['block:politics-toc-v2-u014:b027']);
assert.deepEqual(byId('SECURITY-02').reflection.sourceBlockIds,
  ['block:politics-toc-v2-u016:b008', 'block:politics-toc-v2-u016:b010']);
assert.deepEqual(byId('MONEY-01').reflection.sourceBlockIds,
  ['block:politics-toc-v2-u036:b005', 'block:politics-toc-v2-u036:b006', 'block:politics-toc-v2-u036:b007', 'block:politics-toc-v2-u036:b008']);
assert.equal(aiReview.coverage.themes, 21);
assert.deepEqual(aiReview.adjudication.implementedLessonIds, evidence.changedLessonIds);
assert.equal(aiReview.adjudication.retainedHold.lessonId, 'CAPITAL-02');
assert.equal(aiReview.adjudication.realUserAcceptance, 'pending');

console.log(JSON.stringify({ status: 'passed', batch: evidence.batchId, lessons: source.lessons.length,
  changedLessons: evidence.changedLessonIds.length, aiReviewThemes: aiReview.coverage.themes,
  retainedHolds: evidence.retainedHoldLessonIds, curriculumVersion: runtime.curriculumVersion,
  realUserAcceptance: 'pending' }));
