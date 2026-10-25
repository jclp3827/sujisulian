#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');
const { buildLessonReviewPaths } = require('./lib/politics-systematic-review-paths');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p10';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  wxml: 'miniprogram/subpackages/politics/route/units.wxml',
  wxss: 'miniprogram/subpackages/politics/route/units.wxss',
  governance: 'docs/knowledge-platform/implementations/politics-systematic-user-comprehension-governance-20261023.md',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p9-20261024.json',
  evidence: evidenceRoot + batch + '-20261024.json',
};
const absolute = file => path.join(root, file);
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
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
  sections: lesson.sections.map(part => ({
    label: part.label,
    text: part.text,
    sourceBlockIds: part.sourceBlockIds,
    emphasis: part.emphasis || [],
  })),
  boundary: lesson.boundary ? {
    label: lesson.boundary.label,
    text: lesson.boundary.text,
    sourceBlockIds: lesson.boundary.sourceBlockIds,
  } : null,
  recap: { label: lesson.recap.label, text: lesson.recap.text, sourceBlockIds: lesson.recap.sourceBlockIds },
  reflection: { prompt: lesson.reflection.prompt, answer: lesson.reflection.answer },
});

function updateInventory(inventory, source) {
  for (const unit of inventory.units) {
    unit.defaultReferencingLessonIds = source.lessons
      .filter(lesson => lesson.sections.some(part =>
        part.sourceBlockIds.some(blockId => blockId.split(':')[1] === unit.unitId)))
      .map(lesson => lesson.id);
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
  const source = read(files.source);
  const inventory = read(files.inventory);
  const predecessor = read(files.predecessor);
  assert.equal(predecessor.realUserAcceptance, 'passed');
  assert.equal(digest(predecessor.userAcceptancePath), predecessor.userAcceptanceSha256);
  const lessonIdsBefore = source.lessons.map(item => item.id);
  const contentChangedLessonIds = ['TEN-01', 'MOD-02'];
  const lessons = Object.fromEntries(contentChangedLessonIds.map(id => [
    id,
    source.lessons.find(item => item.id === id),
  ]));
  assert.ok(Object.values(lessons).every(Boolean), 'missing P10 lesson');
  const before = Object.fromEntries(contentChangedLessonIds.map(id => [id, snapshot(lessons[id])]));

  const ten = lessons['TEN-01'];
  ten.sections[2].text = '第三条明确，新时代我国社会主要矛盾是人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾，同时提出坚持以人民为中心、发展全过程人民民主、推动人的全面发展和共同富裕。';
  ten.sections[2].sourceBlockIds = ['block:politics-toc-v2-u003:b007'];
  ten.sections[2].emphasis = ten.sections[2].emphasis
    .filter(item => item.quote !== '仍处于并将长期处于社会主义初级阶段');
  ten.boundary = {
    label: '主要矛盾变化不改变基本国情',
    text: '新时代社会主要矛盾发生变化，但我国仍处于并将长期处于社会主义初级阶段的基本国情没有变。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b007', 'block:politics-toc-v2-u001:b012'],
    emphasis: [],
  };
  ten.recap = {
    label: '本节结论',
    text: '第1—3条依次明确党的领导地位、社会主义现代化和民族复兴的总任务，以及新时代社会主要矛盾和以人民为中心的要求。',
    sourceBlockIds: [
      'block:politics-toc-v2-u003:b005',
      'block:politics-toc-v2-u003:b006',
      'block:politics-toc-v2-u003:b007',
    ],
    emphasis: [],
  };

  const modern = lessons['MOD-02'];
  modern.recap = {
    label: '本节结论',
    text: '五个中国特色从人口规模、共同富裕、物质文明和精神文明协调、人与自然关系、发展道路五个方面说明中国式现代化的鲜明特征。',
    sourceBlockIds: [
      'block:politics-toc-v2-u004:b019',
      'block:politics-toc-v2-u004:b020',
      'block:politics-toc-v2-u004:b021',
      'block:politics-toc-v2-u004:b022',
      'block:politics-toc-v2-u004:b023',
    ],
    emphasis: [],
  };

  source.progressCompatibleVersions = [...new Set([
    ...(source.progressCompatibleVersions || []),
    predecessor.curriculumVersion,
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

  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  delete require.cache[require.resolve('../miniprogram/services/knowledge-platform/systematic-units')];
  const projection = require('../miniprogram/services/knowledge-platform/systematic-units');
  const allReviewPaths = buildLessonReviewPaths(source, projection.displayTitleForLessonId);
  const reviewPaths = Object.fromEntries(contentChangedLessonIds.map(id => [id, allReviewPaths[id]]));

  let lineage = fs.readFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), 'utf8');
  const evidenceName = batch + '-20261024.json';
  if (!lineage.includes(evidenceName)) {
    lineage = lineage.replace(
      "  'politics-systematic-user-comprehension-uc7b-p9-20261024.json',",
      "  'politics-systematic-user-comprehension-uc7b-p9-20261024.json',\n  '" + evidenceName + "',",
    );
    fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
  }

  const evidence = {
    schemaVersion: 1,
    batchId: batch,
    generatedAt: '2026-10-24',
    status: 'candidate-integrated-review-and-runtime-pending',
    previousCurriculumVersion: predecessor.curriculumVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
    stableLessonIds: true,
    orderChanged: false,
    contentChangedLessonIds,
    uiProjectionAffectedLessonIds: source.lessons.map(item => item.id),
    issueIds: ['UC7B-P10-REGION-RESPONSIBILITY', 'UC7B-P10-SEMANTIC-DEDUP', 'UC7B-P10-SEMICOLON-PARAGRAPHS'],
    contractRules: [32, 34, 38, 42, 43, 44, 45, 46, 47],
    diagnosis: {
      ruleConflict: '旧第32条要求结论独立承载完整答案，与第34条整页语义去重在枚举题上发生冲突。',
      executionDrift: 'TEN-01把基本国情限定融合进正文后又写入结论；TEN-01与MOD-02的结论均重新串接正文。',
      boundaryDecision: 'TEN-01的基本国情限定会直接防止误判，恢复为只出现一次的次级辨析；MOD-02没有需要独立保留的误解条件。',
      conclusionDecision: '两页结论改为结构性概括，完整正式答案继续由正文与参考答案承担。',
      layoutDecision: '投影层把结论中的中文分号拆为独立视觉段落，语义去重仍单独审核。',
    },
    before,
    after: Object.fromEntries(contentChangedLessonIds.map(id => [id, snapshot(lessons[id])])),
    reviewPathFormat: '<篇章>-<主题>-<小节>',
    reviewPaths,
    sourcePath: files.source,
    sourceSha256: sha256(Buffer.from(sourceText)),
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
    historicalRegionAudit: 'pending',
    aiReview: 'pending',
    runtimePageCheck: 'pending',
    realUserAcceptance: 'pending',
    retainedHoldLessonIds: ['CAPITAL-02'],
    releaseAuthorized: false,
  };
  write(files.evidence, evidence);
  console.log(JSON.stringify({
    status: evidence.status,
    previousCurriculumVersion: evidence.previousCurriculumVersion,
    curriculumVersion: evidence.curriculumVersion,
    contentChangedLessonIds,
    reviewPaths: Object.values(reviewPaths).map(item => item.displayPath),
  }));
}

main();
