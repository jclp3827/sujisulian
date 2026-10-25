const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const SOURCE_PATH = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json';
const INVENTORY_PATH = 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-content-inventory.json';
const DEFAULT_OUTPUT = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc2-samples-20261023.json';
const DEFAULT_USER_VIEW_OUTPUT = 'docs/knowledge-platform/implementations/evidence/politics-systematic-user-comprehension-uc2-user-view-20261023.json';
const TARGET_IDS = ['TEN-02', 'TEN-03', 'SYS-01', 'MOD-01', 'DEV-06', 'DIALECTICS-01'];
const block = (unit, id) => `block:politics-toc-v2-${unit}:${id}`;
const emphasis = (quote, occurrence = 1) => ({ part: 'text', quote, occurrence, role: 'key' });

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

const proposals = {
  'TEN-02': {
    title: '事业布局、改革总目标与法治总目标',
    question: '“五位一体”“四个全面”、改革总目标和依法治国总目标分别说明什么？',
    objectives: ['说清“五位一体”总体布局与“四个全面”战略布局的内容', '区分全面深化改革和全面依法治国两个总目标的对象'],
    scopeLimit: '本节连续比较“十个明确”第4至6条，重点区分事业布局、改革总目标和依法治国总目标，不把它们理解为一一对应。',
    sections: [
      {
        label: '“五位一体”与“四个全面”（十个明确·第4条）',
        text: '“五位一体”总体布局包括经济建设、政治建设、文化建设、社会建设、生态文明建设；“四个全面”战略布局包括全面建设社会主义现代化国家、全面深化改革、全面依法治国、全面从严治党。',
        sourceBlockIds: [block('u003', 'b008')],
        emphasis: [emphasis('五位一体'), emphasis('四个全面')],
      },
      {
        label: '全面深化改革总目标（十个明确·第5条）',
        text: '全面深化改革总目标是完善和发展中国特色社会主义制度、推进国家治理体系和治理能力现代化。',
        sourceBlockIds: [block('u003', 'b009')],
        emphasis: [emphasis('全面深化改革总目标')],
      },
      {
        label: '全面依法治国总目标（十个明确·第6条）',
        text: '全面推进依法治国总目标是建设中国特色社会主义法治体系、建设社会主义法治国家。',
        sourceBlockIds: [block('u003', 'b010')],
        emphasis: [emphasis('全面推进依法治国总目标')],
      },
    ],
    boundary: {
      label: '改革与法治有关联',
      text: '改革是社会主义制度的自我完善和发展；改革与法治相辅相成、相伴而生。',
      sourceBlockIds: [block('u012', 'b004'), block('u012', 'b011')],
      emphasis: [],
    },
    recap: {
      label: '本节结论',
      text: '“五位一体”和“四个全面”说明事业布局；全面深化改革总目标说明制度完善发展和治理现代化；全面依法治国总目标说明建设法治体系和法治国家。',
      sourceBlockIds: [block('u003', 'b008'), block('u003', 'b009'), block('u003', 'b010')],
      emphasis: [],
    },
    reflection: {
      prompt: '“五位一体”“四个全面”、改革总目标和依法治国总目标分别指什么？',
      answer: '“五位一体”总体布局包括经济建设、政治建设、文化建设、社会建设、生态文明建设；“四个全面”战略布局包括全面建设社会主义现代化国家、全面深化改革、全面依法治国、全面从严治党。全面深化改革总目标是完善和发展中国特色社会主义制度、推进国家治理体系和治理能力现代化；全面依法治国总目标是建设中国特色社会主义法治体系、建设社会主义法治国家。',
      sourceBlockIds: [block('u003', 'b008'), block('u003', 'b009'), block('u003', 'b010')],
    },
  },
  'TEN-03': {
    title: '“十个明确”第7条的经济发展要求',
    question: '“十个明确”第7条包含哪些经济发展要求？',
    objectives: ['完整说出第7条包含的经济发展要求', '区分制度基础、历史方位、发展思路、战略路径和质量要求'],
    scopeLimit: '本节按复习线索整理“十个明确”第7条，不把整理线索写成正式分类，也不遗漏统筹发展和安全。',
    sections: [
      {
        label: '“十个明确”第7条包含哪些要求',
        text: '第7条包括坚持和完善社会主义基本经济制度，处理市场和政府关系，把握新发展阶段，贯彻新发展理念，构建新发展格局，推动高质量发展，统筹发展和安全。',
        sourceBlockIds: [block('u003', 'b011')],
        emphasis: [],
      },
      {
        label: '基本经济制度与市场、政府关系',
        text: '基本经济制度包括所有制、分配制度和社会主义市场经济体制。市场在资源配置中起决定性作用，同时要更好发挥政府作用，推动有效市场和有为政府更好结合。',
        sourceBlockIds: [block('u007', 'b022'), block('u007', 'b041'), block('u007', 'b042')],
        emphasis: [emphasis('决定性作用'), emphasis('更好发挥政府作用')],
      },
      {
        label: '阶段、理念与格局',
        text: '新发展阶段说明当前历史方位；创新、协调、绿色、开放、共享的新发展理念说明发展思路；以国内大循环为主体、国内国际双循环相互促进的新发展格局说明战略路径。',
        sourceBlockIds: [block('u003', 'b011'), block('u007', 'b057')],
        emphasis: [],
      },
      {
        label: '高质量发展与统筹发展和安全',
        text: '高质量发展是我国经济社会发展的主题，强调发展从“有没有”转向“好不好”。第7条还要求统筹发展和安全，这些要求不能被阶段、理念或格局的缩略词替代。',
        sourceBlockIds: [block('u007', 'b002'), block('u007', 'b003'), block('u003', 'b011')],
        emphasis: [emphasis('高质量发展')],
      },
    ],
    boundary: {
      label: '各项要求不能互换',
      text: '阶段说明历史方位，理念说明发展思路，格局说明战略路径，基本经济制度提供制度基础；国内大循环为主体也不等于各地都搞自己的小循环。',
      sourceBlockIds: [block('u007', 'b017'), block('u007', 'b022'), block('u007', 'b057')],
      emphasis: [],
    },
    recap: {
      label: '本节结论',
      text: '第7条包含基本经济制度、市场与政府关系、新发展阶段、新发展理念、新发展格局、高质量发展以及统筹发展和安全。理解时要分清制度基础、历史方位、发展思路、战略路径和质量要求。',
      sourceBlockIds: [block('u003', 'b011'), block('u007', 'b022'), block('u007', 'b057'), block('u007', 'b002')],
      emphasis: [],
    },
    reflection: {
      prompt: '“十个明确”第7条包含哪些经济发展要求？',
      answer: '第7条要求坚持和完善社会主义基本经济制度，使市场在资源配置中起决定性作用、更好发挥政府作用，把握新发展阶段，贯彻新发展理念，构建新发展格局，推动高质量发展，统筹发展和安全。',
      sourceBlockIds: [block('u003', 'b011')],
    },
  },
  'SYS-01': {
    title: '科学体系的四组核心表述',
    question: '十个明确、十四个坚持、十三个方面成就和六个必须坚持分别说明什么？',
    objectives: ['说清四组表述在科学体系中的定位', '理解四组表述内在贯通但不能互相替代'],
    scopeLimit: '本节只比较四组表述的定位，不展开十三个方面成就的完整清单。',
    sections: [
      {
        label: '十个明确与十四个坚持',
        text: '十个明确是这一思想的主体内容，集中体现主要观点和基本精神；十四个坚持是在治国理政各方面作出的理论分析和政策指导，构成基本方略。',
        sourceBlockIds: [block('u003', 'b004'), block('u003', 'b015')],
        emphasis: [emphasis('主体内容'), emphasis('基本方略')],
      },
      {
        label: '十三个方面成就与六个必须坚持',
        text: '十三个方面成就对新时代伟大实践作出科学总结，展示理论与实践成果；这里先认识这一定位，不展开十三个方面成就的完整清单。六个必须坚持体现这一思想的世界观、方法论和贯穿其中的立场观点方法。',
        sourceBlockIds: [block('u003', 'b017'), block('u003', 'b018')],
        emphasis: [emphasis('理论与实践成果'), emphasis('世界观、方法论')],
      },
    ],
    boundary: {
      label: '内在贯通但各有定位',
      text: '四组表述内在贯通、有机统一；理解时仍要按主体内容、基本方略、理论与实践成果、世界观和方法论四种定位分别辨认。',
      sourceBlockIds: [block('u003', 'b003'), block('u003', 'b004'), block('u003', 'b015'), block('u003', 'b017'), block('u003', 'b018')],
      emphasis: [],
    },
    recap: {
      label: '本节结论',
      text: '十个明确说明主体内容和主要观点，十四个坚持说明基本方略，十三个方面成就总结理论与实践成果，六个必须坚持说明世界观、方法论和立场观点方法。',
      sourceBlockIds: [block('u003', 'b004'), block('u003', 'b015'), block('u003', 'b017'), block('u003', 'b018')],
      emphasis: [],
    },
    reflection: {
      prompt: '四组表述各自在科学体系中说明什么？',
      answer: '十个明确说明主体内容和主要观点；十四个坚持说明基本方略；十三个方面成就说明新时代的理论与实践成果；六个必须坚持说明世界观、方法论和贯穿其中的立场观点方法。',
      sourceBlockIds: [block('u003', 'b004'), block('u003', 'b015'), block('u003', 'b017'), block('u003', 'b018')],
    },
  },
  'MOD-01': {
    title: '中国梦、中国式现代化与“两步走”',
    question: '中国梦、中国式现代化和“两步走”分别说明什么？',
    objectives: ['区分民族复兴愿景及实现途径、中心任务中的推进方式和现代化强国阶段安排', '说清2035年与本世纪中叶两个目标节点'],
    scopeLimit: '本节比较愿景、推进民族复兴的方式和阶段安排，不把三者定义为正式三层体系，也不展开中国式现代化的全部内涵。',
    sections: [
      {
        label: '中国梦说明民族复兴愿景及实现途径',
        text: '实现中华民族伟大复兴是中华民族近代以来最伟大的梦想，中国梦的本质内涵是国家富强、民族振兴、人民幸福。实现中国梦要走中国道路、弘扬中国精神、凝聚中国力量。',
        sourceBlockIds: [block('u004', 'b004'), block('u004', 'b008'), block('u004', 'b009')],
        emphasis: [emphasis('国家富强、民族振兴、人民幸福'), emphasis('中国道路'), emphasis('中国精神'), emphasis('中国力量')],
      },
      {
        label: '中国式现代化说明推进民族复兴的方式',
        text: '党的中心任务包括全面建成社会主义现代化强国、实现第二个百年奋斗目标，并以中国式现代化全面推进中华民族伟大复兴。这里说明中国式现代化在中心任务中的作用，不展开它的全部内涵。',
        sourceBlockIds: [block('u004', 'b002')],
        emphasis: [emphasis('以中国式现代化全面推进中华民族伟大复兴')],
      },
      {
        label: '“两步走”说明现代化强国的阶段安排',
        text: '全面建成社会主义现代化强国分两步：到2035年基本实现社会主义现代化；到本世纪中叶建成富强民主文明和谐美丽的社会主义现代化强国。',
        sourceBlockIds: [block('u004', 'b013'), block('u004', 'b014')],
        emphasis: [emphasis('2035年'), emphasis('本世纪中叶')],
      },
    ],
    boundary: {
      label: '愿景、推进方式和阶段安排分别理解',
      text: '中国梦说明民族复兴愿景；中国式现代化在中心任务中说明怎样推进民族复兴；“两步走”说明全面建成社会主义现代化强国的阶段安排。三者可以对照理解，但不是一套固定的三层分类。',
      sourceBlockIds: [block('u004', 'b002'), block('u004', 'b004'), block('u004', 'b013'), block('u004', 'b014')],
      emphasis: [],
    },
    recap: {
      label: '本节结论',
      text: '中国梦说明民族复兴愿景，实现中国梦要走中国道路、弘扬中国精神、凝聚中国力量；中国式现代化在党的中心任务中说明推进民族复兴的方式；“两步走”说明全面建成社会主义现代化强国的阶段安排。',
      sourceBlockIds: [block('u004', 'b002'), block('u004', 'b004'), block('u004', 'b009'), block('u004', 'b013'), block('u004', 'b014')],
      emphasis: [],
    },
    reflection: {
      prompt: '中国梦、中国式现代化和“两步走”分别说明什么？',
      answer: '中国梦说明民族复兴愿景，其本质内涵是国家富强、民族振兴、人民幸福，实现它要走中国道路、弘扬中国精神、凝聚中国力量；在党的中心任务中，中国式现代化说明怎样推进民族复兴；“两步走”说明全面建成社会主义现代化强国的阶段安排，2035年基本实现社会主义现代化，本世纪中叶建成社会主义现代化强国。',
      sourceBlockIds: [block('u004', 'b002'), block('u004', 'b004'), block('u004', 'b008'), block('u004', 'b009'), block('u004', 'b013'), block('u004', 'b014')],
    },
  },
  'DEV-06': {
    title: '乡村振兴的目标、方针、要求、保障与首要任务',
    question: '乡村振兴的总目标、总方针、总要求、制度保障和首要任务分别是什么？',
    objectives: ['说清乡村振兴总目标、总方针、总要求、制度保障和首要任务各自对应的内容'],
    scopeLimit: '本节只比较总目标、总方针、总要求、制度保障和首要任务；这五项内容不等于乡村振兴的全部内容，也不要同“五项振兴”混淆。',
    sections: [
      {
        label: '总目标与总方针',
        text: '农业农村现代化是总目标，坚持农业农村优先发展是总方针。前者说明要达到什么，后者说明发展次序和政策取向。',
        sourceBlockIds: [block('u007', 'b049')],
        emphasis: [emphasis('农业农村现代化'), emphasis('农业农村优先发展')],
      },
      {
        label: '总要求与制度保障',
        text: '总要求是产业兴旺、生态宜居、乡风文明、治理有效、生活富裕；制度保障是建立健全城乡融合发展体制机制和政策体系。',
        sourceBlockIds: [block('u007', 'b049')],
        emphasis: [emphasis('总要求'), emphasis('制度保障')],
      },
      {
        label: '首要任务',
        text: '确保重要农产品特别是粮食供给，是实施乡村振兴战略的首要任务。',
        sourceBlockIds: [block('u007', 'b050')],
        emphasis: [emphasis('首要任务')],
      },
    ],
    boundary: {
      label: '这五项内容不等于“五项振兴”',
      text: '总目标、总方针、总要求、制度保障和首要任务可以对照复习，但不等于乡村振兴的全部内容。“五项振兴”是另一组正式内容，不能因数量相同而混为一组。',
      sourceBlockIds: [block('u007', 'b048'), block('u007', 'b049'), block('u007', 'b050')],
      emphasis: [],
    },
    recap: {
      label: '本节结论',
      text: '理解乡村振兴时，要分别认准总目标、总方针、总要求、制度保障和首要任务的正式内容。这五项内容可以对照复习，但不能互换，也不等于乡村振兴的全部内容。',
      sourceBlockIds: [block('u007', 'b049'), block('u007', 'b050')],
      emphasis: [],
    },
    reflection: {
      prompt: '乡村振兴的总目标、总方针、总要求、制度保障和首要任务分别是什么？',
      answer: '总目标是农业农村现代化；总方针是坚持农业农村优先发展；总要求是产业兴旺、生态宜居、乡风文明、治理有效、生活富裕；制度保障是建立健全城乡融合发展体制机制和政策体系；首要任务是确保重要农产品特别是粮食供给。',
      sourceBlockIds: [block('u007', 'b049'), block('u007', 'b050')],
    },
  },
  'DIALECTICS-01': {
    title: '联系、整体与部分、新旧事物的判断标准',
    question: '判断联系、整体与部分、新旧事物时分别看什么？',
    objectives: ['说清联系条件、整体与部分功能关系、新旧事物判断标准'],
    scopeLimit: '本节分别理解联系条件、整体与部分的功能关系、新旧事物的判断标准，不展开矛盾分析。',
    sections: [
      {
        label: '联系具有客观性、普遍性和条件性',
        text: '联系和发展是唯物辩证法的总观点、总特征。联系是事物本身固有的，具有客观性、普遍性、多样性、条件性；普遍联系不等于任意两个事物之间都存在必然联系。',
        sourceBlockIds: [block('u023', 'b002'), block('u023', 'b004'), block('u023', 'b005'), block('u023', 'b012')],
        emphasis: [emphasis('客观性、普遍性、多样性、条件性'), emphasis('任意两个事物之间都存在必然联系')],
      },
      {
        label: '整体与部分相互影响',
        text: '整体居于主导地位、统率部分，并具有部分所没有的新功能；部分影响整体，关键部分的功能及其变化甚至决定整体功能。整体功能不是部分功能的机械相加。',
        sourceBlockIds: [block('u023', 'b008'), block('u023', 'b009'), block('u023', 'b012')],
        emphasis: [emphasis('整体居于主导地位'), emphasis('关键部分')],
      },
      {
        label: '发展按必然趋势判断新旧事物',
        text: '发展的实质是新事物的产生和旧事物的灭亡。区分新旧事物的根本标志，是看是否符合事物发展的必然趋势，不能只看出现时间先后。',
        sourceBlockIds: [block('u023', 'b010'), block('u023', 'b011'), block('u023', 'b012')],
        emphasis: [emphasis('发展的必然趋势')],
      },
    ],
    boundary: {
      label: '三类判断使用各自标准',
      text: '判断联系要尊重联系的客观性，并分析具体联系成立的条件；判断整体与部分要看相互作用和功能关系；判断新旧事物要看是否符合发展必然趋势。三类判断依据不同，不能套用同一标准。',
      sourceBlockIds: [block('u023', 'b004'), block('u023', 'b012'), block('u023', 'b008'), block('u023', 'b009'), block('u023', 'b011')],
      emphasis: [],
    },
    recap: {
      label: '本节结论',
      text: '判断联系要尊重联系的客观性，并分析具体联系成立的条件；判断整体与部分要看主导、统率和相互影响的功能关系；判断新旧事物要看是否符合事物发展的必然趋势。发展表现为新事物产生和旧事物灭亡。',
      sourceBlockIds: [block('u023', 'b004'), block('u023', 'b012'), block('u023', 'b008'), block('u023', 'b009'), block('u023', 'b010'), block('u023', 'b011')],
      emphasis: [],
    },
    reflection: {
      prompt: '判断联系、整体与部分、新旧事物时分别看什么？',
      answer: '判断联系要尊重联系的客观性，并分析具体联系成立的条件；判断整体与部分要看主导、统率和相互影响的功能关系；判断新旧事物要看是否符合事物发展的必然趋势。',
      sourceBlockIds: [block('u023', 'b004'), block('u023', 'b008'), block('u023', 'b009'), block('u023', 'b011'), block('u023', 'b012')],
    },
    corePromises: [
      { quote: '客观性、普遍性、多样性、条件性', sourceBlockIds: [block('u023', 'b004')] },
      { quote: '任意两个事物之间都存在必然联系', sourceBlockIds: [block('u023', 'b012')] },
      { quote: '整体居于主导地位', sourceBlockIds: [block('u023', 'b008')] },
      { quote: '发展的必然趋势', sourceBlockIds: [block('u023', 'b011')] },
    ],
  },
};

