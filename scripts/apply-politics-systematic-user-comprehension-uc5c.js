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
  evidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc5c-20261023.json',
};
const absolute = file => path.join(root, file);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const textChanges = {
  'TEN-04|boundary.text': '十个明确侧重理论层面的核心内容，十四个坚持侧重基本方略，六个必须坚持侧重世界观和方法论。掌握十个明确不等于已经掌握其余两组内容，也不等于掌握各领域的全部细节。',
  'VALUE-01|sections.3.text': '商品必须同时具有使用价值和价值，使用价值是价值的物质承担者，价值通过使用价值表现出来。二者是同一商品的两个方面，不能拆成两种彼此无关的商品。',
  'VALUE-02|sections.1.text': '具体劳动是人们在一定具体形式下进行的劳动。它反映人与自然的关系，生产各种使用价值。不同的具体劳动形式产生不同的使用价值。',
  'VALUE-02|sections.2.text': '抽象劳动是撇开具体形式的无差别人类劳动，是人的体力和脑力的消耗。它体现人与人的关系，其凝结形成商品价值，是形成商品价值的唯一源泉。“抽象”表示观察角度，不是另一次独立劳动。',
  'DEV-03|sections.2.text': '构建新发展格局是把握发展主动权的先手棋，不是被迫之举和权宜之计；其最本质特征是实现高水平的自立自强。这些定位说明新发展格局的性质，不替代具体产业与贸易政策。',
  'DEV-05|sections.1.text': '市场在资源配置中起决定性作用。“决定性作用”的对象是资源配置，不能泛化成市场承担所有治理职责，也不能写成对所有制度层面的同一种判断。',
  'DEV-07|boundary.text': '区域协调发展战略、区域重大战略、主体功能区制度和新型城镇化各有对象，不能互相替代，也不能据此直接推出某一地区的具体政策结论。',
  'FOUND-01|sections.0.text': '坚持和发展中国特色社会主义，是改革开放以来我们党全部理论和实践的鲜明主题，也是习近平新时代中国特色社会主义思想的核心要义。它说明理论和实践围绕什么展开，但不能替代后续具体观点。',
  'FOUND-02|sections.2.text': '新时代社会主要矛盾发生变化，但我国仍处于并将长期处于社会主义初级阶段的基本国情没有变，世界最大发展中国家的国际地位没有变。变化的是社会主要矛盾，没有变化的是基本国情和国际地位，判断对象不同。',
  'FOUND-03|sections.2.text': '第二个结合使马克思主义这个魂脉和中华优秀传统文化这个根脉内在贯通、相互成就。结合的前提是彼此契合，结果是互相成就并形成新的文化生命体；它筑牢道路根基、打开创新空间、巩固文化主体性，不是把两套词句简单并列。',
  'MOD-01|sections.1.text': '党的中心任务包括全面建成社会主义现代化强国、实现第二个百年奋斗目标，并以中国式现代化全面推进中华民族伟大复兴。中国式现代化是推进民族复兴的方式，当前知识范围不展开其全部内涵。',
  'MOD-03|sections.2.text': '推进中国式现代化须把握五项重大原则：坚持和加强党的全面领导，坚持中国特色社会主义道路，坚持以人民为中心的发展思想，坚持深化改革开放，坚持发扬斗争精神。中国特色说明“是什么”，本质要求说明“要达到什么、坚持什么”，重大原则说明“推进时把握什么”。',
  'SYS-01|sections.1.text': '十三个方面成就对新时代伟大实践作出科学总结，展示理论与实践成果；当前知识范围只说明这一定位，不展开十三个方面成就的完整清单。六个必须坚持体现这一思想的世界观、方法论和贯穿其中的立场观点方法。',
  'SYS-02|sections.1.text': '第四项是坚持全面深化改革，第五项是坚持新发展理念。前者不能缩减为经济领域的一项调整，后者也不能用任意一个发展措施替代。二者名称和职责不同，具体改革目标与发展理念在对应主题中展开。',
  'SYS-04|sections.0.text': '六个必须坚持是这一思想的世界观、方法论和贯穿其中的立场观点方法的重要体现。它关注立场以及认识、处理问题的方法，与十四个坚持所涉及的治国理政领域不同。',
  'SYS-05|sections.1.text': '必须坚持系统观念，是基本思想和工作方法，体现辩证唯物主义普遍联系的原理。系统观念要求从联系中把握事物，具体联系仍须根据研究对象判断，不能由“系统”一词直接推出所有关系。',
  'LEADERSHIP-01|sections.0.text': '中国共产党领导是中国特色社会主义制度的最大优势，是实现中华民族伟大复兴的根本保证。中国共产党是我国最高政治领导力量，党中央集中统一领导是党的领导的最高原则。领导力量与领导原则含义不同，不能只记“领导”二字。',
  'LEADERSHIP-01|boundary.text': '党领导一切不等于包揽一切。党的领导制度居于统领地位，与具体国家机关各自承担的职能不是同一层面的概念。当前知识范围不展开制度完整清单，也不把学习归纳当作新的正式分类。',
  'REFORMLAW-01|boundary.text': '十一届三中全会开启改革开放和社会主义现代化建设新时期，十八届三中全会开创新时代全面深化改革新局面。二者历史定位不同；当前问题只要求区分定位，不展开完整历史过程。',
  'CULTUREECO-02|boundary.text': '创作导向、效益关系、首要政治任务和最终体现分别回答不同问题，不能用“服务人民”一句话替代全部具体内容。',
  'CULTUREECO-03|sections.1.text': '生态环境问题归根到底是经济发展方式和生活方式问题，绿色低碳发展是治本之策。要坚持节约优先、保护优先、自然恢复为主，理解“绿水青山就是金山银山”的发展理念。生态治理既针对已经产生的污染，也涉及生产生活方式和保护方针。',
  'CULTUREECO-04|sections.0.text': '我国力争2030年前实现碳达峰，努力争取2060年前实现碳中和。这两个时间点是目标节点，不能写成已经实现的结果；当前知识范围不展开核算方法或最新进展。',
  'PARTY-03|boundary.text': '三不腐分别发挥震慑、制度约束和思想教育作用，并共同服务于党的自我革命。当前知识范围不逐项解释九项实践要求；全面从严治党不能缩减为反腐败，自我革命也不能只由一个行动概括。',
  'SECURITY-03|boundary.text': '战略目标表示建设方向和时间节点，不代表当前已经完成。党对军队的绝对领导是根本原则和制度，不能与一般行政领导关系混同；当前知识范围不展开其历史形成过程。',
  'BASICS-01|sections.1.text': '马克思的两大发现是唯物史观和剩余价值学说。理论特征是以实践为基础的科学性和革命性的统一，理论品质是与时俱进，活的灵魂是具体问题具体分析，根本学习方法是理论联系实际。这些定位各有对象，不能互相替代。',
  'BASICS-02|sections.1.text': '物质和意识是否具有同一性，区分可知论和不可知论，回答思维能否认识存在；物质和意识何者是本原，区分唯物主义和唯心主义。主观唯心主义以人的精神为世界本原，客观唯心主义以客观精神为世界本原；唯物主义也经历不同发展形态。',
  'DIALECTICS-04|sections.0.text': '内因是事物内部矛盾，外因是事物与其他事物之间的相互影响和相互作用，即外部矛盾。区分内因和外因要先确定研究对象，不能只按因素看起来远近或大小划分。主次关系与内外关系是不同的分析角度。',
  'DIALECTICS-06|boundary.text': '不能用经历两次否定的表面次数替代内部矛盾、克服与保留的具体关系。辩证否定强调“扬弃”，不能用来为任意反复作合理化解释。',
  'HISTORY-01|boundary.text': '先进意识的促进作用要通过社会实践实现。意识形态与非意识形态的具体范围不在当前知识范围展开，不能把所有精神现象都归为同一种经济基础反映。',
  'MONEY-01|sections.0.text': '货币是固定充当一般等价物的商品，本质是一般等价物。货币本质说明它在交换中的共同地位，不能直接等同于某一种具体职能。',
  'MONEY-01|boundary.text': '一般等价物说明货币本质，两项基本职能说明货币的具体作用。当前知识范围不展开货币起源的完整历史，也不能把所有货币作用都概括为交换媒介。',
  'MONEY-02|sections.0.text': '贮藏手段指货币退出流通、作为社会财富的一般代表保存起来。在金属货币理论口径下，贮藏手段以足值金属货币或金属条块为条件。支付手段涉及赊购赊销、清偿债务，也用于租金、税金、工资等。前者强调退出流通保存，后者强调支付关系。',
  'MONEY-02|boundary.text': '贮藏手段的条件限定在金属货币理论口径，不能泛化为现代信用货币的普遍结论。区分流通、贮藏与支付，要看货币发挥的作用和所处关系，不能只看钱是否被保存或是否发生付款。',
  'CAPITAL-01|boundary.text': '劳动力价值与必要劳动时间之间的完整机制仍缺少前置知识，因此当前目标限缩为定义识别与条件比较。剩余价值产生于生产过程，不能用商品加价出售作完整解释。',
  'CAPITAL-01|recap.text': '绝对剩余价值生产保持必要劳动时间不变并延长劳动日；相对剩余价值生产保持工作日不变，通过提高社会劳动生产率缩短必要劳动时间。当前只比较二者的时间条件，完整产生机制仍待补源。',
};

