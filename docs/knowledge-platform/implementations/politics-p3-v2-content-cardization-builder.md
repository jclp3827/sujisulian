# 政治 P3 V2 — 内容卡片化与构建器升级任务单

> 状态：Verified — CB0至CB5已完成；政治保持candidate、37篇review、release=0
>
> 切片 ID：`POL-P3-V2-CONTENT-CARDIZATION-BUILDER`
>
> 上游：[04 内容与运行时契约](../04-content-and-runtime-contract.md)、[政治能力配置](../profiles/politics.md)、[S5.5B 知识空间与知识卡片展现](./politics-p3-v2-s5-5b-knowledge-space-and-cards.md)
>
> 下游：政治37篇内容卡片化加工、KnowledgeCard/Recall/Contrast运行投影、S5.5知识卡真实样本验收

## 0. 任务边界

本任务只处理“正式政治内容如何被构建为可追溯知识卡”及其构建器、适配器和数据门禁，不处理S5.5规格治理、首页/知识空间/详情/路线页面实现，也不改变用户交互状态。

第一阶段只使用构建器测试夹具：

- 不修改`docs/knowledge-pilot/knowledge/politics-v2/`中的37篇正式Markdown。
- 不修改正式目录、39条关系事实、37条RecallItem文本或发布资格。
- 政治继续保持`rolloutStage=candidate`，37篇继续保持`review`、`release=0`。
- 不依赖Obsidian、社区插件、`.base`或`.canvas`。
- 不清理、不覆盖工作树中其他用户修改。

只有第一阶段构建器能力通过并经用户确认后，才进入全量稳定锚点和三篇正式样本加工。

## 1. 当前基线与审计证据

2026-08-29只读审计及现有门禁结果：

```text
政治正式内容        37篇 review
正式目录            42个节点
当前内容块          643个
正式关系            39条
RecallItem           37条
来源引用             37条
可发布知识           0条
关系精确块锚点       0/39
回忆精确块锚点       0/37
显式 [!semantic]     0处
```

已通过的现有基线：

- `node scripts/build-politics-knowledge.js --self-test`
- `node scripts/build-politics-knowledge.js --profile toc-v2 --scope review --check-only`
- `node scripts/validate-politics-toc-v2-content.js`
- `node scripts/validate-politics-toc-v2-relations.js`
- `node scripts/validate-knowledge-platform-foundation.js`

这证明现有源、目录、关系、adapter确定性和review隔离可继续作为回归基线，但不证明卡片化能力已经存在。

## 2. CB0审计时的构建器能力差距

| 项目 | 当前实现 | 与04/S5.5B的差距 |
|---|---|---|
| Markdown结构 | 只解析三级标题、标准带空格列表和段落 | 未完整解析table、quote、callout、media；现有大量`1.正文`仍是段落 |
| 语义 | heading→section、有序列表→sequence、无序列表→hierarchy、易混章节→boundary | 把结构和章节位置猜成知识语义，违反“只自动识别结构” |
| 显式语义 | 不识别`[!definition]`等callout | 无法形成正式KnowledgeAtomRef |
| 块ID | `namespace + kind + 文本sha1 + 重复序号` | 改字会改ID；重复内容插入会改变后续重复序号 |
| 语义白名单 | adapter只映射plain/hierarchy/sequence/contrast | 缺definition/conclusion/reason/condition/exception/evidence |
| summary | 有37条summary，`summaryBlockId=null` | 只能追溯到知识级来源，不能定位支撑正文 |
| recall | 有37条正式问答，`sourceBlockIds=[]` | 不能精确回看小卡/原文 |
| relation | 有39条正式关系，块锚点均为空 | 不能双向定位对应原文 |
| cards | 无KnowledgeAtomRef和KnowledgeUnitCardProjection | 页面只能自己临时拼卡，违反事实所有权 |
| recall/contrast投影 | 无RecallProjection和ContrastPair | 易混路线只能消费关系，缺两侧边界和来源卡 |
| 完整度 | 无CardCompleteness | 无法区分基础大卡、结构化小卡、精确回忆和正式对照 |
| schema | 源schema为整数3，平台schema为整数1 | 尚未实现04要求的可选字段演进和块ID迁移消费 |

结论：现有链路可以保留并扩展，无需重写；但在新增严格解析、稳定ID、引用对象和完整度前，不得批量加工37篇或宣称完成卡片化。

