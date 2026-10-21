const { bytes } = require("../core/bytes");
const { inspectJpeg } = require("../core/jpeg");

// Only accept a native canvas export, after pixels have been normalized.
// Never apply this to a user's original file to bypass orientation handling.
function prepareCloudJpeg(value, sourceInfo) {
  const input = bytes(value), original = inspectJpeg(input, { includeTail: false });
  const exportInfo = { width: original.width, height: original.height, bytes: input.length,
    hasExif: original.hasExif, orientation: original.orientation };
  const reject = (code, message) => {
    const error = new Error(message); error.code = code; error.cloudWork = exportInfo; throw error;
  };
  const scale = Math.min(1, 1000 / Math.max(sourceInfo.width, sourceInfo.height));
  const width = Math.round(sourceInfo.width * scale), height = Math.round(sourceInfo.height * scale);
  if (!width || !height || original.width !== width || original.height !== height || width > 1000 || height > 1000)
    reject("CLOUD_WORK_DIMENSIONS", "工作图导出尺寸异常，尚未下单；请复制付款检查反馈");
  if (original.orientation !== 1)
    reject("CLOUD_WORK_ORIENTATION", "工作图方向未正确转正，尚未下单；可以继续免费处理");
  if (original.trailingBytes || original.precision !== 8 || ![0xc0, 0xc2].includes(original.frame) ||
      ![1, 3].includes(original.components.length))
    reject("CLOUD_WORK_FORMAT", "工作图格式异常，尚未下单；可以继续免费处理");

  // Some native JPEG encoders add fresh EXIF even after drawing pixels. Remove
  // that orientation-1 header without changing compressed pixels or quality.
  // Keep all scan bytes intact; unexpected later EXIF fails the final check.
  let data = input;
  if (original.hasExif) {
    const chunks = [input.subarray(0, 2)];
    let p = 2;
    while (p < input.length) {
      const start = p++;
      while (input[p] === 0xff) p++;
      const marker = input[p++];
      if (marker === 0xda || marker === 0xd9) { chunks.push(input.subarray(start)); break; }
      const length = (input[p] << 8) | input[p + 1], end = p + length;
      const exif = marker === 0xe1 && input[p + 2] === 0x45 && input[p + 3] === 0x78 &&
        input[p + 4] === 0x69 && input[p + 5] === 0x66 && input[p + 6] === 0 && input[p + 7] === 0;
      if (!exif) chunks.push(input.subarray(start, end));
      p = end;
    }
    data = new Uint8Array(chunks.reduce((sum, part) => sum + part.length, 0));
    let offset = 0;
    for (const part of chunks) { data.set(part, offset); offset += part.length; }
  }
  const info = inspectJpeg(data, { includeTail: false });
  if (info.hasExif || info.orientation !== 1 || info.trailingBytes || info.width !== width || info.height !== height)
    reject("CLOUD_WORK_METADATA", "工作图信息未完成清理，尚未下单；可以继续免费处理");
  if (data.length > 1572864)
    reject("CLOUD_WORK_BYTES", "工作图体积超过云处理限制，尚未下单；可以继续免费处理");
  return { data, info, exportInfo };
}

module.exports = { prepareCloudJpeg };
