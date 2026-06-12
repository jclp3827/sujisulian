/**
 * 全局资源配置文件
 * 统一管理所有资源路径、云存储前缀
 */

// 微信云存储公开读域名（替换成你的实际云存储域名）
export const CLOUD_IMG_PREFIX = 'https://636c-cloud1-d8gw5r2il0c0f198a-1317757209.tcb.qcloud.la/note-resources/'

// 各模块资源路径前缀
export const ASSETS_PATH = {
  // 图形推理模块图片
  GRAPHIC: 'graphic/',
  // 公式图片（备用方案）
  FORMULA: 'formula/',
  // 思维导图图片
  MIND_MAP: 'mindmap/',
  // 通用占位图
  PLACEHOLDER: 'placeholder/'
}

// 占位图路径
export const PLACEHOLDER_IMG = {
  // 图片加载失败占位图
  ERROR: `${CLOUD_IMG_PREFIX}${ASSETS_PATH.PLACEHOLDER}error.png`,
  // 图片加载中占位图
  LOADING: `${CLOUD_IMG_PREFIX}${ASSETS_PATH.PLACEHOLDER}loading.gif`
}
