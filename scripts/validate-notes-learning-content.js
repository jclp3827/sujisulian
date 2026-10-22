#!/usr/bin/env node
const assert=require('assert/strict');
const {loadBody,compile,findSource,sha}=require('./lib/notes-learning-compiler');
const {availableContent,entryResources}=require('../miniprogram/subpackages/note/services/learning-content');
const {createEngine}=require('../miniprogram/subpackages/note/services/practice-session');
const source=require('../docs/knowledge-platform/content/notes/learning-v1.json');
const body=loadBody(require('path').resolve(__dirname,'..')), pack=compile(source,body), content=availableContent(body,pack,true);
const checks=[];function test(name,fn){fn();checks.push(name);}
test('all enrolled subject and mode combinations consume exact scope with separate frozen sessions',()=>{
 for(const subjectId of ['data-analysis','verbal','quantity','logic','graphic']){
  const storage={data:{},getStorageSync(k){return this.data[k]},setStorageSync(k,v){this.data[k]=JSON.parse(JSON.stringify(v))}};
  const e=createEngine(content,storage);const sessions=[];
  for(const kind of ['basic','method','application']){
   const result=e.start({kind,scope:{subjectId,categoryId:'all',pointId:''}});if(!entryResources(content,kind,{subjectId}).length){assert.equal(result.empty,true);continue;} assert(result.session,subjectId+'/'+kind);
   assert(result.session.items.every(i=>i.subjectId===subjectId&&i.exerciseKinds.includes(kind)));sessions.push(result.session);
  }
  sessions.forEach(s=>assert.equal(e.resume(s.kind).id,s.id));
 }
 assert.equal(entryResources(content,'application',{subjectId:'graphic'}).length,0);
});
test('imported full applications match their original block without copied overrides',()=>{
 for(const q of pack.questions.filter(q=>q.origin)){
  const p=body[q.origin.subjectId].points.find(p=>p.id===q.origin.pointId), t=p.tabs.find(t=>t.id===q.origin.tabId);
  const original=t.blocks.find(b=>sha(b)===q.origin.expectedBlockSha256);assert(original);
  assert.equal(q.prompt,q.originAdaptation?q.originAdaptation.instruction+'\n'+original.stem:original.stem);assert.equal(q.originTask?.verified,true);assert.deepEqual(q.options,original.options);assert.equal(q.answer,original.answer);assert.equal(q.explanation,original.analysis);
  assert.equal(q.sourceKind,'legacy-unverified');assert.equal(q.status,'review');
 }
});
test('pilot arithmetic is consistent, without asserting exam provenance or content approval',()=>{
 assert.equal(2.25/4.5,.5);
 const regionalGrowth=1.26*(.127/.122)-1;assert(regionalGrowth>.26&&regionalGrowth<.32);
 assert.equal(.6*75-.75*64,-3);assert.equal(.4*.4*75+.25*.75*64,24);assert.equal(75-64,11);
 assert(80/900<20/100);
});
test('blocked sources and development-only admission remain in force after expansion',()=>{
 assert.equal(availableContent(body,pack,false).resources.length,0);
 assert(content.resources.every(r=>r.resourceType==='question'));
 for(const q of content.resources)assert(!q.refs.some(r=>source.blockedPointIds.includes(r.subjectId+':'+r.pointId)));
 for(const k of ['basic','method','application'])assert(Array.isArray(source.entryPlans[k].resourceIds));
});
test('imported growth, work and logic examples have independently checked answers',()=>{
 const byRecord=new Map(content.resources.filter(q=>q.origin).map(q=>[q.origin.sourceExampleRecordId,q]));
 const expected={'notes-source-example-000018':'B','notes-source-example-000019':'B','notes-source-example-000119':'A','notes-source-example-000120':'D','notes-source-example-000164':'A','notes-source-example-000174':'C','notes-source-example-000187':'B','notes-source-example-000188':'D'};
 for(const [id,key] of Object.entries(expected))if(byRecord.has(id))assert.equal(byRecord.get(id).answer,key,id);
 assert(Math.abs(((1+.15)*(1+.10)-1)-.265)<1e-12);assert(Math.abs((1.03/1.01-1)-.019801980198)<1e-10);
 assert.equal(4+(240-(6+5+4)*4)/(5+4),24);assert.equal((30*5-18*5)/(5-2),20);
 const models=[];for(const p of [false,true])for(const q of [false,true])for(const r of [false,true])if(!(p||!q)||r)models.push({p,q,r});
 const assumptions=[m=>!m.r,m=>!m.p,m=>m.p&&m.r,m=>!m.p||!m.r];
 assert.deepEqual(assumptions.map(f=>models.filter(f).every(m=>m.q)),[true,false,false,false]);
 function permutations(a){return a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(p=>[v,...p])):[[]];}
 const matches=[];for(const homes of permutations(['江苏','浙江','湖南','湖北']))for(const schools of permutations(['师范','医科','财经','农业'])){
  if(schools[0]==='农业'||homes[schools.indexOf('农业')]!=='江苏'||schools[2]!=='师范'||homes[3]!=='湖北'||homes[schools.indexOf('医科')]!=='湖南')continue;
  matches.push({homes,schools});
 }
 assert.equal(matches.length,1);const {homes,schools}=matches[0];assert.deepEqual([schools[0]==='医科',schools[3]==='财经',homes[2]!=='浙江',homes[2]!=='湖南'],[true,true,false,true]);
});
console.log(JSON.stringify({passed:true,checks:checks.length,reports:checks,version:pack.version,questions:pack.questions.length,recipes:pack.recipes.length,approvedResources:0},null,2));
