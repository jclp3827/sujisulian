const BEST_PREFIX = "xingce_cognition_best_";

function toDateKey(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getKey(moduleId, levelId) {
  return `${BEST_PREFIX}${moduleId}_${levelId}`;
}

function formatMs(ms) {
  if (!ms) return "--";
  return `${Math.max(0, Math.round(ms / 1000))}s`;
}

function formatScore(score) {
  if (score === undefined || score === null) return "--";
  return `${score}分`;
}

function isBetter(next, prev, metric) {
  if (!prev && prev !== 0) return true;
  if (metric === "score") return next > prev;
  return next < prev;
}

function saveCognitionBest(record) {
  const moduleId = record.moduleId || record.itemId;
  const levelId = record.levelId || "standard";
  if (!moduleId || !levelId || record.success === false) return null;

  const metric = record.score !== undefined && record.score !== null ? "score" : "time";
  const value = metric === "score" ? Number(record.score) : Number(record.elapsedMs);
  if (!Number.isFinite(value) || value <= 0) return null;

  const key = getKey(moduleId, levelId);
  const prev = wx.getStorageSync(key) || {};
  const todayKey = toDateKey(Date.now());
  const prevTodayValue = prev.todayKey === todayKey ? prev.todayValue : null;
  const next = {
    moduleId,
    levelId,
    metric,
    bestValue: isBetter(value, prev.bestValue, metric) ? value : prev.bestValue,
    todayKey,
    todayValue: isBetter(value, prevTodayValue, metric) ? value : prevTodayValue,
    updatedAt: Date.now(),
  };
  wx.setStorageSync(key, next);
  return next;
}

function getCognitionBest(moduleId, levelId) {
  const stored = wx.getStorageSync(getKey(moduleId, levelId)) || {};
  const todayKey = toDateKey(Date.now());
  const metric = stored.metric || "time";
  return {
    bestText: metric === "score" ? formatScore(stored.bestValue) : formatMs(stored.bestValue),
    todayBestText: stored.todayKey === todayKey
      ? (metric === "score" ? formatScore(stored.todayValue) : formatMs(stored.todayValue))
      : "--",
  };
}

module.exports = {
  saveCognitionBest,
  getCognitionBest,
};
