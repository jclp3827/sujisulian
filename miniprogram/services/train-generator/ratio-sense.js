// 公考真实增长率与对应比例（百分数化分数的常见近似）
const RATIO_POOL = [
  { R: 4.7,  a: 21, x: 1, explain: "4.7% 接近 1/21，A : X ≈ 21 : 1" },
  { R: 6.2,  a: 16, x: 1, explain: "6.2% 接近 1/16，A : X ≈ 16 : 1" },
  { R: 7.4,  a: 14, x: 1, explain: "7.4% 接近 1/14，A : X ≈ 14 : 1" },
  { R: 8.7,  a: 12, x: 1, explain: "8.7% 接近 1/12，A : X ≈ 12 : 1" },
  { R: 9.6,  a: 10, x: 1, explain: "9.6% 接近 1/10，A : X ≈ 10 : 1" },
  { R: 10.8, a: 9,  x: 1, explain: "10.8% 接近 1/9，A : X ≈ 9 : 1" },
  { R: 12.2, a: 8,  x: 1, explain: "12.2% 接近 1/8，A : X ≈ 8 : 1" },
  { R: 13.8, a: 7,  x: 1, explain: "13.8% 接近 1/7，A : X ≈ 7 : 1" },
  { R: 15.6, a: 6,  x: 1, explain: "15.6% 接近 1/6，A : X ≈ 6 : 1" },
  { R: 17.4, a: 6,  x: 1, explain: "17.4% 接近 1/6，A : X ≈ 6 : 1" },
  { R: 18.6, a: 5,  x: 1, explain: "18.6% 接近 1/5，A : X ≈ 5 : 1" },
  { R: 21.3, a: 5,  x: 1, explain: "21.3% 接近 1/5，A : X ≈ 5 : 1" },
  { R: 23.4, a: 4,  x: 1, explain: "23.4% 接近 1/4，A : X ≈ 4 : 1" },
  { R: 24.7, a: 4,  x: 1, explain: "24.7% 接近 1/4，A : X ≈ 4 : 1" },
  { R: 27.2, a: 7,  x: 2, explain: "27.2% 接近 2/7，A : X ≈ 7 : 2" },
  { R: 29.4, a: 10, x: 3, explain: "29.4% 接近 3/10，A : X ≈ 10 : 3" },
  { R: 31.6, a: 3,  x: 1, explain: "31.6% 接近 1/3，A : X ≈ 3 : 1" },
  { R: 34.8, a: 3,  x: 1, explain: "34.8% 接近 1/3，A : X ≈ 3 : 1" },
  { R: 36.4, a: 8,  x: 3, explain: "36.4% 接近 3/8，A : X ≈ 8 : 3" },
  { R: 39.1, a: 5,  x: 2, explain: "39.1% 接近 2/5，A : X ≈ 5 : 2" },
  { R: 43.6, a: 7,  x: 3, explain: "43.6% 接近 3/7，A : X ≈ 7 : 3" },
  { R: 48.2, a: 12, x: 6, display: "12:6", explain: "48.2% 接近 6/12，A : X ≈ 12 : 6" },
  { R: 52.7, a: 13, x: 7, explain: "52.7% 接近 7/13，A : X ≈ 13 : 7" },
  { R: 57.3, a: 7,  x: 4, explain: "57.3% 接近 4/7，A : X ≈ 7 : 4" },
  { R: 62.4, a: 8,  x: 5, explain: "62.4% 接近 5/8，A : X ≈ 8 : 5" },
  { R: 66.8, a: 9,  x: 6, display: "9:6", explain: "66.8% 接近 6/9，A : X ≈ 9 : 6" },
  { R: 71.6, a: 7,  x: 5, explain: "71.6% 接近 5/7，A : X ≈ 7 : 5" },
  { R: 74.3, a: 11, x: 8, explain: "74.3% 接近 8/11，A : X ≈ 11 : 8" },
  { R: 82.5, a: 6,  x: 5, explain: "82.5% 接近 5/6，A : X ≈ 6 : 5" },
  { R: 86.8, a: 7,  x: 6, explain: "86.8% 接近 6/7，A : X ≈ 7 : 6" },
  { R: 91.4, a: 11, x: 10, explain: "91.4% 接近 10/11，A : X ≈ 11 : 10" },
  { R: 96.7, a: 9,  x: 8, explain: "96.7% 接近 8/9，A : X ≈ 9 : 8" },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function gcd(m, n) {
  return n === 0 ? m : gcd(n, m % n)
}

function formatRatio(a, x) {
  const g = gcd(a, x)
  const sa = a / g
  const sx = x / g
  if (sx === 1) return `${sa}:1`
  // 如果比值接近常见小数，给出近似提示
  const ratio = sa / sx
  if (Math.abs(ratio - 1.5) < 0.05) return `${sa}:${sx}`
  if (Math.abs(ratio - 2.5) < 0.05) return `${sa}:${sx}`
  if (Math.abs(ratio - 3.5) < 0.05) return `${sa}:${sx}`
  return `${sa}:${sx}`
}

function makeLabel(item) {
  if (item.display) return item.display
  return formatRatio(item.a, item.x)
}

function generateDistractors(correct) {
  const used = new Set([makeLabel(correct)])
  const distractors = []

  // 策略1：a ±1（保持 x 不变）
  const offsets = shuffle([1, 2, -1, -2])
  for (const off of offsets) {
    if (distractors.length >= 3) break
    const fakeA = Math.max(1, correct.a + off)
    const fakeX = correct.x
    const label = formatRatio(fakeA, fakeX)
    if (!used.has(label)) {
      used.add(label)
      distractors.push({ label, id: `opt-d${distractors.length}` })
    }
  }

  // 策略2：从其他真实比例中挑（排除正确答案）
  if (distractors.length < 3) {
    const others = shuffle(RATIO_POOL.filter((p) => p !== correct))
    for (const other of others) {
      if (distractors.length >= 3) break
      const label = makeLabel(other)
      if (!used.has(label)) {
        used.add(label)
        distractors.push({ label, id: `opt-p${distractors.length}` })
      }
    }
  }

  return distractors
}

function generateOptions(correct) {
  const distractors = generateDistractors(correct)
  const options = shuffle([
    { label: makeLabel(correct), id: "opt-correct", isCorrect: true },
    ...distractors,
  ])
  return options
}

function generateRatioSenseSet(questionCount) {
  const pool = shuffle([...RATIO_POOL])
  const questions = []
  for (let i = 0; i < questionCount; i++) {
    const item = pool[i % pool.length]
    const options = generateOptions(item)
    questions.push({
      id: `rs-${i + 1}`,
      index: i + 1,
      R: item.R,
      label: makeLabel(item),
      explain: item.explain,
      options,
    })
  }
  return questions
}

module.exports = { generateRatioSenseSet }
