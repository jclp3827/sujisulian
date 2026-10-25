#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const golden = require("../miniprogram/subpackages/common-sense/models/guide-golden-sample");
const previous = [1,2,3,4,5,6,7,8,9,10,11,12].map((number) => require(`../docs/knowledge-platform/content/common-sense-guide-expansion-batch-${number}`));
const batch = require("../docs/knowledge-platform/content/common-sense-guide-expansion-batch-13");
const { collectSourceUnitIds, createGoldenGuideContent } = require("../miniprogram/subpackages/common-sense/services/guide-content");
const clone = (value) => JSON.parse(JSON.stringify(value));
const content = createGoldenGuideContent(body, batch);

assert.equal(batch.status, "candidate");
assert.equal(batch.promotion.strategy, "in-place-golden-promotion");
assert.equal(batch.promotion.sourceSampleId, golden.id);
assert.equal(batch.promotion.pointId, "physics");
assert.deepEqual(content.groups.map((group) => group.id), ["physics"]);
assert.equal(content.stats.groups, 1);
assert.equal(content.stats.cards, 23);
assert.equal(content.stats.holds, 0);
assert.deepEqual(content.stats.scopes, {"humanities-history":0,"science-technology":23,economics:0,law:0});
assert.deepEqual(content.stats.productionModes, {reuse:3,"light-edit":11,synthesized:9});
assert.ok(content.stats.cards >= 20 && content.stats.cards <= 40);

const goldenPhysics = golden.groups.find((group) => group.pointId === "physics");
const promotedCards = batch.groups[0].cards.slice(0, goldenPhysics.cards.length);
assert.deepEqual(promotedCards, goldenPhysics.cards, "黄金样例卡必须原位晋级，不得改写");
assert.deepEqual(batch.promotion.frozenCardIds, goldenPhysics.cards.map((card) => card.id));
const previousExpansionIds = new Set(previous.flatMap((item)=>item.groups).map((group)=>group.pointId));
assert.equal(previousExpansionIds.has("physics"), false);

const ids = content.cards.map((card) => card.id);
assert.equal(new Set(ids).size, ids.length);
assert.equal(content.cards.every((item) => item.id.startsWith(`${item.pointId}::`) && item.mapping === "source-overlap"), true);
assert.equal(content.cards.every((item) => item.review.independentFactReview === "pending-independent-review"), true);

const pointById = Object.fromEntries(body.points.map((point)=>[point.id,point]));
batch.exclusions.forEach((item)=>{
  const available = new Set(collectSourceUnitIds(pointById[item.pointId]));
  assert.equal(item.sourceUnitIds.every((id)=>available.has(id)), true);
  assert.equal(ids.includes(`${item.pointId}::${item.id}`), false);
});

assert.equal(content.cardById["physics::force-three-elements"].tabId, "newton-laws");
assert.equal(content.cardById["physics::friction-force"].tabId, "other-mechanics");
assert.equal(content.cardById["physics::lever-equilibrium"].tabId, "other-mechanics");
assert.equal(content.cardById["physics::flagpole-fixed-pulley"].tabId, "other-mechanics");

const changedPromotion = clone(batch);
changedPromotion.groups[0].cards[0].explanation += "改写";
assert.notDeepEqual(changedPromotion.groups[0].cards.slice(0, goldenPhysics.cards.length), goldenPhysics.cards);
const duplicate = clone(batch);
duplicate.groups[0].cards[6].id = duplicate.groups[0].cards[5].id;
assert.throws(()=>createGoldenGuideContent(body,duplicate),/知识卡标识重复/);
const missing = clone(batch);
missing.groups[0].cards[5].sourceUnitIds = ["missing-source-unit"];
assert.throws(()=>createGoldenGuideContent(body,missing),/来源无法唯一定位正文页签/);

console.log(JSON.stringify({ok:true,batchId:batch.id,promotion:batch.promotion.strategy,groups:content.stats.groups,
  cards:content.stats.cards,holds:content.stats.holds,exclusions:batch.exclusions.length,
  scopes:content.stats.scopes,productionModes:content.stats.productionModes,independentFactReview:"pending",publicEntryChanged:false},null,2));
