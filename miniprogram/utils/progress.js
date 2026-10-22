function progressPercent(completed, total) {
  const safeCompleted = Number(completed);
  const safeTotal = Number(total);
  if (!Number.isFinite(safeCompleted) || !Number.isFinite(safeTotal) || safeTotal <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((safeCompleted / safeTotal) * 100)));
}

module.exports = {
  progressPercent,
};
