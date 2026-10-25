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
  predecessorEvidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7a-20261023.json',
  seedAudit: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-sample-audit-20261023.json',
  acceptance: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7a-user-acceptance-20261023.json',
  evidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p0-20261023.json',
  aiReview: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p0-ai-review-20261023.json',
  runtimeProbe: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p0-runtime-probe-20261023.json',
};
const absolute = file => path.join(root, file);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function updateInventory(inventory, source) {
  for (const unit of inventory.units) {
    for (const block of unit.sourceBlocks) {
      block.sampleLessonIds = source.lessons
        .filter(lesson => [...lesson.sections, lesson.boundary, lesson.recap, lesson.reflection]
          .some(part => part.sourceBlockIds.includes(block.blockId)))
        .map(lesson => lesson.id);
      const inDefault = source.lessons.some(lesson => [...lesson.sections, lesson.boundary, lesson.recap]
        .some(part => part.sourceBlockIds.includes(block.blockId)));
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
    ? JSON.parse(fs.readFileSync(absolute(files.evidence), 'utf8'))
    : null;
  const existingRuntimeProbe = fs.existsSync(absolute(files.runtimeProbe))
    ? JSON.parse(fs.readFileSync(absolute(files.runtimeProbe), 'utf8'))
    : null;
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const currentRuntime = require('../miniprogram/models/politics-systematic-units-runtime');
  assert.ok([predecessor.curriculumVersion, existingEvidence?.curriculumVersion]
    .filter(Boolean).includes(currentRuntime.curriculumVersion),
  'UC7B P0 must start from UC7A or its own candidate');
  assert.equal(seedAudit.status, 'audit-logic-registered');

  const beforeIds = source.lessons.map(lesson => lesson.id);
  const sys02 = source.lessons.find(lesson => lesson.id === 'SYS-02');
  const leadership01 = source.lessons.find(lesson => lesson.id === 'LEADERSHIP-01');
  assert.ok(sys02 && leadership01, 'missing UC7B P0 lessons');
  const before = existingEvidence?.before || {
    'SYS-02': {
      title: sys02.title,
      question: sys02.question,
      objectives: sys02.objectives,
      sectionLabels: sys02.sections.map(part => part.label),
      sectionTexts: sys02.sections.map(part => part.text),
      boundaryLabel: sys02.boundary.label,
      boundaryText: sys02.boundary.text,
      reflectionPrompt: sys02.reflection.prompt,
    },
    'LEADERSHIP-01': {
      title: leadership01.title,
      question: leadership01.question,
      objectives: leadership01.objectives,
      sectionLabels: leadership01.sections.map(part => part.label),
      sectionTexts: leadership01.sections.map(part => part.text),
      boundaryLabel: leadership01.boundary.label,
      boundaryText: leadership01.boundary.text,
      reflectionPrompt: leadership01.reflection.prompt,
    },
  };

  sys02.question = '“十四个坚持”的前七项是什么？';
  sys02.objectives = ['理解“十四个坚持”前七项的内容'];
  sys02.scopeLimit = '学习重点：“十四个坚持”前七项的内容。';
  sys02.sections = [
    {
      label: '党的领导与人民立场（第1—2项）',
      text: '前两项是坚持党对一切工作的领导和坚持以人民为中心。前者说明党的领导，后者说明人民立场。',
      sourceBlockIds: [
        'block:politics-toc-v2-u003:b016',
      ],
      emphasis: [
        { part: 'text', quote: '坚持党对一切工作的领导', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持以人民为中心', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '全面深化改革与新发展理念（第3—4项）',
      text: '第3—4项分别是坚持全面深化改革和坚持新发展理念，分别指向改革任务和发展理念。',
      sourceBlockIds: [
        'block:politics-toc-v2-u003:b009',
        'block:politics-toc-v2-u003:b011',
        'block:politics-toc-v2-u003:b016',
      ],
      emphasis: [
        { part: 'text', quote: '坚持全面深化改革', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持新发展理念', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '人民当家作主、全面依法治国与社会主义核心价值体系（第5—7项）',
      text: '第5—7项依次是坚持人民当家作主、坚持全面依法治国和坚持社会主义核心价值体系，分别涉及民主政治、法治建设和价值体系。',
      sourceBlockIds: ['block:politics-toc-v2-u003:b016'],
      emphasis: [
        { part: 'text', quote: '坚持人民当家作主', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持全面依法治国', occurrence: 1, role: 'key' },
        { part: 'text', quote: '坚持社会主义核心价值体系', occurrence: 1, role: 'key' },
      ],
    },
  ];
  sys02.boundary = {
    label: '前七项与后七项',
    text: '前七项与后七项共同构成“十四个坚持”，不是两套独立方略。',
    sourceBlockIds: [
      'block:politics-toc-v2-u003:b015',
      'block:politics-toc-v2-u003:b016',
    ],
    emphasis: [],
  };
  sys02.recap = {
    label: '本节结论',
    text: '前七项依次涉及党的领导、人民立场、全面深化改革、新发展理念、人民当家作主、全面依法治国和社会主义核心价值体系。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b016'],
    emphasis: [],
  };
  sys02.reflection = {
    prompt: sys02.question,
    answer: '“十四个坚持”的前七项依次是坚持党对一切工作的领导、坚持以人民为中心、坚持全面深化改革、坚持新发展理念、坚持人民当家作主、坚持全面依法治国、坚持社会主义核心价值体系。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b016'],
  };

  leadership01.title = '党的领导与国家机关职能';
  leadership01.question = '党的领导与国家机关具体职能是什么关系？';
  leadership01.objectives = ['理解党的领导地位、党的领导制度与国家机关具体职能的关系'];
  leadership01.scopeLimit = '学习重点：党的领导地位、党的领导制度与国家机关具体职能的关系。不展开国家机关的完整职能清单。';
  leadership01.sections = [
    {
      label: '党的领导地位',
      text: '中国共产党是我国最高政治领导力量，党中央集中统一领导是党的领导的最高原则。',
      sourceBlockIds: [
        'block:politics-toc-v2-u005:b008',
        'block:politics-toc-v2-u005:b009',
      ],
      emphasis: [
        { part: 'text', quote: '最高政治领导力量', occurrence: 1, role: 'key' },
        { part: 'text', quote: '党中央集中统一领导', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '党的领导制度',
      text: '党的领导制度是我国的根本领导制度，在中国特色社会主义制度体系中居于统领地位。',
      sourceBlockIds: [
        'block:politics-toc-v2-u005:b011',
        'block:politics-toc-v2-u005:b012',
      ],
      emphasis: [
        { part: 'text', quote: '根本领导制度', occurrence: 1, role: 'key' },
        { part: 'text', quote: '统领地位', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '国家机关承担具体职能',
      text: '具体国家机关各自承担相应职能。党的领导与国家机关具体职能处于不同层面。',
      sourceBlockIds: ['block:politics-toc-v2-u005:b016'],
      emphasis: [
        { part: 'text', quote: '具体国家机关各自承担相应职能', occurrence: 1, role: 'key' },
        { part: 'text', quote: '处于不同层面', occurrence: 1, role: 'key' },
      ],
    },
  ];
  leadership01.boundary = {
    label: '党的领导不代替国家机关具体履职',
    text: '党领导一切不等于包揽一切，党的领导不能代替国家机关履行具体职能。',
    sourceBlockIds: ['block:politics-toc-v2-u005:b016'],
    emphasis: [],
  };
  leadership01.recap = {
    label: '本节结论',
    text: '中国共产党是最高政治领导力量，党的领导制度居于统领地位，具体国家机关各自承担相应职能。党的领导与国家机关具体职能处于不同层面，不能相互替代。',
    sourceBlockIds: [
      'block:politics-toc-v2-u005:b008',
      'block:politics-toc-v2-u005:b012',
      'block:politics-toc-v2-u005:b016',
    ],
    emphasis: [],
  };
  leadership01.reflection = {
    prompt: leadership01.question,
    answer: '中国共产党是最高政治领导力量，党的领导制度在中国特色社会主义制度体系中居于统领地位；具体国家机关各自承担相应职能。二者处于不同层面，党的领导不能代替国家机关具体履职。',
    sourceBlockIds: [
      'block:politics-toc-v2-u005:b008',
      'block:politics-toc-v2-u005:b012',
      'block:politics-toc-v2-u005:b016',
    ],
  };
  leadership01.corePromises = [
    { quote: '最高政治领导力量', sourceBlockIds: ['block:politics-toc-v2-u005:b008'] },
    { quote: '党中央集中统一领导', sourceBlockIds: ['block:politics-toc-v2-u005:b009'] },
    { quote: '根本领导制度', sourceBlockIds: ['block:politics-toc-v2-u005:b011'] },
    { quote: '统领地位', sourceBlockIds: ['block:politics-toc-v2-u005:b012'] },
    { quote: '具体国家机关各自承担相应职能', sourceBlockIds: ['block:politics-toc-v2-u005:b016'] },
  ];

  const displayTitles = {
    'SYS-02': sys02.title,
    'LEADERSHIP-01': leadership01.title,
  };
  for (const [lessonId, title] of Object.entries(displayTitles)) {
    const pattern = new RegExp(`('${lessonId}':\\s*)'[^']*'`);
    assert.match(displayProjectionText, pattern, `missing display-title projection for ${lessonId}`);
    displayProjectionText = displayProjectionText.replace(pattern, `$1'${title}'`);
  }

  assert.deepEqual(source.lessons.map(lesson => lesson.id), beforeIds);
  const usedSourceBlockIds = new Set(source.lessons.flatMap(lesson => [
    ...lesson.sections,
    lesson.boundary,
    lesson.recap,
    lesson.reflection,
  ].flatMap(part => part.sourceBlockIds)));
  source.sourceBindings = source.sourceBindings.filter(binding => usedSourceBlockIds.has(binding.blockId));
  source.progressCompatibleVersions = [...new Set([
    ...(source.progressCompatibleVersions || []),
    predecessor.curriculumVersion,
    existingEvidence?.priorAcceptedCandidateVersion,
    existingRuntimeProbe?.curriculumVersion === currentRuntime.curriculumVersion
      ? null : existingRuntimeProbe?.curriculumVersion,
  ].filter(Boolean))];
  updateInventory(inventory, source);
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = `${JSON.stringify(source, null, 2)}\n`;
  const inventoryText = `${JSON.stringify(inventory, null, 2)}\n`;
  const runtimeText = `// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ${JSON.stringify(runtime)};\n`;
  const acceptance = {
    schemaVersion: 1,
    acceptanceId: 'politics-systematic-user-comprehension-uc7a-real-user-acceptance',
    acceptedAt: '2026-10-23',
    lessonId: 'COGNITION-02',
    curriculumVersion: predecessor.curriculumVersion,
    status: 'accepted-for-batch-expansion',
    acceptedScope: 'core-question-and-calibration-direction',
    acceptedText: '认识的两次飞跃分别是什么？',
    userStatement: '“认识的两次飞跃分别是什么？”符合预期，按照批次继续',
    fullLessonComprehensionRetest: 'not-separately-recorded',
    expansionAuthorized: true,
  };
  const acceptanceText = `${JSON.stringify(acceptance, null, 2)}\n`;
  const finalSourceSha256 = sha256(Buffer.from(sourceText));
  const aiReview = fs.existsSync(absolute(files.aiReview))
    ? JSON.parse(fs.readFileSync(absolute(files.aiReview), 'utf8'))
    : null;
  const aiReviewPassed = aiReview?.curriculumVersion === runtime.curriculumVersion
    && aiReview?.sourceSha256 === finalSourceSha256
    && Object.values(aiReview.roles || {}).every(role => role.status === 'pass'
      && role.riskCount === 0 && role.holdCount === 0);
  const runtimeProbe = existingRuntimeProbe;
  const runtimePageCheckPassed = runtimeProbe?.status === 'passed'
    && runtimeProbe?.curriculumVersion === runtime.curriculumVersion
    && ['SYS-02', 'LEADERSHIP-01'].every(id => runtimeProbe.lessonIds?.includes(id));
  fs.writeFileSync(absolute(files.source), sourceText);
  fs.writeFileSync(absolute(files.inventory), inventoryText);
  fs.writeFileSync(absolute(files.runtime), runtimeText);
  fs.writeFileSync(absolute(files.displayProjection), displayProjectionText);
  fs.writeFileSync(absolute(files.reading), renderReading(source));
  fs.writeFileSync(absolute(files.acceptance), acceptanceText);

  const evidence = {
    schemaVersion: 1,
    batchId: 'politics-systematic-user-comprehension-uc7b-p0',
    generatedAt: '2026-10-23',
    status: runtimePageCheckPassed
      ? 'candidate-integrated-and-runtime-verified'
      : aiReviewPassed ? 'candidate-integrated-ai-passed-runtime-pending'
        : 'candidate-integrated-ai-runtime-pending',
    previousCurriculumVersion: predecessor.curriculumVersion,
    priorAcceptedCandidateVersion: existingEvidence?.priorAcceptedCandidateVersion
      || (existingRuntimeProbe?.curriculumVersion !== runtime.curriculumVersion
        ? existingRuntimeProbe?.curriculumVersion : null),
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
    stableLessonIds: true,
    orderChanged: false,
    changedLessonIds: ['SYS-02', 'LEADERSHIP-01'],
    issueIds: ['UC7B-SEED-SYS-02', 'UC7B-SEED-LEADERSHIP-01'],
    contractRules: [21, 22, 23, 24, 25, 26, 27, 28],
    before,
    after: {
      'SYS-02': {
        title: sys02.title,
        question: sys02.question,
        objectives: sys02.objectives,
        sectionLabels: sys02.sections.map(part => part.label),
        sectionTexts: sys02.sections.map(part => part.text),
        boundaryLabel: sys02.boundary.label,
        boundaryText: sys02.boundary.text,
        reflectionPrompt: sys02.reflection.prompt,
      },
      'LEADERSHIP-01': {
        title: leadership01.title,
        question: leadership01.question,
        objectives: leadership01.objectives,
        sectionLabels: leadership01.sections.map(part => part.label),
        sectionTexts: leadership01.sections.map(part => part.text),
        boundaryLabel: leadership01.boundary.label,
        boundaryText: leadership01.boundary.text,
        reflectionPrompt: leadership01.reflection.prompt,
      },
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
    acceptancePath: files.acceptance,
    acceptanceSha256: sha256(Buffer.from(acceptanceText)),
    aiReview: aiReviewPassed ? 'passed' : 'pending',
    aiReviewPath: aiReviewPassed ? files.aiReview : null,
    aiReviewSha256: aiReviewPassed ? sha256(fs.readFileSync(absolute(files.aiReview))) : null,
    runtimePageCheck: runtimePageCheckPassed ? 'passed' : 'pending',
    runtimeProbePath: runtimePageCheckPassed ? files.runtimeProbe : null,
    runtimeProbeSha256: runtimePageCheckPassed
      ? sha256(fs.readFileSync(absolute(files.runtimeProbe))) : null,
    realUserAcceptance: 'pending',
    retainedHoldLessonIds: ['CAPITAL-02'],
    sharedDependency: {
      path: 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json',
      status: 'shared-contract-sync-not-executed',
      knownMismatchedObjectiveCountBeforeBatch: 13,
    },
    releaseAuthorized: false,
  };
  fs.writeFileSync(absolute(files.evidence), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify({
    status: evidence.status,
    previousCurriculumVersion: evidence.previousCurriculumVersion,
    curriculumVersion: evidence.curriculumVersion,
    changedLessonIds: evidence.changedLessonIds,
    progressCompatible: evidence.progressCompatible,
    aiReview: evidence.aiReview,
    runtimePageCheck: evidence.runtimePageCheck,
  }));
}

main();
