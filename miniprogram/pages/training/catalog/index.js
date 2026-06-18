const { getSectionById, getTrainingItem } = require("../../../models/train-catalog");
const { buildTrainingConfig, getConfigSections, QUESTION_COUNT_PRESETS } = require("../../../models/train-config");

const calculationIcons = {
  "two-digit-add-sub": "../../../images/visual/icon-add-box-a.png",
  "make-hundred": "../../../images/visual/icon-target.png",
  "three-digit-add": "../../../images/visual/icon-add-box-b.png",
  "three-digit-sub": "../../../images/visual/icon-minus-box.png",
  "three-digit-mix": "../../../images/visual/icon-plus.png",
  "multi-add": "../../../images/visual/icon-grid.png",
  "mixed-add-sub": "../../../images/visual/icon-grid.png",
  "two-digit-mul-one-digit": "../../../images/visual/icon-multiply.png",
  "three-digit-mul-one-digit": "../../../images/visual/icon-multiply.png",
  "two-digit-mul-eleven": "../../../images/visual/icon-eleven.png",
  "two-digit-mul-fifteen": "../../../images/visual/icon-fifteen.png",
  "two-digit-mul-two-digit": "../../../images/visual/icon-grid.png",
  "three-digit-div-one-digit": "../../../images/visual/icon-divide-a.png",
  "three-digit-div-two-digit": "../../../images/visual/icon-divide-b.png",
  "three-digit-div-four-digit": "../../../images/visual/icon-divide-a.png",
  "five-digit-div-two-digit": "../../../images/visual/icon-divide-b.png",
  "mul-estimate": "../../../images/visual/icon-wave.png",
};

const dataAnalysisIcons = {
  "growth-pre": "../../../images/visual/icon-target.png",
  "growth-inc": "../../../images/visual/icon-plus.png",
  "percent-calc": "../../../images/visual/icon-wave.png",
  "inc-compare": "../../../images/visual/icon-grid.png",
  "base-compare": "../../../images/visual/icon-divide-a.png",
  "fraction-small": "../../../images/visual/icon-divide-b.png",
  "fraction-large": "../../../images/visual/icon-divide-a.png",
  "base-ratio": "../../../images/visual/icon-minus-box.png",
  "fraction-compare": "../../../images/visual/icon-grid.png",
  "annual-average": "../../../images/visual/icon-wave.png",
  "assumption-tree": "../../../images/visual/icon-wave.png",
  "estimation-split": "../../../images/visual/icon-target.png",
};

const cognitionIcons = {
  schulte: "../../../images/visual/icon-cognition-schulte.png",
  "rolling-schulte": "../../../images/visual/icon-cognition-schulte.png",
  "flash-memory": "../../../images/visual/icon-cognition-memory.png",
  "flash-calc": "../../../images/visual/icon-cognition-calc.png",
};

const heroImages = {
  calculation: "../../../images/visual/hero-calculation-illustration.jpg",
  "data-analysis": "../../../images/visual/hero-data-analysis-right.jpg",
  cognition: "../../../images/visual/hero-cognition-right.jpg",
};

function getItemIcon(sectionId, itemId) {
  if (sectionId === "calculation") {
    return calculationIcons[itemId] || "../../../images/visual/icon-grid.png";
  }
  if (sectionId === "data-analysis") {
    return dataAnalysisIcons[itemId] || "../../../images/visual/icon-grid.png";
  }
  if (sectionId === "cognition") {
    return cognitionIcons[itemId] || "../../../images/visual/section-cognition-card.jpg";
  }
  return "../../../images/visual/icon-grid.png";
}

function splitTitle(title) {
  const matched = String(title || "").match(/^(.*?)(（.*）)$/);
  if (!matched) {
    return {
      titleMain: title,
      titleNote: "",
    };
  }
  return {
    titleMain: matched[1],
    titleNote: matched[2],
  };
}

function getCalculationTitleLines(title) {
  const normalized = String(title || "");
  const splitRules = [
    "两位数",
    "三位数",
    "五位数",
    "凑整百",
    "多数",
    "混合",
  ];

  const prefix = splitRules.find((rule) => normalized.startsWith(rule));
  if (!prefix || normalized.length === prefix.length) {
    return [normalized];
  }

  const firstLine = prefix;
  const secondLine = normalized.slice(prefix.length).trim();
  if (!secondLine) {
    return [normalized];
  }

  return [firstLine, secondLine];
}

function getDataAnalysisTitleLines(title) {
  const normalized = String(title || "");
  const keepSingleLine = [
    "年平均量",
  ];

  if (keepSingleLine.includes(normalized) || normalized.startsWith("分数计算")) {
    return [normalized];
  }

  const splitRules = [
    "估算",
    "百分化",
    "增量",
    "基期",
    "分数",
    "年平均",
  ];

  const prefix = splitRules.find((rule) => normalized.startsWith(rule));
  if (!prefix || normalized.length === prefix.length) {
    return [normalized];
  }

  const secondLine = normalized.slice(prefix.length).trim();
  if (!secondLine) {
    return [normalized];
  }

  return [prefix, secondLine];
}

