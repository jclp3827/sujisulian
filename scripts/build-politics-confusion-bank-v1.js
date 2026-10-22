#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DATE = '2026-10-21';
const RUNTIME_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';
const CURRICULUM_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';
const OBJECTIVES_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';

function absolute(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
}

function sha256(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex');
}

function unique(values) {
  return [...new Set(values)];
}

function intersect(left, right) {
  const rightSet = new Set(right);
  return unique(left.filter((value) => rightSet.has(value)));
}

function countBy(items, keyOf) {
  return items.reduce((counts, item) => {
    const key = keyOf(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function unitRegion(unitId) {
  const match = String(unitId).match(/u(\d{3})$/);
  if (!match) return 'unknown';
  return Number(match[1]) <= 19 ? 'thought' : 'principles';
}

const REVIEWED_OBJECTIVE_PROJECTIONS = {
  'relation:politics-toc-v2-u025:contrast:politics-toc-v2-u024': {
    left: ['pol-obj-dialectics-05-1'], right: ['pol-obj-dialectics-02-1'],
  },
  'relation:politics-toc-v2-u026:contrast:politics-toc-v2-u024': {
    left: ['pol-obj-dialectics-06-1'], right: ['pol-obj-dialectics-02-1'],
  },
  'relation:politics-toc-v2-u026:contrast:politics-toc-v2-u025': {
    left: ['pol-obj-dialectics-06-1'], right: ['pol-obj-dialectics-05-1'],
  },
  'relation:politics-toc-v2-u030:contrast:politics-toc-v2-u022': {
    left: ['pol-obj-history-01-1'], right: ['pol-obj-basics-04-1'],
  },
  'relation:politics-toc-v2-u034:contrast:politics-toc-v2-u033': {
    left: ['pol-obj-value-02-1'], right: ['pol-obj-value-01-1'],
  },
  'relation:politics-toc-v2-u014:related:politics-toc-v2-u005': {
    left: ['pol-obj-party-01-1'], right: ['pol-obj-leadership-01-1'],
  },
  'relation:politics-toc-v2-u010:related:politics-toc-v2-u006': {
    left: ['pol-obj-livelihood-01-1'], right: ['pol-obj-leadership-02-1'],
  },
  'relation:politics-toc-v2-u007:related:politics-toc-v2-u004': {
    left: ['pol-obj-dev-01-1'], right: ['pol-obj-mod-01-1'],
  },
  'relation:politics-toc-v2-u013:related:politics-toc-v2-u012': {
    left: ['pol-obj-reformlaw-03-1'], right: ['pol-obj-reformlaw-01-1'],
  },
  'relation:politics-toc-v2-u017:related:politics-toc-v2-u016': {
    left: ['pol-obj-security-03-1'], right: ['pol-obj-security-01-1'],
  },
};

const REVIEWED_SPECS = [
  {
    relationId: 'relation:politics-toc-v2-u025:contrast:politics-toc-v2-u024',
    status: 'accepted-existing',
    dimension: '发展规律回答的问题',
    boundary: '对立统一规律回答发展动力；量变质变规律回答发展状态和形式。',
    initial: {
      prompt: '题干强调“事物发展的动力和源泉”，应优先对应哪一规律？',
      answerUnitId: 'politics-toc-v2-u024',
      explanation: '“发展动力和源泉”对应对立统一规律。量变质变规律回答发展的状态和形式。',
      sourceBlockIds: ['block:politics-toc-v2-u024:b002', 'block:politics-toc-v2-u025:b002'],
    },
    variant: {
      prompt: '题干改为强调“发展表现为量变和质变两种状态”，应对应哪一规律？',
      answerUnitId: 'politics-toc-v2-u025',
      explanation: '强调量变、质变及发展状态时，对应量变质变规律。',
      sourceBlockIds: ['block:politics-toc-v2-u025:b002'],
    },
  },
  {
    relationId: 'relation:politics-toc-v2-u026:contrast:politics-toc-v2-u024',
    status: 'accepted-existing',
    dimension: '发展规律回答的问题',
    boundary: '对立统一规律揭示发展动力；否定之否定规律揭示发展方向和道路。',
    initial: {
      prompt: '题干强调“发展的方向和道路”，应优先对应哪一规律？',
      answerUnitId: 'politics-toc-v2-u026',
      explanation: '发展方向和道路对应否定之否定规律；发展动力对应对立统一规律。',
      sourceBlockIds: ['block:politics-toc-v2-u026:b002', 'block:politics-toc-v2-u024:b002'],
    },
    variant: {
      prompt: '题干改为追问“推动事物发展的根本动力”，应对应哪一规律？',
      answerUnitId: 'politics-toc-v2-u024',
      explanation: '推动发展的根本动力对应对立统一规律。',
      sourceBlockIds: ['block:politics-toc-v2-u024:b002'],
    },
  },
  {
    relationId: 'relation:politics-toc-v2-u026:contrast:politics-toc-v2-u025',
    status: 'accepted-existing',
    dimension: '发展过程的观察角度',
    boundary: '量变质变规律侧重状态变化；否定之否定规律侧重前进性和曲折性。',
    initial: {
      prompt: '题干强调“发展是前进性和曲折性的统一”，应优先对应哪一规律？',
      answerUnitId: 'politics-toc-v2-u026',
      explanation: '前进性和曲折性描述发展的方向与道路，对应否定之否定规律。',
      sourceBlockIds: ['block:politics-toc-v2-u026:b002'],
    },
    variant: {
      prompt: '题干改为判断变化是否突破保持原有质的限度，应对应哪一规律？',
      answerUnitId: 'politics-toc-v2-u025',
      explanation: '是否突破度、发生质变，属于量变质变规律的判断角度。',
      sourceBlockIds: ['block:politics-toc-v2-u025:b002', 'block:politics-toc-v2-u025:b010'],
    },
  },
  {
    relationId: 'relation:politics-toc-v2-u030:contrast:politics-toc-v2-u022',
    status: 'accepted-existing',
    dimension: '哲学关系的适用层级',
    boundary: '物质与意识讨论一般哲学关系；社会存在与社会意识讨论社会历史领域。',
    initial: {
      prompt: '题干讨论一般意义上的客观存在与主观反映关系，应优先使用哪组概念？',
      answerUnitId: 'politics-toc-v2-u022',
      explanation: '一般哲学层面使用物质与意识；社会历史领域才使用社会存在与社会意识。',
      sourceBlockIds: ['block:politics-toc-v2-u022:b007', 'block:politics-toc-v2-u030:b010'],
    },
    variant: {
      prompt: '题干改为讨论社会生活的物质方面与精神方面，应优先使用哪组概念？',
      answerUnitId: 'politics-toc-v2-u030',
      explanation: '社会历史领域的物质方面与精神方面，对应社会存在与社会意识。',
      sourceBlockIds: ['block:politics-toc-v2-u030:b010'],
    },
  },
  {
    relationId: 'relation:politics-toc-v2-u034:contrast:politics-toc-v2-u033',
    status: 'accepted-existing',
    dimension: '分析对象',
    boundary: '商品二因素是商品属性；劳动二重性是生产商品劳动的两重规定。',
    initial: {
      prompt: '题干询问商品本身具有的两种属性，应回答哪一组概念？',
      answerUnitId: 'politics-toc-v2-u033',
      explanation: '商品属性是使用价值和价值；具体劳动和抽象劳动描述生产商品的劳动。',
      sourceBlockIds: ['block:politics-toc-v2-u033:b003', 'block:politics-toc-v2-u034:b002'],
    },
    variant: {
      prompt: '题干改为追问生产商品的劳动为什么具有两重规定，应回答哪一组概念？',
      answerUnitId: 'politics-toc-v2-u034',
      explanation: '生产商品的劳动具有具体劳动和抽象劳动二重性。',
      sourceBlockIds: ['block:politics-toc-v2-u034:b002'],
    },
  },
  {
    relationId: 'relation:politics-toc-v2-u014:related:politics-toc-v2-u005',
    status: 'accepted-candidate',
    dimension: '党的领导与自身建设分别回答的问题',
    boundary: '党的全面领导说明领导地位和制度优势；全面从严治党说明党的自身建设和自我革命保障。',
    additionalSourceBlockIds: ['block:politics-toc-v2-u014:b002'],
    initial: {
      prompt: '题干强调“中国共产党领导是中国特色社会主义制度的最大优势”，应归入哪一主题？',
      answerUnitId: 'politics-toc-v2-u005',
      explanation: '这一表述说明党的领导地位和制度优势，属于党的全面领导。',
      sourceBlockIds: ['block:politics-toc-v2-u005:b004'],
    },
    variant: {
      prompt: '题干改为强调党的自身建设覆盖各方面、全过程，不能只等同于反腐败，应归入哪一主题？',
      answerUnitId: 'politics-toc-v2-u014',
      explanation: '自身建设、反腐败与自我革命的整体关系属于全面从严治党。',
      sourceBlockIds: ['block:politics-toc-v2-u014:b002', 'block:politics-toc-v2-u014:b040'],
    },
  },
  {
    relationId: 'relation:politics-toc-v2-u010:related:politics-toc-v2-u006',
    status: 'accepted-candidate',
    dimension: '价值取向与民生实践的层级',
    boundary: '以人民为中心是治国理政的根本价值取向；保障和改善民生是增进民生福祉的具体展开。',
    initial: {
      prompt: '题干询问新时代党治国理政的根本价值取向，应对应哪一主题？',
      answerUnitId: 'politics-toc-v2-u006',
      explanation: '根本价值取向对应坚持人民至上、以人民为中心。',
      sourceBlockIds: ['block:politics-toc-v2-u006:b006'],
    },
    variant: {
      prompt: '题干改为讨论就业、收入分配、社会保障和健康中国等具体安排，应对应哪一主题？',
      answerUnitId: 'politics-toc-v2-u010',
      explanation: '这些是保障和改善民生的具体领域，不能用抽象价值取向替代具体制度内容。',
      sourceBlockIds: ['block:politics-toc-v2-u010:b002', 'block:politics-toc-v2-u010:b024'],
    },
  },
  {
    relationId: 'relation:politics-toc-v2-u007:related:politics-toc-v2-u004',
    status: 'accepted-candidate',
    dimension: '现代化整体路径与发展任务的层级',
    boundary: '中国式现代化是全面推进强国建设和民族复兴的整体路径；高质量发展是现代化建设的首要任务和本质要求之一。',
    additionalSourceBlockIds: ['block:politics-toc-v2-u004:b002'],
    initial: {
      prompt: '题干要求判断全面推进中华民族伟大复兴的整体路径，应对应哪一主题？',
      answerUnitId: 'politics-toc-v2-u004',
      explanation: '整体路径是中国式现代化；高质量发展是其中的首要任务和本质要求之一。',
      sourceBlockIds: ['block:politics-toc-v2-u004:b002', 'block:politics-toc-v2-u004:b024'],
    },
    variant: {
      prompt: '题干改为询问全面建设社会主义现代化国家的首要任务，应对应哪一主题？',
      answerUnitId: 'politics-toc-v2-u007',
      explanation: '现代化建设的首要任务是高质量发展。',
      sourceBlockIds: ['block:politics-toc-v2-u007:b002'],
    },
  },
  {
    relationId: 'relation:politics-toc-v2-u013:related:politics-toc-v2-u012',
    status: 'accepted-candidate',
    dimension: '推进国家治理现代化的作用',
    boundary: '全面深化改革侧重完善和发展制度、推进治理现代化；全面依法治国侧重以法治方式保障和推进国家治理。',
    initial: {
      prompt: '题干引用“完善和发展中国特色社会主义制度、推进国家治理体系和治理能力现代化”，应对应哪一主题？',
      answerUnitId: 'politics-toc-v2-u012',
      explanation: '这是全面深化改革总目标的表述。',
      sourceBlockIds: ['block:politics-toc-v2-u012:b008'],
    },
    variant: {
      prompt: '题干改为强调“国家治理的一场深刻革命”和中国特色社会主义的重要保障，应对应哪一主题？',
      answerUnitId: 'politics-toc-v2-u013',
      explanation: '这一定位对应全面依法治国。',
      sourceBlockIds: ['block:politics-toc-v2-u013:b002'],
    },
  },
  {
    relationId: 'relation:politics-toc-v2-u017:related:politics-toc-v2-u016',
    status: 'accepted-candidate',
    dimension: '总体安全体系与军事支撑的层级',
    boundary: '总体国家安全观是覆盖多领域的系统安全体系；国防和军队建设是总体国家安全体系的重要支撑。',
    initial: {
      prompt: '题干强调总体、系统和覆盖多领域的大安全理念，应对应哪一主题？',
      answerUnitId: 'politics-toc-v2-u016',
      explanation: '总体国家安全观突出总体和系统统筹，不能缩成单一军事安全。',
      sourceBlockIds: ['block:politics-toc-v2-u016:b003'],
    },
    variant: {
      prompt: '题干改为询问建设世界一流人民军队的目标，应对应哪一主题？',
      answerUnitId: 'politics-toc-v2-u017',
      explanation: '建设世界一流人民军队属于国防和军队建设，是总体安全体系的重要支撑。',
      sourceBlockIds: ['block:politics-toc-v2-u017:b002', 'block:politics-toc-v2-u016:b003'],
    },
  },
];

function main() {
  const sourcePackage = require(absolute(RUNTIME_PATH));
  const curriculum = require(absolute(CURRICULUM_PATH));
  const objectivesArtifact = readJson(OBJECTIVES_PATH);
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  const unitById = new Map(knowledgePackage.knowledgeUnits.map((unit) => [unit.id, unit]));
  const relationById = new Map(knowledgePackage.relations.map((relation) => [relation.id, relation]));
  const recallByUnitId = new Map(knowledgePackage.recallItems.map((item) => [item.pointId, item]));
  const sourceBlockIds = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => (unit.blocks || []).map((block) => block.id)));
  const acceptedRelationIds = new Set(REVIEWED_SPECS.map((spec) => spec.relationId));
  const objectiveById = new Map(objectivesArtifact.objectives.map((objective) => [objective.objectiveId, objective]));

  const items = REVIEWED_SPECS.map((spec, index) => {
    const relation = relationById.get(spec.relationId);
    if (!relation) throw new Error(`missing relation: ${spec.relationId}`);
    const leftUnitId = relation.sourcePointId;
    const rightUnitId = relation.targetPointId;
    const left = unitById.get(leftUnitId);
    const right = unitById.get(rightUnitId);
    if (!left || !right) throw new Error(`missing relation units: ${spec.relationId}`);
    const pairSourceBlockIds = unique([
      ...(relation.sourceBlockIds || []),
      ...(relation.targetBlockIds || []),
      ...(spec.additionalSourceBlockIds || []),
      ...spec.initial.sourceBlockIds,
      ...spec.variant.sourceBlockIds,
    ]);
    for (const blockId of pairSourceBlockIds) if (!sourceBlockIds.has(blockId)) throw new Error(`unknown source block ${blockId}`);
    const options = [
      { unitId: left.id, label: left.title },
      { unitId: right.id, label: right.title },
    ];
    const objectiveProjection = REVIEWED_OBJECTIVE_PROJECTIONS[spec.relationId];
    if (!objectiveProjection) throw new Error(`missing reviewed objective projection: ${spec.relationId}`);
    const objectiveIdsForSide = (side, unitId) => objectiveProjection[side].map((objectiveId) => {
      const objective = objectiveById.get(objectiveId);
      if (!objective || !objective.unitIds.includes(unitId)) throw new Error(`invalid ${side} objective projection: ${spec.relationId} ${objectiveId}`);
      if (!intersect(objective.sourceBlockIds, pairSourceBlockIds).length) throw new Error(`objective projection lacks item source overlap: ${spec.relationId} ${objectiveId}`);
      return objectiveId;
    });
    const initialAnswer = unitById.get(spec.initial.answerUnitId);
    const variantAnswer = unitById.get(spec.variant.answerUnitId);
    if (!initialAnswer || !variantAnswer) throw new Error(`answer unit missing: ${spec.relationId}`);
    return {
      itemId: `politics-confusion-v1-${String(index + 1).padStart(2, '0')}`,
      status: spec.status,
      runtimeIntegration: 'not-integrated',
      region: unitRegion(left.id) === unitRegion(right.id) ? unitRegion(left.id) : 'cross-region',
      relationId: relation.id,
      sourceRelationType: relation.type,
      left: {
        unitId: left.id,
        title: left.title,
        objectiveIds: objectiveIdsForSide('left', left.id),
        sourceBlockIds: unique([...(relation.sourceBlockIds || []), ...pairSourceBlockIds.filter((id) => id.includes(`:${left.id}:`))]),
      },
      right: {
        unitId: right.id,
        title: right.title,
        objectiveIds: objectiveIdsForSide('right', right.id),
        sourceBlockIds: unique([...(relation.targetBlockIds || []), ...pairSourceBlockIds.filter((id) => id.includes(`:${right.id}:`))]),
      },
      dimension: spec.dimension,
      boundary: spec.boundary,
      sourceBlockIds: pairSourceBlockIds,
      initialCheck: {
        prompt: spec.initial.prompt,
        options,
        answerUnitId: initialAnswer.id,
        answer: initialAnswer.title,
        wrongOptionUnitId: options.find((option) => option.unitId !== initialAnswer.id).unitId,
        explanation: spec.initial.explanation,
        wrongAnswerExplanation: spec.initial.explanation,
        sourceBlockIds: spec.initial.sourceBlockIds,
      },
      variantCheck: {
        prompt: spec.variant.prompt,
        options,
        answerUnitId: variantAnswer.id,
        answer: variantAnswer.title,
        wrongOptionUnitId: options.find((option) => option.unitId !== variantAnswer.id).unitId,
        explanation: spec.variant.explanation,
        wrongAnswerExplanation: spec.variant.explanation,
        sourceBlockIds: spec.variant.sourceBlockIds,
      },
      reviewState: spec.status === 'accepted-existing' ? 'b2-existing-pair-reviewed' : 'b2-candidate-reviewed',
      reviewDecision: spec.status === 'accepted-existing'
        ? '保留正式对照，补齐初判题、答案、错误解释和复辨变式。'
        : '事实与双侧来源闭合，可作为新增候选；在独立批准前不写入正式关系或运行包。',
    };
  });

  const acceptedUnitIds = new Set(items.flatMap((item) => [item.left.unitId, item.right.unitId]));
  const relationSignals = knowledgePackage.relations.map((relation) => {
    let disposition;
    let reason;
    if (relation.type === 'contrast') {
      disposition = 'accepted-existing';
      reason = '正式对照已有双侧来源、维度和边界，并已在B2补齐两次可判定练习。';
    } else if (acceptedRelationIds.has(relation.id)) {
      disposition = 'accepted-candidate';
      reason = '正式关系与双侧来源可支持唯一辨析维度，已完成人工内容审查。';
    } else if (relation.type === 'prerequisite') {
      disposition = 'rejected-order-not-confusion';
      reason = '前置顺序只说明学习依赖，不能单独证明两个概念容易混淆。';
    } else {
      disposition = 'held-related-needs-dimension';
      reason = '关联事实成立，但当前关系没有唯一辨析维度和双方边界，不能直接生成题目。';
    }
    return {
      signalId: `relation-signal:${relation.id}`,
      sourceType: 'formal-relation',
      sourceId: relation.id,
      unitIds: [relation.sourcePointId, relation.targetPointId],
      sourceBlockIds: unique([...(relation.sourceBlockIds || []), ...(relation.targetBlockIds || [])]),
      disposition,
      reason,
    };
  });

  const explicitDistinctionPattern = /区分|分别|不要把|不能把|不等于|不是|不同|调换|混同|对应|各自|只理解|只等同/;
  const pitfallSignals = knowledgePackage.recallItems.map((item) => {
    const supporting = items.filter((pair) => (
      (pair.left.unitId === item.pointId || pair.right.unitId === item.pointId)
      && intersect(pair.sourceBlockIds, item.pitfallSourceBlockIds || []).length
    ));
    const disposition = supporting.length
      ? 'supporting-accepted-item'
      : explicitDistinctionPattern.test(item.pitfall || '')
        ? 'held-within-unit-distinction'
        : 'rejected-single-concept-error';
    return {
      signalId: `pitfall-signal:${item.id}`,
      sourceType: 'recall-pitfall',
      sourceId: item.id,
      unitIds: [item.pointId],
      text: item.pitfall || '',
      sourceBlockIds: item.pitfallSourceBlockIds || [],
      supportingItemIds: supporting.map((pair) => pair.itemId),
      disposition,
      reason: disposition === 'supporting-accepted-item'
        ? '已作为通过审查辨析项的错误边界证据。'
        : disposition === 'held-within-unit-distinction'
          ? '存在明确区分信号，但尚未形成双侧目标与唯一维度，保留为后续单元内辨析候选。'
          : '只提示单一概念错误，不能据此构成双方辨析。',
    };
  });

  const boundarySignals = curriculum.lessons.map((lesson) => {
    const boundaryParts = (lesson.parts || []).filter((part) => part.kind === 'boundary');
    const sourceIds = unique(boundaryParts.flatMap((part) => part.sourceBlockIds || []));
    const text = boundaryParts.map((part) => part.text).join('\n');
    const supporting = items.filter((pair) => (
      (lesson.primaryUnitIds || []).some((unitId) => pair.left.unitId === unitId || pair.right.unitId === unitId)
      && intersect(pair.sourceBlockIds, sourceIds).length
    ));
    const disposition = supporting.length
      ? 'supporting-accepted-item'
      : explicitDistinctionPattern.test(text)
        ? 'held-within-unit-distinction'
        : 'rejected-no-dual-target';
    return {
      signalId: `boundary-signal:${lesson.id}`,
      sourceType: 'systematic-boundary',
      sourceId: lesson.id,
      unitIds: lesson.primaryUnitIds || [],
      text,
      sourceBlockIds: sourceIds,
      supportingItemIds: supporting.map((pair) => pair.itemId),
      disposition,
      reason: disposition === 'supporting-accepted-item'
        ? '已作为通过审查辨析项的课程边界证据。'
        : disposition === 'held-within-unit-distinction'
          ? '边界具有区分价值，但目前只支持单元内职责拆分，暂不创建跨单元正式关系。'
          : '该边界用于限制课程范围，没有形成可核对的双侧辨析对象。',
    };
  });

  const ledger = [...relationSignals, ...pitfallSignals, ...boundarySignals];
  const coveredUnitIds = unique(items.flatMap((item) => [item.left.unitId, item.right.unitId]));
  const validation = {
    reviewedItemCount: items.length,
    existingItemCount: items.filter((item) => item.status === 'accepted-existing').length,
    newCandidateCount: items.filter((item) => item.status === 'accepted-candidate').length,
    itemWithoutUniqueDimension: items.filter((item) => !item.dimension || Array.isArray(item.dimension)).map((item) => item.itemId),
    itemWithoutBoundary: items.filter((item) => !item.boundary).map((item) => item.itemId),
    itemWithoutTwoSides: items.filter((item) => !item.left.unitId || !item.right.unitId || item.left.unitId === item.right.unitId).map((item) => item.itemId),
    itemWithoutSideObjectives: items.filter((item) => !item.left.objectiveIds.length || !item.right.objectiveIds.length).map((item) => item.itemId),
    itemWithoutSourceBlocks: items.filter((item) => !item.sourceBlockIds.length).map((item) => item.itemId),
    itemWithUnknownSourceBlocks: items.flatMap((item) => item.sourceBlockIds.filter((id) => !sourceBlockIds.has(id)).map((id) => ({ itemId: item.itemId, blockId: id }))),
    itemWithoutScorableChecks: items.filter((item) => (
      !item.initialCheck.answerUnitId
      || !item.initialCheck.wrongOptionUnitId
      || !item.initialCheck.wrongAnswerExplanation
      || !item.variantCheck.answerUnitId
      || !item.variantCheck.wrongOptionUnitId
      || !item.variantCheck.wrongAnswerExplanation
    )).map((item) => item.itemId),
    initialVariantSameAnswer: items.filter((item) => item.initialCheck.answerUnitId === item.variantCheck.answerUnitId).map((item) => item.itemId),
    ledgerCounts: {
      total: ledger.length,
      bySourceType: countBy(ledger, (entry) => entry.sourceType),
      byDisposition: countBy(ledger, (entry) => entry.disposition),
    },
    coverage: {
      unitCount: coveredUnitIds.length,
      thoughtUnitCount: coveredUnitIds.filter((id) => unitRegion(id) === 'thought').length,
      principlesUnitCount: coveredUnitIds.filter((id) => unitRegion(id) === 'principles').length,
      itemCountByRegion: countBy(items, (item) => item.region),
    },
  };
  validation.passed = validation.reviewedItemCount === 10
    && validation.existingItemCount === 5
    && validation.newCandidateCount === 5
    && validation.itemWithoutUniqueDimension.length === 0
    && validation.itemWithoutBoundary.length === 0
    && validation.itemWithoutTwoSides.length === 0
    && validation.itemWithoutSideObjectives.length === 0
    && validation.itemWithoutSourceBlocks.length === 0
    && validation.itemWithUnknownSourceBlocks.length === 0
    && validation.itemWithoutScorableChecks.length === 0
    && validation.initialVariantSameAnswer.length === 0
    && validation.coverage.thoughtUnitCount > 0;

  const artifact = {
    schemaVersion: 1,
    id: 'politics-confusion-bank-v1',
    buildDate: BUILD_DATE,
    status: validation.passed ? 'candidate-reviewed' : 'blocked',
    scope: 'Current 37 political knowledge units only; B2 candidate bank is not integrated into runtime and does not claim full exam coverage.',
    authority: {
      sourcePackageVersion: sourcePackage.packageVersion,
      sourcePackageSha256: sha256(RUNTIME_PATH),
      curriculumVersion: curriculum.curriculumVersion,
      curriculumSha256: sha256(CURRICULUM_PATH),
      objectiveArtifactId: objectivesArtifact.id,
      objectiveArtifactSha256: sha256(OBJECTIVES_PATH),
    },
    policy: {
      acceptedExisting: 'Existing formal contrast relations retain their relation authority; B2 adds scorable initial and variant checks.',
      acceptedCandidate: 'New items require a formal two-unit relation, two-sided sources, one dimension, one boundary, and two scorable checks. They remain candidates.',
      held: 'A pitfall, boundary, title similarity, or related relation without a unique dimension cannot create a formal contrast pair.',
      runtime: 'This artifact is review-only and is not consumed by the mini-program runtime.',
    },
    curationPolicy: {
      dialecticsClusterItemIds: [
        'politics-confusion-v1-01',
        'politics-confusion-v1-02',
        'politics-confusion-v1-03',
      ],
      maxDialecticsClusterItemsPerDefaultSession: 1,
      selectionPriority: ['previously-missed', 'unseen', 'region-balance', 'explicit-user-random'],
      masteryBoundary: 'A correct initial check alone does not prove mastery; the variant check must remain independently scorable.',
    },
    items,
    candidateLedger: {
      relationSignals,
      pitfallSignals,
      boundarySignals,
    },
    coverage: {
      unitIds: coveredUnitIds,
      acceptedItemIds: items.map((item) => item.itemId),
      existingItemIds: items.filter((item) => item.status === 'accepted-existing').map((item) => item.itemId),
      newCandidateItemIds: items.filter((item) => item.status === 'accepted-candidate').map((item) => item.itemId),
      unrepresentedUnitIds: knowledgePackage.knowledgeUnits.map((unit) => unit.id).filter((id) => !acceptedUnitIds.has(id)),
    },
    validation,
    knownScopeGaps: objectivesArtifact.knownScopeGaps,
    nextBatch: validation.passed ? 'B3' : null,
  };

  const output = `${JSON.stringify(artifact, null, 2)}\n`;
  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), output);
    process.stdout.write(`${JSON.stringify({ status: artifact.status, output: target, validation })}\n`);
  } else {
    process.stdout.write(output);
  }
}

main();
