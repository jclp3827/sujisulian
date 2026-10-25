// V2 source dispositions and targets; this is structural validation, not semantic approval.
const path=require('path'),assert=require('assert/strict');
const {createContext,validateClosure,validateLedger}=require('./lib/notes-memory-expansion-v2');
const root=path.resolve(__dirname,'..'),context=createContext(root);validateClosure(context);const stats=validateLedger(context);
const {availableCards}=require('../miniprogram/subpackages/note/services/memory-content');
const pack=require('../miniprogram/subpackages/note/models/memory-pack');
const {evaluateEnrollment}=require('../miniprogram/subpackages/note/services/memory-admission');
assert.equal(availableCards(context.body,{schemaVersion:1,sampleOnly:true,cards:context.ledger.cards},true).length,0);
const enrollment=evaluateEnrollment(pack.enrollment,context.body),development=availableCards(context.body,pack,true),expected=[...context.samples.cards.map(c=>c.id),...enrollment.development.map(c=>c.id)].sort();
assert.deepEqual(development.map(c=>c.id).sort(),expected);
assert.deepEqual(availableCards(context.body,pack,false).map(c=>c.id).sort(),enrollment.formal.map(c=>c.id).sort());
for(const card of context.ledger.cards.filter(c=>c.localHold))assert(!development.some(c=>c.id===card.id));
console.log(JSON.stringify({passed:true,version:2,sourceDispositions:stats.sources,targets:stats.targets,localHolds:stats.localTargetHolds,runtimeSamplesPreserved:context.samples.cards.length,registeredPreviews:enrollment.development.length,formalApproved:enrollment.formal.length,scope:'Source/target integrity, explicit registered consumption and hold isolation; not content approval'}));
