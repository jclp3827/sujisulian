const CLOUD_IMG_PREFIX = 'https://636c-cloud1-d8gw5r2il0c0f198a-1317757209.tcb.qcloud.la/note-resources/'
const PLACEHOLDER_IMG = {
  ERROR: `${CLOUD_IMG_PREFIX}placeholder/error.png`,
  LOADING: `${CLOUD_IMG_PREFIX}placeholder/loading.gif`,
}
const { getNoteModule, getNoteCategory, getNotePoint, getPointTabs, getPointTab } = require("../models/note-catalog");
const { buildTrainingConfig } = require("../../../models/train-config");
const { getTrainingItem } = require("../../../models/train-catalog");
const { trainingUrl } = require('../services/training-launch');
const { fingerprint } = require('../services/learning-content');

const { normalizeCloudNoteAsset, isCloudNoteAsset, resolveNoteImage } = require('../services/note-assets');
const QUANTITY_MODULE_ID = 'quantity'
const THEME_GREEN = '#33c47a'
const WARNING_ORANGE = '#d97706'

const { getDisplayPoint, getDisplayTabs, getDisplayTab, resolveDisplayTab } = require('../services/note-presentation');

const {getReadingReview,shouldUseAssetPrefix,decorateMindMapNodes,setMindMapNodesCollapseDeep,resetMindMapChildrenDefault,decorateFormulaBlock,stripHtml,escapeHtml,buildHighlightedRichText,decorateTextEntries,stripRepeatedHierarchyPrefix,decorateHierarchicalListEntries,measureTextUnits,clampNumber,getTableColumnKind,isTableAccentColumn,getTableColumnMeta,getTableGridTemplate,getTableMinWidth,extractHighlightWords,highlightText,normalizeThemeGreenRichText,getTableCellRichText,decorateTableBlock,decorateBlockImage,decorateTimelineEntries,getBlockAnchorLabel,buildSectionAnchors,decorateBlocks,getMindMapAllCollapsed,getMindMapNodeByPath,cloneWithResolvedImage,resolveMindMapNodes}=require('../services/note-blocks');

Page({
  data: {
    module: null,
    category: null,
    point: null,
    tabs: [],
    activeTab: "knowledge",
    activeTabData: null,
    activeBlocks: [],
    sectionAnchors: [],
    readingMeta: null,
    isReadingPrototype: false,
    activeReview: [],
    renderCount: 8,
    hasMore: false,
    sourceError: "",
    placeholderImg: PLACEHOLDER_IMG.ERROR
  },

  onLoad(options) {
    const module = getNoteModule(options.moduleId);
    const point = getNotePoint(options.moduleId, options.pointId);
    const category = point ? getNoteCategory(options.moduleId, point.categoryId) : null;

    if (!module || !point || !category) {
      this.setData({ sourceError: "知识点不存在，可返回全部笔记重新查找" });
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
    const activeTabData = resolveDisplayTab(module.id, point, options.tabId);
    if (!activeTabData) {
      this.setData({ sourceError: "原页签已变更，请从全部笔记重新查找" });
      return;
    }

    const allBlocks = decorateBlocks(activeTabData?.blocks)
    const readingMeta = displayPoint.readingMeta || null
    this.setData({
      module,
      category,
      point: displayPoint,
      tabs,
      activeTab: activeTabData?.id || "knowledge",
      activeTabData,
      activeBlocks: allBlocks,
      sectionAnchors: buildSectionAnchors(allBlocks),
      readingMeta,
      isReadingPrototype: Boolean(readingMeta),
      activeReview: getReadingReview(readingMeta),
      renderCount: 8,
      hasMore: allBlocks.length > 8,
    });
    this.resolveActiveBlockImages()

  },

  handleTabTap(event) {
    const { tab } = event.currentTarget.dataset;
    if (!tab || tab === this.data.activeTab) return;
    const activeTabData = getDisplayTab(this.data.tabs, tab);
    if (!activeTabData) { wx.showToast({ title: "页签不存在", icon: "none" }); return; }
    const allBlocks = decorateBlocks(activeTabData?.blocks)
    this.setData({
      activeTab: activeTabData?.id || tab,
      activeTabData,
      activeBlocks: allBlocks,
      sectionAnchors: buildSectionAnchors(allBlocks),
      activeReview: getReadingReview(this.data.readingMeta),
      renderCount: 8,
      hasMore: allBlocks.length > 8,
    });
    wx.pageScrollTo({ scrollTop: 0, duration: 0 })
    this.resolveActiveBlockImages()
  },

  handleKnowledgeImageLoad() {},
  handleKnowledgeImageTap(event) { const src=event.currentTarget.dataset.src;if(src)wx.previewImage({current:src,urls:[src]}); },
  handleDirectory() { wx.navigateTo({ url: '/subpackages/note/directory/index' }); },

  handleSectionAnchorTap(event) {
    const { anchor } = event.currentTarget.dataset;
    const index = this.data.activeBlocks.findIndex((block) => block.anchorId === anchor);
    if (index < 0) return;
    const locate = () => {
      const query = wx.createSelectorQuery();
      query.select(`#${anchor}`).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((result) => {
        const rect = result?.[0], viewport = result?.[1];
        if (rect) wx.pageScrollTo({ scrollTop: Math.max(0, rect.top + (viewport?.scrollTop || 0) - 16), duration: 240 });
      });
    };
    if (index >= this.data.renderCount) {
      const renderCount = index + 1;
      this.setData({ renderCount, hasMore: renderCount < this.data.activeBlocks.length }, locate);
    } else locate();
  },

  resolveImage(src) { return resolveNoteImage(wx, src); },

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

  handleExampleExposure(event) {
    const block = this.data.activeBlocks[event.detail.blockIndex];
    if (!block || !this.data.module || !this.data.point) return;
    try {
      require('../services/practice-runtime').recordExampleExposure(wx, this.data.module.id, this.data.point.id, block.sourceBlockFingerprint);
    } catch (error) { wx.showToast({ title: error.message, icon: 'none' }); }
  },
  handleTrainingTap() {
    const training = this.data.point?.relatedTraining;
    if (!training) return;
    const url = trainingUrl(training);
    if (url) wx.navigateTo({ url }); else wx.showToast({ title: '训练项暂不可用', icon: 'none' });
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
    const index = e.detail?.index
    let activeBlocks = this.data.activeBlocks
    console.warn('example 图片加载失败', activeBlocks[index]?.image?.src, e.detail?.error)
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
    return { title, path: `/subpackages/note/detail/index?moduleId=${encodeURIComponent(this.data.module?.id || "")}&pointId=${encodeURIComponent(this.data.point?.id || "")}&tabId=${encodeURIComponent(this.data.activeTab || "")}` };
  },
  onShareTimeline() {
    const title = this.data.point ? `花生笔记 - ${this.data.point.title}` : '花生笔记';
    return { title, query: `moduleId=${encodeURIComponent(this.data.module?.id || "")}&pointId=${encodeURIComponent(this.data.point?.id || "")}&tabId=${encodeURIComponent(this.data.activeTab || "")}` };
  },
});
