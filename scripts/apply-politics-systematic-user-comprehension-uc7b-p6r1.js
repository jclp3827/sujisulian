#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p6r1';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p6-20261024.json',
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
  sections: lesson.sections.map(part => ({
    label: part.label,
    text: part.text,
    emphasis: part.emphasis || [],
  })),
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
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P6R1 must start from P6 or its own candidate');
  assert.equal(predecessor.status, 'candidate-integrated-and-runtime-verified');

  const lessonIdsBefore = source.lessons.map(item => item.id);
  const contentChangedLessonIds = ['VALUE-01', 'FOUND-03', 'TEN-01', 'TEN-02', 'TEN-03', 'TEN-04'];
  const uiProjectionAffectedLessonIds = [
    'VALUE-01', 'FOUND-03', 'TEN-01', 'TEN-02', 'TEN-03', 'TEN-04',
  ];
  const lessons = Object.fromEntries(contentChangedLessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
  assert.ok(Object.values(lessons).every(Boolean), 'missing P6R1 lesson');
  const before = Object.fromEntries(contentChangedLessonIds.map(id => [
    id,
    priorEvidence?.before?.[id] || snapshot(lessons[id]),
  ]));

  const commodity = lessons['VALUE-01'];
  commodity.objectives = ['理解商品、使用价值与价值的含义', '说明使用价值与价值的统一和矛盾关系'];
  commodity.sections[3] = {
    label: '使用价值与价值的关系',
    text: '商品同时具有使用价值和价值，使用价值是价值的物质承担者，价值通过使用价值表现出来。在商品交换中，对同一商品所有者来说，使用价值和价值不可兼得。',
    sourceBlockIds: [
      'block:politics-toc-v2-u033:b012',
      'block:politics-toc-v2-u033:b013',
    ],
    emphasis: [
      { part: 'text', quote: '使用价值是价值的物质承担者', occurrence: 1, role: 'key' },
      { part: 'text', quote: '使用价值和价值不可兼得', occurrence: 1, role: 'key' },
    ],
  };
  delete commodity.boundary;
  commodity.recap = {
    label: '本节结论',
    text: '使用价值和价值是商品的两个因素：商品必须同时具有二者，使用价值是价值的物质承担者；在交换中，对同一商品所有者来说，使用价值和价值不可兼得。',
    sourceBlockIds: [
      'block:politics-toc-v2-u033:b003',
      'block:politics-toc-v2-u033:b012',
      'block:politics-toc-v2-u033:b013',
    ],
    emphasis: [],
  };
  commodity.reflection = {
    prompt: commodity.question,
    answer: '使用价值和价值是商品的两个因素。商品必须同时具有二者，使用价值是价值的物质承担者；在交换中，对同一商品所有者来说，使用价值和价值不可兼得。',
    sourceBlockIds: [...commodity.recap.sourceBlockIds],
  };

  const combines = lessons['FOUND-03'];
  combines.question = '“两个结合”分别是什么？';
  combines.objectives = ['说出“两个结合”的完整内容', '理解两个结合的共同理论基础与不同结合对象'];
  combines.scopeLimit = '学习重点：“两个结合”分别是什么。不展开传统文化条目或理论发展史。';
  combines.sections[1].label = '马克思主义基本原理同中国具体实际相结合（第一个结合）';
  combines.sections[2].label = '马克思主义基本原理同中华优秀传统文化相结合（第二个结合）';
  combines.sections[3].label = '两个结合的判断方法';
  combines.recap = {
    label: '本节结论',
    text: '“两个结合”分别是把马克思主义基本原理同中国具体实际相结合、同中华优秀传统文化相结合。两者具有共同的理论基础，结合对象分别是中国具体实际和中华优秀传统文化。',
    sourceBlockIds: ['block:politics-toc-v2-u002:b002', 'block:politics-toc-v2-u002:b012'],
    emphasis: [],
  };
  combines.reflection = {
    prompt: combines.question,
    answer: '“两个结合”分别是把马克思主义基本原理同中国具体实际相结合、同中华优秀传统文化相结合。',
    sourceBlockIds: ['block:politics-toc-v2-u002:b002'],
  };

  const ten01 = source.lessons.find(item => item.id === 'TEN-01');
  ten01.sections = ten01.sections.filter(section => section.label !== '十个明确的主体内容');
  ten01.sections[0] = {
    label: '党的领导（第一条）',
    text: '第一条明确，中国特色社会主义最本质的特征、中国特色社会主义制度的最大优势是中国共产党领导，中国共产党是最高政治领导力量。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b005'],
    emphasis: [
      { part: 'text', quote: '中国共产党领导', occurrence: 1, role: 'key' },
      { part: 'text', quote: '最高政治领导力量', occurrence: 1, role: 'key' },
    ],
  };
  ten01.sections[1] = {
    label: '总任务（第二条）',
    text: '第二条明确，总任务是实现社会主义现代化和中华民族伟大复兴，并以中国式现代化推进中华民族伟大复兴。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b006'],
    emphasis: [
      { part: 'text', quote: '实现社会主义现代化和中华民族伟大复兴', occurrence: 1, role: 'key' },
      { part: 'text', quote: '以中国式现代化推进中华民族伟大复兴', occurrence: 1, role: 'key' },
    ],
  };
  ten01.sections[2] = {
    label: '社会主要矛盾与人民立场（第三条）',
    text: '第三条明确，新时代我国社会主要矛盾是人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾，同时提出坚持以人民为中心、发展全过程人民民主、推动人的全面发展和共同富裕。社会主要矛盾发生变化，没有改变我国仍处于并将长期处于社会主义初级阶段的基本国情。',
    sourceBlockIds: [
      'block:politics-toc-v2-u003:b007',
      'block:politics-toc-v2-u001:b012',
    ],
    emphasis: [
      { part: 'text', quote: '人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾', occurrence: 1, role: 'key' },
      { part: 'text', quote: '坚持以人民为中心', occurrence: 1, role: 'key' },
      { part: 'text', quote: '仍处于并将长期处于社会主义初级阶段', occurrence: 1, role: 'key' },
    ],
  };
  delete ten01.boundary;
  ten01.recap = {
    label: '本节结论',
    text: '第1条明确中国特色社会主义最本质的特征、中国特色社会主义制度的最大优势是中国共产党领导，中国共产党是最高政治领导力量；第2条明确总任务是实现社会主义现代化和中华民族伟大复兴，并以中国式现代化推进中华民族伟大复兴；第3条明确新时代我国社会主要矛盾是人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾，并提出坚持以人民为中心等要求。社会主要矛盾变化没有改变社会主义初级阶段的基本国情。',
    sourceBlockIds: [
      'block:politics-toc-v2-u003:b005',
      'block:politics-toc-v2-u003:b006',
      'block:politics-toc-v2-u003:b007',
      'block:politics-toc-v2-u001:b012',
    ],
    emphasis: [],
  };
  ten01.reflection.answer = '第1条明确中国特色社会主义最本质的特征、中国特色社会主义制度的最大优势是中国共产党领导，中国共产党是最高政治领导力量；第2条明确总任务是实现社会主义现代化和中华民族伟大复兴，并以中国式现代化推进中华民族伟大复兴；第3条明确新时代我国社会主要矛盾是人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾，并提出坚持以人民为中心、发展全过程人民民主、推动人的全面发展和共同富裕。';

  const ten02 = source.lessons.find(item => item.id === 'TEN-02');
  ten02.question = '“五位一体”“四个全面”、全面深化改革总目标和全面依法治国总目标分别是什么？';
  ten02.scopeLimit = '学习重点：“五位一体”“四个全面”、全面深化改革总目标和全面依法治国总目标分别是什么。不把四项内容理解为一一对应。';
  ten02.sections[0].label = '“五位一体”与“四个全面”（第四条）';
  ten02.sections[0].emphasis = [
    { part: 'text', quote: '经济建设、政治建设、文化建设、社会建设、生态文明建设', occurrence: 1, role: 'key' },
    { part: 'text', quote: '全面建设社会主义现代化国家、全面深化改革、全面依法治国、全面从严治党', occurrence: 1, role: 'key' },
  ];
  ten02.sections[1].label = '全面深化改革总目标（第五条）';
  ten02.sections[1].emphasis = [
    { part: 'text', quote: '完善和发展中国特色社会主义制度、推进国家治理体系和治理能力现代化', occurrence: 1, role: 'key' },
  ];
  ten02.sections[2].label = '全面依法治国总目标（第六条）';
  ten02.sections[2].emphasis = [
    { part: 'text', quote: '建设中国特色社会主义法治体系、建设社会主义法治国家', occurrence: 1, role: 'key' },
  ];
  delete ten02.boundary;
  ten02.reflection.prompt = ten02.question;
  ten02.recap.text = '第4条明确，“五位一体”总体布局包括经济建设、政治建设、文化建设、社会建设、生态文明建设，“四个全面”战略布局包括全面建设社会主义现代化国家、全面深化改革、全面依法治国、全面从严治党；第5条明确全面深化改革总目标是完善和发展中国特色社会主义制度、推进国家治理体系和治理能力现代化；第6条明确全面依法治国总目标是建设中国特色社会主义法治体系、建设社会主义法治国家。';

  const ten03 = source.lessons.find(item => item.id === 'TEN-03');
  ten03.sections[0].label = '经济发展要求（第七条）';
  ten03.sections[0].emphasis = [
    { part: 'text', quote: '坚持和完善社会主义基本经济制度', occurrence: 1, role: 'key' },
    { part: 'text', quote: '把握新发展阶段，贯彻新发展理念，构建新发展格局，推动高质量发展', occurrence: 1, role: 'key' },
    { part: 'text', quote: '统筹发展和安全', occurrence: 1, role: 'key' },
  ];
  ten03.sections[2].text = '新发展阶段说明当前历史方位；创新、协调、绿色、开放、共享的新发展理念说明发展思路；以国内大循环为主体、国内国际双循环相互促进的新发展格局说明战略路径。构建新发展格局要以全国统一大市场为基础，不是各地都搞自我小循环。';
  ten03.sections[2].sourceBlockIds = [
    'block:politics-toc-v2-u003:b011',
    'block:politics-toc-v2-u007:b057',
    'block:politics-toc-v2-u007:b017',
  ];
  ten03.sections[2].emphasis = [
    { part: 'text', quote: '新发展阶段说明当前历史方位', occurrence: 1, role: 'key' },
    { part: 'text', quote: '新发展理念说明发展思路', occurrence: 1, role: 'key' },
    { part: 'text', quote: '新发展格局说明战略路径', occurrence: 1, role: 'key' },
  ];
  delete ten03.boundary;
  ten03.recap = {
    label: '本节结论',
    text: '第7条明确坚持和完善社会主义基本经济制度，处理市场和政府关系，把握新发展阶段，贯彻新发展理念，构建新发展格局，推动高质量发展，统筹发展和安全。其中，新发展阶段说明历史方位，新发展理念说明发展思路，新发展格局说明战略路径。',
    sourceBlockIds: [
      'block:politics-toc-v2-u003:b011',
      'block:politics-toc-v2-u007:b057',
    ],
    emphasis: [],
  };

  const ten04 = source.lessons.find(item => item.id === 'TEN-04');
  ten04.sections[0].label = '强军目标（第八条）';
  ten04.sections[0].emphasis = [
    { part: 'text', quote: '听党指挥、能打胜仗、作风优良', occurrence: 1, role: 'key' },
    { part: 'text', quote: '把人民军队建设成为世界一流军队', occurrence: 1, role: 'key' },
  ];
  ten04.sections[1].label = '中国特色大国外交（第九条）';
  ten04.sections[1].emphasis = [
    { part: 'text', quote: '服务民族复兴、促进人类进步', occurrence: 1, role: 'key' },
    { part: 'text', quote: '推动建设新型国际关系', occurrence: 1, role: 'key' },
    { part: 'text', quote: '推动构建人类命运共同体', occurrence: 1, role: 'key' },
  ];
  ten04.sections[2].label = '全面从严治党（第十条）';
  ten04.sections[2].emphasis = [
    { part: 'text', quote: '全面从严治党的战略方针', occurrence: 1, role: 'key' },
    { part: 'text', quote: '新时代党的建设总要求', occurrence: 1, role: 'key' },
    { part: 'text', quote: '政治、思想、组织、作风、纪律建设', occurrence: 1, role: 'key' },
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
  const evidenceName = batch + '-20261024.json';
  if (!lineage.includes(evidenceName)) {
    lineage = lineage.replace(
      "  'politics-systematic-user-comprehension-uc7b-p6-20261024.json',",
      "  'politics-systematic-user-comprehension-uc7b-p6-20261024.json',\n  '" + evidenceName + "',",
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
      ai.roles?.[roleId]?.status === 'pass'
      && ai.roles[roleId].riskCount === 0
      && ai.roles[roleId].holdCount === 0);
  const runtimePassed = probe?.status === 'passed'
    && probe?.curriculumVersion === runtime.curriculumVersion
    && uiProjectionAffectedLessonIds.every(id => probe.lessonIds?.includes(id));
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
    uiProjectionAffectedLessonIds,
    probeLessonIds: uiProjectionAffectedLessonIds,
    issueIds: [
      'UC7B-P6R1-BOUNDARY-INTEGRATION',
      'UC7B-P6R1-SIBLING-HEADING-PARALLELISM',
      'UC7B-P6R1-GROUP-NAMING-RHYTHM',
      'UC7B-P6R1-KEY-POINT-SALIENCE',
    ],
    contractRules: [17, 23, 28, 29, 32, 34, 35, 38, 39, 40, 41, 42],
    diagnosis: {
      reviewFailure: '旧链路按单页和改动字段验证，未强制比较同页兄弟标题、同知识组实际投影标题，也未对独立辨析执行融合反事实。',
      boundaryDecision: 'VALUE-01的不可兼得条件属于二因素关系的组成部分，已并入关系正文、结论和答案，删除独立辨析。',
      headingDecision: 'FOUND-03两个结合改为完整知识名称加括号序号，核心设问改为“分别是什么”。',
      groupNamingDecision: 'TEN-01至TEN-04统一为内容名称在前、范围序号在后的展示格式。',
      emphasisDecision: 'VALUE-01正文突出关系谓词与不可兼得条件；历史批次重点映射已重新打开，不能沿用旧AI零风险结论。',
    },
    before,
    after: Object.fromEntries(contentChangedLessonIds.map(id => [id, snapshot(lessons[id])])),
    displayTitleMatrix: Object.fromEntries(uiProjectionAffectedLessonIds
      .filter(id => id.startsWith('TEN-') || id === 'FOUND-03')
      .map(id => [id, null])),
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
  const projection = require('../miniprogram/services/knowledge-platform/systematic-units');
  evidence.displayTitleMatrix = Object.fromEntries(
    Object.keys(evidence.displayTitleMatrix).map(id => [id, projection.displayTitleForLessonId(id)]),
  );
  write(files.evidence, evidence);
  console.log(JSON.stringify({
    status: evidence.status,
    previousCurriculumVersion: evidence.previousCurriculumVersion,
    curriculumVersion: evidence.curriculumVersion,
    changedLessonIds: evidence.contentChangedLessonIds,
    uiProjectionAffectedLessonIds,
    aiReview: evidence.aiReview,
    runtimePageCheck: evidence.runtimePageCheck,
    retrospectiveAudit: evidence.retrospectiveAudit,
  }));
}

main();
