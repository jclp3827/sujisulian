# 底部主导航 SVG 图标 checkpoint（2026-10-26）

父 checkpoint：`refs/codex/checkpoints/politics-all-knowledge-nav-visual-candidate-20261026`（`b9da00ebd7103c9c19d2f5bac1abee9bd80e9aef`）。本 checkpoint：`refs/codex/checkpoints/main-tab-svg-candidate-20261026`。通过临时 Git 索引保存；普通 HEAD 保持 `07f6317a`，不合并 main，也不覆盖既有未提交首页成果。

## 图形与接入

按用户提供的五组 SVG 路径绘制首页、笔记、训练、常识、政治理论图标。仅去除导出器元数据，统一 64×64 透明画布与 `0 0 1024 1024` viewBox。`scripts/build-tab-icons-v2.py` 生成 10 份 SVG，并用 macOS `sips` 导出对应 10 份 PNG。灰色未选中态统一；选中态取页面已有色系：首页与训练蓝色、笔记橙黄、常识紫色、政治理论蓝色。常识与政治原稿形状相同，按模块色区分。

自定义 tabBar 的 `<image>` 使用 SVG，仍以 `46rpx × 46rpx` 显示；`app.json` 的五组 `iconPath` / `selectedIconPath` 使用本地 64×64 PNG。政治理论由“政”字框换成提供的图形。选中 tab 的文字与底色随模块匹配。五个页面路径和切换方法未改。

## 验证与恢复

- 375px 微信开发者工具模拟器分别切到五个真实 tab；页面路由和选中态截图为 `home.png`、`note.png`、`train.png`、`common-sense.png`、`politics.png`。
- 10 份 SVG 与 10 份 PNG 的引用、尺寸、透明角点通过检查；92 项离线模板检查及 `git diff --check` 通过。
- 原首页交互脚本的范围白名单会拒绝本轮有意修改的 `app.json`，故未标记该脚本通过。详见 `validation.json`。真机、上传、推送和发布未做。
- `source-files.json` 列出源码、产物、截图 SHA-256。可从本 checkpoint 引用新建隔离工作树；`verify.py` 只读验证父提交、限定产品文件及哈希。不要在当前受保护工作树直接检出。
