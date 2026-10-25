#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p2r3';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p2r2-20261023.json',
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
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P2R3 must start from P2R2 or its own candidate');
  assert.equal(predecessor.status, 'candidate-integrated-and-runtime-verified');

  const lessonIdsBefore = source.lessons.map(lesson => lesson.id);
  const lessons = {
    'VALUE-02': source.lessons.find(item => item.id === 'VALUE-02'),
    'DEV-03': source.lessons.find(item => item.id === 'DEV-03'),
  };
  assert.ok(Object.values(lessons).every(Boolean), 'missing P2R3 lesson');
  const priorBefore = priorEvidence?.before;
  const before = {
    'VALUE-02': priorBefore?.['VALUE-02'] || priorBefore || snapshot(lessons['VALUE-02']),
    'DEV-03': priorBefore?.['DEV-03'] || snapshot(lessons['DEV-03']),
  };
  lessons['VALUE-02'].sections[0].text = '商品既有使用价值，也有价值。劳动二重性用于进一步说明：生产商品的劳动既是具体劳动，又是抽象劳动。';
  lessons['VALUE-02'].sections[0].sourceBlockIds = [
    'block:politics-toc-v2-u033:b003',
    'block:politics-toc-v2-u034:b002',
  ];
  delete lessons['VALUE-02'].boundary;

  Object.assign(lessons['DEV-03'], {
    question: '新发展格局的基本内容和构建要求是什么？',
    objectives: ['理解新发展格局的基本内容、基础、关键与本质特征'],
    scopeLimit: '学习重点：新发展格局的基本内容和构建要求。不展开具体产业与贸易措施。',
  });
  lessons['DEV-03'].sections[0] = {
    ...lessons['DEV-03'].sections[0],
    label: '国内大循环与国内国际双循环',
    text: '新发展格局以国内大循环为主体、国内国际双循环相互促进。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b015'],
  };
  lessons['DEV-03'].sections[1] = {
    ...lessons['DEV-03'].sections[1],
    label: '全国统一大市场与经济循环',
    text: '全国统一大市场是构建新发展格局的基础支撑和内在要求，关键在于经济循环畅通无阻。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b018',
      'block:politics-toc-v2-u007:b019',
    ],
  };
  lessons['DEV-03'].sections[2] = {
    ...lessons['DEV-03'].sections[2],
    label: '发展主动权与自立自强',
  };
  lessons['DEV-03'].boundary = {
    ...lessons['DEV-03'].boundary,
    label: '国内大循环不是地方自我循环',
    sourceBlockIds: ['block:politics-toc-v2-u007:b017'],
  };
  lessons['DEV-03'].recap = {
    label: '本节结论',
    text: '新发展格局以国内大循环为主体、国内国际双循环相互促进；全国统一大市场是基础支撑和内在要求，关键在畅通经济循环，最本质特征是实现高水平自立自强。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b015',
      'block:politics-toc-v2-u007:b018',
      'block:politics-toc-v2-u007:b019',
      'block:politics-toc-v2-u007:b020',
    ],
    emphasis: [],
  };
  lessons['DEV-03'].reflection = {
    prompt: '新发展格局的基本内容和构建要求是什么？',
    answer: '基本内容是以国内大循环为主体、国内国际双循环相互促进；构建时要建设全国统一大市场、畅通经济循环并提高自立自强水平。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b015',
      'block:politics-toc-v2-u007:b018',
      'block:politics-toc-v2-u007:b019',
      'block:politics-toc-v2-u007:b020',
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
      "  'politics-systematic-user-comprehension-uc7b-p2r2-20261023.json',",
      "  'politics-systematic-user-comprehension-uc7b-p2r2-20261023.json',\n  '" + evidenceName + "',",
    );
    fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
  }

  const ai = optional(files.aiReview);
  const probe = optional(files.runtimeProbe);
  const acceptance = optional(files.userAcceptance);
  const sourceHash = sha256(Buffer.from(sourceText));
  const probeLessonIds = ['VALUE-02', 'DEV-03'];
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
    contentChangedLessonIds: ['VALUE-02', 'DEV-03'],
    uiProjectionAffectedLessonIds: ['VALUE-02', 'DEV-03'],
    probeLessonIds,
    issueIds: ['UC7B-P2R3-VALUE-02-SEMANTIC-DUPLICATION', 'UC7B-P2R3-STALE-BOUNDARY-NOT-CLEARED', 'UC7B-P2R3-DEV-03-MAIN-ANSWER-DRIFT'],
    contractRules: [21, 23, 27, 29, 31, 32, 33, 34],
    diagnosis: {
      staleFrontendOrCache: false,
      staleAuthoredContent: true,
      executionDeviation: 'P2R1缩短旧辨析后继续保留，且第一段仍重复同一误解，违反第27、29条。',
      repeatedClaimLocationsBefore: ['section-01', 'section-03', 'boundary', 'recap-positive-form'],
      retainedClaimLocationsAfter: ['section-03', 'recap-positive-form'],
      controlPageFinding: 'DEV-03边界应保留，但旧结论未回答核心设问且含跨节编排语言，违反第21、23、32条。',
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
