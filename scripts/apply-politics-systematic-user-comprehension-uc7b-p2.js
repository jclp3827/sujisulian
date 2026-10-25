#!/usr/bin/env node
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');
const batch = 'politics-systematic-user-comprehension-uc7b-p2';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p1r1-20261023.json',
  evidence: evidenceRoot + batch + '-20261023.json',
  aiReview: evidenceRoot + batch + '-ai-review-20261023.json',
  runtimeProbe: evidenceRoot + batch + '-runtime-probe-20261023.json',
};
const absolute = file => path.join(root, file);
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const optional = file => fs.existsSync(absolute(file)) ? read(file) : null;
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(absolute(file))).digest('hex');
const write = (file, value) => fs.writeFileSync(absolute(file), JSON.stringify(value, null, 2) + '\n');
const ids = ['SYS-05', 'LEADERSHIP-02'];
const source = read(files.source), inventory = read(files.inventory), predecessor = read(files.predecessor);
const priorEvidence = optional(files.evidence);
const previousRuntime = require(absolute(files.runtime));
assert.ok([predecessor.curriculumVersion, priorEvidence?.curriculumVersion].includes(previousRuntime.curriculumVersion));
const before = priorEvidence?.before || Object.fromEntries(ids.map(id => [id, structuredClone(source.lessons.find(l => l.id === id))]));
const metadataChangedLessonIds = ['LEADERSHIP-01'];
const unaffected = l => !ids.includes(l.id) && !metadataChangedLessonIds.includes(l.id);
const unchangedBefore = source.lessons.filter(unaffected);
const unchangedHash = crypto.createHash('sha256').update(JSON.stringify(unchangedBefore)).digest('hex');
const u3 = suffix => 'block:politics-toc-v2-u003:' + suffix;
const u6 = suffix => 'block:politics-toc-v2-u006:' + suffix;
const part = (label, text, sourceBlockIds, quotes = []) => ({label, text, sourceBlockIds,
  emphasis: quotes.map(quote => ({part: 'text', quote, occurrence: 1, role: 'key'}))});

const sys05 = source.lessons.find(l => l.id === 'SYS-05');
Object.assign(sys05, {
  title: '六个必须坚持·四至六',
  question: '问题导向、系统观念与胸怀天下分别强调什么？',
  objectives: ['理解问题导向、系统观念与胸怀天下的含义'],
  scopeLimit: '学习重点：六个必须坚持中问题导向、系统观念与胸怀天下的含义。',
  sections: [
    part('问题导向（第4项）', '必须坚持问题导向。问题导向是重要实践要求，体现矛盾的普遍性和客观性，要求正视实践中的问题并解决问题。', [u3('b018'), u3('b019')], ['重要实践要求', '矛盾的普遍性和客观性']),
    part('系统观念（第5项）', '必须坚持系统观念。系统观念是基本思想和工作方法，体现辩证唯物主义普遍联系的原理，要求从事物之间的联系把握事物。', [u3('b018'), u3('b019')], ['基本思想和工作方法', '普遍联系']),
    part('胸怀天下（第6项）', '必须坚持胸怀天下。胸怀天下是中国共产党人的境界格局，体现马克思主义追求人类进步和解放的崇高理想。', [u3('b018'), u3('b019')], ['中国共产党人的境界格局', '人类进步和解放']),
  ],
  recap: part('本主题小结', '问题导向体现重要实践要求，系统观念体现基本思想和工作方法，胸怀天下体现中国共产党人的境界格局。', [u3('b019')]),
  reflection: {
    prompt: '问题导向、系统观念与胸怀天下分别强调什么？',
    answer: '问题导向强调正视和解决实际问题；系统观念强调从普遍联系把握事物；胸怀天下强调追求人类进步和解放的境界格局。',
    sourceBlockIds: [u3('b019')],
  },
});
delete sys05.boundary;

