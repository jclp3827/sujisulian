async function run(){
const fs=require('fs'),path=require('path'),cp=require('child_process'),os=require('os'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/knowledge-platform/release-acceptance-r5-20261029'),before='ae40869ddb02aceab23accbdccb9cce1e3d0b71e',s1='8c5c308595e9002918453d55ce55cbd947c4d4a2';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex'),json=x=>JSON.stringify(x),read=p=>JSON.parse(fs.readFileSync(path.join(root,p)));
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,maxBuffer:30*1024*1024});
const old=fs.mkdtempSync(path.join(os.tmpdir(),'r5-before-'));
cp.execFileSync('tar',['-x','-C',old],{input:git('archive',before,'cloudfunctions/learningBank/data')});
function load(dir,bank,manifest){const b=manifest.banks[bank],byfile=new Map(),map=new Map();for(const r of b.index){if(!byfile.has(r.file))byfile.set(r.file,JSON.parse(fs.readFileSync(path.join(dir,'cloudfunctions/learningBank/data',bank,r.file+'.json'))));map.set(r.id,byfile.get(r.file).find(x=>x.id===r.id));}return map;}
const current=read('cloudfunctions/learningBank/data/manifest.json'),previous=JSON.parse(fs.readFileSync(path.join(old,'cloudfunctions/learningBank/data/manifest.json'))),historical=read('docs/knowledge-platform/lifecycle-s1-s3-20261028/historical-public-ids.json'),corrections=read('docs/knowledge-platform/lifecycle-s1-s3-20261028/s1-corrections.json');
const prune=v=>Object.fromEntries(Object.entries(v).filter(([k])=>!['signature','learningSignature'].includes(k)));
const report={date:'2026-10-29',before,afterBase:'7d6a53133a8c70317ae140a1b8b0ecb14855d421',banks:{},changes:[],itemHashes:{},humanApproved:false,allContentAccepted:false};
for(const bank of Object.keys(historical)){
 const a=load(old,bank,previous),b=load(root,bank,current),ids=[...b.keys()].sort();assert.deepEqual(ids,historical[bank].slice().sort());assert.deepEqual(ids,[...a.keys()].sort());
 let raw=0,content=0;report.itemHashes[bank]={};
 for(const id of ids){const x=a.get(id),y=b.get(id),xhash=sha(json(x)),yhash=sha(json(y));report.itemHashes[bank][id]={before:xhash,after:yhash};if(xhash!==yhash)raw++;if(json(prune(x))===json(prune(y)))continue;content++;
  const changedFields=[...new Set([...Object.keys(x),...Object.keys(y)])].filter(k=>!['signature','learningSignature'].includes(k)&&json(x[k])!==json(y[k]));
  report.changes.push({bank,id,changedFields,beforeRevision:x.semanticRevision??x.revision??x.semanticVersion,afterRevision:y.semanticRevision??y.revision??y.semanticVersion,before:prune(x),after:prune(y),humanApproval:false,historicalPublicAccessIsNotReapproval:true});
 }
 report.banks[bank]={count:ids.length,exactHistoricalIds:true,idSetSha256:sha(ids.join('\n')+'\n'),rawItemChanges:raw,contentOrReviewChanges:content};
}
assert.deepEqual(report.changes.map(c=>c.bank+'/'+c.id).sort(),corrections.changes.map(c=>c.bank+'/'+c.id).sort());
report.s1ExactHashes=corrections.changes.map(c=>{const m=JSON.parse(git('show',s1+':cloudfunctions/learningBank/data/manifest.json'));const get=(ref,manifest)=>{const r=manifest.banks[c.bank].index.find(x=>x.id===c.id);return JSON.parse(git('show',ref+':cloudfunctions/learningBank/data/'+c.bank+'/'+r.file+'.json')).find(x=>x.id===c.id);};assert.equal(sha(json(get(before,previous))),c.beforeSha256);assert.equal(sha(json(get(s1,m))),c.afterSha256);return{...c,hashesVerified:true};});
const s4=['s4-heat-continuous-rod-vacuum','s4-heat-radiation-forced-air'];assert(s4.every(id=>!current.banks['common-question'].index.some(x=>x.id===id)));report.s4={candidateIds:s4,public:false,officialCount:603};
report.currentAdmission=current.admission;report.withdrawals=read('cloudfunctions/learningBank/effective-withdrawals.json');
const app=read('miniprogram/app.json'),pages=[...app.pages,...app.subPackages.flatMap(p=>p.pages.map(f=>p.root+'/'+f))];for(const p of pages)for(const ext of ['.js','.json','.wxml','.wxss'])assert(fs.existsSync(path.join(root,'miniprogram',p+ext)),p+ext);
const problems=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(f.endsWith('.json')){const j=JSON.parse(fs.readFileSync(f));for(const v of Object.values(j.usingComponents||{})){const target=path.resolve(path.dirname(f),v.startsWith('/')?path.join(root,'miniprogram',v):v);for(const ext of ['.js','.json','.wxml','.wxss'])if(!fs.existsSync(target+ext))problems.push({file:f,target:target+ext,reason:'missing'});const src=path.relative(path.join(root,'miniprogram'),f).split(path.sep),dst=path.relative(path.join(root,'miniprogram'),target).split(path.sep);if(dst[0]==='subpackages'&&(src[0]!=='subpackages'||src[1]!==dst[1]))problems.push({file:f,target,reason:'cross-subpackage component'});}}}}
walk(path.join(root,'miniprogram'));report.package={pages:pages.length,componentProblems:problems};assert.deepEqual(problems,[]);
const service=require(path.join(root,'cloudfunctions/learningBank')).main;report.endpointChecks=[];
for(const id of s4)for(const [bank,b]of Object.entries(current.banks))for(const mode of Object.keys(b.modes)){
 for(const event of [{action:'hydrate',ids:[id]},{action:'batch',session:{ids:[id]},offset:0},...(bank==='note-practice'?[{action:'resume',ids:[id]}]:[])]){
  const request={bank,mode,version:b.version,allowCandidate:true,...event},result=await service(request);assert.equal(result.ok,false);report.endpointChecks.push({id,bank,mode,action:event.action,code:result.code});
 }
}
fs.writeFileSync(path.join(out,'public-content-audit.json'),JSON.stringify(report,null,2)+'\n');fs.rmSync(old,{recursive:true});console.log(JSON.stringify({banks:report.banks,changes:report.changes.map(x=>({bank:x.bank,id:x.id,fields:x.changedFields,revision:[x.beforeRevision,x.afterRevision]})),s1HashesVerified:report.s1ExactHashes.length*2,package:report.package},null,2));

}
run().catch(e=>{console.error(e);process.exitCode=1});
