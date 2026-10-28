# DS-2.3 独立只读发现原始报告

执行日期：2026-10-28。唯一工作目录：`/private/tmp/miniprogram-ds2-onboarding-proof-20261028`。本报告是新执行上下文从当前树自行发现规则、检索能力与源码后形成的规划判断，没有开发功能。

## 读取与执行边界

全部 shell 读取和查询均经指定外部记录器包装，日志目录为 `/private/tmp/peanut-ds2-adoption-20261028/cold/commands`；发现命令 label 从 `01_inventory` 至 `42_status_final`，另有 `43_report_written` 核实报告已写入，每个唯一。日志保存完整 argv、UTC、退出码、原字节 stdout/stderr。本报告之外仅记录器写日志；未修改仓库、Git 状态、授权引用或规范。首末 `git status --short --branch` 均只有分支行，没有修改项。

没有读取个人记忆文件、父对话、其他工作树、任何仓库 evidence/评估结果、历史专项正文、题库或打包业务数据内容。文件名发现输出中出现 evidence、模型数据和历史专项路径，但没有打开它们。`adoption-approval.json` 是当前索引明确要求核验的正式授权文件，并非 evidence 评估报告；同时读取其独立 Git 授权引用绑定的版本。查询工具输出中名为 evidence 的登记字段只是当前 registry 内的源码位置线索，未据此打开历史报告。

没有运行默认全量验证、audit-base、自测、构建或业务代码。实际运行的 Node 命令只有仓库发现的 `--query`、`--show`、`--consumers` 限定查询，以及只调用 `scripts/lib/design-system-activation.js` 的激活核验。后者仅加载 Node 内置库、该治理模块和 registry JSON，没有加载业务模块。已抽读 CLI 分派和激活源码确认限定查询不会调用默认全量 validate。

## 当前入口、规则及有效范围

先发现并完整读取当前 `AGENTS.md`、根 `README.md`、`docs/design-system/README.md`，再读取当前 `contracts.md`、`activation-policy.json`、`adoption-approval.json` 和 registry 的相关项/顶层元数据。有效治理包是 `1.0.0-ds2.3`，产品体系 Design System V1.0，阶段 DS-2。根 README 是工程介绍；唯一规范入口是 design-system README，历史专项不是替代入口。

AGENTS 要求先定位角色，再查登记、源码、真实消费者与示例，明确复用/配置/扩展/新建；公共能力不接管题库、评分、答案、记忆结果、队列、进度、完成或持久化。笔记、常识、政治优先横向治理，保留模块皮肤与阅读正文；训练只作成熟实践参考，C 专项是正常成员。未授权产品行为改变不能由 approved 原则反向授权。

已批准且与本任务直接相关的契约包括：DS-THM-001 模块身份与状态分离，DS-SEM-001 客观错误红色但未批准具体色值，DS-SEM-002 记忆自评不等于客观对错，DS-CMP-001/002 复用分类、业务边界与消费者核对，DS-PAT-001 输入事实不改统计，DS-PAT-003 自动前进和停留核对两种自评模式，DS-EXP-001 任务独立、训练专项合理独立，DS-EXP-002 阅读正文独立，DS-EXP-003 分层证据，DS-GOV-001 版本/消费者闭环。

具体视觉数值与几何 DS-FND-002、操作状态候选协议 DS-SEM-003、组合体验 DS-PAT-005 为 draft。所有实现/Pattern（包括本次三项和知识卡组件）仍是 draft；implementation.observed=true 仅表明源码存在，baseline 是观察基线，不是批准设计。候选状态、实现草案和正式治理激活是不同维度：治理正式接入并不把草案实现批成 approved。

历史专项仅从当前索引和 registry.legacyReferences 得知：空间 UI 不整体升级为全产品规则；政治阅读规则保持政治阅读原批准范围；当前 reading-surface-policy 源码启用范围可能大于历史样板，DS-2 不补批其历次扩展，也不要求缩回旧样板。本任务没有读取专项正文、没有核实所有阅读源码启用页，不能声称历史专项已在全产品正式统一。四模块皮肤、阅读排版与训练专项差异是规则明确允许的差异，不能按视觉相似机械合并。

