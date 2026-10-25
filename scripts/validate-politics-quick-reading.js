const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { spawnSync } = require('node:child_process');
const platform = require('../miniprogram/services/knowledge-platform');
const { sourcePackage, knowledgePackage } = require('../miniprogram/services/knowledge-platform/politics-runtime');
const artifact = require('../docs/knowledge-pilot/sources/politics/quick-primer-v5.json');
const root = path.resolve(__dirname, '..');
const { ROUTE_HISTORY_KEY } = require('../miniprogram/services/knowledge-platform/route-progress');
const clone = value => JSON.parse(JSON.stringify(value));

function loadPage(storage = new Map(), failure = { value: false }) {
  let definition;
  const calls = { switchTab: [], redirectTo: [], navigateBack: [], toast: [] };
  const file = path.join(root, 'miniprogram/subpackages/politics/route/guided-route.js');
  const wx = {
    getStorageSync(key) { if (failure.value) throw new Error('read failed'); return storage.get(key); },
    setStorageSync(key, value) { if (failure.value) throw new Error('save failed'); storage.set(key, clone(value)); },
    removeStorageSync(key) { if (failure.value) throw new Error('remove failed'); storage.delete(key); },
    switchTab(value) { calls.switchTab.push(value.url); value.success?.(); },
    redirectTo(value) { calls.redirectTo.push(value.url); },
    navigateBack(value) { calls.navigateBack.push(value); },
    showToast(value) { calls.toast.push(value.title); },
    setNavigationBarTitle() {}, pageScrollTo() {},
  };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { require: createRequire(file), wx, Page(value) { definition = value; }, console, clearTimeout });
  const page = { ...definition, data: clone(definition.data), setData(patch) { Object.assign(this.data, patch); } };
  return { page, calls, storage, failure };
}

