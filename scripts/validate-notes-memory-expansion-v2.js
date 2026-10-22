const assert=require('assert/strict'),path=require('path');
const {createContext,validateClosure,validateLedger,buildPlan,clone}=require('./lib/notes-memory-expansion-v2');
const {hash}=require('../miniprogram/subpackages/note/services/memory-content');
const ctx=createContext(path.resolve(__dirname,'..')),reports=[];
function test(name,fn){fn();reports.push(name);}
function changed(fn){const ledger=clone(ctx.ledger);fn(ledger);return ledger;}
test('baseline source/target ledger is independent of a card-count quota',()=>{assert.deepEqual(validateLedger(ctx),{sources:8,targets:8,localTargetHolds:2});});
test('one source may propose a second independent target for subsequent semantic review',()=>{
 const ledger=changed(l=>{const c=clone(l.cards.find(c=>c.pointId==='current-ratio'));c.id+='-multiple-parts';c.targetId+='-multiple-parts';c.title='多部分比重：原公式';c.prompt='多部分比重如何表示，整体应同哪些口径？';c.recallGoal='多部分合计比重的关系与口径';c.classificationReason='不同于单部分关系的待审目标';
 const point=ctx.body['data-analysis'].points.find(p=>p.id===c.pointId),tab=point.tabs.find(t=>t.id==='knowledge');c.refs[0].blocks=[1,5].map(blockIndex=>({blockIndex,expectedBlockSha256:hash(tab.blocks[blockIndex])}));l.cards.push(c);l.sourceDispositions.find(d=>d.workUnitId===c.workUnitIds[0]).targetIds.push(c.targetId);});
 assert.equal(validateLedger(ctx,ledger).targets,9);
});
test('one source can remain only in original body with zero proposed cards and explicit disposition',()=>{
 const ledger=changed(l=>{const card=l.cards.find(c=>c.pointId==='current-ratio');l.cards=l.cards.filter(c=>c.id!==card.id);const d=l.sourceDispositions.find(d=>d.workUnitId===card.workUnitIds[0]);d.state='not-card';d.targetIds=[];d.reason='测试中的明确仅正文处置，尚不宣称内容批准。';});assert.equal(validateLedger(ctx,ledger).targets,7);
});
test('missing or duplicate source dispositions cannot be disguised by keeping card count',()=>{
 assert.throws(()=>validateLedger(ctx,changed(l=>l.sourceDispositions.pop())),/覆盖/);
 assert.throws(()=>validateLedger(ctx,changed(l=>l.sourceDispositions.at(-1).workUnitId=l.sourceDispositions[0].workUnitId)),/覆盖/);
});
test('valid original references outside the planned work unit are rejected',()=>{
 const ledger=changed(l=>{const c=l.cards.find(c=>c.pointId==='pulling-contribution'),pilot=ctx.samples.cards.find(c=>c.id==='memory-v5-da-base');for(const key of ['subjectId','pointId','categoryId','kind','title','prompt','refs'])c[key]=clone(pilot[key]);});assert.throws(()=>validateLedger(ctx,ledger),/来源任务不匹配/);
});
test('actual refs cannot be substituted while keeping source metadata unchanged',()=>{
 const ledger=changed(l=>l.cards.at(-1).refs=clone(ctx.samples.cards[0].refs));assert.throws(()=>validateLedger(ctx,ledger),/实际引用/);
});
test('illegal collection, wrong category, empty target and stale exact source fail',()=>{
 assert.throws(()=>validateLedger(ctx,changed(l=>l.cards[0].kind='banana')),/非法记忆板块/);
 assert.throws(()=>validateLedger(ctx,changed(l=>l.cards[0].categoryId='wrong')),/归属/);
 assert.throws(()=>validateLedger(ctx,changed(l=>l.cards[0].targetId='')),/目标身份/);
 assert.throws(()=>validateLedger(ctx,changed(l=>l.cards[0].refs[0].expectedTabSha256='0'.repeat(64))),/来源内容已更新/);
});
test('duplicate target or card identities and incomplete source-to-target mapping fail',()=>{
 assert.throws(()=>validateLedger(ctx,changed(l=>l.cards.at(-1).targetId=l.cards[0].targetId)),/目标身份/);
 assert.throws(()=>validateLedger(ctx,changed(l=>l.cards.at(-1).id=l.cards[0].id)),/卡片身份/);
 assert.throws(()=>validateLedger(ctx,changed(l=>l.sourceDispositions[0].targetIds=[])),/实际目标/);
});
test('author cannot mark development drafts as accepted or silently clear their hold count',()=>{
 assert.throws(()=>validateLedger(ctx,changed(l=>l.cards[0].semanticReview='accepted')),/自签批准/);
 assert.throws(()=>validateLedger(ctx,changed(l=>l.cards[0].localHold=null)),/暂缓数量/);
});
test('two known local rework items have explicit reasons and recovery, without changing source body',()=>{
 for(const id of ['average-denominator','period-terms']){const c=ctx.ledger.cards.find(c=>c.pointId===id);assert(c.localHold.reason&&c.localHold.recovery);}
});
test('P3 empty requirements or local deferrals cannot pass by status labels',()=>{
 for(const key of ['requirements','verifiedImplementationFiles','localDeferrals']){const closure=clone(ctx.closure);closure[key]=[];assert.throws(()=>validateClosure(ctx,closure));}
});
test('P3 implementation proof mismatch fails without rewriting the original evidence',()=>{
 const closure=clone(ctx.closure);closure.verifiedImplementationFiles[0].sha256='0'.repeat(64);assert.throws(()=>validateClosure(ctx,closure),/实现证据已变化/);assert(validateClosure(ctx).closureDigest);
});
test('application work queues cover all218 exact original identities and retain inherited holds',()=>{
 const p=buildPlan(ctx);assert.equal(p.applications.examples.length,218);assert.equal(new Set(p.applications.examples.map(e=>e.sourceExampleRecordId)).size,218);assert.equal(p.applications.currentDevelopmentQuestions,12);
 for(const old of ctx.queue.priorSourceHolds){const unit=p.applications.examples.find(e=>e.sourceExampleRecordId===old.origin.sourceExampleRecordId);assert(unit.currentSourceHolds.some(h=>h.questionId===old.questionId));assert.equal(unit.disposition,'inherited-source-hold');assert.equal(unit.newImportAuthorized,false);}
 assert(p.applications.imageMaterials.every(e=>e.isQuestion===false&&e.locatorIsRuntimeIdentity===false));
});
test('every module has distinct design, preview, review, admission and device evidence paths',()=>{
 const p=buildPlan(ctx);for(const m of p.modules){assert.equal(m.stages.length,6);assert.equal(new Set(m.stages.map(s=>s.exitEvidence)).size,6);assert(m.applicationWorkUnitIds.length>0);}
 for(const id of ['PREVIEW','REVIEW','ADMIT'])assert(p.stageDefinitions.find(s=>s.id===id).dependsOn.includes('ME-G0'));
 assert(p.semanticVersionContract.status.includes('not-yet-fixed'));
 assert(p.stageDefinitions.find(s=>s.id==='DEVICE-RELEASE').releaseDependsOn.includes('ADMIT'));
});
test('target classifications reflect current goals, without overwriting historical source hints',()=>{
 const p=buildPlan(ctx),m=p.modules[0];for(const point of ['ratio-change','multiple-growth']){const unit=m.sources.find(s=>s.sourceIdentity.pointId===point);assert.equal(unit.historicalSourceKindHint,'basic');assert.equal(unit.targetClassifications[0].kind,'method');assert(unit.targetClassifications[0].reason);}
});
console.log(JSON.stringify({passed:true,checks:reports.length,scope:'V2 plan integrity and isolated positive/negative ledger fixtures; no runtime change or semantic approval',reports},null,2));
