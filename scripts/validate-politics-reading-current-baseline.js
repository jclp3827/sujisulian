// Current content gate: preserve the historical receipt, trace every drift to its registered successor,
// then validate the live quick content/flows and the unchanged systematic teaching material.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex');
const historical='docs/knowledge-platform/implementations/evidence/quick-overview-v5-user-view-20261024/result.json';
const successor='docs/knowledge-platform/implementations/evidence/applied-confusion-review-20261025/result.json';
function validate(){
 assert.equal(hash(successor),'46b4622c2b676ec842599b331ce8fc8b225fd2aa6664d3174ef98c8a6d16cfd6','registered successor receipt was changed');
 const previous=read(historical),later=read(successor),registered=new Map(later.files.map(f=>[f.path || f.file,f.sha256]));
 const allowed=new Set(['scripts/lib/politics-systematic-user-comprehension-lineage.js','miniprogram/services/knowledge-platform/learning.js','miniprogram/models/politics-systematic-units-runtime.js','docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json','docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json']);
 const differences=[];for(const f of previous.files){const actual=hash(f.path);if(actual===f.sha256)continue;assert.ok(allowed.has(f.path),'unregistered historical drift: '+f.path);assert.equal(actual,registered.get(f.path),'does not match registered successor: '+f.path);differences.push({path:f.path,historical:f.sha256,registeredCurrent:actual});}
 assert.equal(differences.length,5);
 const lineage=require('./lib/politics-systematic-user-comprehension-lineage').validateUserComprehensionLineage(root,'politics-systematic-package-sync-quick-user-view');
 for(const r of lineage.records){assert.equal(r.teachingContentUnchanged,true);assert.equal(r.proof.visibleContentEqual,true);assert.equal(r.proof.sourcePartsAndBindingsEqual,true);assert.deepEqual(r.proof.changedLessonIds,[]);}
 const base='docs/knowledge-platform/implementations/evidence/applied-confusion-review-20261025/before-files/';
 const before=read(base+'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json'),current=read('docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json');
 assert.equal(current.lessons.length,77);assert.deepEqual(current.lessons,before.lessons);assert.deepEqual(current.groups,before.groups);assert.deepEqual(current.routes,before.routes);
 const quick=require('./validate-politics-quick-reading').validate();assert.equal(quick.status,'passed');
 return {status:'passed-current-content-and-history-trace',historicalReceiptModified:false,historicalSealStillReportsDrift:true,registeredSuccessor:successor,differences,lineageRecords:lineage.records.length,systematicLessonsUnchanged:77,currentQuick:quick};
}
module.exports={validate};if(require.main===module)console.log(JSON.stringify(validate()));
