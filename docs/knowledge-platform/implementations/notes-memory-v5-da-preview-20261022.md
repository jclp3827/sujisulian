# ME-DA-PREVIEW：资料首批开发待审接入

本批将6张无hold原引用候选接入开发版，保留旧8张样板，共14张。仅属于ME-DA-01部分开发接入；不等于独立内容接受、全资料模块完成、正式启用或发布。工作树`/Users/jmac/.codex/worktrees/notes-learning-exploration/miniprogram-1`，分支`codex/notes-learning-exploration`，HEAD仍`e42af05dfd7a9d52279c7c2dc5403061abfff709`，本批未提交。

## 当前数量

| 主模块 | 基础快记 | 方法判断 | 开发卡合计 | 原开发应用 |
|---|---:|---:|---:|---:|
| 资料分析 | 5 | 3 | 8 | 3 |
| 数量关系 | 2 | 1 | 3 | 3 |
| 判断推理 | 0 | 1 | 1 | 2 |
| 言语理解 | 0 | 1 | 1 | 4 |
| 图形推理 | 0 | 1 | 1 | 0 |
| 合计 | 7 | 7 | 14 | 12 |

原卡8张与新待审6张分别统计；考前速记是这14张卡的弱项路线，没有独立新增卡。正式记忆卡、独立回执、正式启用均0。开发路径严格为`develop`；`trial`和`release`均不展示这些未批准卡。

## 本批6张与冻结材料

| 卡片 | 板块 | 稳定ID | revision | 独立审阅输入 |
|---|---|---|---:|---|
| 间隔增长：反解单期增长率 | 基础快记 | `memory-v5-da01-interval-growth-reverse` | 1 | [原文／投影／目标冻结对照](evidence/notes-memory-v5-candidate-bundles/a205cccd66ee8cd28bde532eed60122f6b02aff63fc7ebc809699bd8d1e31020.json) |
| 现期比重：部分与整体 | 基础快记 | `memory-v5-da01-current-ratio` | 1 | [原文／投影／目标冻结对照](evidence/notes-memory-v5-candidate-bundles/d7eb3fa9aceedbf3e4bf778fa78e757c06d06d37be1d5481e58d7f4ed60165c6.json) |
| 隔级比重：相邻层级相乘 | 基础快记 | `memory-v5-da01-hierarchical-ratio` | 1 | [原文／投影／目标冻结对照](evidence/notes-memory-v5-candidate-bundles/52cd14687c80b5b43b83f2cb7830954fc059535cc5658f7eb990a3a400a49722.json) |
| 比重升降：比较分子与分母增速 | 方法判断 | `memory-v5-da01-ratio-change` | 1 | [原文／投影／目标冻结对照](evidence/notes-memory-v5-candidate-bundles/8005b6af260a78f28267763928cec8d629ef0fe2c017a5b6554c1fde8f1a968a.json) |
| 倍数表达：是几倍与增长几倍 | 方法判断 | `memory-v5-da01-multiple-growth` | 1 | [原文／投影／目标冻结对照](evidence/notes-memory-v5-candidate-bundles/fbe68c19a165f4d30853bdd1bb62e75eb524fd3cbd1980eeeb547e751a701f91.json) |
| 拉动增长与贡献率：识别分母 | 方法判断 | `memory-v5-da01-pulling-contribution` | 1 | [原文／投影／目标冻结对照](evidence/notes-memory-v5-candidate-bundles/a560f5d3143f35fea3202f1d30a8968f643437188aa0038129862bc6ddc19072.json) |

[候选对照索引](evidence/notes-memory-v5-candidate-review.json)绑定目标、作者任务、卡片版本、来源快照、学习语义、规则及不可变对照包。候选源保留draft/not-enrolled作者态；显式注册账才是开发预览入口，不将作者字段改成批准。现有3基础／3方法目标沿原提示及引用组合接入，没有新编选择题或重写公式。

## 如何审核与复现

1. 在该worktree开发版打开笔记，进入基础快记或方法判断，再点“全部卡片”。本批资料候选分别3张，科目选资料分析也可找到；专题与逐ID路径可在下方机器证据中核对。
2. 每张先回忆，再揭晓原知识组合，用记住了／有点模糊／没想起／跳过反馈；“查看原文”进入原知识页签，通过顶部原生返回恢复同卡、揭晓和滚动位置。
3. 考前速记仅进入有效版本的没想起和有点模糊，未自评新卡不会自动加入。旧轮次冻结，旧4张轮次恢复时仍4张，但全部卡片目录对应板块为7张；通过目录直达新卡，或完成／重新开始新轮次。浏览与跳过不覆盖弱项，保存失败不跳卡。

当前模板仍沿用开发样板的既有提示文案，未为6张候选擅改公共UI；运行卡保留sampleOnly=false，不能据显示文案推断正式批准。统一UI时一并处理该展示文案，既有页面显示验收不外推给新增内容。

## hold与后续门

- `memory-v5-da01-average-denominator`：revision2，平均类提示闭环及原源语义继续待核，未注册。
- `memory-v5-da01-period-terms`：revision1，基期表述范围继续待核，未注册。
- 两项hold沿[原目标台账](../content/notes/memory-v5-da01-targets-v2.json)保留具体理由与恢复条件，负例验证不能被注册或卡片深链绕过。旧22待审版本及原应用3hold也未放行。
- 下一阶段为精确版本独立REVIEW，逐卡核记忆目标、必要条件、边界／对照、原公式与上下文、补充提示、重复关系。不得以本批作者侧自动验证自签内容接受；revise升版本重新绑定，不继承旧回执。独立accept后仍需单独正式启用授权，当前不写接受或启用记录。
- 资料共33来源，ME-DA-01仅8来源设计处置；本次6张不代表其余25来源完成，也不以来源数当卡片配额。全模块、后续模块、原应用素材扩充各自沿原计划推进。

## 验证及边界

[本批机器证据](evidence/ME-DA-preview.json)逐卡绑定注册、生成包、来源、冻结对照、实现摘要及实际检查输出：当前14卡实际页面代码／公式组件专项13项、页面入口与应用历史20项、V2来源计划16项；另以明确隔离的空注册／8样板基线运行历史60项，保留G0原证据不改。草稿、当前两包、原应用内容／契约检查和12模板／样式离线编译通过，负例模板被拒。源码结构检查有32条既有搜索元数据warning，未将其称为全部内容无问题。

已验证当前每张卡的目录→ID→原页签、筛选计数、旧身份／未完成轮次、弱项冻结、读取与保存失败、原公式component输入与结构化分式；测试使用隔离存储，不写真实用户记录。原50JSON、原公式组件、既有页面／共享UI／导航／训练／应用协议及G0实现与原证据逐字节保持。此次新增仅注册／冻结材料／开发生成包，以及模块专属计划投影和验证工具。

当前没有微信开发者工具MCP；没有模拟器实屏、窄屏／大字、真机、全包真实压缩体积或上传发布证据。离线模板编译和组件输入检查不能替代这些观察。不为取证调用带上传行为的preview动作。

当前回归入口为`node scripts/validate-notes-memory-preview.js`（真实14张开发包）和`node scripts/validate-notes-memory-baseline.js`（隔离8样板／空注册基线）。后者在自己的临时副本内清除当前注册及其冻结文件再运行旧有限样板用例，不清除实际worktree或用户存储；历史脚本中的8张断言不直接作为当前14张包的检查入口。
