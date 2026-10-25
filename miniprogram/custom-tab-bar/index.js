Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/portal/index",
        text: "首页",
        iconPath: "/images/icons/tab-home.png",
        selectedIconPath: "/images/icons/tab-home-active.png",
      },
      {
        pagePath: "/pages/note/index/index",
        text: "笔记",
        iconPath: "/images/icons/tab-note.png",
        selectedIconPath: "/images/icons/tab-note-active.png",
      },
      {
        pagePath: "/pages/home/index",
        text: "训练",
        iconPath: "/images/icons/tab-train.png",
        selectedIconPath: "/images/icons/tab-train-active.png",
      },
      {
        pagePath: "/pages/common-sense/index",
        text: "常识",
        iconPath: "/images/icons/tab-common-sense.png",
        selectedIconPath: "/images/icons/tab-common-sense-active.png",
      },
      {
        pagePath: "/pages/politics/index",
        text: "政治理论",
        iconText: "政",
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
