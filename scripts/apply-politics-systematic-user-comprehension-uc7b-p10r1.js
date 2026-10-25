#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');
const { buildLessonReviewPaths } = require('./lib/politics-systematic-review-paths');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p10r1';
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
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p10-20261024.json',
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
  assert.equal(predecessor.realUserAcceptance, 'pending');
  const predecessorRuntime = require('../miniprogram/models/politics-systematic-units-runtime');
  assert.equal(predecessor.curriculumVersion, predecessorRuntime.curriculumVersion);
  const lessonIdsBefore = source.lessons.map(item => item.id);
  const contentChangedLessonIds = [
    'BASICS-01', 'BASICS-04', 'CULTUREECO-04', 'DEV-02', 'DEV-06',
    'LEADERSHIP-03', 'MONEY-02', 'REFORMLAW-03', 'SYS-01', 'TEN-02', 'TEN-04',
  ];
  const lessons = Object.fromEntries(contentChangedLessonIds.map(id => [
    id,
    source.lessons.find(item => item.id === id),
  ]));
  assert.ok(Object.values(lessons).every(Boolean), 'missing P10R1 lesson');
  const before = Object.fromEntries(contentChangedLessonIds.map(id => [id, snapshot(lessons[id])]));

  lessons['BASICS-01'].recap.text = '三个组成部分、三类直接理论来源和两大发现分别回答马克思主义的理论结构、思想来源与重要发现。';

  delete lessons['BASICS-04'].boundary;
  lessons['BASICS-04'].recap.text = '物质决定意识不否认意识的能动作用；意识反作用于客观世界必须尊重客观规律并通过实践实现。';

  lessons['CULTUREECO-04'].recap.text = '三组内容分别规定生态转型的时间目标、国土空间开发保护的边界，以及自然保护地体系的层级结构。';

  lessons['DEV-02'].recap.text = '五项理念分别聚焦动力、发展平衡、人与自然和谐、内外联动和公平正义五类问题。';

  lessons['DEV-06'].recap.text = '五类定位依次回答乡村振兴要达到什么目标、遵循什么方针与要求、依靠什么制度保障，以及优先完成什么任务。';

  delete lessons['LEADERSHIP-03'].boundary;

  lessons['MONEY-02'].recap.text = '三种职能分别回答货币如何保存、如何清偿延期支付关系、如何在国际流通中充当一般等价物；三者发挥作用的条件和场景不同。';

  lessons['REFORMLAW-03'].boundary = {
    label: '重点不等于省略其他环节',
    text: '法治政府建设是重点任务和主体工程，不等于法治社会或其他建设环节可以省略。',
    sourceBlockIds: ['block:politics-toc-v2-u013:b017', 'block:politics-toc-v2-u013:b018'],
    emphasis: [],
  };

  lessons['SYS-01'].recap.text = '四组表述分别从主体内容、基本方略、实践总结与理论成果、世界观和方法论四个层面定位新时代思想的科学体系。';

  lessons['TEN-02'].recap.text = '第4—6条依次规定事业总体布局和战略布局、全面深化改革总目标、全面依法治国总目标；两个布局回答事业怎样展开，两个总目标分别回答改革和法治向哪里推进。';

  lessons['TEN-04'].recap.text = '第8—10条分别从国防和军队建设、中国特色大国外交、全面从严治党三个领域补充“十个明确”的主体内容。';

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
      "  'politics-systematic-user-comprehension-uc7b-p10-20261024.json',",
      "  'politics-systematic-user-comprehension-uc7b-p10-20261024.json',\n  '" + evidenceName + "',",
    );
    fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
  }

  const evidence = {
    schemaVersion: 1,
    batchId: batch,
    generatedAt: '2026-10-24',
    status: 'candidate-integrated-region-audit-and-runtime-pending',
    revisionOf: predecessor.batchId,
    previousCurriculumVersion: predecessor.curriculumVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
    stableLessonIds: true,
    orderChanged: false,
    contentChangedLessonIds,
    uiProjectionAffectedLessonIds: source.lessons.map(item => item.id),
    issueIds: ['UC7B-P10R1-REGION-RESPONSIBILITY-CLOSURE', 'UC7B-P10R1-SEMANTIC-DEDUP'],
    contractRules: [32, 34, 38, 42, 43, 44, 45, 46, 47],
    diagnosis: {
      source: 'P10对45个历史改动小节执行区域职责审计后留下11个开放风险。',
      recapDecision: '八个枚举型结论由逐项复述改为职责、维度或检索结构，正式完整答案继续由正文与参考答案承担。',
      boundaryDecision: 'BASICS-04与LEADERSHIP-03辨析没有独立判断增量，予以删除；REFORMLAW-03只保留“重点不等于省略其他环节”这一易错条件。',
      layoutDecision: '包含中文分号的结构性结论继续由投影层拆成稳定视觉段落。',
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
    historicalRegionAudit: 'pending-rebuild',
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