## 3. 目标构建链路

```text
政治正式Markdown
├─ card_schema（按文件启用严格卡片契约）
├─ 显式稳定块ID
├─ 显式 [!semantic]
├─ summary / recall块引用
└─ 正式关系审核数据中的跨知识锚点
        ↓
现有 build-politics-knowledge.js
├─ 结构解析与完整降级
├─ 显式语义解析
├─ 稳定ID与迁移报告
└─ 引用存在性/归属/顺序校验
        ↓
现有 politics-adapter.js
├─ SemanticBlock[]
├─ KnowledgeAtomRef[]
├─ KnowledgeUnitCardProjection[]
├─ RecallProjection[]
├─ ContrastPair[]
└─ CardCompleteness
        ↓
review KnowledgePackage + 构建报告
```

正文文本只存在于正式Markdown和SemanticBlock；atom、大卡、回忆和对照只保存ID、角色、顺序和引用，不复制正文。

## 4. 源格式与稳定ID方案

### 4.1 按文件启用，不做半套ID模式

正式文件在进入卡片化迁移时增加：

```yaml
card_schema: 1
```

- 未声明`card_schema`的37篇继续走现有兼容路径，第一阶段输出保持原样。
- 声明`card_schema: 1`后，`完整内容`和`易混与边界`中每个解析块都必须有显式稳定ID；缺失、重复或非法即构建失败。
- 同一文件不能一部分使用显式ID、一部分依赖文本哈希，防止引用在后续编辑中漂移。
- 是否已具备atom/recall/contrast能力由构建器计算，不在frontmatter手填。

### 4.2 中立锚点语法

推荐在块之前使用普通Markdown工具会忽略的HTML注释：

```markdown
<!-- kp:block-id=b001 -->
正文内容。

<!-- kp:block-id=b002 -->
> [!definition] 矛盾
> 矛盾是反映客观事物内部或不同事物之间对立统一关系的哲学范畴。
```

决定：

- `sourceBlockId`在单个KnowledgeUnit内唯一，首轮采用`b001`、`b002`等无语义本地ID。
- 运行时全局ID继续由adapter生成：`block:${pointId}:${sourceBlockId}`。
- ID不包含标题、角色、正文哈希或顺序含义；改字、改标题、移动块时ID不变。
- 新插入块获得新的未使用ID，不重排已有编号。
- 删除、拆分、合并必须产生迁移记录，不允许按相似文本静默改绑。
- 使用HTML注释而非Obsidian `^block-id`，避免把作者工具语法变成运行依赖。

### 4.3 一次性旧ID迁移

现有643个块使用文本哈希ID。某文件首次增加`card_schema: 1`时，构建报告必须保存旧全局ID到新全局ID的映射：

```text
BlockIdMigration
├─ pointId
├─ fromBlockIds[]
├─ toBlockIds[]
├─ primaryTargetId
├─ disposition: rename | split | merge | removed
└─ reason
```

- 一对一改名直接恢复到新ID。
- 拆分或合并必须指定唯一`primaryTargetId`供旧焦点恢复，其余目标只用于审计。
- 删除无替代时显式记录`removed`，恢复到知识卡顶部并给出失效原因。
- builder负责生成和验证映射；状态层何时消费映射由后续统一实施决定，本任务不修改页面路由。

## 5. 显式语义解析

### 5.1 允许的严格语义

`card_schema: 1`只接受04白名单：

```text
definition conclusion reason hierarchy sequence
condition exception contrast evidence
```

解析规则：

- 普通标题、段落、列表、表格和引用只产生对应`kind`，`semantic=plain`。
- 只有`> [!type]`白名单callout产生增强语义。
- 未知callout保留完整`fallbackText`并降为`semantic=plain`，同时产生诊断。
- 一个callout是一个SemanticBlock；其内部段落/列表按原顺序保存在payload和fallbackText中，不拆成页面事实副本。
- 不用关键词、长度、章节名或“易混与边界”所在位置自动升级语义。

### 5.2 reason角色的上游缺口

04已于2026-08-29确认把`reason`加入第一轮显式语义白名单，并按一对一规则生成reason atom。builder仍不得从“因为、由于、作用”等关键词推断reason；只有显式`[!reason]`可以生成正式reason atom。

