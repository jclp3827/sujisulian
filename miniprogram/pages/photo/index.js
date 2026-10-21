Page({
  data: { available: false, editorReady: false, dockOffset: 64 },
  onShow() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (tabBar) tabBar.setData({ selected: 4 });
    let env = "";
    try { env = wx.getAccountInfoSync().miniProgram.envVersion; } catch (_) {}
    this.setData({ available: env === "develop" || env === "trial" });
    this.measureTabBar();
  },
  onReady() { this.measureTabBar(); },
  onResize() { this.measureTabBar(); },
  editorReady() { this.setData({ editorReady: true }); this.measureTabBar(); },
  measureTabBar() {
    const tabBar = this.getTabBar && this.getTabBar();
    if (!tabBar || typeof wx.createSelectorQuery !== "function") return;
    const measure = () => wx.createSelectorQuery().in(tabBar).select(".tab-bar-shell").boundingClientRect(rect => {
      if (rect && rect.height > 0) this.setData({ dockOffset: rect.height });
    }).exec();
    if (typeof wx.nextTick === "function") wx.nextTick(measure); else measure();
  },
});
