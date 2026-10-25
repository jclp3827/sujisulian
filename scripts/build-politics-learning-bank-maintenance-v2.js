#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DATE = '2026-10-21';
const OBJECTIVES_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';
const CONFUSION_PATH = 'docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json';
const EXPANSION_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-bank-expansion-v1.json';
const MAINTENANCE_V1_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-bank-maintenance-v1.json';
const RUNTIME_SOURCE_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';

const absolute = (relativePath) => path.join(ROOT, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const sha256 = (relativePath) => crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex');
const normalize = (text = '') => text.replace(/[\s，。！？；：、“”‘’（）《》·,.!?;:()]/g, '');

const SPECS = [
  // B12: the clearest independent corrections from the remaining signals.
  {
    cycle: 'B12', slug: 'u004-features-not-requirements', unitId: 'politics-toc-v2-u004', objectiveId: 'pol-obj-mod-03-2',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u004:qa',
    prompt: '判断并纠正：“中国式现代化的五个特色就是九项本质要求。”',
    answer: '错误。五个特色描述基于国情的鲜明特征，九项本质要求规定建设内容，二者不能混列。',
    sourceBlockIds: ['block:politics-toc-v2-u004:b018', 'block:politics-toc-v2-u004:b019', 'block:politics-toc-v2-u004:b020', 'block:politics-toc-v2-u004:b021', 'block:politics-toc-v2-u004:b022', 'block:politics-toc-v2-u004:b023', 'block:politics-toc-v2-u004:b024'],
    requiredSourcePhrases: ['中国式现代化的中国特色', '中国式现代化的本质要求'],
  },
  {
    cycle: 'B12', slug: 'u013-rule-of-law-not-administration-only', unitId: 'politics-toc-v2-u013', objectiveId: 'pol-obj-reformlaw-03-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u013:qa',
    prompt: '判断并纠正：“全面依法治国就是要求政府依法行政。”',
    answer: '错误。依法行政只是其中一环；依法治国、依法执政、依法行政应共同推进，并服务一体建设。',
    sourceBlockIds: ['block:politics-toc-v2-u013:b014', 'block:politics-toc-v2-u013:b020'],
    requiredSourcePhrases: ['依法治国、依法执政、依法行政共同推进', '共同服务于法治国家'],
  },
  {
    cycle: 'B12', slug: 'u018-one-country-first', unitId: 'politics-toc-v2-u018', objectiveId: 'pol-obj-unityforeign-01-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u018:qa',
    prompt: '判断并纠正：“一国两制中的一国与两制彼此并列、相互独立。”',
    answer: '错误。一国是实行两制的前提和基础，两制从属和派生于一国，二者地位不能倒置。',
    sourceBlockIds: ['block:politics-toc-v2-u018:b003', 'block:politics-toc-v2-u018:b015'],
    requiredSourcePhrases: ['前提和基础', '二者地位不能倒置'],
  },
  {
    cycle: 'B12', slug: 'u021-two-basic-questions', unitId: 'politics-toc-v2-u021', objectiveId: 'pol-obj-basics-02-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u021:qa',
    prompt: '判断并纠正：“可知论与不可知论回答物质和意识何者为第一性。”',
    answer: '错误。何者为第一性区分唯物主义与唯心主义；是否具有同一性区分可知论与不可知论。',
    sourceBlockIds: ['block:politics-toc-v2-u021:b012'],
    requiredSourcePhrases: ['何者为第一性', '是否具有同一性'],
  },
  {
    cycle: 'B12', slug: 'u034-one-labor-two-aspects', unitId: 'politics-toc-v2-u034', objectiveId: 'pol-obj-value-02-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u034:qa',
    prompt: '判断并纠正：“具体劳动和抽象劳动是两次彼此独立的劳动。”',
    answer: '错误。具体劳动和抽象劳动是同一劳动过程的两个方面，不是两次或两种彼此独立的劳动。',
    sourceBlockIds: ['block:politics-toc-v2-u034:b007'],
    requiredSourcePhrases: ['不是两次劳动', '同一劳动过程的两个方面'],
  },
  {
    cycle: 'B12', slug: 'u037-productivity-relative-surplus', unitId: 'politics-toc-v2-u037', objectiveId: 'pol-obj-capital-01-1',
    signalId: 'pitfall-signal:recall:politics-toc-v2-u037:qa',
    prompt: '判断并纠正：“提高全社会劳动生产率是绝对剩余价值生产的条件。”',
    answer: '错误。绝对剩余价值依靠延长劳动日；提高社会劳动生产率是相对剩余价值生产的条件。',
    sourceBlockIds: ['block:politics-toc-v2-u037:b014'],
    requiredSourcePhrases: ['绝对剩余价值依靠延长劳动日', '提高社会劳动生产率'],
  },
  {
    cycle: 'B12', slug: 'found03-second-combination-not-new-source', unitId: 'politics-toc-v2-u002', objectiveId: 'pol-obj-found-03-1',
    signalId: 'boundary-signal:FOUND-03',
    prompt: '判断并纠正：“第二个结合是脱离马克思主义另立一种理论来源。”',
    answer: '错误。两个结合都以马克思主义基本原理为共同出发点，第二个结合的对象是中华优秀传统文化。',
    sourceBlockIds: ['block:politics-toc-v2-u002:b012'],
    requiredSourcePhrases: ['第二个结合不是脱离马克思主义另立理论来源'],
  },
  {
    cycle: 'B12', slug: 'sys04-people-center-vs-people-first', unitId: 'politics-toc-v2-u003', objectiveId: 'pol-obj-sys-04-1',
    signalId: 'boundary-signal:SYS-04',
    prompt: '判断并纠正：“坚持以人民为中心与必须坚持人民至上是同一组中的同一项。”',
    answer: '错误。前者属于十四个坚持，后者属于六个必须坚持；二者相关，但正式名称和体系位置不同。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b016', 'block:politics-toc-v2-u003:b018'],
    requiredSourcePhrases: ['坚持以人民为中心', '必须坚持人民至上'],
  },
  {
    cycle: 'B12', slug: 'leadership02-stance-purpose-route', unitId: 'politics-toc-v2-u006', objectiveId: 'pol-obj-leadership-02-1',
    signalId: 'boundary-signal:LEADERSHIP-02',
    prompt: '判断并纠正：“人民立场、党的宗旨和群众路线只是同一名称的三种说法。”',
    answer: '错误。人民立场是根本政治立场，全心全意为人民服务是宗旨，群众路线是根本工作路线。',
    sourceBlockIds: ['block:politics-toc-v2-u006:b004', 'block:politics-toc-v2-u006:b009', 'block:politics-toc-v2-u006:b010'],
    requiredSourcePhrases: ['根本政治立场', '中国共产党的宗旨', '根本工作路线'],
  },
  {
    cycle: 'B12', slug: 'leadership03-redistribution-third-distribution', unitId: 'politics-toc-v2-u006', objectiveId: 'pol-obj-leadership-03-1',
    signalId: 'boundary-signal:LEADERSHIP-03',
    prompt: '判断并纠正：“第三次分配与再分配都由政府主导。”',
    answer: '错误。再分配由政府主导调节；第三次分配强调社会力量通过慈善、公益等方式自愿参与。',
    sourceBlockIds: ['block:politics-toc-v2-u006:b022', 'block:politics-toc-v2-u006:b023'],
    requiredSourcePhrases: ['由政府主导', '社会力量自愿参与'],
  },
  {
    cycle: 'B12', slug: 'democracy01-cppcc-not-state-power-organ', unitId: 'politics-toc-v2-u008', objectiveId: 'pol-obj-democracy-01-1',
    signalId: 'boundary-signal:DEMOCRACY-01',
    prompt: '判断并纠正：“人民政协是国家权力机关。”',
    answer: '错误。人民政协是爱国统一战线组织和协商民主的专门协商机构，职能是政治协商、民主监督、参政议政。',
    sourceBlockIds: ['block:politics-toc-v2-u008:b010', 'block:politics-toc-v2-u008:b012'],
    requiredSourcePhrases: ['爱国统一战线组织', '政治协商、民主监督、参政议政'],
  },
  {
    cycle: 'B12', slug: 'reformlaw01-two-plenums', unitId: 'politics-toc-v2-u012', objectiveId: 'pol-obj-reformlaw-01-1',
    signalId: 'boundary-signal:REFORMLAW-01',
    prompt: '判断并纠正：“十一届三中全会与十八届三中全会开启的是同一阶段。”',
    answer: '错误。前者开启改革开放和社会主义现代化建设新时期，后者开创新时代全面深化改革新局面。',
    sourceBlockIds: ['block:politics-toc-v2-u012:b003', 'block:politics-toc-v2-u012:b007'],
    requiredSourcePhrases: ['开启了改革开放', '开创了新时代全面深化改革新局面'],
  },

  // B13: distinct boundaries that remained after B12.
  {
    cycle: 'B13', slug: 'reformlaw02-rule-by-constitution', unitId: 'politics-toc-v2-u013', objectiveId: 'pol-obj-reformlaw-02-1',
    signalId: 'boundary-signal:REFORMLAW-02',
    prompt: '判断并纠正：“依法治国首先坚持依宪执政，依法执政首先坚持依宪治国。”',
    answer: '错误。依法治国首先坚持依宪治国，依法执政首先坚持依宪执政。',
    sourceBlockIds: ['block:politics-toc-v2-u013:b011'],
    requiredSourcePhrases: ['依法治国首先要坚持依宪治国', '依法执政首先要坚持依宪执政'],
  },
  {
    cycle: 'B13', slug: 'support01-education-base-lead-teachers', unitId: 'politics-toc-v2-u015', objectiveId: 'pol-obj-support-01-1',
    signalId: 'boundary-signal:SUPPORT-01',
    prompt: '判断并纠正：“建设教育强国只需抓高等教育。”',
    answer: '错误。基础教育是基点，高等教育是龙头，加强教师队伍建设是最重要的基础工作。',
    sourceBlockIds: ['block:politics-toc-v2-u015:b009', 'block:politics-toc-v2-u015:b010'],
    requiredSourcePhrases: ['基础教育作为基点', '高等教育作为龙头', '最重要的基础工作'],
  },
  {
    cycle: 'B13', slug: 'democracy03-diversity-still-common-direction', unitId: 'politics-toc-v2-u008', objectiveId: 'pol-obj-democracy-03-1',
    signalId: 'boundary-signal:DEMOCRACY-03',
    prompt: '判断并纠正：“统一战线尊重多样性，所以不再需要共同方向和党的领导。”',
    answer: '错误。求同存异是在尊重多样性中寻求一致性；党的政治领导仍是最核心、最根本的问题。',
    sourceBlockIds: ['block:politics-toc-v2-u008:b033', 'block:politics-toc-v2-u008:b034'],
    requiredSourcePhrases: ['在尊重多样性中寻求一致性', '最核心最根本的问题'],
  },
  {
    cycle: 'B13', slug: 'security03-military-leadership-not-administration', unitId: 'politics-toc-v2-u017', objectiveId: 'pol-obj-security-03-1',
    signalId: 'boundary-signal:SECURITY-03',
    prompt: '判断并纠正：“党对人民军队的绝对领导属于一般行政领导关系。”',
    answer: '错误。党对人民军队的绝对领导是根本原则和制度，是建军之本、强军之魂。',
    sourceBlockIds: ['block:politics-toc-v2-u017:b008', 'block:politics-toc-v2-u017:b012'],
    requiredSourcePhrases: ['建军之本、强军之魂', '不能与一般行政领导关系混同'],
  },
  {
    cycle: 'B13', slug: 'unityforeign01-autonomy-has-premise', unitId: 'politics-toc-v2-u018', objectiveId: 'pol-obj-unityforeign-01-1',
    signalId: 'boundary-signal:UNITYFOREIGN-01',
    prompt: '判断并纠正：“特别行政区高度自治意味着中央不再拥有全面管治权。”',
    answer: '错误。全面管治权是授权特别行政区高度自治的前提和基础，高度自治不能取消这一前提。',
    sourceBlockIds: ['block:politics-toc-v2-u018:b007'],
    requiredSourcePhrases: ['全面管治权是授权特别行政区高度自治的前提和基础'],
  },
  {
    cycle: 'B13', slug: 'basics03-objective-reality-not-unchanging', unitId: 'politics-toc-v2-u022', objectiveId: 'pol-obj-basics-03-1',
    signalId: 'boundary-signal:BASICS-03',
    prompt: '判断并纠正：“物质具有客观实在性，所以物质及其具体形态永远不变。”',
    answer: '错误。客观实在性是物质的唯一特性，运动是物质的根本属性；客观存在不等于静止不变。',
    sourceBlockIds: ['block:politics-toc-v2-u022:b002', 'block:politics-toc-v2-u022:b003', 'block:politics-toc-v2-u022:b005'],
    requiredSourcePhrases: ['客观实在性是物质的唯一特性', '根本属性和存在方式是运动'],
  },
  {
    cycle: 'B13', slug: 'basics04-consciousness-through-practice', unitId: 'politics-toc-v2-u022', objectiveId: 'pol-obj-basics-04-1',
    signalId: 'boundary-signal:BASICS-04',
    prompt: '判断并纠正：“意识发挥能动作用，可以不经过实践直接改变客观事物。”',
    answer: '错误。意识是人脑对客观存在的主观映象，其反作用必须通过实践实现。',
    sourceBlockIds: ['block:politics-toc-v2-u022:b006', 'block:politics-toc-v2-u022:b016'],
    requiredSourcePhrases: ['主观映象', '必须通过实践实现'],
  },
  {
    cycle: 'B13', slug: 'dialectics01-whole-not-mechanical-sum', unitId: 'politics-toc-v2-u023', objectiveId: 'pol-obj-dialectics-01-1',
    signalId: 'boundary-signal:DIALECTICS-01',
    prompt: '判断并纠正：“整体功能只是各部分功能的机械相加。”',
    answer: '错误。整体功能不是部分功能的机械相加；整体居于主导地位，关键部分也可能决定整体功能。',
    sourceBlockIds: ['block:politics-toc-v2-u023:b012'],
    requiredSourcePhrases: ['整体功能不是部分功能的机械相加', '关键部分可能决定整体功能'],
  },
  {
    cycle: 'B13', slug: 'dialectics02-two-concept-pairs', unitId: 'politics-toc-v2-u024', objectiveId: 'pol-obj-dialectics-02-1',
    signalId: 'boundary-signal:DIALECTICS-02',
    prompt: '判断并纠正：“矛盾的同一性与斗争性就是矛盾的普遍性与特殊性。”',
    answer: '错误。同一性与斗争性是矛盾的基本属性；普遍性与特殊性分别说明矛盾的共性与个性。',
    sourceBlockIds: ['block:politics-toc-v2-u024:b003', 'block:politics-toc-v2-u024:b004', 'block:politics-toc-v2-u024:b012'],
    requiredSourcePhrases: ['矛盾的基本属性', '矛盾的共性', '矛盾的个性'],
  },
  {
    cycle: 'B13', slug: 'dialectics03-secondary-still-matters', unitId: 'politics-toc-v2-u024', objectiveId: 'pol-obj-dialectics-03-1',
    signalId: 'boundary-signal:DIALECTICS-03',
    prompt: '判断并纠正：“次要矛盾和矛盾的次要方面都不起任何作用。”',
    answer: '错误。它们不居决定或支配地位，但仍然发挥作用；两点论也不等于平均用力。',
    sourceBlockIds: ['block:politics-toc-v2-u024:b015', 'block:politics-toc-v2-u024:b016', 'block:politics-toc-v2-u024:b017', 'block:politics-toc-v2-u024:b018', 'block:politics-toc-v2-u024:b025'],
    requiredSourcePhrases: ['并非不起作用', '两点论也不是平均用力'],
  },
  {
    cycle: 'B13', slug: 'cognition02-rational-depends-on-sensory', unitId: 'politics-toc-v2-u028', objectiveId: 'pol-obj-cognition-02-1',
    signalId: 'boundary-signal:COGNITION-02',
    prompt: '判断并纠正：“理性认识层次更高，因此可以抛弃感性材料。”',
    answer: '错误。理性认识依赖感性认识，感性认识也有待发展和深化为理性认识，二者相互渗透。',
    sourceBlockIds: ['block:politics-toc-v2-u028:b005', 'block:politics-toc-v2-u028:b006'],
    requiredSourcePhrases: ['理性认识依赖于感性认识', '相互渗透'],
  },
  {
    cycle: 'B13', slug: 'history02-reaction-not-reverse-determination', unitId: 'politics-toc-v2-u031', objectiveId: 'pol-obj-history-02-1',
    signalId: 'boundary-signal:HISTORY-02',
    prompt: '判断并纠正：“生产关系对生产力有反作用，所以生产关系决定生产力。”',
    answer: '错误。生产力决定生产关系，生产关系对生产力具有能动反作用，反作用不能倒置决定关系。',
    sourceBlockIds: ['block:politics-toc-v2-u031:b010'],
    requiredSourcePhrases: ['生产力决定生产关系', '生产关系对生产力具有能动的反作用'],
  },

  // B14: final productive review. B15 then reviews the residue and accepts none.
  {
    cycle: 'B14', slug: 'history03-fit-not-more-advanced', unitId: 'politics-toc-v2-u031', objectiveId: 'pol-obj-history-03-1',
    signalId: 'boundary-signal:HISTORY-03',
    prompt: '判断并纠正：“上层建筑越超前于经济基础，就越能推动社会发展。”',
    answer: '错误。上层建筑须适合经济基础状况；适合不是静止不变，也不是越超前越好。',
    sourceBlockIds: ['block:politics-toc-v2-u031:b018', 'block:politics-toc-v2-u031:b020'],
    requiredSourcePhrases: ['经济基础决定上层建筑', '不是越超前越好'],
  },
  {
    cycle: 'B14', slug: 'capital01-surplus-value-not-circulation', unitId: 'politics-toc-v2-u037', objectiveId: 'pol-obj-capital-01-1',
    signalId: 'boundary-signal:CAPITAL-01',
    prompt: '判断并纠正：“剩余价值是在流通过程中把商品卖贵产生的。”',
    answer: '错误。剩余价值产生于生产过程，是雇佣工人创造并被资本家无偿占有的超过劳动力价值的部分。',
    sourceBlockIds: ['block:politics-toc-v2-u037:b002', 'block:politics-toc-v2-u037:b014'],
    requiredSourcePhrases: ['被资本家无偿占有', '产生于生产过程而非流通过程'],
  },
  {
    cycle: 'B14', slug: 'value01-owner-cannot-keep-both', unitId: 'politics-toc-v2-u033', objectiveId: 'pol-obj-value-01-2',
    signalId: 'boundary-signal:VALUE-01',
    prompt: '判断并纠正：“商品交换后，同一商品所有者仍能同时保有该商品的使用价值和价值。”',
    answer: '错误。在商品交换中，对同一商品所有者来说，使用价值和价值二者不可兼得。',
    sourceBlockIds: ['block:politics-toc-v2-u033:b013'],
    requiredSourcePhrases: ['使用价值和价值二者不可兼得'],
  },
  {
    cycle: 'B14', slug: 'money02-hoarding-has-condition', unitId: 'politics-toc-v2-u036', objectiveId: 'pol-obj-money-02-1',
    signalId: 'boundary-signal:MONEY-02',
    prompt: '判断并纠正：“只要把钱保存起来，就一定是在执行贮藏手段职能。”',
    answer: '错误。本材料中的贮藏手段要求货币退出流通，并且是足值金属货币或金属条块。',
    sourceBlockIds: ['block:politics-toc-v2-u036:b009', 'block:politics-toc-v2-u036:b010'],
    requiredSourcePhrases: ['退出流通领域', '足值的金属货币或金属条块'],
  },
  {
    cycle: 'B14', slug: 'cognition01-logic-proof-still-useful', unitId: 'politics-toc-v2-u027', objectiveId: 'pol-obj-cognition-01-1',
    signalId: 'boundary-signal:COGNITION-01',
    prompt: '判断并纠正：“实践是检验真理的唯一标准，所以逻辑证明毫无作用。”',
    answer: '错误。实践是检验真理的唯一标准，不等于逻辑证明没有作用；逻辑证明不能取代实践检验。',
    sourceBlockIds: ['block:politics-toc-v2-u027:b023'],
    requiredSourcePhrases: ['不等于逻辑证明毫无作用'],
  },
  {
    cycle: 'B14', slug: 'cognition03-objective-content-subjective-form', unitId: 'politics-toc-v2-u029', objectiveId: 'pol-obj-cognition-03-1',
    signalId: 'boundary-signal:COGNITION-03',
    prompt: '判断并纠正：“真理具有客观性，所以真理的表现形式没有主观性。”',
    answer: '错误。真理的客观性指内容不以人的意志为转移，不等于其表现形式没有主观性。',
    sourceBlockIds: ['block:politics-toc-v2-u029:b009'],
    requiredSourcePhrases: ['不等于真理的表现形式没有主观性'],
  },
  {
    cycle: 'B14', slug: 'support02-no-fixed-sequence', unitId: 'politics-toc-v2-u015', objectiveId: 'pol-obj-support-02-1',
    signalId: 'boundary-signal:SUPPORT-02',
    prompt: '判断并纠正：“教育、科技、人才必须按先培养人才、再开始科研的固定顺序推进。”',
    answer: '错误。教育、科技、人才相互支撑，不能割裂成互不相关、依次完成的单项任务。',
    sourceBlockIds: ['block:politics-toc-v2-u015:b025'],
    requiredSourcePhrases: ['教育、科技、人才相互支撑', '不能把三者割裂'],
  },
  {
    cycle: 'B14', slug: 'cultureeco02-political-task', unitId: 'politics-toc-v2-u009', objectiveId: 'pol-obj-cultureeco-02-1',
    signalId: 'boundary-signal:CULTUREECO-02',
    prompt: '判断并纠正：“宣传思想文化工作的首要政治任务是追求文化产品经济效益。”',
    answer: '错误。首要政治任务是用党的创新理论武装全党、教育人民；社会效益与经济效益是另一关系。',
    sourceBlockIds: ['block:politics-toc-v2-u009:b010', 'block:politics-toc-v2-u009:b011'],
    requiredSourcePhrases: ['首要政治任务', '社会效益放在首位'],
  },
  {
    cycle: 'B14', slug: 'unityforeign02-strategic-support', unitId: 'politics-toc-v2-u018', objectiveId: 'pol-obj-unityforeign-02-1',
    signalId: 'boundary-signal:UNITYFOREIGN-02',
    prompt: '判断并纠正：“推进祖国统一的战略支撑是争取台湾民心。”',
    answer: '错误。争取台湾民心是根本动力；决不承诺放弃使用武力是战略支撑。',
    sourceBlockIds: ['block:politics-toc-v2-u018:b013', 'block:politics-toc-v2-u018:b014'],
    requiredSourcePhrases: ['根本动力', '战略支撑'],
  },
  {
    cycle: 'B14', slug: 'mod02-common-and-chinese-characteristics', unitId: 'politics-toc-v2-u004', objectiveId: 'pol-obj-mod-02-1',
    signalId: 'boundary-signal:MOD-02',
    prompt: '判断并纠正：“中国式现代化只有中国特色，不具有各国现代化的共同特征。”',
    answer: '错误。中国式现代化既有各国现代化的共同特征，也有基于中国国情的鲜明特色。',
    sourceBlockIds: ['block:politics-toc-v2-u004:b032'],
    requiredSourcePhrases: ['既有各国现代化的共同特征', '基于中国国情的鲜明特色'],
  },
];

