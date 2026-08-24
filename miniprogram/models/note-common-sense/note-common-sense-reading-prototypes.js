const prototypeDefinitions = {
  "administrative-reconsideration": {
    readingMeta: {
      label: "本页速记",
      takeaway: "行政复议先看是否必须先复议，再找复议机关；期限重点记60日申请、普通60日审结和最多延长30日。",
      focus: [
        { label: "申请期限", note: "知道行为后60日" },
        { label: "四类复议前置", note: "当场处罚、资源权属、不履职、信息公开" },
        { label: "普通程序", note: "60日，最多延长30日" },
        { label: "简易程序", note: "30日内决定" },
      ],
      route: ["范围与申请", "复议管辖", "复议前置", "审理与决定"],
      reviewTab: "knowledge",
      review: [
        "先判断案件是否属于复议前置。",
        "再按作出行为的机关确定复议管辖。",
        "最后核对申请、审查和决定三个期限。",
      ],
    },
    blocks: {
      "复议管辖": { mobileLayout: "cards", cardTitleColumn: 0 },
    },
  },
  microeconomics: {
    readingMeta: {
      label: "本页速记",
      takeaway: "先区分需求与需求量、供给与供给量，再用价格、收入和相关商品解释曲线移动；市场失灵是政府介入的典型理由。",
      focus: [
        { label: "需求量变化", note: "自身价格变化" },
        { label: "需求变化", note: "收入、偏好、预期等" },
        { label: "限价判断", note: "最高限价短缺，最低限价过剩" },
        { label: "市场失灵", note: "垄断、外部性、公共物品、信息不对称" },
      ],
      route: ["需求与供给", "弹性与效用", "市场结构与失灵"],
      reviewTab: "demand-supply",
      review: [
        "题目给价格变化，先判断是曲线上移动还是曲线整体移动。",
        "题目给政策价格，先和均衡价格比较，再判断短缺或过剩。",
        "题目问政府为什么介入，优先从市场失灵找依据。",
      ],
    },
    blocks: {
      "相关商品与收入": { mobileLayout: "cards", cardTitleColumn: 0 },
      "需求价格弹性": { mobileLayout: "cards", cardTitleColumn: 0 },
      "四类市场结构": { mobileLayout: "cards", cardTitleColumn: 0 },
      "市场失灵": { mobileLayout: "cards", cardTitleColumn: 0 },
    },
  },
  "late-qing-invasions": {
    readingMeta: {
      label: "本页速记",
      takeaway: "晚清主线是列强侵略不断加深、救亡探索逐步推进，最终在《辛丑条约》后完全陷入半殖民地半封建社会。",
      focus: [
        { label: "侵略开端", note: "1839虎门销烟，1842《南京条约》" },
        { label: "农民运动", note: "太平天国1851—1864" },
        { label: "自强求富", note: "洋务运动" },
        { label: "危机加深", note: "甲午、戊戌、辛丑" },
      ],
      route: ["鸦片战争", "太平天国", "洋务自强", "甲午至辛丑"],
      reviewTab: "knowledge",
      review: [
        "条约题：记侵略权益和历史影响。",
        "洋务题：记“中体西用”和军用、民用企业区分。",
        "变法与义和团题：记失败原因及《辛丑条约》的历史定位。",
      ],
    },
    blocks: {
      "晚清全章速查": {
        displayMode: "timeline",
        timelineItems: [
          { time: "1839—1842", title: "鸦片战争与《南京条约》", content: "1839虎门销烟；1842《南京条约》：割香港岛、赔2100万银元、五口通商、协定关税；林则徐开眼看世界、魏源《海国图志》。" },
          { time: "1851—1864", title: "太平天国运动", content: "1851金田起义、1853定都天京、1856天京事变、1864失败；纲领有《天朝田亩制度》《资政新篇》。" },
          { time: "1856—1860", title: "第二次鸦片战争", content: "签订《天津条约》《北京条约》；1860英法联军火烧圆明园；1858签订《瑷珲条约》。" },
          { time: "19世纪60—90年代", title: "洋务运动", content: "主张自强、求富和中体西用；建设军事工业、民用企业、近代海军，并创办京师同文馆等新式教育机构。" },
          { time: "1895—1901", title: "甲午至辛丑", content: "1895《马关条约》后有公车上书；1898百日维新、京师大学堂、戊戌六君子；义和团运动和八国联军侵华后，1901《辛丑条约》使中国完全陷入半殖民地半封建社会。" },
        ],
      },
    },
  },
  "poetry-ci-qu": {
    readingMeta: {
      label: "本页速记",
      takeaway: "词先按豪放、婉约分流派；元曲重点锁定四大家；明清戏曲抓名作和作者，不把王实甫、汤显祖混入元曲四大家。",
      focus: [
        { label: "豪放派", note: "苏轼、辛弃疾" },
        { label: "婉约派", note: "柳永、李清照" },
        { label: "元曲四大家", note: "关白马郑" },
        { label: "明清传奇", note: "牡丹亭、桃花扇" },
      ],
      route: ["宋词流派", "元曲四大家", "明清戏曲"],
      reviewTab: "knowledge",
      review: [
        "词派题：用“题材气势”区分豪放和婉约。",
        "四大家按“关白马郑”记忆，王实甫不是其中之一。",
        "看到《牡丹亭》《桃花扇》，优先联想汤显祖、孔尚任。",
      ],
    },
    blocks: {
      "宋词流派": { mobileLayout: "cards", cardTitleColumn: 0 },
      "元曲与戏剧": { mobileLayout: "cards", cardTitleColumn: 0 },
    },
  },
  physics: {
    readingMeta: {
      label: "本页速记",
      takeaway: "物理判断先锁定研究对象与条件：同一物体还是不同物体、是否有介质、比较力臂还是比较受力面积。",
      focus: [
        { label: "作用力与反作用力", note: "不同物体" },
        { label: "平衡力", note: "同一物体" },
        { label: "杠杆", note: "动力臂与阻力臂比较" },
        { label: "声音与电磁波", note: "声音需介质，电磁波可在真空传播" },
      ],
      route: ["力学", "杠杆与浮力", "光学", "声音、电磁与热"],
      reviewTab: "mechanics",
      review: [
        "先画对象：作用力与平衡力的最大区别在是否作用同一物体。",
        "杠杆题只比较两条力臂，不用比较力的大小。",
        "光、声、电磁题先判断传播方式和是否需要介质。",
      ],
    },
    blocks: {
      "杠杆分类": { mobileLayout: "cards", cardTitleColumn: 0 },
    },
  },
  "traditional-thought-ritual": {
    readingMeta: {
      label: "本页速记",
      takeaway: "先秦思想用“人物—主张”配对；年龄称谓按童年、女子、男子和通用年龄四组拆开记，更适合用卡片逐条回顾。",
      focus: [
        { label: "儒家", note: "孔孟荀；仁礼、仁政" },
        { label: "道家", note: "老庄；道法自然、无为" },
        { label: "豆蔻与弱冠", note: "十三四女子；二十男子" },
        { label: "而立至古稀", note: "30、40、50、60、70" },
      ],
      route: ["先秦思想", "年龄称谓", "礼仪制度"],
      reviewTab: "thought-ritual",
      review: [
        "学派题先锁定代表人物，再核对核心主张。",
        "称谓题先判断对象：女子、男子还是通用。",
        "通用年龄按三十而立、四十不惑、五十知天命、六十花甲、七十古稀顺序回忆。",
      ],
    },
    blocks: {
      "年龄称谓": { mobileLayout: "cards", cardVariant: "memory", cardTitleColumn: 0 },
    },
  },
}

