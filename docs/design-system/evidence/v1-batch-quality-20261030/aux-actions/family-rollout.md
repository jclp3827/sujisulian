# 组件族治理与集成准备

## 工作机制

2026-10-30 用户确认的“一处发现、成组识别和验证、用户确认后批准、新开发优先复用 approved”已写入本候选的 `AGENTS.md` 与 `docs/design-system/README.md`；`PAT-ACTIONS` 增加学习设置、返回学习检索词及 draft 限定。该治理增量只约束包含它的工作树；共同治理分支和 main 均尚未接入。

## 消费者和角色边界

基于当前 WXML 中组件类、事件、设置文案和页面模式核对；动态运行时路径仍需实际交互确认。原始实测、夹具与限制见 [390 宽验收回执](report.md)。

| 页面与情境 | 设置入口 / 返回动作 | 处理 |
| --- | --- | --- |
| note/practice：application 及同路由其他 kind | `handleSettings` / `handleCloseSettings` | 标题入口和设置页返回使用候选共享样式；业务保持独立 |
| note/memory：basic、method、exam | `handleSettings` / `handleCloseSettings` | 标题和设置页返回使用共享样式；全部卡片保留文本层级 |
| common-sense/learning：daily、guide、exam，以及同路由其他学习模式 | `handleMenu` | 标题入口与设置页返回使用共享样式；各模式原任务与设置时机不变 |
| politics/practice：qa | `handleSettingsTap` | 标题入口和内联设置返回使用共享样式，仍由原事件切换 |
| politics/practice：daily | `handleSettingsTap` 跳转“一问一答” | 同级视觉，但属于模式导航，保留独立语义 |
| common-sense/learning：完成页操作组 | `handleMenu` 的学习设置 | 随完成页主次按钮组织，非标题区辅助入口，保留现有样式 |
| note/practice：完成、错误和超范围底栏 | `handleSettings` 调整范围 | 属于底栏任务操作，保留按钮组样式 |
| politics/route/units：返回学习首页 | 返回首页动作 | 非设置页返回当前任务，保持原业务及底栏 |
| reading-controls 及阅读正文 | 阅读字号、行距 | 阅读专用操作，未纳入本族 |

在 390 宽，六个主要入口及常识设置返回、笔记记忆返回、常识 exam 和政治 daily 的实测均为 78×44 CSS px。候选参数、实现与图片均未获产品批准。375/428、真实点击和设备恢复尚未验证。

## 接入判断（只读快照）

- 共同治理分支 `codex/design-system-common-baseline-ds2.3` 为 `0bf98bc373b34ae179b201f2567c78ee815e9184`，是本候选祖先；已有 DS-2.3 和 R1-D 批准契约无需重复引入。当前新增工作机制可作为精确治理变更准备接入，仍须目标分支适配、授权引用与验证；视觉候选不可随之冒称已批准。
- main 为 `7332cbb3a774501edbd685c19594927194754afd`，无 `docs/design-system/README.md` 和 `scripts/validate-design-system.js`。本候选相对 main 共同祖先 `c935e7de13b271d36b543dbaf32ee87346a577d0` 各自改变 918 与 353 个文件，重叠 3 个：`AGENTS.md`、`docs/knowledge-platform/README.md`、`miniprogram/subpackages/common-sense/learning/index.js`。只读 merge-tree 显示 AGENTS 两边新增冲突；不得整体合并候选历史当作纯治理变更。
- 独立题库 B5 树 `80b0ac59` 在 common/note 页面及学习服务有未提交修改；这些内容未复制。主线与并行任务后续变化需要重新核验。
- 完整组件实现要先按当前 main 与共同治理源逐项匹配源码、消费者及视觉和交互证据，拆分批准产品契约、draft 实现和新工作机制；必要时建立只包含精确范围的隔离接入提交。DS 激活仍需真实授权记录、Git 引用和祖先关系，不可复制文件伪称正式接入。
- 共同治理接入、产品实现接入和 main 最终合并是不同授权及验收门。本轮不修改上述正式分支；视觉批准、真实交互、真实设备及跨分支冲突校验保持待办。
