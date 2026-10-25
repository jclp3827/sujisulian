const golden = require("../../../miniprogram/subpackages/common-sense/models/guide-golden-sample");
const goldenPhysics = golden.groups.find((group) => group.pointId === "physics");
if (!goldenPhysics) throw new Error("黄金样例缺少 physics 知识组");

const PENDING_REVIEW = Object.freeze({
  admission: "expansion-candidate",
  sourceFidelity: "self-reviewed",
  noviceReadability: "pending-user-sampling",
  independentFactReview: "pending-independent-review",
});
const card = (id, title, explanation, productionMode, learningGoal, sourceUnitIds, sourceEvidence) => ({
  id, title, explanation, productionMode, learningGoal, sourceUnitIds, sourceEvidence,
  semanticRevision: 1, review: PENDING_REVIEW,
});

module.exports = {
  schemaVersion: 1,
  id: "common-sense-guide-expansion-batch-13",
  title: "知识导读扩库第 13 批：经典力学",
  status: "candidate",
  promotion: {
    strategy: "in-place-golden-promotion",
    sourceSampleId: golden.id,
    pointId: "physics",
    frozenCardIds: goldenPhysics.cards.map((item) => item.id),
  },
  purpose: "以黄金样例的五张经典力学卡为不可改写的种子，在同一知识组内补齐惯性应用、摩擦、杠杆、超重失重、浮力和生活力学。",
  groups: [{
    pointId: "physics",
    overview: "经典力学研究力与物体运动状态变化的关系。本组从力和牛顿三定律出发，再展开摩擦、杠杆、超重失重、浮力以及生活中的向心力和滑轮应用。",
    relation: "classification",
    cards: [
      ...goldenPhysics.cards,
      card("inertia-braking", "刹车时身体前倾的惯性解释", "汽车行驶时突然刹车，人的脚随车辆减速，上半身仍有保持原来运动状态的趋势，所以身体会向前倾。这体现惯性，不是受到向前的惯性力。", "light-edit", "说明车辆刹车时身体前倾的原因，并避免把惯性当作力。", ["cs-16-22-p8-newton-laws-list"], ["正文以汽车突然刹车时乘客身体向前倾说明惯性，并强调没有惯性力。"]),
      card("inertia-train-jump", "高铁内原地起跳仍落回原处", "匀速行驶的高铁内，人与车厢原先具有相同的水平速度。人原地起跳后仍保持这一水平运动状态，因此忽略空气阻力等影响时会落回车厢内原来的位置附近。", "synthesized", "说明匀速高铁内原地起跳仍落回原处的惯性原因。", ["cs-16-22-p8-newton-laws-list"], ["正文补充行驶的高铁上原地跳起，落地后仍在原来的位置。"]),
      card("friction-increase-examples", "自行车刹车和鞋底花纹怎样增大摩擦", "自行车刹车通过增大刹车片处的压力来增大摩擦；鞋底花纹通过增加接触面的粗糙程度来增大摩擦。两种做法对应不同的影响因素。", "synthesized", "区分增大压力和增加粗糙程度两种增摩擦方法。", ["cs-16-22-p8-p9-friction-list"], ["正文分别用自行车刹车和鞋面花纹说明增大压力、增加粗糙程度可以增大摩擦。"]),
      card("rolling-reduces-friction", "拉杆箱用滚动减小摩擦", "拉杆箱安装轮子后，把箱体与地面的滑动摩擦转变为滚动摩擦，从而更容易移动。它与把滚动改为滑动来增大摩擦的做法方向相反。", "light-edit", "说明拉杆箱轮子减小摩擦的原理。", ["cs-16-22-p8-p9-friction-list"], ["正文说明拉杆箱通过将滑动摩擦变为滚动摩擦来减小摩擦。"]),
      card("friction-supports-daily-life", "摩擦力维持行走和固定", "人行走、鞋带系紧以及螺丝钉固定物体都需要摩擦力。摩擦并非总是有害，应根据目标判断需要增大还是减小。", "light-edit", "说明摩擦力在行走和固定物体中的作用。", ["cs-16-22-p8-p9-friction-list"], ["正文列举鞋带系紧、螺丝钉和钉子固定物体以及人行走都需要摩擦力。"]),
      card("lever-equilibrium", "杠杆平衡条件", "杠杆平衡时满足动力×动力臂＝阻力×阻力臂。力臂是支点到力的作用线的垂直距离，比较杠杆是否省力要看两侧力臂，而不是只看杆的总长度。", "synthesized", "运用动力与阻力的力矩关系判断杠杆平衡。", ["cs-16-22-p9-lever-formula-list"], ["正文给出杠杆公式：动力×动力臂=阻力×阻力臂。"]),
      card("effort-saving-lever", "省力杠杆", "省力杠杆的动力臂长于阻力臂，因此平衡时所需动力较小。撬棍、扳手、钳子和开瓶器是正文列出的典型应用。", "reuse", "说明省力杠杆的力臂特点并识别典型工具。", ["cs-16-22-p9-lever-classification-table"], ["正文表格说明省力杠杆动力臂较长、动力较小，并列出撬棍、扳手、钳子、开瓶器等。"]),
      card("effort-costing-lever", "费力杠杆", "费力杠杆的动力臂短于阻力臂，因此平衡时需要较大动力，但常能换取更大的移动距离或操作便利。镊子、鱼竿和筷子是典型应用。", "light-edit", "说明费力杠杆的力臂特点并识别典型工具。", ["cs-16-22-p9-lever-classification-table"], ["正文表格说明费力杠杆动力臂较短、动力较大，并列出镊子、鱼竿和筷子等。"]),
      card("equal-arm-lever", "等臂杠杆", "等臂杠杆的动力臂等于阻力臂，平衡时动力与阻力大小相等。天平、跷跷板和定滑轮是正文列出的代表。", "reuse", "说明等臂杠杆的力臂和力的关系并识别代表装置。", ["cs-16-22-p9-lever-classification-table"], ["正文表格说明等臂杠杆两侧力臂相等，并列出天平、跷跷板、定滑轮。"]),
      card("lever-type-comparison", "三类杠杆怎样比较", "动力臂大于阻力臂时属于省力杠杆，小于阻力臂时属于费力杠杆，等于阻力臂时属于等臂杠杆。分类依据是力臂关系，不是工具名称本身。", "synthesized", "判断动力臂与阻力臂的关系并确定杠杆类型。", ["cs-16-22-p9-lever-classification-table"], ["正文按动力臂较长、较短或等于阻力臂区分省力、费力和等臂杠杆。"]),
      card("overweight-condition", "超重取决于向上加速度", "物体具有向上加速度时，支持物对它的作用力大于重力，表现为超重。向上加速和向下减速都具有向上加速度，因此都可能出现超重。", "synthesized", "判断加速度方向并识别超重状态。", ["cs-16-22-p9-overweight-weightlessness-list"], ["正文说明只要具有向上的加速度就处于超重状态，并列出向上加速或向下减速。"]),
      card("weightlessness-condition", "失重取决于向下加速度", "物体具有向下加速度时，支持力小于重力，表现为失重；完全失重是支持力降为零的特殊情况。判断失重应看加速度方向，不能只看物体正在上升还是下降。", "synthesized", "判断加速度方向并区分失重与完全失重。", ["cs-16-22-p9-overweight-weightlessness-list"], ["正文将向下加速的飞机、电梯和跳楼机列为失重现象，并把失重与重力进行比较。"]),
      card("elevator-apparent-weight", "电梯运动中的超重和失重", "电梯向上加速或向下减速时，人表现为超重；电梯向下加速或向上减速时，人表现为失重。匀速上升或匀速下降时加速度为零，不出现超重或失重。", "synthesized", "比较电梯四种变速状态下的超重与失重。", ["cs-16-22-p9-overweight-weightlessness-list"], ["正文以向上加速、向下减速说明超重，并以加速下降说明失重。"]),
      card("archimedes-buoyancy", "阿基米德浮力关系", "物体受到的浮力等于它排开液体所受的重力，可写为F浮＝ρ液V排g。浮力取决于液体密度和排开液体的体积等因素。", "light-edit", "说明浮力公式中液体密度和排液体积的作用。", ["cs-16-22-p9-p10-buoyancy-list"], ["正文给出浮力等于排开液体重量以及F浮=ρ液V排g。"]),
      card("buoyancy-motion-states", "浮力与重力决定上浮或下沉", "只考虑浮力和重力时，浮力大于重力，物体向上加速；浮力小于重力，物体向下加速；漂浮或悬浮处于平衡状态时，浮力等于重力。", "light-edit", "判断浮力与重力的大小关系并识别物体状态。", ["cs-16-22-p9-p10-buoyancy-list"], ["正文说明上浮时浮力大于重力，漂浮或悬浮时二者相等，下沉时浮力小于重力。"]),
      card("submarine-buoyancy", "潜水艇怎样上浮和下沉", "潜水艇完全浸没且排水体积不变时，所受浮力基本不变。它通过调节水舱中的水量改变自身重力，从而实现上浮、悬浮或下沉。", "light-edit", "说明潜水艇通过改变自身重力控制升沉。", ["cs-16-22-p9-p10-buoyancy-list"], ["正文说明潜水艇完全浸没时浮力不变，通过改变水舱水量调节自身重力。"]),
      card("rail-curve-centripetal", "铁路弯道外轨较高", "铁路弯道处外轨略高于内轨，使支持力产生指向弯道内侧的分力，为列车转弯提供所需向心力，并减轻车轮对外轨的横向挤压。", "light-edit", "说明铁路弯道外轨较高与向心力的关系。", ["cs-16-22-p10-life-mechanics-list"], ["正文说明弯道外轨略高于内轨，可提供指向内部的向心力并避免外轨受挤压变形。"]),
      card("flagpole-fixed-pulley", "旗杆顶部使用定滑轮", "旗杆顶部安装定滑轮可以改变拉力方向，使人在地面向下拉绳就能升起旗帜。理想定滑轮不省力，其主要作用是改变用力方向。", "synthesized", "说明旗杆使用定滑轮的主要作用。", ["cs-16-22-p10-life-mechanics-list"], ["正文指出升旗时最适合安装在旗杆顶部的简单机械是定滑轮。"]),
    ],
  }],
  exclusions: [
    ["astronaut-not-thrown-away", "太空行走不被甩掉的惯性解释", "该现象同时涉及共同轨道运动、初始速度和微重力环境，仅用惯性概括会遗漏关键条件，不适合作为简短基础卡。", "只有在正文补足轨道运动和相对速度条件后，才能作为独立航天力学知识点重新评估。", ["cs-16-22-p8-newton-laws-list"]],
    ["all-space-weightless", "太空中所有物体均处于失重状态", "失重取决于支持力和运动状态，不能只由所处空间位置决定；正文表述过宽，容易形成只要在太空就必然失重的错误判断。", "正文改为轨道飞行器及其中物体处于持续自由落体所产生的微重力状态后再重新评估。", ["cs-16-22-p9-overweight-weightlessness-list"]],
    ["motion-label-overweight", "只凭快速上升或飞机起飞判断超重", "超重由向上加速度决定，快速上升可能是匀速或减速，飞机起飞过程也需要明确所考察方向，不能只凭运动名称判断。", "正文示例补充明确的竖直加速度方向和观察对象后再重新评估。", ["cs-16-22-p9-overweight-weightlessness-list"]],
    ["ambiguous-lever-examples", "铁闸门、剪刀等固定归入单一杠杆类型", "工具的杠杆类型取决于支点、动力点和阻力点的位置，同名工具的结构与使用方式可能不同，固定归类会掩盖判断条件。", "以具体结构图标明三点位置后再按力臂关系判断，不再使用工具名称直接归类。", ["cs-16-22-p9-lever-classification-table"]],
    ["train-airflow-suction", "铁路桥附近被火车吸入的单一压强解释", "高速列车周围流场复杂，正文只用轨道内外压强差概括可能过度简化，也缺少安全距离和具体场景条件。", "取得铁路安全或流体力学权威资料并限定列车、位置和流场条件后再重新评估。", ["cs-16-22-p10-life-mechanics-list"]],
  ].map(([id, title, reason, requiredEvidence, sourceUnitIds]) => ({
    id, pointId: "physics", title, reason, requiredEvidence, sourceUnitIds,
  })),
};
