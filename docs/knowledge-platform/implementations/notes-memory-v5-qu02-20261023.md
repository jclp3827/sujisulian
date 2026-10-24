# ME-QU-02：原知识重组与开发卡扩充

2026-10-23，分支`codex/notes-learning-exploration`，worktree`/Users/jmac/.codex/worktrees/notes-learning-exploration/miniprogram-1`。按用户持续推进授权完成本批内容及工程检查；独立审阅、微信实屏／真机、窄屏大字、正式启用仍待验。未提交、合并、推送、上传或发布；没有修改公共UI、schema、稳定ID、来源定位、存储／判分协议、原50JSON、原样板或G0。

新增20张：基础12／方法8。当前开发总数68：基础34／方法34；模块分布`{"data-analysis": 31, "quantity": 34, "logic": 1, "verbal": 1, "graphic": 1}`，原应用12保持。切到对应科目→全部专题→全部卡片可逐张打开，旧轮次总数冻结，不自动扩入。

|板块|简短提示|来源|条件与重组边界|
|---|---|---|---|
|方法判断|植树的端点条件怎样影响棵数？|`planting-array`|保留完整三行表头、端点和闭合路线规则；等距且总长整分，不只背加减1。|
|基础快记|分针与时针每分钟转多少度？|`clock-problem`|完整三行速度表，角速度单位不丢；相对速度作同一速度表补充，不带入时针追分针的错误表述。|
|基础快记|每对队伍赛一次或两次时，总场次怎么算？|`competition-problem`|主目标为循环赛两式；提示明示每对一次或两次，排除单循环歧义文字及淘汰赛不充分轮次规则。|
|基础快记|隔板法的计数公式是什么？|`identical-distribution`|相同元素、不同对象、每份至少一个三个条件与公式同在；不自动宣称任意可空条件只需预分配即可。|
|方法判断|平均分组何时要除以组数的阶乘？|`equal-grouping`|完整有序无序成对规则和公式，n及m在各自原规则中表示组数／位置数；不裁成无定义分母。|
|基础快记|1至6个元素的全部错位数是多少？|`derangement`|完整小表及全部不在原位条件，保留恰好k个回位的处理；不是具体排列计算题。|
|基础快记|旋转等价、翻转不等价时，环形排列数怎么算？|`circular-arrangement`|提示限定旋转去重且不合并镜像；原文n个不同元素及固定一人规则保留，不用于带编号座位。|
|基础快记|n种选择可重复选m次，情形数怎么算？|`repeated-arrangement`|保留独立位置每次同样n种选择、可重复与普通不重复的完整规则和原指数nodes。|
|基础快记|有限且等可能时，事件概率怎么算？|`probability-basic`|保留原分式nodes及等可能前提；不纳入只凭无限结果就用几何概率的段落或遗漏独立性的连续事件。|
|基础快记|质量浓度怎么算？|`concentration-cross`|引用完整浓度、溶质、溶液与溶剂关系；质量口径相同且溶液质量非零，不带入无论混合溶质都不变的断言。|
|方法判断|从第1项起计数时，怎样用余数定位？|`cycle-remainder`|明确1起算，保留余0对应最后一项及完整步骤；不引用每隔字面必定加1的提醒。|
|基础快记|平闰年和大小月的天数怎样记？|`date-week`|完整保留年份与月份规则；365/366指实际日长，不把任意同月同日跨度自动等于某一整年。|
|方法判断|目标可实现时，最不利情况法怎么用？|`drawer-principle`|目标可实现的前提、最不利加1、某类不足n-1要截断的完整限制同在；不要求抽取数计算。|
|方法判断|总和固定时，某个量的最值怎样构造？|`extreme-construction`|完整和定规则加限制提醒，保留不同、整数、至少等边界；未采用无条件乘积近远或三端口诀。|
|基础快记|相似比为k时，长度、面积和体积比是什么？|`geometry-formulas`|完整同一比例放缩定义及公式，面积用于相似平面图形、体积用于相似立体；不引入未审公式图片或未对应角的边比。|
|方法判断|怎样快速判断整除？|`number-properties`|完整保留整除特性，含3/9、2/5、4/25、8/125及6的合取；不带总体份数无条件相加或错误余数口诀。|
|方法判断|无明显特征的数列怎样选择观察方法？|`sequence-no-feature`|趋势与做差、做商、做和、递推的完整对照保留，优先尝试是启发式而非保证存在唯一规律。|
|方法判断|多重数列怎样拆分观察？|`sequence-feature`|完整交叉与分组方法，7项以上为优先考虑信号，不是必要充分条件；不纳入错误负幂或未核图形。|
|基础快记|船速大于水速时，顺逆水速度怎样换算？|`boat-stream`|保留顺逆与反推两组完整公式及嵌套nodes；静水船速及水速不变，未引用错误漂流公式或含冲突文字规则。|
|基础快记|顺行与逆行扶梯的路程公式是什么？|`escalator-motion`|顺行速度和、逆行速度差及单位规则完整保留；逆行要求人速大于梯速，静态长度不变，不拆成无上下文的步数。|

