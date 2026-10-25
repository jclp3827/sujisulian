#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AUDIT_DATE = '2026-10-21';
const RUNTIME_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';
const CURRICULUM_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';
const FINAL_REVIEW_PATH = 'docs/knowledge-pilot/political-final-review-evidence-20261004.json';
const AUTHORITY_CORRECTIONS_PATH = 'docs/knowledge-pilot/political-current-authority-corrections-20261003.json';
const OFFICIAL_SPOTCHECKS_PATH = 'docs/knowledge-pilot/political-official-spotchecks-20261003.json';

function absolute(relativePath) {
  return path.join(ROOT, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function sha256(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex');
}

function normalize(text = '') {
  return text.replace(/[\s，。！？；：、“”‘’（）《》·,.!?;:()]/g, '');
}

function grams(text) {
  const normalized = normalize(text);
  const result = new Set();
  for (let index = 0; index < normalized.length - 1; index += 1) result.add(normalized.slice(index, index + 2));
  return result;
}

function similarity(left, right) {
  const leftGrams = grams(left);
  const rightGrams = grams(right);
  let intersection = 0;
  for (const gram of leftGrams) if (rightGrams.has(gram)) intersection += 1;
  return intersection / Math.max(1, leftGrams.size + rightGrams.size - intersection);
}

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function lastUnitNumber(unitId) {
  const matched = String(unitId || '').match(/u(\d{3})$/);
  return matched ? Number(matched[1]) : null;
}

function regionForUnit(unitId) {
  const number = lastUnitNumber(unitId);
  if (number === null) return 'unknown';
  return number <= 19 ? 'thought' : 'principles';
}

function unique(values) {
  return [...new Set(values)];
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function consumerEvidence() {
  const contracts = [
    {
      id: 'canonical-package',
      content: ['quick', 'exam', 'confusion'],
      file: 'miniprogram/services/knowledge-platform/politics-runtime.js',
      patterns: ['politics-p3-v2-runtime', 'createPoliticsAdapter', 'buildPackage()'],
      role: '唯一运行知识包入口',
    },
    {
      id: 'route-planning',
      content: ['quick', 'exam', 'confusion', 'systematic'],
      file: 'miniprogram/services/knowledge-platform/learning.js',
      patterns: ['knowledgePackage.quickPrimers', 'knowledgePackage.recallItems', 'knowledgePackage.contrastPairs', 'systematicUnits.planFor'],
      role: '四类路线计划、会话和投影',
    },
    {
      id: 'systematic-curriculum',
      content: ['systematic'],
      file: 'miniprogram/services/knowledge-platform/systematic-units.js',
      patterns: ['politics-systematic-units-runtime', 'curriculumVersion'],
      role: '72节候选课程唯一加载入口',
    },
    {
      id: 'shared-projections',
      content: ['quick', 'exam', 'confusion', 'systematic'],
      file: 'miniprogram/services/knowledge-platform/projectors.js',
      patterns: ['systematicUnits', 'recallItems', 'contrastPairs'],
      role: '首页、知识卡和路线的共享视图投影',
    },
    {
      id: 'guided-route-surface',
      content: ['quick', 'exam', 'confusion'],
      file: 'miniprogram/subpackages/politics/route/guided-route.js',
      patterns: ['politics-runtime', 'knowledgePackage'],
      role: '快速了解、考前速记和易混突破运行页面',
    },
    {
      id: 'systematic-unit-surface',
      content: ['systematic'],
      file: 'miniprogram/subpackages/politics/route/units.js',
      patterns: ['politics-runtime', 'knowledgePackage'],
      role: '小单元系统学习运行页面',
    },
  ];

  return contracts.map((contract) => {
    const source = read(contract.file);
    const missingPatterns = contract.patterns.filter((pattern) => !source.includes(pattern));
    return {
      ...contract,
      consumed: missingPatterns.length === 0,
      missingPatterns,
      sha256: sha256(contract.file),
    };
  });
}

function duplicateGroups(items, field) {
  const grouped = new Map();
  for (const item of items) {
    const key = normalize(item[field]);
    if (!key) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item.id || item.pointId || item.recallItemId);
  }
  return [...grouped.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([normalizedText, ids]) => ({ normalizedText, ids }));
}

function main() {
  const sourcePackage = require(absolute(RUNTIME_PATH));
  const curriculum = require(absolute(CURRICULUM_PATH));
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  const finalReview = readJson(FINAL_REVIEW_PATH);
  const authorityCorrections = readJson(AUTHORITY_CORRECTIONS_PATH);
  const officialSpotchecks = readJson(OFFICIAL_SPOTCHECKS_PATH);

  const quickPrimer = knowledgePackage.quickPrimers.find((item) => item.id === sourcePackage.module.routeDefaults.quick.primerId);
  assert(quickPrimer, 'default quick primer is missing from runtime package');

  const quickSections = quickPrimer.sections.map((section) => {
    const segments = section.narrativeSegments || [];
    return {
      id: section.id,
      title: section.title,
      segmentCount: segments.length,
      characterCount: segments.reduce((total, segment) => total + String(segment.text || '').length, 0),
      coverageUnitIds: unique(segments.flatMap((segment) => segment.coverageUnitIds || [])),
      sourceBlockIds: unique(segments.flatMap((segment) => segment.sourceBlockIds || [])),
      factualSegmentsWithoutSource: segments
        .filter((segment) => segment.type === 'source' && !(segment.sourceBlockIds || []).length)
        .map((segment) => ({ label: segment.label || '', text: segment.text || '' })),
    };
  });
  const quickCoverage = unique(quickSections.flatMap((section) => section.coverageUnitIds));

  const lessonCharacterCounts = curriculum.lessons.map((lesson) => (lesson.parts || [])
    .reduce((total, part) => total + String(part.text || '').length, 0));
  const systematicMissingPartSources = curriculum.lessons.flatMap((lesson) => (lesson.parts || [])
    .filter((part) => !(part.sourceBlockIds || []).length)
    .map((part) => ({ lessonId: lesson.id, partId: part.id, kind: part.kind })));
  const systematicMissingReflectionSources = curriculum.lessons
    .filter((lesson) => !lesson.reflection || !(lesson.reflection.sourceBlockIds || []).length)
    .map((lesson) => lesson.id);
  const reflectionItems = curriculum.lessons.map((lesson) => ({ id: lesson.id, prompt: lesson.reflection?.prompt || '', answer: lesson.reflection?.answer || '' }));

  const examCards = knowledgePackage.recallItems;
  const compositeCards = examCards.flatMap((card) => {
    const reasons = [];
    if ((card.prompt.match(/？/g) || []).length > 1) reasons.push('multiple-question-marks');
    if (/分别|各是|各有什么|及其中|由哪些部分|哪些核心|哪三者|哪两个|哪四个|五种职能/.test(card.prompt)) reasons.push('multi-part-cue');
    return reasons.length ? [{ recallItemId: card.id, pointId: card.pointId, prompt: card.prompt, reasons }] : [];
  });
  const broadAnswerCards = examCards
    .filter((card) => card.answer.length > 60)
    .map((card) => ({ recallItemId: card.id, pointId: card.pointId, prompt: card.prompt, answerCharacterCount: card.answer.length }));
  const crossModeNearDuplicates = [];
  const recallByPointId = new Map(examCards.map((card) => [card.pointId, card]));
  for (const lesson of curriculum.lessons) {
    for (const unitId of lesson.primaryUnitIds || []) {
      const card = recallByPointId.get(unitId);
      if (!card || !lesson.reflection?.prompt) continue;
      const score = similarity(lesson.reflection.prompt, card.prompt);
      if (score >= 0.4) {
        crossModeNearDuplicates.push({
          lessonId: lesson.id,
          pointId: unitId,
          similarity: Number(score.toFixed(2)),
          systematicPrompt: lesson.reflection.prompt,
          examPrompt: card.prompt,
        });
      }
    }
  }

  const contrastPairs = knowledgePackage.contrastPairs;
  const dialecticsIds = new Set(['politics-toc-v2-u024', 'politics-toc-v2-u025', 'politics-toc-v2-u026']);
  const contrastRegionCounts = { thought: 0, principles: 0, crossRegion: 0, unknown: 0 };
  for (const pair of contrastPairs) {
    const leftRegion = regionForUnit(pair.leftPointId);
    const rightRegion = regionForUnit(pair.rightPointId);
    if (leftRegion === 'unknown' || rightRegion === 'unknown') contrastRegionCounts.unknown += 1;
    else if (leftRegion !== rightRegion) contrastRegionCounts.crossRegion += 1;
    else contrastRegionCounts[leftRegion] += 1;
  }
  const contrastRecords = contrastPairs.map((pair) => ({
    id: pair.id,
    leftPointId: pair.leftPointId,
    rightPointId: pair.rightPointId,
    region: regionForUnit(pair.leftPointId) === regionForUnit(pair.rightPointId) ? regionForUnit(pair.leftPointId) : 'crossRegion',
    dimensions: pair.dimensions,
    boundaries: pair.boundaries,
    sourceBlockIds: pair.sourceBlockIds,
    recallItemIds: pair.recallItemIds,
  }));

  const datePattern = /(?:19|20)\d{2}年|本世纪中叶|碳达峰|碳中和/g;
  const futurePattern = /2027年|2030年|2035年|2060年|本世纪中叶|碳达峰|碳中和/g;
  const datedStatements = [];
  for (const unit of knowledgePackage.knowledgeUnits) {
    for (const block of unit.blocks || []) {
      const text = block.payload?.text || block.fallbackText || '';
      const matches = unique(text.match(datePattern) || []);
      if (!matches.length) continue;
      const futureMatches = unique(text.match(futurePattern) || []);
      const sourceBlockId = block.sourceBlockId;
      const correction = authorityCorrections.records.find((record) => record.unitId === unit.id && record.blockId === sourceBlockId);
      const spotcheck = officialSpotchecks.records.find((record) => record.unitId === unit.id && record.blockIds.includes(sourceBlockId));
      datedStatements.push({
        unitId: unit.id,
        title: unit.title,
        blockId: block.id,
        matches,
        classification: futureMatches.length ? 'periodic-currentness-review' : 'historical-date',
        currentnessEvidence: correction
          ? { type: 'official-correction', checkedAt: correction.checkedAt || authorityCorrections.checkedAt, decision: correction.decision }
          : spotcheck
            ? { type: 'official-spotcheck', checkedAt: officialSpotchecks.checkedAt, result: spotcheck.result }
            : { type: 'final-content-review', checkedAt: finalReview.audit_date },
        text,
      });
    }
  }

  const missingSources = {
    quickFactualSegments: quickSections.flatMap((section) => section.factualSegmentsWithoutSource.map((item) => ({ sectionId: section.id, ...item }))),
    systematicParts: systematicMissingPartSources,
    systematicReflections: systematicMissingReflectionSources,
    examAnswers: examCards.filter((card) => !(card.answerSourceBlockIds || []).length).map((card) => card.id),
    examPitfalls: examCards.filter((card) => card.pitfall && !(card.pitfallSourceBlockIds || []).length).map((card) => card.id),
    contrastPairs: contrastPairs
      .filter((pair) => !(pair.sourceBlockIds || []).length || !(pair.dimensions || []).length || !(pair.boundaries || []).length)
      .map((pair) => pair.id),
  };

  const consumers = consumerEvidence();
  const sourceArtifacts = [
    RUNTIME_PATH,
    CURRICULUM_PATH,
    'docs/knowledge-pilot/sources/politics/quick-primer-v4.json',
    'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
    'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
    FINAL_REVIEW_PATH,
    AUTHORITY_CORRECTIONS_PATH,
    OFFICIAL_SPOTCHECKS_PATH,
  ].map((relativePath) => ({ path: relativePath, sha256: sha256(relativePath) }));

  const stopConditions = {
    runtimePackageUnique: consumers.find((item) => item.id === 'canonical-package')?.consumed === true,
    systematicCurriculumUnique: consumers.find((item) => item.id === 'systematic-curriculum')?.consumed === true,
    allConsumersResolved: consumers.every((item) => item.consumed),
    requiredSourceLinksClosed: Object.values(missingSources).every((items) => items.length === 0),
    expectedCountsMatch: knowledgePackage.knowledgeUnits.length === 37
      && quickPrimer.sections.length === 6
      && curriculum.lessons.length === 72
      && examCards.length === 37
      && contrastPairs.length === 5,
  };

  const report = {
    schemaVersion: 1,
    auditId: 'POL-LCQ-V1-B0',
    auditDate: AUDIT_DATE,
    status: Object.values(stopConditions).every(Boolean) ? 'passed-with-registered-risks' : 'blocked',
    scope: 'Current 37 political knowledge units only; no full political theory or exam coverage claim.',
    immutableContentDuringAudit: true,
    versions: {
      runtimePackageVersion: sourcePackage.packageVersion,
      runtimeStatusCounts: sourcePackage.statusCounts,
      quickPrimer: { id: quickPrimer.id, version: quickPrimer.version, status: quickPrimer.status },
      systematicCurriculumVersion: curriculum.curriculumVersion,
      systematicKnowledgePackageVersion: curriculum.knowledgePackageVersion,
      systematicReviewState: curriculum.reviewState,
      systematicCandidateOnly: curriculum.candidateOnly,
      finalContentReviewDate: finalReview.audit_date,
      authorityCorrectionCheckDate: authorityCorrections.checkedAt,
      officialSpotcheckDate: officialSpotchecks.checkedAt,
    },
    sourceArtifacts,
    actualConsumers: consumers,
    baseline: {
      formalKnowledge: {
        unitCount: knowledgePackage.knowledgeUnits.length,
        relationCount: knowledgePackage.relations.length,
        regions: {
          thought: knowledgePackage.knowledgeUnits.filter((unit) => regionForUnit(unit.id) === 'thought').length,
          principles: knowledgePackage.knowledgeUnits.filter((unit) => regionForUnit(unit.id) === 'principles').length,
        },
      },
      quick: {
        sectionCount: quickPrimer.sections.length,
        totalCharacterCount: quickSections.reduce((total, section) => total + section.characterCount, 0),
        uniqueCoverageUnitCount: quickCoverage.length,
        sections: quickSections,
      },
      systematic: {
        routeCount: curriculum.routes.length,
        groupCount: curriculum.groups.length,
        lessonCount: curriculum.lessons.length,
        routeGroups: curriculum.routes.map((route) => ({ id: route.id, groupCount: route.groupIds.length })),
        totalDefaultCharacterCount: lessonCharacterCounts.reduce((sum, value) => sum + value, 0),
        averageDefaultCharacterCount: Number(mean(lessonCharacterCounts).toFixed(1)),
        minimumDefaultCharacterCount: Math.min(...lessonCharacterCounts),
        maximumDefaultCharacterCount: Math.max(...lessonCharacterCounts),
        lessonWithReflectionCount: curriculum.lessons.filter((lesson) => lesson.reflection?.prompt && lesson.reflection?.answer).length,
      },
      exam: {
        cardCount: examCards.length,
        uniquePointCount: unique(examCards.map((card) => card.pointId)).length,
        kinds: [...new Set(examCards.map((card) => card.kind))],
        withPitfallCount: examCards.filter((card) => card.pitfall).length,
        averagePromptCharacterCount: Number(mean(examCards.map((card) => card.prompt.length)).toFixed(1)),
        averageAnswerCharacterCount: Number(mean(examCards.map((card) => card.answer.length)).toFixed(1)),
        minimumAnswerCharacterCount: Math.min(...examCards.map((card) => card.answer.length)),
        maximumAnswerCharacterCount: Math.max(...examCards.map((card) => card.answer.length)),
        compositePromptCandidates: compositeCards,
        broadAnswerCandidates: broadAnswerCards,
      },
      confusion: {
        pairCount: contrastPairs.length,
        regionCounts: contrastRegionCounts,
        dialecticsTrianglePairCount: contrastPairs.filter((pair) => dialecticsIds.has(pair.leftPointId) && dialecticsIds.has(pair.rightPointId)).length,
        authoredScorableQuestionCount: 0,
        pairs: contrastRecords,
      },
    },
    sourceClosure: missingSources,
    duplicationAudit: {
      exactExamPromptDuplicates: duplicateGroups(examCards, 'prompt'),
      exactExamAnswerDuplicates: duplicateGroups(examCards, 'answer'),
      exactSystematicReflectionPromptDuplicates: duplicateGroups(reflectionItems, 'prompt'),
      crossModeNearDuplicates,
    },
    currentnessAudit: {
      policy: 'Future milestones and current-policy formulations require periodic official-source review; historical dates remain source-fidelity facts.',
      datedStatementCount: datedStatements.length,
      periodicReviewStatementCount: datedStatements.filter((item) => item.classification === 'periodic-currentness-review').length,
      records: datedStatements,
    },
    knownScopeGaps: [
      {
        id: 'GAP-ACHIEVEMENTS-13',
        scope: 'politics-toc-v2-u003',
        description: '十三个方面成就只有职责概述，缺少逐项正式课程来源。',
      },
      {
        id: 'GAP-SCIENTIFIC-SOCIALISM',
        scope: 'politics-toc-v2-u020',
        description: '科学社会主义只有概述位置，没有独立详细单元。',
      },
      {
        id: 'GAP-SURPLUS-VALUE-PREREQUISITE',
        scope: 'politics-toc-v2-u037',
        description: '劳动力价值等前置解释不足，不能宣称完整解释剩余价值形成机理。',
      },
      {
        id: 'GAP-FULL-EXAM-SCOPE',
        scope: 'module',
        description: '当前37篇不覆盖完整政治理论、时政、党史或完整国考/省考范围。',
      },
    ],
    riskRegister: [
      {
        id: 'B0-RISK-001',
        severity: 'high',
        area: 'confusion',
        finding: `5组易混全部位于基本原理区域，新时代思想为0组；其中${contrastPairs.filter((pair) => dialecticsIds.has(pair.leftPointId) && dialecticsIds.has(pair.rightPointId)).length}组来自三条辩证法规律的两两比较。`,
        disposition: 'B2复审现有5组并对37篇建立完整候选账本。',
      },
      {
        id: 'B0-RISK-002',
        severity: 'high',
        area: 'confusion',
        finding: '现有ContrastPair有维度、边界和双方来源，但没有独立编写的可判定初判题、标准答案和复辨变式。',
        disposition: 'B2为审核通过的对照补齐题干、答案、错误原因和变式。',
      },
      {
        id: 'B0-RISK-003',
        severity: 'medium',
        area: 'exam',
        finding: `37张卡均为单一qa卡型；识别出${compositeCards.length}张复合题干候选和${broadAnswerCards.length}张超过60字的宽答案候选。`,
        disposition: 'B3逐卡拆分、合并或保留，并建立卡型与难度。',
      },
      {
        id: 'B0-RISK-004',
        severity: 'medium',
        area: 'cross-mode',
        finding: `系统学习反思与考前速记发现${crossModeNearDuplicates.length}组高相似问题，当前最明显的是全面从严治党与反腐败。`,
        disposition: 'B1登记共同目标，B3/B4分别保留恢复与解释的任务差异。',
      },
      {
        id: 'B0-RISK-005',
        severity: 'medium',
        area: 'systematic',
        finding: `系统课程已有${curriculum.groups.length}组${curriculum.lessons.length}节并全部带反思，但reviewState仍为${curriculum.reviewState}，且三个已知来源缺口未关闭。`,
        disposition: 'B4按主题组逐节终审，缺口只限缩、不补写。',
      },
      {
        id: 'B0-RISK-006',
        severity: 'medium',
        area: 'quick',
        finding: '6节导读已覆盖37篇且来源闭合，但没有独立记录第一次使用者读后能否复述两条主线与主要板块。',
        disposition: 'B5保持轻量内容，B6执行新手全貌理解任务。',
      },
      {
        id: 'B0-RISK-007',
        severity: 'high',
        area: 'scope',
        finding: '现有内容只覆盖两篇理论区域，不能据此声称完整考试有效性。',
        disposition: '全程保留范围声明；范围扩展另立专项。',
      },
      {
        id: 'B0-RISK-008',
        severity: 'medium',
        area: 'currentness',
        finding: `${datedStatements.filter((item) => item.classification === 'periodic-currentness-review').length}个带未来节点或当前政策目标的正式块需要按版本定期复核。`,
        disposition: 'B1写入freshness与核验日期；来源变化时只重审受影响投影。',
      },
    ],
    stopConditions,
    nextBatch: Object.values(stopConditions).every(Boolean) ? 'B1' : null,
  };

  const output = `${JSON.stringify(report, null, 2)}\n`;
  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), output);
    process.stdout.write(`${JSON.stringify({ status: report.status, output: target, nextBatch: report.nextBatch })}\n`);
  } else {
    process.stdout.write(output);
  }
}

main();
