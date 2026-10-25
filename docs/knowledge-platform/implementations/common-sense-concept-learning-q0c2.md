# 常识口诀概念先导页面 Q0-C2 实施记录

日期：2026-10-23  
状态：implemented / local-runtime-verified / device-ux-not-accepted

## 本批结果

三个试点在现有蓝白学习页中改为以下顺序：

> 学科路径 → 先弄清概念 → 考试判断 → 判断路径 → 关键区分 → 辅助口诀 → 口诀怎么对应 → 自测

概念框架和口诀保持两个独立对象。页面先投影上位概念、判断维度、分类或因果路径，再显示口诀标题和正文；底层逐边关系继续参与校验，但不再作为技术清单展示。节点按数量采用双列或横向布局，易错点合并为低权重说明，原文链接收进对应释义。试点卡不再向用户显示作者侧的“记忆目的、记法、覆盖”。尚未迁移的 126 条口诀继续使用原有页面分支，没有强行套用空概念框架。

## 兼容边界

- 新增内容只在存在有效 `mnemonicConceptBinding` 时投影；
- 老口诀 `sound-memory` 运行时仍得到 `conceptFrame: null` 并进入原分支；
- 没有改变学习设置、底部按钮、题目判分、进度恢复、稳定 ID 或存储键；
- 生成包只新增三个概念框架和三个绑定；
- 正式内容过滤规则保持不变。

## 验证

- 内容生成检查通过：606 题、129 条口诀、4 组辨析、2 个考前主题；
- 常识学习回归：55/55 通过；
- WXML / WXSS 离线编译通过；
- 微信开发者工具本地编译：`errors=[]`、`wxml_errors=[]`；
- 既有开发者工具自动化全链路通过；
- 专项运行态检查：市场结构、价格歧视、公共物品三个页面均实际渲染完整八段链路；
- 紧凑排版运行态高度分别为 1495.3、1031.2、1361.5；相较第一轮排版分别下降约 13.9%、11.3%、11.0%，且页面不再渲染逐条“关系骨架”；
- 老口诀兼容检查通过；测试前学习记录已恢复；
- 未进行真机或独立用户视觉验收，`deviceUXAccepted=false`；没有上传、预览发布或通知用户。

验证明细见 `common-sense-concept-learning-q0c2-validation.json`。

## 主要文件

- `docs/knowledge-platform/content/common-sense-learning-v1.js`
- `miniprogram/subpackages/common-sense/models/learning-pack.js`
- `miniprogram/subpackages/common-sense/services/learning-content.js`
- `miniprogram/subpackages/common-sense/learning/index.js`
- `miniprogram/subpackages/common-sense/learning/index.wxml`
- `miniprogram/subpackages/common-sense/learning/index.wxss`
- `scripts/validate-common-sense-learning.js`
