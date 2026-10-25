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
  id: "common-sense-guide-expansion-batch-7",
  title: "知识导读扩库第 7 批：中国传统艺术",
  status: "candidate",
  purpose: "整理汉字书法、国画、戏曲脸谱和传统植物意象中的稳定结构，将画史极值、馆藏、排名与争议来源转入 HOLD。",
  groups: [
    {
      pointId: "traditional-arts",
      overview: "中国传统艺术包括汉字书法、国画、戏曲与植物意象。知识卡分别说明书体和构字方法、艺术家与作品、剧种特征、脸谱含义以及象征组合。",
      relation: "classification",
      cards: [
        card("three-national-essences", "中国三大国粹", "常见文化常识把京剧、国画和中医合称为中国三大国粹。京剧属于戏曲，国画属于绘画，中医属于传统医学。", "synthesized", "准确说出三大国粹并区分所属领域。", ["cs-10-15-p16-three-national-essences-list"], ["中国三大国粹包括京剧、国画和中医。"]),
        card("seven-script-sequence", "汉字七体的演变顺序", "正文列出的汉字七体依次为甲骨文、金文、小篆、隶书、楷书、草书和行书。这个顺序概括主要书体的演变线索。", "reuse", "准确说出汉字七体的排列顺序。", ["cs-10-15-p16-p17-calligraphy-table"], ["汉字七体依次为甲骨文、金文、小篆、隶书、楷书、草书、行书。"]),
        card("six-writing-methods", "汉字六书", "汉字六书包括象形、指事、会意、形声、转注和假借。前四项通常说明造字方式，转注和假借更多涉及字的使用关系。", "light-edit", "准确说出六书并概括两类作用。", ["cs-10-15-p16-p17-calligraphy-table"], ["汉字六书为象形、指事、会意、形声、转注、假借。"]),
        card("regular-script-four-masters", "楷书四大家", "楷书四大家是唐代欧阳询、颜真卿、柳公权和元代赵孟頫，其书体分别称欧体、颜体、柳体和赵体。", "reuse", "说清楷书四大家的姓名、时代和书体称谓。", ["cs-10-15-p16-p17-calligraphy-table"], ["楷书四大家为唐代欧阳询、颜真卿、柳公权和元代赵孟頫，对应欧颜柳赵四体。"]),
        card("yanjin-liugu", "颜筋柳骨", "“颜筋柳骨”并称颜真卿和柳公权的楷书风格。颜真卿代表作有《多宝塔碑》，柳公权代表作有《玄秘塔碑》。", "reuse", "说明颜筋柳骨所指人物及各自代表碑帖。", ["cs-10-15-p16-p17-calligraphy-table"], ["颜筋柳骨指颜真卿《多宝塔碑》和柳公权《玄秘塔碑》。"]),
        card("zhang-xu-huaisu", "颠张醉素", "“颠张醉素”指草书家张旭和怀素。张旭被称为草圣，怀素的代表作包括《自叙帖》，二人都以草书著称。", "light-edit", "识别颠张醉素所指人物、书体和代表信息。", ["cs-10-15-p16-p17-calligraphy-table"], ["颠张醉素指张旭和怀素；张旭称草圣，怀素有《自叙帖》。"]),
        card("wang-xizhi-lanting", "王羲之与《兰亭序》", "王羲之被后世称为书圣，《兰亭序》是其行书代表作。人物称谓、作品名称和书体三项应一起区分。", "light-edit", "说清王羲之的称谓、《兰亭序》的作者和书体。", ["cs-10-15-p16-p17-calligraphy-table"], ["王羲之被称为书圣，行书代表作是《兰亭序》。"]),
        card("song-four-calligraphers", "宋四家", "宋四家指苏轼、黄庭坚、米芾和蔡襄。四人是宋代重要书法家，苏轼的行书作品包括《寒食帖》。", "reuse", "准确说出宋四家并识别苏轼的《寒食帖》。", ["cs-10-15-p16-p17-calligraphy-table"], ["宋四家为苏轼、黄庭坚、米芾和蔡襄，苏轼有《寒食帖》。"]),
        card("four-treasures", "文房四宝及产地代表", "文房四宝是笔、墨、纸、砚，常见代表为浙江湖笔、安徽徽墨、安徽宣纸和广东端砚。", "reuse", "准确说出文房四宝及四种常见产地代表。", ["cs-10-15-p16-p17-calligraphy-table"], ["文房四宝为笔墨纸砚，代表为湖笔、徽墨、宣纸和端砚。"]),

        card("gu-kaizhi-paintings", "顾恺之及其代表作", "东晋画家顾恺之的代表作包括《女史箴图》和《洛神赋图》，其绘画思想强调通过人物形态表现精神。", "light-edit", "说清顾恺之的时代、代表作和绘画思想。", ["cs-10-15-p17-p18-painting-table"], ["东晋顾恺之代表作有《女史箴图》《洛神赋图》，提出以形写神。"]),
        card("zhan-ziqian-youchuntu", "展子虔与《游春图》", "隋代画家展子虔的代表作是《游春图》，作品以山水景物为主要表现对象，是古代山水画的重要作品。", "light-edit", "说明展子虔的时代和代表作品类型。", ["cs-10-15-p17-p18-painting-table"], ["隋代展子虔的代表作是山水画《游春图》。"]),
        card("yan-liben-buniantu", "阎立本与《步辇图》", "唐代阎立本创作《步辇图》。画面表现吐蕃使者禄东赞到长安觐见唐太宗，与文成公主入藏相关。", "light-edit", "说明《步辇图》的作者、时代和画面事件。", ["cs-10-15-p17-p18-painting-table"], ["唐代阎立本《步辇图》描绘禄东赞到长安觐见唐太宗的画面。"]),
        card("wu-daozi-painting", "吴道子的称谓与作品", "唐代吴道子被后世尊称为画圣，人物画风格常用“吴带当风”概括，代表作包括《送子天王图》。", "light-edit", "识别吴道子的时代、称谓、风格概括和代表作。", ["cs-10-15-p17-p18-painting-table"], ["唐代吴道子被称为画圣，人物画称吴带当风，代表作有《送子天王图》。"]),
        card("zhou-fang-painting", "周昉与《簪花仕女图》", "唐代画家周昉的代表作是《簪花仕女图》。作品以贵族妇女生活为题材，属于人物画。", "light-edit", "说清《簪花仕女图》的作者、时代和画作题材。", ["cs-10-15-p17-p18-painting-table"], ["唐代周昉的代表作是人物画《簪花仕女图》。"]),
        card("gu-hongzhong-night-banquet", "顾闳中与《韩熙载夜宴图》", "南唐画家顾闳中的代表作是《韩熙载夜宴图》。画作以连续场景表现韩熙载夜宴活动。", "light-edit", "说清《韩熙载夜宴图》的作者、时代和画面主题。", ["cs-10-15-p17-p18-painting-table"], ["南唐顾闳中的代表作是《韩熙载夜宴图》。"]),
        card("zhang-zeduan-qingming", "张择端与《清明上河图》", "北宋张择端创作《清明上河图》，画面表现北宋都城东京汴京的城市生活和繁荣景象，地点相当于今河南开封。", "reuse", "说明《清明上河图》的作者、时代和描绘地点。", ["cs-10-15-p17-p18-painting-table"], ["北宋张择端《清明上河图》描绘东京汴京即今河南开封的繁荣景象。"]),
        card("wang-ximeng-thousand-li", "王希孟与《千里江山图》", "北宋王希孟创作《千里江山图》。正文把作品主要取景地概括为江西庐山和鄱阳湖一带。", "reuse", "说清《千里江山图》的作者、时代和正文所述取景范围。", ["cs-10-15-p17-p18-painting-table"], ["北宋王希孟《千里江山图》主要取景地为庐山和鄱阳湖。"]),
        card("huang-gongwang-fuchun", "黄公望与《富春山居图》", "元代黄公望创作《富春山居图》，描绘浙江富春江景色。作品现分为《剩山图》和《无用师卷》两部分。", "light-edit", "说明《富春山居图》的作者、时代、描绘地点和分卷名称。", ["cs-10-15-p17-p18-painting-table"], ["元代黄公望《富春山居图》描绘浙江富春江，分剩山图和无用师卷。"]),
        card("ten-famous-paintings-list", "正文列举的十幅传世名画", "正文列举《洛神赋图》《清明上河图》《富春山居图》《汉宫春晓图》《百骏图》《步辇图》《唐宫仕女图》《五牛图》《韩熙载夜宴图》《千里江山图》十幅作品。", "reuse", "准确说出正文列举的十幅传世名画。", ["cs-10-15-p17-p18-painting-table"], ["表格列出洛神赋图、清明上河图、富春山居图、汉宫春晓图、百骏图、步辇图、唐宫仕女图、五牛图、韩熙载夜宴图、千里江山图。"]),

        card("kunqu-works", "昆曲代表剧目", "昆曲代表剧目包括《牡丹亭》《长生殿》和《桃花扇》。这三部作品应与京剧、越剧等其他剧种的代表剧目区分。", "reuse", "准确说出三部昆曲代表剧目。", ["cs-10-15-p18-opera-table"], ["昆曲代表剧目有《牡丹亭》《长生殿》《桃花扇》。"]),
        card("kunqu-origin", "昆曲的发源时间与地点", "昆曲发源于元末明初的苏州昆山地区，后来发展为影响广泛的戏曲声腔和剧种。", "light-edit", "说明昆曲的发源时期和地区。", ["cs-10-15-p18-opera-table"], ["昆曲发源于元末明初的苏州昆山地区。"]),
        card("peking-opera-works", "京剧代表剧目", "京剧代表剧目包括《霸王别姬》《四郎探母》《贵妃醉酒》和《智取威虎山》，题材既有传统历史故事，也有现代作品。", "reuse", "准确说出正文列举的四部京剧代表剧目。", ["cs-10-15-p18-opera-table"], ["京剧代表剧目有《霸王别姬》《四郎探母》《贵妃醉酒》《智取威虎山》。"]),
        card("peking-opera-roles", "京剧四大行当", "京剧四大行当是生、旦、净、丑。生多扮演男性角色，旦扮演女性角色，净常用脸谱表现性格，丑多有喜剧性。", "synthesized", "准确说出京剧四大行当并概括角色特点。", ["cs-10-15-p18-opera-table"], ["京剧的四种主要行当是生、旦、净、丑。"]),
        card("peking-opera-performance", "京剧四种表现手法", "京剧常用唱、念、做、打四种表现手法。唱和念属于声音表达，做是表演动作，打主要表现武打和程式化动作。", "synthesized", "准确说出唱念做打并区分基本作用。", ["cs-10-15-p18-opera-table"], ["京剧表现手法包括唱、念、做、打。"]),
        card("four-famous-dan", "京剧四大名旦", "京剧四大名旦是梅兰芳、尚小云、程砚秋和荀慧生，常用“梅尚程荀”概括四人的姓氏。", "light-edit", "准确说出京剧四大名旦。", ["cs-10-15-p18-opera-table"], ["京剧四大名旦为梅兰芳、尚小云、程砚秋、荀慧生，即梅尚程荀。"]),
        card("yue-opera", "越剧的地域与题材", "越剧发源于浙江，代表剧目包括《梁山伯与祝英台》《西厢记》《红楼梦》《孔雀东南飞》，题材常见才子佳人故事。", "light-edit", "说明越剧的发源地、常见题材和代表剧目。", ["cs-10-15-p18-opera-table"], ["越剧发源于浙江，多以才子佳人题材为主，代表剧目有梁山伯与祝英台等。"]),
        card("yu-opera", "豫剧的地域与代表作品", "豫剧发源于河南开封，在河南梆子基础上发展，代表剧目有《花木兰》《穆桂英挂帅》《红灯记》，代表人物包括常香玉。", "light-edit", "说明豫剧的发源地、发展基础、剧目和代表人物。", ["cs-10-15-p18-opera-table"], ["豫剧发源于河南开封，在河南梆子基础上发展，代表人物常香玉。"]),
        card("ping-opera", "评剧的形成与代表剧目", "评剧在清末河北滦县的对口莲花落基础上形成，后来进入唐山并称唐山落子，代表剧目有《花为媒》《杨三姐告状》。", "light-edit", "说明评剧的形成地区、早期称谓和代表剧目。", ["cs-10-15-p18-opera-table"], ["评剧在清末河北滦县对口莲花落基础上形成，后称唐山落子，剧目有花为媒等。"]),
        card("huangmei-opera", "黄梅戏的名称与地域", "黄梅戏又称黄梅调、采茶戏等，正文记载其起源于湖北黄梅，后来在安徽安庆发展壮大，代表剧目有《天仙配》《女驸马》。", "light-edit", "说明黄梅戏的别称、起源地、发展地和代表剧目。", ["cs-10-15-p18-opera-table"], ["黄梅戏原名黄梅调、采茶戏，起源湖北黄梅，发展于安徽安庆，剧目有天仙配等。"]),
        card("opera-three-leading-genres", "戏曲三鼎甲", "正文把京剧、豫剧和越剧合称为戏曲三鼎甲。这个称谓用于概括三个影响较大的剧种，并不等同于所有传统戏曲类型。", "synthesized", "准确说出戏曲三鼎甲所指的三个剧种。", ["cs-10-15-p18-opera-supplement-list"], ["戏曲三鼎甲包括京剧、豫剧、越剧。"]),

        card("red-white-face", "京剧红脸与白脸", "京剧脸谱中，红脸常表示忠贞、英勇，代表人物是关羽；白脸常表示阴险、疑诈，代表人物是曹操。", "reuse", "区分红脸和白脸的常见性格含义与代表人物。", ["cs-10-15-p19-opera-face-table"], ["红脸表示忠贞英勇，代表关羽；白脸表示阴险疑诈，代表曹操。"]),
        card("black-yellow-face", "京剧黑脸与黄脸", "京剧脸谱中，黑脸常表示正直无私、刚直不阿，代表人物是包拯；黄脸常表示骁勇凶猛，代表人物是典韦。", "reuse", "区分黑脸和黄脸的常见性格含义与代表人物。", ["cs-10-15-p19-opera-face-table"], ["黑脸表示正直刚强，代表包拯；黄脸表示骁勇凶猛，代表典韦。"]),
        card("green-blue-face", "京剧绿脸与蓝脸", "京剧脸谱中，绿脸常表示顽强、暴躁，代表人物是程咬金；蓝脸常表示刚强、骁勇，代表人物是窦尔敦。", "reuse", "区分绿脸和蓝脸的常见性格含义与代表人物。", ["cs-10-15-p19-opera-face-table"], ["绿脸表示顽强暴躁，代表程咬金；蓝脸表示刚强骁勇，代表窦尔敦。"]),
        card("gold-silver-face", "京剧金银脸谱", "京剧脸谱中的金色和银色常用于神仙、妖怪等超自然角色，正文列举二郎神作为代表人物。", "light-edit", "说明金色和银色脸谱的常见角色类型及代表人物。", ["cs-10-15-p19-opera-face-table"], ["金脸、银脸用于神妖角色，代表人物为二郎神。"]),

        card("three-friends-winter", "岁寒三友", "岁寒三友指松、竹、梅。三种植物在寒冷时节仍具有鲜明形象，因此常被用来象征坚贞和不屈等品质。", "light-edit", "准确说出岁寒三友并概括其共同象征。", ["cs-10-15-p19-traditional-arts-other-list"], ["中国传统文化中的岁寒三友是松、竹、梅。"]),
        card("four-gentlemen-plants", "花中四君子", "梅、兰、竹、菊合称四君子，正文用傲、幽、坚、淡概括四者品质，并分别联系高洁之士、贤达、谦谦君子和世外隐士。", "synthesized", "准确说出四君子及其品质和人物象征。", ["cs-10-15-p19-traditional-arts-other-list"], ["四君子为梅兰竹菊，品质为傲幽坚淡，对应高洁、贤达、君子、隐士。"]),
      ],
    },
  ],
  exclusions: [
    ["oracle-bone-earliest-script", "traditional-arts", "甲骨文作为最早汉字书体", "最早称谓依赖成熟文字、已发现材料和考古年代的限定，正文只在七体顺序中标注最早。", "依据权威文字学和考古资料明确比较范围，再决定是否保留最早称谓。", ["cs-10-15-p16-p17-calligraphy-table"]],
    ["hu-fei-zhong-shou", "traditional-arts", "胡肥钟瘦所指胡昭与钟繇", "该成语及人物对应并非常见稳定书法史结论，正文没有作品或权威出处。", "核对权威书法史资料和原始评论出处，确认人物、书体和含义后再准入。", ["cs-10-15-p16-p17-calligraphy-table"]],
    ["calligraphy-world-rankings", "traditional-arts", "天下第一第二第三行书与第一草书", "天下排名属于后世评价，来源、评价范围和通行程度需要分别核对，不能当作客观次序。", "依据权威书法史资料逐项核对评价出处，并明确这是传统称誉而非事实排名。", ["cs-10-15-p16-p17-calligraphy-table", "cs-10-15-p17-calligraphy-supplement-list"]],
    ["inkstone-first-treasure", "traditional-arts", "砚为文房四宝之首", "四宝之首是评价性称谓，正文未说明评价依据和出处。", "查明权威文房用具史资料与称谓来源后再准入。", ["cs-10-15-p16-p17-calligraphy-table"]],
    ["zhan-ziqian-oldest-landscape", "traditional-arts", "《游春图》是存世最古老山水画", "存世最古老属于极值判断，依赖山水画定义、断代和传世作品范围。", "依据权威美术史和作品鉴定资料明确限定语后再准入。", ["cs-10-15-p17-p18-painting-table"]],
    ["painting-collection-locations", "traditional-arts", "传统名画当前馆藏地点", "馆藏信息可能变化，且正文中部分作品归属、真伪和所在地需要实时核验。", "逐项查询各博物馆官方馆藏目录，并记录核验日期和作品版本后再准入。", ["cs-10-15-p17-p18-painting-table"]],
    ["diyu-bianxiang-mogao", "traditional-arts", "吴道子《地狱变相图》现存莫高窟", "正文把画家、作品名称和莫高窟现存状态直接关联，可能混淆题材、壁画与传世作品。", "依据权威美术史和敦煌研究资料核对作品存佚、作者归属及所在地。", ["cs-10-15-p17-p18-painting-table"]],
    ["ten-famous-paintings-canon", "traditional-arts", "中国十大传世名画的固定名单", "十大名单属于现代汇总口径，不同资料可能选择不同作品，正文没有提供评选主体。", "查明名单来源并在产品中标注正文口径，避免表述为唯一权威名单。", ["cs-10-15-p17-p18-painting-table"]],
    ["kunqu-first-intangible", "traditional-arts", "昆曲是中国第一个人类非物质文化遗产", "联合国教科文组织项目名称、公布批次和中国第一的比较口径需要官方来源核验。", "依据联合国教科文组织和中国官方名录核对项目名称、年份和批次后再准入。", ["cs-10-15-p18-opera-table"]],
    ["opera-five-genres-scope", "traditional-arts", "五大戏曲剧种的范围", "表格同时列出昆曲、京剧、越剧、豫剧、评剧、黄梅戏六种，五大范围与昆曲是否计入不清楚。", "依据权威戏曲史资料明确五大剧种名单，并修正文表格结构后再准入。", ["cs-10-15-p18-opera-table"]],
    ["peking-opera-ranking", "traditional-arts", "京剧为戏曲三鼎甲榜首", "榜首属于排名评价，正文没有提供评选标准或出处。", "核对戏曲史资料中三鼎甲称谓的形成和适用范围后再准入。", ["cs-10-15-p18-opera-table"]],
    ["huangmei-origin-dispute", "traditional-arts", "黄梅戏起源湖北黄梅并在安庆发展", "黄梅戏源流存在不同地域叙述，正文采用单一路径但未说明学术口径。", "依据权威戏曲史和国家非遗资料说明源流争议与采用口径后再准入。", ["cs-10-15-p18-opera-table"]],
    ["face-color-fixed-meaning", "traditional-arts", "京剧脸谱颜色与性格一一固定对应", "脸谱含义会随人物、剧目和勾脸方式变化，简表只能作为常见概括，不能扩展为固定规则。", "依据权威京剧脸谱资料补充适用边界，并保留常见而非绝对的表述。", ["cs-10-15-p19-opera-face-table"]],
  ].map(([id, pointId, title, reason, requiredEvidence, sourceUnitIds]) => ({id, pointId, title, reason, requiredEvidence, sourceUnitIds})),
};
