const { generateEstimationSet } = require("../../../services/train-generator/estimation-split")
const { saveSession } = require("../../../utils/session-store")
const { addRecentRecord } = require("../../../utils/recent-records")
const { formatDuration } = require("../../../utils/format")

Page({
  data: {
    index: 0,
    total: 10,
    current: null,
    sliderPercent: 50,
    userA: 0,
    userX: 0,
    showLeftLabel: true,
    showRightLabel: true,
    submitted: false,
    correct: false,
    accuracy: 0,
    accuracyBars: [],
    progressPercent: 0,
    elapsedText: "0:0:00",
    sessionStartAt: 0,
    handwritingVisible: false,
    handwritingTool: "pen",
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: "拆分估算训练" })
    const questionCount = Number(this.options.count) || 10
    this.questions = generateEstimationSet(questionCount)
    this.records = []
    const sessionStartAt = Date.now()
    this.setData({ sessionStartAt })
    this.timer = setInterval(() => this.tickTimer(), 1000)
    this.showQuestion(0)
  },

  onReady() {
    this.handwritingPoints = []
    this.currentStroke = null
    this.eraseLastPoint = null
    this.strokeDrawnEnd = 0
    this.canvasRect = null
    this.handwritingCtx = wx.createCanvasContext("handwritingCanvas", this)
    this.handwritingCtx.setLineCap("round")
    this.handwritingCtx.setLineJoin("round")
    this.configureHandwritingPen()
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer)
  },

  tickTimer() {
    this.setData({ elapsedText: formatDuration(Date.now() - this.data.sessionStartAt) })
  },

  showQuestion(index) {
    const q = this.questions[index]
    const sliderPercent = 50
    const userA = Math.round(q.B * sliderPercent / 100)
    const userX = q.B - userA
    this.setData({
      index,
      total: this.questions.length,
      current: q,
      sliderPercent,
      userA,
      userX,
      showLeftLabel: sliderPercent >= 20,
      showRightLabel: (100 - sliderPercent) >= 20,
      submitted: false,
      correct: false,
      accuracy: 0,
      accuracyBars: Array(10).fill(false),
      progressPercent: Math.round((index / this.questions.length) * 100),
    })
    // 延迟获取滑块区域尺寸，确保 DOM 已渲染
    setTimeout(() => this.updateSliderRect(), 100)
  },

  updateSliderRect() {
    const query = wx.createSelectorQuery().in(this)
    query.select('#sliderArea').boundingClientRect()
    query.exec((res) => {
      this.sliderRect = res && res[0] ? res[0] : null
    })
  },

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX
    this.startPercent = this.data.sliderPercent
  },

  handleTouchMove(e) {
    if (!this.sliderRect) return
    const touch = e.touches[0]
    const rect = this.sliderRect
    const relativeX = touch.clientX - rect.left
    let percent = (relativeX / rect.width) * 100
    percent = Math.max(5, Math.min(95, percent))
    const userA = Math.round(this.data.current.B * percent / 100)
    const userX = this.data.current.B - userA
    this.setData({
      sliderPercent: percent,
      userA,
      userX,
      showLeftLabel: percent >= 20,
      showRightLabel: (100 - percent) >= 20,
    })
  },

  handleTouchEnd(e) {
    // 触摸结束，无需额外操作
  },

  submitAnswer() {
    const q = this.data.current
    const userA = this.data.userA
    const userX = this.data.userX

    const errA = Math.abs(userA - q.A) / Math.max(q.A, 1)
    const errX = Math.abs(userX - q.X) / Math.max(q.X, 1)
    const maxErr = Math.max(errA, errX)
    const accuracy = Math.max(0, Math.min(100, Math.round((1 - maxErr) * 100)))
    const correct = maxErr <= 0.05

    const filled = Math.max(0, Math.min(10, Math.round(accuracy / 10)))
    const accuracyBars = Array(10).fill(false).map((_, i) => i < filled)

    this.records.push({ correct, accuracy, userA, userX })
    this.setData({ submitted: true, correct, accuracy, accuracyBars })
  },

  nextQuestion() {
    const nextIndex = this.data.index + 1
    if (nextIndex >= this.questions.length) {
      this.finishTraining()
      return
    }
    this.showQuestion(nextIndex)
  },

  finishTraining() {
    if (this.timer) clearInterval(this.timer)
    const elapsedMs = Date.now() - this.data.sessionStartAt
    const latestByQuestion = this.records
    const correctCount = latestByQuestion.filter(r => r.correct).length
    const wrongCount = Math.max(latestByQuestion.length - correctCount, 0)

    const records = latestByQuestion.map((record, index) => {
      const q = this.questions[index]
      return {
        id: q.id,
        index: index + 1,
        prompt: `B=${q.B}  R=${q.R}%`,
        correctAnswer: `A=${q.A}  X=${q.X}`,
        userAnswer: `A=${record.userA}  X=${record.userX}`,
        isCorrect: record.correct,
        elapsedText: "-",
      }
    })

    const item = { title: "拆分估算训练", sectionId: "data-analysis", id: "estimation-split" }
    const summary = { correctCount, wrongCount, answeredCount: latestByQuestion.length, elapsedMs }
    const key = saveSession("training_estimation", { item, records, summary, mode: "estimation" })

    addRecentRecord({
      type: "training",
      sectionId: "data-analysis",
      itemId: "estimation-split",
      itemTitle: "拆分估算",
      correctCount,
      wrongCount,
      questionCount: this.questions.length,
      elapsedMs,
    })
    wx.redirectTo({ url: `/pages/training/result/index?sessionKey=${key}` })
  },

  toggleHandwriting() {
    const newVisible = !this.data.handwritingVisible
    this.setData({
      handwritingVisible: newVisible,
      handwritingTool: "pen",
    })
    if (newVisible) {
      this.refreshCanvasRect()
    }
  },

  refreshCanvasRect() {
    const query = wx.createSelectorQuery().in(this)
    query.select('.handwriting-canvas').boundingClientRect((rect) => {
      this.canvasRect = rect
    }).exec()
  },

  toggleHandwritingTool(event) {
    const { tool } = event.currentTarget.dataset
    this.setData({
      handwritingTool: this.data.handwritingTool === tool ? "pen" : tool,
    })
    this.handwritingWriting = false
    this.currentStroke = null
    this.eraseLastPoint = null
  },

  getCanvasPoint(touch) {
    if (!this.canvasRect) {
      return { x: touch.x, y: touch.y }
    }
    return {
      x: touch.clientX - this.canvasRect.left,
      y: touch.clientY - this.canvasRect.top,
    }
  },

  startHandwriting(event) {
    if (!this.handwritingPoints) {
      this.handwritingPoints = []
    }
    const touch = event.touches[0]
    const point = this.getCanvasPoint(touch)
    if (!point) return
    this.isErasing = this.data.handwritingTool === "erase"
    if (this.isErasing) {
      this.eraseLastPoint = point
      this.eraseHandwriting(point)
      return
    }
    this.handwritingWriting = true
    this.currentStroke = [{ x: point.x, y: point.y }]
    this.strokeDrawnEnd = 0
    this.handwritingPoints.push(this.currentStroke)
    this.drawStrokeDot(point)
  },

  moveHandwriting(event) {
    const touch = event.touches[0]
    const point = this.getCanvasPoint(touch)
    if (!point) return
    if (this.isErasing) {
      this.eraseHandwriting(point, this.eraseLastPoint)
      this.eraseLastPoint = point
      return
    }
    if (!this.handwritingWriting || !this.currentStroke) return
    const lastPoint = this.currentStroke[this.currentStroke.length - 1]
    const dx = point.x - lastPoint.x
    const dy = point.y - lastPoint.y
    const distance = Math.sqrt((dx * dx) + (dy * dy))
    const steps = Math.max(1, Math.ceil(distance / 1.5))
    for (let i = 1; i <= steps; i += 1) {
      this.currentStroke.push({
        x: lastPoint.x + ((dx * i) / steps),
        y: lastPoint.y + ((dy * i) / steps),
      })
    }
    const newPointsStart = Math.max(0, this.strokeDrawnEnd - 1)
    if (this.currentStroke.length > newPointsStart + 1) {
      this.drawStrokeSegment(this.currentStroke, newPointsStart)
      this.strokeDrawnEnd = this.currentStroke.length - 1
    }
  },

  endHandwriting() {
    this.handwritingWriting = false
    this.isErasing = false
    this.currentStroke = null
    this.eraseLastPoint = null
  },

  clearHandwriting() {
    this.handwritingPoints = []
    this.currentStroke = null
    this.eraseLastPoint = null
    this.redrawHandwriting()
  },

  configureHandwritingPen() {
    if (!this.handwritingCtx) return
    this.handwritingCtx.setStrokeStyle("#111827")
    this.handwritingCtx.setLineWidth(2)
  },

  configureHandwritingEraser() {
    if (!this.handwritingCtx) return
    this.handwritingCtx.setFillStyle("rgba(0, 0, 0, 1)")
  },

  drawStrokeDot(point) {
    if (!this.handwritingCtx || !point) return
    this.configureHandwritingPen()
    this.handwritingCtx.beginPath()
    this.handwritingCtx.moveTo(point.x, point.y)
    this.handwritingCtx.lineTo(point.x + 0.1, point.y + 0.1)
    this.handwritingCtx.stroke()
    this.handwritingCtx.draw(true)
  },

  drawStrokeSegment(stroke, startIndex = 0) {
    if (!this.handwritingCtx || !stroke || stroke.length < 2) return
    this.configureHandwritingPen()
    const fromIndex = Math.max(0, Math.min(startIndex, stroke.length - 2))
    const segment = stroke.slice(fromIndex)
    if (segment.length < 2) return
    this.handwritingCtx.beginPath()
    this.handwritingCtx.moveTo(segment[0].x, segment[0].y)
    if (segment.length === 2) {
      this.handwritingCtx.lineTo(segment[1].x, segment[1].y)
    } else {
      for (let i = 1; i < segment.length - 1; i += 1) {
        const current = segment[i]
        const next = segment[i + 1]
        const midX = (current.x + next.x) / 2
        const midY = (current.y + next.y) / 2
        this.handwritingCtx.quadraticCurveTo(current.x, current.y, midX, midY)
      }
      const penultimate = segment[segment.length - 2]
      const last = segment[segment.length - 1]
      this.handwritingCtx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y)
    }
    this.handwritingCtx.stroke()
    this.handwritingCtx.draw(true)
  },

  eraseHandwriting(point, previousPoint = null) {
    if (!this.handwritingCtx || !point) return
    const size = 30
    if (previousPoint) {
      const dx = point.x - previousPoint.x
      const dy = point.y - previousPoint.y
      const distance = Math.sqrt((dx * dx) + (dy * dy))
      const steps = Math.max(1, Math.ceil(distance / (size / 3)))
      for (let i = 0; i <= steps; i += 1) {
        const x = previousPoint.x + ((dx * i) / steps)
        const y = previousPoint.y + ((dy * i) / steps)
        this.handwritingCtx.clearRect(x - (size / 2), y - (size / 2), size, size)
      }
    } else {
      this.handwritingCtx.clearRect(point.x - (size / 2), point.y - (size / 2), size, size)
    }
    this.handwritingCtx.draw(true)
    this.trimHandwritingPoints(point, previousPoint, size / 2)
  },

  trimHandwritingPoints(point, previousPoint = null, radius = 15) {
    if (!point) return
    const isPointInEraseRange = (node) => {
      if (previousPoint) {
        return this.distanceToSegment(node, previousPoint, point) <= radius
      }
      const dx = node.x - point.x
      const dy = node.y - point.y
      return Math.sqrt((dx * dx) + (dy * dy)) <= radius
    }
    this.handwritingPoints = this.handwritingPoints
      .map((stroke) => stroke.filter((node) => !isPointInEraseRange(node)))
      .filter((stroke) => stroke.length > 0)
  },

  distanceToSegment(point, start, end) {
    const dx = end.x - start.x
    const dy = end.y - start.y
    if (dx === 0 && dy === 0) {
      const px = point.x - start.x
      const py = point.y - start.y
      return Math.sqrt((px * px) + (py * py))
    }
    const t = Math.max(0, Math.min(1, (((point.x - start.x) * dx) + ((point.y - start.y) * dy)) / ((dx * dx) + (dy * dy))))
    const projX = start.x + (t * dx)
    const projY = start.y + (t * dy)
    const distX = point.x - projX
    const distY = point.y - projY
    return Math.sqrt((distX * distX) + (distY * distY))
  },

  redrawHandwriting() {
    if (!this.handwritingCtx) return
    this.handwritingCtx.clearRect(0, 0, 9999, 9999)
    this.handwritingCtx.setFillStyle("rgba(255, 255, 255, 0.01)")
    this.handwritingCtx.fillRect(0, 0, 9999, 9999)
    this.configureHandwritingPen()
    this.handwritingPoints.forEach((stroke) => {
      if (!stroke.length) return
      this.handwritingCtx.beginPath()
      if (stroke.length === 1) {
        this.handwritingCtx.moveTo(stroke[0].x, stroke[0].y)
        this.handwritingCtx.lineTo(stroke[0].x + 0.1, stroke[0].y + 0.1)
      } else {
        this.handwritingCtx.moveTo(stroke[0].x, stroke[0].y)
        for (let i = 1; i < stroke.length - 1; i += 1) {
          const current = stroke[i]
          const next = stroke[i + 1]
          const midX = (current.x + next.x) / 2
          const midY = (current.y + next.y) / 2
          this.handwritingCtx.quadraticCurveTo(current.x, current.y, midX, midY)
        }
        const penultimate = stroke[stroke.length - 2]
        const last = stroke[stroke.length - 1]
        this.handwritingCtx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y)
      }
      this.handwritingCtx.stroke()
    })
    this.handwritingCtx.draw(false)
  },

  noop() {},

  onShareAppMessage() {
    return { title: '拆分估算训练 - 行测速练' };
  },
  onShareTimeline() {
    return { title: '拆分估算训练 - 行测速练' };
  },
})
