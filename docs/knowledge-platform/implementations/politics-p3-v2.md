# 政治 P3 V2 当前实现与目标差距

> 状态：R5 OUT-J1–J5均为`UX-passed`；2026-10-03用户确认1–6项合并预览真机检查通过；R6已完成，S6未恢复。J2 v1为用户证伪历史
>
> R3规格审计日期：2026-08-30

## R0恢复后的当时事实（后续状态见S5.5总任务单）

- `rolloutStage=candidate`、37篇`review`、`release=0`均未改变；S6继续暂停。
- A/B/C/D门禁仍只证明横向工程连接。R5 HOME/J1新增纵向门禁、微信运行证据和用户手测，解决旧知识空间重复、目录归属不清和详情混在地图内的问题；OUT-J1已为`UX-passed`。J2 v1形成四站六锚点、同源详情往返和诚实收束，但用户手测证明真实触控与快速理解结果均失败，OUT-J2为`UX-failed`；J3至J5仍为`UX-failed`。
- A至D只作为横向检查镜头。用户已确认R1/R2；R3第7节与旧R4 J2门禁现冻结为v1历史，J3至J5规格不变。[J2 v2快速导读规格](./politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)和[首版完整内容脚本](./politics-p3-v2-s5-5-r5-j2-v2-content-script.md)现已落实为review QuickPrimer、同源投影、连续页面和RouteSession扩展；两项J2V2门禁默认模式2/2，未开放J3。

## 当前内容不完整性（独立于页面实现）

