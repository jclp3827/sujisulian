# 笔记首页五枚交付 SVG 接入（2026-10-26）

五处占位替换为正式 SVG；目录和三张学习卡的几何规格，以用户明确指定的政治理论首页为样板。保持三种学习方式、原文案、真实数量、入口和学习规则。未采用附件中的固定 48px / 32px 建议覆盖已确认的政治样板尺寸。

## 版本与恢复

- 工作树：`/Users/jmac/WeChatProjects/miniprogram-ui-main-baseline-20261025`，分支 `codex/ui-main-baseline-20261025`。
- 原 HEAD：`07f6317a8489f3d9393bf1c4d318f567c29843b4`；main：`d5032323cdf4d61edfec6f93ee4e7c181c165c50`。
- 修改前：`8b402881fa3470c5f3c5f8faacddb50275192a2a`，引用 `refs/codex/checkpoints/notes-svg-before-20261026`。包括已完成的常识正式图形、常识最新配色及笔记原占位候选。
- 最终独立引用：`refs/codex/checkpoints/notes-svg-candidate-20261026`，父提交为上述修改前版本。

通过临时索引保存独立提交与引用，不改变当前分支 HEAD、暂存区或 main。恢复时在不存在的新路径从专用引用创建隔离工作树，不覆盖现有未提交成果。外部证据目录 `/Users/jmac/.codex/visualizations/2026/10/26/01a17784-1c4a-77c2-85e5-8b47ece523b5/peanut-notes-delivered-svg/` 另保存 bundle 和提交回执；bundle 的已有依赖为原 HEAD。

## 修改清单与资产

| 路径 | 内容 |
|---|---|
| `miniprogram/pages/note/index/index.wxml` | 五处占位改为本地 image / aspectFit |
| `miniprogram/pages/note/index/index.wxss` | 每日大图、目录外框、三枚学习图的比例及光学中心；考前橙底、完整题应用青绿底 |
| `miniprogram/images/notes-home/delivered-v1/*.svg` | 五份交付原始 SVG，逐字节复制 |
| `scripts/validate-module-home-interactions.js` | 仅增加五条精确资源路径保护名单 |
| 本目录和总 README 索引 | 截图、测量、来源、日志、SHA-256、恢复及只读校验 |

[产品差异](product.patch)、[源码指纹](source-files.json)、[输入来源](asset-provenance.json)。[原始输入归档](source-inputs.zip)内保留用户提供的 ZIP 和独立设计 Markdown 的原始字节。附件文字作为资产资料，不单独授予修改业务、合并或发布的权限。

| 入口 | SVG | 外部展示 |
|---|---|---|
| 每日快记 | `daily-quick-review.svg` | 右侧绝对定位大图、16% 透明度，文字和按钮在前景 |
| 全部知识 | `all-knowledge.svg` | 同政治原图、相同 52×52px 外框与光学偏移 |
| 方法判断 | `method-selection.svg` | 浅蓝圆底；可见尺寸对齐政治常规学习卡 |
| 考前速记 | `exam-recall.svg` | 与政治原图字节一致，同一缩放及橙色底座 |
| 完整题应用 | `full-problem-application.svg` | 青绿圆底；可见尺寸对齐政治常规学习卡 |

五枚 SVG 的 path、颜色、几何比例、透明背景及字节保持；均为 128×128 viewBox 的基础图元，无脚本、外链、字体或嵌入图片。圆底属于界面容器。当前 IDE 真实显示成功，沿用既有本地 SVG 加载方式，未生成运行时 PNG。

## 同屏政治样板对照

375px、390px 分别读取政治和笔记真实页面。在本次运行时，两页目录卡均为 66.789px；笔记三张学习卡及对应政治学习卡均为 62px，底座均为 44px；标题左边界及尾箭头位置匹配。源码仍沿用响应式 84rpx、44–48px 限制，没有硬编码卡片高度。

三图保持原始比例，以 SVG 可见最大边作光学校准；与对应政治图形的差异小于 0.05 逻辑 px。考前速记直接采用政治同语义图的外部缩放。数据见 [390px](after-standard-reference-match.json) / [375px](after-narrow-reference-match.json)，对照原图见 [390px 政治页](politics-standard.png) / [375px 政治页](politics-narrow.png)。

没有改文案来压缩高度。三张卡的长说明在本次两个屏宽完整显示；每日背景图没有遮挡按钮，全部知识仍绑定 `subjectCount` 和 `totalPointCount`，没有硬编码示例数量，也未新增第四张学习方式卡。

## 真实截图

| 场景 | 完整原始截图 | 核心卡局部 | 三张学习卡局部 |
|---|---|---|---|
| 修改前 390px | [完整图](before.png) | [核心卡](before-core.png) | [学习卡](before-learning.png) |
| 修改后 390px | [完整图](after-standard.png) | [核心卡](after-standard-core.png) | [学习卡](after-standard-learning.png) |
| 修改后 375px | [完整图](after-narrow.png) | [核心卡](after-narrow-core.png) | [学习卡](after-narrow-learning.png) |

标准屏前后原始 PNG 均为 696×1504；窄屏 PNG 为 698×1512。单屏已包含五张卡和五 TAB，本批没有拼接。局部是原像素裁切，保留源 ICC 配置，无重绘、缩放、调色或锐化；[裁切坐标](crops.json)可追溯。执行端已实际查看最终两种屏宽，五图清晰可识别，卡片、文字和箭头无可见裁切或遮挡。

## 回归、导航及保护

| 检查 | 结果 | 日志 |
|---|---|---|
| `node scripts/validate-module-home-interactions.js` | 25 项通过 | [入口与搜索](interaction.txt) |
| `node scripts/validate-notes-learning-pages.js` | 20 项通过 | [笔记页面](notes-pages.txt) |
| `python3 scripts/validate-integrated-template-compile.py` | 92 项离线模板/样式编译通过 | [离线编译](offline-compile.txt) |

六个入口实际点击核对原 URL，采用临时导航拦截避免进入学习页改变记录，接口已恢复；随后实际打开笔记搜索页并调用原生 `wx.navigateBack` 返回。不把 URL 核对冒称六个目标页完整往返。即时导航快照、缓存指纹及控制台匹配结果见 [验证汇总](validation.json) / [状态指纹](state-fingerprints.json)；只保存缓存指纹，不将原始缓存内容写入 Git，不回写或清空缓存。

笔记 JS/JSON、模型、真实路由、记忆与应用会话、题目、判分、准入、历史、收藏及持久化规则保持。政治、常识（包括最新渐变）、训练、真正首页、照片和公共五 TAB 没有本批产品代码改动。

通过本目录 `verify.py` 可只读校验文件 SHA-256、冻结提交中的产品与保护文件，以及候选相对恢复点的精确修改范围。当前证据是模拟器真实页面与定向自动检查，不等于物理真机或用户最终视觉验收。独立 checkpoint 完成后停止，不合并、推送、发布或推广其他模块。
