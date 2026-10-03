# 政治 P3 V2 Candidate 说明

> 候选日期：2026-08-28
>
> 展现阶段：`candidate`；内容阶段仍为`review`

> 当前状态：R5 OUT-J1–J5均为`UX-passed`；2026-10-03用户确认合并预览真机检查1–6全部通过。R6已清理旧路线实现并通过回归与微信编译/预览；政治仍为candidate、37篇review、release=0，S6未恢复。J2 v1失败记录仅作历史。

> 历史记录（非当前状态）：2026-08-29源材料、A、B审计及门禁完成后依次实施A/B；用户于2026-08-30曾将A/B/C剩余问题转后续优化并授权实施D。该状态已被R0真实结果审计撤回。

> 历史记录（非当前状态）：2026-08-30 A取消具体知识与搜索预览抽屉，详情改为单份正文、同源关键筛选和下部关系/回忆入口；自动门禁与微信CLI曾重新通过。

> 历史记录（非当前状态）：2026-08-30页面级返回改用微信左上角真实页面栈；搜索结果与最近学习入口完成降密度。当前一卡一题是源材料缺口，未在页面层伪造多题。

> 历史记录（非当前状态）：2026-08-30取消知识卡预览，地形/目录知识入口直达完整详情；分支态收敛为紧凑区域栏，完整目录按正式“篇—章—知识”投影。其后用户真实复测仍判定整体产品未达预期。

## 候选身份

- Git基线：`72e0d76659dbfe1ed6499623069d19cd34ddb932`。
- 当前候选尚位于保留用户修改的工作树；提前实现指纹`c0adacfffa8e8b6d535084ebbe660c1297b2412266239a5613f339ee66c29d98`仅用于识别现状，不表示本轮已完成或已验收。
- 政治卡片化review包：`kp1-a4-review-95418f9f02c8`，schema v3；包含1份8段review QuickPrimer及ContentCoverageStatement，内容发布资格仍未改变。
- 数据：42导航节点、37知识单元、643稳定正文块、313显式atom、39关系、37回忆投影、5组ContrastPair、0可发布。
- 微信工具历史事实：明确打开d974工作树，CLI `compile`成功且代码/WXML错误均为0，总包2,967,045字节、主包1,158,114字节、政治分包150,195字节；J2 v1四站与`0/2/4/0`锚点运行通过，`n006 → u003`独立详情原生返回后仍停在原站，最终只报告实际1/6锚点且无掌握度字段。[R5 J2 v1预览二维码](./politics-s55-r5-j2-preview.png)仍保留。该证据不证明真实按钮可用或快速了解结果成立，旧`MaxCodeSize`异常也不是本次UX失败的原因。

指纹覆盖`app.json`、主题、知识平台服务及政治首页/地形/详情/搜索/路线文件；工作树包含用户既有未提交成果，因此本轮未擅自创建混合提交。

### 历史R0相关范围指纹

为避免“同一门禁结果后来对应了不同工作树”的证据漂移，R0将当前权威规格、政治能力/实现、真实review运行包、活动页面/服务和相关builder/validator绑定为一份64文件清单。聚合算法为：按下列顺序对每个文件执行`shasum -a 256`，再对完整输出执行一次`shasum -a 256`。

- 聚合SHA-256：`58b26a99e246f2f6322f878fa0ca8c37764b5204181128788b5ac7c0c6baa649`
- 生成日期：2026-08-30；工作树：`/Users/jmac/.codex/worktrees/d974/miniprogram-1`
- 本candidate文件因持有该哈希而不纳入自身指纹；任何R3/R4/R5范围文件变化都必须生成新指纹，不得沿用本值。

