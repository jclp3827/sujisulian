const readingSurfacePolicy = require('../../../services/knowledge-platform/reading-surface-policy');
const readingUi = require('../../../services/knowledge-platform/reading-ui');
const { knowledgePackage } = require('../../../services/knowledge-platform/politics-runtime');
const { planLearningRoute, createRouteSession, normalizeRouteSession, applyRouteSessionEvent,
  projectRouteViewModel, getDisplayPreferences } = require('../../../services/knowledge-platform/index');
const units = require('../../../services/knowledge-platform/systematic-units');
const { LEGACY_ROUTE_KEY, routeProgressKey, selectRouteRecord, recordIdentity,
  savedSystematicRecords, switchSystematicRecord } = require('../../../services/knowledge-platform/route-progress');
const { progressPercent } = require('../../../utils/progress');
const KEY = routeProgressKey('systematic');

// Four explicitly selected visual samples; no curriculum-wide opt-in.
const systematicVisualLessonEnabled = view => readingSurfacePolicy.systematicEnabled(view);
function projectSystematicVisualLesson(view) {
  const shown = readingUi.projectReadingLesson(view);
  if (!systematicVisualLessonEnabled(shown) || shown.readingTitle !== undefined) return shown;
  return {...shown,readingTitle:shown.title,readingOrdinal:''};
}

