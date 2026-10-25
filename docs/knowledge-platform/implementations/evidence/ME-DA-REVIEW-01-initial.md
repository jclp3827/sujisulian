# 资料分析独立逐卡复核（初版）

{"reviewed":29,"accept":22,"revise":7}

## memory-v5-da01-interval-growth-reverse r1 — accept

- examGoal: pass — 记忆已知总变化和一段增速时的反推式，直接用于增长率题。
- knowledgeAndConditions: pass — (1+R)=(1+r)(1+s)推得s=(R-r)/(1+r)，已知段因子须非零；步骤给出R/r含义并保留负号。
- scopeAndContrast: pass — 正向式为反解提供必要背景；目标是求另一段，与正向间隔增长卡不同。
- sourceAndFormula: pass — 所引0/1/2原块逐一对应，无转写；独立代数及数值网格复算一致。
- imagesAndContext: pass — 完整两个公式和步骤无图片依赖，R1与步骤r均指已知段可衔接。
- addedPrompt: pass — 一个未知单期关系式提问，未要求具体计算或罗列多项答案。
- duplication: pass — 与da02-interval-growth同关系但目标为反解；不与乘积业务增速当同一卡。

## memory-v5-da01-current-ratio r1 — revise

- examGoal: pass — 现期部分/整体公式属于基础回忆，考试目标明确。
- knowledgeAndConditions: pass — 同地区、时间、单位前提揭晓保留，整体量须能作分母。
- scopeAndContrast: pass — 公式主体清晰，同口径提醒为补充。
- sourceAndFormula: pass — 原公式与提醒完整精确引用，没有新公式。
- imagesAndContext: pass — 两块自足，不需原图。
- addedPrompt: fail — 仍连续问分子分母及口径两项，提前列答案维度；应改“现期比重的公式是什么？”。
- duplication: pass — 与基期比重和比重差分别为不同时点/差值目标，无重复。

## memory-v5-da01-hierarchical-ratio r1 — revise

- examGoal: pass — 回忆层级比重连乘，服务于多层占比资料题。
- knowledgeAndConditions: pass — 小/中×中/大=小/大，衔接中层和方向提醒完整。
- scopeAndContrast: pass — 左右对照保留正确链条与错向反例，不碎切。
- sourceAndFormula: pass — 原分式nodes及文字公式一致，中层非零时约消成立。
- imagesAndContext: pass — 公式和对照可独立理解，无需原步骤图。
- addedPrompt: fail — 当前又问中间层级与方向条件，成为两问；应改“隔级比重的公式是什么？”，条件留揭晓。
- duplication: pass — 层级连乘区别于单层现期比重，没有另建等价目标卡。

## memory-v5-da01-ratio-change r1 — revise

- examGoal: pass — 方法为比较部分和整体增速判比重方向，考试用途具体。
- knowledgeAndConditions: pass — 常规正的基期部分/整体且整体因子为正时，差值符号由两增速差决定；建议正文明确适用量的条件及相等情形。
- scopeAndContrast: pass — 完整方向规则保留，百分点求值仅补充。
- sourceAndFormula: pass — 原块0/3精确引用；代数差值能核验常规正量时方向结论。
- imagesAndContext: pass — 无需数值图，规则自足。
- addedPrompt: fail — “先比较哪两个增速？需要计算吗？”为两问且提示答案维度；改“怎样判断比重升降？”。
- duplication: pass — 方向识别不同于比重差公式回忆，未复制学习目标。

## memory-v5-da01-multiple-growth r2 — accept

- examGoal: pass — 易混倍数表述直接关联增长资料读题。
- knowledgeAndConditions: pass — 现期/基期与增长量/基期相差1；3倍/增长3倍例示和翻番关系正确。
- scopeAndContrast: pass — 两侧分子角色、是否含原1倍共同保留，非孤立术语。
- sourceAndFormula: pass — 三个原块一致；B/A=1+(B-A)/A在A非零时核验。
- imagesAndContext: pass — 完整对照无图依赖，原数值作为示例不要求计算。
- addedPrompt: pass — 沿用用户指定“是几倍与增长几倍的区别”，简洁明确。
- duplication: pass — 区别倍数表述，不重复百分数/百分点或间隔增速。

## memory-v5-da01-pulling-contribution r2 — accept

