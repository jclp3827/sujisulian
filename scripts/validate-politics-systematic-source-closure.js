const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const units = require('../miniprogram/services/knowledge-platform/systematic-units');
const platform = require('../miniprogram/services/knowledge-platform');
const {knowledgePackage: pkg} = require('../miniprogram/services/knowledge-platform/politics-runtime');
const baseline = require('../docs/knowledge-platform/implementations/evidence/politics-systematic-p17-preserved-baseline-20261024.json');
const registry = require('../docs/knowledge-pilot/sources/politics/primary-supplements-20261024.json');
const inventory = require('../docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json');
const copy = x => JSON.parse(JSON.stringify(x));
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const added = ['SYS-06','SYS-07','SYS-08','BASICS-05','BASICS-06'];
assert.equal(units.curriculum.lessons.length,77);
assert.deepEqual(units.curriculum.lessons.filter(l=>!added.includes(l.id)).map(l=>l.id),baseline.lessonIds);
const blocks = new Map(pkg.knowledgeUnits.flatMap(u=>u.blocks.map(b=>[b.id,b])));
assert.equal(baseline.originalBlocks.length,643);
for(const block of baseline.originalBlocks) assert.equal(sha(blocks.get(block.id).fallbackText||''),block.textSha256,'original source changed '+block.id);
assert.equal(registry.sources.length,20);assert.equal(registry.blocks.length,34);
assert.equal(registry.published,false);assert.equal(inventory.gaps.length,0);assert.equal(inventory.resolvedGaps.length,3);
for(const block of registry.blocks) {
  const current=blocks.get('block:'+block.unitId+':'+block.id);
  assert.equal(current.publishable,false);
  assert.deepEqual(current.sourceRefIds,block.sourceRefIds);
  assert.ok(current.sourceRefIds.every(id=>id.startsWith('source:politics-supplement:')),'supplement attributed to old scan');
}
for (const unitId of ['politics-toc-v2-u003','politics-toc-v2-u020','politics-toc-v2-u037','politics-toc-v2-u033','politics-toc-v2-u008']) {
  const card = platform.projectKnowledgeCardSurfaceViewModel(pkg,unitId,{activity:'reading'});
  assert.ok(card.sources.filter(source=>source.supplemental).every(source=>source.sourceName !== '政治理论 PDF' && source.sourceUrl.startsWith('https://')));
  for (const block of card.semanticBlocks.filter(block=>block.sourceRefIds.some(id=>id.startsWith('source:politics-supplement:')))) assert.ok(block.supplementalSourceLabel && block.supplementalLocator);
}
let migrations=0;
for(const group of baseline.groupLessonIds) {
  const current=units.curriculum.groups.find(g=>g.id===group.id);
  assert.deepEqual(current.lessonIds.slice(0,group.lessonIds.length),group.lessonIds,'existing lesson order changed');
  const plan=units.planFor(pkg,{type:'systematic',experienceKind:units.KIND,groupId:group.id});
  const raw=platform.createRouteSession(plan,1);
  Object.assign(raw,{planId:`route:politics:systematic:${group.id}:${baseline.curriculumVersion}`,curriculumVersion:baseline.curriculumVersion,packageVersion:baseline.knowledgePackageVersion,currentIndex:group.lessonIds.length-1,status:'completed',completedStepIds:group.lessonIds.slice(0,-1).map(id=>'systematic-unit:'+id),skippedStepIds:['systematic-unit:'+group.lessonIds.at(-1)],completedAt:2});
  const before=copy(raw);const session=units.normalize(plan,raw,()=>assert.fail('must not reset saved progress'));
  assert.deepEqual(raw,before,'migration mutates stored input');
  assert.deepEqual(session.completedStepIds,raw.completedStepIds);assert.deepEqual(session.skippedStepIds,raw.skippedStepIds);
  assert.equal(session.packageVersion,pkg.packageVersion);
  if(current.lessonIds.length>group.lessonIds.length) {
    assert.equal(session.status,'active');assert.equal(session.currentIndex,group.lessonIds.length);
    assert.equal(session.currentStepId,'systematic-unit:'+current.lessonIds[group.lessonIds.length]);
    assert.ok(current.lessonIds.slice(group.lessonIds.length).every(id=>!session.completedStepIds.includes('systematic-unit:'+id)&&!session.skippedStepIds.includes('systematic-unit:'+id)));
    const broken=copy(raw);broken.completedStepIds.shift();assert.equal(units.normalize(plan,broken,()=>null).status,'expired','missing old progress silently accepted');
    const forged=copy(raw);forged.curriculumVersion=plan.curriculumVersion;forged.planId=plan.id;assert.equal(units.normalize(plan,forged,()=>null).status,'expired','current incomplete completion accepted');
  } else assert.equal(session.status,'completed');
  const active=copy(raw);active.status='active';active.currentIndex=0;active.completedStepIds=[];active.skippedStepIds=[];
  const resumed=units.normalize(plan,active,()=>null);assert.equal(resumed.currentIndex,0);assert.equal(resumed.status,'active');
  const alien=copy(raw);alien.packageVersion='unknown';assert.equal(units.normalize(plan,alien,()=>null).status,'expired');
  migrations++;
}
const summary={status:'passed',lessons:77,preservedOldLessonIds:72,unchangedOriginalSourceBlocks:643,newSourceBlocks:34,newPrimaryReferences:20,oldGroupMigrationCases:migrations,expandedCompletedGroupsReopened:2,newLessonsRemainUnread:true,missingOldProgressRejected:true,releaseAuthorized:false};
console.log(JSON.stringify(summary));
module.exports=summary;
