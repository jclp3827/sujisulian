#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');
const { buildLessonReviewPaths } = require('./lib/politics-systematic-review-paths');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p9';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p8-20261024.json',
  evidence: evidenceRoot + batch + '-20261024.json',
  aiReview: evidenceRoot + batch + '-ai-review-20261024.json',
  runtimeProbe: evidenceRoot + batch + '-runtime-probe-20261024.json',
  retrospective: evidenceRoot + 'politics-systematic-user-comprehension-retrospective-audit-20261024.json',
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
  scopeLimit: lesson.scopeLimit,
  sections: lesson.sections.map(part => ({ label: part.label, text: part.text, emphasis: part.emphasis || [] })),
  boundary: lesson.boundary ? { label: lesson.boundary.label, text: lesson.boundary.text } : null,
  recap: { label: lesson.recap.label, text: lesson.recap.text },
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
  const priorEvidence = optional(files.evidence);
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const previousRuntime = require('../miniprogram/models/politics-systematic-units-runtime');
  assert.ok([predecessor.curriculumVersion, priorEvidence?.curriculumVersion]
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P9 must start from accepted P8 or its own candidate');
  assert.equal(predecessor.realUserAcceptance, 'passed');

  const lessonIdsBefore = source.lessons.map(item => item.id);
  const contentChangedLessonIds = ['DEV-02', 'DEV-05', 'DEV-06', 'MOD-02', 'SYS-01'];
  const lessons = Object.fromEntries(contentChangedLessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
  assert.ok(Object.values(lessons).every(Boolean), 'missing P9 lesson');
  const before = Object.fromEntries(contentChangedLessonIds.map(id => [
    id,
    priorEvidence?.before?.[id] || snapshot(lessons[id]),
  ]));

  const ideas = lessons['DEV-02'];
  ideas.question = '创新、协调、绿色、开放、共享分别解决什么发展问题？';
  ideas.objectives = ['说明五项新发展理念分别解决的发展问题'];
  ideas.scopeLimit = '学习重点：创新、协调、绿色、开放、共享分别解决什么发展问题。不展开对应领域的全部政策。';
  ideas.sections = [
    {
      label: '创新理念',
      text: '创新是引领发展的第一动力，解决发展动力问题。',
      sourceBlockIds: ['block:politics-toc-v2-u007:b009'],
      emphasis: [{ part: 'text', quote: '解决发展动力问题', occurrence: 1, role: 'key' }],
    },
    {
      label: '协调理念',
      text: '协调是持续健康发展的内在要求，解决发展不平衡问题。',
      sourceBlockIds: ['block:politics-toc-v2-u007:b010'],
      emphasis: [{ part: 'text', quote: '解决发展不平衡问题', occurrence: 1, role: 'key' }],
    },
    {
      label: '绿色理念',
      text: '绿色是永续发展的必要条件，解决人与自然和谐共生问题。',
      sourceBlockIds: ['block:politics-toc-v2-u007:b011'],
      emphasis: [{ part: 'text', quote: '解决人与自然和谐共生问题', occurrence: 1, role: 'key' }],
    },
    {
      label: '开放理念',
      text: '开放是国家繁荣发展的必由之路，解决发展内外联动问题。',
      sourceBlockIds: ['block:politics-toc-v2-u007:b012'],
      emphasis: [{ part: 'text', quote: '解决发展内外联动问题', occurrence: 1, role: 'key' }],
    },
    {
      label: '共享理念',
      text: '共享是中国特色社会主义的本质要求，解决社会公平正义问题。',
      sourceBlockIds: ['block:politics-toc-v2-u007:b013'],
      emphasis: [{ part: 'text', quote: '解决社会公平正义问题', occurrence: 1, role: 'key' }],
    },
  ];
  delete ideas.boundary;
  ideas.recap = {
    label: '本节结论',
    text: '创新解决发展动力问题，协调解决发展不平衡问题，绿色解决人与自然和谐共生问题，开放解决发展内外联动问题，共享解决社会公平正义问题。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b009', 'block:politics-toc-v2-u007:b010', 'block:politics-toc-v2-u007:b011', 'block:politics-toc-v2-u007:b012', 'block:politics-toc-v2-u007:b013'],
    emphasis: [],
  };
  ideas.reflection = {
    prompt: ideas.question,
    answer: '五项理念的对应关系是：创新解决发展动力问题；协调解决发展不平衡问题；绿色解决人与自然和谐共生问题；开放解决发展内外联动问题；共享解决社会公平正义问题。',
    sourceBlockIds: [...ideas.recap.sourceBlockIds],
  };
  ideas.corePromises = ideas.sections.map(section => ({
    quote: section.emphasis[0].quote,
    sourceBlockIds: [...section.sourceBlockIds],
  }));

  const market = lessons['DEV-05'];
  market.question = '市场作用与政府作用是什么关系？';
  market.objectives = ['说明市场在资源配置中的作用和政府作用的关系'];
  market.scopeLimit = '学习重点：市场作用与政府作用是什么关系。不推导具体行业或政策措施。';
  market.sections = [
    {
      label: '社会主义市场经济体制中的政府与市场',
      text: '社会主义市场经济体制既要发挥市场作用，也要发挥政府作用。处理好政府和市场的关系，是经济体制改革的核心问题。',
      sourceBlockIds: ['block:politics-toc-v2-u007:b022', 'block:politics-toc-v2-u007:b041'],
      emphasis: [{ part: 'text', quote: '处理好政府和市场的关系，是经济体制改革的核心问题', occurrence: 1, role: 'key' }],
    },
    {
      label: '市场在资源配置中的决定性作用',
      text: '市场在资源配置中起决定性作用。“决定性作用”的对象是资源配置。',
      sourceBlockIds: ['block:politics-toc-v2-u007:b041'],
      emphasis: [{ part: 'text', quote: '市场在资源配置中起决定性作用', occurrence: 1, role: 'key' }],
    },
    {
      label: '更好发挥政府作用',
      text: '更好发挥政府作用，要推动有效市场和有为政府更好结合。“看不见的手”和“看得见的手”需要共同发挥作用。',
      sourceBlockIds: ['block:politics-toc-v2-u007:b041', 'block:politics-toc-v2-u007:b042'],
      emphasis: [{ part: 'text', quote: '推动有效市场和有为政府更好结合', occurrence: 1, role: 'key' }],
    },
  ];
  delete market.boundary;
  market.recap = {
    label: '本节结论',
    text: '社会主义市场经济体制既要使市场在资源配置中起决定性作用，又要更好发挥政府作用，推动有效市场和有为政府更好结合。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b022', 'block:politics-toc-v2-u007:b041', 'block:politics-toc-v2-u007:b042'],
    emphasis: [],
  };
  market.reflection = {
    prompt: market.question,
    answer: '市场在资源配置中起决定性作用，同时要更好发挥政府作用，推动有效市场和有为政府更好结合。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b041', 'block:politics-toc-v2-u007:b042'],
  };
  market.corePromises = [
    { quote: '市场在资源配置中起决定性作用', sourceBlockIds: ['block:politics-toc-v2-u007:b041'] },
    { quote: '有效市场和有为政府更好结合', sourceBlockIds: ['block:politics-toc-v2-u007:b041', 'block:politics-toc-v2-u007:b042'] },
  ];

  const rural = lessons['DEV-06'];
  rural.sections[0].label = '乡村振兴的总目标与总方针';
  rural.sections[1].label = '乡村振兴的总要求与制度保障';
  rural.sections[2].label = '乡村振兴的首要任务';
  rural.sections[0].emphasis = [
    { part: 'text', quote: '农业农村现代化是总目标', occurrence: 1, role: 'key' },
    { part: 'text', quote: '坚持农业农村优先发展是总方针', occurrence: 1, role: 'key' },
  ];
  rural.sections[1].emphasis = [
    { part: 'text', quote: '产业兴旺、生态宜居、乡风文明、治理有效、生活富裕', occurrence: 1, role: 'key' },
    { part: 'text', quote: '建立健全城乡融合发展体制机制和政策体系', occurrence: 1, role: 'key' },
  ];
  rural.sections[2].emphasis = [
    { part: 'text', quote: '确保重要农产品特别是粮食供给', occurrence: 1, role: 'key' },
  ];
  delete rural.boundary;
  rural.corePromises = [
    { quote: '农业农村现代化', sourceBlockIds: ['block:politics-toc-v2-u007:b049'] },
    { quote: '农业农村优先发展', sourceBlockIds: ['block:politics-toc-v2-u007:b049'] },
    { quote: '产业兴旺、生态宜居、乡风文明、治理有效、生活富裕', sourceBlockIds: ['block:politics-toc-v2-u007:b049'] },
    { quote: '城乡融合发展体制机制和政策体系', sourceBlockIds: ['block:politics-toc-v2-u007:b049'] },
    { quote: '重要农产品特别是粮食供给', sourceBlockIds: ['block:politics-toc-v2-u007:b050'] },
  ];

  const modernization = lessons['MOD-02'];
  modernization.question = '中国式现代化的五个中国特色分别是什么？';
  modernization.objectives = ['说明中国式现代化的五个中国特色'];
  modernization.scopeLimit = '学习重点：中国式现代化的五个中国特色分别是什么。不展开各领域实施措施。';
  modernization.sections[0].label = '人口规模巨大与共同富裕';
  modernization.sections[0].text = '中国式现代化是人口规模巨大的现代化，也是全体人民共同富裕的现代化。';
  modernization.sections[0].emphasis = [
    { part: 'text', quote: '人口规模巨大的现代化', occurrence: 1, role: 'key' },
    { part: 'text', quote: '全体人民共同富裕的现代化', occurrence: 1, role: 'key' },
  ];
  modernization.sections[1].label = '物质精神协调与人与自然和谐共生';
  modernization.sections[1].text = '中国式现代化是物质文明和精神文明相协调的现代化，也是人与自然和谐共生的现代化。';
  modernization.sections[1].emphasis = [
    { part: 'text', quote: '物质文明和精神文明相协调的现代化', occurrence: 1, role: 'key' },
    { part: 'text', quote: '人与自然和谐共生的现代化', occurrence: 1, role: 'key' },
  ];
  modernization.sections[2].label = '走和平发展道路';
  modernization.sections[2].text = '中国式现代化是走和平发展道路的现代化。';
  modernization.sections[2].sourceBlockIds = ['block:politics-toc-v2-u004:b023'];
  modernization.sections[2].emphasis = [{ part: 'text', quote: '走和平发展道路的现代化', occurrence: 1, role: 'key' }];
  delete modernization.boundary;
  modernization.recap = {
    label: '本节结论',
    text: '中国式现代化是人口规模巨大的现代化、全体人民共同富裕的现代化、物质文明和精神文明相协调的现代化、人与自然和谐共生的现代化、走和平发展道路的现代化。',
    sourceBlockIds: ['block:politics-toc-v2-u004:b019', 'block:politics-toc-v2-u004:b020', 'block:politics-toc-v2-u004:b021', 'block:politics-toc-v2-u004:b022', 'block:politics-toc-v2-u004:b023'],
    emphasis: [],
  };
  modernization.reflection = {
    prompt: modernization.question,
    answer: '五个中国特色分别是人口规模巨大、全体人民共同富裕、物质文明和精神文明相协调、人与自然和谐共生、走和平发展道路。',
    sourceBlockIds: [...modernization.recap.sourceBlockIds],
  };
  modernization.corePromises = [
    { quote: '人口规模巨大', sourceBlockIds: ['block:politics-toc-v2-u004:b019'] },
    { quote: '全体人民共同富裕', sourceBlockIds: ['block:politics-toc-v2-u004:b020'] },
    { quote: '物质文明和精神文明相协调', sourceBlockIds: ['block:politics-toc-v2-u004:b021'] },
    { quote: '人与自然和谐共生', sourceBlockIds: ['block:politics-toc-v2-u004:b022'] },
    { quote: '走和平发展道路', sourceBlockIds: ['block:politics-toc-v2-u004:b023'] },
  ];

  const system = lessons['SYS-01'];
  system.question = '十个明确、十四个坚持、十三个方面成就和六个必须坚持在科学体系中的定位分别是什么？';
  system.objectives = ['说明四组核心表述在科学体系中的定位'];
  system.scopeLimit = '学习重点：十个明确、十四个坚持、十三个方面成就和六个必须坚持在科学体系中的定位分别是什么。不展开十三个方面成就的完整清单。';
  system.sections = [
    {
      label: '十个明确的定位',
      text: '十个明确是这一思想的主体内容，集中体现主要观点和基本精神。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b004'],
      emphasis: [{ part: 'text', quote: '主体内容', occurrence: 1, role: 'key' }],
    },
    {
      label: '十四个坚持的定位',
      text: '十四个坚持是在治国理政各方面作出的理论分析和政策指导，构成基本方略。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b015'],
      emphasis: [{ part: 'text', quote: '基本方略', occurrence: 1, role: 'key' }],
    },
    {
      label: '十三个方面成就的定位',
      text: '十三个方面成就对新时代伟大实践作出科学总结，展示理论与实践成果。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b017'],
      emphasis: [{ part: 'text', quote: '对新时代伟大实践作出科学总结，展示理论与实践成果', occurrence: 1, role: 'key' }],
    },
    {
      label: '六个必须坚持的定位',
      text: '六个必须坚持体现这一思想的世界观、方法论和贯穿其中的立场观点方法。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b018'],
      emphasis: [{ part: 'text', quote: '世界观、方法论和贯穿其中的立场观点方法', occurrence: 1, role: 'key' }],
    },
  ];
  delete system.boundary;
  system.recap = {
    label: '本节结论',
    text: '十个明确是主体内容，十四个坚持构成基本方略，十三个方面成就对新时代伟大实践作出科学总结、展示理论与实践成果，六个必须坚持体现世界观、方法论和贯穿其中的立场观点方法。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b004', 'block:politics-toc-v2-u003:b015', 'block:politics-toc-v2-u003:b017', 'block:politics-toc-v2-u003:b018'],
    emphasis: [],
  };
  system.reflection = {
    prompt: system.question,
    answer: '四组表述的定位分别是：十个明确是主体内容；十四个坚持构成基本方略；十三个方面成就对新时代伟大实践作出科学总结、展示理论与实践成果；六个必须坚持体现世界观、方法论和贯穿其中的立场观点方法。',
    sourceBlockIds: [...system.recap.sourceBlockIds],
  };
  system.corePromises = [
    { quote: '主体内容', sourceBlockIds: ['block:politics-toc-v2-u003:b004'] },
    { quote: '基本方略', sourceBlockIds: ['block:politics-toc-v2-u003:b015'] },
    { quote: '理论与实践成果', sourceBlockIds: ['block:politics-toc-v2-u003:b017'] },
    { quote: '世界观、方法论', sourceBlockIds: ['block:politics-toc-v2-u003:b018'] },
  ];

  source.progressCompatibleVersions = [...new Set([
    ...(source.progressCompatibleVersions || []), predecessor.curriculumVersion,
  ])];
  assert.deepEqual(source.lessons.map(item => item.id), lessonIdsBefore);
  const used = new Set(source.lessons.flatMap(item => visibleParts(item, true).flatMap(part => part.sourceBlockIds)));
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
      "  'politics-systematic-user-comprehension-uc7b-p8-20261024.json',",
      "  'politics-systematic-user-comprehension-uc7b-p8-20261024.json',\n  '" + evidenceName + "',",
    );
    fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
  }

  const ai = optional(files.aiReview);
  const probe = optional(files.runtimeProbe);
  const retrospective = optional(files.retrospective);
  const sourceHash = sha256(Buffer.from(sourceText));
  const aiPassed = ai?.curriculumVersion === runtime.curriculumVersion
    && ai?.sourceSha256 === sourceHash
    && ai?.projectionSha256 === digest(files.projection)
    && ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert'].every(roleId =>
      ai.roles?.[roleId]?.status === 'pass' && ai.roles[roleId].riskCount === 0 && ai.roles[roleId].holdCount === 0);
  const runtimePassed = probe?.status === 'passed'
    && probe?.curriculumVersion === runtime.curriculumVersion
    && contentChangedLessonIds.every(id => probe.lessonIds?.includes(id));
  const retrospectiveBound = retrospective?.curriculumVersion === runtime.curriculumVersion
    && retrospective?.sourceSha256 === sourceHash
    && retrospective?.projectionSha256 === digest(files.projection);
  const evidence = {
    schemaVersion: 1,
    batchId: batch,
    generatedAt: '2026-10-24',
    status: aiPassed && runtimePassed && retrospectiveBound
      ? 'candidate-integrated-and-runtime-verified-retrospective-open'
      : aiPassed && runtimePassed ? 'candidate-integrated-and-runtime-verified'
        : aiPassed ? 'candidate-integrated-ai-passed-runtime-pending'
          : 'candidate-integrated-review-pending',
    previousCurriculumVersion: predecessor.curriculumVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
    stableLessonIds: true,
    orderChanged: false,
    contentChangedLessonIds,
    uiProjectionAffectedLessonIds: contentChangedLessonIds,
    probeLessonIds: contentChangedLessonIds,
    issueIds: ['UC7B-P9-BOUNDARY-COUNTERFACTUAL', 'UC7B-P9-DIRECT-QUESTION-ANSWER', 'UC7B-P9-KEY-POINT-SALIENCE'],
    contractRules: [13, 14, 17, 23, 27, 29, 32, 34, 35, 38, 39, 41, 42, 43],
    reviewPathFormat: '<篇章>-<主题>-<小节>',
    reviewPaths,
    diagnosis: {
      selection: '选取剩余独立辨析队列前五节，处理重复辨析、编排话术、题答错位和评分点重点不足。',
      boundaryDecision: '五节辨析删除后主答案均完整；DEV-06的另一组五项会增加当前任务记忆负担，移出系统学习默认页。',
      conclusionDecision: '五节结论均直接回答当前设问，删除跨节预告和阅读编排话术。',
      emphasisDecision: '定义、关系、正式成员与成立条件均映射到正文可见重点。',
    },
    before,
    after: Object.fromEntries(contentChangedLessonIds.map(id => [id, snapshot(lessons[id])])),
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
    retrospectiveAudit: retrospectiveBound ? 'open' : 'pending',
    retrospectiveAuditPath: retrospectiveBound ? files.retrospective : null,
    retrospectiveAuditSha256: retrospectiveBound ? digest(files.retrospective) : null,
    realUserAcceptance: 'pending',
    retainedHoldLessonIds: ['CAPITAL-02'],
    releaseAuthorized: false,
  };
  write(files.evidence, evidence);
  console.log(JSON.stringify({
    status: evidence.status,
    previousCurriculumVersion: evidence.previousCurriculumVersion,
    curriculumVersion: evidence.curriculumVersion,
    changedLessonIds: contentChangedLessonIds,
    aiReview: evidence.aiReview,
    runtimePageCheck: evidence.runtimePageCheck,
    retrospectiveAudit: evidence.retrospectiveAudit,
  }));
}

main();
