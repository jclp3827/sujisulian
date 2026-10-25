// Integration-only offline checks; never claims IDE, visual, or device acceptance.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),mini=path.join(root,'miniprogram'),reports=[];
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
const refs={politics:'f3ccfccfbb1b56a1934d66105f83866cc58b8dda',common:'51ae8b743d7b9d1bebe398bc63ca3652852e4588',notes:'4a863c40661e0e545cec62a34a2f42edd054428b',main:'8a4cac158cfdd36f16b30168e88ad905540d59fd',shell:'ce7d634e8383e70c5c6801e0bf3db2967f45b4c0'};
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const tabPaths=['pages/portal/index','pages/note/index/index','pages/home/index','pages/common-sense/index','pages/politics/index'];
const app=JSON.parse(fs.readFileSync(path.join(mini,'app.json'))),pages=[...app.pages,...app.subPackages.flatMap(p=>p.pages.map(n=>p.root+'/'+n))],registered=new Set(pages);
assert.deepEqual(app.tabBar.list.map(p=>p.pagePath),tabPaths);assert.equal(app.pages[0],tabPaths[0]);assert(registered.has('pages/photo/index'));assert(!tabPaths.includes('pages/photo/index'));
for(const ref of [refs.politics,refs.common,refs.notes])cp.execFileSync('git',['merge-base','--is-ancestor',ref,'HEAD'],{cwd:root});
let dependencies=0;const visited=new Set();
function config(base){if(visited.has(base))return;visited.add(base);for(const ext of ['.js','.json','.wxml','.wxss'])assert(fs.existsSync(base+ext),base+ext);const v=JSON.parse(fs.readFileSync(base+'.json'));for(const target of Object.values(v.usingComponents||{})){if(target.startsWith('plugin://'))continue;const t=target.startsWith('/')?path.join(mini,target):path.resolve(path.dirname(base),target);assert(t.startsWith(mini+path.sep),t);config(t);dependencies++;}}
pages.forEach(p=>config(path.join(mini,p)));config(path.join(mini,'custom-tab-bar/index'));for(const tab of app.tabBar.list)for(const key of ['iconPath','selectedIconPath'])if(tab[key])assert(fs.existsSync(path.join(mini,tab[key])),tab[key]);reports.push('all registered pages and transitive component files exist');
let preserved=0;
for(const [name,ref]of Object.entries(refs)){
 if(name==='shell')continue;
 const rows=cp.execFileSync('git',['ls-tree','-rz',ref],{cwd:root}).toString().split('\0').filter(Boolean);
 for(const row of rows){const [meta,rel]=row.split('\t'),expected=meta.split(' ')[2];
 const owned=name==='politics'? /^(miniprogram\/(pages\/politics\/|subpackages\/politics\/|services\/knowledge-platform\/|components\/(knowledge-card-surface|contrast-surface)\/))/.test(rel)
 :name==='common'? /^(miniprogram\/(pages\/common-sense\/|subpackages\/common-sense\/|models\/(note-common-sense|common-sense-)|services\/common-sense-))/.test(rel)
 :name==='notes'? /^(miniprogram\/(pages\/note\/|subpackages\/note\/|models\/(note-(?!common-sense)|notes-)))/.test(rel)
 :/^(miniprogram\/(pages\/photo\/|subpackages\/photo\/|pages\/training\/))/.test(rel);
 if(!owned)continue;
 let current=fs.readFileSync(path.join(root,rel));
 const selected={'miniprogram/pages/note/index/index.js':[0,1],'miniprogram/pages/common-sense/index.js':[2,3],'miniprogram/pages/politics/index.js':[3,4]};
 if(selected[rel]){const [old,next]=selected[rel];current=Buffer.from(current.toString().replace('setData({ selected: '+next+' })','setData({ selected: '+old+' })'));}
 if(['miniprogram/pages/photo/index.js','miniprogram/pages/photo/index.wxml','miniprogram/subpackages/photo/process/index.js'].includes(rel)){assert.equal(blob(current),git('rev-parse',refs.shell+':'+rel),rel);continue;}
 assert.equal(blob(current),expected,'latest owner bytes changed: '+name+' '+rel);preserved++;
 }
}
reports.push('latest module UI/business bytes retained; only explicit selected-index and approved photo navigation adapters differ');
let definition,component,calls=[],store={};const wx={setNavigationBarTitle(){},getStorageSync:k=>store[k],setStorageSync:(k,v)=>{store[k]=v;},getAccountInfoSync:()=>({miniProgram:{envVersion:'develop'}}),switchTab:v=>calls.push({op:'switch',...v}),navigateTo:v=>calls.push({op:'navigate',...v}),navigateBack:v=>calls.push({op:'back',...v}),showToast:v=>calls.push({op:'toast',...v}),nextTick:fn=>fn()};
const oldWx=global.wx;global.wx=wx;
function page(rel){const file=path.join(mini,rel+'.js');vm.runInNewContext(fs.readFileSync(file,'utf8'),{Page:v=>definition=v,require:createRequire(file),wx,getCurrentPages:()=>[],console,Date,Set,Map,setTimeout,clearTimeout},{filename:file});return{...definition,data:JSON.parse(JSON.stringify(definition.data||{})),setData(v){Object.assign(this.data,v);},getTabBar:()=>({setData:v=>calls.push({op:'selected',...v})})};}
try{
 for(const [rel,index]of tabPaths.map((p,i)=>[p,i])){calls=[];const p=page(rel);p.onLoad?.({});p.onShow?.();assert(calls.some(x=>x.op==='selected'&&x.selected===index),rel);if(rel==='pages/portal/index'){for(const m of p.data.modules){p.handleModuleTap({currentTarget:{dataset:{id:m.id}}});assert(tabPaths.includes(calls.at(-1).url.slice(1)));}p.handlePhotoTap();assert.equal(calls.at(-1).op,'navigate');assert.equal(calls.at(-1).url,'/pages/photo/index');}else if(p.handleSearchTap){p.handleSearchTap();const target=calls.at(-1).url.split('?')[0].slice(1);assert(registered.has(target),target);}}
 reports.push('offline home entry handlers select all five correct TABs and navigate to registered module/photo pages');
 const file=path.join(mini,'custom-tab-bar/index.js');vm.runInNewContext(fs.readFileSync(file,'utf8'),{Component:v=>component=v,wx});const bar={data:JSON.parse(JSON.stringify(component.data)),...component.methods};assert.deepEqual(Array.from(bar.data.list,x=>x.pagePath.slice(1)),tabPaths);calls=[];const evt=p=>({currentTarget:{dataset:{path:p}}});bar.switchTab(evt('/pages/note/index/index'));bar.switchTab(evt('/pages/note/index/index'));assert.equal(calls.length,1);calls[0].complete();bar.data.selected=1;bar.switchTab(evt('/pages/note/index/index'));assert.equal(calls.length,1);bar.switchTab(evt('/pages/politics/index'));const pending=calls.at(-1);pending.fail();pending.complete();assert.equal(bar.switching,false);assert(calls.some(x=>x.op==='toast'));bar.switchTab(evt('/pages/photo/index'));assert.equal(calls.at(-1).op,'toast');reports.push('TAB switching lock, current-page skip, failure notice/unlock and five-entry allowlist remain effective');
 let ctrl,initialized=0;const host={route:'pages/photo/index',selectComponent:()=>({_alive:true,_source:{}})},stack=[{route:'pages/portal/index'},host,{route:'subpackages/photo/process/index'}];calls=[];
 vm.runInNewContext(fs.readFileSync(path.join(mini,'subpackages/photo/process/index.js'),'utf8'),{Page:v=>ctrl=v,Date,wx,getCurrentPages:()=>stack,require:p=>p==='./controller'?{createController:()=>({onLoad(){initialized++;}})}:p.includes('files')?{createFiles(){},call(){}}:p.includes('raster')?{createRaster(){}}:{createPreviewPaid(){}}});ctrl.onLoad({});assert.equal(initialized,0);assert.equal(calls.at(-1).op,'back');assert.equal(calls.at(-1).delta,1);reports.push('photo wrapper returns to live non-TAB editor without reinitializing its owned task');
}finally{global.wx=oldWx;}
console.log(JSON.stringify({passed:true,mode:'offline-integration',registeredPages:pages.length,transitiveComponents:visited.size-pages.length,dependencies,pinnedOwnerFilesCompared:preserved,reports,realIdeBuild:false,visualOrDeviceAcceptance:false},null,2));
