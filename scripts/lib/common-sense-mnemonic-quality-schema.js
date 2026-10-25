const CLASSIFICATIONS = Object.freeze([
  "natural-mnemonic",
  "structural-mnemonic",
  "study-outline",
  "not-suitable",
]);

const ANCHOR_TYPES = Object.freeze([
  "natural-phrase",
  "homophone",
  "imagery",
  "story",
  "rhythm",
  "structural",
  "semantic-outline",
  "none",
]);

const MAPPING_TYPES = Object.freeze([
  "homophone",
  "shape",
  "imagery",
  "story",
  "rhythm",
  "semantic",
  "sequence",
  "contrast",
]);

const CLASSIFICATION_LABELS = Object.freeze({
  "natural-mnemonic": "自然口诀",
  "structural-mnemonic": "结构口诀",
  "study-outline": "速记提纲",
  "not-suitable": "不适合口诀",
});

const TRIAL_METRICS = Object.freeze([
  "anchorRecall",
  "decode",
  "orderRecall",
  "falseExtensionCount",
]);

const EVIDENCE_LEVELS = Object.freeze(["exploratory", "approval"]);

const APPROVAL_POLICY = Object.freeze({
  minimumSampleSize: 30,
  minimumEvaluationTimepoints: 2,
  delayedRecallMinutes: 1440,
  shortTermMinimumRate: 0.8,
  delayedMinimumRate: 0.6,
  maximumFalseExtensionRate: 0.1,
});

module.exports = {
  schemaVersion: 1,
  CLASSIFICATIONS,
  ANCHOR_TYPES,
  MAPPING_TYPES,
  CLASSIFICATION_LABELS,
  TRIAL_METRICS,
  EVIDENCE_LEVELS,
  APPROVAL_POLICY,
};
