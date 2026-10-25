#!/usr/bin/env node
"use strict";
const assert=require("assert/strict");
const body=require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const pack=require("../miniprogram/subpackages/common-sense/models/learning-pack");
const authored=require("../docs/knowledge-platform/content/common-sense-learning-v1");
const q2=require("../docs/knowledge-platform/content/common-sense-content-q2-economics-6");
const {compile}=require("./build-common-sense-learning");
const {auditPack}=require("./lib/common-sense-content-quality-gate");
const {availableContent}=require("../miniprogram/subpackages/common-sense/services/learning-content");
const {entryQuestions,entryMnemonics}=require("../miniprogram/subpackages/common-sense/services/learning-entry");
assert.deepEqual(compile(authored,body),pack);
assert.equal(pack.version,"2026-10-23.97");
assert.deepEqual({questions:pack.questions.length,targets:pack.targets.length,groups:pack.groups.length,mnemonics:pack.mnemonics.length},{questions:606,targets:497,groups:133,mnemonics:129});
const ids=new Set(q2.QUESTION_IDS),targetIds=new Set(Object.keys(q2.targetRows));
const questions=pack.questions.filter(x=>ids.has(x.id));
assert.equal(questions.length,7);assert.ok(questions.every(x=>x.revision===2&&x.status==="review"));
assert.deepEqual(Object.fromEntries(questions.map(x=>[x.id,x.answer])),{"information-asymmetry-definition":0,"adverse-selection-before":1,"moral-hazard-after":1,"information-asymmetry-remedy":0,"information-asymmetry-full":1,"market-failure-meaning-direct":0,"market-failure-meaning-scenario":0});
assert.equal(new Set(questions.map(x=>x.prompt.replace(/\s+/gu,""))).size,7);
for(const x of questions){
 const s=pack.questionSpecifications.find(v=>v.questionId===x.id),r=pack.targetRelations.questionTargets.find(v=>v.questionId===x.id);assert.ok(s&&r);assert.equal(s.checkPurpose,r.checkPurpose);assert.equal(s.checkPurpose,x.id.startsWith("market-failure-meaning")?"q2-economics-market-failure-definition":"q2-economics-information-asymmetry");assert.equal(s.cognitiveLevel,q2.cognitiveLevels[x.id]);assert.deepEqual(Object.keys(s.distractorReasons).map(Number).sort(),x.options.map((_,i)=>i).filter(i=>i!==x.answer));assert.ok(Object.values(s.distractorReasons).every(v=>v.length>=12));const lens=x.options.map(v=>Array.from(v).length);assert.ok(!lens.filter((_,i)=>i!==x.answer).every(v=>lens[x.answer]>v));assert.ok(![x.prompt,...x.options,x.explanation,x.boundary].some(v=>/正文|本批|本节|按教材|原图|源文/u.test(v)));
}
for(const id of targetIds){const t=pack.targets.find(x=>x.id===id),v=pack.variationDecisions.find(x=>x.targetId===id);assert.equal(t.revision,2);assert.deepEqual(v.directQuestionIds,q2.variationRows[id].directQuestionIds);assert.deepEqual(v.variationQuestionIds,q2.variationRows[id].variationQuestionIds);assert.ok(v.processDifference.length>=20);}
assert.equal(q2.questionDispositions.length,7);assert.ok(q2.questionDispositions.every(x=>x.decision==="rewrite"));assert.deepEqual(q2.mnemonicDispositions.map(x=>x.decision),["structural-mnemonic-candidate","not-suitable"]);
const ig=pack.groups.find(x=>x.id==="market-failure-information-mechanism"),mg=pack.groups.find(x=>x.id==="market-failure-meaning"),im=pack.mnemonics.find(x=>x.id==="information-asymmetry-memory");
assert.equal(ig.mnemonicDecision,"structural-mnemonic");assert.equal(mg.mnemonicDecision,"not-suitable");
assert.deepEqual([im.revision,im.title,im.learningForm,im.formLabel],[2,"先看信息差，再分前后","structural-mnemonic","结构口诀"]);assert.equal(im.method,"先核对交易信息差，再按交易前后与行为机制区分两类风险，最后接信息治理方向");assert.ok(im.text.includes("事前逆向选择，差品挤好品")&&im.text.includes("事后道德风险，损他利自己"));assert.ok(im.phrases.every(x=>x.coverageType==="structural-information-stage-behavior-remedy"));
const targeted={...pack,questions,targets:pack.targets.filter(x=>targetIds.has(x.id)),targetRelations:{...pack.targetRelations,questionTargets:pack.targetRelations.questionTargets.filter(x=>ids.has(x.questionId))},questionSpecifications:pack.questionSpecifications.filter(x=>ids.has(x.questionId))};
const quality=auditPack(targeted),targetedViolations=Object.fromEntries(quality.rules.filter(x=>x.violationCount>0).map(x=>[x.id,x.sampleViolations]));assert.deepEqual(targetedViolations,{});
const dev=availableContent(body,pack,true),formal=availableContent(body,pack,false);assert.ok(q2.QUESTION_IDS.every(id=>dev.questions.some(x=>x.id===id)));assert.ok(q2.QUESTION_IDS.every(id=>!formal.questions.some(x=>x.id===id)));assert.ok(q2.QUESTION_IDS.every(id=>entryQuestions(dev,"qa").some(x=>x.id===id)));assert.ok(entryMnemonics(dev,"economics").some(x=>x.id===im.id&&x.formLabel==="结构口诀"));
console.log(JSON.stringify({passed:true,batch:q2.batch,packVersion:pack.version,status:q2.status,releaseBlocked:true,totals:{questions:606,targets:497,groups:133,mnemonics:129},themes:[{id:ig.id,title:ig.title,questions:5,mnemonicDecision:ig.mnemonicDecision},{id:mg.id,title:mg.title,questions:2,mnemonicDecision:mg.mnemonicDecision}],qualityReview:{rewrittenQuestions:7,questionErrors:0,questionWarnings:0,targetedViolations,mnemonicDispositions:{information:{revision:im.revision,classification:im.learningForm,memoryTrialEvidence:false},meaning:{classification:"not-suitable"}}},entryIsolation:{qaQuestions:entryQuestions(dev,"qa").length,formalQuestions:formal.questions.length},nextTask:"Q2-economics-7-selection"},null,2));
