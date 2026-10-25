#!/usr/bin/env node
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const batch='politics-systematic-user-comprehension-uc7b-p12',e=read('docs/knowledge-platform/implementations/evidence/'+batch+'-20261024.json'),s=read(e.sourcePath),runtime=require(path.join(root,e.runtimePath));
const {latest}=require('./lib/politics-systematic-user-comprehension-lineage').validateUserComprehensionLineage(root,batch);assert.equal(latest.batchId,batch);assert.equal(e.status,'candidate-integrated-runtime-verified-user-sample-pending');
assert.equal(e.curriculumVersion,runtime.curriculumVersion);assert.equal(e.previousCurriculumVersion,'units-8e66a1a784ef');assert.ok(runtime.progressCompatibleVersions.includes(e.previousCurriculumVersion));assert.equal(e.stableLessonIds,true);assert.equal(e.orderChanged,false);
for(const n of ['source','inventory','runtime','projection','wxml','wxss','governance','runtimeProbe','historicalRegionAudit','retrospectiveAudit','predecessorAcceptance'])assert.equal(hash(e[n+'Path']),e[n+'Sha256'],n+' hash drift');
const acceptance=read(e.predecessorAcceptancePath);assert.equal(acceptance.status,'passed');assert.equal(acceptance.acceptanceMode,'user-sampling');assert.equal(acceptance.individuallySampledLessonIds,null);
const projection=require(path.join(root,e.projectionPath)),paths=require('./lib/politics-systematic-review-paths').buildLessonReviewPaths(s,projection.displayTitleForLessonId),probe=read(e.runtimeProbePath);
assert.equal(probe.status,'passed');assert.equal(probe.curriculumVersion,e.curriculumVersion);assert.equal(probe.compileSuccess,true);assert.deepEqual(probe.wxmlErrors,[]);assert.equal(probe.progressProtection.storageRecordByteEquivalent,true);assert.deepEqual(probe.lessonIds,e.contentChangedLessonIds);
assert.deepEqual(e.contentChangedLessonIds,['FOUND-01','FOUND-03','DIALECTICS-03','DIALECTICS-05','HISTORY-02']);
for(const id of e.contentChangedLessonIds){const l=s.lessons.find(l=>l.id===id),b=e.before[id],screen=probe.screens.find(x=>x.lessonId===id);assert.deepEqual(l,e.after[id]);assert.deepEqual(e.reviewPaths[id],paths[id]);
 assert.deepEqual(l.reflection,b.reflection,id+' answer drift');assert.deepEqual(l.corePromises,b.corePromises,id+' promise drift');assert.deepEqual(l.recap.sourceBlockIds,b.recap.sourceBlockIds);
 l.sections.forEach((p,i)=>{assert.equal(p.text,b.sections[i].text,id+' factual text changed');assert.deepEqual(p.sourceBlockIds,b.sections[i].sourceBlockIds);assert.deepEqual(e.scoreMappings[id][i].scoringAnchors,p.emphasis.map(x=>x.quote));assert.deepEqual(screen.keyRuns[i],p.emphasis.map(x=>x.quote).sort((a,c)=>p.text.indexOf(a)-p.text.indexOf(c)),id+' actual emphasis drift');});
 assert.equal(screen.partLabels.at(-1),'本节结论');assert.equal(screen.partKinds.filter(x=>x==='recap').length,1);assert.equal(screen.partTexts.at(-1),l.recap.text);assert.deepEqual(screen.partTexts.slice(0,l.sections.length),l.sections.map(p=>p.text));
}
const byId=Object.fromEntries(s.lessons.map(l=>[l.id,l]));
assert.equal(byId['FOUND-01'].sections.length,2);assert.equal(byId['FOUND-01'].recap.text,e.before['FOUND-01'].recap.text);
assert.equal(byId['DIALECTICS-03'].boundary,undefined);assert.equal(byId['DIALECTICS-05'].boundary,undefined);assert.equal(byId['HISTORY-02'].boundary.text,'生产关系须适合生产力状况，不是静止不变，也不是越超前越好。');
assert.equal(byId['DIALECTICS-03'].question,byId['DIALECTICS-03'].reflection.prompt);assert.equal(byId['HISTORY-02'].question,byId['HISTORY-02'].reflection.prompt);
assert.match(byId['HISTORY-02'].recap.text,/生产力决定生产关系，生产关系反作用于生产力/);assert.match(byId['FOUND-03'].recap.text,/共同的理论基础/);
assert.equal(e.sourceBindingsChanged,false);assert.equal(e.realUserAcceptance,'pending');assert.equal(e.releaseAuthorized,false);assert.equal(e.visualReview.independentReviewer,false);assert.equal(e.visualReview.width320Verified,false);
for(const shot of e.visualReview.inspectedScreenshots)assert.equal(hash(shot.path),shot.sha256);
const retro=read(e.retrospectiveAuditPath);assert.equal(retro.scope.sectionEmphasisGapCount,2);assert.equal(retro.scope.currentBoundaryLessonCount,24);assert.equal(retro.scope.historicallyChangedLessonCount,45);assert.equal(read(e.historicalRegionAuditPath).scope.openRiskCount,0);
console.log(JSON.stringify({status:'passed',batch,curriculumVersion:e.curriculumVersion,lessons:5,sourceBindingsChanged:false,emptyEmphasisSections:2,runtimePageCheck:e.runtimePageCheck,realUserAcceptance:e.realUserAcceptance}));
