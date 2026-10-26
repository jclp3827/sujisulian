const inflate = require("../vendor/pako/inflate");

function base64Bytes(value) {
  if (typeof wx !== "undefined" && typeof wx.base64ToArrayBuffer === "function") {
    return new Uint8Array(wx.base64ToArrayBuffer(value));
  }
  return Uint8Array.from(Buffer.from(value, "base64"));
}

function unpack(payload) {
  if (!payload || payload.codec !== "deflate-base64-v1") throw new Error("政治理论内容压缩格式无效");
  return JSON.parse(inflate.inflate(base64Bytes(payload.data), { to: "string" }));
}

module.exports = unpack;