### 5.3 KnowledgeAtomRef派生

对每个有效显式语义块确定性生成一个atom：

```text
id = atom:${pointId}:${sourceBlockId}
role = 已确认的semantic到role映射
sourceBlockIds = [运行时blockId]
order = 被引用块在正式正文中的顺序
```

- 不再单独手写atom清单。
- `plain`块永远不生成atom。
- atom标题只取显式callout标题；没有标题时省略，不截断正文生成。
- 多块组合留给KnowledgeUnitCardProjection引用，不递归创建atom。

## 6. summary、回忆与关系引用

### 6.1 summary与RecallItem归当前Markdown所有

`card_schema: 1`允许以下可选frontmatter字段：

```yaml
summary_block_id: b002
recall_answer_block_ids:
  - "b002"
recall_pitfall_block_ids:
  - "b009"
```

- `summary_block_id`引用同一知识中支撑“一句话理解”的已有正文块，不为summary复制新正文。
- recall答案和易错点可以各引用一个或多个同知识块，顺序按正式正文派生。
- 引用必须存在且属于当前KnowledgeUnit；缺失时review构建保留RecallItem并标记知识级降级，release构建按04门禁阻塞该回忆能力。
- prompt、answer、pitfall正式文本保持现有协议，不由builder从原文生成。

### 6.2 跨知识关系与ContrastPair归正式关系审核数据所有

跨知识锚点、对照维度和边界不塞入任一侧页面展示代码，也不在两篇Markdown中重复维护。后续内容阶段扩展现有正式关系审核数据，为关系增加：

```text
source_block_ids[]
target_block_ids[]
dimensions[]
boundaries[]
recall_item_ids[]
```

- 现有39条关系的端点、类型、reason和reviewState保持不变。
- 普通前置/相关关系只要求端点所属块引用有效。
- 只有`type=contrasts`且两侧块、dimension、boundary和来源均有效时生成ContrastPair。
- 语义相似和共同关键词只能进入审计候选，不能生成正式对照。
- 迁移期继续校验Markdown关系链接与正式关系审核数据一致；不新建第三份关系事实。

## 7. 运行时对象与完整度

adapter在现有KnowledgePackage上增加可选集合：

```text
knowledgeAtomRefs[]
knowledgeUnitCardProjections[]
recallProjections[]
contrastPairs[]
```

现有`navigationNodes/knowledgeUnits/relations/recallItems/sourceReferences`继续保持兼容。

每个KnowledgeUnit始终产生一张KnowledgeUnitCardProjection：

- 没有atom时`orderedAtomRefIds=[]`，仍可显示标题、路径、summary和完整正文。
- orderedAtomRefIds只能按正文顺序生成，页面不得重排事实。
- relationIds、recallItemIds和sourceRefIds继续引用现有正式对象。

CardCompleteness按以下确定规则派生：

| 标记 | true条件 | false时主要原因 |
|---|---|---|
| `sourceComplete` | 知识身份、完整正文及全部事实块均有有效来源；summary存在时至少有知识级来源，精确summary锚点单独报告 | `SOURCE_MISSING`、`BODY_INCOMPLETE`、`SUMMARY_SOURCE_MISSING` |
| `atomStructured` | 至少1个atom，全部atom引用有效、角色受支持且顺序正确 | `NO_EXPLICIT_ATOM`、`ATOM_REFERENCE_INVALID` |
| `recallLinked` | 当前知识全部用户可用RecallItem的答案与易错点均能定位atom或原文块 | `RECALL_BLOCK_ANCHOR_PENDING`、`RECALL_REFERENCE_INVALID` |
| `contrastLinked` | 当前知识至少参与1个正式ContrastPair，且所有用户可用对照的两侧、维度、边界与来源均有效 | `NO_FORMAL_CONTRAST`、`CONTRAST_EVIDENCE_PENDING` |

四项标记相互独立，不计算百分比。无正式contrast的知识使用`contrastLinked=false + NO_FORMAL_CONTRAST`，表示能力不适用，不表示正文加工失败。

## 8. 部分迁移与诚实降级

迁移单位是“一篇KnowledgeUnit”，不是一次切换全库：

