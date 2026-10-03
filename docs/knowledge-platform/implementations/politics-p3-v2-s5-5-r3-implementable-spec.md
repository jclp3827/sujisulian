# 政治 P3 V2 — S5.5 R3 可实现产品规格

> 状态：R3 confirmed / R4 input frozen；第7节仅保留为J2 v1历史，J2 v2已于2026-09-08获用户手测通过；第8节继续约束J3
>
> 任务 ID：`POL-P3-V2-S5.5-R3-IMPLEMENTABLE-SPEC`
>
> 上游：[S5.5唯一产品结果账本](./politics-p3-v2-s5-5-product-surface.md)中的REC-P0-001至005与OUT-J1至OUT-J5
>
> 边界：本文件只冻结页面责任、状态机、320px线框、字段消费、代表样本和可证伪验收；不修改页面代码、正式Markdown、目录、关系、RecallItem、发布状态或现有持久状态，不运行R4门禁和微信CLI

> J2当前恢复依据：[J2 v2快速导读规格](./politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)与[J2 v2首版完整内容脚本](./politics-p3-v2-s5-5-r5-j2-v2-content-script.md)。它们已于2026-08-31确认为实施输入，并替代本文件第7节对快速了解呈现、内容和验收的授权；现已实现且用户反馈测试通过。
>
> 分流说明：J3系统学习、J4易混突破和J5考前速记继续分别以本文件第8、9、10节为当前R3执行依据，不受J2重开影响。

## 0. R3结论

R3确认现有数据和状态基础可以继续使用，失败不来自“少一个大模型或新数据库”，而来自页面责任混合、同一事实存在多个渲染器、路线步骤被工程结构主导，以及自动门禁没有验证真实消费。可实现方案固定为：

1. 首页只做熟悉入口、恢复/推荐主任务和学习目标分发，不再展示两张区域卡或内部步数。
2. `KnowledgeSpace`只承载全览、分支和等价目录；不再在同一物理页承载完整正文和回忆。
3. 具体知识一律进入独立`KnowledgeCard`页；微信原生页面栈负责物理返回。
4. 自由探索、搜索和系统学习必须消费同一个`KnowledgeCardSurface`渲染器；快速了解必须复用同一个`KnowledgeSpaceSurface`渲染器。
5. 正文语义块就是用户可见的小知识卡语法；不渲染第二条Atom卡片流，不恢复知识预览卡。
6. 快速了解、系统学习、易混突破和考前速记分别以结构导览、连续大卡周期、正式成对辨析和单卡回忆为页面主体，不能共享成一套换标题的路线模板。

这些决定不改变`KnowledgeContext`、`RouteSession`、`DisplayPreferences`或viewport的所有权，只允许增加纯ViewModel字段和无领域含义的临时展开状态。

## 1. R3退出条件

R3只有同时满足以下条件才可进入R4：

- J1至J5各自拥有页面拓扑、状态转换、320px线框、字段来源、代表样本、失败/恢复和可证伪验收。
- 同一知识正文只有一个渲染组件；同一知识空间只有一个渲染组件。
- 每个持久字段只有一个所有者，页面局部状态不能复制焦点、路线步骤、回忆结果或viewport。
- 任何新ViewModel字段都能追溯到现有正式导航、KnowledgeUnitCardProjection、RecallProjection、ContrastPair、profile或现有状态；不新增知识事实。
- 当前已知失败能够在R4转换为先失败的纵向门禁，旧A/B/C/D门禁只保留为横向补充。
- 320px宽度下无横向滚动依赖；主要文本、原生返回和当前主动作均可达。

## 2. 物理页面与共享渲染边界

```text
政治首页
├─ 搜索 ──────────────────────────────┐
├─ 浏览知识全景 → KnowledgeSpace页 ───┼→ KnowledgeCard页
└─ 四类学习目标 → GuidedRoute页       │   ├─ reading
                         ├─ quick：复用KnowledgeSpaceSurface
                         ├─ systematic：复用KnowledgeCardSurface
                         ├─ confusion：使用ContrastSurface
                         └─ exam：复用KnowledgeCardSurface.recall
```

| 物理页面/渲染器 | 唯一责任 | 明确不负责 |
|---|---|---|
| `pages/politics/index` | 搜索入口、恢复或默认建议起点、其他学习目标、低权重自由探索入口 | 展示两篇区域卡、目录、知识正文、路线步骤数 |
| `subpackages/politics/search/index` | 查询、意图过滤、命中解释；点击即提交到精确目标 | 知识预览、三种同权去向、保存另一份焦点 |
| `subpackages/politics/map/index` | `overview/branch`知识空间与`directory`等价投影；保存页内位置 | 完整正文、关系详情、回忆面、路线进度 |
| `subpackages/politics/detail/index` | 独立KnowledgeCard页壳、原生返回、入口锚点、普通关系/回忆情境 | 复制路线计划、渲染第二份正文、拦截微信返回 |
| `subpackages/politics/route/guided-route` | RouteSession所有者、四目标开始/进行中/完成/失效壳 | 自建知识正文或知识空间事实 |
| `KnowledgeSpaceSurface` | 全览/分支/目录的唯一WXML渲染；供map与quick复用 | 持久化状态、渲染完整正文 |
| `KnowledgeCardSurface` | 路径、GoalGuide可选槽、连续语义正文、关系情境、回忆面、来源工具的唯一WXML渲染；供detail/systematic/exam复用 | 路线规划、生成知识事实、预览卡 |
| `ContrastSurface` | 正式ContrastPair的判断、边界、证据和复答 | 从标题相似度猜易混对、复制完整正文 |

