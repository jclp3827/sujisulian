#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { buildLessonReviewPaths } = require('./lib/politics-systematic-review-paths');

const root = path.resolve(__dirname, '..');
const sourcePath = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const runtimePath = 'miniprogram/models/politics-systematic-units-runtime.js';
const projectionPath = 'miniprogram/services/knowledge-platform/systematic-units.js';
const governancePath = 'docs/knowledge-platform/implementations/politics-systematic-user-comprehension-governance-20261023.md';
const outputPath = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-retrospective-audit-20261024.json';
const evidenceDir = path.join(root, 'docs/knowledge-platform/implementations/evidence');
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const source = readJson(sourcePath);
delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
delete require.cache[require.resolve('../miniprogram/services/knowledge-platform/systematic-units')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');

const batchPattern = /^politics-systematic-user-comprehension-uc7b-p(?:0|1|1r1|2|2r1|2r2|2r3|3|4|4r1|5|5r1|6|6r1|7|8|9|10|10r1|11)-2026102[34]\.json$/;
const historicalEvidenceFiles = fs.readdirSync(evidenceDir).filter(name => batchPattern.test(name)).sort();
const historicallyChangedLessonIds = [...new Set(historicalEvidenceFiles.flatMap(name => {
  const evidence = JSON.parse(fs.readFileSync(path.join(evidenceDir, name), 'utf8'));
  return evidence.contentChangedLessonIds || [];
}))].sort();
const currentBoundaryLessonIds = source.lessons.filter(lesson => lesson.boundary).map(lesson => lesson.id);
const sectionEmphasisGaps = source.lessons.flatMap(lesson => lesson.sections
  .map((section, index) => ({ lessonId: lesson.id, sectionIndex: index, label: section.label }))
  .filter((_, index) => !(lesson.sections[index].emphasis || []).length));
const displayTitles = Object.fromEntries(source.lessons.map(lesson => [
  lesson.id,
  projection.displayTitleForLessonId(lesson.id),
]));
const acceptanceReviewPaths = buildLessonReviewPaths(source, projection.displayTitleForLessonId);
const groupMatrices = source.groups.map(group => ({
  groupId: group.id,
  groupTitle: group.title,
  lessons: group.lessonIds.map(id => {
    const lesson = source.lessons.find(item => item.id === id);
    return {
      lessonId: id,
      sourceTitle: lesson.title,
      displayTitle: displayTitles[id],
      question: lesson.question,
      sectionLabels: lesson.sections.map(section => section.label),
    };
  }),
}));
const tenMatrix = groupMatrices.find(group => group.lessons.some(lesson => lesson.lessonId === 'TEN-01'));

const result = {
  schemaVersion: 1,
  auditId: 'politics-systematic-user-comprehension-retrospective-audit-20261024',
  generatedAt: '2026-10-24',
  status: 'risk-open',
  curriculumVersion: runtime.curriculumVersion,
  sourcePath,
  sourceSha256: digest(sourcePath),
  runtimePath,
  runtimeSha256: digest(runtimePath),
  projectionPath,
  projectionSha256: digest(projectionPath),
  governancePath,
  governanceSha256: digest(governancePath),
  retainedValidEvidence: ['facts', 'source-bindings', 'stable-lesson-identities', 'progress-compatibility'],
  reopenedClaims: ['first-user-expression-pass', 'group-naming-consistency-pass', 'key-point-salience-pass'],
  scope: {
    totalLessonCount: source.lessons.length,
    totalGroupCount: source.groups.length,
    historicallyChangedLessonCount: historicallyChangedLessonIds.length,
    historicallyChangedLessonIds,
    historicalBaselineFrozenThroughBatch: 'P11',
    currentFollowupLessonIds: ["TEN-01","TEN-02","TEN-03","TEN-04","VALUE-01","VALUE-03","DEV-02","DEV-03","DEV-05","DEV-06","DEV-07","FOUND-02","MOD-01","MOD-02","SYS-01","SYS-02","SYS-03","SYS-04","SYS-05","LEADERSHIP-01","LEADERSHIP-03","LIVELIHOOD-01","LIVELIHOOD-02","SUPPORT-01","SUPPORT-02","DEMOCRACY-01","DEMOCRACY-02","DEMOCRACY-03","REFORMLAW-03","CULTUREECO-01","CULTUREECO-02","CULTUREECO-03","CULTUREECO-04","PARTY-01","PARTY-02","PARTY-03","SECURITY-01","SECURITY-02","UNITYFOREIGN-01","UNITYFOREIGN-02","UNITYFOREIGN-03","BASICS-04","HISTORY-04","MONEY-01","MONEY-02","CAPITAL-01","CAPITAL-02"],
    currentFollowupAcceptance: 'pending-user-sampling',
    currentBoundaryLessonCount: currentBoundaryLessonIds.length,
    currentBoundaryLessonIds,
    displayTitleAuditLessonCount: source.lessons.length,
    runtimeVisualAuditLessonCount: source.lessons.length,
    sectionEmphasisGapCount: sectionEmphasisGaps.length,
  },
  metaReview: {
    status: 'risk',
    consensus: '旧链路按单页和改动字段验证，未覆盖最终投影、同页标题平行、同组节奏、辨析融合反事实与实际扫读重点。',
    priorPassUse: '旧AI通过仅保留为当时窄范围历史证据，不再证明当前用户表达和视觉重点。',
    retainedHoldLessonIds: ['CAPITAL-02'],
  },
  rulesActivated: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  acceptanceReporting: {
    required: true,
    format: '<篇章>-<主题>-<小节>',
    sourceOfTruth: 'route.title + group.title + projection.displayTitleForLessonId',
    paths: acceptanceReviewPaths,
  },
  immediateCorrections: {
    fixedInP6R1: [
      {
        lessonId: 'VALUE-01',
        action: '把同一商品所有者不可兼得的条件并入使用价值与价值关系正文、结论和答案，删除独立辨析。',
      },
      {
        lessonId: 'FOUND-03',
        action: '核心设问改为分别是什么；两个结合采用完整知识名称加括号序号的平行标题。',
      },
      {
        lessonIds: ['TEN-01', 'TEN-02', 'TEN-03', 'TEN-04'],
        action: '最终展示标题统一为内容名称在前、序号范围在后的格式。',
      },
    ],
    fixedInP7: [
      {
        lessonIds: ['VALUE-03', 'DEV-03', 'DEV-07', 'LIVELIHOOD-02', 'SUPPORT-02'],
        action: '完成首批辨析融合反事实、主题末节结论责任收窄、平行标题和评分点视觉映射回审。',
      },
    ],
    fixedInP8: [
      {
        lessonIds: ['DEMOCRACY-03', 'CULTUREECO-04', 'PARTY-03', 'UNITYFOREIGN-03', 'MONEY-02'],
        action: '完成第二批主题末节回审：必要限定并入正文、独立辨析删除、本节结论直接回答设问、并列对象平行展开、评分点逐项映射到正文重点。',
      },
    ],
    fixedInP9: [
      {
        lessonIds: ['DEV-02', 'DEV-05', 'DEV-06', 'MOD-02', 'SYS-01'],
        action: '完成第三批辨析融合反事实：删除五个默认辨析，改用直接设问、逐项平行正文、完整自测映射和评分点视觉重点。',
      },
    ],
    fixedInP10AndP10R1: [
      {
        lessonIds: ['TEN-01', 'MOD-02'],
        action: '建立正文、辨析、本节结论和答案的区域职责规则，并修复首批两页重复。',
      },
      {
        lessonIds: [
          'BASICS-01', 'BASICS-04', 'CULTUREECO-04', 'DEV-02', 'DEV-06',
          'LEADERSHIP-03', 'MONEY-02', 'REFORMLAW-03', 'SYS-01', 'TEN-02', 'TEN-04',
        ],
        action: '清零历史已验收范围内剩余区域职责风险：结论改为组织性压缩，重复辨析删除，必要误解条件收窄为单点归属。',
      },
    ],
    tenDisplayTitleMatrix: tenMatrix?.lessons.map(lesson => ({
      lessonId: lesson.lessonId,
      displayTitle: lesson.displayTitle,
    })) || [],
  },
  gates: [
    { id: 'G0', name: '精确审查包', scope: '作者源、运行模型、展示投影、规则及实际页面证据绑定同一版本。' },
    { id: 'G1', name: '评分点覆盖', scope: '题目、正文、结论和答案覆盖同一对象、数量、关系与条件。' },
    { id: 'G2', name: '整页语义', scope: '按真实显示顺序检查对象、关系、结论、辨析融合反事实和同页标题平行。' },
    { id: 'G3', name: '兄弟章节', scope: '21个主题、72个最终展示标题并排检查唯一命名策略。' },
    { id: 'G4', name: '主题路线', scope: '检查跨节重复遗漏、关系顺序、正式体系归属及主题末节结论责任。' },
    { id: 'G5', name: '运行投影', scope: '核对实际DOM文字、顺序、组件类型与审查包一致。' },
    { id: 'G6', name: '视觉重点', scope: '检查正文评分点锚点、标题层级、折行和三秒扫读；长页增加320px及大字号。' },
    { id: 'G7', name: '分歧与真人验收', scope: '任一角色风险不得以多数票抵消；保留失败、修订和复测记录。' },
    { id: 'G8', name: '验收路径', scope: '每个验收对象使用当前运行版的“篇章-主题-小节”路径，禁止只给lessonId或孤立标题。' },
    { id: 'G9', name: '区域职责与语义重复', scope: '正文、辨析、结论和答案逐区检查单点归属、组织增量及跨区近义重复。' },
  ],
  prioritizedReviewQueues: {
    boundaryCounterfactual: currentBoundaryLessonIds,
    historicalWholePageRegression: historicallyChangedLessonIds,
    groupNamingMatrix: source.groups.map(group => group.id),
    emphasisMappingPriority: [
      'VALUE-01', 'COGNITION-01', 'COGNITION-03', 'DEV-01',
      'SECURITY-03', 'HISTORY-04', 'BASICS-01', 'DEV-06', 'DIALECTICS-01',
    ],
    themeEndingConclusionPriority: ['CAPITAL-02'],
    fixedRegressionFixtures: ['DEV-01', 'COGNITION-01', 'HISTORY-01', 'MONEY-01'],
  },
  machineSignals: {
    sectionEmphasisGaps,
    note: '机器信号只用于召回，不把无强调自动判错，也不把存在强调自动判为视觉通过。',
  },
  groupMatrices,
  historicalEvidenceFiles,
  nextAction: `历史改动${historicallyChangedLessonIds.length}节的区域职责与语义重复切片已闭环；继续按其他开放切片完成${currentBoundaryLessonIds.length}节辨析反事实和72节运行视觉检查。`,
  releaseAuthorized: false,
};

fs.writeFileSync(path.join(root, outputPath), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({
  status: result.status,
  curriculumVersion: result.curriculumVersion,
  historicallyChangedLessonCount: result.scope.historicallyChangedLessonCount,
  currentBoundaryLessonCount: result.scope.currentBoundaryLessonCount,
  totalGroupCount: result.scope.totalGroupCount,
  totalLessonCount: result.scope.totalLessonCount,
  sectionEmphasisGapCount: result.scope.sectionEmphasisGapCount,
}));
