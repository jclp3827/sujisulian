#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const source = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const c0 = require("../docs/knowledge-platform/content/common-sense-content-c0");
const { compile } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { createEngine } = require("../miniprogram/subpackages/common-sense/services/learning-engine");
const { STORAGE_KEY } = require("../miniprogram/services/common-sense-progress");

const clone = (value) => JSON.parse(JSON.stringify(value));
const results = [];
function test(name, fn) { fn(); results.push(name); }
function storage() {
  const data = {};
  return { data, getStorageSync: (key) => data[key] && clone(data[key]), setStorageSync: (key, value) => { data[key] = clone(value); } };
}

test("nine pilot targets and all three relation types compile deterministically", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.equal(pack.targets.length, 9);
  assert.equal(pack.targetRelations.questionTargets.length, 10);
  assert.equal(pack.targetRelations.mnemonicPhraseTargets.length, 6);
  assert.equal(pack.targetRelations.comparisonRowTargets.length, 6);
  assert.deepEqual(pack.targets.map((target) => target.id), c0.pilotTargets.map((target) => target.id));
});

test("target definitions and relations fail closed on structural drift", () => {
  const mutations = [
    (bad) => { bad.targets[1].id = bad.targets[0].id; },
    (bad) => { bad.targets[0].conditions = []; },
    (bad) => { bad.targets[0].refs[0].tabId = "missing"; },
    (bad) => { bad.targetRelations.questionTargets[0].primaryTargetIds = ["missing-target"]; },
    (bad) => { bad.targetRelations.questionTargets.pop(); },
    (bad) => { bad.targetRelations.mnemonicPhraseTargets[0].targetIds = ["cs-target-history-shiji-genre"]; },
    (bad) => { bad.targetRelations.comparisonRowTargets[0].rowIndex = 99; },
    (bad) => {
      const id = "cs-target-history-hanshu-genre";
      bad.targetRelations.questionTargets.forEach((row) => {
        row.primaryTargetIds = row.primaryTargetIds.filter((value) => value !== id);
        row.supportingTargetIds = row.supportingTargetIds.filter((value) => value !== id);
      });
      bad.targetRelations.mnemonicPhraseTargets.forEach((row) => { row.targetIds = row.targetIds.filter((value) => value !== id); });
      bad.targetRelations.comparisonRowTargets.forEach((row) => { row.targetIds = row.targetIds.filter((value) => value !== id); });
    },
  ];
  mutations.forEach((mutate) => { const bad = clone(source); mutate(bad); assert.throws(() => compile(bad, body)); });
});

test("C1a exposes targets without changing the legacy question-session version", () => {
  const current = availableContent(body, pack, true);
  const legacyPack = clone(pack); delete legacyPack.targets; delete legacyPack.targetRelations;
  const legacy = availableContent(body, legacyPack, true);
  assert.equal(current.targets.length, 9);
  assert.equal(current.targetRelations.questionTargets.length, 10);
  assert.equal(current.version, legacy.version);
  assert.notEqual(current.targetVersion, legacy.targetVersion);
  assert.deepEqual(current.questions, legacy.questions);
  assert.deepEqual(current.mnemonics, legacy.mnemonics);
  assert.equal(current.comparisons.length, 4);
  assert.deepEqual(legacy.comparisons.map((item) => item.id), ["minor-capacity-comparison", "civil-principles-comparison"]);
});

test("relation metadata revisions do not invalidate unchanged question sessions", () => {
  const current = availableContent(body, pack, true);
  const editedPack = clone(pack);
  editedPack.targetRelations.mnemonicPhraseTargets[0].wrongAnswerReviewAnchor = "phrase-0-explanation";
  const edited = availableContent(body, editedPack, true);
  assert.equal(edited.version, current.version);
  assert.notEqual(edited.targetVersion, current.targetVersion);
  assert.deepEqual(edited.questions, current.questions);
});

