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
  projectRouteStart,
  projectRouteViewModel,
  projectSurfaceRecovery,
  storageKey,
} = require("../../../services/knowledge-platform/index");

const { LEGACY_ROUTE_KEY, ROUTE_HISTORY_KEY, routeProgressKey, selectRouteRecord } = require("../../../services/knowledge-platform/route-progress");
let storageFailure = null;

function readStorage(key) {
  try { return wx.getStorageSync(key); } catch (error) { storageFailure = error; return null; }
}

function writeStorage(key, value) {
  try { wx.setStorageSync(key, value); storageFailure = null; return true; }
  catch (error) { storageFailure = error; return false; }
}

function removeStorage(key) {
  try { wx.removeStorageSync(key); storageFailure = null; return true; }
  catch (error) { storageFailure = error; return false; }
}

function rebuildPlan(record) {
  return record?.planOptions ? planLearningRoute(knowledgePackage, record.planOptions) : null;
}

function cardFor(pointId, activity) {
  return pointId ? projectKnowledgeCardSurfaceViewModel(knowledgePackage, pointId, { activity }) : null;
}

Page({
  data: {
    type: "quick",
    meta: ROUTE_META.quick,
    screen: "recommendation",
    start: null,
    route: null,
    quickSpace: null,
    quickReflectionDraft: "",
    currentCard: null,
    routeRecallView: null,
    displayPreferences: {},
    contrastError: "",
    relationError: "",
    recovery: null,
    adjusting: false,
    adjustmentScopes: [],
    adjustmentContrasts: [],
    random: false,
    remedyVisible: false,
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
      if (this.session?.status === "active") return this.renderSession();
      return this.startFresh();
    }
    if (options.resume === "1" && this.session) this.renderSession();
    else this.renderRecommendation();
  },

  onReady() {
    if (this.data.type !== "quick" || !wx.createIntersectionObserver) return;
    this.quickObserver = wx.createIntersectionObserver(this, { thresholds: [0.35, 0.65] });
    this.quickObserver.relativeToViewport({ top: -80, bottom: -120 }).observe(".quick-section", (entry) => {
      const sectionId = entry.dataset?.sectionId;
      if (entry.intersectionRatio >= 0.35 && sectionId) this.recordQuickSection(sectionId);
    });
  },

  onPageScroll(event) { if (this.data.type === "quick") this.quickScrollTop = event.scrollTop || 0; },
  onShow() {
    this.setData({ displayPreferences: getDisplayPreferences() });
    if (this.pendingContrastEvidenceSide) {
      const pending = this.pendingContrastEvidenceSide;
      this.pendingContrastEvidenceSide = null;
      if (this.session?.currentStepId === pending.stepId && pending.acknowledged) this.dispatch("VIEW_CONTRAST_SIDE", { side: pending.side });
      else if (this.session?.currentStepId === pending.stepId) this.setData({ contrastError: "尚未确认这侧正式原文已显示，请重新打开。" });
    }
    if (this.pendingExamRemedy) {
      const pending = this.pendingExamRemedy;
      this.pendingExamRemedy = null;
      if (this.session?.status === "completed" && pending.acknowledged) this.dispatch("VIEW_REMEDY", { stepId: pending.stepId });
      else if (this.session?.status === "completed") this.setData({ completionReviewError: "完整知识尚未成功显示，请重试回看。" });
    }
    if (this.pendingSystemReturn) {
      this.pendingSystemReturn = false;
      this.renderSession();
    }
    if (!this.pendingQuickReturn) return;
    this.pendingQuickReturn = false;
    wx.pageScrollTo({ scrollTop: this.quickScrollTop || 0, duration: 0 });
  },
  onUnload() { if (this.quickObserver) this.quickObserver.disconnect(); },

  renderRecommendation() {
    this.setData({
      screen: "recommendation",
      start: projectRouteStart(this.plan, this.session),
      route: null,
      currentCard: null,
      contrastError: "",
      relationError: "",
      recovery: null,
      remedyVisible: false,
      completionReviewVisible: false,
      });
  },

  handlePrimaryStart() {
    this.setData({ startFeedback: "已收到点击，正在打开第一个知识…", startError: "" });
    this.openPrimaryRoute();
  },

  openPrimaryRoute() {
    try {
      if (!this.data.storageStatus.ok && !this.session) return this.handleStorageRetry();
      if (this.session?.status === "active") return this.renderSession();
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
    if (!removeStorage(routeProgressKey(this.plan.type))) return false;
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
    const cardActivity = current?.stage === "recall" || this.plan.type === "exam" ? "recall" : "reading";
    const currentCard = cardFor(current?.pointId, cardActivity);
    const routeRecallView = current?.recall ? {
      ...current.recall,
      revealed: Boolean(current.revealed),
      response: current.response || null,
    } : null;
    this.setData({
      screen: this.session.status === "completed" ? "completed" : "active",
      route,
      quickSpace: null,
      quickReflectionDraft: route.experience.quickPrimer?.reflection.text || "",
      currentCard,
      routeRecallView,
      contrastError: "",
      relationError: "",
      recovery: null,
      adjusting: false,
      remedyVisible: false,
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

  recordQuickSection(sectionId) {
    if (!this.plan?.primerId || this.session?.status !== "active") return;
    const before = this.session.currentStepId;
    this.session = applyRouteSessionEvent(this.plan, this.session, { type: "VIEW_QUICK_SECTION", sectionId, at: Date.now() });
    if (this.session.currentStepId === before && this.data.route?.experience?.quickPrimer?.currentSectionId === sectionId) return;
    this.persistQuickSession();
    this.setData({ route: projectRouteViewModel(knowledgePackage, this.plan, this.session) });
  },

  handleQuickDetail(event) {
    const sectionId = event.currentTarget.dataset.sectionId;
    const pointId = event.currentTarget.dataset.pointId;
    const section = this.data.route?.experience?.quickPrimer?.sections?.find((item) => item.id === sectionId);
    if (!section || section.detail?.pointId !== pointId) return;
    const beforeStepId = this.session.currentStepId;
    this.session = applyRouteSessionEvent(this.plan, this.session, { type: "OPEN_QUICK_DETAIL", sectionId, pointId, at: Date.now() });
    if (this.session.currentStepId !== beforeStepId) return;
    this.persistQuickSession();
    this.pendingQuickReturn = true;
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(pointId)}&mode=reading&origin=quick-primer&routeId=${encodeURIComponent(this.plan.id)}&goalType=quick&scopeId=${encodeURIComponent(this.plan.scopeId)}&stepId=${encodeURIComponent(beforeStepId)}&sectionId=${encodeURIComponent(sectionId)}&goalLabel=${encodeURIComponent(this.plan.label)}`,
    });
  },

  handleQuickReflectionInput(event) {
    const text = String(event.detail.value || "").slice(0, 80);
    this.session = applyRouteSessionEvent(this.plan, this.session, { type: "UPDATE_QUICK_REFLECTION", text, at: Date.now() });
    this.persistQuickSession();
    this.setData({ quickReflectionDraft: text, route: projectRouteViewModel(knowledgePackage, this.plan, this.session) });
  },
  handleQuickReflectionSubmit() {
    this.session = applyRouteSessionEvent(this.plan, this.session, { type: "VIEW_QUICK_SECTION", sectionId: "J2V2-SEC-08", at: Date.now() });
    const before = this.session.quickReflection.status;
    this.session = applyRouteSessionEvent(this.plan, this.session, { type: "SUBMIT_QUICK_REFLECTION", text: this.data.quickReflectionDraft, at: Date.now() });
    if (this.session.quickReflection.status === before) return wx.showToast({ title: "请写下6–80个字", icon: "none" });
    this.persistAndRender();
  },
  handleQuickReflectionSkip() {
    this.session = applyRouteSessionEvent(this.plan, this.session, { type: "VIEW_QUICK_SECTION", sectionId: "J2V2-SEC-08", at: Date.now() });
    this.dispatch("SKIP_QUICK_REFLECTION");
  },
  handleQuickComplete() { this.dispatch("COMPLETE_QUICK_PRIMER"); },

  handleTourNext() { this.dispatch("COMPLETE_TOUR_STOP"); },
  handleTourAnchor(event) {
    const anchorNodeId = event.currentTarget.dataset.nodeId;
    const anchor = this.data.route?.current?.anchors?.find((item) => item.nodeId === anchorNodeId);
    if (!anchor) return;
    this.session = applyRouteSessionEvent(this.plan, this.session, { type: "VIEW_TOUR_ANCHOR", anchorNodeId, at: Date.now() });
    const record = { planOptions: this.plan.options, session: this.session };
    writeStorage(routeProgressKey(this.plan.type), record);
    this.activeRecord = record;
    this.setData({ route: projectRouteViewModel(knowledgePackage, this.plan, this.session) });
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(anchor.pointId)}&mode=reading&origin=quick-tour&routeId=${encodeURIComponent(this.plan.id)}&goalType=quick&scopeId=${encodeURIComponent(this.plan.scopeId)}&stepId=${encodeURIComponent(this.session.currentStepId)}&goalLabel=${encodeURIComponent(this.plan.label)}&goalPosition=${encodeURIComponent(this.data.route.guide.progressText)}`,
    });
  },
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
    const result = event.detail?.result;
    if (this.data.type !== "confusion" || this.data.route?.current?.stage !== "judgment") return;
    if (!["answered", "unsure", "skipped"].includes(result)) return;
    this.dispatch("REVEAL_CONTRAST_KEY", { result });
  },
  handleContrastNext() {
    const stage = this.data.route?.current?.stage;
    if (stage === "boundary") return this.dispatch("CONFIRM_CONTRAST_BOUNDARY");
    if (stage !== "evidence") return;
    const viewed = this.data.route?.experience?.confusion?.evidenceViewed;
    if (!viewed?.left || !viewed?.right) {
      this.setData({ contrastError: "请先分别查看两边的正式原文，再继续辨析。" });
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
      this.setData({ contrastError: "这侧正式原文暂时无法定位，请返回或换一组正式对照。" });
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
        this.pendingContrastEvidenceSide = null;
        this.setData({ contrastError: "暂时无法打开正式原文，请重试。" });
      },
    });
  },
  handleContrastResponse(event) {
    const result = event.detail?.result;
    if (this.data.type !== "confusion" || this.data.route?.current?.stage !== "retest") return;
    if (!["clear", "fuzzy", "missed"].includes(result)) return;
    this.dispatch("CONTRAST_RESPONSE", { result });
  },
  handleReveal() { this.dispatch("REVEAL_RECALL"); },
  handleRecallResult(event) { this.dispatch("RECALL_RESULT", { result: event.currentTarget.dataset.result }); },
  handleSharedRecallResult(event) { this.dispatch("RECALL_RESULT", { result: event.detail.result }); },
  handleSharedBackToReading() {
    if (["fuzzy", "missed"].includes(this.data.route?.current?.response)) this.handleRemedy();
  },
  handleNextRecall() { this.dispatch("NEXT_RECALL_CARD"); },
  handleExamPause() {
    if (this.data.type !== "exam" || this.session?.status !== "active") return;
    const record = { planOptions: this.plan.options, session: this.session };
    if (!writeStorage(routeProgressKey("exam"), record)) {
      this.setData({ screen: "unsaved", storageStatus: { ok: false, message: "暂停前未能保存本次进度，请重试保存" } });
      return;
    }
    this.activeRecord = record;
    this.setData({ storageStatus: { ok: true, message: "" } });
    wx.navigateBack({ delta: 1, fail: () => wx.switchTab({ url: "/pages/politics/index" }) });
  },
  handleSkip() { this.dispatch(this.data.type === "quick" ? "SKIP_TOUR_STOP" : "SKIP_STEP"); },

  handleRemedy() {
    const stepId = this.data.route?.current?.stepId;
    if (!stepId || !["fuzzy", "missed"].includes(this.data.route?.current?.response)) return;
    this.setData({ remedyVisible: true });
  },
  handleRemedyReturn() {
    if (!this.data.remedyVisible) return;
    const stepId = this.data.route?.current?.stepId;
    this.setData({ remedyVisible: false });
    if (!stepId || !["fuzzy", "missed"].includes(this.data.route?.current?.response)) return;
    this.session = applyRouteSessionEvent(this.plan, this.session, { type: "VIEW_REMEDY", stepId, at: Date.now() });
    this.persistAndRender();
  },

  handleAdjust() {
    const recent = readStorage(storageKey("politics"));
    this.setData({
      adjusting: true,
      adjustmentScopes: projectRouteScopeOptions(knowledgePackage, this.data.type, recent?.pointId || null).filter((item) => item.enabled),
      adjustmentContrasts: this.data.type === "confusion" ? projectContrastRouteOptions(knowledgePackage) : [],
    });
  },
  handleAdjustClose() { this.setData({ adjusting: false }); },
  handleRandomChange(event) { this.setData({ random: event.detail.value }); },
  handleScopeChoice(event) {
    const scopeId = event.currentTarget.dataset.scopeId;
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
  handleRebuild() {
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
    const action = this.data.route?.guide?.completion?.primaryAction?.id;
    if (action === "return-overview") return wx.redirectTo({ url: "/subpackages/politics/map/index?state=overview" });
    if (action === "return-scope" || action === "return-deck-scope") return wx.redirectTo({ url: `/subpackages/politics/map/index?state=branch&scope=${encodeURIComponent(this.plan.scopeId)}` });
    if (action === "return-origin") return wx.redirectTo({ url: `/subpackages/politics/map/index?state=full&point=${encodeURIComponent(this.plan.originPointId || this.plan.steps[0]?.pointId)}` });
    if (action === "review-remedy") return this.setData({ completionReviewVisible: true });
    if (action === "next-contrast") {
      const order = this.plan.recommendationQueue.length ? this.plan.recommendationQueue : knowledgePackage.moduleProfile.routeDefaults.confusion.priorityRelationIds;
      const currentId = this.plan.steps[0]?.relationId;
      const nextId = order[order.indexOf(currentId) + 1];
      if (!nextId) return wx.redirectTo({ url: "/subpackages/politics/map/index?state=overview" });
      this.plan = planLearningRoute(knowledgePackage, { type: "confusion", scopeId: knowledgePackage.indexes.rootNavigationIds[0], relationId: nextId, recommendationReason: "按正式策展顺序推荐下一组", recommendationQueue: order, originPointId: this.plan.originPointId });
      return this.startFresh();
    }
  },
  handleExamCompletionExit() {
    if (this.data.type !== "exam" || this.session?.status !== "completed" || this.data.screen !== "completed") return;
    wx.redirectTo({ url: `/subpackages/politics/map/index?state=branch&scope=${encodeURIComponent(this.plan.scopeId)}` });
  },
  handleExamRestart() {
    if (this.data.type !== "exam" || this.session?.status !== "completed" || this.data.screen !== "completed") return;
    if (this.data.route?.report?.pendingRemedyQueue?.length) return;
    this.setData({ completionReviewVisible: false, completionReviewError: "" });
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
        this.pendingExamRemedy = null;
        this.setData({ completionReviewError: "暂时无法打开完整知识，请重试。" });
      },
    });
  },
});
