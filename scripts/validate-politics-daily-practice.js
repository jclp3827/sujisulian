#!/usr/bin/env node

const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const bank = require(path.join(ROOT, "miniprogram/models/politics-applied-questions-runtime"));
const { STORAGE_KEY, createPoliticsPracticeEngine, readPoliticsPracticeHome } = require(path.join(ROOT, "miniprogram/services/knowledge-platform/politics-practice"));

function memoryStorage(initial = {}) {
  const values = JSON.parse(JSON.stringify(initial));
  const writes = [];
  return { values, writes,
    getStorageSync(key) { return values[key]; },
    setStorageSync(key, value) { writes.push(key); values[key] = JSON.parse(JSON.stringify(value)); },
  };
}

const day1 = Date.parse("2026-10-21T09:00:00+08:00");
let now = day1;
const storage = memoryStorage();
let engine = createPoliticsPracticeEngine(bank, storage, () => now);
const first = engine.start("daily");
assert.equal(first.resumed, false);
assert.equal(first.session.ids.length, 3, "first daily group should contain three applied questions");
assert.equal(engine.group(first.session.groupId).scope, "thought");
assert.deepEqual(first.session.ids.map((id) => engine.question(id).questionType), ["relation-classification", "condition-change", "scenario-judgment"]);
assert.deepEqual(new Set(storage.writes), new Set([STORAGE_KEY]), "practice must use its own storage key");

engine.answer(first.session, 1); engine.advance(first.session);
engine.answer(first.session, null); engine.advance(first.session);
engine.advance(first.session);
assert.equal(first.session.index, 3);
const frozen = engine.start("daily");
assert.equal(frozen.resumed, true, "completed daily session must remain frozen on the same day");
assert.deepEqual(frozen.session.ids, first.session.ids);
assert.equal(readPoliticsPracticeHome(bank, storage, () => now).state, "completed");

const interruptedStorage = memoryStorage();
const interruptedEngine = createPoliticsPracticeEngine(bank, interruptedStorage, () => day1);
interruptedEngine.start("daily");
assert.equal(readPoliticsPracticeHome(bank, interruptedStorage, () => day1 + 86400000).state, "active", "unfinished prior-day session must remain the home continuation");

now += 86400000;
engine = createPoliticsPracticeEngine(bank, storage, () => now);
const second = engine.start("daily");
assert.equal(second.session.ids.length, 5, "two due reviews plus one complete new group should make five questions");
assert.equal(second.session.ids.filter((id) => second.session.reasons[id] === "到期回顾").length, 2);
assert.equal(engine.group(second.session.groupId).scope, "principles", "new groups should alternate route scopes when possible");

const qaThought = engine.start("qa", { scope: "thought", count: 5 });
assert.equal(qaThought.session.ids.length, 5);
assert.ok(qaThought.session.ids.every((id) => engine.group(engine.question(id).groupId).scope === "thought"));
const qaAll = engine.start("qa", { scope: "all", count: 10 });
assert.equal(qaAll.session.ids.length, 10);

const exhaustedState = { schema: 1, records: {}, sessions: {}, preferences: {}, groupHistory: {} };
bank.groups.forEach((group) => { exhaustedState.groupHistory[group.groupId] = { at: day1, contentVersion: group.contentVersion }; });
const exhausted = createPoliticsPracticeEngine(bank, memoryStorage({ [STORAGE_KEY]: exhaustedState }), () => day1).start("daily");
assert.equal(exhausted.session.ids.length, 0, "daily must not pad with early reviews after new groups are exhausted");
assert.equal(readPoliticsPracticeHome(bank, memoryStorage({ [STORAGE_KEY]: exhaustedState }), () => day1).state, "empty");

const unrelatedBank = { ...bank, bankVersion: `${bank.bankVersion}-unrelated` };
assert.equal(readPoliticsPracticeHome(unrelatedBank, storage, () => now).state, "active", "unrelated bank changes must preserve a session whose question versions are unchanged");
const changedQuestions = bank.questions.map((question) => second.session.ids.includes(question.questionId)
  ? { ...question, contentVersion: `${question.contentVersion}-changed` }
  : question);
const affectedBank = { ...bank, bankVersion: `${bank.bankVersion}-affected`, questions: changedQuestions };
assert.equal(readPoliticsPracticeHome(affectedBank, storage, () => now).state, "updated", "a changed question used by the active daily session must invalidate that session visibly");
const failingStorage = { getStorageSync() { throw new Error("read failed"); }, setStorageSync() { throw new Error("write failed"); } };
assert.equal(readPoliticsPracticeHome(bank, failingStorage, () => now).state, "storage-error");

const pageJs = fs.readFileSync(path.join(ROOT, "miniprogram/subpackages/politics/practice/index.js"), "utf8");
const pageWxml = fs.readFileSync(path.join(ROOT, "miniprogram/subpackages/politics/practice/index.wxml"), "utf8");
const pageWxss = fs.readFileSync(path.join(ROOT, "miniprogram/subpackages/politics/practice/index.wxss"), "utf8");
const sessionWxss = fs.readFileSync(path.join(ROOT, "miniprogram/styles/session.wxss"), "utf8");
const app = JSON.parse(fs.readFileSync(path.join(ROOT, "miniprogram/app.json"), "utf8"));
assert.ok(app.subPackages.find((item) => item.root === "subpackages/politics").pages.includes("practice/index"));
for (const marker of ["查看答案", "跳过", "再看一次", "查看原文：", "一问一答", "学习设置"]) assert.ok(pageWxml.includes(marker), `practice UI missing: ${marker}`);
assert.ok(pageJs.includes("origin=practice") && pageJs.includes("mode=reading"), "source link must open the exact reading block directly");
assert.ok(!pageWxml.includes("progressbar") && !pageWxss.includes("progress-track"), "practice should use numeric progress only");
assert.ok(pageWxml.includes("session-action-row") && pageWxml.includes("btn-base btn-compact") && sessionWxss.includes("var(--ui-action-gap)"), "practice actions must reuse shared session controls");
assert.ok(pageWxml.indexOf("practice-action-secondary") < pageWxml.indexOf("practice-action-primary") && pageWxml.indexOf("practice-action-primary") < pageWxml.indexOf("practice-action-ghost"), "action order must be exit / primary / skip");

console.log("politics daily practice validation passed: scheduling, freeze, review, QA, invalidation, isolation, and UI contract");

require("./validate-politics-practice-reliability").validate();
