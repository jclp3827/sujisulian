const SESSION_INDEX_KEY = "xingce_transient_session_index";
const SESSION_PREFIX = "xingce_transient_session_";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function now() {
  return Date.now();
}

function makeKey(prefix = "session") {
  return `${SESSION_PREFIX}${prefix}_${now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readIndex() {
  return wx.getStorageSync(SESSION_INDEX_KEY) || [];
}

function writeIndex(index) {
  wx.setStorageSync(SESSION_INDEX_KEY, index);
}

function cleanupExpiredSessions() {
  const current = now();
  const nextIndex = [];
  readIndex().forEach((item) => {
    if (!item || !item.key || item.expiresAt <= current) {
      if (item?.key) {
        wx.removeStorageSync(item.key);
      }
      return;
    }
    nextIndex.push(item);
  });
  writeIndex(nextIndex);
  return nextIndex;
}

function saveSession(prefix, payload) {
  cleanupExpiredSessions();
  const key = makeKey(prefix);
  const createdAt = now();
  const expiresAt = createdAt + SESSION_TTL_MS;
  wx.setStorageSync(key, {
    payload,
    createdAt,
    expiresAt,
  });
  writeIndex([
    { key, createdAt, expiresAt },
    ...readIndex().filter((item) => item?.key !== key),
  ]);
  return key;
}

function readSession(key) {
  if (!key) return null;
  const stored = wx.getStorageSync(key);
  if (!stored || stored.expiresAt <= now()) {
    removeSession(key);
    return null;
  }
  return stored.payload || null;
}

function removeSession(key) {
  if (!key) return;
  wx.removeStorageSync(key);
  writeIndex(readIndex().filter((item) => item?.key !== key));
}

module.exports = {
  saveSession,
  readSession,
  removeSession,
  cleanupExpiredSessions,
};