const REJECTIONS = {
  'pitfall-signal:recall:politics-toc-v2-u001:qa': ['duplicate-runtime-task', '已由新时代基本国情纠错卡直接检验。'],
  'pitfall-signal:recall:politics-toc-v2-u007:qa': ['duplicate-runtime-task', '国内循环与公有制主体边界均已有独立运行卡。'],
  'pitfall-signal:recall:politics-toc-v2-u023:qa': ['duplicate-runtime-task', '新事物不能按出现时间判断已有独立纠错卡。'],
  'boundary-signal:TEN-01': ['duplicate-runtime-task', '与新时代基本国情纠错卡及条件边界卡重复。'],
  'boundary-signal:TEN-02': ['duplicate-runtime-task', '改革性质纠错与改革、法治总目标区分均已覆盖。'],
  'boundary-signal:DEV-01': ['duplicate-runtime-task', '新发展阶段与社会主义初级阶段关系已有条件边界卡。'],
  'boundary-signal:DEV-02': ['duplicate-runtime-task', '发展阶段、理念、格局和制度职责已有运行卡。'],
  'boundary-signal:DEV-03': ['duplicate-runtime-task', '全国统一大市场与地方自我循环已有纠错卡。'],
  'boundary-signal:DEV-05': ['non-scorable-explanation-boundary', '这是适用范围提醒，缺少可唯一评分的知识结论。'],
  'boundary-signal:DEV-06': ['duplicate-runtime-task', '乡村振兴总目标、总方针、总要求、制度保障和粮食位置已有三张卡。'],
  'boundary-signal:DEV-07': ['duplicate-runtime-task', '三类区域战略职责已有运行卡；具体政策限制属于解释边界。'],
  'boundary-signal:FOUND-02': ['duplicate-runtime-task', '进入新时代不改变基本国情已有条件边界卡和纠错卡。'],
  'boundary-signal:SYS-01': ['duplicate-runtime-task', '四组体系职责和不能机械一一对应已有两张运行卡。'],
  'boundary-signal:SYS-03': ['editorial-boundary-not-knowledge-task', '两小节拆分是阅读编排说明，不是待考知识事实。'],
  'boundary-signal:LEADERSHIP-01': ['duplicate-runtime-task', '党领导一切不等于包揽具体事务已由B11纠错卡覆盖。'],
  'boundary-signal:DEMOCRACY-02': ['duplicate-runtime-task', '民主不只发生在选举时已由B11纠错卡覆盖。'],
  'boundary-signal:REFORMLAW-03': ['duplicate-runtime-task', '三种依法行为与三种建设目标已有组合卡，且B12补充依法行政边界。'],
  'boundary-signal:CULTUREECO-01': ['duplicate-runtime-task', '文化自信不等于文化封闭已由B11纠错卡覆盖。'],
  'boundary-signal:CULTUREECO-03': ['duplicate-runtime-task', '生态保护与发展不是简单对立已由B11纠错卡覆盖。'],
  'boundary-signal:UNITYFOREIGN-03': ['duplicate-runtime-task', '和平发展不等于放弃国家利益已由B11纠错卡覆盖。'],
  'boundary-signal:BASICS-02': ['duplicate-runtime-task', '第一性与同一性问题已由B12纠错卡覆盖。'],
};

