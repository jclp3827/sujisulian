#!/usr/bin/env node
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const batch='politics-systematic-user-comprehension-uc7b-p13',e=read('docs/knowledge-platform/implementations/evidence/'+batch+'-20261024.json'),s=read(e.sourcePath),runtime=require(path.join(root,e.runtimePath));
const {latest}=require('./lib/politics-systematic-user-comprehension-lineage').validateUserComprehensionLineage(root,batch);assert.equal(latest.batchId,batch);assert.equal(e.status,'candidate-integrated-runtime-verified-user-sample-pending');
assert.equal(e.curriculumVersion,runtime.curriculumVersion);assert.equal(e.previousCurriculumVersion,'units-844b2cb3b72f');assert.ok(runtime.progressCompatibleVersions.includes(e.previousCurriculumVersion));assert.equal(e.stableLessonIds,true);assert.equal(e.orderChanged,false);
for(const n of ['source','inventory','runtime','projection','wxml','wxss','governance','runtimeProbe','historicalRegionAudit','retrospectiveAudit','predecessorAcceptance'])assert.equal(hash(e[n+'Path']),e[n+'Sha256'],n+' hash drift');
const acceptance=read(e.predecessorAcceptancePath);assert.equal(acceptance.status,'passed');assert.equal(acceptance.acceptanceMode,'user-sampling');assert.equal(acceptance.individuallySampledLessonIds,null);
const projection=require(path.join(root,e.projectionPath)),paths=require('./lib/politics-systematic-review-paths').buildLessonReviewPaths(s,projection.displayTitleForLessonId),probe=read(e.runtimeProbePath);
assert.equal(probe.status,'passed');assert.equal(probe.curriculumVersion,e.curriculumVersion);assert.equal(probe.compileSuccess,true);assert.deepEqual(probe.wxmlErrors,[]);assert.equal(probe.progressProtection.storageRecordByteEquivalent,true);assert.deepEqual(probe.lessonIds,e.contentChangedLessonIds);
assert.deepEqual(e.contentChangedLessonIds,['MOD-03','COGNITION-03','DIALECTICS-02','DIALECTICS-04','HISTORY-03']);
for(const id of e.contentChangedLessonIds){const l=s.lessons.find(l=>l.id===id),b=e.before[id],screen=probe.screens.find(x=>x.lessonId===id);assert.deepEqual(l,e.after[id]);assert.deepEqual(e.reviewPaths[id],paths[id]);
 if(id!=='HISTORY-03'&&id!=='DIALECTICS-04')assert.deepEqual(l.reflection,b.reflection,id+' answer drift');assert.deepEqual(l.corePromises,b.corePromises,id+' promise drift');
 l.sections.forEach((p,i)=>{const normalize=t=>t.replace(/[；，\n]/g,'');assert.equal(normalize(p.text),normalize(b.sections[i].text),id+' factual text changed');assert.deepEqual(p.sourceBlockIds,b.sections[i].sourceBlockIds);assert.deepEqual(e.scoreMappings[id][i].scoringAnchors,p.emphasis.map(x=>x.quote));assert.deepEqual(screen.keyRuns[i],p.emphasis.map(x=>x.quote).sort((a,c)=>p.text.indexOf(a)-p.text.indexOf(c)),id+' actual emphasis drift');});
 assert.equal(screen.partLabels.at(-1),'本节结论');assert.equal(screen.partKinds.filter(x=>x==='recap').length,1);assert.equal(screen.partTexts.at(-1),l.recap.text);assert.deepEqual(screen.partTexts.slice(0,l.sections.length),l.sections.map(p=>p.text));
}
const byId=Object.fromEntries(s.lessons.map(l=>[l.id,l]));
assert.equal(byId['DIALECTICS-02'].boundary,undefined);assert.equal(byId['DIALECTICS-04'].boundary,undefined);assert.ok(byId['HISTORY-03'].boundary);
assert.match(byId['HISTORY-03'].recap.text,/经济基础决定上层建筑，上层建筑反作用于经济基础/);
assert.equal(byId['HISTORY-03'].question,byId['HISTORY-03'].reflection.prompt);
assert.doesNotMatch(byId['DIALECTICS-04'].recap.text,/下一|再看|量变/);
assert.equal(byId['MOD-03'].sections[0].text.split('\n').length,10);assert.equal(byId['MOD-03'].sections[2].text.split('\n').length,6);
assert.equal(byId['MOD-03'].sections[0].emphasis.length,9);assert.equal(byId['MOD-03'].sections[2].emphasis.length,5);
assert.equal(paths['DIALECTICS-02'].lessonTitle,'矛盾的同一性、斗争性、普遍性与特殊性');
assert.equal(e.sourceBindingsChanged,true);assert.equal(e.realUserAcceptance,'pending');assert.equal(e.releaseAuthorized,false);assert.equal(e.visualReview.independentReviewer,false);assert.equal(e.visualReview.width320Verified,false);
for(const shot of e.visualReview.inspectedScreenshots)assert.equal(hash(shot.path),shot.sha256);
const retro=read(e.retrospectiveAuditPath);assert.equal(retro.scope.sectionEmphasisGapCount,0);assert.equal(retro.scope.currentBoundaryLessonCount,22);assert.equal(retro.scope.historicallyChangedLessonCount,45);assert.equal(read(e.historicalRegionAuditPath).scope.openRiskCount,0);
console.log(JSON.stringify({status:'passed',batch,curriculumVersion:e.curriculumVersion,lessons:5,sourceBindingsChanged:true,emptyEmphasisSections:0,runtimePageCheck:e.runtimePageCheck,realUserAcceptance:e.realUserAcceptance}));
