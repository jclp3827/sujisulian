const fs=require('fs'),path=require('path');
const {FILES,loadInputs,register}=require('./lib/notes-memory-admission');
const root=path.resolve(__dirname,'..'),options={};
const names={'--card-id':'cardId','--registration-task':'registrationTaskId','--registered-at':'registeredAt'};
for(let i=2;i<process.argv.length;i++){
 const flag=process.argv[i];
 if(flag==='--check-only'){options.checkOnly=true;continue;}
 if(!names[flag]||!process.argv[i+1]||process.argv[i+1].startsWith('--')||options[names[flag]])throw Error('注册参数缺失、重复或未知');
 options[names[flag]]=process.argv[++i];
}
if(!options.cardId||!options.registrationTaskId||!options.registeredAt)throw Error('需要精确卡片ID、登记任务和ISO时间');
const destination=path.join(root,FILES.registry),before=fs.readFileSync(destination,'utf8'),inputs=loadInputs(root),registry=register(inputs,options);
if(!options.checkOnly){
 if(fs.readFileSync(destination,'utf8')!==before)throw Error('注册账有并发变更，未写入');
 const temporary=destination+'.register-write';
 fs.writeFileSync(temporary,JSON.stringify(registry,null,2)+'\n',{flag:'wx'});
 if(fs.readFileSync(destination,'utf8')!==before){fs.unlinkSync(temporary);throw Error('注册账有并发变更，未写入');}
 fs.renameSync(temporary,destination);
}
console.log(JSON.stringify({passed:true,cardId:options.cardId,registrationId:registry.registrations.at(-1).registrationId,checkOnly:!!options.checkOnly,formalApprovalCreated:false}));
