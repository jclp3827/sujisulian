// Local-only receipt for the shared processing candidate; no external transports.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {spawnSync,execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const scripts=['profile-compat','configurable','orientation','core','sichuan','picker','adjust-interaction','zip-export','export-guide','preview-export','virtual-payment','order-state','business'];
const results=scripts.map(name=>{
 const script=`scripts/validate-photo-${name}.js`;
 const run=spawnSync(process.execPath,[script],{cwd:root,encoding:'utf8'});
 return {script,passed:run.status===0,exitCode:run.status,output:run.stdout,errors:run.stderr};
});
for(const [script,args] of [['scripts/validate-photo-local-compile.py',[]],['scripts/check-documentation-consistency.py',[]],['scripts/documentation-context.py',['--topic','photo-pipeline']]]) {
 const run=spawnSync('python3',[script,...args],{cwd:root,encoding:'utf8'});
 let output=run.stdout;
 if(script.includes('check-documentation')) {
  try {const r=JSON.parse(output);output=JSON.stringify({valid:r.valid,registered:r.registered,formalSourceApproved:r.formalSourceApproved,errors:r.errors});} catch(_) {}
 }
 results.push({script,passed:run.status===0,exitCode:run.status,output,errors:run.stderr});
}
const design=spawnSync(process.execPath,['scripts/validate-design-system.js','--audit-base','dabc02abab9d6264f99cd518ec517f1e438203f6'],{cwd:root,encoding:'utf8'});
results.push({script:'scripts/validate-design-system.js',passed:design.status===0,exitCode:design.status,output:design.stdout,errors:design.stderr});
const tracked=execFileSync('git',['diff','--name-only'],{cwd:root,encoding:'utf8'}).trim().split('\n');
const untracked=execFileSync('git',['ls-files','--others','--exclude-standard'],{cwd:root,encoding:'utf8'}).trim().split('\n');
const hashes={};
for(const name of [...tracked,...untracked].filter(x=>x && !x.endsWith('province-pipeline-validation.json'))) hashes[name]=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex');
const report={passed:results.every(x=>x.passed),baseline:'dabc02abab9d6264f99cd518ec517f1e438203f6',directory:root,branch:execFileSync('git',['branch','--show-current'],{cwd:root,encoding:'utf8'}).trim(),deviceTested:false,officialAcceptanceTested:false,uploaded:false,realPayment:false,realBdaCalls:0,sourceHashes:hashes,results};
const out=process.argv.indexOf('--out');
if(out>=0)fs.writeFileSync(process.argv[out+1],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:report.passed,groups:results.length,failed:results.filter(x=>!x.passed).map(x=>({script:x.script,errors:x.errors,output:x.output})),deviceTested:false}));
process.exitCode=report.passed?0:1;
