# 政治理论首页｜六枚 SVG 图形资产（视觉候选 v1）

> 交付范围：仅政治理论模块首页的六枚图形。**不是**首页整页设计稿，也**不代表**已接入微信小程序或完成真机验收。

## 文件和版本

| 入口 | 文件 | 设计版本 | 设计状态 |
|---|---|---|---|
| 每日理论 | `daily-theory.svg` | V1 | 用户已确认，锁定 |
| 全部知识 | `all-knowledge.svg` | A-V2 | 用户已确认，锁定 |
| 快速了解 | `quick-overview.svg` | V2 | 候选，待真实页面验收 |
| 系统学习 | `systematic-learning.svg` | V1 | 候选，待真实页面验收 |
| 易混突破 | `concept-comparison.svg` | V1 | 候选，待真实页面验收 |
| 考前速记 | `exam-recall.svg` | V2 | 候选，待真实页面验收 |

## 技术规格

- 全部为 **SVG 1.1 兼容的基础路径和形状**：`path`、`rect`、`circle`，纯色填充，没有滤镜、外部依赖、渐变或动画。
- 统一 `viewBox="0 0 128 128"`，画布背景透明；内部图形有适度边缘留白。
- 色彩直接保留已确认设计稿中的 HEX 值；这是图形的视觉基准，接入时不要自动替换为另一套调色板。
- 文件内没有 CSS、脚本、外链、字体或嵌入位图。
- `preview.png` 为对照图，不是正式资源。`preview-64px.png` 用于检查在常用图标尺寸下的辨识度。

## 给 Codex 的接入说明（仅在用户明确批准接入后执行）

1. 保留六份 SVG 原始文件作为唯一视觉源。不得看着 PNG 截图重新绘制；不得修改锁定的两枚主图形。
2. 先检查微信小程序当前资源管线、SVG 可用性和开发者工具真机兼容性；如需转换，**由原 SVG 确定性地生成** PNG 或其他小程序支持的格式，而非让图像模型重新生成。
3. 复用项目中已有的训练模块 design token 和首页组件；只调整图形的外部布局尺寸、对齐、间距，不拉伸或裁切内部形状。
4. 保持标题→搜索→每日理论→全部知识→四种纵向学习方式的次序以及既有卡片高度、文字、按钮和真实状态。
5. 禁止改动知识事实、学习记录、练习和回忆、收藏、进度、判分、路由、持久化、会话及跨模块业务。首页、照片处理、训练页本体及共享 TAB 均不在本轮修改范围。
6. 在相同手机尺寸、相同构建状态下比对修改前后真实页面截图，重点检查图形轮廓、右侧留白、文字不被挤压、全部知识的重点感，以及四张厚卡的统一视觉重量。
7. 首批只接入政治首页，保留 Git 恢复点；通过源码和编译检查不等于视觉验收。四枚候选需用户看真实截图后确认，不能宣称全部定稿。

## 设计构造原则

- 几何色面、饱满剪影、少量局部叠色及遮挡；不使用 3D、强阴影、光晕、材质、装饰圆团。
- 主色蓝、辅色绿；易混突破适量紫色，考前速记适量橙色，均为本批候选色彩。
- 功能性搜索、箭头、底部 TAB 不属于这六枚图形的覆盖范围。

## 单文件 SVG 源码

下面每段与同名 `.svg` 文件内容完全一致，MD 可独立提供给 Codex 解析或复制。

