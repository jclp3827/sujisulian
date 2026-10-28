# D 场景原始回执：行测速练限时手势精细操作控件

结论：建议为新任务新建限定行测速练范围的 C 类专项控件，外围按钮、表面、进度表达和安全区按角色评估复用；不把现有估算页面、手写画布或任务头直接提升为全产品公共手势组件。不开发、不迁移现有训练、不修改业务或治理登记。本结论是只读工程选择，具体新手势、时间规则、精度及反馈方案仍待该功能定义与验证，不是设计批准。

## 1. 工作树、版本和激活核验

- 实际目录：`/private/tmp/miniprogram-ds2-preintegration-20261028`。
- 实际分支：`codex/design-system-ds2-preintegration-20261028`。
- HEAD：`90b56f784c865c3d24b1a05c17ce7edf71d28897`；提交根树：`4c237514b60afc65ecff04a8b4f2e4db6ebe0443`。`main` 引用当前也指向该提交，这不构成 DS 正式接入授权。
- 唯一入口和契约均声明治理包 `1.0.0-ds2.3`、Design System V1.0、DS-2；registry.designSystemVersion 一致。
- registry 声明 `preintegration-candidate`，sourceBaseline 为上述 HEAD，governanceSourceCommit 为 `64ba11f700f6c71ccfa0fc8aec4b55eade73a15e`。
- 实际执行默认验证器，结果 `DS validation PASS 1.0.0-ds2.3 preintegration-candidate`。不是仅抄登记布尔值；按本树验证器的 Git/来源身份及候选范围机制核验通过。该工具不证明人的密码学身份，也不替代用户授权。
- activation-policy 的本次授权仅允许隔离候选和预集成候选，formalAdoptionGate.currentRequestGrantsFormalAdoption 为 false。正式状态还需要独立 Git 引用绑定的批准回执、治理版本、正式接入提交、目标分支及包含关系。本轮没有创建这些授权材料。
- 开始和结束 `git status --short --branch` 一致：README.md、docs/knowledge-platform/README.md 已修改；AGENTS.md、docs/design-system/ 和四个治理脚本为未跟踪输入。全部保留。治理包在工作区存在且候选静态核验通过，不表示已提交到共同基线。

## 2. 规则入口和实际读取规范

实际从根 `AGENTS.md` 到 `docs/design-system/README.md`，先运行角色短查询 `--query 专项`，再读取 `contracts.md`、`activation-policy.json`，用 `--show PAT-TRAINING`、`--consumers PAT-TRAINING` 获取登记详情和关系。随后查询 action/progress，定向读取 registry 的相关条目、源码、页面注册及示例。没有依赖个人记忆或历史聊天。

核心规则及状态：

- DS-CMP-001、DS-CMP-002（approved）：A 全局公共、B 可配置公共、C 业务专用、D 待治理；C 是正常成员，允许合理新建。选择须依据角色、源码和真实消费者。公共能力不能定义评分、正确答案、业务进度、完成条件、队列和业务持久化。
- DS-EXP-001（approved）：家族感不要求同构；笔记、常识、政治优先横向治理，行测速练作为成熟实践参考，不主动改造内部体系；限时训练、专项控件可独立。
- DS-THM-001、DS-SEM-001（approved）：保留四模块皮肤；模块身份、知识语义与系统结果分开；客观错误用红色，但不授权本轮直接替换旧页面颜色，也没有批准具体红色色值。
- DS-PAT-001（approved）：模块提供进度与统计事实，展示不改分母和完成条件。不能将当前位置直接当已完成量。
- DS-PAT-002（approved）：即时提交、确认提交两种选择任务模式均允许。它不要求将连续手势任务改成选择题，也不批准改变现有训练采用的模式。
- DS-PAT-004（approved）：设置需声明角色、生效时机及活动任务影响，不统一重写存储或静默重置任务。
- DS-EXP-003、DS-GOV-001（approved）：状态、授权和证据分层；候选不自动传播其他树，现有行为不因原则批准而得到修改授权。
- DS-FND-002、DS-SEM-003、DS-PAT-005 是 draft：数值/几何、操作状态组合、搜索/往返恢复候选协议，不得当成已批准新数值或候选交互细节。
- registry 的 30 个实现/Pattern 全为 draft，implementation.observed 及基线仅表示源码观察，不是批准视觉样板；使用次数也不能把 draft 升级为 approved。

