const bank = require('../../../services/knowledge-platform/politics-practice-bank');
const { knowledgePackage } = require('../../../services/knowledge-platform/politics-runtime');
const sourceTargets = require('./remedy-targets');
const {
  getDisplayPreferences,
  projectKnowledgeCardSurfaceViewModel,
  projectRecallViewModel,
} = require('../../../services/knowledge-platform/index');
const {
  VALID_COUNTS,
  VALID_SCOPES,
  VALID_TYPES,
  createPoliticsPracticeEngine,
} = require('../../../services/knowledge-platform/politics-practice');

const APPLICATION_TYPE_LABELS = {
  'relation-classification': '关系归类',
  'condition-change': '条件变化',
  'scenario-judgment': '情境判断',
};
const RECALL_TYPE_LABELS = {
  'statement-combination': '表述组合',
  'core-recall': '核心回忆',
  'condition-boundary': '条件边界',
  'error-correction': '纠错回忆',
};
const SCOPE_LABELS = { all: '全部', thought: '新时代思想', principles: '马克思主义基本原理' };
const TYPE_FILTER_LABELS = { mixed: '综合', recall: '主动回忆', application: '理解应用' };
const practiceItems = Object.fromEntries(bank.items.map(item => [item.id, item]));

function applicationSourceTarget(item) {
  const target = item && sourceTargets[item.questionId];
  return target && target.contentVersion === item.contentVersion &&
    target.objectiveId === item.primaryObjectiveId && item.sourceBlockIds.includes(target.blockId) ? target : null;
}

function sourceTarget(item) {
  if (item?.kind !== 'recall') return applicationSourceTarget(item);
  const canonical = practiceItems[item.id];
  const target = item.sourceTarget;
  return canonical?.kind === 'recall' && item.contentVersion === canonical.contentVersion &&
    target?.unitId === canonical.sourceTarget?.unitId && target?.blockId === canonical.sourceTarget?.blockId
    ? target : null;
}

