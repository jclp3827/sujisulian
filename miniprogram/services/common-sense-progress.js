const STORAGE_KEY = "common-sense-learning-v1";
const MODE_TITLES = { daily: "每日常识", qa: "一问一答", mnemonic: "常识口诀", exam: "考前急救", confusion: "易混辨析" };

function readContinueSummary(storage) {
  try {
    const state = storage.getStorageSync(STORAGE_KEY);
    const summary = state && state.summary;
    if (!summary || !Object.keys(MODE_TITLES).includes(summary.mode) || typeof summary.scope !== "string"
      || !Number.isInteger(summary.index) || !Number.isInteger(summary.total) || summary.index < 1 || summary.index > summary.total) return null;
    return { ...summary, unit: summary.kind === "reading" ? "条" : "道",
      phaseLabel: summary.mode === "confusion" ? { judge: "先判断", compare: "差异对照", recheck: "再辨一次" }[summary.phase] || "" : "",
      title: MODE_TITLES[summary.mode] + (summary.mode === "mnemonic" && summary.kind !== "reading" ? " · 自测" : "") };
  } catch (_) { return null; }
}
module.exports = { STORAGE_KEY, MODE_TITLES, readContinueSummary };