- examGoal: pass — 复习拉动与贡献分母识别，直接防止选错指标。
- knowledgeAndConditions: pass — 拉动为部分增量/整体基期，贡献为部分增量/整体增量；分母非零时指标有意义。
- scopeAndContrast: pass — 同一部分增量背景，两侧问法和分母共同呈现。
- sourceAndFormula: pass — 两条原式及对照一致，单位问法为百分点/百分之几。
- imagesAndContext: pass — 纯文字公式对照无图缺失。
- addedPrompt: pass — 一个“怎样区分”问题，未继续追问分母清单。
- duplication: pass — 不同于平均指标分母；这里是同一增量对不同整体分母的对比。

## memory-v5-da02-growth-amount r2 — accept

- examGoal: pass — 记忆增长量精确公式，无数值计算任务。
- knowledgeAndConditions: pass — B-A=Br/(1+r)由B=A(1+r)导出，变形式要求1+r非零；下降负号提醒保留。
- scopeAndContrast: pass — 主体是增长量而非10%附加阈值，符合NOTE017。
- sourceAndFormula: pass — 原0/1/6块精确引用，等价式代数验证成立。
- imagesAndContext: pass — 两公式和正负说明自足，无图依赖。
- addedPrompt: pass — “增长量有哪些精确公式？”单一主目标。
- duplication: pass — 已退役10%重复卡不再参与，原目标唯一。

## memory-v5-da02-interval-growth r2 — accept

- examGoal: pass — 相邻两段复合增速公式为基础回忆。
- knowledgeAndConditions: pass — R1/R2对应相邻两年，负增长带号；(1+r)(1+s)-1=r+s+rs。
- scopeAndContrast: pass — 识别信号保留第一期到第三期背景，不混入忽略交叉项近似。
- sourceAndFormula: pass — 原0/1/4块一致，正负混合独立网格验证。
- imagesAndContext: pass — 文字公式和时间背景充分，无需图。
- addedPrompt: pass — 仅问间隔增长率公式。
- duplication: pass — 与反解卡未知对象不同，与乘积业务卡业务关系不同。

## memory-v5-da02-annual-growth-rate r2 — accept

- examGoal: pass — 年均增长率复合公式及间隔识别可直接用于年均增速题。
- knowledgeAndConditions: pass — 末=初(1+R)^n；2019到2024为5个间隔，保留n的解释语境。
- scopeAndContrast: pass — 仅复合年均增速，不以算术平均代替。
- sourceAndFormula: pass — 原0/2块一致；乘积连乘定义支持指数式。
- imagesAndContext: pass — 年份短例完整，无图依赖。
- addedPrompt: pass — 一个复合增长公式问题，简洁明确。
- duplication: pass — 与年均率/量辨析卡目标分别为公式记忆和指标选择。

## memory-v5-da02-annual-rate-vs-amount r2 — accept

- examGoal: pass — 区分年均增速与年均增量，防止百分数和数量混答。
- knowledgeAndConditions: pass — 复合率与首末差/间隔关系正确，两侧答案单位不同。
- scopeAndContrast: pass — 共同年度背景、两种平均目标同时保留。
- sourceAndFormula: pass — 原复合式和完整对照一致，无自行生成数据。
- imagesAndContext: pass — 不需要图；对照包含两侧核心定义。
- addedPrompt: pass — 一个“有什么区别”问题，无答案清单。
- duplication: pass — 有同年均率公式但目标为辨析而非再次背式；与年平均量辨析对象不同。

## memory-v5-da02-annual-average-vs-increment r2 — accept

- examGoal: pass — 区分总量平均与平均增量，是常见年份分母易错点。
- knowledgeAndConditions: pass — 多年总量/统计年数对首末差/间隔年数，关系及时间分母正确。
- scopeAndContrast: pass — 两侧定义、两式与年数提醒共同保留。
- sourceAndFormula: pass — 原1/2/4/7块一致，没有纳入有争议的一律补前一年规则。
- imagesAndContext: pass — 完整双式对照无图片依赖。
- addedPrompt: pass — 单一两指标区别提问。
- duplication: pass — 不重复年均增长率/增长量对照；此处是存量平均与增量平均。

## memory-v5-da02-reading-scope r2 — accept

