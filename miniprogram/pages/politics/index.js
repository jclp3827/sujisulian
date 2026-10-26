const { withEntryTapGuard } = require('../../utils/module-home-navigation');
const { knowledgePackage } = require("../../services/knowledge-platform/politics-runtime");
const {
  getDisplayPreferences,
  projectHomeDecision,
  saveDisplayPreferences,
  storageKey,
} = require("../../services/knowledge-platform/index");
const { ROUTE_TYPES, LEGACY_ROUTE_KEY, routeProgressKey, selectRouteRecord } = require("../../services/knowledge-platform/route-progress");
const practiceBank = require("../../services/knowledge-platform/politics-practice-bank");
const { readPoliticsPracticeHome } = require("../../services/knowledge-platform/politics-practice");

const ROUTE_DISPLAY = {
  quick: { displayLine1: "抓住主线", displayLine2: "建立整体认知" },
  systematic: { displayLine1: "按单元深入", displayLine2: "逐步掌握" },
  confusion: { displayLine1: "对比概念", displayLine2: "厘清边界" },
  exam: { displayLine1: "主动回忆", displayLine2: "查漏补缺" },
};

function readStorage(key) {
  try { return { ok: true, value: wx.getStorageSync(key) }; }
  catch (error) { return { ok: false, value: null }; }
}

Page(withEntryTapGuard({
  data: {
    module: {
      title: knowledgePackage.moduleProfile.title,
      copy: knowledgePackage.moduleProfile.surfaceCopy,
    },
    decision: null,
    dailyCard: null,
    homeGoals: [],
    routeCards: [],
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 4 });
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
    const routeCards = goals.flatMap((goal) => {
      const card = { ...goal,
        progressText: goal.progressLabel ? goal.progressLabel.replace("进度已保留 · ", "") : "尚未开始",
        ...ROUTE_DISPLAY[goal.id],
      };
      return goal.id === "systematic" ? [card, {
        id: "qa", label: "理论速记", displayLine1: "一问一答", displayLine2: "随时自测",
        progressText: "自主练习", href: "/subpackages/politics/practice/index?mode=qa",
      }] : [card];
    });
    const dailyCard = readPoliticsPracticeHome(practiceBank, wx);
    this.setData({
      decision,
      homeGoals: goals,
      routeCards,
      dailyCard,
    });
  },

  handleSearchTap() {
    wx.navigateTo({ url: "/subpackages/politics/search/index" });
  },

  handleGoalTap(event) {
    const card = this.data.routeCards.find((item) => item.id === event.currentTarget.dataset.type);
    if (card?.href) wx.navigateTo({ url: card.href });
  },

  handleDailyTap() {
    wx.navigateTo({ url: this.data.dailyCard?.state === "empty"
      ? "/subpackages/politics/practice/index?mode=qa"
      : "/subpackages/politics/practice/index?mode=daily" });
  },

  handleTerrainTap() {
    saveDisplayPreferences({ ...getDisplayPreferences(), systemProjection: "terrain" });
    wx.navigateTo({ url: "/subpackages/politics/map/index?state=overview" });
  },

  handlePlaceholderTap(event) {
    const feature = event.currentTarget.dataset.feature;
    if (feature !== "favorites") return;
    wx.navigateTo({ url: `/subpackages/politics/coming-soon/index?feature=${feature}` });
  },

  onShareAppMessage() {
    return { title: "政治理论知识体系" };
  },
}, ['handleSearchTap', 'handleGoalTap', 'handleDailyTap', 'handleTerrainTap', 'handlePlaceholderTap']));
