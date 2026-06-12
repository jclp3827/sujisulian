const moduleInfo = {
  id: "logic",
  title: "判断推理",
  keywords: "逻辑论证、定义判断、类比推理、图形推理",
  description: "围绕判断推理常见题型、识别信号和选项判断方法整理。",
  status: "ready",
  statusText: "可学习",
};

const categories = [
  { id: "argument", title: "逻辑论证", subtitle: "归因、质疑、支持和解释", status: "ready", pointIds: ["causal-attribution", "general-weaken", "support-assumption", "proportion-argument", "explanation-question"] },
  { id: "formal", title: "推出与分析", subtitle: "翻译推理、真假和匹配", status: "ready", pointIds: ["sufficient-necessary", "proposition-truth", "contradiction-rules", "analytical-reasoning", "truth-tactics"] },
  { id: "definition", title: "定义判断", subtitle: "关键词匹配和限定条件", status: "ready", pointIds: ["definition-keywords", "definition-elimination"] },
  { id: "analogy", title: "类比推理", subtitle: "语义、逻辑和语法关系", status: "ready", pointIds: ["analogy-semantic", "analogy-logical", "analogy-grammar"] },
  { id: "graphic", title: "图形推理", subtitle: "位置、样式、数量和空间", status: "ready", pointIds: ["graphic-overall", "graphic-position-style", "graphic-quantity-attribute", "graphic-spatial"] },
];

