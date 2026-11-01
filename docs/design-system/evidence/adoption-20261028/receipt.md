# DS-2.3 正式共同开发基线接入回执

治理版本 **1.0.0-ds2.3** 已按本轮授权接入本地独立共同开发基线 **codex/design-system-common-baseline-ds2.3**。完整验证实际返回 **adopted-common-baseline / formal:true**。这是已验证的独立共同分支，**不是 main 已接入，也不是产品发布**。

## 提交与批准依据

|身份|Git 身份|
|---|---|
|原不可变治理|b32587f434d8fff93031ae731944c61b53039085|
|已审定修正|64ba11f700f6c71ccfa0fc8aec4b55eade73a15e|
|已审定预集成|771fb922f3c0b12ad2bc55b3c2c8ed9de08cc69f|
|原目标/main，保持不动|90b56f784c865c3d24b1a05c17ce7edf71d28897|
|正式治理声明 adoptedCommit|87bdcb1fcb90b0887a7e6ac8a99a2942839a9f45|
|独立批准回执提交|eb9d8128f4593c83e297c07960cf0730f24e0f89|
|共同开发目标|refs/heads/codex/design-system-common-baseline-ds2.3|
|固定授权引用|refs/codex/design-system/adoptions/ds2.3-common-20261028 → eb9d8128f4593c83e297c07960cf0730f24e0f89|

正式授权 ID 为 DS2-FORMAL-ADOPTION-20261028，来源为当前用户「Design System DS-2.3 正式共同基线接入」，具体范围见 [authorization.md](authorization.md)；已提交批准记录为 [adoption-approval.json](../../adoption-approval.json)。声明和批准分两次提交，避免提交 SHA 自引用；最终仅追加治理证据，不重写上述恢复点或授权引用。共同分支最终 HEAD 见包含此回执的 Git 记录及最终对话回执。

第三个独立接入工作树：/private/tmp/miniprogram-ds2-adoption-20261028。继承完整预集成提交，没有修改原 DS、修正或预集成树。另建 /private/tmp/miniprogram-ds2-onboarding-proof-20261028，从共同分支建立新任务分支 codex/ds2.3-onboarding-proof-20261028，用于实际接入与新上下文验证；它保留在批准回执提交 eb9d812，仍真实继承正式声明。

## 接入前及修改范围

[preflight.json](preflight.json) 证明 main 仍是原目标；771fb922 的唯一父提交为 90b56f7，预集成树干净，精确差异为108个治理文件，产品差异为空。主目录对应路径只有两个既有 README，均与目标已提交正文一致，没有新 AGENTS/规范/验证器同名冲突；其13个产品修改和1643个未跟踪文件全部保留。

全部实际接入文件及本轮相对预集成的变化见 [changed-files.json](changed-files.json)。原108个治理文件完整继承，97份历史证据逐字节保留；contracts 和 registry 除 activation 外完全不变，仍是18契约/15 approved 原则/3 draft 契约、30登记/10组件/20Pattern/38注册页，所有登记实现仍为 draft。

本轮修改仅为：AGENTS 与当前索引的正式接入说明、registry.activation、独立正式授权策略与批准记录、激活校验的小幅配套、自测，以及本目录证据。没有产品页面、WXSS、业务组件、学习引擎、题库、云函数或源资产变化。未迁入 B5 或发布候选额外内容。

激活配套保留原三态与检查能力：明确正式授权不再被旧候选请求硬编码挡住，同时历史 candidate-only 授权继续禁止正式激活；正式授权绑定版本、来源候选和实际目标，来源候选须为正式声明祖先。不通过 formal 布尔值获得状态，不跳过 Git 引用或祖先检查。工具是 Git/记录一致性检查，不是人的密码学签名认证。

## 自动验证及原始记录

[raw/commands.jsonl](raw/commands.jsonl) 保存实际 argv、cwd、UTC、退出码和原字节 stdout/stderr 哈希。结果：

- 授权引用尚未建立时，完整检查按预期失败，唯一错误为 ACTIVATION_FORMAL_AUTHORIZATION_RECEIPT；见 01-before-authority.stdout。登记先声明正式状态不能自行生效。
- 正式绑定后完整验证通过，actual.formal=true；以90b56f7审计的 changedProductFiles 为空，见03-adopted-validation.stdout。
- 原41项全部保留，并新增10项正式激活检查，**51项通过**，见04-full-selftest.stdout。包含未授权/草案回执、错误版本、错误目标、当前HEAD缺少祖先、正式授权与目标不符、未审定来源候选；原产品漂移正反例继续通过。故意破坏均在临时JSON/一次性Git仓库，未改真实授权引用或业务源码。
- 正式状态证明已接入祖先，不将日常开发产品永久冻结。新增反例专门验证：后续产品变化仍保留接入身份，但 audit 明确列出文件和视觉差异。本轮自身仍须零产品差异，并由09-product-zero和12-binding-proof独立确认。
- 新开发树完整检查通过，状态formal:true、产品差异空，见05-onboarding-validation.stdout。
- 主目录缺失规范入口，外部只读检查明确失败，见06-old-main-not-adopted.stdout；原预集成/修正树各自仍返回preintegration-candidate/isolated-candidate，见07/08，不因共享仓库出现授权引用而被自动升级。
- main不含正式声明的祖先检查退出1（预期），见10-main-does-not-contain-adoption；共同目标、当前HEAD和批准提交均含声明，来源候选为声明祖先，见12-binding-proof.stdout及可复跑的verify-adoption.py。

