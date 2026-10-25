const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceFile = path.join(root, 'docs/knowledge-pilot/sources/politics/systematic-learning-v2-samples.json');
const readingFile = path.join(root, 'docs/knowledge-platform/implementations/politics-systematic-understanding-v2-content-samples-20261020.md');
const previousCurriculumVersions = ['units-9000f36d759d', 'units-bb32645a95ce', 'units-371caff5370a', 'units-2ed23ba45dd1'];

const recapOverrides = {
  'VALUE-02': '商品这一侧看使用价值与价值，劳动这一侧看具体劳动与抽象劳动。具体劳动生产使用价值，抽象劳动凝结形成价值。',
  'DEV-02': '用“动力、不平衡、人与自然、内外联动、公平正义”辨认各理念面对的问题，同时保留各理念的正式名称与表述。',
  'DEV-04': '社会主义基本经济制度包括所有制、分配制度和社会主义市场经济体制三方面内容，各自回答不同层次的问题。',
  'DEV-06': '乡村振兴可以从目标、方针、要求、保障和任务五个方面理解，各层内容共同服务农业农村现代化。',
  'DEV-07': '发展阶段、发展理念、发展格局和制度及实际领域共同构成这一主题的结构，各自回答方位、思路、路径和落实条件。',
  'FOUND-01': '“坚持和发展中国特色社会主义”确定主题，道路、理论、制度、文化四个方面把这一主题具体展开。',
  'FOUND-03': '本主题从坚持和发展的主题、所处的新时代条件以及理论同实际和文化的结合三个层次建立核心要义的基础结构。',
  'MOD-01': '民族复兴说明愿景，中国式现代化说明推进方式，两个阶段说明战略安排，三者共同形成目标与路径结构。',
  'MOD-02': '人口规模巨大、共同富裕、物质文明和精神文明协调、人与自然和谐共生、走和平发展道路，共同描绘中国式现代化的基本样貌。',
  'MOD-03': '本主题依次说明中国式现代化的目标与阶段、五个特色、本质要求和重大原则，形成目标、样貌、要求与推进原则的结构。',
  'SYS-01': '核心观点、基本方略、实践成果、立场观点方法是理解科学体系的四个阅读角度，分别承担不同的说明职责。',
  'SYS-02': '前七项依次涉及领导、人民立场、改革、发展理念、人民当家作主、依法治国和价值体系，只构成十四个坚持的前半部分。',
  'SYS-03': '十四个坚持把不同方面的实践方略组织在一起，理解时既要分清每项对象，也要把握它们共同承担的基本方略职责。',
  'SYS-04': '人民至上、自信自立、守正创新分别强调根本价值立场、内在精神特质和鲜明理论品格，共同体现立场观点方法。',
  'SYS-05': '本主题区分了主体内容、基本方略、实践成果和立场观点方法四组表述的职责，并重点理解十四个坚持和六个必须坚持在体系中的位置。',
  'LEADERSHIP-01': '领导力量、集中统一领导原则和根本领导制度共同说明党的领导地位及其制度安排，同时保留各国家机关依职能履职的边界。',
  'LEADERSHIP-03': '共同富裕面向全体人民，兼顾物质和精神生活，依靠发展创造条件，并由初次分配、再分配和第三次分配协调配套。',
  'LIVELIHOOD-01': '就业是民生之本，收入分配是民生之源；就业关注岗位数量与质量，分配关注收入形成和调节。',
  'LIVELIHOOD-02': '就业、分配、社会保障和健康分别承担劳动参与、成果分配、风险保障和健康支持，共同服务民生福祉。',
  'SUPPORT-01': '教育明确培养目标，以立德树人为根本任务，兼顾公益、公平和质量，并与科技、人才共同构成基础支撑。',
  'DEMOCRACY-01': '根本政治制度与三项基本政治制度定位不同，共同构成人民当家作主的制度安排。',
  'DEMOCRACY-02': '全过程人民民主统一过程与成果、程序与实质等方面，并通过制度载体、协商及基层民主贯穿参与过程，因此不只是一场选举。',
  'DEMOCRACY-03': '本主题从制度定位、全过程参与和大团结大联合三个层次理解人民当家作主；三者相互联系但不是同义词。',
  'REFORMLAW-03': '改革推动制度完善并与法治相互促进；法治具有道路、体系和建设安排，共同推进与一体建设需要分别理解。',
  'CULTUREECO-01': '文化建设在领导与指导思想下坚定文化自信，连接先进文化、革命文化和中华优秀传统文化，并以转化发展和保护原则处理传承创新。',
  'CULTUREECO-02': '文化建设既明确方向和传承创新，也坚持以人民为中心，处理创作导向以及社会效益与经济效益的关系。',
  'CULTUREECO-03': '生态文明把保护自然纳入现代化与高质量发展，通过发展方式、生活方式和保护方针理解系统治理。',
  'CULTUREECO-04': '本主题分别从方向、人民立场与效益理解文化建设，从发展方式、时间目标和空间安排理解生态文明，二者都属于现代化全景中的重要内容。',
  'PARTY-01': '全面从严治党以主线、统领、根基和着力点组织总体要求，各项建设和制度建设共同构成整体布局。',
  'PARTY-02': '组织建设关注体系和干部，作风建设关注群众联系，纪律建设与制度建设提供约束和保障，四者相互支撑。',
  'PARTY-03': '本主题从建设总要求、各项建设到反腐败和自我革命，说明全面从严治党覆盖多方面和全过程，三不腐需要相互配合。',
  'SECURITY-01': '总体国家安全观以人民安全为宗旨、政治安全为根本、经济安全为基础，并保留军事科技文化社会安全等保障和国际安全依托。',
  'SECURITY-02': '总体国家安全观提供结构，风险防范明确任务，党的领导提供保证，公共安全强调把预防关口前移。',
  'SECURITY-03': '本主题从总体结构、风险防范与公共安全，再到国防和军队建设理解安全领域；国防军队是重要内容，但不能替代总体国家安全。',
  'UNITYFOREIGN-01': '“一国”是前提和基础，“两制”是制度安排，维护国家主权、安全、发展利益是最高原则，并需分清提出缘起和首先实践的地区。',
  'UNITYFOREIGN-03': '本主题从国家统一、推进统一的方略到中国特色大国外交，分别理解国家内部统一和对外关系中的目标、路径与原则。',
  'BASICS-02': '判断哲学基本问题时，先分清是在问物质和意识何者为第一性，还是二者是否具有同一性，再辨认相应派别及内部区别。',
  'BASICS-03': '客观实在性说明物质的唯一特性，运动说明物质的根本属性和存在方式，相对静止说明运动中的特殊状态。',
  'DIALECTICS-02': '矛盾具有相互依存又相互排斥的两面，共性存在于个性之中，因此分析问题既要全面，也要具体。',
  'DIALECTICS-03': '分析复杂矛盾时要先确定比较层次，再分清主要与次要，最后把两点论与重点论统一起来，不能脱离条件预设固定主次。',
  'DIALECTICS-05': '度用来判断量变和质变的界限，量的积累、质的飞跃与适度原则需要放回各自条件理解。',
  'DIALECTICS-06': '辩证否定说明克服与保留，否定之否定说明前进性与曲折性的统一；至此，本主题从联系、矛盾、量变质变和否定之否定理解发展。',
  'COGNITION-01': '实践是认识的来源、动力、目的和检验标准，认识又反作用于实践，二者构成相互联系的过程。',
  'COGNITION-02': '认识从实践出发，由感性认识上升为理性认识，再回到实践，使认识过程同时具有基础、深化和检验。',
  'HISTORY-01': '物质生产方式是社会存在发展的基础，社会存在决定社会意识，社会意识具有相对独立性并反作用于社会存在。',
  'HISTORY-02': '生产力说明生产中的物质力量，生产关系说明生产中人与人的经济关系，二者之间既有决定作用也有反作用。',
  'HISTORY-03': '生产力与生产关系、经济基础与上层建筑分别具有决定与反作用，两对社会基本矛盾又相互联系。',
  'HISTORY-04': '本主题从社会存在与社会意识、两对社会基本矛盾和人民群众三个层次，分别理解社会结构、发展动力和历史主体。',
  'MONEY-01': '货币的本质是一般等价物，价值尺度用于表现价值，流通手段充当商品交换媒介，二者的作用和条件不同。',
  'MONEY-02': '货币本质是一般等价物，五种职能分别说明价值衡量、流通媒介、保存、支付和国际流通作用，需根据具体作用与条件区分。',
  'CAPITAL-02': '本主题先比较绝对与相对剩余价值的时间条件，再按剩余价值生产中的作用区分不变资本与可变资本，并辨认技术构成、价值构成和有机构成的关系。',
};

