// Shared compiler/runtime policy. This module never creates review decisions or enablement.
const {digest,reviewHeads}=require('./learning-semantic');
const {resolveCard}=require('./memory-reference');
const reservedIds=require('../models/memory-version-compatibility');
const RULE_VERSION='notes-memory-admission-v1';
const CHECKS=['examGoal','knowledgeAndConditions','scopeAndContrast','sourceAndFormula','imagesAndContext','addedPrompt','duplication'];
const DEFINITION={ruleVersion:RULE_VERSION,checks:CHECKS,registration:'exact authoring snapshot; single source; no unresolved local hold',review:'independent exact-version decision with explicit supersession; conflicts fail closed',enablement:'separate exact-decision user/release-manager authorization; revocation fails closed',learning:'notes-memory-learning-v1; immutable pre-G0 aliases only'};
const RULE_DIGEST=digest(DEFINITION),clone=value=>JSON.parse(JSON.stringify(value));
const present=value=>typeof value==='string'&&!!value.trim();
const date=value=>present(value)&&/T.*(?:Z|[+-]\d\d:\d\d)$/.test(value)&&Number.isFinite(Date.parse(value));
const same=(a,b)=>digest(a)===digest(b);
function validateDraft(card,body){
 if(!card||!present(card.id)||Object.prototype.hasOwnProperty.call(reservedIds,card.id)||!present(card.targetId)||!Number.isInteger(card.revision)||card.revision<1||card.status!=='draft'||card.sampleOnly!==false||card.formalApproved!==false||card.admission!=='not-enrolled'||card.semanticReview!=='not-independently-approved')throw Error('不是有效的未准入目标');
 if(!['basic','method'].includes(card.kind)||card.subjectId==='graphic'&&card.kind!=='method'||!['authorId','title','prompt','recallGoal','contextRationale','classificationReason'].every(k=>present(card[k])))throw Error('目标、板块或作者信息不完整');
 if(card.localHold)throw Error('目标仍有未决hold');
 const codes={'data-analysis':'da',quantity:'qu',logic:'lo',verbal:'ve',graphic:'gr'},ref=card.refs?.[0];
 if(!ref||card.refs.length!==1||ref.subjectId!==card.subjectId||ref.pointId!==card.pointId||ref.tabId!=='knowledge'||!codes[card.subjectId]||card.workUnitIds?.length!==1||card.workUnitIds[0]!==`memory-expansion-${codes[card.subjectId]}-${ref.subjectId}-${ref.pointId}`)throw Error('本期只允许身份精确的单来源目标');
 const point=body.getNotePoint?body.getNotePoint(ref.subjectId,ref.pointId):body[ref.subjectId]?.points.find(p=>p.id===ref.pointId);
 if(!point||point.categoryId!==card.categoryId)throw Error('目标分类与原来源不匹配');
 const resolved=resolveCard(card,body);
 if(resolved.blocks.some(b=>['example','practice'].includes(b.type)))throw Error('记忆卡不能混入应用题');
 return resolved;
}
function reviewBundle(card,body){
 const resolved=validateDraft(card,body);
 const originals=card.refs.map(ref=>{const point=body.getNotePoint?body.getNotePoint(ref.subjectId,ref.pointId):body[ref.subjectId].points.find(p=>p.id===ref.pointId);const tab=point.tabs.find(t=>t.id===ref.tabId);return {ref,originalBlocks:ref.blocks.map(selection=>tab.blocks[selection.blockIndex])};});
 return {card:clone(card),projectedBlocks:resolved.blocks,originals};
}
function bindingFor(card,body){
 const resolved=validateDraft(card,body);
 return {ruleVersion:RULE_VERSION,ruleDigest:RULE_DIGEST,cardId:card.id,targetId:card.targetId,revision:card.revision,authorTaskId:card.authorId,
  learningSemanticDigest:resolved.learningSemanticDigest,sourceSnapshotDigest:resolved.sourceSnapshotDigest,cardSnapshotDigest:digest(card),reviewBundleDigest:digest(reviewBundle(card,body))};
}
function heads(records,idKey,parentKey,resolveKey){
 const groups=new Map(),counts=new Map(),result=new Map();
 for(const record of records){if(!record||!present(record.cardId))throw Error('记录缺少卡片身份');groups.set(record.cardId,[...(groups.get(record.cardId)||[]),record]);counts.set(record[idKey],(counts.get(record[idKey])||0)+1);}
 for(const [cardId,rows] of groups){
  try{
   if(rows.some(r=>!present(r[idKey])||counts.get(r[idKey])!==1))throw Error('记录身份冲突');
   const normalized=rows.map(r=>({...r,receiptId:r[idKey],supersedesReceiptId:r[parentKey],...(r[resolveKey]===undefined?{}:{resolvesReceiptIds:r[resolveKey]}),questionBinding:{questionId:cardId}}));
   const list=reviewHeads(normalized).get(cardId)||[];
   result.set(cardId,list.map(r=>rows.find(old=>old[idKey]===r.receiptId)));
  }catch(_){result.set(cardId,[]);}
 }
 return result;
}
function only(map,id){const rows=map.get(id);return rows?.length===1?rows[0]:null;}
function validRegistration(registration,binding){
 return registration?.schemaVersion===1&&present(registration.registrationId)&&registration.cardId===binding.cardId&&present(registration.registrationTaskId)&&date(registration.registeredAt)&&same(registration.binding,binding);
}
function reviewBundlePath(binding){return 'docs/knowledge-platform/implementations/evidence/notes-memory-v5-candidate-bundles/'+binding.reviewBundleDigest+'.json';}
function validReview(receipt,binding,registration){
 if(!receipt||receipt.schemaVersion!==1||receipt.registrationId!==registration.registrationId||!same(receipt.binding,binding)||!['accept','revise','reject','hold'].includes(receipt.decision)||!present(receipt.reason)||!date(receipt.reviewedAt)||!Array.isArray(receipt.evidenceRefs)||!receipt.evidenceRefs.includes(reviewBundlePath(binding))||!receipt.evidenceRefs.every(present)||!Array.isArray(receipt.issues))return false;
 const reviewer=receipt.reviewer;
 if(!reviewer||!['human','agent'].includes(reviewer.kind)||!present(reviewer.id)||!present(reviewer.taskId)||!present(reviewer.role)||reviewer.id===binding.authorTaskId||reviewer.taskId===binding.authorTaskId||receipt.authorTaskId!==binding.authorTaskId)return false;
 if(receipt.decision!=='accept')return true;
 if(receipt.issues.length||!Array.isArray(receipt.checks)||receipt.checks.length!==CHECKS.length||new Set(receipt.checks.map(c=>c.id)).size!==CHECKS.length)return false;
 return CHECKS.every(id=>receipt.checks.some(c=>c.id===id&&c.result==='pass'&&present(c.reason)&&Array.isArray(c.evidenceRefs)&&c.evidenceRefs.length&&c.evidenceRefs.every(present)));
}
function validEnablement(authorization,binding,registration,receipt){
 return authorization?.schemaVersion===1&&authorization.enabled===true&&authorization.registrationId===registration.registrationId&&authorization.decisionId===receipt.decisionId&&authorization.decisionDigest===digest(receipt)&&authorization.bindingDigest===digest(binding)&&date(authorization.authorizedAt)&&present(authorization.authority?.actorId)&&['user-instruction','release-manager'].includes(authorization.authority.kind)&&present(authorization.authority.evidenceRef);
}
function evaluateEnrollment(enrollment,body){
 const result={development:[],formal:[],excluded:[]};
 if(!enrollment)return result;
 if(enrollment.schemaVersion!==1||enrollment.ruleVersion!==RULE_VERSION||enrollment.ruleDigest!==RULE_DIGEST||!['cards','registrations','reviews','enablements'].every(k=>Array.isArray(enrollment[k])))return {...result,excluded:[{cardId:null,reason:'准入包规则或结构无效'}]};
 if(!enrollment.cards.every(c=>c&&typeof c==='object'&&present(c.id)))return {...result,excluded:[{cardId:null,reason:'候选内容结构无效'}]};
 let registrations,reviews,enablements;
 try{
  registrations=heads(enrollment.registrations,'registrationId','supersedesRegistrationId','resolvesRegistrationIds');
  reviews=heads(enrollment.reviews,'decisionId','supersedesDecisionId','resolvesDecisionIds');
  enablements=heads(enrollment.enablements,'authorizationId','supersedesAuthorizationId','resolvesAuthorizationIds');
 }catch(error){return {...result,excluded:[{cardId:null,reason:error.message}]};}
 const duplicates=new Set(enrollment.cards.filter((c,i,all)=>all.findIndex(other=>other.id===c.id)!==i).map(c=>c.id));
 for(const card of enrollment.cards){
  try{
   if(duplicates.has(card.id))throw Error('候选卡片身份重复');
   const binding=bindingFor(card,body),registration=only(registrations,card.id);
   if(!validRegistration(registration,binding))throw Error('缺少当前精确注册或注册冲突');
   const receipt=only(reviews,card.id),hasReview=reviews.has(card.id);
   if(hasReview&&(!validReview(receipt,binding,registration)||receipt.decision!=='accept'))throw Error('审核未接受、过期或冲突');
   const resolved=resolveCard(card,body),authorization=only(enablements,card.id);
   const formallyEnabled=!!receipt&&validEnablement(authorization,binding,registration,receipt);
   const current={...resolved,status:formallyEnabled?'approved':'preview-pending',sampleOnly:false,formalApproved:formallyEnabled,semanticReview:receipt?'accepted':'not-independently-approved',memoryAdmission:{registrationId:registration.registrationId,decisionId:receipt?.decisionId||null,authorizationId:formallyEnabled?authorization.authorizationId:null,binding}};
   result.development.push(current);
   if(formallyEnabled)result.formal.push(current);
  }catch(error){result.excluded.push({cardId:card?.id||null,reason:error.message});}
 }
 return result;
}
function eligibleCards(enrollment,body,development){const result=evaluateEnrollment(enrollment,body);return development?result.development:result.formal;}
module.exports={RULE_VERSION,RULE_DIGEST,DEFINITION,CHECKS,validateDraft,reviewBundle,bindingFor,heads,validRegistration,reviewBundlePath,validReview,validEnablement,evaluateEnrollment,eligibleCards};