const leadership02 = source.lessons.find(l => l.id === 'LEADERSHIP-02');
Object.assign(leadership02, {
  title: '人民立场、党的宗旨与群众路线',
  question: '人民立场、党的宗旨与群众路线分别是什么？',
  objectives: ['理解人民立场、党的宗旨与群众路线的含义'],
  scopeLimit: '学习重点：人民立场、党的宗旨与群众路线的含义，以及党的宗旨与发展的根本目的的区别。',
  sections: [
    part('人民立场', '人民立场是中国共产党的根本政治立场，是我们党区别于其他政党的显著标志。', [u6('b004')], ['根本政治立场']),
    part('党的宗旨与发展的根本目的', '全心全意为人民服务是中国共产党的宗旨；增进民生福祉是发展的根本目的。前者说明党的宗旨，后者说明发展的目的。', [u6('b009'), u6('b008')], ['全心全意为人民服务', '增进民生福祉']),
    part('群众路线', '群众路线是党的生命线和根本工作路线，包括一切为了群众、一切依靠群众，从群众中来、到群众中去，把党的正确主张变为群众的自觉行动。密切联系群众是党的最大政治优势，脱离群众是党执政后的最大危险。', [u6('b010'), u6('b012'), u6('b005')], ['生命线和根本工作路线', '从群众中来、到群众中去']),
  ],
  recap: part('本节结论', '人民立场是根本政治立场，全心全意为人民服务是党的宗旨，群众路线是党的生命线和根本工作路线。', [u6('b004'), u6('b009'), u6('b010')]),
  reflection: {
    prompt: '人民立场、党的宗旨与群众路线分别是什么？',
    answer: '人民立场是中国共产党的根本政治立场；党的宗旨是全心全意为人民服务；群众路线是党的生命线和根本工作路线，要求一切为了群众、一切依靠群众，从群众中来、到群众中去。',
    sourceBlockIds: [u6('b004'), u6('b009'), u6('b010'), u6('b012')],
  },
  corePromises: [
    {quote: '根本政治立场', sourceBlockIds: [u6('b004')]},
    {quote: '全心全意为人民服务', sourceBlockIds: [u6('b009')]},
    {quote: '增进民生福祉', sourceBlockIds: [u6('b008')]},
    {quote: '生命线和根本工作路线', sourceBlockIds: [u6('b010')]},
    {quote: '从群众中来、到群众中去', sourceBlockIds: [u6('b012')]},
  ],
});
delete leadership02.boundary;
assert.equal(crypto.createHash('sha256').update(JSON.stringify(source.lessons.filter(unaffected))).digest('hex'), unchangedHash);
source.lessons.find(l => l.id === 'LEADERSHIP-01').transition = '下一节：' + leadership02.title;
source.progressCompatibleVersions = [...new Set([...source.progressCompatibleVersions, predecessor.curriculumVersion])];
const partsFor = (lesson, reflection = false) => [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap, ...(reflection ? [lesson.reflection] : [])];
const used = new Set(source.lessons.flatMap(l => partsFor(l, true).flatMap(p => p.sourceBlockIds)));
source.sourceBindings = source.sourceBindings.filter(b => used.has(b.blockId));
for (const unit of inventory.units) for (const block of unit.sourceBlocks) {
  block.sampleLessonIds = source.lessons.filter(l => partsFor(l, true).some(p => p.sourceBlockIds.includes(block.blockId))).map(l => l.id);
  block.teachingDisposition = source.lessons.some(l => partsFor(l).some(p => p.sourceBlockIds.includes(block.blockId))) ? 'default-reference' : block.sampleLessonIds.length ? 'optional-reference' : 'source-only';
}
const runtime = compile(source, inventory, 'candidate');
let projection = fs.readFileSync(absolute(files.projection), 'utf8');
for (const id of ids) {
  const l = source.lessons.find(l => l.id === id);
  const pattern = new RegExp(`('${id}':\\s*)'[^']*'`);
  assert.match(projection, pattern);
  projection = projection.replace(pattern, `$1'${l.title}'`);
}
write(files.source, source); write(files.inventory, inventory);
fs.writeFileSync(absolute(files.projection), projection);
fs.writeFileSync(absolute(files.runtime), '// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ' + JSON.stringify(runtime) + ';\n');
fs.writeFileSync(absolute(files.reading), renderReading(source));
let lineage = fs.readFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), 'utf8');
if (!lineage.includes(batch + '-20261023.json')) {
  lineage = lineage.replace("  'politics-systematic-user-comprehension-uc7b-p1r1-20261023.json',", "  'politics-systematic-user-comprehension-uc7b-p1r1-20261023.json',\n  '" + batch + "-20261023.json',");
  fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
}
const ai = optional(files.aiReview), probe = optional(files.runtimeProbe);
const aiPassed = ai?.curriculumVersion === runtime.curriculumVersion && ai?.sourceSha256 === digest(files.source)
  && ai?.projectionSha256 === digest(files.projection)
  && ['ai-first-user','ai-subject-expert','ai-assessment-expert'].every(id => ai.roles?.[id]?.status === 'pass' && ai.roles[id].riskCount === 0 && ai.roles[id].holdCount === 0);
const probePassed = probe?.status === 'passed' && probe.curriculumVersion === runtime.curriculumVersion && ids.every(id => probe.lessonIds.includes(id));
const evidence = {
  schemaVersion: 1, batchId: batch, generatedAt: '2026-10-23',
  status: aiPassed && probePassed ? 'candidate-integrated-and-runtime-verified' : 'candidate-integrated-review-pending',
  previousCurriculumVersion: predecessor.curriculumVersion, curriculumVersion: runtime.curriculumVersion,
  stableLessonIds: true, orderChanged: false, progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
  changedLessonIds: ids, metadataChangedLessonIds, unaffectedLessonCount: unchangedBefore.length, unaffectedLessonsSha256: unchangedHash,
  contractRules: [12,13,14,15,16,17,18,21,22,23,24,25,26,27,28,29,30],
  issueIds: ['UC7B-SEED-SYS-05','UC7B-SEED-LEADERSHIP-02'],
  before, after: Object.fromEntries(ids.map(id => [id, source.lessons.find(l => l.id === id)])),
  sourcePath: files.source, sourceSha256: digest(files.source), inventoryPath: files.inventory, inventorySha256: digest(files.inventory),
  runtimePath: files.runtime, runtimeSha256: digest(files.runtime), projectionPath: files.projection, projectionSha256: digest(files.projection),
  aiReview: aiPassed ? 'passed' : 'pending', aiReviewPath: aiPassed ? files.aiReview : null, aiReviewSha256: aiPassed ? digest(files.aiReview) : null,
  runtimePageCheck: probePassed ? 'passed' : 'pending', runtimeProbePath: probePassed ? files.runtimeProbe : null, runtimeProbeSha256: probePassed ? digest(files.runtimeProbe) : null,
  realUserAcceptance: 'pending', retainedHoldLessonIds: ['CAPITAL-02'], releaseAuthorized: false,
};
write(files.evidence, evidence);
console.log(JSON.stringify({status:evidence.status,curriculumVersion:runtime.curriculumVersion,changedLessonIds:ids,aiReview:evidence.aiReview,runtimePageCheck:evidence.runtimePageCheck}));
