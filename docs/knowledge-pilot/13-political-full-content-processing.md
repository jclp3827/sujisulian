# 13 政治全量内容加工与校对

> 状态：第一轮 25 篇加工链保留为组件回归夹具；目录优先第二轮已迁移至 37 篇独立加工链

## 结论

内容加工与发布审核分离。本文记录的 25 篇第一轮加工结果继续用于旧组件回归，但不再作为知识架构基线；正式后续加工以 PDF 目录恢复后的 37 篇 V2 候选为准，见 [15-政治目录 V2 内容加工与构建](./15-political-toc-v2-content-build.md)。

默认正式内容模型只接收 `approved` / `published`。包含 `review` 的全量校对包独立生成，同时生成明确隔离的 `politics-p3-preview.js`，仅供政治试验入口做 P3 展现联调，不得作为发布数据。

## 当前批次

- 知识总数：25。
- 已批准：6。
- 待最终校对：19。
- 风险页：4、7、15、16、17、20、21、36、49、57、70。
- 命中风险页的知识点：9。
- 风险类型：插图阅读顺序 1 页、表格版面 10 页。
- 特别粒度风险：`politics-kp-007` 的来源跨度为 23–46 页，内部含 13 个主题段；内容已经完整保留，发布前必须决定拆分方案。

## 单向链路

```text
01-raw 原始稿
  → 候选生成器（剔除训练题，保留全部考点精析和知识延伸）
  → knowledge/politics（status: review）
  → 全量协议校验
  ├─ runtime：仅 approved / published → 小程序运行模型
  └─ review：review + approved + published → 隔离校对 JSON + P3 试验模型
```

Obsidian 只用于编辑和运营 Markdown；构建、校验与小程序运行均不依赖 Obsidian、社区插件或 `.base` 文件。

## 可重复执行

```text
node scripts/promote-politics-review-candidates.js --check-only
node scripts/build-politics-knowledge.js --check-only
node scripts/build-politics-knowledge.js --scope review
node scripts/build-politics-knowledge.js
node scripts/validate-politics-content-staging.js
node scripts/validate-politics-presentation.js
```

- 候选生成器默认只创建缺失文件，绝不覆盖 `approved` / `published`。
- 已存在的 `review` 候选发生差异时默认中止；只有明确接受重新生成时才使用 `--force`。
- `--scope review` 生成 `dist/politics-review/` 和独立的 `miniprogram/models/politics-p3-preview.js`；它不覆盖只含审核内容的 `politics-preview.js`。
- 不带 `--scope` 的默认构建只生成审核通过的运行预览。

## 最终校对清单

每篇 `review` 至少完成：

1. 对照来源页确认否定词、数字、专名、层级和阅读顺序。
2. 对命中 `risk_pages` 的页面查看原图；关闭相应 `risk_flags`。
3. 判断一个文件是否仍对应一个独立学习目标，必要时拆分并记录 ID 迁移。
4. 校对一句话理解、易混边界和速记卡，不把自动加工文本直接视为权威结论。
5. 确认关系后再写 `prerequisites`、`contrasts`、`related`。
6. 将 `review_state` 改为 `final_checked`，补 `reviewed_at`，递增版本并把状态改为 `approved`。
7. 重新运行全量校验、运行构建、差异报告和展现回归。

## 实时纠错

- 页面纠错先进入本地纠错队列，不直接改 `dist` 或运行模型。
- 内容修订回到对应 Markdown；来源文本或页面证据变化时同步更新 `source_hash`、版本和审核日期。
- 风险未关闭的候选可继续编辑和预览，但不得升为 `approved`。
- 每次批准一批内容后，默认运行包可增量扩大，不要求等待剩余候选全部校对完成。
