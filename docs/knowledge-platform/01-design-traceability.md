# V2 设计思想追踪表

> 状态：Accepted baseline — 2026-08-28 审阅未发现遗漏；后续持续增量维护
>
> 目的：确保历史讨论中的好点子不会在分阶段实施时消失

## 使用规则

- 每个想法拥有稳定 ID。
- 每项只能标记为：`current`、`later`、`merged` 或 `rejected`。
- `current` 必须指向负责它的分规格和验收项。
- `later` 必须保留触发条件，不能只写“以后再做”。
- 编码任务必须列出落实的设计思想 ID。

## 核心焦点、链路和入口

| ID | 设计思想 | 层级 | 处置 | 负责文档 | 状态 |
|---|---|---|---|---|---|
| FOCUS-001 | 四种认知活动共享当前知识焦点 | CORE | current | 03、06 | STATE、WORK Accepted |
| FOCUS-002 | 切换镜头不丢焦点、路径和来源 | CORE | current | 03、06 | STATE、MAP-007、WORK-001 Accepted |
| FOCUS-003 | 从关联知识切换后可沿原路径返回 | CORE | current | 03 | STATE-004/007 Accepted |
| FOCUS-004 | 建立跨页面知识探索轨迹 | CORE | current | 03、06 | STATE、WORK-007 Accepted |
| FLOW-001 | 默认链路为体系—焦点—关系定向—阅读—回忆 | CORE | current | 02、06 | Accepted |
| FLOW-002 | 阅读后可重新进入深度关系探索形成循环 | CORE | current | 06 | WORK-006/007 Accepted |
| HOME-001 | 首页是认知起点，不是所有功能和知识的集合 | CORE | current | 02 | Accepted |
| HOME-002 | 无焦点时不得默认打开第一张速记卡 | CORE | current | 02、07 | Accepted |
| HOME-003 | 首页提供恢复上次焦点 | CORE | current | 02、03 | STATE-002/006/008 Accepted |
| ENTRY-001 | 搜索是带体系和关系上下文的知识入口 | CORE | current | 07 | LEARN-010/011 Accepted |
| ENTRY-002 | 支持“是什么、为什么、易混、条件、考试、回忆”问题入口 | OPTIONAL | current | 07 | LEARN-012 Accepted |

## 知识地形和关系

| ID | 设计思想 | 层级 | 处置 | 负责文档 | 状态 |
|---|---|---|---|---|---|
| TERRAIN-001 | 缩放改变知识粒度而不只是尺寸 | CORE | current | 05 | MAP-001/004/006 Accepted |
| TERRAIN-002 | 目录和地图是同一数据的可逆投影 | CORE | current | 05 | CORE、MAP-007 Accepted |
| TERRAIN-003 | 主干表示正式目录 | CORE | current | 05 | MAP-002/003 Accepted |
| TERRAIN-004 | 路径表示前置/后续 | CORE | current | 05 | MAP-002/010 Accepted |
| TERRAIN-005 | 桥梁表示跨分支相关 | CORE | current | 05 | MAP-002/010 Accepted |
| TERRAIN-006 | 警戒区域表示易混和边界 | CORE | current | 05、08 | MAP、VIS-003 Accepted |
| TERRAIN-007 | 锚点表示核心概念，岔路表示并列学习 | OPTIONAL | current | 05 | MAP-002/011 Accepted |
| TERRAIN-008 | 搜索结果可定位到地形 | CORE | current | 05、07 | MAP-009、LEARN-011 Accepted |
| TERRAIN-009 | 双指缩放只能是增强操作 | CORE | current | 05、08 | MAP-006、VIS-010 Accepted |
| LENS-001 | 同一知识图支持目录、前置、易混等镜头 | OPTIONAL | current | 05 | MAP-002/010 Accepted |
| LENS-002 | 时间镜头 | OPTIONAL | later | 05、04 | 有正式时间数据后 |
| LENS-003 | 人物/著作镜头 | OPTIONAL | later | 05、04 | 有显式实体数据后 |
| LENS-004 | 复习镜头 | OPTIONAL | later | 07 | P4 学习状态成熟后 |
| REL-001 | 局部关系只展示受控一层 | CORE | current | 06 | WORK-006 Accepted |
| REL-002 | 每条关系显示“为什么有关” | CORE | current | 06 | DATA、WORK Accepted |
| REL-003 | 正向关系维护、反向关系派生 | CORE | current | 04、06 | DATA-008 Accepted，政治已验证 |
| REL-004 | 点击相邻节点先预览再决定切换焦点 | CORE | current | 06 | WORK-007 Accepted |
| REL-005 | 正文概念与关系节点双向定位 | OPTIONAL | current | 04、06 | DATA、WORK-010 Accepted |

