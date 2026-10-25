const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {validateUserComprehensionLineage}=require('./lib/politics-systematic-user-comprehension-lineage');
const root=path.resolve(__dirname,'..');const evidence=JSON.parse(fs.readFileSync(path.join(root,'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc3d-20261023.json'),'utf8'));
const source=JSON.parse(fs.readFileSync(path.join(root,evidence.sourcePath),'utf8'));const runtime=require('../miniprogram/models/politics-systematic-units-runtime');
validateUserComprehensionLineage(root,evidence.batchId);assert.equal(evidence.progressCompatible,true);
assert.equal(source.lessons.find(item=>item.id==='DIALECTICS-02').title,'矛盾的同一性、斗争性、普遍性与特殊性');
assert.equal(source.lessons.find(item=>item.id==='TEN-03').sections[3].label,'高质量发展与统筹发展和安全');
assert.equal(source.lessons.find(item=>item.id==='SECURITY-01').question,'人民安全、政治安全与经济安全的定位分别是什么？');
console.log(JSON.stringify({status:'passed',batch:evidence.batchId,changedLessons:3,curriculumVersion:runtime.curriculumVersion,progressCompatible:true,realUserAcceptance:evidence.realUserAcceptance}));