function decorateItem(trainItem, selectedId) {
  const titleParts = splitTitle(trainItem.title);
  let titleLines = [titleParts.titleMain];
  if (trainItem.sectionId === "calculation") {
    titleLines = getCalculationTitleLines(titleParts.titleMain);
  } else if (trainItem.sectionId === "data-analysis") {
    titleLines = getDataAnalysisTitleLines(titleParts.titleMain);
  }

  return {
    ...trainItem,
    icon: getItemIcon(trainItem.sectionId, trainItem.id),
    selected: trainItem.id === selectedId,
    ...titleParts,
    titleLines,
  };
}

function decorateGroups(section, selectedId) {
  return (section.groups || []).map((group) => ({
    ...group,
    gridClass: (group.items || []).length <= 2 ? "catalog-grid-wide" : "",
    items: (group.items || []).map((trainItem) => decorateItem({
      ...trainItem,
      sectionId: section.id,
    }, selectedId)),
  }));
}

Page({
  data: {
    section: null,
    item: null,
    itemId: "",
    config: {},
    configSections: {},
    visualGroups: [],
    heroImage: "",
  },

  onLoad(options) {
    const section = getSectionById(options.sectionId);
    if (!section) {
      wx.showToast({
        title: "分类不存在",
        icon: "none",
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: section.title,
    });

    const firstItem = section.groups?.[0]?.items?.[0] || null;
    const initialItem = options.itemId ? getTrainingItem(section.id, options.itemId) : null;
    if (!firstItem && !initialItem) {
      this.setData({ section });
      return;
    }

    this.applyTrainingState(section.id, initialItem?.id || firstItem.id, section);
  },

  handleItemTap(event) {
    const { itemId } = event.currentTarget.dataset;
    this.applyTrainingState(this.data.section.id, itemId, this.data.section);
  },

  startTraining() {
    if (this.data.item?.available === false) {
      wx.showToast({
        title: "该训练项后续开放",
        icon: "none",
      });
      return;
    }

    if (this.data.section.flow === "cognition") {
      wx.navigateTo({
        url: `/pages/cognition/guide/index?itemId=${this.data.itemId}`,
      });
      return;
    }

    // 假设分配法 -> 独立页面
    if (this.data.itemId === "assumption-tree") {
      wx.navigateTo({
        url: `/pages/training/assumption/index?count=${this.data.config.questionCount}`,
      });
      return;
    }

    // 拆分估算 -> 独立页面
    if (this.data.itemId === "estimation-split") {
      wx.navigateTo({
        url: `/pages/training/estimation/index?count=${this.data.config.questionCount}`,
      });
      return;
    }

    // 比例感训练 -> 独立页面
    if (this.data.itemId === "ratio-sense") {
      wx.navigateTo({
        url: `/pages/training/ratio-sense/index?count=${this.data.config.questionCount}`,
      });
      return;
    }

    const payload = encodeURIComponent(JSON.stringify(this.data.config));
    wx.navigateTo({
      url: `/pages/training/session/index?sectionId=${this.data.section.id}&itemId=${this.data.itemId}&config=${payload}`,
    });
  },

  handleQuestionCountChange(event) {
    const { value } = event.currentTarget.dataset;
    const configSections = getConfigSections(this.data.item, {
      ...this.data.config,
      questionCountMode: value,
    });

    this.setData({
      config: configSections.normalizedConfig,
      configSections,
    });
  },

  handleBack() {
    wx.navigateBack();
  },

  applyTrainingState(sectionId, itemId, section) {
    const item = getTrainingItem(sectionId, itemId);
    if (!item) return;
    const isCognition = section.flow === "cognition";
    const prevMode = this.data.config.questionCountMode;
    const config = isCognition ? {} : buildTrainingConfig(item);
    if (prevMode && !isCognition) {
      config.questionCountMode = prevMode;
      config.questionCount = QUESTION_COUNT_PRESETS[prevMode] || QUESTION_COUNT_PRESETS.quick;
    }
    const configSections = isCognition ? {} : getConfigSections(item, config);

    this.setData({
      section,
      item,
      itemId,
      config: isCognition ? {} : configSections.normalizedConfig,
      configSections,
      visualGroups: decorateGroups(section, itemId),
      heroImage: heroImages[section.id] || "",
    });
  },

  onShareAppMessage() {
    const title = this.data.section ? `${this.data.section.title}训练` : '行测速练';
    return { title };
  },
  onShareTimeline() {
    const title = this.data.section ? `${this.data.section.title}训练` : '行测速练';
    return { title };
  },
});
