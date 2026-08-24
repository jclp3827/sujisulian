const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const FILE_ID_PREFIX = 'cloud://cloud1-d8gw5r2il0c0f198a.636c-cloud1-d8gw5r2il0c0f198a-1317757209/note-resources/'
const CDN_PREFIX = 'https://636c-cloud1-d8gw5r2il0c0f198a-1317757209.tcb.qcloud.la/note-resources/'
const ALLOWED_PREFIXES = ['graphic/', 'data-analysis/', 'quantity/', 'logic/', 'common-sense/']

function normalizeAssetPath(value) {
  let assetPath = String(value || '').trim()
  if (assetPath.startsWith(FILE_ID_PREFIX)) assetPath = assetPath.slice(FILE_ID_PREFIX.length)
  if (assetPath.startsWith(CDN_PREFIX)) assetPath = assetPath.slice(CDN_PREFIX.length)
  assetPath = assetPath.replace(/^\/+/, '').replace(/^note-resources\//, '')
  return assetPath
}

function isAllowedPath(assetPath) {
  return ALLOWED_PREFIXES.some((prefix) => assetPath.startsWith(prefix)) &&
    !assetPath.includes('..') &&
    !assetPath.includes('\\') &&
    !assetPath.includes('\0')
}

exports.main = async (event) => {
  const requestedPath = event && event.path

  if (!requestedPath || typeof requestedPath !== 'string') {
    return {
      code: 400,
      msg: '缺少 path 参数',
    }
  }

  const assetPath = normalizeAssetPath(requestedPath)
  if (!isAllowedPath(assetPath)) {
    return {
      code: 403,
      msg: '非法图片路径',
    }
  }

  const fileID = FILE_ID_PREFIX + assetPath

  try {
    const res = await cloud.getTempFileURL({
      fileList: [fileID],
    })

    const item = res.fileList && res.fileList[0]

    if (!item || item.status !== 0 || !item.tempFileURL) {
      return {
        code: 404,
        msg: '图片不存在或无法生成临时链接',
        fileID,
        result: item,
      }
    }

    return {
      code: 0,
      path: assetPath,
      url: item.tempFileURL,
    }
  } catch (err) {
    console.error('获取图片临时链接失败：', err)
    return {
      code: 500,
      msg: '获取图片失败',
      error: err.message || err,
    }
  }
}
