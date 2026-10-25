const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const e=read('docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p17-20261024.json');
require('./lib/politics-systematic-user-comprehension-lineage').validateUserComprehensionLineage(root,e.batchId);
require('./validate-politics-systematic-source-closure');
for(const [key,value] of Object.entries(e)) if(key.endsWith('Path')) assert.equal(hash(value),e[key.slice(0,-4)+'Sha256'],key+' drift');
const units=require('../miniprogram/services/knowledge-platform/systematic-units'),pkg=require('../miniprogram/services/knowledge-platform/politics-runtime').knowledgePackage;
const probe=read(e.runtimeProbePath),coverage=read(e.coveragePath),sources=read(probe.sourceProbePath);
assert.equal(e.curriculumVersion,units.curriculum.curriculumVersion);assert.equal(e.knowledgePackageVersion,pkg.packageVersion);
assert.equal(probe.screens.length,77);assert.equal(new Set(probe.screens.map(s=>s.lessonId)).size,77);
assert.equal(probe.compileSuccess,true);assert.deepEqual(probe.compileErrors,[]);assert.deepEqual(probe.wxmlErrors,[]);
assert.equal(probe.progressProtection.storageRecordByteEquivalent,true);assert.equal(probe.progressProtection.beforeSha256,probe.progressProtection.afterSha256);
for(const screen of probe.screens) {
 const lesson=units.curriculum.lessons.find(l=>l.id===screen.lessonId);
 const plan=units.planFor(pkg,{type:'systematic',experienceKind:units.KIND,groupId:lesson.groupId});
 const index=plan.steps.findIndex(s=>s.lessonId===lesson.id),v=units.project(pkg,plan,{currentIndex:index,status:'active',completedStepIds:[],skippedStepIds:[]});
 assert.equal(screen.closeout,false);assert.equal(screen.title,v.title);assert.equal(screen.question,v.question);
 assert.deepEqual(screen.partTexts,v.parts.map(p=>p.text));assert.deepEqual(screen.partLabels,v.parts.map(p=>p.label));
 assert.deepEqual(screen.keyRuns,v.parts.map(p=>p.runs.filter(r=>r.role==='key').map(r=>r.text)));
 assert.deepEqual(screen.partKinds,v.parts.map(p=>p.kind));assert.deepEqual(screen.partEmphasis,v.parts.map(p=>Boolean(p.emphasized)));
 assert.deepEqual(screen.reflection,v.reflection);
 assert.equal(screen.partKinds.filter(k=>k==='recap').length,1);
 assert.equal(screen.partLabels.at(-1),'本节结论');
}
assert.equal(probe.visuals.length,7);for(const visual of probe.visuals)assert.equal(hash(visual.path),visual.sha256);
assert.equal(sources.checks.length,3);assert.equal(sources.progressRecordByteEquivalent,true);assert.equal(hash(probe.sourceProbePath),probe.sourceProbeSha256);
for(const check of sources.checks){assert.equal(check.version,e.curriculumVersion);assert.ok(check.targetBlock.supplementalSourceLabel);assert.equal(hash(check.screenshot),check.screenshotSha256);}
assert.equal(coverage.lessons.length,77);assert.deepEqual(coverage.retainedHoldLessonIds,[]);assert.deepEqual(e.resolvedGapIds,['GAP-01','GAP-02','GAP-03']);
assert.equal(e.realUserAcceptance,'pending');assert.equal(e.independentReviewPerformed,false);assert.equal(e.width320Verified,false);assert.equal(e.realDeviceVerified,false);assert.equal(e.releaseAuthorized,false);
console.log(JSON.stringify({status:'passed',curriculumVersion:e.curriculumVersion,runtimeLessons:77,currentVisualLessons:7,inheritedUnchangedBodies:70,sourceEntrypoints:3,progressPreserved:true,userAcceptance:'pending',independentReview:'not-performed'}));
