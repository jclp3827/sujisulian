const { knowledgePackage } = require("../../services/knowledge-platform/politics-runtime");
const {
  getDisplayPreferences,
  projectHomeDecision,
  saveDisplayPreferences,
  storageKey,
} = require("../../services/knowledge-platform/index");
const { ROUTE_TYPES, LEGACY_ROUTE_KEY, routeProgressKey, selectRouteRecord } = require("../../services/knowledge-platform/route-progress");

const ROUTE_DISPLAY = {
  systematic: { iconPath: "/images/politics/route-book.png", displayLine1: "按顺序学一个范围", displayLine2: "再主动回忆" },
  confusion: { iconPath: "/images/politics/route-bulb.png", displayLine1: "先判断一组概念", displayLine2: "再核对边界" },
  exam: { iconPath: "/images/politics/route-notes.png", displayLine1: "用回忆卡自测", displayLine2: "记住关键知识点" },
};

function readStorage(key) {
  try { return { ok: true, value: wx.getStorageSync(key) }; }
  catch (error) { return { ok: false, value: null }; }
}

function heroTitleTop() {
  try {
    const menuButton = wx.getMenuButtonBoundingClientRect?.();
    if (Number.isFinite(menuButton?.top) && menuButton.top > 0) {
      return Math.max(40, menuButton.top - 2);
    }
  } catch (error) {
    // Fall back to the status bar when the menu button position is unavailable.
  }
  try {
    const system = wx.getSystemInfoSync();
    return Math.max(40, (system.statusBarHeight || 20) - 7);
  } catch (error) {
    return 40;
  }
}

Page({
  data: {
    module: {
      title: knowledgePackage.moduleProfile.title,
      copy: knowledgePackage.moduleProfile.surfaceCopy,
    },
    heroSafeTop: heroTitleTop(),
    decision: null,
    resumePrompt: null,
    homeGoals: [],
    quickGoal: null,
    quickProgressLabel: "0%",
    routeCards: [],
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 3 });
    this.refreshDecision();
  },

  refreshDecision() {
    const recent = readStorage(storageKey("politics"));
    const ownRoutes = ROUTE_TYPES.map((type) => readStorage(routeProgressKey(type)));
    const legacy = readStorage(LEGACY_ROUTE_KEY);
    const routeRecords = ROUTE_TYPES.map((type, index) => selectRouteRecord(type, ownRoutes[index].value, legacy.value)).filter(Boolean);
    const decision = projectHomeDecision(knowledgePackage, {
      recent: recent.value,
      routeRecords,
      storageStatus: { ok: recent.ok && legacy.ok && ownRoutes.every((item) => item.ok) },
    });
    const goals = decision.goals || [];
    const quickGoal = goals.find((goal) => goal.id === "quick") || null;
    const routeCards = goals.filter((goal) => goal.id !== "quick").map((goal) => ({
      ...goal,
      ...ROUTE_DISPLAY[goal.id],
    }));
    const activeQuick = decision.stateId === "active-route" && decision.recommendedAction?.url?.includes("type=quick");
    this.setData({
      decision,
      homeGoals: goals,
      quickGoal,
      routeCards,
      quickProgressLabel: decision.storageStatus.ok ? `${quickGoal?.progressPercent || 0}%` : "—",
      resumePrompt: decision.stateId === "first-use" || activeQuick ? null : decision,
    });
  },

  handleSearchTap() {
    wx.navigateTo({ url: "/subpackages/politics/search/index" });
  },

  handleGoalTap(event) {
    const goal = this.data.homeGoals.find((item) => item.id === event.currentTarget.dataset.type);
    if (goal?.href) wx.navigateTo({ url: goal.href });
  },

  handlePrimaryTap() {
    const url = this.data.resumePrompt?.recommendedAction?.url;
    if (url) wx.navigateTo({ url });
  },

  handleTerrainTap() {
    saveDisplayPreferences({ ...getDisplayPreferences(), systemProjection: "terrain" });
    wx.navigateTo({ url: "/subpackages/politics/map/index?state=overview" });
  },

  handlePlaceholderTap(event) {
    const feature = event.currentTarget.dataset.feature;
    if (feature !== "favorites" && feature !== "daily") return;
    wx.navigateTo({ url: `/subpackages/politics/coming-soon/index?feature=${feature}` });
  },

  onShareAppMessage() {
    return { title: "政治理论知识体系" };
  },
});
