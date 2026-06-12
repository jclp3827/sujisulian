const moduleInfo = {
  id: "verbal",
  title: "言语理解",
  keywords: "片段阅读、逻辑填空、语句排序",
  description: "围绕言语理解常见题型、文段结构、选项陷阱和词语辨析整理。",
  status: "ready",
  statusText: "可学习",
};

const categories = [
  { id: "main-idea", title: "中心理解", subtitle: "结构、关键信息和选项分析", status: "ready", pointIds: ["passage-structure", "passage-key-info", "option-analysis", "title-writing", "next-paragraph"] },
  { id: "sentence", title: "语句表达", subtitle: "语句填入和语句排序", status: "ready", pointIds: ["sentence-insertion", "sentence-ordering"] },
  { id: "detail", title: "细节判断", subtitle: "选项验证和常见偷换", status: "ready", pointIds: ["detail-judgement"] },
  { id: "cloze", title: "逻辑填空", subtitle: "词语辨析、逻辑对应和语境把握", status: "ready", pointIds: ["word-discrimination", "logic-correspondence", "context-control"] },
  { id: "vocabulary", title: "词语积累", subtitle: "实词、搭配和易错成语", status: "ready", pointIds: ["common-content-words", "collocation-habits", "idiom-literal-trap", "idiom-honorific", "idiom-specific-object"] },
];

