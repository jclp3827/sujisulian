"use strict";

const crypto = require("crypto");
const {
  RELATION_TYPES,
  NODE_ROLES,
  EDGE_TYPES,
  PRIMARY_EDGE_TYPES,
  FRAME_STATUSES,
} = require("./common-sense-concept-frame-schema");

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AUTHORING_LANGUAGE = /(帮助|用于|为了)(用户)?(记忆|回忆)|记住(这些|上述|本组)?(知识|内容|要点)?/;
const canonical = (value) => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
};
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const positiveInteger = (value) => Number.isInteger(value) && value > 0;
const text = (value) => String(value || "").trim();
const validId = (value) => ID_PATTERN.test(value || "");

function mnemonicTargetIds(mnemonic) {
  return [...new Set((mnemonic.phrases || []).flatMap((phrase) => phrase.targetIds || []))];
}

function redBaselineHashes(pack, authoring) {
  const sourcePack = pack && typeof pack === "object" && !Array.isArray(pack) ? pack : {};
  const sourceAuthoring = authoring && typeof authoring === "object" && !Array.isArray(authoring) ? authoring : {};
  const { redBaseline: _excluded, ...contractAuthoring } = sourceAuthoring;
  return {
    conceptInputSha256: sha256(JSON.stringify(canonical({
      mnemonics: sourcePack.mnemonics,
      targets: sourcePack.targets,
      groups: sourcePack.groups,
    }))),
    conceptAuthoringSha256: sha256(JSON.stringify(canonical(contractAuthoring))),
  };
}

