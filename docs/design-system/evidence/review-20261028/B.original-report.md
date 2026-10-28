# 独立只读回执 B：笔记记忆反馈实施选择

## 结论与身份

建议以“扩展笔记现有页面展示”为首选候选：保留自评保存后自动前进，在明确绑定上一张卡片身份的展示反馈中表达“有点模糊／没想起”；不把两者做成答错红色，不调整评价、弱项队列或统计。若产品意图是让用户停留原卡核对原文，则另列“停留核对”方案，因为当前笔记引擎把评价保存与前进合在一次事务中，不能当作换一个组件即可完成。本文仅提出选择，没有实施授权，也没有开发。

本次只核查 `/private/tmp/miniprogram-ds2-preintegration-20261028`。实际分支 `codex/design-system-ds2-preintegration-20261028`；HEAD `90b56f784c865c3d24b1a05c17ce7edf71d28897`。工作区已有 README、知识平台 README 修改及治理文件未跟踪；未覆盖或清理这些内容。有效治理包为 `1.0.0-ds2.3`，产品体系 Design System V1.0、阶段 DS-2；实际核验是 `preintegration-candidate`，`formal:false`。它不是正式共同基线，不自动约束其他树，不授权 DS-3 或发布。

## 规则入口与实际读取

从根 `AGENTS.md` 发现唯一当前入口 `docs/design-system/README.md`，再读取 `contracts.md`、`activation-policy.json` 和 registry 的相关项。通过 `--query 记忆` 找到 `PAT-MEMORY`，实际执行其 `--show`、`--consumers`；由政治回忆实现继续查询 `recall`，读取 `CMP-KNOWLEDGE-CARD` 的完整登记及消费者。`--query 状态` 没有命中，随后用 `--query loading` 找到 `PAT-STATUS`，再读取该项。没有凭页面外观把任意卡片认作自评公共组件。

已直接阅读的主要规范：

- `AGENTS.md`、`docs/design-system/README.md`、`docs/design-system/contracts.md`、`docs/design-system/activation-policy.json`。
- `docs/design-system/registry.json` 的版本、激活、sourceBaseline、legacyReferences，以及上述查询输出的登记内容。
- 历史输入 `docs/knowledge-platform/08-spatial-ui-and-accessibility.md`、`implementations/politics-reading-ui-v1-product-rules-20261025.md`、`implementations/notes-memory-v5-buttons-and-review-20261022.md`。只把它们当作有时间及模块范围的原规范/阶段快照，不采纳其中历史“通过/完成”的叙述作为本次结果；未跟随其中 evidence 链接。

本任务直接相关的 approved 原则是：

- `DS-SEM-002`：记住了、有点模糊、没想起、跳过都是记忆自评，不等同客观对错，不套答题评分或正确率。`DS-SEM-001` 的错误红色只适用于客观错误，具体红色值也未批准。
- `DS-PAT-003`：已批准支持自动前进与停留核对两种任务模式；输入包括内容身份、揭晓、可用反馈、资源就绪和模块状态；恢复包含当前卡、揭晓、评价及来源位置；重复触发不得错用到下一卡。支持两种模式不等于批准把笔记改成政治模式。
- `DS-CMP-001/002`：公共展示不得决定记忆结果、评分、队列、统计、完成及持久化；先核对真实消费者，再选择复用、配置、扩展或新建。B 为可配置公共；C 业务专用是正常成员，不要求机械共享。
- `DS-THM-001`、`DS-EXP-001/002`：保留四模块皮肤；笔记、常识、政治优先横向治理，训练专项保留；阅读正文可独立，不能为了卡片统一重排知识正文。
- `DS-EXP-003`、`DS-GOV-001`：批准原则、draft 实现、静态、页面、设备和发布证据分开；批准原则不自动授权现有行为修改。

`DS-FND-002`、`DS-SEM-003`、`DS-PAT-005` 仍为 draft，不能把它们或源码现值提升成批准数值/交互规范。registry 中 `PAT-MEMORY`、`CMP-KNOWLEDGE-CARD`、`PAT-STATUS` 都是 draft；`implementation.observed:true` 只表示在所列基线看到实现。

## 激活核验，不只读声明

