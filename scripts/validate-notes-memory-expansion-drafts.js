// V2 source dispositions and targets; this is structural validation, not semantic approval.
const path=require('path'),assert=require('assert/strict');
const {createContext,validateClosure,validateLedger}=require('./lib/notes-memory-expansion-v2');
const root=path.resolve(__dirname,'..'),context=createContext(root);validateClosure(context);const stats=validateLedger(context);
const {availableCards}=require('../miniprogram/subpackages/note/services/memory-content');
const pack=require('../miniprogram/subpackages/note/models/memory-pack');
assert.equal(availableCards(context.body,{schemaVersion:1,sampleOnly:true,cards:context.ledger.cards},true).length,0);
assert.equal(availableCards(context.body,pack,false).length,0);assert.equal(availableCards(context.body,pack,true).length,context.samples.cards.length);
console.log(JSON.stringify({passed:true,version:2,sourceDispositions:stats.sources,targets:stats.targets,localHolds:stats.localTargetHolds,runtimeCardsUnchanged:context.samples.cards.length,formalApproved:0,scope:'Source binding, zero-to-many target design, disposition coverage and non-admission only'}));
