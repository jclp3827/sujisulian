const { buildDirectory, detailUrl } = require('../services/note-directory');
const POSITION_KEY = 'notesDirectory:v1:position';
Page({
  data: { subjects: [], categories: [], sections: [], subjectId: '', categoryId: 'all', totalPointCount: 0, pointCount: 0, error: '' },
  onLoad(options = {}) {
    this.directory = buildDirectory(); let saved = {};
    try { saved = wx.getStorageSync(POSITION_KEY) || {}; } catch (_) { /* Browsing remains available. */ }
    const explicit = options.subjectId || options.moduleId;
    const subjectId = explicit || (this.directory.some((s) => s.id === saved.subjectId) ? saved.subjectId : this.directory[0].id);
    const subject = this.directory.find((s) => s.id === subjectId);
    const categoryId = options.categoryId || (!explicit && subject?.categories.some((c) => c.id === saved.categoryId) ? saved.categoryId : 'all');
    this.setData({ subjects: this.directory.map((s) => ({ id: s.id, title: s.title, pointCount: s.pointCount })), totalPointCount: this.directory.reduce((n, s) => n + s.pointCount, 0) });
    this.select(subjectId, categoryId);
  },
  select(subjectId, categoryId = 'all') {
    const subject = this.directory.find((s) => s.id === subjectId);
    if (!subject || categoryId !== 'all' && !subject.categories.some((c) => c.id === categoryId)) { this.setData({ error: '所选科目或专题不存在', sections: [] }); return; }
    const sections = subject.categories.filter((c) => categoryId === 'all' || c.id === categoryId);
    this.setData({ subjectId, categoryId, categories: [{ id: 'all', title: '全部专题' }, ...subject.categories], sections,
      pointCount: sections.reduce((n, c) => n + c.points.length, 0), error: '' });
    wx.setNavigationBarTitle({ title: '全部笔记' });
    try { wx.setStorageSync(POSITION_KEY, { subjectId, categoryId }); } catch (_) { /* No saved-state claim. */ }
  },
  handleSubject(event) { this.select(event.currentTarget.dataset.id); },
  handleCategory(event) { this.select(this.data.subjectId, event.currentTarget.dataset.id); },
  handlePoint(event) {
    const url = detailUrl({ subjectId: this.data.subjectId, pointId: event.currentTarget.dataset.id });
    if (url) wx.navigateTo({ url }); else wx.showToast({ title: '知识点暂不可用', icon: 'none' });
  },
  handleSearch() {
    wx.navigateTo({ url: `/subpackages/note/search/index?moduleId=${encodeURIComponent(this.data.subjectId)}${this.data.categoryId !== 'all' ? `&categoryId=${encodeURIComponent(this.data.categoryId)}` : ''}` });
  },
  handleHome() { wx.switchTab({ url: '/pages/note/index/index' }); },
});
