const bank = require("../../../models/politics-applied-questions-runtime");
const sourceTargets = require("./remedy-targets");

function sourceTarget(question) {
  const target = question && sourceTargets[question.questionId];
  return target && target.contentVersion === question.contentVersion
    && target.objectiveId === question.primaryObjectiveId
    && question.sourceBlockIds.includes(target.blockId) ? target : null;
}
const {
  VALID_COUNTS,
  VALID_SCOPES,
  createPoliticsPracticeEngine,
} = require("../../../services/knowledge-platform/politics-practice");

const TYPE_LABELS = {
  "relation-classification": "关系归类",
  "condition-change": "条件变化",
  "scenario-judgment": "情境判断",
};

const SCOPE_LABELS = { all: "全部", thought: "新时代思想", principles: "马克思主义基本原理" };

Page({
  data: {
    mode: "daily",
    modeTitle: "每日练习",
    screen: "loading",
    session: null,
    current: null,
    options: [],
    answered: false,
    result: null,
    persistenceError: "",
    settingsVisible: false,
    scopeOptions: VALID_SCOPES.map((value) => ({ value, label: SCOPE_LABELS[value] })),
    countOptions: VALID_COUNTS,
    selectedScope: "all",
    selectedCount: 5,
  },

  onLoad(options = {}) {
    this.mode = options.mode === "qa" ? "qa" : "daily";
    this.engine = createPoliticsPracticeEngine(bank, wx);
    const preferences = this.engine.preferences("qa");
    this.setData({
      mode: this.mode,
      modeTitle: this.mode === "qa" ? "一问一答" : "每日练习",
      selectedScope: preferences.scope,
      selectedCount: preferences.count,
    });
    wx.setNavigationBarTitle({ title: this.mode === "qa" ? "一问一答" : "每日练习" });
    this.openSession();
  },

  onShow() {
    if (!this.engine || !this.session || this.engine.persistenceError()) return;
    if (!this.engine.refresh()) return this.render();
    const restored = this.engine.currentSession(this.session.key);
    if (!restored) return this.openSession();
    this.session = restored;
    this.render();
  },

  openSession(forceNew = false) {
    const options = { scope: this.data.selectedScope, count: this.data.selectedCount };
    if (forceNew && this.mode === "qa") {
      const key = `qa:${options.scope}:${options.count}`;
      delete this.engine.state.sessions[key];
    }
    const opened = this.engine.start(this.mode, options);
    this.session = opened.session;
    this.render();
  },

  render() {
    const session = this.session;
    const persistenceError = this.engine.persistenceError();
    if (!session || !session.ids.length) {
      this.setData({ screen: "empty", session: null, current: null, options: [], persistenceError });
      return;
    }
    if (session.index >= session.ids.length) {
      this.setData({
        screen: "completed",
        session: { ...session, positionText: `${session.ids.length}/${session.ids.length} 道` },
        current: null,
        options: [],
        answered: false,
        result: this.engine.result(session),
        persistenceError,
        settingsVisible: false,
      });
      return;
    }
    const question = this.engine.question(session.ids[session.index]);
    const group = this.engine.group(question.groupId);
    const response = session.answers[question.questionId] || null;
    const options = this.engine.options(session, question.questionId).map(({ label, index }) => ({
      index,
      label,
      state: !response ? "idle"
        : index === question.answerIndex ? "correct"
          : response.type === "choice" && index === response.choice ? "wrong" : "muted",
    }));
    this.setData({
      screen: "active",
      session: {
        ...session,
        positionText: `${session.index + 1}/${session.ids.length} 道`,
        scopeText: SCOPE_LABELS[group.scope],
      },
      current: {
        ...question,
        groupTitle: group.title,
        typeLabel: TYPE_LABELS[question.questionType],
        response,
        answerText: question.options[question.answerIndex],
        choiceFeedback: response?.type === "choice" && response.choice !== question.answerIndex
          ? question.distractorRationales[response.choice] || "这个选项没有满足题干中的判断条件。"
          : "",
        sourceBlockId: sourceTarget(question)?.blockId || null,
        sourceAvailable: !!sourceTarget(question),
      },
      options,
      answered: !!response,
      result: null,
      persistenceError,
      settingsVisible: false,
    });
  },

  handleOptionTap(event) {
    if (this.data.answered) return;
    this.engine.answer(this.session, Number(event.currentTarget.dataset.index));
    this.render();
  },

  handleReveal() {
    this.engine.answer(this.session, null);
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
    else wx.switchTab({ url: "/pages/politics/index" });
  },

  handleHome() {
    wx.switchTab({ url: "/pages/politics/index" });
  },

  handleSourceTap() {
    const question = this.data.current;
    const target = sourceTarget(question);
    if (!this.data.answered || !target) {
      wx.showToast({ title: "对应原文暂不可用", icon: "none" });
      return;
    }
    const url = `/subpackages/politics/detail/index?id=${encodeURIComponent(target.unitId)}&block=${encodeURIComponent(target.blockId)}&mode=reading&origin=practice`;
    wx.navigateTo({ url });
  },

  handleSettingsTap() {
    if (this.mode === "daily") {
      wx.navigateTo({ url: "/subpackages/politics/practice/index?mode=qa" });
      return;
    }
    this.setData({ settingsVisible: !this.data.settingsVisible });
  },

  handleScopeTap(event) {
    this.setData({ selectedScope: event.currentTarget.dataset.value });
  },

  handleCountTap(event) {
    this.setData({ selectedCount: Number(event.currentTarget.dataset.value) });
  },

  handleApplySettings() {
    this.engine.savePreferences("qa", { scope: this.data.selectedScope, count: this.data.selectedCount });
    this.openSession(false);
  },

  handleContinueQa() {
    if (this.mode === "qa") {
      this.openSession(true);
      return;
    }
    wx.redirectTo({ url: "/subpackages/politics/practice/index?mode=qa" });
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
