"use strict";

const crypto = require("crypto");
const {
  LEARNING_STAGES,
  TRIAL_EVIDENCE_LEVELS,
} = require("./common-sense-concept-learning-schema");
const { canonical } = require("./validate-common-sense-concept-frames");

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const text = (value) => String(value || "").trim();
const positiveInteger = (value) => Number.isInteger(value) && value > 0;
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || "") && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const edgeId = (edge) => `${edge.from}>${edge.type}>${edge.to}`;
const normalizeTerm = (value) => text(value).replace(/[\s，、；：。,.!?（）()《》“”‘’\-—]/gu, "");

function learningFingerprint(frame, binding, mnemonic, specification) {
  return sha256(JSON.stringify(canonical({
    frame,
    binding,
    mnemonic: mnemonic && {
      id: mnemonic.id,
      revision: mnemonic.revision,
      title: mnemonic.title,
      text: mnemonic.text,
      phrases: mnemonic.phrases,
    },
    specification,
  })));
}

function validateConceptLearning(pack, framesAuthoring, learningAuthoring, options = {}) {
  const issues = [];
  const add = (code, owner, message, severity = "error") => issues.push({ code, owner, message, severity });
  pack = pack && typeof pack === "object" && !Array.isArray(pack) ? pack : {};
  framesAuthoring = framesAuthoring && typeof framesAuthoring === "object" && !Array.isArray(framesAuthoring) ? framesAuthoring : {};
  learningAuthoring = learningAuthoring && typeof learningAuthoring === "object" && !Array.isArray(learningAuthoring) ? learningAuthoring : {};
  const frames = Array.isArray(framesAuthoring.conceptFrames) ? framesAuthoring.conceptFrames : [];
  const bindings = Array.isArray(framesAuthoring.mnemonicConceptBindings) ? framesAuthoring.mnemonicConceptBindings : [];
  const specs = Array.isArray(learningAuthoring.conceptLearningSpecifications) ? learningAuthoring.conceptLearningSpecifications : [];
  const protocols = Array.isArray(learningAuthoring.noviceRetellingProtocols) ? learningAuthoring.noviceRetellingProtocols : [];
  const trials = Array.isArray(learningAuthoring.conceptComprehensionTrials) ? learningAuthoring.conceptComprehensionTrials : [];
  const mnemonics = Array.isArray(pack.mnemonics) ? pack.mnemonics : [];
  const questions = Array.isArray(pack.questions) ? pack.questions : [];
  const questionSpecifications = Array.isArray(pack.questionSpecifications) ? pack.questionSpecifications : [];
  const frameById = new Map(frames.map((item) => [item.id, item]));
  const bindingByMnemonic = new Map(bindings.map((item) => [item.mnemonicId, item]));
  const mnemonicById = new Map(mnemonics.map((item) => [item.id, item]));
  const questionById = new Map(questions.map((item) => [item.id, item]));
  const questionSpecById = new Map(questionSpecifications.map((item) => [item.questionId, item]));
  const protocolByVersion = new Map();
  const specificationByMnemonic = new Map();
  const validSpecificationMnemonics = new Set();

  if (learningAuthoring.schemaVersion !== 1 || learningAuthoring.conceptLearningSchemaVersion !== "q0c3-concept-learning-v1") {
    add("concept-learning-schema-invalid", "authoring", "概念学习质量门 schema 版本无效。");
  }
  for (const [name, value] of [["conceptLearningSpecifications", learningAuthoring.conceptLearningSpecifications], ["noviceRetellingProtocols", learningAuthoring.noviceRetellingProtocols], ["conceptComprehensionTrials", learningAuthoring.conceptComprehensionTrials]]) {
    if (!Array.isArray(value)) add("concept-learning-array-invalid", name, `${name} 必须是数组。`);
  }

  for (const protocol of protocols) {
    const owner = protocol && protocol.version || "missing-protocol-version";
    if (!protocol || typeof protocol !== "object" || Array.isArray(protocol) || !ID_PATTERN.test(protocol.version || "") || protocolByVersion.has(protocol.version)) {
      add("concept-learning-protocol-invalid", owner, "复述协议必须有唯一、格式有效的 version。");
      continue;
    }
    protocolByVersion.set(protocol.version, protocol);
    if (!TRIAL_EVIDENCE_LEVELS.includes(protocol.evidenceLevel) || !["review", "approved", "retired"].includes(protocol.status)) {
      add("concept-learning-protocol-invalid", owner, "协议 evidenceLevel 或 status 无效。");
    }
    if (!positiveInteger(protocol.minimumSampleSize) || protocol.minimumSampleSize < 5) {
      add("concept-learning-protocol-sample-invalid", owner, "试点协议最少需要 5 名独立新手。");
    }
    if (!text(protocol.audience) || protocol.independentFromAuthoring !== true) {
      add("concept-learning-protocol-independence-invalid", owner, "协议必须登记新手人群并要求与编写独立。");
    }
    if (!protocol.passCriteria || typeof protocol.passCriteria !== "object" ||
      !(protocol.passCriteria.minimumParticipantPassRate >= 0.8 && protocol.passCriteria.minimumParticipantPassRate <= 1) ||
      !positiveInteger(protocol.passCriteria.maximumFalseClaimsPerParticipant)) {
      add("concept-learning-protocol-criteria-invalid", owner, "协议必须设置不低于 80% 的通过率及错误扩展上限。");
    }
  }

  for (const specification of specs) {
    const owner = specification && specification.mnemonicId || "missing-specification-mnemonic";
    let valid = true;
    const fail = (code, message) => { valid = false; add(code, owner, message); };
    if (!specification || typeof specification !== "object" || Array.isArray(specification)) {
      fail("concept-learning-specification-invalid", "概念学习规格必须是对象。");
      continue;
    }
    if (!ID_PATTERN.test(specification.mnemonicId || "") || specificationByMnemonic.has(specification.mnemonicId)) {
      fail("concept-learning-specification-id-invalid", "规格 mnemonicId 缺失、格式无效或重复。");
      continue;
    }
    specificationByMnemonic.set(specification.mnemonicId, specification);
    const mnemonic = mnemonicById.get(specification.mnemonicId);
    const frame = frameById.get(specification.conceptFrameId);
    const binding = bindingByMnemonic.get(specification.mnemonicId);
    const protocol = protocolByVersion.get(specification.protocolVersion);
    if (!mnemonic || !frame || !binding) fail("concept-learning-owner-missing", "规格缺少对应口诀、概念框架或稳定绑定。");
    if (mnemonic && specification.mnemonicRevision !== mnemonic.revision) fail("concept-learning-mnemonic-revision-stale", "规格绑定的口诀 revision 已过期。");
    if (frame && specification.conceptFrameRevision !== frame.revision) fail("concept-learning-frame-revision-stale", "规格绑定的概念框架 revision 已过期。");
    if (binding && (binding.conceptFrameId !== specification.conceptFrameId || binding.mnemonicRevision !== specification.mnemonicRevision || binding.conceptFrameRevision !== specification.conceptFrameRevision)) {
      fail("concept-learning-binding-mismatch", "规格与口诀—概念框架绑定不一致。");
    }
    if (!protocol || protocol.status === "retired") fail("concept-learning-protocol-unknown", "规格使用未登记或已停用的复述协议。");
    if (!frame || !mnemonic) continue;

    const nodeById = new Map((frame.nodes || []).map((item) => [item.id, item]));
    const frameEdgeIds = new Set((frame.edges || []).map(edgeId));
    const phraseById = new Map((mnemonic.phrases || []).map((item) => [item.id, item]));
    const mappedPhraseIds = new Set();
    const mappedEdgeIds = new Set();
    const mappedTargetIds = new Set();

    if (!Array.isArray(specification.introducedTerms) || !specification.introducedTerms.length) {
      fail("concept-learning-terms-missing", "必须登记口诀出现前已解释的关键术语。");
    } else {
      const termKeys = new Set();
      for (const row of specification.introducedTerms) {
        const key = normalizeTerm(row && row.term);
        const node = nodeById.get(row && row.nodeId);
        if (!key || termKeys.has(key) || !node) {
          fail("concept-learning-term-invalid", "关键术语缺失、重复或没有概念节点。");
          continue;
        }
        termKeys.add(key);
        const nodeCopy = normalizeTerm(`${node.label}${node.plainMeaning}${node.distinction}`);
        if (!nodeCopy.includes(key)) fail("concept-learning-term-unexplained", `术语“${row.term}”没有在绑定节点中先解释。`);
      }
    }

    if (!Array.isArray(specification.decodeMap) || specification.decodeMap.length !== phraseById.size) {
      fail("concept-learning-decode-count-invalid", "每个口诀片段必须且只能有一条概念反解映射。");
    } else {
      for (const row of specification.decodeMap) {
        const phrase = phraseById.get(row && row.phraseId);
        if (!phrase || mappedPhraseIds.has(row.phraseId)) {
          fail("concept-learning-decode-phrase-invalid", "反解映射使用未知或重复口诀片段。");
          continue;
        }
        mappedPhraseIds.add(row.phraseId);
        if (!text(row.decodedConclusion)) fail("concept-learning-decode-copy-missing", `${row.phraseId} 缺少可读的完整结论。`);
        if (!Array.isArray(row.nodeIds) || !row.nodeIds.length || row.nodeIds.some((id) => !nodeById.has(id))) {
          fail("concept-learning-decode-node-invalid", `${row.phraseId} 缺少有效概念节点映射。`);
          continue;
        }
        const nodeTargets = new Set(row.nodeIds.flatMap((id) => nodeById.get(id).targetIds || []));
        for (const targetId of phrase.targetIds || []) {
          if (!nodeTargets.has(targetId)) fail("concept-learning-decode-target-gap", `${row.phraseId} 的 ${targetId} 无法从概念节点恢复。`);
          mappedTargetIds.add(targetId);
        }
        if (!Array.isArray(row.edgeIds) || row.edgeIds.some((id) => !frameEdgeIds.has(id))) {
          fail("concept-learning-decode-edge-invalid", `${row.phraseId} 使用未知关系边。`);
        } else row.edgeIds.forEach((id) => mappedEdgeIds.add(id));
      }
    }
    for (const id of frameEdgeIds) if (!mappedEdgeIds.has(id)) fail("concept-learning-relation-unmapped", `关系 ${id} 没有进入口诀反解。`);
    const targetBearingNodes = (frame.nodes || []).filter((node) => (node.targetIds || []).length);
    for (const node of targetBearingNodes) for (const id of node.targetIds) if (!mappedTargetIds.has(id)) fail("concept-learning-target-unmapped", `概念目标 ${id} 没有进入口诀反解。`);

    const tests = Array.isArray(specification.selfTests) ? specification.selfTests : [];
    const stages = new Set();
    const questionIds = new Set();
    if (!tests.length) fail("concept-learning-self-tests-missing", "必须登记概念、关系和运用三层自测。");
    for (const row of tests) {
      const question = questionById.get(row && row.questionId);
      const questionSpec = questionSpecById.get(row && row.questionId);
      if (!question || !questionSpec || questionIds.has(row.questionId) || !LEARNING_STAGES.includes(row.stage)) {
        fail("concept-learning-self-test-invalid", "自测题未知、重复或 stage 无效。");
        continue;
      }
      questionIds.add(row.questionId);
      stages.add(row.stage);
      if (!Array.isArray(row.nodeIds) || !row.nodeIds.length || row.nodeIds.some((id) => !nodeById.has(id))) {
        fail("concept-learning-self-test-node-invalid", `${row.questionId} 缺少有效概念节点映射。`);
        continue;
      }
      const covered = new Set(row.nodeIds.flatMap((id) => nodeById.get(id).targetIds || []));
      for (const id of [...(questionSpec.primaryTargetIds || []), ...(questionSpec.supportingTargetIds || [])]) {
        if (!covered.has(id)) fail("concept-learning-self-test-scope-gap", `${row.questionId} 的目标 ${id} 不在声明节点内。`);
      }
      if (!Array.isArray(row.edgeIds) || row.edgeIds.some((id) => !frameEdgeIds.has(id))) fail("concept-learning-self-test-edge-invalid", `${row.questionId} 使用未知关系边。`);
    }
    for (const stage of LEARNING_STAGES) if (!stages.has(stage)) fail("concept-learning-stage-missing", `缺少 ${stage} 自测。`);
    const phraseQuestionIds = new Set((mnemonic.phrases || []).flatMap((phrase) => phrase.questionIds || []));
    for (const id of phraseQuestionIds) if (!questionIds.has(id)) fail("concept-learning-self-test-coverage-gap", `口诀已有自测 ${id} 未进入三层学习规格。`);

    const retelling = specification.noviceRetelling;
    if (!retelling || typeof retelling !== "object" || !text(retelling.prompt) || /口诀|提示|选项/u.test(retelling.prompt)) {
      fail("concept-learning-retelling-prompt-invalid", "新手复述题必须无口诀、提示或选项线索。");
    } else {
      const root = (frame.nodes || []).find((node) => node.role === "root");
      if (!Array.isArray(retelling.expectedNodeIds) || retelling.expectedNodeIds.length < 3 || retelling.expectedNodeIds.some((id) => !nodeById.has(id)) || !retelling.expectedNodeIds.includes(root && root.id)) {
        fail("concept-learning-retelling-node-invalid", "复述点必须含根概念及至少两个有效关系节点。");
      }
      if (!Array.isArray(retelling.expectedEdgeIds) || !retelling.expectedEdgeIds.length || retelling.expectedEdgeIds.some((id) => !frameEdgeIds.has(id))) {
        fail("concept-learning-retelling-edge-invalid", "复述要求必须包含有效概念关系。");
      }
      if (!positiveInteger(retelling.minimumNodeCount) || retelling.minimumNodeCount > retelling.expectedNodeIds.length ||
        !positiveInteger(retelling.minimumEdgeCount) || retelling.minimumEdgeCount > retelling.expectedEdgeIds.length) {
        fail("concept-learning-retelling-threshold-invalid", "复述节点和关系阈值无效。");
      }
    }
    if (valid) validSpecificationMnemonics.add(specification.mnemonicId);
  }

  const validTrialMnemonics = new Set();
  const seenTrialIds = new Set();
  for (const trial of trials) {
    const owner = trial && trial.id || "missing-trial-id";
    let valid = true;
    const fail = (code, message) => { valid = false; add(code, owner, message); };
    if (!trial || typeof trial !== "object" || Array.isArray(trial) || !ID_PATTERN.test(trial.id || "") || seenTrialIds.has(trial.id)) {
      fail("concept-learning-trial-id-invalid", "复述试用必须有唯一有效 ID。");
      continue;
    }
    seenTrialIds.add(trial.id);
    const specification = specificationByMnemonic.get(trial.mnemonicId);
    const mnemonic = mnemonicById.get(trial.mnemonicId);
    const frame = specification && frameById.get(specification.conceptFrameId);
    const binding = bindingByMnemonic.get(trial.mnemonicId);
    const protocol = protocolByVersion.get(trial.protocolVersion);
    if (!specification || !mnemonic || !frame || !binding || !protocol) {
      fail("concept-learning-trial-owner-invalid", "试用缺少当前规格、内容或协议。");
      continue;
    }
    if (trial.conceptFrameId !== specification.conceptFrameId ||
      trial.conceptFrameRevision !== specification.conceptFrameRevision ||
      trial.mnemonicRevision !== specification.mnemonicRevision) {
      fail("concept-learning-trial-owner-invalid", "试用绑定的概念框架或口诀 revision 与当前规格不一致。");
    }
    if (trial.contentFingerprint !== learningFingerprint(frame, binding, mnemonic, specification)) fail("concept-learning-trial-stale", "概念、口诀或学习规格已变化，旧试用失效。");
    if (!validDate(trial.date) || trial.date > (options.currentDate || new Date().toISOString().slice(0, 10))) fail("concept-learning-trial-date-invalid", "试用日期无效或晚于当前日期。");
    if (trial.independentFromAuthoring !== true || !trial.sample || trial.sample.recruitedByAuthoringTeam !== false || !text(trial.sample.audience)) {
      fail("concept-learning-trial-independence-invalid", "试用必须由未参与编写的新手独立完成。");
    }
    const observations = Array.isArray(trial.observations) ? trial.observations : [];
    if (observations.length < protocol.minimumSampleSize || trial.sample.participantCount !== observations.length) fail("concept-learning-trial-sample-invalid", "试用人数少于协议要求或与观察数不一致。");
    const participantIds = new Set();
    let passed = 0;
    for (const row of observations) {
      if (!row || !text(row.participantId) || participantIds.has(row.participantId)) {
        fail("concept-learning-trial-participant-invalid", "参与者 ID 缺失或重复。");
        continue;
      }
      participantIds.add(row.participantId);
      const nodes = new Set(Array.isArray(row.retoldNodeIds) ? row.retoldNodeIds : []);
      const edges = new Set(Array.isArray(row.retoldEdgeIds) ? row.retoldEdgeIds : []);
      const decoded = new Set(Array.isArray(row.decodedPhraseIds) ? row.decodedPhraseIds : []);
      const falseClaims = Array.isArray(row.falseClaims) ? row.falseClaims : null;
      if ([...nodes].some((id) => !specification.noviceRetelling.expectedNodeIds.includes(id)) || [...edges].some((id) => !specification.noviceRetelling.expectedEdgeIds.includes(id)) || [...decoded].some((id) => !(mnemonic.phrases || []).some((phrase) => phrase.id === id)) || !falseClaims) {
        fail("concept-learning-trial-observation-invalid", `${row.participantId} 的观察记录含未知项或缺失字段。`);
        continue;
      }
      const participantPassed = nodes.size >= specification.noviceRetelling.minimumNodeCount &&
        edges.size >= specification.noviceRetelling.minimumEdgeCount &&
        decoded.size === (mnemonic.phrases || []).length &&
        falseClaims.length <= protocol.passCriteria.maximumFalseClaimsPerParticipant;
      if (participantPassed) passed += 1;
    }
    if (observations.length && passed / observations.length < protocol.passCriteria.minimumParticipantPassRate) fail("concept-learning-trial-threshold-failed", "独立新手通过率未达到协议阈值。");
    if (valid) validTrialMnemonics.add(trial.mnemonicId);
  }

  for (const mnemonicId of validSpecificationMnemonics) {
    if (!validTrialMnemonics.has(mnemonicId)) add("missing-independent-novice-retelling", mnemonicId, "缺少当前内容指纹、足量且达标的独立新手复述证据。", "hold");
  }
  const errors = issues.filter((item) => item.severity === "error");
  const holds = issues.filter((item) => item.severity === "hold");
  return {
    passed: errors.length === 0 && holds.length === 0,
    structurallyPassed: errors.length === 0,
    readyForExpansion: errors.length === 0 && holds.length === 0 && validSpecificationMnemonics.size === specs.length,
    counts: {
      specifications: specs.length,
      structurallyValidSpecifications: validSpecificationMnemonics.size,
      protocols: protocols.length,
      trials: trials.length,
      validTrials: validTrialMnemonics.size,
      errors: errors.length,
      holds: holds.length,
    },
    errorsByCode: errors.reduce((map, item) => ({ ...map, [item.code]: (map[item.code] || 0) + 1 }), {}),
    holdsByCode: holds.reduce((map, item) => ({ ...map, [item.code]: (map[item.code] || 0) + 1 }), {}),
    issues,
  };
}

