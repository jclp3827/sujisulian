#!/usr/bin/env node

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const bank = require(path.join(ROOT, 'miniprogram/services/knowledge-platform/politics-practice-bank'));
const applied = require(path.join(ROOT, 'miniprogram/models/politics-applied-questions-runtime'));
const learningBanks = require(path.join(ROOT, 'miniprogram/models/politics-learning-banks-runtime'));
const { knowledgePackage } = require(path.join(ROOT, 'miniprogram/services/knowledge-platform/politics-runtime'));
const { STORAGE_KEY, createPoliticsPracticeEngine, readPoliticsPracticeHome } = require(path.join(ROOT, 'miniprogram/services/knowledge-platform/politics-practice'));

const copy = value => JSON.parse(JSON.stringify(value));
const day = Date.parse('2026-10-22T09:00:00+08:00');
const startOfDay = Date.parse('2026-10-22T00:00:00+08:00');

function memory(initial = {}) {
  const data = copy(initial);
  const writes = [];
  return {
    data,
    writes,
    getStorageSync(key) { return data[key] === undefined ? null : copy(data[key]); },
    setStorageSync(key, value) { writes.push(key); data[key] = copy(value); },
  };
}

function emptyPracticeState() {
  return { schema: 1, records: {}, sessions: {}, preferences: {}, groupHistory: {}, exposures: {} };
}

function completeCurrent(engine, session, recallOutcome = 'remembered') {
  const item = engine.item(session.ids[session.index]);
  if (item.kind === 'application') engine.answer(session, item.answerIndex);
  else {
    engine.reveal(session);
    engine.assessRecall(session, recallOutcome);
  }
  assert.equal(engine.advance(session), true);
  return item;
}

function completeSession(engine, session, recallOutcome = 'remembered') {
  const items = [];
  while (session.index < session.ids.length) items.push(completeCurrent(engine, session, recallOutcome));
  return items;
}

function dueRecord(item, at, due) {
  return item.kind === 'recall'
    ? { kind: 'recall', contentVersion: item.contentVersion, at, due, again: true, outcome: 'fuzzy' }
    : { contentVersion: item.contentVersion, at, due, again: true, outcome: 'wrong' };
}

const previous = require('../docs/knowledge-platform/implementations/evidence/shared-recall-continuation-20261025/before-bank');
const revision = require('../docs/knowledge-pilot/sources/politics/politics-shared-recall-revision-v3.json');
const gapRevision=require('../docs/knowledge-pilot/sources/politics/politics-shared-recall-revision-v4.json');
const expectedP2Definitions = previous.recallCards.filter(c=>!revision.retirements.some(r=>r.id===c.cardId)).map(c=>({...c,...revision.patches[c.cardId]})).concat(revision.additions.map(c=>({...previous.recallCards.find(p=>p.cardId===c.parentCardId),...c})));
const expectedDefinitions=expectedP2Definitions.map(c=>({...c,...gapRevision.patches[c.cardId]})).concat(gapRevision.additions);
const expectedRecallCount = previous.recallCards.length-revision.retirements.length+revision.additions.length+gapRevision.additions.length;
assert.equal(bank.items.length,expectedRecallCount+24);
assert.equal(bank.applicationItems.length,24);assert.equal(bank.recallItems.length,expectedRecallCount);
assert.equal(new Set(bank.items.map(c=>c.id)).size,expectedRecallCount+24);assert.equal(bank.applicationGroups.length,8);assert.equal(bank.recallGroups.length,21);
assert.deepEqual(Object.fromEntries(['thought','principles'].map(scope=>[scope,bank.recallItems.filter(c=>c.scope===scope).length])),Object.fromEntries(['thought','principles'].map(scope=>[scope,expectedDefinitions.filter(c=>(c.practiceBindingOverride?.routeId||c.practiceRouteId)===scope).length])));
const types=[...new Set(expectedDefinitions.map(c=>c.cardType))].sort();assert.deepEqual(types.map(type=>[type,bank.recallItems.filter(c=>c.subtype===type).length]),types.map(type=>[type,expectedDefinitions.filter(c=>c.cardType===type).length]));