另实际读取历史专项输入 `docs/knowledge-platform/08-spatial-ui-and-accessibility.md` 和 `docs/knowledge-platform/implementations/politics-reading-ui-v1-product-rules-20261025.md`。前者读取输出被工具截断，未宣称逐字读完整篇；已看到主题边界、对比度、安全区、触控、Canvas 等价视图和历史状态等有关条款。后者读取了规则文本，包括目标、通用合同、8页范围和停止边界。两份文档的历史“通过/验收/Ready”等状态没有用作当前效果证明，也没有打开其链接的评估、回执或 evidence 文件。

历史政治阅读规则是 2026-10-25 第0批及第1批8个代表页的批准输入；34/36/40rpx、88rpx 触摸校准、底栏职责及当时320px/真机豁免，不能自动成为行测速练新控件的数值、布局或验收豁免。旧空间规范的模块品牌限制亦不能覆盖当前四模块皮肤原则。根 README 和知识平台 README 的规范入口指向当前索引，工程介绍与历史摘要不决定 DS 当前状态；未追读其中的评估结果链接。

## 3. 相关实现和消费者事实

### PAT-TRAINING

登记为 C、draft，角色为“限时训练手写与精细操作”，sources 为 training/session、training/estimation、cognition/session 三个页面控制器。例外明确：限时、手写、滑杆、认知任务可以独立，不全面迁移。

必须区分关系强度：

- `directConsumers`/`consumers` 为空；这是 Pattern，不是六个页面共同引用的组件。
- 登记 `rolePages` 为 training/catalog、cognition/guide、cognition/session、training/session、training/result、training/assumption 六页；`--consumers` 明说只核对登记角色线索，不是穷尽业务发现，也不证明运行时可达及所有状态。PAT-TRAINING 中部分角色证据仍是页面根结构，不能将其说成具体控件复用证明。
- `applicablePages` 十页还包括 home、wrong-book、estimation、ratio-sense；这四页在该条目中仅是 candidateEvidence，不能算直接消费者或因候选范围就认定同角色。
- 本次进一步读取 estimation 源码，确实看到了滑杆、手写和计时；这是本次局部源码观察，不自动修改或提升 registry 原有关系等级。

实际源码发现：

1. `miniprogram/pages/training/estimation/index.wxml:64` 的手柄绑定 touchstart/move/end，页面控制器 `index.js:180-212` 测量滑杆区域、将触点换算为百分比并限制到现值 5–95，再计算 userA/userX。该范围是现有实现，不是批准的新控件精度或阈值。它是 A/X 分配任务的页面实现，不是可仅配置题型就复用的通用手势组件。
2. 同页 `index.js:214` 起的 submitAnswer 使用当前题目和工作数计算偏差、classifyDeviation，写入 records 后设 submitted/correct/result；后续完成流程保存记录。复用整页逻辑会带入答案、判定、统计和持久化职责，越过公共展示边界。
3. estimation WXML 的手写 Canvas 在 128–131 行绑定 start/move/end/cancel，并 disable-scroll；training/session WXML 160–163 行及 assumption WXML 188–191 行也有类似页面内手写结构。当前 scoped 搜索没有发现独立通用手势组件。不能据此宣称全仓库不存在其他动态能力；未扫描题库、打包数据或线上。
4. `miniprogram/pages/training/session/index.js:214` 起由页面建立 sessionStartAt/questionStartAt、interval；submitAnswer 负责 validateAnswer、记录单题结果和耗时、更新进度/下一题，卸载清理计时。WXML 的手写只是辅助输入表面，没有直接把笔迹变成评分输入的通用接口证据。
5. cognition/session 已有计时、倒计时、反馈定时器及 runtime 事件代理；卸载和重新训练清理定时器。读取的 WXML 搜索显示网格点击、心算推进/键盘/提交等专属任务；这不是新连续手势输入协议。
6. app.json 注册上述训练、认知页；training/session 的 usingComponents 只见 math-formula，estimation 无组件登记，cognition/session usingComponents 为空。页面角色或相似 class 不等于共同组件消费者。

### 外围可复用能力

