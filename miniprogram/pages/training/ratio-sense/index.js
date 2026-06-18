const { generateRatioSenseSet } = require("../../../services/train-generator/ratio-sense")
const { saveSession } = require("../../../utils/session-store")
const { addRecentRecord } = require("../../../utils/recent-records")
const { formatDuration } = require("../../../utils/format")

Page({
  data: {
    index: 0,
    total: 10,
    current: null,
    selectedOption: "",
    submitted: false,
    correct: false,
    progressPercent: 0,
    elapsedText: "0:0:00",
    sessionStartAt: 0,
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: "比例感训练" })
    this.questions = generateRatioSenseSet(10)
    this.records = []
    const sessionStartAt = Date.now()
    this.setData({ sessionStartAt })
    this.timer = setInterval(() => this.tickTimer(), 1000)
    this.showQuestion(0)
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer)
  },

  tickTimer() {
    this.setData({ elapsedText: formatDuration(Date.now() - this.data.sessionStartAt) })
  },

  showQuestion(index) {
    const q = this.questions[index]
    this.setData({
      index,
      total: this.questions.length,
      current: q,
      selectedOption: "",
      submitted: false,
      correct: false,
      progressPercent: Math.round((index / this.questions.length) * 100),
    })
  },

  selectOption(e) {
    if (this.data.submitted) return
    const { option } = e.currentTarget.dataset
    this.setData({ selectedOption: option })
  },

  submitAnswer() {
    if (!this.data.selectedOption) {
      wx.showToast({ title: "请先选择一个选项", icon: "none" })
      return
    }
    const q = this.data.current
    const option = q.options.find((o) => o.id === this.data.selectedOption)
    const correct = option && option.isCorrect
    this.records.push({ correct, selected: this.data.selectedOption })
    this.setData({ submitted: true, correct })
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
    const correctCount = latestByQuestion.filter((r) => r.correct).length
    const wrongCount = Math.max(latestByQuestion.length - correctCount, 0)

    const records = latestByQuestion.map((record, index) => {
      const q = this.questions[index]
      const selectedOpt = q.options.find((o) => o.id === record.selected)
      return {
        id: q.id,
        index: index + 1,
        prompt: `R=${q.R}%  A:X=?`,
        correctAnswer: q.label,
        userAnswer: selectedOpt ? selectedOpt.label : "-",
        isCorrect: record.correct,
        elapsedText: "-",
      }
    })

    const item = { title: "比例感训练", sectionId: "data-analysis", id: "ratio-sense" }
    const summary = { correctCount, wrongCount, answeredCount: latestByQuestion.length, elapsedMs }
    const key = saveSession("training_ratio_sense", { item, records, summary, mode: "ratio-sense" })

    addRecentRecord({
      type: "training",
      sectionId: "data-analysis",
      itemId: "ratio-sense",
      itemTitle: "比例感训练",
      correctCount,
      wrongCount,
      questionCount: this.questions.length,
      elapsedMs,
    })
    wx.redirectTo({ url: `/pages/training/result/index?sessionKey=${key}` })
  },

  onShareAppMessage() {
    return { title: "比例感训练 - 行测速练" }
  },
  onShareTimeline() {
    return { title: "比例感训练 - 行测速练" }
  },
})
