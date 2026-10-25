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
const {availableCards,resolveCard}=require('../miniprogram/subpackages/note/services/memory-content');
const {createMemoryEngine}=require('../miniprogram/subpackages/note/services/memory-session');
const {loadInputs,register}=require('./lib/notes-memory-admission');
const {digest}=require('../miniprogram/subpackages/note/services/learning-semantic');
const body=require('../miniprogram/subpackages/note/models/note-catalog'),pack=require('../miniprogram/subpackages/note/models/memory-pack');
const badId='memory-v5-da04-growth-above-ten',canonicalId='memory-v5-da02-growth-amount',inputs=loadInputs(root),cards=availableCards(body,pack,true),feedback=require('../docs/knowledge-platform/implementations/evidence/notes-memory-v5-da04-user-feedback-20261023.json'),correction=require('../docs/knowledge-platform/implementations/evidence/notes-memory-v5-da04-main-goal-correction-20261023.json');
const tests=[],reports=[],routes=[];const test=(name,fn)=>tests.push({name,fn});
const rejected=feedback.decisions.find(d=>d.cardId===badId),oldFrozen=JSON.parse(fs.readFileSync(path.join(root,rejected.frozenBundlePath)));
function oldPack(){return {...pack,enrollment:{...pack.enrollment,cards:pack.enrollment.cards.map(c=>c.id===badId?clone(oldFrozen.bundle.card):clone(c))}};}
test('actual package has thirty-five cards, one canonical growth-amount card and only the explicit merged exclusion',()=>{
 const s=runtimeState(root);assert.equal(s.developmentTotal,35);assert.equal(s.legacySamples,8);assert.equal(s.registeredPending,27);assert.deepEqual(s.byKind,{basic:15,method:20});assert.equal(s.bySubject['data-analysis'],29);assert.equal(s.formalTotal,0);assert.deepEqual(s.excludedCandidates.map(c=>c.cardId),[badId]);assert.equal(cards.filter(c=>c.id===canonicalId).length,1);assert(!cards.some(c=>c.id===badId));
});
test('the corrected main goal is formula recall, merged to the unchanged basic card rather than a ten-percent method',()=>{
 const c=inputs.cards.find(c=>c.id===badId),canonical=cards.find(c=>c.id===canonicalId);assert.equal(c.revision,3);assert.equal(c.kind,'basic');assert.equal(c.prompt,'增长量怎么算？');assert.equal(c.localHold.code,'DA04-MAIN-GOAL-MERGED');assert.equal(c.localHold.canonicalCardId,canonicalId);assert.equal(canonical.kind,'basic');assert.equal(canonical.prompt,'增长量有哪些精确公式？');assert.equal(canonical.revision,2);assert(!canonical.prompt.includes('10%'));assert(canonical.blocks.some(b=>b.content==='增长量 = 现期量 - 基期量'));assert(canonical.blocks.some(b=>b.content==='增长量 = 现期量 × 增长率 / (1 + 增长率)'));
});
test('the original ten-percent supplement and formula source remain intact without being independently quizzed',()=>{
 const ref=oldFrozen.bundle.card.refs[0],tab=inputs.context.body[ref.subjectId].points.find(p=>p.id===ref.pointId).tabs.find(t=>t.id===ref.tabId);assert(tab.blocks[1].content.startsWith('增长量 X = B - A'));assert.equal(tab.blocks[5].title,'增长率超过 10% 的判断');assert.equal(digest(oldFrozen.bundle.originals[0].originalBlocks),digest(ref.blocks.map(b=>tab.blocks[b.blockIndex])));assert(!cards.some(c=>/是否超过10%|判断增长率超过10%/.test(c.title+c.prompt)));
});
test('mixed user feedback binds five passes and exactly one revision request to immutable original snapshots',()=>{
 assert.equal(feedback.decisions.length,6);assert.equal(feedback.decisions.filter(d=>d.result==='user-tested-passed').length,5);assert.equal(rejected.result,'revise');assert.equal(rejected.binding.revision,2);for(const d of feedback.decisions){const f=JSON.parse(fs.readFileSync(path.join(root,d.frozenBundlePath)));assert.deepEqual(f.binding,d.binding);assert.equal(digest(f.bundle),d.binding.reviewBundleDigest);if(d.result==='user-tested-passed')assert.deepEqual(cards.find(c=>c.id===d.cardId).memoryAdmission.binding,d.binding);}
 assert.equal(feedback.formalDecisionReceiptCreated,false);assert.equal(feedback.formalEnablementCreated,false);
});
test('all current thirty-five directory IDs open their exact original tabs and return without grading',()=>{
 const seen=new Set();for(const kind of ['basic','method']){const p=page({kind});p.handleList();assert.equal(p.data.listing.length,kind==='basic'?15:20);for(const c of p.data.listing){p.handlePick(event({id:c.id}));const url=p.calls.at(-1).url,options=Object.fromEntries(new URLSearchParams(url.split('?')[1])),q=page(options);assert.equal(q.data.card.id,c.id);q.handleReveal();q.handleScroll({detail:{scrollTop:215}});q.handleSource(event({index:0}));q.onHide();const source=q.calls.at(-1).url,params=Object.fromEntries(new URLSearchParams(source.split('?')[1]));assert.equal(params.pointId,c.refs[0].pointId);assert.equal(params.moduleId,c.refs[0].subjectId);q.onShow();assert.equal(q.data.card.id,c.id);assert.equal(q.data.scrollTop,215);assert.equal(q.data.answerVisible,true);assert.deepEqual(q.engine.ratings(),{});seen.add(c.id);routes.push({cardId:c.id,kind,cardURL:url,sourceURL:source});}}assert.equal(seen.size,35);
});
test('canonical basic deep link works while rejected method/basic deep links cannot open a substitute card',()=>{
 const c=cards.find(c=>c.id===canonicalId),q=page({kind:'basic',subjectId:c.subjectId,categoryId:c.categoryId,cardId:canonicalId});assert.equal(q.data.card.id,canonicalId);for(const kind of ['basic','method']){const p=page({kind,subjectId:'data-analysis',categoryId:'compare',cardId:badId});assert.notEqual(p.data.card?.id,badId);assert(['empty','error'].includes(p.data.state));assert.equal(p.data.card,null);}
});
test('all scope counts reflect the deduplication and the screenshot growth filter remains eight and one',()=>{
 for(const [kind,all,da,growth] of [['basic',15,13,8],['method',20,16,1]])for(const [scope,total] of [[{subjectId:'all',categoryId:'all'},all],[{subjectId:'data-analysis',categoryId:'all'},da],[{subjectId:'data-analysis',categoryId:'growth'},growth]]){const p=page({kind,...scope});assert.equal(p.data.listing.length,total);assert.equal(p.data.total,total);}
});
test('old rejected ratings and events remain unchanged and are never migrated onto the canonical card',()=>{
 const previous=resolveCard(oldFrozen.bundle.card,body),st=storage(),old=createMemoryEngine([previous],st,()=>100),v=old.start('method',{});old.reveal(v.id);old.assess(v.id,'fuzzy');const saved=clone(st.data);const engine=createMemoryEngine(cards,st);assert.equal(engine.ratings()[badId].result,'fuzzy');assert.equal(engine.ratings()[canonicalId],undefined);assert(!engine.weak({},false).some(c=>c.id===badId));assert.deepEqual(st.data,saved);
});
test('a frozen old thirty-six-card round keeps its identity and an old rejected current item becomes expired explicitly',()=>{
 const previous=availableCards(body,oldPack(),true);assert.equal(previous.length,36);const st=storage(),old=createMemoryEngine(previous,st,()=>200),v=old.start('method',{subjectId:'all',categoryId:'all'},{fresh:true,cardId:badId});assert.equal(v.items.length,21);old.reveal(v.id);old.position(v.id,251);const saved=clone(st.data);const p=page({kind:'method',sessionId:v.id},st);assert.equal(p.data.state,'expired');assert.equal(p.data.card,null);assert.equal(p.data.sessionId,v.id);assert.equal(p.data.total,21);p.handleList();assert.equal(p.data.listing.length,20);assert.equal(st.data[KEY].sessions[v.id].items.length,21);assert.deepEqual(st.data[KEY].ratings,saved[KEY].ratings);
});
test('the five accepted DA04 cards retain their exact versions and remain usable for self-assessment and weak review',()=>{
 const st=storage();for(const d of feedback.decisions.filter(d=>d.result==='user-tested-passed')){const p=page({kind:'method',cardId:d.cardId},st);assert.equal(p.data.card.revision,d.binding.revision);p.handleReveal();for(const src of p.requiredImages)p.handleKnowledgeImageLoad(event({imageToken:p.data.imageGeneration,src}));p.handleAssess(event({result:'fuzzy'}));assert.equal(p.engine.ratings()[d.cardId].result,'fuzzy');}const exam=page({kind:'exam',subjectId:'data-analysis'},st);assert.equal(exam.data.total,5);assert(!exam.engine.get(exam.data.sessionId).items.some(c=>c.id===badId));assert.deepEqual(st.data['notesPractice:v1:state'],{keep:'application-history'});
});
test('the merged target and the two original content holds cannot bypass registration or sample admission',()=>{
 const held=inputs.cards.filter(c=>c.localHold);assert.equal(held.length,3);assert.equal(held.filter(c=>c.localHold.code==='DA04-MAIN-GOAL-MERGED').length,1);for(const c of held){assert.throws(()=>register(inputs,{cardId:c.id,registrationTaskId:'negative-test',registeredAt:new Date().toISOString()}),/hold/);assert(!availableCards(body,{schemaVersion:1,sampleOnly:true,cards:[{...c,localHold:null,status:'preview-pending',sampleOnly:true}]},true).some(r=>r.id===c.id));}
});
test('source-target ledger validation preserves source ownership and explicit canonical merge without new schema',()=>{
 const l=require('../docs/knowledge-platform/content/notes/memory-v5-da04-targets-v2.json'),{validateLedger}=require('./lib/notes-memory-expansion-v2');assert.deepEqual(validateLedger(inputs.context,l),{sources:6,targets:6,localTargetHolds:1});const d=l.sourceDispositions.find(d=>d.targetIds.includes(inputs.cards.find(c=>c.id===correction.revisedCardId).targetId));assert.equal(d.state,'merged');assert.deepEqual(d.mergedIntoCardIds,[canonicalId]);assert.equal(correction.storageMigration,false);assert.equal(correction.canonicalDefinitionChanged,false);assert.equal(correction.sourceJsonChanged,false);
});
test('read and write failures preserve existing application and memory records during canonical review',()=>{
 const st=storage(),p=page({kind:'basic',cardId:canonicalId},st);p.handleReveal();const saved=clone(st.data),id=p.data.card.id;st.failWrite=true;p.handleAssess(event({result:'remembered'}));assert.equal(p.data.card.id,id);assert.deepEqual(st.data,saved);st.failWrite=false;p.handleAssess(event({result:'fuzzy'}));assert.equal(p.engine.ratings()[id].result,'fuzzy');assert.deepEqual(st.data['notesPractice:v1:state'],{keep:'application-history'});
 const read=storage();read.failRead=true;const q=page({kind:'basic'},read);assert.equal(q.data.state,'error');read.failRead=false;q.handleRetry();assert.equal(q.data.state,'card');
});
test('main-knowledge rule is documented, original sample versions remain compatible and formal content stays disabled',()=>{
 const text=fs.readFileSync(path.join(root,'docs/knowledge-platform/implementations/notes-memory-v5-product.md'),'utf8');assert(text.includes('NOTE-V5-017'));assert(text.includes('附加阈值'));const frozen=require('../docs/knowledge-platform/content/notes/memory-v5-version-compatibility.json');for(const row of frozen.cards)assert.equal(cards.find(c=>c.id===row.card.id).semanticVersion,row.legacySemanticVersion);assert.equal(availableCards(body,pack,false).length,0);assert.equal(inputs.reviewLedger.reviews.length,0);assert.equal(inputs.enablementLedger.enablements.length,0);
});
(async()=>{for(const {name,fn} of tests){await fn();reports.push(name);}console.log(JSON.stringify({passed:true,checks:reports.length,scope:'Current thirty-five-card page code with isolated storage; user-requested goal correction, duplicate merge and historical-record preservation; not independent formal acceptance or device approval',reports,routes,simulatorVisualAcceptance:false,deviceAcceptance:false},null,2));})().catch(e=>{console.error(e);process.exitCode=1;});
