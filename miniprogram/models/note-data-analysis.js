const moduleInfo = {
  id: "data-analysis",
  title: "资料分析",
  keywords: "增长、比重、分数、速算",
  description: "围绕资料分析常见公式、比较方法和速算技巧整理。",
  status: "ready",
  statusText: "可学习",
};

const categories = [
  {
    id: "basic",
    title: "基础知识",
    subtitle: "术语、读题和常见表达",
    status: "ready",
    pointIds: ["period-terms", "reading-units", "statistics-terms"],
  },
  {
    id: "speed-calc",
    title: "速算技巧",
    subtitle: "百分化、估算和化简",
    status: "ready",
    pointIds: ["percent-transform", "quick-arithmetic", "division-estimation", "share-415", "assumption-allocation"],
  },
  {
    id: "growth",
    title: "增长类",
    subtitle: "基期、增长量、增长率",
    status: "ready",
    pointIds: ["base-period", "growth-rate", "growth-amount", "abrx-system", "increment-compare", "interval-growth", "interval-growth-reverse"],
  },
  {
    id: "ratio",
    title: "比重类",
    subtitle: "现期比重、基期比重和比重变化",
    status: "ready",
    pointIds: ["current-ratio", "base-ratio", "ratio-change", "ratio-trend", "ratio-difference"],
  },
  {
    id: "mixture",
    title: "盐水混合类",
    subtitle: "十字交叉、增速混合和人均混合",
    status: "ready",
    pointIds: ["mixture-cross"],
  },
  {
    id: "average",
    title: "平均数类",
    subtitle: "平均数、年平均量和平均数变化",
    status: "ready",
    pointIds: ["annual-average", "average-denominator"],
  },
  {
    id: "compare",
    title: "比较类",
    subtitle: "分数比较、基期比较和综合比较",
    status: "ready",
    pointIds: ["fraction-compare", "base-compare", "chart-lookup"],
  },
  {
    id: "special",
    title: "特殊考点",
    subtitle: "隔期、混合、百分点和易错表达",
    status: "ready",
    pointIds: ["mixed-growth", "annual-growth-rate", "multiple-growth", "percentage-point", "pulling-contribution", "data-inclusion"],
  },
];

const formulaNodes = {
  basePeriod: [
    { type: "text", value: "基期量" },
    { type: "op", value: "=" },
    { type: "frac", num: "现期量", den: "1 + 增长率" },
  ],
  growthAmount: [
    { type: "text", value: "增长量" },
    { type: "op", value: "=" },
    { type: "text", value: "现期量" },
    { type: "op", value: "-" },
    { type: "text", value: "基期量" },
  ],
  growthAmountVariant: [
    { type: "text", value: "增长量" },
    { type: "op", value: "=" },
    { type: "text", value: "现期量" },
    { type: "op", value: "×" },
    { type: "frac", num: "增长率", den: "1 + 增长率" },
  ],
  growthRate: [
    { type: "text", value: "增长率" },
    { type: "op", value: "=" },
    { type: "frac", num: "增长量", den: "基期量" },
    { type: "op", value: "=" },
    { type: "frac", num: "现期量 - 基期量", den: "基期量" },
  ],
  incrementCompare: [
    { type: "text", value: "增长量" },
    { type: "op", value: "≈" },
    { type: "text", value: "A" },
    { type: "op", value: "×" },
    { type: "frac", num: "r", den: "1 + r" },
  ],
  intervalGrowth: [
    { type: "text", value: "间隔增长率" },
    { type: "op", value: "=" },
    { type: "text", value: "r1" },
    { type: "op", value: "+" },
    { type: "text", value: "r2" },
    { type: "op", value: "+" },
    { type: "text", value: "r1 × r2" },
  ],
  intervalGrowthReverse: [
    { type: "text", value: "未知单期增长率" },
    { type: "op", value: "=" },
    { type: "frac", num: "间隔增长率 - 已知单期增长率", den: "1 + 已知单期增长率" },
  ],
  currentRatio: [
    { type: "text", value: "现期比重" },
    { type: "op", value: "=" },
    { type: "frac", num: "部分现期量", den: "整体现期量" },
  ],
  baseRatio: [
    { type: "text", value: "基期比重" },
    { type: "op", value: "=" },
    { type: "frac", num: "部分现期量", den: "整体现期量" },
    { type: "op", value: "×" },
    { type: "frac", num: "1 + 整体增长率", den: "1 + 部分增长率" },
  ],
  ratioChange: [
    { type: "text", value: "比重变化量" },
    { type: "op", value: "=" },
    { type: "text", value: "现期比重" },
    { type: "op", value: "-" },
    { type: "text", value: "基期比重" },
  ],
  annualGrowthRate: [
    { type: "text", value: "末期量" },
    { type: "op", value: "=" },
    { type: "text", value: "初期量" },
    { type: "op", value: "×" },
    { type: "text", value: "(1 + r)^n" },
  ],
  annualAverage: [
    { type: "text", value: "年平均量" },
    { type: "op", value: "=" },
    { type: "frac", num: "多年总量", den: "年数" },
  ],
  annualGrowthAmount: [
    { type: "text", value: "年均增长量" },
    { type: "op", value: "=" },
    { type: "frac", num: "末期量 - 初期量", den: "间隔年数" },
  ],
  abrx: [
    { type: "text", value: "A" },
    { type: "op", value: "=" },
    { type: "frac", num: "B", den: "1 + R" },
    { type: "op", value: "；" },
    { type: "text", value: "B = A + X" },
    { type: "op", value: "；" },
    { type: "text", value: "X = A × R" },
  ],
  abrxProduct: [
    { type: "text", value: "R_A" },
    { type: "op", value: "=" },
    { type: "text", value: "R_B + R_C + R_B × R_C" },
  ],
  abrxRatio: [
    { type: "text", value: "R_A" },
    { type: "op", value: "=" },
    { type: "frac", num: "R_b - R_c", den: "1 + R_c" },
  ],
  pullingGrowth: [
    { type: "text", value: "拉动增长率" },
    { type: "op", value: "=" },
    { type: "frac", num: "部分增量", den: "整体基期" },
  ],
  contributionRate: [
    { type: "text", value: "增量贡献率" },
    { type: "op", value: "=" },
    { type: "frac", num: "部分增量", den: "整体增量" },
  ],
};