- PAT-ACTIONS（B、draft）：源码为 styles/ui.wxss、styles/session.wxss。普通操作优先评估已有 `.btn-base`，不能因为存在 `.ui-button` 就要求迁移；`.ui-button` 当前无登记的注册页模板消费者。两套 API 现存，未批准合并。普通流式区和已有固定学习栏必须分别保留布局、测量和避让责任。
- `.btn-base` 的登记 recipe 静态消费者共18页：pages/note/index/index、pages/common-sense/index、pages/politics/index、pages/training/catalog/index、pages/cognition/guide/index、pages/cognition/session/index、pages/training/session/index、pages/training/result/index、pages/training/wrong-book/index、pages/training/assumption/index、pages/training/estimation/index、pages/training/ratio-sense/index、subpackages/photo/process/index、subpackages/note/detail/index、subpackages/common-sense/detail/index、subpackages/politics/route/index、subpackages/politics/route/units、subpackages/politics/practice/index。它们是样式 recipe 消费者，不能表述成同一个按钮组件的直接消费者。默认验证器核对通过；本次未逐页执行交互。
- PAT-PROGRESS（B、draft）：登记跨笔记、常识、政治及训练的相关页，sources 为 session.wxss、note/shared/learning-ui.wxss；消费者字段为空，rolePages 与适用范围分列。训练 session 用 answeredCount/total，估算页用 index/题目量，不能统一展示时重算统计口径。
- PAT-LAYOUT（B、draft）：固定区、流式区、动态测量不能共用一个硬编码高度。当前训练页面已有 safe-area-inset-bottom；新控件应按实际宿主和遮挡验证，不复制某个旧抽屉/底栏高度作为标准。
- PAT-INPUT（B、draft）是输入焦点与原生键盘角色，范围为搜索/笔记练习/政治正文等五页，不等于触摸轨迹输入。不能仅因“输入”同名就将新手势塞进去。
- CMP-SESSION-HEAD（D、draft）：实际读取了实现，具有 title/meta/progressPercent/startAt/timerLabel 输入，内部 interval、tick 事件与 detached 清理。登记和默认验证器均提示没有注册页 usingComponents/模板消费者。不能称其为已被所有训练页使用的成熟公共任务头，也不能因 D 或零消费者就删除。新限时专项不应默认依赖它掌握结束条件。
- app.wxss 确认全局导入 theme、ui、module-skins；ui 又导入 session。ui.wxss 存在 surface-card、btn-base、keypad、sheet-drawer 等样式。源码现值只是观察，不是新控件几何/颜色的批准值。

## 4. 明确的复用/配置/扩展/新建选择

| 选择 | 本任务判断 |
|---|---|
| 复用 | 对角色匹配的普通确认/重试/返回等操作，优先保持 btn-base 及训练已有外围语言；表面和进度只表达模块给定事实。此时不需修改公共样式或迁移旧页。 |
| 配置 | 当前没有证据表明只传入时间、题目或颜色就能使既有组件承载任意新精细手势。若最终任务明确就是同一种 A/X 单轴分配，可进一步评估在专属实现内配置标签/输入；不得顺带改变旧的5–95范围、答案换算或提交行为。 |
| 扩展 | 不默认扩展 CMP-SESSION-HEAD、PAT-INPUT 或全局按钮来加入识别/评分。只有多个真实任务证明需要同一不含业务的坐标采集/绘制接口，且旧消费者、兼容与恢复已查清，才评估小幅扩展或抽取；当前重复手写结构仅是线索，不授权治理式重构。 |
| 新建 | 推荐新增训练范围 C 类专项输入控件/适配器，以任务角色命名，登记来源、宿主、状态、事件、副作用、允许差异及例外。无需机械凑成 A/B，也无需对合理 C 新建逐项申请批准；本轮仅提出方案，没有实施授权。 |

建议的责任边界而非已批准 API：业务宿主提供任务/内容身份、可交互状态、显示值和时间状态；控件采集手势并发出操作意图，宿主判断有效性、超时、答案、评分、进度、下一题及存储。需要明确取消/中断、结果锁定、异步回调过期及返回恢复，防止旧触点落入新题。手势是否直接提交、是否需确认、是否提供替代输入，仍由新任务角色决定，不从别的模块推断。

## 5. 模块特例和冲突处理

1. 新限时/精细手势属于训练专项，DS-EXP-001 与 PAT-TRAINING 例外允许独立；“全局公共存在”不是全面迁移训练的依据。新建限定范围并不豁免状态、安全区、消费者登记和业务分离。
2. 估算页以 classification.passed 生成 correct，false 时模板走 es-tone-fail/aa-feedback-review，而 WXSS 使用橙色软背景。若该 false 在产品上属于客观答错，它与 DS-SEM-001 的错误红原则存在语义/展示差距；若是估算训练的“建议重新分配”，需先确认其反馈角色。保持现状并报告影响，不能本轮静默换红，也不把现状反向批准为通用错误语义。
3. 估算页的确认按钮提交后仍存在，handleTouchMove 也未在读取段落看到 submitted 锁；submitAnswer 会 push records。该事实不足以在只读场景判断重复提交是否是允许重分配还是缺陷。不能因候选状态协议而自行加锁、去重或改记录统计；新增控件必须明示自身提交/重试语义并接受业务核验。
4. 有效数字切换会重置当前输入/提交状态，代码有相应提示。这是活动任务设置的专属现状，不应通过共享设置让它静默迁移到其他训练；若准备改变，应明确对 DS-PAT-004 的适配及产品授权。
5. 历史空间规范有品牌限制、抽屉最高约80%、Canvas 等价列表、44px等要求，政治阅读还有历史样板值与真机豁免；按当前索引及历史批准范围处理，不能全量覆盖限时手写控件或把历史豁免推广。新任务是否需要等价操作及具体可访问性形式应按真实用户任务审定并在同一构建验证。
6. 未发现必须在本轮裁决的两个同范围 approved 条款直接冲突。若后续发现，应暂停受影响决定并报告；这里的历史范围差异和源码差距已单列，不通过改业务来消除检查提示。