function holdBaselineHashes(pack, framesAuthoring, learningAuthoring, report) {
  const { holdBaseline: _excluded, conceptComprehensionTrials: _trials, ...learningContract } = learningAuthoring;
  const ownerIds = report.issues.filter((item) => item.code === "missing-independent-novice-retelling").map((item) => item.owner).sort();
  return {
    contentSha256: sha256(JSON.stringify(canonical({
      version: pack.version,
      mnemonics: (pack.mnemonics || []).filter((item) => learningAuthoring.conceptLearningSpecifications.some((spec) => spec.mnemonicId === item.id)),
      questions: (pack.questions || []).filter((item) => learningAuthoring.conceptLearningSpecifications.some((spec) => spec.selfTests.some((test) => test.questionId === item.id))),
      frames: framesAuthoring.conceptFrames,
      bindings: framesAuthoring.mnemonicConceptBindings,
    }))),
    authoringSha256: sha256(JSON.stringify(canonical(learningContract))),
    holdOwnerIdsSha256: sha256(ownerIds.join("\n")),
  };
}

function validateHoldBaseline(report, hashes, baseline) {
  const failures = [];
  if (report.counts.specifications !== baseline.specificationCount) failures.push("规格数量已变化");
  if (report.counts.structurallyValidSpecifications !== baseline.structurallyValidSpecificationCount) failures.push("结构有效规格数量已变化");
  if (report.counts.trials !== baseline.trialCount) failures.push("试用数量已变化");
  if (report.counts.errors !== 0) failures.push("出现结构错误");
  if (JSON.stringify(report.holdsByCode) !== JSON.stringify(baseline.expectedHoldCounts)) failures.push("停止门类型或数量已变化");
  for (const key of ["contentSha256", "authoringSha256", "holdOwnerIdsSha256"]) if (hashes[key] !== baseline[key]) failures.push(`${key} 已变化`);
  return { matched: failures.length === 0, failures };
}

module.exports = {
  edgeId,
  learningFingerprint,
  validateConceptLearning,
  holdBaselineHashes,
  validateHoldBaseline,
};
