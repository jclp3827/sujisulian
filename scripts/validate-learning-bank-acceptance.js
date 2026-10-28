const assert=require('assert/strict'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {compile}=require('./build-learning-bank-function');
const {createGoldenGuideContent}=require('../miniprogram/subpackages/common-sense/services/guide-content');
const sample=require('../miniprogram/subpackages/common-sense/models/guide-expansion-candidate');
const body=require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const policy=require('../docs/knowledge-platform/content/learning-bank-public-admission.json');
const clone=x=>JSON.parse(JSON.stringify(x)),baseline=compile({collect:true}),group=sample.groups[0],card=group.cards[0],id=group.pointId+'::'+card.id;
const available=result=>result.manifest.banks['common-guide'].index.some(x=>x.id===id);
for(const mutate of [
 c=>{c.status='blocked'},c=>{c.status='HOLD'},c=>{c.localHold={reason:'isolated test'}},
 c=>{c.review={...c.review,admission:'blocked'}},c=>{c.review={...c.review,status:'HOLD'}}]){
 const prior=clone(card);mutate(card);
 try{assert(!available(compile({collect:true})));assert(!available(compile({collect:true,candidate:true})));
 assert(!createGoldenGuideContent(body,sample).cards.some(x=>x.id===id));
 assert.throws(()=>require('./validate-learning-bank-release').validateArtifact(path.resolve(__dirname,'../cloudfunctions/learningBank'),policy,require('../cloudfunctions/learningBank/effective-withdrawals.json')),/no longer admitted/);
 }finally{for(const key of Object.keys(card))delete card[key];Object.assign(card,prior);}
}
for(const hold of [{pointId:group.pointId,id:card.id,reason:'test'},{pointId:group.pointId,sourceUnitIds:card.sourceUnitIds,reason:'source dependency HOLD'}]){
 sample.holds.push(hold);try{assert(!available(compile({collect:true})));assert(!createGoldenGuideContent(body,sample).cards.some(x=>x.id===id));}finally{sample.holds.pop()}
}
const oldStatus=group.status;group.status='blocked';try{assert(!available(compile({collect:true})));}finally{if(oldStatus===undefined)delete group.status;else group.status=oldStatus;}
assert.deepEqual(compile({collect:true}).outputs,baseline.outputs,'No actual public output changed');
const fake={...clone(policy),environment:'isolated-test'};
assert.equal(compile({collect:true,policy:fake}).manifest.admission.candidate,true);
assert.throws(()=>compile({policy:fake}),/isolated destination/);
assert.deepEqual(compile({collect:true}).outputs,baseline.outputs);
async function checkCandidateRuntime() {
 const vm=require('vm'),{createRequire}=require('module'),filename=path.resolve(__dirname,'../cloudfunctions/learningBank/index.js');
 const module={exports:{}},native=createRequire(filename),directory=path.dirname(filename);
 const candidate={...baseline.manifest,admission:{...baseline.manifest.admission,candidate:true}};
 vm.runInNewContext(fs.readFileSync(filename,'utf8'),{module,exports:module.exports,__dirname:directory,
   require:id=>id==='./data/manifest.json'?candidate:native(id),process:{env:{}}});
 const result=await module.exports.main({action:'start',bank:'common-question',mode:'qa',allowCandidate:true,environment:'isolated-test'});
 assert.equal(result.code,'CANDIDATE_ONLY');
 console.log(JSON.stringify({passed:true,sourceBlockedAndHoldDenied:true,declaredAndSourceUnitHoldsDenied:true,directConverterDenied:true,rollbackOfNewlyHeldBodyRejected:true,testGrantsForcedCandidateOnly:true,publicRuntimeRefusesCandidateArtifact:true,realPublicOutputsByteIdentical:true}));
}
checkCandidateRuntime().catch(error=>{console.error(error);process.exitCode=1});
