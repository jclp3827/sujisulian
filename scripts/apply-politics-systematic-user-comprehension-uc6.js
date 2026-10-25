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
  evidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc6-20261023.json',
  runtimeProbe: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc6-runtime-probe-20261023.json',
  predecessorEvidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc5d-20261023.json',
};
const absolute = file => path.join(root, file);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function byId(items, id, kind) {
  const value = items.find(item => item.id === id);
  assert.ok(value, `missing ${kind} ${id}`);
  return value;
}

function replace(text, before, after, label) {
  assert.ok(text.includes(before) || text.includes(after), `missing UC6 text for ${label}`);
  return text.includes(before) ? text.replace(before, after) : text;
}

function main() {
  const source = JSON.parse(fs.readFileSync(absolute(files.source), 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(absolute(files.inventory), 'utf8'));
  const predecessor = JSON.parse(fs.readFileSync(absolute(files.predecessorEvidence), 'utf8'));
  const beforeIds = source.lessons.map(item => item.id);
  const changedRoutes = [];
  const changedGroups = [];
  const changedLessons = [];

  const thought = byId(source.routes, 'thought', 'route');
  thought.conclusion.boundary = '完成48节表示已读完当前篇章，不表示已经掌握新时代思想的全部内容、“十三个方面成就”细目或完整考试范围。';
  changedRoutes.push(thought.id);
  const principles = byId(source.routes, 'principles', 'route');
  principles.conclusion.boundary = '科学社会主义没有展开为独立详细课程；理解剩余价值完整机制还需先掌握劳动力价值。读完不表示已经覆盖马克思主义基本原理的完整考试范围。';
  changedRoutes.push(principles.id);

  const groupScopes = {
    ten: '十条的核心含义与职责；不展开全部固定表述和下属术语细目',
    modernization: '目标与阶段、五个中国特色、本质要求和重大原则；不展开战略目标细目',
    leadership: '领导地位与制度、人民立场、共同富裕及分配；不展开制度细目',
    development: '新发展阶段、新发展理念、新发展格局、基本经济制度、政府与市场、乡村振兴、区域与城镇化；不展开具体措施与历史材料',
    livelihood: '就业、分配、社会保障与健康的基本联系；不展开具体措施',
    support: '基础性战略性支撑、教育目标、科技创新与人才评价；不展开具体政策细目',
    democracy: '根本与基本政治制度、全过程人民民主及统一战线的核心关系；不展开制度细目',
    reformlaw: '改革目标、法治道路体系与共同推进的联系；不展开历史材料与实施细目',
    party: '总要求、各项建设的职责与自我革命联系；不展开九项实践要求细目',
    security: '总体国家安全的结构与风险、强军目标和制度；不展开其他领域与历史过程',
    history: '社会存在与社会意识、两对基本矛盾与人民群众作用；不展开详细学派分类',
    capital: '剩余价值的基本定义、两种方法的时间条件及资本分类；完整产生机制需先掌握劳动力价值',
  };
  for (const [id, scope] of Object.entries(groupScopes)) {
    byId(source.groups, id, 'group').scope = scope;
    changedGroups.push(id);
  }
  const unityForeign = byId(source.groups, 'unityforeign', 'group');
  unityForeign.connectionToNext = '统一与对外关系补齐国家发展面对的内外关系，随后可以把新时代思想篇的十四个主题合起来回看。';
  changedGroups.push(unityForeign.id);

  const mod01 = byId(source.lessons, 'MOD-01', 'lesson');
  mod01.sections[1].text = replace(mod01.sections[1].text,
    '中国式现代化是推进民族复兴的方式，当前知识范围不展开其全部内涵。',
    '中国式现代化是推进民族复兴的方式，其完整内涵由后续小节展开。', mod01.id);
  changedLessons.push(mod01.id);

  const sys01 = byId(source.lessons, 'SYS-01', 'lesson');
  sys01.sections[1].text = replace(sys01.sections[1].text,
    '十三个方面成就对新时代伟大实践作出科学总结，展示理论与实践成果；当前知识范围只说明这一定位，不展开十三个方面成就的完整清单。',
    '十三个方面成就对新时代伟大实践作出科学总结，展示理论与实践成果；这一部分只说明其定位，不展开十三个方面成就的完整清单。', sys01.id);
  changedLessons.push(sys01.id);

  const leadership01 = byId(source.lessons, 'LEADERSHIP-01', 'lesson');
  leadership01.boundary.text = replace(leadership01.boundary.text,
    '当前知识范围不展开制度完整清单，也不把学习归纳当作新的正式分类。',
    '党的领导制度不在此展开完整清单，各项制度仍按正式定位理解。', leadership01.id);
  changedLessons.push(leadership01.id);

  const cultureeco04 = byId(source.lessons, 'CULTUREECO-04', 'lesson');
  cultureeco04.sections[0].text = replace(cultureeco04.sections[0].text,
    '当前知识范围不展开核算方法或最新进展。',
    '不展开碳排放核算方法或最新进展。', cultureeco04.id);
  changedLessons.push(cultureeco04.id);

  const party03 = byId(source.lessons, 'PARTY-03', 'lesson');
  party03.boundary.label = '三不腐与全面从严治党';
  party03.boundary.text = '三不腐分别发挥震慑、制度约束和思想教育作用，并共同服务于党的自我革命。九项实践要求不在此逐项展开；全面从严治党不能缩减为反腐败，自我革命也不能只由一个行动概括。';
  changedLessons.push(party03.id);

  const security01 = byId(source.lessons, 'SECURITY-01', 'lesson');
  security01.scopeLimit = '学习重点：人民安全、政治安全与经济安全的定位分别是什么。不展开总体国家安全观的全部领域与措施。';
  changedLessons.push(security01.id);
  const security02 = byId(source.lessons, 'SECURITY-02', 'lesson');
  security02.scopeLimit = '学习重点：防范化解风险和公共安全预防各强调什么。不展开国家安全体系的其他治理任务。';
  changedLessons.push(security02.id);
  const security03 = byId(source.lessons, 'SECURITY-03', 'lesson');
  security03.scopeLimit = '学习重点：强军目标、绝对领导与现代化阶段分别回答什么。不展开强军历史发展过程与其他阶段细目。';
  security03.boundary.text = replace(security03.boundary.text,
    '当前知识范围不展开其历史形成过程。',
    '不展开其历史形成过程。', security03.id);
  changedLessons.push(security03.id);

  const unity02 = byId(source.lessons, 'UNITYFOREIGN-02', 'lesson');
  unity02.sections[0].text = replace(unity02.sections[0].text,
    '现有来源将党中央对对台工作的集中统一领导定位为根本保证，将和平统一、一国两制定位为大政方针，将一个中国原则和“九二共识”定位为政治基础。',
    '党中央对对台工作的集中统一领导是根本保证，和平统一、一国两制是大政方针，一个中国原则和“九二共识”是政治基础。', unity02.id);
  changedLessons.push(unity02.id);

  const unity03 = byId(source.lessons, 'UNITYFOREIGN-03', 'lesson');
  unity03.boundary.text = replace(unity03.boundary.text,
    '本主题按来源说明结构，不声称覆盖全部外交议题。',
    '外交政策、和平发展和人类命运共同体分别说明政策立场、发展道路与共同目标，不覆盖全部外交议题。', unity03.id);
  changedLessons.push(unity03.id);

  const basics01 = byId(source.lessons, 'BASICS-01', 'lesson');
  basics01.boundary.label = '科学社会主义的学习范围';
  basics01.boundary.text = '科学社会主义是马克思主义的组成部分，其理论基础是唯物史观和剩余价值学说，思想来源是英法空想社会主义。学习内容只说明其组成位置、理论基础和思想来源，不展开完整理论体系。';
  basics01.recap.text = '先分清组成、来源、发现与方法，再从哲学基本问题开始进入基本原理。科学社会主义只说明组成位置与范围边界，不以名称出现代替完整讲授。';
  changedLessons.push(basics01.id);

  const history01 = byId(source.lessons, 'HISTORY-01', 'lesson');
  history01.boundary.text = replace(history01.boundary.text,
    '意识形态与非意识形态的具体范围不在当前知识范围展开，',
    '意识形态与非意识形态的具体范围不作展开，', history01.id);
  changedLessons.push(history01.id);

  const money01 = byId(source.lessons, 'MONEY-01', 'lesson');
  money01.boundary.text = replace(money01.boundary.text,
    '当前知识范围不展开货币起源的完整历史，',
    '不展开货币起源的完整历史，', money01.id);
  changedLessons.push(money01.id);

  const capital01 = byId(source.lessons, 'CAPITAL-01', 'lesson');
  capital01.scopeLimit = '学习重点：绝对与相对剩余价值分别保留哪个时间条件。完整理解产生机制还需先掌握劳动力价值与必要劳动时间的关系。';
  capital01.sections[0].label = '剩余价值的定义';
  capital01.sections[0].text = replace(capital01.sections[0].text,
    '本主题只认识这一正式定义和已有方法条件，尚不展开劳动力价值如何形成；不能把读到定义当作已经解释了完整产生机制。',
    '学习内容限于这一定义和已有方法条件，不展开劳动力价值如何形成；掌握定义不等于已经解释完整产生机制。', capital01.id);
  capital01.boundary.label = '先掌握劳动力价值';
  capital01.boundary.text = '完整理解剩余价值产生机制，需要先掌握劳动力价值与必要劳动时间的关系。两种剩余价值的学习范围限于定义与时间条件；剩余价值产生于生产过程，不能用商品加价出售作完整解释。';
  capital01.recap.text = '绝对剩余价值生产保持必要劳动时间不变并延长劳动日；相对剩余价值生产保持工作日不变，通过提高社会劳动生产率缩短必要劳动时间。完整理解产生机制还需先掌握劳动力价值与必要劳动时间的关系。';
  capital01.reflection.answer = '绝对剩余价值生产保持必要劳动时间不变并延长劳动日；相对剩余价值生产保持工作日长度不变，通过提高社会劳动生产率缩短必要劳动时间。完整理解产生机制还需先掌握劳动力价值与必要劳动时间的关系。';
  changedLessons.push(capital01.id);
  const capital02 = byId(source.lessons, 'CAPITAL-02', 'lesson');
  capital02.scopeLimit = '学习重点：不变资本、可变资本与资本技术构成有什么区别。完整理解产生机制还需先掌握劳动力价值与必要劳动时间的关系。';
  capital02.boundary.label = '资本分类与产生机制';
  capital02.boundary.text = '资本分类只说明不变资本、可变资本与资本技术构成的定义关系。完整理解剩余价值产生机制还需先掌握劳动力价值与必要劳动时间的关系，不能因学完两节就认为已经掌握完整理论。';
  changedLessons.push(capital02.id);

  assert.deepEqual(source.lessons.map(item => item.id), beforeIds);
  source.progressCompatibleVersions = [...new Set([...(source.progressCompatibleVersions || []), predecessor.curriculumVersion])];
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = `${JSON.stringify(source, null, 2)}\n`;
  const inventoryText = `${JSON.stringify(inventory, null, 2)}\n`;
  const runtimeText = `// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ${JSON.stringify(runtime)};\n`;
  fs.writeFileSync(absolute(files.source), sourceText);
  fs.writeFileSync(absolute(files.runtime), runtimeText);
  fs.writeFileSync(absolute(files.reading), renderReading(source));

  const evidence = {
    schemaVersion: 1,
    batchId: 'politics-systematic-user-comprehension-uc6',
    generatedAt: '2026-10-23',
    status: 'candidate-integrated-for-runtime-test',
    previousCurriculumVersion: predecessor.curriculumVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(predecessor.curriculumVersion),
    stableLessonIds: true,
    orderChanged: false,
    changedRouteIds: changedRoutes,
    changedGroupIds: changedGroups,
    changedLessonIds: changedLessons,
    sourcePath: files.source,
    sourceSha256: sha256(Buffer.from(sourceText)),
    inventoryPath: files.inventory,
    inventorySha256: sha256(Buffer.from(inventoryText)),
    runtimePath: files.runtime,
    runtimeSha256: sha256(Buffer.from(runtimeText)),
    readingPath: files.reading,
    runtimeProbePath: files.runtimeProbe,
    retainedHoldLessonIds: ['CAPITAL-02'],
    runtimePageAcceptance: 'pending',
    realUserAcceptance: 'pending',
    releaseAuthorized: false,
  };
  fs.writeFileSync(absolute(files.evidence), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence));
}

main();
