const assert = require('assert/strict');
const path = require('path');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const { sha } = require(path.join(root, 'scripts/lib/notes-learning-compiler'));
const { entryResources, fingerprint } = require(path.join(root, 'miniprogram/subpackages/note/services/learning-content'));
const { compile, availableContent } = require('./lib/notes-learning-test-fixture').legacyFixture(root);
const clone = value => JSON.parse(JSON.stringify(value));
const refsFor = (tab, body) => [{subjectId:'data-analysis', pointId:'unit', tabId:tab, expectedSha256:sha(body['data-analysis'].points[0].tabs.find(t=>t.id===tab))}];
function fixture() {
  const knowledge = {id:'knowledge', blocks:[{type:'text',text:'增长因子是1+r。'}, {type:'text',text:'基期量等于现期量除以增长因子。'}]};
  const example = {type:'example',stem:'某量由100增加到120，增长率是多少？',options:[{key:'A',text:'20%'},{key:'B',text:'120%'}],answer:'A',analysis:'增长量20除以基期量100，得20%。'};
  const body = {'data-analysis':{categories:[{id:'basic'}],points:[{id:'unit',tabs:[knowledge,{id:'example',blocks:[example]}]}]}};
  const ref = refsFor('knowledge', body), exampleRefs = refsFor('example',body);
  const base = (id, refs=ref) => ({id,revision:1,status:'review',subjectId:'data-analysis',categoryId:'basic',refs:clone(refs)});
  const atoms = [0,1].map(i=>({...base(`atom-${i}`),label:`知识${i+1}`,statement:knowledge.blocks[i].text,conditions:['比较口径一致。'],misconceptions:['不混淆基期与现期。'],sourceAnchors:[{subjectId:'data-analysis',pointId:'unit',tabId:'knowledge',blockIndex:i,expectedBlockSha256:sha(knowledge.blocks[i])}]}));
  const common = id => ({...base(id),primaryTargetIds:['target'],supportingTargetIds:[],sourceKind:'authored',familyId:`family-${id}`,exposureGroupId:`exposure-${id}`,answerMode:'single-choice',prompt:'应如何判断？',options:[{key:'A',text:'正确知识'},{key:'B',text:'待辨误区'}],answer:'A',explanation:'区分知识与误区。',distractorReasons:{B:'混淆知识边界。'}});
  const source = {schemaVersion:1,version:'nq-contract-probe',targets:[{...base('target'),statement:'辨认关系。',conclusion:'根据条件使用关系。',conditions:['条件一致。'],excludes:['不代表全节掌握。']}],questions:[
    {...common('basic'),exerciseKinds:['basic'],prompt:'增长因子的知识表达是哪一项（1+r）？',assessment:{taskType:'recall',knowledgeAtomIds:['atom-0'],requiresCalculation:false}},
    {...common('method'),exerciseKinds:['method'],methodIntent:'compare-knowledge',signal:'直接给出两个知识。',boundary:'只比较关系，不计算。',assessment:{taskType:'contrast',knowledgeAtomIds:['atom-0','atom-1'],comparisonGroupId:'group',requiresCalculation:false}},
    {...common('application'),refs:clone([...ref,...exampleRefs]),exerciseKinds:['application'],sourceKind:'legacy-unverified',origin:{subjectId:'data-analysis',pointId:'unit',tabId:'example',expectedBlockSha256:sha(example)},originTask:{verified:true,statement:'求增长率。',evidence:'原stem明确提问增长率。'},assessment:{taskType:'complete-application',knowledgeAtomIds:[],requiresCalculation:true}}
  ],recipes:[{...base('recipe'),primaryTargetIds:['target'],supportingTargetIds:[],exerciseKinds:['basic'],sectionId:'data-analysis',generatorId:'growth-pre',generatorVersion:'legacy-data-analysis-v1'}],materials:[],knowledgeAtoms:atoms,comparisonGroups:[{...base('group'),knowledgeAtomIds:['atom-0','atom-1'],difference:'增长因子是关系量，基期量是原值。',conditions:['口径一致。'],misconceptions:['不把增长因子当作增长率。']}],sourceReviews:[{id:'review-knowledge',revision:1,status:'review',ref:clone(ref[0])},{id:'review-example',revision:1,status:'review',ref:clone(exampleRefs[0])}],entryPlans:{basic:{resourceIds:['basic']},method:{resourceIds:['method']},application:{resourceIds:['application']}}};
  return {source,body};
}
const checks = [];
function check(name, fn) { fn(); checks.push(name); }
function invalid(mutate, pattern) { const {source,body}=fixture(); mutate(source,body); assert.throws(()=>compile(source,body),pattern); }
check('direct formula comparison needs no novel situation; formula recall may contain numbers',()=>{const {source,body}=fixture();const content=availableContent(body,compile(source,body),true); assert.equal(content.resources.length,3);assert.equal(entryResources(content,'method')[0].comparison.knowledge.length,2);});
check('review-only resources never enter release',()=>{const {source,body}=fixture();assert.equal(availableContent(body,compile(source,body),false).resources.length,0);});
check('calculation flag blocks basic recall',()=>invalid(s=>s.questions[0].assessment.requiresCalculation=true,/入口检测目的/));
check('basic cannot be an active comparison',()=>invalid(s=>s.questions[0].assessment.taskType='contrast',/入口检测目的/));
check('knowledge recall must bind a single knowledge atom',()=>invalid(s=>s.questions[0].assessment.knowledgeAtomIds.push('atom-1'),/入口检测目的/));
check('training recipe can remain archived but never enter a notes entry',()=>invalid(s=>s.entryPlans.basic.resourceIds.push('recipe'),/入口检测目的/));
check('bounded trial requires a current decision point',()=>invalid(s=>s.questions[1].assessment.taskType='bounded-trial',/决策点/));
check('contrast requires a comparison group',()=>invalid(s=>delete s.questions[1].assessment.comparisonGroupId,/方法题/));
check('comparison group requires two distinct knowledge identities',()=>invalid(s=>s.comparisonGroups[0].knowledgeAtomIds=['atom-0','atom-0'],/对照对象/));
check('knowledge atom source block hash is guarded',()=>invalid(s=>s.knowledgeAtoms[0].sourceAnchors[0].expectedBlockSha256='bad',/来源块/));
check('application cannot be replaced by an authored full question',()=>invalid(s=>delete s.questions[2].origin,/入口检测目的/));
check('application requires explicit task verification',()=>invalid(s=>delete s.questions[2].originTask,/入口检测目的/));
check('original application content is derived, not duplicated authority',()=>{const {source,body}=fixture();source.questions[2].prompt='untrusted duplicate';const pack=compile(source,body);assert.match(pack.questions.find(q=>q.id==='application').prompt,/由100增加到120/);});
check('neutral display completion must include its adaptation record',()=>invalid(s=>s.questions[2].originAdaptation={kind:'neutral-display-completion',instruction:'选择正确答案。'},/展示补全/));
check('neutral completion preserves original block identity and explicitly changes prompt',()=>{const {source,body}=fixture();source.questions[2].originAdaptation={kind:'neutral-display-completion',instruction:'请选择正确答案。',reason:'仅补中性的单项选择显示说明。'};const q=compile(source,body).questions.find(q=>q.id==='application');assert.match(q.prompt,/^请选择正确答案。\n/);assert.equal(q.originalExampleFingerprint,fingerprint(body['data-analysis'].points[0].tabs[1].blocks[0]));});
check('display completion cannot replace a missing source stem',()=>invalid((s,b)=>{const tab=b['data-analysis'].points[0].tabs[1];tab.blocks[0].stem='';s.questions[2].origin.expectedBlockSha256=sha(tab.blocks[0]);for(const ref of [...s.targets[0].refs,...s.questions[2].refs,s.sourceReviews[1].ref])if(ref.tabId==='example')ref.expectedSha256=sha(tab);s.questions[2].originAdaptation={kind:'neutral-display-completion',instruction:'请选择正确答案。',reason:'中性说明。'};},/题干缺失/));
check('runtime independently rejects calculation and recipe re-entry',()=>{const {source,body}=fixture();const pack=compile(source,body);pack.questions.find(q=>q.id==='basic').assessment.requiresCalculation=true;pack.entryPlans.basic.resourceIds.push('recipe');const c=availableContent(body,pack,true);assert.equal(entryResources(c,'basic').length,0);assert(!c.resources.some(r=>r.resourceType==='recipe'));});
check('source drift removes only resources depending on that source',()=>{const {source,body}=fixture();const pack=compile(source,body);body['data-analysis'].points[0].tabs[1].blocks[0].stem+='变更';const c=availableContent(body,pack,true);assert.deepEqual(c.resources.map(r=>r.id).sort(),['basic','method']);});
check('blocking a shared atom removes dependent basic/method, keeps independent original application',()=>{const {source,body}=fixture();const pack=compile(source,body);pack.knowledgeAtoms[0].status='blocked';const c=availableContent(body,pack,true);assert.deepEqual(c.resources.map(r=>r.id),['application']);});
check('comparison revision changes only its dependent resource assessment fingerprint',()=>{const {source,body}=fixture();const old=availableContent(body,compile(source,body),true);source.comparisonGroups[0].revision+=1;source.comparisonGroups[0].difference+='补充边界。';const updated=availableContent(body,compile(source,body),true);for(const id of ['basic','application'])assert.equal(old.resources.find(r=>r.id===id).assessmentFingerprint,updated.resources.find(r=>r.id===id).assessmentFingerprint);assert.notEqual(old.resources.find(r=>r.id==='method').assessmentFingerprint,updated.resources.find(r=>r.id==='method').assessmentFingerprint);});
console.log(JSON.stringify({passed:true,checks:checks.length,reports:checks},null,2));
