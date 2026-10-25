const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const {
  GuideContentError,
  createGuideContent,
} = require("../miniprogram/subpackages/common-sense/services/guide-content");
const {
  MEMORY_STATES,
  STORAGE_KEY,
  createGuideSession,
} = require("../miniprogram/subpackages/common-sense/services/guide-session");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function memoryStorage(seed = {}) {
  const values = clone(seed);
  return {
    values,
    getStorageSync(key) { return values[key]; },
    setStorageSync(key, value) { values[key] = clone(value); },
  };
}

function tinyBody() {
  return {
    categories: [{ id: "tiny-category", pointIds: ["tiny-point"] }],
    directory: [{ id: "tiny-scope", chapters: [{ categoryId: "tiny-category" }] }],
    points: [{
      id: "tiny-point",
      title: "小组",
      tabs: [{ id: "tiny-tab", blocks: [{ sourceUnitIds: ["tiny-source"], type: "list", items: ["原文"] }] }],
      readingMeta: {
        takeaway: "先看知识组，再逐张回顾。",
        focus: [{ label: "小卡", note: "卡片内容", sourceUnitIds: ["tiny-source"] }],
        review: ["修改这里不应影响知识导读"],
      },
    }],
  };
}

const content = createGuideContent(body);
assert.equal(content.stats.groups, 170);
assert.equal(content.stats.cards, 653);
assert.deepEqual(content.stats.scopes, {
  "humanities-history": 204,
  "science-technology": 174,
  economics: 112,
  law: 163,
});
assert.deepEqual(content.stats.mapping, { sourceOverlap: 580, singleTabFallback: 73 });
assert.equal(new Set(content.cards.map((card) => card.id)).size, 653);
assert.equal(content.cards.every((card) => card.id.startsWith(`${card.pointId}::`) &&
  card.sourceUnitIds.every((sourceUnitId) => card.id.includes(sourceUnitId))), true);
assert.equal(content.cards.every((card) => content.groupById[card.groupId].cardIds.includes(card.id)), true);
assert.equal(content.cards.every((card) => card.sourceUrl ===
  `/subpackages/common-sense/detail/index?moduleId=common-sense&pointId=${encodeURIComponent(card.pointId)}&tabId=${encodeURIComponent(card.tabId)}`), true);
assert.equal(content.cards.every((card) => body.points.some((point) => point.id === card.pointId &&
  point.tabs.some((tab) => tab.id === card.tabId))), true);

const prose = content.groupById["ancient-prose"];
assert.equal(prose.title, "散文");
assert.equal(prose.cardIds.length, 9);
assert.deepEqual(prose.cardIds.map((id) => content.cardById[id].title),
  ["《山海经》", "四书", "五经", "六经", "《淮南子》", "唐宋八大家", "韩愈", "柳宗元", "欧阳修"]);

const withoutReview = clone(body);
withoutReview.points.forEach((point) => { point.readingMeta.review = ["完全不同的三十秒回顾"]; });
assert.equal(createGuideContent(withoutReview).version, content.version, "知识导读不得依赖 readingMeta.review");

const ambiguous = tinyBody();
ambiguous.points[0].tabs.push({ id: "second-tab", blocks: [{ sourceUnitIds: ["tiny-source"] }] });
assert.throws(() => createGuideContent(ambiguous), (error) => error instanceof GuideContentError &&
  /多个正文页签/.test(error.message));

let now = 1000;
const legacyLearningState = { sentinel: "do-not-touch" };
const storage = memoryStorage({ "common-sense-learning-v1": legacyLearningState });
const engine = createGuideSession(content, storage, () => ++now);
assert.deepEqual(engine.preferences(), { scope: "all", count: 5, groupId: "" });
assert.deepEqual(engine.savePreferences({ scope: "humanities-history", count: 10, groupId: "ancient-prose" }),
  { scope: "humanities-history", count: 10, groupId: "ancient-prose" });
let started = engine.start({ scope: "humanities-history", count: 10, groupId: "ancient-prose" });
assert.equal(started.resumed, false);
assert.equal(started.session.currentGroupId, "ancient-prose");
assert.equal(started.session.ids.length, 9);
assert.equal(engine.start({ scope: "humanities-history", count: 10, groupId: "ancient-prose" }).resumed, true);

