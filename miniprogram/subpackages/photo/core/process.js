const { getProfile } = require("../profiles/index");
const encode420 = require("../vendor/jpeg-encoder");
const { inspectJpeg } = require("./jpeg");
const { bytes } = require("./bytes");
const { sha256 } = require("./sha256");

function createProcessor(profileId) {
  const profile = getProfile(profileId);

  function inspectSource(value, options) {
    const data = bytes(value);
    if (data.length < profile.sourceMinBytes) throw new Error("请选择至少 30 KB 的 JPG 原图，处理后的小图不适合作为原图");
    if (data.length > profile.sourceMaxBytes) throw new Error("PoC 暂支持 8 MB 以内的 JPG");
    if (data[0] !== 0xff || data[1] !== 0xd8) throw new Error("请选择 JPG 原图，PoC 暂不支持 HEIC、PNG 等格式");
    const info = inspectJpeg(data);
    if (info.tail) throw new Error("照片含额外尾部，请选择标准、未经过报名工具处理的 JPG 原图");
    if (info.precision !== 8 || [0xc0, 0xc2].indexOf(info.frame) === -1 || [1, 3].indexOf(info.components.length) === -1) throw new Error("PoC 暂支持 8 位灰度或 RGB JPEG，不支持 CMYK 等格式");
    // The platform may emit an RGB profile again after actual sRGB canvas
    // decoding/drawing. Only that internal working-image path may retain it;
    // raw tagged input still requires native normalization. Output stays strict.
    if ((info.hasIcc || info.hasAdobe) && !(options && options.nativeNormalized === true && info.components.length === 3)) throw new Error("此照片带特殊色彩信息，请先另存为标准 sRGB JPG");
    if (info.orientation !== 1) throw new Error("照片带旋转或镜像信息，请先转正后另存为 JPG");
    if (info.width * info.height > profile.sourceMaxPixels) throw new Error("PoC 暂支持不超过 800 万像素的 JPG");
    if (info.width < profile.width || info.height < profile.height) throw new Error("原图至少需要 295×413 像素，PoC 不放大低清照片");
    return info;
  }

  function cropRect(width, height, options) {
    const opts = Object.assign({ zoom: 1, x: 0.5, y: 0.5 }, options);
    if (![width, height, opts.zoom, opts.x, opts.y].every(Number.isFinite) || width < 1 || height < 1 || opts.zoom < 1 || opts.zoom > 3 || opts.x < 0 || opts.x > 1 || opts.y < 0 || opts.y > 1) throw new Error("裁剪参数无效");
    const ratio = profile.width / profile.height;
    const w = Math.min(width, height * ratio) / opts.zoom;
    const h = w / ratio;
    if (w + 1e-6 < profile.width || h + 1e-6 < profile.height) throw new Error("当前裁剪范围太小，请缩小放大倍率或使用更清晰的原图");
    return { x: (width - w) * opts.x, y: (height - h) * opts.y, width: w, height: h };
  }

  function verifyCandidate(value) {
    const info = inspectJpeg(value);
    const c = info.components;
    const valid = info.width === profile.width && info.height === profile.height && info.frame === 0xc0 && info.precision === 8 &&
      c.length === 3 && c.every((v, i) => v.id === i + 1 && v.sampling === (i === 0 ? 0x22 : 0x11) && v.table === (i === 0 ? 0 : 1)) &&
      Object.keys(info.tables).length === 2 && info.tables[0] && info.tables[0].precision === 0 && info.tables[0].hex === profile.qLumaHex &&
      info.tables[1] && info.tables[1].precision === 0 && info.tables[1].hex === profile.qChromaHex && info.jfif &&
      info.jfif.major === 1 && info.jfif.minor === 1 && info.jfif.units === 1 && info.jfif.x === profile.dpi && info.jfif.y === profile.dpi &&
      !info.hasExif && !info.hasIcc && !info.hasAdobe && info.scans === 1 && info.tail === profile.tailHex;
    if (!valid) throw new Error("候选文件未通过本地格式检查，已停止导出");
    return info;
  }

  function createCandidate(rgba, confirmation) {
    if (confirmation !== true) throw new Error("请先确认照片内容与构图符合目标要求");
    const pixels = bytes(rgba);
    if (pixels.length !== profile.width * profile.height * 4) throw new Error("裁剪后的像素数量不正确");
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] !== 255) throw new Error("照片不能包含透明像素");
    const jpeg = encode420({ width: profile.width, height: profile.height, data: pixels });
    if (inspectJpeg(jpeg).tail) throw new Error("编码结果存在意外尾部");
    const tail = new Uint8Array(profile.tailHex.match(/../g).map((s) => parseInt(s, 16)));
    const output = new Uint8Array(jpeg.length + tail.length);
    output.set(jpeg); output.set(tail, jpeg.length);
    const info = verifyCandidate(output);
    return { data: output, info, sha256: sha256(output), profileId: profile.id, toolSha256: profile.toolSha256 };
  }

  return Object.freeze({ profile, inspectSource, cropRect, verifyCandidate, createCandidate });
}

// Preserve the original PoC API for historical fixtures and delivery diagnostics.
module.exports = Object.assign({ createProcessor }, createProcessor("henan-retained-2025-v1"));