Page({
  data: {
    mode: 'daily',
    modeTitle: '每日练习',
    screen: 'loading',
    session: null,
    current: null,
    options: [],
    interactionState: 'prompt',
    result: null,
    recallCard: null,
    recallView: null,
    persistenceError: '',
    contentUpdateNotice: '',
    settingsVisible: false,
    scopeOptions: VALID_SCOPES.map(value => ({ value, label: SCOPE_LABELS[value] })),
    countOptions: VALID_COUNTS,
    typeOptions: VALID_TYPES.map(value => ({ value, label: TYPE_FILTER_LABELS[value] })),
    selectedScope: 'all',
    selectedCount: 5,
    selectedType: 'mixed',
    displayPreferences: {},
  },

  onLoad(options = {}) {
    this.mode = options.mode === 'qa' ? 'qa' : 'daily';
    this.engine = createPoliticsPracticeEngine(bank, wx);
    const preferences = this.engine.preferences('qa');
    this.setData({
      mode: this.mode,
      modeTitle: this.mode === 'qa' ? '一问一答' : '每日练习',
      selectedScope: preferences.scope,
      selectedCount: preferences.count,
      selectedType: preferences.typeFilter,
      displayPreferences: getDisplayPreferences(),
    });
    wx.setNavigationBarTitle({ title: this.mode === 'qa' ? '一问一答' : '每日练习' });
    this.openSession();
  },

  onShow() {
    if (!this.engine || !this.session || this.engine.persistenceError()) return;
    if (!this.engine.refresh()) return this.render();
    const restored = this.engine.currentSession(this.session.key);
    if (!restored) return this.openSession();
    this.session = restored;
    this.setData({ displayPreferences: getDisplayPreferences() });
    this.render();
  },

  sessionOptions() {
    return { scope: this.data.selectedScope, count: this.data.selectedCount, typeFilter: this.data.selectedType };
  },

  openSession(forceNew = false) {
    const options = this.sessionOptions();
    const opened = forceNew && this.mode === 'qa'
      ? this.engine.restart(this.mode, options)
      : this.engine.start(this.mode, options);
    this.session = opened.session;
    if (opened.invalidated) this.setData({contentUpdateNotice:'内容已更新，旧记录已保留；当前按新版题目重新编排。'});
    this.render();
  },

  render() {
    const session = this.session;
    const persistenceError = this.engine.persistenceError();
    if (!session || !session.ids.length) {
      this.setData({ screen: 'empty', session: null, current: null, options: [], recallCard: null, recallView: null, persistenceError });
      return;
    }
    if (session.index >= session.ids.length) {
      this.setData({
        screen: 'completed',
        session: { ...session, positionText: `${session.ids.length}/${session.ids.length} 项` },
        current: null,
        options: [],
        interactionState: 'completed',
        result: this.engine.result(session),
        recallCard: null,
        recallView: null,
        persistenceError,
        settingsVisible: false,
      });
      return;
    }
    const item = this.engine.item(session.ids[session.index]);
    const response = session.answers[item.id] || null;
    const target = sourceTarget(item);
    const common = {
      ...item,
      response,
      sourceAvailable: Boolean(target),
      sourceLabel: item.kind === 'recall' ? '查看主要原文' : '直接查看对应原文',
    };
    if (item.kind === 'recall') {
      const interactionState = !response ? 'prompt' : response.outcome ? 'assessed' : 'revealed';
      this.setData({
        screen: 'active',
        session: { ...session, positionText: `${session.index + 1}/${session.ids.length} 项`, scopeText: SCOPE_LABELS[item.scope] },
        current: { ...common, groupTitle: item.topicTitle, typeLabel: RECALL_TYPE_LABELS[item.subtype] || '主动回忆' },
        options: [],
        interactionState,
        result: null,
        recallCard: projectKnowledgeCardSurfaceViewModel(knowledgePackage, item.unitId, { activity: 'recall' }),
        recallView: projectRecallViewModel(knowledgePackage, item.unitId, {
          recallItemId: item.id,
          revealed: interactionState !== 'prompt',
          response: response?.outcome || null,
        }),
        persistenceError,
        settingsVisible: false,
      });
      return;
    }
    const group = this.engine.group(item.groupId);
    const options = this.engine.options(session, item.id).map(({ label, index }) => ({
      index,
      label,
      state: !response ? 'idle' : index === item.answerIndex ? 'correct'
        : response.type === 'choice' && index === response.choice ? 'wrong' : 'muted',
    }));
    this.setData({
      screen: 'active',
      session: { ...session, positionText: `${session.index + 1}/${session.ids.length} 项`, scopeText: SCOPE_LABELS[item.scope] },
      current: {
        ...common,
        groupTitle: group.title,
        typeLabel: APPLICATION_TYPE_LABELS[item.questionType],
        answerText: item.options[item.answerIndex],
        choiceFeedback: response?.type === 'choice' && response.choice !== item.answerIndex
          ? item.distractorRationales[response.choice] || '这个选项没有满足题干中的判断条件。' : '',
      },
      options,
      interactionState: response ? 'answered' : 'prompt',
      result: null,
      recallCard: null,
      recallView: null,
      persistenceError,
      settingsVisible: false,
    });
  },

  handleOptionTap(event) {
    if (this.data.interactionState !== 'prompt') return;
    this.engine.answer(this.session, Number(event.currentTarget.dataset.index));
    this.render();
  },

  handleReveal() {
    this.engine.reveal(this.session);
    this.render();
  },

  handleRecallResult(event) {
    this.engine.assessRecall(this.session, event.detail.result);
    this.render();
  },

  handleNext() {
    this.engine.advance(this.session, false);
    this.render();
  },

  handleAgain() {
    this.engine.advance(this.session, true);
    this.render();
  },

  handleSkip() {
    this.engine.advance(this.session, false);
    this.render();
  },

  handleExit() {
    if (getCurrentPages().length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/politics/index' });
  },

  handleHome() { wx.switchTab({ url: '/pages/politics/index' }); },

  handleRecallSource(event) {
    if (!this.data.recallView?.answerVisible) return;
    const target = this.data.recallView.sourceLinks.find(link => link.pointId === event.detail.pointId && link.blockId === event.detail.blockId);
    if (!target) return;
    wx.navigateTo({url:'/subpackages/politics/detail/index?id='+encodeURIComponent(target.pointId)+'&block='+encodeURIComponent(target.blockId)+'&mode=reading&origin=practice',fail:error=>{this.sourceNavigationFailure=error.errMsg;wx.showToast({title:'暂时无法打开原文，请重试',icon:'none'});}});
  },
  handleSourceTap() {
    const item = this.data.current;
    const target = sourceTarget(item);
    const allowed = item?.kind === 'recall'
      ? Boolean(this.data.recallView?.answerVisible)
      : this.data.interactionState === 'answered';
    if (!allowed || !target) {
      wx.showToast({ title: '对应原文暂不可用', icon: 'none' });
      return;
    }
    const url = `/subpackages/politics/detail/index?id=${encodeURIComponent(target.unitId)}&block=${encodeURIComponent(target.blockId)}&mode=reading&origin=practice`;
    wx.navigateTo({ url });
  },

  handleSettingsTap() {
    if (this.mode === 'daily') {
      wx.navigateTo({ url: '/subpackages/politics/practice/index?mode=qa' });
      return;
    }
    this.setData({ settingsVisible: !this.data.settingsVisible });
  },

  handleScopeTap(event) { this.setData({ selectedScope: event.currentTarget.dataset.value }); },
  handleCountTap(event) { this.setData({ selectedCount: Number(event.currentTarget.dataset.value) }); },
  handleTypeTap(event) { this.setData({ selectedType: event.currentTarget.dataset.value }); },

  handleApplySettings() {
    this.engine.savePreferences('qa', this.sessionOptions());
    this.openSession(false);
  },

  handleContinueQa() {
    if (this.mode === 'qa') return this.openSession(true);
    wx.redirectTo({ url: '/subpackages/politics/practice/index?mode=qa' });
  },

  handleRetrySave() {
    if (this.engine.retrySave()) {
      const restored = this.engine.currentSession(this.session?.key);
      if (!restored) return this.openSession();
      this.session = restored;
    }
    this.render();
  },
});
