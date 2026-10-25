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
  evidence: 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc5b-20261023.json',
};
const absolute = file => path.join(root, file);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

const textChanges = {
  'TEN-01|recap.text': '前三条分别说明党的领导、总任务、社会主要矛盾与人民立场。每条回答的对象不同，不能互相替代。',
  'TEN-04|recap.text': '十个明确不是十个互不相干的名称，而是习近平新时代中国特色社会主义思想主体内容的重要组成部分。复习时既要掌握各条内容，也要区分各条所回答的问题。',
  'VALUE-01|sections.2.text': '价值是凝结在商品中无差别的一般人类劳动，是商品的社会属性。使用价值不同的商品能够交换，是因为它们都有价值，都耗费了人类一定的体力和脑力。',
  'DEV-01|sections.1.text': '新发展阶段是全面建成小康社会、实现第一个百年奋斗目标之后，全面建设社会主义现代化国家、向第二个百年奋斗目标进军的重要阶段，也是从站起来、富起来到强起来历史性跨越的新阶段。',
  'DEV-03|reflection.answer': '新发展格局以国内大循环为主体，国内国际双循环相互促进；还要求建设全国统一大市场、畅通经济循环并提高自立自强水平，不能理解成各地自我小循环。',
  'DEV-04|sections.1.text': '公有制经济包括国有经济、集体经济，以及混合所有制中的国有成分和集体成分；非公有制经济包括个体经济、私营经济等。两者都是社会主义市场经济的重要组成部分，也是经济社会发展的重要基础。必须巩固和发展公有制经济，鼓励、支持、引导非公有制经济发展。',
  'DEV-05|sections.0.text': '社会主义市场经济体制既要发挥市场作用，也要发挥政府作用。处理好政府和市场的关系是经济体制改革的核心问题。',
  'DEV-05|sections.2.text': '更好发挥政府作用，要推动有效市场和有为政府更好结合。“看不见的手”和“看得见的手”需要共同发挥作用，不能把二者理解为只能选择其一。',
  'DEV-05|reflection.answer': '要使市场在资源配置中起决定性作用，更好发挥政府作用，并推动有效市场和有为政府更好结合。二者相互配合，共同服务于社会主义市场经济体制的有效运行。',
  'DEV-07|sections.0.text': '区域协调发展战略包括推动西部大开发形成新格局、推动东北全面振兴取得新突破、促进中部地区加快崛起、鼓励东部地区加快推进现代化。它与区域重大战略属于不同层次的区域安排。',
  'DEV-07|sections.1.text': '区域重大战略包括京津冀协同发展、长江经济带发展、粤港澳大湾区建设、长三角一体化发展、黄河流域生态保护和高质量发展，以及雄安新区与成渝地区双城经济圈建设。各项战略对象不同，不能合并成同一个层级。',
  'FOUND-01|sections.1.text': '改革开放以来取得一切成绩和进步的根本原因，是开辟了中国特色社会主义道路，形成了中国特色社会主义理论体系，确立了中国特色社会主义制度，发展了中国特色社会主义文化。这四个方面共同构成中国特色社会主义的基本线索。',
  'FOUND-01|sections.2.text': '新时代坚持和发展中国特色社会主义，必须坚定道路自信、理论自信、制度自信、文化自信。文化自信是更基础、更广泛、更深厚的自信。四个自信分别对应道路、理论、制度和文化，共同服务于坚持和发展中国特色社会主义。',
  'FOUND-02|sections.1.text': '党的主要任务以及中国同世界关系的变化，也是判断新时代的重要线索。党的十八大后，主要任务包括实现第一个百年奋斗目标、开启第二个百年奋斗目标新征程；中国与国际社会的联系、依靠和影响也更加深入。',
  'FOUND-03|sections.1.text': '第一个结合是把马克思主义基本原理同中国具体实际相结合，即用马克思主义之“矢”射新时代中国之“的”。理论必须面对中国的具体实际，不能只记原理而忽略实际问题。',
  'MOD-02|sections.2.text': '中国式现代化是走和平发展道路的现代化。它与人口规模巨大、全体人民共同富裕、物质文明和精神文明相协调、人与自然和谐共生共同构成中国式现代化的五个中国特色。',
  'MOD-03|sections.0.text': '中国式现代化的本质要求包括坚持中国共产党领导、坚持中国特色社会主义。党的领导直接关系中国式现代化的根本方向、前途命运和最终成败，因此这两项是理解其他本质要求的政治前提。',
  'MOD-03|reflection.answer': '本质要求说明中国式现代化要达到什么、坚持什么，重大原则说明推进中国式现代化必须把握什么。二者相互联系，但作用和具体内容不同。',
  'SYS-03|sections.2.text': '第十四项是坚持全面从严治党。它与前十三项共同构成十四个坚持，整体上为治国理政各方面提供理论分析和政策指导，不是只针对某一个领域的操作清单。',
  'SYS-03|boundary.text': '十四个坚持被分成两节，是为了控制单次学习量，不代表它们存在两个正式层次或固定实施顺序。各领域的具体制度与措施仍需在相应主题中理解。',
  'SYS-04|sections.1.text': '必须坚持人民至上，体现根本价值立场，并联系历史唯物主义群众史观。必须坚持自信自立，体现客观规律性和主观能动性的有机结合，不能把“自信”理解为只凭主观愿望、不顾客观规律。',
  'SYS-04|sections.2.text': '必须坚持守正创新，体现变与不变、继承与发展的内在联系。“守正”与“创新”相互联系，不能只保留其中一个，也不能把这一方法要求套成适用于所有事情的固定操作表。',
  'SYS-04|reflection.answer': '不是。自信自立强调客观规律性与主观能动性的有机结合，既要发挥主观能动性，也要尊重客观规律。',
  'SYS-05|sections.0.text': '必须坚持问题导向，就是承认矛盾的普遍性和客观性，聚焦实践中遇到的新问题并不断提出解决问题的新办法。问题导向是一项方法要求，不是预先为所有问题规定同一个答案。',
  'SYS-05|boundary.text': '问题导向、系统观念、胸怀天下分别强调面对问题、把握联系和拓展视野，不构成固定的先后操作流程。十三个方面成就的详细内容仍缺少来源，不能据此宣称科学体系的全部具体知识已经学完。',
  'SYS-05|reflection.answer': '问题导向强调正视并解决实际问题，系统观念强调从事物的普遍联系把握整体。二者可以共同用于分析问题，但含义不同，也不构成固定步骤。',
  'LEADERSHIP-01|sections.1.text': '党的领导制度是我国的根本领导制度，在中国特色社会主义制度体系中居于统领地位。相关制度包括维护党中央权威和集中统一领导、为人民执政靠人民执政、提高执政能力和领导水平、全面从严治党等。党的领导通过制度安排落实，不能理解为抽象口号。',
  'LEADERSHIP-03|sections.0.text': '共同富裕是全体人民共同富裕，既包括物质生活，也包括精神生活；不是少数人的富裕，不是整齐划一的平均主义，也不要求所有人、所有地区同时达到一个水平。到2035年取得更为明显的实质性进展、到本世纪中叶基本实现共同富裕，是共同富裕的阶段目标。',
  'LIVELIHOOD-01|sections.0.text': '增进民生福祉是发展的根本目的，就业是民生之本。促进高质量充分就业，要以破解结构性就业矛盾为着力点，既看就业质量的有效提升，也看就业数量的合理增长；同时发挥劳动者、市场和政府的作用，并鼓励创业。',
  'LIVELIHOOD-02|sections.0.text': '社会保障体系是人民生活的安全网和社会运行的稳定器，包括社会保险、社会福利、社会救济、社会优抚与安置。社会保险是核心内容，社会福利是最高层次措施，社会救济是最低层次措施，社会优抚面向法定对象，各项定位不同。',
  'SUPPORT-01|boundary.text': '基础教育是基点，高等教育是龙头，加强教师队伍建设是建设教育强国最重要的基础工作。三者处于不同层面，不能把教育强国简单理解为只抓高等教育。',
  'DEMOCRACY-01|boundary.text': '人民政协是爱国统一战线组织、协商民主的专门协商机构，不是国家权力机关。村委会、居委会是基层群众自治组织，不能因为都涉及民主就把它们混同为同一种机构。',
  'REFORMLAW-02|boundary.text': '依法治国首先要坚持依宪治国，依法执政首先要坚持依宪执政，全面贯彻实施宪法是首要任务。依宪治国必须以宪法确定的党的领导地位、国体和政体为基础。',
  'CULTUREECO-01|sections.1.text': '发展社会主义先进文化、弘扬革命文化、传承中华优秀传统文化，要坚持创造性转化、创新性发展，以马克思主义激活优秀因子、赋予时代内涵。文化遗产保护遵循保护第一、合理利用、最小干预，创新与保护都有边界。',
  'CULTUREECO-02|sections.1.text': '文化强国之“强”最终体现在人民的思想境界、精神状态、文化修养上。文化建设的首要政治任务是用党的创新理论武装全党、教育人民，还要弘扬以伟大建党精神为源头的精神谱系。因此，不能只用作品数量和经济收益衡量文化建设。',
  'CULTUREECO-04|sections.0.text': '我国力争2030年前实现碳达峰，努力争取2060年前实现碳中和。这两个时间点是目标节点，不能写成已经实现的结果；本节不展开核算方法或最新进展。',
  'PARTY-03|sections.0.text': '腐败是党长期执政面临的最大威胁，反腐败是最彻底的自我革命。不敢腐、不能腐、不想腐要一体推进，分别发挥强大震慑、刚性制度约束和思想教育优势，不能只依靠其中一个环节。',
  'PARTY-03|sections.1.text': '党的自我革命是跳出历史周期率的第二个答案。其要求涉及集中统一领导、社会革命、理论遵循、战略目标、独有难题、从严治党体系、组织队伍、正风肃纪反腐、自我监督和人民监督，说明自我革命不是一次性的整顿行为。',
  'SECURITY-02|sections.1.text': '加强党对国家安全工作的绝对领导是根本保证。公共安全要完善体系，推动治理模式向事前预防转型。4月15日是全民国家安全教育日，记忆日期不能替代理解国家安全的结构和任务。',
  'SECURITY-03|sections.1.text': '国防和军队现代化的战略安排是：2027年实现建军一百年奋斗目标，2035年基本实现国防和军队现代化，到本世纪中叶全面建成世界一流军队。建设中要坚持政治建军、改革强军、科技强军、人才强军、依法治军，并牢固树立战斗力这个唯一的根本标准。',
  'UNITYFOREIGN-02|boundary.text': '统一方略中的实践途径、政治基础、根本动力和根本保证各有定位，不能互相替代，也不能把六项内容改写成固定步骤。',
  'UNITYFOREIGN-03|sections.0.text': '中国特色大国外交分别处理大国关系、周边外交、发展中国家合作和新型政党关系。周边外交坚持亲诚惠容、与邻为善、以邻为伴；对发展中国家坚持真实亲诚理念和正确义利观。对象不同，不能概括成完全相同的交往口号。',
  'BASICS-04|boundary.text': '人脑是意识的器官，意识是对客观存在的主观映象，意识的能动作用还需要通过实践实现。器官、认识内容和实现作用的活动不能混为一谈；人工智能延伸也必须以物质决定意识为基本立场。',
  'CAPITAL-02|boundary.text': '本主题只解释现有分类及其定义关系，不推导当前知识范围之外的公式和完整劳动力价值机制。劳动力价值的前置知识仍有缺口，不能因学完两节就宣称已经掌握完整的剩余价值理论。',
};

