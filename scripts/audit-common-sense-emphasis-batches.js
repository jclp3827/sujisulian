const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const { execFileSync } = require('child_process');
const body = require('../miniprogram/subpackages/common-sense/models/note-common-sense');
const candidate = require('../miniprogram/subpackages/common-sense/models/guide-expansion-candidate');
const { createGoldenGuideContent } = require('../miniprogram/subpackages/common-sense/services/guide-content');
const { fingerprint } = require('../miniprogram/subpackages/common-sense/services/learning-content');
const { presentGuideCard } = require('../miniprogram/subpackages/common-sense/services/guide-presentation');
const root = path.resolve(__dirname, '..');
const content = createGoldenGuideContent(body, candidate);
const hashFile = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex');
const batches = [];
const seen = new Set();
for (let number = 1; number <= 307; number++) {
  const file = `miniprogram/subpackages/common-sense/models/guide-emphasis-batch-${number}.js`;
  const annotations = require(path.join(root, file));
  const cards = Object.entries(annotations).map(([id, annotation]) => {
    assert.ok(annotation.terms.length || annotation.decision === 'reviewed-plain', `Missing plain-text decision ${id}`);
    if (number >= 4) assert.ok(annotation.reason && annotation.reason.length > 8, `Missing review rationale ${id}`);
    assert.ok(!seen.has(id), `Duplicate annotation ${id}`);
    seen.add(id);
    const card = content.cardById[id];
    assert.ok(card, `Unknown card ${id}`);
    assert.equal(annotation.contentHash, fingerprint({ title: card.title, content: card.content }));
    const tokens = presentGuideCard(card).flatMap(p => p.tokens);
    assert.equal(tokens.map(t => t.text).join(''), card.content);
    assert.deepEqual(tokens.filter(t => t.emphasis).map(t => t.text), annotation.terms);
    const marked = annotation.terms.reduce((n, t) => n + t.length, 0);
    assert.ok(marked <= Math.floor(card.content.length / 4));
    return { id, title: card.title, contentHash: annotation.contentHash, signature: card.signature,
      terms: annotation.terms, decision: annotation.decision || 'emphasis', reason: annotation.reason || '见第1至3批实施登记',
      contentLength: card.content.length, markedLength: marked, sourceUrl: card.sourceUrl };
  });
  batches.push({ number, file, sha256: hashFile(file), cards });
}
const sources = ['miniprogram/subpackages/common-sense/models/note-common-sense.js',
  'miniprogram/subpackages/common-sense/models/guide-expansion-candidate.js'];
for (const file of sources) execFileSync('git', ['diff', '--exit-code', 'HEAD', '--', file], { cwd: root });
const markedCards = batches.flatMap(b => b.cards).filter(c => c.terms.length).length;
const report = { passed: true, scope: 'display-annotations-only', baseline: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  totalCandidateCards: content.cards.length, reviewedCards: seen.size, markedCards, reviewedPlainCards: seen.size - markedCards, remainingCards: content.cards.length - seen.size,
  remainingCardIds: content.cards.filter(card => !seen.has(card.id)).map(card => card.id),
  contentSourcesUnchangedSinceCheckpoint: sources.map(file => ({ file, sha256: hashFile(file) })),
  formalAdmissionAdded: 0, batches };
const target = process.argv.indexOf('--out');
if (target >= 0) {
  assert.ok(process.argv[target + 1]);
  fs.writeFileSync(path.resolve(process.argv[target + 1]), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({ passed: true, batches: batches.length, reviewedCards: seen.size, markedCards, reviewedPlainCards: report.reviewedPlainCards, remaining: report.remainingCards }));
