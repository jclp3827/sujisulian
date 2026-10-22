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

function build() {
  const recall = readJson(RECALL_PATH);
  const confusion = readJson(CONFUSION_PATH);
  const expansion = readJson(EXPANSION_PATH);
  const maintenanceV1 = readJson(MAINTENANCE_V1_PATH);
  const maintenanceV2 = readJson(MAINTENANCE_V2_PATH);
  if (recall.status !== 'candidate-reviewed' || recall.validation?.passed !== true) throw new Error('Recall candidate bank has not passed review');
  if (confusion.status !== 'candidate-reviewed' || confusion.validation?.passed !== true) throw new Error('Confusion candidate bank has not passed review');
  if (expansion.status !== 'expansion-reviewed-maintenance-ready' || expansion.validation?.passed !== true) throw new Error('Expansion bank has not passed review');
  if (maintenanceV1.status !== 'maintenance-reviewed-return-to-maintenance' || maintenanceV1.validation?.passed !== true) throw new Error('B11 maintenance bank has not passed review');
  if (maintenanceV2.status !== 'maintenance-reviewed-stop-condition-reached' || maintenanceV2.validation?.passed !== true) throw new Error('B12-B15 maintenance bank has not passed review');
  const revision = readJson(path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-exam-alignment-v1.json'));
  const gapFill = readJson(path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-exam-recall-gap-fill-v1.json'));
  if (gapFill.status !== 'candidate-reviewed-existing-source-only' || gapFill.validation?.passed !== true) throw new Error('Exam recall gap fill has not passed source review');
  const recallCards = [...recall.cards, ...expansion.recallCards, ...maintenanceV1.recallCards, ...maintenanceV2.recallCards, ...gapFill.cards].map(card => ({
    ...card, ...revision.recallPatches[card.cardId],
    supportingObjectiveIds: [...new Set([...(card.supportingObjectiveIds || []), ...gapFill.reusedCardBindings.filter(binding => binding.cardId === card.cardId).map(binding => binding.objectiveId)])],
    prompt: (revision.recallPatches[card.cardId]?.prompt || card.prompt).replace(/^判断并纠正/, card.cardType === 'error-correction' ? revision.recallTaskPolicy.errorCorrectionPrompt : '判断并纠正'),
    importance: card.importance === 'high-frequency-boundary' ? 'curriculum-boundary-no-exam-frequency-evidence' : card.importance,
    examReview: revision.pendingSourceReview.some(row => row.id === card.cardId) ? 'pending-external-source-review' : 'source-backed-learning-recall-not-exam-frequency-verified',
  }));
  const confusionItems = [...confusion.items, ...expansion.confusionItems].map(item => {
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
  const contentHash = hash({ recall: recallCards, confusion: confusionItems });
  return {
    schemaVersion: 1,
    id: 'politics-learning-banks-runtime-v1',
    bankVersion: `learning-banks-${contentHash.slice(0, 12)}`,
    status: 'approved-runtime',
    promotedAt: '2026-10-21',
    sourceArtifacts: {
      examAlignment: { id: revision.id, status: revision.status, sha256: hash(revision) },
      examRecallGapFill: { id: gapFill.id, status: gapFill.status, sha256: hash(gapFill) },
      recall: { id: recall.id, status: recall.status, sha256: hash(recall) },
      confusion: { id: confusion.id, status: confusion.status, sha256: hash(confusion) },
      expansion: { id: expansion.id, status: expansion.status, sha256: hash(expansion) },
      maintenanceV1: { id: maintenanceV1.id, status: maintenanceV1.status, sha256: hash(maintenanceV1) },
      maintenanceV2: { id: maintenanceV2.id, status: maintenanceV2.status, sha256: hash(maintenanceV2) },
    },
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
    recallCards: recallCards.map((card, order) => ({
      ...card,
      order: order + 1,
      status: 'approved-runtime',
      runtimeIntegration: 'integrated',
      sourceReviewState: card.origin === 'exam-goal-gap-fill-e21' ? 'e21-source-reviewed' : 'b15-runtime-approved',
      reviewState: 'exam-alignment-editorial-reviewed-effectiveness-unverified',
    })),
    confusionItems: confusionItems.map((item, order) => ({
      ...item,
      order: order + 1,
      sourceRelationId: item.relationId,
      relationId: runtimeRelationId(item),
      status: 'approved-runtime',
      runtimeIntegration: 'integrated',
      reviewState: 'b15-runtime-approved',
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