- examGoal: pass — 方法是比较前检查具体统计口径，服务查数和计算。
- knowledgeAndConditions: pass — 单位、时间、范围、指标问法四项具体例示合理，未一律强制换小单位。
- scopeAndContrast: pass — 共同读题背景完整，整体/部分、季度/全年例示可理解。
- sourceAndFormula: pass — 完整原检查清单精确投影，无转写。
- imagesAndContext: pass — 纯规则无需附图。
- addedPrompt: pass — “比较资料前应核对哪些口径？”为一项方法召回。
- duplication: pass — 与chart-lookup虽共有单位时间，后者增加合计重复/首年增量特有目标，非完全同义。

## memory-v5-da02-base-ratio r2 — accept

- examGoal: pass — 基期比重换算公式为基础快记目标。
- knowledgeAndConditions: pass — a0/b0=(a1/b1)(1+rb)/(1+ra)，分子是整体因子、分母是部分因子，须分母可定义。
- scopeAndContrast: pass — 现期两量及各自增长率条件共同保留。
- sourceAndFormula: pass — 原公式和信号一致；独立代数关系正确。
- imagesAndContext: pass — 文字式角色明确，无图依赖。
- addedPrompt: pass — 简洁单问基期比重公式。
- duplication: pass — 与现期比重、比重方向、比重差均为不同所求目标。

## memory-v5-da02-mixed-growth-two-parts r2 — revise

- examGoal: pass — 两部分合并增速范围与权重是具体方法识别。
- knowledgeAndConditions: fail — 正基期、互不重叠、恰好两部分已明示；但“更靠近”未排除两增速相等，此时不存在更靠近一方；应补相等/等权边界。
- scopeAndContrast: fail — 共同混合背景完整，两侧基量更大对照有用；等速边界需补。
- sourceAndFormula: fail — r=(ArA+BrB)/(A+B)核验异速权重结论；rA=rB时距离均0构成原严格更靠近的反例。
- imagesAndContext: pass — 完整四块无缺图上下文。
- addedPrompt: pass — 提示虽长但内容均为会改变结论的前提，保留合理。
- duplication: pass — 不重复乘积增速或纯算术平均；只需修边界而非删除目标。

## memory-v5-da02-percentage-point-vs-percent r2 — accept

- examGoal: pass — 百分数/百分点是实际资料题中易混的答案单位。
- knowledgeAndConditions: pass — 40%到45%差5个百分点，百分数表示比例大小，定义与示例一致。
- scopeAndContrast: pass — 完整两侧对照和识别问法共同保留。
- sourceAndFormula: pass — 原0/1/3块精确投影，无“两个数相除即增长率”的错误块。
- imagesAndContext: pass — 短例已给答案，仅作说明，无需图。
- addedPrompt: pass — 一个指标区别问题，不要求具体求值。
- duplication: pass — 不同于拉动/贡献的分母区别，本卡只辨单位与语义。

## memory-v5-da02-overlap-maximum r2 — accept

- examGoal: pass — 回忆两集合交集上界，可用于资料占比容斥。
- knowledgeAndConditions: pass — 同一总体前提在提示中保留；交集不超过各集合且较小者包含于另一者可取等号。
- scopeAndContrast: pass — 只问最大值，没有混入有争议的负下界。
- sourceAndFormula: pass — 原至多公式完整；集合包含关系独立证明min(p,q)上界可达。
- imagesAndContext: pass — 仅一个完整公式，无图片依赖。
- addedPrompt: pass — 单问同总体交集最大占比，前提未删。
- duplication: pass — 与超过100%必有交集卡目标不同：上界值对存在信号。

## memory-v5-da02-overlap-signal r2 — accept

- examGoal: pass — 识别占比超过100%则必有交集，是容斥起手信号。
- knowledgeAndConditions: pass — 同一总体明示，p+q>1推出交集>=p+q-1>0，充分结论正确。
- scopeAndContrast: pass — 不把有交集误写为交集精确值或必要条件。
- sourceAndFormula: pass — 原规则精确引用，未纳入有争议的至少式。
- imagesAndContext: pass — 一句带完整条件结论自足，无图依赖。
- addedPrompt: pass — 单问信号说明什么，没有多项追问。
- duplication: pass — 与交集最大值卡所求不同，无重复。

## memory-v5-da03-abrx-roles r1 — revise

- examGoal: pass — 增长四量符号回忆可以帮助公式联想，目标可纳入基础。
- knowledgeAndConditions: pass — 揭晓有基期/本期/增速/增量完整定义，公式在可定义分母时正确。
- scopeAndContrast: fail — 当前prompt没有说明增长体系，字母本身并无唯一通用含义。
- sourceAndFormula: pass — 原两块精确投影，B=A+X与X=AR相容。
- imagesAndContext: pass — 原定义上下文在揭晓充分，但回忆面需要补共同背景。
- addedPrompt: fail — 应改“资料分析增长问题中，A、B、R、X分别表示什么？”，避免裸字母提问。
- duplication: pass — 角色回忆区别于单个公式卡；与业务ABC下标不可混义。

