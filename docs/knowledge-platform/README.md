# 通用知识平台 V2 文档入口

> 当前恢复状态：政治R5 OUT-J1–J5均为`UX-passed`；2026-10-03用户确认最新合并预览的1–6项真机检查全部通过，四目标进度独立；R6已完成。政治保持candidate/review/0发布，S6未恢复
>
> 内容覆盖状态：`partial / scope-unverified`。当前两篇源料的37篇已于2026-10-04完成本轮内容终审，标记为“现阶段内容完成”；这不代表完整考公政治/政治理论范围，也不改变37篇`review`与`release=0`。见[逐篇终审记录](./implementations/politics-p3-v2-content-final-review-20261004.md)及[政治profile](./profiles/politics.md#当前内容覆盖缺口与后续补充)。

> 知识点正文修复：2026-10-04 的新改动与验证见[正文 V2 修复清单](./implementations/politics-knowledge-body-v2-repair-20261004.md)。既有路线 `UX-passed` 属于此前候选；本轮正文编排的 320px、大字号、无障碍及首次进入体验已由用户在同构建验收通过。
>
> 适用模块：笔记、常识、政治理论及后续新增知识模块

## 为什么建立这一套文档

现有政治 V2 已验证目录、正文、关系、搜索和回忆组件能够运行，但早期文档混合了产品目标、Demo 实现和完成记录，导致“功能存在”被误认为“产品目标已经实现”。本目录把通用平台规则、模块差异和当前实现证据分开管理。

## 文档权威顺序

发生冲突时按以下顺序处理，不允许由代码或低层文档静默覆盖上层决策：

```text
通用 V2 总纲
  > 通用分规格
    > 模块配置
      > 模块实施记录
        > 代码与测试证据
```

若当前代码与上层规格不同，应记录为“实现差距”；只有完成产品决策后才能修改上层规格。

## 阅读和决策顺序

| 顺序 | 文档 | 当前状态 | 本轮需要决定什么 |
|---|---|---|---|
| 1 | [00 V2 总纲](./00-presentation-v2-master.md) | R3 specified | 数据原则保留；共享连续性与页面分工已归并 |
| 2 | [01 设计思想追踪表](./01-design-traceability.md) | R3 specified | REC-P0裁决已确认，产品结果仍由Outcome追踪 |
| 3 | [02 产品模型与信息架构](./02-product-model-and-information-architecture.md) | R3 specified | 首页与KnowledgeSpace/KnowledgeCard物理分工已冻结 |
| 4 | [03 知识焦点与导航状态](./03-knowledge-focus-and-navigation-state.md) | R3 specified | 原生页面栈与语义恢复责任已冻结 |
| 5 | [04 内容与运行时契约](./04-content-and-runtime-contract.md) | Ready | DATA-001至DATA-015及卡片引用契约已接受 |
| 6 | [05 知识地形与语义缩放](./05-knowledge-terrain-and-semantic-zoom.md) | R3 specified | 稳定结构图、鱼眼分支和递归目录已冻结 |
| 7 | [06 焦点工作台与关系](./06-focus-workbench-and-relations.md) | R3 specified | 独立Card、唯一渲染器、小卡语法和情境槽已冻结 |
| 8 | [07 目标路线、搜索与回忆](./07-goal-routes-search-and-recall.md) | R3 specified | 四目标主体、搜索直接落点和补救已冻结 |
| 9 | [08 空间 UI 与可访问性](./08-spatial-ui-and-accessibility.md) | R3 specified | 320px线框与共享组件边界已冻结 |
| 10 | [09 验收与推广](./09-verification-and-rollout.md) | R5 J1–J5真机通过；R6已完成 | 内容覆盖前置仍未满足；S6保持暂停，恢复需单独决定 |

模块文件：

- [政治理论能力配置](./profiles/politics.md)
- [常识能力配置](./profiles/common-sense.md)
- [笔记能力配置](./profiles/notes.md)
- [政治 P3 V2 当前实现与差距](./implementations/politics-p3-v2.md)
- [政治 P3 V2 S0实施基线](./implementations/politics-p3-v2-s0-baseline.md)
- [政治 P3 V2 S1平台基础任务单](./implementations/politics-p3-v2-s1-foundation.md)
- [政治 P3 V2 S2首页与知识地形任务单](./implementations/politics-p3-v2-s2-terrain.md)
- [政治 P3 V2 S3A焦点工作台与关系任务单](./implementations/politics-p3-v2-s3a-workbench.md)
- [政治 P3 V2 S3B语义阅读与锚点闭环任务单](./implementations/politics-p3-v2-s3b-semantic-reading.md)
- [政治 P3 V2 S4目标路线、搜索与主动回忆任务单](./implementations/politics-p3-v2-s4-learning.md)
- [政治 P3 V2 S5交互、视觉、可访问性与性能收口任务单](./implementations/politics-p3-v2-s5-candidate.md)
- [政治 P3 V2 S5.5产品表层收敛任务单](./implementations/politics-p3-v2-s5-5-product-surface.md)
- [政治 P3 V2 S5.5A主流程与动作决策](./implementations/politics-p3-v2-s5-5a-primary-flow-and-action-decisions.md)（Reference lens / engineering baseline only）
- [政治 P3 V2 S5.5B知识空间与知识卡片展现](./implementations/politics-p3-v2-s5-5b-knowledge-space-and-cards.md)（Reference lens / engineering baseline only）
- [政治 P3 V2 S5.5C用户语言与情境工具](./implementations/politics-p3-v2-s5-5c-language-and-context-tools.md)（Reference lens / engineering baseline only）
- [政治 P3 V2 S5.5D四类引导式学习目标](./implementations/politics-p3-v2-s5-5d-guided-learning-goals.md)（Reference lens / engineering baseline only）
- [政治 P3 V2 S5.5规格治理与上游归并](./implementations/politics-p3-v2-s5-5-governance-convergence.md)（R0事实归一完成；旧“冲突全部关闭”结论已撤回）
- [政治 P3 V2 S5.5 R3可实现产品规格](./implementations/politics-p3-v2-s5-5-r3-implementable-spec.md)（R3 confirmed / R4 input frozen）
- [政治 P3 V2 S5.5 R4纵向门禁与红基线](./implementations/politics-p3-v2-s5-5-r4-vertical-gates.md)（历史红基线；R5继续消费）
- [政治 P3 V2 S5.5 R5 HOME/J1实施证据](./implementations/politics-p3-v2-s5-5-r5-home-j1.md)（UX-passed）
- [政治 P3 V2 S5.5 R5 J2 v1快速了解实施证据](./implementations/politics-p3-v2-s5-5-r5-j2.md)（Historical engineering-passed / UX-failed）
- [政治 P3 V2 S5.5 R5 J2 v2快速导读规格](./implementations/politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)（UX-passed；2026-09-08用户反馈测试通过）
- [政治 P3 V2 S5.5 R5 J2 v2首版完整内容脚本](./implementations/politics-p3-v2-s5-5-r5-j2-v2-content-script.md)（Implemented as review-only artifact）
- [政治 P3 V2 S5.5 R5 J3系统学习证据](./implementations/politics-p3-v2-s5-5-r5-j3.md)（主链路UX-passed）
- [政治 P3 V2 S5.5 R5 J4易混突破证据](./implementations/politics-p3-v2-s5-5-r5-j4.md)（UX-passed）
- [政治 P3 V2 S5.5 R5 J5考前速记证据](./implementations/politics-p3-v2-s5-5-r5-j5.md)（UX-passed）
- [政治 P3 V2 S5.5 R6收口证据](./implementations/politics-p3-v2-s5-5-r6-closeout.md)（完成；S6未恢复）
- [政治 P3 V2内容卡片化与构建器升级](./implementations/politics-p3-v2-content-cardization-builder.md)（Verified，CB0至CB5完成）
- [政治知识点正文 V2 修复清单与验证](./implementations/politics-knowledge-body-v2-repair-20261004.md)（代码、模拟器及同构建用户阅读体验已验证）
- [政治知识正文页产品编排实施文档](./implementations/politics-knowledge-body-product-orchestration-v1.md)（本轮 G1/G2/G3 需求与边界）
- [政治知识正文页产品编排实施记录](./implementations/politics-knowledge-body-product-orchestration-implementation-20261004.md)（B0–B3；本轮正文编排 UX_PASSED）
- [政治 P3 V2 Candidate说明与S6手测记录](./implementations/politics-p3-v2-candidate.md)

## 决策协作方式

Codex 负责按依赖顺序提出完整决策稿、推荐方案、放弃方案、影响、边界和验收；用户负责判断产品取舍与执行 UI 手测。用户无需主动设计下一轮问题。

每份分规格依次经过：

```text
Skeleton → Draft → Discussed → Ready → Implementing → Implemented → Verified
```

- `Skeleton`：只确定责任、依赖和需要回答的问题。
- `Draft`：已有推荐方案，可进入产品判断。
- `Discussed`：主要方向已确认，仍有阻塞问题。
- `Ready`：状态、数据、边界、降级和验收均明确，允许编码。
- `Implemented`：代码完成，但不等于 UI 已验收。
- `Verified`：自动验证及规定的人工验收均通过。

## 当前审阅入口

R0事实归一已撤回“A/B/C后续优化不阻塞、D只待用户验证”的当前状态。既有代码、卡片数据、自动门禁和CLI记录全部保留，但只作为工程资产和缺陷复现基线。R1已把知识地形、单一物理页面、固定四目标、单一主动作和“适合你”的推荐降级为待验证假设；R2已在S5.5总任务单建立J1–J5黄金旅程及唯一产品结果台账。

用户已确认五项P0裁决与J1–J5状态合同，R3冻结可实现规格，R4建立纵向门禁。J2 v1的旧绿灯和运行记录只保留为被用户证伪的工程历史；J2 v2于2026-09-08获用户手测通过。2026-10-03用户确认合并预览1–6项真机检查全部通过，连同此前J1与J3验收，OUT-J1–J5均为`UX-passed`。R6清理旧路线实现并回写证据；政治仍为`rolloutStage=candidate`、37篇`review`、发布数0，S6未恢复；常识和笔记保持`legacy`。

## 编码门禁

R4纵向门禁能识别工程缺口，但真实触控与学习体验仍由用户手测判定。R5已按HOME/J1→J2→J3→J4→J5完成并获用户验收；R6负责删除死代码、确认唯一渲染器和绑定候选证据。政治页面不因此自动成为其他模块的迁移模板，也不自动恢复S6。
