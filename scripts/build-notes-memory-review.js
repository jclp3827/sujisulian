// Frozen review evidence only. This output is never consumed as learning content or approval.
const fs = require('fs');
const path = require('path');
const { loadBody } = require('./lib/notes-learning-compiler');
const { resolveCard, hash } = require('../miniprogram/subpackages/note/services/memory-content');
const root = path.resolve(__dirname, '..');
const read = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const sourceRevision=require('./lib/notes-memory-sample-source'),migration=sourceRevision.migration(root);
const samples = migration?migration.beforeSamples:read('docs/knowledge-platform/content/notes/memory-v5-samples.json');
const context = read('docs/knowledge-platform/content/notes/memory-v5-sample-context.json');
// This command reproduces the historical P3-R1 artifact, never current runtime content.
const body = sourceRevision.historicalBody(root,loadBody(root));
const ids = new Set(samples.cards.map(card => card.id));
if (ids.size !== samples.cards.length || context.cards.length !== ids.size || new Set(context.cards.map(c => c.cardId)).size !== ids.size) throw Error('样板和上下文记录身份不一致');
if (context.formalApproved !== 0 || context.independentReviewStatus !== 'pending') throw Error('此构建器不产生审核批准');
const cards = samples.cards.map(card => {
  const note = context.cards.find(c => c.cardId === card.id);
  if (!note || note.authorInspection !== 'context-inspected-not-approved') throw Error('缺少逐卡上下文核对：' + card.id);
  const resolved = resolveCard(card, body);
  const sources = card.refs.map(ref => {
    const point = body[ref.subjectId].points.find(p => p.id === ref.pointId);
    const tab = point.tabs.find(t => t.id === ref.tabId);
    const sourceFile = `miniprogram/models/note-${ref.subjectId}/points/${point.categoryId}.json`;
    if (!fs.existsSync(path.join(root, sourceFile))) throw Error('找不到原JSON：' + sourceFile);
    const sourcePoints = read(sourceFile);
    const canonicalPoint = migration&&ref.subjectId==='quantity'&&ref.pointId==='work-efficiency'?migration.beforePoint:sourcePoints.find(p => p.id === ref.pointId);
    if (!canonicalPoint || hash(canonicalPoint.tabs.find(t => t.id === ref.tabId)) !== ref.expectedTabSha256) throw Error('原JSON与引用版本不一致');
    return { sourceFile, subjectId: ref.subjectId, pointId: ref.pointId, pointTitle: point.title, tabId: tab.id,
      tabTitle: tab.title, expectedTabSha256: ref.expectedTabSha256,
      originalBlocks: ref.blocks.map(selection => ({ selection, originalBlock: tab.blocks[selection.blockIndex] })) };
  });
  return { cardId: card.id, revision: card.revision, semanticVersion: resolved.semanticVersion,
    status: card.status, editorialFields: { title: card.title, prompt: card.prompt }, ...note, sources,
    projectedBlocks: resolved.blocks, acceptance: 'not-created' };
});
const evidence = { schemaVersion: 1, date: '2026-10-22', batch: 'P3-R1',
  scope: 'Original versus projected context review packet, not canonical runtime content or independent semantic approval',
  currentSamples: cards.length, formalApproved: 0, independentReviewStatus: 'pending', cards };
const destination = path.join(root, 'docs/knowledge-platform/implementations/evidence/notes-memory-v5-sample-review-20261022.json');
const output = JSON.stringify(evidence, null, 2) + '\n';
if (process.argv.includes('--check-only')) {
  if (fs.readFileSync(destination, 'utf8') !== output) throw Error('待审对照包已过期');
} else fs.writeFileSync(destination, output);
console.log(JSON.stringify({ passed: true, sampleCards: cards.length, exactSourceBindings: cards.reduce((n, c) => n + c.sources.length, 0), formalApproved: 0, independentReviewStatus: 'pending', checkOnly: process.argv.includes('--check-only') }));
