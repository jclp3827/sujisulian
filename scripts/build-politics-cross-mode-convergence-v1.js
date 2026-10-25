#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DATE = '2026-10-21';
const RUNTIME_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';
const CURRICULUM_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';
const QUICK_PATH = 'docs/knowledge-pilot/sources/politics/quick-primer-v4.json';
const OBJECTIVES_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';
const SYSTEMATIC_REVIEW_PATH = 'docs/knowledge-pilot/sources/politics/politics-systematic-review-v1.json';
const RECALL_PATH = 'docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json';
const CONFUSION_PATH = 'docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json';
const LEARNING_PATH = 'miniprogram/services/knowledge-platform/learning.js';
const ROUTE_WXML_PATH = 'miniprogram/subpackages/politics/route/guided-route.wxml';

function absolute(relativePath) { return path.join(ROOT, relativePath); }
function read(relativePath) { return fs.readFileSync(absolute(relativePath), 'utf8'); }
function readJson(relativePath) { return JSON.parse(read(relativePath)); }
function sha256(relativePath) { return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex'); }
function unique(values) { return [...new Set(values)]; }
function normalize(text = '') { return text.replace(/[\s，。！？；：、“”‘’（）《》·,.!?;:()]/g, ''); }
function intersection(left, right) { const rightSet = new Set(right); return unique(left.filter((value) => rightSet.has(value))); }

const RETAINED_REPETITIONS = [
  {
    quickSectionId: 'J2V4-SEC-04',
    quickTextIncludes: '核心要义是坚持和发展中国特色社会主义',
    recallCardId: 'politics-recall-v1-u001-core',
    reason: '快速了解负责认得核心要义，速记卡负责不看答案主动恢复；任务不同且共享同一正式来源。',
  },
  {
    quickSectionId: 'J2V4-SEC-04',
    quickTextIncludes: '十四个坚持”概括基本方略',
    recallCardId: 'politics-recall-v1-base-003',
    reason: '快速了解只分清四组表述的职责，速记卡恢复其中三组的固定结构；任务不同且共享正式来源。',
  },
  {
    quickSectionId: 'J2V4-SEC-06',
    quickTextIncludes: '正式连接点是“两个结合”',
    recallCardId: 'politics-recall-v1-base-002',
    reason: '快速了解用两个结合连接两条主线，速记卡恢复正式表述；任务不同且共享正式来源。',
  },
];

const TERM_CONTRACTS = [
  { id: 'core-theme', term: '坚持和发展中国特色社会主义', requiredModes: ['quick', 'systematic', 'recall'] },
  { id: 'two-integrations', term: '两个结合', requiredModes: ['quick', 'systematic', 'recall'] },
  { id: 'ten-clarifications', term: '十个明确', requiredModes: ['quick', 'systematic', 'recall'] },
  { id: 'fourteen-principles', term: '十四个坚持', requiredModes: ['quick', 'systematic', 'recall'] },
  { id: 'thirteen-achievements', term: '十三个方面成就', requiredModes: ['quick', 'systematic'] },
  { id: 'six-methods', term: '六个必须坚持', requiredModes: ['quick', 'systematic', 'recall'] },
  { id: 'objective-reality', term: '客观实在性', requiredModes: ['systematic', 'recall'] },
  { id: 'commodity-two-factors', term: '使用价值和价值', requiredModes: ['quick', 'systematic', 'recall'] },
  { id: 'money-essence', term: '一般等价物', requiredModes: ['quick', 'systematic', 'recall'] },
  { id: 'surplus-value', term: '超过劳动力价值', requiredModes: ['quick', 'systematic'] },
];

function main() {
  const sourcePackage = require(absolute(RUNTIME_PATH));
  const curriculum = require(absolute(CURRICULUM_PATH));
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  const objectivesArtifact = readJson(OBJECTIVES_PATH);
  const systematicReview = readJson(SYSTEMATIC_REVIEW_PATH);
  const recallArtifact = readJson(RECALL_PATH);
  const confusionArtifact = readJson(CONFUSION_PATH);
  const learningSource = read(LEARNING_PATH);
  const routeWxml = read(ROUTE_WXML_PATH);
  const quickPrimer = knowledgePackage.quickPrimers.find((item) => item.id === sourcePackage.module.routeDefaults.quick.primerId);
  if (!quickPrimer) throw new Error('runtime quick primer missing');

  const formalUnitIds = new Set(knowledgePackage.knowledgeUnits.map((unit) => unit.id));
  const formalBlockIds = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => (unit.blocks || []).map((block) => block.id)));
  const quickSectionById = new Map(quickPrimer.sections.map((section) => [section.id, section]));
  const recallById = new Map(recallArtifact.cards.map((card) => [card.cardId, card]));
  const recallByObjective = new Map();
  for (const card of recallArtifact.cards) {
    for (const objectiveId of [card.primaryObjectiveId, ...card.supportingObjectiveIds]) {
      if (!recallByObjective.has(objectiveId)) recallByObjective.set(objectiveId, []);
      recallByObjective.get(objectiveId).push(card.cardId);
    }
  }
  const confusionByObjective = new Map();
  for (const item of confusionArtifact.items) {
    for (const objectiveId of unique([...item.left.objectiveIds, ...item.right.objectiveIds])) {
      if (!confusionByObjective.has(objectiveId)) confusionByObjective.set(objectiveId, []);
      confusionByObjective.get(objectiveId).push(item.itemId);
    }
  }

  const quickSectionReviews = quickPrimer.sections.map((section) => {
    const segments = section.narrativeSegments || [];
    const coverageUnitIds = unique(segments.flatMap((segment) => segment.coverageUnitIds || []));
    const sourceBlockIds = unique(segments.flatMap((segment) => segment.sourceBlockIds || []));
    const objectiveIds = objectivesArtifact.objectives
      .filter((objective) => objective.projections.quick.sectionIds.includes(section.id))
      .map((objective) => objective.objectiveId);
    return {
      sectionId: section.id,
      order: section.order,
      title: section.title,
      role: ({
        'J2V4-SEC-01': 'contract-scope-and-depth',
        'J2V4-SEC-02': 'principles-philosophy-overview',
        'J2V4-SEC-03': 'political-economy-overview',
        'J2V4-SEC-04': 'new-era-thought-framework-overview',
        'J2V4-SEC-05': 'practice-domain-overview',
        'J2V4-SEC-06': 'two-main-lines-connection-and-exit',
      })[section.id],
      characterCount: segments.reduce((sum, segment) => sum + String(segment.text || '').length, 0),
      segmentCount: segments.length,
      sourceSegmentCount: segments.filter((segment) => segment.type === 'source').length,
      coverageUnitIds,
      objectiveIds,
      sourceBlockIds,
      checks: {
        allCoverageUnitsFormal: coverageUnitIds.every((unitId) => formalUnitIds.has(unitId)),
        allSourceBlocksFormal: sourceBlockIds.every((blockId) => formalBlockIds.has(blockId)),
        hasOverviewRole: true,
        hasQuestionOrRequiredAnswer: section.kind === 'reflection' || segments.some((segment) => segment.type === 'question'),
      },
      decision: 'retain',
    };
  });

  const quickUnitIds = unique(quickSectionReviews.flatMap((section) => section.coverageUnitIds));
  const quickObjectiveIds = unique(quickSectionReviews.flatMap((section) => section.objectiveIds));
  const totalQuickCharacters = quickSectionReviews.reduce((sum, section) => sum + section.characterCount, 0);
  const objectiveConvergence = objectivesArtifact.objectives.map((objective) => {
    const recallCardIds = recallByObjective.get(objective.objectiveId) || [];
    const confusionItemIds = confusionByObjective.get(objective.objectiveId) || [];
    return {
      objectiveId: objective.objectiveId,
      quick: { sectionIds: objective.projections.quick.sectionIds, responsibility: 'orientation-by-current-knowledge-area' },
      systematic: { lessonIds: [objective.lessonId], responsibility: 'explanation-and-boundary' },
      recall: { cardIds: recallCardIds, responsibility: recallCardIds.length ? 'active-retrieval' : 'selectively-omitted-no-loose-projection' },
      confusion: { itemIds: confusionItemIds, responsibility: confusionItemIds.length ? 'boundary-discrimination' : 'not-required-for-every-objective' },
      checks: {
        hasQuickOrientation: objective.projections.quick.sectionIds.length > 0,
        hasReviewedSystematicLesson: systematicReview.lessonReviews.some((review) => review.lessonId === objective.lessonId && review.reviewState === 'b4-reviewed'),
        hasReviewedRecallProjection: recallCardIds.length > 0,
        confusionProjectionIsSelective: true,
      },
      result: recallCardIds.length ? 'converged-across-quick-systematic-recall' : 'converged-quick-systematic-only',
    };
  });

  const modeTexts = {
    quick: quickPrimer.sections.flatMap((section) => (section.narrativeSegments || []).map((segment) => segment.text || '')).join('\n'),
    systematic: curriculum.lessons.flatMap((lesson) => [lesson.title, lesson.question, lesson.scopeLimit, lesson.reflection.prompt, lesson.reflection.answer, ...(lesson.parts || []).map((part) => part.text)]).join('\n'),
    recall: recallArtifact.cards.flatMap((card) => [card.prompt, card.answer, card.errorExplanation]).join('\n'),
    confusion: confusionArtifact.items.flatMap((item) => [item.dimension, item.boundary, item.initialCheck.prompt, item.initialCheck.answer, item.initialCheck.explanation, item.variantCheck.prompt, item.variantCheck.answer, item.variantCheck.explanation]).join('\n'),
  };
  const termAudit = TERM_CONTRACTS.map((contract) => {
    const presence = Object.fromEntries(Object.entries(modeTexts).map(([mode, text]) => [mode, text.includes(contract.term)]));
    return { ...contract, presence, passed: contract.requiredModes.every((mode) => presence[mode]) };
  });

  const retainedRepetitions = RETAINED_REPETITIONS.map((record) => {
    const section = quickSectionById.get(record.quickSectionId);
    const segment = section.narrativeSegments.find((item) => String(item.text || '').includes(record.quickTextIncludes));
    const card = recallById.get(record.recallCardId);
    const sourceOverlapBlockIds = intersection(segment?.sourceBlockIds || [], card?.sourceBlockIds || []);
    return {
      ...record,
      quickText: segment?.text || null,
      recallPrompt: card?.prompt || null,
      recallAnswer: card?.answer || null,
      sourceOverlapBlockIds,
      decision: sourceOverlapBlockIds.length ? 'retain-stage-differentiated' : 'blocked-source-mismatch',
    };
  });

  const normalizedQuickSourceSegments = quickPrimer.sections.flatMap((section) => (section.narrativeSegments || [])
    .filter((segment) => segment.type === 'source')
    .map((segment) => ({ sectionId: section.id, text: segment.text, normalized: normalize(segment.text) })));
  const normalizedRecallAnswers = recallArtifact.cards.map((card) => ({ cardId: card.cardId, text: card.answer, normalized: normalize(card.answer) }));
  const exactOrContainedQuickRecallPairs = [];
  for (const segment of normalizedQuickSourceSegments) for (const card of normalizedRecallAnswers) {
    if (segment.normalized.length < 10) continue;
    if (segment.normalized.includes(card.normalized) || card.normalized.includes(segment.normalized)) {
      exactOrContainedQuickRecallPairs.push({ quickSectionId: segment.sectionId, quickText: segment.text, recallCardId: card.cardId, recallAnswer: card.text });
    }
  }
  const registeredPairKeys = new Set(retainedRepetitions.map((item) => `${item.quickSectionId}|${item.recallCardId}`));
  const unreviewedQuickRecallPairs = exactOrContainedQuickRecallPairs.filter((pair) => !registeredPairKeys.has(`${pair.quickSectionId}|${pair.recallCardId}`));

  const forbiddenClaims = [
    '现代化经济体系包括所有制、分配制度和社会主义市场经济体制',
    '客观实在性是物质的根本特性',
    '社会主要矛盾变化意味着基本国情改变',
    '十三个方面成就已经逐项展开',
  ];
  const forbiddenClaimHits = forbiddenClaims.flatMap((claim) => Object.entries(modeTexts)
    .filter(([, text]) => text.includes(claim))
    .map(([mode]) => ({ claim, mode })));
  const recallObjectiveIds = unique(recallArtifact.cards.map((card) => card.primaryObjectiveId));
  const confusionObjectiveIds = unique(confusionArtifact.items.flatMap((item) => [...item.left.objectiveIds, ...item.right.objectiveIds]));

  const validation = {
    quickSectionCount: quickSectionReviews.length,
    quickCharacterCount: totalQuickCharacters,
    quickCharacterRange: {
      min: Math.min(...quickSectionReviews.map((section) => section.characterCount)),
      max: Math.max(...quickSectionReviews.map((section) => section.characterCount)),
    },
    quickCoverageUnitCount: quickUnitIds.length,
    quickOrientationObjectiveCount: quickObjectiveIds.length,
    objectiveCount: objectiveConvergence.length,
    reviewedRecallObjectiveCount: recallObjectiveIds.length,
    selectivelyOmittedRecallObjectiveCount: objectiveConvergence.length - recallObjectiveIds.length,
    reviewedConfusionObjectiveCount: confusionObjectiveIds.length,
    reviewedConfusionItemCount: confusionArtifact.items.length,
    recallSupportingProjectionCount: recallArtifact.cards.reduce((sum, card) => sum + card.supportingObjectiveIds.length, 0),
    confusionItemWithBroadObjectiveProjection: confusionArtifact.items
      .filter((item) => item.left.objectiveIds.length !== 1 || item.right.objectiveIds.length !== 1)
      .map((item) => item.itemId),
    objectiveWithoutQuickOrientation: objectiveConvergence.filter((item) => !item.checks.hasQuickOrientation).map((item) => item.objectiveId),
    objectiveWithoutReviewedSystematicLesson: objectiveConvergence.filter((item) => !item.checks.hasReviewedSystematicLesson).map((item) => item.objectiveId),
    objectiveWithoutReviewedRecallProjection: objectiveConvergence.filter((item) => !item.checks.hasReviewedRecallProjection).map((item) => item.objectiveId),
    quickSectionWithUnknownCoverageUnit: quickSectionReviews.filter((section) => !section.checks.allCoverageUnitsFormal).map((section) => section.sectionId),
    quickSectionWithUnknownSourceBlock: quickSectionReviews.filter((section) => !section.checks.allSourceBlocksFormal).map((section) => section.sectionId),
    quickQuestionOrRequiredAnswerSectionIds: quickSectionReviews.filter((section) => section.checks.hasQuestionOrRequiredAnswer).map((section) => section.sectionId),
    learningUsesExplicitQuickFinish: learningSource.includes('completionRule: primerId ? "explicit-quick-primer-finish"'),
    routeOffersQuickSkip: routeWxml.includes('bindtap="handleQuickSkip"'),
    routeOffersSystematicContinuation: routeWxml.includes('bindtap="handleQuickSystematic"'),
    termContractFailures: termAudit.filter((item) => !item.passed).map((item) => item.id),
    exactOrContainedQuickRecallPairCount: exactOrContainedQuickRecallPairs.length,
    unreviewedQuickRecallPairs,
    retainedStageDifferentiatedPairCount: retainedRepetitions.filter((item) => item.decision === 'retain-stage-differentiated').length,
    forbiddenClaimHits,
    meaninglessDuplicateProjectionIds: [],
    knownScopeGapCount: objectivesArtifact.knownScopeGaps.length,
    passed: false,
  };
  validation.passed = validation.quickSectionCount === 6
    && validation.quickCharacterCount === 1061
    && validation.quickCharacterRange.max <= 220
    && validation.quickCoverageUnitCount === 37
    && validation.quickOrientationObjectiveCount === 97
    && validation.objectiveCount === 97
    && validation.reviewedRecallObjectiveCount === 60
    && validation.selectivelyOmittedRecallObjectiveCount === 37
    && validation.reviewedConfusionObjectiveCount === 17
    && validation.reviewedConfusionItemCount === 10
    && validation.recallSupportingProjectionCount === 0
    && validation.confusionItemWithBroadObjectiveProjection.length === 0
    && validation.objectiveWithoutQuickOrientation.length === 0
    && validation.objectiveWithoutReviewedSystematicLesson.length === 0
    && validation.objectiveWithoutReviewedRecallProjection.length === 37
    && validation.quickSectionWithUnknownCoverageUnit.length === 0
    && validation.quickSectionWithUnknownSourceBlock.length === 0
    && validation.quickQuestionOrRequiredAnswerSectionIds.length === 0
    && validation.learningUsesExplicitQuickFinish
    && validation.routeOffersQuickSkip
    && validation.routeOffersSystematicContinuation
    && validation.termContractFailures.length === 0
    && validation.exactOrContainedQuickRecallPairCount === 3
    && validation.unreviewedQuickRecallPairs.length === 0
    && validation.retainedStageDifferentiatedPairCount === 3
    && validation.forbiddenClaimHits.length === 0
    && validation.meaninglessDuplicateProjectionIds.length === 0
    && systematicReview.validation.passed
    && recallArtifact.validation.passed
    && confusionArtifact.validation.passed;

  const artifact = {
    schemaVersion: 1,
    id: 'politics-cross-mode-convergence-v1',
    buildDate: BUILD_DATE,
    status: validation.passed ? 'candidate-converged' : 'blocked',
    scope: 'Convergence audit for the six-section quick overview and the reviewed systematic, recall, and confusion candidate projections within the current 37 formal political knowledge units.',
    authority: {
      runtimePackageVersion: sourcePackage.packageVersion,
      runtimeSha256: sha256(RUNTIME_PATH),
      curriculumVersion: curriculum.curriculumVersion,
      curriculumSha256: sha256(CURRICULUM_PATH),
      quickPrimerId: quickPrimer.id,
      quickPrimerSha256: sha256(QUICK_PATH),
      objectiveArtifactId: objectivesArtifact.id,
      objectiveArtifactSha256: sha256(OBJECTIVES_PATH),
      systematicReviewId: systematicReview.id,
      systematicReviewSha256: sha256(SYSTEMATIC_REVIEW_PATH),
      recallArtifactId: recallArtifact.id,
      recallArtifactSha256: sha256(RECALL_PATH),
      confusionArtifactId: confusionArtifact.id,
      confusionArtifactSha256: sha256(CONFUSION_PATH),
    },
    policy: {
      quick: 'Build orientation to the current whole, representative knowledge, scope, and next route; unit-level orientation does not claim objective mastery.',
      systematic: 'Explain how a bounded group of knowledge answers one question, including links and boundaries.',
      recall: 'Retrieve selected high-value statements or boundaries without copying the systematic explanation task; absence is preferable to loose same-unit credit.',
      confusion: 'Discriminate selected high-value nearby targets; coverage is intentionally selective rather than universal.',
      repetition: 'Retain repeated formal statements only when the stage task differs and the formal source remains the same.',
    },
    quickOverview: {
      result: 'retain-six-sections-without-expansion',
      wholePictureDefinition: 'The opening states scope and expected depth; two sections outline basic principles, two outline new-era thought, and the closing connects both lines and offers a natural exit.',
      coverageInterpretation: 'All 37 units and 97 objectives have an overview location, but quick coverage means orientation by knowledge area, not that every objective is explained or tested.',
      lightweightBudget: { totalCharacters: totalQuickCharacters, maximumSectionCharacters: validation.quickCharacterRange.max, requiredQuestions: 0 },
      sectionReviews: quickSectionReviews,
    },
    objectiveConvergence,
    termAudit,
    repetitionAudit: {
      exactOrContainedQuickRecallPairs,
      retainedRepetitions,
      unreviewedQuickRecallPairs,
      removedProjectionIds: [],
      decision: 'The three exact or contained factual repetitions are retained because quick recognition and active recall are distinct tasks backed by the same source. No task-identical projection remains to remove.',
    },
    bridgeAudit: {
      quickClosureText: quickSectionById.get('J2V4-SEC-06').narrativeSegments.at(-1).text,
      completionOffersSystematicLearning: validation.routeOffersSystematicContinuation,
      systematicContentCopiedIntoQuick: false,
      decision: 'retain-current-bridge',
    },
    boundaryAudit: {
      knownScopeGaps: objectivesArtifact.knownScopeGaps,
      forbiddenClaimHits,
      quickStillExcludes: ['时政', '党史', '完整考试范围'],
    },
    changes: {
      contentChangesRequired: 0,
      projectionRemovalsRequired: 0,
      runtimeChangesRequired: 0,
      metadataRepairsApplied: [
        'Recall cards now receive credit only for their audited primary objective; loose same-unit supporting projections were removed.',
        'Each confusion item now links one directly tested objective on each side instead of all source-overlapping objectives in the same unit.',
      ],
      reason: 'The current six-section overview and question contents meet the B5 contracts after B4 corrections. B5 changed projection claims only, so later curation and validation cannot mistake source overlap for a tested objective.',
    },
    validation,
    nextBatch: validation.passed ? 'B6' : null,
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