const directAnswers = {
  'LEADERSHIP-01': '不能混同。党的领导明确根本政治方向和集中统一领导，国家机关依照制度和各自职能履职；领导地位不能替代具体机关职能。',
  'LEADERSHIP-02': '人民立场确立价值方向，为人民服务说明根本宗旨，群众路线把这一方向落实为一切为了群众、一切依靠群众。三者相连，但回答的问题不同。',
  'LEADERSHIP-03': '不是。共同富裕面向全体人民，兼顾物质和精神生活，也有逐步实现的过程；它依靠发展创造条件，并由初次分配、再分配和第三次分配协调配套。',
  'LIVELIHOOD-01': '就业解决劳动参与、岗位数量与质量问题，收入分配处理劳动成果怎样形成和调节。二者共同连接发展与生活，但承担的职责不同。',
  'LIVELIHOOD-02': '就业提供民生基础，社会保障织牢安全网，健康建设强调人民健康和预防。三者分别承担就业、风险保障和健康支持，不能互相替代。',
  'SUPPORT-01': '“培养什么人”明确教育的目标和方向，“怎样培养人”涉及立德树人以及公平、质量等实现方式。目标与方式要同时保留。',
  'SUPPORT-02': '基础研究提供源头支撑，应用研究推动成果面向实际，人才培养和评价为持续创新提供主体条件；教育又为人才成长奠定基础。',
  'DEMOCRACY-01': '人民代表大会制度是根本政治制度，中国共产党领导的多党合作和政治协商制度、民族区域自治制度、基层群众自治制度是基本政治制度。它们定位不同，共同构成人民当家作主的制度安排。',
  'DEMOCRACY-02': '“全过程”体现为过程与成果、程序与实质等方面的统一，并通过制度载体、协商和基层民主贯穿参与过程，因此不只是一次选举。',
  'DEMOCRACY-03': '求同存异是在共同目标上凝聚最大共识，同时承认和包容合理差异。团结提供共同方向，多样性保留不同主体，二者共同服务大团结大联合。',
  'REFORMLAW-01': '改革为发展提供动力，发展为稳定和民生改善创造条件，稳定又为改革发展提供环境；三者通过人民生活和制度完善联系起来。',
  'REFORMLAW-02': '因为全面依法治国还要明确法治道路，并建设法律规范、法治实施、法治监督、法治保障和党内法规等体系；只有法律文本不足以说明完整结构。',
  'REFORMLAW-03': '不是。依法治国、依法执政、依法行政说明不同主体和职责的共同推进，法治国家、法治政府、法治社会说明建设对象的一体推进，两组名称不能互换。',
  'CULTUREECO-01': '传承要保留优秀传统文化的根脉，创新则通过创造性转化和创新性发展使其适应新的条件。只有传承没有创新，文化难以持续发展。',
  'CULTUREECO-02': '文化建设还承担价值引领、满足人民精神文化需要和社会效益等职责。经济收益只是一个方面，不能替代以人民为中心和社会效益的判断。',
  'CULTUREECO-03': '生态文明涉及发展方式、生活方式、资源利用和系统保护，问题产生于发展全过程。只做污染后的末端治理，不能替代源头预防和系统治理。',
  'CULTUREECO-04': '碳达峰、碳中和是分阶段的时间目标；三条控制线划定国土空间开发保护边界；自然保护地体系组织重要自然生态空间的保护。',
  'PARTY-01': '全面从严治党还包括政治、思想、组织、作风、纪律和制度建设等整体要求，反腐败是其中的重要部分，不能替代全部党的建设。',
  'PARTY-02': '抓关键少数突出领导干部的示范和责任，保持群众联系处理党的作风与人民立场。组织、作风、纪律和制度相互支撑，缺一不可。',
  'PARTY-03': '不敢腐强化震慑，不能腐强化制度约束，不想腐增强思想自觉。三者分别作用于行为、制度和思想，需要同时推进、共同发力。',
  'SECURITY-01': '人民安全是宗旨，政治安全是根本，经济安全是基础。三者处在总体国家安全结构的不同位置，需要统筹而不能互换。',
  'SECURITY-02': '防范化解重大风险强调识别和处置影响全局的风险，公共安全预防强调把防线前移、减少事故和危害。二者都重视事前，但对象和任务不同。',
  'SECURITY-03': '强军目标回答建设什么样的人民军队，党对人民军队的绝对领导回答根本原则和制度保证，现代化阶段回答建设进程与时间安排。',
  'UNITYFOREIGN-01': '“一国”是实行“两制”的前提和基础，“两制”是在“一国”之内的制度安排；维护国家主权、安全、发展利益是最高原则，顺序不能倒置。',
  'UNITYFOREIGN-02': '因为统一方略同时包含领导保证、基本方针、政治基础、实践途径、动力和支撑。只记一个口号会丢失不同定位及其相互关系。',
  'UNITYFOREIGN-03': '不是。人类命运共同体还要放在不同关系对象、建设路径、基本遵循、战略支撑、引领作用和合作平台中理解，不能只剩一个目标名称。',
  'BASICS-01': '不是。三个组成部分说明理论结构，直接理论来源说明思想来源，两大发现说明科学社会主义的重要理论基础；三者属于不同层次。',
  'BASICS-02': '唯物与唯心围绕物质和意识谁是第一性来划分，可知与不可知围绕思维能否认识存在来划分。两组分歧回答的问题不同。',
  'BASICS-03': '不是。客观实在性说明物质的唯一特性，运动说明物质的根本属性和存在方式，相对静止说明运动中的特殊状态，三者定位不同。',
  'BASICS-04': '不否认。物质决定意识要求从客观实际出发，意识又能能动地认识和改造世界；这种作用必须尊重客观规律并通过实践实现。',
  'DIALECTICS-01': '不能把普遍联系理解成任意两件事必然相连，不能把整体功能理解成部分功能机械相加，也不能只按出现时间判断新旧事物；三类判断都要保留具体条件。',
  'DIALECTICS-02': '同一性说明矛盾双方相互依存，斗争性说明相互排斥；普遍性说明矛盾普遍存在，特殊性说明具体矛盾各有特点。分析时既要全面，也要具体。',
  'DIALECTICS-03': '主要矛盾是在多个矛盾中判断哪一个居支配地位，矛盾主要方面是在同一矛盾的双方中判断哪一方居支配地位，比较层次不同。',
  'DIALECTICS-04': '不等于。内因是变化的根据，外因是变化的条件，并通过内因起作用；强调内因不能取消外部条件的影响。',
  'DIALECTICS-05': '不一定。量变只有在一定范围和限度内积累，突破“度”才发生质变；数量变化尚未越过度时，事物仍保持原有性质。',
  'DIALECTICS-06': '辩证否定说明对旧事物既克服又保留，即“扬弃”；否定之否定说明发展是前进性与曲折性的统一。不能用表面上的两次否定替代内部矛盾和具体发展过程。',
  'COGNITION-01': '不要求每个人对所有知识都亲身实践。认识可以包含间接经验，但这些经验归根到底仍来源于社会实践，并要在实践中接受检验。',
  'COGNITION-02': '因为理性认识还要回到实践，才能指导行动并检验认识是否正确。只完成从感性到理性的飞跃，认识过程还没有形成实践闭环。',
  'COGNITION-03': '不意味着可以任意改变。真理的客观性要求内容符合客观对象，条件性说明真理有适用范围；条件变化要依据新的客观实际判断。',
  'HISTORY-01': '不否定。社会存在决定社会意识，社会意识又有自身发展特点并能反作用于社会存在；相对独立性建立在决定作用仍然成立的基础上。',
  'HISTORY-02': '生产力是生产中的物质力量，包含劳动者、劳动资料和劳动对象等要素；生产关系是生产过程中人与人的经济关系，二者不是同类对象。',
  'HISTORY-03': '生产力与生产关系构成一对矛盾，生产关系的总和构成经济基础，政治法律制度及相应社会意识形态属于上层建筑，三者处在不同层次。',
  'HISTORY-04': '不否认。人民群众是历史创造的决定力量，杰出人物能够在一定条件下发挥重要作用，但其作用受社会历史条件和群众实践制约。',
  'MONEY-01': '价值尺度用于表现和衡量商品价值，可以由观念货币承担；流通手段要在商品交换中实际充当媒介，因此需要现实货币。',
  'MONEY-02': '因为流通手段是在商品交换中充当媒介，支付手段则用于赊购赊销、清偿债务以及租金、税金、工资等支付关系；具体条件不同。',
  'CAPITAL-01': '绝对剩余价值生产保持必要劳动时间不变并延长劳动日；相对剩余价值生产保持工作日长度不变，通过提高社会劳动生产率缩短必要劳动时间。完整产生机制仍待补源。',
  'CAPITAL-02': '不是。不变资本和可变资本按它们在剩余价值生产中的不同作用划分，技术构成则表示生产资料与劳动力的比例，划分依据不同。',
};

