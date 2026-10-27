Page({
  data: { message: "正在打开照片工具…" },
  onLoad() {
    wx.redirectTo({
      url: "/subpackages/photo/process/index",
      fail: () => this.setData({ message: "照片工具暂时无法打开，请返回重试。" }),
    });
  },
});
