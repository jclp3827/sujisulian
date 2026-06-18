#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repo = path.resolve(__dirname, '..');

const patches = {
  'interval-growth-reverse': { keywords:['间隔增长率反推','单期增长率'], aliases:['反推隔年增长率'], tags:['资料分析','增长类','公式'], indexText:'已知隔年总增长率和一段增长率，反推另一段时用总增长率减已知再除以1加已知。' },
  'ratio-trend': { keywords:['比重趋势','占比走向'], aliases:['比重方向'], tags:['资料分析','比重类','趋势'], indexText:'比重趋势只看部分增速和整体增速的比较，部分涨更快则比重上升。' },
  'ratio-difference': { keywords:['比重差值','占比差值'], aliases:['比重差距'], tags:['资料分析','比重类','比较'], indexText:'不同群体或不同时期的比重差异，需先统一口径再比较。' },
  'data-inclusion': { keywords:['资料容斥','集合重叠'], aliases:['交叉计数'], tags:['资料分析','特殊考点','容斥'], indexText:'资料分析里的容斥问题用集合思想解，注意比例重叠和总量边界。' },
  'age-problem': { keywords:['年龄问题','年龄差不变'], aliases:['年龄题','父子年龄'], tags:['数量关系','特殊应用题','方程'], indexText:'年龄问题抓住年龄差不变和时间变化每个人同加同减，常用方程法处理。' },
  'matrix-problem': { keywords:['方阵问题','实心方阵'], aliases:['方阵列式','矩形方阵'], tags:['数量关系','特殊应用题','方阵'], indexText:'方阵问题每层人数等于每边人数乘4减4，相邻两层相差8人。' },
  'clock-problem': { keywords:['钟表问题','时针分针'], aliases:['钟表夹角','表快慢'], tags:['数量关系','特殊应用题','钟表'], indexText:'钟表问题把时针和分针转成角速度追及，分针6度每分时针0.5度每分。' },
  'competition-problem': { keywords:['比赛问题','淘汰赛','循环赛'], aliases:['单循环','双循环','比赛场次'], tags:['数量关系','特殊应用题','比赛'], indexText:'比赛问题先判断淘汰赛还是循环赛，单循环组合数场次，淘汰赛每轮淘汰一半。' },
  'balance-weighing': { keywords:['天平称重','最少称量'], aliases:['找次品','砝码优化'], tags:['数量关系','特殊应用题','优化'], indexText:'天平称重题一次称量最多区分3份，n次最多区分3的n次方份。' },
  'adjacent-bundle': { keywords:['相邻问题','捆绑法'], aliases:['绑在一起','内部排列'], tags:['数量关系','排列组合','方法'], indexText:'相邻元素先捆绑成一个整体，再与其余元素排列，注意捆绑后内部也要排。' },
  'non-adjacent-insertion': { keywords:['不相邻','插空法'], aliases:['插空','隔开放入'], tags:['数量关系','排列组合','方法'], indexText:'不相邻元素先排其他元素，再在它们之间的空隙中插入不相邻元素。' },
  'ordered-arrangement': { keywords:['定序排列','定序问题'], aliases:['部分有顺序','固定顺序'], tags:['数量关系','排列组合','方法'], indexText:'部分元素有固定顺序时，先全排列再除以定序部分的阶乘。' },
  'identical-distribution': { keywords:['相同元素分配','隔板法'], aliases:['隔板分配','相同物品分配'], tags:['数量关系','排列组合','方法'], indexText:'相同元素分给不同组，每组不为空时用隔板法。' },
  'equal-grouping': { keywords:['均分组','等量分组'], aliases:['等份分组','多组相同'], tags:['数量关系','排列组合','方法'], indexText:'均分成若干组时要注意消序，组数相同则除以组数的阶乘。' },
  'derangement': { keywords:['错位重排','全错排'], aliases:['错排问题','都不在自己位置'], tags:['数量关系','排列组合','方法'], indexText:'n个元素全都不在自己原位置的排列数，递推公式为Dn=(n-1)(Dn-1+Dn-2)。' },
  'circular-arrangement': { keywords:['环形排列','圆桌排列'], aliases:['圆排列','环排'], tags:['数量关系','排列组合','方法'], indexText:'n个不同元素围成一圈排列数为(n-1)!。' },
  'repeated-arrangement': { keywords:['重复排列','可重复排列'], aliases:['放回排列','允许重复'], tags:['数量关系','排列组合','方法'], indexText:'每次选择后该元素仍可被再次选择，排列数为基础选择数的n次方。' },
  'same-group-probability': { keywords:['相同分组概率','同组概率'], aliases:['同一组概率','配对概率'], tags:['数量关系','排列组合','概率'], indexText:'求几个人在同一个组的概率时，先确定分母为总分组数，分子为有利分组数。' },
  'cycle-remainder': { keywords:['周期问题','余数问题'], aliases:['余数口诀','周期循环'], tags:['数量关系','周期','余数'], indexText:'周期日期题先看最小公倍数和余数，再把循环结构转成同余关系。' },
  'date-week': { keywords:['星期计算','日期推算'], aliases:['算星期','跨年星期'], tags:['数量关系','周期日期','日期'], indexText:'星期计算先看天数差除7的余数，平年闰年跨年时注意2月天数不同。' },
  'extreme-construction': { keywords:['构造法','构造论证'], aliases:['最大值构造','最小值构造'], tags:['数量关系','最值','构造'], indexText:'构造法先设定极端条件，再在符合约束下调整到最大值或最小值。' },
  'number-formulas': { keywords:['基础公式','数列'], aliases:['平方差','完全平方','等差等比'], tags:['数量关系','数论','公式'], indexText:'平方差、完全平方、等差等比数列是数量关系计算和数字推理的基础工具。' },
  'sequence-no-feature': { keywords:['无特征数列','多级数列'], aliases:['做差数列','递推数列'], tags:['数量关系','数字推理','数列'], indexText:'无特征数列先做差、再做商或考虑递推关系。' },
  'sequence-feature': { keywords:['特征数列','分数数列','小数数列'], aliases:['幂次数列','根式数列','数位组合'], tags:['数量关系','数字推理','数列'], indexText:'特征数列包括分数、小数、幂次、根式等，有明确规律或计算模式可识别。' },
  'boat-stream': { keywords:['流水行船','顺水逆水'], aliases:['船速水速','静水速度'], tags:['数量关系','行程','流水'], indexText:'流水行船中顺水速度等于船速加水速，逆水速度等于船速减水速。' },
  'escalator-motion': { keywords:['扶梯问题','自动扶梯'], aliases:['扶梯速度','扶梯级数'], tags:['数量关系','行程','扶梯'], indexText:'扶梯问题把扶梯行走和人行走合并计算级数，顺行相加逆行相减。' },
  'train-bridge': { keywords:['火车过桥','过桥问题'], aliases:['火车过隧道','车长桥长'], tags:['数量关系','行程','技巧'], indexText:'火车过桥题先把总路程看成车长加桥长，再除以速度求通过时间。' },
  'general-attribution-and-root-cause': { keywords:['直接根本原因','原观点反对者'], aliases:['根本原因','质疑反对者'], tags:['判断推理','逻辑论证','归因'], indexText:'直接根本原因题出现原观点和反对者观点，质疑反对者时优先找原观点能否导致反对者观点。' },
  'proportion-argument': { keywords:['比例论证','相对比例'], aliases:['比例题','基数陷阱'], tags:['判断推理','逻辑论证','比例'], indexText:'比例论证常拿绝对数和相对数混淆，优先看基数和样本总量是否一致。' },
  'deduction-reference-table': { keywords:['推导参考表','推理速查'], aliases:['逻辑等价表','推理对照'], tags:['判断推理','形式推理','参考'], indexText:'推导参考表汇总常见逻辑等价关系，方便快速查阅逆否、德摩根和命题转化公式。' },
  'daily-analysis': { keywords:['日常分析','日常推理'], aliases:['生活推理','日常逻辑'], tags:['判断推理','形式推理','分析'], indexText:'日常推理题还原生活中的逻辑关系，警惕话题不一致和过度推断。' },
  'graphic-qualitative-quantitative': { keywords:['图形推理','十五字口诀'], aliases:['屈臣氏整风','点线面角素','直接想位移'], tags:['判断推理','图形推理','方法'], indexText:'图形推理十五字口诀对应定性分析、定量分析和位置分析。' },
  'quick-quantifier-syllogism': { keywords:['量词秒杀','三段论'], aliases:['所有有些','范畴速判'], tags:['判断推理','秒杀','量词'], indexText:'量词秒杀用好所有和有些的关系，通过范畴推出方向和量级变化快速解题。' },
  'quick-truth-one-real': { keywords:['一真速解','唯一真话'], aliases:['一真题','一真秒杀'], tags:['判断推理','秒杀','真假'], indexText:'唯一真话题先找矛盾关系，其余话必为假，据此顺推得出真相。' },
  'quick-truth-half-right': { keywords:['半真半假','半对半错'], aliases:['半真速解','条件各半'], tags:['判断推理','秒杀','真假'], indexText:'半真半假题关键是在论断中找一个概念出现两次作为推理起点。' },
  'quick-matching-patterns': { keywords:['匹配题速解','连线匹配'], aliases:['对应匹配','列表法'], tags:['判断推理','秒杀','匹配'], indexText:'匹配题优先用列表法或箭头法，找题干中出现两次以上的元素作为突破口。' },
  'idiom-honorific': { keywords:['敬谦误用','谦词敬词'], aliases:['谦敬成语','尊称误用'], tags:['言语理解','词语积累','成语'], indexText:'成语题中敬词和谦词不能混用，敬词用于对方，谦词用于自己。' },
  'idiom-specific-object': { keywords:['特定对象成语','适用对象'], aliases:['适用主体','成语搭配对象'], tags:['言语理解','词语积累','成语'], indexText:'有些成语有特定适用对象，如举案齐眉只用于夫妻，使用前先确认对象匹配。' },
};

