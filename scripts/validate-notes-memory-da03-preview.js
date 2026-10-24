const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createRequire } = require('module');
const root = path.resolve(__dirname, '..');
const { KEY } = require('../miniprogram/subpackages/note/services/memory-session');
const clone = value => JSON.parse(JSON.stringify(value));
const event = dataset => ({ currentTarget: { dataset } });
const settle = () => new Promise(resolve => setImmediate(resolve));
function storage() {
  const data = { 'notesPractice:v1:state': { keep: 'application-history' } };
  return { data, getStorageSync(key) { if (this.failRead) throw Error('read'); return clone(data[key] || null); },
    setStorageSync(key, value) { if (this.failWrite) throw Error('quota'); data[key] = clone(value); } };
}
function page(options = {}, store = storage(), extra = {}) {
  const filename = path.join(root, 'miniprogram/subpackages/note/memory/index.js');
  let config; const calls = []; let imageCalls = 0;
  const wx = { getAccountInfoSync: () => ({ miniProgram: { envVersion: extra.env || 'develop' } }),
    getStorageSync: store.getStorageSync.bind(store), setStorageSync: store.setStorageSync.bind(store),
    setNavigationBarTitle() {}, navigateTo: value => calls.push(value), switchTab: value => calls.push(value),
    previewImage: value => calls.push(value), cloud: { callFunction() { imageCalls++; return Promise.resolve({ result: { code: 0, url: 'https://test.invalid/image-' + imageCalls } }); } } };
  vm.compileFunction(fs.readFileSync(filename, 'utf8'), ['require', 'Page', 'wx'], { filename })(createRequire(filename), value => config = value, wx);
  const p = { ...config, data: clone(config.data), calls, setData(value) { Object.assign(this.data, value); }, imageCalls: () => imageCalls };
  if (!extra.images) p.resolveImages = () => {};
  p.onLoad(options); return p;
}
const {runtimeState}=require('./lib/notes-memory-preview');
const {loadInputs,register}=require('./lib/notes-memory-admission');
const {digest}=require('../miniprogram/subpackages/note/services/learning-semantic');
const {availableCards,resolveCard}=require('../miniprogram/subpackages/note/services/memory-content');
const {decorateBlocks}=require('../miniprogram/subpackages/note/services/note-blocks');
const {createMemoryEngine}=require('../miniprogram/subpackages/note/services/memory-session');
const {isDevelopment}=require('../miniprogram/subpackages/note/services/learning-content');
const catalog=require('../miniprogram/subpackages/note/models/note-catalog'),pack=require('../miniprogram/subpackages/note/models/memory-pack');
const firstLedger=require('../docs/knowledge-platform/content/notes/memory-v5-da01-targets-v2.json'),nextLedger=require('../docs/knowledge-platform/content/notes/memory-v5-da02-targets-v2.json');
const thirdLedger=require('../docs/knowledge-platform/content/notes/memory-v5-da03-targets-v2.json');
const expected=[...firstLedger.cards.filter(c=>!c.localHold),...nextLedger.cards,...thirdLedger.cards].map(c=>c.id).sort();
const inputs=loadInputs(root),cards=availableCards(catalog,pack,true),before=digest(inputs.context.body);
const tests=[],reports=[],routes=[];const test=(name,fn)=>tests.push({name,fn});
test('actual compiled 30-card pack matches twenty-two registered source versions and frozen bundles',()=>{
 const state=runtimeState(root);assert.equal(state.developmentTotal,30);assert.equal(state.legacySamples,8);assert.equal(state.formalTotal,0);
 assert.deepEqual(state.registeredCardIds.slice().sort(),expected);assert.deepEqual(state.byKind,{basic:15,method:15});assert.equal(state.bySubject['data-analysis'],24);
 assert.equal(state.independentReviews,0);assert.equal(state.formalEnablements,0);
 for(const id of expected){const c=cards.find(c=>c.id===id);assert.equal(c.sampleOnly,false);assert.equal(c.status,'preview-pending');assert.equal(c.formalApproved,false);}
});
test('original eight semantic identities remain byte-compatible and unrelated subjects stay unchanged',()=>{
 const frozen=require('../docs/knowledge-platform/content/notes/memory-v5-version-compatibility.json');
 for(const row of frozen.cards){const current=cards.find(c=>c.id===row.card.id);assert(current);assert.equal(current.semanticVersion,row.legacySemanticVersion);}
 assert.equal(cards.filter(c=>c.subjectId!=='data-analysis').length,6);
});
test('two local holds are rejected by registration and invisible in both current memory directories',()=>{
 for(const card of inputs.cards.filter(c=>c.localHold)){
  assert(!cards.some(c=>c.id===card.id));assert.throws(()=>register(inputs,{cardId:card.id,registrationTaskId:'hold-negative-test',registeredAt:new Date().toISOString()}),/hold/);
  const p=page({kind:card.kind,subjectId:card.subjectId,cardId:card.id});assert.equal(p.data.state,'error');assert.equal(p.data.card,null);
 }
});
test('every actual listed ID opens its exact card and source; native return retains reveal and scroll',()=>{
 const seen=new Set();for(const kind of ['basic','method']){
  const list=page({kind});assert.equal(list.data.total,15);list.handleList();assert.equal(list.data.listing.length,15);
  for(const card of list.data.listing){
   list.handlePick(event({id:card.id}));const options=Object.fromEntries(new URLSearchParams(list.calls.at(-1).url.split('?')[1]));
   const p=page(options);assert.equal(p.data.state,'card');assert.equal(p.data.card.id,card.id);seen.add(card.id);
   p.handleReveal();p.handleScroll({detail:{scrollTop:411}});p.handleSource(event({index:0}));p.onHide();
   const source=Object.fromEntries(new URLSearchParams(p.calls.at(-1).url.split('?')[1]));const ref=card.refs[0];
   assert.equal(source.moduleId,ref.subjectId);assert.equal(source.pointId,ref.pointId);assert.equal(source.tabId,ref.tabId);assert(!source.memoryReturn);
   assert.deepEqual(p.data.activeBlocks,decorateBlocks(resolveCard(card,catalog).blocks));
   p.onShow();assert.equal(p.data.card.id,card.id);assert.equal(p.data.answerVisible,true);assert.equal(p.data.scrollTop,411);assert.deepEqual(p.engine.ratings(),{});
   routes.push({cardId:card.id,kind,subjectId:card.subjectId,categoryId:card.categoryId,cardURL:list.calls.at(-1).url,sourceURL:p.calls.at(-1).url});
  }
 }assert.equal(seen.size,30);
});
test('actual subject/topic selectors agree with exact IDs and counts, including empty scopes',()=>{
 for(const kind of ['basic','method'])for(const subject of page({kind}).directory){
  const p=page({kind}),index=p.data.subjects.findIndex(s=>s.id===subject.id);p.handleSubject({detail:{value:index}});
  assert.equal(p.scope.subjectId,subject.id);assert.deepEqual(p.data.listing.map(c=>c.id).sort(),cards.filter(c=>c.kind===kind&&c.subjectId===subject.id).map(c=>c.id).sort());
  for(let i=1;i<p.data.topics.length;i++){
   p.handleTopic({detail:{value:i}});const expectedIds=cards.filter(c=>c.kind===kind&&c.subjectId===subject.id&&c.categoryId===p.scope.categoryId).map(c=>c.id).sort();
   assert.deepEqual(p.data.listing.map(c=>c.id).sort(),expectedIds);assert.equal(p.data.total,expectedIds.length);if(!expectedIds.length)assert.equal(p.data.state,'empty');
  }
 }
});
test('only develop sees pending cards; trial/release and missing environment fail closed',()=>{
 for(const env of ['trial','release'])for(const kind of ['basic','method']){const p=page({kind},storage(),{env});assert.equal(p.data.total,0);assert.equal(p.data.listing.length,0);}
 assert.equal(isDevelopment({getAccountInfoSync(){throw Error('unavailable');}}),false);assert.equal(availableCards(catalog,pack,false).length,0);
});
test('old unfinished rounds remain frozen at four while the current directory exposes fifteen',()=>{
 const s=storage(),oldCards=availableCards(catalog,{...pack,enrollment:undefined},true),engine=createMemoryEngine(oldCards,s,()=>100);
 const previous=engine.start('basic',{subjectId:'all',categoryId:'all'});engine.reveal(previous.id);engine.position(previous.id,288);
 const p=page({kind:'basic'},s);assert.equal(p.data.sessionId,previous.id);assert.equal(p.data.total,4);assert.equal(p.data.answerVisible,true);assert.equal(p.data.scrollTop,288);
 p.handleList();assert.equal(p.data.listing.length,15);assert.deepEqual(p.engine.get(previous.id).items,engine.get(previous.id).items);
});
test('new and old weak ratings feed the same frozen exam without adding unseen candidates',()=>{
 const s=storage(),first=expected[0],second=expected[1],old=cards.find(c=>c.sampleOnly&&c.kind==='method'&&c.subjectId==='logic').id;
 const rate=(id,result)=>{const c=cards.find(c=>c.id===id),p=page({kind:c.kind,subjectId:c.subjectId,cardId:id},s);p.handleReveal();p.handleAssess(event({result}));return p;};
 rate(first,'missed');rate(old,'fuzzy');const exam=page({kind:'exam'},s),session=exam.engine.get(exam.data.sessionId);
 assert.deepEqual(session.items.map(c=>c.id),[first,old]);exam.handleSkip();assert.equal(exam.engine.ratings()[first].result,'missed');
 rate(second,'missed');const resumed=page({kind:'exam'},s);assert.equal(resumed.data.sessionId,session.id);assert.equal(resumed.data.total,2);
 resumed.handleFresh();assert.deepEqual(resumed.engine.get(resumed.data.sessionId).items.map(c=>c.id),[first,second,old]);
 assert.deepEqual(s.data['notesPractice:v1:state'],{keep:'application-history'});
});
test('reveal/reading never grade, feedback requires reveal and button skips preserve weakness',()=>{
 const id=expected[0],c=cards.find(c=>c.id===id),p=page({kind:c.kind,cardId:id});
 p.handleAssess(event({result:'remembered'}));assert.deepEqual(p.engine.ratings(),{});assert.equal(p.data.card.id,id);
 p.handleScroll({detail:{scrollTop:180}});p.handleReveal();assert.deepEqual(p.engine.ratings(),{});
 p.handleAssess(event({result:'fuzzy'}));assert.equal(p.engine.ratings()[id].result,'fuzzy');p.handlePrev();p.handleSkip();assert.equal(p.engine.ratings()[id].result,'fuzzy');
});
test('failed write does not advance or lose old application/history; failed read is retryable',()=>{
 const s=storage(),id=expected[0],c=cards.find(c=>c.id===id),p=page({kind:c.kind,cardId:id},s);p.handleReveal();const stored=clone(s.data),index=p.data.index;
 s.failWrite=true;p.handleAssess(event({result:'missed'}));assert.equal(p.data.card.id,id);assert.equal(p.data.index,index);assert.deepEqual(s.data,stored);assert(p.data.notice.includes('未保存'));
 s.failWrite=false;p.handleAssess(event({result:'missed'}));assert.equal(p.engine.ratings()[id].result,'missed');
 const read=storage();read.failRead=true;const broken=page({kind:'basic'},read);assert.equal(broken.data.state,'error');read.failRead=false;broken.handleRetry();assert.equal(broken.data.state,'card');
 assert.deepEqual(read.data['notesPractice:v1:state'],{keep:'application-history'});
});
test('stale source/registration fails closed for only the affected card; raw approval flags cannot enable',()=>{
 const id=expected[0],raw=pack.enrollment.cards.find(c=>c.id===id),ref=raw.refs[0],body=clone(inputs.context.body);
 body[ref.subjectId].points.find(p=>p.id===ref.pointId).tabs.find(t=>t.id===ref.tabId).blocks[ref.blocks[0].blockIndex].title='changed-source';
 assert.equal(availableCards(body,pack,true).length,29);assert(!availableCards(body,pack,true).some(c=>c.id===id));
 const bad=clone(pack);bad.enrollment.registrations.find(r=>r.cardId===id).binding.cardSnapshotDigest='0'.repeat(64);assert.equal(availableCards(catalog,bad,true).length,29);
 const forged=clone(pack);forged.enrollment.cards.forEach(c=>{c.formalApproved=true;c.status='approved';});assert.equal(availableCards(catalog,forged,false).length,0);
});
test('all twenty-two projected cards preserve original formula fields and execute the existing formula component',()=>{
 const file=path.join(root,'miniprogram/components/math-formula/index.js');let component;
 vm.compileFunction(fs.readFileSync(file,'utf8'),['Component'],{filename:file})(value=>component=value);
 let formulas=0,fractions=0;
 function inspect(value){if(!value||typeof value!=='object')return;if(value.type==='frac'){assert(value.numNodes.length);assert(value.denNodes.length);fractions++;}for(const child of Object.values(value))if(child&&typeof child==='object')Array.isArray(child)?child.forEach(inspect):inspect(child);}
 function render(nodes,content){const p={properties:{nodes:nodes||[],content:content||''},data:{},setData(v){Object.assign(this.data,v);}};component.methods.updateFormulaNodes.call(p);assert(p.data.formulaNodes.length);assert(!/undefined|NaN/.test(JSON.stringify(p.data.formulaNodes)));inspect(p.data.formulaNodes);formulas++;}
 for(const id of expected){const c=cards.find(c=>c.id===id),blocks=resolveCard(c,catalog).blocks;
  for(const b of blocks){if(b.type==='formula'){if(b.nodes?.length||b.content)render(b.nodes,b.content);else if(b.contentLines)for(const line of b.contentLines)render([],line);}if(b.cellNodes)for(const row of Object.values(b.cellNodes))for(const nodes of Object.values(row))if(Array.isArray(nodes)&&nodes.length)render(nodes,'');}
 }
 assert(formulas>=6);assert(fractions>=2);assert.equal(digest(inputs.context.body),before);
});
test('current templates retain a single original-text action and button-only navigation',()=>{
 const template=fs.readFileSync(path.join(root,'miniprogram/subpackages/note/memory/index.wxml'),'utf8');
 assert(!/bind(?:touchstart|touchend|touchmove)|swiper/.test(template));assert.equal((template.match(/查看原文/g)||[]).length,1);assert(template.includes('handlePrev'));assert(template.includes('handleAssess'));
 const p=page();assert.equal(p.handleTouchStart,undefined);assert.equal(p.handleTouchEnd,undefined);
});

