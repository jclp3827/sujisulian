#!/usr/bin/env node
const assert = require("assert/strict");
const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const golden = require("../miniprogram/subpackages/common-sense/models/guide-golden-sample");
const previous = [1,2,3,4,5,6,7,8].map((number) => require(`../docs/knowledge-platform/content/common-sense-guide-expansion-batch-${number}`));
const batch = require("../docs/knowledge-platform/content/common-sense-guide-expansion-batch-9");
const { collectSourceUnitIds, createGoldenGuideContent } = require("../miniprogram/subpackages/common-sense/services/guide-content");
const clone = (value) => JSON.parse(JSON.stringify(value));
const content = createGoldenGuideContent(body, batch);
assert.equal(batch.status, "candidate");
assert.deepEqual(content.groups.map((group) => group.id), ["classical-language-allusions"]);
assert.equal(content.stats.groups, 1); assert.equal(content.stats.cards, 36); assert.equal(content.stats.holds, 0);
assert.deepEqual(content.stats.scopes, {"humanities-history":36,"science-technology":0,economics:0,law:0});
assert.deepEqual(content.stats.productionModes, {reuse:14,"light-edit":17,synthesized:5});
assert.ok(content.stats.cards >= 20 && content.stats.cards <= 40);
const ids = content.cards.map((card) => card.id);
assert.equal(new Set(ids).size, ids.length);
assert.equal(content.cards.every((item) => item.id.startsWith(`${item.pointId}::`) && item.mapping === "source-overlap"), true);
assert.equal(content.cards.every((item) => item.review.independentFactReview === "pending-independent-review"), true);
const existingGroupIds = new Set([...golden.groups,...previous.flatMap((item)=>item.groups)].map((group)=>group.pointId));
assert.equal(existingGroupIds.has("classical-language-allusions"), false);
const pointById = Object.fromEntries(body.points.map((point)=>[point.id,point]));
batch.exclusions.forEach((hold)=>{
  const available=new Set(collectSourceUnitIds(pointById[hold.pointId]));
  assert.equal(hold.sourceUnitIds.every((id)=>available.has(id)),true);
  assert.equal(ids.includes(`${hold.pointId}::${hold.id}`),false);
});
assert.equal(content.cardById["classical-language-allusions::weak-crown"].tabId,"forms-of-address");
assert.equal(content.cardById["classical-language-allusions::xiang-yu-idioms"].tabId,"idioms");
const duplicate=clone(batch); duplicate.groups[0].cards[1].id=duplicate.groups[0].cards[0].id;
assert.throws(()=>createGoldenGuideContent(body,duplicate),/知识卡标识重复/);
const missing=clone(batch); missing.groups[0].cards[0].sourceUnitIds=["missing-source-unit"];
assert.throws(()=>createGoldenGuideContent(body,missing),/来源无法唯一定位正文页签/);
console.log(JSON.stringify({ok:true,batchId:batch.id,groups:content.stats.groups,cards:content.stats.cards,holds:content.stats.holds,
  scopes:content.stats.scopes,productionModes:content.stats.productionModes,independentFactReview:"pending",publicEntryChanged:false},null,2));
