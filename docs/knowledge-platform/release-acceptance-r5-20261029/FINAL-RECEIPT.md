# R5 题库完整候选与发布前验收回执

2026-10-29。工程功能候选可接受；内容审定、包体门与真机验收仍有条件。没有“全测试均通过”或“正式上线就绪”的结论。

| 验收维度 | 真实结论 |
| --- | --- |
| 源码整合 | 完整、直接继承S1～S4，独立分支；另修复1处实际分包组件错误 |
| 自动工程 | 生命周期19套回归、授权专项、S4专项、精确内容审计、8组预览载荷比对通过；94项WXML/WXSS离线编译及畸形模板拒绝通过，431个相关JS语法检查通过；**主包源码预算失败** |
| 授权与撤回 | 通过当前本地覆盖；两处S4前安全修复均继承；未发现新增绕过 |
| 独立AI内容审核 | 沿用并复核五项S1/两项S4的精确条目及既有独立回执，未重做全库审核；语言与来源边界保留 |
| 人工内容审核 | 本轮完成0项；全部继续待验收，法律事实复核未完成 |
| 微信整包 | 实际项目在开发者工具本地编译运行，四入口自动化通过，8项检查/58次本地函数请求/0个未处理页面异常；实际发布压缩包未生成 |
| 真机 / 真实云端 | 均未验证；模拟器和本地云函数桥接不等于硬件或线上联调 |
| 正式发布 | 未合并main、未推送、未上传、未部署、未提交审核、未发布；无相应授权 |

## 候选身份与恢复

- Worktree：`/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029`
- 分支：`codex/learning-bank-release-acceptance-r5`
- 原始干净HEAD：`7d6a53133a8c70317ae140a1b8b0ecb14855d421`。Git祖先关系：`98c01e42c11b8d57e327f697de3747ba1ab0f5ec` → `9dd31c6afb5a94882de298dd8d507f4e3683aef0` → `7d6a53133a8c70317ae140a1b8b0ecb14855d421`。无cherry-pick、无猜测拼接。
- 已验收应用源码HEAD / 修复提交：`99d2b75aaa52e618b8dd1274c330166a81f0e739`；仅把既有例题组件字节一致地放入常识分包并改其引用，修复常识原文页“组件未找到”。不改变题库、学习交互或加载体验。
- 验收证据提交HEAD：`23e6ce441a815e8074f5e4595ec338854622fd5d`；恢复引用：`refs/codex/checkpoints/learning-bank-release-acceptance-r5-evidence-20261029`。该提交完整保存R5脚本、日志、指纹及人工材料，应用源码相对99d不变。
- 基线恢复引用：`refs/codex/checkpoints/learning-bank-release-acceptance-r5-baseline-20261029`；修复恢复引用：`refs/codex/checkpoints/learning-bank-release-acceptance-r5-component-fix-20261029`。最终交付HEAD以最终答复及 `refs/codex/checkpoints/learning-bank-release-acceptance-r5-final-20261029` 解析值为准；回执提交只增加验收文档。
- 基线7523文件指纹、完整差异、候选2604项源码/配置/内容/验证脚本指纹及6个受保护工作树证据，同目录 [baseline.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/baseline.json)、[baseline-files.sha256](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/baseline-files.sha256)、[source-identity.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/source-identity.json)、[candidate-source-files.sha256](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/candidate-source-files.sha256)、[isolation-proof.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/isolation-proof.json)。main、B5、原发布候选、S1～S3、安全修复、S4工作树的HEAD、已保存状态和文件摘要均未改变。

## 公众集合、内容变化与候选

五个精确ID集合全部等于历史公众基线：笔记练习142、笔记快记133、常识问答603、记忆材料128、知识导读1681。逐ID完整内容前后摘要见 [public-content-audit.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/public-content-audit.json)，共2687项；不是只比较数量。笔记两集合内容未变。

| S1公开条目 | 真实变化 | 版本 / 审核状态 |
| --- | --- | --- |
| `new-culture-memory` | 仅coverage修订；旧简写“李钊马列”仍存在 | revision2→3；AI限定通过，人工待定 |
| `pre-qin-institutions-memory` | coverage明确大宗/小宗相对层级 | revision2→3；AI限定通过，人工待定 |
| `third-plenum-full` | 独立题干、选项、解释、spec修订；答案索引保持但选项内容变化 | revision1→2；AI通过限定目标，人工待定 |
| `industrial-revolutions::mendel-laws` | content/note编辑语言清理 | semanticRevision1不变；AI通过，人工抽样待定 |
| `contract-formation::lateness-compare` | content/note补齐两种法定条件及通知例外 | semanticRevision1→2；AI有限通过，人工法律复核待定 |

