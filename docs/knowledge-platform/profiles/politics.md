# 模块能力配置：政治理论

> 状态：R5 OUT-J1–J5均为`UX-passed`，R6已完成；`rolloutStage=candidate`、37篇`review`、`release=0`，S6未恢复
>
> 本文件只描述政治如何使用通用能力，不定义平台规则

> 恢复说明：四类目标名称和默认策展是**确定性建议起点**，不是“最适合用户”的个性化判断。快速了解v1真实验证失败，v2于2026-09-08通过；J3主链路及J4/J5于2026-10-03获用户真机验收，四目标进度分别保存。数据不足时仍按`profile ∩ data ∩ target`诚实降级；用户体验通过不改变内容覆盖或发布资格。

## 当前事实基线

- 来源：政治理论 PDF，72页。
- 正式目录结构：42个导航节点。
- 结构化知识单元：37篇。
- 首批可解释关系：39条。
- 稳定正文块：643个，全部具备显式块ID和旧ID迁移记录。
- 显式知识原子：313个；37篇均具备大卡投影和精确RecallProjection。
- 关系块锚点：39/39；正式易混对照：5组ContrastPair。
- 当前内容状态：全部 `review`，可发布数量为0。
- 内容风险页：11页，已完成本轮 PDF 页图专项校对；内容终审结论限定当前两篇源料，不改变发布状态。

## 当前内容覆盖缺口与后续补充

> 覆盖状态：`partial / scope-unverified`。“37篇全部完成卡片化”只说明当前源料的结构化完整度，不说明它已覆盖完整考公政治或完整政治理论课程。

| 缺口 ID | 当前可证明的范围 | 不完整性/待审计项 | 状态 |
|---|---|---|---|
| POL-COVERAGE-001 | 当前包只有《习近平新时代中国特色社会主义思想》和《马克思主义基本原理》两篇 | 未建立与当前权威考试大纲的全量映射；时政、党史及其他考公政治范围不得被默认为已覆盖 | Deferred / audit required |
| POL-COVERAGE-002 | 马原概述提到哲学、政治经济学和科学社会主义三个组成部分 | 当前无独立的科学社会主义详细KnowledgeUnit，只能表达“概述中出现” | Deferred / content required |
| POL-COVERAGE-003 | 政治经济学当前详细展开商品二因素、劳动二重性、价值量、货币和剩余价值五个单元；新时代思想主线有19个当前源单元 | 两个分支都未独立完成“与目标大纲对齐后是否完整”的主题级审计 | Deferred / audit required |
| POL-COVERAGE-004 | 37篇当前源料内容终审与11个风险页专项校对已完成，隔离review包可构建和展现 | 37篇仍为`review/pending_final`，`release=0`；生命周期晋级及发布审批待用户下一步指令 | Current-scope content complete / release-gated |
| POL-COVERAGE-005 | 当前静态内容可以按包版本构建 | 未有时政的来源时效、版本、过期与更新机制；profile中时间/人物/文件镜头仍延期 | Deferred / separate capability |

[2026-10-03两篇源料覆盖与37篇终审基线](../implementations/politics-p3-v2-content-review-baseline-20261003.md)已逐篇列出源页、风险页和终审条件；24篇中的81处结构修复、2条官方表述校正及3篇学习投影修订均不改变内容审核状态。 [2026-10-04终审记录](../implementations/politics-p3-v2-content-final-review-20261004.md)已将当前37篇标记为“现阶段内容完成”，并记录逐篇OCR/正文证据、风险页和关系修订。

上述缺口**不阻塞**J2 v2以“当前两篇review内容”为明确边界的candidate实现，但**阻塞**宣称“完整考公政治/完整政治理论”，也不允许恢复S6或将内容晋级为release。用户可见边界必须明说：“本版只覆盖当前两篇审核中内容；马原详细内容尚未独立展开科学社会主义，也不代表时政或全部考试范围。”

后续任务`POL-CONTENT-COVERAGE-FOLLOWUP`保持`Deferred / required before full-scope claim or release`，固定顺序为：权威大纲覆盖审计 → 正式来源获取与缺口映射 → 正式Markdown/卡片化加工 → 风险与终审 → 重建并复核QuickPrimer/关系/回忆 → 独立发布审批。补充内容不得直接写入profile、QuickPrimer桥接文案或UI。