function resolveOwner(lesson, field) {
  if (field === 'boundary.text') return [lesson.boundary, 'text'];
  if (field === 'recap.text') return [lesson.recap, 'text'];
  const match = field.match(/^sections\.(\d+)\.text$/);
  assert.ok(match, `unknown field ${field}`);
  return [lesson.sections[Number(match[1])], 'text'];
}

function main() {
  const source = JSON.parse(fs.readFileSync(absolute(files.source), 'utf8'));
  const inventory = JSON.parse(fs.readFileSync(absolute(files.inventory), 'utf8'));
  delete require.cache[require.resolve('../miniprogram/models/politics-systematic-units-runtime')];
  const previousVersion = require('../miniprogram/models/politics-systematic-units-runtime').curriculumVersion;
  const beforeIds = source.lessons.map(item => item.id);
  const changedLessons = new Set();
  let rewrittenObjects = 0;
  let scopeTailChanges = 0;

  for (const [key, after] of Object.entries(textChanges)) {
    const [id, field] = key.split('|');
    const lesson = source.lessons.find(item => item.id === id);
    assert.ok(lesson, `missing lesson ${id}`);
    const [owner, property] = resolveOwner(lesson, field);
    assert.notEqual(owner[property], after, `${key} was already applied`);
    owner[property] = after;
    changedLessons.add(id);
    rewrittenObjects += 1;
  }

  for (const lesson of source.lessons) {
    const after = lesson.scopeLimit
      .replace('下属固定术语不逐一展开，完整表述可查阅。', '不逐一展开下属固定术语。')
      .replace(/([^。]+)保留查阅。$/, '不展开$1。');
    if (after !== lesson.scopeLimit) {
      lesson.scopeLimit = after;
      changedLessons.add(lesson.id);
      scopeTailChanges += 1;
      rewrittenObjects += 1;
    }
  }

  const visibleBody = lesson => [lesson.scopeLimit, ...lesson.sections.map(item => item.text), lesson.boundary.text,
    lesson.recap.text, lesson.reflection.answer].join('\n');
  for (const lesson of source.lessons) {
    assert.doesNotMatch(visibleBody(lesson), /这次|本次|本节|这里|保留查阅|可查阅/,
      `${lesson.id} still exposes editorial perspective or weak deixis`);
  }
  assert.deepEqual(source.lessons.map(item => item.id), beforeIds);

  source.progressCompatibleVersions = [...new Set([...(source.progressCompatibleVersions || []), previousVersion])];
  const runtime = compile(source, inventory, 'candidate');
  const sourceText = `${JSON.stringify(source, null, 2)}\n`;
  const runtimeText = `// Generated by scripts/build-politics-systematic-units.js --target=candidate.\nmodule.exports = ${JSON.stringify(runtime)};\n`;
  fs.writeFileSync(absolute(files.source), sourceText);
  fs.writeFileSync(absolute(files.runtime), runtimeText);
  fs.writeFileSync(absolute(files.reading), renderReading(source));

  const evidence = {
    schemaVersion: 1,
    batchId: 'politics-systematic-user-comprehension-uc5c',
    generatedAt: '2026-10-23',
    status: 'candidate-integrated-for-user-test',
    previousCurriculumVersion: previousVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(previousVersion),
    stableLessonIds: true,
    orderChanged: false,
    rewrittenObjects,
    rewrittenEditorialObjects: Object.keys(textChanges).length,
    scopeTailChanges,
    changedLessonIds: [...changedLessons],
    sourcePath: files.source,
    sourceSha256: sha256(Buffer.from(sourceText)),
    runtimePath: files.runtime,
    runtimeSha256: sha256(Buffer.from(runtimeText)),
    readingPath: files.reading,
    realUserAcceptance: 'pending',
    releaseAuthorized: false,
  };
  fs.writeFileSync(absolute(files.evidence), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence));
}

if (require.main === module) main();
module.exports = { textChanges, resolveOwner };