```text
docs/knowledge-platform/README.md
docs/knowledge-platform/00-presentation-v2-master.md
docs/knowledge-platform/01-design-traceability.md
docs/knowledge-platform/02-product-model-and-information-architecture.md
docs/knowledge-platform/03-knowledge-focus-and-navigation-state.md
docs/knowledge-platform/04-content-and-runtime-contract.md
docs/knowledge-platform/05-knowledge-terrain-and-semantic-zoom.md
docs/knowledge-platform/06-focus-workbench-and-relations.md
docs/knowledge-platform/07-goal-routes-search-and-recall.md
docs/knowledge-platform/08-spatial-ui-and-accessibility.md
docs/knowledge-platform/09-verification-and-rollout.md
docs/knowledge-platform/profiles/politics.md
docs/knowledge-platform/implementations/politics-p3-v2.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-product-surface.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-governance-convergence.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5a-primary-flow-and-action-decisions.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5b-knowledge-space-and-cards.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5c-language-and-context-tools.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5d-guided-learning-goals.md
docs/knowledge-platform/implementations/politics-p3-v2-content-cardization-builder.md
miniprogram/app.json
miniprogram/app.wxss
miniprogram/styles/theme.wxss
miniprogram/models/politics-p3-v2-preview.js
miniprogram/services/knowledge-platform/context.js
miniprogram/services/knowledge-platform/display-preferences.js
miniprogram/services/knowledge-platform/index.js
miniprogram/services/knowledge-platform/learning.js
miniprogram/services/knowledge-platform/politics-adapter.js
miniprogram/services/knowledge-platform/politics-runtime.js
miniprogram/services/knowledge-platform/projectors.js
miniprogram/services/knowledge-platform/rollout.js
miniprogram/services/knowledge-platform/surface-language.js
miniprogram/pages/politics/index.js
miniprogram/pages/politics/index.json
miniprogram/pages/politics/index.wxml
miniprogram/pages/politics/index.wxss
miniprogram/subpackages/politics/detail/index.js
miniprogram/subpackages/politics/detail/index.json
miniprogram/subpackages/politics/detail/index.wxml
miniprogram/subpackages/politics/detail/index.wxss
miniprogram/subpackages/politics/map/index.js
miniprogram/subpackages/politics/map/index.json
miniprogram/subpackages/politics/map/index.wxml
miniprogram/subpackages/politics/map/index.wxss
miniprogram/subpackages/politics/route/guided-route.js
miniprogram/subpackages/politics/route/guided-route.wxml
miniprogram/subpackages/politics/route/guided-route.wxss
miniprogram/subpackages/politics/route/index.js
miniprogram/subpackages/politics/route/index.json
miniprogram/subpackages/politics/route/index.wxml
miniprogram/subpackages/politics/route/index.wxss
miniprogram/subpackages/politics/search/index.js
miniprogram/subpackages/politics/search/index.json
miniprogram/subpackages/politics/search/index.wxml
miniprogram/subpackages/politics/search/index.wxss
scripts/build-politics-knowledge.js
scripts/validate-knowledge-platform-candidate.js
scripts/validate-politics-content-staging.js
scripts/validate-politics-presentation.js
scripts/validate-politics-s55ab.js
scripts/validate-politics-s55cd.js
scripts/validate-politics-toc-v2-content.js
scripts/validate-politics-toc-v2-relations.js
```

### R3规格范围指纹

R3范围使用上列64个文件的相同顺序，并在末尾追加：

```text
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r3-implementable-spec.md
```

- 文件数：65。
- 聚合SHA-256：`4bba614585d130c7f881b004873162a4cb2176606adb6501ccd53220bd07273f`。
- 算法与R0相同：逐文件SHA-256标准输出按清单顺序连接后再次执行SHA-256。
- 本指纹只绑定R3规格与R3开始前的当前代码；没有运行validator或微信CLI，不构成R4/R5证据。candidate文件因持有指纹继续排除在自身清单外。

### R4红基线范围指纹

R4范围使用上列R3的65个文件相同顺序，并在末尾追加：

```text
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r4-vertical-gates.md
scripts/validate-politics-s55-r4.js
```

- 文件数：67。
- 聚合SHA-256：`8c72fd23741b5933b91a3eb07bb3ae54a52f23ae8dfc3602c74352c2ade0d361`。
- 生成日期：2026-08-30；工作树：`/Users/jmac/.codex/worktrees/d974/miniprogram-1`。
- 本candidate文件继续排除在自身指纹外；该指纹绑定R4规格、门禁及门禁运行时读取的当前代码。任何R5产品代码或规格变化必须生成新指纹，不能沿用本值。

### R5 HOME/J1范围指纹

R5范围使用R4的67个文件相同顺序，并在末尾追加：