test("legacy question, reading, self-test and comparison sessions resume exactly", () => {
  const legacyPack = clone(pack); delete legacyPack.targets; delete legacyPack.targetRelations;
  const legacy = availableContent(body, legacyPack, true), current = availableContent(body, pack, true);
  const store = storage(), oldEngine = createEngine(legacy, store, () => Date.parse("2026-10-21T08:00:00Z"));

  const qa = oldEngine.start("qa", "science-technology", "selected", "", "sound-features").session;
  oldEngine.answer(qa, legacy.questions.find((q) => q.id === qa.ids[0]).answer); oldEngine.advance(qa);
  const savedRecord = clone(oldEngine.record(qa.ids[0]));
  const reading = oldEngine.startReading("science-technology", "c1a-reading", "sound-memory", 1).session;
  const selfTest = oldEngine.start("mnemonic", "science-technology", "selected", "sound-memory", "", 5, reading.key).session;
  const comparison = oldEngine.start("confusion", "law", "selected", "", "minor-capacity").session;

  const next = createEngine(current, store, () => Date.parse("2026-10-21T08:01:00Z"));
  assert.equal(next.start("qa", "science-technology", "selected", "", "sound-features").resumed, true);
  assert.equal(next.resume("mnemonic", reading.key).session.key, reading.key);
  assert.equal(next.start("mnemonic", "science-technology", "selected", "sound-memory", "", 5, reading.key).resumed, true);
  assert.equal(next.start("confusion", "law", "selected", "", "minor-capacity").resumed, true);
  assert.deepEqual(next.record(qa.ids[0]), savedRecord);
  assert.equal(Object.prototype.hasOwnProperty.call(next.state, "targetRecords"), false);
  assert.ok(Object.keys(next.state.records).every((id) => current.questions.some((q) => q.id === id)));
  assert.equal(selfTest.ids[0], "sound-pitch");
  assert.equal(comparison.flow.phase, "judge");
});

test("unavailable targets withdraw only their dependent resources at admission", () => {
  const changed = clone(pack);
  changed.targets.find((target) => target.id === "cs-target-sound-pitch-frequency").status = "blocked";
  const filtered = availableContent(body, changed, true);
  assert.equal(filtered.targets.length, 8);
  assert.equal(filtered.questions.some((q) => q.id === "sound-pitch"), false);
  assert.equal(filtered.mnemonics.some((m) => m.id === "sound-memory"), false);
  assert.equal(filtered.comparisons.some((c) => c.id === "sound-features-comparison"), false);
  assert.equal(filtered.questions.some((q) => q.id === "history-shiji"), true);
  assert.equal(filtered.mnemonics.some((m) => m.id === "history-genres-memory"), true);
  assert.equal(filtered.comparisons.some((c) => c.id === "history-genres-comparison"), true);
});

test("target admission is an additional gate and never promotes review content", () => {
  assert.equal(availableContent(body, pack, false).targets.length, 0);
  assert.equal(availableContent(body, pack, false).questions.length, 0);
  const approved = clone(pack), audited = clone(body);
  [...approved.targets, ...approved.questions, ...approved.mnemonics, ...approved.comparisons].forEach((item) => { item.status = "approved"; });
  audited.points.forEach((point) => { point.sourceAuditStatus = "approved"; });
  const released = availableContent(audited, approved, false);
  assert.equal(released.targets.length, 9);
  assert.equal(released.questions.length, pack.questions.length);
  assert.equal(released.mnemonics.length, 13);
  assert.equal(released.comparisons.length, 4);
});

test("C1a preserves question evidence and does not synthesize target mastery", () => {
  const content = availableContent(body, pack, true), store = storage(), engine = createEngine(content, store);
  const session = engine.start("qa", "humanities-history", "selected", "", "history-genres").session;
  engine.answer(session, content.questions.find((q) => q.id === session.ids[0]).answer); engine.advance(session);
  const saved = store.data[STORAGE_KEY];
  assert.deepEqual(Object.keys(saved.records), [session.ids[0]]);
  assert.equal(saved.records[session.ids[0]].outcome, "correct");
  assert.equal(saved.targetRecords, undefined);
  assert.equal(content.targetRelations.questionTargets.find((row) => row.questionId === "history-shiji").primaryTargetIds.length, 2);
});

console.log(JSON.stringify({ passed: true, checks: results.length, reports: results }, null, 2));