function validate() {
  const primer = artifact.primer;
  const review = require('../docs/knowledge-platform/implementations/evidence/politics-quick-overview-v5-user-view-source-review-20261024.json');
  assert.equal(review.status, 'source-checked-ux-pending');
  assert.equal(review.sourceSha256, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, review.sourcePath))).digest('hex'));
  assert.equal(review.userExperienceAccepted, false);
  assert.equal(review.published, false);
  assert.equal(primer.id, 'politics-quick-primer-v5');
  assert.ok(primer.sections.length > 0);
  assert.deepEqual(new Set(primer.sections.map(section => section.responsibility)), new Set(['orientation', 'marx', 'xi-theme', 'xi-practice', 'closure']));
  const blocks = new Map(sourcePackage.points.flatMap(point => [...point.contentBlocks, ...point.confusionBlocks].map(block => [
    `block:${point.id}:${block.id}`, [block.title, block.text, ...(block.items || []), ...(block.rows || []).flat()].filter(value => typeof value === 'string' && value).join('\n'),
  ])));
  const covered = new Set();
  const plan = platform.planRecommendedRoute(knowledgePackage, 'quick');
  assert.equal(plan.primerId, primer.id);
  assert.equal(plan.steps.length, primer.sections.length);
  let session = platform.createRouteSession(plan, 1);
  let defaultChars = 0;
  assert.equal(platform.applyRouteSessionEvent(plan, session, { type: 'COMPLETE_QUICK_PRIMER', at: 2 }).status, 'active');
  for (const [index, section] of primer.sections.entries()) {
    const textCount = section.narrativeSegments.reduce((sum, segment) => sum + segment.text.length, 0);
    // Reading burden is reviewed with the whole narrative; no legacy per-page cap.
    defaultChars += textCount;
    assert.equal(section.detailTargets.length, 0, 'quick overview still asks for per-section detailed reading');
    for (const segment of [...section.narrativeSegments, ...(section.optionalIndex || [])]) {
      for (const evidence of segment.sourceEvidence) {
        const original = blocks.get(evidence.blockId);
        assert.equal(original.split(evidence.quote).length, 2);
        assert.equal(crypto.createHash('sha256').update(original).digest('hex'), evidence.sourceTextSha256);
      }
      for (const id of segment.coverageUnitIds) {
        assert.ok(segment.sourceEvidence.some(ref => ref.blockId.startsWith(`block:${id}:`)));
        covered.add(id);
      }
    }
    const qp = platform.projectQuickPrimerViewModel(knowledgePackage, plan, session);
    const current = qp.sections.find(item => item.id === qp.currentSectionId);
    assert.equal(current.id, section.id);
    assert.equal(current.title, section.title);
    assert.equal(qp.position, index + 1);
    assert.equal(qp.total, primer.sections.length);
    assert.equal(qp.nextLabel, section.nextLabel);
    assert.ok(qp.nextActionLabel.length <= 6, section.id + ' action label is too wide for the shared center slot');
    assert.equal(current.narrativeSegments.length, 0, 'full explanations returned to the quick default path');
    assert.equal(current.reading.takeawayRuns.map(run => run.text).join(''), section.narrativeSegments.find(segment => segment.role === 'takeaway').text);
    assert.deepEqual(current.reading.beats.map(beat => beat.runs.map(run => run.text).join('')), section.narrativeSegments.filter(segment => segment.role === 'beat').map(segment => segment.text));
    if (index === 3) {
      for (const term of ['十个明确', '十四个坚持', '十三个方面成就', '六个必须坚持']) {
        const beat = current.reading.optionalIndex.find(beat => beat.label === term);
        assert.ok(beat, term + ' has no visible concept label');
        assert.ok(beat.runs.some(run => run.role === 'key' && run.text !== term), term + ' has no emphasized meaning or relation');
      }
    }
    if (index < primer.sections.length - 1) session = platform.applyRouteSessionEvent(plan, session, { type: 'NEXT_QUICK_SECTION', at: index + 2 });
  }
  assert.ok([...covered].every(id => knowledgePackage.knowledgeUnits.some(unit => unit.id === id)));
  assert.ok(artifact.primer.sections.find(section => section.responsibility === 'marx').narrativeSegments.some(segment => segment.label.includes('科学社会主义')));
  assert.ok(defaultChars > 0);
  session = platform.applyRouteSessionEvent(plan, session, { type: 'COMPLETE_QUICK_PRIMER', at: 10 });
  assert.equal(session.status, 'completed');
  assert.equal(session.completedStepIds.length, primer.sections.length);
  assert.equal(session.quickReferenceOpened, false);
  assert.equal(platform.projectRouteViewModel(knowledgePackage, plan, session).guide.completion.primaryAction.id, 'return-home');

  let skippedSession = platform.createRouteSession(plan, 1);
  const skippedStepId = skippedSession.currentStepId;
  skippedSession = platform.applyRouteSessionEvent(plan, skippedSession, { type: 'SKIP_QUICK_SECTION', at: 2 });
  assert.equal(skippedSession.currentIndex, 1);
  assert.ok(skippedSession.skippedStepIds.includes(skippedStepId));
  assert.ok(!skippedSession.completedStepIds.includes(skippedStepId));
  assert.equal(platform.projectQuickPrimerViewModel(knowledgePackage, plan, skippedSession).progressSteps[0].state, 'skipped');

  const loaded = loadPage();
  loaded.page.onLoad({ type: 'quick' });
  loaded.page.handleQuickSkip();
  assert.equal(loaded.page.session.currentIndex, 1);
  assert.equal(loaded.page.session.skippedStepIds.length, 1);
  loaded.page.handleQuickPrevious();
  loaded.page.handleQuickNext();
  assert.equal(loaded.page.session.skippedStepIds.length, 0, 'reading a previously skipped section did not replace its skipped state');
  const savedStep = loaded.page.session.currentStepId;
  loaded.page.handleQuickLater();
  assert.deepEqual(loaded.calls.switchTab, ['/pages/politics/index']);
  assert.equal(loaded.calls.navigateBack.length, 0);
  assert.equal(loaded.storage.get('knowledgeRoute:politics:quick').session.currentStepId, savedStep);
  const home = platform.projectHomeDecision(knowledgePackage, { routeRecords: [loaded.storage.get('knowledgeRoute:politics:quick')] });
  assert.equal(home.recommendedAction.label, '继续导读');
  assert.ok(home.description.includes(primer.sections[1].shortTitle));
  const resumed = loadPage(loaded.storage);
  resumed.page.onLoad({ type: 'quick', resume: '1' });
  assert.equal(resumed.page.session.currentStepId, savedStep);
  resumed.page.onUnload();
  assert.equal(resumed.storage.get('knowledgeRoute:politics:quick').session.currentStepId, savedStep);
  const failure = { value: false };
  const failed = loadPage(new Map(), failure);
  failed.page.onLoad({ type: 'quick' });
  failure.value = true;
  failed.page.handleQuickLater();
  assert.equal(failed.calls.switchTab.length, 0);
  assert.equal(failed.page.data.screen, 'unsaved');
  assert.equal(failed.page.data.storageStatus.ok, false);

  const oldRecord = { planOptions: { ...plan.options, quickPrimerId: 'politics-quick-primer-v2' }, session: { ...clone(session), status: 'active', currentIndex: 3, packageVersion: 'old-eight-section-build' } };
  const oldStorage = new Map([['knowledgeRoute:politics:quick', clone(oldRecord)]]);
  const migrated = loadPage(oldStorage);
  migrated.page.onLoad({ type: 'quick' });
  assert.equal(migrated.page.data.screen, 'expired');
  assert.deepEqual(oldStorage.get('knowledgeRoute:politics:quick'), oldRecord, 'old eight-step progress was overwritten before explicit restart');
  migrated.page.handleRecoveryAction();
  assert.equal(migrated.page.session.currentIndex, 0);
  assert.equal(oldStorage.get(ROUTE_HISTORY_KEY)?.length, 1, 'old route was not archived');

  const v4Record = { planOptions: {...plan.options, quickPrimerId:'politics-quick-primer-v4'}, session:{...clone(session),status:'active',currentIndex:3,packageVersion:'retired-v4-content-package'} };
  const v4Storage = new Map([['knowledgeRoute:politics:quick',clone(v4Record)]]);
  const v4Page = loadPage(v4Storage);
  v4Page.page.onLoad({type:'quick'});
  assert.equal(v4Page.page.data.screen,'expired');
  assert.deepEqual(v4Storage.get('knowledgeRoute:politics:quick'),v4Record);
  v4Page.page.handleRecoveryAction();
  assert.equal(v4Page.page.session.currentIndex,0);
  assert.equal(v4Storage.get(ROUTE_HISTORY_KEY).length,1);
  while (resumed.page.session.currentIndex < primer.sections.length - 1) resumed.page.handleQuickNext();
  resumed.page.handleQuickComplete();
  assert.equal(resumed.page.data.screen, 'completed');
  assert.equal(resumed.page.session.quickReflection.status, 'pending');
  resumed.page.handleCompletionPrimary();
  assert.equal(resumed.calls.switchTab.at(-1), '/pages/politics/index');
  const systematic = platform.planRecommendedRoute(knowledgePackage, 'systematic');
  const systematicRecord = { planOptions: systematic.options, session: platform.createRouteSession(systematic, 1) };
  resumed.storage.set('knowledgeRoute:politics:systematic', clone(systematicRecord));
  resumed.page.handleQuickSystematic();
  assert.equal(resumed.calls.redirectTo.at(-1), '/subpackages/politics/route/index?type=systematic&resume=1');
  assert.deepEqual(resumed.storage.get('knowledgeRoute:politics:systematic'), systematicRecord);
  const template = fs.readFileSync(path.join(root, 'miniprogram/subpackages/politics/route/guided-route.wxml'), 'utf8');
  const styles = fs.readFileSync(path.join(root, 'miniprogram/subpackages/politics/route/guided-route.wxss'), 'utf8');
  assert.ok(template.includes('bindtap="handleQuickLater"'));
  assert.ok(template.includes('bindtap="handleQuickSkip"'));
  assert.ok(template.includes('guided-action-left') && template.includes('guided-action-center') && template.includes('guided-action-right'));
  assert.ok(template.includes('class="quick-inline-{{item.role}}"'));
  assert.match(styles,/\.quick-inline-key\s*\{[^}]*box-shadow:\s*var\(--ui-emphasis-key-shadow\)/);
  assert.match(styles,/\.quick-inline-boundary\s*\{[^}]*text-underline-offset:\s*var\(--ui-emphasis-boundary-offset\)/);
  assert.ok(!template.match(/quick-progress-context[^]*?<view wx:else class="route-progress-row">/)[0].includes('handleRoutePause'));
  const negativeBuilder = `
    const fs = require('node:fs');
    const originalRead = fs.readFileSync;
    const root = process.argv[1];
    const variant = process.argv[2];
    fs.readFileSync = function(file, options) {
      const result = originalRead.apply(this, arguments);
      if (!String(file).endsWith('/sources/politics/quick-primer-v5.json')) return result;
      const copy = JSON.parse(result);
      const segments = copy.primer.sections.flatMap(section => section.narrativeSegments);
      if (variant === 'source') segments.find(segment => segment.sourceEvidence.length).sourceEvidence[0].sourceTextSha256 = 'drifted';
      if (variant === 'responsibility') copy.primer.sections.forEach(section => { section.responsibility = 'missing'; });
      if (variant === 'split') { const extra = structuredClone(copy.primer.sections[1]); copy.primer.sections.splice(2, 0, extra); copy.primer.sections.forEach((section,index) => { section.order=index+1; section.id='J2V5-SEC-'+String(index+1).padStart(2,'0'); }); }
      if (variant === 'emphasis') segments[0].emphasis = [{ part: 'text', quote: 'missing-quote', occurrence: 1, role: 'key' }];
      return JSON.stringify(copy);
    };
    process.argv = ['node', 'builder', '--profile=toc-v2', '--scope=runtime', '--check-only'];
    require(root + '/scripts/build-politics-knowledge.js');
  `;
  for (const [variant, expected] of [['source', /source evidence drifted/], ['responsibility', /responsibilities/], ['emphasis', /无法精确定位/]]) {
    const child = spawnSync(process.execPath, ['-e', negativeBuilder, root, variant], { encoding: 'utf8' });
    assert.notEqual(child.status, 0, `builder accepted ${variant} corruption`);
    assert.match(child.stderr, expected);
  }
  const split = spawnSync(process.execPath, ['-e', negativeBuilder, root, 'split'], {encoding:'utf8'});
  assert.equal(split.status, 0, 'a valid split was rejected by a fixed page-count rule');
  loaded.page.setData({quickIndexExpanded:false});
  const beforeIndex = clone(loaded.page.session);
  loaded.page.handleQuickIndex();
  assert.equal(loaded.page.data.quickIndexExpanded, true);
  assert.deepEqual(loaded.page.session, beforeIndex, 'optional index changed progress');
  return { status: 'passed', sections: primer.sections.length, defaultChars, visiblyGroupedUnits: covered.size, fullReferenceRequired: false, saveAndResume: true, legacyRestartExplicit: true };
}

module.exports = { validate };
if (require.main === module) console.log(JSON.stringify(validate()));