const b4PreviousReflectionAnswers = {
  'BASICS-03': '不是。客观实在性说明物质的根本特性，运动说明物质的存在方式，相对静止说明运动中的特殊状态，三者定位不同。',
  'DIALECTICS-01': '不是。联系具有普遍性，也具有客观性和条件性；具体事物是否构成必然联系，要根据真实条件和相互作用判断。',
  'DIALECTICS-06': '辩证否定既克服旧事物中过时、消极的因素，又保留和发展其中积极、合理的因素，因此是“扬弃”，不是全盘抛弃。',
};

const b4LessonOverrides = {
  'TEN-02': {
    title: '布局怎样连接改革与法治',
    question: '第4至6条怎样从事业布局进入改革与法治总目标？',
    scopeLimit: '本次解释第4至6条如何从整体布局进入两个治理总目标；不展开各领域全部措施。',
    reflectionPrompt: '两种布局与改革、法治两个总目标怎样连接，又为什么不能混成一组？',
    reflectionAnswer: '“五位一体”和“四个全面”说明事业布局；改革总目标指向制度完善与治理现代化，依法治国总目标指向法治体系和法治国家。它们在事业推进中相连，但布局和具体总目标层次不同。',
  },
  'MOD-01': {
    reflectionPrompt: '为什么中国梦、中心任务和“两步走”不能合并成同一个目标？',
    reflectionAnswer: '中国梦说明民族复兴愿景，中心任务说明强国建设和民族复兴的总任务，中国式现代化说明推进方式，“两步走”说明阶段安排；层次不同，彼此连接而不能互换。',
  },
  'DEV-06': {
    question: '乡村振兴的目标、方针、要求、保障和任务怎样构成一套结构？',
    reflectionPrompt: '为什么乡村振兴要把目标、方针、要求、保障和任务分层理解？',
    reflectionAnswer: '它们分别回答要达到什么、优先怎么安排、建设成什么样、靠什么制度支撑和首先抓什么。分层后才能把农业农村现代化与粮食供给安全放入同一结构，又不把各层表述互换。',
  },
  'DIALECTICS-01': {
    title: '联系与发展怎样保留具体条件',
    question: '联系、整体和发展分别要保留什么判断条件？',
    objectives: ['用具体条件理解联系、整体与发展的判断'],
    scopeLimit: '本节建立联系、整体与发展的三个基本判断；矛盾分析留到下一节。',
    reflectionPrompt: '联系、整体和发展分别要防止什么误读？',
    reflectionAnswer: directAnswers['DIALECTICS-01'],
  },
  'DIALECTICS-06': {
    title: '扬弃怎样连接克服保留与曲折前进',
    question: '辩证否定与否定之否定分别说明什么？',
    objectives: ['区分辩证否定与否定之否定的职责'],
    scopeLimit: '本节区分辩证否定的克服与保留和否定之否定揭示的发展道路；不把两者压成机械次数。',
    reflectionPrompt: '辩证否定与否定之否定分别说明什么，为什么不能用“两次否定”机械理解？',
    reflectionAnswer: directAnswers['DIALECTICS-06'],
  },
};

