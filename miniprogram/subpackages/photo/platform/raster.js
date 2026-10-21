const { call } = require("./files");
const profile = require("../profiles/jpeg-q40");

function createRaster(wxApi, page) {
  let canvas, context, image, foreground, foregroundInfo, sourceInfo, background = "original", disposed = false;

  function init() {
    return new Promise((resolve, reject) => {
      wxApi.createSelectorQuery().in(page).select("#photoCanvas").fields({ node: true, size: true }).exec((list) => {
        if (disposed) return reject(new Error("页面已关闭"));
        if (!list || !list[0] || !list[0].node) return reject(new Error("当前环境未能创建画布，请更新微信后重试"));
        canvas = list[0].node;
        canvas.width = profile.width;
        canvas.height = profile.height;
        context = canvas.getContext("2d");
        resolve();
      });
    });
  }

  async function load(path, expected) {
    if (disposed || !canvas) throw new Error("画布未就绪");
    const info = await call(wxApi, "getImageInfo", { src: path });
    if (info.type !== "jpeg" && info.type !== "jpg") throw new Error("请使用 JPG 原图");
    if ((info.orientation && info.orientation !== "up") || info.width !== expected.width || info.height !== expected.height) throw new Error("图片解码方向与原图不一致，请先转正另存为 JPG");
    const nextImage = canvas.createImage();
    await new Promise((resolve, reject) => {
      nextImage.onload = () => { nextImage.onload = null; nextImage.onerror = null; resolve(); };
      nextImage.onerror = () => { nextImage.onload = null; nextImage.onerror = null; reject(new Error("照片无法解码，请更换 JPG 原图")); };
      nextImage.src = path;
    });
    if (disposed) throw new Error("页面已关闭");
    image = nextImage;
    sourceInfo = expected;
  }

  function draw(rect) {
    if (disposed || !image) throw new Error("原图未就绪");
    context.clearRect(0, 0, profile.width, profile.height);
    context.fillStyle = background === "blue" ? "#438edb" : "#ffffff";
    context.fillRect(0, 0, profile.width, profile.height);
    if (foreground && background !== "original") {
      const sx = foregroundInfo.width / sourceInfo.width, sy = foregroundInfo.height / sourceInfo.height;
      context.drawImage(foreground, rect.x * sx, rect.y * sy, rect.width * sx, rect.height * sy, 0, 0, profile.width, profile.height);
    } else context.drawImage(image, rect.x, rect.y, rect.width, rect.height, 0, 0, profile.width, profile.height);
  }

  function pixels() {
    if (disposed || !image) throw new Error("原图未就绪");
    return context.getImageData(0, 0, profile.width, profile.height).data;
  }

  async function normalize(path, info, edge, options) {
    if (disposed) throw new Error("页面已关闭");
    const scratch = await new Promise((resolve, reject) => {
      wxApi.createSelectorQuery().in(page).select("#inputCanvas").fields({ node: true }).exec(list => {
        if (!list || !list[0] || !list[0].node) reject(new Error("当前设备暂时无法读取这张照片，请重新导出为 JPG。"));
        else resolve(list[0].node);
      });
    });
    const scale = Math.min(1, edge / Math.max(info.width, info.height));
    scratch.width = Math.round(info.width * scale); scratch.height = Math.round(info.height * scale);
    const nativeImage = scratch.createImage();
    try {
      await new Promise((resolve, reject) => {
        nativeImage.onload = resolve; nativeImage.onerror = () => reject(new Error("这张照片暂时无法正确读取，请重新导出为 JPG 后再试。"));
        nativeImage.src = path;
      });
      if (disposed) throw new Error("页面已关闭");
      const ctx = scratch.getContext("2d", { colorSpace: "srgb" });
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, scratch.width, scratch.height);
      ctx.drawImage(nativeImage, 0, 0, scratch.width, scratch.height);
      // Decode, draw and re-encode pixels; this is not metadata stripping.
      const exportOptions = { canvas: scratch, fileType: "jpg", quality: 0.95 };
      // Only the cloud work image uses exact physical output dimensions.
      // Keep the existing free import and result restoration calls unchanged.
      if (options && options.exactSize) Object.assign(exportOptions, {
        x: 0, y: 0, width: scratch.width, height: scratch.height,
        destWidth: scratch.width, destHeight: scratch.height
      });
      const output = await call(wxApi, "canvasToTempFilePath", exportOptions);
      return output.tempFilePath;
    } finally {
      nativeImage.onload = null; nativeImage.onerror = null;
      scratch.width = 1; scratch.height = 1;
    }
  }

  function clear() {
    image = null; foreground = null; foregroundInfo = null; sourceInfo = null; background = "original";
    if (context) context.clearRect(0, 0, profile.width, profile.height);
  }

  async function setForeground(path, expected) {
    const info = await call(wxApi, "getImageInfo", { src: path });
    if (info.type !== "png" || info.width !== expected.width || info.height !== expected.height) throw new Error("人物结果尺寸不匹配，请恢复本次处理");
    const next = canvas.createImage();
    await new Promise((resolve, reject) => { next.onload = resolve; next.onerror = () => reject(new Error("人物结果无法读取，请重新下载")); next.src = path; });
    next.onload = null; next.onerror = null;
    if (disposed) throw new Error("页面已关闭");
    foreground = next; foregroundInfo = info;
  }

  function setBackground(value) {
    if (!["original", "white", "blue"].includes(value) || (value !== "original" && !foreground)) throw new Error("请先取得本次换背景结果");
    background = value;
  }

  function dispose() {
    clear(); disposed = true;
    if (canvas) { canvas.width = 1; canvas.height = 1; }
    context = null; canvas = null;
  }

  function requestFrame(callback) {
    if (disposed || !canvas) return;
    if (typeof canvas.requestAnimationFrame === "function") canvas.requestAnimationFrame(() => { if (!disposed) callback(); });
    else callback();
  }

  return { requestFrame, init, load, draw, pixels, normalize, setForeground, setBackground, clear, dispose };
}

module.exports = { createRaster };
