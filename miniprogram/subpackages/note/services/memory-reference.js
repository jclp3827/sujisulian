const {sha256,digest}=require('./learning-semantic');
const {learningSignature}=require('./memory-semantic');
const compatibility=require('../models/memory-version-compatibility');
const clone=value=>JSON.parse(JSON.stringify(value));
const hash=value=>sha256(JSON.stringify(value));
function pointAt(body,ref){return body.getNotePoint?body.getNotePoint(ref.subjectId,ref.pointId):body[ref.subjectId]?.points.find(p=>p.id===ref.pointId);}
function indices(values,length){
 if(!Array.isArray(values)||!values.length||new Set(values).size!==values.length||!values.every(i=>Number.isInteger(i)&&i>=0&&i<length))throw Error('切片范围无效');
 return values;
}
function projectBlock(raw,selection){
 const block=clone(raw);
 if(selection.nodeIndices!==undefined){
  if(block.type!=='mind-map'||selection.rowIndices!==undefined)throw Error('导图引用类型错误');
  block.nodes=indices(selection.nodeIndices,block.nodes.length).map(i=>clone(block.nodes[i]));
 }
 if(selection.rowIndices!==undefined){
  if(block.type!=='table')throw Error('表格引用类型错误');
  const oldRows=clone(block.rows),cells=block.cellNodes||{};
  indices(selection.rowIndices,oldRows.length);
  block.rows=selection.rowIndices.map(i=>{const row=clone(oldRows[i]),group=Number(block.cardGroupColumn);if(Number.isInteger(group)&&block.cardGroupColumn!==undefined&&!row[group])for(let j=i-1;j>=0;j--)if(oldRows[j][group]){row[group]=oldRows[j][group];break;}return row;});
  block.cellNodes={};
  selection.rowIndices.forEach((old,i)=>block.columns.forEach((_,j)=>{if(cells[old+'-'+j])block.cellNodes[i+'-'+j]=clone(cells[old+'-'+j]);}));
  block.sourceRowIndices=selection.rowIndices;
 }
 return block;
}
function resolveCard(card,body){
 if(!Array.isArray(card.refs)||!card.refs.length)throw Error('缺少原来源引用');
 const blocks=[];
 for(const ref of card.refs){
  const point=pointAt(body,ref),tab=point?.tabs.find(t=>t.id===ref.tabId);
  if(!tab||hash(tab)!==ref.expectedTabSha256)throw Error('来源内容已更新');
  if(!Array.isArray(ref.blocks)||!ref.blocks.length||new Set(ref.blocks.map(s=>s.blockIndex)).size!==ref.blocks.length)throw Error('引用块为空或重复');
  for(const selection of ref.blocks){
   const raw=tab.blocks[selection.blockIndex];
   if(!Number.isInteger(selection.blockIndex)||selection.blockIndex<0||!raw||hash(raw)!==selection.expectedBlockSha256)throw Error('来源块已更新');
   blocks.push(projectBlock(raw,selection));
  }
 }
 const learningSemanticDigest=learningSignature(card,blocks),alias=Object.prototype.hasOwnProperty.call(compatibility,card.id)?compatibility[card.id]:null;
 // The immutable alias preserves old ratings/sessions without touching user storage.
 const semanticVersion=alias?.learningSemanticDigest===learningSemanticDigest?alias.semanticVersion:learningSemanticDigest;
 return {...clone(card),blocks,sourceSnapshotDigest:digest(card.refs),learningSemanticDigest,semanticVersion};
}
module.exports={hash,projectBlock,resolveCard};
