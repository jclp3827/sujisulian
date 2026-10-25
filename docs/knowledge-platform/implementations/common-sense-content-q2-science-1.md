# 常识内容 Q2 科技第一批：声音三特性与三类光现象

实施日期：2026-10-22

状态：review / next-batch-open / release-blocked

本批按 Q2“每批不超过两个小主题”的规则，处理“声音的三种特性”和“影子、倒影与折筷”。8 道既有题保留稳定 ID，完成题干、干扰项、逐项理由、目标边界和变式过程更新；没有通过同义改写增加题量。总量仍为 606 道候选问答、497 个目标、133 个主题组和 129 条记忆资源。

## 1. 题目处置

| 主题 | 题量 | 处置 | 主要变化 |
|---|---:|---|---|
| 声音的三种特性 | 5 | 重写 | 用频率变化、控制变量和同音调同响度辨乐器等情境，区分音调、响度、音色 |
| 影子、倒影与折筷 | 3 | 重写 | 用遮挡、水面返回原介质、跨水和空气偏折三个情境区分直线传播、反射、折射 |

所有正确项与错误项使用相近表达强度，消除了正确项唯一最长、绝对化弱干扰和“正文”等编辑语言。声音组三个目标均保留直接检测和不同判断过程的变式；光现象组通过三个相邻机制互相排除，记录每个直接情境与组内辨析的过程差异。

## 2. 内容依据

本批使用常识正文中已经通过来源恢复审计的两个源单元：

- 声学 · 声音的特性：音调与频率、响度与振幅、音色与声音特点的基础对应关系；
- 光学 · 光的传播：同种均匀介质中的直线传播、分界面反射、跨透明介质折射及对应现象。

这些基础物理关系没有法律时效或近期版本风险。本批没有用外部题库补题，也没有把搜索材料直接搬入产品；来源定位继续由现有正文指纹和源单元 ID 管理。

## 3. 记忆方式处置

- 声音三特性登记为 structural-mnemonic-candidate，产品显示“结构口诀”。记忆句为“调高低，看频率；响强弱，看振幅；辨来源，看音色。”三句使用同一结构，把题目维度和对应量成对编码，并保留响度比较的控制条件。
- 三类光现象登记为 retain-as-study-outline，产品显示“速记提纲”。内容改为“影子看直线，倒影看反射，折筷看折射。”它能快速回看，但仍是现象名与机制名的直接对应，缺少独立联想机制，因此不包装成口诀。

两项均没有用户记忆试验数据。本批只判断内容结构和可还原性，不宣称一般人群记忆提升或考试提分。

## 4. 质量结果

本批 8 道题没有命中题目质量门中的错误或警告规则。每个干扰项都有具体的条件或机制解释；声音题覆盖应用与条件判断，光现象题覆盖生活情境中的机制应用。

开发入口可以消费本批 review 资源；正式环境仍为 0 道可用题。会话迁移覆盖本批 8 题及两条记忆资源。未执行正式准入、设备 UX 接受、上传或发布。

## 5. 验证

执行范围：

    node scripts/build-common-sense-learning.js --check
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

结构化结果见 common-sense-content-q2-science-1-validation.json，开发者工具结果见 common-sense-content-q2-science-1-devtools-validation.json。下一批处理科技领域“传热三种方式”和“物质分类”。
