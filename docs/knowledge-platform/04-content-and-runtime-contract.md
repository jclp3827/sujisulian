# 内容与运行时契约

> 状态：Ready — DATA-001 至 DATA-012 已于 2026-08-28 全部接受
>
> 上游：[00 V2 总纲](./00-presentation-v2-master.md)、[02 产品模型与信息架构](./02-product-model-and-information-architecture.md)
>
> 下游：05 地形、06 工作台、07 路线、模块构建器与通用展现组件

## 1. 本文要解决什么

本文冻结“不同模块的正式内容怎样变成同一种可验证运行包，以及通用 UI 可以相信哪些字段”。它负责：

- 正式源内容、模块适配器和小程序运行包的边界。
- 通用对象、稳定 ID、来源、版本和发布状态。
- 完整正文怎样变为不丢信息的结构块和语义块。
- 目录、关系、回忆、搜索、地形怎样引用同一事实母体。
- 未迁移模块、未知块和缺失能力怎样安全降级。

本文不规定页面排版，也不要求常识和笔记立即改成政治 Markdown。通用 UI 只消费运行时契约；各模块可以分步迁移自己的正式来源。

## 2. 单向构建架构

推荐固定为：

```text
模块正式源内容
├─ 政治：正式 Markdown + 目录/关系审核数据
├─ 常识：当前正式模型或逐步迁移的 Markdown/JSON
├─ 笔记：当前正式模型或逐步迁移的 Markdown/JSON
└─ 新模块：其已声明的正式来源
        ↓ 只读
模块适配器 SourceAdapter
        ↓
通用 KnowledgePackage 草稿
        ↓
schema / 来源 / 引用 / 能力 / 发布门禁
        ↓
按目标隔离的运行包
├─ preview/review：明确标记，仅试验入口可加载
└─ release：只含允许发布的知识
        ↓
小程序通用展现层
```

不可逆边界：

1. 页面、运行包和 Obsidian 视图都不能反向改写正式内容。
2. `dist` 只可由构建器生成，不得手改修 UI。
3. Obsidian、社区插件、`.base`、`.canvas` 和主题 CSS 不参与构建正确性。
4. 模块适配器只能解释正式源，不能在构建时补写未经审核的事实、关系或答案。
5. review 内容可以继续加工和展示，但不能因为 UI 可运行而自动变成 release 内容。

## 3. 源契约与运行时契约分离

### 3.1 为什么不强制所有模块立即统一源格式

政治已经验证 Markdown 单向构建；常识和笔记已有规模较大的既有模型与页面行为。若先强制重写全部来源，会把产品展现改造与内容迁移绑成一次高风险重构。

因此采用两层契约：

- **源契约**：每个模块声明它的正式来源、字段和审核流程。
- **运行时契约**：所有模块输出相同 `KnowledgePackage`，供通用组件消费。

这不是永久允许任意格式。每个适配器都必须有负责人、版本、样本、验证和退役条件；模块成熟后可以把正式来源逐步统一到可审阅文本，但不阻塞通用平台先落地。

### 3.2 SourceAdapter 最小责任

```text
SourceAdapter
├─ adapterId
├─ adapterVersion
├─ moduleId
├─ sourceSchemaVersion
├─ readSources()
├─ mapNavigation()
├─ mapKnowledgeUnits()
├─ mapRelations()
├─ mapRecallItems()
├─ collectSourceReferences()
└─ reportDiagnostics()
```

适配器必须确定性输出，不读取页面状态，不依赖 Obsidian 运行环境，也不能吞掉未知或无效字段。无法转换的内容必须报错或显式降级，不能静默消失。

## 4. KnowledgePackage 顶层契约

```text
KnowledgePackage
├─ schemaVersion
├─ packageVersion
├─ moduleProfile
├─ navigationNodes[]
├─ knowledgeUnits[]
├─ relations[]
├─ recallItems[]
├─ sourceReferences[]
├─ learningRoutes[]
├─ indexes
├─ idMigrations[]
└─ buildTarget: review | release
```

