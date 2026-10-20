const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const platform = require('../miniprogram/services/knowledge-platform');
const { knowledgePackage: pkg } = require('../miniprogram/services/knowledge-platform/politics-runtime');
const units = require('../miniprogram/services/knowledge-platform/systematic-units');
const { switchSystematicRecord, routeProgressKey } = require('../miniprogram/services/knowledge-platform/route-progress');
const { compile } = require('./build-politics-systematic-units');
const clone = value => JSON.parse(JSON.stringify(value));
const KEY = routeProgressKey('systematic');

function load(storage = new Map(), failure = { read:false, write:false }, relative = '../miniprogram/subpackages/politics/route/units.js') {
  const calls = { navigate:[], redirect:[], home:[], scroll:[] };
  const wx = {
    getStorageSync(key) { if(failure.read) throw Error('read failed'); return clone(storage.get(key) ?? null); },
    setStorageSync(key,value) { if(failure.write) throw Error('write failed'); storage.set(key,clone(value)); },
    navigateTo(value) { calls.navigate.push(value); }, redirectTo(value) { calls.redirect.push(value); },
    switchTab(value) { calls.home.push(value); }, pageScrollTo(value) { calls.scroll.push(value); }, setNavigationBarTitle() {},
  };
  global.wx = wx;
  const file=path.resolve(__dirname,relative);let definition;
  vm.runInNewContext(fs.readFileSync(file,'utf8'),{require:createRequire(file),wx,Page(value){definition=value;},console,clearTimeout,setTimeout});
  const page={...definition,data:clone(definition.data),setData(patch,callback){for(const [key,value] of Object.entries(patch)){let at=this.data;const keys=key.split('.');keys.slice(0,-1).forEach(k=>{at=at[k]||(at[k]={});});at[keys[keys.length-1]]=value;}callback?.();}};
  return {page,calls,storage,failure};
}
const evt = data => ({ currentTarget:{dataset:data} });
const planFor = groupId => platform.planLearningRoute(pkg,{type:'systematic',experienceKind:units.KIND,groupId});
function start(page,group='ten') { page.handleGroup(evt({groupId:group})); page.handleStart(); }

