const { buildFlashMemoryRound } = require("../../../utils/cognition");
const { formatDuration } = require("../../../utils/format");
const { addRecentRecord } = require("../../../utils/recent-records");
const { saveCognitionBest } = require("../../../utils/cognition-bests");

function toGrid(board, size) {
  const rows = [];
  for (let row = 0; row < size; row += 1) {
    rows.push(board.slice(row * size, (row + 1) * size).map((cell) => ({ ...cell })));
  }
  return rows;
}

function pickNextTarget(page) {
  if (!page.flashRemainingValues || !page.flashRemainingValues.length) {
    return null;
  }
  const index = Math.floor(Math.random() * page.flashRemainingValues.length);
  return page.flashRemainingValues[index];
}

function init(page, level) {
  const board = buildFlashMemoryRound(level.size);
  const total = level.size * level.size;
  page.flashRemainingValues = board.map((cell) => cell.value);
  page.flashPreviewBoard = board.map((cell) => ({ ...cell }));
  page.flashHiddenBoard = board.map((cell) => ({
    ...cell,
    hidden: true,
    success: false,
  }));
  page.flashNextValue = null;
  page.setData({
    flashRows: toGrid(board, level.size),
    flashTarget: "记忆中",
    flashLives: level.lives,
    flashCompleted: 0,
    flashTotal: total,
    countdown: level.previewCountdown || 3,
    phase: "preview",
    mistakeText: "",
    elapsedText: "0:0:00",
    showResult: false,
    resultTitle: "",
    resultSummary: "",
  });

  page.startCountdown(() => {
    page.flashNextValue = level.targetMode === "ordered" ? 1 : pickNextTarget(page);
    page.startElapsedTick();
    page.setData({
      flashRows: toGrid(page.flashPreviewBoard, level.size),
      flashTarget: page.flashNextValue,
      phase: "ready",
    });
  });
}

function finish(page, success) {
  page.clearTimers();
  const elapsedMs = Date.now() - page.startAt;
  saveCognitionBest({
    moduleId: page.data.module.id,
    levelId: page.data.level.id,
    elapsedMs,
    success,
  });
  addRecentRecord({
    type: "cognition",
    sectionId: "cognition",
    itemId: page.data.module.id,
    itemTitle: page.data.module.title,
    levelId: page.data.level.id,
    levelTitle: page.data.level.title,
    questionCount: page.data.flashTotal,
    correctCount: page.data.flashCompleted,
    wrongCount: success ? 0 : page.data.flashLives <= 0 ? 1 : 0,
    elapsedMs,
    success,
  });
  const board = page.data.flashRows.flat().map((cell) => ({
    ...cell,
    success: success ? true : cell.success,
    hidden: false,
  }));
  page.setData({
    phase: "finished",
    flashRows: toGrid(board, page.data.level.size),
    showResult: success ? false : true,
    resultTitle: success ? "" : "挑战结束",
    resultSummary: success ? "" : `机会已用完，本次坚持 ${formatDuration(elapsedMs)}`,
    elapsedText: `${Math.max(0, Math.round(elapsedMs / 1000))}秒`,
  });
}

function onTap(page, event) {
  if (page.data.phase !== "running" && page.data.phase !== "ready") return;
  const { rowIndex, colIndex } = event.currentTarget.dataset;
  const key = `${rowIndex}-${colIndex}`;
  const wasReady = page.data.phase === "ready";
  const sourceBoard = wasReady ? page.flashHiddenBoard : page.data.flashRows.flat();
  const board = sourceBoard.map((cell) => ({ ...cell }));
  const index = Number(rowIndex) * page.data.level.size + Number(colIndex);
  const cell = board[index];

  if (!cell || !cell.value || cell.cleared) {
    return;
  }

  if (cell.value !== page.flashNextValue) {
    page.markCellFeedback("flashWrongKey", key, 320);
    const nextLives = page.data.flashLives - 1;
    page.setData({
      flashLives: nextLives,
      mistakeText: `错了，剩余机会：${nextLives}`,
    });
    if (page.mistakeTimer) {
      clearTimeout(page.mistakeTimer);
    }
    page.mistakeTimer = setTimeout(() => {
      page.setData({ mistakeText: "" });
      page.mistakeTimer = null;
    }, 900);
    if (nextLives <= 0) {
      finish(page, false);
    }
    return;
  }

  page.markCellFeedback("flashActiveKey", key, 260);
  board[index].cleared = true;
  board[index].hidden = false;
  board[index].success = true;
  page.flashRemainingValues = page.flashRemainingValues.filter((value) => value !== cell.value);
  const completedCount = page.data.flashCompleted + 1;
  const completed = completedCount >= page.data.flashTotal;
  const nextTarget = completed
    ? null
    : page.data.level.targetMode === "ordered"
      ? page.flashNextValue + 1
      : pickNextTarget(page);
  page.flashNextValue = nextTarget;
  page.setData({
    flashRows: toGrid(board, page.data.level.size),
    flashTarget: nextTarget,
    flashCompleted: completedCount,
    mistakeText: "",
    phase: "running",
  });

  if (completed) {
    finish(page, true);
  }
}

module.exports = {
  init,
  restart: init,
  onTap,
};