const noSemicolonTails = {
  'TEN-02': '不把四项内容理解为一一对应。',
  'TEN-03': '复习线索不是正式分类，并保留统筹发展和安全。',
  'VALUE-03': '不做数值计算，也不展开货币与剩余价值。',
  'DEV-02': '不展开对应领域的全部政策。',
  'DEV-03': '不展开具体产业与贸易措施。',
  'DEV-05': '不推导某项具体政策应采取什么措施。',
  'DEV-07': '不推演具体区域政策。',
  'FOUND-01': '不展开全部历史进程。',
  'FOUND-02': '不逐项展开时代内涵和历史材料。',
  'MOD-01': '不把三者定义为正式三层体系，也不展开中国式现代化的全部内涵。',
  'MOD-02': '不展开各领域实施措施。',
  'SYS-01': '不展开十三个方面成就的完整清单。',
  'SYS-03': '不展开各领域政策与制度细目。',
  'DIALECTICS-01': '不展开矛盾分析。',
};

const emphasisQuoteChanges = {
  'FOUND-02|sections.1.text|中国和世界关系': '中国同世界关系',
  'FOUND-03|sections.1.text|原理与实际相结合': '马克思主义基本原理同中国具体实际相结合',
};

function resolveOwner(lesson, field) {
  if (field === 'scopeLimit') return [lesson, 'scopeLimit'];
  if (field === 'boundary.text') return [lesson.boundary, 'text'];
  if (field === 'recap.text') return [lesson.recap, 'text'];
  if (field === 'reflection.answer') return [lesson.reflection, 'answer'];
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

  for (const [key, after] of Object.entries(textChanges)) {
    const [id, field] = key.split('|');
    const lesson = source.lessons.find(item => item.id === id);
    assert.ok(lesson, `missing lesson ${id}`);
    const [owner, property] = resolveOwner(lesson, field);
    assert.notEqual(owner[property], after, `${key} was already applied`);
    owner[property] = after;
    for (const emphasis of owner.emphasis || []) {
      const replacement = emphasisQuoteChanges[`${key}|${emphasis.quote}`];
      if (replacement) emphasis.quote = replacement;
    }
    changedLessons.add(id);
    rewrittenObjects += 1;
  }

  for (const lesson of source.lessons) {
    const oldScope = lesson.scopeLimit;
    const question = lesson.question.replace(/[？?。]$/, '');
    const semicolon = oldScope.indexOf('；');
    const tail = semicolon >= 0 ? oldScope.slice(semicolon + 1).trim() : noSemicolonTails[lesson.id] || '';
    lesson.scopeLimit = `学习重点：${question}。${tail}`;
    if (lesson.scopeLimit !== oldScope) {
      changedLessons.add(lesson.id);
      rewrittenObjects += 1;
    }
    if (lesson.nextLessonId && lesson.transition.startsWith('下一节：')) {
      const next = source.lessons.find(item => item.id === lesson.nextLessonId);
      assert.ok(next, `missing next lesson ${lesson.nextLessonId}`);
      lesson.transition = `下一节：${next.title}`;
    }
  }

  const visibleBody = lesson => [lesson.scopeLimit, ...lesson.sections.map(item => item.text), lesson.boundary.text, lesson.recap.text, lesson.reflection.answer].join('\n');
  for (const lesson of source.lessons) {
    assert.match(lesson.scopeLimit, /^学习重点：/);
    assert.ok(!/原文|正文|正式表述|的说明/.test(visibleBody(lesson)), `${lesson.id} still exposes author/source language`);
    assert.ok(lesson.scopeLimit.includes(lesson.question.replace(/[？?。]$/, '')), `${lesson.id} scope is not aligned with the current question`);
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
    batchId: 'politics-systematic-user-comprehension-uc5b',
    generatedAt: '2026-10-23',
    status: 'candidate-integrated-for-user-test',
    previousCurriculumVersion: previousVersion,
    curriculumVersion: runtime.curriculumVersion,
    progressCompatible: runtime.progressCompatibleVersions.includes(previousVersion),
    stableLessonIds: true,
    orderChanged: false,
    rewrittenObjects,
    rewrittenSourceLanguageObjects: Object.keys(textChanges).length,
    synchronizedScopeLimits: source.lessons.length,
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
module.exports = { textChanges, noSemicolonTails, emphasisQuoteChanges, resolveOwner };