## Git 继承与实际激活结果

当前分支 `codex/ds2.3-onboarding-proof-20261028`，HEAD `eb9d8128f4593c83e297c07960cf0730f24e0f89`，工作树干净。共同目标 `refs/heads/codex/design-system-common-baseline-ds2.3` 与独立授权引用 `refs/codex/design-system/adoptions/ds2.3-common-20261028` 当前也指向 eb9d812。不是凭名字断言生效：

- `--query` 和消费者查询均先调用 validateActivation 并成功，输出 `activationState: adopted-common-baseline`。
- 单独范围核验（31）返回 `ok:true`、`errors:[]`、实际 branch/HEAD 如上、`formal:true`。
- 授权引用中的已提交回执（32）为 approved，绑定版本 `1.0.0-ds2.3`、授权 `DS2-FORMAL-ADOPTION-20261028`、指定共同分支、来源候选 `771fb922f3c0b12ad2bc55b3c2c8ed9de08cc69f`、来源基线 `90b56f784c865c3d24b1a05c17ce7edf71d28897`、正式接入提交 `87bdcb1fcb90b0887a7e6ac8a99a2942839a9f45`。
- 自行祖先检查（20）确认来源候选和正式接入提交都在 HEAD 祖先内；核验函数另检查正式提交在共同目标祖先内，并核对正式提交中的 registry 声明及独立正式授权范围。
- 相对 90b56f7 的 `miniprogram/cloudfunctions/assets-source` 路径差异为空；38 的三对产品树对象完全一致，分别是 `421c7dde...`、`328ecd0d...`、`5cfd4b9e...`，且与 registry.sourceIdentity 对应。这是内容身份检查，没有打开数据内容。证明此观察树未混入其他产品增量，不能仅引用声明的 B5ProductDeltaImported=false 作证。
- 本地 main 为 `90b56f784c865c3d24b1a05c17ce7edf71d28897`；正式接入提交不是 main 祖先（20 内部子命令 exit=1，是预期的否定结果）。39 对 main 只列文件名，AGENTS/design-system 范围输出为空。**此树已继承正式独立共同基线，不等于 main 已接入。**

有效范围是含正式接入提交且满足授权引用/版本/目标约束的当前开发树及共同基线；旧树不自动受本树 AGENTS 约束。候选授权 candidateGrants 只有 candidate-only，不授权正式接入。新 clone 缺独立授权引用会失败。正式后普通开发允许产品变化，不是永久产品冻结，但治理新版本需要对应授权。范围检查不能证明人的密码学身份，也不授权 DS-3、产品改动或发布。本次没有检查其他工作树的现场状态、main 工作区内容或远程状态。

## 自行发现的检索能力和关系区分

由 AGENTS/索引发现 `node scripts/validate-design-system.js --query <角色词>`、`--show <ID>`、`--consumers <ID>`，再抽读脚本确认能力边界。query action 返回 PAT-ACTIONS（另有公式项关键词误匹配，不构成适配理由）；记忆返回 PAT-MEMORY；训练返回 PAT-TRAINING；回忆返回 CMP-KNOWLEDGE-CARD。均按角色继续核对，未把搜索命中等同适用批准。

三个 Pattern 的 `consumers/directConsumers` 都为空，因为不是一个可引用组件；rolePages 是角色相关页面，applicablePages 是候选适用集合，candidateEvidence 是弱线索，三者不能互换。`--consumers` 对 Pattern 核对登记的角色源码线索，不是全业务状态扫描。训练登记中首页、错题本、估算、比例感的若干原根容器线索已被降为候选；本报告不把它们说成已使用统一专项组件。源码抽读额外确认估算确实存在滑杆/手写，但该事实不会自动改写登记状态或批准其实现。