```text
scripts/validate-knowledge-platform-terrain.js
scripts/validate-knowledge-platform-workbench.js
scripts/validate-knowledge-platform-reading.js
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-home-j1.md
miniprogram/components/knowledge-space-surface/index.js
miniprogram/components/knowledge-space-surface/index.json
miniprogram/components/knowledge-space-surface/index.wxml
miniprogram/components/knowledge-space-surface/index.wxss
miniprogram/components/knowledge-card-surface/index.js
miniprogram/components/knowledge-card-surface/index.json
miniprogram/components/knowledge-card-surface/index.wxml
miniprogram/components/knowledge-card-surface/index.wxss
```

- 文件数：79。
- 聚合SHA-256：`5481d417bc6b385fb6b6ec52b66f159900bd5eb00d53d961b020b3ac3ed8f609`。
- 生成日期：2026-08-30；工作树：`/Users/jmac/.codex/worktrees/d974/miniprogram-1`。
- 算法与R0相同；candidate自身和运行产物二维码不纳入清单。该值绑定本轮权威规格、页面、共享表面、运行包与validator，不得用于后续J2代码。

### R5 J2范围指纹

J2范围使用R5 HOME/J1的79个文件相同顺序，并在末尾追加：

```text
docs/knowledge-pilot/dist/politics-v2-review/politics-v2-review-preview.json
docs/knowledge-pilot/dist/politics-v2-review/build-report.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-j2.md
```

- 文件数：82。
- 聚合SHA-256：`1d0ec22b6f22e4fc0f94bbeedb107fe5ae2cedd33c06036fbfbb92b203f9a449`。
- 生成日期：2026-08-30；工作树：`/Users/jmac/.codex/worktrees/d974/miniprogram-1`。
- 算法与R0相同；candidate自身和运行产物二维码不纳入清单。该值绑定J2权威规格、profile锚点、生成review包、路线代码、共享表面、纵向/横向门禁和J2证据文档；J3不得沿用本值。

以上`1d0ec22…`只绑定J2 v1工程切片，现冻结为历史指纹，不为v2背书。J2 v2当前实现证据由review包版本`kp1-a4-review-95418f9f02c8`、两项默认绿色门禁及2026-09-04微信CLI记录共同绑定；工作树仍包含大量用户既有未提交成果，本轮不伪造混合工作树的发布指纹。

### R4纵向自动证据

- `node scripts/validate-politics-s55-r4.js --gate=all --expect-red`：`red-baseline-verified`，0通过、12失败、0基础设施错误，进程退出0。
- `node scripts/validate-politics-s55-r4.js --gate=all`：`failed`，0通过、12失败、0基础设施错误，进程退出1；这才是R5需要逐条转绿的正式模式。
- 分切运行`home/j1/j2/j3/j4/j5 --expect-red`分别准确匹配1/3/2/2/2/2个失败；34项R3验收和每条旅程六类证据覆盖检查通过。
- 横向对照仍为A/B 26/26、C/D 22/22；candidate、foundation、learning、常识数量和笔记校验通过。这些绿色对照不改变纵向12项全红的事实。
- R4未运行微信CLI、未生成二维码、未修改页面与正式内容；政治仍为candidate、37篇review、0发布。

## 当前门禁与历史自动证据

本节明确区分本轮A至D实施证据与提前实现/上一轮候选证据；自动证据不构成用户感知验收。

- 当前旧纵向门禁仍可得到HOME 1/1、J1 3/3；J2 v1 2/2只作历史。新J2 v2切片`--gate=j2v2`默认模式为2通过、0失败、0基础设施错误，覆盖review内容引用/范围、连续渲染、同一会话、处理函数级详情/输入/完成及失效负例。J3至J5各2项仍按预期失败。`validate-politics-s55ab.js`的26/26与`validate-politics-s55cd.js`的22/22（其中D 12/12）只保留为横向回归。
- S1至S5.5相关平台、政治展现与内容门禁通过；数量保持42/37/643/39/37/37/0，另保持313个atom、37张卡片投影、37个RecallProjection和5组ContrastPair。
- 本轮独占最终复跑中，地形、工作台、搜索投影最大值约2.50ms、1.55ms、1.54ms，预算为50ms；与17项并发回归时曾出现一次60.98ms环境争用，未修改预算，独占复核通过。
- 常识数量/源文/现行法审计均0问题；笔记和训练主校验0问题，既有32条搜索元数据warning不增加。
- 运行时无Obsidian、社区插件、`.base`或`.canvas`依赖；常识和笔记没有接入政治平台服务。
- foundation、terrain、workbench、reading、learning、candidate、presentation、builder、内容staging、目录、关系及政治审计门禁保持。J2 v2微信CLI明确打开d974工作树并确认AppID `wx32dafe910fadcf59`，编译成功（总包2,999,422字节、主包1,183,250字节、政治分包157,436字节）且preview二维码生成。开发者工具自动导航到route页超时，故未取得真实selector tap/输入/原生返回证据；用户验收前不提升为UX-passed，也不替J3至J5授予状态。

