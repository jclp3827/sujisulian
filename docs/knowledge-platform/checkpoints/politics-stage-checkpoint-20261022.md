# 政治模块阶段 checkpoint：WIP / HOLD

日期：2026-10-22。分支：`codex/politics-quick-reading`。工作树：`/Users/jmac/.codex/worktrees/politics-quick-reading/miniprogram-1`。起点：`0345846`。本 checkpoint 保存阶段成果，**不等同验收、合入或发布完成**。

完整文件清单、每项归属、SHA256、源版本和验证记录见[机器清单](politics-stage-checkpoint-20261022.json)。215个冻结成果文件分两次提交，另附本说明和清单，共217个文件。源码在盘点和验证期间多次核对指纹稳定，现有子代理均已结束；发现新写入或非本次暂存即停止提交。

## 提交拆分与依赖

A（已提交`47d6b9d`）：18个共享基础/训练消费者文件，保存既有session样式抽取、token别名、会话头和有界进度百分比工具。四个训练页保留生成、答题、计分和存储逻辑，仅消费共享头部样式及进度函数。在`0345846 + A`的隔离临时源码树中，原训练与UI token检查均通过，可以独立提交。

A清单：

- `miniprogram/components/session-head/index.wxml`
- `miniprogram/components/session-head/index.wxss`
- `miniprogram/pages/training/assumption/index.js`
- `miniprogram/pages/training/assumption/index.wxml`
- `miniprogram/pages/training/assumption/index.wxss`
- `miniprogram/pages/training/estimation/index.js`
- `miniprogram/pages/training/estimation/index.wxml`
- `miniprogram/pages/training/estimation/index.wxss`
- `miniprogram/pages/training/ratio-sense/index.js`
- `miniprogram/pages/training/ratio-sense/index.wxml`
- `miniprogram/pages/training/ratio-sense/index.wxss`
- `miniprogram/pages/training/session/index.js`
- `miniprogram/pages/training/session/index.wxml`
- `miniprogram/pages/training/session/index.wxss`
- `miniprogram/styles/session.wxss`
- `miniprogram/styles/theme.wxss`
- `miniprogram/styles/ui.wxss`
- `miniprogram/utils/progress.js`

B：197个政治成果及不可独立摘取的共享适配文件，另含2个checkpoint记录。包括13个内容源、30个政治运行/页面文件、54个政治生成与校验脚本、83个政治方案/证据文件；同时保留并单列以下共享依赖。**B必须在A之后使用，不能独立摘取B。**

| 共享范围 | 文件数 | 归属与不能从B拆开的原因 |
| --- | --- | --- |
| `app.json` | 1 | 仅登记政治practice分包页；没有改首页、照片或tab配置。缺失则每日/问答不可达。后续导航整合须协调。 |
| `contrast-surface`、`knowledge-card-surface` | 6 | 易混结构化选择、阅读与速记呈现、政治skin入口，与政治投影和调用方同批保存；不是纯业务文件。 |
| `learning.js`、`projectors.js`、`route-progress.js`、`systematic-units.js` | 4 | 政治路线、目标投影、恢复与进度消费者须一起保存；拆分会让旧调用方与新元数据失配。未来其他模块兼容仍须集成复核。 |
| `module-skins.wxss` | 1 | 政治皮肤引用应用现有蓝色主题，依赖A的token，不另建调色板。 |
| `utils/option-order.js` | 1 | 政治选择项身份与显示顺序分离所需；独立稳定ID判分不变。 |
| 共享验收脚本 | 3 | `validate-knowledge-platform-candidate/learning`与`validate-ui-tokens`包含政治和共享合同检查。保留已知失败，不为提交更改断言。 |
| 文档总入口 | 1 | README保存政治批次状态与历史，非其他模块文档改写。 |

所有文件逐条列在JSON中；无无法确定归属项，静态相对require、WXSS导入及组件依赖检查无缺失，不新增npm依赖。明确清单暂存，不使用`git add -A`或目录级无差别暂存。

