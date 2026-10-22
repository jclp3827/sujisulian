const {sha256}=require('./learning-semantic');
const clone=v=>JSON.parse(JSON.stringify(v));
function pointAt(body,r){return body.getNotePoint?body.getNotePoint(r.subjectId,r.pointId):body[r.subjectId]?.points.find(p=>p.id===r.pointId);}
function hash(v){return sha256(JSON.stringify(v));}
function projectBlock(raw,selection){
 const b=clone(raw);
 if(selection.nodeIndices){if(b.type!=='mind-map')throw Error('导图引用类型错误');b.nodes=selection.nodeIndices.map(i=>{if(!b.nodes[i])throw Error('导图分支已变更');return clone(b.nodes[i]);});}
 if(selection.rowIndices){if(b.type!=='table')throw Error('表格引用类型错误');const oldRows=clone(b.rows),cells=b.cellNodes||{};b.rows=selection.rowIndices.map(i=>{if(!oldRows[i])throw Error('表格行已变更');const row=clone(oldRows[i]);const g=Number(b.cardGroupColumn);if(Number.isInteger(g)&&b.cardGroupColumn!==undefined&&!row[g])for(let j=i-1;j>=0;j--)if(oldRows[j][g]){row[g]=oldRows[j][g];break;}return row;});b.cellNodes={};selection.rowIndices.forEach((old,i)=>b.columns.forEach((_,j)=>{if(cells[old+'-'+j])b.cellNodes[i+'-'+j]=clone(cells[old+'-'+j]);}));b.sourceRowIndices=selection.rowIndices;}
 return b;
}
function resolveCard(card,body){
 const blocks=[];for(const ref of card.refs){const p=pointAt(body,ref),tab=p?.tabs.find(t=>t.id===ref.tabId);if(!tab||hash(tab)!==ref.expectedTabSha256)throw Error('来源内容已更新');for(const selection of ref.blocks){const raw=tab.blocks[selection.blockIndex];if(!raw||hash(raw)!==selection.expectedBlockSha256)throw Error('来源块已更新');blocks.push(projectBlock(raw,selection));}}
 return {...clone(card),blocks,semanticVersion:hash({revision:card.revision,title:card.title,prompt:card.prompt,kind:card.kind,subjectId:card.subjectId,categoryId:card.categoryId,refs:card.refs})};
}
function availableCards(body,pack,development){
 if(!development||pack?.schemaVersion!==1||pack.sampleOnly!==true)return [];
 return pack.cards.filter(c=>c.sampleOnly===true&&c.status==='preview-pending'&&['basic','method'].includes(c.kind)&&!(c.subjectId==='graphic'&&c.kind!=='method')).flatMap(c=>{try{return[resolveCard(c,body)];}catch(_){return[];}});
}
function inScope(card,scope={}){return (!scope.subjectId||scope.subjectId==='all'||card.subjectId===scope.subjectId)&&(!scope.categoryId||scope.categoryId==='all'||card.categoryId===scope.categoryId)&&(!scope.pointId||card.refs.some(r=>r.pointId===scope.pointId&&r.subjectId===(scope.sourceSubjectId||scope.subjectId)));}
module.exports={hash,projectBlock,resolveCard,availableCards,inScope};
