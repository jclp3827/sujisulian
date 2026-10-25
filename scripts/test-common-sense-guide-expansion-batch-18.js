const assert=require('assert/strict');
const body=require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const batch=require('../docs/knowledge-platform/content/common-sense-guide-expansion-batch-18');
const {createGoldenGuideContent,collectSourceUnitIds}=require('../miniprogram/subpackages/common-sense/services/guide-content');
const c=createGoldenGuideContent(body,batch);
assert.deepEqual(c.groups.map(g=>g.id),['current-main-energy','shenzhou-spacecraft','satellite-launch-centers']);
assert.equal(c.stats.cards,28);assert.equal(c.stats.holds,0);
assert.deepEqual(c.stats.productionModes,{reuse:7,'light-edit':18,synthesized:3});
assert.equal(c.stats.scopes['science-technology'],28);
const previous=new Set(Array.from({length:17},(_,i)=>require(`../docs/knowledge-platform/content/common-sense-guide-expansion-batch-${i+1}`)).flatMap(b=>b.groups).map(g=>g.pointId));
assert.ok(batch.groups.every(g=>!previous.has(g.pointId)));
assert.equal(new Set(c.cards.map(x=>x.id)).size,28);
for(const x of batch.exclusions){const units=new Set(collectSourceUnitIds(body.points.find(p=>p.id===x.pointId)));assert.ok(x.sourceUnitIds.every(id=>units.has(id)));assert.ok(!c.cardById[`${x.pointId}::${x.id}`]);}
assert.equal(batch.exclusions.length,7);
const bad=JSON.parse(JSON.stringify(batch));bad.groups[0].cards[0].sourceUnitIds=['bad-unit'];assert.throws(()=>createGoldenGuideContent(body,bad),/来源无法唯一定位/);
console.log(JSON.stringify({ok:true,batchId:batch.id,groups:3,cards:28,exclusions:7,holds:0}));
