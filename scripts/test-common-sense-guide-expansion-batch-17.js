const assert=require('assert/strict');
const body=require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const batch=require('../docs/knowledge-platform/content/common-sense-guide-expansion-batch-17');
const {createGoldenGuideContent,collectSourceUnitIds}=require('../miniprogram/subpackages/common-sense/services/guide-content');
const content=createGoldenGuideContent(body,batch);
assert.deepEqual(content.groups.map(g=>g.id),['other-life-common-sense','biotech-new-energy','gene-engineering','cell-engineering','fermentation-engineering','enzyme-engineering']);
assert.equal(content.stats.cards,20);assert.equal(content.stats.holds,0);
assert.deepEqual(content.stats.productionModes,{reuse:3,'light-edit':14,synthesized:3});
assert.equal(content.stats.scopes['science-technology'],20);
const existing=new Set(Array.from({length:16},(_,i)=>require(`../docs/knowledge-platform/content/common-sense-guide-expansion-batch-${i+1}`)).flatMap(b=>b.groups).map(g=>g.pointId));
assert.ok(batch.groups.every(g=>!existing.has(g.pointId)));
assert.equal(new Set(content.cards.map(c=>c.id)).size,20);
assert.ok(content.cards.every(c=>c.mapping==='source-overlap'));
for(const x of batch.exclusions){const p=body.points.find(p=>p.id===x.pointId);const units=new Set(collectSourceUnitIds(p));assert.ok(x.sourceUnitIds.every(id=>units.has(id)));assert.ok(!content.cardById[`${x.pointId}::${x.id}`]);}
assert.equal(batch.exclusions.length,8);
const invalid=JSON.parse(JSON.stringify(batch));invalid.groups[0].cards[0].sourceUnitIds=['bad-unit'];assert.throws(()=>createGoldenGuideContent(body,invalid),/来源无法唯一定位/);
console.log(JSON.stringify({ok:true,batchId:batch.id,groups:6,cards:20,holds:0,exclusions:8},null,2));
