const assert=require('assert/strict'),fs=require('fs'),path=require('path'),os=require('os'),crypto=require('crypto'),vm=require('vm'),{createRequire}=require('module');
const {collect,writeCandidate,batch}=require('./build-learning-bank-s4-candidate');
const {compile}=require('./build-learning-bank-function'),{publish}=require('./lib/learning-bank-output');
const admission=require('./lib/learning-bank-admission'),policy=require('../docs/knowledge-platform/content/learning-bank-public-admission.json');
const {validateArtifact}=require('./validate-learning-bank-release');
const {createEngine}=require('../miniprogram/subpackages/common-sense/services/learning-engine');
const {createCommonCardAdapter,loadCommonContent}=require('../miniprogram/subpackages/common-sense/services/cloud-learning-content');
const {auditPack}=require('./lib/common-sense-content-quality-gate');
const clone=x=>JSON.parse(JSON.stringify(x)),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const root=path.resolve(__dirname,'..'),newIds=batch.rows.map(x=>x.id),GROUP=batch.groupId;
const bootstrap=r=>JSON.parse(r.outputs.get('cloudfunctions/learningBank/data/common-question/bootstrap.json'));
function item(r,id){const record=r.manifest.banks['common-question'].index.find(x=>x.id===id);return record&&JSON.parse(r.outputs.get('cloudfunctions/learningBank/data/common-question/'+record.file+'.json')).find(x=>x.id===id)}
function store(saved={}){const data=clone(saved);return{data,getStorageSync:key=>data[key]&&clone(data[key]),setStorageSync:(key,value)=>{data[key]=clone(value)}}}
function service(directory,{local=true,ledger}={}){
 const folder=path.join(directory,'cloudfunctions/learningBank'),filename=path.join(folder,'index.js'),native=createRequire(filename),module={exports:{}};
 const requireLocal=id=>id==='./data/manifest.json'?JSON.parse(fs.readFileSync(path.join(folder,'data/manifest.json'))):id==='./effective-withdrawals.json'?clone(ledger||JSON.parse(fs.readFileSync(path.join(folder,'effective-withdrawals.json')))):native(id);
 vm.runInNewContext(fs.readFileSync(filename,'utf8'),{require:requireLocal,module,exports:module.exports,__dirname:folder,
  process:{env:local?{NODE_ENV:'test',LEARNING_BANK_ISOLATED_TEST_ROOT:folder}:{}},Buffer,console},{filename});
 return module.exports.main;
}
function page(storage,main){
 const filename=path.join(root,'miniprogram/subpackages/common-sense/learning/index.js'),calls=[];let definition;
 const wx={...storage,cloud:{callFunction:async({data})=>{calls.push(clone(data));return{result:clone(await main(data))}}},
  getAccountInfoSync:()=>({miniProgram:{envVersion:'release'}}),setNavigationBarTitle(){},nextTick(fn){if(fn)fn()},navigateTo(){}};
 vm.runInNewContext(fs.readFileSync(filename,'utf8'),{require:createRequire(filename),Page:val=>definition=val,wx,console,Buffer,setTimeout,clearTimeout},{filename});
 return{...definition,data:clone(definition.data),calls,setData(values){Object.assign(this.data,values)}};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));async function until(fn){for(let i=0;i<600;i++){if(fn())return;await tick()}throw Error('S4 page did not settle')}
