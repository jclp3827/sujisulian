const { createFiles, call } = require("../platform/files");
const { createRaster } = require("../platform/raster");
const { createPreviewPaid } = require("../platform/preview-paid");
const { createController } = require("../process/controller");
const controller = createController(wx, { createFiles, call, createRaster, createPreviewPaid }, Date);
const { data, ...methods } = controller;
Component({
  properties: { embedded: { type: Boolean, value: true }, dockOffset: { type: Number, value: 64 } },
  data,
  lifetimes: {
    attached() { this._entryLoad = this.onLoad({}); },
    async ready() { await this._entryLoad; if (!this._alive) return; await this.onReady(); this.triggerEvent("ready"); },
    detached() { this.onUnload(); },
  },
  pageLifetimes: {
    show() { if (this._alive) this.refreshAiInfo(); },
    hide() { if (this._alive) this.endCropTouch(); },
    resize() { if (this._alive) this.onResize(); },
  },
  methods,
});
