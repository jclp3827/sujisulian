// Import externally produced records; never invent acceptance or user authorization.
const fs=require('fs'),path=require('path');
const {FILES,loadInputs,appendDecision,appendEnablement}=require('./lib/notes-memory-admission');
const {reviewBundlePath}=require('../miniprogram/subpackages/note/services/memory-admission');
const {digest}=require('../miniprogram/subpackages/note/services/learning-semantic');
const root=path.resolve(__dirname,'..');let kind,file,checkOnly=false;
for(let i=2;i<process.argv.length;i++){
 const flag=process.argv[i];
 if(flag==='--check-only'){checkOnly=true;continue;}
 if(!['--decision-file','--enablement-file'].includes(flag)||kind||!process.argv[i+1]||process.argv[i+1].startsWith('--'))throw Error('只可导入一份明确的审核或启用记录');
 kind=flag;file=path.resolve(process.argv[++i]);
}
if(!kind)throw Error('缺少独立审核或启用授权记录文件');
const destination=path.join(root,kind==='--decision-file'?FILES.reviews:FILES.enablement),before=fs.readFileSync(destination,'utf8');
const record=JSON.parse(fs.readFileSync(file,'utf8')),inputs=loadInputs(root);
if(kind==='--decision-file'){
 if(!/^[a-f0-9]{64}$/.test(record.binding?.reviewBundleDigest||''))throw Error('回执缺少精确对照包身份');
 const bundleFile=path.join(root,reviewBundlePath(record.binding));
 if(!fs.existsSync(bundleFile))throw Error('独立回执需要先冻结对应对照包，未写入');
 const frozen=JSON.parse(fs.readFileSync(bundleFile,'utf8'));
 if(frozen.schemaVersion!==1||frozen.acceptance!=='not-created'||digest(frozen.binding)!==digest(record.binding)||digest(frozen.bundle)!==record.binding.reviewBundleDigest)throw Error('独立回执与冻结对照包不一致，未写入');
}
const ledger=kind==='--decision-file'?appendDecision(inputs,record):appendEnablement(inputs,record);
if(!checkOnly){
 if(fs.readFileSync(destination,'utf8')!==before)throw Error('目标账有并发变更，未写入');
 const temporary=destination+'.decision-write';
 fs.writeFileSync(temporary,JSON.stringify(ledger,null,2)+'\n',{flag:'wx'});
 if(fs.readFileSync(destination,'utf8')!==before){fs.unlinkSync(temporary);throw Error('目标账有并发变更，未写入');}
 fs.renameSync(temporary,destination);
}
console.log(JSON.stringify({passed:true,kind:kind==='--decision-file'?'independent-decision':'separate-enablement',cardId:record.cardId,checkOnly}));
