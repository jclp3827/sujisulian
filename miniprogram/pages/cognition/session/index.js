const { getCognitionModule, getCognitionLevel } = require("../../../models/cognition-catalog");
const { getCognitionSessionRuntime } = require("../../../services/cognition-session/index");
const { formatDuration } = require("../../../utils/format");
const { getNextWrongBookRecordId, clearWrongBookReviewPlan, removeWrongBookRecord } = require("../../../utils/wrong-book");

function parseWrongBookReview(options = {}) {
  const token = options.wrongBookReviewToken;
  const recordId = options.wrongBookReviewRecordId || options.wrongBookRecordId;
  if (!token || !recordId) return null;
  try {
    return {
      token: decodeURIComponent(token),
      recordId,
      currentRecordId: recordId,
      sectionId: "cognition",
      itemId: options.itemId,
      levelId: options.levelId,
    };
  } catch (error) {
    return {
      token,
      recordId,
      currentRecordId: recordId,
      sectionId: "cognition",
      itemId: options.itemId,
      levelId: options.levelId,
    };
  }
}

Page({
  data: {
    module: null,
    level: null,
    mode: "",
    elapsedText: "0:0:00",
    currentProgressText: "",
    score: 0,
    countdown: 0,
    phase: "idle",
    schulteRows: [],
    schulteTarget: 1,
    rollingRows: [],
    rollingTarget: 1,
    flashRows: [],
    flashTarget: 1,
    flashLives: 0,
    flashCompleted: 0,
    flashTotal: 0,
    flashCalcValues: [],
    flashCalcStep: 0,
    flashCalcTotal: 10,
    flashCalcStage: "preview",
    flashCalcAnswerText: "",
    flashCalcHintText: "",
    flashCalcResultCorrect: false,
    flashCalcResultText: "",
    flashCalcTransition: "",
    flashCalcPressed: false,
    schulteActiveKey: "",
    rollingActiveKey: "",
    flashActiveKey: "",
    flashWrongKey: "",
    showResult: false,
    resultTitle: "",
    resultSummary: "",
    todayBestText: "--",
    bestText: "--",
    mistakeText: "",
  },

  onLoad(options) {
    const module = getCognitionModule(options.itemId);
    const level = getCognitionLevel(options.itemId, options.levelId) || module?.levels?.[0] || null;
    if (!module || !level) {
      wx.showToast({
        title: "参数不完整",
        icon: "none",
      });
      return;
    }

    const runtime = getCognitionSessionRuntime(module.type);
    if (!runtime?.init) {
      wx.showToast({
        title: "训练暂不可用",
        icon: "none",
      });
      return;
    }

    this.runtime = runtime;
    this.wrongBookReview = parseWrongBookReview(options);

    wx.setNavigationBarTitle({
      title: module.title,
    });

    this.setData({
      module,
      level,
      mode: module.type,
    });

    this.runtime.init(this, level);
  },

  onUnload() {
    this.clearTimers();
  },

  clearTimers() {
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    if (this.mistakeTimer) {
      clearTimeout(this.mistakeTimer);
      this.mistakeTimer = null;
    }
    ["schulteActiveKeyTimer", "rollingActiveKeyTimer", "flashActiveKeyTimer", "flashWrongKeyTimer"].forEach((timerField) => {
      if (this[timerField]) {
        clearTimeout(this[timerField]);
        this[timerField] = null;
      }
    });
    ["flashCalcTransitionTimer", "flashCalcPressTimer"].forEach((timerField) => {
      if (this[timerField]) {
        clearTimeout(this[timerField]);
        this[timerField] = null;
      }
    });
  },

  startElapsedTick() {
    this.startAt = Date.now();
    this.setData({ elapsedText: "0:0:00" });
    this.tickTimer = setInterval(() => {
      this.setData({
        elapsedText: formatDuration(Date.now() - this.startAt),
      });
    }, 100);
  },

  startCountdown(onDone) {
    this.countdownTimer = setInterval(() => {
      const next = this.data.countdown - 1;
      if (next <= 0) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        this.setData({ countdown: 0 });
        onDone();
        return;
      }
      this.setData({ countdown: next });
    }, 1000);
  },

  markCellFeedback(field, value, duration = 180) {
    if (!field) return;
    const timerField = `${field}Timer`;
    if (this[timerField]) {
      clearTimeout(this[timerField]);
    }
    this.setData({ [field]: value });
    this[timerField] = setTimeout(() => {
      this.setData({ [field]: "" });
      this[timerField] = null;
    }, duration);
  },

  handleSchulteTap(event) {
    this.runtime?.onTap?.(this, event);
  },

  handleRollingTap(event) {
    this.runtime?.onTap?.(this, event);
  },

  handleFlashTap(event) {
    this.runtime?.onTap?.(this, event);
  },

  handleFlashCalcAdvance() {
    this.runtime?.onAdvance?.(this);
  },

  handleFlashCalcKeyTap(event) {
    this.runtime?.onKeyTap?.(this, event);
  },

  submitFlashCalcAnswer() {
    this.runtime?.onSubmitAnswer?.(this);
  },

  handleRestart() {
    this.clearTimers();
    this.setData({
      showResult: false,
      resultTitle: "",
      resultSummary: "",
    });
    this.runtime?.restart?.(this, this.data.level);
  },

  handleCloseResult() {
    this.setData({ showResult: false });
    if (!this.wrongBookReview) {
      wx.navigateBack();
      return;
    }

    const review = this.wrongBookReview;
    const isCorrect = this.isWrongBookCurrentCorrect();
    if (!isCorrect) {
      wx.navigateBack();
      return;
    }

    if (review.currentRecordId) {
      removeWrongBookRecord(review.currentRecordId);
    }

    const nextRecordId = getNextWrongBookRecordId(review.token, review.currentRecordId) || "";
    if (!nextRecordId) {
      clearWrongBookReviewPlan(review.token);
      wx.navigateBack();
      return;
    }

    const nextUrl = `/pages/cognition/guide/index?itemId=${this.data.module.id}&levelId=${this.data.level.id}&wrongBookReviewToken=${encodeURIComponent(review.token)}&wrongBookRecordId=${encodeURIComponent(nextRecordId)}`;
    wx.showModal({
      title: "错题复习",
      content: "已完成当前错题，是否进入下一个错题？",
      confirmText: "下一题",
      cancelText: "返回",
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({ url: nextUrl });
          return;
        }
        wx.navigateBack();
      },
    });
    return;
  },

  isWrongBookCurrentCorrect() {
    if (!this.wrongBookReview) return false;
    if (this.data.phase !== "finished") return false;
    if (this.data.mode === "schulte") return true;
    if (this.data.mode === "rolling-schulte") return true;
    if (this.data.mode === "flash-memory") {
      return !this.data.showResult && Number(this.data.flashCompleted) >= Number(this.data.flashTotal);
    }
    if (this.data.mode === "flash-calc") return this.data.flashCalcResultCorrect === true;
    return false;
  },

  onShareAppMessage() {
    const title = this.data.module ? `${this.data.module.title}训练` : '认知训练';
    return { title };
  },
  onShareTimeline() {
    const title = this.data.module ? `${this.data.module.title}训练` : '认知训练';
    return { title };
  },
});
