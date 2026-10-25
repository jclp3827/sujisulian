const assert=require('assert/strict');
const body=require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const batch=require('../docs/knowledge-platform/content/common-sense-guide-expansion-batch-58.js');
const {createGoldenGuideContent,collectSourceUnitIds}=require('../miniprogram/subpackages/common-sense/services/guide-content');
const c=createGoldenGuideContent(body,batch);
assert.deepEqual(c.groups.map(g=>g.id),["land-revolution","anti-japanese-liberation","liberation-war"]);
assert.deepEqual(batch.groups.map(g=>g.cards.length),[16,18,9]);
assert.equal(c.stats.cards,43);assert.equal(c.stats.holds,0);assert.deepEqual(c.stats.productionModes,{"reuse":1,"light-edit":41,"synthesized":1});
const previous=new Set(Array.from({length:57},(_,i)=>require('../docs/knowledge-platform/content/common-sense-guide-expansion-batch-'+(i+1))).flatMap(b=>b.groups).map(g=>g.pointId));
assert.ok(batch.groups.every(g=>!previous.has(g.pointId)));
assert.equal(new Set(c.cards.map(c=>c.id)).size,43);assert.ok(c.cards.every(c=>c.mapping==='source-overlap'));
for(const x of batch.exclusions){const units=new Set(collectSourceUnitIds(body.points.find(p=>p.id===x.pointId)));assert.ok(x.sourceUnitIds.every(id=>units.has(id)));assert.ok(!c.cardById[x.pointId+'::'+x.id]);}
assert.equal(batch.exclusions.length,5);
console.log(JSON.stringify({ok:true,batchId:batch.id,groups:3,cards:43,holds:0,exclusions:5}));