const points = [
  {
    id: "causal-attribution",
    categoryId: "argument",
    type: "method",
    title: "归因论证",
    summary: "归因题围绕已发生事实寻找原因，削弱常看因果倒置、另有他因和对比实验变量。",
    preview: "既成事实 + 原因分析，优先看同因异果、异因同果、另有他因",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "signal", title: "识别信号", items: ["题干先给出已经发生的事实，再解释发生原因。", "提问常见“最能削弱解释”“最能质疑研究人员结论”。", "材料出现实验组、对照组、前后时间对比时，优先按对比实验归因处理。"] },
        { type: "compare", label: "归因与普通因果", left: { title: "归因", content: "针对既成事实找原因", items: ["小明考上了，是因为努力", "完成时态更明显"] }, right: { title: "普通因果", content: "讨论一般因果规律", items: ["休息不好会影响发挥", "不一定有已发生事实"] } },
        { type: "rule", title: "削弱与加强", items: ["削弱优先看因果倒置，再看另有他因。", "对比实验削弱可用同因异果、异因同果。", "对比实验加强可用异因异果，补足对照组也常见。", "反对者观点题中，若能证明原原因导致反对者原因，可质疑反对者。"] },
        { type: "tip", variant: "warning", title: "易错提醒", content: "样本量不足、个别案例、话题不一致通常力度弱；正确选项必须贴合题干变量。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "general-weaken",
    categoryId: "argument",
    type: "method",
    title: "一般质疑",
    summary: "一般质疑题不一定是因果模型，核心是找到论据到结论之间的漏洞。",
    preview: "有论据看断点，无论据直接否定结论，严谨命题找矛盾",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "三类结构", items: ["无论据、有结论：直接否定结论。", "有论据、有结论：找范围不一致、论证断点、推理片面。", "严谨逻辑关系：找 A 且非 B、所有与有些不等矛盾结构。"] },
        { type: "formula", label: "最强质疑", content: "A→B 的矛盾 = A 且 非B" },
        { type: "steps", label: "判断步骤", items: ["先圈结论，不被背景信息带走。", "再找论据支持结论时缺了哪座桥。", "选项用“论据成立，但结论不成立”的方式验证。"] },
        { type: "tip", variant: "success", title: "通用原则", content: "主体一致、话题一致、范围一致，是质疑题和支持题共同的第一筛选条件。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "support-assumption",
    categoryId: "argument",
    type: "method",
    title: "支持与前提假设",
    summary: "支持题看能否让论证更成立，前提假设题看缺少它论证是否必然站不住。",
    preview: "支持选“有它更好”，前提选“没它不行”",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "list", label: "常规支持方式", items: ["解释说明", "补充论据", "断点搭桥", "必要条件", "举例或类比弱支持"] },
        { type: "compare", label: "支持与前提", left: { title: "支持", content: "让结论更可信", items: ["有它更好", "可以是补充事实或解释机制"] }, right: { title: "前提假设", content: "论证不可缺少", items: ["没它不行", "常用否定代入检验"] } },
        { type: "rule", title: "前提两大模型", items: ["断点搭桥：连接论据关键词和结论关键词。", "补充漏洞：排除隐藏反例、其他原因或不可行条件。", "能与不能：确认题干方案、行为或条件具备可实现性。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "proportion-argument",
    categoryId: "argument",
    type: "method",
    title: "比例类论证",
    summary: "比例类常见陷阱是只看分子数量或局部比例，忽略整体基数。",
    preview: "只看绝对数量容易错，必须补整体分母",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "核心漏洞", items: ["用患病人数、发生次数等绝对数量直接推出风险高低。", "只给某群体中的比例，却没有给整体人群中的比例。", "只比较分子，不比较分母，结论容易失真。"] },
        { type: "steps", label: "解题步骤", items: ["先判断题干是否只给局部比例或绝对数量。", "找选项中补充整体基数、整体比例的信息。", "比较局部比例与整体比例是否真正异常。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "explanation-question",
    categoryId: "argument",
    type: "method",
    title: "解释说明题",
    summary: "解释题面对看似矛盾的现象，正确选项要同时照顾矛盾双方。",
    preview: "用被忽略的事实解释变化，兼顾两边现象",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "signal", title: "识别信号", items: ["题干出现“最能解释上述现象”“解释矛盾”。", "材料中存在看似不合理、前后不一致或反常的客观事实。", "答案不是支持或削弱结论，而是补充合理背景。"] },
        { type: "rule", title: "判断规则", items: ["正确选项要兼顾矛盾双方，不能只解释一半。", "时间变化题优先找技术、制度、环境、认知变化。", "不要选择只重复题干现象的选项。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "sufficient-necessary",
    categoryId: "formal",
    type: "formula",
    title: "充分必要条件",
    summary: "翻译推理先判断谁是必要条件，必要条件放在箭头后。",
    preview: "谁是必要条件，谁在箭头后",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "formula", label: "核心口诀", content: "充分条件 A → 必要条件 B" },
        { type: "table", label: "常见翻译", columns: ["表达", "翻译"], rows: [["如果 A，那么 B", "A→B"], ["只要 A，就 B", "A→B"], ["只有 A，才 B", "B→A"], ["A 是 B 的基础/前提/关键", "B→A"], ["A 当且仅当 B", "A→B 且 B→A"]] },
        { type: "tip", variant: "warning", title: "易错提醒", content: "“只有 A 才 B”里，A 是必要条件，所以箭头从 B 指向 A。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "proposition-truth",
    categoryId: "formal",
    type: "formula",
    title: "命题真假与逆否",
    summary: "A→B 与非B→非A 等价；否命题和逆命题不能直接推出。",
    preview: "原命题等价于逆否命题",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "table", label: "四种命题", columns: ["命题", "形式"], rows: [["原命题", "A→B"], ["否命题", "非A→非B，无法推出"], ["逆命题", "B→A，无法推出"], ["逆否命题", "非B→非A，与原命题等价"]] },
        { type: "rule", title: "真假口诀", items: ["前件为假，命题为真。", "后件为真，命题为真。", "只有 A 且非B 时，A→B 为假。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "contradiction-rules",
    categoryId: "formal",
    type: "formula",
    title: "矛盾关系",
    summary: "真假推理常用矛盾关系定位突破口，核心是全变原则。",
    preview: "否定命题时，A 变非A，且变或，所有变有些",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "table", label: "高频矛盾", columns: ["原命题", "矛盾命题"], rows: [["A", "非A"], ["A且B", "非A或非B"], ["A或B", "非A且非B"], ["所有A都是B", "有的A不是B"], ["所有A都不是B", "有的A是B"], ["A→B", "A且非B"]] },
        { type: "rule", title: "范畴与模态", items: ["有的 A 是 B，可等价为有的 B 是 A。", "可能的否定是不可能，也就是必然不。", "必然的否定是不必然，也就是可能不。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "analytical-reasoning",
    categoryId: "formal",
    type: "method",
    title: "分析推理",
    summary: "分析类题目包含真假、排序、匹配和组合，核心是找确定条件。",
    preview: "找矛盾、找最大信息、找确定条件、假设验证",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "steps", label: "通用步骤", items: ["先整理对象、属性和限制条件。", "找出现次数最多的信息或最特殊的信息。", "真假限定题优先找矛盾；没有矛盾就假设验证。", "匹配题用表格排除，避免只靠脑记。"] },
        { type: "rule", title: "常见突破口", items: ["一真一假：优先找矛盾关系，锁定真假范围。", "多条件匹配：从最大信息切入。", "排序题：先定端点、相邻、间隔和方向。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "truth-tactics",
    categoryId: "formal",
    type: "method",
    title: "真假推理秒杀",
    summary: "秒杀口诀适合特定题型，必须先确认题型结构再用。",
    preview: "两个有的、两个所有、对半猜、一对一错",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "常见口诀", items: ["两个有的：找点名那句，反着说，人称变所有。", "两个所有：找点名那句，顺着说，人称变所有。", "每人两句话且只对一半：找出现次数最少的信息。", "一人全对、一人全错、一人一对一错：找出现次数最多的信息。"] },
        { type: "tip", variant: "warning", title: "使用边界", content: "秒杀法只适合结构明确的题，不要把口诀当成所有真假推理的通用替代。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "definition-keywords",
    categoryId: "definition",
    type: "method",
    title: "定义判断六要素",
    summary: "定义判断严格按题干定义匹配，不凭生活经验脑补。",
    preview: "主体、客体、方式、目的、原因、结果",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "list", label: "必考关键词", items: ["主体：行为或事件的发起者", "客体：行为或事件的承受对象", "方式：实施行为的手段、形式、途径", "目的：行为想要达成的目标", "原因：触发行为或事件的前提诱因", "结果：行为最终产生的客观状态"] },
        { type: "steps", label: "解题步骤", items: ["先读题干定义，圈出限定词和关键词。", "逐项对照选项，主体不符优先排除。", "多个选项都像时，选择匹配要素最多、最贴合原文的选项。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "definition-elimination",
    categoryId: "definition",
    type: "method",
    title: "定义判断排除法",
    summary: "定义判断常通过限定词、同构选项和专业术语降低干扰。",
    preview: "抠关键词，逐一匹配，择优选择",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "秒杀技巧", items: ["结构和语义高度一致的同构选项，通常不可能只有一个正确。", "“的”字前面的修饰语常是核心限定。", "专业术语不用深究背景，按题干定义字面匹配。", "题干要求“不属于”时，先把属于的选项排掉。"] },
        { type: "tip", variant: "warning", title: "易错提醒", content: "不要因为选项符合常识就选，定义判断只认题干给出的定义边界。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "analogy-semantic",
    categoryId: "analogy",
    type: "method",
    title: "类比语义关系",
    summary: "语义关系看词义本身，包括近义、反义、象征和比喻。",
    preview: "近义、反义、比喻象征",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "常见关系", items: ["近义关系：两个词含义接近。", "反义关系：两个词含义相反。", "比喻象征：一物象征某种品质、身份或场景。"] },
        { type: "tip", variant: "success", title: "判断顺序", content: "类比题先横向看题干两词关系，再纵向检查选项是否严格一致。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "analogy-logical",
    categoryId: "analogy",
    type: "method",
    title: "类比逻辑关系",
    summary: "逻辑关系是类比推理重中之重，要区分并列、包容、交叉和对应。",
    preview: "全同、并列、包容、交叉、对应",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "table", label: "核心关系", columns: ["关系", "判断"], rows: [["全同", "两词完全等价"], ["矛盾并列", "非此即彼，没有第三方"], ["反对并列", "存在第三方"], ["种属", "A 是 B 的一种"], ["组成", "A 是 B 的一部分"], ["交叉", "有的 A 是 B，有的 B 是 A"], ["对应", "材料、功能、属性、时间、因果、场所、主体等对应"]] },
        { type: "tip", variant: "warning", title: "易错提醒", content: "种属和组成最容易混：苹果是水果的一种，但轮胎是汽车的一部分。" },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "analogy-grammar",
    categoryId: "analogy",
    type: "method",
    title: "类比语法关系",
    summary: "语法关系通过造句判断，重点看主谓、动宾、主宾和偏正结构。",
    preview: "造句一致，词性匹配",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "常见结构", items: ["主谓：主体发出动作或具备状态。", "动宾：动作支配对象。", "主宾：主体和客体存在对应。", "偏正：前词修饰后词。"] },
        { type: "steps", label: "解题步骤", items: ["先看题干能否自然造句。", "保持词性和语序一致。", "再检查逻辑关系是否比语法关系更精确。"] },
      ] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "归因拆解", stem: "学校门口早晚高峰堵车，有人认为开车接送孩子是导致拥堵的原因。", analysis: "既成事实是校门口堵车，原因分析是开车接送孩子。若选项说明同期道路施工或公共交通调整导致拥堵，就是另有他因；若说明不接送孩子的学校同样堵车，就是异因同果削弱。" },
        { type: "example", source: "2023联考", label: "另有他因削弱", stem: "脂肪含量过少与死亡风险增高存在关联，研究人员认为脂肪含量过少会增高死亡风险。", options: [
          { key: "A", text: "生活方式不健康人群，脂肪异常均增风险" },
          { key: "B", text: "脂肪过多风险更高" },
          { key: "C", text: "脂肪过少、死亡风险高均由疾病导致" },
          { key: "D", text: "脂肪的益处" }
        ], answer: "C", analysis: "共同原因削弱，疾病是导致脂肪过少和高死亡风险的共同原因，直接切断因果关联。" },
        { type: "example", source: "2021浙江", label: "时间对比实验", stem: "1990年W市70岁以上老人骨折发生率、死亡率均极高，结论：骨折高发导致死亡率上升。", options: [
          { key: "A", text: "1990年W市经历战乱" },
          { key: "B", text: "高龄老人独居" },
          { key: "C", text: "后续十年数据" },
          { key: "D", text: "60-65岁老人数据" }
        ], answer: "A", analysis: "分组正确，战乱是他因，说明死亡率高是因为战乱而不是骨折，直接削弱结论。" },
        { type: "example", source: "示例", label: "四圈支持加强", stem: "小区安装多功能防盗系统后，盗窃案发生率显著下降，结论：防盗系统可降低盗窃率。", options: [
          { key: "A", text: "未安装该系统的小区盗窃案显著增加" },
          { key: "B", text: "其他小区安装后效果不佳" },
          { key: "C", text: "全市加强治安" },
          { key: "D", text: "物业采取其他防盗措施" }
        ], answer: "A", analysis: "异因异果，四圈支持加强，未安装的小区（异因）盗窃案增加（异果），说明防盗系统确实有效。" },
        { type: "example", source: "2022国考", label: "三圈质疑削弱", stem: "H分店投放电梯促销广告后利润增长30%，结论：电梯广告可有效提高企业利润。", options: [
          { key: "A", text: "S分店投放同款电梯广告，利润同比下降10%" },
          { key: "B", text: "广告投入成本高" },
          { key: "C", text: "消费者不喜欢该广告" },
          { key: "D", text: "同类产品销量下降" }
        ], answer: "A", analysis: "同因异果，三圈质疑削弱，同样投放电梯广告（同因），S分店利润反而下降（异果），说明广告与利润增长无关。" }
      ] },

    ],
  },
  {
    id: "graphic-overall",
    categoryId: "graphic",
    type: "method",
    title: "图形推理总思路",
    summary: "图形推理先看整体相似度，再决定优先找位置、样式、数量还是属性。",
    preview: "图形相似看位置样式，图形不同看数量属性",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "compare", label: "入口判断", left: { title: "图形相似", content: "优先位置和样式", items: ["元素形状接近", "变化看移动、旋转、叠加"] }, right: { title: "图形不同", content: "优先数量和属性", items: ["元素差异明显", "变化看点线面角素、对称开闭"] } },
        { type: "steps", label: "观察顺序", items: ["先看整体特征和题型形式。", "再看是否有明显功能元素。", "最后按位置、样式、数量、属性、空间逐类排查。"] }, { type: "tip", variant: "success", title: "专项学习提示", content: "本知识点为图形推理入门框架，更多详细考点、技巧和真题请查看「图形推理」专项模块。" },
      ] },
    ],
  },
  {
    id: "graphic-position-style",
    categoryId: "graphic",
    type: "method",
    title: "位置与样式规律",
    summary: "图形相似时，优先考虑位置变化和样式运算。",
    preview: "平移、旋转、翻转、遍历、加减同异、黑白运算",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "位置规律", items: ["平移关注方向、步数和循环。", "旋转关注角度、顺逆时针和中心。", "翻转关注左右翻、上下翻和镜像关系。"] },
        { type: "rule", title: "样式规律", items: ["遍历：元素种类在行列中完整出现。", "加减同异：图形叠加后保留或去除相同部分。", "黑白运算：按黑白叠加规则得到结果图。"] }, { type: "tip", variant: "success", title: "专项学习提示", content: "本知识点为位置样式规律入门基础，更多详细考点、技巧和真题请查看「图形推理」专项模块的「位置分析」分类。" },
      ] },
    ],
  },
  {
    id: "graphic-quantity-attribute",
    categoryId: "graphic",
    type: "method",
    title: "数量与属性规律",
    summary: "图形差异较大时，重点查数量规律和图形属性。",
    preview: "点、线、面、角、素、笔画数；对称、曲直、开闭",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "list", label: "数量规律", items: ["点：交点、端点、切点", "线：直线、曲线、线段数", "面：封闭区域数", "角：锐角、直角、角总数", "素：元素种类和个数", "笔画数：奇点数除以 2"] },
        { type: "list", label: "属性规律", items: ["对称性：轴对称、中心对称、对称轴方向和数量", "曲直性：全直、全曲、曲直混合", "开闭性：开放图形、封闭图形"] }, { type: "tip", variant: "success", title: "专项学习提示", content: "本知识点为数量属性规律入门基础，更多详细考点、技巧和真题请查看「图形推理」专项模块的「定量分析」分类。" },
      ] },
    ],
  },
  {
    id: "graphic-spatial",
    categoryId: "graphic",
    type: "method",
    title: "空间类图形",
    summary: "空间类题目不只看平面形状，还要关注相邻、相对和立体可行性。",
    preview: "空间重构、三视图、截面图、立体拼接",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "常见题型", items: ["空间重构：判断展开图能否折成立体。", "三视图：正视、侧视、俯视互相对应。", "截面图：关注截面能否经过对应棱面。", "立体拼接：看体块数量、凹凸和相邻关系。"] },
        { type: "tip", variant: "warning", title: "易错提醒", content: "空间重构不要只看图案方向，还要检查面与面是否相邻或相对。" }, { type: "tip", variant: "success", title: "专项学习提示", content: "本知识点为空间类图形入门基础，更多详细考点、技巧和真题请查看「图形推理」专项模块的「立体图形」分类。" },
      ] },
    ],
  },
];

module.exports = {
  module: moduleInfo,
  categories,
  points,
};
