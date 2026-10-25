const fs=require('fs'),path=require('path');
const {loadInputs,reviewPacket,persistReviewPacket}=require('./lib/notes-memory-admission');
const root=path.resolve(__dirname,'..'),checkOnly=process.argv.includes('--check-only');
if(process.argv.slice(2).some(a=>a!=='--check-only'))throw Error('未知对照包参数');
const packet=reviewPacket(loadInputs(root)),output=JSON.stringify(packet,null,2)+'\n';
persistReviewPacket(root,packet,checkOnly);
const destination=path.join(root,'docs/knowledge-platform/implementations/evidence/notes-memory-v5-candidate-review.json');
if(checkOnly){if(fs.readFileSync(destination,'utf8')!==output)throw Error('候选对照包已过期');}else fs.writeFileSync(destination,output);
console.log(JSON.stringify({passed:true,registeredCandidates:packet.cards.length,excluded:packet.excluded,formalApprovalCreated:false,checkOnly}));
