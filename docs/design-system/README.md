# 花生开小灶 Design System：唯一当前索引

治理包版本：`1.0.0-ds2.3`。产品体系：Design System V1.0。共同基线治理阶段：DS-2.3；产品契约增量：`ds3-r1d-20261029`。

本分支新增 [R1-D 批准契约接入记录](approvals/ds3-r1d-20261029.json)：[DS-SEM-004](contracts.md#ds-sem-004r1-客观结果展示配方)、[DS-PAT-006](contracts.md#ds-pat-006r1-被动进度展示配方)、[DS-EXP-004](contracts.md#ds-exp-004字号支持边界与正常字号质量) 是限定范围的 approved **设计规则**。R1 结果样式、进度 WXML 模板和页面适配没有迁入本共同基线；`PAT-CHOICE`、`PAT-PROGRESS` 的实现仍为 draft。新增规则是否对新任务生效，须同时核对当前分支 HEAD 包含本次治理提交及原 DS-2.3 激活检查通过。

## 状态与授权

已批准：六层职责、四模块身份、三模块优先、训练参考边界、A/B/C/D、客观错误红色、业务/展示分离、两种选择题模式、两种自评前进模式、设置角色、卡片角色及阅读独立性；DS-2 规范和轻量验证建设。

未批准：除 DS-SEM-004 三页试点的六个参考色值以外的具体新数值、其他页面的迁移方案、候选交互细节和当前实现的视觉/设备效果。registry 实现保持 draft，implementation.observed 表示源码存在，不表示设计批准。完整规则见 [contracts](contracts.md)。

当前声明状态见 registry.activation，实际适用范围由 activation-policy.json 与 Git 证据核对。DS-2.3 原始治理授权已接入独立共同开发基线 `codex/design-system-common-baseline-ds2.3`；本次 R1-D 产品契约增量另据上方批准记录接入，不带入 R1 产品代码。main、发布候选及旧工作树保持各自身份；本增量不授权 DS-3 实现推广或 DS-4 编码。

## 六层入口

[Foundations](contracts.md#foundations)、[Themes](contracts.md#themes)、[Semantics](contracts.md#semantics)、[Components](contracts.md#components)、[Patterns](contracts.md#patterns)、[Experience](contracts.md#experience)。稳定契约编号见正文，登记以编号关联。

## 组件族执行机制（2026-11-01 正式接入）

用户／ChatGPT 决定产品方向与最终视觉；Codex 识别设计角色和全部消费者，按已确认方向形成候选规格、成组实施和横向验证。检索须覆盖组件、公共 WXSS、本地及复制实现，结合事件和上下文，不因同文字合并不同语义。记录哪些共享视觉／布局、哪些保留主题／业务差异。新开发先查 approved 角色规范，确需扩展或新建须说明原因。用户确认后才能批准规格或实现；draft 不强制为最终视觉标准。

本治理增量依据 [接入授权](approvals/family-workflow-20261101.json)，不改变既有契约编号、实现批准状态、治理版本或激活引用。只对包含本提交并通过激活检查的目标基线生效；旧树不自动传播。本提交不带入 V1 产品代码。

## 如何发现和选择组件

1. 定位用户任务/角色；用关键词搜索 [registry.json](registry.json)，再读取 sources、examples 和消费者。示例是现存源码，未必是批准视觉样板。
2. 明确复用、配置、扩展或新建；B 可限定知识域，C 专用是正常成员，D 不意味着可删。
3. 使用 `node scripts/validate-design-system.js --query 记忆` 或搜索 `button/action/reading/progress/choice`；`--query` 默认仅输出 ID、名称、角色、分类、状态、源码入口和简短推荐；`--show <ID>` 查看完整登记，`--consumers <ID>` 查看直接消费者、角色页面、候选范围及证据。组件核对 usingComponents，样式 recipe 扫描注册页及导入模板；Pattern 角色关系不冒称直接组件使用。
4. 输入、状态、事件、结果、恢复和业务责任必须分别考虑。组件自行保存偏好、答案暴露事件等副作用已登记，不因共享而扩展到学习引擎。
5. 当前注册页覆盖及组件消费者从 app.json / usingComponents / 模板关联核对；运行时动态引用仅记录线索，不虚构有效消费者。

按钮选择提示：普通流式操作与固定学习底栏分别处理；`PAT-ACTIONS.usageRecipes` 记录两套 API 的实际消费者，包括照片处理页。`.ui-button` 暂未发现注册页模板使用，不代表可以删除；优先匹配真实角色与已有页内行为。

阅读依赖与历史范围：登记已列 reading-ui、display-preferences、reading-surface-policy。当前源码实际启用范围可大于历史样板文档；索引不补批这些启用，也不要求缩回旧样板。

R1-D 复用边界：新客观题或进度页先读取 approved 契约及 `PAT-CHOICE` / `PAT-PROGRESS` 登记，再核对当前**实际源码**。本共同基线没有 R1 试点 recipe，不能把 R1-D 的产品批准误读成可直接导入的公共实现，也不能让组件承担提交、评分、分母或完成条件。新增页面超出三页/四模式的批准范围时，先明确扩展范围与验证。

## 激活状态与核验

[activation-policy.json](activation-policy.json) 保留历史两个候选授权，并记录本次独立正式授权、已审定来源及真实目标分支。支持三态：

- `isolated-candidate`：独立修正候选；实际分支、祖先基线、产品树身份和无产品差异必须匹配。
- `preintegration-candidate`：从明确共同开发目标建立的候选；除上述条件，还核对修正治理提交的来源身份。
- `adopted-common-baseline`：由独立正式授权支持；必须有独立 Git 引用指向的批准回执，回执绑定治理版本、正式接入提交和目标分支，且当前树与目标分支均已包含该提交。本轮按正式授权建立该引用；不因登记布尔值或工作区回执文件而通过。

静态检查验证记录、Git引用及适用范围的一致性，不验证人的密码学身份；同时伪造代码、授权引用及回执不属于此工具可证明的范围。本轮正式接入依据用户已审定授权，测试正反例仍只在一次性仓库模拟，不借测试伪造真实授权。formalAdoptionAuthorization 绑定本轮请求、版本、来源和目标；历史 candidateGrants 不能授权正式状态。

候选阶段禁止产品改动，因此范围核验包含产品树与基线一致。正式接入后的普通开发不要求产品永远冻结，但必须继承已批准接入提交；新治理版本需要对应授权记录。

## 登记关系与证据

- `consumers` 只登记实际组件引用。
- `rolePages` 是 Pattern 角色相关页面，附角色专用源码线索；不表示同一组件或所有状态。
- `applicablePages` 是候选适用范围，必须包含已知角色页及 recipe 消费者。
- `candidateEvidence` 保存原根容器/普通结构等弱线索，仅供待核实，不作为直接使用或角色成立的证明。
- `usageRecipes` 单独核对已有样式的静态消费者。

高频代表项已将进度、选择、自评、操作、阅读、状态和布局线索指向实际控件、事件、条件或安全区规则。该有限修正不重新裁决全产品业务归类。

## 开发前后最低检查

开发前读 AGENTS、索引版本、相关规则、登记与示例；记录任务角色、复用选择、消费者与允许差异。开发后检查视觉增量理由、同角色状态、异常、返回恢复、业务边界和共享消费者；更新登记和证据。常规实现决定不增加逐项审批，行为与发布变化仍需对应授权。

## 自动检查

```sh
node scripts/validate-design-system.js
node scripts/test-design-system-validator.js
node scripts/validate-design-system.js --audit-base 90b56f784c865c3d24b1a05c17ce7edf71d28897
```

验证器仅使用 Node 内置库，不加载业务代码、不访问线上、不改产品。硬错误包括登记/契约/路径/消费者等结构问题、明显未定义且无回退的变量、可识别的变量循环。可选变量带回退、作用域无法证明、待核实消费者和新增视觉值是提示，不能据此自动裁决业务重复或视觉缺陷。

`--audit-base` 必须使用本任务明确记录的 Git 提交，不猜共同基线；包括该提交之后的工作区和未跟踪产品文件。新组件、视觉字面量和源文件增量需要开发者解释，旧数值不自动变成禁止名单。此审计依赖完整 Git 对象；缺少基线时报告失败，不能当作零差异。

既有 [UI token 检查](../../scripts/validate-ui-tokens.js) 有部分政治专用假设，不能直接升级为全产品硬门禁；[入口控制器检查](../../scripts/validate-module-home-interactions.js) 和 `scripts/validate-public-learning-page-runtime.js`（B5历史入口；90b56f7目标未包含，不复制该脚本，不作为当前可执行检查） 采用替身/VM，不是页面几何或设备验收。按修改范围选用，报告适用性，不为通过旧检查改产品。

## 专项与历史规范

- [根 README](../../README.md) 是工程介绍，不是当前 DS 状态来源。
- [知识平台入口](../knowledge-platform/README.md)、[空间 UI 与可访问性](../knowledge-platform/08-spatial-ui-and-accessibility.md) 和 [政治阅读规则](../knowledge-platform/implementations/politics-reading-ui-v1-product-rules-20261025.md) 保留其历史时点与批准范围。
- [DS-EXP-004](contracts.md#ds-exp-004字号支持边界与正常字号质量) 是当前微信/系统字号跟随支持边界：不建设全局动态字号机制，但正常字号质量与既有政治站内阅读设置继续保留；历史专项建议不自动获得全局实现授权。
- 具体条款继承关系见 registry 的 legacyReferences。局部阅读规则不自动推广到全产品；旧的品牌限制与本轮批准模块皮肤原则发生冲突时，以当前明确范围为准，具体消费者适配仍需授权。
- 不能把文档中“已测试”解释为当前源码/设备验收，也不静默重写历史回执。

## 版本如何真正进入后续开发

1. 原 DS-2、修正及预集成提交保留其历史候选状态。本轮经审定接入独立共同分支；实际生效以正式引用、回执、目标/当前 HEAD 祖先及验证器一致为准，不冒称 main 已接入。
2. 新任务报告仓库、分支、HEAD、索引版本以及 `node scripts/validate-design-system.js` 结果；索引版本应与 registry.designSystemVersion 一致。长任务实施前重读索引。
3. 旧树缺包时明确“未接入”，不声称受约束；只读参照可作为任务输入，不能代替版本接入。获授权后在目标树先评估同名文件/指令，再按精确提交接入，解决冲突并验证；不整树合并、覆盖或改并行任务。
4. 接入共同基线后，新开发树从含该提交的基线建立。已有树的接入另行授权；任何不含文件的树都不会被本树 AGENTS 自动影响。
5. 更新规则列明受影响登记 ID 和真实消费者；小幅兼容增补优先。破坏性更新保留旧适配或逐项迁移，完成验证前不得删除旧入口。
6. 废弃项标 deprecated、指向明确替代 ID、说明迁移/消费者/回退，禁止替代循环；approved 产品规则变更需要产品依据，源码事实更新不冒充设计批准。
7. 回退仅撤销本包治理文件及约定适配，保留业务记录；当前修正和预集成结果见 [本轮回执](evidence/review-20261028/receipt.md)。原 [DS-2 回执](evidence/ds2-receipt.md) 及其散列/测试是 b32587f 的历史证据，不表示当前版本结果。

## 冷启动与证据

独立场景只读运行，不开发功能。覆盖常识操作、笔记自评、政治阅读、训练专项及不适合复用的新能力；保存实际读取来源、选择和失败/修复。当前会话复述不能替代新上下文证据。自动检查、冷启动发现、页面验证与发布状态分别列于回执。

## 当前审定修正

版本1.0.0-ds2.3新增三态范围验证、登记范围一致性及简短查询。原始恢复提交 b32587f434d8fff93031ae731944c61b53039085 保持不可变。该治理接入时所有实现/Pattern 为 draft；本次 R1-D 在同一治理机制下新增限定的产品批准，未改变原始提交或批准其他实现。真实命令、stdout/stderr、新上下文原始回执及目标源码核对保存在对应回执目录。

## 当前正式共同开发基线

本树继承已审定预集成提交 `771fb922f3c0b12ad2bc55b3c2c8ed9de08cc69f`（父为 main 已提交的 `90b56f784c865c3d24b1a05c17ce7edf71d28897`），保留完整治理和历史证据。正式目标为 `refs/heads/codex/design-system-common-baseline-ds2.3`，与 main 不同。源码观察基线不变，未引入 B5、主目录或发布候选未提交产品内容。

正式授权 ID：`DS2-FORMAL-ADOPTION-20261028`；授权引用：`refs/codex/design-system/adoptions/ds2.3-common-20261028`；已提交批准回执路径：[adoption-approval.json](adoption-approval.json)。最终状态及原始验证见 [正式接入回执](evidence/adoption-20261028/receipt.md)。引用本身不在普通分支文件内容中；新 clone/异地交接须同时携带该精确授权引用并核验，缺失时验证失败，不能手改状态绕过。

新任务先只读核对共同分支，再从它建立独立开发树，读取 AGENTS 和本索引，运行完整检查并报告实际状态。普通开发允许产品随后变化，使用任务基线审计并解释增量；本轮正式接入自身必须保持产品零差异。旧工作树不自动接入；原候选树仍报告候选/非正式，缺规范的主目录仍未接入。正式治理版本后续更新需要对应授权及记录，不能靠版本字符串自动生效。

## 2026-11-01 main 隔离集成候选

本工作树已在 main 已提交基线之上接入共同治理祖先和精确 V1 展示源码，尚未合并 main。三样式族 390 宽用户人工测试已反馈通过，375/428 与设备／真实记录链路单列；实现仍保持 draft，未批量升级31项。当前集成范围、保护证据及分层准入见 [收口回执](evidence/closeout-20261101/receipt.md)。不把旧候选截图当作本集成构建的全部验收。
