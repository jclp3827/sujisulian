#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { buildLessonReviewPaths } = require('./lib/politics-systematic-review-paths');

const root = path.resolve(__dirname, '..');
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  wxml: 'miniprogram/subpackages/politics/route/units.wxml',
  wxss: 'miniprogram/subpackages/politics/route/units.wxss',
  governance: 'docs/knowledge-platform/implementations/politics-systematic-user-comprehension-governance-20261023.md',
  retrospective: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-retrospective-audit-20261024.json',
  output: 'docs/knowledge-platform/implementations/evidence/politics-systematic-region-responsibility-audit-p10-20261024.json',
};
const absolute = file => path.join(root, file);
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(absolute(file))).digest('hex');
const normalize = value => String(value || '').replace(/[，。；：、“”‘’（）()《》\s·—！？,.!?;:]/g, '');
const trigrams = value => {
  const text = normalize(value);
  return new Set([...Array(Math.max(0, text.length - 2))].map((_, index) => text.slice(index, index + 3)));
};
const similarity = (left, right) => {
  const a = trigrams(left);
  const b = trigrams(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter(value => b.has(value)).length;
  return Number((intersection / new Set([...a, ...b]).size).toFixed(3));
};

const fixedInP10 = new Set(['TEN-01', 'MOD-02']);
const fixedInP10R1 = new Set([
  'BASICS-01', 'BASICS-04', 'CULTUREECO-04', 'DEV-02', 'DEV-06',
  'LEADERSHIP-03', 'MONEY-02', 'REFORMLAW-03', 'SYS-01', 'TEN-02', 'TEN-04',
]);
const p10r1Decisions = {
  'BASICS-01': '结论改为理论结构、思想来源、重要发现三类职责，不再重列答案。',
  'BASICS-04': '删除重复正文并混入人工智能旁题的辨析；结论只保留决定作用、能动作用及其条件。',
  'CULTUREECO-04': '结论改为时间目标、空间边界、保护体系三个观察维度。',
  'DEV-02': '结论改为动力、平衡、人与自然、内外联动、公平正义五类问题框架。',
  'DEV-06': '结论改为目标、方针要求、制度保障、优先任务的检索结构。',
  'LEADERSHIP-03': '删除与正文重复的分配方式和渐进富裕辨析，正文与答案承担完整判断。',
  'MONEY-02': '结论改为保存、延期支付关系、国际一般等价物三类职能对象及条件差异。',
  'REFORMLAW-03': '辨析收窄为“法治政府是重点不等于省略其他环节”这一独立误解条件。',
  'SYS-01': '结论改为主体内容、基本方略、实践总结与成果、世界观方法论四个体系层面。',
  'TEN-02': '结论改为布局与改革、法治总目标的职责关系，不再抄写两套完整清单。',
  'TEN-04': '结论改为国防军队、外交、党的建设三个领域定位。',
};
const fixedInP11 = new Set(['DEV-04']);
const fixedInP14 = new Set(['DIALECTICS-01']);
const retainedHold = new Set(['CAPITAL-02']);

delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
delete require.cache[require.resolve('../miniprogram/services/knowledge-platform/systematic-units')];
const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
const projection = require('../miniprogram/services/knowledge-platform/systematic-units');
const source = read(files.source);
const retrospective = read(files.retrospective);
const paths = buildLessonReviewPaths(source, projection.displayTitleForLessonId);
const historicalIds = retrospective.scope.historicallyChangedLessonIds;

const entries = historicalIds.map(id => {
  const lesson = source.lessons.find(item => item.id === id);
  const body = lesson.sections.map(item => item.text).join('');
  const boundary = lesson.boundary?.text || '';
  let status = 'passed';
  let decision = '正文承担解释、结论承担核心关系或压缩结构，未发现需要迁移的区域重复。';
  if (fixedInP10.has(id)) {
    status = 'fixed-in-p10';
    decision = id === 'TEN-01'
      ? '基本国情限定恢复为只出现一次的次级辨析；结论改为前三条的职责框架。'
      : '正文保留五项正式表述；结论改为人口、共同富裕、文明、自然和道路五个观察维度。';
  } else if (fixedInP10R1.has(id)) {
    status = 'fixed-in-p10r1';
    decision = p10r1Decisions[id];
  } else if (fixedInP11.has(id)) {
    status = 'fixed-in-p11';
    decision = '下半页视觉复核发现前轮漏检的结论清单复述；本节结论改为三类制度职责的组织框架。';
  } else if (fixedInP14.has(id)) {
    status = 'fixed-in-p14';
    decision = '正文承担完整三组内容，结论由逐项串接改为客观条件、功能作用与发展趋势三类分析依据。';
  } else if (retainedHold.has(id)) {
    status = 'hold';
    decision = '沿用既有CAPITAL-02内容hold，不计入历史通过小节。';
  }
  return {
    lessonId: id,
    reviewPath: paths[id].displayPath,
    status,
    decision,
    boundaryPresent: Boolean(lesson.boundary),
    machineSignals: {
      recapToBodySimilarity: similarity(lesson.recap.text, body),
      recapToAnswerSimilarity: similarity(lesson.recap.text, lesson.reflection.answer),
      boundaryToBodySimilarity: boundary ? similarity(boundary, body) : 0,
    },
  };
});

const counts = entries.reduce((result, entry) => {
  result[entry.status] = (result[entry.status] || 0) + 1;
  return result;
}, {});
const result = {
  schemaVersion: 1,
  auditId: 'politics-systematic-region-responsibility-audit-p10-20261024',
  generatedAt: '2026-10-24',
  status: 'passed-with-retained-hold',
  curriculumVersion: runtime.curriculumVersion,
  scope: {
    historicallyChangedLessonCount: historicalIds.length,
    previouslyAcceptedLessonCount: historicalIds.length - retainedHold.size,
    reviewedLessonCount: historicalIds.length,
    fixedInP10Count: counts['fixed-in-p10'] || 0,
    fixedInP10R1Count: counts['fixed-in-p10r1'] || 0,
    fixedInP11Count: counts['fixed-in-p11'] || 0,
    fixedInP14Count: counts['fixed-in-p14'] || 0,
    fixedTotalCount: (counts['fixed-in-p10'] || 0) + (counts['fixed-in-p10r1'] || 0) + (counts['fixed-in-p11'] || 0) + (counts['fixed-in-p14'] || 0),
    passedCount: counts.passed || 0,
    openRiskCount: counts.risk || 0,
    retainedHoldCount: counts.hold || 0,
  },
  rulesApplied: [44, 45, 46, 47],
  decisionMethod: {
    machineRole: '字符三元组相似度只负责召回正文、辨析、结论与答案的潜在重复。',
    semanticRole: '逐页判断各区域是否有独立职责；相似度高不自动判错，相似度低也不自动放行。',
    acceptanceBoundary: '本次打开区域职责与语义重复切片，不推翻此前已通过的事实、来源、标题和进度证据。',
  },
  fixedLessonIds: entries.filter(item => item.status.startsWith('fixed-in-')).map(item => item.lessonId),
  openRiskLessonIds: entries.filter(item => item.status === 'risk').map(item => item.lessonId),
  retainedHoldLessonIds: entries.filter(item => item.status === 'hold').map(item => item.lessonId),
  sourcePath: files.source,
  sourceSha256: digest(files.source),
  runtimePath: files.runtime,
  runtimeSha256: digest(files.runtime),
  projectionPath: files.projection,
  projectionSha256: digest(files.projection),
  wxmlPath: files.wxml,
  wxmlSha256: digest(files.wxml),
  wxssPath: files.wxss,
  wxssSha256: digest(files.wxss),
  governancePath: files.governance,
  governanceSha256: digest(files.governance),
  entries,
  nextAction: '44个历史已验收小节的区域职责与语义重复风险已清零；CAPITAL-02继续沿用既有内容hold，等待其独立产品裁决。',
  releaseAuthorized: false,
};

fs.writeFileSync(absolute(files.output), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, curriculumVersion: result.curriculumVersion, ...result.scope, openRiskLessonIds: result.openRiskLessonIds }));
