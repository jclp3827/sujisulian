const encoding = require("./jpeg-q40");

module.exports = Object.freeze(Object.assign({}, encoding, {
  id: "sichuan-latest-68ad9351-v1",
  label: "四川省考",
  toolSha256: "68ad93517bd4f7cd935484fb0bf1bd9cdbee3140e090495c825a45715c1f7481",
  archiveSha256: "f0809e03b448ecab7973f2c2bb5402d0b14a9b376926a12fa2610c4b686a880b",
  // The latest supplied EXE writes this fixed 10-byte suffix.
  tailHex: "ff0200087a676b736867",
  sourceMinBytes: 30 * 1024 + 1,
  sourceMinWidth: 215,
  sourceMinHeight: 300,
  allowSourceUpscale: true,
  sourceMinError: "四川省考请选大于 30 KB 的清晰原照片。",
  sourceDimensionsError: "四川省考原图至少需要 215×300 像素。",
  backgroundRequirement: "红色、白色或蓝色背景",
  sourceRequirement: "红、白或蓝底 JPG，原图大于 30 KB、至少 215×300 像素",
  allowBlueBackground: true,
  status: "latest-tool-static-save-path-verified",
  exportPrefix: "photo-candidate-sichuan",
  exportFileName: "报名照片.jpg",
  sourceHint: "请选红底、白底或蓝底的近期免冠正面照片，原图大于 30 KB，至少 215×300 像素。",
  contentConfirmation: "我已核对本人照片、背景和构图符合四川省考要求。",
  compatibilityNote: "已按最新四川照片审核工具的保存规则生成并完成本地文件检查；最终以报名网站审核为准。",
}));
