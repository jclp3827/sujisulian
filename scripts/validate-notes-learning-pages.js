#!/usr/bin/env node
const assert = require('assert/strict');
const fs = require('fs'); const path = require('path'); const vm = require('vm'); const { createRequire } = require('module');
const root = path.resolve(__dirname, '..'), mini = path.join(root, 'miniprogram');
const catalog = require('../miniprogram/subpackages/note/models/note-catalog');
const { buildDirectory, detailUrl } = require('../miniprogram/subpackages/note/services/note-directory');
const { resolveDisplayTab } = require('../miniprogram/subpackages/note/services/note-presentation');
const { fixture } = require('./validate-notes-learning-v4-semantic');
const frozen = require('../docs/knowledge-platform/implementations/evidence/notes-learning-exam-v4-frozen-state-20261022.json');
const rejected = new Set(require('../docs/knowledge-platform/implementations/notes-learning-exam-v4-candidates.json').questions.filter(q=>q.priorUserSignal==='reject-current-form').map(q=>q.questionId));
const fixturePack = fixture(frozen.content.resources.filter(q=>!rejected.has(q.id)).map(q=>q.id)).pack;
const runtimeFile = path.join(mini,'subpackages/note/services/practice-runtime.js');
function runtimeFor(pack){const runtimeModule={exports:{}},runtimeRequire=createRequire(runtimeFile);vm.compileFunction(fs.readFileSync(runtimeFile,'utf8'),['require','module','exports'],{filename:runtimeFile})(p=>runtimeRequire.resolve(p).endsWith('/note/models/learning-pack-runtime.js')?pack:runtimeRequire(p),runtimeModule,runtimeModule.exports);return runtimeModule.exports;}
const fixtureRuntime=runtimeFor(fixturePack);
const factories = new Map();
const clone = (v) => JSON.parse(JSON.stringify(v)); const event = (dataset) => ({ currentTarget: { dataset } });
function page(rel, stored = {}, extra = {}) {
  const filename = path.join(mini, rel); let config; const calls = []; let p;
  const wx = { setNavigationBarTitle() {}, getStorageSync: (k) => clone(stored[k] || null), setStorageSync: (k, v) => { if (stored.__fail) throw Error("fixture storage failure"); stored[k] = clone(v); },
    getAccountInfoSync: () => ({ miniProgram: { envVersion: extra.env || "develop" } }), nextTick: (fn) => fn(),
    navigateBack: (v) => calls.push({ op: "back", ...v }), redirectTo: (v) => calls.push({ op: "redirect", ...v }),
    removeStorageSync: (k) => { delete stored[k]; }, showModal: (v) => v.success({ confirm: false }),
    navigateTo: (v) => calls.push({ op: 'navigate', ...v }), switchTab: (v) => calls.push({ op: 'switch', ...v }), showToast: (v) => calls.push({ op: 'toast', ...v }),
    pageScrollTo: (v) => calls.push({ op: 'scroll', ...v }), createSelectorQuery: () => {
      calls.push({ op: 'query', renderCount: p.data.renderCount });
      const q = { select: () => q, selectViewport: () => q, boundingClientRect: () => q, scrollOffset: () => q,
        exec: (fn) => fn([{ top: 80 }, { scrollTop: 0 }]) }; return q;
    } };
  if (!factories.has(filename)) factories.set(filename, vm.compileFunction(fs.readFileSync(filename, 'utf8'), ['require', 'Page', 'wx', 'console', 'getCurrentPages', 'setTimeout', 'clearTimeout'], { filename }));
  const actualRequire=createRequire(filename);
  const pageRequire = request => {
    const resolved=actualRequire.resolve(request);
    if(!extra.realPack&&resolved===runtimeFile)return extra.fixturePack?runtimeFor(extra.fixturePack):fixtureRuntime;
    if(!extra.realPack&&resolved.endsWith('/note/models/learning-pack-runtime.js'))return extra.fixturePack||fixturePack;
    return actualRequire(request);
  };
  factories.get(filename)(pageRequire, (v) => { config = v; }, wx, console, () => extra.stack || [], () => 0, () => {});
  p = { ...config, data: clone(config.data), calls, setData(values, done) { Object.assign(this.data, values); if (done) done(); } };
  if (p.resolveActiveBlockImages) p.resolveActiveBlockImages = () => {};
  return p;
}
const reports = [], tests = []; function test(name, fn) { tests.push({name, fn}); }
const directory = buildDirectory();
test('all five subjects and 162 points have exactly one primary route', () => {
  assert.equal(directory.length, 5); const keys = [];
  for (const subject of directory) for (const category of subject.categories) for (const point of category.points) {
    keys.push(`${subject.id}:${point.id}`); assert(detailUrl({ subjectId: subject.id, pointId: point.id }));
  }
  assert.equal(keys.length, 162); assert.equal(new Set(keys).size, 162);
});
test('homepage adds a basic-card review entry and keeps exam, method and application routes', () => {
  const p = page('pages/note/index/index.js'); p.onLoad(); assert.equal(p.data.totalPointCount, 162);
  assert.deepEqual(p.data.modes.map((m) => m.id), ['basic', 'review', 'method', 'application', 'exam']);
  assert.deepEqual(p.data.otherModes.map((m) => m.title), ['笔记回顾', '方法判断', '公考真题', '考前急救']);
  for (const kind of ['basic', 'method', 'exam', 'application']) {
    p.handlePracticeTap(event({ kind }));
    assert.equal(p.calls.at(-1).url, `/subpackages/note/${kind === 'application' ? 'practice' : 'memory'}/index?kind=${kind}`);
  }
  p.handlePracticeTap(event({ kind: 'review' }));
  assert.equal(p.calls.at(-1).url, '/subpackages/note/memory/index?kind=basic');
  p.handleDirectoryTap(); assert.equal(p.calls.at(-1).url, '/subpackages/note/directory/index');
  p.handleInput({ detail: { value: '基期量' } }); p.handleSearchTap(); assert(p.calls.at(-1).url.includes('keyword='));
});
test('home application entry uses existing original tasks and resumes answers without writing memory state', () => {
  const memory = { retained: 'accepted memory-card progress' }, storage = { 'notesMemory:v5:state': memory };
  const home = page('pages/note/index/index.js', storage); home.handlePracticeTap(event({ kind: 'application' }));
  const url = home.calls.at(-1).url, options = Object.fromEntries(new URLSearchParams(url.split('?')[1]));
  const p = page('subpackages/note/practice/index.js', storage, { realPack: true }); p.onLoad(options);
  assert.equal(p.data.kind, 'application'); assert.equal(p.data.state, 'question');
  const applications = p.runtime.content.resources.filter(q => q.exerciseKinds.includes('application'));
  assert(applications.length > 0); assert(applications.every(q => q.origin && q.assessment.taskType === 'complete-application'));
  const sessionId = p.data.sessionId, instanceId = p.data.card.instanceId;
  p.handleChoice(event({ key: p.data.card.answer })); p.handleSubmit(); assert.equal(p.data.answer.outcome, 'correct');
  const restored = page('subpackages/note/practice/index.js', storage, { realPack: true }); restored.onLoad(options);
  assert.equal(restored.data.sessionId, sessionId); assert.equal(restored.data.card.instanceId, instanceId);
  assert.equal(restored.data.answer.outcome, 'correct'); assert.deepEqual(storage['notesMemory:v5:state'], memory);
});
test('same-page subject/topic selection restores independently of other modules', () => {
  const storage = { 'unrelated-module': { retained: true } }, p = page('subpackages/note/directory/index.js', storage); p.onLoad({});
  p.handleSubject(event({ id: 'quantity' })); p.handleCategory(event({ id: 'travel' }));
  assert.equal(p.data.categoryId, 'travel'); assert(p.data.sections.every((s) => s.id === 'travel'));
  const restored = page('subpackages/note/directory/index.js', storage); restored.onLoad({});
  assert.equal(restored.data.subjectId, 'quantity'); assert.equal(restored.data.categoryId, 'travel');
  assert.deepEqual(storage['unrelated-module'], { retained: true });
  const invalid = page('subpackages/note/directory/index.js'); invalid.onLoad({ subjectId: 'missing' }); assert(invalid.data.error);
});
test('all existing detail source tabs resolve including quantity merged examples without mutating source', () => {
  let count = 0, remapped = 0;
  for (const subject of directory) for (const point of catalog.getNotePoints(subject.id)) {
    const before = JSON.stringify(point);
    for (const tab of point.tabs) {
      const display = resolveDisplayTab(subject.id, point, tab.id); assert(display, `${subject.id}/${point.id}/${tab.id}`);
      const p = page('subpackages/note/detail/index.js'); p.onLoad({ moduleId: subject.id, pointId: point.id, tabId: tab.id });
      assert.equal(p.data.activeTab, display.id); assert.equal(p.data.sourceError, ''); count += 1; if (display.id !== tab.id) remapped += 1;
    }
    assert.equal(JSON.stringify(point), before);
  }
  assert.equal(count, 281); assert.equal(remapped, 14);
});
test('unknown point and unknown tab are explicit and never load another note', () => {
  for (const options of [{ moduleId: 'data-analysis', pointId: 'missing' }, { moduleId: 'data-analysis', pointId: 'base-period', tabId: 'missing' }]) {
    const p = page('subpackages/note/detail/index.js'); p.onLoad(options); assert(p.data.sourceError); assert.equal(p.data.point, null);
  }
  assert.equal(detailUrl({ subjectId: 'data-analysis', pointId: 'base-period', tabId: 'missing' }), null);
});
test('five-subject search carries an actual matching source tab and obeys range', () => {
  for (const [id, query] of [['data-analysis', '基期量'], ['quantity', '鸡兔同笼'], ['logic', '因果'], ['verbal', '词语辨析'], ['graphic', '对称']]) {
    const p = page('subpackages/note/search/index.js'); p.onLoad({ moduleId: id, keyword: query });
    assert(p.data.results.length); const first = p.data.results[0];
    assert(first.matchTabId); assert(p.data.results.every((r) => r.module.id === id));
    p.handleResultTap(event({ moduleId: id, pointId: first.id, tabId: first.matchTabId })); assert(p.calls.at(-1).url.includes('tabId='));
  }
  const invalid = page('subpackages/note/search/index.js'); invalid.onLoad({ moduleId: 'data-analysis', categoryId: 'missing' });
  invalid._doSearch('增长'); assert.equal(invalid.data.results.length, 0); assert.equal(invalid.data.scopeInvalid, true);
});
test('anchor beyond lazy-render limit is rendered before layout lookup', () => {
  let sample;
  for (const subject of directory) for (const point of catalog.getNotePoints(subject.id)) {
    const p = page('subpackages/note/detail/index.js'); p.onLoad({ moduleId: subject.id, pointId: point.id });
    if (p.data.activeBlocks.length > 8) { sample = p; break; }
  }
  assert(sample); sample.handleSectionAnchorTap(event({ anchor: sample.data.activeBlocks[8].anchorId }));
  assert.equal(sample.calls.find((c) => c.op === 'query').renderCount, 9);
});
test('basic page -> concrete note -> native return preserves answer, stage and scroll', () => {
  const storage = {}, p = page('subpackages/note/practice/index.js', storage); p.onLoad({ kind: 'basic' });
  assert.equal(p.data.state, 'question'); assert.equal(p.data.total, 5);
  const instance = p.data.card.instanceId;
  p.handleChoice(event({ key: p.data.card.answer })); p.onPageScroll({ scrollTop: 180 });
  p.handleSource(event({ index: 0 })); const target = new URL(p.calls.at(-1).url, 'https://local.invalid');
  const detail = page('subpackages/note/detail/index.js', storage, { stack: [{ route: 'subpackages/note/practice/index', data: p.data }, { route: 'subpackages/note/detail/index', data: {} }] });
  detail.onLoad(Object.fromEntries(target.searchParams)); assert.equal(detail.handlePracticeReturn, undefined);
  assert.equal(detail.data.practiceReturnLabel, undefined); // The native back action resumes the existing parent page below.
  p.onShow(); assert.equal(p.data.card.instanceId, instance); assert.equal(p.data.draftValue, p.data.card.answer);
  assert.equal(p.calls.at(-1).scrollTop, 180);
  p.handleSubmit(); assert.equal(p.data.answer.outcome, 'assisted'); assert.equal(p.data.index, 1);
  p.handleNext(); assert.equal(p.data.index, 2);
});
test('method comparison reads and reloads without grading until the user submits', () => {
  const storage = {}, p = page('subpackages/note/practice/index.js', storage); p.onLoad({ kind: 'method' });
  const instance=p.data.card.instanceId, prompt=p.data.card.prompt; assert(p.data.card.comparison);
  assert.equal(p.data.answer.comparisonRead,undefined);p.handleComparison();assert.equal(p.data.answer.comparisonRead,true);
  assert.equal(p.data.answer.outcome,undefined);assert.equal(p.data.result.correct,0);
  p.handleChoice(event({key:p.data.card.answer}));p.handleSubmit();assert.equal(p.data.answer.outcome,'assisted');
  p.onPageScroll({scrollTop:210});p.onHide();const reopened=page('subpackages/note/practice/index.js',storage);
  reopened.onLoad({kind:'method',sessionId:p.data.sessionId});assert.equal(reopened.data.card.instanceId,instance);
  assert.equal(reopened.data.card.prompt,prompt);assert.equal(reopened.data.answer.outcome,'assisted');assert.equal(reopened.calls.at(-1).scrollTop,210);
});
test('settings preserve active group and an empty next range can be changed into a working range', () => {
  const storage = {}, p = page('subpackages/note/practice/index.js', storage); p.onLoad({ kind: 'basic' });
  const frozen = p.activeSession.items.map(i => i.instanceId); p.handleSettings();
  const emptySubject = p.data.subjects.findIndex(s => s.id === 'graphic'); p.handleSubjectChange({ detail: { value: String(emptySubject) } });
  p.handleTopicChange({detail:{value:String(p.data.topics.findIndex(t=>t.id==='position'))}});
  p.handleCount(event({ count: 10 })); p.handleSaveSettings(); assert.deepEqual(p.activeSession.items.map(i => i.instanceId), frozen);
  while (p.data.state === 'question') p.handleSkip(); p.handleFresh(); assert.equal(p.data.state, 'empty');
  p.handleSettings(); const data = p.data.subjects.findIndex(s => s.id === 'data-analysis'); p.handleSubjectChange({ detail: { value: String(data) } });
  p.handleCount(event({ count: 5 })); p.handleSaveSettings(); assert.equal(p.data.state, 'question');
});
test('application settings refresh immediately and retain the previous round on failed save', () => {
  const storage = {}, p = page('subpackages/note/practice/index.js', storage, { realPack: true }); p.onLoad({ kind: 'application' });
  const firstId = p.data.sessionId, firstCard = p.data.card.instanceId;
  p.handleSettings(); assert.equal(p.data.settingsOpen, true);
  const logicIndex = p.data.subjects.findIndex(s => s.id === 'logic');
  p.handleSubjectChange(event({ index: logicIndex })); assert.equal(p.data.subjects[p.data.draftSubjectIndex].id, 'logic');
  p.handleTopicChange(event({ index: 1 })); assert.equal(p.data.draftTopicIndex, 1);
  p.handleSubjectChange(event({ index: 0 })); assert.equal(p.data.draftTopicIndex, 0);
  p.handleCount(event({ count: 10 })); p.handleSaveSettings();
  assert.equal(p.data.settingsOpen, false); assert.equal(p.data.state, 'question');
  assert.notEqual(p.data.sessionId, firstId); assert.equal(p.data.index, 1);
  assert.equal(p.data.total, Math.min(10, p.runtime.content.resources.filter(q => q.exerciseKinds.includes('application')).length));
  assert(p.data.notice.includes('刷新')); assert.equal(p.runtime.engine.getSession(firstId).items[0].instanceId, firstCard);
  const currentId = p.data.sessionId; p.handleSettings(); storage.__fail = true; p.handleSaveSettings();
  assert.equal(p.data.settingsOpen, true); assert.equal(p.data.sessionId, currentId);
  storage.__fail = false; p.handleSaveSettings(); assert.equal(p.data.settingsOpen, false); assert.notEqual(p.data.sessionId, currentId);
});
test('trial cannot consume review questions and failed save never navigates away', () => {
  const trial = page('subpackages/note/practice/index.js', {}, { env: 'trial' }); trial.onLoad({ kind: 'basic' });
  assert.equal(trial.data.state, 'empty'); assert.equal(trial.data.card, null);
  const storage = {}, p = page('subpackages/note/practice/index.js', storage); p.onLoad({ kind: 'basic' });
  storage.__fail = true; p.handleSource(event({ index: 0 }));
  assert(!p.calls.some(c => c.op === 'navigate')); assert(p.data.notice.includes('暂未保存')); assert.equal(p.data.state, 'question');
});
test('all legacy note training links use the proper generic or standalone destination', () => {
  const expected = { 'estimation-split': '/pages/training/estimation/index', 'assumption-tree': '/pages/training/assumption/index', 'ratio-sense': '/pages/training/ratio-sense/index' };
  let count = 0;
  for (const subject of directory) for (const point of catalog.getNotePoints(subject.id)) if (point.relatedTraining) {
    const p = page('subpackages/note/detail/index.js'); p.onLoad({ moduleId: subject.id, pointId: point.id }); p.handleTrainingTap();
    const destination = new URL(p.calls.at(-1).url, 'https://local.invalid').pathname;
    assert.equal(destination, expected[point.relatedTraining.itemId] || '/pages/training/session/index'); count += 1;
  }
  assert.equal(count, 30);
});
test('method intent and source lookup use their own page session without replacing basic', () => {
  const storage = {}, basic = page('subpackages/note/practice/index.js', storage), method = page('subpackages/note/practice/index.js', storage);
  basic.onLoad({ kind: 'basic' }); const basicId = basic.data.sessionId;
  method.onLoad({ kind: 'method' }); assert.equal(method.data.state, 'question'); assert(method.data.card.methodIntent);
  method.handleChoice(event({ key: method.data.card.answer })); method.handleSubmit(); assert.equal(method.data.answer.outcome, 'correct');
  method.handleSource(event({ index: 0 })); assert(method.calls.at(-1).url.includes('pointId='));
  basic.onShow(); assert.equal(basic.data.sessionId, basicId); assert.equal(basic.data.index, 1);
});
test('application example reveal is recorded before future practice and survives returning from its original tab', () => {
  const storage={}, detail=page('subpackages/note/detail/index.js',storage);
  detail.onLoad({moduleId:'data-analysis',pointId:'growth-rate',tabId:'example'});
  const blockIndex=detail.data.activeBlocks.findIndex(b=>b.type==='example'&&b.options);
  assert(blockIndex>=0); detail.handleExampleExposure({detail:{blockIndex}});
  const p=page('subpackages/note/practice/index.js',storage);p.onLoad({kind:'application',subjectId:'data-analysis',categoryId:'growth',pointId:'growth-rate'});
  assert.equal(p.data.total,1);assert.equal(p.data.card.sourceKind,'legacy-unverified');
  p.handleChoice(event({key:p.data.card.answer}));p.handleSubmit();assert.equal(p.data.answer.outcome,'assisted');
  p.onPageScroll({scrollTop:320});p.onHide();const again=page('subpackages/note/practice/index.js',storage);again.onLoad({kind:'application',sessionId:p.data.sessionId});
  assert.equal(again.data.answer.outcome,'assisted');assert.equal(again.calls.at(-1).scrollTop,320);
});
test('detail has no added return or point/topic launch controls; home still opens application practice', () => {
  const template=fs.readFileSync(path.join(mini,'subpackages/note/detail/index.wxml'),'utf8');
  assert(!/memoryReturnLabel|practiceReturnLabel|practiceLinks|handlePracticeLaunch|handleMemoryReturn|handlePracticeReturn/.test(template));
  assert(template.includes('handleTrainingTap')); assert(template.includes('activeTab'));
  for(const env of ['develop','trial']){
    const detail=page('subpackages/note/detail/index.js',{}, {env});detail.onLoad({moduleId:'data-analysis',pointId:'growth-rate'});
    assert.equal(detail.data.practiceLinks,undefined);assert.equal(detail.handlePracticeLaunch,undefined);
  }
  const home=page('pages/note/index/index.js');home.handlePracticeTap(event({kind:'application'}));
  assert.equal(home.calls.at(-1).url,'/subpackages/note/practice/index?kind=application');
});
test('completed display instructions retain original note identity and exact return navigation',()=>{
  const storage={},p=page('subpackages/note/practice/index.js',storage);
  p.onLoad({kind:'application',subjectId:'verbal',categoryId:'cloze',pointId:'logic-correspondence'});
  assert.equal(p.data.total,2);assert.equal(p.data.card.originAdaptation.kind,'neutral-display-completion');
  assert(p.data.card.prompt.startsWith(p.data.card.originAdaptation.instruction+'\n'));
  p.handleChoice(event({key:p.data.card.answer}));p.handleSource(event({index:p.data.card.refs.findIndex(r=>r.tabId==='example')}));
  const u=new URL(p.calls.at(-1).url,'https://local.invalid');assert.equal(u.searchParams.get('pointId'),'logic-correspondence');assert.equal(u.searchParams.get('tabId'),'example');
  p.onShow();assert.equal(p.data.draftValue,p.data.card.answer);p.handleSubmit();assert.equal(p.data.answer.outcome,'assisted');
});
test('image failures cannot score; retries preserve instance and ignore earlier load callbacks', async () => {
  const { createEngine }=require('../miniprogram/subpackages/note/services/practice-session');
  const { createPractice }=require('../miniprogram/subpackages/note/services/practice-runtime');
  const storage={}, p=page('subpackages/note/practice/index.js',storage);p.onLoad({kind:'application'});
  const c=clone(p.runtime.content),q=c.resources.find(q=>q.id===p.data.card.resourceId);c.entryPlans.application.resourceIds=[q.id];q.images=[{id:'image',src:'graphic/fixture.png',role:'option',optionKey:'A'}];
  const adapter={getStorageSync:k=>clone(storage[k]||null),setStorageSync:(k,v)=>storage[k]=clone(v)};
  p.runtime={...p.runtime,engine:createEngine(c,adapter)};const s=p.runtime.engine.start({kind:'application',fresh:true}).session;p.render(s);await new Promise(resolve=>setImmediate(resolve));
  const instance=p.data.card.instanceId,gen=p.imageGeneration;p.handleChoice(event({key:p.data.card.answer}));p.handleSubmit();assert(!p.data.answer.outcome);assert(p.data.notice.includes('图片'));
  p.handleImageError(event({id:'image',instance,generation:gen}));assert(p.data.imagesFailed);p.handleRetryImages();await new Promise(resolve=>setImmediate(resolve));
  p.handleImageLoad(event({id:'image',instance,generation:gen}));assert.equal(p.data.imagesReady,false);
  p.handleImageLoad(event({id:'image',instance,generation:p.imageGeneration}));assert.equal(p.data.imagesReady,true);p.handleSubmit();assert.equal(p.data.answer.outcome,'correct');assert.equal(p.data.card.instanceId,instance);
});
test('historical shared-source groups retain exact origin and recovery through the legacy controller',()=>{
 const f=require('./validate-notes-learning-v4-shared').sharedFixture(),storage={},extra={fixturePack:f.pack};
 const options={kind:'basic',subjectId:'logic',categoryId:'all',pointId:f.ref.pointId,scopeMode:'exact-source-point',sourceSubjectId:'logic'};
 const p=page('subpackages/note/practice/index.js',storage,extra);p.onLoad(options);assert.equal(p.data.state,'question');assert.equal(p.data.card.subjectId,'graphic');p.handleChoice(event({key:p.data.card.answer}));p.onPageScroll({scrollTop:155});p.handleSource(event({index:0}));const url=new URL(p.calls.at(-1).url,'https://fixture.invalid');assert.equal(url.searchParams.get('moduleId'),'logic');assert.equal(url.searchParams.get('pointId'),f.ref.pointId);assert.equal(url.searchParams.get('tabId'),'knowledge');const sessionId=p.data.sessionId;p.onShow();assert.equal(p.data.sessionId,sessionId);assert.equal(p.data.draftValue,p.data.card.answer);assert.equal(p.calls.at(-1).scrollTop,155);
});
test('actual V4 package reflects current eligible content without archived fallback',()=>{
 const actualPack=require('../miniprogram/subpackages/note/models/learning-pack'),actualContent=require('../miniprogram/subpackages/note/services/learning-content').availableContent(catalog,actualPack,true);
 for(const kind of ['basic','method','application']){const storage={'other-module':{preserved:true}},p=page('subpackages/note/practice/index.js',storage,{realPack:true});p.onLoad({kind});if(actualContent.resources.some(q=>q.exerciseKinds.includes(kind))){assert.equal(p.data.state,'question');assert(p.data.card.semanticAdmission);}else{assert.equal(p.data.state,'empty');assert.equal(p.data.card,null);}p.handleDirectory();assert.equal(p.calls.at(-1).url,'/subpackages/note/directory/index');assert.deepEqual(storage['other-module'],{preserved:true});}
 const detail=page('subpackages/note/detail/index.js',{}, {realPack:true});detail.onLoad({moduleId:'data-analysis',pointId:'growth-rate'});assert.equal(detail.data.practiceLinks,undefined);assert.equal(detail.data.activeTab,'knowledge');
});
(async()=>{for(const {name,fn} of tests){await fn();reports.push(name);}console.log(JSON.stringify({ passed: true, scope: 'V5 entry and preserved V4 legacy page behavior with explicit fixtures; no real content acceptance', checks: reports.length, reports, deviceOrVisualAcceptance: false }, null, 2));})().catch(e=>{console.error(e);process.exitCode=1;});
