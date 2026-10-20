const summary = require('../../models/common-sense-summary');
const commonSenseModule = summary.module;
const partItems = summary.parts.map((part) => ({
  ...part,
  hasChildren: true,
  status: "ready",
  statusText: "可学习",
  targetType: "part",
  partId: part.id,
}));

Page({
  data: {
    module: commonSenseModule,
    level: "parts",
    eyebrow: "知识地图",
    title: "常识判断",
    description: "按教材目录分为文史、科技、经济、法律四篇。",
    items: partItems,
    showSearch: true,
    searchText: "搜索",
    titlePointCount: summary.totalPointCount,
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
  },
});
