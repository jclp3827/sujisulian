const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const dir = 'docs/knowledge-platform/implementations/evidence/quick-overview-v5-user-view-20261024/';
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const findings = review => [...review.sections.flatMap(s=>s.findings || []), ...(review.globalFindings || [])];
function validate() {
  const receipt = read(dir+'result.json');
  for (const file of receipt.files) assert.equal(hash(file.path),file.sha256,file.path+' changed after verification');
  const artifact = read(receipt.sourcePath), primer = artifact.primer;
  assert.equal(hash(receipt.sourcePath),receipt.artifactSha256);
  const snapshot = read(dir+'predecessor-snapshot.json'), previous = read(snapshot.receiptPath);
  assert.equal(snapshot.files.length,previous.files.length);
  for (const [index,file] of snapshot.files.entries()) {
    assert.equal(file.path,previous.files[index].path);assert.equal(file.sha256,previous.files[index].sha256);
    assert.equal(hash(file.snapshotPath),file.sha256,'historical evidence snapshot changed');
  }
  let rejected = 0;
  for (const [name,role,blind] of [['learner','independent-ai-first-learner',true],['expert','independent-ai-subject-expert',false]]) {
    const review=read(dir+'final-'+name+'-review.json'), input=read(dir+'final-'+name+'-input.json');
    const initial=read(dir+'r1-'+name+'-review.json'), initialInput=read(dir+'r1-'+name+'-input.json');
    assert.equal(initial.overallVerdict,'revise');assert.equal(initial.artifactSha256,initialInput.artifactSha256);assert.equal(initial.artifactSha256,hash(dir+'r1-source.json'));
    const validateReview = candidate => {
      assert.equal(candidate.role,role);assert.equal(candidate.independentReviewer,true);assert.equal(candidate.sourceBlind,blind);
      assert.equal(candidate.artifactSha256,receipt.artifactSha256);assert.equal(candidate.artifactSha256,input.artifactSha256);
      assert.equal(candidate.overallVerdict,'pass');assert.deepEqual(candidate.sections.map(s=>s.id),input.sections.map(s=>s.id));
      assert.equal(new Set(candidate.sections.map(s=>s.id)).size,input.sections.length);
      for(const section of candidate.sections){assert.equal(section.verdict,'pass');assert.ok(section.observation);}
      assert.equal(findings(candidate).filter(f=>f.severity!=='L3').length,0);
      assert.deepEqual(candidate.remainingFindingIds,[]);
      assert.deepEqual(candidate.resolvedFindingIds.slice().sort(),findings(initial).map(f=>f.id).sort());
    };
    validateReview(review);
    for (const mutate of [r=>{r.artifactSha256='stale'},r=>{r.remainingFindingIds=['unresolved']},r=>{r.sections[1].id=r.sections[0].id},r=>{r.sections[0].findings.push({severity:'L2'})}]) {
      const invalid=structuredClone(review);mutate(invalid);assert.throws(()=>validateReview(invalid));rejected++;
    }
  }
  const {validateQuickUserView}=require('./politics-quick-user-view');
  const input=read(dir+'final-learner-input.json');validateQuickUserView(primer,[input.homeDescription]);
  for(const mutate of [p=>{p.sections[0].title='政治理论的两条主线怎样放在一起'},p=>{p.sections[1].title='马原的三个组成部分'},p=>{p.sections[0].narrativeSegments.push({label:'当前范围',text:'内部范围'})},p=>{p.sections[1].title='马克思主义基本原理的三个组成部分'},p=>{p.completionCopy.body='本导读先看两部分'}]) {
    const invalid=structuredClone(primer);mutate(invalid);assert.throws(()=>validateQuickUserView(invalid));rejected++;
  }
  const platform=require('../../miniprogram/services/knowledge-platform'),pkg=require('../../miniprogram/services/knowledge-platform/politics-runtime').knowledgePackage;
  const plan=platform.planRecommendedRoute(pkg,'quick');let session=platform.createRouteSession(plan,1);
  const probe=read(dir+'runtime-probe.json');assert.equal(probe.screens.length,input.sections.length);
  for(const expected of input.sections){
    const model=platform.projectQuickPrimerViewModel(pkg,plan,session),actual=model.sections.find(s=>s.id===model.currentSectionId),screen=probe.screens.find(s=>s.sectionId===actual.id);
    assert.equal(actual.title,expected.title);assert.deepEqual(actual.reading,expected.reading);
    assert.equal(screen.title,expected.title);assert.deepEqual(screen.reading,expected.reading);assert.equal(screen.path,'subpackages/politics/route/index');
    session=platform.applyRouteSessionEvent(plan,session,{type:'NEXT_QUICK_SECTION',at:expected.step+2});
  }
  for(const shot of probe.screenshots)assert.equal(hash(shot.path),shot.sha256);
  assert.equal(probe.screenshots.filter(s=>s.authorVisuallyInspected).length,7);
  assert.equal(hash(probe.optionalIndexScreenshot),probe.optionalIndexScreenshotSha256);
  assert.equal(probe.progressProtection.byteEquivalent,true);assert.equal(probe.progressProtection.beforeSha256,probe.progressProtection.afterSha256);
  assert.equal(probe.saveAndResumeAtStep4,true);assert.equal(probe.optionalIndexProgressUnchanged,true);assert.equal(probe.completionVerified,true);assert.equal(probe.completion.status,'completed');
  const compile=read(dir+'compile.json').compile;assert.equal(compile.success,true);assert.equal(compile.data.compiled,true);assert.equal(compile.data.project,root);assert.deepEqual(compile.data.errors,[]);assert.deepEqual(compile.data.wxml_errors,[]);
  assert.equal(read(dir+'home-probe.json').quickGoal.description,input.homeDescription);
  const proof=read(dir+'systematic-inheritance-proof.json');assert.equal(proof.lessons,77);assert.equal(proof.visibleContentEqual,true);assert.equal(proof.directSourceBlocksEqual,true);assert.equal(proof.compatibleProgressMigrationGroups,21);assert.deepEqual(proof.changedLessonIds,[]);
  assert.equal(read(dir+'shared-flow-check.json').status,'passed');assert.equal(read(dir+'cross-mode.json').status,'passed-candidate-only');assert.equal(read(dir+'quick-check.json').status,'passed');
  assert.equal(receipt.userAcceptance,'pending');assert.equal(receipt.releaseAuthorized,false);assert.equal(receipt.readingTimeMeasured,false);
  console.log(JSON.stringify({ok:true,revision:'learner-facing-titles-and-body',independentRoles:2,pages:input.sections.length,sourceAndFrontendMatched:true,negativeCasesRejected:rejected,defaultChars:receipt.defaultTextChars,progressPreserved:true,systematicLessonsUnchanged:77,userAcceptance:'pending'}));
}
module.exports = {validate};
