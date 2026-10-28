# 花生开小灶 Design System：唯一当前索引

治理包版本：`1.0.0-ds2.3`。产品体系：Design System V1.0。阶段：DS-2。

## 状态与授权

已批准：六层职责、四模块身份、三模块优先、训练参考边界、A/B/C/D、客观错误红色、业务/展示分离、两种选择题模式、两种自评前进模式、设置角色、卡片角色及阅读独立性；DS-2 规范和轻量验证建设。

未批准：具体新数值、每个现有页面的迁移方案、候选交互细节、视觉/设备效果。registry 所有实现初始为 draft，implementation.observed 表示源码存在，不表示设计批准。完整规则见 [contracts](contracts.md)。

当前声明状态见 registry.activation，实际适用范围由 activation-policy.json 与 Git 证据核对。当前授权仅允许隔离候选和预集成候选，未授权正式接入共同基线或发布候选；不自动传播其他树，不授权 DS-3。

## 六层入口

[Foundations](contracts.md#foundations)、[Themes](contracts.md#themes)、[Semantics](contracts.md#semantics)、[Components](contracts.md#components)、[Patterns](contracts.md#patterns)、[Experience](contracts.md#experience)。稳定契约编号见正文，登记以编号关联。

## 如何发现和选择组件

1. 定位用户任务/角色；用关键词搜索 [registry.json](registry.json)，再读取 sources、examples 和消费者。示例是现存源码，未必是批准视觉样板。
2. 明确复用、配置、扩展或新建；B 可限定知识域，C 专用是正常成员，D 不意味着可删。
3. 使用 `node scripts/validate-design-system.js --query 记忆` 或搜索 `button/action/reading/progress/choice`；`--query` 默认仅输出 ID、名称、角色、分类、状态、源码入口和简短推荐；`--show <ID>` 查看完整登记，`--consumers <ID>` 查看直接消费者、角色页面、候选范围及证据。组件核对 usingComponents，样式 recipe 扫描注册页及导入模板；Pattern 角色关系不冒称直接组件使用。
4. 输入、状态、事件、结果、恢复和业务责任必须分别考虑。组件自行保存偏好、答案暴露事件等副作用已登记，不因共享而扩展到学习引擎。
5. 当前注册页覆盖及组件消费者从 app.json / usingComponents / 模板关联核对；运行时动态引用仅记录线索，不虚构有效消费者。

按钮选择提示：普通流式操作与固定学习底栏分别处理；`PAT-ACTIONS.usageRecipes` 记录两套 API 的实际消费者，包括照片处理页。`.ui-button` 暂未发现注册页模板使用，不代表可以删除；优先匹配真实角色与已有页内行为。

阅读依赖与历史范围：登记已列 reading-ui、display-preferences、reading-surface-policy。当前源码实际启用范围可大于历史样板文档；索引不补批这些启用，也不要求缩回旧样板。

## 激活状态与核验

[activation-policy.json](activation-policy.json) 记录本次用户授权的两个候选分支及各自源码基线。支持三态：

- `isolated-candidate`：独立修正候选；实际分支、祖先基线、产品树身份和无产品差异必须匹配。
- `preintegration-candidate`：从明确共同开发目标建立的候选；除上述条件，还核对修正治理提交的来源身份。
- `adopted-common-baseline`：仅在未来另行授权后可用；必须有独立 Git 引用指向的批准回执，回执绑定治理版本、正式接入提交和目标分支，且当前树与目标分支均已包含该提交。本轮不创建该授权引用，不因登记布尔值或工作区回执文件而通过。

静态检查验证记录、Git引用及适用范围的一致性，不验证人的密码学身份；同时伪造代码、授权引用及回执不属于此工具可证明的范围。正式接入步骤须另行授权，不借本次测试创建生产授权。正例中的正式接入仅在一次性测试仓库中模拟。

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
node scripts/validate-design-system.js --audit-base 80b0ac59c288de9b82371db349ab7cbd1dc02330
```

验证器仅使用 Node 内置库，不加载业务代码、不访问线上、不改产品。硬错误包括登记/契约/路径/消费者等结构问题、明显未定义且无回退的变量、可识别的变量循环。可选变量带回退、作用域无法证明、待核实消费者和新增视觉值是提示，不能据此自动裁决业务重复或视觉缺陷。

`--audit-base` 必须使用本任务明确记录的 Git 提交，不猜共同基线；包括该提交之后的工作区和未跟踪产品文件。新组件、视觉字面量和源文件增量需要开发者解释，旧数值不自动变成禁止名单。此审计依赖完整 Git 对象；缺少基线时报告失败，不能当作零差异。

既有 [UI token 检查](../../scripts/validate-ui-tokens.js) 有部分政治专用假设，不能直接升级为全产品硬门禁；[入口控制器检查](../../scripts/validate-module-home-interactions.js) 和 `scripts/validate-public-learning-page-runtime.js`（B5历史入口；90b56f7目标未包含，不复制该脚本，不作为当前可执行检查） 采用替身/VM，不是页面几何或设备验收。按修改范围选用，报告适用性，不为通过旧检查改产品。

## 专项与历史规范

- [根 README](../../README.md) 是工程介绍，不是当前 DS 状态来源。
- [知识平台入口](../knowledge-platform/README.md)、[空间 UI 与可访问性](../knowledge-platform/08-spatial-ui-and-accessibility.md) 和 [政治阅读规则](../knowledge-platform/implementations/politics-reading-ui-v1-product-rules-20261025.md) 保留其历史时点与批准范围。
- 具体条款继承关系见 registry 的 legacyReferences。局部阅读规则不自动推广到全产品；旧的品牌限制与本轮批准模块皮肤原则发生冲突时，以当前明确范围为准，具体消费者适配仍需授权。
- 不能把文档中“已测试”解释为当前源码/设备验收，也不静默重写历史回执。

## 版本如何真正进入后续开发

1. DS-2 验证、修正及预集成提交仅产生候选治理包。需要用户审定回执，再授权将精确治理文件接入共同开发基线；本任务不执行合并。
2. 新任务报告仓库、分支、HEAD、索引版本以及 `node scripts/validate-design-system.js` 结果；索引版本应与 registry.designSystemVersion 一致。长任务实施前重读索引。
3. 旧树缺包时明确“未接入”，不声称受约束；只读参照可作为任务输入，不能代替版本接入。获授权后在目标树先评估同名文件/指令，再按精确提交接入，解决冲突并验证；不整树合并、覆盖或改并行任务。
4. 接入共同基线后，新开发树从含该提交的基线建立。已有树的接入另行授权；任何不含文件的树都不会被本树 AGENTS 自动影响。
5. 更新规则列明受影响登记 ID 和真实消费者；小幅兼容增补优先。破坏性更新保留旧适配或逐项迁移，完成验证前不得删除旧入口。
6. 废弃项标 deprecated、指向明确替代 ID、说明迁移/消费者/回退，禁止替代循环；approved 产品规则变更需要产品依据，源码事实更新不冒充设计批准。
7. 回退仅撤销本包治理文件及约定适配，保留业务记录；当前修正和预集成结果见 [本轮回执](evidence/review-20261028/receipt.md)。原 [DS-2 回执](evidence/ds2-receipt.md) 及其散列/测试是 b32587f 的历史证据，不表示当前版本结果。

## 冷启动与证据

独立场景只读运行，不开发功能。覆盖常识操作、笔记自评、政治阅读、训练专项及不适合复用的新能力；保存实际读取来源、选择和失败/修复。当前会话复述不能替代新上下文证据。自动检查、冷启动发现、页面验证与发布状态分别列于回执。

## 当前审定修正

版本1.0.0-ds2.3新增三态范围验证、登记范围一致性及简短查询。原始恢复提交 b32587f434d8fff93031ae731944c61b53039085 保持不可变。所有实现/Pattern仍为draft，产品原则与历史专项范围不变。真实命令、stdout/stderr、新上下文原始回执及目标源码核对保存在当前回执目录。

## 当前预集成目标

本树从 main 已提交的90b56f784c865c3d24b1a05c17ce7edf71d28897建立；治理输入64ba11f700f6c71ccfa0fc8aec4b55eade73a15e。当前状态是preintegration-candidate，不是adopted-common-baseline。登记的sourceBaseline、实现观察基线、产品树身份、直接组件引用和角色证据均按本树核对。未引入B5的题库、云函数或客户端增量，也未复制主目录/发布候选未提交内容。
