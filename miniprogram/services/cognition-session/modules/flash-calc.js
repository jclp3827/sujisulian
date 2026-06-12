const { addRecentRecord } = require("../../../utils/recent-records");
const { saveCognitionBest } = require("../../../utils/cognition-bests");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildFrame(level) {
  const min = 10 ** (level.digits - 1);
  const max = (10 ** level.digits) - 1;
  return Array.from({ length: level.columns }, () => {
    const base = randomInt(level.digits === 1 ? 1 : min, max);
    if (!level.allowNegative) {
      return base;
    }
    return Math.random() < 0.45 ? -base : base;
  });
}

function buildSequence(level) {
  const frames = [];
  let total = 0;
  for (let index = 0; index < (level.rounds || 10); index += 1) {
    const values = buildFrame(level);
    frames.push(values);
    total += values.reduce((sum, value) => sum + value, 0);
  }
  return { frames, total };
}

function init(page, level) {
  const sequence = buildSequence(level);
  page.flashCalcFrames = sequence.frames;
  page.flashCalcExpected = sequence.total;
  page.flashCalcIndex = 0;
  page.flashCalcStartAt = Date.now();
  page.setData({
    phase: "running",
    flashCalcStage: "preview",
    flashCalcStep: 1,
    flashCalcTotal: level.rounds || 10,
    flashCalcValues: sequence.frames[0] || [],
    flashCalcAnswerText: "",
    flashCalcHintText: "点击数字进入下一组",
    flashCalcResultCorrect: false,
    flashCalcResultText: "",
    flashCalcTransition: "",
    flashCalcPressed: false,
    showResult: false,
    resultTitle: "",
    resultSummary: "",
  });
}

function onAdvance(page) {
  if (page.data.flashCalcStage !== "preview" || page.data.flashCalcTransition) {
    return;
  }

  page.setData({ flashCalcPressed: true });
  if (page.flashCalcPressTimer) {
    clearTimeout(page.flashCalcPressTimer);
  }
  page.flashCalcPressTimer = setTimeout(() => {
    page.setData({ flashCalcPressed: false });
    page.flashCalcPressTimer = null;
  }, 120);

  const nextIndex = page.flashCalcIndex + 1;
  if (nextIndex >= page.data.flashCalcTotal) {
    page.setData({ flashCalcTransition: "flash-calc-out-left" });
    page.flashCalcTransitionTimer = setTimeout(() => {
      page.setData({
        flashCalcStage: "answer",
        flashCalcHintText: "请输入最终结果",
        flashCalcTransition: "flash-calc-in-right",
      });
      page.flashCalcTransitionTimer = setTimeout(() => {
        page.setData({ flashCalcTransition: "" });
        page.flashCalcTransitionTimer = null;
      }, 180);
    }, 160);
    return;
  }

  page.setData({ flashCalcTransition: "flash-calc-out-left" });
  page.flashCalcTransitionTimer = setTimeout(() => {
    page.flashCalcIndex = nextIndex;
    page.setData({
      flashCalcStep: nextIndex + 1,
      flashCalcValues: page.flashCalcFrames[nextIndex],
      flashCalcTransition: "flash-calc-in-right",
    });
    page.flashCalcTransitionTimer = setTimeout(() => {
      page.setData({ flashCalcTransition: "" });
      page.flashCalcTransitionTimer = null;
    }, 180);
  }, 160);
}

function onKeyTap(page, event) {
  if (page.data.flashCalcStage !== "answer") {
    return;
  }
  const { key } = event.currentTarget.dataset;
  const { flashCalcAnswerText } = page.data;

  if (key === "clear") {
    page.setData({ flashCalcAnswerText: "" });
    return;
  }

  if (key === "delete") {
    page.setData({ flashCalcAnswerText: flashCalcAnswerText.slice(0, -1) });
    return;
  }

  if (key === "-" && (flashCalcAnswerText.includes("-") || flashCalcAnswerText.length > 0)) {
    return;
  }

  page.setData({
    flashCalcAnswerText: `${flashCalcAnswerText}${key}`,
  });
}

function onSubmitAnswer(page) {
  if (page.data.flashCalcStage !== "answer") {
    return;
  }

  const answer = Number(page.data.flashCalcAnswerText);
  if (Number.isNaN(answer)) {
    wx.showToast({
      title: "请输入结果",
      icon: "none",
    });
    return;
  }

  const isCorrect = answer === page.flashCalcExpected;
  saveCognitionBest({
    moduleId: page.data.module.id,
    levelId: page.data.level.id,
    elapsedMs: Date.now() - page.flashCalcStartAt,
    success: isCorrect,
  });
  addRecentRecord({
    type: "cognition",
    sectionId: "cognition",
    itemId: page.data.module.id,
    itemTitle: page.data.module.title,
    levelId: page.data.level.id,
    levelTitle: page.data.level.title,
    questionCount: page.data.flashCalcTotal,
    correctCount: isCorrect ? page.data.flashCalcTotal : 0,
    wrongCount: isCorrect ? 0 : 1,
    elapsedMs: Date.now() - page.flashCalcStartAt,
    success: isCorrect,
  });
  page.setData({
    phase: "finished",
    flashCalcStage: "result",
    flashCalcResultCorrect: isCorrect,
    flashCalcResultText: isCorrect
      ? `最终结果是 ${page.flashCalcExpected}`
      : `你的答案：${answer}\n正确结果：${page.flashCalcExpected}`,
    flashCalcHintText: isCorrect ? "本轮计算完成" : "结果已给出，可重新开始",
  });
}

module.exports = {
  init,
  restart: init,
  onAdvance,
  onKeyTap,
  onSubmitAnswer,
};
