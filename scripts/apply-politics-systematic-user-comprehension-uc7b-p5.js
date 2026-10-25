#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p5';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p4r1-20261024.json',
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
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P5 must start from P4R1 or its own candidate');
  assert.equal(predecessor.status, 'candidate-integrated-runtime-and-user-accepted');

  const lessonIdsBefore = source.lessons.map(item => item.id);
  const contentChangedLessonIds = ['COGNITION-01', 'COGNITION-03', 'HISTORY-01', 'MONEY-01', 'DIALECTICS-06'];
  const lessons = Object.fromEntries(contentChangedLessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
  assert.ok(Object.values(lessons).every(Boolean), 'missing P5 lesson');
  const before = Object.fromEntries(contentChangedLessonIds.map(id => [
    id,
    priorEvidence?.before?.[id] || snapshot(lessons[id]),
  ]));

  const practice = lessons['COGNITION-01'];
  practice.question = '实践与认识是什么关系？';
  practice.objectives = ['理解实践对认识的决定作用和认识对实践的反作用'];
  practice.scopeLimit = '学习重点：实践与认识是什么关系。不替代完整认识论课程。';
  practice.sections = [
    {
      label: '实践与认识的含义',
      text: '实践是人类能动改造世界的社会性客观物质活动，具有直接现实性、自觉能动性和社会历史性。认识是主体在实践基础上对客体的能动反映，会带有主体因素，但不能任意脱离客体。',
      sourceBlockIds: [
        'block:politics-toc-v2-u027:b003',
        'block:politics-toc-v2-u027:b005',
        'block:politics-toc-v2-u027:b008',
        'block:politics-toc-v2-u027:b009',
      ],
      emphasis: [
        { part: 'text', quote: '客观物质活动', occurrence: 1, role: 'key' },
        { part: 'text', quote: '能动反映', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '实践对认识的决定作用',
      text: '实践是认识的来源、发展的动力、目的，也是检验认识真理性的唯一标准。这四个方面分别说明认识从哪里来、怎样发展、用于什么和怎样检验。',
      sourceBlockIds: [
        'block:politics-toc-v2-u027:b012',
        'block:politics-toc-v2-u027:b013',
        'block:politics-toc-v2-u027:b014',
        'block:politics-toc-v2-u027:b015',
      ],
      emphasis: [],
    },
    {
      label: '认识对实践的反作用',
      text: '认识又反作用于实践，正确认识促进实践，错误认识可能阻碍实践甚至导致失败。实践决定认识与认识反作用于实践构成双向关系。',
      sourceBlockIds: ['block:politics-toc-v2-u027:b016'],
      emphasis: [],
    },
  ];
  practice.boundary = {
    label: '认识来源不等于个人都要亲历',
    text: '实践是认识的来源，不等于每个人的一切认识都必须来自亲身实践。',
    sourceBlockIds: ['block:politics-toc-v2-u027:b023'],
    emphasis: [],
  };
  practice.recap = {
    label: '本节结论',
    text: '实践决定认识，是认识的来源、动力、目的和检验标准；认识又反作用于实践，正确认识促进实践，错误认识阻碍实践。',
    sourceBlockIds: [
      'block:politics-toc-v2-u027:b012',
      'block:politics-toc-v2-u027:b013',
      'block:politics-toc-v2-u027:b014',
      'block:politics-toc-v2-u027:b015',
      'block:politics-toc-v2-u027:b016',
    ],
    emphasis: [],
  };
  practice.reflection = {
    prompt: practice.question,
    answer: '实践对认识具有决定作用，是认识的来源、动力、目的和检验标准；认识对实践具有反作用，正确认识促进实践，错误认识阻碍实践。',
    sourceBlockIds: [...practice.recap.sourceBlockIds],
  };
  practice.corePromises = [
    { quote: '客观物质活动', sourceBlockIds: ['block:politics-toc-v2-u027:b003'] },
    { quote: '能动反映', sourceBlockIds: ['block:politics-toc-v2-u027:b008'] },
    { quote: '来源', sourceBlockIds: ['block:politics-toc-v2-u027:b012'] },
    { quote: '动力', sourceBlockIds: ['block:politics-toc-v2-u027:b013'] },
    { quote: '目的', sourceBlockIds: ['block:politics-toc-v2-u027:b014'] },
    { quote: '唯一标准', sourceBlockIds: ['block:politics-toc-v2-u027:b015'] },
  ];

  const truth = lessons['COGNITION-03'];
  truth.question = '真理的客观性、绝对性和相对性是什么关系？';
  truth.objectives = ['理解真理的客观性以及绝对性与相对性的统一'];
  truth.scopeLimit = '学习重点：真理的客观性、绝对性和相对性是什么关系。不替代完整认识论课程。';
  truth.sections[0] = {
    label: '真理的客观性',
    text: '真理是主观与客观相符合，是对客观事物及其规律的正确认识。真理的内容和实践检验标准具有客观性；真理内容不以人的意志为转移，但其表现形式可以带有主观性。',
    sourceBlockIds: [
      'block:politics-toc-v2-u029:b002',
      'block:politics-toc-v2-u029:b004',
      'block:politics-toc-v2-u029:b009',
    ],
    emphasis: [
      { part: 'text', quote: '主观与客观相符合', occurrence: 1, role: 'key' },
      { part: 'text', quote: '客观性', occurrence: 1, role: 'key' },
    ],
  };
  truth.sections[1] = {
    label: '真理的绝对性、相对性与条件性',
    text: '绝对性说明真理能够正确反映客观事物及其规律；相对性说明真理在一定条件下是有限度、不完善的。绝对性和相对性是同一客观真理的两种属性，真理有条件性不等于可以任意改变。',
    sourceBlockIds: [
      'block:politics-toc-v2-u029:b005',
      'block:politics-toc-v2-u029:b007',
      'block:politics-toc-v2-u029:b008',
      'block:politics-toc-v2-u029:b009',
    ],
    emphasis: [],
  };
  delete truth.boundary;
  truth.recap = {
    label: '本节结论',
    text: '真理的内容和实践检验标准具有客观性；绝对性和相对性是同一客观真理的两种属性。真理有条件性，只说明其适用范围和认识限度，不意味着可以任意改变。',
    sourceBlockIds: [
      'block:politics-toc-v2-u029:b004',
      'block:politics-toc-v2-u029:b007',
      'block:politics-toc-v2-u029:b008',
      'block:politics-toc-v2-u029:b009',
    ],
    emphasis: [],
  };
  truth.reflection = {
    prompt: truth.question,
    answer: '真理的内容和检验标准是客观的；绝对性与相对性是同一客观真理的两种属性，相对性说明真理在一定条件下有限度、不完善，并不表示真理可以任意改变。',
    sourceBlockIds: [...truth.recap.sourceBlockIds],
  };
  truth.corePromises = [
    { quote: '主观与客观相符合', sourceBlockIds: ['block:politics-toc-v2-u029:b002'] },
    { quote: '实践检验', sourceBlockIds: ['block:politics-toc-v2-u029:b004'] },
    { quote: '绝对性', sourceBlockIds: ['block:politics-toc-v2-u029:b005'] },
    { quote: '相对性', sourceBlockIds: ['block:politics-toc-v2-u029:b007'] },
    { quote: '同一客观真理', sourceBlockIds: ['block:politics-toc-v2-u029:b008'] },
  ];

  const history = lessons['HISTORY-01'];
  history.question = '社会存在的决定作用与社会意识的相对独立性是什么关系？';
  history.objectives = ['理解社会存在的决定作用与社会意识相对独立性的关系'];
  history.scopeLimit = '学习重点：社会存在的决定作用与社会意识的相对独立性是什么关系。不展开详细学派分类。';
  history.sections[0].label = '社会存在与社会意识的含义';
  history.sections[1].label = '社会意识的相对独立性';
  history.boundary = {
    label: '社会意识的反作用通过实践实现',
    text: '先进社会意识对社会发展的促进作用，要通过社会实践才能实现。',
    sourceBlockIds: ['block:politics-toc-v2-u030:b013'],
    emphasis: [],
  };
  history.recap = {
    label: '本节结论',
    text: '社会存在决定社会意识，社会意识具有相对独立性并反作用于社会存在。相对独立性和反作用都以社会存在的决定作用为基础，不会使决定关系反转。',
    sourceBlockIds: [
      'block:politics-toc-v2-u030:b010',
      'block:politics-toc-v2-u030:b011',
      'block:politics-toc-v2-u030:b012',
      'block:politics-toc-v2-u030:b013',
    ],
    emphasis: [],
  };
  history.reflection = {
    prompt: history.question,
    answer: '社会存在决定社会意识；社会意识有自身发展特点，并能反作用于社会存在，但这种相对独立性和反作用不否定社会存在的决定作用。',
    sourceBlockIds: [
      'block:politics-toc-v2-u030:b010',
      'block:politics-toc-v2-u030:b011',
      'block:politics-toc-v2-u030:b012',
      'block:politics-toc-v2-u030:b013',
    ],
  };
  history.corePromises = [
    { quote: '物质生产方式', sourceBlockIds: ['block:politics-toc-v2-u030:b005'] },
    { quote: '社会存在决定社会意识', sourceBlockIds: ['block:politics-toc-v2-u030:b003'] },
    { quote: '相对独立性', sourceBlockIds: ['block:politics-toc-v2-u030:b012'] },
    { quote: '不完全同步', sourceBlockIds: ['block:politics-toc-v2-u030:b012'] },
  ];

  const money = lessons['MONEY-01'];
  money.question = '货币的本质、价值尺度和流通手段分别是什么？';
  money.objectives = ['理解货币的本质以及价值尺度和流通手段的含义'];
  money.scopeLimit = '学习重点：货币的本质、价值尺度和流通手段分别是什么。不展开贮藏手段、支付手段和世界货币。';
  money.sections[0].label = '货币的本质是一般等价物';
  money.sections[0].sourceBlockIds = [
    'block:politics-toc-v2-u036:b002',
    'block:politics-toc-v2-u036:b003',
  ];
  money.sections[1].label = '价值尺度与流通手段';
  money.sections[1].sourceBlockIds = [
    'block:politics-toc-v2-u036:b004',
    'block:politics-toc-v2-u036:b005',
    'block:politics-toc-v2-u036:b006',
    'block:politics-toc-v2-u036:b007',
    'block:politics-toc-v2-u036:b008',
  ];
  delete money.boundary;
  money.recap = {
    label: '本节结论',
    text: '货币的本质是一般等价物；价值尺度表现和衡量商品价值，可以由观念货币承担；流通手段在商品流通中充当交换媒介，需要现实货币。',
    sourceBlockIds: [
      'block:politics-toc-v2-u036:b002',
      'block:politics-toc-v2-u036:b005',
      'block:politics-toc-v2-u036:b006',
      'block:politics-toc-v2-u036:b007',
      'block:politics-toc-v2-u036:b008',
    ],
    emphasis: [],
  };
  money.reflection = {
    prompt: money.question,
    answer: '货币的本质是一般等价物；价值尺度是货币表现和衡量商品价值的职能，可以使用观念货币；流通手段是货币在商品交换中充当媒介的职能，需要现实货币。',
    sourceBlockIds: [...money.recap.sourceBlockIds],
  };
  money.corePromises = [
    { quote: '一般等价物', sourceBlockIds: ['block:politics-toc-v2-u036:b002'] },
    { quote: '价值尺度', sourceBlockIds: ['block:politics-toc-v2-u036:b005'] },
    { quote: '流通手段', sourceBlockIds: ['block:politics-toc-v2-u036:b007'] },
    { quote: '观念货币', sourceBlockIds: ['block:politics-toc-v2-u036:b006'] },
    { quote: '现实货币', sourceBlockIds: ['block:politics-toc-v2-u036:b008'] },
  ];

  const negation = lessons['DIALECTICS-06'];
  negation.question = '辩证否定和否定之否定分别是什么？';
  negation.objectives = ['理解辩证否定和否定之否定的含义与区别'];
  negation.scopeLimit = '学习重点：辩证否定和否定之否定分别是什么。不把发展理解为机械次数。';
  negation.sections[0].label = '辩证否定：自我否定与扬弃';
  negation.sections[1] = {
    label: '否定之否定：前进性与曲折性的统一',
    text: '否定之否定规律揭示发展的方向和道路，发展表现为螺旋式上升、波浪式前进，是前进性和曲折性的统一。暂时倒退不能据此否认发展的总体趋势；判断某种反复是否代表发展，要看它是否符合事物发展的必然趋势。',
    sourceBlockIds: [
      'block:politics-toc-v2-u026:b002',
      'block:politics-toc-v2-u026:b009',
      'block:politics-toc-v2-u026:b010',
      'block:politics-toc-v2-u026:b011',
      'block:politics-toc-v2-u023:b011',
    ],
    emphasis: [
      { part: 'text', quote: '螺旋式上升、波浪式前进', occurrence: 1, role: 'key' },
      { part: 'text', quote: '前进性和曲折性', occurrence: 1, role: 'key' },
    ],
  };
  delete negation.boundary;
  negation.recap = {
    label: '本节结论',
    text: '辩证否定是事物的自我否定，实质是既克服又保留的“扬弃”；否定之否定揭示发展的方向和道路是前进性与曲折性的统一。',
    sourceBlockIds: [
      'block:politics-toc-v2-u026:b002',
      'block:politics-toc-v2-u026:b004',
      'block:politics-toc-v2-u026:b007',
      'block:politics-toc-v2-u026:b010',
    ],
    emphasis: [],
  };
  negation.reflection = {
    prompt: negation.question,
    answer: '辩证否定是事物的自我否定，核心是对旧事物既克服又保留；否定之否定揭示发展道路具有前进性和曲折性。',
    sourceBlockIds: [
      'block:politics-toc-v2-u026:b002',
      'block:politics-toc-v2-u026:b004',
      'block:politics-toc-v2-u026:b007',
      'block:politics-toc-v2-u026:b010',
    ],
  };
  negation.corePromises = [
    { quote: '自我否定', sourceBlockIds: ['block:politics-toc-v2-u026:b004'] },
    { quote: '既克服又保留', sourceBlockIds: ['block:politics-toc-v2-u026:b007'] },
    { quote: '螺旋式上升、波浪式前进', sourceBlockIds: ['block:politics-toc-v2-u026:b009'] },
    { quote: '前进性和曲折性', sourceBlockIds: ['block:politics-toc-v2-u026:b010'] },
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
      "  'politics-systematic-user-comprehension-uc7b-p4r1-20261024.json',",
      "  'politics-systematic-user-comprehension-uc7b-p4r1-20261024.json',\n  '" + evidenceName + "',",
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
    issueIds: ['UC7B-P5-QUESTION-BODY-SCOPE-DRIFT', 'UC7B-P5-THEME-SUMMARY-AS-LESSON-CONCLUSION', 'UC7B-P5-BOUNDARY-ROLE-DRIFT'],
    contractRules: [13, 14, 17, 23, 27, 29, 32, 34, 35],
    diagnosis: {
      auditMethod: '按题目、正文、结论和自测任务一致性召回，并由AI首次用户、学科专家和测评专家裁决。',
      removedBoundaryLessonIds: ['COGNITION-03', 'MONEY-01', 'DIALECTICS-06'],
      retainedBoundaryLessonIds: ['COGNITION-01', 'HISTORY-01'],
      unchangedPassLessonIds: ['LEADERSHIP-02'],
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
