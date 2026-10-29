const assert = require('assert/strict');
const { main } = require('../cloudfunctions/learningBank');
const { createCloudPractice } = require('../miniprogram/subpackages/note/services/cloud-practice-runtime');
const { loadCatalog, loadCardWindow } = require('../miniprogram/subpackages/note/services/cloud-memory-content');
const { createMemoryEngine } = require('../miniprogram/subpackages/note/services/memory-session');
const { loadCommonContent, hydrateQuestionWindow } = require('../miniprogram/subpackages/common-sense/services/cloud-learning-content');
const { createEngine } = require('../miniprogram/subpackages/common-sense/services/learning-engine');
const { loadPublicGuide, loadGuideCards } = require('../miniprogram/subpackages/common-sense/services/cloud-guide-content');
const { createGuideSession } = require('../miniprogram/subpackages/common-sense/services/guide-session');

const clone = (value) => JSON.parse(JSON.stringify(value));
function client() {
  const state = {};
  const calls = [];
  return {
    calls,
    getAccountInfoSync: () => ({ miniProgram: { envVersion: 'release' } }),
    getStorageSync: (key) => state[key] && clone(state[key]),
    setStorageSync: (key, value) => { state[key] = clone(value); },
    cloud: { async callFunction({ name, data }) {
      assert.equal(name, 'learningBank');
      calls.push(data);
      return { result: await main(data) };
    } },
  };
}

async function validate() {
  const api = client();
  const practice = await createCloudPractice(api, { kind: 'application', fresh: true });
  assert.equal(practice.content.resources.length, 0);
  assert.ok(practice.prefetched.length > 0 && practice.prefetched.length <= 5);
  const started = practice.engine.start({ kind: 'application', fresh: true });
  assert.ok(started.session && started.session.items.length > 0);
  assert.equal(started.session.snapshotVersion, 2);
  assert(started.session.items.every((item) => !item.prompt));
  const resumed = await createCloudPractice(api, { kind: 'application', sessionId: started.session.id });
  assert.equal(resumed.engine.getSession(started.session.id).items[0].resourceId,
    started.session.items[0].resourceId);
  assert.ok(api.calls.some((call) => call.action === 'resume'));

  const bank = await main({ bank: 'note-practice', mode: 'application', action: 'start', count: 5,
    attempts: { [started.session.items[0].resourceId]: { presentedGroups: 100 } } });
  assert.ok(!bank.session.ids.includes(started.session.items[0].resourceId));

  const catalog = await loadCatalog(api, 'basic');
  assert.equal(catalog.cards.length, 41);
  const memory = createMemoryEngine(catalog.cards, api);
  const round = memory.start('basic', { subjectId: 'all', categoryId: 'all' });
  assert.ok(round && round.items.length === 41);
  assert.equal(memory.get(round.id).current, null);
  memory.hydrate(await loadCardWindow(api, 'basic', catalog.version, round.scope,
    round.items.slice(0, 5).map((item) => item.id)));
  assert.equal(memory.get(round.id).current.id, round.items[0].id);
  memory.reveal(round.id);
  memory.assess(round.id, 'remembered');
  assert.equal(memory.get(round.id).current.id, round.items[1].id);

  const common = await loadCommonContent(api, 'qa');
  assert.equal(common.questions.length, 603);
  assert.equal(common.questions.filter((item) => item.stub).length, 603);
  const qa = createEngine(common, api);
  const qaRound = qa.start('qa').session;
  const ids = qaRound.ids.slice(0, 5);
  const hydrated = await hydrateQuestionWindow(api, 'qa', common.version, qaRound.scope, ids);
  hydrated.forEach((item) => qa.hydrateQuestion(item));
  assert.equal(common.questions.find((item) => item.id === ids[0]).stub, undefined);
  qa.answer(qaRound, null);
  assert.equal(qaRound.answers[ids[0]].type, 'reveal');

  const guide = await loadPublicGuide(api);
  assert.equal(guide.cards.length, 1681);
  const guideEngine = createGuideSession(guide, api);
  const guideRound = guideEngine.start({ scope: 'all', count: 5 }).session;
  assert.ok(guide.cardById[guideRound.ids[0]].content);
  const returnedGuide = await loadPublicGuide(api);
  assert.ok(returnedGuide.cardById[guideRound.ids[guideRound.index]].content);
  const full = await loadGuideCards(api, guide.version, guideRound.ids.slice(0, 5));
  assert.deepEqual(full.map((item) => item.id), guideRound.ids.slice(0, 5));

  const payloads = api.calls.filter((call) => ['hydrate', 'batch'].includes(call.action));
  assert.ok(payloads.every((call) => (call.ids || call.session.ids.slice(call.offset)).length <= 15));
  console.log('Cloud learning clients: practice resume, memory progress, QA answer, guide card passed');
}
validate().catch((error) => { console.error(error); process.exitCode = 1; });
