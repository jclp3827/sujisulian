const { noteModules } = require("../../../models/note-catalog");

Page({
  data: {
    modules: noteModules,
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: "花生笔记",
    });
  },

  handleModuleTap(event) {
    const { moduleId } = event.currentTarget.dataset;
    const module = this.data.modules.find((item) => item.id === moduleId);
    if (!module) return;

    if (module.status !== "ready") {
      wx.showToast({
        title: "该科目笔记整理中",
        icon: "none",
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/note/module/index?moduleId=${moduleId}`,
    });
  },
});