## memory-v5-da03-product-growth r1 — accept

- examGoal: pass — 业务乘积关系的增速式为基础记忆。
- knowledgeAndConditions: pass — A=B×C在两期同关系时，因子相乘得ra=rb+rc+rbrc；原描述保留关系及下标。
- scopeAndContrast: pass — 不把A/B解释成ABRX四量，业务角色明确。
- sourceAndFormula: pass — 原块3完整一致，独立代数验证。
- imagesAndContext: pass — 一块公式附业务关系说明，无图依赖。
- addedPrompt: pass — 单问乘积增长率公式。
- duplication: pass — 与间隔增速代数相同但业务关系不同；与方法辨析卡目标是记式对选式。

## memory-v5-da03-quotient-growth r1 — accept

- examGoal: pass — 比值指标增长率公式为基础记忆。
- knowledgeAndConditions: pass — A=B/C时1+ra=(1+rb)/(1+rc)，分母变量变化因子可定义，减法顺序正确。
- scopeAndContrast: pass — 业务关系与分母提醒保留，避免用分子增长率作分母。
- sourceAndFormula: pass — 原4/7块一致；ra=(rb-rc)/(1+rc)独立推导。
- imagesAndContext: pass — 公式说明足够，不依赖原图。
- addedPrompt: pass — 单一公式问题，无额外追问。
- duplication: pass — 与乘积式及业务选式卡学习目标不同。

## memory-v5-da03-product-vs-quotient r1 — accept

- examGoal: pass — 按业务数量关系选乘积/比值增速公式，是具体方法辨识。
- knowledgeAndConditions: pass — 收入=单价×销量；人均/亩均/单价为比值关系，条件在公式描述保留。
- scopeAndContrast: pass — 两种公式及场景同时给出，不能把所有占比都误套乘积；原句以B×C有实际关系限定。
- sourceAndFormula: pass — 原3/4/6/7块精确投影，两式代数验证成立。
- imagesAndContext: pass — 完整两类背景无图片依赖。
- addedPrompt: pass — 一个两方法区别问题，符合用户认可的公式方法辨析。
- duplication: pass — 复用同公式是比较所需背景，辨关系目标不等同两张基础记式。

## memory-v5-da03-positive-fraction-compare r1 — revise

- examGoal: pass — 正分数比较的方法顺序是可用方法卡。
- knowledgeAndConditions: fail — 正性前提保留，但同分子/同分母方向未说，差分适用条件、交叉乘哪两个量也未说明。
- scopeAndContrast: fail — 仅列方法名，无法凭卡独立恢复具体做法，应补最小完整规则。
- sourceAndFormula: fail — 原块引用真实，但原文也仅提名，直接引用不等于内容完整；需修正文再重绑。
- imagesAndContext: pass — 无必须依赖图片，问题在文字规则缺失而非配图。
- addedPrompt: pass — 问题本身单一清楚，必要正性前提保留。
- duplication: pass — 不同于基期比较目标，可保留稳定ID补全核心做法。

## memory-v5-da04-base-compare r1 — accept

- examGoal: pass — 从现期和增速组合判基期大小是具体方法。
- knowledgeAndConditions: pass — 提示A>0、r>-100%使分母为正；现期大且r小则基期大，反之小，同行变化须进一步比。
- scopeAndContrast: pass — 完整两侧可直接判/需估算对照保留，未选矛盾原提醒。
- sourceAndFormula: pass — A/(1+r)对A单调增对r单调减，独立代数核验方向。
- imagesAndContext: pass — 式子和A/r已由提示定义，无图依赖。
- addedPrompt: pass — 必要正性和符号定义使题面略长合理，单一问题。
- duplication: pass — 与基期公式基础卡区分为方向方法选择，无重复。

## memory-v5-da04-tail-digits r1 — accept