| 文件状态 | 构建行为 | 用户能力 |
|---|---|---|
| 无`card_schema` | 保持现有兼容解析和旧ID；不生成正式atom | 基础大卡、连续正文、知识级回看 |
| `card_schema: 1` + 稳定ID，无显式语义 | 严格结构解析，全部未标记块为plain | 稳定大卡和正文锚点，无小卡 |
| 有显式语义 | 生成有效atom和有序大卡引用 | 渐进显示结构化小卡 |
| recall引用完成 | 生成RecallProjection | 精确揭晓回看 |
| 正式对照证据完成 | 生成ContrastPair | 启用对应易混突破 |

禁止行为：

- 未迁移文件不能因旧列表或章节位置被计入`atomStructured`。
- 缺失小卡时不显示空壳，不把plain段落临时切卡。
- 缺失精确回忆锚点时只回到完整知识卡，不猜最近文本。
- ContrastPair任一侧不完整时不进入用户易混路线。
- 页面不得自行提高完整度或补齐引用。

## 9. Schema与兼容策略

采用最小兼容升级，不立即增加新的主schema：

1. 源包继续使用`schemaVersion=3`；`card_schema`及卡片引用字段均为可选，旧37篇可继续构建。
2. 平台包继续使用`schemaVersion=1`；四个卡片集合和CardCompleteness为可选新增字段，旧消费者忽略即可。
3. adapter由版本1升级为版本2，`packageVersion`继续包含adapter版本，防止旧缓存静默复用。
4. 未知可选字段忽略并报告；未知semantic按原kind/plain降级。
5. 只有删除/改义已有字段或把可选字段改成必填时才提升主schema。
6. 第一阶段不得修改现有页面消费者；fixture验证新旧包可以同时由adapter解释。

04描述语义化schema，而当前代码使用整数主版本。本任务不额外引入一套版本框架；先用“主版本整数 + adapter版本 + 可选字段”满足兼容，后续只有真实破坏性变化时再升级主版本。

## 10. 最小代码范围

第一阶段预期只涉及：

- `scripts/build-politics-knowledge.js`：增加`card_schema`严格解析、显式ID/callout/引用fixture和确定性校验；继续使用Node标准库。
- `miniprogram/services/knowledge-platform/politics-adapter.js`：映射可选卡片对象与完整度，旧源缺字段时输出空集合和false标记。
- 新增一个聚焦数据契约的validator，或在现有foundation validator中增加卡片fixture；不增加测试框架。
- 本任务单及后续构建报告。

第一阶段不涉及：

- 37篇正式Markdown、正式关系审核数据和生成产物。
- 页面WXML/JS/WXSS、路线、焦点、viewport和显示偏好。
- 常识与笔记适配器。
- i18n、Markdown第三方库、Obsidian插件或后台编辑系统。

## 11. 分阶段实施与门禁

### CB0：现状审计 — 已完成

- [x] 完整阅读04、S5.5B、政治profile、builder、adapter及相关validator。
- [x] 现有构建器self-test、toc-v2 review check-only、目录/关系/foundation门禁通过。
- [x] 明确显式语义、稳定ID、引用对象、完整度和schema差距。
- [x] 37篇正式Markdown未修改。

### CB1：构建器fixture能力

只使用内联字符串fixture或独立测试夹具，必须证明：

- [x] 无`card_schema`时现有37/42/643/39/37/37/0输出和旧ID不变。
- [x] `card_schema: 1`完整解析heading/paragraph/list/table/quote/callout/media并保留fallbackText与顺序。
- [x] 普通列表保持`semantic=plain`，不会自动变成hierarchy/sequence。
- [x] 9种已接受显式semantic（含reason）正确解析；未知semantic诚实降级。
- [x] 显式ID在正文改字和移动后保持，重复/缺失/非法ID阻塞严格文件。
- [x] atom、大卡、回忆投影、对照投影和四项完整度均由引用纯派生。
- [x] 跨块、错误端点、错误顺序和失效引用被准确诊断；块ID按pointId命名空间隔离跨知识引用。
- [x] 相同输入连续构建两次规范化结果和packageVersion相同。
- [x] source schema 3旧包与可选增强包均可由adapter读取。
- [x] 未修改37篇正式Markdown、政治candidate/review状态和常识/笔记行为。

CB1完成后先提交规格与fixture验证报告，由用户决定是否进入正式内容。

CB1自动证据（2026-08-29）：

