const assert = require('assert/strict');
const path = require('path');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const load = p => require(path.join(root, p));
const { availableContent, entryResources } = load('miniprogram/subpackages/note/services/learning-content');
const { createEngine, STORAGE_KEY } = load('miniprogram/subpackages/note/services/practice-session');
const catalog = load('miniprogram/subpackages/note/models/note-catalog');
const pack = load('miniprogram/subpackages/note/models/learning-pack');
const frozen = load('docs/knowledge-platform/implementations/evidence/notes-learning-exam-v4-frozen-state-20261022.json').content;
const ledger = load('docs/knowledge-platform/implementations/notes-learning-exam-v4-candidates.json');
const clone = v => JSON.parse(JSON.stringify(v));
const current = availableContent(catalog, pack, true);
const denied = ledger.questions.filter(q => q.priorUserSignal === 'reject-current-form');
assert.equal(denied.length, 7);
assert.equal(frozen.resources.length, 64);
const store = () => ({ data: { unrelatedModule: { original: true } }, getStorageSync(k) { return clone(this.data[k] || null); }, setStorageSync(k,v) { this.data[k] = clone(v); } });
let serial = 0;
const engine = (c,s) => createEngine(c,s,()=>1,()=>`isolation-${++serial}`);
const selected = (c,kind,ids) => { const copy=clone(c); copy.entryPlans[kind].resourceIds=ids; return copy; };
const reports=[];
for (const q of denied) {
  const kind=q.actualExerciseKinds[0], storage=store();
  const old=engine(selected(frozen,kind,[q.questionId]),storage);
  const s=old.start({kind,fresh:true}).session; assert(s);
  old.selection(s.id,s.items[0].answer); old.submit(s.id);
  const persisted=clone(storage.data);
  assert(!current.resources.some(r=>r.id===q.questionId));
  for (const scope of [{}, {subjectId:q.moduleId}, {subjectId:q.moduleId,categoryId:q.categoryId}, {subjectId:q.moduleId,pointId:q.sourceBindings[0].pointId}]) {
    assert(!entryResources(current,kind,scope).some(r=>r.id===q.questionId));
  }
  const updated=engine(current,storage);
  assert.equal(updated.getSession(s.id),null);
  assert.equal(updated.resume(kind),null);
  assert.equal(updated.start({kind}).expired,true);
  assert.throws(()=>updated.selection(s.id,'A'),/内容已更新/);
  assert.throws(()=>updated.submit(s.id),/内容已更新/);
  assert.deepEqual(storage.data,persisted);
  assert.equal(storage.data[STORAGE_KEY].sessions[s.id].answers[s.items[0].instanceId].outcome,'correct');
  reports.push({questionId:q.questionId,notSelectable:true,oldActiveSessionExpired:true,pastAnswersPreserved:true});
}
let unaffected=0;
for (const kind of ['basic','method','application']) {
  const resource=current.resources.find(r=>r.exerciseKinds.includes(kind)&&(!pack.semanticPolicy||r.legacyCompatibility)&&frozen.resources.some(old=>old.id===r.id));
  if (!resource) continue;
  const storage=store(), old=engine(selected(frozen,kind,[resource.id]),storage);
  const s=old.start({kind,fresh:true}).session; assert(s);
  old.selection(s.id,s.items[0].answer);
  const persisted=clone(storage.data),updated=engine(current,storage);
  assert.equal(updated.getSession(s.id)?.id,s.id);
  assert.deepEqual(storage.data,persisted);unaffected++;
}
const storage=store(), mixed=engine(selected(frozen,'basic',[denied[0].questionId,'notes-q-da-basic-0001']),storage);
const group=mixed.start({kind:'basic',fresh:true}).session;assert.equal(group.items.length,2);
const originalState=clone(storage.data);assert.equal(engine(current,storage).getSession(group.id),null);assert.deepEqual(storage.data,originalState);
console.log(JSON.stringify({passed:true,withdrawn:reports.length,currentDevelopment:current.resources.length,unaffectedKindsResumed:unaffected,mixedGroupExpiredWithoutDeletion:true,persistentUserStateTouched:false,reports},null,2));
