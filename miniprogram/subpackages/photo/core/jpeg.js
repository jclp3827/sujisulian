const { bytes, toHex } = require("./bytes");

function exifOrientation(b, start, end) {
  const p = start + 6;
  const invalid = () => { throw new Error("照片方向信息损坏，请转正后另存为 JPG"); };
  if (p + 8 > end) invalid();
  const little = b[p] === 0x49 && b[p + 1] === 0x49;
  if (!little && !(b[p] === 0x4d && b[p + 1] === 0x4d)) invalid();
  const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const short = (q) => view.getUint16(q, little);
  if (short(p + 2) !== 42) invalid();
  const ifd = p + view.getUint32(p + 4, little);
  if (ifd < p + 8 || ifd + 2 > end) invalid();
  const count = short(ifd);
  if (count > 512 || ifd + 2 + count * 12 + 4 > end) invalid();
  for (let i = 0; i < count; i++) {
    const q = ifd + 2 + i * 12;
    if (short(q) !== 0x112) continue;
    if (short(q + 2) !== 3 || view.getUint32(q + 4, little) !== 1) invalid();
    const orientation = short(q + 8);
    if (orientation < 1 || orientation > 8) invalid();
    return orientation;
  }
  return 1;
}

// Structural inspection only; image decoding and content review are separate gates.
function inspectJpeg(value, options) {
  const b = bytes(value);
  const bad = () => { throw new Error("JPEG 文件不完整或结构不受支持"); };
  const u16 = (p) => (b[p] << 8) | b[p + 1];
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) bad();
  const result = { width: 0, height: 0, precision: 0, components: [], tables: {}, jfif: null, hasExif: false, hasIcc: false, hasAdobe: false, orientation: 1, scans: 0 };
  let p = 2, entropy = false;
  while (p < b.length) {
    if (entropy) {
      while (p < b.length && b[p] !== 0xff) p++;
    }
    if (p + 1 >= b.length || b[p++] !== 0xff) bad();
    while (p < b.length && b[p] === 0xff) p++;
    if (p >= b.length) bad();
    const marker = b[p++];
    if (entropy && (marker === 0 || (marker >= 0xd0 && marker <= 0xd7))) continue;
    if (marker === 0xd9) {
      if (!result.width || !result.height || !result.scans) bad();
      result.jpegLength = p;
      result.trailingBytes = b.length - p;
      // Input containers can contain large auxiliary images after the first EOI.
      // Import needs their length, not a potentially multi-megabyte hex string.
      result.tail = options && options.includeTail === false ? null : toHex(b.subarray(p));
      result.size = b.length;
      return result;
    }
    entropy = false;
    if (marker === 0 || marker === 0xd8 || marker === 1 || (marker >= 0xd0 && marker <= 0xd7)) bad();
    if (p + 2 > b.length) bad();
    const length = u16(p), end = p + length, start = p + 2;
    if (length < 2 || end > b.length) bad();
    if ([0xc0, 0xc1, 0xc2].indexOf(marker) !== -1) {
      if (result.width || length < 8 || length !== 8 + 3 * b[start + 5]) bad();
      result.frame = marker;
      result.precision = b[start];
      result.height = u16(start + 1);
      result.width = u16(start + 3);
      for (let q = start + 6; q < end; q += 3) result.components.push({ id: b[q], sampling: b[q + 1], table: b[q + 2] });
    }
    if (marker === 0xdb) {
      let q = start;
      while (q < end) {
        const info = b[q++], precision = info >> 4, count = precision ? 128 : 64;
        if (precision > 1 || (info & 15) > 3 || q + count > end) bad();
        result.tables[info & 15] = { precision, hex: toHex(b.subarray(q, q + count)) };
        q += count;
      }
    }
    if (marker === 0xe0 && length >= 16 && toHex(b.subarray(start, start + 5)) === "4a46494600") {
      result.jfif = { major: b[start + 5], minor: b[start + 6], units: b[start + 7], x: u16(start + 8), y: u16(start + 10) };
    }
    if (marker === 0xe1 && toHex(b.subarray(start, start + 6)) === "457869660000") {
      if (result.hasExif) bad();
      result.hasExif = true;
      result.orientation = exifOrientation(b, start, end);
    }
    if (marker === 0xe2 && toHex(b.subarray(start, start + 12)) === "4943435f50524f46494c4500") result.hasIcc = true;
    if (marker === 0xee) result.hasAdobe = true;
    if (marker === 0xda) {
      if (length < 6 || length !== 6 + b[start] * 2) bad();
      result.scans++;
      entropy = true;
    }
    p = end;
  }
  bad();
}

module.exports = { inspectJpeg };