const appliedById = new Map(applied.questions.map(item => [item.questionId, item]));
bank.applicationItems.forEach(item => {
  const original = appliedById.get(item.id);
  assert.ok(original);
  assert.equal(item.contentVersion, original.contentVersion);
  assert.deepEqual(item.options, original.options);
  assert.equal(item.answerIndex, original.answerIndex);
});
assert.equal(new Set(bank.recallItems.map(item => item.contentVersion)).size, expectedRecallCount);
bank.recallItems.forEach(item => assert.match(item.contentVersion, /^practice-recall-[0-9a-f]{12}$/));
assert.match(learningBanks.bankVersion, /^learning-banks-[0-9a-f]{12}$/);
knowledgePackage.recallItems.forEach(item => {
  assert.equal(item.contentVersion, learningBanks.recallCards.find(card=>card.cardId===item.id).recallVersion);
  assert.notEqual(item.contentVersion, bank.recallItems.find(candidate => candidate.id === item.id).contentVersion);
});

const unitById = new Map(knowledgePackage.knowledgeUnits.map(unit => [unit.id, unit]));
const blockById = new Map(knowledgePackage.knowledgeUnits.flatMap(unit => unit.blocks.map(block => [block.id, block])));
bank.recallItems.forEach(item => {
  assert.ok(unitById.has(item.sourceTarget.unitId));
  assert.ok(blockById.has(item.sourceTarget.blockId));
  assert.equal(blockById.get(item.sourceTarget.blockId).unitId, item.sourceTarget.unitId);
});
const crossUnit = bank.recallItems.find(item => item.id === 'politics-recall-v1-u003-seven');
assert.deepEqual(crossUnit.sourceTarget, { unitId: 'politics-toc-v2-u003', blockId: 'block:politics-toc-v2-u003:b011' });
bank.recallGroups.forEach(group => assert.ok(group.itemIds.length >= 1));
bank.applicationGroups.forEach(group => {
  assert.equal(group.itemIds.length, 3);
  assert.ok(bank.recallItems.some(item => group.objectiveIds.includes(item.primaryObjectiveId)));
});

for (const dueCount of [0, 1, 2]) {
  const state = emptyPracticeState();
  bank.recallItems.slice(0, dueCount).forEach((item, index) => {
    state.records[item.id] = dueRecord(item, day - (index + 1) * 1000, startOfDay);
    state.exposures[item.id] = { contentVersion: item.contentVersion, at: day - (index + 1) * 1000 };
  });
  const store = memory({ [STORAGE_KEY]: state });
  const engine = createPoliticsPracticeEngine(bank, store, () => day, () => 0);
  const session = engine.start('daily').session;
  const applicationIds = session.ids.filter(id => engine.item(id).kind === 'application');
  const newRecallIds = session.ids.filter(id => engine.item(id).kind === 'recall' && session.reasons[id] !== '到期回顾');
  assert.equal(applicationIds.length, 3, `due${dueCount}: application group must remain complete`);
  assert.deepEqual(applicationIds, engine.group(session.groupId).itemIds);
  assert.ok(newRecallIds.length <= 2 - dueCount);
  newRecallIds.forEach(id => assert.ok(engine.group(session.groupId).objectiveIds.includes(engine.item(id).primaryObjectiveId)));
  assert.equal(session.ids.length, dueCount + 3 + newRecallIds.length);
}

for (const count of [5, 10, 15]) {
  const engine = createPoliticsPracticeEngine(bank, memory(), () => day, () => 0);
  const session = engine.start('qa', { scope: 'all', count, typeFilter: 'mixed' }).session;
  const kinds = session.ids.map(id => engine.item(id).kind);
  assert.equal(kinds.filter(kind => kind === 'recall').length, Math.round(count * 0.6));
  assert.equal(kinds.filter(kind => kind === 'application').length, count - Math.round(count * 0.6));
  assert.deepEqual(Object.keys(session.optionOrders).sort(), session.ids.filter(id => engine.item(id).kind === 'application').sort());
}
for (const typeFilter of ['recall', 'application']) {
  const engine = createPoliticsPracticeEngine(bank, memory(), () => day, () => 0);
  const session = engine.start('qa', { scope: 'all', count: 5, typeFilter }).session;
  assert.ok(session.ids.every(id => engine.item(id).kind === typeFilter));
  assert.match(session.key, new RegExp(`:${typeFilter}$`));
}