| 字段 | 必须性 | 规则 |
|---|---|---|
| `schemaVersion` | 必须 | 运行时结构版本；遵循兼容规则 |
| `packageVersion` | 必须 | 由规范化有效内容计算的稳定哈希或等价版本 |
| `moduleProfile` | 必须 | 模块名称、导航类型、能力和降级规则 |
| `navigationNodes` | 必须 | 可为空模块根之外的正式导航树，不能由关系推断代替 |
| `knowledgeUnits` | 必须 | 当前构建目标允许进入的完整知识单元 |
| `relations` | 可为空 | 只含已达到该构建目标门禁的正式关系 |
| `recallItems` | 可为空 | 只含可追溯、审核状态合格的回忆项 |
| `sourceReferences` | 必须 | 所有事实、关系和回忆的来源引用表 |
| `learningRoutes` | 可为空 | 只存路线定义与范围引用，不复制内容；详细契约由07冻结 |
| `indexes` | 派生 | 搜索、路径和反向关系等可重建索引 |
| `idMigrations` | 可为空 | 内容拆分、合并或 ID 迁移的显式映射 |
| `buildTarget` | 必须 | review 与 release 必须物理或入口隔离 |

`packageVersion` 的计算不包含构建时间、绝对文件路径和机器信息。相同有效输入与构建器版本必须产生相同数据和版本；时间、耗时等只进入独立构建报告。

## 5. ModuleProfile 契约

```text
ModuleProfile
├─ id
├─ title
├─ description
├─ profileVersion
├─ navigation
│  ├─ rootLabel
│  ├─ nodeTypes[]
│  └─ defaultProjection
├─ capabilities
│  ├─ activities[]
│  ├─ goals[]
│  ├─ lenses[]
│  ├─ semanticKinds[]
│  ├─ recallKinds[]
│  └─ relationTypes[]
├─ labels
├─ fallbacks
├─ sourcePolicy
└─ publicationPolicy
```

### 5.1 能力不是愿望清单

能力必须同时满足：

```text
模块配置声明
∩ 当前运行包有有效数据
∩ 当前构建目标允许展示
= UI 可用能力
```

例如 profile 声明支持 `relations`，但 release 包没有任何合格关系时，UI 不得显示空关系入口。构建报告必须指出“声明但无数据”；是否报错或警告由该能力在模块中是 `required` 还是 `optional` 决定。

### 5.2 推荐能力声明形态

```text
capability
├─ id
├─ requirement: required | optional | disabled
├─ minItems
├─ fallback
└─ dataStatus: derived by builder
```

`dataStatus` 只能由构建器根据有效对象计算，不能在源配置中手填。

## 6. 通用对象字段

### 6.1 NavigationNode

```text
NavigationNode
├─ id
├─ moduleId
├─ type
├─ title
├─ parentId
├─ order
├─ pathIds[]
├─ pathTitles[]
├─ childIds[]
├─ pointId?
├─ pointCount
├─ summary?
└─ status
```

约束：

- `type` 必须来自模块 profile，不写死篇、章、节。
- 根以外节点必须有有效 `parentId`；整棵树无环且所有节点可达。
- `pathIds`、`pathTitles` 必须等长，并与父链一致。
- 一个节点可以只是导航容器，也可以绑定一个 `KnowledgeUnit`。
- `pointCount` 由构建器派生，用于 L0/L1 聚合，源内容不手填。
- 目录父子关系只回答“在哪里”，不能自动成为知识前置关系。

### 6.2 KnowledgeUnit

```text
KnowledgeUnit
├─ id
├─ moduleId
├─ title
├─ aliases[]
├─ navigationNodeId
├─ navigationPathIds[]
├─ order
├─ contentVersion
├─ status
├─ summary?
├─ summaryBlockId?
├─ blocks[]
├─ relationIds[]
├─ recallItemIds[]
├─ sourceRefIds[]
├─ riskFlags[]
└─ reviewState
```

约束：

- `id` 发布后稳定；改标题和文件名不改 ID。
- `blocks` 必须完整覆盖正式正文，不能只输出卡片摘要。
- `summary` 必须来自显式审核内容或有可追溯规则；没有可靠摘要时省略，不随机截断首段。
- 关系和回忆只存 ID 引用，事实对象只保留一份。
- `riskFlags` 和 `reviewState` 由内容流程决定，页面不能修改。

### 6.3 SemanticBlock：结构与语义两轴

为避免“每一种视觉组件变成一种数据类型”，内容块分成两个正交维度：