仍有4条非阻断提示：CMP-SESSION-HEAD和CMP-PHOTO-EDITOR消费者待核实；reading-controls的两个可选变量回退。未为消除提示修改产品。

## 独立新上下文

使用两个真正不继承父任务历史的隔离执行上下文（fork_turns=none），没有提供规范路径、组件ID答案或父任务测试结果，启动提示词/参数分别保存在cold-context.json和cold-strict-context.json。

首个上下文完成三场景判断，但入口发现时额外读取了根工程README。它只含工程介绍/当前索引链接，没有历史验收摘要；仍作为读取边界偏差披露，不计最终严格边界验收。43条命令、完整原始答复和流归档保留在[cold/original-report.md](cold/original-report.md)及其manifest，不由父任务改写。

重新建立的严格上下文自主按AGENTS→唯一当前索引→契约/登记/授权记录发现版本，运行限定查询和独立激活核验。它实际检查了来源候选→声明→HEAD/共同分支的祖先，以及声明不在main祖先内；返回1.0.0-ds2.3/adopted-common-baseline/formal:true。它没有读取根/知识平台README、历史正文、评估证据、其他树或业务数据；30条命令均留存。

最终独立结论：普通操作可复用/配置btn-base；新增限时手势合理采用C类专项，外围按角色复用，不能全面迁移训练。approved原则不批准现值数值或draft实现；历史专项仅保留其原范围，不能当当前全产品验收。详见直接生成的[cold-strict/original-report.md](cold-strict/original-report.md)、commands.jsonl、raw-commands.zip及manifest.json。初次组合关键词和gesture未命中均保留原始退出1，改用独立角色词后找到对应能力。

两个上下文都未运行全量静态/自测；外层51项和新开发树完整验证另行记录。原始答复及所有命令流按SHA256核对，归档只打包不修改内容。此次等价隔离执行不是声称另建了用户侧边栏聊天，也不是由当前对话复述规范替代新上下文。

## 受保护工作树核验

本轮起点对22个原注册工作树记录状态、索引、HEAD和Git可见已跟踪/未跟踪文件字节哈希；不存在的旧注册项原样保留，不清理。证据见 [protected-before.json](protected-before.json)、[protected-after.json](protected-after.json)、[protected-final.json](protected-final.json) 和可复跑的verify-protection.py。忽略的缓存不在字节对比范围内。

主目录、独立发布候选、原DS、修正、预集成等核心树均与起点一致。两处并行变化如实保留，不宣称全部原树静止，见 [parallel-observations.json](parallel-observations.json)：

- 生命周期工作树从4f29c368推进至98c01e42，仅新增三份其任务回执，产品哈希未变。
- 照片导出工作树HEAD仍为c17a191，首次核验出现controller.js和index.wxml两处未提交变化；后续并行任务继续修改，共5个已跟踪文件变化及2个未跟踪文件，最终路径详见parallel-observations.json.finalObservation。产品哈希变化，未搬运到本基线。

本任务所有写入仅在新建的DS接入/验证树、外部证据目录，以及明确授权的新分支/引用。没有写入上述并行树，也未回退、暂存或搬运其变化；不能将外部并发写入的作者身份视为已密码学认证。发布候选和主目录无本轮业务/云函数变化。

## 新任务与旧任务如何使用

同一Git仓库的新任务先核对共同分支和固定授权引用，从该分支建立新树，例如：

```sh
git worktree add -b codex/<任务名> <新的绝对路径> codex/design-system-common-baseline-ds2.3
```

新树读取AGENTS→当前索引，报告版本/分支/HEAD，运行完整检查并选择任务自己的审计基线。实际新树验证已经证明此方式可获得规范和正式状态。异地clone还须安全携带共同目标的本地分支、固定授权引用和完整所需Git对象，普通clone默认不携带自定义引用；缺失时应失败并报告，不允许改布尔值补过。本轮未推送或访问远端。

旧任务先保持自身未提交工作和checkpoint，报告未接入或历史候选。未来另获授权后，在独立接入树核对同名文件/源码差异及消费者，再选择继承正式基线并重放任务变更，或评估保留正式祖先的合并方式；不能仅复制/单独cherry-pick文件就声称获得正式接入祖先。不得直接在脏旧树覆盖规范或混入其他任务业务。

main仍由当前工作树使用且有大量保护内容，本轮没有移动它。未来main接入须先由其任务所有者安全处理工作边界，再授权在独立环境接入这条真实历史并核验。若改变正式targetRef，应建立对应授权/回执并复验，不能把当前独立共同分支冒称main。

## 生效与停止点

本地指定共同分支满足正式声明、独立批准记录、固定Git引用、真实祖先关系与验证器状态一致的条件，已生效。没有发现阻断性同范围approved规范冲突，具体数值/候选交互及既有实现差距仍未获补批。

本轮是治理接入验收；静态/新上下文不证明页面几何、设备交互、云端或产品发布。未进行产品界面改造，未重做全量页面/设备验收，未发布。

尚未完成且未自动执行：main接入、旧树传播、远端推送、发布候选合并、DS-3。保留全部新旧恢复点，不清理旧树。
