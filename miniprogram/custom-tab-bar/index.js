Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/note/index/index",
        text: "笔记",
        symbol: "note",
      },
      {
        pagePath: "/pages/home/index",
        text: "训练",
        symbol: "training",
      },
      {
        pagePath: "/pages/common-sense/index",
        text: "常识",
        symbol: "common",
      },
      {
        pagePath: "/pages/politics/index",
        text: "政治理论",
        symbol: "politics",
      },
    ],
  },

  methods: {
    switchTab(event) {
      const { path } = event.currentTarget.dataset
      if (!this.data.list.some(item => item.pagePath === path) || this.switching) return
      if (this.data.list[this.data.selected]?.pagePath === path) return
      this.switching = true
      wx.switchTab({
        url: path,
        fail: () => wx.showToast({ title: '暂时无法切换，请重试', icon: 'none' }),
        complete: () => { this.switching = false },
      })
    },
  },
})
