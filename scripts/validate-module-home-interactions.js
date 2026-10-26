#!/usr/bin/env node
// Runtime-controller checks with platform stubs. Never a geometry or IDE acceptance.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..'), mini = path.join(root, 'miniprogram');
const baseline = 'd5032323cdf4d61edfec6f93ee4e7c181c165c50';
const clone = value => JSON.parse(JSON.stringify(value));
const tap = dataset => ({ type: 'tap', currentTarget: { dataset: dataset || {} } });
const reports = [];
function check(name, fn) { fn(); reports.push(name); }
function load(rel, original = false, options = {}) {
  const filename = path.join(mini, rel), stored = clone(options.stored || {}), calls = [];
  let definition;
  const wx = {
    setNavigationBarTitle(v) { calls.push({ op:'title', ...v }); },
    getStorageSync(k) { if(options.failStorage) throw Error('fixture unavailable'); return stored[k]; },
    setStorageSync(k,v) { if(options.failStorage) throw Error('fixture unavailable'); stored[k]=clone(v); },
    getAccountInfoSync: () => ({miniProgram:{envVersion:options.env || 'develop'}}),
    navigateTo(v) { calls.push({op:'navigate', ...v}); },
    showToast(v) { calls.push({op:'toast', ...v}); },
    pageScrollTo(v) { calls.push({op:'scroll', ...v}); },
    nextTick: fn => fn(),
  };
  const code = original ? execFileSync('git',['show',baseline+':miniprogram/'+rel],{cwd:root,encoding:'utf8'}) : fs.readFileSync(filename,'utf8');
  vm.runInNewContext(code,{require:createRequire(filename),Page:v=>definition=v,wx,console,setTimeout,clearTimeout,Date:class extends Date { static now(){return 1793000000000;} }},{filename});
  const page = {...definition,data:clone(definition.data),calls,stored,setData(v,done){Object.assign(this.data,v);if(done)done();}};
  return page;
}
const modules = [
 {id:'note',home:'pages/note/index/index',all:'handleDirectoryTap',search:'/subpackages/note/search/index?scope=notes'},
 {id:'common-sense',home:'pages/common-sense/index',all:'handleTopicsTap',search:'/subpackages/common-sense/search/index?moduleId=common-sense'},
 {id:'politics',home:'pages/politics/index',all:'handleTerrainTap',search:'/subpackages/politics/search/index'},
];
for(const m of modules) {
  const prefix={note:'note','common-sense':'common',politics:'politics'}[m.id];
  check(m.id+': home entry destinations and preference writes match the fixed business baseline',()=>{
    const current=load(m.home+'.js'), old=load(m.home+'.js',true);
    for(const p of [current,old]) { if(p.onLoad)p.onLoad();if(p.onShow)p.onShow();p.handleSearchTap(tap());p[m.all](tap()); }
    assert.deepEqual(current.calls,old.calls);assert.deepEqual(current.stored,old.stored);
    assert.equal(current.calls.find(c=>c.op==='navigate').url,m.search);
  });
  check(m.id+': page search tap and repeated taps navigate once',()=>{
    const p=load(m.home+'.js');
    const event=tap();
    p.handleSearchTap(event);p.handleSearchTap(event);
    assert.equal(p.calls.filter(c=>c.op==='navigate').length,1);
    p[m.all](tap());assert.equal(p.calls.filter(c=>c.op==='navigate').length,2);
  });
  check(m.id+': home structure uses whole-row click search and preserves separate full-content target',()=>{
    const wxml=fs.readFileSync(path.join(mini,m.home+'.wxml'),'utf8');
    const head=wxml.indexOf('class="'+prefix+'-page-head"'), primary=wxml.indexOf('module-home-primary'), all=wxml.indexOf('module-home-entry surface-card')>=0?wxml.indexOf('module-home-entry surface-card'):wxml.indexOf('surface-card module-home-entry'), paths=wxml.indexOf('module-home-path-list');
    assert(head>=0&&primary>head&&all>primary&&paths>all);
    assert(wxml.includes('全部知识'));assert(!wxml.includes('<input'));
    assert(wxml.includes('class="'+prefix+'-search-entry" bindtap="handleSearchTap"'));
    assert(!wxml.includes('class="search-label"'));
  });
}
check('shared component forwards an actual tap, without a native button width default',()=>{
  let definition;const file=path.join(mini,'components/learning-home-head/index.js');
  vm.runInNewContext(fs.readFileSync(file,'utf8'),{Component:v=>definition=v},{filename:file});
  const events=[];definition.methods.handleSearch.call({triggerEvent:(name,data)=>events.push({name,...data})},tap());
  assert.deepEqual(events,[{name:'search',physical:true}]);
  const html=fs.readFileSync(path.join(mini,'components/learning-home-head/index.wxml'),'utf8');
  assert(!html.includes('<button'));assert(html.includes('role="button"'));
});
check('tap guard distinguishes destinations, expires, and does not swallow thrown failures',()=>{
  const {withEntryTapGuard}=require('../miniprogram/utils/module-home-navigation');let time=1000,count=0;
  const p=withEntryTapGuard({go(){count++;}},['go'],()=>time);
  p.go(tap({id:'one'}));p.go(tap({id:'one'}));assert.equal(count,1);
  p.go(tap({id:'two'}));assert.equal(count,2);time+=301;p.go(tap({id:'one'}));assert.equal(count,3);
  let errors=0;const q=withEntryTapGuard({go(){errors++;throw Error('fixture');}},['go'],()=>time);
  assert.throws(()=>q.go(tap()));assert.throws(()=>q.go(tap()));assert.equal(errors,2);
});
check('notes daily quick-memory is exactly the existing basic route; other three modes remain reachable',()=>{
  const p=load('pages/note/index/index.js');
  assert.equal(p.data.primaryMode.id,'basic');assert.deepEqual(p.data.otherModes.map(x=>x.id),['method','exam','application']);
  for(const kind of ['basic','method','exam','application'])p.handlePracticeTap(tap({kind}));
  assert.deepEqual(p.calls.map(c=>c.url),['/subpackages/note/memory/index?kind=basic','/subpackages/note/memory/index?kind=method','/subpackages/note/memory/index?kind=exam','/subpackages/note/practice/index?kind=application']);
  assert.deepEqual(p.stored,{});
  const wxml=fs.readFileSync(path.join(mini,'pages/note/index/index.wxml'),'utf8');
  for(const copy of ['每日快记','回顾公式与方法，巩固关键知识','开始快记'])assert(wxml.includes(copy));
  assert(!wxml.includes('继续快记'));
});
for(const env of ['develop','trial'])check('common-sense: '+env+' daily, four learning modes and four area shortcuts retain original routes',()=>{
  const p=load('pages/common-sense/index.js',false,{env}),old=load('pages/common-sense/index.js',true,{env});
  for(const target of [p,old]){
    for(const mode of ['daily',...target.data.features.map(x=>x.id)])target.handleFeature(tap({mode}));
    for(const part of target.data.items)target.handleItemTap(tap({targetType:'part',partId:part.id}));
  }
  assert.equal(p.calls.length,9);assert.deepEqual(p.calls,old.calls);assert.deepEqual(p.stored,old.stored);
});
for(const failStorage of [false,true])check('politics: daily projection, route cards and storage-failure behavior match baseline ('+failStorage+')',()=>{
  const p=load('pages/politics/index.js',false,{failStorage}),old=load('pages/politics/index.js',true,{failStorage});
  for(const target of [p,old]){
    target.onShow();target.handleDailyTap(tap());
    for(const goal of target.data.homeGoals)target.handleGoalTap(tap({type:goal.id}));
    target.handlePlaceholderTap(tap({feature:'favorites'}));
  }
  const current=clone(p.data), previous=clone(old.data);
  const copy={quick:['抓住主线','建立整体认知'],systematic:['按单元深入','逐步掌握'],confusion:['对比概念','厘清边界'],exam:['主动回忆','查漏补缺']};
  for(const card of current.routeCards)assert.deepEqual([card.displayLine1,card.displayLine2],copy[card.id]);
  for(const state of [current,previous])state.routeCards=state.routeCards.map(({displayLine1,displayLine2,...business})=>business);
  assert.deepEqual(current,previous);assert.deepEqual(p.calls,old.calls);assert.deepEqual(p.stored,old.stored);
});
check('politics: empty daily state keeps the existing qa fallback',()=>{
  const p=load('pages/politics/index.js');p.data.dailyCard={state:'empty'};p.handleDailyTap(tap());assert.equal(p.calls[0].url,'/subpackages/politics/practice/index?mode=qa');
});
for(const module of ['note','common-sense','politics'])check(module+': search result -> native return retains query, scope/results, rendered batch and scroll; double tap opens once',()=>{
  const rel='subpackages/'+module+'/search/index.js',p=load(rel),old=load(rel,true);
  for(const target of [p,old]){
    target.onLoad(module==='note'?{scope:'notes'}:module==='common-sense'?{moduleId:'common-sense'}:{});
    if(module==='politics')target.runSearch('中国式现代化');else { const query=module==='note'?'增长':'法律';target.setData({keyword:query});target._doSearch(query);if(target.data.hasMoreResults)target.loadMoreResults(); }
  }
  assert(p.data.results.length>0);
  const item=p.data.results[0],event=tap(module==='politics'?{pointId:item.pointId}:{pointId:item.id,moduleId:item.module.id,tabId:item.matchTabId});
  p.onPageScroll({scrollTop:380});p.handleResultTap(event);p.handleResultTap(event);old.handleResultTap(event);
  const navigations=p.calls.filter(c=>c.op==='navigate');assert.equal(navigations.length,1);
  assert.deepEqual(navigations,old.calls.filter(c=>c.op==='navigate'));
  assert.deepEqual(p.stored,old.stored);
  const before=clone(p.data);p.onShow();assert.deepEqual(clone(p.data),before);
  assert.equal(p.calls.at(-1).scrollTop,380);assert.equal(p.calls.at(-1).duration,0);
  const scrolls=p.calls.filter(c=>c.op==='scroll').length;p.onShow();assert.equal(p.calls.filter(c=>c.op==='scroll').length,scrolls);
  p.handleClear();assert.equal(p.data.keyword,'');assert.equal(p.data.results.length,0);assert.equal(p._searchViewReturnPending,false);p.onUnload();
});
for(const intent of ['definition','relation','location','recall'])check('politics: '+intent+' search retains its distinct admitted target and return snapshot',()=>{
  const p=load('subpackages/politics/search/index.js'),old=load('subpackages/politics/search/index.js',true);
  for(const target of [p,old]){target.onLoad({});target.runSearch('中国式现代化',intent);assert(target.data.results.length);target.handleResultTap(tap({pointId:target.data.results[0].pointId}));}
  assert.deepEqual(p.calls,old.calls);assert.deepEqual(p.stored,old.stored);
  const url=p.calls.find(c=>c.op==='navigate').url;
  assert(url.includes('intent='+intent));assert(url.includes('origin=search'));
  if(intent==='location')assert(url.startsWith('/subpackages/politics/map/index?'));
  if(intent==='relation')assert(url.includes('mode=relations')&&url.includes('relation='));
});
check('scope guard: no portal/tab/training/content/learning-engine or optimized article file changed',()=>{
  const changed=execFileSync('git',['diff',baseline,'--name-only','-z','--','miniprogram'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
  const allowed=new Set(modules.flatMap(m=>['js','json','wxml','wxss'].map(ext=>'miniprogram/'+m.home+'.'+ext)).concat(['note','common-sense','politics'].map(m=>'miniprogram/subpackages/'+m+'/search/index.js')));
  for(const file of ['miniprogram/components/learning-home-head/index.js','miniprogram/components/learning-home-head/index.json','miniprogram/components/learning-home-head/index.wxml','miniprogram/components/learning-home-head/index.wxss','miniprogram/styles/module-home.wxss','miniprogram/utils/module-home-navigation.js'])allowed.add(file);
  for(const name of ['book','memory','compare','route','directory','application','daily-memory','daily-common','daily-theory'])allowed.add('miniprogram/images/module-home/'+name+'.svg');
  for(const name of ['route','book','compare','memory','daily-theory','directory'])allowed.add('miniprogram/images/politics-home/'+name+'.svg');
  for(const name of ['daily-theory','all-knowledge','quick-overview','systematic-learning','concept-comparison','exam-recall'])allowed.add('miniprogram/images/politics-home/delivered-v1/'+name+'.svg');
  for(const file of changed)assert(allowed.has(file),file);
});
console.log(JSON.stringify({passed:true,baseline,checks:reports.length,reports,mode:'controller-platform-stubs-and-static-contracts',ideBuild:false,visualOrDeviceAcceptance:false},null,2));
