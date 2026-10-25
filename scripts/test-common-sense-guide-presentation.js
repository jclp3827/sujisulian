const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createRequire } = require('module');
const body = require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const candidate = require('../miniprogram/subpackages/common-sense/models/guide-expansion-candidate');
const golden = require('../miniprogram/subpackages/common-sense/models/guide-golden-sample');
const { createGuideContent, createGoldenGuideContent } = require('../miniprogram/subpackages/common-sense/services/guide-content');
const { presentGuideCard } = require('../miniprogram/subpackages/common-sense/services/guide-presentation');
const beforeBody = JSON.stringify(body);
const sets = [createGuideContent(body), createGoldenGuideContent(body, golden), createGoldenGuideContent(body, candidate)];
let cardsChecked = 0;
let markedCandidates = 0;
for (const content of sets) {
  for (const card of content.cards) {
    const before = JSON.stringify(card);
    const paragraphs = presentGuideCard(card);
    const tokens = paragraphs.flatMap((p) => p.tokens);
    assert.equal(tokens.map((t) => t.text).join(''), card.content, 'Display must preserve every content character');
    const marked = tokens.filter((t) => t.emphasis);
    assert.ok(marked.length <= 3);
    assert.ok(marked.reduce((n, t) => n + t.text.length, 0) <= card.content.length * 0.25);
    if (content === sets[2] && marked.length) markedCandidates++;
    assert.equal(JSON.stringify(card), before, 'Display must not alter card signature inputs');
    cardsChecked++;
  }
}
assert.equal(JSON.stringify(body), beforeBody);
assert.equal(markedCandidates, 1602, 'Only reviewed cards with a useful, bounded emphasis decision may have marks');
const reviewedAnnotations = Object.assign({},
  require('../miniprogram/subpackages/common-sense/models/guide-emphasis-batch-1'),
  require('../miniprogram/subpackages/common-sense/models/guide-emphasis-batch-2'),
  require('../miniprogram/subpackages/common-sense/models/guide-emphasis-batch-3'),
  ...Array.from({ length: 304 }, (_, i) => require('../miniprogram/subpackages/common-sense/models/guide-emphasis-batch-' + (i + 4)))
);
for (const [id, annotation] of Object.entries(reviewedAnnotations)) {
  const card = sets[2].cardById[id];
  assert.deepEqual(presentGuideCard(card).flatMap(p => p.tokens).filter(t => t.emphasis).map(t => t.text), annotation.terms);
}
const changed = { ...sets[2].cards.find(c => c.id === 'physics::newton-third-law'), content: '改写后的内容' };
assert.equal(presentGuideCard(changed).flatMap(p => p.tokens).some(t => t.emphasis), false);
assert.deepEqual(presentGuideCard(null), []);
const load = (wx) => {
  const filename = path.resolve(__dirname, '../miniprogram/subpackages/common-sense/learning/index.js');
  let definition;
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), { require: createRequire(filename), Page(value) { definition = value; }, wx, console, setTimeout, clearTimeout }, { filename });
  return { ...definition, data: JSON.parse(JSON.stringify(definition.data)), setData(value) { Object.assign(this.data, value); } };
};
const clone = (v) => JSON.parse(JSON.stringify(v));
const seed = { 'common-sense-guide-v1': { sentinel: 'formal' }, 'common-sense-guide-v1:golden-v1': { sentinel: 'golden' }, 'common-sense-learning-v1': { sentinel: 'questions' } };
const values = clone(seed);
const urls = [];
const wx = { getStorageSync: (k) => clone(values[k] || null), setStorageSync: (k, v) => { values[k] = clone(v); }, getAccountInfoSync: () => ({ miniProgram: { envVersion: 'develop' } }), setNavigationBarTitle() {}, navigateTo: (v) => urls.push(v.url) };
const page = load(wx);
page.onLoad({ mode: 'guide', sample: 'expansion-v1', scope: 'all', groupId: 'physics', count: '5' });
assert.equal(page.data.guideOverviewOpen, false);
assert.equal(page.data.guideContextScopeTitle, '科技');
assert.deepEqual(clone(page.data.guideProgressMeta), [{label:'当前卡片',value:'1 / 5'},{label:'已回顾',value:'0'},{label:'记住了',value:'0'}]);
const first = clone(page.data.guideCard);
const saved = JSON.stringify(values);
page.handleGuideOverview();
assert.equal(page.data.guideOverviewOpen, true);
assert.equal(JSON.stringify(values), saved, 'Group explanation must not persist any learning state');
assert.equal(page.data.guideCard.signature, first.signature);
page.handleGuideAssess({ currentTarget: { dataset: { result: 'remembered' } } });
assert.equal(page.data.index, 2);
assert.deepEqual(clone(page.data.guideProgressMeta), [{label:'当前卡片',value:'2 / 5'},{label:'已回顾',value:'1'},{label:'记住了',value:'1'}]);
assert.equal(page.data.guideOverviewOpen, false, 'Next card must close group explanation');
assert.equal(page.guideEngine.record(first.id).status, 'remembered');
const second = clone(page.data.guideCard);
page.handleSource({ currentTarget: { dataset: { point: second.pointId, tab: second.tabId } } });
assert.ok(urls[0].includes('pointId=' + second.pointId));
assert.ok(urls[0].includes('tabId=' + second.tabId));
const restored = load(wx);
restored.onLoad({ mode: 'guide', sample: 'expansion-v1' });
assert.equal(restored.data.guideCard.id, second.id);
assert.equal(restored.data.guideOverviewOpen, false);
for (const key of Object.keys(seed)) assert.deepEqual(values[key], seed[key]);
const third = sets[2].cards.find((c) => c.title === '牛顿第三定律');
const strong = presentGuideCard(third).flatMap((p) => p.tokens).filter((t) => t.emphasis).map((t) => t.text);
assert.ok(strong.join('').includes('大小相等') && strong.join('').includes('方向相反'));
console.log(JSON.stringify({ passed: true, unchangedCardsChecked: cardsChecked, candidatesWithSourceEmphasis: markedCandidates, exactTextAndSignaturesPreserved: true, overviewDoesNotWriteStorage: true, resumeAndSourceLinksPreserved: true }));

const template = fs.readFileSync(path.resolve(__dirname, '../miniprogram/subpackages/common-sense/learning/index.wxml'), 'utf8');
assert.ok(template.includes('class="guide-progress-card surface-card"'));
assert.ok(template.includes('{{index}} / {{total}}'));
assert.ok(template.includes('已回顾 {{result.assessed}}'));
assert.ok(template.includes('记住 {{result.remembered}}'));
const style = fs.readFileSync(path.resolve(__dirname, '../miniprogram/subpackages/common-sense/learning/index.wxss'), 'utf8');
assert.match(style, /\.guide-card-content[^}]*font-size:\s*30rpx[^}]*line-height:\s*1\.74/u);
assert.match(style, /\.guide-emphasis\s*\{[^}]*font-weight:\s*700[^}]*linear-gradient\([^}]*to top[^}]*0\.42[^}]*0\.36[^}]*0\.24[^}]*13rpx/u);
