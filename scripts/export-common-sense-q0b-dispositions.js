#!/usr/bin/env node
"use strict";

const pack = require("../miniprogram/subpackages/common-sense/models/learning-pack");
const q0b = require("../docs/knowledge-platform/content/common-sense-content-q0-b");
const audit = require("../docs/knowledge-platform/implementations/common-sense-mnemonic-quality-audit-2026-10-22.json");

const mnemonicById = Object.fromEntries(pack.mnemonics.map((item) => [item.id, item]));
const auditById = Object.fromEntries(audit.items.map((item) => [item.mnemonicId, item]));
const items = q0b.mnemonicDispositions.map((disposition) => {
  const mnemonic = mnemonicById[disposition.mnemonicId];
  const finding = auditById[disposition.mnemonicId];
  return {
    mnemonicId: disposition.mnemonicId,
    title: mnemonic.title,
    scope: mnemonic.scope,
    currentRevision: mnemonic.revision,
    auditGrade: finding.grade,
    auditScore: finding.totalScore,
    riskFlags: finding.riskFlags,
    decision: disposition.decision,
    productLabel: disposition.productLabel,
    status: disposition.status,
    reason: disposition.reason,
    followUp: "Q1/Q2 逐条决定重写为可逆记忆锚点、继续保留速记提纲或撤回；Q3 试用前不得标记 approved。",
  };
});

console.log(JSON.stringify({
  schemaVersion: 1,
  batch: "Q0-B",
  evaluatedAt: "2026-10-22",
  status: "review",
  decisionSummary: {
    priorityFormRisks: q0b.PRIORITY_FORM_RISK_IDS.length,
    legacyStructureGaps: q0b.LEGACY_STRUCTURE_IDS.length,
    total: items.length,
    downgradeToStudyOutline: items.filter((item) => item.decision === "downgrade-to-study-outline").length,
  },
  policy: "缺少自然联想、可逆编码或用户证据时，不继续以有效口诀表述；当前统一降级为速记提纲，保留后续重写或撤回空间。",
  items,
}, null, 2));