{
  const engine = createPoliticsPracticeEngine(bank, memory(), () => day, () => 0);
  const qa = engine.start('qa', { scope: 'all', count: 5, typeFilter: 'mixed' }).session;
  completeSession(engine, qa);
  const qaApplicationIds = new Set(qa.ids.filter(id => engine.item(id).kind === 'application'));
  const daily = engine.start('daily').session;
  const dailyApplicationIds = daily.ids.filter(id => engine.item(id).kind === 'application');
  assert.equal(dailyApplicationIds.length, 3, 'daily must still choose a complete fresh application group');
  assert.ok(dailyApplicationIds.every(id => !qaApplicationIds.has(id)), 'QA answers must not immediately repeat in daily');
  assert.deepEqual(dailyApplicationIds, engine.group(daily.groupId).itemIds);
}

for (const [outcome, days] of [['remembered', 3], ['fuzzy', 1], ['missed', 1]]) {
  const store = memory();
  const engine = createPoliticsPracticeEngine(bank, store, () => day, () => 0);
  const session = engine.start('qa', { scope: 'all', count: 5, typeFilter: 'recall' }).session;
  const id = session.ids[0];
  assert.equal(engine.assessRecall(session, outcome), false, 'recall cannot be assessed before reveal');
  assert.equal(engine.reveal(session), true);
  assert.equal(engine.advance(session), false, 'revealed recall cannot advance before self-report');
  assert.equal(engine.assessRecall(session, outcome), true);
  assert.equal(engine.advance(session), true);
  assert.equal(engine.state.records[id].outcome, outcome);
  assert.equal(engine.state.records[id].due, startOfDay + days * 86400000);
}
{
  const engine = createPoliticsPracticeEngine(bank, memory(), () => day, () => 0);
  const session = engine.start('qa', { count: 5, typeFilter: 'recall' }).session;
  const id = session.ids[0];
  assert.equal(engine.advance(session), true);
  assert.equal(engine.state.records[id], undefined, 'skip must not create a mastery record');
  assert.ok(engine.state.exposures[id], 'skip keeps a non-mastery exposure fact');
}

{
  const store = memory();
  const engine = createPoliticsPracticeEngine(bank, store, () => day, () => 0);
  const session = engine.start('qa', { count: 5, typeFilter: 'mixed' }).session;
  completeSession(engine, session, 'fuzzy');
  const result = engine.result(session);
  assert.equal(result.application.correct, 2);
  assert.equal(result.recall.fuzzy, 3);
  assert.equal(result.recall.remembered, 0);
  assert.equal(result.correct, result.application.correct, 'legacy top-level count must remain application-only');
}

{
  const group = bank.applicationGroups[0];
  const ids = [...group.itemIds];
  const first = bank.applicationItems.find(item => item.id === ids[0]);
  const oldSession = {
    key: 'daily:all', mode: 'daily', scope: 'all', count: 5, bankVersion: applied.bankVersion,
    day: '2026-10-22', ids, reasons: Object.fromEntries(ids.map(id => [id, group.title])), groupId: group.id,
    index: 1, answers: { [first.id]: { type: 'choice', choice: first.answerIndex } }, updatedAt: day,
    questionVersions: Object.fromEntries(ids.map(id => [id, appliedById.get(id).contentVersion])),
    optionOrders: Object.fromEntries(ids.map(id => [id, appliedById.get(id).options.map((_, index) => index)])),
  };
  const state = emptyPracticeState();
  delete state.exposures;
  state.sessions['daily:all'] = copy(oldSession);
  state.groupHistory[group.id] = { at: day, contentVersion: group.contentVersion };
  const engine = createPoliticsPracticeEngine(bank, memory({ [STORAGE_KEY]: state }), () => day, () => 0);
  const resumed = engine.start('daily');
  assert.equal(resumed.resumed, true);
  assert.deepEqual(resumed.session.ids, oldSession.ids);
  assert.equal(resumed.session.index, oldSession.index);
  assert.deepEqual(resumed.session.answers, oldSession.answers);
  assert.deepEqual(resumed.session.optionOrders, oldSession.optionOrders);
}

