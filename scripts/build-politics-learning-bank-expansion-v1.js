#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DATE = '2026-10-21';
const OBJECTIVES_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';
const RECALL_PATH = 'docs/knowledge-pilot/sources/politics/politics-recall-bank-v1.json';
const CONFUSION_PATH = 'docs/knowledge-pilot/sources/politics/politics-confusion-bank-v1.json';

const absolute = (relativePath) => path.join(ROOT, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const sha256 = (relativePath) => crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex');
const normalize = (text = '') => text.replace(/[\s，。！？；：、“”‘’（）《》·,.!?;:()]/g, '');

const CARD_SPECS = [
  {
    cycle: 'B8', slug: 'u006-common-prosperity', unitId: 'politics-toc-v2-u006', primaryObjectiveId: 'pol-obj-leadership-03-1', cardType: 'statement-combination',
    prompt: '共同富裕的对象、实现节奏和分配安排分别是什么？',
    answer: '对象是全体人民的物质和精神共同富裕，按阶段逐步实现；分配上形成初次分配、再分配、第三次分配协调配套。',
    sourceBlockIds: ['block:politics-toc-v2-u006:b015', 'block:politics-toc-v2-u006:b017', 'block:politics-toc-v2-u006:b019'],
    errorExplanation: '共同富裕不等于少数人富裕、平均主义或所有人同步达到同一水平。',
    errorSourceBlockIds: ['block:politics-toc-v2-u006:b024'],
  },
  {
    cycle: 'B8', slug: 'u015-research-talent', unitId: 'politics-toc-v2-u015', primaryObjectiveId: 'pol-obj-support-02-1', cardType: 'statement-combination',
    prompt: '基础研究、应用研究、创新主体和人才评价分别抓什么？',
    answer: '基础研究是源头，应用研究是桥梁，研究型大学是基础研究主力军，企业是科技创新主体；人才评价看创新能力、质量和贡献。',
    sourceBlockIds: ['block:politics-toc-v2-u015:b016', 'block:politics-toc-v2-u015:b017', 'block:politics-toc-v2-u015:b018', 'block:politics-toc-v2-u015:b023'],
    errorExplanation: '研究环节、创新主体和评价标准回答不同问题，不能互换。',
    errorSourceBlockIds: ['block:politics-toc-v2-u015:b016', 'block:politics-toc-v2-u015:b017', 'block:politics-toc-v2-u015:b018', 'block:politics-toc-v2-u015:b023'],
  },
  {
    cycle: 'B8', slug: 'u013-rule-of-law-three', unitId: 'politics-toc-v2-u013', primaryObjectiveId: 'pol-obj-reformlaw-03-1', cardType: 'statement-combination',
    prompt: '三种依法行为与法治国家、政府、社会怎样连接？',
    answer: '依法治国、依法执政、依法行政共同推进；法治国家是目标，法治政府是重点任务和主体工程，法治社会是基础。',
    sourceBlockIds: ['block:politics-toc-v2-u013:b014', 'block:politics-toc-v2-u013:b016', 'block:politics-toc-v2-u013:b017', 'block:politics-toc-v2-u013:b018'],
    errorExplanation: '全面依法治国不能缩减为政府依法行政。',
    errorSourceBlockIds: ['block:politics-toc-v2-u013:b020'],
  },
  {
    cycle: 'B8', slug: 'u011-ecology-structure', unitId: 'politics-toc-v2-u011', primaryObjectiveId: 'pol-obj-cultureeco-04-1', cardType: 'statement-combination',
    prompt: '生态文明中的时间目标、三条控制线和保护地体系分别是什么？',
    answer: '2030年前碳达峰、2060年前碳中和；控制线是生态保护红线、永久基本农田、城镇开发边界；保护地以国家公园为主体。',
    sourceBlockIds: ['block:politics-toc-v2-u011:b009', 'block:politics-toc-v2-u011:b010', 'block:politics-toc-v2-u011:b011'],
    errorExplanation: '时间目标、空间控制线和自然保护地体系属于三个不同层次。',
    errorSourceBlockIds: ['block:politics-toc-v2-u011:b009', 'block:politics-toc-v2-u011:b010', 'block:politics-toc-v2-u011:b011'],
  },
  {
    cycle: 'B8', slug: 'u014-organization-discipline', unitId: 'politics-toc-v2-u014', primaryObjectiveId: 'pol-obj-party-02-1', cardType: 'statement-combination',
    prompt: '党的组织、作风、纪律和制度建设各自抓什么？',
    answer: '组织建设以组织体系为重点并抓关键少数；作风核心是联系群众；纪律是治本之策；制度是长远、根本之策。',
    sourceBlockIds: ['block:politics-toc-v2-u014:b015', 'block:politics-toc-v2-u014:b017', 'block:politics-toc-v2-u014:b019', 'block:politics-toc-v2-u014:b021', 'block:politics-toc-v2-u014:b024'],
    errorExplanation: '组织、作风、纪律和制度建设职责不同，不能用一个“从严”概括后互换。',
    errorSourceBlockIds: ['block:politics-toc-v2-u014:b015', 'block:politics-toc-v2-u014:b019', 'block:politics-toc-v2-u014:b021', 'block:politics-toc-v2-u014:b024'],
  },
  {
    cycle: 'B8', slug: 'u014-three-corruptions', unitId: 'politics-toc-v2-u014', primaryObjectiveId: 'pol-obj-party-03-1', cardType: 'statement-combination',
    prompt: '“不敢腐、不能腐、不想腐”各靠什么，自我革命处于什么位置？',
    answer: '不敢腐重震慑，不能腐重制度约束，不想腐重思想教育，三者一体推进；反腐败是最彻底的自我革命。',
    sourceBlockIds: ['block:politics-toc-v2-u014:b026', 'block:politics-toc-v2-u014:b027', 'block:politics-toc-v2-u014:b029'],
    errorExplanation: '全面从严治党和自我革命不能只等同于反腐败，但反腐败是最彻底的自我革命。',
    errorSourceBlockIds: ['block:politics-toc-v2-u014:b026', 'block:politics-toc-v2-u014:b040'],
  },
  {
    cycle: 'B8', slug: 'u016-security-tasks', unitId: 'politics-toc-v2-u016', primaryObjectiveId: 'pol-obj-security-02-1', cardType: 'statement-combination',
    prompt: '国家安全的中心任务、根本保证和公共安全治理方向分别是什么？',
    answer: '中心任务是防范化解国家安全风险，根本保证是党对国家安全工作的绝对领导，公共安全治理向事前预防转型。',
    sourceBlockIds: ['block:politics-toc-v2-u016:b008', 'block:politics-toc-v2-u016:b009', 'block:politics-toc-v2-u016:b010'],
    errorExplanation: '风险任务、领导保证和公共安全治理方向是三个不同层次。',
    errorSourceBlockIds: ['block:politics-toc-v2-u016:b008', 'block:politics-toc-v2-u016:b009', 'block:politics-toc-v2-u016:b010'],
  },
  {
    cycle: 'B8', slug: 'u018-unification-path', unitId: 'politics-toc-v2-u018', primaryObjectiveId: 'pol-obj-unityforeign-02-1', cardType: 'statement-combination',
    prompt: '推进祖国统一的根本保证、方针、政治基础、途径和动力分别是什么？',
    answer: '保证是党中央集中统一领导，方针是和平统一、一国两制，基础是一个中国原则和九二共识，途径是和平融合发展，动力是争取台湾民心。',
    sourceBlockIds: ['block:politics-toc-v2-u018:b009', 'block:politics-toc-v2-u018:b010', 'block:politics-toc-v2-u018:b011', 'block:politics-toc-v2-u018:b012', 'block:politics-toc-v2-u018:b013'],
    errorExplanation: '保证、方针、基础、途径和动力属于不同职责，不能只背成一串同级口号。',
    errorSourceBlockIds: ['block:politics-toc-v2-u018:b009', 'block:politics-toc-v2-u018:b010', 'block:politics-toc-v2-u018:b011', 'block:politics-toc-v2-u018:b012', 'block:politics-toc-v2-u018:b013'],
  },
  {
    cycle: 'B8', slug: 'u024-internal-external', unitId: 'politics-toc-v2-u024', primaryObjectiveId: 'pol-obj-dialectics-04-1', cardType: 'condition-boundary',
    prompt: '内因和外因分别处于什么位置，外因怎样起作用？',
    answer: '内因是发展变化的根据和第一位原因，外因是条件和第二位原因，外因通过内因起作用。',
    sourceBlockIds: ['block:politics-toc-v2-u024:b022', 'block:politics-toc-v2-u024:b023', 'block:politics-toc-v2-u024:b024'],
    errorExplanation: '重视内因不等于否认外因，外因也不能脱离内因直接决定发展。',
    errorSourceBlockIds: ['block:politics-toc-v2-u024:b024', 'block:politics-toc-v2-u024:b025'],
  },
  {
    cycle: 'B8', slug: 'u031-production-relations', unitId: 'politics-toc-v2-u031', primaryObjectiveId: 'pol-obj-history-02-1', cardType: 'condition-boundary',
    prompt: '生产力和生产关系分别体现人与谁的关系？',
    answer: '生产力体现人与自然的关系；生产关系体现物质生产过程中人与人之间的经济关系。',
    sourceBlockIds: ['block:politics-toc-v2-u031:b004', 'block:politics-toc-v2-u031:b008'],
    errorExplanation: '生产力与生产关系不能按“物质和意识”区分，观察对象分别是人与自然、人与人。',
    errorSourceBlockIds: ['block:politics-toc-v2-u031:b004', 'block:politics-toc-v2-u031:b008'],
  },
  {
    cycle: 'B8', slug: 'u037-capital-dimensions', unitId: 'politics-toc-v2-u037', primaryObjectiveId: 'pol-obj-capital-02-1', cardType: 'condition-boundary',
    prompt: '不变可变资本与技术、价值、有机构成分别按什么维度区分？',
    answer: '不变和可变资本按剩余价值生产作用区分；技术构成看生产资料与劳动力比例，价值构成看C与V比例，有机构成反映技术构成变化。',
    sourceBlockIds: ['block:politics-toc-v2-u037:b006', 'block:politics-toc-v2-u037:b008', 'block:politics-toc-v2-u037:b009', 'block:politics-toc-v2-u037:b011', 'block:politics-toc-v2-u037:b012', 'block:politics-toc-v2-u037:b013'],
    errorExplanation: '不变资本与可变资本是资本分类，三种构成讨论比例及其联系，不能当成同一组概念。',
    errorSourceBlockIds: ['block:politics-toc-v2-u037:b006', 'block:politics-toc-v2-u037:b010', 'block:politics-toc-v2-u037:b013'],
  },
  {
    cycle: 'B9', slug: 'u003-first-three', unitId: 'politics-toc-v2-u003', primaryObjectiveId: 'pol-obj-ten-01-1', cardType: 'statement-combination',
    prompt: '“十个明确”前3条分别聚焦什么？',
    answer: '第1条聚焦党的领导，第2条聚焦总任务和中国式现代化，第3条聚焦社会主要矛盾与以人民为中心。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b005', 'block:politics-toc-v2-u003:b006', 'block:politics-toc-v2-u003:b007'],
    errorExplanation: '领导力量、目标任务和社会主要矛盾回答不同问题。',
    errorSourceBlockIds: ['block:politics-toc-v2-u003:b005', 'block:politics-toc-v2-u003:b006', 'block:politics-toc-v2-u003:b007'],
  },
  {
    cycle: 'B9', slug: 'u003-last-three', unitId: 'politics-toc-v2-u003', primaryObjectiveId: 'pol-obj-ten-04-1', cardType: 'statement-combination',
    prompt: '“十个明确”第8至10条分别聚焦什么？',
    answer: '第8条聚焦强军目标，第9条聚焦中国特色大国外交，第10条聚焦全面从严治党和党的建设。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b012', 'block:politics-toc-v2-u003:b013', 'block:politics-toc-v2-u003:b014'],
    errorExplanation: '三条分别属于国防军队、外交和党的建设领域。',
    errorSourceBlockIds: ['block:politics-toc-v2-u003:b012', 'block:politics-toc-v2-u003:b013', 'block:politics-toc-v2-u003:b014'],
  },
  {
    cycle: 'B9', slug: 'u001-four-confidences', unitId: 'politics-toc-v2-u001', primaryObjectiveId: 'pol-obj-found-01-2', cardType: 'statement-combination',
    prompt: '“四个自信”分别指向什么？',
    answer: '道路自信、理论自信、制度自信、文化自信，分别指向中国特色社会主义道路、理论体系、制度和文化。',
    sourceBlockIds: ['block:politics-toc-v2-u001:b003', 'block:politics-toc-v2-u001:b004'],
    errorExplanation: '四个自信是道路、理论、制度、文化四个层次，不能遗漏或互换。',
    errorSourceBlockIds: ['block:politics-toc-v2-u001:b003', 'block:politics-toc-v2-u001:b004'],
  },
  {
    cycle: 'B9', slug: 'u001-era-basis', unitId: 'politics-toc-v2-u001', primaryObjectiveId: 'pol-obj-found-02-1', cardType: 'statement-combination',
    prompt: '中国特色社会主义进入新时代的三个基本依据是什么？',
    answer: '社会主要矛盾发生新变化、党的主要任务发生新变化、中国和世界关系发生新变化。',
    sourceBlockIds: ['block:politics-toc-v2-u001:b011', 'block:politics-toc-v2-u001:b013', 'block:politics-toc-v2-u001:b014'],
    errorExplanation: '新时代判断不只来自时间推移，也不意味着社会主义初级阶段已经改变。',
    errorSourceBlockIds: ['block:politics-toc-v2-u001:b011', 'block:politics-toc-v2-u001:b012', 'block:politics-toc-v2-u001:b013', 'block:politics-toc-v2-u001:b014'],
  },
  {
    cycle: 'B9', slug: 'u002-combination-effects', unitId: 'politics-toc-v2-u002', primaryObjectiveId: 'pol-obj-found-03-2', cardType: 'statement-combination',
    prompt: '“第二个结合”的前提和主要结果是什么？',
    answer: '前提是彼此契合；结果是相互成就，并筑牢道路根基、打开创新空间、巩固文化主体性。',
    sourceBlockIds: ['block:politics-toc-v2-u002:b007', 'block:politics-toc-v2-u002:b008', 'block:politics-toc-v2-u002:b009', 'block:politics-toc-v2-u002:b010', 'block:politics-toc-v2-u002:b011'],
    errorExplanation: '第二个结合不是简单拼接，也不是脱离马克思主义另立理论来源。',
    errorSourceBlockIds: ['block:politics-toc-v2-u002:b008', 'block:politics-toc-v2-u002:b012'],
  },
  {
    cycle: 'B9', slug: 'u007-public-state', unitId: 'politics-toc-v2-u007', primaryObjectiveId: 'pol-obj-dev-04-2', cardType: 'condition-boundary',
    prompt: '公有制主体地位与国有经济主导作用怎样区分？',
    answer: '公有制主体看公有资产在社会总资产中占优势；国有经济主导集中体现为控制国民经济命脉和控制力。',
    sourceBlockIds: ['block:politics-toc-v2-u007:b025', 'block:politics-toc-v2-u007:b026', 'block:politics-toc-v2-u007:b028'],
    errorExplanation: '公有制为主体不等于国有经济为主体，主体地位和主导作用口径不同。',
    errorSourceBlockIds: ['block:politics-toc-v2-u007:b026', 'block:politics-toc-v2-u007:b028'],
  },
  {
    cycle: 'B9', slug: 'u033-commodity-boundary', unitId: 'politics-toc-v2-u033', primaryObjectiveId: 'pol-obj-value-01-2', cardType: 'condition-boundary',
    prompt: '有使用价值的物品为什么不一定是商品，商品必须满足什么边界？',
    answer: '商品必须是用于交换、能满足需要的劳动产品，并同时具有使用价值和价值；只有使用价值不一定是商品。',
    sourceBlockIds: ['block:politics-toc-v2-u033:b002', 'block:politics-toc-v2-u033:b012', 'block:politics-toc-v2-u033:b014'],
    errorExplanation: '有用性只说明使用价值，不能单独证明该物品是商品。',
    errorSourceBlockIds: ['block:politics-toc-v2-u033:b002', 'block:politics-toc-v2-u033:b014'],
  },
  {
    cycle: 'B9', slug: 'u034-labor-angle', unitId: 'politics-toc-v2-u034', primaryObjectiveId: 'pol-obj-value-02-1', cardType: 'condition-boundary',
    prompt: '具体劳动和抽象劳动分别从什么角度观察同一劳动过程？',
    answer: '具体劳动看具体形式，反映人与自然并创造使用价值；抽象劳动撇开形式，体现社会关系并形成价值。',
    sourceBlockIds: ['block:politics-toc-v2-u034:b003', 'block:politics-toc-v2-u034:b004', 'block:politics-toc-v2-u034:b005', 'block:politics-toc-v2-u034:b006'],
    errorExplanation: '具体劳动和抽象劳动是同一劳动过程的两个方面，不是两次或两种独立劳动。',
    errorSourceBlockIds: ['block:politics-toc-v2-u034:b005', 'block:politics-toc-v2-u034:b007'],
  },
  {
    cycle: 'B9', slug: 'u035-value-price-levels', unitId: 'politics-toc-v2-u035', primaryObjectiveId: 'pol-obj-value-03-2', cardType: 'condition-boundary',
    prompt: '社会劳动生产率、单位商品价值量和价格分别是什么关系？',
    answer: '社会劳动生产率越高，单位商品价值量越低；价格以价值为基础并围绕价值上下波动，不能与价值量直接等同。',
    sourceBlockIds: ['block:politics-toc-v2-u035:b004', 'block:politics-toc-v2-u035:b006', 'block:politics-toc-v2-u035:b007', 'block:politics-toc-v2-u035:b010'],
    errorExplanation: '生产率影响单位价值量；价格是价值规律的表现形式，还会围绕价值波动。',
    errorSourceBlockIds: ['block:politics-toc-v2-u035:b007', 'block:politics-toc-v2-u035:b010', 'block:politics-toc-v2-u035:b012'],
  },
  {
    cycle: 'B9', slug: 'u003-system-boundary', unitId: 'politics-toc-v2-u003', primaryObjectiveId: 'pol-obj-sys-01-2', cardType: 'condition-boundary',
    prompt: '“十个明确”“十四个坚持”“六个必须坚持”为什么不能一一对应？',
    answer: '三者内在贯通但职责不同：分别概括理论核心内容、实践基本方略和世界观方法论，不能逐条机械配对。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b003', 'block:politics-toc-v2-u003:b004', 'block:politics-toc-v2-u003:b015', 'block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b020'],
    errorExplanation: '内在贯通表示共同构成科学体系，不表示三组条目数量和内容逐项对应。',
    errorSourceBlockIds: ['block:politics-toc-v2-u003:b003', 'block:politics-toc-v2-u003:b020'],
  },
  {
    cycle: 'B9', slug: 'u003-method-roles', unitId: 'politics-toc-v2-u003', primaryObjectiveId: 'pol-obj-sys-04-2', cardType: 'statement-combination',
    prompt: '人民至上、自信自立、守正创新分别体现什么？',
    answer: '人民至上体现根本价值立场，自信自立体现内在精神特质，守正创新体现鲜明理论品格。',
    sourceBlockIds: ['block:politics-toc-v2-u003:b018', 'block:politics-toc-v2-u003:b019'],
    errorExplanation: '三者都属于方法论，但分别侧重价值立场、精神特质和理论品格。',
    errorSourceBlockIds: ['block:politics-toc-v2-u003:b019'],
  },
  {
    cycle: 'B9', slug: 'u004-modernization-structure', unitId: 'politics-toc-v2-u004', primaryObjectiveId: 'pol-obj-mod-03-2', cardType: 'condition-boundary',
    prompt: '中国式现代化的特色、本质要求和重大原则分别回答什么？',
    answer: '五项特色描述中国国情形成的现代化特征；本质要求规定建设内容；五项重大原则规定推进中必须把握的原则。',
    sourceBlockIds: ['block:politics-toc-v2-u004:b019', 'block:politics-toc-v2-u004:b020', 'block:politics-toc-v2-u004:b021', 'block:politics-toc-v2-u004:b022', 'block:politics-toc-v2-u004:b023', 'block:politics-toc-v2-u004:b024', 'block:politics-toc-v2-u004:b026', 'block:politics-toc-v2-u004:b027', 'block:politics-toc-v2-u004:b028', 'block:politics-toc-v2-u004:b029', 'block:politics-toc-v2-u004:b030', 'block:politics-toc-v2-u004:b031'],
    errorExplanation: '中国特色、本质要求和重大原则属于不同信息层级，不能混列成一张清单。',
    errorSourceBlockIds: ['block:politics-toc-v2-u004:b019', 'block:politics-toc-v2-u004:b024', 'block:politics-toc-v2-u004:b026'],
  },
];

