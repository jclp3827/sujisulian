# 笔记与常识「全部知识」导航、知识条目 UI checkpoint（2026-10-26）

父 checkpoint 为 `refs/codex/checkpoints/module-core-button-icons-candidate-20261026` (`6f73139618542c13a9d2b5997bd2f9f6e0e3614a`)。本 checkpoint 为 `refs/codex/checkpoints/all-knowledge-nav-cards-candidate-20261026`；普通工作树 HEAD 仍为 `07f6317a`，没有合并 main。通过临时 Git 索引建立提交，不触碰现有暂存区和首页未提交成果。

## 范围

- 真实入口：笔记首页「全部知识」→ `subpackages/note/directory/index`；常识首页「全部知识」→ `subpackages/common-sense/topics/index`。
- 只改上述两个目录页的 WXML 与 WXSS：统一右上角图标加文字的搜索入口；去掉“选择科目／专题／篇目／章节”小标题；一级改为紧凑文字 tab，笔记五科和常识四篇在 375px 模拟器内全部可见；二级改为无胶囊的横向文字导航，用下划线表示当前选中项。知识条目强化标题、摘要、预览和进入提示。颜色沿用模块首页的橙黄、紫色，层级和留白参考政治知识目录。
- 保留原 handler、data-id、目录数据、162 个笔记知识点、170 个常识正文小节、页签定位、搜索与详情路由。详情内容及学习记录代码未改。完整差异见 `product.patch`，文件和截图 SHA-256 见 `source-files.json`。

## 页面与回归

- 微信开发者工具模拟器从两个首页实际点击进入，读取真实页面数据；又分别点开笔记「基础统计术语」和常识「史前时代」详情。统一搜索后也分别实点进入原搜索页。最终目录截图为 `notes-after.png` 与 `common-after.png`；`*-before-compact.png` 保留了用户指出导航占宽过大的前一版画面。
- 笔记定向回归 20 项、常识导读入口回归通过、离线模板/样式检查 92 项、`git diff --check` 通过。逐项结果见 `validation.json`。
- 截图仅为本地模拟器画面，不代表真机或人工最终视觉验收；没有上传、推送或发布。

## 恢复

从本 checkpoint 引用新建隔离工作树；不要把该引用直接检出到这个有受保护未提交文件的工作树。`verify.py` 可只读核对父提交、限定产品文件和 SHA-256。
