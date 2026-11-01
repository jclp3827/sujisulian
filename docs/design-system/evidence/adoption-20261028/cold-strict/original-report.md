# DS-2.3 严格只读冷启动原始报告

任务：只读发现当前工程规则、核实激活、查询普通学习操作及训练专项，作出新增限时手势控件的实施选择。不开发功能。

## 结论

当前唯一规范入口为 `docs/design-system/README.md`；治理版本 `1.0.0-ds2.3`，产品体系 Design System V1.0，阶段 DS-2。索引、契约、registry、激活策略版本一致。当前证明工作树实际已继承正式共同基线，激活模块返回 `ok:true / adopted-common-baseline / formal:true`。main 没有包含正式接入提交，不能声称 main 已接入。

新增“限时手势控件”选择：**新建 C 类业务专用能力，归入 PAT-TRAINING 的专项范围；外围普通操作可复用或配置 PAT-ACTIONS 的 btn-base。** 这不是要求新建另一套框架，也不是授权本轮实施。登记只提供现存专项模式，未发现可直接配置得到该新增手势协议的通用组件；目前证据不足以把它视为 B 类公共按钮扩展。若后续确定它恰好就是既有滑杆或手写语义，可改为在对应 C 类页面内部复用/限定扩展，须重新核对事件、状态、消费者，而不是预先抽取全产品手势层。

**不允许据此全面迁移现有训练。** DS-EXP-001、PAT-TRAINING 明确保留限时、手写、滑杆及认知任务独立性；A/B 公共能力存在不构成迁移授权。DS-2.3 正式接入仅是治理授权，不授权 DS-3、产品行为变化或发布。

## 自主发现链及读取边界

所有读取/查询 shell 均通过任务指定 record.py，cwd 固定 `/private/tmp/miniprogram-ds2-onboarding-proof-20261028`，输出目录固定 `/private/tmp/peanut-ds2-adoption-20261028/cold-strict/commands`，label 各不相同。未使用个人记忆、父对话业务结论、其他工作树、任何 evidence 正文或历史汇总/评估结果；未读根 README、知识平台 README、历史专项正文、题库或打包数据内容。首次发现仅查看文件名，其中历史/evidence 文件名没有进入正文读取。

实际读取链：

1. `discover01`：find 文件名，发现根 AGENTS、docs/design-system、activation-policy 和激活实现路径。
2. `entry02`：读取 AGENTS；由其明确指定唯一当前 DS 索引及查询方式。
3. `index03`：读取唯一索引，发现当前版本、契约/登记、激活三态、正式引用与批准回执路径，以及专项边界。
4. `queries04`：首先尝试 `--query button/action/训练/限时/手势`，0 命中、退出 1；保留失败，没有将其解释为没有能力。后按独立角色词查询。
5. `files05`：仅读取当前 contracts、activation-policy、adoption-approval 三份规范/激活记录；`git06` 确认当前分支与工作区；`validator07` 定位限定查询和激活入口。
6. `query08 / query09`：分别查询“操作”“训练”，得到 PAT-ACTIONS、PAT-TRAINING；`activation10` 只读激活实现；`registry11` 提取版本、activation、legacyReferences 元数据。
7. `actions12 / training13`：使用 --show 获取两个已发现 ID；`consumers14 / consumers15` 使用 --consumers。工具显示的大输出有截断，完整原始 stdout 仍由记录器保存；随后通过直接登记字段及重新限定查询缩短输出补足关键信息，没有读取他人证据。
8. `activation16`：独立调用 `scripts/lib/design-system-activation.js` 的 validateActivation；没有调用默认 validate。`refs17`：只读 Git 引用；`ancestry20`：直接核对四组祖先关系；`receipt21`：从独立授权引用读取批准回执，而非只相信工作区文件。
9. `training18 / actions19`：定向读取登记项及 recipe 消费者；`source22`：只在两个样式入口、训练 session/estimation 和 cognition session 必要当前源码内检索按钮、定时器、canvas、touch 等角色线索。
10. `query23`：查询“记忆”，得到 PAT-MEMORY(B,draft)；`query24` 查询 gesture 为 0 命中/退出 1；这是受关键词限制的未命中，不证明全仓无任何可用手势代码。`query29` 以“手写”成功定位 PAT-TRAINING，说明中文角色检索可用。
11. `source25`：定向读普通按钮样式、固定学习栏样式、训练计时/手写处理和常识学习页操作线索；`source26 / source27` 只定位并读取 estimation 触摸处理邻域；`consumer28` 将 PAT-ACTIONS 的 --consumers 结果缩短输出；`status30` 再核对工作区。