### 每日理论 — `daily-theory.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="每日理论">
<path d="M64 42C48 32 29 29 15 35C12 36 11 39 11 43V94C11 98 14 100 18 99C35 94 50 98 64 107Z" fill="#2484F4"/>
<path d="M64 42C80 32 99 29 113 35C116 36 117 39 117 43V94C117 98 114 100 110 99C93 94 78 98 64 107Z" fill="#83BDFB"/>
<path d="M64 42V107" stroke="#1766D0" stroke-width="6" stroke-linecap="round"/>
<path d="M27 52C36 50 44 52 51 55M27 67C36 65 44 67 51 70" stroke="#C8E5FF" stroke-width="7" stroke-linecap="round" fill="none"/>
<path d="M77 55C85 52 93 50 101 52" stroke="#E6F4FF" stroke-width="7" stroke-linecap="round" fill="none"/>
</svg>
```

### 全部知识 — `all-knowledge.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="全部知识">
<rect x="98" y="35" width="22" height="24" rx="6" fill="#2DC78A"/>
<rect x="98" y="73" width="22" height="24" rx="6" fill="#7CDCB0"/>
<rect x="19" y="15" width="88" height="99" rx="14" fill="#2583F4"/>
<path d="M33 15H40V114H33C25.3 114 19 107.7 19 100V29C19 21.3 25.3 15 33 15Z" fill="#1469D4"/>
<rect x="45" y="31" width="48" height="68" rx="8" fill="#E7F3FF"/>
<rect x="56" y="48" width="26" height="7" rx="3.5" fill="#94C5F8"/>
<rect x="56" y="63" width="20" height="7" rx="3.5" fill="#94C5F8"/>
</svg>
```

### 快速了解 — `quick-overview.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="快速了解">
<path d="M15 37Q15 32 20 30L47 21V93L21 103Q15 105 15 98Z" fill="#8CC4FA"/>
<path d="M47 21L81 34V106L47 93Z" fill="#2583F4"/>
<path d="M81 34L108 24Q114 22 114 29V94Q114 98 109 100L81 106Z" fill="#65ABF4"/>
<rect x="55" y="46" width="18" height="24" rx="6" fill="#C5E6FF"/>
<rect x="23" y="55" width="15" height="7" rx="3.5" fill="#E5F3FF"/>
<rect x="89" y="58" width="16" height="7" rx="3.5" fill="#C5E6FF"/>
<rect x="59" y="75" width="11" height="11" rx="4" fill="#2DC78A"/>
</svg>
```

### 系统学习 — `systematic-learning.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="系统学习">
<path d="M64 46V66M37 66H91M37 66V80M91 66V80" fill="none" stroke="#96C5F8" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="37" y="14" width="54" height="37" rx="11" fill="#2583F4"/>
<rect x="48" y="27" width="32" height="9" rx="4.5" fill="#B3DBFF"/>
<rect x="13" y="78" width="49" height="37" rx="11" fill="#83BDFB"/>
<rect x="66" y="78" width="49" height="37" rx="11" fill="#176BD5"/>
<rect x="24" y="92" width="26" height="8" rx="4" fill="#E1F1FF"/>
<rect x="77" y="92" width="26" height="8" rx="4" fill="#A6D0FF"/>
</svg>
```

### 易混突破 — `concept-comparison.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="易混突破">
<rect x="13" y="24" width="47" height="81" rx="13" fill="#2583F4"/>
<rect x="68" y="24" width="47" height="81" rx="13" fill="#7567E9"/>
<circle cx="36.5" cy="53" r="11" fill="#E3F2FF"/>
<rect x="84" y="42" width="16" height="22" rx="5" fill="#EAE6FF"/>
<rect x="26" y="79" width="21" height="7" rx="3.5" fill="#A9D4FF"/>
<rect x="81" y="79" width="21" height="7" rx="3.5" fill="#C9C0FF"/>
</svg>
```

### 考前速记 — `exam-recall.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="考前速记">
<rect x="29" y="27" width="83" height="91" rx="14" fill="#2583F4"/>
<rect x="16" y="13" width="83" height="91" rx="14" fill="#F5AD45"/>
<rect x="30" y="40" width="47" height="9" rx="4.5" fill="#FFFFFF"/>
<rect x="30" y="58" width="32" height="9" rx="4.5" fill="#FFE3B0"/>
<rect x="30" y="76" width="20" height="9" rx="4.5" fill="#FFE3B0"/>
</svg>
```
