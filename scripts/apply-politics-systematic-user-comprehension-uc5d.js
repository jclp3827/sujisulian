const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const files = {
  source: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json',
  inventory: 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json',
  reading: 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md',
  runtime: 'miniprogram/models/politics-systematic-units-runtime.js',
  evidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc5d-20261023.json',
  aiReview: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc5d-ai-review-20261023.json',
  predecessorEvidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc5c-20261023.json',
};
const absolute = file => path.join(root, file);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function lesson(source, id) {
  const value = source.lessons.find(item => item.id === id);
  assert.ok(value, `missing lesson ${id}`);
  return value;
}

function main() {
  const source = JSON.parse(fs.readFileSync(absolute(files.source), 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(absolute(files.inventory), 'utf8'));
  const predecessorEvidence = JSON.parse(fs.readFileSync(absolute(files.predecessorEvidence), 'utf8'));
  const inputSourceSha256 = predecessorEvidence.sourceSha256;
  const previousVersion = predecessorEvidence.curriculumVersion;
  const beforeIds = source.lessons.map(item => item.id);
  const changed = new Set();

  const ten01 = lesson(source, 'TEN-01');
  ten01.reflection = {
    prompt: '“十个明确”第1至3条包括哪些内容？',
    answer: '第1条明确党的领导，第2条明确实现社会主义现代化和中华民族伟大复兴的总任务，第3条明确新时代社会主要矛盾并提出以人民为中心等要求。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b005', 'block:politics-toc-v2-u003:b006', 'block:politics-toc-v2-u003:b007'],
  };
  changed.add(ten01.id);

  const value01 = lesson(source, 'VALUE-01');
  value01.reflection = {
    prompt: '使用价值与价值是什么关系？',
    answer: '使用价值和价值是商品的两个因素。使用价值是价值的物质承担者，价值通过使用价值表现出来，商品必须同时具有二者。',
    sourceBlockIds: ['block:politics-toc-v2-u033:b003', 'block:politics-toc-v2-u033:b012'],
  };
  changed.add(value01.id);

  const value02 = lesson(source, 'VALUE-02');
  value02.sections[0].label = '商品二因素与劳动二重性';
  changed.add(value02.id);

  const dev02 = lesson(source, 'DEV-02');
  dev02.reflection = {
    prompt: '创新、协调、绿色、开放、共享分别解决什么问题？',
    answer: '创新解决发展动力问题，协调解决发展不平衡问题，绿色解决人与自然和谐共生问题，开放解决发展内外联动问题，共享解决社会公平正义问题。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b009', 'block:politics-toc-v2-u007:b010', 'block:politics-toc-v2-u007:b011', 'block:politics-toc-v2-u007:b012', 'block:politics-toc-v2-u007:b013'],
  };
  changed.add(dev02.id);

  const mod03 = lesson(source, 'MOD-03');
  mod03.objectives = ['认识九项本质要求与五项重大原则', '区分本质要求与重大原则的作用'];
  mod03.recap.text = '本质要求说明中国式现代化要达到什么、坚持什么，重大原则说明推进中国式现代化必须把握什么。二者相互联系，但完整内容和作用不同。';
  mod03.recap.sourceBlockIds = ['block:politics-toc-v2-u004:b024', 'block:politics-toc-v2-u004:b026'];
  mod03.reflection.prompt = '本质要求与重大原则有什么区别？';
  changed.add(mod03.id);

  const sys04 = lesson(source, 'SYS-04');
  sys04.sections[1].label = '人民至上：价值立场；自信自立：精神特质';
  sys04.sections[2].label = '守正创新：理论品格';
  sys04.reflection = {
    prompt: '人民至上、自信自立、守正创新分别强调什么？',
    answer: '人民至上强调根本价值立场，自信自立强调内在精神特质，守正创新强调鲜明理论品格。三者分别回答价值立场、精神状态和理论发展的要求。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'],
  };
  changed.add(sys04.id);

  const sys05 = lesson(source, 'SYS-05');
  sys05.question = '问题导向、系统观念与胸怀天下分别强调什么？';
  sys05.scopeLimit = '学习重点：问题导向、系统观念与胸怀天下分别强调什么。不据此宣称已掌握具体领域的完整分析方法。';
  sys05.boundary.text = '问题导向、系统观念、胸怀天下分别强调面对问题、把握联系和拓展人类进步视野，不构成固定的先后操作流程。';
  sys05.boundary.sourceBlockIds = ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'];
  sys05.recap.text = '问题导向、系统观念和胸怀天下分别从实际问题、普遍联系和人类进步视野提供方法要求，三者含义不同，共同构成六个必须坚持的后三项。';
  sys05.recap.sourceBlockIds = ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'];
  sys05.reflection = {
    prompt: '问题导向、系统观念与胸怀天下分别强调什么？',
    answer: '问题导向强调正视并解决实际问题，系统观念强调从普遍联系把握整体，胸怀天下强调面向人类进步和解放的境界格局。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'],
  };
  changed.add(sys05.id);

  const livelihood02 = lesson(source, 'LIVELIHOOD-02');
  livelihood02.question = '社会保障与健康建设分别承担什么？';
  livelihood02.scopeLimit = '学习重点：社会保障与健康建设分别承担什么。不展开具体措施。';
  livelihood02.reflection = {
    prompt: '社会保障与健康建设分别承担什么？',
    answer: '社会保障通过社会保险、社会福利、社会救济和社会优抚等构成风险保障体系；健康建设以人民健康为目标，强调预防为主。二者分别提供风险保障和健康支持。',
    sourceBlockIds: ['block:politics-toc-v2-u010:b015', 'block:politics-toc-v2-u010:b016', 'block:politics-toc-v2-u010:b017', 'block:politics-toc-v2-u010:b018', 'block:politics-toc-v2-u010:b019', 'block:politics-toc-v2-u010:b020', 'block:politics-toc-v2-u010:b022', 'block:politics-toc-v2-u010:b023'],
  };
  changed.add(livelihood02.id);

  const reformlaw03 = lesson(source, 'REFORMLAW-03');
  reformlaw03.question = '三种依法行为与三种法治建设是什么关系？';
  reformlaw03.scopeLimit = '学习重点：三种依法行为与三种法治建设是什么关系。不展开历史材料与实施细目。';
  reformlaw03.recap.text = '三种依法行为需要共同推进，三种法治建设需要一体建设；两组表述分别说明行动方式与建设方面，共同服务法治中国建设。';
  reformlaw03.recap.sourceBlockIds = ['block:politics-toc-v2-u013:b014', 'block:politics-toc-v2-u013:b020'];
  reformlaw03.reflection = {
    prompt: '三种依法行为与三种法治建设是什么关系？',
    answer: '依法治国、依法执政、依法行政共同推进，法治国家、法治政府、法治社会一体建设。前一组说明依法行为，后一组说明建设方面，两组共同推进法治中国建设。',
    sourceBlockIds: ['block:politics-toc-v2-u013:b014', 'block:politics-toc-v2-u013:b020'],
  };
  changed.add(reformlaw03.id);

  const cultureeco04 = lesson(source, 'CULTUREECO-04');
  cultureeco04.boundary.text = '绿色发展理念、碳达峰碳中和时间目标、三条空间控制线与自然保护地体系分别说明发展方向、时间节点、空间边界和保护体系，不能互相替代。';
  cultureeco04.reflection = {
    prompt: '碳目标、三条控制线和自然保护地体系分别是什么？',
    answer: '碳目标是力争2030年前实现碳达峰、努力争取2060年前实现碳中和；三条控制线是生态保护红线、永久基本农田、城镇开发边界；自然保护地体系以国家公园为主体、自然保护区为基础、各类自然公园为补充。',
    sourceBlockIds: ['block:politics-toc-v2-u011:b009', 'block:politics-toc-v2-u011:b010', 'block:politics-toc-v2-u011:b011'],
  };
  changed.add(cultureeco04.id);

  const party03 = lesson(source, 'PARTY-03');
  party03.boundary.sourceBlockIds = [...new Set([...party03.boundary.sourceBlockIds, 'block:politics-toc-v2-u014:b027'])];
  party03.reflection.sourceBlockIds = ['block:politics-toc-v2-u014:b027'];
  changed.add(party03.id);

  const security02 = lesson(source, 'SECURITY-02');
  security02.recap.sourceBlockIds = ['block:politics-toc-v2-u016:b003', 'block:politics-toc-v2-u016:b008', 'block:politics-toc-v2-u016:b009', 'block:politics-toc-v2-u016:b010'];
  security02.reflection = {
    prompt: '防范化解风险和公共安全预防各强调什么？',
    answer: '防范化解国家安全风险强调防控可能迟滞或中断民族复兴进程的全局性风险；公共安全预防强调推动治理模式向事前预防转型。二者对象和任务不同。',
    sourceBlockIds: ['block:politics-toc-v2-u016:b008', 'block:politics-toc-v2-u016:b010'],
  };
  changed.add(security02.id);

  const cognition02 = lesson(source, 'COGNITION-02');
  cognition02.boundary.text = '理性认识依赖感性认识，不能因为理性处于高级阶段便抛弃感性材料；感性认识也不能停留原状而不作深化。理性认识形成后还要回到实践接受检验。';
  cognition02.reflection = {
    prompt: '从感性认识到理性认识之后为什么还没有结束？',
    answer: '理性认识还要回到实践，用于改造世界并接受实践检验。因此，从感性认识上升到理性认识只完成第一次飞跃，认识过程还没有结束。',
    sourceBlockIds: ['block:politics-toc-v2-u027:b015', 'block:politics-toc-v2-u028:b002', 'block:politics-toc-v2-u028:b006'],
  };
  changed.add(cognition02.id);

  const history03 = lesson(source, 'HISTORY-03');
  history03.reflection.answer = '生产力决定生产关系，生产关系的总和构成经济基础；经济基础决定上层建筑，上层建筑反作用于经济基础。生产力与生产关系、经济基础与上层建筑这两对矛盾共同推动社会发展。';
  changed.add(history03.id);

  const money01 = lesson(source, 'MONEY-01');
  money01.reflection.sourceBlockIds = ['block:politics-toc-v2-u036:b005', 'block:politics-toc-v2-u036:b006', 'block:politics-toc-v2-u036:b007', 'block:politics-toc-v2-u036:b008'];
  changed.add(money01.id);

  const money02 = lesson(source, 'MONEY-02');
  money02.question = '贮藏手段、支付手段和世界货币分别在什么条件下发挥作用？';
  money02.scopeLimit = '学习重点：贮藏手段、支付手段和世界货币分别在什么条件下发挥作用。';
  money02.reflection = {
    prompt: '贮藏手段、支付手段和世界货币分别在什么条件下发挥作用？',
    answer: '贮藏手段指货币退出流通并作为社会财富的一般代表保存；支付手段用于赊购赊销、清偿债务以及租金、税金、工资等支付关系；世界货币在国际商品流通中发挥一般等价物作用。',
    sourceBlockIds: ['block:politics-toc-v2-u036:b009', 'block:politics-toc-v2-u036:b010', 'block:politics-toc-v2-u036:b011', 'block:politics-toc-v2-u036:b012', 'block:politics-toc-v2-u036:b013'],
  };
  changed.add(money02.id);

  for (const unit of inventory.units) {
    for (const block of unit.sourceBlocks) {
      const referencingLessons = source.lessons.filter(current =>
        [...current.sections, current.boundary, current.recap, current.reflection]
          .some(part => part.sourceBlockIds.includes(block.blockId)));
      block.sampleLessonIds = referencingLessons.map(current => current.id);
      const inDefault = source.lessons.some(current =>
        [...current.sections, current.boundary, current.recap]
          .some(part => part.sourceBlockIds.includes(block.blockId)));
      block.teachingDisposition = inDefault ? 'default-reference' : block.sampleLessonIds.length ? 'optional-reference' : 'source-only';
    }
  }

  assert.deepEqual(source.lessons.map(item => item.id), beforeIds);
  for (const current of source.lessons) {
    if (current.nextLessonId && current.transition.startsWith('下一节：')) {
      current.transition = `下一节：${lesson(source, current.nextLessonId).title}`;
    }
  }
  source.progressCompatibleVersions = [...new Set([...(source.progressCompatibleVersions || []), previousVersion])];
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = `${JSON.stringify(source, null, 2)}\n`;
  const inventoryText = `${JSON.stringify(inventory, null, 2)}\n`;
  const runtimeText = `// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ${JSON.stringify(runtime)};\n`;

  const aiReview = {
    schemaVersion: 1,
    batchId: 'politics-systematic-user-comprehension-uc5d-ai-review',
    generatedAt: '2026-10-23',
    inputSourceSha256,
    coverage: { themes: 21, userSampleLessons: 22, assessmentSampleLessons: 21, subjectSampleLessons: 21 },
    roles: {
      firstUserAndExamLearner: { pass: 9, risk: 12, hold: 1 },
      assessmentAndContentDesign: { pass: 9, risk: 10, hold: 2 },
      subjectExpert: { pass: 17, risk: 4, hold: 0, sourceReferencesChecked: 801, missingSourceIds: 0 },
    },
    adjudication: {
      implementedLessonIds: [...changed],
      retainedEnumerationTitle: { lessonId: 'TEN-03', title: '十个明确·七', reason: '用户已确认父级对象加中文序号格式' },
      retainedHold: { lessonId: 'CAPITAL-02', reason: '劳动力价值和剩余价值产生机制缺少前置来源；当前仅限缩学习目标，不补造内容' },
      realUserAcceptance: 'pending',
    },
  };
  const aiReviewText = `${JSON.stringify(aiReview, null, 2)}\n`;
  fs.writeFileSync(absolute(files.source), sourceText);
  fs.writeFileSync(absolute(files.inventory), inventoryText);
  fs.writeFileSync(absolute(files.runtime), runtimeText);
  fs.writeFileSync(absolute(files.reading), renderReading(source));
  fs.writeFileSync(absolute(files.aiReview), aiReviewText);

  const evidence = {
    schemaVersion: 1,
    batchId: 'politics-systematic-user-comprehension-uc5d',
    generatedAt: '2026-10-23',
    status: 'candidate-integrated-for-user-test',
    previousCurriculumVersion: previousVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(previousVersion),
    stableLessonIds: true,
    orderChanged: false,
    changedLessonIds: [...changed],
    sourcePath: files.source,
    sourceSha256: sha256(Buffer.from(sourceText)),
    inventoryPath: files.inventory,
    inventorySha256: sha256(Buffer.from(inventoryText)),
    runtimePath: files.runtime,
    runtimeSha256: sha256(Buffer.from(runtimeText)),
    readingPath: files.reading,
    aiReviewPath: files.aiReview,
    aiReviewSha256: sha256(Buffer.from(aiReviewText)),
    retainedHoldLessonIds: ['CAPITAL-02'],
    realUserAcceptance: 'pending',
    releaseAuthorized: false,
  };
  fs.writeFileSync(absolute(files.evidence), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence));
}

main();
