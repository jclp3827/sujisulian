const crypto = require("crypto");
const {
  CLASSIFICATIONS,
  ANCHOR_TYPES,
  MAPPING_TYPES,
  TRIAL_METRICS,
  EVIDENCE_LEVELS,
  APPROVAL_POLICY,
} = require("./common-sense-mnemonic-quality-schema");

const canonical = (value) => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
};
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const normalizedAnchor = (value) => String(value || "").replace(/[\s\p{P}]/gu, "");
const validDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
};
const positiveInteger = (value) => Number.isInteger(value) && value > 0;

function redBaselineHashes(pack, authoring) {
  const sourcePack = pack && typeof pack === "object" && !Array.isArray(pack) ? pack : {};
  const sourceAuthoring = authoring && typeof authoring === "object" && !Array.isArray(authoring) ? authoring : {};
  const { redBaseline: _excludedBaseline, ...qualityAuthoring } = sourceAuthoring;
  return {
    mnemonicTargetContentSha256: sha256(JSON.stringify(canonical({
      mnemonics: sourcePack.mnemonics,
      targets: sourcePack.targets,
    }))),
    qualityAuthoringSha256: sha256(JSON.stringify(canonical(qualityAuthoring))),
  };
}

function mnemonicTargets(mnemonic) {
  return [...new Set((mnemonic.phrases || []).flatMap((phrase) => phrase.targetIds || []))];
}

function qualityFingerprint(mnemonic, specification) {
  const { status: _workflowStatus, ...mnemonicContent } = mnemonic;
  const content = {
    mnemonic: mnemonicContent,
    quality: {
      mnemonicRevision: specification.mnemonicRevision,
      classification: specification.classification,
      anchorType: specification.anchorType,
      anchorText: specification.anchorText,
      decodeMap: specification.decodeMap,
      orderRequired: specification.orderRequired,
      hasAmbiguity: specification.hasAmbiguity,
      chunkLimitReason: specification.chunkLimitReason,
      dispositionReason: specification.dispositionReason,
    },
  };
  return sha256(JSON.stringify(canonical(content)));
}

