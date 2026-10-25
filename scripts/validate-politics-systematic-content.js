const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { knowledgePackage } = require('../miniprogram/services/knowledge-platform/politics-runtime');
const { projectTextRuns } = require('../miniprogram/services/knowledge-platform/reading-text');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, 'docs/knowledge-pilot/sources/politics');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const read = file => fs.readFileSync(path.join(root, file));
const field = value => assert.ok(typeof value === 'string' && value.trim().length, 'missing content field');

function validate(samples, inventory, pkg = knowledgePackage, readFile = read) {
  assert.equal(samples.schemaVersion, 1);
  assert.equal(inventory.schemaVersion, 1);
  assert.ok(['P1', 'P4-batch1', 'P4-batch2', 'P4-complete-bounded'].includes(samples.stage), 'unknown content stage');
  assert.equal(samples.status, 'draft');
  assert.equal(samples.contentApproval, 'b4-reviewed-candidate');
  assert.equal(samples.userExperienceAccepted, false);
  assert.equal(samples.published, false);
  assert.equal(inventory.published, false);
  assert.ok(Array.isArray(samples.progressCompatibleVersions));
  assert.equal(new Set(samples.progressCompatibleVersions).size, samples.progressCompatibleVersions.length, 'duplicate compatible version');
  samples.progressCompatibleVersions.forEach(version => assert.match(version, /^units-[a-f0-9]{12}$/));
  assert.equal(samples.sourcePackageVersion, pkg.packageVersion);
  assert.equal(inventory.sourcePackageVersion, pkg.packageVersion);

  const units = new Map(pkg.knowledgeUnits.map(unit => [unit.id, unit]));
  const blocks = new Map(pkg.knowledgeUnits.flatMap(unit => unit.blocks.map(block => [block.id, block])));
  const rows = new Map(inventory.units.map(row => [row.unitId, row]));
  assert.equal(rows.size, inventory.units.length, 'duplicate inventory unit');
  assert.equal(rows.size, units.size, 'incomplete inventory');
  for (const [id, unit] of units) {
    const row = rows.get(id);
    assert.ok(row, 'missing inventory unit ' + id);
    assert.ok(['reorganize', 'explain', 'source-gap'].includes(row.action));
    assert.ok(row.proposedGoals.length > 0);
    field(row.note);
    assert.equal(row.contentSha256, digest(JSON.stringify(unit.blocks.map(block => ({ id: block.id, text: block.fallbackText || '' })))), 'unit source drift ' + id);
    assert.ok(row.sourceFile.path.startsWith('docs/knowledge-pilot/knowledge/politics-v2/' + id + '-'), 'wrong source file identity');
    assert.equal(row.sourceFile.sha256, digest(readFile(row.sourceFile.path)), 'Markdown source drift ' + id);
    assert.equal(row.sourceBlocks.length, unit.blocks.length);
    assert.equal(new Set(row.sourceBlocks.map(block => block.blockId)).size, unit.blocks.length);
    for (const item of row.sourceBlocks) {
      const block = blocks.get(item.blockId);
      assert.ok(unit.blocks.some(candidate => candidate.id === item.blockId));
      assert.equal(item.textSha256, digest(block.fallbackText || ''), 'inventory source drift');
    }
  }
  const resolved = inventory.resolvedGaps || [];
  assert.equal(inventory.gaps.length + resolved.length, 3);
  assert.deepEqual([...inventory.gaps, ...resolved].map(gap => gap.id).sort(), ['GAP-01','GAP-02','GAP-03'], 'missing or duplicate gap disposition');
  if (resolved.length) {
    const registryPath = 'docs/knowledge-pilot/sources/politics/primary-supplements-20261024.json';
    assert.equal(inventory.supplementalSourceRegistry.path, registryPath);
    assert.equal(inventory.supplementalSourceRegistry.sha256, digest(readFile(registryPath)), 'supplement registry drift');
    const registry = JSON.parse(readFile(registryPath));
    assert.equal(registry.curriculumExpansionApproval, 'user-approved-20261024');
    for (const gap of resolved) {
      assert.equal(gap.status, 'sources-and-teaching-integrated-candidate');
      assert.ok(gap.lessonIds.length);
      for (const id of gap.lessonIds) assert.ok(samples.lessons.some(lesson => lesson.id === id), 'resolved gap missing lesson');
    }
    for (const block of registry.blocks) {
      const id = 'block:' + block.unitId + ':' + block.id;
      assert.equal(digest(block.text), block.textSha256);
      assert.equal(blocks.get(id)?.fallbackText, block.text, 'supplement missing from package');
      assert.ok(samples.lessons.some(lesson => lesson.sections.some(part => part.sourceBlockIds.includes(id))), 'supplement absent from default teaching');
      assert.ok(block.sourceRefIds.every(ref => pkg.sourceReferences.some(source => source.id === ref)), 'missing supplement attribution');
    }
  }
  for (const gap of inventory.gaps) {
    assert.ok(gap.unitIds.every(id => rows.get(id)?.action === 'source-gap'));
    field(gap.topic); field(gap.handling);
  }

  const bindings = new Map(samples.sourceBindings.map(item => [item.blockId, item.textSha256]));
  assert.equal(bindings.size, samples.sourceBindings.length, 'duplicate binding');
  for (const [id, sha] of bindings) {
    assert.ok(blocks.has(id), 'missing source block ' + id);
    assert.equal(sha, digest(blocks.get(id).fallbackText || ''), 'sample source drift ' + id);
  }

  const lessons = new Map(samples.lessons.map(lesson => [lesson.id, lesson]));
  assert.equal(lessons.size, samples.lessons.length, 'duplicate lesson');
  const usedBindings = new Set();
  function evidence(part) {
    field(part.text || part.answer);
    assert.ok(part.sourceBlockIds?.length, 'missing evidence');
    for (const id of part.sourceBlockIds) {
      assert.ok(bindings.has(id), 'unbound source ' + id);
      usedBindings.add(id);
    }
    if (part.text) {
      const runs = projectTextRuns({ text: part.text }, part.text, { emphasis: part.emphasis || [] }, 'text');
      assert.equal(runs.map(run => run.text).join(''), part.text);
      for (const selection of part.emphasis || []) {
        assert.ok(part.text.split(selection.quote).length > selection.occurrence, 'invalid emphasis selector');
        assert.ok(runs.some(run => run.role === selection.role && run.text.includes(selection.quote)), 'emphasis not consumed');
      }
    }
  }
  const sizes = [];
  for (const lesson of lessons.values()) {
    field(lesson.title); field(lesson.question); field(lesson.scopeLimit);
    assert.ok(lesson.objectives.length >= 1 && lesson.objectives.length <= 3);
    lesson.objectives.forEach(field);
    assert.ok(lesson.sections.length >= 2, 'no explanatory sequence');
    lesson.sections.forEach(evidence);
    if (lesson.boundary) evidence(lesson.boundary);
    evidence(lesson.recap);
    field(lesson.reflection.prompt); evidence(lesson.reflection);
    const defaultParts = [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap];
    const readerStrings = [lesson.title, lesson.question, ...lesson.objectives, lesson.scopeLimit, lesson.reflection.prompt,
      lesson.reflection.answer, ...lesson.sections.flatMap(part => [part.label, part.text]),
      ...(lesson.boundary ? [lesson.boundary.label, lesson.boundary.text] : []), lesson.recap.label, lesson.recap.text];
    for (const text of readerStrings) assert.doesNotMatch(text, /单元|本组|待开放|待后续/, 'reader-facing process language ' + lesson.id);
    const chars = defaultParts.reduce((sum, part) => sum + part.text.length, 0);
    assert.ok(chars <= 600, 'lesson exceeds lightweight reading budget ' + lesson.id);
    assert.notEqual(lesson.reflection.answer, lesson.recap.text, 'reflection copied recap ' + lesson.id);
    assert.doesNotMatch(lesson.reflection.answer, /下一单元|下一节|本组|本路线|读完后|到这里|可以停下/, 'reflection contains route process language ' + lesson.id);
    assert.equal(lesson.recap.label, '本节结论', 'unclear recap role ' + lesson.id);
    assert.doesNotMatch(lesson.recap.text, /下一(?:节|小节|主题|组|步)|接着|后续可|读完|到这里|自然结束|可以结束|可停下|可收束|本路线已|本路线到/, 'recap contains navigation language ' + lesson.id);
    assert.doesNotMatch(lesson.scopeLimit, /下一单元|本组|每单元|待开放/, 'scope contains internal or stale language ' + lesson.id);
    assert.doesNotMatch(lesson.transition, /下一单元|本组|小单元|待开放|可以停下/, 'transition contains internal or stale language ' + lesson.id);
    sizes.push(chars);
  }

  // Editorial acceptance contract: these core claims must be explained by default,
  // with the corresponding source, rather than mentioned only in optional answers.
  const defaultClaims = [
    ['FOUND-01', 1, 2, ['坚持和发展中国特色社会主义']],
    ['FOUND-01', 1, 4, ['道路自信、理论自信、制度自信、文化自信']],
    ['FOUND-02', 1, 11, ['美好生活需要', '不平衡不充分的发展']],
    ['FOUND-02', 1, 12, ['社会主义初级阶段', '世界最大发展中国家']],
    ['FOUND-03', 2, 2, ['马克思主义基本原理', '中国具体实际', '中华优秀传统文化']],
    ['MOD-01', 4, 8, ['国家富强、民族振兴、人民幸福']],
    ['MOD-01', 4, 14, ['2035年', '本世纪中叶', '基本实现社会主义现代化', '富强民主文明和谐美丽']],
    ...['人口规模巨大', '全体人民共同富裕', '物质文明和精神文明相协调', '人与自然和谐共生', '走和平发展道路'].map((text, i) => ['MOD-02', 4, 19 + i, [text]]),
    ['MOD-03', 4, 24, ['坚持中国共产党领导', '坚持中国特色社会主义', '实现高质量发展', '发展全过程人民民主', '丰富人民精神世界', '实现全体人民共同富裕', '促进人与自然和谐共生', '推动构建人类命运共同体', '创造人类文明新形态']],
    ...['坚持和加强党的全面领导', '坚持中国特色社会主义道路', '坚持以人民为中心的发展思想', '坚持深化改革开放', '坚持发扬斗争精神'].map((text, i) => ['MOD-03', 4, 27 + i, [text]]),
  ];
  let defaultClaimCount = 0;
  // Historical P1 inputs remain valid; expanded P4 artifacts must carry both groups.
  if (samples.stage.startsWith('P4-')) {
    assert.ok(samples.groups.some(group => group.id === 'foundation'));
    assert.ok(samples.groups.some(group => group.id === 'modernization'));
    for (const [lessonId, unit, block, claims] of defaultClaims) {
      const lesson = lessons.get(lessonId);
      assert.ok(lesson, 'missing expanded lesson ' + lessonId);
      const sourceId = `block:politics-toc-v2-u${String(unit).padStart(3, '0')}:b${String(block).padStart(3, '0')}`;
      for (const claim of claims) {
        assert.ok(lesson.sections.some(part => part.text.includes(claim) && part.sourceBlockIds.includes(sourceId)), 'missing default claim ' + lessonId + ': ' + claim);
        defaultClaimCount++;
      }
    }
  }

  if (['P4-batch2', 'P4-complete-bounded'].includes(samples.stage)) {
    const framework = samples.groups.find(group => group.id === 'framework');
    assert.ok(framework && framework.lessonIds.length === (inventory.gaps.length ? 5 : 8), 'missing framework continuity');
    const fourteen = ['坚持党对一切工作的领导', '坚持以人民为中心', '坚持全面深化改革', '坚持新发展理念', '坚持人民当家作主', '坚持全面依法治国', '坚持社会主义核心价值体系', '坚持在发展中保障和改善民生', '坚持人与自然和谐共生', '坚持总体国家安全观', '坚持党对人民军队的绝对领导', '坚持“一国两制”和推进祖国统一', '坚持推动构建人类命运共同体', '坚持全面从严治党'];
    const six = ['必须坚持人民至上', '必须坚持自信自立', '必须坚持守正创新', '必须坚持问题导向', '必须坚持系统观念', '必须坚持胸怀天下'];
    const claims = [
      ['SYS-01', 'b004', ['十个明确', '主体内容']],
      ['SYS-01', 'b015', ['十四个坚持', '基本方略']],
      ['SYS-01', 'b017', ['十三个方面成就', '理论与实践成果']],
      ['SYS-01', 'b018', ['六个必须坚持', '世界观、方法论']],
      ['SYS-02', 'b016', fourteen.slice(0, 7)],
      ['SYS-03', 'b016', fourteen.slice(7)],
      ['SYS-04', 'b018', six.slice(0, 3)],
      ['SYS-05', 'b018', six.slice(3)],
      ['SYS-04', 'b019', ['根本价值立场', '客观规律性和主观能动性', '继承与发展']],
      ['SYS-05', 'b019', ['矛盾的普遍性和客观性', '普遍联系', '人类进步和解放']],
    ];
    for (const [lessonId, block, phrases] of claims) {
      const lesson = lessons.get(lessonId);
      assert.ok(lesson && framework.lessonIds.includes(lessonId), 'missing framework lesson');
      for (const phrase of phrases) {
        assert.ok(lesson.sections.some(part => part.text.includes(phrase) && part.sourceBlockIds.includes('block:politics-toc-v2-u003:' + block)), 'missing framework default claim ' + phrase);
        defaultClaimCount++;
      }
    }
    // This source gap remains visible before optional references are expanded.
    if (inventory.gaps.length) assert.ok(lessons.get('SYS-01').scopeLimit.includes('不展开十三个方面成就的完整清单'), 'hidden achievements source gap');
    else assert.deepEqual(['SYS-06','SYS-07','SYS-08'].flatMap(id => lessons.get(id).achievementOrdinals), Array.from({length:13}, (_,i)=>i+1), 'incomplete thirteen achievements');
  }

  let promisedCoreClaims = 0;
  if (samples.stage === 'P4-complete-bounded') {
    const previousGroups = new Set(['foundation', 'ten', 'framework', 'modernization', 'development', 'value']);
    for (const lesson of samples.lessons.filter(lesson => !previousGroups.has(lesson.groupId))) {
      assert.ok(lesson.corePromises?.length >= 2, 'missing authored core promises');
      for (const promise of lesson.corePromises) {
        field(promise.quote);
        assert.ok(promise.sourceBlockIds?.length);
        assert.ok(lesson.sections.some(part => part.text.includes(promise.quote) && promise.sourceBlockIds.every(id => part.sourceBlockIds.includes(id))), 'core promise moved outside default explanation');
        promisedCoreClaims++;
      }
    }
    assert.deepEqual(samples.routes.map(route => route.id), ['thought', 'principles']);
    const assigned = new Set(), positions = new Map();
    for (const route of samples.routes) {
      field(route.scope); field(route.summary);
      const routeLessons = route.groupIds.flatMap(id => {
        const group = samples.groups.find(group => group.id === id);
        assert.ok(group && group.routeId === route.id && !assigned.has(id), 'invalid route group ownership');
        assigned.add(id); return group.lessonIds;
      });
      routeLessons.forEach((id, index) => {
        const lesson = lessons.get(id);
        assert.ok(lesson.primaryUnitIds?.length, 'missing explicit primary source ownership');
        for (const unitId of lesson.primaryUnitIds) {
          assert.ok(lesson.sections.some(part => part.sourceBlockIds.some(blockId => blockId.split(':')[1] === unitId)), 'primary goal only in optional content');
          if (!positions.has(unitId)) positions.set(unitId, {route:route.id,index});
        }
      });
    }
    assert.equal(assigned.size, samples.groups.length, 'unrouted group');
    assert.deepEqual([...new Set(samples.groups.map(group => group.topicId))].sort(), ['A1','A2','A3','A4','A5','A6','A7','A8','A9','B1','B2','B3','B4','B5']);
    for (const unit of pkg.knowledgeUnits) assert.ok(positions.has(unit.id), 'missing primary teaching goal ' + unit.id);
    for (const relation of pkg.relations.filter(relation => relation.type === 'prerequisite')) {
      const from = positions.get(relation.sourcePointId), before = positions.get(relation.targetPointId);
      assert.ok(from.route === before.route && before.index <= from.index, 'formal prerequisite order reversed ' + relation.id);
    }
    assert.equal(inventory.teachingCoverage.allSourceDetailsTaught, false);
    assert.equal(inventory.teachingCoverage.completeExamScope, false);
    for (const row of inventory.units) {
      assert.deepEqual(row.primaryLessonIds, samples.lessons.filter(lesson => lesson.primaryUnitIds.includes(row.unitId)).map(lesson=>lesson.id), 'inventory primary ownership drift');
      assert.deepEqual(row.defaultReferencingLessonIds, samples.lessons.filter(lesson => lesson.sections.some(part => part.sourceBlockIds.some(id=>id.split(':')[1]===row.unitId))).map(lesson=>lesson.id), 'inventory reference membership drift');
    }
    for (const row of inventory.units) for (const item of row.sourceBlocks) {
      const inDefault = samples.lessons.some(lesson => [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap]
        .some(part => part.sourceBlockIds.includes(item.blockId)));
      const disposition = inDefault ? 'default-reference' : item.sampleLessonIds.length ? 'optional-reference' : 'source-only';
      assert.equal(item.teachingDisposition, disposition, 'false teaching disposition');
    }
  }

  const grouped = new Set();
  for (const group of samples.groups) {
    assert.ok(group.lessonIds.length > 1, 'not a continuous sample');
    field(group.connectionToNext);
    assert.equal(new Set(group.lessonIds.map(id => lessons.get(id).scopeLimit)).size, group.lessonIds.length, 'group reused lesson scope ' + group.id);
    group.lessonIds.forEach((id, index) => {
      const lesson = lessons.get(id);
      assert.ok(lesson && lesson.groupId === group.id, 'missing or foreign lesson');
      assert.ok(!grouped.has(id), 'lesson in multiple groups');
      grouped.add(id);
      assert.equal(lesson.previousLessonId, group.lessonIds[index - 1] || null);
      assert.equal(lesson.nextLessonId, group.lessonIds[index + 1] || null, 'broken lesson continuity');
      field(lesson.transition);
      if (lesson.nextLessonId) assert.equal(lesson.transition, '下一节：' + lessons.get(lesson.nextLessonId).title, 'wrong next lesson transition ' + lesson.id);
    });
    if (group.enumeration) {
      const items = group.lessonIds.flatMap(id => lessons.get(id).enumerationItems || []);
      assert.equal(items.length, group.enumeration.count, 'missing enumeration item');
      assert.deepEqual(items.map(item => item.ordinal).sort((a, b) => a - b), Array.from({ length: group.enumeration.count }, (_, i) => i + 1));
      for (const item of items) {
        assert.equal(item.groupId, group.enumeration.id);
        assert.equal(item.sourceBlockId, `block:politics-toc-v2-u003:b${String(item.ordinal + 4).padStart(3, '0')}`);
        assert.ok(group.lessonIds.some(id => lessons.get(id).sections.some(part => part.sourceBlockIds.includes(item.sourceBlockId))), 'enumeration only in optional or recap content');
      }
    }
  }
  assert.equal(grouped.size, lessons.size, 'ungrouped lesson');
  for (const route of samples.routes) {
    field(route.conclusion?.title); field(route.conclusion?.summary); field(route.conclusion?.boundary);
    route.groupIds.forEach((groupId, index) => {
      const group = samples.groups.find(item => item.id === groupId);
      const last = lessons.get(group.lessonIds[group.lessonIds.length - 1]);
      const next = samples.groups.find(item => item.id === route.groupIds[index + 1]);
      assert.equal(last.transition, next ? '下一主题：' + next.title : '本篇收束：' + route.conclusion.title, 'wrong theme transition ' + groupId);
    });
  }
  assert.equal(usedBindings.size, bindings.size, 'unused source binding');
  for (const row of inventory.units) for (const item of row.sourceBlocks) {
    const actual = samples.lessons.filter(lesson => [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap, lesson.reflection]
      .some(part => part.sourceBlockIds.includes(item.blockId))).map(lesson => lesson.id);
    assert.deepEqual(item.sampleLessonIds, actual, 'false sample coverage ' + item.blockId);
  }
  return { status: 'passed', stage: samples.stage + '-draft-only', inventoryUnits: rows.size, sampleGroups: samples.groups.length,
    sampleLessons: lessons.size, exactSourceBindings: bindings.size, requiredDefaultClaims: defaultClaimCount, authoredCorePromises: promisedCoreClaims, defaultChars: { min: Math.min(...sizes), max: Math.max(...sizes) },
    remainingSourceGaps: inventory.gaps.length, directReflectionAnswers: lessons.size, lessonSpecificScopes: lessons.size,
    themeConnections: samples.groups.length, routeConclusions: samples.routes.length,
    contentApproved: false, userExperienceAccepted: false, runtimeIntegrationAssessed: false };
}

