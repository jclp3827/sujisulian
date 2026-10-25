const readingSurfacePolicy = require('../../../services/knowledge-platform/reading-surface-policy');
const readingUi = require('../../../services/knowledge-platform/reading-ui');
const { knowledgePackage } = require("../../../services/knowledge-platform/politics-runtime");
const {
  ROUTE_META,
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

function navigationMetrics() {
  let windowInfo = {};
  let menu = null;
  try {
    windowInfo = typeof wx.getWindowInfo === "function"
      ? wx.getWindowInfo()
      : typeof wx.getSystemInfoSync === "function" ? wx.getSystemInfoSync() : {};
  } catch (error) {}
  try {
    menu = typeof wx.getMenuButtonBoundingClientRect === "function"
      ? wx.getMenuButtonBoundingClientRect()
      : null;
  } catch (error) {}
  const statusBarHeight = Number(windowInfo.statusBarHeight) || 20;
  const menuHeight = Number(menu?.height) || 32;
  const menuTop = Number(menu?.top) || statusBarHeight + 6;
  const barHeight = Math.max(44, menuHeight + Math.max(0, menuTop - statusBarHeight) * 2);
  const windowWidth = Number(windowInfo.windowWidth) || 375;
  const sideInset = menu?.left ? Math.max(88, windowWidth - Number(menu.left) + 8) : 104;
  return { statusBarHeight, barHeight, totalHeight: statusBarHeight + barHeight, sideInset };
}

function navigationReturnLabel() {
  const pages = typeof getCurrentPages === "function" ? getCurrentPages() : [];
  return pages.length > 1 ? "返回上一页" : "返回政治理论首页";
}

function entryContext(origin) {
  const pages = typeof getCurrentPages === "function" ? getCurrentPages() : [];
  const previous = pages.length > 1 ? pages[pages.length - 2] : null;
  const path = previous?.route || "";
  if (path === "subpackages/politics/search/index" && origin === "search") return { label: "来自搜索结果", returnLabel: "返回搜索结果" };
  if (path === "subpackages/politics/detail/index" && ["relation", "systematic-relation"].includes(origin)) return { label: "查看关联知识的原文", returnLabel: "返回上一处原文" };
  if (path === "subpackages/politics/route/index" && ["quick-primer", "quick-tour", "systematic-prerequisite", "systematic-relation", "systematic-remedy", "contrast-evidence", "exam-remedy", "exam-source"].includes(origin)) {
    const routeType = ROUTE_META[previous?.data?.type] ? previous.data.type
      : origin.startsWith("quick-") ? "quick" : origin.startsWith("systematic-") ? "systematic" : origin === "contrast-evidence" ? "confusion" : "exam";
    const routeLabel = ROUTE_META[routeType].label;
    return { label: `来自${routeLabel}`, returnLabel: `返回${routeLabel}` };
  }
  if (path === "subpackages/politics/practice/index" && origin === "practice") return { label: "来自练习", returnLabel: "返回练习" };
  if (path === "subpackages/politics/map/index") return { label: "", returnLabel: "返回知识空间" };
  return { label: "", returnLabel: "" };
}

function evidenceAnchors(unit, blockIds) {
  return [...new Set(blockIds || [])].map((blockId, index) => {
    const block = unit.blocks.find((item) => item.id === blockId);
    return block ? {
      blockId,
      label: `依据 ${index + 1}`,
      preview: (block.fallbackText || "").slice(0, 66),
    } : null;
  }).filter(Boolean);
}

Page({
  data: {
    articleVisualEnabled: false,
    articleVisualCapabilities: {outlineLayout:'list',primaryOutlineOnly:false,moduleLeadMap:{},relatedLinksDirect:false,relatedReasonToggle:false},
    cardSurface: null,
    loadError: "",
    recallView: null,
    displayPreferences: getDisplayPreferences(),
    displayMenuVisible: false,
    activeBlockId: "",
    anchorNotice: "",
    sourceContextLabel: "",
    taskReturnLabel: "",
    evidenceAnchors: [],
    evidenceListExpanded: false,
    sourceVisible: false,
    recallReturnVisible: false,
    correctionVisible: false,
    correctionTypes,
    correctionType: correctionTypes[0],
    correctionDescription: "",
    correctionCount: correctionQueue().length,
    navigationTitle: "政治知识点",
    navigationReturnLabel: "返回政治理论首页",
    navigation: { statusBarHeight: 20, barHeight: 44, totalHeight: 64, sideInset: 104 },
  },

  onLoad(options = {}) {
    this.setData({ navigation: navigationMetrics(), navigationReturnLabel: navigationReturnLabel() });
    const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === decode(options.id || options.point));
    if (!unit) {
      this.setData({ navigationTitle: "知识暂不可用", loadError: "找不到这条知识，请返回首页重新查找。" });
      return;
    }
    this.pointId = unit.id;
    this.unit = unit;
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
    const origin = decode(options.origin);
    this.routeRemedyRequest = ["exam-remedy", "systematic-remedy"].includes(origin) && activity === "reading" && unit.blocks.length
      ? { routeId: decode(options.routeId), stepId: decode(options.stepId), pointId: unit.id }
      : null;
    this.examRemedyRequest = origin === "exam-remedy" ? this.routeRemedyRequest : null;
    const entry = entryContext(origin);
    const previousPage = typeof getCurrentPages === 'function' ? getCurrentPages().slice(-2,-1)[0] : null;
    if ((readingUi.articleEnabled(unit.id,activity) || readingSurfacePolicy.articleEnabled(unit.id,activity)) && origin === 'systematic-unit'
        && previousPage?.route === 'subpackages/politics/route/units') {
      entry.label = '来自系统学习'; entry.returnLabel = '返回本节学习';
    }
    this.readingTaskContext = ['subpackages/politics/practice/index','subpackages/politics/route/index','subpackages/politics/route/units'].includes(previousPage?.route);
    const relationId = decode(options.relation || (["relation", "systematic-relation"].includes(origin) ? options.refId : ""));
    const relation = knowledgePackage.relations.find((item) => item.id === relationId && (item.sourcePointId === unit.id || item.targetPointId === unit.id));
    const relationBlockIds = relation
      ? relation.sourcePointId === unit.id ? relation.sourceBlockIds : relation.targetPointId === unit.id ? relation.targetBlockIds : []
      : [];
    const requestedBlockId = decode(options.block);
    const blockId = relation && ["relation", "systematic-relation"].includes(origin)
      ? (relationBlockIds.includes(requestedBlockId) ? requestedBlockId : relationBlockIds[0] || "")
      : requestedBlockId || relationBlockIds[0] || "";
    const referenceId = decode(options.refId);
    const sourceBlock = unit.blocks.find((item) => item.id === blockId);
    const formalContrastEvidence = knowledgePackage.contrastPairs.some((pair) => pair.sourceBlockIds.includes(blockId) && pair.sourceRefIds.includes(referenceId) && [pair.leftPointId, pair.rightPointId].includes(unit.id));
    this.contrastEvidenceRequest = origin === "contrast-evidence" && formalContrastEvidence && sourceBlock?.sourceRefIds.includes(referenceId)
      ? { routeId: decode(options.routeId), stepId: decode(options.stepId), pointId: unit.id, blockId, referenceId }
      : null;
    const entryLabel = ["relation", "systematic-relation"].includes(origin) && !relation
      ? "来自上一处原文"
      : origin === "contrast-evidence" && !this.contrastEvidenceRequest ? "从学习路线打开完整知识" : entry.label;
    this.entrySourceLabel = entryLabel;
    this.setData({ sourceContextLabel: entryLabel, taskReturnLabel: entry.returnLabel });
    if (blockId && sourceBlock) {
      this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
        type: "UPDATE_READING_SNAPSHOT",
        blockId,
        at: Date.now(),
      });
      this.pendingBlockId = activity === "recall" ? null : blockId;
      this.setData({
        sourceContextLabel: entryLabel || "已定位到对应原文",
        evidenceAnchors: evidenceAnchors(unit, relationBlockIds),
      });
    } else if (blockId) {
      this.setData({ anchorNotice: "原文定位已失效，当前显示这篇知识的完整正文。" });
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
    this.setData({ navigationTitle: unit.title });
    this.renderCard();
  },

  onShow() {
    this.setData({ navigation: navigationMetrics(), navigationTitle: this.unit?.title || this.data.navigationTitle, navigationReturnLabel: navigationReturnLabel() });
  },

  onHide() {
    this.cancelReadingAnchor();
  },

  persistContext() {
    const recent = toRecentModuleContext(knowledgePackage, this.knowledgeContext);
    if (!recent) return;
    try { wx.setStorageSync(storageKey("politics"), recent); }
    catch (error) {}
  },

  renderCard() {
    this.cancelReadingAnchor();
    const generation = this.readingAnchorGeneration;
    const requestedBlockId = this.pendingBlockId;
    this.pendingBlockId = null;
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
    this.setData({ readingUiEnabled: readingUi.articleEnabled(this.pointId,activity) || readingSurfacePolicy.articleEnabled(this.pointId,activity), articleVisualEnabled: readingSurfacePolicy.articleEnabled(this.pointId,activity), articleVisualCapabilities: readingSurfacePolicy.articleCapabilities(this.pointId), readingTaskReturn: this.readingTaskContext, cardSurface, recallView, displayPreferences: getDisplayPreferences(), displayMenuVisible: false }, () => {
      if (this.routeRemedyRequest && cardSurface?.activity === "reading" && cardSurface.semanticBlocks.length) {
        this.getOpenerEventChannel?.()?.emit(this.examRemedyRequest ? "examRemedyReady" : "routeRemedyReady", this.routeRemedyRequest);
      }
      if (generation !== this.readingAnchorGeneration || !requestedBlockId) return;
      const block = cardSurface?.semanticBlocks.find((item) => item.id === requestedBlockId);
      if (!block) {
        this.setData({ anchorNotice: "原文定位已失效，当前显示这篇知识的完整正文。" });
        return;
      }
      this.setData({ anchorNotice: "", activeBlockId: "" });
      if (this.blockHighlightTimer) clearTimeout(this.blockHighlightTimer);
      this.locateReadingAnchor(block, generation);
    });
  },

  cancelReadingAnchor() {
    this.readingAnchorGeneration = (this.readingAnchorGeneration || 0) + 1;
    if (this.readingAnchorRetryTimer) clearTimeout(this.readingAnchorRetryTimer);
    this.readingAnchorRetryTimer = null;
  },

  locateReadingAnchor(block, generation, attempt = 0) {
    const current = () => generation === this.readingAnchorGeneration;
    const retry = () => {
      if (!current()) return;
      if (attempt >= 20) {
        this.setData({ anchorNotice: "暂时无法定位这处原文，请在完整正文中查找。" });
        return;
      }
      this.readingAnchorRetryTimer = setTimeout(() => {
        this.readingAnchorRetryTimer = null;
        this.locateReadingAnchor(block, generation, attempt + 1);
      }, 100);
    };
    const probe = () => {
      if (!current()) return;
      const component = this.selectComponent("#knowledge-card");
      if (!component) { retry(); return; }
      wx.createSelectorQuery().in(component).select(`#${block.domId}`).boundingClientRect().exec(([rect]) => {
        if (!current()) return;
        if (!rect) { retry(); return; }
        wx.createSelectorQuery().selectViewport().scrollOffset().exec(([viewport]) => {
          if (!current()) return;
          if (!viewport) { retry(); return; }
          wx.createSelectorQuery().select(".politics-reading-context").boundingClientRect().exec(([contextRect]) => {
            if (!current()) return;
            const offset = Math.max(80, (this.data.navigation?.totalHeight || 0) + (contextRect?.height || 0) + 8);
            wx.pageScrollTo({
              scrollTop: Math.max(0, (viewport.scrollTop || 0) + rect.top - offset),
              duration: this.data.displayPreferences.motion === "reduced" ? 0 : 180,
              success: () => {
                if (!current()) return;
                this.setData({ activeBlockId: block.id, anchorNotice: "" });
                if (this.blockHighlightTimer) clearTimeout(this.blockHighlightTimer);
                this.blockHighlightTimer = setTimeout(() => this.setData({ activeBlockId: "" }), 1800);
                const request = this.contrastEvidenceRequest;
                if (request?.blockId === block.id) this.getOpenerEventChannel?.()?.emit("contrastEvidenceReady", request);
              },
              fail: () => {
                if (current()) this.setData({ anchorNotice: "暂时无法定位这处原文，请在完整正文中查找。" });
              },
            });
          });
        });
      });
    };
    if (typeof wx.nextTick === "function") wx.nextTick(probe);
    else probe();
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
    this.setData({ activeBlockId: blockId });
  },

  handleBlockJump(event) {
    const blockId = event.detail?.blockId;
    if (!this.unit.blocks.some((item) => item.id === blockId)) return;
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "UPDATE_READING_SNAPSHOT",
      blockId,
      at: Date.now(),
    });
    this.pendingBlockId = blockId;
    this.renderCard();
  },

  handleEvidenceAnchorTap(event) {
    const blockId = event.currentTarget.dataset.blockId;
    if (!this.data.evidenceAnchors.some((item) => item.blockId === blockId)) return;
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "UPDATE_READING_SNAPSHOT",
      blockId,
      at: Date.now(),
    });
    this.pendingBlockId = blockId;
    this.setData({ evidenceListExpanded: false });
    this.renderCard();
  },

  handleEvidenceToggle() {
    this.setData({ evidenceListExpanded: !this.data.evidenceListExpanded });
  },

  handleRelationTap(event) {
    const relationId = event.detail?.relationId;
    const relation = knowledgePackage.relations.find((item) => item.id === relationId);
    if (!relation) return;
    const targetPointId = relation.sourcePointId === this.pointId ? relation.targetPointId : relation.sourcePointId;
    const targetBlockIds = relation.sourcePointId === this.pointId ? relation.targetBlockIds : relation.sourceBlockIds;
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "FOLLOW_RELATION",
      relationId,
      at: Date.now(),
    });
    this.persistContext();
    wx.navigateTo({ url: `/subpackages/politics/detail/index?id=${encodeURIComponent(targetPointId)}&mode=reading&origin=relation&refId=${encodeURIComponent(relationId)}${targetBlockIds[0] ? `&block=${encodeURIComponent(targetBlockIds[0])}` : ""}` });
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
    this.setData({ recallReturnVisible: false, evidenceAnchors: [], evidenceListExpanded: false, sourceContextLabel: this.entrySourceLabel || "" });
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
    const blockIds = this.data.cardSurface?.recallFace?.answerSourceBlockIds || [];
    this.pendingBlockId = blockIds[0] || null;
    this.setData({
      sourceContextLabel: "核对这道回忆题的原文",
      evidenceAnchors: evidenceAnchors(this.unit, blockIds),
      evidenceListExpanded: false,
      anchorNotice: blockIds.length ? "" : "这道回忆题没有可定位的原文块，已返回完整正文。",
      recallReturnVisible: true,
    });
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "SWITCH_ACTIVITY",
      activity: "reading",
      at: Date.now(),
    });
    if (this.pendingBlockId) {
      this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
        type: "UPDATE_READING_SNAPSHOT",
        blockId: this.pendingBlockId,
        at: Date.now(),
      });
    }
    this.renderCard();
  },

  handleReturnToRecall() {
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "SWITCH_ACTIVITY",
      activity: "recall",
      at: Date.now(),
    });
    this.setData({ recallReturnVisible: false, evidenceAnchors: [], evidenceListExpanded: false, sourceContextLabel: this.entrySourceLabel || "", activeBlockId: "" });
    this.renderCard();
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },

  handleTaskReturn() {
    const pages = typeof getCurrentPages === "function" ? getCurrentPages() : [];
    if (pages.length > 1) wx.navigateBack({ delta: 1, fail: () => wx.switchTab({ url: "/pages/politics/index" }) });
    else wx.switchTab({ url: "/pages/politics/index" });
  },

  handleNavigationBack() {
    const pages = typeof getCurrentPages === "function" ? getCurrentPages() : [];
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1, fail: () => wx.switchTab({ url: "/pages/politics/index" }) });
      return;
    }
    wx.switchTab({ url: "/pages/politics/index" });
  },

  handleReadingSettingsOpen() { this.setData({readingSettingsVisible:true}); },
  handleReadingSettingsClose() { this.setData({readingSettingsVisible:false}); },
  handleReadingPreferences(event) {
    readingUi.applyReaderPreferences(this,event.detail.preferences,{component:this.selectComponent('#knowledge-card'),selector:'.knowledge-block',topInset:this.data.navigation.totalHeight+12});
  },
  handleReadingOutline() { this.readerDisplayGeneration=(this.readerDisplayGeneration||0)+1;this.selectComponent('#knowledge-card')?.showReadingOutline(); },
  handleReadingBlockJump(event) {
    if(this.data.readingUiEnabled)this.readerDisplayGeneration=(this.readerDisplayGeneration||0)+1;
    this.handleBlockJump(event);
  },
  handleReadingOutlineShown() {
    const component=this.selectComponent('#knowledge-card');
    wx.createSelectorQuery().in(component).select('.knowledge-card-outline').boundingClientRect().selectViewport().scrollOffset().exec(([rect,scroll])=>{
      if(rect)wx.pageScrollTo({scrollTop:Math.max(0,(scroll?.scrollTop||0)+rect.top-this.data.navigation.totalHeight-12),duration:0});
    });
  },
  handleDisplay() {
    const current = getDisplayPreferences();
    const fontScale = current.fontScale === "default" ? "large" : current.fontScale === "large" ? "extraLarge" : "default";
    saveDisplayPreferences({ ...current, fontScale });
    this.renderCard();
    wx.showToast({ title: fontScale === "default" ? "标准字号" : fontScale === "large" ? "大字号" : "特大字号", icon: "none" });
  },

  handleDisplayToggle() {
    this.setData({ displayMenuVisible: !this.data.displayMenuVisible });
  },

  handleDisplaySelect(event) {
    const fontScale = event.currentTarget.dataset.fontScale;
    if (!["default", "large", "extraLarge"].includes(fontScale)) return;
    saveDisplayPreferences({ ...getDisplayPreferences(), fontScale });
    this.setData({ displayMenuVisible: false });
    this.renderCard();
  },

  handleSourceFeedback() {
    this.setData({ sourceVisible: true });
  },

  handleSourceClose() { this.setData({ sourceVisible: false }); },
  handleCorrectionOpen() {
    this.setData({ sourceVisible: false, correctionVisible: true, correctionDescription: "", correctionType: correctionTypes[0] });
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
    const blockId = this.data.activeBlockId || this.knowledgeContext.anchor?.blockId || null;
    const block = this.unit.blocks.find((item) => item.id === blockId);
    queue.push({
      id: `politics-feedback:${Date.now()}`,
      pointId: this.pointId,
      contentVersion: this.data.cardSurface?.identity.contentVersion || this.unit.contentVersion,
      blockId: block?.id || null,
      sourceRefIds: block?.sourceRefIds || this.unit.sourceRefIds,
      sourcePages: this.data.cardSurface?.sources.flatMap((item) => item.sourcePages) || [],
      type: this.data.correctionType,
      description: String(this.data.correctionDescription || "").trim(),
      status: "local-pending",
      createdAt: Date.now(),
    });
    try { wx.setStorageSync(correctionStorageKey, queue); }
    catch (error) {
      wx.showToast({ title: "保存失败，请重试", icon: "none" });
      return;
    }
    this.setData({ correctionVisible: false, correctionCount: queue.length });
    wx.showToast({ title: "已保存到本机", icon: "none" });
  },

  handleReturnHome() {
    wx.switchTab({ url: "/pages/politics/index" });
  },

  onUnload() {
    this.cancelReadingAnchor();
    if (this.blockHighlightTimer) clearTimeout(this.blockHighlightTimer);
  },

  onShareAppMessage() {
    return this.data.cardSurface
      ? { title: `${this.data.cardSurface.identity.title}｜政治理论`, path: `/subpackages/politics/detail/index?id=${encodeURIComponent(this.pointId)}` }
      : { title: "政治理论知识" };
  },
});
