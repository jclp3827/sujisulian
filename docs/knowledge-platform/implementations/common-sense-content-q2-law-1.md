# 常识内容 Q2 法律第一批：行为能力与法定继承

实施日期：2026-10-22

状态：`review / next-batch-open / release-blocked`

本批按 Q2“每批不超过两个小主题”的规则，复核并重写“未成年人行为能力三例”和“法定继承顺序与例外”。没有为了增加数量新增重复题；6 道既有题保留稳定 ID，题干、干扰项、逐项理由、目标边界和官方核验信息升至新版。总量仍为 606 道候选问答、497 个目标、133 个主题组和 129 条记忆资源。

## 1. 题目处置

| 主题 | 题目 | 处置 | 主要变化 |
|---|---|---|---|
| 未成年人行为能力 | `capacity-under-eight` | 重写 | 明确只按年龄判断，并区分民事行为能力与民事权利能力 |
| 未成年人行为能力 | `capacity-eight-plus` | 重写 | 用10周岁情境同时排除不满八周岁规则和劳动收入例外 |
| 未成年人行为能力 | `capacity-labor` | 重写 | 删除“只能、绝无例外”式弱干扰项，区分“视为完全民事行为能力人”与年龄上成年 |
| 法定继承顺序 | `inherit-first` | 重写 | 从长短明显的清单选择改为第一顺序法律类别辨认 |
| 法定继承顺序 | `inherit-second` | 重写 | 从正确项唯一最长改为第二顺序法律类别辨认，并保留第一顺序优先边界 |
| 法定继承顺序 | `inherit-inlaw` | 重写 | 用第一顺序、第二顺序和继承人以外酌分规则形成真实法律近邻干扰 |

每题均保留 1 道直接检测和同主题 2 道不同条件或规则的变式关系。干扰项理由解释具体缺失条件或混淆规则，不用“明显错误”的常识项凑数。

## 2. 官方依据

- 行为能力：中央网信办公布的[《中华人民共和国民法典》总则编](https://www.cac.gov.cn/2020-06/01/c_1592561777268319.htm)，定位第13条、第17—20条；
- 法定继承：中央网信办公布的[《中华人民共和国民法典》继承编](https://www.cac.gov.cn/2020-06/01/c_15925617772683195.htm)，定位第1127条、第1129条。

两项均于 2026-10-22 重新访问核对。题目状态继续为 `review`，来源核对不等于正式内容批准。

## 3. 记忆方式处置

- “未成年人行为能力”登记为 `not-suitable`。判断要同时保留年龄、辨认能力、劳动收入主要生活来源和具体行为效力，压成数字口诀容易丢失条件，继续使用三例辨析和易混对照。
- “法定继承顺序与例外”登记为 `retain-as-study-outline`。现有“一顺配子父、二顺兄祖外祖……”主要是法律原词分组压缩，能够快速回看，但没有独立联想机制和用户记忆增益证据，因此产品上继续显示“速记提纲”，不标成已验证口诀。

这两项处置遵守“适合才建口诀”的规则，避免用关键词抽离冒充记忆能力建设。

## 4. 质量结果

6 道题没有命中错误级质量规则。`capacity-under-eight`、`capacity-eight-plus` 的错误选项包含法定类别“完全民事行为能力人”，因词面“完全”触发 `QG-ABSOLUTE-001` 警告；人工复核确认这是必须保留的法定术语，不是借极端措辞暗示答案，已作为规则例外留痕。

学习入口继续使用这 6 道 `review` 题；正式环境仍为 0 道可用题。会话迁移已登记，旧版本中涉及本批题目或继承提纲的会话会按既有机制重建，不把新旧题面混在同一未完成队列。

## 5. 验证

```bash
node scripts/build-common-sense-learning.js --check
node scripts/validate-common-sense-content-q2-law-1.js
node scripts/validate-common-sense-content-q1.js
node scripts/validate-common-sense-content-q0b.js
node scripts/validate-common-sense-content-c5-60.js
node scripts/validate-common-sense-learning.js
python3 scripts/validate-common-sense-learning-compile.py
/Users/jmac/.local/share/uv/tools/wechat-devtools-mcp/bin/python scripts/validate-common-sense-learning-devtools.py --port 9421
```

结构化结果见 [`common-sense-content-q2-law-1-validation.json`](common-sense-content-q2-law-1-validation.json)，120 项开发者工具回归见 [`common-sense-content-q2-law-1-devtools-validation.json`](common-sense-content-q2-law-1-devtools-validation.json)。下一批按路线处理法律领域“民法基本原则辨析”和“宪法正文篇章”。
