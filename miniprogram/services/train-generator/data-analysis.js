function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[randomInt(0, list.length - 1)];
}

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatNumber(value, digits = 0) {
  if (digits === 0) {
    return String(Math.round(value));
  }
  return roundTo(value, digits).toFixed(digits);
}

function randomOneDecimal(min, max) {
  return randomInt(min * 10, max * 10) / 10;
}

function makeQuestion(question) {
  return question;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function reduceFraction(numerator, denominator) {
  if (denominator <= 0 || numerator <= 0) return null;
  const g = gcd(numerator, denominator);
  const n = numerator / g;
  const d = denominator / g;
  return { numerator: n, denominator: d, value: n / d };
}

function createHistory(size = 10) {
  const records = [];
  return {
    record(key) {
      records.push(key);
      if (records.length > size) records.shift();
    },
    isRepeat(key, threshold = 0.05) {
      for (const r of records) {
        if (Math.abs(r - key) / Math.max(Math.abs(key), 1) < threshold) return true;
      }
      return false;
    },
  };
}

function randomRate(min = -30, max = 40, decimals = 1) {
  const factor = 10 ** decimals;
  return randomInt(min * factor, max * factor) / factor;
}

function randomBase(difficulty) {
  const min = { easy: 400, medium: 200, hard: 150 }[difficulty] || 200;
  const max = { easy: 15000, medium: 25000, hard: 35000 }[difficulty] || 25000;
  return randomInt(min, max);
}

function buildGrowthNumericSample(allowNegative, difficulty) {
  for (let i = 0; i < 80; i += 1) {
    const rate = allowNegative && Math.random() < 0.4
      ? randomRate(-28, -1.5, 1)
      : randomRate(0.5, 38, 1);
    const factor = roundTo(1 + rate / 100, 4);
    if (factor <= 0) continue;
    const prev = randomBase(difficulty);
    const current = roundTo(prev * factor, 0);
    const minCurrent = { easy: 250, medium: 180, hard: 100 }[difficulty] || 180;
    const maxCurrent = { easy: 35000, medium: 50000, hard: 80000 }[difficulty] || 50000;
    if (current >= minCurrent && current <= maxCurrent) {
      return { prev, current, factor, rate, increment: current - prev };
    }
  }
  const prev = randomBase(difficulty);
  const rate = randomRate(1, 20, 1);
  const factor = roundTo(1 + rate / 100, 4);
  const current = roundTo(prev * factor, 0);
  return { prev, current, factor, rate, increment: current - prev };
}

function makeCompareQuestion(title, left, right, metaLines, answer) {
  return makeQuestion({
    prompt: title,
    answer,
    answerMode: "compare",
    compare: {
      left,
      right,
      labels: { gt: "大于", lt: "小于" },
    },
    metaLines,
    reviewPrompt: `${left} ? ${right}`,
    answerLabelMap: { gt: "大于", lt: "小于" },
  });
}

function relativeGap(a, b) {
  return Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1);
}

function buildComparePrompt(current, factor, rate) {
  return `${current}/${formatNumber(factor, 3)} × ${formatNumber(rate, 1)}%`;
}

function buildBasePrompt(current, factor) {
  return `${current}/${formatNumber(factor, 3)}`;
}

function fracNode(num, den) {
  return { type: "frac", num: String(num), den: String(den) };
}

function textNode(value) {
  return { type: "text", value: String(value) };
}

function opNode(value) {
  return { type: "op", value };
}

function groupNode(items) {
  return { type: "group", items };
}

function buildCompareFormula(current, factor, rate) {
  return [fracNode(current, formatNumber(factor, 3)), opNode("×"), textNode(`${formatNumber(rate, 1)}%`)];
}

function buildBaseFormula(current, factor) {
  return [fracNode(current, formatNumber(factor, 3))];
}

function buildBaseRatioFormula(partCurrent, totalCurrent, totalFactor, partFactor) {
  return [
    groupNode([fracNode(partCurrent, totalCurrent)]),
    opNode("×"),
    groupNode([fracNode(formatNumber(totalFactor, 3), formatNumber(partFactor, 3))]),
    opNode("≈"),
  ];
}

function buildFractionFormula(numerator, denominator, suffix = "≈") {
  return [fracNode(numerator, denominator), opNode(suffix)];
}

