# 本地 main 集成与模板/覆盖确认清单

本轮只完成本地开发集成和合并后只读模板盘点，不是UI验收、内容正式准入或发布。用户确认下面的模板/覆盖边界之前，不开始新视觉改版，不把页面强制改成同一布局。

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

后续从新main建立清晰的`codex/ui-main-baseline-20261025`工作基线，保留旧分支和恢复点。旧UI的×清空、搜索返回及learning-session-head等是**待选择性复用增量**，不能宣称当前main已完成旧B1统一，也不整体覆盖当前模块页面。

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
