const CLOUD_IMG_PREFIX = 'https://636c-cloud1-d8gw5r2il0c0f198a-1317757209.tcb.qcloud.la/note-resources/'
const PLACEHOLDER_IMG = {
  ERROR: `${CLOUD_IMG_PREFIX}placeholder/error.png`,
  LOADING: `${CLOUD_IMG_PREFIX}placeholder/loading.gif`,
}
const { getNoteModule, getNoteCategory, getNotePoint, getPointTabs, getPointTab } = require("../models/note-catalog");
const { buildTrainingConfig } = require("../../../models/train-config");
const { getTrainingItem } = require("../../../models/train-catalog");

const imageUrlCache = {}
const CLOUD_NOTE_ASSET_PREFIXES = ['graphic/', 'data-analysis/', 'quantity/', 'logic/']
const QUANTITY_MODULE_ID = 'quantity'
const THEME_GREEN = '#33c47a'

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

function decorateMindMapNodes(nodes, depth = 1) {
  return (nodes || []).map((node) => {
    const children = decorateMindMapNodes(node.children, depth + 1)
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
      isCollapsed: depth >= 3,
    }
  })
}

function setMindMapNodesCollapseDeep(nodes, collapsed) {
  return (nodes || []).map((node) => ({
    ...node,
    isCollapsed: collapsed,
    children: setMindMapNodesCollapseDeep(node.children, collapsed),
  }))
}

function resetMindMapChildrenDefault(nodes, depth = 1) {
  return (nodes || []).map((node) => ({
    ...node,
    isCollapsed: depth >= 3,
    children: resetMindMapChildrenDefault(node.children, depth + 1),
  }))
}

function decorateFormulaBlock(block) {
  if (block.type !== "formula" || !block.content) return block
  const parts = String(block.content).split(/。(.+)?/).filter(Boolean)
  const content = parts[0] || ""
  const description = parts.length > 1 ? parts.slice(1).join("。") : ""
  const hasSemicolon = content.includes("；")
  return {
    ...block,
    content,
    description,
    contentLines: hasSemicolon ? content.split(/；/).map((s) => s.trim()).filter(Boolean) : null,
  }
}

