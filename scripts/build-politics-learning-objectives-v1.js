#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DATE = '2026-10-21';
const RUNTIME_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';
const CURRICULUM_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';
const B0_PATH = 'docs/knowledge-platform/implementations/evidence/politics-learning-content-b0-baseline-20261021.json';

function absolute(relativePath) {
  return path.join(ROOT, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), 'utf8');
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

function unique(values) {
  return [...new Set(values)];
}

function intersection(left, right) {
  const rightSet = new Set(right);
  return unique(left.filter((value) => rightSet.has(value)));
}

function lowerId(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function groupMap(curriculum) {
  return new Map(curriculum.groups.map((group) => [group.id, group]));
}

function routeMap(curriculum) {
  const result = new Map();
  for (const route of curriculum.routes) for (const groupId of route.groupIds) result.set(groupId, route);
  return result;
}

function partsFor(lesson, kind) {
  return (lesson.parts || []).filter((part) => part.kind === kind);
}

function lessonSourceBlockIds(lesson) {
  return unique([
    ...(lesson.parts || []).flatMap((part) => part.sourceBlockIds || []),
    ...(lesson.reflection?.sourceBlockIds || []),
    ...(lesson.corePromises || []).flatMap((promise) => promise.sourceBlockIds || []),
  ]);
}

function gapIdsForUnit(unitId, gaps) {
  return gaps.filter((gap) => gap.scope === unitId || gap.scope === 'module').map((gap) => gap.id);
}

function main() {
  const sourcePackage = require(absolute(RUNTIME_PATH));
  const curriculum = require(absolute(CURRICULUM_PATH));
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  const b0 = JSON.parse(read(B0_PATH));
  const groups = groupMap(curriculum);
  const routes = routeMap(curriculum);
  const unitById = new Map(knowledgePackage.knowledgeUnits.map((unit) => [unit.id, unit]));
  const recallsByPointId = new Map(knowledgePackage.recallItems.map((item) => [item.pointId, item]));
  const quickPrimer = knowledgePackage.quickPrimers.find((item) => item.id === sourcePackage.module.routeDefaults.quick.primerId);
  assert(quickPrimer, 'quick primer missing');

  const quickSectionsByUnit = new Map();
  for (const section of quickPrimer.sections) {
    const coveredUnitIds = unique((section.narrativeSegments || []).flatMap((segment) => segment.coverageUnitIds || []));
    for (const unitId of coveredUnitIds) {
      if (!quickSectionsByUnit.has(unitId)) quickSectionsByUnit.set(unitId, []);
      quickSectionsByUnit.get(unitId).push(section.id);
    }
  }

  const objectives = [];
  for (const lesson of curriculum.lessons) {
    const group = groups.get(lesson.groupId);
    const route = routes.get(lesson.groupId);
    assert(group && route, `lesson route metadata missing: ${lesson.id}`);
    const sourceBlockIds = lessonSourceBlockIds(lesson);
    assert(sourceBlockIds.length, `lesson source blocks missing: ${lesson.id}`);
    const boundaries = partsFor(lesson, 'boundary').map((part) => ({
      text: part.text,
      sourceBlockIds: part.sourceBlockIds || [],
      partId: part.id,
    }));
    const conditionStatements = boundaries.filter((item) => /条件|前提|适用|只有|必须|仍要|不能|不等于|不是/.test(item.text));
    const unitPitfallCandidates = (lesson.primaryUnitIds || []).flatMap((unitId) => {
      const card = recallsByPointId.get(unitId);
      if (!card?.pitfall) return [];
      const overlap = intersection(sourceBlockIds, card.pitfallSourceBlockIds || []);
      return [{
        text: card.pitfall,
        recallItemId: card.id,
        sourceBlockIds: card.pitfallSourceBlockIds || [],
        relevance: overlap.length ? 'source-overlap' : 'unit-level-candidate',
      }];
    });
    const negativeBoundaryCandidates = boundaries
      .filter((item) => /不能|不等于|不是|不可|不要|不把|并非/.test(item.text))
      .map((item) => ({ text: item.text, sourceBlockIds: item.sourceBlockIds, relevance: 'lesson-boundary' }));

    (lesson.objectives || []).forEach((objectiveText, objectiveIndex) => {
      const objectiveId = `pol-obj-${lowerId(lesson.id)}-${objectiveIndex + 1}`;
      const quickSectionIds = unique((lesson.primaryUnitIds || []).flatMap((unitId) => quickSectionsByUnit.get(unitId) || []));
      const examCards = (lesson.primaryUnitIds || []).map((unitId) => recallsByPointId.get(unitId)).filter(Boolean);
      const examSourceOverlaps = unique(examCards.flatMap((card) => intersection(sourceBlockIds, card.sourceBlockIds || [])));
      const examNearDuplicate = examCards.some((card) => similarity(lesson.reflection?.prompt || '', card.prompt) >= 0.4);
      const contrastPairs = knowledgePackage.contrastPairs.filter((pair) => {
        const sameUnit = (lesson.primaryUnitIds || []).includes(pair.leftPointId) || (lesson.primaryUnitIds || []).includes(pair.rightPointId);
        return sameUnit && intersection(sourceBlockIds, pair.sourceBlockIds || []).length;
      });
      const freshnessRecords = b0.currentnessAudit.records.filter((record) => (
        sourceBlockIds.includes(record.blockId)
        || (lesson.primaryUnitIds || []).includes(record.unitId)
      ));
      const gapIds = unique((lesson.primaryUnitIds || []).flatMap((unitId) => gapIdsForUnit(unitId, b0.knownScopeGaps)));
      const examStates = examCards.length
        ? examSourceOverlaps.length ? ['covered'] : ['missing']
        : ['missing'];
      if (examNearDuplicate) examStates.push('duplicated');

      objectives.push({
        objectiveId,
        title: objectiveText,
        mustUnderstand: objectiveText,
        unitIds: [...(lesson.primaryUnitIds || [])],
        routeId: route.id,
        groupId: group.id,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        supportingQuestion: lesson.question,
        importance: 'core-within-current-curriculum',
        sourceVersion: {
          knowledgePackage: sourcePackage.packageVersion,
          curriculum: curriculum.curriculumVersion,
        },
        sourceBlockIds,
        sourceGranularity: lesson.objectives.length === 1 ? 'single-objective-lesson' : 'shared-by-two-authored-objectives',
        conditions: conditionStatements,
        conditionReviewState: conditionStatements.length ? 'registered' : 'none-identified-from-authored-boundaries',
        boundaries,
        boundaryReviewState: boundaries.length ? 'registered' : 'missing',
        commonErrors: unique([...negativeBoundaryCandidates, ...unitPitfallCandidates].map((item) => JSON.stringify(item))).map((item) => JSON.parse(item)),
        commonErrorReviewState: negativeBoundaryCandidates.length || unitPitfallCandidates.length ? 'candidate-registered' : 'missing',
        scopeLimit: lesson.scopeLimit,
        freshness: freshnessRecords.map((record) => ({
          blockId: record.blockId,
          classification: record.classification,
          currentnessEvidence: record.currentnessEvidence,
        })),
        freshnessReviewState: freshnessRecords.length ? 'registered' : 'no-special-currentness-trigger',
        coverageGapIds: gapIds,
        projections: {
          quick: {
            states: quickSectionIds.length ? ['covered'] : ['missing'],
            sectionIds: quickSectionIds,
            responsibility: quickSectionIds.length ? 'overview-only' : 'none',
          },
          systematic: {
            states: ['covered'],
            lessonIds: [lesson.id],
            responsibility: 'explanation-and-boundary',
          },
          exam: {
            states: unique(examStates),
            recallItemIds: examCards.map((card) => card.id),
            sourceOverlapBlockIds: examSourceOverlaps,
            responsibility: examSourceOverlaps.length ? 'active-recall-source-overlap' : examCards.length ? 'same-unit-card-needs-b3-review' : 'none',
          },
          confusion: {
            states: contrastPairs.length ? ['covered'] : ['missing'],
            contrastPairIds: contrastPairs.map((pair) => pair.id),
            responsibility: contrastPairs.length ? 'boundary-discrimination' : 'none',
          },
        },
        reviewState: 'b1-mapped',
        contentReviewState: 'pending-b4',
        reviewEvidence: {
          curriculumVersion: curriculum.curriculumVersion,
          runtimePackageVersion: sourcePackage.packageVersion,
          b0AuditId: b0.auditId,
        },
      });
    });
  }

  const objectivesByUnit = new Map();
  for (const objective of objectives) {
    for (const unitId of objective.unitIds) {
      if (!objectivesByUnit.has(unitId)) objectivesByUnit.set(unitId, []);
      objectivesByUnit.get(unitId).push(objective);
    }
  }

  const unitMatrix = knowledgePackage.knowledgeUnits.map((unit) => {
    const unitObjectives = objectivesByUnit.get(unit.id) || [];
    const quickSectionIds = quickSectionsByUnit.get(unit.id) || [];
    const recall = recallsByPointId.get(unit.id);
    const contrastPairs = knowledgePackage.contrastPairs.filter((pair) => pair.leftPointId === unit.id || pair.rightPointId === unit.id);
    const lessonIds = unique(unitObjectives.map((objective) => objective.lessonId));
    const freshnessRecords = b0.currentnessAudit.records.filter((record) => record.unitId === unit.id);
    return {
      unitId: unit.id,
      title: unit.title,
      objectiveIds: unitObjectives.map((objective) => objective.objectiveId),
      objectiveCount: unitObjectives.length,
      quickSectionIds,
      systematicLessonIds: lessonIds,
      recallItemIds: recall ? [recall.id] : [],
      contrastPairIds: contrastPairs.map((pair) => pair.id),
      states: {
        quick: quickSectionIds.length ? 'covered' : 'missing',
        systematic: lessonIds.length ? 'covered' : 'missing',
        exam: recall ? 'covered' : 'missing',
        confusion: contrastPairs.length ? 'covered' : 'missing',
      },
      freshness: freshnessRecords.map((record) => ({
        blockId: record.blockId,
        classification: record.classification,
        currentnessEvidence: record.currentnessEvidence,
      })),
      coverageGapIds: gapIdsForUnit(unit.id, b0.knownScopeGaps),
    };
  });

  const reverseProjectionItems = {
    quickSections: quickPrimer.sections.map((section) => {
      const unitIds = unique((section.narrativeSegments || []).flatMap((segment) => segment.coverageUnitIds || []));
      const objectiveIds = unique(unitIds.flatMap((unitId) => (objectivesByUnit.get(unitId) || []).map((objective) => objective.objectiveId)));
      return { id: section.id, unitIds, objectiveIds, states: objectiveIds.length ? ['covered'] : ['misplaced'] };
    }),
    systematicLessons: curriculum.lessons.map((lesson) => {
      const objectiveIds = objectives.filter((objective) => objective.lessonId === lesson.id).map((objective) => objective.objectiveId);
      return { id: lesson.id, unitIds: lesson.primaryUnitIds || [], objectiveIds, states: objectiveIds.length ? ['covered'] : ['misplaced'] };
    }),
    examCards: knowledgePackage.recallItems.map((card) => {
      const unitObjectives = objectivesByUnit.get(card.pointId) || [];
      const sourceMapped = unitObjectives.filter((objective) => intersection(objective.sourceBlockIds, card.sourceBlockIds || []).length);
      const nearDuplicate = unitObjectives.filter((objective) => {
        const lesson = curriculum.lessons.find((item) => item.id === objective.lessonId);
        return similarity(lesson?.reflection?.prompt || '', card.prompt) >= 0.4;
      });
      const states = sourceMapped.length ? ['covered'] : ['misplaced'];
      if (nearDuplicate.length) states.push('duplicated');
      return {
        id: card.id,
        unitIds: [card.pointId],
        objectiveIds: sourceMapped.map((objective) => objective.objectiveId),
        sameUnitObjectiveIds: unitObjectives.map((objective) => objective.objectiveId),
        states: unique(states),
      };
    }),
    contrastPairs: knowledgePackage.contrastPairs.map((pair) => {
      const unitObjectives = unique([pair.leftPointId, pair.rightPointId]
        .flatMap((unitId) => objectivesByUnit.get(unitId) || []));
      const sourceMapped = unitObjectives.filter((objective) => intersection(objective.sourceBlockIds, pair.sourceBlockIds || []).length);
      return {
        id: pair.id,
        unitIds: [pair.leftPointId, pair.rightPointId],
        objectiveIds: sourceMapped.map((objective) => objective.objectiveId),
        sameUnitObjectiveIds: unitObjectives.map((objective) => objective.objectiveId),
        states: sourceMapped.length ? ['covered'] : ['misplaced'],
      };
    }),
  };

  const validation = {
    formalUnitCount: unitMatrix.length,
    objectiveCount: objectives.length,
    objectiveWithoutUnitIds: objectives.filter((objective) => !objective.unitIds.length).map((objective) => objective.objectiveId),
    objectiveWithoutSourceBlockIds: objectives.filter((objective) => !objective.sourceBlockIds.length).map((objective) => objective.objectiveId),
    objectiveWithoutSourceVersion: objectives.filter((objective) => !objective.sourceVersion?.knowledgePackage || !objective.sourceVersion?.curriculum).map((objective) => objective.objectiveId),
    objectiveWithoutBoundary: objectives.filter((objective) => !objective.boundaries.length).map((objective) => objective.objectiveId),
    objectiveWithoutCommonError: objectives.filter((objective) => !objective.commonErrors.length).map((objective) => objective.objectiveId),
    objectiveWithoutConditionDisposition: objectives.filter((objective) => !objective.conditionReviewState).map((objective) => objective.objectiveId),
    unitWithoutObjectives: unitMatrix.filter((unit) => !unit.objectiveCount).map((unit) => unit.unitId),
    lessonWithoutObjectives: reverseProjectionItems.systematicLessons.filter((item) => !item.objectiveIds.length).map((item) => item.id),
    quickSectionWithoutObjectives: reverseProjectionItems.quickSections.filter((item) => !item.objectiveIds.length).map((item) => item.id),
    examCardWithoutSameUnitObjectives: reverseProjectionItems.examCards.filter((item) => !item.sameUnitObjectiveIds.length).map((item) => item.id),
    contrastPairWithoutSameUnitObjectives: reverseProjectionItems.contrastPairs.filter((item) => !item.sameUnitObjectiveIds.length).map((item) => item.id),
    misplacedExamCardIds: reverseProjectionItems.examCards.filter((item) => item.states.includes('misplaced')).map((item) => item.id),
    misplacedContrastPairIds: reverseProjectionItems.contrastPairs.filter((item) => item.states.includes('misplaced')).map((item) => item.id),
    duplicatedExamCardIds: reverseProjectionItems.examCards.filter((item) => item.states.includes('duplicated')).map((item) => item.id),
    unitCoverage: {
      quick: unitMatrix.filter((unit) => unit.states.quick === 'covered').length,
      systematic: unitMatrix.filter((unit) => unit.states.systematic === 'covered').length,
      exam: unitMatrix.filter((unit) => unit.states.exam === 'covered').length,
      confusion: unitMatrix.filter((unit) => unit.states.confusion === 'covered').length,
    },
    objectivesByProjection: {
      quick: objectives.filter((objective) => objective.projections.quick.states.includes('covered')).length,
      systematic: objectives.filter((objective) => objective.projections.systematic.states.includes('covered')).length,
      exam: objectives.filter((objective) => objective.projections.exam.states.includes('covered')).length,
      confusion: objectives.filter((objective) => objective.projections.confusion.states.includes('covered')).length,
    },
  };
  validation.passed = validation.formalUnitCount === 37
    && validation.objectiveCount === 97
    && validation.objectiveWithoutUnitIds.length === 0
    && validation.objectiveWithoutSourceBlockIds.length === 0
    && validation.objectiveWithoutSourceVersion.length === 0
    && validation.objectiveWithoutBoundary.length === 0
    && validation.objectiveWithoutCommonError.length === 0
    && validation.objectiveWithoutConditionDisposition.length === 0
    && validation.unitWithoutObjectives.length === 0
    && validation.lessonWithoutObjectives.length === 0
    && validation.quickSectionWithoutObjectives.length === 0
    && validation.examCardWithoutSameUnitObjectives.length === 0
    && validation.contrastPairWithoutSameUnitObjectives.length === 0
    && validation.unitCoverage.quick === 37
    && validation.unitCoverage.systematic === 37
    && validation.unitCoverage.exam === 37;

  const artifact = {
    schemaVersion: 1,
    id: 'politics-learning-objectives-v1',
    buildDate: BUILD_DATE,
    status: validation.passed ? 'candidate-mapped' : 'blocked',
    scope: 'Current 37 political knowledge units only; objective mapping is not a complete political theory or exam syllabus.',
    authority: {
      sourcePackageVersion: sourcePackage.packageVersion,
      sourcePackageSha256: sha256(RUNTIME_PATH),
      curriculumVersion: curriculum.curriculumVersion,
      curriculumSha256: sha256(CURRICULUM_PATH),
      b0AuditId: b0.auditId,
      b0AuditSha256: sha256(B0_PATH),
    },
    mappingPolicy: {
      objectiveSource: 'Each authored curriculum lesson objective becomes one objective record.',
      sourceGranularity: 'Objectives in a two-objective lesson share the lesson source set until B4 editorial review.',
      quick: 'Unit-level overview coverage only; never interpreted as full teaching.',
      systematic: 'Direct authored lesson responsibility.',
      exam: 'Covered only when recall source blocks overlap the objective lesson source set; same-unit-only is retained for B3 review.',
      confusion: 'Covered only when both the pair unit and pair source blocks intersect the objective lesson source set.',
      gaps: 'Known source and full-scope gaps remain visible and cannot be filled by generated prose.',
    },
    knownScopeGaps: b0.knownScopeGaps,
    objectives,
    unitMatrix,
    reverseProjectionItems,
    validation,
    nextBatches: validation.passed ? ['B2', 'B3', 'B4'] : [],
  };

  const output = `${JSON.stringify(artifact, null, 2)}\n`;
  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), output);
    process.stdout.write(`${JSON.stringify({ status: artifact.status, output: target, objectiveCount: objectives.length, validation })}\n`);
  } else {
    process.stdout.write(output);
  }
}

main();
