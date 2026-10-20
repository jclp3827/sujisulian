const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const platform = require("../miniprogram/services/knowledge-platform");
const { knowledgePackage } = require("../miniprogram/services/knowledge-platform/politics-runtime");

const source = fs.readFileSync(`${__dirname}/../docs/knowledge-pilot/sources/politics/quick-primer-v2.json`);
const primer = JSON.parse(source).primer;
const layout = require("../docs/knowledge-pilot/sources/politics/quick-primer-reading-v3.json");
assert.equal(layout.sourcePrimerSha256, crypto.createHash("sha256").update(source).digest("hex"));
assert.equal(layout.sections.length, 8);
const plan = platform.planRecommendedRoute(knowledgePackage, "quick");
let session = platform.createRouteSession(plan, 1);
let shortChars = 0;
let originalChars = 0;
for (const [index, section] of primer.sections.entries()) {
  const reading = layout.sections[index];
  assert.equal(reading.sectionId, section.id);
  const selections = [reading.takeaway, ...reading.beats, ...(reading.note ? [reading.note] : [])];
  for (const selection of selections) {
    assert.equal(section.narrativeSegments[selection.segment - 1].text.split(selection.quote).length, 2, `${section.id}: excerpt is not unique in its approved segment`);
  }
  const count = selections.reduce((sum, selection) => sum + selection.quote.length, 0);
  assert.ok(count <= 200, `${section.id}: default reading is too long`);
  shortChars += count;
  originalChars += section.narrativeSegments.reduce((sum, segment) => sum + segment.text.length, 0);
  const projected = platform.projectQuickPrimerViewModel(knowledgePackage, plan, session);
  const visible = projected.sections.find((item) => item.id === projected.currentSectionId);
  assert.equal(visible.id, section.id);
  assert.equal(visible.title, reading.title);
  assert.equal(visible.reading.takeaway, reading.takeaway.quote);
  assert.deepEqual(visible.reading.beats.map((beat) => beat.text), reading.beats.map((beat) => beat.quote));
  assert.equal(projected.nextLabel, reading.nextLabel);
  if (section.kind !== "reflection") assert.equal(visible.narrativeSegments.map((segment) => segment.text).join(""), section.narrativeSegments.map((segment) => segment.text).join(""), "full explanation was lost");
  if (index < 7) session = platform.applyRouteSessionEvent(plan, session, { type: "NEXT_QUICK_SECTION", at: index + 2 });
}
assert.ok(shortChars <= 1100 && shortChars < originalChars * 0.6, "the default path did not meaningfully shorten");
assert.equal(session.quickReferenceOpened, false);
session = platform.applyRouteSessionEvent(plan, session, { type: "COMPLETE_QUICK_PRIMER", at: 10 });
assert.equal(session.status, "completed");
assert.equal(session.completedStepIds.length, 8);
assert.equal(session.quickReferenceOpened, false);
assert.deepEqual(platform.normalizeRouteSession(plan, JSON.parse(JSON.stringify(session))).completionSnapshot, session.completionSnapshot);
console.log(JSON.stringify({ status: "passed", sections: 8, defaultChars: shortChars, fullChars: originalChars, reductionPercent: Math.round((1 - shortChars / originalChars) * 100), fullReferenceRequired: false }));
