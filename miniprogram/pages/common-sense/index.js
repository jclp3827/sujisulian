const { withEntryTapGuard } = require('../../utils/module-home-navigation');
const COMMON_SENSE_POINT_COUNT = 170;

const commonSenseModule = {
  id: "common-sense",
  title: "常识",
  description: "按篇、章、节组织背诵材料，逐层进入对应知识卡。",
};

const partItems = [
  { id: "humanities-history", order: "第一篇", title: "文史常识", subtitle: "历史、文学与科技文化", metaText: "3 章", pointCount: 38 },
  { id: "science-technology", order: "第二篇", title: "科技常识", subtitle: "科技史、基础科学与高新技术", metaText: "3 章", pointCount: 36 },
  { id: "economics", order: "第三篇", title: "经济常识", subtitle: "市场、微观、宏观与国际经济", metaText: "4 章", pointCount: 40 },
  { id: "law", order: "第四篇", title: "法律常识", subtitle: "宪法、民法典、刑法与行政执法", metaText: "4 章", pointCount: 56 },
].map((part) => ({
  ...part,
  hasChildren: true,
  status: "ready",
  statusText: "可学习",
  targetType: "part",
  partId: part.id,
}));

Page(withEntryTapGuard({
  data: {
    module: commonSenseModule,
    level: "parts",
    eyebrow: "知识地图",
    title: "常识",
    description: "文史、科技、经济与法律，按专题逐步积累。",
    items: partItems,
    showSearch: true,
    searchText: "搜索",
    titlePointCount: COMMON_SENSE_POINT_COUNT,
    features: [
      { id: "qa", title: "一问一答", description: "先判断，再看解释" },
      { id: "guide", title: "知识导读", description: "按知识组，逐点回顾" },
      { id: "confusion", title: "易混辨析", description: "对照概念，分清边界" },
      { id: "exam", title: "考前急救", description: "精选回看，查漏补缺" },
    ],
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: "常识" });
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 3 });
  },

  handleFeature(event) {
    const mode = event.currentTarget.dataset.mode;
    let development = false;
    try { development = wx.getAccountInfoSync().miniProgram.envVersion === "develop"; } catch (_) { /* Keep candidate entry closed. */ }
    const preview = mode === "guide" && development ? "&sample=expansion-v1" : "";
    wx.navigateTo({ url: mode === "topics" ? "/subpackages/common-sense/topics/index" :
      `/subpackages/common-sense/learning/index?mode=${encodeURIComponent(mode)}${preview}` });
  },
  handleSearchTap() {
    wx.navigateTo({ url: "/subpackages/common-sense/search/index?moduleId=common-sense" });
  },
  handleTopicsTap() {
    wx.navigateTo({ url: "/subpackages/common-sense/topics/index" });
  },

  handleItemTap(event) {
    const { targetType, partId } = event.currentTarget.dataset;
    if (targetType === "part" && partId) {
      wx.navigateTo({ url: `/subpackages/common-sense/topics/index?partId=${encodeURIComponent(partId)}` });
      return;
    }
  },
}, ['handleSearchTap', 'handleTopicsTap', 'handleFeature', 'handleItemTap']));
