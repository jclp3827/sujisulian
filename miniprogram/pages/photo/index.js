Page({
  data: { available: false, editorReady: false },
  onShow() {
    let env = "";
    try { env = wx.getAccountInfoSync().miniProgram.envVersion; } catch (_) {}
    this.setData({ available: env === "develop" || env === "trial" });
  },
  editorReady() { this.setData({ editorReady: true }); },
});
