# 本地 main 集成与模板/覆盖确认清单

本记录先保存本地开发集成与模板盘点。下方新增“首页交互第一批”是用户后续明确授权的局部实施；它不代表UI验收、内容正式准入或发布。除该节列明范围外，正文与操作层模板仍不擅自覆盖。

## 已落地与恢复

- main原HEAD：`8a4cac158cfdd36f16b30168e88ad905540d59fd`。
- 原成果恢复checkpoint：`5291ee809379c71d488a04b89a54d47e322e3937`，精确保留83项受跟踪修改和11项明确运行依赖；其余资产不盲目纳入。
- 模块合并checkpoint：政治`8dde3a4`、常识`9908a22`、笔记`e7659b9`。
- 已落地main的集成产品代码：`61cd99fc86f28e57acab8679765c4e78fc0015ab`。后继交接文档commit不改变该产品字节。
- 持久保全：`/Users/jmac/WeChatProjects/ui-integration-backups/main-preintegration-20261025T172412Z`。原1277文件约35.9MB逐字节保全，固定输入bundle验证通过，保护refs前缀`refs/codex/checkpoints/integration-20261025T172412Z/`。
- main通过正常fast-forward先到5291ee8再到61cd99f。第一次第二段快进因未跟踪中文路径被Git保护性中止，确认未覆盖后改用NUL分隔真实路径补齐清单。最终124项碰撞原件按`relocation-plan-complete.json`移动到`displaced-before-main-update/<原相对路径>`，原始`files/<原相对路径>`副本仍在；1059项原未跟踪文件留在main原处并再次核对哈希。没有hard reset、clean、删资产、改史、推送或发布。
- [落地回执](main-landing-receipt.json)、[原成果精确清单](main-preserved-files.json)、[实际集成检查](integration-validation.json)、[main落地后检查](main-landed-check.json)。

| 业务输入 | 固定最终SHA | 接入范围与保持的门 |
|---|---|---|
| 政治 | f3ccfccfbb1b56a1934d66105f83866cc58b8dda | 含41e043b内容及完整依赖；37正文/5步快读/77节系统/178回忆/24应用/14易混。497截图和81历史日志仍在原树/既有专属保全，不盲目入Git；状态页专项未启 |
| 常识 | 51ae8b743d7b9d1bebe398bc63ca3652852e4588 | 最新64批/170组/原始1682，前端1681＋1 HOLD；开发603题，正式准入新增0；不拿旧3819645替代 |
| 笔记 | 4a863c40661e0e545cec62a34a2f42edd054428b | 含ME-COVERAGE-CORRECT-02及1dc6704完整生成/兼容链；41基础＋92方法=133卡、121完整应用、142资源，正式记忆卡/资源0；有意停用卡不恢复 |

## 共享接线处理

最终五TAB为**首页、笔记、训练、常识、政治理论**，已经包括首页，不是5加1。照片保留为真正首页“报名照片处理”工具入口和完整独立页面/分包。

核实发现原main实际是“笔记/训练/常识/政治理论/照片”，并没有portal页；没有继续沿用这个错误事实。真正首页从此前已授权、原字节保全的`ce7d634`外壳取回4文件及3项必要图片，其根来源为135d6e9及已批准稳定banner。没有重新设计首页或照片。

- app.json按页面/分包并集处理，保留照片与三模块全路由，portal作为首入口。TAB数据和渲染沿用PNG/既有文字标识，图标差异后置。
- TabBar保留政治的合法目标检查、防重复切换锁、当前页跳过、失败提示和complete解锁；主文件没有用ours/theirs粗暴覆盖。
- 三模块与训练首页只适配选中索引。照片3项入口包装层复用已批准非TAB适配：普通页面进入、返回在栈内的已有editor、取消TAB底栏偏移；控制器/算法/服务/支付不改。
- 政治历史夹带的13项训练页面/记录读取差异留在其历史中，当前训练采用原main实现，未借集成修改训练行为。[导航逐项记录](navigation-reconciliation.json)。
- 共享平台00–09及README的常识副本证实自94179c3起未变化，保留后续已接受的平台增补并添加最新模块交接入口；不让旧副本覆盖新契约。政治/常识/笔记冲突处理分别见本目录reconciliation记录。

## 验证及明确缺口