test('DA02 covers nine sources with eleven distinct goals and keeps all source-risk exclusions',()=>{
 const {validateLedger}=require('./lib/notes-memory-expansion-v2');assert.deepEqual(validateLedger(inputs.context,nextLedger),{sources:9,targets:11,localTargetHolds:0});
 assert.equal(nextLedger.cards.filter(c=>c.kind==='basic').length,5);assert.equal(nextLedger.cards.filter(c=>c.kind==='method').length,6);
 const selected={'growth-amount':[0,1,6],'interval-growth':[0,1,4],'annual-growth-rate':[0,2],'annual-rate-vs-amount':[0,4],'annual-average-vs-increment':[1,2,4,7],'reading-scope':[0],'base-ratio':[0,1],'mixed-growth-two-parts':[0,1,3,4],'percentage-point-vs-percent':[0,1,3],'overlap-maximum':[2],'overlap-signal':[0]};
 for(const card of nextLedger.cards){assert.deepEqual(card.refs[0].blocks.map(b=>b.blockIndex),selected[card.id.replace('memory-v5-da02-','')]);assert(!resolveCard(card,catalog).blocks.some(b=>['example','practice'].includes(b.type)));}
 const annual=nextLedger.cards.filter(c=>c.pointId==='annual-growth-rate');assert.equal(annual.length,2);assert.notEqual(annual[0].kind,annual[1].kind);assert.notEqual(annual[0].recallGoal,annual[1].recallGoal);
 const overlap=nextLedger.cards.filter(c=>c.pointId==='data-inclusion');assert.equal(overlap.length,2);assert.notEqual(overlap[0].recallGoal,overlap[1].recallGoal);
});
test('remaining-source triage covers all twenty-five sources with exact original observations and locators',()=>{
 const board=require('../docs/knowledge-platform/content/notes/memory-v5-da02-triage.json'),expectedUnits=[...inputs.context.units.values()].filter(u=>u.primaryModuleId==='data-analysis'&&!firstLedger.sourceWorkUnitIds.includes(u.workUnitId));
 assert.equal(board.sources.length,25);assert.deepEqual(board.sources.map(s=>s.workUnitId).sort(),expectedUnits.map(s=>s.workUnitId).sort());
 const counts={};for(const row of board.sources){const u=inputs.context.units.get(row.workUnitId);assert.deepEqual(row.sourceIdentity,u.sourceIdentity);assert.equal(row.sourceSha256,u.sourceSha256);assert.equal(row.tabSha256,u.tabSha256);assert.deepEqual(row.originalObservations,u.sourceHolds);assert.deepEqual(row.originalBlocks,u.blocks);counts[row.disposition]=(counts[row.disposition]||0)+1;
  const selected=nextLedger.cards.filter(c=>c.workUnitIds.includes(row.workUnitId));assert.deepEqual(row.targetIds.slice().sort(),selected.map(c=>c.targetId).sort());
  if(selected.length){const indices=[...new Set(selected.flatMap(c=>c.refs[0].blocks.map(b=>b.blockIndex)))].sort((a,b)=>a-b);assert.deepEqual(row.selectedBlockIndices,indices);assert(!indices.some(i=>row.excludedBlockIndices.includes(i)));}
  if(row.disposition==='deferred')assert(row.reason&&row.recovery);
  if(row.disposition==='reuse')assert(row.reusedCardIds.every(id=>pack.cards.some(c=>c.id===id)));
 }assert.deepEqual(counts,{'targets-proposed':9,deferred:14,reuse:2});
});
test('bounded formula checks support the selected exact relationships without admitting approximation shortcuts',()=>{
 const close=(a,b)=>assert(Math.abs(a-b)<1e-9);
 for(const r1 of [-.5,0,.2,1])for(const r2 of [-.2,0,.3,.8])close((1+r1)*(1+r2)-1,r1+r2+r1*r2);
 for(const base of [10,80,1000])for(const rate of [-.2,0,.25,.8]){const current=base*(1+rate);close(current-base,current*rate/(1+rate));}
 for(const part of [10,30])for(const whole of [100,200])for(const a of [-.1,.2])for(const b of [0,.3])close(part/whole,(part*(1+a)/(whole*(1+b)))*(1+b)/(1+a));
 for(const x of [.1,.3,.6])for(const y of [.2,.4,.9]){const upper=Math.min(x,y),lower=Math.max(0,x+y-1);assert(upper>=lower);if(x+y>1)assert(lower>0);}
 const a=cards.find(c=>c.id==='memory-v5-da02-mixed-growth-two-parts');assert(a.prompt.includes('两个互不重叠')&&a.prompt.includes('基期量均为正'));const b=cards.find(c=>c.id==='memory-v5-da02-overlap-maximum');assert(b.prompt.includes('同一总体'));
});
test('prior user test feedback binds only the six presented DA01 snapshots and creates no formal decision',()=>{
 const f=require('../docs/knowledge-platform/implementations/evidence/notes-memory-v5-da01-user-feedback-20261023.json');assert.equal(f.statement,'测试通过，符合预期，继续推进');assert.equal(f.cards.length,6);assert.equal(f.formalDecisionReceiptCreated,false);assert.equal(f.formalEnablementCreated,false);
 for(const row of f.cards){assert(row.cardId.startsWith('memory-v5-da01-'));assert.deepEqual(row.binding,pack.enrollment.registrations.find(r=>r.cardId===row.cardId).binding);}
 assert.equal(inputs.reviewLedger.reviews.length,0);assert.equal(inputs.enablementLedger.enablements.length,0);
});

