#!/usr/bin/env node
// N0 read-only source and handler baseline. Outputs audit artifacts only.
// Usage: node probe.cjs <repository root> <audit output directory>
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const assert = require('assert/strict');
const {createRequire} = require('module');
const root = path.resolve(process.argv[2]);
const out = path.resolve(process.argv[3]);
fs.mkdirSync(out, {recursive:true});
const json = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const clone = (x) => JSON.parse(JSON.stringify(x));
const hash = (x) => crypto.createHash('sha256').update(typeof x === 'string' || Buffer.isBuffer(x) ? x : JSON.stringify(x)).digest('hex');
const event = (dataset) => ({currentTarget:{dataset}});
const subjects = ['data-analysis','quantity','logic','verbal','graphic'];
const catalog = require(path.join(root, 'miniprogram/subpackages/note/models/note-catalog'));
const training = require(path.join(root, 'miniprogram/models/train-catalog'));
const {buildTrainingConfig} = require(path.join(root, 'miniprogram/models/train-config'));
const {generateQuestionSet} = require(path.join(root, 'miniprogram/services/train-generator'));
const {validateAnswer} = require(path.join(root, 'miniprogram/utils/answer-validator'));
const traces=[];
function page(rel) {
  const filename=path.join(root,'miniprogram',rel); let captured;
  const calls=[];
  const wx={setNavigationBarTitle:(a)=>calls.push({op:'title',...a}),navigateTo:(a)=>calls.push({op:'navigateTo',...a}),
    showToast:(a)=>calls.push({op:'toast',...a}),pageScrollTo:(a)=>calls.push({op:'scroll',...a})};
  vm.runInNewContext(fs.readFileSync(filename,'utf8'), {require:createRequire(filename),Page:(c)=>{captured=c;},wx,
    console,setTimeout:()=>0,clearTimeout:()=>{}},{filename});
  const p={...captured,data:clone(captured.data),calls,wx,setData(values){Object.assign(this.data,values);}};
  // N0 does not call cloud functions or fetch image bytes.
  if(p.resolveActiveBlockImages)p.resolveActiveBlockImages=()=>{};
  return p;
}
function nav(p) {const v=p.calls.filter(c=>c.op==='navigateTo').at(-1); if(!v)return null;
  const u=new URL(v.url,'https://local.invalid');return {path:u.pathname,query:Object.fromEntries([...u.searchParams].filter(([k])=>k!=='config'))};}