- 政治：7项定向构建/事实/定位/题库/运行库/来源闭环通过；原`validate-politics-reading-ui-v1.js`的全树canonical封印失败，因集成后的main配置/跨模块文件不等于政治旧封印。脚本、旧封印和失败输出未改；不是全绿。[政治结果](politics-checks.json)。
- 常识：9项定向构建/来源审计/57项学习回归/导读预览与页面/展示/单目标HOLD身份/离线编译通过。[常识结果](common-checks.json)。
- 笔记：9项构建/页面/合同/内容/记忆/纠错检查通过，保留正式准入0。[笔记结果](notes-checks.json)。
- 集成：37路由与递归组件依赖完整，717项模块/训练/照片来源字节核对通过（仅列明TAB索引及照片包装层例外）；五TAB入口/重复点击/失败解锁/照片回原editor的离线事件通过；main落地后再次通过。90项实际安装WCC/WCSC模板/样式编译通过，包含自定义TAB，坏模板能被拒绝。
- 照片：核心21场景及picker、preview/export、本地编译命令通过。首次测试夹具仍期望照片为TAB，已按真实非TAB栈更新返回断言，任务不被二次初始化的断言保留。
- 本轮新接线与脚本空白检查通过；完整历史合并的空白警告按输入SHA逐项登记，保留Markdown有意换行及冻结末尾空行，不声称全历史raw检查全绿。
- **未运行**：本轮真实IDE整包编译、实际TAB点击、合并构建截图和真机/视觉验收。当前没有可调用WeChat工具，最新CUA原生apps为空；未重试已拒3799、换端口或改安全设置。政治原3组隔离运行和常识历史280页面证据不冒充本轮main运行。本地源码/离线通过不代表实际画面已确认。

## 旧UI分支与下一工作基线

旧`codex/learning-ui-integration-v2`仍为`ce7d634`，原工作树和用户`project.config.json`格式改动保持；观察SHA256仍为`e2ca64a6631d7832da2427d7047b0932c9d5380ab3f857f2aaeacfe97d7186fb`。没有强行merge main到旧UI：两者有37项公共组件/样式差异，旧UI整体重放有覆盖最新导读和政治阅读优化的风险。[差异清单](old-ui-shared-differences.json)。

已从新main建立干净工作基线`codex/ui-main-baseline-20261025`，路径`/Users/jmac/WeChatProjects/miniprogram-ui-main-baseline-20261025`；该新分支承接main，旧分支和恢复点保留。旧UI的×清空、搜索返回及learning-session-head等是**待选择性复用增量**，不能宣称当前main已完成旧B1统一，也不整体覆盖当前模块页面。

## 模板/覆盖清单（待用户确认）

依据为上述固定输入、当前实际路由/文件和用户已明确的优化范围。当前合并构建未取得真实截图，因此下表是源码与历史范围盘点，**不是本轮视觉确认**。分类中“保留为模板”只表示建议保留/参考；“仅改操作区”不能扩大为正文重排；本次没有授权整页替换。

| 层/项 | 实际路由与状态 | 当前文件/来源 | 建议 | 精确覆盖边界与证据限制 |
|---|---|---|---|---|
| H0 真正首页 | pages/portal/index；照片工具进入pages/photo/index | pages/portal/index.*；外壳ce7d634（根135d6e9/获准banner） | 保留独立首页，作为入口层模板候选 | 仅后续确认导航/入口一致性；不套知识模块正文样式、不改照片处理；当前无新截图 |
| H1 三业务首页 | pages/note/index/index、pages/common-sense/index、pages/politics/index | 各目录index.*；4a863c4/51ae8b7/f3ccfccf，只有TAB索引适配 | 仅公用搜索/入口和操作习惯待统一，整页替换未授权 | 保留各模块最新功能、路径和文案；搜索宽度须同构建测量，不凭旧width声明断言；旧UI首页不可整文件回盖 |
| O1 进度与顶部状态 | note/memory、note/practice、common-sense/learning、politics/practice、politics/route/index及route/units | 相应index/guided-route/units模板；训练pages/training/session/index.*与styles/session.wxss为视觉参考 | 通用操作区候选，保留个性 | 只统一位置、信息层级、字号/间距；进度口径/分段/阶段/答对/用时不造不改；不能把阅读当掌握 |
| O2 前后步/返回/反馈/底栏 | 上述已有学习页的合法状态 | 各页原handler与footer/dock；笔记memory四自评为集中区参考 | 只改操作区域候选 | 保留1–4等实际合法动作、判答时机、跳过/完成/退出语义、取消返回恢复；不抽取出题、随机或存储；状态页专项继续暂缓 |
| O3 学习范围设置 | common-sense/learning?mode=guide/qa等；notes memory/practice；politics practice及既有层级选择 | common-sense/learning/index.wxml/.wxss的settings-*、scope与确认区域；51ae8b7 | 常识当前设置作交互/结构模板候选 | 科目/专题/数量/原随机控件保留；即时生效与草稿确认不互换；禁止整页复制常识业务函数 |
| C1 常识知识导读 | subpackages/common-sense/learning/index?mode=guide；开发首页另带sample=expansion-v1 | learning/index.*的guide-page-header、guide-progress-card、guide-card/guide-paragraph/guide-emphasis；guide服务和307重点配置；51ae8b7 | 保留为内容呈现模板，默认不覆盖正文 | 保留组导语、段落、来源与精确重点；可单独协调顶部/设置/前后步；1681前端＋1 HOLD不改变。用户称已一轮优化，当前检查通过；旧280非本轮截图 |
| C2 常识易混辨析 | subpackages/common-sense/learning/index?mode=confusion；原flowStep/对照状态 | 同页comparison-card/comparison-row、confusion-steps、learning-actions；51ae8b7 | 保留为对照内容模板，操作区另评 | 保留先判/差异/再辨原流程和引用；不能直接替换政治不同阶段模型。用户指定可作参考，本轮未实看合并构建 |
| P1 政治快速理解列表/索引 | 当前登记的快速了解入口为subpackages/politics/route/index?type=quick；同路由内5步导读与结构索引 | route/index.js加载guided-route.js/.wxml/.wxss，styles/politics-quick-visual.wxss；f3ccfccf | 保留已优化部分；用户所指list具体状态待截图对应 | 没有独立注册quick-list页，不造页面或把某个结构索引冒认用户所指列表；确认对应状态前不覆盖 |
| P2 政治快速理解正文 | 上述quick路由active正文及已有前后步 | guided-route.*、politics-quick-visual.wxss、politics-reading.wxss、reading-controls组件；f3ccfccf | 保留为快读正文模板 | 只协调既有工具/返回位置；保留原5步、段落/重点/来源/自测及阅读开关；不以旧UI整页替代 |
| P3 政治系统学习列表 | subpackages/politics/route/units，screen=groups；两篇路线切换 | units.*、styles/politics-route-list-visual.wxss、politics-status-tag.wxss、route-list-presentation.js；f3ccfccf | 保留为路线/列表模板 | 保留14＋7主题、绿色已读标签、标题层级/续学/回看/进度；仅上一步/返回等公共操作候选；原用户抽样及隔离回归为历史范围 |
| P4 政治系统学习正文 | 同units路由screen=lesson；closeout为既有结束/回看状态 | units.*、politics-systematic-visual.wxss、politics-reading.wxss、reading-ui.js、reading-controls；f3ccfccf | 保留正文模板，只另评操作区 | 77节原内容、标题/段落/重点和精确来源定位不变；不把结束/失败专项借此启动，不覆盖已有回看页 |
| P5 全部知识“真正正文” | subpackages/politics/detail/index?id=<正式unitId>&mode=reading；从map/search进入；不是map卡片预览 | detail/index.*、components/knowledge-card-surface/index.*、styles/politics-article-visual.wxss/politics-reading.wxss、reading-ui.js；f3ccfccf | 保留正文内部文字排版为模板 | 保护knowledge-reading-*、pr-*与既有article视觉开关、37篇原块ID/顺序/重点选择；只允许另行确认导航/工具/操作区，不重写正文或把整页当单张知识卡 |

