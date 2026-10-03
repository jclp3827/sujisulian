# 政治理论两篇源料覆盖与 37 篇终审基线

> 2026-10-03 基线；2026-10-04 当前 37 篇内容终审已完成，逐篇结论与证据见[37篇终审记录](./politics-p3-v2-content-final-review-20261004.md)。下方表格及“待审”文字保留为终审前工作基线。政治仍为 `candidate`，37 篇保持 `review/pending_final`，`release=0`；内容完成不自动授予生命周期晋级或发布资格。

## 范围结论

- 当前正式源是 [72 页《政治理论》PDF](../../../政治理论/政治理论.pdf)，SHA-256 与目录审计记录一致：`437d11b5402ec46944f452692e0562e57793d556ba5e085df064287d8adc8b7b`。PDF 第 4–72 页都映射到至少一篇知识单元；第 1–2 页为目录，第 3 页为“第一部分 政治理论”分隔页。
- 37 篇分为《习近平新时代中国特色社会主义思想》19 篇、《马克思主义基本原理》18 篇。后者为马原概述、哲学 12 篇、政治经济学 5 篇；科学社会主义只有概述提及，没有独立详细知识单元。
- 这里的“覆盖”只表示**这两篇源料的页面映射完整**，不等于政治理论课程完整或考公政治范围完整。2026 年[中央机关公共科目笔试大纲](https://www.xunwu.gov.cn/xwxxxgk/xwrs721/202510/76b534c0ebaf46cca71e45086a6cb562.shtml)把政治理论描述为对党的创新理论及党和国家方针政策的学习理解掌握，并未给出能直接逐篇勾选的固定知识细目。以国考大纲作参照是本轮推断；省考和具体目标范围仍需另定。
- 本轮按用户已确认的产品边界，先审这 37 篇的**理论学习内容**。应用判断题、时政更新和完整考试覆盖是后续能力或内容扩展，不列为 37 篇逐篇终审的完成条件；对外也不能把当前两篇称为完整政治模块。
- 课程完整性后续可参照教育部公布的[《习近平新时代中国特色社会主义思想概论》教材结构](https://www.moe.gov.cn/jyb_xwfb/xw_zt/moe_357/2023/2023_zt04/yw/202308/t20230829_1076631.html)及[马工程教材目录](https://www.moe.gov.cn/jyb_xxgk/xxgk/neirong/fenlei/kcjc/kcjc_gl/jcgl_mgcj/202309/t20230925_1082602.html)建立主题矩阵。前者有导论、17章主体与结语，后者列出《马克思主义基本原理（2023年版）》和《科学社会主义概论（第二版）》；这些是权威教材的书目和结构线索，不是当前 37 篇的直接逐句审定依据，也不能用章节数量简单推算缺口。

## 后续课程覆盖对照（不作为本轮终审门槛）

对照[高等教育出版社公开的《马克思主义基本原理（2023年版）》目录](https://www.hep.com.cn/mgcjiaocai/show/9c8e531b-7fa4-4c90-88cd-790f4c36a96b)，当前 PDF 的 18 篇马原知识仅能映射到下列部分主题。此表是**目录级差距定位**，不能推导每章考试权重，也不能要求这次 37 篇按另一教材逐句改写。

| 教材目录区域 | 当前 PDF 对应 | 覆盖判断 |
|---|---|---|
| 导论 | `u020` 马克思主义概述 | 部分主题有对应，未做章节细目逐一证明 |
| 第一章 世界的物质性及发展规律 | `u021–u026` 哲学基本问题、物质意识、唯物辩证法三规律 | 部分对应，尚未覆盖公开目录中的全部节题 |
| 第二章 实践与认识及其发展规律 | `u027–u029` 实践、认识、真理 | 部分对应 |
| 第三章 人类社会及其发展规律 | `u030–u032` 社会存在、基本规律、人民群众 | 部分对应 |
| 第四章 资本主义的本质及规律 | `u033–u037` 商品、劳动、价值量、货币、剩余价值 | 只覆盖部分政治经济学起点，不能称整章完整 |
| 第五章 资本主义的发展及其趋势 | 无独立单元 | 当前 PDF 缺口；后续来源与范围决策 |
| 第六章 社会主义的发展及其规律 | 无独立单元 | 当前 PDF 缺口；后续来源与范围决策 |
| 第七章 共产主义崇高理想及其最终实现 | 无独立单元 | 当前 PDF 缺口；后续来源与范围决策 |

## 审核口径与当前缺口

> 2026-10-03 用户确认：这 37 篇以当前 PDF 为最终内容依据；公开官方材料用于发现和处理明确冲突，公开教材目录只用于后续课程覆盖比较，不是逐篇终审的强制第二来源。
> 2026-10-04 用户确认：37 篇逐篇终审通过后，标记为“现阶段内容完成”；后续内容扩展与发布步骤等待用户另行指令。

| 层次 | 本轮要核对的事实 | 当前状态与下一动作 |
|---|---|---|
| 来源忠实度 | 目录边界、PDF 页间续接、原文固定表述、条件、否定词、图框和表格与正式 Markdown 一致 | 37 篇均有源页及源 hash，尚无逐篇最终校对记录；按下表执行 |
| 来源优先级 | 用户确认本轮 37 篇以所提供 PDF 为最终内容来源；有可核实的现行官方文件明确冲突时，以官方表述修正并记录差异 | 无其他官方材料时可据 PDF 完成内容校对，不因缺少教材全文停审；冲突项保存 PDF 原文、官方依据及校对日期 |
| 学习投影 | 摘要、完整卡、回忆答案、易混边界、关系理由引用同一经校对知识 | 已有自动结构门禁，终审仍须复核关键投影，修改后重建 review 包并回归 |
| 课程覆盖 | 两篇源料之外的知识是否补入 | 单列后续内容扩展：科学社会主义独立详细内容、政治经济学与新时代思想的目标范围完整性、其他考公政治内容；不在本轮直接编造或桥接 |
| 发布 | 内容通过、风险关闭、候选验收与审批 | 37 篇 `pending_final`；11 个知识内容风险页待专项校对；S6 与 `release` 仍不改变 |

## 风险页口径

高保真解析器标出 PDF 第 3、4、7、15、16、17、20、21、36、49、57、70 页，共 12 页。第 3 页是分隔图页，不属于知识单元；其余 **11 页涉及 10 篇知识单元**。已目视核对第 3、4 页以及 10 个原标为 `table-layout-review` 的页面：第 70 页确有五项货币职能的对照表；第 7、15、16、17、20、21、36、49、57 页主要是灰底知识延伸或练习框，自动表格标记需按具体图框校对。图框与真实表格不得一律按普通段落处理。

专项顺序：`u001`（第 4 页插图/练习归属）、`u002/u003`（第 7 页跨单元边界）、`u005`（第 15 页制度体系列表）、`u006`（第 16–17 页共同富裕与收入分配）、`u007`（第 20–21 页基本经济制度和生产要素）、`u014`（第 36 页党性党风党纪）、`u022`（第 49 页人工智能图框）、`u027`（第 57 页实践与认识图框）、`u036`（第 70 页五项职能表）。每篇校对后记录页码、差异、处理方式及依据；不得因“看过风险页”直接改为 `approved`。

## 逐篇终审清单

说明：页码均为 PDF 实际页；“风险页”为空表示没有版面专项标记，仍须核对固定表述、来源和学习投影。下表只是任务清单，所有篇目的最终结论当前仍为待审。

| ID | 篇目 | PDF 页 | 风险页 | 当前状态 |
|---|---|---:|---|---|
| u001 | [习近平新时代中国特色社会主义的核心要义](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u001-习近平新时代中国特色社会主义的核心要义.md) | 4–6 | 4 | `review/pending_final` |
| u002 | [习近平新时代中国特色社会主义思想是“两个结合”的重大成果](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u002-习近平新时代中国特色社会主义思想是-两个结合-的重大成果.md) | 6–7 | 7 | `review/pending_final` |
| u003 | [习近平新时代中国特色社会主义思想的科学体系](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u003-习近平新时代中国特色社会主义思想的科学体系.md) | 7–10 | 7 | `review/pending_final` |
| u004 | [以中国式现代化全面推进中华民族伟大复兴](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u004-以中国式现代化全面推进中华民族伟大复兴.md) | 10–13 | — | `review/pending_final` |
| u005 | [第一节 党的全面领导](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u005-第一节-党的全面领导.md) | 14–15 | 15 | `review/pending_final` |
| u006 | [第二节 以人民为中心](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u006-第二节-以人民为中心.md) | 16–17 | 16,17 | `review/pending_final` |
| u007 | [第三节 推动高质量发展](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u007-第三节-推动高质量发展.md) | 18–24 | 20,21 | `review/pending_final` |
| u008 | [第四节 发展全过程人民民主](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u008-第四节-发展全过程人民民主.md) | 24–27 | — | `review/pending_final` |
| u009 | [第五节 建设社会主义文化强国](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u009-第五节-建设社会主义文化强国.md) | 27–28 | — | `review/pending_final` |
| u010 | [第六节 保障和改善民生](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u010-第六节-保障和改善民生.md) | 28–30 | — | `review/pending_final` |
| u011 | [第七节 社会主义生态文明](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u011-第七节-社会主义生态文明.md) | 30–31 | — | `review/pending_final` |
| u012 | [第八节 全面深化改革](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u012-第八节-全面深化改革.md) | 31–33 | — | `review/pending_final` |
| u013 | [第九节 全面依法治国](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u013-第九节-全面依法治国.md) | 33–35 | — | `review/pending_final` |
| u014 | [第十节 全面从严治党](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u014-第十节-全面从严治党.md) | 35–37 | 36 | `review/pending_final` |
| u015 | [第十一节 社会主义现代化建设的教育、科技、人才战略](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u015-第十一节-社会主义现代化建设的教育-科技-人才战略.md) | 38–39 | — | `review/pending_final` |
| u016 | [第十二节 总体国家安全观](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u016-第十二节-总体国家安全观.md) | 40–41 | — | `review/pending_final` |
| u017 | [第十三节 巩固国防和强大人民军队](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u017-第十三节-巩固国防和强大人民军队.md) | 41–42 | — | `review/pending_final` |
| u018 | [第十四节 坚持“一国两制”和推进祖国完全统一](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u018-第十四节-坚持-一国两制-和推进祖国完全统一.md) | 42–43 | — | `review/pending_final` |
| u019 | [第十五节 中国特色大国外交](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u019-第十五节-中国特色大国外交.md) | 44–45 | — | `review/pending_final` |
| u020 | [马克思主义概述](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u020-马克思主义概述.md) | 46–47 | — | `review/pending_final` |
| u021 | [两大哲学派别](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u021-两大哲学派别.md) | 47–48 | — | `review/pending_final` |
| u022 | [物质与意识](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u022-物质与意识.md) | 48–49 | 49 | `review/pending_final` |
| u023 | [唯物辩证法的总特征](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u023-唯物辩证法的总特征.md) | 50–51 | — | `review/pending_final` |
| u024 | [对立统一规律](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u024-对立统一规律.md) | 51–53 | — | `review/pending_final` |
| u025 | [量变质变规律](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u025-量变质变规律.md) | 54–55 | — | `review/pending_final` |
| u026 | [否定之否定规律](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u026-否定之否定规律.md) | 55–56 | — | `review/pending_final` |
| u027 | [实践与认识](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u027-实践与认识.md) | 56–58 | 57 | `review/pending_final` |
| u028 | [认识的辩证过程](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u028-认识的辩证过程.md) | 58–59 | — | `review/pending_final` |
| u029 | [真理](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u029-真理.md) | 59–60 | — | `review/pending_final` |
| u030 | [社会存在与社会意识](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u030-社会存在与社会意识.md) | 60–62 | — | `review/pending_final` |
| u031 | [社会发展的基本规律](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u031-社会发展的基本规律.md) | 62–64 | — | `review/pending_final` |
| u032 | [人民群众在历史发展中的作用](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u032-人民群众在历史发展中的作用.md) | 65–66 | — | `review/pending_final` |
| u033 | [商品及其二因素](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u033-商品及其二因素.md) | 66–67 | — | `review/pending_final` |
| u034 | [劳动二重性](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u034-劳动二重性.md) | 67–68 | — | `review/pending_final` |
| u035 | [商品的价值量](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u035-商品的价值量.md) | 68–69 | — | `review/pending_final` |
| u036 | [货币本质和职能](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u036-货币本质和职能.md) | 70–71 | 70 | `review/pending_final` |
| u037 | [剩余价值理论](../../knowledge-pilot/knowledge/politics-v2/politics-toc-v2-u037-剩余价值理论.md) | 71–72 | — | `review/pending_final` |

## 首轮可核实的结构修复（未通过终审）

2026-10-03 对照 PDF 风险页和 37 篇全文扫描，已在 24 篇修复 81 处标题、图框标签或表格行名的拼接问题。其中第 70 页货币职能表的五个行名已回到原有 `b005/b007/b009/b011/b013` 知识块；第 15 页“党的领导制度体系”由连写恢复为六项可辨认内容。[81 项逐块结构修订记录](../../knowledge-pilot/political-content-structural-corrections-20261003.json)保存修订前后文本、块 ID、源页及来源 hash。受改篇目的内容版本已递增，最高 v6；所有既有块 ID、来源页、`review/pending_final` 与 `release=0` 均未晋级。

对现行官方表述的首批核对还修正 2 处：`u006:b017` 的 2035 年共同富裕目标改用“更为明显的实质性进展”，依据[党的二十大报告](https://www.idcpc.gov.cn/ztwy/tbtj/20thCPC/zywj/202211/t20221102_150400.html)及[国家发展改革委说明](https://www.ndrc.gov.cn/fggz/jyysr/jysrsbxf/202202/t20220223_1316644.html)；`u011:b009` 补回双碳目标中的“力争”“努力争取”，依据[国家发展改革委官方解读](https://www.ndrc.gov.cn/xxgk/jd/jd/202110/t20211027_1301251.html)。[逐项来源差异与修订记录](../../knowledge-pilot/political-current-authority-corrections-20261003.json)保留 PDF 原句、展示修订和依据。此处只校验这 2 个具体陈述，不能推广成整篇现行性已通过。

另对 `u004:b014–b015` 的现代化战略阶段与部分 2035 年目标、`u017:b004–b006` 的国防和军队现代化时间序列作[官方来源抽样核对](../../knowledge-pilot/political-official-spotchecks-20261003.json)，分别对照[国家发展改革委刊载的重要论述](https://www.ndrc.gov.cn/xwdt/ztzl/NEW_srxxgcjjpjjsx/jjsxyjqk/zyjh/dt/202406/t20240613_1386867.html)、[国防部刊载的中央决议](https://www.mod.gov.cn/gfbw/qwfb/4899045.html)及[“十五五”规划纲要](https://www.moe.gov.cn/jyb_xwfb/xw_zt/moe_357/2026/2026_zt03/yw/202603/t20260314_1430877.html)。所列时间序列未发现需要改写之处；`u004` 目标枚举全量及两篇其余陈述仍待终审。

第 70 页货币职能专项还发现 `u036` 的速记提问误称“五项基本职能”；正文其实明确五种职能中只有价值尺度和流通手段属于两个最基本职能。另发现 `u009`、`u010` 的摘要或回忆答案超出各自 PDF 正文展开范围，现已回归同篇完整正文可支持的内容。三篇修订均见[学习投影修订记录](../../knowledge-pilot/political-learning-projection-corrections-20261003.json)。

隔离 review 包已重建为 `review-79293bfc6c40`。结构门禁通过只证明可构建，不能替代逐篇内容终审。

仍待：其余正文与 PDF 的逐页完整校对、摘要/回忆/关系的语义复核、每篇差异记录；发现官方材料与 PDF 冲突时逐项处理。对照表恢复为带标签的连续知识块，后续还需在小程序完整卡中确认可读性。

## 逐篇通过条件

1. 以 PDF 页图、第二轮源文、正式 Markdown 三方核对正文范围；练习题若排除，记录其知识结论是否已由正文保留。
2. 图框、对照表与图片的标签、顺序、配对和条件在完整卡中可读；不能仅保留单元格正文而丢失行名。
3. 以 PDF 核对政治固定表述、年份和政策陈述；对已发现的官方材料冲突保留原句、修订与依据。无独立公开文章本身不阻断这一批内容终审。
4. 摘要、回忆答案、易错提示、5 组正式易混对照及相关关系理由与经校对正文一致；任何修订均保持稳定块 ID 规则并重建 review 包。
5. 每篇留校对记录：PDF 页与块 ID、差异、原文、修订文本、证据、校对日期、处理结果。自动门禁只证明结构闭合，不代替内容审核或发布审批。

## 本轮工程核对

- 37 篇源页映射、源 PDF SHA-256、37 份正式 Markdown 的 `review/pending_final` 与来源 hash 均闭合；正式内容校验、review 构建校验、候选及展示校验通过。J2 v2 和 J3–J5 纵向门禁各为 2/2。 对 37 篇的考点精析/知识延伸正文执行了规范化长句连贯性预筛查，[规范化源句预筛查](../../knowledge-pilot/political-source-sentence-prescreen-20261003.json)覆盖 37 篇“考点精析”正文的 558 个不少于 12 字源句；剥除块 ID 等 Markdown 标记后，最长连续匹配低于 70% 的 3 句均来自上述 2 条有据官方表述校正，未发现未解释的低匹配整句。该筛查不证明事实正确、图表完整或逐页终审完成。
- 2026-10-04 Vision OCR 在普通 macOS 环境以 `--ocr all` 完成同一 PDF 的 72/72 页识别；[全页质量报告](../../knowledge-pilot/political-source-quality-vision-ocr-20261004.md)记录 29 页平均置信度低于 0.75。OCR 是独立核查证据，尚未据此审定任何一篇，也未改写正式 Markdown。
- 微信开发者工具对 d974 工作树编译成功，代码/WXML 错误 0、警告 0；总包 3,015,587 字节，政治分包 151,368 字节。运行包仍为 37 篇 review、0 approved/release。
- 上述自动结果和版面检查不授予任何一篇内容的最终审核通过；当前二维码早于本次内容修订，新文字的真机体验未做用户验收。

## 阶段门禁

- 先完成 10 篇风险单元的源页专项核对，再完成其余 27 篇的逐篇终审；同类版面错误须回查全批。
- 只有逐篇审稿、PDF 忠实度及已发现的官方冲突处理闭合后，才考虑把单元从 `review/pending_final` 晋级；状态晋级与内容发布依照 03/04 契约单独执行。
- 本清单不决定 S6 的候选范围。现有政治 profile 写明覆盖缺口阻塞 S6；下一次门禁讨论须明确“限定两篇候选验收”和“完整范围发布”各自的资格，不能暗中把其中一项当成另一项。
