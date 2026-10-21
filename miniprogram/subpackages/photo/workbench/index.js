const { createFiles } = require("../platform/files");
const { inspectJpeg } = require("../core/jpeg");
const { equalBytes } = require("../core/bytes");
const { sha256 } = require("../core/sha256");
const profile = require("../profiles/henan-retained");
const fixture = require("../fixtures/transfer-sample");
const { errorText, isCancel: cancelled } = require("../platform/errors");

function available(method) {
  return typeof wx[method] === "function" && (!wx.canIUse || wx.canIUse(method));
}

Page({
  data: {
    allowed: false,
    ready: false,
    busy: false,
    canShare: false,
    canChoose: false,
    hasSample: false,
    sourceLabel: "",
    previewPath: "",
    sizeLabel: "",
    dimensions: "",
    fingerprint: "",
    localStatus: "待准备文件",
    exportStatus: "尚未导出",
    exportError: "",
    compareStatus: "尚未重新选入文件",
    compareOk: false,
    markerLabel: "",
    notice: "",
    detailsOpen: false,
  },

  async onLoad() {
    this._alive = true;
    this._locked = false;
    this._exportAttempted = false;
    let env = "";
    try { env = wx.getAccountInfoSync().miniProgram.envVersion; } catch (_) {}
    const allowed = env === "develop" || env === "trial";
    this.setData({ allowed, canShare: available("shareFileMessage"), canChoose: available("chooseMessageFile") });
    if (!allowed) return;
    this._files = createFiles(wx);
    await this.run(async () => {
      await this._files.init();
      this.update({ ready: true });
    });
  },

  onUnload() {
    this._alive = false;
    this._sample = null;
    if (this._files) this._files.dispose();
  },

  update(data) {
    if (this._alive) this.setData(data);
  },

  async run(action) {
    if (this._locked || !this._alive || !this.data.allowed) return;
    this._locked = true;
    this.update({ busy: true, notice: "" });
    try { await action(); }
    catch (error) {
      if (!cancelled(error)) this.update({ notice: errorText(error, "操作未完成，请在真机重试；也可查看当前微信是否支持文件操作。") });
    } finally {
      this._locked = false;
      this.update({ busy: false });
    }
  },

  async setSample(data, label) {
    const info = inspectJpeg(data);
    if (info.width * info.height > 8000000) throw new Error("本阶段仅支持不超过 800 万像素的 JPG 文件");
    const record = await this._files.writeVerified(data, "jpg");
    if (!this._alive) { await this._files.remove(record.path); return; }
    const previous = this._sample;
    this._sample = { data: new Uint8Array(data), record, info, label };
    this._exportAttempted = false;
    this._comparison = null;
    this.update({
      hasSample: true,
      sourceLabel: label,
      previewPath: record.path,
      sizeLabel: data.length + " 字节",
      dimensions: info.width + " × " + info.height,
      fingerprint: record.sha256,
      localStatus: "写入前后完整字节一致",
      exportStatus: "尚未导出",
      exportError: "",
      compareStatus: "尚未重新选入文件",
      compareOk: false,
      markerLabel: info.tail === profile.tailHex ? "与河南留存样本尾部一致" : "与河南留存样本尾部不同（仍可校验交付）",
    });
    if (previous) await this._files.remove(previous.record.path);
  },

  useTestFile() {
    if (!this.data.ready) return;
    return this.run(async () => {
      const data = new Uint8Array(wx.base64ToArrayBuffer(fixture.base64));
      if (sha256(data) !== fixture.sha256) throw new Error("内置测试文件完整性检查失败");
      await this.setSample(data, "非人像测试文件 · 不能用于报名");
    });
  },

  chooseSample() {
    if (!this.data.ready || !this.data.canChoose) return;
    return this.run(async () => this.setSample(await this._files.choose(), "你选入的 JPG 文件"));
  },

  exportSample() {
    if (!this._sample || !this.data.canShare) return;
    return this.run(async () => {
      this._comparison = null;
      this._exportAttempted = true;
      this.update({ exportStatus: "正在打开文件导出", exportError: "", compareStatus: "尚未重新选入文件", compareOk: false });
      try {
        await this._files.share(this._sample.record, "photo-poc-check-" + this._sample.record.sha256.slice(0, 8) + ".jpg");
        this.update({ exportStatus: "导出接口返回成功，等待重新选入校验" });
      } catch (error) {
        this._exportAttempted = false;
        this.update({ exportStatus: cancelled(error) ? "已取消导出" : "导出未完成，链路尚未验证", exportError: cancelled(error) ? "" : errorText(error, "微信未提供详细错误信息") });
        throw error;
      }
    });
  },

  compareReturnedFile() {
    if (!this._sample || !this._exportAttempted || !this.data.canChoose) return;
    return this.run(async () => {
      this._comparison = null;
      this.update({ compareOk: false, compareStatus: "正在重新选入文件" });
      try {
        const data = await this._files.choose();
        const digest = sha256(data);
        const matches = equalBytes(this._sample.data, data);
        this._comparison = { matches, sha256: digest, bytes: data.length, checkedAt: new Date().toISOString() };
        this.update({
          compareOk: matches,
          compareStatus: matches ? "重新选入文件与原样本完整字节一致" : "文件字节不同，当前交付链路未通过",
          notice: matches ? "本次重新选入比较通过。请确认选的是导出后收到的文件；本次仅核对文件完整性。" : "请确认选中的是刚导出的文件，并始终按文件接收；不要另存图片或截图。",
        });
      } catch (error) {
        this.update({ compareStatus: cancelled(error) ? "已取消重新选入，尚未完成比较" : "重新选入失败，尚未完成比较" });
        throw error;
      }
    });
  },

  toggleDetails() { this.setData({ detailsOpen: !this.data.detailsOpen }); },

  async reset() {
    if (this._locked) return;
    return this.run(async () => {
      const sample = this._sample;
      this._sample = null;
      this._comparison = null;
      this._exportAttempted = false;
      this.update({ hasSample: false, previewPath: "", fingerprint: "", compareOk: false, localStatus: "待准备文件", exportStatus: "尚未导出", exportError: "", compareStatus: "尚未重新选入文件" });
      if (sample) await this._files.remove(sample.record.path);
    });
  },
});
