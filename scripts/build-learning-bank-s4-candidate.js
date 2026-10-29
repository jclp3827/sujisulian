// Reuse the existing authoring compiler, admission gate and shard builder for one isolated S4 batch.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const batch=require('../docs/knowledge-platform/content/common-sense-learning-s4-heat-01');
const source=require('../docs/knowledge-platform/content/common-sense-learning-v1');
const body=require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const {compile:compilePack}=require('./build-common-sense-learning');
const {compile:compileBank}=require('./build-learning-bank-function');
const {publish}=require('./lib/learning-bank-output');
const clone=x=>JSON.parse(JSON.stringify(x)),sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function collect({baseline=false,mutate,withdrawals,policy}={}){
 const pack=compilePack(baseline?clone(source):batch.apply(source),body);
 if(mutate)mutate(pack);
 const result=compileBank({collect:true,commonPack:pack,withdrawals,policy});
 if(!result.manifest.admission.candidate)throw Error('S4 data must remain candidate-only');
 result.outputs.set('miniprogram/subpackages/common-sense/models/learning-pack.js',
  '// Isolated S4 candidate generated with the existing compiler. Not public approval.\nmodule.exports='+JSON.stringify(pack)+';\n');
 return{...result,pack,withdrawals:withdrawals||require('../cloudfunctions/learningBank/effective-withdrawals.json')};
}
function writeCandidate(destination,result){
 publish(root,result.outputs,{candidate:true,destination});
 const func=path.join(destination,'cloudfunctions/learningBank');
 fs.copyFileSync(path.join(root,'cloudfunctions/learningBank/index.js'),path.join(func,'index.js'));
 fs.writeFileSync(path.join(func,'effective-withdrawals.json'),JSON.stringify(result.withdrawals||require('../cloudfunctions/learningBank/effective-withdrawals.json'))+'\n');
 fs.writeFileSync(path.join(destination,'CANDIDATE-ONLY.json'),JSON.stringify({batch:batch.batchId,candidate:true,publicGrant:false,humanReview:false,deploy:false},null,2)+'\n');
 return{destination,outputs:result.outputs.size,sha256:sha([...result.outputs].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([file,text])=>file+'\0'+sha(text)+'\n').join(''))};
}
if(require.main===module){
 const args=process.argv.slice(2),arg=args.find(x=>x.startsWith('--output='));
 if(args.some(x=>!x.startsWith('--output=')))throw Error('Only --output=<fresh isolated directory> is accepted');
 const destination=arg?path.resolve(arg.slice(9)):path.join(root,'.learning-bank-s4-artifacts/S4-HEAT-01-v1');
 const result=collect();console.log(JSON.stringify({...writeCandidate(destination,result),newIds:batch.rows.map(x=>x.id),questionCount:result.manifest.banks['common-question'].count,publicGrant:false}));
}
module.exports={collect,writeCandidate,batch};