const scopeBoundaries = {
  leadership: '制度细目保留查阅。',
  livelihood: '具体措施保留查阅。',
  support: '具体政策细目保留查阅。',
  democracy: '制度细目保留查阅。',
  reformlaw: '历史材料与实施细目保留查阅。',
  cultureeco: '不把文化与生态文明伪造成直接因果关系。',
  party: '九项实践要求的细目保留查阅。',
  security: '按现有来源认识目标安排。',
  unityforeign: '不补写时事进展。',
  basics: '科学社会主义不作独立详细课程。',
  dialectics: '主题内其他问题留到后续小节。',
  cognition: '不替代完整认识论课程。',
  history: '详细学派分类保留查阅。',
  money: '主题内其他职能留到相应小节。',
  capital: '劳动力价值前置不足，完整产生机制待补源。',
};

const scopeOverrides = {
  'VALUE-01': '本节只解释商品及其使用价值、价值两个因素；劳动怎样与二因素相连留到下一节。',
  'DEV-01': '本节只解释新发展阶段与高质量发展的关系；发展理念留到下一节。',
  'DEV-04': '本节只解释基本经济制度与所有制、分配制度的核心内容；政府和市场关系留到下一节。',
};

const groupScopeOverrides = {
  development: '新发展阶段、新发展理念、新发展格局、基本经济制度、政府与市场、乡村振兴、区域与城镇化；具体措施与历史材料保留查阅。',
  dialectics: '联系与发展、矛盾分析、内外因、量变质变和辩证否定；每节只解决一个核心问题。',
};

