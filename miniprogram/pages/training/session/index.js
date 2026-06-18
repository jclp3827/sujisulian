const { getTrainingItem } = require("../../../models/train-catalog");
const { generateQuestionSet } = require("../../../services/train-generator/index");
const { saveSession } = require("../../../utils/session-store");
const { addRecentRecord } = require("../../../utils/recent-records");
const { formatDuration, formatSeconds } = require("../../../utils/format");
const { validateAnswer } = require("../../../utils/answer-validator");

Page({
  data: {
    item: null,
    config: null,
    questionSet: [],
    currentIndex: 0,
    currentQuestion: null,
    answerText: "",
    answeredCount: 0,
    correctCount: 0,
    unsupported: false,
    elapsedText: "0:0:00",
    progressPercent: 0,
    feedbackText: "",
    feedbackType: "",
    handwritingVisible: false,
    handwritingTool: "pen",
  },

  onLoad(options) {
    const item = getTrainingItem(options.sectionId, options.itemId);
    const config = this.parseTrainingConfig(options.config);

    if (!item || !config) {
      wx.showToast({
        title: "参数不完整",
        icon: "none",
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: item.title,
    });

    const questionSet = generateQuestionSet(options.sectionId, options.itemId, config.questionCount);

    this.setData({
      item,
      config,
      questionSet,
      currentQuestion: questionSet[0] || null,
      unsupported: questionSet.length === 0,
    });

    if (questionSet.length) {
      this.startSession();
    }
  },

  parseTrainingConfig(rawConfig) {
    if (!rawConfig) return null;
    try {
      return JSON.parse(decodeURIComponent(rawConfig));
    } catch (error) {
      return null;
    }
  },

  refreshCanvasRect() {
    const query = wx.createSelectorQuery().in(this);
    query.select('.handwriting-canvas').boundingClientRect((rect) => {
      this.canvasRect = rect;
    }).exec();
  },

  onReady() {
    this.handwritingPoints = [];
    this.currentStroke = null;
    this.eraseLastPoint = null;
    this.strokeDrawnEnd = 0;
    this.canvasRect = null;
    this.handwritingCtx = wx.createCanvasContext("sessionHandwritingCanvas", this);
    this.handwritingCtx.setLineCap("round");
    this.handwritingCtx.setLineJoin("round");
    this.configureHandwritingPen();

    this.refreshCanvasRect();

    this.redrawHandwriting();
  },

  onUnload() {
    this.clearTimer();
  },

  startSession() {
    const now = Date.now();
    this.sessionStartAt = now;
    this.questionStartAt = now;
    this.records = [];
    this.tickTimer();
    this.timer = setInterval(() => {
      this.tickTimer();
    }, 1000);
  },

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  tickTimer() {
    const elapsedMs = Date.now() - this.sessionStartAt;
    this.setData({
      elapsedText: formatDuration(elapsedMs),
    });
  },

  handleKeyTap(event) {
    const { key } = event.currentTarget.dataset;
    const { answerText } = this.data;

    if (key === "clear") {
      this.setData({ answerText: "" });
      return;
    }

    if (key === "delete") {
      this.setData({ answerText: answerText.slice(0, -1) });
      return;
    }

    if (key === "." && answerText.includes(".")) {
      return;
    }

    if (key === "-") {
      if (answerText.includes("-") || answerText.length > 0) {
        return;
      }
    }

    this.setData({
      answerText: `${answerText}${key}`,
      feedbackText: "",
      feedbackType: "",
    });
  },

  handleCompareChoice(event) {
    const { value } = event.currentTarget.dataset;
    this.setData({
      answerText: value,
      feedbackText: "",
      feedbackType: "",
    });
  },

  toggleHandwriting() {
    const newVisible = !this.data.handwritingVisible;
    this.setData({
      handwritingVisible: newVisible,
      handwritingTool: "pen",
    });

    if (newVisible) {
      this.refreshCanvasRect();
    }
  },

  toggleHandwritingTool(event) {
    const { tool } = event.currentTarget.dataset;
    this.setData({
      handwritingTool: this.data.handwritingTool === tool ? "pen" : tool,
    });
    this.handwritingWriting = false;
    this.currentStroke = null;
    this.eraseLastPoint = null;
  },

  startHandwriting(event) {
    if (!this.handwritingPoints) {
      this.handwritingPoints = [];
    }
    const touch = event.touches[0];
    const point = this.getCanvasPoint(touch);

    if (!point) return;

    // 记录当前是否是橡皮擦模式
    this.isErasing = this.data.handwritingTool === "erase";

    if (this.isErasing) {
      this.eraseLastPoint = point;
      this.eraseHandwriting(point);
      return;
    }

    this.handwritingWriting = true;
    this.currentStroke = [{ x: point.x, y: point.y }];
    this.strokeDrawnEnd = 0;
    this.handwritingPoints.push(this.currentStroke);
    this.drawStrokeDot(point);
  },

  getCanvasPoint(touch) {
    if (!this.canvasRect) {
      // 如果还没有获取到canvas位置，直接使用touch坐标（可能不准确，但比崩溃好）
      return { x: touch.x, y: touch.y };
    }
    return {
      x: touch.clientX - this.canvasRect.left,
      y: touch.clientY - this.canvasRect.top
    };
  },

  moveHandwriting(event) {
    const touch = event.touches[0];
    const point = this.getCanvasPoint(touch);

    if (!point) return;

    // 橡皮擦模式 - 独立处理，不受其他标志影响
    if (this.isErasing) {
      this.eraseHandwriting(point, this.eraseLastPoint);
      this.eraseLastPoint = point;
      return;
    }

    // 画笔模式
    if (!this.handwritingWriting || !this.currentStroke) {
      return;
    }

    const lastPoint = this.currentStroke[this.currentStroke.length - 1];
    const dx = point.x - lastPoint.x;
    const dy = point.y - lastPoint.y;
    const distance = Math.sqrt((dx * dx) + (dy * dy));

    // 使用更小的插值步长让线条更连续
    const steps = Math.max(1, Math.ceil(distance / 1.5));

    for (let i = 1; i <= steps; i += 1) {
      this.currentStroke.push({
        x: lastPoint.x + ((dx * i) / steps),
        y: lastPoint.y + ((dy * i) / steps),
      });
    }

    // 绘制新增的线段，从上次绘制的位置开始
    const newPointsStart = Math.max(0, this.strokeDrawnEnd - 1);
    if (this.currentStroke.length > newPointsStart + 1) {
      this.drawStrokeSegment(this.currentStroke, newPointsStart);
      this.strokeDrawnEnd = this.currentStroke.length - 1;
    }
  },

  endHandwriting() {
    this.handwritingWriting = false;
    this.isErasing = false;
    this.currentStroke = null;
    this.eraseLastPoint = null;
  },

  clearHandwriting() {
    this.handwritingPoints = [];
    this.currentStroke = null;
    this.eraseLastPoint = null;
    this.redrawHandwriting();
  },

  configureHandwritingPen() {
    if (!this.handwritingCtx) return;
    this.handwritingCtx.setStrokeStyle("#111827");
    this.handwritingCtx.setLineWidth(2);
  },

  configureHandwritingEraser() {
    if (!this.handwritingCtx) return;
    this.handwritingCtx.setFillStyle("rgba(0, 0, 0, 1)");
  },

  drawStrokeDot(point) {
    if (!this.handwritingCtx || !point) return;
    this.configureHandwritingPen();
    this.handwritingCtx.beginPath();
    this.handwritingCtx.moveTo(point.x, point.y);
    this.handwritingCtx.lineTo(point.x + 0.1, point.y + 0.1);
    this.handwritingCtx.stroke();
    this.handwritingCtx.draw(true);
  },

  drawStrokeSegment(stroke, startIndex = 0) {
    if (!this.handwritingCtx || !stroke || stroke.length < 2) return;
    this.configureHandwritingPen();
    const fromIndex = Math.max(0, Math.min(startIndex, stroke.length - 2));
    const segment = stroke.slice(fromIndex);

    if (segment.length < 2) return;

    this.handwritingCtx.beginPath();
    this.handwritingCtx.moveTo(segment[0].x, segment[0].y);

    if (segment.length === 2) {
      this.handwritingCtx.lineTo(segment[1].x, segment[1].y);
    } else {
      // 优化：使用完整的二次贝塞尔曲线，确保连续性
      for (let i = 1; i < segment.length - 1; i += 1) {
        const current = segment[i];
        const next = segment[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        this.handwritingCtx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      const penultimate = segment[segment.length - 2];
      const last = segment[segment.length - 1];
      this.handwritingCtx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);
    }

    this.handwritingCtx.stroke();
    this.handwritingCtx.draw(true);
  },

  eraseHandwriting(point, previousPoint = null) {
    if (!this.handwritingCtx || !point) return;

    const size = 30;

    // 如果有上一个点，在两点之间连续擦除
    if (previousPoint) {
      const dx = point.x - previousPoint.x;
      const dy = point.y - previousPoint.y;
      const distance = Math.sqrt((dx * dx) + (dy * dy));
      // 使用更小的步距确保连续擦除
      const steps = Math.max(1, Math.ceil(distance / (size / 3)));

      for (let i = 0; i <= steps; i += 1) {
        const x = previousPoint.x + ((dx * i) / steps);
        const y = previousPoint.y + ((dy * i) / steps);
        this.handwritingCtx.clearRect(x - (size / 2), y - (size / 2), size, size);
      }
    } else {
      // 单点擦除
      this.handwritingCtx.clearRect(point.x - (size / 2), point.y - (size / 2), size, size);
    }

    this.handwritingCtx.draw(true);

    // 同时更新数据，清除被擦除的点
    this.trimHandwritingPoints(point, previousPoint, size / 2);
  },

  trimHandwritingPoints(point, previousPoint = null, radius = 15) {
    if (!point) return;

    // 创建一个函数来检查点是否在擦除范围内
    const isPointInEraseRange = (node) => {
      if (previousPoint) {
        return this.distanceToSegment(node, previousPoint, point) <= radius;
      }
      const dx = node.x - point.x;
      const dy = node.y - point.y;
      return Math.sqrt((dx * dx) + (dy * dy)) <= radius;
    };

    this.handwritingPoints = this.handwritingPoints
      .map((stroke) => stroke.filter((node) => !isPointInEraseRange(node)))
      .filter((stroke) => stroke.length > 0);
  },

  distanceToSegment(point, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (dx === 0 && dy === 0) {
      const px = point.x - start.x;
      const py = point.y - start.y;
      return Math.sqrt((px * px) + (py * py));
    }

    const t = Math.max(0, Math.min(1, (((point.x - start.x) * dx) + ((point.y - start.y) * dy)) / ((dx * dx) + (dy * dy))));
    const projX = start.x + (t * dx);
    const projY = start.y + (t * dy);
    const distX = point.x - projX;
    const distY = point.y - projY;
    return Math.sqrt((distX * distX) + (distY * distY));
  },

  redrawHandwriting() {
    if (!this.handwritingCtx) return;

    this.handwritingCtx.clearRect(0, 0, 9999, 9999);
    this.handwritingCtx.setFillStyle("rgba(255, 255, 255, 0.01)");
    this.handwritingCtx.fillRect(0, 0, 9999, 9999);
    this.configureHandwritingPen();

    this.handwritingPoints.forEach((stroke) => {
      if (!stroke.length) return;

      this.handwritingCtx.beginPath();
      if (stroke.length === 1) {
        this.handwritingCtx.moveTo(stroke[0].x, stroke[0].y);
        this.handwritingCtx.lineTo(stroke[0].x + 0.1, stroke[0].y + 0.1);
      } else {
        this.handwritingCtx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length - 1; i += 1) {
          const current = stroke[i];
          const next = stroke[i + 1];
          const midX = (current.x + next.x) / 2;
          const midY = (current.y + next.y) / 2;
          this.handwritingCtx.quadraticCurveTo(current.x, current.y, midX, midY);
        }
        const penultimate = stroke[stroke.length - 2];
        const last = stroke[stroke.length - 1];
        this.handwritingCtx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);
      }
      this.handwritingCtx.stroke();
    });

    this.handwritingCtx.draw(false);
  },

  noop() {},

  submitAnswer() {
    const { currentQuestion, answerText, currentIndex, questionSet, correctCount, answeredCount } = this.data;
    if (!currentQuestion) {
      return;
    }

    if (!answerText) {
      wx.showToast({
        title: "请输入答案",
        icon: "none",
      });
      return;
    }

    const isCorrect = validateAnswer(currentQuestion, answerText, this.data.item);
    const nextIndex = currentIndex + 1;
    const finished = nextIndex >= questionSet.length;
    const questionElapsedMs = Date.now() - this.questionStartAt;

    this.records.push({
      id: currentQuestion.id,
      index: currentQuestion.index,
      prompt: currentQuestion.reviewPrompt || currentQuestion.prompt.replace(/\s*=\s*$/, ""),
      promptFormula: currentQuestion.promptFormula || null,
      answerMode: currentQuestion.answerMode || "",
      compare: currentQuestion.answerMode === "compare" ? {
        left: currentQuestion.compare?.left || "",
        right: currentQuestion.compare?.right || "",
        leftFormula: currentQuestion.compare?.leftFormula || null,
        rightFormula: currentQuestion.compare?.rightFormula || null,
      } : null,
      correctAnswer: currentQuestion.answerLabelMap?.[currentQuestion.answer] || currentQuestion.answer,
      userAnswer: currentQuestion.answerLabelMap?.[answerText] || answerText,
      isCorrect,
      elapsedMs: questionElapsedMs,
      elapsedText: formatSeconds(questionElapsedMs),
    });

    if (finished) {
      this.finishTraining(isCorrect ? correctCount + 1 : correctCount, answeredCount + 1);
      return;
    }

    this.questionStartAt = Date.now();

    this.setData({
      answeredCount: answeredCount + 1,
      correctCount: isCorrect ? correctCount + 1 : correctCount,
      currentIndex: nextIndex,
      currentQuestion: finished ? null : questionSet[nextIndex],
      answerText: "",
      progressPercent: this.getProgressPercent(answeredCount + 1, questionSet.length),
      feedbackText: "",
      feedbackType: "",
      handwritingVisible: false,
    });
  },

  getProgressPercent(answeredCount, totalCount) {
    const total = Number(totalCount) || 0;
    if (total <= 0) return 0;
    return Math.min(100, Math.round((answeredCount / total) * 100));
  },

  finishTraining(correctCount, answeredCount) {
    this.clearTimer();
    const elapsedMs = Date.now() - this.sessionStartAt;
    const wrongCount = answeredCount - correctCount;
    const levelText = this.getLevelText(this.data.item, elapsedMs);
    const sessionKey = saveSession("training_result", {
      item: this.data.item,
      records: this.records,
      summary: {
        config: this.data.config,
        answeredCount,
        correctCount,
        wrongCount,
        elapsedMs,
      },
    });

    addRecentRecord({
      type: "training",
      sectionId: this.data.item.sectionId,
      itemId: this.data.item.id,
      itemTitle: this.data.item.title,
      correctCount,
      wrongCount,
      questionCount: answeredCount,
      elapsedMs,
      levelText,
    });

    wx.redirectTo({
      url: `/pages/training/result/index?sessionKey=${sessionKey}`,
    });
  },

  getLevelText(item, elapsedMs) {
    const thresholds = item?.thresholds;
    if (!thresholds) return "";
    const elapsedSeconds = Math.floor((elapsedMs || 0) / 1000);
    if (elapsedSeconds <= thresholds.excellent) return "优秀";
    if (elapsedSeconds <= thresholds.good) return "良好";
    if (elapsedSeconds <= thresholds.pass) return "合格";
    return "未达标";
  },

  restartTraining() {
    const { item, config } = this.data;
    const questionSet = generateQuestionSet(item.sectionId, item.id, config.questionCount);
    this.clearTimer();

    this.setData({
      questionSet,
      currentIndex: 0,
      currentQuestion: questionSet[0] || null,
      answerText: "",
      answeredCount: 0,
      correctCount: 0,
      unsupported: questionSet.length === 0,
      elapsedText: "0:0:00",
      progressPercent: 0,
      feedbackText: "",
      feedbackType: "",
      handwritingVisible: false,
    });

    if (questionSet.length) {
      this.startSession();
    }
  },

  onShareAppMessage() {
    const title = this.data.item ? this.data.item.title : '行测训练';
    return { title };
  },
  onShareTimeline() {
    const title = this.data.item ? this.data.item.title : '行测训练';
    return { title };
  },
});
