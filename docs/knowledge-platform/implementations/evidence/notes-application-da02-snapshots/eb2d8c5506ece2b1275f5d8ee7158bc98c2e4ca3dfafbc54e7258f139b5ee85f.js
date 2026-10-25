// Notes-owned work-plan projection. V4 receipts and runtime admission remain authoritative.
const fs=require('fs'),path=require('path');
const {loadBody}=require('./notes-learning-compiler'),{availableContent}=require('../../miniprogram/subpackages/note/services/learning-content'),{digest}=require('../../miniprogram/subpackages/note/services/learning-semantic'),{hash}=require('../../miniprogram/subpackages/note/services/memory-reference');
const MANIFEST='docs/knowledge-platform/content/notes/application-da01-20261023.json';
function augment(root,plan,verified,proofPath){
 const m=JSON.parse(fs.readFileSync(path.join(root,MANIFEST))),body=loadBody(root),file=path.join(root,'miniprogram/subpackages/note/models/learning-pack.js');delete require.cache[require.resolve(file)];const pack=require(file),active=availableContent(body,pack,true).resources,accepted=[];
 if(m.schemaVersion!==1||m.batchId!=='ME-APP-DA-01'||m.moduleId!=='data-analysis'||m.changes.length>12||m.sourceRecords.length!==47||new Set(m.sourceRecords.map(r=>r.sourceExampleRecordId)).size!==47||new Set(m.changes.map(c=>c.questionId)).size!==m.changes.length||m.rawSourceChanged!==false||m.sharedUIChanged!==false||m.storageAndScoringChanged!==false||m.formalEnablementCreated!==false)throw Error('Application batch scope invalid');
 for(const row of m.sourceRecords){const task=plan.applications.examples.find(e=>e.sourceExampleRecordId===row.sourceExampleRecordId),point=body['data-analysis'].points.find(p=>p.id===row.pointId),tab=point?.tabs.find(t=>t.id===row.tabId),block=tab?.blocks[row.blockIndex];if(!task||task.primaryModuleId!==m.moduleId||task.applicationWorkUnitId!==row.applicationWorkUnitId||task.pointId!==row.pointId||task.tabId!==row.tabId||task.blockIndex!==row.blockIndex||task.expectedBlockSha256!==row.blockSha256||!block||hash(block)!==row.blockSha256)throw Error('Application task source changed');
  task.batchDisposition={batchId:m.batchId,path:MANIFEST,disposition:row.disposition,reason:row.reason};
  const change=m.changes.find(c=>c.sourceExampleRecordId===row.sourceExampleRecordId);
  if(change){const q=active.find(q=>q.id===change.questionId);if(!q?.semanticAdmission||q.origin?.sourceExampleRecordId!==row.sourceExampleRecordId||q.origin.expectedBlockSha256!==row.blockSha256||q.sourceKind!=='legacy-unverified'||q.status!=='review'||digest(q.prompt)!==digest(block.stem)||digest(q.options)!==digest(block.options)||q.answer!==block.answer||q.explanation!==block.analysis)throw Error('Application import lacks exact current independent admission');
   accepted.push(q.id);task.historicalSourceHolds=task.currentSourceHolds;task.currentSourceHolds=[];task.disposition=change.kind==='recover-held'?'recovered-exact-development-question':'new-exact-development-question';task.currentDevelopmentQuestionIds=[q.id];task.newImportAuthorized=true;task.independentAcceptance={receiptId:q.semanticAdmission.receiptId,questionRevision:q.revision,effectiveContentDigest:q.semanticAdmission.questionBinding.effectiveContentDigest};
  }else if(row.disposition!=='retain-current-development'){task.disposition=row.disposition;task.newImportAuthorized=false;}
 }
 plan.applicationBatches=[{batchId:m.batchId,path:MANIFEST,engineeringVerified:verified,proofPath,independentAcceptedQuestionIds:accepted,newImports:m.changes.filter(c=>c.kind==='new-import').length,recoveredHeldQuestions:m.changes.filter(c=>c.kind==='recover-held').length,examProvenance:'legacy-unverified; development-only',formalEnablementCreated:false,nextBatch:m.nextBatch}];
 plan.applications.currentDevelopmentQuestions=active.filter(q=>q.exerciseKinds.includes('application')).length;
 plan.applications.sourceDispositionCounts=m.sourceRecords.reduce((o,r)=>(o[r.disposition]=(o[r.disposition]||0)+1,o),{});
 return plan;
}
module.exports={MANIFEST,augment};
