// One-file ZIP (stored method): archive bytes are the exact JPG bytes, with no image decode.
const { bytes } = require("./bytes");

function utf8(value) {
  const out = [];
  for (const char of value) {
    const n = char.codePointAt(0);
    if (n < 0x80) out.push(n);
    else if (n < 0x800) out.push(0xc0 | n >> 6, 0x80 | n & 63);
    else if (n < 0x10000) out.push(0xe0 | n >> 12, 0x80 | n >> 6 & 63, 0x80 | n & 63);
    else out.push(0xf0 | n >> 18, 0x80 | n >> 12 & 63, 0x80 | n >> 6 & 63, 0x80 | n & 63);
  }
  return new Uint8Array(out);
}

function crc32(data) {
  let crc = -1;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ -1) >>> 0;
}

function packJpg(value, name) {
  const jpg = bytes(value), filename = utf8(name || "报名照片.jpg");
  if (!jpg.length || jpg.length > 8 * 1024 * 1024 || filename.length > 65535) throw new Error("ZIP 实验文件大小无效");
  const localSize = 30 + filename.length + jpg.length, centralSize = 46 + filename.length;
  const out = new Uint8Array(localSize + centralSize + 22), view = new DataView(out.buffer);
  const u16 = (at, n) => view.setUint16(at, n, true);
  const u32 = (at, n) => view.setUint32(at, n >>> 0, true);
  const crc = crc32(jpg), flags = 0x800;
  u32(0, 0x04034b50); u16(4, 20); u16(6, flags); u16(8, 0); u32(14, crc);
  u32(18, jpg.length); u32(22, jpg.length); u16(26, filename.length);
  out.set(filename, 30); out.set(jpg, 30 + filename.length);
  const c = localSize;
  u32(c, 0x02014b50); u16(c + 4, 20); u16(c + 6, 20); u16(c + 8, flags);
  u16(c + 10, 0); u32(c + 16, crc); u32(c + 20, jpg.length); u32(c + 24, jpg.length);
  u16(c + 28, filename.length); out.set(filename, c + 46);
  const e = c + centralSize;
  u32(e, 0x06054b50); u16(e + 8, 1); u16(e + 10, 1); u32(e + 12, centralSize); u32(e + 16, c);
  return out;
}

module.exports = { packJpg };
