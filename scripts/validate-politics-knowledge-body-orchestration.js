#!/usr/bin/env node
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const repo = path.resolve(__dirname, '..');
const platform = require(path.join(repo, 'miniprogram/services/knowledge-platform'));
const { knowledgePackage: pack } = require(path.join(repo, 'miniprogram/services/knowledge-platform/politics-runtime'));
const read = (name) => fs.readFileSync(path.join(repo, name), 'utf8');
const facts = {
  packageVersion: pack.packageVersion,
  buildTarget: pack.buildTarget,
  moduleProfile: pack.moduleProfile,
  navigationNodes: pack.navigationNodes,
  knowledgeUnits: pack.knowledgeUnits,
  knowledgeAtomRefs: pack.knowledgeAtomRefs,
  relations: pack.relations,
  contrastPairs: pack.contrastPairs,
  recallItems: pack.recallItems,
  recallProjections: pack.recallProjections,
  sourceReferences: pack.sourceReferences,
  contentCoverage: pack.contentCoverage,
};
const factsHash = crypto.createHash('sha256').update(JSON.stringify(facts)).digest('hex');
const expected = process.argv.find((arg) => arg.startsWith('--expect-facts-sha='))?.slice('--expect-facts-sha='.length);
if (expected) assert.equal(factsHash, expected, 'formal knowledge facts changed from B0');

for (const unit of pack.knowledgeUnits) {
  const card = platform.projectKnowledgeCardSurfaceViewModel(pack, unit.id);
  assert.ok(card, `${unit.id}: no card`);
  assert.deepEqual(card.semanticBlocks.map((block) => block.id), unit.blocks.map((block) => block.id), `${unit.id}: formal block order changed`);
  assert.deepEqual(card.semanticBlocks.map((block) => block.fallbackText), unit.blocks.map((block) => block.fallbackText), `${unit.id}: formal wording changed`);
  const byId = new Map(unit.blocks.map((block) => [block.id, block]));
  for (const item of card.sectionOutline) {
    const block = byId.get(item.id);
    assert.ok(block, `${unit.id}: outline lost source block`);
    assert.equal(item.kind, block.kind === 'heading' ? 'article' : 'knowledge');
    assert.equal(item.label, block.title || block.payload?.text || block.fallbackText);
  }
  assert.ok(card.outlinePreview.length <= 3);
  for (const item of card.outlinePreview) {
    assert.ok(card.sectionOutline.some((full) => full.id === item.id));
    assert.equal(byId.get(item.id).kind, 'heading');
    assert.notEqual(item.label, card.identity.title, `${unit.id}: preview repeats the page title`);
  }
  assert.deepEqual((card.relationFooter?.items || []).map((item) => item.relationId).sort(), unit.relationIds.slice().sort(), `${unit.id}: relation went missing`);
  assert.equal(card.recallFace?.pointId, unit.id, `${unit.id}: recall source changed`);
}

const cardWxml = read('miniprogram/components/knowledge-card-surface/index.wxml');
const detailWxml = read('miniprogram/subpackages/politics/detail/index.wxml');
const cardJs = read('miniprogram/components/knowledge-card-surface/index.js');
const readingStart = cardWxml.indexOf('class="knowledge-card-body"');
const recallEntry = cardWxml.indexOf('class="knowledge-card-recall-entry"');
const relatedFooter = cardWxml.indexOf('class="knowledge-card-relations"');
assert.ok(readingStart >= 0 && readingStart < recallEntry && recallEntry < relatedFooter, 'reading → recall → optional exploration order is broken');
assert.ok(cardWxml.includes('card.outlinePreview') && cardWxml.includes('card.sectionOutline'), 'preview or full navigation unavailable');
assert.ok(cardWxml.includes('knowledge-card-relation-head') && cardJs.includes('handleFooterRelationToggle'), 'relations cannot be expanded on demand');
assert.ok(cardWxml.includes('knowledge-inline-contrast-boundary') && cardWxml.includes('handleContrastToggle'), 'formal contrast boundary or detail missing');
assert.ok(cardWxml.includes('showReadingReturn && recallView.answerVisible'), 'recall reveals source before answer');
assert.ok(!cardWxml.includes('bindtap="handleSourceFeedback"') && !detailWxml.includes('bind:sourcefeedback='), 'debug source/feedback remains in ordinary learning flow');
assert.ok(detailWxml.includes('bind:taskreturn="handleTaskReturn"') && detailWxml.includes('recallReturnVisible'), 'task or same-question return missing');
assert.ok(read('miniprogram/subpackages/politics/route/guided-route.wxml').includes('compact'), 'shared route card lost compact host');

