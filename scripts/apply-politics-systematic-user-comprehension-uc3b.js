const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('./build-politics-systematic-units');
const { renderReading } = require('./refine-politics-systematic-learning');

const root = path.resolve(__dirname, '..');
const SOURCE = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const INVENTORY = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json';
const READING = 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md';
const RUNTIME = 'miniprogram/models/politics-systematic-units-runtime.js';
const EVIDENCE = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc3b-20261023.json';
const absolute = file => path.join(root, file);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const changes = {
  'VALUE-01': { title: '商品的使用价值与价值', question: '使用价值与价值是什么关系？', labels: {3:'使用价值与价值的关系'} },
  'VALUE-02': { title: '具体劳动与抽象劳动', question: '具体劳动与抽象劳动有什么区别？' },
  'DEV-02': { title: '新发展理念的五项内容', question: '创新、协调、绿色、开放、共享分别解决什么问题？', reflection:'创新与协调分别解决什么问题？' },
  'DEV-03': { title: '新发展格局' },
  'DEV-04': { title: '社会主义基本经济制度', question: '所有制、分配制度与社会主义市场经济体制有什么区别？', labels:{0:'社会主义基本经济制度的结构'} },
  'DEV-05': { title: '市场作用与政府作用' },
  'DEV-07': { title: '区域战略与新型城镇化', labels:{3:'区域战略与新型城镇化的区别'} },
  'FOUND-01': { title: '核心要义与四个自信', labels:{2:'核心要义与四个自信的关系'}, reflection:'核心要义与四个自信是什么关系？' },
  'FOUND-02': { title: '新时代与社会主义初级阶段', labels:{0:'新时代的判断依据',1:'新时代的其他判断线索',3:'主要矛盾、历史阶段与国际地位'} },
  'FOUND-03': { title: '两个结合', question:'“两个结合”的内容是什么？', labels:{0:'两个结合的内容',2:'马克思主义基本原理与中华优秀传统文化相结合',3:'两个结合的判断'}, reflection:'“两个结合”的内容是什么？', answer:'“两个结合”是把马克思主义基本原理同中国具体实际相结合、同中华优秀传统文化相结合。' },
  'MOD-02': { title: '中国式现代化的五个中国特色' },
  'MOD-03': { title: '中国式现代化的本质要求与重大原则', question:'本质要求与重大原则有什么区别？', labels:{0:'中国式现代化的本质要求',1:'本质要求的九项内容',2:'中国式现代化的重大原则'}, boundary:'本质要求与重大原则的区别' },
  'LEADERSHIP-01': { title:'党的领导与国家制度', labels:{0:'党的领导地位',1:'党的领导制度'} },
  'LEADERSHIP-02': { title:'人民立场、服务宗旨与群众路线', labels:{1:'服务宗旨与群众路线'} },
  'LIVELIHOOD-01': { title:'就业与收入分配', labels:{1:'收入形成与分配调节'} },
  'SUPPORT-01': { title:'教育的基础性支撑作用', question:'为什么教育必须同时明确育人目标和培养方式？', labels:{0:'教育、科技与人才的战略支撑',1:'教育的育人目标'}, reflection:'为什么教育必须同时明确育人目标和培养方式？' },
  'SUPPORT-02': { title:'基础研究、应用研究与人才评价', question:'基础研究、应用研究与人才评价是什么关系？', reflection:'基础研究、应用研究与人才评价是什么关系？' },
  'DEMOCRACY-01': { title:'人民当家作主的制度保障', question:'人民代表大会制度与其他基本政治制度有什么区别？', labels:{0:'人民代表大会制度',1:'三项基本政治制度'}, reflection:'人民代表大会制度与其他基本政治制度有什么区别？' },
  'DEMOCRACY-02': { title:'全过程人民民主', question:'全过程人民民主包括哪些环节和制度形式？', reflection:'全过程人民民主包括哪些环节和制度形式？' },
  'DEMOCRACY-03': { title:'统一战线中的一致性与多样性', labels:{0:'统一战线的对象与任务'} },
  'REFORMLAW-01': { title:'改革、发展与稳定', question:'改革、发展与稳定是什么关系？', reflection:'改革、发展与稳定是什么关系？' },
  'REFORMLAW-02': { title:'中国特色社会主义法治道路与法治体系', labels:{0:'中国特色社会主义法治道路'} },
  'REFORMLAW-03': { title:'法治的共同推进与一体建设', labels:{1:'法治建设的目标、重点与基础'} },
  'CULTUREECO-01': { title:'文化自信、传承与创新' },
  'CULTUREECO-02': { title:'文化强国与人民需求' },
  'CULTUREECO-03': { title:'生态保护与发展' },
  'CULTUREECO-04': { title:'生态目标与空间保护', question:'碳目标、三条控制线和自然保护地体系分别是什么？', reflection:'碳目标、三条控制线和自然保护地体系分别是什么？' },
  'PARTY-01': { title:'党的建设主线与政治统领' },
  'PARTY-02': { title:'组织建设、作风建设与纪律建设' },
  'PARTY-03': { title:'反腐败与自我革命' },
  'SECURITY-01': { title:'总体国家安全观', question:'人民安全、政治安全与经济安全分别是什么定位？', reflection:'人民安全、政治安全与经济安全分别是什么定位？' },
  'SECURITY-03': { title:'强军目标、根本原则与现代化阶段' },
  'UNITYFOREIGN-02': { title:'国家统一方略' },
  'UNITYFOREIGN-03': { title:'中国特色大国外交与人类命运共同体' },
  'BASICS-01': { title:'马克思主义的组成、来源与发现', labels:{0:'马克思主义的组成与理论来源'} },
  'BASICS-04': { title:'物质与意识', labels:{0:'意识的本质'} },
  'DIALECTICS-03': { title:'主要矛盾与矛盾主要方面', labels:{0:'主要矛盾与矛盾主要方面的区别',2:'主要矛盾与矛盾主要方面的判断'} },
  'DIALECTICS-04': { title:'内因与外因' },
  'DIALECTICS-05': { title:'量变、度与质变', labels:{2:'量变与质变的判断'} },
  'DIALECTICS-06': { title:'辩证否定与否定之否定' },
  'COGNITION-01': { title:'实践与认识' },
  'COGNITION-02': { labels:{2:'认识两次飞跃的判断'} },
  'COGNITION-03': { title:'真理的客观性与条件性' },
  'HISTORY-02': { title:'生产力与生产关系', labels:{2:'生产力与生产关系的判断'}, reflection:'生产能力提高与生产协作、分配调整分别属于哪类变化？' },
  'HISTORY-03': { title:'经济基础与上层建筑', question:'经济基础、生产力与上层建筑有什么区别和联系？', labels:{0:'经济基础与上层建筑的区别',1:'两对社会基本矛盾的联系'}, reflection:'经济基础、生产力与上层建筑有什么区别和联系？' },
  'HISTORY-04': { title:'人民群众的历史作用', labels:{0:'群众史观与英雄史观'} },
  'MONEY-01': { title:'货币的价值尺度与流通手段' },
  'MONEY-02': { title:'货币的贮藏、支付与世界货币职能' },
  'CAPITAL-01': { title:'绝对剩余价值与相对剩余价值', labels:{0:'剩余价值的定义与学习范围'} },
};

