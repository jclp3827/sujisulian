#!/usr/bin/env node
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const batch='politics-systematic-user-comprehension-uc7b-p14',e=read('docs/knowledge-platform/implementations/evidence/'+batch+'-20261024.json'),s=read(e.sourcePath),runtime=require(path.join(root,e.runtimePath));
const {latest}=require('./lib/politics-systematic-user-comprehension-lineage').validateUserComprehensionLineage(root,batch);assert.equal(latest.batchId,batch);assert.equal(e.status,'candidate-integrated-runtime-verified-user-sample-pending');
assert.equal(e.curriculumVersion,runtime.curriculumVersion);assert.equal(e.previousCurriculumVersion,'units-655d47d081cb');assert.ok(runtime.progressCompatibleVersions.includes(e.previousCurriculumVersion));assert.equal(e.stableLessonIds,true);assert.equal(e.orderChanged,false);
for(const n of ['source','inventory','runtime','projection','wxml','wxss','governance','runtimeProbe','historicalRegionAudit','retrospectiveAudit','predecessorAcceptance'])assert.equal(hash(e[n+'Path']),e[n+'Sha256'],n+' hash drift');
const acceptance=read(e.predecessorAcceptancePath);assert.equal(acceptance.status,'passed');assert.equal(acceptance.acceptanceMode,'user-sampling');assert.equal(acceptance.individuallySampledLessonIds,null);
const projection=require(path.join(root,e.projectionPath)),paths=require('./lib/politics-systematic-review-paths').buildLessonReviewPaths(s,projection.displayTitleForLessonId),probe=read(e.runtimeProbePath);
assert.equal(probe.status,'passed');assert.equal(probe.curriculumVersion,e.curriculumVersion);assert.equal(probe.compileSuccess,true);assert.deepEqual(probe.wxmlErrors,[]);assert.equal(probe.progressProtection.storageRecordByteEquivalent,true);assert.deepEqual(probe.lessonIds,e.contentChangedLessonIds);
assert.deepEqual(e.contentChangedLessonIds,['BASICS-02','BASICS-03','COGNITION-02','HISTORY-01','DIALECTICS-01']);
for(const id of e.contentChangedLessonIds){const l=s.lessons.find(l=>l.id===id),b=e.before[id],screen=probe.screens.find(x=>x.lessonId===id);assert.deepEqual(l,e.after[id]);assert.equal(screen.closeout,false,id+' expected visible lesson body');assert.deepEqual(e.reviewPaths[id],paths[id]);
 assert.equal(l.reflection.prompt,b.reflection.prompt);assert.equal(l.reflection.answer,b.reflection.answer);assert.deepEqual(l.corePromises?.map(p=>p.quote),b.corePromises?.map(p=>p.quote));
 l.sections.forEach((p,i)=>{if(id==='BASICS-02'){assert.ok(b.sections.some(old=>old.text.replace(/[；。]/g,'').includes(p.text.replace(/[；。]/g,''))),id+' resegmented text drift');const oldSources=new Set(b.sections.flatMap(old=>old.sourceBlockIds));assert.ok(p.sourceBlockIds.every(block=>oldSources.has(block)));}else{assert.equal(p.text,b.sections[i].text,id+' factual text drift');assert.deepEqual(p.sourceBlockIds,b.sections[i].sourceBlockIds);}assert.deepEqual(e.scoreMappings[id][i].scoringAnchors,p.emphasis.map(x=>x.quote));assert.deepEqual(screen.keyRuns[i],p.emphasis.map(x=>x.quote).sort((a,c)=>p.text.indexOf(a)-p.text.indexOf(c)),id+' emphasis drift');});
 assert.equal(screen.partLabels.at(-1),'本节结论');assert.equal(screen.partKinds.filter(x=>x==='recap').length,1);assert.equal(screen.partTexts.at(-1),l.recap.text);assert.deepEqual(screen.partTexts.slice(0,l.sections.length),l.sections.map(p=>p.text));
}
const byId=Object.fromEntries(s.lessons.map(l=>[l.id,l]));
assert.equal(byId['BASICS-02'].boundary,undefined);assert.equal(byId['BASICS-03'].boundary,undefined);
assert.equal(byId['BASICS-02'].sections.length,3);assert.deepEqual(byId['BASICS-02'].sections[1].sourceBlockIds,['block:politics-toc-v2-u021:b005']);
assert.equal(byId['COGNITION-02'].question,'认识的两次飞跃分别是什么？');assert.equal(byId['COGNITION-02'].sections.length,4);
assert.match(byId['DIALECTICS-01'].sections[0].emphasis[1].quote,/^普遍联系不等于/);
assert.doesNotMatch(byId['DIALECTICS-01'].recap.text,/客观性、普遍性、多样性/);
assert.equal(paths['DIALECTICS-01'].lessonTitle,'联系、整体与部分、新旧事物');
assert.equal(e.sourceBindingsChanged,true);assert.equal(e.realUserAcceptance,'pending');assert.equal(e.releaseAuthorized,false);assert.equal(e.visualReview.independentReviewer,false);assert.equal(e.visualReview.width320Verified,false);
for(const shot of e.visualReview.inspectedScreenshots)assert.equal(hash(shot.path),shot.sha256);
const retro=read(e.retrospectiveAuditPath);assert.equal(retro.scope.sectionEmphasisGapCount,0);assert.equal(retro.scope.currentBoundaryLessonCount,20);assert.equal(retro.scope.historicallyChangedLessonCount,45);assert.equal(read(e.historicalRegionAuditPath).scope.openRiskCount,0);
console.log(JSON.stringify({status:'passed',batch,curriculumVersion:e.curriculumVersion,lessons:5,sourceBindingsChanged:true,emptyEmphasisSections:0,runtimePageCheck:e.runtimePageCheck,realUserAcceptance:e.realUserAcceptance}));
