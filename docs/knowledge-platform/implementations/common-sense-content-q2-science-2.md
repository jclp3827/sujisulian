# 常识内容 Q2 科技第二批：传热方式与物质分类

实施日期：2026-10-22

状态：review / next-batch-open / release-blocked

本批继续按 Q2“每批不超过两个小主题”的边界，处理“传热三种方式”和“先分物质，再看元素”。6 道既有题保留稳定 ID，完成题干、干扰项、逐项理由、目标边界、变式过程与记忆形式更新；没有用同义改写增加题量。总量仍为 606 道候选问答、497 个目标、133 个主题组和 129 条记忆资源。

## 1. 题目处置

| 主题 | 题量 | 处置 | 主要变化 |
|---|---:|---|---|
| 传热三种方式 | 3 | 重写 | 用金属勺、水循环、太阳跨真空三个情境区分传导、对流、辐射 |
| 先分物质，再看元素 | 3 | 重写 | 用蒸馏水与空气、纯氧气、纯二氧化碳执行“物质种类—元素种类”两步分类 |

六题均要求先读取条件，再判断机制或分类层级。正确项与错误项表达强度相近，每个错误项都有具体排除理由；没有“正文”“本节”等编辑语言，也没有依靠绝对措辞或唯一最长正确项泄露答案。

## 2. 内容依据与边界

本批使用已经过来源恢复审计的两个正文单元：

- 热力学 · 传热方式：热传导由高温部分向低温部分传递，热对流依靠冷热流体运动和掺混，热辐射以电磁辐射形式传热；
- 化学 · 物质分类：纯净物与混合物按物质种类区分，确认纯净物后再按元素种类区分单质与化合物。

传热题只要求识别主要机制，不声称现实场景只存在一种传热方式。物质分类题明确两层顺序，避免把“多种元素”误判成“多种物质”。这些基础科学关系没有近期版本风险，本批没有从站外题库搬运题目。

## 3. 口诀能力建设

两项记忆资源均从关键词提纲升级为结构口诀候选：

- **热量搬家三条路**：“热量搬家看路线：挨着递是传导，流体搬是对流，电磁送是辐射。”统一使用搬家画面，把三种机制映射为三条不同路线；逐句能够反解传导、对流、辐射。
- **物质分类两步诀**：“先数物质：一种纯，多种混；纯里数元素：一种单，多种化。”使用固定决策顺序和一种/多种的对偶关系，还原完整两层分类树，并保留“第二步只在纯净物内进行”的前提。

两项都记录为 `structural-mnemonic`，产品显示“结构口诀”。此判断说明其结构、联想和可还原性，不等同于一般人群记忆有效证明；当前没有用户记忆试验数据，也不宣称考试提分。

## 4. 质量与准入结果

针对本批六题单独运行全部质量规则，错误与警告均为 0。题目、目标、规格、口诀句、题目自测和入口关系已经同步，相关会话通过 `2026102269 → 2026-10-22.70` 定向迁移。

开发入口可以消费本批 `review` 资源；正式环境仍为 0 道可用题。全库质量门继续为红色，因为其他未回修题仍存在长度、绝对化、重复通用题干和编辑语言问题。未执行正式准入、完整设备 UX 接受、提交、上传或发布。

## 5. 验证

执行范围：

    node scripts/build-common-sense-learning.js --check
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

结构化结果见 `common-sense-content-q2-science-2-validation.json`，开发者工具结果见 `common-sense-content-q2-science-2-devtools-validation.json`。下一批处理科技领域“七个国际单位制基本单位”和“八个具名导出单位”。