const moduleMap = {
  'note-data-analysis': ['interval-growth-reverse','ratio-trend','ratio-difference','data-inclusion'],
  'note-quantity': ['age-problem','matrix-problem','clock-problem','competition-problem','balance-weighing','adjacent-bundle','non-adjacent-insertion','ordered-arrangement','identical-distribution','equal-grouping','derangement','circular-arrangement','repeated-arrangement','same-group-probability','cycle-remainder','date-week','extreme-construction','number-formulas','sequence-no-feature','sequence-feature','boat-stream','escalator-motion','train-bridge'],
  'note-logic': ['general-attribution-and-root-cause','proportion-argument','deduction-reference-table','daily-analysis','graphic-qualitative-quantitative','quick-quantifier-syllogism','quick-truth-one-real','quick-truth-half-right','quick-matching-patterns'],
  'note-verbal': ['idiom-honorific','idiom-specific-object'],
};

for (const [file, ids] of Object.entries(moduleMap)) {
  const fp = path.join(repo, 'miniprogram/models', `${file}.js`);
  let text = fs.readFileSync(fp, 'utf8');
  let changed = false;

  for (const id of ids) {
    const f = patches[id];
    if (!f) continue;
    const idx = text.indexOf(`"id": "${id}"`);
    if (idx === -1) continue;

    let depth = 0;
    let pos = idx;
    while (text[pos] !== '{' && pos > 0) pos--;
    if (text[pos] !== '{') continue;

    const previewKey = `"preview"`;
    const pi = text.indexOf(previewKey, pos);
    if (pi === -1) continue;

    const preEnd = text.indexOf('\n', pi);
    const afterPreview = preEnd + 1;
    const nextKey = text.slice(afterPreview).match(/^\s*"/);
    if (!nextKey) continue;
    const nextQuote = afterPreview + nextKey.index;
    const existing = text.slice(afterPreview, afterPreview + 100);
    if (existing.includes('"keywords"')) continue;

    const insertion = [
      `    "keywords": ${JSON.stringify(f.keywords)},`,
      `    "aliases": ${JSON.stringify(f.aliases)},`,
      `    "tags": ${JSON.stringify(f.tags)},`,
      `    "indexText": ${JSON.stringify(f.indexText)},`,
    ].join('\n');

    text = `${text.slice(0, preEnd + 1)}${insertion}\n${text.slice(preEnd + 1)}`;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fp, text);
    console.log(`${file}: patched ${ids.length} points`);
  }
}
