const encoding = require('./jpeg-q40');

// Supplied pictool2white cfg.ini: color=0, size=2. Distinct from national Q40.
module.exports = Object.freeze(Object.assign({}, encoding, {
  id: 'neimenggu-supplied-f3feb82a-v1', label: '内蒙古',
  toolSha256: 'f3feb82a81d7d58712c2c2c5cdfee0b2922fe7d156d97efe02516f5227b9a8c9',
  archiveSha256: '4a185e3d8267a4512728ff3b03be6b96eafee30cd2bf00661dcc4bf831f9d888',
  width: 413, height: 619, quality: 50, dpi: 1, densityUnits: 0,
  qLumaHex: undefined, qChromaHex: undefined, separateTableSegments: true,
  tailHex: 'dbcdefc2c8d0c7c80000',
  sourceMinBytes: 30 * 1024, sourceMinWidth: 295, sourceMinHeight: 447,
  allowSourceUpscale: true, allowBlueBackground: false, allowAiBackground: false,
  sourceMinError: '内蒙古请选至少 30 KB 的清晰原照片。',
  sourceDimensionsError: '本次内蒙古工具的原图至少需要 295×447 像素。',
  backgroundRequirement: '白色背景',
  sourceRequirement: 'JPG 原图至少 30 KB、295×447 像素',
  sourceHint: '请选白底近期免冠正面证件照，本次按所供工具的二寸配置处理。',
  contentConfirmation: '我已核对本人照片、白色背景和构图符合当次内蒙古考试要求。',
  compatibilityNote: '按所供白底二寸配置适配；年度绑定及官方输出样本、报名平台接收待验证。',
  examNote: '本次适配白底二寸工具，请先核对报名要求是否相符。',
  status: 'supplied-tool-static-candidate', exportPrefix: 'photo-candidate-neimenggu', exportFileName: '报名照片.jpg',
}));
