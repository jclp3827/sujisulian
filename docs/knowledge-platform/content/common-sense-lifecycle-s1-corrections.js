// S1: explicitly authorized corrections to existing public identities, not new admission.
module.exports = function correct(pack) {
  const prior = pack.version;
  const changedMnemonicIds = ['new-culture-memory', 'pre-qin-institutions-memory'];
  for (const id of changedMnemonicIds) {
    const item = pack.mnemonics.find(x => x.id === id);
    // Coverage is user-facing knowledge: derive it from the already corrected, linked meanings.
    item.coverage = item.phrases.map(x => x.meaning).join('；');
    item.revision += 1;
    const spec = pack.mnemonicSpecifications.find(x => x.mnemonicId === id);
    if (spec) spec.revision = item.revision;
  }
  const question = pack.questions.find(x => x.id === 'third-plenum-full');
  Object.assign(question, {
    revision: question.revision + 1,
    prompt: '关于中共十一届三中全会的召开时间、地点和重大决策，下列哪项表述正确？',
    options: [
      '1978年12月在北京召开，作出把工作中心转移到经济建设上来、实行改革开放的历史性决策',
      '1978年12月在北京召开，决定继续以阶级斗争为纲、暂缓经济建设和改革开放',
      '1978年12月在上海召开，作出把工作中心转移到经济建设上来、实行改革开放的历史性决策'
    ],
    explanation: '中共十一届三中全会于1978年12月在北京召开，作出工作中心转移和改革开放的历史性决策。继续以阶级斗争为纲或把地点写成上海均不正确。'
  });
  const spec = pack.questionSpecifications.find(x => x.questionId === question.id);
  spec.distractorReasons = { '1': '时间地点正确，但重大决策与全会实现的工作中心转移和改革开放相反。',
    '2': '时间和重大决策正确，但会议地点是北京，不是上海。' };
  // Existing time/decision targets and synthesis level remain; no new assessment objective.
  pack.version = '2026-10-28.s1';
  const delta = { changedQuestionIds: [question.id], changedMnemonicIds };
  const migrations = pack.sessionMigrations.filter(x => !x.toPackVersion || x.toPackVersion === prior);
  pack.sessionMigrations.push(...migrations.map(x => ({ ...x, toPackVersion: pack.version,
    changedQuestionIds: [...new Set([...(x.changedQuestionIds || []), ...delta.changedQuestionIds])],
    changedMnemonicIds: [...new Set([...(x.changedMnemonicIds || []), ...changedMnemonicIds])] })),
    { fromVersion: '873bd30d', toPackVersion: pack.version, ...delta,
      reason: 'S1 精确纠错：仅受影响条目重新评估；不扩大历史公开授权。' });
  return pack;
};
