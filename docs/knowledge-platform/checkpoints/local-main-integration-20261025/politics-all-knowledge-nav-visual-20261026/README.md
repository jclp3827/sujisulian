# 政治理论「全部知识」导航视觉 checkpoint（2026-10-26）

父 checkpoint：`refs/codex/checkpoints/all-knowledge-nav-cards-candidate-20261026`（`7efaa8ab1d40c90e08b209d64f59c11183a0b445`）。本 checkpoint：`refs/codex/checkpoints/politics-all-knowledge-nav-visual-candidate-20261026`。普通工作树 HEAD 保持 `07f6317a`，没有合并 main。

## 范围

产品仅修改 `miniprogram/components/knowledge-space-surface/index.wxss`。政治「全部知识」页是当前唯一使用该组件的页面。WXML、JS、目录数据、节点数量、折叠状态、知识点路由和学习记录均未改。保留顶部范围卡、两列篇目卡与章节树的原形态。

视觉调整：顶部深色改为较柔和的深蓝；篇目选中态、连接线和章节背景收敛到同一蓝色层级；知识点保留白底并降低标题字重；收紧顶部连接、篇目卡和目录行的纵向空白。精确改动可用父提交与本 checkpoint 的 Git 差异查看，文件及截图哈希见 `source-files.json`。

## 验证

- 微信开发者工具 375px 模拟器从门户、政治首页的真实「全部知识」入口进入；点击第一篇并展开第一章，页面、章节与知识点仍在原导航结构中。截图为 `before.png`、`after.png`。
- J1 知识空间／渲染／导航回归 3 项、政治展示检查 37 知识点、离线模板样式 92 项、差异空白检查均通过。
- 全量旧检查仍有与本轮 CSS 无关的首页、轻读、易混等失败；另两个旧检查分别被阅读控件变量与首页旧文案断言挡住。具体列在 `validation.json`，未把它们记作通过。
- 以上属于本地模拟器和定向回归证据；没有真机验收、上传、推送或发布。

## 恢复

从 checkpoint 引用新建隔离工作树。不要在当前有受保护未提交文件的工作树直接检出该引用。运行 `verify.py` 可只读核对父提交、限定产品文件及 SHA-256。
