# DS-2 审定修正与共同基线预集成回执

本轮限定修正与隔离预集成完成。版本 **1.0.0-ds2.3 / schemaVersion 2**；状态 **preintegration-candidate / formal:false**，尚未成为共同开发基线。本目录是本轮证据；上一级初建证据保留为历史，不代表当前验收。

## 提交、工作树与目标

- 不可变原治理：`b32587f434d8fff93031ae731944c61b53039085`，原树保持不动。
- 独立修正：`64ba11f700f6c71ccfa0fc8aec4b55eade73a15e`；树 `/private/tmp/miniprogram-ds2-corrections-20261028`，isolated-candidate，继承原 DS 树而非修改原树。
- 明确共同开发目标：main 已提交状态 `90b56f784c865c3d24b1a05c17ce7edf71d28897`，不含主目录未提交内容。
- 第二独立树：`/private/tmp/miniprogram-ds2-preintegration-20261028`，分支 `codex/design-system-ds2-preintegration-20261028`。其独立候选提交的唯一父提交为上述目标；最终 SHA 见分支 Git 记录及对话回执。
- 独立发布候选 release-copy-cleanup 的 HEAD 为 `80b0ac59c288de9b82371db349ab7cbd1dc02330`，其未提交内容保持不动。

按 [transfer-manifest.json](transfer-manifest.json) 的 47 个精确治理路径转移能力，没有 cherry-pick B5 分支；两个既有 README 仅追加入口、保留目标正文。后续只适配本树身份、关系证据及回执。全部实际文件见 [changed-files.json](changed-files.json)：主要规范/脚本 11 个，其余均为治理证据，无产品文件。

## A—D 修正

**A 激活**：以 isolated-candidate、preintegration-candidate、adopted-common-baseline 三态取代隔离状态硬编码。候选须匹配授权、实际分支、基线祖先、产品树身份及零产品差异；预集成另核对治理来源。正式接入需要未来独立授权的 Git 引用/已提交回执，绑定版本、正式提交及实际共同分支祖先。布尔值、未提交回执或本轮候选授权均不能通过。本轮未创建正式授权引用；正式正例只在一次性合成 Git 仓库内运行。它证明记录与 Git 范围一致性，不是人的密码学签名认证，也不能防止代码及全部授权记录同时被伪造。

**B 范围**：补齐 PAT-ACTIONS 照片处理页 applicablePages；增加角色页与 recipe 消费者范围正反例。未发现其他可证明的同类遗漏，不重新分类。

**C 证据**：consumers 只表示直接组件引用；Pattern 用 rolePages 表示角色相关页，applicablePages 表示候选范围，candidateEvidence 保留弱线索。高频代表项改用真实事件、状态和操作/进度/选择/记忆/阅读结构；根容器不冒充直接使用。保留 30 登记（10 组件、20 Pattern）和 38 注册页，不做全产品重审。PAT-ACTIONS 的 24 角色页、34 候选页与 btn-base 的 18 静态消费者含义不同。

**D 查询**：--query 默认短索引，优先 ID、名称、角色、分类、状态、至多 4 个源码入口及短推荐；--show ID 与 --consumers ID 保留完整登记和分层证据。相同 button 查询原版 22891 字节，修正候选 540 字节；预集成另保留实际输出。

## 目标差异核对

[target-source-reconciliation.json](target-source-reconciliation.json) 记录 108 个源码/示例路径身份，其中 6 个与 B5 观察不同：常识 learning 的 js/wxml、笔记 memory 的 js/wxml、笔记 practice 的 js、笔记 memory-session 服务。登记身份、实际消费者及角色线索按 90b56f 核对，未迁入这些产品差异。弱候选线索仍明确保留 B5 观察来源，不冒称新验证。

目标首次验证失败：索引链接的 `scripts/validate-public-learning-page-runtime.js` 只在 B5 存在。原始失败见 [01-target-before-link-adaptation.stdout](raw-preintegration/01-target-before-link-adaptation.stdout)。改为明确的历史路径说明后通过，没有为了通过而复制该脚本或业务。

## 验证及局限

