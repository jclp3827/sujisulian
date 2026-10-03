const { knowledgePackage } = require("../../services/knowledge-platform/politics-runtime");
const {
  getDisplayPreferences,
  projectHomeDecision,
  saveDisplayPreferences,
  storageKey,
} = require("../../services/knowledge-platform/index");

const { ROUTE_TYPES, LEGACY_ROUTE_KEY, routeProgressKey, selectRouteRecord } = require("../../services/knowledge-platform/route-progress");

function readStorage(key) {
  try { return { ok: true, value: wx.getStorageSync(key) }; }
  catch (error) { return { ok: false, value: null }; }
}

Page({
  data: {
    module: {
      title: knowledgePackage.moduleProfile.title,
      description: knowledgePackage.moduleProfile.description,
      pointCount: knowledgePackage.knowledgeUnits.length,
      copy: knowledgePackage.moduleProfile.surfaceCopy,
    },
    decision: null,
    otherGoals: [],
    recentDismissed: false,
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: "政治理论" });
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 3 });
    this.refreshDecision();
  },

  refreshDecision(ignoreRecent = false) {
    const recent = readStorage(storageKey("politics"));
    const ownRoutes = ROUTE_TYPES.map((type) => readStorage(routeProgressKey(type)));
    const legacy = readStorage(LEGACY_ROUTE_KEY);
    const routeRecords = ROUTE_TYPES.map((type, index) => selectRouteRecord(type, ownRoutes[index].value, legacy.value)).filter(Boolean);
    const decision = projectHomeDecision(knowledgePackage, {
      recent: ignoreRecent ? null : recent.value,
      routeRecords,
      storageStatus: { ok: recent.ok && legacy.ok && ownRoutes.every((item) => item.ok) },
    });
    this.setData({ decision, otherGoals: decision.otherGoals, recentDismissed: ignoreRecent });
  },

  handleTerrainTap() {
    saveDisplayPreferences({ ...getDisplayPreferences(), systemProjection: "terrain" });
    wx.navigateTo({ url: "/subpackages/politics/map/index?state=overview" });
  },

  handleSearchTap() {
    wx.navigateTo({ url: "/subpackages/politics/search/index" });
  },

  handleGoalTap(event) {
    const goal = this.data.otherGoals.find((item) => item.id === event.currentTarget.dataset.type);
    if (goal?.href) wx.navigateTo({ url: goal.href });
  },

  handlePrimaryTap() {
    const url = this.data.decision?.recommendedAction?.url;
    if (url) wx.navigateTo({ url });
  },

  handleSecondaryTap(event) {
    const action = this.data.decision?.secondaryActions?.find((item) => item.id === event.currentTarget.dataset.actionId);
    if (action?.url) wx.navigateTo({ url: action.url });
  },

  handleRecentDismiss() {
    this.refreshDecision(true);
  },

  onShareAppMessage() {
    return { title: "政治理论知识体系" };
  },
});