function getDifficultyFromIndex(index, questionCount) {
  const easyCount = Math.max(1, Math.round(questionCount * 0.3));
  const hardCount = Math.max(1, Math.round(questionCount * 0.2));
  const mediumCount = Math.max(0, questionCount - easyCount - hardCount);
  const plan = [
    ...Array.from({ length: easyCount }, () => "easy"),
    ...Array.from({ length: mediumCount }, () => "medium"),
    ...Array.from({ length: hardCount }, () => "hard"),
  ];
  return plan[Math.min(index, plan.length - 1)] || "medium";
}

// ──────────────────────────────────────────
// 各训练项生成器
// ──────────────────────────────────────────

function generateGrowthPre(difficulty, history) {
  for (let i = 0; i < 40; i += 1) {
    const sample = buildGrowthNumericSample(true, difficulty);
    if (history && history.isRepeat(sample.rate)) continue;
    if (history) history.record(sample.rate);
    return makeQuestion({
      prompt: `${sample.current}/${formatNumber(sample.factor, 3)}≈`,
      answer: String(sample.prev),
      contextLines: [`现期：${sample.current}，增长率：${sample.rate}%`],
      metaLines: ["允许误差范围：±3%"],
      reviewPrompt: `现期 ${sample.current}，增长率 ${sample.rate}% ，求前期量`,
      difficulty,
      rate: sample.rate,
    });
  }
  const sample = buildGrowthNumericSample(true, difficulty);
  if (history) history.record(sample.rate);
  return makeQuestion({
    prompt: `${sample.current}/${formatNumber(sample.factor, 3)}≈`,
    answer: String(sample.prev),
    contextLines: [`现期：${sample.current}，增长率：${sample.rate}%`],
    metaLines: ["允许误差范围：±3%"],
    reviewPrompt: `现期 ${sample.current}，增长率 ${sample.rate}% ，求前期量`,
    difficulty,
    rate: sample.rate,
  });
}

function generateGrowthInc(difficulty, history) {
  for (let i = 0; i < 40; i += 1) {
    const sample = buildGrowthNumericSample(true, difficulty);
    if (history && history.isRepeat(sample.rate)) continue;
    if (history) history.record(sample.rate);
    return makeQuestion({
      prompt: `现期:${sample.current} 增长率:${sample.rate}%`,
      answer: String(sample.increment),
      contextLines: ["求增长量：？"],
      metaLines: ["允许误差范围：±3%", "需要负号时会自动生成"],
      reviewPrompt: `现期 ${sample.current}，增长率 ${sample.rate}% ，求增长量`,
      difficulty,
      rate: sample.rate,
    });
  }
  const sample = buildGrowthNumericSample(true, difficulty);
  if (history) history.record(sample.rate);
  return makeQuestion({
    prompt: `现期:${sample.current} 增长率:${sample.rate}%`,
    answer: String(sample.increment),
    contextLines: ["求增长量：？"],
    metaLines: ["允许误差范围：±3%", "需要负号时会自动生成"],
    reviewPrompt: `现期 ${sample.current}，增长率 ${sample.rate}% ，求增长量`,
    difficulty,
    rate: sample.rate,
  });
}

const STANDARD_DENOMINATORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20];