- builder self-test覆盖七种基础kind、九种显式semantic、未知语义降级、ID改字/移动稳定、重复/缺失锚点、引用和迁移错误。
- foundation fixture在同一source schema 3包中同时验证legacy与严格知识，生成reason atom、精确RecallProjection、正式ContrastPair、CardCompleteness和BlockIdMigration。
- 现有toc-v2 review check-only及政治内容、关系、foundation、reading、candidate、learning、workbench门禁通过。
- `validate-politics-presentation.js`仍因既有页面fixture缺少`data.modes`失败；该页面不属于本任务且本轮未修改。

### CB2：37篇全量稳定锚点基线

CB1确认后才能开始：

- [x] 为37篇逐文件增加`card_schema: 1`和全部当前正文块显式ID。
- [x] 643个旧块均有唯一新ID或显式split/merge/removed迁移记录。
- [x] 不改正式文字、目录、关系、RecallItem文本、reviewState和发布数；卡片结构变化使内容`version`由1升至2。
- [x] 重建两次完全确定；旧锚点均能得到明确迁移结果。
- [x] 全部KnowledgeUnit仍可连续完整阅读，无内容丢失；37篇规范化正文哈希已进入迁移账本门禁。

### CB3：三篇代表样本

推荐样本固定为现有正式目录中的：

1. `politics-toc-v2-u024` 对立统一规律：定义、结论、层级、条件和边界丰富。
2. `politics-toc-v2-u025` 量变质变规律：顺序、状态、方法和判断条件明确。
3. `politics-toc-v2-u026` 否定之否定规律：发展过程、方向、道路及与前两者的正式对照完整。

选择这三篇是因为它们同时形成现有正式contrast三角，可在只处理三篇的情况下验证小卡、大卡、RecallProjection和ContrastPair，不因关系度数把它们声明为“核心知识”。

样本门禁：

- [x] 三篇均`sourceComplete=true`、`atomStructured=true`、`recallLinked=true`。
- [x] 三篇只标记真实存在的definition/conclusion/hierarchy/sequence/condition/contrast；未为凑样本覆盖伪造exception/evidence，全库九种角色均有真实实例。
- [x] 三篇正文关闭所有增强后顺序、文字和来源完整不变。
- [x] 三条既有contrast关系的两侧块、维度、边界和reason均有正式来源，生成3个ContrastPair。
- [x] 回忆揭晓能准确回到对应atom/原文；fixture覆盖split/move，正式迁移覆盖643条rename。
- [x] 仍为`review`，风险与发布资格不变。

### CB4：37篇逐篇闭环

三篇样本经内容和展现复核后，按正式`toc_order`逐篇处理剩余34篇。每篇一次完成：

```text
稳定ID
→ 显式atom语义
→ summary来源
→ RecallItem答案/易错锚点
→ 本篇关系块锚点
→ 构建报告与人工差异复核
```

不得先横向给37篇批量猜语义，再回头补来源。

CB4完成证据（2026-08-29）：剩余34篇均以显式逐块计划完成稳定ID、语义atom、summary、RecallItem和关系双端锚点；运行时不使用关键词推断。全库形成313个KnowledgeAtomRef，其中definition 73、conclusion 69、reason 6、hierarchy 79、sequence 12、condition 13、exception 4、contrast 45、evidence 12。

### CB5：全量卡片化完成门禁

- [x] 37/37 `sourceComplete=true`。
- [x] 37/37 `atomStructured=true`。
- [x] 37/37 `recallLinked=true`。
- [x] 现有5条正式contrast全部形成有效ContrastPair；7篇参与正式对照，其余知识保持`NO_FORMAL_CONTRAST`。
- [x] 39条关系全部保持原端点、类型和正式reason，并完成39/39双端块级来源。
- [x] 所有新旧块ID唯一，所有引用可达，643条既有块迁移及split/merge fixture均通过。
- [x] 11个风险页、37篇review、0 release保持不变。
- [x] review包确定性重建、adapter和相关平台门禁通过。
- [x] 构建报告列出完整度、迁移、原子、summary/Recall/关系锚点、正式Contrast、状态、风险和构建目标。

## 12. 自动验收场景

### CARD-BUILD-AC-001：普通结构不猜语义

给定普通有序列表和无序列表，严格解析只输出`kind=list, semantic=plain`，不生成atom。

### CARD-BUILD-AC-002：显式callout生成atom

