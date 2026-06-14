# 行测速练

行测速练是一个微信小程序项目，核心方向是结构化行测知识库与专项训练。项目不是 PDF 阅读器，知识内容会被整理为分类、知识点、公式、步骤、例题和导图等结构化卡片。

## 核心能力

- 训练：基础计算、资料分析、舒尔特方格、滚动舒尔特、瞬间记忆、闪电心算。
- 笔记：资料分析、数量关系、判断推理、言语理解、图形推理。
- 知识链路：笔记首页 -> 单科知识地图 -> 分类知识点列表 -> 知识点详情。
- 详情块：公式、步骤、清单、规则、对比、表格、例题、练习入口、局部图和结构导图。
- 本地质检：通过 `scripts/validate-notes.js` 校验笔记结构、训练绑定、图片引用、导图深度和训练题生成能力。

## 项目结构

- `miniprogram/pages/`：小程序页面。
- `miniprogram/models/`：静态知识库、训练目录和训练配置。
- `miniprogram/services/`：训练题生成器与认知训练运行逻辑。
- `miniprogram/utils/`：本地缓存、格式化、云端资源配置等工具。
- `docs/`：知识库架构、OCR 复核、PDF 映射和质量审计文档。
- `scripts/`：内容抽取、图片压缩和结构校验脚本。

## 本地校验

```bash
node --check miniprogram/models/note-catalog.js
node --check miniprogram/pages/note-detail/index.js
node scripts/validate-notes.js
node scripts/validate-training.js
```

## 内容治理原则

- 不放整页 PDF 图，只接入归属明确的局部图。
- 正式图片资源使用云资源相对路径，例如 `graphic/example.png`，由 `CLOUD_IMG_PREFIX` 拼接为运行态地址。
- 图形推理正式图片清单维护在 `scripts/graphic-assets-manifest.json`，源图位于 `assets-source/graphic/`，上传目标为 `note-resources/graphic/`。
- 未确认归属的截图只进入 `tmp_pdf/candidates/` 或文档清单，不进入正式知识点。
- 微信小程序聚合层使用字面量 `require`，不要改成动态 `require`。
- 扩展新知识点或图片后必须跑 `node scripts/validate-notes.js`。
