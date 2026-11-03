const { call } = require("./files");
const { inspectJpeg } = require("../core/jpeg");
const { nativeOrientation, rawJpeg } = require('./orientation');

// Engineering resource budgets, not examination rules. Only target-sized pixels
// enter the JS encoder; native decoding/downsampling handles the source image.
const INPUT_LIMITS = Object.freeze({ bytes: 16 * 1024 * 1024, pixels: 32000000, edge: 2048 });

function sourceType(data) {
  if (data[0] === 0xff && data[1] === 0xd8) return "jpeg";
  if (data.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => data[i] === n)) return "png";
  if (data.length >= 12 && String.fromCharCode(...data.subarray(4, 8)) === "ftyp") {
    const brands = String.fromCharCode(...data.subarray(8, Math.min(40, data.length)));
    if (/heic|heix|hevc|hevx/.test(brands)) return "heic";
    if (/mif1|msf1/.test(brands)) return "heif";
  }
  if ((data[0] === 0x49 && data[1] === 0x49) || (data[0] === 0x4d && data[1] === 0x4d)) return "tiff/dng";
  return "unknown";
}

async function prepareInput(wxApi, files, raster, processor, path, onProgress, options) {
  const started = Date.now(), timings = {};
  const phase = label => { if (onProgress) onProgress(label); };
  phase("正在读取照片");
  const source = await files.read(path, INPUT_LIMITS.bytes);
  if (source.length < processor.profile.sourceMinBytes) throw new Error(processor.profile.sourceMinError || "原照片文件太小，请选择更清晰的照片。");
  timings.readMs = Date.now() - started;
  phase("正在校验文件");
  const copyStarted = Date.now();
  // Snapshot once to a unique owned path. Native image caches are path-based;
  // a reused picker path must never decode a previous image or change mid-flow.
  const snapshot = await files.writeVerified(source, "jpg", INPUT_LIMITS.bytes, { cooperative: true });
  timings.verifiedCopyMs = Date.now() - copyStarted;
  if (snapshot.timings) Object.assign(timings, snapshot.timings);
  let retained = false;
  try {
    const input = await prepareSnapshot(wxApi, files, raster, processor, snapshot.path, source, snapshot.sha256, timings, phase);
    input.preparationMs = Date.now() - started;
    // The controller can adopt this already verified, uniquely named source.
    // Other callers retain the original all-temporary-files-cleaned contract.
    if (options && options.retainVerifiedRecord && input.path === 'direct') {
      input.workingRecord = snapshot;
      // Metadata was obtained from this same private, verified snapshot path.
      retained = true;
    }
    return input;
  }
  finally { if (!retained) await files.remove(snapshot.path); }
}