function loadDetail(previousPath) {
  let definition;
  const storage = new Map();
  const calls = { back: [], to: [], home: [] };
  global.Page = (value) => { definition = value; };
  global.getCurrentPages = () => previousPath ? [{ route: previousPath }, { route: 'subpackages/politics/detail/index' }] : [{ route: 'subpackages/politics/detail/index' }];
  global.wx = {
    getStorageSync: (key) => storage.get(key),
    setStorageSync: (key, value) => storage.set(key, value),
    setNavigationBarTitle() {},
    pageScrollTo() {},
    createSelectorQuery() { return { in() { return this; }, select() { return this; }, boundingClientRect() { return this; }, selectViewport() { return this; }, scrollOffset() { return this; }, exec(callback) { callback([null]); } }; },
    navigateBack: (value) => calls.back.push(value),
    navigateTo: (value) => calls.to.push(value),
    switchTab: (value) => calls.home.push(value),
    showToast() {},
  };
  const file = path.join(repo, 'miniprogram/subpackages/politics/detail/index.js');
  delete require.cache[require.resolve(file)];
  require(file);
  const page = { ...definition, data: JSON.parse(JSON.stringify(definition.data)), setData(patch, callback) { Object.assign(this.data, patch); callback?.(); }, selectComponent() { return null; } };
  return { page, calls };
}
const id = 'politics-toc-v2-u003';
const answerBlock = pack.recallProjections.find((item) => item.pointId === id).answerSourceBlockIds[0];
const search = loadDetail('subpackages/politics/search/index');
search.page.onLoad({ id, origin: 'search', mode: 'reading', block: answerBlock });
assert.equal(search.page.data.taskReturnLabel, '返回搜索结果');
assert.equal(search.page.data.sourceContextLabel, '来自搜索结果');
search.page.handleStartRecall();
search.page.handleReveal();
search.page.handleRecallResult({ detail: { result: 'fuzzy' } });
search.page.handleBackToReading();
assert.equal(search.page.data.recallReturnVisible, true);
assert.ok(search.page.data.evidenceAnchors.length > 1);
search.page.handleReturnToRecall();
assert.equal(search.page.data.recallView.response, 'fuzzy', 'same-question self-assessment was lost');
search.page.handleTaskReturn();
assert.equal(search.calls.back.length, 1, 'outer search return missing');

const unrelated = pack.relations.find((item) => item.sourcePointId !== id && item.targetPointId !== id);
const forged = loadDetail('subpackages/politics/detail/index');
forged.page.onLoad({ id, origin: 'relation', mode: 'reading', relation: unrelated.id, block: answerBlock });
assert.notEqual(forged.page.data.sourceContextLabel, '查看关联知识的原文', 'unrelated relation is falsely presented as valid');
const invalid = loadDetail();
invalid.page.onLoad({ id, origin: 'search', mode: 'reading', block: 'block:politics-toc-v2-u003:missing' });
assert.equal(invalid.page.data.taskReturnLabel, '');
assert.ok(invalid.page.data.anchorNotice.includes('失效'));

const relation = pack.relations.find((item) => item.sourcePointId === id || item.targetPointId === id);
const source = loadDetail('subpackages/politics/map/index');
source.page.onLoad({ id, origin: 'directory', mode: 'reading' });
source.page.handleRelationTap({ detail: { relationId: relation.id } });
assert.equal(source.calls.to.length, 1);
assert.ok(source.calls.to[0].url.includes('origin=relation'));
assert.ok(source.calls.to[0].url.includes('block='), 'relation lost target block anchor');

console.log(JSON.stringify({ status: 'passed', units: pack.knowledgeUnits.length, formalFactsSha256: factsHash, checks: ['all-unit-source-order','outline-source','relation-and-recall-mapping','wxml-sequence-and-debug-exit','search-recall-source-return','invalid-anchor','relation-target'] }, null, 2));
