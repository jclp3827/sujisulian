const { getProfile } = require("../profiles/index");
const encode420 = require("../vendor/jpeg-encoder");
const { inspectJpeg } = require("./jpeg");
const { bytes } = require("./bytes");
const { sha256 } = require("./sha256");
const { encoding } = require('./encoding');

function createProcessor(profileId) {
  return createProcessorForProfile(getProfile(profileId));
}
function createProcessorForProfile(value) {
  const profile = Object.freeze(Object.assign({}, value, {tailHex: typeof value.tailHex === 'string' ? value.tailHex.toLowerCase() : value.tailHex}));
  const settings = encoding(profile);

  function inspectSource(value, options) {
    const data = bytes(value);
    // The byte minimum applies to the selected original, already checked by
    // prepareInput. A natively re-encoded working copy can legitimately shrink.
    if (data.length < profile.sourceMinBytes && !(options && options.nativeNormalized === true)) throw new Error(profile.sourceMinError || "请选择至少 30 KB 的 JPG 原图，处理后的小图不适合作为原图");
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
    const sourceMinWidth = profile.sourceMinWidth || profile.width;
    const sourceMinHeight = profile.sourceMinHeight || profile.height;
    if (info.width < sourceMinWidth || info.height < sourceMinHeight) {
      throw new Error(profile.sourceDimensionsError || `原图至少需要 ${sourceMinWidth}×${sourceMinHeight} 像素`);
    }
    return info;
  }

  function cropRect(width, height, options) {
    const opts = Object.assign({ zoom: 1, x: 0.5, y: 0.5 }, options);
    if (![width, height, opts.zoom, opts.x, opts.y].every(Number.isFinite) || width < 1 || height < 1 || opts.zoom < 1 || opts.zoom > 3 || opts.x < 0 || opts.x > 1 || opts.y < 0 || opts.y > 1) throw new Error("裁剪参数无效");
    const ratio = profile.width / profile.height;
    const w = Math.min(width, height * ratio) / opts.zoom;
    const h = w / ratio;
    if (profile.allowSourceUpscale !== true && (w + 1e-6 < profile.width || h + 1e-6 < profile.height)) throw new Error("当前裁剪范围太小，请缩小放大倍率或使用更清晰的原图");
    return { x: (width - w) * opts.x, y: (height - h) * opts.y, width: w, height: h };
  }

  function verifyCandidate(value) {
    const info = inspectJpeg(value);
    const c = info.components;
    const segmentLayout = info.segments.map(segment => `${segment.marker.toString(16)}:${segment.length}`);
    const expectedLayout = profile.jpegSegmentLayout || (settings.separateTableSegments
      ? ['e0:16','db:67','db:67','c0:17','c4:31','c4:181','c4:31','c4:181','da:12','d9:0']
      : ['e0:16','db:132','c0:17','c4:418','da:12','d9:0']);
    const valid = info.width === profile.width && info.height === profile.height && info.frame === 0xc0 && info.precision === 8 &&
      c.length === 3 && c.every((v, i) => v.id === i + 1 && v.sampling === (i === 0 ? {420:0x22,422:0x21,444:0x11}[settings.sampling] : 0x11) && v.table === (i === 0 ? 0 : 1)) &&
      Object.keys(info.tables).length === 2 && info.tables[0] && info.tables[0].precision === 0 && info.tables[0].hex === settings.qLumaHex &&
      info.tables[1] && info.tables[1].precision === 0 && info.tables[1].hex === settings.qChromaHex && info.jfif &&
      info.jfif.major === 1 && info.jfif.minor === 1 && info.jfif.units === settings.densityUnits && info.jfif.x === profile.dpi && info.jfif.y === profile.dpi &&
      !info.hasExif && !info.hasIcc && !info.hasAdobe && info.scans === 1 && info.tail === profile.tailHex &&
      (!expectedLayout || expectedLayout.length === segmentLayout.length && expectedLayout.every((segment, index) => segment === segmentLayout[index]));
    if (!valid || (profile.outputMinBytes !== undefined && info.size < profile.outputMinBytes) || (profile.outputMaxBytes !== undefined && info.size > profile.outputMaxBytes)) throw new Error("候选文件未通过本地格式检查，已停止导出");
    return info;
  }

  function createCandidate(rgba, confirmation) {
    if (confirmation !== true) throw new Error("请先确认照片内容与构图符合目标要求");
    const pixels = bytes(rgba);
    if (pixels.length !== profile.width * profile.height * 4) throw new Error("裁剪后的像素数量不正确");
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] !== 255) throw new Error("照片不能包含透明像素");
    const jpeg = encode420({ width: profile.width, height: profile.height, data: pixels }, settings);
    if (inspectJpeg(jpeg).tail) throw new Error("编码结果存在意外尾部");
    const tail = new Uint8Array((profile.tailHex.match(/../g) || []).map((s) => parseInt(s, 16)));
    const output = new Uint8Array(jpeg.length + tail.length);
    output.set(jpeg); output.set(tail, jpeg.length);
    const info = verifyCandidate(output);
    return { data: output, info, sha256: sha256(output), profileId: profile.id, toolSha256: profile.toolSha256 };
  }

  return Object.freeze({ profile, inspectSource, cropRect, verifyCandidate, createCandidate });
}

// Preserve the original PoC API for historical fixtures and delivery diagnostics.
module.exports = Object.assign({ createProcessor, createProcessorForProfile }, createProcessor("henan-retained-2025-v1"));
