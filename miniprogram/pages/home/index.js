const { homeSections, getSectionById } = require("../../models/train-catalog");
const { getRecentRecords } = require("../../utils/recent-records");

const sectionVisuals = {
  calculation: {
    indexText: "01",
    progressTarget: 30,
    progressUnit: "题",
    cardImage: "../../images/visual/section-calculation-card.jpg",
    accentClass: "home-card-accent-blue",
    accentColor: "#2F6BFF",
  },
  "data-analysis": {
    indexText: "02",
    progressTarget: 20,
    progressUnit: "题",
    cardImage: "../../images/visual/section-analysis-card.jpg",
    accentClass: "home-card-accent-green",
    accentColor: "#33C47A",
  },
  cognition: {
    indexText: "03",
    progressTarget: 15,
    progressUnit: "次",
    cardImage: "../../images/visual/section-cognition-card.jpg",
    accentClass: "home-card-accent-purple",
    accentColor: "#7C5CFF",
  },
};

function getTodayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateKey(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayLabel(timestamp) {
  const labels = ["日", "一", "二", "三", "四", "五", "六"];
  return labels[new Date(timestamp).getDay()] || "";
}

function buildRecentDays(records) {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countMap = records.reduce((result, record) => {
    if (!record || !record.createdAt) return result;
    const dateKey = toDateKey(record.createdAt);
    result[dateKey] = (result[dateKey] || 0) + 1;
    return result;
  }, {});

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getTime() - ((6 - index) * oneDayMs));
    const timestamp = date.getTime();
    const dateKey = toDateKey(timestamp);
    const count = Number(countMap[dateKey]) || 0;
    return {
      dateKey,
      label: index === 6 ? "今" : getDayLabel(timestamp),
      count,
      active: count > 0,
      height: Math.min(56, 12 + (count * 10)),
    };
  });
}

function buildStatsBySection(records) {
  const todayKey = getTodayKey();
  return records.reduce((result, record) => {
    const sectionId = record.sectionId;
    if (!sectionId) return result;
    const prev = result[sectionId] || {
      todayCount: 0,
      todayQuestionCount: 0,
      recentCount: 0,
      lastRecord: null,
    };
    const isToday = toDateKey(record.createdAt) === todayKey;
    const questionCount = Number(record.questionCount) || 0;
    const next = {
      ...prev,
      recentCount: prev.recentCount + 1,
      lastRecord: prev.lastRecord || record,
    };
    if (isToday) {
      next.todayCount += 1;
      next.todayQuestionCount += questionCount;
    }
    result[sectionId] = next;
    return result;
  }, {});
}

function getProgressValue(section, stats) {
  if (section.id === "cognition") {
    return Number(stats.todayCount) || 0;
  }
  return Number(stats.todayQuestionCount) || 0;
}

function decorateSections(sections, statsBySection) {
  return sections.map((section) => {
    const visual = sectionVisuals[section.id] || {};
    const stats = statsBySection[section.id] || {};
    const target = Number(visual.progressTarget) || 0;
    const progressValue = Math.min(getProgressValue(section, stats), target);
    return {
      ...section,
      ...visual,
      progressTarget: target,
      progressValue,
      progressPercent: target ? Math.min(100, Math.round((progressValue / target) * 100)) : 0,
      recentCount: Number(stats.recentCount) || 0,
      lastRecordText: stats.lastRecord?.itemTitle ? `最近：${stats.lastRecord.itemTitle}` : "最近：暂无练习",
    };
  });
}

Page({
  data: {
    sections: [],
    recentDays: [],
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: "行测速练",
    });
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) {
      tabBar.setData({ selected: 0 });
    }
    this.refreshSections();
  },

  refreshSections() {
    const records = getRecentRecords();
    const statsBySection = buildStatsBySection(records);
    this.setData({
      sections: decorateSections(homeSections, statsBySection),
      recentDays: buildRecentDays(records),
    });
  },

  handleSectionTap(event) {
    const { sectionId } = event.currentTarget.dataset;
    const section = getSectionById(sectionId);
    if (!section) return;

    if (section.available === false) {
      wx.showToast({
        title: "该模块暂未开放",
        icon: "none",
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/training/catalog/index?sectionId=${sectionId}`,
    });
  },

  onShareAppMessage() {
    return { title: '行测速练 - 每日行测训练' };
  },
  onShareTimeline() {
    return { title: '行测速练 - 每日行测训练' };
  },
});
