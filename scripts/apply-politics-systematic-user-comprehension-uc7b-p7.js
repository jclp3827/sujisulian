#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p7';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p6r1-20261024.json',
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
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P7 must start from accepted P6R1 or its own candidate');
  assert.equal(predecessor.realUserAcceptance, 'passed');

  const lessonIdsBefore = source.lessons.map(item => item.id);
  const contentChangedLessonIds = ['VALUE-03', 'DEV-03', 'DEV-07', 'LIVELIHOOD-02', 'SUPPORT-02'];
  const lessons = Object.fromEntries(contentChangedLessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
  assert.ok(Object.values(lessons).every(Boolean), 'missing P7 lesson');
  const before = Object.fromEntries(contentChangedLessonIds.map(id => [
    id,
    priorEvidence?.before?.[id] || snapshot(lessons[id]),
  ]));

  const value = lessons['VALUE-03'];
  value.question = '商品价值量由什么决定，劳动生产率怎样影响单位商品价值量？';
  value.objectives = ['说明商品价值量及其决定因素', '理解劳动生产率与单位商品价值量的关系'];
  value.scopeLimit = '学习重点：商品价值量由什么决定，劳动生产率怎样影响单位商品价值量。不做数值计算，也不展开货币与剩余价值。';
  value.sections[0] = {
    label: '商品价值量及其决定因素',
    text: '商品价值量是商品价值的大小。决定商品价值量的不是生产商品的个别劳动时间，而是社会必要劳动时间。',
    sourceBlockIds: ['block:politics-toc-v2-u035:b003', 'block:politics-toc-v2-u035:b004'],
    emphasis: [
      { part: 'text', quote: '决定商品价值量的不是生产商品的个别劳动时间，而是社会必要劳动时间', occurrence: 1, role: 'key' },
    ],
  };
  value.sections[1].label = '社会必要劳动时间的含义';
  value.sections[1].emphasis = [
    { part: 'text', quote: '现有社会正常生产条件', occurrence: 1, role: 'key' },
    { part: 'text', quote: '社会平均劳动熟练程度和劳动强度', occurrence: 1, role: 'key' },
  ];
  value.sections[2].emphasis = [
    { part: 'text', quote: '单位商品价值量', occurrence: 1, role: 'key' },
    { part: 'text', quote: '社会必要劳动时间成正比', occurrence: 1, role: 'key' },
    { part: 'text', quote: '社会劳动生产率成反比', occurrence: 1, role: 'key' },
  ];
  value.sections = value.sections.slice(0, 3);
  delete value.boundary;
  value.recap = {
    label: '本节结论',
    text: '商品价值量由社会必要劳动时间决定。单位商品价值量与社会必要劳动时间成正比，与生产该商品的社会劳动生产率成反比；个别生产者实际耗时不能直接决定商品价值量。',
    sourceBlockIds: ['block:politics-toc-v2-u035:b004', 'block:politics-toc-v2-u035:b007', 'block:politics-toc-v2-u035:b012'],
    emphasis: [],
  };
  value.reflection = {
    prompt: value.question,
    answer: '商品价值量由社会必要劳动时间决定；单位商品价值量与社会必要劳动时间成正比，与生产该商品的社会劳动生产率成反比。个别生产者实际耗时不能直接决定商品价值量。',
    sourceBlockIds: [...value.recap.sourceBlockIds],
  };

  const pattern = lessons['DEV-03'];
  pattern.sections[0].text = '新发展格局以国内大循环为主体、国内国际双循环相互促进。国内大循环为主体，不是各地都搞自我小循环。';
  pattern.sections[0].sourceBlockIds = [
    'block:politics-toc-v2-u007:b015',
    'block:politics-toc-v2-u007:b017',
  ];
  pattern.sections[0].emphasis = [
    { part: 'text', quote: '国内大循环为主体', occurrence: 1, role: 'key' },
    { part: 'text', quote: '相互促进', occurrence: 1, role: 'key' },
    { part: 'text', quote: '不是各地都搞自我小循环', occurrence: 1, role: 'key' },
  ];
  pattern.sections[1].emphasis = [
    { part: 'text', quote: '全国统一大市场是构建新发展格局的基础支撑和内在要求', occurrence: 1, role: 'key' },
    { part: 'text', quote: '关键在于经济循环畅通无阻', occurrence: 1, role: 'key' },
  ];
  pattern.sections[2].emphasis = [
    { part: 'text', quote: '把握发展主动权的先手棋', occurrence: 1, role: 'key' },
    { part: 'text', quote: '最本质特征是实现高水平的自立自强', occurrence: 1, role: 'key' },
  ];
  delete pattern.boundary;
  pattern.recap.text = '新发展格局以国内大循环为主体、国内国际双循环相互促进，不是各地搞自我小循环；构建时以全国统一大市场为基础支撑和内在要求，关键在畅通经济循环，最本质特征是实现高水平自立自强。';
  pattern.recap.sourceBlockIds = ['block:politics-toc-v2-u007:b015', 'block:politics-toc-v2-u007:b017', 'block:politics-toc-v2-u007:b018', 'block:politics-toc-v2-u007:b019', 'block:politics-toc-v2-u007:b020'];
  pattern.reflection.answer = '新发展格局以国内大循环为主体、国内国际双循环相互促进，不能理解为各地自我小循环；全国统一大市场是基础支撑和内在要求，关键在于经济循环畅通无阻，最本质特征是实现高水平自立自强。';
  pattern.reflection.sourceBlockIds = [...pattern.recap.sourceBlockIds];

  const region = lessons['DEV-07'];
  region.question = '区域协调发展战略、区域重大战略、主体功能区战略和新型城镇化分别关注什么？';
  region.objectives = ['区分四类区域发展安排的对象与重点'];
  region.scopeLimit = '学习重点：区域协调发展战略、区域重大战略、主体功能区战略和新型城镇化分别关注什么。不推演具体区域政策。';
  region.sections[0].text = '区域协调发展战略面向西部、东北、中部和东部四大板块，分别推动西部大开发形成新格局、东北全面振兴取得新突破、中部地区加快崛起、东部地区加快推进现代化。';
  region.sections[0].emphasis = [
    { part: 'text', quote: '面向西部、东北、中部和东部四大板块', occurrence: 1, role: 'key' },
  ];
  region.sections[1].text = '区域重大战略面向重点区域，包括京津冀协同发展、长江经济带发展、粤港澳大湾区建设、长三角一体化发展、黄河流域生态保护和高质量发展；同时高标准、高质量建设雄安新区，推动成渝地区双城经济圈建设。';
  region.sections[1].emphasis = [
    { part: 'text', quote: '区域重大战略面向重点区域', occurrence: 1, role: 'key' },
  ];
  region.sections[2] = {
    label: '主体功能区战略',
    text: '主体功能区战略逐步形成城市化地区、农产品主产区、生态功能区三大空间格局，关注不同区域承担的空间功能。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b055'],
    emphasis: [
      { part: 'text', quote: '城市化地区、农产品主产区、生态功能区三大空间格局', occurrence: 1, role: 'key' },
    ],
  };
  region.sections[3] = {
    label: '新型城镇化',
    text: '新型城镇化以人为核心，把推进农业转移人口市民化作为首要任务，并推进以县城为重要载体的城镇化建设。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b056'],
    emphasis: [
      { part: 'text', quote: '以人为核心', occurrence: 1, role: 'key' },
      { part: 'text', quote: '把推进农业转移人口市民化作为首要任务', occurrence: 1, role: 'key' },
    ],
  };
  delete region.boundary;
  region.recap = {
    label: '本节结论',
    text: '区域协调发展战略面向东中西部和东北四大板块，区域重大战略面向重点区域，主体功能区战略划分三类空间格局；新型城镇化以人为核心，把农业转移人口市民化作为首要任务。四者对象和作用层次不同。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b053', 'block:politics-toc-v2-u007:b054', 'block:politics-toc-v2-u007:b055', 'block:politics-toc-v2-u007:b056'],
    emphasis: [],
  };
  region.reflection = {
    prompt: region.question,
    answer: '区域协调发展战略面向东中西部和东北四大板块；区域重大战略面向重点区域；主体功能区战略划分城市化地区、农产品主产区、生态功能区三类空间；新型城镇化以人为核心，把农业转移人口市民化作为首要任务。',
    sourceBlockIds: [...region.recap.sourceBlockIds],
  };

  const livelihood = lessons['LIVELIHOOD-02'];
  livelihood.question = '社会保障体系和健康中国建设的主要内容分别是什么？';
  livelihood.objectives = ['说明社会保障体系和健康中国建设的主要内容'];
  livelihood.scopeLimit = '学习重点：社会保障体系和健康中国建设的主要内容分别是什么。不展开具体政策措施。';
  livelihood.sections[0].label = '社会保障体系';
  livelihood.sections[0].emphasis = [
    { part: 'text', quote: '人民生活的安全网和社会运行的稳定器', occurrence: 1, role: 'key' },
    { part: 'text', quote: '社会保险、社会福利、社会救济、社会优抚与安置', occurrence: 1, role: 'key' },
  ];
  livelihood.sections[1].label = '健康中国建设';
  livelihood.sections[1].emphasis = [
    { part: 'text', quote: '人民健康是社会文明进步的基础，也是民族昌盛和国家富强的重要标志', occurrence: 1, role: 'key' },
    { part: 'text', quote: '预防为主', occurrence: 1, role: 'key' },
  ];
  delete livelihood.boundary;
  livelihood.recap = {
    label: '本节结论',
    text: '社会保障体系是人民生活的安全网和社会运行的稳定器，包括社会保险、社会福利、社会救济、社会优抚与安置；健康中国建设把人民健康放在重要位置，坚持预防为主。',
    sourceBlockIds: ['block:politics-toc-v2-u010:b015', 'block:politics-toc-v2-u010:b016', 'block:politics-toc-v2-u010:b022', 'block:politics-toc-v2-u010:b023'],
    emphasis: [],
  };
  livelihood.reflection = {
    prompt: livelihood.question,
    answer: '社会保障体系包括社会保险、社会福利、社会救济、社会优抚与安置，是人民生活的安全网和社会运行的稳定器；健康中国建设强调人民健康的基础地位，坚持预防为主。',
    sourceBlockIds: [...livelihood.recap.sourceBlockIds],
  };
  livelihood.corePromises = [
    { quote: '安全网', sourceBlockIds: ['block:politics-toc-v2-u010:b015'] },
    { quote: '社会保险', sourceBlockIds: ['block:politics-toc-v2-u010:b017'] },
    { quote: '社会福利', sourceBlockIds: ['block:politics-toc-v2-u010:b018'] },
    { quote: '社会救济', sourceBlockIds: ['block:politics-toc-v2-u010:b019'] },
    { quote: '人民健康', sourceBlockIds: ['block:politics-toc-v2-u010:b022'] },
    { quote: '预防为主', sourceBlockIds: ['block:politics-toc-v2-u010:b023'] },
  ];

  const support = lessons['SUPPORT-02'];
  support.question = '基础研究、应用研究和人才评价分别发挥什么作用？';
  support.objectives = ['说明基础研究、应用研究和人才评价各自的作用'];
  support.scopeLimit = '学习重点：基础研究、应用研究和人才评价分别发挥什么作用。不展开具体政策细目。';
  support.sections[0] = {
    label: '基础研究与应用研究的作用',
    text: '基础研究是科技创新的源头，应用研究是基础研究转化为实际应用的桥梁。二者位于创新过程的不同环节，分别承担源头支撑和应用转化作用。',
    sourceBlockIds: ['block:politics-toc-v2-u015:b016'],
    emphasis: [
    { part: 'text', quote: '基础研究是科技创新的源头', occurrence: 1, role: 'key' },
      { part: 'text', quote: '应用研究是基础研究转化为实际应用的桥梁', occurrence: 1, role: 'key' },
    ],
  };
  support.sections[1] = {
    label: '人才评价标准',
    text: '人才评价要破除唯论文、唯职称、唯学历、唯奖项，建立以创新能力、质量、贡献为导向的评价体系，不能只换成另一个单项指标。',
    sourceBlockIds: ['block:politics-toc-v2-u015:b023'],
    emphasis: [
      { part: 'text', quote: '破除唯论文、唯职称、唯学历、唯奖项', occurrence: 1, role: 'key' },
      { part: 'text', quote: '以创新能力、质量、贡献为导向', occurrence: 1, role: 'key' },
    ],
  };
  delete support.boundary;
  support.recap = {
    label: '本节结论',
    text: '基础研究是科技创新的源头，应用研究是基础研究转化为实际应用的桥梁；人才评价要破除“四唯”，建立以创新能力、质量、贡献为导向的评价体系。',
    sourceBlockIds: ['block:politics-toc-v2-u015:b016', 'block:politics-toc-v2-u015:b023'],
    emphasis: [],
  };
  support.reflection = {
    prompt: support.question,
    answer: '基础研究是科技创新的源头，应用研究是转化为实际应用的桥梁；人才评价要破除“四唯”，建立以创新能力、质量、贡献为导向的体系。',
    sourceBlockIds: ['block:politics-toc-v2-u015:b016', 'block:politics-toc-v2-u015:b023'],
  };
  support.corePromises = [
    { quote: '基础研究是科技创新的源头', sourceBlockIds: ['block:politics-toc-v2-u015:b016'] },
    { quote: '应用研究是基础研究转化为实际应用的桥梁', sourceBlockIds: ['block:politics-toc-v2-u015:b016'] },
    { quote: '创新能力、质量、贡献', sourceBlockIds: ['block:politics-toc-v2-u015:b023'] },
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

  let lineage = fs.readFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), 'utf8');
  const evidenceName = batch + '-20261024.json';
  if (!lineage.includes(evidenceName)) {
    lineage = lineage.replace(
      "  'politics-systematic-user-comprehension-uc7b-p6r1-20261024.json',",
      "  'politics-systematic-user-comprehension-uc7b-p6r1-20261024.json',\n  '" + evidenceName + "',",
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
    issueIds: ['UC7B-P7-BOUNDARY-FUSION', 'UC7B-P7-THEME-END-CONCLUSION', 'UC7B-P7-KEY-POINT-SALIENCE'],
    contractRules: [13, 14, 17, 23, 27, 29, 32, 34, 35, 38, 39, 41, 42],
    diagnosis: {
      selection: '选取同时命中历史改动、现存辨析或主题结尾、重点映射不足的五节作为首批回审。',
      boundaryDecision: '五节独立辨析均可由核心正文直接承载，删除后主答案不缺失，故全部融合或删除。',
      conclusionDecision: '三个主题末节结论改为直接回答当前设问，不再承担跨节编排总结。',
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