执行 `node scripts/validate-design-system.js` 通过。又以本树明确记录的 `90b56f784c865c3d24b1a05c17ce7edf71d28897` 为审计基线执行 `--audit-base ... --json`，得到：

- `ok:true`、版本 `1.0.0-ds2.3`。
- `activation.ok:true`、`state:preintegration-candidate`、实际 branch/HEAD 与上文一致。
- `actual.formal:false`，`actual.changedProductFiles:[]`；audit 的产品差异也为空。
- 18 条契约、15 条 approved、30 项登记、10 个组件、20 个 Pattern、38 个页面。
- 提示包括 `CMP-SESSION-HEAD`、`CMP-PHOTO-EDITOR` 未发现静态消费者，以及 reading-controls 的两个带回退可选变量。未据此删除组件或改业务。

实际阅读了激活验证实现：它核对策略版本、实际分支、基线祖先、产品树身份/差异及预集成治理来源；治理来源登记为 `64ba11f700f6c71ccfa0fc8aec4b55eade73a15e`。候选授权不含正式接入。未来正式状态还需要独立 Git 引用绑定批准回执、治理版本、接入提交和目标分支；本次未创建这些对象，也没有把 registry 布尔值当授权。此工具不能证明人类签名身份。

## 当前实现与消费者关系

| 登记或实现 | 实际关系与行为 | 对本任务的影响 |
|---|---|---|
| `PAT-MEMORY`，B/draft | `directConsumers:[]`。角色相关页是笔记 memory、常识 learning、政治 practice/route/detail 五页；applicablePages 是候选适用范围 | 是语义/状态 Pattern，不是可直接替换的公共自评组件；五页不代表同一实现或全部状态 |
| 笔记 `memory/index.wxml/.js` 与 `services/memory-session.js` | 模板直接使用四个 button，未引用 knowledge-card-surface。揭晓后出现自评。`handleAssess` 先保存位置，再 `engine.assess`，随后 show 新状态；engine 事务写 event/response，非跳过写 rating，然后 `index++` | 当前是自动前进。反馈不应从已换到的新 card 推断上一卡结果；保存失败不能显示成功；停留核对需要明确业务接口设计 |
| 笔记资源与恢复 | 非跳过评价受 `imagesReady` 门控，跳过可用；图片错误可重试/查原文；有图片代次和异步 token；onHide 保存位置、onShow 重取 session；包含 complete/expired/error/empty、列表和设置分支 | 必须保留这些门控及返回恢复，新增反馈不能遮盖错误或把旧异步结果写到新卡 |
| 笔记评价业务 | weak() 使用 fuzzy/missed，同版本筛选且 missed 优先；report 按 response 汇总；状态键是 `notesMemory:v5:state` | 这些是业务事实，不由展示层重算、重排或迁移；反馈文案不能虚构“答错”“掌握度” |
| 常识 guide-session / learning | `assess` 写评价后 `session.index += 1`；页面 `handleGuideAssess` 调用后重新渲染 | 自动前进是另一模块现有事实，不授权把它也改成停留 |
| 政治每日练习 | `assessRecall` 校验已揭晓且尚未评价，再存 outcome，不推进 index；独立 `handleNext` 调 `advance`；模板在 fuzzy/missed 已评价状态提供“查看原文” | 可以借鉴任务语义；不能把其停留流程静默移植笔记 |
| `CMP-KNOWLEDGE-CARD`，B/draft | 真正直接消费者只有政治 detail、route、practice 三个注册页面。源码与 usingComponents 线索相符；route 经 guided-route 模板使用。组件只发 recallresult 等事件并管理局部展开 | 笔记不是它的现有消费者。它还承担知识正文、关系、阅读设置投影等较宽职责；整体迁移不适合仅增加笔记反馈 |
| 政治组件提示 | 模板在 showReadingReturn 且揭晓时，可对 fuzzy/missed 显示核对原文提示；practice/route 的引用传入 false，实践页另有自身底栏 | 不能看到组件内有一句提示就声称政治所有入口都显示它；组件属性配置和页面底栏须一起看 |

有限静态搜索中，`createMemoryEngine` 的产品调用只有笔记 memory 页；没有执行该引擎。政治 detail 的 `handleRecallResult` 更新自身 recall 视图，route 经 `RECALL_RESULT` 事件分派；没有把它们冒称每日练习引擎的同一条业务路径。

