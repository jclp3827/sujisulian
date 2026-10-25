#!/usr/bin/env node

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const platform = require(path.join(ROOT, 'miniprogram/services/knowledge-platform'));
const sourcePackage = require(path.join(ROOT, 'miniprogram/models/politics-p3-v2-runtime'));
const runtimeBanks = require(path.join(ROOT, 'miniprogram/models/politics-learning-banks-runtime'));
const curriculum = require(path.join(ROOT, 'miniprogram/models/politics-systematic-units-runtime'));
const gapFill = require(path.join(ROOT, 'docs/knowledge-pilot/sources/politics/politics-exam-recall-gap-fill-v1.json'));
const contentRevision=require('../docs/knowledge-pilot/sources/politics/politics-shared-recall-revision-v3.json');
const gapRevision=require('../docs/knowledge-pilot/sources/politics/politics-shared-recall-revision-v4.json');
const expectedRecallCount = 145-contentRevision.retirements.length+contentRevision.additions.length+gapRevision.additions.length;
const { knowledgePackage } = require(path.join(ROOT, 'miniprogram/services/knowledge-platform/politics-runtime'));
const systematicUnits = require(path.join(ROOT, 'miniprogram/services/knowledge-platform/systematic-units'));

const promotion = spawnSync(process.execPath, [path.join(ROOT, 'scripts/promote-politics-learning-banks-v1.js'), '--check'], {
  cwd: ROOT,
  encoding: 'utf8',
});
assert.equal(promotion.status, 0, promotion.stderr || 'runtime bank is stale');
assert.equal(runtimeBanks.status, 'approved-runtime');
assert.equal(runtimeBanks.recallCards.length, expectedRecallCount);
assert.equal(runtimeBanks.confusionItems.length, 14);
assert.equal(knowledgePackage.learningBanks.version, runtimeBanks.bankVersion);
assert.equal(knowledgePackage.recallItems.length, expectedRecallCount);
assert.equal(knowledgePackage.recallProjections.length, expectedRecallCount);
assert.equal(knowledgePackage.contrastPairs.length, 14);
assert.equal(knowledgePackage.relations.filter((relation) => relation.type === 'contrast').length, 14);
assert.equal(knowledgePackage.moduleProfile.routeDefaults.confusion.priorityRelationIds.length, 14);
assert.equal(knowledgePackage.moduleProfile.routeDefaults.exam.sessionSize, 4);
assert.ok(knowledgePackage.packageVersion.endsWith(runtimeBanks.bankVersion.replace('learning-banks-', 'lb-')));
assert.deepEqual(knowledgePackage.diagnostics.errors, []);

const unitIds = new Set(knowledgePackage.knowledgeUnits.map((unit) => unit.id));
const blockIds = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => block.id)));
const recallIds = new Set(knowledgePackage.recallItems.map((item) => item.id));
assert.equal(new Set(runtimeBanks.recallCards.map((card) => card.cardId)).size, expectedRecallCount);
assert.equal(new Set(runtimeBanks.confusionItems.map((item) => item.relationId)).size, 14);
for (const recall of knowledgePackage.recallItems) {
  assert.ok(unitIds.has(recall.pointId));
  assert.ok(recall.sourceBlockIds.length && recall.sourceBlockIds.every((id) => blockIds.has(id)));
  assert.ok(recall.remedy.sourceBlockIds.length && recall.remedy.sourceBlockIds.every((id) => blockIds.has(id)));
}
for (const unit of knowledgePackage.knowledgeUnits) {
  assert.ok(unit.recallItemIds.length >= 1, `${unit.id}: no runtime recall card`);
  assert.ok(unit.recallItemIds.every((id) => recallIds.has(id)));
}
for (const pair of knowledgePackage.contrastPairs) {
  assert.ok(pair.initialCheck && pair.variantCheck);
  assert.equal(pair.initialCheck.options.length, 2);
  assert.equal(pair.variantCheck.options.length, 2);
  assert.notEqual(pair.initialCheck.prompt, pair.variantCheck.prompt);
  assert.ok(pair.variantCheck.options.some(option => option.unitId === pair.variantCheck.answerUnitId));
}

