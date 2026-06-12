const { getTrainingItem } = require("../../../models/train-catalog");
const { getCognitionModule } = require("../../../models/cognition-catalog");
const { getCognitionBest } = require("../../../utils/cognition-bests");

const moduleVisuals = {
  schulte: {
    heroImage: "../../../images/visual/hero-cognition-right.png",
    accentClass: "guide-accent-purple",
  },
  "rolling-schulte": {
    heroImage: "../../../images/visual/hero-cognition-right.png",
    accentClass: "guide-accent-purple",
  },
  "flash-memory": {
    heroImage: "../../../images/visual/hero-cognition-right.png",
    accentClass: "guide-accent-purple",
  },
  "flash-calc": {
    heroImage: "../../../images/visual/hero-cognition-right.png",
    accentClass: "guide-accent-purple",
  },
};

function decorateLevel(module, level) {
  const best = getCognitionBest(module.id, level.id);
  return {
    ...level,
    todayBestText: best.todayBestText || "--",
    bestText: best.bestText || "--",
  };
}

function buildLevelGroupsView(module) {
  return (module.levelGroups || []).map((group) => ({
    ...group,
    levels: (group.levels || []).map((level) => decorateLevel(module, level)),
  }));
}

function buildLevelsView(module) {
  return (module.levels || []).map((level) => decorateLevel(module, level));
}

Page({
  data: {
    item: null,
    module: null,
    selectedLevelId: "",
    visual: null,
    levelGroupsView: [],
    levelsView: [],
    singleLevel: null,
  },

  onLoad(options) {
    const item = getTrainingItem("cognition", options.itemId);
    const module = getCognitionModule(options.itemId);
    if (!item || !module) {
      wx.showToast({
        title: "训练项不存在",
        icon: "none",
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: item.title,
    });

    this.itemId = options.itemId;
    this.setData({
      item,
      module,
      selectedLevelId: module.levels?.[0]?.id || module.levelGroups?.[0]?.levels?.[0]?.id || "",
      visual: moduleVisuals[module.id] || moduleVisuals[module.type] || null,
      levelGroupsView: buildLevelGroupsView(module),
      levelsView: buildLevelsView(module),
      singleLevel: module.levels?.length === 1 ? decorateLevel(module, module.levels[0]) : null,
    });
  },

  onShow() {
    if (this.data.module) {
      this.refreshBestRecords();
    }
  },

  refreshBestRecords() {
    const { module } = this.data;
    this.setData({
      levelGroupsView: buildLevelGroupsView(module),
      levelsView: buildLevelsView(module),
      singleLevel: module.levels?.length === 1 ? decorateLevel(module, module.levels[0]) : null,
    });
  },

  handleLevelTap(event) {
    const { levelId } = event.currentTarget.dataset;
    this.setData({
      selectedLevelId: levelId,
    });
  },

  startTraining() {
    const { module, selectedLevelId } = this.data;
    if (!module) return;

    wx.navigateTo({
      url: `/pages/cognition/session/index?itemId=${module.id}&levelId=${selectedLevelId}`,
    });
  },
});