const points = [
  {
    id: "period-terms",
    categoryId: "basic",
    type: "method",
    title: "现期与基期",
    summary: "资料分析所有增长题的第一步，是分清题目问当前时期还是上一时期。",
    preview: "现期是材料当前时间，基期是对比时间",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          {
            type: "compare",
            label: "核心概念",
            left: {
              title: "现期",
              content: "材料正在描述的当前时期",
              items: ["如 2024 年、今年、本月", "通常直接在材料中给出"],
            },
            right: {
              title: "基期",
              content: "用来比较的上一时期",
              items: ["如 2023 年、去年、上月", "常需要通过公式反推"],
            },
          },
          {
            type: "signal",
            title: "识别信号",
            items: [
              "看到“同比”“比上年”时，基期通常是上一年同期。",
              "看到“环比”“比上月/上季度”时，基期通常是上一个连续周期。",
              "看到“较 2020 年”时，2020 年就是基期，不一定是上一年。",
            ],
          },
          {
            type: "rule",
            title: "读题顺序",
            items: [
              "先圈时间：题干问哪一年、哪一月、哪一期。",
              "再圈对象：问总量、部分量、增长量还是比重。",
              "最后圈口径：单位、范围、同比/环比是否一致。",
            ],
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "不要看到“增长”就直接套公式，先判断题目要的是现期、基期、增长量还是增长率。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "材料：2024 年某市收入为 120 亿元，同比增长 20%。问 2023 年收入。",
            analysis: "2024 年是现期，2023 年是基期。题目问基期量，应使用 120 / (1 + 20%)。",
          },
        ],
      },
    ],
  },
  {
    id: "reading-units",
    categoryId: "basic",
    type: "method",
    title: "单位与口径",
    summary: "计算前先统一单位和统计口径，能避免大量低级失误。",
    preview: "先统一单位，再进入公式计算",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          {
            type: "rule",
            title: "检查清单",
            items: [
              "单位是否一致：亿元、万元、万人、吨、万吨不能混用。",
              "时间是否一致：全年、上半年、某季度、某月不能直接相加比较。",
              "范围是否一致：全国、某省、某行业、其中某类别要分清整体与部分。",
              "问法是否一致：百分数、百分点、倍数、增长量不是同一种答案。",
            ],
          },
          {
            type: "table",
            label: "常见单位换算",
            columns: ["表达", "换算"],
            rows: [
              ["1 亿", "10000 万"],
              ["1 万", "10000"],
              ["1 个百分点", "两个百分数相差 1%"],
              ["增长 1 倍", "现期是基期的 2 倍"],
            ],
          },
          {
            type: "compare",
            label: "易混表达",
            left: {
              title: "百分数",
              content: "表示比例",
              items: ["例如增长率为 12%", "可以参与乘除"],
            },
            right: {
              title: "百分点",
              content: "表示两个百分数的差",
              items: ["12% 到 15% 是提高 3 个百分点", "不能说提高 3%"],
            },
          },
          { type: "tip", variant: "success", title: "快速判断", content: "题干给出多个单位时，先把较大的单位转成较小单位，通常更方便整数计算。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "A 收入为 3.2 亿元，B 收入为 45000 万元，比较两者大小。",
            analysis: "3.2 亿元 = 32000 万元，B 为 45000 万元，所以 B 更大。",
          },
        ],
      },
    ],
  },
  {
    id: "base-period",
    categoryId: "growth",
    type: "formula",
    title: "基期量",
    summary: "看到“同比增长 x%”并要求上一期数值时使用。",
    preview: "基期量 = 现期量 / (1 + 增长率)",
    relatedTraining: {
      sectionId: "data-analysis",
      itemId: "growth-pre",
      title: "估算前期量",
    },
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心公式", content: "基期量 = 现期量 / (1 + 增长率)", nodes: formulaNodes.basePeriod },
          {
            type: "steps",
            label: "解题步骤",
            items: [
              "先判断题目给的是现期量还是基期量。",
              "把增长率转成小数或分数。",
              "代入 现期量 / (1 + 增长率)，再结合选项估算。",
            ],
          },
          { type: "tip", variant: "success", title: "快速判断", content: "增长率为正，基期小于现期；增长率为负，基期大于现期。" },
          { type: "tip", variant: "warning", title: "易错提醒", content: "增长率为负时分母小于 1，不要机械判断基期一定更小。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某地区 2024 年产量为 120 万吨，同比增长 20%，求 2023 年产量。",
            analysis: "2023 年为基期，120 / (1 + 20%) = 120 / 1.2 = 100 万吨。",
          },
          {
            type: "example",
            source: "2020 下半年四川",
            label: "真题示例",
            stem: "2015 年城镇居民人均可支配收入 31195 元，比上年增长 8.2%，求 2014 年的数值约为多少。",
            options: [
              { key: "A", text: "2.4 万" },
              { key: "B", text: "2.6 万" },
              { key: "C", text: "2.8 万" },
              { key: "D", text: "3.0 万" },
            ],
            answer: "C",
            analysis: "基期 = 31195 / (1 + 8.2%) ≈ 31195 / 1.082 ≈ 28830 ≈ 2.88 万元，最接近 2.8 万。",
          },
        ],
      },
      {
        id: "practice",
        title: "相关练习",
        blocks: [
          { type: "practice", title: "估算前期量", description: "围绕基期量公式做专项练习，巩固快速估算。" },
        ],
      },
    ],
  },
  {
    id: "growth-amount",
    categoryId: "growth",
    type: "formula",
    title: "增长量",
    summary: "题干问“增长了多少”“增加量”时优先定位。",
    preview: "增长量 = 现期量 - 基期量",
    relatedTraining: {
      sectionId: "data-analysis",
      itemId: "growth-inc",
      title: "估算增长量",
    },
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心公式", content: "增长量 = 现期量 - 基期量", nodes: formulaNodes.growthAmount },
          { type: "formula", label: "常用变形", content: "增长量 = 现期量 × 增长率 / (1 + 增长率)", nodes: formulaNodes.growthAmountVariant },
          {
            type: "steps",
            label: "解题步骤",
            items: [
              "如果基期量已知，直接用现期量减基期量。",
              "如果只给现期量和增长率，用 现期量 × 增长率 / (1 + 增长率)。",
              "选项差距大时先估算，避免长除法。",
            ],
          },
          { type: "tip", variant: "success", title: "快速判断", content: "增长率较小时，可先用 现期量 × 增长率 快速近似。" },
          { type: "tip", variant: "warning", title: "易错提醒", content: "注意单位和正负，下降时增长量为负，题目常改问“减少量”。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某项收入现期为 550 亿元，同比增长 10%，求同比增长量。",
            analysis: "增长量 = 550 × 10% / 1.1 = 50 亿元。",
          },
          {
            type: "example",
            source: "2019 联考",
            label: "真题示例",
            stem: "2018 年某省高新技术产品出口额 827.4 亿元，同比增长 5.2%，求同比增长量。",
            options: [
              { key: "A", text: "38.6 亿元" },
              { key: "B", text: "40.9 亿元" },
              { key: "C", text: "43.0 亿元" },
              { key: "D", text: "48.2 亿元" }],
            answer: "B",
            analysis: "增长量 = 827.4 × 5.2% / (1 + 5.2%) ≈ 827.4 × 0.052 / 1.052 ≈ 43.0 / 1.052 ≈ 40.9 亿元。",
          },
        ],
      },
      {
        id: "practice",
        title: "相关练习",
        blocks: [
          { type: "practice", title: "估算增长量", description: "练习现期量、增长率与增长量之间的转换。" },
        ],
      },
    ],
  },
  {
    id: "growth-rate",
    categoryId: "growth",
    type: "formula",
    title: "增长率",
    summary: "题干问“增长百分之几”“增速”时使用，核心是先找增长量和基期量。",
    preview: "增长率 = 增长量 / 基期量",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心公式", content: "增长率 = 增长量 / 基期量 = (现期量 - 基期量) / 基期量", nodes: formulaNodes.growthRate },
          {
            type: "signal",
            title: "识别信号",
            items: [
              "问法出现“增长百分之几”“下降百分之几”“增速为多少”。",
              "材料同时给出现期量和基期量，或能先求出增长量。",
              "选项多为百分数时，优先判断是否是增长率问题。",
            ],
          },
          {
            type: "compare",
            label: "和增长量区分",
            left: {
              title: "增长量",
              content: "问“增加了多少”",
              items: ["答案带具体单位", "本质是差值"],
            },
            right: {
              title: "增长率",
              content: "问“增加了百分之几”",
              items: ["答案是百分数", "本质是比例"],
            },
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "增长率的分母是基期量，不是现期量；看到现期量很顺手时尤其容易代错。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某产品 2024 年销量为 150 万件，2023 年为 120 万件，求 2024 年同比增长率。",
            analysis: "增长量为 150 - 120 = 30，增长率 = 30 / 120 = 25%。",
          },
          {
            type: "example",
            source: "2019 国考",
            label: "真题示例",
            stem: "2018 年某省 GDP 为 8000 亿元，2017 年为 7200 亿元，求 2018 年同比增长率。",
            options: [
              { key: "A", text: "9.2%" },
              { key: "B", text: "10.0%" },
              { key: "C", text: "11.1%" },
              { key: "D", text: "12.5%" }],
            answer: "C",
            analysis: "增长率 = (8000 - 7200) / 7200 = 800 / 7200 ≈ 11.1%。",
          }],
      },
    ],
  },
  {
    id: "percent-transform",
    categoryId: "speed-calc",
    type: "quick-check",
    title: "百分化",
    summary: "遇到分数、比重、增长率混合计算时使用。",
    preview: "常见分数先转百分数，再做近似比较。",
    relatedTraining: {
      sectionId: "data-analysis",
      itemId: "percent-calc",
      title: "百分化计算",
    },
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心方法", content: "常见分数先转百分数，再做近似比较。" },
          {
            type: "table",
            label: "常用速查",
            columns: ["分数", "百分数"],
            rows: [
              ["1/2", "50%"],
              ["1/3", "约 33.3%"],
              ["1/4", "25%"],
              ["1/5", "20%"],
              ["1/8", "12.5%"],
            ],
          },
          {
            type: "steps",
            label: "使用步骤",
            items: [
              "先识别能否用常见分数替代。",
              "把复杂比例换成接近的百分数。",
              "用选项距离判断是否需要回算。",
            ],
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "百分化是为了快，不是为了精；选项接近时要回到原式。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "比较 124/497 与 25% 的大小。",
            analysis: "497 的 25% 约为 124.25，所以 124/497 略小于 25%。",
          },
        ],
      },
      {
        id: "practice",
        title: "相关练习",
        blocks: [
          { type: "practice", title: "百分化计算", description: "把常见分数和百分数转换练熟，减少资料分析中的长算。" },
        ],
      },
    ],
  },
  {
    id: "increment-compare",
    categoryId: "growth",
    type: "method",
    title: "增量比较",
    summary: "多个对象比较“谁增长最多”时使用。",
    preview: "比较 A × r / (1 + r) 的大小",
    relatedTraining: {
      sectionId: "data-analysis",
      itemId: "inc-compare",
      title: "增量比大小",
    },
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "比较式", content: "增长量 ≈ A × r / (1 + r)", nodes: formulaNodes.incrementCompare },
          {
            type: "steps",
            label: "判断顺序",
            items: [
              "先看现期量 A 和增长率 r 是否同时占优。",
              "若一大一小，再估算 A × r / (1 + r)。",
              "增长率较小时可先近似比较 A × r。",
            ],
          },
          { type: "tip", variant: "success", title: "快速判断", content: "现期量和增长率都更大时可直接判；一大一小时再估算。" },
          { type: "tip", variant: "warning", title: "易错提醒", content: "不要只看增长率，增长量同时受基数影响。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            source: "2021 浙江",
            label: "真题示例",
            stem: "2014-2019 年全球卫星产业收入（表格数据），判断增长最快的年份。",
            analysis: "增速 = 增量/基期。2014 年基期最小、增量最大，比值最高；后续年份基期持续变大、增量回落，增速必然下降。所以 2014 年增速最快。",
          },
        ],
      },
      {
        id: "practice",
        title: "相关练习",
        blocks: [
          { type: "practice", title: "增量比大小", description: "专项练习一大一小情况下的增长量估算。" },
        ],
      },
    ],
  },
  {
    id: "interval-growth",
    categoryId: "growth",
    type: "formula",
    title: "间隔增长率",
    summary: "已知连续两期增长率，要求跨两期的总增长率时使用。",
    preview: "间隔增长率 = r1 + r2 + r1 × r2",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心公式", content: "间隔增长率 = r1 + r2 + r1 × r2", nodes: formulaNodes.intervalGrowth },
          {
            type: "signal",
            title: "识别信号",
            items: [
              "题干出现“比上上年”“两年间”“隔年增长”。",
              "材料给出相邻两年的同比增长率。",
              "要求从第一期跨到第三期的总变化率。",
            ],
          },
          {
            type: "steps",
            label: "解题步骤",
            items: [
              "把两段增长率分别记为 r1、r2。",
              "先算 r1 + r2，再看 r1 × r2 是否能忽略。",
              "选项接近时保留乘积项；选项差距大时可先估。",
            ],
          },
          { type: "tip", variant: "success", title: "快速判断", content: "两个增长率都不大时，r1 × r2 较小，可先用 r1 + r2 贴近答案。" },
          { type: "tip", variant: "warning", title: "易错提醒", content: "一正一负时乘积为负，不能机械相加；下降率也要带负号代入。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某指标 2023 年同比增长 10%，2024 年同比增长 20%，求 2024 年比 2022 年增长约多少。",
            analysis: "间隔增长率 = 10% + 20% + 10%×20% = 32%。",
          },
          { type: "example", source: "2020 下半年四川", label: "真题示例",
            stem: "2015 年城镇居民人均可支配收入 31195 元，比上年增长 8.2%，增长率比 2014 年下降 0.8 个百分点，求 2013 年城镇居民人均可支配收入约为多少万元。",
            options: [
              { key: "A", text: "2.3" },
              { key: "B", text: "2.6" },
              { key: "C", text: "2.9" },
              { key: "D", text: "3.1" }],
            answer: "B",
            analysis: "2014 年增速 = 8.2% + 0.8% = 9%。间隔增长率 = 9% + 8.2% + 9%×8.2% ≈ 18%。2013 年基期 = 31195 / (1 + 18%) ≈ 26436 元 ≈ 2.6 万元。" },
        ],
      },
    ],
  },
  {
    id: "current-ratio",
    categoryId: "ratio",
    type: "formula",
    title: "现期比重",
    summary: "题干问“占比”“比重”“占整体的百分之几”时使用，核心是部分除以整体。",
    preview: "现期比重 = 部分现期量 / 整体现期量",
    relatedTraining: {
      sectionId: "data-analysis",
      itemId: "fraction-small",
      title: "分数计算（分子<分母）",
    },
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心公式", content: "现期比重 = 部分现期量 / 整体现期量", nodes: formulaNodes.currentRatio },
          {
            type: "signal",
            title: "识别信号",
            items: [
              "题干出现“占”“比重”“占全部的百分之几”。",
              "材料给出部分量和整体量，且问的是当前时期。",
              "答案通常是百分数，计算结果一般小于 1。",
            ],
          },
          {
            type: "steps",
            label: "解题步骤",
            items: [
              "先找准部分量，避免把整体量放到分子。",
              "再找准同一时期、同一口径下的整体量。",
              "用部分量除以整体量，结合百分化或选项估算。",
            ],
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "部分和整体必须同口径：地区、时间、单位不一致时，要先换口径再计算。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某市工业产值为 800 亿元，其中高技术产业产值为 200 亿元，求高技术产业占工业产值的比重。",
            analysis: "现期比重 = 200 / 800 = 25%。",
          },
        
          { type: "example", source: "2019 国考", label: "真题示例",
            stem: "2018 年某省 GDP 为 4.5 万亿元，其中第三产业增加值为 2.25 万亿元，第三产业增加值占 GDP 的比重为多少。",
            options: [
              { key: "A", text: "45%" },
              { key: "B", text: "50%" },
              { key: "C", text: "55%" },
              { key: "D", text: "60%" }],
            answer: "B",
            analysis: "现期比重 = 2.25 / 4.5 = 50%。" }
        ],
      },
      {
        id: "practice",
        title: "相关练习",
        blocks: [
          { type: "practice", title: "分数计算（分子<分母）", description: "现期比重本质是分数计算，先把部分/整体的除法练熟。" },
        ],
      },
    ],
  },
  {
    id: "base-ratio",
    categoryId: "ratio",
    type: "formula",
    title: "基期比重",
    summary: "已知现期部分、现期整体及各自增长率，要求上一期比重时使用。",
    preview: "基期比重 = 现期比重 × (1 + 整体增长率) / (1 + 部分增长率)",
    relatedTraining: {
      sectionId: "data-analysis",
      itemId: "base-ratio",
      title: "基期比重",
    },
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心公式", content: "基期比重 = (部分现期量 / 整体现期量) × (1 + 整体增长率) / (1 + 部分增长率)", nodes: formulaNodes.baseRatio },
          {
            type: "signal",
            title: "识别信号",
            items: [
              "题干问“上年占比”“去年比重”“基期比重”。",
              "材料给出现期部分量、整体现期量，以及部分和整体各自增长率。",
              "式子里通常会出现两个增长率，需要判断谁在分子谁在分母。",
            ],
          },
          {
            type: "steps",
            label: "解题步骤",
            items: [
              "先算或估出现期比重：部分现期量 / 整体现期量。",
              "整体增长率放在修正项分子，部分增长率放在修正项分母。",
              "增长率接近时，基期比重接近现期比重；差距大时再精算。",
            ],
          },
          {
            type: "compare",
            label: "修正方向",
            left: {
              title: "部分增速更快",
              content: "基期比重小于现期比重",
              items: ["部分增长率 > 整体增长率", "修正项小于 1"],
            },
            right: {
              title: "整体增速更快",
              content: "基期比重大于现期比重",
              items: ["整体增长率 > 部分增长率", "修正项大于 1"],
            },
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "基期比重不是直接用基期部分除以基期整体去长算，考试里更常用现期比重乘增长率修正项。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某地区现期产业增加值 120 亿元，同比增长 20%；地区生产总值 600 亿元，同比增长 10%。求上年该产业占比。",
            analysis: "现期比重 = 120/600 = 20%。基期比重 = 20% × 1.10 / 1.20 ≈ 18.3%。",
          },
        
          { type: "example", source: "2020 联考", label: "真题示例",
            stem: "2019 年某市进口额 800 亿元、增长 10%，出口额 1200 亿元、增长 20%，求 2018 年进口额占进出口总额的比重。",
            options: [
              { key: "A", text: "约 38%" },
              { key: "B", text: "约 41%" },
              { key: "C", text: "约 44%" },
              { key: "D", text: "约 47%" }],
            answer: "B",
            analysis: "2018 年进口 = 800/1.1 ≈ 727，2018 年出口 = 1200/1.2 = 1000，2018 年总额 = 1727，比重 = 727/1727 ≈ 42%。基期比重 = (800/1200) × (1+20%)/(1+10%) ≈ 72.7%，即进口占比 ≈ 727/1727 ≈ 42%，最接近 B。" }
        ],
      },
      {
        id: "practice",
        title: "相关练习",
        blocks: [
          { type: "practice", title: "基期比重", description: "训练现期比重与增长率修正项的组合计算，重点练分子分母位置。" },
        ],
      },
    ],
  },
  {
    id: "ratio-change",
    categoryId: "ratio",
    type: "method",
    title: "比重变化",
    summary: "题干问“比重上升/下降几个百分点”时使用，先判断方向，再估变化幅度。",
    preview: "部分增速大于整体增速，比重上升；反之下降",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "方向判断", content: "部分增长率 > 整体增长率，则比重上升；部分增长率 < 整体增长率，则比重下降" },
          { type: "formula", label: "变化量", content: "比重变化量 = 现期比重 - 基期比重", nodes: formulaNodes.ratioChange },
          {
            type: "signal",
            title: "识别信号",
            items: [
              "题干出现“比重上升/下降”“提高/降低几个百分点”。",
              "材料给出部分和整体的现期量及增长率。",
              "选项单位常是“百分点”，不是“百分之几”。",
            ],
          },
          {
            type: "rule",
            title: "判断规则",
            items: [
              "先比较部分增速和整体增速，方向能直接判。",
              "若只问上升还是下降，不必计算具体比重。",
              "若问几个百分点，再用现期比重减基期比重。",
            ],
          },
          {
            type: "compare",
            label: "百分数与百分点",
            left: {
              title: "百分数",
              content: "表示比例本身",
              items: ["例如比重为 25%", "可参与乘除计算"],
            },
            right: {
              title: "百分点",
              content: "表示两个百分数的差",
              items: ["25% 到 28% 是提高 3 个百分点", "不要写成提高 3%"],
            },
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "“百分点”是两个百分数相减的结果，不是相对增长率；这是资料分析高频坑。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某行业现期占比 30%，部分同比增长 15%，整体同比增长 10%。判断该行业比重变化方向。",
            analysis: "部分增速 15% 大于整体增速 10%，说明该行业比重上升。",
          },
          {
            type: "example",
            source: "2022 国考",
            label: "真题示例",
            stem: "中石化供气量增速 8.8%，整体增速 3.83%，求比重变化约几个百分点。",
            options: [
              { key: "A", text: "0.5 个百分点" },
              { key: "B", text: "1.0 个百分点" },
              { key: "C", text: "1.5 个百分点" },
              { key: "D", text: "2.0 个百分点" }],
            answer: "C",
            analysis: "比重差 = 现期比重 × (8.8% - 3.83%) / (1 + 8.8%)。比重差 < 增速差 4.97%，估算约 1.5 个百分点。",
          }],
      },
    ],
  },
  {
    id: "fraction-compare",
    categoryId: "compare",
    type: "method",
    title: "分数比较",
    summary: "比重、倍数、平均数比较里经常出现。",
    preview: "先看同分子/同分母，再用差分或交叉相乘。",
    relatedTraining: {
      sectionId: "data-analysis",
      itemId: "fraction-compare",
      title: "分数比大小",
    },
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心方法", content: "先看同分子/同分母，再用差分或交叉相乘。" },
          {
            type: "steps",
            label: "判断顺序",
            items: [
              "能直接同分子或同分母比较时，先直接判断。",
              "分子更大且分母更小时，可直接判更大。",
              "仍无法判断时，用差分或交叉相乘。",
            ],
          },
          { type: "tip", variant: "success", title: "快速判断", content: "先找能省计算的结构，再决定是否精算。" },
          { type: "tip", variant: "warning", title: "易错提醒", content: "交叉相乘时注意只比较大小，不要把乘积当作答案。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "比较 37/81 和 45/98 的大小。",
            analysis: "交叉相乘：37×98=3626，45×81=3645，所以 45/98 更大。",
          },
        
          { type: "example", source: "2022 浙江", label: "真题示例",
            stem: "比较 347/628 和 351/635 的大小。",
            options: [
              { key: "A", text: "347/628 > 351/635" },
              { key: "B", text: "347/628 < 351/635" },
              { key: "C", text: "347/628 = 351/635" },
              { key: "D", text: "无法确定" }],
            answer: "B",
            analysis: "分子分母同大同小，看倍数。347→351 增加约 1.2%，628→635 增加约 1.1%，分子增速略大于分母，分数值增大，所以 347/628 < 351/635。" }
        ],
      },
      {
        id: "practice",
        title: "相关练习",
        blocks: [
          { type: "practice", title: "分数比大小", description: "训练不同结构下的分数大小快速比较。" },
        ],
      },
    ],
  },
  {
    id: "base-compare",
    categoryId: "compare",
    type: "method",
    title: "基期比较",
    summary: "比较多个对象上一期谁大谁小时使用，核心是比较 现期量 / (1 + 增长率)。",
    preview: "比较 A / (1 + r) 的大小",
    relatedTraining: {
      sectionId: "data-analysis",
      itemId: "base-compare",
      title: "基期比大小",
    },
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "比较式", content: "基期量 = 现期量 / (1 + 增长率)", nodes: formulaNodes.basePeriod },
          {
            type: "rule",
            title: "判断规则",
            items: [
              "现期量更大、增长率更小时，基期量必然更大。",
              "现期量更小、增长率更大时，基期量必然更小。",
              "一大一小时，再比较 A / (1 + r)，不要只盯现期量。",
            ],
          },
          {
            type: "compare",
            label: "常见结构",
            left: {
              title: "可直接判",
              items: ["A 更大且 r 更小", "A 更小且 r 更大"],
            },
            right: {
              title: "需要估算",
              items: ["A 更大且 r 也更大", "A 更小且 r 也更小"],
            },
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "题目问基期，比较对象是除法结果；增长率越高，分母越大，基期会被压低。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "A 现期为 120，同比增长 20%；B 现期为 110，同比增长 5%。比较基期大小。",
            analysis: "A 基期 = 120/1.2 = 100，B 基期约 110/1.05 ≈ 105，B 的基期更大。",
          },
          { type: "example", source: "2021 国考", label: "真题示例",
            stem: "2019 年东部地区 GDP 为 50 万亿元，同比增长 6.5%；西部地区 GDP 为 20 万亿元，同比增长 7.2%。比较两个地区 2018 年 GDP 的大小关系。",
            options: [
              { key: "A", text: "东部远大于西部" },
              { key: "B", text: "东部略大于西部" },
              { key: "C", text: "东部小于西部" },
              { key: "D", text: "无法确定" }],
            answer: "A",
            analysis: "东部基期 = 50/1.065 ≈ 47.0，西部基期 = 20/1.072 ≈ 18.7，东部远大于西部。" },
        ],
      },
      {
        id: "practice",
        title: "相关练习",
        blocks: [
          { type: "practice", title: "基期比大小", description: "训练在多个对象中快速判断上一期大小，尤其是一大一小结构。" },
        ],
      },
    ],
  },
  {
    id: "mixed-growth",
    categoryId: "special",
    type: "method",
    title: "混合增长率",
    summary: "多个部分合成整体时，整体增长率一定介于各部分增长率之间。",
    preview: "整体增速介于各部分增速之间，且偏向基量更大的部分",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心判断", content: "整体增长率介于各部分增长率之间" },
          {
            type: "signal",
            title: "识别信号",
            items: [
              "题干问整体增速，材料给出多个部分的增速。",
              "出现“其中 A、B 分别增长”“合计增长率约为多少”。",
              "选项中有明显高于所有部分或低于所有部分的值。",
            ],
          },
          {
            type: "rule",
            title: "判断规则",
            items: [
              "整体增长率不能超过最高的部分增长率，也不能低于最低的部分增长率。",
              "哪个部分基期量更大，整体增速就更偏向哪个部分。",
              "如果只问范围，先用夹逼排除，不急着精算。",
            ],
          },
          {
            type: "compare",
            label: "偏向判断",
            left: {
              title: "A 基量更大",
              content: "整体增速更靠近 A",
              items: ["A 对整体影响更大", "A 的增速权重更高"],
            },
            right: {
              title: "B 基量更大",
              content: "整体增速更靠近 B",
              items: ["B 对整体影响更大", "B 的增速权重更高"],
            },
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "混合增长率不是把几个增长率简单平均；权重取决于各部分基期量。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "A 类收入同比增长 10%，B 类收入同比增长 30%，两类合计增长率可能是多少？",
            analysis: "合计增长率一定介于 10% 和 30% 之间。若 A 的基期收入更大，则合计增速更靠近 10%。",
          },
        
          { type: "example", source: "2021 国考", label: "真题示例",
            stem: "某市 2020 年外贸进出口总额中，出口增速 8%，进口增速 3%，整体增速约为 5%，判断出口额和进口额哪个更大。",
            options: [
              { key: "A", text: "出口额更大" },
              { key: "B", text: "进口额更大" },
              { key: "C", text: "两者相等" },
              { key: "D", text: "无法判断" }],
            answer: "A",
            analysis: "整体增速 5% 介于出口 8% 和进口 3% 之间，且更靠近出口 8%，说明出口基期量更大（混合值偏向量大的一方）。" }
        ],
      },
    ],
  },
  {
    id: "annual-growth-rate",
    categoryId: "special",
    type: "formula",
    title: "年均增长率",
    summary: "已知初期量和末期量，要求多年平均每年的增长速度时使用。",
    preview: "末期量 = 初期量 × (1 + 年均增长率)^年数",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心公式", content: "末期量 = 初期量 × (1 + r)^n", nodes: formulaNodes.annualGrowthRate },
          {
            type: "signal",
            title: "识别信号",
            items: [
              "题干出现“年均增长率”“平均每年增长百分之几”。",
              "材料给出起始年份和结束年份的数据。",
              "选项为百分数，且通常需要判断年数 n。",
            ],
          },
          {
            type: "rule",
            title: "读题规则",
            items: [
              "先确认初期量和末期量，不要把中间年份误当末期。",
              "2019 年到 2024 年的间隔年数是 5，不是 6。",
              "选项差距大时，可用代入法快速验证。",
            ],
          },
          {
            type: "compare",
            label: "和年均增长量区分",
            left: {
              title: "年均增长率",
              content: "平均每年增长百分之几",
              items: ["答案是百分数", "本质是复合增长"],
            },
            right: {
              title: "年均增长量",
              content: "平均每年增加多少",
              items: ["答案带单位", "本质是首末差除以间隔"],
            },
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "年均增长率是复合增长，不是把总增长率直接除以年数；但选项较粗时可用近似辅助排除。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某指标 2020 年为 100，2022 年为 121，求 2020—2022 年年均增长率。",
            analysis: "间隔年数为 2。100 × (1 + r)^2 = 121，所以 1 + r = 1.1，r = 10%。",
          },
        
          { type: "example", source: "2019 国考", label: "真题示例",
            stem: "2014-2018 年某省 GDP 从 2 万亿增长到 2.8 万亿，求年均增长率约为多少。",
            options: [
              { key: "A", text: "5%" },
              { key: "B", text: "8%" },
              { key: "C", text: "10%" },
              { key: "D", text: "12%" }],
            answer: "B",
            analysis: "末期/基期 = 2.8/2 = 1.4，n = 4。代入验证：1.08^4 = 1.36，1.1^4 = 1.46。1.4 介于两者之间，更接近 1.36，年均增长率约 8%。" }
        ],
      },
    ],
  },
  {
    id: "multiple-growth",
    categoryId: "special",
    type: "method",
    title: "倍数增长",
    summary: "题干出现“是几倍”“增长几倍”“翻几番”时，先区分倍数和增长率。",
    preview: "现期是基期的 A 倍，则增长率 = A - 1",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心关系", content: "现期量 = 基期量 × 倍数；增长率 = 倍数 - 1" },
          {
            type: "compare",
            label: "易混表达",
            left: {
              title: "是几倍",
              content: "现期 / 基期",
              items: ["是 3 倍，增长率为 200%", "包含原来的 1 倍"],
            },
            right: {
              title: "增长几倍",
              content: "增长量 / 基期",
              items: ["增长 3 倍，现期是 4 倍", "不包含原来的 1 倍"],
            },
          },
          {
            type: "rule",
            title: "读题规则",
            items: [
              "问“是几倍”，直接比较现期和基期的倍数关系。",
              "问“增长几倍”，先求增长量相当于基期的几倍。",
              "问“翻一番”，表示变为原来的 2 倍；翻两番表示变为原来的 4 倍。",
            ],
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "“增长 2 倍”和“是 2 倍”不是一回事：前者现期是基期的 3 倍，后者增长率是 100%。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某指标由 50 增至 150，问现期是基期的几倍，增长了几倍。",
            analysis: "现期是基期的 150/50 = 3 倍；增长量为 100，增长了 100/50 = 2 倍。",
          },
        ,
          {
            type: "example",
            source: "2020 国考",
            label: "真题示例",
            stem: "2019 年某地区 GDP 为 800 亿元，2015 年为 200 亿元，问 2019 年 GDP 是 2015 年的几倍。",
            options: [
              { key: "A", text: "2 倍" },
              { key: "B", text: "3 倍" },
              { key: "C", text: "4 倍" },
              { key: "D", text: "5 倍" }],
            answer: "C",
            analysis: "800 / 200 = 4，现期是基期的 4 倍，增长了 3 倍。",
          }],
      },
    ],
  },
  {
    id: "percentage-point",
    categoryId: "special",
    type: "method",
    title: "百分点",
    summary: "两个百分数相减时使用“百分点”，常见于比重变化和增速差。",
    preview: "百分点 = 两个百分数的差",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心概念", content: "百分点表示两个百分数之间的差值" },
          {
            type: "signal",
            title: "识别信号",
            items: [
              "题干出现“提高几个百分点”“回落几个百分点”。",
              "材料比较的是两个比重、两个增长率或两个百分数。",
              "选项常写作“百分点”，而不是单纯的“%”。",
            ],
          },
          {
            type: "table",
            label: "常见表达",
            columns: ["变化", "说法"],
            rows: [
              ["20% 到 25%", "提高 5 个百分点"],
              ["30% 到 27%", "下降 3 个百分点"],
              ["比重为 15%", "这是百分数"],
              ["比重差为 2%", "应说 2 个百分点"],
            ],
          },
          {
            type: "compare",
            label: "百分数与百分点",
            left: {
              title: "百分数",
              content: "表示比例大小",
              items: ["例如占比 40%", "增长率 12%"],
            },
            right: {
              title: "百分点",
              content: "表示百分数差值",
              items: ["40% 到 45% 相差 5 个百分点", "用于描述变化幅度"],
            },
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "两个百分数相减得到的是百分点；两个数相除得到的才是相对增长率。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            label: "例题 1",
            stem: "某指标占比由 18% 提高到 23%，问提高了多少。",
            analysis: "23% - 18% = 5%，表达为提高 5 个百分点。",
          },
          { type: "example", source: "2021 国考", label: "真题示例",
            stem: "2019 年东部地区GDP占全国比重 51.9%，2020 年占 52.4%，比重比上年提高了多少个百分点？",
            options: [
              { key: "A", text: "0.3" },
              { key: "B", text: "0.5" },
              { key: "C", text: "0.7" },
              { key: "D", text: "1.0" }],
            answer: "B",
            analysis: "比重差 = 52.4% - 51.9% = 0.5 个百分点。注意比重差也可以用公式：现期比重×(部分增速-整体增速)/(1+部分增速) 验证。" },
        ],
      },
    ],
  },
  {
    id: "annual-average",
    categoryId: "average",
    type: "formula",
    title: "年平均量",
    summary: "题干问多年平均每年多少时使用，先分清是平均量还是年均增长量。",
    preview: "年平均量 = 总量 / 年数",
    relatedTraining: {
      sectionId: "data-analysis",
      itemId: "annual-average",
      title: "年平均量",
    },
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心公式", content: "年平均量 = 多年总量 / 年数", nodes: formulaNodes.annualAverage },
          { type: "formula", label: "常见变形", content: "年均增长量 = (末期量 - 初期量) / 间隔年数", nodes: formulaNodes.annualGrowthAmount },
          {
            type: "compare",
            label: "两类问法",
            left: {
              title: "年平均量",
              content: "平均每年有多少",
              items: ["分子通常是总量", "分母是统计年数"],
            },
            right: {
              title: "年均增长量",
              content: "平均每年增加多少",
              items: ["分子是首末差", "分母是间隔年数"],
            },
          },
          {
            type: "rule",
            title: "读题规则",
            items: [
              "出现“平均每年”不一定是增长，要看后面问“多少”还是“增加多少”。",
              "统计 2020—2024 年共有 5 年，间隔是 4 年。",
              "材料按季度、月份给数据时，先统一时间口径。",
            ],
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "年数和间隔年数最容易混：平均量看有几个年份，年均增长量看跨过几个间隔。" },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          {
            type: "example",
            source: "2016 国考",
            label: "真题示例",
            stem: "2014 年全国社会物流总额 213.5 万亿元，物流总费用 10.6 万亿元，其中运输费用 5.6 万亿元。问 2014 年每实现 100 万元的社会物流额，运输费用平均约为多少万元？",
            analysis: "每字后为分母：每 100 万元物流额 → 物流总额做分母。运输费用/物流总额 × 100 = 5.6/213.5×100 ≈ 2.6。",
          },
        ],
      },
      {
        id: "practice",
        title: "相关练习",
        blocks: [
          { type: "practice", title: "年平均量", description: "训练总量、年数、间隔年数的区分，减少读题型错误。" },
        ],
      },
    ],
  },
  {
    id: "statistics-terms",
    categoryId: "basic",
    type: "method",
    title: "基础统计术语",
    summary: "资料分析读题先识别倍数、成数、同比、环比、顺差逆差等基础表述。",
    preview: "倍数 = 增长率 + 1；同比看历史同期，环比看连续周期",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          {
            type: "table",
            label: "常见术语",
            columns: ["术语", "含义"],
            rows: [
              ["倍数", "倍数 = 增长率 + 1"],
              ["翻番", "翻 n 番为原来的 2^n 倍"],
              ["成数", "一成相当于 10%"],
              ["同比", "与历史同期比较"],
              ["环比", "与上一个连续周期比较"],
            ],
          },
          { type: "tip", variant: "warning", title: "易错提醒", content: "产业增加值不是增长量，GDP 等于三大产业增加值之和。" },
        ],
      },
    ],
  },
  {
    id: "quick-arithmetic",
    categoryId: "speed-calc",
    type: "method",
    title: "加减乘速算",
    summary: "加减乘速算主要用于选项差距较大时快速贴近答案。",
    preview: "尾数法、高位叠加、削峰填谷、截位相乘",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "rule", title: "加法速算", items: ["选项最后几位不同，就求几位尾数。", "高位叠加从左向右算，适合多项相加。", "平均数可用削峰填谷：基准值 + 偏离总和 / 项数。"] },
          { type: "rule", title: "乘法速算", items: ["截 2 位时观察第 3 位。", "第 3 位小于等于 2 全舍，大于等于 8 全进。", "其他情况通常一进一舍。"] },
        ],
      },
    ],
  },
  {
    id: "division-estimation",
    categoryId: "speed-calc",
    type: "method",
    title: "除法速算",
    summary: "除法速算可通过拆分被除数或分母截位，快速估算分数大小。",
    preview: "把被除数拆成接近分母的好算数",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "拆分示例", content: "332 / 688 = (344 - 12) / 688 ≈ 50% - 2% = 48% 左右" },
          { type: "image-note", label: "模块图", title: "除法速算图", status: "待补图", description: "Markdown 此处为未解析图片，后续补入清晰图后填写 src。" },
        ],
      },
    ],
  },
  {
    id: "share-415",
    categoryId: "speed-calc",
    type: "method",
    title: "415 份数法",
    summary: "增长率接近常见分数时，用基期、变化量、本期量的份数关系快速估算。",
    preview: "基期 : 变化量 : 本期量 = b : a : a + b",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心关系", content: "若增长率约为 a / b，则基期 : 变化量 : 本期量 = b : a : a + b" },
          { type: "steps", label: "使用步骤", items: ["把增长率化成接近的常见分数。", "建立基期、变化量、本期量的份数关系。", "根据本期量或变化量求一份，再反推答案。"] },
          { type: "tip", variant: "warning", title: "易错提醒", content: "增长率为负时，变化量也要带负号。" },
        ],
      },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2018 国考", label: "真题示例",
            stem: "2016 年某省财政支出 5000 亿元，同比增长约 14.3%，求 2015 年财政支出约为多少亿元。",
            options: [
              { key: "A", text: "4375" },
              { key: "B", text: "4500" },
              { key: "C", text: "4620" },
              { key: "D", text: "4750" }],
            answer: "A",
            analysis: "14.3% ≈ 1/7，415 份数法：基期 : 增量 : 现期 = 7 : 1 : 8。现期 5000 对应 8 份，1 份 = 625，基期 = 7 × 625 = 4375 亿元。" },
        ]},
    ],
  },
  {
    id: "assumption-allocation",
    categoryId: "speed-calc",
    type: "method",
    title: "假设分配法",
    summary: "增长率较小时，先抓大数分配，误差对最终答案影响较小。",
    preview: "R < 20% 时，增长量可近似为 B × R",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "rule", title: "常用简化", items: ["R < 20%，增长量约为 B × R。", "R 在 25% 左右，基期 : 增长量约为 4 : 1。", "R 在 33% 左右，约为 3 : 1。", "R 在 50% 左右，约为 2 : 1。"] },
          { type: "tip", variant: "success", title: "使用场景", content: "适合选项差距较大、只需快速贴近答案的增长量估算。" },
        ],
      },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2021 联考", label: "真题示例",
            stem: "2020 年某市社会消费品零售总额 1200 亿元，同比增长 5.2%，求 2020 年社会消费品零售总额的增长量约为多少亿元。",
            options: [
              { key: "A", text: "约 56 亿元" },
              { key: "B", text: "约 59 亿元" },
              { key: "C", text: "约 63 亿元" },
              { key: "D", text: "约 67 亿元" }],
            answer: "B",
            analysis: "R=5.2% < 20%，X ≈ B × R = 1200 × 5.2% = 62.4。精确：X = 1200 × 5.2% / 1.052 ≈ 59.3 亿元，选 B。" },
        ]},
    ],
  },
  {
    id: "abrx-system",
    categoryId: "growth",
    type: "formula",
    title: "ABRX 四量关系",
    summary: "资料分析增长类可统一成 A、B、R、X 四个量之间的转换。",
    preview: "A = B / (1 + R)，B = A + X，X = A × R",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "核心公式", content: "A = B / (1 + R)；B = A + X；X = A × R", nodes: formulaNodes.abrx },
          { type: "rule", title: "四量含义", items: ["A 表示基期量。", "B 表示本期量。", "R 表示增长率。", "X 表示增长量。"] },
          { type: "formula", label: "乘积增长率", content: "A = B × C 时，R_A = R_B + R_C + R_B × R_C", nodes: formulaNodes.abrxProduct },
          { type: "formula", label: "比值增长率", content: "A = B / C 时，R_A = (R_b - R_c) / (1 + R_c)", nodes: formulaNodes.abrxRatio },
          { type: "tip", variant: "success", title: "适用场景", content: "乘积公式用于“收入=单价×销量”类；比值公式用于人均、亩均、单价等平均量增速。" },
        ],
      },
      { id: "example", title: "例题讲解", blocks: [
          { type: "example", source: "2021 国考", label: "真题示例·乘积增长率",
            stem: "2020 年某地旅游收入 = 游客人数 × 人均消费，游客人数增长 15%，人均消费增长 10%，求旅游收入增长率。",
            options: [
              { key: "A", text: "25%" },
              { key: "B", text: "26.5%" },
              { key: "C", text: "28%" },
              { key: "D", text: "30%" }],
            answer: "B",
            analysis: "旅游收入 = 人数 × 人均消费，属于乘积增长率。R = 15% + 10% + 15%×10% = 25% + 1.5% = 26.5%。" },
          { type: "example", source: "2019 联考", label: "真题示例·比值增长率",
            stem: "某省 2019 年粮食总产量增长 3%，种植面积增长 1%，求亩产增长率约为多少。",
            options: [
              { key: "A", text: "1%" },
              { key: "B", text: "2%" },
              { key: "C", text: "3%" },
              { key: "D", text: "4%" }],
            answer: "B",
            analysis: "亩产 = 总产量 / 面积，属于比值增长率。R = (3% - 1%) / (1 + 1%) = 2% / 1.01 ≈ 1.98%，约 2%。" },
        ]},
    ],
  },
  {
    id: "interval-growth-reverse",
    categoryId: "growth",
    type: "method",
    title: "间隔增长率逆运用",
    summary: "已知间隔增长率和其中一段单期增长率时，用反解式求另一段单期增长率。",
    preview: "未知单期增长率 = (间隔增长率 - 已知单期增长率) / (1 + 已知单期增长率)",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "正向关系", content: "间隔增长率 = R1 + R2 + R1 × R2", nodes: formulaNodes.intervalGrowth },
          { type: "formula", label: "反解公式", content: "未知单期增长率 = (间隔增长率 - 已知单期增长率) / (1 + 已知单期增长率)", nodes: formulaNodes.intervalGrowthReverse },
          { type: "steps", label: "反推步骤", items: ["先把题干给出的两期合计增速记为间隔增长率 R。", "把已知单期增长率记为 r。", "用 (R - r) / (1 + r) 反推出另一段单期增长率。", "如果增长率为负，代入时必须保留负号。"] },
          { type: "example", source: "2022 江苏", label: "真题示例", stem: "2021 年 1-7 月原油产量同比增长 2.4%，比 2019 年同期增长 3.9%，求 2020 年的同比增速。", analysis: "把 2021 相对 2019 的增速 3.9% 当作间隔增长率 R，已知 2021 同比 r₁ = 2.4%，反解 r₂ = (3.9% - 2.4%) / (1 + 2.4%) ≈ 1.5%，落在 1%-2% 区间。" },
          { type: "image-note", label: "模块图", title: "间隔增长率例题图", status: "待补图", description: "Markdown 此处为未解析图片，后续补入清晰图后填写 src。" },
        ],
      },
    ],
  },
  {
    id: "ratio-trend",
    categoryId: "ratio",
    type: "method",
    title: "比重趋势逆运用",
    summary: "已知比重上升或下降时，可以反推部分增速与整体增速的大小关系。",
    preview: "比重上升：分子增速 > 分母增速",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "方向判断", content: "比重上升：部分增速 > 整体增速；比重下降：部分增速 < 整体增速" },
          { type: "example", label: "例题", stem: "某地区业务量比重上升，全国增速 26%，判断该地区增速。", analysis: "比重上升说明该地区增速高于整体增速，因此应选择大于 26% 的选项。" },
        ],
      },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", source: "2020 事业编联考", label: "真题示例",
          stem: "中部地区快递业务量比重上升，全国快递业务量增速 26%，判断中部地区快递业务量增速。",
          options: [
            { key: "A", text: "21%" },
            { key: "B", text: "24%" },
            { key: "C", text: "26%" },
            { key: "D", text: "31%" }],
          answer: "D",
          analysis: "比重上升 → 部分增速 > 整体增速，即中部增速 > 26%，只有 31% 满足。" }]},
    ],
  },
  {
    id: "ratio-difference",
    categoryId: "ratio",
    type: "formula",
    title: "比重差计算",
    summary: "比重变化量通常用百分点表示，且比重差小于部分与整体的增速差。",
    preview: "比重差 ≈ 现期比重 × (部分增速 - 整体增速) / (1 + 部分增速)",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "估算关系", content: "比重差 < 部分增速与整体增速之差" },
          { type: "tip", variant: "warning", title: "易错提醒", content: "比重差的单位是百分点，不是百分数增长率。" },
          { type: "image-note", label: "模块图", title: "比重差模块图", status: "待补图", description: "Markdown 此处为未解析图片，后续补入清晰图后填写 src。" },
        ],
      },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", source: "2022 国考", label: "真题示例",
          stem: "中石化供气量增速 8.8%，整体增速 3.83%，判断比重变化并估算比重差。",
          options: [
            { key: "A", text: "上升约 0.5 个百分点" },
            { key: "B", text: "上升约 1.5 个百分点" },
            { key: "C", text: "下降约 0.5 个百分点" },
            { key: "D", text: "下降约 1.5 个百分点" }],
          answer: "B",
          analysis: "部分增速 8.8% > 整体 3.83%，比重上升。比重差 < 增速差 8.8%-3.83%=4.97%，估算约 1.5 个百分点。" }]},
    ],
  },
  {
    id: "mixture-cross",
    categoryId: "mixture",
    type: "method",
    title: "盐水混合与十字交叉",
    summary: "混合类题目整体介于两部分之间，十字交叉求的是分母之比。",
    preview: "整体介于两部分之间，且靠近量大的一方",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "rule", title: "核心原理", items: ["整体值介于两个部分值之间。", "整体更靠近量大的一方。", "适用前提是三量之间存在整体与部分的加和关系。"] },
          { type: "tip", variant: "warning", title: "十字交叉提醒", content: "十字交叉求出来的是分母之比：代入增长率时是基期之比，代入人均时是人数之比。" },
          { type: "rule", title: "双线法（时间混合秒杀）", items: ["12 月当月增速 > 全年累计增速 > 上年全年累计增速。", "用于时间序列混合：单月大于累计，累计大于往期累计。", "排序题可直接锁定 12 月增速最高、往年累计增速最低。"] },
        ],
      },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          { type: "example", source: "2022 山东", label: "真题示例一·增速混合", stem: "2018 年港口吞吐量 133 亿吨、增速 2.7%；外贸 42 亿吨、增速 2.0%，求非外贸增速。", analysis: "非外贸量 91 亿吨更大，混合值 2.7% 靠近非外贸。外贸与整体差 0.7 个百分点，反比分配后非外贸高出整体约 0.35 个百分点，约为 3.05%。" },
          { type: "example", source: "2021 江苏", label: "真题示例二·人均混合", stem: "全国人均消费 21559 元，城镇 28063 元，农村 13328 元，求城镇人口占比。", analysis: "人均 = 消费/人数，十字交叉结果为人数比。差值反比：城镇:农村 ≈ 82:65，城镇占比 ≈ 82/147 ≈ 55.9%。" },
        ],
      },
    ],
  },
  {
    id: "average-denominator",
    categoryId: "average",
    type: "method",
    title: "平均类通用口诀",
    summary: "平均类题目重点在分母口径，尤其是时间范围、人数和基期口径。",
    preview: "均前每后做分母",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "rule", title: "读题规则", items: ["时间平均值注意起止时间。", "人均、户均、每单位都要先找分母。", "平年闰年会影响天数分母。"] },
          { type: "tip", variant: "success", title: "口诀", content: "均前每后做分母：看到平均、人均、每单位，先找分母。" },
        ],
      },
    ],
  },
  {
    id: "chart-lookup",
    categoryId: "compare",
    type: "method",
    title: "图表查找注意事项",
    summary: "图表题先确认时间、单位、合计行和第一年增量，避免查错数。",
    preview: "看时间、看单位、看合计、看第一年增量",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "rule", title: "检查清单", items: ["注意起始和结束年份、月份。", "注意合计、总计行，避免重复计数。", "注意第一年的增量是否能直接读取。", "注意单位是否为万、亿、% 或百分点。"] },
          { type: "image-note", label: "模块图", title: "图表查找示意图", status: "待补图", description: "Markdown 此处为未解析图片，后续补入清晰图后填写 src。" },
        ],
      },
    ],
  },
  {
    id: "pulling-contribution",
    categoryId: "special",
    type: "formula",
    title: "拉动增长与贡献率",
    summary: "拉动增长看部分增量占整体基期，贡献率看部分增量占整体增量。",
    preview: "拉动增长率 = 部分增量 / 整体基期；贡献率 = 部分增量 / 整体增量",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "拉动增长率", content: "拉动增长率 = 部分增量 / 整体基期", nodes: formulaNodes.pullingGrowth },
          { type: "formula", label: "增量贡献率", content: "增量贡献率 = 部分增量 / 整体增量", nodes: formulaNodes.contributionRate },
          { type: "example", label: "示例", stem: "包子增量 50，油条增量 50，整体增量 100。", analysis: "两者贡献率均为 50%。若整体基期为 150，则各自拉动增长率为 50 / 150 = 33.3%。" },
        ],
      },
    ],
  },
  {
    id: "data-inclusion",
    categoryId: "special",
    type: "method",
    title: "资料容斥问题",
    summary: "占比和超过 100% 时，一定存在交集；问至少和至多时用包含关系判断。",
    preview: "至少 = a + b - 100%；至多取较小比重",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "至少", content: "两个比重交集最小值 = a + b - 100%" },
          { type: "formula", label: "至多", content: "两个比重交集最大值 = 较小的那个比重" },
          { type: "example", label: "示例", stem: "男生占 50%，南方同学占 80%。", analysis: "南方男生至多 50%，至少 50% + 80% - 100% = 30%。" },
        ],
      },
    ],
  },
];

module.exports = {
  module: moduleInfo,
  categories,
  points,
};