const decisions = {
  'TEN-02': { structure: 'keep-lesson-id-and-order', task: 'replace-with-direct-recall', source: 'remove-derived-layer-claim-and-reduce-boundary-sources' },
  'TEN-03': { structure: 'keep-lesson-id-and-order', task: 'replace-with-role-mapping', source: 'mark-grouping-as-review-line-not-formal-classification' },
  'SYS-01': { structure: 'keep-lesson-id-and-order', task: 'replace-scenario-with-four-way-direct-recall', source: 'remove-editorial-method-section-and-minimize-object-sources' },
  'MOD-01': { structure: 'keep-lesson-id-and-order', task: 'remove-fabricated-correction-from-default', source: 'limit-modernization-claim-to-central-task-wording' },
  'DEV-06': { structure: 'keep-lesson-id-and-order', task: 'replace-layering-why-question-with-five-position-recall', source: 'remove-unrelated-b052-b056-and-separate-five-revitalizations' },
  'DIALECTICS-01': { structure: 'keep-lesson-id-split-display-into-three-sections', task: 'replace-shared-condition-question-with-three-standard-question', source: 'remove-cross-lesson-u024-b002' },
};

function applyProposal(samples) {
  const next = clone(samples);
  for (const lesson of next.lessons) {
    if (!proposals[lesson.id]) continue;
    Object.assign(lesson, clone(proposals[lesson.id]));
  }
  const byId = new Map(next.lessons.map(lesson => [lesson.id, lesson]));
  for (const lesson of next.lessons) {
    if (lesson.nextLessonId) lesson.transition = `下一节：${byId.get(lesson.nextLessonId).title}`;
  }
  const usedSourceIds = new Set(next.lessons.flatMap(lesson => sourceIds(lesson)));
  next.sourceBindings = next.sourceBindings.filter(item => usedSourceIds.has(item.blockId));
  return next;
}