const PAIR_SPECS = [
  {
    relationId: 'relation:politics-toc-v2-u011:related:politics-toc-v2-u007',
    leftObjectiveIds: ['pol-obj-cultureeco-04-1'], rightObjectiveIds: ['pol-obj-dev-02-1'],
    leftSourceBlockIds: ['block:politics-toc-v2-u011:b002', 'block:politics-toc-v2-u011:b010', 'block:politics-toc-v2-u011:b011'], rightSourceBlockIds: ['block:politics-toc-v2-u007:b011'],
    dimension: '绿色发展理念与生态文明措施的层级',
    boundary: '绿色作为新发展理念回答发展方式和人与自然问题；生态文明建设进一步形成控制线、保护地等具体治理安排。',
    initial: { prompt: '题干强调“绿色是永续发展的必要条件，解决人与自然和谐共生问题”，应对应哪一主题？', answerUnitId: 'politics-toc-v2-u007', explanation: '这句话说明绿色新发展理念回答的发展问题。', sourceBlockIds: ['block:politics-toc-v2-u007:b011'] },
    variant: { prompt: '题干改为落实三条控制线并建立以国家公园为主体的保护地体系，应对应哪一主题？', answerUnitId: 'politics-toc-v2-u011', explanation: '控制线和自然保护地体系属于生态文明建设的具体安排。', sourceBlockIds: ['block:politics-toc-v2-u011:b010', 'block:politics-toc-v2-u011:b011'] },
  },
  {
    relationId: 'relation:politics-toc-v2-u012:related:politics-toc-v2-u007',
    leftObjectiveIds: ['pol-obj-reformlaw-01-1'], rightObjectiveIds: ['pol-obj-dev-01-1'],
    leftSourceBlockIds: ['block:politics-toc-v2-u012:b005', 'block:politics-toc-v2-u012:b010'], rightSourceBlockIds: ['block:politics-toc-v2-u007:b002'],
    dimension: '现代化建设中的发展任务与改革动力',
    boundary: '高质量发展是现代化建设的首要任务；改革是经济社会发展的强大动力，二者职责不同。',
    initial: { prompt: '题干询问全面建设社会主义现代化国家的首要任务，应对应哪一主题？', answerUnitId: 'politics-toc-v2-u007', explanation: '现代化建设的首要任务是高质量发展。', sourceBlockIds: ['block:politics-toc-v2-u007:b002'] },
    variant: { prompt: '题干改为询问经济社会发展的强大动力和三个重要支点中的一项，应对应哪一主题？', answerUnitId: 'politics-toc-v2-u012', explanation: '改革是经济社会发展的强大动力，与发展、稳定共同构成重要支点。', sourceBlockIds: ['block:politics-toc-v2-u012:b010'] },
  },
  {
    relationId: 'relation:politics-toc-v2-u013:related:politics-toc-v2-u008',
    leftObjectiveIds: ['pol-obj-reformlaw-02-1'], rightObjectiveIds: ['pol-obj-democracy-02-1'],
    leftSourceBlockIds: ['block:politics-toc-v2-u013:b009', 'block:politics-toc-v2-u013:b014'], rightSourceBlockIds: ['block:politics-toc-v2-u008:b023', 'block:politics-toc-v2-u008:b026'],
    dimension: '人民当家作主与法治治理的职责',
    boundary: '全过程人民民主回答人民当家作主怎样贯穿全过程；全面依法治国回答国家治理怎样在法治轨道上推进。',
    initial: { prompt: '题干强调全链条、全方位、全覆盖，统一过程民主和成果民主，应对应哪一主题？', answerUnitId: 'politics-toc-v2-u008', explanation: '这些特征描述全过程人民民主。', sourceBlockIds: ['block:politics-toc-v2-u008:b023', 'block:politics-toc-v2-u008:b024', 'block:politics-toc-v2-u008:b026'] },
    variant: { prompt: '题干改为建设法治体系、法治国家并坚持三种依法行为共同推进，应对应哪一主题？', answerUnitId: 'politics-toc-v2-u013', explanation: '法治体系、法治国家和三种依法行为属于全面依法治国。', sourceBlockIds: ['block:politics-toc-v2-u013:b009', 'block:politics-toc-v2-u013:b014'] },
  },
  {
    relationId: 'relation:politics-toc-v2-u015:related:politics-toc-v2-u007',
    leftObjectiveIds: ['pol-obj-support-02-1'], rightObjectiveIds: ['pol-obj-dev-02-1'],
    leftSourceBlockIds: ['block:politics-toc-v2-u015:b002'], rightSourceBlockIds: ['block:politics-toc-v2-u007:b009'],
    dimension: '创新发展理念与现代化战略支撑的层级',
    boundary: '创新作为新发展理念回答发展动力问题；教育、科技、人才共同构成现代化建设的基础性、战略性支撑。',
    initial: { prompt: '题干强调“解决发展动力问题”和“引领发展的第一动力”，应对应哪一主题？', answerUnitId: 'politics-toc-v2-u007', explanation: '创新新发展理念直接回答发展动力问题。', sourceBlockIds: ['block:politics-toc-v2-u007:b009'] },
    variant: { prompt: '题干改为强调教育、科技、人才是现代化国家建设的基础性、战略性支撑，应对应哪一主题？', answerUnitId: 'politics-toc-v2-u015', explanation: '教育、科技、人才共同构成现代化建设的战略支撑。', sourceBlockIds: ['block:politics-toc-v2-u015:b002'] },
  },
];

