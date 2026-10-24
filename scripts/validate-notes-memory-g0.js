// Artificial receipts stay in memory. This validator never writes live authoring/review/storage.
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),{createRequire}=require('module');
const root=path.resolve(__dirname,'..');
const {loadInputs,enrollmentFor,register,reviewPacket,compatibilityOutput,persistReviewPacket,appendDecision,appendEnablement}=require('./lib/notes-memory-admission');
const {availableCards,resolveCard,hash}=require('../miniprogram/subpackages/note/services/memory-content');
const policy=require('../miniprogram/subpackages/note/services/memory-admission');
const {digest}=require('../miniprogram/subpackages/note/services/learning-semantic');
const {createMemoryEngine,KEY}=require('../miniprogram/subpackages/note/services/memory-session');
const pack=require('../miniprogram/subpackages/note/models/memory-pack');
const inputs=loadInputs(root),body=inputs.context.body,samples=inputs.context.samples.cards,clone=v=>JSON.parse(JSON.stringify(v)),reports=[];
const livePaths=['memory-v5-registry.json','memory-v5-reviews.json','memory-v5-enablement.json','memory-v5-da01-targets-v2.json'].map(p=>path.join(root,'docs/knowledge-platform/content/notes',p));
const beforeLive=livePaths.map(p=>fs.readFileSync(p,'utf8'));
function test(name,fn){fn();reports.push(name);}
function refresh(card,b){const c=clone(card);for(const ref of c.refs){const tab=b[ref.subjectId].points.find(p=>p.id===ref.pointId).tabs.find(t=>t.id===ref.tabId);ref.expectedTabSha256=hash(tab);for(const selection of ref.blocks)selection.expectedBlockSha256=hash(tab.blocks[selection.blockIndex]);}return c;}
function changedSource(card,change){const b=clone(body);const ref=card.refs[0],tab=b[ref.subjectId].points.find(p=>p.id===ref.pointId).tabs.find(t=>t.id===ref.tabId);change(tab);return {body:b,card:refresh(card,b)};}
function storage(){const mem={'notesPractice:v1:state':{preserve:'history'},unrelated:{preserve:true}};return {mem,getStorageSync(k){if(this.readFailure)throw Error('read');return clone(mem[k]||null);},setStorageSync(k,v){if(this.writeFailure)throw Error('quota');mem[k]=clone(v);}};}
function fixture(pointId='current-ratio'){
 const card=clone(inputs.cards.find(c=>c.pointId===pointId));assert(card&&!card.localHold);
 const local={...inputs,cards:[card],registry:{...clone(inputs.registry),registrations:[]},reviewLedger:{schemaVersion:1,reviews:[]},enablementLedger:{schemaVersion:1,enablements:[]}};
 local.registry=register(local,{cardId:card.id,registrationTaskId:'fixture-author-register',registeredAt:'2026-10-22T22:00:00+08:00'});
 const enrollment=enrollmentFor(local),registration=enrollment.registrations[0],binding=registration.binding;
 const receipt={schemaVersion:1,decisionId:'fixture-accept-'+card.id,cardId:card.id,registrationId:registration.registrationId,binding:clone(binding),authorTaskId:card.authorId,reviewer:{kind:'agent',id:'fixture-independent-reviewer',taskId:'fixture-independent-task',role:'isolated-test-only'},reviewedAt:'2026-10-22T22:01:00+08:00',decision:'accept',reason:'Artificial fixture; never a live content acceptance.',evidenceRefs:['fixture-only',policy.reviewBundlePath(binding)],issues:[],checks:policy.CHECKS.map(id=>({id,result:'pass',reason:'Fixture only',evidenceRefs:['fixture-only']})),supersedesDecisionId:null};
 const authorization={schemaVersion:1,authorizationId:'fixture-authorization-'+card.id,cardId:card.id,registrationId:registration.registrationId,decisionId:receipt.decisionId,decisionDigest:digest(receipt),bindingDigest:digest(binding),enabled:true,authorizedAt:'2026-10-22T22:02:00+08:00',authority:{kind:'user-instruction',actorId:'fixture-only-user',evidenceRef:'fixture-only; no actual authorization'},supersedesAuthorizationId:null};
 return {local,card,enrollment,registration,binding,receipt,authorization};
}
function accepted(f){f.enrollment.reviews=[clone(f.receipt)];f.enrollment.enablements=[clone(f.authorization)];return f.enrollment;}
const selected=(enrollment,development=false,b=body)=>availableCards(b,{schemaVersion:1,sampleOnly:false,cards:[],enrollment},development);
test('all eight immutable legacy versions and source projections remain identical',()=>{
 const old=JSON.parse(fs.readFileSync(path.join(root,'docs/knowledge-platform/content/notes/memory-v5-version-compatibility.json')));
 for(const row of old.cards){const c=resolveCard(row.card,require('./lib/notes-memory-sample-source').historicalBody(root,body));const current=resolveCard(samples.find(c=>c.id===row.card.id),body);assert.equal(current.semanticVersion,c.semanticVersion);assert.deepEqual(current.blocks,c.blocks);assert.equal(c.semanticVersion,row.legacySemanticVersion);assert.equal(c.learningSemanticDigest,row.learningSemanticDigest);assert.deepEqual(c.blocks,row.projectedBlocks);}
 assert.equal(fs.readFileSync(path.join(root,'miniprogram/subpackages/note/models/memory-version-compatibility.js'),'utf8'),compatibilityOutput(root));
});
test('unselected source-block change keeps learning identity after an explicit source-proof update',()=>{
 const c=samples[0],changed=changedSource(c,tab=>{tab.blocks[1].label='unselected heading change';});const old=resolveCard(c,body),next=resolveCard(changed.card,changed.body);
 assert.deepEqual(old.blocks,next.blocks);assert.notEqual(old.sourceSnapshotDigest,next.sourceSnapshotDigest);assert.equal(old.learningSemanticDigest,next.learningSemanticDigest);assert.equal(old.semanticVersion,next.semanticVersion);
});
test('stale source snapshots still fail closed before any compatibility lookup',()=>{
 const c=samples[0],changed=changedSource(c,tab=>{tab.blocks[1].label='unselected change';});assert.throws(()=>resolveCard(c,changed.body),/来源内容/);
 assert.equal(availableCards(changed.body,pack,true).length,availableCards(body,pack,true).length-1);
});
test('pure rendering metadata and editorial revision do not invalidate a learned card',()=>{
 const c=clone(samples[0]),changed=changedSource(c,tab=>{tab.blocks[0].style={backgroundColor:'#fff'};});changed.card.revision++;
 assert.equal(resolveCard(c,body).semanticVersion,resolveCard(changed.card,changed.body).semanticVersion);
});
test('structured formula content, prompt, target and parent context remain semantic',()=>{
 const c=samples.find(c=>c.id==='memory-v5-quantity-average');const old=resolveCard(c,body);
 const changed=changedSource(c,tab=>{tab.blocks[2].nodes[0].value+=' changed';});assert.notEqual(resolveCard(changed.card,changed.body).learningSemanticDigest,old.learningSemanticDigest);
 const prompt=clone(c);prompt.prompt+='changed';assert.notEqual(resolveCard(prompt,body).learningSemanticDigest,old.learningSemanticDigest);
 const target=clone(c);target.targetId='new-target';assert.notEqual(resolveCard(target,body).learningSemanticDigest,old.learningSemanticDigest);
 const graphic=samples.find(c=>c.subjectId==='graphic'),parent=changedSource(graphic,tab=>{tab.blocks[1].summary+=' changed context';});assert.notEqual(resolveCard(parent.card,parent.body).semanticVersion,resolveCard(graphic,body).semanticVersion);
});
test('unselected table cells and mind-map branches do not become learning dependencies',()=>{
 const c=samples.find(c=>c.id==='memory-v5-quantity-combination'),table=changedSource(c,tab=>{tab.blocks[2].rows[0][1]='unselected cell';});assert.deepEqual(resolveCard(c,body).blocks,resolveCard(table.card,table.body).blocks);assert.equal(resolveCard(c,body).semanticVersion,resolveCard(table.card,table.body).semanticVersion);
 const g=samples.find(c=>c.subjectId==='graphic'),map=changedSource(g,tab=>{tab.blocks[1].nodes[0].title='unselected branch';});assert.equal(resolveCard(g,body).semanticVersion,resolveCard(map.card,map.body).semanticVersion);
});
test('unknown knowledge fields and warning meaning are conservatively semantic',()=>{
 const c=samples[0],changed=changedSource(c,tab=>{tab.blocks[0].necessaryCondition='new condition';});assert.notEqual(resolveCard(c,body).semanticVersion,resolveCard(changed.card,changed.body).semanticVersion);
 const warning=changedSource(c,tab=>{tab.blocks[5].variant='new-warning-meaning';});assert.notEqual(resolveCard(c,body).semanticVersion,resolveCard(warning.card,warning.body).semanticVersion);
});
test('invalid or duplicate slice indices cannot broaden the selected source silently',()=>{
 const c=clone(samples.find(c=>c.id==='memory-v5-quantity-combination'));c.refs[0].blocks[0].rowIndices=[-1];assert.throws(()=>resolveCard(c,body),/切片范围/);c.refs[0].blocks[0].rowIndices=[1,1];assert.throws(()=>resolveCard(c,body),/切片范围/);
});
test('old weak ratings and a frozen exam round survive unrelated-source updates without storage writes',()=>{
 const stored=storage(),oldCards=availableCards(body,pack,true),e=createMemoryEngine(oldCards,stored,()=>100);const s=e.start('basic',{}, {mode:'browse'});e.assess(s.id,'fuzzy');const frozen=e.start('exam'),before=clone(stored.mem);
 const change=changedSource(samples[0],tab=>{tab.blocks[1].label='not selected';});const altered=clone(pack);altered.cards[0]=change.card;
 const next=createMemoryEngine(availableCards(change.body,altered,true),stored);assert.equal(next.weak().length,1);assert.equal(next.get(frozen.id).expired,false);assert.deepEqual(stored.mem,before);
});
test('a selected knowledge change expires only that card and preserves old history and other weak cards',()=>{
 const stored=storage(),e=createMemoryEngine(availableCards(body,pack,true),stored,()=>100),s=e.start('basic',{}, {mode:'browse'});e.assess(s.id,'missed');e.assess(s.id,'fuzzy');const frozen=e.start('exam'),events=clone(stored.mem[KEY].events);
 const change=changedSource(samples[0],tab=>{tab.blocks[0].content+=' changed knowledge';});const altered=clone(pack);altered.cards[0]=change.card;const next=createMemoryEngine(availableCards(change.body,altered,true),stored);
 assert.equal(next.weak().length,1);assert.equal(next.weak({},true).length,1);assert.equal(next.get(frozen.id).expired,true);assert.deepEqual(stored.mem[KEY].events,events);
});
test('memory read/save failures retain old records with the stable version contract',()=>{
 const stored=storage(),engine=createMemoryEngine(availableCards(body,pack,true),stored),s=engine.start('basic',{}, {mode:'browse'}),before=clone(stored.mem);
 stored.writeFailure=true;assert.throws(()=>engine.assess(s.id,'missed'),/未保存/);assert.deepEqual(stored.mem,before);stored.readFailure=true;assert.throws(()=>engine.weak(),/无法读取/);assert.deepEqual(stored.mem,before);
});
test('unregistered drafts and plain status flags cannot enter preview or formal consumers',()=>{
 const f=fixture();f.enrollment.registrations=[];assert.equal(selected(f.enrollment,true).length,0);accepted(f);f.card.status='approved';f.card.formalApproved=true;f.enrollment.cards=[f.card];assert.equal(selected(f.enrollment,true).length,0);assert.equal(selected(f.enrollment).length,0);
});
test('registered pending candidates are development-only and do not masquerade as old samples',()=>{const f=fixture();const cards=selected(f.enrollment,true);assert.equal(cards.length,1);assert.equal(cards[0].sampleOnly,false);assert.equal(cards[0].status,'preview-pending');assert.equal(selected(f.enrollment).length,0);});
test('both current local holds are rejected by the actual registration function',()=>{for(const card of inputs.cards.filter(c=>c.localHold))assert.throws(()=>register(inputs,{cardId:card.id,registrationTaskId:'fixture',registeredAt:'2026-10-22T22:00:00+08:00'}),/hold/);});
test('registration cannot cover an unknown, duplicate, stale or differently bound source',()=>{
 assert.throws(()=>register(inputs,{cardId:'unknown',registrationTaskId:'fixture',registeredAt:'2026-10-22T22:00:00+08:00'}),/台账/);
 const f=fixture();assert.throws(()=>register(f.local,{cardId:f.card.id,registrationTaskId:'fixture',registeredAt:'2026-10-22T22:00:00+08:00'}),/已经注册/);
 f.enrollment.cards[0].refs[0].expectedTabSha256='bad';assert.equal(selected(f.enrollment,true).length,0);
});
test('the frozen candidate review bundle binds original blocks, projection, goal and exact revision',()=>{
 const f=fixture(),packet=reviewPacket(f.local,f.enrollment),entry=packet.cards[0];assert.equal(packet.cards.length,1);assert.equal(entry.binding.reviewBundleDigest,digest(entry.bundle));assert.deepEqual(entry.bundle.card,f.card);assert(entry.bundle.originals[0].originalBlocks.length);assert.equal(entry.acceptance,'not-created');
});
test('independent accept without separate enablement remains absent from formal content',()=>{const f=fixture();f.enrollment.reviews=[f.receipt];assert.equal(selected(f.enrollment,true).length,1);assert.equal(selected(f.enrollment).length,0);});
test('exact independent accept plus separate enablement is consumed by the real runtime selector',()=>{const f=fixture();accepted(f);const cards=selected(f.enrollment);assert.equal(cards.length,1);assert.equal(cards[0].id,f.card.id);assert.equal(cards[0].formalApproved,true);assert.equal(cards[0].memoryAdmission.decisionId,f.receipt.decisionId);});
test('same-author reviewer identity or task identity, missing evidence and incomplete checks are rejected',()=>{
 for(const change of [r=>r.reviewer.id=r.authorTaskId,r=>r.reviewer.taskId=r.authorTaskId,r=>r.evidenceRefs=[],r=>r.checks.pop(),r=>r.issues.push('unresolved')]){const f=fixture();accepted(f);change(f.enrollment.reviews[0]);assert.equal(selected(f.enrollment).length,0);assert.equal(selected(f.enrollment,true).length,0);}
});
test('wrong rule, prompt, revision, target or source binding cannot borrow an old acceptance',()=>{
 for(const change of [f=>f.enrollment.ruleDigest='wrong',f=>f.enrollment.cards[0].prompt+='changed',f=>f.enrollment.cards[0].revision++,f=>f.enrollment.cards[0].targetId+='new',f=>f.enrollment.reviews[0].binding.sourceSnapshotDigest='wrong']){const f=fixture();accepted(f);change(f);assert.equal(selected(f.enrollment).length,0);}
});
test('unrelated source edits preserve learning but still require explicit snapshot/review revalidation for formal admission',()=>{
 const f=fixture();accepted(f);const change=changedSource(f.card,tab=>{tab.blocks[3].title='unselected source';});assert.equal(resolveCard(change.card,change.body).learningSemanticDigest,resolveCard(f.card,body).learningSemanticDigest);f.enrollment.cards[0]=change.card;assert.equal(selected(f.enrollment,false,change.body).length,0);
});
test('reject, hold and revise supersede old accept and disable both consumers',()=>{
 for(const decision of ['reject','hold','revise']){const f=fixture();accepted(f);f.enrollment.reviews.push({...clone(f.receipt),decisionId:'fixture-new-'+decision,decision,supersedesDecisionId:f.receipt.decisionId});assert.equal(selected(f.enrollment).length,0);assert.equal(selected(f.enrollment,true).length,0);}
});
test('conflicting review heads stay blocked until an explicit independent resolution and new enablement',()=>{
 const f=fixture();accepted(f);const branch={...clone(f.receipt),decisionId:'fixture-branch'};f.enrollment.reviews.push(branch);assert.equal(selected(f.enrollment).length,0);
 const resolution={...clone(f.receipt),decisionId:'fixture-resolved',supersedesDecisionId:f.receipt.decisionId,resolvesDecisionIds:[branch.decisionId]};f.enrollment.reviews.push(resolution);assert.equal(selected(f.enrollment).length,0);
 f.enrollment.enablements.push({...clone(f.authorization),authorizationId:'fixture-new-authorization',decisionId:resolution.decisionId,decisionDigest:digest(resolution),supersedesAuthorizationId:f.authorization.authorizationId});assert.equal(selected(f.enrollment).length,1);
});
test('revocation and changed decision evidence cannot retain an old formal enablement',()=>{
 const f=fixture();accepted(f);f.enrollment.enablements.push({...clone(f.authorization),authorizationId:'fixture-revoked',enabled:false,supersedesAuthorizationId:f.authorization.authorizationId});assert.equal(selected(f.enrollment).length,0);assert.equal(selected(f.enrollment,true).length,1);
 const g=fixture();accepted(g);g.enrollment.reviews[0].reason+=' altered evidence';assert.equal(selected(g.enrollment).length,0);
});
test('retroactive local hold affects only its own candidate and never removes the other valid candidate',()=>{
 const a=fixture(),b=fixture('interval-growth-reverse');accepted(a);accepted(b);const combined={...a.enrollment,cards:[...a.enrollment.cards,...b.enrollment.cards],registrations:[...a.enrollment.registrations,...b.enrollment.registrations],reviews:[...a.enrollment.reviews,...b.enrollment.reviews],enablements:[...a.enrollment.enablements,...b.enrollment.enablements]};
 combined.cards[0].localHold={reason:'fixture reopened',recovery:'independent re-review'};assert.deepEqual(selected(combined).map(c=>c.id),[b.card.id]);
});
test('registration conflicts and cycles fail closed without throwing away unrelated user state',()=>{
 const f=fixture();accepted(f);f.enrollment.registrations.push({...clone(f.registration),registrationId:'fixture-conflict'});assert.equal(selected(f.enrollment,true).length,0);
 const g=fixture();g.enrollment.registrations[0].supersedesRegistrationId=g.registration.registrationId;assert.equal(selected(g.enrollment,true).length,0);
});
test('actual release page consumes formally enabled fixture IDs, source links and weak-card state',()=>{
 const f=fixture();accepted(f);const fixturePack={...pack,enrollment:f.enrollment},file=path.join(root,'miniprogram/subpackages/note/memory/index.js'),nativeRequire=createRequire(file),store=storage(),calls=[];let definition;
 const wx={getAccountInfoSync:()=>({miniProgram:{envVersion:'release'}}),getStorageSync:store.getStorageSync.bind(store),setStorageSync:store.setStorageSync.bind(store),setNavigationBarTitle(){},navigateTo(v){calls.push(v);},switchTab(){}};
 const required=name=>name==='../models/memory-pack'?fixturePack:nativeRequire(name);
 vm.compileFunction(fs.readFileSync(file,'utf8'),['require','Page','wx'],{filename:file})(required,d=>definition=d,wx);
 const page={...definition,data:clone(definition.data),setData(value){Object.assign(this.data,value);}};page.resolveImages=()=>{};page.onLoad({kind:'basic',subjectId:f.card.subjectId,categoryId:f.card.categoryId,cardId:f.card.id});
 assert.equal(page.data.total,1);assert.equal(page.data.card.id,f.card.id);page.handleSource({currentTarget:{dataset:{index:0}}});assert(calls.at(-1).url.includes('pointId=current-ratio'));assert(!calls.at(-1).url.includes('memoryReturn='));
 page.handleReveal();page.handleAssess({currentTarget:{dataset:{result:'missed'}}});assert.equal(page.engine.weak().length,1);assert.deepEqual(store.mem['notesPractice:v1:state'],{preserve:'history'});
});
test('unknown candidates cannot bypass registration by setting the legacy sample flag',()=>{
 const f=fixture();const forged={...f.card,sampleOnly:true,status:'preview-pending'};
 assert.equal(availableCards(body,{schemaVersion:1,sampleOnly:true,cards:[forged]},true).length,0);
 assert.equal(selected({...f.enrollment,cards:[null]}).length,0);
});
test('content-addressed review bundles are immutable and cannot be overwritten or silently omitted',()=>{
 const os=require('os'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'notes-memory-bundle-'));
 try{const f=fixture(),packet=reviewPacket(f.local,f.enrollment);assert.throws(()=>persistReviewPacket(temporary,packet,true),/冻结/);persistReviewPacket(temporary,packet,false);persistReviewPacket(temporary,packet,true);const file=path.join(temporary,packet.cards[0].bundlePath);fs.writeFileSync(file,'tampered');assert.throws(()=>persistReviewPacket(temporary,packet,false),/不可覆盖/);}finally{fs.rmSync(temporary,{recursive:true,force:true});}
});
test('a revised or rejected candidate can still freeze its new review bundle while runtime stays blocked',()=>{
 const f=fixture();f.local.reviewLedger.reviews=[{...clone(f.receipt),decision:'revise'}];f.local.cards[0].revision++;
 f.local.registry=register(f.local,{cardId:f.card.id,registrationTaskId:'fixture-new-authoring',registeredAt:'2026-10-22T22:10:00+08:00'});
 const enrollment=enrollmentFor(f.local);assert.equal(selected(enrollment,true).length,0);const packet=reviewPacket(f.local,enrollment);assert.equal(packet.cards.length,1);assert.equal(packet.cards[0].binding.revision,f.card.revision);
});
test('decision and enablement importers append exact external records and reject overwrites or implicit branch resolution',()=>{
 const f=fixture();const decisions=appendDecision(f.local,f.receipt);assert.equal(decisions.reviews.length,1);const reviewed={...f.local,reviewLedger:decisions};assert.throws(()=>appendDecision(reviewed,f.receipt),/不能覆盖/);
 const authorizations=appendEnablement(reviewed,f.authorization);assert.equal(authorizations.enablements.length,1);assert.throws(()=>appendEnablement({...reviewed,enablementLedger:authorizations},f.authorization),/不能覆盖/);
 assert.throws(()=>appendDecision(reviewed,{...clone(f.receipt),decisionId:'unlinked-root'}),/显式接替/);
 const noAuthority=clone(f.authorization);noAuthority.authority.evidenceRef='';assert.throws(()=>appendEnablement(reviewed,noAuthority),/授权/);
});
test('actual CLI pipeline freezes, imports independent decisions, compiles formal content and applies revocation in an isolated repository',()=>{
 const os=require('os'),{spawnSync}=require('child_process'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'notes-memory-cli-'));
 try{
  for(const folder of ['miniprogram','scripts','docs'])fs.cpSync(path.join(root,folder),path.join(temporary,folder),{recursive:true});
  const registryPath=path.join(temporary,'docs/knowledge-platform/content/notes/memory-v5-registry.json'),reviewsPath=path.join(temporary,'docs/knowledge-platform/content/notes/memory-v5-reviews.json'),enablementPath=path.join(temporary,'docs/knowledge-platform/content/notes/memory-v5-enablement.json'),isolatedRegistry=JSON.parse(fs.readFileSync(registryPath));isolatedRegistry.registrations=[];fs.writeFileSync(registryPath,JSON.stringify(isolatedRegistry,null,2)+'\n');fs.writeFileSync(reviewsPath,JSON.stringify({schemaVersion:1,reviews:[]},null,2)+'\n');fs.writeFileSync(enablementPath,JSON.stringify({schemaVersion:1,enablements:[]},null,2)+'\n');
  const run=(script,...args)=>{const result=spawnSync(process.execPath,[path.join(temporary,'scripts',script),...args],{cwd:temporary,encoding:'utf8'});assert.equal(result.status,0,result.stderr);return result;};
  const f=fixture();run('register-notes-memory-candidate.js','--card-id',f.card.id,'--registration-task','fixture-author-register','--registered-at','2026-10-22T22:00:00+08:00');fs.rmSync(path.join(temporary,policy.reviewBundlePath(f.binding)),{force:true});
  const earlyFile=path.join(temporary,'fixture-early-receipt.json');fs.writeFileSync(earlyFile,JSON.stringify(f.receipt));
  const early=spawnSync(process.execPath,[path.join(temporary,'scripts/record-notes-memory-decision.js'),'--decision-file',earlyFile],{cwd:temporary,encoding:'utf8'});assert.notEqual(early.status,0);assert.equal(JSON.parse(fs.readFileSync(path.join(temporary,'docs/knowledge-platform/content/notes/memory-v5-reviews.json'))).reviews.length,0);
  const beforeFreeze=spawnSync(process.execPath,[path.join(temporary,'scripts/build-notes-memory.js')],{cwd:temporary,encoding:'utf8'});assert.notEqual(beforeFreeze.status,0);
  run('build-notes-memory-candidate-review.js');run('build-notes-memory.js');
  const packFile=path.join(temporary,'miniprogram/subpackages/note/models/memory-pack.js'),native=require(path.join(temporary,'miniprogram/subpackages/note/services/memory-content')),catalog=require(path.join(temporary,'miniprogram/subpackages/note/models/note-catalog'));
  const content=()=>{delete require.cache[require.resolve(packFile)];return require(packFile);};
  assert.equal(native.availableCards(catalog,content(),true).length,9);assert.equal(native.availableCards(catalog,content(),false).length,0);
  const receiptFile=path.join(temporary,'fixture-receipt.json'),authorizationFile=path.join(temporary,'fixture-authorization.json');fs.writeFileSync(receiptFile,JSON.stringify(f.receipt));fs.writeFileSync(authorizationFile,JSON.stringify(f.authorization));
  run('record-notes-memory-decision.js','--decision-file',receiptFile);run('record-notes-memory-decision.js','--enablement-file',authorizationFile);run('build-notes-memory.js');run('build-notes-memory.js','--check-only');
  assert.deepEqual(native.availableCards(catalog,content(),false).map(c=>c.id),[f.card.id]);
  const revoked={...clone(f.authorization),authorizationId:'fixture-revoked',enabled:false,supersedesAuthorizationId:f.authorization.authorizationId};fs.writeFileSync(authorizationFile,JSON.stringify(revoked));run('record-notes-memory-decision.js','--enablement-file',authorizationFile);run('build-notes-memory.js');assert.equal(native.availableCards(catalog,content(),false).length,0);
 }finally{fs.rmSync(temporary,{recursive:true,force:true});}
});
test('current live ledgers remain byte stable, formal content remains zero and no fixture writes escaped',()=>{
 assert.equal(inputs.enablementLedger.enablements.length,0);assert.equal(availableCards(body,pack,false).length,0);assert(availableCards(body,pack,true).length>=samples.length);
 livePaths.forEach((p,i)=>assert.equal(fs.readFileSync(p,'utf8'),beforeLive[i]));
});
console.log(JSON.stringify({passed:true,checks:reports.length,scope:'ME-G0 semantic stability, compatibility and actual compiler/runtime/page consumers with isolated artificial review/enablement fixtures; no live content accepted',reports},null,2));