PAT-ACTIONS 的 btn-base recipe 静态消费者有 18 页：笔记首页、常识首页、政治首页；训练 catalog/session/result/wrong-book/assumption/estimation/ratio-sense；认知 guide/session；照片 process；笔记 detail；常识 detail；政治 route/index、route/units、practice。route/index 包括导入 guided-route.wxml 的匹配。ui-button recipe 当前静态消费者为零。若改公共 ui.wxss，需审这 18 页及实际新增消费者；“零消费者”不能据此删除 ui-button。PAT-ACTIONS 的角色页有 24、候选适用页有 34，均不应冒称 34 个组件消费者。

PAT-MEMORY 的角色页为笔记 memory、常识 learning、政治 practice/route/detail 五页。CMP-KNOWLEDGE-CARD 才是真实 B 组件：限定消费者查询核对 usingComponents，只发现政治 detail/route/practice 三页直接使用 knowledge-card-surface；笔记 memory 的 usingComponents 只有 math-formula 与 note-example，不使用这个知识卡组件。

## 场景一：常识内容下方新增普通下一步操作

实施选择：**复用 PAT-ACTIONS 的现有 btn-base 样式 recipe，以模块适配层配置动作语义和状态，保留随内容滚动的普通流式布局；当前没有证据要求新建按钮组件。** 主次按钮角色依任务确定，不把 btn-primary 的当前值说成已批准数值。全局 app.wxss 已导入 ui.wxss/theme/module-skins；不需为了使用按钮而搬迁整页或替换正文。

源码依据：ui.wxss:342 起 btn-base 定义基础按钮，373 起主/次/ghost 变体；同文件 86 起还有 ui-button，两个 API 并存且未批准合并。session.wxss:92 起 session-action-dock 明确 fixed、安全区 padding；它是固定学习底栏角色，不是新增普通下一步的默认布局。

特别核实了常识 detail 的现有去练习按钮（WXML:331）：它使用 btn-base btn-primary，但 detail-actions 在 WXSS:1101 明确是 fixed。**这个示例能证明按钮样式复用，不能证明普通下一步应放固定底栏。** 新普通动作应另用页内流式容器，不能复制该 fixed wrapper。现有去练习入口和固定栏行为保持；任务未指定 detail 或 learning 的精确承载页，本报告只确定角色选择，不能借假设替换原动作。

模块负责下一项内容身份、可前进条件、加载/处理中、防重复、失败重试、返回恢复；样式不推进队列、写进度或重算总量。若未来操作异步，要在适配层核对当前内容身份，防旧事件落到下一项。验收规划包括正常/按下/禁用/处理中/结果/异常、长正文后位置、固定旧栏避让、恢复同内容与滚动、设备安全区；本任务均未执行。

## 场景二：笔记新增记忆反馈表现

实施选择：**复用 PAT-MEMORY 的语义与状态模式，优先配置/扩展笔记现有页面表现和薄展示适配；保留当前自评后自动前进。** 不为家族感把政治 knowledge-card-surface 整体迁入笔记，也不将 missed/fuzzy 自动显示为答错红色。DS-SEM-002 与 DS-PAT-003 是 approved；具体反馈数值、动效、配色、停留时长及当前 Pattern 实现是 draft/待审。

源码事实：笔记 memory WXML:36 自评按钮传 remembered/fuzzy/missed/skipped；前三者受 imagesReady 禁用，跳过独立可用。index.js:22-28 揭晓调用 engine.reveal，评价先检查图片就绪，保存位置，调用 engine.assess 后立即 show；memory-session.js:35 校验自评结果及必要揭晓，写事件/评价后 v.index++，所以现有策略是自动前进。show/onShow/savePosition 等有当前卡、轮次、揭晓、滚动及图片代际的恢复/隔离逻辑；错误/空/过期/完成各有现有入口，不可为了新反馈统一抹平。

常识 guide-session.js:228-238 同样评价后 session.index++。政治 practice handleRecallResult 调 assessRecall 后 render，handleNext 才 engine.advance；politics-practice-engine.js:349-353 保存 outcome 而不增加 index，且已存在 outcome 会拒绝重复自评。这是合理的停留核对差异，不能把三模块全部改成一种模式。政治组件 knowledge-card-surface 接受 recallView 等展示输入，handleRecallResult 仅 triggerEvent('recallresult',{result})，由页/引擎判断；它不是跨模块共享记忆引擎。

