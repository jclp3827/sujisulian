function errorText(error, fallback) {
  if (typeof error === "string" && error) return error.slice(0, 500);
  if (error) {
    if (typeof error.errMsg === "string" && error.errMsg) return error.errMsg.slice(0, 500);
    if (typeof error.message === "string" && error.message) return error.message.slice(0, 500);
    if (typeof error.errCode === "number") return (fallback || "操作未完成") + "（错误码 " + error.errCode + "）";
  }
  return fallback || "操作未完成";
}

function isCancel(error) { return /cancel/i.test(errorText(error, "")); }

// Keep raw diagnostics available to developer tools; ordinary photo pages use
// these action-oriented messages instead of platform errors or internal URLs.
function photoErrorText(error, fallback) {
  const raw = errorText(error, fallback);
  const code = error && error.code;
  if (["PAYMENT_NETWORK_UNKNOWN", "PAYMENT_NOT_CONFIRMED", "NATIVE_CALLBACK_TIMEOUT"].includes(code)) return "付款结果暂未确认，请稍后确认付款状态，不要重复付款。";
  if (code === "REQUEST_UNKNOWN") return "本次操作结果暂未确认，请保留当前照片。若已付款，请先确认原付款状态。";
  if (code === "DAILY_BUDGET_EXHAUSTED") return "今日 AI 处理额度已满，已付次数会保留；请明天再试，或继续使用原背景免费处理。";
  if (code === "RESULT_EXPIRED") return "此前 AI 预览已过期，本次没有再次扣次数。再次点击可使用剩余机会重新处理，或使用原背景免费处理。";
  if (["PREVIEW_OUTCOME_UNKNOWN", "PREVIEW_NOT_COMPLETED"].includes(code)) return "这次 AI 处理结果未能确认，不会自动重跑或再次扣次数。你可以更换照片，或使用原背景免费处理。";
  if (/not in domain list/i.test(raw)) return "处理结果暂时无法下载，请保留当前照片；不会自动重新处理。";
  if (/permission|authorize|auth deny/i.test(raw)) return "微信未能完成此操作，请检查相关权限。你仍可返回照片页面继续操作。";
  if (/network|timeout|timed out|网络|超时/i.test(raw)) return "网络暂时不稳定，请保留当前照片，稍后查看处理或付款状态。";
  if (/https?:\/\/|(?:wx\.|FileSystem|TypeError|ReferenceError)|[A-Za-z]+:fail|错误码\s*-?\d+/.test(raw) || !/[\u4e00-\u9fff]/.test(raw)) return fallback || "本次操作未完成，请返回照片页面后再试。";
  return raw;
}

module.exports = { errorText, photoErrorText, isCancel };
