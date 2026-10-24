// Build-time equivalence proof for reviewed source-only migrations; never invents admission.
const path=require('path');
const core=require('../../miniprogram/subpackages/note/services/learning-semantic');
const {availableContent}=require('../../miniprogram/subpackages/note/services/learning-content');
const source=require('./notes-memory-sample-source');
const IDS=['notes-q-nq3-quantity-application-cooperation','notes-q-nq3-quantity-application-efficiency','notes-q-nq3-quantity-basic-efficiency','notes-q-nq3-quantity-method-stage-trial'];
const LOGIC_IDS=['notes-q-app-lo01-000167','notes-q-app-lo01-000168','notes-q-app-lo01-000169','notes-q-nq4-logic-application-table'];
const VERBAL_IDS=['notes-q-app-ve01-000200'];
const LOGIC_CORRECT02_IDS=['notes-q-app-lo04-000143','notes-q-app-lo04-000147','notes-q-app-lo04-000152'];
const COVERAGE_CORRECT02_IDS=['notes-q-app-da01-000047','notes-q-app-qu02-000073','notes-q-app-qu03-000091'];
function normalized(resource,m){
 const changed=new Map(m.v4Changes.map(c=>[c.id,c]));
 function visit(value){
  if(Array.isArray(value))return value.map(visit);
  if(!value||typeof value!=='object')return value;
  const out={...value},change=changed.get(out.id);
  if(change&&out.revision!==undefined){if(![change.before.revision,change.after.revision].includes(out.revision))throw Error('练习兼容版本超出已核范围');out.revision=change.before.revision;}
  if(out.subjectId==='quantity'&&out.pointId==='work-efficiency'&&out.tabId==='knowledge'&&out.expectedSha256!==undefined){
   if(![m.beforeTabSha256,m.afterTabSha256].includes(out.expectedSha256))throw Error('练习兼容来源证明不匹配');
   out.expectedSha256=m.beforeTabSha256;delete out.fingerprint;
  }
  delete out.reviewVerified;
  return Object.fromEntries(Object.entries(out).map(([k,v])=>[k,visit(v)]));
 }
 const copy={...resource};
 for(const key of ['semanticAdmission','semanticRuntimeSignature','legacyCompatibility','assessmentFingerprint'])delete copy[key];
 return visit(copy);
}
function workSourceEntries(root,pack,body){
 const m=source.migration(root);if(!m)return{schemaVersion:1,migrationId:null,entries:{}};
 const point=body.quantity?.points.find(p=>p.id==='work-efficiency');
 if(require('../../miniprogram/subpackages/note/services/memory-reference').hash(point)!==m.afterPointSha256||core.digest(m.activeV4QuestionIds)!==core.digest(IDS))throw Error('练习兼容来源或范围已变化');
 const file=m.historicalFiles.find(f=>f.originalPath==='miniprogram/subpackages/note/models/learning-pack.js');source.snapshot(root,file);
 const oldPack=require(path.join(root,file.path)),oldBody=source.historicalBody(root,body);
 const previous=availableContent(oldBody,oldPack,true),current=availableContent(body,pack,true),entries={};
 for(const id of IDS){
  const before=previous.resources.find(q=>q.id===id),after=current.resources.find(q=>q.id===id);
  if(!before?.semanticAdmission||!after?.semanticAdmission||before.materialId||after.materialId||before.resourceType!=='question'||after.resourceType!=='question'||core.digest(normalized(before,m))!==core.digest(normalized(after,m)))throw Error('既有练习发生实质变化，不能继承旧轮次：'+id);
  const row={previousRuntimeSignature:core.runtimeSignature(before),currentRuntimeSignature:core.runtimeSignature(after)};
  if(before.legacyCompatibility?.currentSemanticSignature===before.semanticAdmission.signature)row.legacyResourceSignature=before.legacyCompatibility.resourceSignature;
  entries[id]=row;
 }
 return{migrationId:m.batchId,entries};
}
function logicNormalized(resource,ids,tabHashes){
 function visit(value){
  if(Array.isArray(value))return value.map(visit);
  if(!value||typeof value!=='object')return value;
  const out={...value};
  if(ids.has(out.id)&&out.revision!==undefined)out.revision=0;
  if(out.subjectId==='logic'&&tabHashes[out.pointId]?.includes(out.expectedSha256)){
   out.expectedSha256='reviewed-source-only-migration';delete out.fingerprint;
  }
  for(const key of ['semanticAdmission','semanticRuntimeSignature','legacyCompatibility','assessmentFingerprint','resourceSignature','reviewVerified'])delete out[key];
  return Object.fromEntries(Object.entries(out).map(([k,v])=>[k,visit(v)]));
 }
 return visit(resource);
}
function logicCorrectionEntries(root,pack,body){
 const rel='docs/knowledge-platform/content/notes/application-lo-correct01-20261024.json',file=path.join(root,rel);if(!require('fs').existsSync(file))return{migrationId:null,entries:{}};
 const m=JSON.parse(require('fs').readFileSync(file)),snap=m.snapshots.find(f=>f.originalPath==='miniprogram/subpackages/note/models/learning-pack.js');if(m.batchId!=='ME-APP-LO-CORRECT-01'||m.sharedUIChanged!==false||m.storageAndScoringChanged!==false||!snap)throw Error('逻辑来源兼容批次无效');
 const frozen=require('fs').readFileSync(path.join(root,snap.path));if(require('crypto').createHash('sha256').update(frozen).digest('hex')!==snap.sha256)throw Error('逻辑来源兼容快照无效');const oldPack=require(path.join(root,snap.path)),oldBody=JSON.parse(JSON.stringify(body)),oldFormal=JSON.parse(require('fs').readFileSync(path.join(root,m.sourceFileCorrection.beforeSnapshotPath)));oldBody.logic.points=oldBody.logic.points.map(p=>oldFormal.find(x=>x.id===p.id)||p);
 const previous=availableContent(oldBody,oldPack,true),current=availableContent(body,pack,true),entries={},entityIds=new Set(LOGIC_IDS);
 for(const id of LOGIC_IDS){const after=current.resources.find(q=>q.id===id),before=previous.resources.find(q=>q.id===id);if(!before?.semanticAdmission||!after?.semanticAdmission||before.materialId||after.materialId||before.resourceType!=='question'||after.resourceType!=='question')throw Error('逻辑来源兼容题缺失：'+id);for(const t of [...before.resolvedTargets,...after.resolvedTargets])entityIds.add(t.id);}
 const tabHashes={};for(const pointId of ['truth-analysis','daily-analysis']){const before=oldBody.logic.points.find(p=>p.id===pointId).tabs.find(t=>t.id==='example'),after=body.logic.points.find(p=>p.id===pointId).tabs.find(t=>t.id==='example');tabHashes[pointId]=[core.sha256(JSON.stringify(before)),core.sha256(JSON.stringify(after))];}
 for(const id of LOGIC_IDS){const before=previous.resources.find(q=>q.id===id),after=current.resources.find(q=>q.id===id);if(core.digest(logicNormalized(before,entityIds,tabHashes))!==core.digest(logicNormalized(after,entityIds,tabHashes)))throw Error('逻辑既有练习发生实质变化，不能继承旧轮次：'+id);entries[id]={previousRuntimeSignature:core.runtimeSignature(before),currentRuntimeSignature:core.runtimeSignature(after)};}
 return{migrationId:m.batchId,entries};
}
function logicCorrection2Entries(root,pack,body){
 const fs=require('fs'),crypto=require('crypto'),rel='docs/knowledge-platform/content/notes/application-lo-correct02-20261024.json',file=path.join(root,rel);if(!fs.existsSync(file))return{migrationId:null,entries:{}};
 const m=JSON.parse(fs.readFileSync(file));if(m.batchId!=='ME-APP-LO-CORRECT-02'||m.sharedUIChanged!==false||m.storageAndScoringChanged!==false)throw Error('第二批逻辑来源兼容批次无效');
 const snap=m.snapshots.find(row=>row.originalPath==='miniprogram/subpackages/note/models/learning-pack.js'),sourceSnap=m.snapshots.find(row=>row.originalPath==='miniprogram/models/note-logic/points/argument.json');if(!snap||!sourceSnap)throw Error('第二批逻辑来源兼容快照缺失');for(const row of [snap,sourceSnap]){const bytes=fs.readFileSync(path.join(root,row.path));if(crypto.createHash('sha256').update(bytes).digest('hex')!==row.sha256)throw Error('第二批逻辑来源兼容快照无效');}
 const oldPack=require(path.join(root,snap.path)),oldBody=JSON.parse(JSON.stringify(body)),oldPoints=JSON.parse(fs.readFileSync(path.join(root,sourceSnap.path)));oldBody.logic.points=oldBody.logic.points.map(point=>oldPoints.find(old=>old.id===point.id)||point);
 const previous=availableContent(oldBody,oldPack,true),current=availableContent(body,pack,true),entries={},entityIds=new Set(LOGIC_CORRECT02_IDS),tabHashes={};
 for(const id of LOGIC_CORRECT02_IDS){const before=previous.resources.find(q=>q.id===id),after=current.resources.find(q=>q.id===id);if(!before?.semanticAdmission||!after?.semanticAdmission||before.materialId||after.materialId||before.resourceType!=='question'||after.resourceType!=='question')throw Error('第二批逻辑来源兼容题缺失：'+id);for(const t of [...before.resolvedTargets,...after.resolvedTargets])entityIds.add(t.id);}
 for(const pointId of ['general-weaken','assumption']){const beforeTabs=oldBody.logic.points.find(p=>p.id===pointId).tabs,afterTabs=body.logic.points.find(p=>p.id===pointId).tabs;tabHashes[pointId]=beforeTabs.flatMap(before=>{const after=afterTabs.find(t=>t.id===before.id);return after?[core.sha256(JSON.stringify(before)),core.sha256(JSON.stringify(after))]:[];});}
 for(const id of LOGIC_CORRECT02_IDS){const before=previous.resources.find(q=>q.id===id),after=current.resources.find(q=>q.id===id);if(core.digest(logicNormalized(before,entityIds,tabHashes))!==core.digest(logicNormalized(after,entityIds,tabHashes)))throw Error('第二批逻辑既有练习发生实质变化，不能继承旧轮次：'+id);entries[id]={previousRuntimeSignature:core.runtimeSignature(before),currentRuntimeSignature:core.runtimeSignature(after)};}
 return{migrationId:m.batchId,entries};
}
function verbalNormalized(resource,ids,tabHashes){
 function visit(value){
  if(Array.isArray(value))return value.map(visit);
  if(!value||typeof value!=='object')return value;
  const out={...value};
  if(ids.has(out.id)&&out.revision!==undefined)out.revision=0;
  if(out.subjectId==='verbal'&&tabHashes[out.pointId]&&out.tabId==='example'&&out.expectedSha256!==undefined){
   if(!tabHashes[out.pointId].includes(out.expectedSha256))throw Error('言语练习兼容来源证明不匹配');
   out.expectedSha256='reviewed-source-only-migration';delete out.fingerprint;
  }
  for(const key of ['semanticAdmission','semanticRuntimeSignature','legacyCompatibility','assessmentFingerprint','resourceSignature','reviewVerified'])delete out[key];
  return Object.fromEntries(Object.entries(out).map(([k,v])=>[k,visit(v)]));
 }
 return visit(resource);
}
function verbalCorrectionEntries(root,pack,body){
 const fs=require('fs'),crypto=require('crypto'),rel='docs/knowledge-platform/content/notes/application-ve02-20261024.json',file=path.join(root,rel);if(!fs.existsSync(file))return{migrationId:null,entries:{}};
 const m=JSON.parse(fs.readFileSync(file));if(m.batchId!=='ME-APP-VE-02'||m.sharedUIChanged!==false||m.storageAndScoringChanged!==false)throw Error('言语来源兼容批次无效');
 const snap=m.snapshots.find(row=>row.originalPath==='miniprogram/subpackages/note/models/learning-pack.js');if(!snap)throw Error('言语来源兼容学习包快照缺失');const frozen=fs.readFileSync(path.join(root,snap.path));if(crypto.createHash('sha256').update(frozen).digest('hex')!==snap.sha256)throw Error('言语来源兼容学习包快照无效');
 const oldPack=require(path.join(root,snap.path)),oldBody=JSON.parse(JSON.stringify(body));
 for(const sourcePath of ['miniprogram/models/note-verbal/points/main-idea.json','miniprogram/models/note-verbal/points/sentence.json']){const row=m.snapshots.find(item=>item.originalPath===sourcePath);if(!row)throw Error('言语来源兼容原文件快照缺失');const bytes=fs.readFileSync(path.join(root,row.path));if(crypto.createHash('sha256').update(bytes).digest('hex')!==row.sha256)throw Error('言语来源兼容原文件快照无效');const oldPoints=JSON.parse(bytes);oldBody.verbal.points=oldBody.verbal.points.map(point=>oldPoints.find(old=>old.id===point.id)||point);}
 const previous=availableContent(oldBody,oldPack,true),current=availableContent(body,pack,true),entries={},entityIds=new Set(VERBAL_IDS),tabHashes={};
 for(const id of VERBAL_IDS){const before=previous.resources.find(q=>q.id===id),after=current.resources.find(q=>q.id===id);if(!before?.semanticAdmission||!after?.semanticAdmission||before.materialId||after.materialId||before.resourceType!=='question'||after.resourceType!=='question')throw Error('言语来源兼容题缺失：'+id);for(const t of [...before.resolvedTargets,...after.resolvedTargets])entityIds.add(t.id);}
 for(const pointId of ['option-analysis']){const before=oldBody.verbal.points.find(p=>p.id===pointId).tabs.find(t=>t.id==='example'),after=body.verbal.points.find(p=>p.id===pointId).tabs.find(t=>t.id==='example');tabHashes[pointId]=[core.sha256(JSON.stringify(before)),core.sha256(JSON.stringify(after))];}
 for(const id of VERBAL_IDS){const before=previous.resources.find(q=>q.id===id),after=current.resources.find(q=>q.id===id);if(core.digest(verbalNormalized(before,entityIds,tabHashes))!==core.digest(verbalNormalized(after,entityIds,tabHashes)))throw Error('言语既有练习发生实质变化，不能继承旧轮次：'+id);entries[id]={previousRuntimeSignature:core.runtimeSignature(before),currentRuntimeSignature:core.runtimeSignature(after)};}
 return{migrationId:m.batchId,entries};
}

