function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[randomInt(0, list.length - 1)];
}

function makeQuestion(prompt, answer) {
  return {
    prompt,
    answer: String(answer),
  };
}

function generateAddition(min, max) {
  const left = randomInt(min, max);
  const right = randomInt(min, max);
  return makeQuestion(`${left} + ${right} =`, left + right);
}

function generateSubtraction(min, max) {
  const left = randomInt(min, max);
  const right = randomInt(min, left);
  return makeQuestion(`${left} - ${right} =`, left - right);
}

function generateMixed(leftMin, leftMax, rightMin, rightMax) {
  const first = randomInt(leftMin, leftMax);
  const second = randomInt(rightMin, rightMax);
  const third = randomInt(rightMin, rightMax);
  const total = first + second - third;
  if (total < 0) {
    return generateMixed(leftMin, leftMax, rightMin, rightMax);
  }
  return makeQuestion(`${first} + ${second} - ${third} =`, total);
}

function generateThreeDigitAddSub() {
  return pick([generateAddition(100, 999), generateSubtraction(100, 999)]);
}

function generateMultiAdd() {
  const numbers = Array.from({ length: 4 }, () => randomInt(10, 99));
  return makeQuestion(`${numbers.join(" + ")} =`, numbers.reduce((sum, item) => sum + item, 0));
}

function generateMakeHundred() {
  const left = randomInt(11, 89);
  return makeQuestion(`${left} + ? = 100`, 100 - left);
}

function generateMultiply(leftMin, leftMax, rightMin, rightMax) {
  const left = randomInt(leftMin, leftMax);
  const right = randomInt(rightMin, rightMax);
  return makeQuestion(`${left} × ${right} =`, left * right);
}

function generateMultiplyBy11() {
  return generateMultiply(10, 99, 11, 11);
}

function generateMultiplyBy15() {
  return generateMultiply(10, 99, 15, 15);
}

function generateDivision(dividendMin, dividendMax, divisorMin, divisorMax, quotientMin, quotientMax) {
  for (let i = 0; i < 200; i += 1) {
    const divisor = randomInt(divisorMin, divisorMax);
    const quotient = randomInt(quotientMin, quotientMax);
    const dividend = divisor * quotient;
    if (dividend >= dividendMin && dividend <= dividendMax) {
      return makeQuestion(`${dividend} ÷ ${divisor} =`, quotient);
    }
  }

  return null;
}

function generateDivisionByDividend(dividendMin, dividendMax, divisorMin, divisorMax) {
  for (let i = 0; i < 200; i += 1) {
    const divisor = randomInt(divisorMin, divisorMax);
    const minQuotient = Math.ceil(dividendMin / divisor);
    const maxQuotient = Math.floor(dividendMax / divisor);
    if (minQuotient > maxQuotient) {
      continue;
    }

    const quotient = randomInt(minQuotient, maxQuotient);
    const dividend = divisor * quotient;
    return makeQuestion(`${dividend} ÷ ${divisor} =`, quotient);
  }

  return null;
}

function generateEstimate() {
  const left = pick([18, 19, 21, 22, 28, 29, 31, 32, 38, 39, 41, 42]);
  const right = pick([18, 19, 21, 22, 28, 29, 31, 32, 38, 39, 41, 42]);
  return makeQuestion(`${left} × ${right} =`, left * right);
}

function generateRatioPercent(numeratorMin, numeratorMax, denominatorMin, denominatorMax) {
  for (let i = 0; i < 200; i += 1) {
    const numerator = randomInt(numeratorMin, numeratorMax);
    const denominator = randomInt(denominatorMin, denominatorMax);
    if (numerator >= denominator) {
      continue;
    }
    const answer = ((numerator / denominator) * 100).toFixed(1);
    return makeQuestion(`${numerator}/${denominator}=%`, answer);
  }

  return null;
}

const generators = {
  "two-digit-add-sub": () => pick([generateAddition(10, 99), generateSubtraction(10, 99)]),
  "make-hundred": generateMakeHundred,
  "three-digit-add": () => generateAddition(100, 999),
  "three-digit-sub": () => generateSubtraction(100, 999),
  "three-digit-mix": generateThreeDigitAddSub,
  "multi-add": generateMultiAdd,
  "mixed-add-sub": () => generateMixed(20, 999, 10, 99, 10, 99),
  "two-digit-mul-one-digit": () => generateMultiply(10, 99, 2, 9),
  "three-digit-mul-one-digit": () => generateMultiply(100, 999, 2, 9),
  "two-digit-mul-eleven": generateMultiplyBy11,
  "two-digit-mul-fifteen": generateMultiplyBy15,
  "two-digit-mul-two-digit": () => generateMultiply(10, 99, 10, 99),
  "three-digit-div-one-digit": () => generateDivisionByDividend(100, 999, 2, 9),
  "three-digit-div-two-digit": () => generateDivisionByDividend(100, 999, 10, 99),
  "three-digit-div-four-digit": () => generateRatioPercent(100, 999, 1000, 9999),
  "five-digit-div-two-digit": () => generateDivisionByDividend(10000, 99999, 10, 99),
  "mul-estimate": generateEstimate,
};

function generateBasicCalculationSet(trainingId, questionCount) {
  const generator = generators[trainingId];
  if (!generator) {
    return [];
  }

  return Array.from({ length: questionCount }, (_, index) => {
    const question = generator() || generateAddition(10, 99);
    return {
      id: `${trainingId}-${index + 1}`,
      index: index + 1,
      ...question,
    };
  });
}

module.exports = {
  generateBasicCalculationSet,
};