async function prepareSnapshot(wxApi, files, raster, processor, path, source, sourceSha256, timings, phase) {
  const inspectedAt = Date.now();
  let parsed;
  if (source[0] === 0xff && source[1] === 0xd8) {
    // Extra data can be an auxiliary image or an older processed result; it
    // does not identify provenance. Decode and re-encode the primary image.
    parsed = inspectJpeg(source, { includeTail: false, tolerateOrientation: true });
    if (parsed.precision !== 8 || ![1, 3].includes(parsed.components.length)) throw new Error("这张照片暂时无法正确读取，请重新导出为 JPG 后再试。");
    if (parsed.width * parsed.height > INPUT_LIMITS.pixels) throw new Error("照片较大，当前设备暂时无法完成处理，请选择较小的原照片。");
  } else if (source.length >= 24 && source[0] === 137 && source[1] === 80 && source[2] === 78 && source[3] === 71) {
    const u32 = i => ((source[i] << 24) | (source[i + 1] << 16) | (source[i + 2] << 8) | source[i + 3]) >>> 0;
    if (!u32(16) || !u32(20) || u32(16) * u32(20) > INPUT_LIMITS.pixels) throw new Error("照片较大或尺寸无效，请选择其他原照片。");
  }
  timings.inspectMs = Date.now() - inspectedAt;
  phase("正在读取图像");
  const decodedAt = Date.now();
  let meta;
  try { meta = await call(wxApi, "getImageInfo", { src: path }); }
  catch (_) { throw new Error("微信返回的照片无法解码。RAW/ProRAW 请尝试取消原图，或先在相册导出 JPG 后再选择。"); }
  timings.imageInfoMs = Date.now() - decodedAt;
  const inputFacts = { sourceSha256, sourceBytes: source.length, sourceType: sourceType(source), nativeDecodedType: String(meta.type).toLowerCase(), timings, trailingBytes: parsed ? parsed.trailingBytes : 0 };
  const w = meta.width, h = meta.height;
  const orientation = parsed && parsed.orientation !== null ? parsed.orientation : nativeOrientation(meta.orientation);
  const swap = orientation >= 5;
  const rawWidth = parsed ? parsed.width : w, rawHeight = parsed ? parsed.height : h;
  const displayWidth = swap ? rawHeight : rawWidth, displayHeight = swap ? rawWidth : rawHeight;
  if (![w, h].every(Number.isSafeInteger) || w < 1 || h < 1 || w * h > INPUT_LIMITS.pixels) throw new Error("照片较大，当前设备暂时无法完成处理，请选择较小的原照片。");
  const sourceMinWidth = processor.profile.sourceMinWidth || processor.profile.width;
  const sourceMinHeight = processor.profile.sourceMinHeight || processor.profile.height;
  if (Math.min(w, h) < sourceMinWidth || Math.max(w, h) < sourceMinHeight) {
    throw new Error(processor.profile.sourceDimensionsError || `照片清晰度不足，请选择至少 ${sourceMinWidth}×${sourceMinHeight} 像素的原照片。`);
  }
  if (!["jpeg", "png", "heic", "heif"].includes(inputFacts.sourceType) || !["jpeg", "jpg", "png", "heic", "heif"].includes(String(meta.type).toLowerCase())) throw new Error("微信返回的格式暂不支持，RAW/ProRAW 请取消原图后重试，或先导出 JPG。");
  const started = Date.now();
  if (parsed && (parsed.orientationError || parsed.orientation !== 1)) {
    if (!orientation) throw Error('无法确认照片方向，请在相册转正并另存后重试。');
    const temporary = [];
    phase('正在调整照片方向');
    try {
      // Prevent native auto-rotation: decode a metadata-free *working* copy,
      // then apply exactly one explicit EXIF transform to its raw pixels.
      const rawData = rawJpeg(source, parsed);
      if (inspectJpeg(rawData,{includeTail:false}).hasExif) throw Error('这张照片的方向记录暂不支持，请在相册转正并另存后重试。');
      const raw = await files.writeVerified(rawData, 'jpg', INPUT_LIMITS.bytes);
      temporary.push(raw.path);
      const rawMeta = await call(wxApi,'getImageInfo',{src:raw.path});
      if ((rawMeta.orientation && rawMeta.orientation !== 'up') || rawMeta.width !== parsed.width || rawMeta.height !== parsed.height)
        throw Error('这张照片的方向暂时无法确认，请在相册转正并另存后重试。');
      const output = await raster.normalize(raw.path,rawMeta,INPUT_LIMITS.edge,{orientation,exactSize:true});
      temporary.push(output);
      const data = await files.read(output);
      const info = processor.inspectSource(data,{nativeNormalized:true});
      const scale = Math.min(1,INPUT_LIMITS.edge / Math.max(displayWidth,displayHeight));
      if(info.width!==Math.round(displayWidth*scale) || info.height!==Math.round(displayHeight*scale)) throw Error('照片转正后的尺寸不匹配，请重新选择照片。');
      return Object.assign(inputFacts,{data,info,path:'wechat-native',normalizationMs:Date.now()-started,sourceWidth:displayWidth,sourceHeight:displayHeight,orientationRecovered:orientation});
    } finally {
      for(const filePath of new Set(temporary)) {
        if(filePath===temporary[0]) await files.remove(filePath);
        else { try { await call(wxApi.getFileSystemManager(),'unlink',{filePath}); } catch(_) {} }
      }
    }
  }
  try {
    const info = parsed && parsed.trailingBytes ? null : processor.inspectSource(source);
    if (info && Math.max(w, h) <= INPUT_LIMITS.edge) return Object.assign(inputFacts, { data: source, path: "direct", normalizationMs: 0, info, nativeImageInfo: meta, sourceWidth: displayWidth, sourceHeight: displayHeight });
  } catch (error) {
    // Only valid, bounded, natively decodable input reaches conversion.
    // Color profiles, EXIF and auxiliary image data require real normalization.
  }
  phase("正在准备 JPG");
  const temporary = [];
  try {
    let nativePath = path;
    if (Math.max(w, h) > INPUT_LIMITS.edge || (parsed && parsed.orientation !== 1) || (meta.orientation && meta.orientation !== "up")) {
      const scale = Math.min(1, INPUT_LIMITS.edge / Math.max(displayWidth, displayHeight));
      const compressed = await call(wxApi, "compressImage", { src: path, quality: 95, compressedWidth: Math.round(displayWidth * scale), compressedHeight: Math.round(displayHeight * scale) });
      if (!compressed.tempFilePath) throw new Error("照片无法完成标准化，请重新导出为 JPG 后再试。");
      nativePath = compressed.tempFilePath;
      if (nativePath !== path) temporary.push(nativePath);
    }
    const normalizedMeta = await call(wxApi, "getImageInfo", { src: nativePath });
    // Never guess whether EXIF has been applied, or rotate an image twice.
    if (normalizedMeta.orientation && normalizedMeta.orientation !== "up") {
      // Some HEIC/PNG conversions produce a JPEG that still carries rotation.
      // Feed that JPEG through the same explicit working-copy transform once.
      const converted = await files.read(nativePath);
      if (!parsed && converted[0] === 0xff && converted[1] === 0xd8) {
        const convertedInfo = inspectJpeg(converted,{includeTail:false,tolerateOrientation:true});
        if (convertedInfo.orientationError || convertedInfo.orientation !== 1)
          return await prepareSnapshot(wxApi,files,raster,processor,nativePath,converted,sourceSha256,timings,phase)
            .then(result=>Object.assign(result,inputFacts,{sourceWidth:displayWidth,sourceHeight:displayHeight}));
      }
      throw new Error("这张照片的方向暂时无法确认，请在相册转正并另存后重试。");
    }
    const expectedRatio = displayWidth / displayHeight;
    if (Math.abs(normalizedMeta.width / normalizedMeta.height / expectedRatio - 1) > 0.01) throw new Error("照片方向或比例无法正确读取，请重新导出为 JPG。");
    let data = nativePath !== path ? await files.read(nativePath) : source;
    let info;
    try {
      if (!(nativePath === path && parsed && parsed.trailingBytes)) info = processor.inspectSource(data);
    } catch (_) {}
    if (!info || Math.max(info.width, info.height) > INPUT_LIMITS.edge) {
      nativePath = await raster.normalize(nativePath, normalizedMeta, INPUT_LIMITS.edge);
      temporary.push(nativePath);
      data = await files.read(nativePath);
      info = processor.inspectSource(data, { nativeNormalized: true });
    }
    if (Math.max(info.width, info.height) > INPUT_LIMITS.edge) throw new Error("当前微信未能缩小照片，请选择较小的原照片。");
    return Object.assign(inputFacts, { data, info, path: "wechat-native", normalizationMs: Date.now() - started, sourceWidth: displayWidth, sourceHeight: displayHeight });
  } finally {
    const fs = wxApi.getFileSystemManager();
    for (const filePath of new Set(temporary)) {
      if (filePath !== path) { try { await call(fs, "unlink", { filePath }); } catch (_) {} }
    }
  }
}

module.exports = { prepareInput, INPUT_LIMITS, sourceType };