test('concise prompt rule applies the two exact user wordings and all eleven ongoing cards',()=>{
 const rule=require('../docs/knowledge-platform/implementations/evidence/notes-memory-v5-concise-prompts-20261023.json');assert.equal(rule.ruleId,'NOTE-V5-016');assert.equal(rule.edits.length,13);
 const expectedText={'memory-v5-da01-multiple-growth':'是几倍与增长几倍的区别','memory-v5-da01-pulling-contribution':'拉动增长率与增量贡献率怎样区分？'};
 for(const edit of rule.edits){const c=cards.find(c=>c.id===edit.cardId);assert.equal(c.prompt,edit.newPrompt);assert.equal(c.revision,edit.newRevision);assert.equal(c.revision,2);assert((c.prompt.match(/？/g)||[]).length<=1);const versions=pack.enrollment.registrations.filter(r=>r.cardId===c.id);assert.equal(versions.length,2);assert.equal(versions[1].supersedesRegistrationId,versions[0].registrationId);}
 for(const [id,prompt] of Object.entries(expectedText))assert.equal(cards.find(c=>c.id===id).prompt,prompt);
 const product=fs.readFileSync(path.join(root,'docs/knowledge-platform/implementations/notes-memory-v5-product.md'),'utf8');assert(product.includes('NOTE-V5-016'));assert(product.includes('不在提问中提前罗列'));
});
test('shortened old prompts preserve original frozen feedback and history without migrating old ratings',()=>{
 const f=require('../docs/knowledge-platform/implementations/evidence/notes-memory-v5-da01-user-feedback-20261023.json'),changed=['memory-v5-da01-multiple-growth','memory-v5-da01-pulling-contribution'];
 for(const id of changed){const row=f.cards.find(c=>c.cardId===id),frozen=JSON.parse(fs.readFileSync(path.join(root,row.frozenBundlePath)));assert.deepEqual(frozen.binding,row.binding);assert.equal(digest(frozen.bundle),row.binding.reviewBundleDigest);
  const previous=resolveCard(frozen.bundle.card,catalog),current=cards.find(c=>c.id===id);assert.notEqual(previous.semanticVersion,current.semanticVersion);assert.equal(digest(previous.refs),digest(current.refs));
  const st=storage(),oldEngine=createMemoryEngine([previous],st,()=>100),v=oldEngine.start('method',{});oldEngine.reveal(v.id);oldEngine.assess(v.id,'fuzzy');const original=clone(st.data[KEY]);const engine=createMemoryEngine(cards,st,()=>200);
  assert.equal(engine.weak({},false).some(c=>c.id===id),false);assert.equal(engine.weak({},true).some(c=>c.id===id),true);assert.deepEqual(st.data[KEY],original);assert.equal(st.data[KEY].ratings[id].version,previous.semanticVersion);
 }
});

