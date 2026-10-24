// Historical finite-sample assertions run on an explicitly isolated G0 input fixture.
// The current registered preview pack is validated separately, never reset here.
const fs=require('fs'),os=require('os'),path=require('path'),{spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'notes-memory-baseline-'));
const protectedPaths=['docs/knowledge-platform/content/notes/memory-v5-registry.json','docs/knowledge-platform/content/notes/memory-v5-reviews.json','docs/knowledge-platform/content/notes/memory-v5-enablement.json','miniprogram/subpackages/note/models/memory-pack.js','docs/knowledge-platform/content/notes/memory-v5-da01-targets-v2.json'];
const before=protectedPaths.map(p=>fs.readFileSync(path.join(root,p),'utf8'));
const reports=[];
try{
 for(const folder of ['miniprogram','scripts','docs'])fs.cpSync(path.join(root,folder),path.join(temporary,folder),{recursive:true});
 for(const [rel,key] of [[protectedPaths[0],'registrations'],[protectedPaths[1],'reviews'],[protectedPaths[2],'enablements']]){
  const file=path.join(temporary,rel),data=JSON.parse(fs.readFileSync(file));data[key]=[];fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
 }
 // G0's artificial rejection/supersession case starts at revision1. Restore only that
 // historical author definition in the isolated fixture, never in current inputs.
 const reviewManifest=path.join(temporary,'docs/knowledge-platform/content/notes/memory-v5-da-review-20261023.json');
 if(fs.existsSync(reviewManifest)){
  const correction=JSON.parse(fs.readFileSync(reviewManifest)),row=correction.cardChanges.find(c=>c.cardId==='memory-v5-da01-current-ratio');
  if(!row||row.before.revision!==1)throw Error('Missing historical revision1 G0 fixture');
  const ledgerFile=path.join(temporary,row.ledgerPath),ledger=JSON.parse(fs.readFileSync(ledgerFile)),index=ledger.cards.findIndex(c=>c.id===row.cardId);
  if(index<0)throw Error('Missing G0 fixture target');
  ledger.cards[index]=row.before;fs.writeFileSync(ledgerFile,JSON.stringify(ledger,null,2)+'\n');
 }
 fs.rmSync(path.join(temporary,'docs/knowledge-platform/implementations/evidence/notes-memory-v5-candidate-bundles'),{recursive:true,force:true});
 const run=script=>{const result=spawnSync(process.execPath,[path.join(temporary,'scripts',script)],{cwd:temporary,encoding:'utf8'});if(result.status!==0)throw Error(script+'\n'+result.stderr+'\n'+result.stdout);return {cmd:'node scripts/'+script,exit_code:result.status,output:result.stdout};};
 run('build-notes-memory-candidate-review.js');run('build-notes-memory.js');
 for(const script of ['validate-notes-memory-g0.js','validate-notes-memory-v5.js','validate-notes-memory-v5-continuity.js'])reports.push(run(script));
 protectedPaths.forEach((p,i)=>{if(fs.readFileSync(path.join(root,p),'utf8')!==before[i])throw Error('Current input was modified');});
 console.log(JSON.stringify({passed:true,scope:'Isolated G0 eight-sample/empty-enrollment fixture only. Not validation of current preview count or device display.',currentSourceFilesUnchanged:true,checks:reports.reduce((n,r)=>n+JSON.parse(r.output).checks,0),reports},null,2));
}finally{fs.rmSync(temporary,{recursive:true,force:true});}
