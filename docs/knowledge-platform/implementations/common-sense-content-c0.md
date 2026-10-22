# 常识内容 C0：盘点、模板与试点目标

日期：2026-10-21。

状态：Implemented，本地检查通过；内容仍为 `review`，未开始 C1a。

本批执行[内容产品方案](common-sense-content-product-plan.md)的 C0，只盘点现有资源、定义建设模板并详细提取两个试点主题的目标。运行题库、生成包、正文、入口、用户进度和页面均未改动。

## 1. 盘点结论

| 资源 | 当前数量 | 保留为候选基础 | 正式化前修订 | 停用 | 正式可用 |
|---|---:|---:|---:|---:|---:|
| 自编学习题 | 45 | 29 | 16 | 0 | 0 |
| 口诀 | 13 | 5 | 8 | 0 | 0 |
| 易混对照 | 4 | 4 | 0 | 0 | 0 |
| 主题组 | 15 | 作为组织范围保留 | C1 后按独立目标重核 | 0 | 0 |

“保留为候选基础”表示结构、来源和边界可以继续进入后续审核，不能理解为事实、教学或发布审核通过。“正式化前修订”表示保留原 ID 与迁移关系，在后续对应批次改写；当前运行内容不因本次盘点改变。

正文完整目录仍为 170 小节、581 页签；本批没有把已涉及的 17 小节/26 页签扩展为全库覆盖，也没有盘点全库原子目标。原三个受限页签继续隔离。

### 1.1 题目处置

保留候选基础的 29 道：

`poet-immortal`、`poet-history`、`sound-pitch`、`sound-loudness`、`sound-timbre`、`fx-direct`、`fx-indirect`、`fx-context`、`school-mo`、`school-fa`、`history-shiji`、`light-refraction`、`heat-convection`、`heat-radiation`、`substance-pure`、`substance-simple`、`demand-wish`、`capacity-under-eight`、`capacity-eight-plus`、`capacity-labor`、`inherit-first`、`inherit-second`、`inherit-inlaw`、`civil-equality`、`civil-voluntary`、`civil-fairness`、`constitution-first`、`constitution-second`、`constitution-fourth`。

正式化前修订的 16 道：

| ID | 核心问题 | 后续处理 |
|---|---|---|
| `poet-sage` | 与相邻题高度重合 | 改为不同问法或对照情境 |
| `school-lao` | 解析中的“创始人”需精确核准 | 核验后改成有依据的表述 |
| `history-tongjian` | 作者、体例混在同一道选项中 | C1b 分别检测体例和范围 |
| `history-hanshu` | 只检测范围，目标却同时包含体例 | C1b 补体例直接检测 |
| `light-shadow` | 有跨领域弱干扰项 | 改为同领域有效干扰 |
| `light-reflection` | 选项不在同一概念层级 | 对照反射与折射 |
| `heat-conduction` | 物态升华是明显异类选项 | 比较三种传热机制 |
| `substance-compound` | 只测示例，未完整测定义 | 增加定义条件检测 |
| `demand-conditions` | 时期、价格条件未进题干 | 把必要条件纳入检测 |
| `supply-conditions` | 时期、价格条件未进题干 | 把必要条件纳入检测 |
| `macro-growth` | 干扰项明显失真 | 改为同层级宏观概念 |
| `macro-jobs-prices` | 依赖口诀措辞 | 改为直接检测目标 |
| `macro-balance` | 干扰项过弱 | 区分国际收支与相近概念 |
| `policy-fiscal` | 干扰项层级不一致 | 比较财政与货币工具 |
| `policy-monetary` | 干扰项层级不一致 | 比较财政与货币工具 |
| `policy-bond-purchase` | 基础机制容易被外推 | 补适用条件与权威依据 |

### 1.2 口诀处置

保留候选基础的 5 条：`poet-memory`、`sound-memory`、`fx-memory`、`history-genres-memory`、`macro-four-goals-memory`。

正式化前修订的 8 条：

| ID | 核心问题 |
|---|---|
| `schools-pairing-memory` | “老子道”不容易准确还原，可能产生歧义 |
| `light-phenomena-memory` | “影子直”没有直接表达直线传播 |
| `heat-mechanisms-memory` | “沿物传”可能误导传导只发生在固体或单一物体内 |
| `substance-classification-memory` | “数物质”“一元/多元”容易混淆分类维度 |
| `demand-supply-roles-memory` | “才入门”没有知识含义，遗漏时期和价格条件 |
| `fiscal-monetary-memory` | 公开买债的基础机制需保留适用边界 |
| `inheritance-order-memory` | 一般顺序与附条件例外压在一个长句中 |
| `constitution-chapters-memory` | “权义”“旗歌徽都”需额外解码，降低可还原性 |

现有两组“不适合口诀”的主题决定继续保留：未成年人行为能力需要年龄、辨认能力和收入条件；平等、自愿、公平适合按边界对照。C0 不为覆盖数量强行补口诀。

### 1.3 易混对照处置

`minor-capacity-comparison`、`civil-principles-comparison`、`sound-features-comparison`、`history-genres-comparison` 四组均保留候选基础。它们已有比较维度、条件、排除范围和三题流程；法律组仍须以当前有效法源完成正式内容审核，声音和史书两组进入试点复核。

