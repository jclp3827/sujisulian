# 常识判断首页 · 六枚 SVG 图形资产（设计交付 v1）

**交付目的**：替换当前常识首页 6 个虚线占位图，延续政治模块已确认的几何纯色色面语言；图形源文件不内置圆形底座。

## 文件清单

| 入口 | SVG | 角色 | 来源 |
|---|---|---|---|
| 每日常识 | `daily-common-sense.svg` | 主学习卡右侧大型低透明背景纹理；不是独立前景插画 | 新设计 |
| 全部知识 | `all-knowledge.svg` | 完整目录入口左侧小图形（沿用当前常识页左文结构）；不可放大抢标题 | 复用政治「全部知识」原始 SVG |
| 一问一答 | `one-question-one-answer.svg` | 白色厚卡左侧浅蓝圆形底座中的小图形 | 新设计 |
| 知识导读 | `knowledge-guide.svg` | 白色厚卡左侧浅蓝圆形底座中的小图形 | 新设计 |
| 易混辨析 | `concept-comparison.svg` | 白色厚卡左侧浅紫圆形底座中的小图形 | 复用政治「易混突破」原始 SVG |
| 考前急救 | `exam-rescue.svg` | 白色厚卡左侧浅橙圆形底座中的小图形 | 新设计 |

## 规格

- `viewBox="0 0 128 128"`，透明背景、RGB 色彩、纯色基本图元。
- SVG 中不包含渐变、阴影、图片、字体、脚本、远程资源，且不包括学习卡背后的圆形浅色底座。
- 图标固定视觉体系：亮蓝、浅蓝、绿；辨析复用蓝紫，急救以橙色为主。
- `preview.png` 展示六枚图形的光学重量，`preview-small.png` 展示约真实尺寸，`layout-preview.png` 仅作为本批容器关系示意。
- 复用文件的几何直接拷贝此前政治模块已交付 SVG，便于两个模块共享相同功能语义。
- **当前状态：资产已生成；尚未接入常识小程序，也没有完成真机验证。**

## Codex 指令

# Codex｜常识判断首页六枚图形接入（独立视觉批次）

## 目标

仅为现有「常识判断」首页将 6 个虚线占位图替换为本包的 SVG 图形。视觉语言与政治模块一致，但严格保留常识模块的真实业务、交互和页面结构。不要把政治模块整页样式直接覆盖常识。

## P0 读取与保护

1. 读取此资产包、当前常识首页源码、原始构建和截图；先保存独立 Git checkpoint 与同设备基线截图。
2. 不改政治、笔记、训练、真正首页、照片工具、共享五 TAB，不覆盖已有知识导读/易混辨析的正文排版。
3. 只接入图形及其局部容器适配；不改题库、内容事实、准入、练习、分组、判分、状态、历史、收藏、查询、路由、持久化或会话逻辑。

## P1 资源接入与规范

- 全部 SVG 的 `viewBox` 为 128×128，透明背景，使用基础纯色色面。保持原始路径与色值，不重绘、不加投影、不把圆形底色烘焙进 SVG。
- 先审查微信小程序资源加载方式及目标端兼容性。不能原生使用时，从 SVG 确定性地生成透明 PNG（建议 2×/3×），并保持 SVG 为设计源文件。
- 统一资源路径与命名，删除或隐藏本批六处虚线占位展示；不能误删其他模块正在使用的占位机制。

## P2 六处对应关系

1. **每日常识**：`daily-common-sense.svg`。沿用蓝紫青低饱和背景和当前主操作位置，将图形作为右上/右侧放大的半透明背景纹理，初始不透明度 12–20%，可在卡片内裁切。不要独立增加实心小图标或挤占按钮。保留真实说明「最多 5 道」的业务含义及真实动作文案。
2. **全部知识**：`all-knowledge.svg`。与政治模块完全复用同一个目录符号。替换当前左侧虚线占位；参考图标可见尺寸 46–54px，独立容器建议 60px，按光学重量校准。保留浅绿系独立卡片色面、170 小节等真实数据的绑定及右侧「进入」与箭头。
3. **一问一答**：`one-question-one-answer.svg`，浅蓝圆形底座。
4. **知识导读**：`knowledge-guide.svg`，浅蓝偏冷圆形底座。
5. **易混辨析**：`concept-comparison.svg`，浅紫圆形底座。与政治模块同语义复用；不修改该图形原始几何。
6. **考前急救**：`exam-rescue.svg`，浅橙圆形底座。

## P3 学习卡的共用栅格

四张次级学习卡采用相同圆形底座（初始 48px）、一致的可见图形尺寸（初始 30–34px），以光学重量调整内部缩放；严禁拉伸。左内边距、圆形底座的 X/Y 锚点、正文起始线、标题副文案行距、箭头的右边距必须跨四卡保持一致。状态或进度若当前不存在，严禁填入演示值。

