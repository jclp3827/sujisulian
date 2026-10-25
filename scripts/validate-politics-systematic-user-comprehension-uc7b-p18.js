const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const e=read('docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc7b-p18-20261024.json');
require('./lib/politics-systematic-user-comprehension-lineage').validateUserComprehensionLineage(root,e.batchId);
require('./validate-politics-systematic-source-closure');
for(const [key,value] of Object.entries(e))if(key.endsWith('Path'))assert.equal(hash(value),e[key.slice(0,-4)+'Sha256'],key+' drift');
const units=require('../miniprogram/services/knowledge-platform/systematic-units'),pkg=require('../miniprogram/services/knowledge-platform/politics-runtime').knowledgePackage;
const probe=read(e.runtimeProbePath),audit=read(e.auditPath),sources=read(probe.sourceProbePath),samples=read(e.sourcePath);
assert.equal(e.curriculumVersion,units.curriculum.curriculumVersion);assert.equal(e.knowledgePackageVersion,pkg.packageVersion);
assert.equal(probe.screens.length,77);assert.equal(new Set(probe.screens.map(s=>s.lessonId)).size,77);assert.equal(audit.lessons.length,77);assert.equal(new Set(audit.lessons.map(l=>l.lessonId)).size,77);
assert.equal(probe.compileSuccess,true);assert.deepEqual(probe.compileErrors,[]);assert.deepEqual(probe.wxmlErrors,[]);assert.equal(probe.progressProtection.storageRecordByteEquivalent,true);assert.equal(probe.progressProtection.beforeSha256,probe.progressProtection.afterSha256);
for(const screen of probe.screens){
 const lesson=units.curriculum.lessons.find(l=>l.id===screen.lessonId),plan=units.planFor(pkg,{type:'systematic',experienceKind:units.KIND,groupId:lesson.groupId}),index=plan.steps.findIndex(s=>s.lessonId===lesson.id);
 const v=units.project(pkg,plan,{currentIndex:index,status:'active',completedStepIds:[],skippedStepIds:[]});
 assert.equal(screen.closeout,false);assert.equal(screen.title,v.title);assert.equal(screen.question,v.question);assert.deepEqual(screen.partTexts,v.parts.map(p=>p.text));assert.deepEqual(screen.partLabels,v.parts.map(p=>p.label));assert.deepEqual(screen.reflection,v.reflection);assert.deepEqual(screen.keyRuns,v.parts.map(p=>p.runs.filter(r=>r.role==='key').map(r=>r.text)));assert.equal(screen.partKinds.filter(k=>k==='recap').length,1);assert.equal(screen.partLabels.at(-1),'本节结论');
 const row=audit.lessons.find(l=>l.lessonId===lesson.id);assert.ok(row.observation.trim());assert.equal(row.question,v.question);assert.equal(row.answer,v.reflection.answer);assert.equal(row.independentReviewPassed,false);
}
assert.equal(audit.findings.length,11);assert.equal(audit.remainingKnownFindings.length,0);assert.equal(audit.independentReviewer,false);assert.equal(audit.sourceBlind,false);assert.equal(e.independentReviewPerformed,false);assert.equal(e.realUserAcceptance,'pending-for-11-revised-lessons');assert.equal(e.releaseAuthorized,false);
const expectedPaths=require('./lib/politics-systematic-review-paths').buildLessonReviewPaths(samples,units.displayTitleForLessonId);for(const row of audit.lessons)assert.equal(row.displayPath,expectedPaths[row.lessonId].displayPath);
assert.equal(probe.visuals.filter(v=>v.type==='lesson-contact-sheet').length,11);assert.equal(probe.visuals.filter(v=>v.type==='expanded-answer-contact-sheet').length,5);for(const visual of probe.visuals)assert.equal(hash(visual.path),visual.sha256);
assert.equal(sources.checks.length,2);assert.equal(sources.progressRecordByteEquivalent,true);assert.equal(hash(probe.sourceProbePath),probe.sourceProbeSha256);for(const check of sources.checks){assert.equal(check.version,e.curriculumVersion);assert.equal(hash(check.screenshot),check.screenshotSha256);}assert.equal(hash(sources.correctionScreenshot.path),sources.correctionScreenshot.sha256);
const sourceBlock=pkg.knowledgeUnits.flatMap(u=>u.blocks).find(b=>b.id==='block:politics-toc-v2-u033:b012');assert.equal(sourceBlock.sourceCorrection.correctionBlockId,'block:politics-toc-v2-u033:b901');
function validateFixes(lessons){const by=Object.fromEntries(lessons.map(l=>[l.id,l]));
 assert.doesNotMatch(by['VALUE-01'].sections.map(p=>p.text).join(''),/价值通过使用价值表现出来/);assert.ok(by['VALUE-01'].sections.some(p=>p.text.includes('交换价值是价值的表现形式')&&p.sourceBlockIds.includes('block:politics-toc-v2-u033:b901')));
 for(const text of ['国家统一领导','各少数民族聚居','设立自治机关','依法行使自治权'])assert.ok(by['DEMOCRACY-01'].sections.some(p=>p.text.includes(text)));
 for(const text of ['制度建设贯穿','反腐败斗争','管党治党政治责任','自我革命'])assert.ok(by['TEN-04'].reflection.answer.includes(text));
 for(const text of ['相互依存','相互贯通','相互排斥','相互分离'])assert.ok(by['DIALECTICS-02'].reflection.answer.includes(text));
 assert.match(by['COGNITION-03'].reflection.answer,/绝对性说明/);assert.match(by['COGNITION-03'].reflection.answer,/相对性说明/);
 for(const id of ['DEV-01','MOD-03'])assert.ok(!by[id].sections.some(p=>p.label.endsWith('的区别')),'duplicate responsibility '+id);
 assert.ok(!by['SECURITY-03'].recap.text.includes('听党指挥、能打胜仗、作风优良'),'recap copies full target');assert.doesNotMatch(by['COGNITION-01'].recap.text,/来源、动力、目的和检验标准/);
 assert.ok(!by['LEADERSHIP-03'].question.startsWith('为什么'));assert.ok(!by['LEADERSHIP-03'].reflection.answer.startsWith('不是'));
 assert.doesNotMatch(by['MONEY-01'].sections.map(p=>p.text).join(''),/前者在表现衡量/);
}
validateFixes(samples.lessons);let rejected=0;for(const finding of audit.findings){const copy=JSON.parse(JSON.stringify(samples.lessons)),index=copy.findIndex(l=>l.id===finding.lessonId);copy[index]=finding.before;assert.throws(()=>validateFixes(copy),undefined,'old regression not detected '+finding.lessonId);rejected++;}
console.log(JSON.stringify({status:'passed',version:e.curriculumVersion,reviewed:77,revised:11,runtimeLessons:77,visualLessons:11,expandedAnswers:5,oldDefectsRejected:rejected,progressPreserved:true,independentReviewer:false,userAcceptance:'pending'}));
