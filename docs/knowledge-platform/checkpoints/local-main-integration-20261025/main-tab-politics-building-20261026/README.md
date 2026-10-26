# 政治理论底部图标替换 checkpoint（2026-10-26）

父 checkpoint：`refs/codex/checkpoints/main-tab-svg-candidate-20261026`（`e05e32e0190644bcbd50b0d426c2b1b87817b916`）。本 checkpoint：`refs/codex/checkpoints/main-tab-svg-politics-building-candidate-20261026`。使用临时 Git 索引保存；普通 HEAD 保持 `07f6317a`，不合并 main，不覆盖工作区其他未提交成果。

按用户新提供的两条 SVG 路径，把政治理论底部图标改为建筑造型。选中态沿用页面蓝色 `#2F6BFF`；未选中态沿用统一灰色。第一层路径保持 `0.4` 透明度。图标仍在 64×64 透明画布上生成 SVG 和 PNG，tabBar 展示尺寸与页面路径未变。

`before.png`、`after.png` 是微信开发者工具中政治理论真实首页的替换前后截图。首页、笔记、训练、常识四组 SVG/PNG 与父 checkpoint 逐字节相同。政治 SVG XML、PNG 尺寸及透明度已核验；92 项离线模板检查与 `git diff --check` 通过。真机、上传、发布未做。

`source-files.json` 保存本轮产品文件及截图的 SHA-256。`verify.py` 只读检查 checkpoint 父提交、文件范围和哈希。恢复时可基于该 ref 创建隔离工作树，不要在当前受保护工作区直接检出。
