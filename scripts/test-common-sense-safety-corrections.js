const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');
const body = require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const source = require('../miniprogram/models/note-common-sense/index');
const old = require('./fixtures/common-sense-safety-before-correction.json');
const {createGuideContent} = require('../miniprogram/subpackages/common-sense/services/guide-content');
const {createGuideSession,STORAGE_KEY} = require('../miniprogram/subpackages/common-sense/services/guide-session');
const clone=x=>JSON.parse(JSON.stringify(x));
assert.deepEqual(body,source);
assert.deepEqual(body,require('../miniprogram/models/note-common-sense'));
const previous=clone(body);
for(const p of old.points) previous.points[previous.points.findIndex(x=>x.id===p.id)]=p;
const before=createGuideContent(previous),after=createGuideContent(body);
assert.deepEqual(after.cards.map(c=>c.id),before.cards.map(c=>c.id));
const changed=before.cards.filter(c=>after.cardById[c.id].signature!==c.signature).map(c=>c.id);
assert.equal(changed.length,10);
assert.ok(changed.every(id=>/^(life-safety|safety-common-sense)::/.test(id)));
const unchanged=before.cards.filter(c=>!changed.includes(c.id));
assert.equal(unchanged.length,643);
for(const oldPoint of old.points){
  const current=body.points.find(p=>p.id===oldPoint.id);
  assert.deepEqual(current.tabs.map(t=>t.id),oldPoint.tabs.map(t=>t.id));
  assert.deepEqual(current.readingMeta.focus.map(c=>c.sourceUnitIds),oldPoint.readingMeta.focus.map(c=>c.sourceUnitIds));
}
let tick=1000;
const values={}; const storage={getStorageSync:k=>clone(values[k]||null),setStorageSync:(k,v)=>values[k]=clone(v)};
const engine=createGuideSession(before,storage,()=>++tick);
const sessions=['ancient-prose','life-safety','safety-common-sense'].map(groupId=>engine.start({scope:'all',groupId,count:5}).session);
for(const s of sessions)engine.assess(s,'remembered');
const prose=clone(sessions[0]);
const upgraded=createGuideSession(after,storage,()=>++tick);
assert.ok(upgraded.resume(prose.key));
assert.equal(upgraded.record(prose.ids[0]).status,'remembered');
for(const s of sessions.slice(1)){
  assert.equal(upgraded.resume(s.key),null,'旧安全会话不得保留错误语义');
  assert.equal(upgraded.record(s.ids[0]),null,'已改内容的旧已记住标记应失效');
  assert.equal(upgraded.start({scope:'all',groupId:s.groupId,count:5}).invalidated,true);
}
assert.equal(values[STORAGE_KEY].schema,1);
const fire=body.points.find(p=>p.id==='life-safety');
const safety=body.points.find(p=>p.id==='safety-common-sense');
const fireText=JSON.stringify(fire),safetyText=JSON.stringify(safety);
assert.ok(fireText.includes('BC')&&fireText.includes('ABC')&&fireText.includes('抗溶'));
assert.ok(!safetyText.includes('昏迷者做人工呼吸'));
assert.ok(safetyText.includes('无反应且无正常呼吸'));
assert.ok(!safetyText.includes('着火层—着火层的上层—着火层的下层'));
assert.ok(!safetyText.includes('铝锑合金'));
assert.ok(!safetyText.includes('尽量寻找低洼处'));

// A table correction may change wording, but never bypass evidence or row identity.
for(const fault of ['metadata','shape']){
  const inject=`const fs=require('fs');const read=fs.readFileSync;fs.readFileSync=function(p,...args){const raw=read.call(this,p,...args);if(String(p).endsWith('/safety-common-sense.json')){const a=JSON.parse(String(raw));const u=a.contentUnits.find(x=>x.currentOfficialOverride);${fault==='metadata'?'u.currentOfficialOverride.sources=[];':'u.currentOfficialOverride.rows.pop();'}return JSON.stringify(a);}return raw;};require('./scripts/validate-common-sense-source-audit.js');`;
  const compactLog="const print=console.log;console.log=x=>{const value=JSON.parse(x);print(JSON.stringify({problems:value.problems}));};";
  const result=spawnSync(process.execPath,['-e',compactLog+inject],{cwd:path.resolve(__dirname,'..'),encoding:'utf8',maxBuffer:4*1024*1024});
  assert.notEqual(result.status,0,`缺少${fault}的纠正必须拒绝`);
  assert.ok(`${result.stdout}${result.stderr}`.includes(fault==='metadata'?'missing verification evidence':'preserve row/column identity'));
}
console.log(JSON.stringify({ok:true,stableCardIds:653,changedCardSignatures:10,unchangedCardSignatures:643,unchangedSessionPreserved:true,changedSessionsInvalidated:true,malformedOverridesRejected:2},null,2));