R5可以用两个小程序原生组件承载`KnowledgeSpaceSurface`与`KnowledgeCardSurface`，不引入组件库。组件只消费ViewModel并发出领域事件，不直接读整库或写storage。

## 3. 状态所有权与提交规则

| 状态 | 唯一所有者 | 页面只可做什么 | 禁止复制为 |
|---|---|---|---|
| 当前知识、活动、来源、锚点、Trail、搜索快照、goalContext | 现有`KnowledgeContext` | 通过`applyContextEvent`提交或读取 | `selectedPoint/currentCard/routePoint`等第二套持久字段 |
| 路线当前步、完成/跳过、初答/复答、自评、揭晓、补救 | 现有`RouteSession` | 通过`applyRouteSessionEvent`推进 | 页面数组下标、独立回忆结果、临时完成计数 |
| 字号、行距、密度、重点、低动画、空间/目录偏好 | 现有`DisplayPreferences` | 显示设置后原位重投影 | 页面私有偏好对象 |
| 空间分支、目录/空间投影、滚动锚点、viewportToken | `KnowledgeContext.snapshots.system` | map页在页内转换时更新 | 第二份map session |
| 页面栈 | 微信原生导航 | `navigateTo/navigateBack`并在进入前保存语义快照 | 自定义全局返回栈 |
| 抽屉展开、来源区展开、当前输入焦点 | 当前组件内存 | 在页面销毁后丢弃 | 领域状态或恢复依据 |
| storage读写结果 | 新的纯结果包装`{ok,value,reason}` | 展示保存成功/失败并允许重试 | 吞错后的`null` |

提交规则：

1. 点击空间中的非叶子节点只改变`expandedBranchId/projection/scrollAnchorId`，不建立KnowledgeFocus。
2. 点击KnowledgeUnit才提交`SELECT_POINT`；默认`activity=reading`。有关系不能再自动把默认活动改成`relations`。
3. 搜索命中在点击时一次提交焦点、目标activity和block/relation/recall锚点，不经过preview状态。
4. 路线步骤只有`completionEvent`、显式跳过、退出或失效重建可以改变RouteSession；滚动、展开来源、查看关系理由不能推进。
5. `KnowledgeContext.goalContext`只镜像当前RouteSession的routeId/type/scopeId/stepId/positionText，用于共享渲染；RouteSession仍是进度真源。
6. 物理页返回不发业务“BACK”事件；进入页前已经保存的来源和viewport在上一个页面`onShow`时恢复。

## 4. 公共入口与深链契约

| 来源 | 目标 | 必需参数/事件 | 目标初始状态 | 原生返回后 |
|---|---|---|---|---|
| 首页“浏览知识全景” | KnowledgeSpace页 | `state=overview` | overview + 用户上次projection | 首页原位置 |
| KnowledgeSpace叶子 | KnowledgeCard页 | `pointId`、`origin=system`；先提交`SELECT_POINT(activity=reading)` | reading + title起点 | 原分支、滚动锚点、viewport |
| 完整目录叶子 | KnowledgeCard页 | 同上，`origin=directory` | reading | 原目录条目 |
| 搜索正文命中 | KnowledgeCard页 | `pointId/activity=reading/blockId/origin=search` | 精确正文块高亮一次 | 原查询、意图、结果序号与滚动位置 |
| 搜索关系命中 | KnowledgeCard页 | `pointId/activity=relations/relationId/origin=search` | 正文保留，关系情境槽展开到命中关系 | 原搜索位置 |
| 搜索回忆命中 | KnowledgeCard页 | `pointId/activity=recall/recallItemId/origin=search` | 同卡recall面 | 原搜索位置 |
| 普通关系目标 | KnowledgeCard页 | `FOLLOW_RELATION`后传目标pointId及relationId | 目标reading，顶部说明来路；关系槽可展开 | 原卡由原生栈恢复，Trail仍在KnowledgeContext |
| 首页目标 | GuidedRoute页 | `type`及`recommended=1/resume=1` | start/resume/expired | 首页当前主任务刷新 |
| quick锚点 | KnowledgeCard页 | `pointId/origin=route/routeId/stepId` | reading，只读查看，不推进导览 | 原导览站点 |

旧`preview`、`search-preview`、`knowledge-preview`深链只允许在R5入口归一为上述目标；不得继续渲染预览层，R6删除死分支。

