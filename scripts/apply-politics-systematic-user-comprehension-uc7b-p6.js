#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p6';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p5r1-20261024.json',
  evidence: evidenceRoot + batch + '-20261024.json',
  aiReview: evidenceRoot + batch + '-ai-review-20261024.json',
  runtimeProbe: evidenceRoot + batch + '-runtime-probe-20261024.json',
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
  sections: lesson.sections.map(part => ({ label: part.label, text: part.text })),
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
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P6 must start from P5R1 or its own candidate');
  assert.equal(predecessor.status, 'candidate-integrated-runtime-and-user-accepted');

  const lessonIdsBefore = source.lessons.map(item => item.id);
  const contentChangedLessonIds = ['DEV-04', 'VALUE-01', 'FOUND-03', 'TEN-04', 'SECURITY-03'];
  const lessons = Object.fromEntries(contentChangedLessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
  assert.ok(Object.values(lessons).every(Boolean), 'missing P6 lesson');
  const before = Object.fromEntries(contentChangedLessonIds.map(id => [
    id,
    priorEvidence?.before?.[id] || snapshot(lessons[id]),
  ]));

  const economy = lessons['DEV-04'];
  economy.question = '社会主义基本经济制度包括哪三方面？';
  economy.objectives = ['理解社会主义基本经济制度的三方面内容', '区分公有制主体地位与国有经济主导作用'];
  economy.scopeLimit = '学习重点：社会主义基本经济制度包括哪三方面。不展开政府和市场关系。';
  economy.sections[0].label = '社会主义基本经济制度的三方面';
  economy.sections[1].sourceBlockIds = [
    'block:politics-toc-v2-u007:b023',
    'block:politics-toc-v2-u007:b025',
    'block:politics-toc-v2-u007:b031',
  ];
  economy.sections[2].sourceBlockIds = ['block:politics-toc-v2-u007:b028'];
  delete economy.boundary;
  economy.recap = {
    label: '本节结论',
    text: '社会主义基本经济制度包括公有制为主体、多种所有制经济共同发展，按劳分配为主体、多种分配方式并存，以及社会主义市场经济体制。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b022'],
    emphasis: [],
  };
  economy.reflection = {
    prompt: economy.question,
    answer: '三方面分别是：公有制为主体、多种所有制经济共同发展的所有制结构；按劳分配为主体、多种分配方式并存的分配制度；社会主义市场经济体制。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b022'],
  };

  const commodity = lessons['VALUE-01'];
  commodity.scopeLimit = '学习重点：使用价值与价值是什么关系。不展开劳动二重性。';
  commodity.sections[0].label = '商品的定义';
  commodity.sections[1].label = '使用价值的含义';
  commodity.sections[2].label = '价值的含义';
  commodity.boundary = {
    label: '同一商品所有者不能兼得使用价值和价值',
    text: '在商品交换中，对同一商品所有者来说，使用价值和价值不可兼得。',
    sourceBlockIds: ['block:politics-toc-v2-u033:b013'],
    emphasis: [],
  };
  commodity.recap = {
    label: '本节结论',
    text: '商品同时具有使用价值和价值。使用价值是价值的物质承担者，价值通过使用价值表现出来，二者是同一商品的两个因素。',
    sourceBlockIds: ['block:politics-toc-v2-u033:b003', 'block:politics-toc-v2-u033:b012'],
    emphasis: [],
  };

  const combines = lessons['FOUND-03'];
  combines.sections[3].sourceBlockIds = [
    'block:politics-toc-v2-u002:b002',
    'block:politics-toc-v2-u002:b003',
    'block:politics-toc-v2-u002:b004',
  ];
  delete combines.boundary;
  combines.recap = {
    label: '本节结论',
    text: '“两个结合”是把马克思主义基本原理同中国具体实际相结合、同中华优秀传统文化相结合。两者的共同出发点是马克思主义基本原理，结合对象分别是中国具体实际和中华优秀传统文化。',
    sourceBlockIds: ['block:politics-toc-v2-u002:b002', 'block:politics-toc-v2-u002:b012'],
    emphasis: [],
  };
  combines.reflection.sourceBlockIds = ['block:politics-toc-v2-u002:b002'];

  const ten = lessons['TEN-04'];
  ten.objectives = ['理解“十个明确”第8至10条的核心内容'];
  ten.sections = ten.sections.slice(0, 3);
  ten.sections[0].text = '第八条明确，党在新时代的强军目标是建设一支听党指挥、能打胜仗、作风优良的人民军队，把人民军队建设成为世界一流军队。';
  ten.sections[1].text = '第九条明确，中国特色大国外交要服务民族复兴、促进人类进步，推动建设新型国际关系，推动构建人类命运共同体。';
  ten.sections[2].text = '第十条明确全面从严治党的战略方针，提出新时代党的建设总要求，全面推进党的政治、思想、组织、作风、纪律建设，把制度建设贯穿其中，深入推进反腐败斗争，落实管党治党政治责任，并以伟大自我革命引领伟大社会革命。';
  delete ten.boundary;
  ten.recap = {
    label: '本节结论',
    text: '“十个明确”第8条明确建设一支听党指挥、能打胜仗、作风优良的人民军队，把人民军队建设成为世界一流军队；第9条明确中国特色大国外交要服务民族复兴、促进人类进步，推动建设新型国际关系、推动构建人类命运共同体；第10条明确全面从严治党的战略方针、新时代党的建设总要求和各项建设任务。',
    sourceBlockIds: [
      'block:politics-toc-v2-u003:b012',
      'block:politics-toc-v2-u003:b013',
      'block:politics-toc-v2-u003:b014',
    ],
    emphasis: [],
  };
  ten.reflection.answer = '第8条明确建设一支听党指挥、能打胜仗、作风优良的人民军队，把人民军队建设成为世界一流军队；第9条明确中国特色大国外交要服务民族复兴、促进人类进步，推动建设新型国际关系、推动构建人类命运共同体；第10条明确全面从严治党的战略方针、新时代党的建设总要求和政治、思想、组织、作风、纪律建设等任务。';
  ten.reflection.sourceBlockIds = [...ten.recap.sourceBlockIds];

  const security = lessons['SECURITY-03'];
  security.question = '强军目标、党对人民军队的绝对领导与现代化阶段分别是什么？';
  security.objectives = ['理解强军目标、根本原则与现代化阶段'];
  security.scopeLimit = '学习重点：强军目标、党对人民军队的绝对领导与现代化阶段分别是什么。不展开其他建设措施。';
  security.sections[0].label = '强军目标与根本原则';
  security.sections[1] = {
    label: '国防和军队现代化阶段',
    text: '国防和军队现代化的战略安排是：2027年实现建军一百年奋斗目标，2035年基本实现国防和军队现代化，到本世纪中叶全面建成世界一流军队。这些时间节点是建设目标，不代表当前已经完成。',
    sourceBlockIds: [
      'block:politics-toc-v2-u017:b004',
      'block:politics-toc-v2-u017:b005',
      'block:politics-toc-v2-u017:b006',
    ],
    emphasis: [],
  };
  delete security.boundary;
  security.recap = {
    label: '本节结论',
    text: '新时代强军目标是建设听党指挥、能打胜仗、作风优良的人民军队，建设世界一流军队；党对人民军队的绝对领导是建军之本、强军之魂；现代化阶段依次明确2027年、2035年和本世纪中叶的建设目标。',
    sourceBlockIds: [
      'block:politics-toc-v2-u017:b002',
      'block:politics-toc-v2-u017:b004',
      'block:politics-toc-v2-u017:b005',
      'block:politics-toc-v2-u017:b006',
      'block:politics-toc-v2-u017:b008',
    ],
    emphasis: [],
  };
  security.reflection = {
    prompt: security.question,
    answer: '强军目标是建设听党指挥、能打胜仗、作风优良的人民军队，建设世界一流军队；党对人民军队的绝对领导是建军之本、强军之魂，军委主席负责制是根本制度和根本实现形式；现代化阶段包括2027年实现建军一百年奋斗目标、2035年基本实现国防和军队现代化、到本世纪中叶全面建成世界一流军队。',
    sourceBlockIds: [
      'block:politics-toc-v2-u017:b002',
      'block:politics-toc-v2-u017:b004',
      'block:politics-toc-v2-u017:b005',
      'block:politics-toc-v2-u017:b006',
      'block:politics-toc-v2-u017:b008',
      'block:politics-toc-v2-u017:b011',
    ],
  };
  security.corePromises = [
    { quote: '听党指挥、能打胜仗、作风优良', sourceBlockIds: ['block:politics-toc-v2-u017:b002'] },
    { quote: '军委主席负责制', sourceBlockIds: ['block:politics-toc-v2-u017:b011'] },
    { quote: '2027年', sourceBlockIds: ['block:politics-toc-v2-u017:b004'] },
    { quote: '2035年', sourceBlockIds: ['block:politics-toc-v2-u017:b005'] },
    { quote: '本世纪中叶', sourceBlockIds: ['block:politics-toc-v2-u017:b006'] },
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
      "  'politics-systematic-user-comprehension-uc7b-p5r1-20261024.json',",
      "  'politics-systematic-user-comprehension-uc7b-p5r1-20261024.json',\n  '" + evidenceName + "',",
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
  const runtimePassed = probe?.status === 'passed'
    && probe?.curriculumVersion === runtime.curriculumVersion
    && contentChangedLessonIds.every(id => probe.lessonIds?.includes(id));
  const evidence = {
    schemaVersion: 1,
    batchId: batch,
    generatedAt: '2026-10-24',
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
    uiProjectionAffectedLessonIds: contentChangedLessonIds,
    probeLessonIds: contentChangedLessonIds,
    issueIds: ['UC7B-P6-TASK-MISMATCH', 'UC7B-P6-EDITORIAL-CONCLUSION', 'UC7B-P6-SOURCE-RESPONSIBILITY-DRIFT'],
    contractRules: [13, 14, 17, 21, 23, 27, 29, 32, 34, 35, 37],
    diagnosis: {
      auditMethod: '三类AI角色分别按首次理解、学科来源和测评一致性筛选，再以用户影响、局部可修复和来源可闭合确定本批。',
      taskAlignment: 'DEV-04统一为基本经济制度三方面；SECURITY-03统一为三个对象分别是什么。',
      editorialCleanup: 'VALUE-01、FOUND-03、TEN-04和SECURITY-03删除主题回顾、学习步骤或跨节转场式结论。',
      boundaryDecision: 'DEV-04、TEN-04、SECURITY-03删除不服务核心任务的辨析；VALUE-01仅保留同一商品所有者不可兼得的具体条件；FOUND-03保留共同出发点辨析。',
      sourceResponsibility: '逐段、结论和自测来源收窄为直接支持当前可见主张的最小集合。',
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
