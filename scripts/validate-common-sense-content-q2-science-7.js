#!/usr/bin/env node
"use strict";
const assert=require("assert/strict");
const body=require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack=require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored=require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2=require("../docs/knowledge-platform/content/common-sense-content-q2-science-7");
const {compile}=require("./build-common-sense-learning");
const {auditPack}=require("./lib/common-sense-content-quality-gate");
const {availableContent}=require("../miniprogram/subpackages/common-sense/services/learning-content");
const {entryQuestions,entryMnemonics}=require("../miniprogram/subpackages/common-sense/services/learning-entry");
assert.deepEqual(compile(authored,body),pack);
assert.equal(pack.version,"2026-10-23.96");
assert.deepEqual({questions:pack.questions.length,targets:pack.targets.length,groups:pack.groups.length,mnemonics:pack.mnemonics.length},{questions:606,targets:497,groups:133,mnemonics:129});
const ids=new Set(q2.QUESTION_IDS),targetIds=new Set(Object.keys(q2.targetRows));
const questions=pack.questions.filter(x=>ids.has(x.id));
assert.equal(questions.length,10);
assert.ok(questions.every(x=>x.revision===2&&x.status==="review"));
assert.deepEqual(Object.fromEntries(questions.map(x=>[x.id,x.answer])),{"light-primary-colors-core":1,"pigment-primary-colors-core":2,"light-color-mixing-core":0,"pigment-color-mixing-core":1,"primary-colors-full":2,"transparent-color-core":0,"opaque-color-core":2,"white-black-opaque-core":1,"red-clothes-core":0,"object-colors-full":2});
assert.equal(new Set(questions.map(x=>x.prompt.replace(/\s+/gu,""))).size,10);
for(const x of questions){
 const s=pack.questionSpecifications.find(v=>v.questionId===x.id),r=pack.targetRelations.questionTargets.find(v=>v.questionId===x.id);
 assert.ok(s&&r); assert.equal(s.checkPurpose,"q2-optics-color-application"); assert.equal(s.checkPurpose,r.checkPurpose); assert.equal(s.cognitiveLevel,q2.cognitiveLevels[x.id]);
 assert.deepEqual(Object.keys(s.distractorReasons).map(Number).sort(),x.options.map((_,i)=>i).filter(i=>i!==x.answer));
 assert.ok(Object.values(s.distractorReasons).every(v=>v.length>=12));
 const lens=x.options.map(v=>Array.from(v).length); assert.ok(!lens.filter((_,i)=>i!==x.answer).every(v=>lens[x.answer]>v));
 assert.ok(!x.prompt.includes("正文")&&!x.explanation.includes("正文")&&!x.boundary.includes("正文"));
}
for(const id of targetIds){const t=pack.targets.find(x=>x.id===id),v=pack.variationDecisions.find(x=>x.targetId===id);assert.equal(t.revision,2);assert.deepEqual(v.directQuestionIds,q2.variationRows[id].directQuestionIds);assert.deepEqual(v.variationQuestionIds,q2.variationRows[id].variationQuestionIds);assert.ok(v.processDifference.length>=20);}
assert.equal(q2.questionDispositions.length,10); assert.ok(q2.questionDispositions.every(x=>x.decision==="rewrite"));
assert.deepEqual(q2.mnemonicDispositions.map(x=>x.decision),["retain-as-study-outline","structural-mnemonic-candidate"]);
const pg=pack.groups.find(x=>x.id==="optics-primary-colors"),og=pack.groups.find(x=>x.id==="optics-object-colors");
const pm=pack.mnemonics.find(x=>x.id==="primary-colors-memory"),om=pack.mnemonics.find(x=>x.id==="object-colors-memory");
assert.equal(pg.mnemonicDecision,"study-outline");assert.equal(og.mnemonicDecision,"structural-mnemonic");
assert.deepEqual([pm.revision,pm.title,pm.learningForm,pm.formLabel],[2,"光与颜料配色对照","study-outline","速记提纲"]);assert.equal(pm.method,"原色集合—两色结果—三色结果三栏对照");assert.ok(pm.phrases.every(x=>x.coverageType==="study-outline-reference"));
assert.deepEqual([om.revision,om.title,om.learningForm,om.formLabel],[2,"透反判断诀","structural-mnemonic","结构口诀"]);assert.equal(om.method,"先分透明性，再按透过或反射判断，最后核对白黑与红衣");assert.ok(om.text.includes("透明先看透过光")&&om.text.includes("不透明改看反射光"));assert.ok(om.phrases.every(x=>x.coverageType==="structural-decision-with-boundary"));
const targeted={...pack,questions,targets:pack.targets.filter(x=>targetIds.has(x.id)),targetRelations:{...pack.targetRelations,questionTargets:pack.targetRelations.questionTargets.filter(x=>ids.has(x.questionId))},questionSpecifications:pack.questionSpecifications.filter(x=>ids.has(x.questionId))};
const quality=auditPack(targeted),targetedViolations=Object.fromEntries(quality.rules.filter(x=>x.violationCount>0).map(x=>[x.id,x.sampleViolations]));assert.deepEqual(targetedViolations,{});
const dev=availableContent(body,pack,true),formal=availableContent(body,pack,false);assert.ok(q2.QUESTION_IDS.every(id=>dev.questions.some(x=>x.id===id)));assert.ok(q2.QUESTION_IDS.every(id=>!formal.questions.some(x=>x.id===id)));assert.ok(q2.QUESTION_IDS.every(id=>entryQuestions(dev,"qa").some(x=>x.id===id)));assert.ok(entryMnemonics(dev,"science-technology").some(x=>x.id===pm.id&&x.formLabel==="速记提纲"));assert.ok(entryMnemonics(dev,"science-technology").some(x=>x.id===om.id&&x.formLabel==="结构口诀"));
console.log(JSON.stringify({passed:true,batch:q2.batch,packVersion:pack.version,status:q2.status,releaseBlocked:true,totals:{questions:606,targets:497,groups:133,mnemonics:129},themes:[{id:pg.id,title:pg.title,questions:5,mnemonicDecision:pg.mnemonicDecision},{id:og.id,title:og.title,questions:5,mnemonicDecision:og.mnemonicDecision}],qualityReview:{rewrittenQuestions:10,questionErrors:0,questionWarnings:0,targetedViolations,mnemonicDispositions:{primaryColors:{revision:pm.revision,classification:pm.learningForm,memoryTrialEvidence:false},objectColors:{revision:om.revision,classification:om.learningForm,memoryTrialEvidence:false}}},entryIsolation:{qaQuestions:entryQuestions(dev,"qa").length,formalQuestions:formal.questions.length},nextTask:"Q2-next-theme-selection"},null,2));
