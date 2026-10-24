# ME-HOLD-01：48个暂缓来源的直接核验与扩卡处置

2026-10-23，用户明确要求能否直接解决后，按当前笔记worktree执行。分支`codex/notes-learning-exploration`，HEAD仍`e42af05dfd7a9d52279c7c2dc5403061abfff709`。本批完成48项扩卡去向处理：20来源恢复20张卡、12来源在明确范围内复用已有目标、16来源取消原版本的机械生成资格。不是用“通过”覆盖原来的hold，也不是把48来源全部当作必须新增48题。

当前131开发卡：基础41／方法90；资料31、数量39、判断15、言语16、图推30，原12应用保持。原111卡定义和稳定ID、原8样板、原正文50JSON、旧冻结包／证据、公共UI、schema、来源定位、存储／判分及G0保持。未提交、合并、推送、上传或发布。原2内容目标hold和1归并停用记录不属于这48个来源处置，继续保留。

## 恢复的20张卡

|模块|板块|简短提示|
|---|---|---|
|quantity|基础快记|每题分值相同、全按答对假设时，答错题数怎么算？|
|quantity|基础快记|每边n人且n≥2时，实心方阵总数与最外层人数怎么算？|
|quantity|基础快记|无其他位置限制时，n个不同元素中k个定序怎样计数？|
|quantity|方法判断|不定方程怎样先用奇偶、尾数和整除约束？|
|quantity|方法判断|桥不短于车时，完全过桥与整车在桥上的路程怎样区分？|
|logic|方法判断|已发生结果的归因与一般因果规律怎样区分？|
|logic|方法判断|其他条件可比时，三种因果对比怎样判断方向？|
|verbal|方法判断|语句填入怎样同时检查行文功能与前后衔接？|
|verbal|方法判断|语句排序怎样从整体结构和细节组合入手？|
|verbal|方法判断|敬谢不敏是在感谢，还是在婉拒？|
|verbal|方法判断|凤毛麟角只是说数量少吗？|
|graphic|方法判断|一组、两组和分类图形怎样确定比较方向？|
|graphic|方法判断|怎样结合封闭空间和外露端点辨析开闭属性？|
|graphic|方法判断|线条规律怎样分别观察直线和曲线？|
|graphic|方法判断|总面数不明显时，怎样比较最大面或最小面？|
|graphic|方法判断|扇形开口变化时，怎样观察角度规律？|
|graphic|方法判断|相邻图形怎样通过共同元素找规律？|
|graphic|方法判断|图形都对称时，怎样继续看性质、数量和方向？|
|graphic|方法判断|展开图带箭头或图案时，怎样核对相邻面方向？|
|graphic|方法判断|三视图的长、高、宽怎样对应？|

新增卡都沿用原完整块或已支持的表格行／导图分支选择器，没有新增切片接口。原公式nodes、表头、单词释义／误用边界和必要图示保持；只恢复已核对的片段，不默认整点通过。新有图卡必须等当前图片完整显示才允许自评，仍可查看原文和重试，不改操作流程。

## 实际核验

火车两图已逐图核对：完全通过对应桥长＋车长，整车在桥上的阶段对应桥长－车长且桥不短于车。20张新卡中的9幅原图片有明确本地核验，另外5幅用于判定原材料边界，没有强行放入卡片。本地查看不等于云加载、微信实屏或真机验收。

