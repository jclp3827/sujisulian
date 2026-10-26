# 常识与笔记首页按钮、图标独立 checkpoint（2026-10-26）

在已冻结的常识紫色／笔记橙黄核心卡渐变之上，完成两张每日卡按钮配色和四枚首页图形的同色系衍生。政治首页及公共按钮样式保持原样。

| 模块 | 每日按钮 | 每日背景图形 | 全部知识图形 |
|---|---|---|---|
| 常识 | `180deg, #8753c9 → #6934aa`，白字 | 紫色版本 | 紫色版本 |
| 笔记 | `180deg, #f6bf57 → #e99b2e`，深棕字 | 橙黄版本 | 杏桃版本 |

按钮使用与原蓝色按钮一致的 180° 纵向渐变结构，尺寸、位置、箭头和点击逻辑未改。衍生图形以交付的 `delivered-v1` SVG 确定性替换填充色；原文件未改，路径、viewBox、形状和几何参数保持一致。映射与哈希见 [icon-provenance.json](icon-provenance.json)。学习卡图标保持原样。

## 范围与恢复

- 父 checkpoint：`refs/codex/checkpoints/module-core-gradients-candidate-20261026`，提交 `232dba0bb3b0d1e4d607facf2f0f034d50e7cd86`。
- 本 checkpoint：`refs/codex/checkpoints/module-core-button-icons-candidate-20261026`。提交哈希另见外部回执与 Git 引用。
- 产品改动恰好为两页 WXML、两页 WXSS、四份 `themed-v1` SVG、资源范围白名单脚本。详见 [产品差异](product.patch) 和 [源码指纹](source-files.json)。
- 当前工作树：`/Users/jmac/WeChatProjects/miniprogram-ui-main-baseline-20261025`；通过临时 Git 索引建立独立提交，不改变普通 HEAD、暂存区或 main。
- 恢复时从专用引用新建隔离工作树；另有已校验 Git bundle 可用于仓库外恢复。不要覆盖现有未提交工作。

## 验证证据

- 375px 微信开发者工具模拟器最终截图：[常识](common-375.png)、[笔记](notes-375.png)，均为原生 698×1512 PNG。已核对实际页面路由、按钮、四枚图形及卡片文字。
- `validate-module-home-interactions.js`：25 项通过；`validate-notes-learning-pages.js`：20 项通过；`validate-integrated-template-compile.py`：92 项通过。
- 两页最终版通过 `simulator_open_page` 编译并显示。随后额外的 `compile_wxml` / `compile_wxss` 逐文件调用遇到开发者工具 `-80408` 每分钟频率限制；未将这四次调用记为通过。详情见 [validation.json](validation.json)。
- [verify.py](verify.py) 只读校验提交父节点、精确文件范围、源码与截图 SHA-256，以及衍生 SVG 是否仅改填充色。

这属于本地模拟器及定向回归证据，不代表真机或用户最终视觉验收。没有合并、推送或发布。
