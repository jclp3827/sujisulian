const assert=require('assert/strict'),fs=require('fs'),path=require('path'),os=require('os'),crypto=require('crypto');
const {compile}=require('./build-learning-bank-function'),{permit,binding,digest}=require('./lib/learning-bank-admission');
const {publish}=require('./lib/learning-bank-output'),{validateArtifact}=require('./validate-learning-bank-release');
const policy=require('../docs/knowledge-platform/content/learning-bank-public-admission.json'),ledger=require('../cloudfunctions/learningBank/effective-withdrawals.json');
const clone=x=>JSON.parse(JSON.stringify(x)),root=path.resolve(__dirname,'..'),ids=require('../docs/knowledge-platform/lifecycle-s1-s3-20261028/historical-public-ids.json');
const result=compile({collect:true});for(const[n,b]of Object.entries(result.manifest.banks))assert.deepEqual(b.index.map(x=>x.id),ids[n]);assert.equal(policy.grants.length,0);
const raw=require('../miniprogram/subpackages/common-sense/models/learning-pack');
const question=clone(raw.questions.find(x=>ids['common-question'].includes(x.id))),fresh={...clone(question),id:'isolated-new-candidate'};
raw.questions.push(fresh);raw.groups.find(g=>g.id===fresh.group).questionIds.push(fresh.id);raw.entryPlans.modes.qa.questionIds.push(fresh.id);
const relation=raw.targetRelations.questionTargets.find(x=>x.questionId===question.id);raw.targetRelations.questionTargets.push({...clone(relation),questionId:fresh.id});
raw.questionSpecifications.push({...clone(raw.questionSpecifications.find(x=>x.questionId===question.id)),questionId:fresh.id});
assert(compile({collect:true,candidate:true}).manifest.banks['common-question'].index.some(x=>x.id===fresh.id));
assert(!compile({collect:true}).manifest.banks['common-question'].index.some(x=>x.id===fresh.id));
const candidateOnly=compile({collect:true});assert.equal(candidateOnly.manifest.banks['common-question'].version,result.manifest.banks['common-question'].version,'Unapproved new ID must not change public version');
const aux={...clone(raw.comparisons[0]),id:'isolated-new-comparison'};raw.comparisons.push(aux);raw.entryPlans.modes.confusion.comparisonIds.push(aux.id);
const isolatedBootstrap=c=>JSON.parse(c.outputs.get('cloudfunctions/learningBank/data/common-question/bootstrap.json'));
assert(isolatedBootstrap(compile({collect:true,candidate:true})).comparisons.some(x=>x.id===aux.id));
assert(!isolatedBootstrap(compile({collect:true})).comparisons.some(x=>x.id===aux.id));
assert.equal(compile({collect:true}).manifest.banks['common-question'].version,result.manifest.banks['common-question'].version);
raw.comparisons.pop();raw.entryPlans.modes.confusion.comparisonIds.pop();
const granted=clone(policy),token=binding('common-question',fresh,raw);granted.grants.push({batchId:'test-only',decision:'public-authorized',authorizedBy:'isolated-fixture',authorizedAt:'2026-10-28',independentReviewReceipt:'fixture-only',humanSamplingReceipt:'fixture-only',bindings:[{bank:'common-question',id:fresh.id,digest:token}]});
assert(compile({collect:true,policy:granted}).manifest.banks['common-question'].index.some(x=>x.id===fresh.id));
const held={...fresh,status:'blocked'};assert(!permit('common-question',held,binding('common-question',held,raw),granted,ledger));
assert(!permit('common-question',{...fresh,status:'HOLD'},token,granted,ledger));
const revised={...fresh,prompt:fresh.prompt+'（语义修订）'};assert(!permit('common-question',revised,binding('common-question',revised,raw),granted,ledger));
const target=raw.targets.find(x=>x.id===relation.primaryTargetIds[0]),prior=target.conclusion;target.conclusion+='（依赖实质变更）';assert(!permit('common-question',fresh,binding('common-question',fresh,raw),granted,ledger));target.conclusion=prior;
// The raw fixture never reaches disk; restore its exact source state.
raw.questions.pop();raw.groups.find(g=>g.id===fresh.group).questionIds.pop();raw.entryPlans.modes.qa.questionIds.pop();raw.targetRelations.questionTargets.pop();raw.questionSpecifications.pop();
const withdrawn=clone(ledger),victim=result.manifest.banks['common-question'].index[0];withdrawn.revision++;
withdrawn.entries.push({bank:'common-question',id:victim.id,revision:String(victim.contentRevision),withdrawnAt:'2026-10-28',reason:'isolated withdrawal fixture'});
const after=compile({collect:true,withdrawals:withdrawn});assert(!after.manifest.banks['common-question'].index.some(x=>x.id===victim.id));
assert.throws(()=>validateArtifact(path.join(root,'cloudfunctions/learningBank'),policy,withdrawn),/withdrawals/);
validateArtifact(path.join(root,'cloudfunctions/learningBank'),policy,ledger);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'learning-bank-atomic-'));
try{
 publish(temp,result.outputs);const snapshot=()=>[...result.outputs.keys()].map(f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(temp,f))).digest('hex'));
 const before=snapshot();for(const failAt of ['generated','replace']){assert.throws(()=>publish(temp,new Map([...result.outputs].map(([f,v])=>[f,v+' '])),{failAt}),/Injected/);assert.deepEqual(snapshot(),before);}
 publish(temp,result.outputs,{check:true});
 fs.mkdirSync(path.join(temp,'.learning-bank-build.lock'));assert.throws(()=>publish(temp,result.outputs),/EEXIST/);assert.deepEqual(snapshot(),before);fs.rmdirSync(path.join(temp,'.learning-bank-build.lock'));
 assert.throws(()=>publish(temp,result.outputs,{candidate:true,destination:temp}),/fresh/);
 const a=compile({collect:true}),b=compile({collect:true});assert.deepEqual(a.outputs,b.outputs);compile({check:true});
}finally{fs.rmSync(temp,{recursive:true,force:true});}
async function service(){
 const {main,budgetResponse}=require('../cloudfunctions/learningBank');
 assert.equal((await main({action:'hydrate',bank:'common-question',mode:'qa',version:result.manifest.banks['common-question'].version,ids:['isolated-new-candidate']})).code,'BAD_ITEMS');
 const catalog=await main({action:'catalog',bank:'common-mnemonic',mode:'mnemonic',scope:{scope:'law'}});assert(catalog.ok&&catalog.items.length&&catalog.items.every(x=>x.scope==='law'));
 const bank=result.manifest.banks['common-mnemonic'];const outside=bank.index.find(x=>x.scope!=='law');assert.equal((await main({action:'hydrate',bank:'common-mnemonic',mode:'mnemonic',scope:{scope:'law'},version:bank.version,ids:[outside.id]})).code,'BAD_ITEMS');
 const big={id:'large',text:'字'.repeat(22000)};assert.equal(budgetResponse({ok:true,items:[big],nextOffset:1,payloadBytes:66000},'hydrate').code,'RESPONSE_TOO_LARGE');
 const near={ok:true,items:[{id:'a',text:'x'.repeat(64000)},{id:'b',text:'y'.repeat(3000)}],nextOffset:2,payloadBytes:67000};const r=budgetResponse(near,'hydrate');assert(r.ok&&r.items.length===1&&r.nextOffset===1);assert(Buffer.byteLength(JSON.stringify({result:r}))+1024<=65536);
 assert((await main({action:'catalog',bank:'common-mnemonic',mode:'mnemonic',scope:{scope:'nonexistent'}})).ok);
 const live=ledger.entries;ledger.entries=withdrawn.entries;try{const denied=await main({action:'hydrate',bank:'common-question',mode:'qa',version:result.manifest.banks['common-question'].version,ids:[victim.id]});assert.equal(denied.code,'BAD_ITEMS');const bootstrap=await main({action:'bootstrap',bank:'common-question',mode:'qa'});assert(!bootstrap.content.questions.some(x=>x.id===victim.id));
 const auxId=bootstrap.content.comparisons[0].id;ledger.entries.push({bank:'common-comparison',id:auxId,revision:'*',withdrawnAt:'2026-10-28',reason:'isolated auxiliary withdrawal'});const auxiliary=await main({action:'bootstrap',bank:'common-question',mode:'qa'});assert(!auxiliary.content.comparisons.some(x=>x.id===auxId));}finally{ledger.entries=live;}
 console.log(JSON.stringify({passed:true,historicalIdentityUnchanged:true,newPublicGrants:0,candidateOnlyUntilExactGrant:true,semanticAndDependencyDriftRejected:true,withdrawalOverridesGenerationRequestsAndRollback:true,atomicFailureRestored:['generated','replace'],replayFiles:result.outputs.size,responseEnvelopeBudget:65536,bootstrapMetadataBudget:524288,domainNegative:true}));
}
service().catch(e=>{console.error(e);process.exitCode=1;});