function generatePercentCalc(difficulty) {
  const isForward = difficulty === "easy" ? Math.random() < 0.65 : Math.random() < 0.5;
  const useStandard = difficulty === "easy" ? Math.random() < 0.85 : Math.random() < 0.65;
  const denominatorPool = difficulty === "easy"
    ? STANDARD_DENOMINATORS.filter((v) => [2, 4, 5, 8, 10, 20].includes(v))
    : difficulty === "hard"
      ? STANDARD_DENOMINATORS.filter((v) => [7, 9, 11, 12, 14, 15, 16, 18].includes(v))
      : STANDARD_DENOMINATORS;

  if (useStandard) {
    if (isForward) {
      const denominator = pick(denominatorPool);
      const percent = roundTo((1 / denominator) * 100, 1);
      return makeQuestion({
        prompt: `1/${denominator}≈%`,
        answer: formatNumber(percent, 1),
        contextLines: ["写到小数点后一位即可"],
        metaLines: ["允许误差范围：±2%"],
        reviewPrompt: `1/${denominator} 约等于多少百分比`,
        promptFormula: [fracNode(1, denominator), opNode("≈"), textNode("%")],
        difficulty,
      });
    }
    const denominator = pick(denominatorPool);
    const percent = roundTo((1 / denominator) * 100, 1);
    return makeQuestion({
      prompt: `${percent}%≈1/?`,
      answer: String(denominator),
      metaLines: ["允许误差范围：±2%"],
      reviewPrompt: `${percent}% 约等于 1/多少`,
      promptFormula: [textNode(`${formatNumber(percent, 1)}%`), opNode("≈"), fracNode(1, "?")],
      difficulty,
    });
  }

  // 随机百分数练习：用非标准分母生成，考生需估算
  const randomDen = pick([13, 17, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 35, 36, 40, 45]);
  const percent = roundTo((1 / randomDen) * 100, 1);
  if (isForward) {
    return makeQuestion({
      prompt: `1/${randomDen}≈%`,
      answer: formatNumber(percent, 1),
      contextLines: ["写到小数点后一位即可"],
      metaLines: ["允许误差范围：±3%"],
      reviewPrompt: `1/${randomDen} 约等于多少百分比（非标准百化分）`,
      promptFormula: [fracNode(1, randomDen), opNode("≈"), textNode("%")],
      difficulty,
    });
  }
  return makeQuestion({
    prompt: `${percent}%≈1/?`,
    answer: String(randomDen),
    metaLines: ["允许误差范围：±3%"],
    reviewPrompt: `${percent}% 约等于 1/多少（非标准百化分）`,
    promptFormula: [textNode(`${formatNumber(percent, 1)}%`), opNode("≈"), fracNode(1, "?")],
    difficulty,
  });
}

function generateIncCompare(difficulty) {
  const minGap = { easy: 0.12, medium: 0.07, hard: 0.04 }[difficulty] || 0.07;
  const maxGap = { easy: 0.50, medium: 0.35, hard: 0.20 }[difficulty] || 0.35;
  const baseFactor = { easy: 0.12, medium: 0.18, hard: 0.22 }[difficulty] || 0.18;

  for (let i = 0; i < 80; i += 1) {
    const commonBase = randomBase(difficulty);
    const leftBase = Math.round(commonBase * (1 + (Math.random() - 0.5) * baseFactor * 2));
    const rightBase = Math.round(commonBase * (1 + (Math.random() - 0.5) * baseFactor * 2));
    if (leftBase <= 0 || rightBase <= 0) continue;
    const leftRate = randomRate(1, 35, 1);
    const rightRate = randomRate(1, 35, 1);
    const leftFactor = roundTo(1 + leftRate / 100, 4);
    const rightFactor = roundTo(1 + rightRate / 100, 4);
    const left = { prev: leftBase, current: roundTo(leftBase * leftFactor, 0), factor: leftFactor, rate: leftRate, increment: roundTo(leftBase * leftFactor, 0) - leftBase };
    const right = { prev: rightBase, current: roundTo(rightBase * rightFactor, 0), factor: rightFactor, rate: rightRate, increment: roundTo(rightBase * rightFactor, 0) - rightBase };
    const gap = relativeGap(left.increment, right.increment);
    if (gap >= minGap && gap <= maxGap) {
      const question = makeCompareQuestion(
        "增量比大小",
        buildComparePrompt(left.current, left.factor, left.rate),
        buildComparePrompt(right.current, right.factor, right.rate),
        [],
        left.increment > right.increment ? "gt" : "lt"
      );
      question.compare.leftFormula = buildCompareFormula(left.current, left.factor, left.rate);
      question.compare.rightFormula = buildCompareFormula(right.current, right.factor, right.rate);
      question.difficulty = difficulty;
      return question;
    }
  }
  // 兜底：基于同一个 commonBase 偏移
  const baseVal = randomBase(difficulty);
  const lB = Math.round(baseVal * (1 + (Math.random() - 0.5) * 0.3));
  const rB = Math.round(baseVal * (1 + (Math.random() - 0.5) * 0.3));
  const lR = randomRate(1, 25, 1), rR = randomRate(1, 25, 1);
  const lF = roundTo(1 + lR / 100, 4), rF = roundTo(1 + rR / 100, 4);
  const fallbackLeft = { prev: lB, current: roundTo(lB * lF, 0), factor: lF, rate: lR, increment: roundTo(lB * lF, 0) - lB };
  const fallbackRight = { prev: rB, current: roundTo(rB * rF, 0), factor: rF, rate: rR, increment: roundTo(rB * rF, 0) - rB };
  const fallback = makeCompareQuestion(
    "增量比大小",
    buildComparePrompt(fallbackLeft.current, fallbackLeft.factor, fallbackLeft.rate),
    buildComparePrompt(fallbackRight.current, fallbackRight.factor, fallbackRight.rate),
    [],
    fallbackLeft.increment > fallbackRight.increment ? "gt" : "lt"
  );
  fallback.compare.leftFormula = buildCompareFormula(fallbackLeft.current, fallbackLeft.factor, fallbackLeft.rate);
  fallback.compare.rightFormula = buildCompareFormula(fallbackRight.current, fallbackRight.factor, fallbackRight.rate);
  fallback.difficulty = difficulty;
  return fallback;
}

