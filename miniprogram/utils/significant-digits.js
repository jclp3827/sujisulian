function getWorkingNumber(value, significantDigits = 3) {
  const number = Number(value)
  if (!Number.isFinite(number) || number === 0) {
    return { value: number, scale: 1, actualValue: number }
  }
  const integerDigits = Math.floor(Math.log10(Math.abs(number))) + 1
  const scale = 10 ** Math.max(integerDigits - significantDigits, 0)
  const truncated = number >= 0 ? Math.floor(number / scale) : Math.ceil(number / scale)
  return {
    value: truncated,
    scale,
    actualValue: truncated * scale,
  }
}

function restoreScale(value, scale) {
  return Math.round(value * scale * 1000000) / 1000000
}

function roundForDisplay(value) {
  return Math.round(value * 100) / 100
}

function formatScaledValue(value, scale) {
  const displayValue = roundForDisplay(value)
  return scale > 1 ? `${displayValue} × ${scale}` : String(displayValue)
}

function classifyDeviation(deviationRatio, retryLevel = "建议重新估算") {
  if (deviationRatio <= 0.01) return { level: "优秀", rule: "偏差率 ≤ 1%", tone: "excellent", passed: true }
  if (deviationRatio <= 0.02) return { level: "估算可用", rule: "偏差率 ≤ 2%", tone: "usable", passed: true }
  if (deviationRatio <= 0.03) return { level: "偏差稍大", rule: "偏差率 ≤ 3%", tone: "review", passed: false }
  return { level: retryLevel, rule: "偏差率 > 3%", tone: "retry", passed: false }
}

module.exports = {
  classifyDeviation,
  formatScaledValue,
  getWorkingNumber,
  restoreScale,
  roundForDisplay,
}
