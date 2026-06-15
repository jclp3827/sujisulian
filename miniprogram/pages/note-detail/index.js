const { CLOUD_IMG_PREFIX, PLACEHOLDER_IMG } = require('../../utils/config/assets.js')
const { getNoteModule, getNoteCategory, getNotePoint, getPointTabs, getPointTab } = require("../../models/note-catalog");

const imageUrlCache = {}
const CLOUD_NOTE_ASSET_PREFIXES = ['graphic/', 'data-analysis/', 'quantity/']
const QUANTITY_MODULE_ID = 'quantity'

function isExampleTab(tab) {
  return tab?.id === 'example' || tab?.title === '例题讲解'
}

function getDisplayPoint(moduleId, point) {
  if (moduleId !== QUANTITY_MODULE_ID || !point?.relatedTraining) return point
  return { ...point, relatedTraining: null }
}

function getDisplayTabs(moduleId, point) {
  const tabs = getPointTabs(point)
  if (moduleId !== QUANTITY_MODULE_ID) return tabs

  const displayTabs = []
  let exampleBlocks = []

  tabs.forEach((tab) => {
    if (isExampleTab(tab)) {
      exampleBlocks = exampleBlocks.concat(tab.blocks || [])
      return
    }

    if (exampleBlocks.length) {
      const targetTab = displayTabs[displayTabs.length - 1] || tab
      targetTab.blocks = (targetTab.blocks || []).concat(exampleBlocks)
      exampleBlocks = []
    }

    displayTabs.push({ ...tab, blocks: [...(tab.blocks || [])] })
  })

  if (exampleBlocks.length) {
    const knowledgeTab = displayTabs.find((tab) => tab.id === 'knowledge') || displayTabs[0]
    if (knowledgeTab) {
      knowledgeTab.blocks = (knowledgeTab.blocks || []).concat(exampleBlocks)
    }
  }

  return displayTabs
}

function getDisplayTab(tabs, tabId) {
  return tabs.find((tab) => tab.id === tabId) || tabs[0] || null
}

function isCloudNoteAsset(src) {
  return src && CLOUD_NOTE_ASSET_PREFIXES.some((prefix) => src.startsWith(prefix))
}

function shouldUseAssetPrefix(src) {
  return src &&
    !src.startsWith('http://') &&
    !src.startsWith('https://') &&
    !src.startsWith('cloud://') &&
    !src.startsWith('/') &&
    !src.startsWith('./') &&
    !src.startsWith('../') &&
    !isCloudNoteAsset(src)
}

function decorateMindMapNodes(nodes) {
  return (nodes || []).map((node) => {
    const children = decorateMindMapNodes(node.children)
    let image = node.image
    if (node.image && isCloudNoteAsset(node.image.src)) {
      image = { ...node.image, originalSrc: node.image.src, src: '', isResolvingImage: true }
    } else if (node.image && shouldUseAssetPrefix(node.image.src)) {
      image = { ...node.image, src: CLOUD_IMG_PREFIX + node.image.src }
    }

    return {
      ...node,
      image,
      children,
      hasChildren: children.length > 0,
      isCollapsed: node.isCollapsed === true
    }
  })
}

function decorateBlockImage(image) {
  if (!image) return image
  if (isCloudNoteAsset(image.src)) {
    return { ...image, originalSrc: image.src, src: '', isResolvingImage: true }
  }
  if (shouldUseAssetPrefix(image.src)) {
    return { ...image, src: CLOUD_IMG_PREFIX + image.src }
  }
  return image
}

function setMindMapNodesCollapse(nodes, collapsed) {
  return (nodes || []).map((node) => ({
    ...node,
    isCollapsed: node.hasChildren ? collapsed : node.isCollapsed,
    children: setMindMapNodesCollapse(node.children, collapsed)
  }))
}

