Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/home/index",
        text: "训练",
        iconPath: "/images/icons/tab-train.png",
        selectedIconPath: "/images/icons/tab-train-active.png",
      },
      {
        pagePath: "/pages/note/index/index",
        text: "笔记",
        iconPath: "/images/icons/tab-note.png",
        selectedIconPath: "/images/icons/tab-note-active.png",
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
