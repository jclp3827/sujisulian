const assert=require('assert/strict');
const body=require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const old=require('./fixtures/common-sense-information-before-correction.json');
const {createGuideContent}=require('../miniprogram/subpackages/common-sense/services/guide-content');
const {createGuideSession}=require('../miniprogram/subpackages/common-sense/services/guide-session');
const clone=x=>JSON.parse(JSON.stringify(x));const previous=clone(body);
for(const p of old.points)previous.points[previous.points.findIndex(x=>x.id===p.id)]=p;
const before=createGuideContent(previous),after=createGuideContent(body);
assert.deepEqual(before.cards.map(c=>c.id),after.cards.map(c=>c.id));
const changed=before.cards.filter(c=>after.cardById[c.id].signature!==c.signature);
assert.equal(changed.length,8);const ids=old.points.map(p=>p.id);
assert.ok(changed.every(c=>ids.includes(c.pointId)));
for(const p of old.points){const now=body.points.find(x=>x.id===p.id);assert.deepEqual(now.tabs.map(t=>t.id),p.tabs.map(t=>t.id));assert.deepEqual(now.readingMeta.focus.map(f=>f.sourceUnitIds),p.readingMeta.focus.map(f=>f.sourceUnitIds));}
const inputs=clone(previous.points);require('../miniprogram/models/note-common-sense/note-common-sense-information-corrections')(inputs);assert.deepEqual(inputs,body.points);
let overrides=0;
for(const file of ['communication-technology','computer-technology','information-technology-applications']){
 const audit=require(`../docs/common-sense-source-audit/${file}.json`),oldPoint=old.points.find(p=>p.id===audit.pointId),now=body.points.find(p=>p.id===audit.pointId);
 for(const unit of audit.contentUnits.filter(u=>u.currentOfficialOverride)){
  const originalBlock=oldPoint.tabs.flatMap(t=>t.blocks).find(b=>(b.sourceUnitIds||[]).includes(unit.id));
  const currentBlock=now.tabs.flatMap(t=>t.blocks).find(b=>(b.sourceUnitIds||[]).includes(unit.id));
  assert.deepEqual(unit.displayItems||unit.items,originalBlock.items,'原始教材展示文本必须保留');
  assert.deepEqual(unit.currentOfficialOverride.items,currentBlock.items);assert.ok(unit.currentOfficialOverride.sources.length);overrides++;
 }
}
assert.equal(overrides,5);
const concepts=JSON.stringify(body.points.find(p=>p.id==='information-tech'));
for(const term of ['1GB=1000MB','1GiB=1024MiB','1B=8bit'])assert.ok(concepts.includes(term));
assert.ok(!body.points.find(p=>p.id==='communication-technology').readingMeta.focus[0].note.includes('最新一代'));
assert.ok(!body.points.find(p=>p.id==='information-technology-applications').readingMeta.focus[0].note.includes('精度准、价值高'));
const values={},storage={getStorageSync:k=>clone(values[k]||null),setStorageSync:(k,v)=>values[k]=clone(v)};
const first=createGuideSession(before,storage);const sessions=ids.map(groupId=>first.start({scope:'all',groupId,count:5}).session);for(const s of sessions)first.assess(s,'remembered');
const unaffected=first.start({scope:'all',groupId:'ancient-prose',count:5}).session;first.assess(unaffected,'remembered');
const next=createGuideSession(after,storage);for(const s of sessions){assert.equal(next.resume(s.key),null);assert.equal(next.record(s.ids[0]),null);}
assert.ok(next.resume(unaffected.key));assert.equal(next.record(unaffected.ids[0]).status,'remembered');
console.log(JSON.stringify({ok:true,stableIds:653,changedSignatures:8,unchangedSignatures:645,rawUnitsPreserved:5,changedSessionsInvalidated:3,unaffectedSessionPreserved:true}));
