const encoding = require("./jpeg-q40");

module.exports = Object.freeze(Object.assign({}, encoding, {
  id: "gwy-uploaded-e344fc1b-v1",
  label: "国家公务员考试",
  toolSha256: "e344fc1b4619d355d88a52bc1eddf216cca60fb55c8e9bab42ac5d4ed04183a9",
  archiveSha256: "b9dc626c54d29b33a36b7ce2e7fea7a535d853bc2c2c0bbc9857e4f7b4dd25bb",
  // No Henan 30 KiB lower bound: this tool's recovered input check has none.
  sourceMinBytes: 0,
  tailHex: "ff020008676a67777932",
  status: "static-save-path-only",
  exportPrefix: "photo-candidate-gwy",
  // Match the official tool's default save name. The upload rules do not
  // establish the name as mandatory; the verified bytes remain authoritative.
  exportFileName: "报名照片.jpg",
  sourceHint: "请选择清晰原照片，至少 295×413 像素。部分照片会在设备内准备为 JPG；无法正确读取时请重新导出后再试。",
  contentConfirmation: "我已核对本人照片、背景和构图符合当年度要求，照片未美化或放大低清细节。",
  compatibilityNote: "测试环境使用指定的 2026 技术基线；2027 年度兼容及报名系统接收尚未完成验证。",
}));