## 导航节点类型

```text
部分 → 篇 → 章 → 节/知识点
```

其中节和知识点均可能对应完整阅读焦点；导航层级与知识单元粒度不能混同。

## 能力建议

| 能力 | 建议 | 依据 |
|---|---|---|
| 体系 | 必须 | PDF 有正式目录层级 |
| 关系 | 必须 | 已有前置、易混、相关和反向关系 |
| 完整阅读 | 必须 | 理论条件和边界不能由摘要替代 |
| 主动回忆 | 必须 | 已有速记卡，适合理论表述与辨析 |
| 快速了解 | 启用 / v2 UX-passed | 六锚点目录导览是v1失败历史；当前v2按连续导读规格与内容脚本运行 |
| 系统学习 | 启用 | 默认按正式目录和前置关系推荐连续知识周期；范围调整为次级 |
| 易混突破 | 启用 | 默认按已确认ContrastPair策展顺序推荐一组；换组/限定区域为次级 |
| 考前速记 | 启用 | 优先恢复有效卡组，否则按显式默认范围生成冻结卡组 |
| 时间镜头 | 延期 | 当前显式时间实体数据不足 |
| 人物/文件镜头 | 延期 | 需要显式实体标注和来源校对 |
| 地图消隐 | 可用 | 已有目录结构和 Demo 基线 |

## 目标默认策展

当不存在有效RouteSession、当前焦点或最近兼容范围时，政治使用以下稳定默认；页面只能消费这些ID，不得自行选择数组第一项：

其中`routeDefaults.quick`及其六个Node ID只记录J2 v1机器配置和历史运行事实，用于兼容、回归与证据复现，不再构成J2 v2产品定义。J2 v2消费构建产物中的`QuickPrimerDefinition`与`ContentCoverageStatement`，来源和约束只见[快速导读规格](../implementations/politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)与[首版完整内容脚本](../implementations/politics-p3-v2-s5-5-r5-j2-v2-content-script.md)；逐段脚本文案未复制进profile。

```text
routeDefaults.quick
  scopeId: politics-toc-v2-n001
  anchorNodeIds:
    - politics-toc-v2-n006
    - politics-toc-v2-n007
    - politics-toc-v2-n025
    - politics-toc-v2-n029
    - politics-toc-v2-n032
    - politics-toc-v2-n038
  reason: 按正式两篇主分支和六个策展锚点建立整体认识；锚点只引用现有知识，不改变正式目录

routeDefaults.systematic
  scopeId: politics-toc-v2-n003
  allowedScopeTypes: [article, chapter, section]
  reason: 从边界明确的第一章总论开始，按正式顺序和前置约束连续学习

routeDefaults.confusion
  priorityRelationIds:
    - relation:politics-toc-v2-u025:contrast:politics-toc-v2-u024
    - relation:politics-toc-v2-u026:contrast:politics-toc-v2-u024
    - relation:politics-toc-v2-u026:contrast:politics-toc-v2-u025
    - relation:politics-toc-v2-u030:contrast:politics-toc-v2-u022
    - relation:politics-toc-v2-u034:contrast:politics-toc-v2-u033
  reason: 按已确认ContrastPair策展顺序推荐，不预测用户弱点

routeDefaults.exam
  scopeId: politics-toc-v2-n003
  order: navigation
  reason: 使用同一边界明确的正式范围生成冻结卡组；随机仅由用户显式开启
```

系统学习与速记默认不取整库37篇；用户可在已存在推荐的前提下调整为其他正式article/chapter/section范围。快速了解v1仍按整体、两篇主分支、六个profile策展锚点和收束投影运行；锚点标题与摘要仍从对应KnowledgeUnit读取，不在profile复制内容事实。该段只描述旧运行事实，不授权v2继续采用目录四站或六锚点产品形态；v2的取材、审核和失效规则由上述两份专门文档持有。

## 政治专属风险

- 固定政治表述不能由 UI 摘要擅自改写。
- 关系理由需要最终内容审核。
- 易混关系必须说明判断对象和适用边界。
- 待校对内容只能进入隔离 P3 试验入口。
- 用户可感知的状态不能暗示内容已经正式发布。

