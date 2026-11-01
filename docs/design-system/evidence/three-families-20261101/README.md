# 三个样式族候选

本聊天负责；基线 acdb1c1137bec05d41cc4012a0f65ddab0de6348。独立树 /private/tmp/miniprogram-ds-three-families-20261101，分支 codex/design-system-three-families-20261101。旧候选与 main 接入准备树只读保留。完成产品审定材料后保留本候选作为验收和回退入口，不自动接入正式分支。

用户 2026-11-01 确认方向：普通底栏双操作主右；标题辅助胶囊、导读双操作同行；被动进度优先采用导读白卡。以下具体数值与实现均 draft。

## 消费者分类与规格

| 样式族 | 实际消费者 | 处理与例外 |
| --- | --- | --- |
| A 普通双操作 | note/practice 空、错、超范围、设置等双操作；common/learning 的普通双操作 | 横排主右，保持 handler、条件与文案；44px 最小高度、12rpx 间隔、允许长字换行 |
| A 三操作及分组 | note/practice application、memory 自评；politics/practice、route/guided-route、route/units | 保留数量、动作阶段和原固定／动态测量机制；已有三槽或自评矩阵不是双操作，禁止强行减为两个 |
| B 标题辅助 | note/practice、note/memory 的学习设置和返回；common/learning daily/guide/exam 与设置返回；politics/practice qa 的设置／返回与 daily 模式入口 | 共享 78×44px 触控及可见框，13px/600，胶囊圆角；本组／范围说明同规格并允许图标宽度；导读左分类标题，右设置、说明同行；不新增背景卡 |
| B 其他语义 | common 完成页“学习设置”、note 底栏“调整范围”、阅读设置、politics 返回学习首页 | 属于底栏动作／阅读专用／首页导航，保留独立行为，不因文字相同强制标题化 |
| C 被动位置 | note/practice、note/memory、common/learning daily/guide/exam 及其他同路由有效进度 | 白卡承载原字段和细轨道；采用导读的紧凑间距、字号角色、行布局。统计、比例仍由原页面提供 |
| C 无比例被动位置 | politics/practice qa/daily | 只加共同白卡结构，保留原序号及范围，不生成轨道和百分比 |
| C 阶段与章节 | politics/route/guided-route 的分段阶段；route/units 本篇／主题及阅读工具 | 业务阶段与路线阅读结构，保留分段／双口径；待单独产品裁决，不用普通题卡覆盖 |
| C 看板与无有效任务 | 模块首页统计、完成看板、目录标签、加载／空态／错误 | 非当前任务被动进度或无有效数据，保留；不制造 0/0、负数或假比例 |

检索结合 WXML 的 progress/轨道/操作容器、WXSS 类、绑定事件及页面模式。页面级进度源码集中于上述六个学习／路线模板；首页统计和目录状态为不同角色。共享样式通过限定页面导入，不改全局阅读、行测、照片或算法。

验收分层：真实渲染和几何、固定夹具、纯本地控制器、真实点击、设备分别记录；375/428 未经实际切换不记通过。新页面发现本候选后须检查 approved 范围，不能把 draft 视觉数值当成最终标准。