function validate() {
  assert.equal(units.curriculum.candidateOnly,true);
  assert.equal(units.curriculum.reviewState,'draft');
  const app=require('../miniprogram/app.json');assert.ok(app.subPackages.find(pack=>pack.root==='subpackages/politics').pages.includes('route/units'));
  const serviceFile=path.resolve(__dirname,'../miniprogram/services/knowledge-platform/systematic-units.js');
  const disabled={exports:{}};
  vm.runInNewContext(fs.readFileSync(serviceFile,'utf8'),{module:disabled,require(id){return id==='./rollout'?{getRolloutStage(){return 'verified';}}:createRequire(serviceFile)(id);}});
  assert.equal(disabled.exports.isPilotAvailable(pkg),false,'draft pilot allowed outside candidate stage');
  assert.equal(disabled.exports.planFor(pkg,{type:'systematic',experienceKind:units.KIND,groupId:'ten'}),null);
  const samples=require('../docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json');
  const inventory=require('../docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json');
  assert.throws(()=>compile(samples,inventory,'release'),/candidate-only/);
  assert.equal(planFor('unknown'),null);
  assert.equal(platform.planLearningRoute({...pkg,packageVersion:'changed'},{type:'systematic',experienceKind:units.KIND,groupId:'ten'}),null);
  assert.equal(platform.planLearningRoute(pkg,{type:'systematic',experienceKind:units.KIND,groupId:'ten',curriculumVersion:'old'}),null);
  for(const group of units.curriculum.groups) {
    const plan=planFor(group.id); let session=platform.createRouteSession(plan,1);
    assert.equal(plan.steps.length,group.lessonIds.length);
    assert.ok(plan.steps.every(step=>step.stage==='reading'));
    for(let index=0;index<plan.steps.length;index++) {
      const step=plan.steps[index];const event={stepId:step.stepId,curriculumVersion:plan.curriculumVersion,at:index+2};
      const view=platform.projectRouteViewModel(pkg,plan,session);
      assert.equal(view.id,group.lessonIds[index]);assert.equal(view.referenceVisible,false);
      assert.ok(view.parts.some(part=>part.kind==='boundary'));assert.ok(view.parts.some(part=>part.kind==='recap'));
      session=platform.applyRouteSessionEvent(plan,session,{...event,type:'COMPLETE_SYSTEMATIC_UNIT'});
      assert.equal(session.currentIndex,index,'completion auto-advanced');
      const duplicate=platform.applyRouteSessionEvent(plan,session,{...event,type:'COMPLETE_SYSTEMATIC_UNIT'});
      assert.deepEqual(duplicate,session);
      assert.ok(platform.projectRouteViewModel(pkg,plan,session).closeout);
      if(index<plan.steps.length-1) {
        session=platform.applyRouteSessionEvent(plan,session,{...event,type:'CONTINUE_SYSTEMATIC_UNIT'});
        const twice=platform.applyRouteSessionEvent(plan,session,{...event,type:'CONTINUE_SYSTEMATIC_UNIT'});
        assert.deepEqual(twice,session,'delayed click advanced another unit');
      }
    }
    assert.equal(session.status,'completed');assert.equal(session.completedStepIds.length,group.lessonIds.length);
    assert.equal(session.revealedCount,0);assert.deepEqual(session.recallResults,{remembered:0,fuzzy:0,missed:0});
    assert.equal(platform.normalizeRouteSession(plan,{...session,planId:'old'}).status,'expired');
    assert.equal(platform.normalizeRouteSession(plan,{...session,curriculumVersion:'old'}).status,'expired');
    assert.equal(platform.normalizeRouteSession(plan,{...session,currentIndex:99}).status,'expired');
    const home=platform.projectHomeDecision(pkg,{routeRecords:[{planOptions:plan.options,session}]});
    assert.equal(home.statusLabel,'本组已结束');assert.equal(home.recommendedAction.label,'回看本组');
  }

  const legacyPlan=platform.planRecommendedRoute(pkg,'systematic');
  const legacy={planOptions:legacyPlan.options,session:platform.createRouteSession(legacyPlan,1)};
  const storage=new Map([[KEY,clone(legacy)],['knowledgeRoute:politics:quick',{untouched:true}],['knowledgeRoute:politics:exam',{untouched:true}],['knowledgeRoute:politics:confusion',{untouched:true}]]);
  const h=load(storage);h.page.onLoad({});assert.equal(h.page.data.hasLegacy,true);
  h.page.handleGroup(evt({groupId:'ten'}));assert.deepEqual(storage.get(KEY),legacy,'preview changed old progress');
  h.page.handleCancel();assert.deepEqual(storage.get(KEY),legacy);
  start(h.page);assert.equal(h.page.data.view.id,'TEN-01');
  assert.deepEqual(storage.get(KEY).savedSystematicRecords[0],legacy);
  h.page.pendingAnchor={partId:'TEN-01-body-2',offset:25};h.page.onHide();
  const oldEntry=load(storage,undefined,'../miniprogram/subpackages/politics/route/guided-route.js');oldEntry.page.onLoad({type:'systematic'});
  assert.ok(oldEntry.calls.redirect[0].url.includes('route/units'),'old entry failed to restore unit mode');
  const resumed=load(storage);resumed.page.onLoad({resume:'1'});assert.deepEqual(resumed.page.data.view.anchor,{partId:'TEN-01-body-2',offset:25});
  resumed.page.handleReference();assert.equal(resumed.page.data.view.referenceVisible,true);
  const firstStep=resumed.page.data.view.stepId;
  resumed.page.handleComplete(evt({stepId:firstStep}));assert.equal(resumed.page.data.view.id,'TEN-01');assert.ok(resumed.page.data.view.closeout);
  const home=platform.projectHomeDecision(pkg,{routeRecords:[storage.get(KEY)]});
  assert.equal(home.recommendedAction.label,'接着了解');assert.ok(home.description.includes('布局 改革'));
  const continued=load(storage);continued.page.onLoad({continueFrom:'TEN-01'});assert.equal(continued.page.data.view.id,'TEN-02');
  continued.page.handleGroups();start(continued.page,'value');assert.equal(continued.page.data.view.id,'VALUE-01');
  continued.page.handleGroups();start(continued.page,'ten');assert.equal(continued.page.data.view.id,'TEN-02','group switch lost position');
  continued.page.handleSource(evt({pointId:continued.page.data.view.sources[0].id}));
  assert.ok(continued.calls.navigate[0].url.includes('block='));const before=clone(continued.page.session);continued.page.onShow();assert.deepEqual(continued.page.session,before);
  continued.page.handleReview(evt({index:0}));assert.ok(continued.page.data.reviewing);continued.page.handleReference();continued.page.handleReturnReview();assert.equal(continued.page.data.view.id,'TEN-02');
  continued.failure.write=true;const stored=clone(storage.get(KEY)),currentStep=continued.page.data.view.stepId;
  continued.page.handleComplete(evt({stepId:currentStep}));assert.deepEqual(storage.get(KEY),stored);assert.equal(continued.page.data.view.closeout,false);assert.ok(continued.page.data.error);
  continued.failure.write=false;continued.page.handleRetry();assert.ok(continued.page.data.view.closeout);
  continued.page.handleLegacy();assert.equal(storage.get(KEY).session.planId,legacy.session.planId);
  assert.ok(storage.get(KEY).savedSystematicRecords.some(r=>r.session.currentIndex===1 && r.planOptions.experienceKind===units.KIND));
  const oldResumed=load(storage,undefined,'../miniprogram/subpackages/politics/route/guided-route.js');oldResumed.page.onLoad({type:'systematic',resume:'1'});oldResumed.page.handleSystemNext();
  assert.ok(storage.get(KEY).savedSystematicRecords.some(r=>r.session.currentIndex===1 && r.planOptions.experienceKind===units.KIND),'old page save erased inactive unit groups');
  for(const type of ['quick','exam','confusion'])assert.deepEqual(storage.get('knowledgeRoute:politics:'+type),{untouched:true});
  const beforeReadFailure=clone(storage.get(KEY));const readFail=load(storage,{read:true,write:false});readFail.page.onLoad({});assert.equal(readFail.page.data.screen,'error');assert.deepEqual(storage.get(KEY),beforeReadFailure);

  // No truncation at the old 8-history boundary, and only one current copy.
  let envelope=null;
  for(let i=0;i<12;i++)envelope=switchSystematicRecord(envelope,{planOptions:{type:'systematic'},session:{planId:'plan-'+i}});
  assert.equal(envelope.savedSystematicRecords.length,11);assert.ok(!envelope.savedSystematicRecords.some(r=>r.session.planId===envelope.session.planId));
  const skip=load();skip.page.onLoad({});start(skip.page,'value');
  skip.page.handleSkip(evt({stepId:skip.page.data.view.stepId}));
  for(let i=0;i<2;i++){skip.page.handleNext(evt({stepId:skip.page.data.view.stepId}));skip.page.handleComplete(evt({stepId:skip.page.data.view.stepId}));}
  assert.equal(skip.page.data.view.remaining,1);
  skip.page.handleReview(evt({index:0}));skip.page.handleFinishReview();assert.equal(skip.page.data.view.remaining,0);assert.equal(skip.page.session.currentIndex,2);
  const corrupt=clone(skip.storage.get(KEY));corrupt.session.currentIndex=90;skip.storage.set(KEY,corrupt);
  const recovered=load(skip.storage);recovered.page.onLoad({});assert.equal(recovered.page.data.screen,'expired');recovered.page.handleGroups();start(recovered.page,'value');
  assert.deepEqual(recovered.storage.get(KEY).recoverySnapshots[0].session,corrupt.session);
  console.log(JSON.stringify({status:'passed',groups:3,lessons:14,independentCloseout:true,legacyAndGroupRecovery:true,storageFailureRollback:true,sourceReturn:true,skippedUnitRemedy:true,candidateOnly:true}));
}
if(require.main===module)validate();
module.exports={validate};