const groupConnections = {
  foundation: '先明确贯穿主题、时代条件和理论怎样扎根，才能进入这一思想的主体内容“十个明确”。',
  ten: '十条主体内容形成轮廓后，再用十四个坚持、十三个方面成就和六个必须坚持分清方略、成果与方法。',
  framework: '主体内容、基本方略和方法论的职责分清后，转入中国式现代化，观察理论怎样解释总任务与实践道路。',
  modernization: '中国式现代化的目标、特色和原则明确后，先回到贯穿各领域的领导力量与人民立场。',
  leadership: '领导力量和人民立场说明发展为了谁、依靠谁，下一主题继续看高质量发展怎样形成现实条件。',
  development: '发展阶段、理念、格局和制度安排搭好后，下一主题转向就业、分配、保障与健康等民生结果。',
  livelihood: '民生目标需要教育、科技和人才提供长期支撑，下一主题继续理解这三者怎样形成基础能力。',
  support: '教育、科技和人才说明发展支撑，下一主题转向人民当家作主的制度和参与过程。',
  democracy: '民主制度和参与过程说明人民怎样成为治理主体，下一主题继续理解改革动力与法治保障。',
  reformlaw: '改革与法治说明制度怎样完善和运行，下一主题转向文化建设与生态文明两个现代化领域。',
  cultureeco: '文化与生态文明补充现代化的精神和自然维度，下一主题回到党的建设与自我革命这一政治保证。',
  party: '党的建设与自我革命说明长期执政能力怎样保持，下一主题进入总体国家安全和国防保障。',
  security: '安全与国防说明发展所需的底线和保障，下一主题延伸到国家统一与对外关系。',
  unityforeign: '统一与对外关系补齐国家发展面对的内外关系，到这里可以把新时代思想篇的十四个主题合起来回看。',
  basics: '物质与意识的基本立场明确后，下一主题用联系、发展和矛盾解释事物怎样变化。',
  dialectics: '辩证法提供理解变化的结构，下一主题继续回答认识怎样从实践产生、发展并接受检验。',
  cognition: '认识论说明实践与真理的关系，下一主题把这些观点放进社会结构、历史动力和历史主体中。',
  history: '社会历史结构明确后，下一主题进入政治经济学，从商品、劳动和价值量开始。',
  value: '商品、劳动与价值量的关系建立后，下一主题继续理解货币为什么产生以及怎样发挥职能。',
  money: '货币本质与职能明确后，下一主题进入资本和剩余价值的有边界基础认识。',
  capital: '剩余价值方法与资本分类读完后，可以把基本立场、辩证法、认识论、历史观和政治经济学基础放回同一篇回看。',
};

