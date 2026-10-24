// Historical engineering fixtures only. Never imported by application or build code.
const path=require('path');const fs=require('fs');
function rebindFixtureSource(source,body){
 // Only fresh artificial fixtures are rebound. Frozen evidence and production sources are never written.
 const crypto=require('crypto'),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
 function visit(v){if(Array.isArray(v)){v.forEach(visit);return;}if(!v||typeof v!=='object')return;if(v.subjectId&&v.pointId&&v.tabId){const tab=body[v.subjectId]?.points.find(p=>p.id===v.pointId)?.tabs.find(t=>t.id===v.tabId);if(!tab)throw Error('Fixture source missing');if('expectedSha256'in v)v.expectedSha256=hash(tab);if('expectedBlockSha256'in v){const index=v.blockIndex??v.initialBlockIndex;if(Number.isInteger(index))v.expectedBlockSha256=hash(tab.blocks[index]);}}Object.values(v).forEach(visit);}
 visit(source);return source;
}
function legacyFixture(root=path.resolve(__dirname,'../..')){
 const compiler=require(path.join(root,'scripts/lib/notes-learning-compiler'));
 const runtime=require(path.join(root,'miniprogram/subpackages/note/services/learning-content'));
 const source=JSON.parse(fs.readFileSync(path.join(root,'docs/knowledge-platform/implementations/evidence/notes-learning-exam-v4-legacy-source-20261022.json'),'utf8'));
 const compile=(s,b)=>compiler.compile(s,b,{legacyFixture:true});
 const availableContent=(b,p,d)=>runtime.availableContent(b,p,d,{legacyFixture:true});
 const body=compiler.loadBody(root);rebindFixtureSource(source,body);const pack=compile(source,body);
 return {source,body,pack,content:availableContent(body,pack,true),compile,availableContent};
}
module.exports={legacyFixture,rebindFixtureSource};
