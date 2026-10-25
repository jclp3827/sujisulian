const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
function validateWholeOverviewCrossMode(root) {
  const runtime = require(path.join(root, 'miniprogram/services/knowledge-platform/politics-runtime'));
  const curriculum = require(path.join(root, 'miniprogram/models/politics-systematic-units-runtime'));
  const primer = runtime.knowledgePackage.quickPrimers.find(primer => primer.id === 'politics-quick-primer-v5');
  assert.ok(primer);
  const blocks = new Map(runtime.knowledgePackage.knowledgeUnits.flatMap(unit => unit.blocks.map(block => [block.id,block])));
  const lessons = curriculum.lessons;
  const lessonBlocks = new Set(lessons.flatMap(lesson => [...lesson.parts, lesson.reflection].flatMap(part => part.sourceBlockIds)));
  const defaultText = primer.sections.flatMap(section => section.narrativeSegments.map(segment => segment.text)).join('\n');
  const optionalText = primer.sections.flatMap(section => (section.optionalIndex || []).flatMap(segment => [segment.label,segment.text])).join('\n');
  const deepText = lessons.flatMap(lesson => [lesson.title,...lesson.parts.map(part=>part.text),lesson.reflection.answer]).join('\n');
  const sourceLinks = [];
  for (const section of primer.sections) {
    const shared = [...new Set(section.narrativeSegments.flatMap(segment => segment.sourceBlockIds).filter(id=>lessonBlocks.has(id)))];
    assert.ok(shared.length, section.id+' lacks a trace to systematic sources');
    sourceLinks.push({sectionId:section.id,responsibility:section.responsibility,sharedSourceBlockIds:shared});
    for (const segment of [...section.narrativeSegments,...(section.optionalIndex || [])]) for (const ref of segment.sourceEvidence) {
      const block = blocks.get(ref.blockId);assert.ok(block);
      assert.ok(block.fallbackText.includes(ref.quote) || ref.quote.includes(block.fallbackText));
      // Provenance overlap is a trace, never credit that the overview teaches every linked lesson.
    }
  }
  for (const term of ['马克思主义哲学','政治经济学','科学社会主义','坚持和发展中国特色社会主义','两个结合','剩余价值']) {
    assert.ok(defaultText.includes(term),term+' missing from overview');
    assert.ok(deepText.includes(term),term+' missing from systematic learning');
  }
  for (const term of ['十个明确','十四个坚持','十三个方面成就','六个必须坚持']) {
    assert.ok(optionalText.includes(term),term+' missing from optional index');
    assert.ok(deepText.includes(term));
    assert.ok(!defaultText.includes(term),term+' returned to required overview');
  }
  for (const term of ['一般等价物','社会必要劳动时间','具体劳动']) {
    assert.ok(deepText.includes(term),term+' was removed from systematic learning');
    assert.ok(!defaultText.includes(term),term+' returned as mandatory definition in overview');
  }
  assert.equal(curriculum.lessons.length,77);
  assert.equal(curriculum.knowledgePackageVersion,runtime.knowledgePackage.packageVersion);
  const platform = require(path.join(root, 'miniprogram/services/knowledge-platform'));
  for (const type of ['quick','systematic','confusion','exam']) assert.ok(platform.planRecommendedRoute(runtime.knowledgePackage,type));
  return {status:'passed-candidate-only',audit:'whole-overview-v5-cross-mode',sections:primer.sections.length,systematicLessons:lessons.length,sharedSourceTraces:sourceLinks.length,optionalIndexTerms:4,deepConceptsRetained:3,sourceLinks,sourceOverlapCreditsMastery:false,historicalB5:'preserved; fixed-six-step and 97-objective-orientation rules superseded by authorized whole-overview goal'};
}
module.exports = { validateWholeOverviewCrossMode };
