#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  wxml: 'miniprogram/subpackages/politics/route/units.wxml',
  wxss: 'miniprogram/subpackages/politics/route/units.wxss',
  governance: 'docs/knowledge-platform/implementations/politics-systematic-user-comprehension-governance-20261023.md',
  predecessorEvidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p1-20261023.json',
  evidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p1r1-20261023.json',
  aiReview: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p1r1-ai-review-20261023.json',
  runtimeProbe: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p1r1-runtime-probe-20261023.json',
};
const absolute = file => path.join(root, file);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const digest = file => sha256(fs.readFileSync(absolute(file)));
const visibleParts = (lesson, includeReflection = false) => [
  ...lesson.sections,
  ...(lesson.boundary ? [lesson.boundary] : []),
  lesson.recap,
  ...(includeReflection ? [lesson.reflection] : []),
];
const snapshot = lesson => ({
  title: lesson.title,
  question: lesson.question,
  objectives: lesson.objectives,
  sectionLabels: lesson.sections.map(part => part.label),
  boundary: lesson.boundary ? { label: lesson.boundary.label, text: lesson.boundary.text } : null,
  recap: { label: lesson.recap.label, text: lesson.recap.text },
  reflection: { prompt: lesson.reflection.prompt, answer: lesson.reflection.answer },
});

function updateInventory(inventory, source) {
  for (const unit of inventory.units) {
    for (const block of unit.sourceBlocks) {
      block.sampleLessonIds = source.lessons
        .filter(lesson => visibleParts(lesson, true).some(part => part.sourceBlockIds.includes(block.blockId)))
        .map(lesson => lesson.id);
      const inDefault = source.lessons
        .some(lesson => visibleParts(lesson).some(part => part.sourceBlockIds.includes(block.blockId)));
      block.teachingDisposition = inDefault
        ? 'default-reference'
        : block.sampleLessonIds.length ? 'optional-reference' : 'source-only';
    }
  }
}

