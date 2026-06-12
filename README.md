# 速记速练 · 行测知识库小程序

这是一个面向行测备考的微信小程序项目，定位是“结构化知识库 + 训练入口”，重点沉淀可直接学习、复盘和练习的知识卡，而不是 PDF 阅读器。

## 项目定位

- 结构化整理行测高频知识点，按科目、分类、知识点逐层组织。
- 知识点详情以卡片、规则、识别信号、例题、导图、局部图片等结构化内容呈现。
- 有对应训练的知识点绑定训练入口；暂无训练的知识点先作为知识卡沉淀。
- 不做整页 PDF 阅读、不展示整页原图、不加入学习进度或最近浏览等非核心功能。

## 当前学习链路

```text
笔记首页 → 单科知识地图 → 分类知识点列表 → 知识点详情
```

底部 Tab 当前保留：

- `训练`
- `笔记`

## 已覆盖模块

| 模块 | 状态 | 分类数 | 知识点数 |
| --- | --- | ---: | ---: |
| 资料分析 | ready | 8 | 32 |
| 数量关系 | ready | 13 | 21 |
| 判断推理 | ready | 5 | 19 |
| 言语理解 | ready | 5 | 16 |
| 图形推理 | ready | 6 | 28 |

## 目录结构

```text
miniprogram/
  pages/
    note/index/          笔记首页
    note/module/         单科知识地图
    note-category/       分类知识点列表
    note-detail/         知识点详情
  models/
    note-catalog.js      笔记聚合入口
    note-data-analysis.js
    note-quantity.js
    note-logic.js
    note-verbal.js
    note-graphic.js
  components/
  images/
config/
  assets/                图片资源前缀与占位配置
docs/                    数据整理、OCR 审核、PDF 对齐记录
scripts/
  validate-notes.js      知识库数据校验脚本
```

## 数据模型说明

笔记数据按模块拆分维护：

- `module`：科目基础信息。
- `categories`：分类列表，包含分类标题、说明、状态和知识点 ID 列表。
- `points`：知识点详情，内容通过 `tabs[].blocks` 组织。

常用内容块包括：

- `signal`：识别信号。
- `rule`：规则总结。
- `tip`：提示与提醒。
- `example`：例题摘要与解析。
- `image-note`：确认归属后的局部图片。
- `mind-map`：结构化导图节点。
- `formula`：结构化公式节点。

> 微信小程序打包器对 `require` 有限制，聚合层保持字面量 `require`，不要改为动态 `require`。

## 图形推理整理原则

图形推理当前已完成完整结构骨架，后续图片精修遵循：

- 先确认 PDF 页、分类、知识点和导图节点的对应关系。
- 只挂载能明确归属的局部示例图。
- 不批量乱裁图，不把整页 PDF 图作为知识点图片。
- 图片内容必须和知识点节点一致，未确认归属先不挂载。

当前已接入的图形推理局部图片示例：

- `movement-overall-05.png`
- `movement-flip-example-05.png`
- `position-relation-05.png`

## 本地校验

在项目根目录执行：

```bash
node scripts/validate-notes.js
```

期望结果：

- `problems: []`
- `warnings: []`
- 5 个模块均能正常汇总。

也可以对重点数据文件做语法检查：

```bash
node --check miniprogram/models/note-graphic.js
node --check miniprogram/pages/note-detail/index.js
```

## 开发建议

- 使用微信开发者工具打开项目根目录。
- 优先从 `笔记 → 图形推理` 检查页面渲染、导图层级和局部图片展示。
- 新增知识点时同步运行 `scripts/validate-notes.js`。
- 新增图片时优先使用局部裁剪图，并确保图片路径能通过详情页资源前缀和错误兜底逻辑正常处理。

## 当前重点

- 保持知识库内容结构化、可学习、可复盘。
- 继续按 PDF 页逐点精修 OCR 文案和局部示例图。
- 训练入口按知识点逐步绑定，暂无训练时不强行占位。
