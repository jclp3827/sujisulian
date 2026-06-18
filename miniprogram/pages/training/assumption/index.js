const { generateAssumptionSet } = require("../../../services/train-generator/assumption-alloc")
const { saveSession } = require("../../../utils/session-store")
const { addRecentRecord } = require("../../../utils/recent-records")
const { formatDuration } = require("../../../utils/format")

const LEVEL_COUNT = 3
const TOLERANCE_RATIO = 0.03

function createLevel(index) {
  return {
    index, b: "", a: "", x: "",
    bStatus: "idle", aStatus: "idle", xStatus: "idle",
    bActive: false, aActive: false, xActive: false,
  }
}

function parseNumber(value) {
  if (value === "" || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function withinTolerance(actual, expected, ratio = TOLERANCE_RATIO) {
  if (actual === null || expected === null || !Number.isFinite(expected)) return "idle"
  const base = Math.max(Math.abs(expected), 1)
  return Math.abs(actual - expected) <= base * ratio ? "pass" : "fail"
}

function normalizeField(rawField) {
  if (!rawField) return null
  const parts = String(rawField).split(".")
  if (parts[0] === "levels" && parts.length === 3) {
    return { scope: "levels", index: Number(parts[1]), key: parts[2] }
  }
  return null
}

function makeField(index, key) {
  return `levels.${index}.${key}`
}

function makeAnchorId(field) {
  return `field-${String(field || "").replace(/\./g, "-")}`
}

function applyActiveState(levels, activeField) {
  const field = normalizeField(activeField)
  const nextLevels = levels.map((level, index) => ({
    ...level,
    aActive: !!(field && field.scope === "levels" && field.index === index && field.key === "a"),
    bActive: !!(field && field.scope === "levels" && field.index === index && field.key === "b"),
    xActive: !!(field && field.scope === "levels" && field.index === index && field.key === "x"),
  }))
  return { levels: nextLevels }
}

Page({
  data: {
    index: 0,
    total: 0,
    current: null,
    levels: [],
    activeField: "",
    activeValue: "",
    submitted: false,
    correct: false,
    filledCount: 0,
    totalFields: LEVEL_COUNT * 3,
    feedbackText: "",
    resultA: "",
    resultX: "",
    referenceA: "",
    referenceX: "",
    records: [],
    accuracy: 0,
    accuracyBars: [],
    scrollInto: "",
    handwritingVisible: false,
    handwritingTool: "pen",
    elapsedText: "0:0:00",
    progressPercent: 0,
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: "分配树训练" })
    const questionCount = Number(this.options.count) || 10
    this.questions = generateAssumptionSet(questionCount)
    this.records = []
    this.sessionStartAt = Date.now()
    this.tickTimer()
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
    this.setData({ elapsedText: formatDuration(Date.now() - this.sessionStartAt) })
  },

  showQuestion(index) {
    const q = this.questions[index]
    const levels = Array.from({ length: LEVEL_COUNT }, (_, i) => createLevel(i + 1))
    levels[0].b = String(q.B)
    const activeField = makeField(0, "a")
    const viewState = applyActiveState(levels, activeField)
    const filledCount = 1
    this.setData({
      index,
      total: this.questions.length,
      current: q,
      levels: viewState.levels,
      activeField,
      activeValue: "",
      submitted: false,
      correct: false,
      filledCount,
      feedbackText: "",
      resultA: "",
      resultX: "",
      referenceA: "",
      referenceX: "",
      accuracy: 0,
      accuracyBars: [],
      scrollInto: "",
      records: this.data.records,
      progressPercent: Math.round((index / this.questions.length) * 100),
    })
  },

  selectField(e) {
    const { field } = e.currentTarget.dataset
    const value = this.getFieldValue(field)
    const viewState = applyActiveState(this.data.levels, field)
    this.setData({
      levels: viewState.levels,
      activeField: field,
      activeValue: value,
      scrollInto: makeAnchorId(field),
    })
  },

  getFieldValue(field) {
    if (!field) return ""
    const parts = field.split(".")
    if (parts[0] === "levels") {
      const level = this.data.levels[Number(parts[1])]
      return level ? level[parts[2]] : ""
    }
    return ""
  },

  updateField(field, value) {
    if (!field) return
    const parsed = normalizeField(field)
    if (!parsed || parsed.scope !== "levels") return
    const levels = this.data.levels.map((level) => ({ ...level }))

    if (!levels[parsed.index] || !["a", "b", "x"].includes(parsed.key)) return
    levels[parsed.index][parsed.key] = value
    levels[parsed.index][`${parsed.key}Status`] = "idle"

    const viewState = applyActiveState(levels, field)
    this.setData({
      levels: viewState.levels,
      activeValue: value,
      submitted: false,
      feedbackText: "",
    }, () => this.updateFilledCount())
  },

  updateFilledCount() {
    const levelCount = this.data.levels.reduce((sum, level) => {
      return sum + [level.b, level.a, level.x].filter((v) => v !== "").length
    }, 0)
    this.setData({ filledCount: levelCount })
  },

  handleKeyTap(e) {
    const { key } = e.currentTarget.dataset
    const field = this.data.activeField
    let value = this.getFieldValue(field)
    if (!field) return
    if (key === "clear") {
      this.updateField(field, "")
      return
    }
    if (key === "delete") {
      this.updateField(field, value.slice(0, -1))
      return
    }
    if (key === "." && value.includes(".")) return
    if (key === "-") {
      if (value.includes("-") || value.length > 0) return
      this.updateField(field, "-")
      return
    }
    this.updateField(field, `${value}${key}`)
  },

  submitAnswer() {
    const levels = this.data.levels.map((level) => ({ ...level }))
    let checkCount = 0
    let passCount = 0

    levels.forEach((level) => {
      const a = parseNumber(level.a)
      const x = parseNumber(level.x)
      level.bStatus = "idle"
      level.aStatus = a === null ? "idle" : "pass"
      level.xStatus = x === null ? "idle" : "pass"
    })

    const expectedA = levels.reduce((sum, level) => sum + (parseNumber(level.a) || 0), 0)
    const expectedX = levels.reduce((sum, level) => sum + (parseNumber(level.x) || 0), 0)
    const hasA = levels.some((level) => parseNumber(level.a) !== null)
    const hasX = levels.some((level) => parseNumber(level.x) !== null)
    const treeAStatus = hasA ? withinTolerance(expectedA, this.data.current.A) : "idle"
    const treeXStatus = hasX ? withinTolerance(expectedX, this.data.current.X) : "idle"
    const totalStatus = hasA && hasX ? withinTolerance(expectedA + expectedX, this.data.current.B) : "idle"
    ;[treeAStatus, treeXStatus, totalStatus].forEach((status) => {
      if (status === "idle") return
      checkCount += 1
      if (status === "pass") passCount += 1
    })

    const correct = checkCount === 3 && passCount === checkCount
    const accuracy = checkCount === 0 ? 0 : Math.max(0, Math.min(100, Math.round((passCount / checkCount) * 100)))
    const filledBars = Math.max(0, Math.min(10, Math.round(accuracy / 10)))
    const accuracyBars = Array(10).fill(false).map((_, i) => i < filledBars)
    const feedbackText = checkCount === 0
      ? ""
      : `已核对 A 合计、X 合计与 A+X，正确 ${passCount} / ${checkCount}`

    const record = {
      questionId: this.data.current.id,
      levels: levels.map(({ b, a, x, bStatus, aStatus, xStatus }) => ({ b, a, x, bStatus, aStatus, xStatus })),
      totals: { a: expectedA, x: expectedX, b: this.data.current.B },
      checkCount,
      passCount,
      correct,
    }
    const records = [...this.data.records]
    records[this.data.index] = record

    this.setData({
      ...applyActiveState(levels, this.data.activeField),
      submitted: true,
      correct,
      feedbackText,
      resultA: expectedA,
      resultX: expectedX,
      referenceA: this.data.current.A,
      referenceX: this.data.current.X,
      accuracy,
      accuracyBars,
      records,
    }, () => {
      // 提交后滚动到反馈区
      setTimeout(() => {
        this.setData({ scrollInto: 'feedbackAnchor' })
      }, 100)
    })
  },

  expectedRemaining(prevLevel) {
    const b = parseNumber(prevLevel.b)
    const a = parseNumber(prevLevel.a)
    const x = parseNumber(prevLevel.x)
    if (b === null || a === null || x === null) return null
    return b - a - x
  },

  nextQuestion() {
    const n = this.data.index + 1
    if (n >= this.questions.length) { this.finishTraining(); return }
    this.showQuestion(n)
  },

  finishTraining() {
    if (this.timer) clearInterval(this.timer)
    const latestByQuestion = this.data.records.filter(Boolean)
    const correctCount = latestByQuestion.filter((r) => r.correct).length
    const wrongCount = Math.max(latestByQuestion.length - correctCount, 0)
    const elapsedMs = Date.now() - this.sessionStartAt
    const records = latestByQuestion.map((record, index) => {
      const q = this.questions[index]
      return {
        id: record.questionId || `q-${index}`,
        index: index + 1,
        prompt: `B=${q.B}  R=${q.rate}%`,
        correctAnswer: `A=${q.A}  X=${q.X}`,
        userAnswer: `A=${record.totals.a || "-"}  X=${record.totals.x || "-"}  B=${record.totals.b || "-"}`,
        isCorrect: record.correct,
        elapsedText: "-",
      }
    })
    const item = { title: "分配树训练", sectionId: "data-analysis", id: "assumption-tree" }
    const summary = { correctCount, wrongCount, answeredCount: latestByQuestion.length, elapsedMs }
    const key = saveSession("training_assumption", { item, records, summary, mode: "assumption" })
    addRecentRecord({
      type: "training",
      sectionId: "data-analysis",
      itemId: "assumption-alloc",
      itemTitle: "分配树",
      correctCount,
      wrongCount,
      questionCount: latestByQuestion.length,
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
})