```text
SemanticBlock
├─ id
├─ unitId
├─ kind
│  └─ heading | paragraph | list | table | quote | callout | media
├─ semantic
│  └─ plain | definition | conclusion | hierarchy | sequence
│     | condition | exception | contrast | evidence | timeline | entity
├─ title?
├─ payload
├─ fallbackText
├─ sourceRefIds[]
├─ sourceLocator?
└─ reviewState
```

- `kind` 描述内容结构，决定最低可读渲染。
- `semantic` 描述认知含义，决定增强展示、镜头和回忆派生能力。
- 同一个表格可以是 `kind=table, semantic=contrast`；同一个列表可以是 `kind=list, semantic=hierarchy`。
- 未知 `semantic` 降为相同结构的 `plain`；未知 `kind` 使用 `fallbackText`。
- `fallbackText` 必须完整表达关键信息，增强组件失效时仍可阅读。
- 块 ID 在内容小修时尽量稳定；块拆分或合并时进入迁移记录。

第一轮通用渲染必须支持全部基础 `kind`，并优先增强：

- `definition`
- `conclusion`
- `hierarchy`
- `sequence`
- `condition`
- `exception`
- `contrast`
- `evidence`

`timeline` 和 `entity` 进入契约但默认按普通块降级，等真实数据和模块 profile 启用后再开发专用形态。

### 6.4 Relation

```text
Relation
├─ id
├─ moduleId
├─ sourcePointId
├─ targetPointId
├─ type
├─ direction
├─ reason
├─ sourceBlockIds[]
├─ targetBlockIds[]
├─ sourceRefIds[]
├─ inverseOf?
├─ reviewState
└─ contentVersion
```

规则：

- 第一轮通用类型为 `prerequisite`、`contrast`、`related`；模块可以在 profile 注册后续类型。
- 每条关系必须有“为什么有关”的 `reason`，不能只因共享标签进入正式包。
- 可定位时必须引用内容块；无法定位时至少引用两个知识单元和来源。
- 正向关系作为事实维护，反向入口由构建器依据类型规则派生。
- `prerequisite` 默认有方向；模块声明无环时构建器必须验证 DAG。
- `contrast` 是否对称由关系类型定义，不能由 UI 猜测。
- 自动候选未确认前只能进入审计报告，不进入正式 `relations`。

### 6.5 RecallItem

```text
RecallItem
├─ id
├─ moduleId
├─ pointId
├─ kind
├─ prompt
├─ answer
├─ pitfall?
├─ sourceBlockIds[]
├─ sourceRefIds[]
├─ reviewState
└─ contentVersion
```

规则：

- 第一轮必须支持 `qa`；其他题型由07按语义成熟度启用。
- `prompt` 只检查一个清晰目标，`answer` 不得省略决定正确性的条件。
- 每项必须引用原文块和来源；不能随机截断正文、随机挖空或只靠 UI 文案生成。
- 原文块变化后回忆项必须重新验证版本，不能继续展示旧答案。
- 回忆项是内容对象，不记录揭晓、正确或错误；用户会话状态属于03。

### 6.6 SourceReference

```text
SourceReference
├─ id
├─ moduleId
├─ sourceId
├─ sourceType
├─ locator
├─ sourceVersion
├─ sourceHash
├─ reviewedAt?
├─ reviewerState
└─ riskFlags[]
```

`locator` 可以表达 PDF 页、原始单元、法规版本、文件段落或其他模块正式定位。UI 不应理解模块专属定位格式，只通过统一来源展示接口请求可读说明。

### 6.7 LearningRoute 与索引

`LearningRoute` 在本包中只保留稳定 ID、目标类型、范围、步骤引用、顺序理由和完成条件；详细字段由07定义。路线不得复制正文或回忆答案。

搜索索引、反向关系、导航后代集合和地形聚合均为派生对象。删除后应可由核心对象重建，页面不得将索引当事实源。

## 7. Markdown 语义表达

### 7.1 保留可读的有限 Markdown

正式 Markdown 即使不在 Obsidian 中打开，也必须能被普通文本工具阅读和独立构建器解析。标题、段落、列表、表格、引用、图片和链接先转换为结构 `kind`，不会因为缺少增强语义而丢失。

### 7.2 显式语义块推荐语法

采用可退化为普通引用块的标记：

```markdown
> [!definition] 社会主要矛盾
> 人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾。

> [!condition] 判断边界
> 主要矛盾变化，不改变社会主义初级阶段的基本国情。

> [!contrast] 新时代判断与基本国情
> - 发生变化：社会主要矛盾。
> - 没有变化：基本国情和国际地位。
```