function semanticRevision(pack){
 const q=pack.questions.find(x=>x.id===newIds[0]);q.revision=2;
 q.prompt='原来连续的金属杆现在从中部断开，两段互不接触，间隙近似真空。只判断能量跨越这段真空间隙的路径，哪种机制符合条件？';
 q.objective='在连续固体路径改为无物质介质间隙后重新判断传热机制';q.answer=2;
 q.explanation='受控修订把指定路径改成两段之间的真空间隙，不再是连续固体内部。跨越这段间隙的能量传递可通过热辐射，不能沿断开的金属接触传导，也没有流体形成对流。';
 q.boundary='仅为语义修订失效试验，不属于拟准入的新题版本，不比较传热强弱。';q.fixtureOnly=true;
 const relation=pack.targetRelations.questionTargets.find(x=>x.questionId===q.id);relation.primaryTargetIds=['q0b-target-heat-radiation'];relation.supportingTargetIds=['q0b-target-heat-conduction','q0b-target-heat-convection'];
 const spec=pack.questionSpecifications.find(x=>x.questionId===q.id);Object.assign(spec,clone(relation),{distractorReasons:{0:'间隙没有流体整体运动。',1:'指定跨越间隙的路径已不存在连续固体接触。'}});
}
async function test(){
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'learning-s4-')),publicBefore=compile({collect:true}),formalPolicy=fs.readFileSync(path.join(root,'docs/knowledge-platform/content/learning-bank-public-admission.json'));
 try{
  const old=collect({baseline:true}),expanded=collect();
  assert.equal(old.manifest.banks['common-question'].count,603);assert.equal(expanded.manifest.banks['common-question'].count,605);
  assert.deepEqual(expanded.outputs,collect().outputs);assert.equal(expanded.outputs.size,547);
  const group=expanded.pack.groups.find(x=>x.id===GROUP);assert.equal(group.questionIds.length,5);
  const originalGroup=old.pack.groups.find(x=>x.id===GROUP);assert.deepEqual(group.questionIds.slice(0,3),originalGroup.questionIds);
  for(const id of originalGroup.questionIds)assert.deepEqual(expanded.pack.questions.find(x=>x.id===id),old.pack.questions.find(x=>x.id===id));
  const slice={...expanded.pack,questions:expanded.pack.questions.filter(x=>newIds.includes(x.id))},quality=auditPack(slice);assert.equal(quality.status,'green');
  const exact=Object.fromEntries(newIds.map(id=>[id,sha(JSON.stringify(item(expanded,id)))]));
  assert.deepEqual(exact,{'s4-heat-continuous-rod-vacuum':'8a33460f346cc21a14fed1f94191301cacfa63b9c8dcc8645c958414213867fa','s4-heat-radiation-forced-air':'f0405e590e30a7ba8a9d8dce27c992830a8364f02b70b725386c93772536c844'});
  const testPolicy=clone(policy);testPolicy.environment='isolated-test';testPolicy.grants.push({batchId:'S4-HEAT-01-TEST-ONLY',decision:'public-authorized',authorizedBy:'ISOLATED-HARNESS-NOT-PRODUCT-OWNER',authorizedAt:'2026-10-29',independentReviewReceipt:'S4 independent AI exact-item receipt',humanSamplingReceipt:'FIXTURE-ONLY-NOT-A-HUMAN-APPROVAL',bindings:newIds.map(id=>({bank:'common-question',id,digest:admission.binding('common-question',item(expanded,id),expanded.pack)}))});
  for(const id of newIds){const q=item(expanded,id),token=admission.binding('common-question',q,expanded.pack);assert(!admission.permit('common-question',q,token,policy,{entries:[]}));assert(admission.permit('common-question',q,token,testPolicy,{entries:[]}));}
  assert(compile({collect:true,commonPack:expanded.pack,policy:testPolicy,candidate:false}).manifest.admission.candidate);
  assert.throws(()=>compile({commonPack:expanded.pack,policy:testPolicy}),/isolated destination/);
  const blocked=collect({mutate:pack=>{pack.questions.find(x=>x.id===newIds[1]).status='blocked'}});
  const held=collect({mutate:pack=>{pack.questions.find(x=>x.id===newIds[1]).localHold={reason:'fixture-only local HOLD'}}});
  assert(!item(blocked,newIds[1]));assert(!item(held,newIds[1]));
  const ledger={schema:1,revision:1,entries:[{bank:'common-question',id:newIds[1],revision:'*',reason:'isolated withdrawal test, not a real public withdrawal',withdrawnAt:'2026-10-29'}]};
  const withdrawn=collect({withdrawals:ledger});assert(!item(withdrawn,newIds[1]));
  const semantic=collect({mutate:semanticRevision});assert(!admission.permit('common-question',item(semantic,newIds[0]),admission.binding('common-question',item(semantic,newIds[0]),semantic.pack),testPolicy,{entries:[]}));
  const metadata=collect({mutate:pack=>{const q=pack.questions.find(x=>x.id==='heat-conduction');q.review={reviewedAt:'fixture-metadata-only'};q.style={fontSize:19}}});
  const paths={};for(const[name,value]of Object.entries({old,expanded,metadata,semantic,withdrawn})){const directory=path.join(temp,name);writeCandidate(directory,value);paths[name]=directory;}
  const blockedRuntime=service(paths.expanded,{local:false});assert.equal((await blockedRuntime({bank:'common-question',action:'bootstrap',mode:'qa',allowCandidate:true})).code,'CANDIDATE_ONLY');
  assert.throws(()=>validateArtifact(path.join(paths.expanded,'cloudfunctions/learningBank'),testPolicy,ledger),/candidate artifact/);
  assert.throws(()=>validateArtifact(path.join(root,'cloudfunctions/learningBank'),testPolicy,require('../cloudfunctions/learningBank/effective-withdrawals.json')),/admission policy/);
  const storage=store();let engine=createEngine(bootstrap(old),storage),round=engine.start('qa','science-technology','selected','',GROUP).session;
  engine.answer(round,(bootstrap(old).questions.find(x=>x.id===round.ids[0]).answer+1)%3);engine.advance(round);
  const frozen=clone(round.ids),key=round.key,first=frozen[0],prior=clone(engine.record(first));assert.equal(prior.outcome,'wrong');assert(prior.again);
  // Use the unchanged production page and adapter against the locally marked candidate function.
  let p=page(storage,service(paths.expanded));p.onLoad({mode:'qa',scope:'science-technology',groupId:GROUP,resume:'1',sessionKey:encodeURIComponent(key)});
  await until(()=>p.data.loadState==='ready'&&p.data.card);assert.deepEqual(clone(p.session.ids),frozen);assert.equal(p.session.index,1);assert.deepEqual(p.engine.record(first),prior);
  while(!p.data.completed){p.handleReveal();p.handleNext({currentTarget:{dataset:{}}});await until(()=>p.data.completed||p.data.loadState==='ready'&&p.data.card)}
  const next=p.engine.start('qa','science-technology','selected','',GROUP,5,'',true);p.acceptSession(next);await until(()=>p.data.loadState==='ready'&&p.data.card);
  const seen=[];while(!p.data.completed){seen.push(p.data.card.id);p.handleReveal();p.handleNext({currentTarget:{dataset:{}}});await until(()=>p.data.completed||p.data.loadState==='ready'&&p.data.card)}
  assert(newIds.every(id=>seen.includes(id)));assert(p.calls.some(x=>x.action==='hydrate'&&x.ids.some(id=>newIds.includes(id))));assert(p.questionBuffer.stats().cards<=10);assert(p.questionBuffer.stats().bytes<=48*1024);p.onUnload();
  // Freeze a new five-question round and record an answer on the genuinely new item.
  const learned=store();engine=createEngine(bootstrap(expanded),learned);round=engine.start('qa','science-technology','selected','',GROUP).session;
  while(round.ids[round.index]!==newIds[0]){engine.answer(round,null);engine.advance(round)}engine.answer(round,1);engine.advance(round);
  const afterLearning=clone(learned.data),unrelated=clone(engine.record(first));
  const metaEngine=createEngine(bootstrap(metadata),store(afterLearning));assert(metaEngine.resume('qa',round.key));assert.deepEqual(metaEngine.record(newIds[0]),engine.record(newIds[0]));assert.deepEqual(metaEngine.record(first),unrelated);
  const semEngine=createEngine(bootstrap(semantic),store(afterLearning));assert.equal(semEngine.resume('qa',round.key),null);assert.equal(semEngine.record(newIds[0]),undefined);assert(semEngine.state.invalidatedRecords[newIds[0]]);assert.deepEqual(semEngine.record(first),unrelated);
  const withdrawnEngine=createEngine(bootstrap(withdrawn),store(afterLearning));assert.equal(withdrawnEngine.resume('qa',round.key),null);assert.deepEqual(withdrawnEngine.record(newIds[0]),engine.record(newIds[0]));assert.deepEqual(withdrawnEngine.record(first),unrelated);
  const oldSafe=createEngine(bootstrap(withdrawn),storage);assert(oldSafe.record(first));
  const restoredOld=service(paths.expanded,{ledger});const revoked=await restoredOld({action:'hydrate',bank:'common-question',mode:'qa',version:expanded.manifest.banks['common-question'].version,ids:[newIds[1]]});assert.equal(revoked.code,'BAD_ITEMS');
  const available=await restoredOld({action:'hydrate',bank:'common-question',mode:'qa',version:expanded.manifest.banks['common-question'].version,ids:[newIds[0]]});assert(available.ok);
  const atomic=path.join(temp,'atomic');fs.mkdirSync(atomic);publish(atomic,old.outputs);const digest=()=>sha([...old.outputs.keys()].sort().map(f=>f+'\0'+sha(fs.readFileSync(path.join(atomic,f)))+'\n').join(''));const before=digest();
  for(const failAt of ['generated','replace']){assert.throws(()=>publish(atomic,expanded.outputs,{failAt}),/Injected/);assert.equal(digest(),before);publish(atomic,old.outputs,{check:true});}publish(atomic,expanded.outputs);publish(atomic,expanded.outputs,{check:true});
  assert.deepEqual(compile({collect:true}).outputs,publicBefore.outputs);assert.equal(fs.readFileSync(path.join(root,'docs/knowledge-platform/content/learning-bank-public-admission.json'),'utf8'),formalPolicy.toString());
  const formal=await require('../cloudfunctions/learningBank').main({action:'hydrate',bank:'common-question',mode:'qa',version:publicBefore.manifest.banks['common-question'].version,ids:[newIds[0]]});assert.equal(formal.code,'BAD_ITEMS');
  const result={passed:true,batch:batch.batchId,groups:1,targets:3,newQuestionIds:newIds,sourceRawCounts:{before:606,after:608},isolatedAvailableQuestions:{before:603,after:605},publicAvailableQuestions:603,publicGrant:0,groupBefore:3,groupAfter:5,qualitySlice:quality.status,exactItemSha256:exact,
    evidence:{existingContentAndTargetsRetained:true,replayOutputs:expanded.outputs.size,ungrantedDenied:true,testGrantCandidateOnly:true,candidateRuntimeDeniedOutsideLocalVM:true,blockedAndHoldDenied:true,effectiveWithdrawalAndOldArtifactReRequestsDenied:true,failuresRestoreOldWholeBundle:['generated','replace'],oldFrozenQueueAndWrongReviewPreserved:true,newItemsLearnedViaExistingPageAndBoundedBuffer:true,nonsemanticAssessmentPreserved:true,semanticChangeInvalidatesOnlyAffectedIdentity:true,withdrawalPreservesOtherEvaluations:true,publicOutputsByteIdentical:true},humanReview:false,realDevice:false,release:false};
  if(process.argv.includes('--record')){const out=path.join(root,'docs/knowledge-platform/lifecycle-s4-20261029');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'technical-acceptance.json'),JSON.stringify(result,null,2)+'\n');}
  console.log(JSON.stringify(result));
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
}
test().catch(error=>{console.error(error);process.exitCode=1});
