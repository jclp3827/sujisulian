const { withEntryTapGuard, rememberSearchScroll, markSearchReturn, resetSearchScroll, restoreSearchScroll } = require('../../../utils/module-home-navigation');
const { knowledgePackage } = require("../../../services/knowledge-platform/politics-runtime");
const {
  SEARCH_INTENTS,
  applyContextEvent,
  createKnowledgeContext,
  projectSearchResults,
  projectSurfaceDecision,
  storageKey,
  toRecentModuleContext,
} = require("../../../services/knowledge-platform/index");

const suggestions = ["中国式现代化", "高质量发展", "马克思主义", "物质与意识", "剩余价值"];

function displayResults(query, intent) {
  return projectSearchResults(knowledgePackage, query, intent).map((item) => ({
    ...item,
    id: item.pointId,
    publishable: item.reviewState === "approved",
    statusLabel: item.reviewState === "approved" ? "已审核" : "待校对",
    riskLabel: item.riskFlags.length ? item.riskFlags.join(" · ") : "",
  }));
}

Page(withEntryTapGuard({
  data: {
    module: { title: knowledgePackage.moduleProfile.title, pointCount: knowledgePackage.knowledgeUnits.length },
    keyword: "", results: [], hasQuery: false, inputFocused: true, suggestions,
    intents: SEARCH_INTENTS, intent: "all", selectedResultId: null, storageNotice: "",
  },
  onLoad(options) {
    wx.setNavigationBarTitle({ title: "政治知识搜索" });
    this.knowledgeContext = createKnowledgeContext("politics", { origin: { type: "search", refId: "politics" } });
    if (options.q) {
      this.runSearch(decodeURIComponent(options.q), options.intent || "all", {
        resultId: options.resultId ? decodeURIComponent(options.resultId) : null,
        resultIndex: Number.isInteger(Number(options.resultIndex)) ? Number(options.resultIndex) : null,
      });
    }
  },
  runSearch(value, intent = this.data.intent, restore = null) {
    const keyword = String(value || "");
    const results = displayResults(keyword, intent);
    this.setData({ keyword, intent, results, hasQuery: Boolean(keyword.trim()), selectedResultId: restore?.resultId || null }, () => {
      if (!restore?.resultId) return;
      const resultIndex = results.findIndex((item) => item.pointId === restore.resultId);
      if (resultIndex < 0) return;
      wx.pageScrollTo({ selector: `#search-result-${resultIndex}`, duration: 0 });
    });
  },
  // Native back keeps the query, scope and rendered results on this page instance.
  onPageScroll(event) { rememberSearchScroll(this, event); },
  onShow() { restoreSearchScroll(this, wx); },
  onUnload() { if (this._searchTimer) clearTimeout(this._searchTimer); },

  handleInput(event) { this.runSearch(event.detail.value); },
  handleSuggestionTap(event) { this.runSearch(event.currentTarget.dataset.keyword); },
  handleIntentTap(event) { this.runSearch(this.data.keyword, event.currentTarget.dataset.intent); },
  handleClear() { resetSearchScroll(this); this.setData({ keyword: "", results: [], hasQuery: false, inputFocused: true, selectedResultId: null }); },
  handleResultTap(event) {
    const result = this.data.results.find((item) => item.pointId === event.currentTarget.dataset.pointId) || null;
    if (!result) return;
    const resultIndex = this.data.results.findIndex((item) => item.pointId === result.pointId);
    this.openResult(result, resultIndex);
  },
  openResult(result, resultIndex) {
    const searchSnapshot = {
      query: this.data.keyword,
      intent: this.data.intent,
      resultId: result.pointId,
      resultIndex,
      scrollAnchorId: `result:${resultIndex}`,
      matchEvidence: result.matchLabel,
    };
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
      type: "UPDATE_SEARCH_SNAPSHOT",
      snapshot: searchSnapshot,
      at: Date.now(),
    });
    const decision = projectSurfaceDecision(knowledgePackage, this.knowledgeContext, {
      kind: "search-result",
      result,
      searchSnapshot,
    });
    const action = decision.recommendedAction;
    if (!action) return;
    markSearchReturn(this);
    const pointId = action.objectId || action.event.pointId;
    const blockId = result.blockId || "";
    this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, { ...action.event, at: Date.now() });
    if (action.commitsFocus && this.knowledgeContext.focus && action.targetActivity !== this.knowledgeContext.activity) {
      this.knowledgeContext = applyContextEvent(knowledgePackage, this.knowledgeContext, {
        type: "SWITCH_ACTIVITY",
        activity: action.targetActivity,
        anchor: blockId && action.targetActivity === "reading" ? { blockId } : null,
        at: Date.now(),
      });
    }
    if (action.commitsFocus) {
      try {
        wx.setStorageSync(storageKey("politics"), toRecentModuleContext(knowledgePackage, this.knowledgeContext));
        this.setData({ storageNotice: "" });
      } catch (error) {
        this.setData({ storageNotice: "本次位置未能保存到本机；返回搜索页仍可继续，退出后可能无法续接。" });
      }
    }
    this.setData({ inputFocused: false, selectedResultId: result.pointId });
    const unit = knowledgePackage.knowledgeUnits.find((item) => item.id === pointId);
    const node = knowledgePackage.navigationNodes.find((item) => item.id === unit?.navigationNodeId);
    const mode = action.targetActivity;
    const query = [
      "origin=search",
      `q=${encodeURIComponent(this.knowledgeContext.snapshots.search.query)}`,
      `intent=${encodeURIComponent(this.knowledgeContext.snapshots.search.intent)}`,
      `resultId=${encodeURIComponent(result.pointId)}`,
      `resultIndex=${this.knowledgeContext.snapshots.search.resultIndex}`,
      `evidence=${encodeURIComponent(this.knowledgeContext.snapshots.search.matchEvidence || "")}`,
    ];
    if (mode === "system") {
      query.unshift("state=branch", `scope=${encodeURIComponent(node?.parentId || node?.id || "")}`);
      wx.navigateTo({ url: `/subpackages/politics/map/index?${query.join("&")}` });
      return;
    }
    if (mode === "relations" && result.relationId) query.push(`relation=${encodeURIComponent(result.relationId)}`);
    if (blockId) query.push(`block=${encodeURIComponent(blockId)}`);
    query.unshift(`mode=${encodeURIComponent(mode)}`, `id=${encodeURIComponent(pointId)}`);
    wx.navigateTo({ url: `/subpackages/politics/detail/index?${query.join("&")}` });
  },
  handleBrowseOverview() {
    wx.navigateTo({ url: "/subpackages/politics/map/index?state=overview" });
  },
  onShareAppMessage() { return { title: "政治理论知识搜索" }; },
}, ['handleResultTap']));