function main() {
  const source = JSON.parse(fs.readFileSync(absolute(files.source), 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(absolute(files.inventory), 'utf8'));
  const predecessor = JSON.parse(fs.readFileSync(absolute(files.predecessorEvidence), 'utf8'));
  const existingEvidence = fs.existsSync(absolute(files.evidence))
    ? JSON.parse(fs.readFileSync(absolute(files.evidence), 'utf8')) : null;
  const existingProbe = fs.existsSync(absolute(files.runtimeProbe))
    ? JSON.parse(fs.readFileSync(absolute(files.runtimeProbe), 'utf8')) : null;
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const currentRuntime = require('../miniprogram/models/politics-systematic-units-runtime');
  assert.ok([predecessor.curriculumVersion, existingEvidence?.curriculumVersion]
    .filter(Boolean).includes(currentRuntime.curriculumVersion), 'P1R1 must start from P1 or its own candidate');
  assert.equal(predecessor.status, 'candidate-integrated-and-runtime-verified');

  const beforeIds = source.lessons.map(lesson => lesson.id);
  const sys04 = source.lessons.find(lesson => lesson.id === 'SYS-04');
  assert.ok(sys04, 'missing SYS-04');
  const before = predecessor.after['SYS-04'];
  delete sys04.boundary;
  source.progressCompatibleVersions = [...new Set([
    ...(source.progressCompatibleVersions || []), predecessor.curriculumVersion,
  ])];
  assert.deepEqual(source.lessons.map(lesson => lesson.id), beforeIds);

  const usedSourceBlockIds = new Set(source.lessons.flatMap(lesson => visibleParts(lesson, true)
    .flatMap(part => part.sourceBlockIds)));
  source.sourceBindings = source.sourceBindings.filter(binding => usedSourceBlockIds.has(binding.blockId));
  updateInventory(inventory, source);
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = `${JSON.stringify(source, null, 2)}\n`;
  const inventoryText = `${JSON.stringify(inventory, null, 2)}\n`;
  const runtimeText = `// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ${JSON.stringify(runtime)};\n`;

  fs.writeFileSync(absolute(files.source), sourceText);
  fs.writeFileSync(absolute(files.inventory), inventoryText);
  fs.writeFileSync(absolute(files.runtime), runtimeText);
  fs.writeFileSync(absolute(files.reading), renderReading(source));

  const sourceHash = sha256(Buffer.from(sourceText));
  const aiReview = fs.existsSync(absolute(files.aiReview))
    ? JSON.parse(fs.readFileSync(absolute(files.aiReview), 'utf8')) : null;
  const requiredRoles = ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert'];
  const aiReviewPassed = aiReview?.curriculumVersion === runtime.curriculumVersion
    && aiReview?.sourceSha256 === sourceHash
    && requiredRoles.every(roleId => aiReview.roles?.[roleId]?.status === 'pass'
      && aiReview.roles[roleId].riskCount === 0 && aiReview.roles[roleId].holdCount === 0);
  const probeLessonIds = ['SYS-03', 'SYS-04', 'FOUND-01'];
  const runtimePageCheckPassed = existingProbe?.status === 'passed'
    && existingProbe?.curriculumVersion === runtime.curriculumVersion
    && probeLessonIds.every(id => existingProbe.lessonIds?.includes(id));
  const evidence = {
    schemaVersion: 1,
    batchId: 'politics-systematic-user-comprehension-uc7b-p1r1',
    generatedAt: '2026-10-23',
    status: runtimePageCheckPassed
      ? 'candidate-integrated-and-runtime-verified'
      : aiReviewPassed ? 'candidate-integrated-ai-passed-runtime-pending'
        : 'candidate-integrated-ai-runtime-pending',
    previousCurriculumVersion: predecessor.curriculumVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
    stableLessonIds: true,
    orderChanged: false,
    contentChangedLessonIds: ['SYS-04'],
    uiProjectionAffectedLessonIds: source.lessons.map(lesson => lesson.id),
    probeLessonIds,
    issueIds: ['UC7B-P1R1-DUPLICATE-HEADER-TASK', 'UC7B-P1R1-SYS-04-REDUNDANT-BOUNDARY'],
    contractRules: [29, 30],
    before: { 'SYS-04': before },
    after: { 'SYS-04': snapshot(sys04) },
    headerProjection: {
      oldVisibleStructure: ['这次要回答：<核心问题>', '读完能理解：<动作式目标>'],
      newVisibleStructure: ['读完能理解：<陈述式知识结果>'],
      questionRetainedInSelfTest: true,
      outcomeActionPrefixesRemoved: ['完整说出', '理解', '认识', '分清', '区分', '说清', '建立', '保留'],
    },
    optionalBoundaryMechanism: {
      removedFromLessonIds: ['SYS-04'],
      recapEmphasisWhenBoundaryAbsent: true,
      pageClass: 'unit-part-emphasized',
    },
    sourcePath: files.source,
    sourceSha256: sourceHash,
    inventoryPath: files.inventory,
    inventorySha256: sha256(Buffer.from(inventoryText)),
    runtimePath: files.runtime,
    runtimeSha256: sha256(Buffer.from(runtimeText)),
    projectionPath: files.projection,
    projectionSha256: digest(files.projection),
    wxmlPath: files.wxml,
    wxmlSha256: digest(files.wxml),
    wxssPath: files.wxss,
    wxssSha256: digest(files.wxss),
    governancePath: files.governance,
    governanceSha256: digest(files.governance),
    readingPath: files.reading,
    aiReview: aiReviewPassed ? 'passed' : 'pending',
    aiReviewPath: aiReviewPassed ? files.aiReview : null,
    aiReviewSha256: aiReviewPassed ? digest(files.aiReview) : null,
    runtimePageCheck: runtimePageCheckPassed ? 'passed' : 'pending',
    runtimeProbePath: runtimePageCheckPassed ? files.runtimeProbe : null,
    runtimeProbeSha256: runtimePageCheckPassed ? digest(files.runtimeProbe) : null,
    realUserAcceptance: 'pending',
    retainedHoldLessonIds: ['CAPITAL-02'],
    releaseAuthorized: false,
  };
  fs.writeFileSync(absolute(files.evidence), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify({
    status: evidence.status,
    previousCurriculumVersion: evidence.previousCurriculumVersion,
    curriculumVersion: evidence.curriculumVersion,
    contentChangedLessonIds: evidence.contentChangedLessonIds,
    uiProjectionAffectedCount: evidence.uiProjectionAffectedLessonIds.length,
    aiReview: evidence.aiReview,
    runtimePageCheck: evidence.runtimePageCheck,
  }));
}

main();