## 2. 试点目标清单

C0 把两个试点主题拆成 9 个独立目标：声音 3 个，史书 6 个。原题目保持不变，下面只建立 C1 的迁移目标。

### 2.1 声音三特性

| 新目标 ID | 用户应能做到 | 条件/边界 | 现有资源 |
|---|---|---|---|
| `cs-target-sound-pitch-frequency` | 把音调高低与振动频率对应 | 不把高音当成大声；不扩到超声、次声 | `sound-pitch`；口诀第 1 句；声音对照 |
| `cs-target-sound-loudness-amplitude` | 在其他条件相同时把响度与振幅对应 | 距离等条件相同；振幅不是实际听感唯一因素 | `sound-loudness`；口诀第 2 句；声音对照 |
| `cs-target-sound-timbre-identification` | 在辨认不同声音特点时选择音色 | 不表示音调、响度永远相同 | `sound-timbre`；口诀第 3 句；声音对照 |

三项都已有直接题。C1b 还需补不同问法或情境检测；响度目标优先补条件边界题。

### 2.2 三部史书的体例与范围

纪传体/编年体回答“怎样叙述”，通史/断代史回答“记述范围”。因此每本书拆成两个目标：

| 新目标 ID | 结论 | 现有资源 | C1b 缺口 |
|---|---|---|---|
| `cs-target-history-shiji-genre` | 《史记》为纪传体 | `history-shiji`、口诀第 1 句、史书对照 | 现题联合检测，补单维度或交叉对照 |
| `cs-target-history-shiji-scope` | 《史记》为通史 | 同上 | 同上 |
| `cs-target-history-tongjian-genre` | 《资治通鉴》为编年体 | `history-tongjian`、口诀第 2 句、史书对照 | 去除作者提示，直接检验体例 |
| `cs-target-history-tongjian-scope` | 《资治通鉴》为通史 | 同上 | 补记述范围的独立检测 |
| `cs-target-history-hanshu-genre` | 《汉书》为纪传体 | `history-hanshu`、口诀第 3 句、史书对照 | 现题未直接检测，必须补题 |
| `cs-target-history-hanshu-scope` | 《汉书》为断代史 | 同上 | 保留现题基础并补交叉对照 |

史书试点继续排除作者生平、成书过程、篇目、具体年代以及全部史书体例。C0 不新增这些目标。

## 3. C1 使用的内容模板

机器可读模板和完整逐项理由登记在 [C0 台账](../content/common-sense-content-c0.js)。核心字段如下：

| 对象 | 必填信息 |
|---|---|
| 知识目标 | ID/版本、领域/主题、可检验描述、结论、条件、排除范围、来源、状态 |
| 题目 | ID/版本、题干/选项/答案/解析、干扰项理由、主要/辅助目标、检测用途、来源、类型、状态 |
| 口诀 | 目的、全文、记法、覆盖、条件、排除范围、带 ID 的句子、自测题、来源、状态 |
| 口诀句子 | 句子 ID、释义、目标、覆盖类型、条件、题目、答错回看位置 |
| 易混对照 | 混淆理由、维度、条件、区别、目标、初判和复辨题、来源 |
| 急救专题 | 目的、范围、目标、回看材料、题目、入选理由、排除范围 |

关系要求：题目明确主要与辅助目标；口诀句子直接映射目标，再显式选自测题；答错回看对应句、解释或条件；易混行映射目标和共同比较维度。阅读、答题和目标检测继续作为不同事实。

## 4. 缺口及进入下一批的条件

| 缺口 | 后续批次 |
|---|---|
| 旧数据中的目标仍依附题目 ID | C1a 接入独立目标与兼容关系 |
| 两试点尚缺有效变式和部分直接检测 | C1b 编写、核验和页面消费 |
| 两条试点口诀尚未按新句子 ID 迁移 | C2 实施 |
| 两组对照仍复用原三道题 | C3 评估并补不同问法复辨 |
| 其他 13 个主题仍未拆成独立目标 | C5-n 小批扩建，不在 C1 自动纳入 |
| 全库其余小节未盘点原子目标 | 继续保留目录缺口，不输出全库目标覆盖率 |

下一批为 C1a，只实现两个试点主题的独立目标模型、关系校验和旧记录兼容。C1a 不写新题、不改口诀、不进入 C1b。

## 5. 验证与边界

- `node scripts/validate-common-sense-content-c0.js`：60 项通过，确认 45 题、13 口诀、4 对照逐项覆盖，9 个试点目标关系有效，170 小节目录和 3 个受限页签未漂移。
- 原内容构建检查通过：45 问答、13 口诀、4 对照，全部仍为候选。
- 正文数量检查通过：170 小节，文史 38、科技 36、经济 40、法律 56。
- C0 台账所有决策 `formalReady=false`；没有内容批准、运行包改写、用户记录迁移、真机验收、提交、上传或发布。

完整计数、哈希和执行边界见 [C0 验证记录](common-sense-content-c0-validation.json)。

本批到此停止。
