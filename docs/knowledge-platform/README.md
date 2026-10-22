# 通用知识平台 V2 文档入口

> 文档状态：00–09已 Ready；通用V2规格与实施治理已完整封版
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
| 1 | [00 V2 总纲](./00-presentation-v2-master.md) | Ready | CORE-001 至 CORE-008 已接受 |
| 2 | [01 设计思想追踪表](./01-design-traceability.md) | Accepted baseline | 历史想法已完成首次审阅，后续持续增量维护 |
| 3 | [02 产品模型与信息架构](./02-product-model-and-information-architecture.md) | Ready | IA-001 至 IA-006 已接受 |
| 4 | [03 知识焦点与导航状态](./03-knowledge-focus-and-navigation-state.md) | Ready | STATE-001 至 STATE-010 已接受 |
| 5 | [04 内容与运行时契约](./04-content-and-runtime-contract.md) | Ready | DATA-001 至 DATA-012 已接受 |
| 6 | [05 知识地形与语义缩放](./05-knowledge-terrain-and-semantic-zoom.md) | Ready | MAP-001 至 MAP-012 已接受 |
| 7 | [06 焦点工作台与关系](./06-focus-workbench-and-relations.md) | Ready | WORK-001 至 WORK-013 已接受 |
| 8 | [07 目标路线、搜索与回忆](./07-goal-routes-search-and-recall.md) | Ready | LEARN-001 至 LEARN-015 已接受 |
| 9 | [08 空间 UI 与可访问性](./08-spatial-ui-and-accessibility.md) | Ready | VIS-001 至 VIS-015 已接受 |
| 10 | [09 验收与推广](./09-verification-and-rollout.md) | Ready | SHIP-001 至 SHIP-015 已接受 |

模块文件：

- [政治理论能力配置](./profiles/politics.md)
- [常识能力配置](./profiles/common-sense.md)
- [笔记能力配置](./profiles/notes.md)
- [政治 P3 V2 当前实现与差距](./implementations/politics-p3-v2.md)
- [政治 P3 V2 S0实施基线](./implementations/politics-p3-v2-s0-baseline.md)
- [政治 P3 V2 S1平台基础任务单](./implementations/politics-p3-v2-s1-foundation.md)

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

CORE、IA、STATE、DATA、MAP、WORK、LEARN、VIS与SHIP全部决策已接受，通用V2规格整体达到编码门禁。

S0基线与S1平台基础已经完成自动验证和用户入口冒烟，S1状态为Verified，政治当前为 `rolloutStage=foundation`。下一实施入口为S2 `foundation→terrain`，只落地政治首页、L0–L3知识地形和目录等价闭环。常识和笔记继续保持 `legacy`。

## 编码门禁

任何新的展现重构在对应规格达到 `Ready` 前不得开始。编码任务必须引用规格决策 ID、设计思想 ID 和验收场景；遇到未定义行为时先回到规格补充决策，不能在页面代码中临时决定产品规则。