function sourceIds(value, out = new Set()) {
  if (Array.isArray(value)) for (const item of value) sourceIds(item, out);
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (key === 'sourceBlockIds') for (const id of item) out.add(id);
      else sourceIds(item, out);
    }
  }
  return [...out].sort();
}

function changedFields(before, after) {
  return ['title', 'question', 'objectives', 'scopeLimit', 'sections', 'boundary', 'recap', 'reflection', 'corePromises', 'transition']
    .filter(key => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
}

function rebuildInventoryCoverage(inventory, samples) {
  const next = clone(inventory);
  const byBlock = new Map();
  for (const lesson of samples.lessons) for (const id of sourceIds(lesson)) {
    if (!byBlock.has(id)) byBlock.set(id, []);
    byBlock.get(id).push(lesson.id);
  }
  for (const unit of next.units) {
    unit.defaultReferencingLessonIds = samples.lessons
      .filter(lesson => lesson.sections.some(part => part.sourceBlockIds.some(id => id.split(':')[1] === unit.unitId)))
      .map(lesson => lesson.id);
    for (const item of unit.sourceBlocks) {
      item.sampleLessonIds = byBlock.get(item.blockId) || [];
      const inDefault = samples.lessons.some(lesson => [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap]
        .some(part => part.sourceBlockIds.includes(item.blockId)));
      item.teachingDisposition = inDefault ? 'default-reference' : item.sampleLessonIds.length ? 'optional-reference' : 'source-only';
    }
  }
  return next;
}

function build(options = {}) {
  const sourceBuffer = fs.readFileSync(path.join(root, SOURCE_PATH));
  const current = JSON.parse(sourceBuffer);
  const proposed = applyProposal(current);
  const currentById = new Map(current.lessons.map(lesson => [lesson.id, lesson]));
  const proposedById = new Map(proposed.lessons.map(lesson => [lesson.id, lesson]));
  const proposedBindings = new Set(proposed.sourceBindings.map(item => item.blockId));
  const runtime = require('../miniprogram/models/politics-systematic-units-runtime');
  const samples = TARGET_IDS.map(lessonId => {
    const before = currentById.get(lessonId);
    const after = proposedById.get(lessonId);
    return {
      lessonId,
      decision: decisions[lessonId],
      changedFields: changedFields(before, after),
      sourceBlocksBefore: sourceIds(before),
      sourceBlocksAfter: sourceIds(after),
      before,
      after,
      reviewState: {
        editor: 'proposed',
        'ai-user': 'pending-exact-proposal-review',
        'ai-exam-learner': 'pending-exact-proposal-review',
        'ai-subject-expert': 'source-reviewed-before-proposal',
        'ai-assessment': 'pending-exact-proposal-review',
        'real-user-sample': 'pending',
      },
    };
  });
  const output = {
    schemaVersion: 1,
    batchId: 'politics-systematic-user-comprehension-uc2',
    generatedAt: '2026-10-23',
    status: 'proposal-only',
    canonicalSourceChanged: false,
    runtimeChanged: false,
    source: { path: SOURCE_PATH, sha256: sha256(sourceBuffer), runtimeVersion: runtime.curriculumVersion },
    contract: {
      lessonIdentity: 'All six lesson IDs and route order remain unchanged.',
      displayRule: 'Use knowledge names first; formal group and ordinal appear only as secondary context.',
      groupingRule: 'Teaching comparison must be identified as a review aid and must not be presented as a formal classification.',
      sourceRule: 'Every visible fact object uses its own minimal sufficient source set.',
      taskRule: 'Default self-test asks one direct learning target; fabricated correction scenarios do not remain in default systematic learning.',
    },
    conflictResolution: {
      lessonId: 'DIALECTICS-01',
      opinions: ['ai-user-and-ai-exam-learner:keep-one-lesson', 'ai-assessment:split-into-two-lessons', 'ai-subject-expert:keep-one-lesson-split-display'],
      decision: 'keep-one-lesson-split-display-into-three-sections',
      reason: 'The source unit already groups the three concepts, and the calibrated version gives each concept its own standard without requiring progress migration.',
      splitReconsiderationGate: 'Reopen a split only if a real first-time reader still treats development as a fourth task, cannot restate the three standards in one pass, or the lesson later adds an applied scenario.',
    },
    taskDisposition: [
      { lessonId: 'SYS-01', previousTask: 'scenario-role-identification', disposition: 'replace-in-default', destination: 'not-migrated', reason: 'The scenario tests a product-created classification rather than direct comprehension.' },
      { lessonId: 'MOD-01', previousTask: 'fabricated-outline-correction', disposition: 'replace-in-default', destination: 'hold-for-application-question-review', reason: 'It may only enter an applied bank after a separate source and scoring review.' },
      { lessonId: 'DEV-06', content: 'five-revitalizations', disposition: 'lookup-and-boundary-only', destination: 'not-in-five-position-answer', reason: 'It is a separate formal list and must not be mixed with five comparison positions.' },
    ],
    dependentTransitions: current.lessons
      .filter(lesson => lesson.transition !== proposedById.get(lesson.id).transition)
      .map(lesson => ({ lessonId: lesson.id, before: lesson.transition, after: proposedById.get(lesson.id).transition })),
    sourceBindingChanges: {
      beforeCount: current.sourceBindings.length,
      afterCount: proposed.sourceBindings.length,
      removedAsUnused: current.sourceBindings.map(item => item.blockId).filter(id => !proposedBindings.has(id)),
      handling: 'Only exact bindings are removed from the hypothetical author artifact. Source blocks remain in the knowledge package and inventory for lookup or later lesson review.',
    },
    progressImpact: { lessonIdsChanged: [], orderChanged: false, splitOrMerge: false, migrationRequired: false, runtimeVersionUnaffectedUntilUc6: true },
    samples,
  };
  const userView = {
    schemaVersion: 1,
    batchId: output.batchId,
    generatedAt: output.generatedAt,
    roleInput: 'ai-user-and-ai-exam-learner',
    instructionBoundary: 'Review only the learner-visible fields below. Do not infer author intent or source material.',
    samples: samples.map(({ lessonId, after }) => ({
      lessonId,
      title: after.title,
      question: after.question,
      objectives: after.objectives,
      scopeLimit: after.scopeLimit,
      sections: after.sections.map(({ label, text }) => ({ label, text })),
      boundary: { label: after.boundary.label, text: after.boundary.text },
      recap: { label: after.recap.label, text: after.recap.text },
      reflection: { prompt: after.reflection.prompt, answer: after.reflection.answer },
    })),
  };
  if (options.output !== false) {
    fs.writeFileSync(path.join(root, options.output || DEFAULT_OUTPUT), `${JSON.stringify(output, null, 2)}\n`);
    fs.writeFileSync(path.join(root, options.userViewOutput || DEFAULT_USER_VIEW_OUTPUT), `${JSON.stringify(userView, null, 2)}\n`);
  }
  return { output, userView, proposed, validationInventory: rebuildInventoryCoverage(readJson(INVENTORY_PATH), proposed) };
}

if (require.main === module) {
  const { output } = build();
  console.log(JSON.stringify({ status: 'written', output: DEFAULT_OUTPUT, userViewOutput: DEFAULT_USER_VIEW_OUTPUT, samples: output.samples.length, sourceSha256: output.source.sha256 }));
}

module.exports = { build, applyProposal, DEFAULT_OUTPUT, DEFAULT_USER_VIEW_OUTPUT, INVENTORY_PATH, SOURCE_PATH, TARGET_IDS };