政治119个实例（37正文＋5快读＋77系统）已在原分支覆盖通用阅读样式，但不等于119页精细视觉逐页验收；专属样式开关继续按现有范围，不扩大。依据[快速覆盖合同](../../implementations/politics-reading-fast-coverage-rules-20261025.md)、[系统路线列表交付](../../implementations/politics-systematic-route-list-l0-l1-delivery-20261025.md)及[政治完整交接](../politics-development-20261026/README.md)。常识依据[最新交接](../../implementations/common-sense-checkpoint-2026-10-25.md)和用户本次明确的模板意图。

请用户集中确认H0/H1首页层、O1–O3操作层、C1/C2/P1–P5内容层的保留/局部覆盖选择；特别需对上P1所指具体list状态。确认前不开始新视觉改版。实际构建截图、普通宽度/大字与跨页操作质量仍需在后续对应批次取得证据，不能用此源码盘点代替。


## 首页交互第一批（2026-10-26，实现 checkpoint，视觉门未过）

最新授权覆盖上表 H1 的首页交互实施确认门；其余内容模板、训练、真正 portal 与照片保持原样。工作树为 `/Users/jmac/WeChatProjects/miniprogram-ui-main-baseline-20261025`，分支 `codex/ui-main-baseline-20261025`，固定业务基线 `d5032323cdf4d61edfec6f93ee4e7c181c165c50`。没有追接三业务线的新版本，没有合入 main、推送或发布。

本批顺序与边界：先统一入口结构、文案和已有路径，再进入后续视觉阶段。选择性复用旧 ce7d634 的 `learning-home-head` 展示/事件接口，重新局部实现整行点击入口；不整体回放旧首页、旧 app.wxss 或旧业务快照。三个首页原已失效布局规则在本页内移除，公共新样式只由三个首页导入，训练 token 定义本身未改。

