#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const golden = require("../miniprogram/subpackages/common-sense/models/guide-golden-sample");
const batch = require("../docs/knowledge-platform/content/common-sense-guide-expansion-batch-4");
const { collectSourceUnitIds, createGoldenGuideContent } = require("../miniprogram/subpackages/common-sense/services/guide-content");

const clone = (value) => JSON.parse(JSON.stringify(value));
const expectedGroups = ["classical-novels", "fiction-history-modern-literature", "modern-literature"];
const content = createGoldenGuideContent(body, batch);

assert.equal(batch.status, "candidate");
assert.deepEqual(content.groups.map((group) => group.id), expectedGroups);
assert.equal(content.stats.groups, 3);
assert.equal(content.stats.cards, 33);
assert.equal(content.stats.holds, 0);
assert.deepEqual(content.stats.scopes, {"humanities-history": 33, "science-technology": 0, economics: 0, law: 0});
assert.deepEqual(content.stats.productionModes, {reuse: 8, "light-edit": 19, synthesized: 6});
assert.ok(content.stats.cards >= 20 && content.stats.cards <= 40);

const ids = content.cards.map((card) => card.id);
assert.equal(new Set(ids).size, ids.length);
assert.equal(content.cards.every((item) => item.id.startsWith(`${item.pointId}::`)), true);
assert.equal(content.cards.every((item) => Number.isInteger(item.semanticRevision) && item.semanticRevision >= 1), true);
assert.equal(content.cards.every((item) => item.mapping === "source-overlap"), true);
assert.equal(content.cards.every((item) => item.review.independentFactReview === "pending-independent-review"), true);

const authored = batch.groups.flatMap((group) => group.cards.map((item) => ({...item, pointId: group.pointId})));
assert.equal(new Set(authored.map((item) => item.title)).size, authored.length);
assert.equal(new Set(authored.map((item) => item.explanation)).size, authored.length);
assert.equal(authored.every((item) => item.sourceEvidence.length > 0), true);

const goldenIds = new Set(golden.groups.map((group) => group.pointId));
assert.equal(expectedGroups.some((id) => goldenIds.has(id)), false);
const pointById = Object.fromEntries(body.points.map((point) => [point.id, point]));
batch.exclusions.forEach((hold) => {
  const available = new Set(collectSourceUnitIds(pointById[hold.pointId]));
  assert.equal(hold.sourceUnitIds.every((id) => available.has(id)), true);
  assert.equal(ids.includes(`${hold.pointId}::${hold.id}`), false);
});

const duplicate = clone(batch);
duplicate.groups[0].cards[1].id = duplicate.groups[0].cards[0].id;
assert.throws(() => createGoldenGuideContent(body, duplicate), /知识卡标识重复/);
const missing = clone(batch);
missing.groups[0].cards[0].sourceUnitIds = ["missing-source-unit"];
assert.throws(() => createGoldenGuideContent(body, missing), /来源无法唯一定位正文页签/);

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
