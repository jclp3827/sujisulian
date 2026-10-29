const encoding = require("./jpeg-q40");

module.exports = Object.freeze(Object.assign({}, encoding, {
  id: "sichuan-2018-0ee77098-v1",
  label: "四川省考",
  toolSha256: "0ee77098c29ab5eebfe08eeb104c694c176bc02286b5a1d3bbcd697422960500",
  archiveSha256: "9d70577fbd894cfc3c10f07064d7a14ab8a1e6464984bd8ac9df98a37bae6cd0",
  // The supplied tool's save and read paths use this distinct 10-byte suffix.
  tailHex: "ff02000873636b737a78",
  // The tool's instructions say the source must be greater than 10 KB.
  sourceMinBytes: 10 * 1024 + 1,
  sourceMinError: "四川省考请选大于 10 KB 的清晰原照片。",
  backgroundRequirement: "白色背景",
  sourceRequirement: "白底 JPG，原图大于 10 KB、至少 295×413 像素",
  allowBlueBackground: false,
  status: "user-confirmed-current-tool-static-save-path",
  exportPrefix: "photo-candidate-sichuan",
  exportFileName: "报名照片.jpg",
  sourceHint: "请选白底、近期免冠正面照片，原图大于 10 KB，至少 295×413 像素。",
  contentConfirmation: "我已核对本人照片、白色背景和构图符合四川省考要求。",
  compatibilityNote: "依据四川照片审核处理工具的说明和静态保存规则生成；最终以报名网站审核为准。",
}));
