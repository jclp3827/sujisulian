# 花生笔记架构约定

## 产品层级

底部 Tab 保持两个入口：

- 训练：题型驱动，负责刷题和反馈。
- 笔记：知识驱动，负责知识地图、知识点拆解和训练联动。

笔记功能的目标不是复刻 PDF，而是形成：

```text
科目 → 知识地图节点 → 知识点 → 内容块 → 对应训练
```

第一阶段不做学习进度、最近学习、原笔记图片或 PDF 预览。

## 页面分工

```text
pages/note/index/index        花生笔记首页，展示五科入口
pages/note/module/index       单科知识地图，例如资料分析路径
pages/note-category/index     某个节点下的知识点列表
pages/note-detail/index       单个知识点详情，按 tabs + blocks 渲染
```

`note-category` 和 `note-detail` 放在顶层 `pages/` 下，是为了减少微信开发者工具对深层新增目录的缓存识别问题。

## 数据分层

```text
models/note-catalog.js          笔记统一查询入口
models/note-data-analysis.js    资料分析内容数据
```

为了兼容微信开发者工具对新增纯 JS 模块的收集行为，笔记数据文件先保持在 `models/` 同一级，不再放深层 `models/notes/` 目录。

后续新增科目时，按科目新增同层文件：

```text
models/note-quantity.js
models/note-logic.js
models/note-graphic.js
models/note-verbal.js
```

然后在 `models/note-catalog.js` 注册即可。

## 科目数据结构

每个科目模块导出：

```js
module.exports = {
  module,
  categories,
  points,
};
```

`module` 表示科目入口：

```js
{
  id: "data-analysis",
  title: "资料分析",
  keywords: "增长、比重、分数、速算",
  description: "围绕资料分析常见公式、比较方法和速算技巧整理。",
  status: "ready",
  statusText: "可学习",
}
```

`categories` 表示知识地图节点：

```js
{
  id: "growth",
  title: "增长类",
  subtitle: "基期、增长量、增长率",
  status: "ready",
  pointIds: ["base-period", "growth-amount"]
}
```

`pointIds` 控制节点下知识点展示顺序。未配置时按 `categoryId` 自动归类。

## 知识点结构

知识点必须使用 `tabs + blocks`，不要在页面里为某个知识点写专用结构。

```js
{
  id: "base-period",
  categoryId: "growth",
  type: "formula",
  title: "基期量",
  summary: "看到“同比增长 x%”并要求上一期数值时使用。",
  preview: "基期量 = 现期量 / (1 + 增长率)",
  relatedTraining: {
    sectionId: "data-analysis",
    itemId: "growth-pre",
    title: "估算前期量"
  },
  tabs: [
    { id: "knowledge", title: "知识点", blocks: [] },
    { id: "example", title: "例题讲解", blocks: [] },
    { id: "practice", title: "相关练习", blocks: [] }
  ]
}
```

## 内容块类型

当前详情页支持这些 block：

```js
{ type: "formula", label: "核心公式", content: "..." }
{ type: "steps", label: "解题步骤", items: ["...", "..."] }
{ type: "list", label: "常用速查", items: ["...", "..."] }
{ type: "signal", title: "识别信号", items: ["...", "..."] }
{ type: "rule", title: "判断规则", items: ["...", "..."] }
{ type: "compare", label: "对照说明", left: {}, right: {} }
{ type: "table", label: "速查表", columns: [], rows: [] }
{ type: "tip", variant: "success", title: "快速判断", content: "..." }
{ type: "tip", variant: "warning", title: "易错提醒", content: "..." }
{ type: "example", label: "例题 1", stem: "...", analysis: "..." }
{ type: "practice", title: "估算前期量", description: "..." }
```

`compare` 用于两个概念、两种问法、两类解法的左右对照：

```js
{
  type: "compare",
  label: "两类问法",
  left: { title: "年平均量", content: "平均每年有多少", items: ["..."] },
  right: { title: "年均增长量", content: "平均每年增加多少", items: ["..."] }
}
```

`table` 暂按两列速查表设计，适合常用分数百分数转换、公式对照、易混问法对照。

后续如果遇到新形态，比如图形规律、选项排除表、词语辨析、题干信号，可以继续新增 block type，而不是新增页面。

建议预留的扩展方向：

```js
{ type: "option-rule", title: "选项排除", items: [] }
{ type: "pattern", title: "图形规律", items: [] }
{ type: "word-pair", title: "词语辨析", pairs: [] }
```

## 当前资料分析样板

第一阶段以资料分析作为内容和架构样板，当前已整理：

- 基础知识：现期与基期、单位与口径
- 速算技巧：百分化
- 增长类：基期量、增长率、增长量、增量比较、间隔增长率
- 比重类：现期比重、基期比重、比重变化
- 比较类：分数比较、基期比较
- 平均数类：年平均量
- 特殊考点：混合增长率、年均增长率、倍数增长、百分点

有现成训练题型的知识点必须配置 `relatedTraining`，例如基期量跳转“估算前期量”、增长量跳转“估算增长量”、基期比较跳转“基期比大小”。没有对应训练的纯知识点可以先不绑定训练，等训练模块补齐后再加。

## 数据校验

新增或批量修改笔记数据后，运行：

```bash
node scripts/validate-notes.js
```

校验内容包括：

- ready 科目是否有分类和知识点。
- 分类 `pointIds` 是否能找到对应知识点。
- 知识点必填字段、tabs、blocks 是否完整。
- block 类型是否在详情页支持范围内。
- `relatedTraining` 是否能匹配现有训练题型。

校验结果中的 `problems` 必须为 0；`warnings` 可以按情况处理，但进入正式内容扩展前应尽量清零。

## 样式原则

- 首页和地图页保持轻量，强调路径感。
- 知识点详情页只展示当前 tab 的内容块，避免一页堆太长。
- 所有知识点复用同一套 block 样式。
- 不在页面写某个知识点专属样式，除非它上升为通用 block type。
- 暂不展示进度、百分比、最近学习等状态，避免内容未齐时产生错误预期。

## 内容录入规则

新增知识点时优先补齐：

1. `summary`：一句话说明什么时候用。
2. `preview`：列表页显示的核心公式或方法。
3. `tabs`：至少包含 `knowledge`。
4. `relatedTraining`：有对应训练时必须配置。
5. `practice` block：用于说明为什么跳这个训练。

没有对应训练的知识点可以先不配置 `relatedTraining`，但详情页中的练习入口也应暂不展示。
