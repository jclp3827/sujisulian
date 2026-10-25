const { createFiles, call } = require("../platform/files");
const { createRaster } = require("../platform/raster");
const { createPreviewPaid } = require("../platform/preview-paid");
const { createController } = require("./controller");
const controller = createController(wx, { createFiles, call, createRaster, createPreviewPaid }, Date);
const initialize = controller.onLoad;
controller.onLoad = function(options) {
  // A second file-session init would clear the live photo page's owned directory.
  // Prefer its existing task before any legacy/diagnostic files initialize.
  const pages = typeof getCurrentPages === "function" ? getCurrentPages() : [];
  const host = pages.find(page => page.route === "pages/photo/index");
  const editor = host && host.selectComponent && host.selectComponent("#photoEditor");
  if (editor && editor._alive && (editor._source || editor._locked)) {
    wx.navigateBack({ delta: pages.length - 1 - pages.indexOf(host) });
    return;
  }
  return initialize.call(this, options);
};
Page(controller);
