#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD_DATE = '2026-10-21';
const RUNTIME_PATH = 'miniprogram/models/politics-p3-v2-runtime.js';
const CURRICULUM_PATH = 'miniprogram/models/politics-systematic-units-runtime.js';
const OBJECTIVES_PATH = 'docs/knowledge-pilot/sources/politics/politics-learning-objectives-v1.json';
const B0_PATH = 'docs/knowledge-platform/implementations/evidence/politics-learning-content-b0-baseline-20261021.json';

function absolute(relativePath) { return path.join(ROOT, relativePath); }
function readJson(relativePath) { return JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8')); }
function sha256(relativePath) { return crypto.createHash('sha256').update(fs.readFileSync(absolute(relativePath))).digest('hex'); }
function unique(values) { return [...new Set(values)]; }
function intersect(left, right) { const set = new Set(right); return unique(left.filter((value) => set.has(value))); }
function countBy(items, keyOf) { return items.reduce((counts, item) => { const key = keyOf(item); counts[key] = (counts[key] || 0) + 1; return counts; }, {}); }
function unitNumber(unitId) { const match = String(unitId).match(/u(\d{3})$/); return match ? match[1] : 'unknown'; }
function normalize(text = '') { return text.replace(/[\s，。！？；：、“”‘’（）《》·,.!?;:()]/g, ''); }
function compositeReasons(card) {
  const reasons = [];
  if ((card.prompt.match(/？/g) || []).length > 1) reasons.push('multiple-question-marks');
  if (/分别|各是|各有什么|及其中|由哪些部分|哪些核心|哪三者|哪两个|哪四个|五种职能/.test(card.prompt)) reasons.push('multi-part-cue');
  return reasons;
}

const BASELINE_REVIEW = {
  'politics-toc-v2-u001': { decision: 'replace-with-atomic-set', primaryObjectiveId: 'pol-obj-found-01-1' },
  'politics-toc-v2-u002': { decision: 'retype-statement-combination', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-found-03-1' },
  'politics-toc-v2-u003': { decision: 'retype-statement-combination', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-sys-01-1' },
  'politics-toc-v2-u004': { decision: 'revise-concise', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-mod-02-1', answer: '人口规模巨大、全体人民共同富裕、物质文明和精神文明相协调、人与自然和谐共生、走和平发展道路。' },
  'politics-toc-v2-u005': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-leadership-01-1' },
  'politics-toc-v2-u006': { decision: 'retype-statement-combination', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-leadership-02-1' },
  'politics-toc-v2-u007': { decision: 'replace-with-atomic-set', primaryObjectiveId: 'pol-obj-dev-01-1' },
  'politics-toc-v2-u008': { decision: 'replace-with-atomic-set', primaryObjectiveId: 'pol-obj-democracy-01-1' },
  'politics-toc-v2-u009': { decision: 'revise-concise', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-cultureeco-01-1', answer: '党的领导是最本质特征；马克思主义是根本指导思想；坚定文化自信是建设文化强国的关键。' },
  'politics-toc-v2-u010': { decision: 'replace-with-atomic-set', primaryObjectiveId: 'pol-obj-livelihood-01-1' },
  'politics-toc-v2-u011': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-cultureeco-03-1' },
  'politics-toc-v2-u012': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-reformlaw-01-1' },
  'politics-toc-v2-u013': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-reformlaw-02-1' },
  'politics-toc-v2-u014': { decision: 'replace-with-error-correction', primaryObjectiveId: 'pol-obj-party-01-1' },
  'politics-toc-v2-u015': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-support-01-1' },
  'politics-toc-v2-u016': { decision: 'retype-statement-combination', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-security-01-1' },
  'politics-toc-v2-u017': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-security-03-1' },
  'politics-toc-v2-u018': { decision: 'retype-condition-boundary', cardType: 'condition-boundary', primaryObjectiveId: 'pol-obj-unityforeign-01-1' },
  'politics-toc-v2-u019': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-unityforeign-03-1' },
  'politics-toc-v2-u020': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-basics-01-1' },
  'politics-toc-v2-u021': { decision: 'retype-statement-combination', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-basics-02-1' },
  'politics-toc-v2-u022': { decision: 'replace-with-atomic-set', primaryObjectiveId: 'pol-obj-basics-03-1' },
  'politics-toc-v2-u023': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-dialectics-01-1' },
  'politics-toc-v2-u024': { decision: 'retype-statement-combination', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-dialectics-03-1' },
  'politics-toc-v2-u025': { decision: 'retype-condition-boundary', cardType: 'condition-boundary', primaryObjectiveId: 'pol-obj-dialectics-05-1' },
  'politics-toc-v2-u026': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-dialectics-06-1' },
  'politics-toc-v2-u027': { decision: 'retype-statement-combination', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-cognition-01-1' },
  'politics-toc-v2-u028': { decision: 'retype-statement-combination', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-cognition-02-1' },
  'politics-toc-v2-u029': { decision: 'retype-condition-boundary', cardType: 'condition-boundary', primaryObjectiveId: 'pol-obj-cognition-03-1' },
  'politics-toc-v2-u030': { decision: 'retype-condition-boundary', cardType: 'condition-boundary', primaryObjectiveId: 'pol-obj-history-01-1' },
  'politics-toc-v2-u031': { decision: 'revise-concise', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-history-03-1', answer: '基本矛盾是生产力与生产关系、经济基础与上层建筑；基本规律是生产关系适合生产力、上层建筑适合经济基础。' },
  'politics-toc-v2-u032': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-history-04-1' },
  'politics-toc-v2-u033': { decision: 'retype-statement-combination', cardType: 'statement-combination', primaryObjectiveId: 'pol-obj-value-01-1' },
  'politics-toc-v2-u034': { decision: 'retain', cardType: 'core-recall', primaryObjectiveId: 'pol-obj-value-02-2' },
  'politics-toc-v2-u035': { decision: 'retype-condition-boundary', cardType: 'condition-boundary', primaryObjectiveId: 'pol-obj-value-03-1' },
  'politics-toc-v2-u036': { decision: 'replace-with-atomic-set', primaryObjectiveId: 'pol-obj-money-01-1' },
  'politics-toc-v2-u037': { decision: 'revise-concise', cardType: 'condition-boundary', primaryObjectiveId: 'pol-obj-capital-01-1', answer: '绝对剩余价值靠延长劳动日；相对剩余价值在劳动日不变时，通过提高社会劳动生产率、缩短必要劳动时间来增加剩余劳动时间。' },
};

const CUSTOM_CARDS = [
  ['u001-core','politics-toc-v2-u001','pol-obj-found-01-1','core-recall','习近平新时代中国特色社会主义思想的核心要义是什么？','坚持和发展中国特色社会主义。',['block:politics-toc-v2-u001:b002'],'不要用完整理论体系清单替代“核心要义”这一单一表述。','replacement'],
  ['u001-unchanged','politics-toc-v2-u001','pol-obj-found-02-2','condition-boundary','新时代社会主要矛盾变化后，哪两个基本判断没有改变？','社会主义初级阶段的基本国情没有变，世界最大发展中国家的国际地位没有变。',['block:politics-toc-v2-u001:b012','block:politics-toc-v2-u001:b015'],'社会主要矛盾变化不等于基本国情和国际地位改变。','replacement'],
  ['u007-stage','politics-toc-v2-u007','pol-obj-dev-01-2','condition-boundary','新发展阶段与社会主义初级阶段是什么关系？','新发展阶段是社会主义初级阶段历史进程中的一个重要阶段，没有改变基本国情。',['block:politics-toc-v2-u007:b005','block:politics-toc-v2-u007:b007'],'新的发展方位不等于我国所处历史阶段已经改变。','replacement'],
  ['u007-quality','politics-toc-v2-u007','pol-obj-dev-01-1','core-recall','高质量发展在现代化建设中是什么地位？','高质量发展是全面建设社会主义现代化国家的首要任务，是我国经济社会发展的主题。',['block:politics-toc-v2-u007:b002'],'不能只把高质量发展理解为数量增加。','replacement'],
  ['u007-five','politics-toc-v2-u007','pol-obj-dev-02-1','statement-combination','五个新发展理念分别回应什么问题？','创新回应发展动力，协调回应发展不平衡，绿色回应人与自然和谐共生，开放回应内外联动，共享回应社会公平正义。',['block:politics-toc-v2-u007:b009','block:politics-toc-v2-u007:b010','block:politics-toc-v2-u007:b011','block:politics-toc-v2-u007:b012','block:politics-toc-v2-u007:b013'],'五个理念共同服务发展，但回答的问题不能互换。','replacement'],
  ['u007-pattern','politics-toc-v2-u007','pol-obj-dev-03-1','condition-boundary','新发展格局的主体和双循环关系是什么？','以国内大循环为主体，国内国际双循环相互促进；不等于各地自我封闭循环。',['block:politics-toc-v2-u007:b015','block:politics-toc-v2-u007:b017'],'“国内大循环为主体”不等于封闭运行或地方小循环。','replacement'],
  ['u007-system','politics-toc-v2-u007','pol-obj-dev-04-1','statement-combination','中国特色社会主义基本经济制度包含哪三层内容？','公有制为主体、多种所有制经济共同发展；按劳分配为主体、多种分配方式并存；社会主义市场经济体制。',['block:politics-toc-v2-u007:b022'],'所有制、分配制度和市场经济体制属于不同层次，不能漏项或互换。','replacement'],
  ['u007-market','politics-toc-v2-u007','pol-obj-dev-05-1','condition-boundary','处理政府和市场关系的完整要求是什么？','使市场在资源配置中起决定性作用，同时更好发挥政府作用，推动有效市场和有为政府更好结合。',['block:politics-toc-v2-u007:b041','block:politics-toc-v2-u007:b042'],'市场决定作用与政府作用不是二选一。','replacement'],
  ['u007-rural-goal','politics-toc-v2-u007','pol-obj-dev-06-1','statement-combination','乡村振兴的总目标和总方针分别是什么？','总目标是农业农村现代化；总方针是坚持农业农村优先发展。',['block:politics-toc-v2-u007:b049'],'不能把“农业农村优先发展”写成总目标。','replacement'],
  ['u007-rural-requirements','politics-toc-v2-u007','pol-obj-dev-06-1','statement-combination','乡村振兴的总要求和制度保障分别是什么？','总要求是产业兴旺、生态宜居、乡风文明、治理有效、生活富裕；制度保障是健全城乡融合发展体制机制和政策体系。',['block:politics-toc-v2-u007:b049'],'总要求与制度保障处于不同表述位置，不能合并成同一清单。','replacement'],
  ['u007-food','politics-toc-v2-u007','pol-obj-dev-06-2','core-recall','粮食和重要农产品稳定安全供给在乡村振兴中是什么位置？','确保重要农产品特别是粮食供给是首要任务；稳定安全供给是建设农业强国的头等大事。',['block:politics-toc-v2-u007:b050','block:politics-toc-v2-u007:b051'],'不能在整理乡村振兴层次时漏掉粮食供给安全。','replacement'],
  ['u007-regions','politics-toc-v2-u007','pol-obj-dev-07-1','statement-combination','区域协调发展战略、区域重大战略和主体功能区战略能否互相替代？','不能。三者分别侧重区域发展部署、重点区域协同和空间开发保护功能分类。',['block:politics-toc-v2-u007:b053','block:politics-toc-v2-u007:b054','block:politics-toc-v2-u007:b055'],'三类安排的对象和作用不同，名称不能互换。','replacement'],
  ['u008-system','politics-toc-v2-u008','pol-obj-democracy-01-1','statement-combination','人民代表大会制度实现了哪三者有机统一？','坚持党的领导、人民当家作主、依法治国有机统一。',['block:politics-toc-v2-u008:b003'],'这组三者统一具体说明人民代表大会制度的根本政治制度安排，不能把提问对象扩大成所有民主内容。','replacement'],
  ['u008-process','politics-toc-v2-u008','pol-obj-democracy-02-1','statement-combination','全过程人民民主实现了哪四组统一？','过程民主和成果民主、程序民主和实质民主、直接民主和间接民主、人民民主和国家意志相统一。',['block:politics-toc-v2-u008:b024'],'四组统一共同说明全过程人民民主，不能只保留选举或程序一个环节。','replacement'],
  ['u008-united-front','politics-toc-v2-u008','pol-obj-democracy-03-1','statement-combination','统一战线的本质要求、工作关键和最核心问题分别是什么？','本质要求是大团结大联合，工作关键是求同存异，最核心最根本的问题是坚持党的领导。',['block:politics-toc-v2-u008:b032','block:politics-toc-v2-u008:b033','block:politics-toc-v2-u008:b034'],'本质要求、工作方法和领导保证处于不同层次，不能互换。','replacement'],
  ['u010-purpose','politics-toc-v2-u010','pol-obj-livelihood-01-1','core-recall','保障和改善民生的根本目的是什么？','把增进民生福祉作为发展的根本目的。',['block:politics-toc-v2-u010:b002'],'不要用具体民生措施替代根本目的。','replacement'],
  ['u010-work-income','politics-toc-v2-u010','pol-obj-livelihood-01-1','statement-combination','就业和收入分配分别是什么定位？','就业是民生之本，收入分配是民生之源。',['block:politics-toc-v2-u010:b004','block:politics-toc-v2-u010:b009','block:politics-toc-v2-u010:b024'],'就业机会与收入形成相联系，但定位不同。','replacement'],
  ['u010-security-health','politics-toc-v2-u010','pol-obj-livelihood-02-1','statement-combination','社会保障和健康建设分别提供什么支撑？','社会保障体系是人民生活的安全网和社会运行的稳定器；人民健康是社会文明进步的基础和国家富强的重要标志。',['block:politics-toc-v2-u010:b015','block:politics-toc-v2-u010:b022'],'社会保障不能替代就业和收入形成，健康建设也不是单一医疗措施。','replacement'],
  ['u014-error','politics-toc-v2-u014','pol-obj-party-01-1','error-correction','判断并纠正：“全面从严治党就是反腐败。”','错误。全面从严治党覆盖党的建设各方面和全过程，反腐败是重要内容但不是全部。',['block:politics-toc-v2-u014:b002','block:politics-toc-v2-u014:b003','block:politics-toc-v2-u014:b040'],'错在用反腐败这一项替代全面从严治党的整体范围。','replacement'],
  ['u022-property','politics-toc-v2-u022','pol-obj-basics-03-1','condition-boundary','物质的唯一特性与根本属性分别是什么？','唯一特性是客观实在性；根本属性和存在方式是运动。',['block:politics-toc-v2-u022:b002','block:politics-toc-v2-u022:b003','block:politics-toc-v2-u022:b016'],'“唯一特性”和“根本属性”回答不同问题，不能调换。','replacement'],
  ['u022-relation','politics-toc-v2-u022','pol-obj-basics-04-1','condition-boundary','物质和意识的辩证关系是什么？','物质决定意识；意识对物质具有能动反作用，反作用必须通过实践实现。',['block:politics-toc-v2-u022:b007','block:politics-toc-v2-u022:b008','block:politics-toc-v2-u022:b016'],'不能夸大意识作用，更不能倒置物质的决定作用。','replacement'],
  ['u036-nature','politics-toc-v2-u036','pol-obj-money-01-1','core-recall','货币的本质是什么？','货币是固定充当一般等价物的商品，本质是一般等价物。',['block:politics-toc-v2-u036:b002'],'不要用货币某一项职能替代货币本质。','replacement'],
  ['u036-functions','politics-toc-v2-u036','pol-obj-money-02-1','statement-combination','货币的五种职能及两种最基本职能是什么？','五种职能是价值尺度、流通手段、贮藏手段、支付手段、世界货币；价值尺度和流通手段是最基本职能。',['block:politics-toc-v2-u036:b003','block:politics-toc-v2-u036:b004'],'五种职能与其中两项基本职能是包含关系，不能当作两套清单。','replacement'],
  ['u036-flow-pay','politics-toc-v2-u036','pol-obj-money-02-1','condition-boundary','流通手段与支付手段怎样区分？','一手交钱一手交货通常是流通手段；赊购赊销、债务清偿等延期支付通常是支付手段。',['block:politics-toc-v2-u036:b007','block:politics-toc-v2-u036:b011','block:politics-toc-v2-u036:b014'],'关键在是否作为即时交换媒介，还是用于延期清偿。','replacement'],
  ['u003-layout','politics-toc-v2-u003','pol-obj-ten-02-1','statement-combination','“五位一体”和“四个全面”分别属于什么布局？','“五位一体”是总体布局；“四个全面”是战略布局。',['block:politics-toc-v2-u003:b008'],'两组都服务中国特色社会主义事业，但所属布局层级不能互换。','b1-gap'],
  ['u003-reform-law','politics-toc-v2-u003','pol-obj-ten-02-2','condition-boundary','改革总目标与依法治国总目标分别指向什么？','改革指向完善和发展中国特色社会主义制度、推进治理现代化；依法治国指向建设法治体系和法治国家。',['block:politics-toc-v2-u003:b009','block:politics-toc-v2-u003:b010'],'两者相联系，但具体对象和完整表述不同。','b1-gap'],
  ['u003-seven','politics-toc-v2-u003','pol-obj-ten-03-1','statement-combination','“十个明确”第7条连接了哪些主要层次？','它连接基本经济制度、政府和市场关系、新发展阶段、理念、格局、高质量发展以及统筹发展和安全。',['block:politics-toc-v2-u003:b011'],'第7条不是单一发展口号，不能漏掉制度、资源配置和发展安全。','b1-gap'],
  ['u003-seven-levels','politics-toc-v2-u003','pol-obj-ten-03-2','statement-combination','基本经济制度、新发展理念和新发展格局分别说明什么？','分别说明制度安排、发展思路和战略路径。',['block:politics-toc-v2-u003:b011','block:politics-toc-v2-u007:b022','block:politics-toc-v2-u007:b057'],'三者同处第7条，但职责不同，不能当成同一概念。','b1-gap'],
  ['u004-goals','politics-toc-v2-u004','pol-obj-mod-01-1','statement-combination','中国梦、中心任务和“两步走”分别回答什么？','中国梦说明愿景，中心任务说明当前总任务，中国式现代化说明推进方式，“两步走”说明阶段安排。',['block:politics-toc-v2-u004:b002','block:politics-toc-v2-u004:b008','block:politics-toc-v2-u004:b013','block:politics-toc-v2-u004:b014'],'愿景、任务、方式和阶段相互连接，但不能用一个名称替代其他层次。','b1-gap'],
  ['u004-stages','politics-toc-v2-u004','pol-obj-mod-01-2','condition-boundary','2035年与本世纪中叶的阶段目标有什么不同？','2035年基本实现社会主义现代化；本世纪中叶建成富强民主文明和谐美丽的社会主义现代化强国。',['block:politics-toc-v2-u004:b013','block:politics-toc-v2-u004:b014','block:politics-toc-v2-u004:b016'],'两个时间节点对应不同阶段，不能合成同一个目标。','b1-gap'],
  ['u009-benefits','politics-toc-v2-u009','pol-obj-cultureeco-02-1','condition-boundary','文化创作中社会效益与经济效益是什么关系？','坚持以人民为中心，把社会效益放在首位，实现社会效益和经济效益相统一。',['block:politics-toc-v2-u009:b010'],'两种效益不是不分主次地并列，也不能只保留其中一种。','b1-gap'],
  ['u001-era-error','politics-toc-v2-u001','pol-obj-found-02-2','error-correction','判断并纠正：“进入新时代说明我国已经改变社会主义初级阶段的基本国情。”','错误。新时代社会主要矛盾发生变化，但社会主义初级阶段的基本国情没有变。',['block:politics-toc-v2-u001:b012','block:politics-toc-v2-u001:b015'],'错在把时代方位变化等同于历史阶段判断改变。','error-expansion'],
  ['u007-loop-error','politics-toc-v2-u007','pol-obj-dev-03-2','error-correction','判断并纠正：“以国内大循环为主体，就是各地分别建立自我小循环。”','错误。国内大循环为主体要求全国统一大市场，并由国内国际双循环相互促进。',['block:politics-toc-v2-u007:b015','block:politics-toc-v2-u007:b017'],'错在把全国统一的国内大循环拆成地方封闭循环。','error-expansion'],
  ['u023-new-error','politics-toc-v2-u023','pol-obj-dialectics-01-1','error-correction','判断并纠正：“刚出现的事物就是哲学意义上的新事物。”','错误。区分新旧事物的根本标志是是否符合事物发展的必然趋势，不是出现时间先后。',['block:politics-toc-v2-u023:b011','block:politics-toc-v2-u023:b012'],'错在用出现时间替代发展趋势这一判断标准。','error-expansion'],
  ['u029-truth-error','politics-toc-v2-u029','pol-obj-cognition-03-1','error-correction','判断并纠正：“真理具有相对性，所以不同说法都可以同时为真。”','错误。真理具有客观性，相对性表示真理受条件和范围限制，不等于取消客观标准。',['block:politics-toc-v2-u029:b004','block:politics-toc-v2-u029:b007','block:politics-toc-v2-u029:b009'],'错在由真理的相对性推出主观主义结论。','error-expansion'],
  ['u036-pay-error','politics-toc-v2-u036','pol-obj-money-02-1','error-correction','判断并纠正：“一手交钱一手交货体现货币的支付手段职能。”','错误。即时交换通常体现流通手段；支付手段通常用于赊购赊销、债务清偿等延期支付。',['block:politics-toc-v2-u036:b007','block:politics-toc-v2-u036:b011','block:politics-toc-v2-u036:b014'],'错在没有区分即时交换媒介与延期清偿。','error-expansion'],
  ['u024-common-specific','politics-toc-v2-u024','pol-obj-dialectics-02-1','statement-combination','矛盾的普遍性与特殊性是什么关系？','普遍性是共性，特殊性是个性；普遍性寓于特殊性，特殊性包含普遍性，二者在一定条件下可以相互转化。',['block:politics-toc-v2-u024:b012','block:politics-toc-v2-u024:b013'],'普遍性与特殊性相互联系，不能理解成互相排斥，也不能脱离条件直接互换。','source-alignment'],
].map(([slug,unitId,primaryObjectiveId,cardType,prompt,answer,sourceBlockIds,errorExplanation,origin]) => ({ slug, unitId, primaryObjectiveId, cardType, prompt, answer, sourceBlockIds, errorExplanation, origin }));

function main() {
  const sourcePackage = require(absolute(RUNTIME_PATH));
  const curriculum = require(absolute(CURRICULUM_PATH));
  const objectivesArtifact = readJson(OBJECTIVES_PATH);
  const b0 = readJson(B0_PATH);
  const { buildCanonicalPackage } = require(absolute('miniprogram/services/knowledge-platform/politics-adapter.js'));
  const knowledgePackage = buildCanonicalPackage(sourcePackage);
  const unitById = new Map(knowledgePackage.knowledgeUnits.map((unit) => [unit.id, unit]));
  const objectiveById = new Map(objectivesArtifact.objectives.map((objective) => [objective.objectiveId, objective]));
  const sourceBlockIds = new Set(knowledgePackage.knowledgeUnits.flatMap((unit) => (unit.blocks || []).map((block) => block.id)));
  const reverseByCardId = new Map(objectivesArtifact.reverseProjectionItems.examCards.map((item) => [item.id, item]));
  const validTypes = new Set(['core-recall','condition-boundary','error-correction','statement-combination']);

  if (Object.keys(BASELINE_REVIEW).length !== 37) throw new Error('baseline review must cover all 37 units');
  const baselineAudit = knowledgePackage.recallItems.map((card) => {
    const review = BASELINE_REVIEW[card.pointId];
    if (!review) throw new Error(`missing baseline review: ${card.id}`);
    const reverse = reverseByCardId.get(card.id);
    return {
      recallItemId: card.id,
      unitId: card.pointId,
      prompt: card.prompt,
      promptCharacterCount: card.prompt.length,
      answerCharacterCount: card.answer.length,
      compositeReasons: compositeReasons(card),
      broadAnswerCandidate: card.answer.length > 60,
      mappedObjectiveIds: reverse?.objectiveIds || [],
      sameUnitObjectiveIds: reverse?.sameUnitObjectiveIds || [],
      decision: review.decision,
      candidateCardType: review.cardType || null,
      primaryObjectiveId: review.primaryObjectiveId,
      crossModeDuplicateDecision: card.pointId === 'politics-toc-v2-u014'
        ? 'replace-systematic-near-duplicate-with-error-correction'
        : 'none',
      sourceBlockIds: card.sourceBlockIds || [],
      reviewState: 'b3-reviewed',
    };
  });

  const cards = [];
  for (const sourceCard of knowledgePackage.recallItems) {
    const review = BASELINE_REVIEW[sourceCard.pointId];
    if (review.decision.startsWith('replace-with-')) continue;
    const answer = review.answer || sourceCard.answer;
    const objectiveIds = (reverseByCardId.get(sourceCard.id)?.objectiveIds || []);
    if (!objectiveIds.includes(review.primaryObjectiveId)) throw new Error(`baseline primary objective mismatch: ${sourceCard.id}`);
    if (!validTypes.has(review.cardType)) throw new Error(`invalid baseline card type: ${sourceCard.id}`);
    cards.push({
      cardId: `politics-recall-v1-base-${unitNumber(sourceCard.pointId)}`,
      status: 'candidate-reviewed',
      origin: review.decision,
      sourceRecallItemId: sourceCard.id,
      replacesRecallItemId: null,
      unitId: sourceCard.pointId,
      primaryObjectiveId: review.primaryObjectiveId,
      supportingObjectiveIds: [],
      cardType: review.cardType,
      difficulty: review.cardType === 'core-recall' ? 'light' : 'standard',
      importance: 'core-within-current-curriculum',
      prompt: sourceCard.prompt,
      answer,
      answerCharacterCount: answer.length,
      sourceBlockIds: sourceCard.answerSourceBlockIds || sourceCard.sourceBlockIds || [],
      errorExplanation: sourceCard.pitfall,
      errorSourceBlockIds: sourceCard.pitfallSourceBlockIds || [],
      remedy: { unitId: sourceCard.pointId, sourceBlockIds: sourceCard.sourceBlockIds || [] },
      freshness: unique(objectiveIds.flatMap((id) => objectiveById.get(id)?.freshness || []).map((item) => JSON.stringify(item))).map((item) => JSON.parse(item)),
      reviewState: 'b3-candidate-reviewed',
    });
  }

  for (const spec of CUSTOM_CARDS) {
    if (!unitById.has(spec.unitId)) throw new Error(`custom card unit missing: ${spec.slug}`);
    if (!objectiveById.has(spec.primaryObjectiveId)) throw new Error(`custom card objective missing: ${spec.slug}`);
    if (!validTypes.has(spec.cardType)) throw new Error(`custom card type invalid: ${spec.slug}`);
    for (const blockId of spec.sourceBlockIds) if (!sourceBlockIds.has(blockId)) throw new Error(`custom card source missing: ${spec.slug} ${blockId}`);
    const mappedObjectiveIds = objectivesArtifact.objectives
      .filter((objective) => objective.unitIds.includes(spec.unitId) && intersect(objective.sourceBlockIds, spec.sourceBlockIds).length)
      .map((objective) => objective.objectiveId);
    if (!mappedObjectiveIds.includes(spec.primaryObjectiveId)) throw new Error(`custom card primary objective lacks source overlap: ${spec.slug}`);
    cards.push({
      cardId: `politics-recall-v1-${spec.slug}`,
      status: 'candidate-reviewed',
      origin: spec.origin,
      sourceRecallItemId: null,
      replacesRecallItemId: spec.origin === 'replacement' ? `recall:${spec.unitId}:qa` : null,
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
      errorSourceBlockIds: spec.sourceBlockIds,
      remedy: { unitId: spec.unitId, sourceBlockIds: spec.sourceBlockIds },
      freshness: unique((objectiveById.get(spec.primaryObjectiveId)?.freshness || []).map((item) => JSON.stringify(item))).map((item) => JSON.parse(item)),
      reviewState: 'b3-candidate-reviewed',
    });
  }

  const coveredObjectiveIds = new Set(cards.map((card) => card.primaryObjectiveId));
  const b1MissingObjectiveIds = objectivesArtifact.objectives
    .filter((objective) => objective.projections.exam.states.includes('missing'))
    .map((objective) => objective.objectiveId);
  const unresolvedB1MissingObjectiveIds = b1MissingObjectiveIds.filter((id) => !coveredObjectiveIds.has(id));
  const prompts = cards.map((card) => normalize(card.prompt));
  const validation = {
    baselineCardCount: baselineAudit.length,
    candidateCardCount: cards.length,
    baselineCompositeCandidates: baselineAudit.filter((item) => item.compositeReasons.length).length,
    baselineBroadAnswerCandidates: baselineAudit.filter((item) => item.broadAnswerCandidate).length,
    baselineDecisionCounts: countBy(baselineAudit, (item) => item.decision),
    cardTypeCounts: countBy(cards, (card) => card.cardType),
    cardOriginCounts: countBy(cards, (card) => card.origin),
    duplicateCardIds: cards.filter((card, index) => cards.findIndex((item) => item.cardId === card.cardId) !== index).map((card) => card.cardId),
    duplicatePrompts: unique(prompts.filter((prompt, index) => prompts.indexOf(prompt) !== index)),
    cardWithoutPrimaryObjective: cards.filter((card) => !objectiveById.has(card.primaryObjectiveId)).map((card) => card.cardId),
    cardWithoutSource: cards.filter((card) => !card.sourceBlockIds.length).map((card) => card.cardId),
    cardWithUnknownSource: cards.flatMap((card) => card.sourceBlockIds.filter((id) => !sourceBlockIds.has(id)).map((id) => ({ cardId: card.cardId, blockId: id }))),
    cardWithoutErrorExplanation: cards.filter((card) => !card.errorExplanation || !card.errorSourceBlockIds.length).map((card) => card.cardId),
    answerOver70Characters: cards.filter((card) => card.answerCharacterCount > 70).map((card) => ({ cardId: card.cardId, answerCharacterCount: card.answerCharacterCount })),
    b1MissingObjectiveIds,
    unresolvedB1MissingObjectiveIds,
    objectiveCoverageCount: coveredObjectiveIds.size,
    objectiveCoverageMissingIds: objectivesArtifact.objectives.map((objective) => objective.objectiveId).filter((id) => !coveredObjectiveIds.has(id)),
    supportingProjectionCount: cards.reduce((sum, card) => sum + card.supportingObjectiveIds.length, 0),
    systematicNearDuplicateResolved: !cards.some((card) => card.sourceRecallItemId === 'recall:politics-toc-v2-u014:qa'),
    lightApplicationCardCount: cards.filter((card) => card.cardType === 'light-application').length,
  };
  validation.passed = validation.baselineCardCount === 37
    && validation.baselineCompositeCandidates === 15
    && validation.baselineBroadAnswerCandidates === 7
    && validation.duplicateCardIds.length === 0
    && validation.duplicatePrompts.length === 0
    && validation.cardWithoutPrimaryObjective.length === 0
    && validation.cardWithoutSource.length === 0
    && validation.cardWithUnknownSource.length === 0
    && validation.cardWithoutErrorExplanation.length === 0
    && validation.answerOver70Characters.length === 0
    && validation.unresolvedB1MissingObjectiveIds.length === 0
    && validation.objectiveCoverageCount === 60
    && validation.objectiveCoverageMissingIds.length === 37
    && validation.supportingProjectionCount === 0
    && validation.systematicNearDuplicateResolved
    && validation.lightApplicationCardCount === 0;

  const artifact = {
    schemaVersion: 1,
    id: 'politics-recall-bank-v1',
    buildDate: BUILD_DATE,
    status: validation.passed ? 'candidate-reviewed' : 'blocked',
    scope: 'Current 37 political knowledge units only; candidate recall bank is not a complete political exam bank and is not integrated into runtime.',
    authority: {
      sourcePackageVersion: sourcePackage.packageVersion,
      sourcePackageSha256: sha256(RUNTIME_PATH),
      curriculumVersion: curriculum.curriculumVersion,
      curriculumSha256: sha256(CURRICULUM_PATH),
      objectiveArtifactId: objectivesArtifact.id,
      objectiveArtifactSha256: sha256(OBJECTIVES_PATH),
      b0AuditId: b0.auditId,
      b0AuditSha256: sha256(B0_PATH),
    },
    policy: {
      singlePrimaryObjective: 'Every card has exactly one audited objective projection; source overlap alone never creates a supporting-objective claim. Statement-combination is allowed only when the structure itself is the retrieval target.',
      selectiveCoverage: 'The recall bank is selective: all 37 units and the nine B1 recall gaps are represented, while 37 explanation-oriented objectives remain systematic-only instead of being credited through loose same-unit overlap.',
      answerBudget: 'Answers over 60 characters are reviewed; candidate answers over 70 characters are rejected.',
      noUnsupportedApplication: 'No light-application cards are created because current sources do not provide a stable scoring context.',
      runtime: 'This artifact is review-only and does not replace the 37 runtime recall cards.',
    },
    curationPolicy: {
      defaultSessionSize: 4,
      selectionPriority: ['previously-missed', 'freshness-due', 'unseen-core', 'type-balance', 'explicit-user-random'],
      unitDiversity: 'Prefer one card per unit before adding a second card from the same unit.',
      typeDiversity: 'Do not fill a default session with statement-combination cards; include error-correction or condition-boundary when eligible.',
      remedyFlow: ['提示', '揭晓', '自评', '按sourceBlockIds回看原文'],
      masteryBoundary: 'A single remembered response records this review only and does not prove stable mastery.',
    },
    baselineAudit,
    cards,
    validation,
    knownScopeGaps: objectivesArtifact.knownScopeGaps,
    nextBatch: validation.passed ? 'B4' : null,
  };

  const output = `${JSON.stringify(artifact, null, 2)}\n`;
  const outputFlag = process.argv.find((argument) => argument.startsWith('--out='));
  if (outputFlag) {
    const target = outputFlag.slice('--out='.length);
    fs.mkdirSync(path.dirname(absolute(target)), { recursive: true });
    fs.writeFileSync(absolute(target), output);
    process.stdout.write(`${JSON.stringify({ status: artifact.status, output: target, validation })}\n`);
  } else process.stdout.write(output);
}

main();
