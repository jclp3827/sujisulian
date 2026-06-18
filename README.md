# 行测速练

行测速练是一个微信小程序项目，核心方向是结构化行测知识库与专项训练。项目不是 PDF 阅读器，知识内容会被整理为分类、知识点、公式、步骤、例题和导图等结构化卡片。

## 核心能力

- **训练**：基础计算、资料分析（增长/比重/分数/速算比较）、分配树、拆分估算、比例感训练、舒尔特方格、滚动舒尔特、瞬间记忆、闪电心算。
- **笔记**：资料分析、数量关系、判断推理、言语理解、图形推理 5 科，支持分类浏览、知识点搜索。
- **知识链路**：笔记首页 → 单科知识地图 → 分类知识点列表 → 知识点详情。
- **详情块**：公式（自定义解析渲染）、步骤、清单、规则、对比、表格、例题、练习入口、局部图和结构导图。
- **本地质检**：通过 `scripts/validate-notes.js` 校验笔记结构、训练绑定、图片引用、导图深度和训练题生成能力。

## 项目结构

- `miniprogram/pages/`：主包页面（训练、认知、首页）。
- `miniprogram/subpackages/`：笔记子包（module/category/search/detail）。
- `miniprogram/models/`：静态知识库（每科一个目录：meta、categories、points）、训练目录和配置。
- `miniprogram/services/train-generator/`：各题型训练题生成器。
- `miniprogram/components/`：math-formula（公式自定义解析渲染）、session-head 等通用组件。
- `miniprogram/custom-tab-bar/`：自定义标签栏。
- `cloudfunctions/getImage/`：云函数，将云存储图片路径转为临时可访问 URL。
- `docs/`：知识库架构、OCR 复核、PDF 映射和质量审计文档。
- `scripts/`：内容构建（`build-note-runtime.js`）、图片压缩、搜索元数据补丁（`patch-remaining-search-metadata.js`）和结构校验脚本。

## 本地校验

```bash
node scripts/validate-notes.js
node scripts/validate-training.js
```

## 内容治理原则

- 不放整页 PDF 图，只接入归属明确的局部图。
- 正式图片资源使用云资源相对路径，例如 `graphic/example.png`，由详情页云函数解析为临时 URL。
- 各科图片清单维护在 `scripts/*-assets-manifest.json`，源图位于 `assets-source/<module>/`。
- 未确认归属的截图只进入 `tmp_pdf/candidates/` 或文档清单，不进入正式知识点。
- 微信小程序聚合层使用字面量 `require`，不要改成动态 `require`。
- 扩展新知识点或图片后必须跑 `node scripts/validate-notes.js`。
