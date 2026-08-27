Component({
  data: {
    selected: 0,
    list: [
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
      if (!path) return
      wx.switchTab({ url: path })
    },
  },
})