| 项 | 已实现目标与交互 | 允许差异 / 验证与当前状态 |
|---|---|---|
| 页头与搜索 | 三首页均为“标题说明 → 整行点击搜索”；政治标题改“政治理论”，笔记保留“花生笔记”，常识保留“常识判断” | 共用 home-only 组件；组件 host/root/内容容器按完整内容宽度布局，搜索使用 view 按钮语义，排除原生 button 默认宽度这一干扰因素。**实际 host 几何、运行时级联与正常宽度换行未取到证据，不能宣布搜索宽度已修复。** |
| 主学习卡 | 搜索后同一位置显示主卡及单一主要操作；笔记“每日快记／记住公式、符号与必要条件／开始快记”直接接 memory?kind=basic | 笔记不制造每日题组、跨天刷新或完成状态，不在首页读取/写入学习记录；续学由原 basic 引擎决定。政治 dailyCard 的 ready/empty/completed/storage-error 和原 qa 回退保留，常识 daily 路由原样 |
| 全部知识 | 主卡后统一主名称“全部知识” | 笔记 directory；常识 topics；政治 map?state=overview，保留 terrain 显示偏好。分类数量、副说明依原模块，不把政治旧 projection 覆盖回来 |
| 学习方式 | 全部知识后为“换一种学习方式”及纵向整卡点击，名称、短说明、必要状态、箭头 | 借用训练入口交互结构，无考试新功能；笔记其余 method/exam/application 均保留，政治四条真实路线和收藏筹备入口保留，常识四方式与次级“按领域查阅”四入口均保留 |
| 搜索往返 | 首页只跳转独立搜索；结果进入目标后依原生左上返回，保留页面实例的查询、范围、结果批次及滚动位置；抑制 300ms 内同目标重复 tap | 仅增加视图级 scroll/返回恢复与卸载时清理输入定时器；政治原文、关系、体系/位置、回忆目标及原保存语义保留，不将多目标改成单一正文；不新增正文返回按钮 |
| 本批以外 | 设置、学习页顶部/进度条/底部操作区、正文模板视觉精修均未开展 | 本次是恢复实施后的首页切片，不等于此前 B1 公共界面整批全部完成；后续先核对该切片真实画面，再推进其余公共界面，不进入 B2 正文精修 |

证据入口：[25项交互/来源对照](home-interaction-batch/interaction-checks.json)、[8组回归摘要及原日志](home-interaction-batch/regression-summary.json)、[92项WCC/WCSC编译](home-interaction-batch/template-compile.json)、[同版本产品文件哈希](home-interaction-batch/source-sha256.json)。定向回归是实际页面控制器在平台 stub 下执行，与 d503232 原控制器比较导航目标和相关写入；**不是真实模拟器点击或布局测量**。

- 通过：新增首页/搜索定向 25 项；笔记页面、V5连续性、最新记忆纠错3组；常识学习与导读展示2组；政治首页、每日练习、当前阅读来源基线3组；安装版 WCC/WCSC 92项，坏模板拒绝负例通过；本批差异空白检查通过。
- 首次定向脚本失败为 VM 跨上下文数组原型的 deepStrictEqual 比较问题，改为比较序列化状态值后通过；未放宽业务断言。随后补充政治 definition/relation/location/recall 多目标导航与固定时钟检查，25项最终通过。
- 受保护范围：真正首页/照片、五 TAB、训练、三个模块内容与模型、学习引擎、评分/准入/调度/存储、所有优化过的正文文件相对 d503232 均无本批改动。路由未增删。旧整合 owner 字节快照是集成阶段封印，不适合作为本次已获准首页改动的验收门；原脚本/封印不改。
- 未运行：当前候选真实 IDE 整包编译结果读取、同版本模拟器截图、320/390实际宽度、大字/长标题/触达区域、键盘与原生左上返回、真机。官方 CLI 打开曾成功，但只读 MCP initialize 被明确拒绝：`MCP access token is required. Recopy the MCP config from Settings → Security.` 原生 CUA 无微信界面。未重试被拒端口/令牌请求，未改权限、端口或重启应用。**打开成功、离线编译和历史截图均不替代本候选真实证据。**

### 同版本集中核对最小路径（尚未执行）

1. 微信开发者工具保持当前独立项目，核对项目目录为上述 UI 工作树；重新编译并同时记录该提交身份、编译状态与画面。不要打开 main 或旧 integration-v2 冒作本候选。
2. 笔记/常识/政治三个 TAB 逐个比较首页：标题 → 搜索整行 → 主卡 → 全部知识 → 纵向入口；390宽常规字号文字不异常折行，320宽/大字可换行但不遮挡或横溢。真正首页与训练不在改版范围。
3. 每个搜索入口 → 输入一个真实查询 → 滚动结果/必要时更多 → 打开目标 → 左上返回：查询、范围、已有结果和位置保留 → 再左上返回首页。政治另核关系/所在位置目标；点击 × 后查询结果清空，键盘和返回不受干扰。×的视觉统一不是本批新增修改，若当前搜索仍为旧样式，记录为后续公共界面待办。
4. 笔记“开始快记”进入既有 basic 轮次，已有轮次按原引擎恢复；其他三模式与全部知识各打开并返回。常识主卡、四学习方式、四领域入口各按真实路径打开；政治每日卡、四路线、全部知识各打开并返回。重复点击不出现相同页面多次叠栈，退出重进仍按原模块规则恢复。

真实通路补齐后应先完成执行端自检，再给用户集中验收，不把此清单当作已验证。当前停止在首页切片视觉门，尚不声明可交付视觉质量或整批验收。

### 旧政治封印补充说明（只读核对结论，未改门限）

