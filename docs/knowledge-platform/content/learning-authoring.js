const ref = (pointId, tabId, sourceUnitId) => ({ pointId, tabId, sourceUnitIds: [sourceUnitId] });
const question = (id, scope, group, objective, prompt, options, answer, explanation, boundary, refs) =>
  ({ id, revision: 1, status: "review", scope, group, objective, prompt, options, answer, explanation, boundary, refs, kind: "自编学习题" });
const mnemonic = (id, scope, title, text, coverage, excludes, phrases, questionIds) =>
  ({ id, revision: 1, status: "review", scope, title, text, method: "对照记忆", coverage, excludes, phrases, questionIds });
module.exports = { ref, question, mnemonic };