## 5. 首页公共规格

### 5.1 320px线框

内容区按左右各16px，净宽288px；所有元素纵向流动，不出现横向滚动。

```text
┌──────────────────────────────┐
│ 政治理论                     │
│ 今天想弄懂什么？             │
│ [ 搜索概念、关系、区别…   › ] │  熟悉入口，非填充主按钮
│                              │
│ [当前任务/默认建议起点]      │
│ 为什么从这里开始             │
│ [ 继续/开始当前任务       ]   │  全页唯一填充主动作
│                              │
│ 其他学习方式                 │
│ 系统学习  连续理解正式范围 › │
│ 易混突破  核对一组正式边界 › │
│ 考前速记  进入冻结回忆卡组 › │
│                              │
│ 浏览全部知识              ›  │  低权重自由探索入口
└──────────────────────────────┘
```

如果当前主任务是某一目标，“其他学习方式”不再重复该目标；无活动会话的首次使用主任务为快速了解。其他目标行只显示目标和结果，不显示统一“开始”按钮或内部`stepCount`。首页不再渲染两篇区域卡；总体结构只在KnowledgeSpace中表达一次。

### 5.2 首页状态

| 状态 | 主卡 | 唯一主动作 | 其他目标 |
|---|---|---|---|
| first-use | 默认建议起点：快速了解；说明按两篇主线和策展锚点建立整体认识 | 开始了解整体 | systematic/confusion/exam |
| active-route | 当前目标、用户可懂的当前位置 | 继续当前目标 | 其余三个目标各自保持进度，可直接进入或恢复；首页只突出一个最近任务 |
| recent-focus | 上次知识及路径 | 继续阅读 | 四目标 |
| invalid-route | 内容已变化及影响 | 按当前内容重建 | 其他目标仍可达 |
| invalid-recent | 上次位置已变化 | 浏览新的知识全景 | 四目标 |

### 5.3 首页字段消费

- 保留`projectHomeDecision.stateId/statusLabel/title/description/recommendedAction`。
- `goals`改投影为`otherGoals`，过滤当前主卡所代表的goal；不向WXML提供或显示`stepCount`。
- `first-use.description`必须来自profile稳定理由，只能写“默认建议起点”，不能写“适合你”。
- 删除首页`regions`消费；首页“浏览全部知识”直接进入KnowledgeSpace overview。
- storage读取必须返回`storageStatus`，失败时主卡说明“暂时无法读取上次进度”，不得被当成首次使用。

## 6. J1 自由探索与共享知识表面

### 6.1 页面状态机

```text
HOME
  ├─ browse → SPACE.overview
  └─ search → SEARCH → CARD.reading/relations/recall

SPACE.overview
  ├─ expand(regionId) → SPACE.branch(regionId)
  ├─ directory → SPACE.directory
  └─ nativeBack → HOME

SPACE.branch
  ├─ switch(regionId) → SPACE.branch(regionId)
  ├─ open(pointId) → CARD.reading
  ├─ directory → SPACE.directory(sameAnchor)
  └─ collapse → SPACE.overview

CARD.reading
  ├─ relation → CARD.relations
  ├─ recall → CARD.recall
  └─ nativeBack → source page and saved anchor

CARD.relations/recall
  ├─ backToReading → CARD.reading（同页语义切换）
  └─ nativeBack → source page（不劫持）
```

### 6.2 KnowledgeSpace全览线框

```text
┌──────────────────────────────┐
│ 知识全景 · 政治理论          │
│ 37个知识由两条正式主线组成   │
│              ●               │
│              │               │
│ ┌ 第一篇 · 19 ────────────┐ │
│ │ 2章：总论4 / 分论15     │ │
│ │ 展开这一篇            › │ │
│ └────────────────────────┘ │
│              │               │
│ ┌ 第二篇 · 18 ────────────┐ │
│ │ 18个知识按正式顺序直属  │ │
│ │ 展开这一篇            › │ │
│ └────────────────────────┘ │
│ [结构全景]            按目录 │
└──────────────────────────────┘
```

这是稳定分区结构图，不是普通知识卡列表：根、分支连线、结构类型和相对规模始终存在；全览不重复知识标题、摘要或入口卡。

### 6.3 分支鱼眼线框

```text
┌──────────────────────────────┐
│ 知识空间 · 第一篇            │
│ [第一篇 19 · 展开] [第二篇18]│  当前分支放大，兄弟持续在场
│                              │
│ 第一章 总论 · 4              │
│ ├ 核心要义                ›  │
│ ├ “两个结合”              ›  │
│ ├ 科学体系                ›  │
│ └ 中国式现代化            ›  │
│                              │
│ 第二章 分论 · 15             │
│ ├ 党的全面领导            ›  │
│ ├ 以人民为中心            ›  │
│ └ …继续浏览12项              │
└──────────────────────────────┘
```

第二篇没有正式章级，不伪造章节：

