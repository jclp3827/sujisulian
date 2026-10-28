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
  receipt.authorizationId='candidate-request';fs.writeFileSync(receiptFile,JSON.stringify(receipt));const badAuthority=commit('synthetic insufficient candidate-only authority');git(['update-ref',formal.activation.adoptionRef,badAuthority]);const badReg=clone(formal);badReg.activation.authorizationId='candidate-request';reject('current candidate request cannot authorize formal state',badReg,'FORMAL_AUTHORIZATION');
  return cases;
 }finally{fs.rmSync(root,{recursive:true,force:true});}
}
if(require.main===module)console.log(JSON.stringify({ok:true,cases:runActivationTests(),scope:'disposable synthetic Git repository only'},null,2));
module.exports={runActivationTests};
