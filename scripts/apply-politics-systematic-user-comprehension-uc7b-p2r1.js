#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p2r1';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  builder: 'scripts/build-politics-systematic-units.js',
  wxml: 'miniprogram/subpackages/politics/route/units.wxml',
  wxss: 'miniprogram/subpackages/politics/route/units.wxss',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p2-20261023.json',
  evidence: evidenceRoot + batch + '-20261023.json',
  aiReview: evidenceRoot + batch + '-ai-review-20261023.json',
  runtimeProbe: evidenceRoot + batch + '-runtime-probe-20261023.json',
};
const absolute = file => path.join(root, file);
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const optional = file => fs.existsSync(absolute(file)) ? read(file) : null;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const digest = file => sha256(fs.readFileSync(absolute(file)));
const write = (file, value) => fs.writeFileSync(absolute(file), JSON.stringify(value, null, 2) + '\n');
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
  for (const unit of inventory.units) for (const block of unit.sourceBlocks) {
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

function main() {
  const source = read(files.source);
  const inventory = read(files.inventory);
  const predecessor = read(files.predecessor);
  const priorEvidence = optional(files.evidence);
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const previousRuntime = require('../miniprogram/models/politics-systematic-units-runtime');
  assert.ok([predecessor.curriculumVersion, priorEvidence?.curriculumVersion]
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P2R1 must start from P2 or its own candidate');
  assert.equal(predecessor.status, 'candidate-integrated-and-runtime-verified');

  const lessonIdsBefore = source.lessons.map(lesson => lesson.id);
  const contentChangedLessonIds = ['LEADERSHIP-01', 'SYS-05', 'VALUE-02'];
  const lessons = Object.fromEntries(contentChangedLessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
  assert.ok(Object.values(lessons).every(Boolean), 'missing P2R1 lesson');
  const before = Object.fromEntries(contentChangedLessonIds.map(id => [
    id,
    priorEvidence?.before?.[id] || snapshot(lessons[id]),
  ]));
  delete lessons['LEADERSHIP-01'].boundary;

  lessons['SYS-05'].recap.text = '问题导向既是重要实践要求，强调正视和解决实际问题；系统观念既是基本思想和工作方法，强调从普遍联系把握事物；胸怀天下体现中国共产党人的境界格局，强调追求人类进步和解放。';

  Object.assign(lessons['VALUE-02'], {
    question: '具体劳动与抽象劳动有什么区别和联系？',
    objectives: ['理解具体劳动与抽象劳动的区别和联系'],
    scopeLimit: '学习重点：具体劳动与抽象劳动的区别和联系。不进入价值量变化计算。',
  });
  lessons['VALUE-02'].boundary = {
    label: '不能理解为两次劳动',
    text: '具体劳动和抽象劳动不是两次劳动或两种彼此独立的劳动。',
    sourceBlockIds: ['block:politics-toc-v2-u034:b005'],
    emphasis: [],
  };
  lessons['VALUE-02'].recap = {
    label: '本节结论',
    text: '具体劳动与抽象劳动是同一劳动过程的两个方面。具体劳动保留具体形式，生产使用价值；抽象劳动撇开具体形式，其凝结形成价值。',
    sourceBlockIds: [
      'block:politics-toc-v2-u034:b003',
      'block:politics-toc-v2-u034:b004',
      'block:politics-toc-v2-u034:b005',
      'block:politics-toc-v2-u034:b006',
    ],
    emphasis: [],
  };
  lessons['VALUE-02'].reflection.sourceBlockIds = [
    'block:politics-toc-v2-u034:b003',
    'block:politics-toc-v2-u034:b004',
    'block:politics-toc-v2-u034:b005',
    'block:politics-toc-v2-u034:b006',
  ];
  lessons['VALUE-02'].reflection.answer = '二者是商品生产者同一劳动过程中不可分割的两个方面。具体劳动有特定形式，生产使用价值；抽象劳动撇开具体形式，是无差别人类劳动，其凝结形成商品价值。';
  source.progressCompatibleVersions = [...new Set([
    ...(source.progressCompatibleVersions || []), predecessor.curriculumVersion,
  ])];
  assert.deepEqual(source.lessons.map(item => item.id), lessonIdsBefore);

  const used = new Set(source.lessons.flatMap(item => visibleParts(item, true)
    .flatMap(part => part.sourceBlockIds)));
  source.sourceBindings = source.sourceBindings.filter(binding => used.has(binding.blockId));
  updateInventory(inventory, source);
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = JSON.stringify(source, null, 2) + '\n';
  const inventoryText = JSON.stringify(inventory, null, 2) + '\n';
  const runtimeText = '// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ' + JSON.stringify(runtime) + ';\n';
  fs.writeFileSync(absolute(files.source), sourceText);
  fs.writeFileSync(absolute(files.inventory), inventoryText);
  fs.writeFileSync(absolute(files.runtime), runtimeText);
  fs.writeFileSync(absolute(files.reading), renderReading(source));

  let lineage = fs.readFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), 'utf8');
  const evidenceName = batch + '-20261023.json';
  if (!lineage.includes(evidenceName)) {
    lineage = lineage.replace(
      "  'politics-systematic-user-comprehension-uc7b-p2-20261023.json',",
      "  'politics-systematic-user-comprehension-uc7b-p2-20261023.json',\n  '" + evidenceName + "',",
    );
    fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
  }

  const ai = optional(files.aiReview);
  const probe = optional(files.runtimeProbe);
  const sourceHash = sha256(Buffer.from(sourceText));
  const aiPassed = ai?.curriculumVersion === runtime.curriculumVersion
    && ai?.sourceSha256 === sourceHash
    && ai?.projectionSha256 === digest(files.projection)
    && ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert'].every(roleId =>
      ai.roles?.[roleId]?.status === 'pass'
      && ai.roles[roleId].riskCount === 0
      && ai.roles[roleId].holdCount === 0);
  const probeLessonIds = ['LEADERSHIP-01', 'SYS-05', 'VALUE-02'];
  const runtimePassed = probe?.status === 'passed'
    && probe?.curriculumVersion === runtime.curriculumVersion
    && probeLessonIds.every(id => probe.lessonIds?.includes(id));
  const evidence = {
    schemaVersion: 1,
    batchId: batch,
    generatedAt: '2026-10-23',
    status: aiPassed && runtimePassed
      ? 'candidate-integrated-and-runtime-verified'
      : aiPassed ? 'candidate-integrated-ai-passed-runtime-pending'
        : 'candidate-integrated-review-pending',
    previousCurriculumVersion: predecessor.curriculumVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
    stableLessonIds: true,
    orderChanged: false,
    contentChangedLessonIds,
    uiProjectionAffectedLessonIds: source.lessons.map(item => item.id),
    probeLessonIds,
    issueIds: ['UC7B-P2R1-UNSTABLE-CONCLUSION-SEMANTICS', 'UC7B-P2R1-LEADERSHIP-01-DUPLICATE-BOUNDARY'],
    contractRules: [17, 23, 27, 29, 31, 32],
    diagnosis: {
      ruleGap: '左侧强调线此前会在辨析块与结论之间切换，视觉语义未固定。',
      executionDeviation: 'LEADERSHIP-01辨析与结论重复，违反第29条但仍进入P2运行版。',
    },
    before,
    after: Object.fromEntries(contentChangedLessonIds.map(id => [id, snapshot(lessons[id])])),
    conclusionVisualContract: {
      recapAlwaysEmphasized: true,
      boundaryNeverEmphasized: true,
      boundaryPresentation: 'secondary-soft-block',
      affectedLessonCount: source.lessons.length,
    },
    sourcePath: files.source,
    sourceSha256: sourceHash,
    inventoryPath: files.inventory,
    inventorySha256: sha256(Buffer.from(inventoryText)),
    runtimePath: files.runtime,
    runtimeSha256: sha256(Buffer.from(runtimeText)),
    projectionPath: files.projection,
    projectionSha256: digest(files.projection),
    builderPath: files.builder,
    builderSha256: digest(files.builder),
    wxmlPath: files.wxml,
    wxmlSha256: digest(files.wxml),
    wxssPath: files.wxss,
    wxssSha256: digest(files.wxss),
    readingPath: files.reading,
    aiReview: aiPassed ? 'passed' : 'pending',
    aiReviewPath: aiPassed ? files.aiReview : null,
    aiReviewSha256: aiPassed ? digest(files.aiReview) : null,
    runtimePageCheck: runtimePassed ? 'passed' : 'pending',
    runtimeProbePath: runtimePassed ? files.runtimeProbe : null,
    runtimeProbeSha256: runtimePassed ? digest(files.runtimeProbe) : null,
    realUserAcceptance: 'pending',
    retainedHoldLessonIds: ['CAPITAL-02'],
    releaseAuthorized: false,
  };
  write(files.evidence, evidence);
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
