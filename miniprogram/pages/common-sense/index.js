const COMMON_SENSE_POINT_COUNT = 160;

const commonSenseModule = {
  id: "common-sense",
  title: "常识判断",
  description: "按篇、章、节组织背诵材料，逐层进入对应知识卡。",
};

const partItems = [
  { id: "humanities-history", order: "第一篇", title: "文史常识", subtitle: "历史、文学与科技文化", metaText: "3 章", pointCount: 38 },
  { id: "science-technology", order: "第二篇", title: "科技常识", subtitle: "科技史、基础科学与高新技术", metaText: "3 章", pointCount: 36 },
  { id: "economics", order: "第三篇", title: "经济常识", subtitle: "市场、微观、宏观与国际经济", metaText: "4 章", pointCount: 40 },
  { id: "law", order: "第四篇", title: "法律常识", subtitle: "宪法、民法典总则与刑法", metaText: "4 章", pointCount: 46 },
].map((part) => ({
  ...part,
  hasChildren: true,
  status: "ready",
  statusText: "可学习",
  targetType: "part",
  partId: part.id,
}));

const readingPrototypeItem = {
  id: "reading-prototypes",
  order: "体验",
  title: "阅读优化样例",
  subtitle: "六张代表详情页保留为特殊阅读样例，可集中查看。",
  metaText: "6 张",
  pointCount: 6,
  hasChildren: true,
  status: "ready",
  statusText: "可学习",
  targetType: "prototype-index",
  partId: "",
};

Page({
  data: {
    module: commonSenseModule,
    level: "parts",
    eyebrow: "知识地图",
    title: "常识判断",
    description: "按教材目录分为文史、科技、经济、法律四篇。",
    items: partItems.concat(readingPrototypeItem),
    showSearch: true,
    searchText: "搜索",
    titlePointCount: COMMON_SENSE_POINT_COUNT,
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: "常识目录" });
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 2 });
  },

  handleSearchTap() {
    wx.navigateTo({ url: "/subpackages/common-sense/search/index?moduleId=common-sense" });
  },

  handleItemTap(event) {
    const { targetType, partId } = event.currentTarget.dataset;
    if (targetType === "part" && partId) {
      wx.navigateTo({ url: `/subpackages/common-sense/level/index?partId=${encodeURIComponent(partId)}` });
      return;
    }
    if (targetType === "prototype-index") {
      wx.navigateTo({ url: "/subpackages/common-sense/level/index?view=prototypes" });
    }
  },
});
