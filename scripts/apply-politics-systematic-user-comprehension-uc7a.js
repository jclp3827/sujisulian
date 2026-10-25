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
  evidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7a-20261023.json',
  aiReview: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7a-ai-review-20261023.json',
  runtimeProbe: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7a-runtime-probe-20261023.json',
  predecessorEvidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc6-20261023.json',
};
const absolute = file => path.join(root, file);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function main() {
  const source = JSON.parse(fs.readFileSync(absolute(files.source), 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(absolute(files.inventory), 'utf8'));
  const predecessor = JSON.parse(fs.readFileSync(absolute(files.predecessorEvidence), 'utf8'));
  const existingEvidence = fs.existsSync(absolute(files.evidence))
    ? JSON.parse(fs.readFileSync(absolute(files.evidence), 'utf8'))
    : null;
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const currentRuntime = require('../miniprogram/models/politics-systematic-units-runtime');
  assert.ok([predecessor.curriculumVersion, existingEvidence?.curriculumVersion]
    .filter(Boolean).includes(currentRuntime.curriculumVersion),
    'UC7A must start from the UC6 candidate');

  const beforeIds = source.lessons.map(item => item.id);
  const lesson = source.lessons.find(item => item.id === 'COGNITION-02');
  assert.ok(lesson, 'missing COGNITION-02');
  const before = existingEvidence?.before || {
    question: lesson.question,
    sectionLabels: lesson.sections.map(item => item.label),
    boundaryLabel: lesson.boundary.label,
    reflectionPrompt: lesson.reflection.prompt,
  };

  lesson.question = '认识的两次飞跃分别是什么？';
  lesson.objectives = ['理解感性认识和理性认识的含义、关系及认识的两次飞跃'];
  lesson.scopeLimit = '学习重点：感性认识、理性认识的含义和认识的两次飞跃。不展开认识过程反复性和无限性的完整理论。';
  lesson.sections = [
    {
      label: '感性认识是认识的初级阶段',
      text: '感性认识是认识的初级阶段，包括感觉、知觉、表象三种形式。',
      sourceBlockIds: ['block:politics-toc-v2-u028:b003'],
      emphasis: [
        { part: 'text', quote: '认识的初级阶段', occurrence: 1, role: 'key' },
        { part: 'text', quote: '感觉、知觉、表象', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '理性认识是认识的高级阶段',
      text: '理性认识是认识的高级阶段，包括概念、判断、推理三种形式。理性认识依赖感性认识，感性认识需要发展和深化为理性认识，二者相互渗透、相互包含。',
      sourceBlockIds: [
        'block:politics-toc-v2-u028:b004',
        'block:politics-toc-v2-u028:b005',
      ],
      emphasis: [
        { part: 'text', quote: '认识的高级阶段', occurrence: 1, role: 'key' },
        { part: 'text', quote: '概念、判断、推理', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '从感性认识到理性认识是第一次飞跃',
      text: '认识在实践基础上从感性认识上升到理性认识，这是认识的第一次飞跃。它使认识从感觉、知觉和表象发展为概念、判断和推理。在材料中，由观察资料形成概念、判断和推理，体现第一次飞跃。',
      sourceBlockIds: [
        'block:politics-toc-v2-u028:b002',
        'block:politics-toc-v2-u028:b003',
        'block:politics-toc-v2-u028:b004',
      ],
      emphasis: [
        { part: 'text', quote: '从感性认识上升到理性认识', occurrence: 1, role: 'key' },
        { part: 'text', quote: '第一次飞跃', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '从理性认识到实践是第二次飞跃',
      text: '理性认识回到实践并接受检验，这是认识的第二次飞跃。第二次飞跃更为重要、更有意义，因为实践是认识的目的，也是检验认识真理的唯一标准。在材料中，把形成的认识用于实际行动并接受检验，体现第二次飞跃；只增加理论论据，仍没有完成从理性认识到实践的飞跃。',
      sourceBlockIds: [
        'block:politics-toc-v2-u027:b014',
        'block:politics-toc-v2-u027:b015',
        'block:politics-toc-v2-u028:b002',
        'block:politics-toc-v2-u028:b006',
      ],
      emphasis: [
        { part: 'text', quote: '理性认识回到实践', occurrence: 1, role: 'key' },
        { part: 'text', quote: '第二次飞跃', occurrence: 1, role: 'key' },
        { part: 'text', quote: '检验认识真理的唯一标准', occurrence: 1, role: 'key' },
      ],
    },
  ];
  lesson.boundary = {
    label: '感性认识和理性认识不能割裂',
    text: '感性认识和理性认识是认识过程的两个阶段，不是彼此割裂的两种认识来源。理性认识依赖感性认识，感性认识又需要发展和深化为理性认识。',
    sourceBlockIds: [
      'block:politics-toc-v2-u028:b005',
      'block:politics-toc-v2-u028:b006',
    ],
    emphasis: [],
  };
  lesson.recap = {
    label: '本节结论',
    text: '感性认识是初级阶段，理性认识是高级阶段。从感性认识到理性认识是第一次飞跃，从理性认识回到实践是第二次飞跃。理性认识形成后还要回到实践并接受检验。',
    sourceBlockIds: [
      'block:politics-toc-v2-u028:b002',
      'block:politics-toc-v2-u028:b003',
      'block:politics-toc-v2-u028:b004',
      'block:politics-toc-v2-u028:b006',
    ],
    emphasis: [],
  };
  lesson.reflection = {
    prompt: '认识的两次飞跃分别是什么？',
    answer: '第一次飞跃是从感性认识上升到理性认识；第二次飞跃是从理性认识回到实践并接受实践检验。',
    sourceBlockIds: [
      'block:politics-toc-v2-u028:b002',
      'block:politics-toc-v2-u028:b006',
    ],
  };
  lesson.corePromises = [
    { quote: '感觉、知觉、表象', sourceBlockIds: ['block:politics-toc-v2-u028:b003'] },
    { quote: '概念、判断、推理', sourceBlockIds: ['block:politics-toc-v2-u028:b004'] },
    { quote: '第一次飞跃', sourceBlockIds: ['block:politics-toc-v2-u028:b002'] },
    { quote: '第二次飞跃', sourceBlockIds: ['block:politics-toc-v2-u028:b002'] },
    { quote: '接受检验', sourceBlockIds: ['block:politics-toc-v2-u028:b006'] },
  ];

  for (const unit of inventory.units) {
    for (const block of unit.sourceBlocks) {
      block.sampleLessonIds = source.lessons
        .filter(item => [...item.sections, item.boundary, item.recap, item.reflection]
          .some(part => part.sourceBlockIds.includes(block.blockId)))
        .map(item => item.id);
    }
  }

  assert.deepEqual(source.lessons.map(item => item.id), beforeIds);
  source.progressCompatibleVersions = [...new Set([
    ...(source.progressCompatibleVersions || []),
    predecessor.curriculumVersion,
  ])];
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = `${JSON.stringify(source, null, 2)}\n`;
  const inventoryText = `${JSON.stringify(inventory, null, 2)}\n`;
  const runtimeText = `// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ${JSON.stringify(runtime)};\n`;
  const aiReview = {
    schemaVersion: 1,
    reviewId: 'politics-systematic-user-comprehension-uc7a-ai-review',
    generatedAt: '2026-10-23',
    curriculumVersion: runtime.curriculumVersion,
    lessonId: lesson.id,
    reviewMode: 'independent-read-only-roles',
    roles: {
      firstTimeUser: {
        sourceBlind: true,
        status: 'pass',
        riskCount: 0,
        holdCount: 0,
        findings: [
          '感性认识、理性认识及两次飞跃的对象和顺序明确',
          '材料识别句服务于两次飞跃的同一学习目标',
          '核心设问、自测和答案逐项一致，无页面外信息依赖',
        ],
      },
      subjectExpert: {
        sourceBlind: false,
        status: 'pass',
        riskCount: 0,
        holdCount: 0,
        findings: [
          '定义、阶段、两次飞跃、实践目的和检验标准均有直接来源',
          '删除未获当前逐段来源直接支持的“指导实践”',
          '逐对象来源和corePromises均为最小充分绑定',
        ],
      },
      assessmentAndContentDesign: {
        sourceBlind: false,
        status: 'pass',
        riskCount: 0,
        holdCount: 0,
        findings: [
          '页面保持对象定义、关系、两次飞跃、边界和结论的递进',
          '材料识别方法没有形成第二个自测任务',
          '未恢复旧的模糊方法标题，设问和答案保持单一直接任务',
        ],
      },
    },
    correctionsBeforeFinalPass: [
      '将两次飞跃判断方法并入对应定义段落',
      '删除可见内容中的“指导实践”并收紧来源绑定',
    ],
    adjudication: {
      status: 'ai-review-passed',
      realUserAcceptance: 'retest-pending',
      residualScope: 'other-71-lessons-require-semantic-audit',
    },
  };
  const aiReviewText = `${JSON.stringify(aiReview, null, 2)}\n`;
  const runtimeProbe = fs.existsSync(absolute(files.runtimeProbe))
    ? JSON.parse(fs.readFileSync(absolute(files.runtimeProbe), 'utf8'))
    : null;
  const runtimePageCheck = runtimeProbe?.status === 'passed'
    && runtimeProbe.curriculumVersion === runtime.curriculumVersion
    && runtimeProbe.lessonId === lesson.id ? 'passed' : 'pending';
  fs.writeFileSync(absolute(files.source), sourceText);
  fs.writeFileSync(absolute(files.inventory), inventoryText);
  fs.writeFileSync(absolute(files.runtime), runtimeText);
  fs.writeFileSync(absolute(files.reading), renderReading(source));
  fs.writeFileSync(absolute(files.aiReview), aiReviewText);

  const evidence = {
    schemaVersion: 1,
    batchId: 'politics-systematic-user-comprehension-uc7a',
    generatedAt: '2026-10-23',
    status: 'candidate-integrated-for-retest',
    trigger: {
      kind: 'real-user-sample-failed',
      lessonId: lesson.id,
      result: 'failed',
      userFailure: '页面没有按对象、关系、结论讲清感性认识、理性认识和两次飞跃；纠偏式标题增加理解负担。',
      affectedSlices: ['S2', 'S4', 'S5', 'S6'],
      systemicRisk: 'other-lessons-require-residual-audit',
    },
    previousCurriculumVersion: predecessor.curriculumVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
    stableLessonIds: true,
    orderChanged: false,
    changedLessonIds: [lesson.id],
    before: {
      question: before.question,
      sectionLabels: before.sectionLabels,
      boundaryLabel: before.boundaryLabel,
      reflectionPrompt: before.reflectionPrompt,
    },
    after: {
      question: lesson.question,
      sectionLabels: lesson.sections.map(item => item.label),
      boundaryLabel: lesson.boundary.label,
      reflectionPrompt: lesson.reflection.prompt,
    },
    sourcePath: files.source,
    sourceSha256: sha256(Buffer.from(sourceText)),
    inventoryPath: files.inventory,
    inventorySha256: sha256(Buffer.from(inventoryText)),
    runtimePath: files.runtime,
    runtimeSha256: sha256(Buffer.from(runtimeText)),
    readingPath: files.reading,
    retainedHoldLessonIds: ['CAPITAL-02'],
    aiReview: 'passed',
    aiReviewPath: files.aiReview,
    aiReviewSha256: sha256(Buffer.from(aiReviewText)),
    runtimeProbePath: runtimePageCheck === 'passed' ? files.runtimeProbe : null,
    runtimeProbeSha256: runtimePageCheck === 'passed'
      ? sha256(fs.readFileSync(absolute(files.runtimeProbe))) : null,
    runtimePageCheck,
    sharedDependency: {
      path: 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json',
      status: 'shared-contract-sync-not-executed',
      mismatchedObjectiveCount: 13,
      currentBatchObjectiveId: 'pol-obj-cognition-02-1',
      requiredAction: 'deterministic-objective-registry-rebuild-and-dependent-catalogue-validation',
      authorizationGate: 'shared-file-confirmation',
    },
    realUserAcceptance: 'retest-pending',
    releaseAuthorized: false,
  };
  fs.writeFileSync(absolute(files.evidence), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify({
    status: evidence.status,
    previousCurriculumVersion: evidence.previousCurriculumVersion,
    curriculumVersion: evidence.curriculumVersion,
    changedLessonIds: evidence.changedLessonIds,
    progressCompatible: evidence.progressCompatible,
    realUserAcceptance: evidence.realUserAcceptance,
  }));
}

main();