function generateBaseCompare(difficulty) {
  const minGap = { easy: 0.10, medium: 0.06, hard: 0.03 }[difficulty] || 0.06;
  const maxGap = { easy: 0.45, medium: 0.30, hard: 0.15 }[difficulty] || 0.30;
  const baseFactor = { easy: 0.15, medium: 0.20, hard: 0.25 }[difficulty] || 0.20;

  for (let i = 0; i < 80; i += 1) {
    const commonBase = randomBase(difficulty);
    const leftBase = Math.round(commonBase * (1 + (Math.random() - 0.5) * baseFactor * 2));
    const rightBase = Math.round(commonBase * (1 + (Math.random() - 0.5) * baseFactor * 2));
    if (leftBase <= 0 || rightBase <= 0) continue;
    const lRate = randomRate(-15, 30, 1);
    const rRate = randomRate(-15, 30, 1);
    const lFactor = roundTo(1 + lRate / 100, 4);
    const rFactor = roundTo(1 + rRate / 100, 4);
    const leftPrev = leftBase, rightPrev = rightBase;
    const leftCurrent = roundTo(leftPrev * lFactor, 0);
    const rightCurrent = roundTo(rightPrev * rFactor, 0);
    if (leftCurrent <= 0 || rightCurrent <= 0) continue;
    const gap = relativeGap(leftPrev, rightPrev);
    if (gap >= minGap && gap <= maxGap && leftCurrent > 0 && rightCurrent > 0) {
      const question = makeCompareQuestion(
        "基期比大小",
        buildBasePrompt(leftCurrent, lFactor),
        buildBasePrompt(rightCurrent, rFactor),
        [],
        leftPrev > rightPrev ? "gt" : "lt"
      );
      question.compare.leftFormula = buildBaseFormula(leftCurrent, lFactor);
      question.compare.rightFormula = buildBaseFormula(rightCurrent, rFactor);
      question.difficulty = difficulty;
      return question;
    }
  }
  // 兜底
  const baseVal = randomBase(difficulty);
  const lB = Math.round(baseVal * (1 + (Math.random() - 0.5) * 0.3));
  const rB = Math.round(baseVal * (1 + (Math.random() - 0.5) * 0.3));
  const lR = randomRate(-10, 20, 1), rR = randomRate(-10, 20, 1);
  const lF = roundTo(1 + lR / 100, 4), rF = roundTo(1 + rR / 100, 4);
  const fbLP = lB, fbRP = rB;
  const fbLC = roundTo(fbLP * lF, 0), fbRC = roundTo(fbRP * rF, 0);
  const fbQ = makeCompareQuestion(
    "基期比大小",
    buildBasePrompt(fbLC, lF),
    buildBasePrompt(fbRC, rF),
    [],
    fbLP > fbRP ? "gt" : "lt"
  );
  fbQ.compare.leftFormula = buildBaseFormula(fbLC, lF);
  fbQ.compare.rightFormula = buildBaseFormula(fbRC, rF);
  fbQ.difficulty = difficulty;
  return fbQ;
}

function generateFractionDecimal(numeratorMin, numeratorMax, denominatorMin, denominatorMax, requireGreater, difficulty) {
  for (let i = 0; i < 200; i += 1) {
    const denominator = randomInt(denominatorMin, denominatorMax);
    const numerator = randomInt(numeratorMin, numeratorMax);
    if (denominator <= 0) continue;
    const reduced = reduceFraction(numerator, denominator);
    if (!reduced) continue;
    if (requireGreater ? reduced.numerator <= reduced.denominator : reduced.numerator >= reduced.denominator) continue;
    return makeQuestion({
      prompt: `${reduced.numerator}/${reduced.denominator} ≈`,
      answer: formatNumber(reduced.value, 3),
      contextLines: ["建议写到小数点后2~3位"],
      metaLines: ["允许误差范围：±2%"],
      reviewPrompt: `${reduced.numerator}/${reduced.denominator} 约等于多少`,
      promptFormula: buildFractionFormula(reduced.numerator, reduced.denominator),
      difficulty,
    });
  }
  return null;
}

