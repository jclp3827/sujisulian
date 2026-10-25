#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p4';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p3-20261023.json',
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
  sections: lesson.sections.map(part => ({ label: part.label, text: part.text })),
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
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P4 must start from P3 or its own candidate');
  assert.equal(predecessor.status, 'candidate-integrated-runtime-and-user-accepted');

  const lessonIdsBefore = source.lessons.map(lesson => lesson.id);
  const lessons = {
    'DEV-01': source.lessons.find(item => item.id === 'DEV-01'),
    'TEN-03': source.lessons.find(item => item.id === 'TEN-03'),
    'HISTORY-04': source.lessons.find(item => item.id === 'HISTORY-04'),
    'BASICS-01': source.lessons.find(item => item.id === 'BASICS-01'),
    'UNITYFOREIGN-01': source.lessons.find(item => item.id === 'UNITYFOREIGN-01'),
  };
  assert.ok(Object.values(lessons).every(Boolean), 'missing P4 lesson');
  const priorBefore = priorEvidence?.before;
  const before = Object.fromEntries(Object.entries(lessons)
    .map(([id, lesson]) => [id, priorBefore?.[id] || snapshot(lesson)]));

  Object.assign(lessons['DEV-01'], {
    question: '新发展阶段和高质量发展分别说明什么？',
    scopeLimit: '学习重点：新发展阶段和高质量发展分别说明什么。不展开新发展理念的具体内容。',
  });
  lessons['DEV-01'].sections[0].label = '高质量发展是发展主题';
  lessons['DEV-01'].boundary = {
    label: '新发展阶段仍属于社会主义初级阶段',
    text: '新发展阶段仍是我国社会主义初级阶段历史进程中的一个重要阶段；我国仍处于并将长期处于社会主义初级阶段的基本国情没有变。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b007',
      'block:politics-toc-v2-u001:b012',
    ],
    emphasis: [],
  };
  lessons['DEV-01'].recap = {
    label: '本节结论',
    text: '新发展阶段说明我国发展所处的历史方位，高质量发展说明发展主题和质量要求，二者有关联但不能互换。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b002',
      'block:politics-toc-v2-u007:b003',
      'block:politics-toc-v2-u007:b057',
    ],
    emphasis: [],
  };
  lessons['DEV-01'].reflection = {
    prompt: lessons['DEV-01'].question,
    answer: '新发展阶段说明历史方位，高质量发展说明发展主题和质量要求，二者不能互相替代。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b002',
      'block:politics-toc-v2-u007:b003',
      'block:politics-toc-v2-u007:b057',
    ],
  };

  lessons['TEN-03'].scopeLimit = '学习重点：“十个明确”第7条包含哪些经济发展要求。不展开各项要求的制度细节。';
  lessons['TEN-03'].sections[3].text = '高质量发展是我国经济社会发展的主题，强调发展从“有没有”转向“好不好”。第7条同时明确推动高质量发展、统筹发展和安全。';
  lessons['TEN-03'].boundary = {
    label: '国内大循环不是地方自我循环',
    text: '构建新发展格局要以全国统一大市场为基础，不是各地都搞自我小循环。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b017'],
    emphasis: [],
  };
  lessons['TEN-03'].recap.sourceBlockIds = [
    'block:politics-toc-v2-u003:b011',
    'block:politics-toc-v2-u007:b022',
    'block:politics-toc-v2-u007:b057',
    'block:politics-toc-v2-u007:b003',
  ];

  lessons['HISTORY-04'].question = '人民群众的决定作用与杰出人物的作用是什么关系？';
  lessons['HISTORY-04'].objectives = ['理解人民群众决定作用与杰出人物作用的关系'];
  lessons['HISTORY-04'].scopeLimit = '学习重点：人民群众的决定作用与杰出人物的作用是什么关系。不展开详细学派分类。';
  delete lessons['HISTORY-04'].boundary;
  lessons['HISTORY-04'].recap = {
    label: '本节结论',
    text: '人民群众是历史创造的决定力量，并不否认杰出人物的重要作用；杰出人物的作用受社会历史条件和人民群众实践制约。',
    sourceBlockIds: [
      'block:politics-toc-v2-u032:b003',
      'block:politics-toc-v2-u032:b006',
    ],
    emphasis: [],
  };
  lessons['HISTORY-04'].reflection = {
    prompt: lessons['HISTORY-04'].question,
    answer: '人民群众对历史发展起决定作用；杰出人物可以在一定条件下发挥重要作用，但其作用受社会历史条件和人民群众实践制约。',
    sourceBlockIds: [
      'block:politics-toc-v2-u032:b003',
      'block:politics-toc-v2-u032:b006',
    ],
  };
  lessons['HISTORY-04'].corePromises = [
    { quote: '群众史观', sourceBlockIds: ['block:politics-toc-v2-u032:b003'] },
    { quote: '决定作用', sourceBlockIds: ['block:politics-toc-v2-u032:b003'] },
    { quote: '物质财富', sourceBlockIds: ['block:politics-toc-v2-u032:b005'] },
    { quote: '精神财富', sourceBlockIds: ['block:politics-toc-v2-u032:b005'] },
    { quote: '社会变革', sourceBlockIds: ['block:politics-toc-v2-u032:b005'] },
  ];

  lessons['BASICS-01'].question = '马克思主义的三个组成部分、直接理论来源和两大发现分别是什么？';
  lessons['BASICS-01'].objectives = ['理解马克思主义的三个组成部分、直接理论来源和两大发现'];
  lessons['BASICS-01'].scopeLimit = '学习重点：马克思主义的三个组成部分、直接理论来源和两大发现分别是什么。不展开理论特征和学习方法。';
  lessons['BASICS-01'].sections[0] = {
    label: '马克思主义的组成与理论来源',
    text: '马克思主义包括马克思主义哲学、马克思主义政治经济学、科学社会主义；直接理论来源是德国古典哲学、英国古典政治经济学、英法空想社会主义。组成回答理论包括什么，来源回答吸收了哪些思想成果，二者不能互换。',
    sourceBlockIds: [
      'block:politics-toc-v2-u020:b003',
      'block:politics-toc-v2-u020:b004',
      'block:politics-toc-v2-u020:b010',
    ],
    emphasis: [
      { part: 'text', quote: '马克思主义哲学、马克思主义政治经济学、科学社会主义', occurrence: 1, role: 'key' },
      { part: 'text', quote: '德国古典哲学', occurrence: 1, role: 'key' },
    ],
  };
  lessons['BASICS-01'].sections[1] = {
    label: '两大发现与科学社会主义',
    text: '马克思的两大发现是唯物史观和剩余价值学说。唯物史观和剩余价值学说是科学社会主义的理论基础，英法空想社会主义是科学社会主义的思想来源。',
    sourceBlockIds: [
      'block:politics-toc-v2-u020:b005',
      'block:politics-toc-v2-u020:b010',
    ],
    emphasis: [
      { part: 'text', quote: '唯物史观和剩余价值学说', occurrence: 1, role: 'key' },
    ],
  };
  delete lessons['BASICS-01'].boundary;
  lessons['BASICS-01'].recap = {
    label: '本节结论',
    text: '马克思主义的三个组成部分是马克思主义哲学、马克思主义政治经济学和科学社会主义；直接理论来源是德国古典哲学、英国古典政治经济学和英法空想社会主义；两大发现是唯物史观和剩余价值学说。',
    sourceBlockIds: [
      'block:politics-toc-v2-u020:b003',
      'block:politics-toc-v2-u020:b004',
      'block:politics-toc-v2-u020:b005',
    ],
    emphasis: [],
  };
  lessons['BASICS-01'].reflection = {
    prompt: lessons['BASICS-01'].question,
    answer: '三个组成部分是马克思主义哲学、马克思主义政治经济学和科学社会主义；直接理论来源是德国古典哲学、英国古典政治经济学和英法空想社会主义；两大发现是唯物史观和剩余价值学说。',
    sourceBlockIds: [
      'block:politics-toc-v2-u020:b003',
      'block:politics-toc-v2-u020:b004',
      'block:politics-toc-v2-u020:b005',
    ],
  };
  lessons['BASICS-01'].corePromises = [
    { quote: '马克思主义哲学、马克思主义政治经济学、科学社会主义', sourceBlockIds: ['block:politics-toc-v2-u020:b003'] },
    { quote: '德国古典哲学', sourceBlockIds: ['block:politics-toc-v2-u020:b004'] },
    { quote: '唯物史观和剩余价值学说', sourceBlockIds: ['block:politics-toc-v2-u020:b005'] },
  ];

  lessons['UNITYFOREIGN-01'].question = '一国两制的前提、最高原则和管治权关系分别是什么？';
  lessons['UNITYFOREIGN-01'].objectives = ['理解“一国”与“两制”的关系、最高原则和管治权关系'];
  lessons['UNITYFOREIGN-01'].scopeLimit = '学习重点：一国两制的前提、最高原则和管治权关系分别是什么。不补写时事进展。';
  lessons['UNITYFOREIGN-01'].sections[0].label = '“一国”是“两制”的前提和基础';
  lessons['UNITYFOREIGN-01'].sections[1] = {
    label: '最高原则与管治权关系',
    text: '一国两制的最高原则是维护国家主权、安全、发展利益。全面管治权是特别行政区高度自治的前提和基础。',
    sourceBlockIds: [
      'block:politics-toc-v2-u018:b004',
      'block:politics-toc-v2-u018:b007',
    ],
    emphasis: [
      { part: 'text', quote: '国家主权、安全、发展利益', occurrence: 1, role: 'key' },
      { part: 'text', quote: '全面管治权', occurrence: 1, role: 'key' },
    ],
  };
  delete lessons['UNITYFOREIGN-01'].boundary;
  lessons['UNITYFOREIGN-01'].recap = {
    label: '本节结论',
    text: '“一国”是实行“两制”的前提和基础，“两制”从属和派生于“一国”；维护国家主权、安全、发展利益是最高原则，全面管治权是特别行政区高度自治的前提和基础。',
    sourceBlockIds: [
      'block:politics-toc-v2-u018:b003',
      'block:politics-toc-v2-u018:b004',
      'block:politics-toc-v2-u018:b007',
      'block:politics-toc-v2-u018:b015',
    ],
    emphasis: [],
  };
  lessons['UNITYFOREIGN-01'].reflection = {
    prompt: lessons['UNITYFOREIGN-01'].question,
    answer: '“一国”是实行“两制”的前提和基础，“两制”是在“一国”之内的制度安排；维护国家主权、安全、发展利益是最高原则，全面管治权是特别行政区高度自治的前提和基础。',
    sourceBlockIds: [
      'block:politics-toc-v2-u018:b003',
      'block:politics-toc-v2-u018:b004',
      'block:politics-toc-v2-u018:b007',
      'block:politics-toc-v2-u018:b015',
    ],
  };
  lessons['UNITYFOREIGN-01'].corePromises = [
    { quote: '前提和基础', sourceBlockIds: ['block:politics-toc-v2-u018:b003'] },
    { quote: '国家主体实行社会主义制度', sourceBlockIds: ['block:politics-toc-v2-u018:b003'] },
    { quote: '国家主权、安全、发展利益', sourceBlockIds: ['block:politics-toc-v2-u018:b004'] },
    { quote: '全面管治权', sourceBlockIds: ['block:politics-toc-v2-u018:b007'] },
  ];
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
      "  'politics-systematic-user-comprehension-uc7b-p3-20261023.json',",
      "  'politics-systematic-user-comprehension-uc7b-p3-20261023.json',\n  '" + evidenceName + "',",
    );
    fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
  }

  const ai = optional(files.aiReview);
  const probe = optional(files.runtimeProbe);
  const sourceHash = sha256(Buffer.from(sourceText));
  const probeLessonIds = Object.keys(lessons);
  const aiPassed = ai?.curriculumVersion === runtime.curriculumVersion
    && ai?.sourceSha256 === sourceHash
    && ai?.projectionSha256 === digest(files.projection)
    && ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert'].every(roleId =>
      ai.roles?.[roleId]?.status === 'pass'
      && ai.roles[roleId].riskCount === 0
      && ai.roles[roleId].holdCount === 0);
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
    contentChangedLessonIds: probeLessonIds,
    uiProjectionAffectedLessonIds: probeLessonIds,
    probeLessonIds,
    issueIds: [
      'UC7B-P4-BOUNDARY-SEMANTIC-DUPLICATION',
      'UC7B-P4-MAIN-ANSWER-DRIFT',
      'UC7B-P4-SOURCE-BINDING-WIDTH',
    ],
    contractRules: [17, 21, 23, 27, 29, 31, 32, 33, 34],
    diagnosis: {
      staleFrontendOrCache: false,
      staleAuthoredContent: true,
      auditMethod: '按整页语义相似度召回后，由AI首次用户、学科专家和测评专家逐节裁决。',
      removedBoundaryLessonIds: ['HISTORY-04', 'BASICS-01', 'UNITYFOREIGN-01'],
      retainedBoundaryLessonIds: ['DEV-01', 'TEN-03'],
      conclusionCoverageFixedLessonIds: ['DEV-01', 'HISTORY-04', 'BASICS-01', 'UNITYFOREIGN-01'],
    },
    before,
    after: Object.fromEntries(Object.entries(lessons).map(([id, item]) => [id, snapshot(item)])),
    sourcePath: files.source,
    sourceSha256: sourceHash,
    inventoryPath: files.inventory,
    inventorySha256: sha256(Buffer.from(inventoryText)),
    runtimePath: files.runtime,
    runtimeSha256: sha256(Buffer.from(runtimeText)),
    projectionPath: files.projection,
    projectionSha256: digest(files.projection),
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
    changedLessonIds: evidence.contentChangedLessonIds,
    aiReview: evidence.aiReview,
    runtimePageCheck: evidence.runtimePageCheck,
  }));
}

main();