test('DA03 uses five concise goals from two sources and excludes unresolved source fragments',()=>{
 const {validateLedger}=require('./lib/notes-memory-expansion-v2');assert.deepEqual(validateLedger(inputs.context,thirdLedger),{sources:2,targets:5,localTargetHolds:0});assert.equal(thirdLedger.cards.filter(c=>c.kind==='basic').length,3);assert.equal(thirdLedger.cards.filter(c=>c.kind==='method').length,2);
 const selections={'abrx-roles':[0,1],'product-growth':[3],'quotient-growth':[4,7],'product-vs-quotient':[3,4,6,7],'positive-fraction-compare':[0,3,6]};
 for(const c of thirdLedger.cards){assert.deepEqual(c.refs[0].blocks.map(b=>b.blockIndex),selections[c.id.replace('memory-v5-da03-','')]);assert.equal(c.revision,1);assert.equal((c.prompt.match(/？/g)||[]).length,1);assert(!/[。；]/.test(c.prompt));assert(!resolveCard(c,catalog).blocks.some(b=>['example','practice','image-note'].includes(b.type)));}
 const role=cards.find(c=>c.id==='memory-v5-da03-abrx-roles');assert(role.blocks.some(b=>b.title==='四量含义'));assert.equal(role.blocks.length,2);
 for(const id of ['product-growth','quotient-growth']){const c=cards.find(c=>c.id==='memory-v5-da03-'+id);assert(c.blocks[0].description.includes(id==='product-growth'?'A = B × C':'A = B / C'));assert(!c.blocks.some(b=>b.title==='四量含义'));}
});
test('DA03 recovery preserves all fourteen previous deferred source identities and observations',()=>{
 const old=require('../docs/knowledge-platform/content/notes/memory-v5-da02-triage.json').sources.filter(s=>s.disposition==='deferred'),board=require('../docs/knowledge-platform/content/notes/memory-v5-da03-recovery.json');
 assert.equal(board.sources.length,14);assert.deepEqual(board.sources.map(s=>s.workUnitId).sort(),old.map(s=>s.workUnitId).sort());const counts={};
 for(const row of board.sources){const previous=old.find(s=>s.workUnitId===row.workUnitId),targets=thirdLedger.cards.filter(c=>c.workUnitIds.includes(row.workUnitId));assert.deepEqual(row.sourceIdentity,previous.sourceIdentity);assert.equal(row.sourceSha256,previous.sourceSha256);assert.equal(row.tabSha256,previous.tabSha256);assert.deepEqual(row.originalObservations,previous.originalObservations);assert.deepEqual(row.targetIds,targets.map(c=>c.targetId));assert(row.remainingIssues&&row.recovery);counts[row.disposition]=(counts[row.disposition]||0)+1;if(targets.length)assert(!row.selectedBlockIndices.some(i=>row.excludedBlockIndices.includes(i)));}
 assert.deepEqual(counts,{'partial-targets-proposed':2,'table-audited-not-enrolled':1,deferred:11});assert.equal(board.tableAudit.cardCreated,false);assert.equal(board.tableAudit.entries.length,20);assert.equal(board.tableAudit.identicalOriginalTable,true);
});
test('positive fraction domain is explicit; signed counterexample cannot inherit the monotonic shortcut',()=>{
 const c=cards.find(c=>c.id==='memory-v5-da03-positive-fraction-compare');assert(c.prompt.includes('分子、分母均为正'));for(const n1 of [1,3,8])for(const d1 of [2,5])for(const dn of [1,4])for(const dd of [1,3])assert((n1+dn)/d1>n1/(d1+dd));assert(-1/2>-1/1);
 const p=cards.find(c=>c.id==='memory-v5-da03-product-growth'),q=cards.find(c=>c.id==='memory-v5-da03-quotient-growth');assert.notEqual(p.recallGoal,q.recallGoal);
 for(const b of [-.5,0,.25,.8])for(const c of [-.3,0,.4,1]){assert(Math.abs((1+b)*(1+c)-1-(b+c+b*c))<1e-9);assert(Math.abs((1+b)/(1+c)-1-(b-c)/(1+c))<1e-9);}
});
test('fraction-percentage audit checks every source cell at its printed precision and keeps one canonical table',()=>{
 const table=require('../docs/knowledge-platform/content/notes/memory-v5-da03-recovery.json').tableAudit,body=inputs.context.body;
 for(const ref of [table.canonicalRef,table.duplicateRef]){const t=body[ref.subjectId].points.find(p=>p.id===ref.pointId).tabs.find(t=>t.id===ref.tabId);assert.equal(require('../miniprogram/subpackages/note/services/memory-reference').hash(t.blocks[ref.blockIndex]),ref.expectedBlockSha256);}
 const seen=new Set();for(const row of table.entries){const [n,d]=row.fraction.split('/').map(Number),text=row.displayedPercent.replace('%',''),digits=(text.split('.')[1]||'').length,scale=10**digits,numerator=Number(text.replace('.','')),delta=Math.abs(numerator*d-100*n*scale);assert(2*delta<=d);assert.equal(row.exact,delta===0);assert(!seen.has(row.fraction));seen.add(row.fraction);}
 assert.equal(seen.size,20);assert(!thirdLedger.cards.some(c=>c.pointId==='multiplication-arithmetic'||c.pointId==='share-415'));
});

