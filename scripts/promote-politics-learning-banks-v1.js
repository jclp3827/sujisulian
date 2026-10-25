#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const RECALL_PATH = path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json');
const CONFUSION_PATH = path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json');
const EXPANSION_PATH = path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-learning-bank-expansion-v1.json');
const MAINTENANCE_V1_PATH = path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-learning-bank-maintenance-v1.json');
const MAINTENANCE_V2_PATH = path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-learning-bank-maintenance-v2.json');
const OBJECTIVES_PATH = path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json');
const CURRICULUM_PATH = path.join(ROOT, 'miniprogram/models/politics-systematic-units-runtime.js');
const OUTPUT_PATH = path.join(ROOT, 'miniprogram/models/politics-learning-banks-runtime.js');

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}
function hash(value) {
  return crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}
function runtimeRelationId(item) {
  return item.status === 'accepted-existing'
    ? item.relationId
    : `relation:${item.left.unitId}:contrast:${item.right.unitId}`;
}

function practiceBinding(card, objectiveById, lessonById, groupById) {
  const objective = objectiveById.get(card.primaryObjectiveId);
  if (!objective) throw new Error(`${card.cardId}: practice objective is unavailable`);
  const lesson = lessonById.get(objective.lessonId);
  const group = groupById.get(objective.groupId);
  if (!lesson || lesson.groupId !== objective.groupId || !group || group.routeId !== objective.routeId) {
    throw new Error(`${card.cardId}: practice curriculum binding is stale`);
  }
  if (!(lesson.primaryUnitIds || []).includes(card.unitId) && !(objective.unitIds || []).includes(card.unitId)) {
    throw new Error(`${card.cardId}: practice unit is outside the bound lesson`);
  }
  return { routeId: objective.routeId, groupId: objective.groupId, lessonId: objective.lessonId };
}

