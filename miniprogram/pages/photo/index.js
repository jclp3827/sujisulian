Page({
  data: { available: false, editorReady: false },
  onShow() {
    this.setData({ available: true });
  },
  editorReady() { this.setData({ editorReady: true }); },
});
