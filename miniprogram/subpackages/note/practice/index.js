const { resolveNoteImage } = require('../services/note-assets');
const modes = require('../models/legacy-modes');
const { createPractice, sourceLabel } = require('../services/practice-runtime');
const { buildDirectory, detailUrl } = require('../services/note-directory');
const { STORAGE_KEY } = require('../services/practice-session');
Page({
  data: { kind: '', title: '', state: 'loading', sessionId: '', card: null, answer: {}, draftValue: '',
    images: [], imagesReady: true, imagesLoading: false, imagesFailed: false,
    index: 0, total: 0, progress: 0, result: null, notice: '', development: false, settingsOpen: false,
    subjects: [], topics: [], draftSubjectIndex: 0, draftTopicIndex: 0, draftCount: 5, scopeLabel: '', oversized: 0, corrupt: false },
  onLoad(options = {}) {
    this.options = options;
    const mode = modes.find((m) => m.id === options.kind);
    if (!mode || !mode.enabled) { this.setData({ state: 'unavailable', notice: '这类练习正在建设中，可以先查阅全部笔记' }); return; }
    this.directory = buildDirectory();
    this.setData({ kind: mode.id, title: mode.title, subjects: [{ id: 'all', title: '全部科目' }, ...this.directory.map((s) => ({ id: s.id, title: s.title }))] });
    wx.setNavigationBarTitle({ title: mode.title });
    if (options.subjectId && !this.directory.some((s) => s.id === options.subjectId)) { this.setData({ state: 'unavailable', notice: '所选科目不存在' }); return; }
    this.requestedScope = options.subjectId ? { subjectId: options.subjectId, categoryId: options.categoryId || 'all', pointId: options.pointId || '', ...(options.scopeMode ? {scopeMode:options.scopeMode} : {}), ...(options.sourceSubjectId ? {sourceSubjectId:options.sourceSubjectId} : {}), ...(options.sourceTabId ? {sourceTabId:options.sourceTabId} : {}) } : undefined;
    this.begin(); this.loaded = true; this.restorePosition();
  },
  onShow() {
    if (!this.loaded || !this.data.sessionId) return;
    this.run(() => { this.runtime = createPractice(wx); const s = this.runtime.engine.getSession(this.data.sessionId);
      if (!s) this.setData({ state: 'expired', notice: '这组内容已更新，请重新开始' }); else { this.render(s); this.restorePosition(); } });
  },
  onHide() { if (this.data.state === 'question' && this.data.sessionId) this.run(() => this.runtime.engine.savePosition(this.data.sessionId, this.scrollTop || 0)); },
  onPageScroll(event) { this.scrollTop = event.scrollTop; },
  run(fn) { try { fn(); return true; } catch (error) {
    this.setData({ notice: error.message || '暂时无法继续，请重试', corrupt: error.code === 'CORRUPT' });
    if (!this.data.sessionId || error.code === 'EXPIRED') this.setData({ state: error.code === 'EXPIRED' ? 'expired' : 'error' });
    return false;
  } },
  begin(fresh = false, allowOversize = false) {
    this.run(() => {
      this.runtime = createPractice(wx); this.setData({ development: this.runtime.development, notice: '', corrupt: false });
      if (!fresh && this.options.sessionId) {
        const existing = this.runtime.engine.getSession(this.options.sessionId);
        if (!existing || existing.kind !== this.data.kind) { this.setData({ state: 'expired', notice: '原练习已失效，请重新开始' }); return; }
        this.render(existing); return;
      }
      const next = this.runtime.engine.start({ kind: this.data.kind, scope: this.requestedScope, fresh, allowOversize });
      if (next.expired) { this.setData({ state: 'expired', notice: next.reason }); return; }
      if (next.oversized) { this.setData({ state: 'oversized', oversized: next.oversized, notice: `完整材料共 ${next.oversized} 题，可整组练习或调整范围` }); return; }
      if (!next.session) { this.setData({ state: 'empty', sessionId: '', card: null, notice: next.reason }); return; }
      this.render(next.session);
    });
  },
  render(session) {
    const completed = session.index >= session.items.length, item = session.items[session.index];
    const answer = item ? session.answers[item.instanceId] || {} : {};
    const scope = session.scope, subject = this.directory.find((s) => s.id === scope.subjectId);
    const topic = subject?.categories.find((c) => c.id === scope.categoryId);
    if (this.activeSession?.items[this.activeSession.index]?.instanceId !== item?.instanceId) this.scrollTop = answer.position || 0;
    const imageChanged = this.imageInstanceId !== item?.instanceId;
    this.activeSession = session;
    this.setData({ state: completed ? 'finished' : 'question', sessionId: session.id,
      card: item ? { ...item, sources: item.refs.map((ref, index) => ({ index, label: sourceLabel(ref) })),
        taskLabel: ({ recall: '知识记忆', contrast: '对照辨析', 'bounded-trial': '小任务试用', 'complete-application': '笔记原题' })[item.assessment?.taskType] || '',
        distractors: (item.options || []).filter((o) => o.key !== item.answer).map((o) => ({ key: o.key, reason: item.distractorReasons?.[o.key] || '' })),
        sourceLabel: item.sourceKind === 'generated' ? '生成练习' : item.sourceKind === 'legacy-unverified' ? '笔记例题（题源待核）' : '自编练习' } : null,
      answer, draftValue: answer.value || '', index: session.index + 1, total: session.items.length,
      progress: Math.round(100 * session.index / session.items.length), result: this.runtime.engine.result(session.id),
      scopeLabel: `${subject?.title || '全部科目'} · ${topic?.title || '全部专题'}`, notice: '', oversized: 0 });
    if (imageChanged) this.prepareImages(item);
  },
  prepareImages(item, refresh = false) {
    this.imageInstanceId = item?.instanceId || ''; const instanceId = this.imageInstanceId;
    this.imageGeneration = (this.imageGeneration || 0) + 1; const generation = this.imageGeneration;
    const images = [...(item?.material?.images || []).map((v) => ({ ...v, id: `material-${v.id}` })), ...(item?.images || [])].map((v) => ({ ...v, instanceId, generation, url: '', loaded: false, failed: false }));
    this.setData({ images, imagesReady: !images.length, imagesLoading: !!images.length, imagesFailed: false });
    if (!images.length) return;
    if (!this.run(() => this.runtime.engine.setImageReady(this.data.sessionId, instanceId, false))) return;
    Promise.all(images.map((v) => resolveNoteImage(wx, v.src, refresh).then((url) => ({ ...v, url, failed: !url }))))
      .then((resolved) => { if (this.imageInstanceId !== instanceId || this.imageGeneration !== generation) return;
        this.setData({ images: resolved, imagesFailed: resolved.some((v) => v.failed), imagesLoading: false }); });
  },
  handleImageLoad(event) { this.updateImage(event, true); },
  handleImageError(event) { this.updateImage(event, false); },
  updateImage(event, loaded) {
    const { id, instance, generation } = event.currentTarget.dataset;
    if (instance !== this.imageInstanceId || Number(generation) !== this.imageGeneration) return;
    const images = this.data.images.map((v) => v.id === id ? { ...v, loaded, failed: !loaded } : v);
    const ready = images.length > 0 && images.every((v) => v.loaded && !v.failed);
    const failed = images.some((v) => v.failed);
    if (this.run(() => this.runtime.engine.setImageReady(this.data.sessionId, instance, ready)))
      this.setData({ images, imagesReady: ready, imagesFailed: failed, notice: failed ? '图片未加载完整，可重试或先查阅笔记' : '' });
  },
  handleRetryImages() { this.prepareImages(this.data.card, true); },
  handleChoice(event) { if (this.data.answer.outcome) return;
    const value = event.currentTarget.dataset.key; this.run(() => this.render(this.runtime.engine.selection(this.data.sessionId, value))); },
  handleInput(event) {
    if (this.data.answer.outcome) return;
    this.setData({ draftValue: event.detail.value });
    this.run(() => { this.runtime.engine.selection(this.data.sessionId, event.detail.value); this.setData({ notice: '' }); });
  },
  syncDraft() { if (!this.data.answer.outcome) this.runtime.engine.selection(this.data.sessionId, this.data.draftValue); },
  handleSubmit() { this.run(() => { this.syncDraft(); this.render(this.runtime.engine.submit(this.data.sessionId)); }); },
  handleReveal() { this.run(() => this.render(this.runtime.engine.reveal(this.data.sessionId))); },
  handleComparison() { this.run(() => this.render(this.runtime.engine.openComparison(this.data.sessionId))); },
  handleSkip() { this.run(() => { this.runtime.engine.skip(this.data.sessionId); this.render(this.runtime.engine.advance(this.data.sessionId)); wx.pageScrollTo({ scrollTop: 0, duration: 0 }); }); },
  handleNext() { this.run(() => { this.render(this.runtime.engine.advance(this.data.sessionId)); wx.pageScrollTo({ scrollTop: 0, duration: 0 }); }); },
  handleSource(event) {
    this.run(() => { this.syncDraft();
      const context = this.runtime.engine.openSource(this.data.sessionId, Number(event.currentTarget.dataset.index), this.scrollTop || 0);
      const url = detailUrl(context.ref, context.token); if (!url) throw new Error('笔记来源已变更'); wx.navigateTo({ url });
    });
  },
  handleDirectory() { wx.navigateTo({ url: '/subpackages/note/directory/index' }); },
  handleHome() { wx.switchTab({ url: '/pages/note/index/index' }); },
  handleFresh() { this.options.sessionId = ''; this.requestedScope = this.nextScope || this.activeSession?.scope || this.requestedScope; this.begin(true); },
  restorePosition() { const move = () => wx.pageScrollTo({ scrollTop: this.scrollTop || 0, duration: 0 }); if (wx.nextTick) wx.nextTick(move); else move(); },
  handleOversized() { this.begin(true, true); },
  handleRetry() { this.begin(); },
  handleReset() {
    wx.showModal({ title: '重建笔记练习记录', content: '这会清除本模块无法识别的练习记录，其他模块不受影响。',
      success: (result) => { if (result.confirm) this.run(() => { wx.removeStorageSync(STORAGE_KEY); this.setData({ sessionId: '', corrupt: false }); this.options.sessionId = ''; this.begin(true); }); } });
  },
  handleSettings() {
    this.run(() => {
      if (!this.runtime) this.runtime = createPractice(wx);
      const preference = this.runtime.engine.preferences(this.data.kind), current = this.activeSession;
      const scope = preference.scope || current?.scope || this.requestedScope || { subjectId: 'all', categoryId: 'all' };
      const index = Math.max(0, this.data.subjects.findIndex((s) => s.id === scope.subjectId));
      this.updateTopics(index, scope.categoryId);
      this.setData({ settingsOpen: true, draftCount: preference.count || current?.requestedCount || 5 });
    });
  },
  updateTopics(subjectIndex, categoryId = 'all') {
    const subject = this.directory.find((s) => s.id === this.data.subjects[subjectIndex].id);
    const topics = [{ id: 'all', title: '全部专题' }, ...(subject?.categories || []).map((c) => ({ id: c.id, title: c.title }))];
    this.setData({ draftSubjectIndex: subjectIndex, topics, draftTopicIndex: Math.max(0, topics.findIndex((t) => t.id === categoryId)) });
  },
  handleSubjectChange(event) { this.updateTopics(Number(event.detail.value)); },
  handleTopicChange(event) { this.setData({ draftTopicIndex: Number(event.detail.value) }); },
  handleCount(event) { this.setData({ draftCount: Number(event.currentTarget.dataset.count) }); },
  handleCloseSettings() { this.setData({ settingsOpen: false }); },
  handleSaveSettings() {
    this.run(() => { const scope = { subjectId: this.data.subjects[this.data.draftSubjectIndex].id, categoryId: this.data.topics[this.data.draftTopicIndex].id, pointId: '' };
      this.runtime.engine.setPreferences(this.data.kind, scope, this.data.draftCount);
      this.nextScope = scope;
      this.setData({ settingsOpen: false, notice: '设置已保存，下一组生效' });
      if (['empty', 'oversized', 'error'].includes(this.data.state)) this.handleFresh();
    });
  },
});
