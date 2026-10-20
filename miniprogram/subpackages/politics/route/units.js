const { knowledgePackage } = require('../../../services/knowledge-platform/politics-runtime');
const { planLearningRoute, createRouteSession, normalizeRouteSession, applyRouteSessionEvent,
  projectRouteViewModel, getDisplayPreferences } = require('../../../services/knowledge-platform/index');
const units = require('../../../services/knowledge-platform/systematic-units');
const { LEGACY_ROUTE_KEY, routeProgressKey, selectRouteRecord, recordIdentity,
  savedSystematicRecords, switchSystematicRecord } = require('../../../services/knowledge-platform/route-progress');
const KEY = routeProgressKey('systematic');

Page({
  data: { screen: 'groups', groups: [], view: null, preview: null, error: '', referenceVisible: false,
    sourcesVisible: false, displayPreferences: {}, hasCurrent: false, hasLegacy: false, reviewing: false, lessonRows: [] },

  onLoad(options = {}) { this.options = options; this.load(); },
  load() {
    try {
      if (!units.isPilotAvailable(knowledgePackage)) return this.setData({ screen: 'unavailable' });
      const own = wx.getStorageSync(KEY);
      this.ownRecordPresent = Boolean(own);
      this.record = selectRouteRecord('systematic', own, own ? null : wx.getStorageSync(LEGACY_ROUTE_KEY)) || null;
      savedSystematicRecords(this.record);
      this.setData({ groups: units.curriculum.groups.map(group => ({ ...group, count: group.lessonIds.length })),
        displayPreferences: getDisplayPreferences(), error: '', hasLegacy: Boolean(this.legacyRecord()) });
      if (this.record?.planOptions?.experienceKind === units.KIND) {
        const plan = planLearningRoute(knowledgePackage, this.record.planOptions);
        const session = plan ? normalizeRouteSession(plan, this.record.session) : null;
        if (!plan || session?.status === 'expired') return this.setData({ screen: 'expired' });
        this.plan = plan; this.session = session;
        const current = plan.steps[session.currentIndex];
        if (this.options.continueFrom === current.lessonId && plan.steps[session.currentIndex + 1]
            && (session.completedStepIds.includes(current.stepId) || session.skippedStepIds.includes(current.stepId))) this.dispatch('CONTINUE_SYSTEMATIC_UNIT', current.stepId);
        else this.render(true);
      } else this.setData({ screen: 'groups' });
      wx.setNavigationBarTitle({ title: '系统学习' });
    } catch (error) {
      this.retry = () => this.load();
      this.setData({ screen: 'error', error: '暂时无法读取学习位置，请重试。' });
    }
  },
  legacyRecord() {
    return [this.record, ...savedSystematicRecords(this.record)]
      .find(record => record?.planOptions?.type === 'systematic' && record.planOptions.experienceKind !== units.KIND) || null;
  },
  onShow() {
    this.setData({ displayPreferences: getDisplayPreferences() });
    if (this.returningFromSource) {
      this.returningFromSource = false;
      if (this.data.reviewing) wx.pageScrollTo({ scrollTop: this.reviewScrollTop || 0, duration: 0 });
      else this.render(true);
    }
  },
  onHide() { this.saveAnchor(); },
  onUnload() { this.saveAnchor(); },
  onPageScroll(event) {
    this.scrollTop = event.scrollTop || 0;
    if (this.data.reviewing) this.reviewScrollTop = this.scrollTop;
    if (!this.session || this.data.reviewing || this.data.view?.closeout) return;
    const part = (this.partPositions || []).filter(part => part.top <= this.scrollTop + (this.headerHeight || 70)).pop();
    this.pendingAnchor = part ? { partId: part.id, offset: Math.max(0, this.scrollTop + (this.headerHeight || 70) - part.top) } : null;
  },
  setError(retry, message = '进度未保存，请重试。') { this.retry = retry; this.setData({ error: message }); },
  write(next, options) {
    const live = wx.getStorageSync(KEY);
    if (this.ownRecordPresent && !live) throw new Error('Saved route was removed');
    if (live && (recordIdentity(live) !== recordIdentity(this.record)
        || JSON.stringify(live.session) !== JSON.stringify(this.record?.session))) throw new Error('Concurrent route update');
    const envelope = switchSystematicRecord(live || this.record, next, options);
    wx.setStorageSync(KEY, envelope);
    this.record = envelope;
    this.ownRecordPresent = true;
    return envelope;
  },
  render(restore = false) {
    const view = projectRouteViewModel(knowledgePackage, this.plan, this.session);
    if (!view) return this.setData({ screen: 'expired' });
    this.pendingAnchor = view.anchor;
    this.setData({ screen: 'lesson', view, reviewing: false, hasCurrent: true, error: '', sourcesVisible: false,
      lessonRows: this.plan.steps.map((step, index) => ({ ...step, index,
        read: this.session.completedStepIds.includes(step.stepId), skipped: this.session.skippedStepIds.includes(step.stepId) })) }, () => this.layout(restore));
  },
  layout(restore) {
    if (!wx.createSelectorQuery) return;
    const lessonId = this.data.view?.id;
    wx.createSelectorQuery().selectAll('.unit-part').boundingClientRect().select('.unit-progress').boundingClientRect().selectViewport().scrollOffset().exec(result => {
      if (this.data.view?.id !== lessonId || !Array.isArray(result[0])) return;
      this.headerHeight = (result[1]?.height || 60) + 12;
      this.scrollTop = result[2]?.scrollTop || 0;
      this.partPositions = result[0].filter(part => part.id).map(part => ({ id: part.id, top: part.top + this.scrollTop }));
      if (!restore) return;
      const anchor = this.data.view.anchor;
      const position = anchor && this.partPositions.find(part => part.id === anchor.partId);
      const top = position ? Math.max(0, position.top + anchor.offset - this.headerHeight) : 0;
      wx.pageScrollTo({ scrollTop: top, duration: 0 });
    });
  },
  saveAnchor() {
    if (this.leaving || !this.session || this.data.reviewing || this.data.screen !== 'lesson' || this.data.view?.closeout) return true;
    const step = this.plan.steps[this.session.currentIndex];
    const anchor = this.pendingAnchor || null;
    if (JSON.stringify(anchor) === JSON.stringify(this.session.unitAnchors?.[step.lessonId] || null)) return true;
    return this.dispatch('SAVE_UNIT_ANCHOR', step.stepId, { anchor }, false);
  },
  dispatch(type, stepId, extra = {}, render = true) {
    const event = { type, stepId, curriculumVersion: this.plan.curriculumVersion, at: Date.now(), ...extra };
    const next = applyRouteSessionEvent(this.plan, this.session, event);
    if (JSON.stringify(next) === JSON.stringify(this.session)) return true;
    try {
      this.write({ planOptions: this.plan.options, session: next });
      this.session = next;
      if (render) { this.scrollTop = 0; this.render(true); }
      else this.setData({ error: '' });
      return true;
    } catch (error) { this.setError(() => this.dispatch(type, stepId, extra, render)); return false; }
  },
  handleComplete(event) { this.dispatch('COMPLETE_SYSTEMATIC_UNIT', event.currentTarget.dataset.stepId); },
  handleNext(event) { this.dispatch('CONTINUE_SYSTEMATIC_UNIT', event.currentTarget.dataset.stepId); },
  handleSkip(event) { this.dispatch('SKIP_SYSTEMATIC_UNIT', event.currentTarget.dataset.stepId); },
  handleReference() {
    if (this.data.reviewing) return this.setData({ 'view.referenceVisible': !this.data.view.referenceVisible });
    this.dispatch('TOGGLE_UNIT_REFERENCE', this.data.view.stepId, {}, false); this.renderReference();
  },
  renderReference() {
    this.setData({ 'view.referenceVisible': Boolean(this.session.unitReferences?.[this.data.view.id]) });
  },
  handleExit() {
    if (!this.saveAnchor()) { this.retry = () => this.handleExit(); return; }
    if (this.data.error) return;
    wx.switchTab({ url: '/pages/politics/index' });
  },
  handleRetry() { const retry = this.retry; if (retry) retry(); },
  handleGroups() {
    if (!this.saveAnchor()) return;
    this.setData({ screen: 'groups', error: '', hasCurrent: Boolean(this.session), hasLegacy: Boolean(this.legacyRecord()) });
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },
  handleCancel() { if (this.session) this.render(true); else this.setData({ screen: 'groups', preview: null, error: '' }); },
  handleGroup(event) {
    const group = units.curriculum.groups.find(group => group.id === event.currentTarget.dataset.groupId);
    if (!group) return;
    this.pendingPlan = planLearningRoute(knowledgePackage, { type: 'systematic', experienceKind: units.KIND, groupId: group.id });
    if (!this.pendingPlan) return this.setData({ screen: 'expired' });
    const cached = [this.record, ...savedSystematicRecords(this.record)].find(record => recordIdentity(record) === this.pendingPlan.id);
    const session = cached ? normalizeRouteSession(this.pendingPlan, cached.session) : null;
    this.pendingSession = session?.status !== 'expired' ? session : null;
    this.setData({ screen: 'preview', preview: { title: group.title, scope: group.scope,
      count: group.lessonIds.length, firstTitle: this.pendingPlan.steps[this.pendingSession?.currentIndex || 0].title,
      action: this.pendingSession ? '继续本组' : '开始本组', retainingOld: Boolean(this.record?.session) }, error: '' });
  },
  handleStart() {
    if (!this.pendingPlan) return;
    const plan = this.pendingPlan, session = this.pendingSession || createRouteSession(plan, Date.now());
    try {
      const preserveCurrentAsRecovery = recordIdentity(this.record) === plan.id && normalizeRouteSession(plan, this.record.session).status === 'expired';
      this.write({ planOptions: plan.options, session }, { preserveCurrentAsRecovery });
      this.plan = plan; this.session = session; this.reviewLessonId = null; this.scrollTop = 0;
      this.render(true);
    } catch (error) { this.setError(() => this.handleStart()); }
  },
  handleLegacy() {
    const record = this.legacyRecord();
    if (!record) return;
    try {
      this.write(record); this.leaving = true;
      wx.redirectTo({ url: '/subpackages/politics/route/index?type=systematic&resume=1', fail: () => { this.leaving = false; this.setError(() => this.handleLegacy(), '暂时无法打开原学习任务，请重试。'); } });
    } catch (error) { this.setError(() => this.handleLegacy()); }
  },
  handleReview(event) {
    const index = Number(event.currentTarget.dataset.index), step = this.plan.steps[index];
    if (!step || (!this.session.completedStepIds.includes(step.stepId) && !this.session.skippedStepIds.includes(step.stepId))) return;
    if (!this.saveAnchor()) return;
    const view = projectRouteViewModel(knowledgePackage, this.plan, { ...this.session, currentIndex: index });
    this.reviewStepId = step.stepId; this.reviewScrollTop = 0;
    this.setData({ screen: 'lesson', view: { ...view, closeout: false, anchor: null }, reviewing: true,
      reviewWasSkipped: this.session.skippedStepIds.includes(step.stepId), error: '' }, () => this.layout(true));
  },
  handleFinishReview() {
    const currentStep = this.plan.steps[this.session.currentIndex];
    if (this.dispatch('COMPLETE_SYSTEMATIC_REVISIT', currentStep.stepId, { targetStepId: this.reviewStepId }, false)) this.render(true);
  },
  handleReturnReview() { this.render(true); },
  handleSources() { this.setData({ sourcesVisible: !this.data.sourcesVisible }); },
  handleSource(event) {
    const source = this.data.view.sources.find(source => source.id === event.currentTarget.dataset.pointId);
    if (!source || !this.saveAnchor()) return;
    this.returningFromSource = true;
    this.setData({ error: '' });
    wx.navigateTo({ url: `/subpackages/politics/detail/index?id=${encodeURIComponent(source.id)}&block=${encodeURIComponent(source.blockId)}&mode=reading&origin=systematic-unit`,
      fail: () => { this.returningFromSource = false; this.setError(() => this.handleSource(event), '暂时无法打开完整原文，请重试。'); } });
  },
});
