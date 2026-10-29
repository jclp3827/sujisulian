const {fingerprint}=require('./learning-content');
const omit=new Set(['review','reviewedAt','checkedAt','auditStatus','sourceAuditStatus','verificationLabel','style','className',
  'runtimeSignature','learningSignature','compatibleSignatures','stub','specification','sourceUrl']);
function project(value){if(Array.isArray(value))return value.map(project);if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().filter(k=>!omit.has(k)&&value[k]!==undefined).map(k=>[k,project(value[k])]));return value;}
function itemIdentity(item, pack) {
  if(!item)return undefined;if(item.learningSignature)return item.learningSignature;
  if(!pack?.targetRelations)return fingerprint(project(item));
  const question=Array.isArray(item.options);
  const relations=(question?pack.targetRelations.questionTargets:pack.targetRelations.mnemonicPhraseTargets)||[];
  const rows=relations.filter(x=>(question?x.questionId:x.mnemonicId)===item.id);
  const ids=[...new Set(rows.flatMap(x=>[...(x.primaryTargetIds||[]),...(x.supportingTargetIds||[]),...(x.targetIds||[])]))].sort();
  return fingerprint(project({item,rows,targets:ids.map(id=>(pack.targets||[]).find(x=>x.id===id)),
    questions:question?[]:(item.questionIds||[]).map(id=>itemIdentity((pack.questions||[]).find(x=>x.id===id),pack))}));
}
const guideIdentity=card=>fingerprint({id:card.id,scope:card.scope,groupId:card.groupId,title:card.title,
  content:card.content,learningGoal:card.learningGoal,semanticRevision:card.semanticRevision,
  pointId:card.pointId,tabId:card.tabId,sourceUnitIds:card.sourceUnitIds});
module.exports={project,itemIdentity,guideIdentity};
