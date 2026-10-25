# ME-QU-01：数量关系首批公式与方法卡

2026-10-23，worktree `/Users/jmac/.codex/worktrees/notes-learning-exploration/miniprogram-1`，分支 `codex/notes-learning-exploration`，HEAD `e42af05dfd7a9d52279c7c2dc5403061abfff709`。本批开发候选已接入，原文和公式渲染节点不改；未提交、合并、推送、上传或发布。

## 本批11卡

| 板块 | 提示 | 原文范围 |
|---|---|---|
| 基础快记 | 一盈一亏时，分配对象数怎么算？ | `surplus-deficit`块0,1,2 |
| 基础快记 | 排列数与组合数的公式是什么？ | `permutation-combination`块0,1,2,3 |
| 基础快记 | 平方差与完全平方的公式是什么？ | `number-formulas`块0,1 |
| 基础快记 | 利润和利润率怎么算？ | `profit-core`块0,1 |
| 基础快记 | 消耗速度大于生长速度时，牛吃草的天数怎么算？ | `cow-eating-grass`块0,1 |
| 基础快记 | 两集合与三集合的容斥公式是什么？ | `inclusion-exclusion`块0,2,3 |
| 方法判断 | 给完工时间或效率比时，工程问题怎样赋值？ | `work-efficiency`块3,4,5 |
| 方法判断 | 什么情况下适合用代入排除法？ | `substitution-method`块0,1 |
| 方法判断 | 相遇与追及怎样选择速度和、速度差？ | `travel-core`块0,1,2,6 |
| 方法判断 | 要求若干元素相邻时，怎样用捆绑法？ | `adjacent-bundle`块0 |
| 方法判断 | 要求元素互不相邻时，怎样用插空法？ | `non-adjacent-insertion`块0 |

基础卡只帮助回忆公式，不要求代入数字解题。方法卡围绕赋值、选项代入、相对速度、相邻限制的具体识别；揭晓完整方法，提示不用答案清单或不明名词。工程基础样板与工程赋值新卡各有目标；组合对称原样板与排列组合主公式卡也保持不同目标，不因公式中出现对称关系就重复新增对称性质卡。相遇追及只创建一张方法卡，不再按同目标重复制一张基础公式卡。

## 原内容完整性及排除范围

- 盈亏保留基本含义、一盈一亏公式及两盈两亏方向对照；适用于相同物资与相同对象的两种分配。
- 排列组合保留不同元素、有序／无序定义和全部script、frac、numNodes、denNodes，m为不超过n的非负整数、普通不放回选取；未带入不完整隔板条件或把“至少”当必选反面法。
- 平方公式避开含糊的完全立方压缩式及截位口诀；利润只保留成本口径主公式，未带入折扣率与降价率混用。
- 牛吃草保留固定新增、存量概念及公式；提示明示消耗速度大于生长速度，默认每天消耗固定；不以昵称辨认代替模型。
- 两／三集合完整保留并集、交集与三重交集加回；未混入没有随附定义的S1/S2/S3。
- 工程赋值保留口径与两类完整规则；代入排除保留整数、范围、最值约束；相遇追及保留相向接近／同向快追慢的比较与式子，按匀速同时运动；多次往返的缺条件通式仍未引用。
- 捆绑保留内部排序条件；插空保留元素身份、空位是否含两端及先排后插规则。两者分别引用完整单来源，不引入跨来源接口。

全部使用原完整块，没有新增图片或切片渲染能力；不修改原50JSON、公共UI、导航、训练／存储／判分或准入引擎。

## 44来源的去向

[来源盘点](../content/notes/memory-v5-qu01-triage.json)保留44个来源的源身份、原摘要、原观察、目标、原样板去向与恢复条件。11来源局部出卡（含工程原基础样板同源），另2来源复用组合对称及平均速度原样板；余31来源为21条既有源观察待核、10个尚未编写来源。这个盘点复用原审计，不冒称本批重新专家审核了全部44来源。局部健康片段出卡不等于源中其他段已经通过。

原2内容目标hold与1归并目标记录保持；资料2来源hold仍未解除。天平最小选项捷径、时针追分针方向、方阵层数单双边界、漂流速度冲突、几何图未复核等原观察继续隔离，没有按来源数凑占位卡。

## 当前数量及试用入口