```text
│ 第二篇 · 18个直属知识        │
│ 01 马克思主义概述         ›  │
│ 02 两大哲学派别           ›  │
│ …                            │
│ 18 剩余价值理论           ›  │
```

全览到任一知识最多两次提交：展开一篇、打开知识。第一篇不再要求“篇→章→关系页→预览→正文”；章在同一分支页只作为分组标题。

### 6.4 等价目录线框

```text
第一部分 政治理论（37）
├─ 第一篇…（19）
│  ├─ 第一章 总论（4）
│  │  ├─ 核心要义
│  │  └─ …
│  └─ 第二章 分论（15）
│     ├─ 党的全面领导
│     └─ …
└─ 第二篇…（18）
   ├─ 马克思主义概述
   └─ …剩余价值理论
```

目录严格递归消费42个正式NavigationNode。缩进每级16px，最大三级缩进后仍保留至少224px标题宽度；长标题换行，不横向滚动。第二篇叶子直接归属文章，不添加“本篇知识”这一伪层。

### 6.5 KnowledgeCard线框与小卡语法

```text
┌──────────────────────────────┐
│ 第一篇 › 第一章 › 当前知识   │ ContextBar
│ [目标引导：可选，路线时出现] │ GoalGuideBand
│ 内容校订中                   │
│ 当前知识标题                 │
│ 一句话摘要                   │
│                              │
│ ┌ 定义/结论 ──────────────┐ │
│ │ 连续正式正文块…          │ │ 小知识卡就是语义块
│ └────────────────────────┘ │
│ 普通连续正文…                │
│ ┌ 条件/例外/易混边界 ─────┐ │
│ │ 连续正式正文块…          │ │
│ └────────────────────────┘ │
│ [为什么相关] 关系情境槽      │
│ [开始回忆] 回忆情境槽        │
│ 显示 · 来源与反馈            │ 低优先工具
└──────────────────────────────┘
```

- `SemanticBlock.semantic`决定视觉语法；`plain`块保持连续文章流，不能全部包成浮卡。
- `KnowledgeAtomRef`只提供block锚点、角色标签和关系/回忆复用，不渲染`previewAtoms`或独立Atom条带。
- 关系锚定到当前正文块时，在该块之后插入一个低干扰“为什么相关”提示；完整关系列表位于正文后。
- recall切换使用同一KnowledgeCardSurface，保留pointId、routeId、stepId和正文滚动快照；“返回正文”是页内语义动作，微信左上角始终返回来源物理页。

### 6.6 J1字段消费与缺口

| 需要 | 现有来源 | R3投影/调整 |
|---|---|---|
| 两条稳定区域 | root.childIds、pointCount | `overview.regions[]`只投影结构类型、分支摘要和规模，不带知识摘要 |
| 第一篇两章与第二篇直属叶子 | navigationNodes.parentId/childIds/type | `branch.groups[]`按真实父子递归生成；不使用当前只看一层的`branch.nodes` |
| 等价目录 | 全部42个navigationNodes | 新`directoryTree`递归树；废止`directoryGroups + 本篇知识`伪分组 |
| 打开具体知识 | navigationNode.pointId | `SELECT_POINT`默认reading，保存source anchor后原生navigateTo |
| 唯一大卡 | KnowledgeUnitCardProjection + unit.blocks | `KnowledgeCardSurfaceViewModel`；不消费`previewAtoms`、`mode=preview` |
| 语义小卡 | block.semantic + AtomRef sourceBlockIds | block原位样式；AtomRef仅反查角色/锚点 |
| 精确返回 | snapshots.system/search、origin、anchor | 页面进入前保存；来源页onShow恢复，不自建返回栈 |

### 6.7 J1代表样本

- 全览根：`politics-toc-v2-n001`，两篇分别为`n002`（19）和`n024`（18）。
- 分支一：`n002 → n003/n008 → u001…u019`，验证章分组和叶子直达。
- 分支二：`n024 → u020…u037`，验证无章级时不伪造层级。
- 大卡：`politics-toc-v2-u001`，验证summary、连续语义块、关系、RecallProjection和精确原文锚点共享。
- 搜索命中：用u001的definition块、正式relation和`recall:politics-toc-v2-u001:qa`分别验证三种直接落点。

### 6.8 J1可证伪验收

