const { formatDuration } = require("../../../utils/format");
const { readSession, cleanupExpiredSessions } = require("../../../utils/session-store");
const {
  getNextWrongBookRecordId,
  clearWrongBookReviewPlan,
  getWrongBookRecords,
} = require("../../../utils/wrong-book");
const { getRecentRecords } = require("../../../utils/recent-records");

function toDateKey(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeWrongBookReview(payload = {}) {
  if (!payload || !payload.token) return null;
  const token = payload.token;
  const recordId = payload.currentRecordId || payload.recordId;
  if (!recordId) return null;

  return {
    token,
    recordId,
    currentRecordId: recordId,
    sectionId: payload.sectionId || "",
    itemId: payload.itemId || "",
  };
}

function stringifyWrongBookQuestion(question) {
  if (!question || typeof question !== "object") return "";
  try {
    return `&wrongBookQuestion=${encodeURIComponent(JSON.stringify(question))}`;
  } catch (error) {
    return "";
  }
}

function getWrongBookRecordById(recordId) {
  if (!recordId) return null;
  const records = getWrongBookRecords();
  for (const record of records) {
    if (record?.id === recordId) {
      return record;
    }
  }
  return null;
}

function getWrongBookQuestionQueryByRecordId(recordId) {
  const record = getWrongBookRecordById(recordId);
  if (!record?.rawQuestion) return "";
  return stringifyWrongBookQuestion(record.rawQuestion);
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
    mode: "",
    wrongBookReview: null,
    nextWrongRecordId: "",
    canAdvanceWrongBook: false,
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

    const wrongBookReview = normalizeWrongBookReview(payload.wrongBookReview);
    const summary = payload.summary || {};
    const mode = payload.mode || "";
    let nextWrongRecordId = "";

    const canOfferNextWrongBook = wrongBookReview
      && Number(summary.answeredCount) === 1
      && Number(summary.correctCount) === 1;

    if (canOfferNextWrongBook) {
      nextWrongRecordId = getNextWrongBookRecordId(wrongBookReview.token, wrongBookReview.currentRecordId) || "";
      if (!nextWrongRecordId) {
        clearWrongBookReviewPlan(wrongBookReview.token);
      }
    }

    this.setData({
      item: payload.item,
      records: payload.records || [],
      summary,
      elapsedText: formatDuration(payload.summary?.elapsedMs || 0),
      levelText: this.getLevelText(payload.item, payload.summary),
      correctRate: this.getCorrectRate(payload.summary),
      todaySummary: this.getTodaySummary(),
      isAssumption: payload.mode === "assumption",
      isEstimation: mode === "estimation",
      isRatioSense: mode === "ratio-sense",
      mode,
      wrongBookReview,
      nextWrongRecordId,
      canAdvanceWrongBook: canOfferNextWrongBook,
    });
  },

  getWrongBookTrainingUrl(nextRecordId = "") {
    const { item, mode, summary, wrongBookReview } = this.data;
    if (!wrongBookReview || !nextRecordId) return "";
    const questionQuery = getWrongBookQuestionQueryByRecordId(nextRecordId);

    const reviewQuery = `wrongBookReviewToken=${encodeURIComponent(wrongBookReview.token)}&wrongBookRecordId=${encodeURIComponent(nextRecordId)}`;
    if (mode === "assumption") {
      return `/pages/training/assumption/index?count=1&${reviewQuery}${questionQuery}`;
    }
    if (mode === "estimation") {
      return `/pages/training/estimation/index?count=1&${reviewQuery}${questionQuery}`;
    }
    if (mode === "ratio-sense") {
      return `/pages/training/ratio-sense/index?count=1&${reviewQuery}${questionQuery}`;
    }
    if (!item?.sectionId || !item?.id || !summary?.config) {
      return "";
    }
    const questionCount = Math.max(1, Number(summary?.config?.questionCount) || 1);
    const config = encodeURIComponent(JSON.stringify({
      ...summary.config,
      questionCount,
    }));
    return `/pages/training/session/index?sectionId=${item.sectionId}&itemId=${item.id}&config=${config}&${reviewQuery}${questionQuery}`;
  },

  getCurrentWrongBookQuestionQuery() {
    return stringifyWrongBookQuestion(this.data.records?.[0]?.rawQuestion);
  },

  handleNextWrongBook() {
    const { nextWrongRecordId } = this.data;
    const nextUrl = this.getWrongBookTrainingUrl(nextWrongRecordId);
    if (!nextUrl) {
      return;
    }
    wx.redirectTo({ url: nextUrl });
  },

  handleRestart() {
    const {
      mode,
      item,
      summary,
      wrongBookReview,
    } = this.data;
    if (mode === "assumption") {
      const count = wrongBookReview ? 1 : (Number(summary?.config?.questionCount) || 10);
      const countQuery = `count=${count}`;
      const reviewQuery = wrongBookReview ? `&wrongBookReviewToken=${encodeURIComponent(wrongBookReview.token)}&wrongBookRecordId=${encodeURIComponent(wrongBookReview.currentRecordId || wrongBookReview.recordId)}` : "";
      const questionQuery = wrongBookReview ? this.getCurrentWrongBookQuestionQuery() : "";
      wx.redirectTo({ url: `/pages/training/assumption/index?${countQuery}${reviewQuery}${questionQuery}` });
      return;
    }
    if (mode === "estimation") {
      const count = wrongBookReview ? 1 : (Number(summary?.config?.questionCount) || 10);
      const reviewQuery = wrongBookReview ? `&wrongBookReviewToken=${encodeURIComponent(wrongBookReview.token)}&wrongBookRecordId=${encodeURIComponent(wrongBookReview.currentRecordId || wrongBookReview.recordId)}` : "";
      const questionQuery = wrongBookReview ? this.getCurrentWrongBookQuestionQuery() : "";
      wx.redirectTo({ url: `/pages/training/estimation/index?count=${count}${reviewQuery}${questionQuery}` });
      return;
    }
    if (mode === "ratio-sense") {
      const count = wrongBookReview ? 1 : (Number(summary?.config?.questionCount) || 10);
      const reviewQuery = wrongBookReview ? `&wrongBookReviewToken=${encodeURIComponent(wrongBookReview.token)}&wrongBookRecordId=${encodeURIComponent(wrongBookReview.currentRecordId || wrongBookReview.recordId)}` : "";
      const questionQuery = wrongBookReview ? this.getCurrentWrongBookQuestionQuery() : "";
      wx.redirectTo({ url: `/pages/training/ratio-sense/index?count=${count}${reviewQuery}${questionQuery}` });
      return;
    }
    if (wrongBookReview && summary?.config && item) {
      const questionQuery = this.getCurrentWrongBookQuestionQuery();
      const config = encodeURIComponent(JSON.stringify({
        ...summary.config,
        questionCount: 1,
      }));
      const reviewQuery = `&wrongBookReviewToken=${encodeURIComponent(wrongBookReview.token)}&wrongBookRecordId=${encodeURIComponent(wrongBookReview.currentRecordId || wrongBookReview.recordId)}`;
      wx.redirectTo({
        url: `/pages/training/session/index?sectionId=${item.sectionId}&itemId=${item.id}&config=${config}${reviewQuery}${questionQuery}`,
      });
      return;
    }
    if (!item) {
      wx.showToast({
        title: "参数不完整",
        icon: "none",
      });
      return;
    }
    if (mode) {
      wx.showToast({
        title: "无法重开该题型",
        icon: "none",
      });
      return;
    }
    if (!summary?.config) {
      wx.showToast({
        title: "参数不完整",
        icon: "none",
      });
      return;
    }
    const config = encodeURIComponent(JSON.stringify(summary.config));
    wx.redirectTo({
      url: `/pages/training/session/index?sectionId=${item.sectionId}&itemId=${item.id}&config=${config}`,
    });
  },

  handleBackHome() {
    const { wrongBookReview, nextWrongRecordId } = this.data;
    const { canAdvanceWrongBook } = this.data;
    if (wrongBookReview && canAdvanceWrongBook && !nextWrongRecordId) {
      clearWrongBookReviewPlan(wrongBookReview.token);
    }
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
