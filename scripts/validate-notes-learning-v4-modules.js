const assert=require('assert/strict'),path=require('path');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const read=p=>require(path.join(root,p));
const core=read('miniprogram/subpackages/note/services/learning-semantic'),{loadBody}=read('scripts/lib/notes-learning-compiler'),body=loadBody(root);
const pack=read('miniprogram/subpackages/note/models/learning-pack'),{availableContent}=read('miniprogram/subpackages/note/services/learning-content');
const content=availableContent(body,pack,true),inventory=read('docs/knowledge-platform/content/notes/exam-inventory-v4.json'),candidates=read('docs/knowledge-platform/implementations/notes-learning-exam-v4-candidates.json');
const unique=new Set(inventory.sources.map(s=>s.sourceIdentity.subjectId+':'+s.sourceIdentity.pointId));assert.equal(unique.size,162);assert.equal(inventory.sources.length,162);
for(const module of inventory.moduleResults){const rows=inventory.sources.filter(s=>s.primaryExamModuleId===module.moduleId);assert.equal(rows.length,module.frozenSources);assert.equal(rows.filter(s=>s.inspectionState==='inspected').length,module.frameworkInspected);for(const row of rows.filter(s=>s.inspectionState==='inspected')){assert(row.frameworkSummary&&row.necessaryConditionsCheck&&row.disposition);const p=body[row.sourceIdentity.subjectId].points.find(p=>p.id===row.sourceIdentity.pointId);assert.equal(read('scripts/lib/notes-learning-compiler').sha(p),row.sourceSha256);}const old=candidates.questions.filter(q=>q.moduleId===module.moduleId);assert.equal(old.filter(q=>q.oldDisposition==='pending').length,0);const current=content.resources.filter(q=>q.subjectId===module.moduleId);assert.equal(current.length,module.activeCandidates.total);assert(current.every(q=>q.semanticAdmission));for(const q of old.filter(q=>q.v4Admission))assert(current.some(r=>r.id===q.questionId));}
const logic=inventory.moduleResults.find(m=>m.moduleId==='logic');let booleanModels=0,matchingModels=0;
if(logic){
 const byId=new Map(content.resources.map(q=>[q.id,q]));
 for(const p of [false,true])for(const q of [false,true])for(const r of [false,true]){
  const implies=(a,b)=>!a||b;
  if(implies(p,q)&&implies(q,r))assert(implies(p,r));
  assert.equal(implies(p&&q,r),implies(!r,!p||!q));booleanModels++;
 }
 assert.equal(byId.get('notes-q-nq4-logic-basic-chain').answer,'B');assert.equal(byId.get('notes-q-nq4-logic-basic-conjunction').answer,'A');
 const models=[];for(const p of [false,true])for(const q of [false,true])for(const r of [false,true])if(!(p||!q)||r)models.push({p,q,r});const options=[m=>!m.r,m=>!m.p,m=>m.p&&m.r,m=>!m.p||!m.r];assert.deepEqual(options.map(f=>models.filter(f).every(m=>m.q)),[true,false,false,false]);assert.equal(byId.get('notes-q-nq4-logic-application-contraposition').answer,'A');
 function permutations(a){return a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(p=>[v,...p])):[[]];}
 const valid=[];for(const homes of permutations(['江苏','浙江','湖南','湖北']))for(const schools of permutations(['师范','医科','财经','农业']))if(schools[0]!=='农业'&&homes[schools.indexOf('农业')]==='江苏'&&schools[2]==='师范'&&homes[3]==='湖北'&&homes[schools.indexOf('医科')]==='湖南')valid.push({homes,schools});assert.equal(valid.length,1);matchingModels=valid.length;const {homes,schools}=valid[0];assert.deepEqual([schools[0]==='医科',schools[3]==='财经',homes[2]!=='浙江',homes[2]!=='湖南'],[true,true,false,true]);assert.equal(byId.get('notes-q-nq4-logic-application-table').answer,'C');
 const pending=candidates.newDrafts.filter(q=>q.moduleId==='logic');assert.equal(pending.length,4);for(const q of pending){assert(!byId.has(q.questionId));const stored=pack.questions.find(r=>r.id===q.questionId&&r.revision===q.revision);assert(stored);assert(read('miniprogram/subpackages/note/services/learning-content').taskCompatible(stored));if(stored.exerciseKinds.includes('method'))read('scripts/lib/notes-learning-authoring').validateMethodQuestion(stored);}
 const implies=(p,q)=>!p||q;for(const p of [false,true])for(const q of [false,true])assert.equal(implies(p,q),implies(!q,!p));assert.equal(byId.get('notes-q-nq4-logic-method-equivalent').answer,'A');
}
const graphic=inventory.moduleResults.find(m=>m.moduleId==='graphic');
if(graphic){
 const byId=new Map(content.resources.map(q=>[q.id,q]));assert.equal(byId.get('notes-q-nq6-graphic-method-dual').answer,'B');assert.equal(byId.get('notes-q-nq6-graphic-method-attribute-count').answer,'A');
 const samePoints=(a,b)=>a.every(p=>b.some(q=>Math.abs(p[0]-q[0])<1e-8&&Math.abs(p[1]-q[1])<1e-8));
 const center=ps=>ps.reduce((c,p)=>[c[0]+p[0]/ps.length,c[1]+p[1]/ps.length],[0,0]);
 const central=ps=>{const c=center(ps);return samePoints(ps,ps.map(p=>[2*c[0]-p[0],2*c[1]-p[1]]));};
 const axial=ps=>{const c=center(ps),directions=ps.map(p=>[p[0]-c[0],p[1]-c[1]]);for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++)directions.push([ps[i][1]-ps[j][1],ps[j][0]-ps[i][0]]);return directions.some(([x,y])=>{const n=x*x+y*y;if(n<1e-12)return false;return samePoints(ps,ps.map(p=>{const a=p[0]-c[0],b=p[1]-c[1],dot=(a*x+b*y)/n;return[c[0]+2*dot*x-a,c[1]+2*dot*y-b];}));});};
 const triangle=[[-1,0],[1,0],[0,2]],rectangle=[[-2,-1],[2,-1],[2,1],[-2,1]],parallelogram=[[0,0],[3,0],[4,2],[1,2]];
 assert.deepEqual([axial(triangle),central(triangle)],[true,false]);assert.deepEqual([axial(parallelogram),central(parallelogram)],[false,true]);assert.deepEqual([axial(rectangle),central(rectangle)],[true,true]);
 assert.notEqual(triangle.length,rectangle.length); // all-straight boundaries can have different segment counts.
 const pending=candidates.newDrafts.filter(q=>q.moduleId==='graphic');assert.equal(pending.length,3);for(const q of pending){assert(!byId.has(q.questionId));const stored=pack.questions.find(r=>r.id===q.questionId&&r.revision===q.revision);assert(stored);assert(read('miniprogram/subpackages/note/services/learning-content').taskCompatible(stored));if(stored.exerciseKinds.includes('method'))read('scripts/lib/notes-learning-authoring').validateMethodQuestion(stored);}
 assert.equal(pack.sharedSourceBindings.filter(b=>b.id==='notes-v4-graphic-chen-from-logic').length,1);assert.equal(core.bindingAllowed(pack.sharedSourceBindings.find(b=>b.id==='notes-v4-graphic-chen-from-logic'),pack,body,true),true);
}
const verbal=inventory.moduleResults.find(m=>m.moduleId==='verbal');
if(verbal){
 const byId=new Map(content.resources.map(q=>[q.id,q]));
 for(const [id,answer] of [['notes-q-nq5-verbal-method-dimensions','B'],['notes-q-c02-verbal-application-01','A'],['notes-q-c02-verbal-application-02','B'],['notes-q-nq5-verbal-application-imagination','B'],['notes-q-nq5-verbal-application-management','D']])assert.equal(byId.get(id).answer,answer);
 for(const id of ['notes-q-nq5-verbal-application-imagination','notes-q-nq5-verbal-application-management'])assert.equal(byId.get(id).originAdaptation.kind,'neutral-display-completion');
 const pending=candidates.newDrafts.filter(q=>q.moduleId==='verbal');assert.equal(pending.length,5);for(const q of pending){assert(!byId.has(q.questionId));const stored=pack.questions.find(r=>r.id===q.questionId&&r.revision===q.revision);assert(stored);assert(read('miniprogram/subpackages/note/services/learning-content').taskCompatible(stored));if(stored.exerciseKinds.includes('method'))read('scripts/lib/notes-learning-authoring').validateMethodQuestion(stored);}
}
const quantity=inventory.moduleResults.find(m=>m.moduleId==='quantity');
if(quantity){
 const byId=new Map(content.resources.map(q=>[q.id,q]));
 const solutions=[];for(let x=1;x<=300;x++)for(let y=1;y<=300;y++)if(15*y-12*x===60&&64*x+75*y===9600)solutions.push([x,y]);assert.deepEqual(solutions,[[75,64]]);
 assert.equal(240-(6+5+4)*4,180);assert.equal(4+180/(5+4),24);
 assert.deepEqual(Array.from({length:31},(_,x)=>x).filter(x=>2*x+5*(30-x)===90),[20]);
 for(const [id,answer] of [['notes-q-nq3-quantity-basic-efficiency','C'],['notes-q-c04-quantity-method-01','C'],['notes-q-nq3-quantity-method-stage-trial','B'],['notes-q-c04-quantity-application-01','D'],['notes-q-nq3-quantity-application-cooperation','A'],['notes-q-nq3-quantity-application-efficiency','D']])assert.equal(byId.get(id).answer,answer);
 const pending=candidates.newDrafts.filter(q=>q.moduleId==='quantity');assert.equal(pending.length,5);for(const q of pending){assert(!byId.has(q.questionId));const stored=pack.questions.find(r=>r.id===q.questionId&&r.revision===q.revision);assert(stored);assert(read('miniprogram/subpackages/note/services/learning-content').taskCompatible(stored));if(stored.exerciseKinds.includes('method'))read('scripts/lib/notes-learning-authoring').validateMethodQuestion(stored);}
}
const data=inventory.moduleResults.find(m=>m.moduleId==='data-analysis');
if(data){
 const byId=new Map(content.resources.map(q=>[q.id,q]));
 assert(Math.abs((1.15*1.10-1)-0.265)<1e-12);assert(Math.abs((1.03/1.01-1)-0.02)<0.0005);
 for(const rb of [-0.5,0,0.03,0.2])for(const rc of [-0.2,0,0.01,0.3]){assert(Math.abs(((1+rb)*(1+rc)-1)-(rb+rc+rb*rc))<1e-12);assert(Math.abs(((1+rb)/(1+rc)-1)-(rb-rc)/(1+rc))<1e-12);}
 for(const [id,answer] of [['notes-q-nq2-da-application-product','B'],['notes-q-nq2-da-application-ratio','B'],['notes-q-c01-data-analysis-application-02','D']])assert.equal(byId.get(id).answer,answer);
 for(const id of ['notes-q-c01-data-analysis-application-01','notes-q-da-application-0001','notes-q-da-application-0002'])assert(!byId.has(id));
 const pending=candidates.newDrafts.filter(q=>q.moduleId==='data-analysis');assert.equal(pending.length,5);for(const q of pending){assert(!byId.has(q.questionId));const stored=pack.questions.find(r=>r.id===q.questionId&&r.revision===q.revision);assert(stored);assert(read('miniprogram/subpackages/note/services/learning-content').taskCompatible(stored));if(stored.exerciseKinds.includes('method'))read('scripts/lib/notes-learning-authoring').validateMethodQuestion(stored);}
 assert.equal(candidates.questions.filter(q=>q.oldDisposition==='pending').length,0);assert.equal(inventory.sources.filter(s=>s.inspectionState==='inspected').length,162);
}
let reviewQueue;
if(inventory.moduleResults.length===5)reviewQueue=read('docs/knowledge-platform/content/notes/exam-review-queue-v4.json');
if(reviewQueue){
 assert.equal(reviewQueue.packVersion,pack.version);assert.equal(reviewQueue.ruleDigest,pack.semanticPolicy.ruleDigest);
 assert.equal(reviewQueue.drafts.length,22);assert.equal(new Set(reviewQueue.drafts.map(q=>q.questionId+':'+q.revision)).size,22);
 for(const row of reviewQueue.drafts){const q=pack.questions.find(q=>q.id===row.questionId&&q.revision===row.revision);assert(q);assert(!content.resources.some(r=>r.id===q.id));assert.equal(row.semanticDecision,null);assert.equal(row.formalApproved,false);const binding=core.bindingFor(q,pack,body);assert.deepEqual(row.questionBinding,binding.questionBinding);assert.equal(row.dependencyDigest,binding.dependencyDigest);assert.deepEqual(row.resolvedDependencyManifest,binding.resolvedDependencyManifest);assert(row.authorIdentity);}
 assert(reviewQueue.moduleSlices.every(s=>s.count<=12&&s.acceptanceCount===0));assert.equal(reviewQueue.priorSourceHolds.length,3);
 const counts={};for(const q of candidates.questions)counts[q.oldDisposition]=(counts[q.oldDisposition]||0)+1;
 assert.deepEqual(counts,{'retained-after-review':20,held:17,'rewritten-with-version':13,'dropped-as-standalone':14});
 assert.equal(content.resources.length,33);assert.equal(new Set(content.resources.map(q=>q.id)).size,33);
 assert.equal(new Set(content.resources.flatMap(q=>q.primaryTargetIds)).size,31);
 assert(!content.resources.some(q=>/笔记|本节|上文所说/.test([q.prompt,q.explanation,...q.options.map(o=>o.text)].join(' '))));
}
assert.equal(availableContent(body,pack,false).resources.length,0);
console.log(JSON.stringify({passed:true,scope:'real module inventory, candidate consumption and independent answer witnesses; no formal approval',sourceRows:inventory.sources.length,frameworkInspected:inventory.sources.filter(s=>s.inspectionState==='inspected').length,completedStageModules:inventory.moduleResults.map(m=>m.moduleId),activeCandidates:content.resources.length,booleanModels,matchingModels,formalApproved:0},null,2));