| ID | Given / When / Then | 明确失败 |
|---|---|---|
| R3-J1-AC-01 | Given无焦点；When打开全览；Then只出现根和两条结构分支，不出现37项卡片阵列 | 首页或全览重复区域/知识卡 |
| R3-J1-AC-02 | When展开任一篇；Then兄弟篇持续可见，当前篇在原地展示全部真实分组 | 进入新的章页面或兄弟消失 |
| R3-J1-AC-03 | When从全览进入任一知识；Then最多“展开篇→打开知识”两次提交 | 仍需经过章页、关系页或预览页 |
| R3-J1-AC-04 | Given第二篇；Then18项直接归属第二篇，不出现伪章 | 新增未在正式目录中的层级 |
| R3-J1-AC-05 | Given目录模式；Then42节点父子关系与正式目录一致且37叶子均可达 | 平铺、漏项、重复项或“本篇知识”伪层 |
| R3-J1-AC-06 | When从空间/搜索/路线打开同一pointId；Then渲染组件和正文block序列完全相同 | 任一入口使用独立正文模板 |
| R3-J1-AC-07 | Given语义正文；ThenAtomRef不形成第二条可见内容流 | 出现原子卡列表或重复摘要/正文 |
| R3-J1-AC-08 | When微信原生返回；Then恢复来源分支/搜索结果和滚动锚点 | 自定义双返回、位置丢失 |
| R3-J1-AC-09 | Given320px/最大字号；Then无横向裁切，树缩进、长标题、主动作和原生返回可达 | 依赖横向滚动或标题遮挡动作 |
| R3-J1-AC-10 | Given关系/回忆缺失；Then完整正文仍成立且相应槽诚实隐藏 | 空壳工具或伪造能力 |

## 7. J2 快速了解（J2 v1历史冻结，用户证伪 / UX-failed）

> **本节完整保留旧J2 v1方案与验收，只用于解释既有代码、旧绿灯和失败来源，不再是当前产品授权。** 用户手测确认页面虽可见，但真实交互无法继续；更根本地，四站目录游不能让首次用户获得经过加工的政治理论初步理解。因此旧`J2-anchors / J2-consumption`工程通过不能推进OUT-J2或授权J3。
>
> 当前J2必须恢复到[J2 v2快速导读规格](./politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)和[J2 v2首版完整内容脚本](./politics-p3-v2-s5-5-r5-j2-v2-content-script.md)：以内容先行的连续纵向导读替代四站/六锚点通行；缺少合格导读内容时诚实不可用，不回退为目录游。

### 7.1 产品主体与状态机

快速了解不是知识列表，也不是完整阅读缩短版。它在GuidedRoute页复用KnowledgeSpaceSurface，以四站完成“整体→第一篇→第二篇→重新合拢”：

```text
quick.ready
  → quick.overview
  → quick.branch(n002, anchors n006/n007)
  → quick.branch(n024, anchors n025/n029/n032/n038)
  → quick.closure
  → quick.completed
```

每站只允许`COMPLETE_TOUR_STOP`推进；点击策展锚点打开KnowledgeCard只读查看，原生返回仍在同一站，不自动推进。无有效anchor时进入`quick.structure-only`，页面和完成文案必须称“浏览两篇结构”，不能声称已经快速了解。

### 7.2 策展锚点冻结

`routeDefaults.quick.anchorNodeIds`在政治profile固定为以下6个已存在NavigationNode，只用于有限导览，不改变正式目录、关系或内容：

| 分支 | Node ID | 知识 | 导览作用 |
|---|---|---|---|
| 第一篇 | `politics-toc-v2-n006` | 科学体系 | 认识这一思想的内容结构 |
| 第一篇 | `politics-toc-v2-n007` | 中国式现代化 | 认识总体目标落点 |
| 第二篇 | `politics-toc-v2-n025` | 马克思主义概述 | 认识组成与实践基础 |
| 第二篇 | `politics-toc-v2-n029` | 对立统一规律 | 哲学发展动力的代表锚点 |
| 第二篇 | `politics-toc-v2-n032` | 实践与认识 | 认识论代表锚点 |
| 第二篇 | `politics-toc-v2-n038` | 商品及其二因素 | 政治经济学代表锚点 |

锚点标题和一句话只能读取对应KnowledgeUnit的正式title/summary，不在profile复制政治表述。

### 7.3 320px线框

```text
┌──────────────────────────────┐
│ 快速了解 · 导览第2/4站       │
│ 为什么：沿两篇主线看整体     │
│ 现在：看第一篇怎样分为两章   │ GoalGuide三问完整可见
│                              │
│ [第一篇19 · 当前] [第二篇18] │
│ 第一章 总论4 ─ 第二章 分论15 │
│ 本站锚点                     │
│ 科学体系                  ›  │
│ 中国式现代化              ›  │
│                              │
│ [ 已看清这一站，下一站 ]     │
│ 跳过本站 · 退出并自由浏览    │
└──────────────────────────────┘
```

完成页只报告“整体、两篇主干和6个锚点中实际看过的项目”，主动作是“回到全景继续探索”。不显示掌握度、正确率或“已学会”。

### 7.4 字段与验收

- 现有`plan.startProjection.anchorCount`扩展为按站分组的`quickStops[].anchorNodeIds/anchors[]`。
- `route.experience.quickBranches`增加当前站对应的真实结构摘要和anchors，不复制KnowledgeCard正文。
- `GoalGuide.purpose/instruction/completionEvent/progressText/next`必须全部在WXML可见或可被无障碍读取。
- RouteSession继续保存完成/跳过站点；锚点打开次数可作为本次事实记录，但不作为完成门槛。

