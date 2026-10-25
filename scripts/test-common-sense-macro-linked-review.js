const assert=require('assert/strict');
const body=require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const pack=require('../miniprogram/subpackages/common-sense/models/learning-pack');
const fixture=require('./fixtures/common-sense-macro-linked-before-review.json');const old={...fixture.items,affectedIds:Object.fromEntries(Object.entries(fixture.items).map(([k,v])=>[k,v.map(x=>x.id)])),version:fixture.version,previousRuntimeVersions:[fixture.runtimeVersion,fixture.quarantineVersion]};
const review=require('../docs/knowledge-platform/content/common-sense-macro-linked-review-v1');
const {availableContent,itemRefs,sourceValid,fingerprint}=require('../miniprogram/subpackages/common-sense/services/learning-content');
const {createEngine}=require('../miniprogram/subpackages/common-sense/services/learning-engine');
const clone=x=>JSON.parse(JSON.stringify(x));
const now=availableContent(body,pack,true);const historicalPack=clone(pack);historicalPack.version=old.version;
for(const kind of ['questions','targets','mnemonics'])for(const before of old[kind]){const after=pack[kind].find(x=>x.id===before.id);assert.ok(after);assert.equal(after.revision,before.revision+(review.semanticChanges[kind].includes(before.id)?1:0));assert.ok(itemRefs(after).every(r=>sourceValid(body,r,true)));historicalPack[kind][historicalPack[kind].findIndex(x=>x.id===before.id)]=before;}
for(const kind of ['questions','targets','mnemonics']){const rejected=historicalPack[kind].filter(x=>itemRefs(x).some(r=>!sourceValid(body,r,true))).map(x=>x.id);assert.deepEqual(rejected,old.affectedIds[kind]);const fresh=(pack[kind]||[]).filter(x=>itemRefs(x).some(r=>!sourceValid(body,r,true)));assert.deepEqual(fresh,[]);}
assert.equal(old.affectedIds.questions.length,22);assert.equal(now.questions.length,603);assert.equal(pack.version,require('../docs/knowledge-platform/content/common-sense-learning-v1').version);assert.equal(availableContent(body,pack,false).questions.length,0);
const q=id=>pack.questions.find(x=>x.id===id), t=id=>pack.targets.find(x=>x.id===id);
assert.match(q('unemployment-rate').options[0],/就业人口加失业人口/);assert.match(q('inflation-redistribution').prompt,/固定名义/);assert.match(q('bop-balance').options[0],/不能/);assert.match(q('price-indices').options[0],/出厂价格/);assert.equal(pack.version,require('../docs/knowledge-platform/content/common-sense-learning-v1').version);
for(const version of old.previousRuntimeVersions){
 const previous=clone(now);previous.version=version;previous.sessionMigrations=[];for(const kind of ['questions','targets','mnemonics'])previous[kind]=previous[kind].map(x=>old[kind].find(b=>b.id===x.id)||x);
 const data={'common-sense-guide-v1':{sentinel:'formal'},'common-sense-guide-v1:golden-v1':{sentinel:'golden'},'common-sense-guide-v1:expansion-v1':{sentinel:'candidate'}};const savedGuides=JSON.stringify(data);const store={getStorageSync:k=>clone(data[k]||null),setStorageSync:(k,v)=>data[k]=clone(v)};
 const first=createEngine(previous,store,()=>1700000000000);const safe=first.start('qa','economics','selected','','resource-allocation-market').session;first.answer(safe,0);first.advance(safe);const safeId=safe.ids[0],safeRecord=clone(first.record(safeId));const affected=first.start('qa','economics','selected','','gdp-gnp-boundaries').session;first.answer(affected,0);first.advance(affected);const affectedId=affected.ids[0];assert.ok(first.record(affectedId));
 const next=createEngine(now,store,()=>1700000000001);assert.equal(next.record(affectedId),undefined);assert.deepEqual(next.record(safeId),safeRecord);const resumeSafe=next.start('qa','economics','selected','','resource-allocation-market');assert.equal(resumeSafe.resumed,true);assert.deepEqual(resumeSafe.session.ids,safe.ids);assert.equal(resumeSafe.session.optionSeed,safe.optionSeed);assert.equal(next.start('qa','economics','selected','','gdp-gnp-boundaries').invalidated,true);
 assert.equal(JSON.stringify(Object.fromEntries(Object.entries(data).filter(([k])=>k.includes('common-sense-guide-v1')))),savedGuides);
}
console.log(JSON.stringify({ok:true,reviewedQuestions:22,targets:17,legacyMemories:5,rejectedHistoricalDrift:22,currentStale:0,availableQuestions:603,migrationCases:old.previousRuntimeVersions.length,unrelatedProgressPreserved:true,guideStorageIsolated:true,formalAdmissionReady:false}));
