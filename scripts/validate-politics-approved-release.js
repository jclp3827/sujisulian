const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const manifest = JSON.parse(read('docs/knowledge-platform/implementations/evidence/politics-approval-20261020.json'));
const runtime = require('../miniprogram/models/politics-p3-v2-runtime');
const { knowledgePackage } = require('../miniprogram/services/knowledge-platform/politics-runtime');
const platform = require('../miniprogram/services/knowledge-platform');

assert.equal(manifest.baseCommit, '3a08b37df2fd1a863a96686385e00da0aa9e8b7f');
assert.equal(manifest.publicationState, 'approved-not-published');
assert.equal(manifest.unitCount, 37);
assert.equal(manifest.units.length, 37);
assert.equal(new Set(manifest.units.map(unit => unit.id)).size, 37);
for (const unit of manifest.units) {
  const current = read(unit.path);
  assert.equal(sha256(current), unit.approvedSha256, `${unit.id}: approved source changed`);
  const normalized = Buffer.from(current.toString().replace('\nstatus: approved\n', '\nstatus: review\n'));
  assert.equal(sha256(normalized), unit.reviewSha256, `${unit.id}: more than status changed`);
}
assert.equal(sha256(read(manifest.quickPrimer.path)), manifest.quickPrimer.approvedSha256);

const emitted = JSON.parse(read('docs/knowledge-pilot/dist/politics-v2-runtime/politics-v2-runtime-preview.json'));
assert.deepEqual(runtime, emitted, 'runtime model differs from the generated package');
assert.equal(runtime.buildScope, 'runtime');
assert.equal(runtime.packageType, 'runtime');
assert.deepEqual(runtime.statusCounts, { draft: 0, review: 0, approved: 37, published: 0, stale: 0 });
assert.equal(runtime.points.length, 37);
assert.ok(runtime.points.every(point => point.status === 'approved' && point.publishable));
assert.equal(runtime.quickPrimers.length, 1);
assert.equal(runtime.quickPrimers[0].status, 'approved');
assert.equal(runtime.quickPrimers[0].sections.length, 8);
assert.equal(runtime.contentCoverage.reviewState, 'partial');
assert.deepEqual(runtime.contentCoverage.excludedTopics, ['时政', '党史', '完整考试范围']);
assert.equal(knowledgePackage.buildTarget, 'release');
assert.equal(knowledgePackage.knowledgeUnits.filter(unit => unit.publishable).length, 37);
assert.ok(knowledgePackage.navigationNodes.every(node => node.status === 'approved'));
assert.deepEqual(knowledgePackage.diagnostics.errors, []);
assert.equal(platform.planRecommendedRoute(knowledgePackage, 'quick').steps.length, 8);

const app = JSON.parse(read('miniprogram/app.json'));
assert.equal(app.tabBar.list.length, 4);
assert.ok(!JSON.stringify(app).includes('photo'));
const project = JSON.parse(read('project.config.json'));
for (const obsolete of ['models/politics-p3-v2-preview.js', 'models/politics-preview.js']) {
  assert.ok(project.packOptions.ignore.some(rule => rule.type === 'file' && rule.value === obsolete));
}

console.log(JSON.stringify({ status: 'passed', scope: manifest.scope, approvedUnits: 37, runtimeVersion: runtime.packageVersion, primerSections: 8, excludedTopics: runtime.contentCoverage.excludedTopics }));
