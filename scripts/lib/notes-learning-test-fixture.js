// Historical engineering fixtures only. Never imported by application or build code.
const path=require('path');const fs=require('fs');
function legacyFixture(root=path.resolve(__dirname,'../..')){
 const compiler=require(path.join(root,'scripts/lib/notes-learning-compiler'));
 const runtime=require(path.join(root,'miniprogram/subpackages/note/services/learning-content'));
 const source=JSON.parse(fs.readFileSync(path.join(root,'docs/knowledge-platform/implementations/evidence/notes-learning-exam-v4-legacy-source-20261022.json'),'utf8'));
 const compile=(s,b)=>compiler.compile(s,b,{legacyFixture:true});
 const availableContent=(b,p,d)=>runtime.availableContent(b,p,d,{legacyFixture:true});
 const body=compiler.loadBody(root),pack=compile(source,body);
 return {source,body,pack,content:availableContent(body,pack,true),compile,availableContent};
}
module.exports={legacyFixture};
