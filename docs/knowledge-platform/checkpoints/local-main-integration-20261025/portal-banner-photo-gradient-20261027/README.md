# 应用首页 banner 与备考工具渐变 checkpoint（2026-10-27）

父 checkpoint：`refs/codex/checkpoints/note-learning-settings-visual-v2-candidate-20261027`。本 checkpoint：`refs/codex/checkpoints/portal-banner-photo-gradient-candidate-20261027`。普通 HEAD 仍为 `07f6317a`，没有合并 main。

首页顶部改为图形化 banner：使用本地绘制的 SVG 表现每日学习路径，沿用四个模块的橙、绿、紫、蓝四色，保留原文案。报名照片处理入口改用低饱和粉紫至浅蓝渐变和深色文字。四宫格、模块与照片工具路由、业务状态均保持原样；上一轮已确认的“花生开小灶”导航标题一并保存在本 checkpoint。

`wechat-portal-428.png` 为微信开发者工具当前首页截图。模拟器可见 banner 插画与渐变，照片入口点击后进入 `pages/photo/index`。定向入口回归 24 项、离线模板检查 92 项、SVG 解析和 `git diff --check` 通过。375/414 微信原生模拟器与真机未验收；本截图不代表真机验收。

本 checkpoint 只选择首页相关的 5 个产品文件及本目录，工作区其他未提交成果不纳入。`source-files.json` 记录产品文件与截图 SHA-256，运行 `python3 verify.py` 只读校验 checkpoint 树。恢复时从 ref 建隔离工作树或按清单选择文件，勿直接覆盖当前受保护工作区。