const exam = platform.planRecommendedRoute(knowledgePackage, 'exam');
assert.equal(exam.steps.length, 4);
assert.equal(exam.startProjection.cardCount, 4);
assert.ok(exam.startProjection.bankCardCount >= 4);
const nextExam = platform.planLearningRoute(knowledgePackage, { ...exam.options, examCursor: exam.startProjection.nextCursor });
assert.equal(nextExam.steps.length, 4);
assert.notDeepEqual(nextExam.frozenOrder, exam.frozenOrder);
const oldExamSession = platform.createRouteSession(exam, 1);
assert.equal(platform.normalizeRouteSession(exam, { ...oldExamSession, packageVersion: `kp1-a6-${sourcePackage.packageVersion}` }).status, 'expired');

for (const item of runtimeBanks.confusionItems) {
  const plan = platform.planLearningRoute(knowledgePackage, {
    type: 'confusion',
    scopeId: knowledgePackage.indexes.rootNavigationIds[0],
    relationId: item.relationId,
    recommendationQueue: knowledgePackage.moduleProfile.routeDefaults.confusion.priorityRelationIds,
  });
  assert.ok(plan && plan.steps.length === 4, `${item.itemId}: runtime route unavailable`);
  let session = platform.createRouteSession(plan, 1);
  session = platform.applyRouteSessionEvent(plan, session, { type: 'REVEAL_CONTRAST_KEY', answerUnitId: item.initialCheck.answerUnitId, at: 2 });
  assert.equal(session.currentIndex, 1);
  assert.equal(session.responseByStepId[plan.steps[0].stepId].correct, true);
  session = platform.applyRouteSessionEvent(plan, session, { type: 'CONFIRM_CONTRAST_BOUNDARY', at: 3 });
  assert.equal(session.currentIndex, 2);
  session = platform.applyRouteSessionEvent(plan, session, { type: 'VIEW_CONTRAST_SIDE', side: 'left', at: 4 });
  session = platform.applyRouteSessionEvent(plan, session, { type: 'VIEW_CONTRAST_SIDE', side: 'right', at: 5 });
  session = platform.applyRouteSessionEvent(plan, session, { type: 'VIEW_CONTRAST_EVIDENCE', at: 6 });
  assert.equal(session.currentIndex, 3);
  session = platform.applyRouteSessionEvent(plan, session, { type: 'CONTRAST_RESPONSE', answerUnitId: item.variantCheck.answerUnitId, at: 7 });
  assert.equal(session.status, 'completed');
  const report = platform.projectRouteViewModel(knowledgePackage, plan, session).report;
  assert.equal(report.contrastInitialCorrect, true);
  assert.equal(report.contrastRetestCorrect, true);
}

const systematic = systematicUnits.planFor(knowledgePackage, {
  type: 'systematic',
  experienceKind: systematicUnits.KIND,
  groupId: curriculum.groups[0].id,
  curriculumVersion: curriculum.curriculumVersion,
});
assert.ok(systematic, 'systematic route was not rebound to the learning-bank package');
const oldSystematic = {
  planId: `route:politics:systematic:${curriculum.groups[0].id}:units-bc66674c4b7a`,
  packageVersion: 'kp1-a6-runtime-77a15fc82abc-lb-70ddf928322e',
  curriculumVersion: 'units-bc66674c4b7a',
  currentIndex: 0,
  currentStepId: systematic.steps[0].stepId,
  completedStepIds: [],
  skippedStepIds: [],
  status: 'active',
  startedAt: 1,
  updatedAt: 1,
};
assert.equal(platform.normalizeRouteSession(systematic, oldSystematic).status, 'active', 'B11 systematic progress must migrate');

console.log(JSON.stringify({
  status: 'passed',
  bankVersion: runtimeBanks.bankVersion,
  packageVersion: knowledgePackage.packageVersion,
  recallCards: knowledgePackage.recallItems.length,
  confusionItems: knowledgePackage.contrastPairs.length,
  examSessionSize: exam.steps.length,
  systematicProgressMigration: 'compatible',
}));


require("./validate-politics-question-catalogue").validate();

require("./validate-politics-question-management").validate();
