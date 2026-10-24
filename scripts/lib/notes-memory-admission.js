const fs=require('fs'),path=require('path');
const {digest}=require('../../miniprogram/subpackages/note/services/learning-semantic');
const policy=require('../../miniprogram/subpackages/note/services/memory-admission');
const {hash}=require('../../miniprogram/subpackages/note/services/memory-reference');
const {learningSignature,VERSION}=require('../../miniprogram/subpackages/note/services/memory-semantic');
const {createContext,validateClosure,validateLedger}=require('./notes-memory-expansion-v2');
const clone=value=>JSON.parse(JSON.stringify(value));
const FILES={registry:'docs/knowledge-platform/content/notes/memory-v5-registry.json',reviews:'docs/knowledge-platform/content/notes/memory-v5-reviews.json',enablement:'docs/knowledge-platform/content/notes/memory-v5-enablement.json',compatibility:'docs/knowledge-platform/content/notes/memory-v5-version-compatibility.json'};
function read(root,rel){return JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));}
function compatibilityOutput(root){
 const frozen=read(root,FILES.compatibility),seen=new Set(),output={};
 if(digest(frozen)!=='a597424f54a6151b157e90d18a105e6add7c0551ba3feee9db68e263232b3dbc')throw Error('不可重建旧学习版本兼容基线');
 if(frozen.schemaVersion!==1||frozen.learningVersion!==VERSION||frozen.baselineCommit!=='e42af05dfd7a9d52279c7c2dc5403061abfff709'||frozen.cards.length!==8)throw Error('兼容基线无效');
 for(const row of frozen.cards){
  const card=row.card;
  if(seen.has(card.id)||card.sampleOnly!==true||card.status!=='preview-pending'||row.learningSemanticDigest!==learningSignature(card,row.projectedBlocks)||row.legacySemanticVersion!==hash({revision:card.revision,title:card.title,prompt:card.prompt,kind:card.kind,subjectId:card.subjectId,categoryId:card.categoryId,refs:card.refs}))throw Error('兼容身份与冻结知识不一致');
  seen.add(card.id);output[card.id]={learningSemanticDigest:row.learningSemanticDigest,semanticVersion:row.legacySemanticVersion};
 }
 return '// Frozen pre-G0 sample identities; generated from the compatibility source.\nmodule.exports='+JSON.stringify(output)+';\n';
}
function loadInputs(root){
 const context=createContext(root);validateClosure(context);
 require('./notes-memory-sample-source').validateSamples(root,context.samples,context.body,read(root,FILES.compatibility).cards.map(r=>r.card));
 const registry=read(root,FILES.registry),reviewLedger=read(root,FILES.reviews),enablementLedger=read(root,FILES.enablement),cards=[];
 if(registry.schemaVersion!==1||!Array.isArray(registry.ledgers)||!registry.ledgers.length||new Set(registry.ledgers).size!==registry.ledgers.length||!Array.isArray(registry.registrations)||reviewLedger.schemaVersion!==1||!Array.isArray(reviewLedger.reviews)||enablementLedger.schemaVersion!==1||!Array.isArray(enablementLedger.enablements))throw Error('记忆卡注册／审核／启用账格式无效');
 for(const rel of registry.ledgers){
  if(!/^docs\/knowledge-platform\/content\/notes\/[\w-]+\.json$/.test(rel)||!fs.realpathSync(path.join(root,rel)).startsWith(fs.realpathSync(root)+path.sep))throw Error('未授权的目标台账路径');
  const ledger=read(root,rel);validateLedger(context,ledger);cards.push(...ledger.cards);
 }
 if(new Set(cards.map(c=>c.id)).size!==cards.length||new Set(cards.map(c=>c.targetId)).size!==cards.length)throw Error('不同台账存在重复卡片或目标身份');
 for(const record of registry.registrations)if(!cards.some(c=>c.id===record.cardId))throw Error('注册未对应已登记目标');
 for(const receipt of reviewLedger.reviews){
  if(!/^[a-f0-9]{64}$/.test(receipt.binding?.reviewBundleDigest||''))throw Error('审核缺少不可变对照包');
  const rel=policy.reviewBundlePath(receipt.binding),file=path.join(root,rel);
  if(!fs.existsSync(file))throw Error('审核缺少不可变对照包');
  const frozen=read(root,rel);
  if(digest(frozen.bundle)!==receipt.binding.reviewBundleDigest||digest(frozen.binding)!==digest(receipt.binding))throw Error('审核对照包绑定不一致');
 }
 return {root,context,registry,reviewLedger,enablementLedger,cards};
}
function enrollmentFor(inputs){
 const ids=new Set(inputs.registry.registrations.map(r=>r.cardId));
 return {schemaVersion:1,ruleVersion:policy.RULE_VERSION,ruleDigest:policy.RULE_DIGEST,cards:clone(inputs.cards.filter(c=>ids.has(c.id))),registrations:clone(inputs.registry.registrations),reviews:clone(inputs.reviewLedger.reviews),enablements:clone(inputs.enablementLedger.enablements)};
}
function register(inputs,{cardId,registrationTaskId,registeredAt}){
 const card=inputs.cards.find(c=>c.id===cardId);if(!card)throw Error('卡片不在登记的目标台账中');
 const binding=policy.bindingFor(card,inputs.context.body),heads=policy.heads(inputs.registry.registrations,'registrationId','supersedesRegistrationId','resolvesRegistrationIds').get(cardId)||[];
 if(heads.length>1||inputs.registry.registrations.some(r=>r.cardId===cardId)&&heads.length!==1)throw Error('先消解注册冲突');
 if(heads.length===1&&digest(heads[0].binding)===digest(binding))throw Error('相同目标版本已经注册');
 const record={schemaVersion:1,registrationId:`memory-registration-${cardId}-r${card.revision}-${digest(binding).slice(0,12)}`,cardId,binding,registrationTaskId,registeredAt,supersedesRegistrationId:heads[0]?.registrationId||null};
 if(!policy.validRegistration(record,binding))throw Error('注册任务／时间或精确绑定无效');
 const registry=clone(inputs.registry);registry.registrations.push(record);return registry;
}
function reviewPacket(inputs,enrollment=enrollmentFor(inputs)){
 const registrations=policy.heads(enrollment.registrations,'registrationId','supersedesRegistrationId','resolvesRegistrationIds'),cards=[],excluded=[];
 for(const raw of enrollment.cards){
  try{
   const binding=policy.bindingFor(raw,inputs.context.body),heads=registrations.get(raw.id)||[],registration=heads.length===1?heads[0]:null;
   if(!policy.validRegistration(registration,binding))throw Error('缺少当前精确注册或注册冲突');
   cards.push({cardId:raw.id,registrationId:registration.registrationId,binding,bundle:policy.reviewBundle(raw,inputs.context.body),bundlePath:policy.reviewBundlePath(binding),acceptance:'not-created'});
  }catch(error){excluded.push({cardId:raw.id,reason:error.message});}
 }
 return {schemaVersion:1,date:inputs.registry.date,ruleVersion:policy.RULE_VERSION,ruleDigest:policy.RULE_DIGEST,scope:'Frozen exact candidate/source/projection comparison; not an independent acceptance or runtime source',cards,excluded,formalApprovalCreated:false};
}
function persistReviewPacket(root,packet,checkOnly){
 for(const entry of packet.cards){
  if(digest(entry.bundle)!==entry.binding.reviewBundleDigest||entry.bundlePath!==policy.reviewBundlePath(entry.binding))throw Error('对照包内容身份不一致');
  const file=path.join(root,entry.bundlePath),output=JSON.stringify({schemaVersion:1,binding:entry.binding,bundle:entry.bundle,acceptance:'not-created'},null,2)+'\n';
  if(fs.existsSync(file)){if(fs.readFileSync(file,'utf8')!==output)throw Error('不可覆盖不可变对照包');}
  else if(checkOnly)throw Error('缺少冻结候选对照包');
  else{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,output,{flag:'wx'});}
 }
}
function appendDecision(inputs,receipt){
 if(inputs.reviewLedger.reviews.some(r=>r.decisionId===receipt.decisionId))throw Error('审核记录已存在，不能覆盖');
 const card=inputs.cards.find(c=>c.id===receipt.cardId);if(!card)throw Error('缺少对应目标');
 const binding=policy.bindingFor(card,inputs.context.body),registrations=policy.heads(inputs.registry.registrations,'registrationId','supersedesRegistrationId','resolvesRegistrationIds').get(card.id)||[];
 const registration=registrations.length===1?registrations[0]:null;
 if(!policy.validRegistration(registration,binding)||!policy.validReview(receipt,binding,registration))throw Error('独立审核身份、证据或精确绑定无效');
 const ledger=clone(inputs.reviewLedger);ledger.reviews.push(clone(receipt));
 const heads=policy.heads(ledger.reviews,'decisionId','supersedesDecisionId','resolvesDecisionIds').get(card.id)||[];
 if(heads.length!==1||heads[0].decisionId!==receipt.decisionId)throw Error('审核记录必须显式接替或消解旧记录');
 return ledger;
}
function appendEnablement(inputs,authorization){
 if(inputs.enablementLedger.enablements.some(r=>r.authorizationId===authorization.authorizationId))throw Error('启用记录已存在，不能覆盖');
 const card=inputs.cards.find(c=>c.id===authorization.cardId);if(!card)throw Error('缺少对应目标');
 const binding=policy.bindingFor(card,inputs.context.body),registrations=policy.heads(inputs.registry.registrations,'registrationId','supersedesRegistrationId','resolvesRegistrationIds').get(card.id)||[],reviews=policy.heads(inputs.reviewLedger.reviews,'decisionId','supersedesDecisionId','resolvesDecisionIds').get(card.id)||[];
 const registration=registrations.length===1?registrations[0]:null,receipt=reviews.length===1?reviews[0]:null;
 if(typeof authorization.enabled!=='boolean'||!policy.validRegistration(registration,binding)||!policy.validReview(receipt,binding,registration)||receipt.decision!=='accept'||!policy.validEnablement({...authorization,enabled:true},binding,registration,receipt))throw Error('启用授权或当前精确接受回执无效');
 const ledger=clone(inputs.enablementLedger);ledger.enablements.push(clone(authorization));
 const heads=policy.heads(ledger.enablements,'authorizationId','supersedesAuthorizationId','resolvesAuthorizationIds').get(card.id)||[];
 if(heads.length!==1||heads[0].authorizationId!==authorization.authorizationId)throw Error('启用记录必须显式接替或消解旧记录');
 return ledger;
}
module.exports={FILES,compatibilityOutput,loadInputs,enrollmentFor,register,reviewPacket,persistReviewPacket,appendDecision,appendEnablement};
