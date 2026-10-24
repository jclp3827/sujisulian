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
const expected=['interval-growth-reverse','current-ratio','hierarchical-ratio','ratio-change','multiple-growth','pulling-contribution'].map(s=>'memory-v5-da01-'+s).sort();
const inputs=loadInputs(root),cards=availableCards(catalog,pack,true),before=digest(inputs.context.body);
const tests=[],reports=[],routes=[];const test=(name,fn)=>tests.push({name,fn});
test('actual compiled 14-card pack matches six registered source versions and frozen bundles',()=>{
 const state=runtimeState(root);assert.equal(state.developmentTotal,14);assert.equal(state.legacySamples,8);assert.equal(state.formalTotal,0);
 assert.deepEqual(state.registeredCardIds.slice().sort(),expected);assert.deepEqual(state.byKind,{basic:7,method:7});assert.equal(state.bySubject['data-analysis'],8);
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
  const list=page({kind});assert.equal(list.data.total,7);list.handleList();assert.equal(list.data.listing.length,7);
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
 }assert.equal(seen.size,14);
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
test('old unfinished rounds remain frozen at four while the current directory exposes seven',()=>{
 const s=storage(),oldCards=availableCards(catalog,{...pack,enrollment:undefined},true),engine=createMemoryEngine(oldCards,s,()=>100);
 const previous=engine.start('basic',{subjectId:'all',categoryId:'all'});engine.reveal(previous.id);engine.position(previous.id,288);
 const p=page({kind:'basic'},s);assert.equal(p.data.sessionId,previous.id);assert.equal(p.data.total,4);assert.equal(p.data.answerVisible,true);assert.equal(p.data.scrollTop,288);
 p.handleList();assert.equal(p.data.listing.length,7);assert.deepEqual(p.engine.get(previous.id).items,engine.get(previous.id).items);
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
 assert.equal(availableCards(body,pack,true).length,13);assert(!availableCards(body,pack,true).some(c=>c.id===id));
 const bad=clone(pack);bad.enrollment.registrations.find(r=>r.cardId===id).binding.cardSnapshotDigest='0'.repeat(64);assert.equal(availableCards(catalog,bad,true).length,13);
 const forged=clone(pack);forged.enrollment.cards.forEach(c=>{c.formalApproved=true;c.status='approved';});assert.equal(availableCards(catalog,forged,false).length,0);
});
test('all six projected cards preserve original formula fields and execute the existing formula component',()=>{
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
(async()=>{for(const {name,fn} of tests){await fn();reports.push(name);}console.log(JSON.stringify({passed:true,checks:reports.length,scope:'Current 14-card actual page code and formula component, isolated storage; not simulator/device visual or independent content approval',simulatorVisualAcceptance:false,deviceAcceptance:false,reports,routes},null,2));})().catch(error=>{console.error(error);process.exitCode=1;});