const routeConclusions = {
  thought: {
    title: '把十四个主题放回新时代思想篇',
    summary: '你已经从核心主题和科学体系出发，依次理解中国式现代化以及领导、发展、民生、民主、法治、文化生态、党的建设、安全、统一与外交等主题的基本职责和联系。',
    boundary: '这表示当前48节已读完，不表示已经掌握全部原文、十三个方面成就细目或完整考试范围。',
  },
  principles: {
    title: '把七个主题放回基本原理篇',
    summary: '你已经从理论组成和物质意识出发，依次理解辩证法、认识论、历史观以及商品、货币和剩余价值的有边界基础关系。',
    boundary: '科学社会主义没有展开为独立详细课程；剩余价值完整机制仍受来源缺口限制，读完不表示覆盖完整基本原理或考试范围。',
  },
};

function normalizeReaderTerminology(text) {
  return text.replaceAll('单元', '小节').replaceAll('本组', '本主题');
}

function refineLessonLanguage(lesson) {
  lesson.title = normalizeReaderTerminology(lesson.title);
  lesson.question = normalizeReaderTerminology(lesson.question);
  lesson.objectives = lesson.objectives.map(normalizeReaderTerminology);
  lesson.scopeLimit = normalizeReaderTerminology(lesson.scopeLimit);
  for (const part of [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap]) {
    part.label = normalizeReaderTerminology(part.label);
    part.text = normalizeReaderTerminology(part.text);
  }
  lesson.reflection.prompt = normalizeReaderTerminology(lesson.reflection.prompt);
  lesson.reflection.answer = normalizeReaderTerminology(lesson.reflection.answer);
}

