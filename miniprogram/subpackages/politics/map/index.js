const { knowledgePackage } = require("../../../services/knowledge-platform/politics-runtime");
const {
  applyContextEvent,
  createKnowledgeContext,
  fromRecentModuleContext,
  getDisplayPreferences,
  projectKnowledgeSpaceViewModel,
  storageKey,
  toRecentModuleContext,
} = require("../../../services/knowledge-platform/index");

function decode(value) {
  try { return decodeURIComponent(value || ""); }
  catch (error) { return String(value || ""); }
}

function readRecent() {
  try { return wx.getStorageSync(storageKey("politics")); }
  catch (error) { return null; }
}

Page({
  data: {
    space: null,
  },

  onLoad(options = {}) {
    wx.setNavigationBarTitle({ title: "政治理论知识空间" });
    this.knowledgeContext = fromRecentModuleContext(knowledgePackage, readRecent());
    if (!this.knowledgeContext.focus) this.knowledgeContext = createKnowledgeContext("politics");
    const saved = options.restore === "1" ? this.knowledgeContext.snapshots.system || {} : {};
    const rootId = knowledgePackage.indexes.rootNavigationIds[0];
    const firstRegionId = knowledgePackage.navigationNodes.find((node) => node.id === rootId)?.childIds?.[0];
    const restoredScopeId = saved.scopeNodeId && saved.scopeNodeId !== rootId ? saved.scopeNodeId : null;
    const expandedBranchId = decode(options.scope || options.branch)
      || saved.expandedNodeIds?.[0]
      || restoredScopeId
      || firstRegionId;
    const requestedState = expandedBranchId ? "branch" : "overview";
    const preferences = getDisplayPreferences();
    const defaultCollapsedChapterIds = knowledgePackage.navigationNodes
      .filter((node) => node.type === "chapter")
      .slice(1)
      .map((node) => node.id);
    this.spaceState = {
      surfaceState: requestedState,
      expandedBranchId,
      projection: "terrain",
      viewportToken: saved.viewportToken || (requestedState === "branch" ? "L1" : "L0"),
      scrollAnchorId: decode(options.anchor) || (saved.projection === "directory" ? null : saved.scrollAnchorId) || null,
      displayPreferences: preferences,
      collapsedScopeIds: Array.isArray(saved.collapsedScopeIds) ? saved.collapsedScopeIds : [],
      collapsedChapterIds: Array.isArray(saved.collapsedChapterIds) ? saved.collapsedChapterIds : defaultCollapsedChapterIds,
    };
    this.pendingViewportAnchorId = options.restore === "1" ? this.spaceState.scrollAnchorId : null;
    this.renderSpace();
  },

  onShow() {
    if (this.spaceState && this.data.space) this.renderSpace();
  },

  renderSpace() {
    this.spaceState.displayPreferences = getDisplayPreferences();
    const space = projectKnowledgeSpaceViewModel(knowledgePackage, this.knowledgeContext, this.spaceState);
    this.spaceState = {
      ...this.spaceState,
      surfaceState: space.surfaceState,
      projection: space.projection,
      expandedBranchId: space.branch?.id || null,
    };
    this.setData({ space }, () => {
      if (!this.pendingViewportAnchorId) return;
      const anchorId = this.pendingViewportAnchorId;
      this.pendingViewportAnchorId = null;
      wx.pageScrollTo({ selector: `#${anchorId}`, duration: this.spaceState.displayPreferences.motion === "reduced" ? 0 : 180 });
    });
  },

  persistContext() {
    const recent = toRecentModuleContext(knowledgePackage, this.knowledgeContext);
    if (!recent) return;
    try { wx.setStorageSync(storageKey("politics"), recent); }
    catch (error) {}
  },

  saveViewport() {
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "UPDATE_SYSTEM_SNAPSHOT",
      snapshot: {
        projection: this.spaceState.projection,
        expandedNodeIds: this.spaceState.expandedBranchId ? [this.spaceState.expandedBranchId] : [],
        focusNodeId: this.knowledgeContext.focus?.navigationNodeId || null,
        scrollAnchorId: this.spaceState.scrollAnchorId || null,
        viewportToken: this.spaceState.viewportToken,
        scopeNodeId: this.spaceState.expandedBranchId || knowledgePackage.indexes.rootNavigationIds[0],
        collapsedScopeIds: this.spaceState.collapsedScopeIds,
        collapsedChapterIds: this.spaceState.collapsedChapterIds,
      },
      at: Date.now(),
    });
    this.persistContext();
  },

  handleRegionTap(event) {
    const nodeId = event.detail?.nodeId || event.currentTarget?.dataset?.nodeId;
    if (!nodeId) return;
    this.spaceState = {
      ...this.spaceState,
      surfaceState: "branch",
      expandedBranchId: nodeId,
      viewportToken: "L1",
      scrollAnchorId: `knowledge-node-${nodeId}`,
    };
    this.saveViewport();
    this.renderSpace();
  },

  handleBranchNodeTap(event) {
    const nodeId = event.detail?.nodeId || event.currentTarget?.dataset?.nodeId;
    const pointId = event.detail?.pointId
      || knowledgePackage.navigationNodes.find((item) => item.id === nodeId)?.pointId;
    if (!pointId) return;
    const origin = this.spaceState.projection === "directory" ? "directory" : "terrain";
    this.openPoint(pointId, origin, event.detail?.anchorId || `knowledge-node-${nodeId}`);
  },
  handleRangeToggle() {
    const id = this.data.space?.branch?.id;
    if (!id) return;
    const ids = this.spaceState.collapsedScopeIds || [];
    this.spaceState.collapsedScopeIds = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
    this.spaceState.scrollAnchorId = `knowledge-branch-${id}`;
    this.saveViewport();
    this.renderSpace();
  },
  handleChapterToggle(event) {
    const id = event.detail?.nodeId;
    const row = this.data.space?.branch?.directoryRows.find((item) => item.id === id && item.collapsible);
    if (!row) return;
    const ids = this.spaceState.collapsedChapterIds || [];
    this.spaceState.collapsedChapterIds = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
    this.spaceState.scrollAnchorId = row.domId;
    this.saveViewport();
    this.renderSpace();
  },

  handleDirectoryItemTap(event) {
    const pointId = event.detail?.pointId || event.currentTarget?.dataset?.pointId;
    if (!pointId) return;
    this.openPoint(pointId, "directory", event.detail?.anchorId || `knowledge-directory-${pointId}`);
  },

  openPoint(pointId, origin, anchorId) {
    const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === pointId);
    if (!unit) return;
    this.spaceState.scrollAnchorId = anchorId || this.spaceState.scrollAnchorId;
    this.saveViewport();
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "SELECT_POINT",
      pointId,
      origin: { type: origin, refId: this.spaceState.expandedBranchId || unit.navigationNodeId },
      at: Date.now(),
    });
    this.persistContext();
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(pointId)}&mode=reading&origin=${encodeURIComponent(origin)}`,
    });
  },

  onShareAppMessage() {
    return { title: "政治理论知识空间" };
  },
});