选择这一语法是因为：

- 在普通 Markdown 中仍是完整可读引用，不依赖插件。
- Obsidian 可以提供编辑预览，但不是运行前提。
- 独立构建器只需识别有限白名单。
- 标题和正文仍在同一个事实母体中，不需要维护 JSON 正文副本。

第一轮允许的显式标记：

```text
definition conclusion hierarchy sequence
condition exception contrast evidence
```

`timeline`、`entity` 先保留为兼容语义，不作为第一轮正式内容的强制加工任务。

### 7.3 可以自动识别什么

| Markdown 信号 | 可以自动识别 | 不可擅自推断 |
|---|---|---|
| 标题层级 | `heading`、层级路径 | 该标题是否“核心结论” |
| 普通段落 | `paragraph/plain` | 定义、因果、条件或重要程度 |
| 有序/无序列表 | `list/plain`、顺序和嵌套结构 | 是否为方法步骤或知识层级 |
| 表格 | `table/plain`、表头和单元格 | 是否为易混对照 |
| 引用块 | `quote/plain` | 是否为权威证据 |
| 显式 `[!type]` | 白名单对应语义 | 白名单外含义 |
| 既有“速记卡”协议 | 由模块适配器生成 `RecallItem` | 随机生成新卡片 |

结论、条件、例外、易混、证据和顺序意义必须显式标记或来自经过验证的既有结构；不能用关键词扫描自动升级为正式语义。

### 7.4 一句话理解与完整内容

`一句话理解` 是完整内容的显式导览块，不替代正文。它必须作为有来源的内容块或明确引用内容块；没有可靠的一句话理解时，UI 使用标题和路径，不从长正文随机截断。

完整内容必须保持原有标题、段落、列表、表格、强调、条件、例外和来源。增强渲染只改变表现，不得重排到改变含义，也不得隐藏无法识别的正文。

## 8. 发布、风险与构建目标

推荐通用内容状态：

```text
draft → review → approved → published
                    ↓
                  stale
```

三个字段不得混用：

| 字段 | 允许值 | 作用 |
|---|---|---|
| `status` | `draft/review/approved/published/stale` | 知识对象的发布生命周期 |
| `reviewState` | `pending/passed/rejected/stale` | 当前对象的内容审核结果；关系和回忆可独立于正文审核 |
| `riskFlags[]` | `{ code, sourceRefId?, blockingTargets[], state }` | 具体风险及它阻塞哪些构建目标；`state` 为 `open/resolved` |

适配器可以从既有扁平风险字段映射到该结构，但运行包不能只保留无法判断阻塞范围的字符串。`reviewState=passed` 不自动把 `status` 提升为 `approved`；状态晋级由正式内容流程执行。

### 8.1 review 与 release 隔离

| 构建目标 | 允许内容 | 用途 | 禁止行为 |
|---|---|---|---|
| `review` | `review`、`approved`、`published`，按模块配置 | 隔离 Demo、审阅和 UI 联调 | 伪装正式发布、写入 release 入口 |
| `release` | 默认 `approved`、`published` 且无阻塞风险 | 正式运行包 | 包含 pending/stale 或被 UI 解锁 |

风险页可以继续完成目录、正文块、关系和回忆加工；风险只按 `blockingTargets` 阻塞状态晋级或 release 构建，不阻塞形成可审阅对象。最终校对更新正式源、风险状态和版本后重新构建，不需要重新手做 UI 数据。

页面只读取 `status`、`reviewState`、`riskFlags` 和 `buildTarget`，不得修改它们。review 入口必须可感知标识内容状态，并与 release 文件或加载入口隔离。

## 9. Schema 演进与安全降级

### 9.1 三种版本

- `schemaVersion`：运行时对象结构版本。
- `packageVersion`：整个规范化内容包版本/哈希。
- `contentVersion`：单个知识、关系或回忆对象的内容版本。

### 9.2 兼容规则

采用语义化版本：

- 主版本不同：运行层拒绝加载，并进入模块安全不可用状态；不能勉强解释。
- 同主版本、次版本更高：忽略未知可选字段；未知块按降级规则显示。
- 补丁版本变化：不改变字段含义。
- 删除、改义或将可选改为必填必须升主版本。

### 9.3 未知对象降级