{
  const ids = bank.applicationItems.slice(0, 5).map(item => item.id);
  const oldQa = {
    key: 'qa:all:5', mode: 'qa', scope: 'all', count: 5, bankVersion: applied.bankVersion,
    day: '2026-10-21', ids, reasons: {}, groupId: '', index: 0, answers: {}, updatedAt: day,
    questionVersions: Object.fromEntries(ids.map(id => [id, appliedById.get(id).contentVersion])),
    optionOrders: Object.fromEntries(ids.map(id => [id, appliedById.get(id).options.map((_, index) => index)])),
  };
  const state = emptyPracticeState();
  state.sessions['qa:all:5'] = oldQa;
  const engine = createPoliticsPracticeEngine(bank, memory({ [STORAGE_KEY]: state }), () => day, () => 0);
  assert.equal(engine.start('qa', { scope: 'all', count: 5, typeFilter: 'mixed' }).resumed, true);
}

{
  const [first, second] = bank.recallItems;
  const state = emptyPracticeState();
  state.records[first.id] = dueRecord(first, day, startOfDay + 3 * 86400000);
  state.records[second.id] = dueRecord(second, day, startOfDay + 3 * 86400000);
  const changed = { ...bank,
    items: bank.items.map(item => item.id === first.id ? { ...item, contentVersion: `${item.contentVersion}-changed` } : item),
    recallItems: bank.recallItems.map(item => item.id === first.id ? { ...item, contentVersion: `${item.contentVersion}-changed` } : item),
  };
  const engine = createPoliticsPracticeEngine(changed, memory({ [STORAGE_KEY]: state }), () => day, () => 0);
  assert.equal(engine.state.records[first.id], undefined);
  assert.ok(engine.state.records[second.id]);
}

{
  const examSentinel = { planId: 'exam-sentinel', session: { currentIndex: 9 } };
  const store = memory({ 'knowledgeRoute:politics:exam': examSentinel });
  const engine = createPoliticsPracticeEngine(bank, store, () => day, () => 0);
  completeSession(engine, engine.start('daily').session);
  completeSession(engine, engine.start('qa', { count: 5, typeFilter: 'mixed' }).session);
  assert.deepEqual(store.data['knowledgeRoute:politics:exam'], examSentinel);
  assert.ok(store.writes.every(key => key === STORAGE_KEY));
}

{
  const state = emptyPracticeState();
  bank.applicationItems.forEach(item => {
    state.records[item.id] = dueRecord(item, day, startOfDay + 30 * 86400000);
    state.exposures[item.id] = { contentVersion: item.contentVersion, at: day };
  });
  bank.applicationGroups.forEach(group => { state.groupHistory[group.id] = { at: day, contentVersion: group.contentVersion }; });
  const engine = createPoliticsPracticeEngine(bank, memory({ [STORAGE_KEY]: state }), () => day, () => 0);
  const session = engine.start('daily').session;
  const topicIds = new Set(session.ids.map(id => engine.item(id).topicGroupId));
  assert.ok(session.ids.length >= 2 && session.ids.length <= 3);
  assert.deepEqual([...topicIds].length, 1);
  assert.ok(session.ids.every(id => engine.item(id).kind === 'recall'));
}

{
  const store = memory();
  let now = day;
  const engine = createPoliticsPracticeEngine(bank, store, () => now, () => 0);
  const reached = new Set();
  for (let round = 0; round < 220 && reached.size < expectedRecallCount; round += 1) {
    const session = engine.start('daily').session;
    assert.ok(session.ids.length, `daily coverage stopped at ${reached.size} recall cards`);
    const applicationGroup = bank.applicationGroups.find(group => group.id === session.groupId);
    if (applicationGroup) assert.ok(applicationGroup.itemIds.every(id => session.ids.includes(id)), 'application group was split');
    while (session.index < session.ids.length) {
      const item = engine.item(session.ids[session.index]);
      const seenBefore = reached.has(item.id) || Boolean(engine.state.exposures[item.id]);
      if (seenBefore) assert.equal(session.reasons[item.id], '到期回顾', 'repeat was used to pad new content');
      completeCurrent(engine, session);
      if (item.kind === 'recall') reached.add(item.id);
    }
    now += 86400000;
  }
  assert.equal(reached.size, expectedRecallCount, 'all recall cards must remain reachable through daily practice');
}

