"use strict";

const LEARNING_STAGES = Object.freeze([
  "concept-identity",
  "relation-understanding",
  "application",
]);

const TRIAL_EVIDENCE_LEVELS = Object.freeze(["pilot", "approval"]);

module.exports = {
  schemaVersion: 1,
  conceptLearningSchemaVersion: "q0c3-concept-learning-v1",
  LEARNING_STAGES,
  TRIAL_EVIDENCE_LEVELS,
};