function assets(value,pointer='',found=[]) {
  if(!value||typeof value!=='object')return found;
  for(const [key,child] of Object.entries(value)) {
    const p=pointer+'/'+key;
    if(key==='src'&&typeof child==='string'&&child)found.push({jsonPointer:p,src:child,
      transport:/^(https?:|cloud:)/.test(child)?'remote-or-cloud':'relative-asset',remoteBytesVerified:false});
    if(child&&typeof child==='object')assets(child,p,found);
  }
  return found;
}
const holds={
  'ratio-change':'缺少现期比重，不能独立计算比重变化百分点',
  'base-ratio':'解析将进口占出口与进口占进出口总额的分母口径混用',
  'mixed-growth':'整体5%更接近进口3%，原解析及答案需要核对',
};
const specialRoutes={'assumption-tree':'/pages/training/assumption/index','estimation-split':'/pages/training/estimation/index','ratio-sense':'/pages/training/ratio-sense/index'};
const relationReasons={
  'annual-average':['direct-skill','练年平均量计算；不替代完整材料阅读'],
  'annual-growth-rate':['supporting-skill','百分化支撑计算，不检测年均增长率模型和期数'],
  'average-denominator':['supporting-skill','年平均量支撑平均计算，不等于分母识别'],
  'fraction-compare':['direct-skill','分数比大小直接练比较技能'],
  'increment-compare':['direct-skill','增量比较直接练比较技能'],
  'base-compare':['direct-skill','基期比较直接练比较技能'],
  'chart-lookup':['mapping-review','年平均量不直接检测图表查找'],
  'base-period':['supporting-skill','拆分估算支撑求基期计算，原入口还存在专页路由差异'],
  'growth-rate':['supporting-skill','分数计算不直接检测增长率模型识别'],
  'growth-amount':['direct-skill','估算增长量直接练计算技能'],
  'abrx-system':['supporting-skill','拆分估算不覆盖ABRX四量关系识别'],
  'interval-growth':['supporting-skill','百分化不直接检测跨期增长关系'],
  'interval-growth-reverse':['supporting-skill','百分化不直接检测间隔增长逆向推理'],
  'mixture-cross':['supporting-skill','百分化不直接检测十字交叉的适用条件'],
  'current-ratio':['supporting-skill','分数计算支撑比重数值运算，不检测部分整体识别'],
  'base-ratio':['direct-skill','练基期比重计算；原例题隔离不因生成器可用而解除'],
  'hierarchical-ratio':['supporting-skill','百分化不直接检测多级整体关系'],
  'ratio-change':['supporting-skill','基期比重计算仅支撑比重变化；原例题须补材料'],
  'ratio-trend':['mapping-review','数值基期比重不直接检测比重趋势逆运用'],
  'ratio-difference':['supporting-skill','基期比重支撑部分运算，不等于比重差检测'],
  'mixed-growth':['supporting-skill','百分化不检测混合权重；原例题有待核矛盾'],
  'multiple-growth':['supporting-skill','大分数计算支撑倍数运算，不检测倍数与增长率区分'],
  'percentage-point':['supporting-skill','百分化不直接检测百分点概念'],
  'pulling-contribution':['supporting-skill','增长量支撑部分步骤，不覆盖拉动贡献口径'],
  'data-inclusion':['mapping-review','百分化不直接检测包含关系'],
  'quick-arithmetic':['supporting-skill','基础混合加减只覆盖速算中的一项技能'],
  'multiplication-arithmetic':['mapping-review','现挂百分化不直接等价于本节全部乘法技巧'],
  'division-estimation':['supporting-skill','分数计算支撑除法估算技能'],
  'share-415':['supporting-skill','比例感是独立技能训练，须专页进入'],
  'assumption-allocation':['direct-skill','分配树是独立方法训练，须专页进入'],
};
const inventory={schemaVersion:1,date:'2026-10-21',scope:'N0 source inventory; not a question bank or content approval',
  identityRule:'sourceExampleRecordId is a frozen audit/import mapping key; array indexes and content hashes are locators, not runtime question identity',
  subjects:[],sourceFiles:[],examples:[],trainingLinks:[],sourceTabMappings:[],ownershipIssues:[],assetReferences:[],contentHolds:[],pilot:[]};
