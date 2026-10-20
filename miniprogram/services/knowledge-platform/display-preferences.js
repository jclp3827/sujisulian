const DISPLAY_PREFERENCE_STORAGE_KEY = "knowledge-display-preferences-v1";
const DISPLAY_PREFERENCE_DEFAULTS = Object.freeze({
  fontScale: "default",
  lineSpacing: "normal",
  density: "comfortable",
  emphasis: "keyPoints",
  motion: "full",
  systemProjection: "terrain",
});

function getDisplayPreferences() {
  try {
    return { ...DISPLAY_PREFERENCE_DEFAULTS, ...(wx.getStorageSync(DISPLAY_PREFERENCE_STORAGE_KEY) || {}) };
  } catch (error) {
    return { ...DISPLAY_PREFERENCE_DEFAULTS };
  }
}

function saveDisplayPreferences(preferences) {
  const normalized = { ...DISPLAY_PREFERENCE_DEFAULTS, ...(preferences || {}) };
  try { wx.setStorageSync(DISPLAY_PREFERENCE_STORAGE_KEY, normalized); } catch (error) {}
  return normalized;
}

function motionDuration(preferences, duration) {
  return preferences?.motion === "reduced" ? 0 : duration;
}

module.exports = {
  DISPLAY_PREFERENCE_STORAGE_KEY,
  DISPLAY_PREFERENCE_DEFAULTS,
  getDisplayPreferences,
  saveDisplayPreferences,
  motionDuration,
};
