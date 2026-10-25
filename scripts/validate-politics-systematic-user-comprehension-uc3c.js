const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const {validateUserComprehensionLineage}=require('./lib/politics-systematic-user-comprehension-lineage');
const root=path.resolve(__dirname,'..');
const SOURCE='docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const RUNTIME='miniprogram/models/politics-systematic-units-runtime.js';
const EVIDENCE='docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc3c-20261023.json';
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const source=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
const runtime=require('../miniprogram/models/politics-systematic-units-runtime');
const evidence=JSON.parse(fs.readFileSync(path.join(root,EVIDENCE),'utf8'));
const laterPath=path.join(root,'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc3d-20261023.json');
validateUserComprehensionLineage(root,evidence.batchId);
assert.equal(evidence.progressCompatible,true);assert.equal(evidence.stableLessonIds,true);assert.equal(evidence.orderChanged,false);
if(!fs.existsSync(laterPath)){assert.equal(sha(SOURCE),evidence.sourceSha256);assert.equal(sha(RUNTIME),evidence.runtimeSha256);}
assert.equal(source.lessons.length,72);
for(const lesson of source.lessons){
  assert.ok(!/[？?]|为什么|什么|是否/.test(lesson.title),`${lesson.id} title is still a question`);
  assert.ok(/[？?]$/.test(lesson.question),`${lesson.id} core question is not explicit`);
  assert.ok(/[？?]$/.test(lesson.reflection.prompt),`${lesson.id} self-test is not explicit`);
}
for(const id of ['FOUND-02','DIALECTICS-03','DIALECTICS-05','COGNITION-02']) {
  const prompt=source.lessons.find(item=>item.id===id).reflection.prompt;
  assert.ok(!/某|材料|项目|团队|方案|访谈|成分/.test(prompt),`${id} self-test still uses a scenario`);
}
console.log(JSON.stringify({status:'passed',batch:evidence.batchId,lessons:72,questionStyleTitles:0,simplifiedScenarioSelfTests:4,
  curriculumVersion:runtime.curriculumVersion,progressCompatible:true,realUserAcceptance:evidence.realUserAcceptance}));