未执行默认全量验证、--audit-base、自测、构建、业务代码加载或线上调用。require 仅用于 JSON 登记、Node 内置库和已检查的纯工程激活模块。所有必要业务源码仅当作文本读取。

## 实际激活与 Git 证据

当前工作树路径：`/private/tmp/miniprogram-ds2-onboarding-proof-20261028`。

当前分支：`codex/ds2.3-onboarding-proof-20261028`。

HEAD：`eb9d8128f4593c83e297c07960cf0730f24e0f89`。`git06 / status30` 均仅输出分支行，没有 modified/untracked 条目。

授权 ID：`DS2-FORMAL-ADOPTION-20261028`，scope 为 `governance-adoption-only`。

授权引用：`refs/codex/design-system/adoptions/ds2.3-common-20261028` 实际指向 `eb9d8128f4593c83e297c07960cf0730f24e0f89`。从该引用读取的已提交批准回执为 approved、版本 `1.0.0-ds2.3`，绑定：

- 目标引用 `refs/heads/codex/design-system-common-baseline-ds2.3`；实际指向同一 eb9d8128。
- sourceBaseline `90b56f784c865c3d24b1a05c17ce7edf71d28897`。
- sourceCandidate `771fb922f3c0b12ad2bc55b3c2c8ed9de08cc69f`。
- adoptedCommit `87bdcb1fcb90b0887a7e6ac8a99a2942839a9f45`。

ancestry20 的 `git merge-base --is-ancestor` 实测：

| 祖先 → 后代 | 退出码 | 含义 |
| --- | --- | --- |
| 审定候选 771fb922 → 正式接入 87bdcb1 | 0 | 接入继承审定候选 |
| 正式接入 87bdcb1 → 当前 HEAD | 0 | 当前树继承接入 |
| 正式接入 87bdcb1 → 正式共同目标引用 | 0 | 目标分支包含接入 |
| 正式接入 87bdcb1 → main | 1 | main 不包含该接入 |

main 当前引用为 `90b56f784c865c3d24b1a05c17ce7edf71d28897`。结论依据引用、批准回执、祖先关系与激活模块一致，不依据分支名字或 registry 布尔值。激活模块还核对正式接入提交内登记声明及版本、授权范围。其信任边界是记录和 Git 一致性，不是人类签名的密码学认证。

## 普通学习操作与训练能力

PAT-ACTIONS 为 B 类、draft、源码已存在（observed=true，not-design-approved），入口 `miniprogram/styles/ui.wxss`、`miniprogram/styles/session.wxss`。它是 Pattern，不是一个共用组件；directConsumers 为空不能解释为没有真实样式使用。

普通操作优先评估 `.btn-base`，已有 primary/secondary/ghost、large/compact、pressed 等配置。普通流式操作与固定学习栏分别处理，后者 `.session-action-dock` 为 fixed，含 safe-area-inset-bottom，不能因为复用按钮就移动底栏。控制器继续负责操作锁、下一步、忙碌和业务提交。`.ui-button` 是另一已有样式入口，查询未找到注册页模板使用；不能因此删除，也不能把 API 合并当成已获批。

consumer28 从注册页和导入模板字面类扫描得到 `.btn-base` 18 个页面消费者：

`pages/note/index/index`、`pages/common-sense/index`、`pages/politics/index`、`pages/training/catalog/index`、`pages/cognition/guide/index`、`pages/cognition/session/index`、`pages/training/session/index`、`pages/training/result/index`、`pages/training/wrong-book/index`、`pages/training/assumption/index`、`pages/training/estimation/index`、`pages/training/ratio-sense/index`、`subpackages/photo/process/index`、`subpackages/note/detail/index`、`subpackages/common-sense/detail/index`、`subpackages/politics/route/index`、`subpackages/politics/route/units`、`subpackages/politics/practice/index`。

PAT-ACTIONS 另有 24 个 rolePages、34 个 candidateApplicablePages；它们不等于该组件直接使用，也不等于全部已生效。常识 learning 页的 settings-close 返回学习、guide-settings-action 等是操作角色线索，不能冒称都用了 btn-base。

PAT-MEMORY 为 B 类 draft，短查询返回揭晓/记忆反馈能力，支持按任务保留自动前进或停留核对；自评不作答错，展示不接管评价。本轮未对其源码、消费者展开，因此不作该实现全面适配结论。

PAT-TRAINING 为 C 类、draft、observed，入口是 training/session/index.js、training/estimation/index.js、cognition/session/index.js。登记状态包括 running、submitted、next、timed、handwriting、slider、result。它保留专项规则，不授权全面迁移。

