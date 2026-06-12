const { getNoteModule, getNoteCategory, getNotePointsByCategory } = require("../../models/note-catalog");

const pointTypeText = {
  formula: "公式",
  method: "方法",
  "quick-check": "速查",
};

function decoratePoints(points) {
  return (points || []).map((point) => ({
    ...point,
    typeText: pointTypeText[point.type] || "知识",
  }));
}

Page({
  data: {
    module: null,
    category: null,
    points: [],
  },

  onLoad(options) {
    const module = getNoteModule(options.moduleId);
    const category = getNoteCategory(options.moduleId, options.categoryId);

    if (!module || !category) {
      wx.showToast({
        title: "分类不存在",
        icon: "none",
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: category.title,
    });

    this.setData({
      module,
      category,
      points: decoratePoints(getNotePointsByCategory(module.id, category.id)),
    });
  },

  handlePointTap(event) {
    const { pointId } = event.currentTarget.dataset;
    if (!pointId) return;

    wx.navigateTo({
      url: `/pages/note-detail/index?moduleId=${this.data.module.id}&pointId=${pointId}`,
    });
  },
});
