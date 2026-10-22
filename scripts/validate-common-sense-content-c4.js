#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const source = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const { compile } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryExamTopics, entryQuestions } = require("../miniprogram/subpackages/common-sense/services/learning-entry");
const { createEngine } = require("../miniprogram/subpackages/common-sense/services/learning-engine");
const { STORAGE_KEY } = require("../miniprogram/services/common-sense-progress");

const clone = (value) => JSON.parse(JSON.stringify(value));
const results = [];
function test(name, fn) { fn(); results.push(name); }
function storage() {
  const data = {};
  return { data, getStorageSync: (key) => data[key] && clone(data[key]), setStorageSync: (key, value) => { data[key] = clone(value); } };
}

const content = availableContent(body, pack, true);

test("C4 compiles two finite emergency topics with explicit reasons, boundaries and five-step plans", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.equal(pack.version, "2026-10-21.4");
  assert.equal(pack.examTopics.length, 2);
  for (const topic of pack.examTopics) {
    assert.equal(topic.questionIds.length, 5);
    assert.deepEqual(topic.questionSteps.map((step) => step.questionId), topic.questionIds);
    assert.ok(topic.task && topic.coverage && topic.completionScope);
    assert.ok(topic.inclusionReasons.length >= 1 && topic.excludes.length >= 1);
    assert.ok(topic.excludes.some((text) => text.includes("不") && text.includes("高频押题")));
  }
});

test("emergency topic contract fails closed when scope, reason, step, target or review material is missing", () => {
  const mutations = [
    (bad) => { delete bad.examTopics[0].completionScope; },
    (bad) => { bad.examTopics[0].inclusionReasons = []; },
    (bad) => { bad.examTopics[0].questionSteps.pop(); },
    (bad) => { bad.examTopics[0].targetIds[0] = "missing-target"; },
    (bad) => { bad.examTopics[0].comparisonIds = []; },
  ];
  mutations.forEach((mutate) => { const bad = clone(source); mutate(bad); assert.throws(() => compile(bad, body)); });
});

test("selected emergency review uses only the two declared topics and respects 5, 10 and 15 presets", () => {
  assert.deepEqual(entryExamTopics(content).map((topic) => topic.id), ["sound-features-rescue", "history-genres-rescue"]);
  const fiveStore = storage(), fiveEngine = createEngine(content, fiveStore, () => Date.parse("2026-10-21T09:00:00Z"));
  const first = fiveEngine.start("exam", "all", "selected", "", "", 5).session;
  assert.deepEqual(first.topicIds, ["sound-features-rescue"]); assert.equal(first.ids.length, 5);
  first.ids.forEach(() => fiveEngine.advance(first));
  const second = fiveEngine.start("exam", "all", "selected", "", "", 5).session;
  assert.deepEqual(second.topicIds, ["history-genres-rescue"]); assert.equal(second.ids.length, 5);
  const ten = createEngine(content, storage()).start("exam", "all", "selected", "", "", 10).session;
  assert.deepEqual(ten.topicIds, ["sound-features-rescue", "history-genres-rescue"]); assert.equal(ten.ids.length, 10);
  const fifteen = createEngine(content, storage()).start("exam", "all", "selected", "", "", 15).session;
  assert.equal(fifteen.ids.length, 10);
  assert.ok(fifteen.ids.every((id) => pack.examTopics.some((topic) => topic.questionIds.includes(id))));
  assert.ok(Object.values(fifteen.reasons).every((reason) => reason.includes("补缺")));
});

test("personal review stays empty without user records and explains the actual review cause when present", () => {
  const store = storage(), engine = createEngine(content, store, () => Date.parse("2026-10-21T09:00:00Z"));
  assert.deepEqual(engine.start("exam", "all", "review", "", "", 5).session.ids, []);
  const qa = engine.start("qa", "science-technology", "selected", "", "sound-features", 5).session;
  const id = qa.ids[0], question = content.questions.find((item) => item.id === id);
  engine.answer(qa, (question.answer + 1) % question.options.length); engine.advance(qa);
  const review = engine.start("exam", "all", "review", "", "", 5).session;
  assert.deepEqual(review.ids, [id]); assert.equal(review.reasons[id], "个人待回顾 · 上次答错");
});

test("daily admits exactly two declared reuse questions, keeps budgets and freezes the same-day group", () => {
  assert.equal(entryQuestions(content, "daily").length, 47);
  assert.deepEqual(pack.entryPlans.modes.daily.featuredQuestionIds, ["sound-loudness-condition", "history-hanshu-genre"]);
  assert.equal(pack.entryPlans.modes.daily.maxItems, 5); assert.equal(pack.entryPlans.modes.daily.maxReview, 2);
  const store = storage(), engine = createEngine(content, store, () => Date.parse("2026-10-21T09:00:00Z"));
  const first = engine.start("daily").session, ids = first.ids.slice();
  const again = engine.start("daily");
  assert.equal(again.resumed, true); assert.deepEqual(again.session.ids, ids);
});

test("C4 migration preserves unfinished C3 question queues while new sessions use the new orchestration", () => {
  const store = storage(), engine = createEngine(content, store, () => Date.parse("2026-10-21T09:00:00Z"));
  const daily = engine.start("daily").session;
  const legacy = engine.start("exam", "humanities-history", "selected", "", "poet-titles", 5).session;
  store.data[STORAGE_KEY].sessions[daily.key].version = "4850e389";
  store.data[STORAGE_KEY].sessions[legacy.key].version = "4850e389";
  const next = createEngine(content, store, () => Date.parse("2026-10-21T09:01:00Z"));
  assert.equal(next.start("daily").resumed, true);
  assert.equal(next.start("exam", "humanities-history", "selected", "", "poet-titles", 5).resumed, true);
});

test("review candidates and emergency topics remain closed in formal admission", () => {
  const formal = availableContent(body, pack, false);
  assert.equal(formal.examTopics.length, 0);
  assert.equal(entryExamTopics(formal).length, 0);
});

console.log(JSON.stringify({ passed: true, checks: results.length, contentVersion: content.version, reports: results }, null, 2));
