const crypto = require('crypto');
// Exact content and dependency binding; audit/display metadata is not learning semantics.
const ignored = new Set(['review','reviewedAt','checkedAt','auditStatus','sourceAuditStatus','style','className',
  'specification','runtimeSignature','learningSignature','signature','compatibleSignatures','productionLabel','sourceUrl','verificationLabel']);
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort()
    .filter(key => !ignored.has(key) && value[key] !== undefined).map(key => [key,canonical(value[key])]));
  return value;
}
const digest = value => crypto.createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
function binding(bank, item, pack) {
  let dependencies = [];
  if (bank === 'common-question' || bank === 'common-mnemonic') {
    const rels = bank === 'common-question' ? (pack.targetRelations.questionTargets || []).filter(x => x.questionId === item.id)
      : (pack.targetRelations.mnemonicPhraseTargets || []).filter(x => x.mnemonicId === item.id);
    const targetIds = [...new Set(rels.flatMap(x => [...(x.primaryTargetIds||[]),...(x.supportingTargetIds||[]),...(x.targetIds||[])]))];
    dependencies = [rels, targetIds.map(id => pack.targets.find(x => x.id === id))];
    if (bank === 'common-mnemonic') dependencies.push(item.questionIds.map(id => {
      const q=pack.questions.find(x => x.id===id);return q ? binding('common-question',q,pack) : null;
    }));
  }
  return digest({bank,item,dependencies});
}
function withdrawn(bank, id, revision, ledger) {
  return ledger.entries.some(x => x.bank === bank && x.id === id &&
    (x.revision === '*' || String(x.revision) === String(revision)));
}
function permit(bank,item,token,policy,ledger) {
  if (['HOLD','hold','blocked','withdrawn','retired'].includes(item.status) || item.localHold ||
    withdrawn(bank,item.id,item.semanticVersion || item.semanticRevision || item.revision || '*',ledger)) return false;
  if (policy.historical?.[bank]?.[item.id] === token) return true;
  return policy.grants.some(batch => batch.decision === 'public-authorized' && batch.authorizedBy && batch.authorizedAt &&
    batch.independentReviewReceipt && batch.humanSamplingReceipt && batch.bindings.some(x => x.bank===bank && x.id===item.id && x.digest===token));
}
function validateLedger(ledger) {
  if (ledger.schema!==1 || !Number.isSafeInteger(ledger.revision) || !Array.isArray(ledger.entries) ||
    ledger.entries.some(x => !x.bank || !x.id || !x.revision || !x.reason || !x.withdrawnAt)) throw Error('Invalid effective withdrawal ledger');
}
module.exports={canonical,digest,binding,permit,withdrawn,validateLedger};