词义交叉核验支持只恢复两行：[教育部国语辞典“敬谢不敏”](https://dict.concised.moe.edu.tw/dictView.jsp?ID=23816&la=0&powerMode=0)所述为推辞请托或任命的客气表达；[“凤毛麟角”](https://dict.concised.moe.edu.tw/dictView.jsp?ID=6273&la=0&powerMode=0)兼有稀少、珍贵的含义。只用于核该语言事实，不自称公考官方评分口径，不批准其他敬谦／对象词条或180条实词。

定序排列用n≤6的全排列枚举核对无其他限制时除k!；方阵按边格枚举核对4n－4并排除中心单点；答错数按固定得分差枚举。十字交叉用30／10／25及权重3:1反例确认原比值反置；集合相等反例确认“有些”不排除完全包含。这些是作者事实检查，不代替独立专家签收。

## 48项逐项结果

|来源|本次处置|范围和理由|
|---|---|---|
|data-analysis / mixture-cross|取消原版本机械扩卡|已用加权公式与反例确认原十字比例方向反置；时间混合无条件排序不成立。此原版本不直接生成方法卡；正确公式和替换建议另存，不把错误原文标成通过。|
|data-analysis / share-415|明确范围复用|增长量／基期／现期的主关系复用ABRX；份数近似记号和负增命名不成新卡，重复百化分表不批量展开。|
|quantity / chicken-rabbit|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|quantity / age-problem|取消原版本机械扩卡|年龄差不变是可保留的背景知识；但同一规则块混有无依据年龄段猜测，当前选择器不能安全拆出。停止把整块作为卡片候选，保留明确的逐项修订建议。|
|quantity / matrix-problem|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|quantity / balance-weighing|取消原版本机械扩卡|选最小选项没有逻辑保证；三分法须固定轻重模型。撤销这种整块机械扩卡，不能以补个笼统前提恢复所有称重题。|
|quantity / ordered-arrangement|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|quantity / normal-equation|明确范围复用|列式与设量的一般流程不再单独生成名词卡；具体工程赋值方法已有入口，非宣称其覆盖所有方程应用。|
|quantity / indeterminate-equation|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|quantity / sequence-basic|明确范围复用|基础数列观察由已有方法卡承接，缺项示例及无上下文递推简写不另成卡；不宣称已补齐全部数列公式。|
|quantity / train-bridge|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|logic / causal-attribution|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|logic / comparative-experiment-attribution|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|logic / support|明确范围复用|必要条件部分复用现有检验卡，固定支持力度总排序停用；其他支持方式继续原文阅读，不声称都由同一方法取代。|
|logic / definition-keywords|取消原版本机械扩卡|关键词抓取应结合实际定义和必要条件，“未体现特点不得排除”不能通用。撤销抽象流程独立卡，后续仅在有完整定义实例时另设具体目标。|
|logic / definition-elimination|取消原版本机械扩卡|同构同时排除和专业术语按常理猜缺充分条件；拒绝作为通用规则卡，不把未知术语当考试知识点。|
|logic / reasoning-types|明确范围复用|严格条件翻译部分已有入口，类比力度必最弱等启发不单独成卡；不把所有推理类型混为条件翻译。|
|logic / equivalent-deduction|明确范围复用|推出与逆否的主等价关系已有原表卡；不采用比较／原因类选项一律不选的补充。|
|logic / truth-tactics|明确范围复用|真假约束由完整矛盾／假设方法承接；点名与次数口诀不具通用前提，不重复造方法卡。|
|logic / category-analysis|取消原版本机械扩卡|存在交集允许完全包含甚至两集合相同；已给反例，原“不完全包含”错误，此原版本不纳卡。|
|logic / quick-quantifier-syllogism|取消原版本机械扩卡|由点名个体变全称没有普遍有效性。原口诀前提不完整，不保留为等待补一句条件即可放行的卡。|
|logic / quick-truth-half-right|取消原版本机械扩卡|真假数量不由关键词最高／最低频普遍决定；没有完整结构证明，退出通用口诀扩卡。|
|logic / quick-matching-patterns|取消原版本机械扩卡|3+2／4+3+2+1的人数分布不足以保证所述答案捷径，缺原完整题干时不创建规则卡。|
|logic / quick-size-comparison|取消原版本机械扩卡|分项都大须有同口径、单调聚合才能推总体大；源没有聚合定义，不直接生成为通用规律卡。|
|verbal / logic-correspondence|取消原版本机械扩卡|转折／并列关系须在完整语境中辨认；不恢复被用户否定的上下文解释对应标签题。该框架只留原文，不用含糊名词补数量。|
|verbal / context-control|取消原版本机械扩卡|猜作者会用哪个词、政治觉悟等一般建议不是独立考试知识。取消机械扩卡资格，非等待人工批准后就可生成。|
|verbal / passage-types|取消原版本机械扩卡|科普不选对策、有对策必选均非跨语境定理。该原表只作阅读框架，本批不转为排除规则。|
|verbal / reading-strategy|明确范围复用|相对最优是主旨选项比较框架的提醒，不额外成卡；不将任何瑕疵都可接受当成知识。|
|verbal / sentence-insertion|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|verbal / sentence-ordering|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|verbal / content-word-rhymes|取消原版本机械扩卡|180条混有专业口径和过度简化，整表不能一次转180卡。取消整表机械生成；少量词条须按具体词对查核后另行设计，不宣称已逐词核准。|
|verbal / idiom-honorific|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|verbal / idiom-specific-object|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / proposition-form|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / solving-workflow|明确范围复用|黑白等拆分观察已有具体方法入口；通用工作流不单独做标签记忆，非只用黑白替代所有图推方法。|
|graphic / closed|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / line-count|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / area-count|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / angle-count|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / element-count|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / symmetry-pattern|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / number-reasoning|取消原版本机械扩卡|没有具体字形时不生成某数字固定面／轴数，也不在知识记忆区恢复独立数值计算。原框架阅读保留，取消本版本的机械生成任务。|
|graphic / stereo-unfold|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / stereo-section|取消原版本机械扩卡|已区分圆柱与圆锥截交，正圆柱侧面的非轴平行截交为椭圆类，不是原文所称抛物线／双曲线。原图带任意多边形等额外注释也不能整体批准；本版本不纳卡，单列精确纠错稿。|
|graphic / stereo-view|恢复局部目标|已补必要条件或核对原图／词义，只恢复所列完整主知识。未选原片段不自动通过。|
|graphic / graphic-qualitative-quantitative|明确范围复用|定性／定量／位置的具体方法由各专题承接；整风／整形及氏的跨页字谜不作为必须背诵的统一知识，不更改旧来源分类。|
|graphic / graphic-three-types-hints|明确范围复用|背景、分割、对称的具体方法已有专题承接；不使用七字映六提示的机械映射。|
|graphic / graphic-stereo-overview|明确范围复用|展开图方向方法复用实际图推来源的新卡，旧固定13/24/56编号只属特定母图，不脱图迁用，也不宣称截面部分已修正。|

“复用”只指理由写明的既有目标，并非一个旧卡覆盖整个来源。取消机械扩卡代表该原版本不宜直接转卡，不能改称全部内容错误或以后永远不需研究。尤其180条实词仍未逐词校勘，现阶段取消的是整表直接铺卡任务。

## 原正文纠错与独立审阅边界

本批解决的是这48项的扩库阻塞／去向，**没有声称已修好所有原正文**。[逐项纠错稿](evidence/notes-memory-v5-hold-source-corrections-20261023.json)列明原位置、问题、替换内容和核验方式，包括混合比值、负增份数、方阵层数、存在性交集、圆柱截面和不成立的泛化口诀。它是可审查的纠错稿，未写入当前冻结原50JSON。需要修改原文时应另作原内容版本更新，重核源摘要、受影响引用与冻结候选，不能靠偷偷覆盖正文消除错误提示。

对圆柱问题已作代数核对并与[David Eberly的圆柱与平面求交原作者文档](https://www.geometrictools.com/Documentation/IntersectionCylinderPlane.pdf)交叉检查；正圆柱非轴平行截交不能直接照搬圆锥的抛物线／双曲线。故该原版本不入卡；不是仍把已判明的错误叫作“待查”。

当前48条来源的作者扩卡处置均不再是hold；这不构成正式准入，也不消除未选段和原文纠错工作。没有自签独立审阅／正式启用，没有把之前的用户通过套到这20卡。后续可在当前worktree直接审阅新卡，原始错误段及未核词条不重新放行。

## 工程验证与冻结材料

[本批证据](evidence/ME-HOLD-01-preview.json)绑定当前源台账、48项前后处置、原图片摘要、123活动冻结包及131卡生成版本。19项当前页面检查逐ID打开全部131卡，核科目／专题数、自评与考前速记、原文返回、旧轮次和存储失败；新增两图卡还检查缺一图不可自评、图片失败重试和旧加载事件失效。60项隔离基线、页面20项、设计16项、原应用契约20项、内容5项、12模板样式离线校验和包／索引一致性通过；原32条搜索元数据warning保持。没有新增实屏／真机／窄屏大字／整包构建或发布证据。

- `memory-v5-hold01-score-difference`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/1fa65b724a41b0a57252b613b53c63f0f7e58a51b58b0ea8955daa9562a53330.json)。
- `memory-v5-hold01-square-array`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/eb81ff0bd47ad7d07ee26c7246a1e051b37acffc07b3a1177ebca05c13dfcc10.json)。
- `memory-v5-hold01-ordered-subset`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/a983cc5ab953e65da085f192a5fd9dc9a7c5aa4a54c5c44c3bae3940c09ae2d8.json)。
- `memory-v5-hold01-integer-constraints`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/6a3273f74efa88b16431cc8c1f6860dfd0eff32b18ac94decc7a1cab233b0976.json)。
- `memory-v5-hold01-train-distance`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/72a504872ec5c1fe036003cff2270953fe0a5f18b10cab4b6e65af0c5657bbf2.json)。
- `memory-v5-hold01-fact-versus-law`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/0641e24aa3144621df0559b70b284f437112d11a60243f71918951289bcf450a.json)。
- `memory-v5-hold01-experimental-contrasts`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/263ef48b7ffec62d8b0f3e9a2637c105028b3ebd7492fe100e0ed3362e62c213.json)。
- `memory-v5-hold01-sentence-fit`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/0d004e8b5210340e5c4a58951f8d308c22349f7735812a37b3228922f9373b1c.json)。
- `memory-v5-hold01-sentence-groups`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/1449a9d29e20f20effd577588ecca10be28577d11bf5b2b0afd85b4529388b50.json)。
- `memory-v5-hold01-respectful-decline`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/1ac65553208916d3a89d6379e37989beba8f8031b78c8ea95be4a37edd9b7a6d.json)。
- `memory-v5-hold01-rare-valuable`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/f1b283caabd3ed1808aa77e399d1c2590256463172857b8ba38f7ac81f68d4c9.json)。
- `memory-v5-hold01-comparison-direction`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/e19228a72279361e82852c98277f16e7f3b8b6833443cb367ae53e4e47d62f2a.json)。
- `memory-v5-hold01-open-closed`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/c431aa3229dff03ee44a2832edfa1293076eaf35bc39bc73084f75f895433576.json)。
- `memory-v5-hold01-line-scope`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/801aceb325f542f4f3c3471e5622fcf9f218989cbbf321ace378053ca53e1cc7.json)。
- `memory-v5-hold01-largest-faces`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/6216716f39c163fe443766e6681246f18a7d1d0cff4957dbdc1c4727c9e1af2f.json)。
- `memory-v5-hold01-sector-angles`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/21e299efe6838cb602e78b1d3e6c631182347e5cc576643110ea625368198152.json)。
- `memory-v5-hold01-adjacent-shared`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/5b8f10c3e8f9bf9f2912a4419726c301a07d031c11880c2951a4dff082c13893.json)。
- `memory-v5-hold01-symmetry-dimensions`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/bf21695e41072db9d9bbb845d6e287cfd84dcd05e234ee6f0bb42b8463691ed4.json)。
- `memory-v5-hold01-pattern-orientation`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/5fa40bddf47c2694dfdd600160ceb8f95fe06ee3d25b67f31d72c081e8332f36.json)。
- `memory-v5-hold01-three-views`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/833d289326579c808c80304e5391e1b0775007ecafd201574c05086e2cac48b6.json)。
