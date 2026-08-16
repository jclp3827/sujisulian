Component({
  properties: {
    block: {
      type: Object,
      value: {},
    },
    exampleKey: {
      type: String,
      value: "",
    },
    blockIndex: {
      type: Number,
      value: -1,
    },
  },

  data: {
    selectedKey: "",
    submitted: false,
    revealed: false,
  },

  observers: {
    exampleKey() {
      this.setData({
        selectedKey: "",
        submitted: false,
        revealed: false,
      })
    },
  },

  methods: {
    handleOptionTap(event) {
      if (this.data.submitted) return
      const { key } = event.currentTarget.dataset
      if (!key) return
      this.setData({ selectedKey: key })
    },

    handleSubmit() {
      if (this.data.submitted) return
      if (!this.data.selectedKey) {
        wx.showToast({ title: "请先选择一个选项", icon: "none" })
        return
      }
      this.setData({ submitted: true })
    },

    handleReveal() {
      this.setData({ revealed: true })
    },

    handleImageError(event) {
      this.triggerEvent("imageerror", {
        index: this.properties.blockIndex,
        error: event.detail,
      })
    },
  },
})