const SYSTEMATIC_ONLY_OBJECTIVE_IDS = [
  'pol-obj-ten-01-2', 'pol-obj-ten-04-2', 'pol-obj-dev-02-2', 'pol-obj-dev-05-2', 'pol-obj-dev-07-2',
  'pol-obj-mod-02-2', 'pol-obj-mod-03-1', 'pol-obj-sys-02-1', 'pol-obj-sys-02-2', 'pol-obj-sys-03-1',
  'pol-obj-sys-03-2', 'pol-obj-sys-04-1', 'pol-obj-sys-05-1', 'pol-obj-sys-05-2',
];

const REJECTED_RELATION_IDS = [
  'relation:politics-toc-v2-u008:related:politics-toc-v2-u004',
  'relation:politics-toc-v2-u009:related:politics-toc-v2-u004',
  'relation:politics-toc-v2-u011:related:politics-toc-v2-u004',
  'relation:politics-toc-v2-u018:related:politics-toc-v2-u016',
  'relation:politics-toc-v2-u019:related:politics-toc-v2-u016',
];

function main() {
  const sourcePackage = require(absolute('miniprogram/models/politics-p3-v2-runtime.js'));
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  const objectives = readJson(OBJECTIVES_PATH);
  const recallBase = readJson(RECALL_PATH);
  const confusionBase = readJson(CONFUSION_PATH);
  const objectiveById = new Map(objectives.objectives.map((objective) => [objective.objectiveId, objective]));
  const unitById = new Map(knowledgePackage.knowledgeUnits.map((unit) => [unit.id, unit]));
  const relationById = new Map(knowledgePackage.relations.map((relation) => [relation.id, relation]));
  const blockIds = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => unit.blocks.map((block) => block.id)));
  const baseObjectiveIds = new Set(recallBase.cards.map((card) => card.primaryObjectiveId));

  const recallCards = CARD_SPECS.map((spec) => {
    const objective = objectiveById.get(spec.primaryObjectiveId);
    if (!objective || baseObjectiveIds.has(spec.primaryObjectiveId)) throw new Error(`${spec.slug}: objective missing or already covered`);
    if (!unitById.has(spec.unitId) || !objective.unitIds.includes(spec.unitId)) throw new Error(`${spec.slug}: unit mismatch`);
    if (!spec.sourceBlockIds.length || spec.sourceBlockIds.some((id) => !blockIds.has(id) || !objective.sourceBlockIds.includes(id))) throw new Error(`${spec.slug}: source mismatch`);
    if (!spec.errorSourceBlockIds.length || spec.errorSourceBlockIds.some((id) => !blockIds.has(id))) throw new Error(`${spec.slug}: error source missing`);
    if (spec.answer.length > 70) throw new Error(`${spec.slug}: answer exceeds 70 characters (${spec.answer.length})`);
    return {
      cardId: `politics-recall-expansion-v1-${spec.slug}`,
      status: 'expansion-reviewed',
      origin: `expansion-${spec.cycle.toLowerCase()}`,
      sourceRecallItemId: null,
      replacesRecallItemId: null,
      unitId: spec.unitId,
      primaryObjectiveId: spec.primaryObjectiveId,
      supportingObjectiveIds: [],
      cardType: spec.cardType,
      difficulty: spec.cardType === 'core-recall' ? 'light' : 'standard',
      importance: 'core-within-current-curriculum',
      prompt: spec.prompt,
      answer: spec.answer,
      answerCharacterCount: spec.answer.length,
      sourceBlockIds: spec.sourceBlockIds,
      errorExplanation: spec.errorExplanation,
      errorSourceBlockIds: spec.errorSourceBlockIds,
      remedy: { unitId: spec.unitId, sourceBlockIds: [...new Set([...spec.sourceBlockIds, ...spec.errorSourceBlockIds])] },
      freshness: objective.freshness || [],
      reviewState: `${spec.cycle.toLowerCase()}-expansion-reviewed`,
      expansionCycle: spec.cycle,
    };
  });

  const confusionItems = PAIR_SPECS.map((spec, index) => {
    const relation = relationById.get(spec.relationId);
    if (!relation || relation.type !== 'related') throw new Error(`${spec.relationId}: related relation missing`);
    const left = unitById.get(relation.sourcePointId);
    const right = unitById.get(relation.targetPointId);
    const allSources = [...new Set([...spec.leftSourceBlockIds, ...spec.rightSourceBlockIds, ...spec.initial.sourceBlockIds, ...spec.variant.sourceBlockIds])];
    if (!left || !right || allSources.some((id) => !blockIds.has(id))) throw new Error(`${spec.relationId}: source or side missing`);
    for (const objectiveId of [...spec.leftObjectiveIds, ...spec.rightObjectiveIds]) if (!objectiveById.has(objectiveId)) throw new Error(`${spec.relationId}: objective missing ${objectiveId}`);
    if (![left.id, right.id].includes(spec.initial.answerUnitId) || ![left.id, right.id].includes(spec.variant.answerUnitId) || spec.initial.answerUnitId === spec.variant.answerUnitId) throw new Error(`${spec.relationId}: checks are not reverse-scored`);
    const options = [{ unitId: left.id, label: left.title }, { unitId: right.id, label: right.title }];
    const makeCheck = (check) => {
      const wrong = check.answerUnitId === left.id ? right : left;
      const answer = check.answerUnitId === left.id ? left : right;
      return { ...check, options, answer: answer.title, wrongOptionUnitId: wrong.id, wrongAnswerExplanation: check.explanation };
    };
    return {
      itemId: `politics-confusion-expansion-v1-${String(index + 1).padStart(2, '0')}`,
      status: 'accepted-expansion',
      runtimeIntegration: 'pending-promotion',
      region: 'thought',
      relationId: spec.relationId,
      sourceRelationType: relation.type,
      left: { unitId: left.id, title: left.title, objectiveIds: spec.leftObjectiveIds, sourceBlockIds: spec.leftSourceBlockIds },
      right: { unitId: right.id, title: right.title, objectiveIds: spec.rightObjectiveIds, sourceBlockIds: spec.rightSourceBlockIds },
      dimension: spec.dimension,
      boundary: spec.boundary,
      sourceBlockIds: allSources,
      initialCheck: makeCheck(spec.initial),
      variantCheck: makeCheck(spec.variant),
      reviewState: 'b8-expansion-reviewed',
      reviewDecision: '双侧正式来源、唯一辨析维度、初判与反向变式闭合，进入运行晋级。',
      expansionCycle: 'B8',
    };
  });

  const allPrompts = [...recallBase.cards, ...recallCards].map((card) => normalize(card.prompt));
  const coveredObjectiveIds = new Set([...recallBase.cards, ...recallCards].map((card) => card.primaryObjectiveId));
  const remainingObjectiveIds = objectives.objectives.map((objective) => objective.objectiveId).filter((id) => !coveredObjectiveIds.has(id));
  const validation = {
    baseRecallCards: recallBase.cards.length,
    addedRecallCards: recallCards.length,
    runtimeRecallCardsAfterPromotion: recallBase.cards.length + recallCards.length,
    baseConfusionItems: confusionBase.items.length,
    addedConfusionItems: confusionItems.length,
    runtimeConfusionItemsAfterPromotion: confusionBase.items.length + confusionItems.length,
    directlyProjectedObjectivesAfterPromotion: coveredObjectiveIds.size,
    remainingObjectiveIds,
    remainingObjectivesAreSystematicOnly: remainingObjectiveIds.length === SYSTEMATIC_ONLY_OBJECTIVE_IDS.length && remainingObjectiveIds.every((id) => SYSTEMATIC_ONLY_OBJECTIVE_IDS.includes(id)),
    duplicateCardIds: recallCards.filter((card, index) => recallCards.findIndex((item) => item.cardId === card.cardId) !== index).map((card) => card.cardId),
    duplicatePrompts: [...new Set(allPrompts.filter((prompt, index) => allPrompts.indexOf(prompt) !== index))],
    answersOver70Characters: recallCards.filter((card) => card.answerCharacterCount > 70).map((card) => card.cardId),
    acceptedRelatedSignals: confusionItems.map((item) => item.relationId),
    rejectedRelatedSignals: REJECTED_RELATION_IDS,
    withinUnitSignalsRoutedAwayFromConfusion: confusionBase.validation.ledgerCounts.byDisposition['held-within-unit-distinction'],
  };
  validation.passed = validation.addedRecallCards === 23
    && validation.addedConfusionItems === 4
    && validation.directlyProjectedObjectivesAfterPromotion === 83
    && validation.remainingObjectivesAreSystematicOnly
    && validation.duplicateCardIds.length === 0
    && validation.duplicatePrompts.length === 0
    && validation.answersOver70Characters.length === 0;

  const artifact = {
    schemaVersion: 1,
    id: 'politics-learning-bank-expansion-v1',
    buildDate: BUILD_DATE,
    status: validation.passed ? 'expansion-reviewed-maintenance-ready' : 'blocked',
    scope: 'Bounded expansion of the B7 runtime banks within the existing 37 formal units and 97 learning objectives.',
    authority: {
      sourcePackageVersion: sourcePackage.packageVersion,
      sourcePackageSha256: sha256('miniprogram/models/politics-p3-v2-runtime.js'),
      objectivesArtifactId: objectives.id,
      objectivesArtifactSha256: sha256(OBJECTIVES_PATH),
      recallArtifactId: recallBase.id,
      recallArtifactSha256: sha256(RECALL_PATH),
      confusionArtifactId: confusionBase.id,
      confusionArtifactSha256: sha256(CONFUSION_PATH),
    },
    cycles: [
      { id: 'B8', name: 'high-confidence expansion', recallCards: 11, confusionItems: 4, status: 'accepted-and-promoted' },
      { id: 'B9', name: 'shared-source selective expansion', recallCards: 12, confusionItems: 0, status: 'accepted-and-promoted' },
      { id: 'B10', name: 'exit audit', recallCards: 0, confusionItems: 0, status: 'maintenance-triggered' },
    ],
    recallCards,
    confusionItems,
    editorialDisposition: {
      systematicOnlyObjectiveIds: SYSTEMATIC_ONLY_OBJECTIVE_IDS,
      systematicOnlyReason: 'These objectives ask the learner to synthesize a lesson, regroup a broad list, or explain cross-part relationships already represented by narrower cards; another card would duplicate the systematic-learning task or exceed a light recall unit.',
      rejectedRelatedRelationIds: REJECTED_RELATION_IDS,
      rejectedRelatedReason: 'These relations express inclusion, support, or context rather than a stable confusion with one unique comparison dimension.',
      withinUnitSignalCount: confusionBase.validation.ledgerCounts.byDisposition['held-within-unit-distinction'],
      withinUnitDisposition: 'route to error-correction recall or systematic explanation; do not manufacture a two-sided confusion pair without two formal targets',
    },
    exitDecision: {
      mode: 'maintenance',
      triggeredBy: 'all-current-eligible-signals-have-explicit-disposition',
      consecutiveLowYieldBatchesRequired: false,
      rationale: 'All 37 previously unprojected objectives and all nine held cross-unit relations now have accepted or rejected dispositions; remaining within-unit signals lack two formal sides for confusion questions.',
      reopenOnlyFor: ['new formal source coverage', 'syllabus or authoritative wording change', 'repeated user error with a source-supported missing task', 'correction of an existing item'],
    },
    validation,
  };

  process.stdout.write(`${JSON.stringify(artifact, null, 2)}\n`);
  if (!validation.passed) process.exitCode = 1;
}

main();
