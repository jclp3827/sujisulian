# ME-LO-01：原知识重组与开发卡扩充

2026-10-23，分支`codex/notes-learning-exploration`，worktree`/Users/jmac/.codex/worktrees/notes-learning-exploration/miniprogram-1`。按用户持续推进授权完成本批内容及工程检查；独立审阅、微信实屏／真机、窄屏大字、正式启用仍待验。未提交、合并、推送、上传或发布；没有修改公共UI、schema、稳定ID、来源定位、存储／判分协议、原50JSON、原样板或G0。

新增12张：基础4／方法8。当前开发总数80：基础38／方法42；模块分布`{"data-analysis": 31, "quantity": 34, "logic": 13, "verbal": 1, "graphic": 1}`，原应用12保持。切到对应科目→全部专题→全部卡片可逐张打开，旧轮次总数冻结，不自动扩入。

|板块|简短提示|来源|条件与重组边界|
|---|---|---|---|
|方法判断|近义或反义关系都匹配时，怎样进一步辨析？|`analogy-semantic`|保留父主题、近反义完整分支、色彩与程度例子及对应规则；不取寒舍等不成立的拆词等价。|
|方法判断|种属关系和组成关系怎样区分？|`analogy-logical-grammar`|以完整包容关系分支为主体，种属是一种、组成是一部分，并保留苹果水果／轮胎汽车具体对照；排除语法词性错误分支。|
|方法判断|怎样用否定代入检验必要假设？|`assumption`|完整必要性检验而非关键词搭桥；否定后论证必然失败才能判为必要，不宣称一个必要条件足以证明结论。|
|方法判断|用人数推风险时，怎样核对比例？|`proportion-argument`|完整核心漏洞规则：患病人数／发生次数不能直接定风险，需整体基数和分母；不只问无对象的群体发生率，不取找数字即答案捷径。|
|方法判断|解释矛盾题怎样兼顾两方事实？|`explanation-question`|识别信号和完整判断规则一同保留，答案兼顾两方且解释变化，不改成单纯支持削弱题。|
|方法判断|“只要”和“只有”怎样翻译箭头方向？|`translation-basics`|核心充分必要关系、完整翻译表和只有提醒一起保留；原各表行及原样式不丢失，不单问无语境前后对应。|
|基础快记|“A且B”与“A或B”怎样取否定？|`logic-relations`|保留完整表头和成对两行德摩根式；不附带任意词前加不的过宽提示。|
|基础快记|“A推出B”的矛盾命题是什么？|`logic-relations`|完整原命题与矛盾命题同一行，A且非B为唯一反例；不混淆逆否等价与命题取否。|
|基础快记|A→B有哪些等价形式？|`deduction-reference-table`|符号说明加¬A或B和¬B→¬A两行，完整表头及原坐标保留；未引用存在性表项或反对关系的错误总提醒。|
|基础快记|两难推理的两种形式是什么？|`dilemma-reasoning`|两个完整条件形式与对应记忆解释一起保留，不编造数值或应用题。|
|方法判断|真假分析怎样选择矛盾法与假设法？|`truth-analysis`|保留矛盾必一真一假、根据真假数量看其余、无明显矛盾时假设并检验的完整规则；不使用频次数口诀。|
|方法判断|日常逻辑题怎样选择代入法与画表法？|`daily-analysis`|选项信息充分与多组匹配两种具体适用范围成对保留，父标题摘要及全分支不丢；不把一次赋值当作恒真证明。|

## 来源处置及停止范围

[来源恢复板](../content/notes/memory-v5-lo01-recovery.json)保留原身份、摘要、观察、完整选块与去向。处置计数：`{"hold": 13, "merged": 2, "reuse": 1, "targets-proposed": 11}`。其中复用样板来源可能是此前已有入口；不能将剩余待编写来源数与包含样板核对的本批来源总数混算。局部选段通过作者检查不等于整个原来源没有问题。