function renderReading(samples) {
  const groups = new Map(samples.groups.map(group => [group.id, group]));
  const lessons = new Map(samples.lessons.map(lesson => [lesson.id, lesson]));
  const lines = [
    '# 系统学习小节候选阅读稿', '',
    '日期：2026-10-21。两条有边界路线，21个主题72节；B4逐节内容终审已完成，仍为候选教学稿，用户理解验收尚未完成。覆盖的是当前37篇登记的核心目标，不表示每个来源细节或完整考试范围都已讲授。', '',
    '默认解释含关键联系和必要边界，完整原文与参考表达可选。三个已知补源缺口继续保留。', '',
  ];
  const sources = ids => ids.join('、');
  for (const route of samples.routes) {
    lines.push('', `## ${route.title}`, '', route.summary, '', route.scope, '', '**篇章收束目标**', '', route.conclusion.summary, '', `边界：${route.conclusion.boundary}`, '');
    for (const groupId of route.groupIds) {
      const group = groups.get(groupId);
      lines.push('', `### ${group.title}`, '', group.scope, '', `接续：${group.following}`, '', `衔接理由：${group.connectionToNext}`, '');
      for (const lessonId of group.lessonIds) {
        const lesson = lessons.get(lessonId);
        lines.push('', `#### ${lesson.id} ${lesson.title}`, '', `这次要回答：${lesson.question}`, '', `本次目标：${lesson.objectives.join('；')}`, '', lesson.scopeLimit, '');
        for (const part of [...lesson.sections, ...(lesson.boundary ? [lesson.boundary] : []), lesson.recap]) {
          lines.push(`**${part.label}**`, '', part.text, '', `来源：${sources(part.sourceBlockIds)}`, '');
        }
        lines.push('**可选自我解释**', '', lesson.reflection.prompt, '', lesson.reflection.answer, '', `来源：${sources(lesson.reflection.sourceBlockIds)}`, '', lesson.transition, '');
      }
    }
  }
  return lines.join('\n').replace(/\n{4,}/g, '\n\n\n').trimEnd() + '\n';
}

