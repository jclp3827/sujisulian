const moduleInfo = {
  id: "quantity",
  title: "数量关系",
  keywords: "数论、方程、工程、行程、排列组合",
  description: "围绕数量关系常考模型、公式和快速判断方法整理。",
  status: "ready",
  statusText: "可学习"};

const categories = [
  { id: "number-basic", title: "数论基础", subtitle: "公式、数列和数的特性", status: "ready", pointIds: ["number-formulas", "number-properties"] },
  { id: "equation", title: "和差倍比", subtitle: "代入排除、普通方程和不定方程", status: "ready", pointIds: ["substitution-method", "normal-equation", "indeterminate-equation"] },
  { id: "concentration", title: "浓度问题", subtitle: "溶质不变和十字相乘", status: "ready", pointIds: ["concentration-cross"] },
  { id: "inclusion", title: "牛吃草与容斥", subtitle: "增长消耗模型和集合计数", status: "ready", pointIds: ["cow-eating-grass", "inclusion-exclusion"] },
  { id: "cycle-date", title: "周期日期", subtitle: "周期循环、余数和星期", status: "ready", pointIds: ["cycle-remainder", "date-week"] },
  { id: "work", title: "工程问题", subtitle: "效率、总量和多人合作", status: "ready", pointIds: ["work-efficiency"] },
  { id: "profit", title: "利润问题", subtitle: "成本、售价、利润率和分批销售", status: "ready", pointIds: ["profit-core"] },
  { id: "extremum", title: "最值问题", subtitle: "抽屉原理、构造和均值不等式", status: "ready", pointIds: ["drawer-principle", "extreme-construction"] },
  { id: "combinatorics", title: "排列组合概率", subtitle: "有序无序、捆绑插空和概率", status: "ready", pointIds: ["permutation-combination", "adjacent-bundle", "non-adjacent-insertion", "ordered-arrangement", "identical-distribution", "equal-grouping", "derangement", "circular-arrangement", "repeated-arrangement", "probability-basic", "same-group-probability"] },
  { id: "applied", title: "特殊应用题", subtitle: "植树、鸡兔同笼、盈亏、年龄、方阵、钟表和比赛", status: "ready", pointIds: ["planting-array", "chicken-rabbit", "surplus-deficit", "age-problem", "matrix-problem", "clock-problem", "competition-problem", "balance-weighing"] },
  { id: "geometry", title: "几何问题", subtitle: "平面、立体和常用结论", status: "ready", pointIds: ["geometry-formulas"] },
  { id: "travel", title: "行程问题", subtitle: "普通行程、平均速度、相遇追及、流水行船、扶梯、火车过桥和队伍行进", status: "ready", pointIds: ["travel-basic", "travel-average-speed", "travel-core", "boat-stream", "escalator-motion", "train-bridge", "team-marching"] },
  { id: "number-sequence", title: "数字推理", subtitle: "基础数列、无特征数列和特征数列", status: "ready", pointIds: ["sequence-basic", "sequence-no-feature", "sequence-feature"] }];

const formulaNodes = {
  workEfficiency: [
    { type: "text", value: "工作总量" },
    { type: "op", value: "=" },
    { type: "text", value: "工作效率" },
    { type: "op", value: "×" },
    { type: "text", value: "工作时间" }],
  probability: [
    { type: "text", value: "P" },
    { type: "op", value: "=" },
    { type: "frac", num: "有利情况数", den: "总情况数" }],
  travelDistance: [
    { type: "text", value: "S" },
    { type: "op", value: "=" },
    { type: "text", value: "v" },
    { type: "op", value: "×" },
    { type: "text", value: "t" }]};

