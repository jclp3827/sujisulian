const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const reviewRoot = evidenceRoot + 'p19-independent-review/';
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const sha = relative => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');
const evidence = read(evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p19-20261024.json');
const source = read(evidence.sourcePath);
const units = require(path.join(root, 'miniprogram/services/knowledge-platform/systematic-units'));
const lineage = require('./lib/politics-systematic-user-comprehension-lineage');
const { latest } = lineage.validateUserComprehensionLineage(root, evidence.batchId);
const packageOnlySuccessor = (latest.batchId.startsWith('politics-systematic-package-sync-quick-') || latest.batchId.startsWith('politics-systematic-package-sync-recall-') || latest.batchId === 'politics-systematic-package-sync-applied-confusion')
  && latest.teachingContentUnchanged === true;
const versionedPaths = new Set(['sourcePath', 'inventoryPath', 'runtimePath', 'sourceRuntimePath']);
for (const [key, value] of Object.entries(evidence)) {
  if (key.endsWith('Path') && !(packageOnlySuccessor && versionedPaths.has(key))) assert.equal(sha(value), evidence[key.slice(0, -4) + 'Sha256'], key + ' changed after review');
}
const strings = value => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
function validateReview(review, input, role, blind) {
  assert.equal(review.curriculumVersion, input.curriculumVersion);
  assert.equal(review.role, role);
  assert.equal(review.independentReviewer, true);
  assert.equal(review.sourceBlind, blind);
  assert.equal(review.reviewedLessonCount, 77);
  assert.equal(review.lessons.length, 77);
  assert.equal(new Set(review.lessons.map(row => row.lessonId)).size, 77);
  assert.deepEqual(review.lessons.map(row => row.lessonId).sort(), input.lessons.map(row => row.id).sort());
  const findings = [];
  for (const row of review.lessons) {
    assert.ok(['pass', 'revise', 'hold'].includes(row.verdict));
    assert.ok(row.observation.trim());
    if (row.verdict === 'pass') assert.equal(row.findings.filter(finding => finding.severity !== 'L3').length, 0);
    for (const finding of row.findings) {
      assert.ok(finding.findingId && finding.field && finding.quote && finding.problem && finding.proposedFix);
      assert.ok(['L1', 'L2', 'L3'].includes(finding.severity));
      assert.ok(strings(input.lessons.find(lesson => lesson.id === row.lessonId)).some(text => text.includes(finding.quote)), 'untraceable finding quote');
      findings.push(finding);
    }
  }
  assert.equal(new Set(findings.map(finding => finding.findingId)).size, findings.length);
  return findings;
}
const roles = [
  ['learner', 'independent-ai-first-learner', true, 12],
  ['expert', 'independent-ai-subject-expert', false, 5],
];
const allFindings = [];
for (const [name, role, blind, count] of roles) {
  const initial = read(reviewRoot + name + '-initial-review.json');
  const final = read(reviewRoot + name + '-r1-review.json');
  const input = read(reviewRoot + name + '-input.json');
  const revised = read(reviewRoot + 'r1-' + name + '-input.json');
  const findings = validateReview(initial, input, role, blind);
  assert.equal(findings.length, count);
  allFindings.push(...findings);
  assert.equal(validateReview(final, revised, role, blind).length, 0);
  assert.ok(final.lessons.every(row => row.verdict === 'pass'));
  assert.deepEqual(final.remainingInitialFindingIds, []);
  assert.deepEqual(final.resolvedInitialFindingIds.slice().sort(), findings.map(finding => finding.findingId).sort());
  assert.deepEqual(final.globalFindings, []);
  assert.equal(revised.curriculumVersion, evidence.curriculumVersion);
  assert.deepEqual(input.lessons.map(lesson => lesson.id), revised.lessons.map(lesson => lesson.id));
  // A missing role, a foreign version, or an unsupported pass must fail closed.
  const wrongRole = structuredClone(final); wrongRole.role = 'author';
  assert.throws(() => validateReview(wrongRole, revised, role, blind));
  const wrongVersion = structuredClone(final); wrongVersion.curriculumVersion = 'stale';
  assert.throws(() => validateReview(wrongVersion, revised, role, blind));
  const falsePass = structuredClone(initial);
  falsePass.lessons.find(row => row.findings.length).verdict = 'pass';
  assert.throws(() => validateReview(falsePass, input, role, blind));
  const missingLesson = structuredClone(final); missingLesson.lessons.pop();
  assert.throws(() => validateReview(missingLesson, revised, role, blind));
}
assert.equal(allFindings.filter(finding => finding.severity === 'L1').length, 2);
assert.equal(allFindings.filter(finding => finding.severity === 'L2').length, 15);
const initial = read(reviewRoot + 'learner-input.json');
const revised = read(reviewRoot + 'r1-learner-input.json');
const changed = revised.lessons.filter(lesson => JSON.stringify(lesson) !== JSON.stringify(initial.lessons.find(old => old.id === lesson.id))).map(lesson => lesson.id);
assert.deepEqual(changed, evidence.changedLessonIds);
assert.equal(changed.length, 15);
assert.equal(revised.lessons.length - changed.length, 62);
assert.deepEqual(source.lessons.map(lesson => lesson.id), evidence.reviewedLessonIds);
const freeze = read(reviewRoot + 'r1-freeze.json');
assert.equal(freeze.sourceSha256, packageOnlySuccessor ? evidence.sourceSha256 : sha(evidence.sourcePath));
assert.equal(freeze.runtimeSha256, packageOnlySuccessor ? evidence.runtimeSha256 : sha(evidence.runtimePath));
assert.equal(freeze.learnerInputSha256, sha(reviewRoot + 'r1-learner-input.json'));
assert.equal(freeze.expertInputSha256, sha(reviewRoot + 'r1-expert-input.json'));
assert.equal(units.curriculum.curriculumVersion, packageOnlySuccessor ? latest.curriculumVersion : evidence.curriculumVersion);
if (packageOnlySuccessor) {
  // The historical AI verdict is reusable only when all teaching and direct sources are identical.
  const expertInput = read(reviewRoot + 'r1-expert-input.json');
  const pkg = require(path.join(root, 'miniprogram/services/knowledge-platform/politics-runtime')).knowledgePackage;
  const blocks = new Map(pkg.knowledgeUnits.flatMap(unit => unit.blocks.map(block => [block.id, block])));
  assert.deepEqual(pkg.sourceReferences, expertInput.sourceReferences);
  for (const lesson of expertInput.lessons) {
    const current = source.lessons.find(item => item.id === lesson.id);
    const parts = [...current.sections, ...(current.boundary ? [current.boundary] : []), current.recap, current.reflection];
    assert.deepEqual(parts.map((part, index) => ({index, label:part.label || '参考答案', text:part.text || part.answer, sourceBlockIds:part.sourceBlockIds})), lesson.sourceParts);
    for (const block of lesson.sourceBlocks) assert.deepEqual(blocks.get(block.id), block);
    const runtimeLesson = units.curriculum.lessons.find(item => item.id === lesson.id);
    assert.deepEqual(runtimeLesson.parts.map(part => units.projectLessonPart(part).runs.filter(run => run.role === "key").map(run => run.text)), lesson.parts.map(part => part.keyClaims));
    assert.equal(units.displayTitleForLessonId(lesson.id), lesson.title);
    assert.equal(runtimeLesson.question, lesson.question);
    assert.equal(runtimeLesson.reflection.answer, lesson.answer);
  }
}
const probe = read(reviewRoot + 'runtime-probe.json');
assert.equal(probe.curriculumVersion, evidence.curriculumVersion);
assert.equal(probe.compileSuccess, true);
assert.deepEqual(probe.compileErrors, []);
assert.deepEqual(probe.wxmlErrors, []);
assert.equal(probe.screens.length, 77);
assert.equal(new Set(probe.screens.map(screen => screen.lessonId)).size, 77);
for (const screen of probe.screens) {
  const lesson = revised.lessons.find(lesson => lesson.id === screen.lessonId);
  assert.ok(lesson);
  assert.equal(screen.screen, 'lesson');
  assert.equal(screen.title, lesson.title);
  assert.equal(screen.question, lesson.question);
  assert.equal(screen.reflection.answer, lesson.answer);
  assert.deepEqual(screen.partLabels, lesson.parts.map(part => part.label));
  assert.deepEqual(screen.partTexts, lesson.parts.map(part => part.text));
  assert.deepEqual(screen.keyRuns, lesson.parts.map(part => part.keyClaims));
  assert.deepEqual(screen.partKinds, lesson.parts.map(part => part.kind));
  assert.equal(screen.partLabels.filter(label => label === '本节结论').length, 1);
}
assert.equal(probe.progressProtection.storageRecordByteEquivalent, true);
assert.equal(probe.progressProtection.beforeSha256, probe.progressProtection.afterSha256);
assert.equal(probe.visuals.length, 30);
for (const id of changed) {
  const pictures = probe.visuals.filter(visual => visual.lessonId === id);
  assert.equal(pictures.length, 2);
  assert.equal(new Set(pictures.map(visual => visual.type)).size, 2);
}
for (const picture of probe.visuals) {
  assert.equal(picture.sha256, sha(picture.path));
  assert.equal(picture.viewportWidth, 390);
  assert.equal(picture.authorVisuallyInspected, true);
}
assert.equal(probe.sourceProbeSha256, sha(probe.sourceProbePath));
const sourceProbe = read(probe.sourceProbePath);
assert.equal(sourceProbe.progressRecordByteEquivalent, true);
assert.equal(sourceProbe.checks.length, 5);
for (const check of sourceProbe.checks) {
  assert.equal(check.version, evidence.curriculumVersion);
  assert.equal(check.screenshotSha256, sha(check.screenshot));
  assert.ok(check.sourceAttribution.some(reference => reference.supplemental));
}
assert.ok(sourceProbe.checks.find(check => check.id === 'MONEY-01').correctionNotice);
assert.equal(evidence.realUserAcceptance, 'pending-for-15-revised-lessons');
assert.equal(evidence.width320Verified, false);
assert.equal(evidence.realDeviceVerified, false);
assert.equal(evidence.releaseAuthorized, false);
console.log(JSON.stringify({ok:true, independentRoles:2, lessons:77, initialFindings:17, resolved:17, changed:15, unchanged:62, frontendScreens:77, visualSheets:30, sourceEntrypoints:5, negativeCases:8, curriculumVersion:evidence.curriculumVersion, currentCurriculumVersion:units.curriculum.curriculumVersion, teachingContentUnchanged:packageOnlySuccessor}));
