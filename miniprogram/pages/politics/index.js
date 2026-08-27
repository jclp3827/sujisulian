const knowledgePackage = require("../../models/politics-preview");

Page({
  data: {
    module: knowledgePackage.module,
    firstPointId: knowledgePackage.points[0] && knowledgePackage.points[0].id,
    categories: knowledgePackage.categories.map((category) => ({
      ...category,
      points: category.pointIds
        .map((id) => knowledgePackage.points.find((point) => point.id === id))
        .filter(Boolean),
    })),
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: "政治理论" });
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 3 });
  },

  handlePointTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId) return;
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(pointId)}`,
    });
  },

  handleMapTap() {
    wx.navigateTo({ url: "/subpackages/politics/map/index" });
  },

  handleRecallTap() {
    if (!this.data.firstPointId) return;
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(this.data.firstPointId)}&mode=recall`,
    });
  },

  onShareAppMessage() {
    return { title: "政治理论知识体系" };
  },
});
