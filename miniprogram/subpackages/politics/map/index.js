const knowledgePackage = require("../../../models/politics-preview");
const relationLabels = {
  prerequisites: "前置知识",
  contrasts: "易混知识",
  related: "相关知识",
  subsequent: "后续知识",
};

function getPoint(pointId) {
  return knowledgePackage.points.find((point) => point.id === pointId);
}

function getRelationGroups(point) {
  const relationIds = {
    ...point.relations,
    subsequent: knowledgePackage.points
      .filter((item) => item.relations.prerequisites.includes(point.id))
      .map((item) => item.id),
  };
  return Object.keys(relationLabels).map((type) => ({
    type,
    label: relationLabels[type],
    items: relationIds[type].map(getPoint).filter(Boolean),
  })).filter((group) => group.items.length);
}

Page({
  data: {
    module: knowledgePackage.module,
    categories: knowledgePackage.knowledgeMap.map((category) => ({
      ...category,
      layers: category.layers.map((layer) => ({
        ...layer,
        label: layer.depth === 0 ? "学习起点" : `前置深度 ${layer.depth}`,
        points: layer.pointIds
          .map((id) => knowledgePackage.points.find((point) => point.id === id))
          .filter(Boolean),
      })),
    })),
    selectedPoint: null,
    selectedPointId: "",
    previewVisible: false,
    relationMode: false,
    relationGroups: [],
  },

  onLoad(options) {
    wx.setNavigationBarTitle({ title: "政治知识地图" });
    if (options.focus && getPoint(options.focus)) {
      this.selectPoint(options.focus, options.mode === "relations");
    }
  },

  handlePointTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId) return;
    this.selectPoint(pointId, false);
  },

  selectPoint(pointId, relationMode) {
    const point = getPoint(pointId);
    if (!point) return;
    this.setData({
      selectedPoint: point,
      selectedPointId: point.id,
      previewVisible: true,
      relationMode,
      relationGroups: getRelationGroups(point),
    });
  },

  handlePreviewClose() {
    this.setData({ previewVisible: false, relationMode: false });
  },

  handleReadTap() {
    const point = this.data.selectedPoint;
    if (!point) return;
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(point.id)}`,
    });
  },

  handleRecallTap() {
    const point = this.data.selectedPoint;
    if (!point) return;
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(point.id)}&mode=recall`,
    });
  },

  handleRelationsTap() {
    this.setData({ relationMode: true });
  },

  handleOverviewTap() {
    this.setData({ relationMode: false });
  },

  handleRelationPointTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId) return;
    this.selectPoint(pointId, true);
  },
});
