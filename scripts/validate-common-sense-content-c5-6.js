#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const source = require("../docs/knowledge-platform/content/common-sense-learning-v1");
const c56 = require("../docs/knowledge-platform/content/common-sense-content-c5-6");
const ledger = require("../docs/knowledge-platform/implementations/common-sense-content-c5-ledger.json");
const { compile, buildInventory } = require("./build-common-sense-learning");
const { availableContent } = require("../miniprogram/subpackages/common-sense/services/learning-content");
const { entryQuestions, entryMnemonics } = require("../miniprogram/subpackages/common-sense/services/learning-entry");
const { createEngine } = require("../miniprogram/subpackages/common-sense/services/learning-engine");
const { STORAGE_KEY } = require("../miniprogram/services/common-sense-progress");
const clone = (v) => JSON.parse(JSON.stringify(v));
const reports = []; function test(name, fn) { fn(); reports.push(name); }
function storage() { const data = {}; return { data, getStorageSync: (k) => data[k] && clone(data[k]), setStorageSync: (k, v) => { data[k] = clone(v); } }; }
const content = availableContent(body, pack, true);
const questionIds = c56.addedQuestions.map((item) => item.id), targetIds = c56.targets.map((item) => item.id), mnemonicIds = c56.mnemonics.map((item) => item.id);

test("C5-6 remains present after later C5 batches", () => {
  assert.deepEqual(compile(source, body), pack);
  assert.ok(pack.questions.length >= 92); assert.ok(pack.groups.length >= 23); assert.ok(pack.targets.length >= 46); assert.ok(pack.mnemonics.length >= 21);
  assert.ok(buildInventory(pack, body).totals.mappedDetailUnits >= 25); assert.ok(buildInventory(pack, body).totals.mappedTabs >= 41);
  assert.deepEqual(c56.groups.map((item) => item.questionIds.length), [4, 5]);
});
test("C5-6 closes monopoly and externality mechanism candidates", () => {
  c56.sourceDispositions.forEach((row) => assert.ok(ledger.entries.some((entry) => entry.candidateId === row.candidateId && entry.status === "已建设" && entry.batch === "C5-6")));
});
test("every new target has a direct and a different recheck", () => {
  targetIds.forEach((id) => { const d = pack.variationDecisions.find((item) => item.targetId === id); assert.ok(d && d.directQuestionIds.length && d.variationQuestionIds.length && !d.directQuestionIds.some((q) => d.variationQuestionIds.includes(q))); });
  questionIds.forEach((id) => { const q = pack.questions.find((item) => item.id === id), s = pack.questionSpecifications.find((item) => item.questionId === id); assert.deepEqual(Object.keys(s.distractorReasons).map(Number).sort(), q.options.map((_, i) => i).filter((i) => i !== q.answer)); });
});
test("both C5-6 mnemonics have complete phrase checks", () => {
  mnemonicIds.forEach((id) => { const m = pack.mnemonics.find((item) => item.id === id); assert.ok(m.conditions.length && m.excludes.length); m.phrases.forEach((p) => assert.deepEqual(p.questionIds, p.checks.map((c) => c.questionId))); });
});
test("C5-6 enrolls only Q&A and mnemonic", () => {
  assert.ok(pack.entryPlans.revision >= 12); assert.ok(entryQuestions(content, "qa").length >= 92); assert.ok(entryQuestions(content, "mnemonic").length >= 84); assert.ok(entryMnemonics(content).length >= 21);
  assert.equal(entryQuestions(content, "daily").length, 47); assert.equal(entryQuestions(content, "confusion").length, 12); assert.equal(entryQuestions(content, "exam", "all", "selected").length, 49);
  questionIds.forEach((id) => { assert.ok(pack.entryPlans.modes.qa.questionIds.includes(id)); assert.ok(pack.entryPlans.modes.mnemonic.questionIds.includes(id)); assert.ok(!pack.entryPlans.modes.daily.questionIds.includes(id)); });
});
test("C5-6 keeps its migration declaration and exact groups", () => {
  assert.ok(pack.sessionMigrations.some((item) => item.fromVersion === "bdbe9e4d"));
  const engine = createEngine(content, storage(), () => Date.parse("2026-10-21T16:01:00Z"));
  assert.equal(engine.start("qa", "economics", "selected", "", "market-failure-monopoly-mechanism", 5).session.ids.length, 4); assert.equal(engine.start("qa", "economics", "selected", "", "market-failure-externality-mechanism", 5).session.ids.length, 5);
});
test("review-only C5-6 resources stay closed in formal admission", () => { const formal = availableContent(body, pack, false); questionIds.forEach((id) => assert.ok(!formal.questions.some((x) => x.id === id))); targetIds.forEach((id) => assert.ok(!formal.targets.some((x) => x.id === id))); mnemonicIds.forEach((id) => assert.ok(!formal.mnemonics.some((x) => x.id === id))); });
console.log(JSON.stringify({ passed: true, checks: reports.length, contentVersion: content.version, reports }, null, 2));