图标底座是四张学习卡共同的格式塔边界；两张核心卡不强制套用同样的圆底。学习卡采用纯净白色底，避免多色渐变与圆形底座叠加形成过度装饰。

## P4 页面与文案边界

- 保留常识页顺序：标题说明 → 搜索 → 每日常识 → 全部知识 → 四张纵向学习厚卡 → 按领域查阅 → 五 TAB。
- 本批默认保留已存在的真实标题、描述、数量、动作和领域分类，不从预览稿反推或覆盖实际文案。
- 「按领域查阅」的文史、科技、经济、法律四个分类目前不是图标占位，本批不添加新的图标或变更其卡片。
- 仅修复图标接入引起的挤压、截断、对齐问题；不因此扩大卡片尺寸、不改成网格或细列表。

## P5 验证、交付与停止

1. 实际检查 6 枚图形在微信开发者工具中加载、颜色、透明边缘、圆形底座与 32px 下的清晰度。
2. 提交同屏宽的 before/after 全页截图、两张核心卡特写、四张学习方式卡特写。
3. 至少覆盖窄屏及标准屏布局：文字起点同线、尾部箭头同线、图标光学居中，无溢出、遮挡或模糊。
4. 验证每日常识真实动作、全部知识及四种学习路径导航、领域查阅和搜索往返；不主动改变学习记录。
5. 运行现有定向编译/回归，留下修改路径、命令及结果、独立 checkpoint。仅报告事实，不把编译成功视为视觉验收。

**完成后停止：不自行推广到笔记模块，不合并 main，不声称用户已验收。**


## 六枚图标原始源码

### 每日常识｜`daily-common-sense.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="每日常识">
<rect x="20" y="30" width="79" height="87" rx="15" fill="#9CCDFB"/>
<rect x="34" y="14" width="78" height="89" rx="15" fill="#2583F4"/>
<rect x="47" y="35" width="42" height="8" rx="4" fill="#C8E5FF"/>
<rect x="47" y="52" width="33" height="8" rx="4" fill="#C8E5FF"/>
<rect x="47" y="69" width="27" height="8" rx="4" fill="#C8E5FF"/>
<rect x="12" y="88" width="30" height="25" rx="9" fill="#31C790"/>
</svg>
```

### 全部知识｜`all-knowledge.svg`

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

### 一问一答｜`one-question-one-answer.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="一问一答">
<path d="M24 23H80C89 23 96 30 96 39V74C96 83 89 90 80 90H49L28 105V90H24C15 90 8 83 8 74V39C8 30 15 23 24 23Z" fill="#81BCFB"/>
<path d="M57 45H101C110 45 117 52 117 61V88C117 97 110 104 101 104H91L76 116V104H57C48 104 41 97 41 88V61C41 52 48 45 57 45Z" fill="#267FF0"/>
<rect x="58" y="66" width="35" height="8" rx="4" fill="#C8E6FF"/>
<rect x="58" y="82" width="24" height="8" rx="4" fill="#C8E6FF"/>
<circle cx="75" cy="30" r="10" fill="#2DC78A"/>
</svg>
```

### 知识导读｜`knowledge-guide.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="知识导读">
<path d="M63 34C47 25 29 25 16 29C12 30 11 33 11 37V98C11 101 14 103 18 102C35 99 49 101 63 110Z" fill="#2B83F4"/>
<path d="M63 34C79 25 98 25 112 29C116 30 117 33 117 37V98C117 101 114 103 110 102C93 99 78 101 63 110Z" fill="#80BEFB"/>
<path d="M63 34V110" stroke="#1468D3" stroke-width="5" stroke-linecap="round"/>
<path d="M29 54H47M29 70H44M79 54H100M79 70H94" stroke="#D7EDFF" stroke-width="7" stroke-linecap="round"/>
<path d="M86 18H105V50L95.5 42L86 50Z" fill="#2DC78A"/>
</svg>
```

### 易混辨析｜`concept-comparison.svg`

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

### 考前急救｜`exam-rescue.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="考前急救">
<rect x="26" y="16" width="83" height="96" rx="15" fill="#F5B44F"/>
<rect x="13" y="24" width="83" height="91" rx="15" fill="#F7A932"/>
<rect x="27" y="44" width="39" height="8" rx="4" fill="#FFF3DB"/>
<rect x="27" y="60" width="29" height="8" rx="4" fill="#FFE1A7"/>
<path d="M91 66H114L98 86H111L82 116L89 92H77Z" fill="#2583F4"/>
</svg>
```
