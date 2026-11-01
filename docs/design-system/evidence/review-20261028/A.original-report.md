# A：常识内容下方普通下一步操作——独立只读回执

日期：2026-10-28。检查目录：`/private/tmp/miniprogram-ds2-preintegration-20261028`。本场景只读；没有开发、产品改动、构建、业务执行、自测或线上访问。没有读取个人记忆、聊天、其他工作树、models 题库或打包数据，没有打开任何 evidence 或评估文件。

需先披露读取偏差：A022 对历史规范及 `docs/knowledge-platform/README.md` 的关键词查询过宽，输出混入历史验证/验收结果摘要；A029 对空间规范的查询也匹配了文档内混排的历史状态摘要。这些摘要未用于本次通过/效果判断，但不能声称本场景完全没有暴露于评估结果摘要。严格要求零摘要暴露时，本回执不能代替另一个洁净场景。未进一步打开其链接、evidence 或历史评估结果文件。

## 结论及复用选择

拟新增的是内容下方、随内容滚动的普通下一步操作。选择：**复用 `PAT-ACTIONS` 下有真实消费者的 `btn-base` recipe，由页面配置文案、主次层级、可用/处理中状态和事件；当前没有理由扩展公共 API 或新建通用按钮组件。** 这是实现建议，不是已经实施，也不是批准新视觉数值。

不能直接复制常识现存的“下一条”方案：`learning/index.wxml:218–245` 的 `.learning-actions` 是固定学习底栏；`index.wxss:73` 含 fixed、安全区和遮挡处理，`index.js:295–300` 动态测量底栏，WXML 根节点以 `footerHeight` 补正文底部空间。`handleNext`（JS:306）调用 `engine.advance(session, again)` 并重绘，承担学习推进业务，不是无业务语义的普通按钮。`handleGuideAssess` 也会调用 guideEngine 自评。不能因标签像“下一步”就复用这些推进事件、统计或完成条件。

常识详情现有 `detail/index.wxml:331` 的 `btn-base btn-primary` 是条件显示的“去练习”，但其 `.detail-actions`（WXSS:1101）同样固定；它的 handler（JS:654）查训练项、构造配置并导航训练。可参考按钮 recipe，不应把它当随正文流式布局或普通下一步的完整范例。页面已经从 app.wxss 全局导入 ui.wxss；无需为了按钮先引入阅读卡或学习底栏。

实现前仍须明确目标页面、下一步目的地/内容身份、末项行为和是否确有异步工作；这些不是本次只读场景能够替产品决定的事实。若真正需要不同能力或现有 recipe 无法表达状态，才提出有消费者范围的局部扩展/业务专用新建，并解释不适用原因。普通选择无需机械逐项审批，改变学习行为仍需对应授权。

## 实际发现的规则入口与读取顺序

根 `AGENTS.md` 指定唯一当前入口为 `docs/design-system/README.md`；根 README 与知识平台 README 均指回此入口。根目录查询仅发现这一份 AGENTS。应先读索引，报告树/版本/核验状态，再以角色查询短索引，按需 `--show`、`--consumers`，然后读相关 contracts、registry、源码、示例与消费者。不能以聊天记忆、旧专项“已完成”或源码现值代替当前规则。

本次首先用“下一步”查询，A007 返回 count=0、退出 1；这是检索无匹配，不是激活失败。换成 action 后找到 `PAT-ACTIONS`（另有公式项因关键词匹配），随后核对完整登记、消费者、样式及常识源码。短查询的默认输出确实提供 ID、角色、分类、状态、入口和建议；`--show`/`--consumers` 可继续定位。

契约的六层是 Foundations、Themes、Semantics、Components、Patterns、Experience 的逻辑职责，不另建六套框架。与此任务相关：DS-FND-001 继承现有基础；DS-THM-001 保留四模块身份并分离结果语义；DS-CMP-001/002 划分 A全局/B配置/C专用/D待治理并要求消费者核对；DS-CMP-003/DS-EXP-002 保留卡片角色和阅读正文独立性；DS-PAT-001/003 将业务统计、自评含义与前进模式交给模块；DS-EXP-001/003、DS-GOV-001 限制推广与证据声明。

