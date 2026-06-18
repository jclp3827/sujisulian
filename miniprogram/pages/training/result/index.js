const { formatDuration } = require("../../../utils/format");
const { readSession, cleanupExpiredSessions } = require("../../../utils/session-store");
const { getRecentRecords } = require("../../../utils/recent-records");

function toDateKey(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

Page({
  data: {
    item: null,
    records: [],
    summary: null,
    elapsedText: "0:0:00",
    showModal: true,
    levelText: "",
    correctRate: "0%",
    todaySummary: null,
    isAssumption: false,
    isEstimation: false,
    isRatioSense: false,
  },

  onLoad(options) {
    cleanupExpiredSessions();
    const payload = options.sessionKey ? readSession(options.sessionKey) : null;
    if (!payload) {
      wx.showToast({
        title: "结果参数缺失",
        icon: "none",
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: "答题反馈",
    });

    this.setData({
      item: payload.item,
      records: payload.records || [],
      summary: payload.summary,
      elapsedText: formatDuration(payload.summary?.elapsedMs || 0),
      levelText: this.getLevelText(payload.item, payload.summary),
      correctRate: this.getCorrectRate(payload.summary),
      todaySummary: this.getTodaySummary(),
      isAssumption: payload.mode === "assumption",
      isEstimation: payload.mode === "estimation",
      isRatioSense: payload.mode === "ratio-sense",
    });
  },

  handleRestart() {
    const { item, summary, isAssumption } = this.data;
    if (isAssumption) {
      wx.redirectTo({ url: "/pages/training/assumption/index" });
      return;
    }
    if (item?.id === "estimation-split") {
      wx.redirectTo({ url: "/pages/training/estimation/index" });
      return;
    }
    if (item?.id === "ratio-sense") {
      wx.redirectTo({ url: "/pages/training/ratio-sense/index" });
      return;
    }
    const config = encodeURIComponent(JSON.stringify(summary.config));
    wx.redirectTo({
      url: `/pages/training/session/index?sectionId=${item.sectionId}&itemId=${item.id}&config=${config}`,
    });
  },

  handleBackHome() {
    wx.switchTab({
      url: "/pages/home/index",
    });
  },

  closeModal() {
    this.setData({
      showModal: false,
    });
  },

  getLevelText(item, summary) {
    const thresholds = item?.thresholds;
    if (!thresholds || !summary) {
      return "";
    }

    const elapsedSeconds = Math.floor((summary.elapsedMs || 0) / 1000);
    if (elapsedSeconds <= thresholds.excellent) {
      return "优秀";
    }
    if (elapsedSeconds <= thresholds.good) {
      return "良好";
    }
    if (elapsedSeconds <= thresholds.pass) {
      return "合格";
    }
    return "未达标";
  },

  getCorrectRate(summary) {
    if (!summary) {
      return "0%";
    }
    const total = Number(summary.answeredCount) || 0;
    const correct = Number(summary.correctCount) || 0;
    if (total <= 0) {
      return "0%";
    }
    const rate = Math.min(100, Math.round((correct / total) * 100));
    return `${rate}%`;
  },

  getTodaySummary() {
    const todayKey = toDateKey(Date.now());
    const records = getRecentRecords().filter((record) => {
      if (!record || !record.createdAt) return false;
      return toDateKey(record.createdAt) === todayKey;
    });
    if (!records.length) {
      return {
        sessionCount: 0,
        questionCount: 0,
      };
    }
    return {
      sessionCount: records.length,
      questionCount: records.reduce((sum, record) => sum + (Number(record.questionCount) || 0), 0),
    };
  },

  onShareAppMessage() {
    const title = this.data.item ? `${this.data.item.title}训练结果` : '行测训练结果';
    const correctRate = this.data.correctRate || '';
    return { title: `${title} ${correctRate}`.trim() };
  },
  onShareTimeline() {
    const title = this.data.item ? `${this.data.item.title}训练结果` : '行测训练结果';
    const correctRate = this.data.correctRate || '';
    return { title: `${title} ${correctRate}`.trim() };
  },
});