新增表现若确实需要共享构件，应先定义最小纯展示输入（内容/会话身份、revealed、availableFeedback、resourceReady、已给定结果、前进策略）和事件，再判断局部扩展是否足够；业务服务仍管理评价、弱项、持久化、队列与前进。不能让新展示为了显示“已评价”而再次提交，也不能延迟自动前进并让旧事件评价新卡。若产品确实要把自动前进改成停留核对，这超出“新增表现”默认范围，需明确行为依据。本任务不实施该改变。

共享 Pattern 若修改，五个角色页需评估；若改知识卡组件，三个真实政治消费者需回归。仅改笔记展示不因此扩大组件消费者范围。规划验收涵盖揭晓前后、资源未就绪/失败、四种自评、连点、下一卡身份、完成/空/过期/错误、来源往返与恢复，未运行。

## 场景三：行测速练新增限时手势专项控件

实施选择：**新建训练域 C 专项能力，或者在明确同一手势契约后局部扩展现有训练实现；默认不升级成跨产品 B，也不全面迁移行测速练。** 本任务没有给出手势的精确类型，因此规划默认新建 C 薄控件/适配器并登记明确消费者；若后来证实是现有拖动分配条的同角色变体，才改为配置/局部扩展。普通外围按钮、主题与已给定进度可复用公共能力。

实际源码：estimation WXML:56-64 有 es-slider-area/track/handle，catchtouchstart/move/end；JS:186-211 捕捉横坐标、按 sliderRect 计算比例，并直接用 workB 推导 userA/userX。该现有实现夹带拆分估算业务计算，不宜直接抽成所有模块的通用手势组件，更不能把其中 5..95 约束当批准范围。submitAnswer:213 后由训练域计算偏差与结果。session 与 estimation 都有 canvas 手写及 touchcancel→endHandwriting，session JS:322 起维护笔画/橡皮擦/坐标；这与普通按钮的离散点击契约不同。

session JS:214-229 的 startSession/clearTimer 管时间与训练开始事实，onUnload 清理；estimation 也有计时和卸载清理线索。新增限时控件不能把动画时间充当业务截止，也不能由公共 UI 判题、修改 records 或完成条件。C 控件可只接收阶段/截止或剩余事实/允许输入/内容身份，输出手势开始、变更、结束/取消意图；训练适配器决定接受、超时、提交和结果。此为规划接口，不冒称现有源码已经如此分层。

PAT-TRAINING 的 C 定位、DS-EXP-001/DS-CMP-001 允许专项独立，已有成熟训练不是待公共化缺陷。规划验证要覆盖运行/提交/下一题/超时、触摸取消、滚动竞争、多点或越界、重复事件、前后台/退出恢复与计时清理；手写/滑杆设备几何与性能单独验收。没有读取题库或运行生成器，也未验证这些行为。

## 失败、截断处理与未验证边界

限定查询和范围核验没有硬失败。20 的 adopted_in_main 内部 exit=1 是所求否定事实，不是工具故障；外层 Python 正常保存了各子命令结果。多命令工具回显曾发生截断：13 的动作登记通过17补读尾部；23 的记忆控制器结果通过25完整补读；22 的模板关键下部通过28补读；24 的消费者结果通过37读取保存输出并去掉冗长源码字面量后完整检查关系、候选范围与18页静态 recipe 消费者。没有把被截断的输出当成完整读取，未声称逐字复核所有无关登记。

当前结论只证明规范发现、限定静态消费者检索、源码抽读和 Git 激活/身份一致性。未执行全量 DS 工程检查、变量/覆盖审计、audit-base、业务或控制器测试、编译、模拟器、真实页面几何、真机、云端或发布验证；这些由外层按授权另做。没有从源码事实推断视觉已验收，也没有从正式治理状态推断 main、发布候选或其他树已接入。

最终：三个场景分别选择“普通按钮 recipe 复用并配置流式动作”“记忆 Pattern 复用、笔记局部表现扩展且保留自动前进”“合理新建/局部扩展训练 C 专项”。正式共同基线提供治理规则，并未批准三个新功能、现值视觉或业务策略改动。
