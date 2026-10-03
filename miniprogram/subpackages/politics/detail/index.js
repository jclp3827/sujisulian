const { knowledgePackage } = require("../../../services/knowledge-platform/politics-runtime");
const {
  applyContextEvent,
  createKnowledgeContext,
  fromRecentModuleContext,
  getDisplayPreferences,
  projectKnowledgeCardSurfaceViewModel,
  projectRecallViewModel,
  saveDisplayPreferences,
  storageKey,
  toRecentModuleContext,
} = require("../../../services/knowledge-platform/index");

const correctionStorageKey = "politics-correction-queue-v1";
const correctionTypes = ["内容错误", "关系不准确", "来源问题", "展示问题"];

function decode(value) {
  try { return decodeURIComponent(value || ""); }
  catch (error) { return String(value || ""); }
}

function readStorage(key) {
  try { return wx.getStorageSync(key); }
  catch (error) { return null; }
}

function correctionQueue() {
  const queue = readStorage(correctionStorageKey);
  return Array.isArray(queue) ? queue : [];
}

Page({
  data: {
    cardSurface: null,
    recallView: null,
    displayPreferences: getDisplayPreferences(),
    correctionVisible: false,
    correctionTypes,
    correctionType: correctionTypes[0],
    correctionDescription: "",
    correctionCount: correctionQueue().length,
  },

  onLoad(options = {}) {
    const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === decode(options.id || options.point));
    if (!unit) {
      wx.showToast({ title: "知识不存在", icon: "none" });
      wx.navigateBack({ delta: 1 });
      return;
    }
    this.pointId = unit.id;
    const recent = fromRecentModuleContext(knowledgePackage, readStorage(storageKey("politics")));
    this.knowledgeContext = recent?.focus ? recent : createKnowledgeContext("politics");
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "SELECT_POINT",
      pointId: unit.id,
      origin: { type: options.origin || "deep-link", refId: decode(options.refId) || unit.navigationNodeId },
      at: Date.now(),
    });
    const activity = ["relations", "recall"].includes(options.mode) ? options.mode : "reading";
    if (activity !== "reading") {
      this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
        type: "SWITCH_ACTIVITY",
        activity,
        at: Date.now(),
      });
    }
    this.examRemedyRequest = decode(options.origin) === "exam-remedy" && activity === "reading" && unit.blocks.length
      ? { routeId: decode(options.routeId), stepId: decode(options.stepId), pointId: unit.id }
      : null;
    const blockId = decode(options.block);
    const referenceId = decode(options.refId);
    const sourceBlock = unit.blocks.find((item) => item.id === blockId);
    this.contrastEvidenceRequest = decode(options.origin) === "contrast-evidence" && sourceBlock?.sourceRefIds.includes(referenceId)
      ? { routeId: decode(options.routeId), stepId: decode(options.stepId), pointId: unit.id, blockId, referenceId }
      : null;
    if (blockId) {
      this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
        type: "UPDATE_READING_SNAPSHOT",
        blockId,
        at: Date.now(),
      });
      this.pendingBlockId = blockId;
    }
    if (options.routeId && options.goalType && options.scopeId) {
      this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
        type: "START_ROUTE",
        routeId: decode(options.routeId),
        routeType: options.goalType,
        scopeId: decode(options.scopeId),
        stepId: decode(options.stepId),
        pointId: unit.id,
        label: decode(options.goalLabel) || "学习路线",
        positionText: decode(options.goalPosition),
        at: Date.now(),
      });
    }
    wx.setNavigationBarTitle({ title: unit.title });
    this.renderCard();
  },

  persistContext() {
    const recent = toRecentModuleContext(knowledgePackage, this.knowledgeContext);
    if (!recent) return;
    try { wx.setStorageSync(storageKey("politics"), recent); }
    catch (error) {}
  },

  renderCard() {
    const activity = ["reading", "relations", "recall"].includes(this.knowledgeContext.activity)
      ? this.knowledgeContext.activity
      : "reading";
    const recallSnapshot = this.knowledgeContext.snapshots.recall || {};
    const cardSurface = projectKnowledgeCardSurfaceViewModel(knowledgePackage, this.pointId, {
      activity,
      goalGuide: this.knowledgeContext.goalContext || null,
    });
    const recallView = cardSurface?.recallFace
      ? projectRecallViewModel(knowledgePackage, this.pointId, {
          recallItemId: cardSurface.recallFace.recallItemId,
          revealed: recallSnapshot.revealed,
          response: recallSnapshot.response,
          remedyStep: recallSnapshot.remedyStep,
        })
      : null;
    this.persistContext();
    this.setData({ cardSurface, recallView, displayPreferences: getDisplayPreferences() }, () => {
      if (this.examRemedyRequest && cardSurface?.activity === "reading" && cardSurface.semanticBlocks.length) {
        this.getOpenerEventChannel?.()?.emit("examRemedyReady", this.examRemedyRequest);
      }
      if (!this.pendingBlockId) return;
      const block = cardSurface?.semanticBlocks.find((item) => item.id === this.pendingBlockId);
      this.pendingBlockId = null;
      if (!block) return;
      const component = this.selectComponent("#knowledge-card");
      if (!component) return;
      wx.createSelectorQuery().in(component).select(`#${block.domId}`).boundingClientRect().exec(([rect]) => {
        if (!rect) return;
        wx.createSelectorQuery().selectViewport().scrollOffset().exec(([viewport]) => {
          if (!viewport) return;
          wx.pageScrollTo({
            scrollTop: Math.max(0, (viewport.scrollTop || 0) + rect.top - 80),
            duration: this.data.displayPreferences.motion === "reduced" ? 0 : 180,
            success: () => {
              const request = this.contrastEvidenceRequest;
              if (request?.blockId === block.id) this.getOpenerEventChannel?.()?.emit("contrastEvidenceReady", request);
            },
          });
        });
      });
    });
  },

  handleBlockTap(event) {
    const blockId = event.detail?.blockId;
    if (!blockId) return;
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "UPDATE_READING_SNAPSHOT",
      blockId,
      at: Date.now(),
    });
    this.persistContext();
  },

  handleRelationTap(event) {
    const relationId = event.detail?.relationId;
    const relation = knowledgePackage.relations.find((item) => item.id === relationId);
    if (!relation) return;
    const targetPointId = relation.sourcePointId === this.pointId ? relation.targetPointId : relation.sourcePointId;
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "FOLLOW_RELATION",
      relationId,
      at: Date.now(),
    });
    this.persistContext();
    wx.navigateTo({ url: `/subpackages/politics/detail/index?id=${encodeURIComponent(targetPointId)}&mode=reading&origin=relation&refId=${encodeURIComponent(relationId)}` });
  },

  handleStartRecall() {
    if (!this.data.cardSurface?.recallFace) return;
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "SWITCH_ACTIVITY",
      activity: "recall",
      at: Date.now(),
    });
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "UPDATE_RECALL_SNAPSHOT",
      snapshot: { recallItemId: this.data.cardSurface.recallFace.recallItemId, revealed: false, response: null, remedyStep: null },
      at: Date.now(),
    });
    this.renderCard();
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },

  handleReveal() {
    this.updateRecall({ revealed: true, response: null });
  },

  handleRecallResult(event) {
    this.updateRecall({ revealed: true, response: event.detail?.result || null });
  },

  updateRecall(patch) {
    const current = this.knowledgeContext.snapshots.recall || {};
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "UPDATE_RECALL_SNAPSHOT",
      snapshot: {
        ...current,
        recallItemId: this.data.cardSurface?.recallFace?.recallItemId,
        ...patch,
      },
      at: Date.now(),
    });
    this.renderCard();
  },

  handleBackToReading() {
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "SWITCH_ACTIVITY",
      activity: "reading",
      at: Date.now(),
    });
    this.renderCard();
  },

  handleDisplay() {
    const current = getDisplayPreferences();
    const fontScale = current.fontScale === "default" ? "large" : current.fontScale === "large" ? "extraLarge" : "default";
    saveDisplayPreferences({ ...current, fontScale });
    this.renderCard();
    wx.showToast({ title: fontScale === "default" ? "标准字号" : fontScale === "large" ? "大字号" : "特大字号", icon: "none" });
  },

  handleSourceFeedback() {
    this.setData({ correctionVisible: true, correctionDescription: "", correctionType: correctionTypes[0] });
  },

  handleCorrectionClose() { this.setData({ correctionVisible: false }); },
  handleSheetTap() {},
  handleCorrectionTypeTap(event) {
    const type = event.currentTarget.dataset.type;
    if (correctionTypes.includes(type)) this.setData({ correctionType: type });
  },
  handleCorrectionInput(event) { this.setData({ correctionDescription: event.detail.value }); },
  handleCorrectionSave() {
    const queue = correctionQueue();
    queue.push({
      id: `politics-feedback:${Date.now()}`,
      pointId: this.pointId,
      type: this.data.correctionType,
      description: String(this.data.correctionDescription || "").trim(),
      status: "local-pending",
      createdAt: Date.now(),
    });
    try { wx.setStorageSync(correctionStorageKey, queue); }
    catch (error) {}
    this.setData({ correctionVisible: false, correctionCount: queue.length });
    wx.showToast({ title: "已保存到本机", icon: "none" });
  },

  onShareAppMessage() {
    return this.data.cardSurface
      ? { title: `${this.data.cardSurface.identity.title}｜政治理论`, path: `/subpackages/politics/detail/index?id=${encodeURIComponent(this.pointId)}` }
      : { title: "政治理论知识" };
  },
});
