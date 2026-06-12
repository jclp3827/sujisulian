/**
 * 云更新框架 - 支持从云端加载知识点数据（JSON格式）
 * 当前版本：本地优先 + 云端检查
 * 
 * 使用方式：
 *   1. 在云存储上部署 JSON 文件（如 note-resources/data/data-analysis.json）
 *   2. 在 config/assets.js 中配置 CLOUD_DATA_PREFIX
 *   3. 调用 CloudData.loadModule('data-analysis') 尝试获取云端版本
 *   4. 云端版本有更新时自动缓存，无更新时使用本地 require
 */

const { CLOUD_IMG_PREFIX } = require('./config/assets.js')

// 云数据根路径（和图片同一云存储环境）
const CLOUD_DATA_PREFIX = CLOUD_IMG_PREFIX.replace('/note-resources/', '/note-resources/data/')

// 本地缓存 key 前缀
const CACHE_KEY_PREFIX = 'cloud_data_'
// 缓存有效期（24小时，单位 ms）
const CACHE_TTL = 24 * 60 * 60 * 1000

const CloudData = {
  /**
   * 尝试从云端加载模块数据
   * @param {string} moduleId - 模块ID，如 'data-analysis'
   * @returns {Promise<Object|null>} - 云端数据或 null（加载失败时）
   */
  async loadModule(moduleId) {
    const cacheKey = CACHE_KEY_PREFIX + moduleId
    try {
      // 1. 检查本地缓存
      const cached = wx.getStorageSync(cacheKey)
      if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data
      }

      // 2. 尝试从云端获取
      const url = CLOUD_DATA_PREFIX + moduleId + '.json'
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url,
          method: 'GET',
          timeout: 5000,
          success: resolve,
          fail: reject,
        })
      })

      if (res.statusCode === 200 && res.data) {
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        // 3. 缓存到本地
        wx.setStorageSync(cacheKey, { data, timestamp: Date.now() })
        return data
      }
      return null
    } catch (e) {
      // 云端加载失败，返回缓存（即使过期）
      try {
        const cached = wx.getStorageSync(cacheKey)
        if (cached && cached.data) return cached.data
      } catch (_) {}
      return null
    }
  },

  /**
   * 清除指定模块的云端缓存
   * @param {string} moduleId
   */
  clearCache(moduleId) {
    try {
      wx.removeStorageSync(CACHE_KEY_PREFIX + moduleId)
    } catch (_) {}
  },

  /**
   * 清除所有云端缓存
   */
  clearAllCache() {
    try {
      const info = wx.getStorageInfoSync()
      info.keys.forEach(key => {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          wx.removeStorageSync(key)
        }
      })
    } catch (_) {}
  },

  /**
   * 获取模块数据（云端优先，本地兜底）
   * 用法: const data = await CloudData.getModule('data-analysis', localRequireFn)
   * @param {string} moduleId
   * @param {Function} localFallback - 本地 require 函数，如 () => require('../models/note-data-analysis.js')
   * @returns {Promise<Object>}
   */
  async getModule(moduleId, localFallback) {
    const cloudData = await this.loadModule(moduleId)
    if (cloudData && cloudData.points && cloudData.points.length > 0) {
      return cloudData
    }
    // 云端没有或加载失败，用本地
    return localFallback()
  }
}

module.exports = CloudData
