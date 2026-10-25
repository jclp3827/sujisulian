// Build-time equivalence proof for four existing exercises; never invents admission.
const path=require('path');
const core=require('../../miniprogram/subpackages/note/services/learning-semantic');
const {availableContent}=require('../../miniprogram/subpackages/note/services/learning-content');
const source=require('./notes-memory-sample-source');
const IDS=['notes-q-nq3-quantity-application-cooperation','notes-q-nq3-quantity-application-efficiency','notes-q-nq3-quantity-basic-efficiency','notes-q-nq3-quantity-method-stage-trial'];
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
function build(root,pack,body){
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
 return{schemaVersion:1,migrationId:m.batchId,entries};
}
function output(root,pack,body){return '// Generated exact source-only exercise compatibility. Historical results are not rewritten.\nmodule.exports='+JSON.stringify(build(root,pack,body))+';\n';}
module.exports={IDS,normalized,build,output};