## 来源处置及停止范围

[来源恢复板](../content/notes/memory-v5-qu02-recovery.json)保留原身份、摘要、观察、完整选块与去向。处置计数：`{"hold": 9, "merged": 2, "reuse": 2, "targets-proposed": 20}`。其中复用样板来源可能是此前已有入口；不能将剩余待编写来源数与包含样板核对的本批来源总数混算。局部选段通过作者检查不等于整个原来源没有问题。

- `chicken-rabbit`：“理想—现实”正负需随假设方向确定，不固定为有符号通式。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `age-problem`：年龄段猜测和平方数优先只是经验，不能当通用限制。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `matrix-problem`：层数=边长/2缺单双与中心口径，未生成。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `balance-weighing`：选最小选项没有题干依据；三分法需偏差方向与模型。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `ordered-arrangement`：有其他不对称位置约束时不能直接除k!。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `normal-equation`：原内容主要为通用读题列式流程，单独卡价值不足；设中间量没有完整实例支撑，不把附加提示提升为主目标。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `indeterminate-equation`：“难算变量先赋0”缺可行性和目标不变量证明；OCR方程待核。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `sequence-basic`：等差例中缺项已有源提示，不作为无误标准数列。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `travel-basic`：总路程／总时间及速度口径已由原平均速度样板承接，不重复新增通用S=vt记忆卡。；恢复：仅复用既有目标，错误片段仍保留待核。
- `train-bridge`：图文边界尚需逐图复验，本批不靠删图处理原图像待核，也不新增不完整路径问题。；恢复：先核原源条件、符号或重组所需上下文；不能由本批作者自签解除源疑点。独立裁定后再考虑新目标。
- `team-marching`：相向和、同向差的主目标已由QU01相遇追及覆盖，队伍文字保留原文，不另造同目标方法卡。；恢复：仅复用既有目标，错误片段仍保留待核。

## 验证及审阅材料

[工程证据](evidence/ME-QU-02-preview.json)逐一绑定本批源、生成包、当前冻结包与校验代码。当前页面代码逐ID打开全部68卡、揭晓、回源和返回；逐科目／专题核数量；新增卡不揭晓不能自评、模糊后按原ID进入考前速记；旧轮次成员及应用记录保持。16项定向检查、60项隔离样板基线、20项页面、16项目标设计、20项应用契约、5项内容、12模板样式离线编译与包／索引一致性检查通过。原32条搜索元数据warning保留。数学与逻辑断言是作者侧工程检查，不自称独立专家签收。

