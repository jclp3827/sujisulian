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
  displayProjection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessorEvidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p0-20261023.json',
  seedAudit: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-sample-audit-20261023.json',
  evidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p1-20261023.json',
  aiReview: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p1-ai-review-20261023.json',
  runtimeProbe: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p1-runtime-probe-20261023.json',
};
const absolute = file => path.join(root, file);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
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
  sectionTexts: lesson.sections.map(part => part.text),
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
  let displayProjectionText = fs.readFileSync(absolute(files.displayProjection), 'utf8');
  const predecessor = JSON.parse(fs.readFileSync(absolute(files.predecessorEvidence), 'utf8'));
  const seedAudit = JSON.parse(fs.readFileSync(absolute(files.seedAudit), 'utf8'));
  const existingEvidence = fs.existsSync(absolute(files.evidence))
    ? JSON.parse(fs.readFileSync(absolute(files.evidence), 'utf8')) : null;
  const existingRuntimeProbe = fs.existsSync(absolute(files.runtimeProbe))
    ? JSON.parse(fs.readFileSync(absolute(files.runtimeProbe), 'utf8')) : null;
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const currentRuntime = require('../miniprogram/models/politics-systematic-units-runtime');
  assert.ok([predecessor.curriculumVersion, existingEvidence?.curriculumVersion]
    .filter(Boolean).includes(currentRuntime.curriculumVersion),
  'UC7B P1 must start from P0 or its own candidate');
  assert.equal(seedAudit.status, 'audit-logic-registered');

  const changedLessonIds = ['SYS-02', 'SYS-03', 'SYS-04', 'MOD-03', 'FOUND-01'];
  const lessons = new Map(source.lessons.map(lesson => [lesson.id, lesson]));
  const beforeIds = source.lessons.map(lesson => lesson.id);
  for (const id of changedLessonIds) assert.ok(lessons.has(id), `missing ${id}`);
  const before = existingEvidence?.before || Object.fromEntries(changedLessonIds.map(id => [id, snapshot(lessons.get(id))]));

  const sys02 = lessons.get('SYS-02');
  delete sys02.boundary;

  const sys03 = lessons.get('SYS-03');
  sys03.objectives = ['理解“十四个坚持”第8至14项的内容'];
  sys03.scopeLimit = '学习重点：“十四个坚持”第8至14项的内容。';
  sys03.sections = [
    {
      label: '民生、人与自然与国家安全（第8—10项）',
      text: '第8—10项依次是坚持在发展中保障和改善民生、坚持人与自然和谐共生、坚持总体国家安全观，分别涉及民生、人与自然关系和国家安全。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b016'],
      emphasis: [
        { part: 'text', quote: '坚持在发展中保障和改善民生', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持人与自然和谐共生', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持总体国家安全观', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '人民军队、祖国统一与人类命运共同体（第11—13项）',
      text: '第11—13项依次是坚持党对人民军队的绝对领导、坚持“一国两制”和推进祖国统一、坚持推动构建人类命运共同体，分别涉及人民军队、祖国统一和推动构建人类命运共同体。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b016'],
      emphasis: [
        { part: 'text', quote: '坚持党对人民军队的绝对领导', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持“一国两制”和推进祖国统一', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持推动构建人类命运共同体', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '全面从严治党（第14项）',
      text: '第14项是坚持全面从严治党。它与前十三项共同构成“十四个坚持”，属于新时代坚持和发展中国特色社会主义的基本方略。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b015', 'block:politics-toc-v2-u003:b016'],
      emphasis: [{ part: 'text', quote: '坚持全面从严治党', occurrence: 1, role: 'key' }],
    },
  ];
  delete sys03.boundary;
  sys03.recap = {
    label: '本节结论',
    text: '后七项依次涉及民生、人与自然关系、国家安全、人民军队、祖国统一、人类命运共同体和全面从严治党。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b016'], emphasis: [],
  };
  sys03.reflection = {
    prompt: sys03.question,
    answer: '“十四个坚持”第8至14项依次是坚持在发展中保障和改善民生、坚持人与自然和谐共生、坚持总体国家安全观、坚持党对人民军队的绝对领导、坚持“一国两制”和推进祖国统一、坚持推动构建人类命运共同体、坚持全面从严治党。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b016'],
  };

  const sys04 = lessons.get('SYS-04');
  sys04.objectives = ['理解人民至上、自信自立、守正创新的含义'];
  sys04.scopeLimit = '学习重点：六个必须坚持中人民至上、自信自立、守正创新的含义。';
  sys04.sections = [
    {
      label: '六个必须坚持的定位',
      text: '六个必须坚持是这一思想的世界观、方法论和贯穿其中的立场观点方法的重要体现。“十四个坚持”侧重实践方略，“六个必须坚持”侧重世界观和方法论，二者定位不同、不能互换。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b020'],
      emphasis: [
        { part: 'text', quote: '世界观、方法论', occurrence: 1, role: 'key' },
        { part: 'text', quote: '立场观点方法', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '人民至上（第1项）',
      text: '必须坚持人民至上。人民至上是根本价值立场，体现历史唯物主义群众史观。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'],
      emphasis: [{ part: 'text', quote: '根本价值立场', occurrence: 1, role: 'key' }],
    },
    {
      label: '自信自立（第2项）',
      text: '必须坚持自信自立。自信自立是内在精神特质，体现客观规律性和主观能动性的有机结合。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'],
      emphasis: [{ part: 'text', quote: '客观规律性和主观能动性', occurrence: 1, role: 'key' }],
    },
    {
      label: '守正创新（第3项）',
      text: '必须坚持守正创新。守正创新是鲜明理论品格，体现变与不变、继承与发展的内在联系。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'],
      emphasis: [{ part: 'text', quote: '继承与发展', occurrence: 1, role: 'key' }],
    },
  ];
  sys04.boundary = {
    label: '人民至上与以人民为中心的关系',
    text: '“必须坚持人民至上”属于六个必须坚持，体现根本价值立场；“坚持以人民为中心”属于十四个坚持。二者都涉及人民，但正式名称和体系定位不同，不能互换。',
    sourceBlockIds: [
      'block:politics-toc-v2-u003:b016', 'block:politics-toc-v2-u003:b018',
      'block:politics-toc-v2-u003:b019', 'block:politics-toc-v2-u003:b020',
    ], emphasis: [],
  };
  sys04.recap = {
    label: '本节结论',
    text: '人民至上、自信自立和守正创新分别体现根本价值立场、内在精神特质和鲜明理论品格。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'], emphasis: [],
  };
  sys04.reflection = {
    prompt: sys04.question,
    answer: '人民至上强调根本价值立场，自信自立强调内在精神特质，守正创新强调鲜明理论品格。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'],
  };

  const mod03 = lessons.get('MOD-03');
  mod03.objectives = ['理解中国式现代化的九项本质要求和五项重大原则'];
  mod03.scopeLimit = '学习重点：中国式现代化的本质要求、重大原则及二者区别。';
  mod03.sections = [
    {
      label: '中国式现代化的九项本质要求',
      text: '中国式现代化的九项本质要求是：坚持中国共产党领导，坚持中国特色社会主义，实现高质量发展，发展全过程人民民主，丰富人民精神世界，实现全体人民共同富裕，促进人与自然和谐共生，推动构建人类命运共同体，创造人类文明新形态。',
      sourceBlockIds: ['block:politics-toc-v2-u004:b024'],
      emphasis: [
        { part: 'text', quote: '坚持中国共产党领导', occurrence: 1, role: 'key' },
        { part: 'text', quote: '实现高质量发展', occurrence: 1, role: 'key' },
        { part: 'text', quote: '创造人类文明新形态', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '党的领导的重要性',
      text: '党的领导直接关系中国式现代化的根本方向、前途命运和最终成败。',
      sourceBlockIds: ['block:politics-toc-v2-u004:b025'],
      emphasis: [{ part: 'text', quote: '根本方向、前途命运和最终成败', occurrence: 1, role: 'key' }],
    },
    {
      label: '推进中国式现代化的五项重大原则',
      text: '五项重大原则是：坚持和加强党的全面领导，坚持中国特色社会主义道路，坚持以人民为中心的发展思想，坚持深化改革开放，坚持发扬斗争精神。',
      sourceBlockIds: [
        'block:politics-toc-v2-u004:b026', 'block:politics-toc-v2-u004:b027',
        'block:politics-toc-v2-u004:b028', 'block:politics-toc-v2-u004:b029',
        'block:politics-toc-v2-u004:b030', 'block:politics-toc-v2-u004:b031',
      ],
      emphasis: [
        { part: 'text', quote: '坚持和加强党的全面领导', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持以人民为中心的发展思想', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持发扬斗争精神', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '本质要求与重大原则的区别',
      text: '本质要求说明中国式现代化要达到什么、坚持什么，重大原则说明推进中国式现代化必须把握什么。',
      sourceBlockIds: ['block:politics-toc-v2-u004:b024', 'block:politics-toc-v2-u004:b026'], emphasis: [],
    },
  ];
  delete mod03.boundary;
  mod03.recap = {
    label: '本主题小结',
    text: '九项本质要求规定中国式现代化的本质内容，五项重大原则规定推进中国式现代化必须把握的原则。',
    sourceBlockIds: ['block:politics-toc-v2-u004:b024', 'block:politics-toc-v2-u004:b026'], emphasis: [],
  };
  mod03.reflection = {
    prompt: mod03.question,
    answer: '本质要求说明中国式现代化要达到什么、坚持什么；重大原则说明推进中国式现代化必须把握什么。二者内容不同，不能互相替代。',
    sourceBlockIds: ['block:politics-toc-v2-u004:b024', 'block:politics-toc-v2-u004:b026'],
  };

  const found01 = lessons.get('FOUND-01');
  found01.title = '坚持和发展中国特色社会主义与四个自信';
  found01.question = '坚持和发展中国特色社会主义与四个自信是什么关系？';
  found01.objectives = ['理解坚持和发展中国特色社会主义与四个自信的关系'];
  found01.scopeLimit = '学习重点：坚持和发展中国特色社会主义、四个自信及二者关系。';
  found01.sections = [
    {
      label: '坚持和发展中国特色社会主义',
      text: '坚持和发展中国特色社会主义，是改革开放以来我们党全部理论和实践的鲜明主题，也是习近平新时代中国特色社会主义思想的核心要义。',
      sourceBlockIds: ['block:politics-toc-v2-u001:b002'],
      emphasis: [
        { part: 'text', quote: '坚持和发展中国特色社会主义', occurrence: 1, role: 'key' },
        { part: 'text', quote: '核心要义', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '四个自信',
      text: '新时代坚持和发展中国特色社会主义，必须坚定道路自信、理论自信、制度自信、文化自信。文化自信是更基础、更广泛、更深厚的自信。',
      sourceBlockIds: ['block:politics-toc-v2-u001:b004'],
      emphasis: [{ part: 'text', quote: '道路自信、理论自信、制度自信、文化自信', occurrence: 1, role: 'key' }],
    },
    {
      label: '二者的关系',
      text: '坚持和发展中国特色社会主义是核心要义；四个自信是新时代坚持和发展中国特色社会主义必须坚定的道路、理论、制度和文化自信。',
      sourceBlockIds: ['block:politics-toc-v2-u001:b002', 'block:politics-toc-v2-u001:b004'], emphasis: [],
    },
  ];
  delete found01.boundary;
  found01.recap = {
    label: '本节结论',
    text: '坚持和发展中国特色社会主义是核心要义，四个自信是坚持和发展这一主题必须坚定的道路、理论、制度和文化自信。',
    sourceBlockIds: ['block:politics-toc-v2-u001:b002', 'block:politics-toc-v2-u001:b004'], emphasis: [],
  };
  found01.reflection = {
    prompt: found01.question,
    answer: '坚持和发展中国特色社会主义是核心要义；新时代坚持和发展中国特色社会主义，必须坚定道路自信、理论自信、制度自信、文化自信。',
    sourceBlockIds: ['block:politics-toc-v2-u001:b002', 'block:politics-toc-v2-u001:b004'],
  };

  const displayTitles = {
    'FOUND-01': found01.title,
    'SYS-02': sys02.title,
    'SYS-03': sys03.title,
    'SYS-04': sys04.title,
    'MOD-03': mod03.title,
  };
  for (const [lessonId, title] of Object.entries(displayTitles)) {
    const pattern = new RegExp(`('${lessonId}':\\s*)'[^']*'`);
    assert.match(displayProjectionText, pattern, `missing display-title projection for ${lessonId}`);
    displayProjectionText = displayProjectionText.replace(pattern, `$1'${title}'`);
  }

  assert.deepEqual(source.lessons.map(lesson => lesson.id), beforeIds);
  const usedSourceBlockIds = new Set(source.lessons.flatMap(lesson => visibleParts(lesson, true)
    .flatMap(part => part.sourceBlockIds)));
  source.sourceBindings = source.sourceBindings.filter(binding => usedSourceBlockIds.has(binding.blockId));
  source.progressCompatibleVersions = [...new Set([
    ...(source.progressCompatibleVersions || []), predecessor.curriculumVersion,
  ])];
  updateInventory(inventory, source);
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = `${JSON.stringify(source, null, 2)}\n`;
  const inventoryText = `${JSON.stringify(inventory, null, 2)}\n`;
  const runtimeText = `// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ${JSON.stringify(runtime)};\n`;
  const finalSourceSha256 = sha256(Buffer.from(sourceText));
  const aiReview = fs.existsSync(absolute(files.aiReview))
    ? JSON.parse(fs.readFileSync(absolute(files.aiReview), 'utf8')) : null;
  const aiReviewPassed = aiReview?.curriculumVersion === runtime.curriculumVersion
    && aiReview?.sourceSha256 === finalSourceSha256
    && Object.values(aiReview.roles || {}).every(role => role.status === 'pass'
      && role.riskCount === 0 && role.holdCount === 0);
  const runtimePageCheckPassed = existingRuntimeProbe?.status === 'passed'
    && existingRuntimeProbe?.curriculumVersion === runtime.curriculumVersion
    && changedLessonIds.every(id => existingRuntimeProbe.lessonIds?.includes(id));

  fs.writeFileSync(absolute(files.source), sourceText);
  fs.writeFileSync(absolute(files.inventory), inventoryText);
  fs.writeFileSync(absolute(files.runtime), runtimeText);
  fs.writeFileSync(absolute(files.displayProjection), displayProjectionText);
  fs.writeFileSync(absolute(files.reading), renderReading(source));

  const after = Object.fromEntries(changedLessonIds.map(id => [id, snapshot(lessons.get(id))]));
  const evidence = {
    schemaVersion: 1,
    batchId: 'politics-systematic-user-comprehension-uc7b-p1',
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
    changedLessonIds,
    issueIds: [
      'UC7B-REAL-SYS-02-REDUNDANT-BOUNDARY', 'UC7B-SEED-SYS-03', 'UC7B-SEED-SYS-04',
      'UC7B-SEED-MOD-03', 'UC7B-SEED-FOUND-01',
    ],
    contractRules: [21, 22, 23, 24, 25, 26, 27, 28, 29],
    before,
    after,
    optionalBoundaryMechanism: {
      supported: true,
      lessonsWithoutBoundary: changedLessonIds.filter(id => !lessons.get(id).boundary),
      recapEmphasisWhenBoundaryAbsent: true,
      pageClass: 'unit-part-emphasized',
    },
    sourcePath: files.source,
    sourceSha256: finalSourceSha256,
    inventoryPath: files.inventory,
    inventorySha256: sha256(Buffer.from(inventoryText)),
    runtimePath: files.runtime,
    runtimeSha256: sha256(Buffer.from(runtimeText)),
    displayProjectionPath: files.displayProjection,
    displayProjectionSha256: sha256(Buffer.from(displayProjectionText)),
    readingPath: files.reading,
    seedAuditPath: files.seedAudit,
    aiReview: aiReviewPassed ? 'passed' : 'pending',
    aiReviewPath: aiReviewPassed ? files.aiReview : null,
    aiReviewSha256: aiReviewPassed ? sha256(fs.readFileSync(absolute(files.aiReview))) : null,
    runtimePageCheck: runtimePageCheckPassed ? 'passed' : 'pending',
    runtimeProbePath: runtimePageCheckPassed ? files.runtimeProbe : null,
    runtimeProbeSha256: runtimePageCheckPassed
      ? sha256(fs.readFileSync(absolute(files.runtimeProbe))) : null,
    realUserAcceptance: 'pending',
    retainedHoldLessonIds: ['CAPITAL-02'],
    releaseAuthorized: false,
  };
  fs.writeFileSync(absolute(files.evidence), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify({
    status: evidence.status,
    previousCurriculumVersion: evidence.previousCurriculumVersion,
    curriculumVersion: evidence.curriculumVersion,
    changedLessonIds: evidence.changedLessonIds,
    boundaryRemovedFrom: evidence.optionalBoundaryMechanism.lessonsWithoutBoundary,
    aiReview: evidence.aiReview,
    runtimePageCheck: evidence.runtimePageCheck,
  }));
}

main();
