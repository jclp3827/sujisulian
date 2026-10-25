const knowledgePackage = require("../../../models/politics-p3-v2-preview");

const relationLabels = {
  prerequisites: "前置知识",
  contrasts: "易混知识",
  related: "相关知识",
  subsequent: "后续知识",
};

function getPoint(pointId) {
  return knowledgePackage.points.find((point) => point.id === pointId);
}

function getCategoryByTitle(title) {
  return knowledgePackage.categories.find((category) => category.title === title);
}

function getCategoryPath(category) {
  const firstPoint = category?.pointIds.map(getPoint).find(Boolean);
  return (firstPoint?.hierarchyTitles || [category?.title || ""]).slice(1, -1).join(" › ");
}

function getPointRelationCount(point) {
  if (point.relationItems) {
    const keys = new Set(
      [...point.relationItems, ...(point.reverseRelations || [])]
        .filter((item) => item.targetId !== point.id)
        .map((item) => `${item.type}|${item.targetId}`),
    );
    return keys.size;
  }
  const outbound = Object.values(point.relations || {}).reduce((total, ids) => total + ids.length, 0);
  const subsequent = knowledgePackage.points.filter((item) =>
    (item.relations?.prerequisites || []).includes(point.id)
  ).length;
  return outbound + subsequent;
}

function buildCategoryView(categoryMap) {
  return {
    ...categoryMap,
    layers: categoryMap.layers.map((layer) => ({
      ...layer,
      label: layer.depth === 0 ? "学习起点" : `前置深度 ${layer.depth}`,
      points: layer.pointIds.map(getPoint).filter(Boolean).map((point, index) => ({
        ...point,
        relationCount: getPointRelationCount(point),
        recallLabel: `D${layer.depth} · 节点 ${index + 1}`,
        statusLabel: point.publishable ? "已审核" : "待校对",
        riskLabel: point.riskPages?.length ? `风险页 ${point.riskPages.join("、")}` : "",
      })),
    })),
  };
}

function getRelationGroups(point) {
  let sourceItems = [];
  if (point.relationItems) {
    sourceItems = [...point.relationItems, ...(point.reverseRelations || [])];
  } else {
    Object.keys(point.relations || {}).forEach((type) => {
      point.relations[type].forEach((targetId) => {
        sourceItems.push({ type, targetId, why: "已确认的正式知识关系。" });
      });
    });
    knowledgePackage.points.forEach((candidate) => {
      if ((candidate.relations?.prerequisites || []).includes(point.id)) {
        sourceItems.push({
          type: "subsequent",
          targetId: candidate.id,
          why: `“${point.title}”是进入“${candidate.title}”的已确认前置。`,
        });
      }
    });
  }

  const seen = new Set();
  const groups = Object.keys(relationLabels).map((type) => ({ type, label: relationLabels[type], items: [] }));
  sourceItems.forEach((relation) => {
    const key = `${relation.type}|${relation.targetId}`;
    if (seen.has(key) || relation.targetId === point.id) return;
    const target = getPoint(relation.targetId);
    const group = groups.find((item) => item.type === relation.type);
    if (!target || !group) return;
    seen.add(key);
    group.items.push({ ...target, why: relation.why || "已确认的正式知识关系。" });
  });
  return groups.filter((group) => group.items.length);
}

