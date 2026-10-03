# 政治 P3 V2 — S5.5 R4 纵向门禁与红基线

> 状态：R4历史红基线保留；R5当前HOME/J1、J2 v2、J3主链路经用户验证，J4/J5各2/2自动门禁通过、待体验验收
>
> 任务 ID：`POL-P3-V2-S5.5-R4-VERTICAL-GATES`
>
> 上游：[R3可实现产品规格](./politics-p3-v2-s5-5-r3-implementable-spec.md)第5至12节、[S5.5唯一产品结果账本](./politics-p3-v2-s5-5-product-surface.md)的OUT-J1至OUT-J5
>
> 门禁：`scripts/validate-politics-s55-r4.js`

> J2当前规格：[J2 v2快速导读规格](./politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)；配套审核内容：[J2 v2首版完整内容脚本](./politics-p3-v2-s5-5-r5-j2-v2-content-script.md)。本文件原有`J2-anchors / J2-consumption`及其2/2结果完整保留为v1历史，不能证明v2通过。

## 0. R4结论

R4已经建立一条可持续用于R5的纵向门禁。当前实现运行结果为12个产品门禁全部失败、测试基础设施错误0；`--expect-red`模式只因为失败集合与本文件冻结的当前红基线完全一致而退出0，不表示任何产品旅程通过。

```text
node scripts/validate-politics-s55-r4.js --gate=all --expect-red
→ status=red-baseline-verified
→ passed=0 / failed=12 / infrastructureErrors=0

node scripts/validate-politics-s55-r4.js --gate=all
→ status=failed
→ exit=1
```

门禁仅使用Node标准库和现有平台纯函数/页面装载方式，没有引入测试框架、依赖或第二套产品状态。它同时验证34项R3验收ID已被实际断言覆盖，并要求J1至J5各自具备`state / view-model / wxml / negative / restore / isolation`六类证据。

## 1. 两种运行模式

| 模式 | 用途 | 成功条件 |
|---|---|---|
| 默认`require-green` | R5逐旅程实现后的正式自动门禁 | 所选门禁全部通过；任何产品缺口退出1 |
| `--expect-red` | 只用于绑定R4当前失败基线 | 失败ID与冻结集合完全一致、且基础设施错误为0 |

可按`--gate=home|j1|j2|j3|j4|j5|all`分切运行。R5不得修改`EXPECTED_RED`来制造通过；某条门禁修复后应运行默认模式并把该旅程推进到真实全绿，R4红基线只作为进入R5前的历史证据保留。

## 2. 当前12项红基线

> 下表的两项J2门禁是R4建立时的**J2 v1历史门禁**。它们后来取得工程绿灯，但已被用户真实手测从产品层证伪：页面交互无法继续，且“四站六锚点目录游”不是当前快速了解目标。表中原始失败和目标不改写，只作历史追溯。

| Gate | 当前首个可复现失败 | 对应R5目标 |
|---|---|---|
| `HOME-hierarchy` | HomeDecision没有`otherGoals`，首页仍消费regions/stepCount/重复开始动作 | 收敛首页信息层级与存储失败状态 |
| `J1-space` | KnowledgeSpace仍暴露card/full/recall和非递归目录字段 | 只保留overview/branch/directory及42节点递归树 |
| `J1-renderer` | 没有共享`KnowledgeCardSurfaceViewModel`和原生共享组件消费 | 唯一空间/大卡渲染器，Atom不形成第二条流 |
| `J1-navigation` | `SELECT_POINT`在有关系时默认进入relations | 默认reading、原生进入独立Card并恢复viewport |
| `J2-anchors` | 运行时profile的六个`anchorNodeIds`为空 | 四站六锚点及structure-only诚实降级 |
| `J2-consumption` | route未注册/消费共享KnowledgeSpaceSurface | 完整GoalGuide、锚点往返不推进、结构完成报告 |
| `J3-cycle` | ready投影缺范围外前置；后续断言还要求移除orientation步骤 | 四个知识的reading→recall共享大卡周期 |
| `J3-consumption` | route未注册/消费共享KnowledgeCardSurface | 无路线私有正文，恢复/失效/存储状态可见 |
| `J4-contrast` | 单侧证据也会把session错误推进到retest | 正式pair、初答、双侧依据、复答与不可用负例 |
| `J4-consumption` | route未注册/消费ContrastSurface | 320px纵向A/B、精确Block依据、初复答分离 |
| `J5-remedy` | report没有包含fuzzy与missed的`remedyQueue` | 严格揭晓自评、四类结果、补救与恢复 |
| `J5-storage` | route未消费共享回忆面和可重试storage状态 | 未保存可见、重试、四回答与最大字号可达 |

每个Gate包含多项顺序断言；上表只记录本次最先触发的失败。R5修复首项后，同一Gate会继续暴露后续缺口，直到默认模式真正转绿。

## 3. 34项验收与六类证据

| Journey | R3验收ID | R4 Gate | 证据类别完整性 |
|---|---:|---|---|
| J1 | 10 | `J1-space / renderer / navigation` | 6/6 |
| J2 | 5 | `J2-anchors / consumption` | 6/6 |
| J3 | 6 | `J3-cycle / consumption` | 6/6 |
| J4 | 6 | `J4-contrast / consumption` | 6/6 |
| J5 | 7 | `J5-remedy / storage` | 6/6 |