Page({
  data: { screen: 'groups', groups: [], routes: [], visibleGroups: [], selectedRouteId: 'thought', currentCard: null, nextGroup: null, view: null, error: '', referenceVisible: false,
    sourcesVisible: false, displayPreferences: {}, hasCurrent: false, hasLegacy: false, reviewing: false, lessonRows: [] },

  onLoad(options = {}) {
    this.options = {...options};
    for (const key of ['fromPlan','nextGroup','continueFrom']) {
      if (typeof this.options[key] !== 'string') continue;
      try { this.options[key] = decodeURIComponent(this.options[key]); }
      catch (error) { delete this.options[key]; }
    }
    this.load();
  },
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
        const savedPlanId = recordIdentity(this.record);
        const plan = planLearningRoute(knowledgePackage, this.record.planOptions);
        const session = plan ? normalizeRouteSession(plan, this.record.session) : null;
        if (!plan || session?.status === 'expired') return this.setData({ screen: 'expired' });
        this.plan = plan; this.session = session;
        if (savedPlanId !== plan.id) this.write({ planOptions: plan.options, session },
          { replacePlanIds: [savedPlanId], preserveCurrentAsRecovery: true });
        const current = plan.steps[session.currentIndex];
        if (this.options.continueFrom === current.lessonId && plan.steps[session.currentIndex + 1]
            && (session.completedStepIds.includes(current.stepId) || session.skippedStepIds.includes(current.stepId))) {
          this.dispatch('CONTINUE_SYSTEMATIC_UNIT', current.stepId);
          return;
        }
        const suggested = units.nextGroupFor(knowledgePackage, plan, this.records());
        if (this.options.nextGroup && this.options.fromPlan === plan.id && session.status === 'completed'
            && plan.steps.every(step => session.completedStepIds.includes(step.stepId))
            && suggested?.id === this.options.nextGroup) {
          this.activateGroup(suggested);
          return;
        }
        if (this.options.resume === '1') this.render(true);
        else this.showRouteGroups(units.routeForGroup(plan.groupId)?.id);
      } else this.showRouteGroups(this.options.routeId);
      wx.setNavigationBarTitle({ title: '系统学习' });
    } catch (error) {
      this.retry = () => this.load();
      this.setData({ screen: 'error', error: '暂时无法读取学习位置，请重试。' });
    }
  },
  records() { return [this.record,...savedSystematicRecords(this.record)].filter(Boolean); },
  handleRoute(event) {
    const id = event.currentTarget.dataset.routeId;
    this.showRouteGroups(id);
  },
  showRouteGroups(routeId) {
    const routes = units.routeCards(knowledgePackage,this.records());
    const route = routes.find(route => route.id === routeId) || routes[0];
    if (!route) return this.setData({screen:'unavailable'});
    const currentRoute = this.plan && units.routeForGroup(this.plan.groupId);
    const currentStep = this.plan && this.session ? this.plan.steps[this.session.currentIndex] : null;
    const nextGroup = this.plan && this.session?.status === 'completed'
      ? units.nextGroupFor(knowledgePackage,this.plan,this.records()) : null;
    const currentCard = currentRoute?.id === route.id && currentStep ? {
      routeTitle: currentRoute.title,
      groupTitle: nextGroup?.title || this.plan.scopeTitle,
      title: nextGroup ? units.displayTitleForLessonId(nextGroup.lessonIds[0]) : currentStep.title,
      action: nextGroup ? '进入下一主题' : this.session.status === 'completed' ? '查看当前主题' : '继续当前小节',
    } : null;
    this.setData({screen:'groups',routes,selectedRouteId:route.id,
      visibleGroups:route.groups.map(group => {
        const completed = group.read === group.count;
        const progressState = completed ? 'complete' : group.hasProgress ? 'active' : 'idle';
        return {...group,completed,progressState,
          progressPercent:progressPercent(group.read, group.count),
          progressLabel:group.read ? `已读 ${group.read} / ${group.count} 小节` : `共 ${group.count} 小节`,
          statusLabel:completed ? '已读完' : group.hasProgress ? '进行中' : '未开始',
          action:completed ? '回看这一主题' : group.hasProgress ? '继续这一主题' : '了解这一主题'};
      }),
      routeScope:route.scope,routeSummary:route.summary,currentCard,hasCurrent:Boolean(this.session),hasLegacy:Boolean(this.legacyRecord()),error:''});
  },
  handleCurrent() {
    if (!this.plan || !this.session) return;
    const next = this.session.status === 'completed' ? units.nextGroupFor(knowledgePackage,this.plan,this.records()) : null;
    if (next) this.activateGroup(next);
    else this.render(true);
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
    const view = projectSystematicVisualLesson(projectRouteViewModel(knowledgePackage, this.plan, this.session));
    if (!view) return this.setData({ screen: 'expired' });
    const route = units.routeCards(knowledgePackage,this.records()).find(route => route.id === units.routeForGroup(this.plan.groupId)?.id);
    const atGroupEnd = this.session.currentIndex === this.plan.steps.length - 1;
    const nextGroup = atGroupEnd ? units.nextGroupFor(knowledgePackage,this.plan,this.records()) : null;
    const currentAlreadyRead = this.session.completedStepIds.includes(view.stepId);
    const routeWouldComplete = route && route.read + (currentAlreadyRead ? 0 : 1) === route.count;
    const completionAction = view.nextTitle ? '继续下一节'
      : nextGroup ? '进入下一主题'
        : routeWouldComplete ? '完成本篇' : '查看本篇进度';
    this.pendingAnchor = view.anchor;
    const routeRead = route?.read || 0, routeCount = route?.count || 0;
    this.setData({ screen: 'lesson', readingUiEnabled: readingUi.lessonEnabled(view) || systematicVisualLessonEnabled(view), systematicVisualEnabled: systematicVisualLessonEnabled(view), view:{...view,routeTitle:route?.title || '',routeRead,routeCount,routeProgressPercent:progressPercent(routeRead, routeCount),completionAction}, reviewing: false, hasCurrent: true, error: '', sourcesVisible: false,
      nextGroup,
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
  advance(type, stepId) {
    const event = { type, stepId, curriculumVersion: this.plan.curriculumVersion, at: Date.now() };
    let next = applyRouteSessionEvent(this.plan, this.session, event);
    if (JSON.stringify(next) === JSON.stringify(this.session)) return true;
    if (next.status === 'active' && this.plan.steps[next.currentIndex + 1]) {
      next = applyRouteSessionEvent(this.plan, next, { ...event, type:'CONTINUE_SYSTEMATIC_UNIT' });
    }
    try {
      this.write({ planOptions: this.plan.options, session: next });
      this.session = next;
      if (next.status === 'completed') {
        const following = units.nextGroupFor(knowledgePackage,this.plan,this.records());
        if (following) return this.activateGroup(following);
      }
      this.scrollTop = 0;
      this.render(true);
      return true;
    } catch (error) { this.setError(() => this.advance(type, stepId)); return false; }
  },
  handleComplete(event) { this.advance('COMPLETE_SYSTEMATIC_UNIT', event.currentTarget.dataset.stepId); },
  handleSkip(event) { this.advance('SKIP_SYSTEMATIC_UNIT', event.currentTarget.dataset.stepId); },
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
    this.showRouteGroups(units.routeForGroup(this.plan?.groupId)?.id || this.data.selectedRouteId);
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },
  handleGroup(event) {
    const group = units.curriculum.groups.find(group => group.id === event.currentTarget.dataset.groupId);
    if (group) this.activateGroup(group);
  },
  activateGroup(group) {
    const plan = planLearningRoute(knowledgePackage, { type: 'systematic', experienceKind: units.KIND, groupId: group.id });
    if (!plan) return this.setData({ screen: 'expired' });
    const cached = units.recordForPlan(plan, [this.record, ...savedSystematicRecords(this.record)]);
    const normalized = cached ? normalizeRouteSession(plan, cached.session) : null;
    const session = normalized && normalized.status !== 'expired' ? normalized : createRouteSession(plan, Date.now());
    try {
      const preserveCurrentAsRecovery = recordIdentity(this.record) === plan.id && normalizeRouteSession(plan, this.record.session).status === 'expired';
      const replacePlanIds = cached && recordIdentity(cached) !== plan.id ? [recordIdentity(cached)] : [];
      const recoveryRecords = replacePlanIds.length ? [cached] : [];
      this.write({ planOptions: plan.options, session }, { preserveCurrentAsRecovery, replacePlanIds, recoveryRecords });
      this.plan = plan; this.session = session; this.reviewLessonId = null; this.scrollTop = 0;
      this.render(true);
      return true;
    } catch (error) {
      if (this.plan && this.session) this.render(true);
      this.setError(() => this.activateGroup(group));
      return false;
    }
  },
  handleLegacy() {
    const record = this.legacyRecord();
    if (!record) return;
    try {
      this.write(record); this.leaving = true;
      wx.redirectTo({ url: '/subpackages/politics/route/index?type=systematic&resume=1&legacy=1', fail: () => { this.leaving = false; this.setError(() => this.handleLegacy(), '暂时无法打开原学习任务，请重试。'); } });
    } catch (error) { this.setError(() => this.handleLegacy()); }
  },
  handleReview(event) {
    const index = Number(event.currentTarget.dataset.index), step = this.plan.steps[index];
    if (!step || (!this.session.completedStepIds.includes(step.stepId) && !this.session.skippedStepIds.includes(step.stepId))) return;
    if (!this.saveAnchor()) return;
    const view = projectSystematicVisualLesson({...projectRouteViewModel(knowledgePackage, this.plan, { ...this.session, currentIndex: index }), closeout:false});
    const progress = this.data.view;
    this.reviewStepId = step.stepId; this.reviewScrollTop = 0;
    this.setData({ screen: 'lesson', readingUiEnabled: readingUi.lessonEnabled(view) || systematicVisualLessonEnabled(view), systematicVisualEnabled: systematicVisualLessonEnabled(view), view: { ...view, closeout: false, anchor: null,
      routeTitle: progress.routeTitle, routeRead: progress.routeRead, routeCount: progress.routeCount, routeProgressPercent: progress.routeProgressPercent }, reviewing: true,
      reviewWasSkipped: this.session.skippedStepIds.includes(step.stepId), error: '' }, () => this.layout(true));
  },
  handleFinishReview() {
    const currentStep = this.plan.steps[this.session.currentIndex];
    if (this.dispatch('COMPLETE_SYSTEMATIC_REVISIT', currentStep.stepId, { targetStepId: this.reviewStepId }, false)) this.render(true);
  },
  handleReturnReview() { this.render(true); },
  handleReadingSettingsOpen() { this.setData({readingSettingsVisible:true}); },
  handleReadingSettingsClose() { this.setData({readingSettingsVisible:false}); },
  handleReadingPreferences(event) {
    readingUi.applyReaderPreferences(this, event.detail.preferences, {onLayout:()=>this.layout(false)});
  },
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
