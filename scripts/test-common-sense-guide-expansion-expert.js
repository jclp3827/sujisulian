#!/usr/bin/env node
const assert = require("assert/strict");
const path = require("path");

const body = require("../miniprogram/subpackages/common-sense/models/note-common-sense");
const {
  createGoldenGuideContent,
} = require("../miniprogram/subpackages/common-sense/services/guide-content");

const sourceArg = process.argv[2];
if (!sourceArg) throw new Error("用法：node scripts/test-common-sense-guide-expansion-expert.js <候选批次文件>");
const batch = require(path.resolve(process.cwd(), sourceArg));
const content = createGoldenGuideContent(body, batch);
const pointById = Object.fromEntries(body.points.map((point) => [point.id, point]));
const authoringCards = batch.groups.flatMap((group) => group.cards.map((card) => ({ ...card, pointId: group.pointId })));
const authoringById = Object.fromEntries(authoringCards.map((card) => [`${card.pointId}::${card.id}`, card]));
const promotedIds = new Set((batch.promotion && batch.promotion.frozenCardIds || [])
  .map((id) => `${batch.promotion.pointId}::${id}`));

const vagueTitle = /^(?:概述|总述|其他|相关内容|知识点|补充)$/u;
const metaLanguage = /(?:先记|抓住|挂回|配对|按.+记忆|背诵|口诀|收束|公考|常见考(?:查|点)|应作为.+掌握)/u;
const unsupportedAbsolute = /(?:世界最早|历史最大|唯一|一律|必然|完全等同|全部属于|我国境内已知最早)/u;
const learningGoalVerb = /^(?:准确说出|说出|说清|理解|运用|区分|说明|识别|概括|判断|比较)/u;
const numericClaim = /\d+(?:[—~-]\d+)?/g;

content.cards.forEach((card) => {
  const authored = authoringById[card.id];
  assert.ok(authored, `缺少作者源：${card.id}`);
  assert.equal(vagueTitle.test(card.title), false, `标题不能独立表达对象：${card.id}`);
  assert.equal(metaLanguage.test(`${card.title}${card.content}`), false, `出现元学习话术：${card.id}`);
  assert.equal(unsupportedAbsolute.test(card.content), false, `出现未受控绝对化表述：${card.id}`);
  assert.ok(card.content.length >= 35 && card.content.length <= 180, `卡片长度越界：${card.id}`);
  if (promotedIds.has(card.id)) {
    const golden = require("../miniprogram/subpackages/common-sense/models/guide-golden-sample")
      .groups.find((group) => group.pointId === card.pointId).cards
      .find((item) => item.id === authored.id);
    assert.deepEqual(authored, { ...golden, pointId: card.pointId }, `黄金晋级必须原位保留全部字段：${card.id}`);
  } else {
    assert.ok(learningGoalVerb.test(card.learningGoal), `学习目标缺少可判断动作：${card.id}`);
  }
  assert.ok(Array.isArray(authored.sourceEvidence) && authored.sourceEvidence.length, `缺少来源摘录：${card.id}`);
  const minimumEvidenceLength = promotedIds.has(card.id) ? 8 : 15;
  assert.ok(authored.sourceEvidence.every((item) => typeof item === "string" && item.trim().length >= minimumEvidenceLength), `来源摘录过短：${card.id}`);
  assert.equal(card.mapping, "source-overlap", `来源不能唯一定位正文页签：${card.id}`);
  assert.equal(card.review.independentFactReview, "pending-independent-review", `不得冒称独立事实审核：${card.id}`);

  const pointText = JSON.stringify(pointById[card.pointId]);
  const numbers = card.content.match(numericClaim) || [];
  numbers.forEach((number) => {
    const normalized = number.replace(/[—~-]/g, "");
    const pieces = number.split(/[—~-]/).filter(Boolean);
    assert.equal(pieces.every((piece) => pointText.includes(piece)), true,
      `数字事实没有正文证据：${card.id} / ${normalized}`);
  });
});

const explanationSet = new Set(content.cards.map((card) => card.content));
assert.equal(explanationSet.size, content.cards.length, "批内存在完全重复卡片");

batch.groups.forEach((group) => {
  assert.ok(group.overview.length >= 35 && group.overview.length <= 180, `知识组导读长度越界：${group.pointId}`);
  assert.equal(metaLanguage.test(group.overview), false, `知识组导读出现元学习话术：${group.pointId}`);
});

const exclusions = batch.exclusions || [];
+exclusions.forEach((hold) => {
  assert.ok(hold.reason.length >= 20, `HOLD 缺少问题说明：${hold.id}`);
  assert.ok(hold.requiredEvidence.length >= 20, `HOLD 缺少恢复条件：${hold.id}`);
});

console.log(JSON.stringify({
  ok: true,
  testType: "internal-expert-rule-review",
  batchId: batch.id,
  cardsReviewed: content.cards.length,
  groupsReviewed: content.groups.length,
  holdsReviewed: 0,
  exclusionsReviewed: exclusions.length,
  failures: 0,
  formalIndependentFactReview: "still-pending",
  rules: [
    "single-readable-title",
    "no-meta-learning-language",
    "no-uncontrolled-absolute-claim",
    "card-length",
    "observable-learning-outcome",
    "source-evidence",
    "unique-source-location",
    "numeric-source-consistency",
    "duplicate-content",
    "hold-recovery-contract"
  ]
}, null, 2));
