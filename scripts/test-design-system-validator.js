#!/usr/bin/env node
'use strict';
// Mutations are made only to temporary JSON/data or a disposable Git fixture.
const assert=require('node:assert/strict');
const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const cp=require('node:child_process');
const {validate,analyzeStyles,auditChanges,consumerLookup,queryEntries,summarizeEntry}=require('./validate-design-system');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'peanut-ds2-validator-'));
const original=JSON.parse(fs.readFileSync(path.join(root,'docs/design-system/registry.json'),'utf8'));
const results=[];const clone=x=>JSON.parse(JSON.stringify(x));
function test(name,fn){fn();results.push({name,passed:true});}
function mutation(name,mutate,expected){test(name,()=>{const r=clone(original);mutate(r);const file=path.join(temp,name+'.json');fs.writeFileSync(file,JSON.stringify(r));const result=validate(root,{registry:JSON.parse(fs.readFileSync(file,'utf8'))});assert(!result.ok,name+' must fail');assert(result.errors.some(e=>e.includes(expected)),JSON.stringify(result.errors));});}
try{
 test('normal registry passes',()=>assert(validate(root).ok));
 mutation('missing source reference',r=>{r.entries[0].sources[0].path='miniprogram/not-present.json';},'PATH_MISSING');
 mutation('duplicate ID',r=>{r.entries.push(clone(r.entries[0]));},'ID_DUPLICATE');
 mutation('illegal state',r=>{r.entries[0].status='ready';},'STATUS_INVALID');
 mutation('later source must be a committed ancestor',r=>{r.entries.find(e=>e.id==='CMP-COMMON-NOTE-EXAMPLE').implementation.baseline='0000000000000000000000000000000000000000';},'IMPLEMENTATION_PROVENANCE');
 mutation('unknown contract',r=>{r.entries[0].contractIds.push('DS-ABSENT-999');},'CONTRACT_REFERENCE');
 mutation('recipe consumer drift',r=>{r.entries.find(e=>e.id==='PAT-ACTIONS').usageRecipes[0].consumers.pop();},'RECIPE_CONSUMER_MISMATCH');
 test('consumer query includes photo button reference',()=>{const e=original.entries.find(e=>e.id==='PAT-ACTIONS'),r=consumerLookup(root,e,original);assert(r.staticReferences.items.find(x=>x.recipe==='btn-base').consumers.some(c=>c.page==='subpackages/photo/process/index'));});
 mutation('photo role outside applicable scope',r=>{const e=r.entries.find(e=>e.id==='PAT-ACTIONS');e.applicablePages=e.applicablePages.filter(p=>p!=='subpackages/photo/process/index');},'OUTSIDE_APPLICABLE');
 mutation('pattern cannot claim direct component consumer',r=>{const e=r.entries.find(e=>e.id==='PAT-MEMORY');e.consumers=[{page:e.rolePages[0].page,usage:'component',relation:'direct-component'}];},'PATTERN_RELATIONS');
 mutation('bare root cannot be strong role evidence',r=>{const e=r.entries.find(e=>e.id==='PAT-LAYOUT'),c=e.rolePages[0];c.evidence={path:'miniprogram/pages/home/index.wxml',literal:'<view class="home-page">',strength:'role-specific-literal'};},'ROLE_SPECIFIC_EVIDENCE_WEAK');
 test('short query omits role evidence and full consumers',()=>{const rows=queryEntries(original,'button').map(summarizeEntry);assert(rows.some(e=>e.id==='PAT-ACTIONS'));assert(JSON.stringify(rows).length<4000);assert(rows.every(e=>!('consumers'in e)&&!('rolePages'in e)&&e.sourceEntrypoints.length));});
 test('full registry and consumer evidence remain available',()=>{const e=original.entries.find(e=>e.id==='PAT-ACTIONS');assert(e.rolePages.length&&e.applicablePages.includes('subpackages/photo/process/index'));assert(consumerLookup(root,e,original).relatedPages.length);});
 mutation('consumer drift',r=>{r.entries[0].consumers.pop();},'CONSUMER_MISMATCH');
 mutation('approval without evidence',r=>{r.entries[0].status='approved';},'APPROVAL_EVIDENCE');
 mutation('invalid deprecation replacement',r=>{r.entries[0].status='deprecated';r.entries[0].replacedBy=r.entries[1].id;},'REPLACEMENT_INVALID');
 mutation('path escape',r=>{r.entries[0].sources[0].path='../not-allowed';},'PATH_INVALID');
 test('explicit historical reference allowed',()=>{const r=clone(original);r.entries[10].sources.push({path:'historical/not-in-tree.wxss',kind:'historical',reason:'archived-only, not a live dependency'});assert(validate(root,{registry:r}).ok);});
 test('illegal contract state detected',()=>{const text=fs.readFileSync(path.join(root,'docs/design-system/contracts.md'),'utf8').replace('状态: approved','状态: ready');assert(validate(root,{contractText:text}).errors.some(e=>e.startsWith('CONTRACT_STATUS')));});
 test('undefined required variable detected',()=>assert(analyzeStyles([{path:'styles/theme.wxss',text:'page{color:var(--missing);}'}]).errors.some(e=>e.includes('UNDEFINED_VAR'))));
 test('optional fallback retained as notice',()=>{const r=analyzeStyles([{path:'styles/theme.wxss',text:'page{color:var(--optional,#fff);}'}]);assert(!r.errors.length);assert(r.warnings.some(e=>e.includes('OPTIONAL_FALLBACK')));});
 test('nested undefined fallback detected',()=>assert(analyzeStyles([{path:'styles/theme.wxss',text:'page{color:var(--optional,var(--required));}'}]).errors.some(e=>e.includes('--required'))));
 test('token cycle detected',()=>assert(analyzeStyles([{path:'styles/theme.wxss',text:'page{--a:var(--b);--b:var(--a);}'}]).errors.some(e=>e.includes('TOKEN_CYCLE'))));
 test('imported token cycle detected',()=>assert(analyzeStyles([{path:'styles/a.wxss',text:'@import "b.wxss"; .a{--a:var(--b);}'},{path:'styles/b.wxss',text:'.b{--b:var(--a);}'}]).errors.some(e=>e.includes('TOKEN_CYCLE'))));
 test('missing style import detected',()=>assert(analyzeStyles([{path:'styles/a.wxss',text:'@import "missing.wxss";'}]).errors.some(e=>e.includes('STYLE_IMPORT_MISSING'))));
 test('acyclic aliases pass',()=>assert(!analyzeStyles([{path:'styles/theme.wxss',text:'page{--a:#fff;--b:var(--a);color:var(--b);}'}]).errors.length));
 test('invalid audit baseline is not zero change',()=>assert(validate(root,{auditBase:'does-not-exist-ds2-fixture'}).errors.some(e=>e.includes('AUDIT_UNAVAILABLE'))));
 test('new visual and component are auditable',()=>{
  const fixture=path.join(temp,'git-fixture');fs.mkdirSync(path.join(fixture,'miniprogram/components/new'),{recursive:true});
  function git(args){const r=cp.spawnSync('git',args,{cwd:fixture,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();}
  fs.writeFileSync(path.join(fixture,'miniprogram/base.wxss'),'page{color:#fff;font-size:28rpx;}\n');git(['init','--quiet']);git(['add','--','miniprogram/base.wxss']);git(['-c','user.name=DS fixture','-c','user.email=ds-fixture@example.invalid','-c','commit.gpgsign=false','commit','--quiet','-m','temporary audit fixture']);const base=git(['rev-parse','HEAD']);
  fs.writeFileSync(path.join(fixture,'miniprogram/base.wxss'),'page{color:#123abc;font-size:31rpx;}\n');fs.writeFileSync(path.join(fixture,'miniprogram/components/new/index.json'),'{"component":true}\n');
  const audit=auditChanges(fixture,base);assert(audit.warnings.some(e=>e.includes('NEW_COMPONENT')));assert(audit.warnings.some(e=>e.includes('VISUAL_DELTA')&&e.includes('#123abc')));
 });
 results.push(...require('./test-design-system-activation').runActivationTests());
 console.log(JSON.stringify({ok:true,passed:results.length,cases:results,mutationScope:'temporary JSON and disposable Git fixture; production source untouched'},null,2));
}finally{fs.rmSync(temp,{recursive:true,force:true});}
