const { buildSchulteBoard } = require("../../../utils/cognition");
const { formatDuration } = require("../../../utils/format");
const { addRecentRecord } = require("../../../utils/recent-records");
const { getCognitionBest, saveCognitionBest } = require("../../../utils/cognition-bests");

function toGrid(board, size) {
  const rows = [];
  for (let row = 0; row < size; row += 1) {
    rows.push(
      board.slice(row * size, (row + 1) * size).map((value) => ({
        value,
        done: false,
      }))
    );
  }
  return rows;
}

function restoreBest(page, levelId) {
  const storage = getCognitionBest(page.data.module.id, levelId);
  page.setData({
    bestText: storage.bestText,
    todayBestText: storage.todayBestText,
  });
}

function persistBest(page, levelId, elapsedMs) {
  saveCognitionBest({
    moduleId: page.data.module.id,
    levelId,
    elapsedMs,
    success: true,
  });
  restoreBest(page, levelId);
}

function init(page, level) {
  const board = buildSchulteBoard(level.size);
  const total = level.size * level.size;
  page.setData({
    schulteRows: toGrid(board, level.size),
    schulteTarget: 1,
    currentProgressText: `0/${total}`,
    countdown: level.countdown || 3,
    phase: "countdown",
    showResult: false,
    resultTitle: "",
    resultSummary: "",
  });
  page.startCountdown(() => {
    page.startElapsedTick();
    page.setData({ phase: "running" });
  });
  restoreBest(page, level.id);
}

function finish(page) {
  page.clearTimers();
  const elapsedMs = Date.now() - page.startAt;
  const total = page.data.level.size * page.data.level.size;
  persistBest(page, page.data.level.id, elapsedMs);
  addRecentRecord({
    type: "cognition",
    sectionId: "cognition",
    itemId: page.data.module.id,
    itemTitle: page.data.module.title,
    levelId: page.data.level.id,
    levelTitle: page.data.level.title,
    questionCount: total,
    correctCount: total,
    wrongCount: 0,
    elapsedMs,
    success: true,
  });
  page.setData({
    phase: "finished",
    currentProgressText: `${total}/${total}`,
    showResult: true,
    resultTitle: "训练完成",
    resultSummary: `完成 ${page.data.level.title} 训练，用时 ${formatDuration(elapsedMs)}`,
  });
}

function onTap(page, event) {
  if (page.data.phase !== "running") return;
  const { value, rowIndex, colIndex } = event.currentTarget.dataset;
  const { schulteTarget, level } = page.data;
  if (Number(value) !== schulteTarget) {
    return;
  }

  const key = `${rowIndex}-${colIndex}`;
  const nextRows = page.data.schulteRows.map((row) => row.map((cell) => ({ ...cell })));
  nextRows[rowIndex][colIndex].done = true;
  page.markCellFeedback("schulteActiveKey", key);

  const nextTarget = schulteTarget + 1;
  const total = level.size * level.size;
  if (schulteTarget >= total) {
    page.setData({ schulteRows: nextRows });
    finish(page);
    return;
  }

  page.setData({
    schulteRows: nextRows,
    schulteTarget: nextTarget,
    currentProgressText: `${schulteTarget}/${total}`,
  });
}

module.exports = {
  init,
  restart: init,
  onTap,
};