`validate-politics-reading-ui-v1.js`比较旧 baseline.files 的 canonical 字节，不是“新增文件会触发”的检查。最终源 f3ccfcc 本身也因平台 README 新增交接段落失败：旧期望 `6a60f5d9cce37ef314ed4ec72deb69f66eb7cfa71812a3a594180eb16e1ba3f6`，实际 `447ee1156006fce9a995312e01d980bff1d8bc508aa8d8f9507037a2370ba868`；源3037项中仅该处不同，无缺失。历史check-3通过早于最终README，不冒充最终f3ccfcc全绿。集成树另有已登记213项变化（203项对应固定输入、10项共享接线/文档）和484项未入源Git的历史evidence（422 PNG/62 log），不将其解释为运行时内容缺失，也不盲搬历史证据刷绿。本批不重跑或放宽该旧门；保留此已知失败，独立使用当前受保护内容与展示回归证据。


## 首页视觉第二批（2026-10-26，可预览候选，未视觉验收）

用户批准后在第一批 fa15d2d 上继续，仅改三首页 WXML 与首页共用样式。名称为每日快记／每日常识／每日理论；各保留一个原主操作，政治非 ready 状态沿用 dailyCard.description 与原 action/meta，未新增进度、续学判断或每日调度。精简重复大标题和常驻规则说明；全部知识保持原尺寸等级，以书页目录图形与浅蓝底增强识别；学习方式保留纵向独立厚卡，压缩分区空白，未隐藏入口或锁定页面高度。

图形为项目内可维护的 CSS 线描书页、路线、对照和叠卡，共用尺寸/描边，无 emoji、外部图片、上传或新增依赖。参考训练入口的图形＋主副文案＋箭头结构，未复制训练大图。复用已有 primary-600、green-700、bg-soft-blue/bg-card、ui-font-*、radius/space/chevron token；绿色只作图形辅助，主操作仍蓝色。未更动 token 定义和训练/portal/照片/五TAB/设置练习/正文。

[本批25项入口与搜索回归](home-visual-batch/interaction-checks.json)、[92项离线模板样式编译](home-visual-batch/template-compile.json)均通过；政治首页及每日、笔记页面、常识学习回归通过，原输出与文件哈希在本目录 home-visual-batch。两项既有检查仅更新获批首页文案断言，原路由/存储/状态/恢复断言保留。未重跑旧政治全树封印刷绿。

官方 CLI open 当前工作树成功（IDE server 52410，✔ open），未关闭或重启其他项目。实际当前整包编译结果、截图和真机仍未读取；既有 MCP token 缺口未绕过。Library 参考政治截图下载先因系统 Python 不支持联合类型失败，使用现有新版 Python 运行支持助手后 download failed；未取得像素，未假称参考图已查看，亦未继续猜 URL 或绕过权限。其余参考图未下载；此候选按已批准文字方向与代码 token 实现。

因此每日卡“参考高度约75%／60–80%”和标准设备四学习方式完整首屏**尚无尺寸证据，未声明达标**。已避免固定高度、裁切和小字体挤压；320/390、大字、长说明及TAB安全区仍待同构建真实画面核对。最小预览：确认本工作树和本节提交身份后重新编译，分别打开笔记／常识／政治首页完整截图（含底部TAB），检查主卡比例、全部知识图形、四路线末项和搜索整行宽度；原第一批往返路径保持适用。用户当前可在已打开项目查看候选；最终视觉接受仍待实际画面。


## 首页精细化第三批（2026-10-26，尺寸等级保留）

基于 b2dbb40，用户已接受尺寸后，仅精细化三首页与局部共享样式。设计规则：目录入口独立构图；普通卡使用统一光学尺寸的语义图形；任务状态与按钮权重清楚；主蓝辅绿与中性色保持克制。

新增5份原创本地 SVG（images/module-home/{directory,book,route,compare,memory}.svg），替代 CSS 细线拼接。统一圆角、2单位圆头描边与浅蓝实体承托；目录构图右置，成组书页、主蓝封面、绿色书签；普通学习图形56rpx、每日44rpx，目录96×72rpx。色值对应现有 primary-600/100、green-700、bg-card/soft-green，未改全局token，未用外部素材/依赖。目录文字优先、标题主蓝加重，未扩大padding或固定高度；学习方式继续独立厚卡，仅引用现有低强度shadow-card。

每日卡改为列式自然布局、按钮靠右，字号、卡片padding、间距与安全区沿用已接受版本。政治 active 展示“接着完成这一组，巩固理论要点”，updated 展示“练习内容已更新，可以重新开始”；ready核心价值、真实meta/action、completed/empty/storage-error原描述保留。不再暴露首页固定轮次机制，未改业务投影/调度/持久化。搜索与全部知识路由未动。

[25项交互回归](home-refinement-batch/interaction-checks.json)、[92项离线模板/样式编译](home-refinement-batch/template-compile.json)、政治首页与每日练习回归通过；5个SVG XML有效；本批差异空白检查通过。保护清单仅增加这5个图形路径，无正文、训练、portal、五TAB、照片、内容、判分或引擎变化。旧封印不改不刷绿。

新输入三张截图均通过 prepare_materialize 得到新下载信息，使用支持联合类型语法的现有 Python 及官方 transfer helper，明确目标 /tmp/ui-home-refinement/reference-0/1/2.png，均返回 download failed；未取得像素、未重复旧URL或绕过。依据父已实际核实的问题与本轮文字方向实施，不能宣称执行端已看图。

