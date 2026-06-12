const { buildRollingBoard, replaceRollingValue } = require("../../../utils/cognition");
const { addRecentRecord } = require("../../../utils/recent-records");
const { saveCognitionBest } = require("../../../utils/cognition-bests");

function toGrid(board, size) {
  const rows = [];
  for (let row = 0; row < size; row += 1) {
    rows.push(board.slice(row * size, (row + 1) * size));
  }
  return rows;
}

function init(page, level) {
  const size = level.size || 4;
  const board = buildRollingBoard(size, 1);
  page.rollingMax = size * size;
  page.rollingDuration = level.duration || 30;
  page.setData({
    rollingRows: toGrid(board, size),
    rollingTarget: 1,
    score: 0,
    phase: "running",
    showResult: false,
    resultTitle: "",
    resultSummary: "",
    elapsedText: `${page.rollingDuration.toFixed(1)}秒`,
  });
  page.rollingDeadline = Date.now() + page.rollingDuration * 1000;
  page.tickTimer = setInterval(() => {
    const remain = Math.max(0, page.rollingDeadline - Date.now());
    page.setData({
      elapsedText: `${(remain / 1000).toFixed(1)}秒`,
    });
    if (remain <= 0) {
      saveCognitionBest({
        moduleId: page.data.module.id,
        levelId: page.data.level.id,
        score: page.data.score,
        success: true,
      });
      addRecentRecord({
        type: "cognition",
        sectionId: "cognition",
        itemId: page.data.module.id,
        itemTitle: page.data.module.title,
        levelId: page.data.level.id,
        levelTitle: page.data.level.title,
        questionCount: page.data.score,
        correctCount: page.data.score,
        wrongCount: 0,
        elapsedMs: page.rollingDuration * 1000,
        score: page.data.score,
        success: true,
      });
      page.clearTimers();
      page.setData({
        phase: "finished",
        showResult: true,
        resultTitle: "训练结束",
        resultSummary: `本次得分 ${page.data.score} 分`,
      });
    }
  }, 100);
}

function onTap(page, event) {
  if (page.data.phase !== "running") return;
  const { value, cellIndex, rowIndex, colIndex } = event.currentTarget.dataset;
  if (Number(value) !== page.data.rollingTarget) {
    return;
  }

  page.markCellFeedback("rollingActiveKey", `${rowIndex}-${colIndex}`);
  page.rollingMax += 1;
  const nextBoard = replaceRollingValue(page.data.rollingRows.flat(), Number(cellIndex), page.rollingMax);
  page.setData({
    rollingRows: toGrid(nextBoard, page.data.level.size),
    rollingTarget: page.data.rollingTarget + 1,
    score: page.data.score + 1,
  });
}

module.exports = {
  init,
  restart: init,
  onTap,
};
