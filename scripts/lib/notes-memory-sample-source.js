// One explicitly authorized source revision. No runtime or user-state fallback.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {digest}=require('../../miniprogram/subpackages/note/services/learning-semantic');
const {hash,resolveCard}=require('../../miniprogram/subpackages/note/services/memory-reference');
const MANIFEST='docs/knowledge-platform/content/notes/memory-v5-work-source-rebinding-20261023.json';
const MANIFEST_DIGEST='cc3328d4a20487410cf977dcbc58dae28be4ba3f87f5c963b733cc332501baec';
const FROZEN_DIGEST='a597424f54a6151b157e90d18a105e6add7c0551ba3feee9db68e263232b3dbc';
function read(root,rel){return JSON.parse(fs.readFileSync(path.join(root,rel),'utf8'));}
function snapshot(root,item){
 if(!item||!/^docs\/knowledge-platform\/implementations\/evidence\/notes-memory-v5-source01-snapshots\/[a-f0-9]{64}\.(json|js)$/.test(item.path)||!item.path.includes('/'+item.sha256+'.'))throw Error('来源迁移快照路径无效');
 const data=fs.readFileSync(path.join(root,item.path));
 if(crypto.createHash('sha256').update(data).digest('hex')!==item.sha256)throw Error('来源迁移历史快照已变化');
 return data;
}
function migration(root){
 if(!fs.existsSync(path.join(root,MANIFEST)))return null;
 const m=read(root,MANIFEST);
 if(digest(m)!==MANIFEST_DIGEST||m.batchId!=='NOTE-G0-SOURCE-01'||m.sourcePath!=='miniprogram/models/note-quantity/points/work.json'||m.beforePoint.id!=='work-efficiency')throw Error('来源迁移授权版本不匹配');
 const expected=JSON.parse(JSON.stringify(m.beforePoint));
 expected.tabs.find(t=>t.id==='knowledge').blocks[4].items[3]='剩余任务除以剩余人员效率和，得到后续阶段时间；若求某人的累计工作时间，还须加上该人在此前各阶段实际工作时间。';
 if(digest(expected)!==digest(m.afterPoint)||hash(m.beforePoint)!==m.beforePointSha256||hash(m.afterPoint)!==m.afterPointSha256||hash(m.beforePoint.tabs[0])!==m.beforeTabSha256||hash(m.afterPoint.tabs[0])!==m.afterTabSha256)throw Error('来源迁移超出一句纠错范围');
 for(const item of [...m.historicalFiles,...m.priorG0.engineSnapshots])snapshot(root,item);
 if(digest(read(root,'docs/knowledge-platform/content/notes/memory-v5-version-compatibility.json'))!==FROZEN_DIGEST)throw Error('不可改写旧学习版本兼容基线');
 return m;
}
function historicalBody(root,body){const m=migration(root),old=JSON.parse(JSON.stringify(body));if(m){const index=old.quantity.points.findIndex(p=>p.id===m.beforePoint.id);if(index<0)throw Error('缺少工程来源');old.quantity.points[index]=m.beforePoint;}return old;}
function validateSamples(root,samples,body,frozenCards){
 const m=migration(root);
 if(!m){if(digest(samples.cards)!==digest(frozenCards))throw Error('有限样板不得冒用扩充入口');return null;}
 if(digest(m.beforeSamples.cards)!==digest(frozenCards))throw Error('迁移前样板与冻结身份不一致');
 const original=m.historicalFiles.find(f=>f.originalPath==='docs/knowledge-platform/content/notes/memory-v5-samples.json');
 if(digest(JSON.parse(snapshot(root,original)))!==digest(m.beforeSamples))throw Error('原样板快照不匹配');
 const expected=JSON.parse(JSON.stringify(m.beforeSamples));
 expected.cards.find(c=>c.id==='memory-v5-quantity-work').refs[0].expectedTabSha256=m.afterTabSha256;
 if(digest(samples)!==digest(expected)||digest(m.afterSamples)!==digest(expected))throw Error('当前样板存在未授权的身份或切片变更');
 const current=body.quantity?.points.find(p=>p.id==='work-efficiency');
 if(hash(current)!==m.afterPointSha256)throw Error('工程原文与当前迁移版本不一致');
 const beforeBody=historicalBody(root,body);
 for(const c of samples.cards){const old=resolveCard(frozenCards.find(x=>x.id===c.id),beforeBody),now=resolveCard(c,body);if(digest(old.blocks)!==digest(now.blocks)||old.learningSemanticDigest!==now.learningSemanticDigest||old.semanticVersion!==now.semanticVersion)throw Error('来源迁移改变了已学知识身份');}
 return m;
}
module.exports={MANIFEST,MANIFEST_DIGEST,migration,snapshot,historicalBody,validateSamples};