- `memory-v5-qu02-planting`：[冻结包](evidence/notes-memory-v5-candidate-bundles/98a3acbeea4d46f84c52380cc545ce7f62471c1d85feb3fbe85fb33e4edd6726.json)。
- `memory-v5-qu02-clock-speeds`：[冻结包](evidence/notes-memory-v5-candidate-bundles/891e1355c3ee158476fe1305a441a0ab7cbbaecda748189c1ed1fb05e39ef32e.json)。
- `memory-v5-qu02-round-robin`：[冻结包](evidence/notes-memory-v5-candidate-bundles/7f9ac32995971b350fc6547529961e50df28fbc2717042332bd017eb69d2b0e5.json)。
- `memory-v5-qu02-partition`：[冻结包](evidence/notes-memory-v5-candidate-bundles/eba23ec746bd4f826084a45d61c4fcaa95ea15372b0ecf930cc95b309082c13e.json)。
- `memory-v5-qu02-group-labels`：[冻结包](evidence/notes-memory-v5-candidate-bundles/0048ea571c356e4e289898b6963bf26922001cb96f656dbeaa7f62c337e7133e.json)。
- `memory-v5-qu02-derangements`：[冻结包](evidence/notes-memory-v5-candidate-bundles/574e07b008690df134f9f44fa85f7bb61799c15e671a958ae40c9c50a899e3ea.json)。
- `memory-v5-qu02-circle`：[冻结包](evidence/notes-memory-v5-candidate-bundles/df20265386f44259d568cfccc38979d67c2c02d2e3e6c3ce9cda8e9f308b37a9.json)。
- `memory-v5-qu02-repetition`：[冻结包](evidence/notes-memory-v5-candidate-bundles/aa4a776049940aefaa1756c46fec0a310a9204263fdf94c9f6f370d1b3fb911e.json)。
- `memory-v5-qu02-classical-probability`：[冻结包](evidence/notes-memory-v5-candidate-bundles/6f692666dd5c94cd4036a5edf171078025ced142fd0eeac80bbbea50cd396302.json)。
- `memory-v5-qu02-concentration`：[冻结包](evidence/notes-memory-v5-candidate-bundles/52f0ac56cacace2962e8b2eec3bfb19418355ad1b257ca78a29e1133533a579b.json)。
- `memory-v5-qu02-cycle-position`：[冻结包](evidence/notes-memory-v5-candidate-bundles/58bde5f8a21e9b76bc40a27fe56d27c90541eb62219132826ff6e94eb03ebc6c.json)。
- `memory-v5-qu02-calendar-lengths`：[冻结包](evidence/notes-memory-v5-candidate-bundles/4f2bcfed8f0dd54bb3c4fcfdb4715402d67ca6c169e97a72b9a8b0779feeba5a.json)。
- `memory-v5-qu02-worst-case`：[冻结包](evidence/notes-memory-v5-candidate-bundles/3f450b88094ed16ecb9f4e649bdc9ffe4b54c42c2c69b999c091cdff2555fdae.json)。
- `memory-v5-qu02-fixed-sum`：[冻结包](evidence/notes-memory-v5-candidate-bundles/d1d95deaa37501156ea6cbc63f7c96f83422a47b51e19ccd85e24e4fbc73e578.json)。
- `memory-v5-qu02-similar-scaling`：[冻结包](evidence/notes-memory-v5-candidate-bundles/fdb0cf497c8680a8679e9f31dae35484a07ac7e0a52cceee089762b105cfe8a8.json)。
- `memory-v5-qu02-divisibility`：[冻结包](evidence/notes-memory-v5-candidate-bundles/c729fc51e32fe69e531a9e840d9c900a2fb7f402fedb526ae529a059219edadb.json)。
- `memory-v5-qu02-sequence-observe`：[冻结包](evidence/notes-memory-v5-candidate-bundles/0e6216b9df28fddfc213e4d0c9279084b79e482c1d2f44f0641cc00a4ed3711d.json)。
- `memory-v5-qu02-multiple-sequence`：[冻结包](evidence/notes-memory-v5-candidate-bundles/ede681ed285f10f773b43d42dfa327f937773d527db7733c046e4fe01c590235.json)。
- `memory-v5-qu02-boat-speeds`：[冻结包](evidence/notes-memory-v5-candidate-bundles/36706177b4b0e49b46fe6b56c744ef956e1f3da54412b17982df87869ce3b8ab.json)。
- `memory-v5-qu02-escalator`：[冻结包](evidence/notes-memory-v5-candidate-bundles/dc9c48969b12d55ab9e3a8de6bacb5bba03c6302e5ff5c3145f852e177f44c2e.json)。

用户此前测试反馈不自动覆盖本批或其他未收到反馈的版本。原2内容目标hold及1归并记录保持；来源级hold不变成空题凑数量。未操作真实用户存储。下一批：ME-LO-01；如果剩余工作都需要独立内容裁定或图像复核，再明确停在对应门，不自动正式启用。
