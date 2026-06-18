function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function roundTo(value, digits) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function generateAssumptionSet(questionCount) {
  return Array.from({ length: questionCount }, (_, index) => {
    // 生成 -20.0% ~ 50.0% 的增长率，排除绝对值过小的值
    let rate
    do {
      rate = randomInt(-200, 500) / 10
    } while (Math.abs(rate) < 3)
    const A = randomInt(150, 35000)
    const factor = roundTo(1 + rate / 100, 4)
    const B = Math.round(A * factor)
    const X = B - A
    return {
      id: `assumption-${index + 1}`,
      index: index + 1,
      B,
      rate,
      A,
      X,
    }
  })
}

module.exports = { generateAssumptionSet }
