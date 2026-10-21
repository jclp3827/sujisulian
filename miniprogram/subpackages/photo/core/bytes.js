function bytes(value) {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  // WeChat's file bridge may return a genuine ArrayBuffer from another realm.
  if (Object.prototype.toString.call(value) === "[object ArrayBuffer]") {
    const view = new DataView(value); // Brand-check; do not trust a spoofed toStringTag.
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  }
  throw new Error("无法读取文件字节");
}

function equalBytes(a, b) {
  a = bytes(a);
  b = bytes(b);
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function toHex(value) {
  return Array.from(bytes(value), (n) => (n < 16 ? "0" : "") + n.toString(16)).join("");
}

module.exports = { bytes, equalBytes, toHex };
