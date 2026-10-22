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
    setStorageSync(key,value) { failure.writes=(failure.writes||0)+1; if(failure.write || failure.failOnWrite===failure.writes) throw Error('write failed'); storage.set(key,clone(value)); },
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
function start(page,group='ten') { page.handleGroup(evt({groupId:group})); }

function validate() {
  assert.equal(units.curriculum.candidateOnly,true);
  assert.equal(units.curriculum.reviewState,'draft');
  const app=require('../miniprogram/app.json');assert.ok(app.subPackages.find(pack=>pack.root==='subpackages/politics').pages.includes('route/units'));
  const markup=fs.readFileSync(path.resolve(__dirname,'../miniprogram/subpackages/politics/route/units.wxml'),'utf8');
  const styles=fs.readFileSync(path.resolve(__dirname,'../miniprogram/subpackages/politics/route/units.wxss'),'utf8');
  assert.match(markup,/这次要回答/);assert.match(markup,/view\.question/);assert.match(markup,/读完能理解/);assert.match(markup,/view\.outcomeSummary/);
  assert.doesNotMatch(markup,/为什么现在读这一节/);assert.doesNotMatch(markup,/本节边界/);assert.doesNotMatch(markup,/接下来为什么继续/);
  assert.doesNotMatch(markup,/view\.learningLink\.transition/);assert.match(markup,/快速自测 · 1题/);assert.match(markup,/可跳过 · 不计分/);assert.match(markup,/查看主要原文/);
  assert.match(markup,/view\.routeConclusion\.summary/);assert.match(markup,/完成边界/);assert.match(markup,/unit-progress-track/);
  assert.ok(markup.indexOf('这次要回答') < markup.indexOf('读完能理解'),'lesson question is not presented before its compact outcome');
  assert.match(markup,/unit-dock-actions/);assert.match(markup,/unit-save-progress/);assert.match(markup,/unit-skip/);assert.match(markup,/unit-complete/);
  const dockStart=markup.indexOf('unit-dock-actions');
  const dockMarkup=markup.slice(dockStart,markup.indexOf('</view></block>',dockStart));
  assert.ok(dockMarkup.indexOf('unit-save-progress') < dockMarkup.indexOf('unit-complete') && dockMarkup.indexOf('unit-complete') < dockMarkup.indexOf('unit-skip'));
  assert.match(markup,/保留进度/);assert.match(markup,/跳过本节/);assert.doesNotMatch(markup,/先到这里，保留进度/);assert.match(markup,/查看两篇进度/);
  assert.match(markup,/unit-progress-route/);
  assert.match(markup,/unit-group-progress-track/);assert.match(markup,/unit-group-state-/);assert.match(markup,/item\.progressLabel/);assert.match(markup,/item\.statusLabel/);
  assert.match(styles,/\.unit-inline-key\s*\{[^}]*font-weight:[^}]*box-shadow:\s*var\(--ui-emphasis-key-shadow\)/);assert.match(styles,/\.unit-inline-boundary\s*\{[^}]*text-underline-offset:\s*var\(--ui-emphasis-boundary-offset\)/);assert.match(styles,/\.unit-group-card-complete\s*\{[^}]*--color-success/);
  const sessionStyles=fs.readFileSync(path.resolve(__dirname,'../miniprogram/styles/session.wxss'),'utf8');
  assert.match(sessionStyles,/\.session-action-row\s*\{[^}]*display:\s*flex/);assert.doesNotMatch(sessionStyles,/\.session-action-row\s*\{[^}]*display:\s*grid/);
  assert.match(markup,/session-action-row unit-dock-actions/);assert.match(markup,/session-progress-track unit-progress-track/);assert.match(markup,/btn-base btn-compact btn-ghost unit-menu unit-progress-route/);
  const serviceFile=path.resolve(__dirname,'../miniprogram/services/knowledge-platform/systematic-units.js');
  const disabled={exports:{}};
  vm.runInNewContext(fs.readFileSync(serviceFile,'utf8'),{module:disabled,require(id){return id==='./rollout'?{getRolloutStage(){return 'verified';}}:createRequire(serviceFile)(id);}});
  assert.equal(disabled.exports.isPilotAvailable(pkg),false,'draft pilot allowed outside candidate stage');
  assert.equal(disabled.exports.planFor(pkg,{type:'systematic',experienceKind:units.KIND,groupId:'ten'}),null);
  const samples=require('../docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json');
  const inventory=require('../docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json');
  const reviewedIds=samples.lessons.map(lesson=>lesson.id);
  assert.deepEqual([...units.EXPLANATION_REVIEWED_IDS],reviewedIds);
  assert.equal(reviewedIds.length,72);
  assert.equal(units.curriculum.lessons.filter(lesson=>units.displayTitleForLessonId(lesson.id)).length,72);
  assert.ok(units.curriculum.lessons.every(lesson=>!/(怎样|为什么|什么|哪些|分别回答|先抓住)/.test(units.displayTitleForLessonId(lesson.id))));
  assert.ok(samples.lessons.every(lesson=>lesson.question && lesson.scopeLimit && lesson.transition));
  for(const lesson of samples.lessons)assert.notEqual(lesson.reflection.answer,lesson.recap.text,`${lesson.id} copied recap as reflection answer`);
  assert.equal(samples.groups.filter(group=>group.connectionToNext).length,21);
  assert.equal(samples.routes.filter(route=>route.conclusion?.summary && route.conclusion?.boundary).length,2);
  assert.throws(()=>compile(samples,inventory,'release'),/candidate-only/);
  assert.equal(planFor('unknown'),null);
  assert.equal(platform.planLearningRoute({...pkg,packageVersion:'changed'},{type:'systematic',experienceKind:units.KIND,groupId:'ten'}),null);
  assert.equal(platform.planLearningRoute(pkg,{type:'systematic',experienceKind:units.KIND,groupId:'ten',curriculumVersion:'old'}),null);
  assert.equal(platform.planLearningRoute(pkg,{type:'systematic',experienceKind:units.KIND,groupId:'ten',curriculumVersion:'units-9000f36d759d'}).curriculumVersion,units.curriculum.curriculumVersion);
  assert.equal(platform.planLearningRoute(pkg,{type:'systematic',experienceKind:units.KIND,groupId:'ten',curriculumVersion:'units-bb32645a95ce'}).curriculumVersion,units.curriculum.curriculumVersion);
  assert.equal(platform.planLearningRoute(pkg,{type:'systematic',experienceKind:units.KIND,groupId:'ten',curriculumVersion:'units-371caff5370a'}).curriculumVersion,units.curriculum.curriculumVersion);
  assert.ok(units.curriculum.groups.every(group=>!group.scope.includes('单元') && !group.scope.includes('本组')));
  const themeEndIds=new Set(samples.groups.map(group=>group.lessonIds[group.lessonIds.length-1]));
  const routeEndIds=new Set(samples.routes.map(route=>{
    const group=samples.groups.find(group=>group.id===route.groupIds[route.groupIds.length-1]);
    return group.lessonIds[group.lessonIds.length-1];
  }));
  for(const group of units.curriculum.groups) {
    const plan=planFor(group.id); let session=platform.createRouteSession(plan,1);
    assert.equal(plan.steps.length,group.lessonIds.length);
    assert.ok(plan.steps.every(step=>step.stage==='reading'));
    for(let index=0;index<plan.steps.length;index++) {
      const step=plan.steps[index];const event={stepId:step.stepId,curriculumVersion:plan.curriculumVersion,at:index+2};
      const view=platform.projectRouteViewModel(pkg,plan,session);
      assert.equal(view.id,group.lessonIds[index]);assert.equal(view.referenceVisible,false);
      assert.ok(view.question);
      assert.ok(view.learningLink?.position);assert.ok(view.learningLink?.reason);assert.ok(view.learningLink?.transition);
      assert.ok(['下一节','下一主题','本篇收束'].includes(view.learningLink.nextLabel));
      assert.equal(view.learningLink.transition,samples.lessons.find(lesson=>lesson.id===view.id).transition);
      assert.doesNotMatch(view.learningLink.transition,/单元|本组|待开放|待后续/);
      assert.equal(view.parts.find(part=>part.kind==='recap').label,themeEndIds.has(view.id)?'本主题小结':'本节结论');
      if(routeEndIds.has(view.id))assert.ok(view.routeConclusion?.summary && view.routeConclusion?.boundary);
      else assert.equal(view.routeConclusion,null);
      const primary=samples.lessons.find(lesson=>lesson.id===view.id).primaryUnitIds[0];
      assert.equal(step.pointId,primary,'step identity inferred from contextual citation');
      assert.equal(view.sources[0].id,primary,'primary source hidden behind contextual citation');
      assert.equal(view.primarySource.id,primary,'primary source is not directly actionable');
      assert.deepEqual(view.relatedSources,view.sources.slice(1));
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
    assert.equal(home.statusLabel,'本组已结束');
    const nextGroup = units.nextGroupFor(pkg,plan,[{planOptions:plan.options,session}]);
    assert.equal(home.recommendedAction.label,nextGroup ? '接着了解' : '回看主题');
    if(nextGroup) assert.ok(home.recommendedAction.url.includes('nextGroup='+nextGroup.id));
  }

  const legacyPlan=platform.planRecommendedRoute(pkg,'systematic');
  const legacy={planOptions:legacyPlan.options,session:platform.createRouteSession(legacyPlan,1)};
  const storage=new Map([[KEY,clone(legacy)],['knowledgeRoute:politics:quick',{untouched:true}],['knowledgeRoute:politics:exam',{untouched:true}],['knowledgeRoute:politics:confusion',{untouched:true}]]);
  const h=load(storage);h.page.onLoad({});assert.equal(h.page.data.screen,'groups');assert.equal(h.page.data.hasLegacy,true);
  start(h.page);assert.equal(h.page.data.view.id,'TEN-01');
  assert.deepEqual(storage.get(KEY).savedSystematicRecords[0],legacy);
  h.page.pendingAnchor={partId:'TEN-01-body-2',offset:25};h.page.onHide();
  const oldEntry=load(storage,undefined,'../miniprogram/subpackages/politics/route/guided-route.js');oldEntry.page.onLoad({type:'systematic'});
  assert.equal(oldEntry.calls.redirect[0].url,'/subpackages/politics/route/units','default system entry did not converge on route home');
  const resumed=load(storage);resumed.page.onLoad({resume:'1'});assert.deepEqual(resumed.page.data.view.anchor,{partId:'TEN-01-body-2',offset:25});
  resumed.page.handleReference();assert.equal(resumed.page.data.view.referenceVisible,true);
  const firstStep=resumed.page.data.view.stepId;
  resumed.page.handleComplete(evt({stepId:firstStep}));assert.equal(resumed.page.data.view.id,'TEN-02');assert.equal(resumed.page.data.view.closeout,false);
  assert.equal(resumed.page.data.view.routeRead,1);assert.equal(resumed.page.data.view.routeCount,48);
  const home=platform.projectHomeDecision(pkg,{routeRecords:[storage.get(KEY)]});
  assert.equal(home.recommendedAction.label,'继续学习');assert.ok(home.description.includes('总体布局、改革与法治'));
  const continued=load(storage);continued.page.onLoad({resume:'1'});assert.equal(continued.page.data.view.id,'TEN-02');
  continued.page.handleGroups();start(continued.page,'value');assert.equal(continued.page.data.view.id,'VALUE-01');
  continued.page.handleGroups();start(continued.page,'ten');assert.equal(continued.page.data.view.id,'TEN-02','topic switch lost position');
  continued.page.handleSource(evt({pointId:continued.page.data.view.sources[0].id}));
  assert.ok(continued.calls.navigate[0].url.includes('block='));const before=clone(continued.page.session);continued.page.onShow();assert.deepEqual(continued.page.session,before);
  const progressBeforeReview={read:continued.page.data.view.routeRead,count:continued.page.data.view.routeCount,percent:continued.page.data.view.routeProgressPercent};
  continued.page.handleReview(evt({index:0}));assert.ok(continued.page.data.reviewing);
  assert.deepEqual({read:continued.page.data.view.routeRead,count:continued.page.data.view.routeCount,percent:continued.page.data.view.routeProgressPercent},progressBeforeReview);
  continued.page.handleReference();continued.page.handleReturnReview();assert.equal(continued.page.data.view.id,'TEN-02');
  continued.failure.write=true;const stored=clone(storage.get(KEY)),currentStep=continued.page.data.view.stepId;
  continued.page.handleComplete(evt({stepId:currentStep}));assert.deepEqual(storage.get(KEY),stored);assert.equal(continued.page.data.view.id,'TEN-02');assert.ok(continued.page.data.error);
  continued.failure.write=false;continued.page.handleRetry();assert.equal(continued.page.data.view.id,'TEN-03');
  continued.page.handleLegacy();assert.equal(storage.get(KEY).session.planId,legacy.session.planId);assert.ok(continued.calls.redirect[0].url.includes('legacy=1'));
  assert.ok(storage.get(KEY).savedSystematicRecords.some(r=>r.session.currentIndex===2 && r.planOptions.experienceKind===units.KIND));
  const oldResumed=load(storage,undefined,'../miniprogram/subpackages/politics/route/guided-route.js');oldResumed.page.onLoad({type:'systematic',resume:'1',legacy:'1'});oldResumed.page.handleSystemNext();
  assert.ok(storage.get(KEY).savedSystematicRecords.some(r=>r.session.currentIndex===2 && r.planOptions.experienceKind===units.KIND),'old page save erased inactive unit topics');
  for(const type of ['quick','exam','confusion'])assert.deepEqual(storage.get('knowledgeRoute:politics:'+type),{untouched:true});
  const beforeReadFailure=clone(storage.get(KEY));const readFail=load(storage,{read:true,write:false});readFail.page.onLoad({});assert.equal(readFail.page.data.screen,'error');assert.deepEqual(storage.get(KEY),beforeReadFailure);

  // No truncation at the old 8-history boundary, and only one current copy.
  let envelope=null;
  for(let i=0;i<12;i++)envelope=switchSystematicRecord(envelope,{planOptions:{type:'systematic'},session:{planId:'plan-'+i}});
  assert.equal(envelope.savedSystematicRecords.length,11);assert.ok(!envelope.savedSystematicRecords.some(r=>r.session.planId===envelope.session.planId));
  const skip=load();skip.page.onLoad({});start(skip.page,'value');
  skip.page.handleSkip(evt({stepId:skip.page.data.view.stepId}));assert.equal(skip.page.data.view.id,'VALUE-02');
  skip.page.handleComplete(evt({stepId:skip.page.data.view.stepId}));assert.equal(skip.page.data.view.id,'VALUE-03');
  skip.page.handleComplete(evt({stepId:skip.page.data.view.stepId}));assert.equal(skip.page.plan.groupId,'money');
  skip.page.handleGroups();start(skip.page,'value');assert.equal(skip.page.data.view.remaining,1);
  skip.page.handleReview(evt({index:0}));skip.page.handleFinishReview();assert.equal(skip.page.data.view.remaining,0);assert.equal(skip.page.session.currentIndex,2);
  const corrupt=clone(skip.storage.get(KEY));corrupt.session.currentIndex=90;skip.storage.set(KEY,corrupt);
  const recovered=load(skip.storage);recovered.page.onLoad({});assert.equal(recovered.page.data.screen,'expired');recovered.page.handleGroups();start(recovered.page,'value');
  assert.deepEqual(recovered.storage.get(KEY).recoverySnapshots[0].session,corrupt.session);

  const routeStart=load();routeStart.page.onLoad({});
  assert.equal(routeStart.page.data.screen,'groups');assert.equal(routeStart.page.data.selectedRouteId,'thought');assert.equal(routeStart.page.data.visibleGroups[0].id,'foundation');
  assert.equal(routeStart.page.data.visibleGroups[0].progressState,'idle');assert.equal(routeStart.page.data.visibleGroups[0].statusLabel,'未开始');assert.equal(routeStart.page.data.visibleGroups[0].progressPercent,0);
  assert.equal(routeStart.storage.size,0,'route home wrote progress');
  routeStart.page.handleRoute(evt({routeId:'principles'}));assert.equal(routeStart.page.data.visibleGroups[0].id,'basics');assert.equal(routeStart.page.data.routes[1].count,24);
  routeStart.page.handleRoute(evt({routeId:'thought'}));start(routeStart.page,'foundation');assert.equal(routeStart.page.data.view.id,'FOUND-01');
  assert.equal(routeStart.page.data.view.title,'坚持和发展中国特色社会主义');
  assert.equal(routeStart.page.data.view.question,'核心要义和四个自信是什么关系？');assert.equal(routeStart.page.data.view.learningLink.nextLabel,'下一节');
  assert.equal(routeStart.page.data.view.outcomeSummary,routeStart.page.data.view.objectives.join('；'));
  assert.equal(routeStart.page.data.view.completionAction,'继续下一节');assert.equal(routeStart.page.data.view.routeCount,48);
  const foundationPlan=routeStart.page.plan;
  routeStart.page.handleComplete(evt({stepId:routeStart.page.data.view.stepId}));assert.equal(routeStart.page.data.view.id,'FOUND-02');
  routeStart.page.handleComplete(evt({stepId:routeStart.page.data.view.stepId}));assert.equal(routeStart.page.data.view.id,'FOUND-03');
  assert.equal(routeStart.page.data.view.completionAction,'进入下一主题');
  routeStart.page.handleComplete(evt({stepId:routeStart.page.data.view.stepId}));assert.equal(routeStart.page.data.view.id,'TEN-01');assert.equal(routeStart.page.plan.groupId,'ten');
  assert.ok(routeStart.storage.get(KEY).savedSystematicRecords.some(record=>record.session.planId===foundationPlan.id && record.session.status==='completed'));
  const cards=units.routeCards(pkg,routeStart.page.records());assert.equal(cards[0].read,3);assert.equal(cards[1].read,0);assert.equal(cards.reduce((n,r)=>n+r.count,0),units.curriculum.lessons.length);
  routeStart.page.handleGroups();
  assert.equal(routeStart.page.data.visibleGroups[0].progressState,'complete');assert.equal(routeStart.page.data.visibleGroups[0].statusLabel,'已读完');assert.equal(routeStart.page.data.visibleGroups[0].progressPercent,100);
  assert.equal(routeStart.page.data.visibleGroups[1].progressState,'active');assert.equal(routeStart.page.data.visibleGroups[1].statusLabel,'进行中');

  // Leaving from the middle states that progress is kept and restores the exact lesson anchor.
  const exitStorage=new Map();const exiting=load(exitStorage);exiting.page.onLoad({});start(exiting.page,'foundation');
  exiting.page.handleComplete(evt({stepId:exiting.page.data.view.stepId}));assert.equal(exiting.page.data.view.id,'FOUND-02');
  exiting.page.pendingAnchor={partId:units.curriculum.lessons.find(lesson=>lesson.id==='FOUND-02').parts[0].id,offset:19};
  exiting.page.handleExit();assert.equal(exiting.calls.home[0].url,'/pages/politics/index');
  const exitResumed=load(exitStorage);exitResumed.page.onLoad({resume:'1'});assert.equal(exitResumed.page.data.view.id,'FOUND-02');
  assert.deepEqual(exitResumed.page.data.view.anchor,exiting.page.pendingAnchor);

  // Completing a topic is durable even when starting the next topic fails.
  const boundaryFailure={read:false,write:false,writes:0};const guarded=load(new Map(),boundaryFailure);guarded.page.onLoad({});start(guarded.page,'foundation');
  guarded.page.handleComplete(evt({stepId:guarded.page.data.view.stepId}));guarded.page.handleComplete(evt({stepId:guarded.page.data.view.stepId}));
  boundaryFailure.failOnWrite=boundaryFailure.writes+2;
  guarded.page.handleComplete(evt({stepId:guarded.page.data.view.stepId}));
  assert.equal(guarded.storage.get(KEY).session.status,'completed');assert.equal(guarded.page.plan.groupId,'foundation');assert.ok(guarded.page.data.error);
  boundaryFailure.failOnWrite=0;guarded.page.handleRetry();assert.equal(guarded.page.plan.groupId,'ten');assert.equal(guarded.page.data.view.id,'TEN-01');

  // Encoded historical continuation links still validate their exact completed plan before entering the next topic.
  const linkedPlan=planFor('foundation');let linkedSession=platform.createRouteSession(linkedPlan,1);
  for(const step of linkedPlan.steps) { linkedSession=platform.applyRouteSessionEvent(linkedPlan,linkedSession,{type:'COMPLETE_SYSTEMATIC_UNIT',stepId:step.stepId,curriculumVersion:linkedPlan.curriculumVersion,at:2}); if(linkedSession.status==='active') linkedSession=platform.applyRouteSessionEvent(linkedPlan,linkedSession,{type:'CONTINUE_SYSTEMATIC_UNIT',stepId:step.stepId,curriculumVersion:linkedPlan.curriculumVersion,at:2}); }
  const completedStorage=new Map([[KEY,{planOptions:linkedPlan.options,session:linkedSession,savedSystematicRecords:[]}]]);
  const encoded=load(completedStorage);encoded.page.onLoad({nextGroup:'ten',fromPlan:encodeURIComponent(linkedPlan.id)});assert.equal(encoded.page.data.view.id,'TEN-01');
  const invalidStorage=new Map([[KEY,{planOptions:linkedPlan.options,session:linkedSession,savedSystematicRecords:[]}]]);
  const badLink=load(invalidStorage);badLink.page.onLoad({nextGroup:'basics',fromPlan:linkedPlan.id});assert.equal(badLink.page.data.screen,'groups');assert.equal(badLink.storage.get(KEY).session.planId,linkedPlan.id);
  const malformedStorage=new Map([[KEY,{planOptions:linkedPlan.options,session:linkedSession,savedSystematicRecords:[]}]]);
  const malformed=load(malformedStorage);malformed.page.onLoad({nextGroup:'ten',fromPlan:'%E0%A4%A'});assert.equal(malformed.page.data.screen,'groups');

  // The content-only version upgrade preserves exact progress and keeps the old record recoverable.
  const compatibleVersion='units-371caff5370a';
  const migrationPlan=planFor('ten');let migrationSession=platform.createRouteSession(migrationPlan,1);
  const migrationEvent=(type,index,extra={})=>({type,stepId:migrationPlan.steps[index].stepId,curriculumVersion:migrationPlan.curriculumVersion,at:index+2,...extra});
  migrationSession=platform.applyRouteSessionEvent(migrationPlan,migrationSession,migrationEvent('COMPLETE_SYSTEMATIC_UNIT',0));
  migrationSession=platform.applyRouteSessionEvent(migrationPlan,migrationSession,migrationEvent('CONTINUE_SYSTEMATIC_UNIT',0));
  migrationSession=platform.applyRouteSessionEvent(migrationPlan,migrationSession,migrationEvent('SKIP_SYSTEMATIC_UNIT',1));
  migrationSession=platform.applyRouteSessionEvent(migrationPlan,migrationSession,migrationEvent('CONTINUE_SYSTEMATIC_UNIT',1));
  const migrationPart=units.curriculum.lessons.find(lesson=>lesson.id==='TEN-03').parts[0].id;
  migrationSession=platform.applyRouteSessionEvent(migrationPlan,migrationSession,migrationEvent('SAVE_UNIT_ANCHOR',2,{anchor:{partId:migrationPart,offset:31}}));
  migrationSession=platform.applyRouteSessionEvent(migrationPlan,migrationSession,migrationEvent('TOGGLE_UNIT_REFERENCE',2));
  const oldPlanId=`route:politics:systematic:ten:${compatibleVersion}`;
  const oldRecord={planOptions:{...migrationPlan.options,curriculumVersion:compatibleVersion},session:{...migrationSession,planId:oldPlanId,curriculumVersion:compatibleVersion}};
  const migrationStorage=new Map([[KEY,clone(oldRecord)]]);const migrated=load(migrationStorage);migrated.page.onLoad({resume:'1'});
  assert.equal(migrated.page.data.view.id,'TEN-03');assert.deepEqual(migrated.page.session.completedStepIds,migrationSession.completedStepIds);
  assert.deepEqual(migrated.page.session.skippedStepIds,migrationSession.skippedStepIds);assert.deepEqual(migrated.page.data.view.anchor,{partId:migrationPart,offset:31});
  assert.equal(migrated.page.data.view.referenceVisible,true);assert.equal(migrated.page.session.planId,migrationPlan.id);assert.equal(migrated.page.session.curriculumVersion,units.curriculum.curriculumVersion);
  const migratedEnvelope=migrationStorage.get(KEY);assert.equal(migratedEnvelope.session.planId,migrationPlan.id);
  assert.ok(!migratedEnvelope.savedSystematicRecords.some(record=>record.session.planId===oldPlanId));
  assert.ok(migratedEnvelope.recoverySnapshots.some(record=>record.session.planId===oldPlanId));

  // A compatible inactive topic migrates when selected, without losing the current topic.
  const holdingPlan=planFor('foundation');const holding={planOptions:holdingPlan.options,session:platform.createRouteSession(holdingPlan,1),savedSystematicRecords:[clone(oldRecord)]};
  const inactiveStorage=new Map([[KEY,holding]]);const inactive=load(inactiveStorage);inactive.page.onLoad({});start(inactive.page,'ten');
  assert.equal(inactive.page.data.view.id,'TEN-03');assert.equal(inactive.storage.get(KEY).session.planId,migrationPlan.id);
  assert.ok(inactive.storage.get(KEY).savedSystematicRecords.some(record=>record.session.planId===holdingPlan.id));
  assert.ok(!inactive.storage.get(KEY).savedSystematicRecords.some(record=>record.session.planId===oldPlanId));
  assert.ok(inactive.storage.get(KEY).recoverySnapshots.some(record=>record.session.planId===oldPlanId));

  const direct=load();direct.page.onLoad({routeId:'principles'});assert.equal(direct.page.data.visibleGroups[0].id,'basics');start(direct.page,'basics');assert.equal(direct.page.data.view.id,'BASICS-01');assert.equal(direct.storage.get(KEY).savedSystematicRecords.length,0);

  // Every authored lesson passes through the real continuous controller.
  for(const group of units.curriculum.groups) {
    const controller=load();controller.page.onLoad({});start(controller.page,group.id);
    const route=units.routeForGroup(group.id);const groupIndex=route.groupIds.indexOf(group.id);const followingId=route.groupIds[groupIndex+1];
    const originalPlan=controller.page.plan;
    for(let index=0;index<group.lessonIds.length;index++) {
      assert.equal(controller.page.data.view.id,group.lessonIds[index]);assert.equal(controller.page.data.view.closeout,false);
      controller.page.handleComplete(evt({stepId:controller.page.data.view.stepId}));
      if(index<group.lessonIds.length-1)assert.equal(controller.page.data.view.id,group.lessonIds[index+1]);
    }
    const completedRecord=[controller.storage.get(KEY),...controller.storage.get(KEY).savedSystematicRecords].find(record=>record.session.planId===originalPlan.id);
    assert.equal(completedRecord.session.status,'completed');
    if(followingId) { assert.equal(controller.page.plan.groupId,followingId);assert.equal(controller.page.data.view.id,units.curriculum.groups.find(item=>item.id===followingId).lessonIds[0]); }
    else { assert.equal(controller.page.data.view.closeout,true);assert.equal(controller.page.data.view.routeRead,group.lessonIds.length); }
  }

  // Each arranged route ends with its authored whole-route conclusion after every lesson is read.
  for(const route of units.curriculum.routes) {
    const controller=load();controller.page.onLoad({routeId:route.id});start(controller.page,route.groupIds[0]);
    const routeLessonIds=route.groupIds.flatMap(groupId=>units.curriculum.groups.find(group=>group.id===groupId).lessonIds);
    for(const lessonId of routeLessonIds) {
      assert.equal(controller.page.data.view.id,lessonId);
      controller.page.handleComplete(evt({stepId:controller.page.data.view.stepId}));
    }
    assert.equal(controller.page.data.view.closeout,true);assert.equal(controller.page.data.view.routeRead,routeLessonIds.length);
    assert.equal(controller.page.data.view.routeCount,routeLessonIds.length);assert.deepEqual(controller.page.data.view.routeConclusion,route.conclusion);
  }
  console.log(JSON.stringify({status:'passed',groups:units.curriculum.groups.length,lessons:units.curriculum.lessons.length,routeHome:true,directTopicEntry:true,continuousProgression:true,atomicInTopicProgress:true,durableTopicBoundary:true,encodedNavigation:true,allLessonControllers:true,fullExplanationChain:true,themeConnections:21,routeConclusions:2,compatibleProgressMigration:true,firstUseOrientation:true,threeLessonRhythm:true,exitResume:true,crossThemeContinuation:true,wholeRouteProgress:true,primarySourceConsumption:true,legacyExplicitRecovery:true,storageFailureRollback:true,sourceReturn:true,skippedUnitRemedy:true,candidateOnly:true}));
}
if(require.main===module)validate();
module.exports={validate};