- 当前37篇只覆盖两篇审核中主线，没有与当前权威考试大纲完成全量对齐，不代表完整考公政治。
- 马原概述中虽提到科学社会主义，当前无其独立详细KnowledgeUnit；新时代思想主线和政治经济学也未完成目标大纲主题级完整性审计。
- 37篇均为`review/pending_final`，11个风险页未终审，`release=0`；时政也没有时效、过期和更新契约。
- 权威账本与后续任务见[政治profile—当前内容覆盖缺口与后续补充](../profiles/politics.md#当前内容覆盖缺口与后续补充)。`POL-CONTENT-COVERAGE-FOLLOWUP`延后执行，但是宣称完整范围或恢复S6/release前置条件；J2 v2可在边界明示的candidate内继续。

## R3冻结的目标实现差异

| 当前代码事实 | R3目标 | 进入R4时必须先失败 |
|---|---|---|
| 首页渲染regions、四个“开始”和stepCount | 搜索 + 一个状态主动作 + 其他目标 + 浏览全部知识 | HOME-hierarchy |
| map页承载overview/branch/full/recall | KnowledgeSpace只承载overview/branch/directory | J1-space |
| map、detail、guided-route各自渲染知识主体 | 一个KnowledgeCardSurface被detail/systematic/exam复用 | J1-renderer |
| selectPoint有关系时默认relations | 具体知识默认reading，关系只按意图进入情境槽 | J1-navigation |
| 完整目录用`directoryGroups`和“本篇知识”伪分组 | 42节点递归`directoryTree`，第二篇叶子直接归属文章 | J1-space |
| quick anchorNodeIds为空 | v1曾以六个Node锚点和structure-only降级修复工程连接；该呈现已被用户证伪 | J2-anchors（v1历史） |
| quick v1以四站结构与入口为主体 | v2现已消费经审核QuickPrimerDefinition，在一页连续交付内容、结构定位、两个例子和一次自我解释 | J2V2 2/2；待用户验证 |
| systematic把orientation作为独立完成步骤 | orientation为Card顶部提示，周期只含reading/recall | J3-cycle |
| confusion未完整绑定初答/复答和双侧证据 | 正式四阶段ContrastSurface | J4-contrast |
| fuzzy不进入补救队列，storage失败被吞 | fuzzy/missed补救、skipped独立、保存失败可见 | J5-remedy |

## 当前通用平台阶段（历史工程基线）

- S0工作区、数据、路由和现有模块自动基线已完成。
- S1政治只读adapter、按模块焦点状态和基础ViewModel投影已通过自动门禁及用户入口冒烟，状态为Verified。
- S2已由政治首页和知识地形页读取通用投影；常识和笔记仍未接入。
- S2至S4自动门禁与用户 UI 手测已通过；S5技术candidate与上一轮S5.5本地门禁已通过，但S5.5用户产品感知复测未通过，自动证据不得代替规格和用户确认。

## 当前已有

- 政治理论第四主导航 Tab。
- 37篇目录优先结构化知识。
- 42个正式目录节点。
- 39条带理由关系及反向索引。
- 643个稳定正文块及旧ID迁移记录，313个显式知识原子。
- 37张KnowledgeUnitCardProjection、37个精确RecallProjection、5组正式ContrastPair。
- schema v3 隔离校对包。
- 目录分组、详情、关系、搜索和回忆组件。
- 完整目录路径、来源页、风险页和待校对状态。
- 自动验证覆盖目录、构建、关系和展现基础行为。
- S5.5A至D规格归属、00至09/profile归并、陈旧基线扫描和文档链接门禁曾通过；`validate-politics-s55ab.js`与`validate-politics-s55cd.js`均只保留为横向工程基线，均不是当前产品验收证据。

## 恢复前工程台账（仅用于解释当前代码）

下表保留旧S2至S5判断以定位代码来源，不是当前产品状态。凡与R3冲突之处均视为待替换实现，只有总任务单Outcome可以授予当前结果状态。

| 目标 | 当前实现 | 历史判断 |
|---|---|---|
| 首页作为知识地形起点 | L0两大区域为主入口 | S2已Verified |
| 无焦点回忆 | 默认第一知识点入口已移除 | S2已Verified |
| 体系—关系—阅读—回忆链路 | 默认页面已改为同一KnowledgeSpace内的全览、分支、完整卡和回忆连续状态；ActivityStage仅保留内部状态 | 自动门禁通过；用户感知待测 |
| 真正语义缩放 | 同一页面按全览、分支、完整卡、回忆改变语义密度，目录按正式层级提供等价精确入口 | S5.5B实现及门禁通过；用户感知待测 |
| 知识地形 | 稳定两区底图、原地分支展开、37项等价目录和同一卡片表面已接入 | 自动门禁通过；真实小屏与返回感受待测 |
| 目录/地图可逆投影 | 同一ViewModel、同一ProjectionState | S2已Verified |
| 统一知识焦点 | ContextBar、KnowledgeSpace、卡片、Trail与RouteSession共用KnowledgeContext；默认页面无ActivityDock | 自动门禁通过；中断恢复待用户手测 |
| 探索轨迹 | 确认关系后入轨，支持A→B→C逐级返回 | S3A已实现，跨会话恢复延期 |
| 关系解释 | 定向、预览、一跳邻域和完整列表共用正式理由 | S3A已实现；39/39关系已具备双端正式块锚点 |
| 语义内容块 | canonical连续文章流、完整kind降级、显式semantic增强 | S3B已实现；政治上游已完成313个九类显式atom |
| 正文/关系/卡片双向定位 | 37张CardProjection、37个RecallProjection、39/39关系双端锚点和5组ContrastPair由同一卡片投影消费 | 自动门禁通过；用户返回感受待测 |
| 四类用户目标路线 | 四类开始、进行中、完成和恢复已消费同一Plan/Session及同源卡片投影 | D门禁12/12和微信四入口运行态通过；等待用户感知验证 |
| 空间连续性 | 受控投影共享既有焦点、活动、轨迹、四目标独立进度、显示偏好和viewport状态 | 自动恢复/失效门禁通过；跨设备恢复仍不在范围内 |
| 专注阅读和重点透镜 | 同一语义流内可逆切换，偏好调整不主动滚动 | S3B已Verified |
| 跨模块通用性 | 政治专用页面和模型 | 尚未证明 |

## 不得错误标记为完成

本节原判断是R3前的历史状态；当前OUT-J1–J5均为`UX-passed`，证据见S5.5总任务单。政治整体仍不是`verified`，S6需独立决定。

## 当前代码的角色

- 作为真实数据和通用组件验证夹具。
- 作为真实卡片、关系、回忆与四目标路线的candidate验证样本；只有当前门禁和微信运行态计入证据。
- 当前缺陷进入S5.5唯一结果账本，不再以“后续优化”绕过；R3确认后先做R4，再按J1至J5逐条推进，但不直接迁移常识和笔记。
- 不直接迁移常识和笔记模块。
- 每次替换保留回滚点，并由用户执行 UI 手测。

## 下一编码门禁

本节原“下一步J2手测”是历史门禁。当前J1–J5已按顺序完成用户验收；R6清理旧路线实现、复核唯一渲染器并更新候选证据。政治仍为candidate，S6未恢复。

## R5 HOME/J1当前实现证据

- 地形/目录中的具体知识一次点击直接打开同源完整知识卡，不再经过预览、额外层级页或关系前置页；搜索仍按命中意图直接落到完整内容、关系或回忆。
- `KnowledgeSpaceSurface`只承载overview、branch、directory；`KnowledgeCardSurface`由独立detail和路线消费。分支态保留整体，目录递归投影42个正式节点；关闭/返回恢复`expandedBranchId + scrollAnchorId + viewportToken`，页面栈仍由微信原生导航负责。
- 微信最新证据：项目读取确认d974工作树与AppID `wx32dafe910fadcf59`，MCP `compile`成功且代码/WXML错误均为0，总包2,960,839字节、主包1,155,715字节、政治分包146,388字节；首页、代表分支、独立详情及原生返回恢复均为0错误、0警告，并已成功生成[R5 HOME/J1预览二维码](./politics-s55-r5-home-j1-preview.png)。

当前政治内容仍为37篇 `review`、11个风险页、`release=0`。这不阻塞结构化加工和隔离展现联调，但任何展现完成状态都不得改变内容发布资格。

## R5 J2 v1历史工程证据与当前产品失败

- 快速了解由同一LearningRoutePlan/RouteSession固定为整体、第一篇、第二篇、收束四站；六个profile锚点按`0/2/4/0`分布并从同源NavigationNode/KnowledgeUnit投影。
- 路线页完整消费GoalGuide；锚点打开独立KnowledgeCard，原生返回仍在原站，查看动作不推进步骤。锚点不完整时统一降级为`structure-only`，不猜测核心知识。
- J2纵向门禁2/2、A/B 26/26、C/D 22/22通过。微信正确worktree编译代码/WXML错误0，完成四站及锚点往返，最终只报告4站、2主干、实际1/6锚点、0跳过，不含掌握度；[J2预览二维码](./politics-s55-r5-j2-preview.png)已生成。

完整v1工程复现见[R5 J2 v1实施证据](./politics-p3-v2-s5-5-r5-j2.md)。用户真实反馈为：页面可见，但所有待测动作无法点击，且目录导览不等于快速了解。内容先行的单页导读现已实现，详细证据见[J2 v2规格](./politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)与[完整脚本](./politics-p3-v2-s5-5-r5-j2-v2-content-script.md)。OUT-J2 v2只到`Implemented / awaiting user verification`，不进入J3。

## 历史S5.5D工程证据（不授予当前产品状态）

- 四类入口均先显示系统已经安排的具体任务和唯一开始/继续动作；调整范围、换一组和固定随机顺序保持次级。
- 快速了解固定为整体、两条正式主干和收束四站；系统学习直接进入完整正文并按“完整理解—同卡回忆—下一知识”连续推进，不恢复知识预览层。
- 易混使用5组正式ContrastPair及双方精确锚点完成判断、边界、依据和再辨；速记使用冻结RecallProjection卡组完成揭晓、自评、回看和逐卡结果。
- 推荐、调整、退出、恢复和完成继续只使用LearningRoutePlan、RouteSession、KnowledgeContext和共享卡片/空间投影。
- 微信CLI明确使用d974工作树：编译代码/WXML错误0，总包2,999,078字节、政治分包199,349字节；四入口和代表性完整周期运行态通过，CDP错误0。二维码仍被开发者工具内部`MaxCodeSize`异常阻断。
