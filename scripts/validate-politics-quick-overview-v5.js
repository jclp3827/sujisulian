// A later learner-facing revision has its own immutable review and predecessor snapshots.
if (require('node:fs').existsSync(require('node:path').join(__dirname,'../docs/knowledge-platform/implementations/evidence/quick-overview-v5-user-view-20261024/result.json'))) {
  require('./lib/politics-quick-user-view-evidence').validate();
  process.exit(0);
}
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dir = 'docs/knowledge-platform/implementations/evidence/quick-overview-v5-20261024/';
const initialDir = 'docs/knowledge-platform/implementations/evidence/quick-whole-route-review-20261024/';
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const receipt = read(dir+'result.json');
for (const file of receipt.files) assert.equal(hash(file.path),file.sha256,file.path+' drifted after verification');
assert.equal(hash('docs/knowledge-pilot/sources/politics/quick-primer-v5.json'),receipt.artifactSha256);
const findings = report => [...report.sections.flatMap(s=>s.findings),...report.globalFindings];
function validateReview(report,input,initial,role,blind) {
  assert.equal(report.role,role);assert.equal(report.independentReviewer,true);assert.equal(report.sourceBlind,blind);
  assert.equal(report.artifactSha256,input.artifactSha256);assert.equal(report.artifactSha256,receipt.artifactSha256);
  assert.equal(report.overallVerdict,'pass');
  assert.deepEqual(report.sections.map(s=>s.id),input.sections.map(s=>s.id));
  assert.equal(new Set(report.sections.map(s=>s.id)).size,input.sections.length);
  for (const section of report.sections) {assert.equal(section.verdict,'pass');assert.ok(section.observation);}
  assert.equal(findings(report).filter(f=>f.severity!=='L3').length,0);
  assert.deepEqual(report.remainingInitialFindingIds,[]);
  assert.deepEqual(report.resolvedInitialFindingIds.slice().sort(),findings(initial).map(f=>f.findingId).sort());
}
let rejected = 0;
for (const [name,role,blind] of [['learner','independent-ai-first-learner',true],['expert','independent-ai-subject-expert',false]]) {
  const report=read(dir+'final-'+name+'-review.json'),input=read(dir+'final-'+name+'-input.json'),initial=read(initialDir+name+'-review.json');
  validateReview(report,input,initial,role,blind);
  for (const mutation of [x=>{x.artifactSha256='stale'},x=>{x.sections[1].id=x.sections[0].id},x=>{x.remainingInitialFindingIds=[findings(initial)[0].findingId]},x=>{x.sections[0].findings.push({severity:'L2'})}]) {
    const invalid=structuredClone(report);mutation(invalid);assert.throws(()=>validateReview(invalid,input,initial,role,blind));rejected++;
  }
}
const expert=read(dir+'final-expert-review.json');
assert.deepEqual(expert.remainingRevisionFindingIds,[]);
for (const id of ['QV5-S04-F01','QV5-S04-F02']) assert.ok(expert.resolvedRevisionFindingIds.includes(id));
const platform=require('../miniprogram/services/knowledge-platform');
const {knowledgePackage}=require('../miniprogram/services/knowledge-platform/politics-runtime');
const plan=platform.planRecommendedRoute(knowledgePackage,'quick');
const input=read(dir+'final-learner-input.json');
let session=platform.createRouteSession(plan,1);
for (const expected of input.sections) {
  const model=platform.projectQuickPrimerViewModel(knowledgePackage,plan,session),actual=model.sections.find(s=>s.id===model.currentSectionId);
  assert.equal(actual.title,expected.title);assert.deepEqual(actual.reading,expected.reading);
  session=platform.applyRouteSessionEvent(plan,session,{type:'NEXT_QUICK_SECTION',at:expected.step+2});
}
const probe=read(dir+'runtime-probe.json');assert.equal(probe.screens.length,input.sections.length);
for (const screen of probe.screens) {
  const expected=input.sections.find(s=>s.id===screen.sectionId);assert.ok(expected);
  assert.equal(screen.title,expected.title);assert.deepEqual(screen.reading,expected.reading);
  assert.equal(screen.path,'subpackages/politics/route/index');
}
assert.equal(probe.screenshots.length,input.sections.length*2);
for (const shot of probe.screenshots) {assert.equal(hash(shot.path),shot.sha256);assert.equal(shot.authorVisuallyInspected,true);}
assert.equal(hash(probe.optionalIndexScreenshot),probe.optionalIndexScreenshotSha256);
assert.equal(probe.optionalIndexVisuallyInspected,true);assert.equal(probe.optionalIndexProgressUnchanged,true);
assert.equal(probe.saveAndResumeAtStep4,true);assert.equal(probe.completionVerified,true);assert.equal(probe.completion.status,'completed');
assert.equal(probe.progressProtection.byteEquivalent,true);assert.equal(probe.progressProtection.beforeSha256,probe.progressProtection.afterSha256);
const compile=read(dir+'compile.json').compile;assert.equal(compile.success,true);assert.equal(compile.data.compiled,true);
assert.deepEqual(compile.data.errors,[]);assert.deepEqual(compile.data.wxml_errors,[]);assert.equal(compile.data.project,root);
assert.equal(read(dir+'home-probe.json').quickGoal.description,'看清马原与新时代思想的主要组成、主题目标和相互联系');
const proof=read(dir+'systematic-inheritance-proof.json');assert.equal(proof.lessons,77);assert.equal(proof.visibleContentEqual,true);assert.equal(proof.directSourceBlocksEqual,true);assert.equal(proof.compatibleProgressMigrationGroups,21);assert.deepEqual(proof.changedLessonIds,[]);
assert.equal(read(dir+'shared-flow-check.json').status,'passed');
assert.equal(read(dir+'cross-mode.json').status,'passed-candidate-only');
assert.equal(receipt.userAcceptance,'pending');assert.equal(receipt.pageCountIsAcceptance,false);assert.equal(receipt.readingTimeMeasured,false);assert.equal(receipt.releaseAuthorized,false);
console.log(JSON.stringify({ok:true,independentRoles:2,wholeOverviewPassed:true,pages:input.sections.length,remainingBlockingFindings:0,sourceAndFrontendMatched:true,defaultChars:receipt.defaultTextChars,optionalIndexDoesNotAffectProgress:true,progressPreserved:true,systematicLessonsUnchanged:77,negativeCasesRejected:rejected,userAcceptance:'pending'}));
