const moduleInfo = { id: "common-sense", title: "常识判断", keywords: "文史、科技、经济、法律", description: "按篇、章、节组织背诵材料，逐层进入对应知识卡。", status: "ready", statusText: "可学习" };
const directory = [
  {
    id: "humanities-history",
    order: "第一篇",
    title: "文史常识",
    subtitle: "历史、文学与科技文化",
    chapters: [
      { order: "第一章", title: "历史常识", subtitle: "中国古代史、近代史与现代史", categoryId: "history", status: "ready", sections: [
        { order: "一", title: "中国古代史", categoryId: "ancient-history", status: "ready" },
        { order: "二", title: "中国近代史", categoryId: "modern-history", status: "ready" },
        { order: "三", title: "中国现代史", categoryId: "contemporary-history", status: "ready" },
      ] },
      { order: "第二章", title: "文学常识", subtitle: "古代文学、小说与现当代文学", categoryId: "literature", status: "ready", sections: [
        { order: "一", title: "中国古代文学", categoryId: "ancient-literature-section", status: "ready" },
        { order: "二", title: "中国现当代文学", pointId: "modern-literature", status: "ready" },
      ] },
      { order: "第三章", title: "科技文化常识", subtitle: "制度礼仪、传统科技艺术与生活体育", categoryId: "humanities-culture", status: "ready", sections: [
        { order: "一", title: "选官制度", pointId: "selection-thought-ritual", status: "ready" },
        { order: "二", title: "中国古代思想", pointId: "traditional-thought-ritual", status: "ready" },
        { order: "三", title: "礼仪制度", pointId: "ritual-system", status: "ready" },
        { order: "四", title: "中国古代科技", pointId: "ancient-science-medicine", status: "ready" },
        { order: "五", title: "中国传统艺术", pointId: "traditional-arts", status: "ready" },
        { order: "六", title: "中国古代生活", pointId: "daily-life-language", status: "ready" },
        { order: "七", title: "中国古代用语", pointId: "classical-language-allusions", status: "ready" },
        { order: "八", title: "体育常识", pointId: "sports", status: "ready" },
      ] },
    ],
  },
  {
    id: "science-technology",
    order: "第二篇",
    title: "科技常识",
    subtitle: "科技史、基础科学与高新技术",
    chapters: [
      { order: "第一章", title: "科技史", subtitle: "世界科技、中国现代科技与奖项", categoryId: "world-science", status: "ready", sections: [
        { order: "第一节", title: "世界科技史", categoryId: "world-science-history", status: "ready" },
        { order: "第二节", title: "中国现代科技史", pointId: "china-modern-science-awards", status: "ready" },
        { order: "第三节", title: "科技奖项", pointId: "science-awards", status: "ready" },
      ] },
      { order: "第二章", title: "基础科学", subtitle: "物理、化学、生物与生活常识", categoryId: "basic-science", status: "ready", sections: [
        { order: "第一节", title: "物理知识", categoryId: "physics-knowledge", status: "ready" },
        { order: "第二节", title: "化学知识", categoryId: "chemistry-knowledge", status: "ready" },
        { order: "第三节", title: "生物知识", categoryId: "biology-knowledge", status: "ready" },
        { order: "第四节", title: "生活常识", categoryId: "life-knowledge", status: "ready" },
      ] },
      { order: "第三章", title: "高新技术", subtitle: "生物、新能源、空间与信息技术", categoryId: "high-tech", status: "ready", sections: [
        { order: "第一节", title: "生物技术", categoryId: "biotechnology", status: "ready" },
        { order: "第二节", title: "新能源技术", categoryId: "new-energy-technology", status: "ready" },
        { order: "第三节", title: "空间技术", categoryId: "space-technology", status: "ready" },
        { order: "第四节", title: "信息技术", categoryId: "information-technology", status: "ready" },
      ] },
    ],
  },
  {
    id: "economics",
    order: "第三篇",
    title: "经济常识",
    subtitle: "市场、微观、宏观与国际经济",
    chapters: [
      { order: "第一章", title: "市场经济理论", categoryId: "market-economy-theory", status: "ready", sections: [
        { order: "一", title: "资源配置的方式", categoryId: "resource-allocation", status: "ready" },
        { order: "二", title: "市场和市场体系", categoryId: "market-and-market-system", status: "ready" },
        { order: "三", title: "市场经济", categoryId: "market-economy-principles", status: "ready" },
      ] },
      { order: "第二章", title: "微观经济学", categoryId: "microeconomics-chapter", status: "ready", sections: [
        { order: "一", title: "需求和供给理论", categoryId: "demand-supply-theory", status: "ready" },
        { order: "二", title: "市场结构理论", categoryId: "market-structure-theory", status: "ready" },
        { order: "三", title: "市场失灵", categoryId: "market-failure", status: "ready" },
      ] },
      { order: "第三章", title: "宏观经济学", categoryId: "macroeconomics-chapter", status: "ready", sections: [
        { order: "一", title: "宏观调控的目标", categoryId: "macro-control-goals", status: "ready" },
        { order: "二", title: "宏观经济政策", categoryId: "macro-economic-policies", status: "ready" },
      ] },
      { order: "第四章", title: "国际经济", categoryId: "international-economics-chapter", status: "ready", sections: [
        { order: "一", title: "国际贸易", pointId: "international-trade", status: "ready" },
        { order: "二", title: "对外贸易中的汇率问题", categoryId: "exchange-rate-issues", status: "ready" },
        { order: "三", title: "重要经济组织", categoryId: "important-economic-organizations", status: "ready" },
        { order: "附录", title: "经济效应与名词", categoryId: "economic-appendix", status: "ready" },
      ] },
    ],
  },
  {
    id: "law",
    order: "第四篇",
    title: "法律常识",
    subtitle: "宪法、民法典总则与刑法",
    chapters: [
      { order: "第一章", title: "宪法", subtitle: "宪法原理、基本制度、权利与国家机构", sections: [
        { order: "第一节", title: "概述", categoryId: "constitution-overview", status: "ready" },
        { order: "第二节", title: "国家基本制度", categoryId: "constitutional-basic-systems", status: "ready" },
        { order: "第三节", title: "公民的基本权利", pointId: "citizen-constitutional-rights", status: "ready" },
        { order: "第四节", title: "国家机构", categoryId: "constitution-organs", status: "ready" },
      ] },
      { order: "第二章", title: "民法典总则", subtitle: "民法概述、主体、行为、权利、代理与时效", sections: [
        { order: "第一节", title: "民法概述", categoryId: "civil-law-overview", status: "ready" },
        { order: "第二节", title: "民事主体", categoryId: "civil-subjects-section", status: "ready" },
        { order: "第三节", title: "民事法律行为", categoryId: "civil-legal-acts-section", status: "ready" },
        { order: "第四节", title: "民事权利", categoryId: "civil-rights-section", status: "ready" },
        { order: "第五节", title: "代理", categoryId: "civil-agency-section", status: "ready" },
        { order: "第六节", title: "诉讼时效", categoryId: "civil-limitation-section", status: "ready" },
      ] },
      { order: "第三章", title: "民法典分编", subtitle: "物权、合同、人格权、婚姻家庭、继承与侵权责任", sections: [
        { order: "第一节", title: "物权编", categoryId: "property-rights-part", status: "ready" },
        { order: "第二节", title: "合同编", categoryId: "contract-part", status: "ready" },
        { order: "第三节", title: "人格权编", pointId: "personality-rights-part", status: "ready" },
        { order: "第四节", title: "婚姻家庭编", categoryId: "marriage-family-part", status: "ready" },
        { order: "第五节", title: "继承编", categoryId: "inheritance-part", status: "ready" },
        { order: "第六节", title: "侵权责任编", categoryId: "tort-liability-part", status: "ready" },
      ] },
      { order: "第四章", title: "刑法", subtitle: "刑法概述与总则", sections: [
        { order: "第一节", title: "刑法概述", categoryId: "criminal-law-overview-section", status: "ready" },
        { order: "第二节", title: "刑法总则", categoryId: "criminal-general", status: "ready" },
      ] },
    ],
  },
];
const categories = [
  { id: "history", title: "历史常识", subtitle: "中国古代史、近代史与现代史", status: "ready", pointIds: ["prehistoric-civilization", "legendary-xia-shang", "qin-han", "three-kingdoms-sui-tang", "sui-tang", "five-dynasties-yuan", "ming-qing", "late-qing-invasions", "taiping-heavenly-kingdom", "second-opium-war", "self-strengthening-movement", "first-sino-japanese-war", "hundred-days-reform", "boxer-rebellion-eight-nation-alliance", "revolution-and-may-fourth", "new-culture-may-fourth", "communist-revolution", "national-revolution", "land-revolution", "anti-japanese-liberation", "liberation-war", "new-china-reform", "reform-opening-period"] },
  { id: "ancient-history", title: "中国古代史", subtitle: "史前至明清：朝代、制度、经济与外交", status: "ready", pointIds: ["prehistoric-civilization", "legendary-xia-shang", "qin-han", "three-kingdoms-sui-tang", "sui-tang", "five-dynasties-yuan", "ming-qing"] },
  { id: "modern-history", title: "中国近代史", subtitle: "鸦片战争至解放战争", status: "ready", pointIds: ["late-qing-invasions", "taiping-heavenly-kingdom", "second-opium-war", "self-strengthening-movement", "first-sino-japanese-war", "hundred-days-reform", "boxer-rebellion-eight-nation-alliance", "revolution-and-may-fourth", "new-culture-may-fourth", "communist-revolution", "national-revolution", "land-revolution", "anti-japanese-liberation", "liberation-war"] },
  { id: "contemporary-history", title: "中国现代史", subtitle: "新中国成立与改革开放", status: "ready", pointIds: ["new-china-reform", "reform-opening-period"] },
  { id: "literature", title: "文学常识", subtitle: "古代散文、诗词曲、小说、史学与现当代文学", status: "ready", pointIds: ["ancient-prose", "pre-qin-poetry", "poetry-ci-qu", "classical-novels", "fiction-history-modern-literature", "book-records", "modern-literature"] },
  { id: "ancient-literature-section", title: "中国古代文学", subtitle: "散文、诗赋、词曲、小说、史学与书籍", status: "ready", pointIds: ["ancient-prose", "pre-qin-poetry", "poetry-ci-qu", "classical-novels", "fiction-history-modern-literature", "book-records"] },
  { id: "humanities-culture", title: "科技文化常识", subtitle: "制度思想、传统科技、艺术、生活与体育", status: "ready", pointIds: ["selection-thought-ritual", "traditional-thought-ritual", "ritual-system", "ancient-science-medicine", "traditional-arts", "daily-life-language", "classical-language-allusions", "sports"] },
  { id: "culture-science", title: "科技文化常识", subtitle: "选官、思想、礼仪、科技、中医与传统艺术", status: "ready", pointIds: ["selection-thought-ritual", "traditional-thought-ritual", "ritual-system", "ancient-science-medicine", "traditional-arts"] },
  { id: "life-sports", title: "古代生活与体育", subtitle: "节日、教育、用语、成语与运动规则", status: "ready", pointIds: ["daily-life-language", "classical-language-allusions", "sports"] },
  { id: "world-science", title: "科技史", subtitle: "世界科技、中国现代科技与科技奖项", status: "ready", pointIds: ["pre-industrial-world-science", "industrial-revolutions", "china-modern-science-awards", "science-awards"] },
  { id: "world-science-history", title: "世界科技史", subtitle: "古代科学、近代科学革命与三次工业革命", status: "ready", pointIds: ["pre-industrial-world-science", "industrial-revolutions"] },
  { id: "basic-science", title: "基础科学", subtitle: "物理、化学、生物与生活安全", status: "ready", pointIds: ["physics", "chemistry", "biology-health", "life-safety", "safety-common-sense", "other-life-common-sense"] },
  { id: "physics-knowledge", title: "物理知识", subtitle: "经典力学、光学、热力学、声学及其他物理小节", status: "ready", pointIds: ["physics", "optics", "thermodynamics", "acoustics", "physics-other"] },
  { id: "chemistry-knowledge", title: "化学知识", subtitle: "物质分类、元素化合物、酸碱盐及生活化学", status: "ready", pointIds: ["chemistry", "nonmetal-elements", "metal-elements", "acid-base-salt", "organic-compounds", "chemistry-life"] },
  { id: "biology-knowledge", title: "生物知识", subtitle: "生物、人体、仿生技术与急救处理", status: "ready", pointIds: ["biology-health", "human-body", "biomimetics", "emergency-treatment"] },
  { id: "life-knowledge", title: "生活常识", subtitle: "灭火器、安全与日常现象", status: "ready", pointIds: ["life-safety", "safety-common-sense", "other-life-common-sense"] },
  { id: "high-tech", title: "高新技术", subtitle: "生物技术、新能源、空间与信息技术", status: "ready", pointIds: ["biotech-new-energy", "gene-engineering", "cell-engineering", "fermentation-engineering", "enzyme-engineering", "new-energy", "current-main-energy", "space-tech", "shenzhou-spacecraft", "satellite-launch-centers", "change-lunar-probes", "information-tech", "communication-technology", "information-technology-applications"] },
  { id: "biotechnology", title: "生物技术", subtitle: "概述、基因工程、细胞工程、发酵工程与酶工程", status: "ready", pointIds: ["biotech-new-energy", "gene-engineering", "cell-engineering", "fermentation-engineering", "enzyme-engineering"] },
  { id: "new-energy-technology", title: "新能源技术", subtitle: "能源分类与当前主要能源", status: "ready", pointIds: ["new-energy", "current-main-energy"] },
  { id: "space-technology", title: "空间技术", subtitle: "航天器、神舟飞船、发射中心与嫦娥探月", status: "ready", pointIds: ["space-tech", "shenzhou-spacecraft", "satellite-launch-centers", "change-lunar-probes"] },
  { id: "information-technology", title: "信息技术", subtitle: "计算机技术、通信技术与信息技术应用", status: "ready", pointIds: ["information-tech", "communication-technology", "information-technology-applications"] },
  { id: "economics", title: "经济常识", subtitle: "市场经济、微观、宏观与国际经济", status: "ready", pointIds: ["market-economy", "planned-allocation", "market-allocation", "market-definition-elements", "enterprise-organization", "market-system-composition", "market-economy-meaning", "market-economy-laws", "market-economy-features", "socialist-market-economy", "microeconomics", "supply-theory", "supply-demand-equilibrium", "supply-demand-law", "market-structure-overview", "perfect-competition-market", "monopolistic-competition-market", "oligopoly-market", "monopoly-market", "market-failure-meaning", "market-failure-factors", "macro-control-goals-overview", "economic-growth", "full-employment", "stable-prices", "balance-of-payments", "macro-control-measures", "fiscal-policy", "monetary-policy", "industrial-policy", "income-distribution-policy", "international-trade", "exchange-rate-system", "exchange-rate-quotation", "exchange-rate-effects", "imf", "world-bank", "wto", "economic-effects", "economic-terms"] },
  { id: "market-economy-theory", title: "市场经济理论", subtitle: "资源配置、市场体系与市场经济", status: "ready", pointIds: ["market-economy", "planned-allocation", "market-allocation", "market-definition-elements", "enterprise-organization", "market-system-composition", "market-economy-meaning", "market-economy-laws", "market-economy-features", "socialist-market-economy"] },
  { id: "resource-allocation", title: "资源配置的方式", subtitle: "总述、计划配置与市场配置", status: "ready", pointIds: ["market-economy", "planned-allocation", "market-allocation"] },
  { id: "market-and-market-system", title: "市场和市场体系", subtitle: "市场、企业与市场体系", status: "ready", pointIds: ["market-definition-elements", "enterprise-organization", "market-system-composition"] },
  { id: "market-economy-principles", title: "市场经济", subtitle: "含义、基本规律、特征与社会主义市场经济", status: "ready", pointIds: ["market-economy-meaning", "market-economy-laws", "market-economy-features", "socialist-market-economy"] },
  { id: "microeconomics-chapter", title: "微观经济学", subtitle: "需求供给、市场结构与市场失灵", status: "ready", pointIds: ["microeconomics", "supply-theory", "supply-demand-equilibrium", "supply-demand-law", "market-structure-overview", "perfect-competition-market", "monopolistic-competition-market", "oligopoly-market", "monopoly-market", "market-failure-meaning", "market-failure-factors"] },
  { id: "demand-supply-theory", title: "需求和供给理论", subtitle: "需求、供给、均衡与供求法则", status: "ready", pointIds: ["microeconomics", "supply-theory", "supply-demand-equilibrium", "supply-demand-law"] },
  { id: "market-structure-theory", title: "市场结构理论", subtitle: "总述与四种市场结构", status: "ready", pointIds: ["market-structure-overview", "perfect-competition-market", "monopolistic-competition-market", "oligopoly-market", "monopoly-market"] },
  { id: "market-failure", title: "市场失灵", subtitle: "含义与导致市场失灵的因素", status: "ready", pointIds: ["market-failure-meaning", "market-failure-factors"] },
  { id: "macroeconomics-chapter", title: "宏观经济学", subtitle: "宏观调控目标与宏观经济政策", status: "ready", pointIds: ["macro-control-goals-overview", "economic-growth", "full-employment", "stable-prices", "balance-of-payments", "macro-control-measures", "fiscal-policy", "monetary-policy", "industrial-policy", "income-distribution-policy"] },
  { id: "macro-control-goals", title: "宏观调控的目标", subtitle: "目标总览、经济增长、充分就业、稳定物价与国际收支平衡", status: "ready", pointIds: ["macro-control-goals-overview", "economic-growth", "full-employment", "stable-prices", "balance-of-payments"] },
  { id: "macro-economic-policies", title: "宏观经济政策", subtitle: "调控手段、财政政策、货币政策、产业政策与收入分配政策", status: "ready", pointIds: ["macro-control-measures", "fiscal-policy", "monetary-policy", "industrial-policy", "income-distribution-policy"] },
  { id: "international-economics-chapter", title: "国际经济", subtitle: "国际贸易、汇率问题、重要经济组织与经济附录", status: "ready", pointIds: ["international-trade", "exchange-rate-system", "exchange-rate-quotation", "exchange-rate-effects", "imf", "world-bank", "wto", "economic-effects", "economic-terms"] },
  { id: "exchange-rate-issues", title: "对外贸易中的汇率问题", subtitle: "汇率制度、标价方法与变动影响", status: "ready", pointIds: ["exchange-rate-system", "exchange-rate-quotation", "exchange-rate-effects"] },
  { id: "important-economic-organizations", title: "重要经济组织", subtitle: "国际货币基金组织、世界银行与世界贸易组织", status: "ready", pointIds: ["imf", "world-bank", "wto"] },
  { id: "economic-appendix", title: "经济效应与名词", subtitle: "经济效应与常见经济名词", status: "ready", pointIds: ["economic-effects", "economic-terms"] },
{ id: "law", title: "法律常识", subtitle: "宪法、民法典总则、分编与刑法", status: "ready", pointIds: ["constitution-concept-features", "constitution-basic-principles", "constitution-structure", "constitution-history", "political-system", "economic-system", "citizen-constitutional-rights", "state-institutions-overview", "state-organs", "state-council", "state-president-judiciary-supervision", "central-military-commission", "judicial-system", "national-supervisory-commission", "civil-code-general-persons", "civil-basic-principles", "civil-subjects", "legal-person", "civil-acts-agency-limitation", "civil-act-effect", "civil-rights", "civil-property-rights", "civil-agency", "civil-agency-authority", "unauthorized-agency", "civil-limitation", "civil-limitation-types", "property-contract", "ownership-rights", "usufruct-rights", "security-rights", "contract-formation", "contract-code-revisions", "contract-breach-liability", "personality-rights-part", "invalid-marriage", "revocable-marriage", "divorce-rules", "inheritance-concept", "inheritance-methods", "tort-liability", "tort-attribution", "criminal-law-overview", "criminal-law-effect", "criminal-responsibility-capacity", "criminal-law-general"] },
  { id: "constitution-overview", title: "概述", subtitle: "概念特征、基本原则、结构与宪法历史", status: "ready", pointIds: ["constitution-concept-features", "constitution-basic-principles", "constitution-structure", "constitution-history"] },
  { id: "constitutional-basic-systems", title: "国家基本制度", subtitle: "政治制度与经济制度", status: "ready", pointIds: ["political-system", "economic-system"] },
  { id: "constitution-organs", title: "国家机构", subtitle: "人大国务院、国家主席、军委、司法与监察机关", status: "ready", pointIds: ["state-institutions-overview", "state-organs", "state-council", "state-president-judiciary-supervision", "central-military-commission", "judicial-system", "national-supervisory-commission"] },
  { id: "civil-law-overview", title: "民法概述", subtitle: "民法的概念与基本原则", status: "ready", pointIds: ["civil-code-general-persons", "civil-basic-principles"] },
  { id: "civil-subjects-section", title: "民事主体", subtitle: "自然人与法人", status: "ready", pointIds: ["civil-subjects", "legal-person"] },
  { id: "civil-legal-acts-section", title: "民事法律行为", subtitle: "概念与效力", status: "ready", pointIds: ["civil-acts-agency-limitation", "civil-act-effect"] },
  { id: "civil-rights-section", title: "民事权利", subtitle: "人身权与财产权", status: "ready", pointIds: ["civil-rights", "civil-property-rights"] },
  { id: "civil-agency-section", title: "代理", subtitle: "概述、代理权与无权代理", status: "ready", pointIds: ["civil-agency", "civil-agency-authority", "unauthorized-agency"] },
  { id: "civil-limitation-section", title: "诉讼时效", subtitle: "概念与诉讼时效的种类", status: "ready", pointIds: ["civil-limitation", "civil-limitation-types"] },
  { id: "property-rights-part", title: "物权编", subtitle: "概述、所有权、用益物权与担保物权", status: "ready", pointIds: ["property-contract", "ownership-rights", "usufruct-rights", "security-rights"] },
  { id: "contract-part", title: "合同编", subtitle: "订立程序、合同编新修与违约责任", status: "ready", pointIds: ["contract-formation", "contract-code-revisions", "contract-breach-liability"] },
  { id: "marriage-family-part", title: "婚姻家庭编", subtitle: "无效婚姻、可撤销婚姻与离婚", status: "ready", pointIds: ["invalid-marriage", "revocable-marriage", "divorce-rules"] },
  { id: "inheritance-part", title: "继承编", subtitle: "财产继承概念与三类继承安排", status: "ready", pointIds: ["inheritance-concept", "inheritance-methods"] },
  { id: "tort-liability-part", title: "侵权责任编", subtitle: "侵权概念与归责原则", status: "ready", pointIds: ["tort-liability", "tort-attribution"] },
  { id: "criminal-law-overview-section", title: "刑法概述", subtitle: "基本原则与适用范围", status: "ready", pointIds: ["criminal-law-overview", "criminal-law-effect"] },
  { id: "criminal-general", title: "刑法总则", subtitle: "刑法效力、犯罪构成、责任能力、防卫与避险", status: "ready", pointIds: ["criminal-law-general", "criminal-responsibility-capacity"] },
];
const points = [
  { id: "prehistoric-civilization", categoryId: "ancient-history", type: "quick-check", title: "史前文明与文化遗址", summary: "用“时间—地点—代表物/成就”三列记忆史前人类和新石器文化。", preview: "元谋人、北京人、山顶洞人；河姆渡、红山、仰韶、大汶口、龙山", keywords: ["元谋人", "北京人", "河姆渡", "仰韶", "龙山文化"], aliases: ["史前文明", "新石器时代", "文化遗址"], tags: ["常识判断", "历史常识", "中国古代史"], indexText: "史前文明按时间、地点和代表成就速查：元谋人、北京人、山顶洞人及河姆渡、红山、仰韶、大汶口、龙山文化。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "mind-map", label: "记忆框架", title: "史前文明", summary: "先区分旧石器人类，再按新石器文化的地域与代表物记忆。", nodes: [{ title: "旧石器时期", points: ["元谋人：约170万年前，云南元谋县，已知最早人类、会用火", "北京人：约70万至20万年前，北京周口店，会用天然火、保存火种", "山顶洞人：约3万年前，北京周口店，磨光钻孔、骨针、人工取火"] }, { title: "新石器文化", points: ["河姆渡：长江流域，种植水稻、骨耜", "红山：内蒙古至东北西部，彩陶、玉器（玉猪龙）", "仰韶：黄河中游，粟和黍、半坡遗址", "大汶口：山东泰安，黑陶白陶、养蚕织丝", "龙山：山东章丘，黑陶文化"] }] }, { type: "table", label: "三列速查", columns: ["对象", "时间/地点", "高频关键词"], rows: [["元谋人", "约170万年前；云南元谋", "最早人类、会用火"], ["北京人", "约70万—20万年前；北京周口店", "天然火、保存火种"], ["河姆渡", "约7000—5000年前；长江下游", "水稻、骨耜"], ["仰韶", "前5000—前3000年；黄河中游", "粟和黍、半坡、彩陶"]] }, { type: "tip", variant: "warning", title: "易混提醒", content: "河姆渡对应水稻和长江流域；仰韶对应粟、黍和黄河中游。不要把作物和地域对调。" }] }] },
  { id: "legendary-xia-shang", categoryId: "ancient-history", type: "quick-check", title: "炎黄传说、夏与商", summary: "把传说人物、关键战役与夏商建立、迁都、灭亡串成一条时间线。", preview: "炎黄—禅让—大禹治水—夏朝建立—鸣条之战—商朝建立—牧野之战", keywords: ["炎黄", "大禹", "夏朝", "商朝", "牧野之战"], aliases: ["夏商", "炎黄传说", "禅让制"], tags: ["常识判断", "历史常识", "中国古代史"], indexText: "炎黄传说到夏商更替包括阪泉之战、涿鹿之战、禅让制、大禹治水、鸣条之战和牧野之战。", tabs: [{ id: "knowledge", title: "时间线", blocks: [{ type: "mind-map", label: "记忆框架", title: "传说至夏商", summary: "用“人物—事件—结果”连接朝代更替。", nodes: [{ title: "炎黄与禅让", points: ["炎黄二帝：中华文明的人文始祖", "阪泉之战：黄帝打败炎帝，部落融合", "涿鹿之战：炎黄部落联合击败蚩尤", "禅让制：尧舜时期推选部落联盟首领", "大禹治水：疏导洪水，三过家门而不入"] }, { title: "夏朝", points: ["禹的儿子启继承王位，世袭制代替禅让制", "二里头文化：河南偃师二里头村", "少康中兴：夏朝复国", "鸣条之战后，商汤称王，夏朝灭亡"] }, { title: "商朝", points: ["商汤起兵灭夏，定都亳（今商丘）", "盘庚迁殷：商朝都城第五次迁移", "牧野之战：周武王伐纣，商朝灭亡"] }] }, { type: "rule", title: "串联口诀", items: ["炎黄融合看阪泉、涿鹿", "尧舜禹是禅让；启继位是世袭", "鸣条：夏亡商兴；牧野：商亡周兴"] }] }] },
  { id: "western-zhou-spring-autumn", categoryId: "ancient-history", type: "quick-check", title: "西周、春秋与战国", summary: "聚焦西周建亡、春秋五霸、战国七雄、商鞅变法及先秦制度。", preview: "西周镐京；平王东迁；春秋五霸；三家分晋；战国七雄；商鞅变法", keywords: ["西周", "春秋五霸", "战国七雄", "商鞅变法", "分封制"], aliases: ["春秋战国", "先秦制度", "初税亩"], tags: ["常识判断", "历史常识", "中国古代史"], indexText: "西周到战国包括镐京、平王东迁、春秋五霸、三家分晋、战国七雄、商鞅变法和西周四大制度。", tabs: [{ id: "knowledge", title: "速记", blocks: [{ type: "mind-map", label: "记忆框架", title: "西周至战国", summary: "先定朝代节点，再背霸主、诸侯和变法。", nodes: [{ title: "西周", points: ["周武王建周，定都镐京", "周幽王废太子、犬戎攻镐京，西周灭亡", "四大制度：分封制、宗法制、井田制、礼乐制"] }, { title: "春秋", points: ["平王东迁洛邑，东周开始", "春秋五霸：齐桓、宋襄、晋文、秦穆、楚庄", "吴越之争：越王勾践灭吴", "初税亩：鲁国承认土地私有"] }, { title: "战国", points: ["三家分晋：韩赵魏", "战国七雄：齐楚燕韩赵魏秦", "商鞅变法：废井田、开阡陌、承认土地私有、奖励军功、按功授爵、建立县制", "代表战役：围魏救赵、增兵减灶、纸上谈兵"] }] }, { type: "tip", variant: "success", title: "快速排除", content: "五霸有宋襄公，七雄有韩赵魏；“三家分晋”只对应韩、赵、魏。" }] }] },
  { id: "qin-unification", categoryId: "ancient-history", type: "quick-check", title: "秦朝统一与制度", summary: "理解秦统一、中央集权和陈胜吴广起义的主线。", preview: "灭六国、咸阳、皇帝制、三公九卿、郡县制、统一度量衡货币文字", keywords: ["秦朝", "秦始皇", "三公九卿", "郡县制", "陈胜吴广"], aliases: ["秦统一", "中央集权", "大泽乡起义"], tags: ["常识判断", "历史常识", "中国古代史"], indexText: "秦朝建立于公元前230年至前221年灭六国，定都咸阳，实行皇帝制、三公九卿制、郡县制并统一度量衡货币和文字。", tabs: [{ id: "knowledge", title: "要点", blocks: [{ type: "mind-map", label: "记忆框架", title: "秦的统一", summary: "按建立、制度、统一措施、灭亡顺序记忆。", nodes: [{ title: "建立", points: ["公元前230—前221年先后灭韩赵魏楚燕齐", "建立首个统一的中央集权封建国家，定都咸阳"] }, { title: "制度与统一", points: ["皇帝制、三公九卿制、郡县制", "统一度量衡、货币（圆形方孔钱）、文字（小篆），统一车轨、修建驰道"] }, { title: "反抗与灭亡", points: ["陈胜吴广大泽乡起义：中国历史上第一次大规模农民战争", "巨鹿之战：项羽破釜沉舟、以少胜多", "楚汉之争后，刘邦称帝建立汉朝"] }] }, { type: "list", label: "三公九卿", items: ["丞相：主管行政", "太尉：主管军事", "御史大夫：主管监察"] }] }] },
  { id: "qin-han", categoryId: "ancient-history", type: "quick-check", title: "秦汉更替与汉代发展", summary: "串联西汉、东汉建立及制度、民族交往和生产技术。", preview: "文景之治、汉武盛世、光武中兴、黄巾起义", keywords: ["西汉", "汉武帝", "东汉", "丝绸之路", "黄巾起义"], aliases: ["秦汉", "文景之治", "光武中兴"], tags: ["常识判断", "历史常识", "中国古代史"], indexText: "秦汉历史包括西汉建立、文景之治、汉武帝措施、东汉光武中兴及农业手工业水利发展。", tabs: [{ id: "knowledge", title: "时间线", blocks: [{ type: "list", label: "秦汉全章速查", items: ["前202年刘邦称帝、定都长安；文景之治；七国之乱由周亚夫平定", "汉武帝：罢黜百家独尊儒术、卫青霍去病击匈奴、张骞凿空、推恩令；河西四郡为酒泉武威张掖敦煌", "汉宣帝设西域都护；8年王莽建新，23年新朝覆灭", "25年刘秀建东汉、定都洛阳；昆阳之战、光武中兴、黄巾起义", "赵过推广耦犁与代田法；杜诗水排；西汉麻纸、东汉蔡伦改进造纸术；史禄开凿灵渠"] }] }] },
  { id: "three-kingdoms-sui-tang", categoryId: "ancient-history", type: "quick-check", title: "三国两晋南北朝与隋唐", summary: "掌握分裂统一、关键战役、改革、隋唐制度和对外交流。", preview: "官渡赤壁；孝文帝改革；开皇贞观开元；科举三省六部", keywords: ["三国", "北魏孝文帝", "隋唐", "科举", "三省六部"], aliases: ["魏晋南北朝", "贞观之治", "安史之乱"], tags: ["常识判断", "历史常识", "中国古代史"], indexText: "三国两晋南北朝至隋唐包括官渡赤壁、孝文帝改革、隋统一、唐朝治世、科举与三省六部。", tabs: [{ id: "knowledge", title: "速记", blocks: [{ type: "list", label: "三国至隋唐全章速查", items: ["官渡之战为曹操统一北方奠基；赤壁之战奠定三国鼎立；曹魏220洛阳、蜀汉221成都、东吴229建业", "西晋265建立、316灭亡；东晋317建康重建；淝水之战东晋胜前秦；北魏孝文帝均田、迁洛阳、汉化", "581杨坚建隋，589统一；618李渊建唐；贞观之治、贞观遗风、开元盛世；755安史之乱为由盛转衰转折，907唐亡", "科举：隋炀帝设进士科；唐太宗扩科；武则天创武举、殿试；宋糊名誊录；明清八股", "三省：中书草拟、门下审核、尚书执行；六部为吏户礼兵刑工；唐税制为租庸调与两税法", "大运河四段永济渠、通济渠、邗沟、江南河；赵州桥、曲辕犁、筒车；文成公主、玄奘、鉴真是外交高频"] }] }] },
  { id: "five-dynasties-yuan", categoryId: "ancient-history", type: "quick-check", title: "五代辽宋夏金元", summary: "梳理并立政权、宋代中央集权、元朝制度与经济文化。", preview: "五代十国、北宋、辽夏金、南宋、元朝行省", keywords: ["北宋", "王安石", "南宋", "元朝", "行省制"], aliases: ["宋辽夏金元", "澶渊之盟", "靖康之耻"], tags: ["常识判断", "历史常识", "中国古代史"], indexText: "五代辽宋夏金元包括北宋建立、澶渊之盟、王安石变法、靖康之耻、南宋、元朝行省与澎湖巡检司。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "五代辽宋夏金元全章速查", items: ["907—960五代为后梁后唐后晋后汉后周；916契丹建国、947改辽；1038元昊建西夏；1115完颜阿骨打建金", "960赵匡胤陈桥兵变建北宋；澶渊之盟、庆历新政、王安石变法；1127靖康之耻，北宋亡", "北宋强化中央：杯酒释兵权、枢密院、更戍法、分相权、转运使、通判", "1127赵构建南宋；绍兴和议；1279崖山后南宋亡", "1206铁木真统一蒙古；1271忽必烈建元；行省制度为省级行政区之始；澎湖巡检司管澎湖台湾，宣政院管西藏", "宋经济：占城稻、苏湖熟、交子、坊市界限打破、汝官哥钧定；元有黄道婆棉纺织、泉州外贸港"] }] }] },
  { id: "ming-qing", categoryId: "ancient-history", type: "quick-check", title: "明清政治、边疆与经济", summary: "聚焦明清建立、中央集权、边疆治理和社会经济变化。", preview: "洪武永乐、废丞相、内阁、军机处、摊丁入亩", keywords: ["明朝", "郑和", "清朝", "军机处", "摊丁入亩"], aliases: ["明清", "永乐盛世", "康乾盛世"], tags: ["常识判断", "历史常识", "中国古代史"], indexText: "明清包括朱元璋建明、郑和下西洋、废丞相内阁、清朝建立、台湾治理、军机处与摊丁入亩。", tabs: [{ id: "knowledge", title: "要点", blocks: [{ type: "list", label: "明清全章速查", items: ["1368朱元璋建明；靖难之役后朱棣迁北京、永乐盛世；郑和1405—1433七下西洋；土木之变为由盛转衰转折；1644李自成入北京，明亡", "明制度：废丞相、设内阁、三司、锦衣卫东厂西厂；一条鞭法；八股取士", "1616努尔哈赤建后金，1636皇太极改清，1644入关；康熙平三藩；郑成功收复台湾、1684设台湾府；《尼布楚条约》", "清制度：八旗、军机处（君主专制顶峰）、理藩院、驻藏大臣、摊丁入亩、闭关锁国", "明中后期引进玉米甘薯等美洲作物；景德镇、粉彩珐琅彩；纺织业出现资本主义萌芽"] }] }] },
  { id: "late-qing-invasions", categoryId: "modern-history", type: "quick-check", title: "晚清危机与救亡探索", summary: "从鸦片战争到戊戌变法、义和团，重点记条约、运动和洋务企业。", preview: "虎门销烟、南京条约、洋务运动、甲午战争、戊戌变法、辛丑条约", keywords: ["鸦片战争", "洋务运动", "甲午", "戊戌", "辛丑条约"], aliases: ["晚清", "不平等条约", "自强求富"], tags: ["常识判断", "中国近代史", "晚清"], indexText: "晚清史包括虎门销烟、南京条约、太平天国、第二次鸦片战争、洋务运动、甲午战争、戊戌变法和辛丑条约。", tabs: [{ id: "knowledge", title: "时间线", blocks: [{ type: "list", label: "晚清全章速查", items: ["1839虎门销烟；1842《南京条约》：割香港岛、赔2100万、五口通商、协定关税；林则徐开眼看世界、魏源《海国图志》", "太平天国：1851金田起义、1853天京、1856天京事变、1864失败；《天朝田亩制度》《资政新篇》", "第二次鸦片战争：天津条约、北京条约；1860火烧圆明园；1858《瑷珲条约》", "洋务运动：自强求富、中体西用；军工有曾国藩安庆内军械所、李鸿章江南制造总局和金陵机器局、左宗棠福州船政局、崇厚天津机器制造总局", "洋务民企有李鸿章轮船招商局、开平矿务局、天津电报局，张之洞汉阳铁厂、湖北织布局；另有北洋南洋福建三支海军与京师同文馆", "1895《马关条约》；公车上书与1898百日维新、京师大学堂、戊戌六君子", "义和团扶清灭洋，八国联军侵华；1901《辛丑条约》使中国完全陷入半殖民地半封建社会"] }] }] },
  { id: "revolution-and-may-fourth", categoryId: "modern-history", type: "quick-check", title: "辛亥革命、新文化与五四", summary: "掌握革命组织、辛亥成果局限和新文化五四意义。", preview: "兴中会、同盟会、武昌起义、临时约法、新文化、五四", keywords: ["辛亥革命", "孙中山", "新文化运动", "五四运动"], aliases: ["三民主义", "武昌起义", "新青年"], tags: ["常识判断", "中国近代史", "民主革命"], indexText: "辛亥革命包括兴中会、同盟会、三民主义、武昌起义、中华民国临时约法，新文化与五四运动。", tabs: [{ id: "knowledge", title: "速记", blocks: [{ type: "list", label: "辛亥至五四全章速查", items: ["1894兴中会为首个资产阶级革命团体；1905同盟会为首个资产阶级革命政党；纲领驱除鞑虏、恢复中华、创立民国、平均地权", "三民主义为民族、民权、民生，民权为核心；1911武昌起义；1912中华民国成立与《临时约法》，清帝退位", "辛亥意义是结束君主专制、民主共和深入人心；局限是未改变半殖民地半封建性质", "1915《青年杂志》（后《新青年》）开启新文化，主张科学民主、新道德、新文学；陈独秀、蔡元培、胡适、李大钊、鲁迅", "1919巴黎和会失败引发五四；学生先锋、工人后期主力；五四是新民主主义革命开端"] }] }] },
  { id: "communist-revolution", categoryId: "modern-history", type: "quick-check", title: "中国共产党诞生与土地革命", summary: "覆盖建党、国民大革命、武装斗争、长征和遵义会议。", preview: "一大立党、二大立纲、南昌、八七、井冈山、长征、遵义", keywords: ["中共一大", "南昌起义", "井冈山", "长征", "遵义会议"], aliases: ["土地革命", "红军长征", "古田会议"], tags: ["常识判断", "中国近代史", "党史"], indexText: "中国共产党诞生到土地革命包括一大二大、国共合作、南昌八七秋收、井冈山、古田、长征和遵义会议。", tabs: [{ id: "knowledge", title: "时间线", blocks: [{ type: "list", label: "建党与土地革命全章速查", items: ["1921中共一大在上海、嘉兴召开，标志建党；1922二大提出反帝反封建民主革命纲领", "1923三大决定国共合作；1924国民党一大标志首次合作形成；1926北伐；四一二、七一五后合作破裂", "1927南昌起义打响第一枪；八七会议提出枪杆子；秋收起义打出工农革命军旗号；三湾改编支部建在连上", "井冈山为首个农村革命根据地；古田会议确立人民军队建设原则；1931瑞金成立临时中央政府", "1934—1936红军长征；遵义会议是生死攸关转折、标志党走向成熟"] }] }] },
  { id: "anti-japanese-liberation", categoryId: "modern-history", type: "quick-check", title: "抗日战争与解放战争", summary: "以抗战爆发、统一战线、会战、胜利和三大战役为主线。", preview: "九一八、七七、统一战线、百团大战、七大、三大战役、渡江", keywords: ["抗日战争", "西安事变", "百团大战", "三大战役", "渡江战役"], aliases: ["第二次国共合作", "解放战争", "重庆谈判"], tags: ["常识判断", "中国近代史", "党史"], indexText: "抗日战争和解放战争包括九一八、七七、西安事变、会战、百团大战、七大、重庆谈判、三大战役和渡江战役。", tabs: [{ id: "knowledge", title: "时间线", blocks: [{ type: "list", label: "抗战与解放全章速查", items: ["1931九一八为抗战起点；1937七七为全面抗战开始；南京大屠杀国家公祭日12月13日", "瓦窑堡确定统一战线方针；1936西安事变和平解决促初步形成；1937年9月统一战线正式形成", "淞沪粉碎三月亡华计划；平型关首次大捷；台儿庄最大胜利；武汉后进入相持；百团大战为共产党独立发动最大最久战役", "1945日本投降，9月3日为抗战胜利纪念日；中共七大确立毛泽东思想", "重庆谈判签双十协定；1947刘邓跃进大别山；辽沈淮海平津三大战役；1949西柏坡七届二中全会、渡江占南京"] }] }] },
  { id: "new-china-reform", categoryId: "contemporary-history", type: "quick-check", title: "新中国成立与改革开放", summary: "串联成立、建设、外交突破、改革开放和港澳回归。", preview: "1949成立、土地改革、抗美援朝、一五、三大改造、1978改革开放", keywords: ["新中国", "一五计划", "三大改造", "改革开放", "港澳回归"], aliases: ["十一届三中全会", "和平共处五项原则"], tags: ["常识判断", "中国现代史", "时政历史"], indexText: "中国现代史包括1949新中国成立、土地改革、抗美援朝、和平共处五项原则、一五计划、三大改造、联合国席位和改革开放。", tabs: [{ id: "knowledge", title: "时间线", blocks: [{ type: "list", label: "现代史全章速查", items: ["1949年10月1日新中国成立；1950—1952土地改革；1950—1953抗美援朝", "1953周恩来首次提出和平共处五项原则；1953—1957第一个五年计划；1954第一部社会主义宪法", "1956年底三大改造完成，社会主义制度基本建立", "1971恢复联合国合法席位；1972尼克松访华，1979中美正式建交", "1978十一届三中全会：转经济建设、实行改革开放；1997香港回归、1999澳门回归"] }] }] },
  { id: "ancient-prose", categoryId: "literature", type: "quick-check", title: "上古神话、诸子与唐宋散文", summary: "掌握经典、作者、文学史地位与唐宋八大家。", preview: "山海经、四书五经、淮南子、唐宋八大家", keywords: ["山海经", "四书五经", "唐宋八大家", "韩愈", "柳宗元"], aliases: ["诸子散文", "古文运动"], tags: ["常识判断", "文学常识", "古代文学"], indexText: "古代散文包括山海经、四书五经、淮南子和唐宋八大家及韩愈柳宗元欧阳修。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "古代散文全章速查", items: ["《山海经》是先秦保存神话最多古籍，含夸父逐日、精卫填海、大禹治水", "四书为《论语》《中庸》《大学》《孟子》；五经为《诗》《书》《礼》《易》《春秋》；《淮南子》有完整二十四节气记载", "唐宋八大家：韩愈、柳宗元、苏轼、苏洵、苏辙、欧阳修、曾巩、王安石", "韩愈字退之、韩昌黎，代表《师说》《祭十二郎文》《马说》；柳宗元字子厚、柳河东，代表《永州八记》《捕蛇者说》", "欧阳修字永叔、号醉翁、谥文忠，代表《醉翁亭记》，号六一居士"] }] }] },
  { id: "pre-qin-poetry", categoryId: "literature", type: "quick-check", title: "先秦诗歌：诗经与楚辞", summary: "区分现实主义《诗经》、浪漫主义《楚辞》及诗经六义。", preview: "诗经305篇、风雅颂、赋比兴、楚辞、离骚、风骚", keywords: ["诗经", "楚辞", "离骚", "风雅颂", "赋比兴"], aliases: ["诗经六义", "风骚"], tags: ["常识判断", "文学常识", "古代文学"], indexText: "先秦诗歌包括诗经的风雅颂和赋比兴、楚辞与离骚，以及风骚并称。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "先秦诗歌全章速查", items: ["《诗经》又称《诗》《诗三百》，收305篇，是第一部诗歌总集、现实主义源头", "诗经六义：风雅颂为内容分类；赋比兴为写作手法。风为民间歌谣，雅为宫廷乐曲，颂为宗庙祭祀乐歌", "《楚辞》由屈原创立诗体、刘向辑录，是第一部浪漫主义诗歌总集", "《离骚》是屈原最著名作品，也是第一首长篇政治抒情诗；《诗经·国风》与《楚辞·离骚》并称风骚"] }] }] },
  { id: "han-wei-jin-literature", categoryId: "literature", type: "quick-check", title: "两汉魏晋辞赋、乐府与诗人", summary: "掌握汉赋四大家、乐府双璧、建安风骨及陶谢。", preview: "汉赋四大家、乐府双璧、三曹七子、陶渊明、谢灵运", keywords: ["汉赋", "乐府双璧", "建安七子", "陶渊明", "谢灵运"], aliases: ["建安风骨", "三曹"], tags: ["常识判断", "文学常识", "古代文学"], indexText: "两汉魏晋文学包括司马相如、扬雄、班固、张衡，孔雀东南飞、木兰诗，三曹建安七子及陶渊明谢灵运。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "两汉魏晋全章速查", items: ["汉赋四大家：司马相如、扬雄、班固、张衡；班固《两都赋》《汉书》，张衡《二京赋》、地动仪", "乐府双璧：《孔雀东南飞》《木兰诗》；《孔雀东南飞》为古代最长叙事诗", "建安风骨代表三曹（曹操、曹丕、曹植）、建安七子及蔡琰；曹丕《燕歌行》，曹植《七步诗》《洛神赋》，曹操《短歌行》《蒿里行》《龟虽寿》", "陶渊明号五柳先生、谥靖节，田园诗人；《饮酒》《归园田居》《桃花源记》《归去来兮辞》", "谢灵运是第一个自觉以山水入诗者；才高八斗典故与谢灵运评价曹植相关"] }] }] },
  { id: "tang-song-poetry", categoryId: "literature", type: "quick-check", title: "唐诗高峰", summary: "按诗派、诗人称号、代表作和风格记忆唐诗。", preview: "初唐四杰、山水田园、边塞、李杜、白居易、小李杜、陆游", keywords: ["唐诗", "李白", "杜甫", "白居易", "初唐四杰"], aliases: ["诗仙", "诗圣", "小李杜"], tags: ["常识判断", "文学常识", "唐诗"], indexText: "唐诗包括初唐四杰、王孟山水田园、高岑王昌龄边塞、李白杜甫白居易、小李杜与陆游。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "唐诗全章速查", items: ["初唐四杰：王勃、杨炯、卢照邻、骆宾王；张若虚《春江花月夜》被誉孤篇盖全唐", "山水田园：王维（诗佛、王右丞）、孟浩然；边塞：高适、岑参、王昌龄（七绝圣手）", "李白：字太白、青莲居士，诗仙，浪漫主义高峰；杜甫：字子美、少陵野老，诗圣，诗史，沉郁顿挫，三吏三别", "白居易：乐天、香山居士，诗魔诗王，新乐府“文章合为时而著，歌诗合为事而作”", "刘禹锡：诗豪；小李杜为杜牧、李商隐；陆游字务观、号放翁，南宋爱国诗人、小李白"] }] }] },
  { id: "poetry-ci-qu", categoryId: "literature", type: "quick-check", title: "词曲、戏曲与古代小说", summary: "覆盖词派、元曲四大家、传奇名剧和古典小说。", preview: "李煜、苏辛、李清照、元曲四大家、四大名著", keywords: ["词", "元曲", "四大名著", "李清照", "关汉卿"], aliases: ["豪放派", "婉约派", "元曲四大家"], tags: ["常识判断", "文学常识", "词曲小说"], indexText: "词曲小说包括李煜、苏轼辛弃疾、李清照柳永、元曲四大家、临川四梦、四大名著。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "词曲小说全章速查", items: ["李煜为南唐后主、千古词帝；豪放派苏轼辛弃疾陈亮陆游，婉约派柳永李清照秦观；苏轼号东坡，辛弃疾号稼轩，李清照号易安", "元曲四大家：关汉卿、白朴、马致远、郑光祖；关汉卿曲圣、《窦娥冤》，马致远曲状元、《天净沙·秋思》", "汤显祖临川四梦：《牡丹亭》《紫钗记》《南柯记》《邯郸记》；《长生殿》《桃花扇》为清戏曲双璧", "四大名剧：西厢记、牡丹亭、长生殿、桃花扇；元杂剧四悲剧和四喜剧均见原文条目", "小说：干宝《搜神记》、刘义庆《世说新语》；四大名著为水浒、三国、西游、红楼；四大奇书另含《金瓶梅》", "《聊斋志异》蒲松龄、《儒林外史》吴敬梓；《史记》《资治通鉴》为史学双璧，前四史为史汉后汉三国"] }] }] },
  { id: "fiction-history-modern-literature", categoryId: "literature", type: "quick-check", title: "书籍之最与现当代文学", summary: "记住重要典籍及鲁迅、茅盾、老舍、巴金、莫言。", preview: "说文解字、文心雕龙、永乐大典、四库全书、鲁迅、莫言", keywords: ["鲁迅", "莫言", "四库全书", "说文解字"], aliases: ["现当代文学", "书籍之最"], tags: ["常识判断", "文学常识", "现代文学"], indexText: "书籍之最与现当代文学包括说文解字、文心雕龙、永乐大典、四库全书及鲁迅茅盾老舍巴金莫言。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "典籍与作家", items: ["《说文解字》许慎：首部系统分析字形、考究字源且按部首编排的字书；《文心雕龙》刘勰：体系严密的文学理论专著", "《永乐大典》为最大类书；《四库全书》为最大丛书，经史子集四部；《尔雅》为第一部词典", "鲁迅原名周树人，《狂人日记》为首篇白话小说；《呐喊》《彷徨》《朝花夕拾》《野草》", "茅盾《子夜》、蚀三部曲和农村三部曲；老舍《骆驼祥子》《四世同堂》《茶馆》；巴金爱情三部曲、激流三部曲", "莫言原名管谟业，2012年诺贝尔文学奖，代表《红高粱家族》《丰乳肥臀》《蛙》"] }] }] },
  { id: "selection-thought-ritual", categoryId: "culture-science", type: "quick-check", title: "选官制度、思想与礼仪", summary: "从世卿世禄到科举，覆盖诸子、理学和礼制。", preview: "世卿世禄、察举、九品、科举；儒道法墨兵名纵横", keywords: ["科举", "儒家", "百家争鸣", "礼仪"], aliases: ["九品中正", "宋明理学", "五礼"], tags: ["常识判断", "科技文化", "古代制度"], indexText: "选官制度思想礼仪包括世卿世禄、察举征辟、九品中正、科举，诸子百家、理学和五礼婚礼。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "制度与思想全章速查", items: ["选官：世卿世禄—军功爵—察举征辟—九品中正（曹丕，后上品无寒门）—科举（607至1905）", "科举：院试秀才、乡试举人、会试贡士、殿试进士；一甲状元榜眼探花", "儒家：孔子仁、德治、克己复礼、有教无类；孟子仁政民贵君轻性善；荀子性恶礼法并用；董仲舒独尊儒术、三纲五常", "道家老子无为而治、庄子；法家商鞅韩非李斯；墨子兼爱非攻；孙子兵法；名家公孙龙白马非马；纵横苏秦张仪", "二程、朱熹、王守仁知行合一；明清王夫之黄宗羲顾炎武；五礼吉嘉宾军凶、婚礼六礼、太牢少牢与丧礼称谓"] }] }] },
  { id: "ancient-science-medicine", categoryId: "culture-science", type: "quick-check", title: "古代科技、地理与中医", summary: "集中四大发明、数学天文、地理农书和医学家。", preview: "四大发明、祖冲之、张衡、郭守敬、农书、中医", keywords: ["四大发明", "祖冲之", "张衡", "中医", "农书"], aliases: ["天干地支", "四大医书"], tags: ["常识判断", "科技文化", "古代科技"], indexText: "古代科技包括四大发明、数学天文历法、地理农书及扁鹊华佗张仲景李时珍等中医。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "科技与医学全章速查", items: ["四大发明：造纸、活字印刷、指南针、火药；蔡伦105改纸，毕昇活字，司南与罗盘，唐末火药军用", "数学天文：商高勾三股四弦五；祖冲之圆周率第七位；《甘石星经》、太初历、张衡地动仪、大衍历、郭守敬授时历", "天干十、地支十二，60年一轮；子时23—1点；山南水北为阳", "地理：郦道元《水经注》、玄奘述辩机撰《大唐西域记》、徐霞客游记；农书《氾胜之书》《齐民要术》《农政全书》《天工开物》", "医学：扁鹊四诊、华佗麻沸散五禽戏、张仲景《伤寒杂病论》、孙思邈药王、宋慈《洗冤集录》、李时珍《本草纲目》；四大医书见原文"] }] }] },
  { id: "traditional-arts", categoryId: "culture-science", type: "quick-check", title: "传统艺术：书法、国画与戏曲", summary: "识别书体书家、名画、戏曲剧种和脸谱。", preview: "楷书四家、书圣、十大名画、京昆越豫评黄梅", keywords: ["书法", "国画", "京剧", "昆曲", "脸谱"], aliases: ["文房四宝", "四大名旦"], tags: ["常识判断", "科技文化", "传统艺术"], indexText: "传统艺术包括汉字书法、国画名作、昆曲京剧等戏曲与脸谱颜色。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "传统艺术全章速查", items: ["书法：七体甲骨金小篆隶楷草行；六书象形指事会意形声转注假借；楷书四家欧颜柳赵；王羲之书圣、《兰亭序》天下第一行书", "草书颠张醉素为张旭怀素；宋四家苏黄米蔡；文房四宝湖笔徽墨宣纸端砚", "名画：顾恺之《女史箴图》《洛神赋图》、展子虔《游春图》、阎立本《步辇图》、张择端《清明上河图》、王希孟《千里江山图》、黄公望《富春山居图》", "昆曲百戏之祖；京剧生旦净丑、四大名旦梅尚程荀；戏曲三鼎甲京豫越；越剧、豫剧、评剧、黄梅戏起源与剧目见原文", "脸谱：红忠勇关羽、黑正直包拯、白阴险曹操、黄凶猛典韦、绿暴躁程咬金、蓝刚强窦尔敦、金银神妖"] }] }] },
  { id: "daily-life-language", categoryId: "life-sports", type: "quick-check", title: "古代生活、称谓与成语", summary: "将节日、教育、饮食、年龄称谓、交游和成语系统归类。", preview: "节日、庠序、名锦名绣、年龄、谦敬辞、成语", keywords: ["节日", "年龄称谓", "成语", "谦辞", "敬辞"], aliases: ["庠序", "八拜之交", "古代生活"], tags: ["常识判断", "古代生活", "语言文化"], indexText: "古代生活包括节日教育织锦饮食、年龄称谓、谦敬辞、成语典故和词语含义。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "生活与用语全章速查", items: ["节日：春节正月初一、元宵正月十五、清明4月5日前后、端午五月初五、重阳九月九日；四大节日春节清明端午中秋", "教育：夏校殷序周庠；稷下学宫最早官办高等学府；文翁石室首所地方官办学校；六艺礼乐射御书数；宋四大书院", "四大名锦云蜀宋壮，四大名绣粤湘蜀苏；四大菜系鲁川粤淮扬；陆羽茶圣《茶经》，杜康酒圣", "年龄：襁褓、垂髫、总角、束发、弱冠、而立、不惑、知天命、花甲、古稀、耄耋、期颐；伯仲叔季与年号庙号谥号", "交游八拜之交、常用代称和谦敬辞；典故与古籍成语、词语含义均按原文收录：如洛阳纸贵、成也萧何败也萧何、乱七八糟、一问三不知"] }] }] },
  { id: "sports", categoryId: "life-sports", type: "quick-check", title: "体育常识", summary: "覆盖奥林匹克、体操、马拉松及常见球类和斯诺克规则。", preview: "五环、格言、体操、马拉松、足篮排乒羽、斯诺克", keywords: ["奥运", "足球", "篮球", "排球", "斯诺克"], aliases: ["五环", "马拉松", "球类规则"], tags: ["常识判断", "体育常识", "奥运"], indexText: "体育常识包括奥林匹克五环格言、体操马拉松、足球篮球排球乒乓羽毛球和斯诺克规则。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "体育全章速查", items: ["五环：蓝欧黑非红美黄亚绿大洋；格言“更快、更高、更强、更团结”", "巴黎为第33届夏奥，中国40金27银24铜；洛杉矶为第34届夏奥、第三次主办", "竞技体操男六项鞍吊跳双单自，女四项跳高低平自；马拉松42.195公里；铁人三项游泳自行车长跑", "足球11人、少于7人不能开始、上下半场各45分；篮球四节各10分、个人5犯离场；排球五局三胜；乒乓常规五局三胜11分；羽毛球三局两胜21分", "斯诺克15红6彩1白，红1分彩2—7分，单杆最高147"] }] }] },
  { id: "pre-industrial-world-science", categoryId: "world-science", type: "quick-check", title: "前工业革命世界科技史", summary: "从古希腊到牛顿，记科学家、学说与近代科学形成。", preview: "泰勒斯、阿基米德、日心说、伽利略、开普勒、牛顿", keywords: ["世界科技史", "阿基米德", "哥白尼", "伽利略", "牛顿"], aliases: ["日心说", "经典力学"], tags: ["常识判断", "世界科技", "科学史"], indexText: "前工业革命世界科技史包括泰勒斯阿基米德阿利斯塔克哥白尼伽利略笛卡尔开普勒牛顿。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "科学史全章速查", items: ["泰勒斯：希腊七贤，测太阳直径、将一年定365日；阿基米德：杠杆原理、浮力定律，物理学之父", "阿利斯塔克提出古代朴素日心说；托勒密为地心说集大成者", "哥白尼1543《天体运行论》提出日心说，标志近代自然科学诞生", "伽利略开创近代实验科学、自由落体、望远镜及木星卫星太阳黑子；笛卡尔解析几何、动量守恒", "开普勒三大行星定律；1687牛顿《自然哲学的数学原理》提出运动定律和万有引力，建立经典力学"] }] }] },
  { id: "industrial-revolutions", categoryId: "world-science", type: "quick-check", title: "三次工业革命", summary: "按时间、动力、标志及关键科学家串联工业革命。", preview: "蒸汽—电气—信息；瓦特、法拉第、爱因斯坦", keywords: ["工业革命", "蒸汽机", "电气", "第三次工业革命"], aliases: ["三次革命", "科技史"], tags: ["常识判断", "世界科技", "工业革命"], indexText: "三次工业革命涵盖蒸汽机、电力内燃机、原子能计算机空间技术及关键科学家。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "三次工业革命", items: ["第一次：18世纪60年代至19世纪40年代，英国，蒸汽机广泛应用；哈格里弗斯珍妮机、瓦特改良蒸汽机、史蒂芬孙蒸汽机车、富尔顿汽船", "第一次理论：拉瓦锡质量守恒与氧化说、法拉第电磁感应、奥斯特电生磁、焦耳热功当量、孟德尔遗传定律、达尔文《物种起源》", "第二次：19世纪70年代至20世纪初，美德，电力广泛应用，动力为电动机内燃机；莱特飞机、贝尔电话、爱迪生白炽灯留声机、马可尼无线电、诺贝尔炸药", "第二次理论：麦克斯韦电磁波、赫兹证实、普朗克量子、爱因斯坦相对论、伦琴X射线、门捷列夫周期律、巴甫洛夫条件反射、魏格纳大陆漂移、巴斯德免疫", "第三次：20世纪四五十年代起，原子能、电子计算机、空间技术、生物工程；1942首座反应堆、1945首颗原子弹、1957斯普特尼克一号、1961加加林、1969阿姆斯特朗登月"] }] }] },
  { id: "china-modern-science-awards", categoryId: "world-science", type: "quick-check", title: "中国现代科技与科技奖项", summary: "覆盖两弹一星、载人航天、深潜量子及重要科技奖。", preview: "两弹一星、神舟、天问、嫦娥、C919、诺奖", keywords: ["两弹一星", "神舟", "嫦娥", "科技奖", "诺贝尔奖"], aliases: ["中国航天", "国家最高科学技术奖"], tags: ["常识判断", "中国科技", "科技奖项"], indexText: "中国现代科技包括两弹一星、神舟、天问嫦娥、福建舰、C919、量子计算机和科技奖项。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "中国科技与奖项", items: ["两弹一星：1964原子弹、1967氢弹、1970东方红一号；1965人工合成结晶牛胰岛素", "2003神舟五号杨利伟首次载人；2011天宫一号；2012蛟龙号7062米与辽宁舰；2016墨子号量子卫星；2019山东舰", "2020天问一号与嫦娥五号；2024嫦娥六号首次月背采样返回、神舟十八十九、秦岭站；福建舰舷号18，C919完成商业首飞", "国家最高科学技术奖2000首次颁发；诺贝尔奖1901首次颁发，奖项含物理化学生医文学和平与经济学；杨振宁物理、莫言文学、屠呦呦生理或医学", "拉斯克医学奖、菲尔兹奖、图灵奖、普利策奖分别常被称为医学、数学、计算机、新闻领域的诺奖"] }] }] },
  { id: "physics", categoryId: "basic-science", type: "quick-check", title: "基础物理：力、光、热、声与电", summary: "覆盖力学、光学、热力学、声学、电路和国际单位。", preview: "牛顿定律、杠杆浮力、光学、物态、声波、欧姆定律", keywords: ["牛顿定律", "光学", "热力学", "声学", "欧姆定律"], aliases: ["物理", "国际单位"], tags: ["常识判断", "基础科学", "物理"], indexText: "物理包含牛顿运动定律、摩擦杠杆浮力、光传播、物态变化、声学、欧姆定律与国际单位。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "物理全章速查", items: ["牛顿第一定律即惯性定律；第二定律F=ma；第三定律作用力反作用力等大反向、同时产生消失", "摩擦方向与相对运动趋势相反；杠杆动力乘动力臂等于阻力乘阻力臂；向上加速超重、向下加速失重；浮力F=ρ液V排g", "光是电磁波，光年为长度单位；可见光波长由长到短红橙黄绿青蓝紫；红外用于遥控热成像，紫外消毒验钞合成维D", "直线传播、小孔成像；反射、折射、全反射光纤、散射；凸透镜会聚远视、凹透镜发散近视；光三原色红绿蓝、颜料红黄蓝", "物态变化：凝华、升华、液化、汽化；热传导对流辐射；声音需介质、真空不能传声，超声大于20kHz，次声小于20Hz", "欧姆定律I=U/R，功率P=UI；基本单位米千克秒安培开尔文摩尔坎德拉"] }] }] },
  { id: "chemistry", categoryId: "basic-science", type: "quick-check", title: "基础化学", summary: "梳理物质分类、常见元素、酸碱盐、有机物和生活化学。", preview: "纯净物、元素、酸碱盐、天然气、甲醛、塑料", keywords: ["化学", "酸碱盐", "有机物", "金属", "生活化学"], aliases: ["干冰", "王水"], tags: ["常识判断", "基础科学", "化学"], indexText: "化学涵盖物质分类、非金属金属、酸碱盐、有机化合物和生活应用。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "化学全章速查", items: ["物质：纯净物由一种物质组成；单质由同种元素组成；化合物由多种元素组成；有机物以碳氢为主但有例外", "CO易与血红蛋白结合致中毒；CO2固体为干冰，升华可保鲜、烟雾、人工降雨；硅为半导体；氮气作防腐和安全气囊；臭氧强氧化", "钛被誉太空金属；钢是含碳铁合金；汞常温液态；金展性最佳、铂延性最佳、钨熔点最高、锇密度最大", "酸碱盐：盐酸为胃酸主要成分；王水为浓盐酸与浓硝酸3:1；NaOH烧碱火碱苛性钠；Ca(OH)2熟石灰；Na2CO3纯碱；NaHCO3小苏打", "甲烷为天然气沼气主要成分；可燃冰主要成分甲烷；甲醛水溶液为福尔马林；医用酒精约75%", "明矾净水、醋助骨钙磷溶出、PE不耐热、PP可微波、PS高温有害"] }] }] },
  { id: "biology-health", categoryId: "basic-science", type: "quick-check", title: "生物、营养与仿生", summary: "涵盖动植物、人体营养、无机盐、仿生技术和急救。", preview: "植物演化、营养素、维生素、无机盐、仿生、急救", keywords: ["生物", "维生素", "无机盐", "仿生", "急救"], aliases: ["营养", "海姆里克"], tags: ["常识判断", "基础科学", "生物"], indexText: "生物知识包括植物动物、营养素维生素无机盐、仿生技术和常用急救。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "生物与健康全章速查", items: ["植物演化：藻类—苔藓—蕨类—裸子—被子；营养器官根茎叶，生殖器官花果实种子", "六大营养物质：糖类、脂肪、蛋白质、维生素、无机盐、水；叶酸缺乏贫血和胎儿畸形，维K影响凝血", "微量元素：碘、铁、锌、硒、氟；常量元素钙磷钾钠；钙缺乏佝偻骨松，钠过量高血压", "仿生：蝇眼透镜、萤火虫人工冷光、电鱼伏特电池、鱼潜水艇、鸟飞机、蛙眼电子蛙眼", "急救：烫伤冷水冲洗不挑水泡；扭伤48小时内冰敷；骨折先固定；溺水清口鼻人工呼吸胸外按压；狗咬伤冲洗并按0/3/7/14/28接种", "触电先断电；异物堵塞用海姆里克；心肺复苏包括人工呼吸和胸外按压"] }] }] },
  { id: "life-safety", categoryId: "basic-science", type: "quick-check", title: "生活安全常识", summary: "集中灭火、灾害避险与生活现象。", preview: "灭火器、火灾雷雨地震洪水、衣物饮食日常", keywords: ["安全", "灭火器", "火灾", "地震", "洪水"], aliases: ["生活常识", "灾害避险"], tags: ["常识判断", "基础科学", "安全"], indexText: "生活安全包括灭火器、火灾地震洪水泥石流台风避险和常见生活现象。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "安全全章速查", items: ["CO2灭火器适用档案精密仪器电器油类初火；泡沫适用木材和油类，不适水溶性可燃液体及带电；干粉适用固液气及带电", "油锅起火用锅盖抹布隔绝空气，不用水；保险丝用低熔点合金；煤气中毒先通风转移，禁止火花", "火灾不乘电梯不跳楼，湿巾捂鼻沿墙；雷雨避开空旷金属和电话；地震按所处楼层采取室外开阔或坚固小空间避险", "洪水往高处，泥石流向与其运动方向垂直的高地逃生，不上树不躲洞；台风加固与转移", "口香糖冷冻去除；树干石灰保温灭菌；飞机嚼口香糖减压差；菠菜焯水去草酸；狗主要靠舌头散热；蜻蜓点水是产卵"] }] }] },
  { id: "safety-common-sense", categoryId: "life-knowledge", type: "quick-check", title: "安全常识", summary: "按家居、事故与自然灾害分类掌握安全处置。", preview: "家居安全；煤气中毒；火灾；雷雨；地震；洪水泥石流；台风", keywords: ["家居安全", "煤气中毒", "火灾", "雷雨", "地震", "洪水", "泥石流", "台风"], aliases: ["灾害避险"], tags: ["常识判断", "基础科学", "生活常识"], indexText: "安全常识涵盖家居用火用电、煤气中毒、火灾疏散、雷雨地震洪水泥石流与台风避险。", tabs: [] },
  { id: "other-life-common-sense", categoryId: "life-knowledge", type: "quick-check", title: "其他常识", summary: "解释衣食出行与动植物中的9种常见生活现象。", preview: "口香糖；树干刷白；飞机咀嚼；冻肉解冻；菠菜焯水；红酒摇杯；狗散热；眨眼；蜻蜓点水", keywords: ["口香糖", "石灰", "气压差", "冻肉", "草酸", "红酒", "狗散热", "眨眼", "蜻蜓点水"], aliases: ["生活现象"], tags: ["常识判断", "基础科学", "生活常识"], indexText: "其他生活常识包括口香糖冷冻去除、树干刷白、飞机咀嚼、冻肉冷水解冻、菠菜焯水、红酒摇杯、狗伸舌散热、眨眼护眼和蜻蜓点水产卵。", tabs: [] },
  { id: "biotech-new-energy", categoryId: "high-tech", type: "quick-check", title: "生物技术与新能源", summary: "掌握四大生物工程、能源分类与核能太阳能。", preview: "基因细胞发酵酶工程；核裂变聚变；太阳能", keywords: ["生物技术", "基因工程", "新能源", "核能", "太阳能"], aliases: ["发酵工程", "细胞工程"], tags: ["常识判断", "高新技术", "新能源"], indexText: "生物技术和新能源包括基因细胞发酵酶工程、能源分类、核裂变聚变与太阳能利用。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "生物技术与能源", items: ["生物技术四大工程：基因、细胞、发酵、酶；基因工程又称DNA重组，是现代生物技术核心", "细胞工程用于植物体细胞杂交、动物细胞核移植克隆、干细胞再生医疗；发酵产酱油醋味精酒酸奶泡菜腐乳；酶工程有加酶洗衣粉", "能源可按技术成熟、产生方式、再生能力分类；化石与核能不可再生，太阳水风生物地热可再生", "核电利用核裂变，燃料铀235；氢弹是不可控核聚变，聚变原料氘氚；太阳能直接利用有光热、光电、光化学转换"] }] }] },
  { id: "gene-engineering", categoryId: "biotechnology", type: "quick-check", title: "基因工程", summary: "基因工程定义、应用与蛋白质工程知识链接。", preview: "DNA重组；转基因；基因治疗；第二代基因工程", keywords: ["基因工程", "DNA重组", "蛋白质工程"], aliases: [], tags: ["常识判断", "高新技术", "生物技术"], indexText: "基因工程又称DNA重组技术，是生物工程核心；应用包括转基因和基因治疗，蛋白质工程称第二代基因工程。", tabs: [] },
  { id: "cell-engineering", categoryId: "biotechnology", type: "quick-check", title: "细胞工程", summary: "细胞工程定义与体细胞杂交、核移植、干细胞应用。", preview: "番茄—马铃薯；克隆；再生医疗", keywords: ["细胞工程"], aliases: ["细胞生物工程"], tags: ["常识判断", "高新技术", "生物技术"], indexText: "细胞工程包括体细胞杂交、核移植克隆和干细胞再生医疗。", tabs: [] },
  { id: "fermentation-engineering", categoryId: "biotechnology", type: "quick-check", title: "发酵工程", summary: "发酵工程定义、食品与抗生素应用。", preview: "微生物工程；酵母菌；乳酸菌；霉菌", keywords: ["发酵工程"], aliases: ["微生物工程"], tags: ["常识判断", "高新技术", "生物技术"], indexText: "发酵工程又称微生物工程，应用于食品和抗生素生产。", tabs: [] },
  { id: "enzyme-engineering", categoryId: "biotechnology", type: "quick-check", title: "酶工程", summary: "酶的分离提纯固化改造及工业医药应用。", preview: "蛋白酶；固定化酶；加酶洗衣粉", keywords: ["酶工程"], aliases: ["酶技术"], tags: ["常识判断", "高新技术", "生物技术"], indexText: "酶工程通过分离提纯固化和改造酶，应用于食品、轻工和医药。", tabs: [] },
  { id: "current-main-energy", categoryId: "new-energy-technology", type: "quick-check", title: "当前主要能源", summary: "核能与太阳能的原理和利用方式。", preview: "裂变聚变；核电站；氘氚；太阳能间接与直接利用", keywords: ["核能", "太阳能"], aliases: ["主要能源"], tags: ["常识判断", "高新技术", "新能源"], indexText: "当前主要能源包括核能和太阳能。", tabs: [] },
  { id: "shenzhou-spacecraft", categoryId: "space-technology", type: "quick-check", title: "神舟飞船总结", summary: "神舟五号至二十号的时间、航天员与意义。", preview: "首次载人；首次出舱；空间站；飞行纪录", keywords: ["神舟飞船"], aliases: ["神舟系列"], tags: ["常识判断", "高新技术", "空间技术"], indexText: "神舟飞船总结覆盖五号至二十号。", tabs: [] },
  { id: "satellite-launch-centers", categoryId: "space-technology", type: "quick-check", title: "五大卫星发射中心", summary: "酒泉、太原、西昌、文昌和东方航天港。", preview: "时间与任务特点", keywords: ["卫星发射中心"], aliases: ["航天发射基地"], tags: ["常识判断", "高新技术", "空间技术"], indexText: "五大卫星发射中心的建设时间和任务特点。", tabs: [] },
  { id: "change-lunar-probes", categoryId: "space-technology", type: "quick-check", title: "嫦娥系列探月卫星", summary: "嫦娥一号至八号及载人登月计划。", preview: "全月影像；软着陆；采样返回；科研站", keywords: ["嫦娥", "探月"], aliases: ["嫦娥工程"], tags: ["常识判断", "高新技术", "空间技术"], indexText: "嫦娥系列探月任务及载人登月计划。", tabs: [] },
  { id: "communication-technology", categoryId: "information-technology", type: "quick-check", title: "通信技术", summary: "5G与光纤通信。", preview: "5G商用元年；高速率低时延大连接；全反射", keywords: ["5G", "光纤通信"], aliases: ["移动通信"], tags: ["常识判断", "高新技术", "信息技术"], indexText: "通信技术包括5G和光纤通信。", tabs: [] },
  { id: "information-technology-applications", categoryId: "information-technology", type: "quick-check", title: "信息技术应用", summary: "大数据、云计算、物联网与人工智能。", preview: "数据资产；资源池；物物相联；模拟智能", keywords: ["大数据", "云计算", "物联网", "人工智能"], aliases: ["新一代信息技术"], tags: ["常识判断", "高新技术", "信息技术"], indexText: "信息技术应用包括大数据、云计算、物联网和人工智能。", tabs: [] },
  { id: "space-tech", categoryId: "high-tech", type: "quick-check", title: "空间技术与中国航天", summary: "覆盖航天器命名、神舟、发射中心和嫦娥探月。", preview: "神舟天宫天问北斗；五大中心；嫦娥系列", keywords: ["航天", "神舟", "北斗", "嫦娥", "发射中心"], aliases: ["空间技术", "探月工程"], tags: ["常识判断", "高新技术", "航天"], indexText: "空间技术包括神舟天宫天问北斗命名、神舟飞船、五大卫星发射中心与嫦娥系列。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "空间技术全章速查", items: ["神舟载人飞船、天宫空间站、天舟货运、长征火箭；嫦娥月球卫星、玉兔月球车、鹊桥中继、天问行星、祝融火星车、北斗导航、羲和夸父太阳探测", "四大导航GPS、格洛纳斯、北斗、伽利略；成熟三大为GPS、格洛纳斯、北斗", "神舟五号杨利伟首载人，七号首次出舱，九号刘洋首位女航天员，十号首次太空授课，十二号首次进入自有空间站，十六号进入应用发展阶段", "五大中心：酒泉唯一载人，太原多类型中低轨，西昌同步轨道，文昌滨海低纬，东方航天港海上发射", "嫦娥一号全月影像、三号首次地外软着陆与玉兔、四号首次月背软着陆和中继通信、五号月面采样返回、六号首次月背采样返回；2030年前载人登月"] }] }] },
  { id: "information-tech", categoryId: "high-tech", type: "quick-check", title: "信息技术", summary: "掌握计算机组成、通信技术和新一代信息技术概念。", preview: "硬件软件、存储单位、5G、光纤、大数据、云、物联网、AI", keywords: ["计算机", "5G", "云计算", "物联网", "人工智能"], aliases: ["信息技术", "大数据"], tags: ["常识判断", "高新技术", "信息技术"], indexText: "信息技术包括计算机硬件软件、字节位、5G光纤和大数据云计算物联网人工智能。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "信息技术全章速查", items: ["硬件：运算器、控制器合称CPU；存储器分内外存；键鼠摄像头扫描仪为输入，显示器打印机为输出", "软件：系统软件控制协调并支持应用，应用软件解决实际问题；1B=8bit，1KB=1024B，1MB=1024KB，1GB=1024MB", "计算机病毒是可依附程序自我繁殖并破坏功能的程序", "5G商用元年2019，特点高速率低时延大连接；光纤通信利用全反射，容量大损耗低抗干扰", "大数据特征容量大、类型多、速度快、精度准、价值高；云计算为按需动态虚拟资源池；物联网为物物相联；AI模拟人类智能"] }] }] },
  { id: "market-economy", categoryId: "economics", type: "quick-check", title: "市场经济理论", summary: "理解资源配置、市场机制、企业与社会主义市场经济。", preview: "计划与市场、价格供求竞争风险、企业、价值规律", keywords: ["市场经济", "资源配置", "市场机制", "企业", "价值规律"], aliases: ["看得见的手", "看不见的手"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "市场经济理论包括计划市场配置、市场机制、市场主体企业制度、价值规律和社会主义市场经济。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "市场经济全章速查", items: ["资源配置有计划调节（事前、凯恩斯看得见的手）和市场调节（事后、斯密看不见的手）", "市场机制含价格、供求、竞争、风险；价格是核心机制；市场调节有自发性、盲目性、滞后性", "市场构成主体、客体、行为、秩序；企业最重要主体；规则有准入、竞争、交易规则", "企业组织：个人业主与合伙非法人；公司法人。有限责任公司不等额股份、不公开发行；股份公司等额股份、公开发行", "现代企业制度：产权清晰、权责明确、政企分开、管理科学；产权制度最根本", "价值规律以社会必要劳动时间决定价值、等价交换；社会主义市场经济中市场起决定性作用、宏观调控有效"] }] }] },
  { id: "planned-allocation", categoryId: "resource-allocation", type: "quick-check", title: "计划配置", summary: "计划配置定义、计划机制、事前调节与看得见的手。", preview: "计划指标；经济杠杆；经济政策；凯恩斯", keywords: ["计划配置"], aliases: ["计划调节"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "计划配置依靠政府计划部门和计划机制，是事前调节。", tabs: [] },
  { id: "market-allocation", categoryId: "resource-allocation", type: "quick-check", title: "市场配置", summary: "市场配置含义、市场机制及其缺点。", preview: "价格供求竞争风险；自发盲目滞后", keywords: ["市场配置"], aliases: ["市场调节"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "市场配置依靠市场机制，是事后调节。", tabs: [] },
  { id: "market-definition-elements", categoryId: "market-and-market-system", type: "quick-check", title: "市场", summary: "市场含义与构成要素。", preview: "交换关系；主体客体行为秩序", keywords: ["市场"], aliases: ["市场构成"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "市场小节包括市场含义和四个构成要素。", tabs: [] },
  { id: "enterprise-organization", categoryId: "market-and-market-system", type: "quick-check", title: "企业", summary: "企业含义、组织形式与现代企业制度。", preview: "个人业主合伙公司；有限与股份；现代企业制度", keywords: ["企业"], aliases: ["企业制度"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "企业小节涵盖组织形式和现代企业制度。", tabs: [] },
  { id: "market-system-composition", categoryId: "market-and-market-system", type: "quick-check", title: "市场体系", summary: "商品市场、生产要素市场及统一市场体系。", preview: "三大支柱；统一开放竞争有序", keywords: ["市场体系"], aliases: ["市场体系构成"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "市场体系包括商品和生产要素市场。", tabs: [] },
  { id: "market-economy-meaning", categoryId: "market-economy-principles", type: "quick-check", title: "市场经济的含义", summary: "市场进行资源调配的经济运行形式。", preview: "市场取向；资源调配", keywords: ["市场经济"], aliases: ["市场取向的经济"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "市场经济是由市场进行资源调配的经济运行形式。", tabs: [] },
  { id: "market-economy-laws", categoryId: "market-economy-principles", type: "quick-check", title: "市场经济的基本规律", summary: "价值、竞争与供求规律。", preview: "社会必要劳动时间；经济利益；供求平衡", keywords: ["价值规律", "竞争规律", "供求规律"], aliases: ["市场规律"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "市场经济基本规律含价值、竞争、供求规律。", tabs: [] },
  { id: "market-economy-features", categoryId: "market-economy-principles", type: "quick-check", title: "市场经济的特征", summary: "产权、平等、竞争、法制、开放、有限干预。", preview: "六项特征", keywords: ["市场经济特征"], aliases: ["市场特征"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "市场经济有六项特征。", tabs: [] },
  { id: "socialist-market-economy", categoryId: "market-economy-principles", type: "quick-check", title: "社会主义市场经济", summary: "含义与基本框架。", preview: "决定性作用；宏观调控；五项框架", keywords: ["社会主义市场经济"], aliases: ["社会主义市场经济体制"], tags: ["常识判断", "经济常识", "市场经济"], indexText: "社会主义市场经济含义和基本框架。", tabs: [] },
  { id: "supply-theory", categoryId: "demand-supply-theory", type: "quick-check", title: "供给", summary: "供给含义与影响因素。", preview: "愿意且能够；价格成本相关商品政策预期", keywords: ["供给"], aliases: ["供给理论"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "供给小节含含义与影响因素。", tabs: [] },
  { id: "supply-demand-equilibrium", categoryId: "demand-supply-theory", type: "quick-check", title: "供求均衡", summary: "均衡价格数量与限价应用。", preview: "最高限价；最低限价", keywords: ["供求均衡"], aliases: ["均衡价格"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "供求均衡含均衡价格数量和限价。", tabs: [] },
  { id: "supply-demand-law", categoryId: "demand-supply-theory", type: "quick-check", title: "供求法则", summary: "需求供给变化与均衡价格数量。", preview: "需求变动；供给变动", keywords: ["供求法则"], aliases: ["供求变化"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "供求法则分析需求供给变动。", tabs: [] },
  { id: "market-structure-overview", categoryId: "market-structure-theory", type: "quick-check", title: "市场结构理论", summary: "四类市场结构总述。", preview: "完全竞争；垄断竞争；寡头垄断；完全垄断", keywords: ["市场结构"], aliases: ["市场类型"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "市场结构分四类。", tabs: [] },
  { id: "perfect-competition-market", categoryId: "market-structure-theory", type: "quick-check", title: "完全竞争市场", summary: "完全竞争市场存在条件。", preview: "无数买卖者；同质；自由流动；完全信息", keywords: ["完全竞争市场"], aliases: ["纯粹竞争"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "完全竞争市场条件。", tabs: [] },
  { id: "monopolistic-competition-market", categoryId: "market-structure-theory", type: "quick-check", title: "垄断竞争市场", summary: "存在条件与非价格竞争。", preview: "差别产品；进出容易；广告", keywords: ["垄断竞争市场"], aliases: ["不完全竞争"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "垄断竞争市场条件和手段。", tabs: [] },
  { id: "oligopoly-market", categoryId: "market-structure-theory", type: "quick-check", title: "寡头垄断市场", summary: "存在条件与竞争手段。", preview: "少数厂商；相互依存", keywords: ["寡头垄断市场"], aliases: ["寡头市场"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "寡头垄断市场条件和竞争。", tabs: [] },
  { id: "monopoly-market", categoryId: "market-structure-theory", type: "quick-check", title: "垄断市场", summary: "存在条件与价格歧视。", preview: "唯一厂商；无相近替代；进入壁垒", keywords: ["垄断市场"], aliases: ["完全垄断市场"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "完全垄断市场条件和价格歧视。", tabs: [] },
  { id: "market-failure-meaning", categoryId: "market-failure", type: "quick-check", title: "市场失灵的含义", summary: "市场机制不能实现资源有效配置。", preview: "市场机制；资源有效配置", keywords: ["市场失灵"], aliases: ["市场机制失灵"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "市场失灵的含义。", tabs: [] },
  { id: "market-failure-factors", categoryId: "market-failure", type: "quick-check", title: "导致市场失灵的因素", summary: "垄断、外部性、公共物品与信息不对称。", preview: "垄断；外部性；公共物品；信息不对称", keywords: ["市场失灵", "外部性", "公共物品", "信息不对称"], aliases: ["市场失灵原因"], tags: ["常识判断", "经济常识", "微观经济学"], indexText: "导致市场失灵的四类因素及解决方案。", tabs: [] },
  { id: "macro-control-goals-overview", categoryId: "macro-control-goals", type: "quick-check", title: "宏观调控的目标", summary: "四项目标总览。", preview: "经济增长；就业；物价；国际收支", keywords: ["宏观调控目标"], aliases: ["两增一稳保平衡"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "宏观调控四项目标。", tabs: [] },
  { id: "economic-growth", categoryId: "macro-control-goals", type: "quick-check", title: "经济增长", summary: "含义、三驾马车与GDP、GNP。", preview: "GDP；GNP；投资消费出口", keywords: ["经济增长", "GDP", "GNP"], aliases: ["三驾马车"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "经济增长含义、动力和核算指标。", tabs: [] },
  { id: "full-employment", categoryId: "macro-control-goals", type: "quick-check", title: "充分就业", summary: "失业含义、类型与相关概念。", preview: "失业；自然失业率；充分就业", keywords: ["失业", "失业率", "自然失业", "充分就业"], aliases: ["就业状况"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "充分就业包括失业定义、类型和相关概念。", tabs: [] },
  { id: "stable-prices", categoryId: "macro-control-goals", type: "quick-check", title: "稳定物价", summary: "通胀、衡量指标、再分配效应与通缩。", preview: "CPI；PPI；WPI；通货膨胀；通货紧缩", keywords: ["通货膨胀", "CPI", "PPI", "WPI", "通货紧缩"], aliases: ["物价稳定"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "稳定物价包括通胀、指标、再分配与通缩。", tabs: [] },
  { id: "balance-of-payments", categoryId: "macro-control-goals", type: "quick-check", title: "国际收支平衡", summary: "国际收支净额为零与两个计算式。", preview: "净出口；净资本流出；差额为零", keywords: ["国际收支平衡", "净出口", "净资本流出"], aliases: ["国际收支"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "国际收支平衡与净出口、净资本流出。", tabs: [] },
  { id: "macro-control-measures", categoryId: "macro-economic-policies", type: "quick-check", title: "宏观调控的手段", summary: "经济、法律与行政手段。", preview: "财政货币；经济法规；行政命令", keywords: ["宏观调控", "经济手段", "法律手段", "行政手段"], aliases: ["宏观调控工具"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "宏观调控经济、法律、行政三种手段。", tabs: [] },
  { id: "fiscal-policy", categoryId: "macro-economic-policies", type: "quick-check", title: "财政政策", summary: "定义、收入、支出与扩张紧缩运用。", preview: "税利债费；政府购买；转移支付；通缩通胀", keywords: ["财政政策", "财政收入", "财政支出", "国债", "扩张性财政政策", "紧缩性财政政策"], aliases: ["自动稳定器", "内在稳定器"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "财政政策包括定义、收入支出与扩张紧缩运用。", tabs: [] },
  { id: "monetary-policy", categoryId: "macro-economic-policies", type: "quick-check", title: "货币政策", summary: "银行制度、定义、工具与扩张紧缩运用。", preview: "央行商行；三率；公开市场；通缩通胀", keywords: ["货币政策", "中央银行", "商业银行", "存款准备金率", "再贴现率", "公开市场业务", "基准利率"], aliases: ["三率统一原则"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "货币政策包括银行制度、工具与扩张紧缩运用。", tabs: [] },
  { id: "industrial-policy", categoryId: "macro-economic-policies", type: "quick-check", title: "产业政策", summary: "定义与三次产业结构。", preview: "第一产业；第二产业；第三产业", keywords: ["产业政策", "第一产业", "第二产业", "第三产业"], aliases: ["产业结构"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "产业政策定义及我国三次产业结构。", tabs: [] },
  { id: "income-distribution-policy", categoryId: "macro-economic-policies", type: "quick-check", title: "收入分配政策", summary: "三次分配、基尼系数与社会结构。", preview: "初次再分配第三次；基尼；金字塔哑铃橄榄", keywords: ["收入分配", "初次分配", "再分配", "第三次分配", "基尼系数", "橄榄型"], aliases: ["国民收入分配"], tags: ["常识判断", "经济常识", "宏观经济学"], indexText: "收入分配政策及三次分配、基尼系数、社会结构。", tabs: [] },
  { id: "international-trade", categoryId: "international-economics-chapter", type: "quick-check", title: "国际贸易", summary: "进出口贸易与顺差逆差。", preview: "进口；出口；顺差出超；逆差入超", keywords: ["国际贸易", "进口贸易", "出口贸易", "贸易顺差", "贸易逆差"], aliases: ["进出口贸易"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "国际贸易组成及贸易顺逆差。", tabs: [] },
  { id: "exchange-rate-system", categoryId: "exchange-rate-issues", type: "quick-check", title: "汇率与汇率制度", summary: "汇率含义、固定与浮动汇率制。", preview: "固定汇率；浮动汇率；有管理浮动", keywords: ["汇率", "固定汇率制", "浮动汇率制"], aliases: ["有管理的浮动汇率"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "汇率含义和制度。", tabs: [] },
  { id: "exchange-rate-quotation", categoryId: "exchange-rate-issues", type: "quick-check", title: "汇率标价方法", summary: "直接标价法与间接标价法。", preview: "外币汇率；本币汇率", keywords: ["直接标价法", "间接标价法", "外币汇率", "本币汇率"], aliases: ["汇率标价"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "汇率直接与间接标价。", tabs: [] },
  { id: "exchange-rate-effects", categoryId: "exchange-rate-issues", type: "quick-check", title: "汇率变动影响", summary: "本币汇率升降对价格、贸易和资本流动的影响。", preview: "进口出口；物价；资本内外流", keywords: ["本币汇率", "外币汇率", "进口", "出口", "资本流动"], aliases: ["汇率升值贬值"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "汇率变动影响对照。", tabs: [] },
  { id: "imf", categoryId: "important-economic-organizations", type: "quick-check", title: "国际货币基金组织（IMF）", summary: "成立、总部、性质与职责。", preview: "布雷顿森林；华盛顿；货币汇率", keywords: ["IMF", "国际货币基金组织"], aliases: ["国际货币基金"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "IMF基本信息。", tabs: [] },
  { id: "world-bank", categoryId: "important-economic-organizations", type: "quick-check", title: "世界银行（WB）", summary: "成立、总部与发展融资任务。", preview: "IBRD；华盛顿；减贫发展", keywords: ["世界银行", "WB", "IBRD"], aliases: ["国际复兴开发银行"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "世界银行基本信息。", tabs: [] },
  { id: "wto", categoryId: "important-economic-organizations", type: "quick-check", title: "世界贸易组织（WTO）", summary: "成立、总部、前身与目标。", preview: "1995；日内瓦；关贸总协定", keywords: ["世界贸易组织", "WTO", "关税及贸易总协定"], aliases: ["世贸组织"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "WTO基本信息。", tabs: [] },
  { id: "economic-effects", categoryId: "economic-appendix", type: "quick-check", title: "经济效应", summary: "棘轮、马太、边际、规模、替代、收入与挤出效应。", preview: "消费惯性；两极分化；边际递减；成本；相对价格；实际收入；私人投资", keywords: ["棘轮效应", "马太效应", "边际效应", "规模效应", "替代效应", "收入效应", "挤出效应"], aliases: ["常见经济效应"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "七种经济效应。", tabs: [] },
  { id: "economic-terms", categoryId: "economic-appendix", type: "quick-check", title: "经济名词", summary: "均衡、效用、成本、风险事件与常见曲线。", preview: "纳什；边际效用；机会沉没；黑天鹅灰犀牛；拉弗菲利普斯", keywords: ["纳什均衡", "边际效用递减", "机会成本", "沉没成本", "黑天鹅", "灰犀牛", "拉弗曲线", "流动偏好", "菲利普斯曲线"], aliases: ["常见经济名词"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "常见经济名词。", tabs: [] },
  { id: "microeconomics", categoryId: "economics", type: "quick-check", title: "微观经济学", summary: "整理需求供给、弹性、市场结构与市场失灵。", preview: "需求供给、均衡价格、弹性、竞争垄断、外部性", keywords: ["微观经济", "需求", "供给", "弹性", "市场结构"], aliases: ["恩格尔系数", "丰收悖论"], tags: ["常识判断", "经济常识", "微观经济"], indexText: "微观经济包括需求供给弹性均衡、完全竞争等市场结构以及市场失灵。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "微观经济全章速查", items: ["需求受自身价格、收入、相关商品价格、偏好、预期影响；替代品价格升则本品需求升，互补品价格升则本品需求降", "价格因素影响需求量，非价格因素影响需求；吉芬品价格与需求同向，劣等品收入与需求反向", "价格弹性：替代多、非必需、调整期长则大；谷贱伤农因农产品需求缺乏弹性；恩格尔系数为食品支出占消费支出比", "供给受商品价格、成本、相关商品价、政府政策和预期影响；需求大于供给价格升；最高限价低于均衡，最低限价高于均衡", "市场结构：完全竞争、垄断竞争、寡头垄断、完全垄断；完全竞争条件为买卖者多、同质、资源完全流动、信息完全", "市场失灵包括外部性、公共物品、不完全信息、垄断；另应区分规模、替代、收入、挤出效应及纳什均衡、机会沉没成本、黑天鹅灰犀牛"] }] }] },
  { id: "macroeconomics-international", categoryId: "economics", type: "quick-check", title: "宏观与国际经济", summary: "覆盖宏观调控、财政货币政策、国际贸易、汇率与经济组织。", preview: "增长就业物价收支；财政货币；贸易汇率；WTO IMF 世界银行", keywords: ["宏观经济", "财政政策", "货币政策", "汇率", "国际贸易"], aliases: ["通货膨胀", "GDP"], tags: ["常识判断", "经济常识", "国际经济"], indexText: "宏观与国际经济包括宏观调控目标和政策、国际贸易汇率、WTO IMF世界银行等组织。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "宏观与国际经济", items: ["宏观调控目标：促进经济增长、增加就业、稳定物价、保持国际收支平衡", "财政政策以税收、国债、财政支出为工具；货币政策以利率、存款准备金率、公开市场业务为工具；扩张与紧缩方向要结合经济冷热判断", "通货膨胀为物价持续普遍上涨，通货紧缩相反；GDP为国内生产总值，GNP为国民生产总值", "国际贸易有比较优势；贸易保护常用关税、配额、补贴；汇率是一国货币与他国货币比价，本币升值利进口不利出口", "主要组织：WTO管理全球贸易、IMF稳定国际货币体系、世界银行提供发展融资；另有APEC、欧盟、东盟、G20等"] }] }] },
  { id: "constitution", categoryId: "law", type: "quick-check", title: "宪法概述与修宪", summary: "把宪法地位、原则、结构、历史与修宪程序形成框架。", preview: "根本法、权利保障书、六原则、四章、五次修正", keywords: ["宪法", "修宪", "宪法原则", "国家宪法日"], aliases: ["根本法", "宪法宣誓"], tags: ["常识判断", "法律常识", "宪法"], indexText: "宪法包括根本法地位、人民主权人权法治等原则、结构、现行宪法和五次修正。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "宪法全章速查", items: ["宪法是国家根本法、公民权利保障书、民主事实法律化；根本性体现在内容根本、效力最高、制定修改严格", "原则：人民主权、基本人权、法治、权力监督制约、党的领导、民主集中制", "中国宪法含序言和正文，无附则；正文四章：总纲、基本权利义务、国家机构、国旗国歌国徽首都", "修宪由全国人大常委会或1/5以上全国人大代表提议，经全体代表2/3以上通过", "现行宪法1982年12月4日颁布，修正于1988、1993、1999、2004、2018；国家宪法日12月4日", "国旗五星红旗、国歌义勇军进行曲、国徽天安门谷穗齿轮、首都北京"] }] }] },
  { id: "constitution-concept-features", categoryId: "constitution-overview", type: "quick-check", title: "概念和特征", summary: "宪法概念、三项特征与根本法表现。", preview: "最高效力；根本法；权利保障书；民主事实法律化", keywords: ["宪法概念", "国家根本法", "公民权利保障书", "修宪程序"], aliases: ["宪法特征"], tags: ["常识判断", "法律常识", "宪法"], indexText: "宪法概念和特征。", tabs: [] },
  { id: "constitution-basic-principles", categoryId: "constitution-overview", type: "quick-check", title: "基本原则", summary: "人民主权、人权、法治、监督制约、党的领导、民主集中制。", preview: "六项宪法基本原则", keywords: ["人民主权", "基本人权", "法治", "权力监督和制约", "党的领导", "民主集中制"], aliases: ["宪法原则"], tags: ["常识判断", "法律常识", "宪法"], indexText: "宪法六项基本原则。", tabs: [] },
  { id: "constitution-structure", categoryId: "constitution-overview", type: "quick-check", title: "结构", summary: "宪法组成、正文四章与国家标志。", preview: "序言正文；总纲权利义务国家机构国家标志", keywords: ["宪法结构", "国旗", "国歌", "国徽", "首都"], aliases: ["宪法正文结构"], tags: ["常识判断", "法律常识", "宪法"], indexText: "宪法结构和国家标志。", tabs: [] },
  { id: "constitution-history", categoryId: "constitution-overview", type: "quick-check", title: "新中国宪法的历史", summary: "宪法沿革、现行宪法与五次修宪。", preview: "共同纲领；四部宪法；1982年宪法；五次修宪", keywords: ["共同纲领", "1982年宪法", "国家宪法日", "宪法修正案"], aliases: ["新中国宪法沿革"], tags: ["常识判断", "法律常识", "宪法"], indexText: "新中国宪法历史及1988年至2018年五次修宪。", tabs: [] },
  { id: "political-system", categoryId: "constitutional-basic-systems", type: "quick-check", title: "政治制度", summary: "国体政体、选举、自治、政党、民族、特区与宪法宣誓。", preview: "七个政治制度知识点", keywords: ["国体政体", "选举制度", "基层群众自治", "政党制度", "民族区域自治", "特别行政区", "宪法宣誓"], aliases: ["国家政治制度"], tags: ["常识判断", "法律常识", "宪法"], indexText: "国家基本制度中的政治制度。", tabs: [] },
  { id: "economic-system", categoryId: "constitutional-basic-systems", type: "quick-check", title: "经济制度", summary: "公有制、自然资源与非公有制经济。", preview: "公有制主体；国有主导；非公经济重要组成", keywords: ["公有制", "国有经济", "集体所有", "非公有制经济"], aliases: ["宪法经济制度"], tags: ["常识判断", "法律常识", "宪法"], indexText: "国家基本制度中的经济制度。", tabs: [] },
  { id: "state-institutions-overview", categoryId: "constitution-organs", type: "quick-check", title: "国家机构概述", summary: "中华人民共和国国家机构的组成。", preview: "人大、主席、国务院、军委、地方机关、自治机关、法检监", keywords: ["国家机构", "全国人民代表大会", "国务院", "中央军事委员会", "人民法院", "监察委员会"], aliases: ["国家机关组成"], tags: ["常识判断", "法律常识", "宪法"], indexText: "国家机构概述。", tabs: [] },
  { id: "state-council", categoryId: "constitution-organs", type: "quick-check", title: "国务院", summary: "国务院性质、组成任期、会议、领导制度与职权。", preview: "中央人民政府；总理负责制；全体常务会议；五类职权", keywords: ["国务院", "中央人民政府", "总理负责制", "行政法规"], aliases: ["最高国家行政机关"], tags: ["常识判断", "法律常识", "宪法"], indexText: "国务院小节。", tabs: [] },
  { id: "central-military-commission", categoryId: "constitution-organs", type: "quick-check", title: "中央军委", summary: "中央军委性质、组成任期与领导体制。", preview: "领导全国武装力量；5年；主席负责制", keywords: ["中央军事委员会", "主席负责制", "全国武装力量"], aliases: ["中央军委"], tags: ["常识判断", "法律常识", "宪法"], indexText: "中央军委小节。", tabs: [] },
  { id: "judicial-system", categoryId: "constitution-organs", type: "quick-check", title: "司法系统", summary: "人民法院与人民检察院。", preview: "法院监督；检察院领导；两审终审；双重从属", keywords: ["人民法院", "人民检察院", "审判机关", "法律监督机关"], aliases: ["法检系统"], tags: ["常识判断", "法律常识", "宪法"], indexText: "司法系统小节。", tabs: [] },
  { id: "national-supervisory-commission", categoryId: "constitution-organs", type: "quick-check", title: "国家监察委员会", summary: "国家监察委员会组织、任期、领导体制与监察对象。", preview: "最高监察机关；领导关系；独立监察；六类对象", keywords: ["国家监察委员会", "监察权", "监察对象"], aliases: ["国家监察委"], tags: ["常识判断", "法律常识", "宪法"], indexText: "国家监察委员会小节。", tabs: [] },
  { id: "constitutional-system-rights", categoryId: "law", type: "quick-check", title: "国家基本制度与公民权利", summary: "梳理政治经济制度、选举、自治、特区及基本权利。", preview: "国体政体、选举、自治、政党民族特区、公民权利", keywords: ["人民代表大会", "选举", "民族自治", "公民权利", "特区"], aliases: ["国体政体", "基层自治"], tags: ["常识判断", "法律常识", "宪法"], indexText: "国家基本制度与权利包括国体政体、选举、基层自治、政党、民族区域自治、特区和公民权利。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "制度与权利全章速查", items: ["国体为工人阶级领导、工农联盟基础的人民民主专政社会主义国家；政体为人民代表大会制度", "选举权条件：中国公民、18周岁、未剥夺政治权利；县乡直接选举，市级以上间接；无记名秘密投票", "村委居委是群众性自治组织，非国家机关；自治内容民主选举决策管理监督", "政党制度为中共领导多党合作与政治协商，职能政治协商、民主监督、参政议政", "民族自治地方为自治区州县旗，不含民族乡；自治机关为人大与政府，享立法行政管理权无司法自治；特别行政区享独立司法终审", "公民权利：平等、政治自由、监督赔偿、宗教、人身人格住宅通信、财产权、劳动休息受教育物质帮助文化；劳动受教育既是权利义务"] }] }] },
  { id: "state-organs", categoryId: "law", type: "quick-check", title: "国家机构：人大、常委会与国务院", summary: "掌握最高国家机关的性质、组成、任期、会议和职权。", preview: "全国人大、常委会、国务院、总理负责制", keywords: ["全国人大", "人大常委会", "国务院", "国家机构"], aliases: ["立法权", "任免权"], tags: ["常识判断", "法律常识", "国家机构"], indexText: "国家机构包括全国人大及常委会、国务院的性质组成任期和立法任免监督职权。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "国家机构全章速查", items: ["国家机构含全国人大、国家主席、国务院、中央军委、地方人大政府、自治机关、法院检察院监察委", "全国人大是最高权力、立法、监督机关；代表不超3000，任期5年，每年一次会议；修宪、基本法律、选举一会两院三主席、审批计划预算等", "常委会是全国人大常设机关，闭会期间行使最高国家权力；解释宪法法律、制定其他法律、监督一府一委两院、撤销违宪违法规范", "国务院即中央人民政府，是最高权力机关执行机关、最高行政机关；对人大及闭会期间常委会负责", "国务院由总理副总理国务委员各部部长各委主任审计长秘书长组成，任期5年；全体会半年一次、常务会每周一次；实行总理负责制", "国务院职权含制定行政法规命令、提议案、统一领导行政工作、编制执行计划预算、批准部分行政区划和紧急状态"] }] }] },
  { id: "state-president-judiciary-supervision", categoryId: "law", type: "quick-check", title: "国家主席、军委与司法监察机关", summary: "补齐国家主席、中央军委、法院、检察院和监察委员会的性质、任期与关系。", preview: "国家主席；军委主席负责制；法院监督；检察院领导；国家监察委", keywords: ["国家主席", "中央军委", "人民法院", "人民检察院", "监察委员会"], aliases: ["两院", "国家监察委", "军委主席负责制"], tags: ["常识判断", "法律常识", "国家机构"], indexText: "国家主席中央军委法院检察院监察委员会的产生条件、组织关系、任期和职权速查。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "国家机关补全", items: ["国家主席是国家机构的重要组成部分；有选举权和被选举权、年满45周岁的中国公民可被选为主席、副主席，任期同全国人大每届5年", "中央军委领导全国武装力量，实行主席负责制；军委主席对全国人大及其常委会负责，宪法未规定连续任职届数限制", "人民法院是国家审判机关，由最高、地方各级和军事等专门法院组成；上下级法院是监督关系，审判一般实行两审终审", "人民检察院是国家法律监督机关；最高检领导地方各级和专门检察院工作，上级检察院领导下级检察院工作", "国家监察委员会是最高监察机关，对全国人大及其常委会负责；领导地方各级监察委员会工作，依法独立行使监察权", "易混：法院上下级是监督，检察院上下级是领导；监察对象是所有行使公权力的公职人员"] }] }] },
  { id: "civil-code-general-persons", categoryId: "law", type: "quick-check", title: "民法典总则与民事主体", summary: "从民法基本原则切入，掌握自然人能力、胎儿利益、宣告失踪死亡和法人分类。", preview: "七编1260条；8岁与18岁；胎儿利益；失踪2年；法人三类", keywords: ["民法典", "自然人", "民事行为能力", "宣告失踪", "法人"], aliases: ["民法总则", "权利能力", "胎儿利益"], tags: ["常识判断", "法律常识", "民法典"], indexText: "民法典七编1260条及平等自愿公平诚信公序良俗绿色原则，自然人能力和法人分类。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "总则与主体补全", items: ["《民法典》共7编、1260条；基本原则为平等、自愿、公平、诚信、公序良俗和绿色原则", "自然人的民事权利能力始于出生、终于死亡；涉及遗产继承、接受赠与等胎儿利益保护的，胎儿视为具有权利能力，但娩出时为死体的自始不存在", "不满8周岁为无民事行为能力人；8周岁以上未成年人为限制民事行为能力人；18周岁以上为成年人，16周岁以上且以劳动收入为主要生活来源的视为完全民事行为能力人", "自然人下落不明满2年，利害关系人可申请宣告失踪；因意外事件下落不明满2年或一般下落不明满4年，可申请宣告死亡；经证明不可能生存的意外事件不受2年限制", "法人分营利法人、非营利法人和特别法人；营利法人包括有限责任公司、股份有限公司等，特别法人包括机关、农村集体经济组织、城镇农村合作经济组织、基层群众性自治组织法人"] }, { type: "tip", variant: "warning", title: "数字易错", content: "能力年龄记“8—16—18”；失踪与死亡记“失踪2、意外2、一般4”。宣告失踪不是宣告死亡的必经程序。" }] }] },
  { id: "civil-basic-principles", categoryId: "civil-law-overview", type: "quick-check", title: "民法的基本原则", summary: "平等、自愿、公平、诚信、守法与公序良俗、绿色。", preview: "首要；核心；公平；帝王条款；守法公序；绿色", keywords: ["平等原则", "自愿原则", "公平原则", "诚信原则", "公序良俗", "绿色原则"], aliases: ["民法六原则"], tags: ["常识判断", "法律常识", "民法典"], indexText: "民法基本原则小节。", tabs: [] },
  { id: "legal-person", categoryId: "civil-subjects-section", type: "quick-check", title: "法人", summary: "法人概述及营利、非营利、特别法人分类。", preview: "独立责任；营利；非营利；特别法人", keywords: ["法人", "营利法人", "非营利法人", "特别法人"], aliases: ["法人分类"], tags: ["常识判断", "法律常识", "民法典"], indexText: "法人小节。", tabs: [] },
  { id: "civil-act-effect", categoryId: "civil-legal-acts-section", type: "quick-check", title: "民事法律行为的效力", summary: "有效、无效、可撤销、效力待定。", preview: "法真行；小孩卖假串；诈迫误公；30日追认", keywords: ["有效", "无效", "可撤销", "效力待定"], aliases: ["民事行为效力"], tags: ["常识判断", "法律常识", "民法典"], indexText: "民事法律行为效力小节。", tabs: [] },
  { id: "civil-property-rights", categoryId: "civil-rights-section", type: "quick-check", title: "财产权", summary: "财产权平等保护、物权与四类债权。", preview: "所有用益担保；合同侵权无因管理不当得利", keywords: ["财产权", "物权", "债权", "无因管理", "不当得利"], aliases: ["民事财产权"], tags: ["常识判断", "法律常识", "民法典"], indexText: "财产权小节。", tabs: [] },
  { id: "civil-agency-authority", categoryId: "civil-agency-section", type: "quick-check", title: "代理权", summary: "委托法定代理及代理人责任。", preview: "委托代理；法定代理；不履责；恶意串通", keywords: ["代理权", "委托代理", "法定代理", "连带责任"], aliases: ["代理人责任"], tags: ["常识判断", "法律常识", "民法典"], indexText: "代理权小节。", tabs: [] },
  { id: "unauthorized-agency", categoryId: "civil-agency-section", type: "quick-check", title: "无权代理", summary: "狭义无权代理与表见代理。", preview: "无权超权权终；代理权外观；善意无过失；内外效果", keywords: ["无权代理", "表见代理", "善意第三人"], aliases: ["狭义无权代理"], tags: ["常识判断", "法律常识", "民法典"], indexText: "无权代理小节。", tabs: [] },
  { id: "civil-limitation-types", categoryId: "civil-limitation-section", type: "quick-check", title: "诉讼时效的种类", summary: "普通、特殊起算与不适用情形。", preview: "3年；知道或应知；20年；特殊起算；不适用", keywords: ["普通诉讼时效", "特殊诉讼时效", "不适用诉讼时效"], aliases: ["诉讼时效种类"], tags: ["常识判断", "法律常识", "民法典"], indexText: "诉讼时效种类小节。", tabs: [] },
  { id: "ownership-rights", categoryId: "property-rights-part", type: "quick-check", title: "所有权", summary: "权能、取得方式与善意取得。", preview: "占有使用收益处分；原始继受；善意取得", keywords: ["所有权", "处分", "原始取得", "继受取得", "善意取得"], aliases: ["财产所有权"], tags: ["常识判断", "法律常识", "民法典"], indexText: "所有权小节。", tabs: [] },
  { id: "usufruct-rights", categoryId: "property-rights-part", type: "quick-check", title: "用益物权", summary: "定义、五类权利与居住权登记。", preview: "土地承包；建设用地；宅基地；居住权；地役权", keywords: ["用益物权", "居住权", "地役权"], aliases: ["用益权"], tags: ["常识判断", "法律常识", "民法典"], indexText: "用益物权小节。", tabs: [] },
  { id: "security-rights", categoryId: "property-rights-part", type: "quick-check", title: "担保物权", summary: "抵押权、质权与留置权。", preview: "抵押不移占有；质权移交占有；留置合法占有；优先受偿", keywords: ["担保物权", "抵押权", "质权", "留置权"], aliases: ["担保权"], tags: ["常识判断", "法律常识", "民法典"], indexText: "担保物权小节。", tabs: [] },
  { id: "contract-formation", categoryId: "contract-part", type: "quick-check", title: "合同订立的一般程序", summary: "要约、要约邀请与承诺。", preview: "要约承诺；要约邀请；迟到承诺", keywords: ["合同订立", "要约", "要约邀请", "承诺"], aliases: ["合同成立"], tags: ["常识判断", "法律常识", "民法典"], indexText: "合同订立一般程序小节。", tabs: [] },
  { id: "contract-code-revisions", categoryId: "contract-part", type: "quick-check", title: "合同编新修", summary: "电子合同、格式条款与禁止高利贷。", preview: "电子合同；提示说明；格式条款无效；自然人借款", keywords: ["电子合同", "格式条款", "高利贷", "借款利息"], aliases: ["合同编新规"], tags: ["常识判断", "法律常识", "民法典"], indexText: "合同编新修小节。", tabs: [] },
  { id: "contract-breach-liability", categoryId: "contract-part", type: "quick-check", title: "违约责任", summary: "承担方式与定金罚则。", preview: "继续履行；补救；赔偿；违约金；定金20%；双倍返还", keywords: ["违约责任", "定金罚则", "20%", "双倍返还"], aliases: ["合同违约"], tags: ["常识判断", "法律常识", "民法典"], indexText: "违约责任小节。", tabs: [] },
  { id: "personality-rights-part", categoryId: "law", type: "quick-check", title: "人格权编", summary: "生命身体健康、姓名名称、肖像、名誉荣誉、隐私信息。", preview: "三项基础权；姓名名称；肖像；名誉荣誉；隐私与个人信息", keywords: ["人格权", "生命权", "姓名权", "肖像权", "名誉权", "隐私权", "个人信息"], aliases: ["人格权编"], tags: ["常识判断", "法律常识", "民法典"], indexText: "人格权编同名无编号小节。", tabs: [] },
  { id: "invalid-marriage", categoryId: "marriage-family-part", type: "quick-check", title: "无效婚姻", summary: "重婚、禁婚亲属、未到法定婚龄。", preview: "重婚；直系与三代旁系；男22女20", keywords: ["无效婚姻", "重婚", "法定婚龄"], aliases: ["婚姻无效"], tags: ["常识判断", "法律常识", "民法典"], indexText: "无效婚姻小节。", tabs: [] },
  { id: "revocable-marriage", categoryId: "marriage-family-part", type: "quick-check", title: "可撤销婚姻", summary: "胁迫与隐瞒重大疾病。", preview: "胁迫；人民法院；一年；重大疾病", keywords: ["可撤销婚姻", "胁迫", "重大疾病"], aliases: ["撤销婚姻"], tags: ["常识判断", "法律常识", "民法典"], indexText: "可撤销婚姻小节。", tabs: [] },
  { id: "divorce-rules", categoryId: "marriage-family-part", type: "quick-check", title: "离婚", summary: "协议离婚、诉讼离婚与过错赔偿。", preview: "30日冷静期；准予情形；军婚孕期限制；五类赔偿", keywords: ["协议离婚", "诉讼离婚", "离婚冷静期", "离婚损害赔偿"], aliases: ["离婚规则"], tags: ["常识判断", "法律常识", "民法典"], indexText: "离婚小节。", tabs: [] },
  { id: "inheritance-concept", categoryId: "inheritance-part", type: "quick-check", title: "财产继承的概念", summary: "遗产转移制度与继承权恢复。", preview: "死亡；个人合法财产；悔改加原谅", keywords: ["财产继承", "遗产", "继承权"], aliases: ["继承概念"], tags: ["常识判断", "法律常识", "民法典"], indexText: "财产继承概念小节。", tabs: [] },
  { id: "inheritance-methods", categoryId: "inheritance-part", type: "quick-check", title: "法定继承、遗嘱继承和遗赠", summary: "继承顺序、代位、遗嘱形式与遗赠扶养协议。", preview: "两顺序；代位；六类遗嘱；最后遗嘱；遗赠扶养", keywords: ["法定继承", "代位继承", "遗嘱继承", "遗赠扶养协议"], aliases: ["继承方式"], tags: ["常识判断", "法律常识", "民法典"], indexText: "法定继承遗嘱继承遗赠小节。", tabs: [] },
  { id: "tort-attribution", categoryId: "tort-liability-part", type: "quick-check", title: "侵权行为归责原则", summary: "过错、无过错、公平责任、免责与新法规定。", preview: "过错；六类无过错；依法分担；六类免责；自甘风险自助", keywords: ["过错责任", "无过错责任", "公平责任", "免责事由", "自甘风险", "自助行为"], aliases: ["侵权归责"], tags: ["常识判断", "法律常识", "民法典"], indexText: "侵权行为归责原则小节。", tabs: [] },
  { id: "criminal-law-effect", categoryId: "criminal-law-overview-section", type: "quick-check", title: "刑法的适用范围", summary: "空间管辖与时间效力。", preview: "属地属人保护普遍；生效失效；从旧兼从轻", keywords: ["刑法适用范围", "属地管辖", "属人管辖", "保护管辖", "普遍管辖", "从旧兼从轻"], aliases: ["刑法效力"], tags: ["常识判断", "法律常识", "刑法"], indexText: "刑法适用范围小节。", tabs: [] },
  { id: "civil-acts-agency-limitation", categoryId: "law", type: "quick-check", title: "民事法律行为、代理与诉讼时效", summary: "按有效、无效、可撤销、效力待定分类，并串联代理与时效数字。", preview: "有效四要件；欺诈胁迫可撤销；无权代理；表见代理；3年与20年", keywords: ["民事法律行为", "可撤销", "无权代理", "表见代理", "诉讼时效"], aliases: ["效力待定", "撤销权", "代理"], tags: ["常识判断", "法律常识", "民法典"], indexText: "民事法律行为效力、无权代理表见代理及普通三年最长二十年诉讼时效规则。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "行为效力与代理", items: ["民事法律行为有效通常要求：行为人有相应民事行为能力、意思表示真实、不违反法律行政法规强制性规定、不违背公序良俗", "无行为能力人实施的行为、虚假意思表示、恶意串通损害他人合法权益，以及违反强制性规定或公序良俗的行为，依法无效", "重大误解、欺诈、胁迫以及利用危困状态或缺乏判断能力导致显失公平的行为可撤销；重大误解一般90日，其余通常1年，最长均不超过行为发生后5年", "限制行为能力人超出其能力的行为、无权代理行为通常效力待定；经法定代理人或被代理人追认后有效", "表见代理虽无代理权，但相对人有理由相信行为人有代理权且属善意时，代理行为有效；被代理人可向无权代理人追偿"] }, { type: "list", label: "诉讼时效数字", items: ["普通诉讼时效3年，自权利人知道或应当知道权利受损及义务人之日起算；自权利受损之日起超过20年，法院原则上不予保护", "分期履行债务从最后一期届满日起算；未成年人遭受性侵害的损害赔偿请求权，自受害人年满18周岁起算", "请求停止侵害、排除妨碍、消除危险；不动产物权和登记动产物权权利人请求返还财产；请求支付抚养费赡养费扶养费等，不适用诉讼时效"] }] }] },
  { id: "property-contract", categoryId: "law", type: "quick-check", title: "物权与合同", summary: "掌握物权变动、善意取得、用益与担保物权，以及合同订立和违约责任。", preview: "不动产登记；动产交付；善意取得；抵押质押留置；定金20%", keywords: ["物权", "善意取得", "合同", "抵押", "定金"], aliases: ["用益物权", "担保物权", "格式条款"], tags: ["常识判断", "法律常识", "民法典"], indexText: "不动产登记动产交付、善意取得、抵押质押留置、要约承诺与定金百分之二十。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "物权规则", items: ["所有权包括占有、使用、收益、处分四项权能，处分是核心；不动产物权变动原则上经登记生效，动产物权变动原则上自交付生效", "善意取得要求：处分人无权处分、受让人善意、以合理价格转让，并完成应有登记或交付", "用益物权包括土地承包经营权、建设用地使用权、宅基地使用权、居住权和地役权", "担保物权包括抵押权、质权、留置权；抵押通常不转移占有，动产质押转移占有，留置要求债权人已经合法占有债务人的动产"] }, { type: "list", label: "合同规则", items: ["合同一般经要约和承诺成立；拍卖公告、招标公告、招股说明书、债券募集办法、基金招募说明书、商业广告宣传通常为要约邀请，但内容符合要约条件的商业广告宣传可构成要约", "电子数据交换、电子邮件等能有形表现并可随时调取的数据电文视为书面形式；格式条款提供方负提示说明义务", "借款未约定利息，视为没有利息；自然人之间对利息约定不明，视为没有利息；禁止高利放贷", "违约责任方式有继续履行、补救措施、赔偿损失、违约金和定金责任；定金不得超过主合同标的额20%，给付方违约无权请求返还，收受方违约双倍返还"] }] }] },
  { id: "tort-liability", categoryId: "law", type: "quick-check", title: "侵权责任", summary: "按归责原则、特殊主体、免责减责和自甘风险自助行为掌握侵权判断。", preview: "过错与无过错；监护雇主产品环境；自甘风险；自助行为；高空抛物", keywords: ["侵权责任", "无过错责任", "自甘风险", "自助行为", "高空抛物"], aliases: ["公平责任", "免责事由"], tags: ["常识判断", "法律常识", "民法典"], indexText: "侵权责任归责原则、监护雇主产品污染高危动物责任、免责减责和高空抛物。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "侵权责任补全", items: ["侵权责任一般适用过错责任；法律明确规定时适用过错推定或无过错责任。无过错责任常见于监护人、用人单位、产品、环境污染和生态破坏、高度危险、饲养动物等领域", "损害由受害人故意造成，行为人可免责；受害人有过错可减轻行为人责任；第三人、不可抗力、正当防卫、紧急避险依法影响责任承担", "自愿参加有一定风险的文体活动，因其他参加者行为受损，原则上不得请求无故意或重大过失的其他参加者承担侵权责任；活动组织者仍负相应安全保障义务", "合法权益受侵害、情况紧迫且不能及时获得国家机关保护时，可在必要范围内扣留侵权人财物等，但应立即请求有关国家机关处理；措施不当造成损害应担责", "禁止从建筑物抛掷物品；难以确定具体侵权人时，除能证明自己不是侵权人的外，由可能加害的建筑物使用人给予补偿，补偿后可向侵权人追偿；物业等管理人负安全保障义务", "公平分担不是一般归责原则，只能在法律规定的情形下依实际情况由双方分担损失"] }] }] },
  { id: "criminal-responsibility-capacity", categoryId: "law", type: "quick-check", title: "刑事责任年龄与责任能力", summary: "完整补齐责任年龄表，并区分精神障碍、醉酒、聋哑盲人与高龄人员的处理。", preview: "不满12；12—14核准追诉；14—16八类；精神障碍；聋哑盲；75岁", keywords: ["刑事责任年龄", "精神病人", "醉酒", "聋哑人", "七十五周岁"], aliases: ["责任能力", "相对刑事责任", "核准追诉"], tags: ["常识判断", "法律常识", "刑法"], indexText: "刑事责任年龄十二十四十六周岁、精神障碍责任能力、醉酒、聋哑盲人与七十五周岁处理。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "责任年龄表补全", items: ["不满12周岁：原则上完全不负刑事责任，必要时依法进行专门矫治教育", "已满12不满14周岁：仅对故意杀人，或者故意伤害致人死亡、以特别残忍手段致人重伤造成严重残疾，情节恶劣并经最高人民检察院核准追诉的行为负刑责", "已满14不满16周岁：对故意杀人、故意伤害致人重伤或死亡、强奸、抢劫、贩卖毒品、放火、爆炸、投放危险物质负刑责", "已满16周岁：犯罪应当负刑事责任；不满18周岁的人犯罪，应当从轻或减轻处罚"] }, { type: "list", label: "特殊责任能力补全", items: ["精神障碍者在不能辨认或不能控制自己行为时造成危害，经法定程序鉴定确认的，不负刑责；间歇性精神病人在精神正常时犯罪应负刑责；尚未完全丧失辨认或控制能力的，应负刑责，但可以从轻或减轻处罚", "醉酒的人犯罪应当负刑事责任；这里的醉酒不等同于不能辨认或控制行为的精神障碍免责情形", "又聋又哑的人或者盲人犯罪，可以从轻、减轻或者免除处罚", "已满75周岁的人故意犯罪，可以从轻或减轻处罚；过失犯罪，应当从轻或减轻处罚", "审判时已满75周岁的人原则上不适用死刑，但以特别残忍手段致人死亡的除外；犯罪时不满18周岁的人不适用死刑"] }, { type: "tip", variant: "warning", title: "判断题陷阱", content: "“12—14周岁一律不负刑责”“醉酒可以免责”“75周岁一律免刑”都错误。注意题目中的‘可以’与‘应当’。" }] }] },
  { id: "criminal-law-general", categoryId: "law", type: "quick-check", title: "刑法总则：效力、犯罪构成与排除犯罪", summary: "集中记刑法原则、管辖、年龄责任、故意过失、单位犯罪、正当防卫和紧急避险。", preview: "罪刑法定；从旧兼从轻；12/14/16岁；八类犯罪；无限防卫", keywords: ["刑法", "刑事责任年龄", "犯罪构成", "正当防卫", "紧急避险"], aliases: ["从旧兼从轻", "单位犯罪", "无限防卫"], tags: ["常识判断", "法律常识", "刑法"], indexText: "刑法罪刑法定平等罪责刑相适应原则、管辖与溯及力、责任年龄和正当防卫紧急避险。", tabs: [{ id: "knowledge", title: "速查", blocks: [{ type: "list", label: "原则、效力与犯罪", items: ["刑法三大基本原则：罪刑法定、适用刑法人人平等、罪责刑相适应；犯罪具有严重社会危害性、刑事违法性和应受刑罚处罚性", "属地管辖涵盖我国领域及我国船舶、航空器；另有属人、保护和普遍管辖。刑法原则上不溯及既往，对新法施行前行为实行从旧兼从轻", "犯罪主体包括自然人和单位；单位犯罪一般对单位判处罚金，并对直接负责的主管人员和其他直接责任人员判处刑罚", "直接故意是明知并希望结果发生，间接故意是明知并放任；过失分疏忽大意的过失与过于自信的过失；不作为犯罪的作为义务可源于法律、职务业务和先行行为"] }, { type: "list", label: "责任年龄与阻却事由", items: ["不满12周岁原则上不负刑事责任；已满12不满14周岁，犯故意杀人或故意伤害致人死亡、以特别残忍手段致人重伤造成严重残疾，情节恶劣且经最高人民检察院核准追诉的，才负刑责", "已满14不满16周岁，仅对故意杀人、故意伤害致人重伤或死亡、强奸、抢劫、贩卖毒品、放火、爆炸、投放危险物质八类行为负刑责；已满16周岁对犯罪负刑责", "未满18周岁犯罪应从轻或减轻处罚且不适用死刑；已满75周岁故意犯罪可以从轻或减轻，过失犯罪应当从轻或减轻", "正当防卫须针对正在进行的不法侵害；防卫明显超过必要限度造成重大损害属防卫过当。对正在进行的行凶、杀人、抢劫、强奸、绑架等严重危及人身安全的暴力犯罪，可实行特殊防卫", "紧急避险是为保护较大合法权益，不得已损害较小的第三方合法权益；损害不得超过必要限度，职务业务上负有特定责任的人不得以避免本人危险为由紧急避险"] }] }] },
];
const section1015Overrides = require("./note-common-sense-10-15");
const section1622Overrides = require("./note-common-sense-16-22");
const section2330Overrides = require("./note-common-sense-23-30");
const section3137Overrides = require("./note-common-sense-31-37");
const remainingLawPoints = require("./note-common-sense-remaining-law");
[...section1015Overrides, ...section1622Overrides, ...section2330Overrides, ...section3137Overrides, ...remainingLawPoints].forEach((override) => {
  const index = points.findIndex((point) => point.id === override.id);
  if (index >= 0) points[index] = { ...points[index], ...override };
  else points.push(override);
});

function splitDetailPoint(sourceId, segments) {
  const sourceIndex = points.findIndex((point) => point.id === sourceId);
  if (sourceIndex < 0) return;
  const source = points[sourceIndex];
  const nextPoints = segments.map(({ tabIds, ...segment }) => ({
    ...source,
    ...segment,
    tabs: (source.tabs || []).filter((tab) => tabIds.includes(tab.id)),
  }));
  points.splice(sourceIndex, 1, ...nextPoints);
}

splitDetailPoint("constitutional-system-rights", [
  {
    id: "constitutional-system-rights", title: "国家基本制度", tabIds: ["systems"],
    summary: "集中掌握国体、政体、选举、基层自治、民族区域自治和特别行政区制度。",
    preview: "人民民主专政；人民代表大会制度；直接与间接选举；民族区域自治；特别行政区",
    keywords: ["国家基本制度", "人民民主专政", "人民代表大会制度", "选举制度", "民族区域自治"],
    aliases: ["国体政体", "基本政治制度"],
    indexText: "国家基本制度包括人民民主专政、人民代表大会制度、选举制度、基层自治、民族区域自治和特别行政区。",
  },
  {
    id: "citizen-constitutional-rights", title: "公民的基本权利", tabIds: ["rights", "duties"],
    summary: "独立整理公民基本权利、政治自由、人身通信权利及宪法基本义务。",
    preview: "选举权；六项政治自由；人身自由；通信秘密；监督权；基本义务",
    keywords: ["公民基本权利", "选举权", "政治自由", "人身自由", "基本义务"],
    aliases: ["公民权利", "宪法权利义务"],
    indexText: "公民基本权利和义务包括政治权利、宗教自由、人身通信权利、监督权和维护国家统一安全等义务。",
  },
]);

splitDetailPoint("civil-code-general-persons", [
  {
    id: "civil-code-general-persons", title: "民法概述", tabIds: ["civil-overview"],
    summary: "整理民法调整对象、民法典结构和民法基本原则。",
    preview: "平等主体；人身与财产关系；七编1260条；平等、自愿、公平、诚信、绿色",
    keywords: ["民法概述", "民法典", "民法基本原则", "平等主体", "人格权编"],
    aliases: ["民法原则", "民法调整对象"],
    indexText: "民法概述包括调整对象、民法典七编结构及平等自愿公平诚信公序良俗绿色原则。",
  },
  {
    id: "civil-subjects", title: "民事主体", tabIds: ["natural-person", "missing-legal-person"],
    summary: "整理自然人行为能力、胎儿利益、宣告失踪死亡以及法人分类。",
    preview: "8-16-18；胎儿利益；失踪2年；死亡4年或2年；营利、非营利、特别法人",
    keywords: ["民事主体", "自然人", "民事行为能力", "宣告失踪", "法人"],
    aliases: ["自然人法人", "行为能力"],
    indexText: "民事主体包括自然人民事权利能力行为能力、宣告失踪死亡以及营利非营利特别法人。",
  },
]);

splitDetailPoint("civil-acts-agency-limitation", [
  {
    id: "civil-acts-agency-limitation", title: "民事法律行为", tabIds: ["civil-acts"],
    summary: "区分民事法律行为的有效、无效、可撤销和效力待定。",
    preview: "有效要件；无效；重大误解90日；欺诈胁迫1年；追认30日",
    keywords: ["民事法律行为", "有效", "无效", "可撤销", "效力待定"],
    aliases: ["行为效力", "撤销权"],
    indexText: "民事法律行为按有效无效可撤销效力待定分类，并掌握撤销权和追认期限。",
  },
  {
    id: "civil-rights", title: "民事权利", tabIds: ["rights-debts"],
    summary: "整理人身权、财产权、债权、无因管理、不当得利和紧急救助。",
    preview: "人格身份权；物权债权；无因管理；不当得利；见义勇为",
    keywords: ["民事权利", "人身权", "财产权", "无因管理", "不当得利"],
    aliases: ["权利与债", "见义勇为"],
    indexText: "民事权利包括人身权财产权、物权债权、无因管理、不当得利和紧急救助规则。",
  },
  {
    id: "civil-agency", title: "代理", tabIds: ["agency"],
    summary: "区分委托代理、法定代理、无权代理和表见代理。",
    preview: "委托代理；法定代理；无权代理；表见代理；善意且无过失",
    keywords: ["代理", "委托代理", "法定代理", "无权代理", "表见代理"],
    aliases: ["代理制度", "权利外观"],
    indexText: "代理制度包括委托代理法定代理、无权代理追认和表见代理的构成及后果。",
  },
  {
    id: "civil-limitation", title: "诉讼时效", tabIds: ["limitation"],
    summary: "掌握普通诉讼时效、最长保护期、特殊起算点和不适用情形。",
    preview: "普通3年；最长20年；分期债务；未成年人遭受性侵；不适用诉讼时效",
    keywords: ["诉讼时效", "3年", "20年", "起算点", "不适用诉讼时效"],
    aliases: ["时效", "最长保护期间"],
    indexText: "诉讼时效包括普通三年最长二十年、分期债务和特殊请求权的起算及不适用规则。",
  },
]);

splitDetailPoint("criminal-law-general", [
  {
    id: "criminal-law-overview", title: "刑法概述", tabIds: ["principles-effect"],
    sourceSections: [36],
    summary: "整理刑法基本原则、空间效力和从旧兼从轻的时间效力。",
    preview: "罪刑法定；平等；罪责刑相适应；属地属人保护普遍；从旧兼从轻",
    keywords: ["刑法概述", "罪刑法定", "刑法效力", "属地管辖", "从旧兼从轻"],
    aliases: ["刑法原则", "刑法管辖"],
    indexText: "刑法概述包括罪刑法定平等罪责刑相适应原则、四类管辖和从旧兼从轻。",
  },
  {
    id: "criminal-law-general", title: "刑法总则", tabIds: ["crime-elements", "defense-avoidance"],
    summary: "整理犯罪构成、故意过失、不作为、正当防卫和紧急避险。",
    preview: "犯罪四要件；直接间接故意；两类过失；正当防卫；紧急避险",
    keywords: ["刑法总则", "犯罪构成", "故意过失", "正当防卫", "紧急避险"],
    aliases: ["犯罪四要件", "排除犯罪"],
    indexText: "刑法总则包括犯罪构成、故意过失与不作为、正当防卫和紧急避险。",
  },
]);

splitDetailPoint("macroeconomics-international", [
  {
    id: "macroeconomics-international", title: "宏观经济学", tabIds: ["macro-indicators", "macro-policy", "distribution"],
    sourceSections: [26],
    summary: "整理宏观目标与指标、通胀失业、财政货币政策和收入分配。",
    preview: "GDP、CPI；通胀与失业；财政货币政策；产业分类；三次分配",
    keywords: ["宏观经济学", "GDP", "通货膨胀", "财政政策", "货币政策"],
    aliases: ["宏观经济", "三次分配"],
    indexText: "宏观经济学包括GDP CPI、通胀失业、财政货币政策、产业分类和三次分配。",
  },
  {
    id: "international-economics", title: "国际经济", tabIds: ["international"],
    sourceSections: [27],
    summary: "整理国际贸易、汇率方向、主要国际经济组织和常见经济名词。",
    preview: "顺差逆差；本币升值贬值；IMF、世界银行、WTO；黑天鹅灰犀牛",
    keywords: ["国际经济", "国际贸易", "汇率", "IMF", "WTO"],
    aliases: ["贸易顺差", "国际经济组织"],
    indexText: "国际经济包括贸易顺逆差、汇率升贬值、IMF世界银行WTO以及黑天鹅灰犀牛等。",
  },
]);

splitDetailPoint("poetry-ci-qu", [
  {
    id: "poetry-ci-qu", title: "词曲与戏剧", tabIds: ["ci-qu"], sourceSections: [10],
    summary: "按词、散曲、杂剧和明清戏剧的发展顺序整理代表作家、作品与流派。",
    preview: "豪放婉约；元曲四大家；窦娥冤；牡丹亭；桃花扇",
    keywords: ["宋词", "元曲", "杂剧", "苏轼", "关汉卿"], aliases: ["词曲戏剧", "豪放派", "婉约派"],
    indexText: "词曲与戏剧包括宋词豪放婉约流派、元曲四大家以及明清传奇代表作品。",
  },
  {
    id: "classical-novels", title: "古典小说", tabIds: ["novels"], sourceSections: [10],
    summary: "整理四大名著、三言二拍及明清重要文言、讽刺和谴责小说。",
    preview: "四大名著；三言二拍；聊斋志异；儒林外史；晚清谴责小说",
    keywords: ["四大名著", "三言二拍", "聊斋志异", "儒林外史"], aliases: ["明清小说", "古典名著"],
    indexText: "古典小说包括四大名著、三言二拍、聊斋志异、儒林外史和晚清谴责小说。",
  },
]);

splitDetailPoint("fiction-history-modern-literature", [
  {
    id: "fiction-history-modern-literature", title: "史书与书籍", tabIds: ["books-history"], sourceSections: [10],
    summary: "区分纪传体、编年体、国别体与纪事本末体，并整理高频典籍。",
    preview: "纪传体、编年体、国别体、纪事本末体；四书五经；前四史",
    keywords: ["史书体例", "四书五经", "前四史", "资治通鉴"], aliases: ["史学常识", "高频典籍"],
    indexText: "史书与书籍包括四种常见史书体例、四书五经、前四史和大型类书丛书。",
  },
  {
    id: "modern-literature", title: "现当代文学", tabIds: ["modern"], sourceSections: [10],
    summary: "按作家、作品和文学类型整理中国现当代文学高频考点。",
    preview: "鲁迅、郭沫若、茅盾、巴金、老舍、曹禺",
    keywords: ["鲁迅", "郭沫若", "茅盾", "巴金", "老舍", "曹禺"], aliases: ["现代文学", "当代文学"],
    indexText: "现当代文学包括鲁迅、郭沫若、茅盾、巴金、老舍、曹禺等代表作家作品。",
  },
]);

splitDetailPoint("selection-thought-ritual", [
  {
    id: "selection-thought-ritual", title: "古代选官制度", tabIds: ["selection"], sourceSections: [11],
    summary: "串联世卿世禄、察举、九品中正和科举制度及科举名次。",
    preview: "世卿世禄、察举、九品中正、科举；解元、会元、状元",
    keywords: ["选官制度", "察举制", "九品中正制", "科举制"], aliases: ["科举名次", "连中三元"],
    indexText: "古代选官制度包括世卿世禄、察举制、九品中正制、科举制及考试名次。",
  },
  {
    id: "traditional-thought-ritual", title: "思想与礼仪", tabIds: ["thought-ritual"], sourceSections: [12],
    summary: "整理先秦主要思想流派及古代常见年龄称谓。",
    preview: "儒道墨法兵；总角、豆蔻、弱冠、而立、不惑、花甲、古稀",
    keywords: ["先秦思想", "儒家", "道家", "年龄称谓"], aliases: ["诸子百家", "古代礼仪"],
    indexText: "思想与礼仪包括儒道墨法兵等先秦思想流派和古代常见年龄称谓。",
  },
]);

splitDetailPoint("ancient-science-medicine", [
  {
    id: "ancient-science-medicine", title: "古代科技与地理", tabIds: ["science"], sourceSections: [13],
    summary: "整理古代天文历法、数学农学、地理著作和四大发明。",
    preview: "干支与节气；授时历；九章算术；齐民要术；四大发明",
    keywords: ["古代科技", "二十四节气", "四大发明", "九章算术"], aliases: ["科技地理", "古代科技著作"],
    indexText: "古代科技与地理包括天文历法、数学农学地理著作以及四大发明的发展线索。",
  },
  {
    id: "traditional-chinese-medicine", title: "中医常识", tabIds: ["medicine"], sourceSections: [13],
    summary: "整理中医重要典籍、代表医家和望闻问切、针灸等基础知识。",
    preview: "黄帝内经；张仲景、华佗、孙思邈、李时珍；望闻问切；针灸",
    keywords: ["中医", "黄帝内经", "张仲景", "望闻问切"], aliases: ["传统医学", "中医四诊"],
    indexText: "中医常识包括黄帝内经、历代代表医家、中医四诊和针灸基础。",
  },
]);

splitDetailPoint("traditional-arts", [
  {
    id: "traditional-arts", title: "书法与国画", tabIds: ["calligraphy-painting"], sourceSections: [13],
    summary: "按书体、名家、代表作和绘画题材技法整理传统书画。",
    preview: "王羲之、颜真卿、柳公权；人物山水花鸟；工笔与写意",
    keywords: ["书法", "中国画", "王羲之", "清明上河图"], aliases: ["传统书画", "书画名家"],
    indexText: "书法与国画包括书法名家代表作、中国画题材技法和高频绘画作品。",
  },
  {
    id: "traditional-opera-music", title: "戏曲与传统音乐", tabIds: ["opera-music"], sourceSections: [13],
    summary: "整理京剧行当、表演手段、脸谱及常见民族乐器与名曲。",
    preview: "生旦净丑；唱念做打；脸谱；古琴、琵琶、二胡、笛箫",
    keywords: ["京剧", "生旦净丑", "脸谱", "传统音乐"], aliases: ["戏曲音乐", "民族乐器"],
    indexText: "戏曲与传统音乐包括京剧行当表演脸谱以及古琴琵琶二胡笛箫。",
  },
]);

splitDetailPoint("daily-life-language", [
  {
    id: "daily-life-language", title: "传统节日与历法", tabIds: ["festivals"], sourceSections: [14],
    summary: "整理传统节日时间习俗、公历农历、闰月和干支等基础知识。",
    preview: "春节、元宵、清明、端午、中秋、重阳；农历、闰月、干支",
    keywords: ["传统节日", "农历", "闰月", "干支"], aliases: ["节日历法", "民俗节日"],
    indexText: "传统节日与历法包括主要节日的时间习俗以及公历农历闰月和干支。",
  },
  {
    id: "classical-language-allusions", title: "古代称谓与典故", tabIds: ["language"], sourceSections: [14],
    summary: "区分亲属谦敬称，并按含义、对象和语境掌握常见成语典故。",
    preview: "家父令尊、舍弟令郎、寒舍府上；成语对象与谦敬语境",
    keywords: ["古代称谓", "谦辞", "敬辞", "成语典故"], aliases: ["称谓典故", "谦敬辞"],
    indexText: "古代称谓与典故包括亲属谦敬称和成语的含义对象语境与感情色彩。",
  },
]);

splitDetailPoint("sports", [
  {
    id: "sports", title: "球类运动", tabIds: ["ball"], sourceSections: [14],
    summary: "整理足球、篮球、排球及乒乓球、羽毛球、网球的基础规则。",
    preview: "足球11人、篮球5人、排球6人；乒羽网单打双打",
    keywords: ["足球", "篮球", "排球", "球类运动"], aliases: ["三大球", "球类规则"],
    indexText: "球类运动包括足球篮球排球的场上人数和基本规则，以及乒羽网常识。",
  },
  {
    id: "athletics-olympics", title: "田径、游泳与奥运", tabIds: ["olympics"], sourceSections: [14],
    summary: "区分田赛、径赛和游泳基础概念，整理奥林匹克标志与格言。",
    preview: "田赛、径赛、全能；自由泳；奥运五环；更团结",
    keywords: ["田径", "游泳", "奥林匹克", "五环"], aliases: ["田径与奥运", "奥运常识"],
    indexText: "田径游泳与奥运包括田赛径赛、自由泳、奥运五环和奥林匹克格言。",
  },
]);

const section19Sources = {
  "prehistoric-civilization": [1], "legendary-xia-shang": [2],
  "qin-han": [2, 3],
  "three-kingdoms-sui-tang": [4], "five-dynasties-yuan": [5], "ming-qing": [6],
  "late-qing-invasions": [7], "revolution-and-may-fourth": [7],
  "communist-revolution": [8], "land-revolution": [8], "anti-japanese-liberation": [8], "liberation-war": [8], "new-china-reform": [8], "reform-opening-period": [8],
  "ancient-prose": [9], "pre-qin-prose": [9], "qin-han-prose": [9], "tang-song-eight-masters-prose": [9], "pre-qin-poetry": [9], "han-wei-jin-literature": [9], "poetry-decline-lu-you": [10], "yuan-qu": [10], "opera-legend": [10], "book-records": [10],
};

function addEarlyHighlights(block, highlights) {
  const next = { ...block, highlights: block.highlights?.length ? block.highlights : highlights };
  if (block.nodes) {
    next.nodes = block.nodes.map((node) => ({
      ...node,
      highlights: node.highlights?.length ? node.highlights : highlights,
      children: (node.children || []).map((child) => ({
        ...child,
        highlights: child.highlights?.length ? child.highlights : highlights,
      })),
    }));
  }
  return next;
}

Object.entries(section19Sources).forEach(([pointId, sourceSections]) => {
  const point = points.find((item) => item.id === pointId);
  if (!point) return;
  const highlights = (point.keywords || []).slice(0, 8);
  point.sourceSections = sourceSections;
  point.tabs = (point.tabs || []).map((tab) => ({
    ...tab,
    blocks: (tab.blocks || []).map((block) => addEarlyHighlights(block, highlights)),
  }));
});

function replacePointText(pointId, replacements) {
  const point = points.find((item) => item.id === pointId);
  if (!point) return;
  const replaceValue = (value) => {
    if (typeof value === "string") {
      return replacements.reduce((text, [from, to]) => text.split(from).join(to), value);
    }
    if (Array.isArray(value)) return value.map(replaceValue);
    if (value && typeof value === "object") {
      Object.keys(value).forEach((key) => { value[key] = replaceValue(value[key]); });
    }
    return value;
  };
  replaceValue(point);
}

replacePointText("prehistoric-civilization", [
  ["已知最早人类、会用火", "我国境内早期人类代表之一"],
  ["最早人类、会用火", "我国境内早期人类代表之一"],
]);
replacePointText("legendary-xia-shang", [
  ["商汤起兵灭夏，定都亳（今商丘）", "商汤灭夏建立商朝，早期都城为亳；商代曾多次迁都"],
  ["盘庚迁殷：商朝都城第五次迁移", "盘庚迁殷：商朝后期定都于殷"],
]);
replacePointText("western-zhou-spring-autumn", [
  ["春秋五霸：齐桓、宋襄、晋文、秦穆、楚庄", "春秋五霸常见说法之一：齐桓、宋襄、晋文、秦穆、楚庄"],
  ["初税亩：鲁国承认土地私有", "初税亩：鲁国按田亩征税，反映土地制度变化"],
]);
replacePointText("qin-han", [["8年王莽建新", "9年王莽建立新朝"]]);
replacePointText("three-kingdoms-sui-tang", [["外交高频", "中外及民族交往高频"]]);
replacePointText("late-qing-invasions", [["赔2100万", "赔2100万银元"]]);
replacePointText("anti-japanese-liberation", [
  ["平型关首次大捷", "平型关大捷是全国抗战以来中国军队主动对日作战取得的第一次大胜利"],
  ["台儿庄最大胜利", "台儿庄是正面战场取得的一次重大胜利"],
  ["百团大战为共产党独立发动最大最久战役", "百团大战是八路军在华北发动的大规模进攻战役"],
]);
replacePointText("sports", [
  ["按投篮区域计1、2或3分，比赛分节进行", "五人制篮球中，罚球中篮计1分，三分线内、外投篮中篮分别计2分、3分；比赛分节进行"],
  ["隔网对抗，通常每方最多三次击球将球回击过网", "室内排球隔网对抗，每方通常最多三次击球将球回击过网，拦网触球不计入这三次击球"],
]);
replacePointText("new-china-reform", [
  ["1954第一部社会主义宪法", "1954年第一届全国人大通过新中国第一部宪法，属于社会主义类型宪法"],
]);
replacePointText("ancient-prose", [
  ["《山海经》是先秦保存神话最多古籍", "《山海经》的主要内容在战国至汉代逐渐形成，是保存中国古代神话资料丰富的古籍"],
]);
replacePointText("han-wei-jin-literature", [
  ["谢灵运是第一个自觉以山水入诗者", "谢灵运是较早大量创作山水诗、推动山水诗独立发展的代表诗人"],
]);
replacePointText("tang-song-poetry", [["，南宋爱国诗人、小李白", "，南宋爱国诗人"]]);
replacePointText("daily-life-language", [["公历4月5日前后", "公历4月上旬，通常为4月4日至6日"]]);

const newChinaPoint = points.find((point) => point.id === "new-china-reform");
if (newChinaPoint?.tabs?.[0] && !newChinaPoint.tabs[0].blocks.some((block) => block.src === "common-sense/korean-war-battles.png")) {
  newChinaPoint.tabs[0].blocks.push({
    type: "image-note",
    label: "原图速记",
    title: "抗美援朝重要战役",
    src: "common-sense/korean-war-battles.png",
    description: "两水洞、云山、长津湖、上甘岭和金城战役的时间与意义速查。",
  });
}

const tangSongPoint = points.find((point) => point.id === "tang-song-poetry");
if (tangSongPoint) {
  tangSongPoint.title = "唐宋诗歌";
  tangSongPoint.summary = "按诗派、诗人称号、代表作和风格记忆唐代诗歌及南宋陆游。";
  tangSongPoint.keywords = Array.from(new Set([...(tangSongPoint.keywords || []), "宋诗", "陆游"]));
  tangSongPoint.tags = Array.from(new Set([...(tangSongPoint.tags || []), "宋诗"]));
  tangSongPoint.indexText = "唐宋诗歌包括初唐四杰、王孟山水田园、高岑王昌龄边塞、李白杜甫白居易、小李杜及南宋陆游。";
  const firstBlock = tangSongPoint.tabs?.[0]?.blocks?.[0];
  if (firstBlock?.label === "唐诗全章速查") firstBlock.label = "唐宋诗歌速查";
}

require("./note-common-sense-source-restored")(points);
require("./note-common-sense-reading-prototypes")(points);
require("./note-common-sense-fill-highlights")(points);
module.exports = { module: moduleInfo, directory, categories, points };
