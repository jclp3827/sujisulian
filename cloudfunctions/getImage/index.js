const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const FILE_ID_PREFIX = 'cloud://cloud1-d8gw5r2il0c0f198a.636c-cloud1-d8gw5r2il0c0f198a-1317757209/note-resources/'
const ALLOWED_PREFIXES = ['graphic/', 'data-analysis/', 'quantity/', 'logic/']

function isAllowedPath(path) {
  return ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix)) && !path.includes('..')
}

exports.main = async (event) => {
  const { path } = event

  if (!path || typeof path !== 'string') {
    return {
      code: 400,
      msg: '缺少 path 参数',
    }
  }

  if (!isAllowedPath(path)) {
    return {
      code: 403,
      msg: '非法图片路径',
    }
  }

  const fileID = FILE_ID_PREFIX + path

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
      path,
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