- examGoal: pass — 尾数法按选项末位差异取所需尾数，是具体速算方法。
- knowledgeAndConditions: pass — 整整数加减可按10^k取模，减法借位提示保留；4+1+8末位3正确。
- scopeAndContrast: pass — 完整尾数分支保留运算和位数规则，不引用相邻高位错误分支。
- sourceAndFormula: pass — 原首级节点精确投影，模运算独立核验例子。
- imagesAndContext: pass — 父加法速算背景与分支完整，无图依赖。
- addedPrompt: pass — 一个选项信号下的尾数法问题，非要求计算例子。
- duplication: pass — 不同于乘除拆分，速算对象和方法不同。

## memory-v5-da04-division-split r1 — accept

- examGoal: pass — 常见百分数附近的除法拆分估算有具体识别信号。
- knowledgeAndConditions: pass — 先取分母1/2、1/3、1/4等好算量，再按余差微调；用余差/同分母保持方向。
- scopeAndContrast: pass — 保留父主题、摘要和完整方法分支，不孤立一句好算数。
- sourceAndFormula: pass — 原node1完整，未投影邻接含糊“2倍百分数”的例子。
- imagesAndContext: pass — 无需原图或数例即可恢复方法，正文可继续看例子。
- addedPrompt: pass — 一个有条件的方法提问，无作答清单。
- duplication: pass — 与乘法拆分为不同运算，非同义卡。

## memory-v5-da04-yoy-vs-mom r1 — accept

- examGoal: pass — 比较周期识别是资料分析具体易混点。
- knowledgeAndConditions: pass — 同比历史同期、环比相邻连续周期；图示2015年7月对应2014年7月/2015年6月等一致。
- scopeAndContrast: pass — 两侧共享比较周期背景，父基础术语导图保留，未混入其他宏观术语。
- sourceAndFormula: pass — 原node1及图片路径说明精确投影；实看原图日期无矛盾。
- imagesAndContext: pass — 已查看assets-source/data-analysis/statistics-terms-02-yoy-mom.png，清楚保留日期例示；不冒称真机或云图已验。
- addedPrompt: pass — “同比与环比怎样区分？”单问简洁。
- duplication: pass — 与period-terms不同，本卡是两种周期规则，后者是现期/基期角色。

## memory-v5-da04-chart-lookup-checks r1 — accept

- examGoal: pass — 查图前核对起止、合计和首年增量，有实际查数用途。
- knowledgeAndConditions: pass — 清单具体列明年份月份、重复合计、首年增量及单位，未编造数据。
- scopeAndContrast: pass — 完整检查规则和提醒保留；待补图未冒充完整图题。
- sourceAndFormula: pass — 原0/1块精确引用，未新增待核数值。
- imagesAndContext: pass — 本卡复习查图方法清单，不要求看未附图解题，缺图块不依赖。
- addedPrompt: pass — 单问核对口径，属于方法回忆，不是多问。
- duplication: pass — 与一般reading-scope有通用口径相交，合计重复/首年增量为独有目标，可并存。

## memory-v5-da05-share-difference r1 — revise

- examGoal: pass — 比重差精确公式可作为基础记忆，主目标符合。
- knowledgeAndConditions: fail — 未向用户明确差值方向；以普通量代入式子得0.02时，应表示2个百分点，现tip无法交代换算且易误作0.02个百分点。
- scopeAndContrast: fail — 须共同补上现期减基期、精确关系和表达单位，不靠隐藏contextRationale补。
- sourceAndFormula: fail — 公式本身是精确现期式，但原label称常用估算；需修原文标签与单位解释后重绑，nodes结构保留。
- imagesAndContext: pass — 完整分式nodes已保留，无图依赖，问题不是渲染切片。
- addedPrompt: pass — “比重差怎么算？”单问合理，主体为公式。
- duplication: pass — 与比重升降卡的方向判断不同，无需新增卡。

## memory-v5-da05-multiplication-split r1 — accept

- examGoal: pass — 乘数接近100%时拆成100%-小百分数，是具体速算方法。
- knowledgeAndConditions: pass — 592×0.97=574.24，示例用≈标记到574，精确分配与最终近似未混为恒等。
- scopeAndContrast: pass — 父主题、摘要和完整示例保留；“再相加”可视有符号分配，具体减法例子明确。
- sourceAndFormula: pass — 原块3完整引用，无加入截位误差担保；独立计算574.24核验。
- imagesAndContext: pass — 无需图，例子完整且只读方法不要求用户算值。
- addedPrompt: pass — 一个乘法拆分方法问题，近100%为有效信号。
- duplication: pass — 与除法拆分的商估算不同，方法不重复。
