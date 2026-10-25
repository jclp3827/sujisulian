# 常识内容 Q1：两主题质量试点

实施日期：2026-10-22

状态：`review-accepted / next-batch-open / release-blocked`

Q1 已按质量审计限定完成“近代史条约辨析”和“市场失灵辨析”两个主题。每个主题各 3 道题，依次覆盖快速回忆、相邻概念或条件边界、短材料运用；全部错误选项均有独立解释。新增内容保持 `review`，没有进入每日常识、考前急救或正式内容池。

## 1. 本批内容

| 主题 | 快速回忆 | 边界辨析 | 短材料运用 | 记忆产品处置 |
|---|---|---|---|---|
| 近代史条约辨析 | 用“香港岛、五口、协定关税”识别《南京条约》 | 区分《马关条约》的设厂条款与《辛丑条约》的使馆界、驻兵 | 按三组高辨识度条款完成综合回忆与顺序辨析 | 新建“南港五关税，马辽台澎厂，辛馆驻兵”，定为**结构口诀** |
| 市场失灵辨析 | 完整识别垄断、外部性、公共物品、信息不对称 | 用第三方未补偿成本排除逆向选择和公共物品 | 在工厂排放与二手车信息差两个情境中区分负外部性、逆向选择 | 沿用“垄外公共信息差”，定为**速记提纲**；机制部分不强造口诀 |

6 道题的原始答案位置为 `1, 2, 0, 2, 0, 1`，三个位置各 2 次。展示时仍使用 Q0-B 的稳定会话洗牌。新增题没有命中正确项唯一最长、重复通用题干、绝对化弱干扰项或内部编辑语言规则。

题目、目标、逐项理由和变式判断过程登记在 [`common-sense-content-q1.js`](../content/common-sense-content-q1.js)。当前包为 606 道题、497 个目标、133 个主题组、129 条记忆资源。

## 2. 变式的不同判断过程

Q1 没有用调换选项冒充变式。每个目标都登记直接检测、变式检测及过程差异：

- 条约题从单组条款回忆或近邻错误对应，转为三组条款的顺序还原；
- 四因素从名称完整性，转为在具体机制情境中识别因素类别；
- 负外部性从第三方成本条件判断，转为与交易前信息差并列辨析；
- 逆向选择的直接题要求识别“交易前信息差 + 劣品驱逐优品”，变式要求说明只有第三方成本时为何不能套用。

## 3. 口诀质量规格

[`common-sense-mnemonic-quality-q1.js`](../content/common-sense-mnemonic-quality-q1.js)只为本批实际审查的两项资源登记规格：

- 条约锚点分成 3 块，每块都能在“三条约对照”语境中反解到一个条约目标，按时间顺序使用，分类为 `structural-mnemonic`；三个分段均已登记脱离语境时的歧义；
- “垄外公共信息差”是原词压缩，没有独立自然联想，分类为 `study-outline`；单字“外”的多义风险已显式登记。

两项规格均通过 schema 校验。全库另外 127 条资源仍缺正式质量规格，且两项资源都没有用户记忆试用证据，因此口诀质量门继续保持红色，不能升级为 `approved`。

## 4. 入口和运行验证

- 一问一答：新增 6 题和两个主题组；
- 常识口诀：只加入条约结构口诀及其 3 道自测题；
- 每日常识：仍为 47 题；
- 考前急救精选：仍为 49 题；
- 正式环境：由于全部资源仍为 `review`，正式可用题仍为 0。

微信开发者工具 `develop` 环境完成全量回归，新增检查覆盖：两个 Q1 主题均按 3 题独立进入、条约错项理由实际展示、条约记忆资源使用并渲染“结构口诀”标签。验证后学习存储已恢复；没有上传、通知或设备 UX 接受。证据见 [`common-sense-content-q1-devtools-validation.json`](common-sense-content-q1-devtools-validation.json)。

## 5. 独立审查停止门

两份不同展示顺序、且不含答案和解析的形式盲审表已由两名未参与编写的独立 AI 审稿代理分别完成：[`common-sense-content-q1-independent-review.json`](common-sense-content-q1-independent-review.json)。评估脚本给出的结果是：审稿 A 形式猜中率 `3/6 = 50%`，审稿 B 为 `1/6 ≈ 16.7%`，两人共同猜中为 `1/6 ≈ 16.7%`，均不超过 50% 阈值。

独立 AI 领域预审发现并关闭了三项内容问题：两道经济题补齐未补偿与交易前双方信息差条件；条约第三题从应用题降为综合回忆/辨析；条约结构口诀的三个分段均登记语境歧义。复审结论为六题答案、干扰项、解析和边界无剩余必须修复项。

产品负责人已在本轮确认抽样测试通过，审核结论登记于 [`common-sense-content-q1-content-review.md`](common-sense-content-q1-content-review.md)。Q1 停止门因此关闭，可以进入 Q2；所有新增资源仍保持 `review`，本次抽样验收不等同于正式内容准入或发布批准。

## 6. 验证

```bash
node scripts/build-common-sense-learning.js --check
node scripts/validate-common-sense-content-q1.js
node scripts/evaluate-common-sense-q1-independent-review.js
node scripts/validate-common-sense-content-q0b.js
node scripts/validate-common-sense-content-c5-60.js
node scripts/validate-common-sense-learning.js
python3 scripts/validate-common-sense-learning-compile.py
/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/bin/python scripts/validate-common-sense-learning-devtools.py --port 9421
```

结构化结果见 [`common-sense-content-q1-validation.json`](common-sense-content-q1-validation.json)。
