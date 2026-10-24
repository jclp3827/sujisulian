// Notes-owned work-plan projection. V4 receipts and runtime admission remain authoritative.
const fs=require('fs'),path=require('path');
const {loadBody}=require('./notes-learning-compiler');
const {availableContent}=require('../../miniprogram/subpackages/note/services/learning-content');
const {digest}=require('../../miniprogram/subpackages/note/services/learning-semantic');
const {hash}=require('../../miniprogram/subpackages/note/services/memory-reference');
const MANIFESTS=[
 'docs/knowledge-platform/content/notes/application-da01-20261023.json',
 'docs/knowledge-platform/content/notes/application-da02-20261023.json'
];
const PROOFS={
 'ME-APP-DA-01':'docs/knowledge-platform/implementations/evidence/ME-APP-DA-01-preview.json',
 'ME-APP-DA-02':'docs/knowledge-platform/implementations/evidence/ME-APP-DA-02-preview.json'
};
function expectedPrompt(question,block){return question.originAdaptation?`${question.originAdaptation.instruction}\n${block.stem}`:block.stem;}
function augment(root,plan,verified,proofPath){
 const body=loadBody(root),file=path.join(root,'miniprogram/subpackages/note/models/learning-pack.js');delete require.cache[require.resolve(file)];
 const pack=require(file),active=availableContent(body,pack,true).resources,allRecords=new Map();plan.applicationBatches=[];
 for(const manifestPath of MANIFESTS.filter(rel=>fs.existsSync(path.join(root,rel)))){
  const m=JSON.parse(fs.readFileSync(path.join(root,manifestPath))),accepted=[];
  const expectedCount=m.batchId==='ME-APP-DA-01'?47:m.batchId==='ME-APP-DA-02'?9:null;
  if(m.schemaVersion!==1||!expectedCount||m.moduleId!=='data-analysis'||m.changes.length>12||m.sourceRecords.length!==expectedCount||new Set(m.sourceRecords.map(r=>r.sourceExampleRecordId)).size!==expectedCount||new Set(m.changes.map(c=>c.questionId)).size!==m.changes.length||m.rawSourceChanged!==false||m.sharedUIChanged!==false||m.storageAndScoringChanged!==false||m.formalEnablementCreated!==false)throw Error('Application batch scope invalid');
  for(const row of m.sourceRecords){
   allRecords.set(row.sourceExampleRecordId,row);
   const task=plan.applications.examples.find(e=>e.sourceExampleRecordId===row.sourceExampleRecordId),point=body['data-analysis'].points.find(p=>p.id===row.pointId),tab=point?.tabs.find(t=>t.id===row.tabId),block=tab?.blocks[row.blockIndex];
   if(!task||task.primaryModuleId!==m.moduleId||task.applicationWorkUnitId!==row.applicationWorkUnitId||task.pointId!==row.pointId||task.tabId!==row.tabId||task.blockIndex!==row.blockIndex||task.expectedBlockSha256!==row.blockSha256||!block||hash(block)!==row.blockSha256)throw Error('Application task source changed');
   if(task.batchDisposition&&task.batchDisposition.batchId!==m.batchId)task.batchDispositionHistory=[...(task.batchDispositionHistory||[]),task.batchDisposition];
   task.batchDisposition={batchId:m.batchId,path:manifestPath,disposition:row.disposition,reason:row.reason};
   const change=m.changes.find(c=>c.sourceExampleRecordId===row.sourceExampleRecordId);
   if(change){
    const q=active.find(q=>q.id===change.questionId);
    if(!q?.semanticAdmission||q.origin?.sourceExampleRecordId!==row.sourceExampleRecordId||q.origin.expectedBlockSha256!==row.blockSha256||q.sourceKind!=='legacy-unverified'||q.status!=='review'||digest(q.prompt)!==digest(expectedPrompt(q,block))||digest(q.options)!==digest(block.options)||q.answer!==block.answer||q.explanation!==block.analysis)throw Error('Application import lacks exact current independent admission');
    if(q.originAdaptation&&(q.originAdaptation.kind!=='neutral-display-completion'||!q.originAdaptation.instruction||!q.originAdaptation.reason))throw Error('Application adaptation is not transparent');
    accepted.push(q.id);task.currentSourceHolds=[];task.disposition=q.originAdaptation?'recovered-with-transparent-condition-development-question':change.kind==='recover-held'?'recovered-exact-development-question':'new-exact-development-question';task.currentDevelopmentQuestionIds=[q.id];task.newImportAuthorized=true;task.independentAcceptance={receiptId:q.semanticAdmission.receiptId,questionRevision:q.revision,effectiveContentDigest:q.semanticAdmission.questionBinding.effectiveContentDigest};
   }else if(row.disposition!=='retain-current-development'){task.disposition=row.disposition;task.newImportAuthorized=false;}
  }
  plan.applicationBatches.push({batchId:m.batchId,path:manifestPath,engineeringVerified:m.batchId==='ME-APP-DA-02'?verified:true,proofPath:PROOFS[m.batchId]||proofPath,independentAcceptedQuestionIds:accepted,newImports:m.changes.filter(c=>c.kind.startsWith('new-import')).length,recoveredHeldQuestions:m.changes.filter(c=>c.kind==='recover-held').length,transparentConditionCompletions:m.changes.filter(c=>c.kind.includes('transparent-condition')).length,examProvenance:'legacy-unverified; development-only',formalEnablementCreated:false,nextBatch:m.nextBatch});
 }
 plan.applications.currentDevelopmentQuestions=active.filter(q=>q.exerciseKinds.includes('application')).length;
 plan.applications.sourceDispositionCounts=[...allRecords.values()].reduce((out,row)=>(out[row.disposition]=(out[row.disposition]||0)+1,out),{});
 return plan;
}
module.exports={MANIFESTS,PROOFS,augment};
