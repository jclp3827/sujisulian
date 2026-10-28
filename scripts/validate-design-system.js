#!/usr/bin/env node
'use strict';
// Read-only DS structure/reference checks. No business modules or online services are executed.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const {validateActivation}=require('./lib/design-system-activation');
const STATUSES = new Set(['draft', 'approved', 'deprecated']);
const LAYERS = ['Foundations', 'Themes', 'Semantics', 'Components', 'Patterns', 'Experience'];
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.name === '.git' || e.name === 'node_modules' ? [] : e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
}
function parseContracts(text) {
  return [...text.matchAll(/^### (DS-[A-Z]+-\d+)｜([^\n]+)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)].map(m => ({
    id:m[1], title:m[2], status:m[3].match(/^状态:\s*(\S+)/m)?.[1], scope:m[3].match(/^适用范围:\s*(.+)/m)?.[1],
    replaces:(m[3].match(/^替代:\s*(.+)/m)?.[1] || '').split(/[,，\s]+/).filter(x=>x && x!=='无'),
    layer: [...text.slice(0,m.index).matchAll(/^## (\w+)$/gm)].at(-1)?.[1], body:m[3],
  }));
}
function vars(value) {
  const out=[];
  for (const m of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
    let level=1, comma=false, closed=false;
    for (let i=m.index+4;i<value.length;i++) {
      if(value[i]==='(')level++;
      else if(value[i]===')'){level--;if(!level){closed=true;break;}}
      else if(value[i]===',' && level===1)comma=true;
    }
    out.push({name:m[1],fallback:comma,closed});
  }
  return out;
}
function cycles(values) {
  const done=new Set(),active=[];const result=[];
  function visit(k){if(active.includes(k)){result.push([...active.slice(active.indexOf(k)),k].join(' -> '));return;}if(done.has(k))return;
    active.push(k);for(const v of vars(values.get(k)||''))if(values.has(v.name))visit(v.name);active.pop();done.add(k);
  }
  for(const k of values.keys())visit(k);return [...new Set(result)];
}
function analyzeStyles(records) {
  const errors=[],warnings=[];const allDefs=new Set();const globalValues=new Map();const parsed=[];
  for(const f of records){const s=f.text.replace(/\/\*[\s\S]*?\*\//g,'');const rules=[...s.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
    const defs=[...s.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);?/g)].map(m=>[m[1],m[2]]);
    defs.forEach(([k])=>allDefs.add(k));if(f.path.endsWith('/theme.wxss'))defs.forEach(([k,v])=>globalValues.set(k,v));parsed.push({...f,s,rules,defs});}
  const recordMap=new Map(parsed.map(f=>[f.path,f]));
  function importedDefs(f,chain=[]){
    if(chain.includes(f.path)){errors.push(`STYLE_IMPORT_CYCLE ${[...chain,f.path].join(' -> ')}`);return [];}
    const merged=[];
    for(const m of f.s.matchAll(/@import\s+["']([^"']+)["']/g)){
      const key=path.posix.normalize(path.posix.join(path.posix.dirname(f.path),m[1]));const target=recordMap.get(key);
      if(!target){errors.push(`STYLE_IMPORT_MISSING ${f.path}: ${m[1]}`);continue;}
      merged.push(...importedDefs(target,[...chain,f.path]));
    }
    return [...merged,...f.defs];
  }
  for(const f of parsed){
    for(const v of vars(f.s)) {
      if(!v.closed)errors.push(`VAR_SYNTAX ${f.path}: ${v.name}`);
      else if(!allDefs.has(v.name)) (v.fallback?warnings:errors).push(`${v.fallback?'OPTIONAL_FALLBACK':'UNDEFINED_VAR'} ${f.path}: ${v.name}`);
    }
    const local=new Map([...globalValues,...importedDefs(f)]);
    for(const chain of cycles(local))errors.push(`TOKEN_CYCLE ${f.path}: ${chain}`);
    for(const rule of f.rules){const context=new Map(globalValues);for(const m of rule[2].matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);?/g))context.set(m[1],m[2]);
      for(const chain of cycles(context))errors.push(`TOKEN_CYCLE ${f.path} [${rule[1].trim().slice(-80)}]: ${chain}`);}
  }
  return {errors:[...new Set(errors)],warnings:[...new Set(warnings)],definitions:allDefs.size};
}
function git(root,args,allowFailure=false){const r=cp.spawnSync('git',['--no-optional-locks','-C',root,...args],{encoding:'utf8',maxBuffer:20*1024*1024});if(r.status!==0&&!allowFailure)throw Error(`GIT ${r.stderr?.trim()||r.error?.message||args[0]}`);return r.status===0?r.stdout:null;}
function literals(text) {
  const values=new Set([...text.matchAll(/#[\da-fA-F]{3,8}\b/g)].map(m=>m[0].toLowerCase()));
  for(const m of text.matchAll(/(?:color|background(?:-color|-image)?|fill|stroke|opacity|line-height|letter-spacing|font-size|font-weight|border-radius|box-shadow|padding(?:-[\w]+)?|margin(?:-[\w]+)?|gap|width|height)\s*[:=]\s*["']?([^;{}"'\n<>]+)/g)) {
    if(/\d+(?:rpx|px|ms|s)\b|rgba?\(|hsla?\(|#[\da-fA-F]+|^\d+(?:\.\d+)?$|\b[4-9]00\b/.test(m[1].trim())&&!m[1].includes('var('))values.add(m[0].trim());
  }return values;
}
function auditChanges(root,base){
  git(root,['rev-parse','--verify',`${base}^{commit}`]);const changed=git(root,['diff','--name-only','--diff-filter=ACMRT',base,'--','miniprogram']).trim().split('\n').filter(Boolean);
  changed.push(...git(root,['ls-files','--others','--exclude-standard','--','miniprogram']).trim().split('\n').filter(Boolean));
  const warnings=[];
  for(const file of [...new Set(changed)].sort()){
    if(!fs.existsSync(path.join(root,file)))continue;
    if(!/\.(?:wxss|wxml|js|json|svg)$/.test(file))continue;
    const current=fs.readFileSync(path.join(root,file),'utf8'),old=git(root,['show',`${base}:${file}`],true)||'';
    if(file.endsWith('.json')){try{if(JSON.parse(current).component&&!old)warnings.push(`NEW_COMPONENT explain reuse/extend/new choice: ${file}`);}catch{}}
    const before=literals(old),added=[...literals(current)].filter(v=>!before.has(v));
    if(added.length)warnings.push(`VISUAL_DELTA explain role/approval: ${file}: ${added.slice(0,12).join(' | ')}${added.length>12?' …':''}`);
  }return {base,changedProductFiles:[...new Set(changed)].sort(),warnings};
}
function recipeConsumers(root,classes,pages){
  const result=[];
  for(const page of pages){const queue=[path.join(root,'miniprogram',page+'.wxml')],seen=new Set();let found=false;
    while(queue.length&&!found){const file=queue.shift();if(seen.has(file)||!fs.existsSync(file))continue;seen.add(file);const text=fs.readFileSync(file,'utf8');
      for(const m of text.matchAll(/<(?:import|include)\s+src="([^"]+)"/g))queue.push(path.resolve(path.dirname(file),m[1]));
      for(const [i,line] of text.split('\n').entries())if([...line.matchAll(/class="([^"]+)"/g)].some(m=>classes.every(c=>m[1].split(/\s+/).includes(c)))){result.push({page,path:path.relative(root,file).replaceAll(path.sep,'/'),line:i+1});found=true;break;}
    }
  }return result;
}
function consumerLookup(root,entry,reg){
  let actual=[];let method;
  if(entry.kind==='component'){
    const src=entry.sources.find(s=>s.kind==='current'&&s.path.endsWith('.json')).path.replace(/\.json$/,'');
    const app=JSON.parse(fs.readFileSync(path.join(root,'miniprogram/app.json'),'utf8'));
    if(src==='miniprogram/custom-tab-bar/index'){actual=app.tabBar.list.map(c=>({page:c.pagePath,path:'miniprogram/app.json'}));method='app.tabBar';}
    else{method='registered page usingComponents';for(const page of reg.pages){const f=path.join(root,'miniprogram',page+'.json');if(!fs.existsSync(f))continue;const conf=JSON.parse(fs.readFileSync(f,'utf8'));for(const [tag,target] of Object.entries(conf.usingComponents||{})){const abs=target.startsWith('/')?path.join(root,'miniprogram',target.slice(1)):path.resolve(path.dirname(f),target);if(path.relative(root,abs).replaceAll(path.sep,'/')===src)actual.push({page,tag,path:path.relative(root,f).replaceAll(path.sep,'/')});}}}
  }else if(entry.usageRecipes){method='literal classes in registered page and imported templates';actual=entry.usageRecipes.map(x=>({recipe:x.id,consumers:recipeConsumers(root,x.classes,reg.pages)}));}
  else{method='verify recorded role evidence only; not exhaustive business discovery';for(const c of entry.rolePages||[]){const ev=c.evidence;if(ev&&fs.existsSync(path.join(root,ev.path))&&fs.readFileSync(path.join(root,ev.path),'utf8').includes(ev.literal))actual.push({page:c.page,path:ev.path,line:ev.line});}}
  return {version:reg.designSystemVersion,id:entry.id,status:entry.status,directConsumers:entry.consumers,relatedPages:entry.rolePages||[],candidateApplicablePages:entry.applicablePages||[],staticReferences:{method,items:actual},limits:'Registration/role evidence is not proof of runtime reachability or all interaction states'};
}
function validate(root,options={}) {
  root=path.resolve(root);const errors=[],warnings=[];
  const required=['AGENTS.md','docs/design-system/README.md','docs/design-system/contracts.md','docs/design-system/registry.json','docs/design-system/activation-policy.json'];
  function error(s){errors.push(s);}
  function resolve(ref,label){if(typeof ref!=='string'||!ref||path.isAbsolute(ref)||ref.split(/[\\/]/).includes('..')){error(`PATH_INVALID ${label}: ${ref}`);return null;}
    const f=path.resolve(root,ref);if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){error(`PATH_MISSING ${label}: ${ref}`);return null;}
    const realRoot=fs.realpathSync(root);if(!fs.realpathSync(f).startsWith(realRoot+path.sep)){error(`PATH_ESCAPE ${label}: ${ref}`);return null;}return f;}
  for(const p of required)resolve(p,'entrypoint');
  if(errors.length)return {ok:false,errors,warnings};
  let reg;try{reg=options.registry || JSON.parse(fs.readFileSync(path.join(root,required[3]),'utf8'));}catch(e){return {ok:false,errors:[`JSON_INVALID ${e.message}`],warnings};}
  const readme=fs.readFileSync(path.join(root,required[1]),'utf8'),contractText=options.contractText??fs.readFileSync(path.join(root,required[2]),'utf8');
  if(reg.schemaVersion!==2)error('SCHEMA_VERSION unsupported');
  if(typeof reg.designSystemVersion!=='string'||!readme.includes('`'+reg.designSystemVersion+'`'))error('VERSION_MISMATCH index/registry');
  const activation=validateActivation(root,reg);errors.push(...activation.errors);if(reg.stage!=='DS-2')error('STAGE_INVALID');
  const contracts=parseContracts(contractText),contractMap=new Map();
  for(const c of contracts){if(contractMap.has(c.id))error(`CONTRACT_DUPLICATE ${c.id}`);contractMap.set(c.id,c);if(!STATUSES.has(c.status))error(`CONTRACT_STATUS ${c.id}: ${c.status}`);if(!c.scope||!LAYERS.includes(c.layer))error(`CONTRACT_FIELDS ${c.id}`);}
  for(const l of LAYERS)if(!contracts.some(c=>c.layer===l))error(`LAYER_MISSING ${l}`);
  for(const c of contracts)for(const old of c.replaces){const previous=contractMap.get(old);if(!previous)error(`CONTRACT_REFERENCE ${c.id}: ${old}`);else if(c.status==='approved'&&previous.status!=='deprecated')error(`CONTRACT_REPLACEMENT ${c.id}: replaced rule must be deprecated`);}
  for(const c of contracts)if(c.status==='deprecated'&&!contracts.some(x=>x.replaces.includes(c.id)&&x.status==='approved'))error(`CONTRACT_ORPHAN_DEPRECATED ${c.id}`);
  const replaceGraph=new Map(contracts.map(c=>[c.id,c.replaces]));function replacementCycles(graph,prefix){const done=new Set(),active=[];function visit(k){if(active.includes(k)){error(`${prefix} ${[...active,k].join(' -> ')}`);return;}if(done.has(k))return;active.push(k);for(const n of graph.get(k)||[])if(graph.has(n))visit(n);active.pop();done.add(k);}for(const k of graph.keys())visit(k);}replacementCycles(replaceGraph,'CONTRACT_REPLACEMENT_CYCLE');
  let app;try{app=JSON.parse(fs.readFileSync(path.join(root,'miniprogram/app.json'),'utf8'));}catch(e){error(`APP_INVALID ${e.message}`);return {ok:false,errors,warnings};}
  const pages=[...app.pages,...(app.subPackages||[]).flatMap(p=>p.pages.map(x=>p.root+'/'+x))];
  if(!Array.isArray(reg.pages)||JSON.stringify([...new Set(reg.pages)].sort())!==JSON.stringify([...pages].sort())||reg.pages.length!==pages.length)error('PAGE_COVERAGE registry/app.json mismatch');
  const discovered=new Map();for(const f of walk(path.join(root,'miniprogram')).filter(f=>f.endsWith('.json'))){try{if(JSON.parse(fs.readFileSync(f,'utf8')).component)discovered.set(path.relative(root,f).replaceAll(path.sep,'/').replace(/\.json$/,''),[]);}catch{}}
  for(const p of pages){const file=path.join(root,'miniprogram',p+'.json');if(!fs.existsSync(file))continue;const conf=JSON.parse(fs.readFileSync(file,'utf8'));
    for(const [tag,target] of Object.entries(conf.usingComponents||{})){
      const abs=target.startsWith('/')?path.join(root,'miniprogram',target.slice(1)):path.resolve(path.dirname(file),target);const key=path.relative(root,abs).replaceAll(path.sep,'/');
      if(discovered.has(key))discovered.get(key).push({page:p,tag});else error(`COMPONENT_TARGET ${p}: ${tag} -> ${target}`);
    }}
  const entries=reg.entries;if(!Array.isArray(entries)||!entries.length)return {ok:false,errors:[...errors,'REGISTRY_ENTRIES missing'],warnings};
  const ids=new Set(),components=new Set(),covered=new Set();const entryMap=new Map();
  for(const e of entries){
    if(!e||typeof e!=='object'){error('ENTRY_INVALID');continue;}
    if(typeof e.id!=='string'||!/^(CMP|PAT)-[A-Z0-9-]+$/.test(e.id)||ids.has(e.id))error(`ID_DUPLICATE_OR_INVALID ${e.id}`);ids.add(e.id);entryMap.set(e.id,e);
    if(!STATUSES.has(e.status))error(`STATUS_INVALID ${e.id}: ${e.status}`);
    if(!['A','B','C','D'].includes(e.reuseClass)||!['component','pattern'].includes(e.kind))error(`CLASS_OR_KIND ${e.id}`);
    for(const f of ['name','role'])if(typeof e[f]!=='string'||!e[f].trim())error(`FIELD_REQUIRED ${e.id}: ${f}`);
    for(const f of ['keywords','sources','consumers','examples','states','businessBoundary','sideEffects','exceptions','contractIds','validation'])if(!Array.isArray(e[f]))error(`FIELD_ARRAY ${e.id}: ${f}`);
    if(!e.implementation||e.implementation.observed!==true||e.implementation.baseline!==reg.sourceBaseline)error(`IMPLEMENTATION_PROVENANCE ${e.id}`);
    if(e.status==='approved'&&(!e.designApproval?.reference||!e.designApproval?.scope))error(`APPROVAL_EVIDENCE ${e.id}`);
    if(!['source-observed','role-observed','unverified'].includes(e.consumerVerification?.status)||!e.consumerVerification?.reason)error(`CONSUMER_VERIFICATION ${e.id}`);
    if(!(e.sources?.length&&e.examples?.length&&e.states?.length&&e.businessBoundary?.length&&e.contractIds?.length&&e.validation?.length))error(`FIELDS_EMPTY ${e.id}`);
    for(const src of e.sources||[]) {if(src.kind==='historical'){if(!src.reason)error(`HISTORICAL_REASON ${e.id}`);warnings.push(`HISTORICAL_PATH ${e.id}: ${src.path}`);}else if(src.kind==='current')resolve(src.path,e.id);else error(`SOURCE_KIND ${e.id}`);}
    for(const x of [...(e.examples||[]),...(e.validation||[])])resolve(x.path,e.id);
    if(e.kind==='pattern'){
      if(!Array.isArray(e.rolePages)||!Array.isArray(e.applicablePages)||e.consumers?.length)error(`PATTERN_RELATIONS ${e.id}`);
      const scope=new Set(e.applicablePages||[]);if(scope.size!==(e.applicablePages||[]).length)error(`APPLICABLE_DUPLICATE ${e.id}`);
      for(const page of scope)if(!pages.includes(page))error(`APPLICABLE_PAGE ${e.id}: ${page}`);
      for(const c of e.rolePages||[]){
        if(!scope.has(c.page))error(`ROLE_OUTSIDE_APPLICABLE ${e.id}: ${c.page}`);
        if(c.relation!=='role-related'||c.usage!=='role')error(`ROLE_RELATION ${e.id}`);
      }
    }
    for(const recipe of e.usageRecipes||[]){
      for(const c of recipe.consumers||[])if(!e.applicablePages?.includes(c.page))error(`RECIPE_OUTSIDE_APPLICABLE ${e.id}: ${c.page}`);
      resolve(recipe.source,e.id);if(!recipe.id||!Array.isArray(recipe.classes)||!recipe.classes.length||!Array.isArray(recipe.consumers))error(`RECIPE_FIELDS ${e.id}`);
      else if(JSON.stringify(recipeConsumers(root,recipe.classes,pages).map(c=>c.page).sort())!==JSON.stringify(recipe.consumers.map(c=>c.page).sort()))error(`RECIPE_CONSUMER_MISMATCH ${e.id}: ${recipe.id}`);
    }
    for(const c of e.contractIds||[])if(!contractMap.has(c))error(`CONTRACT_REFERENCE ${e.id}: ${c}`);
    for(const ex of e.exceptions||[]){if(!ex.scope||!ex.reason||!Array.isArray(ex.contractIds))error(`EXCEPTION_FIELDS ${e.id}`);for(const c of ex.contractIds||[])if(!contractMap.has(c))error(`EXCEPTION_REFERENCE ${e.id}: ${c}`);}
    for(const consumer of [...(e.consumers||[]),...(e.rolePages||[])]){if(!pages.includes(consumer.page))error(`CONSUMER_PAGE ${e.id}: ${consumer.page}`);else covered.add(consumer.page);
      if(!['page','component','role'].includes(consumer.usage))error(`CONSUMER_USAGE ${e.id}`);
      if(e.kind==='component'&&consumer.relation!=='direct-component')error(`DIRECT_RELATION ${e.id}`);
      if(consumer.evidence?.strength==='structural-only')warnings.push(`STRUCTURAL_ROLE_ONLY ${e.id}: ${consumer.page}`);
      if(consumer.evidence?.strength==='role-specific-literal'&&/^<view\s+class=["'][\w\s-]*(?:page|shell)[\w\s-]*["']\s*>$/.test(consumer.evidence.literal?.trim()||''))error(`ROLE_SPECIFIC_EVIDENCE_WEAK ${e.id}: ${consumer.page}`);
      if(consumer.evidence){const f=resolve(consumer.evidence.path,e.id);if(f&&(!consumer.evidence.literal||!fs.readFileSync(f,'utf8').includes(consumer.evidence.literal)))error(`CONSUMER_EVIDENCE ${e.id}: ${consumer.page}`);}}
    if(e.consumerVerification?.status==='unverified'){if(e.consumers?.length)error(`UNVERIFIED_WITH_CONSUMERS ${e.id}`);warnings.push(`UNVERIFIED_CONSUMERS ${e.id}: ${e.consumerVerification.reason}`);}
    if(e.kind==='component'){
      const src=e.sources?.find(s=>s.kind==='current'&&s.path.endsWith('.json'))?.path?.replace(/\.json$/,'');if(!src||!discovered.has(src))error(`COMPONENT_SOURCE ${e.id}`);else{
        if(components.has(src))error(`COMPONENT_DOUBLE_REGISTRATION ${src}`);components.add(src);
        const actual=src==='miniprogram/custom-tab-bar/index'?(app.tabBar?.custom?app.tabBar.list.map(x=>({page:x.pagePath})):[]):discovered.get(src);
        const want=actual.map(x=>x.page+':'+(x.tag||'')).sort(),got=(e.consumers||[]).map(x=>x.page+':'+(x.tag||'')).sort();if(JSON.stringify(want)!==JSON.stringify(got))error(`CONSUMER_MISMATCH ${e.id}: registration differs from app/usingComponents`);
      }}
  }
  for(const p of pages)if(!covered.has(p))error(`PAGE_UNMAPPED ${p}`);
  for(const p of discovered.keys())if(!components.has(p))error(`COMPONENT_UNREGISTERED ${p}`);
  for(const e of entries)if(e.status==='deprecated'){const next=entryMap.get(e.replacedBy);if(!next||next.id===e.id||next.status!=='approved')error(`REPLACEMENT_INVALID ${e.id}`);}
  replacementCycles(new Map(entries.filter(e=>e.replacedBy).map(e=>[e.id,[e.replacedBy]])),'REPLACEMENT_CYCLE');
  for(const ref of reg.legacyReferences||[]) {resolve(ref.path,'legacy reference');if(!ref.relation)error('LEGACY_RELATION missing');}
  for(const f of required.filter(x=>x.endsWith('.md'))){const s=fs.readFileSync(path.join(root,f),'utf8');for(const m of s.matchAll(/\]\(([^)]+)\)/g)){const target=m[1].split('#')[0];if(!target||/^https?:/.test(target))continue;const dest=path.resolve(path.dirname(path.join(root,f)),target);if(!dest.startsWith(root+path.sep)||!fs.existsSync(dest))error(`DOC_LINK ${f}: ${target}`);}}
  const styles=walk(path.join(root,'miniprogram')).filter(f=>f.endsWith('.wxss')).map(f=>({path:path.relative(root,f).replaceAll(path.sep,'/'),text:fs.readFileSync(f,'utf8')}));
  const tokens=analyzeStyles(styles);errors.push(...tokens.errors);warnings.push(...tokens.warnings);
  let audit=null;if(options.auditBase){try{audit=auditChanges(root,options.auditBase);warnings.push(...audit.warnings);}catch(e){error(`AUDIT_UNAVAILABLE ${e.message}`);}}
  return {ok:!errors.length,errors:[...new Set(errors)],warnings:[...new Set(warnings)],version:reg.designSystemVersion,activation,counts:{contracts:contracts.length,approvedContracts:contracts.filter(c=>c.status==='approved').length,entries:entries.length,components:components.size,patterns:entries.filter(e=>e.kind==='pattern').length,pages:pages.length,styles:styles.length,tokenDefinitions:tokens.definitions},audit,limits:['Static references and conservative token checks only; no selector/WXML reachability proof','Role evidence does not establish all states or identical implementations','Visual deltas and reuse similarity require explanation, not automatic business decisions','No UI geometry, keyboard, device, cloud or release acceptance']};
}
function queryEntries(reg,query){
 const q=String(query).toLowerCase();return reg.entries.filter(e=>JSON.stringify([e.id,e.name,e.role,e.keywords]).toLowerCase().includes(q));
}
function summarizeEntry(e){return {id:e.id,name:e.name,role:e.role,reuseClass:e.reuseClass,status:e.status,sourceEntrypoints:e.sources.filter(s=>s.kind==='current').slice(0,4).map(s=>s.path),sourceCount:e.sources.length,recommendation:e.recommendation.slice(0,160)};}
if(require.main===module){
 const args=process.argv.slice(2);let root=path.resolve(__dirname,'..'),auditBase,query,show,consumers,json=false;
 for(let i=0;i<args.length;i++){if(args[i]==='--root')root=args[++i];else if(args[i]==='--audit-base')auditBase=args[++i];else if(args[i]==='--query')query=args[++i];else if(args[i]==='--show')show=args[++i];else if(args[i]==='--consumers')consumers=args[++i];else if(args[i]==='--json')json=true;else{console.error('Unknown option:',args[i]);process.exit(2);}}
 try{
  if([query,show,consumers].filter(Boolean).length>1)throw Error('Choose only one of --query, --show, --consumers');
  if(query||show||consumers){
   const reg=JSON.parse(fs.readFileSync(path.join(root,'docs/design-system/registry.json'),'utf8')),activation=validateActivation(root,reg);
   if(!activation.ok)throw Error(activation.errors.join('\n'));
   const rows=query?queryEntries(reg,query):reg.entries.filter(e=>e.id===(show||consumers));
   const result={version:reg.designSystemVersion,activationState:activation.state,count:rows.length,matches:query?rows.map(summarizeEntry):consumers?rows.map(e=>consumerLookup(root,e,reg)):rows};
   console.log(JSON.stringify(result,null,2));if(!rows.length)process.exitCode=1;
  }else{
   const result=validate(root,{auditBase});if(json)console.log(JSON.stringify(result,null,2));else{console.log(`DS validation ${result.ok?'PASS':'FAIL'} ${result.version||''} ${result.activation?.state||''}`);console.log(JSON.stringify(result.counts||{}));for(const e of result.errors)console.error('ERROR',e);for(const w of result.warnings)console.log('NOTICE',w);if(result.audit)console.log('AUDIT',JSON.stringify(result.audit));console.log('Limits: static/controller evidence does not prove UI/device or product equivalence.');}if(!result.ok)process.exitCode=1;
  }
 }catch(e){console.error(e.message);process.exitCode=1;}
}
module.exports={validate,analyzeStyles,parseContracts,auditChanges,vars,consumerLookup,queryEntries,summarizeEntry,validateActivation};
