const fs=require('fs');const path=require('path');
const core=require('../../miniprogram/subpackages/note/services/learning-semantic');
const root=path.resolve(__dirname,'../..');
const clone=v=>JSON.parse(JSON.stringify(v));
function policyDefinition(rubric){const keys=['ruleVersion','rules','ruleEvaluation','targetExtension','semanticReceiptContract','digestContract','admissionMatrix','sessionContract','sharedSourceContract','legacyTransitionContract','reviewSlicePolicy'];return Object.fromEntries(keys.map(k=>[k,rubric[k]]));}
function loadLedger(){return JSON.parse(fs.readFileSync(path.join(root,'docs/knowledge-platform/content/notes/exam-reviews-v4.json'),'utf8'));}
function baseTarget(t){return {id:t.id,revision:t.revision,subjectId:t.subjectId,categoryId:t.categoryId,statement:t.statement,conclusion:t.conclusion,conditions:t.conditions,excludes:t.excludes,refs:(t.refs||[]).map(r=>({subjectId:r.subjectId,pointId:r.pointId,tabId:r.tabId,expectedSha256:r.expectedSha256}))};}
function prepareSemanticPolicy(pack,options={}){
 if(options.legacyFixture===true){delete pack.examAdmission;return;}
 if(pack.examAdmission?.ruleVersion!==core.RULE_VERSION)throw Error('缺少V4练习准入声明');
 const rubric=options.rubric||JSON.parse(fs.readFileSync(path.join(root,'docs/knowledge-platform/implementations/notes-learning-exam-rubric-v4.json'),'utf8'));
 const definition=policyDefinition(rubric);pack.semanticPolicy={ruleVersion:core.RULE_VERSION,signatureVersion:core.SIGNATURE_VERSION,definition,ruleDigest:core.digest(definition)};
 const ledger=options.semanticLedger||loadLedger();
 if(ledger.schemaVersion!==1||ledger.ruleVersion!==core.RULE_VERSION||!Array.isArray(ledger.receipts))throw Error('语义评审账格式无效');
 pack.semanticReviews=clone(ledger.receipts);pack.semanticWithdrawals=clone(ledger.withdrawnVersions||[]);pack.sharedSourceBindings=clone(ledger.sharedSourceBindings||[]);pack.sourceBindingReviews=clone(ledger.sourceBindingReviews||[]);pack.semanticAssets={};
 for(const a of options.assetFixtures||[]){if(!options.testFixture)throw Error('资产夹具只能用于测试');pack.semanticAssets[a.src]=a.sha256;}
 // A runtime image without locally verifiable bytes remains held, even if its filename exists in a source.
 for(const image of ledger.assets||[]){const p=path.resolve(root,image.localPath||'');if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile())throw Error('图片本地证据无效');const sha=require('crypto').createHash('sha256').update(fs.readFileSync(p)).digest('hex');if(sha!==image.sha256)throw Error('图片字节证据已变更');pack.semanticAssets[image.src]=sha;}
 const baseline=options.legacyBaseline||JSON.parse(fs.readFileSync(path.join(root,'docs/knowledge-platform/implementations/evidence/notes-learning-exam-v4-frozen-state-20261022.json'),'utf8'));
 const calibrationWithdrawals=(rubric.hardRejectExampleQuestionIds||[]).map(id=>{const q=baseline.content?.resources.find(r=>r.id===id);if(!q)throw Error('缺少已否决版本的冻结证据');return {questionId:q.id,questionRevision:q.revision,effectiveContentDigest:core.digest(core.effectiveQuestion(q)),reason:'User rejected current form; immutable calibration baseline'};});
 pack.semanticWithdrawals=[...new Map([...calibrationWithdrawals,...pack.semanticWithdrawals].map(w=>[`${w.questionId}:${w.questionRevision}:${w.effectiveContentDigest}`,w])).values()];
 return baseline;
}
function applySemanticPolicy(pack,body,options={}){
 if(options.legacyFixture===true)return;
 const baseline=prepareSemanticPolicy(pack,options);
 const semanticContext=core.createContext(pack,body);
 const heads=core.reviewHeads(pack.semanticReviews);const selected=new Set(Object.values(pack.entryPlans).flatMap(p=>p.resourceIds));
 for(const q of pack.questions){
  const admission=core.semanticAdmission(q,pack,body,heads,semanticContext);
  if(admission)q.semanticAdmission=admission;
  if(selected.has(q.id)&&!admission)throw Error(`${q.id}: 缺少当前有效的V4语义接受回执或依赖证明`);
 }
 // Historical snapshots are compatibility evidence, never a live fallback entry.

 for(const q of pack.questions.filter(q=>q.semanticAdmission)){
  const old=baseline.content?.resources.find(r=>r.id===q.id);if(!old)continue;
  if(core.digest(core.effectiveQuestion(old))!==core.digest(core.effectiveQuestion(q)))continue;
  const targets=[...(q.primaryTargetIds||[]),...(q.supportingTargetIds||[])];
  const match=targets.every(id=>{const before=baseline.content.targets.find(t=>t.id===id),after=pack.targets.find(t=>t.id===id);return before&&after&&core.digest(baseTarget(before))===core.digest(baseTarget(after));});
  const atoms=q.assessment.knowledgeAtomIds.map(id=>pack.knowledgeAtoms.find(a=>a.id===id));
  if(!match||core.digest(atoms.map(core.substantive))!==core.digest((old.knowledgeAtoms||[]).map(core.substantive)))continue;
  const group=q.assessment.comparisonGroupId?pack.comparisonGroups.find(g=>g.id===q.assessment.comparisonGroupId):null;
  const oldGroup=old.comparison?{...old.comparison}:null;if(oldGroup)delete oldGroup.knowledge;
  if(core.digest(group?core.substantive(group):null)!==core.digest(oldGroup?core.substantive(oldGroup):null))continue;
  q.legacyCompatibility={baselineVersion:baseline.packVersion,resourceSignature:require('../../miniprogram/subpackages/note/services/learning-content').fingerprint(old),currentSemanticSignature:q.semanticAdmission.signature};
 }
}
module.exports={...core,policyDefinition,prepareSemanticPolicy,applySemanticPolicy};