## 阅读和内容语义

| ID | 设计思想 | 层级 | 处置 | 负责文档 | 状态 |
|---|---|---|---|---|---|
| READ-001 | 知识工作台分速览、结构理解和完整证据 | CORE | current | 06、04 | DATA、WORK-008 Accepted |
| READ-002 | 完整内容是卡片、摘要和地图的事实母体 | CORE | current | 04 | Accepted |
| BLOCK-001 | 定义和核心结论拥有稳定视觉语法 | CORE | current | 04、08 | DATA、VIS-004 Accepted |
| BLOCK-002 | 条件、例外、范围和否定词可识别 | CORE | current | 04、08 | DATA、VIS-004 Accepted |
| BLOCK-003 | 易混内容支持结构化对照 | CORE | current | 04、06、08 | DATA、WORK-008、VIS-004 Accepted |
| BLOCK-004 | 方法论和步骤支持路径展示 | OPTIONAL | current | 04 | DATA-004/007 Accepted |
| BLOCK-005 | 人物、著作、会议、文件使用实体卡 | OPTIONAL | later | 04 | 数据契约成熟后 |
| BLOCK-006 | 时间变化使用时间线 | OPTIONAL | later | 04 | 有多条时间事实后 |
| BLOCK-007 | 来源证据可折叠并绑定内容块 | CORE | current | 04、06、08 | DATA、WORK、VIS-004 Accepted |
| READ-003 | 重点透镜区分结论、关键词、条件、否定和边界 | OPTIONAL | current | 04、08 | DATA、WORK-009、VIS-007 Accepted |
| READ-004 | 正文和地形/关系双向定位 | OPTIONAL | current | 04、06 | DATA、MAP、WORK Accepted |
| READ-005 | 专注阅读隐藏辅助控件 | OPTIONAL | current | 08 | WORK-009、VIS-002/007 Accepted |

## 回忆、路线和补救

| ID | 设计思想 | 层级 | 处置 | 负责文档 | 状态 |
|---|---|---|---|---|---|
| GOAL-001 | 快速了解是目标路线而非普通按钮 | CORE | current | 02、07 | Accepted |
| GOAL-002 | 系统学习按正式范围和前置关系编排 | CORE | current | 07 | LEARN-005/006 Accepted |
| GOAL-003 | 易混突破组合关系、对照、阅读和辨析 | CORE | current | 07 | LEARN-007 Accepted |
| GOAL-004 | 考前速记必须先有范围 | CORE | current | 07 | Accepted |
| RECALL-001 | 回忆项必须来自正式结构和内容锚点 | CORE | current | 04、07 | DATA-009 Accepted |
| RECALL-002 | 支持问答卡 | CORE | current | 07 | 政治已有基线；LEARN-013 Accepted |
| RECALL-003 | 支持关键词填空、顺序、连线、层级和时间线 | OPTIONAL | later | 07 | 对应语义块成熟后逐型启用 |
| RECALL-004 | 地图消隐恢复缺失节点 | OPTIONAL | current | 05、07 | MAP、LEARN-013 Accepted |
| RECALL-005 | 易混挑战作为结构化回忆变体 | OPTIONAL | current | 07 | LEARN-007/013 Accepted |
| RECALL-006 | 回忆失败可看一句话、体系位置或易混对比 | CORE | current | 07 | WORK-012、LEARN-014 Accepted |
| ROUTE-001 | 路线必须说明范围、依据、起点和结束条件 | CORE | current | 07 | LEARN-001/002 Accepted |
| ROUTE-002 | 路线生成器不能伪装 AI 掌握预测 | CORE | current | 07 | LEARN-009/015 Accepted |