| 未知内容 | 处理 |
|---|---|
| 未知可选字段 | 忽略并保留诊断 |
| 未知 `semantic` | 按原 `kind` 以 `plain` 显示 |
| 未知 `kind` | 使用完整 `fallbackText`；缺失则构建失败 |
| 未知关系类型 | 不进入关系 UI，构建报告报错或隔离 |
| 未知回忆类型 | 不进入回忆路线；完整阅读仍可用 |
| 未知导航节点类型 | 若 profile 未声明则构建失败，防止目录静默错误 |

## 10. 构建验证与诊断

### 10.1 阻塞错误

- 模块、导航、知识、块、关系、回忆或来源 ID 重复。
- 导航树有环、孤儿、路径不一致或知识无有效位置。
- 关系端点不存在、理由为空、类型未声明或前置 DAG 违反模块约束。
- 回忆缺少提示、答案、知识引用、内容锚点或来源。
- 完整正文解析后出现内容丢失或未知块无 `fallbackText`。
- release 包含不允许状态、阻塞风险或 review 专属对象。
- 声明的 required 能力没有满足 `minItems`。
- 主 schema 不兼容或 ID 迁移有冲突。

### 10.2 警告

- optional 能力已声明但当前包无有效数据。
- 知识没有一句话理解、关系或回忆项。
- 内容块只有知识级来源，尚未精确到块。
- 语义增强覆盖率低，但完整结构块仍可读。
- 导航区域过大，可能需要05定义的聚合策略。

警告不能被页面当作发布批准；阻塞错误不能通过“忽略错误”生成 release 包。

### 10.3 构建证据

每次构建报告至少包含：

- 输入来源和适配器版本。
- schema、package 和模块 profile 版本。
- 导航、知识、块、关系、回忆和来源数量。
- 状态、风险和构建目标分布。
- 能力声明与实际有效数据对照。
- 降级块、警告和阻塞错误。
- 确定性复建结果或内容哈希。

## 11. 模块渐进迁移路径

### 政治

正式 Markdown 和审核关系继续作为源；先让现有37篇 review 数据输出本契约的 review 包，验证完整内容块、目录和39条关系。最终校对只改变审核状态、内容版本和必要正文，不推翻展现契约。

### 常识

先由只读适配器映射当前稳定模型，建立数量、路径、正文、表格、来源和搜索回归；通用 UI 默认不启用没有正式数据的关系能力。随后按分类分批迁移正式来源，不能一次性替换现有模块。

### 笔记

先映射科目、分类、知识点和现有内容组件；题型连接作为模块增强，不伪装通用知识关系。没有回忆或关系数据时保持完整阅读和体系导航。

### 新模块

接入前必须提供 `ModuleProfile`、正式源说明、适配器、真实样本、能力证据和模块隔离回归。不能只创建一个页面和手写 JSON 即宣称接入平台。

## 12. 验收场景

### DATA-AC-001：Obsidian 完全关闭

给定政治正式 Markdown，未安装或未启动 Obsidian、没有社区插件和 `.base/.canvas`，独立构建器仍能产生同一有效 review 包。

### DATA-AC-002：完整内容不丢失

给定含标题、段落、列表、表格、重点和来源的知识，构建后的块按原顺序完整覆盖正文，关闭所有增强组件后仍能阅读相同事实。

### DATA-AC-003：未知语义降级

给定同主版本中的未知 `semantic`，页面按原结构显示 `fallbackText`，不隐藏内容；构建报告记录降级。

### DATA-AC-004：关系可解释

任取正式关系，都能定位源知识、目标知识、类型、理由及至少知识级来源；有内容块锚点时可双向打开对应正文。

### DATA-AC-005：回忆可追溯

任取回忆项，都能定位原知识、原文块和来源；原文版本变化后未复核卡片不能进入 release。

### DATA-AC-006：能力诚实

给定笔记模块声明关系为 optional 但运行包无正式关系，构建成功并隐藏关系入口；若政治把关系声明为 required 且有效关系为0，构建必须失败。

### DATA-AC-007：review/release 隔离

给定政治37篇均为 review，review 包可供隔离联调，release 包不能包含这些知识；页面操作不能改变该结果。

### DATA-AC-008：三模块同契约

政治 Markdown、常识既有模型和笔记既有模型分别经过适配器后，都输出相同顶层对象和稳定 ID，通用阅读组件不读取模块源字段。

### DATA-AC-009：确定性构建