给定有稳定ID的`[!definition]`，输出一个同源SemanticBlock和一个引用该块的definition atom，正文只保存一份。

### CARD-BUILD-AC-003：ID不随改字变化

给定相同显式ID但正文小修，运行时blockId和atomId保持；contentVersion和packageVersion正确变化。

### CARD-BUILD-AC-004：重复与失效引用阻塞

重复ID、跨知识summary引用、RecallItem不存在块或关系锚点指向错误端点时，严格构建失败或按review/release规则明确降级，不能静默修复。

### CARD-BUILD-AC-005：部分迁移

同一包包含一个严格文件和一个legacy文件时，严格文件生成小卡，legacy文件保持基础大卡；两者正文都完整可达。

### CARD-BUILD-AC-006：回忆精确回看

RecallProjection答案和易错点引用有效atom/块；缺引用的legacy RecallItem只返回完整知识卡，不能伪造位置。

### CARD-BUILD-AC-007：正式易混隔离

只有正式contrast关系且两侧块、维度、边界与来源全部有效时生成ContrastPair；标题相似fixture不生成用户对象。

### CARD-BUILD-AC-008：确定性与无Obsidian依赖

关闭Obsidian、没有插件/`.base/.canvas`时，同一输入连续构建两次得到相同规范化包、迁移和packageVersion。

### CARD-BUILD-AC-009：状态与模块隔离

卡片字段新增不改变政治candidate/review/release状态；常识和笔记仍为legacy且不读取政治卡片源字段。

## 13. 已确认决定

| ID | 推荐决定 | 状态 |
|---|---|---|
| CARD-BUILD-001 | 在现有builder/adapter上增加严格路径，不重写构建系统、不引入依赖 | Accepted — 2026-08-29 |
| CARD-BUILD-002 | 使用`card_schema: 1`按文件启用，legacy文件输出保持兼容 | Accepted — 2026-08-29 |
| CARD-BUILD-003 | 使用`<!-- kp:block-id=... -->`保存中立稳定ID，运行时继续按pointId命名空间化 | Accepted — 2026-08-29 |
| CARD-BUILD-004 | 语义只取已接受`[!semantic]`，普通结构一律plain | Accepted — 2026-08-29 |
| CARD-BUILD-005 | atom由显式语义块确定性派生，不维护第二份正文或手写atom清单 | Accepted — 2026-08-29 |
| CARD-BUILD-006 | summary/recall引用归当前Markdown，跨知识关系/ContrastPair证据归现有正式关系审核数据 | Accepted — 2026-08-29 |
| CARD-BUILD-007 | 以BlockIdMigration显式处理旧哈希ID及split/merge/removed | Accepted — 2026-08-29 |
| CARD-BUILD-008 | 新卡片集合保持平台schema 1可选兼容，adapter升级版本；真实破坏变化才升主schema | Accepted — 2026-08-29 |
| CARD-BUILD-009 | 第一阶段只做fixture；确认后依次执行643锚点、三篇样本、37篇闭环 | Accepted by task boundary — 2026-08-29 |
| CARD-BUILD-010 | 三篇样本使用u024/u025/u026，完整验证现有contrast三角 | Accepted — 2026-08-29 |
| CARD-BUILD-011 | 四项完整度独立派生，无正式contrast使用false + NO_FORMAL_CONTRAST | Accepted — 2026-08-29 |
| CARD-BUILD-012 | `reason`只由04白名单中的显式`[!reason]`产生，不得推断 | Accepted — 2026-08-29 |

## 14. Draft → Ready门禁

- [x] 当前builder、adapter、profile和validator能力已审计。
- [x] 稳定ID、显式语义、引用与迁移推荐方案已提出。
- [x] 部分迁移、确定性构建和schema兼容已提出。
- [x] CB1 fixture、CB2锚点、CB3三篇样本及CB4/CB5全量门禁已提出。
- [x] 不修改37篇正式内容和不依赖Obsidian的边界已冻结。
- [x] CARD-BUILD-001至CARD-BUILD-012获得用户确认。
- [x] 04已加入`reason`显式语义并确认BlockIdMigration字段归属。

本任务已完成CB0至CB5并达到`Verified`。卡片运行对象均由正式Markdown、正式关系账本及稳定引用确定性派生；未修改页面实现，也未改变政治candidate/review/release边界。
