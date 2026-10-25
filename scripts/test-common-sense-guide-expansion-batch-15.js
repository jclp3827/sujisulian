#!/usr/bin/env node
const assert = require('assert/strict');
const body = require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const golden = require('../miniprogram/subpackages/common-sense/models/guide-golden-sample');
const previous = Array.from({length:14},(_,i)=>require(`../docs/knowledge-platform/content/common-sense-guide-expansion-batch-${i+1}`));
const batch = require('../docs/knowledge-platform/content/common-sense-guide-expansion-batch-15');
const {collectSourceUnitIds,createGoldenGuideContent} = require('../miniprogram/subpackages/common-sense/services/guide-content');
const content = createGoldenGuideContent(body,batch);
assert.equal(batch.status,'candidate');
assert.deepEqual(content.groups.map(g=>g.id),['biology-health']);
assert.equal(content.stats.cards,26);
assert.equal(content.stats.holds,0);
assert.deepEqual(content.stats.productionModes,{reuse:5,'light-edit':17,synthesized:4});
assert.deepEqual(content.stats.scopes,{'humanities-history':0,'science-technology':26,economics:0,law:0});
assert.equal(new Set([...golden.groups,...previous.flatMap(b=>b.groups)].map(g=>g.pointId)).has('biology-health'),false);
assert.equal(new Set(content.cards.map(c=>c.id)).size,26);
assert.ok(content.cards.every(c=>c.mapping==='source-overlap' && c.semanticRevision===1));
for(const [id,tab] of [['edible-roots','plants'],['platypus-exception','animals'],['human-chromosome-number','genetic-material'],['transpiration-process','biological-metabolism']]) {
  assert.equal(content.cardById[`biology-health::${id}`].tabId,tab);
}
const units=new Set(collectSourceUnitIds(body.points.find(p=>p.id==='biology-health')));
assert.equal(batch.exclusions.length,8);
for(const x of batch.exclusions) {
  assert.ok(x.sourceUnitIds.every(id=>units.has(id)));
  assert.equal(Boolean(content.cardById[`biology-health::${x.id}`]),false);
}
assert.match(content.cardById['biology-health::human-chromosome-number'].content,/典型有核体细胞/);
assert.match(content.cardById['biology-health::platypus-exception'].content,/多数.*胎生/);
assert.ok(!content.cards.some(c=>c.content.includes('昆虫传播（虫媒花）')));
const invalid=JSON.parse(JSON.stringify(batch));
invalid.groups[0].cards[0].sourceUnitIds=['invalid-unit'];
assert.throws(()=>createGoldenGuideContent(body,invalid),/来源无法唯一定位/);
console.log(JSON.stringify({ok:true,batchId:batch.id,cards:26,exclusions:8,holds:0,sourceMapping:'passed'},null,2));
