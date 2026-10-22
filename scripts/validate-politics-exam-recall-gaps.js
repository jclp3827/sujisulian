#!/usr/bin/env node
const assert = require('node:assert/strict');
const artifact = require('../docs/knowledge-pilot/sources/politics/politics-exam-recall-gap-fill-v1.json');
const { knowledgePackage } = require('../miniprogram/services/knowledge-platform/politics-runtime');
const objectives = require('../docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json').objectives;
const blocks = new Map(knowledgePackage.knowledgeUnits.flatMap(u => u.blocks).map(b => [b.id, b]));
const objectiveIds = new Set(objectives.map(o => o.objectiveId));
const clone = x => JSON.parse(JSON.stringify(x));
function canonical(id) {
  const text = n => blocks.get(`block:politics-toc-v2-u${id === 'fourteen' || id === 'methods-six' ? '003' : '004'}:b${String(n).padStart(3, '0')}`).fallbackText;
  if (id === 'fourteen') return text(16).split('就是')[1].split(/[，。]/).filter(Boolean);
  if (id === 'essential-nine') return text(24).split('：')[1].split(/[，。]/).filter(Boolean);
  if (id === 'principles-five') return [27,28,29,30,31].map(n => text(n).replace(/^\d+\./, '').replace(/。$/, ''));
  if (id === 'methods-six') return text(18).split('就是')[1].split(/[、。]/).filter(Boolean);
  throw new Error('Unknown catalogue');
}
function validate(value) {
  assert.equal(value.cards.length, 9);
  assert.equal(value.policy.maxNewCards, 9);
  assert.equal(value.policy.maxAnswerCharacters, 80);
  assert.equal(value.objectiveDispositions.length, 13);
  assert.equal(new Set(value.objectiveDispositions.map(d => d.objectiveId)).size, 13);
  assert.equal(new Set(value.cards.map(c => c.cardId)).size, 9);
  for (const cat of value.catalogues) {
    assert.deepEqual(cat.items.map(i => i.text), canonical(cat.id), 'catalogue differs from formal source');
    const claimed = value.cards.filter(c => c.ordinalRange.catalogueId === cat.id).flatMap(c => c.answerItems.map(i => i.ordinal));
    const [start, end] = cat.expectedOrdinals;
    assert.deepEqual(claimed, Array.from({length:end-start+1}, (_, i) => start+i), 'missing, duplicated or reordered fixed item');
    for (const item of cat.items) {
      assert.ok(blocks.get(item.sourceBlockId)?.fallbackText.includes(item.text));
      assert.equal(item.sourceBlockId.split(':')[1], cat.unitId);
    }
  }
  for (const card of value.cards) {
    assert.ok(objectiveIds.has(card.primaryObjectiveId));
    assert.equal(card.cardType, 'statement-combination');
    const cat = value.catalogues.find(c => c.id === card.ordinalRange.catalogueId);
    const expected = cat.items.filter(i => i.ordinal >= card.ordinalRange.start && i.ordinal <= card.ordinalRange.end);
    assert.deepEqual(card.answerItems, expected);
    assert.equal(card.answer, expected.map(i => i.text).join('；') + '。');
    assert.equal(card.answerCharacterCount, card.answer.length);
    assert.ok(card.answer.length <= 80);
    assert.deepEqual(card.sourceBlockIds, [...new Set(expected.map(i => i.sourceBlockId))]);
    assert.ok(card.sourceBlockIds.every(id => blocks.has(id)));
    assert.equal(card.importance, 'core-within-current-curriculum');
    assert.ok(!/高频|真题|必考/.test(card.prompt + card.answer + card.measurement));
  }
  assert.equal(value.reusedCardBindings.length, 2);
  assert.equal(value.objectiveDispositions.filter(d => d.decision === 'retain-systematic-explanation').length, 7);
  return true;
}
validate(artifact);
for (const mutate of [
  v => { v.cards[0].answerItems.pop(); },
  v => { v.cards[0].answer = v.cards[0].answer.replace('党对一切工作', '党对所有事务'); },
  v => { v.catalogues[0].items[6].text = '坚持社会主义核心价值观'; },
  v => { v.cards[1].ordinalRange.start = 4; },
  v => { v.cards[0].primaryObjectiveId = 'missing'; },
  v => { v.cards[0].sourceBlockIds = []; },
]) { const bad = clone(artifact); mutate(bad); assert.throws(() => validate(bad)); }
if (!process.argv.includes('--candidate-only')) {
  const runtime = require('../miniprogram/models/politics-learning-banks-runtime');
  assert.equal(runtime.recallCards.length, 145);
  for (const card of artifact.cards) {
    const live = runtime.recallCards.find(c => c.cardId === card.cardId);
    assert.equal(live.answer, card.answer);
    assert.equal(live.sourceReviewState, 'e21-source-reviewed');
    assert.ok(knowledgePackage.recallItems.some(c => c.id === card.cardId && c.answer === card.answer));
  }
  for (const binding of artifact.reusedCardBindings) {
    const live = runtime.recallCards.find(c => c.cardId === binding.cardId);
    assert.ok(live.supportingObjectiveIds.includes(binding.objectiveId));
    assert.ok(knowledgePackage.recallItems.find(c => c.id === binding.cardId).supportingObjectiveIds.includes(binding.objectiveId));
  }
  const platform = require('../miniprogram/services/knowledge-platform');
  const units = require('../miniprogram/services/knowledge-platform/systematic-units');
  const served = new Set();
  let cursor = 0;
  for (let round = 0; round < Math.ceil(runtime.recallCards.length / 4); round += 1) {
    const plan = platform.planLearningRoute(knowledgePackage, {type:'exam', scopeId:knowledgePackage.indexes.rootNavigationIds[0], examCursor:cursor});
    assert.equal(plan.steps.length, 4, 'default round size changed');
    plan.steps.forEach(step => served.add(step.recallItemId));
    cursor = plan.startProjection.nextCursor;
  }
  assert.equal(served.size, 145, 'runtime round selector silently omits cards');
  artifact.cards.forEach(card => assert.ok(served.has(card.cardId)));
  const group = units.curriculum.groups.find(g => g.lessonIds.includes('FOUND-02'));
  const unitPlan = platform.planLearningRoute(knowledgePackage, {type:'systematic', experienceKind:units.KIND, groupId:group.id});
  const previous = platform.createRouteSession(unitPlan, 1);
  previous.planId = unitPlan.id.replace(units.curriculum.curriculumVersion, 'units-31f3d2bfcbb3');
  previous.curriculumVersion = 'units-31f3d2bfcbb3';
  previous.packageVersion = 'kp1-a6-runtime-77a15fc82abc-lb-62c369874da5';
  previous.currentIndex = 1;
  previous.currentStepId = unitPlan.steps[1].stepId;
  previous.completedStepIds = [unitPlan.steps[0].stepId];
  const migrated = platform.normalizeRouteSession(unitPlan, previous);
  assert.equal(migrated.status, 'active');
  assert.equal(migrated.currentIndex, 1);
  assert.deepEqual(migrated.completedStepIds, previous.completedStepIds);
  assert.equal(new Set(runtime.recallCards.map(c => c.primaryObjectiveId)).size, 88);
  assert.equal(new Set(runtime.recallCards.flatMap(c => [c.primaryObjectiveId, ...c.supportingObjectiveIds])).size, 90);
}
console.log(JSON.stringify({status:'passed',newCards:9,maxAnswerCharacters:Math.max(...artifact.cards.map(c => c.answer.length)),fixedObjectives:4,reusedObjectives:2,systematicOnlyObjectives:7,negativeCasesRejected:6,runtime:!process.argv.includes('--candidate-only')}));
module.exports = { validate };
