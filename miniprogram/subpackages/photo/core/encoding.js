// Tables are serialized in JPEG zig-zag order, not natural 8x8 order.
const { inspectJpeg } = require('./jpeg');
const encode = require('../vendor/jpeg-encoder');
const cache = new Map();
function encoding(profile) {
  if (!profile || !Number.isInteger(profile.width) || !Number.isInteger(profile.height) ||
      profile.width < 1 || profile.height < 1 || profile.width > 65535 || profile.height > 65535 || profile.width * profile.height > 1000000)
    throw Error('照片输出尺寸配置无效');
  const quality = profile.quality, dpi = profile.dpi, sampling = profile.sampling;
  const densityUnits = profile.densityUnits === undefined ? 1 : profile.densityUnits;
  if (![0, 1, 2].includes(densityUnits)) throw Error('照片密度单位配置无效');
  for (const field of ['sourceMinBytes','sourceMaxBytes','sourceMaxPixels']) if (!Number.isSafeInteger(profile[field]) || profile[field] < (field === 'sourceMinBytes' ? 0 : 1)) throw Error('照片输入限制配置无效');
  if (profile.sourceMinBytes > profile.sourceMaxBytes) throw Error('照片输入限制配置矛盾');
  for (const field of ['sourceMinWidth','sourceMinHeight']) if (profile[field] !== undefined && (!Number.isInteger(profile[field]) || profile[field] < 1)) throw Error('照片输入尺寸配置无效');
  if (profile.allowSourceUpscale !== undefined && typeof profile.allowSourceUpscale !== 'boolean') throw Error('照片缩放配置无效');
  if (!Number.isInteger(quality) || quality < 1 || quality > 100 || !Number.isInteger(dpi) || dpi < 1 || dpi > 65535 || !['420','422','444'].includes(sampling))
    throw Error('照片编码配置无效');
  if (profile.separateTableSegments !== undefined && typeof profile.separateTableSegments !== 'boolean') throw Error('照片编码分段配置无效');
  const custom = profile.quantizationMode === 'explicit';
  if (!['quality','explicit'].includes(profile.quantizationMode)) throw Error('照片量化配置无效');
  const options = { quality, dpi, sampling, densityUnits, separateTableSegments: profile.separateTableSegments === true };
  if (custom) Object.assign(options, { qLumaHex: profile.qLumaHex, qChromaHex: profile.qChromaHex });
  const key = JSON.stringify(options);
  let tables = cache.get(key);
  if (!tables) {
    const info = inspectJpeg(encode({width:8,height:8,data:new Uint8Array(256).fill(255)}, options));
    tables = { qLumaHex: info.tables[0].hex, qChromaHex: info.tables[1].hex };
    cache.set(key, tables);
  }
  if ((!custom && profile.qLumaHex && profile.qLumaHex !== tables.qLumaHex) || (!custom && profile.qChromaHex && profile.qChromaHex !== tables.qChromaHex)) throw Error('质量参数与量化表不一致');
  if (typeof profile.tailHex !== 'string' || !/^(?:[a-f0-9]{2})*$/i.test(profile.tailHex)) throw Error('照片尾部标记配置无效');
  if (profile.exportFileName !== undefined && (typeof profile.exportFileName !== 'string' || !/\.jpe?g$/i.test(profile.exportFileName) || /[\\/\x00-\x1f]/.test(profile.exportFileName))) throw Error('照片文件名配置无效');
  for (const field of ['outputMinBytes','outputMaxBytes']) if (profile[field] !== undefined && (!Number.isSafeInteger(profile[field]) || profile[field] < 0)) throw Error('照片大小配置无效');
  if (profile.outputMinBytes !== undefined && profile.outputMaxBytes !== undefined && profile.outputMinBytes > profile.outputMaxBytes) throw Error('照片大小配置矛盾');
  return Object.freeze(Object.assign(options,tables));
}
module.exports = { encoding };
