const reference=require('./memory-reference');
const finiteIds=require('../models/memory-version-compatibility');
function availableCards(body,pack,development){
 if(pack?.schemaVersion!==1)return [];
 const samples=development&&pack.sampleOnly===true&&Array.isArray(pack.cards)?pack.cards.filter(c=>c&&Object.prototype.hasOwnProperty.call(finiteIds,c.id)&&c.sampleOnly===true&&c.status==='preview-pending'&&['basic','method'].includes(c.kind)&&!(c.subjectId==='graphic'&&c.kind!=='method')).flatMap(c=>{try{return[reference.resolveCard(c,body)];}catch(_){return[];}}):[];
 const enrolled=require('./memory-admission').eligibleCards(pack.enrollment,body,!!development);
 const seen=new Set(samples.map(c=>c.id));
 return [...samples,...enrolled.filter(c=>{if(seen.has(c.id))return false;seen.add(c.id);return true;})];
}
function inScope(card,scope={}){return (!scope.subjectId||scope.subjectId==='all'||card.subjectId===scope.subjectId)&&(!scope.categoryId||scope.categoryId==='all'||card.categoryId===scope.categoryId)&&(!scope.pointId||card.refs.some(r=>r.pointId===scope.pointId&&r.subjectId===(scope.sourceSubjectId||scope.subjectId)));}
module.exports={...reference,availableCards,inScope};