## UI、可访问性、可信度和维护

| ID | 设计思想 | 层级 | 处置 | 负责文档 | 状态 |
|---|---|---|---|---|---|
| UI-001 | 用空间连续性表达认知连续性 | CORE | current | 03、08 | STATE、MAP、WORK、VIS-005 Accepted |
| UI-002 | 建立统一知识控制器 | CORE | current | 06、08 | WORK、VIS-002 Accepted |
| UI-003 | 固定颜色语义：体系绿、阅读蓝、易混橙、回忆紫、证据灰 | CORE | current | 08 | VIS-003 Accepted |
| UI-004 | 空间连续性规则先于装饰动画 | CORE | current | 03、08 | STATE、MAP、VIS-005/006 Accepted |
| UI-005 | 字号、行距、密度和重点程度分别控制 | OPTIONAL | current | 08 | VIS-007/008 Accepted |
| UI-006 | 支持低动画、无地图和窄屏降级 | CORE | current | 08、09 | VIS-006/009/010、SHIP-009/010 Accepted |
| CORRECT-001 | 纠错绑定知识 ID、版本、内容块、来源和入口 | CORE | current | 03、04、07 | STATE-010、DATA-003/012 Accepted |
| VERSION-001 | 知识版本时间机 | OPTIONAL | later | 04、07 | 出现两个正式内容版本后 |
| MISCONCEPTION-001 | 误区地图 | OPTIONAL | later | 05、07 | 误区数据达到可用覆盖后 |
| TRUST-001 | 可追溯来源和版本成为用户可感知的可信度 | CORE | current | 04、06、08 | DATA、WORK、VIS-003/004 Accepted |

## 文档治理和跨模块

| ID | 设计思想 | 层级 | 处置 | 负责文档 | 状态 |
|---|---|---|---|---|---|
| DOC-001 | 通用规则、模块配置和实施记录分层 | CORE | current | 00、09 | 已建立；SHIP Accepted |
| DOC-002 | Codex 主导决策议程，用户负责判断 | PROCESS | current | README、09 | 已建立；SHIP-010 Accepted |
| DOC-003 | 分规格达到 Ready 前不编码 | PROCESS | current | 00、09 | SHIP-003/004 Accepted |
| MODULE-001 | 笔记、常识、政治共享骨架但不强制同形 | CORE | current | 00、profiles | Accepted |
| MODULE-002 | 新模块主要通过数据和能力配置接入 | CORE | current | 04、09 | DATA-001/002/003/010、SHIP-005/015 Accepted |
| MODULE-003 | 模块升级不得无意改变其他模块行为 | CORE | current | 09 | SHIP-002/012/014/015 Accepted |

## 明确拒绝

| ID | 方案 | 处置 | 理由 |
|---|---|---|---|
| REJECT-001 | 无限 Canvas | rejected | 移动端不可控，难以提供等价导航 |
| REJECT-002 | 全库无边界自由力图 | rejected | 形成线团，关系含义不清 |
| REJECT-003 | 共享标签自动成为正式关系 | rejected | 缺少知识证据和人工确认 |
| REJECT-004 | 随机截断正文生成卡片 | rejected | 容易破坏条件和事实完整性 |
| REJECT-005 | 动画代替状态和空间结构 | rejected | 动画失效后产品逻辑随之消失 |
| REJECT-006 | 为单篇知识编写专用页面 | rejected | 无法维护和跨模块推广 |
| REJECT-007 | 无依据掌握度或 AI 预测 | rejected | 制造虚假精确和错误激励 |

## 基线结论与持续维护

2026-08-28 的首次全表审阅未发现遗漏，`current/later/rejected` 处置获得认可。本文不再作为当前阻塞决策，但继续承担覆盖检查：

1. 新想法必须先获得稳定 ID，再进入分规格和编码任务。
2. 分规格从 Draft 进入 Ready 时，更新对应状态和决策 ID。
3. 实施结束时逐项检查 `current` 是否有规格、代码和验收证据。
4. 延期项达到触发条件时，必须显式升为 `current`，不能在页面中暗中实现。
