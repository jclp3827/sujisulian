const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const reviewDir = 'docs/knowledge-platform/implementations/evidence/quick-independent-review-20261024/';
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const receipt = read(reviewDir + 'repair.json');
const successor = require('../miniprogram/services/knowledge-platform/politics-runtime').knowledgePackage.quickPrimers.some(primer => primer.id === 'politics-quick-primer-v5');
const versionedKinds = new Set(['runtime', 'systematicSource', 'systematicRuntime']);
for (const file of receipt.files) if (!(successor && versionedKinds.has(file.kind))) assert.equal(hash(file.path), file.sha256, file.path + ' drifted');
const artifactFile = 'docs/knowledge-pilot/sources/politics/quick-primer-v4.json';
const artifact = read(artifactFile);
assert.equal(receipt.artifactSha256, hash(artifactFile));
const initialFindings = report => [...report.sections.flatMap(section => section.findings), ...report.globalFindings];
const severity = finding => finding.severity.slice(0, 2);
function checkReview(report, input, initial, role, blind) {
  assert.equal(report.artifactSha256, input.artifactSha256);
  assert.equal(report.artifactSha256, receipt.artifactSha256);
  assert.equal(report.independentReviewer, true);
  assert.equal(report.sourceBlind, blind);
  assert.equal(report.role, role);
  assert.equal(report.sections.length, 6);
  assert.equal(new Set(report.sections.map(section => section.id)).size, 6);
  assert.deepEqual(report.sections.map(section => section.id), input.sections.map(section => section.id));
  for (const section of report.sections) {
    assert.ok(['pass', 'pass_with_optional_polish'].includes(section.verdict));
    assert.ok(section.observation);
    assert.equal(section.findings.filter(finding => severity(finding) !== 'L3').length, 0);
  }
  assert.equal(report.globalFindings.filter(finding => severity(finding) !== 'L3').length, 0);
  assert.deepEqual(report.remainingInitialFindingIds, []);
  const original = initialFindings(initial);
  assert.deepEqual([...report.resolvedInitialFindingIds, ...report.remainingOptionalFindingIds].sort(), original.map(finding => finding.findingId).sort());
  for (const id of report.remainingOptionalFindingIds) assert.equal(severity(original.find(finding => finding.findingId === id)), 'L3');
  for (const finding of original.filter(finding => severity(finding) !== 'L3')) assert.ok(report.resolvedInitialFindingIds.includes(finding.findingId));
}
let negativeCases = 0;
for (const [name, role, blind] of [['learner', 'independent-ai-first-learner', true], ['expert', 'independent-ai-subject-expert', false]]) {
  const report = read(reviewDir + 'r1-' + name + '-review.json');
  const input = read(reviewDir + 'r1-' + name + '-input.json');
  const initial = read(reviewDir + name + '-review.json');
  checkReview(report, input, initial, role, blind);
  for (const mutate of [
    copy => { copy.artifactSha256 = 'stale'; },
    copy => { copy.sections[1].id = copy.sections[0].id; },
    copy => { copy.remainingInitialFindingIds = [initialFindings(initial).find(finding => severity(finding) === 'L2').findingId]; },
    copy => { copy.sections[0].findings.push({ severity: 'L2', problem: 'unresolved' }); },
  ]) {
    const corrupted = structuredClone(report); mutate(corrupted);
    assert.throws(() => checkReview(corrupted, input, initial, role, blind));
    negativeCases += 1;
  }
}
const input = read(reviewDir + 'r1-learner-input.json');
const platform = require('../miniprogram/services/knowledge-platform');
const { knowledgePackage } = require('../miniprogram/services/knowledge-platform/politics-runtime');
const plan = platform.planRecommendedRoute(knowledgePackage, 'quick');
let session = platform.createRouteSession(plan, 1);
for (const expected of successor ? [] : input.sections) {
  const model = platform.projectQuickPrimerViewModel(knowledgePackage, plan, session);
  const section = model.sections.find(section => section.id === model.currentSectionId);
  assert.equal(section.title, expected.title);
  assert.deepEqual(section.reading, expected.reading);
  assert.equal(model.position, expected.step);
  session = platform.applyRouteSessionEvent(plan, session, { type: 'NEXT_QUICK_SECTION', at: expected.step + 2 });
}
const diff = read(reviewDir + 'repair-diff.json');
assert.deepEqual(diff.sections.filter(section => section.changed).map(section => section.step), [2, 3, 4, 5, 6]);
assert.deepEqual(diff.sections.map(section => section.before.id), artifact.primer.sections.map(section => section.id));
const probe = read(reviewDir + 'runtime-probe.json');
assert.equal(probe.screens.length, 6);
for (const screen of probe.screens) {
  const expected = input.sections.find(section => section.id === screen.sectionId);
  assert.equal(screen.path, 'subpackages/politics/route/index');
  assert.equal(screen.step, expected.step);
  assert.equal(screen.title, expected.title);
  assert.deepEqual(screen.reading, expected.reading);
}
assert.equal(probe.screenshots.length, 12);
for (const shot of probe.screenshots) {
  assert.equal(hash(shot.path), shot.sha256);
  assert.equal(shot.authorVisuallyInspected, true);
}
assert.equal(probe.saveAndResumeAtStep4, true);
assert.equal(probe.completionVerified, true);
assert.equal(probe.completion.status, 'completed');
assert.equal(probe.progressProtection.byteEquivalent, true);
assert.equal(probe.progressProtection.beforeSha256, probe.progressProtection.afterSha256);
const compiled = read(reviewDir + 'compile.json').compile;
assert.equal(compiled.success, true);
assert.equal(compiled.data.compiled, true);
assert.equal(compiled.data.project, root);
assert.deepEqual(compiled.data.errors, []);
assert.deepEqual(compiled.data.wxml_errors, []);
const inherited = read(reviewDir + 'systematic-inheritance-proof.json');
assert.equal(inherited.visibleContentEqual, true);
assert.equal(inherited.directSourceBlocksEqual, true);
assert.equal(inherited.sourceReferencesEqual, true);
assert.equal(inherited.compatibleProgressMigrationGroups, 21);
assert.equal(inherited.lessons, 77);
assert.deepEqual(inherited.changedLessonIds, []);
if (!successor) assert.equal(require('../miniprogram/models/politics-systematic-units-runtime').curriculumVersion, inherited.curriculumVersion);
assert.equal(receipt.userSampling, 'pending');
assert.equal(receipt.releaseAuthorized, false);
assert.equal(receipt.width320RequiredForAcceptance, false);
assert.equal(receipt.realDeviceRequiredForAcceptance, false);
console.log(JSON.stringify({ok:true,independentRoles:2,sections:6,changedSteps:5,remainingBlockingFindings:0,optionalFindings:2,runtimeScreens:6,screenshots:12,saveResume:true,progressUnchanged:true,systematicLessonsUnchanged:77,negativeCases}));