function validateMnemonicQuality(pack, authoring, options = {}) {
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
  const specifications = Array.isArray(authoring.mnemonicQualitySpecifications) ? authoring.mnemonicQualitySpecifications : [];
  const trials = Array.isArray(authoring.memoryTrials) ? authoring.memoryTrials : [];
  const protocols = Array.isArray(authoring.memoryTrialProtocols) ? authoring.memoryTrialProtocols : [];
  const dispositions = Array.isArray(authoring.mnemonicDispositionArchive) ? authoring.mnemonicDispositionArchive : [];
  const mnemonicById = new Map(mnemonics.map((item) => [item.id, item]));
  const targetIds = new Set(targets.map((target) => target.id));
  const specByMnemonic = new Map();
  const validSpecificationIds = new Set();
  const today = options.currentDate || new Date().toISOString().slice(0, 10);

  if (!packIsObject) add("quality-pack-invalid", "pack", "内容包必须是对象。");
  if (!authoringIsObject) add("quality-authoring-invalid", "authoring", "口诀质量 authoring 必须是对象。");
  if (!Array.isArray(pack.mnemonics)) add("pack-mnemonics-invalid", "pack:mnemonics", "pack.mnemonics 必须是数组。");
  else if (!pack.mnemonics.length) add("pack-mnemonics-empty", "pack:mnemonics", "pack.mnemonics 不能为空。");
  if (!Array.isArray(pack.targets)) add("pack-targets-invalid", "pack:targets", "pack.targets 必须是数组。");
  else if (!pack.targets.length) add("pack-targets-empty", "pack:targets", "pack.targets 不能为空。");
  if (rawMnemonics.length !== mnemonics.length) add("pack-mnemonic-item-invalid", "pack:mnemonics", "pack.mnemonics 含有非对象条目。");
  if (rawTargets.length !== targets.length || targets.some((target) => !String(target.id || "").trim())) add("pack-target-item-invalid", "pack:targets", "pack.targets 含有无效条目或空 ID。");
  const mnemonicIds = new Set();
  for (const mnemonic of mnemonics) {
    if (!String(mnemonic.id || "").trim() || mnemonicIds.has(mnemonic.id)) add("pack-mnemonic-id-invalid", mnemonic.id || "missing-id", "口诀 ID 缺失或重复。");
    else mnemonicIds.add(mnemonic.id);
    if (!positiveInteger(mnemonic.revision)) add("mnemonic-revision-invalid", mnemonic.id || "missing-id", "mnemonic.revision 必须是正整数。");
  }

  if (authoring.schemaVersion !== 1 || authoring.qualitySchemaVersion !== "q0a-mnemonic-quality-v1") {
    add("quality-schema-version-invalid", "authoring", "口诀质量 authoring schema 版本无效。");
  }
  for (const [key, value] of [["mnemonicQualitySpecifications", authoring.mnemonicQualitySpecifications], ["memoryTrials", authoring.memoryTrials], ["memoryTrialProtocols", authoring.memoryTrialProtocols], ["mnemonicDispositionArchive", authoring.mnemonicDispositionArchive]]) {
    if (!Array.isArray(value)) add("quality-authoring-array-invalid", `authoring:${key}`, `${key} 必须是数组。`);
  }

  for (const specification of specifications) {
    if (!specification || typeof specification !== "object" || Array.isArray(specification)) {
      add("quality-specification-invalid", "missing-mnemonic-id", "质量规格必须是对象。");
      continue;
    }
    const owner = specification.mnemonicId || "missing-mnemonic-id";
    const mnemonic = mnemonicById.get(specification.mnemonicId);
    if (!mnemonic) {
      add("quality-specification-orphan", owner, "质量规格没有对应口诀。");
      continue;
    }
    if (specByMnemonic.has(mnemonic.id)) {
      add("quality-specification-duplicate", owner, "同一口诀存在重复质量规格。");
      continue;
    }
    specByMnemonic.set(mnemonic.id, specification);
    let valid = true;
    const fail = (code, message) => { valid = false; add(code, owner, message); };
    if (!positiveInteger(specification.mnemonicRevision)) fail("quality-specification-revision-invalid", "spec.mnemonicRevision 必须是正整数。");
    if (specification.mnemonicRevision !== mnemonic.revision) fail("quality-specification-revision-mismatch", "质量规格未绑定当前口诀 revision。");
    if (!CLASSIFICATIONS.includes(specification.classification)) fail("classification-invalid", "classification 无效。");
    if (!ANCHOR_TYPES.includes(specification.anchorType)) fail("anchor-type-invalid", "anchorType 无效。");
    if (typeof specification.orderRequired !== "boolean") fail("order-required-invalid", "orderRequired 必须是布尔值。");
    if (typeof specification.hasAmbiguity !== "boolean") fail("ambiguity-flag-invalid", "hasAmbiguity 必须显式登记。");

    const noMnemonic = specification.classification === "not-suitable";
    if (noMnemonic) {
      if (specification.anchorType !== "none" || specification.anchorText !== "" || !Array.isArray(specification.decodeMap) || specification.decodeMap.length) {
        fail("not-suitable-has-anchor", "不适合口诀时不得伪造锚点或解码关系。");
      }
      if (!String(specification.dispositionReason || "").trim()) fail("not-suitable-reason-missing", "不适合口诀必须说明处置理由。");
      fail("active-mnemonic-classified-not-suitable", "仍在口诀库中的资源不能以“不适合口诀”通过严格门；应在处置批次撤回或改型。");
    } else {
      const anchorText = String(specification.anchorText || "");
      const decodeMap = specification.decodeMap;
      const decodeRows = Array.isArray(decodeMap) ? decodeMap : [];
      if (!anchorText.trim() || specification.anchorType === "none") fail("anchor-missing", "口诀或速记提纲必须有明确 anchorText/anchorType。");
      if (!Array.isArray(decodeMap) || !decodeMap.length) fail("decode-map-missing", "decodeMap 不能为空。");
      const declaredTargets = new Set(mnemonicTargets(mnemonic));
      if (!declaredTargets.size) fail("mnemonic-targets-missing", "口诀本体尚未声明可反解的 targetIds。");
      const mappedTargets = new Set();
      const used = new Array(anchorText.length).fill(false);
      let lastEnd = -1;
      let anyAmbiguity = false;
      for (const [index, row] of decodeRows.entries()) {
        const rowOwner = `${owner}:decode:${index}`;
        if (!row || typeof row !== "object" || Array.isArray(row)) {
          fail("decode-row-invalid", `${rowOwner} 必须是对象。`);
          continue;
        }
        const span = row.anchorSpan;
        if (!Array.isArray(span) || span.length !== 2 || !span.every(Number.isInteger) || span[0] < 0 || span[1] <= span[0] || span[1] > anchorText.length) {
          fail("anchor-span-invalid", `${rowOwner} 的 anchorSpan 无效。`);
          continue;
        }
        if (span[0] < lastEnd) fail("anchor-span-overlap", `${rowOwner} 与前一锚点块重叠或乱序。`);
        lastEnd = span[1];
        if (!String(row.chunk || "").trim() || anchorText.slice(span[0], span[1]) !== row.chunk) fail("anchor-chunk-mismatch", `${rowOwner} 的 chunk 与 anchorText 切片不一致。`);
        for (let cursor = span[0]; cursor < span[1]; cursor += 1) used[cursor] = true;
        if (!row.targetId || !declaredTargets.has(row.targetId) || (targetIds.size && !targetIds.has(row.targetId))) {
          fail("decode-target-invalid", `${rowOwner} 没有映射口诀已声明的有效 targetId。`);
        } else mappedTargets.add(row.targetId);
        if (!String(row.concept || "").trim()) fail("decode-concept-missing", `${rowOwner} 缺少可审查的 concept。`);
        if (!MAPPING_TYPES.includes(row.mappingType)) fail("mapping-type-invalid", `${rowOwner} 的 mappingType 无效。`);
        if (typeof row.ambiguous !== "boolean") fail("decode-ambiguity-flag-invalid", `${rowOwner} 必须显式标记 ambiguous。`);
        if (row.ambiguous) {
          anyAmbiguity = true;
          if (!String(row.ambiguityNote || "").trim()) fail("ambiguity-note-missing", `${rowOwner} 的多义映射缺少 ambiguityNote。`);
        } else if (row.ambiguityNote) fail("ambiguity-note-without-flag", `${rowOwner} 未标记多义却登记了 ambiguityNote。`);
      }
      if (anchorText && used.some((covered, index) => !covered && /[^\s\p{P}]/u.test(anchorText[index]))) {
        fail("anchor-character-unmapped", "anchorText 中存在未由 decodeMap 解释的文字或数字。");
      }
      if ([...(declaredTargets || [])].some((id) => !mappedTargets.has(id))) fail("decode-target-coverage-incomplete", "decodeMap 不能反解口诀声明的全部目标。");
      if (specification.hasAmbiguity !== anyAmbiguity) fail("ambiguity-summary-mismatch", "hasAmbiguity 与逐块多义标记不一致。");
      if (decodeRows.length > 4 && !String(specification.chunkLimitReason || "").trim()) fail("anchor-chunk-limit-unjustified", "锚点超过四块时必须登记人工理由。");
      if (specification.classification === "natural-mnemonic") {
        if (!["natural-phrase", "homophone", "imagery", "story"].includes(specification.anchorType)) fail("natural-anchor-type-invalid", "自然口诀必须使用自然短语、谐音、意象或故事锚点。");
        if (normalizedAnchor(anchorText).length > 16) fail("natural-anchor-too-long", "自然口诀锚点原则上不得超过 16 个有效字符。");
      }
      if (specification.classification === "structural-mnemonic" && !["rhythm", "structural", "contrast"].includes(specification.anchorType)) {
        fail("structural-anchor-type-invalid", "结构口诀必须明确节奏、结构或对照锚点。");
      }
      if (specification.classification === "study-outline" && specification.anchorType !== "semantic-outline") {
        fail("outline-anchor-type-invalid", "速记提纲必须明确标记 semantic-outline，不能冒充自然口诀。");
      }
    }
    if (valid) validSpecificationIds.add(mnemonic.id);
  }

  for (const mnemonic of mnemonics) {
    if (!specByMnemonic.has(mnemonic.id)) add("missing-quality-specification", mnemonic.id, "口诀缺少 Q0-A 质量规格。");
  }

  const dispositionIds = new Set();
  for (const disposition of dispositions) {
    if (!disposition || typeof disposition !== "object" || Array.isArray(disposition)) {
      add("mnemonic-disposition-invalid", "missing-mnemonic-id", "口诀撤回档案必须是对象。");
      continue;
    }
    const owner = disposition.mnemonicId || "missing-mnemonic-id";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(disposition.mnemonicId || "") || dispositionIds.has(disposition.mnemonicId)) {
      add("mnemonic-disposition-id-invalid", owner, "撤回档案 mnemonicId 缺失、格式无效或重复。");
    } else dispositionIds.add(disposition.mnemonicId);
    if (!positiveInteger(disposition.mnemonicRevision)) add("mnemonic-disposition-revision-invalid", owner, "撤回档案 mnemonicRevision 必须是正整数。");
    if (disposition.disposition !== "retired" || !String(disposition.reason || "").trim()) {
      add("mnemonic-disposition-reason-invalid", owner, "撤回档案必须登记 retired 和可审查理由。");
    }
    if (!validDate(disposition.retiredAt) || disposition.retiredAt > today) add("mnemonic-disposition-date-invalid", owner, "撤回日期必须真实且不得晚于校验日期。");
    if (mnemonicById.has(disposition.mnemonicId)) add("retired-disposition-still-active", owner, "已撤回 ID 仍存在于 active mnemonic 库，必须继续阻断。");
  }

  const protocolByVersion = new Map();
  for (const protocol of protocols) {
    if (!protocol || typeof protocol !== "object" || Array.isArray(protocol)) {
      add("memory-trial-protocol-invalid", "missing-version", "记忆试用协议必须是对象。");
      continue;
    }
    const owner = protocol.version || "missing-version";
    const issueCount = issues.length;
    if (!protocol.version || protocolByVersion.has(protocol.version) || !["review", "approved", "retired"].includes(protocol.status) || !EVIDENCE_LEVELS.includes(protocol.evidenceLevel)) {
      add("memory-trial-protocol-invalid", owner, "记忆试用协议版本、状态或 evidenceLevel 无效/重复。");
    }
    const requiredTimepoints = protocol.requiredTimepoints;
    const protocolTimepoints = Array.isArray(requiredTimepoints) ? requiredTimepoints : [];
    const timepointIds = new Set();
    const expectedDelays = new Set();
    if (!Array.isArray(requiredTimepoints) || !requiredTimepoints.length) {
      add("memory-trial-protocol-timepoints-invalid", owner, "协议必须登记预期时间点、delay 和 tolerance。");
    } else for (const point of protocolTimepoints) {
      if (!point || typeof point !== "object" || Array.isArray(point) || !String(point.id || "").trim() || timepointIds.has(point.id) ||
        !Number.isInteger(point.delayMinutes) || point.delayMinutes < 0 || expectedDelays.has(point.delayMinutes) ||
        !Number.isInteger(point.toleranceMinutes) || point.toleranceMinutes < 0 ||
        (point.delayMinutes === 0 ? point.toleranceMinutes !== 0 : point.toleranceMinutes > Math.max(1, Math.floor(point.delayMinutes * 0.25)))) {
        add("memory-trial-protocol-timepoints-invalid", owner, "协议时间点 ID、预期 delay、tolerance 必须有效且唯一。");
        continue;
      }
      timepointIds.add(point.id); expectedDelays.add(point.delayMinutes);
    }
    const requiredMetrics = protocol.requiredMetrics;
    const protocolMetrics = Array.isArray(requiredMetrics) ? requiredMetrics : [];
    if (!Array.isArray(requiredMetrics) || !requiredMetrics.length || new Set(requiredMetrics).size !== requiredMetrics.length ||
      requiredMetrics.some((metric) => !TRIAL_METRICS.includes(metric)) ||
      !["anchorRecall", "decode", "falseExtensionCount"].every((metric) => requiredMetrics.includes(metric))) {
      add("memory-trial-protocol-metric-invalid", owner, "requiredMetrics 必须取自闭集并至少包含 anchorRecall、decode、falseExtensionCount。");
    }
    if (!positiveInteger(protocol.minimumSampleSize)) add("memory-trial-protocol-sample-invalid", owner, "协议 minimumSampleSize 必须是正整数。");
    if (protocol.evidenceLevel === "approval") {
      if (protocol.status !== "approved" || protocol.minimumSampleSize < APPROVAL_POLICY.minimumSampleSize || !protocolMetrics.includes("orderRecall")) {
        add("memory-trial-approval-protocol-invalid", owner, "批准协议必须为 approved、样本下限不少于 30，并测量闭集中的四项指标。");
      }
      const criteria = protocol.approvalCriteria;
      const criterionIds = new Set();
      let hasShortTerm = false;
      let hasDelayed = false;
      if (!Array.isArray(criteria) || criteria.length < APPROVAL_POLICY.minimumEvaluationTimepoints) {
        add("memory-trial-approval-criteria-invalid", owner, "批准协议至少需要两个明确阈值的评估时间点。");
      } else for (const criterion of criteria) {
        const expected = protocolTimepoints.find((point) => point.id === criterion?.timepointId);
        const delayed = expected && expected.delayMinutes >= APPROVAL_POLICY.delayedRecallMinutes;
        const minimumRate = delayed ? APPROVAL_POLICY.delayedMinimumRate : APPROVAL_POLICY.shortTermMinimumRate;
        if (!criterion || typeof criterion !== "object" || Array.isArray(criterion) || !expected || expected.delayMinutes <= 0 || criterionIds.has(criterion.timepointId) ||
          ![criterion.minimumAnchorRecallRate, criterion.minimumDecodeRate, criterion.minimumOrderRecallRate].every((value) => typeof value === "number" && value >= minimumRate && value <= 1) ||
          typeof criterion.maximumFalseExtensionRate !== "number" || criterion.maximumFalseExtensionRate < 0 || criterion.maximumFalseExtensionRate > APPROVAL_POLICY.maximumFalseExtensionRate) {
          add("memory-trial-approval-criteria-invalid", owner, "批准阈值必须绑定非基线时间点，且不得低于固定回忆/解码/顺序下限或放宽错误扩展上限。");
          continue;
        }
        criterionIds.add(criterion.timepointId);
        if (delayed) hasDelayed = true; else hasShortTerm = true;
      }
      if (!hasShortTerm || !hasDelayed) add("memory-trial-approval-criteria-invalid", owner, "批准协议必须同时包含短时与至少 24 小时延迟评估。");
    } else if (protocol.approvalCriteria) {
      add("memory-trial-exploratory-has-approval-criteria", owner, "探索协议不得声明批准阈值。");
    }
    if (issues.length === issueCount) protocolByVersion.set(protocol.version, protocol);
  }

  const trialIds = new Set();
  const validTrialMnemonicIds = new Set();
  const approvalEligibleTrialMnemonicIds = new Set();
  const staleTrialIds = [];
  for (const trial of trials) {
    if (!trial || typeof trial !== "object" || Array.isArray(trial)) {
      add("memory-trial-invalid", "missing-trial-id", "memoryTrial 必须是对象。");
      continue;
    }
    const owner = trial.id || "missing-trial-id";
    if (!trial.id || trialIds.has(trial.id)) {
      add("memory-trial-id-invalid", owner, "memoryTrial ID 缺失或重复。");
      continue;
    }
    trialIds.add(trial.id);
    const mnemonic = mnemonicById.get(trial.mnemonicId);
    const specification = specByMnemonic.get(trial.mnemonicId);
    const protocol = protocolByVersion.get(trial.protocolVersion);
    let stale = false;
    if (!mnemonic || !specification) add("memory-trial-owner-invalid", owner, "memoryTrial 没有对应口诀或质量规格。");
    if (!protocol) add("memory-trial-protocol-unknown", owner, "memoryTrial 使用了未登记协议。");
    if (!positiveInteger(trial.mnemonicRevision)) add("memory-trial-revision-invalid", owner, "memoryTrial.mnemonicRevision 必须是正整数。");
    if (mnemonic && trial.mnemonicRevision !== mnemonic.revision) stale = true;
    if (mnemonic && specification && trial.contentFingerprint !== qualityFingerprint(mnemonic, specification)) stale = true;
    if (stale) {
      staleTrialIds.push(trial.id);
      add("memory-trial-stale", owner, "口诀内容、revision、锚点或解码关系已变化，旧 memoryTrial 失效。");
    }
    const sample = trial.sample;
    if (!sample || !String(sample.audience || "").trim() || !Number.isInteger(sample.participantCount) || sample.participantCount < 1 || !String(sample.recruitment || "").trim()) {
      add("memory-trial-sample-invalid", owner, "memoryTrial 样本必须登记人群、人数和招募方式。");
    }
    if (protocol && sample && sample.participantCount < protocol.minimumSampleSize) add("memory-trial-sample-too-small", owner, "memoryTrial 样本少于协议明确的 minimumSampleSize。");
    if (!validDate(trial.date) || trial.date > today) add("memory-trial-date-invalid", owner, "memoryTrial date 必须是真实且不晚于校验日期的 YYYY-MM-DD 日期。");
    const timepoints = trial.timepoints;
    const timepointRows = Array.isArray(timepoints) ? timepoints : [];
    const byTimepoint = new Map();
    const actualDelays = new Set();
    if (!Array.isArray(timepoints) || !timepoints.length) add("memory-trial-timepoints-missing", owner, "memoryTrial 缺少时间点结果。");
    for (const point of timepointRows) {
      if (!point || typeof point !== "object" || Array.isArray(point)) {
        add("memory-trial-timepoint-invalid", `${owner}:missing`, "时间点必须是对象。");
        continue;
      }
      if (!point.id || byTimepoint.has(point.id) || !Number.isInteger(point.delayMinutes) || point.delayMinutes < 0 || actualDelays.has(point.delayMinutes) ||
        !Number.isInteger(point.testedParticipants) || point.testedParticipants < 1 || (sample && point.testedParticipants > sample.participantCount)) {
        add("memory-trial-timepoint-invalid", `${owner}:${point.id || "missing"}`, "时间点 ID、延迟、实测人数必须有效；不同时间点不得使用相同 delay。");
        continue;
      }
      byTimepoint.set(point.id, point); actualDelays.add(point.delayMinutes);
      if (protocol && point.testedParticipants < protocol.minimumSampleSize) add("memory-trial-timepoint-sample-too-small", `${owner}:${point.id}`, "时间点实测人数少于协议 minimumSampleSize。");
      const expected = protocol?.requiredTimepoints.find((item) => item.id === point.id);
      if (!expected) add("memory-trial-timepoint-undeclared", `${owner}:${point.id}`, "试用结果包含协议未声明的时间点。");
      else if (Math.abs(point.delayMinutes - expected.delayMinutes) > expected.toleranceMinutes) {
        add("memory-trial-delay-mismatch", `${owner}:${point.id}`, "实测 delay 超出协议预期值和 tolerance。");
      }
      const pairValid = (pair, expectedTotal) => pair && Number.isInteger(pair.correct) && Number.isInteger(pair.total) &&
        pair.correct >= 0 && pair.total === expectedTotal && pair.correct <= pair.total;
      const decodeTotal = point.testedParticipants * ((specification && specification.decodeMap || []).length || 0);
      for (const metric of protocol?.requiredMetrics || []) {
        if (metric === "anchorRecall" && !pairValid(point.anchorRecall, point.testedParticipants)) add("memory-trial-anchor-result-invalid", `${owner}:${point.id}`, "锚点回忆分子/分母无效。");
        if (metric === "decode" && !pairValid(point.decode, decodeTotal)) add("memory-trial-decode-result-invalid", `${owner}:${point.id}`, "逐块解码分子/分母无效。");
        if (metric === "orderRecall" && !pairValid(point.orderRecall, point.testedParticipants)) add("memory-trial-order-result-invalid", `${owner}:${point.id}`, "顺序回忆分子/分母无效。");
        if (metric === "falseExtensionCount" && (!Number.isInteger(point.falseExtensionCount) || point.falseExtensionCount < 0)) add("memory-trial-false-extension-invalid", `${owner}:${point.id}`, "错误扩展次数无效。");
      }
    }
    if (protocol) {
      for (const expected of protocol.requiredTimepoints) if (!byTimepoint.has(expected.id)) add("memory-trial-required-timepoint-missing", owner, `memoryTrial 缺少协议时间点 ${expected.id}。`);
      if (specification?.orderRequired && !protocol.requiredMetrics.includes("orderRecall")) add("memory-trial-order-metric-missing", owner, "顺序型口诀所用协议没有要求 orderRecall。");
      if (protocol.status === "retired") add("memory-trial-protocol-retired", owner, "retired 协议不能接收新的有效证据。");
      if (protocol.evidenceLevel === "approval") {
        for (const criterion of protocol.approvalCriteria) {
          const point = byTimepoint.get(criterion.timepointId);
          if (!point) continue;
          if (!point.anchorRecall || !point.decode || !point.orderRecall || !point.anchorRecall.total || !point.decode.total || !point.orderRecall.total ||
            !Number.isInteger(point.falseExtensionCount)) continue;
          const rates = {
            anchor: point.anchorRecall.correct / point.anchorRecall.total,
            decode: point.decode.correct / point.decode.total,
            order: point.orderRecall.correct / point.orderRecall.total,
            falseExtension: point.falseExtensionCount / point.testedParticipants,
          };
          if (rates.anchor < criterion.minimumAnchorRecallRate || rates.decode < criterion.minimumDecodeRate ||
            rates.order < criterion.minimumOrderRecallRate || rates.falseExtension > criterion.maximumFalseExtensionRate) {
            add("memory-trial-approval-threshold-failed", `${owner}:${criterion.timepointId}`, "正式证据的锚点、解码、顺序或错误扩展实际结果未达到登记阈值。");
          }
        }
      }
    }
    const ownerIssues = issues.filter((issue) => issue.owner === owner || issue.owner.startsWith(`${owner}:`));
    if (!ownerIssues.some((issue) => issue.severity === "error")) {
      validTrialMnemonicIds.add(trial.mnemonicId);
      if (protocol && protocol.status === "approved" && protocol.evidenceLevel === "approval" && sample.participantCount >= APPROVAL_POLICY.minimumSampleSize) {
        approvalEligibleTrialMnemonicIds.add(trial.mnemonicId);
      }
    }
  }

  for (const mnemonic of mnemonics.filter((item) => item.status === "approved")) {
    if (!validSpecificationIds.has(mnemonic.id)) add("approved-mnemonic-quality-invalid", mnemonic.id, "approved 口诀没有有效质量规格。");
    if (!approvalEligibleTrialMnemonicIds.has(mnemonic.id)) add("approved-mnemonic-trial-missing", mnemonic.id, "approved 口诀没有当前 revision、非探索批准协议、足量样本且实际达标的独立记忆试用证据。");
  }

  const errors = issues.filter((issue) => issue.severity === "error");
  const errorsByCode = errors.reduce((counts, issue) => ({ ...counts, [issue.code]: (counts[issue.code] || 0) + 1 }), {});
  const hashes = redBaselineHashes(pack, authoring);
  return {
    passed: errors.length === 0,
    schemaVersion: authoring.qualitySchemaVersion,
    packVersion: pack.version,
    counts: {
      mnemonics: mnemonics.length,
      qualitySpecifications: specifications.length,
      validQualitySpecifications: validSpecificationIds.size,
      memoryTrials: trials.length,
      retiredMnemonicDispositions: dispositions.length,
      validTrialMnemonics: validTrialMnemonicIds.size,
      approvalEligibleTrialMnemonics: approvalEligibleTrialMnemonicIds.size,
      staleMemoryTrials: staleTrialIds.length,
      errors: errors.length,
      warnings: issues.length - errors.length,
    },
    errorsByCode,
    hashes,
    staleTrialIds,
    issues,
  };
}

