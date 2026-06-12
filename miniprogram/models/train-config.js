const QUESTION_COUNT_PRESETS = {
  quick: 10,
  normal: 15,
};

function buildTrainingConfig(item) {
  return {
    trainingId: item.id,
    questionCountMode: "quick",
    questionCount: QUESTION_COUNT_PRESETS.quick,
  };
}

function getConfigSections(item, config) {
  const questionCountOptions = [
    {
      value: "quick",
      label: "10题",
      description: "轻量练习",
    },
    {
      value: "normal",
      label: "15题",
      description: "完整练习",
    },
  ];

  const nextConfig = {
    ...config,
    questionCount: QUESTION_COUNT_PRESETS[config.questionCountMode] || QUESTION_COUNT_PRESETS.quick,
  };

  return {
    questionCount: {
      options: questionCountOptions,
    },
    normalizedConfig: nextConfig,
  };
}

module.exports = {
  buildTrainingConfig,
  getConfigSections,
};