仍未取得当前 IDE 编译结果、SVG真实渲染及三首页截图，MCP认证缺口未绕过；离线XML/编译不能证明图形光学品质或布局达标。集中预览重点：三首页目录重点是否突出；线面图形清晰；每日正常/继续/错误状态与按钮层级；320/390及大字长文案、目录图文挤压、政治第四入口和TAB安全区。没有为一屏目标裁切或缩字号。此为待实际视觉确认候选，不自称设计等级或验收通过。


## 首页六项品质审查（2026-10-26，产品保持0cca8f4）

核对 HEAD=0cca8f4c82422f8882147804da0209d0aeca2afa、工作区干净后执行只读审查。没有证实新的产品缺陷，**本轮无产品代码、素材或样式修改**，不为制造进度重排构图。以下为证据范围，不是视觉评分。

| 合同 | 可核对证据 / 发现 | 处理及待实际验收 |
|---|---|---|
| A 层级 | 每日主卡浅蓝、单主操作；目录主蓝标题＋右侧独立书页/索引构图；学习方式白色厚卡；目录padding与既有尺寸等级未加大 | 保留；目录是否一眼识别、是否压过/弱于任务卡，须当前三首页真实截图 |
| B 图形 | 5个SVG XML有效，4个学习图形48×48统一viewBox、目录80×64；统一2单位圆头圆角描边；首页引用均在本地素材集，显示尺寸56/44/目录96×72rpx | XML/引用可证，真实小程序SVG解码、描边清晰度、光学中心及裁切未证；不以5个文件数量或编译成功宣布精致 |
| C 排版 | 共享标题/说明/状态字号token，状态使用text-secondary；内容flex可收缩、标题/状态可换行；底部160rpx＋safe-area；未锁高/裁切/缩字号 | 政治ready/active/updated/completed/empty/storage-error六类模板表达式以明确样本求值检查，均不输出固定轮次/返回位置机制句；completed真实结果描述、empty/错误描述保留。此为表达式检查，不是六种实际运行画面；长文案/字号/按钮/箭头基线仍待实看 |
| D 一致性 | 三首页共用module-home样式及语义图形；主蓝辅绿、白浅蓝、中性文字；shadow-card仅局部使用；共享token和训练本体未改 | 保留；卡边/阴影实际观感与不同屏幕表现未证，不再盲调色号 |
| E 状态交互 | 既有25项首页入口/防连点/搜索往返控制器证据；政治每日真实调度/恢复/隔离回归通过；卡片保留原action/meta，无假进度；未加字号设置功能或动画 | 当前无新代码，不重复全套离线测试；实际开始/继续/完成/不可用点击、左上返回与TAB安全区未真机验收 |
| F 实证 | 0cca8f4已有92项离线模板编译；官方IDE打开成功；当前截图0张；MCP缺token与Library下载失败仍存在 | 未重试失败流程、改权限或索取令牌；未做无截图的独立视觉评分。当前没有可调用真实页面读取通路，不声明整包编译、视觉或真机通过 |

最小同版本画面清单：①笔记标准首页完整图；②常识标准首页完整图；③政治未开始首页完整图；④政治已有真实轮次的继续首页完整图；⑤政治320宽首页完整图；⑥政治大字号首页完整图（无适用应用字号控件时说明系统/设备字号设定）。均需包含底部TAB，并有一份项目路径、编译状态及0cca8f4产品版本身份依据；不要重置真实用户记录来制造状态。重点看目录构图识别、图形渲染清晰、每日按钮/状态层级、长文案换行与第四入口底部遮挡。其他模块出现长文案或大字异常时再补对应图。

取得这些画面后再做视觉问题定位和必要有界修复；当前停止在此门，不把代码审查当作全部产品品质目标完成。独立评审如开展，必须依据同版本真实截图和六项合同，不能仅看源码给分。


## 首页图形语言专项（2026-10-26，已看资产像素，页面仍待验）

从274674d继续实作，三层原创图形：目录右侧轻体积书组/索引对象；学习方式为32逻辑网格的蓝面＋浅蓝面＋少量绿色语义强调；每日为回忆卡/积累卡/理论关联三种专属图形。完整题应用新增独立文档/作答图形，避免复用路线。总计9个SVG，无品牌图标、外部素材、额外依赖或上传。