S1前后10个精确全条目SHA-256均与原纠错回执一致。1681张导读的原始全条目摘要均因签名元数据变化而不同，去除signature/learningSignature后只有上表2张发生内容变化；未把所有签名变化误报为正文重写。逐项同时保存来源/依赖、审核字段、修订与正文差异。历史公众ID可访问的合同，不等于新版已获人工批准；未给实质修订补造批准。

S4两题仍是review候选、正式公开授权0。R5独立保留 `.learning-bank-s4-artifacts/S4-HEAT-01-v1`，550文件与原S4产物逐字节一致，547个生成输出可重建；隔离605题不替换公众603题。证据 [s4-retained-artifact.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/s4-retained-artifact.json)。既有128条材料保留访问/历史兼容合同，旧口诀学习入口继续转至导读，未恢复旧产品入口。

## 授权、回滚和旧用户

- S4前修复一：导读规范准备和直接转换同时拦截卡片/知识组status、review状态、localHold、显式卡HOLD与来源单元HOLD。修复二：候选产物双重隔离；服务端仅在显式本地测试环境与准确目录匹配时开放，客户端参数不能开启。
- 已运行授权/撤回/来源依赖、旧产物防复活、生成完整性回归；S4失败注入覆盖生成和替换两阶段，旧完整产物摘要保持，恢复后可复现。未真实撤回公众条目。
- 对两道S4题追加58个正文/批次/旧笔记轮次入口负例，覆盖所有现有bank/mode；即使请求allowCandidate也全部拒绝。bootstrap/catalog的完整公众集合与各模式现有回归通过。
- 进度矩阵覆盖纯新增、组内新增、新组、非语义元数据、语义修订、撤回、旧客户端和旧轮次；无关有效评价保留，实质修改不继承旧判断。4入口各VERSION_CHANGED/NETWORK恢复及撤回退出已有VM覆盖；实际IDE另验证4入口受控VERSION_CHANGED信号后重取元数据并恢复原题，缓存有界且可重新获取正文。IDE未用真实新增内容切换正式库。

## 微信本地验证及限制

工具2.02.2609231 / SDK3.17.6，iPhone12/13 Pro模拟器，390×844。使用CLI auto本地编译；未调用preview、upload、远程调试。实际客户端经隔离桥接调用本HEAD的learningBank.main；本地内存存储代替真实学习记录。笔记练习作答/提交/揭晓/续学、快记四自评/弱项/原文往返/淘汰再取、问答知识组/作答/旧轮次、导读顺序/四自评/原文往返/恢复均通过。退出回到首页后已恢复原API。

初次探测的练习模式/桥接跨环境对象问题只修正测试装置；真实产品缺陷是跨分包组件引用，已单独修复并重测，无未处理页面异常。截图7张与完整步骤/本地请求证据保留在 [devtools-acceptance.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/devtools-acceptance.json)。模拟器截图不作为真机或完整视觉验收通过。

主包源码统计2337462字节（2.229 MiB）、292文件，高于仓库1572864字节（1.5 MiB）预算；基线7d已相同，本轮修复不增加主包。此为**继承且未通过的工程门**，不是已证明微信实际压缩包超限。当前compile封装会调用preview上传，故未使用，实际发布压缩包大小未知；须后续取得获授权的包体证据并解决预算门，不能直接改阈值宣告通过。见 [package-budget.json](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/package-budget.json)。

## 最小后续动作及停止

产品只需先看 [PRODUCT-ACCEPTANCE.md](/Users/jmac/WeChatProjects/miniprogram-learning-bank-release-acceptance-r5-20261029/docs/knowledge-platform/release-acceptance-r5-20261029/PRODUCT-ACCEPTANCE.md)：链接可读的17张内容卡和代表截图，涵盖S1五项、S4两项、既有法律6题、四类风险各一题；均待人工记录。旧S1十二条风险抽样保留，未扩大为重审全库。法律与历史质量风险不否定已通过的工程功能测试，但也没有被本轮“洗绿”。

发布阻断/未满足门：内容审定及已知简写差异处置、法律人工事实复核、包体预算结论、同一构建的真机与真实云端兼容验收、明确的后续发布授权。最小解决方式：定向人工审定/修订或HOLD；工程取得真实包体并处理门；另行授权受控交付与所需云端操作后按最小真机路径验收。

不阻断现有603题技术候选：未授权S4内容继续隔离、其人工可读性待审；旧口诀入口维持取消；未开展视觉改版、全库重审或新服务建设。建议进入**产品负责人有限内容检查与后续受控真机验收**；不建议现在给出正式发布验收通过结论。保留全部工作树、提交、隔离产物、日志与证据，在此停止。