function coverageCorrectionNormalized(resource,entityIds,sourceHashes){
 function visit(value){
  if(Array.isArray(value))return value.map(visit);
  if(!value||typeof value!=='object')return value;
  const out={...value};
  if(entityIds.has(out.id)&&out.revision!==undefined)out.revision=0;
  const key=[out.subjectId,out.pointId,out.tabId].join('/');
  if(sourceHashes[key]&&out.expectedSha256!==undefined){if(!sourceHashes[key].includes(out.expectedSha256))throw Error('纠错练习兼容来源证明不匹配：'+key);out.expectedSha256='reviewed-coverage-correct02';delete out.fingerprint;}
  for(const k of ['semanticAdmission','semanticRuntimeSignature','legacyCompatibility','assessmentFingerprint','resourceSignature','reviewVerified'])delete out[k];
  return Object.fromEntries(Object.entries(out).map(([k,v])=>[k,visit(v)]));
 }
 return visit(resource);
}
function coverageCorrectionEntries(root,pack,body){
 const fs=require('fs'),crypto=require('crypto'),manifestPath=path.join(root,'docs/knowledge-platform/content/notes/coverage-correct02-20261024.json');if(!fs.existsSync(manifestPath))return{migrationId:null,entries:{}};
 const m=JSON.parse(fs.readFileSync(manifestPath));if(m.batchId!=='ME-COVERAGE-CORRECT-02'||m.sharedUIChanged!==false||m.storageAndScoringChanged!==false)throw Error('覆盖纠错兼容批次无效');
 const get=original=>{const row=m.snapshots.find(x=>x.originalPath===original);if(!row)throw Error('覆盖纠错快照缺失：'+original);const bytes=fs.readFileSync(path.join(root,row.path));if(crypto.createHash('sha256').update(bytes).digest('hex')!==row.sha256)throw Error('覆盖纠错快照失配：'+original);return JSON.parse(bytes);};
 const oldSource=get('docs/knowledge-platform/content/notes/learning-v1.json'),oldBody=JSON.parse(JSON.stringify(body));
 for(const [subjectId,rel] of [['data-analysis','miniprogram/models/note-data-analysis/points/speed-calc.json'],['quantity','miniprogram/models/note-quantity/points/concentration.json'],['quantity','miniprogram/models/note-quantity/points/inclusion.json'],['logic','miniprogram/models/note-logic/points/formal.json']]){const oldPoints=get(rel);oldBody[subjectId].points=oldBody[subjectId].points.map(point=>oldPoints.find(old=>old.id===point.id)||point);}
 const ledger=JSON.parse(fs.readFileSync(path.join(root,'docs/knowledge-platform/content/notes/exam-reviews-v4.json'))),semanticLedger={...ledger,receipts:ledger.receipts.filter(r=>!String(r.receiptId).startsWith('coverage-correct02-independent-'))};
 const oldPack=require('./notes-learning-compiler').compile(oldSource,oldBody,{semanticLedger}),previous=availableContent(oldBody,oldPack,true),current=availableContent(body,pack,true),entries={},entityIds=new Set(COVERAGE_CORRECT02_IDS),sourceHashes={};
 for(const id of COVERAGE_CORRECT02_IDS){const before=previous.resources.find(q=>q.id===id),after=current.resources.find(q=>q.id===id);if(!before?.semanticAdmission||!after?.semanticAdmission||before.resourceType!=='question'||after.resourceType!=='question')throw Error('覆盖纠错兼容题缺失：'+id);for(const t of [...before.resolvedTargets,...after.resolvedTargets])entityIds.add(t.id);}
 for(const [subjectId,pointId] of [['data-analysis','assumption-allocation'],['quantity','concentration-cross'],['quantity','cow-eating-grass']]){for(const tabId of ['knowledge','example','真题示例']){const before=oldBody[subjectId].points.find(p=>p.id===pointId)?.tabs.find(t=>t.id===tabId),after=body[subjectId].points.find(p=>p.id===pointId)?.tabs.find(t=>t.id===tabId);if(before&&after)sourceHashes[[subjectId,pointId,tabId].join('/')]=[core.sha256(JSON.stringify(before)),core.sha256(JSON.stringify(after))];}}
 for(const id of COVERAGE_CORRECT02_IDS){const before=previous.resources.find(q=>q.id===id),after=current.resources.find(q=>q.id===id);if(core.digest(coverageCorrectionNormalized(before,entityIds,sourceHashes))!==core.digest(coverageCorrectionNormalized(after,entityIds,sourceHashes)))throw Error('纠错后练习发生实质变化，不能继承旧轮次：'+id);entries[id]={previousRuntimeSignature:core.runtimeSignature(before),currentRuntimeSignature:core.runtimeSignature(after)};}
 return{migrationId:m.batchId,entries};
}
function build(root,pack,body){const work=workSourceEntries(root,pack,body),logic=logicCorrectionEntries(root,pack,body),logic2=logicCorrection2Entries(root,pack,body),verbal=verbalCorrectionEntries(root,pack,body),coverage=coverageCorrectionEntries(root,pack,body);return{schemaVersion:1,migrationId:'NOTE-G0-SOURCE-01',evidenceBatches:[work.migrationId,logic.migrationId,logic2.migrationId,verbal.migrationId,coverage.migrationId].filter(Boolean),entries:{...work.entries,...logic.entries,...logic2.entries,...verbal.entries,...coverage.entries}};}
function output(root,pack,body){return '// Generated exact source-only exercise compatibility. Historical results are not rewritten.\nmodule.exports='+JSON.stringify(build(root,pack,body))+';\n';}
module.exports={IDS,LOGIC_IDS,LOGIC_CORRECT02_IDS,VERBAL_IDS,COVERAGE_CORRECT02_IDS,normalized,logicNormalized,verbalNormalized,logicCorrection2Entries,coverageCorrectionNormalized,coverageCorrectionEntries,build,output};