function applyBlockPresentation(point, presentation = {}) {
  ;(point.tabs || []).forEach((tab) => {
    ;(tab.blocks || []).forEach((block) => {
      const config = presentation[block.label]
      if (config) Object.assign(block, config)
    })
  })
}

function getBlockTypeHint(block = {}) {
  if (block.type === 'table') return '对照记忆'
  if (block.type === 'compare') return '辨析对比'
  if (block.type === 'steps') return '步骤梳理'
  if (block.type === 'image-note') return '图示速记'
  if (block.type === 'mind-map') return '结构串联'
  if (block.type === 'tip') return '易错提醒'
  if (block.type === 'formula') return '规则速查'
  return '核心要点'
}

function getPointBlocks(point = {}) {
  return (point.tabs || []).flatMap((tab) => tab.blocks || [])
}

function buildAutoReadingMeta(point) {
  const blocks = getPointBlocks(point)
  const focus = blocks
    .filter((block) => block.label || block.title)
    .slice(0, 4)
    .map((block) => ({
      label: block.label || block.title,
      note: getBlockTypeHint(block),
    }))

  const route = (point.tabs || []).map((tab) => tab.title).filter(Boolean).slice(0, 4)
  const review = focus.slice(0, 3).map((item) => `回顾“${item.label}”：${item.note}。`)

  return {
    label: '学习导读',
    takeaway: point.summary || point.preview || point.title,
    focus,
    route,
    reviewTab: point.tabs?.[0]?.id || '',
    review,
  }
}

function shouldUseMobileTableCards(block = {}) {
  if (block.type !== 'table' || block.mobileLayout) return false
  const columnCount = (block.columns || []).length
  const rowCount = (block.rows || []).length
  return columnCount >= 4 || (columnCount >= 3 && rowCount >= 5)
}

function applyAutomaticTablePresentation(point) {
  getPointBlocks(point).forEach((block) => {
    if (!shouldUseMobileTableCards(block)) return
    block.mobileLayout = 'cards'
    block.cardTitleColumn = 0
  })
}

module.exports = function applyCommonSenseReadingPrototypes(points) {
  ;(points || []).forEach((point) => {
    const definition = prototypeDefinitions[point.id]
    if (definition) {
      if (!point.sourceAuditStatus) point.readingMeta = { ...definition.readingMeta, isPrototype: true }
      applyBlockPresentation(point, definition.blocks)
    } else if (!point.readingMeta) {
      point.readingMeta = buildAutoReadingMeta(point)
    }
    applyAutomaticTablePresentation(point)
  })
}