| ID | 可证伪验收 |
|---|---|
| R3-J2-AC-01 | ready页无需选择篇章，一键进入四站导览；若先出现范围列表即失败 |
| R3-J2-AC-02 | 四站的结构主体、当前位置和下一站可区分；若只是标题不同的同一列表即失败 |
| R3-J2-AC-03 | 六个锚点均来自profile ID且能直达同一KnowledgeCard；缺ID时进入structure-only而非猜测 |
| R3-J2-AC-04 | 点击锚点返回后RouteSession仍在原站且viewport恢复；若自动推进即失败 |
| R3-J2-AC-05 | 完成只报告已浏览结构/锚点，不报告掌握；320px下当前站和主动作首屏可达 |

## 8. J3 系统学习

### 8.1 产品主体与状态机

系统学习以KnowledgeCardSurface为主体。`orientation`不再是一个需要用户点击完成的独立路线步骤，而是每个知识reading状态顶部的GoalGuide和关系/前置提示；RouteSession对每个知识只保留可完成的`reading → recall`两阶段。

```text
systematic.ready（范围、依据、4个知识、首尾、前置）
  → unit1.reading → unit1.recall
  → unit2.reading → unit2.recall
  → unit3.reading → unit3.recall
  → unit4.reading → unit4.recall
  → systematic.completed
```

- `COMPLETE_READING_STEP`从reading切到同卡recall。
- recall必须先揭晓再自评；`remembered`可直接进入下一知识，`fuzzy/missed`保留当前卡并出现“回看依据”，完成回看或显式下一项后再推进。
- 跳过必须记录具体知识/阶段；范围外前置缺失在ready页和对应知识GoalGuide中说明，不能静默扩张范围。

### 8.2 320px线框

```text
┌──────────────────────────────┐
│ 系统学习 · 第1/4个知识       │
│ 为什么：从总论按正式顺序学习 │
│ 现在：完整理解核心要义       │
│ 完成：读完后进入同卡回忆     │
│ [定位与提示]—[完整理解]—[回忆]│
│                              │
│ 第一篇 › 第一章              │
│ 知识标题                     │
│ 连续KnowledgeCard正文…       │
│                              │
│ [ 完成阅读，开始回忆 ]       │
│ 跳过本阶段 · 退出本次学习    │
└──────────────────────────────┘
```

ready代表样本固定为`scopeId=politics-toc-v2-n003`：4个知识、4个RecallProjection，首个`u001`，末个`u004`。调整范围是次级动作，进入后重新生成新Plan并明确结束旧会话。

### 8.3 字段与验收

- `plan.steps`不再为每个知识生成可完成的orientation step；orientation内容由`outsidePrerequisites/relationContextIds/reason`投影到reading的GoalGuide。
- `experience.systematic`投影`pointPosition/pointTotal/cycle=[reading,recall]`；显示知识进度，不显示内部总步骤数。
- `KnowledgeCardSurface`消费同一`card.identity/content/relationContext/recall`；guided route不得再生成`currentCard`专用正文模板。
- completion report列出`completedReading/completedRecall/skipped/fuzzy/missed/reviewed`及下一范围建议，不计算掌握度。

| ID | 可证伪验收 |
|---|---|
| R3-J3-AC-01 | ready页同时显示范围理由、知识数、首尾和范围外前置；缺任一项即失败 |
| R3-J3-AC-02 | 开始后直接进入u001同源大卡，不经过知识预览或orientation确认页 |
| R3-J3-AC-03 | reading与recall使用同一pointId和KnowledgeCardSurface，切换不重置滚动/路线 |
| R3-J3-AC-04 | 只有完成事件、跳过或退出改变RouteSession；打开关系/来源不能推进 |
| R3-J3-AC-05 | 原生返回再进入恢复同一知识/阶段；版本或存储失败有明确重建/重试状态 |
| R3-J3-AC-06 | 完成页报告真实动作和跳过项，不出现“掌握/学会”推断 |

## 9. J4 易混突破

### 9.1 产品主体与状态机

易混突破只接受正式ContrastPair。代表样本固定为：

- relation：`relation:politics-toc-v2-u025:contrast:politics-toc-v2-u024`
- pair：`contrast-pair:politics-toc-v2-u025:politics-toc-v2-u024`
- 左右对象：量变质变规律 / 对立统一规律
- 维度：发展规律回答的问题
- 正式边界：对立统一规律回答发展动力；量变质变规律回答发展状态和形式。

```text
confusion.ready
  → judgment（先在同一维度判断；记录answered/unsure/skipped）
  → boundary（揭示正式边界）
  → evidence（左右AtomRef/Block锚点回源）
  → retest（再次作答；记录clear/fuzzy/missed）
  → confusion.completed
```

初答和复答围绕同一个正式ContrastPair维度，只记录本次自陈事实，不计算正确率。当前两条Recall引用分别是单元回忆题，不能把其中一题作为成对辨析的复答；提示只引用维度和双方标题，不新增知识断言。若pair、dimension、boundary或双侧锚点任一缺失，不进入完整四阶段；只能显示“当前没有可用的正式对照”并允许返回原知识或换一组正式pair。

