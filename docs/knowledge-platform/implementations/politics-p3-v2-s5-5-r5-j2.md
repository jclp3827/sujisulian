# 政治 P3 V2 — S5.5 R5 J2 v1 快速了解历史实施证据

> 状态：`Historical v1 engineering-passed / UX-failed`
>
> 任务 ID：`POL-P3-V2-S5.5-R5-J2`
>
> 上游：[R3可实现产品规格](./politics-p3-v2-s5-5-r3-implementable-spec.md)第7节、[R4纵向门禁](./politics-p3-v2-s5-5-r4-vertical-gates.md)、[OUT-J2唯一结果账本](./politics-p3-v2-s5-5-product-surface.md)

## 0. 本切片结论

R5 J2 v1只实现“快速了解”，没有提前实施J3至J5。`J2-anchors`与`J2-consumption`已在默认纵向门禁中真实转绿；正确d974工作树的微信编译、四站推进、锚点详情往返和诚实完成报告均通过。这些结果保留为`engineering-passed`历史证据，不因后续用户反馈而删除或改写。

真实用户验证已经失败：页面可见，但没有任何可点击动作，原手测第3至第5步无法完成；并且即使后续修复触控，v1主体仍是目录与站点导览，不是面向零基础用户的内容导读。OUT-J2因此裁定为`UX-failed`，不得开放J3。

政治继续保持`rolloutStage=candidate`，37篇内容继续为`review`，发布数0，S6继续暂停。正式Markdown、正式目录、关系、RecallItem、常识、笔记和主导航均未改变。

## 1. v1实施结果（历史运行事实）

- profile冻结六个Node锚点：第一篇`n006/n007`，第二篇`n025/n029/n032/n038`；标题、摘要和详情仍从同一NavigationNode与KnowledgeUnit投影读取，不复制内容事实。
- 快速了解固定为四站：整体定位 → 第一篇（2锚点）→ 第二篇（4锚点）→ 重新合拢。站点、锚点、当前位置、下一站和完成事件均来自同一LearningRoutePlan与RouteSession。
- GuidedRoute真实消费完整GoalGuide：始终说明“为什么从这里开始、现在做什么、怎样算完成、接下来去哪”，主动作明确为“已看清这一站，下一站”。
- 点击策展锚点打开既有独立KnowledgeCard详情；查看动作只记录`VIEW_TOUR_ANCHOR`，不推进导览。微信原生返回后仍停在原站，已查看锚点保存在同一RouteSession。
- 六个锚点只要有一个无法解析，就整体降级为`structure-only`：不暴露猜测锚点，推荐、开始和完成话术均改为“浏览两篇正式结构”。
- 完成页只报告实际完成的主干、结构站、已打开锚点和跳过数，不产生掌握度或学习效果推断。

## 2. 自动与运行证据

### 2.1 纵向与横向门禁

```text
node scripts/validate-politics-s55-r4.js --gate=j2
→ passed=2 / failed=0 / infrastructureErrors=0

node scripts/validate-politics-s55ab.js --gate=all
→ passed=26 / failed=0

node scripts/validate-politics-s55cd.js --gate=all
→ passed=22 / failed=0
```

J2断言覆盖四站、`[0,2,4,0]`锚点分布、六个冻结Node ID、锚点往返不推进、同一RouteSession恢复、完整GoalGuide的WXML消费，以及“部分锚点失效时不猜测”的负例。HOME/J1继续全绿；J3至J5仍各有2项产品红灯、基础设施错误0。

foundation、terrain、workbench、reading、learning、candidate、presentation、builder、内容staging、目录和关系等相邻门禁继续通过。常识数量/源文/现行法审计、笔记与训练校验均0问题；笔记保留既有32条搜索元数据warning，没有新增问题。

### 2.2 微信CLI与真实交互

- 明确项目路径：`/Users/jmac/.codex/worktrees/d974/miniprogram-1`；未使用`/Users/jmac/WeChatProjects/miniprogram-1`或开发者工具中的其他项目。
- `compile`成功：代码错误0、WXML错误0；总包2,967,045字节，主包1,158,114字节，政治分包150,195字节。
- 推荐页运行态为四站，锚点分布`0/2/4/0`；开始后按`overview → n002 → n024 → closure`推进。
- 第一篇站打开`n006 → u003`同源KnowledgeCard，详情含20个语义块和路线GoalGuide；原生返回后仍为第2站，已查看数从0变为1，步骤没有推进。
- 最终运行态为4/4站、2条主干、整体与收束均完成、实际打开1/6锚点、跳过0；报告中不存在mastery字段。
- 页面跳转与交互期间CDP错误0；仅有开发者工具自身的性能和不支持API提示。CLI preview成功生成[本切片二维码](./politics-s55-r5-j2-preview.png)。

## 3. v1用户手测入口（历史复现）

扫描[本切片二维码](./politics-s55-r5-j2-preview.png)，进入底部“政治理论”Tab：

1. 在首页点击默认建议“快速了解”：确认无需选择篇章，一键开始，并能先看到为什么这样安排以及四站/六锚点范围。
2. 在“整体定位”点击“已看清这一站，下一站”：确认进入第一篇，页面同时说明当前位置、当前动作、完成条件和下一站，并显示2个策展锚点。
3. 点击任一锚点：确认直接进入完整知识详情；点微信左上角返回，仍停在第一篇这一站，导览没有自动前进。
4. 继续下一站：确认第二篇显示4个策展锚点；再进入“重新合拢”，整体与两篇主干仍可识别。
5. 完成导览：确认只报告实际看过的2条主干、打开锚点数和跳过数，不出现“已掌握”；主动作是“回到全景继续探索”。

以上入口和步骤继续保留，用于复现v1工程行为及其失败，不再作为推进`UX-passed`或开放J3的待办。

## 4. 真实用户反馈与结果裁定

真实用户手测反馈：

1. 快速了解页面可以看到；
2. 页面内没有任何内容可以点击，因此原手测第3至第5步均无法完成；
3. 用户进一步确认，触控失败不是唯一问题：即使按钮能够点击，v1仍只是让用户沿树状目录和四个站点走一遍；它没有向从未系统学习或只有零星印象的用户提供经过加工、精粹的内容，因而不能同时建立“政治理论是什么”的初步理解与整体结构感知。

据此，v1存在两个相互独立的失败：真实交互失败，以及产品呈现模型失败。自动门禁、CLI编译、运行态推进和二维码只证明工程链路曾成立，不能抵消真实用户体验结论，也不能证明快速了解的产品目标已经实现。

OUT-J2冻结为`UX-failed`；J3继续关闭。后续只在J2 v2中解决，不用J3补丁掩盖。v2产品定义和首版取材分别由以下两份文档持有，本历史证据文件不复制其脚本文案：

- [J2 v2快速导读规格](./politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)
- [J2 v2首版完整内容脚本](./politics-p3-v2-s5-5-r5-j2-v2-content-script.md)