function main() {
  const sourcePackage = require(absolute(RUNTIME_SOURCE_PATH));
  const { createPoliticsAdapter } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const pkg = createPoliticsAdapter(sourcePackage).buildPackage();
  const objectives = readJson(OBJECTIVES_PATH);
  const confusion = readJson(CONFUSION_PATH);
  const expansion = readJson(EXPANSION_PATH);
  const maintenanceV1 = readJson(MAINTENANCE_V1_PATH);
  const seedRecall = readJson('docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json');
  const blocks = new Map(pkg.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => [block.id, block])));
  const units = new Set(pkg.knowledgeUnits.map((unit) => unit.id));
  const objectiveIds = new Set(objectives.objectives.map((item) => item.objectiveId));
  const signals = Object.values(confusion.candidateLedger).flat();
  const signalById = new Map(signals.map((item) => [item.signalId, item]));
  const previouslySelected = new Set(maintenanceV1.recallCards.map((card) => card.sourceSignalId));
  const remainingHeldSignals = signals.filter((item) => item.disposition === 'held-within-unit-distinction' && !previouslySelected.has(item.signalId));
  const existingCards = [...seedRecall.cards, ...expansion.recallCards, ...maintenanceV1.recallCards];
  const existingPrompts = new Set(existingCards.map((card) => normalize(card.prompt)));

  const cards = SPECS.map((spec, index) => {
    if (!units.has(spec.unitId)) throw new Error(`${spec.slug}: missing unit`);
    if (!objectiveIds.has(spec.objectiveId)) throw new Error(`${spec.slug}: missing objective`);
    const signal = signalById.get(spec.signalId);
    if (!signal || !remainingHeldSignals.includes(signal)) throw new Error(`${spec.slug}: invalid remaining source signal`);
    spec.sourceBlockIds.forEach((id) => {
      const block = blocks.get(id);
      if (!block) throw new Error(`${spec.slug}: invalid source ${id}`);
    });
    const sourceText = spec.sourceBlockIds.map((id) => blocks.get(id).fallbackText).join('\n');
    spec.requiredSourcePhrases.forEach((phrase) => {
      if (!sourceText.includes(phrase)) throw new Error(`${spec.slug}: source phrase unavailable: ${phrase}`);
    });
    if (existingPrompts.has(normalize(spec.prompt))) throw new Error(`${spec.slug}: duplicate runtime prompt`);
    return {
      cardId: `politics-recall-maintenance-v2-${spec.slug}`,
      status: 'maintenance-reviewed',
      origin: `maintenance-${spec.cycle.toLowerCase()}`,
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
      reviewState: `${spec.cycle.toLowerCase()}-maintenance-reviewed`,
      maintenanceCycle: spec.cycle,
      sourceSignalId: spec.signalId,
      order: index + 1,
    };
  });

  const selectedIds = new Set(cards.map((card) => card.sourceSignalId));
  const rejectedIds = new Set(Object.keys(REJECTIONS));
  const remainingIds = new Set(remainingHeldSignals.map((signal) => signal.signalId));
  const classifiedIds = new Set([...selectedIds, ...rejectedIds]);
  const missingDispositionIds = [...remainingIds].filter((id) => !classifiedIds.has(id));
  const unknownDispositionIds = [...classifiedIds].filter((id) => !remainingIds.has(id));
  const duplicateSignalSelections = cards.map((card) => card.sourceSignalId).filter((id, index, all) => all.indexOf(id) !== index);
  const duplicateIds = cards.map((card) => card.cardId).filter((id, index, all) => all.indexOf(id) !== index);
  const allPrompts = [...existingCards, ...cards].map((card) => normalize(card.prompt));
  const duplicatePrompts = allPrompts.filter((value, index, all) => all.indexOf(value) !== index);
  const answersOver70Characters = cards.filter((card) => card.answerCharacterCount > 70).map((card) => card.cardId);
  const dispositionLedger = remainingHeldSignals.map((signal) => {
    const card = cards.find((item) => item.sourceSignalId === signal.signalId);
    if (card) return {
      signalId: signal.signalId,
      decision: 'accepted-new-error-correction',
      cycle: card.maintenanceCycle,
      cardId: card.cardId,
      rationale: 'Formal source directly supports a concise correction not independently scored by the B11 runtime.',
    };
    const [reasonCode, rationale] = REJECTIONS[signal.signalId] || [];
    return { signalId: signal.signalId, decision: 'rejected', cycle: 'B15', reasonCode, rationale };
  });
  const cycleCounts = Object.fromEntries(['B12', 'B13', 'B14'].map((cycle) => [cycle, cards.filter((card) => card.maintenanceCycle === cycle).length]));
  const validation = {
    baseRuntimeRecallCards: 102,
    addedRecallCards: cards.length,
    runtimeRecallCardsAfterPromotion: 102 + cards.length,
    runtimeConfusionItemsAfterPromotion: 14,
    directlyProjectedObjectivesAfterPromotion: 83,
    remainingSignalsReviewed: remainingHeldSignals.length,
    acceptedSignalCount: selectedIds.size,
    rejectedSignalCount: rejectedIds.size,
    unclassifiedSignalCount: missingDispositionIds.length,
    cycleCounts,
    b15AcceptedCards: 0,
    duplicateCardIds: duplicateIds,
    duplicateSignalSelections,
    duplicatePrompts,
    answersOver70Characters,
    missingDispositionIds,
    unknownDispositionIds,
  };
  validation.passed = cards.length === 34
    && remainingHeldSignals.length === 55
    && selectedIds.size === 34
    && rejectedIds.size === 21
    && cycleCounts.B12 === 12
    && cycleCounts.B13 === 12
    && cycleCounts.B14 === 10
    && !duplicateIds.length
    && !duplicateSignalSelections.length
    && !duplicatePrompts.length
    && !answersOver70Characters.length
    && !missingDispositionIds.length
    && !unknownDispositionIds.length;

  const artifact = {
    schemaVersion: 1,
    id: 'politics-learning-bank-maintenance-v2',
    buildDate: BUILD_DATE,
    status: validation.passed ? 'maintenance-reviewed-stop-condition-reached' : 'blocked',
    trigger: 'explicit-direction-to-continue-until-the-registered-stop-condition',
    scope: 'B12-B15 bounded review of all 55 signals left after B11; current 37-unit formal source scope only.',
    authority: {
      sourcePackageVersion: sourcePackage.packageVersion,
      sourcePackageSha256: sha256(RUNTIME_SOURCE_PATH),
      objectivesArtifactSha256: sha256(OBJECTIVES_PATH),
      confusionArtifactSha256: sha256(CONFUSION_PATH),
      expansionArtifactSha256: sha256(EXPANSION_PATH),
      maintenanceV1ArtifactSha256: sha256(MAINTENANCE_V1_PATH),
    },
    cycles: [
      { id: 'B12', name: 'independent correction review 1', reviewedSignals: 12, recallCards: cycleCounts.B12, confusionItems: 0, status: 'accepted-and-promoted' },
      { id: 'B13', name: 'independent correction review 2', reviewedSignals: 12, recallCards: cycleCounts.B13, confusionItems: 0, status: 'accepted-and-promoted' },
      { id: 'B14', name: 'final productive correction review', reviewedSignals: 10, recallCards: cycleCounts.B14, confusionItems: 0, status: 'accepted-and-promoted' },
      { id: 'B15', name: 'residual exit review', reviewedSignals: rejectedIds.size, recallCards: 0, confusionItems: 0, status: 'stop-condition-reached' },
    ],
    recallCards: cards,
    disposition: {
      startingSignals: remainingHeldSignals.length,
      acceptedAsDistinctErrorCorrection: selectedIds.size,
      rejectedAfterReview: rejectedIds.size,
      remainingUnreviewedSignals: missingDispositionIds.length,
      ledger: dispositionLedger,
      rule: 'Accept only a source-explicit, concise and independently scorable correction absent from the current runtime. Editorial boundaries, compound explanations and already-scored facts are rejected.',
    },
    exitDecision: {
      mode: 'closed-until-trigger',
      triggeredBy: 'B15 accepted 0 cards, below the registered minimum productive batch of 3',
      rationale: 'Every one of the 55 remaining signals was dispositioned. The residue consists only of duplicate runtime tasks, non-scorable explanation boundaries, or editorial structure notes.',
      reopenOnlyFor: ['new formal source coverage', 'syllabus or authoritative wording change', 'repeated user error with a source-supported missing task', 'correction of an existing item', 'explicit product decision for one bounded maintenance review'],
    },
    validation,
  };

  process.stdout.write(`${JSON.stringify(artifact, null, 2)}\n`);
  if (!validation.passed) process.exitCode = 1;
}

main();