## 有效版本与实际激活核验

- 索引、contracts、registry 和 activation-policy 的治理版本一致为 `1.0.0-ds2.3`，产品体系 V1.0，阶段 DS-2。
- 当前分支 `codex/design-system-ds2-preintegration-20261028`，HEAD 与 sourceBaseline 均为 `90b56f784c865c3d24b1a05c17ce7edf71d28897`。
- registry 指定治理来源提交 `64ba11f700f6c71ccfa0fc8aec4b55eade73a15e`。A016 直接调用只读 `validateActivation` 返回 `ok:true`、`state:preintegration-candidate`、`formal:false`、errors=[]、changedProductFiles=[]。
- 该核验实际检查分支、授权候选绑定、源码基线祖先、产品树身份和产品差异，并检查治理来源登记版本/隔离候选身份；不是只相信布尔值，也不是人的密码学身份认证。
- A031 以本树明确基线调用 `auditChanges`，返回 changedProductFiles=[]、warnings=[]。这是独立审计 helper 的结果，不能冒称全量 `--audit-base` 验证通过。
- 本树只有候选授权，**不是 adopted-common-baseline，也不是发布候选正式接入**。正式接入须未来另行授权、独立 Git 引用的批准回执，绑定版本/接入提交/目标分支并核验包含关系。本次没有创建该授权、引用或合并。
- 工作区原有治理内容尚未提交：README 与 knowledge-platform README 为修改；AGENTS、design-system、三个验证/测试脚本和 activation helper 为未跟踪。A004 与 A033 的 status 相同；未触动这些输入。

## 实现登记、真实消费者与角色关系

`PAT-ACTIONS` 是 **B/draft Pattern**，实现观察基线为本树 90b56f7，不是一个可在 usingComponents 中直接引用的组件。登记 direct consumers=[]，24 个 rolePages，34 个 candidate applicablePages；这些集合含义不同。A027 静态核对 app.json 与登记页集相同，共38页。

`--consumers` 的 recipe 查询扫描注册页及导入/包含模板中的字面 class。实际 `btn-base` 命中18个页面：

1. pages/note/index/index
2. pages/common-sense/index
3. pages/politics/index
4. pages/training/catalog/index
5. pages/cognition/guide/index
6. pages/cognition/session/index
7. pages/training/session/index
8. pages/training/result/index
9. pages/training/wrong-book/index
10. pages/training/assumption/index
11. pages/training/estimation/index
12. pages/training/ratio-sense/index
13. subpackages/photo/process/index
14. subpackages/note/detail/index
15. subpackages/common-sense/detail/index
16. subpackages/politics/route/index（命中 guided-route.wxml 导入模板）
17. subpackages/politics/route/units
18. subpackages/politics/practice/index

同源 ui.wxss 的 `.ui-button` 存在，但本次注册页/模板静态扫描消费者为0。不能据此删除它，也不能要求全部页面迁到它。`.btn-base`、`.btn-primary`/secondary/ghost、pressed 及尺寸修饰类是现存两套 API 中有消费者的一套；其现有数值并未获设计批准。`session.wxss:92` 的 `.session-action-dock` 是 fixed dock，不能为普通流式操作顺手引入。

常识 learning 是操作角色相关页，但未出现在 btn-base 的18个静态 recipe 消费者中；其本地 primary/secondary/actions 实现应保持事实。常识 detail 的角色线索是 tab 切换，btn-base recipe 的线索则是“去练习”；同一页不能因此被说成所有按钮/状态都共用一个组件。角色页也不证明运行时可达性、全状态或同一实现。candidateEvidence 和 applicablePages 更不等于真实组件消费者。

相关登记还表明：CMP-KNOWLEDGE-CARD 是 B/draft、直接消费者仅政治 detail/route/practice；常识普通操作不因存在共享卡就自动成为其消费者。CMP-READING-CONTROLS 是 B/draft，直接消费者政治 detail/route/units，且已有显示偏好保存、preferenceschange 等副作用。以上消费者来自登记，本次重点查询只对 PAT-ACTIONS 做实际模板扫描；没有声称其他登记的所有引用已独立重扫。

