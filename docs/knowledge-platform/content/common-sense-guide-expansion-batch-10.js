const PENDING_REVIEW = Object.freeze({
  admission: "expansion-candidate",
  sourceFidelity: "self-reviewed",
  noviceReadability: "pending-user-sampling",
  independentFactReview: "pending-independent-review",
});
const card = (id, title, explanation, productionMode, learningGoal, sourceUnitIds, sourceEvidence, semanticRevision = 1) => ({
  id, title, explanation, productionMode, learningGoal, sourceUnitIds, sourceEvidence,
  semanticRevision, review: PENDING_REVIEW,
});

module.exports = {
  schemaVersion: 1,
  id: "common-sense-guide-expansion-batch-10",
  title: "知识导读扩库第 10 批：体育常识",
  status: "candidate",
  purpose: "按现行国际体育组织口径整理奥运会、田径体操和球类项目，将原 HOLD 中可修正的内容改写为有边界的稳定知识卡。",
  groups: [{
    pointId: "sports",
    overview: "体育常识包括奥运会基本事实、竞技体操与耐力项目构成，以及足球、篮球、排球、乒乓球、羽毛球和斯诺克的基础规则。各卡明确项目、人数、时长、计分或比赛顺序。",
    relation: "classification",
    cards: [
      card("olympic-rings-meaning", "奥运五环的整体含义", "奥运五环整体象征五大洲的团结，以及世界各地运动员在奥运会相聚。五种环色不与五大洲逐一对应。", "light-edit", "说明奥运五环的整体含义和颜色对应边界。", ["cs-10-15-p24-olympic-rings-list"], ["五环整体象征五大洲的团结；国际奥委会没有规定某一种环色对应某一个大洲。"]),
      card("olympic-motto-current", "现行奥林匹克格言", "现行奥林匹克格言是“更快、更高、更强——更团结”。前三项强调运动表现，新增的“更团结”强调团结与共同参与。", "light-edit", "准确说出现行奥林匹克格言的四个部分。", ["cs-10-15-p24-olympic-motto-list"], ["现行格言为更快、更高、更强——更团结。"], 2),
      card("olympic-motto-history", "奥林匹克格言的两次形成", "“更快、更高、更强”在1894年奥林匹克运动创立时采用；2021年国际奥委会批准加入“更团结”，形成现行格言。", "light-edit", "区分奥林匹克格言原三项采用和加入更团结的时间。", ["cs-10-15-p24-olympic-motto-list"], ["原格言于1894年采用；2021年7月20日加入更团结。"]),

      card("paris-edition-host", "巴黎第33届夏季奥运会", "巴黎奥运会是第33届夏季奥林匹克运动会，主办城市为法国巴黎。届次和主办城市属于这届赛事的基本身份信息。", "reuse", "准确说出巴黎奥运会的届次和主办城市。", ["cs-10-15-p24-paris-olympics-list"], ["巴黎奥运会：第33届夏季奥林匹克运动会，是在法国巴黎举办的国际性奥林匹克赛事。"]),
      card("paris-china-medals", "巴黎奥运会中国代表团奖牌", "中国代表团在巴黎奥运会获得40枚金牌、27枚银牌和24枚铜牌，金牌数与美国代表团并列第一。", "reuse", "准确说出中国代表团在巴黎奥运会的奖牌数。", ["cs-10-15-p24-paris-olympics-list"], ["中国代表团最终在巴黎奥运会上夺得40金27银24铜，金牌数与美国代表团并列首位。"]),
      card("paris-additional-sports", "巴黎奥运会四个增设项目", "巴黎2024设置滑板、冲浪、竞技攀岩和霹雳舞四个增设项目。只有霹雳舞首次进入奥运会，另外三项已在东京2020亮相。", "light-edit", "区分巴黎奥运会的四个增设项目和首次入奥项目。", ["cs-10-15-p24-paris-olympics-list"], ["巴黎2024设置四个增设项目；霹雳舞首次入奥，其他三项已在东京2020完成奥运首秀。"]),

      card("la-edition-host", "洛杉矶第34届夏季奥运会", "洛杉矶奥运会是第34届夏季奥林匹克运动会，主办城市为美国洛杉矶。洛杉矶此前曾在1932年和1984年举办夏季奥运会。", "light-edit", "准确说出洛杉矶奥运会的届次和历次举办年份。", ["cs-10-15-p24-los-angeles-olympics-list"], ["洛杉矶奥运会：第34届夏季奥林匹克运动会，主办城市是洛杉矶，也是继1932年和1984年后再次举办奥运会。"]),
      card("la-third-three-time-host", "第三个三办夏奥的城市", "洛杉矶将第三次举办夏季奥运会，成为继伦敦和巴黎之后，第三个至少三次举办夏季奥运会的城市。", "light-edit", "说明洛杉矶第三次举办夏季奥运会的城市纪录。", ["cs-10-15-p24-los-angeles-olympics-list"], ["洛杉矶成为继伦敦和巴黎后的世界第3个至少三次举办夏季奥林匹克运动会的城市。"]),

      card("gymnastics-men-six", "男子竞技体操六项", "男子竞技体操包括自由体操、鞍马、吊环、跳马、双杠和单杠六个项目，既有器械项目，也有自由体操。", "reuse", "准确说出男子竞技体操的六个项目。", ["cs-10-15-p24-gymnastics-list"], ["男子竞技体操项目分为六种：鞍马、吊环、跳马、双杠、单杠和自由体操。"]),
      card("gymnastics-women-four", "女子竞技体操四项", "女子竞技体操包括跳马、高低杠、平衡木和自由体操四个项目，其中高低杠和平衡木是女子项目。", "reuse", "准确说出女子竞技体操的四个项目。", ["cs-10-15-p24-gymnastics-list"], ["女子竞技体操项目分为四种：跳马、高低杠、平衡木和自由体操。"]),
      card("gymnastics-shared-events", "男女竞技体操共同项目", "男子和女子竞技体操都设有跳马与自由体操。男子另有鞍马、吊环、双杠、单杠，女子另有高低杠、平衡木。", "synthesized", "区分男女竞技体操的共同项目和各自项目。", ["cs-10-15-p24-gymnastics-list"], ["男子六项和女子四项中，跳马、自由体操同时出现，其他项目各不相同。"]),

      card("marathon-distance", "马拉松全程距离", "马拉松的标准距离为42.195公里，也就是26英里385码。半程马拉松是另一项标准道路跑距离，“四分马拉松”不是固定分类。", "light-edit", "准确说出马拉松标准距离并区分相关道路跑名称。", ["cs-10-15-p24-marathon-list"], ["马拉松标准距离为42.195公里；半程是另一项标准距离，四分马拉松不是固定分类。"], 2),
      card("marathon-name-history", "马拉松名称与现代项目", "马拉松名称关联古希腊士兵从马拉松战场跑往雅典报捷的传说。现代奥运会1896年设置马拉松赛，标准距离在1921年统一。", "light-edit", "说明马拉松名称的传说属性和现代项目形成时间。", ["cs-10-15-p24-marathon-list"], ["项目名称关联古希腊报捷传说；1896年设置现代奥运马拉松，1921年统一标准距离。"]),
      card("triathlon-order", "铁人三项比赛顺序", "铁人三项按游泳、自行车、长跑的顺序连续进行。比赛可以采用不同距离，但三个项目的先后顺序不变。", "reuse", "准确说出铁人三项的比赛顺序。", ["cs-10-15-p25-triathlon-list"], ["铁人三项比赛按游泳、自行车、长跑的顺序进行，有不同距离的比赛。"]),

      card("football-player-count", "足球上场人数下限", "足球比赛每队上场最多11人，其中包括守门员；任何一队少于7人，比赛不得开始或继续进行。", "light-edit", "说明足球每队的最多上场人数和比赛人数下限。", ["cs-10-15-p25-football-list"], ["每队上场队员不得多于11名，如果任何一队少于7人则比赛不能开始。"]),
      card("football-match-time", "足球比赛时间", "足球比赛分为两个相等的半场，每半场45分钟；中场休息通常不得超过15分钟。补时由裁判根据比赛中损失的时间确定。", "light-edit", "准确说出足球比赛的半场时长和中场休息上限。", ["cs-10-15-p25-football-list"], ["比赛分为两个半场，每半场45分钟。中场休息不得超过15分钟。"]),
      card("football-kickoff-choice", "足球开球与进攻方向", "比赛开始前通过掷币决定选择。猜中的一队选择上半场进攻方向，另一队开球开始比赛。", "reuse", "说明足球比赛掷币后两队分别获得什么选择。", ["cs-10-15-p25-football-list"], ["通过掷币，猜中的队决定上半场比赛的进攻方向。另一队开球开始比赛。"]),
      card("football-cards", "足球黄牌与红牌", "黄牌表示警告，红牌表示球员被罚出场。同一名球员在一场比赛中得到两张黄牌，会被出示红牌并罚下。", "light-edit", "区分足球比赛中黄牌和红牌的后果。", ["cs-10-15-p25-football-list"], ["裁判会出示黄牌或者红牌判罚，红牌直接罚下，两张黄牌等于一张红牌。"]),

      card("basketball-four-quarters", "篮球比赛四节时间", "按国际篮球规则，比赛由4节组成，每节10分钟。第一节与第二节之间、第三节与第四节之间各休息2分钟。", "light-edit", "准确说出国际篮球比赛的节数、每节时长和节间休息。", ["cs-10-15-p25-basketball-list"], ["篮球比赛由4节组成，每节10分钟，第一二节之间、第三四节之间有2分钟休息。"]),
      card("basketball-halftime", "篮球半场休息", "按国际篮球规则，第二节结束后进入半场休息，休息时间为15分钟；半场休息比普通节间休息更长。", "reuse", "区分篮球半场休息和普通节间休息的时长。", ["cs-10-15-p25-basketball-list"], ["第一节和第二节之间等休息2分钟，半场时间的休息应为15分钟。"]),
      card("basketball-overtime", "篮球加时赛", "第四节结束时比分相等，需要进行5分钟加时赛；如果加时结束仍未分出胜负，就继续进行5分钟加时赛。", "light-edit", "说明篮球在第四节平分后的加时规则。", ["cs-10-15-p25-basketball-list"], ["第四节比赛时间终了时比分相等，需要一个或多个5分钟的加时赛。"]),
      card("basketball-start-fouls", "篮球开赛与犯规离场", "按国际篮球规则，第一节以中圈跳球开始。一名球员累计5次犯规后不能继续参赛，需要退出比赛。", "synthesized", "说明国际篮球比赛如何开始以及个人犯规离场次数。", ["cs-10-15-p25-basketball-list"], ["通过中场跳球开始比赛。个人犯规5次自动退出比赛。"]),

      card("volleyball-six-on-court", "排球场上人数", "室内排球比赛中，每队同时有6名队员在场上。两队隔网对抗，场上队员按规则轮转位置。", "light-edit", "准确说出室内排球每队的场上人数。", ["cs-10-15-p25-volleyball-list"], ["两队各派6名队员在由球网分开的场地上进行比赛。"]),
      card("volleyball-match-sets", "排球五局三胜", "室内排球通常采用五局三胜制，先赢得3局的队伍赢得整场比赛。比赛不一定需要打满5局。", "light-edit", "说明排球五局三胜制如何判定整场胜负。", ["cs-10-15-p25-volleyball-list"], ["采用五局三胜制，胜三局的队胜一场。"]),
      card("volleyball-set-scoring", "排球各局计分", "前四局先到25分且领先2分者胜；决胜局先到15分且领先2分者胜。达到目标分数但只领先1分时，比赛继续。", "synthesized", "区分排球前四局与决胜局的目标分数和获胜条件。", ["cs-10-15-p25-volleyball-list"], ["前四局先得25分且领先2分胜，决胜局先得15分且领先2分胜。"]),

      card("table-tennis-game-scoring", "乒乓球单局计分", "乒乓球一局先得11分者获胜；双方10比10后，必须继续比赛，直到一方领先2分。", "reuse", "说明乒乓球单局的目标分数和10平后的获胜条件。", ["cs-10-15-p25-table-tennis-list"], ["每局采用11分制；若比分10:10，需连续领先2分方可获胜。"]),
      card("table-tennis-match-format", "乒乓球整场赛制", "乒乓球一场比赛由奇数局组成，常见五局三胜或七局四胜。具体采用几局由赛事规程确定，不能固定按常规赛和决赛划分。", "synthesized", "说明乒乓球整场赛制的通用规则和赛事差异。", ["cs-10-15-p25-table-tennis-list"], ["一场比赛由奇数局组成，具体采用几局由赛事规程确定。"]),

      card("badminton-match-games", "羽毛球三局两胜", "羽毛球比赛通常采用三局两胜制，先赢得2局的一方赢得整场比赛。每局结束后，双方交换场地。", "reuse", "说明羽毛球三局两胜制和局间换场规则。", ["cs-10-15-p25-badminton-list"], ["羽毛球比赛通常采用三局两胜制，每局结束后交换场地。"]),
      card("badminton-game-scoring", "羽毛球单局计分", "羽毛球每局通常先得21分者胜。20比20后要领先2分才能获胜；如果打到29比29，先得第30分者胜。", "light-edit", "说明羽毛球单局在20平和29平后的获胜条件。", ["cs-10-15-p25-badminton-list"], ["每局先得21分者胜，20平需领先2分；若29平，则先到30分者胜。"]),
      card("badminton-decider-change", "羽毛球决胜局换场", "羽毛球决胜局中，当领先一方先得到11分时，双方交换场地。这次换场发生在决胜局进行过程中。", "light-edit", "说明羽毛球决胜局何时交换场地。", ["cs-10-15-p25-badminton-list"], ["决胜局第三局中一方达11分时交换场地。"]),

      card("snooker-ball-count", "斯诺克使用22个球", "斯诺克开局使用22个球，包括15个红球、6个彩球和1个白色母球。选手击打母球，使目标球按规则入袋得分。", "reuse", "准确说出斯诺克球的总数和组成。", ["cs-10-15-p25-snooker-list"], ["斯诺克使用22个球，包括15红球、6彩球和1白球。"]),
      card("snooker-red-colour-stage", "斯诺克红彩交替阶段", "台面还有红球时，选手先击打红球，再选择一个彩球。彩球合法入袋后放回原位，红球入袋后不再放回。", "light-edit", "说明斯诺克第一阶段红球与彩球的击打和回置规则。", ["cs-10-15-p25-snooker-list"], ["第一阶段交替击打红球与彩球，彩球入袋后放回原位，直至红球全部落袋。"]),
      card("snooker-colour-clearance", "斯诺克彩球清台顺序", "红球全部落袋后，按黄、绿、棕、蓝、粉、黑的顺序击打彩球。此阶段彩球入袋后不再放回。", "synthesized", "准确说出斯诺克红球清台后的彩球击打顺序。", ["cs-10-15-p25-snooker-list"], ["红球清台后，按黄、绿、棕、蓝、粉、黑依次击打，彩球不再放回。"]),
      card("snooker-values-147", "斯诺克分值与147分", "红球每个1分，黄、绿、棕、蓝、粉、黑依次为2至7分。常规局面下，连续完成15组红黑组合并清完彩球可得147分。", "synthesized", "说明斯诺克红球和彩球分值以及147分的构成。", ["cs-10-15-p25-snooker-list"], ["红球1分，彩球从黄2分至黑7分；15次红黑组合加所有彩球为147分。"]),
    ],
  }],
  exclusions: [],
  resolvedHolds: [
    {id:"olympic-ring-colour-continent",resolution:"corrected-source-and-card",cardIds:["olympic-rings-meaning"]},
    {id:"olympic-motto-1920-origin",resolution:"corrected-source-and-card",cardIds:["olympic-motto-history"]},
    {id:"paris-four-new-sports",resolution:"corrected-source-and-card",cardIds:["paris-additional-sports"]},
    {id:"marathon-event-types",resolution:"merged-into-corrected-card",cardIds:["marathon-distance"]},
    {id:"marathon-soldier-origin",resolution:"corrected-as-legend-and-card",cardIds:["marathon-name-history"]},
    {id:"volleyball-roster-twelve",resolution:"removed-non-general-roster-claim",cardIds:["volleyball-six-on-court"]},
    {id:"table-tennis-match-format",resolution:"corrected-source-and-card",cardIds:["table-tennis-match-format"]},
    {id:"snooker-shot-clock",resolution:"removed-competition-specific-claim",cardIds:["snooker-ball-count","snooker-red-colour-stage","snooker-colour-clearance","snooker-values-147"]},
  ],
};
