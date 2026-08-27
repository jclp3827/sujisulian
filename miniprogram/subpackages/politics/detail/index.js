const knowledgePackage = require("../../../models/politics-preview");

function getPoint(pointId) {
  return knowledgePackage.points.find((point) => point.id === pointId);
}

function getRelationCounts(point) {
  const subsequentCount = knowledgePackage.points.filter((item) =>
    item.relations.prerequisites.includes(point.id)
  ).length;
  return [
    { type: "prerequisites", label: "前置", count: point.relations.prerequisites.length },
    { type: "contrasts", label: "易混", count: point.relations.contrasts.length },
    { type: "related", label: "相关", count: point.relations.related.length },
    { type: "subsequent", label: "后续", count: subsequentCount },
  ];
}

Page({
  data: {
    module: knowledgePackage.module,
    point: null,
    mode: "reading",
    positionText: "",
    previousPointId: "",
    nextPointId: "",
    relationCounts: [],
    cardAnswerVisible: false,
  },

  onLoad(options) {
    const pointIndex = knowledgePackage.points.findIndex((item) => item.id === options.id);
    if (pointIndex < 0) {
      wx.showToast({ title: "知识点不存在", icon: "none" });
      return;
    }
    const point = knowledgePackage.points[pointIndex];
    wx.setNavigationBarTitle({ title: point.title });
    this.setData({
      point: {
        ...point,
        sourceUnitsText: point.sourceUnits.join("、"),
      },
      mode: options.mode === "recall" ? "recall" : "reading",
      positionText: `${pointIndex + 1} / ${knowledgePackage.points.length}`,
      previousPointId: knowledgePackage.points[pointIndex - 1]?.id || "",
      nextPointId: knowledgePackage.points[pointIndex + 1]?.id || "",
      relationCounts: getRelationCounts(point),
    });
  },

  handleModeTap(event) {
    const { mode } = event.currentTarget.dataset;
    if (mode !== "reading" && mode !== "recall") return;
    this.setData({ mode, cardAnswerVisible: false });
  },

  handleCardToggle() {
    this.setData({ cardAnswerVisible: !this.data.cardAnswerVisible });
  },

  handleRelationExplore() {
    const point = this.data.point;
    if (!point) return;
    wx.navigateTo({
      url: `/subpackages/politics/map/index?focus=${encodeURIComponent(point.id)}&mode=relations`,
    });
  },

  handleMapLocation() {
    const point = this.data.point;
    if (!point) return;
    wx.navigateTo({
      url: `/subpackages/politics/map/index?focus=${encodeURIComponent(point.id)}`,
    });
  },

  handleAdjacentTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId || !getPoint(pointId)) return;
    wx.redirectTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(pointId)}&mode=${this.data.mode}`,
    });
  },
});