function generateBaseRatio(difficulty) {
  for (let attempt = 0; attempt < 320; attempt += 1) {
    const totalBase = randomBase(difficulty);
    const partBase = randomInt(Math.floor(Math.max(50, totalBase * 0.12)), Math.floor(totalBase * 0.78));
    const totalRate = randomRate(0.5, 28, 1);
    const partRate = randomRate(0.5, 28, 1);
    const totalFactor = roundTo(1 + totalRate / 100, 4);
    const partFactor = roundTo(1 + partRate / 100, 4);
    const totalCurrent = roundTo(totalBase * totalFactor, 0);
    const partCurrent = roundTo(partBase * partFactor, 0);

    if (partCurrent <= 0 || totalCurrent <= 0) continue;

    const ratio = (partCurrent / totalCurrent) * (totalFactor / partFactor);
    if (ratio <= 0 || ratio >= 1) continue;

    const difficultyBonus = difficulty === "easy" ? 0.0 : difficulty === "hard" ? 0.03 : 0.01;
    if (Math.abs(totalRate - partRate) >= (difficulty === "easy" ? 5 : difficulty === "hard" ? 1.5 : 2.5)) {
      return makeQuestion({
        prompt: `(${partCurrent}/${totalCurrent}) × (${formatNumber(totalFactor, 3)}/${formatNumber(partFactor, 3)}) ≈`,
        answer: formatNumber(ratio, 3),
        contextLines: [`A：${partCurrent}，${partRate}%；B：${totalCurrent}，${totalRate}%`],
        metaLines: ["允许误差范围：±3%"],
        reviewPrompt: `(${partCurrent}/${totalCurrent}) × (${formatNumber(totalFactor, 3)}/${formatNumber(partFactor, 3)})`,
        promptFormula: buildBaseRatioFormula(partCurrent, totalCurrent, totalFactor, partFactor),
        difficulty,
      });
    }
  }
  // 兜底：用最后一次计算结果
  const totalBase = randomBase(difficulty);
  const partBase = randomInt(Math.floor(Math.max(50, totalBase * 0.12)), Math.floor(totalBase * 0.78));
  const totalRate = randomRate(0.5, 28, 1);
  const partRate = randomRate(0.5, 28, 1);
  const totalCurrent = roundTo(totalBase * roundTo(1 + totalRate / 100, 4), 0);
  const partCurrent = roundTo(partBase * roundTo(1 + partRate / 100, 4), 0);
  const ratio = (partCurrent / totalCurrent) * (roundTo(1 + totalRate / 100, 4) / roundTo(1 + partRate / 100, 4));
  return makeQuestion({
    prompt: `(${partCurrent}/${totalCurrent}) × (${formatNumber(roundTo(1 + totalRate / 100, 4), 3)}/${formatNumber(roundTo(1 + partRate / 100, 4), 3)}) ≈`,
    answer: formatNumber(ratio, 3),
    contextLines: [`A：${partCurrent}，${totalRate}%；B：${totalCurrent}，${partRate}%`],
    metaLines: ["允许误差范围：±3%"],
    reviewPrompt: `(${partCurrent}/${totalCurrent}) × (${formatNumber(roundTo(1 + totalRate / 100, 4), 3)}/${formatNumber(roundTo(1 + partRate / 100, 4), 3)})`,
    promptFormula: buildBaseRatioFormula(partCurrent, totalCurrent, roundTo(1 + totalRate / 100, 4), roundTo(1 + partRate / 100, 4)),
    difficulty,
  });
}

