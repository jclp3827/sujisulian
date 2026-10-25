const assert=require('assert/strict');
const body=require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const batch=require('../docs/knowledge-platform/content/common-sense-guide-expansion-batch-19');
const {createGoldenGuideContent,collectSourceUnitIds}=require('../miniprogram/subpackages/common-sense/services/guide-content');
const c=createGoldenGuideContent(body,batch);
assert.deepEqual(c.groups.map(g=>g.id),['change-lunar-probes','space-tech']);
assert.deepEqual(batch.groups.map(g=>g.cards.length),[10,14]);
assert.equal(c.stats.cards,24);assert.equal(c.stats.holds,0);
assert.deepEqual(c.stats.productionModes,{reuse:8,'light-edit':13,synthesized:3});
assert.equal(c.stats.scopes['science-technology'],24);
const existing=new Set(Array.from({length:18},(_,i)=>require(`../docs/knowledge-platform/content/common-sense-guide-expansion-batch-${i+1}`)).flatMap(b=>b.groups).map(g=>g.pointId));
assert.ok(batch.groups.every(g=>!existing.has(g.pointId)));
assert.equal(new Set(c.cards.map(x=>x.id)).size,24);
assert.ok(c.cards.every(x=>x.mapping==='source-overlap'));
for(const x of batch.exclusions){const units=new Set(collectSourceUnitIds(body.points.find(p=>p.id===x.pointId)));assert.ok(x.sourceUnitIds.every(id=>units.has(id)));assert.ok(!c.cardById[`${x.pointId}::${x.id}`]);}
assert.equal(batch.exclusions.length,4);
// Preserve the legacy single-tab fallback protocol; candidate admission still requires direct overlap above.
const bad=JSON.parse(JSON.stringify(batch));bad.groups[0].cards[0].sourceUnitIds=['bad-unit'];
assert.equal(createGoldenGuideContent(body,bad).cardById['change-lunar-probes::ce1-orbiter-image'].mapping,'single-tab-fallback');
assert.equal(c.cardById['change-lunar-probes::ce4-far-side'].tabId,'change-probes-table');
console.log(JSON.stringify({ok:true,batchId:batch.id,groups:2,cards:24,exclusions:4,holds:0}));