统一映射由 `scripts/generate-module-home-artwork.py` 从现有theme导出 primary-600/100、green-700、bg-card，原创几何集中维护，支持重建9图及对照样张。系统搜索/箭头仍单色；本项目双色内容图形不是Fluent系统图标规范的声称。参考[Fluent识别/尺寸简化](https://fluent2.microsoft.design/iconography/)及[Material optical size/weight](https://developers.google.com/fonts/docs/material_symbols)，未复制其作品、未宣称唯一流行趋势。

本机无cairosvg/Pillow/命令行矢量库，使用已安装macOS Quick Look渲染成功。[真实PNG样张](home-artwork-family/family-proof.png)与[可复现SVG样张](home-artwork-family/family-proof.svg)保全：普通图形28px、每日22px、目录48×36px，按375px宽/750rpx对应现有容器；另列2倍放大，均为资产工艺图，**不是页面截图**。执行端实际查看两次：首版常识每日白卡在白底消失，补浅蓝轮廓；首版Quick Look因画布比例裁掉末行，改790方形画布后重渲染，已完整查看九行1倍/2倍像素。最终目录有遮挡层次与索引，普通图形有明确实体剪影，日常三图可区分；这是具体观察，不是视觉打分或独立评审。

接入仅替换三首页图形引用，所有容器56/44/目录96×72rpx、padding/厚卡/文字/安全区与交互保持。静态图形使用基础SVG path/rect/circle/实色填充，无滤镜/外链/脚本/字体，XML有效；真实小程序解码/显示支持仍需当前页面证据，不能用Quick Look兼容替代。[25项交互](home-artwork-family/interaction-checks.json)、[92项模板样式编译](home-artwork-family/template-compile.json)、政治首页回归及差异空白检查通过。准入、学习状态、业务引擎、正文、训练、portal、照片、5TAB、main均未修改。

当前认证限制未绕过、旧Library失败未重试。官方IDE打开最终候选供预览；实际IDE编译与页面截图尚未读取。待同版本三首页、政治继续态、320宽及大字截图检查SVG真实渲染、图文挤压、目录重点及TAB遮挡。样张并不关闭这些页面视觉门，最终用户集中验收。


## 政治几何样板与断线恢复（2026-10-26，未视觉验收）

恢复核对 HEAD=c0f5920cd9d9d4a49505d5234c8266743bcaf35e，暂存区空；3份受跟踪差异及7份未跟踪素材/生成脚本仍在，reflog无后继提交。原main仍d503232，其未跟踪成果保持。先保存10文件恢复包并逐文件SHA-256校验，再继续政治局部样板，未重放其他工作树。

保全既有几何色面候选：政治专属六图、每日单右侧图、蓝主绿辅、政治局部样式；共享样式、笔记、常识未改。本轮实际查看用户两张附图，第一张含进度条/日历图标，与候选源码不同，因此作为构图参考，未冒认为当前构建运行截图；第二张为饱满色面图标参考。仅增强政治目录：展开双页、深浅蓝与三层章节索引，宽96→144rpx、高72rpx不变，原卡片padding/最小高度/字号保持，未加进度条、调度或业务状态。

[素材渲染样张](politics-geometric-sample/asset-proof.png)已实际查看，六行完整、目录书页与章节索引可见；它不是页面截图。生成脚本可重建素材。[文件SHA-256](politics-geometric-sample/manifest.json)、[25项入口回归](politics-geometric-sample/interaction.txt)、[92项离线WCC/WCSC](politics-geometric-sample/template.txt)、[首页回归](politics-geometric-sample/home.txt)、[每日回归](politics-geometric-sample/daily.txt)通过；SVG XML有效，差异空白检查通过。

官方CLI open本工作树成功（52410），不等于修改后实际IDE整包编译；MCP认证未绕过。当前候选标准/320窄屏/大字/长文案与底部TAB安全区仍待实际运行截图，用户方向与视觉验收尚未关闭。未推广笔记/常识，未动portal、五TAB、照片、训练、正文、事实/准入、出题/调度/判分或存储协议；未改main、合并、推送或发布。


## 用户交付政治SVG接入（2026-10-26）

[本轮唯一详细记录与前后真实截图](politics-delivered-svg-20261026/README.md)。六份原始SVG逐字节接入政治专属delivered-v1目录，两枚锁定、四枚候选，保留原始颜色与path；只改政治图形引用/外部布局和六条精确资源保护路径。修改前恢复引用 refs/codex/checkpoints/politics-home-svg-before-20261026 指向3569574。

本轮已通过官方wechatide入口在真实开发者工具重新编译、读取页面状态并保存同设备/设置/真实状态的前后截图（不是静态样张）。六图可见，卡片高度与data保持，存储指纹一致；25项入口、政治首页/每日和92项离线编译通过。真机预览当前受官方上传网络错误阻塞，候选和截图先保全，再做有界网络恢复；尚未完成真机或用户视觉验收，不扩展笔记/常识，不改main/合并/推送/发布。

本批后续：产品候选固定b631ca1，官方手机预览含重启恢复在内共三次仍网络上传失败，无二维码或真机证据；已停止重试。工具currentPage与元素缓存不一致导致真实搜索方法检查无法成立，未宣称真实点击验收；25项离线交互保护在资源跟踪后再次通过。最终官方currentPage确认政治页。详见上述本轮记录“手机预览后续与最终停止点”。


## 政治首页 UI 精细化 V2（2026-10-26，待用户视觉确认）

从b7237c7干净基线按P0→P1→P2实施，[本轮修改清单、同尺寸真实截图及验证](politics-home-v2-20261026/README.md)。仅政治首页JS展示文案/WXML展示结构/WXSS局部样式与受影响回归断言；六份SVG原件、共享组件/token、业务规则和其他模块不动。修改前恢复引用 refs/codex/checkpoints/politics-home-v2-before-20261026，候选引用 refs/codex/checkpoints/politics-home-v2-candidate-20261026。

蓝色每日卡、绿色目录卡、四卡侧部淡渐变及独立状态栏已在真实IDE当前构建查看。两核心卡与四学习卡高度前后完全相同，页面高度约+1px；1/4项真实状态、前后业务data与存储指纹保持。25项交互、政治首页/每日、92项离线编译通过。搜索真实点击往返通过；六卡实点击以临时导航/写入拦截核对目标，接口已restore，不冒称六目标页完整往返。最终真实截图含六卡、辅助入口和五TAB。仅标准尺寸模拟器检查，真机/窄屏/大字未新增，3秒识别和最终视觉接受仍由用户确认。未改main、合并、推送或发布，停止继续设计与跨模块推广。


## 政治首页 V4 · 两张核心卡（2026-10-26，待用户视觉确认）

从fcc4b11干净基线实施，[修改清单、真实整页/两卡局部图与验证](politics-home-v4-20261026/README.md)。仅修改政治首页WXML、WXSS：每日上部标题/说明＋下部可选真实位置/右侧唯一动态按钮，原书页为16%透明绝对定位背景；目录缩至约52px可见主体，两卡分别蓝紫青、绿青蓝多层渐变。没有修改四学习卡、六SVG原件、JS或任何业务规则，未执行旧V3。

修改前恢复点 refs/codex/checkpoints/politics-home-v4-before-20261026；候选 refs/codex/checkpoints/politics-home-v4-candidate-20261026。428px真实构建的active与合法ready展示状态检查完成，卡高/位置/页面总高与V2完全相同；ready仅临时展示注入，已恢复真实1/4项数据，未造已学数量。25项交互、政治首页/每日与92项离线编译通过；两入口实点击核对目标时拦截导航/写入，接口已恢复并以真实搜索往返验证。业务data、存储指纹与保护字节一致。

用户明确取消320px检查；375px等其他屏宽本轮未实测，不以静态预览或系统宽度mock冒充。当前截图仅代表428px模拟器，最终视觉/真机仍待用户确认。已停止核心卡后续设计，不推广、不修改main、合并、推送或发布。


## 核心卡片按钮居中与目录淡化（2026-10-26）

从8dc5887继续，仅改政治首页WXML/WXSS。每日按钮右侧垂直居中，真实状态移到左侧说明下，卡高按内容收紧；目录原图45%不透明度，增加两字“进入”，保持整卡点击。[修改清单、同尺寸真实截图和验证](politics-core-centered-20261026/README.md)。25项交互、政治首页/每日和92项离线编译通过；当前428px下有/无进度按钮均居中、真实状态已恢复，四学习卡/业务/SVG原件不变。修改前引用 refs/codex/checkpoints/politics-core-centered-before-20261026，候选 refs/codex/checkpoints/politics-core-centered-candidate-20261026。待用户视觉确认，未改main、合并、推送或发布。


## 政治首页 V4 · 完整局部栅格（2026-10-26，待用户视觉确认）

从6ccbef0干净成果继续，保留fcc4b11真实V2截图作同设备比较；未reset或回放旧版。[本轮修改清单、V2/V4整页、两核心卡和四学习卡局部、不同屏宽及栅格验证](politics-full-grid-20261026/README.md)。按用户首句优先把目录也改为大型16%透明背景，不执行后文旧52–64px前景缩小要求；每日按钮按本次P1回右下操作区。四卡使用白底、统一圆形底座、四列栅格及稳定字号层级，取消原卡片侧渐变。

375px iPhone12/13 mini与428px ProMax的真实当前构建均检查active和合法ready展示状态，已恢复真实1/4项状态。四卡底座44/47px、可见图形约27.8px、标题/副文案/状态/箭头量测对齐通过；V2和当前428px四卡高度相同，整页约+6px。25项交互、政治首页/每日和最终92项离线编译通过；六入口点击核对目标采用导航/写入拦截并已恢复，真实搜索往返通过。所有既有存储指纹不变，额外UI展示偏好新增已单独记录，不声称全存储不变。

产品只改政治首页WXML/WXSS；六SVG、JS、共享token、五TAB及其他模块不变。修改前 refs/codex/checkpoints/politics-full-grid-before-20261026，候选 refs/codex/checkpoints/politics-full-grid-candidate-20261026。未改main、合并、推送或发布；停止继续设计，最终视觉与真机验收由用户确认。


## 目录图辨识度与学习图标80%（2026-10-26）

从e1e9800继续，仅改政治首页WXML/WXSS：目录图恢复完整轮廓的72px外框与45%不透明度；四学习SVG外部等比缩为80%，圆形底座、文字栅格和业务不变。[实际截图、缩放量测及验证](politics-icons-80-20261026/README.md)。25项交互、政治首页和最终92项离线编译通过，SVG源文件不变。用户切换机型后最终实图为366px HUAWEI模拟器，前后设备不同，不冒称同尺寸比较。修改前 refs/codex/checkpoints/politics-icons-80-before-20261026，待用户视觉确认；未改main/合并/推送/发布。
