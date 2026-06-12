const { getNoteModule, getNoteCategories, getNotePointsByCategory } = require("../../../models/note-catalog");

function decorateCategories(moduleId, categories) {
  return (categories || []).map((category) => {
    const points = getNotePointsByCategory(moduleId, category.id);
    const count = points.length;
    return {
      ...category,
      statusText: category.status === "ready" ? "可学习" : "待整理",
      pointText: count ? `${count} 个知识点` : "知识点待补充",
    };
  });
}

Page({
  data: {
    module: null,
    categories: [],
  },

  onLoad(options) {
    const module = getNoteModule(options.moduleId);
    if (!module) {
      wx.showToast({
        title: "笔记不存在",
        icon: "none",
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: `${module.title}知识地图`,
    });

    this.setData({
      module,
      categories: decorateCategories(module.id, getNoteCategories(module.id)),
    });
  },

  handleCategoryTap(event) {
    const { categoryId } = event.currentTarget.dataset;
    const category = this.data.categories.find((item) => item.id === categoryId);
    if (!category) return;

    if (category.status !== "ready") {
      wx.showToast({
        title: "该节点整理中",
        icon: "none",
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/note-category/index?moduleId=${this.data.module.id}&categoryId=${categoryId}`,
    });
  },
});
