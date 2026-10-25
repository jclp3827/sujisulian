const PENDING_REVIEW = Object.freeze({
  admission: "expansion-candidate",
  sourceFidelity: "self-reviewed",
  noviceReadability: "pending-user-sampling",
  independentFactReview: "pending-independent-review",
});

const card = (id, title, explanation, productionMode, learningGoal, sourceUnitIds, sourceEvidence) => ({
  id, title, explanation, productionMode, learningGoal, sourceUnitIds, sourceEvidence,
  semanticRevision: 1,
  review: PENDING_REVIEW,
});

module.exports = {
  schemaVersion: 1,
  id: "common-sense-guide-expansion-batch-8",
  title: "知识导读扩库第 8 批：中国古代生活",
  status: "candidate",
  purpose: "整理传统节日、教育、织锦刺绣和饮食中的稳定事实，将起源传说、世界第一、争议名单与错误烹饪定义转入 HOLD。",
  groups: [
    {
      pointId: "daily-life-language",
      overview: "中国古代生活常识包括传统节日、教育制度、织锦刺绣和饮食文化。知识卡分别说明日期习俗、诗句对应、学校课程、地域工艺和菜茶宴席。",
      relation: "classification",
      cards: [
        card("spring-festival", "春节的日期、别称与习俗", "春节在农历正月初一，古时又称元日、元旦等。常见习俗包括拜年、放爆竹、贴年红、舞龙舞狮和走亲访友。", "light-edit", "说明春节的日期、古代别称和主要习俗。", ["cs-10-15-p19-festival-table"], ["春节为正月初一，古时又名元日、元旦，习俗有拜年、放爆竹、贴年红等。"]),
        card("lantern-festival", "元宵节的日期、别称与习俗", "元宵节在农历正月十五，又称元夕、上元、灯节、元夜等。常见习俗包括赏花灯、闹年鼓和猜灯谜。", "reuse", "说明元宵节的日期、别称和主要习俗。", ["cs-10-15-p19-festival-table"], ["元宵节为正月十五，又名元夕、上元、灯节、元夜，习俗有赏花灯、猜灯谜等。"]),
        card("qingming-festival", "清明节的时间与习俗", "清明节通常在公历4月5日前后，又称踏青节。常见活动包括扫墓、踏青、插柳、荡秋千、蹴鞠和放风筝。", "light-edit", "说明清明节的大致日期、别称和主要习俗。", ["cs-10-15-p19-festival-table"], ["清明节在4月5日前后，又称踏青节，习俗有扫墓踏青、插柳、放风筝等。"]),
        card("cold-food-festival", "寒食节的时间与习俗", "寒食节在清明前一至二日，传统习俗包括禁火和食用冷食。由于与清明日期接近，两节的部分习俗后来逐渐融合。", "synthesized", "说明寒食节与清明节的时间关系和主要习俗。", ["cs-10-15-p19-festival-table"], ["寒食节在清明前一、二日，习俗有禁火、吃寒食，并与清明部分习俗融合。"]),
        card("dragon-boat-festival", "端午节的日期与习俗", "端午节在农历五月初五，常见习俗包括赛龙舟、吃粽子、挂艾叶、驱五毒和饮雄黄酒。", "reuse", "说明端午节的日期和主要习俗。", ["cs-10-15-p19-festival-table"], ["端午节为五月初五，习俗有挂艾叶、驱五毒、赛龙舟、吃粽子、饮雄黄酒。"]),
        card("double-ninth-festival", "重阳节的日期与习俗", "重阳节在农历九月初九，又称老人节。常见习俗包括登高、插茱萸、饮菊花酒、吃重阳糕和赏菊。", "reuse", "说明重阳节的日期、别称和主要习俗。", ["cs-10-15-p19-festival-table"], ["重阳节为九月九日，又名老人节，习俗有登高、插茱萸、饮菊花酒等。"]),
        card("four-major-festivals", "四大传统节日", "正文列出的四大传统节日是春节、清明节、端午节和中秋节。元宵、寒食、重阳等也是传统节日，但不在这组四项中。", "synthesized", "准确说出正文列举的四大传统节日。", ["cs-10-15-p19-festival-table"], ["四大节日为春节、清明节、端午节和中秋节。"]),

        card("new-years-eve-poem", "除夕诗句《除夜有怀》", "“守岁家家应未卧，相思那得梦魂来”出自唐代孟浩然《除夜有怀》，诗句中的守岁点明除夕夜。", "reuse", "识别除夕诗句、作者、时代和作品。", ["cs-10-15-p19-p20-festival-poetry-table"], ["除夕诗句守岁家家应未卧，相思那得梦魂来，作者孟浩然，作品《除夜有怀》。"]),
        card("spring-festival-poem", "春节诗句《元日》", "“爆竹声中一岁除，春风送暖入屠苏”出自宋代王安石《元日》，爆竹和岁除体现春节辞旧迎新。", "reuse", "识别春节诗句、作者、时代和作品。", ["cs-10-15-p19-p20-festival-poetry-table"], ["春节诗句爆竹声中一岁除，春风送暖入屠苏，作者王安石，作品《元日》。"]),
        card("lantern-poems", "元宵节的两组名句", "“月上柳梢头，人约黄昏后”出自欧阳修《生查子·元夕》；“众里寻他千百度”出自辛弃疾《青玉案·元夕》。", "light-edit", "区分两组元宵名句的作者和作品。", ["cs-10-15-p19-p20-festival-poetry-table"], ["元宵诗句分别见欧阳修《生查子·元夕》和辛弃疾《青玉案·元夕》。"]),
        card("qingming-coldfood-poems", "清明与寒食诗句", "“清明时节雨纷纷”出自唐代杜牧《清明》；“日暮汉宫传蜡烛”出自唐代韩翃《寒食》。两句对应相近但不同的节日。", "synthesized", "区分清明和寒食诗句的作者与作品。", ["cs-10-15-p19-p20-festival-poetry-table"], ["杜牧《清明》有清明时节雨纷纷；韩翃《寒食》有日暮汉宫传蜡烛。"]),
        card("dragon-boat-poems", "端午诗句中的粽子", "“角黍包金，香蒲切玉”出自黄裳《喜迁莺·端午泛湖》；“五色新丝缠角粽”出自欧阳修《渔家傲》，都以粽子表现端午习俗。", "light-edit", "识别两组端午诗句及其中的节日食物。", ["cs-10-15-p19-p20-festival-poetry-table"], ["端午诗句包括角黍包金和五色新丝缠角粽，分别出自黄裳与欧阳修作品。"]),
        card("mid-autumn-poems", "中秋诗句中的月亮", "“暮云收尽溢清寒，银汉无声转玉盘”出自苏轼《中秋月》；“一轮秋影转金波”出自辛弃疾《太常引》，都以月亮表现中秋。", "light-edit", "区分两组中秋诗句的作者和作品。", ["cs-10-15-p19-p20-festival-poetry-table"], ["中秋诗句分别见苏轼《中秋月》和辛弃疾《太常引》，都描写月亮。"]),
        card("double-ninth-poems", "重阳诗句中的登高与茱萸", "“遥知兄弟登高处，遍插茱萸少一人”出自王维《九月九日忆山东兄弟》；杜牧《九日齐山登高》也写重阳登高赏菊。", "light-edit", "识别重阳诗句中的习俗、作者和作品。", ["cs-10-15-p19-p20-festival-poetry-table"], ["重阳诗句包括王维遍插茱萸少一人和杜牧《九日齐山登高》。"]),

        card("school-name-history", "校、序、庠与庠序", "传统说法称夏代学校为校、商代为序、周代为庠，因此先秦学校有时统称庠序。这组名称反映不同时代的学校称谓。", "light-edit", "区分校、序、庠对应的时代并说明庠序含义。", ["cs-10-15-p20-education-list"], ["夏曰校、殷曰序、周曰庠，所以先秦学校有时称庠序。"]),
        card("jixia-academy", "齐国稷下学宫", "稷下学宫设于齐国，是古代重要的官办学术和教育机构，聚集学者讲学论辩，对战国思想发展产生影响。", "light-edit", "说明稷下学宫的所属国家、性质和主要活动。", ["cs-10-15-p20-education-list"], ["齐国稷下学宫是官办高等学府，承担讲学和学术活动。"]),
        card("wenweng-stone-school", "文翁石室", "文翁石室由蜀郡太守文翁创建，是地方官府兴办学校的代表。人物、官职、地点和学校名称应一并识别。", "light-edit", "说清文翁石室的创建者、官职和学校性质。", ["cs-10-15-p20-education-list"], ["蜀郡太守文翁创建文翁石室，是地方官办学校。"]),
        card("six-arts-education", "古代教育六艺", "古代教育六艺是礼、乐、射、御、书、数，分别涉及礼仪、音乐、射箭、驾车、书写和计算等能力。", "synthesized", "准确说出六艺并概括各项内容。", ["cs-10-15-p20-education-list"], ["教育六艺包括礼、乐、射、御、书、数。"]),
        card("song-four-academies", "宋代四大书院的一种口径", "正文主要列白鹿洞书院、岳麓书院、应天府书院和嵩阳书院，并注明另一说用石鼓书院替代嵩阳书院。", "light-edit", "说明宋代四大书院的正文口径及另一种名单差异。", ["cs-10-15-p20-education-list"], ["宋代四大书院包括白鹿洞、岳麓、应天府、嵩阳，另一说以石鼓替代嵩阳。"]),
        card("three-classic-primers", "蒙学读物三百千", "《三字经》《百家姓》《千字文》是传统蒙学读物，三部书各取首字合称“三百千”。", "reuse", "准确说出三百千所指的三部蒙学读物。", ["cs-10-15-p20-education-list"], ["《三字经》《百家姓》《千字文》并称传统蒙学三百千。"]),

        card("four-famous-brocades", "四大名锦及产地", "四大名锦是南京云锦、四川蜀锦、苏州宋锦和广西壮锦。名称通常由产地或地域文化而来。", "reuse", "准确说出四大名锦及各自产地。", ["cs-10-15-p20-textile-clothing-list"], ["四大名锦为南京云锦、四川蜀锦、苏州宋锦、广西壮锦。"]),
        card("four-famous-embroideries", "四大名绣及产地", "四大名绣是广东粤绣、湖南湘绣、四川蜀绣和江苏苏绣，名称分别对应粤、湘、蜀、苏四个地域。", "reuse", "准确说出四大名绣及各自对应地区。", ["cs-10-15-p20-textile-clothing-list"], ["四大名绣为广东粤绣、湖南湘绣、四川蜀绣、江苏苏绣。"]),

        card("four-major-cuisines", "四大菜系", "正文列出的四大菜系是鲁菜、川菜、粤菜和淮扬菜，淮扬菜也归入苏菜体系。这是菜系分类的一种常见口径。", "synthesized", "准确说出四大菜系并说明淮扬菜与苏菜关系。", ["cs-10-15-p20-p21-food-list"], ["四大菜系为鲁菜、川菜、粤菜、淮扬菜，淮扬菜属于苏菜。"]),
        card("sichuan-dishes", "正文列举的川菜代表", "正文列举鱼香肉丝、宫保鸡丁、夫妻肺片、麻婆豆腐、回锅肉和东坡肘子作为川菜代表。", "reuse", "准确说出正文列举的川菜代表菜品。", ["cs-10-15-p20-p21-food-list"], ["川菜代表包括鱼香肉丝、宫保鸡丁、夫妻肺片、麻婆豆腐、回锅肉、东坡肘子。"]),
        card("four-exam-banquets", "科举四宴", "科举四宴包括会武宴、鹿鸣宴、鹰扬宴和琼林宴：分别联系武科殿试、文科乡试、武科乡试和新科进士。", "light-edit", "区分科举四宴的名称和对应场合。", ["cs-10-15-p20-p21-food-list"], ["会武宴在武科殿试后，鹿鸣宴在乡试后，鹰扬宴在武科乡试后，琼林宴为新科进士宴。"]),
        card("lu-yu-tea-classic", "陆羽与《茶经》", "唐代陆羽被后世称为茶圣、茶仙，著有《茶经》。该书系统讨论茶叶生产、制作、饮用和相关器具。", "light-edit", "说清陆羽的时代、称谓和代表著作。", ["cs-10-15-p20-p21-food-list"], ["唐代陆羽被称为茶圣、茶仙，著有茶叶专著《茶经》。"]),
      ],
    },
  ],
  exclusions: [
    ["lantern-yuanxiao-song-earliest", "daily-life-language", "宋代最早记载元宵节吃元宵", "最早记载属于文献极值判断，正文未给出具体文献、年代和食物名称演变依据。", "依据权威饮食史和节俗史资料补充原始文献、时间与名称口径后再准入。", ["cs-10-15-p19-festival-table"]],
    ["qingming-first-solar-term-festival", "daily-life-language", "清明是第一个转变为节日的节气", "第一个属于比较性结论，需要定义节气转变为节日的标准及其他节气的比较范围。", "依据权威节俗史资料明确判断标准和历史过程后再准入。", ["cs-10-15-p19-festival-table"]],
    ["cold-food-jie-zitui-origin", "daily-life-language", "寒食节为纪念介子推而设", "正文已用相传表述，属于节日起源传说，不能直接写成确定历史事实。", "查找权威节俗史资料并保留传说属性，说明史料与后世叙事的区别。", ["cs-10-15-p19-festival-table"]],
    ["dragon-boat-first-intangible", "daily-life-language", "端午是中国首个世界非遗节日", "项目名称、申报主体和首个节日的比较口径需要联合国教科文组织官方材料核验。", "依据联合国教科文组织与中国官方名录核对项目名称、年份和比较范围。", ["cs-10-15-p19-festival-table"]],
    ["dragon-boat-quyuan-origin", "daily-life-language", "端午节是为了纪念屈原", "端午起源存在多种历史解释，正文也只写一般认为，不宜呈现为唯一确定来源。", "依据权威节俗史资料呈现主要说法及其证据边界后再准入。", ["cs-10-15-p19-festival-table"]],
    ["jixia-world-earliest", "daily-life-language", "稷下学宫是世界最早官办高等学府", "世界最早依赖官办、高等学府和连续办学等定义，正文没有提供跨文明比较资料。", "依据权威教育史资料明确机构性质、年代和比较范围后再准入。", ["cs-10-15-p20-education-list"]],
    ["wenweng-first-local-school", "daily-life-language", "文翁石室是中国第一所地方官办学校", "第一所属于极值判断，需要核对建校年代、学校性质和更早地方教育机构。", "依据权威教育史与地方史资料明确建校事实和比较口径后再准入。", ["cs-10-15-p20-education-list"]],
    ["song-four-academies-single-list", "daily-life-language", "宋代四大书院存在唯一名单", "正文已明确嵩阳书院和石鼓书院两种口径，不能将任一名单表述为唯一答案。", "依据权威书院史资料说明不同评选口径及共同成员后再决定产品呈现。", ["cs-10-15-p20-education-list"]],
    ["ju-steam-definition", "daily-life-language", "焗是利用蒸汽使密闭食物变熟", "该定义可能混淆焗、焖和蒸等烹调方式，正文没有给出烹饪术语来源。", "依据权威烹饪教材核对热源、容器和传热方式，先修正文再生成卡片。", ["cs-10-15-p20-p21-food-list"]],
    ["sichuan-dish-canonical-list", "daily-life-language", "东坡肘子等菜品统一归为川菜代表", "菜品起源、流派和代表性存在地域与口径差异，正文的组合缺少菜系权威来源。", "依据权威菜系资料逐项核对菜品归属和代表性后再调整列表。", ["cs-10-15-p20-p21-food-list"]],
    ["tea-classic-earliest", "daily-life-language", "《茶经》是我国最早茶叶专著", "最早属于文献史极值判断，需要明确专著定义、文本年代和早期茶事文献范围。", "依据权威茶史和版本学资料核对成书年代与最早称谓后再准入。", ["cs-10-15-p20-p21-food-list"]],
    ["world-three-distilled-spirits", "daily-life-language", "世界三大蒸馏酒固定为白兰地威士忌茅台", "世界三大属于非标准评选口径，且把品牌、产地和酒类层级混列，缺少权威来源。", "依据国际酒类分类和权威行业资料核对分类层级，不能用无来源三大称谓。", ["cs-10-15-p20-p21-food-list"]],
    ["du-kang-wine-founder", "daily-life-language", "杜康是酿酒始祖和酒圣", "正文明确属于古代传说，人物身份、时代和酿酒发明缺少可核实的同代史料。", "依据权威酒史资料说明传说属性与文献流变后再决定是否收录。", ["cs-10-15-p20-p21-food-list"]],
  ].map(([id, pointId, title, reason, requiredEvidence, sourceUnitIds]) => ({id, pointId, title, reason, requiredEvidence, sourceUnitIds})),
};