| 范围 | 基础快记 | 方法判断 | 合计 |
|---|---:|---:|---:|
| 全科、全部专题 | 22 | 26 | 48 |
| 数量关系、全部专题 | 8 | 6 | 14 |
| 资料分析、全部专题 | 14 | 17 | 31 |

在当前微信开发者工具笔记worktree，进入基础快记／方法判断→数量关系→全部专题→全部卡片，可逐张打开新卡。旧未完成轮次保持原成员，不会因扩题自动增加；本轮总数与全部卡片目录数量可能不同。原完整题应用12道保持，其中数量3道。本批没有扩真实题或改变应用判分。

作者累计43个设计目标：40活动候选、2内容hold、1归并记录，加8原样板为48开发卡。正式卡0、正式审阅与启用账本空。此前用户反馈仅绑定原明确版本，继续QU01不代表DA05新2卡已验收。

## 冻结审阅材料

- `memory-v5-qu01-surplus-deficit`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/f9d4ebf122f729dd04e50315bb89df559a05b69772cc2e4b1218718eacd80fa2.json)。
- `memory-v5-qu01-arrangement-combination`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/2f81b2ef3d9db320de5a025795de58df42470967de14c3e450c956060a7df8b2.json)。
- `memory-v5-qu01-square-identities`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/42c587ca5c078bebcabf672509ac780727a7145541299aa9484ac4d248292492.json)。
- `memory-v5-qu01-profit-rate`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/34c89292fb487ff237e6fbfaefa7d55aa5c30ebca3d75ff8cfe7d374b534bd49.json)。
- `memory-v5-qu01-cow-grass-time`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/5e3617b9ac584d427446f1c313420e8a4f715b18573b4d306734eda53e29c472.json)。
- `memory-v5-qu01-two-three-sets`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/c1bb3565596c1989f1ed4e2820e96b5fa7120bb3fa81a068dc57c1f692d07970.json)。
- `memory-v5-qu01-work-assignment`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/5e5ff5dcf2cf7e58d9aeddf0469b1d9003ce909d02f58a38943eaf1994e0dc78.json)。
- `memory-v5-qu01-substitution`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/1ebc8e9e560a9ee259e15d50eca56dd0c2666ad1c28464ce51d6dfb711d9e3d7.json)。
- `memory-v5-qu01-meeting-chasing`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/0e1f7af421adeeadf78fd92b04c0c769450d54b33b47ff889e4c268bed71a978.json)。
- `memory-v5-qu01-adjacent-bundle`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/9fddd227b9fcff92f8d2e5740d7b4f353351d7e89e10d2e012e5407e3324c0c9.json)。
- `memory-v5-qu01-non-adjacent-insertion`：[冻结对照](evidence/notes-memory-v5-candidate-bundles/0cf0b9cd3726654e936a351f29c7bb75b9c3cc049ee9999fc4cd1d973c677d96.json)。

## 验证和待验项

[本批工程证据](evidence/ME-QU-01-preview.json)绑定当前43目标、注册／冻结材料、生成包、50份原JSON和页面代码。23项当前定向检查逐一打开48个实际ID、揭晓、回源和返回，核数量8／6与全科22／26；验证全部11新卡未揭晓不能自评、模糊记录进入数量考前速记；旧37卡轮次和原错误10%记录不被覆盖或迁移。独立构造验证排列组合m!关系、平方展开、盈亏对象数、成本利润率、牛吃草动态守恒与256组合的两／三集合容斥恒等式；这属于作者侧数学检查，不是独立专家签收。

历史样板基线在自有临时副本回归60项；页面20项、设计16项、原应用契约20项、内容5项、12模板样式离线检查，以及当前生成包／冻结对照一致性通过。32条原搜索元数据warning仍在。计划投影修正为将QU来源归到ME-QU，DA05保留历史工程证据，未把数量目标记到资料模块。

新11卡仍待用户试用、独立内容审阅与正式准入。未产生本代理的微信实屏、真机、窄屏大字、全包构建／体积或发布证据；未操作真实用户存储。所有旧证据、冻结包、样板和既有37卡定义保持不变。

## 下一批

ME-QU-02继续剩余数量公式与方法的局部恢复：先核条件与主目标、检查已有覆盖，再决定0至多张完整卡；有错误的原源先保留待核，不通过剥离补充提醒冒充完整方法。任何共享UI或协议变化仍先单独说明，不借扩题改接口。
