# 常识内容 Q2 科技第三批：国际单位制基本单位与具名导出单位

实施日期：2026-10-22

状态：review / next-batch-open / release-blocked

本批继续按 Q2“每批不超过两个小主题”的边界，处理“七个国际单位制基本单位”和“八个具名导出单位”。10 道既有题保留稳定 ID，完成题干、干扰项、逐项理由、目标边界、变式过程与记忆形式更新；没有用同义改写增加题量。总量仍为 606 道候选问答、497 个目标、133 个主题组和 129 条记忆资源。

## 1. 题目处置

| 主题 | 题量 | 处置 | 主要变化 |
|---|---:|---|---|
| 七个国际单位制基本单位 | 5 | 重写 | 从数量、三组物理量—名称—符号映射和完整集合复辨，区分基本单位与导出单位 |
| 八个具名导出单位 | 5 | 重写 | 用测量记录识别频率、力、压强、能量、功率、电量、电压和电阻的单位名称及符号 |

十题覆盖基础识别、情境应用和综合复辨。每个错误项都有具体排除理由；题面不依赖“正文”“本节”等编辑语言，不靠绝对措辞或唯一最长正确项泄露答案。变式题把单组对应放回完整集合，检测能否排除相邻单位，不以调换选项充当新能力。

## 2. 内容依据与边界

本批使用已完成来源恢复的“国际单位制”正文页签，只考查正文已经列明的七个基本单位和八个具名导出单位：

- 基本单位：米、千克、秒、安培、开尔文、摩尔、坎德拉；
- 具名导出单位：赫兹、牛顿、帕斯卡、焦耳、瓦特、库仑、伏特、欧姆。

题目要求识别物理量、单位名称和符号，不扩展单位定义式、公式计算、单位换算及未列入本主题的其他单位。基础科学关系没有近期版本风险，本批没有从站外题库搬运题目。

## 3. 记忆资源处置

两项资源均保留为 `study-outline`，产品显示“速记提纲”：

- **七个基本单位顺序表**：“长质时：米、千克、秒；流温量光：安培、开尔文、摩尔、坎德拉。”按物理量分组，支持顺序回看；“长质时、流温量光”仍主要是名称压缩，缺少自然联想和独立还原线索，因此不包装成结构口诀。
- **八个具名导出单位对照**：按频率—赫兹、力—牛顿等四组对照完整展示。该内容本质是物理量与单位的配对清单，强造谐音会增加压强、电压等近邻概念的混淆，因此不包装成结构口诀。

这项处置执行“没有合格口诀也要明确退出”的规则，避免把关键词抽离误报为口诀。两项资源均保留对应自测、正文定位与边界说明；当前没有一般人群记忆试验数据，也不宣称考试提分。

## 4. 质量与准入结果

针对本批十题单独运行全部质量规则，错误与警告均为 0。题目、目标、规格、记忆句、题目自测和入口关系已经同步，相关会话通过 `2026102270 → 2026-10-22.71` 定向迁移。

开发入口可以消费本批 `review` 资源；正式环境仍为 0 道可用题。全库质量门继续为红色，因为其他未回修题仍存在长度、绝对化、重复通用题干和编辑语言问题。未执行正式准入、完整设备 UX 接受、提交、上传或发布。

## 5. 验证

执行范围：

    node scripts/build-common-sense-learning.js --check
    node scripts/validate-common-sense-content-q2-science-3.js
    node scripts/validate-common-sense-content-q2-science-2.js
    node scripts/validate-common-sense-content-q2-science-1.js
    node scripts/validate-common-sense-content-q2-law-2.js
    node scripts/validate-common-sense-content-q2-law-1.js
    node scripts/validate-common-sense-content-q1.js
    node scripts/validate-common-sense-content-q0b.js
    node scripts/validate-common-sense-content-c5-60.js
    node scripts/validate-common-sense-learning.js
    python3 scripts/validate-common-sense-learning-compile.py
    node scripts/validate-common-sense-current-law-audit.js
    node scripts/validate-common-sense-counts.js
    /Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/bin/python scripts/validate-common-sense-learning-devtools.py --port 9421

静态检查全部通过；微信开发者工具自动化通过 138 项检查，其中新增 4 项确认两个五题题组可独立进入、两项记忆资源均按“速记提纲”呈现。结构化结果见 `common-sense-content-q2-science-3-validation.json`，开发者工具结果见 `common-sense-content-q2-science-3-devtools-validation.json`。下一批处理科技领域“光学基础”和“红外线与紫外线”。
