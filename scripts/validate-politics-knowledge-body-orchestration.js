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
    assert.equal(item.kind, 'article');
    assert.equal(item.label, block.reading?.heading?.quote || block.title || block.payload?.text || block.fallbackText);
  }
  assert.ok(card.sectionOutline.every((item) => item.label !== card.identity.title), `${unit.id}: navigation repeats the page title`);
  for (const block of card.semanticBlocks.filter((item) => item.displayRole === 'article-subhead')) {
    assert.equal(block.kind, 'paragraph', `${unit.id}: non-paragraph became an article subheading`);
    assert.ok(/^(?:[一二三四五六七八九十]+、|（[一二三四五六七八九十]+）)/.test(block.text.trim()), `${unit.id}: unnumbered text became an article subheading`);
  }
  assert.deepEqual(card.outlinePreview, card.sectionOutline.filter((item) => item.level === 1), `${unit.id}: default outline must expose every top-level theme`);
  for (const item of card.sectionOutline) {
    assert.equal(item.displayLabel, item.label.replace(/^\s*(?:[0-9]+[.．、]|[一二三四五六七八九十]+、|[（(](?:[0-9]+|[一二三四五六七八九十]+)[）)]|[①②③④⑤⑥⑦⑧⑨⑩])\s*/, ''), `${unit.id}: display numbering no longer follows source`);
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
assert.ok(cardWxml.includes('knowledge-inline-relation-reason') && !cardWxml.includes('expandedRelationAnchor === block.id'), 'local boundary reason must remain visible');
assert.ok(cardWxml.includes('knowledge-inline-relation-head') && cardWxml.includes('knowledge-card-relation-head'), 'inline and footer relations lost their card structure');
assert.ok(!/[⌄⌃›]/.test(cardWxml + detailWxml), 'mixed glyph arrows remain in the political reader');
assert.ok(cardWxml.includes('knowledge-card-chevron-right') && cardWxml.includes("knowledge-card-chevron-{{expandedFooterRelationId === item.relationId ? 'up' : 'down'}}") && detailWxml.includes('politics-reading-chevron-'), 'reader chevrons are not unified');
assert.ok(cardWxml.includes('knowledge-inline-contrast-boundary') && cardWxml.includes('handleContrastToggle'), 'formal contrast boundary or detail missing');
assert.ok(cardWxml.includes('showReadingReturn && recallView.answerVisible'), 'recall reveals source before answer');
assert.ok(!cardWxml.includes('bindtap="handleSourceFeedback"') && !detailWxml.includes('bind:sourcefeedback='), 'debug source/feedback remains in ordinary learning flow');
assert.ok(detailWxml.includes('bind:taskreturn="handleTaskReturn"') && detailWxml.includes('recallReturnVisible'), 'task or same-question return missing');
const expandedU004 = platform.projectKnowledgeCardSurfaceViewModel(pack, 'politics-toc-v2-u004');
assert.equal(expandedU004.outlinePreview.length, 3, 'reviewed top-level themes are not projected');
assert.ok(expandedU004.semanticBlocks.some((block) => block.readingHeading), 'reviewed reading headings are not consumed');
assert.ok(cardWxml.includes("toolbarManaged ? 'knowledge-card-detail' : ''") && cardWxml.includes('knowledge-block-self-title'), 'detail-only article styling or title anchor is missing');
assert.ok(cardWxml.indexOf('class="knowledge-card-title"') < cardWxml.indexOf('class="knowledge-card-path"'), 'knowledge path must follow the title');
assert.ok(!cardWxml.includes('card.identity.statusLabel'), 'completed review copy remains visible in the reader');
assert.ok(!read('miniprogram/pages/politics/index.wxml').includes('module.copy.contentNotice'), 'completed review copy remains visible on home');
assert.ok(detailWxml.includes('toolbar-managed="{{true}}"') && cardWxml.includes('!toolbarManaged'), 'detail toolbar does not own duplicate card actions');
for (const action of ['handleTaskReturn', 'handleReturnToRecall', 'handleDisplayToggle', 'handleDisplaySelect', 'handleStartRecall', 'handleBackToReading']) {
  assert.ok(detailWxml.includes(`bindtap="${action}"`), `${action}: bottom toolbar event missing`);
}
assert.ok(detailWxml.indexOf('class="politics-reading-toolbar') < detailWxml.indexOf('<knowledge-card-surface'), 'toolbar should precede the article in focus order');
assert.match(detailWxml, /<view[^>]+class="politics-reading-toolbar-return"[^>]+bindtap="handleTaskReturn"[^>]+role="button"/, 'contextual return must consume the shared view hit target');

assert.ok(!detailWxml.includes('class="politics-reading-toolbar-origin"'), 'source path duplicates the contextual return in the toolbar');
assert.ok(detailWxml.includes('A {{displayPreferences.fontScale') && detailWxml.includes('politics-reading-display-menu'), 'three-level font menu is missing');
assert.ok(detailWxml.includes('class="politics-reading-display-option') && !detailWxml.includes('<button class="politics-reading-display-option'), 'font menu regressed to native button layout');
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
search.page.handleDisplayToggle();
assert.equal(search.page.data.displayMenuVisible, true, 'font menu did not open');
search.page.handleDisplaySelect({ currentTarget: { dataset: { fontScale: 'large' } } });
assert.equal(search.page.data.displayMenuVisible, false, 'font menu did not close');
assert.equal(search.page.data.displayPreferences.fontScale, 'large', 'font selection was not applied');
search.page.handleStartRecall();
assert.equal(search.page.data.sourceContextLabel, '来自搜索结果', 'entry context should remain during recall');
search.page.handleReveal();
search.page.handleRecallResult({ detail: { result: 'fuzzy' } });
search.page.handleBackToReading();
assert.equal(search.page.data.recallReturnVisible, true);
assert.ok(search.page.data.evidenceAnchors.length > 1);
search.page.handleReturnToRecall();
assert.equal(search.page.data.recallView.response, 'fuzzy', 'same-question self-assessment was lost');
assert.equal(search.page.data.sourceContextLabel, '来自搜索结果', 'entry path should return after source checking');
search.page.handleTaskReturn();
assert.equal(search.calls.back.length, 1, 'outer search return missing');


for (const [origin, title] of [["quick-primer", "快速了解"], ["systematic-remedy", "系统学习"], ["contrast-evidence", "易混突破"], ["exam-remedy", "考前速记"]]) {
  const detail = loadDetail('subpackages/politics/route/index');
  detail.page.onLoad({ id, origin, mode: 'reading' });
  assert.equal(detail.page.data.taskReturnLabel, `返回${title}`);
  detail.page.handleTaskReturn();
  assert.equal(detail.calls.back.length, 1, 'route return did not preserve native page stack');
}

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

let cardDefinition;
global.Component = (definition) => { cardDefinition = definition; };
delete require.cache[require.resolve(path.join(repo, 'miniprogram/components/knowledge-card-surface/index.js'))];
require(path.join(repo, 'miniprogram/components/knowledge-card-surface/index.js'));
const component = { data: { ...cardDefinition.data }, setData(patch) { Object.assign(this.data, patch); } };
const footerRelation = platform.projectKnowledgeCardSurfaceViewModel(pack, id).relationFooter.items[0].relationId;
cardDefinition.methods.handleFooterRelationToggle.call(component, { currentTarget: { dataset: { relationId: footerRelation } } });
assert.equal(component.data.expandedFooterRelationId, footerRelation, 'footer relation did not expand');
cardDefinition.methods.handleFooterRelationToggle.call(component, { currentTarget: { dataset: { relationId: footerRelation } } });
assert.equal(component.data.expandedFooterRelationId, null, 'footer relation did not collapse');
cardDefinition.methods.handleOutlineToggle.call(component);
assert.equal(component.data.outlineExpanded, true, 'outline did not expand');
cardDefinition.methods.handleOutlineToggle.call(component);
assert.equal(component.data.outlineExpanded, false, 'outline did not collapse');

console.log(JSON.stringify({ status: 'passed', units: pack.knowledgeUnits.length, formalFactsSha256: factsHash, checks: ['all-unit-source-order','outline-source','relation-and-recall-mapping','wxml-sequence-and-debug-exit','single-row-toolbar-and-display-menu','footer-relation-and-outline-toggle','article-hierarchy-and-anchor','search-recall-source-return','invalid-anchor','relation-target'] }, null, 2));