function validateConceptFrames(pack, authoring) {
  const issues = [];
  const add = (code, owner, message, severity = "error") => issues.push({ code, owner, message, severity });
  const packIsObject = Boolean(pack && typeof pack === "object" && !Array.isArray(pack));
  const authoringIsObject = Boolean(authoring && typeof authoring === "object" && !Array.isArray(authoring));
  pack = packIsObject ? pack : {};
  authoring = authoringIsObject ? authoring : {};

  const rawMnemonics = Array.isArray(pack.mnemonics) ? pack.mnemonics : [];
  const rawTargets = Array.isArray(pack.targets) ? pack.targets : [];
  const mnemonics = rawMnemonics.filter((item) => item && typeof item === "object" && !Array.isArray(item));
  const targets = rawTargets.filter((item) => item && typeof item === "object" && !Array.isArray(item));
  const frames = Array.isArray(authoring.conceptFrames) ? authoring.conceptFrames : [];
  const bindings = Array.isArray(authoring.mnemonicConceptBindings) ? authoring.mnemonicConceptBindings : [];
  const mnemonicById = new Map(mnemonics.map((item) => [item.id, item]));
  const targetIds = new Set(targets.map((item) => item.id));
  const frameById = new Map();
  const validFrameIds = new Set();

  if (!packIsObject) add("concept-pack-invalid", "pack", "内容包必须是对象。");
  if (!authoringIsObject) add("concept-authoring-invalid", "authoring", "概念框架 authoring 必须是对象。");
  if (!Array.isArray(pack.mnemonics)) add("concept-pack-mnemonics-invalid", "pack:mnemonics", "pack.mnemonics 必须是数组。");
  if (!Array.isArray(pack.targets)) add("concept-pack-targets-invalid", "pack:targets", "pack.targets 必须是数组。");
  if (rawMnemonics.length !== mnemonics.length) add("concept-pack-mnemonic-item-invalid", "pack:mnemonics", "pack.mnemonics 含有非对象条目。");
  if (rawTargets.length !== targets.length || targets.some((item) => !validId(item.id))) add("concept-pack-target-item-invalid", "pack:targets", "pack.targets 含有无效条目或 ID。");
  if (authoring.schemaVersion !== 1 || authoring.conceptFrameSchemaVersion !== "q0c0-concept-frame-v1") {
    add("concept-schema-version-invalid", "authoring", "概念框架 schema 版本无效。");
  }
  if (!Array.isArray(authoring.conceptFrames)) add("concept-frames-invalid", "authoring:conceptFrames", "conceptFrames 必须是数组。");
  if (!Array.isArray(authoring.mnemonicConceptBindings)) add("concept-bindings-invalid", "authoring:mnemonicConceptBindings", "mnemonicConceptBindings 必须是数组。");

  for (const frame of frames) {
    if (!frame || typeof frame !== "object" || Array.isArray(frame)) {
      add("concept-frame-invalid", "missing-frame-id", "概念框架必须是对象。");
      continue;
    }
    const owner = frame.id || "missing-frame-id";
    if (!validId(frame.id) || frameById.has(frame.id)) {
      add("concept-frame-id-invalid", owner, "概念框架 ID 缺失、格式无效或重复。");
      continue;
    }
    frameById.set(frame.id, frame);
    let valid = true;
    const fail = (code, message) => { valid = false; add(code, owner, message); };
    if (!positiveInteger(frame.revision)) fail("concept-frame-revision-invalid", "revision 必须是正整数。");
    if (!FRAME_STATUSES.includes(frame.status)) fail("concept-frame-status-invalid", "status 不在闭集内。");
    if (!text(frame.conceptTitle)) fail("concept-title-missing", "conceptTitle 必须明确说明学习概念。");
    if (!Array.isArray(frame.parentPath) || frame.parentPath.length < 2 || frame.parentPath.some((item) => !text(item))) {
      fail("concept-parent-path-invalid", "parentPath 至少需要领域和主题两级非空路径。");
    }
    for (const [field, label] of [["definition", "概念定义"], ["examTask", "考试任务"]]) {
      if (!text(frame[field])) fail(`concept-${field === "definition" ? "definition" : "exam-task"}-missing`, `${label}不能为空。`);
      else if (AUTHORING_LANGUAGE.test(frame[field])) fail("concept-learner-copy-editorial", `${label}不能使用“帮助回忆/记住知识”等作者元语言。`);
    }
    if (!RELATION_TYPES.includes(frame.relationType)) fail("concept-relation-type-invalid", "relationType 不在闭集内。");
    if (!Array.isArray(frame.sourceRefs) || !frame.sourceRefs.length || frame.sourceRefs.some((ref) =>
      !ref || typeof ref !== "object" || Array.isArray(ref) || !text(ref.pointId) || !text(ref.tabId))) {
      fail("concept-source-refs-invalid", "sourceRefs 必须至少包含一个 pointId/tabId 来源定位。");
    }

    const nodes = Array.isArray(frame.nodes) ? frame.nodes : [];
    const edges = Array.isArray(frame.edges) ? frame.edges : [];
    if (!Array.isArray(frame.nodes) || nodes.length < 2) fail("concept-nodes-invalid", "nodes 至少需要根概念和一个关系节点。");
    if (!Array.isArray(frame.edges) || !edges.length) fail("concept-edges-invalid", "edges 不能为空。");
    const nodeIds = new Set();
    const frameTargetIds = new Set();
    let rootCount = 0;
    let rootNodeId = "";
    let rootLabel = "";
    for (const [index, node] of nodes.entries()) {
      const nodeOwner = `${owner}:node:${index}`;
      if (!node || typeof node !== "object" || Array.isArray(node) || !validId(node.id) || nodeIds.has(node.id)) {
        fail("concept-node-id-invalid", `${nodeOwner} 的 ID 缺失、格式无效或重复。`);
        continue;
      }
      nodeIds.add(node.id);
      if (!NODE_ROLES.includes(node.role)) fail("concept-node-role-invalid", `${nodeOwner} 的 role 不在闭集内。`);
      if (node.role === "root") {
        rootCount += 1;
        rootNodeId = node.id;
        rootLabel = text(node.label);
      }
      if (!text(node.label) || !text(node.plainMeaning)) fail("concept-node-copy-missing", `${nodeOwner} 缺少名称或面向学习者的一句话含义。`);
      if (AUTHORING_LANGUAGE.test(node.plainMeaning)) fail("concept-learner-copy-editorial", `${nodeOwner} 使用了作者元语言。`);
      if (node.role !== "root" && !text(node.distinction)) fail("concept-node-distinction-missing", `${nodeOwner} 缺少关键区分点。`);
      if (!Array.isArray(node.targetIds)) fail("concept-node-targets-invalid", `${nodeOwner}.targetIds 必须是数组。`);
      else for (const targetId of node.targetIds) {
        if (!targetIds.has(targetId)) fail("concept-node-target-invalid", `${nodeOwner} 引用了不存在的 targetId：${targetId}。`);
        else frameTargetIds.add(targetId);
      }
    }
    if (rootCount !== 1) fail("concept-root-count-invalid", "每个概念框架必须且只能有一个 root 节点。");
    else if (rootLabel !== text(frame.conceptTitle)) fail("concept-root-title-mismatch", "root 节点名称必须与 conceptTitle 一致。");
    if (!frameTargetIds.size) fail("concept-target-coverage-empty", "概念框架必须映射至少一个现有知识目标。");

    let hasPrimaryRelation = false;
    const edgeKeys = new Set();
    const neighbors = new Map([...nodeIds].map((id) => [id, new Set()]));
    for (const [index, edge] of edges.entries()) {
      const edgeOwner = `${owner}:edge:${index}`;
      if (!edge || typeof edge !== "object" || Array.isArray(edge)) {
        fail("concept-edge-invalid", `${edgeOwner} 必须是对象。`);
        continue;
      }
      const key = `${edge.from}|${edge.to}|${edge.type}`;
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to) || edge.from === edge.to) fail("concept-edge-endpoint-invalid", `${edgeOwner} 的端点不存在或形成自环。`);
      else {
        neighbors.get(edge.from).add(edge.to);
        neighbors.get(edge.to).add(edge.from);
      }
      if (!EDGE_TYPES.includes(edge.type)) fail("concept-edge-type-invalid", `${edgeOwner} 的 type 不在闭集内。`);
      if (edgeKeys.has(key)) fail("concept-edge-duplicate", `${edgeOwner} 重复。`);
      edgeKeys.add(key);
      if ((PRIMARY_EDGE_TYPES[frame.relationType] || []).includes(edge.type)) hasPrimaryRelation = true;
    }
    if (RELATION_TYPES.includes(frame.relationType) && !hasPrimaryRelation) {
      fail("concept-primary-relation-missing", "edges 未体现 relationType 对应的主要关系。");
    }
    if (rootCount === 1 && neighbors.has(rootNodeId)) {
      const reached = new Set([rootNodeId]);
      const queue = [rootNodeId];
      while (queue.length) {
        for (const next of neighbors.get(queue.shift()) || []) {
          if (!reached.has(next)) { reached.add(next); queue.push(next); }
        }
      }
      if (reached.size !== nodeIds.size) fail("concept-graph-disconnected", "所有关系节点必须与根概念连通。");
    }
    if (valid) validFrameIds.add(frame.id);
  }

  const bindingByMnemonic = new Map();
  const validBindingMnemonicIds = new Set();
  for (const binding of bindings) {
    if (!binding || typeof binding !== "object" || Array.isArray(binding)) {
      add("concept-binding-invalid", "missing-mnemonic-id", "口诀概念绑定必须是对象。");
      continue;
    }
    const owner = binding.mnemonicId || "missing-mnemonic-id";
    const mnemonic = mnemonicById.get(binding.mnemonicId);
    const frame = frameById.get(binding.conceptFrameId);
    let valid = true;
    const fail = (code, message) => { valid = false; add(code, owner, message); };
    if (!mnemonic) fail("concept-binding-mnemonic-orphan", "绑定没有对应的现存口诀。");
    if (bindingByMnemonic.has(binding.mnemonicId)) fail("concept-binding-duplicate", "同一口诀只能绑定一个概念框架。");
    else bindingByMnemonic.set(binding.mnemonicId, binding);
    if (!positiveInteger(binding.mnemonicRevision) || (mnemonic && binding.mnemonicRevision !== mnemonic.revision)) {
      fail("concept-binding-mnemonic-revision-mismatch", "绑定没有匹配口诀当前 revision。");
    }
    if (!frame) fail("concept-binding-frame-orphan", "绑定没有对应的概念框架。");
    if (!positiveInteger(binding.conceptFrameRevision) || (frame && binding.conceptFrameRevision !== frame.revision)) {
      fail("concept-binding-frame-revision-mismatch", "绑定没有匹配概念框架当前 revision。");
    }
    if (frame && !validFrameIds.has(frame.id)) fail("concept-binding-frame-invalid", "绑定指向未通过契约的概念框架。");
    if (mnemonic && frame) {
      const frameTargets = new Set((frame.nodes || []).flatMap((node) => node.targetIds || []));
      const missingTargets = mnemonicTargetIds(mnemonic).filter((targetId) => !frameTargets.has(targetId));
      if (missingTargets.length) fail("concept-binding-target-coverage-incomplete", `概念框架未覆盖口诀目标：${missingTargets.join(", ")}。`);
      if (mnemonic.status === "approved" && frame.status !== "approved") fail("approved-mnemonic-concept-frame-unapproved", "approved 口诀必须绑定 approved 概念框架。");
    }
    if (valid) validBindingMnemonicIds.add(binding.mnemonicId);
  }

  for (const mnemonic of mnemonics) {
    if (!bindingByMnemonic.has(mnemonic.id)) add("missing-concept-frame-binding", mnemonic.id, "口诀缺少概念框架绑定。");
  }

  const boundFrameIds = new Set(bindings.map((item) => item && item.conceptFrameId).filter(Boolean));
  for (const frame of frames) {
    if (frame && validId(frame.id) && !boundFrameIds.has(frame.id) && frame.status !== "retired") {
      add("concept-frame-unbound", frame.id, "非 retired 概念框架尚未绑定任何口诀。", "warning");
    }
  }

  const errors = issues.filter((issue) => issue.severity === "error");
  const errorsByCode = errors.reduce((counts, issue) => ({ ...counts, [issue.code]: (counts[issue.code] || 0) + 1 }), {});
  return {
    passed: errors.length === 0,
    schemaVersion: authoring.conceptFrameSchemaVersion,
    packVersion: pack.version,
    counts: {
      mnemonics: mnemonics.length,
      targets: targets.length,
      conceptFrames: frames.length,
      validConceptFrames: validFrameIds.size,
      bindings: bindings.length,
      validBindings: validBindingMnemonicIds.size,
      errors: errors.length,
      warnings: issues.length - errors.length,
    },
    errorsByCode,
    hashes: redBaselineHashes(pack, authoring),
    issues,
  };
}

