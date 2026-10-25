#!/usr/bin/env node
"use strict";

const assert = require("assert/strict");
const { spawnSync } = require("child_process");
const path = require("path");
const {
  validateConceptFrames,
  validateRedBaseline,
} = require("./lib/validate-common-sense-concept-frames");
const {
  PRIMARY_EDGE_TYPES,
} = require("./lib/common-sense-concept-frame-schema");
const fixture = require("./fixtures/common-sense-concept-frame-q0c0-fixtures");

const reports = [];
const test = (name, callback) => { callback(); reports.push(name); };
const codes = (report) => new Set(report.issues.map((issue) => issue.code));

test("a concept-first classification frame with complete binding passes", () => {
  const report = validateConceptFrames(fixture.pack, fixture.authoring());
  assert.equal(report.passed, true);
  assert.equal(report.counts.validConceptFrames, 1);
  assert.equal(report.counts.validBindings, 1);
});

test("all six relationship families require their matching primary relation", () => {
  for (const [relationType, edgeTypes] of Object.entries(PRIMARY_EDGE_TYPES)) {
    const frame = fixture.clone(fixture.frame);
    frame.relationType = relationType;
    frame.edges[0].type = edgeTypes[0];
    const report = validateConceptFrames(fixture.pack, fixture.authoring([frame]));
    assert.equal(report.passed, true, relationType);
    const bad = fixture.clone(frame);
    bad.edges = bad.edges.map((edge) => ({ ...edge, type: edge.type === edgeTypes[0] ? "contains" : edge.type }));
    if (!edgeTypes.includes("contains")) {
      assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([bad]))).has("concept-primary-relation-missing"), true, relationType);
    }
  }
});

test("pack and authoring shapes fail closed", () => {
  assert.equal(codes(validateConceptFrames(null, null)).has("concept-pack-invalid"), true);
  assert.equal(codes(validateConceptFrames({}, {})).has("concept-pack-mnemonics-invalid"), true);
  assert.equal(codes(validateConceptFrames({}, {})).has("concept-schema-version-invalid"), true);
  const malformed = fixture.authoring(); malformed.conceptFrames = {};
  assert.equal(codes(validateConceptFrames(fixture.pack, malformed)).has("concept-frames-invalid"), true);
});

test("learner copy must establish the concept instead of exposing author metadata", () => {
  for (const field of ["definition", "examTask"]) {
    const frame = fixture.clone(fixture.frame);
    frame[field] = "帮助用户回忆上述知识点。";
    assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([frame]))).has("concept-learner-copy-editorial"), true, field);
  }
  const frame = fixture.clone(fixture.frame);
  frame.nodes[1].plainMeaning = "用于记忆本组内容。";
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([frame]))).has("concept-learner-copy-editorial"), true);
});

test("one root, learner meaning, distinction and existing targets are mandatory", () => {
  const noRoot = fixture.clone(fixture.frame); noRoot.nodes[0].role = "category";
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([noRoot]))).has("concept-root-count-invalid"), true);
  const wrongRootTitle = fixture.clone(fixture.frame); wrongRootTitle.nodes[0].label = "不相干概念";
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([wrongRootTitle]))).has("concept-root-title-mismatch"), true);
  const noMeaning = fixture.clone(fixture.frame); noMeaning.nodes[1].plainMeaning = "";
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([noMeaning]))).has("concept-node-copy-missing"), true);
  const noDistinction = fixture.clone(fixture.frame); noDistinction.nodes[1].distinction = "";
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([noDistinction]))).has("concept-node-distinction-missing"), true);
  const unknownTarget = fixture.clone(fixture.frame); unknownTarget.nodes[1].targetIds = ["unknown-target"];
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([unknownTarget]))).has("concept-node-target-invalid"), true);
});

test("edges must use existing nodes and express the declared relationship", () => {
  const missingEndpoint = fixture.clone(fixture.frame); missingEndpoint.edges[0].to = "missing-node";
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([missingEndpoint]))).has("concept-edge-endpoint-invalid"), true);
  const wrongRelation = fixture.clone(fixture.frame); wrongRelation.edges = wrongRelation.edges.map((edge) => ({ ...edge, type: "precedes" }));
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([wrongRelation]))).has("concept-primary-relation-missing"), true);
  const disconnected = fixture.clone(fixture.frame); disconnected.edges = disconnected.edges.filter((edge) => edge.to !== "closure");
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([disconnected]))).has("concept-graph-disconnected"), true);
});

test("bindings are unique, revision-bound and cover every mnemonic target", () => {
  const duplicate = fixture.authoring(); duplicate.mnemonicConceptBindings.push(fixture.clone(fixture.binding));
  assert.equal(codes(validateConceptFrames(fixture.pack, duplicate)).has("concept-binding-duplicate"), true);
  const stale = fixture.clone(fixture.binding); stale.mnemonicRevision = 1;
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([fixture.frame], [stale]))).has("concept-binding-mnemonic-revision-mismatch"), true);
  const incomplete = fixture.clone(fixture.frame); incomplete.nodes = incomplete.nodes.filter((node) => node.id !== "closure"); incomplete.edges = incomplete.edges.filter((edge) => edge.to !== "closure");
  assert.equal(codes(validateConceptFrames(fixture.pack, fixture.authoring([incomplete]))).has("concept-binding-target-coverage-incomplete"), true);
});

test("every active mnemonic requires a concept-frame binding", () => {
  const report = validateConceptFrames(fixture.pack, fixture.authoring([], []));
  assert.equal(report.passed, false);
  assert.deepEqual(report.errorsByCode, { "missing-concept-frame-binding": 1 });
});

test("approved mnemonics cannot depend on an unapproved concept frame", () => {
  const pack = fixture.clone(fixture.pack); pack.mnemonics[0].status = "approved";
  assert.equal(codes(validateConceptFrames(pack, fixture.authoring())).has("approved-mnemonic-concept-frame-unapproved"), true);
  const frame = fixture.clone(fixture.frame); frame.status = "approved";
  assert.equal(validateConceptFrames(pack, fixture.authoring([frame])).passed, true);
});

test("the registered Q0-C0 baseline matches current inventory while strict mode stays red", () => {
  const realPack = require("../docs/knowledge-platform/content/common-sense-learning-v1");
  const realAuthoring = require("../docs/knowledge-platform/content/common-sense-concept-frames-q0c0");
  const report = validateConceptFrames(realPack, realAuthoring);
  const baseline = validateRedBaseline(report, realAuthoring.redBaseline);
  assert.equal(report.passed, false);
  assert.equal(baseline.matched, true);
  assert.equal(report.errorsByCode["missing-concept-frame-binding"], realPack.mnemonics.length);
  const cli = path.join(__dirname, "validate-common-sense-concept-frame-q0c0.js");
  assert.equal(spawnSync(process.execPath, [cli, "--expect-red"], { encoding: "utf8" }).status, 0);
  assert.notEqual(spawnSync(process.execPath, [cli], { encoding: "utf8" }).status, 0);
});

console.log(JSON.stringify({ passed: true, checks: reports.length, reports }, null, 2));