## 当前内容与版本

- 145张回忆卡、24道应用题、14组易混；97目标中90个有题目关联。易混按组计，不把183条目录记录说成183道选择题。
- 系统学习21组72小节；快速了解6单元；正文37篇。范围仍有边界，不声称覆盖完整公考政治。
- 运行学习库：`learning-banks-715e57f57689`；应用库：`applied-questions-8f642ceeaab6`。
- 知识包：`kp1-a6-runtime-77a15fc82abc-lb-715e57f57689`；课程：`units-50de00939577`。
- U1：`catalogue-a740ecfb5dcd`；U2：`management-b3742fe7dc16`。两者当前源指纹一致，原库生成检查通过；B1历史源表的复建不一致另列hold，不能称全链全绿。

## 本次验证与未通过项

本次重新执行19项定向检查，16项通过；随后新增全量暂存格式检查，共20项检查中16项通过、3项hold、1项格式告警；A的隔离依赖验证另有2项通过。通过项包括两类题库生成一致性、运行库与U1/U2、9卡补缺、考试对齐、每日可靠性、系统内容/单元、导读、首页、重点标注、通用学习、S55-R4、共享token、训练及diff检查。U2内含20条回归、U1含16种异常拒绝、每日含R1的12条回归。未为checkpoint改动产品源码或内容，未重新编译；U2编译/真实往返记录保留为对应阶段证据，不能改记成本次新的真机或整体验收。

| 编号 | 状态 | 未通过或未完成 | 后续处理 |
| --- | --- | --- | --- |
| CP-H01 | HOLD | B1正式目标表与当前生成器复建不一致：97个目标ID/标题不变，但课程版本字段仍为旧版；money-02-1的条件/边界/常见错误3处文字未同步当前限缩表述。 | 先确认历史快照与现行权威合同，复核货币口径，处理依赖指纹与投影；不得只刷新JSON消除失败。 |
| CP-H02 | HOLD | 旧整体验收固定期待136卡，现有145卡，入口在第一处断言停止。 | 按现行合同复核整份门禁；后续断言未执行，不冒称已通过。 |
| PKG-01 | HOLD | 主包静态3191379字节（3.044MiB）超过本地1.5MiB预算，真实微信包体未测。 | 核对真实打包与文件范围后决定处理，不能调高预算规避。 |
| CP-H03 | HOLD | 共享UI、服务与导航尚未同常识、整合式首页、照片分支做集成审查。 | 按归属清单协调，未试合并；不能单方面改公共接口。 |
| CP-H04 | HOLD | 首页/B批视觉验收记录、完整新真机验证、完整考纲范围和新来源扩库未补齐。 | 保留E3用户抽样与易混验收的原范围，不能扩大结论。 |

CP-W01补充：全量暂存检查还发现4个文件的格式告警：两份方案的7处Markdown行尾双空格用于换行，另两份JS有末尾空行。完整定位见机器清单，原冻结成果未为归档提交而改写；这是P3格式记录，不代表功能验收，也不隐去未通过的Git检查。此前`git diff --check`只检查了当时已跟踪的未暂存差异，不覆盖未跟踪文件；补检结果以本条为准。

## 恢复、交接与停止点

从包含本清单的B提交恢复即可得到源码、内容源、生成包和必要依赖；若选择性应用，顺序必须为A→B。可用`git log -1 --format=%H -- docs/knowledge-platform/checkpoints/politics-stage-checkpoint-20261022.json`定位B。JSON内列出重跑命令及预期仍为hold的检查。

未修改其他工作树，未覆盖整合式首页或照片；不合main、不推送、不上传发布、不reset/clean/stash或改写历史。提交后报告两个提交号、剩余工作区与合并阻塞，即交付checkpoint回执。当前没有来源充分且已准入的新扩题批次，无来源暂停和退出机制继续有效；不在本次保存阶段擅自扩库或启用U3混排。后续模块专属扩题必须维持schema、稳定ID、来源、准入、存储和判分合同，公共UI或接口变化需单独协调。
