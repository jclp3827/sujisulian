const { CLOUD_IMG_PREFIX, PLACEHOLDER_IMG } = require('../../utils/config/assets.js')
const { getNoteModule, getNoteCategory, getNotePoint, getPointTabs, getPointTab } = require("../../models/note-catalog");

function shouldUseAssetPrefix(src) {
  return src &&
    !src.startsWith('http://') &&
    !src.startsWith('https://') &&
    !src.startsWith('cloud://') &&
    !src.startsWith('/') &&
    !src.startsWith('./') &&
    !src.startsWith('../')
}

function decorateMindMapNodes(nodes) {
  return (nodes || []).map((node) => {
    const image = node.image && shouldUseAssetPrefix(node.image.src)
      ? { ...node.image, src: CLOUD_IMG_PREFIX + node.image.src }
      : node.image

    return {
      ...node,
      image,
      children: decorateMindMapNodes(node.children)
    }
  })
}

function decorateBlocks(blocks) {
  return (blocks || []).map((block) => {
    const hasOptions = block.type === "example" && Array.isArray(block.options) && block.options.length > 0
    let decorated = {
      ...block,
      hasFormulaNodes: block.type === "formula" && Array.isArray(block.nodes) && block.nodes.length > 0,
      hasOptions
    }
    if (block.type === "image-note" && shouldUseAssetPrefix(block.src)) {
      decorated.src = CLOUD_IMG_PREFIX + block.src
    }
    if (block.type === "mind-map") {
      decorated.nodes = decorateMindMapNodes(block.nodes)
    }
    return decorated
  })
}

function getMindMapNodeByPath(nodes, path) {
  let currentNode = nodes?.[path[0]]
  for (let index = 1; index < path.length && currentNode; index += 1) {
    currentNode = currentNode.children?.[path[index]]
  }
  return currentNode
}

Page({
  data: {
    module: null,
    category: null,
    point: null,
    tabs: [],
    activeTab: "knowledge",
    activeTabData: null,
    activeBlocks: [],
    // Block级懒加载：初始渲染数量
    renderCount: 8,
    // 是否还有更多内容
    hasMore: false,
    // 占位图地址
    placeholderImg: PLACEHOLDER_IMG.ERROR
  },

  onLoad(options) {
    const module = getNoteModule(options.moduleId);
    const point = getNotePoint(options.moduleId, options.pointId);
    const category = point ? getNoteCategory(options.moduleId, point.categoryId) : null;

    if (!module || !point || !category) {
      wx.showToast({
        title: "知识点不存在",
        icon: "none",
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: point.title,
    });

    const tabs = getPointTabs(point);
    const activeTabData = getPointTab(point, tabs[0]?.id);

    const allBlocks = decorateBlocks(activeTabData?.blocks)
    this.setData({
      module,
      category,
      point,
      tabs,
      activeTab: activeTabData?.id || "knowledge",
      activeTabData,
      activeBlocks: allBlocks,
      renderCount: 8,
      hasMore: allBlocks.length > 8,
    });
  },

  handleTabTap(event) {
    const { tab } = event.currentTarget.dataset;
    if (!tab || tab === this.data.activeTab) return;
    const activeTabData = getPointTab(this.data.point, tab);
    const allBlocks = decorateBlocks(activeTabData?.blocks)
    this.setData({
      activeTab: activeTabData?.id || tab,
      activeTabData,
      activeBlocks: allBlocks,
      renderCount: 8,
      hasMore: allBlocks.length > 8,
    });
  },

  handleTrainingTap() {
    const training = this.data.point?.relatedTraining;
    if (!training) return;

    wx.navigateTo({
      url: `/pages/training/catalog/index?sectionId=${training.sectionId}&itemId=${training.itemId}`,
    });
  },

  // Block级懒加载：加载更多
  loadMoreBlocks() {
    const { activeBlocks, renderCount } = this.data
    if (renderCount >= activeBlocks.length) return
    const newCount = Math.min(renderCount + 6, activeBlocks.length)
    this.setData({
      renderCount: newCount,
      hasMore: newCount < activeBlocks.length,
    })
  },

  // 图片加载失败处理
  onImageError(e) {
    const index = e.currentTarget.dataset.index
    let activeBlocks = this.data.activeBlocks
    if (activeBlocks[index] && activeBlocks[index].type === 'image-note') {
      activeBlocks[index].src = this.data.placeholderImg
      this.setData({ activeBlocks })
    }
  },

  onMindMapImageError(e) {
    const { blockIndex, nodeIndex, childIndex, grandIndex } = e.currentTarget.dataset
    const path = [nodeIndex]
    if (childIndex !== undefined) path.push(childIndex)
    if (grandIndex !== undefined) path.push(grandIndex)

    let activeBlocks = this.data.activeBlocks
    const block = activeBlocks[blockIndex]
    if (!block || block.type !== 'mind-map') return

    const node = getMindMapNodeByPath(block.nodes, path)
    if (node && node.image) {
      node.image.src = this.data.placeholderImg
      this.setData({ activeBlocks })
    }
  }
});
