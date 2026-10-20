const { knowledgePackage } = require("../../services/knowledge-platform/politics-runtime");
const {
  getDisplayPreferences,
  projectHomeDecision,
  saveDisplayPreferences,
  storageKey,
} = require("../../services/knowledge-platform/index");
const { ROUTE_TYPES, LEGACY_ROUTE_KEY, routeProgressKey, selectRouteRecord } = require("../../services/knowledge-platform/route-progress");

const ROUTE_DISPLAY = {
  quick: { displayLine1: "先看两条主线", displayLine2: "建立整体框架" },
  systematic: { displayLine1: "按篇章连续阅读", displayLine2: "逐步理解与回忆" },
  confusion: { displayLine1: "比较相近概念", displayLine2: "分清条件与边界" },
  exam: { displayLine1: "用回忆卡自测", displayLine2: "回看没记住的知识" },
};

function readStorage(key) {
  try { return { ok: true, value: wx.getStorageSync(key) }; }
  catch (error) { return { ok: false, value: null }; }
}

Page({
  data: {
    module: {
      title: knowledgePackage.moduleProfile.title,
      copy: knowledgePackage.moduleProfile.surfaceCopy,
    },
    decision: null,
    resumePrompt: null,
    homeGoals: [],
    quickGoal: null,
    activeGoal: null,
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
    const routeCards = (decision.otherGoals || goals).map((goal) => ({
      ...goal,
      ...ROUTE_DISPLAY[goal.id],
    }));
    const activeGoal = decision.stateId === "active-route"
      ? goals.find((goal) => goal.href === decision.recommendedAction?.url) || null
      : null;
    const resumePrompt = decision.stateId === "first-use" ? {
      ...decision,
      statusLabel: decision.storageStatus.ok ? "第一次来，从这里开始" : "从这里开始",
      title: "先看全貌，再深入知识",
      description: "用两条主线建立框架，再选择想深入的篇章。",
      recommendedAction: { ...decision.recommendedAction, label: quickGoal?.startAction || decision.recommendedAction.label },
    } : decision.stateId === "invalid-recovery" ? {
      ...decision,
      statusLabel: "内容已更新",
      title: "从新的内容继续探索",
      description: "上次位置对应旧版内容，重新开始即可阅读当前版本。",
      recommendedAction: { ...decision.recommendedAction, label: "重新开始" },
    } : decision;
    this.setData({
      decision,
      homeGoals: goals,
      quickGoal,
      routeCards,
      activeGoal,
      resumePrompt,
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
