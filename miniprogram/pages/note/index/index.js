const { withEntryTapGuard } = require('../../../utils/module-home-navigation');
const summary = require('../../../models/note-summary');
const modes = require('../../../models/notes-entry');
Page(withEntryTapGuard({
  data: { totalPointCount: summary.totalPointCount, subjectCount: summary.subjects.length, keyword: '', modes, primaryMode: modes.find((mode) => mode.id === 'basic'), otherModes: modes.filter((mode) => mode.id !== 'basic') },
  onLoad() { wx.setNavigationBarTitle({ title: '花生笔记' }); },
  onShow() { const bar = this.getTabBar && this.getTabBar(); if (bar) bar.setData({ selected: 1 }); },
  handleInput(event) { this.setData({ keyword: event.detail.value }); },
  handleSearchTap() {
    const keyword = String(this.data.keyword || '').trim();
    wx.navigateTo({ url: `/subpackages/note/search/index?scope=notes${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}` });
  },
  handleDirectoryTap() { wx.navigateTo({ url: '/subpackages/note/directory/index' }); },
  handlePracticeTap(event) {
    const mode = this.data.modes.find((item) => item.id === event.currentTarget.dataset.kind);
    if (!mode) return;
    if (!mode.enabled) { wx.showToast({ title: '这类练习正在建设中，可先查阅笔记', icon: 'none' }); return; }
    const page = mode.id === 'application' ? 'practice' : 'memory';
    wx.navigateTo({ url: `/subpackages/note/${page}/index?kind=${mode.id}` });
  },
  onShareAppMessage() { return { title: '花生笔记 - 查方法，练解题' }; },
  onShareTimeline() { return { title: '花生笔记 - 查方法，练解题' }; },
}, ['handleSearchTap', 'handleDirectoryTap', 'handlePracticeTap']));
