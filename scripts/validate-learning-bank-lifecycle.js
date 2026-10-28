const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const commands=[
 ['build-notes-learning.js','--check-only'],['build-notes-memory.js','--check-only'],['build-common-sense-learning.js','--check'],
 ['build-common-sense-guide-expansion-preview.js','--check'],['build-common-sense-preview-payloads.js','--check'],['build-learning-bank-function.js','--check'],
 ['validate-learning-bank-function.js'],['validate-learning-bank-release.js'],['validate-learning-bank-clients.js'],
 ['validate-learning-bank-buffer.js'],['validate-learning-bank-common-buffer.js'],['validate-learning-bank-guide-buffer.js'],['validate-learning-bank-practice-buffer.js'],
 ['validate-public-learning-access.js'],['validate-public-learning-page-runtime.js'],['validate-release-learning-copy.js'],
 ['validate-learning-bank-lifecycle-s2.js'],['validate-learning-bank-lifecycle-s3.js'],['validate-learning-bank-isolation.js']];
const results=[];
for(const[file,...args]of commands){
 const target='scripts/'+file,r=cp.spawnSync(process.execPath,[target,...args],{cwd:root,encoding:'utf8',maxBuffer:10*1024*1024});
 results.push({command:'node '+[target,...args].join(' '),scriptSha256:sha(fs.readFileSync(path.join(root,target))),exitCode:r.status,stdout:r.stdout,stderr:r.stderr});
 console.log((r.status===0?'PASS ':'FAIL ')+target);
 if(r.status!==0){console.error(r.stderr||r.stdout);process.exitCode=1;break;}
}
const changed=cp.execFileSync('git',['diff','ae40869ddb02aceab23accbdccb9cce1e3d0b71e','--name-only','--','*.js'],{cwd:root,encoding:'utf8'}).split('\n').filter(Boolean);
for(const file of changed)cp.execFileSync(process.execPath,['--check',file],{cwd:root});
const report={schema:1,date:'2026-10-28',passed:results.length===commands.length&&results.every(x=>x.exitCode===0),checks:results.length,results,syntaxCheckedTrackedJs:changed.length,
 generatedManifestSha256:sha(fs.readFileSync(path.join(root,'cloudfunctions/learningBank/data/manifest.json'))),
 contentIndependentReview:'S1 five scoped corrections passed independent AI review; exact stage evidence separate',humanSampling:false,legalHumanReview:false,realDevice:false,release:false,newPublicGrants:0};
if(process.argv.includes('--record'))fs.writeFileSync(path.join(root,'docs/knowledge-platform/lifecycle-s1-s3-20261028/automatic-acceptance.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:report.passed,checks:report.checks,syntaxChecked:changed.length,newPublicGrants:0,humanSampling:false,realDevice:false,release:false}));
