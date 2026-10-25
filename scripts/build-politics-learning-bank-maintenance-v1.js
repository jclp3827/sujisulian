#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DATE = '2026-10-21';
const OBJECTIVES_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';
const CONFUSION_PATH = 'docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json';
const EXPANSION_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-bank-expansion-v1.json';
const RUNTIME_SOURCE_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';

const absolute = (relativePath) => path.join(ROOT, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const sha256 = (relativePath) => crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex');
const normalize = (text = '') => text.replace(/[\s，。！？；：、“”‘’（）《》·,.!?;:()]/g, '');

const SPECS = [
  {
    slug: 'u005-leadership-not-takeover', unitId: 'politics-toc-v2-u005', objectiveId: 'pol-obj-leadership-01-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u005:qa',
    prompt: '判断并纠正：“党领导一切，就是党组织包揽所有具体事务。”',
    answer: '错误。党的领导制度居于统领地位，但不等于党组织取代国家机关、包揽所有具体事务。',
    sourceBlockIds: ['block:politics-toc-v2-u005:b016'], requiredSourcePhrases: ['不等于包揽一切', '不能与具体国家机关职能混同'],
  },
  {
    slug: 'u006-common-prosperity-average', unitId: 'politics-toc-v2-u006', objectiveId: 'pol-obj-leadership-03-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u006:qa',
    prompt: '判断并纠正：“共同富裕就是所有人、所有地区同步达到同一水平。”',
    answer: '错误。共同富裕不是整齐划一的平均主义，也不要求所有人和所有地区同时达到同一水平。',
    sourceBlockIds: ['block:politics-toc-v2-u006:b024'], requiredSourcePhrases: ['不是少数人的富裕', '不要求所有人和所有地区同时达到同一水平'],
  },
  {
    slug: 'u008-democracy-election-only', unitId: 'politics-toc-v2-u008', objectiveId: 'pol-obj-democracy-02-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u008:qa',
    prompt: '判断并纠正：“人民民主只体现在选举时的参与。”',
    answer: '错误。全过程人民民主不是只在选举时参与，还应在党的领导和依法治国框架下贯穿全过程。',
    sourceBlockIds: ['block:politics-toc-v2-u008:b035'], requiredSourcePhrases: ['不是只在选举时参与', '不能脱离党的领导和依法治国'],
  },
  {
    slug: 'u009-culture-not-closed', unitId: 'politics-toc-v2-u009', objectiveId: 'pol-obj-cultureeco-01-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u009:qa',
    prompt: '判断并纠正：“坚定文化自信，就是排斥其他文明成果。”',
    answer: '错误。文化自信不是文化封闭，需要统一守正与创新、民族性与开放性。',
    sourceBlockIds: ['block:politics-toc-v2-u009:b013'], requiredSourcePhrases: ['文化自信不是文化封闭', '民族性与开放性需要统一'],
  },
  {
    slug: 'u011-ecology-not-stop', unitId: 'politics-toc-v2-u011', objectiveId: 'pol-obj-cultureeco-03-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u011:qa',
    prompt: '判断并纠正：“保护生态环境，就应当停止经济发展。”',
    answer: '错误。生态保护与经济发展不是简单对立，绿色发展强调在保护中发展、在发展中保护。',
    sourceBlockIds: ['block:politics-toc-v2-u011:b012'], requiredSourcePhrases: ['不是简单对立关系', '在保护中发展、在发展中保护'],
  },
  {
    slug: 'u012-reform-not-change-nature', unitId: 'politics-toc-v2-u012', objectiveId: 'pol-obj-reformlaw-01-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u012:qa',
    prompt: '判断并纠正：“改革就是改变中国特色社会主义制度的根本性质。”',
    answer: '错误。改革是社会主义制度的自我完善和发展，目的是推动制度更加成熟定型。',
    sourceBlockIds: ['block:politics-toc-v2-u012:b004', 'block:politics-toc-v2-u012:b015'], requiredSourcePhrases: ['自我完善和发展', '不是改变中国特色社会主义制度的根本性质'],
  },
  {
    slug: 'u016-security-not-single', unitId: 'politics-toc-v2-u016', objectiveId: 'pol-obj-security-01-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u016:qa',
    prompt: '判断并纠正：“总体国家安全只指军事安全和国土安全。”',
    answer: '错误。总体国家安全覆盖多个领域，是强调系统统筹的安全体系，不能缩减为单一传统安全。',
    sourceBlockIds: ['block:politics-toc-v2-u016:b012'], requiredSourcePhrases: ['不是单一军事或国土安全', '覆盖多领域'],
  },
  {
    slug: 'u019-peace-not-abandon-interest', unitId: 'politics-toc-v2-u019', objectiveId: 'pol-obj-unityforeign-03-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u019:qa',
    prompt: '判断并纠正：“坚持和平发展，就不能维护国家核心利益。”',
    answer: '错误。和平发展不等于放弃维护国家主权、安全和发展利益，独立自主也不等于孤立主义。',
    sourceBlockIds: ['block:politics-toc-v2-u019:b010'], requiredSourcePhrases: ['不等于孤立主义', '不等于放弃维护国家主权、安全和发展利益'],
  },
  {
    slug: 'u020-parts-not-sources', unitId: 'politics-toc-v2-u020', objectiveId: 'pol-obj-basics-01-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u020:qa',
    prompt: '判断并纠正：“马克思主义三个组成部分就是三项直接理论来源。”',
    answer: '错误。三个组成部分是哲学、政治经济学和科学社会主义；三项直接来源是德国古典哲学、英国古典政治经济学和英法空想社会主义。',
    sourceBlockIds: ['block:politics-toc-v2-u020:b004', 'block:politics-toc-v2-u020:b010'], requiredSourcePhrases: ['三个组成部分', '三项直接理论来源与三个组成部分不是同一组概念'],
  },
  {
    slug: 'u026-negation-not-total', unitId: 'politics-toc-v2-u026', objectiveId: 'pol-obj-dialectics-06-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u026:qa',
    prompt: '判断并纠正：“辩证否定就是依靠外力把旧事物全部抛弃。”',
    answer: '错误。辩证否定是内部矛盾产生的自我否定；扬弃既克服消极因素，也保留并发展积极因素。',
    sourceBlockIds: ['block:politics-toc-v2-u026:b011'], requiredSourcePhrases: ['自我否定', '既不是全盘抛弃'],
  },
  {
    slug: 'u027-practice-not-personal-only', unitId: 'politics-toc-v2-u027', objectiveId: 'pol-obj-cognition-01-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u027:qa',
    prompt: '判断并纠正：“实践是认识来源，所以一切认识都必须来自个人亲身实践。”',
    answer: '错误。实践是认识的来源，不等于每个人的一切认识都必须来自亲身实践；间接经验最终也源于实践。',
    sourceBlockIds: ['block:politics-toc-v2-u027:b023'], requiredSourcePhrases: ['不等于每个人的一切认识都必须来自亲身实践'],
  },
  {
    slug: 'u030-consciousness-not-independent', unitId: 'politics-toc-v2-u030', objectiveId: 'pol-obj-history-01-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u030:qa',
    prompt: '判断并纠正：“社会意识具有相对独立性，所以不再由社会存在决定。”',
    answer: '错误。相对独立性不否定社会存在的决定作用，社会意识的反作用仍需通过社会实践实现。',
    sourceBlockIds: ['block:politics-toc-v2-u030:b013'], requiredSourcePhrases: ['并不否定社会存在的决定作用', '必须通过社会实践实现'],
  },
];

function main() {
  const sourcePackage = require(absolute(RUNTIME_SOURCE_PATH));
  const { createPoliticsAdapter } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const pkg = createPoliticsAdapter(sourcePackage).buildPackage();
  const objectives = readJson(OBJECTIVES_PATH);
  const confusion = readJson(CONFUSION_PATH);
  const expansion = readJson(EXPANSION_PATH);
  const blocks = new Map(pkg.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => [block.id, block])));
  const units = new Set(pkg.knowledgeUnits.map((unit) => unit.id));
  const objectiveIds = new Set(objectives.objectives.map((item) => item.objectiveId));
  const signals = Object.values(confusion.candidateLedger).flat();
  const signalById = new Map(signals.map((item) => [item.signalId, item]));
  const seedRecall = readJson('docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json');
  const existingCards = [...seedRecall.cards, ...expansion.recallCards];
  const existingPrompts = new Set(existingCards.map((card) => normalize(card.prompt)));

  const cards = SPECS.map((spec, index) => {
    if (!units.has(spec.unitId)) throw new Error(`${spec.slug}: missing unit`);
    if (!objectiveIds.has(spec.objectiveId)) throw new Error(`${spec.slug}: missing objective`);
    const signal = signalById.get(spec.signalId);
    if (!signal || signal.disposition !== 'held-within-unit-distinction') throw new Error(`${spec.slug}: invalid source signal`);
    spec.sourceBlockIds.forEach((id) => {
      const block = blocks.get(id);
      if (!block || block.unitId !== spec.unitId) throw new Error(`${spec.slug}: invalid source ${id}`);
    });
    const sourceText = spec.sourceBlockIds.map((id) => blocks.get(id).fallbackText).join('\n');
    spec.requiredSourcePhrases.forEach((phrase) => {
      if (!sourceText.includes(phrase)) throw new Error(`${spec.slug}: source phrase unavailable: ${phrase}`);
    });
    if (existingPrompts.has(normalize(spec.prompt))) throw new Error(`${spec.slug}: duplicate runtime prompt`);
    return {
      cardId: `politics-recall-maintenance-v1-${spec.slug}`,
      status: 'maintenance-reviewed',
      origin: 'maintenance-b11',
      sourceRecallItemId: null,
      replacesRecallItemId: null,
      unitId: spec.unitId,
      primaryObjectiveId: spec.objectiveId,
      supportingObjectiveIds: [],
      cardType: 'error-correction',
      difficulty: 'standard',
      importance: 'high-frequency-boundary',
      prompt: spec.prompt,
      answer: spec.answer,
      answerCharacterCount: [...spec.answer].length,
      sourceBlockIds: spec.sourceBlockIds,
      errorExplanation: '',
      errorSourceBlockIds: [],
      remedy: { unitId: spec.unitId, sourceBlockIds: spec.sourceBlockIds },
      freshness: [],
      reviewState: 'b11-maintenance-reviewed',
      maintenanceCycle: 'B11',
      sourceSignalId: spec.signalId,
      order: index + 1,
    };
  });

  const duplicateIds = cards.map((card) => card.cardId).filter((id, index, all) => all.indexOf(id) !== index);
  const duplicatePrompts = cards.map((card) => normalize(card.prompt)).filter((value, index, all) => all.indexOf(value) !== index);
  const answersOver70Characters = cards.filter((card) => card.answerCharacterCount > 70).map((card) => card.cardId);
  const selectedSignals = new Set(cards.map((card) => card.sourceSignalId));
  const heldWithinSignals = signals.filter((item) => item.disposition === 'held-within-unit-distinction');
  const validation = {
    baseRuntimeRecallCards: 90,
    addedRecallCards: cards.length,
    runtimeRecallCardsAfterPromotion: 90 + cards.length,
    runtimeConfusionItemsAfterPromotion: 14,
    selectedHeldSignals: selectedSignals.size,
    remainingHeldSignalsWithoutNewTask: heldWithinSignals.length - selectedSignals.size,
    directlyProjectedObjectivesAfterPromotion: 83,
    duplicateCardIds: duplicateIds,
    duplicatePrompts,
    answersOver70Characters,
  };
  validation.passed = cards.length === 12
    && selectedSignals.size === 12
    && validation.remainingHeldSignalsWithoutNewTask === 55
    && !duplicateIds.length
    && !duplicatePrompts.length
    && !answersOver70Characters.length;

  const artifact = {
    schemaVersion: 1,
    id: 'politics-learning-bank-maintenance-v1',
    buildDate: BUILD_DATE,
    status: 'maintenance-reviewed-return-to-maintenance',
    trigger: 'explicit-product-direction-for-one-bounded-next-group',
    scope: 'One bounded B11 error-correction expansion from previously held within-unit signals; current 37-unit source scope only.',
    authority: {
      sourcePackageVersion: sourcePackage.packageVersion,
      sourcePackageSha256: sha256(RUNTIME_SOURCE_PATH),
      objectivesArtifactSha256: sha256(OBJECTIVES_PATH),
      confusionArtifactSha256: sha256(CONFUSION_PATH),
      expansionArtifactSha256: sha256(EXPANSION_PATH),
    },
    cycle: { id: 'B11', name: 'maintenance error-correction batch', recallCards: cards.length, confusionItems: 0, status: 'accepted-and-promoted' },
    recallCards: cards,
    disposition: {
      reviewedHeldWithinSignals: heldWithinSignals.length,
      acceptedAsDistinctErrorCorrection: selectedSignals.size,
      remainingWithoutDistinctNewTask: heldWithinSignals.length - selectedSignals.size,
      rule: 'A boundary becomes a new card only when it forms a concise, independently scorable correction that is not already tested by the 90-card runtime.',
    },
    exitDecision: {
      mode: 'maintenance',
      triggeredBy: 'bounded-user-directed-maintenance-batch-complete',
      rationale: 'Twelve source-explicit high-frequency errors formed distinct correction tasks; the other held signals remain duplicates, explanation boundaries, or non-scorable distinctions.',
      reopenOnlyFor: ['new formal source coverage', 'syllabus or authoritative wording change', 'repeated user error with a source-supported missing task', 'correction of an existing item', 'explicit product decision for one bounded maintenance review'],
    },
    validation,
  };

  process.stdout.write(`${JSON.stringify(artifact, null, 2)}\n`);
  if (!validation.passed) process.exitCode = 1;
}

main();
