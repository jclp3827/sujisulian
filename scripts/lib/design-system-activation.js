'use strict';
// Scope/receipt consistency, not a cryptographic proof of human approval.
const fs=require('node:fs');const path=require('node:path');const cp=require('node:child_process');
const STATES=['isolated-candidate','preintegration-candidate','adopted-common-baseline'];
function git(root,args,optional=false){const r=cp.spawnSync('git',['--no-optional-locks','-C',root,...args],{encoding:'utf8',maxBuffer:8*1024*1024});if(r.status!==0&&!optional)throw Error(r.stderr?.trim()||r.error?.message||'git unavailable');return r.status===0?r.stdout.trim():null;}
function validateActivation(root,reg){
 const errors=[];const a=reg.activation||{};const fail=s=>errors.push('ACTIVATION_'+s);let actual={};
 try{
  const policy=JSON.parse(fs.readFileSync(path.join(root,'docs/design-system/activation-policy.json'),'utf8'));
  if(policy.schemaVersion!==1||policy.governanceVersion!==reg.designSystemVersion)fail('POLICY_VERSION');
  if(!STATES.includes(a.state))fail('STATE_INVALID');
  for(const key of ['scope','commonBaselineAdopted','releaseCandidateAdopted'])if(Object.hasOwn(a,key))fail('LEGACY_FLAGS_NOT_AUTHORITY');
  actual={branch:git(root,['branch','--show-current']),head:git(root,['rev-parse','HEAD']),formal:false};
  if(!/^[0-9a-f]{40}$/.test(reg.sourceBaseline||'')||!git(root,['rev-parse','--verify',reg.sourceBaseline+'^{commit}'],true))fail('SOURCE_BASELINE');
  if(!git(root,['rev-parse','--verify',policy.repositoryAnchor+'^{commit}'],true))fail('REPOSITORY_ANCHOR');
  if(a.state==='isolated-candidate'||a.state==='preintegration-candidate'){
   const grant=(policy.candidateGrants||[]).find(g=>g.id===a.authorizationId&&g.state===a.state&&g.branch===actual.branch&&g.sourceBaseline===reg.sourceBaseline);
   if(!grant)fail('CANDIDATE_GRANT_OR_BRANCH');
   if(a.branch!==actual.branch||a.sourceBaseline!==reg.sourceBaseline)fail('BINDING_MISMATCH');
   if(a.adoptionRef)fail('CANDIDATE_WITH_ADOPTION_REF');
   if(grant){
    if(!grant.authorizationSource||grant.authorizationScope!=='candidate-only')fail('GRANT_SCOPE');
    const ancestor=cp.spawnSync('git',['--no-optional-locks','-C',root,'merge-base','--is-ancestor',reg.sourceBaseline,actual.head]);if(ancestor.status!==0)fail('BASELINE_NOT_ANCESTOR');
    const scopes=policy.productScopes||[];
    if(!scopes.length||scopes.some(x=>typeof x!=='string'||x.startsWith('/')||x.includes('..')))fail('PRODUCT_SCOPES');
    else{
     const changed=git(root,['diff','--name-only',reg.sourceBaseline,'--',...scopes]);const untracked=git(root,['ls-files','--others','--exclude-standard','--',...scopes]);
     actual.changedProductFiles=[...new Set((changed+'\n'+untracked).split('\n').filter(Boolean))];if(actual.changedProductFiles.length)fail('CANDIDATE_PRODUCT_DRIFT');
     for(const scope of scopes){const tree=git(root,['rev-parse',reg.sourceBaseline+':'+scope],true);if((reg.sourceIdentity?.productTrees?.[scope]??null)!==tree)fail('PRODUCT_IDENTITY '+scope);}
    }
    if(a.state==='preintegration-candidate'){
     const source=a.governanceSourceCommit;
     if(!/^[0-9a-f]{40}$/.test(source||''))fail('GOVERNANCE_SOURCE');
     else{const raw=git(root,['show',source+':docs/design-system/registry.json'],true);let prior=null;try{prior=JSON.parse(raw);}catch{}
      if(!prior||prior.designSystemVersion!==reg.designSystemVersion||prior.activation?.state!=='isolated-candidate')fail('GOVERNANCE_SOURCE');}
    }
   }
  }else if(a.state==='adopted-common-baseline'){
   // Formal state requires an independently committed receipt and actual target ancestry.
   const gate=policy.formalAdoptionGate||{};
   if(!a.adoptionRef||!a.adoptionRef.startsWith(gate.refPrefix||'INVALID')||!/^refs\/[A-Za-z0-9/._-]+$/.test(a.adoptionRef||''))fail('ADOPTION_REF_REQUIRED');
   else{
    const authority=git(root,['rev-parse','--verify',a.adoptionRef+'^{commit}'],true);const raw=authority&&git(root,['show',authority+':'+gate.receiptPath],true);let receipt=null;try{receipt=JSON.parse(raw);}catch{}
    if(!receipt||receipt.status!=='approved'||receipt.state!=='adopted-common-baseline'||receipt.version!==reg.designSystemVersion||!receipt.authorizationSource||receipt.authorizationId!==a.authorizationId||(policy.candidateGrants||[]).some(g=>g.id===receipt.authorizationId&&g.authorizationScope==='candidate-only')||(!policy.formalAdoptionAuthorization&&receipt.authorizationId===policy.currentRequestId))fail('FORMAL_AUTHORIZATION_RECEIPT');
    else{
     if(receipt.targetRef!==gate.targetRef||!/^refs\/heads\//.test(receipt.targetRef||''))fail('FORMAL_TARGET');
     const grant=policy.formalAdoptionAuthorization;
     if(grant&&(grant.id!==receipt.authorizationId||grant.version!==reg.designSystemVersion||grant.targetRef!==gate.targetRef||grant.sourceBaseline!==reg.sourceBaseline||grant.authorizationScope!=='governance-adoption-only'||!grant.authorizationSource))fail('FORMAL_GRANT');
     const adopted=receipt.adoptedCommit;
     if(!/^[0-9a-f]{40}$/.test(adopted||''))fail('ADOPTED_COMMIT');
     else{
      if(grant){const r=/^[0-9a-f]{40}$/.test(grant.sourceCandidate||'')&&cp.spawnSync('git',['--no-optional-locks','-C',root,'merge-base','--is-ancestor',grant.sourceCandidate,adopted]);if(!r||r.status!==0)fail('APPROVED_CANDIDATE_NOT_ANCESTOR');}
      for(const descendant of [actual.head,receipt.targetRef]){const r=cp.spawnSync('git',['--no-optional-locks','-C',root,'merge-base','--is-ancestor',adopted,descendant]);if(r.status!==0)fail('NOT_IN_COMMON_BASELINE '+descendant);}
      const at=git(root,['show',adopted+':docs/design-system/registry.json'],true);let registered=null;try{registered=JSON.parse(at);}catch{}
      if(registered?.designSystemVersion!==reg.designSystemVersion||registered?.activation?.state!=='adopted-common-baseline'||registered?.activation?.adoptionRef!==a.adoptionRef)fail('ADOPTED_DECLARATION');
     }
    }
   }
   actual.formal=!errors.length;
  }
 }catch(e){fail('UNAVAILABLE '+e.message);}
 return {ok:!errors.length,state:a.state||null,errors,actual,limits:'Checks Git scope, references and recorded authority, not human signatures. Recorded authority and target ancestry must agree; this does not authorize product changes or release.'};
}
module.exports={validateActivation,STATES};