const points = [
  {
    id: "number-formulas",
    categoryId: "number-basic",
    type: "formula",
    title: "基础公式与数列",
    summary: "平方差、完全平方、等差等比数列是数量关系计算和数字推理的基础工具。",
    preview: "等差：an = a1 + (n - 1)d；Sn = n(a1 + an) / 2",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "formula", label: "平方差", content: "a^2 - b^2 = (a + b)(a - b)" },
          { type: "formula", label: "完全平方", content: "(a ± b)^2 = a^2 ± 2ab + b^2" },
          { type: "formula", label: "完全立方", content: "(a ± b)^3 = a^3 ± b^3 ± 3a^2b + 3ab^2；符号按展开方向确定" },
          { type: "formula", label: "立方和差", content: "a^3 ± b^3 = (a ± b)(a^2 ∓ ab + b^2)" },
          { type: "formula", label: "幂运算", content: "a^m × a^n = a^(m+n)；a^m ÷ a^n = a^(m-n)；(a^m)^n = a^(mn)；(ab)^n = a^n b^n" },
          { type: "formula", label: "等差数列", content: "an = a1 + (n - 1)d；Sn = n(a1 + an) / 2 = n×中项 = n×平均数" },
          { type: "formula", label: "等比数列", content: "an = a1 × q^(n - 1)；Sn = a1(1 - q^n) / (1 - q)" },
          {
            type: "table",
            label: "常用数",
            columns: ["类型", "速记"],
            rows: [
              ["1-11 立方", "1、8、27、64、125、216、343、512、729、1000、1331"],
              ["11-19 平方", "121、144、169、196、225、256、289、324、361"]]},
          {
            type: "rule",
            title: "四则速算",
            items: [
              "截位相乘：截 2 位观察第 3 位，第 3 位≤2 全舍，≥8 全进；其他情况第 3 位一进一舍。",
              "截位直除：一步除法截分母；多步除法分子分母都截。选项差距大截 2 位，差距小截 3 位。",
              "尾数法：选项末尾数字不同时，直接计算结果末尾数字。",
              "高位叠加法：对齐数位、观察选项，从左向右算高位。"]},
          { type: "tip", variant: "success", title: "速记提示", content: "数论基础先背公式和常用平方/立方；计算题优先截位、尾数、高位叠加，减少完整运算。" }]},
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          { type: "example", label: "例题", stem: "年级排名平均分构成等差数列，第 7、8、9 名又同时构成等差和等比数列，且第 10 名误登少 9 分。", analysis: "三项既等差又等比，可判断第 7、8、9 名相等。少登 9 分导致三科平均少 3 分，第 10 名应上移到与第 5 名同分。" }]},
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 联考", label: "真题示例",
            stem: "红星中学高二年级在本次期考试中竞争激烈，年级前七名的三科（语文、数学、英语）平均成绩构成公差为 1 的等差数列，第七、八、九名的平均成绩既构成等差数列，又构成等比数列。张龙位列第十，与第九名相差 1 分，张龙的英语成绩为 121 分，但老师误登记为 112 分。张龙的名次本该是：",
            options: [
              { key: "A", text: "第四" },
              { key: "B", text: "第五" },
              { key: "C", text: "第七" },
              { key: "D", text: "第八" }],
            answer: "B",
            analysis: "三项既等差又等比，只能全相等。设 a7=a8=a9=X，则 a10=X-1, a5=X+2。张龙英语少 9 分，三科平均少 3 分，所以 a10=X-1+3=X+2=a5，即原本是第五名。" }]}]},
  {
    id: "number-properties",
    categoryId: "number-basic",
    type: "method",
    title: "数的特性",
    summary: "比例、整除、余数题优先用数字特性破题，减少列复杂方程。",
    preview: "比例化最简分数，整体常取分子分母和的倍数",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          {
            type: "rule",
            title: "倍数特性",
            items: ["题干有比例关系时，先把比例化成最简分数。", "如果与问题相关的涉及到多个比例关系，找几个倍数间的最小公倍数。", "总体倍数 = 最简比分子分母相加的和。", "解题时关键是找出比例中的份数和实际值。"]},
          {
            type: "rule",
            title: "整除特性",
            items: ["若 a、b 能被 c 整除，则 a+b、a-b 也能被 c 整除。", "能被 3、9 整除，看各位数字和。", "能被 6 整除，需要同时能被 2 和 3 整除。", "能被 2、5 整除，看末位。", "能被 4、25 整除，看末两位。", "能被 8、125 整除，看末三位。"]},
          {
            type: "table",
            label: "余数口诀",
            columns: ["结构", "表达"],
            rows: [["余同取余", "最小公倍数 n + 余数，如除 3 余 1、除 5 余 1、除 6 余 1 → 30n+1"], ["和同加和", "最小公倍数 n + 和，如除 7 余 1、除 6 余 2、除 5 余 3 → 210n+8"], ["差同减差", "最小公倍数 n - 差，如除 7 余 5、除 6 余 4、除 3 余 1 → 42n-2"]]},
          { type: "tip", variant: "success", title: "快速判断", content: "选项带整数且比例多时，先看倍数和整除，常比直接设方程更快。" }]},
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          { type: "example", label: "例题一·比例转总量", stem: "语文是其余三种的 1/4，数学是其余三种的 3/7，英语是其余三种的 7/13，科学比数学少 30，求数学。", analysis: "转成占总量：语文 1/5，数学 3/10，英语 7/20。设总量 20x，则数学 6x，科学 3x，6x - 3x = 30，所以数学为 60。" },
          { type: "example", label: "例题二·利润倍数", stem: "某商店的利润近年来呈上涨趋势，去年的税前利润比前年增加了 25%，上缴国家利税 1200 万元后，还余 3/4。那么前年税前利润为多少万元？", options: [{ key: "A", text: "2880" }, { key: "B", text: "3600" }, { key: "C", text: "4800" }, { key: "D", text: "3840" }], answer: "D", analysis: "去年税前利润：1200÷(1-3/4)=4800 万元。去年比前年增加 25%，即去年=前年×(1+1/4)=前年×5/4，所以前年=4800÷5/4=3840 万元。" }]},
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "示例题", label: "真题示例一·倍数特性",
            stem: "语文教材数是其余三种的 1/4，数学是其余三种的 3/7，英语是其余三种的 7/13，科学比数学少 30 本，求数学教材数：",
            options: [
              { key: "A", text: "30" },
              { key: "B", text: "60" },
              { key: "C", text: "100" },
              { key: "D", text: "200" }],
            answer: "B",
            analysis: "转化为占总量：语文 1/5，数学 3/10，英语 7/20。设总量 20x，则数学 6x，科学 3x。数学-科学=3x=30，所以 x=10，数学 60 本。" },
          { type: "example", source: "2021 国考", label: "真题示例二·整除",
            stem: "某地调派 96 人分赴车站、机场、超市和学校四个人流密集的区域进行卫生安全检查，其中公共卫生专业人员有 62 人。已知派往机场的人员是四个区域中最多的，派往车站和超市的人员中，专业人员分别占 64% 和 65%，派往学校的人员中，非专业人员比专业人员少 30%。问派往机场的人员中，专业人员的占比在四个区域中排名：",
            options: [
              { key: "A", text: "第一" },
              { key: "B", text: "第二" },
              { key: "C", text: "第三" },
              { key: "D", text: "第四" }],
            answer: "A",
            analysis: "车站 64%=16/25 → 25 的倍数；超市 65%=13/20 → 20 的倍数；学校 17 的倍数。尝试学校 17 人 → 车站 25 + 超市 20 + 学校 17 = 62，机场 34 人。机场专业人员 23 人，占比 23/34 ≈ 67.6%，排名第一。" }]}]},
  {
    id: "substitution-method",
    categoryId: "equation",
    type: "method",
    title: "代入排除法",
    summary: "数量题选项明确时，先用尾数、奇偶、倍数等特性排除，再代入验证。",
    preview: "先排除，再代入；问最小从小选项试，问最大从大选项试",
    tabs: [
      {
        id: "knowledge",
        title: "知识点",
        blocks: [
          { type: "rule", title: "使用规则", items: ["普通方程较复杂时，先观察选项。", "能用尾数、奇偶、倍数排除的先排除。", "问最小值时从较小可行选项试，问最大值时从较大可行选项试。"] },
          { type: "tip", variant: "warning", title: "易错提醒", content: "代入排除不是瞎蒙，必须把题干中的整数、范围、最值条件同时代入。" }]},
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 国考", label: "真题示例",
            stem: "某种产品每箱 48 个。小李制作这种产品，第 1 天制作了 1 个，以后每天都比前一天多制作 1 个。X 天后总共制作了整数箱产品。问 X 的最小值在以下哪个范围内：",
            options: [
              { key: "A", text: "在 41-60 之间" },
              { key: "B", text: "超过 60" },
              { key: "C", text: "不到 20" },
              { key: "D", text: "在 20-40 之间" }],
            answer: "D",
            analysis: "总数 = X(X+1)/2 = 48n。X(X+1) = 96n。X 与 X+1 一奇一偶，逐一验证可得最小 X=32（此时 32×33/2=528=11×48），落在 20-40 之间。" }]}]},
  {
    id: "normal-equation",
    categoryId: "equation",
    type: "method",
    title: "普通方程法",
    summary: "普通方程法适合等量关系清晰的题，核心是设未知量、找等量关系并列方程。",
    preview: "找等量关系：和差倍比；设中间量，让多个表达式相等",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "找等量关系", items: ["和差倍比是最常见的等量关系。", "题干出现“共、差、倍、比、剩余、增加减少”时，优先翻译成方程。", "多个量通过运算能得到同一个值时，可设中间量统一表达。"] },
        { type: "steps", label: "解题步骤", items: ["明确要求的量和相关量。", "选择最顺手的未知数，必要时设中间量。", "把题干中的和差倍比关系逐句翻译成等式。", "解方程后回到问题，检查单位、人数、件数等整数条件。"] },
        { type: "tip", variant: "success", title: "避坑提示", content: "普通方程不是一定要设最终所求量；若多个对象都能用同一个中间量表示，设中间量更快。" }] },
      { id: "真题示例", title: "真题示例", blocks: [
        { type: "example", source: "2021 国考", label: "真题示例·和差倍比",
          stem: "甲、乙两个单位周末分别安排 60% 和 75% 的职工下沉社区帮助困难群众，其中甲单位派出的职工比乙单位少 3。后两单位又在剩下的职工中，分别抽调 40% 和 75% 的职工，共计 24 人参加培训。问甲单位职工人数比乙单位：",
          options: [{ key: "A", text: "少三人" }, { key: "B", text: "少十一人" }, { key: "C", text: "多三人" }, { key: "D", text: "多十一人" }],
          answer: "D",
          analysis: "设甲 x 人、乙 y 人。下沉人数关系：0.6x - 0.75y = -3；培训人数关系：0.4×0.4x + 0.25×0.75y = 24。解得 x=75，y=64，甲比乙多 11 人。" }] }]},
  {
    id: "indeterminate-equation",
    categoryId: "equation",
    type: "method",
    title: "不定方程",
    summary: "未知数多于方程时，优先利用奇偶、尾数、整除、特值和选项代入。",
    preview: "不定方程：奇偶/尾数/整除；不定方程组：特值法",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "formula", label: "基本形态", content: "未知数个数 > 方程个数" },
        { type: "steps", label: "不定方程解题步骤", items: ["奇偶性：未知数前的系数存在一奇一偶时，优先判断奇偶。", "尾数性：未知数前的系数尾数是 0 或 5 时，优先看尾数。", "整除法：未知数系数与常数存在整除关系时，优先用整除约束。", "代入法：将选项代入方程，或把一个未知数集中到一边再试。"] },
        { type: "rule", title: "不定方程组", items: ["常见形态是 3 个未知数、2 个方程。", "优先使用加减消元法，把多个方程合并成更简单的关系。", "遇到“最难算的数”或范围较宽的变量，可用特值法先赋为 0。", "代入选项时，从最小或最大选项开始尝试，通常能快速锁定整数解。"] },
        { type: "tip", variant: "warning", title: "OCR 复核", content: "原 OCR 中一处方程符号方向疑似错误，已在复核文档列出；本卡按题意和通用解法整理。" }] },
      { id: "example", title: "例题讲解", blocks: [
        { type: "example", label: "例题一·不定方程", stem: "10 位选手获一、二、三等奖，总分 61，问最多几位一等奖。", analysis: "设一等奖 x、二等奖 y、三等奖 z：9x+5y+2z=61，x+y+z=10，消元得 7x+3y=41。从 x 最大的选项代入，可得 x=5。" },
        { type: "example", label: "例题二·不定方程组", stem: "一等奖得 9 分、二等奖得 5 分、三等奖得 2 分。甲队共 10 位选手参赛且均获奖，总分 61，求最多有几位一等奖。", options: [{ key: "A", text: "3" }, { key: "B", text: "4" }, { key: "C", text: "5" }, { key: "D", text: "6" }], answer: "C", analysis: "设一等奖 x 人、二等奖 y 人、三等奖 z 人。列式：9x+5y+2z=61，x+y+z=10。消元得 7x+3y=41。问最多，从较大选项代入：x=5 时 y=2、z=3，符合整数条件。" }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2021 国考", label: "真题示例一·比例+方程",
            stem: "甲、乙两个单位周末分别安排 60% 和 75% 的职工下沉社区帮助困难群众，其中甲单位派出的职工比乙单位少 3，后两单位又在剩下的职工中，分别抽调 40% 和 75% 的职工，共计 24 人参加周末的业务培训。问甲单位职工人数比乙单位：",
            options: [
              { key: "A", text: "少三人" },
              { key: "B", text: "少十一人" },
              { key: "C", text: "多三人" },
              { key: "D", text: "多十一人" }],
            answer: "D",
            analysis: "0.6甲-0.75乙=3，0.4×0.4甲+0.25×0.75乙=24。化简得 4/25甲+3/16乙=24。最小整数解：甲=75，乙=64，差 11 人，甲比乙多 11 人。" },
          { type: "example", source: "2019 联考", label: "真题示例二·消元",
            stem: "某次田径运动会中，选手参加各单项比赛计入所在团体总分的规则为：一等奖得 9 分，二等奖得 5 分，三等奖得 2 分。甲队共有 10 位选手参赛，均获奖。现知甲队最后总分为 61 分，问该队最多有几位选手获得一等奖：",
            options: [
              { key: "A", text: "3" },
              { key: "B", text: "4" },
              { key: "C", text: "5" },
              { key: "D", text: "6" }],
            answer: "C",
            analysis: "设一等奖 x、二等奖 y、三等奖 z：9x+5y+2z=61, x+y+z=10。消元得 7x+3y=41。问最多，从大代入：x=5 时 3y=6，y=2, z=3，全为整数解。" }]}]},
  {
    id: "concentration-cross",
    categoryId: "concentration",
    type: "method",
    title: "浓度与十字相乘",
    summary: "浓度问题先抓溶质、溶液、浓度三者关系，混合题常用十字相乘。",
    preview: "浓度 = 溶质 / 溶液；混合比例看目标浓度与两端浓度差",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "formula", label: "核心公式", content: "浓度 = 溶质 / 溶液；溶质 = 溶液 × 浓度；溶液 = 溶质 + 溶剂" },
        { type: "rule", title: "溶质不变法", items: ["无论溶液如何加水、蒸发或混合，溶质质量不会凭空发生改变。", "题干出现加水、蒸发、稀释、浓缩时，优先围绕溶质列等量关系。"] },
        { type: "formula", label: "十字相乘", content: "溶液A质量 / 溶液B质量 = (R - B) / (A - R)" },
        { type: "image-note", label: "方法示意", title: "十字交叉法与线段法", src: "data-analysis/mixture-cross-01-cross-line-method.png" },
        { type: "rule", title: "类浓度问题", items: ["凡是能表示成 A = B / C 形式的比例关系，都可以看成类浓度问题。", "利用十字相乘求出的比例关系，一定是 C（即分母）之比。", "目标值 R 必须位于两端值 A、B 之间，交叉相减后对应另一端的量。"] },
        { type: "tip", variant: "success", title: "速记提示", content: "浓度题看溶质是否不变；类浓度题先判断分子、分母和比例值，再用十字相乘求分母之比。" }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 山东", label: "真题示例·类浓度",
            stem: "由于改良了种植技术，农场 2017 年种植的 A 和 B 两种作物，产量分别增加了 10% 和 25%。已知 2017 年两种作物总产量增加了 18%，问 2017 年 A 和 B 两种作物的产量之比为：",
            options: [{ key: "A", text: "7:8" }, { key: "B", text: "8:7" }, { key: "C", text: "176:175" }, { key: "D", text: "77:100" }],
            answer: "D",
            analysis: "把增长率看成类浓度：A 为 10%，B 为 25%，混合增长率 R 为 18%。十字相乘求出的是前期量之比，A:B = (25%-18%):(18%-10%) = 7:8。题目问 2017 年产量之比，所以用 2016 年比例乘增长后产量：(7×1.1):(8×1.25)=77:100。" }]}]},
  {
    id: "cow-eating-grass",
    categoryId: "inclusion",
    type: "method",
    title: "牛吃草问题",
    summary: "本质是原有存量、每日新增量和每日消耗量之间的关系。",
    preview: "完成天数 = 原有量 / (每日消耗量 - 每日新增量)",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "基本概念", items: ["草地原有草量可看成初始存量，草会按固定速度持续生长。", "不同数量的牛吃同一片草地，完成天数不同，本质是“存量 + 新增量 - 消耗量”的动态平衡。", "题干中的挖沙、排水、清淤等连续新增问题，都可以转化为牛吃草模型。"] },
        { type: "formula", label: "核心公式", content: "天数 = 原有草量 / (每日消耗量 - 每日新增量)" },
        { type: "compare", label: "模型拆分", left: { title: "干活牛", content: "消耗原有草", items: ["负责处理存量", "决定完成速度"] }, right: { title: "白吃牛", content: "抵消新增草", items: ["对应每日新增量", "先求出来再算存量"] } },
        { type: "steps", label: "解题步骤", items: ["先求白吃牛：用两组已知条件比较，求每日新增量需要多少头牛抵消。", "再求原有草：任选一组条件，用（每日消耗能力 - 每日新增量）× 天数求原有存量。", "最后代问中数字：完成天数 = 原有草量 / (问中每日消耗能力 - 每日新增量)；若问所需牛数，反向计算并向上取整。"] }] },
      { id: "example", title: "例题讲解", blocks: [{ type: "example", label: "例题", stem: "1 台挖沙机 300 天完成，2 台 100 天完成，要求 25 天内完成，至少几台？", analysis: "新增量折合 0.5 台/天，原有量为 (2-0.5)×100=150。25 天需 150/25=6 台处理存量，再加 0.5 台抵消新增，向上取整为 7 台。" }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2019 联考", label: "真题示例",
            stem: "某河道由于淤泥堆积影响到船只航行安全，现由工程队使用挖沙机进行清淤工作，清淤时上游河水又会带来新的泥沙。若使用 1 台挖沙机 300 天可完成清淤工作，使用 2 台挖沙机 100 天可完成清淤工作。为了尽快让河道恢复使用，上级部门要求工程队 25 天内完成河道的全部清淤工作，那么工程队至少要有多少台挖沙机同时工作：",
            options: [
              { key: "A", text: "4" },
              { key: "B", text: "5" },
              { key: "C", text: "6" },
              { key: "D", text: "7" }],
            answer: "D",
            analysis: "把新增淤泥看成白吃牛。白吃牛 = (1×300-2×100)/(300-100) = 0.5 台/天，表示每天新增淤泥需要 0.5 台挖沙机抵消。原有淤泥 = (2-0.5)×100 = 150。25 天内完成，干活牛需 150/25=6 台，再加 0.5 台白吃牛，共 6.5 台，至少取 7 台。" }]}]},
  {
    id: "inclusion-exclusion",
    categoryId: "inclusion",
    type: "formula",
    title: "容斥问题",
    summary: "容斥是集合计数方法，核心是去掉重复计数。",
    preview: "|A∪B| = |A| + |B| - |A∩B|",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "rule", title: "计数原理", items: ["容斥是一种集合计数方法：先把相关对象全部计入，再减去被重复计算的部分。", "目标是让每个人或每个对象最终只被计算一次。", "题干出现“至少参加一项”“同时参加”“只参加”“都不参加”时，优先判断圈内与圈外。"] },
        { type: "formula", label: "总人次关系", content: "|U| - |圈外| = |圈内| = 总人次 - 重复部分" },
        { type: "formula", label: "两集合", content: "|A∪B| = |A| + |B| - |A∩B|；|U| = |A∪B| + |圈外|" },
        { type: "formula", label: "三集合", content: "|A∪B∪C| = |A| + |B| + |C| - |A∩B| - |A∩C| - |B∩C| + |A∩B∩C|" },
        { type: "formula", label: "n集合通式", content: "|A1∪A2∪...∪An| = S1 - S2 + S3 - ... + (-1)^(n-1)Sn" },
        { type: "formula", label: "交集和定义", content: "S1 = 单集合人数之和；S2 = 两两交集人数之和；S3 = 三者交集人数之和" },
        { type: "formula", label: "三集合进阶", content: "只满足一项 = S1 - 2S2 + 3S3；只满足两项 = S2 - 3S3；至少两项 = S2 - 2S3" },
        { type: "formula", label: "至少与恰好", content: "至少一项 = S1 - S2 + S3；恰好一项 + 恰好两项 + 恰好三项 = 至少一项" },
        { type: "rule", title: "读题规则", items: ["先判断有没有圈外人数，圈内人数才等于至少满足一项的人数。", "区分“只参加”“恰好参加”“至少参加”和“同时参加”，它们对应的区域不同。", "三集合题可以画区域或设只满足某类的人数，再利用 S1、S2、S3 与总人次列式。"] }] },
      { id: "example", title: "例题讲解", blocks: [{ type: "example", label: "例题", stem: "300 人参加地理或生物兴趣小组，80% 参加地理，50% 参加生物，问同时参加两组人数。", analysis: "地理 240 人，生物 150 人。300 = 240 + 150 - X，所以 X = 90。" }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 联考", label: "真题示例一·两集合",
            stem: "学校有 300 个学生选择参加地理兴趣小组、生物兴趣小组或者两个小组同时参加，如果 80% 学生参加地理兴趣小组，50% 学生参加生物兴趣小组。问同时参加地理和生物兴趣小组的学生人数是多少：",
            options: [
              { key: "A", text: "240" },
              { key: "B", text: "150" },
              { key: "C", text: "90" },
              { key: "D", text: "60" }],
            answer: "C",
            analysis: "没有圈外人数，所以圈内人数就是 300。地理 240 人，生物 150 人，总人次为 390；重复部分就是同时参加两组的人数 X。由 300 = 240 + 150 - X，解得 X=90。" },
          { type: "example", source: "2019 下半年四川", label: "真题示例二·三集合",
            stem: "某单位乒乓球、羽毛球、篮球三个兴趣小组共有 72 人参加。已知同时参加 3 个小组的人数为 0，只参加羽毛球小组的人数是只参加乒乓球小组人数的 4 倍，只参加篮球小组的有 11 人，同时参加两个小组的人数与只参加 1 个小组的人数相同，参加乒乓球小组但未参加篮球小组的人中有一半参加羽毛球小组。问参加包括篮球在内的两个小组的有：",
            options: [
              { key: "A", text: "32 人" },
              { key: "B", text: "31 人" },
              { key: "C", text: "25 人" },
              { key: "D", text: "24 人" }],
            answer: "B",
            analysis: "按区域设数。设只参加乒乓球 X 人，则只参加羽毛球 4X 人，只参加篮球 11 人，所以只参加 1 个小组的人数为 5X+11。题干给出同时参加 2 个小组的人数与只参加 1 个小组人数相同，且三者同时参加为 0，因此总数 (5X+11)×2=72，解得 X=5。参加包括篮球在内的两个小组人数 = 总人数 72 - 只羽毛球 20 - 只乒乓球 5 - 乒乓球且羽毛球 5 - 只篮球 11 = 31。" }]}]},
  {
    id: "cycle-remainder",
    categoryId: "cycle-date",
    type: "method",
    title: "周期循环",
    summary: "周期题把问题转化为余数，关键是找到循环长度和起点。",
    preview: "去掉完整周期，余数决定位置；多个周期看最小公倍数",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "解题实质", items: ["周期循环题的核心是去掉完整周期，只保留余数。", "余数表示落在本轮周期中的第几个位置；余数为 0 时，对应周期最后一项。", "两个或多个循环同时回到同一状态时，整体周期取各自周期的最小公倍数。"] },
      { type: "steps", label: "解题步骤", items: ["找循环周期。", "确定起点和目标位置。", "用总量除以周期，看余数。", "多个循环叠加时，先求最小公倍数，再用余数判断。"] },
      { type: "tip", variant: "warning", title: "易错提醒", content: "“每 5 天一次”通常周期为 5 天；“每隔 5 天一次”中间隔了 5 天，实际周期为 6 天。" }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 联考", label: "真题示例",
            stem: "某种产品每箱 48 个，小李第 1 天制作 1 个，以后每天比前一天多制作 1 个。X 天后总共制作了整数箱产品，X 的最小值在哪个范围？",
            options: [{ key: "A", text: "41-60" }, { key: "B", text: "超过 60" }, { key: "C", text: "不到 20" }, { key: "D", text: "20-40" }],
            answer: "D",
            analysis: "总数 = X(X+1)/2 = 48n。整理得 X(X+1)=96n。X 与 X+1 一奇一偶，逐一验证可得最小 X=32，此时 32×33/2=528=11×48，落在 20-40 之间。" },
          { type: "example", source: "2018 浙江事业编", label: "真题示例·最小公倍数",
            stem: "某单位男员工 15 人、女员工 10 人，同一到周日每天晚上安排一名男员工值班，15 人轮流；周六、周日白天每天安排一名女员工值班，10 人轮流。A 男和 B 女恰好分别安排在 7 月 5 日值班，若不考虑调休，则下一次两人被安排在同一天值班是：",
            options: [{ key: "A", text: "9 月 15 日" }, { key: "B", text: "10 月 18 日" }, { key: "C", text: "11 月 21 日" }, { key: "D", text: "12 月 2 日" }],
            answer: "B",
            analysis: "男员工 15 名每天轮值，周期为 15 天；女员工 10 名每周末白天 2 人值班，5 周循环一次，周期为 35 天。两人循环的共同周期是最小公倍数 105 天，约为 3 个半月。7 月 5 日往后推 105 天，为 10 月 18 日。" },
          { type: "example", source: "2022 江苏", label: "真题示例·代入选项",
            stem: "人类体力、情绪、智力分别以 22 天、28 天、33 天为周期循环，前半为高潮期。过公历生日时三者同时处于高潮期的最小年龄是：",
            options: [{ key: "A", text: "4 周岁" }, { key: "B", text: "3 周岁" }, { key: "C", text: "2 周岁" }, { key: "D", text: "1 周岁" }],
            answer: "C",
            analysis: "代入选项，从最小年龄开始看余数。1 周岁：365÷22 余 13，13>22/2，不在高潮期，排除。2 周岁：730÷22 余 4，4<22/2；730÷28 余 2，2<28/2；730÷33 余 4，4<33/2，三项均处于高潮期。" }] }
    ]},
  {
    id: "date-week",
    categoryId: "cycle-date",
    type: "method",
    title: "日期星期",
    summary: "星期每 7 天循环一次，跨年跨月时先算经过天数，再看除以 7 的余数。",
    preview: "先粗算，再修正，加上日期差",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "核心关系", content: "星期每 7 天循环一次；经过天数除以 7 的余数，就是星期往后推的天数" },
      { type: "steps", label: "计算思路", items: ["先粗算整年、整月经过的天数。", "再根据平年、闰年、大小月修正。", "最后加上日期差，除以 7 看余数，余几就把星期往后推几天。"] },
      { type: "rule", title: "年份规则", items: ["平年 365 天 = 52 周 + 1 天，星期推进 1 天。", "闰年 366 天 = 52 周 + 2 天，星期推进 2 天。", "四年一闰，百年不闰，四百年再闰：能被 4 整除通常是闰年，整百年份需能被 400 整除才是闰年。"] },
      { type: "rule", title: "月份规则", items: ["大月：1、3、5、7、8、10、12 月，31 天 = 4 周 + 3 天。", "小月：4、6、9、11 月，30 天 = 4 周 + 2 天。", "2 月：平年 28 天 = 4 周；闰年 29 天 = 4 周 + 1 天。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2013 国考", label: "真题示例",
            stem: "根据国务院办公厅公布的节假日安排通知，某年 8 月份有 22 个工作日，那么当年的 8 月 1 日可能是：",
            options: [{ key: "A", text: "周一或周三" }, { key: "B", text: "周三或周日" }, { key: "C", text: "周一或周四" }, { key: "D", text: "周四或周日" }],
            answer: "D",
            analysis: "8 月有 31 天，可以拆成 4 个完整星期再多 3 天。4 个完整星期一定有 20 个工作日，题干说共有 22 个工作日，说明多出来的 3 天里要有 2 个工作日。看 8 月 1、2、3 日这连续 3 天，能恰好有 2 个工作日的组合是周四、周五、周六，或周日、周一、周二，所以 8 月 1 日可能是周四或周日。" }] }
    ]},
  {
    id: "work-efficiency",
    categoryId: "work",
    type: "formula",
    title: "工程问题",
    summary: "工程问题围绕工作总量、效率和时间三者关系，常用赋值法统一总量。",
    preview: "工作总量 = 效率 × 时间",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "formula", label: "核心公式", content: "工作总量 = 工作效率 × 工作时间", nodes: formulaNodes.workEfficiency },
        { type: "formula", label: "拓展公式", content: "工作总量 = 效率和 × 时间" },
        { type: "formula", label: "变形公式", content: "工作效率 = 工作总量 / 工作时间；工作时间 = 工作总量 / 工作效率" },
        { type: "rule", title: "解题本质", items: ["工程问题先把题干中的时间、效率、完成量统一到同一单位。", "核心是找等量关系：各阶段完成量之和 = 工作总量。", "每个阶段的完成量都可以写成“效率 × 时间”。"] },
        { type: "rule", title: "给完工时间", items: ["题干给出甲、乙、丙单独完成时间时，优先赋工作总量为这些时间的最小公倍数。", "再用“效率 = 总量 ÷ 单独完工时间”分别求甲、乙、丙效率。", "合作时效率相加；先做了一段时间的，先算已完成量并从总量中扣除。", "剩余任务再除以剩余人员的效率和，得到剩余合作时间或某人的总工作时间。"] },
        { type: "rule", title: "给效率比例", items: ["题干只给效率倍数或比例时，把比例直接设为效率。", "遇到小数倍数，如 2.5 倍，先化成整数比 5:2，再设效率。", "有已知持续天数时，用“总量 = 各状态效率 × 对应天数之和”列式。", "如果只给某一种状态的可用天数，先用该状态效率 × 天数推出总量，再回到题干实际天数列总量等式。", "这类题常见于水箱、浇水、进出水、机器效率等情境。"] },
        { type: "rule", title: "给不同安排", items: ["题干给出任务量关系、效率和完成时间差时，先抓三组关系：任务量倍数、效率数值、时间差。", "优先设较简单的未知量，如乙用 t 天、较小任务量为 x，另一个量用题干关系表示。", "按“任务量 = 效率 × 时间”分别表示甲、乙任务量。", "再把任务量倍数或总量关系转成等式，解出时间、任务量或总工作量。"] },
        { type: "rule", title: "常见列式模型", items: ["同做：工作总量 = (甲效率 + 乙效率 + ...) × 合作时间。", "轮流或分阶段：每段完成量分别写成“效率 × 时间”，最后相加。", "中途换人：总量 - 已完成量 = 剩余效率和 × 剩余时间。", "进出水或消耗类：把进入看作正效率，流出或消耗看作负效率，再按净效率列式。", "同一工程不同方案：不同方案的完成量都指向同一个总量，可直接列等量关系。"] },
        { type: "steps", label: "解题步骤", items: ["先判断题型：给完工时间、给效率比例，还是给不同安排。", "能赋值就先赋总量，通常赋为完工时间的最小公倍数；给比例时可直接赋效率。", "把每个对象、每个阶段完成的工作量写成“效率 × 时间”。", "把完成量相加，等于总工作量、剩余工作量或题干给出的任务量关系。"] },
        { type: "tip", variant: "success", title: "快速判断", content: "给完工时间，赋总量最小公倍数；给效率比例，先化整数比再当效率；给不同安排，抓任务量倍数、效率、时间差三组关系。" }] },
      { id: "真题示例", title: "真题示例", blocks: [
        { type: "example", source: "2018 江苏", label: "真题示例·合作工程",
          stem: "手工制作一批元宵节花灯，甲、乙、丙三位师傅单独做分别要 40、48、60 小时完成。三人共同制作 4 小时后，剩余任务由乙、丙一起完成，则乙在整个花灯制作过程中所投入的时间是：",
          options: [
            { key: "A", text: "24 小时" },
            { key: "B", text: "25 小时" },
            { key: "C", text: "26 小时" },
            { key: "D", text: "28 小时" }],
          answer: "A",
          analysis: "赋总量为 40、48、60 的最小公倍数 240。甲、乙、丙效率分别为 6、5、4。三人合作 4 小时完成 (6+5+4)×4=60，剩余 180。剩余由乙、丙合作，效率为 5+4=9，需要 180÷9=20 小时。乙一共工作 4+20=24 小时。" },
        { type: "example", source: "2016 国考", label: "真题示例·效率比例",
          stem: "某浇水装置可根据天气阴晴调节浇水量，晴天浇水量为阴雨天的 2.5 倍。灌满该装置的水箱后，在连续晴天的情况下可为植物自动浇水 18 天。小李 6 月 1 日 0:00 灌满水箱后，7 月 1 日 0:00 正好用完。问 6 月有多少个阴雨天？",
          options: [{ key: "A", text: "10" }, { key: "B", text: "16" }, { key: "C", text: "18" }, { key: "D", text: "20" }],
          answer: "D",
          analysis: "把效率比例直接当作效率。晴天浇水量是阴雨天的 2.5 倍，可设阴雨天效率为 2、晴天效率为 5。连续晴天可用 18 天，所以水箱总量 = 18×5=90。6 月有 30 天，设阴雨天 X 天，则晴天为 30-X 天，列式：90 = 2X + 5(30-X)，解得 X=20 天。" },
        { type: "example", source: "2019 国考", label: "真题示例·不同安排",
          stem: "甲、乙两人生零件，甲的任务量是乙的 2 倍，甲每天生产 200 个零件，乙每天生产 150 个零件，甲完成任务的时间比乙多 2 天，则甲、乙任务量总共为多少个零件？",
          options: [{ key: "A", text: "1200" }, { key: "B", text: "1800" }, { key: "C", text: "2400" }, { key: "D", text: "3600" }],
          answer: "B",
          analysis: "设乙完成任务用 t 天，则甲用 t+2 天。甲任务量是乙的 2 倍，列式：200×(t+2)=2×150×t，解得 t=4。乙任务量 = 150×4=600 个，甲任务量 = 600×2=1200 个，总量 = 1200+600=1800 个。" }] }]
    },
  {
    id: "profit-core",
    categoryId: "profit",
    type: "formula",
    title: "利润问题",
    summary: "利润题先分清成本、定价、售价、利润率和数量，再找总量等式。",
    preview: "售价 = 成本 + 利润；利润率 = 利润 / 成本",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "核心公式", content: "售价 = 成本 + 利润；利润 = 售价 - 成本；利润率 = 利润 / 成本" },
      { type: "formula", label: "售价关系", content: "售价 = 成本 × (1 + 利润率)" },
      { type: "formula", label: "总量关系", content: "总成本 = 单个成本 × 数量；总利润 = 单个利润 × 数量；总销售金额 = 单个售价 × 数量" },
      { type: "rule", title: "推荐方法", items: ["首选方程法：把售价、成本、利润、数量按题干关系列等式。", "题干只给比例、增长率或百分数时，时机合适可赋值，如赋原销量 100、原成本 100。", "分批销售要按每一批分别计算收入，再用总收入、总成本或总利润目标列式。"] },
      { type: "rule", title: "常见名词", items: ["售价是最终卖出的价格，定价是最初标出的价格，二者不要混用。", "折扣只和原定价有关，打三折表示实际售价 = 原定价 × 30%。", "若题干问降价率或折扣率，通常看少了几成；打三折对应少了 70%，但要以题干定义为准。", "利润率的分母通常是成本，例如成本 100、利润 30，则利润率为 30%。"] },
      { type: "rule", title: "题型识别", items: ["基础利润问题：直接围绕成本、售价、利润、利润率列式。", "增长率相关利润问题：常把销量看成“总利润 ÷ 单利润”，再用比值增长率。", "分批销售利润问题：第一部分销售收入 + 第二部分销售收入 = 总销售收入或目标收入。"] }] },
      {
      id: "真题示例",
      title: "真题示例",
      blocks: [
        { type: "example", source: "2020 北京", label: "真题示例·基础利润",
          stem: "某商品成本为 200 元，售价为 292 元，公司调整售价为 268 元，预计日销量上涨 15%。要保持降价前单日利润，单件生产成本至少降低：",
          options: [{ key: "A", text: "4%" }, { key: "B", text: "5%" }, { key: "C", text: "6%" }, { key: "D", text: "8%" }],
          answer: "C",
            analysis: "赋值调整前销量为 100。调整前单件利润 = 292-200 = 92，调整前单日利润 = 92×100。销量上涨 15% 后为 115，要保持单日利润不变，调整后单件利润 = 92×100÷115 = 80。新售价为 268，则新成本 = 268-80 = 188，成本降低 (200-188)/200 = 6%。" },
          { type: "example", source: "2019 联考", label: "真题示例·增长率相关利润",
            stem: "2016 年某电子产品定价 n 元/台，2017 年定价降低 10%，每台利润提升 10%，年总利润较 2016 年增加 21%。2017 年销量比 2016 年：",
            options: [{ key: "A", text: "提高了不到 20%" }, { key: "B", text: "提高了 20% 或以上" }, { key: "C", text: "降低了不到 20%" }, { key: "D", text: "降低了 20% 或以上" }],
            answer: "A",
            analysis: "销量 = 总利润 ÷ 单件利润，属于比值增长率。总利润增长率 R1=21%，单件利润增长率 R2=10%，销量增长率 = (R1-R2)/(1+R2) = (21%-10%)/(1+10%) = 10%，所以提高了不到 20%。" },
          { type: "example", source: "2017 联考", label: "真题示例·分批销售利润",
            stem: "商场以每件 80 元购进某品牌衬衫 500 件，以每件 120 元销售了 400 件，要达到盈利 45% 的预期目标，剩下的衬衫最多可以降价：",
            options: [{ key: "A", text: "15 元" }, { key: "B", text: "16 元" }, { key: "C", text: "18 元" }, { key: "D", text: "20 元" }],
            answer: "D",
            analysis: "设剩下的每件降价 x 元。目标总收入 = 总成本×(1+45%) = 80×500×1.45。按分批销售列式：120×400 + (120-x)×(500-400) = 80×500×1.45，解得 x=20。" }]}
    ]},
  {
    id: "drawer-principle",
    categoryId: "extremum",
    type: "method",
    title: "抽屉原理",
    summary: "保证至少发生某事时，按最不利情况构造。",
    preview: "保证数 = 最不利情况 + 1",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "核心口诀", content: "保证发生 = 最不利情况 + 1" },
      { type: "formula", label: "至少 n 个", content: "至少保证 n 个 = 每类最多取 (n - 1) 个的总数 + 1" },
      { type: "steps", label: "解题步骤", items: ["先明确要保证的目标，如至少 5 位同一专业。", "构造目标刚好不发生的最多情况，即每一类都尽量取到上限但不满足目标。", "把最不利情况人数加 1，就能保证目标发生。", "若某类本身数量不足 n-1 个，只能把该类全部取完，不能硬按 n-1 个计算。"] },
      { type: "tip", variant: "success", title: "速记提示", content: "问“至少选多少才能保证”，优先想最不利情形；先让要求尽量不发生，再多取 1 个。" }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2017 辽宁", label: "真题示例·最不利问题",
            stem: "某高校举办一次读书会，共有 37 位同学报名参加，其中中文、历史、哲学专业各有 10 位同学报名参加此次读书会，另外还有 4 位化学专业学生和 3 位物理专业学生也报名参加此次读书会。那么一次至少选出多少位学生，能保证选出的学生中至少有 5 位学生是同一专业的？",
            options: [{ key: "A", text: "17" }, { key: "B", text: "20" }, { key: "C", text: "19" }, { key: "D", text: "39" }],
            answer: "B",
            analysis: "先构造最不利情况：中文、历史、哲学各选 4 人，仍不能保证某一专业达到 5 人；化学只有 4 人、物理只有 3 人，不足 5 人，可以全部选入。最不利人数 = 4+4+4+4+3 = 19，再多选 1 人，必然使中文、历史、哲学中至少一个专业达到 5 人，所以至少选 20 人。" }] }
    ]},
  {
    id: "extreme-construction",
    categoryId: "extremum",
    type: "method",
    title: "最值构造",
    summary: "最值题常用和定构造、函数最值、乘积最值和三端最值。",
    preview: "和定看均衡或极端；函数看顶点；三端看两端",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "和定最值", items: ["几个数的和固定，问某部分最多，则让其他部分尽量少。", "问某部分最少，则让其他部分尽量多。", "涉及互不相同且为整数时，常设目标数为 X，其他数按 X+1、X+2 或 X-1、X-2 构造。", "若题干问第 k 大或第 k 小，先把比它更大或更小的元素推到极限，再用总和列式。"] },
      { type: "formula", label: "二次函数", content: "y = ax^2 + bx + c" },
      { type: "rule", title: "函数最值", items: ["若 a > 0，抛物线开口向上，取最小值；若 a < 0，开口向下，取最大值。", "顶点横坐标 x = -b / 2a。", "利用对称性：当 y = 0 时，若两个根为 x1、x2，则对称轴 x = (x1 + x2) / 2。", "利润、收入、面积随价格或边长变化的题，常可设变量后化成二次函数。"] },
      { type: "rule", title: "乘积最值", items: ["形如 a1×b1 + a2×b2 = 总和 的题，要先确定每组的平均值。", "要让 a1 最多，通常让 b1 尽量接近平均值、b2 尽量远离平均值。", "要让 a1 最少，通常反过来构造。", "人数、分数、件数等要求为整数时，最后要向符合条件的整数修正。"] },
      { type: "rule", title: "三端最值", items: ["有三种配比或三类含量时，若要某端尽量多，就让另一端尽量少。", "常用守恒量列式，如总质量、总浓度、总收入不变。", "两端一多一少时，可以把中间量作为参照，用十字相乘或方程求极限。"] },
      { type: "tip", variant: "warning", title: "易错提醒", content: "最值题最怕漏限制条件，先把“不同、至少、至多、整数、最多、最少”等词圈出来。" }] },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          { type: "example", source: "示例题", label: "例题·乘积最值",
            stem: "某班级有 30 人，平均分为 70 分，所有人得分均为整数，不及格的人数最多有多少人？",
            analysis: "要让不及格人数尽量多，其他人的分数应尽量高，不及格者分数应尽量接近及格线。可设不及格人数为 X，及格人数为 30-X；不及格者取最高 59 分，及格者取最高 100 分，则 59X + 100(30-X) ≥ 30×70，解得 X ≤ 21.95，所以不及格人数最多为 21 人。" },
          { type: "example", source: "示例题", label: "例题·三端最值",
            stem: "有 80%、50%、20% 浓度盐水各 100g，想配成 50% 浓度盐水 100g，最多可使用多少 80% 浓度盐水？",
            analysis: "要让 80% 盐水用得最多，20% 盐水也要尽量多，50% 盐水尽量少。设 80% 盐水取 x 克、20% 盐水取 100-x 克，暂不取 50% 盐水，按溶质守恒列式：0.8x + 0.2(100-x) = 0.5×100，解得 x=50 克。" }]}
      , { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 联考", label: "真题示例·和定最值",
            stem: "6 辆货车平均装货 62 吨，载重量各不相同且为整数，最重 71 吨，最轻 54 吨，第三重的卡车至少装了多少吨？",
            options: [{ key: "A", text: "59" }, { key: "B", text: "60" }, { key: "C", text: "61" }, { key: "D", text: "62" }],
            answer: "B",
            analysis: "设第三重装 x 吨。要求第三重最少，就让其他车尽量多装，且各不相同。已知最重 71 吨、最轻 54 吨，第二重最多 70 吨，第四重和第五重可构造为 x-1、x-2。总量为 6×62=372，列式 71+70+x+(x-1)+(x-2)+54=372，解得 x=60。" },
          { type: "example", source: "2018 联考", label: "真题示例·函数最值",
            stem: "某苗木公司准备出售一批苗木，如果每株以 4 元出售，可卖出 20 万株；若苗木单价每提高 0.4 元，就会少卖 1 万株。问在最佳定价的情况下，该公司最大收入是多少万元？",
            options: [{ key: "A", text: "60" }, { key: "B", text: "80" }, { key: "C", text: "90" }, { key: "D", text: "100" }],
            answer: "C",
            analysis: "设提高 0.4x 元，销量减少 x 万株，则收入 y=(4+0.4x)(20-x)。令 y=0，两个根分别是 x=-10 和 x=20；抛物线开口向下，对称轴 x=(-10+20)/2=5，此时收入最大。代入得 y=(4+0.4×5)×(20-5)=6×15=90 万元。" }] }
    ]},
  {
    id: "permutation-combination",
    categoryId: "combinatorics",
    type: "method",
    title: "排列组合",
    summary: "排列看顺序，组合不看顺序；分类用加法，分步用乘法。",
    preview: "排列 A；组合 C；分类加法；分步乘法",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "排列", content: "A_n^m = n! / (n-m)! = n(n-1)(n-2)...(n-m+1)", nodes: [
        { type: "script", base: { type: "text", value: "A" }, sub: "n", sup: "m" },
        { type: "op", value: "=" },
        { type: "frac", numNodes: [
          { type: "text", value: "n!" },
        ], denNodes: [
          { type: "text", value: "(" },
          { type: "text", value: "n-m" },
          { type: "text", value: ")!" },
        ] },
        { type: "op", value: "=" },
        { type: "text", value: "n(n-1)(n-2)...(n-m+1)" },
      ] },
      { type: "rule", title: "排列", items: ["从 n 个不同元素中取出 m 个元素，按照一定顺序排成一列。", "排列强调顺序，换顺序算不同情况。", "座次、排名、排队、岗位分配等通常优先考虑排列。"] },
      { type: "formula", label: "组合", content: "C_n^m = C_n^(n-m) = n! / [(n-m)!m!] = n(n-1)...(n-m+1) / [m(m-1)(m-2)...2×1]", nodes: [
        { type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "m" },
        { type: "op", value: "=" },
        { type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "n-m" },
        { type: "op", value: "=" },
        { type: "frac", numNodes: [
          { type: "text", value: "n!" },
        ], denNodes: [
          { type: "text", value: "(" },
          { type: "text", value: "n-m" },
          { type: "text", value: ")!" },
          { type: "text", value: "m!" },
        ] },
        { type: "op", value: "=" },
        { type: "frac", numNodes: [
          { type: "text", value: "n(n-1)...(n-m+1)" },
        ], denNodes: [
          { type: "text", value: "m(m-1)(m-2)...2×1" },
        ] },
      ] },
      { type: "rule", title: "组合", items: ["从 n 个不同元素中取出 m 个元素，只关心选哪些，不关心顺序。", "组合不强调顺序，换顺序不算新情况。", "选人、抽样、无序分组等通常优先考虑组合。"] },
      { type: "rule", title: "加法原理", items: ["分类计算。", "完成一件工作有多类方法，选择其中一类即可完成，用加法。", "若三类方法分别有 3 种、2 种、2 种选择，则总选择数为 3+2+2=7 种。"] },
      { type: "rule", title: "乘法原理", items: ["分步计算。", "完成一件工作需要依次做完多个步骤，缺一不可，用乘法。", "若三个步骤分别有 3 种、2 种、2 种选择，则总选择数为 3×2×2=12 种。"] },
      { type: "rule", title: "解题原则", items: ["有序为排列，无序为组合。", "分类用加法，分步用乘法。", "从特殊入手，先处理限制最多、位置最特殊、身份最特殊的对象。", "题干出现“至少”“否定”“不符合”等提示时，可考虑用全部情况减去不符合情况。"] },
      { type: "rule", title: "经典方法", items: ["相邻问题用捆绑法。", "不相邻问题用插空法。", "相同元素分组常用隔板法。", "错位排列用于全部不在原位。"] }] },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          { type: "example", source: "示例题", label: "例题",
            stem: "5 名工作人员周一至周五值班，每人一天，甲乙不能相邻，不同排班方式有多少种？",
            options: [{ key: "A", text: "36" }, { key: "B", text: "48" }, { key: "C", text: "72" }, { key: "D", text: "96" }],
            answer: "C",
            analysis: "插空法。先排其余 3 人 A(3,3) = 6 种，产生 4 个空位，选 2 个排甲乙 A(4,2) = 12 种。总计 6×12 = 72 种。" }]}
      , { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 北京", label: "真题示例·组合计数",
            stem: "某家电维修公司的职工每人每天最多完成 5 次修理任务。维修工小张上个月工作了 20 天，总计完成修理任务 98 次。则他上个月每天完成的修理任务次数有多少种不同的可能？",
            options: [{ key: "A", text: "190" }, { key: "B", text: "210" }, { key: "C", text: "380" }, { key: "D", text: "400" }],
            answer: "B",
            analysis: "若 20 天每天都完成 5 次，共完成 100 次。实际完成 98 次，相当于少完成 2 次。少完成的方式有两类：某 1 天少完成 2 次，情况数 C(20,1)=20；或某 2 天各少完成 1 次，情况数 C(20,2)=190。总数为 20+190=210 种。" },
          { type: "example", source: "2019 辽宁", label: "真题示例·逆向思维",
            stem: "某农村院准备挑选 2 男 2 女 4 名科技人员分别去市郊的甲、乙、丙、丁 4 个乡参加科技支农工作。在报名人员中有 3 男 4 女符合要求，在 4 名女性中有 1 位是农科院副院长。考虑到工作的具体需要，这名副院长不去甲乡，且去丁乡的是女性。符合条件的选法有多少种？",
            options: [{ key: "A", text: "198" }, { key: "B", text: "216" }, { key: "C", text: "378" }, { key: "D", text: "432" }],
            answer: "A",
            analysis: "“副院长不去甲乡”是否定条件，正面计算较繁，可用全部情况减去不符合情况。先只考虑“丁乡是女性”：丁乡从 4 名女性中选 1 人，有 C(4,1)=4 种；其余甲乙丙需要 2 男 1 女，从剩余人员中选 1 女、2 男并分配到 3 个乡，有 C(3,1)×C(3,2)×A(3,3)=54 种，全部情况为 4×54=216 种。不符合情况是副院长去甲乡、丁乡从其余 3 名女性中选 1 人、乙丙从 3 名男性中选 2 人并排列，有 C(3,1)×C(3,2)×A(2,2)=18 种。符合条件为 216-18=198 种。" }] }
    ]},
  {
    id: "adjacent-bundle",
    categoryId: "combinatorics",
    type: "method",
    title: "相邻问题",
    summary: "要求若干元素必须相邻时，先把它们捆成一个整体，再安排整体和内部顺序。",
    preview: "捆绑法：先捆成整体，再考虑内部排序",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "捆绑法", items: ["先把要求相邻的元素看成一个整体。", "再将整体与其他元素一起排列，此时总元素个数会发生变化。", "最后乘上相邻元素内部的排列数。", "相邻元素内部是否需要排序，要根据题干是否区分身份、顺序或位置来判断。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2019 下半年四川", label: "真题示例·捆绑法",
            stem: "某场科技论坛有 5G、人工智能、区块链、大数据和云计算 5 个主题，每个主题有 2 位发言嘉宾。如果要求每个主题的嘉宾发言次序各不相邻，问共有多少种不同的发言次序？",
            options: [{ key: "A", text: "120" }, { key: "B", text: "240" }, { key: "C", text: "1200" }, { key: "D", text: "3840" }],
            answer: "D",
            analysis: "先排五个主题，再安排每个主题内 2 位嘉宾的内部顺序。五个主题整体排列有 A(5,5)=120 种，每个主题内部有 A(2,2)=2 种，共 5 个主题，总数为 A(5,5)×A(2,2)^5=120×32=3840。" }] }
    ]},
  {
    id: "non-adjacent-insertion",
    categoryId: "combinatorics",
    type: "method",
    title: "不相邻问题",
    summary: "要求元素不相邻时，先排不受限制的主体，再把受限制元素插入空位。",
    preview: "插空法：先排主体，再插空",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "插空法", items: ["先将不受位置限制的人或物排列好。", "再将要求不相邻的元素插入已经形成的空位。", "插入时要注意受限制元素之间是否区分顺序。", "审题时确定空位范围：含两端位置通常有 n+1 个空，不含两端位置通常有 n-1 个空。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2017 联考", label: "真题示例·插空法",
            stem: "某兴趣组有男女生各 5 名，他们都准备了表演节目。现在需要选出 4 名学生各自表演 1 个节目，这 4 人中既要有男生，也要有女生，且不能由男生连续表演节目。那么，不同的节目安排有多少种？",
            options: [{ key: "A", text: "3600" }, { key: "B", text: "3000" }, { key: "C", text: "2400" }, { key: "D", text: "1200" }],
            answer: "C",
            analysis: "分两类。第一类选三女一男，先选人，再排三女，最后男生插空：C(5,3)×C(5,1)×A(3,3)×A(4,1)=10×5×6×4=1200。第二类选两女两男，先排两女，再把两个男生插入 3 个空位且男生有顺序：C(5,2)×C(5,2)×A(2,2)×A(3,2)=10×10×2×6=1200。一女三男时男生必然连续，不符合条件。总数 1200+1200=2400。" }] }
    ]},
  {
    id: "ordered-arrangement",
    categoryId: "combinatorics",
    type: "method",
    title: "定序问题",
    summary: "部分元素相对顺序已经确定时，先全排列，再除掉定序元素的内部全排列。",
    preview: "定序：全排列 / 定序元素全排列",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "定序公式", content: "定序安排数 = 全排列数 / 定序元素的全排列数" },
      { type: "rule", title: "思路", items: ["先把所有相关元素按普通方法全排列。", "再除掉已经定序的元素的全排列数。", "若 3 个元素相对顺序已经确定，全排列时把这 3 个元素的 3! 种内部顺序都算进去了，需要除以 A(3,3)。", "本质是这几个元素的顺序已经确定，无需再单独排列。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 国家", label: "真题示例·定序与捆绑",
            stem: "扶贫干部某日需要走访村内 6 个贫困户甲、乙、丙、丁、戊和己。已知甲和乙的走访次序要相邻，丙要在丁之前走访，戊要在丙之前走访，己只能在第一个或最后一个走访。问走访顺序有多少种不同的安排方式？",
            options: [{ key: "A", text: "24" }, { key: "B", text: "16" }, { key: "C", text: "48" }, { key: "D", text: "32" }],
            answer: "B",
            analysis: "甲乙相邻用捆绑法，内部排序 A(2,2)。丙在丁之前、戊在丙之前，相当于“戊、丙、丁”已定序。把甲乙整体、戊、丙、丁和己共 5 个元素排列，且己固定在第一个或最后一个位置，共 A(4,4)×A(2,2)×C(2,1)/A(3,3)=24×2×2/6=16。" }] }
    ]},
  {
    id: "identical-distribution",
    categoryId: "combinatorics",
    type: "method",
    title: "相同元素分配",
    summary: "相同元素分给不同对象，且每份至少一个时，用插板法快速计数。",
    preview: "插板法：C_(n-1)^(m-1)",
    previewNodes: [
      { type: "text", value: "插板法：" },
      { type: "script", base: { type: "text", value: "C" }, sub: "n-1", sup: "m-1" },
    ],
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "插板法公式", content: "把 n 个相同元素分给 m 个不同对象，每份至少 1 个：C_(n-1)^(m-1)" },
      { type: "rule", title: "插板法", items: ["使用条件：元素相同；对象不同；每份至少分得一个元素。", "把 n 个相同元素排成一排，中间有 n-1 个空。", "要分给 m 个不同对象，就在这些空里插入 m-1 块板。", "若题干不满足“每份至少一个”，先通过预先分配或变量变换构造条件。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2014 广州", label: "真题示例·插板法",
            stem: "某办公室接到 15 份公文的处理任务，分配给甲、乙、丙三名工作人员处理。假如每名工作人员处理的公文个数不得少于 3 份，但不得多于 10 份，则共有多少种分配方式？",
            options: [{ key: "A", text: "15" }, { key: "B", text: "18" }, { key: "C", text: "21" }, { key: "D", text: "28" }],
            answer: "D",
            analysis: "每人不少于 3 份，先给每人各 2 份来构造“每人至少一份”，剩下 9 份分给 3 人且每人至少 1 份。9 份中间有 8 个空，插入 2 块板，情况数为 C(8,2)=28。每人不多于 10 份在该构造下不会被超过。" }] }
    ]},
  {
    id: "equal-grouping",
    categoryId: "combinatorics",
    type: "method",
    title: "平均分组",
    summary: "平均分组先判断组与组之间是否有顺序；无顺序要除以组数全排列，有顺序再分配到具体组。",
    preview: "无序平均分组要除以 A_n^n；有序分组再乘岗位排列",
    previewNodes: [
      { type: "text", value: "无序平均分组要除以 " },
      { type: "script", base: { type: "text", value: "A" }, sub: "n", sup: "n" },
    ],
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "无顺序平均分组", content: "平均分组数 = 分步组合数 / A_n^n", nodes: [
        { type: "text", value: "平均分组数" },
        { type: "op", value: "=" },
        { type: "frac", numNodes: [
          { type: "text", value: "分步组合数" },
        ], denNodes: [
          { type: "script", base: { type: "text", value: "A" }, sub: "n", sup: "n" },
        ] },
      ] },
      { type: "rule", title: "无顺序", items: ["组内人数相同，且组与组之间没有名称、岗位或先后顺序。", "先按组合分步取人或取物。", "由于同样的若干组会被重复计算，需要除以组数的全排列 A_n^n。", "常见问法是“随机分成若干组”“分成若干队”，且没有指定第 1 组、第 2 组或具体城市、岗位。"] },
      { type: "formula", label: "有顺序平均分组", content: "有序分组数 = 无序平均分组数 × A_m^m", nodes: [
        { type: "text", value: "有序分组数" },
        { type: "op", value: "=" },
        { type: "text", value: "无序平均分组数" },
        { type: "op", value: "×" },
        { type: "script", base: { type: "text", value: "A" }, sub: "m", sup: "m" },
      ] },
      { type: "rule", title: "有顺序", items: ["分组后还要分配到不同岗位、城市、日期或编号组时，组与组之间有区别。", "可以先无序平均分组，再把这些组分配到具体位置。", "若有 m 个具体位置或岗位，通常再乘 A_m^m。", "也可以直接按具体位置依次选人，本质是同一件事。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2017 江苏", label: "真题示例·无序平均分组",
            stem: "甲、乙、丙三个单位各派 2 名志愿者参加公益活动，现将这 6 人随机分成 3 组，每组 2 人，问每组成员均来自不同单位的概率是：",
            options: [{ key: "A", text: "1/3" }, { key: "B", text: "5/12" }, { key: "C", text: "1/4" }, { key: "D", text: "8/15" }],
            answer: "D",
            analysis: "所有分组情况为 C(6,2)×C(4,2)×C(2,2)/A(3,3)=15。符合条件时，每组都来自两个不同单位：先安排甲单位 2 人分别进入两个不同组，再安排乙单位人员与其配对，剩余丙单位人员唯一分配，符合情况有 8 种。概率为 8/15。" },
          { type: "example", source: "2017 联考", label: "真题示例·有序平均分组",
            stem: "某公司销售部拟派 3 名销售主管和 6 名销售人员前往 3 座城市进行市场调研，每座城市派销售主管 1 名，销售人员 2 名。问不同人员派遣方案有：",
            options: [{ key: "A", text: "540种" }, { key: "B", text: "1080种" }, { key: "C", text: "1620种" }, { key: "D", text: "3240种" }],
            answer: "A",
            analysis: "3 座城市不同，主管分配有 A(3,3)=6 种。6 名销售人员平均分成 3 组，每组 2 人，先无序分组为 C(6,2)×C(4,2)×C(2,2)/A(3,3)=15 种，再分配到 3 座城市有 A(3,3)=6 种。总数 6×15×6=540。" }] }
    ]},
  {
    id: "derangement",
    categoryId: "combinatorics",
    type: "method",
    title: "错位排序",
    summary: "错位排序要求每个元素都不回原位，小数量题直接记 1 到 6 个元素的错位数。",
    preview: "1-6 个元素错位数：0、1、2、9、44、265",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "table", label: "常用错位数", columns: ["元素个数", "全部错位情形"], rows: [["1", "0"], ["2", "1"], ["3", "2"], ["4", "9"], ["5", "44"], ["6", "265"]] },
      { type: "rule", title: "判断规则", items: ["每个人、物、信件或岗位都不能回到自己的原位置时，考虑错位排序。", "题干问“没有一个在原位”“均不返回原单位”时，直接套错位数。", "若题干问“恰好 k 个回原位”，先选出这 k 个元素，再对剩余元素做全部错位。", "小数量考试中优先记表，不必现场推导递推公式。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2017 国考", label: "真题示例·错位排序",
            stem: "某集团 5 个分公司分别派出 1 人去集团总部参加培训。培训后再将 5 人随机分配到这 5 个分公司，每个分公司只分配 1 人。问 5 个参加培训的人中，有且仅有 1 人在培训后返回原分公司的概率？",
            options: [{ key: "A", text: "低于20%" }, { key: "B", text: "在20%-30%之间" }, { key: "C", text: "在30%-35%之间" }, { key: "D", text: "大于35%" }],
            answer: "D",
            analysis: "先选出唯一返回原分公司的人，有 C(5,1)=5 种。其余 4 人都不能回原分公司，是 4 个元素错位排序，有 9 种。符合情况为 5×9=45，所有情况为 A(5,5)=120，概率 45/120=3/8=37.5%，大于 35%。" }] }
    ]},
  {
    id: "circular-arrangement",
    categoryId: "combinatorics",
    type: "method",
    title: "环形排列",
    summary: "环形排列要消除整体旋转造成的重复，通常固定一个元素后排列其余元素。",
    preview: "n 个不同元素环形排列：A_(n-1)^(n-1)",
    previewNodes: [
      { type: "text", value: "n 个不同元素环形排列：" },
      { type: "script", base: { type: "text", value: "A" }, sub: "n-1", sup: "n-1" },
    ],
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "环形排列", content: "n 个不同元素的环形排列数 = A_(n-1)^(n-1)", nodes: [
        { type: "text", value: "环形排列数" },
        { type: "op", value: "=" },
        { type: "script", base: { type: "text", value: "A" }, sub: "n-1", sup: "n-1" },
      ] },
      { type: "rule", title: "判断规则", items: ["圆桌座位、围成一圈、环形摆放等题型，优先考虑环形排列。", "环形排列中，整体旋转后相对位置不变，不能重复计数。", "常用做法是固定其中一个元素，再排列剩下 n-1 个元素。", "若还要求若干人相邻，可先捆绑，再按环形排列处理整体。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2012 国考", label: "真题示例·环形排列",
            stem: "有 5 对夫妇参加一场婚宴，他们被安排在一张 10 个座位的圆桌就餐，但是婚礼操办者并不知道他们彼此之间的关系，只是随机安排座位。问 5 对夫妇恰好都被安排在一起相邻而坐的概率是多少？",
            options: [{ key: "A", text: "在1‰到5‰之间" }, { key: "B", text: "在5‰到1%之间" }, { key: "C", text: "超过1%" }, { key: "D", text: "不超过1‰" }],
            answer: "A",
            analysis: "所有情况为 10 人环形排列 A(9,9)。符合条件时，把 5 对夫妇各自捆绑成整体，5 个整体做环形排列有 A(4,4) 种，每对夫妇内部有 A(2,2) 种，共 5 对。概率为 A(4,4)×A(2,2)^5/A(9,9)，约为 2‰，在 1‰ 到 5‰ 之间。" }] }
    ]},
  {
    id: "repeated-arrangement",
    categoryId: "combinatorics",
    type: "method",
    title: "重复排列",
    summary: "每次选择后元素仍可再次被选择时，用可重复排列计算。",
    preview: "n 个不同元素可重复取 m 次：n^m",
    previewNodes: [
      { type: "text", value: "n 个不同元素可重复取 m 次：" },
      { type: "script", base: { type: "text", value: "n" }, sup: "m" },
    ],
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "重复排列", content: "n 个不同元素，可重复取 m 次，共有 n^m 种情形", nodes: [
        { type: "text", value: "情形数" },
        { type: "op", value: "=" },
        { type: "script", base: { type: "text", value: "n" }, sup: "m" },
      ] },
      { type: "rule", title: "判断规则", items: ["每一步都可以从同一批对象中重新选择，且选择之间互不排斥。", "题干出现“任选”“可重复选择”“每个对象都可选同一类别”时，考虑重复排列。", "若某个选项或类别被限制恰好出现 k 次，先选出出现位置，再让剩余位置从其他类别中重复选择。", "重复排列与普通排列的区别是：普通排列取走后不能再取，重复排列每次都可重新取。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2019 联考", label: "真题示例·重复排列",
            stem: "某小学组织 6 个年级的学生外出参观包括 A 科技馆在内的 6 个科技馆，每个年级任选一个科技馆参观，且只有两个年级选择 A 科技馆的方案有：",
            options: [{ key: "A", text: "1800种" }, { key: "B", text: "18750种" }, { key: "C", text: "3800种" }, { key: "D", text: "9375种" }],
            answer: "D",
            analysis: "先从 6 个年级中选出 2 个去 A 科技馆，有 C(6,2)=15 种。剩下 4 个年级不能选 A，可在另外 5 个科技馆中任选，且不同年级可以选择同一个科技馆，是可重复选择，有 5^4=625 种。总数 15×625=9375。" }] }
    ]},
  {
    id: "probability-basic",
    categoryId: "combinatorics",
    type: "formula",
    title: "概率问题",
    summary: "概率题先确定符合要求的情况数和所有可能的情况数，几何概型看长度、面积或体积占比。",
    preview: "P = 符合要求的情况数 / 所有可能的情况数",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "核心公式", content: "P = 符合要求的情况数 / 所有可能的情况数", nodes: formulaNodes.probability },
      { type: "rule", title: "古典概率", items: ["常与排列组合结合考查，本质仍是看排列组合知识点。", "所有基本情况等可能时，先数总情况，再数满足条件的情况。", "如果条件较复杂，可先算反面，再用 1 减去不符合要求的概率。"] },
      { type: "rule", title: "几何概型", items: ["某些时候，情况数为无穷多个，无法通过计数办法计算情况数，可以使用区域长度、面积或体积来计算概率。", "这类题不再数“有多少种情况”，而是看符合要求的区域占全部区域的比例。", "了解此类题型思维即可，关键是找准分子区域和分母区域。"] },
      { type: "formula", label: "几何概型公式", content: "P(A) = 构成事件 A 的区域长度、面积或体积 / 试验全部结果构成的区域长度、面积或体积" },
      { type: "rule", title: "几何概型判断", items: ["当情况数可看作无限多个，无法直接逐个计数时，考虑几何概型。", "题干出现时间、长度、面积、体积、随机落点等连续量时，优先找对应区域占比。", "分母是全部可能范围，分子是符合条件的范围，二者单位必须一致。"] },
      { type: "rule", title: "判断规则", items: ["独立连续发生常用乘法。", "至少一次常用反面：1 - 一次都不发生。", "等可能时先数总情况。"] }] },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          { type: "example", source: "示例题", label: "例题",
            stem: "3 男 3 女共 6 名员工，随机选 2 人参加培训，选出一男一女的概率为？",
            options: [{ key: "A", text: "1/2" }, { key: "B", text: "3/5" }, { key: "C", text: "2/3" }, { key: "D", text: "3/4" }],
            answer: "B",
            analysis: "总情况 C(6,2) = 15。一男一女 = 3×3 = 9。概率 = 9/15 = 3/5。" },
          { type: "example", source: "示例题", label: "例题·几何概型",
            stem: "十字路口的交通信号灯每分钟红灯亮 30 秒、绿灯亮 25 秒、黄灯亮 5 秒。当你抬头看信号灯时，是绿灯的概率为多少？",
            analysis: "抬头看信号灯的时刻可以看作 1 分钟内的随机时间点，属于时间长度型几何概型。全部可能时间长度为 60 秒，绿灯对应长度为 25 秒，所以概率 P=25/60=5/12。" }]}
    ]},
  {
    id: "same-group-probability",
    categoryId: "combinatorics",
    type: "method",
    title: "两人同组概率",
    summary: "两人同组时无需关注第一人具体在哪，只看第二人与第一人同组的可能位置。",
    preview: "先固定第一人，再看第二人可选的同组位置",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "核心思路", items: ["无需关注第一人，第一人无论在哪，只需第二人与第一人在一组即可。", "先固定第一人的位置或选择结果。", "再看剩余所有可能位置中，有多少个位置与第一人属于同一组。", "概率 = 第二人同组可选情况数 / 第二人剩余总可选情况数。"] },
      { type: "rule", title: "连续多天同组", items: ["若每天或每次选择都受“不重复”限制，可以逐步计算条件概率。", "第一人的选择可视为已经确定，只看第二人每一步跟随第一人的概率。", "多步都要同时满足时，用乘法把每一步概率相乘。"] },
      { type: "table", label: "常用速算", columns: ["公式", "结果"], rows: [["A_n^n", "n!"], ["C_n^m", "C_n^(n-m)"], ["A_n^1 = C_n^1 = C_n^(n-1)", "n"], ["A_n^0 = C_n^0 = C_n^n", "1"]], cellNodes: {
        "0-0": [{ type: "script", base: { type: "text", value: "A" }, sub: "n", sup: "n" }],
        "1-0": [{ type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "m" }],
        "1-1": [{ type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "n-m" }],
        "2-0": [
          { type: "script", base: { type: "text", value: "A" }, sub: "n", sup: "1" },
          { type: "op", value: "=" },
          { type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "1" },
          { type: "op", value: "=" },
          { type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "n-1" },
        ],
        "3-0": [
          { type: "script", base: { type: "text", value: "A" }, sub: "n", sup: "0" },
          { type: "op", value: "=" },
          { type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "0" },
          { type: "op", value: "=" },
          { type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "n" },
        ],
      } },
      { type: "table", label: "常用阶乘", columns: ["阶乘", "数值"], rows: [["1!", "1"], ["2!", "2"], ["3!", "6"], ["4!", "24"], ["5!", "120"], ["6!", "720"], ["7!", "5040"]] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2018 国考", label: "真题示例·同排概率",
            stem: "某单位的会议室有 5 排共 40 个座位，每排座位数相同。小张和小李随机入座，则他们坐在同一排的概率：",
            options: [{ key: "A", text: "不高于15%" }, { key: "B", text: "高于15%但低于20%" }, { key: "C", text: "正好为20%" }, { key: "D", text: "高于20%" }],
            answer: "B",
            analysis: "先固定小张的位置，此时还剩 39 个座位可供小李选择。每排有 40÷5=8 个座位，和小张同一排且未被占的位置有 7 个，所以概率为 7/39≈17.9%，高于 15% 但低于 20%。" },
          { type: "example", source: "2019 国考", label: "真题示例·连续同班车",
            stem: "小张和小王在同一个学校读研究生，每天早上从宿舍到学校有 6:40、7:00、7:20 和 7:40 发车的 4 班校车。某星期一到周三，小张和小王都坐班车去学校，且每个人在 3 天中乘坐的班车发车时间都不同。问这 3 天小张和小王每天都乘坐同一趟班车的概率在：",
            options: [{ key: "A", text: "3%以下" }, { key: "B", text: "3%-4%之间" }, { key: "C", text: "4%-5%之间" }, { key: "D", text: "5%以上" }],
            answer: "C",
            analysis: "第一天小张任意选择，小王跟随同一班车的概率为 1/4；第二天两人各自都不能重复前一天班车，小张剩余 3 班任选，小王跟随的概率为 1/3；第三天同理概率为 1/2。三天都同班车的概率为 1/4×1/3×1/2=1/24≈4.17%，在 4%-5% 之间。" }] }
    ]},
  {
    id: "planting-array",
    categoryId: "applied",
    type: "method",
    title: "植树问题",
    summary: "植树问题先判断开放还是封闭，再区分棵数和间隔数。",
    preview: "开放：棵数 = 间隔数 + 1；封闭：棵数 = 间隔数",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "table", label: "基础公式", columns: ["题型", "公式"], rows: [["两端不植树", "总长 = 间隔 × (棵数 + 1)"], ["一端植树或环形植树", "总长 = 间隔 × 棵数"], ["两端均植树", "总长 = 间隔 × (棵数 - 1)"]] },
      { type: "rule", title: "判断规则", items: ["直线两端都种，棵数比间隔数多 1。", "环形、闭合路线或圆形跑道，棵数等于间隔数。", "两端都不种，棵数比间隔数少 1。", "先用总长除以间距求间隔数，再按场景换算棵数。", "问一段路线上最多经过几个标记点时，要注意是否同时经过起点和终点。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2016 联考", label: "真题示例·环形植树",
            stem: "一环形跑道上画了 100 个标记点，已知相邻任意两个标记点之间的跑道距离相等。某人在环形跑道上跑了半圈，问他最多能经过几个标记点？",
            options: [{ key: "A", text: "49" }, { key: "B", text: "51" }, { key: "C", text: "50" }, { key: "D", text: "100" }],
            answer: "B",
            analysis: "100 个标记点围成环形，相当于 100 个相等间隔。跑半圈经过 50 个间隔。若想经过标记点最多，可从一个标记点跑到正对面的标记点，首尾都计入，共 50+1=51 个标记点。" }] }
    ]},
  {
    id: "chicken-rabbit",
    categoryId: "applied",
    type: "method",
    title: "鸡兔同笼",
    summary: "鸡兔同笼先假设都按一种情况处理，再用总差值除以单个差值。",
    preview: "做错数量 = (理想情况 - 现实情况) / 单个差值",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "核心公式", content: "做错数量 = (理想情况 - 现实情况) / 单个差值" },
      { type: "rule", title: "解题思路", items: ["假设都做对或都赚到，把题目先转成一种理想情况。", "已知条件中通常包含“单只腿数”和“总腿数”，也就是单个差值和总差值。", "用理想情况与现实情况的差，除以每个对象带来的差值，求出做错、失败或另一类对象的数量。", "常见考查类型包括工资报酬、考试对错题得分、比赛胜平负积分。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2019 浙江事业编", label: "真题示例·胜平负积分",
            stem: "某赛事实行积分赛制，获胜积 5 分，打平积 2 分，失败扣 1 分。已知小辉在 20 场积分赛后积 61 分且有 3 场比赛打平，那么小辉的胜率为：",
            options: [{ key: "A", text: "48%" }, { key: "B", text: "55%" }, { key: "C", text: "60%" }, { key: "D", text: "75%" }],
            answer: "C",
            analysis: "除去 3 场打平，共赛 17 场且得到 61-3×2=55 分。若 17 场全胜，理想情况为 17×5=85 分；每把一场胜利换成失败，会少 5-(-1)=6 分。失败场次为 (85-55)/6=5 场，胜场为 17-5=12 场，胜率 12/20=60%。" }] }
    ]},
  {
    id: "surplus-deficit",
    categoryId: "applied",
    type: "method",
    title: "盈亏问题",
    summary: "盈亏问题抓住对象总数不变，用盈亏数和或差除以分配标准差。",
    preview: "一盈一亏：对象数 = 盈亏数和 / 分配标准差",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "基本含义", items: ["盈就是有余，亏就是不足。", "常见题型包括人坐车、人住房、物品分配。", "题干通常给出两种分配标准，以及对应的剩余或不足情况。"] },
      { type: "formula", label: "一盈一亏型", content: "对象数 = 盈亏数和 / 分配标准差" },
      { type: "rule", title: "解题思路", items: ["先判断两次分配分别是盈、亏还是都盈、都亏。", "一盈一亏时，用盈亏数相加。", "两盈或两亏时，用较大差与较小差相减。", "求出对象数后，再回到任意一种分配方式求总量。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2019 浙江事业编", label: "真题示例·坐车分配",
            stem: "某公司组织员工春游，每辆车坐 25 人，剩下 6 人没有上车；每辆车坐 28 人，最后一辆车只坐了 13 人。问每辆车坐 26 人，最后一辆车少坐了几个人？",
            options: [{ key: "A", text: "1" }, { key: "B", text: "2" }, { key: "C", text: "3" }, { key: "D", text: "4" }],
            answer: "A",
            analysis: "每辆车坐 25 人时盈 6 人；每辆车坐 28 人时，最后一辆只坐 13 人，相当于亏 28-13=15 人。车辆数为 (6+15)/(28-25)=7 辆，总人数为 25×7+6=181 人。若每辆车坐 26 人，181÷26=6 余 25，最后一辆车少坐 1 人。" }] }
    ]},
  {
    id: "age-problem",
    categoryId: "applied",
    type: "method",
    title: "年龄问题",
    summary: "年龄问题抓住年龄差不变和时间变化量相同，常用方程法处理。",
    preview: "年龄差不变；时间改变时每个人同加同减",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "判断规则", items: ["无论时间如何改变，两人的年龄差不变。", "时间改变时，每个人的年龄增量相同。", "爷爷奶奶年龄多在 60 岁以上，父母多在 30-40 岁，儿女多在 0-10 岁，可用来快速筛选。", "常见年龄平方数可优先想到 64、36、9。", "涉及多个人年龄和、几年前几倍、平方数等条件时，宜用方程法。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2014 上半年联考", label: "真题示例·年龄平方数",
            stem: "一家四口的年龄之和为 149 岁，外公年龄、母亲年龄以及两人的年龄之和都是平方数，而父亲 7 年前的年龄正好是孩子年龄的 6 倍。问外公年龄上一次是孩子年龄的整数倍是在几年前？",
            options: [{ key: "A", text: "2" }, { key: "B", text: "4" }, { key: "C", text: "6" }, { key: "D", text: "8" }],
            answer: "D",
            analysis: "根据外公年龄、母亲年龄以及二者年龄和均为平方数，可推测外公 64 岁、母亲 36 岁，二者和为 100。父亲和孩子今年年龄和为 49。设 7 年前孩子为 x 岁，则父亲为 6x 岁；今年二者为 x+7 与 6x+7，列式 x+7+6x+7=49，解得 x=5，所以孩子今年 12 岁、外公 64 岁。8 年前外公 56 岁，孩子 4 岁，56 是 4 的整数倍。" }] }
    ]},
  {
    id: "matrix-problem",
    categoryId: "applied",
    type: "method",
    title: "方阵问题",
    summary: "方阵问题一般围绕最外层边长、层数和每层人数变化计算。",
    preview: "每层人数 = 每边人数 × 4 - 4；内层比外层少 8",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "方阵总人数", content: "实心方阵总人数 = 最外层边长^2" },
      { type: "formula", label: "层数", content: "层数 = 最外层边长 / 2" },
      { type: "formula", label: "每层人数", content: "每层人数 = 该层每边人数 × 4 - 4" },
      { type: "rule", title: "常用结论", items: ["每层人数计算时，四个角会被重复计算，所以要减 4。", "相邻两层相比，内层比外层少 8 个元素，边长少 2。", "一般没明确说明时，方阵默认是正方形。", "涉及增减一圈或边长变化时，优先设最外层边长列方程。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2015 天津", label: "真题示例·矩形方阵",
            stem: "一个由边长 25 人和 15 人组成的矩形方阵，最外面两圈人数总和为：",
            options: [{ key: "A", text: "232" }, { key: "B", text: "144" }, { key: "C", text: "165" }, { key: "D", text: "196" }],
            answer: "B",
            analysis: "最外圈人数为 25+25+15+15-4=76 人。第二圈比第一圈少 8 人，为 68 人。两圈总人数为 76+68=144 人。" },
          { type: "example", source: "2017 上海", label: "真题示例·正方形方阵",
            stem: "现有一批正方形地砖，如拼成一个大正方形则可余 62 块；若每边都再增加一块，则缺少 37 块，这批地砖共有多少块？",
            options: [{ key: "A", text: "2433" }, { key: "B", text: "2459" }, { key: "C", text: "2463" }, { key: "D", text: "2475" }],
            answer: "C",
            analysis: "设原来可拼成的正方形边长为 x，则地砖总数既可表示为 x^2+62，也可表示为 (x+1)^2-37。列式 x^2+62=(x+1)^2-37，解得 x=49。地砖总数为 49^2+62=2463。" }] }
    ]},
  {
    id: "clock-problem",
    categoryId: "applied",
    type: "method",
    title: "钟表问题",
    summary: "钟表问题把时针、分针转化成速度追及，重点看夹角变化。",
    preview: "分针 6°/min；时针 0.5°/min；追及差 5.5°/min",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "table", label: "指针速度", columns: ["指针", "角速度"], rows: [["分针", "360°/60min = 6°/min"], ["时针", "30°/60min = 0.5°/min"], ["分针追时针", "6-0.5 = 5.5°/min"]] },
      { type: "rule", title: "常用结论", items: ["一整天分针走过 24 圈，时针走过 2 圈。", "所以时针追上分针 22 次，时针和分针重合 22 次。", "垂直时通常每次重合前后各出现一次，一整天共 44 次。", "处理钟表快慢时，可以把“表走时间”和“正常时间”建立比例。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 浙江事业编", label: "真题示例·钟表快慢",
            stem: "小刚的手表出现了故障，每小时快 3 分钟。为了第二天早上六点上课不迟到，他在当晚十一点调好了表，第二天小刚按照自己手表上六点的时间准时到达教室，则实际上他提前了多少分钟？",
            options: [{ key: "A", text: "19" }, { key: "B", text: "20" }, { key: "C", text: "21" }, { key: "D", text: "22" }],
            answer: "B",
            analysis: "正常时间每过 60 分钟，手表走 63 分钟。手表从 23:00 走到 6:00，共走 7 小时，即 420 分钟。设实际经过 x 分钟，则 63/60=420/x，解得 x=400。正常应经过 420 分钟，所以提前 20 分钟。" }] }
    ]},
  {
    id: "competition-problem",
    categoryId: "applied",
    type: "method",
    title: "比赛问题",
    summary: "比赛问题先判断淘汰赛还是循环赛，再用比赛场次公式或积分表计算。",
    preview: "单循环 C_n^2；双循环 A_n^2；淘汰赛每轮淘汰一半",
    previewNodes: [
      { type: "text", value: "单循环 " },
      { type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "2" },
      { type: "text", value: "；双循环 " },
      { type: "script", base: { type: "text", value: "A" }, sub: "n", sup: "2" },
    ],
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "淘汰赛", items: ["每场比赛淘汰一队，每轮比赛淘汰一半队伍。", "若总队伍数是 2 的整数次方，打到冠军需要逐轮减半。", "如果总数不是 2 的整数次方，可补空位或轮空队伍。"] },
      { type: "formula", label: "单循环赛", content: "n 支队伍总场次 = C_n^2 = n×(n-1)/2", nodes: [
        { type: "text", value: "总场次" },
        { type: "op", value: "=" },
        { type: "script", base: { type: "text", value: "C" }, sub: "n", sup: "2" },
        { type: "op", value: "=" },
        { type: "frac", numNodes: [
          { type: "text", value: "n×(n-1)" },
        ], denNodes: [
          { type: "text", value: "2" },
        ] },
      ] },
      { type: "rule", title: "单循环赛", items: ["每支队伍都要和其他队伍进行一次比赛。", "只分主客场时不重复计算。", "常配合积分规则：胜、平、负分别给定分值。"] },
      { type: "formula", label: "双循环赛", content: "n 支队伍总场次 = A_n^2 = n×(n-1)", nodes: [
        { type: "text", value: "总场次" },
        { type: "op", value: "=" },
        { type: "script", base: { type: "text", value: "A" }, sub: "n", sup: "2" },
        { type: "op", value: "=" },
        { type: "text", value: "n×(n-1)" },
      ] },
      { type: "rule", title: "双循环赛", items: ["每支队伍都要和其他队伍进行两场比赛。", "两场通常分主场和客场。", "总场次是单循环的 2 倍。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2019 联考", label: "真题示例·淘汰赛",
            stem: "小张、小李和小王三人以擂台形式打乒乓球，每局 2 人对打，输的人下一局轮空。半天下来，小张共打了 6 局，小王共打了 9 局，而小李轮空了 4 局。那么，小李一共打了多少局？",
            options: [{ key: "A", text: "5局" }, { key: "B", text: "7局" }, { key: "C", text: "9局" }, { key: "D", text: "11局" }],
            answer: "B",
            analysis: "每局有 2 人上场、1 人轮空。小张打 6 局且小李轮空 4 局，说明小张和小王同场 4 局，因此小张与小李同场 2 局。小王打 9 局，除去和小张的 4 局，剩下 5 局是和小李打的。小李共打 2+5=7 局。" },
          { type: "example", source: "2022 江苏", label: "真题示例·循环积分",
            stem: "有 5 支足球队进行单循环比赛，每场比赛胜者得 3 分，负者不得分，平局双方各得 1 分。比赛结束后，若 5 支球队的总得分为 25 分，冠军得 12 分，则亚军得：",
            options: [{ key: "A", text: "5分" }, { key: "B", text: "6分" }, { key: "C", text: "7分" }, { key: "D", text: "8分" }],
            answer: "A",
            analysis: "5 队单循环共 C(5,2)=10 场。若全都分出胜负，总分应为 10×3=30 分；实际 25 分，说明平局有 30-25=5 场，胜负局 5 场。冠军 12 分，只能是 4 胜 0 平。剩下四队之间共有 6 场比赛，其中与冠军的 4 场都为负；剩余积分合计 25-12=13 分。结合名次和积分约束，亚军只能为 5 分。" }] }
    ]},
  {
    id: "balance-weighing",
    categoryId: "applied",
    type: "method",
    title: "天平称重",
    summary: "天平称重题通常找最少次数，重点围绕每次称量能排除多少可能。",
    preview: "无砝码天平：优先选最小次数",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "秒杀提示", items: ["天平称重无陷阱时，通常优先选择最小的选项。", "每次称量有左重、右重、平衡三种结果。", "若目标是找出一个特殊物品，尽量让每次称量把候选对象分成数量接近的三份。", "若题干区分偏重还是偏轻，需同时跟踪物品身份和偏差方向。"] },
      { type: "tip", variant: "warning", title: "易错提醒", content: "问“至少几次”时，不要只验证某一种情况，要保证任意结果分支都能在该次数内确定答案。" }] },
      { id: "真题示例", title: "真题示例", blocks: [] }
    ]},
  {
    id: "geometry-formulas",
    categoryId: "geometry",
    type: "formula",
    title: "几何问题",
    summary: "几何题先识别图形与关系，再结合等比放缩、最值和最短距离处理。",
    preview: "几何图、几何等比放缩、几何最值、最短距离",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "几何图", items: ["先判断题目考查平面图形、立体图形还是常考组合图形。", "读图时先标已知量，再找相等、平行、垂直、相似、对称等关系。", "平面图形与立体图形优先记常用公式，常考组合图形后续用局部截图补充。"] },
      { type: "image-note", label: "公式表", title: "平面图形公式表", src: "quantity/geometry-plane-01-formula-table.png", description: "三角形、长方形、正方形、平行四边形、梯形、菱形、圆和扇形的常用面积与周长公式。" },
      { type: "image-note", label: "公式表", title: "立体图形公式表", src: "quantity/geometry-solid-01-formula-table.png", description: "长方体、正方体、球体、圆柱体和圆锥体的表面积与体积公式。" },
      { type: "rule", title: "常考图形", items: ["直角三角形最常见勾股数为 3:4:5，遇到直角和整数边时优先联想。", "30°、60°、90° 直角三角形三边之比为 1:√3:2。", "等腰直角三角形三边之比为 1:1:√2。", "常用近似值：√2≈1.414，√3≈1.732，√5≈2.236。"] },
      { type: "rule", title: "几何等比放缩", items: ["图形按同一比例放大或缩小时，所有长度按相同比例变化。", "边长放大 n 倍，周长放大 n 倍，面积放大 n^2 倍，体积放大 n^3 倍。", "相似图形对应边成比例，面积比等于相似比的平方，体积比等于相似比的立方。"] },
      { type: "formula", label: "等比放缩", content: "长度比 = k；面积比 = k^2；体积比 = k^3" },
      { type: "rule", title: "几何最值", items: ["周长相同时，圆面积最大。", "面积相同时，圆周长最短。", "立体图形最值题先看题目限制的是表面积、体积还是边长，再对应放缩关系判断。"] },
      { type: "rule", title: "最短距离", items: ["两点之间线段最短。", "点到直线的距离，垂线段最短。", "对称和折线路径题常用翻折，把折线路径转化为直线距离。", "立体表面最短路径常先展开成平面，再连接两点求最短线段。"] }] },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          { type: "example", source: "示例题", label: "例题",
            stem: "圆形花坛直径 10 米，向外拓宽 2 米，面积增加多少平方米？",
            options: [{ key: "A", text: "44π" }, { key: "B", text: "24π" }, { key: "C", text: "16π" }, { key: "D", text: "9π" }],
            answer: "B",
            analysis: "原半径 5 米，新半径 7 米。增加面积 = π(7² - 5²) = π(49-25) = 24π。" }]}
    ]},
  {
    id: "travel-basic",
    categoryId: "travel",
    type: "formula",
    title: "普通行程",
    summary: "普通行程围绕路程、速度、时间三量关系展开，先统一单位再列等量关系。",
    preview: "S = v × t；同路程速度比与时间比互反",
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "formula", label: "基础公式", content: "S = v × t", nodes: formulaNodes.travelDistance },
        { type: "rule", title: "解题规则", items: ["核心公式：路程 S = 速度 v × 时间 t。", "单位要先统一，常用换算：1m/s = 3.6km/h，1km/h = 5/18m/s。", "已知路程相同，速度比与时间比互为反比；已知时间相同，路程比等于速度比。", "题干出现提前、晚到、休息、提速或降速时，先抓住同一段路程不变，再列速度与时间关系。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "行测真题", label: "真题示例·普通行程",
            stem: "某人从甲地到乙地，原计划每小时行 60 千米，实际每小时行 75 千米，结果提前 1 小时到达。问甲乙两地相距多少千米？",
            options: [{ key: "A", text: "240 千米" }, { key: "B", text: "300 千米" }, { key: "C", text: "360 千米" }, { key: "D", text: "450 千米" }],
            answer: "B",
            analysis: "设原计划用时为 t 小时，实际用时为 t-1 小时。同一段路程不变，列式 60t = 75(t-1)，解得 t=5，路程 = 60×5 = 300 千米。" },
          { type: "example", source: "行测真题", label: "真题示例·普通行程",
            stem: "一辆汽车从甲地到乙地，若每小时行 60 千米，可按时到达；若每小时行 75 千米，则可提前 40 分钟到达。问甲乙两地相距多少千米？",
            options: [{ key: "A", text: "180 千米" }, { key: "B", text: "200 千米" }, { key: "C", text: "240 千米" }, { key: "D", text: "300 千米" }],
            answer: "B",
            analysis: "提前 40 分钟 = 2/3 小时。设原计划用时为 t 小时，同一段路程不变，列式 60t = 75(t-2/3)，解得 t=10/3，路程 = 60×10/3 = 200 千米。" }] }
    ]},
  {
    id: "travel-average-speed",
    categoryId: "travel",
    type: "formula",
    title: "等距离平均速度",
    summary: "等距离平均速度要按总路程除以总时间处理，两段等距可用调和平均公式。",
    preview: "两段等距：v均 = 2v1v2/(v1+v2)",
    previewNodes: [
      { type: "text", value: "两段等距：" },
      { type: "script", base: { type: "text", value: "V" }, sub: "均" },
      { type: "op", value: "=" },
      { type: "frac", numNodes: [
        { type: "text", value: "2" },
        { type: "script", base: { type: "text", value: "V" }, sub: "1" },
        { type: "script", base: { type: "text", value: "V" }, sub: "2" },
      ], denNodes: [
        { type: "script", base: { type: "text", value: "V" }, sub: "1" },
        { type: "op", value: "+" },
        { type: "script", base: { type: "text", value: "V" }, sub: "2" },
      ] },
    ],
    tabs: [
      { id: "knowledge", title: "知识点", blocks: [
        { type: "formula", label: "普通平均速度", content: "v均 = 总路程 / 总时间" },
        { type: "rule", title: "普通平均速度", items: ["平均速度一律先用总路程÷总时间。", "若各段时间相等，平均速度等于各段速度的算术平均数。", "若各段路程相等，不能直接取算术平均数，要用等距离平均速度。"] },
        { type: "formula", label: "两段等距", content: "v均 = 2v1v2 / (v1 + v2)", nodes: [
          { type: "script", base: { type: "text", value: "V" }, sub: "均" },
          { type: "op", value: "=" },
          { type: "frac", numNodes: [
            { type: "text", value: "2" },
            { type: "script", base: { type: "text", value: "V" }, sub: "1" },
            { type: "script", base: { type: "text", value: "V" }, sub: "2" },
          ], denNodes: [
            { type: "script", base: { type: "text", value: "V" }, sub: "1" },
            { type: "op", value: "+" },
            { type: "script", base: { type: "text", value: "V" }, sub: "2" },
          ] },
        ] },
        { type: "rule", title: "解题规则", items: ["往返或多段路程相等时，不能直接取速度的算术平均数。", "两段等距离平均速度：v均 = 2v1v2/(v1+v2)。", "多段等距离时，可设每段距离为同一个方便数，分别求时间后用总路程÷总时间。", "判断关键是各段距离相等；若各段时间相等，平均速度才等于速度的算术平均数。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "行测真题", label: "真题示例·等距离平均速度",
            stem: "某人上山速度为 3 千米/小时，下山速度为 6 千米/小时，原路往返路程相同。问全程平均速度为多少千米/小时？",
            options: [{ key: "A", text: "3.5" }, { key: "B", text: "4" }, { key: "C", text: "4.5" }, { key: "D", text: "5" }],
            answer: "B",
            analysis: "往返路程相同，用等距离平均速度：v均 = 2×3×6/(3+6)=4 千米/小时。不能直接取 (3+6)/2=4.5。" },
          { type: "example", source: "行测真题", label: "真题示例·普通平均速度",
            stem: "某车前 2 小时行驶 120 千米，后 3 小时行驶 210 千米。问全程平均速度为多少千米/小时？",
            options: [{ key: "A", text: "60" }, { key: "B", text: "66" }, { key: "C", text: "70" }, { key: "D", text: "75" }],
            answer: "B",
            analysis: "普通平均速度必须用总路程÷总时间。总路程 = 120+210=330 千米，总时间 = 2+3=5 小时，平均速度 = 330÷5 = 66 千米/小时。不能把两段速度直接平均。" },
          { type: "example", source: "行测真题", label: "真题示例·等距离平均速度",
            stem: "某人从甲地到乙地速度为 20 千米/小时，原路返回速度为 30 千米/小时。问往返全程平均速度为多少千米/小时？",
            options: [{ key: "A", text: "24" }, { key: "B", text: "25" }, { key: "C", text: "26" }, { key: "D", text: "28" }],
            answer: "A",
            analysis: "往返路程相同，用等距离平均速度：v均 = 2×20×30/(20+30)=24 千米/小时。不能直接取 (20+30)/2=25。" }] }
    ]},
  {
    id: "travel-core",
    categoryId: "travel",
    type: "formula",
    title: "相遇追及",
    summary: "相遇看速度和，追及看速度差；环形题转化为合走或多走几个圆周长。",
    preview: "相遇用速度和；追及用速度差；环形看圆周长",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "compare", label: "相遇与追及", left: { title: "相遇", content: "路程和 = 速度和 × 时间", items: ["相向而行", "距离逐渐缩小"] }, right: { title: "追及", content: "路程差 = 速度差 × 时间", items: ["同向而行", "快追慢"] } },
      { type: "formula", label: "相遇公式", content: "S和 = (v1 + v2) × t" },
      { type: "formula", label: "追及公式", content: "S差 = (v快 - v慢) × t" },
      { type: "formula", label: "多次相遇", content: "第 N 次相遇合走 (2N-1)S" },
      { type: "formula", label: "环形同点相遇", content: "第 N 次相遇合走 N 个圆周长" },
      { type: "formula", label: "环形同点追及", content: "第 N 次追上多跑 N 个圆周长" },
      { type: "rule", title: "相遇追及", items: ["相向而行看速度和，同向追及看速度差。", "相遇题先找两人合走路程，追及题先找快者比慢者多走路程。", "题干给出时间、速度或路程比例时，先统一单位，再用速度和或速度差列式。"] },
      { type: "rule", title: "多次相遇", items: ["直线两端往返模型中，全程为 S，第 N 次相遇时两人合走 (2N-1)S。", "第一次相遇合走 1 个全程，第二次相遇合走 3 个全程，第三次相遇合走 5 个全程。", "多次相遇题常把每次相遇间隔看成重复过程，再用总路程倍数反推速度或时间。"] },
      { type: "rule", title: "环形运动", items: ["同点反向出发的环形相遇，第 N 次相遇两人合走 N 个圆周长。", "同点同向出发的环形追及，第 N 次追上快者比慢者多跑 N 个圆周长。", "不同点出发时，先找初始距离或以第一次相遇、第一次追及点为新起点，再转化为同点模型。"] }] },
      {
        id: "example",
        title: "例题讲解",
        blocks: [
          { type: "example", source: "示例题", label: "例题",
            stem: "甲乙从 AB 两地同时相向而行，速度分别为 4m/s、6m/s，全程 1000 米，多久后第一次相遇？",
            options: [{ key: "A", text: "80 秒" }, { key: "B", text: "100 秒" }, { key: "C", text: "120 秒" }, { key: "D", text: "150 秒" }],
            answer: "B",
            analysis: "速度和 = 10m/s，相遇时间 = 1000÷10 = 100 秒。" }]},
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2020 国考", label: "真题示例·环形追及",
            stem: "一条圆形跑道长 500 米，甲、乙两人从不同起点同时出发，均沿顺时针方向匀速跑步。已知甲跑了 600 米后第一次追上乙，此后甲加速 20% 继续前进，又跑了 1200 米后第二次追上乙。问甲出发后多少米第一次到达乙的出发点？",
            options: [{ key: "A", text: "180" }, { key: "B", text: "150" }, { key: "C", text: "120" }, { key: "D", text: "100" }],
            answer: "A",
            analysis: "从第一次追及点重新看第二次追及：甲加速后跑 1200 米，快者比慢者多跑 1 圈，所以乙跑 1200-500=700 米，加速后甲乙速度比为 1200:700=12:7。甲加速 20%，则加速前甲乙速度比为 10:7。第一次追上前甲跑 600 米，乙跑 600×7/10=420 米，甲比乙多跑 180 米，即甲出发点到乙出发点的顺时针距离，选 A。" }] }
    ]},
  {
    id: "boat-stream",
    categoryId: "travel",
    type: "formula",
    title: "流水行船",
    summary: "顺水加水速，逆水减水速，船速和水速可由顺逆速度反推。",
    preview: "船速 = (顺水速度 + 逆水速度) / 2",
    previewNodes: [
      { type: "script", base: { type: "text", value: "V" }, sub: "船" },
      { type: "op", value: "=" },
      { type: "frac", numNodes: [
        { type: "script", base: { type: "text", value: "V" }, sub: "顺" },
        { type: "op", value: "+" },
        { type: "script", base: { type: "text", value: "V" }, sub: "逆" },
      ], denNodes: [
        { type: "text", value: "2" },
      ] },
    ],
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "顺逆速度", content: "v顺 = v船 + v水；v逆 = v船 - v水", nodes: [
        { type: "script", base: { type: "text", value: "V" }, sub: "顺" },
        { type: "op", value: "=" },
        { type: "script", base: { type: "text", value: "V" }, sub: "船" },
        { type: "op", value: "+" },
        { type: "script", base: { type: "text", value: "V" }, sub: "水" },
        { type: "text", value: "；" },
        { type: "script", base: { type: "text", value: "V" }, sub: "逆" },
        { type: "op", value: "=" },
        { type: "script", base: { type: "text", value: "V" }, sub: "船" },
        { type: "op", value: "-" },
        { type: "script", base: { type: "text", value: "V" }, sub: "水" },
      ] },
      { type: "formula", label: "反推公式", content: "v船 = (v顺 + v逆) / 2；v水 = (v顺 - v逆) / 2", nodes: [
        { type: "script", base: { type: "text", value: "V" }, sub: "船" },
        { type: "op", value: "=" },
        { type: "frac", numNodes: [
          { type: "script", base: { type: "text", value: "V" }, sub: "顺" },
          { type: "op", value: "+" },
          { type: "script", base: { type: "text", value: "V" }, sub: "逆" },
        ], denNodes: [
          { type: "text", value: "2" },
        ] },
        { type: "text", value: "；" },
        { type: "script", base: { type: "text", value: "V" }, sub: "水" },
        { type: "op", value: "=" },
        { type: "frac", numNodes: [
          { type: "script", base: { type: "text", value: "V" }, sub: "顺" },
          { type: "op", value: "-" },
          { type: "script", base: { type: "text", value: "V" }, sub: "逆" },
        ], denNodes: [
          { type: "text", value: "2" },
        ] },
      ] },
      { type: "formula", label: "漂流速度", content: "v漂 = v船 - v水" },
      { type: "rule", title: "解题规则", items: ["顺水速度 = 船速 + 水速，逆水速度 = 船速 - 水速。", "漂流或关机随水漂时，只看水速；题干说漂流速度时通常等于船速 - 水速。", "顺逆往返或先后漂流题，先把每段方向、用时和速度列清，再用同一段水路的位置差建立等量关系。"] }] },
      { id: "example", title: "例题讲解", blocks: [{ type: "example", label: "例题", stem: "顺水 120 千米用 3 小时，逆水 120 千米用 4 小时，求船速和水速。", analysis: "顺水速度 40，逆水速度 30。船速 = (40+30)/2 = 35，水速 = (40-30)/2 = 5。" }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "2018 山东", label: "真题示例·流水行船",
            stem: "一般船横出发后先逆流航行 1 分钟，掉头后顺流航行 2 分钟；再掉头后逆流航行 3 分钟，如此类推。已知船横顺流速度为 30 米/分钟，逆流速度为 10 米/分钟。问 10 分钟后船横的位置和 20 分钟后船横的位置相距多少米？",
            options: [{ key: "A", text: "0" }, { key: "B", text: "30" }, { key: "C", text: "50" }, { key: "D", text: "100" }],
            answer: "D",
            analysis: "前 10 分钟依次为逆 1、顺 2、逆 3、顺 4，正好用完 10 分钟。10 分钟内相对距离 = 2×30 + 4×30 - 1×10 - 3×10 = 140 米。接下来 5 分钟逆行，再 5 分钟顺行；只看第 15 到 20 分钟，顺水 5 分钟相对距离增加 5×30=150 米，逆水 5 分钟相对距离减少 5×10=50 米，所以 20 分钟位置比 10 分钟位置多 100 米，选 D。" }] }]},
  {
    id: "escalator-motion",
    categoryId: "travel",
    type: "formula",
    title: "上下扶梯",
    summary: "扶梯题本质是变形的行船问题，人在扶梯上走动时速度要与扶梯速度叠加或相减。",
    preview: "顺行扶梯长度 = (人速 + 电梯速度) × 顺行时间",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "顺行扶梯", content: "扶梯长度 = (人速 + 电梯速度) × 顺行时间" },
      { type: "formula", label: "逆行扶梯", content: "扶梯长度 = (人速 - 电梯速度) × 逆行时间" },
      { type: "formula", label: "顺行格数", content: "顺行扶梯级数 = 人走过的梯级数 + 扶梯运行梯级数" },
      { type: "formula", label: "逆行格数", content: "逆行扶梯级数 = 人走过的梯级数 - 扶梯运行梯级数" },
      { type: "rule", title: "解题规则", items: ["人在运动扶梯上行走时，顺行看速度和，逆行看速度差。", "扶梯长度可以用实际级数表示，也可以用速度×时间表示，关键是统一单位。", "题干给出走过的级数时，人走级数和扶梯运行级数要分开，再合成扶梯总级数。", "上下扶梯与流水行船结构相同：扶梯速度对应水速，人速对应船速。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "行测真题", label: "真题示例·上下扶梯",
            stem: "某人沿向上运行的自动扶梯往上走，走了 20 级到达楼上；若沿同一扶梯向下走，走了 60 级到达楼下。已知该人走梯速度不变，且向上、向下所用时间相同。问该扶梯可见级数为多少级？",
            options: [{ key: "A", text: "30" }, { key: "B", text: "40" }, { key: "C", text: "50" }, { key: "D", text: "60" }],
            answer: "B",
            analysis: "设相同时间内扶梯运行 x 级。上行时扶梯总级数 = 人走 20 级 + 扶梯运行 x 级；下行时扶梯总级数 = 人走 60 级 - 扶梯运行 x 级。列 20+x = 60-x，得 x=20，扶梯级数 = 40。" }] }]},
  {
    id: "train-bridge",
    categoryId: "travel",
    type: "formula",
    title: "火车过桥",
    summary: "火车完全通过桥或杆时，关键看车头到车尾完全越过所需行驶的总长度。",
    preview: "过桥：桥长 + 车身长度 = 速度 × 时间",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "火车完全过桥", content: "桥长 + 车身长度 = 速度 × 时间" },
      { type: "image-note", label: "示意图", title: "火车完全过桥", src: "quantity/train-bridge-01-complete-pass.png", description: "火车完全通过桥时，火车行驶的路程等于桥长加车身长度。" },
      { type: "formula", label: "火车完全在桥上", content: "桥长 - 车身长度 = 速度 × 时间" },
      { type: "image-note", label: "示意图", title: "火车完全在桥上", src: "quantity/train-bridge-02-fully-on-bridge.png", description: "火车完全在桥上时，火车行驶的路程等于桥长减车身长度。" },
      { type: "rule", title: "解题规则", items: ["火车完全通过桥、隧道、站台时，行驶路程 = 外物长度 + 车身长度。", "火车完全在桥上或隧道内时，行驶路程 = 外物长度 - 车身长度。", "过电线杆、标志牌等可看成外物长度为 0，行驶路程就是车身长度。", "先判断题干问的是完全通过还是完全在上面，再套对应长度。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "行测真题", label: "真题示例·火车过桥",
            stem: "一列长 200 米的火车以 20 米/秒的速度通过一座桥，从车头上桥到车尾离桥共用 40 秒。问桥长多少米？",
            options: [{ key: "A", text: "400 米" }, { key: "B", text: "500 米" }, { key: "C", text: "600 米" }, { key: "D", text: "800 米" }],
            answer: "C",
            analysis: "完全过桥时行驶路程 = 桥长 + 车身长度。总路程 = 20×40=800 米，所以桥长 = 800-200=600 米。" }] }]},
  {
    id: "team-marching",
    categoryId: "travel",
    type: "formula",
    title: "队伍行进",
    summary: "队伍行进看人与队伍的相对速度，从队头到队尾或从队尾到队头都是相对运动。",
    preview: "队伍长度 = (人速 ± 队伍速度) × 时间",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "formula", label: "队头到队尾", content: "队伍长度 = (人速 + 队伍速度) × 时间" },
      { type: "formula", label: "队尾到队头", content: "队伍长度 = (人速 - 队伍速度) × 时间" },
      { type: "rule", title: "解题规则", items: ["人与队伍相向而行，从队头到队尾看速度和。", "人与队伍同向追赶，从队尾到队头看速度差。", "题干出现通信员、传令员、队伍前后移动时，先判断相对方向，再用队伍长度建立等量关系。", "若来回穿队，常把两段分别列式，队伍长度相同。"] }] },
      { id: "真题示例", title: "真题示例", blocks: [
          { type: "example", source: "行测真题", label: "真题示例·队伍行进",
            stem: "一支队伍以 2 米/秒的速度前进，通信员以 6 米/秒的速度从队尾跑到队头，用了 20 秒。问队伍长多少米？",
            options: [{ key: "A", text: "60 米" }, { key: "B", text: "80 米" }, { key: "C", text: "100 米" }, { key: "D", text: "120 米" }],
            answer: "B",
            analysis: "通信员从队尾到队头与队伍同向，靠速度差追上队头。队伍长度 = (6-2)×20 = 80 米。" }] }]},
  {
    id: "sequence-basic",
    categoryId: "number-sequence",
    type: "method",
    title: "基础数列",
    summary: "基础数列先识别等差、等比、质数、合数、循环和递推等常见骨架。",
    preview: "等差等比、质合数、循环、递推",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "等差数列", items: ["相邻两项差值相同。", "例：1，6，11，16，26，若差值规律应重点核对是否存在缺项或变形。"] },
      { type: "rule", title: "等比数列", items: ["相邻两项倍数相同。", "例：3，6，12，24，48，公比为 2。"] },
      { type: "rule", title: "质数数列与合数数列", items: ["质数数列常见：2，3，5，7，11，13，17，19，23，29，31。", "合数数列常见：4，6，8，9，10，12，14，15。", "判断质数时注意 1 既不是质数也不是合数。"] },
      { type: "rule", title: "数字循环与符号循环", items: ["数字循环看数值是否按固定周期重复。", "符号循环看正负号、乘除号或排列顺序是否周期变化。"] },
      { type: "rule", title: "递推数列", items: ["递推和数列：后一项由前两项相加或加减常数得到。", "递推差数列：后一项与前项差值再按规律变化。", "递推积数列：后一项由前两项相乘或乘后修正得到。", "递推商数列：后一项由前两项相除或除后修正得到。"] },
      { type: "formula", label: "递推和", content: "A3 = A1 + A2" },
      { type: "formula", label: "递推差", content: "A3 = A1 - A2" },
      { type: "formula", label: "递推积", content: "A3 = A1 × A2" },
      { type: "formula", label: "递推商", content: "A3 = A1 ÷ A2" }] },
      { id: "example", title: "例题讲解", blocks: [
          { type: "example", label: "例题", stem: "3，6，12，24，48，（ ）", answer: "96", analysis: "相邻两项倍数均为 2，是等比数列，下一项为 48×2=96。" }] }]},
  {
    id: "sequence-no-feature",
    categoryId: "number-sequence",
    type: "method",
    title: "无特征数列",
    summary: "无明显特征时先看单调性和变化幅度，按做差、做和、递推、乘法递推等顺序试探。",
    preview: "变化小先做差，变化大看倍数和幂次",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "变化较小", items: ["优先做差：无规律时继续做二次差。", "做和：相邻项求和后看是否形成简单规律。", "加法递推：无规律两项、三项递推时，尝试前项相加再修正。"] },
      { type: "rule", title: "变化较大", items: ["倍数明显时先做商，商为常数或有规律时按倍数处理。", "若乘法递推不直接成立，可尝试乘后加减修正。", "数字靠近平方、立方、质数底数时，考虑幂次修正。", "若仍无规律，可尝试修正项。"] },
      { type: "rule", title: "趋势忽大忽小", items: ["优先做和：二次、三次做和或二次做差。", "再看递推：无规律两项、三项递推。", "W、M 形波动通常要分组或隔项看。"] },
      { type: "list", label: "做题顺序", items: ["看趋势：单调、波动、忽大忽小。", "小变化先做差，大变化先做商。", "做差做商无规律，再试做和、递推和幂次修正。"] }] },
      { id: "example", title: "例题讲解", blocks: [
          { type: "example", label: "例题", stem: "2，6，12，20，30，（ ）", answer: "42", analysis: "变化较小，先做差：4、6、8、10，差值为等差数列，下一差为 12，所以答案为 42。" }] }]},
  {
    id: "sequence-feature",
    categoryId: "number-sequence",
    type: "method",
    title: "特征数列",
    summary: "特征数列按项数、数字形态、分数、幂次、根式和图形结构分类处理。",
    preview: "多重、机械拆分、分数、幂次、根式、图形",
    tabs: [{ id: "knowledge", title: "知识点", blocks: [
      { type: "rule", title: "多重数列", items: ["数项较多时，尤其 7 项以上且包含所求项，优先考虑交叉或分组。", "先交叉：奇偶项分开看。", "再分组：两两分组、三三分组，组内或组间分别找规律。"] },
      { type: "rule", title: "机械拆分数列", items: ["全是小数：整数部分单独看，小数部分单独看。", "大数字多：先拆所有数字加和，再看局部拆分。", "三位数常一一分组，四位数常两两分组。", "找内部之间的四则运算规律。"] },
      { type: "rule", title: "分数数列", items: ["分子分母趋势相同时，先分开看分子、分母，再整体看相邻分数是否有关联。", "分子分母趋势不同时，常用反约分或约分统一结构。"] },
      { type: "rule", title: "幂次数列", items: ["普通幂次：直接转化找规律。", "修正幂次：转化为普通幂次后，找修正项规律。", "出现少量 1 或类似 0 的数时，考虑负幂次；1 = a^-1（a≠0）。"] },
      { type: "rule", title: "根式数列", items: ["先统一标准：均化为根号内。", "去根号运算。", "加强号选答案时，先代入再检验。"] },
      { type: "rule", title: "图形数列", items: ["有中心凑中心：多为三角形或圆形。", "优先考虑对角线成组后进行四则运算。", "按行按列凑次数：多为方阵图形。"] },
      { type: "image-note", label: "图形数列", title: "中心凑中心与对角线分组", src: "quantity/sequence-graphic-01-center-rules.png", description: "三角形、圆形图形数列常围绕中心数建立运算关系，也可按对角线成组做四则运算。" },
      { type: "image-note", label: "图形数列", title: "方阵按行列凑次数", src: "quantity/sequence-graphic-02-grid-rules.png", description: "方阵图形数列常按行、列或边框分组，寻找组内数字之间的运算关系。" }] },
      { id: "example", title: "例题讲解", blocks: [
          { type: "example", label: "例题", stem: "13，17，19，23，29，31，（ ）", answer: "37", analysis: "这些项均为连续质数，29 后为 31，再下一项为 37。" }] }]}];

module.exports = {
  module: moduleInfo,
  categories,
  points};
