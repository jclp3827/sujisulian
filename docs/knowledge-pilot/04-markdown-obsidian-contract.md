# 04 Markdown 与 Obsidian 约定

> 状态：第一版正文协议已验证；政治目录优先 V2 增补树形目录字段

## Obsidian 的角色

Obsidian 负责：

- 编辑审核通过的 Markdown。
- 浏览目录、标签、内部链接和反向链接。
- 使用 Bases 查看内容运营状态。
- 辅助发现重复、孤立和缺少关系的知识。

Obsidian 不负责：

- OCR 和事实确认。
- 生成唯一正式运行时。
- 保存只能由插件读取的关键数据。
- 决定小程序页面结构。

验收要求：未安装或未启动 Obsidian 时，仍然可以校验 Markdown 并生成小程序知识包。

Obsidian 的具体接入时点、正式知识准入和构建器演进见 [10-Obsidian 与构建器接入时序](./10-obsidian-builder-rollout.md)。Obsidian 不直接管理 `01-raw` 草稿；已经完成结构化加工的 `review` 候选和审核通过的正式知识可以共同进入 `knowledge/`，由状态决定构建范围。

## 文件粒度

- 一个 Markdown 文件对应一个可独立进入详情页的知识点。
- 文件夹用于编辑导航，不作为知识点唯一身份。
- 文件名可以调整，`id` 发布后保持稳定。
- 原书层级过深时，目录层级和知识点粒度按真实资料确认，不为适配文件夹强行拆分。

## 第一版属性

```yaml
---
id: politics-example-point
title: 示例知识点
module: politics
category: example-category
status: approved
version: 1
aliases:
  - 示例别名
tags:
  - 政治
source_units:
  - politics-s001-p003-u012
prerequisites:
  - "[[前置知识]]"
contrasts:
  - "[[易混知识]]"
related:
  - "[[相关知识]]"
reviewed_at: 2026-08-27
source_hash: "..."
---
```

属性保持扁平、原子化，避免依赖 Obsidian 不稳定或难批量维护的深层嵌套属性。

### 必填属性

- `id`
- `title`
- `module`
- `category`
- `status`
- `version`
- `source_units`
- `source_hash`

### 可选属性

- `aliases`
- `tags`
- `prerequisites`
- `contrasts`
- `related`
- `reviewed_at`

### 目录优先 V2 属性

原资料存在正式目录时，知识 Markdown 还必须保留以下扁平属性：

- `toc_node_id`：本知识对应的正式目录节点。
- `node_type`：当前只允许 `section` 或 `knowledge_point`。
- `parent_id`：正式目录父节点 ID，不等于知识关系。
- `toc_order`：内容单元在模块内的稳定阅读顺序。
- `hierarchy_ids`：从模块根到当前节点的完整 ID 路径。
- `hierarchy_titles`：与 `hierarchy_ids` 等长的可展示标题路径。

目录父子关系负责“知识在哪里”，`prerequisites`、`contrasts`、`related` 负责“知识之间怎样联系”；构建器不得用关系推断替代 PDF 正式目录。

新增属性必须有明确的构建或运营用途，不为“以后可能有用”预留字段。

## 正文约定

第一阶段使用有限 Markdown 子集：

- 标题。
- 普通段落。
- 有序和无序列表。
- 粗体和必要高亮。
- 普通 Markdown 表格。
- 图片和相对路径。
- Wikilink 或普通内部链接。
- 约定类型的提示块。

不把以下内容作为正式依赖：

- Dataview 查询结果。
- 第三方插件代码块。
- Canvas 位置和视觉布局。
- 自定义主题 CSS。
- 只能由 Obsidian 解释的复杂块引用。

## 推荐正文结构

```markdown
# 示例知识点

## 一句话理解

用一句话说明怎样理解或识别本知识点。

## 完整内容

保持来源事实、条件、例外和层级。

## 易混与边界

- 与相近概念的差异。

## 速记卡

### 提示

需要用户主动回忆的问题。

### 答案

简洁但完整的答案。

### 易错

最容易混淆的边界。
```

正文标题是内容协议，不等于最终页面标题。构建器将其转换为小程序内容块。

## 卡片规则

一张卡只检查一个可回忆目标：

- 提示必须能在不看答案时作答。
- 答案应短于完整正文，但不能省略决定正确性的条件。
- 易错项只记录最关键边界。
- 一篇知识点可以没有卡片或有多张卡，具体数量由内容决定。
- 自动生成的卡片必须经过内容审核后才能发布。

不合格示例：

> 本节主要包括政治制度、机构职权和会议内容。

合格示例：

> 某机构的产生机关、负责对象和任期分别是什么？

## 关系类型

第一阶段只允许：

- `prerequisites`：理解本知识前应先了解。
- `contrasts`：容易混淆，需要对照。
- `related`：存在明确学习联系但不属于前两类。

关系候选可以自动生成，但正式关系必须人工确认。暂不增加因果、时间、人物、题型等更多字段，等政治样本证明需要后再扩展。

## 内容状态

```text
draft → review → approved → published
                    ↓
                  stale
```

- `draft`：可编辑，不可发布。
- `review`：内容已成形，等待证据或学习表达审核。
- `approved`：允许构建预览。
- `published`：已进入一个正式知识包。
- `stale`：来源或事实依据变化，禁止进入下一版本。

状态同时承担构建门禁：默认运行包只包含 `approved` 和 `published`；隔离校对包可以包含 `review`，但不得写入小程序运行模型。风险标记不阻塞内容加工，只阻塞从 `review` 升为 `approved`。

## Obsidian 运营视图

第一阶段建议建立这些 Bases 视图，但 `.base` 文件不是正式数据源：

- 待审核。
- 来源不完整。
- 缺少卡片。
- 缺少关系。
- 孤立知识点。
- 已批准待发布。
- 来源变化后过期。
- 最近修改。

## 修改规则

- 事实修订必须更新 `version`、审核日期和来源映射。
- 改文件名不改 `id`。
- 拆分或合并知识点必须记录旧 ID 到新 ID 的迁移关系。
- 不直接编辑 `dist` 修复页面；修复应回到 Markdown 或更上游证据。
- Obsidian 自动改写格式后仍须通过独立解析器校验。
