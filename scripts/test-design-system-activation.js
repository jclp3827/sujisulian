#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {validateActivation}=require('./lib/design-system-activation');
function runActivationTests(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ds2-activation-'));const cases=[];const clone=x=>JSON.parse(JSON.stringify(x));
 const git=args=>{const r=cp.spawnSync('git',['-c','core.hooksPath=/dev/null','-c','commit.gpgsign=false',...args],{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
 const commit=message=>{git(['add','--','.']);git(['-c','user.name=DS activation fixture','-c','user.email=ds-fixture@example.invalid','commit','--quiet','-m',message]);return git(['rev-parse','HEAD']);};
 function test(name,fn){fn();cases.push({name,passed:true});}
 function reject(name,reg,code){test(name,()=>{const r=validateActivation(root,reg);assert(!r.ok,name);assert(r.errors.some(x=>x.includes(code)),JSON.stringify(r));});}
 try{
  fs.mkdirSync(path.join(root,'miniprogram'),{recursive:true});fs.mkdirSync(path.join(root,'docs/design-system'),{recursive:true});fs.writeFileSync(path.join(root,'miniprogram/a.wxss'),'page{color:#fff;}\n');
  const version='fixture-1';fs.writeFileSync(path.join(root,'docs/design-system/registry.json'),JSON.stringify({designSystemVersion:version,activation:{state:'isolated-candidate'}}));git(['init','--quiet','-b','fixture-isolated']);const base=commit('synthetic baseline');
  const policy={schemaVersion:1,governanceVersion:version,repositoryAnchor:base,currentRequestId:'candidate-request',productScopes:['miniprogram'],candidateGrants:['isolated','preintegration'].map(x=>({id:'candidate-request',state:x==='isolated'?'isolated-candidate':'preintegration-candidate',branch:'fixture-'+x,sourceBaseline:base,authorizationScope:'candidate-only',authorizationSource:'unit fixture explicit candidate grant'})),formalAdoptionGate:{refPrefix:'refs/codex/design-system/adoptions/',receiptPath:'docs/design-system/adoption-approval.json',targetRef:'refs/heads/fixture-main'}};
  fs.writeFileSync(path.join(root,'docs/design-system/activation-policy.json'),JSON.stringify(policy));
  const isolated={designSystemVersion:version,sourceBaseline:base,sourceIdentity:{productTrees:{miniprogram:git(['rev-parse',base+':miniprogram'])}},activation:{state:'isolated-candidate',authorizationId:'candidate-request',branch:'fixture-isolated',sourceBaseline:base}};
  test('isolated candidate authorized scope passes',()=>assert(validateActivation(root,isolated).ok));
  let r=clone(isolated);r.activation.commonBaselineAdopted=true;reject('boolean toggle is not authority',r,'LEGACY_FLAGS');
  r=clone(isolated);r.activation.branch='some-other-branch';reject('wrong declared branch rejected',r,'BINDING');
  r=clone(isolated);r.activation.authorizationId='not-granted';reject('ungranted candidate rejected',r,'GRANT');
  r=clone(isolated);r.sourceIdentity.productTrees.miniprogram='0'.repeat(40);reject('wrong source identity rejected',r,'PRODUCT_IDENTITY');
  fs.writeFileSync(path.join(root,'miniprogram/a.wxss'),'page{color:#000;}');reject('tracked product drift rejected',isolated,'PRODUCT_DRIFT');fs.writeFileSync(path.join(root,'miniprogram/a.wxss'),'page{color:#fff;}\n');
  fs.writeFileSync(path.join(root,'miniprogram/new.js'),'module.exports=1;');reject('untracked product drift rejected',isolated,'PRODUCT_DRIFT');fs.unlinkSync(path.join(root,'miniprogram/new.js'));
  r=clone(isolated);r.activation.state='adopted-common-baseline';reject('formal declaration without authority ref rejected',r,'ADOPTION_REF');
  fs.writeFileSync(path.join(root,'docs/design-system/adoption-approval.json'),JSON.stringify({status:'approved'}));r.activation.adoptionRef='refs/codex/design-system/adoptions/missing';reject('working file receipt is not authority',r,'FORMAL_AUTHORIZATION');fs.unlinkSync(path.join(root,'docs/design-system/adoption-approval.json'));
  git(['branch','-m','fixture-preintegration']);const pre=clone(isolated);pre.activation={...pre.activation,state:'preintegration-candidate',branch:'fixture-preintegration',governanceSourceCommit:base};
  test('preintegration candidate authorized scope passes',()=>assert(validateActivation(root,pre).ok));
  r=clone(pre);r.activation.governanceSourceCommit='f'.repeat(40);reject('unknown governance source rejected',r,'GOVERNANCE_SOURCE');
  const formal=clone(isolated);formal.activation={state:'adopted-common-baseline',authorizationId:'later-explicit-approval',adoptionRef:'refs/codex/design-system/adoptions/synthetic-approved'};
  fs.writeFileSync(path.join(root,'docs/design-system/registry.json'),JSON.stringify(formal));const adopted=commit('synthetic adopted declaration');
  let receipt={status:'approved',state:'adopted-common-baseline',version,authorizationId:'later-explicit-approval',authorizationSource:'unit fixture, not a real project adoption',adoptedCommit:adopted,targetRef:'refs/heads/fixture-main'};
  const receiptFile=path.join(root,'docs/design-system/adoption-approval.json');fs.writeFileSync(receiptFile,JSON.stringify(receipt));const authority=commit('synthetic later authority receipt');git(['update-ref',formal.activation.adoptionRef,authority]);git(['update-ref','refs/heads/fixture-main',adopted]);
  test('formally adopted state needs recorded authority and actual target ancestry',()=>assert(validateActivation(root,formal).ok));
  git(['update-ref','refs/heads/fixture-main',base]);reject('receipt before actual target adoption rejected',formal,'NOT_IN_COMMON_BASELINE');git(['update-ref','refs/heads/fixture-main',adopted]);
  const goodReceipt=clone(receipt);
  function badReceipt(name,change,code){receipt=clone(goodReceipt);change(receipt);fs.writeFileSync(receiptFile,JSON.stringify(receipt));const at=commit('synthetic '+name);git(['update-ref',formal.activation.adoptionRef,at]);reject(name,formal,code);git(['update-ref',formal.activation.adoptionRef,authority]);receipt=clone(goodReceipt);fs.writeFileSync(receiptFile,JSON.stringify(receipt));}
  badReceipt('formal receipt wrong version rejected',r=>{r.version='unapproved-version';},'FORMAL_AUTHORIZATION');
  badReceipt('unapproved formal receipt rejected',r=>{r.status='draft';},'FORMAL_AUTHORIZATION');
  badReceipt('formal receipt wrong authorization rejected',r=>{r.authorizationId='ungranted';},'FORMAL_AUTHORIZATION');
  badReceipt('ordinary branch cannot impersonate declared target',r=>{r.targetRef='refs/heads/fixture-preintegration';},'FORMAL_TARGET');
  const descendantHead=git(['rev-parse','HEAD']);git(['update-ref','HEAD',base]);reject('current HEAD without adopted ancestor rejected',formal,'NOT_IN_COMMON_BASELINE');git(['update-ref','HEAD',descendantHead]);
  r=clone(formal);r.designSystemVersion='unapproved-version';reject('working registry wrong version rejected',r,'POLICY_VERSION');
  const grant={id:formal.activation.authorizationId,version,targetRef:'refs/heads/fixture-main',sourceBaseline:base,sourceCandidate:base,authorizationScope:'governance-adoption-only',authorizationSource:'synthetic explicit formal grant'};
  const candidateRequestId=policy.currentRequestId;policy.currentRequestId=grant.id;policy.formalAdoptionAuthorization=grant;fs.writeFileSync(path.join(root,'docs/design-system/activation-policy.json'),JSON.stringify(policy));
  test('explicit formal grant can name a separate common development branch',()=>assert(validateActivation(root,formal).ok));
  grant.targetRef='refs/heads/not-authorized';fs.writeFileSync(path.join(root,'docs/design-system/activation-policy.json'),JSON.stringify(policy));reject('formal grant target mismatch rejected',formal,'FORMAL_GRANT');grant.targetRef='refs/heads/fixture-main';
  grant.sourceCandidate='f'.repeat(40);fs.writeFileSync(path.join(root,'docs/design-system/activation-policy.json'),JSON.stringify(policy));reject('unapproved candidate ancestry rejected',formal,'APPROVED_CANDIDATE_NOT_ANCESTOR');grant.sourceCandidate=base;
  fs.writeFileSync(path.join(root,'docs/design-system/activation-policy.json'),JSON.stringify(policy));
  fs.writeFileSync(path.join(root,'miniprogram/a.wxss'),'page{color:#123abc;}\n');
  test('later product edits retain adopted lineage but audit exposes drift',()=>{assert(validateActivation(root,formal).ok);const audit=require('./validate-design-system').auditChanges(root,base);assert(audit.changedProductFiles.includes('miniprogram/a.wxss'));assert(audit.warnings.some(x=>x.includes('VISUAL_DELTA')));});
  fs.writeFileSync(path.join(root,'miniprogram/a.wxss'),'page{color:#fff;}\n');
  delete policy.formalAdoptionAuthorization;policy.currentRequestId=candidateRequestId;fs.writeFileSync(path.join(root,'docs/design-system/activation-policy.json'),JSON.stringify(policy));

  receipt.authorizationId='candidate-request';fs.writeFileSync(receiptFile,JSON.stringify(receipt));const badAuthority=commit('synthetic insufficient candidate-only authority');git(['update-ref',formal.activation.adoptionRef,badAuthority]);const badReg=clone(formal);badReg.activation.authorizationId='candidate-request';reject('current candidate request cannot authorize formal state',badReg,'FORMAL_AUTHORIZATION');
  return cases;
 }finally{fs.rmSync(root,{recursive:true,force:true});}
}
if(require.main===module)console.log(JSON.stringify({ok:true,cases:runActivationTests(),scope:'disposable synthetic Git repository only'},null,2));
module.exports={runActivationTests};
