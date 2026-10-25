# 15 政治目录 V2 内容加工与构建

> 批次：`20260827-toc-v2`；加工日期：2026-08-28
>
> 状态：37 篇内容加工、树形隔离构建和首批关系创立完成；最终事实、风险页与关系校对进行中

## 当前结果

- 输入：`sources/politics/02-toc-audit-v2/` 的 37 篇目录审计草稿。
- 正式编辑层候选：`knowledge/politics-v2/`，共 37 篇。
- 目录结构：42 个节点，根节点 1 个，内容单元映射 37 / 37。
- 学习分组：第一章总论 4 篇、第二章分论 15 篇、马克思主义基本原理 18 篇。
- 内容加工：删除考场题和母题训练，保留考点精析与知识延伸；生成一句话理解、易混边界和速记卡。
- 发布门禁：37 篇全部为 `review`、`pending_final`，可发布数量为 0。
- 风险门禁：11 个风险页及其风险类型完整继承，未经专项核对不得批准。
- 关系层：39 条带理由的首批关系，覆盖 37 / 37 个单元；前置关系无环，单点最高连接度为 5。

## 单向链路

```text
政治理论.pdf
  → 目录优先识别草稿（37）
  → V2 内容候选 Markdown（37，review）
  → V2 树形校对包（schema v3，42 个目录节点）
  → P3 V2 独立试验模型
```

V2 不读取 Obsidian 插件、`.base` 或 Canvas；小程序数据只能由 Markdown 经独立构建器生成。旧 `knowledge/politics`、正式运行包和现有 P3 模型均不被覆盖。

## 可重复执行

```text
node scripts/promote-politics-toc-v2-candidates.js --check-only
node scripts/promote-politics-toc-v2-candidates.js
node scripts/build-politics-knowledge.js --profile toc-v2 --scope review --check-only
node scripts/build-politics-knowledge.js --profile toc-v2 --scope review
node scripts/validate-politics-toc-v2-content.js
node scripts/author-politics-toc-v2-relations.js --check-only
node scripts/validate-politics-toc-v2-relations.js
```

- 候选生成器默认只新增缺失文件；已有文件发生差异时中止。
- 明确接受重新加工时才能使用 `--force`；`approved` / `published` 内容始终跳过，不允许生成器覆盖。
- 构建产物位于 `dist/politics-v2-review/`；小程序试验模型为 `politics-p3-v2-preview.js`。
- `schemaVersion: 3` 在旧展现协议上新增 `directory`、目录路径和节点属性，不修改旧 schema v2 行为。

## 首批关系规则

- `prerequisites`：20 条，只表达理解依赖；已验证为有向无环图。
- `contrasts`：5 条，只连接确有易混边界的知识对。
- `related`：14 条，只保留能够解释学习联系的高价值连接。
- 每条关系必须包含人工编排理由，并随构建生成反向索引。
- 正式目录父子关系只存在于 `directory`，不重复伪装为语义关系。
- 关系账本：`political-relations-v2-20260828.json`。
- 当前 `relation_state` 为 `authored_pending_final`；关系可用于 P3 联调，但不改变知识发布状态。

## 下一步联调

1. P3 入口切换到独立 V2 模型，目录首页按部分、篇、章、节渐进展开。
2. 知识详情使用 `hierarchyTitles` 展示完整面包屑，并按 `navigationOrder` 连续阅读。
3. 模块地图以 `directory.nodes` 为体系骨架；关系图继续只读取人工确认的知识关系。
4. 手工验收由用户执行；自动验证只检查数据协议、树结构、内容完整性和旧模块回归。
5. 校对通过后按批次将 `review` 升为 `approved`，默认运行构建仍只接收已批准内容。