## approved、draft、历史专项与例外

approved 指本轮声明范围内的产品原则，不能解释为现有实现、具体字号/色值/间距/几何或设备效果获批。本次 registry 中所有30个实现/Pattern 均为 draft；implementation.observed/source-observed/role-observed 仅说明源码/角色事实。DS-SEM-003 操作状态协议、DS-FND-002 数值几何和 DS-PAT-005 组合体验本身也仍为 draft。

必须保留笔记、常识、政治、行测速练的长期皮肤；身份色、知识语义、客观对错及记忆评价分别表达。DS-SEM-001 的客观错误红色不授权当场换色，DS-SEM-002 的“没想起”不等于答题错误。module-skins 当前让政治消费常识/训练同一蓝色调色板是源码事实，不是允许本次重做四模块主题的授权。

历史 `08-spatial-ui-and-accessibility.md` 有品牌只限标题/插图/轻背景、固定认知色、44逻辑像素/对比度等专项条款。当前索引明确它是历史和专项输入，不能整体升级为全产品批准规范；旧品牌限制与当前批准的模块皮肤原则冲突时，按当前明确范围处理，不能静默改业务/皮肤。

2026-10-25 政治阅读产品规则声明第0批及第1批8个代表页面的批准范围，正文字号、行距、显示偏好与样板启用属于该专项，不能推给常识普通按钮。本树 reading-surface-policy 源码现有更广的 QUICK_IDS、SYSTEMATIC_IDS、37个 ARTICLE_IDS 与 activity==='reading' 的准入判断，且导出 quickCompletionEnabled:true。当前启用范围大于历史八样板只是源码事实；DS-2 不补批，也不授权缩回历史范围。没有根据文档历史“已测试”宣称本树通过。

登记例外：PAT-MEMORY 的笔记快记/常识导读现为自评后自动前进，政治每日练习回忆现为停留核对；两模式均可存在，不由普通按钮统一。PAT-READING/CMP-READING-CONTROLS 的政治专用字号行距、偏好保存不能推进学习；PAT-LAYOUT 不可将固定区、流式区、动态测量统一成硬编码高度。PAT-TRAINING 为 C/draft，限时、手写、滑杆、认知任务允许专项独立；行测速练只是参考，不因共享按钮存在就全面迁移。PAT-PHOTO 为 C/draft，文件/权限/支付/权益/交付独立；它既是 btn-base 真消费者之一，也不能因此接入学习推进规则。

未发现需要暂停普通复用判断的两个同范围 approved 条款直接冲突。发现的是上述已被当前索引说明的历史范围差异；以及本场景读取限制和全量验证器读取范围之间的执行约束，应保留边界而不绕过。

## 验证要求、已做与缺口

本次已做：规则及版本对照；只读激活核验；查询失败与换词定位；PAT-ACTIONS 完整登记/静态消费者扫描；app注册页覆盖比较；普通按钮与固定底栏/学习 handler 的源码核对；以明确90b56f7基线的产品差异 helper；首尾工作区状态检查。

没有运行全量 `node scripts/validate-design-system.js` 或完整 `--audit-base`：源码 `validate()` 会递归 miniprogram 并读取/JSON.parse 所有 `.json` 来发现组件，包含 models 题库 JSON；题设禁止读取题库优先。本次用只读查询、activation 与 auditChanges 的受限 helper，不改验证器、不伪造全量 PASS。没有运行 test-design-system-*、业务检查、构建或应用，因此也没有任何业务自测通过的声明。

若未来获准实施，应以任务明确基线运行全量 DS结构/消费者/样式与增量审计，并按变更范围选择适用的业务检查；需先解决其题库读取与当次权限边界。索引说明旧 validate-ui-tokens 有政治专用假设，不能升级为全产品硬门禁；入口控制器检查属于替身/VM，不能替代页面几何；public-learning-page-runtime 为B5历史入口，本90b56f7目标不含，不能复制来冒充当前可运行检查。

