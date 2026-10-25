"use strict";

const RELATION_TYPES = Object.freeze([
  "classification",
  "causal-chain",
  "sequence",
  "contrast",
  "conditional",
  "composition",
]);

const NODE_ROLES = Object.freeze([
  "root",
  "category",
  "criterion",
  "condition",
  "mechanism",
  "result",
  "step",
  "component",
]);

const EDGE_TYPES = Object.freeze([
  "contains",
  "distinguished-by",
  "causes",
  "precedes",
  "contrasts-with",
  "applies-when",
  "part-of",
]);

const PRIMARY_EDGE_TYPES = Object.freeze({
  classification: Object.freeze(["contains", "distinguished-by"]),
  "causal-chain": Object.freeze(["causes"]),
  sequence: Object.freeze(["precedes"]),
  contrast: Object.freeze(["contrasts-with"]),
  conditional: Object.freeze(["applies-when"]),
  composition: Object.freeze(["part-of"]),
});

const FRAME_STATUSES = Object.freeze(["candidate", "review", "approved", "retired"]);

module.exports = {
  schemaVersion: 1,
  conceptFrameSchemaVersion: "q0c0-concept-frame-v1",
  RELATION_TYPES,
  NODE_ROLES,
  EDGE_TYPES,
  PRIMARY_EDGE_TYPES,
  FRAME_STATUSES,
};
