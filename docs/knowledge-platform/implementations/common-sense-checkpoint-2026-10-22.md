# 常识学习阶段 checkpoint（Q2 科技第四批）

登记日期：2026-10-22

状态：`WIP / review / release-blocked`

## 恢复点

- 工作树：`/Users/jmac/.codex/worktrees/common-sense-learning-v1/miniprogram-1`
- 分支：`codex/common-sense-learning-v1`
- 基线提交：`72e0d76659dbfe1ed6499623069d19cd34ddb932`
- 内容包版本：`2026-10-22.72`
- 当前完成到：Q2 科技第四批“光与可见光基础、红外线与紫外线”
- 下一批：Q2 科技“光的传播与反射、折射/全反射与散射”

本 checkpoint 保存可恢复的模块阶段成果，不表示正式内容验收、发布验收或合并批准。

## 对应版本

| 类型 | 文件 | SHA-256 |
|---|---|---|
| 本批内容源 | `docs/knowledge-platform/content/common-sense-content-q2-science-4.js` | `c1e01e03bd06355c06550986f035ca6dfbeee3ab1110ffd970e244920b6b4a04` |
| 生成学习包 | `miniprogram/subpackages/common-sense/models/learning-pack.js` | `afe8aa2462fb102190b007e5311ca85142114ebfdd127e030287797a0a13b8af` |
| 定向验证证据 | `docs/knowledge-platform/implementations/common-sense-content-q2-science-4-validation.json` | `1b6903d4779dca113e39a6ace4ebfffb2b8d5f3d98684827c7196d6cf128946b` |
| 开发者工具证据 | `docs/knowledge-platform/implementations/common-sense-content-q2-science-4-devtools-validation.json` | `4e15f3e41796e72e486f031f8cc7304dcfadd1c6131b331d016356906b85038f` |

对应证据登记 `packVersion = 2026-10-22.72`；生成包同版本。总量为 606 道候选题、497 个目标、133 个主题组、129 条记忆资源。正式可用题仍为 0，所有新增与重写内容继续保持 `review`。

## 提交范围与依赖

- 常识正文源、源文审计、现行法审计与统一校对台账。
- 常识学习产品方案、分批内容源、生成包、覆盖/入口台账、验证脚本与证据。
- 常识模块首页、学习页、完整目录、搜索和正文定位；均位于常识模块命名空间。
- `miniprogram/app.json` 仅增加常识分包的 `learning/index` 与 `topics/index` 两条页面注册，是本 checkpoint 唯一共享清单文件。
- 现行法双层审计的同步、台账生成与验证脚本作为必要未跟踪依赖一并保存。

模块页面、内容包与入口注册彼此依赖，拆成可独立检出的多个提交会产生中间不可运行状态，因此本阶段采用一个明确清单的 checkpoint 提交；不包含政治理论、照片处理或其他模块代码。

## HOLD 与未通过项

- HOLD：606 道题全部是候选内容；正式准入数量为 0。
- HOLD：结构口诀只通过结构规则；未取得一般人群记忆试验或提分证据。
- HOLD：真人领域逐题审核与最终签署未完成；AI 预审不能替代真人签署。
- HOLD：完整设备 UX 验收、上传与发布均未执行。
- 未通过/未解除：全库质量门仍按治理文档保持 release blocked，不能把自动检查或抽样通过解释为正式验收。

## 恢复约束

继续扩题时保持现有 schema、稳定 ID、来源定位、准入状态、存储键和判分协议不变。下一批只修改常识内容源、生成包及对应的模块专属验证/登记；若需要修改共享 UI、导航、训练接口或其他模块文件，先单独登记并等待确认。
