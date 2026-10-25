const assert = require('node:assert/strict');

// Regression guard for editorial language reported in the learner-facing overview.
// Concept accuracy and title/body coherence still require independent text review.
function visibleQuickText(primer) {
  return [
    ...primer.sections.flatMap(section => [section.title, section.shortTitle, section.guidingQuestion, section.nextLabel,
      ...[...section.narrativeSegments, ...(section.optionalIndex || [])].flatMap(segment => [segment.label, segment.text])]),
    ...Object.values(primer.completionCopy || {}),
  ].filter(value => typeof value === 'string');
}
function validateQuickUserView(primer, extraVisibleText = []) {
  const strings = [...visibleQuickText(primer), ...extraVisibleText];
  const banned = /马原|怎样放在一起|合回一张图|本导读先看|当前范围|本知识库|当前内容以|这里按.*帮助浏览|不等于完整政治理论|马克思主义基本原理的三个组成部分/;
  for (const text of strings) assert.ok(!banned.test(text), '快速了解用户视角或正式对象回退：' + text);
  for (const section of primer.sections) assert.ok(!/^(先看总图|实践展开|回看整体|回到整体地图)$/.test(section.title), '编排动作不能作为知识标题');
  // Internal source scope remains available; it is deliberately excluded from display strings.
  assert.ok(primer.scopeBoundary, '内部来源边界不得随界面说明一并丢失');
  return strings;
}
module.exports = { visibleQuickText, validateQuickUserView };