function stripHtml(value) {
  return String(value ?? '').replace(/<[^>]*>/g, '')
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function measureTextUnits(value) {
  return Array.from(stripHtml(value)).reduce((total, char) => {
    return total + (/^[\x00-\x7F]$/.test(char) ? 0.55 : 1)
  }, 0)
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getTableColumnKind(column) {
  const name = String(column || '').trim()
  if (name === '序号' || name === '编号') return 'index'
  if (name === '成语' || name === '词语') return 'term'
  return 'content'
}

function isTableAccentColumn(column, kind) {
  const name = String(column || '').trim()
  return kind === 'term' || name === '口诀' || name === '误用' || name === '易错点'
}

function getTableColumnMeta(columns = [], rows = []) {
  const columnCount = columns.length
  return columns.map((column, columnIndex) => {
    const kind = getTableColumnKind(column)
    const maxUnits = Math.max(
      measureTextUnits(column),
      ...(rows || []).map((row) => measureTextUnits(row?.[columnIndex]))
    )
    let template = columnCount > 2 ? 'minmax(220rpx, 1fr)' : 'minmax(0, 1fr)'

    if (kind === 'index') {
      template = `${Math.round(clampNumber(maxUnits * 28 + 44, 96, 124))}rpx`
    } else if (kind === 'term') {
      template = `${Math.round(clampNumber(maxUnits * 26 + 36, 104, 168))}rpx`
    }

    const kindClass = `note-table-cell-${kind}`
    const accentClass = isTableAccentColumn(column, kind) ? ' note-table-cell-accent' : ''
    return {
      kind,
      template,
      headerClassName: kindClass,
      cellClassName: `${kindClass}${accentClass}`,
    }
  })
}

function getTableGridTemplate(columnMeta = []) {
  return columnMeta.map((column) => column.template).join(' ')
}

function getTableMinWidth(columnMeta = []) {
  const columnCount = columnMeta.length
  if (columnCount <= 2) return '100%'
  if (columnMeta.some((column) => column.kind === 'term')) return '100%'
  const minWidth = columnMeta.reduce((total, column) => {
    const fixed = /^([0-9]+)rpx$/.exec(column.template)
    return total + (fixed ? Number(fixed[1]) : 220)
  }, 0)
  return `${Math.max(720, minWidth)}rpx`
}

function extractHighlightWords(text) {
  if (!text) return []
  const words = []
  const matches = text.match(/用([^\uff0c,]+)/g)
  if (matches) {
    for (const m of matches) {
      const word = m.slice(1).trim()
      if (word) words.push(word)
    }
  }
  return words
}

function highlightText(text, words) {
  if (!text || !words.length) return null
  let result = text
  const sorted = [...words].sort((a, b) => b.length - a.length)
  for (const word of sorted) {
    if (!word) continue
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    result = result.replace(
      new RegExp(escaped, 'g'),
      `<span style="color:${THEME_GREEN};font-weight:700;">${word}</span>`
    )
  }
  return result
}

function normalizeThemeGreenRichText(text) {
  return String(text).replace(/color\s*:\s*#c0392b/gi, `color:${THEME_GREEN}`)
}

function getTableCellRichText(text, columnMeta, isWordRhyme, allWords) {
  if (isWordRhyme) return highlightText(text, allWords)
  if (columnMeta?.kind === 'term') {
    if (typeof text === 'string' && /<\w+/.test(text)) return normalizeThemeGreenRichText(text)
    return `<span style="color:${THEME_GREEN};font-weight:700;">${escapeHtml(text)}</span>`
  }
  if (typeof text === 'string' && /<\w+/.test(text)) return normalizeThemeGreenRichText(text)
  return null
}

function decorateTableBlock(block) {
  if (block.type !== 'table') return block
  const isWordRhyme = block.label && String(block.label).includes('常考实词口诀')
  const columnMeta = getTableColumnMeta(block.columns || [], block.rows || [])
  let allWords = []
  if (isWordRhyme) {
    for (const row of (block.rows || [])) {
      for (const cell of row) {
        allWords = allWords.concat(extractHighlightWords(cell))
      }
    }
    allWords = [...new Set(allWords)]
  }
  return {
    ...block,
    columnMeta,
    gridTemplateColumns: getTableGridTemplate(columnMeta),
    tableMinWidth: getTableMinWidth(columnMeta),
    rows: (block.rows || []).map((row, rowIndex) => row.map((cell, cellIndex) => {
      const text = cell
      const richText = getTableCellRichText(text, columnMeta[cellIndex], isWordRhyme, allWords)
      return {
        text,
        richText,
        className: columnMeta[cellIndex]?.cellClassName || 'note-table-cell-content',
        nodes: block.cellNodes ? block.cellNodes[`${rowIndex}-${cellIndex}`] || null : null
      }
    }))
  }
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

function decorateBlocks(blocks) {
  return (blocks || []).filter((block) => block.type !== "image-note" || Boolean(block.src)).map((block) => {
    let processedBlock = decorateFormulaBlock(block)
    processedBlock = decorateTableBlock(processedBlock)
    const hasOptions = processedBlock.type === "example" && Array.isArray(processedBlock.options) && processedBlock.options.length > 0
    let decorated = {
      ...processedBlock,
      hasFormulaNodes: processedBlock.type === "formula" && Array.isArray(processedBlock.nodes) && processedBlock.nodes.length > 0,
      hasFormulaContent: processedBlock.type === "formula" && Boolean(processedBlock.content),
      hasFormulaLines: processedBlock.type === "formula" && Array.isArray(processedBlock.contentLines) && processedBlock.contentLines.length > 1,
      hasOptions
    }
    if (processedBlock.type === "image-note" && isCloudNoteAsset(processedBlock.src)) {
      decorated.originalSrc = processedBlock.src
      decorated.src = ''
      decorated.isResolvingImage = true
    } else if (processedBlock.type === "image-note" && shouldUseAssetPrefix(processedBlock.src)) {
      decorated.src = CLOUD_IMG_PREFIX + processedBlock.src
    }
    if (processedBlock.type === "example" && processedBlock.image) {
      decorated.image = decorateBlockImage(processedBlock.image)
    }
    if (processedBlock.type === "mind-map") {
      decorated.nodes = decorateMindMapNodes(processedBlock.nodes)
      decorated.allCollapsed = getMindMapAllCollapsed(decorated.nodes)
    }
    return decorated
  })
}

function getMindMapAllCollapsed(nodes) {
  return (nodes || []).every((node) => {
    return !node.hasChildren || node.isCollapsed === true
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
    const item = getTrainingItem(training.sectionId, training.itemId)
    if (!item) {
      wx.showToast({
        title: "训练项不存在",
        icon: "none",
      })
      return
    }

    const payload = encodeURIComponent(JSON.stringify(buildTrainingConfig(item)))
    wx.navigateTo({
      url: `/pages/training/session/index?sectionId=${training.sectionId}&itemId=${training.itemId}&config=${payload}`,
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

    const willExpand = node.isCollapsed
    node.isCollapsed = !node.isCollapsed
    if (willExpand) {
      node.children = resetMindMapChildrenDefault(node.children, path.length + 1)
    }
    block.allCollapsed = getMindMapAllCollapsed(block.nodes)
    this.setData({ activeBlocks })
  },

  toggleMindMapAll(e) {
    const { blockIndex } = e.currentTarget.dataset
    const activeBlocks = this.data.activeBlocks
    const block = activeBlocks[blockIndex]
    if (!block || block.type !== 'mind-map') return

    const allCollapsed = getMindMapAllCollapsed(block.nodes)
    block.nodes = setMindMapNodesCollapseDeep(block.nodes, !allCollapsed)
    block.allCollapsed = !allCollapsed
    this.setData({ activeBlocks })
  },

  onShareAppMessage() {
    const title = this.data.point ? `花生笔记 - ${this.data.point.title}` : '花生笔记';
    return { title };
  },
  onShareTimeline() {
    const title = this.data.point ? `花生笔记 - ${this.data.point.title}` : '花生笔记';
    return { title };
  },
});