页面验收应逐项覆盖正常、按下、处理中、防重复、禁用、结果/末项、异常/重试、返回恢复及内容身份变化；由业务提供资格与状态，不由按钮计算评分、答案、记忆、队列、进度或完成条件。应核对长文末段可见、普通操作随内容滚动、放大文字/长文案/窄屏、安全区和可读名称/触控几何；若修改公共样式，需回看全部18个recipe消费者及声明范围，更新登记、例外和本次证据。真实页面、几何、设备、人体验收、集成与发布分别记录，本次全部未执行；专项的窄屏/真机豁免不能外推到新常识任务。

## 实际命令记录

以下每项均作为记录器 `--` 后的命令执行。统一前缀为：

`python3 /private/tmp/peanut-ds2-preintegration-20261028/record.py --cwd /private/tmp/miniprogram-ds2-preintegration-20261028 --out /private/tmp/peanut-ds2-preintegration-20261028/cold/agent-A --label <编号> [--echo] -- <命令>`

A001–A011 未加 echo，随后通过非 shell Node fs 仅显示本 agent 对应 stdout；A007 同时显示其 stderr。A012–A033 使用记录器新增的 --echo。原始 stdout/stderr 及命令日志位于本 agent-A 目录，不读取其他场景。

```text
A001 pwd
A002 ls -la
A003 cat AGENTS.md README.md
A004 git status --short --branch
A005 git rev-parse HEAD
A006 cat docs/design-system/README.md
A007 node scripts/validate-design-system.js --query 下一步
A008 cat docs/design-system/contracts.md docs/design-system/activation-policy.json
A009 node scripts/validate-design-system.js --query action
A010 rg --files -g AGENTS.md -g '!miniprogram/models/**' -g '!**/evidence/**' -g '!**/evaluation/**' -g '!**/evaluations/**' -g '!**/packed/**' -g '!**/runtime-data/**'
A011 sed -n 1,240p scripts/validate-design-system.js
A012 node scripts/validate-design-system.js --show PAT-ACTIONS
A013 node scripts/validate-design-system.js --consumers PAT-ACTIONS
A014 cat scripts/lib/design-system-activation.js
A015 node -e 'const r=require("./docs/design-system/registry.json"); console.log(JSON.stringify({version:r.designSystemVersion,sourceBaseline:r.sourceBaseline,activation:r.activation,legacyReferences:r.legacyReferences,entries:r.entries.map(e=>({id:e.id,role:e.role,status:e.status,reuseClass:e.reuseClass}))},null,2))'
A016 node -e 'const r=require("./docs/design-system/registry.json"); console.log(JSON.stringify(require("./scripts/lib/design-system-activation").validateActivation(process.cwd(),r),null,2))'
A017 node -e 'const r=require("./docs/design-system/registry.json"); const e=r.entries.find(e=>e.id==="PAT-ACTIONS"); const c=require("./scripts/validate-design-system").consumerLookup(process.cwd(),e,r); console.log(JSON.stringify({directConsumers:c.directConsumers,rolePages:c.relatedPages.map(x=>({page:x.page,relation:x.relation,evidence:x.evidence})),recipes:c.staticReferences,candidateApplicablePages:c.candidateApplicablePages,limits:c.limits},null,2))'
A018 rg -n -A 14 -B 4 'btn-base|ui-button|session-action|session-footer|safe-area' miniprogram/styles/ui.wxss miniprogram/styles/session.wxss
A019 rg -n 'btn-|detail-actions|action|下一|handleNext|handleTraining|disabled|loading|session-action|toolbar' miniprogram/subpackages/common-sense/detail/index.wxml miniprogram/subpackages/common-sense/detail/index.wxss miniprogram/subpackages/common-sense/detail/index.js miniprogram/subpackages/common-sense/learning/index.wxml miniprogram/subpackages/common-sense/learning/index.wxss miniprogram/subpackages/common-sense/learning/index.js
A020 cat miniprogram/app.wxss miniprogram/subpackages/common-sense/detail/index.json miniprogram/subpackages/common-sense/learning/index.json
A021 node -e 'const r=require("./docs/design-system/registry.json"); console.log(JSON.stringify(r.entries.filter(e=>["PAT-READING","PAT-LAYOUT","PAT-MEMORY","CMP-READING-CONTROLS","PAT-TRAINING","PAT-PHOTO","CMP-KNOWLEDGE-CARD"].includes(e.id)).map(e=>({id:e.id,status:e.status,reuseClass:e.reuseClass,sources:e.sources,states:e.states,businessBoundary:e.businessBoundary,sideEffects:e.sideEffects,exceptions:e.exceptions,validation:e.validation,consumers:e.consumers,rolePages:e.rolePages.map?.(x=>({page:x.page}))})),null,2))'
A022 rg -n '范围|品牌|青|绿|政治|常识|笔记|样板|普通|正文|底栏|批准|适用|字号|行距|发布|已测试' docs/knowledge-platform/08-spatial-ui-and-accessibility.md docs/knowledge-platform/implementations/politics-reading-ui-v1-product-rules-20261025.md docs/knowledge-platform/README.md
A023 node -e 'const r=require("./docs/design-system/registry.json"); console.log(JSON.stringify(r.entries.filter(e=>["PAT-READING","PAT-LAYOUT","PAT-MEMORY","CMP-READING-CONTROLS","PAT-TRAINING","PAT-PHOTO","CMP-KNOWLEDGE-CARD"].includes(e.id)).map(e=>({id:e.id,status:e.status,reuseClass:e.reuseClass,sources:e.sources,businessBoundary:e.businessBoundary,sideEffects:e.sideEffects,exceptions:e.exceptions,validation:e.validation,consumers:e.consumers.map(x=>x.page),rolePages:(e.rolePages||[]).map(x=>x.page)})),null,2))'
A024 sed -n 275,335p miniprogram/subpackages/common-sense/learning/index.js
A025 sed -n 640,676p miniprogram/subpackages/common-sense/detail/index.js
A026 sed -n 218,246p miniprogram/subpackages/common-sense/learning/index.wxml
A027 node -e 'const r=require("./docs/design-system/registry.json"),a=require("./miniprogram/app.json");const pages=[...a.pages,...(a.subPackages||[]).flatMap(p=>p.pages.map(x=>p.root+"/"+x))];const e=r.entries.find(e=>e.id==="PAT-ACTIONS");const c=require("./scripts/validate-design-system").consumerLookup(process.cwd(),e,r);console.log(JSON.stringify({registeredPages:pages.length,registryCoverageMatches:JSON.stringify([...pages].sort())===JSON.stringify([...r.pages].sort()),directConsumers:c.directConsumers.length,rolePages:c.relatedPages.length,candidateApplicablePages:c.candidateApplicablePages.length,recipes:c.staticReferences.items.map(x=>({recipe:x.recipe,count:x.consumers.length,pages:x.consumers.map(y=>y.page)}))},null,2))'
A028 rg -n -A 8 -B 2 'common|note|politic|ui-button|gradient-primary' miniprogram/styles/module-skins.wxss
A029 rg -n -A 3 -B 2 '品牌|青绿|政治红|按钮|触控|对比度|模块|主色|阅读' docs/knowledge-platform/08-spatial-ui-and-accessibility.md
A030 cat miniprogram/services/knowledge-platform/reading-surface-policy.js
A031 node -e 'console.log(JSON.stringify(require("./scripts/validate-design-system").auditChanges(process.cwd(),"90b56f784c865c3d24b1a05c17ce7edf71d28897"),null,2))'
A032 rg -n 'footerHeight|^<view|@import|note-detail-training-action' miniprogram/subpackages/common-sense/learning/index.wxml miniprogram/subpackages/common-sense/learning/index.wxss miniprogram/subpackages/common-sense/detail/index.wxss miniprogram/subpackages/note/detail/index.wxml miniprogram/subpackages/note/detail/index.wxss
A033 git status --short --branch
```

A007 退出1是无命中；A021 因对 component 的不存在 rolePages 错用可选调用而 TypeError，退出1，A023 改为 `(e.rolePages||[])` 后查询成功。未因此修改任何工程文件。除此没有失败命令。除本回执及记录器日志外没有写文件。
