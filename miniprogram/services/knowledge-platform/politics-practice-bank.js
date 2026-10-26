const appliedBank = require('../../models/politics-applied-questions-runtime');
const runtimeLearningBanks = require('../../models/politics-learning-banks-compact');
const curriculum = require('../../models/politics-systematic-units-compact');
const { knowledgePackage } = require('./politics-runtime');

const THOUGHT_ROOT = 'politics-toc-v2-n002';
const PRINCIPLES_ROOT = 'politics-toc-v2-n024';

function shortHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function createPoliticsPracticeBank(options = {}) {
  const applications = options.appliedBank || appliedBank;
  const learningBanks = options.runtimeLearningBanks || runtimeLearningBanks;
  const pkg = options.knowledgePackage || knowledgePackage;
  const systematic = options.curriculum || curriculum;
  const nodes = new Map(pkg.navigationNodes.map(node => [node.id, node]));
  const units = new Map(pkg.knowledgeUnits.map(unit => [unit.id, unit]));
  const blocks = new Map(pkg.knowledgeUnits.flatMap(unit => unit.blocks.map(block => [block.id, block])));
  const recalls = new Map(pkg.recallItems.map(item => [item.id, item]));
  const projections = new Map(pkg.recallProjections.map(item => [item.recallItemId, item]));
  const groups = new Map(systematic.groups.map(group => [group.id, group]));
  const lessons = new Map(systematic.lessons.map(lesson => [lesson.id, lesson]));

  function scopeForUnit(unitId) {
    const unit = units.get(unitId);
    if (!unit) throw new Error(`Practice unit is unavailable: ${unitId}`);
    let nodeId = unit.navigationNodeId;
    const seen = new Set();
    while (nodeId && !seen.has(nodeId)) {
      if (nodeId === THOUGHT_ROOT) return 'thought';
      if (nodeId === PRINCIPLES_ROOT) return 'principles';
      seen.add(nodeId);
      nodeId = nodes.get(nodeId)?.parentId || null;
    }
    throw new Error(`Practice scope is unavailable: ${unitId}`);
  }

  const applicationGroups = applications.groups.map((group, order) => {
    if (scopeForUnit(group.unitId) !== group.scope) throw new Error(`${group.groupId}: application scope mismatch`);
    return {
      ...group,
      id: group.groupId,
      kind: 'application',
      itemIds: [...group.questionIds],
      order: order + 1,
    };
  });
  const applicationGroupById = new Map(applicationGroups.map(group => [group.id, group]));
  const applicationItems = applications.questions.map(question => {
    const group = applicationGroupById.get(question.groupId);
    if (!group || scopeForUnit(question.unitId) !== group.scope) throw new Error(`${question.questionId}: application group mismatch`);
    return {
      ...question,
      id: question.questionId,
      kind: 'application',
      assessment: 'choice',
      subtype: question.questionType,
      scope: group.scope,
      topicGroupId: '',
      sourceTarget: null,
    };
  });

  const recallItems = learningBanks.recallCards.map(card => {
    const recall = recalls.get(card.cardId);
    const projection = projections.get(card.cardId);
    const group = groups.get(card.practiceGroupId);
    const lesson = lessons.get(card.practiceLessonId);
    if (!recall || !projection || !group || !lesson || lesson.groupId !== group.id || group.routeId !== card.practiceRouteId) {
      throw new Error(`${card.cardId}: recall practice binding is unavailable`);
    }
    const scope = scopeForUnit(card.unitId);
    if (scope !== card.practiceRouteId) throw new Error(`${card.cardId}: recall practice scope mismatch`);
    const target = projection.returnTarget;
    if (!target || !units.has(target.pointId) || !blocks.has(target.blockId)) {
      throw new Error(`${card.cardId}: recall source target is unavailable`);
    }
    return {
      id: card.cardId,
      kind: 'recall',
      assessment: 'self-report',
      subtype: card.cardType,
      scope,
      groupId: `recall-topic:${group.id}`,
      topicGroupId: group.id,
      topicTitle: group.title,
      lessonId: lesson.id,
      unitId: card.unitId,
      primaryObjectiveId: card.primaryObjectiveId,
      prompt: recall.prompt,
      answer: recall.answer,
      pitfall: recall.pitfall,
      sourceBlockIds: [...recall.sourceBlockIds],
      sourceTarget: { unitId: target.pointId, blockId: target.blockId },
      contentVersion: card.practiceVersion,
      order: card.order,
    };
  });
  const recallItemsByTopic = new Map(systematic.groups.map(group => [group.id, []]));
  recallItems.forEach(item => recallItemsByTopic.get(item.topicGroupId).push(item));
  const recallGroups = systematic.groups.map((group, order) => {
    const items = recallItemsByTopic.get(group.id).sort((left, right) => left.order - right.order);
    if (items.length < 2 || items.some(item => item.scope !== group.routeId)) {
      throw new Error(`${group.id}: recall practice topic is incomplete`);
    }
    return {
      id: `recall-topic:${group.id}`,
      groupId: `recall-topic:${group.id}`,
      topicGroupId: group.id,
      kind: 'recall',
      title: group.title,
      scope: group.routeId,
      routeId: group.routeId,
      order: order + 1,
      itemIds: items.map(item => item.id),
      questionIds: items.map(item => item.id),
      contentVersion: `practice-topic-${shortHash(items.map(item => `${item.id}:${item.contentVersion}`).join('|'))}`,
    };
  });
  const items = [...applicationItems, ...recallItems];
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('Practice item IDs must be unique');
  return {
    schemaVersion: 1,
    id: 'politics-practice-bank-v1',
    bankVersion: `${applications.bankVersion}:${learningBanks.bankVersion}:${systematic.curriculumVersion}`,
    applicationBankVersion: applications.bankVersion,
    recallBankVersion: learningBanks.bankVersion,
    curriculumVersion: systematic.curriculumVersion,
    items,
    applicationItems,
    recallItems,
    groups: [...applicationGroups, ...recallGroups],
    applicationGroups,
    recallGroups,
    sessionPolicy: {
      daily: {
        ...applications.sessionPolicy.daily,
        recallGroupQuestionCount: [2, 3],
        relatedRecallMax: 2,
        newErrorCorrectionMax: 1,
      },
      qa: {
        ...applications.sessionPolicy.qa,
        typeFilters: ['mixed', 'recall', 'application'],
        mixedRecallRatio: 0.6,
      },
    },
  };
}

module.exports = createPoliticsPracticeBank();
module.exports.createPoliticsPracticeBank = createPoliticsPracticeBank;