## 实施候选与模块例外

首选候选 A：复用记忆语义、现有四种结果和业务引擎；扩展笔记页自身反馈视图/适配。保持成功保存后的自动前进，以文字清楚区分“上一张：有点模糊／没想起”，颜色只辅助，沿用笔记身份皮肤。内容身份、session 和已提交结果由业务提供，展示只表达事实；新卡、列表、设置、来源往返及完成态如何清除/恢复反馈需在实施前明确。这里没有批准具体文案、色值、尺寸、显示时长或动效，也不建议凭空加固定延时。

备选 B：fuzzy/missed 后留在原卡，展示已评价结果及“查看原文／继续”。这符合已批准可支持的停留核对模式，但改变现有笔记前进策略。需要先定保存与推进的责任、保存失败、再评/不可再评、跳过、最后一张完成时机及来源返回；不能简单在现有 index++ 后再把索引减回去，也不能为展示复制评价/队列逻辑。应作为独立产品行为决策，本文不实施。

共享选择：本次不建议整体复用政治 knowledge-card-surface，也不因已有公共组件强制迁移。若后续三模块确实需要相同的反馈表面，可新建只接收结果视图并发事件的小展示能力，登记 B 及直接消费者；笔记业务适配可保持 C。新建理由是现有组件职责过宽、正文/来源/回忆投影模型不同，而不是因为名称不同。若修改公共组件，必须验证政治 detail、route、practice 三个直接消费者，并更新登记；不能只验证笔记。

模块例外已登记：笔记快记、常识导读自动前进；政治每日练习停留核对。训练专项只作参考，不借本任务全面迁移；正文保留独立排版。历史空间规范关于固定认知色/品牌限制与本轮保留模块皮肤原则有范围差异，应按当前索引处理，不能照旧条款全面重涂。政治阅读 V1 的具体字号、间距、触控和第0/1批范围只保留其历史专项效力；其真机/320px豁免也不能自动转移给笔记。本次不扩张或缩回现有阅读启用范围。

## 验证要求与实际缺口

本次已做的只是源码阅读、查询与只读 DS 静态检查，没有构建、编译、自测、业务引擎执行、模拟器、页面几何、设备或线上访问，没有开发或发布。

若后续获准实施，需记录实施前精确基线并重读索引；更新 PAT-MEMORY、适配能力/组件、消费者、模块例外及验证层次。按影响运行治理审计和相关业务检查，不猜 README 中另一分支的基线；旧 token 检查含政治假设，不能直接当全产品硬门禁；索引说明当前目标不含 `validate-public-learning-page-runtime.js`，不能复制历史脚本来制造验收结果。

验收应覆盖：未揭晓/已揭晓、四种结果、资源加载/失败/重试、处理中/禁用、写入失败、过期/空/完成、第一/最后一张、连续点击及旧事件错卡、设置/列表/上一张/来源原生往返、滚动与揭晓恢复。必须证明新增展示没有改变原结果、事件次数、持久化键、弱项排序、计数分母、队列与完成规则；真实页面核对反馈归属和安全区/底栏遮挡、长文本与字号；设备效果和发布分别记录。当前没有这些新增候选的任何可运行或视觉证据，不能把静态 PASS 当作反馈功能验收。

治理发现缺口：`--query 状态` 未命中而英文 loading 命中，中文同义词发现可改善；这次只记录，不改登记。角色引用是有限源码线索，不证明运行时可达和全部状态。新增反馈具体形式尚未审定。

## 原始命令与读取边界说明

所有工程读取/查询 shell 命令均通过指定记录器，唯一标签 B001—B035；输出目录为 `/private/tmp/peanut-ds2-preintegration-20261028/cold/agent-B`。统一前缀是：

```text
python3 /private/tmp/peanut-ds2-preintegration-20261028/record.py --cwd /private/tmp/miniprogram-ds2-preintegration-20261028 --out /private/tmp/peanut-ds2-preintegration-20261028/cold/agent-B --label BNNN [--echo] -- <命令 参数>
```

B001—B010 原记录器不回显，使用 node_repl 的 fs.readFile 只查看自己的同编号 stdout；未查看其他场景记录。收到记录器支持 --echo 的通知后，从 B011 起均以 --echo 直接回显。命令索引如下，完整原始 stdout 依编号保留：