function validateRedBaseline(report, baseline) {
  const actualMissing = report.issues.filter((issue) => issue.code === "missing-quality-specification").map((issue) => issue.owner).sort();
  const expectedCounts = baseline.expectedErrorCounts || {};
  const actualCodes = Object.keys(report.errorsByCode).sort();
  const expectedCodes = Object.keys(expectedCounts).sort();
  const failures = [];
  if (report.packVersion !== baseline.packVersion) failures.push("packVersion 已变化");
  if (report.counts.mnemonics !== baseline.mnemonicCount) failures.push("口诀数量已变化");
  if (JSON.stringify(actualCodes) !== JSON.stringify(expectedCodes)) failures.push("红基线错误类型已变化");
  for (const code of expectedCodes) if (report.errorsByCode[code] !== expectedCounts[code]) failures.push(`${code} 数量已变化`);
  if (sha256(actualMissing.join("\n")) !== baseline.missingMnemonicIdsSha256) failures.push("缺失质量规格的口诀集合已变化");
  if (report.hashes.mnemonicTargetContentSha256 !== baseline.mnemonicTargetContentSha256) failures.push("口诀或目标内容摘要已变化");
  if (report.hashes.qualityAuthoringSha256 !== baseline.qualityAuthoringSha256) failures.push("质量 authoring 摘要已变化");
  return { matched: failures.length === 0, failures, missingMnemonicIds: actualMissing };
}

module.exports = {
  canonical,
  mnemonicTargets,
  qualityFingerprint,
  redBaselineHashes,
  validateMnemonicQuality,
  validateRedBaseline,
};
