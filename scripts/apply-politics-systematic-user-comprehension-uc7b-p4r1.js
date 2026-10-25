#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p4r1';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p4-20261023.json',
  feedback: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p4-user-acceptance-20261024.json',
  evidence: evidenceRoot + batch + '-20261024.json',
  aiReview: evidenceRoot + batch + '-ai-review-20261024.json',
  runtimeProbe: evidenceRoot + batch + '-runtime-probe-20261024.json',
  acceptance: evidenceRoot + batch + '-user-acceptance-20261024.json',
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
  const feedback = read(files.feedback);
  const priorEvidence = optional(files.evidence);
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const previousRuntime = require('../miniprogram/models/politics-systematic-units-runtime');
  assert.ok([predecessor.curriculumVersion, priorEvidence?.curriculumVersion]
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P4R1 must start from P4 or its own candidate');
  assert.equal(predecessor.status, 'candidate-integrated-and-runtime-verified');
  assert.equal(feedback.status, 'partial');
  assert.deepEqual(feedback.revisionRequiredLessonIds, ['DEV-01']);

  const lessonIdsBefore = source.lessons.map(item => item.id);
  const lesson = source.lessons.find(item => item.id === 'DEV-01');
  assert.ok(lesson, 'missing DEV-01');
  const before = priorEvidence?.before || snapshot(lesson);

  lesson.question = '新发展阶段和高质量发展分别是什么？';
  lesson.objectives = ['理解新发展阶段和高质量发展的含义与区别'];
  lesson.scopeLimit = '学习重点：新发展阶段和高质量发展分别是什么。不展开新发展理念的具体内容。';
  lesson.sections = [
    {
      label: '新发展阶段的含义',
      text: '新发展阶段是全面建成小康社会、实现第一个百年奋斗目标之后，全面建设社会主义现代化国家、向第二个百年奋斗目标进军的重要阶段，也是从站起来、富起来到强起来历史性跨越的新阶段。新发展阶段仍属于社会主义初级阶段，我国仍处于并将长期处于社会主义初级阶段的基本国情没有变。',
      sourceBlockIds: [
        'block:politics-toc-v2-u007:b005',
        'block:politics-toc-v2-u007:b006',
        'block:politics-toc-v2-u007:b007',
        'block:politics-toc-v2-u001:b012',
      ],
      emphasis: [],
    },
    {
      label: '高质量发展的含义',
      text: '高质量发展是全面建设社会主义现代化国家的首要任务，是我国经济社会发展的主题。它强调能够很好满足人民日益增长的美好生活需要的发展，是体现新发展理念的发展，推动发展从“有没有”转向“好不好”。',
      sourceBlockIds: [
        'block:politics-toc-v2-u007:b002',
        'block:politics-toc-v2-u007:b003',
      ],
      emphasis: [
        { part: 'text', quote: '高质量发展', occurrence: 1, role: 'key' },
        { part: 'text', quote: '有没有', occurrence: 1, role: 'key' },
        { part: 'text', quote: '好不好', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '新发展阶段与高质量发展的区别',
      text: '新发展阶段说明我国发展所处的历史方位，回答当前处在什么发展阶段；高质量发展说明发展主题和质量要求，回答要实现什么样的发展。',
      sourceBlockIds: [
        'block:politics-toc-v2-u007:b002',
        'block:politics-toc-v2-u007:b003',
        'block:politics-toc-v2-u007:b057',
      ],
      emphasis: [],
    },
  ];
  delete lesson.boundary;
  lesson.recap = {
    label: '本节结论',
    text: '新发展阶段是全面建设社会主义现代化国家、向第二个百年奋斗目标进军的重要阶段，仍属于社会主义初级阶段；高质量发展是全面建设社会主义现代化国家的首要任务，是我国经济社会发展的主题，强调发展从“有没有”转向“好不好”。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b002',
      'block:politics-toc-v2-u007:b003',
      'block:politics-toc-v2-u007:b005',
      'block:politics-toc-v2-u007:b007',
    ],
    emphasis: [],
  };
  lesson.reflection = {
    prompt: lesson.question,
    answer: '新发展阶段是我国全面建设社会主义现代化国家、向第二个百年奋斗目标进军的阶段，仍是社会主义初级阶段中的一个阶段。高质量发展是能够很好满足人民日益增长的美好生活需要、体现新发展理念的发展，强调从“有没有”转向“好不好”。',
    sourceBlockIds: [
      'block:politics-toc-v2-u007:b003',
      'block:politics-toc-v2-u007:b005',
      'block:politics-toc-v2-u007:b007',
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
  const evidenceName = batch + '-20261024.json';
  if (!lineage.includes(evidenceName)) {
    lineage = lineage.replace(
      "  'politics-systematic-user-comprehension-uc7b-p4-20261023.json',",
      "  'politics-systematic-user-comprehension-uc7b-p4-20261023.json',\n  '" + evidenceName + "',",
    );
    fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
  }

  const ai = optional(files.aiReview);
  const probe = optional(files.runtimeProbe);
  const acceptance = optional(files.acceptance);
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
    && probe.lessonIds?.includes('DEV-01');
  const userAccepted = acceptance?.status === 'passed'
    && acceptance?.curriculumVersion === runtime.curriculumVersion
    && acceptance?.lessonIds?.length === 1
    && acceptance.lessonIds[0] === 'DEV-01';
  const evidence = {
    schemaVersion: 1,
    batchId: batch,
    generatedAt: '2026-10-24',
    status: aiPassed && runtimePassed && userAccepted
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
    contentChangedLessonIds: ['DEV-01'],
    uiProjectionAffectedLessonIds: ['DEV-01'],
    probeLessonIds: ['DEV-01'],
    issueIds: ['UC7B-P4R1-AMBIGUOUS-SECTION-TITLE', 'UC7B-P4R1-DEFINITION-BOUNDARY-SPLIT', 'UC7B-P4R1-QUESTION-LEVEL-DRIFT'],
    contractRules: [13, 14, 17, 23, 27, 29, 32, 34, 35],
    diagnosis: {
      productRuleGap: '既有规则要求直接设问和知识标题，但未明确区分定义题的“是什么”与元层级的“说明什么”。',
      executionDeviation: '稳定定义限定被单列为辨析，裸“质量”标题也未完整命名知识对象。',
      boundaryDecision: '删除独立辨析，将社会主义初级阶段限定并入新发展阶段定义正文。',
    },
    predecessorUserFeedbackPath: files.feedback,
    predecessorUserFeedbackSha256: digest(files.feedback),
    passedPredecessorLessonIds: feedback.passedLessonIds,
    before,
    after: snapshot(lesson),
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
    realUserAcceptance: userAccepted ? 'passed' : 'pending',
    userAcceptancePath: userAccepted ? files.acceptance : null,
    userAcceptanceSha256: userAccepted ? digest(files.acceptance) : null,
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
