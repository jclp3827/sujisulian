#!/usr/bin/env node
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=p=>require(path.join(root,p));
const clone=x=>JSON.parse(JSON.stringify(x));
const bank=load('miniprogram/models/politics-applied-questions-runtime');
const banks=load('miniprogram/models/politics-learning-banks-runtime');
const revision=load('docs/knowledge-pilot/sources/politics/politics-exam-alignment-v1.json');
const samples=load('docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json');
const platform=load('miniprogram/services/knowledge-platform');
const {knowledgePackage:pkg}=load('miniprogram/services/knowledge-platform/politics-runtime');
const {STORAGE_KEY,createPoliticsPracticeEngine:create}=load('miniprogram/services/knowledge-platform/politics-practice');
const {shuffledOrder,validOrder}=load('miniprogram/utils/option-order');
function storage(initial={}) {const values=clone(initial);return {values,getStorageSync:k=>clone(values[k]||null),setStorageSync:(k,v)=>{values[k]=clone(v);}};}
const now=Date.parse('2026-10-22T12:00:00+08:00');
for(const q of bank.questions) {
 const patch=revision.appliedPatches[q.questionId];
 assert.equal(q.options[q.answerIndex],patch.options[patch.answerIndex]);
 q.options.forEach((label,index)=>{if(index!==q.answerIndex) assert.equal(q.distractorRationales[index],patch.distractorRationales[patch.options.indexOf(label)]);});
}
for(const type of new Set(bank.questions.map(q=>q.questionType))) assert.ok(new Set(bank.questions.filter(q=>q.questionType===type).map(q=>q.answerIndex)).size>1,'answer position leaks type '+type);
let checked=0;
for(const random of [()=>0,()=>.999,()=>.42]) {
 const memory=storage(),engine=create(bank,memory,()=>now,random),session=engine.start('qa',{count:15}).session;
 const frozen=clone(session.optionOrders);
 while(session.index<session.ids.length) {
  const q=engine.question(session.ids[session.index]);
  const options=engine.options(session,q.questionId);
  assert.ok(validOrder(options.map(o=>o.index),q.options.map((_,i)=>i)));
  options.forEach(o=>assert.equal(o.label,q.options[o.index]));
  const right=options.find(o=>o.index===q.answerIndex);
  assert.equal(engine.answer(session,right.index),true);assert.equal(engine.answer(session,right.index),false);
  const restoredEngine=create(bank,memory,()=>now,()=>{throw new Error('must not reshuffle restored session');});
  const restored=restoredEngine.resume('qa',{count:15}).session;
  assert.deepEqual(restored.optionOrders,frozen);
  assert.deepEqual(restored.answers,session.answers);
  assert.deepEqual(restoredEngine.options(restored,q.questionId),options);
  engine.advance(session);checked++;
 }
 assert.equal(engine.result(session).correct,15);
}
const memory=storage(), engine=create(bank,memory,()=>now,()=>0), old=engine.start('daily').session;
engine.answer(old,bank.questions.find(q=>q.questionId===old.ids[0]).answerIndex);engine.advance(old);
delete memory.values[STORAGE_KEY].sessions[old.key].optionOrders;
const legacy=create(bank,memory,()=>now,()=>0).resume('daily').session;
assert.deepEqual(legacy.optionOrders[legacy.ids[0]],[0,1,2]);assert.deepEqual(legacy.optionOrders[legacy.ids[1]],[0,1,2]);assert.deepEqual(legacy.optionOrders[legacy.ids[2]],[1,2,0]);assert.deepEqual(legacy.answers,old.answers);
const damaged=clone(memory.values);damaged[STORAGE_KEY].sessions[old.key].optionOrders[old.ids[1]]=[0,0,2];
const rejected=create(bank,storage(damaged),()=>now,()=>0).start('daily');assert.equal(rejected.invalidated,true);assert.deepEqual(rejected.session.answers,{});
for(const action of ['wrong','reveal','skip']) {
 const e=create(bank,storage(),()=>now,()=>0),s=e.start('daily').session,q=e.question(s.ids[0]);
 if(action==='wrong') e.answer(s,(q.answerIndex+1)%q.options.length);
 if(action==='reveal') e.answer(s,null);
 e.advance(s);const result=e.result(s);assert.equal(result.correct,0);assert.equal(result[action==='reveal'?'revealed':action==='skip'?'skipped':'wrong'],1);
}
let same=0,opposite=0;
for(const pair of banks.confusionItems) {
 const plan=platform.planLearningRoute(pkg,{type:'confusion',scopeId:pkg.indexes.rootNavigationIds[0],relationId:pair.relationId});
 let session=platform.createRouteSession(plan,now);
 const orders=clone(session.contrastOptionOrders),planChecks=clone(plan.steps.filter(s=>s.check).map(s=>s.check));
 session=platform.normalizeRouteSession(plan,clone(session));assert.deepEqual(session.contrastOptionOrders,orders);
 const repaired=platform.normalizeRouteSession(plan,{...clone(session),contrastOptionOrders:'damaged'});
 for(const step of plan.steps.filter(s=>s.check))assert.ok(validOrder(repaired.contrastOptionOrders[step.stepId],step.check.options.map(o=>o.unitId)));
 const vm=platform.projectRouteViewModel(pkg,plan,session);
 // Locate the projected pair without coupling grading to display nesting.
 const findPair=(obj)=>{if(!obj||typeof obj!=='object')return null;if(obj.initialCheck&&obj.variantCheck)return obj;for(const v of Object.values(obj)){const p=findPair(v);if(p)return p;}return null;};
 const shown=findPair(vm);assert.ok(shown,'projected checks missing');assert.equal(shown.sides[0].title,pair.left.title);assert.equal(shown.sides[1].title,pair.right.title);
 for(const stage of ['judgment','retest']) {const step=plan.steps.find(s=>s.stage===stage);const check=stage==='judgment'?shown.initialCheck:shown.variantCheck;assert.deepEqual(check.options.map(o=>o.unitId),orders[step.stepId]);}
 assert.deepEqual(plan.steps.filter(s=>s.check).map(s=>s.check),planChecks,'display projection mutated plan');
 const legacy=clone(session);delete legacy.contrastOptionOrders;
 assert.deepEqual(platform.normalizeRouteSession(plan,legacy).contrastOptionOrders[plan.steps[0].stepId],plan.steps[0].check.options.map(o=>o.unitId));
 session=platform.applyRouteSessionEvent(plan,session,{type:'REVEAL_CONTRAST_KEY',answerUnitId:pair.initialCheck.answerUnitId,at:now+1});
 session=platform.applyRouteSessionEvent(plan,session,{type:'CONFIRM_CONTRAST_BOUNDARY',at:now+2});
 for(const side of ['left','right'])session=platform.applyRouteSessionEvent(plan,session,{type:'VIEW_CONTRAST_SIDE',side,at:now+3});
 session=platform.applyRouteSessionEvent(plan,session,{type:'VIEW_CONTRAST_EVIDENCE',at:now+4});
 session=platform.applyRouteSessionEvent(plan,session,{type:'CONTRAST_RESPONSE',answerUnitId:pair.variantCheck.answerUnitId,at:now+5});
 assert.equal(session.status,'completed');assert.equal(session.responseByStepId[plan.steps[3].stepId].correct,true);
 if(pair.initialCheck.answerUnitId===pair.variantCheck.answerUnitId)same++;else opposite++;
}
assert.ok(same>0&&opposite>0,'semantic answers must not force a fixed switch pattern');
for(const id of Object.keys(revision.lessonPatches)) {
 const lesson=samples.lessons.find(l=>l.id===id);assert.ok(lesson.sections.some(s=>s.label==='材料怎样用'));assert.notEqual(lesson.question,lesson.reflection.prompt);assert.deepEqual(lesson.reflection,revision.lessonPatches[id].reflection);assert.equal(lesson.sections.find(s=>s.label==='材料怎样用').text,revision.lessonPatches[id].method.text);
}
for(const card of banks.recallCards){assert.notEqual(card.importance,'high-frequency-boundary');assert.equal(card.answerCharacterCount,card.answer.length,card.cardId+' stale answer length');}
assert.equal(Object.keys(revision.appliedPatches).length,24);assert.equal(Object.keys(revision.confusionPatches).length,14);
assert.equal(revision.pendingSourceReview.length,0);
const review=load('docs/knowledge-platform/implementations/evidence/politics-exam-alignment-review-20261022.json');
const effectiveness=load('docs/knowledge-platform/implementations/evidence/politics-exam-alignment-e3-tasks-20261022.json');
assert.equal(review.recall.length,136);assert.equal(review.lessons.length,72);
assert.equal(new Set(review.targets.flatMap(t=>t.objectiveIds)).size,12);
for(const t of review.targets){assert.ok(t.mustRecall.length&&t.checks.length===3);assert.ok(t.checks.every(id=>bank.questions.some(q=>q.questionId===id)));}
assert.equal(effectiveness.participants.length,0);assert.ok(effectiveness.tasks.every(t=>t.result===null));
const original=[0,1,2];assert.deepEqual(shuffledOrder(original,()=>0),[1,2,0]);assert.deepEqual(original,[0,1,2]);
console.log(JSON.stringify({status:'passed',gradedRestoredQuestions:checked,legacyMigration:true,invalidOrderRejected:true,nonChoiceNotCorrect:true,confusionCompleted:14,sameConceptVariants:same,changedConceptVariants:opposite,methods:8}));