function decorateBlocks(blocks) {
  return (blocks || []).filter((block) => block.type !== "image-note" || Boolean(block.src)).map((block) => {
    const hasOptions = block.type === "example" && Array.isArray(block.options) && block.options.length > 0
    let decorated = {
      ...block,
      hasFormulaNodes: block.type === "formula" && Array.isArray(block.nodes) && block.nodes.length > 0,
      hasOptions
    }
    if (block.type === "image-note" && isCloudNoteAsset(block.src)) {
      decorated.originalSrc = block.src
      decorated.src = ''
      decorated.isResolvingImage = true
    } else if (block.type === "image-note" && shouldUseAssetPrefix(block.src)) {
      decorated.src = CLOUD_IMG_PREFIX + block.src
    }
    if (block.type === "example" && block.image) {
      decorated.image = decorateBlockImage(block.image)
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

function cloneWithResolvedImage(block, resolveImage) {
  if (block.type === 'image-note') {
    const source = block.originalSrc || block.src
    return resolveImage(source).then((src) => ({ ...block, src, loadFailed: !src, isResolvingImage: false }))
  }
  if (block.type === 'example' && block.image) {
    const source = block.image.originalSrc || block.image.src
    return resolveImage(source).then((src) => ({
      ...block,
      image: { ...block.image, src: src || '', loadFailed: !src, isResolvingImage: false }
    }))
  }
  if (block.type !== 'mind-map') return Promise.resolve(block)
  return resolveMindMapNodes(block.nodes, resolveImage).then((nodes) => ({ ...block, nodes }))
}

function resolveMindMapNodes(nodes, resolveImage) {
  return Promise.all((nodes || []).map((node) => {
    const imageSource = node.image?.originalSrc || node.image?.src
    return Promise.all([
      imageSource ? resolveImage(imageSource) : Promise.resolve(null),
      resolveMindMapNodes(node.children, resolveImage)
    ]).then(([src, children]) => ({
      ...node,
      image: node.image ? { ...node.image, src: src || '', loadFailed: !src, isResolvingImage: false } : node.image,
      children
    }))
  }))
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
    renderCount: 8,
    hasMore: false,
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

    const displayPoint = getDisplayPoint(module.id, point)
    const tabs = getDisplayTabs(module.id, point);
    const activeTabData = getDisplayTab(tabs, tabs[0]?.id) || getPointTab(point, tabs[0]?.id);

    const allBlocks = decorateBlocks(activeTabData?.blocks)
    this.setData({
      module,
      category,
      point: displayPoint,
      tabs,
      activeTab: activeTabData?.id || "knowledge",
      activeTabData,
      activeBlocks: allBlocks,
      renderCount: 8,
      hasMore: allBlocks.length > 8,
    });
    this.resolveActiveBlockImages()
  },

  handleTabTap(event) {
    const { tab } = event.currentTarget.dataset;
    if (!tab || tab === this.data.activeTab) return;
    const activeTabData = getDisplayTab(this.data.tabs, tab);
    const allBlocks = decorateBlocks(activeTabData?.blocks)
    this.setData({
      activeTab: activeTabData?.id || tab,
      activeTabData,
      activeBlocks: allBlocks,
      renderCount: 8,
      hasMore: allBlocks.length > 8,
    });
    this.resolveActiveBlockImages()
  },

  resolveImage(src) {
    if (!src || !isCloudNoteAsset(src)) return Promise.resolve(src)
    if (imageUrlCache[src]) return Promise.resolve(imageUrlCache[src])
    if (!wx.cloud) {
      console.warn('wx.cloud 未初始化，无法解析图片', src)
      return Promise.resolve(src)
    }

    return wx.cloud.callFunction({
      name: 'getImage',
      data: { path: src }
    }).then((res) => {
      if (res.result?.code === 0 && res.result.url) {
        imageUrlCache[src] = res.result.url
        return res.result.url
      }
      console.warn('getImage 返回异常', src, res.result)
      return ''
    }).catch((error) => {
      console.warn('getImage 调用失败', src, error)
      return ''
    })
  },

  resolveActiveBlockImages() {
    const { activeBlocks, activeTab } = this.data
    const token = `${activeTab}:${Date.now()}`
    this.resolveToken = token
    Promise.all(activeBlocks.map((block) => cloneWithResolvedImage(block, this.resolveImage.bind(this))))
      .then((resolvedBlocks) => {
        if (this.resolveToken !== token) return
        this.setData({ activeBlocks: resolvedBlocks })
      })
  },

  handleTrainingTap() {
    const training = this.data.point?.relatedTraining;
    if (!training) return;

    wx.navigateTo({
      url: `/pages/training/catalog/index?sectionId=${training.sectionId}&itemId=${training.itemId}`,
    });
  },

  loadMoreBlocks() {
    const { activeBlocks, renderCount } = this.data
    if (renderCount >= activeBlocks.length) return
    const newCount = Math.min(renderCount + 6, activeBlocks.length)
    this.setData({
      renderCount: newCount,
      hasMore: newCount < activeBlocks.length,
    })
  },

  onImageError(e) {
    const index = e.currentTarget.dataset.index
    let activeBlocks = this.data.activeBlocks
    console.warn('image-note 图片加载失败', activeBlocks[index]?.src, e.detail)
    if (activeBlocks[index] && activeBlocks[index].type === 'image-note') {
      activeBlocks[index].loadFailed = true
      activeBlocks[index].src = ''
      this.setData({ activeBlocks })
    }
  },

  onExampleImageError(e) {
    const index = e.currentTarget.dataset.index
    let activeBlocks = this.data.activeBlocks
    console.warn('example 图片加载失败', activeBlocks[index]?.image?.src, e.detail)
    if (activeBlocks[index] && activeBlocks[index].type === 'example' && activeBlocks[index].image) {
      activeBlocks[index].image.loadFailed = true
      activeBlocks[index].image.src = ''
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
      console.warn('mind-map 图片加载失败', node.image.src, e.detail)
      node.image.loadFailed = true
      node.image.src = ''
      this.setData({ activeBlocks })
    }
  },

  toggleMindMapNode(e) {
    const { blockIndex, nodeIndex, childIndex, grandIndex } = e.currentTarget.dataset
    const path = [nodeIndex]
    if (childIndex !== undefined) path.push(childIndex)
    if (grandIndex !== undefined) path.push(grandIndex)

    const activeBlocks = this.data.activeBlocks
    const block = activeBlocks[blockIndex]
    if (!block || block.type !== 'mind-map') return

    const node = getMindMapNodeByPath(block.nodes, path)
    if (!node || !node.hasChildren) return

    node.isCollapsed = !node.isCollapsed
    this.setData({ activeBlocks })
  },

  handleMindMapCollapseAll(e) {
    const { blockIndex, collapsed } = e.currentTarget.dataset
    const activeBlocks = this.data.activeBlocks
    const block = activeBlocks[blockIndex]
    if (!block || block.type !== 'mind-map') return

    block.nodes = setMindMapNodesCollapse(block.nodes, collapsed)
    this.setData({ activeBlocks })
  }
});
