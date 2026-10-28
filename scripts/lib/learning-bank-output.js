const fs=require('fs'),path=require('path');
function publish(root, outputs, options={}) {
  if (options.candidate) {
    if (!options.destination) throw Error('Candidate output requires an isolated destination (never public data)');
    if(fs.existsSync(options.destination))throw Error('Candidate destination must be fresh and isolated');
    fs.mkdirSync(options.destination,{recursive:true});
    for(const [rel,value]of outputs){const f=path.join(options.destination,rel);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,value);}
    return;
  }
  const data='cloudfunctions/learningBank/data';
  if(options.check){
    for(const[rel,value]of outputs)if(!fs.existsSync(path.join(root,rel))||fs.readFileSync(path.join(root,rel),'utf8')!==value)throw Error('Generated output differs: '+rel);
    const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.relative(root,path.join(dir,d.name))]);
    if(walk(path.join(root,data)).some(rel=>!outputs.has(rel)))throw Error('Unexpected stale generated file');
    return;
  }
  const lock=path.join(root,'.learning-bank-build.lock');
  fs.mkdirSync(lock);
  let stage;const moved=[], installed=[];
  try{
    stage=fs.mkdtempSync(path.join(root,'.learning-bank-stage-'));
    for(const[rel,value]of outputs){const f=path.join(stage,'new',rel);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,value);if(fs.readFileSync(f,'utf8')!==value)throw Error('Stage verification failed');}
    if(options.failAt==='generated')throw Error('Injected generation failure');
    const targets=[data,...[...outputs.keys()].filter(x=>!x.startsWith(data+'/'))];
    for(const rel of targets){
      const dest=path.join(root,rel),backup=path.join(stage,'old',rel),source=path.join(stage,'new',rel);
      if(fs.existsSync(dest)){fs.mkdirSync(path.dirname(backup),{recursive:true});fs.renameSync(dest,backup);moved.push([dest,backup]);}
      if(options.failAt==='replace' && moved.length===2)throw Error('Injected replacement failure');
      fs.mkdirSync(path.dirname(dest),{recursive:true});
      fs.renameSync(source,dest);installed.push(dest);
    }
  }catch(error){
    for(const dest of installed.reverse())fs.rmSync(dest,{recursive:true,force:true});
    for(const[dest,backup]of moved.reverse())fs.renameSync(backup,dest);
    throw error;
  }finally{if(stage)fs.rmSync(stage,{recursive:true,force:true});fs.rmdirSync(lock);}
}
module.exports={publish};