function build() {
  const recall = readJson(RECALL_PATH);
  const confusion = readJson(CONFUSION_PATH);
  const expansion = readJson(EXPANSION_PATH);
  const maintenanceV1 = readJson(MAINTENANCE_V1_PATH);
  const maintenanceV2 = readJson(MAINTENANCE_V2_PATH);
  const objectives = readJson(OBJECTIVES_PATH);
  const curriculum = require(CURRICULUM_PATH);
  if (recall.status !== 'candidate-reviewed' || recall.validation?.passed !== true) throw new Error('Recall candidate bank has not passed review');
  if (confusion.status !== 'candidate-reviewed' || confusion.validation?.passed !== true) throw new Error('Confusion candidate bank has not passed review');
  if (expansion.status !== 'expansion-reviewed-maintenance-ready' || expansion.validation?.passed !== true) throw new Error('Expansion bank has not passed review');
  if (maintenanceV1.status !== 'maintenance-reviewed-return-to-maintenance' || maintenanceV1.validation?.passed !== true) throw new Error('B11 maintenance bank has not passed review');
  if (maintenanceV2.status !== 'maintenance-reviewed-stop-condition-reached' || maintenanceV2.validation?.passed !== true) throw new Error('B12-B15 maintenance bank has not passed review');
  const revision = readJson(path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-exam-alignment-v1.json'));
  const gapFill = readJson(path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-exam-recall-gap-fill-v1.json'));
  if (gapFill.status !== 'candidate-reviewed-existing-source-only' || gapFill.validation?.passed !== true) throw new Error('Exam recall gap fill has not passed source review');
  let recallCards = [...recall.cards, ...expansion.recallCards, ...maintenanceV1.recallCards, ...maintenanceV2.recallCards, ...gapFill.cards].map(card => ({
    ...card, ...revision.recallPatches[card.cardId],
    supportingObjectiveIds: [...new Set([...(card.supportingObjectiveIds || []), ...gapFill.reusedCardBindings.filter(binding => binding.cardId === card.cardId).map(binding => binding.objectiveId)])],
    prompt: (revision.recallPatches[card.cardId]?.prompt || card.prompt).replace(/^判断并纠正/, card.cardType === 'error-correction' ? revision.recallTaskPolicy.errorCorrectionPrompt : '判断并纠正'),
    importance: card.importance === 'high-frequency-boundary' ? 'curriculum-boundary-no-exam-frequency-evidence' : card.importance,
    examReview: revision.pendingSourceReview.some(row => row.id === card.cardId) ? 'pending-external-source-review' : 'source-backed-learning-recall-not-exam-frequency-verified',
  }));
  const sharedRevision = readJson(path.join(ROOT,'docs/knowledge-pilot/sources/politics/politics-shared-recall-revision-v2.json'));
  const before = require(path.join(ROOT,'docs/knowledge-platform/implementations/evidence/shared-recall-p0-p1-20261025/before-bank.js'));
  const formalPackage = require('../miniprogram/services/knowledge-platform/politics-adapter').createPoliticsAdapter(require('../miniprogram/models/politics-p3-v2-runtime')).buildPackage();
  const formalBlocks = new Map(formalPackage.knowledgeUnits.flatMap(unit=>unit.blocks).map(block=>[block.id,block]));
  for (const evidence of sharedRevision.sourceEvidence) {
    const text = formalBlocks.get(evidence.blockId)?.fallbackText;
    if (text !== evidence.text || crypto.createHash('sha256').update(text || '').digest('hex') !== evidence.textSha256) throw new Error('Shared recall source drift: '+evidence.blockId);
  }
  if (new Set([...Object.keys(sharedRevision.patches),...sharedRevision.retirements.map(row=>row.id)]).size !== sharedRevision.baselineOriginalIds.length || sharedRevision.baselineOriginalIds.some(id=>!sharedRevision.patches[id] && !sharedRevision.retirements.some(row=>row.id===id))) throw new Error('Shared recall sample disposition is incomplete');
  recallCards = require('./lib/politics-shared-recall-revision').applyRevision(recallCards,sharedRevision,before);
  const contentRevision = readJson(path.join(ROOT,'docs/knowledge-pilot/sources/politics/politics-shared-recall-revision-v3.json'));
  const acceptedSamples = require(path.join(ROOT,'docs/knowledge-platform/implementations/evidence/shared-recall-continuation-20261025/before-bank.js'));
  function validateContentSources(artifact) {
  for (const evidence of artifact.sourceEvidence) {
    const text=formalBlocks.get(evidence.blockId)?.fallbackText;
    if(text !== evidence.text || crypto.createHash('sha256').update(text || '').digest('hex') !== evidence.textSha256) throw new Error('Shared content source drift: '+evidence.blockId);
    if(formalBlocks.get(evidence.blockId)?.publishable === false) {
      const qualification=artifact.candidateSourceBindings?.find(row=>row.blockId===evidence.blockId);
      if(!qualification || qualification.publishable !== false) throw new Error('Unqualified candidate source '+evidence.blockId);
      const file=path.join(ROOT,qualification.registry),registry=readJson(file);
      if(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') !== qualification.registrySha256 || registry.curriculumExpansionApproval !== 'user-approved-20261024' || !registry.revalidationSourceSupplementApproval) throw new Error('Candidate source authorization drift');
      const block=registry.blocks.find(row=>'block:'+row.unitId+':'+row.id===evidence.blockId);
      if(!block || block.text !== text || block.publishable !== false) throw new Error('Candidate source text or qualification drift');
      const lessons=require(path.join(ROOT,'docs/knowledge-platform/implementations/evidence/shared-recall-continuation-20261025/before-curriculum.js')).lessons;
      if(!lessons.some(lesson=>lesson.parts.some(part=>part.sourceBlockIds?.includes(evidence.blockId)))) throw new Error('Candidate source is outside accepted curriculum');
      const review=readJson(path.join(ROOT,qualification.expertReview));
      if(review.overallVerdict !== 'pass' || review.artifactSha256 !== qualification.batchSourceSha256) throw new Error('Candidate source needs exact independent review');
    }

  }
  }
  validateContentSources(contentRevision);
  if(new Set([...Object.keys(contentRevision.patches),...contentRevision.retirements.map(r=>r.id)]).size !== contentRevision.baselineOriginalIds.length) throw new Error('Shared content disposition incomplete');
  recallCards = require('./lib/politics-shared-recall-revision').applyRevision(recallCards,contentRevision,acceptedSamples);
  const gapRevisionPath=path.join(ROOT,'docs/knowledge-pilot/sources/politics/politics-shared-recall-revision-v4.json');
  const gapRevision=fs.existsSync(gapRevisionPath)?readJson(gapRevisionPath):null;
  if(gapRevision) {
    validateContentSources(gapRevision);
    const acceptedContent=require(path.join(ROOT,'docs/knowledge-platform/implementations/evidence/shared-recall-continuation-20261025/P3/before-bank.js'));
    if(new Set([...Object.keys(gapRevision.patches),...gapRevision.retirements.map(r=>r.id)]).size !== gapRevision.baselineOriginalIds.length) throw new Error('Targeted gap revision disposition incomplete');
    recallCards=require('./lib/politics-shared-recall-revision').applyRevision(recallCards,gapRevision,acceptedContent);
  }


  const quality = require('./lib/politics-applied-confusion-revision').loadQualityRevision();
  let confusionItems = [...confusion.items, ...expansion.confusionItems].map(item => {
    const patch = revision.confusionPatches[item.itemId];
    if (!patch) return item;
    const sides = { left: { ...item.left, title: patch.leftTitle }, right: { ...item.right, title: patch.rightTitle } };
    function check(value) {
      const correct = sides[value.answerSide];
      const wrong = sides[value.answerSide === 'left' ? 'right' : 'left'];
      return { prompt: value.prompt, options: [sides.left, sides.right].map(side => ({ unitId: side.unitId, label: side.title })),
        answerUnitId: correct.unitId, answer: correct.title, explanation: value.explanation,
        sourceBlockIds: correct.sourceBlockIds, wrongOptionUnitId: wrong.unitId,
        wrongAnswerExplanation: value.explanation };
    }
    return { ...item, left: sides.left, right: sides.right, boundary: patch.boundary,
      initialCheck: check(patch.initial), variantCheck: check(patch.variant),
      examAlignmentRevision: revision.id, reviewDecision: '按知识对象和材料条件辨析，不按教材章节或必换边规律评分。' };
  });
  if (quality) {
    if (JSON.stringify(Object.keys(quality.confusionPatches).sort()) !== JSON.stringify(confusionItems.map(i=>i.itemId).sort())) throw Error('Confusion quality disposition incomplete');
    confusionItems = confusionItems.map(item=>({...item,...quality.confusionPatches[item.itemId]}));
  }
  const contentHash = hash({ recall: recallCards, confusion: confusionItems });
  const objectiveById = new Map(objectives.objectives.map(item => [item.objectiveId, item]));
  const lessonById = new Map(curriculum.lessons.map(item => [item.id, item]));
  const groupById = new Map(curriculum.groups.map(item => [item.id, item]));
  return {
    schemaVersion: 1,
    id: 'politics-learning-banks-runtime-v1',
    bankVersion: `learning-banks-${contentHash.slice(0, 12)}`,
    status: 'approved-runtime',
    promotedAt: '2026-10-21',
    sourceArtifacts: {
      ...(quality?{appliedConfusionQuality:{id:quality.id,sha256:hash(quality.confusionPatches)}}:{}),
      ...(gapRevision?{sharedRecallGapRevision:{id:gapRevision.id,sha256:hash(gapRevision)}}:{}),
      sharedRecallContentRevision: { id: contentRevision.id, sha256: hash(contentRevision) },
      sharedRecallRevision: { id: sharedRevision.id, sha256: hash(sharedRevision) },
      examAlignment: { id: revision.id, status: revision.status, sha256: hash(revision) },
      examRecallGapFill: { id: gapFill.id, status: gapFill.status, sha256: hash(gapFill) },
      recall: { id: recall.id, status: recall.status, sha256: hash(recall) },
      confusion: { id: confusion.id, status: confusion.status, sha256: hash(confusion) },
      expansion: { id: expansion.id, status: expansion.status, sha256: hash(expansion) },
      maintenanceV1: { id: maintenanceV1.id, status: maintenanceV1.status, sha256: hash(maintenanceV1) },
      maintenanceV2: { id: maintenanceV2.id, status: maintenanceV2.status, sha256: hash(maintenanceV2) },
    },
    recallRevisionCompatibility: { previousPackageVersion: 'kp1-a7-runtime-035dd0088167-lb-715e57f57689', previousBankVersion: before.bankVersion, historicalBanks: [{packageVersion:'kp1-a7-runtime-035dd0088167-lb-71359577750c',recallVersions:Object.fromEntries(acceptedSamples.recallCards.map(c=>[c.cardId,c.recallVersion]))},...(contentRevision.compatibleHistoricalBanks || []),...(gapRevision?.compatibleHistoricalBanks || []),...(quality?.compatibleHistoricalBanks || [])] },
    retiredRecallCards: [...sharedRevision.retirements,...contentRevision.retirements,...(gapRevision?.retirements || [])],
    sessionPolicy: {
      exam: {
        sessionSize: 4,
        orderedRounds: true,
        randomOnlyByUserChoice: true,
        stableMasteryRequiresDelayedRetest: true,
      },
      confusion: {
        itemCountPerSession: 1,
        requireInitialAndTransferVariant: true,
        dialecticsClusterMaxPerDefaultCycle: confusion.curationPolicy.maxDialecticsClusterItemsPerDefaultSession,
      },
    },
    recallCards: recallCards.map((card, order) => {
      const binding = card.practiceBindingOverride || practiceBinding(card, objectiveById, lessonById, groupById);
      if (!lessonById.has(binding.lessonId) || lessonById.get(binding.lessonId).groupId !== binding.groupId || groupById.get(binding.groupId)?.routeId !== binding.routeId) throw new Error(card.cardId + ': invalid semantic practice binding');
      const practiceVersion = `practice-recall-${hash({
        cardId: card.cardId,
        unitId: card.unitId,
        cardType: card.cardType,
        difficulty: card.difficulty,
        primaryObjectiveId: card.primaryObjectiveId,
        supportingObjectiveIds: card.supportingObjectiveIds || [],
        prompt: card.prompt,
        answer: card.answer,
        errorExplanation: card.errorExplanation,
        sourceBlockIds: card.sourceBlockIds,
        errorSourceBlockIds: card.errorSourceBlockIds,
        remedy: card.remedy,
        practiceBinding: binding,
      }).slice(0, 12)}`;
      return {
        ...card,
        order: order + 1,
        practiceVersion: card.preservedPracticeVersion || practiceVersion,
        practiceRouteId: binding.routeId,
        practiceGroupId: binding.groupId,
        practiceLessonId: binding.lessonId,
        status: 'approved-runtime',
        runtimeIntegration: 'integrated',
        sourceReviewState: gapRevision?.reviewedCardIds?.includes(card.cardId) ? 'shared-recall-gap-two-role-ai-reviewed-candidate' : contentRevision.reviewedCardIds?.includes(card.cardId) ? 'shared-recall-content-two-role-ai-reviewed' : (sharedRevision.patches[card.cardId] || card.parentCardId) ? 'shared-recall-p1-two-role-ai-reviewed' : card.origin === 'exam-goal-gap-fill-e21' ? 'e21-source-reviewed' : 'b15-runtime-approved',
        reviewState: gapRevision?.reviewedCardIds?.includes(card.cardId) ? 'two-role-ai-reviewed-effectiveness-unverified' : contentRevision.reviewedCardIds?.includes(card.cardId) ? 'two-role-ai-reviewed-effectiveness-unverified' : (sharedRevision.patches[card.cardId] || card.parentCardId) ? 'two-role-ai-reviewed-effectiveness-unverified' : 'exam-alignment-editorial-reviewed-effectiveness-unverified',
      };
    }),
    confusionItems: confusionItems.map((item, order) => ({
      ...item,
      contentVersion: quality ? (quality.preservedConfusionVersions[item.itemId] || `confusion-${hash(quality.confusionPatches[item.itemId]).slice(0,12)}`) : `${before.bankVersion}:${item.itemId}`,
      order: order + 1,
      sourceRelationId: item.relationId,
      relationId: runtimeRelationId(item),
      status: 'approved-runtime',
      runtimeIntegration: 'integrated',
      reviewState: quality ? 'two-independent-ai-roles-reviewed-effectiveness-unverified' : 'b15-runtime-approved',
    })),
    maintenance: maintenanceV2.exitDecision,
  };
}

const runtime = build();
const output = `// Generated by scripts/promote-politics-learning-banks-v1.js. Do not edit by hand.\nmodule.exports = ${JSON.stringify(runtime, null, 2)};\n`;
if (process.argv.includes('--check')) {
  if (!fs.existsSync(OUTPUT_PATH) || fs.readFileSync(OUTPUT_PATH, 'utf8') !== output) {
    console.error('politics learning runtime bank is stale');
    process.exit(1);
  }
  console.log(JSON.stringify({ status: 'passed', bankVersion: runtime.bankVersion, recallCards: runtime.recallCards.length, confusionItems: runtime.confusionItems.length }));
} else {
  fs.writeFileSync(OUTPUT_PATH, output);
  console.log(JSON.stringify({ status: 'written', file: path.relative(ROOT, OUTPUT_PATH), bankVersion: runtime.bankVersion, recallCards: runtime.recallCards.length, confusionItems: runtime.confusionItems.length }));
}