let exNumber=0;
for(const subject of subjects){
  const folder=path.join(root,'miniprogram/models','note-'+subject);
  const meta=json(path.join(folder,'meta.json')),cats=json(path.join(folder,'categories.json'));
  const files=fs.readdirSync(path.join(folder,'points')).filter(f=>f.endsWith('.json')).sort();
  const points=[];
  for(const f of files){const rel=path.join('miniprogram/models','note-'+subject,'points',f);
    const values=json(path.join(root,rel));values.forEach((p,i)=>points.push({p,rel,pointer:'/'+i}));}
  for(const rel of ['meta.json','categories.json',...files.map(f=>'points/'+f)]){
    const full=path.join(folder,rel); inventory.sourceFiles.push({path:path.relative(root,full),sha256:hash(fs.readFileSync(full))});}
  const section={id:subject,title:meta.title,categories:cats.map(c=>({id:c.id,title:c.title,status:c.status,pointIds:c.pointIds||[]})),points:[]};
  const exampleStart=inventory.examples.length;
  for(const {p,rel,pointer} of points){
    const owners=cats.filter(c=>(c.pointIds||[]).includes(p.id));
    if(owners.length!==1||owners[0]?.id!==p.categoryId)inventory.ownershipIssues.push({subjectId:subject,pointId:p.id,declared:p.categoryId,owners:owners.map(c=>c.id)});
    const r={subjectId:subject,id:p.id,title:p.title,categoryId:p.categoryId,sourcePath:rel,jsonPointer:pointer,sourceSha256:hash(p),
      hasSourceApprovalField:Object.hasOwn(p,'sourceAuditStatus'),tabs:[]};
    const runtimePoint=catalog.getNotePoint(subject,p.id);
    assert(runtimePoint,subject+'/'+p.id); assert.equal(hash(p),hash(runtimePoint));
    const detail=page('subpackages/note/detail/index.js');detail.onLoad({moduleId:subject,pointId:p.id});
    assert.equal(detail.data.point?.id,p.id);
    for(const [ti,t] of p.tabs.entries()){
      const tp=pointer+'/tabs/'+ti;const runtimeTab=runtimePoint.tabs[ti];
      const displayed=detail.data.tabs.filter(dt=>(runtimeTab.blocks||[]).some(b=>(dt.blocks||[]).includes(b))).map(dt=>dt.id);
      const mapping={subjectId:subject,pointId:p.id,sourceTabId:t.id,displayTabIds:displayed,
        sameIdPresent:detail.data.tabs.some(dt=>dt.id===t.id)};
      inventory.sourceTabMappings.push(mapping);
      const tr={id:t.id,title:t.title,jsonPointer:tp,sha256:hash(t),blockCount:t.blocks.length,
        blocksWithStableId:t.blocks.filter(b=>b.id).length,blockTypes:{},exampleRecordIds:[]};
      for(const [bi,b] of t.blocks.entries()){
        tr.blockTypes[b.type]=(tr.blockTypes[b.type]||0)+1;
        const bp=tp+'/blocks/'+bi;
        if(b.type!=='example')continue;
        const missing=[];if(!b.stem)missing.push('stem');if(!Array.isArray(b.options)||b.options.length<2)missing.push('choiceOptions');
        if(!b.answer)missing.push('answer');if(!b.analysis)missing.push('analysis');
        if(b.options?.length&&!b.options.some(o=>o.key===b.answer))missing.push('validAnswerKey');
        const complete=missing.length===0;
        const hold=subject==='data-analysis'&&holds[p.id]&&b.options?.length?holds[p.id]:null;
        const record={sourceExampleRecordId:'notes-source-example-'+String(++exNumber).padStart(6,'0'),subjectId:subject,pointId:p.id,
          tabId:t.id,sourcePath:rel,jsonPointer:bp,initialBlockIndex:bi,sha256:hash(b),label:b.label||'',
          stemPreview:String(b.stem||'').slice(0,120),normalizedStemSha256:hash(String(b.stem||'').replace(/[\s\p{P}]/gu,'')),
          classification:complete?'structured-choice-candidate':b.options?.length?'incomplete-choice':'explanation-example',
          missingChoiceFields:missing,hasStableSourceBlockId:!!b.id,hasDeclaredSource:!!b.source,declaredSource:b.source||null,
          imageReferences:assets(b,bp),reviewState:hold?'hold':'unreviewed',holdReason:hold,
          admittedToPractice:false,admissionNote:'structure only; source provenance and answer accuracy still require review'};
        inventory.examples.push(record);tr.exampleRecordIds.push(record.sourceExampleRecordId);
        if(hold)inventory.contentHolds.push({sourceExampleRecordId:record.sourceExampleRecordId,subjectId:subject,pointId:p.id,tabId:t.id,sourcePath:rel,jsonPointer:bp,reason:hold});
      }
      r.tabs.push(tr);
    }
    const ar=assets(p,pointer).map(a=>({subjectId:subject,pointId:p.id,sourcePath:rel,...a}));inventory.assetReferences.push(...ar);
    r.assetReferenceCount=ar.length;
    if(p.relatedTraining){
      const link=p.relatedTraining,item=training.getTrainingItem(link.sectionId,link.itemId);assert(item);
      const observed=page('subpackages/note/detail/index.js');observed.data.point=runtimePoint;observed.handleTrainingTap();
      const legacyRoute=nav(observed);const cat=page('pages/training/catalog/index.js');
      cat.data.section=training.getSectionById(link.sectionId);cat.data.item=item;cat.data.itemId=item.id;cat.data.config=buildTrainingConfig(item);cat.startTraining();
      const canonicalRoute=nav(cat);const generated=generateQuestionSet(link.sectionId,link.itemId,2);
      const [relationship,rationale]=relationReasons[p.id]||['mapping-review','需核对关联训练用途'];
      const lr={subjectId:subject,pointId:p.id,sourcePath:rel,declaredLink:link,trainingMetadata:{standalonePage:!!item.standalonePage,
        tolerancePercent:item.tolerancePercent||null,answerMode:item.answerMode||'numeric-or-exact',legacyDefaultQuestionCount:buildTrainingConfig(item).questionCount},
        observedNoteLaunch:legacyRoute,observedCatalogLaunch:canonicalRoute,routeConsistent:legacyRoute.path===canonicalRoute.path,
        genericGeneratorQuestionCount:generated.length,genericGeneratorSample:generated[0]?{prompt:generated[0].prompt,answerMode:generated[0].answerMode||'numeric',answer:generated[0].answer}:null,
        relationshipToKnowledge:{classification:relationship,rationale,fullKnowledgeMastery:false},
        resultOwner: item.standalonePage?'existing-standalone-training':'existing-training-session-and-wrong-book',newNotesSessionIntegrated:false};
      inventory.trainingLinks.push(lr);r.trainingLinkIndex=inventory.trainingLinks.length-1;
    }
    section.points.push(r);
  }
  const ex=inventory.examples.slice(exampleStart);
  section.counts={categories:cats.length,points:points.length,tabs:section.points.reduce((n,p)=>n+p.tabs.length,0),
    exampleBlocks:ex.length,structuredChoiceCandidates:ex.filter(x=>x.classification==='structured-choice-candidate').length,
    explanationExamples:ex.filter(x=>x.classification==='explanation-example').length,incompleteChoices:ex.filter(x=>x.classification==='incomplete-choice').length};
  inventory.subjects.push(section);
}
inventory.totals=Object.fromEntries(Object.keys(inventory.subjects[0].counts).map(k=>[k,inventory.subjects.reduce((n,s)=>n+s.counts[k],0)]));
inventory.totals.trainingLinks=inventory.trainingLinks.length;
inventory.totals.routeMismatches=inventory.trainingLinks.filter(l=>!l.routeConsistent).length;
inventory.totals.sourceAssetReferences=inventory.assetReferences.length;
inventory.totals.heldExamples=inventory.contentHolds.length;
const stemGroups=new Map();for(const e of inventory.examples){if(!stemGroups.has(e.normalizedStemSha256))stemGroups.set(e.normalizedStemSha256,[]);stemGroups.get(e.normalizedStemSha256).push(e.sourceExampleRecordId);}
inventory.exactNormalizedStemDuplicates=[...stemGroups.values()].filter(a=>a.length>1);
const pilotIds=['period-terms','base-period','growth-rate','growth-amount','current-ratio','ratio-trend'];
for(const id of pilotIds){const ex=inventory.examples.filter(e=>e.subjectId==='data-analysis'&&e.pointId===id);
  inventory.pilot.push({pointId:id,plannedBatch:['current-ratio','ratio-trend'].includes(id)?'N7-C01':'N3-N5',exampleRecordIds:ex.map(e=>e.sourceExampleRecordId),structuredChoiceCandidates:ex.filter(e=>e.classification==='structured-choice-candidate').length});}
