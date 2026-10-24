const fs = require('fs');
const {verifyG0}=require('./notes-memory-g0-gate');
const path = require('path');
const { loadBody } = require('./notes-learning-compiler');
const { hash, resolveCard } = require('../../miniprogram/subpackages/note/services/memory-content');
const ORDER = [['DA','data-analysis','资料分析'],['QU','quantity','数量关系'],['LO','logic','判断推理'],['VE','verbal','言语理解'],['GR','graphic','图形推理']];
const PATHS = {
  audit:'docs/knowledge-platform/content/notes/memory-v5-audit.json',
  scopes:'docs/knowledge-platform/implementations/notes-memory-v5-authoring-scopes-v2.json',
  samples:'docs/knowledge-platform/content/notes/memory-v5-samples.json',
  ledger:'docs/knowledge-platform/content/notes/memory-v5-da01-targets-v2.json',
  closure:'docs/knowledge-platform/implementations/evidence/notes-memory-v5-p3-definition-close-20261022.json',
  inventory:'docs/knowledge-platform/implementations/notes-learning-v1-inventory.json',
  queue:'docs/knowledge-platform/content/notes/exam-review-queue-v4.json',
  product:'docs/knowledge-platform/implementations/notes-memory-v5-product.md',
};
const clone = value => JSON.parse(JSON.stringify(value));
function requireThat(condition, message) { if (!condition) throw Error(message); }
const unique = values => new Set(values).size === values.length;
const sameSet = (a,b) => unique(a) && unique(b) && a.length === b.length && a.every(v=>b.includes(v));
const sourceKey = r => r.subjectId + ':' + r.pointId;
function createContext(root) {
  const read = rel => JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));
  const audit=read(PATHS.audit),body=loadBody(root),samples=read(PATHS.samples),units=new Map();
  for (const source of audit.sources) {
    const ref=source.sourceIdentity,code=ORDER.find(x=>x[1]===source.primaryModuleId)?.[0];
    requireThat(code,'未知模块');
    const point=body[ref.subjectId]?.points.find(p=>p.id===ref.pointId),tab=point?.tabs.find(t=>t.id===source.tabId);
    requireThat(point && hash(point)===source.sourceSha256 && tab && hash(tab)===source.tabSha256,'原来源审计过期：'+sourceKey(ref));
    requireThat(tab.blocks.length===source.blocks.length,'原块范围变更');
    source.blocks.forEach(b=>requireThat(hash(tab.blocks[b.blockIndex])===b.sha256,'原块摘要变更'));
    const workUnitId=`memory-expansion-${code.toLowerCase()}-${ref.subjectId}-${ref.pointId}`;
    requireThat(!units.has(workUnitId),'重复来源任务');
    units.set(workUnitId,{...clone(source),workUnitId,categoryId:point.categoryId});
  }
  requireThat(units.size===162 && audit.sources.reduce((n,s)=>n+s.blocks.length,0)===686,'原源范围变更需重新审计');
  return {root,read,audit,body,samples,units,authoringScopes:read(PATHS.scopes),ledger:read(PATHS.ledger),closure:read(PATHS.closure),inventory:read(PATHS.inventory),queue:read(PATHS.queue)};
}
function validateClosure(context, closure=context.closure) {
  const {root,read}=context;
  requireThat(closure.status==='definition-closed-with-local-deferrals' && closure.formalContentApproved===0,'定义与内容批准边界无效');
  const expected=Array.from({length:10},(_,i)=>'P3-'+String(i+1).padStart(2,'0'));
  requireThat(Array.isArray(closure.requirements) && sameSet(closure.requirements.map(x=>x.id),expected),'P3要求证据集合不完整');
  requireThat(closure.requirements.every(x=>x.status==='defined-with-evidence' && typeof x.evidence==='string' && x.evidence.trim()),'P3要求证据为空');
  requireThat(Array.isArray(closure.localDeferrals) && closure.localDeferrals.length && closure.localDeferrals.every(x=>x.scope&&x.state&&x.effect),'局部暂缓证据不完整');
  const expectedFiles=['detail/index.js','detail/index.wxml','memory/index.js','memory/index.wxml','memory/index.wxss'].map(p=>'miniprogram/subpackages/note/'+p);
  requireThat(Array.isArray(closure.verifiedImplementationFiles) && sameSet(closure.verifiedImplementationFiles.map(x=>x.path),expectedFiles),'复用实现证据集合不完整');
  for(const file of closure.verifiedImplementationFiles){
    requireThat(/^[a-f0-9]{64}$/.test(file.sha256),'实现摘要缺失');
    const crypto=require('crypto'),actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file.path))).digest('hex');
    requireThat(actual===file.sha256,'复用实现证据已变化，重验对应项：'+file.path);
  }
  const base='docs/knowledge-platform/implementations/evidence/';
  const eng=read(base+closure.engineeringEvidence),review=read(base+closure.contextEvidence);
  requireThat(Array.isArray(eng.checks) && eng.checks.length>=4 && eng.checks.every(c=>c.exit_code===0),'复用工程检查证据无效');
  requireThat(review.currentSamples===context.samples.cards.length && review.formalApproved===0 && Array.isArray(review.cards) && sameSet(review.cards.map(c=>c.cardId),context.samples.cards.map(c=>c.id)),'样板上下文证据无效');
  requireThat(review.cards.every(row=>{const card=context.samples.cards.find(c=>c.id===row.cardId);return card&&resolveCard(card,context.body).semanticVersion===row.semanticVersion;}),'样板上下文版本过期');
  return {status:closure.status,productRuleDigest:hash(fs.readFileSync(path.join(root,PATHS.product),'utf8')),closureDigest:hash(closure),engineeringEvidenceDigest:hash(eng),contextEvidenceDigest:hash(review)};
}
function validateLedger(context, ledger=context.ledger) {
  requireThat(ledger.schemaVersion===2 && ledger.formalApproved===0 && ledger.newRuntimeCards===0,'目标台账不是未准入设计态');
  requireThat(context.authoringScopes.schemaVersion===2&&unique(context.authoringScopes.batches.map(b=>b.batchId)),'编写批次范围配置无效');
  const batch=context.authoringScopes.batches.find(b=>b.batchId===ledger.batchId);
  requireThat(batch&&batch.sourceWorkUnitIds.length&&unique(batch.sourceWorkUnitIds)&&batch.sourceWorkUnitIds.every(id=>context.units.get(id)?.primaryModuleId===batch.moduleId),'批次来源范围无效');
  requireThat(Array.isArray(ledger.sourceWorkUnitIds)&&sameSet(ledger.sourceWorkUnitIds,batch.sourceWorkUnitIds),'来源设计范围不完整或越界');
  const dispositions=ledger.sourceDispositions;
  requireThat(Array.isArray(dispositions)&&sameSet(dispositions.map(d=>d.workUnitId),ledger.sourceWorkUnitIds),'来源处置覆盖不完整或重复');
  const targets=new Map(),cardIds=new Set();
  for(const card of ledger.cards){
    requireThat(typeof card.targetId==='string'&&card.targetId.trim()&&!targets.has(card.targetId),'重复或空目标身份');
    requireThat(typeof card.id==='string'&&card.id.trim()&&!cardIds.has(card.id),'重复或空卡片身份');cardIds.add(card.id);targets.set(card.targetId,card);
    requireThat(['basic','method'].includes(card.kind),'非法记忆板块');
    requireThat(card.status==='draft'&&card.admission==='not-enrolled'&&card.sampleOnly===false&&card.formalApproved===false&&card.semanticReview==='not-independently-approved','草稿不能自签批准或伪装样板');
    requireThat(Number.isInteger(card.revision)&&card.revision>0&&card.authorId&&card.recallGoal&&card.classificationReason&&card.contextRationale,'目标、归类或作者信息不完整');
    requireThat(Array.isArray(card.workUnitIds)&&card.workUnitIds.length&&unique(card.workUnitIds)&&card.workUnitIds.every(id=>ledger.sourceWorkUnitIds.includes(id)),'目标来源任务越界');
    // First authoring batch is deliberately single-source; multi-source work has a separate gate.
    requireThat(batch.multiSourceEnabled===false&&card.workUnitIds.length===1,'本版本未开放多来源组合，需独立导航及上下文证据后实现');
    const unit=context.units.get(card.workUnitIds[0]);
    requireThat(card.subjectId===unit.primaryModuleId&&card.pointId===unit.sourceIdentity.pointId&&card.categoryId===unit.categoryId,'卡片归属与来源任务不匹配');
    requireThat(card.subjectId!=='graphic'||card.kind==='method','图推必须属于方法判断');
    requireThat(Array.isArray(card.refs)&&card.refs.length&&card.refs.every(r=>sourceKey(r)===sourceKey(unit.sourceIdentity)&&r.tabId===unit.tabId),'实际引用与来源任务不匹配');
    for(const ref of card.refs){
      requireThat(Array.isArray(ref.blocks)&&ref.blocks.length&&unique(ref.blocks.map(b=>b.blockIndex)),'引用块为空或重复');
      requireThat(ref.blocks.every(b=>Number.isInteger(b.blockIndex)&&unit.blocks.some(old=>old.blockIndex===b.blockIndex)),'引用块越界');
    }
    const resolved=resolveCard(card,context.body);
    requireThat(!resolved.blocks.some(b=>['example','practice'].includes(b.type)),'本批目标不导入完整计算题');
    requireThat(!context.samples.cards.some(c=>c.id===card.id),'不能覆盖已有样板卡身份');
    if(card.localHold)requireThat(card.localHold.reason&&card.localHold.recovery,'局部暂缓没有原因或恢复条件');
  }
  for(const d of dispositions){
    requireThat(['targets-proposed','not-card','reuse','merged','hold'].includes(d.state)&&typeof d.reason==='string'&&d.reason.trim(),'来源处置或理由缺失');
    requireThat(Array.isArray(d.targetIds)&&sameSet(d.targetIds,ledger.cards.filter(c=>c.workUnitIds.includes(d.workUnitId)).map(c=>c.targetId)),'来源处置与实际目标不匹配');
    if(d.state==='targets-proposed')requireThat(d.targetIds.length>0,'来源称有目标却未登记');
    if(d.state==='reuse')requireThat(Array.isArray(d.reusedCardIds)&&d.reusedCardIds.length&&d.reusedCardIds.every(id=>context.samples.cards.some(c=>c.id===id)),'复用目标未定位');
    if(d.state==='merged')requireThat(Array.isArray(d.mergedIntoWorkUnitIds)&&d.mergedIntoWorkUnitIds.length&&d.mergedIntoWorkUnitIds.every(id=>context.units.has(id)&&id!==d.workUnitId),'合并去向无效');
    if(d.state==='hold')requireThat(d.recovery,'来源暂缓缺恢复条件');
    if(d.state==='not-card')requireThat(d.targetIds.length===0,'仅正文处置仍挂新目标');
  }
  requireThat(ledger.localHoldCount===ledger.cards.filter(c=>c.localHold).length,'局部暂缓数量不一致');
  return {sources:ledger.sourceWorkUnitIds.length,targets:ledger.cards.length,localTargetHolds:ledger.localHoldCount};
}
function buildApplications(context) {
  const {body,inventory,queue,root}=context;
  const catalog=require(path.join(root,'miniprogram/subpackages/note/models/note-catalog'));
  const pack=require(path.join(root,'miniprogram/subpackages/note/models/learning-pack'));
  const {availableContent}=require(path.join(root,'miniprogram/subpackages/note/services/learning-content'));
  const active=availableContent(catalog,pack,true).resources.filter(q=>q.exerciseKinds.includes('application'));
  const seen=new Set();
  const examples=inventory.examples.map(old=>{
    const p=body[old.subjectId].points.find(p=>p.id===old.pointId),tab=p.tabs.find(t=>t.id===old.tabId),block=tab.blocks[old.initialBlockIndex];
    requireThat(block?.type==='example'&&hash(block)===old.sha256,'原例题定位过期：'+old.sourceExampleRecordId);
    requireThat(!seen.has(old.sourceExampleRecordId),'原例题身份重复');seen.add(old.sourceExampleRecordId);
    const versions=pack.questions.filter(q=>q.origin?.sourceExampleRecordId===old.sourceExampleRecordId&&q.exerciseKinds.includes('application'));
    const live=active.filter(q=>q.origin?.sourceExampleRecordId===old.sourceExampleRecordId);
    const holds=queue.priorSourceHolds.filter(h=>h.origin?.sourceExampleRecordId===old.sourceExampleRecordId);
    const warnings=inventory.contentHolds.filter(h=>h.sourceExampleRecordId===old.sourceExampleRecordId);
    const unit=[...context.units.values()].find(u=>sourceKey(u.sourceIdentity)===sourceKey(old));
    return {applicationWorkUnitId:'memory-application-'+old.sourceExampleRecordId,sourceExampleRecordId:old.sourceExampleRecordId,originalSubjectId:old.subjectId,primaryModuleId:unit.primaryModuleId,pointId:old.pointId,tabId:old.tabId,blockIndex:old.initialBlockIndex,sourcePath:old.sourcePath,jsonPointer:old.jsonPointer,expectedBlockSha256:old.sha256,originalStructureClassification:old.classification,
      declaredSource:old.declaredSource||null,sourceProvenance:'not-approved-by-note-label',existingQuestionVersions:versions.map(q=>({id:q.id,revision:q.revision})),currentDevelopmentQuestionIds:live.map(q=>q.id),currentSourceHolds:holds,historicalSourceWarnings:warnings,
      disposition:holds.length?'inherited-source-hold':live.length?'retain-current-development-question':warnings.length?'historical-warning-triage':old.classification==='structured-choice-candidate'?'task-and-material-audit-pending':'lecture-or-task-completeness-triage',
      requiredChecks:['complete original task/material/options/answer/explanation','specific distractor and task-goal reasoning','provenance/source label verification separate from note label','duplicate material/exposure identity','exact original reference and independent content decision','preserve old answer/exposure/history'],formalApproved:false,newImportAuthorized:false};
  });
  const imageMaterials=[];
  for(const [subject,data] of Object.entries(body))for(const point of data.points)for(const tab of point.tabs)if(tab.id!=='knowledge')tab.blocks.forEach((block,index)=>{
    if(block.type==='image-note')imageMaterials.push({materialSnapshotId:`application-image-snapshot-${subject}-${point.id}-${tab.id}-${index}`,originalSubjectId:subject,pointId:point.id,tabId:tab.id,blockIndex:index,expectedBlockSha256:hash(block),stage:'original-image-material-needs-full-task-audit',isQuestion:false,locatorIsRuntimeIdentity:false});
  });
  const actualCount=Object.values(body).reduce((n,s)=>n+s.points.reduce((m,p)=>m+p.tabs.reduce((k,t)=>k+t.blocks.filter(b=>b.type==='example').length,0),0),0);
  requireThat(examples.length===actualCount&&examples.length===218,'应用素材覆盖变化需重新冻结');
  return {scope:'original example materials, not qualified exam questions',examples,exampleMaterialCount:examples.length,imageMaterials,imageMaterialCount:imageMaterials.length,currentDevelopmentQuestions:active.length,formalApproved:0};
}
function stageDefinitions(g0) {
  return [
    {id:'ME-G0',name:'接入前基础契约与回归',state:g0?'engineering-passed':'not-started',dependsOn:[],actions:['源快照与学习语义版本分离（EXP-A05）','候选注册／冻结评审包／独立精确版本回执','开发与正式内容编译消费路径分开且失败关闭'],exit:['无关原块和纯展示变化不失效评价；所选知识变化才重新评估','未审／拒绝／过期回执／未决hold不进入正式包','旧用户弱项和历史原样保留'],evidencePath:'evidence/notes-memory-v5-g0-validation.json'},
    {id:'DESIGN',name:'模块目标与来源处置',state:'in-progress-for-ME-DA',dependsOn:[],actions:['逐源处置及0..N目标','原例题逐条处置与材料核验','目标分类、重复关系及上下文完整性'],exit:['来源处置覆盖无遗漏','引用绑定、目标身份和原内容摘要有效','所有局部问题有范围及恢复条件'],evidencePath:'evidence/ME-{module}-design.json'},
    {id:'PREVIEW',name:'模块开发待审接入',state:'not-started',dependsOn:['ME-G0','DESIGN'],actions:['显式注册开发候选，不冒用sampleOnly','冻结逐卡对照材料，接入全部卡片目录'],exit:['每个候选ID在全部／科目／专题逐张可达','原生返回、按钮导航及源图／公式展示验证','空态／缺源／失败／重启／弱项及版本回归'],evidencePath:'evidence/ME-{module}-preview.json'},
    {id:'REVIEW',name:'精确版本独立内容审阅',state:'not-started',dependsOn:['ME-G0','DESIGN'],actions:['独立任务标识与作者不同且审阅者种类如实标明','回执绑定目标／卡片／版本／语义／源摘要／规则版本','逐项目标、条件、边界、例示、补充语与图像的实质审阅'],exit:['accept/revise/reject/hold逐项结果和理由齐备','revise形成新版本；旧回执不自动继承','共同来源关系批准不替代具体卡片批准'],evidencePath:'evidence/ME-{module}-independent-review.json'},
    {id:'ADMIT',name:'模块正式准入与消费验收',state:'not-started',dependsOn:['ME-G0','PREVIEW','REVIEW'],actions:['独立内容接受与正式启用授权分开','精确版本编译准入清单并从正式路径实际消费'],exit:['未授权／hold／拒绝／失配版本均排除','同一稳定ID在目录与筛选数量一致','新旧版弱项、冻结轮次和存储失败均有回归'],evidencePath:'evidence/ME-{module}-admission.json'},
    {id:'DEVICE-RELEASE',name:'显示、设备和发布',state:'not-started',dependsOn:['PREVIEW'],releaseDependsOn:['ADMIT','explicit-release-authorization'],actions:['原图／长公式／窄屏／大字／真机分别观察','真实压缩包体及发布授权分别验收'],exit:['缺设备或包体证据保持未验','不以自动绿灯替代显示或发布批准'],evidencePath:'evidence/ME-{module}-device-release.json'}
  ];
}
function buildPlan(context) {
  const proof=validateClosure(context),ledgerStats=validateLedger(context),applications=buildApplications(context),g0=verifyG0(context.root);
  const modules=ORDER.map(([code,id,title],index)=>{
    const sources=[...context.units.values()].filter(s=>s.primaryModuleId===id).map(unit=>{
      const targets=context.ledger.cards.filter(c=>c.workUnitIds.includes(unit.workUnitId));
      const sourceDisposition=context.ledger.sourceDispositions.find(d=>d.workUnitId===unit.workUnitId)||null;
      const pilots=context.samples.cards.filter(c=>c.refs.some(r=>sourceKey(r)===sourceKey(unit.sourceIdentity)));
      return {workUnitId:unit.workUnitId,sourceIdentity:unit.sourceIdentity,primaryModuleId:id,title:unit.title,categoryId:unit.categoryId,sourceSha256:unit.sourceSha256,tabSha256:unit.tabSha256,originalBlocks:unit.blocks,sourceObservations:unit.sourceHolds,
        historicalSourceKindHint:unit.recomposition.suggestedKind,historicalHintIsAdmission:false,targetClassifications:targets.map(c=>({targetId:c.targetId,kind:c.kind,reason:c.classificationReason})),sourceDisposition,existingPilotCardIds:pilots.map(c=>c.id),requiresSharedOwnershipEvidence:unit.sourceIdentity.subjectId!==id,stage:sourceDisposition?'source-disposition-recorded':unit.sourceHolds.length?'source-observation-triage':pilots.length?'reuse-pilot-and-check-target-gaps':'pending-target-design',candidateCountIsQuota:false};
    });
    const apps=applications.examples.filter(e=>e.primaryModuleId===id);
    return {batchId:'ME-'+code,order:index+1,moduleId:id,title,sourceCount:sources.length,knowledgeBlockCount:sources.reduce((n,s)=>n+s.originalBlocks.length,0),sourceObservationCount:sources.reduce((n,s)=>n+s.sourceObservations.length,0),sources,applicationWorkUnitIds:apps.map(e=>e.applicationWorkUnitId),applicationMaterialCount:apps.length,stages:stageDefinitions(g0).map(s=>({stageId:s.id,exitEvidence:s.evidencePath.replace('{module}',code),completion:s.id==='ME-G0'&&g0?'engineering-passed':'not-claimed'})),moduleCompletionRule:'DESIGN is not module completion. Report design, preview, independent decision, admission, device and release separately; only accept exact-version evidence for each claimed stage.'};
  });
  return {schemaVersion:2,date:'2026-10-22',version:'notes-memory-expansion-plan-v2',scope:'Executable work plan and design ledger, not approved content or runtime changes',productDefinition:proof,formalApproved:0,newRuntimeCards:0,runtimeSamples:context.samples.cards.length,designLedgerStats:ledgerStats,sourceCount:context.units.size,knowledgeBlockCount:686,sourceObservationCount:108,
    sourceTargetRelation:'one source has zero or many proposed targets; candidates link exact source work units; source disposition coverage is independent of card count',currentAuthoringLedger:PATHS.ledger,authoringScopes:context.authoringScopes,
    g0Engineering:g0,stageDefinitions:stageDefinitions(g0),reviewContract:{authorAndReviewerIndependent:true,commonReceiptFields:['decisionId','reviewerKind','reviewerTaskId','authorTaskId','sourceSnapshotDigests','ruleVersion','substantiveChecks','decision','issues','reviewedAt'],contentTypeBindings:{memoryCard:['cardId','targetId','revision','learningSemanticDigest'],application:['questionId','revision','effectiveContentDigest','sourceExampleRecordId','originBlockSha256','exposureGroupId']},applicationUsesExistingV4DecisionAuthority:true,legacyUnverifiedRemainsDevelopmentOnly:true,decisions:['accept','revise','reject','hold'],formalEnablementIsSeparate:true,requiredPolicy:'No current receipt or formal enablement is created by this plan.'},
    semanticVersionContract:{status:g0?'implemented-in-ME-G0; legacy-state-preserved':'planned-in-ME-G0; runtime-A05-not-yet-fixed',sourceSnapshotDigest:'exact original source validity and traceability',learningSemanticDigest:'selected knowledge, prompt, target and necessary semantic dependencies; exclude unselected blocks and pure style',requiredRegressions:['unselected source block change keeps unchanged card rating/version','style-only change keeps ratings','selected knowledge/prompt/condition change requires re-evaluation','source proof stale fails closed until reference is explicitly updated','historical ratings never deleted']},
    modules,applications,localTargetHolds:context.ledger.cards.filter(c=>c.localHold).map(c=>({targetId:c.targetId,cardId:c.id,...c.localHold})),
    auditDispositions:{'EXP-A01':'source/target ledger decoupled and variable cardinality validated','EXP-A02':'source identity, coverage, kind and exact refs mechanically bound','EXP-A03':g0?'candidate/review/enablement compiler and runtime contract implemented; live enrollment remains separate':'concrete staged receipt/preview/admission/consumption exits; runtime implementation remains ME-G0','EXP-A04':'218 original example work units and separate image materials; no new import','EXP-A05':g0?'semantic/source separation and immutable legacy aliases implemented and regression-verified':'blocking semantic-stability engineering batch before preview/admission; runtime unchanged','EXP-A06':'average target locally held for rework; original body unchanged','EXP-A07':'ten requirements, referenced evidence and implementation hashes checked','EXP-A08':'historical source hint separated from current target classification'},
    automaticContinuation:'Source triage and unadmitted target drafting continue without user-by-user approval. Unresolved product choices or required account/device actions are escalated; exact independent content acceptance, formal enablement and release remain separate.',preserved:{original50Json:true,currentSamples:true,applicationHistory:true,old22Drafts:true,old3ApplicationHolds:true}};
}
module.exports={PATHS,ORDER,createContext,validateClosure,validateLedger,buildApplications,buildPlan,clone};