- `causal-attribution`：“优先因果倒置再他因”等排序只可作提示，未建立通用排序题。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `comparative-experiment-attribution`：“先排除样本瑕疵”和固定力度比较条件不足，生成前须具体化。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `general-weaken`：严谨条件的反例A且非B由同批逻辑关系卡完整承接；一般质疑的范围与样本力度泛化不扩成规则。；恢复：仅复用既有目标，错误片段仍保留待核。
- `support`：源内固定强弱排序不能脱离题干生成单独记忆题。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `definition-keywords`：“未体现某特点不得排除”须具体定义与任务语境，暂不独立造规则。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `definition-elimination`：“同构同时排除”及专业术语“道德基础／常理”有泛化风险，待补准确条件。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `reasoning-types`：“类比力度最弱／否则不选”不是普遍有效选项规则。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `equivalent-deduction`：“比较类／原因类一律不是正确选项”的措辞不用于已审题。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `truth-tactics`：点名换量词与次数口诀的必要结构未完整给出，生成暂停。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `category-analysis`：原文“有交集，但不完全包含”过强，相关独立题hold。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `quick-quantifier-syllogism`：源内点名换全称、去同存异缺充分适用前提，不能当通用知识生成。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `quick-truth-one-real`：唯一真话找矛盾后判其余已由真假分析主方法承接；点名口诀原歧义不随复用通过。；恢复：仅复用既有目标，错误片段仍保留待核。
- `quick-truth-half-right`：最高频／最低频直接给答案的条件不充分，暂停口诀型题。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `quick-matching-patterns`：原源未完整给出人数口诀的充分结构，暂不独立生成。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `quick-size-comparison`：“大大则大”缺聚合口径，未经补条件不形成通用口诀题。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。

## 验证及审阅材料

[工程证据](evidence/ME-LO-01-preview.json)逐一绑定本批源、生成包、当前冻结包与校验代码。当前页面代码逐ID打开全部80卡、揭晓、回源和返回；逐科目／专题核数量；新增卡不揭晓不能自评、模糊后按原ID进入考前速记；旧轮次成员及应用记录保持。16项定向检查、60项隔离样板基线、20项页面、16项目标设计、20项应用契约、5项内容、12模板样式离线编译与包／索引一致性检查通过。原32条搜索元数据warning保留。数学与逻辑断言是作者侧工程检查，不自称独立专家签收。

- `memory-v5-lo01-analogy-secondary`：[冻结包](evidence/notes-memory-v5-candidate-bundles/dc42dfda289722591c2fdefca05954538594466d954338f764ad2aa595de0a72.json)。
- `memory-v5-lo01-kind-part`：[冻结包](evidence/notes-memory-v5-candidate-bundles/fc5f93a859184cbc2de53edf39be31a6863421156808216c6b6ef23384ae52ed.json)。
- `memory-v5-lo01-assumption-negation`：[冻结包](evidence/notes-memory-v5-candidate-bundles/ded344cba9d7733aef4222bd3aa00c89ee3013ef64d146788653215523255371.json)。
- `memory-v5-lo01-risk-denominator`：[冻结包](evidence/notes-memory-v5-candidate-bundles/fb03c2feacec442be386b13c844e918a25359a30dac4caf18d31de94f3ce67b5.json)。
- `memory-v5-lo01-explain-both`：[冻结包](evidence/notes-memory-v5-candidate-bundles/870890bca68b53e88e3b496c9821b62bfd2af19ea1c1b98ea9aac78bdddc357a.json)。
- `memory-v5-lo01-condition-translation`：[冻结包](evidence/notes-memory-v5-candidate-bundles/0d91f36e2a2a9a3f2d98c2b646b1dcee81bf8da1d161a3eaf7fcb93e64c99c76.json)。
- `memory-v5-lo01-demorgan`：[冻结包](evidence/notes-memory-v5-candidate-bundles/1b49405ccd94d721aef6dce3b3695cd7540e145a7a3627df8edb8390d63ccba5.json)。
- `memory-v5-lo01-implication-negation`：[冻结包](evidence/notes-memory-v5-candidate-bundles/97636b09afa98df17591a071e70d0bbd95be4324e2265a66a79eeffd71dbd5a1.json)。
- `memory-v5-lo01-implication-equivalence`：[冻结包](evidence/notes-memory-v5-candidate-bundles/f8f1b609c5bfc4831f47d6a838e7cd282f2b710f91dda6a4b797877eb8a6861d.json)。
- `memory-v5-lo01-dilemmas`：[冻结包](evidence/notes-memory-v5-candidate-bundles/b2eb71679b0adede9e8a89b69ddd4904af0b17d18d524268f4506d414bdf33ea.json)。
- `memory-v5-lo01-truth-method`：[冻结包](evidence/notes-memory-v5-candidate-bundles/2f04252bd295b016b3fe28121e814f4853d3c532b8dfcd48319050c902a7f2ca.json)。
- `memory-v5-lo01-matching-methods`：[冻结包](evidence/notes-memory-v5-candidate-bundles/ef1d752b6eda072d90ad560dfa105a87fdbe6aa416cfb3e22fe1f5eb80c22af4.json)。

用户此前测试反馈不自动覆盖本批或其他未收到反馈的版本。原2内容目标hold及1归并记录保持；来源级hold不变成空题凑数量。未操作真实用户存储。下一批：ME-VE-01；如果剩余工作都需要独立内容裁定或图像复核，再明确停在对应门，不自动正式启用。