同一提交、同一适配器和同一构建器连续构建两次，规范化运行数据和 `packageVersion` 完全一致；时间和绝对路径只出现在外部报告。

### DATA-AC-010：目录与关系不混同

删除所有语义关系后，正式导航树仍完整；改变关系不能静默改变目录父子、顺序和知识路径。

## 13. 放弃的方案

| 方案 | 放弃理由 |
|---|---|
| 现在先把所有模块强制改成 Markdown | 迁移与产品重构耦合，无法保护常识和笔记既有行为 |
| 通用 UI 直接读取各模块源字段 | 页面充满模块判断，源格式变化会破坏所有展示 |
| 手工维护运行时 JSON | 形成第二事实源，纠错无法回到正式内容 |
| 以关键词推断定义、条件、例外和因果 | 容易改变事实含义，特别不适合政治和法律内容 |
| 每个语义都成为一种组件类型 | 数据与视觉耦合，类型爆炸且无法自然降级 |
| 共享标签自动成为正式关系 | 没有理由和审核，关系图会制造错误连接 |
| 从正文随机截断或挖空生成卡片 | 破坏条件、边界和答案完整性 |
| profile 手填“有数据” | 配置会与实际运行包漂移，产生空入口 |
| review 与 release 共用同一入口再靠 UI 隐藏 | 页面错误即可泄漏未批准内容，隔离不可靠 |

## 14. 已接受的数据决策

| 决策 ID | 推荐决定 | 主要影响 | 状态 |
|---|---|---|---|
| DATA-001 | 采用“模块源契约 + 通用运行时契约”两层架构 | 支持常识、笔记渐进迁移，又保持 UI 统一 | Accepted |
| DATA-002 | 每个模块通过只读、可验证、可退役的 SourceAdapter 输出 KnowledgePackage | 页面不再读取模块专属源字段 | Accepted |
| DATA-003 | 冻结 ModuleProfile、NavigationNode、KnowledgeUnit、SemanticBlock、Relation、RecallItem、SourceReference 为核心对象 | 为05–07和新模块提供共同语言 | Accepted |
| DATA-004 | SemanticBlock 采用 `kind × semantic` 两轴，而非每种视觉一个类型 | 保持完整阅读、增强展示与安全降级 | Accepted |
| DATA-005 | Markdown 使用独立构建器可识别的有限 `[!semantic]` 引用块显式表达关键语义 | 可借鉴 Obsidian 形态但不产生运行依赖 | Accepted |
| DATA-006 | 只自动识别 Markdown 结构，不用关键词推断结论、条件、例外、因果和易混 | 防止内容加工改变事实含义 | Accepted |
| DATA-007 | 第一轮增强 definition/conclusion/hierarchy/sequence/condition/exception/contrast/evidence，timeline/entity 先安全降级 | 控制实施范围并保留演进空间 | Accepted |
| DATA-008 | 关系必须有理由、有效端点和来源；可定位时引用内容块，反向关系由构建器派生 | 支持“为什么有关”和双向定位 | Accepted |
| DATA-009 | 回忆项必须引用原知识、内容块、来源和版本；不允许随机截断生成 | 保证主动回忆可信且可纠错 | Accepted |
| DATA-010 | UI 能力取 profile 声明、有效数据和构建目标的交集 | 阻止空壳入口和未批准内容 | Accepted |
| DATA-011 | review 与 release 使用隔离运行包/入口，风险不阻塞加工但阻塞晋级发布 | 支持全量加工与最终校对并行 | Accepted |
| DATA-012 | 采用 schema/package/content 三层版本、确定性构建和显式 ID 迁移 | 支持更新、恢复、实时纠错和跨模块维护 | Accepted |

## 15. Ready 门禁

- [x] DATA-001 至 DATA-012 已接受。
- [x] 通用对象、字段、约束和关系已提出。
- [x] Markdown 结构、显式语义、可推断边界和降级已完成。
- [x] ModuleProfile、能力诚实性和缺失能力行为已完成。
- [x] schema、内容版本、迁移和确定性构建已完成。
- [x] review/release、风险加工和发布隔离已完成。
- [x] 政治、常识、笔记迁移策略和真实验收路径已完成。

本文已达到 `Ready`。05–08和所有模块适配器必须引用这些决策，不能在页面实现中另建内容模型；若实现发现缺口，必须先增补数据决策。
