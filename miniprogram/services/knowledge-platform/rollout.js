const ROLLOUT_STAGES = Object.freeze([
  "legacy",
  "foundation",
  "terrain",
  "workbench",
  "learning",
  "candidate",
  "verified",
]);

const MODULE_ROLLOUT_STAGES = Object.freeze({
  politics: "foundation",
  "common-sense": "legacy",
  notes: "legacy",
});

function isRolloutStage(value) {
  return ROLLOUT_STAGES.includes(value);
}

function getRolloutStage(moduleId) {
  return MODULE_ROLLOUT_STAGES[moduleId] || "legacy";
}

function hasReachedStage(moduleId, requiredStage) {
  if (!isRolloutStage(requiredStage)) return false;
  return ROLLOUT_STAGES.indexOf(getRolloutStage(moduleId)) >= ROLLOUT_STAGES.indexOf(requiredStage);
}

module.exports = {
  ROLLOUT_STAGES,
  MODULE_ROLLOUT_STAGES,
  isRolloutStage,
  getRolloutStage,
  hasReachedStage,
};