## 通用规格验证重点

1. L0 两篇区域到 L3 知识焦点的语义缩放。
2. 正式目录与39条语义关系的空间分工。
3. 完整知识卡中的关系入口是否有帮助而不过载，且不阻塞正文。
4. 长理论正文的语义块和完整证据。
5. 易混对照和地图消隐式回忆。

## 03/04 契约映射

| 通用契约 | 政治验证数据 | 决策后实施要求 |
|---|---|---|
| 每模块独立焦点状态 | `moduleId=politics`、37个稳定知识 ID | 与常识、笔记分桶保存，不复用全局第一条知识 |
| 建立焦点后的完整知识卡 | 39条已加工关系、39/39双端块锚点 | 一次点击直达完整正文；只有当前知识存在有效关系时显示按需入口，否则只显示目录位置 |
| 正式导航与关系分离 | 42个目录节点、37个知识单元 | 目录来自 PDF 第二轮目录审计，关系不得改写父子结构 |
| SemanticBlock | 37篇完整 Markdown、643个稳定块、313个显式atom | 标题、段落、列表和语义callout保持同一正式正文事实母体 |
| review/release 隔离 | 37篇均为 `review`，11个风险页 | 可生成隔离 review 包；最终校对前 release 数量保持0 |
| 来源与纠错 | PDF 页、source unit、hash、风险标记 | 纠错引用知识、版本、块和 PDF 定位，不能由页面改状态 |

政治是03与04的首个真实实现样本，但其“篇章”“PDF 页码”和固定表述风险仍只属于本 profile。

## 05/06 决策验证

| 场景 | 政治映射 | 重点判断 |
|---|---|---|
| L0 | 两篇理论区域 | 是否一眼建立全局体系，而非两张普通入口卡 |
| L1/L2 | 正式篇章与37个知识单元 | 42个目录节点能否稳定进入且不平铺过载 |
| L3 | 当前知识 + 最多6个关系邻居 | 39条关系能否受控显示且完整列表可达 |
| 卡内关系上下文 | 每类型最多1条、总计最多3条 | 是否帮助理解方向而不阻碍进入正文 |
| 完整阅读 | 37篇 Markdown 的同一语义内容流 | 条件、边界、表格和固定表述是否完整保留 |
| 双向定位 | 关系/回忆 → blockId → 原文 | 返回时能否恢复原关系或回忆状态 |

MAP、WORK、LEARN、VIS与SHIP的历史接受状态只证明规则和工程基线曾被接入；当前产品状态由S5.5总任务单持有。内容卡片化CB0至CB5的事实能力仍有效：summary与Recall均37/37精确锚定，关系39/39双端锚定，5组正式contrast已形成ContrastPair；这些能力不自动证明J1至J5成立，也不改变内容发布资格。

## 07/08 决策验证

| 场景 | 政治映射 | 重点判断 |
|---|---|---|
| 快速了解 | J2 v2 primer与连续页面已实现；2026-09-08用户反馈测试通过，OUT-J2 UX-passed | 是否以同源内容形成初步理解，而非再次完成目录导览；具体定义只见v2专门文档 |
| 系统学习 | 目录顺序 + prerequisite约束 | 范围外前置是否透明且不静默扩张 |
| 易混突破 | 5组正式ContrastPair、双方块引用、维度与边界 | 是否由系统推荐并完整展示边界、原文和辨析依据 |
| 考前速记 | 37个精确RecallProjection及显式默认范围 | 是否系统推荐/恢复冻结顺序、可恢复且不显示虚假掌握度 |
| 搜索/问题 | 标题、路径、语义块、关系理由 | 是否只呈现来源支持内容，不拼接新政治表述 |
| 空间 UI | 现有主题 token + 固定认知色 | 是否增强连续性而不写政治专用通用组件 |

政治仍是 review隔离样本；路线和视觉完成不能改变发布资格。

## 不得写入通用层的政治特性

- “篇、章、节”的固定名称。
- 政治专用固定表述风险。
- PDF 页码展示方式。
- “考前速记”作为所有模块强制文案。
- 政治关系类型的具体内容。