MEMORY_STATES.forEach((status) => assert.equal(typeof status, "string"));
const session = started.session;
const firstFourIds = session.ids.slice(0, 4);
assert.equal(engine.assess(session, "remembered").status, "remembered");
assert.equal(engine.assess(session, "fuzzy").status, "fuzzy");
assert.equal(engine.assess(session, "missed").status, "missed");
assert.equal(engine.assess(session, "skipped").status, "skipped");
assert.equal(engine.record(firstFourIds[0]).status, "remembered");
assert.equal(engine.record(firstFourIds[1]).status, "fuzzy");
assert.equal(engine.record(firstFourIds[2]).status, "missed");
assert.equal(engine.record(firstFourIds[3]), null);
assert.deepEqual(engine.result(session), {
  remembered: 1, fuzzy: 1, missed: 1, skipped: 1, assessed: 4, total: 9, pending: 5,
});

const restored = createGuideSession(content, storage, () => ++now);
const resumed = restored.resume();
assert.ok(resumed && resumed.resumed);
assert.equal(resumed.session.index, 4);
assert.deepEqual(resumed.session.ids, session.ids);
assert.equal(restored.persistenceError(), "");
assert.equal(storage.values[STORAGE_KEY].schema, 1);
assert.deepEqual(storage.values["common-sense-learning-v1"], legacyLearningState,
  "知识导读不得污染既有答题学习状态");

const batchingStorage = memoryStorage();
const batchingEngine = createGuideSession(content, batchingStorage, () => ++now);
const firstProseBatch = batchingEngine.start({
  scope: "humanities-history", count: 5, groupId: "ancient-prose",
}).session;
assert.equal(firstProseBatch.ids.length, 5);
batchingEngine.assess(firstProseBatch, "skipped");
firstProseBatch.ids.slice(1).forEach(() => batchingEngine.assess(firstProseBatch, "remembered"));
assert.equal(batchingEngine.record(firstProseBatch.ids[0]), null);
assert.equal(batchingEngine.progress(firstProseBatch.ids[0]).status, "skipped");
const reloadedBatchingEngine = createGuideSession(content, batchingStorage, () => ++now);
const secondProseBatch = reloadedBatchingEngine.start({
  scope: "humanities-history", count: 5, refresh: true,
}).session;
assert.equal(secondProseBatch.ids.length, 4, "组内剩余卡片不足数量时不得混入已标记卡");
assert.equal(secondProseBatch.ids.some((id) => firstProseBatch.ids.includes(id)), false);
assert.equal(secondProseBatch.scope, "humanities-history");
assert.equal(secondProseBatch.groupId, "ancient-prose", "深链进入的知识组必须先完成剩余卡片");
secondProseBatch.ids.forEach(() => reloadedBatchingEngine.assess(secondProseBatch, "remembered"));
const afterProse = reloadedBatchingEngine.start({
  scope: "humanities-history", count: 5, refresh: true,
}).session;
assert.equal(afterProse.scope, "humanities-history", "完成深链知识组后必须保留原学习范围");
assert.notEqual(afterProse.groupId, "ancient-prose", "知识组全部浏览后才可进入下一组");

const tinyV1 = createGuideContent(tinyBody());
const tinyStorage = memoryStorage();
const tinyEngine = createGuideSession(tinyV1, tinyStorage, () => ++now);
const tinySession = tinyEngine.start({ scope: "tiny-scope", count: 5, groupId: "tiny-point" }).session;
const tinyCardId = tinySession.ids[0];
tinyEngine.assess(tinySession, "remembered");
const second = tinyEngine.start({ scope: "tiny-scope", count: 5, groupId: "tiny-point", refresh: true }).session;
tinyEngine.assess(second, "skipped");
assert.equal(tinyEngine.record(tinyCardId).status, "remembered", "跳过不得覆盖旧记忆标记");

const changedBody = tinyBody();
changedBody.points[0].readingMeta.focus[0].note = "内容已经修订";
const tinyV2 = createGuideContent(changedBody);
const changedEngine = createGuideSession(tinyV2, tinyStorage, () => ++now);
assert.equal(changedEngine.record(tinyCardId), null, "卡片内容签名变化后旧记录必须失效");
assert.equal(changedEngine.resume(), null, "卡片内容签名变化后关联会话必须失效");
assert.equal(changedEngine.start({ scope: "tiny-scope", count: 5, groupId: "tiny-point" }).invalidated, true);

const failingStorage = {
  getStorageSync() { throw new Error("read failed"); },
  setStorageSync() { throw new Error("write failed"); },
};
const failingEngine = createGuideSession(tinyV1, failingStorage, () => ++now);
assert.match(failingEngine.persistenceError(), /读取失败/);
failingEngine.savePreferences({ scope: "tiny-scope", count: 5 });
assert.match(failingEngine.persistenceError(), /暂未保存/);

console.log(JSON.stringify({
  ok: true,
  groups: content.stats.groups,
  cards: content.stats.cards,
  scopes: content.stats.scopes,
  mapping: content.stats.mapping,
  persistenceKey: STORAGE_KEY,
}, null, 2));
