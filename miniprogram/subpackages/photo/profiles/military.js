const encoding = require('./jpeg-q40');

module.exports = Object.freeze(Object.assign({}, encoding, {
  id: 'military-supplied-68ad9351-v1', label: '军队文职',
  toolSha256: '68ad93517bd4f7cd935484fb0bf1bd9cdbee3140e090495c825a45715c1f7481',
  archiveSha256: 'c2dd861414a8ef7433680a6cbf853c2dde49c3c128f2ae2b4dbe03e2b87ddd4f',
  tailHex: 'ff0200087a676b736867',
  sourceMinBytes: 30 * 1024 + 1, sourceMinWidth: 215, sourceMinHeight: 300,
  allowSourceUpscale: true, allowBlueBackground: true, allowAiBackground: true,
  sourceMinError: '军队文职请选大于 30 KB 的清晰原照片。',
  sourceDimensionsError: '军队文职原图至少需要 215×300 像素。',
  backgroundRequirement: '红色、白色或蓝色背景',
  sourceRequirement: 'JPG 原图大于 30 KB、至少 215×300 像素',
  sourceHint: '请选本人近期免冠正面证件照，并核对当次报名要求。',
  contentConfirmation: '我已核对本人照片、背景和构图符合军队文职报名要求。',
  compatibilityNote: '按用户提供的军队文职工具适配；年度绑定及报名平台接收待验证。',
  examNote: '按本次提供的军队文职工具处理，请核对当次报名页面要求。',
  status: 'supplied-tool-candidate', exportPrefix: 'photo-candidate-military', exportFileName: '报名照片.jpg',
}));