| 标签 | 实际命令/目标 |
|---|---|
| B001 | `pwd` |
| B002 | `rg --files --hidden`，匹配 AGENTS/design/spec/rule 文件名 |
| B003 | `cat AGENTS.md` |
| B004 | `rg --files --hidden docs scripts`，匹配 system/ds2/feedback/memory/manifest/registry 文件名 |
| B005 | `cat docs/design-system/README.md` |
| B006 | `git status --short --branch` |
| B007 | `git rev-parse HEAD` |
| B008 | `node scripts/validate-design-system.js --query 记忆` |
| B009 | `cat docs/design-system/contracts.md docs/design-system/activation-policy.json` |
| B010 | `node scripts/validate-design-system.js` |
| B011/B012 | `node scripts/validate-design-system.js --show PAT-MEMORY` / `--consumers PAT-MEMORY` |
| B013 | `cat` 笔记 memory 页 wxml/json/wxss |
| B014 | `rg -n` 笔记 memory 控制器及 memory-session 的 assess/资源/恢复/前进线索 |
| B015 | `node scripts/validate-design-system.js --query recall` |
| B016/B017 | `node scripts/validate-design-system.js --show CMP-KNOWLEDGE-CARD` / `--consumers CMP-KNOWLEDGE-CARD` |
| B018 | `python3 -c` 从 registry 读取 designSystemVersion/activation/legacyReferences/sourceBaseline |
| B019 | `cat` 笔记 memory-session 与 memory/index.js |
| B020 | `rg -n -C 4` 常识 guide 自评、政治 practice 引擎及 knowledge-card-surface 的回忆处理 |
| B021 | `cat` 上文三份历史规范/笔记快照；未跟随 evidence 链接 |
| B022 | `rg -n` DS 验证器及激活工具的读取、evidence、audit/activation 实现线索 |
| B023 | `cat scripts/lib/design-system-activation.js` |
| B024 | `python3 -c` 读取 guide-session 228—242 行 |
| B025 | `rg -n -C 3` 政治 practice/detail/route index 控制器的自评及 advance 处理 |
| B026 | `node scripts/validate-design-system.js --audit-base 90b56f784c865c3d24b1a05c17ce7edf71d28897 --json` |
| B027 | `rg -n 'memory-session\|createMemoryEngine\|knowledge-card-surface' miniprogram`，仅 js/json/wxml，排除 models/evidence/node_modules |
| B028 | `rg -n 'handleSharedRecallResult\|handleSharedBackToReading'` 政治 js，排除 models/evidence |
| B029 | `node scripts/validate-design-system.js --query 状态`，退出 1、0 项；这是检索未命中，不是激活失败 |
| B030 | `rg -n` 历史空间规范中的触控、字号、品牌、错误和反馈条款 |
| B031 | `node scripts/validate-design-system.js --query loading` |
| B032 | `rg -n -C 3` 政治组件 wxss 和 practice wxml 的反馈条件 |
| B033 | `python3 -c` 读取 knowledge-card-surface JS 1—39 行及 WXML 44—76 行 |
| B034 | `python3 -c` 读取 DS 验证器 1—35、125—135 行，确认扫描行为 |
| B035 | `node scripts/validate-design-system.js --show PAT-STATUS` |

需要如实保留两项边界偏差：B002/B004 的包含 glob 位于排除 glob 之后，导致文件名输出含 models/evidence 路径；没有直接打开这些目标文件。更实质的是执行任务允许的只读验证器后才在 B022/B034 发现：全量 validate() 会遍历 miniprogram 下全部 `.json` 判断 component，walk 只排除 .git/node_modules，因此 B010/B026 会间接读取 models JSON。未执行或输出题库/打包内容，但不能声称工具完全未读取它们；本次严格无 models 读取的隔离条件未完整满足。发现后未再运行全量验证，后续查询不加载业务数据。若本场景要求零间接接触，本回执应标记这一污染边界，另以修正后安全范围的新上下文复核，不能隐去事实。

未读取个人记忆、历史聊天、其他工程树或其他场景记录，未主动打开任何 evidence 文件或评估结果文件；历史规范中自带的完成叙述不作为当前验证依据。除本原始回执与记录器日志，没有写其他文件，也没有修改产品、治理登记或 Git 状态。