function validateRedBaseline(report, baseline) {
  const missing = report.issues.filter((issue) => issue.code === "missing-concept-frame-binding").map((issue) => issue.owner).sort();
  const expectedCounts = baseline.expectedErrorCounts || {};
  const actualCodes = Object.keys(report.errorsByCode).sort();
  const expectedCodes = Object.keys(expectedCounts).sort();
  const failures = [];
  if (report.packVersion !== baseline.packVersion) failures.push("packVersion 已变化");
  if (report.counts.mnemonics !== baseline.mnemonicCount) failures.push("口诀数量已变化");
  if (report.counts.conceptFrames !== baseline.conceptFrameCount) failures.push("概念框架数量已变化");
  if (report.counts.bindings !== baseline.bindingCount) failures.push("绑定数量已变化");
  if (JSON.stringify(actualCodes) !== JSON.stringify(expectedCodes)) failures.push("红基线错误类型已变化");
  for (const code of expectedCodes) if (report.errorsByCode[code] !== expectedCounts[code]) failures.push(`${code} 数量已变化`);
  if (sha256(missing.join("\n")) !== baseline.missingMnemonicIdsSha256) failures.push("缺少概念框架的口诀集合已变化");
  if (report.hashes.conceptInputSha256 !== baseline.conceptInputSha256) failures.push("口诀、目标或主题内容摘要已变化");
  if (report.hashes.conceptAuthoringSha256 !== baseline.conceptAuthoringSha256) failures.push("概念框架 authoring 摘要已变化");
  return { matched: failures.length === 0, failures, missingMnemonicIds: missing };
}

module.exports = {
  canonical,
  mnemonicTargetIds,
  redBaselineHashes,
  validateConceptFrames,
  validateRedBaseline,
};