function refine(samples) {
  const lessons = new Map(samples.lessons.map(lesson => [lesson.id, lesson]));
  const groups = new Map(samples.groups.map(group => [group.id, group]));
  if (Object.keys(directAnswers).length !== 47) throw new Error('Expected 47 direct answers');
  if (Object.keys(recapOverrides).length !== 51) throw new Error('Expected 51 recap overrides');
  for (const [id, answer] of Object.entries(directAnswers)) {
    const lesson = lessons.get(id);
    if (!lesson) throw new Error('Missing lesson ' + id);
    if (lesson.reflection.answer !== lesson.recap.text
      && lesson.reflection.answer !== answer
      && lesson.reflection.answer !== b4PreviousReflectionAnswers[id]) throw new Error('Unexpected answer drift ' + id);
    lesson.reflection.answer = answer;
  }
  for (const [groupId, boundary] of Object.entries(scopeBoundaries)) {
    const group = groups.get(groupId);
    if (!group) throw new Error('Missing group ' + groupId);
    for (const id of group.lessonIds) {
      const lesson = lessons.get(id);
      lesson.scopeLimit = `本节只解释“${lesson.question.replace(/[？?]$/, '')}”；${boundary}`;
    }
  }
  for (const [id, scopeLimit] of Object.entries(scopeOverrides)) lessons.get(id).scopeLimit = scopeLimit;
  for (const [id, override] of Object.entries(b4LessonOverrides)) {
    const lesson = lessons.get(id);
    if (!lesson) throw new Error('Missing B4 lesson ' + id);
    if (override.title) lesson.title = override.title;
    if (override.question) lesson.question = override.question;
    if (override.objectives) lesson.objectives = override.objectives;
    if (override.scopeLimit) lesson.scopeLimit = override.scopeLimit;
    if (override.reflectionPrompt) lesson.reflection.prompt = override.reflectionPrompt;
    if (override.reflectionAnswer) lesson.reflection.answer = override.reflectionAnswer;
  }
  for (const lesson of lessons.values()) refineLessonLanguage(lesson);
  for (const lesson of lessons.values()) {
    lesson.recap.label = '本节结论';
    if (recapOverrides[lesson.id]) lesson.recap.text = recapOverrides[lesson.id];
    if (/(下一(?:节|小节|主题|组|步)|接着|后续可|读完|到这里|自然结束|可以结束|可停下|可收束|本路线已|本路线到)/.test(lesson.recap.text)) {
      throw new Error('Recap still performs navigation ' + lesson.id);
    }
  }
  for (const group of groups.values()) {
    group.title = normalizeReaderTerminology(group.title);
    group.scope = normalizeReaderTerminology(groupScopeOverrides[group.id] || group.scope);
  }
  for (const route of samples.routes) {
    route.conclusion = routeConclusions[route.id];
    if (!route.conclusion) throw new Error('Missing route conclusion ' + route.id);
    route.groupIds.forEach((groupId, groupIndex) => {
      const group = groups.get(groupId);
      const nextGroup = groups.get(route.groupIds[groupIndex + 1]);
      group.connectionToNext = groupConnections[groupId];
      if (!group.connectionToNext) throw new Error('Missing group connection ' + groupId);
      group.following = nextGroup ? `接着理解${nextGroup.title}` : `完成${route.title}篇`;
      group.lessonIds.forEach((lessonId, lessonIndex) => {
        const lesson = lessons.get(lessonId);
        const nextLesson = lessons.get(group.lessonIds[lessonIndex + 1]);
        lesson.transition = nextLesson ? `下一节：${nextLesson.title}` : nextGroup ? `下一主题：${nextGroup.title}` : `本篇收束：${route.conclusion.title}`;
      });
    });
  }
  samples.contentApproval = 'b4-reviewed-candidate';
  samples.progressCompatibleVersions = [...new Set([...(samples.progressCompatibleVersions || []), ...previousCurriculumVersions])];
  return samples;
}

function main() {
  const samples = refine(JSON.parse(fs.readFileSync(sourceFile, 'utf8')));
  fs.writeFileSync(sourceFile, JSON.stringify(samples, null, 2) + '\n');
  fs.writeFileSync(readingFile, renderReading(samples));
  console.log(JSON.stringify({ status: 'refined', lessons: samples.lessons.length, groups: samples.groups.length, directAnswers: Object.keys(directAnswers).length }));
}

if (require.main === module) main();
module.exports = { directAnswers, recapOverrides, b4LessonOverrides, scopeBoundaries, scopeOverrides, groupScopeOverrides, groupConnections, routeConclusions, normalizeReaderTerminology, refine, renderReading };
