# 首页与训练底部导航选中态 checkpoint（2026-10-26）

父 checkpoint：`refs/codex/checkpoints/main-tab-svg-home-politics-v3-candidate-20261026`（`ef9ba5e03b8762456eaaf7f9759fba3a38664a3e`）。本 checkpoint：`refs/codex/checkpoints/main-tab-home-train-selected-v4-candidate-20261026`。通过临时 Git 索引保存；普通 HEAD 保持 `07f6317a`，未合并 main，既有未提交文件继续保留。

首页与训练被选中时均显示底色：首页浅蓝底、蓝色文字，四个圆圈分别用黄色、绿色、紫色、蓝色；训练浅绿底、绿色图标与文字。未选中图标仍为灰色。tabBar 尺寸、路由和业务逻辑未变。只有两组选中态 SVG/PNG 改动；两组未选中态与笔记、常识、政治图标同父 checkpoint 逐字节一致。

微信开发者工具模拟器切入两条真实 tab 后截取 `*-after.png`，`*-before.png` 保存之前效果。SVG XML、64×64 透明 PNG、92 项离线模板检查及 `git diff --check` 通过。整包 IDE 构建、真机、上传与发布未做。

`source-files.json` 保存本轮产品文件和截图 SHA-256；`verify.py` 只读核对父提交、限定产品范围及哈希。恢复时从此 ref 建隔离工作树，不要直接检出到当前受保护工作区。
