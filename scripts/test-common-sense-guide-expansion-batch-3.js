#!/usr/bin/env node
const assert = require("assert/strict");

const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const golden = require("../miniprogram/subpackages/common-sense/models/guide-golden-sample");
const batch = require("../docs/knowledge-platform/content/common-sense-guide-expansion-batch-3");
const {
  collectSourceUnitIds,
  createGoldenGuideContent,
} = require("../miniprogram/subpackages/common-sense/services/guide-content");

const clone = (value) => JSON.parse(JSON.stringify(value));
const content = createGoldenGuideContent(body, batch);

assert.equal(batch.status, "candidate");
assert.deepEqual(content.groups.map((group) => group.id), ["poetry-ci-qu"]);
assert.equal(content.stats.groups, 1);
assert.equal(content.stats.cards, 26);
assert.equal(content.stats.holds, 0);
assert.deepEqual(content.stats.scopes, {
  "humanities-history": 26,
  "science-technology": 0,
  economics: 0,
  law: 0,
});
assert.deepEqual(content.stats.productionModes, {
  reuse: 4,
  "light-edit": 12,
  synthesized: 10,
});
assert.ok(content.stats.cards >= 20 && content.stats.cards <= 40);

const ids = content.cards.map((card) => card.id);
assert.equal(new Set(ids).size, ids.length, "稳定身份不得重复");
assert.equal(content.cards.every((card) => card.id.startsWith(`${card.pointId}::`)), true);
assert.equal(content.cards.every((card) => Number.isInteger(card.semanticRevision) && card.semanticRevision >= 1), true);
assert.equal(content.cards.every((card) => card.mapping === "source-overlap"), true);
assert.equal(content.cards.every((card) => card.review.independentFactReview === "pending-independent-review"), true);
assert.equal(content.cards.every((card) => card.content.length >= 35 && card.content.length <= 180), true);

const authoringCards = batch.groups.flatMap((group) => group.cards.map((card) => ({ ...card, pointId: group.pointId })));
assert.equal(authoringCards.every((card) => Array.isArray(card.sourceEvidence) && card.sourceEvidence.length > 0), true);
assert.equal(new Set(authoringCards.map((card) => card.title)).size, authoringCards.length);
assert.equal(new Set(authoringCards.map((card) => card.explanation)).size, authoringCards.length);

const goldenPointIds = new Set(golden.groups.map((group) => group.pointId));
assert.equal(goldenPointIds.has("poetry-ci-qu"), false);

const pointById = Object.fromEntries(body.points.map((point) => [point.id, point]));
batch.exclusions.forEach((hold) => {
  assert.ok(pointById[hold.pointId]);
  const available = new Set(collectSourceUnitIds(pointById[hold.pointId]));
  assert.equal(hold.sourceUnitIds.every((id) => available.has(id)), true);
  assert.equal(ids.includes(`${hold.pointId}::${hold.id}`), false);
  assert.ok(hold.reason && hold.requiredEvidence);
});

const duplicateId = clone(batch);
duplicateId.groups[0].cards[1].id = duplicateId.groups[0].cards[0].id;
assert.throws(() => createGoldenGuideContent(body, duplicateId), /知识卡标识重复/);

const missingSource = clone(batch);
missingSource.groups[0].cards[0].sourceUnitIds = ["missing-source-unit"];
assert.throws(() => createGoldenGuideContent(body, missingSource), /来源无法唯一定位正文页签/);

const multiTabSource = clone(batch);
multiTabSource.groups[0].cards[0].sourceUnitIds = [
  "cs-10-15-p5-li-yu-list",
  "cs-10-15-p7-western-chamber-list",
];
assert.throws(() => createGoldenGuideContent(body, multiTabSource), /来源同时命中多个正文页签/);

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
