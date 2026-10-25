const knowledgePackage = require("../../models/politics-p3-v2-preview");

function withReviewMeta(point) {
  const riskPages = point.riskPages || [];
  return {
    ...point,
    statusLabel: point.publishable ? "已审核" : "待校对",
    riskLabel: riskPages.length ? `风险页 ${riskPages.join("、")}` : "",
  };
}

Page({
  data: {
    module: knowledgePackage.module,
    firstPointId: knowledgePackage.points[0] && knowledgePackage.points[0].id,
    categories: knowledgePackage.categories.map((category) => ({
      ...category,
      pathLabel: (() => {
        const firstPoint = category.pointIds
          .map((id) => knowledgePackage.points.find((point) => point.id === id))
          .find(Boolean);
        return (firstPoint?.hierarchyTitles || [category.title]).slice(1, -1).join(" › ");
      })(),
      points: category.pointIds
        .map((id) => knowledgePackage.points.find((point) => point.id === id))
        .filter(Boolean)
        .map(withReviewMeta),
    })),
    approvedCount: knowledgePackage.points.filter((point) => point.publishable).length,
    reviewCount: knowledgePackage.points.filter((point) => !point.publishable).length,
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
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(pointId)}&mode=reading&origin=directory`,
    });
  },

  handleMapTap() {
    wx.navigateTo({ url: "/subpackages/politics/map/index" });
  },

  handleSearchTap() {
    wx.navigateTo({ url: "/subpackages/politics/search/index" });
  },

  handleRecallTap() {
    if (!this.data.firstPointId) return;
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(this.data.firstPointId)}&mode=recall&origin=recall`,
    });
  },

  onShareAppMessage() {
    return { title: "政治理论知识体系" };
  },
});
