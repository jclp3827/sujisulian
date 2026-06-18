const { searchNotePoints, getNoteModule, getNoteCategory } = require("../models/note-catalog");

const SEARCH_BATCH_SIZE = 12;
const DEBOUNCE_MS = 250;

function getVisibleResults(results, count = SEARCH_BATCH_SIZE) {
  return results.slice(0, count);
}

Page({
  data: {
    module: null,
    category: null,
    keyword: "",
    results: [],
    visibleResults: [],
    resultRenderCount: SEARCH_BATCH_SIZE,
    hasMoreResults: false,
    scopeLabel: "全站笔记",
    inputFocused: true,
    hasQuery: false,
  },

  onLoad(options) {
    const module = options.moduleId ? getNoteModule(options.moduleId) : null;
    const category = module && options.categoryId ? getNoteCategory(options.moduleId, options.categoryId) : null;

    if (options.moduleId && !module) {
      wx.showToast({
        title: "索引不存在",
        icon: "none",
      });
      return;
    }

    wx.setNavigationBarTitle({
      title: module ? `${module.title}搜索` : "搜索知识点",
    });

    this.moduleId = module?.id || "";
    this.categoryId = category?.id || "";
    const scopeLabel = category ? `${module.title} · ${category.title}` : module ? module.title : "全站笔记";

    this.setData({
      module,
      category,
      scopeLabel,
      results: [],
      visibleResults: [],
      resultRenderCount: SEARCH_BATCH_SIZE,
      hasMoreResults: false,
      hasQuery: false,
    });
  },

  handleInput(event) {
    const keyword = event.detail.value || "";
    this.setData({ keyword });

    if (this._searchTimer) clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(() => {
      this._doSearch(keyword);
    }, DEBOUNCE_MS);
  },

  _doSearch(keyword) {
    const normalized = keyword.trim();
    const results = normalized ? searchNotePoints({
      moduleId: this.moduleId,
      categoryId: this.categoryId,
      keyword: normalized,
    }) : [];

    this.setData({
      hasQuery: Boolean(normalized),
      results,
      visibleResults: getVisibleResults(results),
      resultRenderCount: SEARCH_BATCH_SIZE,
      hasMoreResults: results.length > SEARCH_BATCH_SIZE,
    });
  },

  handleClear() {
    if (this._searchTimer) clearTimeout(this._searchTimer);
    this.setData({
      keyword: "",
      results: [],
      visibleResults: [],
      resultRenderCount: SEARCH_BATCH_SIZE,
      hasMoreResults: false,
      hasQuery: false,
      inputFocused: true,
    });
  },

  loadMoreResults() {
    const nextCount = Math.min(this.data.resultRenderCount + SEARCH_BATCH_SIZE, this.data.results.length);
    this.setData({
      resultRenderCount: nextCount,
      visibleResults: getVisibleResults(this.data.results, nextCount),
      hasMoreResults: nextCount < this.data.results.length,
    });
  },

  handleResultTap(event) {
    const { pointId, moduleId } = event.currentTarget.dataset;
    if (!pointId || !moduleId) return;

    wx.navigateTo({
      url: `/subpackages/note/detail/index?moduleId=${moduleId}&pointId=${pointId}`,
    });
  },

  onShareAppMessage() {
    return { title: '花生笔记搜索 - 行测知识点' };
  },
  onShareTimeline() {
    return { title: '花生笔记搜索 - 行测知识点' };
  },
});
