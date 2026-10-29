# R5 产品负责人验收工作单｜2026-10-29

**当前结论：工程功能候选可接受；内容、包体和真机仍有条件。本页所有人工检查均待执行。** 公众范围不变，常识问答603题；S4两题不会因本次验收而公开。

打开同目录 [内容检查卡](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/content-review.html) 即可逐项看题、答案、修订前后与来源，不必阅读技术日志。每项记录“通过 / 修改 / 暂停”、理由、审阅人和日期；AI记录不能替代签字。

| 内容与入口 | 目标、具体待审点 | 已有依据 / AI结果 | 发布影响 |
| --- | --- | --- | --- |
| `new-culture-memory`，既有记忆材料 | 新文化运动人物与主张。覆盖说明修为“传播马克思主义”，**旧简写“李钊马列”仍在**，确认是否需要统一 | 博物馆、北大文献；AI有限通过，保留该语言问题 | 新版内容验收待定；不恢复旧口诀入口 |
| `pre-qin-institutions-memory`，既有记忆材料 | 宗法相对层级；确认大宗/小宗表述及覆盖边界 | 人大清史来源；AI有限通过，未宣称整份PDF视觉验收 | 新版人工确认待定 |
| `third-plenum-full`，常识问答→十一届三中全会 | 独立题干、决策与地点及干扰项；所有选项同日期，不能据此认为测到了日期回忆 | 发改委党史来源；AI限定通过；见 [third-plenum-full.png](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/third-plenum-full.png) | 待人工内容确认 |
| `industrial-revolutions::mendel-laws`，导读→三次工业革命 | 独立表达、1865年提出与1866年发表的语境；检查编者语言清理 | 孟德尔原文/大学说明；AI通过；见 [mendel-laws.png](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/mendel-laws.png) | 编辑修订待抽样，无新增语义版本 |
| `contract-formation::lateness-compare`，导读→合同订立 | 两类迟到承诺的发出/通常到达条件、默认效力与通知方向，逐句对照486/487条 | 已存民法典来源；AI有限通过；见 [lateness-compare.png](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/lateness-compare.png) | **法律人工事实复核待定** |
| `s4-heat-continuous-rod-vacuum` / `s4-heat-radiation-forced-air`，隔离候选 | 分别解释“杆周围真空≠杆内无介质”和“风机气流”；独立选择并说明理由、可读性与变式价值 | NASA/ASHRAE/DOE；两题及5题组独立AI通过 | 不阻断当前603题；未来公开须人工审定和新授权 |
| 既有法律问答6题：`capacity-under-eight`、`capacity-eight-plus`、`capacity-labor`、`inherit-first`、`inherit-second`、`inherit-inlaw` | 年龄与劳动收入例外、继承顺序与姻亲特殊条件；按每题法条定位核对 | 已存官方民法典总则/继承编核验记录；R5未重新给出全法律库AI通过 | 人工事实复核待定；其余法律内容未扩大审查 |
| 有限分类抽样4题：`history-hanshu`、`prehistoric-new-stone-full`、`school-lao`、`exchange-rate-system-full` | 长短选项提示、脱离组上下文、编者语言、极端措辞，各1题；法定术语误报勿机械替换 | 沿用S1的12题风险抽样；当前4题全文在检查卡中 | 需对抽样风险作出接受/修订/暂停决定；不是全库合格证明 |

**最小真机路径（尚未执行）**：用未来单独授权的同一构建和测试账号，依次进入笔记练习、笔记快记、常识问答、知识导读；每入口完成首次/相邻加载→作答或揭晓→四项自评（适用入口）→退出续学→原文返回→缓存淘汰后再进→受控切版/断网后重试，另检查空态。不得清除真实记录；切版、撤回使用隔离内容。记录设备/系统、构建和云函数身份、操作与真实结果。当前只有开发者工具模拟结果。

**待工程协作的发布门**：主包源码统计2.229 MiB，高于仓库1.5 MiB预算；需取得实际压缩包数据并解决预算门。真实云端联调及真机交付尚未授权；如依赖上传、云部署、远程调试，等待分别授权。本轮不执行这些操作。
