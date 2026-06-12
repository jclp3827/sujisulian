function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(list) {
  const next = list.slice();
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildSchulteBoard(size) {
  return shuffle(Array.from({ length: size * size }, (_, index) => index + 1));
}

function buildRollingBoard(size, startValue = 1) {
  return shuffle(Array.from({ length: size * size }, (_, index) => startValue + index));
}

function replaceRollingValue(board, index, nextValue) {
  const next = board.slice();
  next[index] = nextValue;
  return shuffle(next);
}

function buildFlashMemoryRound(size) {
  return shuffle(Array.from({ length: size * size }, (_, index) => ({
    value: index + 1,
    cleared: false,
    success: false,
  })));
}

module.exports = {
  buildSchulteBoard,
  buildRollingBoard,
  replaceRollingValue,
  buildFlashMemoryRound,
};