assert.deepEqual(inventory.ownershipIssues,[]);assert.equal(inventory.totals.points,162);assert.equal(inventory.totals.exampleBlocks,218);assert.equal(inventory.totals.structuredChoiceCandidates,150);

const home=page('pages/note/index/index.js');home.onLoad();home.handleSearchTap();
traces.push({id:'home-search',level:'actual-handler-with-wx-stubs',observed:nav(home)});
assert.equal(nav(home).query.scope,'notes');
for(const s of subjects){home.handleModuleTap(event({moduleId:s}));assert.equal(nav(home).query.moduleId,s);}
traces.push({id:'home-five-subjects',level:'actual-handler-with-wx-stubs',count:subjects.length,passed:true});
let categoryCount=0;
for(const s of inventory.subjects){const modulePage=page('subpackages/note/module/index.js');modulePage.onLoad({moduleId:s.id});
  assert.equal(modulePage.data.pointTotal,s.counts.points);
  for(const c of s.categories){modulePage.handleCategoryTap(event({categoryId:c.id}));assert.equal(nav(modulePage).query.categoryId,c.id);
    const cp=page('subpackages/note/category/index.js');cp.onLoad({moduleId:s.id,categoryId:c.id});assert.deepEqual(cp.data.points.map(p=>p.id),c.pointIds);categoryCount++;
    for(const p of cp.data.points){cp.handlePointTap(event({pointId:p.id}));assert.equal(nav(cp).query.pointId,p.id);}}
}
traces.push({id:'five-subjects-forty-categories-all-details',level:'actual-handler-with-wx-stubs',subjects:5,categories:categoryCount,points:162,passed:true,cloudImageFetching:'disabled; source bindings only'});
for(const [s,query] of [['data-analysis','基期量'],['quantity','鸡兔同笼'],['logic','因果'],['verbal','词语辨析'],['graphic','对称']]){
  const sp=page('subpackages/note/search/index.js');sp.onLoad({scope:'notes',moduleId:s});sp._doSearch(query);
  assert(sp.data.results.length>0,s+'/'+query);assert(sp.data.results.every(r=>r.module.id===s));
  const first=sp.data.results[0];sp.handleResultTap(event({pointId:first.id,moduleId:s}));
  traces.push({id:'search-'+s,level:'actual-handler-with-wx-stubs',query,resultCount:sp.data.results.length,
    firstPointId:first.id,observedDestination:nav(sp),tabIdCarried:!!nav(sp).query.tabId});
}
const bad=page('subpackages/note/detail/index.js');bad.onLoad({moduleId:'data-analysis',pointId:'missing'});assert.equal(bad.data.point,null);assert(bad.calls.some(c=>c.op==='toast'));
traces.push({id:'unknown-point',level:'actual-handler-with-wx-stubs',observed:'toast; no wrong point loaded',passed:true});
const badTab=page('subpackages/note/detail/index.js');badTab.onLoad({moduleId:'data-analysis',pointId:'base-period',tabId:'missing'});
traces.push({id:'unknown-tab-existing-gap',level:'actual-handler-with-wx-stubs',observed:badTab.data.activeTab,interpretation:'silently falls back to first tab; N2 must make failure explicit'});
const lazy=inventory.subjects.flatMap(s=>s.points).flatMap(p=>p.tabs.map(t=>({p,t}))).find(x=>x.t.blockCount>8);
const lazyPage=page('subpackages/note/detail/index.js');lazyPage.onLoad({moduleId:lazy.p.subjectId,pointId:lazy.p.id,tabId:lazy.t.id});
traces.push({id:'lazy-render-source-location',level:'actual-handler-with-wx-stubs',subjectId:lazy.p.subjectId,pointId:lazy.p.id,tabId:lazy.t.id,
  totalBlocks:lazyPage.data.activeBlocks.length,renderCount:lazyPage.data.renderCount,hasMore:lazyPage.data.hasMore,anchors:lazyPage.data.sectionAnchors.slice(0,2),
  interpretation:'render indexes are temporary; source lookup past render limit needs expansion'});
