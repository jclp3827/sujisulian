const { createProcessor } = require("../core/process");
const { equalBytes } = require("../core/bytes");
const { profiles, getProfile, defaultProfileId } = require("../profiles/index");
const { photoErrorText: errorText, isCancel } = require("../platform/errors");
const { prepareInput } = require("../platform/input");
const { TERMS } = require("../platform/preview-paid");
const gestureCrop = require("../platform/crop-gesture");
const { prepareCloudJpeg } = require("../platform/cloud-work");
const { packJpg } = require("../core/zip-store");


function createController(wx, adapters, Date) {
const { createFiles, call, createRaster, createPreviewPaid } = adapters;
const supports = (name) => typeof wx[name] === "function" && (!wx.canIUse || wx.canIUse(name));
const fileSize = value => (value / 1024).toFixed(1) + " KB（" + value + " 字节）";

return {
  data: {
    touchActive: false, fineAdjustOpen: false, previewWidth: 230, previewHeight: 322,
    allowed: false, ready: false, canvasReady: false, busy: false, pickerOpen: false,
    canAlbum: false, canChoose: false, canShare: false,
    hasSource: false, sourceLabel: "", zoom: 100, maxZoom: 100, cropX: 50, cropY: 50,
    contentConfirmed: false, resultReady: false, resultPath: "", resultLabel: "", resultDisplayLabel: "", resultDimensions: "", resultSizeLabel: "", resultCompliance: "", resultHash: "",
    exportStatus: "尚未导出", exportError: "", exportTone: "", exportSucceeded: false, zipReady: false, zipError: "", compareStatus: "尚未比较导出后的文件", compareOk: false,
    notice: "", detailsOpen: false, diagnosticsEnabled: false, requirementsOpen: false, exportGuideOpen: false, exportGuideDestination: "", exportGuideRevision: 0, stage: "select", phaseLabel: "", workspaceScrollTop: 0,
    normalizationMs: null, preparationMs: null, inputLabel: "", inputTimingsLabel: "", sourceInputPath: "", aiAvailable: false, canRecoverAi: false, background: "original", aiModeSelected: false, hasAiOrder: false, aiOrderId: "", aiReady: false, aiRestored: false, aiStatus: "", canRefundAi: false,
    generationMs: null, encodingMs: null, aiRemaining: 3, aiPaid: false, paymentPending: false, aiExportLocked: false,
    scfTestConfigured: false, scfTestStatus: "", scfRequestId: "",
    profileId: "", profileLabel: "", profileIndex: 0, profileOptions: profiles.map((profile) => profile.label),
    sourceHint: "", contentConfirmation: "", compatibilityNote: "",
  },

  async onLoad(options) {
    this._alive = true; this._locked = false; this._revision = 0;
    this.sizePreview();
    let env = "";
    try { env = wx.getAccountInfoSync().miniProgram.envVersion; } catch (_) {}
    const allowed = true;
    this.setData({ allowed, diagnosticsEnabled: (env === "develop" || env === "trial") && !!options && options.diagnostics === "1",
      canAlbum: supports("chooseMedia") || supports("chooseImage"), canChoose: supports("chooseMessageFile"), canShare: supports("shareFileMessage") });
    if (!allowed) return;
    this._preview = createPreviewPaid(wx);
    try { if (typeof wx.setEnableDebug === "function") wx.setEnableDebug({ enableDebug: false }); } catch (_) {}
    this.refreshAiInfo();
    try { this.applyProfile(options && options.profile !== undefined ? options.profile : defaultProfileId); }
    catch (error) { this.update({ allowed: false, notice: errorText(error) }); return; }
    this._raster = createRaster(wx, this);
    await this.run(async () => {
      this._files = createFiles(wx, "process-v1");
      await this._files.init();
      this.update({ ready: true });
    });
    // Optional service discovery must never hold the free photo workflow busy.
    this._preview.available().then(async aiAvailable => {
      this.update({ aiAvailable }); this.refreshAiInfo();
      if (aiAvailable && this._preview.summary().paymentPending) {
        const paid = await this._preview.status(); this.refreshAiInfo();
        this.update({ aiStatus: paid.deliveryPending ? "付款已确认，发货确认中；可稍后再次确认状态，无需付款" : paid.payment === "paid" ? "付款已确认，已恢复处理和导出权益" :
          paid.payment === "refunded" ? "本次付款权益已失效" : "原订单尚未确认，不会再次发起付款" });
      }
    }).catch(() => {});
  },

  async onReady() {
    if (!this.data.allowed || !this._raster) return;
    try { await this._raster.init(); this.update({ canvasReady: true }); }
    catch (error) { this.update({ notice: errorText(error, "照片预览暂时无法打开，请重新进入照片页面。") }); }
  },

  onUnload() {
    this.hideInputLoading();
    this._gesture = null; this._gestureDraft = null;
    this._alive = false; this._revision++;
    this._scfToken = null;
    if (this._scfTest) this._scfTest.dispose();
    this._source = null; this._candidate = null;
    if (this._raster) this._raster.dispose();
    if (this._files) this._files.dispose();
  },

  openPhotoOrders() { wx.navigateTo({ url: "/pages/photo-orders/index" }); },

  update(value) {
    if (!this._alive) return;
    if (value.resultReady !== undefined || value.hasSource !== undefined) {
      const next = Object.assign({}, this.data, value);
      value.stage = next.resultReady ? "result" : next.hasSource ? "adjust" : "select";
    }
    const stageChanged = value.stage && value.stage !== this.data.stage;
    if (stageChanged) { value.requirementsOpen = false; value.exportGuideOpen = false; }
    const revealFeedback = value.notice || value.exportError || value.exportTone;
    if (stageChanged || revealFeedback) {
      // Reset the bounded content area, including repeated errors in the same stage.
      value.workspaceScrollTop = this._workspaceScrollTop || 0;
      this.setData(value, () => {
        if (!this._alive) return;
        this._workspaceScrollTop = 0;
        this.setData({ workspaceScrollTop: 0 });
      });
    } else this.setData(value);
    if ((stageChanged || revealFeedback) && typeof wx.pageScrollTo === "function") wx.pageScrollTo({ scrollTop: 0, duration: 0 });
  },
  onWorkspaceScroll(event) { this._workspaceScrollTop = event.detail.scrollTop; },

  sizePreview() {
    let window = { windowWidth: 375, windowHeight: 667 };
    try { window = typeof wx.getWindowInfo === "function" ? wx.getWindowInfo() : wx.getSystemInfoSync(); } catch (_) {}
    const height = Math.min(280, window.windowHeight * 0.34, (window.windowWidth - 88) * 413 / 295);
    this.setData({ previewWidth: height * 295 / 413, previewHeight: height });
  },
  onResize() { this.endCropTouch(); this.sizePreview(); },
  toggleFineAdjust() { this.update({ fineAdjustOpen: !this.data.fineAdjustOpen }); },

  cropState() { return { zoom: this.data.zoom, cropX: this.data.cropX, cropY: this.data.cropY }; },
  drawCrop(state) {
    const rect = this._processor.cropRect(this._source.info.width, this._source.info.height,
      { zoom: state.zoom / 100, x: state.cropX / 100, y: state.cropY / 100 });
    this._raster.draw(rect);
  },
  startCropTouch(event) {
    if (!this._source || this._locked || this.data.stage !== "adjust") return;
    this.flushCropTouch();
    this._gesture = gestureCrop.begin(event.touches, this.cropState(),
      { width: this.data.previewWidth, height: this.data.previewHeight }, this._processor, this._source.info);
    if (this._gesture) this.update({ touchActive: true });
    else this.update({ fineAdjustOpen: true, notice: "当前设备请使用精细调整构图。" });
  },
  moveCropTouch(event) {
    if (!this._gesture || !this._source || this._locked) return;
    const next = gestureCrop.move(this._gesture, event.touches, this._processor, this._source.info, this.data.maxZoom);
    if (!next) return;
    if (next.rebase) { this.startCropTouch(event); return; }
    this._gestureDraft = next;
    if (this._gestureFrame) return;
    this._gestureFrame = true;
    const draw = () => { this._gestureFrame = false; if (this._alive) this.flushCropTouch(); };
    if (this._raster.requestFrame) this._raster.requestFrame(draw); else draw();
  },
  flushCropTouch() {
    const next = this._gestureDraft; this._gestureDraft = null;
    if (!next || !this._source || !this._alive) return;
    if (Object.keys(next).every(k => Math.abs(next[k] - this.data[k]) < 0.0001)) return;
    // Invalidation is synchronous before its file-cleanup await. Do it only on
    // actual movement, once per generated result, never once per touch frame.
    if (this._candidate) this.invalidateCandidate().catch(() => this.update({ notice: "旧照片副本清理未完成，退出页面后会再次清理。" }));
    this.drawCrop(next);
    this.update(Object.assign({}, next, { contentConfirmed: false }));
  },
  endCropTouch(event) {
    this.flushCropTouch(); this._gesture = null;
    this.update({ touchActive: false });
    if (event && event.type !== "touchcancel" && event.touches && event.touches.length) this.startCropTouch(event);
  },
  resetCrop() {
    if (!this._source) return;
    return this.run(async () => {
      if (this.data.zoom === 100 && this.data.cropX === 50 && this.data.cropY === 50) return;
      await this.invalidateCandidate();
      const next = { zoom: 100, cropX: 50, cropY: 50 };
      this.drawCrop(next); this.update(Object.assign(next, { contentConfirmed: false }));
    });
  },

  applyProfile(id) {
    const profile = getProfile(id);
    this._processor = createProcessor(id);
    this.update({ profileId: id, profileIndex: profiles.indexOf(profile), profileLabel: profile.label,
      sourceHint: profile.sourceHint, contentConfirmation: profile.contentConfirmation, compatibilityNote: profile.compatibilityNote });
  },

  selectProfile(event) {
    const index = Number(event.detail.value);
    if (!Number.isInteger(index) || !profiles[index] || profiles[index].id === this.data.profileId) return;
    return this.run(async () => {
      // Different input rules and trailers require a fresh source and confirmation.
      await this.clearSource();
      if (this._alive) this.applyProfile(profiles[index].id);
    });
  },

  async run(action) {
    if (!this._alive || this._locked || this.data.touchActive || !this.data.allowed) return;
    this._locked = true; this.update({ busy: true, notice: "" });
    try { await action(); }
    catch (error) { if (!isCancel(error)) this.update({ notice: errorText(error, "本次操作未完成，请返回照片页面后再试。") }); }
    finally { this._locked = false; this.refreshAiInfo(); this.update({ busy: false, phaseLabel: "" }); }
  },

  async invalidateCandidate() {
    this._revision++;
    const old = this._candidate;
    this._candidate = null;
    this.update({ resultReady: false, resultPath: "", resultLabel: "", resultDisplayLabel: "", resultDimensions: "", resultSizeLabel: "", resultCompliance: "", resultHash: "", generationMs: null, encodingMs: null, exportStatus: "尚未导出", exportError: "", exportTone: "", exportSucceeded: false, zipReady: false, zipError: "", exportGuideOpen: false, compareOk: false, compareStatus: "尚未比较导出后的文件" });
    if (old) await this._files.remove(old.record.path);
    if (old && old.previewRecord) await this._files.remove(old.previewRecord.path);
    if (old && old.zipRecord) await this._files.remove(old.zipRecord.path);
  },

  async loadSource(data, input) {
    await this.invalidateCandidate();
    const previous = this._source;
    this._source = null;
    this._raster.clear();
    this.update({ hasSource: false, contentConfirmed: false, sourceLabel: "", zoom: 100, cropX: 50, cropY: 50 });
    if (previous) await this._files.remove(previous.record.path);
    const info = this._processor.inspectSource(data, { nativeNormalized: !!input && input.path === "wechat-native" });
    const record = await this._files.writeVerified(data, "jpg");
    try {
      await this._raster.load(record.path, info);
      const rect = this._processor.cropRect(info.width, info.height);
      this._raster.draw(rect);
      if (!this._alive) throw new Error("页面已关闭");
      this._source = { info, record, input: input || { path: "direct" } };
      const profile = this._processor.profile;
      const maxZoom = Math.min(300, Math.floor(Math.min(info.width / profile.width, info.height / profile.height) * 100));
      const inputLabel = input && input.sourceBytes ? "微信提供的 " + String(input.sourceType).toUpperCase() + " · " + input.sourceWidth + "×" + input.sourceHeight + " 像素 · " + fileSize(input.sourceBytes) : "";
      this.update({ hasSource: true, inputLabel, sourceLabel: "本地工作图 JPG · " + info.width + "×" + info.height + " 像素 · " + fileSize(data.length), maxZoom,
        normalizationMs: input ? input.normalizationMs : 0, sourceInputPath: input ? input.path : "direct" });
    } catch (error) {
      await this._files.remove(record.path);
      if (this._alive) this._raster.clear();
      throw error;
    }
  },

  chooseAlbum() {
    if (!this.data.ready || !this.data.canvasReady || !this.data.canAlbum) return;
    return this.run(() => this.importSelected(true));
  },

  chooseFile() {
    if (!this.data.ready || !this.data.canvasReady || !this.data.canChoose) return;
    return this.run(() => this.importSelected(false));
  },

  async importSelected(album) {
    // Keep the legacy byte entry for deterministic core regression fixtures.
    if (!this._files.choosePath) return this.loadSource(await (album ? this._files.choosePhoto() : this._files.choose()));
    let path;
    this.update({ pickerOpen: true, phaseLabel: album ? "正在打开相册，请选择照片" : "正在打开聊天文件" });
    try { path = await this._files.choosePath(album); }
    finally { this.update({ pickerOpen: false }); }
    return this.loadSourcePath(path);
  },

  cancelPhotoSelection() {
    if (this.data.pickerOpen && this._files && this._files.cancelSelection) this._files.cancelSelection();
  },

  async loadSourcePath(path) {
    if (!await this.confirmDiscard()) return;
    const started = Date.now();
    this.showInputLoading("正在准备照片");
    try {
      // Yield after returning from the picker so loading feedback can render
      // before bounded but synchronous structural checks and hashing begin.
      if (typeof wx.nextTick === "function") await new Promise(resolve => wx.nextTick(resolve));
      const input = await prepareInput(wx, this._files, this._raster, this._processor, path, label => this.showInputLoading(label));
      await this.clearSource();
      this.showInputLoading("正在显示照片");
      const displayStarted = Date.now();
      await this.loadSource(input.data, Object.assign({}, input, { data: undefined }));
      input.timings.displayMs = Date.now() - displayStarted;
      input.timings.totalMs = Date.now() - started;
      this._source.input.timings = input.timings;
      this.update({ preparationMs: input.timings.totalMs,
        inputTimingsLabel: "读取 " + input.timings.readMs + " / 副本校验 " + input.timings.verifiedCopyMs + " / 结构检查 " + input.timings.inspectMs + " / 微信图像信息 " + input.timings.imageInfoMs + " / 标准化 " + input.normalizationMs + " / 显示 " + input.timings.displayMs + " ms" });
    } finally { this.hideInputLoading(); }
  },

  showInputLoading(label) {
    if (!this._alive) return;
    this.update({ phaseLabel: label });
    if (typeof wx.showLoading === "function") {
      this._inputLoading = true;
      try { wx.showLoading({ title: label, mask: true }); } catch (_) {}
    }
  },

  hideInputLoading() {
    if (!this._inputLoading) return;
    this._inputLoading = false;
    if (typeof wx.hideLoading === "function") { try { wx.hideLoading(); } catch (_) {} }
  },

  adjustCrop(event) {
    if (!this._source || this._locked) return;
    const field = event.currentTarget.dataset.field;
    if (["zoom", "cropX", "cropY"].indexOf(field) === -1) return;
    const next = Object.assign({}, this.data, { [field]: Number(event.detail.value) });
    if (next[field] === this.data[field]) return;
    return this.run(async () => {
      const rect = this._processor.cropRect(this._source.info.width, this._source.info.height, { zoom: next.zoom / 100, x: next.cropX / 100, y: next.cropY / 100 });
      await this.invalidateCandidate();
      if (!this._alive) return;
      this._raster.draw(rect);
      this.update({ [field]: next[field], contentConfirmed: false });
    });
  },

  confirmContent(event) {
    if (!this._source) return;
    const confirmed = Array.isArray(event.detail.value) && event.detail.value.indexOf("confirmed") !== -1;
    // Respect a withdrawn confirmation even while file IO is still in flight.
    if (!confirmed && this._locked) {
      this.update({ contentConfirmed: false });
      return this.invalidateCandidate();
    }
    if (this._locked) return;
    return this.run(async () => {
      await this.invalidateCandidate();
      this.update({ contentConfirmed: confirmed });
    });
  },

  async confirmAndGenerate() {
    if (!this._source || this._locked || this._confirmingGenerate) return;
    this._confirmingGenerate = true;
    const sourcePath = this._source.record.path;
    const revision = this._revision;
    try {
      const aiOutput = this.data.aiModeSelected && this.data.aiReady;
      const answer = await call(wx, "showModal", {
        title: "确认生成",
        content: aiOutput ? "请确认人物轮廓、背景和构图。生成后请查看照片，再按指引保存文件。" : "请确认是本人照片，背景和构图合适。生成后请查看照片，再按指引保存文件。",
        confirmText: "确认生成",
        cancelText: "继续调整",
      });
      if (!answer.confirm) return;
      if (!this._alive || !this._source || this._source.record.path !== sourcePath || this._revision !== revision) {
        this.update({ notice: "照片已改变，请重新确认后生成" });
        return;
      }
      this.update({ contentConfirmed: true });
      await this.generate();
    } finally { this._confirmingGenerate = false; }
  },

  generate() {
    if (!this._source || !this.data.contentConfirmed) {
      this.update({ notice: "请先导入原图，并确认背景、人像和构图符合目标要求" });
      return;
    }
    return this.run(async () => {
      const started = Date.now();
      this.update({ phaseLabel: "正在生成报名文件" });
      await this.invalidateCandidate();
      const revision = this._revision;
      const processor = this._processor;
      const profile = processor.profile;
      this.drawCrop(this.cropState());
      const encodingStarted = Date.now();
      const generated = processor.createCandidate(this._raster.pixels(), this.data.contentConfirmed);
      const encodingMs = Date.now() - encodingStarted;
      const record = await this._files.writeVerified(generated.data, "jpg");
      let previewRecord, zipRecord, zipError = "";
      try {
        processor.verifyCandidate(await this._files.read(record.path));
        const decoded = await call(wx, "getImageInfo", { src: record.path });
        if (decoded.width !== profile.width || decoded.height !== profile.height || ["jpeg", "jpg"].indexOf(decoded.type) === -1) throw new Error("候选照片无法正确解码，已停止导出");
        if (!this._alive || revision !== this._revision) throw new Error("输入已经改变，请重新生成");
        previewRecord = await this._files.writeVerified(generated.data, "jpg");
        if (!this._alive || revision !== this._revision) throw new Error("输入已经改变，请重新生成");
        try { zipRecord = await this._files.writeVerified(packJpg(generated.data, "报名照片.jpg"), "zip"); }
        catch (_) { zipError = "ZIP 暂不可用，请使用 JPG 文件导出"; }
        if (!this._alive || revision !== this._revision) throw new Error("输入已经改变，请重新生成");
        this._candidate = { record, previewRecord, zipRecord, generated, revision, aiResult: this._ai && (this.data.background !== "original" || this.data.aiRestored) ? this._ai.preview : null };
        this.update({ resultReady: true, resultPath: previewRecord.path, resultLabel: decoded.width + "×" + decoded.height + " 像素 · " + fileSize(record.bytes),
          resultDisplayLabel: decoded.width + " × " + decoded.height + " 像素 · " + (record.bytes / 1024).toFixed(1) + " KB",
          resultDimensions: decoded.width + " × " + decoded.height, resultSizeLabel: (record.bytes / 1024).toFixed(1) + " KB", resultCompliance: "照片已生成，文件已检查", resultHash: record.sha256, zipReady: !!zipRecord, zipError,
          generationMs: Date.now() - started, encodingMs });
        this.refreshAiInfo();
      } catch (error) { await this._files.remove(record.path); if (previewRecord) await this._files.remove(previewRecord.path); if (zipRecord) await this._files.remove(zipRecord.path); throw error; }
    });
  },

  exportCandidate() { return this.deliverCandidate("file"); },
  exportZipCandidate() { return this.deliverCandidate("zip"); },

  openJpgGuide() { return this.prepareExportGuide("file"); },
  openZipGuide() { return this.prepareExportGuide("zip"); },
  prepareExportGuide(destination) {
    const candidate = this._candidate;
    if (!candidate || !this.data.contentConfirmed || !this.data.canShare || (destination === "zip" && !candidate.zipRecord)) return;
    return this.run(async () => {
      if (candidate.revision !== this._revision) throw new Error("照片已改变，请重新生成");
      if (candidate.aiResult) {
        let authorized = await this._preview.authorizeExport(candidate.aiResult);
        if (!authorized) {
          if (!await this.purchaseAi(candidate.aiResult)) return;
          authorized = await this._preview.authorizeExport(candidate.aiResult);
          if (!authorized) throw new Error("付款尚未确认，请稍后查看付款状态");
        }
        this.refreshAiInfo();
      }
      if (!this._alive || !this._candidate || this._candidate.revision !== candidate.revision) return;
      this.update({ exportGuideOpen: true, exportGuideDestination: destination, exportGuideRevision: candidate.revision });
    });
  },
  closeExportGuide() { this.update({ exportGuideOpen: false }); },
  confirmExportGuide() {
    const candidate = this._candidate, destination = this.data.exportGuideDestination;
    if (!this.data.exportGuideOpen || !candidate || candidate.revision !== this.data.exportGuideRevision) return;
    this.update({ exportGuideOpen: false });
    if (candidate.aiResult && !this._preview.hasEntitlement(candidate.aiResult)) {
      this.update({ notice: "导出权益尚未确认，请重新点击获取文件" });
      return;
    }
    return this.deliverCandidate(destination, true);
  },

  deliverCandidate(destination, preauthorized) {
    if (!this._candidate || !this.data.contentConfirmed || !this.data.canShare || (destination === "zip" && !this._candidate.zipRecord)) return;
    return this.run(async () => {
      const candidate = this._candidate;
      if (candidate.revision !== this._revision || candidate.generated.profileId !== this._processor.profile.id) throw new Error("输入已改变，请重新生成");
      if (candidate.aiResult && !preauthorized) {
        const authorized = await this._preview.authorizeExport(candidate.aiResult);
        if (!authorized) {
          if (!await this.purchaseAi(candidate.aiResult)) return;
          if (!await this._preview.authorizeExport(candidate.aiResult)) throw new Error("付款尚未确认，请稍后查看付款状态");
        }
        if (!this._alive || candidate.revision !== this._revision) return;
        this.refreshAiInfo();
      }
      this.update({ exportSucceeded: !!candidate.jpgSent, exportStatus: "正在打开文件导出", exportError: "", exportTone: "", compareOk: false, compareStatus: "尚未比较导出后的文件" });
      try {
        const stillCurrent = () => this._alive && this._candidate && this._candidate.revision === candidate.revision && candidate.revision === this._revision && this.data.contentConfirmed;
        if (destination === "zip") {
          await this._files.share(candidate.zipRecord, "报名照片.zip", stillCurrent);
        } else {
          // The share adapter re-reads and hashes the complete verified output synchronously.
          // Compare stable revisions rather than JS object identity across runtime wrappers.
          const exportFileName = this._processor.profile.exportFileName || this._processor.profile.exportPrefix + "-" + candidate.generated.info.width + "x" + candidate.generated.info.height + "-" + candidate.record.sha256.slice(0, 8) + ".jpg";
          await this._files.share(candidate.record, exportFileName, stillCurrent);
        }
        if (!this._alive || !this._candidate || this._candidate.revision !== candidate.revision || candidate.revision !== this._revision) return;
        this._candidate = Object.assign({}, this._candidate, { sent: true, jpgSent: destination === "file" || !!candidate.jpgSent, zipSent: destination === "zip" || !!candidate.zipSent });
        if (candidate.aiResult && this._ai) this._ai = Object.assign({}, this._ai, { sent: true });
        this.update({ exportSucceeded: destination === "file" || !!candidate.jpgSent, exportStatus: destination === "zip" ? "ZIP 文件已发送；请保存到手机「文件」，解压后使用其中的 JPG" : "JPG 文件已发送；请打开接收会话中的文件卡片，保存到手机「文件」", exportError: "", exportTone: "success" });
      } catch (error) {
        const cancelled = isCancel(error);
        const status = cancelled ? (candidate.sent ? "本次发送已取消，之前发送的文件仍可下载" : "已取消导出") : candidate.sent ? "本次发送未完成，之前发送的文件仍可下载" : errorText(error, "本次文件导出未完成，请稍后再试。");
        this.update({ exportSucceeded: !!candidate.jpgSent, exportStatus: status, exportError: cancelled ? "" : status, exportTone: cancelled ? "neutral" : "error" });
      }
    });
  },

  compareReturned() {
    if (!this._candidate || !this.data.exportSucceeded || !this.data.canChoose) return;
    return this.run(async () => {
      this.update({ compareOk: false, compareStatus: "正在比较" });
      try {
        const data = await this._files.choose();
        const matches = equalBytes(data, this._candidate.generated.data);
        this.update({ compareOk: matches, compareStatus: matches ? "重新选入文件与候选文件完整字节一致" : "文件字节不同，请确认选择了刚导出的 JPG 原文件" });
      } catch (error) {
        this.update({ compareStatus: isCancel(error) ? "已取消比较" : "比较未完成" });
        throw error;
      }
    });
  },

  async clearSource() {
    this._gesture = null; this._gestureDraft = null;
    await this.invalidateCandidate();
    const source = this._source; this._source = null;
    const ai = this._ai, work = this._aiWork; this._ai = null; this._aiWork = null;
    this._raster.clear();
    this.update({ hasSource: false, contentConfirmed: false, sourceLabel: "", inputLabel: "", inputTimingsLabel: "", preparationMs: null, zoom: 100, maxZoom: 100, cropX: 50, cropY: 50, detailsOpen: false, normalizationMs: null, sourceInputPath: "", background: "original", aiModeSelected: false, aiReady: false, aiRestored: false, scfTestStatus: "", scfRequestId: "" });
    if (source) await this._files.remove(source.record.path);
    if (ai) await this._files.remove(ai.record.path);
    if (work) await this._files.remove(work.record.path);
  },

  chooseOriginalBackground() {
    if (!this._source || this._locked || this.data.aiRestored) return;
    if (this._ai) return this.changeBackground({ currentTarget: { dataset: { background: "original" } } });
    this.update({ background: "original", aiModeSelected: false, contentConfirmed: false });
  },

  selectAiBackgroundMode() {
    if (!this._source || this._locked || (!this.data.aiReady && !this.data.aiAvailable) || this.data.aiModeSelected) return;
    if (this._ai) return this.changeBackground({ currentTarget: { dataset: { background: "white" } } });
    this.update({ aiModeSelected: true, contentConfirmed: false });
  },

  refreshAiInfo() {
    if (!this._preview) return;
    try {
      const info = this._preview.summary();
      const result = this._candidate && this._candidate.aiResult;
      this.update({ aiRemaining: info.remaining, aiPaid: info.paid, paymentPending: info.paymentPending,
        paymentFeedbackAvailable: typeof this._preview.evidence === "function" && this._preview.evidence().some(event => event.phase.startsWith("payment-")),
        aiExportLocked: !!result && !this._preview.hasEntitlement(result) });
    } catch (_) { this.update({ aiAvailable: false }); }
  },

  async purchaseAi(result) {
    const consent = await call(wx, "showModal", { title: result ? "解锁 AI 导出" : "购买 AI 处理机会", confirmText: "确认支付", cancelText: "再看看",
      content: (result ? "支付 ¥1 解锁当前 AI 结果导出，并再获得 3 次 AI 处理机会；这 3 次生成的结果也可导出。" : "支付 ¥1 获得 3 次 AI 处理机会，以及这 3 次生成结果的导出权益。") + "切换背景和调整裁剪不扣次数。权益保存在本机，清除小程序数据或换设备无法自动恢复。" });
    if (!consent.confirm) return false;
    const paid = await this._preview.buy(result, phaseLabel => this.update({ phaseLabel }));
    this.refreshAiInfo();
    this.update({ aiStatus: paid.deliveryPending ? "付款已确认，发货确认中；可稍后再次确认状态，无需付款" : paid.payment === "paid" ? "已解锁，可继续处理和导出" : paid.cancelled ? "已取消付款，预览可以继续查看" : paid.payment === "unpaid" || paid.payment === "closed" ? "尚未付款，预览可以继续查看" : paid.payment === "refunded" ? "本次付款权益已失效，可继续免费处理" : "付款结果暂未确认，请稍后确认付款状态" });
    return paid.payment === "paid";
  },

  chooseAiBackground() {
    if (!this._source || this._locked) return;
    if (this._ai) return this.changeBackground({ currentTarget: { dataset: { background: "white" } } });
    if (!this.data.aiAvailable) return;
    this.update({ aiModeSelected: true, contentConfirmed: false });
    return this.run(async () => {
      const sourceHash = this._source.record.sha256;
      const consent = await call(wx, "showModal", { title: "生成 AI 预览", confirmText: "开始预览", cancelText: "免费处理",
        content: "照片将发送至腾讯云处理。AI 换背景会产生云端处理费用，试用后需付费使用。" });
      if (!consent.confirm) return;
      if (typeof wx.requirePrivacyAuthorize === "function") await call(wx, "requirePrivacyAuthorize", {});
      const work = await this.prepareAiWork();
      let record;
      try {
        let result;
        try { result = await this._preview.preview(work, phaseLabel => this.update({ phaseLabel })); }
        catch (error) {
          if (error.code !== "NO_USES") throw error;
          if (!await this.purchaseAi(null)) return;
          result = await this._preview.preview(work, phaseLabel => this.update({ phaseLabel }));
        }
        this.refreshAiInfo();
        try { record = await this._preview.download(result, this._files, phaseLabel => this.update({ phaseLabel })); }
        catch (error) {
          if (error.code === "RESULT_EXPIRED" && typeof this._preview.releaseExpired === "function") this._preview.releaseExpired(result);
          throw error;
        }
        if (!this._alive || !this._source || this._source.record.sha256 !== sourceHash) return;
        await this._raster.setForeground(record.path, result.result);
        if (!this._alive || !this._source || this._source.record.sha256 !== sourceHash) return;
        if (this._ai) await this._files.remove(this._ai.record.path);
        this._ai = { record, preview: result };
        this._raster.setBackground("white");
        await this.invalidateCandidate();
        this._raster.draw(this._processor.cropRect(this._source.info.width, this._source.info.height, { zoom: this.data.zoom / 100, x: this.data.cropX / 100, y: this.data.cropY / 100 }));
        this.update({ aiReady: true, aiRestored: false, background: "white", aiModeSelected: true, contentConfirmed: false,
          aiStatus: this._preview.hasEntitlement(result) ? "可调整背景和构图后导出" : "可先调整背景和构图，满意后再付费导出" });
      } finally {
        this.refreshAiInfo();
        if (record && (!this._ai || this._ai.record.path !== record.path)) await this._files.remove(record.path);
      }
    });
  },

  restoreAiOrder() {
    return this.run(async () => {
      this.update({ phaseLabel: "正在确认付款状态" });
      const paid = await this._preview.status(); this.refreshAiInfo();
      this.update({ aiStatus: paid.deliveryPending ? "付款已确认，发货确认中；可稍后再次确认状态，无需付款" : paid.payment === "paid" ? "付款已确认，已解锁相应结果导出和处理机会" : paid.payment === "unpaid" || paid.payment === "closed" ? "尚未完成付款，可以继续查看预览" : paid.payment === "refunded" ? "本次付款权益已失效，可继续免费处理" : "付款结果暂未确认，请稍后再查看" });
    });
  },

  copyPaymentFeedback() {
    if (!this.data.diagnosticsEnabled) return;
    return this.run(async () => {
      const events = this._preview.evidence();
      if (!events.length) { this.update({ notice: "暂时没有付款记录" }); return; }
      await call(wx, "setClipboardData", { data: JSON.stringify({ flow: "preview-export-v1", events }) });
      this.update({ notice: "问题信息已复制，可粘贴给开发者；不包含照片和支付密钥" });
    });
  },

  async prepareAiWork() {
    const sourceHash = this._source.record.sha256;
    if (this._aiWork && this._aiWork.sourceHash === sourceHash) return this._aiWork.record;
    this.update({ phaseLabel: "正在准备照片" });
    this._cloudWorkCheck = { phase: "preparing" };
    const path = await this._raster.normalize(this._source.record.path, this._source.info, 1000, { exactSize: true });
    try {
      // This file has already been decoded/drawn/re-encoded by the native canvas.
      // Its cloud limits differ from the original exam-photo import limits.
      const { data, info, exportInfo } = prepareCloudJpeg(await this._files.read(path), this._source.info);
      this._cloudWorkCheck = Object.assign({ phase: "ready", exifRemoved: exportInfo.hasExif }, exportInfo);
      const record = await this._files.writeVerified(data, "jpg");
      if (!this._alive || !this._source || this._source.record.sha256 !== sourceHash) {
        await this._files.remove(record.path); throw new Error("当前照片已改变，请重新准备");
      }
      if (this._aiWork) await this._files.remove(this._aiWork.record.path);
      this._aiWork = { record: Object.assign(record, { width: info.width, height: info.height }), sourceHash };
      return this._aiWork.record;
    } catch (error) {
      this._cloudWorkCheck = Object.assign({ phase: "rejected", code: error.code || "CLOUD_WORK_FAILED" }, error.cloudWork || {});
      throw error;
    } finally { try { await call(wx.getFileSystemManager(), "unlink", { filePath: path }); } catch (_) {} }
  },

  changeBackground(event) {
    const value = event.currentTarget.dataset.background;
    if (!this._ai || (value === "original" && this.data.aiRestored)) return;
    if (value === this.data.background) {
      this.update({ aiModeSelected: value !== "original", contentConfirmed: false });
      return;
    }
    return this.run(async () => {
      this._raster.setBackground(value);
      await this.invalidateCandidate();
      this._raster.draw(this._processor.cropRect(this._source.info.width, this._source.info.height, { zoom: this.data.zoom / 100, x: this.data.cropX / 100, y: this.data.cropY / 100 }));
      this.update({ background: value, aiModeSelected: value !== "original", contentConfirmed: false });
    });
  },

  async confirmDiscard() {
    const unsent = (this._candidate && !this._candidate.sent) || (this._ai && !this._ai.sent);
    if (!unsent) return true;
    const answer = await call(wx, "showModal", { title: "更换照片？", content: "当前未导出的照片结果将被清理，无法找回。可先取消并导出；剩余处理机会和已购权益不受影响。", confirmText: "更换照片", cancelText: "保留结果" });
    return answer.confirm;
  },
  reset() {
    return this.run(async () => { if (await this.confirmDiscard()) await this.clearSource(); });
  },

  backToAdjust() { return this.run(async () => { this.update({ resultReady: false }); }); },
  holdRequirements() {},
  showRequirements() { this.update({ requirementsOpen: !this.data.requirementsOpen }); },
  toggleDetails() { if (this.data.diagnosticsEnabled) this.setData({ detailsOpen: !this.data.detailsOpen }); },
};
}
module.exports = { createController };
