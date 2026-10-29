# R5 成果合入当前 main：隔离集成回执

2026-10-29。**隔离候选已无冲突合并并通过功能验证；本地main未更新。** main未提交工作存在实质重叠，不能安全落盘；按本轮条件停止在集成候选，不覆盖、stash、清理或提交它们。

## 准确身份

| 项目 | 身份 / 状态 |
| --- | --- |
| 当前本地main | `d5a5c49400c2aef8bf583556a283cb4ad04f45f3`，本轮未移动 |
| R5 | `03d822026003fe4217f3b5154b6e351dc62556c2`，干净且未修改 |
| R6-A | `6884591421f8cdeff89598d3120bbf0ad5ffc615`，R6-A2两份未跟踪记录照原样保留；未合并此分支 |
| 隔离Worktree | `/Users/jmac/WeChatProjects/miniprogram-learning-bank-main-integration-r5-20261029` |
| 集成分支 | `codex/learning-bank-main-integration-r5-20261029` |
| 源码合并提交 | `27a8314afc8c80cb6a1d66baa2c8cfb9e1070c06`，父提交为当前main和R5，原生merge无冲突 |
| 源码checkpoint | `refs/codex/checkpoints/learning-bank-main-integration-r5-merge-20261029` |
| 最终候选checkpoint | `refs/codex/checkpoints/learning-bank-main-integration-r5-final-20261029`；最终文档提交HEAD以该引用及最终答复为准 |

S1～S4、B5加载基础、R5组件修复等有效成果完整继承，`9dd31c6a`为明确祖先。R6-A测量资料未额外引入。相对R5的运行源码差异仅为main已有照片导出文件与门户合并：照片5个实现文件逐字节等同main；门户保留main照片文案和R5的CSS箭头结构。云函数树等同R5，历史1.5 MiB预算脚本未变。

## 指令与源码审计结论

采用code-review-expert流程复核提交范围、授权边界、错误恢复、进度身份、生成完整性和共享门户边界。没有删除代码、扩大授权或改架构。

- **P1：阻止main更新。** main当前有13个已修改文件、1643个未跟踪文件；候选将写入的路径有580处重叠（13个已修改路径、567个未跟踪路径），其中361处当前内容与R5不同。包括cloudfunctions/learningBank产物和练习/快记/问答代码。不能仅移动main引用、强制覆盖或把其他任务修改顺手提交。
- **P2：模拟器首轮加载证据保留。** 首轮跨分包原文访问捕获3个模块未定义/组件异常。对同一源码重新本地编译后，8项完整检查通过、异常0；另一次定向原文验证确认point及activeBlocks非空并返回学习页，3项检查通过、异常0。未用改源码掩盖；冷编译首访和真机仍需后续同构建验收。
- 历史公众授权不等于新版人工内容批准；S1法律及内容人工审阅、S4理解抽样仍待完成。本轮仅工程集成。

## 回归与授权

25项功能/生成/准入/缓冲/进度/模块首页/照片检查全部通过：原生命周期18项功能检查，加安全专项、S4专项、R5精确审计、预览载荷、模块首页和照片两项。旧第19项隔离检查引用过期main身份，未冒充有效；改为本轮保护快照，见下段。

94项WXML/WXSS离线编译及畸形模板拒绝通过；61个变更JS语法检查通过。微信工具本地auto编译成功，2.02.2609231/SDK3.17.6；四个学习入口作答/揭晓、四项自评、续学、原文、缓存淘汰、VERSION_CHANGED恢复复测通过。使用内存隔离存储及候选本地learningBank.main桥接，未清理真实记录，不等于真实云端联调。

精确公众集合：笔记练习142、笔记快记133、常识问答603、记忆材料128、导读1681。S4两道传热题仍未授权、未进入普通公众集合。58个候选跨入口负例、安全补丁、HOLD/blocked/撤回防复活、两阶段生成失败回滚、旧用户有效评价兼容均通过既有专项。

**保护检查没有宣称全部通过。** 快照覆盖21个已有工作树，20个保持HEAD/状态/文件摘要不变，包括main、B5、历史发布候选、S1～S4、R5和R6-A。一个独立Design System工作树 `/private/tmp/miniprogram-ds3-r1-20261029` 在期间改变了registry和两个WXML；本任务没有在该目录执行写操作，不导入或回滚这些并发变化。原严格检查失败保留在regression-results.json；逐项差异见isolation-final.json。候选和main均未采用该并发修改。

证据：同目录 [regression-results.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-main-integration-r5-20261029/docs/knowledge-platform/main-integration-r5-20261029/regression-results.json)、[template-compile.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-main-integration-r5-20261029/docs/knowledge-platform/main-integration-r5-20261029/template-compile.json)、[source-inheritance.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-main-integration-r5-20261029/docs/knowledge-platform/main-integration-r5-20261029/source-inheritance.json)、[main-overlap.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-main-integration-r5-20261029/docs/knowledge-platform/main-integration-r5-20261029/main-overlap.json)、[isolation-final.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-main-integration-r5-20261029/docs/knowledge-platform/main-integration-r5-20261029/isolation-final.json)、[devtools-first-run.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-main-integration-r5-20261029/docs/knowledge-platform/main-integration-r5-20261029/devtools-first-run.json)、[devtools-acceptance.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-main-integration-r5-20261029/docs/knowledge-platform/main-integration-r5-20261029/devtools-acceptance.json)、[source-roundtrip/devtools-acceptance.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-main-integration-r5-20261029/docs/knowledge-platform/main-integration-r5-20261029/source-roundtrip/devtools-acceptance.json)。不以这些工程结果宣称人工内容、真机或发布通过。

## 后续最小动作与微信工具路径

1. 先单独对main的在途修改确认归属并建立可恢复checkpoint，完成13个修改路径及567个未跟踪重叠路径对账，再决定让main合入本候选；不要靠reset/clean或删除未跟踪文件解决。本轮不代为处置它们。
2. 现阶段若只核对候选，应在微信开发者工具打开上面的**隔离候选目录**，不要把尚未合入的main误当成该构建。源码合并身份为27a8314；确认AppID及项目配置。
3. 工具“详情→本地代码/代码依赖分析”查看主包、分包构成；该静态统计不能代替上传包。后续取得单独上传授权后，走正常上传流程，记录构建返回的主包、各分包及总包尺寸与本构建身份，按微信工具主包2M限制判断；若主包超限或上传拒绝，停止并保留完整返回信息。当前上传权未授予，本轮不点击上传。
4. 1.5 MiB内部源码预算保持原门；平台实际包体与内部预算分开审定。此前包体证据不足未在本轮关闭。人工内容/法律、真机、真实云端兼容与正式发布授权仍待完成。

候选和全部原工作树保留。未更新main、未推送、未上传、未部署、未提交审核或发布；R6-A研究及CI密钥接口已停止。
