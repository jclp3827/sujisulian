Page({
  data: {
    modules: [
      { id: "note", title: "笔记", subtitle: "梳理考点，串起知识", detail: "知识地图 · 分类查阅", path: "/pages/note/index/index", icon: "/images/icons/tab-v2/tab-note-active.svg" },
      { id: "train", title: "训练", subtitle: "专项练习，积累手感", detail: "数资速练 · 思维训练", path: "/pages/home/index", icon: "/images/icons/tab-v2/tab-train-active.svg" },
      { id: "common", title: "常识", subtitle: "分门别类，日积月累", detail: "常识判断 · 考点学习", path: "/pages/common-sense/index", icon: "/images/icons/tab-v2/tab-common-sense-active.svg" },
      { id: "politics", title: "政治理论", subtitle: "循着体系，理解记忆", detail: "目录浏览 · 知识地图", path: "/pages/politics/index", icon: "/images/icons/tab-v2/tab-politics-active.svg" },
    ],
  },

  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 0 });
  },

  handleModuleTap(event) {
    const module = this.data.modules.find(item => item.id === event.currentTarget.dataset.id);
    if (module) wx.switchTab({ url: module.path });
  },

  handlePhotoTap() {
    wx.navigateTo({ url: "/subpackages/photo/process/index" });
  },
});
