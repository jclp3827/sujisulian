#!/usr/bin/env node
const assert = require("assert/strict");

const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const golden = require("../miniprogram/subpackages/common-sense/models/guide-golden-sample");
const batch = require("../docs/knowledge-platform/content/common-sense-guide-expansion-batch-1");
const {
  collectSourceUnitIds,
  createGoldenGuideContent,
} = require("../miniprogram/subpackages/common-sense/services/guide-content");

const clone = (value) => JSON.parse(JSON.stringify(value));
const expectedGroups = [
  "prehistoric-civilization",
  "three-kingdoms-sui-tang",
  "sui-tang",
  "five-dynasties-yuan",
];

const content = createGoldenGuideContent(body, batch);
assert.equal(batch.status, "candidate");
assert.deepEqual(content.groups.map((group) => group.id), expectedGroups);
assert.equal(content.stats.groups, 4);
assert.equal(content.stats.cards, 39);
assert.equal(content.stats.holds, 0);
assert.deepEqual(content.stats.scopes, {
  "humanities-history": 39,
  "science-technology": 0,
  economics: 0,
  law: 0,
});
assert.deepEqual(content.stats.productionModes, {
  reuse: 8,
  "light-edit": 17,
  synthesized: 14,
});
assert.ok(content.stats.cards >= 20 && content.stats.cards <= 40, "候选卡数量必须处于单批 20—40 张范围");

const ids = content.cards.map((card) => card.id);
assert.equal(new Set(ids).size, ids.length, "稳定身份不得重复");
assert.equal(content.cards.every((card) => card.id.startsWith(`${card.pointId}::`)), true);
assert.equal(content.cards.every((card) => Number.isInteger(card.semanticRevision) && card.semanticRevision >= 1), true);
assert.equal(content.cards.every((card) => card.sourceUrl.includes(`pointId=${encodeURIComponent(card.pointId)}`) &&
  card.sourceUrl.includes(`tabId=${encodeURIComponent(card.tabId)}`)), true);
assert.equal(content.cards.every((card) => card.mapping === "source-overlap"), true, "本批每张卡都应由来源单元唯一定位页签");
assert.equal(content.cards.every((card) => card.review &&
  card.review.admission === "expansion-candidate" &&
  card.review.sourceFidelity === "self-reviewed" &&
  card.review.independentFactReview === "pending-independent-review"), true);
assert.equal(content.cards.every((card) => card.content.length >= 35 && card.content.length <= 180), true);
assert.equal(content.cards.every((card) => card.learningGoal.length >= 15), true);
assert.equal(content.cards.every((card) => !/^(?:\d+[.、]|[（(][一二三四五六七八九十]+[）)])/.test(card.title)), true);
assert.equal(content.cards.every((card) => !/(?:先记|抓住|挂回|配对|按.+记忆|收束)/u.test(`${card.title}${card.content}`)), true);

const authoringCards = batch.groups.flatMap((group) => group.cards.map((card) => ({ ...card, pointId: group.pointId })));
assert.equal(authoringCards.every((card) => Array.isArray(card.sourceEvidence) && card.sourceEvidence.length > 0), true);
assert.equal(new Set(authoringCards.map((card) => card.title)).size, authoringCards.length, "本批卡片标题不得重复");
assert.equal(new Set(authoringCards.map((card) => card.explanation)).size, authoringCards.length, "本批卡片内容不得语义复制");

const goldenPointIds = new Set(golden.groups.map((group) => group.pointId));
assert.equal(expectedGroups.some((pointId) => goldenPointIds.has(pointId)), false, "扩库第 1 批不得重复黄金样例知识组");

const pointById = Object.fromEntries(body.points.map((point) => [point.id, point]));
batch.exclusions.forEach((hold) => {
  assert.ok(pointById[hold.pointId], `HOLD 引用了不存在的知识组：${hold.pointId}`);
  const available = new Set(collectSourceUnitIds(pointById[hold.pointId]));
  assert.equal(hold.sourceUnitIds.every((id) => available.has(id)), true, `HOLD 来源无法定位：${hold.id}`);
  assert.equal(ids.includes(`${hold.pointId}::${hold.id}`), false, `HOLD 不得进入候选卡：${hold.id}`);
  assert.ok(hold.reason && hold.requiredEvidence, `HOLD 必须登记原因和恢复条件：${hold.id}`);
});

const duplicateId = clone(batch);
duplicateId.groups[0].cards[1].id = duplicateId.groups[0].cards[0].id;
assert.throws(() => createGoldenGuideContent(body, duplicateId), /知识卡标识重复/);

const missingSource = clone(batch);
missingSource.groups[0].cards[0].sourceUnitIds = ["missing-source-unit"];
assert.throws(() => createGoldenGuideContent(body, missingSource), /来源无法唯一定位正文页签/);

const invalidRevision = clone(batch);
invalidRevision.groups[0].cards[0].semanticRevision = 0;
assert.throws(() => createGoldenGuideContent(body, invalidRevision), /语义版本无效/);

console.log(JSON.stringify({
  ok: true,
  batchId: batch.id,
  groups: content.stats.groups,
  cards: content.stats.cards,
  holds: content.stats.holds,
  scopes: content.stats.scopes,
  productionModes: content.stats.productionModes,
  independentFactReview: "pending",
  publicEntryChanged: false,
}, null, 2));