WXML消费门禁不把“源码中有一个词”当通过：它把共享组件注册与实际标签消费、必要ViewModel绑定、页面事件、真实平台投影/状态转换和负例结合验证。删除共享组件消费、必要绑定、状态字段或恢复行为都会使默认门禁失败。

## 4. 横向基线对照

R4完成时同时复跑既有横向门禁：

- `validate-politics-s55ab.js --gate=all`：26/26通过。
- `validate-politics-s55cd.js --gate=all`：22/22通过。
- candidate、foundation、learning通过；政治仍为`candidate`，42节点、37篇review、643块、39关系、37回忆、0发布不变。
- 常识数量校验和笔记校验0问题；笔记保留既有32条搜索元数据warning，没有新增问题。

这组对照再次证明：横向A/B/C/D门禁可以全绿，同时12个纵向产品门禁全部为红。后续不得再用26/26或22/22替代OUT-J1至OUT-J5的结果证据。

## 5. 边界与下一步

本轮只新增门禁与证据文档，没有修改首页、KnowledgeSpace、KnowledgeCard、路线页面、正式Markdown、目录、关系、RecallItem、发布状态或常识/笔记行为；没有运行微信CLI。政治保持`rolloutStage=candidate`、37篇保持`review`、发布数0，OUT-J1至OUT-J5继续为`UX-failed`，S6继续暂停。

R4退出后，唯一下一步是R5按`HOME/J1 → J2 → J3 → J4 → J5`逐条实现。每次只让当前旅程的默认门禁转绿并交用户手测；不得跨旅程批量堆页面补丁，也不得在R5修改红基线来迁就代码。

## 6. R5消费记录

2026-08-30 R5第一刀已让HOME 1/1和J1 3/3在默认模式通过，用户随后确认J1手测通过。随后J2 2/2也在默认模式通过：断言覆盖四站、六个冻结锚点、`0/2/4/0`分布、锚点往返不推进、GoalGuide真实消费和部分失效时的`structure-only`负例；没有修改`EXPECTED_RED`、删除断言或放宽验收。J3至J5仍各2项失败、基础设施错误0。完整证据见[R5 HOME/J1](./politics-p3-v2-s5-5-r5-home-j1.md)与[R5 J2实施记录](./politics-p3-v2-s5-5-r5-j2.md)。

上述J2 2/2现冻结为`J2 v1 engineering-passed`历史证据。用户随后确认“页面可见但什么都点击不了”，且否定以走目录树完成快速了解的呈现模型；因此OUT-J2为`UX-failed`，不得用旧2/2恢复为通过，也不得据此进入J3。

## 7. J2 v2红门禁与已验证基线

2026-08-31，`validate-politics-s55-r4.js`已增加独立`--gate=j2v2`，旧`J2-anchors / J2-consumption`完整保留为v1历史。新切片以两项可执行Gate汇总J2V2-source至mobile-a11y-isolation十项合同，合并覆盖`state / view-model / wxml / negative / restore / isolation`六类证据。

J2 v2的唯一规格与内容输入为[J2 v2快速导读规格](./politics-p3-v2-s5-5-r5-j2-v2-quick-guide.md)和[J2 v2首版完整内容脚本](./politics-p3-v2-s5-5-r5-j2-v2-content-script.md)。两项Gate的当前结果为：

| Gate | 必须覆盖的最小合同 | 当前状态 |
|---|---|---|
| `J2-primer-content` | 一份review态导读投影；8段、2个带批注代表例、1次自我解释、根与两篇3个宏观节点；全部事实、关系命题、例子和参考表达引用可解析且审核通过；任一引用失效时整体不可用，不用标题/summary/目录自动补 | 默认模式`passed`；review包已输出1份8段primer与覆盖声明 |
| `J2-primer-consumption` | 首页直达首段实质内容；S1至S7可仅靠纵向滚动到达；同一最小语义结构被逐段消费；自我解释支持提交或明确暂缓且不评分；完成只报告可观察动作；原生返回恢复同一RouteSession与viewport；320px/最大字号无横向依赖；内容不可用时不回退四站目录游 | 默认模式`passed`；投影、页面处理函数与恢复均已接通，真实selector触控待用户验证 |

红基线按以下顺序完成：

1. 先编码真实断言，未把新ID写入`EXPECTED_RED`；
2. 运行`node scripts/validate-politics-s55-r4.js --gate=j2v2`：退出1，0通过、2失败、0基础设施错误；
3. 观察失败集合与两项合同一致后，才登记新红ID；
4. 运行`node scripts/validate-politics-s55-r4.js --gate=j2v2 --expect-red`：退出0，状态`red-baseline-verified`，预期与实际均为两项失败，基础设施错误0。

2026-09-04两项v2 Gate已在默认模式真实转绿：2通过、0失败、0基础设施错误。微信CLI编译与preview成功；真实selector自动化因开发者工具导航超时未完成，仍须用户进行触控、详情返回位置与理解验收。自动转绿本身不等于OUT-J2 `UX-passed`。

J3至J5门禁继续消费[R3可实现产品规格](./politics-p3-v2-s5-5-r3-implementable-spec.md)第8至10节；J2重开不得修改或提前放宽`J3-cycle / J3-consumption / J4-contrast / J4-consumption / J5-remedy / J5-storage`。
