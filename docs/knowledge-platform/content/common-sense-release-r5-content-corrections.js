// Product-approved wording correction for an existing public mnemonic.
module.exports = function correct(pack) {
  const prior = pack.version;
  const id = 'new-culture-memory';
  const item = pack.mnemonics.find(x => x.id === id);
  if (!item || !item.text.includes('李大钊传马克思')) throw new Error('R5 mnemonic correction missing');
  item.revision += 1;
  const spec = pack.mnemonicSpecifications.find(x => x.mnemonicId === id);
  if (spec) spec.revision = item.revision;
  pack.version = '2026-10-29.r5-content';
  const delta = { changedQuestionIds: [], changedMnemonicIds: [id] };
  for (const migration of pack.sessionMigrations) {
    if (migration.toPackVersion && migration.toPackVersion !== prior) continue;
    migration.toPackVersion = pack.version;
    migration.changedMnemonicIds = [...new Set([...(migration.changedMnemonicIds || []), id])];
  }
  pack.sessionMigrations.push({ fromVersion: '8c8c7092', toPackVersion: pack.version, ...delta,
    reason: 'R5 产品确认修订：新文化运动口诀用李大钊与马克思主义的准确表述。' });
  return pack;
};