const points = [
  {
    id: "passage-structure",
    categoryId: "main-idea",
    type: "method",
    title: "中心理解结构分析",
    summary: "中心理解题先判断文段结构，重点通常落在观点句、对策句或总句。",
    preview: "前对策、后对策、总分、并列、二层结构",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "list", label: "话题引出方式", items: ["开门见山：首句直接确定谈论重点", "背景引出：背景本身不重要，重点看后文", "对比引出：紧跟观点或对策", "转折引出：转折后常是重点", "设问引出：重点看后续回答"] },
        { type: "rule", title: "常见对策信号", items: ["祈使句：应当、需要、要。", "禁止性对策：不能、不可、如果这样就不行。", "必要条件：关键、基础、前提、离不开、必不可少。", "关联词：只有才、必须否则、要就。", "语义对策：时代命题、重要议题、必经之路、必然趋势、有助于。"] },
        { type: "table", label: "五种结构", columns: ["结构", "重点"], rows: [["前对策", "开头直接出观点或对策"], ["后对策", "分析说明后给出观点或对策"], ["总分/分总", "总句是重点，分句负责解释"], ["并列/大并列", "全面概括多个并列方面"], ["二层结构", "转折、因果、对比、设问回答中找重点层"]] },
        { type: "tip", variant: "warning", title: "易错提醒", content: "背景、例子和解释说明常是服务重点的材料，不要把它们当成主旨。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "结构判断", stem: "文段先介绍某问题的背景，随后出现“因此，应当优先……”并展开说明。", analysis: "这是后对策或分析后出对策结构，重点应落在“应当优先”的对策句，而不是前面的背景材料。" },
      ] },
    ],
  },
  {
    id: "passage-key-info",
    categoryId: "main-idea",
    type: "method",
    title: "中心理解关键信息",
    summary: "首句、主体和高频词能帮助快速锁定文段范围，避免选项跑偏。",
    preview: "重视首句、主体、高频词和观点句",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "首句作用", items: ["首句常确定谈话范围。", "首句主语经常是文段主体。", "首句如果是背景，要继续寻找后文观点或对策。"] },
        { type: "rule", title: "主体判断", items: ["全文反复描述的对象是主体。", "主旨句中的主语优先级最高。", "选项偷换主体时，即使表述正确也不选。"] },
        { type: "rule", title: "高频词判断", items: ["反复出现的核心词通常不能丢。", "观点句、对策句中的关键词优先保留。", "高频词只提示范围，最终仍要回到结构和重点句。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "主体锁定", stem: "文段首句提出“传统文化需要走近当代生活”，后文围绕文物活化、数字传播和年轻表达展开。", analysis: "主体是传统文化，重点是与当代生活连接。选项如果转成单讲“数字技术发展”，即使文中提到，也属于偷换主体。" },
      ] },
    ],
  },
  {
    id: "option-analysis",
    categoryId: "main-idea",
    type: "method",
    title: "中心理解选项分析",
    summary: "主旨题错误选项常见于出处错误、片面、杂揉、绝对化和无中生有。",
    preview: "先排错，再比较概括程度和主体一致性",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "list", label: "常见错误选项", items: ["出处有误：来自背景、例子、分析论证，不是重点", "片面：并列结构只说其中一方面", "杂揉：把不同句子的词拼在一起", "绝对化：原文未强调最高级或必要条件", "下定义：中性介绍，不适合说理类主旨", "无中生有：关键信息原文未提及", "本身有误：逻辑错误或不符合主流价值判断"] },
        { type: "list", label: "特殊选项", items: ["原因类：如果文段大篇幅解释原因，原因可成为重点", "具体类：可归纳出具体小点时，具体选项可能正确", "历程类：清晰时间轴可概括过程", "区别比较联系类：双主体篇幅相当时要兼顾"] },
        { type: "tip", variant: "success", title: "验证技巧", content: "两个选项纠结时，看能否由选项反推出原文结构；“A 且 B”类选项常更全面。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "片面选项", stem: "文段并列介绍北极、太空、网络三个新领域的竞争变化。某选项只概括“太空竞争加剧”。", analysis: "并列结构要全面概括。只说太空属于片面选项，即使内容来自原文，也不能作为主旨。" },
      ] },
    ],
  },
  {
    id: "title-writing",
    categoryId: "main-idea",
    type: "method",
    title: "标题拟定",
    summary: "标题拟定是主旨题的标题化表达，既要概括重点，也要有可读性。",
    preview: "关键词、主体、观点、对策、可读性",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "正确标题要求", items: ["包含文段关键词，可适当同义替换。", "主语正确，不能偷换主体。", "体现作者观点或对策。", "标题有可读性和概括力。", "对策类标题要有力量，不要只做中性介绍。"] },
        { type: "tip", variant: "success", title: "高频信号", content: "带双引号、比喻化且准确包含关键词的选项，正确概率较高。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "标题化", stem: "文段围绕种质资源保护，强调好种子对农业和农民增收的重要性。", analysis: "标题要保留“种子”这一关键词。若选项用“农业芯片”作比喻且能对应种子价值，通常比平淡描述更适合。" },
      ] },
    ],
  },
  {
    id: "next-paragraph",
    categoryId: "main-idea",
    type: "method",
    title: "下文推断",
    summary: "下文推断要把文段和下文看作整体，重点关注尾句话题和行文结构。",
    preview: "尾句话题决定下文方向",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "steps", label: "解题步骤", items: ["先看尾句提出了什么话题。", "判断尾句是现象、问题、原因还是新方法。", "下文通常承接尾句，不会跳回前文旧话题。", "套入常见说理结构：现象后讲原因，问题后讲对策，旧方法后讲新方法。"] },
        { type: "tip", variant: "warning", title: "易错提醒", content: "选项如果讨论全文主旨但没有承接尾句，一般不是下文推断的答案。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "承接尾句", stem: "文段最后说“近年来人才逐渐向二三线城市下沉的迹象日益明显”。", analysis: "下文最可能解释人才下沉的原因或表现，而不是回到前文继续谈一线城市优势。下文推断优先承接尾句话题。" },
      ] },
    ],
  },
  {
    id: "sentence-insertion",
    categoryId: "sentence",
    type: "method",
    title: "语句填入",
    summary: "语句填入既看宏观行文逻辑，也看前后句的语法和指代衔接。",
    preview: "宏观结构 + 细节衔接 + 位置作用",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "宏观把握", items: ["填入句应符合全文行文逻辑，如对比、转折、因果。", "衔接句要承上启下。", "总结概括句要覆盖前文重点。"] },
        { type: "rule", title: "细节把握", items: ["前后句关系要正确。", "语法结构要通顺。", "逻辑关联词运用要得当。", "主语尽量一致，后文指示代词要能找到指代对象。"] },
        { type: "table", label: "位置作用", columns: ["位置", "作用"], rows: [["开头", "总起或概括"], ["中间", "前对策、提出问题、承上启下"], ["结尾", "总结或对策"]] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "句式衔接", stem: "前文说“接种的社区成员越多”，横线后需要表达疾病传播风险的变化。", analysis: "应匹配“越……越……”句式，并体现接种越多，越能避免疾病爆发。" },
      ] },
    ],
  },
  {
    id: "sentence-ordering",
    categoryId: "sentence",
    type: "method",
    title: "语句排序",
    summary: "语句排序先找首句和组合，再用结构验证整体顺序。",
    preview: "看首句、找组合、套结构",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "steps", label: "解题步骤", items: ["先排首句：下定义、引话题常作首句，总结和对策多在尾句。", "再找组合：转折、指代、相同词、时间顺序、因果关系。", "最后套结构：前对策、后对策、总分、并列、转折对比。"] },
        { type: "rule", title: "组合信号", items: ["指示代词要有前文指代对象。", "转折词前后语义应形成反差。", "重复关键词常提示句群连续。", "“为此”“因此”“只有这样”通常不能放首句。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "首句判断", stem: "句子③说“元宇宙是指超越现实的虚拟世界”，句子②说“何谓元宇宙是必须首先弄清的问题”。", analysis: "下定义句通常适合放在问题提出之后或作为开篇解释。若②先提出问题，③紧接定义，二者可形成稳定组合。" },
      ] },
    ],
  },
  {
    id: "detail-judgement",
    categoryId: "detail",
    type: "method",
    title: "细节判断",
    summary: "细节题没有万能结构，关键是逐项验证选项和原文是否一致。",
    preview: "偷换概念、语气、逻辑、数量、时态",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "难题特点", items: ["逻辑性强，选项会深挖坑。", "正确选项可能也不完美，要抓其他选项的致命错误。", "选项常用同义替换，不一定逐字对应原文。"] },
        { type: "list", label: "常见错误", items: ["偷换概念", "偷换语气", "偷换逻辑", "偷换数量", "混淆时态", "杂揉", "本身有误", "绝对化", "无中生有"] },
        { type: "steps", label: "解题步骤", items: ["先定位选项对应原文位置。", "再比较主体、范围、程度、时态和因果。", "遇到多个选项有瑕疵时，优先排除致命错误。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "偷换时态", stem: "原文说“该系统未来有望实现分钟级连续观测”。选项说“该系统已经实现分钟级连续观测”。", analysis: "“有望实现”被偷换成“已经实现”，属于时态和确定性偷换。细节题要逐项核对程度与时态。" },
      ] },
    ],
  },
  {
    id: "word-discrimination",
    categoryId: "cloze",
    type: "method",
    title: "逻辑填空词语辨析",
    summary: "逻辑填空先分辨易混词差异，再回到语境检查感情色彩和搭配。",
    preview: "词义差异、感情色彩、语义轻重、固定搭配",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "辨析维度", items: ["词义侧重点是否不同。", "感情色彩是褒义、贬义还是中性。", "语义轻重是否匹配文段程度。", "搭配对象是否固定。", "语体色彩是否正式。"] },
        { type: "steps", label: "解题步骤", items: ["先读完整语境，不急着看选项。", "根据提示词判断空格需要的语义方向。", "比较近义词差别，排除搭配不当和色彩不合。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "感情色彩", stem: "商家过度包装背后绕不开趋利避害心理，空格修饰礼盒包装。", analysis: "语境带贬义，应选带有虚浮、不实意味的词，如“华而不实”一类。" },
      ] },
    ],
  },
  {
    id: "logic-correspondence",
    categoryId: "cloze",
    type: "method",
    title: "逻辑填空逻辑对应",
    summary: "逻辑对应不是简单字面重复，而是让词语和上下文逻辑关系合情合理。",
    preview: "找提示词、找对应对象、找语义方向",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "对应类型", items: ["解释对应：后文解释空格含义。", "反义对应：转折前后语义相反。", "并列对应：多个空格语义方向一致。", "递进对应：后一个词程度更深。", "因果对应：原因和结果语义相连。"] },
        { type: "tip", variant: "warning", title: "易错提醒", content: "看到原文有同字或近字，不代表一定正确；必须满足语境逻辑。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "信息破碎", stem: "古人留下的信息总是____，我们需要想象力来弥合认知缝隙，获得完整图像。", analysis: "后文“弥合缝隙、完整图像”提示前文信息不完整，选择“支离破碎”方向。" },
      ] },
    ],
  },
  {
    id: "context-control",
    categoryId: "cloze",
    type: "method",
    title: "逻辑填空宏观把握",
    summary: "宏观语境决定词语的整体方向，尤其要看文段态度、场景和语义轻重。",
    preview: "先定语境，再定词义",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "宏观判断", items: ["看文段整体态度：肯定、否定、客观说明。", "看场景领域：科技、治理、文化、经济等。", "看语义轻重：轻微、严重、彻底、逐步。", "看前后比喻或成语是否和语境匹配。"] },
        { type: "tip", variant: "success", title: "做题顺序", content: "先用语境排除明显不合的词，再比较剩余选项的细微差别。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "宏观语境", stem: "文段说科技手段让疫情传播链条更清晰，把“大海捞针”变为____。", analysis: "语境强调按线索准确寻找，适合“按图索骥”。不能只看“寻找”字面，还要匹配“有线索可循”的整体语境。" },
      ] },
    ],
  },
  {
    id: "common-content-words",
    categoryId: "vocabulary",
    type: "quick-check",
    title: "常考实词辨析",
    summary: "常考实词重在固定差别，适合用小对照表积累。",
    preview: "必须/必需，不利/不力，施行/实行，试验/实验",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "table", label: "高频辨析", columns: ["易混词", "区别"], rows: [["必须 / 必需", "主观要求用必须，客观需要用必需"], ["不利 / 不力", "无益不顺用不利，没有尽力用不力"], ["不耻 / 不齿", "不以为耻用不耻，不愿提及用不齿"], ["处世 / 处事", "人事交往用处世，处理事务用处事"], ["施行 / 实行", "法规生效用施行，付诸行动用实行"], ["试验 / 实验", "察看性能用试验，验证理论用实验"], ["收集 / 搜集", "聚集事物用收集，四处找寻用搜集"], ["推脱 / 推托", "推卸责任用推脱，借故拒绝用推托"]] },
        { type: "tip", variant: "success", title: "积累方法", content: "实词不要孤立背，最好连同典型搭配一起记。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "必须与必需", stem: "推进依法行政，党员干部____严格遵守法定程序。", analysis: "这里强调主观要求和制度要求，应填“必须”。如果说“生活____品”，强调客观需要，则用“必需”。" },
      ] },
    ],
  },
  {
    id: "collocation-habits",
    categoryId: "vocabulary",
    type: "quick-check",
    title: "近义词习惯搭配",
    summary: "很多逻辑填空不是词义难，而是搭配对象固定。",
    preview: "废除制度，废黜王位；改进方法，改善条件",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "table", label: "固定搭配", columns: ["词语", "常见对象"], rows: [["废除", "法令、制度、条约"], ["废黜", "王位、特权"], ["改进", "工作、方法、技术"], ["改善", "关系、条件、生活"], ["弥补", "缺陷、损失、弱点"], ["填补", "空缺、亏空、缺额"], ["继承", "传统、遗志、财产"], ["秉承", "理念、宗旨、原则"], ["履行", "承诺、职责、条约"], ["执行", "任务、计划、命令"]] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "搭配对象", stem: "要进一步____营商环境，激发市场主体活力。", analysis: "“环境、条件、生活”常搭配“改善”，这里应选“改善营商环境”。“改进”更常搭配方法、技术、工作。" },
      ] },
    ],
  },
  {
    id: "idiom-literal-trap",
    categoryId: "vocabulary",
    type: "quick-check",
    title: "望文生义成语",
    summary: "望文生义类成语不能按字面理解，要记真实含义和常见误用。",
    preview: "空穴来风、三人成虎、文不加点、万人空巷",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "table", label: "易错成语", columns: ["成语", "正确含义"], rows: [["空穴来风", "传闻有一定根据"], ["三人成虎", "谣言传多了会让人相信"], ["溢美之词", "过分赞美的言词，偏贬义"], ["望其项背", "赶得上，常搭配否定"], ["文不加点", "文思敏捷，写作技巧纯熟"], ["汗牛充栋", "藏书非常多"], ["万人空巷", "庆祝或欢迎的盛况"], ["登堂入室", "学问技能由浅入深达到高水平"]] },
        { type: "tip", variant: "warning", title: "易错提醒", content: "成语字面看起来越熟，越要警惕真实含义和适用对象。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "文不加点", stem: "他写文章一气呵成，____，很快完成初稿。", analysis: "“文不加点”不是没有标点，而是文章写得快且好，不用涂改。这里和“一气呵成”语境匹配。" },
      ] },
    ],
  },
  {
    id: "idiom-honorific",
    categoryId: "vocabulary",
    type: "quick-check",
    title: "敬谦误用成语",
    summary: "敬辞谦辞必须看说话对象和动作方向，不能随意互换。",
    preview: "鼎力相助、蓬荜生辉、抛砖引玉、不吝赐教",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "table", label: "敬谦辨析", columns: ["成语", "用法"], rows: [["鼎力相助", "敬辞，用于对方帮助自己"], ["蓬荜生辉", "谦辞，用于自己家因客人到来而荣耀"], ["抛砖引玉", "谦辞，用于自己的意见引出高见"], ["不吝赐教", "敬辞，请别人指教自己"], ["敬谢不敏", "谦辞，自己推辞做某事"], ["敝帚自珍", "谦辞，自己珍视自己的东西"], ["绵薄之力", "谦辞，自己的微薄能力"]] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "敬辞方向", stem: "感谢贵单位在项目推进中____，使我们顺利完成任务。", analysis: "感谢对方帮助自己，应使用敬辞“鼎力相助”。不能说自己对别人“鼎力相助”。" },
      ] },
    ],
  },
  {
    id: "idiom-specific-object",
    categoryId: "vocabulary",
    type: "quick-check",
    title: "特定对象成语",
    summary: "部分成语只能用于特定对象，错用对象就是典型病句陷阱。",
    preview: "美轮美奂用于房屋装饰，破镜重圆用于夫妻",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "table", label: "对象限制", columns: ["成语", "特定对象"], rows: [["叹为观止", "美好事物"], ["凤毛麟角", "珍贵的人或事物"], ["耳提面命", "长辈对晚辈的教导"], ["擢发难数", "罪恶很多"], ["破镜重圆", "夫妻关系恢复"], ["美轮美奂", "房屋或装饰"], ["良莠不齐", "人的品质"], ["汗牛充栋", "书籍很多"], ["萍水相逢", "陌生人偶然相遇"], ["比翼齐飞 / 举案齐眉 / 劳燕分飞", "夫妻"]] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "对象限制", stem: "这座新建展馆外观庄重，内部装饰____。", analysis: "“美轮美奂”适用于房屋或装饰，放在这里合适。若用来形容文章、表演或普通物品，就容易对象误用。" },
      ] },
    ],
  },
];

module.exports = {
  module: moduleInfo,
  categories,
  points,
};