### 9.2 320px线框

```text
┌──────────────────────────────┐
│ 易混突破 · 先判断            │
│ 为什么：按正式对照顺序推荐   │
│ 维度：发展规律回答的问题     │
│                              │
│ A 对立统一规律               │
│   [边界揭晓前不显示答案]     │
│ ───────── 对照 ───────────  │
│ B 量变质变规律               │
│   [边界揭晓前不显示答案]     │
│                              │
│ [ 我已经判断，核对边界 ]     │
│ 还不确定 · 跳过本组          │
└──────────────────────────────┘
```

左右在320px采用纵向对照，不使用两列窄卡；A/B标签、同一维度和阶段标题始终可见。证据阶段的“看左侧原文/看右侧原文”是次级链接，主动作仍是“依据已看过，开始再辨”。

### 9.3 字段与验收

- `ContrastSurface`只消费`contrastPair.id/dimensions/boundaries/leftAtomRefIds/rightAtomRefIds/sourceBlockIds/sourceRefIds`及两侧KnowledgeCard identity。
- `RouteSession.responseByStepId`记录judgment与retest结果；不新增第二份答题状态。
- `VIEW_CONTRAST_EVIDENCE`只有在双方锚点均成功展示后才可完成；单侧失败进入明确降级，不能自动标记已看。
- completion report显示初答状态、是否核对边界、双方依据是否打开、复答状态；不显示掌握度。

| ID | 可证伪验收 |
|---|---|
| R3-J4-AC-01 | ready页直接给出系统推荐的正式A/B及依据，不先展示普通篇章或pair选择器 |
| R3-J4-AC-02 | 四阶段页面主体和动作真实变化；仅换标题/进度文案即失败 |
| R3-J4-AC-03 | 320px下A/B、同一维度和当前阶段持续可见，无横向双列裁切 |
| R3-J4-AC-04 | 左右证据分别精确落到正式Block并原生返回本阶段，不能用summary替代证据 |
| R3-J4-AC-05 | 初答与复答分别记录且完成页可区分；不得推断正确率/掌握度 |
| R3-J4-AC-06 | 无正式pair或锚点失效时诚实不可用，不从标题、普通关系或相似文本生成 |

## 10. J5 考前速记

### 10.1 产品主体与状态机

代表样本固定为`scopeId=politics-toc-v2-n003`生成的4张冻结RecallProjection，第一张为`recall:politics-toc-v2-u001:qa`。

```text
exam.ready / exam.resume
  → card.prompt
  → card.revealed
  → card.assessed(remembered/fuzzy/missed/skipped)
      ├─ fuzzy/missed → card.remedy → next
      └─ remembered/skipped → next
  → exam.completed

任意状态 ─ packageVersion变化 → exam.expired → rebuild/exit
任意写入 ─ storage失败 → exam.unsaved → retry（本页内存会话仍可继续）
```

### 10.2 320px线框

```text
┌──────────────────────────────┐
│ 考前速记 · 第1/4张           │
│ 核心要义                     │
│                              │
│ 习近平新时代中国特色…       │
│ 核心要义是什么？两个判断…   │
│                              │
│ [ 揭晓答案 ]                 │
│ 暂停本轮                     │
└──────────────────────────────┘

揭晓后：
│ 正式答案 + 易错点             │
│ [记住了] [有点模糊]          │
│ [没想起] [跳过]              │
```

每一面只有当前提示或揭晓内容和一个阶段主动作；显示设置/来源不与回答组竞争。`fuzzy`与`missed`都进入待回看队列，`skipped`单独计数但不进入“没记住”。

### 10.3 字段与验收

- 继续使用`RouteSession.revealedStepIds/responseByStepId/reviewedStepIds/recallResults`；将`skipped`作为显式事件而非默认为missed。
- `report.remedyQueue`包含`fuzzy`和`missed`且标出result；旧`missedUnreviewedItems`只作兼容输入，不能代表完整补救队列。
- `projectRecallViewModel`继续消费RecallProjection的answer/pitfall Block与returnTarget；不从正文临时生成题目。
- storage包装返回`ok/reason`；失败时显示未保存状态和“重试保存”，不得静默回到first-use。
- 完成页分项报告remembered/fuzzy/missed/skipped/reviewed，并允许先回看补救队列或结束；不推断掌握度。

| ID | 可证伪验收 |
|---|---|
| R3-J5-AC-01 | 有有效会话时首页和ready页都只给“继续第N/4张”，不会新建卡组 |
| R3-J5-AC-02 | 无会话时一键按profile默认范围生成冻结卡组，范围/随机是次级动作 |
| R3-J5-AC-03 | prompt→revealed→assessed的顺序不可跳过；未揭晓不能自评 |
| R3-J5-AC-04 | fuzzy/missed进入补救队列，skipped独立统计；完成页四类数量与session一致 |
| R3-J5-AC-05 | 暂停/原生返回/再次进入恢复同一卡同一面；版本变化明确失效并重建 |
| R3-J5-AC-06 | storage失败显示未保存并可重试；若页面假装已保存即失败 |
| R3-J5-AC-07 | 320px/最大字号下问题、揭晓、四个回答和主动作可达且不横向裁切 |

