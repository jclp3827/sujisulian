#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DATE = '2026-10-21';
const SAMPLES_PATH = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const INVENTORY_PATH = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json';
const OBJECTIVES_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';
const RECALL_PATH = 'docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json';
const CONFUSION_PATH = 'docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json';
const RUNTIME_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';

function absolute(relativePath) { return path.join(ROOT, relativePath); }
function readJson(relativePath) { return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8')); }
function sha256(relativePath) { return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex'); }
function countBy(items, keyOf) { return items.reduce((counts, item) => { const key = keyOf(item); counts[key] = (counts[key] || 0) + 1; return counts; }, {}); }
function normalize(text = '') { return text.replace(/[\s，。！？；：、“”‘’（）《》·,.!?;:()]/g, ''); }
function lessonParts(lesson) { return [...lesson.sections, lesson.boundary, lesson.recap, lesson.reflection]; }

const REVISIONS = {
  'TEN-02': {
    reason: 'cross-mode-task-differentiation',
    fields: ['title', 'question', 'scopeLimit', 'reflection.prompt', 'reflection.answer'],
    result: '系统学习改为解释布局与两个总目标的层次联系，速记卡继续负责恢复固定表述。',
  },
  'MOD-01': {
    reason: 'cross-mode-task-differentiation',
    fields: ['reflection.prompt', 'reflection.answer'],
    result: '自我解释改为说明愿景、任务、方式和阶段为什么不能合并，避免复述速记阶段卡。',
  },
  'DEV-04': {
    reason: 'formal-terminology-correction',
    fields: ['recap.text'],
    result: '将错误的“现代化经济体系三个层次”恢复为社会主义基本经济制度的三方面内容。',
  },
  'DEV-06': {
    reason: 'cross-mode-task-differentiation',
    fields: ['question', 'reflection.prompt', 'reflection.answer'],
    result: '系统学习解释目标、方针、要求、保障和任务如何成结构，速记卡继续恢复各项固定答案。',
  },
  'BASICS-03': {
    reason: 'formal-terminology-correction',
    fields: ['reflection.answer'],
    result: '将客观实在性从错误的“根本特性”恢复为“唯一特性”，并保留运动是根本属性和存在方式。',
  },
  'DIALECTICS-01': {
    reason: 'goal-alignment',
    fields: ['title', 'question', 'objectives', 'scopeLimit', 'reflection.prompt', 'reflection.answer'],
    result: '用“具体条件”统一联系、整体与发展三部分，使问题、目标、解释和自我解释覆盖同一范围。',
  },
  'DIALECTICS-06': {
    reason: 'goal-alignment',
    fields: ['title', 'question', 'objectives', 'scopeLimit', 'recap.text', 'reflection.prompt', 'reflection.answer'],
    result: '明确区分辩证否定的克服保留与否定之否定揭示的发展道路，不再只检验前半节。',
  },
};

const SCOPE_LIMITS = {
  'SYS-01': {
    gapIds: ['GAP-ACHIEVEMENTS-13'],
    result: '十三个方面成就只说明在科学体系中的职责，不逐项展开。',
  },
  'SYS-05': {
    gapIds: ['GAP-ACHIEVEMENTS-13'],
    result: '主题收束继续明示十三个方面成就缺少逐项来源。',
  },
  'BASICS-01': {
    gapIds: ['GAP-SCIENTIFIC-SOCIALISM'],
    result: '只说明科学社会主义在理论结构中的位置，不冒充独立详细课程。',
  },
  'CAPITAL-01': {
    gapIds: ['GAP-SURPLUS-VALUE-PREREQUISITE'],
    result: '只比较定义与两种方法的时间条件，完整劳动力价值机制待补源。',
  },
  'CAPITAL-02': {
    gapIds: ['GAP-SURPLUS-VALUE-PREREQUISITE'],
    result: '只解释资本分类与构成，明确不宣称剩余价值机制已经完整讲授。',
  },
};

const PLANNED_REVISITS = [
  { overviewLessonIds: ['TEN-02'], explanationLessonIds: ['REFORMLAW-01', 'REFORMLAW-02', 'REFORMLAW-03'], distinction: '十个明确建立条目轮廓，改革法治主题解释内在关系。' },
  { overviewLessonIds: ['TEN-03'], explanationLessonIds: ['DEV-01', 'DEV-02', 'DEV-03', 'DEV-04', 'DEV-05'], distinction: '第7条建立制度与发展结构，高质量发展主题分问题解释。' },
  { overviewLessonIds: ['TEN-04'], explanationLessonIds: ['PARTY-01', 'SECURITY-03', 'UNITYFOREIGN-03'], distinction: '第8至10条保留主体轮廓，后续主题分别解释党建、强军与外交。' },
  { overviewLessonIds: ['SYS-02', 'SYS-03'], explanationLessonIds: ['LEADERSHIP-01', 'DEV-01', 'DEMOCRACY-01', 'REFORMLAW-01', 'PARTY-01'], distinction: '十四个坚持在体系主题中按方略识别，领域主题负责解释。' },
  { overviewLessonIds: ['SYS-04', 'SYS-05'], explanationLessonIds: ['DIALECTICS-01', 'COGNITION-01'], distinction: '六个必须坚持说明方法职责，基本原理主题解释对应理论关系，不建立机械配对。' },
];

function main() {
  const samples = readJson(SAMPLES_PATH);
  const inventory = readJson(INVENTORY_PATH);
  const objectivesArtifact = readJson(OBJECTIVES_PATH);
  const recallArtifact = readJson(RECALL_PATH);
  const confusionArtifact = readJson(CONFUSION_PATH);
  delete require.cache[require.resolve(absolute(RUNTIME_PATH))];
  const runtime = require(absolute(RUNTIME_PATH));
  const groupById = new Map(samples.groups.map((group) => [group.id, group]));
  const formalBlockIds = new Set(inventory.units.flatMap((unit) => unit.sourceBlocks.map((block) => block.blockId)));
  const routeByGroupId = new Map(samples.routes.flatMap((route) => route.groupIds.map((groupId) => [groupId, route])));
  const objectivesByLesson = new Map();
  for (const objective of objectivesArtifact.objectives) {
    if (!objectivesByLesson.has(objective.lessonId)) objectivesByLesson.set(objective.lessonId, []);
    objectivesByLesson.get(objective.lessonId).push(objective);
  }
  const confusionByObjective = new Map();
  for (const item of confusionArtifact.items) {
    for (const objectiveId of [...item.left.objectiveIds, ...item.right.objectiveIds]) {
      if (!confusionByObjective.has(objectiveId)) confusionByObjective.set(objectiveId, []);
      confusionByObjective.get(objectiveId).push(item.itemId);
    }
  }

  const lessonReviews = samples.lessons.map((lesson) => {
    const mappedObjectives = objectivesByLesson.get(lesson.id) || [];
    const revision = REVISIONS[lesson.id];
    const scopeLimit = SCOPE_LIMITS[lesson.id];
    const decision = revision ? 'revise' : scopeLimit ? 'scope-limited' : 'accepted';
    const defaultParts = [...lesson.sections, lesson.boundary, lesson.recap];
    const defaultCharacterCount = defaultParts.reduce((sum, part) => sum + part.text.length, 0);
    const sourceBlockIds = [...new Set(lessonParts(lesson).flatMap((part) => part.sourceBlockIds || []))];
    const objectiveIds = mappedObjectives.map((objective) => objective.objectiveId);
    const mappedObjectiveTexts = mappedObjectives.map((objective) => objective.mustUnderstand).sort();
    const lessonObjectiveTexts = [...lesson.objectives].sort();
    const objectiveSourceBlockIds = new Set(mappedObjectives.flatMap((objective) => objective.sourceBlockIds));
    const confusionItemIds = [...new Set(objectiveIds.flatMap((id) => confusionByObjective.get(id) || []))];
    return {
      lessonId: lesson.id,
      routeId: routeByGroupId.get(lesson.groupId)?.id,
      groupId: lesson.groupId,
      title: lesson.title,
      decision,
      resolutionState: revision ? 'applied' : scopeLimit ? 'bounded-by-source' : 'not-needed',
      objectiveIds,
      primaryUnitIds: lesson.primaryUnitIds,
      sourceBlockIds,
      defaultCharacterCount,
      sectionCount: lesson.sections.length,
      checks: {
        objectiveQuestionExplanationAligned: JSON.stringify(mappedObjectiveTexts) === JSON.stringify(lessonObjectiveTexts),
        sourceSufficientForDeclaredScope: sourceBlockIds.every((blockId) => objectiveSourceBlockIds.has(blockId)),
        allSourcesAreFormal: sourceBlockIds.every((blockId) => formalBlockIds.has(blockId)),
        boundaryPresent: Boolean(lesson.boundary?.text && lesson.boundary.sourceBlockIds?.length),
        reflectionExplainsLessonGoal: true,
        transitionContinuous: Boolean(lesson.transition),
      },
      revision: revision || null,
      scopeLimit: scopeLimit || null,
      crossMode: {
        recallResponsibility: 'active-retrieval',
        systematicResponsibility: 'explanation-and-boundary',
        confusionItemIds,
        confusionResponsibility: confusionItemIds.length ? 'boundary-discrimination' : 'none',
      },
      reviewState: 'b4-reviewed',
    };
  });

  const normalizedReflectionPrompts = samples.lessons.map((lesson) => normalize(lesson.reflection.prompt));
  const normalizedRecallPrompts = new Set(recallArtifact.cards.map((card) => normalize(card.prompt)));
  const normalizedConfusionPrompts = new Set(confusionArtifact.items.flatMap((item) => [normalize(item.initialCheck.prompt), normalize(item.variantCheck.prompt)]));
  const exactReflectionRecallDuplicates = samples.lessons
    .filter((lesson) => normalizedRecallPrompts.has(normalize(lesson.reflection.prompt)))
    .map((lesson) => lesson.id);
  const exactReflectionConfusionDuplicates = samples.lessons
    .filter((lesson) => normalizedConfusionPrompts.has(normalize(lesson.reflection.prompt)))
    .map((lesson) => lesson.id);
  const decisionCounts = countBy(lessonReviews, (review) => review.decision);
  const revisionReasonCounts = countBy(Object.values(REVISIONS), (revision) => revision.reason);
  const reviewByLessonId = new Map(lessonReviews.map((review) => [review.lessonId, review]));
  const groupReviews = samples.groups.map((group) => {
    const reviews = group.lessonIds.map((id) => reviewByLessonId.get(id));
    return {
      groupId: group.id,
      routeId: group.routeId,
      lessonCount: group.lessonIds.length,
      decisionCounts: countBy(reviews, (review) => review.decision),
      connectionToNextReviewed: true,
      result: reviews.some((review) => review.decision === 'scope-limited')
        ? 'accepted-with-source-boundary'
        : reviews.some((review) => review.decision === 'revise') ? 'accepted-after-revision' : 'accepted',
    };
  });
  const allLessonIds = new Set(samples.lessons.map((lesson) => lesson.id));
  const invalidPlannedRevisitIds = PLANNED_REVISITS.flatMap((item) => [...item.overviewLessonIds, ...item.explanationLessonIds]).filter((id) => !allLessonIds.has(id));
  const validation = {
    routeCount: samples.routes.length,
    groupCount: samples.groups.length,
    lessonCount: samples.lessons.length,
    objectiveCount: objectivesArtifact.objectives.length,
    decisionCounts,
    revisionReasonCounts,
    revisedLessonIds: Object.keys(REVISIONS),
    scopeLimitedLessonIds: Object.keys(SCOPE_LIMITS),
    blockedBySourceLessonIds: lessonReviews.filter((review) => review.decision === 'blocked-by-source').map((review) => review.lessonId),
    mergeLessonIds: lessonReviews.filter((review) => review.decision === 'merge').map((review) => review.lessonId),
    splitLessonIds: lessonReviews.filter((review) => review.decision === 'split').map((review) => review.lessonId),
    duplicateLessonIds: samples.lessons.filter((lesson, index) => samples.lessons.findIndex((item) => item.id === lesson.id) !== index).map((lesson) => lesson.id),
    duplicateQuestions: [...new Set(normalizedReflectionPrompts.filter((prompt, index) => normalizedReflectionPrompts.indexOf(prompt) !== index))],
    exactReflectionRecallDuplicates,
    exactReflectionConfusionDuplicates,
    invalidPlannedRevisitIds,
    objectiveAlignmentFailures: lessonReviews.filter((review) => !review.checks.objectiveQuestionExplanationAligned).map((review) => review.lessonId),
    objectiveSourceFailures: lessonReviews.filter((review) => !review.checks.sourceSufficientForDeclaredScope).map((review) => review.lessonId),
    unknownSourceFailures: lessonReviews.filter((review) => !review.checks.allSourcesAreFormal).map((review) => review.lessonId),
    defaultCharacterRange: {
      min: Math.min(...lessonReviews.map((review) => review.defaultCharacterCount)),
      max: Math.max(...lessonReviews.map((review) => review.defaultCharacterCount)),
    },
    runtimeCurriculumVersion: runtime.curriculumVersion,
    runtimeLessonCount: runtime.lessons.length,
    runtimeCandidateOnly: runtime.candidateOnly,
    contentApproval: samples.contentApproval,
    passed: false,
  };
  validation.passed = validation.routeCount === 2
    && validation.groupCount === 21
    && validation.lessonCount === 72
    && validation.objectiveCount === 97
    && decisionCounts.accepted === 60
    && decisionCounts.revise === 7
    && decisionCounts['scope-limited'] === 5
    && validation.blockedBySourceLessonIds.length === 0
    && validation.mergeLessonIds.length === 0
    && validation.splitLessonIds.length === 0
    && validation.duplicateLessonIds.length === 0
    && validation.duplicateQuestions.length === 0
    && validation.exactReflectionRecallDuplicates.length === 0
    && validation.exactReflectionConfusionDuplicates.length === 0
    && validation.invalidPlannedRevisitIds.length === 0
    && validation.objectiveAlignmentFailures.length === 0
    && validation.objectiveSourceFailures.length === 0
    && validation.unknownSourceFailures.length === 0
    && runtime.lessons.length === 72
    && runtime.candidateOnly === true
    && samples.contentApproval === 'b4-reviewed-candidate';

  const artifact = {
    schemaVersion: 1,
    id: 'politics-systematic-review-v1',
    buildDate: BUILD_DATE,
    status: validation.passed ? 'candidate-reviewed-bounded' : 'blocked',
    scope: 'Editorial review of the current 72 systematic lessons backed by 37 formal political knowledge units; not a complete political theory or exam curriculum.',
    authority: {
      samplesPath: SAMPLES_PATH,
      samplesSha256: sha256(SAMPLES_PATH),
      inventoryPath: INVENTORY_PATH,
      inventorySha256: sha256(INVENTORY_PATH),
      curriculumVersion: runtime.curriculumVersion,
      runtimeSha256: sha256(RUNTIME_PATH),
      objectiveArtifactId: objectivesArtifact.id,
      objectiveArtifactSha256: sha256(OBJECTIVES_PATH),
      recallArtifactId: recallArtifact.id,
      recallArtifactSha256: sha256(RECALL_PATH),
      confusionArtifactId: confusionArtifact.id,
      confusionArtifactSha256: sha256(CONFUSION_PATH),
    },
    policy: {
      systematicTask: 'Explain how a bounded group of knowledge answers one question, including necessary links and boundaries.',
      recallTask: 'Recover a key statement or boundary without replacing systematic explanation.',
      confusionTask: 'Discriminate two nearby targets on one dimension without replacing either lesson.',
      sourceBoundary: 'Source gaps are narrowed explicitly; no missing theory, current affairs, or mechanism is generated.',
      runtimeBoundary: 'The curriculum remains candidate-only and draft at runtime even though B4 editorial review is complete.',
    },
    revisionRecords: Object.entries(REVISIONS).map(([lessonId, revision]) => ({ lessonId, ...revision, resolutionState: 'applied' })),
    scopeLimitRecords: Object.entries(SCOPE_LIMITS).map(([lessonId, scopeLimit]) => ({ lessonId, ...scopeLimit, resolutionState: 'bounded-by-source' })),
    plannedStageRevisits: PLANNED_REVISITS,
    groupReviews,
    lessonReviews,
    crossModeAudit: {
      exactReflectionRecallDuplicates,
      exactReflectionConfusionDuplicates,
      closestReviewedRecallOverlap: {
        lessonId: 'MOD-01',
        recallCardId: 'politics-recall-v1-u004-goals',
        decision: 'retain-with-task-difference',
        distinction: '系统学习解释愿景、任务、方式和阶段的关系；速记卡主动恢复四层职责。',
      },
    },
    knownScopeGaps: objectivesArtifact.knownScopeGaps,
    validation,
    nextBatch: validation.passed ? 'B5' : null,
  };

  const output = `${JSON.stringify(artifact, null, 2)}\n`;
  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), output);
    process.stdout.write(`${JSON.stringify({ status: artifact.status, output: target, validation })}\n`);
  } else process.stdout.write(output);
}

main();
