const { formatDuration } = require("../../../utils/format")

Component({
  properties: {
    title: { type: String, value: "" },
    meta: { type: Array, value: [] },
    progressPercent: { type: Number, value: 0 },
    startAt: { type: Number, value: 0 },
    timerLabel: { type: String, value: "用时" },
  },

  data: {
    displayMeta: [],
    _timer: null,
  },

  lifetimes: {
    attached() {
      this.refreshDisplayMeta()
      this.startTimer()
    },
    ready() {
      this.refreshDisplayMeta()
    },
    detached() {
      this.stopTimer()
    },
  },

  observers: {
    "meta"() {
      this.refreshDisplayMeta()
    },
    "startAt"() {
      this.startTimer()
    },
  },

  methods: {
    startTimer() {
      this.stopTimer()
      if (this.properties.startAt <= 0) return
      this.tick()
      this.data._timer = setInterval(() => this.tick(), 1000)
    },

    stopTimer() {
      if (this.data._timer) {
        clearInterval(this.data._timer)
        this.data._timer = null
      }
    },

    tick() {
      const elapsedMs = Date.now() - this.properties.startAt
      const elapsedText = formatDuration(elapsedMs)
      this.triggerEvent("tick", { elapsedMs, elapsedText })
      this.refreshDisplayMeta(elapsedText)
    },

    refreshDisplayMeta(elapsedText) {
      const text = elapsedText !== undefined ? elapsedText : this._lastElapsedText || ""
      if (elapsedText !== undefined) this._lastElapsedText = elapsedText
      const displayMeta = (this.properties.meta || []).map((item) => {
        if (item.label === this.properties.timerLabel) {
          return { ...item, value: text }
        }
        return { ...item }
      })
      this.setData({ displayMeta })
    },
  },
})