## 6. 验证结果、未来要求及未验证项

实际只读运行：

- 默认静态验证 PASS：18 contracts、15 approved、30 entries、10 components、20 patterns、38 pages、65 styles、232 tokenDefinitions。
- 明确采用本树 sourceBaseline `90b56f784c865c3d24b1a05c17ce7edf71d28897` 执行 `--audit-base`，PASS，changedProductFiles=[]、warnings=[]。没有采用索引通用示例中的另一基线来猜测本任务差异。
- 提示保留：CMP-SESSION-HEAD、CMP-PHOTO-EDITOR 消费者未验证；reading-controls 的 --pr-muted/--pr-divider 有可选回退。它们是提示，不授权删除或改业务。
- 本次没有运行 test-design-system-validator、test-design-system-activation 或其他自测，没有加载业务运行时，没有构建、模拟器、真机、线上或发布操作。对只读任务不借“验证”运行业务。

若未来获准实现：先重读索引，明确新任务行为与允许差异；更新新能力/例外/消费者登记；以该任务明确记录的基线运行静态增量审计，解释新组件、视觉字面量和所有提示。若改变公共能力，需要核对全部实际消费者，并按影响做业务回归。政治专用 token 检查不能直接成为训练全产品硬门禁；本树索引明确 B5 的 validate-public-learning-page-runtime.js 不在该目标内，不复制或声称执行过。

状态覆盖应包括：正常开始、触摸中、提交/处理中（若存在）、禁用/超时、正确或失败结果、异常、重试、取消、退后台/卸载/重新进入及返回恢复。重点验证坐标测量失效、边界、触点取消、滚动争用、跨题旧回调、重复触发和时间边界；评分、题目、完成规则及持久化继续由业务验证。真实页面中测量触控区域、窄屏/放大、遮挡、安全区及返回操作；精细手势需分别报告 iOS/Android 真机效果及手势响应表现。具体数值、性能目标和验收机型不得伪称本次已批准。

本次未验证新功能行为、真实消费者运行时可达、完整业务语义、所有历史授权链、视觉几何、触控精度、对比度、性能、可访问性、模拟器、设备或用户接受程度。静态 PASS 不表示这些层通过，不表示候选正式接入，更不表示 DS-3、发布或其他树已生效。

## 7. 实际命令和读取记录

全部读取/查询 shell 命令均通过指定记录器执行，工作目录和输出目录固定如下：

```text
python3 /private/tmp/peanut-ds2-preintegration-20261028/record.py --cwd /private/tmp/miniprogram-ds2-preintegration-20261028 --out /private/tmp/peanut-ds2-preintegration-20261028/cold/agent-D --label <编号> [--echo] -- <下列命令>
```

每条命令退出码均为0。D001–D011 使用记录器初始接口，其原始 stdout 通过非 shell 的 Node fs 读取本场景日志显示；没有读取其他场景结果。收到 --echo 用法后，D012 起均用 --echo 直接回显。以下列出实际命令参数；JSON 定向读取命令没有执行业务模块。

