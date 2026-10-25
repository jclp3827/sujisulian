# 常识学习 V1 工作区迁移记录

日期：2026-10-20。用户要求先隔离照片工作，再继续常识实施。

- 原目录：`/Users/jmac/WeChatProjects/miniprogram-1`，分支 `main`。
- 实施目录：`/Users/jmac/.codex/worktrees/common-sense-learning-v1/miniprogram-1`。
- 实施分支：`codex/common-sense-learning-v1`。
- Git 基点：`72e0d76659dbfe1ed6499623069d19cd34ddb932`。

本轮修改涉及 11 个已有文件及 19 个新增文件。先归档并核对新 worktree 副本，再恢复原目录：已有文件恢复到本轮实施前，新文件仅删除本轮创建且哈希一致的版本。没有执行 reset、clean、stash 或整目录回退。

核验结果：原目录 11 个文件均与本轮开始前的哈希一致；1,968 个其他文件迁移前后哈希一致；原目录 Git 暂存区不变。该结论对应迁移当时的快照，后续照片线程可继续独立修改。

新 worktree 同时带入 223 个当前常识正文、源文核验和设计依赖文件。这些是从原目录复制的已有工作快照，包含其原有未提交修改，不能当作本轮新编写内容。主程序配置只新增常识的 `learning/index`、`topics/index` 两条路由；没有复制照片模块或政治模块的未提交配置。

迁移恢复材料保存在 `/private/tmp/common-sense-learning-20261020-migration/`：`plan.json` 区分本轮文件与依赖，`owned/` 保留迁移前副本，`restore/` 保留原目录恢复版本，`result.json` 保存保护核验结果。临时目录不是长期备份；正式交付以本 worktree 中的文件和实施记录为准。

迁移后继续实施：内容包由 JSON 改为小程序直接加载的 `learning-pack.js`，增加了开发工具回归脚本。最终 16 项核心检查、17 个开发工具运行场景通过；正文仍为 170 个小节。完整结果见[实施方案](common-sense-learning-v1.md)和[验证记录](common-sense-learning-v1-validation.json)。迁移时的 19 个新增文件是当时快照的数量，不能当作后续实施的最终文件数。
