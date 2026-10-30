const REVIEWED_EMPHASIS = require('../models/guide-emphasis-runtime');
const { fingerprint } = require('./learning-content');
// Display-only projection. Never changes card text, identity, signatures or storage.
function presentGuideCard(card) {
  if (!card) return [];
  const text = card.content;
  const annotation = REVIEWED_EMPHASIS[card.id];
  const matches = annotation && annotation.contentHash === fingerprint({ title: card.title, content: text }) &&
    annotation.terms.every((term) => text.includes(term));
  const terms = matches ? annotation.terms : [];
  const candidates = terms.filter((term) => typeof term === 'string' && term.length >= 2 &&
    term.length <= 16 && !/[。！？\n]/.test(term) && text.includes(term))
    .map((term) => ({ start: text.indexOf(term), end: text.indexOf(term) + term.length }))
    .sort((a, b) => a.start - b.start);
  const spans = [];
  let used = 0;
  const budget = Math.floor(text.length * 0.25);
  for (const span of candidates) {
    if (spans.length >= 3 || used + span.end - span.start > budget ||
      spans.some((other) => span.start < other.end && span.end > other.start)) continue;
    spans.push(span);
    used += span.end - span.start;
  }
  spans.sort((a, b) => a.start - b.start);
  // Break only at a complete sentence; do not invent labels or summarize the text.
  let split = 0;
  if (text.length > 75) {
    const stops = /[。！？][”’」』]*/g;
    let match;
    while ((match = stops.exec(text))) {
      const end = match.index + match[0].length;
      if (end >= 24 && text.length - end >= 20) { split = end; break; }
    }
  }
  if (split && spans.some((span) => span.start < split && span.end > split)) split = 0;
  const ranges = split ? [[0, split], [split, text.length]] : [[0, text.length]];
  return ranges.map(([start, end], index) => {
    let cursor = start;
    const tokens = [];
    for (const span of spans.filter((item) => item.start >= start && item.end <= end)) {
      if (span.start > cursor) tokens.push({ text: text.slice(cursor, span.start), emphasis: false });
      tokens.push({ text: text.slice(span.start, span.end), emphasis: true });
      cursor = span.end;
    }
    if (cursor < end) tokens.push({ text: text.slice(cursor, end), emphasis: false });
    return { id: index, tokens: tokens.map((token, id) => ({ ...token, id })) };
  });
}
module.exports = { presentGuideCard };
