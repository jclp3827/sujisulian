App({
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-d8gw5r2il0c0f198a',
        traceUser: true,
      })
    }
  },
});