consumers15 的 directConsumers 为空；6 个相关角色页为 training/catalog、cognition/guide、cognition/session、training/session、training/result、training/assumption（均为 pages 下 index）。登记的根容器线索强度为 role-clue，不能作为同一公共组件或全状态已证明。10 个 candidateApplicablePages 包括 home、wrong-book、estimation、ratio-sense 等；候选范围不能提升为真实消费者。

当前源码补充了比根容器更具体的事实：

- training/session/index.js:210–236：onUnload 清理 timer，startSession 保存时间与 records 并启动 tick，tickTimer 显示 elapsedText。它是当前页面实现事实，不代表通用倒计时控件。
- 同文件 :322–375 与 session/index.wxml:156–163：手写 canvas 的开始/移动/结束/取消事件及坐标转换、画笔/橡皮擦状态存在于页面内部。
- training/estimation/index.wxml:64：专项滑杆绑定 touchstart/move/end；index.js:186–211 中按几何位置算比例，限制 5–95 并计算 userA/userX，紧邻 submitAnswer 的业务判定。由此不能把整段提成无业务副作用的全局手势控件；5–95 等数值也未被 DS 原则批准。
- 训练确认按钮仍使用 btn-base，说明“专项内部独立、外围普通操作复用”能在现存源码中同时成立。

## 新控件实施选择及授权边界

1. 角色先定为限时训练的连续/精细手势输入，属于 C 类专项；不是普通点击提交、自评或客观答案状态。
2. 当前推荐新建一个限定训练消费者的 C 类能力，并在后续正式实施时关联 PAT-TRAINING、DS-CMP-001/002、DS-EXP-001，登记来源、事件、状态、例外与实际消费者。当前不写入登记、不实现控件。
3. B 类 btn-base 适合其外围开始、确认、重试等普通操作；配置已有按钮变体即可，保持流式/固定底栏原行为。按钮本身不承担持续手势识别、计时截止和训练完成协议，因此不选择把 PAT-ACTIONS 强行扩展为通用限时手势层。
4. 已有 estimation 滑杆与手写画布各带不同语义和页面状态；不能直接宣称它们可配置复用成任意新增手势。新需求若与其完全同角色，可在后续任务以最小 C 类扩展替代新建决定；本轮不声称已经证明不存在可复用逻辑。
5. 计时事实、阈值、答案、评分、队列、进度、完成条件、持久化及恢复由模块管理；展示/输入能力仅接收任务/内容身份、允许状态及业务提供的计时事实，发出输入或意图。后续要明确运行、处理中、禁用、结果、异常、取消、返回恢复及过期手势处理，不能跨题误触。具体交互、数值和生命周期改造须对应产品授权。

## approved、draft 与历史专项

approved 是明确范围内的产品原则：六层职责、四模块皮肤、客观错误红色与自评语义独立、业务/展示分离、两种选择模式、两种自评前进模式、设置/卡片角色、阅读独立、训练参考边界等。原则批准不等于当前具体红色、尺寸、时限、滑杆阈值、实现或设备视觉效果批准；更不自动批准改变现存行为。

registry 的所有实现/Pattern 仍为 draft。implementation.observed 表示源码存在，baseline 表示观察来源，真实引用也不会使其变 approved。DS-FND-002、DS-SEM-003、DS-PAT-005 等契约本身也有 draft 状态，不能偷偷当成已验收产品规则。

legacyReferences 是历史和专项关系元数据：08-spatial 文档不整体提升为全产品批准规则；政治阅读规则保留政治阅读既有范围；reading-surface-policy 的实际启用范围可能大于历史样板，DS-2 不补批也不要求缩回。没有读取这些历史正文，也未据此下结论其具体条款当前已执行。历史“已测试”不能作为当前设备验收。

若当前源码和原则出现差距，应记录源码事实→规则ID/状态→消费者和风险→保留/适配/需授权，先保留行为；不静默改业务，也不为满足自动检查修改事实。

## 未验证边界及交付状态

本轮已验证的是限定能力发现、所列静态来源与消费者关系、工程激活记录及 Git 祖先一致性；**没有运行默认全量检查，不宣称全量验证通过**。全量检查由外层执行。

未做默认 validator、audit-base、激活自测/fixtures、其他测试、构建、运行时动态可达性、页面几何、模拟器、设备、触控体验、计时准确性、业务流程或发布验收；没有验证全部训练实现或全部候选范围。consumer 查询是静态证据，不证明所有交互状态。本轮也未核验正式接入的全产品零差异，因为属于外层完整检查范围。

仓库、Git、规范及其他报告均未修改。唯一报告产物是本文件，另有指定记录器日志。工作区末态仍无 modified/untracked 条目。任务完成于只读实施选择层。