## 11. 公共ViewModel消费契约

| 投影 | 必须输出 | 必须删除/停止消费 |
|---|---|---|
| HomeDecision | `stateId/statusLabel/title/description/recommendedAction/otherGoals/storageStatus` | 首页regions、goal.stepCount、重复当前goal |
| KnowledgeSpaceViewModel | `surfaceState=overview|branch`、regions、branch.groups、directoryTree、viewport、ContextBar | `full/recall/preview`页面态、card、重复完整底图 |
| KnowledgeCardSurfaceViewModel | identity、contextBar、optional goalGuide、semanticBlocks、inlineRelations、relationFooter、recallFace、contextTools | previewAtoms可见流、mode=preview、页面专用正文副本 |
| RouteViewModel.quick | quickStops、currentStop、guide、report | 普通知识列表、范围选择器 |
| RouteViewModel.systematic | plan范围说明、current point、reading/recall cycle、guide、shared card、report | orientation独立确认步、guided-route专用card模板 |
| RouteViewModel.confusion | formal pair、stage、dimension、two-sided anchors、guide、responses、report | 普通relation降级成完整易混、标题相似推断 |
| RouteViewModel.exam | frozen deck、recallFace、storageStatus、remedyQueue、report | 页面临时卡组、只统计missed的补救队列 |

组件事件统一为领域事件：`OPEN_POINT`、`SWITCH_ACTIVITY`、`OPEN_RELATION`、`REVEAL_RECALL`、`RECALL_RESULT`、`VIEW_REMEDY`、`COMPLETE_ROUTE_STEP`、`SKIP_ROUTE_STEP`。组件不接收wx storage key，也不自行navigate。

## 12. R4先失败门禁清单

R4新建纵向门禁时必须先用当前代码证明下列检查会失败，再允许R5修改产品代码：

| Gate | 当前应失败的事实 | 通过后证明什么 |
|---|---|---|
| J1-renderer | map、guided-route、detail仍有三份WXML正文/卡片主体 | 同一知识只由KnowledgeCardSurface渲染 |
| J1-space | KnowledgeSpace仍包含full/recall，目录使用非递归伪分组 | 空间页责任和正式目录归属成立 |
| J1-navigation | selectPoint默认有关系时进入relations，仍有preview决策代码 | 具体知识默认正文直达且原生返回契约成立 |
| HOME-hierarchy | 首页仍渲染regions、四个“开始”和stepCount | 首屏主次与去重成立 |
| J2-anchors | profile anchorNodeIds为空且quick只显示branchCount | 快速了解具备6个显式策展锚点和诚实降级 |
| J3-cycle | systematic仍生成orientation独立步骤、guided route专用正文 | 两阶段共享大卡周期成立 |
| J4-contrast | 初答/复答结果和双侧证据消费未被真实绑定 | 四阶段辨析闭环成立 |
| J5-remedy | fuzzy不进入补救队列、storage错误被吞 | 卡组恢复、完整补救和失败可见成立 |
| consumption | 现有validator主要检查字段或源码字符串存在 | 字段被当前WXML/事件真实消费，删除字段会使测试失败 |
| negative | 无pair、锚点失效、storage失败、320px等缺少负例 | 诚实降级、恢复、移动端和隔离成立 |

R4不得通过修改`covers`数组、添加无消费字段或只扫描源码字符串让门禁变绿。每个OUT-J必须至少包含纯状态转换、ViewModel、WXML消费、负例、恢复和常识/笔记隔离六类证据。

## 13. R3状态与下一步

- REC-P0-001至005已转为`confirmed`并落实为本文件的页面/状态/渲染契约。
- J1至J5已达到`specified`，未达到`prototype-confirmed`、`implemented`或`UX-passed`；S5.5总账本中的`UX-failed`保持不变。
- 政治继续为`candidate`，37篇继续`review`，`release=0`；常识、笔记和主导航不变，S6暂停。
- 本轮没有修改页面代码、正式内容和现有validator，也没有运行微信CLI。
- 用户已确认本R3规格；R4已经建立能够让当前实现正确失败的J1至J5纵向门禁，证据见[R4纵向门禁与红基线](./politics-p3-v2-s5-5-r4-vertical-gates.md)。下一步是R5按HOME/J1至J5逐条实施；本文件在未重开REC-P0裁决前保持冻结。

## 2026-10-03 会话并发规则修订

用户实测J3后确认：快速了解与系统学习等四种学习目标的进度必须解耦。各目标分别拥有可恢复的RouteSession；切换目标不暂停、不覆盖其他目标，也不触发冲突确认。首页仍只突出一个最近任务，保证单一视觉主动作。本修订替代第5.2节旧“切换前暂停”描述，并同步修订D的S55D-AC-010。