function main() {
  const samples = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'systematic-learning-v2-samples.json'), 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'systematic-learning-v2-content-inventory.json'), 'utf8'));
  const result = validate(samples, inventory);
  const readingFile = path.join(root, 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md');
  const reading = fs.readFileSync(readingFile, 'utf8').replace(/\*\*/g, '');
  for (const lesson of samples.lessons) {
    assert.ok(reading.includes(lesson.title), 'reading draft missing lesson');
    for (const part of [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap]) {
      assert.ok(reading.includes(part.text), 'reading draft differs from source artifact');
    }
    assert.ok(reading.includes(lesson.reflection.prompt) && reading.includes(lesson.reflection.answer), 'reading draft missing optional reflection');
  }
  const rejects = [
    ['source drift', (s, i, p) => { p.knowledgeUnits[0].blocks[1].fallbackText += '漂移'; }],
    ['missing ten item', s => { s.lessons[0].enumerationItems.pop(); }],
    ['invalid optional boundary', s => {
      const lesson = s.lessons.find(item => item.boundary);
      assert.ok(lesson, 'fixture requires at least one optional boundary');
      lesson.boundary.sourceBlockIds = [];
    }],
    ['broken continuity', s => { s.lessons[0].nextLessonId = 'UNKNOWN'; }],
    ['invalid emphasis', s => { s.lessons[0].sections[0].emphasis = [{ quote: '不存在的重点', part: 'text', occurrence: 1, role: 'key' }]; }],
    ['missing evidence', s => { s.lessons[0].sections[0].sourceBlockIds = []; }],
    ['false coverage', (s, i) => { i.units[0].sourceBlocks[0].sampleLessonIds.push('TEN-01'); }],
    ['missing inventory unit', (s, i) => { i.units.pop(); }],
    ['P4 claim only in optional content', s => {
      const lesson = s.lessons.find(item => item.id === 'MOD-03');
      for (const part of lesson.sections) { part.text = part.text.replaceAll('创造人类文明新形态', '这一结果'); part.emphasis = []; }
      lesson.reflection.answer += '创造人类文明新形态';
    }],
    ['P4 source detached from claim', s => {
      const lesson = s.lessons.find(item => item.id === 'MOD-02');
      for (const part of lesson.sections.filter(item => item.text.includes('全体人民共同富裕'))) {
        part.sourceBlockIds = part.sourceBlockIds.filter(id => id !== 'block:politics-toc-v2-u004:b020');
      }
    }],
  ];
  if (['P4-batch2', 'P4-complete-bounded'].includes(samples.stage)) rejects.push(
    ['fourteen item optional only', s => {
      const lesson = s.lessons.find(item => item.id === 'SYS-03');
      for (const part of lesson.sections) { part.text = part.text.replaceAll('坚持总体国家安全观', '相关安全要求'); part.emphasis = []; }
      lesson.reflection.answer += '坚持总体国家安全观';
    }],
    ['six item optional only', s => {
      const lesson = s.lessons.find(item => item.id === 'SYS-05');
      for (const part of lesson.sections) { part.text = part.text.replaceAll('必须坚持胸怀天下', '保持广阔视野'); part.emphasis = []; }
      lesson.reflection.answer += '必须坚持胸怀天下';
    }],
    ['achievements missing from default body', s => {
      const lesson = s.lessons.find(item => item.id === 'SYS-06');
      if (lesson) lesson.sections = [];
      else s.lessons.find(item => item.id === 'SYS-01').scopeLimit = '包含完整内容';
    }],
  );
  if (samples.stage === 'P4-complete-bounded') rejects.push(
    ['core promise optional only', s => { s.lessons.find(item => item.id === 'HISTORY-04').corePromises[0].quote = '仅在参考的必要解释'; }],
    ['formal prerequisite reversed', s => { const route = s.routes[1]; [route.groupIds[0],route.groupIds[1]]=[route.groupIds[1],route.groupIds[0]]; }],
    ['cross route ownership', s => { s.routes[0].groupIds.push('basics'); }],
    ['false complete syllabus claim', (s,i) => { i.teachingCoverage.completeExamScope = true; }],
    ['false source disposition', (s,i) => { i.units[0].sourceBlocks[0].teachingDisposition = 'default-reference'; }],
    ['reflection copies recap', s => { const lesson=s.lessons.find(item=>item.id==='LEADERSHIP-01');lesson.reflection.answer=lesson.recap.text; }],
    ['recap performs navigation', s => { s.lessons.find(item=>item.id==='LEADERSHIP-01').recap.text+=' 下一节继续学习。'; }],
    ['group scope reused', s => { const group=s.groups.find(item=>item.id==='leadership');s.lessons.find(item=>item.id===group.lessonIds[1]).scopeLimit=s.lessons.find(item=>item.id===group.lessonIds[0]).scopeLimit; }],
    ['stale transition language', s => { s.lessons.find(item=>item.id==='VALUE-03').transition='本组到这里结束，后续待开放。'; }],
    ['wrong next theme', s => { s.lessons.find(item=>item.id==='MOD-03').transition='下一主题：高质量发展'; }],
    ['missing theme connection', s => { delete s.groups.find(item=>item.id==='modernization').connectionToNext; }],
    ['missing route conclusion', s => { delete s.routes[0].conclusion; }],
  );
  for (const [name, mutate] of rejects) {
    const s = clone(samples), i = clone(inventory), p = clone(knowledgePackage);
    mutate(s, i, p);
    assert.throws(() => validate(s, i, p), undefined, name + ' was not rejected');
  }
  assert.throws(() => validate(samples, inventory, knowledgePackage, () => Buffer.from('changed Markdown')), /Markdown source drift/);
  result.negativeCasesRejected = rejects.length + 1;
  console.log(JSON.stringify(result));
}

if (require.main === module) main();
module.exports = { validate };