for(const [id,expected] of Object.entries(specialRoutes)){
  const links=inventory.trainingLinks.filter(l=>l.declaredLink.itemId===id);assert(links.length);for(const l of links){assert.equal(l.observedCatalogLaunch.path,expected);assert.equal(l.genericGeneratorQuestionCount,0);}
  traces.push({id:'legacy-special-route-'+id,level:'actual-handler-with-wx-stubs',affectedPoints:links.map(l=>l.pointId),expectedDestination:expected,
    observedNoteDestination:links[0].observedNoteLaunch.path,status:'known-existing-gap; fix in N3'});
}
let component;
const cf=path.join(root,'miniprogram/subpackages/note/components/note-example/index.js');
vm.runInNewContext(fs.readFileSync(cf,'utf8'),{Component:c=>{component=c;},wx:{showToast:()=>{}}},{filename:cf});
const c={data:clone(component.data),setData(v){Object.assign(this.data,v);}};
for(const [k,v]of Object.entries(component.methods))c[k]=v.bind(c);
c.handleOptionTap(event({key:'C'}));c.handleSubmit();assert.equal(c.data.submitted,true);
const before=clone(c.data);component.observers.exampleKey.call(c);assert.equal(c.data.submitted,false);
traces.push({id:'legacy-example-local-answer',level:'actual-component-handler',afterSubmit:before,afterKeyReset:clone(c.data),interpretation:'component local state; no persistent question attempt or result event on submit'});
const normal=generateQuestionSet('data-analysis','growth-pre',2);assert.equal(normal.length,2);
const item=training.getTrainingItem('data-analysis','growth-pre');assert(validateAnswer(normal[0],normal[0].answer,item));
traces.push({id:'existing-number-generator-and-checker',level:'actual-exported-functions',generatorId:'growth-pre',questions:normal.length,
  tolerancePercent:item.tolerancePercent,exactAnswerAccepted:true,identityExample:normal[0].id,identityScope:'trainingId-index; insufficient across random sessions'});