```text
D001 pwd
D002 rg --files -g AGENTS.md -g '*SPEC*' -g '*spec*' -g '*RULE*' -g '*README*' -g '!**/evidence/**' -g '!**/models/**' -g '!**/node_modules/**'
D003 cat AGENTS.md docs/design-system/README.md
D004 git status --short --branch
D005 node scripts/validate-design-system.js --query 专项
D006 git rev-parse --show-toplevel --abbrev-ref HEAD HEAD
D007 cat docs/design-system/contracts.md docs/design-system/activation-policy.json
D008 node scripts/validate-design-system.js --show PAT-TRAINING
D009 node scripts/validate-design-system.js --consumers PAT-TRAINING
D010 node scripts/validate-design-system.js
D011 git show -s --format=%H%n%T%n%D HEAD
D012 node scripts/validate-design-system.js --query action
D013 node scripts/validate-design-system.js --query progress
D014 rg -n 'touch|canvas|slider|bind|timer|Timer|timeout|Timeout|handwriting|onHide|onUnload|提交|限时|倒计时|手写|滑杆' miniprogram/pages/training/session/index.js miniprogram/pages/training/session/index.wxml miniprogram/pages/training/estimation/index.js miniprogram/pages/training/estimation/index.wxml miniprogram/pages/cognition/session/index.js miniprogram/pages/cognition/session/index.wxml miniprogram/pages/training/ratio-sense/index.wxml
D015 node -e 'const r=JSON.parse(require("fs").readFileSync("docs/design-system/registry.json","utf8")); console.log(JSON.stringify({keys:Object.keys(r),version:r.designSystemVersion,activation:r.activation,legacyReferences:r.legacyReferences,entries:r.entries.map(x=>({id:x.id,name:x.name,role:x.role,reuseClass:x.reuseClass,status:x.status}))},null,2))'
D016 sed -n '1,280p' miniprogram/pages/training/estimation/index.js
D017 cat miniprogram/pages/training/session/index.json miniprogram/pages/training/estimation/index.json miniprogram/pages/cognition/session/index.json miniprogram/pages/training/session/index.wxss miniprogram/pages/training/estimation/index.wxss
D018 node -e 'const r=JSON.parse(require("fs").readFileSync("docs/design-system/registry.json","utf8")); for(const id of ["PAT-ACTIONS","PAT-PROGRESS","PAT-LAYOUT","PAT-INPUT","CMP-SESSION-HEAD"]){const e=r.entries.find(x=>x.id===id); console.log(JSON.stringify({...e,rolePages:(e.rolePages||[]).map(x=>({page:x.page,path:x.evidence.path,line:x.evidence.line})),candidateEvidence:(e.candidateEvidence||[]).map(x=>x.page)},null,2));}'
D019 cat docs/knowledge-platform/08-spatial-ui-and-accessibility.md
D020 sed -n '1,150p' docs/knowledge-platform/implementations/politics-reading-ui-v1-product-rules-20261025.md
D021 cat miniprogram/components/session-head/index.js miniprogram/components/session-head/index.wxml miniprogram/app.wxss
D022 sed -n '205,300p;565,645p;700,742p' miniprogram/pages/training/session/index.js
D023 sed -n '90,215p' miniprogram/pages/cognition/session/index.js
D024 cat miniprogram/pages/training/estimation/index.wxml miniprogram/app.json
D025 rg -n 'btn-base|ui-button|session-action|keypad-key-base|sheet-drawer|safe-area|train-cell' miniprogram/styles/ui.wxss miniprogram/styles/session.wxss miniprogram/styles/module-skins.wxss
D026 rg -n 'touchstart|touchmove|touchcancel|gesture' miniprogram/components miniprogram/pages/training miniprogram/pages/cognition -g '*.js' -g '*.wxml'
D027 node scripts/validate-design-system.js --audit-base 90b56f784c865c3d24b1a05c17ce7edf71d28897
D028 node -e 'const r=JSON.parse(require("fs").readFileSync("docs/design-system/registry.json","utf8")); console.log(JSON.stringify({sourceBaseline:r.sourceBaseline,sourceObservation:r.sourceObservation,sourceIdentity:r.sourceIdentity},null,2));'
D029 rg -n 'Design System|ds2|规范|唯一|训练|品牌|主题' README.md docs/knowledge-platform/README.md
D030 sed -n '170,210p' miniprogram/pages/training/assumption/index.wxml
D031 sed -n '1,150p;242,275p;293,408p' miniprogram/styles/ui.wxss
D032 git status --short --branch
```

D006 的 flag 组合回显了两次分支名，没有得到 HEAD 哈希；已用 D011 更正核验，不将该输出误报为哈希。D017 的长样式输出亦被工具截断，后续只据实际可见段和定向查询判断，不宣称逐字审完两份样式。D029 匹配的 README 含历史状态摘要，未追读相关评估链接，且未将其当成本场景验证结果。

只写本回执及记录器日志；未改产品、未修改规范、未访问其他工作树，未读取 models 题库/打包数据、个人记忆、历史聊天、其他场景结果或 evidence 目录文件。以上源码事实来自本树，建议与尚未验证项已分开，不把候选当正式共同基线。