- 原版完整检查和 22 自测通过，但 [original-known-gaps.stdout](raw-before/original-known-gaps.stdout) 证明旧检查放过照片范围遗漏及无法解析的基线。
- 独立修正完整静态通过、41 自测通过，见 [修正原始命令](raw-correction/commands.jsonl)。
- 预集成 `node scripts/validate-design-system.js --audit-base 90b56f784c865c3d24b1a05c17ce7edf71d28897 --json` 通过；`node scripts/test-design-system-validator.js` **41 项通过**。含三态正反例、未授权激活、产品漂移、治理来源、目标未实际接入、范围遗漏、弱证据和精简查询回归。
- 查询/完整登记/消费者、产品零差异、正式引用为空均有实际命令、cwd、UTC、退出码、stdout/stderr 和哈希，见 [预集成原始命令](raw-preintegration/commands.jsonl)。破坏性检查仅在临时 JSON/一次性 Git 仓库。
- 4 条非阻断提示保留：CMP-SESSION-HEAD、CMP-PHOTO-EDITOR 消费者待核实；reading-controls 的 --pr-muted/--pr-divider 使用可选回退。没有改产品消除提示。

提交前全范围 `git diff --cached --check` 唯一提示是 A2 原始回执末尾多一个空行（退出 2），不是源码错误。为保留独立答复原字节，未修剪该证据；排除这一个原始记录后，其余治理和证据的差异空白检查通过。原始提示见 raw-preintegration/10-raw-report-whitespace.stdout。

静态能检查路径、登记、记录范围和保守变量关系，不能证明动态可达性、全部状态、视觉几何、设备、云端或发布。本轮没有产品界面变化，未重做全量视觉/设备验收。

## 独立新上下文

三个 CLI 临时只读会话均在推理前因账户不支持其默认模型失败；原始流见 [cli-attempts/launch-notes.json](cli-attempts/launch-notes.json)，未计为通过，也未改账户/模型/全局配置。随后使用 `fork_turns=none` 的真实隔离执行上下文，不继承父对话、记忆或答案。

首轮 A/B/D 因读取历史摘要或全量验证间接扫描模型数据，严格隔离边界不足；原始答复保留但不计最终通过。收紧协议后重新创建 A2/B2/D2：

|场景|独立判断|原始答复|
|---|---|---|
|A2 常识普通操作|复用 btn-base；区分普通流式操作、固定底栏和业务推进；区分角色页/真实消费者|[A2](A2.original-report.md)|
|B2 笔记记忆反馈|自评不等于客观对错，不套错误红色或答题引擎，保留模块推进职责|[B2](B2.original-report.md)|
|D2 行测速练专项|专项核心可合理为 C 类；外围按角色复用，不全面迁移训练|[D2](D2.original-report.md)|

三者自主发现 AGENTS→当前索引，核验 1.0.0-ds2.3/preintegration-candidate/formal:false，区分 approved 原则、draft 实现和历史专项范围。子上下文只运行限定检索及范围核验，**没有运行全量静态/自测**；外层完整 41 项结果独立记录。原答复由各上下文直接写入，全部 argv/原字节流打包并核对哈希，见 [cold-raw-manifest.json](cold-raw-manifest.json)、各 commands.jsonl/raw-commands.zip 和 [协议](cold-start-protocol.md)。当前对话摘要不替代原答复。

## 隔离证明与接入建议

[protection-check.json](protection-check.json)：主目录、发布候选、原 DS 树的 HEAD/状态/索引/Git 可见内容哈希与起点一致；其他原有树 HEAD/状态/索引一致。并行任务新增的 checkpoint/分支/应用捕获引用另行记录，未回退，不宣称整个共享引用集合静止。

预集成对 90b56f 的 miniprogram/cloudfunctions/assets-source 差异为空；修正对 b325 产品差异也为空。主目录 1643 未跟踪文件原样保留：“未跟踪”是尚未纳入 Git，不是 1643 个未解决错误。独立发布候选是有独立 HEAD/索引/未提交内容的工作树，本轮未接入。

未发现阻断治理候选的同范围 approved 冲突；两个未核实组件、历史实现差距、数值和候选交互仍未获补批。本候选具备进入正式接入审查的条件，**不等于已正式生效**。

未来获明确接入授权后：重新核对共同分支和目标源码漂移，从本候选相对 90b56f 的精确治理差异接入，保留目标项目指令/README，重验登记和完整检查；不携入 B5 产品，也不在脏主目录直接合并。另行建立批准回执/正式引用，实际共同分支包含正式声明后才能验证 adopted-common-baseline。旧树需各自安全引入同版本并核验，本树 AGENTS 不会自动约束旧树。

本轮未合并 main、未推送、未接入发布候选、未清理旧树、未传播其他工作树、未进入 DS-3。等待正式接入审定。
