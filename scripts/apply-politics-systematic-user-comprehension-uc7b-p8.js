#!/usr/bin/env node

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const batch = 'politics-systematic-user-comprehension-uc7b-p8';
const evidenceRoot = 'docs/knowledge-platform/implementations/evidence/';
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  projection: 'miniprogram/services/knowledge-platform/systematic-units.js',
  predecessor: evidenceRoot + 'politics-systematic-user-comprehension-uc7b-p7-20261024.json',
  evidence: evidenceRoot + batch + '-20261024.json',
  aiReview: evidenceRoot + batch + '-ai-review-20261024.json',
  runtimeProbe: evidenceRoot + batch + '-runtime-probe-20261024.json',
  retrospective: evidenceRoot + 'politics-systematic-user-comprehension-retrospective-audit-20261024.json',
};
const absolute = file => path.join(root, file);
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const optional = file => fs.existsSync(absolute(file)) ? read(file) : null;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const digest = file => sha256(fs.readFileSync(absolute(file)));
const write = (file, value) => fs.writeFileSync(absolute(file), JSON.stringify(value, null, 2) + '\n');
const visibleParts = (lesson, includeReflection = false) => [
  ...lesson.sections,
  ...(lesson.boundary ? [lesson.boundary] : []),
  lesson.recap,
  ...(includeReflection ? [lesson.reflection] : []),
];
const snapshot = lesson => ({
  title: lesson.title,
  question: lesson.question,
  objectives: lesson.objectives,
  scopeLimit: lesson.scopeLimit,
  sections: lesson.sections.map(part => ({ label: part.label, text: part.text, emphasis: part.emphasis || [] })),
  boundary: lesson.boundary ? { label: lesson.boundary.label, text: lesson.boundary.text } : null,
  recap: { label: lesson.recap.label, text: lesson.recap.text },
  reflection: { prompt: lesson.reflection.prompt, answer: lesson.reflection.answer },
});

function updateInventory(inventory, source) {
  for (const unit of inventory.units) {
    unit.defaultReferencingLessonIds = source.lessons
      .filter(lesson => lesson.sections.some(part =>
        part.sourceBlockIds.some(blockId => blockId.split(':')[1] === unit.unitId)))
      .map(lesson => lesson.id);
    for (const block of unit.sourceBlocks) {
      block.sampleLessonIds = source.lessons
        .filter(lesson => visibleParts(lesson, true).some(part => part.sourceBlockIds.includes(block.blockId)))
        .map(lesson => lesson.id);
      const inDefault = source.lessons
        .some(lesson => visibleParts(lesson).some(part => part.sourceBlockIds.includes(block.blockId)));
      block.teachingDisposition = inDefault
        ? 'default-reference'
        : block.sampleLessonIds.length ? 'optional-reference' : 'source-only';
    }
  }
}

