# 政治 P3 V2 — S5.5 R6 收口证据

> 状态：完成；R5五条黄金旅程已获用户真机验收，S6未恢复。
>
> 权威账本：[S5.5总任务单](./politics-p3-v2-s5-5-product-surface.md)。

## 用户验收输入

2026-10-03，用户使用R5合并预览，按已给出的1–6项真机清单逐项检查后反馈“1-6均真机测试通过”。这覆盖共享知识卡中的位置、完整原文、正式易混边界与普通关系理由、关联知识往返；J4先判—边界—双侧原文—再辨；J5四类自评、暂停恢复、补救事实；以及四目标进度互不阻碍。OUT-J1原文旁扩展和OUT-J4/J5均据此达到`UX-passed`；此前J1、J2 v2、J3主链路的用户验收继续有效。该反馈未执行S6独立候选验收。

## 死代码和重复表面收口

- `route/index.js`只加载当前`guided-route.js`，删除不会注册的`false && Page(...)`旧控制器。
- `route/index.wxml`只包含当前`guided-route.wxml`，删除`wx:if="{{false}}"`旧模板。
- `route/index.wxss`只导入当前`guided-route.wxss`，删除旧模板专属样式。
- 路线页由`guided-route.js`唯一注册`Page`；知识空间只显示overview/branch/directory，完整正文由独立detail与路线共享`KnowledgeCardSurface`消费。未修改37篇正式Markdown、来源、目录、关系或回忆事实。

## 自动与微信运行证据

- R4纵向默认模式：HOME 1/1、J1 3/3、J2 v2 2/2、J3/J4/J5各2/2。
- 横向回归：A/B 26/26、C/D 22/22；learning、candidate和presentation通过。
- 微信开发者工具MCP编译：代码错误0、WXML错误0；总包3,014,061字节，政治分包151,368字节。清理前同一候选政治分包为172,315字节。
- 微信CLI preview成功；[R6候选预览二维码](./politics-s55-r6-preview.jpg)独立于用户已经真机通过的[R5预览](./politics-s55-r5-independent-j3-j5-preview.jpg)。
- 微信模拟器打开`route/index?type=confusion`后显示`screen=recommendation`、`type=confusion`，证明清理后当前路线仍由活动控制器运行。

## 发布边界

R6只收口S5.5产品表层。政治`rolloutStage=candidate`、37篇`review`、`release=0`；常识和笔记保持原状态。内容覆盖仍为`partial / scope-unverified`，权威考试大纲覆盖、风险页终审及动态内容契约尚缺。恢复S6需要独立决策和上述内容前置，不由R5手测或R6自动检查推出。
