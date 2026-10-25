#!/usr/bin/env node
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const { loadBody, approvalDigest } = require('./lib/notes-learning-compiler');
const { entryResources, fingerprint } = require('../miniprogram/subpackages/note/services/learning-content');
const { createEngine, STORAGE_KEY } = require('../miniprogram/subpackages/note/services/practice-session');
const root = path.resolve(__dirname, '..');
const { source, body, pack, content, compile, availableContent } = require('./lib/notes-learning-test-fixture').legacyFixture(root);
const clone = (v) => JSON.parse(JSON.stringify(v));
const reports = [];
function test(name, fn) { fn(); reports.push(name); }
function store() { return { data: {}, fail: false, getStorageSync(k) { return this.data[k] && clone(this.data[k]); },
  setStorageSync(k, v) { if (this.fail) throw Error('fixture failure'); this.data[k] = clone(v); } }; }
function engine(c = content, s = store()) { let n = 0; return createEngine(c, s, () => 1792540800000, () => `fixture-${++n}`); }
test('candidate build deterministic and identity survives source reordering', () => {
  const reordered = clone(source); reordered.questions.reverse(); reordered.targets.reverse();
  assert.deepEqual(compile(reordered, body), pack);
});
test('bad identities, sources, answers, targets, generators and entry plans rejected', () => {
  for (const mutate of [s => s.questions.push(clone(s.questions[0])), s => s.questions[0].refs[0].tabId = 'missing',
    s => s.questions[0].answer = 'Z', s => s.questions[0].primaryTargetIds = ['missing'],
    s => s.recipes[0].generatorId = 'assumption-tree', s => s.entryPlans.basic.resourceIds.push('missing'),
    s => s.questions[0].distractorReasons = {}, s => s.questions[0].refs = [],
    s => s.questions[0].status = 'approved']) {
    const bad = clone(source); mutate(bad); assert.throws(() => compile(bad, body));
  }
});
test('review resources denied outside development and approval must match source and content', () => {
  assert.equal(availableContent(body, pack, false).resources.length, 0);
  const approved = clone(source);
  const unverified = new Set(approved.questions.filter(q => q.sourceKind === 'legacy-unverified').map(q => q.id));
  approved.questions = approved.questions.filter(q => !unverified.has(q.id));
  for (const entry of Object.values(approved.entryPlans)) entry.resourceIds = entry.resourceIds.filter(id => !unverified.has(id));
  for (const list of ['targets', 'questions', 'recipes', 'sourceReviews', 'materials', 'knowledgeAtoms', 'comparisonGroups']) for (const e of approved[list]) {
    e.status = 'approved'; e.approval = { reviewer: 'test-fixture-only', reviewedAt: '2026-10-21', digest: approvalDigest(e) };
  }
  assert.equal(availableContent(body, compile(approved, body), false).resources.length, new Set(Object.values(approved.entryPlans).flatMap(e => e.resourceIds)).size);
  approved.questions[0].prompt += 'changed'; assert.throws(() => compile(approved, body));
});
test('source drift removes affected resources and compiler detects the upstream change', () => {
  const changed = clone(body); changed['data-analysis'].points.find(p => p.id === 'period-terms').tabs[0].blocks.push({ type: 'tip', content: 'changed' });
  assert.throws(() => compile(source, changed));
  const filtered = availableContent(changed, pack, true);
  assert(filtered.resources.length < content.resources.length);
  assert(filtered.resources.some(r => r.subjectId !== 'data-analysis')); assert(!filtered.resources.some(r => r.resourceType === 'recipe'));
});
test('scope and explicit enrollment control actual resource consumption', () => {
  assert.equal(entryResources(content, 'basic', { subjectId: 'graphic', categoryId: 'position' }).length, 0);
  const c = clone(content); c.entryPlans.basic.resourceIds = [];
  assert.equal(engine(c).start({ kind: 'basic' }).empty, true);
  assert(engine().start({ kind: 'method' }).session);
});
test('fixed knowledge instances freeze and resume without numerical regeneration', () => {
  const storage = store(), e = engine(content, storage), s = e.start({ kind: 'basic' }).session;
  assert.equal(s.items.length, 5); assert.equal(new Set(s.items.map(i => i.instanceId)).size, 5);
  const resumed = createEngine(content, storage).start({ kind: 'basic' });
  assert.equal(resumed.resumed, true); assert.deepEqual(resumed.session.items, s.items);
  assert(s.items.every(i => i.resourceType === 'question' && i.answerMode === 'single-choice' && !i.legacyQuestionId));
});
test('selection source return and assisted result persist with exact item identity', () => {
  const storage = store(), e = engine(content, storage), s = e.start({ kind: 'basic' }).session;
  e.selection(s.id, s.items[0].answer);
  const context = e.openSource(s.id, 0, 180); assert.equal(e.returnTarget(context.token).sessionId, s.id);
  const result = e.submit(s.id); const a = result.answers[s.items[0].instanceId];
  assert.equal(a.outcome, 'assisted'); assert.equal(a.position, 180); assert.equal(result.index, 0);
  assert.equal(e.result(s.id).assisted, 1);
  const restored = createEngine(content, storage); assert.deepEqual(restored.getSession(s.id).answers, result.answers);
});
test('knowledge recall stays a fixed choice task and completed phases cannot be bypassed', () => {
  const e = engine(), s = e.start({ kind: 'basic' }).session;
  assert.throws(() => e.advance(s.id)); e.skip(s.id); e.advance(s.id);
  const active = e.getSession(s.id), item = active.items[active.index];
  assert.equal(item.assessment.taskType, 'recall'); assert.equal(item.answerMode, 'single-choice');
  e.selection(s.id, item.answer); e.submit(s.id);
  assert.equal(e.getSession(s.id).answers[item.instanceId].outcome, 'correct');
});
test('failed storage transaction preserves previous selection and source state', () => {
  const storage = store(), e = engine(content, storage), s = e.start({ kind: 'basic' }).session;
  const before = clone(storage.data); storage.fail = true;
  assert.throws(() => e.selection(s.id, 'B'), /暂未保存/); assert.deepEqual(storage.data, before);
  assert.equal(e.getSession(s.id).answers[s.items[0].instanceId], undefined);
  assert.throws(() => e.openSource(s.id), /暂未保存/); assert.deepEqual(storage.data, before);
});
test('three modes and next-group preferences remain isolated', () => {
  const e = engine(), b = e.start({ kind: 'basic' }).session, m = e.start({ kind: 'method' }).session;
  e.setPreferences('basic', { subjectId: 'data-analysis', categoryId: 'growth', pointId: '' }, 10);
  assert.equal(e.resume('basic').id, b.id); assert.equal(e.resume('method').id, m.id);
  const next = e.start({ kind: 'basic', fresh: true }).session; assert.equal(next.requestedCount, 10); assert(next.items.length > 0 && next.items.length <= 10); assert(next.items.every(i => i.resourceType === 'question'));
});
test('entry withdrawal invalidates only sessions using that entry', () => {
  const storage = store(), e = engine(content, storage); e.start({ kind: 'basic' }); const m = e.start({ kind: 'method' }).session;
  const changed = clone(content); changed.entryPlans.basic.resourceIds = [];
  const updated = engine(changed, storage); assert.equal(updated.resume('basic'), null); assert.equal(updated.resume('method').id, m.id);
});
test('atomic material exceeding five remains available only after explicit confirmation', () => {
  const authored = clone(source), template = clone(source.questions[0]);
  const questions = Array.from({ length: 6 }, (_, n) => ({ ...clone(template), id: `fixture-material-q-${n}`, prompt: `${template.prompt} [${n}]`, materialId: 'fixture-material', familyId: `fixture-family-${n}`, exposureGroupId: `fixture-exposure-${n}` }));
  authored.questions = questions;
  authored.materials = [{ id: 'fixture-material', revision: 1, status: 'review', subjectId: template.subjectId, categoryId: template.categoryId,
    refs: clone(template.refs), content: 'fixture shared material', questionIds: questions.map(q => q.id) }];
  authored.entryPlans.basic.resourceIds = questions.map(q => q.id); authored.entryPlans.method.resourceIds = []; authored.entryPlans.application.resourceIds = [];
  const c = availableContent(body, compile(authored, body), true), e = engine(c);
  assert.equal(e.start({ kind: 'basic' }).oversized, 6);
  assert.equal(e.start({ kind: 'basic', allowOversize: true }).session.items.length, 6);
});
test('notes-only body builder writes neither common-sense model nor unrelated configuration', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-scope-'));
  try {
    fs.mkdirSync(path.join(temp, 'scripts')); fs.copyFileSync(path.join(root, 'scripts/build-note-runtime.js'), path.join(temp, 'scripts/build-note-runtime.js'));
    fs.mkdirSync(path.join(temp, 'miniprogram/models'), { recursive: true });
    for (const subject of Object.keys(body)) fs.cpSync(path.join(root, `miniprogram/models/note-${subject}`), path.join(temp, `miniprogram/models/note-${subject}`), { recursive: true });
    const common = path.join(temp, 'miniprogram/models/note-common-sense.js'); fs.writeFileSync(common, 'protected-common-marker');
    const run = spawnSync(process.execPath, [path.join(temp, 'scripts/build-note-runtime.js'), '--notes-only'], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr); assert.equal(fs.readFileSync(common, 'utf8'), 'protected-common-marker');
    assert.equal(require(path.join(temp, 'miniprogram/models/note-summary.js')).totalPointCount, 162);
    assert.equal(spawnSync(process.execPath, [path.join(temp, 'scripts/build-note-runtime.js'), '--unknown']).status, 1);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
test('separate page engines merge current storage instead of overwriting another mode', () => {
  const storage = store(), one = engine(content, storage);
  const basic = one.start({ kind: 'basic' }).session;
  let n = 50; const two = createEngine(content, storage, () => 1792540800000, () => `parallel-${++n}`);
  const method = two.start({ kind: 'method' }).session;
  one.selection(basic.id, basic.items[0].answer);
  assert.equal(two.getSession(method.id).kind, 'method');
  assert.equal(two.getSession(basic.id).answers[basic.items[0].instanceId].value, basic.items[0].answer);
});
test('corrupt practice storage fails explicitly without touching other module state', () => {
  const s = store(); s.data[STORAGE_KEY] = { schemaVersion: 0 }; s.data.otherModule = { unchanged: true };
  assert.throws(() => engine(content, s), /无法识别/); assert.deepEqual(s.data.otherModule, { unchanged: true });
});
test('imported examples stay single-source and cannot be approved with unverified provenance', () => {
  const imported = pack.questions.filter(q => q.id.startsWith('notes-q-da-application-')); assert.equal(imported.length, 2);
  assert.equal(imported[0].answer, 'C'); assert.equal(imported[1].answer, 'B');
  assert.equal(Math.round((8000 - 7200) / 7200 * 1000) / 10, 11.1);
  assert.equal(Math.round(827.4 * .052 / 1.052 * 10) / 10, 40.9);
  const bad = clone(source), q = bad.questions.find(q => q.origin); q.origin.expectedBlockSha256 = 'changed'; assert.throws(() => compile(bad, body));
  const invalid = clone(source), old = invalid.questions.find(q => q.origin); old.status = 'approved'; old.approval = {reviewer:'fixture', reviewedAt:'2026-10-21', digest:approvalDigest(old)};
  assert.throws(() => compile(invalid, body), /题源尚未核实/);
});
test('required images block scoring and stale image callbacks do not mark a new item ready', () => {
  const c = clone(content), q = c.resources.find(q => q.id === 'notes-q-da-basic-0001'); q.images = [{id:'fixture-image',src:'graphic/fixture.png',role:'stem'}];
  const e = engine(c), s = e.start({kind:'basic'}).session; e.selection(s.id, s.items[0].answer);
  assert.throws(() => e.submit(s.id), /图片尚未/); e.setImageReady(s.id, 'wrong-instance', true); assert.throws(() => e.submit(s.id), /图片尚未/);
  e.setImageReady(s.id, s.items[0].instanceId, true); assert.equal(e.submit(s.id).answers[s.items[0].instanceId].outcome, 'correct');
});
test('material snapshots expire on material-only change and complete groups are never deduplicated away', () => {
  const c = clone(content), template = c.resources.find(r => r.id === 'notes-q-da-basic-0001');
  const qs = Array.from({length:6}, (_,i) => ({...clone(template),id:`material-test-${i}`,materialId:'material-test',familyId:'same-family'}));
  c.resources.push(...qs); c.materials.push({id:'material-test',content:'original material',questionIds:qs.map(q => q.id)});
  c.entryPlans.basic.resourceIds.push(...qs.map(q => q.id));
  const storage=store(), e=engine(c, storage); assert.equal(e.start({kind:'basic'}).oversized,6);
  const s=e.start({kind:'basic',allowOversize:true}).session; assert.equal(s.items.length,6);
  c.materials[0].content='changed material'; assert.equal(engine(c,storage).getSession(s.id),null);
});
test('comparison reading records assistance without awarding correctness or exposing unrelated answers', () => {
  const storage=store(), e=engine(content,storage), s=e.start({kind:'method'}).session;
  assert(s.items[0].comparison); const read=e.openComparison(s.id), a=read.answers[s.items[0].instanceId];
  assert.equal(a.comparisonRead,true);assert.equal(a.consultedBeforeSubmit,true);assert.equal(a.outcome,undefined);
  assert.equal(e.result(s.id).correct,0);assert.deepEqual(storage.data[STORAGE_KEY].exposures,{});
  e.selection(s.id,s.items[0].answer);assert.equal(e.submit(s.id).answers[s.items[0].instanceId].outcome,'assisted');
  const changed=clone(content),q=changed.resources.find(q=>q.id===s.items[0].resourceId);
  q.comparison.difference+=' changed';assert.equal(engine(changed,storage).getSession(s.id),null);
});
test('unchanged original application sessions survive added governance metadata while content changes expire them', () => {
  const selected=clone(content);selected.entryPlans.application.resourceIds=[selected.entryPlans.application.resourceIds[0]];
  const storage=store(),initial=engine(selected,storage),s=initial.start({kind:'application'}).session;
  const legacy=clone(selected.resources.find(r=>r.id===s.items[0].resourceId));
  for(const key of ['assessment','knowledgeAtoms','comparison','assessmentFingerprint','originTask'])delete legacy[key];
  const saved=storage.data[STORAGE_KEY].sessions[s.id],item=saved.items[0];
  for(const key of ['assessment','knowledgeAtoms','comparison','assessmentFingerprint','originTask'])delete item[key];
  item.resourceSignature=fingerprint(legacy);
  const current=engine(content,storage);assert.equal(current.getSession(s.id).id,s.id);
  current.selection(s.id,item.answer);assert.equal(current.submit(s.id).answers[item.instanceId].outcome,'correct');
  const changed=clone(content);changed.resources.find(r=>r.id===item.resourceId).explanation+=' changed';
  assert.equal(engine(changed,storage).getSession(s.id),null);
});
test('new groups rotate fixed variants even after skipping instead of always selecting the first family member', () => {
  const e=engine(), one=e.start({kind:'basic',scope:{subjectId:'data-analysis',categoryId:'basic',pointId:''}}).session;
  e.skip(one.id);e.advance(one.id);const two=e.start({kind:'basic',scope:one.scope,fresh:true}).session;
  assert.notEqual(one.items[0].resourceId,two.items[0].resourceId);assert.equal(one.items[0].familyId,two.items[0].familyId);
});
console.log(JSON.stringify({ passed: true, scope: 'historical engineering fixture; not current V4 content acceptance', checks: reports.length, reports }, null, 2));
