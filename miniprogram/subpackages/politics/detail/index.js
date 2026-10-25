const knowledgePackage = require("../../../models/politics-p3-v2-preview");

const modeMeta = {
  system: { label: "体系", kicker: "体系定位 · 看见上下文" },
  reading: { label: "阅读", kicker: "完整阅读 · 从速览到证据" },
  relations: { label: "关系", kicker: "关系探索 · 理解为什么相关" },
  recall: { label: "回忆", kicker: "主动回忆 · 先作答再揭晓" },
};

const relationLabels = {
  prerequisites: "前置知识",
  contrasts: "易混知识",
  related: "相关知识",
  subsequent: "后续知识",
};

const correctionStorageKey = "politics-correction-queue-v1";
const correctionTypes = ["内容错误", "关系不准确", "来源问题", "展示问题"];

function getCorrectionQueue() {
  try {
    const records = wx.getStorageSync(correctionStorageKey);
    return Array.isArray(records) ? records : [];
  } catch (error) {
    return [];
  }
}

function getPoint(pointId) {
  return knowledgePackage.points.find((point) => point.id === pointId);
}

function getNavigationOrder() {
  return knowledgePackage.navigationOrder || knowledgePackage.points.map((point) => point.id);
}

function normalizeMode(mode) {
  if (mode === "map") return "system";
  return modeMeta[mode] ? mode : "reading";
}

function legacyRelationItems(point) {
  const items = [];
  Object.keys(point.relations || {}).forEach((type) => {
    (point.relations[type] || []).forEach((targetId) => {
      items.push({ type, targetId, why: "已确认的正式知识关系。", whySource: "derived" });
    });
  });
  knowledgePackage.points.forEach((candidate) => {
    if ((candidate.relations?.prerequisites || []).includes(point.id)) {
      items.push({
        type: "subsequent",
        targetId: candidate.id,
        why: `“${point.title}”是进入“${candidate.title}”的已确认前置。`,
        whySource: "derived",
      });
    }
  });
  return items;
}

function getRelationGroups(point) {
  const sourceItems = point.relationItems
    ? [...point.relationItems, ...(point.reverseRelations || [])]
    : legacyRelationItems(point);
  const seen = new Set();
  const itemsByType = {};
  Object.keys(relationLabels).forEach((type) => { itemsByType[type] = []; });

  sourceItems.forEach((relation) => {
    const key = `${relation.type}|${relation.targetId}`;
    if (relation.targetId === point.id || seen.has(key) || !itemsByType[relation.type]) return;
    const target = getPoint(relation.targetId);
    if (!target) return;
    seen.add(key);
    itemsByType[relation.type].push({
      ...target,
      why: relation.why || "已确认的正式知识关系。",
      whySource: relation.whySource || "derived",
    });
  });

  return Object.keys(relationLabels)
    .map((type) => ({ type, label: relationLabels[type], items: itemsByType[type] }))
    .filter((group) => group.items.length);
}

function getSystemLayers(point) {
  const category = knowledgePackage.knowledgeMap.find((item) => item.title === point.category);
  if (!category) return [];
  return category.layers.map((layer) => ({
    ...layer,
    label: layer.depth === 0 ? "学习起点" : `前置深度 ${layer.depth}`,
    points: layer.pointIds.map(getPoint).filter(Boolean).map((item) => ({
      ...item,
      isCurrent: item.id === point.id,
    })),
  }));
}