## 已知限制

- 页面已统一消费643个稳定块、313个KnowledgeAtomRef、37张KnowledgeUnitCardProjection、37个RecallProjection、39/39关系双端锚点和5组ContrastPair；任何新增内容仍必须走同一构建与review链路。
- 内容覆盖仍为`partial / scope-unverified`：当前仅两篇review主线，未对齐完整考试范围；科学社会主义无独立详细单元，新时代思想/政治经济学未完成主题级完整性审计，时政无动态更新契约。详见[政治profile缺口账本](../profiles/politics.md#当前内容覆盖缺口与后续补充)。
- 5组正式ContrastPair具备卡片级辨析来源；没有正式ContrastPair的其他知识不得从相似标题或普通关系生成易混任务。
- 37篇内容仍为review，11个风险页未完成独立发布复核，UI完成不提升发布资格。
- 暗色、手势缩放、跨设备会话、掌握度和P4个性化不属于本候选。
- 认知连续性、视觉舒适度、真实320px/最大字号及低动画感受必须由用户手测，自动门禁不能替代。

## 历史S5.5A手测表（已暂停）

| 场景 | 最低通过条件 | 结果/现象 |
|---|---|---|
| 首页状态任务 | 首次、最近焦点、活动路线、失效路线各自只出现一个状态主动作，目标入口不与其争抢 | 自动门禁通过；待用户复测 |
| 最近学习入口 | 有最近知识时，搜索下方只显示一行“上次学习：名称 / 继续 / 关闭”，关闭后本次首页隐藏 | 自动门禁通过；待用户复测 |
| 具体知识直接进入 | 点击地形或目录中的具体知识一次进入同源完整知识卡，不经过预览、额外结构页或强制关系页 | 自动门禁通过；待用户复测 |
| 搜索直接落点与返回 | 结果卡只显示标题、命中类型和黄色摘要；点击直接进入，微信左上角返回原搜索位置 | 自动门禁通过；待用户复测 |
| 单份正文与关键筛选 | 详情不重复显示“关键内容”；切换“只看关键”只筛选同一份正式正文，切回后顺序不变 | 自动门禁通过；待用户复测 |
| 关系A→B→返回 | 详情下部打开关系抽屉，先解释理由；只有选择目标才进入，返回恢复原关系、分支与位置 | 自动门禁通过；待用户复测 |
| 标准返回 | 微信左上角只负责页面栈返回；B同页完整卡/回忆使用卡内语义返回逐级恢复，不建立第二套持久焦点 | 自动门禁通过；待用户复测 |
| 回忆→依据→返回 | 揭晓后可选记得、模糊、没记住、跳过；查看依据后返回仍是同一题、同一回答和补救状态，并可完成 | 自动门禁通过；待用户复测 |
| 窄屏与模块隔离 | 320px下主动作、返回与回答组可达；常识、笔记和主导航行为不变 | 自动门禁通过；待用户复测 |

A手测表只保留为历史工程复现清单；当前不再按A/B/C/D分开授予产品状态。不得恢复S6或执行`candidate → verified`；内容发布仍走独立`review → approved → release`流程。

## 历史S5.5B手测表（已暂停）

| 场景 | 最低通过条件 | 结果/现象 |
|---|---|---|
| 稳定底图与去重分支 | `政治理论 → 探索知识全景`展开第一篇和第一章；顶层只保留一条紧凑区域栏，同级第二章仍可识别并一步切换，当前篇/章不重复堆叠 | 自动门禁通过；待用户手测 |
| 320px对象预算 | 当前分支先呈现不超过6个对象，其余对象在同页“继续浏览”完整保留；同级兄弟最多3个可识别入口 | 自动门禁通过；待用户手测 |
| 知识直达详情 | 点击具体知识一次进入完整内容，不出现知识卡预览；卡内返回恢复原区域、分支和触发节点 | 自动门禁通过；待用户手测 |
| 同一大卡两形态 | 完整内容→开始回忆在同一页面、同一pointId完成；回忆→完整卡→原分支可逐级返回 | 自动门禁通过；待用户手测 |
| 层级目录与锚点恢复 | `完整目录`按第一篇→第一/二章→知识、第二篇→本篇知识→知识显示且总数37；打开详情再返回，恢复同一目录条目和投影偏好 | 自动门禁通过；待用户手测 |
| 同源正文/关系/回忆 | 完整卡正文顺序不变；只看关键只筛选同一正文；关系先解释理由，回忆揭晓可精确回原文 | 自动门禁通过；待用户手测 |
| 大字号、低动画与隔离 | 320px/最大字号下完整标题、关闭/返回和主动作可达；常识、笔记、主导航行为不变 | 自动门禁通过；待用户手测 |

历史A/B/C/D门禁和微信CLI记录保留为工程基线；该段为2026-09-04时点记录：当时OUT-J1为`UX-passed`，OUT-J2 v2仍待用户验证，J3至J5关闭。2026-09-08用户反馈J2通过后已开放J3，S6不恢复。即使J2 v2通过，`POL-CONTENT-COVERAGE-FOLLOWUP`完成前也不得宣称完整范围或恢复内容release。

## 历史S5.5D手测表（已暂停）

| 场景 | 最低通过条件 | 结果/现象 |
|---|---|---|
| 快速了解 | 一键开始后由系统沿整体、两条主干、收束带着走；不出现37篇选择器或长文漏斗 | 自动门禁/运行态通过；待用户手测 |
| 系统学习 | 推荐页说明4个知识和首尾范围；开始后直接看到完整正文，完成阅读后同卡回忆并自动进入下一知识 | 自动门禁/首周期运行态通过；待用户手测 |
| 易混突破 | 开始页直接给出推荐A/B；进行中依次经历先判断、核对边界、回看双方依据和再辨 | 自动门禁/四段运行态通过；待用户手测 |
| 考前速记 | 开始页给出4张冻结卡；进入后立即提示、揭晓、自评，没记住时主动作引导回看 | 自动门禁/揭晓自评运行态通过；待用户手测 |
| 四种完成 | 全景、学习动作、边界核对、逐卡自评分别报告，不出现统一“路线完成N步” | 自动门禁通过；待用户手测 |
| 中断与切换 | 返回后恢复准确站点/阶段/卡片；开始另一目标前明确暂停当前目标 | 自动门禁通过；待用户手测 |

## 2026-10-02 R5状态更新（历史）

用户于2026-09-08反馈J2 v2测试通过，OUT-J2为`UX-passed`。本轮按既定V2继续J3，不重做知识地图：系统学习的定位与前置提示融入reading顶部，阅读与回忆两阶段使用同源知识卡；范围、关系理由、同源完整正文和返回来路必须可见且可恢复。J3纵向门禁当前2/2，旧D与learning验证器已按两阶段规格收敛；微信CLI preview已通过，真实触控和用户手测仍待完成，J4/J5、R6、S6不因此开放。37篇review与release=0不变。此前“J2待验收、J3关闭”的段落仅为当时记录。

## 2026-10-03 R5执行裁决（真机验收前历史）

用户确认系统学习从首卡至第4个知识的真实链路连贯，并明确四个目标的进度必须互不阻挡。快速了解、系统学习、易混突破、考前速记现分别保存会话；首页只选择一个视觉主任务，其他目标可继续自己的进度。旧的“切换前暂停当前路线”规则、确认弹窗和二维码均为历史。

[J3实施证据](./politics-p3-v2-s5-5-r5-j3.md)、[J4实施证据](./politics-p3-v2-s5-5-r5-j4.md)、[J5实施证据](./politics-p3-v2-s5-5-r5-j5.md)分别记录产品链路和证据；[当前合并预览二维码](./politics-s55-r5-independent-j3-j5-preview.jpg)用于合并体验验收。J3主链路为`UX-passed`；J4/J5为`Implemented / UX-pending`。R6与S6继续暂停，`candidate`、37篇`review`、`release=0`不变。

本轮追加微信MCP真实触控证据：J3在快速了解保存进度后，从政治首页点击系统学习直接恢复原阅读步骤，两个目标各自保持存储；J4完成推荐→初判→边界→双侧精确原文→再辨，单侧时不能继续；J5完成四种自评、跨路线冷恢复、完成后补救原文往返。自动运行只证明交互与状态链可用，J4/J5用户理解与使用节奏仍待体验验收。

J4收口还修正了复答题错配：左右RecallItem是单元题而非成对题；初判与再辨现在使用同一正式对照维度的中性自我解释提示，自动门禁阻止再次误用单侧题。

同日后续J1回归修正：共享知识卡阅读面在正式原文块后展示已有ContrastPair的维度、易混边界及关系理由；其他正式关系在原文旁提供可展开的“关联线索”，默认不挤占正文，展开后显示理由并可进入目标知识。关系列表仍完整保留。缺少正式pair时不虚构易混。微信模拟器核对`u025`原文块后两组对照提示，以及`u004`原文块后可展开的5条关系理由；J1门禁新增双侧、普通锚点与缺pair负例。用户暂不进行真机测试，此扩展不改变J4/J5的`UX-pending`状态。

J3完成页补齐R3规定的模糊/没想起事实和按正式目录的下一范围建议；微信MCP实际完成四知识后显示“第二章 分论（15个知识）”，点击可进入该正式分支。

### R5 J3–J5 真机验收前范围指纹（历史）

本指纹绑定2026-10-03真机验收前的代码、纵向门禁、权威规格和R5合并预览二维码。后续R6修改了部分清单文件，下面的历史值不再代表当前工作树；当前值见下一节。candidate文件本身排除，以免自引用。每个文件先算SHA-256，按下列顺序拼接`<hash>  <path>\n`，再对整段UTF-8文本算SHA-256。

```text
miniprogram/pages/politics/index.js
miniprogram/pages/politics/index.wxml
miniprogram/services/knowledge-platform/learning.js
miniprogram/services/knowledge-platform/projectors.js
miniprogram/services/knowledge-platform/route-progress.js
miniprogram/subpackages/politics/route/guided-route.js
miniprogram/subpackages/politics/route/guided-route.wxml
miniprogram/subpackages/politics/detail/index.js
miniprogram/subpackages/politics/detail/index.wxml
miniprogram/subpackages/politics/route/index.json
miniprogram/components/contrast-surface/index.js
miniprogram/components/contrast-surface/index.json
miniprogram/components/contrast-surface/index.wxml
miniprogram/components/contrast-surface/index.wxss
miniprogram/components/knowledge-card-surface/index.js
miniprogram/components/knowledge-card-surface/index.wxml
miniprogram/components/knowledge-card-surface/index.wxss
scripts/validate-politics-s55-r4.js
scripts/validate-politics-s55ab.js
scripts/validate-knowledge-platform-learning.js
scripts/validate-politics-s55cd.js
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-product-surface.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r3-implementable-spec.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5d-guided-learning-goals.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-home-j1.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-j3.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-j4.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-j5.md
docs/knowledge-platform/implementations/politics-s55-r5-independent-j3-j5-preview.jpg
```

- 文件数：29。
- 聚合SHA-256：`36ec7c486607d508b02d1f89164e75b6e2ea4cfa49e546edf31aa676b9081857`。
- 当前微信CLI编译总包3,035,008字节，政治分包172,315字节，代码/WXML错误0；HOME 1/1、J1 3/3、J2 v2 2/2、J3/J4/J5各2/2、A/B 26/26、C/D 22/22、learning/candidate/presentation均通过。
- 该指纹只对应当时的候选工作树快照；当时J4/J5尚待用户体验。2026-10-03用户已完成真机检查，当前状态见下一节；该历史指纹从未授予S6或内容release。

### R6 当前候选范围指纹与验收结论

2026-10-03，用户使用上节绑定的R5合并预览完成1–6项真机检查并反馈全部通过。OUT-J1原文旁关系扩展、OUT-J4和OUT-J5均据此成为`UX-passed`；连同此前J1、J2 v2、J3验收，五条黄金旅程全部通过。R6删除旧路线控制器/模板/样式后，HOME 1/1、J1 3/3、J2 v2 2/2、J3/J4/J5各2/2、A/B 26/26、C/D 22/22及learning/candidate/presentation均通过。微信MCP编译代码和WXML错误均为0，总包3,014,061字节，政治分包151,368字节；模拟器打开易混路线后实际显示推荐页。[R6预览二维码](./politics-s55-r6-preview.jpg)是清理后的独立工程预览，不冒充用户已手测的R5版本。[R6收口证据](./politics-p3-v2-s5-5-r6-closeout.md)记录清理范围。

本指纹绑定当前R6候选代码、R5用户验收账本、01至09回写结论及R6预览。candidate文件本身排除。逐文件SHA-256后，按清单顺序连接`<hash>  <path>\n`，再对整段UTF-8文本计算SHA-256。

```text
miniprogram/pages/politics/index.js
miniprogram/pages/politics/index.wxml
miniprogram/services/knowledge-platform/learning.js
miniprogram/services/knowledge-platform/projectors.js
miniprogram/services/knowledge-platform/route-progress.js
miniprogram/subpackages/politics/map/index.js
miniprogram/subpackages/politics/map/index.wxml
miniprogram/subpackages/politics/route/index.js
miniprogram/subpackages/politics/route/index.wxml
miniprogram/subpackages/politics/route/index.wxss
miniprogram/subpackages/politics/route/index.json
miniprogram/subpackages/politics/route/guided-route.js
miniprogram/subpackages/politics/route/guided-route.wxml
miniprogram/subpackages/politics/route/guided-route.wxss
miniprogram/subpackages/politics/detail/index.js
miniprogram/subpackages/politics/detail/index.wxml
miniprogram/components/contrast-surface/index.js
miniprogram/components/contrast-surface/index.json
miniprogram/components/contrast-surface/index.wxml
miniprogram/components/contrast-surface/index.wxss
miniprogram/components/knowledge-card-surface/index.js
miniprogram/components/knowledge-card-surface/index.wxml
miniprogram/components/knowledge-card-surface/index.wxss
scripts/validate-politics-s55-r4.js
scripts/validate-politics-s55ab.js
scripts/validate-knowledge-platform-learning.js
scripts/validate-politics-s55cd.js
docs/knowledge-platform/README.md
docs/knowledge-platform/00-presentation-v2-master.md
docs/knowledge-platform/01-design-traceability.md
docs/knowledge-platform/02-product-model-and-information-architecture.md
docs/knowledge-platform/03-knowledge-focus-and-navigation-state.md
docs/knowledge-platform/04-content-and-runtime-contract.md
docs/knowledge-platform/05-knowledge-terrain-and-semantic-zoom.md
docs/knowledge-platform/06-focus-workbench-and-relations.md
docs/knowledge-platform/07-goal-routes-search-and-recall.md
docs/knowledge-platform/08-spatial-ui-and-accessibility.md
docs/knowledge-platform/09-verification-and-rollout.md
docs/knowledge-platform/profiles/politics.md
docs/knowledge-platform/implementations/politics-p3-v2.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-product-surface.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-governance-convergence.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r3-implementable-spec.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5d-guided-learning-goals.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-home-j1.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-j3.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-j4.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r5-j5.md
docs/knowledge-platform/implementations/politics-p3-v2-s5-5-r6-closeout.md
docs/knowledge-platform/implementations/politics-s55-r5-independent-j3-j5-preview.jpg
docs/knowledge-platform/implementations/politics-s55-r6-preview.jpg
```

- 文件数：51。
- 聚合SHA-256：`d9ff941587373d1820a57ff0d01734e47b6ee2077282327af70b402384f2d1a0`。
- 政治保持`rolloutStage=candidate`、37篇`review`、`release=0`。内容覆盖仍为`partial / scope-unverified`，S6未恢复；R6验收不改变内容发布资格。
- 2026-10-03内容审稿另见[覆盖与37篇终审基线](./politics-p3-v2-content-review-baseline-20261003.md)：已修复24篇中的81处明确结构拼接、校正2条官方表述和u009/u010/u036三篇学习投影，review运行包更新为`review-79293bfc6c40`；该修复不等于37篇终审或S6恢复。
