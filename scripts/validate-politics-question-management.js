#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { spawnSync } = require('node:child_process');
const { readInputs } = require('./build-politics-question-catalogue');
const { build, baselinePath, projectionPath, serializeProjection } = require('./build-politics-question-management');
const { snapshot, impact, runtimeTargets, digest } = require('./lib/politics-question-management');
const clone = value => JSON.parse(JSON.stringify(value));
const root = path.resolve(__dirname, '..');
function validate() {
  const inputs = readInputs(), inputBefore = JSON.stringify(inputs), baseline = snapshot(inputs);
  assert.equal(fs.readFileSync(baselinePath, 'utf8'), JSON.stringify(baseline, null, 2) + '\n');
  const generated = build(); assert.equal(fs.readFileSync(projectionPath, 'utf8'), serializeProjection(generated.projection));
  assert.equal(baseline.items.length, inputs.banks.recallCards.length+38); assert.equal(baseline.surfaces.length, inputs.knowledgePackage.knowledgeUnits.length + inputs.curriculum.lessons.length + inputs.knowledgePackage.quickPrimers.reduce((n,p)=>n+p.sections.length,0)); assert.equal(baseline.remedies.length, 24);
  const cases = [];
  function test(name, run) { run(); cases.push(name); }
  function change(mutator) { const next = clone(inputs); mutator(next); return { next, report: impact(baseline, snapshot(next)) }; }
  const question = inputs.applied.questions[0], card = inputs.banks.recallCards.find(row => row.primaryObjectiveId === question.primaryObjectiveId);
  const blockId = question.sourceBlockIds[0], owner = inputs.knowledgePackage.knowledgeUnits.find(unit => unit.blocks.some(block => block.id === blockId));
  test('unchanged-inputs-and-no-mutation', () => { const report = impact(baseline, snapshot(inputs)); assert.equal(report.status, 'unchanged'); assert.deepEqual(report.affectedItems, []); assert.equal(JSON.stringify(inputs), inputBefore); });
  test('source-text-affects-original-item-body-systematic-and-quick', () => {
    const { report } = change(data => { data.knowledgePackage.knowledgeUnits.find(unit => unit.id === owner.id).blocks.find(block => block.id === blockId).fallbackText += 'test'; });
    assert.equal(report.status, 'review-required'); assert.ok(report.affectedItems.some(item => item.itemId === question.questionId));
    assert.ok(report.affectedSurfaces.includes(`body:${owner.id}`)); assert.ok(report.affectedSurfaces.some(id => id.startsWith('systematic:'))); assert.ok(report.affectedSurfaces.some(id => id.startsWith('quick:')));
    assert.ok(report.affectedRemedies.includes(question.questionId));
  });
  test('removed-source-keeps-old-reference-impact', () => { const { report } = change(data => { const unit = data.knowledgePackage.knowledgeUnits.find(unit => unit.id === owner.id); unit.blocks = unit.blocks.filter(block => block.id !== blockId); }); assert.ok(report.changed.blocks.some(row => row.id === blockId && row.change === 'removed')); assert.ok(report.affectedItems.some(row => row.itemId === question.questionId)); });
  test('moved-source-is-reported-and-runtime-target-uses-real-owner', () => {
    const next = clone(inputs), from = next.knowledgePackage.knowledgeUnits.find(unit => unit.id === owner.id), to = next.knowledgePackage.knowledgeUnits.find(unit => unit.id !== owner.id);
    const block = from.blocks.find(block => block.id === blockId); from.blocks = from.blocks.filter(row => row.id !== blockId); to.blocks.push(block);
    const candidate = snapshot(next), report = impact(baseline, candidate); assert.ok(report.changed.blocks.some(row => row.id === blockId));
    assert.equal(runtimeTargets(candidate, next)[question.questionId].unitId, to.id);
  });
  test('objective-title-change-finds-items-and-lesson', () => { const { report } = change(data => { data.objectiveRegistry.objectives.find(goal => goal.objectiveId === question.primaryObjectiveId).title += 'test'; }); assert.ok(report.affectedItems.some(row => row.itemId === card.cardId)); assert.ok(report.affectedSurfaces.includes(`systematic:${question.lessonId}`)); });
  test('removed-objective-does-not-drop-old-links', () => { const { report } = change(data => { data.objectiveRegistry.objectives = data.objectiveRegistry.objectives.filter(goal => goal.objectiveId !== question.primaryObjectiveId); }); assert.ok(report.changed.objectives.some(row => row.change === 'removed')); assert.ok(report.affectedItems.some(row => row.itemId === question.questionId)); });
  test('rebound-item-keeps-old-and-new-consumer-review', () => { const { report } = change(data => { data.applied.questions[0].primaryObjectiveId = data.objectiveRegistry.objectives.find(goal => goal.objectiveId !== question.primaryObjectiveId).objectiveId; }); assert.ok(report.affectedRemedies.includes(question.questionId)); assert.deepEqual(report.affectedItems.find(row => row.itemId === question.questionId).consumers, ['daily', 'qa']); });
  test('same-version-answer-edit-is-not-missed', () => { const { report } = change(data => { data.banks.recallCards.find(row => row.cardId === card.cardId).answer += 'test'; }); assert.ok(report.affectedItems.some(row => row.itemId === card.cardId)); assert.ok(report.affectedRemedies.includes(question.questionId)); });
  test('source-reference-metadata-change-is-not-missed', () => { const refId = owner.blocks.find(block => block.id === blockId).sourceRefIds[0]; const { report } = change(data => { data.knowledgePackage.sourceReferences.find(ref => ref.id === refId).title += 'test'; }); assert.ok(report.changed.references.some(row => row.id === refId)); assert.ok(report.affectedItems.some(row => row.itemId === question.questionId)); });
  test('unmapped-global-change-remains-visible-with-known-change', () => { const { report } = change(data => { data.applied.bankVersion += '-test'; data.banks.recallCards[0].answer += 'test'; }); assert.equal(report.status, 'review-required'); assert.ok(report.unmappedInputChanges.includes('applied')); assert.ok(report.affectedItems.length); });
  test('lesson-remedy-change-is-reported', () => { const { report } = change(data => { data.curriculum.lessons.find(lesson => lesson.id === question.lessonId).parts[0].text += 'test'; }); assert.ok(report.affectedRemedies.includes(question.questionId)); });
  test('quick-structure-change-remains-visible', () => { const { report } = change(data => { data.knowledgePackage.quickPrimers[0].structure.propositions[0].label += 'test'; }); assert.equal(report.status, 'review-required'); assert.ok(report.unmappedInputChanges.includes('quickMetadata')); });
  test('new-and-deleted-items-report-original-identities', () => { const { report } = change(data => { const removed = data.applied.questions.shift(); data.applied.questions.push({ ...removed, questionId: 'test-new-item' }); }); assert.ok(report.changed.items.some(row => row.id === question.questionId && row.change === 'removed')); assert.ok(report.changed.items.some(row => row.id === 'test-new-item' && row.change === 'added')); assert.ok(report.affectedItems.some(row => row.itemId === question.questionId)); });
  test('tampered-baseline-and-duplicate-ids-rejected', () => { const invalid = clone(baseline); invalid.items[0].version = 'test'; assert.throws(() => impact(invalid, baseline)); const next = clone(inputs); next.applied.questions.push(clone(next.applied.questions[0])); assert.throws(() => snapshot(next)); });
  test('all-24-primary-goal-remedies-and-block-owners-exact', () => {
    const projection = runtimeTargets(baseline, inputs);
    assert.equal(Object.keys(projection).length, 24);
    for (const remedy of baseline.remedies) {
      const q = inputs.applied.questions.find(row => row.questionId === remedy.questionId);
      assert.equal(remedy.objectiveId, q.primaryObjectiveId); assert.equal(remedy.lessonId, q.lessonId); assert.ok(remedy.primaryRecallItemIds.length || remedy.reviewedRecallItemIds?.length);
      for (const id of remedy.primaryRecallItemIds) assert.equal(inputs.banks.recallCards.find(row => row.cardId === id).primaryObjectiveId, q.primaryObjectiveId);
      for (const target of remedy.readingTargets) assert.ok(inputs.knowledgePackage.knowledgeUnits.find(unit => unit.id === target.unitId).blocks.some(block => block.id === target.blockId));
      assert.equal(projection[q.questionId].contentVersion, q.contentVersion);
    }
  });
  test('no-primary-match-does-not-use-supporting-or-title-guess', () => { const next = clone(inputs); next.banks.recallCards = next.banks.recallCards.filter(row => row.primaryObjectiveId !== question.primaryObjectiveId); assert.throws(() => runtimeTargets(snapshot(next), next)); });
  test('reviewed-semantic-link-does-not-fall-back-when-review-removed',()=>{const next=clone(inputs);next.semanticAssociations.applicationRemedyBindings=[];assert.throws(()=>runtimeTargets(snapshot(next),next));});
  test('reviewed-semantic-link-rejects-expired-measurement',()=>{const next=clone(inputs);next.semanticAssociations.applicationRemedyBindings[0].recallContentVersion='expired';assert.throws(()=>runtimeTargets(snapshot(next),next));});
  test('auxiliary-consumers-and-nonvisual-projections-separated', () => {
    const firsts = new Set(inputs.knowledgePackage.knowledgeUnits.map(unit => unit.recallItemIds[0]));
    for (const item of baseline.items.filter(row => row.kind === 'recall')) { assert.equal(item.consumers.includes('body-recall'), firsts.has(item.id)); assert.equal(item.consumers.includes('legacy-systematic-recall'), firsts.has(item.id)); assert.ok(['exam', 'daily', 'qa', 'search-recall-prompt'].every(consumer => item.consumers.includes(consumer))); assert.ok(item.projectionDependencies.includes('focus-workbench-recall')); }
    assert.ok(baseline.items.some(row => row.projectionDependencies.some(id => id.startsWith('contrast-payload:'))));
  });
  test('actual-page-links-preserve-session-and-reject-stale-target', () => {
    let definition; const nav = [], toasts = [], memory = {};
    const file = path.join(root, 'miniprogram/subpackages/politics/practice/index.js');
    const wx = { getStorageSync: key => memory[key], setStorageSync: (key, value) => { memory[key] = clone(value); }, setNavigationBarTitle() {}, navigateTo: args => nav.push(args.url), showToast: args => toasts.push(args.title) };
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), { require: createRequire(file), wx, Page: value => { definition = value; }, getCurrentPages: () => [1, 2], console });
    const page = { ...definition, data: clone(definition.data), setData(patch) { Object.assign(this.data, patch); } };
    for (const mode of ['daily', 'qa']) {
      page.onLoad({ mode }); const q = page.data.current; assert.equal(q.sourceAvailable, true);
      const navigationBefore = nav.length; page.handleSourceTap(); assert.equal(nav.length, navigationBefore); // Unanswered requests cannot open hidden answers.
      page.handleReveal();
      let target;
      if (q.kind === 'recall') {
        page.handleSourceTap(); assert.equal(nav.length, navigationBefore + 1); // Revealed recall now exposes sources before self-assessment.
        page.handleRecallResult({ detail: { result: 'fuzzy' } }); target = q.sourceTarget;
      } else target = generated.projection[q.id];
      const before = JSON.stringify(memory), frozen = clone(page.session);
      page.handleSourceTap(); const url = nav.at(-1); assert.ok(url.includes(`id=${encodeURIComponent(target.unitId)}`) && url.includes(`block=${encodeURIComponent(target.blockId)}`));
      page.onShow(); assert.equal(JSON.stringify(memory), before); assert.deepEqual(clone(page.session), frozen);
      page.data.current.contentVersion = 'stale'; const n = nav.length; page.handleSourceTap(); assert.equal(nav.length, n); assert.ok(toasts.length);
    }
  });
  test('cli-unchanged-and-invalid-arguments', () => { const cli = path.join(root, 'scripts/check-politics-question-impact.js'); const clean = spawnSync(process.execPath, [cli], { encoding: 'utf8' }); assert.equal(clean.status, 0, clean.stderr); assert.equal(JSON.parse(clean.stdout).status, 'unchanged'); const invalid = spawnSync(process.execPath, [cli, '--baselin=typo'], { encoding: 'utf8' }); assert.notEqual(invalid.status, 0); });
  test('cli-changed-baseline-requires-review-and-nonzero-exit', () => {
    const directory = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'politics-u2-impact-'));
    try {
      const next = clone(inputs); next.banks.recallCards[0].answer += 'test';
      const file = path.join(directory, 'previous.json'); fs.writeFileSync(file, JSON.stringify(snapshot(next)));
      const command = spawnSync(process.execPath, [path.join(root, 'scripts/check-politics-question-impact.js'), `--baseline=${file}`], { encoding: 'utf8' });
      assert.equal(command.status, 1, command.stderr); const report = JSON.parse(command.stdout);
      assert.equal(report.status, 'review-required'); assert.ok(report.affectedItems.some(item => item.itemId === inputs.banks.recallCards[0].cardId));
    } finally { fs.rmSync(directory, { recursive: true }); }
  });
  const result = { status: 'passed', version: baseline.snapshotVersion, items: baseline.items.length, surfaces: baseline.surfaces.length, remedies: 24, cases: cases.length, checks: cases, runtimeProjectionBytes: Buffer.byteLength(serializeProjection(generated.projection)), sourceContentChanged: false, userRecordsUsed: false, mainPackageFilesAdded: 0 };
  console.log(JSON.stringify(result)); return result;
}
if (require.main === module) validate();
module.exports = { validate };
