const { knowledgePackage } = require("../../../services/knowledge-platform/politics-runtime");
const {
  ROUTE_META,
  applyRouteSessionEvent,
  createRouteSession,
  fromRecentModuleContext,
  getDisplayPreferences,
  normalizeRouteSession,
  planLearningRoute,
  planRecommendedRoute,
  projectContrastRouteOptions,
  projectKnowledgeCardSurfaceViewModel,
  projectRouteScopeOptions,
  projectRouteScopePicker,
  projectRouteStart,
  projectRouteViewModel,
  projectSurfaceRecovery,
  storageKey,
} = require("../../../services/knowledge-platform/index");

const { LEGACY_ROUTE_KEY, ROUTE_HISTORY_KEY, routeProgressKey, selectRouteRecord, switchSystematicRecord } = require("../../../services/knowledge-platform/route-progress");
const { isPilotAvailable } = require('../../../services/knowledge-platform/systematic-units');
let storageFailure = null;

function readStorage(key) {
  try { return wx.getStorageSync(key); } catch (error) { storageFailure = error; return null; }
}

function writeStorage(key, value) {
  try {
    if (key === routeProgressKey('systematic') && value?.session && value?.planOptions) value = switchSystematicRecord(wx.getStorageSync(key), value);
    wx.setStorageSync(key, value); storageFailure = null; return true;
  }
  catch (error) { storageFailure = error; return false; }
}

function removeStorage(key) {
  try { wx.removeStorageSync(key); storageFailure = null; return true; }
  catch (error) { storageFailure = error; return false; }
}

function rebuildPlan(record) {
  return record?.planOptions ? planLearningRoute(knowledgePackage, record.planOptions) : null;
}

function cardFor(pointId, activity, systematicMode = false) {
  return pointId ? projectKnowledgeCardSurfaceViewModel(knowledgePackage, pointId, { activity, systematicMode }) : null;
}

