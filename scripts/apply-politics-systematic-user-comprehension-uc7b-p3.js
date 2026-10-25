#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p3';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p2r3-20261023.json',
  evidence: evidenceRoot + batch + '-20261023.json',
  aiReview: evidenceRoot + batch + '-ai-review-20261023.json',
  runtimeProbe: evidenceRoot + batch + '-runtime-probe-20261023.json',
  userAcceptance: evidenceRoot + batch + '-user-acceptance-20261023.json',
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
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P3 must start from P2R3 or its own candidate');
  assert.equal(predecessor.status, 'candidate-integrated-runtime-and-user-accepted');

  const lessonIdsBefore = source.lessons.map(lesson => lesson.id);
  const lessons = {
    'DIALECTICS-01': source.lessons.find(item => item.id === 'DIALECTICS-01'),
    'DEV-06': source.lessons.find(item => item.id === 'DEV-06'),
    'MOD-01': source.lessons.find(item => item.id === 'MOD-01'),
    'COGNITION-02': source.lessons.find(item => item.id === 'COGNITION-02'),
    'FOUND-02': source.lessons.find(item => item.id === 'FOUND-02'),
  };
  assert.ok(Object.values(lessons).every(Boolean), 'missing P3 lesson');
  const priorBefore = priorEvidence?.before;
  const before = Object.fromEntries(Object.entries(lessons)
    .map(([id, lesson]) => [id, priorBefore?.[id] || snapshot(lesson)]));

  lessons['DIALECTICS-01'].objectives = [
    '理解联系的特征、整体与部分的关系、新旧事物的判断标准',
  ];
  delete lessons['DIALECTICS-01'].boundary;
  lessons['DIALECTICS-01'].recap = {
    label: '本节结论',
    text: '联系具有客观性、普遍性、多样性和条件性；整体居于主导地位并统率部分，部分影响整体，关键部分的功能及其变化甚至决定整体功能；判断新旧事物要看是否符合事物发展的必然趋势。',
    sourceBlockIds: [
      'block:politics-toc-v2-u023:b004',
      'block:politics-toc-v2-u023:b008',
      'block:politics-toc-v2-u023:b009',
      'block:politics-toc-v2-u023:b011',
    ],
    emphasis: [],
  };
  lessons['DIALECTICS-01'].reflection.answer = '联系具有客观性、普遍性、多样性和条件性。整体居于主导地位并统率部分，部分影响整体，关键部分的功能及其变化甚至决定整体功能。判断新旧事物的根本标准是看其是否符合事物发展的必然趋势。';
  lessons['DIALECTICS-01'].reflection.sourceBlockIds = lessons['DIALECTICS-01'].recap.sourceBlockIds.slice();

  lessons['DEV-06'].scopeLimit = '学习重点：乡村振兴的总目标、总方针、总要求、制度保障和首要任务分别是什么。不展开乡村振兴的其他内容。';
  lessons['DEV-06'].boundary = {
    label: '本节五项内容与“五项振兴”不同',
    text: '本节的总目标、总方针、总要求、制度保障和首要任务，与产业振兴、人才振兴、文化振兴、生态振兴、组织振兴不是同一组内容。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b048',
      'block:politics-toc-v2-u007:b049',
      'block:politics-toc-v2-u007:b050',
    ],
    emphasis: [],
  };
  lessons['DEV-06'].recap = {
    label: '本节结论',
    text: '乡村振兴的总目标是农业农村现代化，总方针是坚持农业农村优先发展，总要求是产业兴旺、生态宜居、乡风文明、治理有效、生活富裕，制度保障是建立健全城乡融合发展体制机制和政策体系，首要任务是确保重要农产品特别是粮食供给。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b049',
      'block:politics-toc-v2-u007:b050',
    ],
    emphasis: [],
  };

  lessons['MOD-01'].scopeLimit = '学习重点：中国梦、中国式现代化与“两步走”是什么关系。不展开中国式现代化的完整内涵。';
  lessons['MOD-01'].sections[1].text = '党的中心任务包括全面建成社会主义现代化强国、实现第二个百年奋斗目标，并以中国式现代化全面推进中华民族伟大复兴。中国式现代化是推进民族复兴的方式。';
  delete lessons['MOD-01'].boundary;
  lessons['MOD-01'].recap = {
    label: '本节结论',
    text: '中国梦说明民族复兴愿景，实现中国梦要走中国道路、弘扬中国精神、凝聚中国力量；中国式现代化说明推进民族复兴的方式；“两步走”说明全面建成社会主义现代化强国的阶段安排，即到2035年基本实现社会主义现代化，到本世纪中叶建成社会主义现代化强国。',
    sourceBlockIds: [
      'block:politics-toc-v2-u004:b002',
      'block:politics-toc-v2-u004:b004',
      'block:politics-toc-v2-u004:b009',
      'block:politics-toc-v2-u004:b013',
      'block:politics-toc-v2-u004:b014',
    ],
    emphasis: [],
  };

  delete lessons['COGNITION-02'].boundary;

  lessons['FOUND-02'].question = '为什么进入新时代不等于越过社会主义初级阶段？';
  lessons['FOUND-02'].objectives = [
    '理解新时代的判断依据',
    '区分社会主要矛盾变化与社会主义初级阶段基本国情不变',
  ];
  lessons['FOUND-02'].scopeLimit = '学习重点：为什么进入新时代不等于越过社会主义初级阶段。不逐项展开新时代的完整内涵。';
  lessons['FOUND-02'].sections = lessons['FOUND-02'].sections.slice(0, 3);
  lessons['FOUND-02'].sections[2].text = '新时代社会主要矛盾发生变化，但我国仍处于并将长期处于社会主义初级阶段的基本国情没有变，世界最大发展中国家的国际地位没有变。判断具体材料时，应区分其说明的是社会主要矛盾、历史阶段还是国际地位，不能由社会主要矛盾变化直接推出基本国情改变。';
  delete lessons['FOUND-02'].boundary;
  lessons['FOUND-02'].recap = {
    label: '本节结论',
    text: '新时代以社会主要矛盾变化为基本依据，同时还体现党的主要任务以及中国同世界关系的新变化。社会主要矛盾与发展阶段是不同判断对象；我国仍处于并将长期处于社会主义初级阶段，所以进入新时代不等于越过社会主义初级阶段。',
    sourceBlockIds: [
      'block:politics-toc-v2-u001:b011',
      'block:politics-toc-v2-u001:b012',
      'block:politics-toc-v2-u001:b013',
      'block:politics-toc-v2-u001:b014',
    ],
    emphasis: [],
  };
  lessons['FOUND-02'].reflection = {
    prompt: lessons['FOUND-02'].question,
    answer: '新时代判断的基本依据是社会主要矛盾发生变化；社会主义初级阶段判断反映的是基本国情，两者是不同判断对象。我国仍处于并将长期处于社会主义初级阶段，因此进入新时代不等于越过社会主义初级阶段。',
    sourceBlockIds: [
      'block:politics-toc-v2-u001:b011',
      'block:politics-toc-v2-u001:b012',
    ],
  };
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
      "  'politics-systematic-user-comprehension-uc7b-p2r3-20261023.json',",
      "  'politics-systematic-user-comprehension-uc7b-p2r3-20261023.json',\n  '" + evidenceName + "',",
    );
    fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
  }

  const ai = optional(files.aiReview);
  const probe = optional(files.runtimeProbe);
  const acceptance = optional(files.userAcceptance);
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
  const acceptancePassed = acceptance?.status === 'passed'
    && acceptance?.curriculumVersion === runtime.curriculumVersion
    && probeLessonIds.every(id => acceptance.lessonIds?.includes(id));
  const evidence = {
    schemaVersion: 1,
    batchId: batch,
    generatedAt: '2026-10-23',
    status: aiPassed && runtimePassed && acceptancePassed
      ? 'candidate-integrated-runtime-and-user-accepted'
      : aiPassed && runtimePassed
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
      'UC7B-P3-BOUNDARY-SEMANTIC-DUPLICATION',
      'UC7B-P3-CONCLUSION-ANSWER-COVERAGE',
      'UC7B-P3-SOURCE-BINDING-WIDTH',
    ],
    contractRules: [17, 21, 23, 27, 29, 31, 32, 33, 34],
    diagnosis: {
      staleFrontendOrCache: false,
      staleAuthoredContent: true,
      auditMethod: '按整页语义相似度召回后，由AI首次用户、学科专家和测评专家逐节裁决。',
      removedBoundaryLessonIds: ['DIALECTICS-01', 'MOD-01', 'COGNITION-02', 'FOUND-02'],
      retainedBoundaryLessonIds: ['DEV-06'],
      conclusionCoverageFixedLessonIds: ['DIALECTICS-01', 'DEV-06', 'MOD-01', 'FOUND-02'],
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
    realUserAcceptance: acceptancePassed ? 'passed' : 'pending',
    userAcceptancePath: acceptancePassed ? files.userAcceptance : null,
    userAcceptanceSha256: acceptancePassed ? digest(files.userAcceptance) : null,
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
