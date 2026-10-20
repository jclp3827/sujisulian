# 政治 P3 V2 — S5.5 R5 HOME/J1 实施证据

> 状态：`UX-passed`
>
> 任务 ID：`POL-P3-V2-S5.5-R5-HOME-J1`
>
> 上游：[R3可实现产品规格](./politics-p3-v2-s5-5-r3-implementable-spec.md)第5至6节、[R4纵向门禁](./politics-p3-v2-s5-5-r4-vertical-gates.md)、[OUT-J1唯一结果账本](./politics-p3-v2-s5-5-product-surface.md)

## 0. 本切片结论

R5第一刀只实施HOME和J1，没有提前实现J2至J5。首页与J1四项默认纵向门禁已经真实转绿，微信CLI编译、页面运行和原生返回恢复均通过；2026-08-30用户按本文件入口确认测试通过，OUT-J1因此推进到`UX-passed`。

政治继续保持`rolloutStage=candidate`，37篇内容继续为`review`，发布数0，S6继续暂停。正式Markdown、目录事实、关系事实、RecallItem、常识、笔记和主导航均未改变。

## 1. 实施范围

- 首页只显示搜索、一个状态主动作、排除当前目标后的`otherGoals`和低权重“浏览全部知识”；不再重复篇章区域、内部步数或“开始”。读取本地进度失败时显式显示“暂时无法读取上次进度”。
- `KnowledgeSpace`物理页只接受`overview / branch / directory`，递归目录精确覆盖42个正式节点，不再拥有`full / recall / card / listEquivalent / directoryGroups`。
- 第二篇的18个知识直接归属文章，不再添加“本篇知识”伪层；第一篇按两个正式章分组并在当前分支原地展开，另一篇持续可见。
- 新增原生`KnowledgeSpaceSurface`与`KnowledgeCardSurface`。详情、快速导览、系统学习和速记注册并消费共享表面；正文只消费643个稳定块的同源投影，不把Atom另渲染成第二份正文。
- 点击具体知识统一`SELECT_POINT → reading → wx.navigateTo(detail)`；搜索按正式命中直接进入详情或空间，不再停在预览层。微信原生返回后，来源分支、滚动锚点和viewport仍在原页面。
- 详情页不再重定向回地图；同一大卡连续承载结构化正文、关系情境槽和回忆面，缺少关系或回忆时只隐藏对应槽，不删除正文。

## 2. 自动证据

### 2.1 R4纵向门禁

```text
node scripts/validate-politics-s55-r4.js --gate=home
→ passed=1 / failed=0 / infrastructureErrors=0

node scripts/validate-politics-s55-r4.js --gate=j1
→ passed=3 / failed=0 / infrastructureErrors=0
```

通过项为`HOME-hierarchy`、`J1-space`、`J1-renderer`和`J1-navigation`，覆盖R3-J1-AC-01至10。

J2至J5仍分别保持2项产品红灯、基础设施错误0：J2缺六个profile锚点和完整GoalGuide消费；J3缺范围外前置及存储状态；J4缺双侧证据门和ContrastSurface；J5缺补救队列和可重试存储状态。本切片没有用共享组件注册掩盖这些缺口。

### 2.2 横向与隔离回归

- `validate-politics-s55ab.js --gate=all`：26/26。
- `validate-politics-s55cd.js --gate=all`：22/22。
- foundation、terrain、workbench、reading、learning、candidate、presentation均通过。terrain/workbench/reading只把旧页面扫描更新为R3冻结后的“首页入口 → 共享Space / 独立Card”真实消费链，原有42节点、39关系、643块、锚点与可逆状态断言全部保留。
- 政治数量保持42导航节点、37知识、643正文块、39关系、37回忆、313 Atom、37 CardProjection、37 RecallProjection、5 ContrastPair、0发布。
- 常识与笔记仍为`legacy`，没有注册或消费政治共享表面。

### 2.3 微信CLI与运行态

- 明确项目路径：`/Users/jmac/.codex/worktrees/d974/miniprogram-1`；未使用开发者工具原先指向的其他项目。
- `compile`成功：代码错误0、WXML错误0；总包2,960,839字节，主包1,155,715字节，政治分包146,388字节。
- CDP代表页：首页、`n024`分支和`u020`独立详情均为0错误、0警告。
- 自动调用分支叶子后页面栈深度为2：`map(n024) → detail(u020, reading)`；调用原生返回后深度恢复为1，来源仍为`branch / n024 / knowledge-node-politics-toc-v2-n025`。
- [本切片微信预览二维码](./politics-s55-r5-home-j1-preview.png)已由正确worktree生成。

## 3. 用户手测结论与复现入口

2026-08-30用户确认本切片“测试通过”。该结论只授予OUT-J1，不替J2至J5或政治整体授予Verified。

1. 扫描上方二维码，进入底部“政治理论”Tab：确认首页只有一个当前主动作，其他目标不重复当前目标，也不出现篇章卡和内部步数。
2. 点击“浏览全部知识”，打开第二篇《马克思主义基本原理》：确认另一篇仍在场、当前篇原地展开、18个知识没有“本篇知识”伪层。
3. 点击“马克思主义概述”：确认不出现预览卡或关系前置页，直接进入带结构化小卡语法的完整正文；点微信左上角返回，确认仍停在第二篇和原知识位置。
4. 在知识空间切换“完整目录”：确认能看出“部分—篇—章—知识”的归属，第二篇知识直接位于第二篇下；任一具体知识仍直达同一详情页。
5. 从首页搜索“马克思主义概述”：确认结果直接进入同一详情，微信返回后仍回到原搜索结果位置。

OUT-J1现为`UX-passed`，下一步只开始J2；后续若J1回归失败，仍只回到OUT-J1修正，不用J2补丁掩盖。

## 4. 2026-10-03 后续回归修正

共享知识卡此前保留了正式`ContrastPair`字段，却没有在阅读面渲染；普通关系理由也只在正文末尾。现将5组正式对照的维度、边界和关联理由锚定在对应的原文块后；其他正式关系在原文旁折叠成一个“关联线索”，展开后逐条呈现理由并可进入目标知识。正文末尾的关系列表仍完整保留。普通关系不显示“易混边界”，不会凭标题相似推断。J1门禁新增双侧展示、原文锚点、普通关系披露和缺少正式pair的负例；微信模拟器确认`u025`的`b002`后实际出现2组提示，`u004`的`b002`后可展开5条关系理由。此修正不改变2026-08-30用户对当时J1链路的验收事实；当前扩展仍随R5候选等待后续合并体验。

2026-10-03用户按合并预览完成真机检查第1–2项并反馈通过：正式易混边界、关联理由、原文旁的普通关系披露和关联知识的原生返回均获实际体验确认。该扩展现并入OUT-J1的`UX-passed`结论。