{
  const store = memory();
  let now = day;
  const engine = createPoliticsPracticeEngine(bank, store, () => now, () => 0);
  const reached = new Set();
  for (let group = 0; group < 10; group += 1) {
    const session = engine.start('qa', { count: 5, typeFilter: 'recall' }).session;
    assert.equal(session.ids.length, 5);
    while (session.index < session.ids.length) {
      reached.add(session.ids[session.index]);
      assert.equal(engine.advance(session), true); // Skip records exposure, not mastery.
    }
  }
  for (let round = 0; round < 100 && reached.size < expectedRecallCount; round += 1) {
    const session = engine.start('daily').session;
    assert.ok(session.ids.length, `cross-mode daily coverage stopped at ${reached.size} recall cards`);
    while (session.index < session.ids.length) {
      const item = engine.item(session.ids[session.index]);
      if (item.kind === 'recall') reached.add(item.id);
      assert.equal(engine.advance(session), true);
    }
    now += 86400000;
  }
  assert.equal(reached.size, expectedRecallCount, 'QA history must not strand a one-card topic tail from daily practice');
}

{
  const regularGroup = bank.recallGroups[0];
  const tailGroup = bank.recallGroups[1];
  const regularIds = regularGroup.itemIds.slice(0, 2);
  const tailId = tailGroup.itemIds[0];
  const unseen = new Set([...regularIds, tailId]);
  const state = emptyPracticeState();
  bank.items.filter(item => !unseen.has(item.id)).forEach(item => {
    state.exposures[item.id] = { contentVersion: item.contentVersion, at: day };
  });
  bank.applicationGroups.forEach(group => {
    state.groupHistory[group.id] = { at: day, contentVersion: group.contentVersion };
  });
  let now = day;
  const engine = createPoliticsPracticeEngine(bank, memory({ [STORAGE_KEY]: state }), () => now, () => 0);
  assert.equal(engine.hasNewContent(), true);
  const regular = engine.start('daily').session;
  assert.equal(regular.groupId, regularGroup.id, 'normal two-card topic must precede a one-card tail');
  assert.deepEqual(regular.ids, regularIds);
  while (regular.index < regular.ids.length) assert.equal(engine.advance(regular), true);
  now += 86400000;
  assert.equal(engine.hasNewContent(), true, 'one-card tail must remain visible as new content');
  const tail = engine.start('daily').session;
  assert.equal(tail.groupId, tailGroup.id);
  assert.deepEqual(tail.ids, [tailId]);
  assert.equal(engine.advance(tail), true);
  now += 86400000;
  assert.equal(engine.hasNewContent(), false, 'new-content state must close after the tail is exposed');
}

const pageWxml = fs.readFileSync(path.join(ROOT, 'miniprogram/subpackages/politics/practice/index.wxml'), 'utf8');
const pageJs = fs.readFileSync(path.join(ROOT, 'miniprogram/subpackages/politics/practice/index.js'), 'utf8');
const adapterJs = fs.readFileSync(path.join(ROOT, 'miniprogram/services/knowledge-platform/politics-practice-bank.js'), 'utf8');
const recallComponentWxml = fs.readFileSync(path.join(ROOT, 'miniprogram/components/knowledge-card-surface/index.wxml'), 'utf8');
const pageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'miniprogram/subpackages/politics/practice/index.json'), 'utf8'));
const uiSource = `${pageJs}\n${pageWxml}\n${recallComponentWxml}`;
for (const marker of ['综合', '主动回忆', '理解应用', '揭晓答案', '记住', '模糊', '没想起', '查看主要原文']) {
  assert.ok(uiSource.includes(marker), `practice UI missing ${marker}`);
}
assert.equal(pageJson.usingComponents['knowledge-card-surface'], '/components/knowledge-card-surface/index');
assert.ok(!pageWxml.includes('progressbar'));
assert.ok(!pageWxml.includes('查看主要原文'), 'recall source action must not be duplicated inside the card');
assert.ok(pageWxml.includes('>查看原文</view>'), 'recall source action must stay in the right dock slot');
bank.recallItems.slice(0, 5).forEach(item => {
  assert.ok(!adapterJs.includes(item.prompt) && !adapterJs.includes(item.answer), 'practice adapter must not copy recall content literals');
});

console.log(JSON.stringify({
  status: 'passed',
  items: bank.items.length,
  applications: bank.applicationItems.length,
  recalls: bank.recallItems.length,
  topics: bank.recallGroups.length,
  oldSchemaCompatible: true,
  examStorageIsolated: true,
  allRecallCardsReachable: true,
  crossModeRecallReachable: true,
  crossModeApplicationNoImmediateRepeat: true,
  adapterCopiesRecallContent: false,
  realUserRecordsUsed: false,
}));