Page({
  data: {
    module: knowledgePackage.module,
    schemaVersion: knowledgePackage.schemaVersion || 1,
    modes: Object.keys(modeMeta).map((id) => ({ id, label: modeMeta[id].label })),
    point: null,
    mode: "reading",
    modeKicker: modeMeta.reading.kicker,
    positionText: "",
    previousPointId: "",
    nextPointId: "",
    relationGroups: [],
    relationCount: 0,
    systemLayers: [],
    explorationTrail: [],
    trailBackTitle: "",
    cardAnswerVisible: false,
    sourceExpanded: false,
    activeBlockId: "",
    correctionVisible: false,
    correctionTypes,
    correctionType: correctionTypes[0],
    correctionDescription: "",
    correctionBlockId: "",
    correctionCount: 0,
    origin: "directory",
  },

  onLoad(options) {
    this.loadPoint(options.id, normalizeMode(options.mode), false, options.origin || "directory");
  },

  loadPoint(pointId, mode, addTrail = false, origin = this.data.origin) {
    const point = getPoint(pointId);
    if (!point) {
      wx.showToast({ title: "知识点不存在", icon: "none" });
      return;
    }

    const order = getNavigationOrder();
    const pointIndex = order.indexOf(point.id);
    const relationGroups = getRelationGroups(point);
    let explorationTrail = this.data.explorationTrail || [];
    if (addTrail && this.data.point && this.data.point.id !== point.id) {
      explorationTrail = [...explorationTrail, {
        id: this.data.point.id,
        title: this.data.point.title,
      }].slice(-4);
    }

    wx.setNavigationBarTitle({ title: point.title });
    this.setData({
      point: {
        ...point,
        hierarchyText: (point.hierarchyTitles || [point.category, point.title]).join(" › "),
        mapDepth: point.mapDepth || 0,
        outline: point.outline || [],
        contentBlocks: (point.contentBlocks || []).map((block, index) => ({
          id: block.id || `legacy-content-${index + 1}`,
          semantic: block.semantic || "explanation",
          ...block,
        })),
        confusionBlocks: (point.confusionBlocks || []).map((block, index) => ({
          id: block.id || `legacy-confusion-${index + 1}`,
          semantic: block.semantic || "boundary",
          ...block,
        })),
        sourceUnitsText: point.sourceUnits.join("、"),
        sourcePagesText: (point.sourcePages || []).join("、"),
        riskPagesText: (point.riskPages || []).join("、"),
        statusLabel: point.publishable ? "已审核" : "待最终校对",
        reviewedAtText: point.reviewedAt || "尚未最终校对",
      },
      mode,
      modeKicker: modeMeta[mode].kicker,
      positionText: `${pointIndex + 1} / ${order.length}`,
      previousPointId: order[pointIndex - 1] || "",
      nextPointId: order[pointIndex + 1] || "",
      relationGroups,
      relationCount: relationGroups.reduce((total, group) => total + group.items.length, 0),
      systemLayers: getSystemLayers(point),
      explorationTrail,
      trailBackTitle: explorationTrail.length ? explorationTrail[explorationTrail.length - 1].title : "",
      cardAnswerVisible: false,
      sourceExpanded: false,
      activeBlockId: point.contentBlocks?.[0]?.id || "point",
      correctionVisible: false,
      correctionDescription: "",
      correctionBlockId: "",
      correctionCount: getCorrectionQueue().length,
      origin,
    });
    wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },

  handleModeTap(event) {
    const mode = normalizeMode(event.currentTarget.dataset.mode);
    this.setData({ mode, modeKicker: modeMeta[mode].kicker, cardAnswerVisible: false });
    wx.pageScrollTo({ scrollTop: 0, duration: 180 });
  },

  handleCardToggle() {
    this.setData({ cardAnswerVisible: !this.data.cardAnswerVisible });
  },

  handleSourceToggle() {
    this.setData({ sourceExpanded: !this.data.sourceExpanded });
  },

  handleOutlineTap(event) {
    const { blockId } = event.currentTarget.dataset;
    if (!blockId) return;
    this.setData({ activeBlockId: blockId });
    wx.pageScrollTo({ selector: `#${blockId}`, duration: 260 });
  },

  handleCorrectionOpen() {
    this.setData({
      correctionVisible: true,
      correctionType: correctionTypes[0],
      correctionDescription: "",
      correctionBlockId: this.data.activeBlockId || this.data.point?.contentBlocks?.[0]?.id || "point",
    });
  },

  handleCorrectionClose() {
    this.setData({ correctionVisible: false });
  },

  handleCorrectionSheetTap() {},

  handleCorrectionTypeTap(event) {
    const { type } = event.currentTarget.dataset;
    if (correctionTypes.includes(type)) this.setData({ correctionType: type });
  },

  handleCorrectionInput(event) {
    this.setData({ correctionDescription: event.detail.value });
  },

  handleCorrectionSave() {
    const description = this.data.correctionDescription.trim();
    const point = this.data.point;
    if (!description) {
      wx.showToast({ title: "请简要描述问题", icon: "none" });
      return;
    }
    const queue = getCorrectionQueue();
    const record = {
      id: `${point.id}-${Date.now()}`,
      moduleId: knowledgePackage.module.id,
      pointId: point.id,
      pointTitle: point.title,
      contentVersion: point.version,
      blockId: this.data.correctionBlockId || "point",
      type: this.data.correctionType,
      description,
      sourceFile: point.sourceFile,
      sourceUnits: [...point.sourceUnits],
      origin: this.data.origin,
      createdAt: new Date().toISOString(),
      status: "local-pending",
    };
    try {
      wx.setStorageSync(correctionStorageKey, [...queue, record]);
      this.setData({
        correctionVisible: false,
        correctionDescription: "",
        correctionCount: queue.length + 1,
      });
      wx.showToast({ title: "已保存到本地", icon: "success" });
    } catch (error) {
      wx.showToast({ title: "本地保存失败", icon: "none" });
    }
  },

  handleCorrectionCopy() {
    const records = getCorrectionQueue();
    if (!records.length) {
      wx.showToast({ title: "暂无待处理记录", icon: "none" });
      return;
    }
    wx.setClipboardData({
      data: JSON.stringify({ schemaVersion: 1, records }, null, 2),
      success: () => wx.showToast({ title: "记录已复制", icon: "success" }),
    });
  },

  handleMapLocation() {
    const point = this.data.point;
    if (!point) return;
    wx.navigateTo({ url: `/subpackages/politics/map/index?focus=${encodeURIComponent(point.id)}&origin=focus` });
  },

  handleSystemPointTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId || pointId === this.data.point?.id) return;
    this.loadPoint(pointId, "system", false);
  },

  handleRelationPointTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId) return;
    this.loadPoint(pointId, "relations", true);
  },

  handleTrailBack() {
    const trail = [...this.data.explorationTrail];
    const previous = trail.pop();
    if (!previous) return;
    this.setData({
      explorationTrail: trail,
      trailBackTitle: trail.length ? trail[trail.length - 1].title : "",
    }, () => this.loadPoint(previous.id, "relations", false));
  },

  handleAdjacentTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId || !getPoint(pointId)) return;
    this.loadPoint(pointId, this.data.mode, false);
  },

  onShareAppMessage() {
    const point = this.data.point;
    return point
      ? {
          title: `${point.title}｜政治理论`,
          path: `/subpackages/politics/detail/index?id=${encodeURIComponent(point.id)}&mode=${this.data.mode}`,
        }
      : { title: "政治理论知识体系" };
  },
});
