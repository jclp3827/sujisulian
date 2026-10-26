# 底部首页与政治理论图标更新 checkpoint（2026-10-26）

父 checkpoint：`refs/codex/checkpoints/main-tab-svg-politics-building-candidate-20261026`（`9c07d796a96300503aabdcf33f1b5653a9fb61d7`）。本 checkpoint：`refs/codex/checkpoints/main-tab-svg-home-politics-v3-candidate-20261026`。通过临时 Git 索引保存；普通 HEAD 保持 `07f6317a`，未合并 main，也未清理既有未提交成果。

按用户新给的两组 SVG 路径，更新首页八层圆形图标和政治理论五层建筑图标。保留源形状与层叠顺序，选中态调整为页面蓝色系，未选中态为统一灰色系。产物仍为 64×64 透明 SVG/PNG，tabBar 展示尺寸、路由和学习逻辑未变。笔记、训练、常识三组产物与父 checkpoint 逐字节相同。

`home-before.png`、`home-after.png`、`politics-before.png`、`politics-after.png` 是微信开发者工具模拟器真实页面截图。两页切换与选中态经视觉检查；SVG XML、PNG 格式与透明度通过检查；92 项离线模板检查和 `git diff --check` 通过。整包 IDE 构建、真机、上传及发布未做。

`source-files.json` 保存本轮产品文件和截图 SHA-256。`verify.py` 只读核对 checkpoint 父提交、产品范围和哈希。恢复时从此 ref 建隔离工作树，不要直接检出到当前受保护工作区。
