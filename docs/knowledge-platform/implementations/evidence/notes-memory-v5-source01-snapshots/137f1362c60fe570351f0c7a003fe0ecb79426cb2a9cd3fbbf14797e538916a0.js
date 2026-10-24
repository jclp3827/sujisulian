// Shared by the offline compiler and runtime. No content or user-state authority lives here.
const RULE_VERSION = 'exam-goal-v4';
const SIGNATURE_VERSION = 'notes-semantic-v1';
function canonical(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (Object.keys(value).length !== value.length || !Array.from({length:value.length},(_,i)=>Object.prototype.hasOwnProperty.call(value,i)).every(Boolean)) throw Error('摘要数组不完整');
    return '[' + value.map(canonical).join(',') + ']';
  }
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype)
    return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
  throw Error('摘要包含不支持的值');
}
function sha256(text) {
  const bytes=[];
  for(let i=0;i<text.length;i++) {
    let c=text.charCodeAt(i);
    if(c>=0xd800&&c<=0xdbff&&i+1<text.length){const d=text.charCodeAt(i+1);if(d>=0xdc00&&d<=0xdfff){c=0x10000+((c-0xd800)<<10)+(d-0xdc00);i++;}}
    if(c>=0xd800&&c<=0xdfff)c=0xfffd;
    if(c<128)bytes.push(c);else if(c<2048)bytes.push(192|(c>>6),128|(c&63));else if(c<65536)bytes.push(224|(c>>12),128|((c>>6)&63),128|(c&63));else bytes.push(240|(c>>18),128|((c>>12)&63),128|((c>>6)&63),128|(c&63));
  }
  const bitLength=bytes.length*8;bytes.push(128);while(bytes.length%64!==56)bytes.push(0);
  const hi=Math.floor(bitLength/4294967296),lo=bitLength>>>0;
  for(let i=3;i>=0;i--)bytes.push((hi>>>(i*8))&255);for(let i=3;i>=0;i--)bytes.push((lo>>>(i*8))&255);
  const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],r=(n,x)=>(x>>>n)|(x<<(32-n));
  for(let off=0;off<bytes.length;off+=64){const w=[];for(let i=0;i<16;i++)w[i]=(bytes[off+i*4]<<24)|(bytes[off+i*4+1]<<16)|(bytes[off+i*4+2]<<8)|bytes[off+i*4+3];for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(r(7,a)^r(18,a)^(a>>>3))+w[i-7]+(r(17,b)^r(19,b)^(b>>>10)))|0;}
    let [a,b,c,d,e,f,g,z]=h;for(let i=0;i<64;i++){const t1=(z+(r(6,e)^r(11,e)^r(25,e))+((e&f)^(~e&g))+k[i]+w[i])|0,t2=((r(2,a)^r(13,a)^r(22,a))+((a&b)^(a&c)^(b&c)))|0;z=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}[a,b,c,d,e,f,g,z].forEach((v,i)=>{h[i]=(h[i]+v)|0;});
  }
  return h.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');
}
const digest = v => sha256(canonical(v));
const present = v => typeof v === 'string' && v.trim().length > 0;
const same = (a,b) => canonical(a) === canonical(b);
function pick(item,keys){return Object.fromEntries(keys.filter(k=>item[k]!==undefined).map(k=>[k,item[k]]));}
function refsOf(item){return (item.refs||[]).map(r=>pick(r,['subjectId','pointId','tabId','expectedSha256'])).sort((a,b)=>(canonical(a)<canonical(b)?-1:canonical(a)>canonical(b)?1:0));}
function substantive(item){const v={...item};for(const k of ['status','approval','reviewVerified','navigationLabel','auditNote','auditTimestamp'])delete v[k];if(v.refs)v.refs=refsOf(item);if(v.sourceAnchors)v.sourceAnchors=v.sourceAnchors.map(a=>pick(a,['subjectId','pointId','tabId','blockIndex','expectedBlockSha256']));return v;}
function effectiveQuestion(q){return pick(q,['id','revision','subjectId','categoryId','exerciseKinds','assessment','primaryTargetIds','supportingTargetIds','prompt','options','answerMode','answer','explanation','contextLines','images','materialId','origin','originTask','originAdaptation','sourceKind','declaredOriginalSource','familyId','exposureGroupId','distractorReasons','signal','boundary','methodIntent','sharedSourceBindingIds']);}
function sourceAt(body,ref){const p=body.getNotePoint?body.getNotePoint(ref.subjectId,ref.pointId):body[ref.subjectId]?.points.find(p=>p.id===ref.pointId);return p?.tabs.find(t=>t.id===ref.tabId);}
function targetComplete(t){return ['examTaskUse','recallTarget','expectedAnswerCore','likelyConfusionOrForgetting','taskActionRationale'].every(k=>present(t[k]))&&t.sourceBindings?.length>0&&t.knowledgeRelationEvidence&&t.sourceProvenance;}
function manifestFor(q,pack,body,context){
  const find=(list,id)=>{const item=(pack[list]||[]).find(x=>x.id===id);if(!item)throw Error('缺少依赖 '+id);return item;};
  const primary=(q.primaryTargetIds||[]).map(id=>find('targets',id)),supporting=(q.supportingTargetIds||[]).map(id=>find('targets',id));
  if(!primary.length||![...primary,...supporting].every(targetComplete))throw Error('缺少V4考试目标卡');
  if (![...primary,...supporting].every(t=>t.sourceBindings.every(b=>t.refs.some(r=>r.subjectId===b.subjectId&&r.pointId===b.pointId&&r.tabId===b.tabId&&r.expectedSha256===b.expectedSha256))))throw Error('目标来源绑定不对应');
  if(q.assessment?.testsMnemonic&&!primary.some(t=>Array.isArray(t.mnemonicMap)&&t.mnemonicMap.length&&typeof t.mnemonicBoundary==='string'&&t.mnemonicBoundary.trim()))throw Error('口诀含义映射或边界缺失');
  const atoms=(q.assessment?.knowledgeAtomIds||[]).map(id=>find('knowledgeAtoms',id));
  const comparison=q.assessment?.comparisonGroupId?find('comparisonGroups',q.assessment.comparisonGroupId):null;
  const groupAtoms=comparison?comparison.knowledgeAtomIds.map(id=>find('knowledgeAtoms',id)):[];
  const material=q.materialId?find('materials',q.materialId):null;
  const siblings=material?material.questionIds.map(id=>find('questions',id)):[];
  const items=[q,...primary,...supporting,...atoms,...groupAtoms,...(comparison?[comparison]:[]),...(material?[material]:[]),...siblings];
  const shared=[...new Set(items.flatMap(item=>item.sharedSourceBindingIds||[]))].map(id=>{const b=find('sharedSourceBindings',id);if(!bindingAllowed(b,pack,body))throw Error('共享来源关系无效');return b;});
  const refs=[...new Map(items.flatMap(i=>i.refs||[]).map(r=>[canonical(refsOf({refs:[r]})[0]),r])).values()];
  const sources=refs.map(ref=>{const tab=sourceAt(body,ref);if(!tab||sourceDigestFor(tab,ref,context)!==ref.expectedSha256)throw Error('来源摘要已变更');return {...pick(ref,['subjectId','pointId','tabId']),revision:null,sha256:ref.expectedSha256};}).sort((a,b)=>(canonical(a)<canonical(b)?-1:canonical(a)>canonical(b)?1:0));
  const anchors=[...atoms,...groupAtoms].flatMap(a=>a.sourceAnchors||[]).map(a=>{const block=sourceAt(body,a)?.blocks[a.blockIndex];if(!block||blockDigestFor(block,a,context)!==a.expectedBlockSha256)throw Error('来源锚点已变更');return {...pick(a,['subjectId','pointId','tabId','blockIndex']),revision:null,sha256:a.expectedBlockSha256};});
  const images=[...(q.images||[]),...(material?.images||[]),...siblings.flatMap(s=>s.images||[])].map(i=>{const h=pack.semanticAssets?.[i.src];if(!/^[a-f0-9]{64}$/.test(h||''))throw Error('图片字节摘要待核');return {src:i.src,revision:null,sha256:h};});
  const entity=e=>({id:e.id,revision:e.revision,sha256:digest(substantive(e))});
  return {primaryTargets:primary.map(entity),supportingTargets:supporting.map(entity),knowledgeAtoms:[...new Map([...atoms,...groupAtoms].map(a=>[a.id,a])).values()].map(entity),comparisonGroups:comparison?[entity(comparison)]:[],sourceBindings:sources,sourceAnchors:anchors,originalExample:q.origin?{...pick(q.origin,['subjectId','pointId','tabId','expectedBlockSha256']),revision:null}:null,materialGroup:material?{...entity(material),questions:siblings.map(s=>({id:s.id,revision:s.revision,sha256:digest(effectiveQuestion(s))}))}:null,images,sharedSourceBindings:shared.map(s=>({id:s.id,revision:s.revision,sha256:digest(pick(s,['id','revision','primaryExamModuleId','primaryCategoryId','sourceSubjectId','sourcePointId','sourceTabId','allowedTargetIds','evidenceRefs','sourceDigest']))}))};
}
function bindingFor(q,pack,body,context){const manifest=manifestFor(q,pack,body,context);return {questionBinding:{questionId:q.id,questionRevision:q.revision,effectiveContentDigest:digest(effectiveQuestion(q))},resolvedDependencyManifest:manifest,dependencyDigest:digest(manifest)};}
function reviewHeads(receipts){
 const byId=new Map(),parents=new Set(),groups=new Map();
 for(const r of receipts||[]){if(!present(r.receiptId)||byId.has(r.receiptId)||!r.questionBinding?.questionId)throw Error('语义回执身份无效');byId.set(r.receiptId,r);}
 const links=r=>[...(r.supersedesReceiptId===null?[]:[r.supersedesReceiptId]),...(r.resolvesReceiptIds||[])];
 for(const r of byId.values()){
  if(r.resolvesReceiptIds&&(!Array.isArray(r.resolvesReceiptIds)||r.supersedesReceiptId===null||new Set(links(r)).size!==links(r).length))throw Error('回执冲突消解无效');
  for(const id of links(r)){const p=byId.get(id);if(!p||p.questionBinding.questionId!==r.questionBinding.questionId)throw Error('回执接替链无效');parents.add(p.receiptId);}
  const walk=(n,seen)=>{if(seen.has(n.receiptId))throw Error('回执接替循环');const next=new Set(seen);next.add(n.receiptId);for(const id of links(n)){const p=byId.get(id);if(!p)throw Error('回执接替链无效');walk(p,next);}};walk(r,new Set());
 }
 for(const r of byId.values())if(!parents.has(r.receiptId)){const id=r.questionBinding.questionId;groups.set(id,[...(groups.get(id)||[]),r]);}
 return groups;
}
function receiptValid(r,q,binding,policy,targets=[]){
 if(!r||r.schemaVersion!==1||r.ruleVersion!==RULE_VERSION||r.ruleDigest!==policy.ruleDigest||!same(r.questionBinding,binding.questionBinding)||r.dependencyDigest!==binding.dependencyDigest||!same(r.resolvedDependencyManifest,binding.resolvedDependencyManifest))return false;
 if(!present(r.reviewer?.id)||!['human','agent'].includes(r.reviewer.kind)||!present(r.reviewer.role)||!['all-five-modules',q.subjectId,`${q.subjectId}/${q.categoryId}`].includes(r.reviewer.scope)||!present(r.authorId)||r.authorId===r.reviewer.id||!/T.*(?:Z|[+-]\d\d:\d\d)$/.test(r.reviewedAt||'')||!Number.isFinite(Date.parse(r.reviewedAt)))return false;
 if(!present(r.decisionReason)||!Array.isArray(r.evidenceRefs)||!r.evidenceRefs.length||r.targetAndActualTestMatch!==true||r.answerAndConditionsVerified!==true||r.sourceSemanticsVerified!==true)return false;
 if(!q.options.filter(o=>o.key!==q.answer).every(o=>present(r.distractorMisconceptionPerOption?.[o.key])))return false;
 if(!Array.isArray(r.ruleResults)||r.ruleResults.length!==10||new Set(r.ruleResults.map(x=>x.ruleId)).size!==10)return false;
 const mnemonic=!!q.assessment?.testsMnemonic||targets.some(t=>t.mnemonicMap?.length);
 return policy.definition.rules.every(rule=>{const check=r.ruleResults.find(c=>c.ruleId===rule.id);return check&&present(check.evidence)&&present(check.reason)&&(rule.id==='EXAM-08'&&!mnemonic?['not-applicable','pass'].includes(check.result):check.result==='pass');});
}
function validatePolicy(policy){return policy?.ruleVersion===RULE_VERSION&&policy.signatureVersion===SIGNATURE_VERSION&&policy.definition?.ruleVersion===RULE_VERSION&&policy.definition.rules?.length===10&&digest(policy.definition)===policy.ruleDigest;}
function sourceDigestFor(tab,ref,context){
 const key=JSON.stringify([ref.subjectId,ref.pointId,ref.tabId]);
 if(context?.sourceHashes.has(key))return context.sourceHashes.get(key);
 const value=sha256(JSON.stringify(tab));if(context)context.sourceHashes.set(key,value);return value;
}
function blockDigestFor(block,anchor,context){
 const key=JSON.stringify([anchor.subjectId,anchor.pointId,anchor.tabId,anchor.blockIndex]);
 if(context?.blockHashes.has(key))return context.blockHashes.get(key);
 const value=sha256(JSON.stringify(block));if(context)context.blockHashes.set(key,value);return value;
}
function createContext(pack,body){return {pack,body,policyValid:validatePolicy(pack.semanticPolicy),sourceHashes:new Map(),blockHashes:new Map(),admissions:new WeakMap()};}
function semanticAdmission(q,pack,body,heads,context){
 const current=context?.pack===pack&&context?.body===body?context:null;
 if(current?.admissions.has(q))return current.admissions.get(q);
 let result=null;
 try{
  const withdrawn=(pack.semanticWithdrawals||[]).some(w=>w.questionId===q.id&&w.questionRevision===q.revision&&w.effectiveContentDigest===digest(effectiveQuestion(q)));
  const group=heads.get(q.id)||[];
  if(!withdrawn&&group.length===1&&(current?current.policyValid:validatePolicy(pack.semanticPolicy))){
   const r=group[0];if(r.examFitDecision==='accept-candidate'){
    const b=bindingFor(q,pack,body,current);
    if(receiptValid(r,q,b,pack.semanticPolicy,[...q.primaryTargetIds,...(q.supportingTargetIds||[])].map(id=>pack.targets.find(t=>t.id===id))))result={...b,ruleVersion:RULE_VERSION,ruleDigest:pack.semanticPolicy.ruleDigest,receiptId:r.receiptId,signatureVersion:SIGNATURE_VERSION,signature:digest({question:b.questionBinding,dependencies:b.dependencyDigest,rule:pack.semanticPolicy.ruleDigest})};
   }
  }
 }catch(_){result=null;}
 if(current)current.admissions.set(q,result);return result;
}
function runtimeSignature(r){return digest({question:effectiveQuestion(r),targets:(r.resolvedTargets||[]).map(substantive),knowledge:(r.knowledgeAtoms||[]).map(substantive),comparison:r.comparison?substantive(r.comparison):null,manifest:r.semanticAdmission.resolvedDependencyManifest,rule:r.semanticAdmission.ruleDigest});}
module.exports={RULE_VERSION,SIGNATURE_VERSION,canonical,sha256,digest,substantive,effectiveQuestion,targetComplete,bindingFor,reviewHeads,receiptValid,validatePolicy,semanticAdmission,runtimeSignature,createContext};
// Shared source identity is explicit; subject names are never rewritten to bypass provenance.
function sharedBindingDigest(b){return digest(pick(b,['id','revision','primaryExamModuleId','primaryCategoryId','sourceSubjectId','sourcePointId','sourceTabId','allowedTargetIds','evidenceRefs','sourceDigest']));}
function bindingAllowed(binding,pack,body,development){
 try{
  if(!binding||!Number.isInteger(binding.revision)||binding.revision<1||binding.status==='blocked'||sharedBindingDigest(binding)!==binding.bindingDigest||!Array.isArray(binding.allowedTargetIds)||!binding.allowedTargetIds.length||new Set(binding.allowedTargetIds).size!==binding.allowedTargetIds.length||!binding.allowedTargetIds.every(id=>pack.targets?.some(t=>t.id===id&&t.subjectId===binding.primaryExamModuleId&&t.categoryId===binding.primaryCategoryId))||!binding.evidenceRefs?.length)return false;
  const ref={subjectId:binding.sourceSubjectId,pointId:binding.sourcePointId,tabId:binding.sourceTabId},tab=sourceAt(body,ref);
  if(!tab||sha256(JSON.stringify(tab))!==binding.sourceDigest)return false;
  const reviews=(pack.sourceBindingReviews||[]).filter(r=>r.bindingId===binding.id);
  const heads=reviewHeads(reviews.map(r=>({...r,questionBinding:{questionId:r.bindingId}}))).get(binding.id)||[];
  if(heads.length!==1)return false;const r=heads[0];
  if(r.receiptId!==binding.reviewReceiptId||r.bindingRevision!==binding.revision||r.bindingDigest!==binding.bindingDigest||r.sourceDigest!==binding.sourceDigest||r.ruleVersion!==RULE_VERSION||r.ruleDigest!==pack.semanticPolicy.ruleDigest||r.decision!=='accept-shared-source'||!present(r.reason)||!r.evidenceRefs?.length||!present(r.reviewer?.id)||!['human','agent'].includes(r.reviewer.kind)||r.reviewer.scope!==binding.primaryExamModuleId||!present(r.reviewer.role)||!/T.*(?:Z|[+-]\d\d:\d\d)$/.test(r.reviewedAt||'')||!Number.isFinite(Date.parse(r.reviewedAt)))return false;
  if(development===false)return binding.status==='approved'&&present(binding.approval?.reviewer)&&/^\d{4}-\d{2}-\d{2}$/.test(binding.approval.reviewedAt||'')&&binding.approval.digest===binding.bindingDigest;
  return ['review','approved'].includes(binding.status);
 }catch(_){return false;}
}
function sourceAllowed(item,ref,pack,body,development){
 if(item.subjectId===ref.subjectId)return true;
 return (item.sharedSourceBindingIds||[]).some(id=>{const b=(pack.sharedSourceBindings||[]).find(b=>b.id===id);if(!bindingAllowed(b,pack,body,development)||b.primaryExamModuleId!==item.subjectId||b.primaryCategoryId!==item.categoryId||b.sourceSubjectId!==ref.subjectId||b.sourcePointId!==ref.pointId||b.sourceTabId!==ref.tabId)return false;
  const targetIds=item.primaryTargetIds?[...item.primaryTargetIds,...(item.supportingTargetIds||[])].filter(id=>pack.targets?.find(t=>t.id===id)?.refs.some(r=>r.subjectId===ref.subjectId&&r.pointId===ref.pointId&&r.tabId===ref.tabId)):pack.targets?.some(t=>t.id===item.id)?[item.id]:[];
  return (!item.primaryTargetIds||targetIds.length>0)&&targetIds.every(target=>b.allowedTargetIds.includes(target));
 });
}
module.exports.sharedBindingDigest=sharedBindingDigest;
module.exports.bindingAllowed=bindingAllowed;
module.exports.sourceAllowed=sourceAllowed;
