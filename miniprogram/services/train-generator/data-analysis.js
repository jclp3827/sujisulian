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

function makeQuestion(question) {
  return question;
}

const PERCENT_CALC_DENOMINATORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20];
const COMPARE_FACTOR_POOL = [1.008, 1.010, 1.012, 1.015, 1.018, 1.020, 1.025, 1.030, 1.040, 1.050, 1.080, 1.100, 1.120];
const COMPARE_RATE_POOL = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0, 2.3, 2.5, 3.0, 4.0, 5.0, 8.0, 10.0, 12.0];
const FRIENDLY_GROWTH_FACTORS = [0.778, 0.833, 0.875, 0.889, 0.917, 0.944, 1.045, 1.052, 1.056, 1.067, 1.083, 1.091, 1.111, 1.125, 1.143, 1.167, 1.182, 1.200, 1.234, 1.250];
const FRIENDLY_GROWTH_FACTOR_POOLS = {
  easy: [1.045, 1.052, 1.056, 1.067, 1.083, 1.091, 1.111, 1.125, 1.143, 1.167],
  medium: [0.875, 0.889, 0.917, 0.944, 1.045, 1.052, 1.056, 1.067, 1.083, 1.091, 1.111, 1.125, 1.143, 1.167, 1.182, 1.200],
  hard: FRIENDLY_GROWTH_FACTORS,
};
const FRACTION_DECIMAL_TARGETS = [0.125, 0.143, 0.167, 0.2, 0.222, 0.25, 0.286, 0.333, 0.375, 0.4, 0.429, 0.5, 0.571, 0.625, 0.667, 0.714, 0.75, 0.8, 0.833, 1.125, 1.2, 1.25, 1.333, 1.4, 1.5];
const GROWTH_RATE_SIMPLE = [1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 8.0, 10.0, 12.0, 15.0, 20.0, 25.0];
const GROWTH_RATE_COMMON = [1.8, 2.3, 3.5, 4.5, 5.2, 5.6, 6.3, 6.7, 7.8, 8.3, 9.1, 11.1, 12.5, 13.6, 14.3, 16.7, 18.2, 21.4, 23.4, 28.6, 33.3];
const GROWTH_RATE_TRICKY = [0.9, 1.2, 1.7, 2.8, 3.8, 4.8, 6.1, 7.1, 8.7, 9.8, 10.5, 11.8, 13.2, 14.8, 17.6, 19.4, 22.7, 26.3, 31.6, 36.4];
const GROWTH_RATE_NEGATIVE = [-24.7, -21.3, -18.2, -16.7, -15.4, -12.5, -11.1, -9.4, -8.3, -6.7, -5.6, -4.5, -3.8, -2.6];

function randomOneDecimal(min, max) {
  return randomInt(min * 10, max * 10) / 10;
}

function pickGrowthRate(difficulty = "medium", allowNegative = true, profile = "general") {
  const negativeChance = {
    easy: 0.02,
    medium: 0.15,
    hard: 0.22,
  }[difficulty] || 0.15;
  const fixedChance = {
    easy: 0.82,
    medium: 0.68,
    hard: 0.52,
  }[difficulty] || 0.68;
  const rangeMap = {
    general: {
      easy: [1.5, 15],
      medium: [1.2, 28],
      hard: [0.8, 40],
    },
    compare: {
      easy: [1.5, 15],
      medium: [1.0, 26],
      hard: [0.8, 35],
    },
  };
  const fixedPoolMap = {
    easy: [...GROWTH_RATE_SIMPLE, ...GROWTH_RATE_COMMON.filter((value) => value <= 16.7)],
    medium: [...GROWTH_RATE_SIMPLE, ...GROWTH_RATE_COMMON, ...GROWTH_RATE_TRICKY.filter((value) => value <= 26.3)],
    hard: [...GROWTH_RATE_COMMON, ...GROWTH_RATE_TRICKY],
  };
  const range = (rangeMap[profile] && rangeMap[profile][difficulty]) || rangeMap.general.medium;
  const fixedPool = fixedPoolMap[difficulty] || fixedPoolMap.medium;

  if (allowNegative && Math.random() < negativeChance) {
    return Math.random() < 0.72 ? pick(GROWTH_RATE_NEGATIVE) : randomOneDecimal(-28, -2);
  }

  if (Math.random() < fixedChance) {
    return pick(fixedPool);
  }

  return randomOneDecimal(range[0], range[1]);
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
  return {
    type: "frac",
    num: String(num),
    den: String(den),
  };
}

