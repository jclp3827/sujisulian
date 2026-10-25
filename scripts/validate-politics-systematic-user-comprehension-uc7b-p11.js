#!/usr/bin/env node
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'), read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')), digest=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const batch='politics-systematic-user-comprehension-uc7b-p11',dir='docs/knowledge-platform/implementations/evidence/';
const e=read(dir+batch+'-20261024.json'),s=read(e.sourcePath),runtime=require(path.join(root,e.runtimePath));
const {latest}=require('./lib/politics-systematic-user-comprehension-lineage').validateUserComprehensionLineage(root,batch);
assert.equal(latest.batchId,batch);assert.equal(e.status,'candidate-integrated-runtime-verified-user-sample-pending');
assert.equal(e.curriculumVersion,runtime.curriculumVersion);assert.equal(e.previousCurriculumVersion,'units-5bf5826f6d68');
assert.equal(e.stableLessonIds,true);assert.equal(e.orderChanged,false);assert.equal(e.changeScope,'section-emphasis-and-dev04-recap');
assert.ok(runtime.progressCompatibleVersions.includes(e.previousCurriculumVersion));
const acceptance=read(e.predecessorAcceptancePath);assert.equal(acceptance.status,'passed');assert.equal(acceptance.acceptanceMode,'user-sampling');assert.equal(acceptance.individuallySampledLessonIds,null);assert.equal(digest(e.predecessorAcceptancePath),e.predecessorAcceptanceSha256);
for(const n of ['source','inventory','runtime','projection','wxml','wxss','governance','runtimeProbe','historicalRegionAudit','retrospectiveAudit'])assert.equal(digest(e[n+'Path']),e[n+'Sha256'],n+' hash drift');
const strip=l=>{l=structuredClone(l);for(const p of l.sections)delete p.emphasis;return l;};
const projection=require(path.join(root,e.projectionPath));
const paths=require('./lib/politics-systematic-review-paths').buildLessonReviewPaths(s,projection.displayTitleForLessonId);
const probe=read(e.runtimeProbePath);
assert.equal(probe.status,'passed');assert.equal(probe.curriculumVersion,e.curriculumVersion);assert.equal(probe.compileSuccess,true);assert.deepEqual(probe.wxmlErrors,[]);assert.equal(probe.progressProtection.storageRecordByteEquivalent,true);
assert.deepEqual(probe.lessonIds,e.contentChangedLessonIds);
for(const id of e.contentChangedLessonIds){
 const l=s.lessons.find(x=>x.id===id);const allowedBefore=strip(e.before[id]);if(id==='DEV-04')allowedBefore.recap.text=l.recap.text;assert.deepEqual(allowedBefore,strip(l),id+' unauthorized knowledge/binding change');assert.deepEqual(e.after[id],l,id+' candidate snapshot drift');assert.deepEqual(e.reviewPaths[id],paths[id]);
 const screen=probe.screens.find(x=>x.lessonId===id);assert.ok(screen);assert.deepEqual(screen.partTexts.slice(0,l.sections.length),l.sections.map(p=>p.text));
 assert.equal(screen.partKinds.filter(x=>x==='recap').length,1);assert.equal(screen.partLabels.at(-1),'本节结论');
 for(let i=0;i<l.sections.length;i++){
  assert.deepEqual(screen.keyRuns[i],l.sections[i].emphasis.map(x=>x.quote).sort((a,b)=>l.sections[i].text.indexOf(a)-l.sections[i].text.indexOf(b)),id+' actual key runs drift');
  assert.deepEqual(e.scoreMappings[id][i].scoringAnchors,l.sections[i].emphasis.map(x=>x.quote));
  for(const q of l.sections[i].emphasis)assert.ok(l.sections[i].text.includes(q.quote));
 }
}
assert.deepEqual(e.contentChangedLessonIds,['VALUE-02','DEV-01','DEV-04','COGNITION-01','SECURITY-03']);
const audit=read(e.historicalRegionAuditPath);assert.equal(audit.scope.openRiskCount,0);assert.equal(audit.scope.previouslyAcceptedLessonCount,44);
const retro=read(e.retrospectiveAuditPath);assert.equal(retro.scope.sectionEmphasisGapCount,7);
assert.equal(e.sourceBindingsChanged,false);assert.deepEqual(e.sourceTextChangedLessonIds,['DEV-04']);assert.match(s.lessons.find(l=>l.id==='DEV-04').recap.text,/三个方面规定经济运行的基本制度安排/);assert.equal(e.realUserAcceptance,'pending');assert.equal(e.releaseAuthorized,false);
assert.equal(e.visualReview.independentReviewer,false);assert.equal(e.visualReview.width320Verified,false);
for(const shot of e.visualReview.inspectedScreenshots)assert.equal(digest(shot.path),shot.sha256);
console.log(JSON.stringify({status:'passed',batch,curriculumVersion:e.curriculumVersion,lessons:e.contentChangedLessonIds.length,sourceTextChangedLessonIds:e.sourceTextChangedLessonIds,emptyEmphasisSections:retro.scope.sectionEmphasisGapCount,regionOpenRiskCount:audit.scope.openRiskCount,runtimePageCheck:e.runtimePageCheck,realUserAcceptance:e.realUserAcceptance}));
