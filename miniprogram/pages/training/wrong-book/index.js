const {
  getWrongBookRecords,
  clearWrongBook,
  startWrongBookReview,
} = require("../../../utils/wrong-book");
const { buildTrainingConfig } = require("../../../models/train-config");
const { getTrainingItem } = require("../../../models/train-catalog");

function formatCount(count) {
  const value = Number(count) || 0;
  if (value <= 0) return "0";
  if (value > 99) return "99+";
  return `${value}`;
}

function formatText(value) {
  if (value === undefined || value === null || value === "") return "-";
  return `${value}`;
}

function buildDisplayRecord(record = {}) {
  const promptFormula = record?.promptFormula || record?.rawQuestion?.promptFormula;
  const promptText = record?.prompt || record?.rawQuestion?.prompt;
  return {
    ...record,
    promptFormula: normalizeFormulaNodes(promptFormula),
    userAnswerText: formatText(record?.userAnswer),
    promptText: formatText(promptText),
  };
}

function normalizeFormulaNodes(nodes) {
  if (Array.isArray(nodes)) return nodes;
  if (!nodes) return null;
  if (Array.isArray(nodes.nodes)) return nodes.nodes;
  return null;
}

function buildTabs(records) {
  const sectionMap = {
    calculation: {
      key: "calculation",
      title: "基础计算",
      items: [],
    },
    "data-analysis": {
      key: "data-analysis",
      title: "资料分析",
      items: [],
    },
  };

  records.forEach((record) => {
    const sectionId = record?.sectionId;
    if (sectionMap[sectionId]) {
      sectionMap[sectionId].items.push(record);
    }
  });

  return [
    sectionMap.calculation,
    sectionMap["data-analysis"],
  ].map((tab) => ({
    ...tab,
    count: tab.items.length,
    countText: formatCount(tab.items.length),
  }));
}

function getActiveItemsFrom(tabs, activeTab) {
  const current = (tabs || []).find((tab) => tab.key === activeTab);
  return current?.items || [];
}

function stringifyWrongBookQuestion(question) {
  if (!question || typeof question !== "object") return "";
  try {
    return `&wrongBookQuestion=${encodeURIComponent(JSON.stringify(question))}`;
  } catch (error) {
    return "";
  }
}

function getTrainingUrl(sectionId, itemId, reviewToken, currentRecordId, wrongBookQuestion = null) {
  if (!sectionId || !itemId) return null;
  const reviewQuery = reviewToken && currentRecordId
    ? `&wrongBookReviewToken=${encodeURIComponent(reviewToken)}&wrongBookRecordId=${encodeURIComponent(currentRecordId)}`
    : "";
  const questionQuery = stringifyWrongBookQuestion(wrongBookQuestion);

  if (itemId === "assumption-tree") {
    return `/pages/training/assumption/index?count=1${reviewQuery}${questionQuery}`;
  }
  if (itemId === "estimation-split") {
    return `/pages/training/estimation/index?count=1${reviewQuery}${questionQuery}`;
  }
  if (itemId === "ratio-sense") {
    return `/pages/training/ratio-sense/index?count=1${reviewQuery}${questionQuery}`;
  }
  if (sectionId === "cognition") {
    return `/pages/cognition/guide/index?itemId=${itemId}${reviewQuery}`;
  }

  const config = buildTrainingConfig({ id: itemId });
  const payload = encodeURIComponent(JSON.stringify({
    ...config,
    questionCount: 1,
  }));
  return `/pages/training/session/index?sectionId=${sectionId}&itemId=${itemId}&config=${payload}${reviewQuery}${questionQuery}`;
}

Page({
  data: {
    tabs: [],
    activeTab: "calculation",
    totalCount: 0,
    activeItems: [],
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    const records = getWrongBookRecords().map((record) => buildDisplayRecord(record));

    const tabs = buildTabs(records);
    const activeTab = tabs.find((tab) => tab.count > 0)?.key || "calculation";
    const totalCount = records.length;
    const activeItems = getActiveItemsFrom(tabs, activeTab);

    this.setData({
      tabs,
      activeTab,
      totalCount,
      activeItems,
    });
  },

  handleTabChange(event) {
    const { tab } = event.currentTarget.dataset;
    if (!tab) return;
    this.setData({
      activeTab: tab,
      activeItems: getActiveItemsFrom(this.data.tabs, tab),
    });
  },

  handleItemTap(event) {
    const { sectionId, itemId, index } = event.currentTarget.dataset;
    const trainItem = getTrainingItem(sectionId, itemId);
    if (!sectionId || !itemId || !trainItem) {
      wx.showToast({
        title: "训练项不存在",
        icon: "none",
      });
      return;
    }
    const activeIndex = Number(index);
    const currentRecord = this.data.activeItems[activeIndex];
    if (!currentRecord?.id) {
      wx.showToast({
        title: "当前错题不存在",
        icon: "none",
      });
      return;
    }

    const reviewToken = startWrongBookReview(
      this.data.activeItems.map((item) => item.id),
      currentRecord.id,
    );
    const url = getTrainingUrl(
      sectionId,
      itemId,
      reviewToken,
      currentRecord.id,
      currentRecord.rawQuestion,
    );
    if (!url) {
      wx.showToast({
        title: "暂不支持该训练类型",
        icon: "none",
      });
      return;
    }
    wx.navigateTo({
      url,
    });
  },

  handleClearAll() {
    if (!this.data.totalCount) {
      return;
    }
    wx.showModal({
      title: "清空错题本",
      content: "是否清空全部错题？清空后无法恢复。",
      success: (res) => {
        if (!res.confirm) return;
        clearWrongBook();
        this.setData({
          tabs: [],
          activeItems: [],
          totalCount: 0,
          activeTab: "calculation",
        });
        wx.showToast({
          title: "已清空",
          icon: "success",
        });
      },
    });
  },
});