function textNode(value) {
  return {
    type: "text",
    value: String(value),
  };
}

function opNode(value) {
  return {
    type: "op",
    value,
  };
}

function groupNode(items) {
  return {
    type: "group",
    items,
  };
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

function pickFriendlyBaseValue() {
  const buckets = [
    randomInt(60, 98) * 10,
    randomInt(12, 98) * 50,
    randomInt(8, 68) * 100,
  ];
  return pick(buckets);
}

function pickGrowthBaseValue(difficulty = "medium") {
  const friendlyChance = {
    easy: 0.92,
    medium: 0.72,
    hard: 0.38,
  }[difficulty] || 0.72;

  if (Math.random() < friendlyChance) {
    return pickFriendlyBaseValue();
  }

  const noisyBuckets = [
    randomInt(430, 1980),
    randomInt(1200, 9800),
    randomInt(4200, difficulty === "hard" ? 28000 : 18000),
  ];
  return pick(noisyBuckets);
}

function buildGrowthNumericSample(allowNegative = true, difficulty = "medium") {
  const friendlyChance = {
    easy: 0.88,
    medium: 0.68,
    hard: 0.45,
  }[difficulty] || 0.68;
  const friendlyValueChance = {
    easy: 0.9,
    medium: 0.72,
    hard: 0.4,
  }[difficulty] || 0.72;
  const currentMin = difficulty === "hard" ? 800 : 250;
  const currentMax = difficulty === "hard" ? 30000 : 20000;

  for (let i = 0; i < 80; i += 1) {
    const friendlyPool = FRIENDLY_GROWTH_FACTOR_POOLS[difficulty] || FRIENDLY_GROWTH_FACTORS;
    const factor = Math.random() < friendlyChance
      ? pick(friendlyPool)
      : roundTo(1 + pickGrowthRate(difficulty, allowNegative) / 100, 3);
    if (factor <= 0) {
      continue;
    }

    const prev = Math.random() < friendlyValueChance ? pickFriendlyBaseValue() : pickGrowthBaseValue(difficulty);
    const current = roundTo(prev * factor, 0);
    const rate = roundTo((factor - 1) * 100, 1);
    const increment = current - prev;

    const currentFriendly = current % 10 === 0 || current % 100 === 0;
    const prevFriendly = prev % 10 === 0 || prev % 100 === 0;
    const passFriendly = difficulty === "hard" ? true : currentFriendly && prevFriendly;
    if (current > currentMin && current < currentMax && passFriendly) {
      return { prev, current, factor, rate, increment };
    }
  }

  const prev = pickGrowthBaseValue(difficulty);
  const rate = pickGrowthRate(difficulty, allowNegative);
  const factor = roundTo(1 + rate / 100, 3);
  const current = roundTo(prev * factor, 0);
  return { prev, current, factor, rate, increment: current - prev };
}

function buildFriendlyFraction(requireGreater, difficulty = "medium") {
  const pool = FRACTION_DECIMAL_TARGETS.filter((value) => (requireGreater ? value > 1 : value < 1));
  const targetPool = difficulty === "easy"
    ? pool.filter((value) => [0.125, 0.167, 0.2, 0.25, 0.333, 0.5, 0.667, 0.75, 0.8, 1.125, 1.25, 1.333, 1.5].includes(value))
    : pool;
  for (let i = 0; i < 80; i += 1) {
    const target = pick(targetPool);
    const multiplierPool = difficulty === "hard" ? [10, 20, 25] : [5, 10, 20];
    const denominator = pick([8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 24, 25, 28, 32, 36, 40, 45, 48, 50]) * pick(multiplierPool);
    const numerator = Math.round(target * denominator);

    if (numerator <= 0) {
      continue;
    }
    if (requireGreater && numerator <= denominator) {
      continue;
    }
    if (!requireGreater && numerator >= denominator) {
      continue;
    }

    const actual = numerator / denominator;
    if (Math.abs(actual - target) > 0.015) {
      continue;
    }

    return { numerator, denominator, value: actual };
  }

  return null;
}

function generateGrowthPre(difficulty) {
  const sample = buildGrowthNumericSample(true, difficulty);

  return makeQuestion({
    prompt: `${sample.current}/${formatNumber(sample.factor, 3)}≈`,
    answer: String(sample.prev),
    contextLines: [`现期：${sample.current}，增长率：${sample.rate}%`],
    metaLines: ["允许误差范围：±3%"],
    reviewPrompt: `现期 ${sample.current}，增长率 ${sample.rate}% ，求前期量`,
    difficulty,
  });
}

function generateGrowthInc(difficulty) {
  const sample = buildGrowthNumericSample(true, difficulty);

  return makeQuestion({
    prompt: `现期:${sample.current} 增长率:${sample.rate}%`,
    answer: String(sample.increment),
    contextLines: ["求增长量：？"],
    metaLines: ["允许误差范围：±3%", "需要负号时会自动生成"],
    reviewPrompt: `现期 ${sample.current}，增长率 ${sample.rate}% ，求增长量`,
    difficulty,
  });
}

function generatePercentCalc(difficulty) {
  const calcDirection = difficulty === "easy" ? (Math.random() < 0.65 ? "forward" : "reverse") : (Math.random() < 0.5 ? "forward" : "reverse");
  const denominatorPool = difficulty === "easy"
    ? PERCENT_CALC_DENOMINATORS.filter((value) => [2, 4, 5, 8, 10, 20].includes(value))
    : difficulty === "hard"
      ? PERCENT_CALC_DENOMINATORS.filter((value) => [7, 9, 11, 12, 14, 15, 16, 18].includes(value))
      : PERCENT_CALC_DENOMINATORS;

  if (calcDirection === "forward") {
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

function makeGrowthPair(difficulty = "medium") {
  const base = pickGrowthBaseValue(difficulty);
  const rate = pickGrowthRate(difficulty, false, "compare");
  const factor = roundTo(1 + rate / 100, 3);
  const current = roundTo(base * factor, 0);
  const increment = current - base;
  return { current, rate, factor, base, increment };
}

function makeIncCompareTemplate(difficulty) {
  const templates = difficulty === "easy"
    ? ["same-rate", "same-base"]
    : difficulty === "hard"
      ? ["cross", "same-current", "close-mixed", "same-base"]
      : ["same-rate", "same-current", "cross"];
  return pick(templates);
}

function makeBaseCompareTemplate(difficulty) {
  const templates = difficulty === "easy"
    ? ["same-factor", "same-current"]
    : difficulty === "hard"
      ? ["close-factor", "cross", "same-current"]
      : ["same-factor", "same-current", "cross"];
  return pick(templates);
}

function buildIncComparePair(difficulty) {
  const template = makeIncCompareTemplate(difficulty);
  let left = makeGrowthPair(difficulty);
  let right = makeGrowthPair(difficulty);

  if (template === "same-rate") {
    const rate = pick(difficulty === "easy" ? [2.0, 2.5, 4.0, 5.0, 10.0] : COMPARE_RATE_POOL);
    left = makeGrowthPair(difficulty);
    right = makeGrowthPair(difficulty);
    left.rate = rate;
    right.rate = rate;
    left.factor = roundTo(1 + rate / 100, 3);
    right.factor = roundTo(1 + rate / 100, 3);
    left.current = roundTo(left.base * left.factor, 0);
    right.current = roundTo(right.base * right.factor, 0);
    left.increment = left.current - left.base;
    right.increment = right.current - right.base;
  } else if (template === "same-current") {
    const current = pickGrowthBaseValue(difficulty);
    left = makeGrowthPair(difficulty);
    right = makeGrowthPair(difficulty);
    left.current = current;
    right.current = current;
    left.base = roundTo(left.current / left.factor, 0);
    right.base = roundTo(right.current / right.factor, 0);
    left.increment = left.current - left.base;
    right.increment = right.current - right.base;
  } else if (template === "same-base") {
    const base = pickGrowthBaseValue(difficulty);
    left = makeGrowthPair(difficulty);
    right = makeGrowthPair(difficulty);
    left.base = base;
    right.base = base;
    left.current = roundTo(left.base * left.factor, 0);
    right.current = roundTo(right.base * right.factor, 0);
    left.increment = left.current - left.base;
    right.increment = right.current - right.base;
  }

  return { left, right, template };
}

function buildBaseComparePair(difficulty) {
  const template = makeBaseCompareTemplate(difficulty);
  let left = makeGrowthPair(difficulty);
  let right = makeGrowthPair(difficulty);

  if (template === "same-factor") {
    const factor = pick([1.010, 1.015, 1.020, 1.025, 1.050, 1.100]);
    left = makeGrowthPair(difficulty);
    right = makeGrowthPair(difficulty);
    left.factor = factor;
    right.factor = factor;
    left.rate = roundTo((factor - 1) * 100, 1);
    right.rate = roundTo((factor - 1) * 100, 1);
    left.current = roundTo(left.base * left.factor, 0);
    right.current = roundTo(right.base * right.factor, 0);
    left.increment = left.current - left.base;
    right.increment = right.current - right.base;
  } else if (template === "same-current") {
    const current = pickGrowthBaseValue(difficulty);
    left = makeGrowthPair(difficulty);
    right = makeGrowthPair(difficulty);
    left.current = current;
    right.current = current;
    left.base = roundTo(left.current / left.factor, 0);
    right.base = roundTo(right.current / right.factor, 0);
    left.increment = left.current - left.base;
    right.increment = right.current - right.base;
  } else if (template === "close-factor") {
    const factorA = pick([1.010, 1.015, 1.020, 1.025, 1.030]);
    const factorB = pick([1.012, 1.018, 1.020, 1.025, 1.030]);
    left = makeGrowthPair(difficulty);
    right = makeGrowthPair(difficulty);
    left.factor = factorA;
    right.factor = factorB;
    left.rate = roundTo((factorA - 1) * 100, 1);
    right.rate = roundTo((factorB - 1) * 100, 1);
    left.current = roundTo(left.base * left.factor, 0);
    right.current = roundTo(right.base * right.factor, 0);
    left.increment = left.current - left.base;
    right.increment = right.current - right.base;
  }

  return { left, right, template };
}

function generateIncCompare(difficulty) {
  let { left, right, template } = buildIncComparePair(difficulty);

  for (let i = 0; i < 40; i += 1) {
    const enoughGap = relativeGap(left.increment, right.increment) > (difficulty === "easy" ? 0.12 : difficulty === "hard" ? 0.05 : 0.08);
    const notTooEasy = difficulty === "easy"
      ? relativeGap(left.current, right.current) < 0.42
      : difficulty === "hard"
        ? relativeGap(left.current, right.current) < 0.75 || relativeGap(left.rate, right.rate) < 1.2
        : relativeGap(left.current, right.current) < 0.55 || relativeGap(left.rate, right.rate) < 0.8;
    if (enoughGap && notTooEasy) {
      break;
    }
    ({ left, right, template } = buildIncComparePair(difficulty));
  }

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
  question.template = template;
  return question;
}

function generateBaseCompare(difficulty) {
  let { left, right, template } = buildBaseComparePair(difficulty);

  for (let i = 0; i < 40; i += 1) {
    const enoughGap = relativeGap(left.base, right.base) > (difficulty === "easy" ? 0.11 : difficulty === "hard" ? 0.05 : 0.07);
    const notTooEasy = difficulty === "easy"
      ? relativeGap(left.current, right.current) < 0.38
      : difficulty === "hard"
        ? relativeGap(left.current, right.current) < 0.65 || relativeGap(left.factor, right.factor) < 0.16
        : relativeGap(left.current, right.current) < 0.45 || relativeGap(left.factor, right.factor) < 0.1;
    if (enoughGap && notTooEasy) {
      break;
    }
    ({ left, right, template } = buildBaseComparePair(difficulty));
  }

  const question = makeCompareQuestion(
    "基期比大小",
    buildBasePrompt(left.current, left.factor),
    buildBasePrompt(right.current, right.factor),
    [],
    left.base > right.base ? "gt" : "lt"
  );
  question.compare.leftFormula = buildBaseFormula(left.current, left.factor);
  question.compare.rightFormula = buildBaseFormula(right.current, right.factor);
  question.difficulty = difficulty;
  question.template = template;
  return question;
}

function generateFractionDecimal(numeratorMin, numeratorMax, denominatorMin, denominatorMax, requireGreater, difficulty) {
  const friendlyChance = difficulty === "easy" ? 0.88 : difficulty === "hard" ? 0.45 : 0.72;
  if (Math.random() < friendlyChance) {
    const friendly = buildFriendlyFraction(requireGreater, difficulty);
    if (friendly) {
      return makeQuestion({
        prompt: `${friendly.numerator}/${friendly.denominator} ≈`,
        answer: formatNumber(friendly.value, 3),
        contextLines: ["建议写到小数点后2~3位"],
        metaLines: ["允许误差范围：±2%"],
        reviewPrompt: `${friendly.numerator}/${friendly.denominator} 约等于多少`,
        promptFormula: buildFractionFormula(friendly.numerator, friendly.denominator),
        difficulty,
      });
    }
  }

  for (let i = 0; i < 200; i += 1) {
    const numerator = randomInt(numeratorMin, numeratorMax);
    const denominator = randomInt(denominatorMin, denominatorMax);
    if (requireGreater ? numerator <= denominator : numerator >= denominator) {
      continue;
    }

    return makeQuestion({
      prompt: `${numerator}/${denominator} ≈`,
      answer: formatNumber(numerator / denominator, 3),
      contextLines: ["建议写到小数点后2~3位"],
      metaLines: ["允许误差范围：±2%"],
      reviewPrompt: `${numerator}/${denominator} 约等于多少`,
      promptFormula: buildFractionFormula(numerator, denominator),
      difficulty,
    });
  }

  return null;
}

function generateBaseRatio(difficulty) {
  const factorPool = [1.008, 1.010, 1.015, 1.020, 1.025, 1.030, 1.050, 1.080, 1.100, 1.120, 1.130, 1.150];
  const totalBase = randomInt(420, difficulty === "hard" ? 1400 : 980);
  const partBase = randomInt(Math.floor(totalBase * 0.16), Math.floor(totalBase * 0.76));
  const factorSubset = difficulty === "easy"
    ? factorPool.filter((item) => [1.010, 1.015, 1.020, 1.025, 1.050, 1.100].includes(item))
    : difficulty === "hard"
      ? factorPool
      : factorPool.filter((item) => ![1.008, 1.130].includes(item));
  const template = difficulty === "easy" ? pick(["stable", "part-fast"]) : difficulty === "hard" ? pick(["cross", "close"]) : pick(["stable", "part-fast", "total-fast"]);
  let totalFactor = pick(factorSubset);
  let partFactor = pick(factorSubset);
  if (template === "stable") {
    totalFactor = pick([1.010, 1.015, 1.020, 1.025]);
    partFactor = pick([1.010, 1.015, 1.020, 1.025]);
  } else if (template === "part-fast") {
    totalFactor = pick([1.010, 1.015, 1.020, 1.025, 1.030]);
    partFactor = pick([1.050, 1.080, 1.100, 1.120]);
  } else if (template === "total-fast") {
    totalFactor = pick([1.050, 1.080, 1.100, 1.120]);
    partFactor = pick([1.010, 1.015, 1.020, 1.025, 1.030]);
  } else if (template === "close") {
    totalFactor = pick([1.015, 1.020, 1.025, 1.030]);
    partFactor = pick([1.018, 1.020, 1.025, 1.030]);
  }
  const totalCurrent = roundTo(totalBase * totalFactor, 0);
  const partCurrent = roundTo(partBase * partFactor, 0);
  const totalRate = roundTo((totalFactor - 1) * 100, 1);
  const partRate = roundTo((partFactor - 1) * 100, 1);
  const ratio = (partCurrent / totalCurrent) * (totalFactor / partFactor);

  return makeQuestion({
    prompt: `(${partCurrent}/${totalCurrent}) × (${formatNumber(totalFactor, 3)}/${formatNumber(partFactor, 3)}) ≈`,
    answer: formatNumber(ratio, 3),
    contextLines: [`A：${partCurrent}，${partRate}%；B：${totalCurrent}，${totalRate}%`],
    metaLines: ["允许误差范围：±3%"],
    reviewPrompt: `(${partCurrent}/${totalCurrent}) × (${formatNumber(totalFactor, 3)}/${formatNumber(partFactor, 3)})`,
    promptFormula: buildBaseRatioFormula(partCurrent, totalCurrent, totalFactor, partFactor),
    difficulty,
    template,
  });
}

function makeFractionPair() {
  const denominator = randomInt(140, 420);
  const numerator = randomInt(Math.floor(denominator * 0.2), Math.floor(denominator * 0.88));
  return { numerator, denominator, value: numerator / denominator };
}

function generateFractionCompare(difficulty) {
  let left = buildFriendlyFraction(false, difficulty) || makeFractionPair();
  let right = buildFriendlyFraction(false, difficulty) || makeFractionPair();

  for (let i = 0; i < 40; i += 1) {
    const gap = Math.abs(left.value - right.value);
    const sameLevel = relativeGap(left.denominator, right.denominator) < (difficulty === "hard" ? 0.9 : 0.7);
    const lowerGap = difficulty === "easy" ? 0.08 : difficulty === "hard" ? 0.015 : 0.02;
    const upperGap = difficulty === "easy" ? 0.32 : difficulty === "hard" ? 0.15 : 0.22;
    if (gap > lowerGap && gap < upperGap && sameLevel) {
      break;
    }
    left = buildFriendlyFraction(false, difficulty) || makeFractionPair();
    right = buildFriendlyFraction(false, difficulty) || makeFractionPair();
  }

  const question = makeCompareQuestion(
    "分数比大小",
    `${left.numerator}/${left.denominator}`,
    `${right.numerator}/${right.denominator}`,
    [],
    left.value > right.value ? "gt" : "lt"
  );
  question.compare.leftFormula = [fracNode(left.numerator, left.denominator)];
  question.compare.rightFormula = [fracNode(right.numerator, right.denominator)];
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
  "fraction-small": (difficulty) => generateFractionDecimal(80, 320, 180, 600, false, difficulty),
  "fraction-large": (difficulty) => generateFractionDecimal(520, 980, 180, 720, true, difficulty),
  "base-ratio": generateBaseRatio,
  "fraction-compare": generateFractionCompare,
  "annual-average": generateAnnualAverage,
};

function generateDataAnalysisSet(trainingId, questionCount) {
  const generator = generators[trainingId];
  if (!generator) {
    return [];
  }

  return Array.from({ length: questionCount }, (_, index) => {
    const difficulty = getDifficultyFromIndex(index, questionCount);
    const question = generator(difficulty);
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
