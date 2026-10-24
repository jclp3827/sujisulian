# ME-G0：记忆卡接入基础工程（2026-10-22）

本批以`e42af05dfd7a9d52279c7c2dc5403061abfff709`及其后的7份资料续作文件为基线，在原笔记worktree实施。用户已明确授权进入ME-G0；本批不修改公共UI、导航、训练或应用判分，不替内容签署接受和正式启用，不合并／推送／发布。

## 交付与当前状态

实现来源快照与学习身份分离、开发候选显式注册、不可变逐卡对照包、精确版本独立回执、单独正式启用授权，以及编译和真实运行消费。现有8张样板及其学习版本不变；开发新候选注册0、独立回执0、正式启用0，正式卡片0。8份DA目标及两项局部hold继续保留，12道开发应用不变。

工程完成依据为[ME-G0验证记录](evidence/notes-memory-v5-g0-validation.json)。扩充清单只有在规定实现文件摘要、33项专项用例及必要回归证据匹配时才登记G0工程通过；证据缺项或代码漂移不能仅凭状态文字通过。工程通过不代替新内容的PREVIEW／REVIEW／ADMIT或设备验收。

## 学习版本与历史兼容

- `sourceSnapshotDigest`绑定精确原引用、页签／块摘要和切片范围。来源过期仍先关闭对应卡，不自动重写摘要或沿用接受回执。
- `learningSemanticDigest`由目标、提示、标题、科目／知识点、选中知识及其父级／表头／图像等必要上下文计算；排除未引用块和已明确的展示元信息，未知字段保守纳入。编辑revision和分类目录本身不作为学习变化；公式、条件、警示含义、题意和选中知识变化会改变学习身份。
- 现有8张样板以冻结在checkpoint的精确旧版本→学习摘要映射保持原`semanticVersion`。映射源有固定摘要，不可为新语义重新生成旧别名。此兼容不写用户存储，不迁移或删除旧评分、事件、弱项与冻结轮次。
- 无关原块或纯展示改动时，明确更新来源引用后可保持原学习评价；源快照及正式审核仍需精确复核。所选内容实质变更只使对应卡待重新评估，旧历史保留。不能把“学习评价可保留”解释为“旧内容接受回执仍有效”。

## 数据和职责

| 文件／路径 | 职责 | 本批实际内容 |
|---|---|---|
| `content/notes/memory-v5-version-compatibility.json` | 冻结8张原样板的旧版本、原投影与新学习摘要 | 固定基线，不是准入记录 |
| `content/notes/memory-v5-registry.json` | 目标台账范围及精确版本注册 | 台账1份，注册0 |
| `content/notes/memory-v5-reviews.json` | 独立任务产出的追加式accept／revise／reject／hold | 空账 |
| `content/notes/memory-v5-enablement.json` | 与内容接受分开的正式启用／撤销授权 | 空账 |
| `evidence/notes-memory-v5-candidate-bundles/<摘要>.json` | 每一具体版本的原块／投影／作者字段与binding冻结包 | 当前无新注册，尚无逐卡包 |
| `evidence/notes-memory-v5-candidate-review.json` | 当前注册版本的对照索引及失败原因 | 当前0个候选 |
| `models/memory-pack.js` | 原样板加编译后的enrollment；运行时再次核来源、回执和启用 | 开发8样板，正式0 |

已有作者目标schema保持2，记忆包外层schema和存储schema保持1，原卡片／目标ID及来源定位不改；包新增可选enrollment，注册、审核、启用使用各自schema1。`notesMemory:v5:state`、事件和判分协议不变。应用仍走原V4来源、接受、曝光及作答历史链路。

## 状态与失败范围

作者目标仍是draft／not-enrolled，不通过修改这些字段放行。开发注册冻结卡片ID、targetId、revision、作者任务、规则摘要、来源摘要、学习摘要、完整作者快照及对照包摘要；仅允许已登记范围、单来源且无未决hold的目标。图推仍只入方法判断。新候选不能冒用有限样板标志。

独立回执须绑定当前注册和整个binding，明确作者任务及不同的审阅者身份／任务、审阅者种类、时间、证据路径、问题和实质检查。accept须七项检查通过且无未决问题。对照包按摘要命名，已有文件不得覆盖；修订产生新binding和新包。旧版被退回不阻止冻结修订版供复审，仍不绕过运行入口的审核限制。

正式启用还须有对应最新接受回执的ID与完整回执摘要、binding摘要、明确授权来源及时间。接受后未启用只可开发预览。启用和撤销、回执和注册均追加并显式接替；分叉须显式消解。过期、冲突、拒绝、hold、revise或来源失配会阻断对应版本，不能以旧accept或布尔approved兜底。无身份的整体结构损坏失败关闭；有明确卡片身份的问题局部隔离。

这些校验核对回执声明与版本证据，不凭名称差异证明真实独立性。实际独立任务和用户／发布负责人授权仍须真实发生；本批只使用隔离夹具验证，没有生成真实接受或启用记录。

## 后续批次的操作顺序

ME-DA-PREVIEW先核可接入目标，两个hold目标继续排除。登记工具支持`--check-only`只验不写，实际登记后再冻结对照包和编译。所有命令均在本笔记worktree执行；本批未对实际8份目标执行注册。

```text
node scripts/register-notes-memory-candidate.js --card-id <明确ID> --registration-task <登记任务ID> --registered-at <ISO时间> --check-only
node scripts/build-notes-memory-candidate-review.js
node scripts/build-notes-memory.js
node scripts/build-notes-memory.js --check-only
```

实际登记需移除`--check-only`，属于后续PREVIEW实施，不是上述核查命令自动授权正式内容。独立审阅者先阅读对应不可变对照包，产出精确binding的外部回执，再由导入工具追加；导入工具不会替审阅者填写检查结论。正式启用另需真实授权文件。

```text
node scripts/record-notes-memory-decision.js --decision-file <独立回执JSON> --check-only
node scripts/record-notes-memory-decision.js --enablement-file <单独授权JSON> --check-only
```

后续每次实际记录变更后重新生成当前对照索引、编译记忆包并核逐ID可达／弱项／版本行为，不能只改JSON计数。读取失败不删除旧状态，保存失败不推进。新内容的原图、长公式、窄屏大字、真机、完整包体及发布仍分别验收。

本批停止点为G0工程交付；下一批ME-DA-PREVIEW，先接无hold的资料候选并完成逐ID开发验证，不自动启动正式准入。

本批另附[收口与保护范围核对](evidence/notes-memory-v5-g0-closeout-20261022.json)：33项G0专项、16项方案与证据检查通过，12份模板／样式离线编译通过；真机、完整压缩包及新内容验收未代签。
