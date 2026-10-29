const {inScope}=require('./memory-content');
const KEY='notesMemory:v5:state';const clone=v=>JSON.parse(JSON.stringify(v));
const EXAM_COUNTS=[5,10,15];
const empty=()=>({schemaVersion:1,seq:0,active:{},sessions:{},ratings:{},events:[],preferences:{}});
function createMemoryEngine(cards,storage,clock=()=>Date.now()){
 const catalogById=new Map(cards.map(c=>[c.id,c]));
 const byId=new Map(catalogById);
 function read(){let s;try{s=storage.getStorageSync(KEY)||empty();}catch(_){throw Error('暂时无法读取记忆记录，请重试');}if(s.schemaVersion!==1||!Array.isArray(s.events)||['active','sessions','ratings','preferences'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k]))||!Number.isInteger(s.seq))throw Error('记忆记录无法识别，已保留原数据');return clone(s);}
 function tx(fn){const s=read(),value=fn(s);try{storage.setStorageSync(KEY,s);}catch(_){throw Error('本次记录未保存，请重试');}return clone(value===undefined?null:value);}
 function session(s,id){const v=s.sessions[id];if(!v)throw Error('记忆轮次不存在');return v;}
 function current(v){const item=v.items[v.index],c=item&&byId.get(item.id);return c&&c.semanticVersion===item.version&&Array.isArray(c.blocks)?c:null;}
 function hydrate(items){items.forEach(c=>{const listed=byId.get(c.id);if(!listed||listed.semanticVersion!==c.semanticVersion||!Array.isArray(c.blocks))throw Error('卡片内容已更新，请重新进入');byId.set(c.id,c);});}
 function evict(ids){ids.forEach(id=>{const stub=catalogById.get(id);if(stub)byId.set(id,stub);});}
 function weak(scope={},updated=false){const s=read();return cards.filter(c=>inScope(c,scope)&&['missed','fuzzy'].includes(s.ratings[c.id]?.result)&&(updated?s.ratings[c.id].version!==c.semanticVersion:s.ratings[c.id].version===c.semanticVersion)).sort((a,b)=>{const x=s.ratings[a.id],y=s.ratings[b.id];return (x.result==='missed'?0:1)-(y.result==='missed'?0:1)||x.at-y.at||a.id.localeCompare(b.id);});}
 function preferredScope(kind){const s=read();return clone(s.preferences[kind]?.scope||s.sessions[s.active[kind]]?.scope||{subjectId:'all',categoryId:'all'});}
 function preferredCount(kind){const count=read().preferences[kind]?.count;return EXAM_COUNTS.includes(count)?count:5;}
 function examPool(scope){const scoped=cards.filter(c=>inScope(c,scope));return scoped.filter(c=>c.kind==='basic').concat(scoped.filter(c=>c.kind==='method'));}
 function bankCounts(scope){return {selected:examPool(scope).length,review:weak(scope).length};}
 function start(kind,scope={},options={}){
  if(!['basic','method','exam'].includes(kind))throw Error('记忆方式不存在');
  const variant=kind==='exam'&&options.variant==='review'?'review':'selected',count=EXAM_COUNTS.includes(options.count)?options.count:5;
  const activeKey=kind==='exam'&&variant==='selected'?'examSelected':kind,s=read(),active=s.sessions[s.active[activeKey]];
  if(!options.fresh&&active&&JSON.stringify(active.scope)===JSON.stringify(scope)&&active.index<active.items.length&&
    (kind!=='exam'||(active.variant||'review')===variant&&(!active.count||active.count===count)))return clone(active);
  let list;
  if(kind==='exam'&&variant==='selected'){
   const pool=examPool(scope),previous=s.sessions[s.active.examSelected],lastId=previous?.items?.[previous.items.length-1]?.id;
   const last=pool.findIndex(c=>c.id===lastId),offset=last<0?0:(last+1)%pool.length;
   list=pool.slice(offset).concat(pool.slice(0,offset)).slice(0,count);
  }else if(kind==='exam')list=weak(scope).slice(0,count);
  else list=cards.filter(c=>c.kind===kind&&inScope(c,scope));
  if(!list.length){tx(next=>{next.preferences[kind]={...(next.preferences[kind]||{}),scope:clone(scope),...(kind==='exam'?{count}:{})};});return null;}
  if(options.cardId&&!list.some(c=>c.id===options.cardId))throw Error('卡片不在当前范围内');
  return tx(next=>{next.preferences[kind]={...(next.preferences[kind]||{}),scope:clone(scope),...(kind==='exam'?{count}:{})};next.seq++;const id='memory-'+clock()+'-'+next.seq;const mode=kind==='exam'?'recall':options.mode||'recall';if(!['browse','recall'].includes(mode))throw Error('记忆方式无效');const v={id,kind,scope:clone(scope),mode,index:options.cardId?list.findIndex(c=>c.id===options.cardId):0,items:list.map(c=>({id:c.id,version:c.semanticVersion})),revealed:{},positions:{},responses:{},createdAt:clock(),...(kind==='exam'?{variant,count}:{})};next.sessions[id]=v;next.active[activeKey]=id;return v;});
 }
 function get(id){const s=read(),v=session(s,id);return {...v,current:current(v),expired:v.index<v.items.length&&!current(v),complete:v.index>=v.items.length};}
 function reveal(id){return tx(s=>{const v=session(s,id),c=current(v);if(!c)throw Error('当前卡片内容已更新');v.revealed[c.id]=true;return v;});}
 function assess(id,result){if(!['remembered','fuzzy','missed','skipped'].includes(result))throw Error('自评不存在');return tx(s=>{const v=session(s,id),c=current(v);if(!c)throw Error('当前卡片内容已更新，请重新选择');if(result!=='skipped'&&v.mode==='recall'&&!v.revealed[c.id])throw Error('请先回忆并揭晓，再选择自评');const event={cardId:c.id,version:c.semanticVersion,result,mode:v.mode,sessionId:id,at:clock()};s.events.push(event);v.responses[c.id]=event;if(result!=='skipped')s.ratings[c.id]={version:c.semanticVersion,result,mode:v.mode,at:event.at};v.index++;return v;});}
 function move(id,delta){return tx(s=>{const v=session(s,id);v.index=Math.max(0,Math.min(v.items.length,v.index+delta));return v;});}
 function mode(id,value){if(!['browse','recall'].includes(value))throw Error('记忆方式无效');return tx(s=>{const v=session(s,id);v.mode=value;const c=current(v);if(c&&value==='recall')delete v.revealed[c.id];s.preferences[v.kind]={...(s.preferences[v.kind]||{}),mode:value};return v;});}
 function position(id,top){return tx(s=>{const v=session(s,id),item=v.items[v.index];if(item)v.positions[item.id]=Math.max(0,Number(top)||0);return v;});}
 function report(id){const v=session(read(),id),counts={remembered:0,fuzzy:0,missed:0,skipped:0};Object.values(v.responses).forEach(r=>counts[r.result]++);return {counts,remainingWeak:weak(v.scope).length,updatedWeak:weak(v.scope,true).length};}
 return {preferredScope,preferredCount,bankCounts,start,get,reveal,assess,move,mode,position,weak,report,hydrate,evict,ratings:()=>read().ratings};
}
module.exports={KEY,createMemoryEngine};