Page({
  data: {
    module: knowledgePackage.module,
    mapLevel: "overview",
    categoryCards: knowledgePackage.knowledgeMap.map((categoryMap, index) => {
      const category = getCategoryByTitle(categoryMap.title);
      return {
        id: category?.id || `category-${index + 1}`,
        title: categoryMap.title,
        pathLabel: getCategoryPath(category),
        pointCount: category?.pointIds.length || 0,
        layerCount: categoryMap.layers.length,
      };
    }),
    activeCategory: null,
    selectedPoint: null,
    selectedPointId: "",
    previewVisible: false,
    relationMode: false,
    relationGroups: [],
    recallMasked: false,
    nodeAnswerVisible: true,
  },

  onLoad(options) {
    wx.setNavigationBarTitle({ title: "政治知识地图" });
    if (options.focus && getPoint(options.focus)) {
      this.openPoint(options.focus, options.mode === "relations");
    }
  },

  handleCategoryTap(event) {
    const { categoryId } = event.currentTarget.dataset;
    const card = this.data.categoryCards.find((item) => item.id === categoryId);
    const categoryMap = card && knowledgePackage.knowledgeMap.find((item) => item.title === card.title);
    if (!categoryMap) return;
    this.setData({
      mapLevel: "branch",
      activeCategory: buildCategoryView(categoryMap),
      previewVisible: false,
      relationMode: false,
    });
    wx.pageScrollTo({ scrollTop: 0, duration: 180 });
  },

  handlePointTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId) return;
    this.selectPoint(pointId, false);
  },

  openPoint(pointId, relationMode) {
    const point = getPoint(pointId);
    if (!point) return;
    const categoryMap = knowledgePackage.knowledgeMap.find((item) => item.title === point.category);
    this.setData({
      mapLevel: "branch",
      activeCategory: categoryMap ? buildCategoryView(categoryMap) : null,
    }, () => this.selectPoint(pointId, relationMode));
  },

  selectPoint(pointId, relationMode) {
    const point = getPoint(pointId);
    if (!point) return;
    this.setData({
      selectedPoint: {
        ...point,
        hierarchyText: (point.hierarchyTitles || [point.category, point.title]).join(" › "),
        relationCount: getPointRelationCount(point),
        statusLabel: point.publishable ? "已审核" : "待校对",
        riskLabel: point.riskPages?.length ? `风险页 ${point.riskPages.join("、")}` : "",
      },
      selectedPointId: point.id,
      previewVisible: true,
      relationMode,
      relationGroups: getRelationGroups(point),
      nodeAnswerVisible: !this.data.recallMasked,
    });
  },

  handlePreviewClose() {
    this.setData({ previewVisible: false, relationMode: false });
  },

  handleMapOverviewTap() {
    this.setData({
      mapLevel: "overview",
      activeCategory: null,
      previewVisible: false,
      relationMode: false,
    });
    wx.pageScrollTo({ scrollTop: 0, duration: 180 });
  },

  handleMapRecallToggle() {
    const recallMasked = !this.data.recallMasked;
    const patch = {
      recallMasked,
      previewVisible: false,
      relationMode: false,
      nodeAnswerVisible: !recallMasked,
    };
    if (recallMasked && this.data.mapLevel === "overview" && knowledgePackage.knowledgeMap[0]) {
      patch.mapLevel = "branch";
      patch.activeCategory = buildCategoryView(knowledgePackage.knowledgeMap[0]);
    }
    this.setData(patch);
    wx.showToast({
      title: recallMasked ? "已遮蔽节点，按位置回忆" : "已显示知识节点",
      icon: "none",
    });
  },

  handleNodeAnswerReveal() {
    this.setData({ nodeAnswerVisible: true });
  },

  handleCurrentTap() {
    const point = this.data.selectedPoint;
    if (!point) {
      wx.showToast({ title: "请先选择一个知识点", icon: "none" });
      return;
    }
    this.openPoint(point.id, false);
    wx.pageScrollTo({ selector: `#map-node-${point.id}`, duration: 260 });
  },

  handleOpenFocusMode(event) {
    const point = this.data.selectedPoint;
    const mode = event.currentTarget.dataset.mode || "reading";
    if (!point) return;
    wx.navigateTo({
      url: `/subpackages/politics/detail/index?id=${encodeURIComponent(point.id)}&mode=${mode}&origin=map`,
    });
  },

  handleRelationsTap() {
    this.setData({ relationMode: true });
  },

  handlePreviewSummaryTap() {
    this.setData({ relationMode: false });
  },

  handleRelationPointTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId) return;
    this.openPoint(pointId, true);
  },

  onShareAppMessage() {
    const point = this.data.selectedPoint;
    return point
      ? {
          title: `${point.title}｜政治知识地图`,
          path: `/subpackages/politics/map/index?focus=${encodeURIComponent(point.id)}`,
        }
      : { title: "政治理论知识地图" };
  },
});
