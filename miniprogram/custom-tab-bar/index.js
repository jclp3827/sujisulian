Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/portal/index",
        text: "首页",
        theme: "home",
        iconPath: "/images/icons/tab-v2/tab-home.svg",
        selectedIconPath: "/images/icons/tab-v2/tab-home-active.svg",
      },
      {
        pagePath: "/pages/note/index/index",
        text: "花生笔记",
        theme: "note",
        iconPath: "/images/icons/tab-v2/tab-note.svg",
        selectedIconPath: "/images/icons/tab-v2/tab-note-active.svg",
      },
      {
        pagePath: "/pages/home/index",
        text: "行测速练",
        theme: "train",
        iconPath: "/images/icons/tab-v2/tab-train.svg",
        selectedIconPath: "/images/icons/tab-v2/tab-train-active.svg",
      },
      {
        pagePath: "/pages/common-sense/index",
        text: "公考常识",
        theme: "common-sense",
        iconPath: "/images/icons/tab-v2/tab-common-sense.svg",
        selectedIconPath: "/images/icons/tab-v2/tab-common-sense-active.svg",
      },
      {
        pagePath: "/pages/politics/index",
        text: "政治理论",
        theme: "politics",
        iconPath: "/images/icons/tab-v2/tab-politics.svg",
        selectedIconPath: "/images/icons/tab-v2/tab-politics-active.svg",
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