function generateFractionCompare(difficulty) {
  const minGap = { easy: 0.06, medium: 0.025, hard: 0.015 }[difficulty] || 0.025;
  const maxGap = { easy: 0.30, medium: 0.20, hard: 0.12 }[difficulty] || 0.20;

  for (let i = 0; i < 80; i += 1) {
    const d1 = randomInt(12, 450);
    const n1 = randomInt(1, d1 - 1);
    const r1 = reduceFraction(n1, d1);
    const d2 = randomInt(12, 450);
    const n2 = randomInt(1, d2 - 1);
    const r2 = reduceFraction(n2, d2);
    if (!r1 || !r2) continue;
    if (r1.denominator === r2.denominator) continue;
    const gap = Math.abs(r1.value - r2.value);
    if (gap >= minGap && gap <= maxGap) {
      const question = makeCompareQuestion(
        "分数比大小",
        `${r1.numerator}/${r1.denominator}`,
        `${r2.numerator}/${r2.denominator}`,
        [],
        r1.value > r2.value ? "gt" : "lt"
      );
      question.compare.leftFormula = [fracNode(r1.numerator, r1.denominator)];
      question.compare.rightFormula = [fracNode(r2.numerator, r2.denominator)];
      question.difficulty = difficulty;
      return question;
    }
  }
  const d1 = randomInt(20, 200);
  const n1 = randomInt(1, d1 - 1);
  const r1 = reduceFraction(n1, d1) || { numerator: n1, denominator: d1, value: n1 / d1 };
  const d2 = randomInt(20, 200);
  const n2 = randomInt(1, d2 - 1);
  const r2 = reduceFraction(n2, d2) || { numerator: n2, denominator: d2, value: n2 / d2 };
  const question = makeCompareQuestion(
    "分数比大小",
    `${r1.numerator}/${r1.denominator}`,
    `${r2.numerator}/${r2.denominator}`,
    [],
    r1.value > r2.value ? "gt" : "lt"
  );
  question.compare.leftFormula = [fracNode(r1.numerator, r1.denominator)];
  question.compare.rightFormula = [fracNode(r2.numerator, r2.denominator)];
  question.difficulty = difficulty;
  return question;
}

function generateAnnualAverage(difficulty) {
  const years = [2012, 2013, 2014, 2015, 2016];
  const first = randomInt(difficulty === "easy" ? 600 : 560, difficulty === "hard" ? 820 : 760);
  const values = [first];
  for (let i = 1; i < years.length; i += 1) {
    const drift = difficulty === "easy" ? randomInt(-20, 70) : difficulty === "hard" ? randomInt(-90, 120) : randomInt(-40, 90);
    values.push(Math.max(420, Math.min(980, values[i - 1] + drift)));
  }
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const maxValue = Math.max(...values);
  const chartMax = Math.ceil(maxValue / 172) * 172;
  const yTicks = Array.from({ length: 6 }, (_, index) => chartMax - index * (chartMax / 5));
  const barHeights = values.map((value) => roundTo(Math.max(36, (value / chartMax) * 260), 1));

  return makeQuestion({
    prompt: `求${years[0]}~${years[years.length - 1]}的年平均成交量：万`,
    answer: String(roundTo(average, 0)),
    metaLines: ["允许误差范围：±1%"],
    chart: {
      unit: "万",
      labels: years,
      values,
      barHeights,
      legend: "成交量",
      maxValue: chartMax,
      yTicks: yTicks.map((value) => roundTo(value, 0)),
    },
    reviewPrompt: `${years[0]}~${years[years.length - 1]}平均值`,
    difficulty,
  });
}

const generators = {
  "growth-pre": generateGrowthPre,
  "growth-inc": generateGrowthInc,
  "percent-calc": generatePercentCalc,
  "inc-compare": generateIncCompare,
  "base-compare": generateBaseCompare,
  "fraction-small": (difficulty) => generateFractionDecimal(1, 800, 10, 600, false, difficulty),
  "fraction-large": (difficulty) => generateFractionDecimal(100, 1200, 10, 800, true, difficulty),
  "base-ratio": generateBaseRatio,
  "fraction-compare": generateFractionCompare,
  "annual-average": generateAnnualAverage,
};

function generateDataAnalysisSet(trainingId, questionCount) {
  const generator = generators[trainingId];
  if (!generator) return [];

  const history = createHistory(10);

  return Array.from({ length: questionCount }, (_, index) => {
    const difficulty = getDifficultyFromIndex(index, questionCount);
    const question = generator(difficulty, history);
    if (question && question.rate !== undefined) {
      history.record(question.rate);
    }
    if (question && question.compare?.left) {
      history.record(question.compare.left.length);
    }
    return {
      id: `${trainingId}-${index + 1}`,
      index: index + 1,
      ...question,
    };
  });
}

module.exports = {
  generateDataAnalysisSet,
};
