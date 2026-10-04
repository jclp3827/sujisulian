const FEATURES = {
  favorites: { title: "我的收藏", description: "收藏功能正在筹备，稍后可从政治理论首页进入。" },
  daily: { title: "今日一练", description: "每日练习功能正在筹备，稍后可从政治理论首页进入。" },
};

Page({
  data: {
    feature: FEATURES.favorites,
  },
  onLoad(options = {}) {
    const feature = FEATURES[options.feature] || FEATURES.favorites;
    this.setData({ feature });
    wx.setNavigationBarTitle({ title: feature.title });
  },
  handleBack() {
    wx.navigateBack({ delta: 1 });
  },
});