Page({
  data: {
    type: "quick",
    unitPilotAvailable: isPilotAvailable(knowledgePackage),
    meta: ROUTE_META.quick,
    screen: "recommendation",
    start: null,
    route: null,
    quickStructureExpanded: false,
    quickExpandedSectionId: "",
    quickIndexExpanded: false,
    currentCard: null,
    routeRecallView: null,
    learningInstruction: "",
    contrastStageLabel: "",
    contrastNextLabel: "",
    systematicNextLabel: "进入系统学习",
    displayPreferences: {},
    contrastError: "",
    relationError: "",
    readingAnchorNotice: "",
    activeReadingBlockId: "",
    recovery: null,
    adjusting: false,
    adjustmentScopes: [],
    adjustmentScopeRows: [],
    adjustmentExpandedIds: [],
    adjustmentScopeSummary: "",
    adjustmentScopeId: "",
    adjustmentContrasts: [],
    systematicOrderExpanded: false,
    random: false,
    examKnowledgeError: "",
    completionReviewVisible: false,
    completionReviewError: "",
    storageStatus: { ok: true, message: "" },
    startFeedback: "",
    startError: "",
  },

  onLoad(options = {}) {
    storageFailure = null;
    this.entryOptions = { ...options };
    const type = ROUTE_META[options.type] ? options.type : "quick";
    const recent = readStorage(storageKey("politics"));
    this.knowledgeContext = fromRecentModuleContext(knowledgePackage, recent);
    const ownRecord = readStorage(routeProgressKey(type));
    const legacyRecord = readStorage(LEGACY_ROUTE_KEY);
    const activeRecord = selectRouteRecord(type, ownRecord, legacyRecord);
    if (type === 'systematic' && isPilotAvailable(knowledgePackage) && options.legacy !== '1') {
      wx.redirectTo({ url: '/subpackages/politics/route/units' });
      return;
    }
    const activePlan = rebuildPlan(activeRecord);
    this.activeRecord = activeRecord;
    this.plan = planRecommendedRoute(knowledgePackage, type, { currentPointId: recent?.pointId || null });
    this.session = null;
    if (!this.plan) {
      this.setData({ type, meta: ROUTE_META[type], screen: "expired", recovery: projectSurfaceRecovery(type === "quick" ? "content-unavailable" : "data-unavailable") });
      return;
    }
    if (activePlan && activePlan.type === type && activeRecord.session) {
      this.plan = activePlan;
      this.session = normalizeRouteSession(activePlan, activeRecord.session);
    }
    this.setData({
      type,
      meta: ROUTE_META[type],
      displayPreferences: getDisplayPreferences(),
      storageStatus: storageFailure ? { ok: false, message: "暂时无法读取或保存本次进度" } : { ok: true, message: "" },
    });
    wx.setNavigationBarTitle({ title: ROUTE_META[type].label });
    if (type === "quick") {
      if (activeRecord?.session?.status === "active" && (!activePlan || this.session?.status === "expired")) {
        return this.setData({ screen: "expired", recovery: projectSurfaceRecovery("route-expired"), route: null });
      }
      if (this.session?.status === "active") {
        return this.renderSession();
      }
      return this.startFresh();
    }
    if (type === 'confusion' && activeRecord?.session && (!activePlan || this.session?.status === 'expired')) {
      this.setData({ screen: 'expired', recovery: projectSurfaceRecovery('route-expired'), route: null });
      return;
    }
    if (options.resume === "1" && this.session) this.renderSession();
    else this.renderRecommendation();
  },

  onUnload() {
    if (this.readingHighlightTimer) clearTimeout(this.readingHighlightTimer);
    if (this.data.type === "quick" && this.session?.status === "active") {
      writeStorage(routeProgressKey("quick"), { planOptions: this.plan.options, session: this.session });
    }
  },

  onPageScroll(event) { if (this.data.type === "quick") this.quickScrollTop = event.scrollTop || 0; },
  onShow() {
    this.setData({ displayPreferences: getDisplayPreferences() });
    if (this.pendingContrastEvidenceSide) {
      const pending = this.pendingContrastEvidenceSide;
      this.pendingContrastEvidenceSide = null;
      if (this.session?.currentStepId === pending.stepId && pending.acknowledged) this.dispatch("VIEW_CONTRAST_SIDE", { side: pending.side });
      else if (this.session?.currentStepId === pending.stepId) this.setData({ contrastError: "这侧原文未能显示，请重新打开。" });
    }
    if (this.pendingExamRemedy) {
      const pending = this.pendingExamRemedy;
      this.pendingExamRemedy = null;
      if (this.session?.status === "completed" && pending.acknowledged) this.dispatch("VIEW_REMEDY", { stepId: pending.stepId });
      else if (this.session?.status === "completed") this.setData({ completionReviewError: "完整知识尚未成功显示，请重试回看。" });
    }
    if (this.pendingActiveExamRemedy) {
      const pending = this.pendingActiveExamRemedy;
      this.pendingActiveExamRemedy = null;
      if (this.session?.status === "active" && this.session.currentStepId === pending.stepId && pending.acknowledged) this.dispatch("VIEW_REMEDY", { stepId: pending.stepId });
      else if (this.session?.status === "active" && this.session.currentStepId === pending.stepId) this.setData({ examKnowledgeError: "完整知识尚未成功显示，请重试。" });
    }
    if (this.pendingSystemReturn) {
      this.pendingSystemReturn = false;
      this.renderSession();
    }
    if (!this.pendingQuickReturn) return;
    this.pendingQuickReturn = false;
    wx.pageScrollTo({ scrollTop: this.quickScrollTop || 0, duration: 0 });
  },

  renderRecommendation() {
    this.setData({
      screen: "recommendation",
      start: projectRouteStart(this.plan, this.session),
      route: null,
      currentCard: null,
      contrastError: "",
      relationError: "",
      recovery: null,
      examKnowledgeError: "",
      completionReviewVisible: false,
      systematicOrderExpanded: false,
      });
  },

  handlePrimaryStart() {
    this.setData({ startFeedback: this.data.type === "confusion" ? "正在打开本组辨析…" : "正在打开第一个知识…", startError: "" });
    this.openPrimaryRoute();
  },

  openPrimaryRoute() {
    try {
      if (!this.data.storageStatus.ok && !this.session) return this.handleStorageRetry();
      if (this.session?.status === "active") return this.renderSession();
      if (this.data.type === "exam" && this.session?.status === "completed") return this.startNextExamRound();
      return this.startFresh();
    } catch (error) {
      console.error("route start failed", error);
      this.setData({ startFeedback: "", startError: "暂时无法打开知识卡，请重试；若仍失败，请反馈此提示。" });
    }
  },

  archiveActiveRoute(status = "paused") {
    if (!this.activeRecord?.session) return true;
    storageFailure = null;
    const history = readStorage(ROUTE_HISTORY_KEY);
    if (storageFailure) return false;
    const records = Array.isArray(history) ? history : [];
    records.push({ ...this.activeRecord, session: { ...this.activeRecord.session, status, updatedAt: Date.now() } });
    if (!writeStorage(ROUTE_HISTORY_KEY, records.slice(-8))) return false;
    const legacy = readStorage(LEGACY_ROUTE_KEY);
    if (storageFailure) return false;
    if (legacy?.planOptions?.type === this.plan.type && !removeStorage(LEGACY_ROUTE_KEY)) return false;
    if (this.plan.type !== 'systematic' && !removeStorage(routeProgressKey(this.plan.type))) return false;
    this.activeRecord = null;
    return true;
  },

  startFresh() {
    this.session = createRouteSession(this.plan, Date.now());
    this.persistAndRender();
  },

  persistAndRender() {
    this.session = normalizeRouteSession(this.plan, this.session);
    const record = { planOptions: this.plan.options, session: this.session };
    const stored = writeStorage(routeProgressKey(this.plan.type), record);
    this.activeRecord = record;
    this.renderSession();
    if (!stored) this.setData({ screen: "unsaved", storageStatus: { ok: false, message: "本次进度还在当前页面，但尚未保存" } });
    else this.setData({ storageStatus: { ok: true, message: "" } });
  },

  renderSession() {
    this.session = normalizeRouteSession(this.plan, this.session);
    if (this.session.status === "expired") {
      this.setData({ screen: "expired", recovery: projectSurfaceRecovery("route-expired"), route: null });
      return;
    }
    const route = projectRouteViewModel(knowledgePackage, this.plan, this.session);
    const current = route.current;
    const viewed = route.experience.confusion?.evidenceViewed;
    const cardActivity = current?.stage === "recall" || this.plan.type === "exam" ? "recall" : "reading";
    const currentCard = cardFor(current?.pointId, cardActivity, this.plan.type === "systematic");
    const routeRecallView = current?.recall ? {
      ...current.recall,
      answerVisible: Boolean(current.revealed),
      response: current.response || null,
    } : null;
    this.setData({
      screen: this.session.status === "completed" ? "completed" : "active",
      route,
      currentCard,
      routeRecallView,
      contrastNextLabel: current?.stage === "boundary" ? "查看原文依据"
        : viewed?.left && viewed?.right ? route.guide.next ? "再辨析一次" : "查看本组结果"
          : viewed?.left || viewed?.right ? "还需查看另一侧原文" : "先查看两侧原文",
      systematicNextLabel: this.plan.type === "quick" && this.session.status === "completed" ? this.systematicContinuation().label : "进入系统学习",
      contrastStageLabel: this.plan.type === "confusion" ? ({ judgment: "先判断", boundary: "核对边界", evidence: "查看依据", retest: "再辨一次" }[current?.stage] || "") : "",
      learningInstruction: this.plan.type === "confusion" ? ({ judgment: "先在心中判断，再选择。", boundary: "对照两侧知识，核对下面的区别。", evidence: route.experience.confusion?.evidenceViewed.left && route.experience.confusion?.evidenceViewed.right ? (route.guide.next ? "两侧原文已查看，可以再辨析一次。" : "两侧原文已查看，可以查看结果。") : "对照下方要点，分别查看两侧原文。", retest: route.experience.confusion?.contrastPair?.variantCheck ? "根据材料，选择更符合题意的一项。" : "再判断一次，选择现在能否分清。" }[current?.stage] || "") : current?.stage === "reading" ? "读完后进入回忆。" : current?.response ? "需要时查看原文，也可继续。" : current?.revealed ? "对照答案，选择自评。" : "先想答案，再揭晓。",
      contrastError: "",
      relationError: "",
      recovery: null,
      adjusting: false,
      examKnowledgeError: "",
    });
  },

  dispatch(type, extra = {}) {
    this.session = applyRouteSessionEvent(this.plan, this.session, { type, ...extra, at: Date.now() });
    this.persistAndRender();
  },

  persistQuickSession() {
    const record = { planOptions: this.plan.options, session: this.session };
    const stored = writeStorage(routeProgressKey(this.plan.type), record);
    this.activeRecord = record;
    if (!stored) this.setData({ screen: "unsaved", storageStatus: { ok: false, message: "本次进度还在当前页面，但尚未保存" } });
    else this.setData({ storageStatus: { ok: true, message: "" } });
  },

  handleStorageRetry() {
    if (!this.session) {
      storageFailure = null;
      readStorage(storageKey("politics"));
      readStorage(routeProgressKey(this.data.type));
      readStorage(LEGACY_ROUTE_KEY);
      if (storageFailure) {
        this.setData({ storageStatus: { ok: false, message: "仍无法读取上次进度，请稍后再试" } });
        return;
      }
      this.onLoad(this.entryOptions || { type: this.data.type });
      return;
    }
    if (!this.plan) return;
    const record = { planOptions: this.plan.options, session: this.session };
    if (!writeStorage(routeProgressKey(this.plan.type), record)) {
      this.setData({ screen: "unsaved", storageStatus: { ok: false, message: "仍未保存，请稍后再试" } });
      return;
    }
    this.activeRecord = record;
    this.setData({ storageStatus: { ok: true, message: "" } });
    this.renderSession();
  },

  moveQuickStep(type) {
    if (!this.plan?.primerId || this.session?.status !== "active") return;
    const next = applyRouteSessionEvent(this.plan, this.session, { type, at: Date.now() });
    if (next.currentStepId === this.session.currentStepId) return;
    this.session = next;
    this.quickScrollTop = 0;
    this.setData({ quickStructureExpanded: false, quickExpandedSectionId: "", quickIndexExpanded: false });
    this.persistAndRender();
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },
  handleQuickIndex() { this.setData({ quickIndexExpanded: !this.data.quickIndexExpanded }); },
  handleQuickNext() { this.moveQuickStep("NEXT_QUICK_SECTION"); },
  handleQuickSkip() { this.moveQuickStep("SKIP_QUICK_SECTION"); },
  handleQuickPrevious() { this.moveQuickStep("PREVIOUS_QUICK_SECTION"); },
  handleQuickPause() {
    if (!this.plan?.primerId || this.session?.status !== "active") return;
    this.handleRoutePause();
  },
  handleQuickLater() {
    if (this.data.type !== "quick" || this.session?.status !== "active") return;
    const record = { planOptions: this.plan.options, session: this.session };
    if (!writeStorage(routeProgressKey("quick"), record)) {
      this.setData({ screen: "unsaved", storageStatus: { ok: false, message: "离开前未能保存当前位置，请重试保存" } });
      return;
    }
    this.activeRecord = record;
    wx.switchTab({ url: "/pages/politics/index", success: () => wx.showToast({ title: "已保留位置，下次可继续", icon: "none" }) });
  },

  handleQuickDetail(event) {
    const sectionId = event.currentTarget.dataset.sectionId;
    const pointId = event.currentTarget.dataset.pointId;
    const section = this.data.route?.experience?.quickPrimer?.sections?.find((item) => item.id === sectionId);
    if (!section || section.id !== this.data.route.experience.quickPrimer.currentSectionId || section.detail?.pointId !== pointId) return;
    const beforeStepId = this.session.currentStepId;
    this.session = applyRouteSessionEvent(this.plan, this.session, { type: "OPEN_QUICK_DETAIL", sectionId, pointId, at: Date.now() });
    if (this.session.currentStepId !== beforeStepId) return;
    this.persistQuickSession();
    this.pendingQuickReturn = true;
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(pointId)}&mode=reading&origin=quick-primer&routeId=${encodeURIComponent(this.plan.id)}&goalType=quick&scopeId=${encodeURIComponent(this.plan.scopeId)}&stepId=${encodeURIComponent(beforeStepId)}&sectionId=${encodeURIComponent(sectionId)}&goalLabel=${encodeURIComponent(this.plan.label)}`,
    });
  },

  handleQuickStructureToggle() { this.setData({ quickStructureExpanded: !this.data.quickStructureExpanded }); },
  handleQuickExplanationToggle(event) {
    const sectionId = event.currentTarget.dataset.sectionId;
    if (sectionId !== this.data.route?.experience?.quickPrimer?.currentSectionId) return;
    this.setData({ quickExpandedSectionId: this.data.quickExpandedSectionId === sectionId ? "" : sectionId });
  },
  handleQuickReference() {
    if (!this.plan?.primerId || this.session?.status !== "active") return;
    const finalSectionId = this.plan.steps[this.plan.steps.length - 1]?.sectionId;
    if (this.plan.steps[this.session.currentIndex]?.sectionId !== finalSectionId) return;
    if (this.data.quickExpandedSectionId === finalSectionId) {
      this.setData({ quickExpandedSectionId: "" });
      return;
    }
    this.dispatch("OPEN_QUICK_REFERENCE");
    this.setData({ quickExpandedSectionId: finalSectionId });
  },
  handleQuickComplete() { this.dispatch("COMPLETE_QUICK_PRIMER"); },

  handleReadingBlockJump(event) {
    const blockId = event.detail?.blockId;
    const block = this.data.currentCard?.semanticBlocks.find((item) => item.id === blockId);
    if (this.data.type !== "systematic" || this.data.currentCard?.activity !== "reading" || !block) return;
    const component = this.selectComponent("#route-knowledge-card");
    if (!component) return;
    wx.createSelectorQuery().in(component).select(`#${block.domId}`).boundingClientRect().exec(([rect]) => {
      if (!rect) return this.setData({ readingAnchorNotice: "暂时无法定位这处原文，请在完整正文中查找。" });
      wx.createSelectorQuery().selectViewport().scrollOffset().exec(([viewport]) => {
        if (!viewport) return;
        wx.createSelectorQuery().select(".route-step-progress").boundingClientRect().exec(([progressRect]) => {
          wx.pageScrollTo({
            scrollTop: Math.max(0, (viewport.scrollTop || 0) + rect.top - (progressRect?.height || 0) - 16),
            duration: this.data.displayPreferences.motion === "reduced" ? 0 : 180,
            success: () => {
              this.setData({ activeReadingBlockId: block.id, readingAnchorNotice: "" });
              if (this.readingHighlightTimer) clearTimeout(this.readingHighlightTimer);
              this.readingHighlightTimer = setTimeout(() => this.setData({ activeReadingBlockId: "" }), 1800);
            },
            fail: () => this.setData({ readingAnchorNotice: "暂时无法定位这处原文，请在完整正文中查找。" }),
          });
        });
      });
    });
  },

  handleSystematicUnits() { wx.navigateTo({ url: '/subpackages/politics/route/units' }); },
  handleSystemNext() { this.dispatch("COMPLETE_READING_STEP"); },
  handleSystemRelation(event) {
    const relationId = event.detail?.relationId;
    const relation = knowledgePackage.relations.find((item) => item.id === relationId);
    const currentPointId = this.data.route?.current?.pointId;
    if (this.data.type !== "systematic" || !relation || !currentPointId) return;
    if (relation.sourcePointId !== currentPointId && relation.targetPointId !== currentPointId) return;
    const targetPointId = relation.sourcePointId === currentPointId ? relation.targetPointId : relation.sourcePointId;
    if (!writeStorage(routeProgressKey(this.plan.type), { planOptions: this.plan.options, session: this.session })) {
      this.setData({ screen: "unsaved", storageStatus: { ok: false, message: "关联知识打开前未能保存本次进度" } });
      return;
    }
    this.pendingSystemReturn = true;
    this.setData({ relationError: "" });
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(targetPointId)}&mode=reading&origin=systematic-relation&refId=${encodeURIComponent(relationId)}&routeId=${encodeURIComponent(this.plan.id)}&goalType=systematic&scopeId=${encodeURIComponent(this.plan.scopeId)}&stepId=${encodeURIComponent(this.session.currentStepId)}&goalLabel=${encodeURIComponent(this.plan.label)}`,
      fail: () => {
        this.pendingSystemReturn = false;
        this.setData({ relationError: "暂时无法打开关联知识，请重试。" });
      },
    });
  },
  handleSystemPrerequisite(event) {
    const pointId = event.currentTarget.dataset.pointId;
    if (this.data.type !== "systematic" || !pointId || !this.data.start?.details?.outsidePrerequisites?.some((item) => item.prerequisitePointId === pointId)) return;
    wx.navigateTo({ url: `/subpackages/politics/detail/index?id=${encodeURIComponent(pointId)}&mode=reading&origin=systematic-prerequisite` });
  },
  handleContrastJudgment(event) {
    const answerUnitId = event.detail?.answerUnitId;
    const result = event.detail?.result;
    if (this.data.type !== "confusion" || this.data.route?.current?.stage !== "judgment") return;
    if (answerUnitId) return this.dispatch("REVEAL_CONTRAST_KEY", { answerUnitId });
    if (!["answered", "unsure", "skipped"].includes(result)) return;
    this.dispatch("REVEAL_CONTRAST_KEY", { result });
  },
  handleContrastNext() {
    const stage = this.data.route?.current?.stage;
    if (stage === "boundary") return this.dispatch("CONFIRM_CONTRAST_BOUNDARY");
    if (stage !== "evidence") return;
    const viewed = this.data.route?.experience?.confusion?.evidenceViewed;
    if (!viewed?.left || !viewed?.right) {
      this.setData({ contrastError: "请先查看两侧原文，再继续。" });
      return;
    }
    this.dispatch("VIEW_CONTRAST_EVIDENCE");
  },
  handleContrastEvidence(event) {
    if (this.data.type !== "confusion" || this.data.route?.current?.stage !== "evidence") return;
    const side = event.detail?.side;
    const pair = this.data.route?.experience?.confusion?.contrastPair;
    if (!pair || !["left", "right"].includes(side)) return;
    const pointId = side === "left" ? pair.leftPointId : pair.rightPointId;
    const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === pointId);
    const blockId = pair.sourceBlockIds.find((id) => unit?.blocks.some((block) => block.id === id));
    const referenceId = pair.sourceRefIds.find((id) => unit?.blocks.some((block) => block.id === blockId && block.sourceRefIds.includes(id)));
    if (!blockId || !referenceId) {
      this.setData({ contrastError: "这侧原文暂时无法定位，请返回或换一组。" });
      return;
    }
    const pending = { side, stepId: this.session.currentStepId, pointId, blockId, referenceId, acknowledged: false };
    this.pendingContrastEvidenceSide = pending;
    this.setData({ contrastError: "" });
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(pointId)}&block=${encodeURIComponent(blockId)}&mode=reading&origin=contrast-evidence&refId=${encodeURIComponent(referenceId)}&routeId=${encodeURIComponent(this.plan.id)}&goalType=confusion&scopeId=${encodeURIComponent(this.plan.scopeId)}&stepId=${encodeURIComponent(this.session.currentStepId)}&goalLabel=${encodeURIComponent(this.plan.label)}`,
      events: {
        contrastEvidenceReady: (receipt) => {
          if (this.pendingContrastEvidenceSide !== pending) return;
          if (receipt?.routeId !== this.plan.id || receipt?.stepId !== pending.stepId || receipt?.pointId !== pointId || receipt?.blockId !== blockId || receipt?.referenceId !== referenceId) return;
          pending.acknowledged = true;
        },
      },
      fail: () => {
        if (this.pendingContrastEvidenceSide !== pending || pending.acknowledged) return;
        this.pendingContrastEvidenceSide = null;
        this.setData({ contrastError: "暂时无法打开原文，请重试。" });
      },
    });
  },
  handleContrastResponse(event) {
    const answerUnitId = event.detail?.answerUnitId;
    const result = event.detail?.result;
    if (this.data.type !== "confusion" || this.data.route?.current?.stage !== "retest") return;
    if (answerUnitId) return this.dispatch("CONTRAST_RESPONSE", { answerUnitId });
    if (!["clear", "fuzzy", "missed"].includes(result)) return;
    this.dispatch("CONTRAST_RESPONSE", { result });
  },
  handleReveal() { this.dispatch("REVEAL_RECALL"); },
  handleRecallResult(event) { this.dispatch("RECALL_RESULT", { result: event.currentTarget.dataset.result }); },
  handleSharedRecallResult(event) { this.dispatch("RECALL_RESULT", { result: event.detail.result }); },
  handleSharedBackToReading() {
    if (["fuzzy", "missed"].includes(this.data.route?.current?.response)) this.handleViewKnowledge();
  },
  handleNextRecall() { this.dispatch("NEXT_RECALL_CARD"); },
  handleExamPause() {
    if (this.data.type !== "exam" || this.session?.status !== "active") return;
    this.handleRoutePause();
  },
  handleRoutePause() {
    if (this.data.type === "quick") return this.handleQuickLater();
    if (!this.plan || this.session?.status !== "active") return;
    const record = { planOptions: this.plan.options, session: this.session };
    if (!writeStorage(routeProgressKey(this.plan.type), record)) {
      this.setData({ screen: "unsaved", storageStatus: { ok: false, message: "暂停前未能保存本次进度，请重试保存" } });
      return;
    }
    this.activeRecord = record;
    this.setData({ storageStatus: { ok: true, message: "" } });
    wx.navigateBack({ delta: 1, fail: () => wx.switchTab({ url: "/pages/politics/index" }) });
  },
  handleSkip() { this.dispatch(this.data.type === "quick" ? "SKIP_TOUR_STOP" : "SKIP_STEP"); },

  handleRecallSource(event) {
    if (this.data.type !== 'exam' || !this.data.routeRecallView?.answerVisible) return;
    const target = this.data.routeRecallView.sourceLinks.find(link => link.pointId === event.detail.pointId && link.blockId === event.detail.blockId);
    if (!target) return;
    wx.navigateTo({url:'/subpackages/politics/detail/index?id='+encodeURIComponent(target.pointId)+'&block='+encodeURIComponent(target.blockId)+'&mode=reading&origin=exam-source',fail:error=>{this.sourceNavigationFailure=error.errMsg;wx.showToast({title:'暂时无法打开原文，请重试',icon:'none'});}});
  },
  handleViewKnowledge() {
    const stepId = this.data.route?.current?.stepId;
    const step = this.plan?.steps.find((item) => item.stepId === stepId);
    if (!["exam", "systematic"].includes(this.data.type) || !step || !["fuzzy", "missed"].includes(this.data.route?.current?.response)) return;
    const origin = this.data.type === "exam" ? "exam-remedy" : "systematic-remedy";
    const pending = { stepId, pointId: step.pointId, acknowledged: false };
    this.pendingActiveExamRemedy = pending;
    this.setData({ examKnowledgeError: "" });
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(step.pointId)}&mode=reading&origin=${encodeURIComponent(origin)}&routeId=${encodeURIComponent(this.plan.id)}&goalType=${encodeURIComponent(this.data.type)}&scopeId=${encodeURIComponent(this.plan.scopeId)}&stepId=${encodeURIComponent(stepId)}&goalLabel=${encodeURIComponent(this.plan.label)}`,
      events: {
        examRemedyReady: (receipt) => {
          if (this.pendingActiveExamRemedy !== pending) return;
          if (receipt?.routeId !== this.plan.id || receipt?.stepId !== stepId || receipt?.pointId !== step.pointId) return;
          pending.acknowledged = true;
        },
        routeRemedyReady: (receipt) => {
          if (this.pendingActiveExamRemedy !== pending) return;
          if (receipt?.routeId !== this.plan.id || receipt?.stepId !== stepId || receipt?.pointId !== step.pointId) return;
          pending.acknowledged = true;
        },
      },
      fail: () => {
        if (this.pendingActiveExamRemedy !== pending || pending.acknowledged) return;
        this.pendingActiveExamRemedy = null;
        this.setData({ examKnowledgeError: "暂时无法打开完整知识，请重试。" });
      },
    });
  },
  handleAdjust() {
    const recent = readStorage(storageKey("politics"));
    const scopes = projectRouteScopeOptions(knowledgePackage, this.data.type, recent?.pointId || null).filter((item) => item.enabled);
    const selected = scopes.find((item) => item.id === this.plan?.scopeId);
    const expandedIds = selected ? selected.pathIds.filter((id) => id !== selected.id && scopes.some((item) => item.id === id)) : [];
    this.setData({
      adjusting: true,
      random: this.data.type === "exam" && Boolean(this.plan?.seed),
      adjustmentScopes: scopes,
      adjustmentExpandedIds: expandedIds,
      adjustmentScopeId: this.plan?.scopeId || "",
      adjustmentContrasts: this.data.type === "confusion" ? projectContrastRouteOptions(knowledgePackage) : [],
    });
    this.renderScopePicker();
  },
  renderScopePicker() {
    if (!["systematic", "exam"].includes(this.data.type)) return;
    const scope = this.data.adjustmentScopes.find((item) => item.id === this.data.adjustmentScopeId);
    this.setData({
      adjustmentScopeRows: projectRouteScopePicker(knowledgePackage, this.data.type, { selectedScopeId: this.data.adjustmentScopeId, expandedScopeIds: this.data.adjustmentExpandedIds }),
      adjustmentScopeSummary: scope ? `${scope.title} · ${this.data.type === "exam" ? scope.recallCount + " 张回忆卡" : scope.pointCount + " 个知识"}` : "",
    });
  },
  handleScopeExpand(event) {
    const id = event.currentTarget.dataset.scopeId;
    if (!this.data.adjustmentScopeRows.some((item) => item.id === id && item.hasChildren)) return;
    const ids = this.data.adjustmentExpandedIds;
    this.setData({ adjustmentExpandedIds: ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id] });
    this.renderScopePicker();
  },
  handleAdjustClose() { this.setData({ adjusting: false }); },
  handleSystematicOrderToggle() { this.setData({ systematicOrderExpanded: !this.data.systematicOrderExpanded }); },
  handleRandomChange(event) { this.setData({ random: event.detail.value }); },
  handleScopePreview(event) {
    const scopeId = event.currentTarget.dataset.scopeId;
    if (!this.data.adjustmentScopes.some((item) => item.id === scopeId && item.enabled)) return;
    this.setData({ adjustmentScopeId: scopeId });
    this.renderScopePicker();
  },
  handleScopeConfirm() {
    if (!["systematic", "exam"].includes(this.data.type)) return;
    this.applyScopeChoice(this.data.adjustmentScopeId);
  },
  handleScopeChoice(event) {
    this.applyScopeChoice(event.currentTarget.dataset.scopeId);
  },
  applyScopeChoice(scopeId) {
    if (!scopeId) return;
    const next = planLearningRoute(knowledgePackage, {
      type: this.data.type,
      scopeId,
      random: this.data.type === "exam" && this.data.random,
      seed: this.data.type === "exam" && this.data.random ? `${scopeId}:${Date.now()}` : null,
      recommendationReason: "按你调整后的本次学习范围安排",
    });
    if (!next) return;
    if (this.session?.status === "active" && !this.archiveActiveRoute("abandoned")) {
      this.setData({ storageStatus: { ok: false, message: "原范围进度未能安全保存，请重试" } });
      return;
    }
    this.plan = next;
    this.session = null;
    this.setData({ adjusting: false, systematicOrderExpanded: false });
    this.renderRecommendation();
  },
  handleContrastChoice(event) {
    const relationId = event.currentTarget.dataset.relationId;
    const recent = readStorage(storageKey("politics"));
    const next = planLearningRoute(knowledgePackage, {
      type: "confusion",
      scopeId: knowledgePackage.indexes.rootNavigationIds[0],
      relationId,
      recommendationReason: "按你换选的正式易混知识安排",
      recommendationQueue: knowledgePackage.moduleProfile.routeDefaults.confusion.priorityRelationIds,
      originPointId: recent?.pointId || null,
    });
    if (!next) return;
    if (this.session?.status === "active" && !this.archiveActiveRoute("abandoned")) {
      this.setData({ storageStatus: { ok: false, message: "原范围进度未能安全保存，请重试" } });
      return;
    }
    this.plan = next;
    this.session = null;
    this.setData({ adjusting: false });
    this.renderRecommendation();
  },

  handleExit() {
    if (this.session?.status === "active" && !this.archiveActiveRoute("abandoned")) {
      this.setData({ storageStatus: { ok: false, message: "本次任务未能安全结束，请重试" } });
      return;
    }
    if (this.data.type === "quick") return wx.redirectTo({ url: "/subpackages/politics/map/index?state=overview" });
    wx.navigateBack({ delta: 1 });
  },
  handleRecoveryAction() {
    const actionId = this.data.recovery?.action?.id;
    if (actionId === "rebuild-route") return this.handleRebuild();
    if (actionId === "return-previous") return wx.navigateBack({ delta: 1, fail: () => wx.switchTab({ url: "/pages/politics/index" }) });
  },
  handleRebuild() {
    if (["quick", "exam", "confusion"].includes(this.data.type) && this.activeRecord?.session && !this.archiveActiveRoute("expired")) {
      this.setData({ storageStatus: { ok: false, message: "旧版进度尚未安全保留，请重试" } });
      return;
    }
    const recent = readStorage(storageKey("politics"));
    this.plan = planRecommendedRoute(knowledgePackage, this.data.type, { currentPointId: recent?.pointId || null });
    this.session = null;
    if (this.plan) this.startFresh();
  },

  handleSystemNextScope() {
    const next = this.data.route?.report?.nextScope;
    if (this.data.type !== "systematic" || this.data.screen !== "completed" || !next?.id) return;
    wx.redirectTo({ url: `/subpackages/politics/map/index?state=branch&scope=${encodeURIComponent(next.id)}` });
  },
  handleCompletionPrimary() {
    const primaryAction = this.data.route?.guide?.completion?.primaryAction;
    const action = primaryAction?.id;
    if (action === "return-home") return this.handleCompletionHome();
    if (this.data.type === "confusion") {
      if (this.data.screen !== "completed") return;
      const next = action === "next-contrast" ? projectContrastRouteOptions(knowledgePackage).find((item) => item.relationId === primaryAction.relationId) : null;
      if (!next) return this.handleCompletionHome();
      const nextPlan = planLearningRoute(knowledgePackage, { type: "confusion", scopeId: next.scopeId, relationId: next.relationId, recommendationReason: "开启另一组易混知识", recommendationQueue: this.plan.recommendationQueue, originPointId: this.plan.originPointId });
      if (!nextPlan) return this.handleCompletionHome();
      this.plan = nextPlan;
      return this.startFresh();
    }
    if (action === "start-systematic") {
      const continuation = this.systematicContinuation();
      if (continuation.error) return this.setData({ storageStatus: { ok: false, message: "暂时无法读取系统学习进度，请重试" } });
      return wx.redirectTo({ url: `/subpackages/politics/route/index?type=systematic${continuation.resume ? "&resume=1" : ""}` });
    }
    if (action === "return-overview") return wx.redirectTo({ url: "/subpackages/politics/map/index?state=overview" });
    if (action === "return-scope" || action === "return-deck-scope") return wx.redirectTo({ url: `/subpackages/politics/map/index?state=branch&scope=${encodeURIComponent(this.plan.scopeId)}` });
    if (action === "review-remedy") return this.setData({ completionReviewVisible: true });
  },
  handleExamCompletionExit() {
    if (this.data.type !== "exam" || this.session?.status !== "completed" || this.data.screen !== "completed") return;
    wx.redirectTo({ url: `/subpackages/politics/map/index?state=branch&scope=${encodeURIComponent(this.plan.scopeId)}` });
  },
  systematicContinuation() {
    try {
      const record = selectRouteRecord("systematic", wx.getStorageSync(routeProgressKey("systematic")), wx.getStorageSync(LEGACY_ROUTE_KEY));
      const plan = rebuildPlan(record);
      const status = plan && record?.session ? normalizeRouteSession(plan, record.session).status : null;
      return { label: status === "active" ? "继续系统学习" : "进入系统学习", resume: Boolean(status && status !== "completed") };
    } catch (error) {
      return { label: "进入系统学习", resume: false, error: true };
    }
  },
  handleQuickOverview() {
    if (this.data.type !== "quick" || this.session?.status !== "completed") return;
    wx.redirectTo({ url: "/subpackages/politics/map/index?state=overview" });
  },
  handleQuickSystematic() {
    if (this.data.type !== "quick" || this.session?.status !== "completed") return;
    const continuation = this.systematicContinuation();
    if (continuation.error) return this.setData({ storageStatus: { ok: false, message: "暂时无法读取系统学习进度，请重试" } });
    wx.redirectTo({ url: `/subpackages/politics/route/index?type=systematic${continuation.resume ? "&resume=1" : ""}` });
  },
  handleCompletionHome() { wx.switchTab({ url: "/pages/politics/index" }); },
  handleExamRestart() {
    if (this.data.type !== "exam" || this.session?.status !== "completed" || this.data.screen !== "completed") return;
    if (this.data.route?.report?.pendingRemedyQueue?.length) return;
    this.setData({ completionReviewVisible: false, completionReviewError: "" });
    this.startNextExamRound();
  },
  startNextExamRound() {
    if (this.data.type !== "exam" || !this.plan) return;
    const next = planLearningRoute(knowledgePackage, {
      ...this.plan.options,
      examCursor: this.data.route?.report?.examNextCursor ?? this.plan.startProjection?.nextCursor ?? 0,
      recommendationReason: "继续当前范围的下一组速记卡",
    });
    if (!next) return;
    this.plan = next;
    this.session = null;
    this.startFresh();
  },
  handleCompletionReviewTap(event) {
    const stepId = event.currentTarget.dataset.stepId;
    const step = this.plan.steps.find((item) => item.stepId === stepId);
    if (!step || !this.data.route?.report?.pendingRemedyQueue?.some((item) => item.stepId === stepId)) return;
    const pending = { stepId, pointId: step.pointId, acknowledged: false };
    this.pendingExamRemedy = pending;
    this.setData({ completionReviewError: "" });
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(step.pointId)}&mode=reading&origin=exam-remedy&routeId=${encodeURIComponent(this.plan.id)}&goalType=exam&scopeId=${encodeURIComponent(this.plan.scopeId)}&stepId=${encodeURIComponent(stepId)}&goalLabel=${encodeURIComponent(this.plan.label)}`,
      events: {
        examRemedyReady: (receipt) => {
          if (this.pendingExamRemedy !== pending) return;
          if (receipt?.routeId !== this.plan.id || receipt?.stepId !== stepId || receipt?.pointId !== step.pointId) return;
          pending.acknowledged = true;
        },
      },
      fail: () => {
        if (this.pendingExamRemedy !== pending || pending.acknowledged) return;
        this.pendingExamRemedy = null;
        this.setData({ completionReviewError: "暂时无法打开完整知识，请重试。" });
      },
    });
  },
});
