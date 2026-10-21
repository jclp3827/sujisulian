const encoding = require("./jpeg-q40");

module.exports = Object.freeze(Object.assign({}, encoding, {
  id: "henan-retained-2025-v1",
  label: "河南历史工具样本验证",
  toolSha256: "68ad93517bd4f7cd935484fb0bf1bd9cdbee3140e090495c825a45715c1f7481",
  sourceMinBytes: 30 * 1024,
  // Historical defaults; the PoC additionally refuses to enlarge a crop.
  historicalMinWidth: 215,
  historicalMinHeight: 300,
  tailHex: "ff0200087a676b736867",
  status: "historical-sample-only",
  exportPrefix: "photo-candidate-henan",
  sourceHint: "至少 30 KB、295×413 像素；暂支持 8 MB、800 万像素以内的普通 JPG。请选择背景和人像已符合目标考试要求的证件照。",
  contentConfirmation: "我已核对目标考试要求，确认本人照片真实，背景、服装、面部清晰度和构图符合要求。",
  compatibilityNote: "已与河南留存工具的历史成功样本核对关键格式；本程序输出在当前报名系统中的接收未实测。",
}));
