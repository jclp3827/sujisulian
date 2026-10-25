# 常识内容 Q2 法律第二批：民法原则与宪法章序

实施日期：2026-10-22

状态：`review / next-batch-open / release-blocked`

本批按 Q2“每批不超过两个小主题”的规则，处理“民法基本原则辨析”和“宪法四章顺序”。6 道既有题保留稳定 ID 并完成题干、干扰项、逐项理由、目标边界和官方核验更新；没有用同义改写增加题量。总量仍为 606 道候选问答、497 个目标、133 个主题组和 129 条记忆资源。

## 1. 题目处置

| 主题 | 题目 | 处置 | 主要变化 |
|---|---|---|---|
| 民法基本原则辨析 | `civil-equality` | 重写 | 用普通买卖关系中的行政级别主张检验主体法律地位平等 |
| 民法基本原则辨析 | `civil-voluntary` | 重写 | 用合法与公序良俗边界内的自主订约检验意思自治 |
| 民法基本原则辨析 | `civil-fairness` | 重写 | 用利益兼顾和履约风险安排检验公平原则 |
| 宪法四章顺序 | `constitution-first` | 重写 | 明确序言单列，定位第一章总纲 |
| 宪法四章顺序 | `constitution-second` | 重写 | 由章名反推第二章，排除第一章和第三章 |
| 宪法四章顺序 | `constitution-fourth` | 重写 | 用跨章近邻干扰完整识别“国旗、国歌、国徽、首都” |

民法三题由“法条原句对应原则名称”改为短情境应用；宪法三题统一改为目录定位，并消除正确项唯一最长和“正文”编辑式措辞。每题仍有 1 道直接检测和同主题 2 道不同判断过程的变式关系。

## 2. 官方依据

- 民法基本原则：中央网信办公布的[《中华人民共和国民法典》总则编](https://www.cac.gov.cn/2020-06/01/c_1592561777268319.htm)，定位第4条、第5条、第6条、第8条；
- 宪法章序：中央人民政府驻香港特别行政区联络办公室公布的[《中华人民共和国宪法》2018年修正文本](https://www.locpg.gov.cn/fzfz/zhrmghgxf/index.htm)，定位目录中的序言、第一至四章以及第四章章名。

两项均于 2026-10-22 重新访问核对。来源核对只证明当前候选内容可追溯，不等于正式内容批准。

## 3. 记忆方式与易混处置

- “民法基本原则辨析”继续登记为 `not-suitable`。平等、自愿、公平需要依据法律含义和题干条件判断，把原则压成关键词会诱发机械套用。本主题使用情境题和“平等、自愿、公平分别看什么”对照；对照资源升至 revision 2 并同步当前法条核验。
- “宪法四章顺序”登记为 `structural-mnemonic-candidate`，产品显示“结构口诀”。记忆句为“一总二权义，三机构，四旗歌徽都。”，每一段可反解到对应章序与章名，且明确只用于2018年修正文本的目录定位。

结构口诀具备可还原关系，但尚未经过用户记忆试验，因此只声明结构记忆价值，不宣称一般人群记得更牢或能提高考试成绩。

## 4. 质量结果

本批 6 道题没有命中题目质量门中的错误或警告规则。所有干扰项均登记具体混淆原因；民法题的检测层级为情境应用，宪法题为结构映射。旧会话迁移已登记，本批题目、宪法记忆资源或民法原则对照出现在未完成会话时，会重建对应队列。

开发入口可以消费本批 `review` 资源；正式环境仍为 0 道可用题。未执行正式准入、上传或发布。

## 5. 验证

```bash
node scripts/build-common-sense-learning.js --check
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
```

结构化结果见 [`common-sense-content-q2-law-2-validation.json`](common-sense-content-q2-law-2-validation.json)，开发者工具结果见 [`common-sense-content-q2-law-2-devtools-validation.json`](common-sense-content-q2-law-2-devtools-validation.json)。法律领域两批既有主题已完成本轮逐题回修；下一批按领域顺序进入科技领域首批两个小主题。
