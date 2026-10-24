// Notes-owned work-plan projection. V4 receipts and runtime admission remain authoritative.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
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
function historicalDA01(root,successor){
 const records=successor.snapshots||[],proofPath=PROOFS['ME-APP-DA-01'],manifestPath=MANIFESTS[0];
 const readFrozen=rel=>{
  const row=records.find(row=>row.originalPath===rel);
  if(!row||!/^[a-f0-9]{64}$/.test(row.sha256)||row.path!==`docs/knowledge-platform/implementations/evidence/notes-application-da02-snapshots/${row.sha256}.json`)throw Error('Historical application proof snapshot missing');
  const frozen=fs.readFileSync(path.join(root,row.path)),current=fs.readFileSync(path.join(root,rel));
  if(crypto.createHash('sha256').update(frozen).digest('hex')!==row.sha256||crypto.createHash('sha256').update(current).digest('hex')!==row.sha256)throw Error('Historical application proof changed');
  return{value:JSON.parse(frozen),sha256:row.sha256};
 };
 const proof=readFrozen(proofPath),manifest=readFrozen(manifestPath),p=proof.value;
 const required=['preview','baseline','pages','v2','drafts','pack','candidate','compile','contract','content','learningPack','notes'];
 const actual=p.validation?.find(row=>row.name==='preview')?.result;
 if(p.batch!=='ME-APP-DA-01'||p.status!=='partial-development-preview-display-pending'||!Array.isArray(p.validation)||!p.validation.every(row=>row.exitCode===0)||required.some(name=>!p.validation.some(row=>row.name===name&&row.exitCode===0))||!actual?.passed||actual.checks<16||actual.routes?.length!==133||digest((actual.applicationRoutes||[]).map(row=>row.questionId).sort())!==digest(manifest.value.changes.map(row=>row.questionId).sort())||!p.sourceFiles?.some(row=>row.path===manifestPath&&row.sha256===manifest.sha256))throw Error('Historical application engineering evidence invalid');
 return{proofPath,proofSHA256:proof.sha256,manifestSHA256:manifest.sha256,scope:'historical-frozen-DA01-evidence; current eligibility revalidated separately'};
}
function augment(root,plan,verified,proofPath){
 const body=loadBody(root),file=path.join(root,'miniprogram/subpackages/note/models/learning-pack.js');delete require.cache[require.resolve(file)];
 const pack=require(file),active=availableContent(body,pack,true).resources,allRecords=new Map();plan.applicationBatches=[];
 const successorPath=MANIFESTS[1],successor=fs.existsSync(path.join(root,successorPath))?JSON.parse(fs.readFileSync(path.join(root,successorPath))):null;
 const historical=successor?historicalDA01(root,successor):null;
 for(const manifestPath of MANIFESTS.filter(rel=>fs.existsSync(path.join(root,rel)))){
  const m=JSON.parse(fs.readFileSync(path.join(root,manifestPath))),accepted=[];
  const expectedCount=m.batchId==='ME-APP-DA-01'?47:m.batchId==='ME-APP-DA-02'?9:null;
  if(m.schemaVersion!==1||!expectedCount||m.moduleId!=='data-analysis'||m.changes.length>12||m.sourceRecords.length!==expectedCount||new Set(m.sourceRecords.map(r=>r.sourceExampleRecordId)).size!==expectedCount||new Set(m.changes.map(c=>c.questionId)).size!==m.changes.length||m.rawSourceChanged!==false||m.sharedUIChanged!==false||m.storageAndScoringChanged!==false||m.formalEnablementCreated!==false)throw Error('Application batch scope invalid');
  if(m.batchId==='ME-APP-DA-02'&&(m.changes.length!==1||m.changes[0].questionId!=='notes-q-app-da02-000017'||m.changes[0].sourceExampleRecordId!=='notes-source-example-000017'||digest(m.sourceRecords.map(row=>row.sourceExampleRecordId).sort())!==digest(['000008','000009','000017','000022','000023','000024','000025','000029','000032'].map(id=>'notes-source-example-'+id))))throw Error('DA02 exact audited scope changed');
  if(m.batchId==='ME-APP-DA-02'){
   const dispositions={'000008':'hold-preanswer-image','000009':'hold-source-error','000017':'proposed-transparent-condition-import','000022':'hold-preanswer-image','000023':'hold-task-answer-and-preanswer-image','000024':'hold-preanswer-image','000025':'hold-preanswer-image','000029':'hold-blocked-point','000032':'hold-missing-data'};
   if(m.sourceRecords.some(row=>row.disposition!==dispositions[row.sourceExampleRecordId.slice(-6)]))throw Error('DA02 reviewed source disposition changed');
  }
  for(const row of m.sourceRecords){
   allRecords.set(row.sourceExampleRecordId,row);
   const task=plan.applications.examples.find(e=>e.sourceExampleRecordId===row.sourceExampleRecordId),point=body['data-analysis'].points.find(p=>p.id===row.pointId),tab=point?.tabs.find(t=>t.id===row.tabId),block=tab?.blocks[row.blockIndex];
   if(!task||task.primaryModuleId!==m.moduleId||task.applicationWorkUnitId!==row.applicationWorkUnitId||task.pointId!==row.pointId||task.tabId!==row.tabId||task.blockIndex!==row.blockIndex||task.expectedBlockSha256!==row.blockSha256||!block||hash(block)!==row.blockSha256)throw Error('Application task source changed');
   if(task.batchDisposition&&task.batchDisposition.batchId!==m.batchId)task.batchDispositionHistory=[...(task.batchDispositionHistory||[]),task.batchDisposition];
   task.batchDisposition={batchId:m.batchId,path:manifestPath,disposition:row.disposition,reason:row.reason};
   if(m.batchId==='ME-APP-DA-02'&&row.disposition.startsWith('hold-')&&active.some(q=>q.origin?.sourceExampleRecordId===row.sourceExampleRecordId))throw Error('Held image/source application cannot be admitted');
   const change=m.changes.find(c=>c.sourceExampleRecordId===row.sourceExampleRecordId);
   if(change){
    const q=active.find(q=>q.id===change.questionId);
    if(!q?.semanticAdmission||q.origin?.sourceExampleRecordId!==row.sourceExampleRecordId||q.origin.expectedBlockSha256!==row.blockSha256||q.sourceKind!=='legacy-unverified'||q.status!=='review'||digest(q.prompt)!==digest(expectedPrompt(q,block))||digest(q.options)!==digest(block.options)||q.answer!==block.answer||q.explanation!==block.analysis)throw Error('Application import lacks exact current independent admission');
    if(q.originAdaptation&&(q.originAdaptation.kind!=='neutral-display-completion'||!q.originAdaptation.instruction||!q.originAdaptation.reason))throw Error('Application adaptation is not transparent');
    if(m.batchId==='ME-APP-DA-02'&&(!q.originAdaptation||q.images?.length||q.materialId))throw Error('DA02 only accepts its reviewed text condition completion');
    accepted.push(q.id);task.historicalSourceHolds=[...new Map([...(task.historicalSourceHolds||[]),...(task.currentSourceHolds||[])].map(hold=>[digest(hold),hold])).values()];task.currentSourceHolds=[];task.disposition=q.originAdaptation?'recovered-with-transparent-condition-development-question':change.kind==='recover-held'?'recovered-exact-development-question':'new-exact-development-question';task.currentDevelopmentQuestionIds=[q.id];task.newImportAuthorized=true;task.independentAcceptance={receiptId:q.semanticAdmission.receiptId,questionRevision:q.revision,effectiveContentDigest:q.semanticAdmission.questionBinding.effectiveContentDigest};
   }else if(row.disposition!=='retain-current-development'){task.disposition=row.disposition;task.newImportAuthorized=false;}
  }
  plan.applicationBatches.push({batchId:m.batchId,path:manifestPath,engineeringVerified:m.batchId==='ME-APP-DA-01'&&historical?true:verified,...(m.batchId==='ME-APP-DA-01'&&historical?{historicalEngineeringEvidence:historical}:{}),proofPath:PROOFS[m.batchId]||proofPath,independentAcceptedQuestionIds:accepted,newImports:m.changes.filter(c=>c.kind.startsWith('new-import')).length,recoveredHeldQuestions:m.changes.filter(c=>c.kind==='recover-held').length,transparentConditionCompletions:m.changes.filter(c=>c.kind.includes('transparent-condition')).length,examProvenance:'legacy-unverified; development-only',formalEnablementCreated:false,nextBatch:m.nextBatch});
 }
 plan.applications.currentDevelopmentQuestions=active.filter(q=>q.exerciseKinds.includes('application')).length;
 plan.applications.sourceDispositionCounts=[...allRecords.values()].reduce((out,row)=>(out[row.disposition]=(out[row.disposition]||0)+1,out),{});
 return plan;
}
module.exports={MANIFESTS,PROOFS,augment};
