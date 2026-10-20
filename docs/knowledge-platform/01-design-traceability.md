# V2 设计思想追踪表

> 状态：通用设计追踪保持R3 specified；政治R5样本J1–J5已获用户真机验收，结果以S5.5 Outcome账本为准，R6已完成
>
> 目的：确保历史讨论中的好点子不会在分阶段实施时消失

> 2026-08-30恢复结论：此前“已归并/Ready”只能证明思想被文档接住，不能证明思想正确或产品达到目标。A至D改为横向检查镜头；端到端产品状态由[S5.5总任务单的Outcome台账](./implementations/politics-p3-v2-s5-5-product-surface.md)唯一持有。
>
> 2026-08-31 J2恢复结论：旧GOAL-001被实现成“四站、六锚点结构导览”，自动与CLI证据不能抵消真实用户判定。OUT-J2现为`UX-failed`；旧R3/J2定义保留为历史，[内容先行的J2 v2规格](./implementations/politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)与[首版内容脚本](./implementations/politics-p3-v2-s5-5-r5-j2-v2-content-script.md)已确认并成为实施输入。

## 使用规则

- 每个想法拥有稳定 ID。
- 每项只能标记为：`current`、`later`、`merged` 或 `rejected`。
- `current` 必须指向负责它的分规格和验收项。
- `later` 必须保留触发条件，不能只写“以后再做”。
- 编码任务必须列出落实的设计思想 ID。

### 产品结果追踪补充规则

- `current`只表示该思想仍被保留或需要验证，不表示产品已经成立。
- 每个进入实施的CORE思想必须关联一个`Outcome ID`、用户问题、可证伪假设、Given/When/Then旅程、实现锚点、自动证据和用户证据。
- 自动门禁通过最多把结果标为`implemented`；只有真实用户旅程通过才可标为`UX-passed`。
- `follow-up optimization`不再是合法结果状态；已知核心失败必须记为`UX-failed`，非核心延期记为`waived-debt`并写明触发条件。
- A至D中的验收ID必须通过Outcome反向关联，不能只证明验收ID出现在validator的`covers`数组。

### R1设计有效性分组

| 分组 | 当前裁决 | 代表思想 | R2验证去向 |
|---|---|---|---|
| 事实与身份基础 | 保留 | FOCUS-001至004、READ-002、RECALL-001、CORRECT-001、MODULE-001至003 | J1至J5共同前提 |
| 产品形态假设 | R3已规格化；R4门禁已确认当前实现失败，待R5/用户验证 | FLOW-001、HOME-001、TERRAIN-001至007、UI-001至002 | J1自由探索与共享知识表面 |
| 学习结果假设 | GOAL-001及J2 v2已由用户验收通过；J3主链路及J4/J5合并体验于2026-10-03获真机确认，四目标进度独立；内容覆盖和掌握度不由此推定 | GOAL-001至004、ROUTE-001至002 | J2至J5 |
| 交互冲突 | 已裁决，待实现 | ENTRY-001、REL-004、UI-002及其返回/搜索/卡片/工具规则 | REC-P0-001至005 |

## 核心焦点、链路和入口

| ID | 设计思想 | 层级 | 处置 | 负责文档 | 状态 |
|---|---|---|---|---|---|
| FOCUS-001 | 四种认知活动共享当前知识焦点 | CORE | current | 03、06 | STATE、WORK Accepted |
| FOCUS-002 | 切换镜头不丢焦点、路径和来源 | CORE | current | 03、06 | STATE、MAP-007、WORK-001 Accepted |
| FOCUS-003 | 从关联知识切换后可沿原路径返回 | CORE | current | 03 | STATE-004/007 Accepted |
| FOCUS-004 | 建立跨页面知识探索轨迹 | CORE | current | 03、06 | STATE、WORK-007 Accepted |
| FLOW-001 | 顶层按自由探索/系统引导目标分流；KnowledgeSpace与KnowledgeCard按物理页面分工，但共享焦点、连续性和唯一渲染契约 | CORE | current | 00、02、06、07、R3 | REC-P0-001/002 confirmed；OUT-J1 specified |
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
| REL-004 | 在卡内先展开关系理由；只有选择目标才提交焦点并用原生页面栈打开目标卡 | CORE | current | 06、R3 | REC-P0-002/005 confirmed；OUT-J1 specified |
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
| GOAL-001 | 快速了解是系统提供的内容先行连续导读：用经审核的解释、正式连接点和代表例帮助新手形成第一张认知图，结构只作持续定位；不是目录游、自由浏览或长文缩短版 | CORE | current | 02、07、OUT-J2、J2 v2 | 2026-09-08 用户反馈J2 v2测试通过 / OUT-J2 UX-passed |
| GOAL-002 | 系统学习由系统先推荐正式范围并按前置与正式顺序持续引导 | CORE | current | 07 | LEARN-005/006/016 Accepted |
| GOAL-003 | 易混突破由系统推荐正式ContrastPair并引导先判断、核对依据和再辨 | CORE | current | 04、07 | DATA-013、LEARN-007/016 Accepted |
| GOAL-004 | 考前速记由系统推荐或恢复明确范围的冻结卡组，范围调整为次级 | CORE | current | 07 | LEARN-008/016 Accepted |
| RECALL-001 | 回忆项必须来自正式结构和内容锚点 | CORE | current | 04、07 | DATA-009 Accepted |
| RECALL-002 | 支持问答卡 | CORE | current | 07 | 政治已有基线；LEARN-013 Accepted |
| RECALL-003 | 支持关键词填空、顺序、连线、层级和时间线 | OPTIONAL | later | 07 | 对应语义块成熟后逐型启用 |
| RECALL-004 | 地图消隐恢复缺失节点 | OPTIONAL | current | 05、07 | MAP、LEARN-013 Accepted |
| RECALL-005 | 易混挑战作为结构化回忆变体 | OPTIONAL | current | 07 | LEARN-007/013 Accepted |
| RECALL-006 | 回忆失败可看一句话、体系位置或易混对比 | CORE | current | 07 | WORK-012、LEARN-014 Accepted |
| ROUTE-001 | 路线必须说明范围、依据、起点和结束条件 | CORE | current | 07 | LEARN-001/002 Accepted |
| ROUTE-002 | 路线生成器不能伪装 AI 掌握预测 | CORE | current | 07 | LEARN-009/015 Accepted |

GOAL-001的旧“四站、六锚点结构导览”解释及其`implemented`记录只由[R3第7节](./implementations/politics-p3-v2-s5-5-r3-implementable-spec.md)和[R5 J2实施证据](./implementations/politics-p3-v2-s5-5-r5-j2.md)作为v1历史持有，不再是当前产品方向，也不授权进入J3。

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

2026-08-28 的首次全表审阅只证明未发现思想遗漏；2026-08-30的产品审计证明它不能单独证明思想正确或实现成立。本文继续承担思想覆盖检查，但不再承担产品完成判断：

1. 新想法必须先获得稳定 ID，再进入分规格和编码任务。
2. 分规格从 Draft 进入 Ready 时，更新对应状态和决策 ID。
3. 实施结束时逐项检查 `current` 是否有规格、代码和验收证据。
4. 延期项达到触发条件时，必须显式升为 `current`，不能在页面中暗中实现。