function main() {
  const source = JSON.parse(fs.readFileSync(absolute(SOURCE), 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(absolute(INVENTORY), 'utf8'));
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const previousVersion = require('../miniprogram/models/politics-systematic-units-runtime').curriculumVersion;
  const before = new Map(source.lessons.map(lesson => [lesson.id, JSON.parse(JSON.stringify(lesson))]));
  for (const [id, patch] of Object.entries(changes)) {
    const lesson = source.lessons.find(item => item.id === id);
    assert.ok(lesson, `missing lesson ${id}`);
    if (patch.title) lesson.title = patch.title;
    if (patch.question) lesson.question = patch.question;
    if (patch.labels) for (const [index, label] of Object.entries(patch.labels)) lesson.sections[Number(index)].label = label;
    if (patch.boundary) lesson.boundary.label = patch.boundary;
    if (patch.reflection) lesson.reflection.prompt = patch.reflection;
    if (patch.answer) lesson.reflection.answer = patch.answer;
  }
  for (const lesson of source.lessons) {
    if (lesson.boundary.label === '注意边界') lesson.boundary.label = '概念辨析';
    if (!lesson.nextLessonId || !lesson.transition.startsWith('下一节：')) continue;
    const next = source.lessons.find(item => item.id === lesson.nextLessonId);
    assert.ok(next, `missing next lesson ${lesson.nextLessonId}`);
    lesson.transition = `下一节：${next.title}`;
  }
  source.progressCompatibleVersions = [...new Set([...(source.progressCompatibleVersions || []), previousVersion])];
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = `${JSON.stringify(source, null, 2)}\n`;
  const runtimeText = `// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ${JSON.stringify(runtime)};\n`;
  const readingText = renderReading(source);
  fs.writeFileSync(absolute(SOURCE), sourceText);
  fs.writeFileSync(absolute(RUNTIME), runtimeText);
  fs.writeFileSync(absolute(READING), readingText);
  const evidence = { schemaVersion:1, batchId:'politics-systematic-user-comprehension-uc3b', generatedAt:'2026-10-23',
    status:'candidate-integrated-for-user-test', previousCurriculumVersion:previousVersion, curriculumVersion:runtime.curriculumVersion,
    progressCompatible:runtime.progressCompatibleVersions.includes(previousVersion), stableLessonIds:true, orderChanged:false,
    changedLessons:Object.keys(changes).map(id=>({id,before:{title:before.get(id).title,question:before.get(id).question},after:{title:source.lessons.find(x=>x.id===id).title,question:source.lessons.find(x=>x.id===id).question}})),
    normalizedBoundaryLabels:source.lessons.filter((lesson)=>before.get(lesson.id).boundary.label==='注意边界').map(lesson=>lesson.id),
    sourcePath:SOURCE, sourceSha256:sha256(Buffer.from(sourceText)), runtimePath:RUNTIME, runtimeSha256:sha256(Buffer.from(runtimeText)),
    realUserAcceptance:'pending', releaseAuthorized:false };
  fs.writeFileSync(absolute(EVIDENCE), `${JSON.stringify(evidence,null,2)}\n`);
  console.log(JSON.stringify({status:evidence.status,previousCurriculumVersion:previousVersion,curriculumVersion:runtime.curriculumVersion,changedLessons:evidence.changedLessons.length,progressCompatible:evidence.progressCompatible}));
}

main();
