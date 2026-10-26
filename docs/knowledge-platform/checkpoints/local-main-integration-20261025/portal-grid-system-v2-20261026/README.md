# 应用首页四方格视觉优化 checkpoint（2026-10-26）

父 checkpoint：`refs/codex/checkpoints/main-tab-home-train-selected-v4-candidate-20261026`（`59861dc763d44b221321077437f4f9a6f330f534`）。本 checkpoint：`refs/codex/checkpoints/portal-grid-system-v2-candidate-20261026`。通过临时 Git 索引保存；普通 HEAD 保持 `07f6317a`，未合并 main，既有未提交成果保留。

只优化整个应用的首页 `pages/portal/index`。保留四方格、四个模块入口、照片工具入口及原有文案和路由。四个入口改用当前底部导航同源 SVG；模块色分别为笔记橙、训练绿、常识紫、政治理论蓝。卡片在同一栅格中对齐顶部图标、标题说明和底部信息，间距与首页标题层级一并收敛。

`layout-375.png`、`layout-414.png` 是将当前首页样式与内容映射至浏览器后的精确视口宽度布局预览；两种宽度的两列卡片均无横向溢出，几何尺寸见 `validation.json`。`wechat-428.png` 是微信开发者工具真实首页截图。微信模拟器依次点击四个模块入口和照片工具，均进入预期路由；照片页返回首页成功。92 项离线模板检查和 `git diff --check` 通过。整体集成脚本在本轮入口检查前因已有政治理论 `index.js` 哈希与旧清单不符而停止，未更改其规则。375/414 微信原生模拟器、真机、上传及发布未做。

`source-files.json` 保存产品文件及截图 SHA-256；`verify.py` 只读核对父提交、产品范围与哈希。恢复时从此 ref 建隔离工作树，不要直接检出到当前受保护工作区。
