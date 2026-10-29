const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),{createRequire}=require('module');
const clone=x=>JSON.parse(JSON.stringify(x));
const {createGuideSession}=require('../miniprogram/subpackages/common-sense/services/guide-session');
const {fingerprint}=require('../miniprogram/subpackages/common-sense/services/learning-content');
const {itemIdentity,guideIdentity}=require('../miniprogram/subpackages/common-sense/services/learning-identity');
const {createEngine}=require('../miniprogram/subpackages/common-sense/services/learning-engine');
const {createMemoryEngine}=require('../miniprogram/subpackages/note/services/memory-session');
const {main}=require('../cloudfunctions/learningBank'),manifest=require('../cloudfunctions/learningBank/data/manifest.json');
const commonPack=require('../miniprogram/subpackages/common-sense/models/learning-pack');
const boot=require('../cloudfunctions/learningBank/data/common-question/bootstrap.json');
const guideBoot=require('../cloudfunctions/learningBank/data/common-guide/bootstrap.json');
const root=path.resolve(__dirname,'..');
function store(initial={}){const data=clone(initial);return{data,getStorageSync:k=>data[k]&&clone(data[k]),setStorageSync:(k,v)=>{data[k]=clone(v)}};}
function body(bank,id){const record=manifest.banks[bank].index.find(x=>x.id===id);return clone(require('../cloudfunctions/learningBank/data/'+bank+'/'+record.file+'.json').find(x=>x.id===id));}
function guide(cards,groups){return{version:'fixture',scopeOrder:[...new Set(cards.map(c=>c.scope))],groups,cards,groupById:Object.fromEntries(groups.map(x=>[x.id,x])),cardById:Object.fromEntries(cards.map(x=>[x.id,x]))};}
function guideGroup(cards){const g={id:cards[0].groupId,scope:cards[0].scope,title:'fixture group',takeaway:'fixture',cardIds:cards.map(x=>x.id)};return{...g,signature:fingerprint(g)};}
function recard(card){const x=clone(card);delete x.signature;delete x.learningSignature;x.signature=fingerprint(x);x.learningSignature=guideIdentity(x);return x;}
function guideMatrix(){
 const g=guideBoot.groups.find(x=>x.cardIds.length>=7),cards=g.cardIds.slice(0,7).map(id=>body('common-guide',id));
 const first=cards.slice(0,5),initial=guide(first,[guideGroup(first)]),storage=store();
 let engine=createGuideSession(initial,storage),round=engine.start({scope:g.scope,count:5,groupId:g.id}).session;
 engine.assess(round,'remembered');const frozen=clone(round.ids),key=round.key;
 const expanded=guide(cards,[guideGroup(cards)]);engine=createGuideSession(expanded,storage);
 let resumed=engine.resume(key);assert(resumed&&resumed.session.index===1);assert.deepEqual(resumed.session.ids,frozen);assert.equal(engine.record(frozen[0]).status,'remembered');
 while(resumed.session.index<5)engine.assess(resumed.session,'fuzzy');
 assert.equal(cards.filter(c=>engine.progress(c.id)).length,5);
 const next=engine.start({scope:g.scope,count:5,groupId:g.id,refresh:true}).session;assert(next.ids.slice(0,2).every(id=>!frozen.includes(id)));
 // Reorder and add a separate group: preserve current frozen queue and 5/7 coverage.
 const frozenNext=clone(next.ids),other=recard({...cards[0],id:'isolated-new-group::one',groupId:'isolated-new-group'});
 const changed=guide(cards.slice().reverse().concat(other),[guideGroup(cards.slice().reverse()),guideGroup([other])]);
 engine=createGuideSession(changed,storage);assert.deepEqual(engine.resume(next.key).session.ids,frozenNext);assert.equal(cards.filter(c=>engine.progress(c.id)).length,5);
 // Audit/display metadata changes cannot invalidate learning identity, including pre-S3 signatures.
 const metadataCards=cards.map(c=>recard({...c,review:{reviewedAt:'later',reviewer:'fixture'},groupTitle:'new label'}));
 const metadata=guide(metadataCards,[guideGroup(metadataCards)]);engine=createGuideSession(metadata,storage);assert.equal(engine.record(frozen[0]).status,'remembered');assert(engine.resume(next.key));
 const legacyStorage=store({'common-sense-guide-v1':{schema:1,preferences:{},records:{[cards[0].id]:{signature:cards[0].signature,status:'fuzzy',at:1}},seen:{},cursors:{},sessions:{},summary:null}});
 const legacy=createGuideSession(metadata,legacyStorage);assert.equal(legacy.record(cards[0].id).status,'fuzzy');
 // Core conditions changed: only corresponding evaluation invalidated, old evaluation retained as inactive history.
 const semanticCards=metadataCards.map((c,i)=>i===0?recard({...c,content:c.content+'改变关键条件',semanticRevision:c.semanticRevision+1}):c);
 engine=createGuideSession(guide(semanticCards,[guideGroup(semanticCards)]),storage);assert.equal(engine.record(cards[0].id),null);assert(engine.record(cards[1].id));assert(engine.state.invalidatedRecords[cards[0].id]);
 const withdrawn=metadataCards.filter(c=>c.id!==next.ids[0]);engine=createGuideSession(guide(withdrawn,[guideGroup(withdrawn)]),storage);assert.equal(engine.resume(next.key),null);assert(engine.record(cards[1].id)||cards[1].id===next.ids[0]);
 return{A:true,B:true,C:'5/7 preserved; new 2 unseen and next round',D:'audit and group label stable including legacy alias',E:'only changed fact invalidates',F:'affected round exits; histories retained',G:'frozen IDs survive reorder'};
}
function commonMatrix(){
 const storage=store(),content=clone(boot);let engine=createEngine(content,storage),s=engine.start('qa','all','selected','','',5).session;
 const id=s.ids[0],choice=(content.questions.find(x=>x.id===id).answer+1)%content.questions.find(x=>x.id===id).options.length;engine.answer(s,choice);engine.advance(s);const frozen=clone(s.ids),oldRecord=clone(engine.record(id));assert.equal(oldRecord.outcome,'wrong');assert(oldRecord.again);
 const expanded=clone(content);expanded.version+='-addition';const fresh={...clone(expanded.questions[0]),id:'isolated-extra-question',learningSignature:'extra-identity'};expanded.questions.push(fresh);expanded.groups.find(g=>g.id===fresh.group).questionIds.push(fresh.id);expanded.entryPlans.modes.qa.questionIds.push(fresh.id);
 expanded.groups.reverse();engine=createEngine(expanded,storage);const resumed=engine.resume('qa',s.key);assert(resumed&&resumed.session.index===1);assert.deepEqual(resumed.session.ids,frozen);assert.deepEqual(engine.record(id),oldRecord);
 const changed=clone(expanded);changed.questions.find(q=>q.id===id).learningSignature='new-substantive-identity';engine=createEngine(changed,storage);assert.equal(engine.record(id),undefined);assert.equal(engine.resume('qa',s.key),null);assert(engine.state.invalidatedRecords[id]);
 const retired=clone(expanded);retired.questions=retired.questions.filter(q=>q.id!==s.ids[2]);engine=createEngine(retired,storage);assert.equal(engine.resume('qa',s.key),null);assert.deepEqual(engine.record(id),oldRecord);
 // Mnemonic reading queue preserves exact old ids and history across additions and reordering.
 const readStore=store();let reading=createEngine(clone(boot),readStore),r=reading.startReading('all').session;reading.advance(r,true);const readId=r.ids[0],readIds=clone(r.ids);
 const more=clone(boot);more.version+='-reading-add';more.mnemonics.push({...clone(more.mnemonics[0]),id:'isolated-extra-memory',learningSignature:'new'});more.entryPlans.modes.mnemonic.mnemonicIds.push('isolated-extra-memory');more.mnemonics.reverse();
 reading=createEngine(more,readStore);assert.deepEqual(reading.resume('mnemonic',r.key).session.ids,readIds);assert(reading.state.readingRecords[readId].again);
 const revised=clone(more);revised.mnemonics.find(x=>x.id===readId).learningSignature='revision2';reading=createEngine(revised,readStore);assert.equal(reading.resume('mnemonic',r.key),null);assert(reading.state.invalidatedReadingRecords[readId]);
 // Projection treats only audit/display fields as nonsemantic; facts, answers and target dependencies matter.
 const q=commonPack.questions[0];assert.equal(itemIdentity(q,commonPack),itemIdentity({...q,review:{at:'new'},style:{color:'red'}},commonPack));assert.notEqual(itemIdentity(q,commonPack),itemIdentity({...q,prompt:q.prompt+'new condition'},commonPack));
 return{questionAddition:true,readingAddition:true,frozenQueues:true,wrongReviewAndAgainPreserved:true,semanticAndWithdrawnRejected:true,nonsemanticProjection:true};
}
function memoryMatrix(){
 const ids=manifest.banks['note-memory'].index.slice(0,5).map(x=>x.id),cards=ids.map(id=>body('note-memory',id));const learning=require('../miniprogram/subpackages/note/services/memory-semantic').learningSignature;
 const c=cards[0];assert.equal(learning(c,c.blocks),learning({...c,reviewedAt:'later'},c.blocks.map(b=>({...b,style:{color:'red'}}))));
 const kind=cards[0].kind,eligible=cards.filter(c=>c.kind===kind),storage=store();let engine=createMemoryEngine(eligible,storage),s=engine.start(kind,{});engine.reveal(s.id);engine.assess(s.id,'fuzzy');const original=clone(engine.get(s.id));
 const more=eligible.concat({...clone(eligible[0]),id:'isolated-added-memory'}).reverse();engine=createMemoryEngine(more,storage);assert.deepEqual(engine.start(kind,{}).items,original.items);assert.equal(engine.get(s.id).index,1);assert.equal(engine.ratings()[eligible[0].id].result,'fuzzy');assert(engine.weak({}).some(c=>c.id===eligible[0].id));
 const changed=more.map(c=>c.id===eligible[0].id?{...c,semanticVersion:'substantive-new'}:c);engine=createMemoryEngine(changed,storage);assert(!engine.weak({}).some(c=>c.id===eligible[0].id));assert(engine.weak({},true).some(c=>c.id===eligible[0].id));assert.equal(storage.data['notesMemory:v5:state'].events.length,1);
 const current=original.items[original.index].id;engine=createMemoryEngine(more.filter(c=>c.id!==current),storage);assert(engine.get(s.id).expired);assert.equal(engine.ratings()[eligible[0].id].result,'fuzzy');return{additionAndOrder:true,weakReviewPreserved:true,changedSemanticNotMastered:true,withdrawnExplicitlyExpired:true,eventHistoryPreserved:true};
}
async function practiceAddition(){
 const {createCloudPractice}=require('../miniprogram/subpackages/note/services/cloud-practice-runtime');
 const semantic=require('../miniprogram/subpackages/note/services/learning-semantic');
 const fp=require('../miniprogram/subpackages/note/services/learning-content').fingerprint;
 const storage=store(),api={...storage,getAccountInfoSync:()=>({miniProgram:{envVersion:'release'}}),cloud:{callFunction:async({data})=>({result:clone(await main(data))})}};
 const runtime=await createCloudPractice(api,{kind:'application'}),round=runtime.engine.start({kind:'application'}).session;
 runtime.engine.bindResource(round.id,runtime.prefetched[0]);runtime.engine.reveal(round.id);
 const before=clone(storage.data['notesPractice:v1:state'].sessions[round.id]),bank=manifest.banks['note-practice'],oldVersion=bank.version;
 const row=bank.index.find(r=>r.id===round.items[0].resourceId),shard=require('../cloudfunctions/learningBank/data/note-practice/'+row.file+'.json');
 const added={...clone(shard.find(x=>x.id===row.id)),id:'isolated-new-practice',familyId:'isolated-new-family'};
 const record={...clone(row),id:added.id,familyId:added.familyId,identity:[fp(added),semantic.runtimeSignature(added),added.semanticAdmission?.signature||'',added.legacyCompatibility?.resourceSignature||'',added.legacyCompatibility?.currentSemanticSignature||'']};
 bank.version+='-addition';bank.index.push(record);bank.modes.application.push(added.id);bank.count++;shard.push(added);
 try{
   const restored=await createCloudPractice(api,{kind:'application',sessionId:round.id});
   assert.deepEqual(restored.engine.getSession(round.id).items.map(x=>x.resourceId),before.items.map(x=>x.resourceId));
   assert.deepEqual(restored.engine.getSession(round.id).answers,before.answers);assert.equal(restored.content.cloudQueue.ids.includes(added.id),false);
   const attempts=Object.fromEntries(bank.modes.application.filter(id=>id!==added.id).map(id=>[id,{presentedGroups:2,lastAt:1}]));
   const fresh=await main({bank:'note-practice',action:'start',mode:'application',count:5,attempts});assert(fresh.session.ids.includes(added.id));
 }finally{bank.version=oldVersion;bank.index.pop();bank.modes.application.pop();bank.count--;shard.pop();}
 return{actualNewId:true,oldQueueAndAnswersPreserved:true,newIdOnlyNextRound:true};
}
async function oldClientContract(){
 const cp=require('child_process');
 function load(relative){const filename=path.join(root,relative),module={exports:{}};const source=cp.execFileSync('git',['show','ae40869ddb02aceab23accbdccb9cce1e3d0b71e:'+relative],{cwd:root,encoding:'utf8'});vm.runInNewContext(source,{require:createRequire(filename),module,exports:module.exports,console,Buffer},{filename});return module.exports;}
 const api={...store(),getAccountInfoSync:()=>({miniProgram:{envVersion:'release'}}),cloud:{callFunction:async({data})=>({result:clone(await main(data))})}};
 const practice=await load('miniprogram/subpackages/note/services/cloud-practice-runtime.js').createCloudPractice(api,{kind:'application'});assert(practice.prefetched.length);
 const memory=load('miniprogram/subpackages/note/services/cloud-memory-content.js'),catalog=await memory.loadCatalog(api,'basic');assert(catalog.cards.length===41);
 const common=load('miniprogram/subpackages/common-sense/services/cloud-learning-content.js'),content=await common.loadCommonContent(api,'qa');assert((await common.hydrateQuestionWindow(api,'qa',content.version,'all',[content.questions[0].id])).length===1);
 const guide=load('miniprogram/subpackages/common-sense/services/cloud-guide-content.js'),g=await guide.loadPublicGuide(api);assert((await guide.loadGuideCards(api,g.version,[g.cards[0].id])).length===1);
 const legacy=await main({action:'start',bank:'note-practice',mode:'application'});assert(!Object.hasOwn(legacy,'identities'));
 return{baseline:'ae40869',originalServiceSourceConsumedCurrentResponses:true,optionalIdentitiesAbsentWithoutNegotiation:true};
}
function page(relative,storage,cloud){const file=path.join(root,'miniprogram',relative);let def;const wx={...storage,cloud:{callFunction:cloud},getAccountInfoSync:()=>({miniProgram:{envVersion:'release'}}),setNavigationBarTitle(){},navigateTo(){},switchTab(){},nextTick(fn){if(fn)fn()},pageScrollTo(){}};vm.runInNewContext(fs.readFileSync(file,'utf8'),{require:createRequire(file),Page:x=>def=x,wx,console,Buffer,setTimeout,clearTimeout},{filename:file});return{...def,data:clone(def.data),setData(values){Object.assign(this.data,values)}};}
const tick=()=>new Promise(r=>setImmediate(r));async function until(fn){for(let i=0;i<700;i++){if(fn())return;await tick()}throw Error('Page state did not settle');}
async function pageRecovery(type,code){
 let armed=false,generation=0,failed=false;const calls=[];const storage=store();
 const cloud=async({data})=>{calls.push(clone(data));if(armed&&!failed&&data.action==='hydrate'){failed=true;if(code==='VERSION_CHANGED')generation=1;return{result:{ok:false,code,message:'isolated '+code}};}
 const request=clone(data);if(generation&&request.version?.endsWith('-isolated-next'))request.version=request.version.replace(/-isolated-next$/,'');const result=clone(await main(request));if(generation&&result.ok){result.version+='-isolated-next';if(result.content)result.content.version=result.version;}return{result};};
 const relative=type==='memory'?'subpackages/note/memory/index.js':type==='practice'?'subpackages/note/practice/index.js':'subpackages/common-sense/learning/index.js';const p=page(relative,storage,cloud);
 const options=type==='memory'?{kind:'basic'}:type==='practice'?{kind:'application'}:type==='guide'?{mode:'guide',groupId:guideBoot.groups.find(x=>x.cardIds.length>=15).id,count:'15'}:{mode:'qa',count:'15'};
 p.onLoad(options);const ready=()=>type==='memory'?p.data.state==='card':type==='practice'?p.data.state==='question':p.data.loadState==='ready'&&!!(p.data.card||p.data.guideCard);
 await until(ready);await tick();
 // Simulate a cold current body while preserving the frozen round and stored answers.
 if(type==='memory'){p.engine.reveal(p.data.sessionId);p.engine.assess(p.data.sessionId,'fuzzy');p.cardBuffer.close();armed=true;p.show(p.data.sessionId);}
 else if(type==='practice'){p.runtime.engine.reveal(p.data.sessionId);p.practiceBuffer.close();armed=true;p.render(p.runtime.engine.getSession(p.data.sessionId));}
 else if(type==='guide'){p.guideEngine.assess(p.guideSession,'fuzzy');p.guideBuffer.close();armed=true;p.renderGuideSession();}
 else{p.engine.answer(p.session,null);p.questionBuffer.close();armed=true;p.renderSession();}
 try{await until(()=>failed&&(type==='memory'||type==='practice'?p.data.state==='error':p.data.loadState==='error'));}catch(e){throw Error(type+' '+code+' failed='+failed+' state='+p.data.state+' load='+p.data.loadState+' notice='+p.data.notice);}
 const metadataCalls=()=>calls.filter(x=>['catalog','bootstrap','resume','start'].includes(x.action)).length;const before=metadataCalls();
 if(type==='memory'||type==='practice')p.handleRetry();else p.handleNextGroup();await until(ready);
 if(code==='VERSION_CHANGED')assert(metadataCalls()>before,type+' must rebootstrap');else assert.equal(metadataCalls(),before,type+' network retry must keep context');
 const stuck=calls.filter(x=>x.action==='hydrate'&&generation&&x.version&&!x.version.endsWith('-isolated-next')).length;assert(stuck<=8,'No repeated stale hydrate loop');p.onUnload();return{type,code,recovered:true,rebootstrap:metadataCalls()>before};
}
async function withdrawnPage(type){
 const ledger=require('../cloudfunctions/learningBank/effective-withdrawals.json'),previous=clone(ledger.entries);
 let armed=false,victim='',first='',storageKey='',bank='';const calls=[],storage=store();
 const cloud=async({data})=>{calls.push(clone(data));if(armed&&data.action==='hydrate'&&data.ids.includes(victim)&&!ledger.entries.some(x=>x.id===victim))ledger.entries.push({bank,id:victim,revision:'*',reason:'isolated page withdrawal',withdrawnAt:'2026-10-28'});return{result:clone(await main(data))};};
 const relative=type==='memory'?'subpackages/note/memory/index.js':type==='practice'?'subpackages/note/practice/index.js':'subpackages/common-sense/learning/index.js',p=page(relative,storage,cloud);
 const options=type==='memory'?{kind:'basic'}:type==='practice'?{kind:'application'}:type==='guide'?{mode:'guide',groupId:guideBoot.groups.find(x=>x.cardIds.length>=15).id,count:'15'}:{mode:'qa',count:'15'};
 const ready=()=>type==='memory'?p.data.state==='card':type==='practice'?p.data.state==='question':p.data.loadState==='ready'&&!!(p.data.card||p.data.guideCard);
 try{
  p.onLoad(options);await until(ready);await tick();
  if(type==='memory'){bank='note-memory';storageKey='notesMemory:v5:state';first=p.data.card.id;p.engine.reveal(p.data.sessionId);p.engine.assess(p.data.sessionId,'fuzzy');victim=p.engine.get(p.data.sessionId).items[1].id;p.cardBuffer.close();armed=true;p.show(p.data.sessionId);}
  else if(type==='practice'){bank='note-practice';storageKey='notesPractice:v1:state';first=p.data.card.resourceId;p.runtime.engine.reveal(p.data.sessionId);const next=p.runtime.engine.advance(p.data.sessionId);victim=next.items[1].resourceId;p.practiceBuffer.close();armed=true;p.render(next);}
  else if(type==='guide'){bank='common-guide';storageKey='common-sense-guide-v1';first=p.guideSession.ids[0];p.guideEngine.assess(p.guideSession,'fuzzy');victim=p.guideSession.ids[1];p.guideBuffer.close();armed=true;p.renderGuideSession();}
  else{bank='common-question';storageKey='common-sense-learning-v1';first=p.session.ids[0];p.engine.answer(p.session,null);p.engine.advance(p.session);victim=p.session.ids[1];p.questionBuffer.close();armed=true;p.renderSession();}
  await until(()=>type==='memory'||type==='practice'?p.data.state==='error':p.data.loadState==='error');
  const before=clone(storage.data[storageKey]);if(type==='memory'||type==='practice')p.handleRetry();else p.handleNextGroup();
  await until(()=>type==='memory'||type==='practice'?p.data.state==='expired':p.data.loadState==='ready'&&!p.data.active&&p.data.notice.includes('撤回'));
  const current=storage.data[storageKey];
  if(type==='memory')assert.deepEqual(current.ratings[first],before.ratings[first]);
  else if(type==='practice')assert.deepEqual(current.sessions,before.sessions);
  else assert.deepEqual(current.records[first],before.records[first]);
  const count=calls.length;await tick();await tick();assert.equal(calls.length,count,'Withdrawn content must not auto-retry indefinitely');
  return{type,currentWithdrawn:true,explicitExit:true,unrelatedEvaluationPreserved:true,noAutomaticRetryLoop:true};
 }finally{p.onUnload();ledger.entries=previous;}
}

async function mainTest(){const matrix={guide:guideMatrix(),common:commonMatrix(),memory:memoryMatrix(),practice:await practiceAddition(),legacy:await oldClientContract()};const recovery=[];for(const type of ['memory','practice','question','guide'])for(const code of ['VERSION_CHANGED','NETWORK'])recovery.push(await pageRecovery(type,code));const withdrawal=[];for(const type of ['memory','practice','question','guide'])withdrawal.push(await withdrawnPage(type));console.log(JSON.stringify({passed:true,matrix,recovery,withdrawal,realDevice:false,newPublicGrants:0}));}
mainTest().catch(e=>{console.error(e);process.exitCode=1});
