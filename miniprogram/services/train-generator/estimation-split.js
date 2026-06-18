function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function roundTo(value, digits) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function getRatioLabel(rate) {
  const r = rate / 100
  const ratio = 1 / r
  if (ratio >= 19.5) return "20:1"
  if (ratio >= 14.5) return "15:1"
  if (ratio >= 9.5) return "10:1"
  if (ratio >= 6.5) return "约 6.7:1"
  if (ratio >= 4.5) return "5:1"
  if (ratio >= 3.5) return "4:1"
  if (ratio >= 2.8) return "约 3.3:1"
  if (ratio >= 2.3) return "约 2.5:1"
  return "2:1"
}

function generateEstimationSet(questionCount) {
  return Array.from({ length: questionCount }, (_, index) => {
    const R = randomInt(80, 800) / 10 // 8.0% ~ 80.0%，1位小数
    const A = randomInt(150, 35000)
    const factor = roundTo(1 + R / 100, 4)
    const B = Math.round(A * factor)
    const X = B - A
    return {
      id: `est-${index + 1}`,
      index: index + 1,
      B,
      R,
      A,
      X,
      ratioLabel: getRatioLabel(R),
    }
  })
}

module.exports = { generateEstimationSet }
