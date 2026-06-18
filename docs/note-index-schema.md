# 笔记内容与索引规范

## 内容结构

- `module`：模块级元信息，只放标题、描述、状态、模块关键词
- `category`：一级类目，只放分类标题、子标题、状态、pointIds
- `point`：知识点实体，是索引与页面展示的主单元
- `tab`：知识点下的内容分区
- `block`：知识点下的最小展示块

## point 字段建议

必需字段：
- `id`
- `categoryId`
- `type`
- `title`
- `summary`
- `preview`
- `tabs`

索引可选字段：
- `keywords: string[]`
- `aliases: string[]`
- `tags: string[]`
- `indexText: string`

## 填写原则

- `keywords`：教材或目录里的标准术语
- `aliases`：口语说法、别名、常见误搜词
- `tags`：用于聚合的主题标签
- `indexText`：一句话补充检索文本，写出适用场景和判断信号

## 约束

- 不要把 `tabs` / `blocks` 的正文重复写进索引字段
- 不要让 `keywords` / `aliases` / `tags` 塞满同义重复项
- 索引字段只服务检索，不作为页面正文展示来源