function main() {
  const source = read(files.source);
  const inventory = read(files.inventory);
  const predecessor = read(files.predecessor);
  const priorEvidence = optional(files.evidence);
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const previousRuntime = require('../miniprogram/models/politics-systematic-units-runtime');
  assert.ok([predecessor.curriculumVersion, priorEvidence?.curriculumVersion]
    .filter(Boolean).includes(previousRuntime.curriculumVersion), 'P8 must start from accepted P7 or its own candidate');
  assert.equal(predecessor.realUserAcceptance, 'passed');

  const lessonIdsBefore = source.lessons.map(item => item.id);
  const contentChangedLessonIds = ['DEMOCRACY-03', 'CULTUREECO-04', 'PARTY-03', 'UNITYFOREIGN-03', 'MONEY-02'];
  const lessons = Object.fromEntries(contentChangedLessonIds.map(id => [id, source.lessons.find(item => item.id === id)]));
  assert.ok(Object.values(lessons).every(Boolean), 'missing P8 lesson');
  const before = Object.fromEntries(contentChangedLessonIds.map(id => [
    id,
    priorEvidence?.before?.[id] || snapshot(lessons[id]),
  ]));

  const democracy = lessons['DEMOCRACY-03'];
  democracy.question = '统一战线如何处理一致性与多样性的关系？';
  democracy.objectives = ['说明统一战线凝聚一致性与尊重多样性的关系'];
  democracy.scopeLimit = '学习重点：统一战线如何处理一致性与多样性的关系。不展开民主制度细目。';
  democracy.sections[0].label = '统一战线的本质要求';
  democracy.sections[0].text = '统一战线是夺取革命、建设、改革事业胜利和实现中华民族伟大复兴的重要法宝。统战工作的本质要求是大团结大联合，解决人心和力量问题。';
  democracy.sections[0].emphasis = [
    { part: 'text', quote: '大团结大联合', occurrence: 1, role: 'key' },
    { part: 'text', quote: '人心和力量问题', occurrence: 1, role: 'key' },
  ];
  democracy.sections[1].label = '一致性与多样性的关系';
  democracy.sections[1].text = '统战工作的关键是坚持求同存异，在尊重多样性中寻求一致性。统一战线承认社会成员存在差异；求同不是抹平合理差异，多样性也不是放弃共同方向。党的政治领导为共同方向提供保证，主要体现为政治原则、政治方向、重大方针政策的领导。';
  democracy.sections[1].sourceBlockIds = ['block:politics-toc-v2-u008:b033', 'block:politics-toc-v2-u008:b034'];
  democracy.sections[1].emphasis = [
    { part: 'text', quote: '在尊重多样性中寻求一致性', occurrence: 1, role: 'key' },
    { part: 'text', quote: '求同不是抹平合理差异', occurrence: 1, role: 'key' },
    { part: 'text', quote: '多样性也不是放弃共同方向', occurrence: 1, role: 'key' },
    { part: 'text', quote: '政治原则、政治方向、重大方针政策', occurrence: 1, role: 'key' },
  ];
  delete democracy.boundary;
  democracy.recap = {
    label: '本节结论',
    text: '统一战线以大团结大联合凝聚人心和力量，通过求同存异在尊重多样性中寻求一致性；共同方向与合理差异需要同时保留。',
    sourceBlockIds: ['block:politics-toc-v2-u008:b031', 'block:politics-toc-v2-u008:b032', 'block:politics-toc-v2-u008:b033', 'block:politics-toc-v2-u008:b034'],
    emphasis: [],
  };
  democracy.reflection = {
    prompt: democracy.question,
    answer: '统一战线以大团结大联合凝聚人心和力量，并通过求同存异在尊重多样性中寻求一致性。求同不抹平合理差异，多样性也不取消共同方向。',
    sourceBlockIds: [...democracy.recap.sourceBlockIds],
  };
  democracy.corePromises = [
    { quote: '大团结大联合', sourceBlockIds: ['block:politics-toc-v2-u008:b032'] },
    { quote: '人心和力量问题', sourceBlockIds: ['block:politics-toc-v2-u008:b032'] },
    { quote: '在尊重多样性中寻求一致性', sourceBlockIds: ['block:politics-toc-v2-u008:b033'] },
  ];

  const ecology = lessons['CULTUREECO-04'];
  ecology.question = '碳达峰碳中和目标、三条控制线和自然保护地体系分别是什么？';
  ecology.objectives = ['分别说明碳目标、三条控制线和自然保护地体系'];
  ecology.scopeLimit = '学习重点：碳达峰碳中和目标、三条控制线和自然保护地体系分别是什么。不展开碳排放核算方法或最新进展。';
  ecology.sections = [
    {
      label: '碳达峰碳中和目标',
      text: '我国力争2030年前实现碳达峰，努力争取2060年前实现碳中和。这是目标节点，不是已经实现的结果。',
      sourceBlockIds: ['block:politics-toc-v2-u011:b009'],
      emphasis: [
        { part: 'text', quote: '力争2030年前实现碳达峰', occurrence: 1, role: 'key' },
        { part: 'text', quote: '努力争取2060年前实现碳中和', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '三条控制线',
      text: '三条控制线是生态保护红线、永久基本农田、城镇开发边界，分别构成三类空间控制边界。',
      sourceBlockIds: ['block:politics-toc-v2-u011:b010'],
      emphasis: [{ part: 'text', quote: '生态保护红线、永久基本农田、城镇开发边界', occurrence: 1, role: 'key' }],
    },
    {
      label: '自然保护地体系',
      text: '自然保护地体系以国家公园为主体、自然保护区为基础、各类自然公园为补充。它说明保护地体系的组成，与三条空间控制线不是同一张清单。',
      sourceBlockIds: ['block:politics-toc-v2-u011:b011'],
      emphasis: [{ part: 'text', quote: '以国家公园为主体、自然保护区为基础、各类自然公园为补充', occurrence: 1, role: 'key' }],
    },
  ];
  delete ecology.boundary;
  ecology.recap = {
    label: '本节结论',
    text: '碳目标是力争2030年前实现碳达峰、努力争取2060年前实现碳中和；三条控制线是生态保护红线、永久基本农田、城镇开发边界；自然保护地体系以国家公园为主体、自然保护区为基础、各类自然公园为补充。',
    sourceBlockIds: ['block:politics-toc-v2-u011:b009', 'block:politics-toc-v2-u011:b010', 'block:politics-toc-v2-u011:b011'],
    emphasis: [],
  };
  ecology.reflection = {
    prompt: ecology.question,
    answer: '三类对象分别是：力争2030年前实现碳达峰、努力争取2060年前实现碳中和；生态保护红线、永久基本农田、城镇开发边界；以国家公园为主体、自然保护区为基础、各类自然公园为补充的自然保护地体系。',
    sourceBlockIds: [...ecology.recap.sourceBlockIds],
  };
  ecology.corePromises = [
    { quote: '2030年前', sourceBlockIds: ['block:politics-toc-v2-u011:b009'] },
    { quote: '2060年前', sourceBlockIds: ['block:politics-toc-v2-u011:b009'] },
    { quote: '生态保护红线、永久基本农田、城镇开发边界', sourceBlockIds: ['block:politics-toc-v2-u011:b010'] },
    { quote: '国家公园', sourceBlockIds: ['block:politics-toc-v2-u011:b011'] },
    { quote: '自然保护区', sourceBlockIds: ['block:politics-toc-v2-u011:b011'] },
    { quote: '自然公园', sourceBlockIds: ['block:politics-toc-v2-u011:b011'] },
  ];

  const party = lessons['PARTY-03'];
  party.question = '不敢腐、不能腐、不想腐为什么要一体推进，它们与党的自我革命是什么关系？';
  party.objectives = ['说明不敢腐、不能腐、不想腐的作用及其与自我革命的关系'];
  party.scopeLimit = '学习重点：不敢腐、不能腐、不想腐为什么要一体推进，它们与党的自我革命是什么关系。不展开自我革命实践要求的细目。';
  party.sections = [
    {
      label: '不敢腐强化震慑',
      text: '不敢腐依靠强大震慑。',
      sourceBlockIds: ['block:politics-toc-v2-u014:b027'],
      emphasis: [{ part: 'text', quote: '不敢腐依靠强大震慑', occurrence: 1, role: 'key' }],
    },
    {
      label: '不能腐强化制度约束',
      text: '不能腐依靠刚性制度约束。',
      sourceBlockIds: ['block:politics-toc-v2-u014:b027'],
      emphasis: [{ part: 'text', quote: '不能腐依靠刚性制度约束', occurrence: 1, role: 'key' }],
    },
    {
      label: '不想腐发挥思想教育优势',
      text: '不想腐发挥思想教育优势。',
      sourceBlockIds: ['block:politics-toc-v2-u014:b027'],
      emphasis: [{ part: 'text', quote: '不想腐发挥思想教育优势', occurrence: 1, role: 'key' }],
    },
    {
      label: '一体推进服务党的自我革命',
      text: '震慑、制度约束和思想教育作用不同，需要一体推进、同时发力。反腐败是最彻底的自我革命，三不腐共同服务于党的自我革命。',
      sourceBlockIds: ['block:politics-toc-v2-u014:b026', 'block:politics-toc-v2-u014:b027'],
      emphasis: [
        { part: 'text', quote: '需要一体推进、同时发力', occurrence: 1, role: 'key' },
        { part: 'text', quote: '反腐败是最彻底的自我革命', occurrence: 1, role: 'key' },
        { part: 'text', quote: '三不腐共同服务于党的自我革命', occurrence: 1, role: 'key' },
      ],
    },
  ];
  delete party.boundary;
  party.recap = {
    label: '本节结论',
    text: '不敢腐强化震慑，不能腐强化制度约束，不想腐发挥思想教育优势；三者作用不同，需要一体推进、共同发力，并共同服务于党的自我革命。',
    sourceBlockIds: ['block:politics-toc-v2-u014:b026', 'block:politics-toc-v2-u014:b027'],
    emphasis: [],
  };
  party.reflection = {
    prompt: party.question,
    answer: '不敢腐靠震慑，不能腐靠制度约束，不想腐靠思想教育；三者从不同方面共同发力，一体推进并服务于党的自我革命。',
    sourceBlockIds: [...party.recap.sourceBlockIds],
  };
  party.corePromises = [
    { quote: '震慑', sourceBlockIds: ['block:politics-toc-v2-u014:b027'] },
    { quote: '制度约束', sourceBlockIds: ['block:politics-toc-v2-u014:b027'] },
    { quote: '思想教育', sourceBlockIds: ['block:politics-toc-v2-u014:b027'] },
    { quote: '自我革命', sourceBlockIds: ['block:politics-toc-v2-u014:b026'] },
  ];

  const foreign = lessons['UNITYFOREIGN-03'];
  foreign.question = '人类命运共同体的目标和实现框架分别是什么？';
  foreign.objectives = ['说明人类命运共同体的目标与实现框架'];
  foreign.scopeLimit = '学习重点：人类命运共同体的目标和实现框架分别是什么。不补写时事进展。';
  foreign.sections = [
    {
      label: '人类命运共同体的目标',
      text: '推动构建人类命运共同体，目标是建设持久和平、普遍安全、共同繁荣、开放包容、清洁美丽的世界。',
      sourceBlockIds: ['block:politics-toc-v2-u019:b009'],
      emphasis: [{ part: 'text', quote: '持久和平、普遍安全、共同繁荣、开放包容、清洁美丽', occurrence: 1, role: 'key' }],
    },
    {
      label: '人类命运共同体的实现框架',
      text: '实现这一目标，以共商共建共享全球治理为路径、全人类共同价值为遵循、新型国际关系为支撑，全球发展倡议、全球安全倡议、全球文明倡议为战略引领，高质量共建“一带一路”为实践平台。',
      sourceBlockIds: ['block:politics-toc-v2-u019:b009'],
      emphasis: [
        { part: 'text', quote: '共商共建共享全球治理为路径', occurrence: 1, role: 'key' },
        { part: 'text', quote: '全人类共同价值为遵循', occurrence: 1, role: 'key' },
        { part: 'text', quote: '新型国际关系为支撑', occurrence: 1, role: 'key' },
        { part: 'text', quote: '全球发展倡议、全球安全倡议、全球文明倡议为战略引领', occurrence: 1, role: 'key' },
        { part: 'text', quote: '高质量共建“一带一路”为实践平台', occurrence: 1, role: 'key' },
      ],
    },
  ];
  delete foreign.boundary;
  foreign.recap = {
    label: '本节结论',
    text: '人类命运共同体以建设持久和平、普遍安全、共同繁荣、开放包容、清洁美丽的世界为目标，以共商共建共享全球治理为路径，并由共同价值、新型国际关系、三大全球倡议和共建“一带一路”提供遵循、支撑、引领与实践平台。',
    sourceBlockIds: ['block:politics-toc-v2-u019:b009'],
    emphasis: [],
  };
  foreign.reflection = {
    prompt: foreign.question,
    answer: '目标是建设持久和平、普遍安全、共同繁荣、开放包容、清洁美丽的世界；实现框架以共商共建共享全球治理为路径、全人类共同价值为遵循、新型国际关系为支撑、三大全球倡议为战略引领、共建“一带一路”为实践平台。',
    sourceBlockIds: [...foreign.recap.sourceBlockIds],
  };
  foreign.corePromises = [
    { quote: '持久和平、普遍安全、共同繁荣、开放包容、清洁美丽', sourceBlockIds: ['block:politics-toc-v2-u019:b009'] },
    { quote: '共商共建共享', sourceBlockIds: ['block:politics-toc-v2-u019:b009'] },
    { quote: '实践平台', sourceBlockIds: ['block:politics-toc-v2-u019:b009'] },
  ];

  const money = lessons['MONEY-02'];
  money.objectives = ['分别说明贮藏手段、支付手段和世界货币发挥作用的条件'];
  money.sections = [
    {
      label: '贮藏手段',
      text: '贮藏手段指货币退出流通，作为社会财富的一般代表保存起来。在金属货币理论口径下，它必须是足值金属货币或金属条块。',
      sourceBlockIds: ['block:politics-toc-v2-u036:b009', 'block:politics-toc-v2-u036:b010'],
      emphasis: [
        { part: 'text', quote: '退出流通', occurrence: 1, role: 'key' },
        { part: 'text', quote: '必须是足值金属货币或金属条块', occurrence: 1, role: 'key' },
      ],
    },
    {
      label: '支付手段',
      text: '支付手段用于赊购赊销、清偿债务，也用于租金、税金、工资等支付关系，重点是货币用于履行支付义务。',
      sourceBlockIds: ['block:politics-toc-v2-u036:b011', 'block:politics-toc-v2-u036:b012'],
      emphasis: [{ part: 'text', quote: '赊购赊销、清偿债务', occurrence: 1, role: 'key' }],
    },
    {
      label: '世界货币',
      text: '世界货币在国际商品流通中发挥一般等价物作用，重点是货币进入国际流通领域。',
      sourceBlockIds: ['block:politics-toc-v2-u036:b013'],
      emphasis: [{ part: 'text', quote: '在国际商品流通中发挥一般等价物作用', occurrence: 1, role: 'key' }],
    },
  ];
  delete money.boundary;
  money.recap = {
    label: '本节结论',
    text: '贮藏手段强调货币退出流通并保存，在金属货币理论口径下以足值金属货币或金属条块为条件；支付手段用于赊购赊销、清偿债务等支付关系；世界货币在国际商品流通中发挥一般等价物作用。',
    sourceBlockIds: ['block:politics-toc-v2-u036:b009', 'block:politics-toc-v2-u036:b010', 'block:politics-toc-v2-u036:b011', 'block:politics-toc-v2-u036:b012', 'block:politics-toc-v2-u036:b013'],
    emphasis: [],
  };
  money.reflection = {
    prompt: money.question,
    answer: '贮藏手段是货币退出流通并保存，在金属货币理论口径下要求足值金属货币或金属条块；支付手段用于赊购赊销、债务等支付关系；世界货币在国际商品流通中发挥一般等价物作用。',
    sourceBlockIds: [...money.recap.sourceBlockIds],
  };
  money.corePromises = [
    { quote: '足值金属货币或金属条块', sourceBlockIds: ['block:politics-toc-v2-u036:b010'] },
    { quote: '赊购赊销、清偿债务', sourceBlockIds: ['block:politics-toc-v2-u036:b011', 'block:politics-toc-v2-u036:b012'] },
    { quote: '国际商品流通', sourceBlockIds: ['block:politics-toc-v2-u036:b013'] },
  ];

  source.progressCompatibleVersions = [...new Set([
    ...(source.progressCompatibleVersions || []), predecessor.curriculumVersion,
  ])];
  assert.deepEqual(source.lessons.map(item => item.id), lessonIdsBefore);
  const used = new Set(source.lessons.flatMap(item => visibleParts(item, true).flatMap(part => part.sourceBlockIds)));
  source.sourceBindings = source.sourceBindings.filter(binding => used.has(binding.blockId));
  updateInventory(inventory, source);
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = JSON.stringify(source, null, 2) + '\n';
  const inventoryText = JSON.stringify(inventory, null, 2) + '\n';
  const runtimeText = '// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ' + JSON.stringify(runtime) + ';\n';
  fs.writeFileSync(absolute(files.source), sourceText);
  fs.writeFileSync(absolute(files.inventory), inventoryText);
  fs.writeFileSync(absolute(files.runtime), runtimeText);
  fs.writeFileSync(absolute(files.reading), renderReading(source));

  let lineage = fs.readFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), 'utf8');
  const evidenceName = batch + '-20261024.json';
  if (!lineage.includes(evidenceName)) {
    lineage = lineage.replace(
      "  'politics-systematic-user-comprehension-uc7b-p7-20261024.json',",
      "  'politics-systematic-user-comprehension-uc7b-p7-20261024.json',\n  '" + evidenceName + "',",
    );
    fs.writeFileSync(absolute('scripts/lib/politics-systematic-user-comprehension-lineage.js'), lineage);
  }

  const ai = optional(files.aiReview);
  const probe = optional(files.runtimeProbe);
  const retrospective = optional(files.retrospective);
  const sourceHash = sha256(Buffer.from(sourceText));
  const aiPassed = ai?.curriculumVersion === runtime.curriculumVersion
    && ai?.sourceSha256 === sourceHash
    && ai?.projectionSha256 === digest(files.projection)
    && ['ai-first-user', 'ai-subject-expert', 'ai-assessment-expert'].every(roleId =>
      ai.roles?.[roleId]?.status === 'pass' && ai.roles[roleId].riskCount === 0 && ai.roles[roleId].holdCount === 0);
  const runtimePassed = probe?.status === 'passed'
    && probe?.curriculumVersion === runtime.curriculumVersion
    && contentChangedLessonIds.every(id => probe.lessonIds?.includes(id));
  const retrospectiveBound = retrospective?.curriculumVersion === runtime.curriculumVersion
    && retrospective?.sourceSha256 === sourceHash
    && retrospective?.projectionSha256 === digest(files.projection);
  const evidence = {
    schemaVersion: 1,
    batchId: batch,
    generatedAt: '2026-10-24',
    status: aiPassed && runtimePassed && retrospectiveBound
      ? 'candidate-integrated-and-runtime-verified-retrospective-open'
      : aiPassed && runtimePassed ? 'candidate-integrated-and-runtime-verified'
        : aiPassed ? 'candidate-integrated-ai-passed-runtime-pending'
          : 'candidate-integrated-review-pending',
    previousCurriculumVersion: predecessor.curriculumVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
    stableLessonIds: true,
    orderChanged: false,
    contentChangedLessonIds,
    uiProjectionAffectedLessonIds: contentChangedLessonIds,
    probeLessonIds: contentChangedLessonIds,
    issueIds: ['UC7B-P8-BOUNDARY-FUSION', 'UC7B-P8-THEME-END-CONCLUSION', 'UC7B-P8-KEY-POINT-SALIENCE'],
    contractRules: [13, 14, 17, 23, 27, 29, 32, 34, 35, 38, 39, 41, 42],
    diagnosis: {
      selection: '选取剩余优先级最高的五个主题末节，继续处理独立辨析、跨节总结和重点映射问题。',
      boundaryDecision: '五节独立辨析中的必要条件均并入对应正文，其余重复内容删除，主答案不缺失。',
      conclusionDecision: '五个主题末节结论均改为直接回答当前设问，不再承担跨节编排总结。',
      emphasisDecision: '定义、关系、正式成员与成立条件均映射到正文可见重点。',
    },
    before,
    after: Object.fromEntries(contentChangedLessonIds.map(id => [id, snapshot(lessons[id])])),
    sourcePath: files.source,
    sourceSha256: sourceHash,
    inventoryPath: files.inventory,
    inventorySha256: sha256(Buffer.from(inventoryText)),
    runtimePath: files.runtime,
    runtimeSha256: sha256(Buffer.from(runtimeText)),
    projectionPath: files.projection,
    projectionSha256: digest(files.projection),
    readingPath: files.reading,
    aiReview: aiPassed ? 'passed' : 'pending',
    aiReviewPath: aiPassed ? files.aiReview : null,
    aiReviewSha256: aiPassed ? digest(files.aiReview) : null,
    runtimePageCheck: runtimePassed ? 'passed' : 'pending',
    runtimeProbePath: runtimePassed ? files.runtimeProbe : null,
    runtimeProbeSha256: runtimePassed ? digest(files.runtimeProbe) : null,
    retrospectiveAudit: retrospectiveBound ? 'open' : 'pending',
    retrospectiveAuditPath: retrospectiveBound ? files.retrospective : null,
    retrospectiveAuditSha256: retrospectiveBound ? digest(files.retrospective) : null,
    realUserAcceptance: 'pending',
    retainedHoldLessonIds: ['CAPITAL-02'],
    releaseAuthorized: false,
  };
  write(files.evidence, evidence);
  console.log(JSON.stringify({
    status: evidence.status,
    previousCurriculumVersion: evidence.previousCurriculumVersion,
    curriculumVersion: evidence.curriculumVersion,
    changedLessonIds: contentChangedLessonIds,
    aiReview: evidence.aiReview,
    runtimePageCheck: evidence.runtimePageCheck,
    retrospectiveAudit: evidence.retrospectiveAudit,
  }));
}

main();