const current={date:'2026-10-21',method:'Node VM actual page/controller and component handlers with in-memory wx stubs',
  deviceOrVisualAcceptance:false,realWxStorageReadOrWritten:false,cloudFunctionsCalled:false,codeChanged:false,
  traces,tabMerges:inventory.sourceTabMappings.filter(m=>!m.sameIdPresent),existingGaps:[
    {id:'NOTE-N0-G01',description:'4 knowledge links route standalone training through generic session',plannedBatch:'N3'},
    {id:'NOTE-N0-G02',description:'search does not carry matching tabId',plannedBatch:'N2'},
    {id:'NOTE-N0-G03',description:'unknown tab silently falls back; source anchors use render indexes',plannedBatch:'N2'},
    {id:'NOTE-N0-G04',description:'example answers are local component state, not persistent attempts',plannedBatch:'N3'},
    {id:'NOTE-N0-G05',description:'3 structural-choice examples held for source/material/analysis review',plannedBatch:'content review before corresponding N7 scope'},
  ]};
fs.writeFileSync(path.join(out,'notes-learning-v1-inventory.json'),JSON.stringify(inventory,null,2)+'\n');
fs.writeFileSync(path.join(out,'notes-learning-v1-n0-behavior.json'),JSON.stringify(current,null,2)+'\n');
console.log(JSON.stringify({totals:inventory.totals,behaviorTraces:traces.length,tabMerges:current.tabMerges.length,ownershipIssues:0,exactStemDuplicateGroups:inventory.exactNormalizedStemDuplicates.length}));
