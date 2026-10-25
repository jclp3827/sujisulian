// Learning identity is separate from the exact source snapshot and editorial revision.
const {digest}=require('./learning-semantic');
const VERSION='notes-memory-learning-v1';
// Only rendering metadata is excluded. Labels, warnings, images and unknown fields stay semantic.
const PRESENTATION_KEYS=new Set(['style','className','fontSize','textColor','backgroundColor','mobileLayout','sourceRowIndices']);
function knowledge(value){
 if(Array.isArray(value))return value.map(knowledge);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!PRESENTATION_KEYS.has(key)).map(([key,v])=>[key,knowledge(v)]));
 return value;
}
function learningSignature(card,blocks){
 return digest({version:VERSION,targetId:card.targetId||null,title:card.title,prompt:card.prompt,recallGoal:card.recallGoal||null,kind:card.kind,subjectId:card.subjectId,pointId:card.pointId,
  origins:card.refs.map(ref=>({subjectId:ref.subjectId,pointId:ref.pointId,tabId:ref.tabId})),knowledge:knowledge(blocks)});
}
module.exports={VERSION,PRESENTATION_KEYS,knowledge,learningSignature};