test('previous 25-card package keeps its unfinished twelve-card basic round while new directory exposes fifteen',()=>{
 const oldPack={...pack,enrollment:{...pack.enrollment,cards:pack.enrollment.cards.filter(c=>!c.id.startsWith('memory-v5-da03-'))}},oldCards=availableCards(catalog,oldPack,true);assert.equal(oldCards.length,25);const st=storage(),engine=createMemoryEngine(oldCards,st,()=>123),v=engine.start('basic',{subjectId:'all',categoryId:'all'});assert.equal(v.items.length,12);engine.reveal(v.id);engine.position(v.id,377);const p=page({kind:'basic'},st);assert.equal(p.data.total,12);assert.equal(p.data.sessionId,v.id);assert.equal(p.data.scrollTop,377);assert.equal(p.data.answerVisible,true);p.handleList();assert.equal(p.data.listing.length,15);assert.deepEqual(p.engine.get(v.id).items,v.items);
});
test('all five new DA03 IDs self-rate and enter the same scoped exam without touching application history',()=>{
 const st=storage();for(const c of thirdLedger.cards){const p=page({kind:c.kind,subjectId:c.subjectId,cardId:c.id},st);assert.equal(p.data.card.id,c.id);p.handleReveal();p.handleAssess(event({result:'fuzzy'}));assert.equal(p.engine.ratings()[c.id].result,'fuzzy');}
 const exam=page({kind:'exam',subjectId:'data-analysis'},st);assert.equal(exam.data.total,5);assert.deepEqual(exam.engine.get(exam.data.sessionId).items.map(c=>c.id).sort(),thirdLedger.cards.map(c=>c.id).sort());exam.handleSkip();assert.equal(Object.keys(exam.engine.ratings()).length,5);assert.deepEqual(st.data['notesPractice:v1:state'],{keep:'application-history'});
});
(async()=>{for(const {name,fn} of tests){await fn();reports.push(name);}console.log(JSON.stringify({passed:true,checks:reports.length,scope:'Current 30-card actual page code and formula component, isolated storage; not simulator/device visual or independent content approval',simulatorVisualAcceptance:false,deviceAcceptance:false,reports,routes},null,2));})().catch(error=>{console.error(error);process.exitCode=1;});
